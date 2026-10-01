-- ============================================================================
-- 202609181852 — HÌNH HỌC · Bài: thêm cột `kho_chuan` (fix soạn giáo trình crash im lặng)
-- ----------------------------------------------------------------------------
-- LỖI (CEO 18/09): chọn Bài "Tổng ba góc" cho buổi → buổi vẫn "0 dạng", đơ.
--
-- NGUYÊN NHÂN: `setDangOfBuoi` (tailieu.ts) gọi `autoSuggestByLoai` → `listCauByDang(md, 'hinh_hoc_cau_hoi')`
--   mặc định lọc `.eq('kho_chuan', true)` (spec-kho-chuan §1 mig 202609080912). Bảng hinh_hoc_cau_hoi CHƯA
--   có cột `kho_chuan` ⇒ PostgREST fail ⇒ throw ⇒ addPhan `dang` không chạy ⇒ buổi ở lại 0 dạng.
--   DB xác nhận: 2 dòng phan `buoi` được tạo, 0 dòng phan `dang`.
--
-- FIX: thêm cột `kho_chuan boolean not null default true` — mọi câu Hình học Bài mặc định thuộc kho chuẩn
--   (phase Học chưa có cửa kiểm định máy/AI như Đại; câu đưa vào phase Học coi là dùng được ngay).
--   KHÔNG generated theo `da_duyet` vì phase Học nhập nhanh, chưa duyệt vẫn cần chọn được cho giáo trình.
--   Nếu sau này siết duyệt cho Hình học: đổi thành generated `da_duyet` qua migration mới.
--
-- MẤT GÌ: không. Chỉ thêm 1 cột default true. 0 câu đã có (bảng còn rỗng lúc CEO test).
-- ============================================================================

alter table hinh_hoc_cau_hoi
  add column if not exists kho_chuan boolean not null default true;

-- Partial index cho query .eq('kho_chuan', true) + .is('xoa_at', null) (đường soạn ET/BTVN/giáo trình).
create index if not exists hinh_hoc_cau_hoi_chuan_song_idx
  on hinh_hoc_cau_hoi (dang_chinh) where kho_chuan = true and xoa_at is null;
