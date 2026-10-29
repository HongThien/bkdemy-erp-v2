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

## 2. Mô hình phân quyền mới — "Ghế quyết định tất cả"

Một nguyên tắc: **quyền đi theo GHẾ, không theo người, không theo uuid.** Đổi người = đổi người ngồi ghế, không sửa code.

### 2.1 Ba trục, mỗi trục MỘT nguồn

| Trục | Câu hỏi | Nguồn duy nhất | Ghi chú |
|---|---|---|---|
| ① **Màn** | Mở được màn nào? | `vai_tro` trên ghế (giữ như cũ) | Thêm vai trò **"Quản lý chất lượng"**. |
| ② **Phạm vi** | Dữ liệu (môn, khối) nào? | `vi_tri.mon` + `vi_tri.khoi_quan_ly` | **Một hàm** `fn_pham_vi_cua_toi()` → `(mon, khoi, cap, vi_tri_id)`. Mọi module (gậy · trợ lý · duyệt bổ trợ · duyệt việc VH · chấm MT · bot) chỉ hỏi hàm này hoặc `_trong_pham_vi(mon, khoi)`. |
| ③ **Cấp dưới** | Quản ai? | cây `vi_tri.cha_id`, **đi xuyên team** | Chuyển xuống DB: `fn_cap_duoi_cua_toi()` (thay phần client của `getMyScope` và `fn_task_cap_duoi`). |

- **Toàn hệ** không cần cột mới: ghế `cap='truong'` của team `qlcl` (Trang) có phạm vi = mọi (môn, khối). Admin hệ thống (Thùy) bypass như cũ. Luật này nằm trong hàm, theo vị trí ghế, không theo uuid.
- **Một ghế = một môn.** Sau này trưởng khối 8 kiêm cả Anh 8 thì thêm ghế *Trưởng khối 8 · Anh* (có thể cùng người). Phạm vi = hợp các ghế. Đây là cách đối xứng môn mà không phải đổi schema.

### 2.2 Cây ghế đích

```
team qlcl (Quản lý chất lượng)
  Lead QLCL ................ Thùy        (admin)
  └ Trưởng QLCL ........... Trang       [Toán · toàn hệ]
     ├ Trưởng khối 3 4 5 ·Toán ....... Dương
     ├ Trưởng khối 4T 5T ·Toán ....... Ngân
     ├ Trưởng khối 6 7 ·Toán ......... Hà Giang
     ├ Trưởng khối 8 ·Toán ........... Cường
     ├ Trưởng khối 9 ·Toán ........... Hải
     └ Trưởng khối 10 11 12 ·Toán .... Đạt

team ta (Trợ giảng)  — cha của từng ghế trỏ SANG ghế trưởng khối bên qlcl
  Phó khối 3 4 5 (Ngân) · Phó khối 7 (Quỳnh Trang) · Phó khối 8 (Thảo Nguyên)   — giữ nguyên
  các ghế TA                                                                    — cha = trưởng khối khối mình
```

### 2.3 Bỏ đi (sau khi mọi chỗ đọc đã chuyển sang `fn_pham_vi_cua_toi`)

- `gay_quyen_khoi`: bảng, sau này xoá theo **Luật xoá** (hỏi Thùy riêng lúc đó).
- `hoi_dap_ds_tai_khoan()`: danh sách 3 uuid, thay bằng luật theo ghế.
- `phan_cong_khoi`: legacy, không hàm nào đọc.
- Mọi chỗ gõ cứng uuid của Trang.

---

## 3. Ai làm, ai duyệt — ma trận hai tầng

Mô hình giai đoạn đầu: **hậu kiểm** (post-audit). Quyết định của trưởng khối **có hiệu lực ngay**; Trang có hàng **Hậu kiểm** để *Đồng ý* hoặc *Sửa* (đảo quyết định). Không có gì phải chờ Trang mới chạy được ⇒ không cổ chai. Giai đoạn sau Trang chỉ hậu kiểm **mẫu** (lấy ngẫu nhiên một phần, lý thuyết *acceptance sampling*), rồi trưởng khối tự duyệt hẳn từng loại việc.

| Việc | Trưởng khối (khối mình) | Trang | Ghi chú |
|---|---|---|---|
| Đánh / bỏ qua **gậy TA** | Quyết | Hậu kiểm | Đề xuất gậy → khối qua `fn_gay_de_xuat_lop` (đã có). |
| **Gậy của trưởng khối** | — | Quyết | Ghế cha của trưởng khối = Trang (trục ③). |
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
| **P1 — Gộp phân quyền** | team `qlcl` + chuyển 7 ghế · `fn_pham_vi_cua_toi` · `fn_cap_duoi_cua_toi` xuyên team · gậy/trợ lý/chấm MT/bot đọc nguồn mới · gỡ uuid Trang | Có, nhỏ: Dương, Ngân **có quyền gậy** khối mình; chỗ lệch 8T theo quyết định của Thùy (§7). |
| **P2 — Hai tầng** | cột + trigger hậu kiểm · `fn_hau_kiem_hang_doi` · màn Hậu kiểm cho Trang. Làm gậy trước, rồi việc vận hành, rồi case bổ trợ | Có |
| **P3 — Đóng băng KPI** | `chat_luong_tuan_hs` + chốt tuần mới · ứng viên 4 kênh xuống DB | Có (số mới) |
| **P4 — Dashboard** | §5 | Có |
| **P5 — Chạy thử** | 4–6 tuần đo → Thùy chốt "mức chấp nhận được" | — |

Anh/KHTN: không cần pha riêng. Thêm ghế trưởng khối môn đó là mọi thứ ở trên chạy y hệt (symmetry test).

---

## 7. Còn treo — cần Thùy trả lời trước P1

1. **Ghế trùng tên ở team GV / Học thuật** (*Trưởng khối THCS/THPT/tiểu học*, *Trưởng khối KHTN*): đổi tên (vd *Trưởng chuyên môn THCS*) để khỏi lẫn, hay bỏ?
2. **Khối 8T** của ai? Bảng gậy ghi Cường có 8T, nhưng ghế của Cường chỉ ghi 8.
3. **Trang ngoài Toán**: hiện chưa có trưởng khối Anh/KHTN. Phạm vi Anh/KHTN tạm thuộc Trang, hay giữ ở Hoà / Anh Ngọc như cây hiện tại?
4. **Hỏi đáp AI** trong tab Trợ lý (đang chỉ 3 tài khoản): mở cho trưởng khối, hay trưởng khối chỉ xem báo cáo?
