# TRƯỞNG KHỐI & TEAM QUẢN LÝ CHẤT LƯỢNG — spec

> **Đọc file này TRƯỚC khi sửa phân quyền (ghế, phạm vi, ai duyệt gì) hoặc trợ lý/dashboard của Trưởng khối và Trang.**
> Thùy chốt định hướng 29/10/2026 (Sparring với Claude). Con số KPI **CHƯA chốt** — chạy thử rồi mới chốt.
> Code/DB là chân lý runtime; file này là bản đồ đích + lộ trình. Bản paste-ready cho Notion = cả file này.

---

## 0. Thùy đã chốt gì (29/10)

| # | Chốt |
|---|---|
| 1 | Có **Team Quản lý chất lượng (QLCL)** = **Thùy + Trang + 6 trưởng khối** (Dương · Ngân · Hà Giang · Cường · Hải · Đạt). |
| 2 | **Khối là đơn vị thấp nhất.** Một trưởng khối quản **toàn bộ HS của khối** đó, cả **chất lượng** lẫn **vận hành**. Không chia HS xuống dưới khối. |
| 3 | **Phạm vi có tính môn** (§1.6). Làm **Toán trước**; cái gì Toán có thì Anh và KHTN sau này cũng có y hệt (symmetry test). |
| 4 | **Trưởng khối = phiên bản thu nhỏ của Trang**: làm đúng những việc Trang đang làm, chỉ khác phạm vi là khối của mình. |
| 5 | **Hai tầng.** Trưởng khối làm và quyết; **Trang duyệt lại**. Giai đoạn đầu coi như **hậu kiểm**. Về sau trưởng khối tự quyết nhiều hơn. |
| 6 | **Trang đánh gậy trưởng khối.** |
| 7 | **Trang vẫn bấm Chốt tuần như bình thường**, không tự chụp. Lúc chốt thì **đóng băng hết số đầu tuần** để so sánh. |
| 8 | **Phó khối giữ nguyên** (vận hành: chấm MT, bot tag). Spec này chỉ làm rõ vai trò trưởng khối. |
| 9 | **Lộc vẫn xếp lịch bổ trợ như cũ**, không đổi gì. |
| 10 | **KPI** của nhân sự QLCL = **số dạng yếu ở mức chấp nhận được**. Chưa chốt số: làm, đo vài tuần rồi mới chốt. |
| 11 | **Phân quyền đang rối**, phải gộp lại cho dễ quản lý. |
| 12 | **Trưởng khối do người PHÂN CÔNG trên màn, không mặc định** (không seed trong migration, không suy từ tên ghế). |
| 13 | **8T do Thùy quản.** |

---

## 1. Hiện trạng: rối ở đâu (đo DB thật 29/10)

1. **Chữ "Trưởng khối" xuất hiện ở 3 team**, nghĩa khác nhau:
   - team `ta`: 6 ghế *Trưởng khối 3 4 5 / 4T 5T / 6 7 / 8 / 9 / 10 11 12* (đây mới là vai trong spec này).
   - team `gv`: *Trưởng khối THCS / THPT* (Trang ngồi) và *Trưởng khối tiểu học* (Thùy ngồi). Đây là cây chuyên môn GV.
   - team `hoc_thuat`: *Trưởng khối KHTN* (Anh Ngọc).
2. **Hai nguồn "ai quản khối nào" song song, và đã lệch nhau:**

   | Người | Ghế (`vi_tri.khoi_quan_ly`) | Quyền gậy (`gay_quyen_khoi`) |
   |---|---|---|
   | Dương | 3 · 4 · 5 | **không có** |
   | Ngân | 4T · 5T (trưởng) + 3 · 4 · 5 (phó) | **không có** |
   | Hà Giang | 6 · 7 | 6 · 7 |
   | Cường | 8 | 8 · **8T** |
   | Hải | 9 | 9 |
   | Đạt | 10 · 11 · 12 | 10 · 11 · 12 |
   | Trang | (ghế *Quản lý trợ giảng*, không ghi khối) | `toan_quyen` |

   Trợ lý cá nhân và chấm MT đọc nguồn ghế; gậy đọc nguồn `gay_quyen_khoi` (seed tay). Hệ quả: Dương và Ngân hiện **không duyệt được gậy** khối mình.
