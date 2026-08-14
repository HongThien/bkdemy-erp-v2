-- ════════════════════════════════════════════════════════════════════════════
-- TIỀN TỐ cho 2 TẦNG TRÊN — mã CHỦ ĐỀ và CHUYÊN ĐỀ (nối tiếp 202608141259).
--
-- VÌ SAO PHẢI CÓ: migration trước mới gắn tiền tố cho mã DẠNG và mã CÂU. Nhưng mã dạng
-- được SINH bằng cách nối `mã chủ đề → + chuyên đề → + dạng`. Để 2 tầng trên trần số thì
-- bộ sinh mã đẻ ra dữ liệu LẪN LỘN: chủ đề mới ra `T10803` nằm cạnh `0801`/`0802` cũ.
-- Và bản thân 2 tầng đó cũng đang TRÙNG giữa các kho:
--   chủ đề Đại∩KHTN 12 · Đại∩GT 2 · KHTN∩GT 2   |   chuyên đề Đại∩KHTN 25 · Đại∩GT 3 · KHTN∩GT 3
--
-- KHÔNG PHẢI ĐỔI (đã kiểm trên DB, đừng đoán lại):
--   · `tai_lieu.ma_chuyen_de` — NULL toàn bộ 1014/1014 dòng.
--   · `tai_lieu_phan.ref_ma` — không có `loai_phan='lt_chuyen_de'`; mọi ref_ma đã xử ở migration trước.
--   · `*_chuyen_de_ly_thuyet` KHÔNG có FK nào trỏ vào (tra `pg_constraint`) ⇒ update thẳng, không cascade.
--
-- Idempotent: cùng bất biến với migration trước — mã cũ bắt đầu bằng CHỮ SỐ (kể cả legacy
-- `4T05` → `T14T05`), mã mới bắt đầu bằng CHỮ CÁI.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Đại (T1) ────────────────────────────────────────────────────────────────
update dai_ban_do set ma_chu_de    = 'T1'||ma_chu_de    where ma_chu_de    ~ '^[0-9]';
update dai_ban_do set ma_chuyen_de = 'T1'||ma_chuyen_de where ma_chuyen_de ~ '^[0-9]';
update dai_chuyen_de_ly_thuyet set ma_chuyen_de = 'T1'||ma_chuyen_de where ma_chuyen_de ~ '^[0-9]';

-- ── Hình (T2) — tầng 1 = "mảng", tầng 2 = "loại câu hỏi" ─────────────────────
update hinh_ban_do set ma_mang    = 'T2'||ma_mang    where ma_mang    ~ '^[0-9]';
update hinh_ban_do set ma_loai_ch = 'T2'||ma_loai_ch where ma_loai_ch ~ '^[0-9]';

-- ── Hình giải tích (T3) ─────────────────────────────────────────────────────
update hgt_ban_do set ma_chu_de    = 'T3'||ma_chu_de    where ma_chu_de    ~ '^[0-9]';
update hgt_ban_do set ma_chuyen_de = 'T3'||ma_chuyen_de where ma_chuyen_de ~ '^[0-9]';
update hgt_chuyen_de_ly_thuyet set ma_chuyen_de = 'T3'||ma_chuyen_de where ma_chuyen_de ~ '^[0-9]';

-- ── KHTN (K) ────────────────────────────────────────────────────────────────
update khtn_ban_do set ma_chu_de    = 'K'||ma_chu_de    where ma_chu_de    ~ '^[0-9]';
update khtn_ban_do set ma_chuyen_de = 'K'||ma_chuyen_de where ma_chuyen_de ~ '^[0-9]';
update khtn_chuyen_de_ly_thuyet set ma_chuyen_de = 'K'||ma_chuyen_de where ma_chuyen_de ~ '^[0-9]';

-- ── KIỂM trong cùng transaction: mã dạng phải BẮT ĐẦU BẰNG mã chuyên đề của nó ──
-- Đây là bất biến thật của hệ (dạng = chuyên đề + thứ tự 2 số). Lệch = tiền tố gắn sai chỗ.
do $$
declare r record; n int;
begin
  for r in select 'dai_ban_do' t union all select 'khtn_ban_do' union all select 'hgt_ban_do'
  loop
    execute format('select count(*) from %I where ma_dang not like ma_chuyen_de || %L', r.t, '%') into n;
    if n > 0 then raise exception 'LỆCH (%): % dạng có mã KHÔNG bắt đầu bằng mã chuyên đề.', r.t, n; end if;
    execute format('select count(*) from %I where ma_chuyen_de not like ma_chu_de || %L', r.t, '%') into n;
    if n > 0 then raise exception 'LỆCH (%): % chuyên đề có mã KHÔNG bắt đầu bằng mã chủ đề.', r.t, n; end if;
  end loop;
  select count(*) into n from hinh_ban_do where ma_dang_hinh not like ma_loai_ch || '%' or ma_loai_ch not like ma_mang || '%';
  if n > 0 then raise exception 'LỆCH (hinh_ban_do): % dòng gãy chuỗi mảng→loại→dạng.', n; end if;
  raise notice 'OK — mọi kho: dạng ⊃ chuyên đề ⊃ chủ đề, chuỗi mã liền mạch.';
end $$;
