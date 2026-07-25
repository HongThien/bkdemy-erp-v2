-- ============================================================================
-- 202607241948 — bo_tro_yeu_them_nhan
-- ----------------------------------------------------------------------------
-- VÌ SAO: để MỖI CA BỔ TRỢ ĐÓNG LẠI = 1 NHÃN học được về sau.
--  · muc (L1/L2/L3) = CAN THIỆP. Không có nó thì không bao giờ so được cách xử nào ăn.
--  · muc_may_de_xuat + de_xuat_may = máy nghĩ gì lúc đó. Chênh với `muc` chính là chỗ
--    người bác máy — nhiên liệu cho "AI đẻ luật".
--  · diem_luc_mo / so_lan_do_luc_mo = ĐỘ NẶNG LÚC MỞ. Bắt buộc, vì mastery suy động:
--    đổi trọng số hay cửa sổ một lần là vĩnh viễn không dựng lại được con số mà người
--    đã nhìn khi quyết. Và thiếu nó thì L3 luôn trông tệ hơn L1 chỉ vì L3 nhận ca nặng
--    hơn (confounding by indication) → kết luận sai "GV dạy kém hơn TA".
--  · ket_qua + retest_* = KẾT QUẢ. "Đã bổ trợ" là hoạt động; chỉ retest mới biến nó
--    thành nhãn. Thiếu vế này thì 6.000 ca vẫn bằng 0 nhãn.
--
-- MẤT GÌ: KHÔNG mất gì. Chỉ ADD COLUMN / ADD CONSTRAINT / CREATE INDEX.
--         Không DROP, không sửa cột cũ. bo_tro_yeu và bo_tro_yeu_dang đang 0 dòng.
-- ============================================================================

-- ── CA BỔ TRỢ ────────────────────────────────────────────────────────────────
alter table bo_tro_yeu
  add column if not exists muc              smallint,      -- 1=trước/sau giờ · 2=TA riêng · 3=GV/nhân sự key
  add column if not exists muc_may_de_xuat  smallint,      -- máy đề xuất mức nào (lệch với muc = người bác chỗ nào)
  add column if not exists de_xuat_may      jsonb not null default '{}'::jsonb,  -- ảnh chụp lý do/bằng chứng của máy lúc mở
  add column if not exists ket_qua          text,          -- CHỈ điền lúc đóng
  add column if not exists dong_boi         uuid references nhan_su(id),
  add column if not exists ghi_chu_dong     text,
  -- Quy trình (Thùy 07-25): TEAM HỌC THUẬT duyệt ca → OPS xếp lịch (= gắn day_buoi_id ở dòng dạng).
  -- Tách người-duyệt khỏi actor(tạo)/dong_boi(đóng): sau này phân tích "ai duyệt" là 1 chiều nhãn.
  add column if not exists duyet_boi        uuid references nhan_su(id),
  add column if not exists duyet_at         timestamptz;

alter table bo_tro_yeu drop constraint if exists bo_tro_yeu_muc_ck;
alter table bo_tro_yeu add constraint bo_tro_yeu_muc_ck
  check (muc is null or muc in (1, 2, 3));

alter table bo_tro_yeu drop constraint if exists bo_tro_yeu_muc_may_ck;
alter table bo_tro_yeu add constraint bo_tro_yeu_muc_may_ck
  check (muc_may_de_xuat is null or muc_may_de_xuat in (1, 2, 3));

-- 'bo' = mở nhầm / không còn cần (HS nghỉ, dạng bị gỡ…) — PHẢI tách khỏi 'chua_dat',
-- nếu không ca bỏ bị đếm thành ca bổ trợ thất bại và làm lệch mọi thống kê sau này.
alter table bo_tro_yeu drop constraint if exists bo_tro_yeu_ket_qua_ck;
alter table bo_tro_yeu add constraint bo_tro_yeu_ket_qua_ck
  check (ket_qua is null or ket_qua in ('dat', 'mot_phan', 'chua_dat', 'bo'));

-- Đóng ca thì BUỘC có kết quả. Chốt chặn duy nhất giữ cho nhãn không rỗng: không có nó,
-- người bấm "hoàn thành" cho xong việc và ca đó vĩnh viễn vô giá trị với AI về sau.
alter table bo_tro_yeu drop constraint if exists bo_tro_yeu_dong_du_ck;
alter table bo_tro_yeu add constraint bo_tro_yeu_dong_du_ck
  check (trang_thai <> 'hoan_thanh' or (ket_qua is not null and hoan_thanh_at is not null));

-- ── TỪNG DẠNG TRONG CA ───────────────────────────────────────────────────────
alter table bo_tro_yeu_dang
  add column if not exists diem_luc_mo      numeric,   -- mastery của dạng này NGAY LÚC MỞ ca
  add column if not exists so_lan_do_luc_mo smallint,  -- độ tin lúc mở (n) — yếu-thật khác chưa-đo-đủ
  add column if not exists retest_diem      numeric,
  add column if not exists retest_at        timestamptz,
  add column if not exists retest_nguon     text,      -- 'bt' bổ trợ (Thùy 07-25) · 'et'/'mt' nếu đo lại bằng bài giám sát độc lập
  add column if not exists dat              boolean;   -- ĐÓNG CA cho riêng dạng này (retest BT đạt)

-- ⚠ retest MẶC ĐỊNH nguồn 'bt' (bổ trợ). Nhớ: trong DANHGIA_CONFIG bt = 0 ⇒ retest BT ĐÓNG ca
-- nhưng KHÔNG kéo mastery-level ⇒ RA KHỎI DIỆN phải chờ ET/MT độc lập kế tiếp (chống gian lận:
-- dạy lại rồi test ngay không phải bằng chứng năng lực độc lập). Đóng ca ≠ ra khỏi diện — 2 sự kiện.
alter table bo_tro_yeu_dang drop constraint if exists bo_tro_yeu_dang_retest_nguon_ck;
alter table bo_tro_yeu_dang add constraint bo_tro_yeu_dang_retest_nguon_ck
  check (retest_nguon is null or retest_nguon in ('bt', 'et', 'mt'));

-- Hai truy vấn sẽ dùng liên tục: ca đang treo, và dạng đã xếp mà chưa dạy
-- (đúng chỗ rò 45% đang thấy ở bo_tro_duoi).
create index if not exists bo_tro_yeu_treo_idx
  on bo_tro_yeu (trang_thai, created_at) where trang_thai = 'dang_xu';
create index if not exists bo_tro_yeu_dang_chua_day_idx
  on bo_tro_yeu_dang (bo_tro_yeu_id) where day_at is null;

comment on column bo_tro_yeu.muc is
  'L1 trước/sau giờ · L2 TA riêng 1 buổi · L3 GV hoặc nhân sự key. Đây LÀ biến can thiệp của playbook sau này.';
comment on column bo_tro_yeu_dang.diem_luc_mo is
  'Chụp lại vì mastery suy động: đổi trọng số/cửa sổ là mất vĩnh viễn con số người đã nhìn lúc quyết.';
