-- ============================================================================
-- 202611051708 — gan_cau_tieu_hoc_tu_doi_ung_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202611051707 thêm 5 đối ứng dạng cũ → dạng bài cho khối 4 · 5, nhưng view bdm_cau_dang (nguồn câu của bản đồ mới, MT, ôn tập…)
--   chỉ đọc dai_bdm_gan_cau + dai_bdm_de_xuat (câu con ăn theo câu gốc), KHÔNG đọc đối ứng ⇒ câu vẫn chưa hiện. Làm như 5T (mig 202611010050):
--   gán câu theo đối ứng, nguon = 'doi_ung'.
-- PHẠM VI: câu sống của 5 dạng cũ T104010107 · T104040204 · T105110101 · T105110102 · T105110104 chưa có dòng gán, trừ Đúng/Sai (trigger chặn).
-- MẤT GÌ (Luật xoá): Không xoá gì — chỉ thêm dòng gán.
-- ============================================================================
do $$
declare n int; v int;
begin
  insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
  select c.ma_cau, u.dich_dang_bai, 'doi_ung'
    from dai_cau_hoi c
    join dai_bdm_doi_ung u on u.ma_dang_cu = c.dang_chinh and u.dich_dang_bai is not null
   where c.dang_chinh in ('T104010107', 'T104040204', 'T105110101', 'T105110102', 'T105110104')
     and c.xoa_at is null and c.loai_cau <> 'dung_sai'
     and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = c.ma_cau);
  get diagnostics n = row_count;
  select count(*) into v from bdm_cau_dang b join dai_cau_hoi c on c.ma_cau = b.ma_cau
   where c.dang_chinh in ('T104010107', 'T104040204', 'T105110101', 'T105110102', 'T105110104') and c.xoa_at is null;
  -- đo trước: 108 câu sống ở 5 dạng này
  if v < 100 then raise exception 'Gán theo đối ứng bất thường: thêm % dòng, hiện % câu (cần ~108)', n, v; end if;
  raise notice 'Thêm % dòng gán; % câu hiện ở bản đồ mới', n, v;
end $$;
