-- ============================================================================
-- 202610252357 — the_gioi_mo_rong_icon_sticker
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Đợt 2 bộ hình Thế giới BK (design/DON-HANG-THE-GIOI-EMOJI-2.md): ChatGPT đã vẽ xong 20 icon thả cảm xúc + 47 sticker bình luận
--   + 6 sticker thú phụ. Danh mục DB phải có mã tương ứng thì client mới hiện được (hình gắn theo mã ở gami/hinh.ts, không đổi DB).
--   Danh mục + lý do chọn: design/THE-GIOI-BK-mo-rong-sticker-cam-xuc-meme.md (mục A, B, G — lọc phù hợp học sinh).
--
-- CHỈ THÊM dòng — không sửa/xoá mã cũ (bình luận cũ trỏ FK theo mã). `on conflict do nothing` ⇒ chạy lại vô hại.
-- KHÔNG có câu bình luận (loai='cau') — chờ Thùy lọc danh sách (mục C file đề xuất), sẽ là migration riêng.
-- CHƯA có s_huy_chuong 🏅 (chưa có hình) — thêm sau khi vẽ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: chỉ INSERT.
-- ============================================================================

-- ── A. Icon thả cảm xúc +20 (thu_tu 23–42; icon BẮT BUỘC có nhan — CHECK the_gioi_danh_muc_nhan_check) ───────────
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhan, nhom, thu_tu) values
  ('choang',      'icon', '🤩',  'Choáng',      '{chung}', 23), ('cam_dong',   'icon', '🥹',  'Xúc động',   '{chung}', 24),
  ('chuc_mung',   'icon', '🎉',  'Chúc mừng',   '{chung}', 25), ('gio_tay',    'icon', '🙌',  'Hoan hô',    '{chung}', 26),
  ('me',          'icon', '😍',  'Mê',          '{chung}', 27), ('lap_lanh',   'icon', '✨',  'Lấp lánh',   '{chung}', 28),
  ('om',          'icon', '🫂',  'Ôm cái',      '{chung}', 29), ('ruc_ro',     'icon', '🌈',  'Rực rỡ',     '{chung}', 30),
  ('cuoi_tuoi',   'icon', '😊',  'Vui',         '{chung}', 31), ('cam_on_ban', 'icon', '🙏',  'Cảm ơn',     '{chung}', 32),
  ('on_ap',       'icon', '👌',  'Chuẩn',       '{chung}', 33), ('tim_sang',   'icon', '💖',  'Tim sáng',   '{chung}', 34),
  ('huong_duong', 'icon', '🌻',  'Tươi sáng',   '{chung}', 35), ('toa_nang',   'icon', '☀️',  'Toả nắng',   '{chung}', 36),
  ('bong_bay',    'icon', '🎈',  'Vui lây',     '{chung}', 37), ('cau_may',    'icon', '🤞',  'Cầu may',    '{chung}', 38),
  ('chien_thang', 'icon', '✌️',  'Chiến thắng', '{chung}', 39), ('hang_nhat',  'icon', '🥇',  'Hạng nhất',  '{chung}', 40),
  ('cham_hoc',    'icon', '📚',  'Chăm học',    '{chung}', 41), ('hoc_ba',     'icon', '🎓',  'Học bá',     '{chung}', 42)
on conflict (ma) do nothing;

