-- ============================================================================
-- 202609272043 — et_de_tra_phan
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Đề thi trên app phải giữ BỐ CỤC GIẤY (CEO 20/09: "vẫn giữ được cấu trúc của đề thi") — HS thấy
--   "Phần I / II / III" như đề thật. fn_de_thi_mo (mig 202609272027) đã chụp tên phần vào
--   bai_test_cau.phan, nhưng et_de (hàm HS dùng đọc đề, giấu key) chưa trả cột đó. Thêm 1 key 'phan'
--   vào jsonb mỗi câu; mọi thứ khác GIỮ NGUYÊN chữ-từng-chữ theo bản live (đọc pg_get_functiondef 27/09).
--   ET/bổ trợ: bai_test_cau.phan = NULL ⇒ key 'phan' = null, client cũ bỏ qua — không đổi hành vi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì. create or replace cùng chữ ký (uuid → jsonb), ACL giữ nguyên (replace không đụng grant).
-- ============================================================================

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
      'phan', bc.phan
    ) order by bc.thu_tu)
    from bai_test_cau bc join bai_test bt on bt.id = bc.bai_test_id
    where bc.bai_test_id = p_bai_test and bc.bien_the = v_bien_the
      and ((bt.loai in ('et', 'de_thi') and public.hs_o_lop(bt.lop_id))
           or (bt.loai in ('bo_tro_test', 'retest') and bt.hoc_sinh_id = public.my_hoc_sinh_id()))
  ), '[]'::jsonb);
end $function$;
