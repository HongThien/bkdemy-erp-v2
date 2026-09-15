-- ============================================================================
-- 202609101110 — ta_push_dem_dung_3_nghiep_vu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Tự soát lại fn_ta_push_dem (mig 202609101105, chưa deploy/gửi push lần nào) TRƯỚC khi
--   báo xong — phát hiện sai: TaHome.tsx CHỈ tính tab 'ingame'/'et'/'btvn' vào "canLam"
--   (badge của app TA) — `const t = all.filter(x => x.tab === 'ingame' || 'et' || 'btvn')`.
--   fn_viec_buoi_thuong(null,null,true) trả CẢ tab 'danhgia' (việc GV) và 'mt' (việc trưởng
--   khối) — 1 người vừa dạy TA vừa có vai GV/trưởng khối ở lớp khác sẽ bị CỘNG NHẦM việc
--   không thuộc app TA vào số badge. Thêm đúng 1 điều kiện lọc tab cho khớp app thật.
--
--   Bổ trợ (fn_btyeu_dem) không đổi — không dính lỗi này.
--
--   ⚠ Biết trước, chưa sửa: chưa tính task "duyệt HS báo sai" (baosai) — task đó KHÔNG có
--   trong fn_viec_buoi_thuong, tính riêng ở client (gami.ts) từ bai_test_report lọc theo lớp
--   TA đứng. Badge app TA vì vậy có thể THẤP hơn số thật một chút với TA có HS báo sai đang
--   chờ duyệt — nói rõ ra thay vì đoán, không âm thầm coi như đã xong (§1.5).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Sửa TẠI CHỖ đúng 1 điều kiện lọc trong fn_ta_push_dem (create or replace,
--   cùng chữ ký, không đổi hàm nào khác).
-- ============================================================================

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
      and v.tab in ('ingame', 'et', 'btvn')   -- ĐÚNG 3 nghiệp vụ app TA hiện (TaHome.tsx dòng lọc `all.filter`)
    group by v.nhan_su_id
  )
  select ns.id, (coalesce(b.n, 0) + coalesce(public.fn_btyeu_dem(ns.id), 0))::integer as so_viec
  from ns left join buoi b on b.id = ns.id;
end $$;
revoke all on function public.fn_ta_push_dem(text) from public;
grant execute on function public.fn_ta_push_dem(text) to anon, authenticated;
