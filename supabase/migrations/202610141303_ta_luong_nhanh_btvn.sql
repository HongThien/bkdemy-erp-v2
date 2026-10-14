-- ============================================================================
-- 202610141303_ta_luong_nhanh_btvn
-- ----------------------------------------------------------------------------
-- VÌ SAO: bảng lương tháng (fn_ta_luong_thang, mọi TA) chạy 9,3 giây — vượt trần ~8 giây của API ⇒ màn "Lương trợ
--   giảng" sẽ báo lỗi. EXPLAIN: đếm BTVN mỗi (TA × lớp) quét TOÀN BẢNG gami_grades (148k dòng) 148 lần vì nối từ
--   gami_grades.buoi_hoc_id (không có index). Đổi chiều nối: đề của buổi (gami_session_problems, index theo buoi_hoc_id)
--   → bài chấm theo problem_id (index sẵn). Giữ CẢ HAI điều kiện buổi (p.buoi_hoc_id và g.buoi_hoc_id) ⇒ tập kết quả
--   không rộng hơn bản cũ; đo 14/10: 0/97.401 dòng BTVN lệch buổi giữa hai bảng. Bản cũ (trước mig 202610141233) cũng đã 6,9 giây.
-- MẤT GÌ: không. Chỉ thay thân _ta_luong_tinh (dựng từ pg_get_functiondef bản đang chạy), giữ chữ ký + quyền.
-- ============================================================================

