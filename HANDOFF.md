# HANDOFF — Kho (Bản đồ kiến thức), phiên 2026-06-06

> Tổng kết để tiếp tục ở máy khác (không còn context chat). Đọc nguyên file này trước.
> Bối cảnh: **tạm dừng mockup TA**, ưu tiên dựng **tool Kho** trong màn Admin. Mới làm xong **nhánh Đại**.

---

## ⚠ VỀ NHÀ — 3 thứ KHÔNG theo git, phải tự lo

1. **`.env` và `.env.local` bị `.gitignore`** (chứa secret) → `git pull` KHÔNG có. Phải **tự copy 2 file này** sang máy nhà (qua USB/chat riêng), nếu không client + migration không kết nối được DB.
   - `.env` → `DATABASE_URL` = role **`claude_build`** (CÓ quyền DDL — để chạy migration).
   - `.env.local` → `VITE_SUPABASE_URL` + `VITE_SUPABASE_KEY` (anon key — client web đọc/ghi).
2. **`node_modules`** bị ignore → ở nhà chạy **`npm install`** (có `package-lock.json` nên khớp y hệt).
3. **DB Supabase là cloud dùng chung** → migration `0002`/`0003` **ĐÃ áp vào DB live rồi**. Ở nhà **ĐỪNG chạy lại** migration, DB đã ở trạng thái đúng. Chỉ cần code + 2 file env.

**Chạy:** `cd bkdemy-erp-v2 && npm install && npm run dev` → http://localhost:5173
**Vào tool:** góc phải trên đổi vai sang **Thùy — Founder** (Lộc/TA không có quyền admin) → tab **Admin** → cây trái **Danh mục → Bản đồ kiến thức (Kho)** → tab **Đại số**, chọn **Khối**, **+ Thêm dạng**.

---

## Đã quyết (kèm lý do — đừng vô tình phá)

- **Build THẬT, wire Supabase** (không mock) cho Kho — vì schema Kho đã đông cứng & đã có trong DB. Đây là **ngoại lệ** so với phần còn lại của shell (vốn mock-first view-first).
- **Kiến trúc seam:** UI không gọi `supabase` trực tiếp, chỉ qua **`src/lib/kho/api.ts`** (data-layer). Sau muốn đổi nguồn (view Postgres / mock) không phải sửa component.
- **Bỏ tầng Chương** (migration `0002`): Đại còn **3 tầng** Chủ đề → Chuyên đề → **Dạng**. Lý do: Chương phạm vi quá rộng, không ai dùng để đánh giá. Thêm lại sau dễ (≈7 chương/năm).
- **Thêm chiều "bậc lớp" S>A>B>C** (migration `0002`) cho **mỗi dạng cả Đại lẫn Hình**:
  - Cột `bac_toi_thieu` trên `dai_ban_do` + `hinh_ban_do`, FK → danh mục **`lop_bac`** (`thu_tu`: S=4,A=3,B=2,C=1).
  - Nghĩa: bậc lớp **thấp nhất** còn học dạng đó. Lớp bậc T học dạng D ⟺ `thu_tu(T) ≥ thu_tu(D.bac_toi_thieu)` (tập "lớp học" **đóng-lên-trên**).
  - **ĐỘC LẬP với `muc_do` (độ khó 1–5)** — đây là *phạm vi kiến thức*, không phải độ khó.
  - Tác dụng: làm **must-exist tương đối theo bậc lớp** → mẫu số đánh giá đúng (lớp S 300 dạng vs lớp B 200 dạng). Cái v1 thiếu.
  - ⚠ ĐỪNG nhầm `bac_toi_thieu` (bậc lớp S/A/B/C) với `khoi` (khối 6–12 = grade).
- **Mã = hệ thống tự gợi ý, người sửa được** (mã vị trí):
  - Chủ đề `khối(2)+stt(2)` = `0701` · Chuyên đề `+stt(2)` = `070101` · Dạng `+stt(2)` = `07010103` (**stt trong chuyên đề** — Option A; Option B bị đụng mã chuyên đề).
  - Append-only: stt mới = max anh em +1 (xoá để lại lỗ, không đánh lại số). Form điền sẵn gợi ý, ô **Mã dạng sửa tay được** để chen/đổi.
  - **Chỉ `ma_dang` là FK-target** (câu hỏi `dai_cau_hoi.dang_chinh` + `dai_dang_thuoc_tinh` trỏ vào) → phải giữ ổn định; **sửa dạng thì khoá mã**. `ma_chu_de`/`ma_chuyen_de` chỉ là chữ denormalize, không ai trỏ → đổi thoải mái.
