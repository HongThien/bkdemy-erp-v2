# Bản đồ mới K7 — ĐỀ XUẤT các chủ đề học kì II còn THIẾU (27/11/2026, chờ Thùy chốt)

**Vai trò:** Claude chỉ ĐỀ XUẤT; Thùy / trưởng khối quyết cấu trúc (`spec-ban-do-toan.md` §0, §2.8). Chưa ghi gì vào DB. Bản **rút gọn**: mỗi chương chỉ vài dạng, gộp những gì cùng một thao tác.

## 0. Nguồn và cách đọc

- **SGK:** Toán 7 tập 2, Kết nối tri thức (`Downloads\sach-giao-khoa-toan-7-tap-2-ket-noi-tri-thuc-voi-cuoc-song.pdf`). File là **bản scan (không có chữ)**; đã đọc **mục lục** (Ch VI bài 20–23 · Ch VII bài 24–28 · Ch VIII bài 29–30 · Ch IX bài 31–35 · Ch X bài 36–37). **Đã đọc thêm trang đầu bài 21, 25, 30 (khái niệm – kĩ năng cần đạt); **chưa đọc hết ví dụ / bài tập từng bài** nên cột nguồn ghi "SGK bài n" theo mục lục, còn nội dung dạng chủ yếu dựa vào ĐỀ THẬT.
- **Đề thật:** 23 đề giữa kì II Toán 7 Hà Nội (`Downloads\GKII`, 2024–2025 và 2025–2026). **16 đề có chữ** (đã trích bằng `pdftotext`, đếm từ khoá + đọc câu hỏi khớp); **7 đề là scan** chưa đọc ⇒ các số đếm là **cận dưới, trên 16 đề**. Đề **cuối kì II K7** chưa có trên máy này (`batch.json` không có, `Downloads` không có `CKII` cho K7) ⇒ chương Ch IX–X (hình) và phần cuối Ch VII có thể còn thiếu.
- Số lần thấy trong 16 đề GKII: biến cố/xác suất **10** · thống kê/biểu đồ **12** · dãy tỉ số bằng nhau **8** · tỉ lệ thuận **4** · tỉ lệ nghịch **3** · tỉ lệ thức **3** · đa thức một biến **4** · phân giác (hình tam giác bằng nhau, Ch IV) **13** · quan hệ ba cạnh / so sánh cạnh – góc **7** · trung trực **4** · hình hộp / lăng trụ **0**.
- Ký hiệu nguồn: **[SGK x]** = bài SGK theo mục lục · **[Đề]** = thấy trong đề thật (đã đọc câu hỏi) · **[◇]** = đề xuất mở rộng, chưa thấy trong mẫu đã đọc.
- Luật bản đồ: mã gốc bất biến; dạng mới có **mô tả nhận biết** ngay lúc tạo.

## 1. Hiện trạng K7 (đo 27/11, `bdm-ly-thuyet.mjs 7`)

Bản đồ K7 trong DB **chỉ có 2 chủ đề Đại**: *1. Số hữu tỉ* (5 chuyên đề, 20 nhóm) và *2. Số thực* (5 chuyên đề, 12 nhóm); tổng 72 dạng. **Không có nhóm vỏ rỗng.** Hai dạng đang để chung chung:

| Chỗ | Mã | Vấn đề |
|---|---|---|
| Chủ đề 1 › CĐ3 › Nhóm 2 *Biểu đồ/Thống kê* | NNB01648 / dạng NDB01349 | Một dạng duy nhất cho cả chương Thống kê (Ch V Tập 1) — đề GKII hỏi **12/16 đề**, nhiều kiểu khác nhau. Đề xuất tách dạng (§4). |
| Chủ đề 1 › CĐ3 › Nhóm 1 *Toán thực tế số hữu tỉ* | NNB00940 | Giữ nguyên. |

**Chưa có hẳn:** Ch VI tỉ lệ thức – đại lượng tỉ lệ · Ch VII biểu thức đại số – đa thức một biến · Ch VIII biến cố – xác suất. Hình K7 tập 1 (góc, song song, tam giác bằng nhau, cân, trung trực) đã nằm ở kho Hình; **Ch IX–X (hình)** chưa có chỗ — xem §6.

## 2. Chủ đề 3 (mới) — Tỉ lệ thức và đại lượng tỉ lệ (Ch VI, SGK bài 20–23)

### CĐ 3.1 Tỉ lệ thức và dãy tỉ số bằng nhau

