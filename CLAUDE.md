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
- **⭐ DANH TÍNH bám KHOÁ TỰ NHIÊN, KHÔNG bám VỊ TRÍ.** Nối 2 tập bằng "phần tử thứ i ↔ phần tử thứ i"
  là **sai ngay khi một bên thêm/bớt ở giữa** — và hỏng ÂM THẦM (không lỗi, chỉ gắn nhầm). Lưu thẳng
  khoá của bên kia (`ma_cau`, `ma_dang`…), vị trí chỉ để HIỂN THỊ. *(Đã dính: ô chấm ET ↔ câu trong đề
  nối bằng `problem_no` ↔ index — sửa đề là điểm gắn sang dạng khác, lệch 1 ngày mới lộ.)*
- **⭐ Cảnh báo lệch phải so NỘI DUNG, không so SỐ LƯỢNG.** `a.length !== b.length` mù hoàn toàn với
  "đổi phần tử mà giữ nguyên số lượng" — đúng ca nguy hiểm nhất.
- **⭐ Map lại quan hệ đã mất: "số lượng khớp" KHÔNG phải bằng chứng.** Phải có **nhân chứng thứ hai
  độc lập** (vd `ma_dang` seed từ lúc chấm) rồi mới dám ghi; lệch dù 1 phần tử ⇒ bỏ cả lượt, để trống,
  hỏi người (§1.5 "thà bỏ trống còn hơn đánh sai"). Suy luận cho gọn = ghi đè dữ liệu thật bằng phỏng đoán.
- **⭐ Tham chiếu bằng TEXT (không FK) thì cấm xoá cứng bên được trỏ.** Không có FK ⇒ DB không chặn ⇒
  chỗ resolve `.filter(Boolean)` cho nó **rụng im lặng**. Dùng **kho rác** (cột `xoa_at` NGAY TRONG bảng
  gốc — tách bảng thì mọi chỗ resolve phải join 2 nơi, và mã đã xoá bị cấp lại cho bản ghi mới).
- **Đổi NỘI DUNG con phải bump `updated_at` của cha.** Sửa `tai_lieu_cau` mà không đụng `tai_lieu`
  ⇒ không còn dấu vết thời gian ⇒ chẩn đoán về sau đọc nhầm "chưa ai sửa".

---

## 2.0 ⭐ LUẬT QUERY & TÍNH TOÁN (CEO chốt 30/08/2026 — sau audit 177 chỗ vi phạm)

- **MỌI query tổng hợp và MỌI phép tính nghiệp vụ PHẢI nằm ở Postgres** (function/view/
  trigger/generated column). **Người gọi hay AI gọi thì CHỈ GỌI HÀM SẴN** — client qua
  `supabase.rpc(...)`, bot hỏi–đáp qua catalog `scripts/hoidap/tools.mjs`.
- Cụ thể hoá — trong TS/TSX **CẤM**:
  - `reduce`/`filter().length`/đếm/cộng/trung bình/tỉ lệ/xếp hạng trên dữ liệu NGHIỆP VỤ
    fetch về (tiền, điểm, mastery, hiệu suất, SLA, sĩ số…).
  - fetch ≥2 bảng rồi join bằng JS để ra con số/trạng thái nghiệp vụ.
  - **tính ở client rồi ghi kết quả vào DB** (nặng nhất — hư dữ liệu vĩnh viễn, đã có
    tiền lệ: bug tiền thật do limit cắt cụt, xem `AUDIT-client-tinh-toan.md`).
  - công thức nghiệp vụ tồn tại 2 nơi (JS + SQL, hoặc 2 bản JS) — nguồn công thức DUY
    NHẤT là function Postgres, tên `fn_*`.
- Client CÒN ĐƯỢC làm gì: CRUD dòng đơn qua PostgREST · list thô để render · format hiển
  thị (ngày, tiền tệ, nhãn) · sort/filter thuần túy theo lựa chọn UI đang mở · đếm items
  đang render (badge). Nghi ngờ ranh giới → mặc định đẩy xuống DB.
- Quy ước: hàm đọc `fn_<domain>_<viec>` trả bảng/jsonb; hàm ghi có tính toán = RPC
  transactional (tính + ghi trong CÙNG transaction); cột suy được từ cột khác cùng dòng =
  generated column; trạng thái suy từ bảng khác = trigger. `security definer` chỉ khi thật
  cần, mặc định invoker + RLS.
