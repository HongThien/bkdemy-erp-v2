# BÁO CÁO TUẦN — Trưởng khối → Trưởng bộ môn → CEO — spec

> **Đọc file này TRƯỚC khi build/sửa Báo cáo tuần trưởng khối, Báo cáo Chuyên môn tuần, hoặc phần chiếu TV của nó.**
> Thùy chốt qua Sparring 03/11/2026. Bản paste-ready cho Notion = cả file này.
> Liên quan: `spec-truong-khoi.md` (phạm vi · hai tầng · KPI dạng yếu §4) · `spec-phong-truong-khoi.md` §4 (phòng làm việc) ·
> `SPEC-troly-nhansu.md` (Tổng kết tuần, trình chiếu) · `spec-hieu-suat-ta.md` (luật "đúng hạn" theo lần đóng đầu).

---

## 0. Đích

**Báo cáo tuần trực tiếp cho CEO để nắm tình hình học tập đang diễn ra tại BK.**
Mỗi chiều thứ 2, mỗi trưởng khối nộp báo cáo tuần trước (cá nhân + khối mình quản) → trưởng bộ môn đọc, duyệt / trả lại →
ghép thành **Báo cáo Chuyên môn tuần** của môn → **chiếu TV** báo cáo CEO.

## 1. Đã chốt (Thùy 03/11)

| # | Chốt |
|---|---|
| 1 | Kỳ báo cáo = **thứ 2 → hết Chủ nhật tuần trước** (giờ VN). Nộp **chiều thứ 2**. |
| 2 | **Báo cáo cứng**: bấm Nộp là **snap** toàn bộ phần số, **không bao giờ tính lại**. |
| 3 | Phần **cá nhân** = task phát triển của trưởng khối. Task **đã được người giao duyệt** ⇒ tự điền, không phải điền. Nhân sự chủ yếu điền task chưa xong. |
| 4 | Phần **quản lý** = hệ thống tự tổng hợp: ET · BTVN · dạng yếu · HS yếu · bổ trợ · trend 4 tuần — **toàn khối và từng lớp**. |
| 5 | **HS yếu = có ≥ 1 dạng yếu.** Số này khó giảm vì chưa bổ trợ đủ — "khó giảm cũng phải giảm", giữ định nghĩa. |
| 6 | **Dữ liệu có thời gian ⇒ suy ngược được mọi khung thời gian** (dạng yếu tại mốc bất kỳ = chỉ dùng các lần đo trước mốc). Trend 4 tuần tính ngược, không chờ tích luỹ. |
| 7 | Ảnh dạng yếu **đầu tuần chụp tự động** (không chờ ai bấm). |
| 8 | Bổ trợ tính **Bổ trợ Yếu + Bổ trợ Nhẹ (sau giờ)**. Bù · đuổi · ôn thi là việc khác, **chưa đưa vào**. |
| 9 | **Nộp trễ ⇒ gậy.** |
| 10 | Thêm phần **trưởng khối tự viết** theo khung Plans · Progress · Problems. |
| 11 | Có **Độ phủ đo** + tách **Ra có bằng chứng / Rớt cửa sổ** cạnh "dạng yếu giảm" (chống "giảm bằng cách đo ít đi" — định luật Goodhart; đã thiết kế ở spec-truong-khoi §4.2). |
| 12 | Điểm trung bình toàn khối = trung bình **trên lượt làm**, không phải trung bình các trung bình lớp (tránh nghịch lý Simpson). |
| 13 | Bổ trợ báo **cả kết quả**: độ phủ (HS yếu đã được bổ trợ / HS yếu) + số em hết yếu sau ca — không chỉ số ca. |
| 14 | Vòng trạng thái: Nháp → Đã nộp (snap) → Trả lại → Đã nộp → Đã duyệt. Trả lại chỉ sửa **phần chữ**, số giữ bản snap. |
| 15 | **Ô chưa có trưởng khối** (03/11: KHTN 7·8·9 · Anh 5T·8·9 · Văn 8) ⇒ **trưởng bộ môn** báo cáo thay. |
| 16 | **Báo cáo Chuyên môn tuần theo MÔN** (Trang = Toán, anh Ngọc = KHTN…); CEO xem gộp mọi môn. |
| 17 | Chiếu TV: dùng lại kiểu trình chiếu Tổng kết tuần — mỗi khối một màn, màn đầu là tổng môn. |
| 18 | Task "đã duyệt ⇒ tự điền" theo **người giao duyệt** (không chỉ Thùy). |

