-- Học phí: (1) HS ghi danh lại / chuyển lớp không còn mất buổi đã học; (2) buổi bù tách đúng "đã bù" vs "đã xếp".
--
-- (1) hoc_sinh_lop có unique (hoc_sinh_id, lop_id) nên "ghi danh lại" GHI ĐÈ ngay_vao/ngay_roi của chính dòng cũ
--     (upsert nhansu.ts) — khoảng học trước đó biến mất, các buổi đã học (có điểm danh thật) rơi khỏi học phí.
--     Đo 02/10: Mai Trang 7B1 T9 tính 3/8 buổi; ~10 HS lệch T8+T9. Luật mới: một buổi của lớp được tính nếu
--     (a) nằm trong khoảng ghi danh, HOẶC (b) HS có dòng điểm danh THẬT ở buổi đó (bằng chứng độc lập).
--     Dòng ghi danh ĐÃ RỜI: buổi trong khoảng mà chưa có điểm danh thì KHÔNG tính (thiếu data = không có dòng, §1.5)
--     — trước đây ngày rời bị tính 1 buổi dù không điểm danh; HS chuyển lớp bị tính oan lớp cũ.
-- (2) "Đã bù" = có mặt ở buổi bù chưa huỷ (trước đòi buổi phải hoan_tat → buổi 'mo' đã học xong vẫn gọi "đã xếp");
--     "đã xếp" = còn hiệu lực, chưa học; buổi bù bị huỷ / HS vắng ở buổi bù KHÔNG còn tính là bù (so_buoi_bu loại các lượt đó).
-- Không đổi chữ ký / kiểu trả về → fn_hocphi_chi_tiet_ky và mọi nơi gọi giữ nguyên.