**Nhóm 1 — Tỉ lệ thức** (SGK bài 20)

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Nhận biết, lập tỉ lệ thức từ đẳng thức hoặc từ các số cho trước | "Từ đẳng thức 3.(−15) = (−9).5 lập được tỉ lệ thức nào", kiểm tra hai tỉ số có lập thành tỉ lệ thức không, hoán vị các số hạng. | SGK 20 · Đề (Mai Dịch, Nguyễn Trãi) |
| 2 | Tìm x trong tỉ lệ thức | $\dfrac{x}{a}=\dfrac{b}{c}$ hoặc có biểu thức chứa x ⇒ tích chéo. | SGK 20 · Đề |
| 3 | Chứng minh đẳng thức từ tỉ lệ thức (nâng cao) | Cho $\dfrac{a}{b}=\dfrac{c}{d}$ chứng minh đẳng thức khác (tính chất hoán vị, đặt k). | Đề (Nguyễn Trãi bài 5) · ◇ |

**Nhóm 2 — Dãy tỉ số bằng nhau** (SGK bài 21)

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Tìm x, y, z biết dãy tỉ số và tổng / hiệu / tích | $\dfrac{x}{a}=\dfrac{y}{b}=\dfrac{z}{c}$ và $x+y-z=m$ (hoặc $x.y=m$, …); "x, y, z tỉ lệ với 2; 4; 5". Áp dụng tính chất dãy tỉ số bằng nhau. | Đề (**8/16 đề**) |
| 2 | Bài toán chia tỉ lệ (thực tế) | Chia số tiền / số sản phẩm / số khẩu trang theo tỉ lệ cho trước (3; 4; 5), chia chu vi – diện tích tỉ lệ với các số. | Đề (Đông Anh "khẩu trang tỉ lệ thuận với 3, 4, 5") · SGK 21 |
| 3 | Dãy tỉ số có biến đổi (nâng cao) | Phải quy đồng / nhân thêm hệ số để thành dãy $\dfrac{2x}{3}=\dfrac{3y}{4}$ hay có điều kiện thêm. | ◇ |

### CĐ 3.2 Đại lượng tỉ lệ thuận, tỉ lệ nghịch

**Nhóm 1 — Đại lượng tỉ lệ thuận** (SGK bài 22)

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Nhận biết tỉ lệ thuận, tìm hệ số tỉ lệ, viết công thức, điền bảng | y = kx; "y tỉ lệ thuận với x theo hệ số −3"; bảng giá trị có ô còn thiếu; chọn công thức đúng. | Đề (Mai Dịch, Uy Nỗ, Nguyễn Trãi) |
| 2 | Bài toán thực tế đại lượng tỉ lệ thuận | Tính tiền / khối lượng / quãng đường theo tỉ lệ; hai đại lượng cùng tăng. | SGK 22 · Đề |

**Nhóm 2 — Đại lượng tỉ lệ nghịch** (SGK bài 23)

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Nhận biết tỉ lệ nghịch, tìm hệ số tỉ lệ, viết công thức, điền bảng | xy = a; "y tỉ lệ nghịch với x theo hệ số 12 tính x khi y = 6". | Đề (Mai Dịch, Uy Nỗ) |
| 2 | Bài toán thực tế đại lượng tỉ lệ nghịch | Vận tốc – thời gian, số người – số ngày, năng suất; có thể kết hợp lập tỉ lệ thức. | Đề (Chương Dương "hai thửa ruộng… tỉ lệ nghịch") · SGK 23 |

*Gợi ý rút gọn:* nếu Thùy muốn gọn hơn nữa thì gộp 2 nhóm thành 1 nhóm "Đại lượng tỉ lệ" (4 dạng).

## 3. Chủ đề 4 (mới) — Biểu thức đại số và đa thức một biến (Ch VII, SGK bài 24–28)

Thấy trong đề: **4/16 đề GKII** có đa thức; thường là **một bài 1,5–2 điểm** (thu gọn, bậc, cộng trừ, nghiệm). Phép chia đa thức hầu như chưa xuất hiện ở GKII (có thể ở CKII).

### CĐ 4.1 Biểu thức đại số

**Nhóm 1 — Biểu thức đại số** (SGK bài 24)

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Viết biểu thức đại số biểu thị tình huống | "Biểu thức đại số biểu thị nửa tổng của x và y". | SGK 24 · Đề (Uy Nỗ) |
| 2 | Tính giá trị của biểu thức đại số tại giá trị cho trước của biến | Thay x = … vào biểu thức rồi tính. | SGK 24 · Đề |

### CĐ 4.2 Đa thức một biến

