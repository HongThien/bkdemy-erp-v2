-- ============================================================================
-- 202611051711 — bdm_k5_don_vi_do_va_tach_hinh_hoc_phang
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 (bản đồ mới Toán 5): "3 nhóm bài về đơn vị đo m đưa vào 1 chuyên đề mới là chuyên đề Đơn vị đo, thuộc chủ đề Đơn vị đo
--   lường luôn. Nhóm hình học phẳng chia làm các nhóm: diện tích tam giác, hình thang, hình tròn, hình chữ nhật và hình vuông."
-- LÀM (theo đúng chuỗi màn Bản đồ mới làm: chủ đề → chuyên đề + ô → nhóm → fn_bdm_chuyen_nhom / fn_bdm_chuyen_dang_bai; MÃ GỐC GIỮ NGUYÊN):
--   1. Chủ đề MỚI "Đơn vị đo lường" (khối 5, nhánh toan) › chuyên đề MỚI "Đơn vị đo" › chuyển vào 3 nhóm: Đơn vị đo diện tích (NNB01899,
--      từ "Diện tích các hình") · Đơn vị đo thể tích (NNB01900, từ "Diện tích các hình") · Đơn vị đo thời gian (NNB01894, từ "Toán chuyển động").
--      Không nhóm nào có mũi tên tiền đề (đo 05/11) nên chuyển được.
--   2. Chủ đề "Diện tích các hình" › chuyên đề cũ NCH00588: thêm 4 nhóm MỚI và chuyển dạng bài từ nhóm "Hình học phẳng" (NNB01901):
--      Diện tích tam giác ← NDB02146, NDB02147 · Hình thang ← NDB02148, NDB02149 · Hình tròn ← NDB02150, NDB02151 ·
--      Hình chữ nhật và hình vuông ← dạng MỚI "Bài toán thực tế về diện tích hình chữ nhật, hình vuông" + đối ứng + gán câu cho dạng cũ
--      T105110103 "Ôn tập một số đơn vị đo diện tích" (46 câu thửa ruộng HCN + thu hoạch — chỗ treo của mig 202611051707).
--      NDB02152 "Tính diện tích các hình kì dị bằng phương pháp chia hình" (hình ghép nhiều loại) KHÔNG thuộc riêng nhóm nào ⇒ để lại ở
--      nhóm "Hình học phẳng" (không xoá nhóm — luật xoá), hỏi Thùy.
-- MẤT GÌ (Luật xoá): Không xoá gì. Thêm 1 chủ đề, 1 chuyên đề, 1 ô, 4 nhóm, 1 dạng bài, 1 đối ứng, dòng gán; đổi nhom/chủ đề của nhóm/dạng
--   bài bằng hàm chuyển (trigger log ghi vết).
-- ============================================================================
do $$
declare cd text; ch text; n_tg text; n_ht text; n_tr text; n_cn text; d_cn text; n int; v int;
begin
  -- 1. Đơn vị đo lường › Đơn vị đo
  insert into dai_bdm_chu_de (khoi, ten, nhanh) values ('5', 'Đơn vị đo lường', 'toan') returning id into cd;
  insert into dai_bdm_chuyen_de (ten) values ('Đơn vị đo') returning id into ch;
  insert into dai_bdm_o (chu_de_id, chuyen_de_id) values (cd, ch);
  perform fn_bdm_chuyen_nhom('NNB01899', cd, ch, null);
  perform fn_bdm_chuyen_nhom('NNB01900', cd, ch, null);
  perform fn_bdm_chuyen_nhom('NNB01894', cd, ch, null);
  perform fn_bdm_sap_xep('nhom', array['NNB01899', 'NNB01900', 'NNB01894']);

  -- 2. Tách "Hình học phẳng" (NCD00232 › NCH00588)
  insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten) values ('NCD00232', 'NCH00588', 'Diện tích tam giác') returning id into n_tg;
  insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten) values ('NCD00232', 'NCH00588', 'Hình thang') returning id into n_ht;
  insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten) values ('NCD00232', 'NCH00588', 'Hình tròn') returning id into n_tr;
  insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten) values ('NCD00232', 'NCH00588', 'Hình chữ nhật và hình vuông') returning id into n_cn;
  perform fn_bdm_chuyen_dang_bai('NDB02146', n_tg, null);
  perform fn_bdm_chuyen_dang_bai('NDB02147', n_tg, null);
  perform fn_bdm_chuyen_dang_bai('NDB02148', n_ht, null);
  perform fn_bdm_chuyen_dang_bai('NDB02149', n_ht, null);
  perform fn_bdm_chuyen_dang_bai('NDB02150', n_tr, null);
  perform fn_bdm_chuyen_dang_bai('NDB02151', n_tr, null);
  perform fn_bdm_sap_xep('nhom', array['NNB01898', n_tg, n_ht, n_tr, n_cn, 'NNB01901']);

  insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu, muc_do, bac_toi_thieu)
  values (n_cn, 'Bài toán thực tế về diện tích hình chữ nhật, hình vuông',
          'Bài toán lời văn cho kích thước (hoặc quan hệ giữa chiều dài và chiều rộng, ví dụ chiều rộng bằng một phân số của chiều dài) của mảnh đất, thửa ruộng hình chữ nhật / hình vuông; tính diện tích rồi dùng diện tích để trả lời câu hỏi thực tế (sản lượng thu hoạch theo mỗi 100 m², số cây trồng…), có thể phải đổi đơn vị đo diện tích.',
          1, 3, 'B')
  returning id into d_cn;
  insert into dai_bdm_doi_ung (ma_dang_cu, dich_dang_bai) values ('T105110103', d_cn);
  insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
  select c.ma_cau, d_cn, 'doi_ung' from dai_cau_hoi c
   where c.dang_chinh = 'T105110103' and c.xoa_at is null and c.loai_cau <> 'dung_sai'
     and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = c.ma_cau);
  get diagnostics n = row_count;

  -- kiểm: 3 nhóm đã sang chủ đề mới, Hình học phẳng còn đúng 1 dạng, 46 câu thửa ruộng hiện ở dạng mới
  if (select count(*) from dai_bdm_nhom where chu_de_id = cd and chuyen_de_id = ch) <> 3 then raise exception 'Chuyên đề Đơn vị đo không đủ 3 nhóm'; end if;
  if (select count(*) from dai_bdm_dang_bai where nhom_id = 'NNB01901') <> 1 then raise exception 'Hình học phẳng còn lại không phải 1 dạng'; end if;
  select count(*) into v from bdm_cau_dang b join dai_cau_hoi c on c.ma_cau = b.ma_cau where b.dang_bai_id = d_cn and c.xoa_at is null;
  if v < 40 then raise exception 'Dạng HCN chỉ hiện % câu (cần 46)', v; end if;
  raise notice 'Chủ đề % › chuyên đề % · nhóm mới % % % % · dạng % (gán % dòng, hiện % câu)', cd, ch, n_tg, n_ht, n_tr, n_cn, d_cn, n, v;
end $$;