---

## 2. Logic

### 2.1 Chu kỳ một tuần

```
CN 24:00 (= T2 00:00)  ── hệ tự CHỤP dạng yếu đầu tuần mới (= cuối tuần cũ), mọi HS, mọi môn
T2 sáng                ── báo cáo tuần trước MỞ cho trưởng khối (nháp: số đã tính sẵn, đọc được ngay)
T2 trước HẠN           ── trưởng khối điền phần cá nhân + tự viết → bấm NỘP ⇒ SNAP số
T2 sau HẠN chưa nộp     ── hệ đề xuất GẬY trễ cho trưởng khối (Trang quyết — trưởng khối là cấp dưới của Trang)
T2–T3                  ── trưởng bộ môn đọc: DUYỆT hoặc TRẢ LẠI (ghi lý do) từng báo cáo khối
khi đủ khối đã duyệt    ── trưởng bộ môn viết nhận xét môn → CHỐT Báo cáo Chuyên môn tuần (snap phần tổng môn) → CHIẾU TV cho CEO
```

### 2.2 Ai báo cáo cái gì

- Mỗi **trưởng khối** = **1 báo cáo / tuần**, gồm mọi ô (môn × khối) người đó là **trưởng** (`phan_cong_quan_ly_khoi`, vai `truong`) — vd Đạt: 10 · 11 · 12.
- **Ô chưa có trưởng khối** ⇒ gộp vào báo cáo của **trưởng bộ môn** môn đó (người giữ ghế trưởng/phó cây GV môn — cùng luật phòng Trưởng bộ môn).
- "Từng lớp" = các lớp đang học của các ô đó.
- Phó khối không báo cáo (spec-truong-khoi chốt #8).

### 2.3 Snap — "báo cáo cứng"

- Lúc **Nộp**: hệ tính toàn bộ phần số **trong cùng transaction** với việc đổi trạng thái → ghi vào báo cáo (jsonb) kèm **phiên bản công thức**.
  Sau đó mọi màn đọc **bản đã ghi**, không gọi lại hàm tính.
- Trước khi nộp (nháp): màn hiện số tính **trực tiếp** (cùng hàm) để trưởng khối đọc và viết nhận định — số nháp có thể nhích nếu dữ liệu tuần trước còn được sửa.
- **Trả lại** không mở lại phần số. Muốn số mới (vd dữ liệu tuần đó bị nhập thiếu, đã bổ sung) ⇒ trưởng bộ môn bấm **"Snap lại số"** có ghi lý do — vết vào lịch sử (không phải đường thường).
- Mọi đổi trạng thái: 1 cột trạng thái + **trigger ghi lịch sử** (actor · ts · cũ → mới) — CLAUDE.md §4.

### 2.4 Phần CÁ NHÂN — task phát triển

- Danh sách = task `task_phat_trien` có **người làm = trưởng khối**, còn sống trong tuần: đang làm / chờ duyệt, và task **đã duyệt trong tuần** (không lấy task huỷ).
- **Đã duyệt** (người giao duyệt) ⇒ dòng **tự điền + khoá**: trạng thái "Hoàn thành", % = kết quả người giao chốt, nhận xét người giao.
- **Chưa xong** ⇒ trưởng khối điền: **trạng thái hiện tại** · **mô tả** (lưu ý, khó khăn) · **% hoàn thành**. Hệ hiện sẵn hạn / số lần gia hạn / trễ chưa.
- Cả phần này snap cùng lúc Nộp.

### 2.5 Phần QUẢN LÝ — hệ tự tổng hợp (toàn khối + từng lớp)

Mọi chỉ số tính ở **một hàm DB** theo `(ô, khoảng ngày)` — dùng cho báo cáo tuần, cho trend, cho màn tổng môn. Không công thức thứ hai.

| # | Nhóm | Chỉ số | Định nghĩa (logic) |
|---|---|---|---|
| 1 | **ET** | Tỉ lệ chấm ET đúng hạn · Điểm ET trung bình | Việc chấm ET của buổi trong kỳ (trừ ET online); **đúng hạn = lần đóng đầu ≤ hạn** (cùng cách Gậy/Hiệu suất TA đo). Điểm TB trên lượt. |
| 2 | **BTVN** | Tỉ lệ nộp BTVN · Điểm BTVN trung bình | Tỉ lệ nộp trên kết quả BTVN của buổi trong kỳ, **không tính xin phép**; tách đúng hạn / muộn. Điểm TB trên lượt. |
| 3 | **Dạng yếu** | Đầu tuần · Cuối tuần · Đã giảm · Tỉ lệ giảm · **Vào · Ra có bằng chứng · Rớt cửa sổ · Độ phủ đo** | Đầu tuần = tổng dạng yếu tại **T2 00:00**; cuối tuần = tại **CN 24:00**. Giảm = đầu − cuối; tỉ lệ = giảm / đầu. Vào / Ra / Độ phủ theo spec-truong-khoi §4.2. |
| 4 | **HS yếu** | Đầu tuần · Cuối tuần · Đã giảm · Tỉ lệ giảm · **Danh sách HS còn yếu** | HS yếu = ≥ 1 dạng yếu. Danh sách: em · lớp · số dạng yếu · **trạng thái xử lý** (ca Nhẹ / đang bổ trợ Yếu / đã đề xuất / chưa xử lý) — "chưa xử lý" xếp lên đầu. |
| 5 | **Bổ trợ** | Số ca đã thực hiện (Yếu · Nhẹ) · lượt HS · **Độ phủ** · **Hết yếu sau ca** | Ca = buổi bổ trợ Yếu / Nhẹ trong kỳ, không huỷ, có ≥ 1 em có mặt. Độ phủ = HS yếu đầu tuần đã được ≥ 1 ca / HS yếu đầu tuần. Hết yếu sau ca = em được bổ trợ mà cuối tuần không còn dạng yếu đã bổ trợ. |
| 6 | **Trend** | Mỗi chỉ số trên, theo khối, **4 tuần gần nhất** | Tuần đã có báo cáo nộp ⇒ lấy số đã snap; tuần chưa có ⇒ tính ngược bằng chính hàm ở trên. Hiện mũi tên so trung bình 3 tuần trước. |

### 2.6 Dạng yếu tại một mốc — nguồn DUY NHẤT

- Một hàm **"dạng yếu của HS × môn tại mốc D"** = đúng định nghĩa dạng yếu hiện hành (mastery < 0,5, đo trong 2 cửa sổ gần nhất…)
  nhưng **chỉ dùng các lần đo có thời điểm ≤ D**. Widget "đầu tuần", báo cáo, trend đều gọi hàm này.
- **Chụp tự động T2 00:00** = chạy hàm này cho mọi HS tại mốc T2 00:00 → ghi vào bảng ảnh đầu tuần (đã có: `dang_yeu_dau_tuan`).
  Ảnh là **bộ nhớ đệm cho nhanh**, không phải nguồn thứ hai: lệch thì tính lại từ hàm.
- **Không** chụp từ bảng `dang_yeu_hien_tai` (bảng đó làm mới lười — chụp từ đó là chụp số cũ).
- Lưu ý (§1 #6): sửa điểm cũ sau này ⇒ số tính ngược của quá khứ đổi theo. Vì vậy báo cáo vẫn **snap lúc nộp** — bản đã nộp là bản sự thật của tuần đó.

### 2.7 Phần TỰ VIẾT — Plans · Progress · Problems

- **Nhận định tình hình khối** (đọc số thấy gì, vì sao).
- **3 việc ưu tiên tuần tới.**
- **Cần hỗ trợ gì** (từ trưởng bộ môn / CEO).
Bắt buộc có trước khi Nộp (nút Nộp chỉ disable khi **thiếu data** — đúng luật UX §6).

### 2.8 Trưởng bộ môn: duyệt · trả lại · ghép

- Hàng báo cáo các khối của môn: trạng thái từng khối (chưa nộp / đã nộp / trễ / trả lại / đã duyệt).
- **Duyệt** hoặc **Trả lại** (bắt buộc ghi lý do) từng báo cáo.
- **Báo cáo Chuyên môn tuần** (1 bản / môn / tuần) = phần **tổng môn** (hệ tính, cùng hàm, gộp mọi ô của môn) + các báo cáo khối **đã duyệt** + **nhận xét của trưởng bộ môn**.
  Chốt ⇒ snap phần tổng môn. Khối chưa duyệt lúc chốt ⇒ ghi rõ "chưa có báo cáo khối X", không im lặng.
- CEO xem gộp mọi môn.

### 2.9 Chiếu TV

- Thứ tự màn: **Tổng môn** (6 nhóm chỉ số + mũi tên trend) → **mỗi khối một màn** (số khối + tự viết của trưởng khối) → **HS yếu chưa xử lý** → **nhận xét trưởng bộ môn**.
- Phím ← → / bấm, toàn màn hình, chữ to đọc từ xa. Dùng lại khuôn trình chiếu của Tổng kết tuần.

### 2.10 Nộp trễ ⇒ gậy

- Quá hạn chưa nộp ⇒ hệ **đề xuất gậy** "Nộp báo cáo tuần trễ" cho trưởng khối (đi đúng đường `gay_de_xuat` sẵn có).
- **Trang quyết** (trưởng khối là cấp dưới của Trang — spec-truong-khoi chốt #6). Ô do trưởng bộ môn báo cáo thay ⇒ CEO quyết.

### 2.11 Đặt ở đâu

- **Phòng làm việc**: thêm một đồ vật "📝 Báo cáo tuần" (vd sổ trên bàn trưởng khối). Phòng trưởng khối = soạn / nộp báo cáo của mình.
  Phòng trưởng bộ môn = hàng báo cáo các khối + ghép + chiếu TV.
- Sảnh: nhắc "Báo cáo tuần chưa nộp" trong Việc của tôi (suy theo invariant: tuần đã kết thúc ∧ là trưởng khối ⇒ ∃ báo cáo đã nộp; thiếu = việc).

---

## 3. Kiến trúc dữ liệu (định hướng — chi tiết lúc build)

- `bao_cao_tuan_khoi` — 1 dòng / (người báo cáo × tuần): trạng thái · `so` jsonb (snap) · `ca_nhan` jsonb · `tu_viet` jsonb · phiên bản công thức · nộp lúc · trễ.
  **Dòng chỉ ra đời lúc có thật** (mở nháp lần đầu / nộp) — không đẻ sẵn dòng trống cho mọi trưởng khối (§1.5 chống NULL). Ai chưa nộp = suy ra từ invariant.
- `bao_cao_tuan_khoi_log` — trigger ghi mọi đổi trạng thái.
- `bao_cao_chuyen_mon_tuan` — 1 dòng / (môn × tuần): trạng thái · phần tổng môn (snap) · nhận xét · danh sách báo cáo khối đã ghép.
- Hàm: `fn_dang_yeu_tai(hs, môn, mốc)` (nguồn dạng yếu tại mốc) · `fn_bctk_so(ô[], từ, đến)` (6 nhóm chỉ số, toàn khối + từng lớp) ·
  `fn_bctk_trend(ô[], tuần)` · `fn_bctk_nop` / `_tra_lai` / `_duyet` (RPC transactional: tính + ghi cùng transaction) · cron chụp đầu tuần.
- Dùng lại: `_troly_tuan_hoc_tap` (ET/BTVN theo lớp, nhận khoảng ngày) · `_viec_dong_dau` (lần đóng đầu) · luật phạm vi phòng (`_phong_trong_pham_vi`).

## 4. Pha build

| Pha | Việc | Xong khi |
|---|---|---|
| **P1 — Dữ liệu** | `fn_dang_yeu_tai` (tính ngược) + cron chụp T2 00:00 · kiểm lại vì sao **Tổng kết tuần ngừng tính từ tuần 19/10** và cho chạy lại | Có số dạng yếu đầu/cuối 4 tuần gần nhất cho mọi khối; Tổng kết tuần có tuần 26/10 |
| **P2 — Báo cáo trưởng khối** | Bảng + `fn_bctk_so` + màn soạn (cá nhân · quản lý · tự viết) + Nộp/snap | Trưởng khối nộp được báo cáo tuần 27/10–02/11 |
| **P3 — Trưởng bộ môn** | Duyệt / trả lại · gậy trễ · ghép Báo cáo Chuyên môn tuần | Trang chốt được báo cáo Toán |
| **P4 — Chiếu TV** | Màn trình chiếu | CEO xem được trên TV |

### 4.1 Đã làm (03/11)

- **P1 — mig `202611031346`** (ĐÃ ÁP): `_dang_yeu_tai_lo(hs[], môn, mốc)` = định nghĩa dạng yếu đang chạy, chỉ dùng lần đo < mốc
  (đối chiếu 03/11 trên dữ liệu thật: khớp 100% với `fn_btyeu_dang_yeu_2_cua_so_moi` — Toán 150/150, KHTN 186/186) ·
  `_dang_yeu_chup_tuan(tuần)` chụp từ hàm (không từ bảng làm mới lười), HS theo lớp TẠI MỐC · `_tu_dong_sang_t2()` = chụp + cập nhật Tổng kết tuần.
  **Thùy 03/11: không tính ngược** — ảnh đầu tiên do cron chụp sáng 09/11. Lịch cron = file `202611031347_tu_dong_sang_t2_cron_sql_editor.sql`
  (**phải chạy bằng SQL Editor** — claude_build không vào được schema cron; **Thùy đã chạy 03/11**, đã ghi sổ). Chưa nối hàm cũ sang hàm mới (việc dọn "một nguồn công thức" — làm sau, đã đối chiếu khớp).
  Ghi nhận: "Tổng kết tuần ngừng từ 19/10" KHÔNG phải lỗi — nó là bộ đệm tính lười (chỉ tính khi có người mở màn); cron sáng T2 giờ cập nhật luôn.
- **P2 — mig `202611031351`** (ĐÃ ÁP) + màn `BaoCaoTuanTK` (đồ vật "📝 Báo cáo tuần" — lịch treo tường trong Phòng làm việc): bảng
  `bao_cao_tuan_khoi` + log trigger · `fn_bctk_so` (6 nhóm, toàn khối + từng lớp + HS còn yếu) · `fn_bctk_trend` · `fn_bctk_lay / _luu_nhap / _nop`.
  Đo 03/11 (kỳ 26/10–01/11, chưa có ảnh dạng yếu): Hải K9 6 lớp 0,56 s · Hà Giang K6·7 11 lớp 0,8 s · Đạt K10–12 0,48 s · anh Ngọc báo cáo thay KHTN 7·8·9.
  Báo cáo có đủ số dạng yếu đầu → cuối đầu tiên: tuần 09/11–15/11 (cần cron chạy sáng 09/11 và 16/11).

## 5. Bàn sau (detail — không chặn logic)

- Giờ hạn nộp cụ thể (đề xuất 17:00 T2) · mức gậy trễ.
- BTVN: "nộp" tính cả muộn hay chỉ đúng hạn cho con số chính.
- Ngưỡng màu xanh / cam / đỏ của từng chỉ số (dùng cơ chế "thường đạt" 8 tuần khi đủ dữ liệu).
- % hoàn thành trưởng khối điền có ghi ngược vào `task_phat_trien` không.
- Danh sách HS còn yếu: hiện hết hay N em đầu + "xem tất cả".
- Hình đồ vật "Báo cáo tuần" trong cảnh phòng.
- Bố cục từng màn chiếu TV.