CREATE OR REPLACE FUNCTION public.hoc_phi_theo_mon_ky(p_ky date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with params as (
    select p_ky as ky_start, (p_ky + interval '1 month')::date as ky_end
  ),
  hs_scope as ( -- HS còn "chạm" kỳ này (kể cả rời giữa tháng) — khớp hsIdsCoGhiDanhKy
    select distinct hoc_sinh_id from hoc_sinh_lop, params
    where ngay_roi is null or ngay_roi >= params.ky_start
  ),
  he_so as ( -- hệ số HIỆU LỰC của kỳ: entry mới nhất hieu_luc_tu <= p_ky (khớp heSoHieuLucBatch)
    select distinct on (hoc_sinh_id) hoc_sinh_id, he_so
    from hoc_sinh_he_so, params
    where hieu_luc_tu <= params.ky_start
    order by hoc_sinh_id, hieu_luc_tu desc
  ),
  enroll as ( -- ghi danh CÓ HIỆU LỰC trong kỳ (đã vào trước kyEnd, chưa rời hoặc rời trong/sau kỳ)
    select hsl.id as enroll_id, hsl.hoc_sinh_id, hsl.lop_id, hsl.ngay_vao, hsl.ngay_roi,
           l.ten_lop, l.mon, l.muc_hoc_phi_id, l.muc_hoc_lieu_id
    from hoc_sinh_lop hsl
    join lop l on l.id = hsl.lop_id
    cross join params
    where hsl.hoc_sinh_id in (select hoc_sinh_id from hs_scope)
  ),
  buoi_ky as ( -- buổi LỚP trong kỳ: mo/hoan_tat, KHÁC 'bu'
    select b.id, b.lop_id, b.ngay
    from buoi_hoc b, params
    where b.loai <> 'bu' and b.trang_thai in ('mo','hoan_tat')
      and b.ngay >= params.ky_start and b.ngay < params.ky_end
  ),
  buoi_enroll as ( -- buổi TRONG WINDOW ghi danh của từng dòng enroll (khớp inWindow)
    select e.enroll_id, bk.id as buoi_id, bk.ngay
    from enroll e
    join buoi_ky bk on bk.lop_id = e.lop_id
    where (bk.ngay >= e.ngay_vao and (e.ngay_roi is null or (bk.ngay <= e.ngay_roi
             and exists (select 1 from buoi_hoc_hs y where y.buoi_hoc_id = bk.id and y.hoc_sinh_id = e.hoc_sinh_id))))
       or exists (select 1 from buoi_hoc_hs z where z.buoi_hoc_id = bk.id and z.hoc_sinh_id = e.hoc_sinh_id and z.bu_cho_buoi_id is null)
  ),
  diem_danh_enroll as (
    select be.enroll_id,
      count(*) as so_buoi_lop,
      count(*) filter (where bhh.diem_danh = 'co_mat') as so_buoi_di_hoc,
      count(*) filter (where bhh.diem_danh in ('vang','vang_phep')) as so_buoi_nghi,
      coalesce(array_agg(be.ngay order by be.ngay) filter (where bhh.diem_danh = 'co_mat'), '{}') as ngay_di_hoc,
      coalesce(array_agg(be.ngay order by be.ngay) filter (where bhh.diem_danh in ('vang','vang_phep')), '{}') as ngay_nghi
    from buoi_enroll be
    join enroll e on e.enroll_id = be.enroll_id
    left join buoi_hoc_hs bhh on bhh.buoi_hoc_id = be.buoi_id and bhh.hoc_sinh_id = e.hoc_sinh_id
    group by be.enroll_id
  ),
  -- ── BÙ (khớp buByGocKy): bhh có bu_cho_buoi_id → buổi BÙ, gắn về buổi GỐC ──
  bu_raw as (
    select bhh.hoc_sinh_id, bhh.bu_cho_buoi_id,
           bu.trang_thai as bu_trang_thai, bu.ngay as bu_ngay, bhh.diem_danh as bu_diem_danh,
           goc.lop_id as goc_lop_id, goc.ngay as goc_ngay
    from buoi_hoc_hs bhh
    join buoi_hoc bu on bu.id = bhh.buoi_hoc_id
    join buoi_hoc goc on goc.id = bhh.bu_cho_buoi_id
    where bhh.bu_cho_buoi_id is not null
      and bhh.hoc_sinh_id in (select hoc_sinh_id from hs_scope)
  ),
  bu_dedup as ( -- dedupe theo bu_cho_buoi_id (1 buổi vắng gốc chỉ tính 1 lần bù dù có nhiều dòng)
    select hoc_sinh_id, goc_lop_id, bu_cho_buoi_id,
           bool_or(bu_trang_thai <> 'huy' and bu_diem_danh = 'co_mat') as da_hoc,
           bool_or(bu_trang_thai <> 'huy' and coalesce(bu_diem_danh, '') not in ('vang','vang_phep')) as con_hieu_luc,
           min(bu_ngay) as bu_ngay
    from bu_raw, params
    where goc_ngay >= params.ky_start and goc_ngay < params.ky_end
    group by hoc_sinh_id, goc_lop_id, bu_cho_buoi_id
  ),
  bu_by_hs_lop as (
    select hoc_sinh_id, goc_lop_id as lop_id,
      count(*) filter (where con_hieu_luc) as so_buoi_bu,
      count(*) filter (where da_hoc) as so_buoi_bu_da_hoc,
      count(*) filter (where con_hieu_luc and not da_hoc) as so_buoi_bu_da_xep,
      coalesce(array_agg(bu_ngay order by bu_ngay) filter (where con_hieu_luc), '{}') as ngay_bu
    from bu_dedup
    group by hoc_sinh_id, goc_lop_id
  ),
  -- ── ĐUỔI: buổi loai='bo_tro_duoi', co_mat, trong kỳ — giá theo MỨC CỦA CA ──
  duoi_raw as (
    select bhh.hoc_sinh_id, bhh.bo_tro_duoi_id, b.ngay as duoi_ngay, b.muc_hoc_duoi_id
    from buoi_hoc_hs bhh
    join buoi_hoc b on b.id = bhh.buoi_hoc_id
    cross join params
    where bhh.diem_danh = 'co_mat' and b.loai = 'bo_tro_duoi'
      and b.ngay >= params.ky_start and b.ngay < params.ky_end
      and bhh.hoc_sinh_id in (select hoc_sinh_id from hs_scope)
  ),
  duoi_with_lop as (
    select dr.hoc_sinh_id, dr.duoi_ngay, dr.muc_hoc_duoi_id,
           coalesce(btd.lop_id, '00000000-0000-0000-0000-000000000000'::uuid) as lop_key
    from duoi_raw dr
    left join bo_tro_duoi btd on btd.id = dr.bo_tro_duoi_id
  ),
  duoi_by_hs_lop as (
    select dwl.hoc_sinh_id, dwl.lop_key,
      count(*) as so_buoi_duoi,
      sum(md.gia) as tien_duoi,
      coalesce(array_agg(dwl.duoi_ngay order by dwl.duoi_ngay), '{}') as ngay_duoi
    from duoi_with_lop dwl
    join muc_hoc_duoi md on md.id = dwl.muc_hoc_duoi_id -- ca chưa gán mức → chưa tính tiền (thà bỏ trống)
    group by dwl.hoc_sinh_id, dwl.lop_key
  ),
  -- ── GHÉP theo từng dòng enroll (hs × lớp) ──
  base as (
    select
      e.enroll_id, e.hoc_sinh_id, e.lop_id, e.ten_lop, e.mon, e.muc_hoc_phi_id, e.muc_hoc_lieu_id,
      coalesce(dd.so_buoi_lop, 0) as so_buoi_lop,
      coalesce(dd.so_buoi_di_hoc, 0) as so_buoi_di_hoc,
      coalesce(dd.so_buoi_nghi, 0) as so_buoi_nghi,
      coalesce(dd.ngay_di_hoc, '{}') as ngay_di_hoc,
      coalesce(dd.ngay_nghi, '{}') as ngay_nghi,
      coalesce(bu.so_buoi_bu, 0) as so_buoi_bu,
      coalesce(bu.so_buoi_bu_da_hoc, 0) as so_buoi_bu_da_hoc,
      coalesce(bu.so_buoi_bu_da_xep, 0) as so_buoi_bu_da_xep,
      coalesce(bu.ngay_bu, '{}') as ngay_bu,
      coalesce(du.so_buoi_duoi, 0) as so_buoi_duoi,
      coalesce(du.tien_duoi, 0) as tien_duoi,
      coalesce(du.ngay_duoi, '{}') as ngay_duoi,
      coalesce(hs.he_so, 1) as he_so,
      coalesce(mp.don_gia_buoi, 0) as don_gia,
      ct.cong_thuc as cong_thuc_chon
    from enroll e
    left join diem_danh_enroll dd on dd.enroll_id = e.enroll_id
    left join bu_by_hs_lop bu on bu.hoc_sinh_id = e.hoc_sinh_id and bu.lop_id = e.lop_id
    left join duoi_by_hs_lop du on du.hoc_sinh_id = e.hoc_sinh_id and du.lop_key = e.lop_id
    left join he_so hs on hs.hoc_sinh_id = e.hoc_sinh_id
    left join muc_hoc_phi mp on mp.id = e.muc_hoc_phi_id
    left join hoc_phi_cong_thuc ct on ct.hoc_sinh_id = e.hoc_sinh_id and ct.lop_id = e.lop_id and ct.ky = p_ky
    where coalesce(dd.so_buoi_lop, 0) > 0 or coalesce(du.so_buoi_duoi, 0) > 0 -- "kỳ này không có gì với lớp này" → bỏ
  ),
  tinh as (
    select b.*,
      case when b.so_buoi_lop > 0 and (b.so_buoi_nghi::numeric / b.so_buoi_lop) >= 0.3 then 'ct2' else 'ct1' end as cong_thuc_de_xuat,
      coalesce(b.cong_thuc_chon,
        case when b.so_buoi_lop > 0 and (b.so_buoi_nghi::numeric / b.so_buoi_lop) >= 0.3 then 'ct2' else 'ct1' end) as ct_dung
    from base b
  ),
  tien as (
    select t.*,
      case when t.ct_dung = 'ct2' then t.so_buoi_di_hoc + t.so_buoi_bu else t.so_buoi_lop end as so_buoi_tinh,
      case when t.don_gia > 0 and t.so_buoi_lop > 0
        then round((t.don_gia * (case when t.ct_dung = 'ct2' then t.so_buoi_di_hoc + t.so_buoi_bu else t.so_buoi_lop end) * t.he_so) / 1000) * 1000
        else 0 end as tien_hoc_chinh
    from tinh t
  ),
  -- ── HỌC LIỆU: dedupe theo (học sinh, MÔN, kỳ) — 1 lần/môn dù nhiều dòng lớp cùng môn (Thùy) ──
  hoc_lieu_pick as (
    select enroll_id, hoc_sinh_id, mon,
      row_number() over (partition by hoc_sinh_id, mon order by ngay_vao asc, lop_id asc) as rn
    from (select ti.enroll_id, ti.hoc_sinh_id, ti.mon, e.ngay_vao, e.lop_id
          from tien ti join enroll e on e.enroll_id = ti.enroll_id
          where ti.tien_hoc_chinh > 0 and ti.muc_hoc_lieu_id is not null) x
  ),
  final_rows as (
    select
      t.hoc_sinh_id, t.lop_id, t.ten_lop, t.mon,
      t.so_buoi_lop, t.so_buoi_nghi, t.so_buoi_di_hoc, t.so_buoi_bu, t.so_buoi_bu_da_hoc, t.so_buoi_bu_da_xep, t.so_buoi_duoi,
      t.don_gia, t.he_so, t.cong_thuc_de_xuat, t.cong_thuc_chon,
      t.tien_hoc_chinh, t.tien_duoi,
      case when hlp.rn = 1 then coalesce(ml.gia, 0) else 0 end as tien_hoc_lieu,
      case when hlp.rn = 1 then ml.ten else null end as hoc_lieu_ten,
      t.tien_hoc_chinh + t.tien_duoi + case when hlp.rn = 1 then coalesce(ml.gia, 0) else 0 end as thanh_tien,
      t.ngay_di_hoc, t.ngay_nghi, t.ngay_bu, t.ngay_duoi
    from tien t
    left join hoc_lieu_pick hlp on hlp.enroll_id = t.enroll_id
    left join muc_hoc_lieu ml on ml.id = t.muc_hoc_lieu_id
  ),
  -- ── đuổi KHÔNG khớp dòng lớp nào (case không gắn lớp / HS đã rời lớp đó) → dòng riêng ──
  duoi_le as (
    select du.hoc_sinh_id, null::uuid as lop_id, '—'::text as ten_lop, 'Học đuổi'::text as mon,
      0 as so_buoi_lop, 0 as so_buoi_nghi, 0 as so_buoi_di_hoc, 0 as so_buoi_bu, 0 as so_buoi_bu_da_hoc, 0 as so_buoi_bu_da_xep,
      du.so_buoi_duoi,
      0::numeric as don_gia, 1::numeric as he_so, 'ct1'::text as cong_thuc_de_xuat, null::text as cong_thuc_chon,
      0::numeric as tien_hoc_chinh, du.tien_duoi,
      0::numeric as tien_hoc_lieu, null::text as hoc_lieu_ten,
      du.tien_duoi as thanh_tien,
      '{}'::date[] as ngay_di_hoc, '{}'::date[] as ngay_nghi, '{}'::date[] as ngay_bu, du.ngay_duoi
    from duoi_by_hs_lop du
    where not exists (select 1 from enroll e where e.hoc_sinh_id = du.hoc_sinh_id and e.lop_id = du.lop_key)
  ),
  all_rows as (
    select * from final_rows
    union all
    select * from duoi_le
  )
  select case when not public.la_thanh_vien() then '[]'::jsonb else (
    select coalesce(jsonb_agg(to_jsonb(ar)), '[]'::jsonb)
    from (
      select ar.*, h.ho_ten as hoc_sinh_ten, h.ma_hs
      from all_rows ar
      join hoc_sinh h on h.id = ar.hoc_sinh_id
    ) ar
  ) end
$function$;
