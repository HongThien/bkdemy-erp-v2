-- ============================================================================
-- 202611091930 — tl_hh_cau_tra_bai_y
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 09/11 — màn "Chọn câu" Hình – Học (ET / giáo trình) hiện các ý rời nhau, mỗi ý như 1 bài: "trong kho giống UI
--   Hình luyện, vẫn 1 đề bài và các ý khác nhau là chỗ có thể chọn ý". fn_tl_hh_cau trả thêm thông tin bài–ý (mig 202611091550)
--   để giao diện gom các ý cùng bài thành 1 thẻ: bai_y · nhan_y · cau_hoi_y · da_biet · loi_dan. Ý cùng bài xếp liền nhau theo nhãn.
--   Thân giữ nguyên, chỉ thêm khoá vào mỗi phần tử + thứ tự.
-- MẤT GÌ (Luật xoá): Không. CREATE OR REPLACE cùng chữ ký / quyền.
-- ============================================================================

create or replace function public.fn_tl_hh_cau(p_bai text)
 returns jsonb
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  with v as materialized (select * from _tl_hh_cau_chuan(p_bai)),
       t as materialized (select tc.ma_cau, count(*) n from tai_lieu_cau tc where tc.ma_cau in (select v.ma_cau from v) group by 1)
  select coalesce(jsonb_agg(jsonb_build_object('ma_cau', q.ma_cau, 'noi_dung', q.noi_dung, 'anh_de', q.anh_de, 'loai_cau', q.loai_cau,
                                               'la_goc', v.la_goc, 'so_lan_dung', coalesce(t.n, 0),
                                               'bai_y', q.bai_y, 'nhan_y', q.nhan_y, 'cau_hoi_y', q.cau_hoi_y, 'da_biet', q.da_biet, 'loi_dan', y.loi_dan)
                            order by v.thu_tu, coalesce(q.bai_y, q.ma_cau), q.nhan_y nulls first, q.ma_cau), '[]'::jsonb)
    from v join hinh_hoc_cau_hoi q on q.ma_cau = v.ma_cau left join t on t.ma_cau = v.ma_cau
    left join hinh_hoc_bai_y y on y.ma_bai_y = q.bai_y
   where la_thanh_vien()
$function$;
