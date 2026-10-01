-- ============================================================================
-- 202609180046 — dai_ma_chuan_fn
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 18/09/2026): mã bản đồ Đại có 14/689 dạng lệch chuẩn (11 dòng chưa
-- có tiền tố T1 sinh SAU migration 202608141259, và các dòng nối chuỗi mã CŨ vào
-- đuôi mã MỚI khi renumber — sinh mã 11-17 ký tự vô nghĩa; xem
-- `scripts/_check_madang_rac.mjs`). Nguồn bug: không có FUNCTION chuẩn ở DB, mọi
-- luồng sinh mã tự nối chuỗi trong UI/SQL — mỗi nơi sai một kiểu.
--
-- Migration này dựng NGUỒN CÔNG THỨC DUY NHẤT (CLAUDE.md §2.0) cho mã Đại:
--   • fn_dai_ma_hop_le(ma, tang)   — kiểm ĐÚNG chuẩn cho tầng 'chu_de'|'chuyen_de'|'dang'
--   • fn_dai_ma_kho_cha(ma, tang)  — trích mã cha (dạng→chuyên đề, chuyên đề→chủ đề)
--   • fn_dai_sinh_ma_chuyen_de(ma_chu_de[, stt])  — sinh mã chuyên đề mới, cấp STT chưa dùng
--   • fn_dai_sinh_ma_dang(ma_chuyen_de[, stt])    — sinh mã dạng mới, cấp STT chưa dùng
--   • fn_dai_chuyen_dang_ma_moi(ma_dang, ma_chuyen_de_moi) — TÍNH mã dạng sau khi chuyển sang
--        chuyên đề đích (chưa ghi DB) — giữ STT cũ nếu đích chưa dùng, else max+1.
--   • fn_dai_kiem_ma() — trả bảng mọi vi phạm bất biến khắp dai_ban_do (cho CI/verify).
--
-- RULE Đại (đo được từ 675/689 dạng đang đúng — xem `_check_shape_4kho.mjs`):
--   • ma_chu_de     = 'T1' + KK(2) + CD(2)                  → 6 ký tự, regex ^T1\d{4}$
--   • ma_chuyen_de  = ma_chu_de + CE(2)                     → 8 ký tự, regex ^T1\d{6}$
--   • ma_dang       = ma_chuyen_de + DD(2)                  → 10 ký tự, regex ^T1\d{8}$
--
--   Bất biến (đã kiểm ở migration 202608141452):
--     ma_dang LIKE ma_chuyen_de || '%'   AND   ma_chuyen_de LIKE ma_chu_de || '%'
--
-- STT 2 chữ số đủ xa: max hiện có 14 dạng/chuyên đề, 7 chuyên đề/chủ đề, 12 chủ đề/khối
-- (đo `scripts/_check_max_stt.mjs` 18/09). Còn 5-10× dư trước khi tràn 99.
--
-- CHƯA áp CHECK constraint ở migration này — 14 dòng rác sẽ chặn migrate. Sau khi
-- bước 3 (dọn rác) hoàn tất mới áp CHECK ở migration riêng, ràng buộc mọi INSERT/UPDATE
-- sau này phải đúng chuẩn.
--
-- MẤT GÌ: không xoá/drop/alter gì. Chỉ create-or-replace function + comment.
-- ============================================================================

-- ── fn_dai_ma_hop_le(ma, tang) → boolean ────────────────────────────────────
-- p_tang ∈ {'chu_de','chuyen_de','dang'}. NULL mã ⇒ false (không phải NULL).
create or replace function public.fn_dai_ma_hop_le(p_ma text, p_tang text)
returns boolean
language sql immutable as $$
  select case p_tang
    when 'chu_de'    then p_ma ~ '^T1\d{4}$'
    when 'chuyen_de' then p_ma ~ '^T1\d{6}$'
    when 'dang'      then p_ma ~ '^T1\d{8}$'
    else null
  end
$$;

comment on function public.fn_dai_ma_hop_le(text, text) is
  'Kiểm mã Đại đúng chuẩn cho tầng {chu_de|chuyen_de|dang}. NULL/tang sai → NULL. §2.0.';

