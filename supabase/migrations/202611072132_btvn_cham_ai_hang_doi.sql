-- CHẤM BTVN TỰ ĐỘNG — CHẾ ĐỘ HÀNG ĐỢI (CEO chọn 07/11/2026, "cách 2"): chưa dùng API key Claude.
-- TA bấm "Gửi chấm" ⇒ ghi 1 YÊU CẦU (sự kiện thật: ai, lúc nào). Máy CEO chạy Claude Code định kỳ
-- (skill cham-btvn-hang-doi) lấy các yêu cầu CHƯA có lần chấm mới hơn ⇒ chấm ⇒ ghi gợi ý bằng
-- fn_btvn_ai_ghi (mig 202611071647) ⇒ TA xác nhận như cũ (fn_btvn_ai_chot).
-- "Đang chờ chấm" KHÔNG lưu thành cột trạng thái: suy ra = có yêu cầu mà chưa có btvn_ai_lan nào tạo
-- SAU yêu cầu đó (pure-derive, CLAUDE.md §4). Gửi lại = cập nhật yeu_cau_at (giữ 1 dòng / HS×buổi).
-- Khi chuyển sang API key: app gọi Edge Function btvn-cham-ai thay vì fn_btvn_ai_yeu_cau, phần còn lại giữ nguyên.

create table if not exists btvn_ai_yeu_cau (
  buoi_hoc_id  uuid not null references buoi_hoc(id),
  hoc_sinh_id  uuid not null references hoc_sinh(id),
  yeu_cau_at   timestamptz not null default now(),
  yeu_cau_boi  uuid default public.jwt_uid(),
  primary key (buoi_hoc_id, hoc_sinh_id)
);
alter table btvn_ai_yeu_cau enable row level security;
drop policy if exists btvn_ai_yeu_cau_member_read on btvn_ai_yeu_cau;
create policy btvn_ai_yeu_cau_member_read on btvn_ai_yeu_cau for select to authenticated using (public.la_thanh_vien());

-- TA gửi bài vào hàng đợi chấm (phải có ảnh). Gửi lại khi đã chấm ⇒ máy chấm lại từ đầu.
create or replace function public.fn_btvn_ai_yeu_cau(p_buoi_hoc_id uuid, p_hoc_sinh_id uuid)
returns timestamptz language plpgsql security definer set search_path = public as $$
declare v timestamptz;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  if not exists (select 1 from btvn_nop_anh where buoi_hoc_id = p_buoi_hoc_id and hoc_sinh_id = p_hoc_sinh_id) then
    raise exception 'Chưa có ảnh bài làm — thêm ảnh trước khi gửi chấm.';
  end if;
  insert into btvn_ai_yeu_cau (buoi_hoc_id, hoc_sinh_id, yeu_cau_at, yeu_cau_boi)
  values (p_buoi_hoc_id, p_hoc_sinh_id, now(), public.jwt_uid())
  on conflict (buoi_hoc_id, hoc_sinh_id) do update set yeu_cau_at = now(), yeu_cau_boi = public.jwt_uid()
  returning yeu_cau_at into v;
  return v;
end $$;
revoke execute on function public.fn_btvn_ai_yeu_cau(uuid, uuid) from public, anon;
grant execute on function public.fn_btvn_ai_yeu_cau(uuid, uuid) to authenticated;

-- Trạng thái chấm máy theo HS ở 1 buổi (badge danh sách + khung chấm):
--   cho_cham = có yêu cầu và chưa có lần chấm nào tạo sau yêu cầu · chot = lần mới nhất đã TA xác nhận.
create or replace function public.fn_btvn_ai_trang_thai(p_buoi_hoc_id uuid)
returns table (hoc_sinh_id uuid, yeu_cau_at timestamptz, lan_moi_at timestamptz, cho_cham boolean, chot boolean)
language sql stable security definer set search_path = public as $$
  with lan as (
    select distinct on (l.hoc_sinh_id) l.hoc_sinh_id, l.created_at, l.chot_at
    from btvn_ai_lan l where l.buoi_hoc_id = p_buoi_hoc_id
    order by l.hoc_sinh_id, l.created_at desc
  )
  select coalesce(y.hoc_sinh_id, lan.hoc_sinh_id), y.yeu_cau_at, lan.created_at,
         (y.yeu_cau_at is not null and (lan.created_at is null or lan.created_at < y.yeu_cau_at)),
         (lan.chot_at is not null and (y.yeu_cau_at is null or lan.created_at >= y.yeu_cau_at))
  from (select * from btvn_ai_yeu_cau where buoi_hoc_id = p_buoi_hoc_id) y
  full join lan on lan.hoc_sinh_id = y.hoc_sinh_id
  where public.la_thanh_vien()
$$;
revoke execute on function public.fn_btvn_ai_trang_thai(uuid) from public, anon;
grant execute on function public.fn_btvn_ai_trang_thai(uuid) to authenticated;

-- Hàng đợi cho máy chấm (script scripts/btvn-ai/hang-doi.mjs, chạy bằng role ghi — không có JWT):
-- yêu cầu chưa có lần chấm mới hơn, cũ nhất trước. Không grant cho authenticated (app không cần).
create or replace view public.v_btvn_ai_hang_doi as
  select y.buoi_hoc_id, y.hoc_sinh_id, y.yeu_cau_at, y.yeu_cau_boi, b.ngay, l.ten_lop, l.khoi, l.mon, h.ho_ten
  from btvn_ai_yeu_cau y
  join buoi_hoc b on b.id = y.buoi_hoc_id
  join lop l on l.id = b.lop_id
  join hoc_sinh h on h.id = y.hoc_sinh_id
  where not exists (select 1 from btvn_ai_lan a where a.buoi_hoc_id = y.buoi_hoc_id and a.hoc_sinh_id = y.hoc_sinh_id
                    and a.created_at >= y.yeu_cau_at)
  order by y.yeu_cau_at;
revoke all on public.v_btvn_ai_hang_doi from public, anon, authenticated;