- **Gu UI (Thùy chốt):** **Admin = SaaS/Linear** (đã áp cho màn Kho: accent indigo, segmented, card crisp). **Nhân sự = Google Classroom** (CHƯA làm).
- Chọn độ khó/bậc lớp = **segmented 1-click** (không dropdown). Popup rộng 680px.

---

## Trạng thái schema (DB live, 14 bảng)

- `lop_bac` (ma=S/A/B/C, ten, thu_tu) — đã seed.
- `dai_ban_do`: `ma_dang`(PK) · `khoi` · `ma_chu_de`,`ten_chu_de` · `ma_chuyen_de`,`ten_chuyen_de` · `ten_dang` · `muc_do`(1–5) · **`bac_toi_thieu`**(FK lop_bac) · `created_at`. (Đã DROP `ma_chuong`/`ten_chuong`.)
- `hinh_ban_do`: thêm `bac_toi_thieu`. Các bảng còn lại như `spec-kho-v2.md` (đọc cả phần "⚠ CẬP NHẬT migration 0002" đầu file đó).
- `schema.md` là bản chiếu auto-gen từ DB (`npm run schema`) — KHÔNG sửa tay.

## File chính của tool
- `src/lib/kho/api.ts` — data-layer (CRUD `dai_ban_do`, `listLopBac`, group cây, sinh mã gợi ý).
- `src/screens/kho/KhoScreen.tsx` — tab Đại/Hình + selector khối.
- `src/screens/kho/DaiBanDo.tsx` — duyệt Chủ đề→Chuyên đề→zoom Dạng + modal thêm/sửa.
- `src/screens/AdminScreen.tsx` — lá `bdkt` render `KhoScreen`.

---

## CÒN LÀM (thứ tự gợi ý)

1. **Nhánh Hình** (tab đang stub "dựng sau"): cây 3 tầng Mảng→Loại câu hỏi→Dạng-hình + Bài + Ý + mô hình/bổ đề + lọc. (Xem `spec-kho-v2.md §4`.)
2. **Câu hỏi Đại** (`dai_cau_hoi`): tạo/sửa/lọc câu, gắn bổ đề; cập nhật `countCauByDang` (hiện đếm ở client — TODO chuyển sang **view Postgres** khi data lớn).
3. **Quản lý 4 danh mục**: thuộc tính Đại, bổ đề Đại, mô hình Hình, bổ đề Hình.
4. **Gắn thuộc tính cho Dạng Đại** (`dai_dang_thuoc_tinh`) — chưa có trong UI.
5. **Theme:** gu **Classroom cho màn Nhân sự** + theme SaaS cho **chrome admin chung** (TopBar/NavTree — dùng chung với Nhân sự nên làm cẩn thận).
6. **Đồng bộ Notion**: 2 quyết định schema (bỏ Chương + bậc lớp) mới sửa trong repo `spec-kho-v2.md`, **chưa lên Notion** (= source of truth cho intent). Việc của Thùy phát biểu cho chuẩn.
7. **Rule còn thiếu:** Thùy nói "có 1 số rule" nhưng mới đưa rule mã (rule 1). Còn rule nào nữa thì gom trước khi sang Hình.

## Gotcha vận hành
- **Áp migration:** chạy RIÊNG từng file (đừng `npm run migrate` cả cụm — `0001` không idempotent sẽ chết "already exists"). Sau migrate: `npm run schema` + commit `schema.md`.
- **Grant:** đã set `ALTER DEFAULT PRIVILEGES FOR ROLE claude_build` (migration `0003`) → bảng/sequence tạo sau **tự grant** cho anon/authenticated. Bảng mới ở migration sau không lo "permission denied" nữa.
- **anon ghi được** vì RLS OFF + đã grant (spec §1.5: RLS off toàn bộ Kho).
