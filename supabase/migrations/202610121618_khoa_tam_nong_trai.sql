-- ============================================================================
-- 202610121618 — khoa_tam_nong_trai: KHOÁ TẠM game Nông trại BK trong app HS
-- VÌ SAO (Thùy 12/10): game mới là bản thử (tiến độ lưu theo thiết bị, bạn bè là bạn ảo, chưa nối xu/ĐHT) ⇒ khoá tới khi làm xong từng bước.
--   · `nong_trai` = công tắc RIÊNG cho game này (đóng ⇒ trong ô Trò chơi hiện "Sắp ra mắt", không vào được) — để sau mở/đóng từng game không đụng cả ô Trò chơi.
--   · `tro_choi` cũng ĐÓNG ngay: ô Trò chơi chỉ có Nông trại + 1 game "sắp ra mắt" nên không còn gì chơi được ⇒ ẩn hẳn khỏi màn chính.
--   Mở lại khi sẵn sàng: Admin → Mở tính năng app HS (hoặc fn_tinh_nang_dat) — KHÔNG cần deploy.
-- MẤT GÌ: không mất gì — thêm 1 dòng danh mục + đặt `mo_tu` (trigger tự ghi tinh_nang_log). Tiến độ chơi của em (trên thiết bị) không bị đụng.
-- ============================================================================
insert into public.tinh_nang (ma, ten, nhom, thu_tu, mo_tu, mo_ta) values
  ('nong_trai', 'Nông trại BK (game)', 'choi', 125, null, 'Trong ô Trò chơi. Đóng = hiện "Sắp ra mắt", không vào được. Mở khi game có lưu theo tài khoản + nối ĐHT/xu.')
on conflict (ma) do nothing;
update public.tinh_nang set mo_tu = null where ma = 'tro_choi' and mo_tu is not null;