-- ── B. Sticker bình luận +53 = 47 + 6 thú phụ (thu_tu 13–65). noi_dung = emoji TẠM khi hình chưa tải được; nhan = NULL (CHECK: chỉ icon có nhan) ──
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhom, thu_tu) values
  -- ăn mừng / hype
  ('s_choang',    'sticker', '🤩', '{chung}', 13), ('s_me',        'sticker', '😍', '{chung}', 14), ('s_cam_dong',  'sticker', '🥹', '{chung}', 15),
  ('s_gio_tay',   'sticker', '🙌', '{chung}', 16), ('s_phao_giay', 'sticker', '🎉', '{chung}', 17), ('s_phao_hoa',  'sticker', '🎊', '{chung}', 18),
  ('s_om',        'sticker', '🫂', '{chung}', 19), ('s_thuong',    'sticker', '🥰', '{chung}', 20), ('s_lap_lanh',  'sticker', '✨', '{chung}', 21),
  ('s_cau_vong',  'sticker', '🌈', '{chung}', 22), ('s_sao_bang',  'sticker', '💫', '{chung}', 23), ('s_ngoi_sao',  'sticker', '🌟', '{chung}', 24),
  -- học tập
  ('s_sach',      'sticker', '📚', '{hoc}',   25), ('s_viet_bai',  'sticker', '✍️', '{hoc}',   26), ('s_thuoc_ke',  'sticker', '📐', '{hoc}',   27),
  ('s_ong_nghiem','sticker', '🧪', '{hoc}',   28), ('s_kinh_hien_vi','sticker','🔬','{hoc}',   29), ('s_cu_nhan',   'sticker', '🎓', '{hoc}',   30),
  ('s_y_tuong',   'sticker', '💡', '{hoc}',   31), ('s_cu_meo',    'sticker', '🦉', '{hoc}',   32), ('s_chia_khoa', 'sticker', '🗝️', '{hoc}',   33),
  ('s_bieu_do_len','sticker','📈', '{hoc}',   34), ('s_huy_chuong_vang','sticker','🥇','{hoc}', 35),
  -- nỗ lực / bền bỉ
  ('s_rua',       'sticker', '🐢', '{noluc}', 36), ('s_kien',      'sticker', '🐜', '{noluc}', 37), ('s_nui',       'sticker', '⛰️', '{noluc}', 38),
  ('s_leo_nui',   'sticker', '🧗', '{noluc}', 39), ('s_khien',     'sticker', '🛡️', '{noluc}', 40), ('s_kiem',      'sticker', '⚔️', '{noluc}', 41),
  ('s_lua_manh',  'sticker', '❤️‍🔥', '{noluc}', 42), ('s_dong_ho',   'sticker', '⏳', '{noluc}', 43),
  -- game / trận
  ('s_game',      'sticker', '🎮', '{game}',  44), ('s_cu_dam',    'sticker', '🥊', '{game}',  45), ('s_pao',       'sticker', '🏰', '{game}',  46),
  ('s_rong',      'sticker', '🐲', '{game}',  47), ('s_kho_bau',   'sticker', '🪙', '{game}',  48), ('s_ruong',     'sticker', '🎁', '{game}',  49),
  ('s_ma_thuat',  'sticker', '🪄', '{game}',  50), ('s_hoa_tien',  'sticker', '☄️', '{game}',  51),
  -- may mắn
  ('s_li_xi',     'sticker', '🧧', '{mayman}',52), ('s_cho_may',   'sticker', '🐱', '{mayman}',53), ('s_ngua',      'sticker', '🐴', '{mayman}',54),
  ('s_sao_may_man','sticker','🌠', '{mayman}',55),
  -- thú dễ thương
  ('s_meo',       'sticker', '🐱', '{chung}', 56), ('s_cun',       'sticker', '🐶', '{chung}', 57), ('s_ech',       'sticker', '🐸', '{chung}', 58),
  ('s_gau_truc',  'sticker', '🐼', '{chung}', 59),
  -- thú phụ (Phần 4 của đơn)
  ('s_cao',       'sticker', '🦊', '{chung}', 60), ('s_ky_lan',    'sticker', '🦄', '{chung}', 61), ('s_su_tu',     'sticker', '🦁', '{chung}', 62),
  ('s_chim_cut',  'sticker', '🐧', '{chung}', 63), ('s_tho',       'sticker', '🐰', '{chung}', 64), ('s_ga_con',    'sticker', '🐥', '{chung}', 65)
on conflict (ma) do nothing;
