-- ============================================================================
-- 202609181310 — dai_rpc_gop_dang
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 18/09, mid-turn): "chuyển câu thôi. Lý thuyết t tự gộp".
--
-- SCOPE HẸP: gộp = chuyển toàn bộ CÂU của dạng nguồn sang dạng đích. KHÔNG đụng:
--   • dai_cum_bai (cụm bài)
--   • dai_dang_ly_thuyet (CEO tự gộp tay)
--   • dai_dang_thuoc_tinh (thuộc tính)
--   • dai_dang_tien_de (tiền đề)
--   • text-ref lịch sử (gami_session_problems, ca_test_cau, tu_luyen_dang_lan...)
--     — đo lường là SNAPSHOT tại thời điểm đo (câu ở dạng A khi HS làm) → giữ nguyên.
--   • dai_ban_do (dạng nguồn KHÔNG bị xoá — CEO xoá tay sau khi gộp lý thuyết xong).
--
-- CHỈ đụng:
--   • dai_cau_hoi.dang_chinh: A → B
--   • dai_cau_menh_de.dang_chinh: A → B (nếu có mệnh đề gán dạng riêng)
--
-- Trigger `trg_log_doi_dang` GIỮ nguyên — mỗi câu ghi 1 dòng log (dang_cu=A, dang_moi=B),
-- fn_kho_doi_dang_tk có ví dụ đề để train AI gán dạng chính xác hơn lần sau.
--
-- MẤT GÌ: không xoá gì. 1 RPC mới.
-- ============================================================================

create or replace function public.fn_dai_gop_cau_dang(
  p_ma_dang_nguon text, p_ma_dang_dich text
) returns jsonb   -- {so_cau, so_menh_de}
language plpgsql security definer set search_path = public as $$
declare
  n_cau  int;
  n_md   int;
begin
  if p_ma_dang_nguon is null or p_ma_dang_dich is null then
    raise exception 'fn_dai_gop_cau_dang: nguồn/đích không được NULL';
  end if;
  if p_ma_dang_nguon = p_ma_dang_dich then
    raise exception 'fn_dai_gop_cau_dang: nguồn và đích trùng nhau (%)', p_ma_dang_nguon;
  end if;
  if not exists (select 1 from dai_ban_do where ma_dang = p_ma_dang_nguon) then
    raise exception 'fn_dai_gop_cau_dang: dạng nguồn "%" không tồn tại', p_ma_dang_nguon;
  end if;
  if not exists (select 1 from dai_ban_do where ma_dang = p_ma_dang_dich) then
    raise exception 'fn_dai_gop_cau_dang: dạng đích "%" không tồn tại', p_ma_dang_dich;
  end if;

  update dai_cau_hoi set dang_chinh = p_ma_dang_dich where dang_chinh = p_ma_dang_nguon;
  get diagnostics n_cau = row_count;

  update dai_cau_menh_de set dang_chinh = p_ma_dang_dich where dang_chinh = p_ma_dang_nguon;
  get diagnostics n_md = row_count;

  return jsonb_build_object('so_cau', n_cau, 'so_menh_de', n_md);
end $$;

comment on function public.fn_dai_gop_cau_dang(text, text) is
  'Gộp CÂU dạng A→B (chỉ đổi dang_chinh câu + mệnh đề). KHÔNG đụng cụm/lý thuyết/text-ref. Không xoá A.';

grant execute on function public.fn_dai_gop_cau_dang(text, text) to authenticated;
