-- ============================================================================
-- 202611051709 — gan_cau_tieu_hoc_con_lot_doi_ung
-- ----------------------------------------------------------------------------
-- VÌ SAO: tiếp câu hỏi của Thùy 05/11 "sao bản đồ mới lại thiếu … so với bản đồ cũ". Đo sau mig 202611051708: khối 4 còn 301 câu, khối 5 còn
--   72 câu có đối ứng dạng cũ → dạng bài (ĐÚNG MỘT đối ứng mỗi dạng, không phải phán đoán) mà KHÔNG hiện ở bản đồ mới — phần lớn là câu clone
--   có câu gốc chưa có dòng gán (bdm_cau_dang cho câu con ăn theo câu gốc; gốc không gán thì con cũng mất). Khối 3 · 4T · 5T đã đủ.
-- LÀM: gán thẳng từng câu chưa hiện theo đối ứng duy nhất của dạng cũ, nguon 'doi_ung' (như mig 202611010050 / 202611051708).
--   Loại: câu Đúng/Sai (trigger chặn), câu đã có dòng gán, dạng cũ có > 1 đối ứng (mơ hồ ⇒ để người).
-- MẤT GÌ (Luật xoá): Không xoá gì — chỉ thêm dòng gán.
-- ============================================================================
do $$
declare n int; con int;
begin
  insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
  select c.ma_cau, u.dich_dang_bai, 'doi_ung'
    from dai_cau_hoi c
    join dai_ban_do b on b.ma_dang = c.dang_chinh and b.khoi in ('3', '4', '5', '4T', '5T')
    join dai_bdm_doi_ung u on u.ma_dang_cu = c.dang_chinh and u.dich_dang_bai is not null
   where c.xoa_at is null and c.loai_cau <> 'dung_sai' and c.dang_chinh not like '%000000'
     and (select count(*) from dai_bdm_doi_ung u2 where u2.ma_dang_cu = c.dang_chinh) = 1
     and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = c.ma_cau)
     and not exists (select 1 from bdm_cau_dang v where v.ma_cau = c.ma_cau and v.kho = 'dai');
  get diagnostics n = row_count;
  -- đo trước 301 + 72 = 373
  if n < 360 or n > 380 then raise exception 'Gán bù bất thường: % dòng (đo trước 373)', n; end if;
  select count(*) into con from dai_cau_hoi c join dai_ban_do b on b.ma_dang = c.dang_chinh
    join dai_bdm_doi_ung u on u.ma_dang_cu = c.dang_chinh and u.dich_dang_bai is not null
   where c.xoa_at is null and b.khoi in ('3', '4', '5', '4T', '5T') and c.loai_cau <> 'dung_sai'
     and not exists (select 1 from bdm_cau_dang v where v.ma_cau = c.ma_cau and v.kho = 'dai');
  if con > 0 then raise exception 'Còn % câu có đối ứng mà chưa hiện', con; end if;
  raise notice 'Gán bù % câu tiểu học theo đối ứng', n;
end $$;
