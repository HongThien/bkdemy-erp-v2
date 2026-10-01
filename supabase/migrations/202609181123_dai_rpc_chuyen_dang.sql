-- ============================================================================
-- 202609181123 — dai_rpc_chuyen_dang
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 18/09 — bước 4 chiến dịch chuẩn hoá mã bản đồ Đại):
-- Sau bước 3 kho sạch + có `fn_dai_chuyen_dang_ma_moi` (thuần tính), cần RPC
-- transactional để UI kho gọi 1 phát: đổi mã dạng + cascade text-ref + đồng bộ
-- 3 cột denormalize (ma_chuyen_de/ma_chu_de/ten_*) trong dai_ban_do.
--
-- KHÁC bước 3 (rename mass): CHUYỂN 1 dạng qua chuyên đề khác = dạng ĐỔI NGHĨA
-- (thuộc chủ đề khác, nhóm khái niệm khác). Log trigger `trg_log_doi_dang` GIỮ
-- NGUYÊN — mỗi câu bám dạng đó sẽ có 1 log entry (dang_cu → dang_moi) đúng nghĩa,
-- không phải "backfill giả" như bước 3.
--
-- LOGIC:
--   1. Validate: dạng tồn tại · chuyên đề đích tồn tại (có ≥1 dạng khác).
--   2. Compute new_ma_dang = fn_dai_chuyen_dang_ma_moi(...).
--   3. Update dai_ban_do (ma_dang + 4 cột denormalize). FK on update cascade tự lo:
--      dai_cau_hoi.dang_chinh, dai_cau_menh_de.dang_chinh, dai_cum_bai.ma_dang,
--      dai_dang_ly_thuyet.ma_dang, dai_dang_thuoc_tinh.ma_dang, dai_dang_tien_de×2.
--   4. Update text-ref không FK: gami_session_problems, ca_test_cau, bai_test_cau,
--      tu_luyen_dang_lan, buoi_danh_gia_dang, bo_tro_duoi_dang, bo_tro_yeu_dang,
--      canh_bao_yeu.
--   5. Trả new_ma_dang cho UI hiện lại.
--
-- SECURITY: `security definer` — chạy với quyền owner (claude_build sở hữu bảng).
-- Grant execute to authenticated. Bên trong tự kiểm nghiệp vụ (không cho phép
-- chuyển sang chuyên đề KHÔNG tồn tại — người dùng phải tạo chuyên đề mới bằng
-- luồng khác nếu cần).
--
-- MẤT GÌ: không xoá gì. Chỉ tạo 1 RPC mới.
-- ============================================================================

create or replace function public.fn_dai_chuyen_dang(
  p_ma_dang text, p_ma_chuyen_de_moi text
) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_new_ma_dang  text;
  v_ten_cd       text;
  v_ma_chu_de    text;
  v_ten_chu_de   text;
  v_khoi         text;
  t              text;
  bang_textref   text[] := array[
    'gami_session_problems','ca_test_cau','bai_test_cau','tu_luyen_dang_lan',
    'buoi_danh_gia_dang','bo_tro_duoi_dang','bo_tro_yeu_dang','canh_bao_yeu'
  ];
begin
  -- 1. Validate dạng nguồn
  if not exists (select 1 from dai_ban_do where ma_dang = p_ma_dang) then
    raise exception 'fn_dai_chuyen_dang: dạng "%" không tồn tại', p_ma_dang;
  end if;

  -- 2. Chuyên đề đích tồn tại (có ≥1 dạng KHÁC dạng nguồn) — lấy denormalize từ đó
  select ten_chuyen_de, ma_chu_de, ten_chu_de, khoi
    into v_ten_cd, v_ma_chu_de, v_ten_chu_de, v_khoi
    from dai_ban_do
   where ma_chuyen_de = p_ma_chuyen_de_moi and ma_dang <> p_ma_dang
   limit 1;
  if not found then
    raise exception 'fn_dai_chuyen_dang: chuyên đề đích "%" chưa tồn tại (cần ≥1 dạng khác — tạo chuyên đề mới bằng luồng riêng)', p_ma_chuyen_de_moi;
  end if;

  -- 3. Không chuyển vào chính chuyên đề đang có
  if (select ma_chuyen_de from dai_ban_do where ma_dang = p_ma_dang) = p_ma_chuyen_de_moi then
    raise exception 'fn_dai_chuyen_dang: dạng "%" đã ở chuyên đề "%"', p_ma_dang, p_ma_chuyen_de_moi;
  end if;

  -- 4. Tính mã mới (LUÔN max+1 trong đích — không giữ STT cũ)
  v_new_ma_dang := fn_dai_chuyen_dang_ma_moi(p_ma_dang, p_ma_chuyen_de_moi);

  -- 5. Update dai_ban_do — FK cascade tự update dai_cau_hoi/menh_de/cum_bai/ly_thuyet/thuoc_tinh/tien_de
  update dai_ban_do set
    ma_dang       = v_new_ma_dang,
    ma_chuyen_de  = p_ma_chuyen_de_moi,
    ten_chuyen_de = v_ten_cd,
    ma_chu_de     = v_ma_chu_de,
    ten_chu_de    = v_ten_chu_de,
    khoi          = v_khoi
  where ma_dang = p_ma_dang;

  -- 6. Update text-ref không FK — dùng ma_dang cũ để match, đổi sang mới
  foreach t in array bang_textref loop
    execute format('update public.%I set ma_dang = %L where ma_dang = %L', t, v_new_ma_dang, p_ma_dang);
  end loop;

  return v_new_ma_dang;
end $$;

comment on function public.fn_dai_chuyen_dang(text, text) is
  'Chuyển 1 dạng Đại sang chuyên đề đích. Transactional. Trả mã dạng mới. §2.0.';

grant execute on function public.fn_dai_chuyen_dang(text, text) to authenticated;