-- ── fn_dai_ma_kho_cha(ma, tang) → text ──────────────────────────────────────
-- Trích mã cha theo tầng của mã ĐẦU VÀO:
--   tang='dang'      → trả ma_chuyen_de (bỏ 2 số cuối)
--   tang='chuyen_de' → trả ma_chu_de    (bỏ 2 số cuối)
-- Mã đầu vào KHÔNG chuẩn ⇒ raise (không đoán, §1.5).
create or replace function public.fn_dai_ma_kho_cha(p_ma text, p_tang text)
returns text
language plpgsql immutable as $$
begin
  if not fn_dai_ma_hop_le(p_ma, p_tang) then
    raise exception 'fn_dai_ma_kho_cha: mã "%s" không hợp lệ cho tầng "%s"', p_ma, p_tang;
  end if;
  return substring(p_ma from 1 for length(p_ma) - 2);
end
$$;

comment on function public.fn_dai_ma_kho_cha(text, text) is
  'Trích mã cha (bỏ 2 số STT cuối). Mã sai chuẩn → raise, không đoán.';

-- ── fn_dai_sinh_ma_chuyen_de(ma_chu_de[, stt]) → text ───────────────────────
-- p_stt null ⇒ cấp STT chưa dùng: max STT của chuyên đề trong chủ đề đó + 1.
-- p_stt cụ thể ⇒ ghép trực tiếp (0..99). Trùng ⇒ raise.
-- KHÔNG ghi DB — chỉ tính mã.
create or replace function public.fn_dai_sinh_ma_chuyen_de(
  p_ma_chu_de text, p_stt smallint default null
) returns text
language plpgsql as $$
declare
  v_stt smallint;
  v_ma  text;
begin
  if not fn_dai_ma_hop_le(p_ma_chu_de, 'chu_de') then
    raise exception 'fn_dai_sinh_ma_chuyen_de: chủ đề "%s" không hợp lệ', p_ma_chu_de;
  end if;

  if p_stt is null then
    -- Max STT hiện có trong chủ đề — chỉ tính mã ĐÚNG CHUẨN (bỏ qua rác lệch)
    select coalesce(max((substring(ma_chuyen_de from 7 for 2))::smallint), 0) + 1
      into v_stt
      from dai_ban_do
     where ma_chuyen_de like p_ma_chu_de || '%'
       and fn_dai_ma_hop_le(ma_chuyen_de, 'chuyen_de');
  else
    v_stt := p_stt;
  end if;

  if v_stt < 0 or v_stt > 99 then
    raise exception 'fn_dai_sinh_ma_chuyen_de: STT % ngoài phạm vi 0..99', v_stt;
  end if;

  v_ma := p_ma_chu_de || lpad(v_stt::text, 2, '0');

  -- Chống trùng (kể cả với 14 dòng rác đang tồn tại)
  if exists (select 1 from dai_ban_do where ma_chuyen_de = v_ma) then
    raise exception 'fn_dai_sinh_ma_chuyen_de: mã "%s" đã tồn tại', v_ma;
  end if;

  return v_ma;
end
$$;

comment on function public.fn_dai_sinh_ma_chuyen_de(text, smallint) is
  'Sinh mã chuyên đề mới trong chủ đề. p_stt null ⇒ max+1 (chỉ đếm mã đúng chuẩn).';

-- ── fn_dai_sinh_ma_dang(ma_chuyen_de[, stt]) → text ─────────────────────────
create or replace function public.fn_dai_sinh_ma_dang(
  p_ma_chuyen_de text, p_stt smallint default null
) returns text
language plpgsql as $$
declare
  v_stt smallint;
  v_ma  text;
begin
  if not fn_dai_ma_hop_le(p_ma_chuyen_de, 'chuyen_de') then
    raise exception 'fn_dai_sinh_ma_dang: chuyên đề "%s" không hợp lệ', p_ma_chuyen_de;
  end if;

  if p_stt is null then
    select coalesce(max((substring(ma_dang from 9 for 2))::smallint), 0) + 1
      into v_stt
      from dai_ban_do
     where ma_dang like p_ma_chuyen_de || '%'
       and fn_dai_ma_hop_le(ma_dang, 'dang');
  else
    v_stt := p_stt;
  end if;

  if v_stt < 0 or v_stt > 99 then
    raise exception 'fn_dai_sinh_ma_dang: STT % ngoài phạm vi 0..99', v_stt;
  end if;

  v_ma := p_ma_chuyen_de || lpad(v_stt::text, 2, '0');

  if exists (select 1 from dai_ban_do where ma_dang = v_ma) then
    raise exception 'fn_dai_sinh_ma_dang: mã "%s" đã tồn tại', v_ma;
  end if;

  return v_ma;
end
$$;

