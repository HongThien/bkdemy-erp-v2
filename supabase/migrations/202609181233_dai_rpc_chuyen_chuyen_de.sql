-- ============================================================================
-- 202609181233 — dai_rpc_chuyen_chuyen_de
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 18/09 — nối bước 4a): sau `fn_dai_chuyen_dang` (chuyển 1 dạng),
-- cần cấp cho UI kho khả năng chuyển CẢ CHUYÊN ĐỀ (kèm mọi dạng con) sang chủ
-- đề khác. Đây là thao tác thường xuyên khi CEO sắp xếp lại bản đồ (vd nhận ra
-- chuyên đề X thuộc chủ đề B chứ không phải A).
--
-- LOGIC:
--   1. Validate: chuyên đề nguồn tồn tại · chủ đề đích tồn tại (có ≥1 chuyên đề
--      KHÁC nguồn) · không chuyển vào chính chủ đề đang có.
--   2. Sinh new_ma_chuyen_de = fn_dai_sinh_ma_chuyen_de(p_ma_chu_de_moi, null)
--      → max STT+1 trong chủ đề đích. Chuyên đề mới CHƯA có dạng nào ⇒ mọi dạng
--      của chuyên đề nguồn "nhập cư" bảo tồn 2 số STT cuối:
--        old T1070201'01' → new T10703XX + '01'
--   3. Denormalize từ đích: ten_chu_de + khoi (chuyên đề giữ ten_chuyen_de gốc).
--   4. Update dai_ban_do BATCH tất cả dạng của chuyên đề nguồn — 1 lệnh.
--      FK on update cascade tự lo dai_cau_hoi/menh_de/cum_bai/ly_thuyet/thuoc_tinh/tien_de.
--   5. Update dai_chuyen_de_ly_thuyet (PK text — không FK).
--   6. Update text-ref không FK — 8 bảng (giống fn_dai_chuyen_dang) nhưng batch
--      qua mapping temp table thay vì loop từng dạng.
--   7. Trả new_ma_chuyen_de để UI hiện lại.
--
-- Trigger `trg_log_doi_dang` GIỮ nguyên — chuyển chuyên đề đổi meaning (chủ đề
-- khác) → log CHÍNH XÁC. Có thể noisy nếu chuyên đề nhiều câu — chấp nhận.
--
-- MẤT GÌ: không xoá gì. 1 RPC mới.
-- ============================================================================

create or replace function public.fn_dai_chuyen_chuyen_de(
  p_ma_chuyen_de text, p_ma_chu_de_moi text
) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_new_cd     text;
  v_ten_chu    text;
  v_khoi       text;
  v_ten_cd_cu  text;
  t            text;
  bang_textref text[] := array[
    'gami_session_problems','ca_test_cau','bai_test_cau','tu_luyen_dang_lan',
    'buoi_danh_gia_dang','bo_tro_duoi_dang','bo_tro_yeu_dang','canh_bao_yeu'
  ];
begin
  -- 1. Validate nguồn
  select ten_chuyen_de into v_ten_cd_cu
    from dai_ban_do where ma_chuyen_de = p_ma_chuyen_de limit 1;
  if not found then
    raise exception 'fn_dai_chuyen_chuyen_de: chuyên đề "%" không tồn tại', p_ma_chuyen_de;
  end if;

  -- 2. Chủ đề đích tồn tại (có ≥1 chuyên đề KHÁC nguồn) — lấy denormalize
  select ten_chu_de, khoi into v_ten_chu, v_khoi
    from dai_ban_do
   where ma_chu_de = p_ma_chu_de_moi and ma_chuyen_de <> p_ma_chuyen_de
   limit 1;
  if not found then
    raise exception 'fn_dai_chuyen_chuyen_de: chủ đề đích "%" chưa tồn tại (cần ≥1 chuyên đề khác)', p_ma_chu_de_moi;
  end if;

  -- 3. Không chuyển vào chính chủ đề đang có
  if (select ma_chu_de from dai_ban_do where ma_chuyen_de = p_ma_chuyen_de limit 1) = p_ma_chu_de_moi then
    raise exception 'fn_dai_chuyen_chuyen_de: chuyên đề "%" đã ở chủ đề "%"', p_ma_chuyen_de, p_ma_chu_de_moi;
  end if;

  -- 4. Sinh mã chuyên đề mới (max STT+1 trong chủ đề đích)
  v_new_cd := fn_dai_sinh_ma_chuyen_de(p_ma_chu_de_moi, null);

  -- 5. Build mapping ma_dang cũ → mới cho mọi dạng trong chuyên đề nguồn
  --    (bảo tồn 2 số STT cuối) — dùng làm chuẩn cho text-ref update sau.
  create temp table _cd_map (ma_dang_cu text primary key, ma_dang_moi text not null) on commit drop;
  insert into _cd_map (ma_dang_cu, ma_dang_moi)
  select ma_dang, v_new_cd || substring(ma_dang from length(ma_dang) - 1)
    from dai_ban_do where ma_chuyen_de = p_ma_chuyen_de;

  -- 6. Update dai_ban_do — 1 batch (FK cascade tự lo con)
  update dai_ban_do b set
    ma_dang       = m.ma_dang_moi,
    ma_chuyen_de  = v_new_cd,
    ma_chu_de     = p_ma_chu_de_moi,
    ten_chu_de    = v_ten_chu,
    khoi          = v_khoi
  from _cd_map m
  where m.ma_dang_cu = b.ma_dang;

  -- 7. Update dai_chuyen_de_ly_thuyet (PK text, không FK cascade)
  update dai_chuyen_de_ly_thuyet
     set ma_chuyen_de = v_new_cd
   where ma_chuyen_de = p_ma_chuyen_de;

  -- 8. Update text-ref không FK — batch qua _cd_map
  foreach t in array bang_textref loop
    execute format(
      'update public.%I x set ma_dang = m.ma_dang_moi from _cd_map m where m.ma_dang_cu = x.ma_dang',
      t
    );
  end loop;

  return v_new_cd;
end $$;

comment on function public.fn_dai_chuyen_chuyen_de(text, text) is
  'Chuyển 1 chuyên đề Đại + toàn bộ dạng con sang chủ đề đích. Transactional. Trả mã chuyên đề mới. §2.0.';

grant execute on function public.fn_dai_chuyen_chuyen_de(text, text) to authenticated;
