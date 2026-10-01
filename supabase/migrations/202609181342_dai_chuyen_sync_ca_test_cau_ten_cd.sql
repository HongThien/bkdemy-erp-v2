-- ============================================================================
-- 202609181342 — dai_chuyen_sync_ca_test_cau_ten_cd
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 18/09 mid-turn: "Test đầu vào chưa load được chuyên đề mới"):
--   `ca_test_cau` giữ SNAPSHOT `ten_chuyen_de` + `muc_do` tại thời điểm tạo ca test
--   (không JOIN dai_ban_do runtime — phiếu fn_test_dau_vao_phieu đọc thẳng snapshot).
--   RPC `fn_dai_chuyen_dang` (mig 202609181123) chỉ update `ca_test_cau.ma_dang` khi
--   chuyển dạng qua chuyên đề khác — QUÊN sync `ten_chuyen_de` + `muc_do` → phiếu hiện
--   tên chuyên đề CŨ (câu đã đổi dạng nhưng nhãn hiển thị vẫn cũ).
--
-- LÀM 2 VIỆC:
--   (a) SYNC RETROACTIVE — dọn snapshot stale cho toàn bộ ca_test_cau đang lệch với
--       dai_ban_do (sau khi CEO chuyển 1 đống dạng bằng UI mới).
--   (b) REPLACE fn_dai_chuyen_dang — thêm 1 lệnh update ca_test_cau riêng để đồng
--       thời set ten_chuyen_de + muc_do = giá trị mới (denormalize từ dạng đích).
--
-- KHÔNG đụng:
--   • fn_dai_chuyen_chuyen_de — chuyên đề chỉ đổi mã, KHÔNG đổi tên → ca_test_cau
--     không cần sync ten_chuyen_de. muc_do của dạng cũng không đổi khi cả chuyên đề
--     chuyển sang chủ đề khác.
--   • fn_dai_gop_cau_dang — chỉ đổi dang_chinh câu, ca_test_cau vẫn giữ mã dạng cũ
--     là ĐÚNG (snapshot lịch sử — HS làm câu này khi câu thuộc dạng cũ).
--
-- MẤT GÌ: KHÔNG. UPDATE trên ca_test_cau (chỉ dòng lệch) + CREATE OR REPLACE fn.
-- ============================================================================

-- ── (a) SYNC RETROACTIVE ────────────────────────────────────────────────────
update public.ca_test_cau cc
   set ten_chuyen_de = bd.ten_chuyen_de,
       muc_do        = bd.muc_do
  from public.dai_ban_do bd
 where bd.ma_dang = cc.ma_dang
   and (cc.ten_chuyen_de is distinct from bd.ten_chuyen_de
        or cc.muc_do is distinct from bd.muc_do);

-- ── (b) REPLACE fn_dai_chuyen_dang — thêm sync ten_chuyen_de + muc_do ───────
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
  v_muc_do       smallint;
  t              text;
  bang_textref_chi_ma_dang text[] := array[
    'gami_session_problems','bai_test_cau','tu_luyen_dang_lan',
    'buoi_danh_gia_dang','bo_tro_duoi_dang','bo_tro_yeu_dang','canh_bao_yeu'
  ];
begin
  if not exists (select 1 from dai_ban_do where ma_dang = p_ma_dang) then
    raise exception 'fn_dai_chuyen_dang: dạng "%" không tồn tại', p_ma_dang;
  end if;

  -- Denormalize từ dạng khác cùng chuyên đề đích (lấy muc_do luôn)
  select ten_chuyen_de, ma_chu_de, ten_chu_de, khoi, muc_do
    into v_ten_cd, v_ma_chu_de, v_ten_chu_de, v_khoi, v_muc_do
    from dai_ban_do
   where ma_chuyen_de = p_ma_chuyen_de_moi and ma_dang <> p_ma_dang
   limit 1;
  if not found then
    raise exception 'fn_dai_chuyen_dang: chuyên đề đích "%" chưa tồn tại (cần ≥1 dạng khác — tạo chuyên đề mới bằng luồng riêng)', p_ma_chuyen_de_moi;
  end if;

  if (select ma_chuyen_de from dai_ban_do where ma_dang = p_ma_dang) = p_ma_chuyen_de_moi then
    raise exception 'fn_dai_chuyen_dang: dạng "%" đã ở chuyên đề "%"', p_ma_dang, p_ma_chuyen_de_moi;
  end if;

  v_new_ma_dang := fn_dai_chuyen_dang_ma_moi(p_ma_dang, p_ma_chuyen_de_moi);

  -- Update dai_ban_do — FK cascade tự lo bảng con
  update dai_ban_do set
    ma_dang       = v_new_ma_dang,
    ma_chuyen_de  = p_ma_chuyen_de_moi,
    ten_chuyen_de = v_ten_cd,
    ma_chu_de     = v_ma_chu_de,
    ten_chu_de    = v_ten_chu_de,
    khoi          = v_khoi
  where ma_dang = p_ma_dang;

  -- ca_test_cau có SNAPSHOT ten_chuyen_de + muc_do → sync TẤT CẢ trong 1 update
  update public.ca_test_cau set
    ma_dang       = v_new_ma_dang,
    ten_chuyen_de = v_ten_cd,
    muc_do        = v_muc_do
  where ma_dang = p_ma_dang;

  -- Bảng text-ref còn lại chỉ có cột ma_dang → update loop
  foreach t in array bang_textref_chi_ma_dang loop
    execute format('update public.%I set ma_dang = %L where ma_dang = %L', t, v_new_ma_dang, p_ma_dang);
  end loop;

  return v_new_ma_dang;
end $$;

-- Grant giữ nguyên (đã có từ mig 202609181123).

-- Verify: đo còn dòng ca_test_cau nào lệch snapshot không (kỳ vọng 0 sau khi sync)
do $$
declare n int;
begin
  select count(*) into n from ca_test_cau cc
    join dai_ban_do bd on bd.ma_dang = cc.ma_dang
   where cc.ten_chuyen_de is distinct from bd.ten_chuyen_de;
  raise notice 'Sau sync: % dòng ca_test_cau còn lệch ten_chuyen_de với dai_ban_do (kỳ vọng 0)', n;
end $$;
