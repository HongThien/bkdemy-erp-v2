# BKdemy ERP v2 — CLAUDE.md

> Đọc file này TRƯỚC khi viết bất kỳ dòng code nào.
> Đây là build lại từ đầu. Schema/khái niệm v1 (`lop_toan`, `ma_buoi`/`timetable_id`,
> `staffs.ma_ns`, bảng `tasks`...) KHÔNG còn đúng. Tham chiếu v1 chỉ để đối chiếu: `./_v1_ref`.

---

## 0. Source of truth & cách làm việc

- **Spec/ADR/quyết định kiến trúc SỐNG ở Notion** » *BKdemy Strategy*. Code chỉ **hiện thực hóa** spec.
  Khi code lệch spec → **Notion đúng, sửa code**. Không tự quyết kiến trúc trong commit message.
- Hai loại "source of truth", đừng lẫn:
  - **Notion** = chân lý cho *intent / thiết kế*.
  - **Postgres** = chân lý cho *runtime state*.
- Vai trò: **CEO (Thùy)** ra đích & quyết định; **Claude (CTO)** đề cách đi, lập plan, audit.
  CEO trả lời câu về *đích* và *trạng thái hiện tại*; CTO đề xuất *cách đi*.
- Tuân **Working Agreement** (link §7). Rule trọng yếu:
  - **R1** — luôn tự hỏi "số/yêu cầu này là *đích* hay *hiện tại*?", không rõ thì hỏi.
  - **R2** — câu kỹ thuật tự trả lời được thì tự trả lời, đừng hỏi CEO.
  - **R3** — không trượt từ *strategy* xuống *execution* giữa chừng.
  - **R6** — output content cho Notion theo **form hoàn chỉnh 1 lần** (paste-ready), không rời rạc.
  - **R7** — idea nào thế giới đã có lý thuyết/tên gọi thì nói ra (đứng trên vai ai).
- 4 mode: **Sparring / Planning / Coaching / Audit** — tự nhận mode theo context.
- Shortcut khi CTO sai: CEO gõ **"Pattern A/B/C"** hoặc tên rule (**"R5"**) → tự đọc rule, tự sửa.
- **Nhật ký kỹ thuật — 2 FILE (repo, theo git):**
  - **`DEVLOG.md`** = log **THÔ, append-only, theo ngày** (*làm / sai / sửa / quyết định*). **KHÔNG đọc khi làm việc** — chỉ là NGUỒN bất biến để truy lại sau. Trong ngày chỉ THÊM mục mới; ĐỪNG sửa/xoá mục cũ.
  - **`HANDOFF.md`** = **bản TỔNG KẾT distill TỪ DEVLOG**, đọc đầu phiên: **① Trạng thái hiện tại** (viết lại sạch, prune stale) · **② Bài học còn hiệu lực** (giữ rule/why, gộp cái đã superseded). KHÔNG để lớp "STALE".
  - **Distill CHỈ CUỐI NGÀY** (trong ngày chỉ append DEVLOG, không dồn lên HANDOFF giữa chừng). Lý do giữ log thô: nếu bản tổng hợp sai logic vẫn **re-derive** được từ DEVLOG; mất log = mất cơ hội làm lại. *(Auto-memory chỉ theo MÁY; durable cross-machine = DEVLOG/HANDOFF/Notion.)*

---

## 1. Model lõi v2 (khác hẳn v1)

- **Đơn vị chân lý = (Student × Knowledge Point).** **KP = "dạng" (`ma_dang`).**
- **Mastery KHÔNG lưu — suy động** từ MỌI lần đo của dạng đó (không gắn theo buổi).
  → Lỗ 1 buổi ≠ lỗ KP. Một dạng lặp lại qua nhiều buổi nên data tự lấp dần.
  Đây là lý do (HS × KP) thắng (HS × buổi) của v1.
- **3 lớp:**
  1. **Canonical Knowledge** — danh mục dạng (must-exist của tri thức).
  2. **Operational Flow** — vận hành.
  3. **Measurement** — đo.
