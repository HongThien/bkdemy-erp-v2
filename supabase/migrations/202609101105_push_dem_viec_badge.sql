-- ============================================================================
-- 202609101105 — push_dem_viec_badge
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Badge số trên ICON app (kiểu Zalo/Messenger) — CEO 10/09: "ko mở thì vẫn phải
--   có số báo chứ mở rồi thì số quan trọng đéo gì nữa". Bản đầu (chiều 10/09) chỉ
--   gọi navigator.setAppBadge() lúc app ĐANG MỞ — sai trọng tâm, App đóng thì badge
--   đứng im. Sửa: số THẬT phải đi kèm payload Web Push (đã có sẵn cho pt/ta, 10:30/
--   23:30), service worker nhận push thì set badge luôn — không cần mở app.
--
--   Cron chạy bằng anon key (không có phiên đăng nhập) nên KHÔNG dùng được các hàm
--   "của tôi" hiện có (fn_pt_viec_hom_nay, fn_btyeu_viec_cua_toi... đều đọc qua
--   jwt_uid()/auth.uid()). Thay vì viết lại logic nghiệp vụ lần 2 (§2.0 cấm công thức
--   sống 2 nơi), 2 hàm mới ở đây CHỈ đếm bằng cách GỌI LẠI đúng hàm LÕI đã có, truyền
--   thẳng nhan_su_id thay vì suy từ phiên đăng nhập:
--     - pt: fn_pt_viec_can_cap_nhat(p_ns) — hàm LÕI có sẵn từ mig 202609051300, vốn
--       đã nhận p_ns trực tiếp, không cần đổi gì ở đó.
--     - ta buổi thường: fn_viec_buoi_thuong(null,null,true) — p_tat_ca=true đã có sẵn
--       (trả TẤT CẢ nhân sự), chỉ cần gom nhóm theo nhan_su_id.
--     - ta bổ trợ yếu: fn_btyeu_viec_cua_toi() KHÔNG có lối vào theo nhan_su_id (chỉ
--       đọc _btyeu_my_ns() qua phiên) — tách LÕI mới fn_btyeu_dem(p_ns) giữ NGUYÊN VĂN
--       2 điều kiện lọc (ca + retest) của hàm gốc, chỉ đổi "đếm" thay vì "liệt kê".
--       Hàm gốc KHÔNG bị đổi — không rủi ro hành vi màn hiện tại.
--   Cả 2 hàm đếm đều secret-gated (push_cron) + security definer, granted anon —
--   ĐÚNG khuôn fn_pt_push_danh_sach đã có, không đẻ cơ chế bảo mật mới.
--
--   fn_pt_push_danh_sach cũng thiếu nhan_su_id trong kết quả trả về (chỉ có địa chỉ
--   thiết bị) — cron cần cột này để khớp đúng số đếm với đúng thiết bị. Sửa TẠI CHỖ
--   (drop rồi tạo lại đúng khuôn migration 202609061913 đã làm khi thêm p_app).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   `drop function fn_pt_push_danh_sach(text, text)` rồi tạo lại NGAY DƯỚI cùng chữ ký
--   input, chỉ THÊM 1 cột nhan_su_id vào output — không mất khả năng gọi cũ (2 file cron
--   hiện tại chỉ đọc d.id/d.endpoint/d.p256dh/d.auth, thêm cột không phá gì). Không xoá
--   dữ liệu, không xoá hàm nào khác.
-- ============================================================================

