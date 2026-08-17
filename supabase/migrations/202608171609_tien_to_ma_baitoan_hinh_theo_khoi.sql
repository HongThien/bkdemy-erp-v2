-- ============================================================================
-- 202608171609 — tien_to_ma_baitoan_hinh_theo_khoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 17/08): "mã bài hình phải thêm tiền tố là Lớp chứ, lớp 7 thì phải
--   có tiền tố 07 chứ". `hinh_baitoan.ma` hiện chỉ là 'BT.001'.. — không mang
--   khối, người đọc mã không biết ngay bài thuộc lớp 7/8/9. Format chốt: `BT.07.001`.
--
-- NGUỒN khối: `hinh_baitoan` KHÔNG có cột `khoi` — khối suy qua `mo_hinh_id` →
--   `hinh_mo_hinh.khoi`. Đã khảo sát DB sống trước khi viết: 24/24 bài toán hiện
--   có, mo_hinh của CẢ 24 đều có khoi (7×8 · 8×14 · 9×2), không NULL nào.
--
-- KHÔNG ĐỔI SỐ THỨ TỰ — chỉ thêm tiền tố khối vào mã CŨ (BT.036 → BT.07.036).
--   Giữ nguyên số cũ vì: (1) `hinh_baitoan.ma` không bị tham chiếu bằng TEXT ở
--   bất cứ đâu khác trong repo — mọi bảng con (`hinh_baitoan_bien_the`,
--   `hinh_cach_giai`, `hinh_cach_tien_de`, `hinh_y`…) trỏ bằng `baitoan_id` uuid,
--   nên đổi mã ở đây AN TOÀN hơn hẳn vụ đổi `ma_dang`/`ma_cau` hôm 14/08 (đo bằng
--   `grep` + `information_schema` trước khi viết dòng SQL nào — không đoán);
--   (2) mọi nơi trong code chỉ dùng `.ma.localeCompare()` làm khoá sort phụ (sau
--   `cap`), không parse cấu trúc chuỗi ⇒ đổi định dạng không phá logic hiển thị;
--   (3) số cũ vẫn là danh tính lịch sử hữu ích khi đối chiếu ngược ảnh/giấy đã in
--   trước migration này.
--
-- SEQUENCE giữ NGUYÊN — `hinh_baitoan_seq` vẫn là MỘT dải số chung xuyên khối
-- (bài toán mới sinh ra tiếp số 050, 051… bất kể khối nào), chỉ thêm khối làm
-- tiền tố hiển thị. Không tách sequence riêng theo khối — không có nhu cầu đánh
-- số lại từ 001 mỗi khối, và tách ra thì mỗi khối mới cần một sequence riêng,
-- phức tạp hơn cho lợi ích không ai yêu cầu.
--
-- Từ nay `ma` sinh qua TRIGGER (không còn qua DEFAULT) vì DEFAULT không đọc được
-- cột khác của cùng dòng (`mo_hinh_id`) để tra khối — phải là trigger mới truy
-- được `hinh_mo_hinh.khoi` lúc INSERT.
--   Mô hình CHƯA gán khối (`khoi is null`) mà tạo bài toán ⇒ trigger CHẶN, báo lỗi
--   rõ ràng, không tự bịa khối '00' (§1.5 "thà bỏ trống còn hơn đánh sai" — ở đây
--   là "thà chặn còn hơn sinh mã sai lớp").
--
-- MẤT GÌ: không xoá/thu hẹp gì. Đổi GIÁ TRỊ cột `ma` của 24 dòng hiện có (số cũ
--   được GIỮ NGUYÊN bên trong mã mới, không mất thông tin định danh); đổi cách
--   sinh mã cho dòng MỚI (DEFAULT → TRIGGER).
-- ============================================================================

-- ── 1. Backfill 24 dòng hiện có: chèn khối vào GIỮA, giữ nguyên số ────────────
update hinh_baitoan bt
   set ma = 'BT.' || lpad(mh.khoi, 2, '0') || '.' || lpad(substring(bt.ma from 'BT\.(\d+)$'), 3, '0')
  from hinh_mo_hinh mh
 where mh.id = bt.mo_hinh_id
   and bt.ma ~ '^BT\.\d+$';                          -- idempotent: mã đã có khối (chạy lại) thì bỏ qua

-- KIỂM: không dòng nào bị bỏ sót (mo_hinh khối NULL sẽ không khớp regex thay thế
-- → mã vẫn giữ dạng cũ 'BT.NNN', guard này bắt được ngay).
do $$
declare n_cu int; n int;
begin
  select count(*) into n_cu from hinh_baitoan where ma ~ '^BT\.\d+$';
  if n_cu > 0 then
    raise exception 'BACKFILL SÓT: % bài toán còn mã kiểu cũ (mo_hinh của chúng thiếu khoi) — gán khoi cho mo_hinh rồi chạy lại migration.', n_cu;
  end if;
  select count(*) into n from hinh_baitoan where ma ~ '^BT\.\d{2}\.\d{3}$';
  raise notice 'hinh_baitoan: % dòng đã mang tiền tố khối dạng BT.KK.NNN ✓', n;
end $$;

-- ── 2. TRIGGER sinh mã cho dòng MỚI (thay DEFAULT — cần đọc mo_hinh_id) ───────
create or replace function hinh_baitoan_gen_ma() returns trigger language plpgsql as $$
declare v_khoi text;
begin
  if new.ma is not null then return new; end if;      -- cho phép ghi đè tay nếu cần
  select khoi into v_khoi from hinh_mo_hinh where id = new.mo_hinh_id;
  if v_khoi is null then
    raise exception 'Mô hình (id=%) chưa gán khối — gán khối cho mô hình trước khi tạo bài toán, để mã không bị sai lớp.', new.mo_hinh_id;
  end if;
  new.ma := 'BT.' || lpad(v_khoi, 2, '0') || '.' || lpad(nextval('hinh_baitoan_seq')::text, 3, '0');
  return new;
end $$;

drop trigger if exists hinh_baitoan_gen_ma_trg on hinh_baitoan;
create trigger hinh_baitoan_gen_ma_trg
  before insert on hinh_baitoan
  for each row execute function hinh_baitoan_gen_ma();

alter table hinh_baitoan alter column ma drop default;