- **Operational Flow theo INVARIANT:** task = chênh lệch **(must-exist)** vs **(does-exist)**.
  KHÔNG có bảng `tasks`. KHÔNG đẻ row placeholder. "Việc của tôi" = query invariant lọc theo actor.

---

## 1.5 LUẬT DỮ LIỆU — chống NULL (bài học đau của v1)

- **"Thiếu data" = KHÔNG có dòng**, KHÔNG phải dòng có ô `NULL`.
- **Chỉ tạo dòng khi có kết quả THẬT.** Cấm "insert trước, điền sau".
  - Vd: một dòng `grades` ra đời là đã `da_cham` hoặc `mat_bai`. **Không có `cho_cham`.**
- Mọi phép tính (mastery, %, count) chạy trên **dòng có thật**. Thiếu = ít dòng, `NULL` không chui vào.
- **`NULL` chỉ dùng cho "KHÔNG áp dụng"** (vd `ma_buoi_goc` của buổi thường), **KHÔNG cho "chưa đo"**.
- **Thà bỏ trống còn hơn đánh sai.** Vd `ma_loi` chỉ gán khi chắc **100%**; không chắc → để trống.
  (`dung_sai` vẫn ghi đủ → mastery không ảnh hưởng, chỉ thiếu chẩn đoán loại lỗi.)

---

## 1.6 LUẬT DỮ LIỆU — chiều MÔN (mọi dữ liệu HỌC TẬP có nhãn môn)

- **⭐ Mỗi MÔN = 1 TRUNG TÂM riêng (bounded context).** 4 môn (Toán/Văn/Anh/KHTN) **đối xứng — bản chất như nhau**;
  chỉ **chung HS + một phần quy trình vận hành**, **KHÔNG chung content**. (ADR: `ADR-mon.md` / Notion.)
- **⭐ MỌI dữ liệu HỌC TẬP PHẢI mang nhãn `mon`.** Việc học gắn với từng môn — **không có "điểm/đo/Elo chung chung", chỉ có "của môn X"**.
  Áp cho: kho (dạng/câu/lý thuyết) · đo lường/mastery · Elo/EXP · buổi/điểm danh/chấm/đánh giá/ET/BTVN · tài liệu · sát hạch/Level…
  → Thêm cột/bảng dính việc học mà **quên `mon` = SAI**. Query/tính toán học tập luôn scope theo `mon`.
- **Chỉ dữ liệu KHÔNG-học-tập mới CHUNG** (không nhãn môn): thông tin cá nhân HS, phụ huynh, **ví xu (wallet tổng)**, tài khoản…
- **Tầng trên = (môn → nhánh)** đối xứng (Toán{Đại,Hình}·KHTN{Lý,Hóa,Sinh}…). **Tầng dưới = mỗi nhánh tự cấu trúc, BẢNG RIÊNG — KHÔNG gộp**
  (gộp = ghép cứng domain độc lập, lợi hiệu suất ~0). Dispatch môn→bảng qua **1 registry**, KHÔNG rải rác.
- **Symmetry test (tiêu chí đúng):** thao tác trên Toán phải chạy **y hệt** mọi môn. Thấy `if (mon === 'Toán')` đặc biệt trong code dùng chung = **sai**.

---

## 2. Nguyên tắc engineering bất biến (mang từ v1 — độc lập kiến trúc)

- **DB là source of truth runtime, tính ở Postgres.** Client chỉ query + hiển thị.
  Không derive ở client rồi ghi lại DB. Data ảnh hưởng nhiều user → ở DB, không `localStorage`.
- **Timezone:** ngày tính theo giờ VN — `... AT TIME ZONE 'Asia/Ho_Chi_Minh'` ở Postgres.
  JS: `setHours(0,0,0,0)` / `Date.UTC`. **CẤM** `toISOString()` và `new Date('YYYY-MM-DD')` cho ngày local.