**Nhóm 1 — Khái niệm đa thức một biến** (SGK bài 25)

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Nhận biết đơn thức một biến; hệ số và bậc của đơn thức | Cho $-dfrac15x^2$, $-8$, $3^2x$… ⇒ chỉ hệ số, bậc; nhận biết biểu thức nào là đơn thức, đa thức một biến. | SGK 25 (khung kiến thức – kĩ năng, câu hỏi đầu bài) |
| 2 | Thu gọn, sắp xếp đa thức; chỉ ra bậc, hệ số cao nhất, hệ số tự do | "Thu gọn và sắp xếp A(x) theo lũy thừa giảm dần; tìm bậc, hệ số cao nhất, hệ số tự do". | Đề (Đông Anh, Thanh Xuân, Uy Nỗ, Nguyễn Trãi) |
| 3 | Tính giá trị đa thức tại x₀ | Thay giá trị của biến vào đa thức (có thể sau khi thu gọn). | Đề (Nguyễn Trãi, Thanh Xuân) |

**Nhóm 2 — Phép tính với đa thức một biến** (SGK bài 26–28)

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Cộng, trừ đa thức một biến; tìm đa thức khi biết hiệu / tổng | Tính A(x) ± B(x); tìm C(x) biết C(x) − A(x) = B(x). | Đề (Đông Anh, Uy Nỗ, Nguyễn Trãi) |
| 2 | Nhân hai đa thức; thu gọn tích | (x − 5)(2x + 3) − 2x² + 7; tích đơn thức với đa thức. | Đề (Nguyễn Trãi) · SGK 27 |
| 3 | Chia đa thức cho đơn thức, chia đa thức một biến | Chia đa thức cho đơn thức; chia đa thức đã sắp xếp (đặt tính chia). | SGK 28 · ◇ (chưa thấy trong GKII) |

**Nhóm 3 — Nghiệm của đa thức một biến** (SGK bài 25)

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Kiểm tra số cho trước có là nghiệm; tìm nghiệm đa thức bậc nhất, dạng tích | "Tìm nghiệm của C(x)", đa thức đưa về bậc nhất; $2x^2-18$ đếm số nghiệm. | Đề (**15/16 đề có chữ "nghiệm"**, trong đó 4 đề là nghiệm đa thức) |
| 2 | Chứng minh đa thức không có nghiệm | Đa thức dạng "bình phương + số dương" (x⁴ + 1). | Đề (Thanh Xuân) |

## 4. Chủ đề 5 (mới) — Biến cố và xác suất của biến cố (Ch VIII, SGK bài 29–30)

Thấy trong đề: **10/16 đề GKII** (rất nhiều câu: trắc nghiệm 2–4 câu + một bài tự luận 1 điểm). Gieo xúc xắc, rút thẻ, lấy bi. Gộp lại **1 chuyên đề, 1 nhóm, 4 dạng**.

**Nhóm 1 — Biến cố và xác suất của biến cố trong trò chơi đơn giản**

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Liệt kê các kết quả có thể xảy ra; đếm số phần tử | "Viết tập hợp M gồm các kết quả có thể xảy ra" khi rút thẻ 1…70, gieo xúc xắc; không có hình. | SGK 29 · Đề (Việt Hưng, Nghĩa Tân, Phúc Lợi) |
| 2 | Xác định biến cố; liệt kê và đếm kết quả thuận lợi | "Biến cố: số xuất hiện là số có hai chữ số / bội của 3 / hợp số" ⇒ nêu các kết quả thuận lợi. Nhận biết mức khả năng (không thể, ít / nhiều khả năng, chắc chắn) và biến cố ngẫu nhiên. | SGK 29 · Đề |
| 3 | Tính xác suất của biến cố (kết quả đồng khả năng) | P = số kết quả thuận lợi / tổng số kết quả; rút thẻ, gieo xúc xắc, quay vòng quay, lấy bi từ hộp. | SGK 30 · Đề (**gặp nhiều nhất**) |
| 4 | Xác suất hai lần thực hiện (nâng cao) | Hai bạn mỗi người gieo một xúc xắc; liệt kê cặp (a; b), tính xác suất tổng / tích bằng k. | Đề (Ngô Sĩ Liên bài 5a) |

## 5. Thống kê (Ch V Tập 1) — đề xuất tách dạng cho nhóm có sẵn NNB01648

Dạng hiện có chung chung. Đề GKII hỏi thống kê ở **12/16 đề**; đề xuất **giữ nhóm và mã** (nhóm *Biểu đồ/Thống kê*, NNB01648), **thêm dạng** để máy phân đúng:

