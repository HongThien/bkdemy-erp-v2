-- ============================================================================
-- ĐỀ THI MÔN TIẾNG ANH chạy đúng luồng đề Toán (Thùy 02/10: "đề thi phải lưu lại đề để làm onl giống luồng của Toán").
--
-- 1. `_de_thi_kho` — câu của đề nằm ở kho nào — đi qua REGISTRY `_kho_cau_tbl(mon, nhanh)` (§1.6), thay vì chỉ biết
--    Toán/KHTN. Trước đây mọi môn khác rơi về 'dai' ⇒ đề Tiếng Anh đọc nhầm `dai_cau_hoi`, mọi câu hiện "đã xoá", không
--    duyệt/mở được. Kết quả cho Toán/KHTN KHÔNG đổi: hinh_gt→hgt · hinh_hoc→hinh_hoc · KHTN→khtn · còn lại→dai.
-- 2. `et_de` (đề cho HS lúc làm bài) trả thêm `ngu_lieu` — đoạn văn / thông báo / biển báo đã chụp vào `bai_test_cau`
--    (`_kho_snapshot_cau`, mig 202610021403). HS không đọc thẳng được `bai_test_cau` của bài 'de_thi' (RLS) nên thiếu
--    trường này là HS làm câu đọc hiểu mà không thấy bài đọc. NULL = câu không có ngữ liệu ("không áp dụng", §1.5).
-- ============================================================================

create or replace function public._de_thi_kho(p_cau_hinh jsonb, p_nhanh text, p_mon text, p_ma_cau text)
 returns text
 language sql
 immutable
as $function$
  select replace(public._kho_cau_tbl(p_mon, coalesce(nullif(p_cau_hinh -> 'nhanhByCau' ->> p_ma_cau, ''), p_nhanh)), '_cau_hoi', '')
$function$;

create or replace function public.et_de(p_bai_test uuid)
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare
  v_bien_the smallint;
begin
  select bl.bien_the into v_bien_the from bai_lam bl
  where bl.bai_test_id = p_bai_test and bl.hoc_sinh_id = public.my_hoc_sinh_id();
  v_bien_the := coalesce(v_bien_the, 1);

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', bc.id, 'thu_tu', bc.thu_tu, 'loai_cau', bc.loai_cau,
      'noi_dung', bc.noi_dung, 'lua_chon', bc.lua_chon, 'anh_de', bc.anh_de,
      'menh_de', (select jsonb_agg(jsonb_build_object('noi_dung', m->>'noi_dung'))
                  from jsonb_array_elements(coalesce(bc.menh_de, '[]'::jsonb)) m),
      'ma_dang', bc.ma_dang, 'ly_thuyet', bc.ly_thuyet, 'diem', bc.diem,
      'phan', bc.phan, 'kieu_nhap', bc.kieu_nhap, 'ngu_lieu', bc.ngu_lieu
    ) order by bc.thu_tu)
    from bai_test_cau bc join bai_test bt on bt.id = bc.bai_test_id
    where bc.bai_test_id = p_bai_test and bc.bien_the = v_bien_the
      and ((bt.loai in ('et', 'de_thi') and public.hs_o_lop(bt.lop_id))
           or (bt.loai in ('bo_tro_test', 'retest') and bt.hoc_sinh_id = public.my_hoc_sinh_id()))
  ), '[]'::jsonb);
end $function$;
