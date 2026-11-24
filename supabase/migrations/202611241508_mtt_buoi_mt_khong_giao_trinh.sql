-- BUỔI KIỂM TRA THÁNG (MT) KHÔNG CÓ GIÁO TRÌNH — spec-van-hanh-tuan §3.6b (Thùy 24/11: "buổi MT ko có giáo trình, hệ thống vẫn đang tính").
-- Đo 24/11 trên 12 ca MT tuần 23/11: (1) cột "Giáo trình x/y" của Mục tiêu tuần: ca MT nằm trong y (ca chiếu TKB) mà không nằm trong x ⇒ lớp báo thiếu giáo trình;
-- (2) 6B1 28/11 có bản chép giao_trinh_buoi tạo trước khi đặt MT ⇒ _mtt_o_buoi vẫn ra 5 nhóm, lọt vào mục tiêu tuần của học sinh.
-- Sửa: (1) ca MT tính là ĐÃ CÓ nội dung (khớp màn Giáo trình tuần); (2) _mtt_o_buoi trả rỗng cho ngày MT (đã đặt ở Giáo trình tuần hoặc đã gán đề MT).
-- Không xoá bản chép cũ của 6B1 (luật xoá) — chỉ không đọc nó cho ngày MT.
-- Thân hàm lấy từ bản đang chạy (pg_get_functiondef 24/11), chỉ thêm điều kiện MT.

CREATE OR REPLACE FUNCTION public._mtt_buoi_co_gt(p_lop uuid, p_tuan date)
 RETURNS integer
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select count(*)::int from public._mtt_buoi_tuan(p_lop, p_tuan) bt
   where exists (select 1 from tai_lieu tl where tl.lop_id = p_lop and tl.ngay = bt.ngay and tl.hoc_sinh_id is null
                   and tl.loai in ('giao_trinh_buoi', 'et', 'btvn'))
      or exists (select 1 from gtt_ca g where g.lop_id = p_lop and g.ngay = bt.ngay)
      or exists (select 1 from gtt_ca_mt m where m.lop_id = p_lop and m.ngay = bt.ngay)   /* 24/11: ca Kiểm tra tháng = đã có nội dung (như màn Giáo trình tuần) */
$function$;

CREATE OR REPLACE FUNCTION public._mtt_o_buoi(p_lop uuid, p_ngay date, p_buoi uuid)
 RETURNS text[]
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with ot as (
    select distinct tc.ma_cau
      from tai_lieu t join tai_lieu_phan tp on tp.tai_lieu_id = t.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'btvn' and t.hoc_sinh_id is null
       and tp.loai_phan in ('ontap', 'ontap_nhom') and tc.ma_cau is not null
  ),
  c as (
    select distinct coalesce(tc.ma_cau, '') as kc, '' as kd
      from tai_lieu t join tai_lieu_phan tp on tp.tai_lieu_id = t.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where t.lop_id = p_lop and t.ngay = p_ngay and t.loai in ('giao_trinh_buoi', 'et', 'btvn') and t.hoc_sinh_id is null
       and tc.ma_cau is not null and tp.loai_phan not in ('ontap', 'ontap_nhom')
    union
    select distinct coalesce(sp.ma_cau, ''), coalesce(sp.ma_dang, '')
      from gami_session_problems sp
     where sp.buoi_hoc_id = p_buoi and sp.phase in ('et', 'btvn') and sp.hoc_sinh_id is null
       and not (sp.phase = 'btvn' and exists (select 1 from ot where ot.ma_cau = sp.ma_cau))
    union
    -- 16/11 Giáo trình tuần: lớp CHƯA có bản chép giáo trình buổi cho ngày này ⇒ câu của buổi KẾ HOẠCH trong builder (gtt_ca),
    -- bỏ phần ôn / luyện lại (ontap, ontap_nhom) — cùng luật với nhánh bản chép ở trên; quy câu → nhóm bằng đúng _do_o_quy bên dưới.
    select distinct tc.ma_cau, ''
      from gtt_ca g
      join lateral (select p.id, p.loai_phan from tai_lieu_phan p where p.cha_id = g.buoi_id
                    union all
                    select q.id, q.loai_phan from tai_lieu_phan p join tai_lieu_phan q on q.cha_id = p.id
                     where p.cha_id = g.buoi_id and p.loai_phan not in ('ontap', 'ontap_nhom')) ph on true
      join tai_lieu_cau tc on tc.phan_id = ph.id
     where g.lop_id = p_lop and g.ngay = p_ngay and ph.loai_phan not in ('ontap', 'ontap_nhom') and tc.ma_cau is not null
       and not exists (select 1 from tai_lieu t where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'giao_trinh_buoi' and t.hoc_sinh_id is null)
  )
  select coalesce(array_agg(distinct n) filter (where n is not null), '{}')
    from (select coalesce(public._do_o_quy(public._mastery_bdm_bat(), false, c.kc, c.kd),
                          case when c.kd = '' then (select h.dang_chinh from hinh_hoc_cau_hoi h where h.ma_cau = nullif(c.kc, '')) end) as n
            from c
           where not exists (select 1 from gtt_ca_mt m where m.lop_id = p_lop and m.ngay = p_ngay)   /* 24/11: buổi KIỂM TRA THÁNG không có giáo trình ⇒ không có nhóm */
             and not exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = p_lop and tl.ngay = p_ngay and tl.hoc_sinh_id is null)) x   /* 17/11: câu Hình–Học chưa có mã dạng chép ⇒ dang_chinh (= bài học = ô) */
$function$;