| # | Dạng đề xuất | Mô tả nhận biết | Nguồn |
|---|---|---|---|
| 1 | Phân loại dữ liệu; số liệu hay không; chọn loại biểu đồ phù hợp | "Dữ liệu nào là số liệu / không phải số liệu"; "nên dùng loại biểu đồ nào để biểu diễn sự thay đổi lượng mưa theo tháng". | Đề (Phúc Lợi, Ngô Sĩ Liên) |
| 2 | Đọc biểu đồ hình quạt tròn | Đọc tỉ lệ %, loại nhiều nhất, tính số lượng từ tổng và %, tỉ số phần trăm giữa hai phần. | Đề (Nghĩa Tân, Việt Hưng, Ngô Sĩ Liên) |
| 3 | Đọc biểu đồ cột, biểu đồ cột kép, biểu đồ đoạn thẳng | Lập bảng số liệu từ biểu đồ, so sánh hai năm, tính tổng, tính % tăng / giảm (làm tròn). | Đề (Phúc Lợi "xe máy bán ra", Việt Hưng "thu nhập bình quân") |
| 4 | Lập bảng thống kê / vẽ biểu đồ từ số liệu | Cho bảng số liệu ⇒ vẽ (tả cách vẽ) biểu đồ cột / hình quạt; tính tỉ lệ %. | ◇ (bài "vẽ biểu đồ" thấy ít trong GKII) |

> **Hỏi Thùy:** nhóm này đang nằm trong *Chủ đề 1 Số hữu tỉ › CĐ3 Toán thực tế* (lịch sử). Có cần **chuyển** sang một chủ đề *Thống kê* riêng không? Chuyển nhóm = đổi cha, mã không đổi — nhưng đây là việc của bản đồ cũ, Claude không tự làm.

## 6. Phần ngoài khuôn "dạng–câu" — Hình Ch IX–X

Không đề xuất dạng ở đây vì thuộc khuôn Hình (`hinh_hoc_*`):

- **Ch IX (SGK bài 31–35):** quan hệ góc – cạnh đối diện · đường vuông góc – đường xiên · bất đẳng thức tam giác · trung tuyến, phân giác, trung trực, đường cao đồng quy. Trong đề GKII đã thấy: so sánh cạnh/góc & bất đẳng thức tam giác (7 đề trắc nghiệm), phân giác (13 đề, đa số là hình tam giác bằng nhau Ch IV), trung trực 4, trọng tâm 1.
- **Ch X (bài 36–37):** hình hộp chữ nhật, hình lập phương, lăng trụ đứng — **0/16 đề GKII** nên không cần gấp.
- Đề xuất theo mẫu K9: tạo **một bài học Hình chờ riêng cho K7** (*"Hình học học kì II — chờ vào kho hình"*, chủ đề `nhanh='hinh'`) để chứa câu Hình học kì II trong lúc giải đề; sau chuyển sang kho Hình. Chỉ tạo SAU khi Thùy duyệt.

## 7. Cần Thùy quyết (theo thứ tự ưu tiên)

1. **Duyệt cấu trúc** §2–§4: 3 chủ đề mới (3 · 4 · 5), 5 chuyên đề, 9 nhóm. Dạng **[◇]** có giữ không?
2. **Thống kê (§5):** chỉ tách dạng trong nhóm cũ, hay chuyển sang chủ đề riêng?
3. **Tỉ lệ thuận + tỉ lệ nghịch (§2):** giữ 2 nhóm hay gộp 1 nhóm?
4. **Hình Ch IX–X (§6):** đồng ý tạo bài học chờ như K9, hay có đề xuất riêng cho Hình–Học?
5. **Đề cuối kì II K7 và đề scan:** chưa có / chưa đọc. Thùy có file CKII K7 để Claude đối chiếu thêm không? Cần SGK tập 2 bản có chữ hoặc chỉ định bài cần đọc ví dụ?
6. Sau khi chốt: dựng vào DB (script giống `bdm-k9-hk2-dung.mjs`: chạy thử rollback rồi `--ghi`) ⇒ điền lý thuyết + ví dụ ⇒ phân lại câu theo `spec-ban-do-toan.md` §3.4. **Chưa làm gì ở DB.**

## 8. Số lượng

| Chủ đề | Chuyên đề (mới) | Nhóm (mới) | Dạng đề xuất |
|---|---|---|---|
| 3. Tỉ lệ thức – đại lượng tỉ lệ | 2 | 4 | **10** |
| 4. Biểu thức đại số – đa thức một biến | 2 | 4 | **10** |
| 5. Biến cố – xác suất | 1 | 1 | **4** |
| Thống kê (nhóm có sẵn NNB01648) | 0 | 0 | **4** (thêm vào nhóm cũ) |
| **Cộng** | 5 | 9 | **28 dạng** |
