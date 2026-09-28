-- ============================================================================
-- 202609281754 — rank_ghe_than_theo_diem_tich_luy
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 28/09: "rank God phải hết năm mới có" · "ghế đấy phải đạt đủ điểm tích luỹ, điểm tích theo năm, mỗi năm reset" ·
--   "không phải hạng 1, mà là phải đủ điều kiện điểm. Nên có thể không có God luôn".
--   ⇒ God of War / Supreme God KHÔNG còn là ghế (top %/hạng 1/phong độ) mà là BẬC 9 / 10 thuần theo ĐIỂM TÍCH LUỸ trong mùa,
--      như 8 bậc dưới. Đủ điểm thì lên, đã lên không tụt trong mùa; không ai đủ thì không có thần.
--   Ngưỡng co ×0,875 (= 10,5 / 12): bản cũ tính cho 12 tháng có điểm, năm học thật chỉ tháng 7 → giữa tháng 5 (Thùy: giữa tháng 5
--   nghỉ hè). Điểm tối đa cả năm Toán = 3.000 × 10,5 = 31.500 ⇒ Emperor 25.725 = 82% tối đa năm.
--   Ngưỡng thần (CTO đề xuất, chờ Thùy chỉnh số): God of War = 90% tối đa năm (hệ số 9,45 = 28.350) · Supreme God = 96% (10,08 = 30.240).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không. Đổi hệ số rank_bac, nới CHECK bac 1..8 → 1..10, thêm 2 dòng bậc thần; thay thân fn_rank_mua (cùng chữ ký).
--   Cột god_top_pct / god_phong_do / supreme_phong_do để nguyên, không còn dùng.
-- ============================================================================
update rank_bac set he_so = round(he_so * 0.875, 4);
alter table rank_bac drop constraint if exists rank_bac_bac_check;
alter table rank_bac add constraint rank_bac_bac_check check (bac between 1 and 10);
insert into rank_bac
select m.mon, b.bac, b.ten, b.he_so from (values ('Toán'), ('KHTN')) m(mon),
  (values (9::smallint, 'God of War', 9.45), (10, 'Supreme God', 10.08)) b(bac, ten, he_so)
on conflict do nothing;
comment on table rank_bac is '10 bậc theo ĐIỂM TÍCH LUỸ trong mùa (1–8 có 3 sao; 9 God of War, 10 Supreme God — thần, có thể không ai đạt). Ngưỡng = he_so × diem_toi_da_thang.';

create or replace function public.fn_rank_mua(p_mon text, p_khoi text default null, p_ngay date default null)
returns table(hoc_sinh_id uuid, ho_ten text, ma_hs text, lop_id uuid, ten_lop text, khoi text,
              diem_mua integer, bac smallint, ten_bac text, sao smallint, nguong_bac integer, nguong_sau integer,
              ghe text, hang_khoi integer, so_em_khoi integer, phong_do numeric)
language plpgsql stable as $$
-- plpgsql để tính mùa / tháng TRƯỚC rồi gọi fn_rank_su_kien bằng hằng: truyền cột CTE vào hàm SQL làm planner
-- mất inline ⇒ 35 s thay vì ~0,2 s (đo 28/09).
declare
  v_d date := coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date);
  v_tu text; v_den text;
begin
  select m.thang_dau, least(m.thang_cuoi, to_char(v_d, 'YYYY-MM')) into v_tu, v_den
  from gami_mua m where to_char(v_d, 'YYYY-MM') between m.thang_dau and m.thang_cuoi limit 1;
  if v_tu is null then return; end if;
  return query
  with nay as (select v_d as d),
  mua as (select v_tu as thang_dau),
  cfg as (select * from rank_cau_hinh where mon = p_mon),
  bac as (select rb.bac, rb.ten, round(rb.he_so * cfg.diem_toi_da_thang)::int as nguong from rank_bac rb, cfg where rb.mon = p_mon),
  roster as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop, l.khoi
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and (p_khoi is null or l.khoi = p_khoi)
    order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  diem as (
    select s.hoc_sinh_id, sum(s.diem)::int as d
    from public.fn_rank_su_kien(p_mon, v_tu, v_den) s
    where s.ngay <= v_d
    group by s.hoc_sinh_id
  ),
  -- Mẫu số phong độ: điểm tối đa CÓ THỂ kiếm tới hôm nay. Tháng đã qua: đủ phần ET+BTVN+Thử thách;
  -- tháng đang chạy: theo tỉ lệ ngày. Phần MT (100 × hệ số) chỉ cộng khi cửa sổ MT tháng đó đã đóng (10/T+1).
  mau as (
    select sum(
             (cfg.diem_toi_da_thang - 100 * cfg.mt_he_so)
               * case when (g.d + interval '1 month')::date <= nay.d then 1.0
                      else (nay.d - g.d + 1)::numeric / extract(day from (g.d + interval '1 month' - interval '1 day'))::numeric end
             + case when nay.d >= (g.d + interval '1 month' + interval '9 days')::date then 100 * cfg.mt_he_so else 0 end
           ) as toi_da
    from mua, nay, cfg,
         generate_series((mua.thang_dau || '-01')::date, date_trunc('month', nay.d)::date, interval '1 month') g0(x)
         cross join lateral (select g0.x::date as d) g
  ),
  r as (
    select ro.*, coalesce(di.d, 0) as dm,
           rank() over (partition by ro.khoi order by coalesce(di.d, 0) desc)::int as hk,
           count(*) over (partition by ro.khoi)::int as sk
    from roster ro left join diem di on di.hoc_sinh_id = ro.hoc_sinh_id
  )
  select r.hoc_sinh_id, hs.ho_ten, hs.ma_hs, r.lop_id, r.ten_lop, r.khoi, r.dm,
         b.bac, b.ten,
         case when b.bac >= 9 then 0 else least(3, 1 + floor(3.0 * (r.dm - b.nguong) / nullif(coalesce(bs.nguong, b.nguong + (b.nguong - bt.nguong)) - b.nguong, 0))) end::smallint,
         b.nguong, bs.nguong,
         case when b.bac >= 9 then b.ten end,
         r.hk, r.sk, round(r.dm / nullif(mau.toi_da, 0), 3)
  from r
  join hoc_sinh hs on hs.id = r.hoc_sinh_id
  cross join cfg cross join mau
  cross join lateral (select * from bac where bac.nguong <= r.dm order by bac.bac desc limit 1) b
  left join bac bs on bs.bac = b.bac + 1
  left join bac bt on bt.bac = b.bac - 1
  order by r.khoi, r.hk, hs.ho_ten;
end $$;
comment on function public.fn_rank_mua(text, text, date) is 'Rank mùa theo khối × môn tại ngày p_ngay (mặc định hôm nay VN): Điểm Rank cộng dồn, bậc 1–8 + sao, bậc 1–10 + sao (bậc 9–10 = thần, cột ghe = tên thần). phong_do chỉ để tham khảo.';
