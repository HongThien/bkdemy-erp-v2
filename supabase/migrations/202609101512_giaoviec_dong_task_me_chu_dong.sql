-- ============================================================================
-- 202609101512 — giaoviec_dong_task_me_chu_dong
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy phản ánh 10/09: task mẹ đang TỰ đóng (trigger 202608181833) ngay khi
--   100% task con HIỆN CÓ đạt — nhưng "100% con hiện có" ≠ "việc đã xong":
--   nhiều việc còn cần tách thêm task con mà nhân sự CHƯA NGHĨ KỊP lúc tách đợt
--   đầu. Tự đóng sớm làm mẹ đóng trong khi việc thực tế còn dở. Quyết: bỏ tự
--   động, leader chủ động bấm đóng khi chắc chắn không còn con nào cần tách nữa.
--   Vẫn giữ điều kiện an toàn "100% con hiện có phải đạt" — chỉ bỏ phần TỰ ĐỘNG,
--   không nới lỏng cho đóng khi còn con dở (CEO xác nhận giữ nguyên điều kiện).
--
--   Chuyển từ trigger (auto) → function RPC leader tự gọi (đúng luật §2.0: "hàm
--   ghi có tính toán = RPC transactional", tính weighted-average tiến độ/chất
--   lượng từ con + ghi trong CÙNG transaction). nghiem_thu_nguon đổi 'tu_dong' →
--   'nguoi' — đúng hơn ngữ nghĩa (giờ luôn do người bấm, không còn nhánh máy tự).
--
-- MẤT GÌ (Luật xoá — CEO đã gật xác nhận hướng này):
--   · Trigger `trg_giaoviec_auto_dong_task_me` trên bảng `viec` — mất hành vi TỰ
--     ĐỘNG đóng mẹ khi 100% con đạt. Không mất dữ liệu: task mẹ đã tự đóng trước
--     đây giữ nguyên trạng thái/số liệu đã ghi, chỉ các lần đóng SAU migration
--     này mới cần leader bấm tay.
--   · Function `giaoviec_auto_dong_task_me()` — thay bằng `fn_giaoviec_dong_task_me`
--     (logic tính toán y hệt, chỉ đổi từ "trigger tự gọi" thành "leader gọi qua RPC").
-- ============================================================================

drop trigger if exists trg_giaoviec_auto_dong_task_me on viec;
drop function if exists public.giaoviec_auto_dong_task_me();

-- invoker (mặc định) + RLS `viec_member_all` (mọi thành viên, for all) — leader
-- gọi RPC này dưới đúng quyền họ đã có sẵn để tự UPDATE `viec` (như nghiemThu()
-- đang làm bằng update() thẳng), không cần security definer.
create or replace function public.fn_giaoviec_dong_task_me(p_me_id uuid, p_ghi_chu text default null)
returns void language plpgsql as $$
declare
  tong int;
  dat  int;
  td   numeric;
  cl   numeric;
begin
  select count(*), count(*) filter (where trang_thai = 'dat')
    into tong, dat
    from viec where task_me_id = p_me_id;

  if tong = 0 then
    raise exception 'Cụm chưa có task con nào — chưa có gì để đóng.';
  end if;
  if dat < tong then
    raise exception 'Còn % / % task con chưa đạt — đóng hết con trước khi đóng cụm.', tong - dat, tong;
  end if;

  select
    round((sum(khoi_luong * coalesce(tien_do, 0))   / nullif(sum(khoi_luong), 0))::numeric, 1),
    round((sum(khoi_luong * coalesce(chat_luong, 0)) / nullif(sum(khoi_luong), 0))::numeric, 1)
    into td, cl
    from viec where task_me_id = p_me_id and trang_thai = 'dat';

  update viec set
    trang_thai         = 'dat',
    tien_do             = td,
    chat_luong          = cl,
    phan_tram           = round((0.3 * coalesce(td, 0) + 0.7 * coalesce(cl, 0))::numeric, 1),
    ngay_nop            = coalesce(ngay_nop, (now() at time zone 'Asia/Ho_Chi_Minh')::date),
    nghiem_thu_at       = now(),
    nghiem_thu_nguon    = 'nguoi',
    ghi_chu_nghiem_thu  = coalesce(nullif(trim(p_ghi_chu), ''), ghi_chu_nghiem_thu)
  where id = p_me_id and trang_thai <> 'dat';

  if not found then
    raise exception 'Cụm đã đóng rồi hoặc không tìm thấy task mẹ.';
  end if;
end $$;

revoke all on function public.fn_giaoviec_dong_task_me(uuid, text) from public;
grant execute on function public.fn_giaoviec_dong_task_me(uuid, text) to authenticated;
