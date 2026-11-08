-- ============================================================================
-- 202611021909 — VÁ nhanhByCau cho ET bản đồ mới đã lưu thiếu nhánh kho của câu Hình (Thùy 02/11)
-- ----------------------------------------------------------------------------
-- VÌ SAO: ETBdmEditor chỉ nhớ nhánh kho từng câu trong bộ nhớ tạm (nhRef), không theo nháp ⇒ rời màn rồi quay lại
--   Lưu ⇒ tai_lieu.cau_hinh.nhanhByCau thiếu câu Hình ⇒ mọi chỗ đọc (mở lại · in · chấm) tra câu trong kho ĐẠI ⇒ câu
--   Hình rụng im lặng. Code đã sửa (commit 94294a26: suy nhánh từ dạng bài của hàng lúc lưu). File này vá dữ liệu cũ.
-- QUÉT 02/11 tối: 3 ET — 7S2 · 02/11 (HHC000850 gốc · HH00099001, HHC000841 đề 2/3) · 7S3 · 02/11 (HHC000847, HH00099001,
--   lưu 19:28 bằng code cũ chưa deploy) · 7S1 · 28/10 (HH00103055). Lần chạy đầu rào "≤ 4 mã" bắn đúng vì có 7S3 mới.
-- NHÂN CHỨNG (CLAUDE.md "map lại quan hệ đã mất"): chỉ ghi khi mã KHÔNG có ở dai_cau_hoi và có ở ĐÚNG MỘT kho khác
--   (hinh_hoc_cau_hoi ⇒ 'hinh_hoc' · hgt_cau_hoi ⇒ 'hinh_gt'). Có mã mơ hồ (ở cả hai kho / không kho nào) ⇒ rollback cả lượt,
--   không đoán. Không rào theo số lượng (ET lưu bằng code cũ tới lúc deploy vẫn có thể thêm ca y hệt).
-- MẤT GÌ: không. Chỉ THÊM khoá vào cau_hinh.nhanhByCau; không đụng câu, mã đề, gán HS.
-- ============================================================================

do $$
declare v_n int;
begin
  create temp table _va on commit drop as
  with et as (select t.id, t.cau_hinh from tai_lieu t where t.loai = 'et' and t.ban_do = 'moi'),
  ma as (
    select et.id, tc.ma_cau from et join tai_lieu_phan p on p.tai_lieu_id = et.id join tai_lieu_cau tc on tc.phan_id = p.id
    union
    select et.id, v.ma from et, jsonb_each(coalesce(et.cau_hinh -> 'etMaDe', '{}'::jsonb)) e, jsonb_array_elements_text(e.value) v(ma)
  ),
  ung as (
    select ma.id, ma.ma_cau,
           exists (select 1 from hinh_hoc_cau_hoi h where h.ma_cau = ma.ma_cau) as o_hh,
           exists (select 1 from hgt_cau_hoi h where h.ma_cau = ma.ma_cau) as o_hgt
      from ma join et on et.id = ma.id
     where not exists (select 1 from dai_cau_hoi d where d.ma_cau = ma.ma_cau)
       and et.cau_hinh -> 'nhanhByCau' ->> ma.ma_cau is null
  )
  select id, ma_cau, o_hh, o_hgt, case when o_hh then 'hinh_hoc' else 'hinh_gt' end as nhanh from ung;

  select count(*) into v_n from _va where o_hh = o_hgt;
  if v_n > 0 then raise exception '% mã không xác định được đúng 1 kho (cả hai / không kho nào) — dừng, xem lại', v_n; end if;
  select count(*) into v_n from _va;
  raise notice 'Vá nhanhByCau cho % (ET, mã câu)', v_n;

  update tai_lieu t
     set cau_hinh = jsonb_set(coalesce(t.cau_hinh, '{}'::jsonb), '{nhanhByCau}',
                              coalesce(t.cau_hinh -> 'nhanhByCau', '{}'::jsonb) || x.m),
         updated_at = now()
    from (select id, jsonb_object_agg(ma_cau, nhanh) as m from _va group by id) x
   where t.id = x.id;
end $$;