- Mẫu tham chiếu đúng: `xep_hang_tu_luyen` (rank ở RPC) · `count_cau_by_dang`.
  Chiến dịch trả nợ 177 chỗ cũ: `AUDIT-client-tinh-toan.md` (lộ trình 4 phase).

---

## 2.1 Truy cập schema (read-only — single source = DB)

- **Nguồn chuẩn của schema = DB Postgres THẬT.** `schema.md` trong repo là **bản chiếu auto-gen**, KHÔNG sửa tay.
  Notion KHÔNG giữ schema (chỉ ERD khái niệm nếu cần). Schema chép tay = drift = thảm họa v1.
- **⚠️ QUYỀN DB — mục này từng SAI, đã sửa 12/08. Đọc kỹ trước khi tin bất cứ dòng nào về "chỉ đọc".**
  Bản cũ ghi *"Claude dùng role `claude_ro` chỉ SELECT qua `DATABASE_URL_RO` — an toàn cứng, không dựa
  vào lời hứa"*. Kiểm thật bằng `has_schema_privilege`/`pg_roles` thì: `.env` chỉ có **một** key
  `DATABASE_URL` trỏ role **`claude_build`**, role đó **GHI ĐƯỢC** và **SỞ HỮU 121/124 bảng**.
  Tức rào cứng **không tồn tại** — mục này mô tả *ý định*, không mô tả *thực tế*, suốt nhiều tháng.
  **Bài học chung: một dòng tài liệu nói "an toàn cứng" mà không ai verify thì nguy hơn không có dòng nào.**
  - **Bố cục ĐÚNG (đang khôi phục — `.env.example` từ 28/07 vốn đã ghi vậy):**
    `DATABASE_URL_RO` = role `claude_ro` **chỉ SELECT** → mọi thứ Claude chạy (`npm run schema`, mọi
    query dò dữ liệu). `DATABASE_URL` (hoặc `DATABASE_URL_RW` truyền lúc gọi) = role ghi → **chỉ** lúc migrate.
  - **⭐ Rào CỨNG thật sự = chuỗi kết nối GHI KHÔNG nằm trên đĩa.** Để nó trong `.env` thì Claude đọc
    file là có — vẫn là lời hứa. Truyền lúc gọi thì Claude không thể lấy thứ không tồn tại trong file nào.
    Cú pháp + 2 bẫy đã cắn thật (nối `&&` cùng dòng `set` ⇒ dấu cách lọt vào biến; biến ĐÈ `.env` và
    sống hết phiên terminal): xem `.env.example`. `migrate.mjs` tự bắt cả hai và in nguồn chuỗi kết nối.
  - **⚠️ TẠO `claude_ro` PHẢI KÈM `bypassrls`** (hoặc policy `for select to claude_ro using (true)` trên
    từng bảng). 116/124 bảng bật RLS với policy `to authenticated`; role thường khớp **0 policy** ⇒
    **mọi SELECT trả 0 dòng, im lặng, không lỗi** — mà `npm run schema` VẪN đúng (nó đọc `pg_catalog`,
    không đụng dữ liệu). Schema nhìn hoàn hảo trong khi mọi kết luận về dữ liệu đều sai. `introspect.mjs`
    đã có canary cho ca này và ghi cảnh báo thẳng vào đầu `schema.md`.
  - **Điểm mù ĐANG TỒN TẠI (12/08):** `hinh_giao_trinh` · `hinh_gt_bai` · `hinh_gt_buoi` thuộc sở hữu
    `postgres` (tạo tay qua SQL Editor, không qua migrate) ⇒ `claude_build` đọc ra **0 dòng** dù bảng có
    data thật. **"0 dòng" từ CLI KHÔNG phải bằng chứng bảng rỗng** — luôn đối chiếu dashboard/app.
- **Refresh / introspect:** `npm run schema` (`scripts/introspect.mjs`, dùng `pg`) → đọc DB live, ghi `schema.md`
  (bảng/cột/kiểu/PK/FK/**CHECK**/enum/trigger/function). Cách chuẩn, chạy ngay với Node.
- **⚠️ Cột `text` KHÔNG nói lên tập giá trị hợp lệ** — CHECK constraint mới nói. Cột trạng thái/loại
  (`luot`, `tab`, `trang_thai`…) luôn đọc cột **"giá trị hợp lệ"** trong `schema.md`, và khi thêm giá trị mới
  vào union type TS thì **phải có migration nới CHECK đi kèm** — nếu không, DB chặn đúng lúc user bấm nút
  ("violates check constraint"), và **chỉ nhánh giá trị mới mới chết** nên lỗi ẩn rất lâu.
  (Đã dính 2 lần: `prep_phong.luot` thiếu `'toi'` · `viec_van_hanh_duyet.tab` thiếu `'mt'`.)
  *(Tùy chọn: cài PostgreSQL client → `scripts/dump-schema.ps1` cho DDL `.sql` đầy đủ.)*
