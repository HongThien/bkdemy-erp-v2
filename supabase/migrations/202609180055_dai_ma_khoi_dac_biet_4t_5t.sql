-- ============================================================================
-- 202609180055 — dai_ma_khoi_dac_biet_4t_5t
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 18/09/2026): migration 202609180046 chốt regex khối = 2 chữ số
-- (`\d{2}`), nhưng khối THẬT gồm 12 giá trị — trong đó `4T` và `5T` là KHỐI
-- RIÊNG (không phải lớp 4/5 tiểu học). Sau khi verify function tôi phát hiện:
--     - lop.khoi có: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 4T, 5T
--     - dai_ban_do: 72 dạng khối '4T' + 16 dạng khối '5T' (active nặng —
--       1215 câu hỏi K4 · 324 rows gami · 3170 rows tu_luyen · 2 lớp đang dạy).
-- Rule `T1 + \d{2} + \d{6}` cũ ⇒ 88 dòng active này BỊ COI LÀ RÁC — sai.
--
-- SỬA: nới ký tự "khối" cho phép 2 digit HOẶC 1 digit + 'T':  `(\d{2}|\dT)`.
--   • Chủ đề    len 6: ^T1(\d{2}|\dT)\d{2}$
--   • Chuyên đề len 8: ^T1(\d{2}|\dT)\d{4}$
--   • Dạng      len 10: ^T1(\d{2}|\dT)\d{6}$
--
-- Sau nới regex: 585 + 88 = 673/689 dòng hợp chuẩn. Còn 16 dòng RÁC thật:
--   - 11 dòng K7 CHƯA có tiền tố T1 (sinh sau migration 202608141259)
--   - 5 dòng K7 nối chuỗi (mã dài 11-15 do renumber nối STT vào cuối mã cũ)
--
-- MẤT GÌ: KHÔNG xoá gì. Chỉ CREATE OR REPLACE fn_dai_ma_hop_le + fn_dai_kiem_ma
--   (đè lên bản trước, giữ chữ ký cũ — không phá caller).
-- ============================================================================

create or replace function public.fn_dai_ma_hop_le(p_ma text, p_tang text)
returns boolean
language sql immutable as $$
  select case p_tang
    when 'chu_de'    then p_ma ~ '^T1(\d{2}|\dT)\d{2}$'
    when 'chuyen_de' then p_ma ~ '^T1(\d{2}|\dT)\d{4}$'
    when 'dang'      then p_ma ~ '^T1(\d{2}|\dT)\d{6}$'
    else null
  end
$$;

comment on function public.fn_dai_ma_hop_le(text, text) is
  'Kiểm mã Đại đúng chuẩn cho tầng {chu_de|chuyen_de|dang}. Khối = 2 digit HOẶC digit+T (4T,5T).';

-- fn_dai_kiem_ma() dùng fn_dai_ma_hop_le nội bộ nên không cần replace,
-- nhưng regex trong LY_DO string là hardcode — cập nhật để thông báo đúng.
create or replace function public.fn_dai_kiem_ma()
returns table (loai text, ma_dang text, ma_chuyen_de text, ma_chu_de text, khoi text, ly_do text)
language sql stable as $$
  select 'chu_de_sai_format'::text, b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_chu_de "' || b.ma_chu_de || '" không match ^T1(\d{2}|\dT)\d{2}$'
    from dai_ban_do b
   where not fn_dai_ma_hop_le(b.ma_chu_de, 'chu_de')
  union all
  select 'chuyen_de_sai_format', b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_chuyen_de "' || b.ma_chuyen_de || '" không match ^T1(\d{2}|\dT)\d{4}$'
    from dai_ban_do b
   where not fn_dai_ma_hop_le(b.ma_chuyen_de, 'chuyen_de')
  union all
  select 'dang_sai_format', b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_dang "' || b.ma_dang || '" không match ^T1(\d{2}|\dT)\d{6}$'
    from dai_ban_do b
   where not fn_dai_ma_hop_le(b.ma_dang, 'dang')
  union all
  select 'dang_khong_thuoc_chuyen_de', b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_dang không bắt đầu bằng ma_chuyen_de'
    from dai_ban_do b
   where b.ma_dang not like b.ma_chuyen_de || '%'
  union all
  select 'chuyen_de_khong_thuoc_chu_de', b.ma_dang, b.ma_chuyen_de, b.ma_chu_de, b.khoi,
         'ma_chuyen_de không bắt đầu bằng ma_chu_de'
    from dai_ban_do b
   where b.ma_chuyen_de not like b.ma_chu_de || '%'
$$;

comment on function public.fn_dai_kiem_ma() is
  'Trả mọi vi phạm bất biến mã bản đồ Đại. Khối chấp nhận \d{2} HOẶC \dT.';

-- Verify sau khi áp: kỳ vọng còn 16 dòng lệch (11 chưa T1 + 5 nối chuỗi K7)
do $$
declare n_sai int;
begin
  select count(*) into n_sai from fn_dai_kiem_ma() where loai like '%_sai_format';
  raise notice 'fn_dai_kiem_ma(): % dòng lệch format sau khi nới khối 4T/5T (kỳ vọng 16)', n_sai / 3;
  -- chia 3 vì mỗi dòng rác thường vi phạm cả 3 tầng (chu_de/chuyen_de/dang cascade sai)
end $$;