- **Query:** luôn `.limit()`/paginate (không xài default 1000). PostgREST **không filter được quan hệ lồng** → xử ở DB/RPC.
- **Debug 400:** thứ tự — column tồn tại? → table đúng? → filter? → trigger cũ? → URL dài (batch cuối cùng).
- **Migration:** verify schema TRƯỚC. Sau migrate: grep toàn repo + `pg_trigger` + `pg_proc.prosrc` tìm cột/đường cũ.
  Trigger là "hidden code" — nghi ngờ đầu tiên khi INSERT/UPDATE 400 dù code/RLS/constraint đúng.
- **React:** reset state ngay trước async query; `useState` cho data hiển thị, `useRef` cho data chỉ trigger logic.

---

## 2.1 Truy cập schema (read-only — single source = DB)

- **Nguồn chuẩn của schema = DB Postgres THẬT.** `schema.md` trong repo là **bản chiếu auto-gen**, KHÔNG sửa tay.
  Notion KHÔNG giữ schema (chỉ ERD khái niệm nếu cần). Schema chép tay = drift = thảm họa v1.
- Claude Code dùng role **`claude_ro`** (chỉ `SELECT`) qua `DATABASE_URL_RO` trong `.env` (gitignored).
  Role này **không ghi được DB** — an toàn cứng, không dựa vào lời hứa.
- **Refresh / introspect:** `npm run schema` (`scripts/introspect.mjs`, dùng `pg`) → đọc DB live, ghi `schema.md`
  (bảng/cột/kiểu/PK/FK/enum/trigger/function). Cách chuẩn, chạy ngay với Node.
  *(Tùy chọn: cài PostgreSQL client → `scripts/dump-schema.ps1` cho DDL `.sql` đầy đủ.)*
- **Trước khi code module đụng bảng nào:** đọc `schema.md`. Cần chắc 1 cột/trigger/function có thật
  → `npm run schema` refresh, hoặc query thẳng `information_schema` / `pg_catalog` từ DB live. **KHÔNG đoán từ doc cũ.**
- **Sau mỗi migration:** `npm run schema`, commit `schema.md` cùng migration (git diff thấy schema đổi gì).

---

## 3. Lớp Canonical Knowledge

- Danh mục **dạng** (= KP). Mỗi dạng là must-exist của tri thức, lặp lại qua nhiều buổi/test.
- Lớp này định nghĩa **mỗi KP đo được bằng kênh nào** (ET chấm câu / nhận xét GV / ...).

---

## 4. Lớp Operational Flow — engine PURE-DERIVE

- **3 quy tắc invariant** (mẫu R-ET / R-DG / R-BU): `∀ điều-kiện ⇒ ∃ bằng-chứng`; thiếu → **task** (có owner).
  **Cả 3 đều thuần tính** (như R-BU) — **không đẻ row chờ, không cascade huỷ/spawn**.
  - Vd **R-ET**: task chấm = `(HS co_mat)` TRỪ `(đã có dòng grade)`. Sửa điểm danh → tính lại tự đúng, không phải dọn gì.
  - HS `vang` **không nằm trong R-ET**. Nghĩa vụ của vắng = **R-BU** (tạo `session_bu` *hoặc* ghi `bang_khong_bu`).
- **Mọi đổi state ghi vết bắt buộc:** 1 cột trạng thái hiện tại (đọc nhanh) + **TRIGGER ở DB tự đẻ dòng lịch sử**
  (actor + ts + cặp cũ/mới). App **không** được tự nhớ ghi log → không bao giờ mất vết.
- **Soft-delete:** data quan trọng dùng **immutable append + state-log**, không phải cờ `is_deleted` rồi đè.
- Xóa thật (khi buộc): theo thứ tự FK **lá → gốc**.

---

## 5. Lớp Measurement

- **Mỗi ô (HS × dạng) có 3 trạng thái:** `đạt` / `yếu` / **`chưa-đo`**. KHÔNG gộp `chưa-đo` vào `yếu`/0.
  - `mat_bai` (mất bài) = đường-đóng-không-data, **≠ điểm 0** (mất bài = quy trình; 0 = năng lực).
  - **vắng-không-bù** → `bang_khong_bu` đóng vận hành; ô (HS × dạng) **để trống**, chờ dạng lặp lại lấp. Vô hại.
