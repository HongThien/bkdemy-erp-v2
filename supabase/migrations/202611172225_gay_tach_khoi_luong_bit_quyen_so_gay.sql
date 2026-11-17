-- spec-luong-gay.md §9.0 câu 1 + §9.0b mục 1, 2 — Thùy 17/11: "gậy ko tính vào lương thôi, gậy tính sổ phạt riêng" · "Làm luôn".

-- ── (1) LƯƠNG TA không trừ gậy. net = gross. Cột tien_phat giữ (đọc gay_chot_thang) để bảng lương HIỆN số ở sổ phạt, không trừ.
--        Chưa tháng nào chốt gậy ⇒ tien_phat đang 0 với mọi người ⇒ số lương hiện tại KHÔNG đổi.
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
    from ta_don_gia d, k where d.hieu_luc_tu <= k.tu and d.xoa_at is null
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
lop_bac0 as (
  -- Thùy 10/11: từ tháng có chấm công ERP (T10), mức lương lớp = bảng ta_luong_lop (đặt tay từng lớp, hiệu lực theo tháng);
  -- lớp chưa có mức ⇒ 0đ + cờ thieu_muc (không đoán theo sĩ số). Tháng trước mốc giữ bậc theo sĩ số (bac_luong).
  select ls.*,
    case when (select tu from k) >= public._ta_moc_cham_cong()
      then (select m.muc from ta_luong_lop m, k where m.lop_id = ls.lop_id and m.xoa_at is null and m.hieu_luc_tu <= k.tu
             order by m.hieu_luc_tu desc limit 1)
      else coalesce(
        (select b.gia_tri from dg b
          where b.ma = 'bac_luong'
            and round(coalesce(ls.si_tb, 0))::int >= b.si_tu
            and (b.si_den is null or round(coalesce(ls.si_tb, 0))::int <= b.si_den)
          order by b.si_tu desc limit 1),
        (select min(gia_tri) from dg where ma = 'bac_luong')) end as luong0
    from lop_stat ls
),
lop_bac as (
  select b.*, coalesce(b.luong0, 0) as luong, b.luong0 is null as thieu_muc from lop_bac0 b
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
           'lop', lk.ten_lop, 'la_chu', lk.la_chu, 'co_hoat_dong', (lk.tg_lam > 0 or lk.btvn_lam > 0), 'si_tb', round(lk.si_tb::numeric, 2), 'bac', lk.luong, 'thieu_muc', lk.thieu_muc,
           'tg_lam', lk.tg_tinh, 'so_buoi', lk.so_buoi, 'ti_le_tg', round(lk.ti_le_tg, 4),
           'btvn_lam', lk.btvn_lam, 'btvn_dinh_muc', lk.btvn_dm, 'ti_le_btvn', round(lk.ti_le_btvn, 4),
           'tien', round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn))) order by lk.ten_lop) as ds
    from lop_kq lk group by lk.nhan_su_id
),
bo_ngay as (   -- mỗi (TA × ngày): giờ khai cộng thẳng + tập khoảng giờ hợp lại (chồng nhau chỉ còn 1)
  select cv.nhan_su_id, cv.ngay,
         sum(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0)::numeric as gio_khai,
         range_agg(tsrange(cv.ngay + cv.gio_bat_dau, cv.ngay + cv.gio_ket_thuc)) filter (where cv.gio_ket_thuc > cv.gio_bat_dau) as mr
    from cv_ok cv join ta_loai_viec lv on lv.ma = cv.loai_viec
   where lv.tinh_vao = 'bo_tro'
     and cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null
   group by cv.nhan_su_id, cv.ngay
),
bo as (
  -- Thùy 04/11: các việc bổ trợ CHỒNG GIỜ (kèm em bù/yếu/đuổi ngay trong giờ trực khối, 2 em cùng lúc, 2 buổi xếp trùng)
  -- chỉ tính GIỜ CÓ MẶT THẬT — mỗi khoảng giờ 1 lần. Áp từ tháng có chấm công trên ERP; tháng trước đó giữ cộng thẳng như cũ.
  select bn.nhan_su_id,
         sum(bn.gio_khai)::numeric as gio_khai,
         sum(case when (select tu from k) >= public._ta_moc_cham_cong()
                  then coalesce((select sum(extract(epoch from (upper(r) - lower(r))) / 3600.0) from unnest(bn.mr) r), 0)
                  else bn.gio_khai end)::numeric as gio
    from bo_ngay bn
   group by bn.nhan_su_id
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
         coalesce(bo.gio_khai, 0) as bo_tro_gio_khai,
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
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package,   -- Thùy 17/11: gậy KHÔNG trừ vào lương (tiền phạt ở sổ phạt riêng); cột tien_phat chỉ để hiện
       jsonb_build_object('lop', coalesce(kt.ds_lop, '[]'::jsonb),
                          'bo_tro', jsonb_build_object('gio', round(kt.bo_tro_gio, 2),
                                    'gio_khai', round(kt.bo_tro_gio_khai, 2),
                                    'gio_trung', round(kt.bo_tro_gio_khai - kt.bo_tro_gio, 2),
                                    'so_lop', kt.n_lop_bt, 'chi_tieu_moi_lop', kt.chi_tieu,
                                    'chi_tieu', kt.chi_tieu * kt.n_lop_bt,
                                    'ti_le', round(kt.bo_tro_gio / nullif(kt.chi_tieu * kt.n_lop_bt, 0), 4),
                                    'tong_bac', kt.bac_bt, 'lop_chinh', kt.chinh_ten, 'tien', kt.bo_tro_tien),
                          'ngoai_package', coalesce(kt.ds_ngoai, '[]'::jsonb),
                          'day_thay', kt.day_thay,
                          'tien_phat', kt.tien_phat)
  from ket kt join nhan_su n on n.id = kt.nhan_su_id
 where (p_ns is not null or kt.package_lop + kt.bo_tro_tien + kt.ngoai_package + kt.tien_phat <> 0)
   -- Thùy 15/10: GV kiêm TA KHÔNG nhận lương TA — từ tháng có chấm công trên ERP (tháng 9 trở về giữ nguyên)
   and not (p_ky >= public._ta_moc_cham_cong() and public._la_gv_kiem_ta(kt.nhan_su_id))
 order by n.ho_ten
$function$;

-- ── (2) BỊT QUYỀN SỔ GẬY. Trước: mọi bảng gay_* policy ALL cho la_thanh_vien() ⇒ nhân sự bất kỳ tự gỡ / thu hồi / đánh gậy qua API.
--        Sau: ai cũng ĐỌC; GHI sổ chỉ người có quyền quản gậy (fn_gay_duoc_doi_mien: quản trị · QLCL · quản lý môn · trưởng khối · ban lãnh đạo)
--        và KHÔNG được ghi / sửa dòng của chính mình. Máy quét (client của bất kỳ ai) vẫn chèn được ĐỀ XUẤT ở trạng thái 'cho'.
--        Trigger log + các hàm máy (_bctk_de_xuat_tre, _gtt_de_xuat_tre, _task_danh_co_tre…) đều security definer ⇒ không bị ảnh hưởng.
--        Lịch sử 17/11: 0 / 115 dòng sổ tự ghi, 0 tự thu hồi, 0 / 445 đề xuất tự quyết ⇒ không luồng thật nào bị chặn.
drop policy if exists gay_ledger_member_all on public.gay_ledger;
create policy gay_ledger_doc on public.gay_ledger for select to authenticated using ((select public.la_thanh_vien()));
create policy gay_ledger_them on public.gay_ledger for insert to authenticated
  with check ((select public.fn_gay_duoc_doi_mien()) and nhan_su_id <> (select public.current_nhan_su_id()));
create policy gay_ledger_sua on public.gay_ledger for update to authenticated
  using ((select public.fn_gay_duoc_doi_mien()) and nhan_su_id <> (select public.current_nhan_su_id()))
  with check ((select public.fn_gay_duoc_doi_mien()) and nhan_su_id <> (select public.current_nhan_su_id()));

drop policy if exists gay_de_xuat_member_all on public.gay_de_xuat;
create policy gay_de_xuat_doc on public.gay_de_xuat for select to authenticated using ((select public.la_thanh_vien()));
create policy gay_de_xuat_them on public.gay_de_xuat for insert to authenticated
  with check ((select public.la_thanh_vien()) and trang_thai = 'cho' and ledger_id is null and nguoi_quyet is null);
create policy gay_de_xuat_sua on public.gay_de_xuat for update to authenticated
  using ((select public.fn_gay_duoc_doi_mien()) and nhan_su_id <> (select public.current_nhan_su_id()))
  with check ((select public.fn_gay_duoc_doi_mien()) and nhan_su_id <> (select public.current_nhan_su_id()));

drop policy if exists gay_loi_member_all on public.gay_loi;
create policy gay_loi_doc on public.gay_loi for select to authenticated using ((select public.la_thanh_vien()));
create policy gay_loi_ghi on public.gay_loi for all to authenticated using ((select public.fn_gay_duoc_doi_mien())) with check ((select public.fn_gay_duoc_doi_mien()));
drop policy if exists gay_hoat_dong_member_all on public.gay_hoat_dong;
create policy gay_hoat_dong_doc on public.gay_hoat_dong for select to authenticated using ((select public.la_thanh_vien()));
create policy gay_hoat_dong_ghi on public.gay_hoat_dong for all to authenticated using ((select public.fn_gay_duoc_doi_mien())) with check ((select public.fn_gay_duoc_doi_mien()));

-- sổ chốt tháng + nhật ký: chỉ đọc; ghi qua hàm chốt (security definer, có cổng) / trigger log
drop policy if exists gay_chot_thang_member_all on public.gay_chot_thang;
create policy gay_chot_thang_doc on public.gay_chot_thang for select to authenticated using ((select public.la_thanh_vien()));
drop policy if exists gay_log_member_all on public.gay_log;
create policy gay_log_doc on public.gay_log for select to authenticated using ((select public.la_thanh_vien()));
drop policy if exists tich_luy_chot_thang_member_all on public.tich_luy_chot_thang;
create policy tich_luy_chot_thang_doc on public.tich_luy_chot_thang for select to authenticated using ((select public.la_thanh_vien()));

-- ── (3) Hàm chốt tháng: thêm cổng (trưởng / phó QLCL hoặc quản trị — spec §9.0 câu 9 "Trang chốt gậy"), chạy quyền chủ, thu quyền role lạ.
CREATE OR REPLACE FUNCTION public.fn_gay_chot_thang(p_ky date)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid;
  v_n integer;
begin
  select nhan_su_id into v_me from tai_khoan where id = public.jwt_uid();
  if v_me is null then raise exception 'Tài khoản chưa gắn nhân sự — không chốt được.'; end if;
  if not public._qlcl_toan_he() then raise exception 'Chỉ trưởng / phó Quản lý chất lượng hoặc quản trị hệ thống được chốt sổ gậy tháng.' using errcode = '42501'; end if;

  with bang as (select * from public.fn_gay_bang(p_ky)),
  snap as (
    select l.nhan_su_id,
           jsonb_agg(jsonb_build_object(
             'id', l.id, 'so_gay', l.so_gay, 'loai', l.loai,
             'loi', gl.ten, 'hoat_dong', gh.ten, 'ly_do', l.ly_do,
             'nguoi_tao', nt.ho_ten, 'created_at', l.created_at, 'thu_hoi_at', l.thu_hoi_at
           ) order by l.created_at desc) as entries
    from gay_ledger l
    left join gay_loi gl on gl.id = l.loi_id
    left join gay_hoat_dong gh on gh.id = l.hoat_dong_id
    left join nhan_su nt on nt.id = l.nguoi_tao
    where l.ky = p_ky
    group by l.nhan_su_id
  )
  insert into gay_chot_thang (ky, nhan_su_id, so_gay_danh, so_gay_go, so_gay_chot, don_gia, tien_phat, snapshot, nguoi_chot, chot_at)
  select p_ky, b.nhan_su_id, b.so_gay_danh, b.so_gay_go, b.con_lai, b.don_gia, b.tien_phat,
         coalesce(s.entries, '[]'::jsonb), v_me, now()
  from bang b left join snap s on s.nhan_su_id = b.nhan_su_id
  where b.so_gay_danh > 0 or b.so_gay_go > 0
  on conflict (ky, nhan_su_id) do update set
    so_gay_danh = excluded.so_gay_danh, so_gay_go = excluded.so_gay_go, so_gay_chot = excluded.so_gay_chot,
    don_gia = excluded.don_gia, tien_phat = excluded.tien_phat, snapshot = excluded.snapshot,
    nguoi_chot = excluded.nguoi_chot, chot_at = excluded.chot_at;
  get diagnostics v_n = row_count;
  return v_n;
end $function$;
CREATE OR REPLACE FUNCTION public.fn_tich_luy_chot_thang(p_ky date)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.current_nhan_su_id(); v_ym text; v_tu date; v_den date; r record; t record; n integer := 0;
  k_moc constant date := date '2026-09-01';   -- CEO 07/09: không chốt kỳ trước tháng 9/2026
begin
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  if not public._qlcl_toan_he() then raise exception 'Chỉ trưởng / phó Quản lý chất lượng hoặc quản trị hệ thống được chốt điểm tích luỹ tháng.' using errcode = '42501'; end if;
  if p_ky <> date_trunc('month', p_ky)::date then raise exception 'p_ky phải là ngày 1 của tháng'; end if;
  if p_ky < k_moc then raise exception 'Điểm tích lũy chỉ tính từ tháng 09/2026 — không chốt kỳ %.', to_char(p_ky, 'MM/YYYY'); end if;
  if p_ky >= date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date then
    raise exception 'Chỉ chốt tháng ĐÃ KẾT THÚC.'; end if;
  v_ym := to_char(p_ky, 'YYYY-MM'); v_tu := p_ky; v_den := (p_ky + interval '1 month' - interval '1 day')::date;
  for r in
    select distinct nhan_su_id from (
      select nhan_su_id from public.fn_ta_viec_thang(v_tu, v_den)
      union all select nhan_su_id from public.fn_gv_viec_thang(v_tu, v_den)
      union all select nhan_su_id from public.fn_ops_viec_thang(v_tu, v_den)) x
  loop
    select * into t from public._tich_luy_cua(r.nhan_su_id, v_ym);
    insert into tich_luy_chot_thang (ky, nhan_su_id, diem, chuoi, nguoi_chot, chot_at)
      values (p_ky, r.nhan_su_id, t.diem_thang, t.chuoi, v_me, now())
      on conflict (ky, nhan_su_id) do update set diem = excluded.diem, chuoi = excluded.chuoi, nguoi_chot = excluded.nguoi_chot, chot_at = now();
    n := n + 1;
  end loop;
  return n;
end $function$;
revoke all on function public.fn_gay_chot_thang(date) from public, anon, fdw_bkdemy_web, ph_nop, web_lead_writer;
revoke all on function public.fn_tich_luy_chot_thang(date) from public, anon, fdw_bkdemy_web, ph_nop, web_lead_writer;
grant execute on function public.fn_gay_chot_thang(date) to authenticated;
grant execute on function public.fn_tich_luy_chot_thang(date) to authenticated;