-- ── LÕI mới: đếm bổ trợ yếu cho 1 nhan_su_id bất kỳ (tách từ fn_btyeu_viec_cua_toi,
--    2 điều kiện lọc giữ NGUYÊN VĂN — hàm gốc không đổi) ──
create or replace function public.fn_btyeu_dem(p_ns uuid)
returns integer
language sql stable security definer set search_path = public as $$
  with adm as (select coalesce((select la_admin_he_thong from nhan_su where id = p_ns), false) as v),
  today as (select public._btyeu_today() as d),
  ca as (
    select count(*) as n
    from buoi_hoc b
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
    join hoc_sinh h on h.id = hh.hoc_sinh_id
    cross join adm cross join today
    where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo'
      and (adm.v or b.nguoi_day_tg = p_ns)
      and b.ngay <= today.d + 7
      and (b.danh_gia_xong_at is null or b.ngay = today.d)
  ),
  rt as (
    select count(*) as n
    from bai_test bt
    join lop l on l.id = bt.lop_id
    join hoc_sinh h on h.id = bt.hoc_sinh_id
    left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id
    cross join adm cross join today
    where bt.loai = 'retest' and bt.trang_thai = 'mo' and bt.ngay <= today.d
      and (bl.trang_thai is distinct from 'da_nop')
      and (adm.v or exists (select 1 from phan_cong_lop pc where pc.lop_id = bt.lop_id and pc.nhan_su_id = p_ns and pc.vai_tro = 'tg'))
  )
  select (select n from ca) + (select n from rt)
$$;
revoke all on function public.fn_btyeu_dem(uuid) from public;
grant execute on function public.fn_btyeu_dem(uuid) to authenticated;

-- ── CRON: danh sách thiết bị (SỬA TẠI CHỖ — thêm nhan_su_id để cron khớp số đếm) ──
drop function if exists public.fn_pt_push_danh_sach(text, text);

create or replace function public.fn_pt_push_danh_sach(p_secret text, p_app text default 'pt')
returns table (id uuid, endpoint text, p256dh text, auth text, nhan_su_id uuid)
language plpgsql stable security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return query
  select d.id, d.endpoint, d.p256dh, d.auth, d.nhan_su_id
  from push_dang_ky d
  join nhan_su ns on ns.id = d.nhan_su_id
  where ns.trang_thai = 'dang_lam'
    and d.loi_ma is distinct from 410
    and d.app = coalesce(p_app, 'pt')
  order by d.created_at;
end $$;
revoke all on function public.fn_pt_push_danh_sach(text, text) from public;
grant execute on function public.fn_pt_push_danh_sach(text, text) to anon, authenticated;

-- ── CRON: số việc cần làm CỦA TỪNG NGƯỜI đã đăng ký push app pt ──
create or replace function public.fn_pt_push_dem(p_secret text)
returns table (nhan_su_id uuid, so_viec integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return query
  select ns.id,
    ( (select count(*) from public.fn_pt_viec_can_cap_nhat(ns.id) v where not v.da_cap_nhat_hom_nay)
    + (select count(*) from viec where nguoi_giao_id = ns.id and trang_thai = 'cho_nghiem_thu')
    )::integer as so_viec
  from (select distinct d.nhan_su_id as id from push_dang_ky d where d.app = 'pt') ns;
end $$;
revoke all on function public.fn_pt_push_dem(text) from public;
grant execute on function public.fn_pt_push_dem(text) to anon, authenticated;

-- ── CRON: số việc cần làm CỦA TỪNG NGƯỜI đã đăng ký push app ta (buổi thường + bổ trợ) ──
create or replace function public.fn_ta_push_dem(p_secret text)
returns table (nhan_su_id uuid, so_viec integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return query
  with ns as (select distinct d.nhan_su_id as id from push_dang_ky d where d.app = 'ta'),
  buoi as (
    select v.nhan_su_id as id, count(*) as n
    from public.fn_viec_buoi_thuong(null, null, true) v
    where v.dong_at is null
    group by v.nhan_su_id
  )
  select ns.id, (coalesce(b.n, 0) + coalesce(public.fn_btyeu_dem(ns.id), 0))::integer as so_viec
  from ns left join buoi b on b.id = ns.id;
end $$;
revoke all on function public.fn_ta_push_dem(text) from public;
grant execute on function public.fn_ta_push_dem(text) to anon, authenticated;
