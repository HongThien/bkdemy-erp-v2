-- ============================================================================
-- 202608181833 — giaoviec_auto_dong_task_me
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Story mới (CEO 08-18): task TO giờ có thể GIAO CHO 1 NGƯỜI + deadline như
--   task thường (không còn bắt "task mẹ = không ai làm" như trước) — người đó
--   tự TÁCH TASK CON (task_me_id, cơ chế đã có từ mig 202607311524) và giao lại
--   cho người khác. CEO chốt: task mẹ KHÔNG có nút "hoàn thành" riêng khi đã có
--   con — tự chuyển 'dat' khi 100% con 'dat' (so_con_dat === so_con), tiến độ/
--   chất lượng mẹ = DERIVE (bình quân gia quyền theo khối_lượng con), đúng ghi
--   chú bất biến "Tiến độ/khối lượng mẹ = DERIVE từ con" đã ghi ở mig
--   202607311524 nhưng CHƯA bao giờ cài đặt (mẹ cũ không có PIC nên chưa cần).
--
--   Trigger đặt Ở DB (không phải JS) — đúng luật CLAUDE §4 "mọi đổi state ghi
--   vết bắt buộc, trigger ở DB", và để healthy dù ai cập nhật `viec` từ đâu
--   (app/SQL editor/script), không phụ thuộc app có gọi đúng hàm JS hay không.
--
--   Con 'huy'/'chuyen' KHÔNG tính là "xong" cho công thức này — literal đúng
--   CEO chốt "100% con ĐẠT" (không phải "100% con ĐÃ ĐÓNG"). Nếu 1 con bị huỷ,
--   mẹ ở lại mở — leader tự huỷ/xử mẹ tay (hành động huỷ mẹ đã có sẵn, không
--   đụng ở đây). Chấp nhận đánh đổi này (thà kẹt còn hơn tự đóng sai).
--
--   Hiệu suất KHÔNG cần sửa: tinhHieuSuatThang() (giaoviec.ts) đã lọc "leaf
--   only" theo CẤU TRÚC (loại bỏ mọi id xuất hiện như task_me_id của dòng khác)
--   — không phụ thuộc nguoi_lam_id null hay không, nên tự đúng với task mẹ CÓ
--   người làm.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Thêm 1 function + 1 trigger mới (`create or replace` /
--   `drop trigger if exists` cho idempotent — migrate.mjs không có bảng
--   tracking nên có thể chạy lại file này).
-- ============================================================================

create or replace function public.giaoviec_auto_dong_task_me() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  me_id uuid := new.task_me_id;
  tong  int;
  dat   int;
  td    numeric;
  cl    numeric;
begin
  if me_id is null then
    return new;   -- không phải con (task lẻ, hoặc chính task mẹ vừa được auto-đóng bên dưới — cây chỉ 2 tầng)
  end if;

  select count(*), count(*) filter (where trang_thai = 'dat')
    into tong, dat
    from viec where task_me_id = me_id;

  if tong > 0 and tong = dat then
    select
      round((sum(khoi_luong * coalesce(tien_do, 0))   / nullif(sum(khoi_luong), 0))::numeric, 1),
      round((sum(khoi_luong * coalesce(chat_luong, 0)) / nullif(sum(khoi_luong), 0))::numeric, 1)
      into td, cl
      from viec where task_me_id = me_id and trang_thai = 'dat';

    update viec set
      trang_thai         = 'dat',
      tien_do             = td,
      chat_luong          = cl,
      phan_tram           = round((0.3 * coalesce(td, 0) + 0.7 * coalesce(cl, 0))::numeric, 1),
      ngay_nop            = coalesce(ngay_nop, (now() at time zone 'Asia/Ho_Chi_Minh')::date),
      nghiem_thu_at       = now(),
      nghiem_thu_nguon    = 'tu_dong',
      ghi_chu_nghiem_thu  = coalesce(ghi_chu_nghiem_thu, '') || '[tự đóng: 100% task con đã đạt]'
    where id = me_id and trang_thai <> 'dat';
  end if;

  return new;
end $$;

drop trigger if exists trg_giaoviec_auto_dong_task_me on viec;
create trigger trg_giaoviec_auto_dong_task_me
  after update of trang_thai on viec
  for each row
  when (new.trang_thai = 'dat' and old.trang_thai is distinct from 'dat')
  execute function public.giaoviec_auto_dong_task_me();