3. **Trang bị gõ cứng uuid** ở khoảng 6 chỗ (gậy, trợ lý, xếp hạng tổng kết tuần, skin…). Tab Trợ lý mở bằng danh sách cứng 3 tài khoản (`hoi_dap_ds_tai_khoan`). Đổi người là phải sửa code.
4. **Cây cấp dưới tính ở client, và chỉ trong một team** (`getMyScope` trong `src/lib/nhansu.ts`, `listViTri(team_id)`). Ghế ở team A không thể có cấp dưới ở team B. Đây là chặn cứng nếu tách team QLCL khỏi team TA.
5. **Chốt tuần nhận danh sách ứng viên tính sẵn ở client** (`fn_botro_chot_tuan(p_mon, p_ung_vien, …)`, logic 4 kênh nằm ở `src/lib/danhgia.ts`). Vi phạm §2.0. Con số dùng để đánh giá người thì không được tính ở client.
6. **Chưa có con số tuần** "bao nhiêu HS có dạng yếu / bao nhiêu dạng yếu" theo (môn × khối). Ảnh chụp tuần hiện chỉ lưu HS điểm thấp.

---

## 2. Mô hình phân quyền mới — "Phân công (môn × khối) là nguồn duy nhất"

Hai nguyên tắc:
- **Không uuid, không mặc định.** Ai quản ô nào là **dữ liệu do người phân công** trên màn. Đổi người = sửa một ô, không sửa code, không migration.
- **Một ô (môn × khối) có đúng một trưởng khối.** Khối là đơn vị thấp nhất (chốt #2), nên ràng buộc ở DB: khoá `(mon, khoi, vai)` duy nhất ⇒ không thể hai người cùng quản một khối, cũng không thể lệch giữa hai bảng.

### 2.1 Bảng phân công

`phan_cong_quan_ly_khoi (mon, khoi, vai, nhan_su_id, phan_cong_boi, phan_cong_at)`
- `vai` ∈ `truong` · `pho`. Khoá chính `(mon, khoi, vai)`.
- **Danh sách ô = suy từ lớp đang mở** (`lop.mon × lop.khoi`), không gõ tay. Hiện có 20 ô: Toán 13 khối (3 · 4 · 4T · 5 · 5T · 6 · 7 · 8 · 8T · 9 · 10 · 11 · 12) · Anh 3 (5T · 8 · 9) · KHTN 3 (7 · 8 · 9) · Văn 1 (8). Mở lớp khối mới ⇒ ô mới tự hiện.
- **Ô chưa phân công:** hiện đỏ *"chưa có trưởng khối"*. Việc của ô đó rơi lên Trưởng QLCL (Trang). Không ô nào bị "mồ côi" im lặng.
- **Đổi người có vết:** trigger ghi lịch sử (ai, lúc nào, người cũ → người mới), theo §4 CLAUDE.md.
- Không dùng lại bảng legacy `phan_cong_khoi` (12 dòng cũ, không khoá, không có vai): dữ liệu cũ không đáng tin, dùng lại là tự rước lệch.

### 2.2 Màn Phân công trưởng khối

Lưới **môn (hàng) × khối (cột)**. Mỗi ô có 2 chỗ chọn: *Trưởng* (người trong team QLCL) và *Phó* (tuỳ chọn). Ai được sửa: Thùy và Trang. Đặt trong cây Admin cạnh màn Phân quyền.

Phân công ban đầu Thùy tự điền trên màn (không seed). Theo hiện trạng sẽ là: Toán 3·4·5 Dương · 4T·5T Ngân · 6·7 Hà Giang · 8 Cường · **8T Thùy** · 9 Hải · 10·11·12 Đạt; Phó: 3·4·5 Ngân · 7 Quỳnh Trang · 8 Thảo Nguyên.

### 2.3 Ba trục, mỗi trục MỘT nguồn

| Trục | Câu hỏi | Nguồn duy nhất | Ghi chú |
|---|---|---|---|
| ① **Màn** | Mở được màn nào? | `vai_tro` trên ghế (giữ như cũ) | Thêm vai trò **"Quản lý chất lượng"** cho ghế team QLCL. |
| ② **Phạm vi** | Dữ liệu (môn, khối) nào? | `phan_cong_quan_ly_khoi` | **Một hàm** `fn_pham_vi_cua_toi()` → `(mon, khoi, vai)`. Mọi module (gậy · trợ lý · duyệt bổ trợ · duyệt việc VH · chấm MT · bot tag) chỉ hỏi hàm này hoặc `_trong_pham_vi(mon, khoi)`. |
| ③ **Cấp dưới** | Quản ai? | **Suy**, không dựng cây tay | TA thuộc khối nào = lớp TA được phân công (`phan_cong_lop`) ⇒ trưởng khối của ô đó. TA dạy nhiều khối có nhiều trưởng khối, mỗi việc thuộc khối của **buổi** (như `fn_gay_de_xuat_lop` đã làm). Trưởng khối là cấp dưới của Trang. |

- **Ba thứ tách bạch, đừng gộp:** **team** = em thuộc tổ nào (sơ đồ: thêm team `qlcl` ngang `ta` · `ops` · `hoc_thuat`) · **vai trò** = mở được màn nào (2 vai mới: *Quản lý chất lượng* cho ghế trưởng khối; *Trưởng QLCL* = như trên + màn Phân công + Hậu kiểm, cho ghế của Trang) · **phân công** = quản ô (môn × khối) nào. Một người ngồi nhiều ghế ở nhiều team thì quyền = hợp các ghế (như hiện nay).
- **Toàn hệ:** ghế *Trưởng QLCL* (Trang) và admin (Thùy) thấy mọi ô. Luật nằm trong hàm, đọc theo ghế, không theo uuid.
- **Đối xứng môn:** Anh/KHTN/Văn chỉ cần điền ô, mọi thứ chạy y như Toán.
- **Cây ghế team TA bớt việc:** không còn phải giữ đúng `cha_id` từng TA → trưởng khối bằng tay (nguồn lệch thứ ba). Cây ghế chỉ còn để vẽ sơ đồ tổ chức.

### 2.4 Bỏ đi (sau khi mọi chỗ đọc đã chuyển sang `fn_pham_vi_cua_toi`)

Mỗi mục xoá đều hỏi Thùy riêng lúc đó theo **Luật xoá**:
- `gay_quyen_khoi`: thay bằng bảng phân công.
- `vi_tri.khoi_quan_ly`: thay bằng bảng phân công.
- `phan_cong_khoi`: legacy.
- `hoi_dap_ds_tai_khoan()`: 3 uuid, thay bằng luật theo ghế.
- Mọi chỗ gõ cứng uuid của Trang.

---

## 3. Ai làm, ai duyệt — ma trận hai tầng

Mô hình giai đoạn đầu: **hậu kiểm** (post-audit). Quyết định của trưởng khối **có hiệu lực ngay**; Trang có hàng **Hậu kiểm** để *Đồng ý* hoặc *Sửa* (đảo quyết định). Không có gì phải chờ Trang mới chạy được ⇒ không cổ chai. Giai đoạn sau Trang chỉ hậu kiểm **mẫu** (lấy ngẫu nhiên một phần, lý thuyết *acceptance sampling*), rồi trưởng khối tự duyệt hẳn từng loại việc.

| Việc | Trưởng khối (khối mình) | Trang | Ghi chú |
|---|---|---|---|
| Đánh / bỏ qua **gậy TA** | Quyết | Hậu kiểm | Đề xuất gậy → khối qua `fn_gay_de_xuat_lop` (đã có). |
| **Gậy của trưởng khối** | — | Quyết | Trưởng khối là cấp dưới của Trang (trục ③). |
| Duyệt chất lượng **việc vận hành** TA (`viec_van_hanh_duyet`) | Quyết | Hậu kiểm | |
| **Duyệt case bổ trợ yếu** (theo dõi → chính thức) | Quyết | Hậu kiểm | |
| **Chốt tuần** (đóng băng số) | Xem | **Bấm** | Như cũ, theo môn. |
| **Xếp lịch bổ trợ** | — | — | **Lộc**, không đổi. |
| Tổng kết bot Telegram 24:00 | Duyệt phần khối mình | Hậu kiểm | Thay "Trang duyệt" ở `spec-bot-telegram-ta.md`. |
| KPI dạng yếu khối | Chịu trách nhiệm | Theo dõi mọi khối | §4. |

**Cơ chế hậu kiểm (dùng chung, không viết riêng cho từng việc):** mỗi bảng quyết định thêm `hau_kiem_boi · hau_kiem_at · hau_kiem` (`dong_y` / `da_sua`). Trigger ghi lịch sử (§4 CLAUDE.md). Một hàm `fn_hau_kiem_hang_doi()` gom mọi loại việc chưa hậu kiểm vào một hàng đợi duy nhất cho Trang.

**Phó khối:** không duyệt gậy, không duyệt case. Giữ vai vận hành (nhận chấm MT, bot tag) và chỉ xem như hiện tại.

---

## 4. KPI dạng yếu — đo trước, chốt số sau

### 4.1 Đóng băng lúc Trang bấm Chốt tuần

`fn_botro_chot_tuan` (bản mới) trong **cùng transaction** chụp thêm cho **mọi HS đang học** môn đó:

`chat_luong_tuan_hs (tuan, mon, khoi, hoc_sinh_id, so_dang_yeu, so_dang_do, ds_dang_yeu)`

- Chỉ có dòng cho HS **có dữ liệu đo** (§1.5). HS chưa đo = không có dòng, không phải dòng 0.
- `so_dang_do` = số dạng đủ điều kiện đo. Đây là đối trọng của KPI.
- Định nghĩa "dạng yếu" dùng đúng hàm đang chạy (`fn_btyeu_dang_yeu_2_cua_so`), không viết công thức thứ hai.
- Danh sách ứng viên 4 kênh chuyển xuống DB luôn (hết vi phạm §2.0).

### 4.2 Con số hiển thị (mỗi môn × khối × tuần)

| Chỉ số | Ý nghĩa |
|---|---|
| **HS có dạng yếu** | số HS có `so_dang_yeu > 0` |
| **Tổng dạng yếu** | Σ `so_dang_yeu` |
| **Vào** | dạng tuần này yếu mà tuần trước không yếu |
| **Ra — có bằng chứng** | dạng tuần trước yếu, tuần này hết yếu **nhờ lần đo mới** |
| **Ra — rớt cửa sổ** | dạng hết yếu chỉ vì không còn đo trong cửa sổ, **không tính là thành tích** |
| **Độ phủ đo** | tỉ lệ ô (HS × dạng đã dạy) có đo trong tuần |

**Vì sao phải có Vào / Ra / Độ phủ** (Thùy mô tả đúng mô hình *dòng chảy – tồn kho*: học mới sinh yếu, quên sinh yếu, bổ trợ làm hết yếu):
- Tồn phụ thuộc chương đang học khó hay dễ, không chỉ phụ thuộc người quản.
- Cách rẻ nhất để tồn giảm là **đo ít đi** (định luật Goodhart). Độ phủ đo và cột "rớt cửa sổ" chặn đường đó.

### 4.3 "Mức chấp nhận được" — chưa có số

- Mấy tuần đầu chỉ đo và hiển thị.
- Khi chốt, dùng lại cơ chế **"thường đạt"** của Tổng kết tuần (trung bình 8 tuần đã lọc nhiễu): mỗi chỉ số là **một dòng** trong `_troly_tuan_danh_muc()`, có phạm vi khối, không viết bảng điều khiển riêng.

---

## 5. Dashboard (tab 🤖 Trợ lý)

Một màn, dữ liệu lọc theo `fn_pham_vi_cua_toi()`. Trưởng khối và Trang thấy **cùng bố cục**, khác phạm vi (đúng chốt #4).

| Khối màn | Trưởng khối | Trang / Thùy |
|---|---|---|
| **Báo cáo Sư phạm** (BTVN · ET · đánh giá · bù · yếu) | khối mình (`BaoCaoCaNhan` đã có, nâng lên) | toàn hệ |
| **KPI dạng yếu** §4.2 + danh sách HS yếu bấm vào được | khối mình, tuần này so tuần trước | bảng so sánh các khối cạnh nhau |
| **Tổng kết tuần** | các chỉ số có phạm vi khối | toàn hệ + theo khối |
| **Hàng việc** | đề xuất gậy · case bổ trợ chờ duyệt · việc tồn TA của khối | **Hậu kiểm** (mọi quyết định của trưởng khối) + gậy trưởng khối |

Mọi con số tính ở `fn_troly_*` / `_troly_*` (spec `SPEC-troly-nhansu.md` §6–§7). Client chỉ hiển thị.

---

## 6. Lộ trình

| Pha | Việc | Đổi hành vi? |
|---|---|---|
| **P1 — Gộp phân quyền** | bảng `phan_cong_quan_ly_khoi` + lịch sử · màn Phân công trưởng khối · team `qlcl` · `fn_pham_vi_cua_toi` · gậy/trợ lý/chấm MT/bot đọc nguồn mới · gỡ uuid Trang | Có, nhỏ: Dương, Ngân **có quyền gậy** khối mình; 8T về Thùy. Chỉ bật sau khi Thùy điền xong lưới. |
| ↳ *chuyển ghế (P1)* | Chỉ ghế **"Trưởng khối X" trong team `ta`** chuyển sang team `qlcl`. Ghế GV, ghế Học thuật (kể cả các ghế tên "Trưởng khối …" bên Học thuật), Phó khối **giữ nguyên**. Ai còn lớp trợ giảng (`phan_cong_lop.vai_tro='tg'`) mà ghế TA duy nhất là ghế trưởng khối thì **được thêm 1 ghế Trợ giảng thường** để không mất màn TA. Đo 29/10: Dương (5 lớp TG) và Đạt (1 lớp TG). Cường 0 lớp TG; Hà Giang, Hải, Ngân đã có ghế TA khác. | Không |
| **P2 — Hai tầng** | cột + trigger hậu kiểm · `fn_hau_kiem_hang_doi` · màn Hậu kiểm cho Trang. Làm gậy trước, rồi việc vận hành, rồi case bổ trợ | Có |
| **P3 — Đóng băng KPI** | `chat_luong_tuan_hs` + chốt tuần mới · ứng viên 4 kênh xuống DB | Có (số mới) |
| **P4 — Dashboard** | §5 | Có |
| **P5 — Chạy thử** | 4–6 tuần đo → Thùy chốt "mức chấp nhận được" | — |

Anh/KHTN: không cần pha riêng. Thêm ghế trưởng khối môn đó là mọi thứ ở trên chạy y hệt (symmetry test).

---

## 7. Còn treo

Đã giải (29/10):
- *Hỏi đáp AI trong tab Trợ lý*: **mở cho trưởng khối** (thay danh sách 3 uuid bằng luật theo ghế; câu trả lời chỉ trong phạm vi khối của người hỏi).
- *Ghế trùng tên "Trưởng khối" ở team GV / Học thuật*: không cần đụng. Quyền không còn đọc từ tên hay cây ghế.
- *8T*: Thùy quản. Cơ chế = màn phân công (chốt #12).
- *Anh/KHTN chưa có trưởng khối*: ô chưa phân công ⇒ hiện đỏ, việc rơi lên Trang (§2.1).