- **Trước khi code module đụng bảng nào:** đọc `schema.md`. Cần chắc 1 cột/trigger/function có thật
  → `npm run schema` refresh, hoặc query thẳng `information_schema` / `pg_catalog` từ DB live. **KHÔNG đoán từ doc cũ.**
- **Áp migration — `npm run migrate` (đã sửa 12/08, trước đó KHÔNG dùng được):** script giữ sổ
  `_migrations` (tên file + vân tay nội dung) nên **chỉ chạy file chưa áp**. Trước 12/08 nó chạy lại
  TOÀN BỘ từ `0001` — mà `0001..0115` dùng `create table` trần, không `if not exists` — nên trên DB
  đang sống là chết ngay câu đầu (`relation "dai_ban_do" already exists`); cả đội phải hand-apply qua
  Supabase SQL Editor, và sự thật đó chỉ nằm trong **một dòng giữa HANDOFF.md**, không ai đọc trước
  khi gõ lệnh. Giờ:
  - `node scripts/migrate.mjs --status` → xem đã áp / còn treo / **file đã áp mà bị sửa sau đó**. Xem thuần, không ghi.
  - `npm run migrate` → áp các file còn treo, mỗi file 1 transaction, ghi sổ **trong cùng transaction**.
  - `node scripts/migrate.mjs --baseline <file.sql>` → đánh dấu đã-áp mà KHÔNG chạy SQL (dựng sổ cho DB cũ). Dùng 1 lần.
  - DB đã có bảng mà chưa có sổ ⇒ script **từ chối chạy** và in đúng lệnh cần gõ, thay vì đâm vào `0001`.
  - **Lịch sử migration bất biến:** sửa file đã áp thì DB và repo nói hai chuyện khác nhau — `--status`
    sẽ nêu cờ, nhưng script KHÔNG áp lại. Muốn đổi thì viết migration **MỚI** đè lên.
- **Sau mỗi migration:** `npm run schema`, commit `schema.md` cùng migration (git diff thấy schema đổi gì).
- **Đặt tên migration = TIMESTAMP, không phải số tăng dần:** `npm run new-migration ten_viec_snake_case`
  → `YYYYMMDDHHMM_ten_viec.sql` (giờ VN). Số tăng dần cấp bằng "nhìn file cuối +1" nên hai luồng làm
  song song là va nhau (07-21 va 2 lần, 4 file). `migrate.mjs` sort theo TÊN → hai file trùng số vẫn chạy
  nhưng **thứ tự do chữ cái quyết định**; gặp cặp *nới CHECK → siết CHECK* mà đảo thứ tự là fail.
  File cũ `0001..0115` **giữ nguyên** — `'0' < '2'` nên luôn sort trước timestamp mới.

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
- **`spec-giai-bai-ai.md` — ĐỌC BẮT BUỘC trước khi chạy "quét/giải câu chưa có đáp án" bằng AI**
  (Đại/KHTN/HGT/Hình). Rule quan trọng nhất: bài nhiều ý phải dùng lại kết quả ý trước, không chứng
  minh lại từ đầu; cách xử lý khi `gia_thiet_rieng` mâu thuẫn hình vẽ; verify trước khi ghi DB.
- `erp-v2-ui-spec.md` — Shell UI/UX **view-first**: React + Vite + Zustand + Tailwind, **mock data, CHƯA đụng Supabase**. Đơn vị = ROLE; derive nav/queue theo role; 2 loại việc (vận hành derive / phát triển giao tay) tách hẳn. Kho = 1 lá "Bản đồ kiến thức" trong cây Admin.
## Luật xoá (bắt buộc)
Trước khi XOÁ bất cứ gì — xoá file, drop/alter/delete bảng/cột/dòng DB,
hay lệnh git phá lịch sử (reset --hard, push -f, branch -D, clean) — DỪNG lại:
(1) liệt kê CHÍNH XÁC cái gì sẽ mất,
(2) nói VÌ SAO cần xoá,
(3) chờ tao gật rõ ràng rồi mới làm.
Không gộp xoá vào bước lớn hơn. Không xoá "cho gọn". Chưa chắc thì hỏi, đừng xoá.