CREATE OR REPLACE FUNCTION public._ta_luong_tinh(p_ky date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric, ngoai_package numeric, gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
with
k as (
  select date_trunc('month', p_ky)::date as tu,
         (date_trunc('month', p_ky)::date + interval '1 month' - interval '1 day')::date as den
),
cv_ok as (   -- việc được tính lương: đã duyệt VÀ ca có mặt của nó đã duyệt (việc nhập hộ / nạp cũ không gắn ca: chỉ cần việc đã duyệt)
  select cv.* from ta_cong_viec cv, k
   where cv.ky = k.tu and cv.trang_thai = 'da_duyet'
     and (cv.cham_cong_id is null
          or exists (select 1 from ta_cham_cong cc where cc.id = cv.cham_cong_id and cc.duyet = 'da_duyet'))
),
dg as (   -- đơn giá đang hiệu lực tại đầu kỳ (dòng mới nhất có hieu_luc_tu <= đầu kỳ)
  select distinct on (d.ma, coalesce(d.si_tu, -1)) d.ma, d.si_tu, d.si_den, d.gia_tri
    from ta_don_gia d, k where d.hieu_luc_tu <= k.tu
   order by d.ma, coalesce(d.si_tu, -1), d.hieu_luc_tu desc
),
cfg as (
  select (select gia_tri from dg where ma = 'he_so_tg')            as w_tg,
         (select gia_tri from dg where ma = 'he_so_btvn')          as w_btvn,
         (select gia_tri from dg where ma = 'he_so_bo_tro')        as w_bt,
         (select gia_tri from dg where ma = 'chi_tieu_bo_tro_gio') as chi_tieu,
         (select gia_tri from dg where ma = 'btvn_lop_8_buoi')     as btvn_8,
         (select gia_tri from dg where ma = 'btvn_lop_4_buoi')     as btvn_4
),
ta_sel as (
  select x.nhan_su_id from (
    select pk.nhan_su_id from public._ta_pc_khoang() pk, k where pk.tu <= k.den and (pk.den is null or pk.den >= k.tu)
    union
    select cv.nhan_su_id from cv_ok cv
  ) x where p_ns is null or x.nhan_su_id = p_ns
),
lop_cua as (
  -- Lớp thuộc về TA được phân công (la_chu) giữ BTVN + chỉ tiêu bổ trợ + bậc lương, kể cả khi nhờ người dạy hộ.
  -- Lớp TA có công TG mà không được phân công = dạy hộ: tiền TG của buổi đó đi theo người dạy (CEO 12/10).
  select x.nhan_su_id, x.lop_id, bool_or(x.chu) as la_chu, bool_or(x.la_chinh) as la_chinh
    from (
      -- Lớp chủ = được phân công vào BẤT KỲ NGÀY NÀO trong kỳ (theo log): phân công SAU kỳ không tính vào kỳ này
      -- (Tùng 6A3, Vân Anh 7S3 phân 11–12/10); TA bị rút giữa kỳ vẫn giữ lớp cho kỳ đó (Thùy 14/10).
      select pk.nhan_su_id, pk.lop_id, true as chu,
             coalesce((select lg.la_chinh from phan_cong_lop_log lg
                        where lg.nhan_su_id = pk.nhan_su_id and lg.lop_id = pk.lop_id and lg.vai_tro = 'tg'
                          and lg.hanh_dong in ('them', 'doi_chinh') and (lg.ts at time zone 'Asia/Ho_Chi_Minh')::date <= k.den
                        order by lg.ts desc limit 1), false) as la_chinh
        from public._ta_pc_khoang() pk join ta_sel s on s.nhan_su_id = pk.nhan_su_id, k
       where pk.tu <= k.den and (pk.den is null or pk.den >= k.tu)
      union all
      select cv.nhan_su_id, cv.lop_id, false, false
        from cv_ok cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec
        join ta_sel s on s.nhan_su_id = cv.nhan_su_id
       where lv.tinh_vao = 'tg' and cv.lop_id is not null
    ) x
   group by x.nhan_su_id, x.lop_id
),
lop_stat as (
  select lc.nhan_su_id, lc.lop_id, l.ten_lop, lc.la_chu, lc.la_chinh,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
        and b.ngay between k.tu and k.den)::int as so_buoi,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong'
        and b.ngay between k.tu and k.den)::int as so_buoi_lich,
    -- BTVN thật (CEO 12/10): buổi lớp mình mà CHÍNH TA này đã chấm (gami_grades.graded_by → tai_khoan → nhan_su)
    -- trong hạn duyệt của kỳ. Buổi MT/thi không có câu BTVN ⇒ không có dòng chấm ⇒ không tính;
    -- BTVN online TA chưa chấm (hoặc chấm sau hạn) ⇒ không tính.
    (select count(*) from buoi_hoc b, k
      where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between k.tu and k.den
        and exists (select 1 from gami_session_problems p
                      join gami_grades g on g.problem_id = p.id and g.buoi_hoc_id = b.id
                      join tai_khoan tk on tk.id = g.graded_by
                     where p.buoi_hoc_id = b.id and p.phase = 'btvn' and not p.hidden and tk.nhan_su_id = lc.nhan_su_id
                       and g.graded_at < ((k.tu + interval '1 month')
                             + make_interval(days => coalesce((select gia_tri::int from dg where ma = 'han_duyet_ngay'), 3)))
                             ::timestamp at time zone 'Asia/Ho_Chi_Minh'))::int as btvn_lam,
    (select avg(x.c) from k, generate_series(k.tu, k.den, interval '1 day') d(d),
        lateral (select count(*)::int as c from hoc_sinh_lop h
                  where h.lop_id = lc.lop_id and h.ngay_vao <= d.d::date
                    and (h.ngay_roi is null or h.ngay_roi > d.d::date)) x) as si_tb,
    -- TG: từ CHẤM CÔNG đã duyệt (K2), theo ngày. Trông thi ở LỚP MÌNH nằm trong công TG: cùng ngày chỉ tính
    -- một lần vào TG (không trả tiền trông thi riêng — xem ngoai_dong), kể cả khi hôm đó chỉ có dòng trông thi.
    (select count(distinct cv.ngay) from cv_ok cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec
      where cv.nhan_su_id = lc.nhan_su_id and cv.lop_id = lc.lop_id
        and lv.tinh_vao in ('tg', 'trong_thi'))::int as tg_lam
    from lop_cua lc join lop l on l.id = lc.lop_id
),
lop_bac as (
  select ls.*, coalesce(
      (select b.gia_tri from dg b
        where b.ma = 'bac_luong'
          and round(coalesce(ls.si_tb, 0))::int >= b.si_tu
          and (b.si_den is null or round(coalesce(ls.si_tb, 0))::int <= b.si_den)
        order by b.si_tu desc limit 1),
      (select min(gia_tri) from dg where ma = 'bac_luong')) as luong
    from lop_stat ls
),
chinh as (
  select distinct on (lb.nhan_su_id) lb.nhan_su_id, lb.lop_id as chinh_lop, lb.ten_lop as chinh_ten, lb.luong as chinh_luong
    from lop_bac lb
   -- lớp chính = lớp TA THỰC SỰ có công TG (bằng chứng), rồi mới tới cờ la_chinh trong phân công
   order by lb.nhan_su_id, lb.la_chu desc, (lb.tg_lam > 0) desc, lb.la_chinh desc, lb.luong desc, lb.ten_lop
),
lop_tien as (
  select lb.*, lb.tg_lam as tg_tinh,
         case when lb.so_buoi_lich <= 5 then c.btvn_4 else c.btvn_8 end as btvn_dm,
         c.w_tg, c.w_btvn
    from lop_bac lb, cfg c
),
lop_kq as (
  select lt.*,
         case when lt.so_buoi > 0 then lt.tg_tinh::numeric / lt.so_buoi else 0 end as ti_le_tg,
         case when lt.btvn_dm > 0 then lt.btvn_lam::numeric / lt.btvn_dm else 0 end as ti_le_btvn
    from lop_tien lt
),
lop_tong as (
  select lk.nhan_su_id,
         sum(round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn)))::numeric as tien,
         -- Lớp chủ chỉ vào chỉ tiêu bổ trợ khi TA CÓ HOẠT ĐỘNG ở lớp đó trong kỳ (có công TG hoặc đã chấm BTVN).
         -- Chặn phân công "treo" (phụ, chưa làm gì) làm tăng chỉ tiêu oan; sau này chấm công thay hẳn bước này.
         (count(*) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)))::int as n_chu,
         coalesce(sum(lk.luong) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)), 0)::numeric as sum_bac_chu,
         (count(*) filter (where lk.tg_lam > 0))::int as n_lop_tg,
         coalesce(sum(lk.luong) filter (where lk.tg_lam > 0), 0)::numeric as sum_bac_tg,
         coalesce(sum(lk.tg_lam) filter (where not lk.la_chu), 0)::int as tg_ho,
         jsonb_agg(jsonb_build_object(
           'lop', lk.ten_lop, 'la_chu', lk.la_chu, 'co_hoat_dong', (lk.tg_lam > 0 or lk.btvn_lam > 0), 'si_tb', round(lk.si_tb::numeric, 2), 'bac', lk.luong,
           'tg_lam', lk.tg_tinh, 'so_buoi', lk.so_buoi, 'ti_le_tg', round(lk.ti_le_tg, 4),
           'btvn_lam', lk.btvn_lam, 'btvn_dinh_muc', lk.btvn_dm, 'ti_le_btvn', round(lk.ti_le_btvn, 4),
           'tien', round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn))) order by lk.ten_lop) as ds
    from lop_kq lk group by lk.nhan_su_id
),
bo as (
  select cv.nhan_su_id,
         sum(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0)::numeric as gio
    from cv_ok cv join ta_loai_viec lv on lv.ma = cv.loai_viec
   where lv.tinh_vao = 'bo_tro'
     and cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null
   group by cv.nhan_su_id
),
ngoai_dong as (
  select cv.nhan_su_id, lv.ma as loai, cv.ngay, l.ten_lop,
         case lv.don_vi when 'gio' then coalesce(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0, 0)
                        else 1 end as so_luong,
         (select gia_tri from dg where dg.ma = 'gia_' || lv.ma) as don_gia
    from cv_ok cv
    join ta_loai_viec lv on lv.ma = cv.loai_viec
    left join lop l on l.id = cv.lop_id
   where lv.nhom = 'ngoai_package'
     -- trông thi lớp mình nằm trong công TG, không tính riêng
     and not (lv.tinh_vao = 'trong_thi' and exists (
            select 1 from lop_cua lc where lc.nhan_su_id = cv.nhan_su_id and lc.lop_id = cv.lop_id))
),
ngoai as (
  select nd.nhan_su_id,
         sum(round(nd.so_luong * coalesce(nd.don_gia, 0)))::numeric as tien,
         jsonb_agg(jsonb_build_object('loai', nd.loai, 'ngay', nd.ngay, 'lop', nd.ten_lop,
                   'so_luong', round(nd.so_luong::numeric, 2), 'don_gia', nd.don_gia,
                   'thieu_don_gia', nd.don_gia is null) order by nd.ngay) as ds
    from ngoai_dong nd group by nd.nhan_su_id
),
ket as (
  select s.nhan_su_id,
         coalesce(lt.tien, 0) as package_lop,
         coalesce(bo.gio, 0) as bo_tro_gio,
         -- Mỗi lớp có phần bổ trợ riêng (8 giờ, 40% bậc lớp ấy): chỉ tiêu = 8 × số lớp được phân công (không có thì
         -- theo lớp có TG); tiền = 0,4 × giờ ÷ chỉ tiêu × Σ bậc các lớp đó. Giờ dùng chung, không gắn lớp.
         case when n_bt.n = 0 then 0
              else round(c.w_bt * coalesce(bo.gio, 0) / nullif(c.chi_tieu * n_bt.n, 0) * n_bt.bac) end as bo_tro_tien,
         n_bt.n as n_lop_bt,
         n_bt.bac as bac_bt,
         coalesce(ng.tien, 0) as ngoai_package,
         coalesce((select g.tien_phat from gay_chot_thang g, k where g.ky = k.tu and g.nhan_su_id = s.nhan_su_id), 0) as tien_phat,
         lt.ds as ds_lop, ng.ds as ds_ngoai, ch.chinh_ten, ch.chinh_luong,
         coalesce(lt.tg_ho, 0) as day_thay, c.chi_tieu
    from ta_sel s
    left join lop_tong lt on lt.nhan_su_id = s.nhan_su_id
    left join chinh ch on ch.nhan_su_id = s.nhan_su_id
    left join bo on bo.nhan_su_id = s.nhan_su_id
    left join ngoai ng on ng.nhan_su_id = s.nhan_su_id, cfg c
    cross join lateral (
      select case when coalesce(lt.n_chu, 0) > 0 then lt.n_chu else coalesce(lt.n_lop_tg, 0) end as n,
             case when coalesce(lt.n_chu, 0) > 0 then lt.sum_bac_chu else coalesce(lt.sum_bac_tg, 0) end as bac) n_bt
)
select kt.nhan_su_id, n.ho_ten, kt.package_lop, round(kt.bo_tro_gio, 2), kt.bo_tro_tien, kt.ngoai_package,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package,
       kt.tien_phat,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package - kt.tien_phat,
       jsonb_build_object('lop', coalesce(kt.ds_lop, '[]'::jsonb),
                          'bo_tro', jsonb_build_object('gio', round(kt.bo_tro_gio, 2),
                                    'so_lop', kt.n_lop_bt, 'chi_tieu_moi_lop', kt.chi_tieu,
                                    'chi_tieu', kt.chi_tieu * kt.n_lop_bt,
                                    'ti_le', round(kt.bo_tro_gio / nullif(kt.chi_tieu * kt.n_lop_bt, 0), 4),
                                    'tong_bac', kt.bac_bt, 'lop_chinh', kt.chinh_ten, 'tien', kt.bo_tro_tien),
                          'ngoai_package', coalesce(kt.ds_ngoai, '[]'::jsonb),
                          'day_thay', kt.day_thay,
                          'tien_phat', kt.tien_phat)
  from ket kt join nhan_su n on n.id = kt.nhan_su_id
 where p_ns is not null or kt.package_lop + kt.bo_tro_tien + kt.ngoai_package + kt.tien_phat <> 0
 order by n.ho_ten
$function$;

revoke execute on function _ta_luong_tinh(date, uuid) from public, anon, authenticated;
