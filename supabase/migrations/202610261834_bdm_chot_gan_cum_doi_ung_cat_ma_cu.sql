-- ============================================================================
-- 202610261834 — bdm_chot_gan_cum_doi_ung_cat_ma_cu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10: "chuyển hẳn sang bản đồ và kho mới, không liên quan gì đến kho cũ nữa" + chọn "ghi luôn" cho các câu đang ra
--   dạng bài qua đường SUY của kho cũ. Trước đây view bdm_cau_dang (nguồn DUY NHẤT câu → dạng bài) có 2 đường đi qua mã cũ:
--   · 'gan_cum' — câu thuộc CỤM cũ (dai_cau_hoi.ma_cum / cụm của câu gốc) ⇒ dai_bdm_doi_ung_cum
--   · 'doi_ung' — MÃ DẠNG CŨ của câu (dai_cau_hoi.dang_chinh) ⇒ dai_bdm_doi_ung ứng đúng 1 dạng bài
--   Chốt đúng kết quả hai đường đó thành dòng GÁN CHÍNH THỨC (dai_bdm_gan_cau, nguon 'cum' | 'doi_ung' để truy lại), rồi bỏ hai
--   đường khỏi view ⇒ câu → dạng bài chỉ còn: gán (câu / câu gốc) + đề xuất. Kết quả dạng bài của mọi câu KHÔNG đổi (kiểm
--   trước/sau), trừ 71 câu Đúng/Sai đang ra dạng bài qua đối ứng: Đ/S không vào kho dạng bài (Thùy 18/10, trigger
--   _bdm_cam_dung_sai) ⇒ không chốt, các câu này hết dạng bài (dùng kho Đ/S cấp chủ đề).
--   Gồm cả câu đã xoá (giữ luật "câu đã xoá theo anh em" của mastery) và câu cấp 1 (cấp 1 vẫn đo theo bản đồ cũ — gán vô hại).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất dòng dữ liệu nào. Nới CHECK nguon của dai_bdm_gan_cau (thêm 'cum','doi_ung'). View bdm_cau_dang bỏ 2 nhánh suy
--   'gan_cum' / 'doi_ung' (đã chốt thành gán) — 71 câu Đúng/Sai mất dạng bài suy (đúng luật Đ/S). Bảng đối ứng giữ nguyên (lịch sử).
-- ============================================================================

alter table dai_bdm_gan_cau drop constraint dai_bdm_gan_cau_nguon_check;
alter table dai_bdm_gan_cau add constraint dai_bdm_gan_cau_nguon_check check (nguon = any (array['nguoi', 'ai', 'cum', 'doi_ung']));

insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon, at)
select d.ma_cau, d.dang_bai_id, case d.nguon when 'gan_cum' then 'cum' else 'doi_ung' end, now()
  from bdm_cau_dang d join dai_cau_hoi q on q.ma_cau = d.ma_cau
 where d.kho = 'dai' and d.nguon in ('gan_cum', 'doi_ung') and q.loai_cau is distinct from 'dung_sai'
on conflict (ma_cau) do nothing;

create or replace view bdm_cau_dang as
 SELECT q.ma_cau,
    'dai'::text AS kho,
    COALESCE(gc.dang_bai_id, gg.dang_bai_id, dx.dang_bai_id, dxg.dang_bai_id) AS dang_bai_id,
        CASE
            WHEN ((gc.ma_cau IS NOT NULL) OR (gg.ma_cau IS NOT NULL)) THEN 'gan_cau'::text
            WHEN ((dx.ma_cau IS NOT NULL) OR (dxg.ma_cau IS NOT NULL)) THEN 'de_xuat'::text
            ELSE NULL::text
        END AS nguon
   FROM ((((dai_cau_hoi q
     LEFT JOIN dai_bdm_gan_cau gc ON ((gc.ma_cau = q.ma_cau)))
     LEFT JOIN dai_bdm_gan_cau gg ON ((gg.ma_cau = q.parent_ma_cau)))
     LEFT JOIN dai_bdm_de_xuat dx ON ((dx.ma_cau = q.ma_cau)))
     LEFT JOIN dai_bdm_de_xuat dxg ON ((dxg.ma_cau = q.parent_ma_cau)))
  WHERE (COALESCE(gc.dang_bai_id, gg.dang_bai_id, dx.dang_bai_id, dxg.dang_bai_id) IS NOT NULL)
UNION ALL
 SELECT h.ma_cau,
    'hgt'::text AS kho,
    COALESCE(gc.dang_bai_id, gg.dang_bai_id, dx.dang_bai_id, dxg.dang_bai_id) AS dang_bai_id,
        CASE
            WHEN ((gc.ma_cau IS NOT NULL) OR (gg.ma_cau IS NOT NULL)) THEN 'gan_cau'::text
            ELSE 'de_xuat'::text
        END AS nguon
   FROM ((((hgt_cau_hoi h
     LEFT JOIN hgt_bdm_gan_cau gc ON ((gc.ma_cau = h.ma_cau)))
     LEFT JOIN hgt_bdm_gan_cau gg ON ((gg.ma_cau = h.parent_ma_cau)))
     LEFT JOIN hgt_bdm_de_xuat dx ON ((dx.ma_cau = h.ma_cau)))
     LEFT JOIN hgt_bdm_de_xuat dxg ON ((dxg.ma_cau = h.parent_ma_cau)))
  WHERE (COALESCE(gc.dang_bai_id, gg.dang_bai_id, dx.dang_bai_id, dxg.dang_bai_id) IS NOT NULL);