comment on function public.fn_dai_sinh_ma_dang(text, smallint) is
  'Sinh mã dạng mới trong chuyên đề. p_stt null ⇒ max+1 (chỉ đếm mã đúng chuẩn).';

-- ── fn_dai_chuyen_dang_ma_moi(ma_dang, ma_chuyen_de_moi) → text ─────────────
-- Tính mã dạng MỚI sau khi chuyển sang chuyên đề đích. KHÔNG ghi DB.
-- Rule (CEO 18/09 — Q2 lượt phân tích): LUÔN cấp STT mới trong đích (max+1).
--   Không cố giữ STT cũ — đơn giản, không có "if trùng thì cấp mới" khiến 2 dạng
--   trong cùng đích có cách sinh khác nhau. Trace lịch sử qua bảng log riêng, không
--   qua hình thức mã. Tham số p_ma_dang giữ chỉ để verify (kiểm dạng có thực tồn).
create or replace function public.fn_dai_chuyen_dang_ma_moi(
  p_ma_dang text, p_ma_chuyen_de_moi text
) returns text
language plpgsql as $$
begin
  if not fn_dai_ma_hop_le(p_ma_chuyen_de_moi, 'chuyen_de') then
    raise exception 'fn_dai_chuyen_dang_ma_moi: chuyên đề đích "%s" không hợp lệ', p_ma_chuyen_de_moi;
  end if;
  if not exists (select 1 from dai_ban_do where ma_dang = p_ma_dang) then
    raise exception 'fn_dai_chuyen_dang_ma_moi: mã dạng "%s" không tồn tại', p_ma_dang;
  end if;
  return fn_dai_sinh_ma_dang(p_ma_chuyen_de_moi, null);
end
$$;

comment on function public.fn_dai_chuyen_dang_ma_moi(text, text) is
  'Tính mã dạng mới khi chuyển sang chuyên đề đích (LUÔN cấp STT max+1). §2.0.';

-- ── fn_dai_kiem_ma() → table ────────────────────────────────────────────────
-- Trả mọi vi phạm bất biến. Dùng cho CI/verify + dry-run trước khi dọn rác.
create or replace function public.fn_dai_kiem_ma()
returns table (loai text, ma_dang text, ma_chuyen_de text, ma_chu_de text, khoi text, ly_do text)
language sql stable as $$
  -- 1. Chủ đề sai format
  select 'chu_de_sai_format'::text, b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_chu_de "' || b.ma_chu_de || '" không match ^T1\d{4}$'
    from dai_ban_do b
   where not fn_dai_ma_hop_le(b.ma_chu_de, 'chu_de')
  union all
  -- 2. Chuyên đề sai format
  select 'chuyen_de_sai_format', b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_chuyen_de "' || b.ma_chuyen_de || '" không match ^T1\d{6}$'
    from dai_ban_do b
   where not fn_dai_ma_hop_le(b.ma_chuyen_de, 'chuyen_de')
  union all
  -- 3. Dạng sai format
  select 'dang_sai_format', b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_dang "' || b.ma_dang || '" không match ^T1\d{8}$'
    from dai_ban_do b
   where not fn_dai_ma_hop_le(b.ma_dang, 'dang')
  union all
  -- 4. Bất biến: dạng ⊂ chuyên đề
  select 'dang_khong_thuoc_chuyen_de', b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_dang không bắt đầu bằng ma_chuyen_de'
    from dai_ban_do b
   where b.ma_dang not like b.ma_chuyen_de || '%'
  union all
  -- 5. Bất biến: chuyên đề ⊂ chủ đề
  select 'chuyen_de_khong_thuoc_chu_de', b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_chuyen_de không bắt đầu bằng ma_chu_de'
    from dai_ban_do b
   where b.ma_chuyen_de not like b.ma_chu_de || '%'
$$;

comment on function public.fn_dai_kiem_ma() is
  'Trả mọi vi phạm bất biến mã bản đồ Đại. Dùng cho CI/verify + dry-run bước dọn rác.';

-- ── Self-test khi áp: đếm phải khớp `_check_madang_rac.mjs` (14 dòng lệch) ──
do $$
declare
  n_sai int;
begin
  select count(*) into n_sai from fn_dai_kiem_ma() where loai like '%_sai_format';
  raise notice 'fn_dai_kiem_ma(): % dòng lệch format (đo trước migration = 14)', n_sai;
  -- KHÔNG raise exception — 14 dòng rác đã biết, sẽ dọn ở bước 3.
end $$;
