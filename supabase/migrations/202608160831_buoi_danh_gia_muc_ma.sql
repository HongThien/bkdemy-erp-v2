-- ============================================================================
-- 202608160831 — buoi_danh_gia_muc_ma
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Một MỨC nay có NHIỀU nhãn khác nhau (CEO 16/08): cùng "Mức 4" nhưng "theo kịp
--   bài" / "tốt nhưng chậm" / "khá tốt nhưng còn sai sót" là ba nhận định KHÁC nhau.
--   Số mức (1..5) chỉ nói ĐỘ, không nói VÌ SAO — nên tách 2 chiều:
--     `muc`    = độ (1..5) → dùng để xếp/so sánh/tính, giữ nguyên như cũ.
--     `muc_ma` = mã nhãn cụ thể trong mức đó ('4a','4b'…) → nói VÌ SAO.
--   Lưu MÃ, không lưu câu chữ: sửa câu chữ sau này không được viết lại quá khứ
--   (CLAUDE.md §2 "danh tính bám khoá tự nhiên"). Câu chữ nằm ở MUC_CATALOG trong code.
--
--   `muc_ma` NULL = buổi chấm bằng bộ nhãn CŨ (1 nhãn/mức) — 321 dòng mức 3/4 đang có
--   nghĩa theo nhãn cũ. KHÔNG backfill: gán bừa 1 trong các nhãn mới là bịa nhận định
--   của GV (§1.5 "thà bỏ trống còn hơn đánh sai"). UI đọc nhãn cũ theo số mức cho các
--   dòng này, và đánh dấu rõ là "nhãn cũ".
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Chỉ ADD COLUMN nullable + 2 CHECK. Không đụng dòng nào đang có,
--   không thu hẹp `buoi_danh_gia_muc_chk` (1..5) cũ.
-- ============================================================================

alter table public.buoi_danh_gia add column if not exists muc_ma text;

-- Tập mã hợp lệ. Thêm nhãn mới về sau = migration MỚI nới CHECK này
-- (CLAUDE.md §2.1: thêm giá trị vào union TS mà quên nới CHECK ⇒ DB chặn đúng lúc user bấm nút).
alter table public.buoi_danh_gia drop constraint if exists buoi_danh_gia_muc_ma_chk;
alter table public.buoi_danh_gia add constraint buoi_danh_gia_muc_ma_chk
  check (muc_ma is null or muc_ma in (
    '5a',                    -- Làm đúng bài, làm nhanh
    '4a', '4b', '4c',        -- theo kịp bài / tốt nhưng chậm / khá tốt nhưng còn sai sót
    '3a', '3b', '3c', '3d',  -- quên KT / rất chậm / hay sai sót / đuối tốc độ lớp
    '2a', '2b',              -- không tự làm được / chưa theo kịp, nhiều KT chưa học
    '1a'                     -- chưa tư duy được cách làm bài
  ));

-- Hai cột phải nói CÙNG một chuyện: mã '4b' thì `muc` bắt buộc = 4.
-- Không có ràng buộc này thì client ghi lệch một lần là mọi thống kê theo `muc` sai âm thầm.
alter table public.buoi_danh_gia drop constraint if exists buoi_danh_gia_muc_ma_khop_muc_chk;
alter table public.buoi_danh_gia add constraint buoi_danh_gia_muc_ma_khop_muc_chk
  check (muc_ma is null or (muc is not null and left(muc_ma, 1)::smallint = muc));
