-- ============================================================================
-- 202610231604 — mastery_bdm_ban_sao_theo_goc
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Phiên B3 đo 23/10 (danh sách K9 471 câu đã đo chưa có dạng bài mới): 371/471 là BẢN SAO (clone). View `bdm_cau_dang` chỉ cho
--   bản sao đi theo câu gốc khi gốc đã GÁN; gốc chỉ ở ĐỀ XUẤT thì bản sao rơi; nhánh HGT bản sao không theo gốc ở cả gán lẫn đề xuất.
--   Bản sao cùng dạng với gốc (cùng khuôn đề) ⇒ thêm: Đại "đề xuất của gốc" (cuối chuỗi); HGT "gán của gốc" + "đề xuất của gốc".
--   Thay vì chép ~340 dòng đề xuất cho từng bản sao (màn duyệt không hiện các dòng đó). Câu đã quy được KHÔNG đổi — chỉ câu đang NULL
--   có thêm đường (kiểm: so trước/sau toàn view).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thay định nghĩa view (thêm đường cho câu đang chưa quy được).
-- ============================================================================

create or replace view bdm_cau_dang as
  select q.ma_cau, 'dai'::text as kho,
         coalesce(gc.dang_bai_id, gg.dang_bai_id, cu.dang_bai_id, mot.db, dx.dang_bai_id, dxg.dang_bai_id) as dang_bai_id,
         case when gc.ma_cau is not null or gg.ma_cau is not null then 'gan_cau'
              when cu.ma_cum_cu is not null then 'gan_cum'
              when mot.db is not null then 'doi_ung'
              when dx.ma_cau is not null or dxg.ma_cau is not null then 'de_xuat' end as nguon
    from dai_cau_hoi q
    left join dai_cau_hoi g on g.ma_cau = q.parent_ma_cau
    left join dai_bdm_gan_cau gc on gc.ma_cau = q.ma_cau
    left join dai_bdm_gan_cau gg on gg.ma_cau = q.parent_ma_cau
    left join dai_bdm_doi_ung_cum cu on cu.ma_cum_cu = coalesce(q.ma_cum, g.ma_cum)
    left join lateral (   -- dạng cũ gắn ĐÚNG 1 chỗ và chỗ đó là dạng bài
      select min(d.dich_dang_bai) as db from dai_bdm_doi_ung d where d.ma_dang_cu = q.dang_chinh
      having count(*) = 1 and count(d.dich_dang_bai) = 1
    ) mot on true
    left join dai_bdm_de_xuat dx on dx.ma_cau = q.ma_cau
    left join dai_bdm_de_xuat dxg on dxg.ma_cau = q.parent_ma_cau            -- bản sao theo ĐỀ XUẤT của gốc
   where coalesce(gc.dang_bai_id, gg.dang_bai_id, cu.dang_bai_id, mot.db, dx.dang_bai_id, dxg.dang_bai_id) is not null
  union all
  select h.ma_cau, 'hgt', coalesce(gc.dang_bai_id, gg.dang_bai_id, dx.dang_bai_id, dxg.dang_bai_id),
         case when gc.ma_cau is not null or gg.ma_cau is not null then 'gan_cau' else 'de_xuat' end
    from hgt_cau_hoi h
    left join hgt_bdm_gan_cau gc on gc.ma_cau = h.ma_cau
    left join hgt_bdm_gan_cau gg on gg.ma_cau = h.parent_ma_cau              -- bản sao theo GÁN của gốc
    left join hgt_bdm_de_xuat dx on dx.ma_cau = h.ma_cau
    left join hgt_bdm_de_xuat dxg on dxg.ma_cau = h.parent_ma_cau            -- bản sao theo ĐỀ XUẤT của gốc
   where coalesce(gc.dang_bai_id, gg.dang_bai_id, dx.dang_bai_id, dxg.dang_bai_id) is not null;
