-- 3 mã đề cho ET Hình (Thùy 21/08, "làm đầy đủ giống Đại"): cấu hình mã đề 2/3 + gán mã đề theo HS,
-- theo khuôn tai_lieu.cau_hinh của Đại — JSON lỏng, khoá theo `phan` ('et'/'mt'...) rồi bên trong khoá
-- theo chữ ký NODE (khoá tự nhiên, CLAUDE.md §2 — không bám id dòng hinh_gt_bai vì saveBuoiSelectionPhan
-- XOÁ-rồi-CHÈN LẠI toàn bộ dòng mỗi lần lưu, id dòng không sống sót qua 1 lần sửa/lưu).
alter table hinh_gt_buoi add column if not exists cau_hinh jsonb not null default '{}'::jsonb;