- **Mastery kèm độ tin / độ phủ** (sample size). Thiếu data = **độ tin thấp**, KHÁC mastery thấp — đừng lẫn.
- Tách **"kế hoạch (canonical)"** vs **"thực tế (measurement)"** — không để measurement tạo circular dependency
  vào canonical (bài học `total_lich` của v1).
- Sự kiện đo idempotent (`upsert onConflict`).
- **Triangulation:** fact quan trọng có ≥2 khâu downstream xác nhận → **lỗi lộ qua mâu thuẫn data, không qua người-kiểm-người.**
  - Vd: HS `vang` mà lại có bài ET/nhận xét → hệ tự nêu cờ cho **OPS**; HS `co_mat` mà không ET → R-ET tự treo.
  - **GV KHÔNG động ô điểm danh.** Hậu kiểm điểm danh đến từ chính ET + nhận xét, không phải GV flag thủ công.
    Một người duy nhất chịu trách nhiệm điểm danh = **OPS**.
- **Chất lượng data moat:** phán đoán quyết định chất lượng (loại lỗi, dạng thực dạy) **không để người ngưỡng-thấp
  tự do quyết**. Hiện tại: người tag theo luật "100% chắc hoặc bỏ trống". Tương lai: **AI gợi ý → người confirm**
  (đẩy phán đoán vào system — đúng Principle 1 "System over Stars" + Principle 6 "AI in the loop").

---

## 6. RBAC / UX (mang từ v1)

- Quyền theo role load từ DB lúc login; **filter ở DB query**, không load-all-rồi-filter client.
- DEFAULT quyền theo **workflow thật** của từng role, không "restrict blind".
- **Delegation (Principle 3):** AI → TA → GV → manager → CEO — giao việc cho **cấp thấp nhất làm được tốt**.
- UX: full CRUD; feedback ~2s sau lưu; không `alert()` cho success.
  Nút hành động chính chỉ disable khi **thiếu data**, không disable vì state UI (`!saved`).

---

## 7. Tham chiếu Notion (BKdemy Strategy)

- [BKdemy Strategy (gốc)](https://app.notion.com/p/35ed4530bcdb8006ac1ad95d9bdb7ddc)
- [00 — Index](https://app.notion.com/p/35ed4530bcdb80a9a438dd1c9c62046f)
- [01 — North Star](https://app.notion.com/p/35ed4530bcdb80aeb269f8579c90e83c)
- [02 — Strategic Pillars](https://app.notion.com/p/35ed4530bcdb80a991cdf1128411bec2)
- [Principles](https://app.notion.com/p/35fd4530bcdb80ddb656db89f4c8929a)
- [Working Agreement](https://app.notion.com/p/35fd4530bcdb80ae85ece94215f75c5f)
- [ERP V2](https://app.notion.com/p/36cd4530bcdb80fc8c50e2f50ba87dfd)
- [Pilot Điểm-danh → ET — 7 User Story](https://app.notion.com/p/375d4530bcdb8084b38bead35fdf0be7)

### Spec build (trong repo — nguồn cho đợt code hiện tại)
- `spec-kho-v2.md` — Kho Canonical Knowledge (Đại + Hình). Schema đã build vào DB v2.
- `erp-v2-ui-spec.md` — Shell UI/UX **view-first**: React + Vite + Zustand + Tailwind, **mock data, CHƯA đụng Supabase**. Đơn vị = ROLE; derive nav/queue theo role; 2 loại việc (vận hành derive / phát triển giao tay) tách hẳn. Kho = 1 lá "Bản đồ kiến thức" trong cây Admin.
## Luật xoá (bắt buộc)
Trước khi XOÁ bất cứ gì — xoá file, drop/alter/delete bảng/cột/dòng DB,
hay lệnh git phá lịch sử (reset --hard, push -f, branch -D, clean) — DỪNG lại:
(1) liệt kê CHÍNH XÁC cái gì sẽ mất,
(2) nói VÌ SAO cần xoá,
(3) chờ tao gật rõ ràng rồi mới làm.
Không gộp xoá vào bước lớn hơn. Không xoá "cho gọn". Chưa chắc thì hỏi, đừng xoá.