# spec-quan-ly-chat-luong.md — QUẢN LÝ CHẤT LƯỢNG: cách hoạt động của TRƯỞNG KHỐI (spec #6 của bộ 20 spec)

> **Trạng thái: THÙY CHỐT 17–18/11/2026** (10 câu: 5 · 6 · 7 · 8 Thùy trả lời riêng 18/11, còn lại theo đề xuất — bảng §11.0, thắng mọi dòng thân spec còn trái). Spec này là nguồn đúng; `spec-truong-khoi.md` · `spec-phong-truong-khoi.md` · `SPEC-troly-nhansu.md` đã chuyển `_luu-tru/`. GIỮ ở gốc: `spec-bao-cao-ky.md` (nội dung + công thức báo cáo gửi phụ huynh → #13).
> Việc code / DB từ các quyết định chỉ làm khi Thùy ra lệnh.
> Chỗ nguồn mâu thuẫn nhau / nguồn ≠ DB / luật không có ngày chốt ⇒ **không tự chọn**, ghi §11.1 (10 câu hỏi). Việc code / DB chỉ làm khi Thùy ra lệnh.
> **Gộp từ:** `spec-truong-khoi.md` (trọn) · `spec-phong-truong-khoi.md` (trọn, gồm phiên Claude) · `SPEC-troly-nhansu.md` (§6–§7 còn hiệu lực; §0–§5 là lịch sử 08/2026) ·
> `spec-bao-cao-ky.md` (**chỉ phần "ai nhập · ai công bố · ai bật app phụ huynh"**; nội dung báo cáo + công thức ⇒ #13) ·
> `_luu-tru/BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md` · `_luu-tru/PLAN-danhgia-hoctap.md` (chỉ lịch sử — không lấy luật) · HANDOFF (mục 29/10 → 17/11) · DEVLOG 29/10 → 17/11 (quyết định có ngày, ghi `(Thùy dd/mm)`) ·
> `scripts/phien/` (README · `CHUNG.md` · `MOI.md` · `loai/*.md`) · `scripts/hoidap/` · các quyết định 17/11 ở `spec-luong-gay.md` §9.0 · `spec-tro-giang.md` §12.0 · `spec-bo-tro.md` §12.0.
> **Đối chiếu DB 17/11 ~22:30** (chỉ đọc: `pg_proc`, `pg_policies`, `pg_constraint`, `pg_trigger`, `pg_indexes`, đếm dòng). Số trong file là số ngày 17/11.
>
> **Ranh giới (chỉ trỏ, không chép):**
> nhịp tuần · Giáo trình tuần · Mục tiêu tuần · Báo cáo tuần (nội dung, công thức) ⇒ `spec-van-hanh-tuan.md` (ở đây chỉ ghi trưởng khối **làm gì, lúc nào, ở màn nào**) ·
> logic bổ trợ (mức, vòng đời case, nội dung ca) ⇒ `spec-bo-tro.md` · đo, dạng yếu, nhóm yếu, HS yếu ⇒ `spec-mastery.md` ·
> công thức lương, gậy ⇒ `spec-luong-gay.md` · việc của TA, chấm công, hiệu suất TA, bot Telegram ⇒ `spec-tro-giang.md` · xếp lịch, phòng ⇒ `spec-van-hanh-trung-tam.md` ·
> nội dung bản đồ / kho / luật giải mà phiên Claude sửa ⇒ `spec-ban-do-toan.md` · `spec-kho-cau-hoi.md` · `spec-giai-bai.md` · nội dung Báo cáo học kì gửi phụ huynh ⇒ #13 `spec-app-ph.md`.

---

## 0. Đích

- Một câu spec này phải trả lời được: **việc X của khối Y môn Z — ai làm, ai duyệt, ai xem lại, hạn bao lâu, ở màn nào.**
- **Khối là đơn vị quản lý thấp nhất, có nhãn môn.** Một ô (môn × khối) có đúng một trưởng khối; người đó lo cả **chất lượng học** lẫn **vận hành** của mọi học sinh trong ô (Thùy 29/10).
- **Giao việc xuống cấp thấp nhất làm được tốt** (CLAUDE §6): máy / Claude làm nháp → trưởng khối quyết → trưởng bộ môn duyệt việc lớn → Trang xem lại → Thùy chỉ phát động và xem tổng. Đích đo được: số lần trưởng khối phải nhắn Thùy về bản đồ / kho → **0** (Thùy 01/11).
- **Không cổ chai:** quyết định của trưởng khối có hiệu lực ngay; xem lại (hậu kiểm) diễn ra sau, không chặn việc (Thùy 29/10).
- **Quyền nằm ở DB, theo ghế và theo bảng phân công — không theo tên người, không uuid cứng.** Đổi người = sửa một ô trên màn, không sửa code (Thùy 29/10).
- **Đối xứng môn** (CLAUDE §1.6): cái gì Toán có thì KHTN, Anh, Văn, Lý, Hoá chạy y hệt khi điền ô. Không có nhánh riêng theo tên môn.
- Số của cả khối / cả hệ là **bảng tính sẵn**, màn chỉ đọc và ghi "số tính lúc…" (CLAUDE §2.0).

## 1. Đội Quản lý chất lượng — ghế · team · vai

### 1.1 Ba thứ tách bạch (Thùy 29/10)

| Thứ | Trả lời câu | Nguồn duy nhất |
|---|---|---|
| **Team** | Em thuộc tổ nào (sơ đồ tổ chức) | Suy từ **ghế**: có ghế ở team nào ⇒ tự có nhãn team đó (trigger `trg_vi_tri_dong_bo_team`). Không tick tay. |
| **Vai trò** | Mở được màn nào | `vai_tro` gắn trên ghế → `vai_tro_chuc_nang`. Một người nhiều ghế ⇒ quyền = hợp các ghế. |
| **Phân công** | Quản dữ liệu của ô (môn × khối) nào | Bảng `phan_cong_quan_ly_khoi` — §2. |

### 1.2 Các vai trong đội

| Vai | Là ai (theo ghế) | Phạm vi | Ghi chú |
|---|---|---|---|
| **CEO** (Thùy) | Ghế gốc team Ban lãnh đạo + quản trị hệ thống | Mọi môn, mọi khối | Phát động (mở đợt, phát động giải bài), xem tổng. Có **Phòng Giám đốc**. |
| **Trưởng / phó QLCL** — "toàn hệ" (Trang) | Ghế trưởng hoặc phó của team `qlcl` | Mọi ô | Hậu kiểm, đánh gậy trưởng khối, chốt gậy tháng, chốt lương. |
| **Quản lý môn** | Ghế **gốc** cây Giáo viên của một môn | Mọi khối của môn mình | "Admin của môn": phân công trưởng khối môn mình, mọi màn chuyên môn (Thùy 29/10). |
| **Trưởng bộ môn** | Người vào được Phòng ở chế độ trưởng bộ môn: quản lý môn, hoặc người toàn hệ (phòng thu hẹp theo môn của cây Giáo viên mình ngồi) | Các ô của môn đó | Duyệt bổ trợ · giáo trình tuần · báo cáo tuần. Mỗi môn một người (Thùy 03/11) — ⚠ ở Toán hiện có **hai** người bấm duyệt được ⇒ §11.1 câu 5. |
| **Trưởng khối** | Người ở ô **Trưởng** của bảng phân công | Ô (môn × khối) của mình | "Trang thu nhỏ": làm đúng việc Trang làm, khác phạm vi (Thùy 29/10). |
| **Phó khối** | Người ở ô **Phó** | Ô của mình | Vận hành: nhận chấm MT, bot gắn tên. Không gậy, không phiên Claude. Phần còn lại ⇒ §11.1 câu 3. |
| **TA cấp dưới** | **Suy**: TA có lớp trong ô (`phan_cong_lop`) | — | TA dạy nhiều khối có nhiều trưởng khối; mỗi việc thuộc khối của **buổi**. Không dựng cây tay. |

- **Trưởng khối có ghế ở cả ba team** Trợ giảng · Học thuật · Quản lý chất lượng (team Giáo viên không có trưởng khối): ghế "Trưởng khối <các khối>" là **ghế tự sinh**, trigger giữ khớp với ô Trưởng của bảng phân công — chọn ai ở ô ⇒ người đó có ghế; hết ô ⇒ ghế để trống, không xoá (Thùy 29/10 tối). Người toàn hệ không sinh ghế trưởng khối.
- Ghế tên "Trưởng khối THCS / THPT / tiểu học" trong cây Giáo viên và ghế cũ bên Học thuật **không** cho quyền gì theo tên — quyền không đọc từ tên ghế.
- **Task phát triển** (việc giao tay) chỉ trưởng khối trở lên có; không thuộc việc của TA (Thùy 03/11). Giao theo cây ghế (cấp trên → cấp dưới), tới hạn cấp trên duyệt % / gia hạn / huỷ, "cờ trễ" = 1 gậy.
- **Tiền:** giáo viên full-time giữ vai học thuật / trưởng khối hưởng khung lương cứng, không có tiền dạy bổ trợ (Thùy 17/11) ⇒ `spec-luong-gay.md` §9.0 câu 3–5.

### 1.3 Số hiện tại (17/11)

- Team `qlcl`: 11 ghế = 1 trưởng · 1 phó · 9 ghế trưởng khối tự sinh. Toàn hệ: 93 ghế / 47 người có ghế (46 nhân sự đang làm); 22 người giữ từ 2 ghế trở lên, nhiều nhất 9 ghế.
- 9 vai trò. Vai **Quản lý chất lượng** mở 13 chức năng (bổ trợ, buổi học, gậy, duyệt chấm, làm tài liệu, Phòng làm việc, tủ quà; chỉ xem: chấm MT, kết quả, TKB, màn Team QLCL). Vai **Quản lý môn** mở 31 chức năng.
- 10 trưởng khối (7 người có lớp dạy với vai giáo viên, 7 người có lớp với vai trợ giảng; một người giữ nhiều nhất 3 ô). Ghế quản lý môn có người: Toán · KHTN · Tiếng Anh · Vật lý · Hoá học.

## 2. Phạm vi môn × khối — một nguồn ở DB

### 2.1 Bảng phân công (Thùy 29/10)

- `phan_cong_quan_ly_khoi (mon, khoi, vai, nhan_su_id, phan_cong_boi, phan_cong_at)` — `vai` ∈ `truong` · `pho`; khoá chính `(mon, khoi, vai)` ⇒ **một ô không thể có hai trưởng**.
- **Không mặc định, không seed, không suy từ tên ghế.** Ai quản ô nào là dữ liệu do người phân công trên màn. Ô Trưởng chọn được mọi nhân sự đang làm.
- **Danh sách ô = suy từ lớp đang học** (`lop.mon × lop.khoi`). Mở lớp khối mới ⇒ ô mới tự hiện.
- **Ô chưa có trưởng: hiện đỏ**, không biến mất im lặng. Việc của ô đó rơi về ai ⇒ §11.1 câu 6.
- Đổi người có vết: trigger `pcqlk_log_trg` ghi `phan_cong_quan_ly_khoi_log` (người cũ → người mới · ai sửa · lúc nào).
- **Ai được sửa** (`fn_qlcl_phan_cong_luu`): người toàn hệ, hoặc quản lý môn (chỉ môn mình). Bảng không có policy ghi — chỉ ghi qua hàm.
- **Màn:** *Team Quản lý chất lượng* (lá `qlcl_team`): lưới môn × khối (Trưởng / Phó) + thẻ từng thành viên (phạm vi · chức vụ ở mọi team) · tab **Hậu kiểm** (chỉ người toàn hệ). Lưới cũng nằm trong màn *Phân công* sẵn có.
- **Số (17/11):** 20 ô đang có lớp — Toán 13 (3 · 4 · 4T · 5 · 5T · 6 · 7 · 8 · 8T · 9 · 10 · 11 · 12) · KHTN 3 (7 · 8 · 9) · Tiếng Anh 3 (5T · 8 · 9) · Văn 1 (8). **19 / 20 ô có trưởng** (10 người); ô trống: **Văn 8**. 5 ô có phó (3 người).

### 2.2 Các hàm phạm vi — mọi module chỉ hỏi ở đây

| Hàm | Trả lời |
|---|---|
| `fn_pham_vi_cua_toi()` → (môn, khối, vai) | Tôi quản những ô nào. Thứ tự: toàn hệ > quản lý môn > ô được phân công (trưởng / phó); mỗi ô một dòng. |
| `_trong_pham_vi(môn, khối)` | Ô này có trong phạm vi của tôi không (gồm cả Phó). |
| `_truong_khoi_tro_len(môn, khối)` | Tôi là **trưởng** ô này, quản lý môn, hoặc toàn hệ (Phó **không**). |
| `_qlcl_toan_he()` | Quản trị hệ thống, hoặc ghế trưởng / phó team `qlcl`. |
| `_quan_ly_mon()` | Các môn tôi giữ ghế gốc cây Giáo viên. |
| `fn_mon_cua_toi()` | **Quyền môn một nguồn**: `tat_ca` (toàn hệ; team liên môn Vận hành · Media · Marketing) + danh sách môn riêng (được phân môn ∪ quản lý môn ∪ ô được phân công). |
| `fn_phong_che_do()` | `tbm` (toàn hệ hoặc quản lý môn) / `tk`. `_phong_mon_cua_toi()` thu hẹp **riêng Phòng** theo môn của cây Giáo viên. |
| `fn_gay_duoc_doi_mien()` | Người quản gậy: quản trị · trưởng / phó QLCL · quản lý môn · trưởng khối · ban lãnh đạo. Phó khối không. |

- Luật: **module mới không tự viết điều kiện phạm vi** — gọi một trong các hàm trên. Cấm uuid, mã nhân sự, tên người trong thân hàm.
- Đối chiếu 17/11: không hàm nào còn uuid người viết cứng; còn **một** hàm chứa mã nhân sự viết cứng (§11.2 mục 1).
- Đã xoá 29/10 (Thùy gật): `gay_quyen_khoi` · `phan_cong_khoi` · cột `vi_tri.khoi_quan_ly`.

## 3. Ai quyết — ai duyệt — ai xem lại

> Quy ước cột: **Làm / quyết** = có hiệu lực ngay · **Duyệt trước** = phải gật thì mới chạy · **Xem lại** = hậu kiểm, sau khi đã chạy.

| Việc | Làm / quyết | Duyệt trước | Xem lại | Hạn | Chốt ngày |
|---|---|---|---|---|---|
| **Đề xuất bổ trợ** (em · nhóm · mức L1–L4 · ưu tiên) | Trưởng khối | **Trưởng bộ môn** (Duyệt / Trả lại có lý do) | — | Chiều thứ Hai chốt bổ trợ tuần; làm được bất kỳ ngày nào | Thùy 10/11, 17/11 |
| Tạo ca sau giờ (L1) · đổi mức L1 → L2–L4 | Trưởng khối trở lên | (đổi mức đi lại đường đề xuất + duyệt) | Trang | — | Thùy 29/10, 12/11 |
| Xếp lịch ca khối | **Lộc** (Vận hành) | — | — | — | Thùy 29/10 — không đổi |
| **Duyệt công TA** | Trưởng khối, trong ô của mình; **không duyệt công của chính mình** (lên trưởng bộ môn) | — | Người giữ quyền duyệt công toàn hệ (Trang, Lộc, Thùy) thấy và duyệt hết + phần chung | **48 giờ**; quá hạn ⇒ về khay Trang + đề xuất gậy | Thùy 09/11, 17/11 |
| **Thiếu công** | Trưởng khối **nhập hộ** hoặc ghi **"không có công"** | — | Trang | Thiếu quá **24 giờ** | Thùy 17/11 |
| **Quyết đề xuất gậy** TA, giáo viên trong ô | Trưởng khối (Đánh / Bỏ qua — bỏ qua bắt buộc lý do) | — | Trang: Đồng ý · Thu hồi gậy · Mở lại đề xuất | **7 ngày**; quá hạn ⇒ khay Trang; quá **30 ngày** ⇒ máy tự bỏ qua | Thùy 29/10, 17/11 |
| Gậy của **trưởng khối** | Trang | — | — | như trên | Thùy 29/10 |
| Gậy của ô do **trưởng bộ môn** làm thay / duyệt | CEO | — | — | — | Thùy 16/11 |
| Bật / tắt **miễn gậy** | Trưởng khối trở lên | — | — | — | Thùy 15/11 |
| **Chốt gậy tháng** | Trưởng / phó QLCL hoặc quản trị | — | — | Ngày 4 | Thùy 17/11 |
| **Chốt lương** | Trang; Thùy xem tổng | — | — | Ngày 5 | Thùy 17/11 |
| **Duyệt báo sai** (học sinh / TA báo câu sai, báo máy chấm sai) | **Trưởng khối** — không phải TA | — | ⇒ §11.1 câu 4 | chưa có | Thùy 17/11 |
| Duyệt chất lượng **việc vận hành** của TA | Trưởng khối | — | Trang | — | Thùy 29/10 |
| **Giáo trình tuần** | Trưởng khối điền + Gửi duyệt (cả đội giáo viên cùng soạn) | **Trưởng bộ môn** | — | H1 23:59 thứ Sáu · H2 12:00 thứ Bảy | Thùy 16/11 |
| **Công bố Mục tiêu tuần** theo lớp | Trưởng khối | — | — | Chiều thứ Hai | Thùy 16/11 |
| **Báo cáo tuần** | Trưởng khối nộp (snap) | **Trưởng bộ môn** duyệt / trả lại → ghép Báo cáo Chuyên môn tuần → chiếu TV | CEO xem | Chiều thứ Hai | Thùy 03/11 |
| **Bản đồ** (cấu trúc, lý thuyết dạng) | Claude nháp → trưởng khối sửa / chốt | — | — | — | Thùy 01/11, 05/11 |
| **Kho** (phân dạng, duyệt câu, sửa câu, ảnh, kho rác) | Claude tự gán khi chắc; câu chưa chắc ⇒ trưởng khối | — | Kiểm mẫu ~10 % câu máy gán (màn Duyệt kho) | — | Thùy 01/11, 06/11 |
| Phát động giải bài cho một khối | CEO | — | — | — | Thùy 01/11 — chưa giao xuống |
| Phân công trưởng / phó khối | Người toàn hệ · quản lý môn (môn mình) | — | — | — | Thùy 29/10 |
| **Báo cáo học kì** (nhập · công bố · bật app phụ huynh) | ⇒ §8 | | | | chưa chốt — §11.1 câu 8 |

**Luật đi kèm (đã chốt):**
- **Gậy:** tính theo **tháng của việc trễ**; **không trừ lương** — tiền phạt ghi **sổ phạt riêng** 20.000đ / gậy, cộng −50 điểm hiệu suất trên việc bị gậy. Quyền ghi sổ gậy ở DB = `fn_gay_duoc_doi_mien()`; **không ai ghi dòng của chính mình**; chốt tháng chỉ trưởng / phó QLCL hoặc quản trị (mig `202611172225`). Công thức, sổ, chốt ⇒ `spec-luong-gay.md` §4.
- **Bổ trợ:** mức L1 sau giờ · L2 ca khối, TA dạy · L3 ca khối, giáo viên dạy · L4 chuẩn bị kỹ + đổi giáo viên; **bỏ trần**; **bỏ Bổ trợ Hình và Khẩn cấp**; mức thuộc lượt chốt tuần (hết tuần về L0); hệ gợi ý dạng, người dạy chủ động sửa (Thùy 17/11) ⇒ `spec-bo-tro.md` §3, §4.
- **Báo động của giáo viên / TA hiện theo TUẦN ở màn bổ trợ của trưởng khối** (Thùy 17/11) — **chưa build**; hiện là 🚨 30 ngày trên Dashboard học tập. Cách đặt ⇒ §11.3 mục 1.
- **HS yếu = có ≥ 1 NHÓM yếu**; mastery một bản, chỉ bài test, không tự luyện, mọi khối (Thùy 17/11) ⇒ `spec-mastery.md` §5.
- **Máy không tự mở case, không tự đánh gậy** — máy đề xuất, người quyết.

**Hậu kiểm — cơ chế chung:** bảng `hau_kiem (loai, ref_id, ket_qua, ghi_chu, nguoi, at)`; **không có dòng = chưa xem**; kết quả `dong_y` / `da_sua`; chỉ người toàn hệ ghi (`fn_hau_kiem_ghi`). Loại đang có: gậy đã đánh / gỡ · đề xuất gậy bị bỏ qua · duyệt việc vận hành có phán đoán · ca sau giờ trưởng khối tạo. Hàng hậu kiểm = quyết định của người **không** phải toàn hệ / quản lý môn. Màn: *Team QLCL › Hậu kiểm* (gộp) và *Gậy › Hậu kiểm*.
Hướng về sau (Thùy 29/10): Trang chỉ xem **mẫu** ngẫu nhiên (lý thuyết *acceptance sampling*), rồi trưởng khối tự quyết hẳn từng loại việc. Hậu kiểm áp cho loại việc nào bây giờ ⇒ §11.1 câu 2.

## 4. Nhịp làm việc của trưởng khối

| Nhịp | Lúc | Việc | Ở đâu |
|---|---|---|---|
| **Ngày** | Trong 48 giờ sau khi TA khai | Duyệt công TA của ô mình | Phòng › 🗂 Duyệt công |
| | Thiếu công quá 24 giờ | Nhập hộ hoặc ghi "không có công" | như trên |
| | Trong 7 ngày từ lúc có đề xuất | Quyết gậy (Đánh / Bỏ qua) | Sảnh › Gậy |
| | Khi có báo | Duyệt báo sai | Sảnh › Duyệt chấm (+ kho) — §11.1 câu 4 |
| | Khi cần | Làm việc với Claude về bản đồ / kho | Phòng › 🤖 Phiên Claude |
| **Tuần** | Thứ Sáu (họp) → 23:59 | Điền Giáo trình tuần sau, Gửi duyệt | Phòng › 📅 Giáo trình tuần |
| | Chiều thứ Hai | Soi Dashboard, **chốt bổ trợ** tuần (đề xuất → Chốt & gửi) | Phòng › 📈 Chất lượng |
| | Chiều thứ Hai | **Công bố Mục tiêu tuần** theo lớp | Phòng › 🎯 Mục tiêu tuần |
| | Chiều thứ Hai | **Nộp Báo cáo tuần** tuần trước | Phòng › 📝 Báo cáo tuần |
| | Trong tuần | Theo dõi TA cấp dưới (hiệu suất, việc trễ, gậy) | Cảnh phòng |
| **Tháng** | Ngày 1–3 | Xử lý hết thiếu công + quyết hết đề xuất gậy của tháng trước | Duyệt công · Gậy |
| | Ngày 4 | (Trang) chốt gậy tháng | Gậy › Chốt tháng |
| | Ngày 5 | (Trang) chốt lương; Thùy xem tổng | Lương trợ giảng |
| **Học kì** | Cuối kì | Soát báo cáo học kì của khối — §8 | Report phụ huynh › Học kì |

- Trưởng bộ môn: thứ Bảy trước 12:00 duyệt Giáo trình tuần · thứ Hai – thứ Ba duyệt Báo cáo tuần, ghép Báo cáo Chuyên môn tuần, chiếu TV · duyệt đề xuất bổ trợ khi trưởng khối gửi.
- Nội dung, công thức, hạn chi tiết của từng việc tuần ⇒ `spec-van-hanh-tuan.md` §1, §3.8, §4, §5. Giờ hạn nộp Báo cáo tuần (đang chạy 17:00 thứ Hai) vẫn "chờ Thùy" ở §8.2 của spec đó.
- **Số (17/11):** công TA đang chờ duyệt 33 ca + 51 việc, trong đó **28 ca + 30 việc đã quá 48 giờ** (cũ nhất 01/11) · đề xuất gậy đang chờ 314, **274 có hạn quá 7 ngày, 147 quá 30 ngày** (220 có hạn trước 01/11 — diện ân xá Thùy đã gật 17/11, chưa chạy) · Báo cáo tuần: kỳ 26/10 nộp 5 · kỳ 02/11 nộp 3 · kỳ 09/11 nộp 5, trên 10 trưởng khối; 12 / 13 bản nộp bị ghi "trễ"; **chưa có Báo cáo Chuyên môn tuần nào được chốt** · Giáo trình tuần 16/11: 6 ô gửi, 4 ô đã duyệt.

## 5. Phòng làm việc trưởng khối

- **Sảnh** (ERP chung) và **Phòng** ngang hàng: cùng vai trò, khác địa điểm; nút ⇄ đổi qua lại (sang Phòng chỉ hiện khi có quyền `phong_tk`). Phòng là khu riêng trên menu ("Trang chính › Phòng làm việc"), không là con của nhóm Quản lý chất lượng (Thùy 03/11).
- **Phòng là lối đi tắt, không phải bản sao:** mỗi đồ vật mở đúng màn / hàm đang có; không số riêng, không logic riêng (Thùy 01/11).
- **Theo ghế, là khuôn dùng lại** — ba chế độ, không uuid:

| Chế độ | Ai vào | Nhân vật trong cảnh | Bấm nhân vật |
|---|---|---|---|
| **Trưởng khối** | Người có ô được phân công | TA của khối (suy từ lớp) — trên đầu: tên + **hiệu suất TA tháng** | Việc tuần (đang làm · xong · trễ) + gậy tháng, **chỉ tính việc trong ô của người xem** (Thùy 03/11) |
| **Trưởng bộ môn** | Quản lý môn, hoặc người toàn hệ | Các trưởng khối của môn (số = gộp TA trong khối) + **ghế trống biển đỏ** cho ô chưa có trưởng | Vào phòng của trưởng khối đó |
| **Giám đốc** | Ghế gốc Ban lãnh đạo | Trưởng bộ môn từng môn + trưởng Vận hành (chưa có cơ cấu phòng Vận hành) | Vào phòng trưởng bộ môn → trưởng khối → TA |

- Màn chính = **cảnh phòng**: mỗi bàn một người; nền đổi theo 🎨 Giao diện như Sảnh. Tranh hiện là SVG demo (`phongtk/CanhPhong.tsx`, hệ toạ độ 1600 × 900, 8 ghế + dải "Ngồi phòng bên"); Thùy sẽ vẽ lại — khi có tranh thì giữ toạ độ làm ô bấm.
- **Đồ vật = phần việc** (mở ra nền trắng, nút "← Về phòng chính"):

| Đồ vật | Mở ra | Ghi chú |
|---|---|---|
| 🤖 Máy tính | **Phiên Claude** — §6 | Giữ khung chat khi sang đồ vật khác rồi quay lại |
| 🗺 Tranh Bản đồ | Màn Bản đồ sẵn có | Theo quyền khối |
| 📋 Tranh Quản trị | **Báo cáo Sư phạm** của khối (việc của TA: chậm / miss) — §7 | Phòng trưởng bộ môn: chọn "Mọi khối" hoặc từng ô |
| 📈 Tranh Chất lượng | 4 mục: **Dashboard học tập** (bảng em × nhóm, nút **Bổ trợ**) · **Tình hình chung** (nhóm yếu đầu tuần → hiện tại; HS yếu ≥ 3 · 2 · 1 nhóm, tách nhóm cũ đang xử lý / nhóm mới tuần này; học tập tuần) · **Hồ sơ học tập** (một em) · **Danh sách bổ trợ** (đề xuất → Chốt & gửi; trưởng bộ môn Duyệt / Trả lại) | Thùy 10/11 |
| 📅 Giáo trình tuần | Điền khung từng ca tuần sau · gửi duyệt | Thùy 16/11 |
| 🎯 Mục tiêu tuần | Tờ tuần của các lớp · Công bố | Đồ vật riêng, không còn là tab trong Dashboard (Thùy 17/11 tối) |
| 📝 Lịch | Báo cáo tuần (trưởng khối: soạn / nộp · trưởng bộ môn: duyệt / ghép / chiếu) | |
| 🗂 Khay | Duyệt công TA — DB chỉ trả công thuộc ô của người mở | Thùy 09/11 |
| 💬 Bảng tin | **Hỏi vận hành TA** — chỉ phòng trưởng bộ môn; chỉ đọc; lương chỉ thấy phần lớp của môn mình | Thùy 05/11 |

- **Hiệu suất trên cảnh phòng:** số tháng đang chạy, cùng công thức với màn hiệu suất TA; đọc từ **bảng tính sẵn** `phong_so_luu` (làm mới nền 5 phút, có ngân sách giây — sau sự cố phòng Giám đốc chạm trần 8 giây ngày 10/11). Đầu tháng chưa có việc đã đóng ⇒ hiện "—", không phải 0.
- **Chưa có:** hàng việc **"Hôm nay"** trong phòng (một hàng việc suy theo invariant — đích 01/11) · huy hiệu nhắc trên đồ vật khi tới hạn · tranh cảnh thật · phòng Vận hành · duyệt công ngay từ phòng trưởng bộ môn (Thùy chọn "xem + được duyệt" 05/11, chưa làm).

## 6. Phiên Claude

### 6.1 Là gì (Thùy 30/10 → 01/11)
- Trưởng khối **chat thẳng** với Claude Code trong ERP, như Claude Code: `[+ Phiên mới]` → chọn loại việc + (môn × khối) → chat → `[Đóng phiên]` → Claude viết **tổng kết** → đã đóng (mở lại được). Không rải ô chat lên từng nút bản đồ.
- **Chỉ trưởng khối trở lên mở được phiên** (Phó, TA không — Thùy 04/11: "trợ giảng có phòng làm việc đâu"). TA: kiểm tra, báo sai — không có phiên.
- **Claude làm, người duyệt:** nháp bản đồ, lý thuyết dạng, giải bài, phân dạng là việc của Claude; nhận xét / duyệt / chốt là việc của trưởng khối trở lên. Thùy chỉ phát động.
- Bot chạy **trên máy Thùy** (máy nhà + máy công ty, nhận việc atomic nên không trả lời trùng), bằng **subscription Claude Code**, không API. Chung hạn mức với việc riêng của Thùy ⇒ mặc định một phiên chạy cùng lúc; chạm trần ⇒ màn ghi "Claude nghỉ tới hh:mm", việc không mất; máy tắt ⇒ "Claude mất liên lạc", tin vẫn giữ. Chạy thử ổn rồi mới tính VPS.

### 6.2 Loại việc

| Loại | Việc | Trạng thái |
|---|---|---|
| `ban_do` | Dựng / sửa cấu trúc bản đồ (chủ đề · chuyên đề · nhóm · dạng) | Đang mở |
| `ly_thuyet` | Lý thuyết · ví dụ · mô tả nhận biết của nhóm / dạng | Đang mở |
| `nhap_kho` | Đưa câu vào kho, phân dạng (vòng xoáy: câu chưa chắc → sửa mô tả / thêm dạng → phân lại) | Đang mở — Toán (Đại + Hình giải tích + Hình–Học + Hình–Luyện) và KHTN |
| `bao_sai` | Xử lý câu bị báo sai | **Chưa mở** — §11.1 câu 4 |
| `giai_bai` | Phát động giải bài | **Chưa mở**, của Thùy |

- **Loại phiên chỉ là nhãn việc** (Thùy 05/11): trong khối của mình, người mở phiên có **đủ quyền** với bản đồ và kho ở mọi loại phiên — thêm · sửa · **xoá** · lý thuyết · nhập kho · phân dạng · duyệt câu · sửa câu · gắn ảnh · kho rác · vẽ hình · cả phần Hình (Thùy 05/11, 06/11, 07/11, 12/11).
- Mỗi loại nạp sẵn ngữ cảnh + bộ lệnh: `scripts/phien/loai/<loại>.md` + luật chung `scripts/phien/CHUNG.md`. Lệnh / quyền mới thêm giữa chừng ⇒ một dòng ở `scripts/phien/MOI.md` (bot tự chèn cho phiên mở trước mốc đó — Thùy 09/11).

### 6.3 Luật

1. **Phiên khoá vào (môn × khối).** Claude chỉ đụng được khối đó.
2. **Rào cứng ở DB, không ở lời dặn Claude.** Mọi lệnh ghi đi qua `fn_phien_*` (chỉ `service_role` gọi): phiên phải đang mở · hàm **đóng vai người mở phiên** rồi kiểm lại "trưởng khối trở lên" của ô — **AI không bao giờ có quyền lớn hơn người nhờ nó**; mất phân công giữa chừng ⇒ lệnh sau bị chặn · mọi nút / câu phải thuộc đúng khối.
3. **Claude của trưởng khối hẹp hơn Claude của Thùy:** chỉ đọc (repo + thư mục tài liệu) + đúng **một** lệnh ghi `node scripts/phien/ban-do.mjs`. Không ghi file, không Bash tự do, không web, **không đọc `.env*`**. Mã phiên lấy từ biến do bot đặt — Claude không trỏ sang phiên khác được.
4. **Xoá:** được (Thùy 05/11 — thay luật 01/11 "không có lệnh xoá"), nhưng **trước khi xoá hoặc ghi đè thứ người đã quyết, Claude phải nói rõ sẽ mất gì và chờ người mở phiên gật trong chat**. Nút còn câu đã gán ⇒ DB báo số câu, phải chuyển câu đi trước. Câu người đã gán / đã kiểm mẫu: Claude chỉ ghi đè khi trưởng khối bảo rõ.
5. **Tự gán khi chắc** (Thùy 01/11): phân dạng mức "cao" (khớp đúng một dạng, không dạng thứ hai hợp lý, đọc được trọn đề) ⇒ gán luôn, chấp nhận một phần sai, sửa bằng kiểm mẫu. "Vừa" ⇒ hàng duyệt của trưởng khối (bắt buộc ghi lý do phân vân). "Thiếu dạng" ⇒ gom **thành cụm theo lý do** để đề xuất thêm dạng / sửa mô tả. Luật duyệt **lời giải** vẫn ở `spec-giai-bai.md` §C6 — phiên không đổi luật đó.
6. **Ghi lý thuyết:** ô đang có chữ ⇒ bắt buộc mã băm bản hiện tại khớp (trưởng khối vừa sửa tay thì Claude bị từ chối, phải đọc lại). Công cụ chặn lỗi định dạng công thức và đoạn thiếu thẻ.
7. **Mã gốc bất biến:** đổi tên, chuyển chỗ, sắp xếp đều giữ mã. Log bản đồ ghi người làm = người mở phiên; `claude_phien_ghi` giữ vết từng lệnh của Claude.
8. **Mỗi lượt kết thúc bằng một trong ba:** đã làm xong · không làm, vì… · đang chờ trả lời. Việc dài: Claude tự làm tiếp tối đa 6 lượt sau mỗi tin của người; người nhắn chen thì dừng.
9. **Đóng phiên là quên** ⇒ bài học phải ghi ra ngoài: Claude đề xuất luật cho khối, trưởng khối gật (Claude chưa có tay ghi file luật — đề xuất nằm trong chat / tổng kết).
10. Nói với trưởng khối bằng tên + số hiển thị, không dùng từ của DB.
11. **Một khối nhiều phiên cùng lúc: đang được phép** (chốt "mỗi bản đồ một phiên" của 01/11 đã gỡ 05/11) ⇒ §11.1 câu 10.

### 6.4 Số (17/11, 30 ngày = toàn bộ từ 01/11)
- 37 phiên / 7 người / 12 ô — Toán 19 · KHTN 18. Theo loại: Bản đồ 14 (11 đóng · 3 mở) · Lý thuyết 8 (6 · 2) · Nhập kho 15 (9 · 6). Đang mở 11; một ô đang có 3 phiên mở cùng lúc.
- 1.164 tin (340 của người) · 6.491 lệnh ghi của Claude — nhiều nhất: thêm câu 2.191 · phân dạng 1.092 · thêm dạng 842 · gắn ảnh 680 · thêm nhóm 328; lệnh xoá nút bản đồ 196.

## 7. Trợ lý 🤖 + các báo cáo

### 7.1 Nguyên tắc (CEO 29/09)
- **Báo cáo là chính, hỏi là phụ.** Báo cáo đủ dữ liệu thì gần như không cần hỏi lại.
- **Không realtime:** lượt đầu mở máy tự tính, lưu DB; mở lại đọc bản lưu; bấm "↻ Tính lại" thì ghi đè. Màn luôn ghi "số liệu tính lúc…".
- **Máy tính hết số, mô hình chỉ đọc rồi trò chuyện.** Thiếu dữ liệu thì **nói thẳng là thiếu**, không bịa, không im.
- **Chỉ đếm là nợ khi có bằng chứng phải làm** (buổi có đề ET gắn vào · có BTVN gắn vào · đánh giá sau buổi: bắt buộc mọi buổi — CEO 14/08). Nghĩa vụ suy từ **lịch**: ET · đánh giá của buổi vừa dạy; BTVN đến hạn ở buổi kế tiếp.

### 7.2 Ai thấy gì

| Người | Thấy | Ở đâu |
|---|---|---|
| **3 tài khoản** — người có ghế team Ban lãnh đạo (Thùy · Trang · Lộc) | Trọn tab 🤖: Báo cáo Sư phạm toàn trung tâm · Tổng kết tuần · các mảng (vận hành, bù, đuổi, yếu, test đầu vào, việc của tôi) · ô hỏi | Sảnh › 🤖 Trợ lý. Danh sách theo ghế (`hoi_dap_ds_tai_khoan`), không uuid |
| Trưởng khối · quản lý môn | **Báo cáo Sư phạm lọc theo ô của mình** · Dạng yếu · Học tập tuần (ET / BTVN trung bình từng lớp, tuần này so tuần trước) | Phòng › Quản trị, Chất lượng |
| Trưởng bộ môn | Như trên cho mọi khối của môn + chip lọc từng ô + ô **Hỏi vận hành TA** | Phòng trưởng bộ môn |

- Mỗi người quản một mảng có **một bộ báo cáo riêng**: Trang = **Sư phạm** (đã xây) · Lộc = **Vận hành** (chưa xây, chờ mẫu của CEO).
- Ô hỏi cho trưởng khối: nguồn mâu thuẫn ⇒ §11.1 câu 9.

### 7.3 Báo cáo Sư phạm — 3 luồng (mục nào cũng phải đủ)
1. **Bao nhiêu việc đang CHẬM / đang MISS.** 2. Nút **Detail** — bấm mới hiện từng việc: ngày nào, ai phụ trách. 3. **Cảnh báo** rủi ro / bất thường.
- Đơn vị = **việc** (có ngày + người phụ trách + hạn); gom việc còn treo 7 / 14 / 30 ngày (mặc định 14). Mục: BTVN · ET · đánh giá trong buổi · đánh giá sau buổi · bổ trợ bù · bổ trợ yếu.
- **Chậm** = quá hạn chưa đóng · **Miss** = hỏng nội dung (không có đề · đóng mà trống · đóng mà còn em có mặt thiếu dữ liệu · ca bổ trợ hoàn tất mà không test) · **Đóng muộn** đếm riêng · **Học sinh không đến** báo riêng, không phải miss.
- Chấm bài trên lớp bắt buộc từ 01/10/2026. "Không có đề" chỉ là miss với lớp thật sự chạy khâu đó (≥ 60 % buổi / 60 ngày). Người phụ trách + hạn lấy từ hàm việc buổi thường, không định nghĩa lại.
- **BTVN có hai phần đo hai người:** (i) học sinh làm BTVN thế nào (không làm lặp lại · thái độ · điểm thấp hơn hẳn lớp) · (ii) TA chấm thế nào (chậm / miss + **tỉ lệ nộp đạt chuẩn theo lớp**; một em đạt khi đủ ba: đã nộp · đã tick thái độ · có điểm chấm câu; lớp dưới **70 %** là "tệ"; xin phép: vẫn tính chưa nộp, không gắn cảnh báo thái độ). ET **không** có tỉ lệ tương tự.

### 7.4 Tổng kết tuần — dashboard theo bảng
- Trả lời "cả hệ chạy tốt tới đâu" (Báo cáo trả lời "việc nào hỏng, của ai") — không gộp hai thứ.
- **Mỗi mảng một bảng**, cùng bộ cột: tuần này · tuần trước · thường đạt · so với thường đạt · xu hướng. Bảng đầu = "Cần chú ý". Mảng: việc sau buổi · quy mô & chuyên cần · kết quả học tập · bổ trợ yếu · bổ trợ bù · bổ trợ đuổi · tuyển sinh. **Học phí không đưa vào.**
- Việc sau buổi: mỗi khâu 3 tỉ lệ đúng chuẩn / chậm / thiếu, mẫu số = việc đã tới hạn hoặc đã đóng; Detail = xếp hạng giáo viên – TA. Xếp hạng bỏ qua người giữ ghế Lead / QLCL (việc của họ vẫn tính trong số trung tâm).
- **"Thường đạt"** = ngưỡng của mọi chỉ số: trung bình **8 tuần liền trước**, **lọc nhiễu trước rồi mới lấy trung bình**; lần đo nhiễu vẫn hiện trên xu hướng (đánh dấu). Tuần mảng chưa chạy không phải lần đo. Chỉ số còn đổi sau khi tuần kết thúc: 7 ngày đầu ghi "chưa chốt". Bốn mức: vấn đề · dưới thường đạt · bình thường · trên thường đạt. Lý thuyết: biểu đồ kiểm soát Shewhart + hàng rào Tukey.
- Con số tạm dùng, **chưa chốt**: nhiễu = ngoài 1,5 × IQR · dưới thường đạt = xấu hơn 1 độ lệch chuẩn · vấn đề = 2 độ lệch chuẩn · tối thiểu 4 lần đo.
- **Trình chiếu:** mỗi bảng một màn vừa khít, chuyển Trước / Sau, có mục lục, dùng được phím mũi tên / bút trình chiếu. Để thẳng trên ERP.
- **Tự tính sáng thứ Hai** cho tuần vừa rồi (cùng lượt máy chụp sổ đầu tuần).

### 7.5 Luật kỹ thuật
- Mọi con số ở `fn_troly_*` / `_troly_*`; màn không cộng trừ. Luật phân loại việc **một nguồn** `_troly_viec_buoi_goc` (Báo cáo và Tổng kết tuần cùng đọc). **Thêm chỉ số = thêm một dòng ở `_troly_tuan_danh_muc()`** (hiện 52 chỉ số). Hệ số ngưỡng ở `_troly_bc_gia_dinh()`.
- Bản lưu: `troly_bao_cao_luu` (bộ · ngày · khoảng) · `troly_tuan_so_luu` (số từng tuần).
- Kiểm: `scripts/check-troly-cong-cu.mjs`, rồi **mở trên app bằng phiên đăng nhập thật** (script không thấy RLS và trần 8 giây).
- **Số (17/11):** Báo cáo Sư phạm 68 bản lưu từ 29/09; 30 ngày gần nhất có bản ở 29 / 30 ngày. Số tuần đã lưu: 22 tuần (15/06 → 09/11), lượt tự tính gần nhất 00:05 thứ Hai 16/11. Ô hỏi: 30 ngày có 7 câu của 1 người.
- **Còn treo:** bộ báo cáo Vận hành · thông báo sáng thứ Hai gửi qua app nào · "chuyển lịch" bổ trợ chưa đo được (chưa ghi vết đổi ngày giờ) · ba nguồn dữ liệu còn thiếu (tốc độ làm bài · tác động của việc không làm BTVN · danh sách chờ duyệt bổ trợ).

## 8. Báo cáo học kì — phần của đội QLCL

> Nội dung báo cáo, công thức, bố cục, PDF, app phụ huynh ⇒ #13. Ở đây chỉ ghi **ai làm gì**.

- **Tạo / sửa kì** (`ky_hoc`): quản trị hệ thống (Thùy 04/11).
- **Nhập** (điểm dự đoán · sai số · 9 mục nhận xét · kết luận · kế hoạch): giáo viên; hệ gợi ý sẵn phần có số liệu, giáo viên duyệt / sửa (Thùy 05/11).
- **Công bố** = chụp bản đóng băng; đã công bố thì không tính lại, muốn đổi phải Mở lại → công bố lại. Điều kiện: đủ điểm dự đoán + sai số + mọi mục nhỏ đã chọn.
- **Quy trình** (Thùy 07/11): giáo viên điền → công bố → **quản trị soát** (ERP / PDF) → bật công tắc **app phụ huynh** cho cả kì (`ky_hoc.mo_ph`, mỗi lần đổi có vết).
- **Sửa danh mục nhận xét / ngưỡng / phương án:** quản trị, ngay trên ERP.
- **Đang chạy:** nhập + công bố + mở lại = **mọi nhân sự** (hàm không có cổng); tự chốt lúc build 04/11, ghi "Thùy soát". Trưởng khối chưa có vai gì trong quy trình ⇒ §11.1 câu 8.
- **Số (17/11):** 1 kì ("Nửa kì 1", tháng 7 → 10), app phụ huynh đang bật · 362 báo cáo, **325 đã công bố** (Toán 274 / 311 · KHTN 51 / 51).

## 9. KPI trưởng khối · hậu kiểm của Trang

### 9.1 KPI dạng yếu (Thùy 29/10 — "đo trước, chốt số sau")
- KPI của người QLCL = **số yếu của khối ở mức chấp nhận được**. Mô hình *dòng chảy – tồn kho*: học mới sinh yếu, quên sinh yếu, bổ trợ làm hết yếu.
- **Phải nhìn đủ bộ, không nhìn một số** (chống *định luật Goodhart* — cách rẻ nhất để số yếu giảm là đo ít đi):

| Chỉ số | Nghĩa |
|---|---|
| **HS yếu** · **Tổng nhóm yếu / dạng yếu** | Tồn |
| **Vào** | Tuần này yếu mà tuần trước không yếu |
| **Ra — có bằng chứng** | Tuần trước yếu, tuần này hết yếu **nhờ lần đo mới** (mọi lần đo mastery tính, gồm test sau giờ — Thùy 17/11) |
| **Ra — rớt cửa sổ** | Hết yếu chỉ vì không còn lần đo trong cửa sổ — **không tính là thành tích** |
| **Độ phủ đo** | Tỉ lệ em có đo trong tuần |

- **Đóng băng đầu tuần:** mỗi (tuần × môn × em) một dòng `dang_yeu_dau_tuan` (số dạng yếu · số nhóm yếu · danh sách). Chỉ có dòng cho em **có dữ liệu đo** (chưa đo = không có dòng, không phải dòng 0). Số "hiện tại" ở `dang_yeu_hien_tai` (làm mới nền 5 phút).
- **Ai đóng băng:** 29/10 chốt "Trang bấm Chốt tuần, không tự chụp"; 03/11 chốt "ảnh đầu tuần chụp tự động" — đang chạy: **máy chụp 00:00 thứ Hai** ⇒ §11.1 câu 1.
- **"Mức chấp nhận được": chưa có số.** Đang đo và hiển thị. Khi chốt, dùng lại cơ chế "thường đạt" (§7.4): mỗi chỉ số một dòng trong danh mục, có phạm vi khối. KPI đếm theo dạng hay theo nhóm, chốt lúc nào ⇒ §11.1 câu 7.
- Cấu trúc bản đồ đổi (gộp / tách dạng) ⇒ chuỗi KPI đánh dấu "gãy", không đem so. Rủi ro "gộp dạng cho đẹp KPI" không cần chặn — bản đồ dùng chung, đổi là ai cũng thấy (Thùy 01/11).
- **Ở đâu:** Phòng › Chất lượng › Tình hình chung (khối mình) · Báo cáo tuần (bản snap, `spec-van-hanh-tuan.md` §5.5) · Sảnh › Việc của tôi › widget Dạng yếu · Trang / Thùy: mọi khối cạnh nhau.
- **Số (17/11):** ảnh đầu tuần có 2 tuần — Toán 09/11: 338 em có đo, 263 HS yếu, 807 nhóm yếu → 16/11: 338 em, **256 HS yếu, 738 nhóm yếu**; KHTN 09/11: 54 em, 45 HS yếu → 16/11: 55 em, 48 HS yếu.

### 9.2 Các số khác trưởng khối chịu trách nhiệm (đang hiển thị, chưa là KPI có ngưỡng)
Hiệu suất TA của khối (cảnh phòng) · tỉ lệ việc sau buổi đúng chuẩn (Báo cáo Sư phạm) · Độ phủ bổ trợ + số em hết yếu sau ca (Báo cáo tuần) · đúng hạn Giáo trình tuần, Báo cáo tuần, duyệt công 48 giờ, quyết gậy 7 ngày (trễ ⇒ đề xuất gậy, Trang quyết).

### 9.3 Hậu kiểm của Trang
- Cơ chế + loại việc: §3. **Số (17/11): 27 lượt hậu kiểm, đều là gậy** (11 gậy đã đánh · 16 đề xuất bỏ qua), **cả 27 "đồng ý"**, do một người làm; việc vận hành và ca sau giờ: 0 lượt.
- Việc Trang làm thay khi trưởng khối quá hạn: công TA quá 48 giờ · đề xuất gậy quá 7 ngày (đều **chưa build** — chưa có khay).

## 10. Bảng · hàm · trigger (đối chiếu 17/11)

| Phần | Bảng | Hàm chính | Trigger / lịch |
|---|---|---|---|
| Ghế · team · vai | `team` (8) · `vi_tri` (93; `cap` ∈ truong · pho · thanh_vien; `tk_tu_dong`) · `nhan_su_team` · `vai_tro` (9) · `vai_tro_chuc_nang` | `_qlcl_toan_he` · `_quan_ly_mon` · `fn_qlcl_team` | `trg_vi_tri_dong_bo_team` |
| Phân công | `phan_cong_quan_ly_khoi` (+ `_log`) | `fn_qlcl_phan_cong_luu` · `fn_pham_vi_cua_toi` · `_trong_pham_vi` · `_truong_khoi_tro_len` · `_khoi_quan_ly` · `fn_mon_cua_toi` | `pcqlk_log_trg` · `pcqlk_dong_bo_ghe_trg` (→ `_tk_dong_bo` sinh / giữ ghế) |
| Hậu kiểm | `hau_kiem` (`loai` ∈ gay_ledger · gay_bo_qua · viec_van_hanh · ca_nhe; `ket_qua` ∈ dong_y · da_sua) | `fn_hau_kiem_gay` · `_khac` · `_ghi` · `_mo_lai_de_xuat` · `_sua_vvh` | — |
| KPI dạng yếu | `dang_yeu_dau_tuan` · `dang_yeu_hien_tai` | `fn_qlcl_tong_quan` · `_nhom_yeu` · `_dang_yeu_hs` · `_dong_chay` · `_de_xuat_yeu` | Bộ điều phối: `dang_yeu` (5 phút) · chụp đầu tuần `_tu_dong_sang_t2` |
| Phòng | `phong_so_luu` | `fn_phong_che_do` · `_la_gd` · `_cap_duoi*` · `_ghe_tbm*` · `_ghe_gd` · `_hoi_danh_muc` · `_hoi_goi` · `_phong_mon_cua_toi` · `_phong_trong_pham_vi` | Bộ điều phối: `phong_so` (5 phút) |
| Phiên Claude | `claude_phien` (`loai` 5 giá trị; `trang_thai` mo · dang_dong · dong) · `_tin` · `_ghi` · `_lich_su` · `_bot` | Người: `fn_phien_mo` · `_gui` · `_dong` · `_mo_lai` · `_ds` · `_pham_vi` — Claude (service_role): `fn_phien_bd_xem / _doc / _ghi / _thay_doi` · `fn_phien_lt_ghi` · `fn_phien_kho_*` · `fn_phien_hh_*` · `fn_phien_hinh_goi` · `fn_phien_anh_gan` — bot: `fn_phien_bot_nhan / _tra / _nhat_mo_coi` | `trg_claude_phien_lich_su` · `_touch` · `_tin_bump` |
| Trợ lý | `troly_bao_cao_luu` · `troly_tuan_so_luu` · `troly_hoi_dap` · `troly_ra_soat` · `troly_nhan_dinh` | `fn_troly_bao_cao_lay` · `_tuan_lay` · `_ca_nhan_lay` · `_o_lay` · `_phong_lay` · `_ca_nhan_tuan` · `_troly_tuan_danh_muc` · `_troly_viec_buoi_goc` · `_troly_bc_gia_dinh` · cổng `_troly_gac` | Tự tính sáng thứ Hai |
| Đề xuất bổ trợ | `bo_tro_de_xuat` (+ `_log`) | `fn_btk_luu / _gui / _duyet / _tra_lai / _huy / _ds / _goi_y`; cổng `_btk_la_tk` · `_btk_la_tbm` | `trg_bo_tro_de_xuat_log` |
| Báo cáo tuần · Giáo trình tuần | ⇒ `spec-van-hanh-tuan.md` §3.6, §5.11 | | |
| Task phát triển | `task_phat_trien` (+ `_log`) · `task_xin_gia_han` | `fn_task_giao / _bao_xong / _duyet / _gia_han / _xin_gia_han / _quyet_gia_han / _bang_v2` | — |
| Báo cáo học kì | `ky_hoc` · `bao_cao_ph_ky` (+ `_log`) · `bc_ky_*` | `fn_bc_ky_tinh / _xem / _cong_bo / _mo_lai / _cong_bo_lop` | `trg_bao_cao_ph_ky_truoc` (chặn sửa sau công bố) · `_log` |

**Code:** `src/screens/phongtk/` (15 file) · `qlcl/` (`QlclTeamScreen` · `HauKiemKhac` · `WidgetDangYeu`) · `troly/` (`TroLyTab` · `BaoCao` · `BaoCaoCaNhan` · `TongKetTuan`) · `phanquyen/PhanQuyenScreen.tsx` · `danhgia/DashboardHocTapScreen.tsx` ·
`src/lib/`: `phongTk.ts` · `phien.ts` · `qlcl.ts` · `monQuyen.ts` · `boTroTk.ts` · `baoCaoTuan.ts` · `giaoTrinhTuan.ts` · `troly-*.ts` · `nhansu.ts` · `quyen.ts` · `scripts/phien/` · `scripts/hoidap/` · `api/phong-hoi.mjs`.

## 11. Câu hỏi cho Thùy · lệch

### 11.0 THÙY CHỐT 17/11 — "Chốt theo đề xuất"

| Câu | Luật chốt | Việc code / DB (chờ lệnh) |
|---|---|---|
| 1 | **Bỏ hẳn nút "Chốt tuần".** Số đầu tuần luôn do máy chụp 00:00 thứ Hai. | gỡ đường chốt tay cũ (Luật xoá — liệt kê trước) |
| 2 | **Trang hậu kiểm MẪU ~1 / 5** quyết định của trưởng khối, cho ba loại: **gậy · duyệt công TA · duyệt báo sai**. Bổ trợ · giáo trình tuần · báo cáo tuần đã có trưởng bộ môn duyệt ⇒ không xem lại. | hàng hậu kiểm thêm loại công TA + báo sai, lấy mẫu 1 / 5 |
| 3 | **Phó khối chỉ soạn giúp** (điền giáo trình tuần, soạn đề xuất bổ trợ ở dạng NHÁP). Bấm gửi · duyệt công · gậy · phiên Claude · báo cáo tuần là của Trưởng. Một ô một người chịu trách nhiệm. | thu quyền gửi đề xuất / duyệt công của Phó ở DB |
| 4 | **SỬA 18/11 (Thùy, khi chốt spec Giải bài): báo sai KHÔNG qua người duyệt.** "Cần có quy trình để Claude tự động đọc và sửa — không liên quan đến người. Chỉ báo cáo lại cho người nhìn, không cần duyệt. Nếu sai người hậu kiểm và sửa sau." ⇒ Claude tự đọc báo sai, tự quyết, tự sửa câu; trưởng khối / Trang nhận BÁO CÁO và hậu kiểm. Bỏ "trưởng khối duyệt theo lô trong 48 giờ" (quyết định 17/11). Áp cho báo "đề / đáp án sai" (88 cái tồn); báo "máy chấm sai câu trả lời của em" (814 cái tồn) Thùy chưa nói riêng — tôi hiểu cùng luật, xác nhận khi build. | quy trình Claude tự xử báo sai + báo cáo + ghi vết; gỡ việc khỏi TA |
| 5 | **Thùy 18/11: "Quản lý môn và trưởng bộ môn là MỘT mà."** ⇒ một vai, một người mỗi môn — hai tên gọi chỉ cùng một ghế (ghế quản lý môn trong bảng phân công). Người đó duyệt bổ trợ · giáo trình tuần · báo cáo tuần của môn và nhận đề xuất gậy khi trễ. *(Đề xuất cũ của tôi "tách hai người, Toán: Trang" là SAI — bỏ. Ai giữ ghế từng môn: theo bảng phân công trên màn, spec không ghi tên.)* Mọi chỗ trong spec viết "trưởng bộ môn" hay "quản lý môn" đều là vai này. | gộp cách gọi trên màn / hàm (`_btk_la_tbm`, `_quan_ly_mon`) về một nguồn |
| 6 | **Thùy 18/11: "Văn bỏ qua."** ⇒ ô Văn 8 không xét (Văn đang gác lại — không nhắc việc, không tính thiếu trưởng khối). 19 ô còn lại đều đã có trưởng khối ⇒ hiện không có ô trống nào cần luật. Luật dự phòng khi sau này có ô trống ở môn đang chạy: việc về quản lý môn (= trưởng bộ môn), rồi Trang. | loại Văn khỏi các chỗ đếm "ô thiếu trưởng khối" |
| 7 | **Thùy 18/11: "Tạm là thế. Sau này sẽ viết kỹ hơn."** ⇒ TẠM: KPI = số em yếu (theo nhóm) + số nhóm yếu, kèm "hết yếu có bằng chứng" và "độ phủ đo"; chỉ hiển thị, chưa đặt ngưỡng, chưa có hệ quả. Phần KPI sẽ viết lại kỹ hơn — chưa coi là luật cuối. | — |
| 8 | **Thùy 18/11: "Trưởng khối."** ⇒ **người bấm CÔNG BỐ báo cáo học kì gửi phụ huynh là TRƯỞNG KHỐI** (trong phạm vi môn × khối của mình): giáo viên nhập → trưởng khối soát + công bố → quản trị bật app phụ huynh cho cả kì. Giáo viên, TA, nhân sự khác KHÔNG công bố / mở lại được. *(Đề xuất cũ "giáo viên tự công bố lớp mình" bỏ.)* | cổng `fn_bc_ky_cong_bo` / `_mo_lai` / `_cong_bo_lop` theo phạm vi trưởng khối + policy `bao_cao_ph_ky` |
| 9 | **Trưởng khối KHÔNG có ô hỏi trợ lý** (đã có báo cáo lọc sẵn + phiên Claude). Ô hỏi vẫn chỉ 3 tài khoản ban lãnh đạo. | — |
| 10 | **Phiên Claude: giữ tự do như 05/11** — một khối mở được nhiều phiên cùng lúc, có lệnh xoá (Claude phải hỏi trước khi xoá); thêm dòng cảnh báo "khối này đang có phiên khác mở" (không chặn). Luật 01/11 "mỗi bản đồ một phiên sửa · không lệnh xoá" HẾT hiệu lực. | dòng cảnh báo trên màn phiên |

### 11.0b Đã sửa code / DB (18/11, Thùy "Bịt ngay") — mig `202611181239` + `202611181241` ĐÃ ÁP
- ✅ **Nhãn team:** `nhan_su_team` + `team` ai cũng đọc; GHI chỉ người có quyền nhân sự / sơ đồ tổ chức / phân quyền (4 / 44 nhân sự), cùng khuôn với `vi_tri`. Hết đường tự thêm nhãn Vận hành / Media / Marketing để thấy mọi môn.
- ✅ **Công bố báo cáo học kì (câu 8):** trigger `trg_bao_cao_ph_ky_quyen_cong_bo` chặn mọi đường đổi trạng thái công bố (qua hàm lẫn ghi thẳng bảng) nếu người gọi không phải **trưởng khối của (môn, khối lớp em)**, quản lý môn, hoặc QLCL / quản trị. Phó khối, giáo viên, TA bị chặn. Nhập / sửa nội dung báo cáo chưa công bố vẫn như cũ. Thử bằng jwt giả lập: nhân sự thường ⇒ chặn (cả hai đường) · trưởng khối khác khối ⇒ chặn · trưởng khối đúng khối ⇒ được.
- *Chưa làm:* màn vẫn hiện nút Công bố cho mọi người (bấm sẽ nhận câu báo lỗi rõ) — ẩn nút theo quyền khi có lệnh. Ai được bật app phụ huynh cho cả kì: chưa rà.

### 11.0c Đã làm 18/11 (Thùy ra lệnh trưa 18/11) — mig `202611181253` · `1302` · `1305` · `1306` ĐÃ ÁP
- ✅ **Báo cáo tuần: 3 tab con** Vận hành · Học tập · Phát triển cá nhân, ô chỉ số tổng quát + mục gập chi tiết; thêm khối số Vận hành ⇒ `spec-van-hanh-tuan.md` §5.5b.
- ✅ **Phòng làm việc (trưởng khối · trưởng bộ môn · giám đốc): mọi phần việc mở FULL bề ngang và cao hết màn** — bỏ khung 1180 px ở giữa (Báo cáo tuần · Quản trị · Hỏi vận hành TA · Phiên Claude · Bản đồ).
- ✅ **Dashboard học tập — cột Bổ trợ hiện MỨC + trạng thái hiện tại** của em × môn: `L2 · Nháp` / `Chờ trưởng bộ môn` / `Bị trả lại` / `Chờ xếp ca` / `Có ca dd/mm` / `Đã xong ✓` (case đóng trong tuần này, không tính bỏ / hết hạn — hết tuần về trống). Ưu tiên: đề xuất đang sống > case đang mở > case xong tuần này. Mức của case = mức của đề xuất đã mở case; ca sau giờ = L1. Case ca khối (L2–L4) đang mở thì không đề xuất chồng; L1 đang mở / đã xong vẫn đề xuất tiếp được.
- ✅ **Danh sách bổ trợ thêm 2 cột** (cùng màn cho trưởng khối · trưởng bộ môn · giám đốc):
  **Báo động tuần** = chuông của giáo viên / TA trong tuần (thứ Hai → Chủ nhật) của đề xuất, đúng môn: ngày · nguồn (ET / BTVN / đánh giá) · lớp · ghi chú.
  **Lịch sử bổ trợ 2 tuần** = mọi ca bổ trợ (sau giờ · ca khối) em có tên trong tuần trước + tuần này, gom theo tuần: mức · ngày · `hết yếu x/y dạng` · `test a/b câu` · vắng · đã xếp ca chưa học.
  **"Hết yếu x/y dạng"** = trong y dạng đã dạy ở ca đó, x dạng HIỆN không còn ở mức yếu — đọc bảng mastery lưu sẵn (không quét lịch sử đo; khác "kết quả cố định theo ngày ca" của màn Kết quả bổ trợ tuần). Hàm `_btk_lich_su_hs` · `_btk_bao_dong_tuan` gọi trong `fn_btk_ds` (đo 18/11: 191 em ~0,12 s).
- ⚠ **Sự cố do tôi, 13:02 → 13:05 ngày 18/11 (~3 phút):** bảng Dashboard học tập báo "permission denied for function _btk_trang_thai_hs" — `fn_dbht_bang` chạy theo quyền người gọi mà tôi khoá hàm phụ nó gọi. Lộ khi mở app thử; vá bằng mig `1305`, rồi mig `1306` đưa logic vào thẳng hàm bảng và khoá lại hàm phụ (cổng kiến trúc về mức cũ). Bài học: thêm hàm phụ cho một hàm màn ⇒ xem hàm màn là definer hay invoker TRƯỚC khi revoke. Hàm `_btk_trang_thai_hs` không còn ai gọi ⇒ đã xoá (mig `202611181310`, Thùy "Xoá đi").
- *Chưa làm trong lượt này:* báo động theo TUẦN ngay trên Dashboard (🚨 trên Dashboard vẫn là 30 ngày) · các gói §11.0 / §11.2 còn lại.

### 11.1 Câu hỏi gốc (ĐÃ TRẢ LỜI ở 11.0 — giữ làm bối cảnh)

**1. Thứ Hai, chị Trang có còn phải bấm nút "Chốt tuần" nữa không?**
Ví dụ: sáng thứ Hai 16/11, máy đã tự chụp lúc 00:00 — Toán có 256 em yếu. Con số "đầu tuần" trên mọi màn của trưởng khối đang lấy từ bản máy chụp này; nút Chốt tuần cũ chị Trang bấm lần cuối ngày 10/11, màn chứa nút đó đã ẩn từ 10/11.
Hai lần Thùy chốt trái nhau: 29/10 "Trang vẫn bấm, không tự chụp" · 03/11 "ảnh đầu tuần chụp tự động".
(a) Bỏ hẳn nút — số đầu tuần luôn do máy chụp 00:00 thứ Hai. (b) Giữ nút — số đầu tuần chỉ có khi chị Trang bấm.
Đang chạy: (a). **Đề xuất: (a)** — không phụ thuộc một người nhớ bấm, tuần nào cũng có số.

**2. Chị Trang xem lại (hậu kiểm) những quyết định nào của trưởng khối, và xem hết hay xem mẫu?**
Ví dụ: tháng 11 chị Trang đã xem lại 27 quyết định, toàn là gậy, đồng ý cả 27. Trong lúc đó trưởng khối còn duyệt công TA, duyệt việc vận hành, tạo ca sau giờ — chưa ai xem lại lượt nào.
(a) Xem lại **mẫu** khoảng 1 / 5 quyết định, cho ba loại: gậy · duyệt công TA · duyệt báo sai; bổ trợ, giáo trình tuần, báo cáo tuần đã có trưởng bộ môn duyệt trước nên không xem lại nữa. (b) Xem lại **hết** mọi quyết định của mọi loại như chốt 29/10.
Đang chạy: hàng xem lại có 3 loại (gậy · việc vận hành · ca sau giờ), không lấy mẫu, không có công TA và báo sai. **Đề xuất: (a).**

**3. Phó khối được làm những gì?**
Ví dụ: khối 7 có trưởng và phó. Hôm nay phó khối 7 mở Dashboard là bấm đề xuất bổ trợ cho một em được, và (theo luật phạm vi) duyệt công của TA khối 7 được; nhưng không quyết gậy, không mở phiên Claude, không nộp báo cáo tuần. Chốt 29/10 chỉ ghi: "Phó không duyệt gậy, không duyệt case; giữ vai vận hành".
(a) Phó chỉ **soạn giúp** (điền giáo trình tuần, soạn đề xuất bổ trợ ở dạng nháp); bấm "gửi", duyệt công, gậy đều là của Trưởng. (b) Phó làm thay Trưởng được mọi việc trừ gậy và phiên Claude (như đang chạy). (c) Phó chỉ xem.
**Đề xuất: (a)** — một ô một người chịu trách nhiệm; 5 ô đang có phó.

**4. Duyệt báo sai chuyển về trưởng khối — hạn bao lâu, và đống báo sai đang tồn xử lý thế nào?**
Có hai loại báo: em báo "máy chấm sai câu trả lời của em" (đang tồn **814** cái, cũ nhất từ 22/08) và em báo "đề / đáp án sai" (đang tồn **88** cái). Ví dụ: có em báo máy chấm sai từ ngày 22/08, tới nay chưa ai trả lời.
(a) Hạn **48 giờ** cho báo mới; phần tồn: Claude lọc trước (gom cái giống nhau, đề xuất đúng / sai), trưởng khối bấm duyệt theo lô; báo trước 01/11 mà em đã nghỉ thì đóng luôn. (b) Hạn 7 ngày, trưởng khối tự xử hết phần tồn. (c) Xoá trắng phần tồn trước 01/11, chỉ làm từ tháng 11.
Đang chạy: việc vẫn nằm ở "Việc của tôi" của TA lớp, hạn 24 giờ; báo "đề sai" ai có quyền sửa bản đồ là xử được, không theo khối. **Đề xuất: (a)**, và mở loại phiên Claude "câu báo sai" cho việc lọc.

**5. "Trưởng bộ môn" và "quản lý môn" là một người hay hai?**
Ví dụ môn Toán: Thùy giữ ghế gốc của môn Toán (quản lý môn), chị Trang là người duyệt hằng tuần (trưởng bộ môn). Hôm nay cả hai đều bấm Duyệt bổ trợ, Duyệt giáo trình tuần, Duyệt báo cáo tuần của Toán được. KHTN thì một người giữ cả hai.
(a) Mỗi môn ghi rõ **một** người là trưởng bộ môn chịu trách nhiệm duyệt (trễ hạn thì người đó nhận đề xuất gậy); quản lý môn vẫn bấm được nhưng chỉ khi làm thay. (b) Giữ như hiện nay — ai trong hai người bấm cũng được, không phân biệt.
Đang chạy: (b). **Đề xuất: (a)** — Toán: chị Trang; cần Thùy xác nhận.

**6. Ô chưa có trưởng khối thì việc của ô đó về ai?**
Ví dụ: Văn 8 đang có 1 lớp, chưa có trưởng khối, môn Văn cũng chưa có trưởng bộ môn. Chốt 29/10: "việc rơi lên Trang". Chốt 03/11: "trưởng bộ môn báo cáo thay".
(a) Về **trưởng bộ môn** của môn đó; môn chưa có trưởng bộ môn thì về chị Trang. (b) Luôn về chị Trang.
Đang chạy: báo cáo tuần theo (a); giáo trình tuần thì ô trống không ai bị nhắc. **Đề xuất: (a)**, áp cho mọi việc (bổ trợ, công, gậy, giáo trình tuần, báo cáo tuần).

**7. KPI của trưởng khối đếm theo cái gì, và bao giờ đặt ngưỡng?**
Ví dụ: Toán đầu tuần 09/11 có 263 em yếu, đầu tuần 16/11 còn 256 — giảm 7 em. Chốt 29/10: KPI = "số **dạng** yếu ở mức chấp nhận được", chạy thử 4–6 tuần rồi mới đặt số. Chốt 17/11: em yếu = có ít nhất một **nhóm** yếu.
(a) KPI chính = **số em yếu (theo nhóm)** + số nhóm yếu, luôn đi kèm "hết yếu có bằng chứng" và "độ phủ đo"; chỉ hiển thị tới hết tháng 12, đầu tháng 1 đặt ngưỡng bằng "thường đạt 8 tuần". (b) Giữ đếm theo dạng. (c) Đặt ngưỡng ngay bây giờ (Thùy cho số).
Đang chạy: hiện cả dạng lẫn nhóm, không ngưỡng; mới có 2 tuần số. **Đề xuất: (a).** Kèm một ý cần Thùy nói: vượt ngưỡng thì hệ quả là gì (gậy, hay chỉ để chị Trang làm việc với trưởng khối)?

**8. Báo cáo học kì gửi phụ huynh: ai được bấm "Công bố"?**
Ví dụ: kì "Nửa kì 1" có 362 báo cáo, 325 đã công bố. Hôm nay **bất kỳ nhân sự nào** (kể cả TA) cũng bấm Công bố / Mở lại được; trưởng khối chưa có bước nào.
(a) Giáo viên của lớp nhập → **trưởng khối soát và công bố** khối mình → quản trị bật app phụ huynh cho cả kì. (b) Giáo viên tự công bố lớp mình dạy, quản trị soát rồi bật app (như Thùy tả 07/11), chỉ chặn người không dạy lớp đó. (c) Giữ như hiện nay.
**Đề xuất: (b)** — đúng quy trình 07/11, thêm rào "đúng lớp mình"; trưởng khối xem được tiến độ khối.

**9. Trưởng khối có ô hỏi trợ lý (gõ câu hỏi, máy trả lời bằng số của khối) không?**
Ngày 29/10 có hai dòng trái nhau: "Hỏi đáp AI cho trưởng khối — không cần" và "mở cho trưởng khối, trả lời trong phạm vi khối". Ví dụ câu hỏi: "Lớp 8A1 tuần này bao nhiêu em chưa nộp BTVN?".
(a) Không mở — trưởng khối đã có báo cáo lọc sẵn và phiên Claude. (b) Mở.
Đang chạy: chỉ 3 người ban lãnh đạo hỏi được (30 ngày qua: 7 câu của 1 người); trưởng bộ môn có ô "Hỏi vận hành TA". **Đề xuất: (a).**

**10. Một khối có được mở nhiều phiên Claude cùng sửa bản đồ một lúc không?**
Ví dụ: Toán 9 đang có 3 phiên mở cùng lúc. Chốt 01/11: "mỗi bản đồ chỉ một phiên sửa tại một thời điểm, không có lệnh xoá". Ngày 05/11 Thùy bảo "sao cứ chặn này chặn kia" ⇒ đã gỡ cả hai chốt (trưởng khối đủ quyền, kể cả xoá; Claude phải hỏi trước khi xoá).
(a) Giữ tự do như 05/11, thêm một dòng **cảnh báo** "khối này đang có phiên khác mở" (không chặn). (b) Quay lại một phiên một khối.
Đang chạy: tự do, không cảnh báo. **Đề xuất: (a).** Nếu Thùy gật, sửa hai dòng trong `CLAUDE.md` còn ghi "mỗi bản đồ một phiên sửa · không lệnh xoá".

### 11.2 Lệch kỹ thuật (không cần Thùy quyết — CTO làm khi có lệnh)

1. **Còn mã nhân sự viết cứng** trong `_troly_bc_gia_dinh()` (hai mã) — trái luật "không gõ cứng người"; chuyển sang đọc theo ghế như phần xếp hạng đã làm 29/10.
2. **`nhan_su_team` và `team` cho mọi nhân sự GHI thẳng** (policy mở cho cả thêm / sửa / xoá). `fn_mon_cua_toi` cho "mọi môn" khi có nhãn team Vận hành / Media / Marketing ⇒ một người tự thêm nhãn team là có phạm vi mọi môn. Đợt khoá 14/11 mới khoá 5 bảng lõi, sót hai bảng này.
3. **`troly_hoi_dap` · `troly_ra_soat` · `troly_nhan_dinh` · `bao_cao_ph_ky`: mọi nhân sự ghi thẳng** — trong khi đọc báo cáo trợ lý chỉ mở cho 3 người.
4. **Phạm vi "trưởng khối chỉ quyết gậy khối mình" còn kiểm ở màn**, DB chỉ kiểm "là người quản gậy" (đã ghi ở `spec-luong-gay.md` §9.0b).
5. **Duyệt báo sai chưa theo khối ở DB:** việc đang giao cho TA lớp (`fn_bao_sai_cho_duyet_cua_toi` lọc theo lớp mình là TA); xử lý báo "đề sai" chỉ cần quyền sửa bản đồ, không xét ô.
6. **Phó khối lọt vào quyền đề xuất bổ trợ** vì cổng dùng `_trong_pham_vi` (gồm Phó) thay cho `_truong_khoi_tro_len` — sửa theo câu 3.
7. **Chưa build (luật 17/11 đã có):** hạn 48 giờ duyệt công + khay Trang + gậy trễ · thiếu công 24 giờ ("không có công") · hạn quyết gậy 7 ngày + tự bỏ qua sau 30 ngày + gậy theo tháng của việc trễ + ân xá phần trước 01/11 · thứ tự chốt tháng ngày 1–3 / 4 / 5 (chặn chốt lương khi gậy chưa chốt) · báo động theo tuần ở màn bổ trợ trưởng khối.
8. **Chưa build (đích cũ):** hàng việc "Hôm nay" trong phòng · loại phiên `bao_sai`, `giai_bai` · đo tỉ lệ lọt của câu máy tự gán theo khối (vượt ngưỡng thì tắt tự gán) · Claude ghi luật khối ra file · nút "Dừng" lượt đang chạy · kiểm phiên bản khi người và Claude cùng sửa **cấu trúc** · bộ báo cáo Vận hành.
9. **Nguồn ghi tên bảng không có trong DB:** `chat_luong_tuan_hs` (spec 29/10) — thực tế là `dang_yeu_dau_tuan`; `spec-van-hanh-tuan.md` §1, §6 còn trỏ tên cũ và còn dòng "T2 — Trang Chốt tuần".
10. **`hau_kiem`:** loại `viec_van_hanh` và `ca_nhe` có hàng nhưng 0 lượt xem; chưa có loại cho công TA, báo sai (đi theo câu 2).
11. **`fn_phong_truong_khoi`** không còn màn nào gọi; `fn_botro_chot_tuan` + `bo_tro_chot_tuan*` + `_qlcl_dong_bang_tuan` là đường chốt tay cũ (đi theo câu 1) — gỡ theo Luật xoá, chờ gật.
12. **Cây cấp dưới còn tính ở client** (`getMyScope` trong `src/lib/nhansu.ts`, đi trong một team) — sơ đồ tổ chức và giao task còn dùng; phạm vi khối đã ở DB.
13. `gay_de_xuat.nguon` chỉ có `vanhanh · giaoviec` ⇒ đề xuất trễ báo cáo tuần / giáo trình tuần đang mượn `vanhanh`.
14. `SPEC-troly-nhansu.md` §4 ghi "tầng DB không lọc giữa các nhân sự, phải chặn ở code dựng context" — nay đã có cổng `_troly_gac` + hàm lọc theo ô; câu cũ hết đúng, bỏ khi gộp.
15. Báo cáo Sư phạm lọc theo ô: phần "cảnh báo bất thường chung" chưa lọc được theo khối nên không hiện cho trưởng khối.

### 11.3 Tôi đang hiểu thế này — không hỏi, sai thì Thùy sửa

1. **Báo động theo tuần** đặt ở hai chỗ: cột 🚨 "tuần này" trên Dashboard học tập (nơi trưởng khối bấm Bổ trợ) và ghi chú "có báo động tuần này" trên dòng ở Danh sách bổ trợ (để trưởng bộ môn thấy khi duyệt). 🚨 30 ngày bỏ.
2. **"Ngày 1–3 đầu tháng quyết gậy"** là hạn chót dọn của tháng trước; hạn 7 ngày mỗi đề xuất vẫn chạy song song trong tháng.
3. Duyệt công của **chính trưởng khối** lên trưởng bộ môn; của trưởng bộ môn lên người giữ quyền duyệt công toàn hệ.
4. Trưởng khối **không** xếp lịch ca khối (Lộc), **không** chốt gậy tháng, **không** chốt lương.
5. Chốt 29/10 "Bổ trợ Nhẹ L1.1 — trưởng khối tự tạo, Trang hậu kiểm, tối đa 2 ca / em / tuần" đã được thay bằng "L1 sau giờ" của 11–17/11 (`spec-bo-tro.md` §7.2); spec này không giữ luật Nhẹ cũ.
6. `SPEC-troly-nhansu.md` §0–§5 (trục "mảng phụ trách", ai chấm test đầu vào) là lịch sử 08/2026; phần còn sống chỉ là §2 luật đo, §3 luật nói, §6, §7 — đã lấy vào §7.

## 12. Đã làm khi Thùy chốt (17/11)

- `spec-truong-khoi.md` · `spec-phong-truong-khoi.md` · `SPEC-troly-nhansu.md` → `_luu-tru/`. `spec-bao-cao-ky.md` giữ ở gốc tới khi #13 viết xong.
- CLAUDE.md §7 (gộp 3 mục thành 1, bỏ luật phiên cũ "một phiên sửa · không lệnh xoá") · `SPEC-INDEX.md` dòng #6 · `scripts/phien/README.md` · các chỗ trỏ ở `spec-van-hanh-tuan.md`, `spec-luong-gay.md`.
- **Còn nợ:** hệ quả khi vượt ngưỡng KPI (câu 7) · **hai lỗ quyền §11.2** (nhãn team tự sửa được · báo cáo phụ huynh ai cũng công bố được) · mọi việc code / DB ở §11.0 + §11.2 chờ lệnh.
