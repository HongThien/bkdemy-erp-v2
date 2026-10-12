KẾT LUẬN: ĐẠT

# GKI-08 — Biên bản soát (Phòng GD&ĐT huyện Trực Ninh, khảo sát giữa kì I 2024–2025, Toán 8)

- **Số câu:** 17 (8 trắc nghiệm · 1 trả lời ngắn · 8 tự luận) — đề gốc 8 câu trắc nghiệm + 2 câu Đúng/Sai (nhập tự luận) + 4 bài tự luận; Bài 1, Bài 2, Bài 4 mỗi bài thành 2 câu, Bài 3 (hình) giữ chung.
- **Khớp đáp án Pha 1 (giải mù) ngay từ đầu:** 17 / 17. Không có câu nào lệch đáp án / đáp số / hướng chứng minh.
- **Số câu phải sửa:** 8 (Câu 5, Câu 8, Câu 10, Bài 2a, Bài 2b, Bài 3, Bài 4a, Bài 4b) — **không câu nào sai đề, sai đáp số**. 1 câu sửa vì kiến thức (Bài 4a: dùng ngầm bình phương của tổng ba số hạng); 1 câu thêm lí do còn thiếu (Bài 3); 3 câu sửa lời Phần 1 (Câu 5, Câu 10, Bài 2a); 3 câu xử lí dòng `Chưa chắc` (Câu 8, Bài 2b, Bài 4b). Bản trước khi sửa: `GKI-08.soan.goc.md`.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (17 câu, chưa chắc 0).
- **Máy kiểm của trạm soát:** `<LV>\tam\soat-kiem.mjs` (viết TRƯỚC khi mở bản soạn; phân số BigInt, thay 5 bộ số): Câu 2–6, Bài 1a, 1b, 2a (đồng nhất thức + thay ngược $x=\dfrac{1}{4}$), 2b, 4a, 4b (đồng nhất thức $(m-n)(4m+4n+1)-m^2\equiv(3m^2+m)-(4n^2+n)$ + vét $|m|\le 3000$: 4 cặp, 0 phản ví dụ); toạ độ 3 bộ $(AB;AC)$ cho Bài 3 ($AHIC$ là hình bình hành, $M,H,I$ thẳng hàng, $AG:AI=\dfrac{1}{3}$), 1 bộ cho Câu 10. `<LV>\tam\soat-kiem2.mjs` (Pha 2): từng dòng biến đổi của Bài 1b, 2a, 4a (bản đã sửa), 4b, Câu 3, Bài 1a.

## Đã soát gì

- **Đề:** đối chiếu từng câu với ảnh trang + ảnh cắt 200 dpi (`<LV>\tam\s1a.png`, `s2a.png`, `s2b.png`): số, số mũ, dấu, phương án (kể cả phương án A của Câu 5 in $4y$ không mũ), tên điểm, đủ ý — khớp hết, không sót, không bỏ câu. Các chỗ bản soạn đã chuẩn hoá đúng: dấu chấm làm dấu nhân (Câu 3, Bài 2a), thêm mũ góc ở Câu 7, Câu 10d (đề in "$A=125^\circ$", "$CDE=60^\circ$").
- **Kiến thức:** không có đường trung bình, Thalès, đồng dạng, Pythagore, "phương trình – tập nghiệm" (kể cả dùng ngầm). Hằng đẳng thức (bình phương của tổng / hiệu, hiệu hai bình phương) — đề có hỏi (Câu 4, 5, 6). Hình chữ nhật, hình thoi, hình vuông — đề có hỏi (Câu 8, 9, 10, Bài 3). Bài 3a đi qua tổng các góc $360^\circ$ rồi "bốn góc vuông", không dùng "ba góc vuông". Bài 3b thẳng hàng bằng tiên đề Euclid; Bài 3c bằng trọng tâm (lớp 7). Bài 4b dùng số học lớp 6 (ước nguyên tố, nguyên tố cùng nhau) — nền lớp dưới, hợp lệ.
- **Phân loại:** `kho` đúng (Câu 7, 8, 9, 10, Bài 3 = `hinh_hoc`; còn lại `dai`). Trả lời ngắn: chỉ Bài 4a ($19$) — đề hỏi đúng một số; Bài 2a ($\dfrac{1}{4}$) là phân số, Bài 1a, 1b, 2b là đa thức ⇒ tự luận, đúng luật.
- **Tách ý / nhãn (lưu ý riêng của lượt này):** Bài 2 trong đề là "a) Tìm $x$ biết $(4x+1)^2-4(4x+1)(x-2)=18$" và "b) bài lời văn bạn Đăng mua vở" — **hai bài toán khác hẳn nhau, không chung dữ kiện** (chữ $x$ ở ý b là số quyển vở, không liên quan $x$ ở ý a) ⇒ không gộp; đề gốc đánh nhãn a), b) (không phải 1), 2)) nên **giữ nhãn gốc `Bài 2a`, `Bài 2b`** — cùng cách đã làm ở GKI-02 Bài 5. Bài 4 (a: giá trị nhỏ nhất · b: số chính phương) cũng vậy. Bài 1 (a: chia đa thức · b: thu gọn) là hai ý tính độc lập ⇒ tách đúng luật. Bài 3 (hình) không tách.
- **Hình:** `p2c10_1.png` đúng hình của Câu 10, đủ $A,B,C,D,E,F,I$ và các đoạn, không cụt, không dính chữ. `giai_bai3.png` (vẽ bằng code): dựng bằng toạ độ đúng dữ kiện ($AB=4<AC=5$, $H$ là chân đường cao, $M$, $N$ là chân đường vuông góc, $E$ trung điểm $HC$, $I$ đối xứng với $A$ qua $E$, $F$ tâm hình chữ nhật, $G$ đã kiểm trùng giao điểm $CF\cap AI$), đủ 10 điểm, nhãn không đè / không cụt, lề dưới 35 px; chỉ đánh dấu giả thiết (góc vuông tại $A$, $H$, $M$, $N$; gạch $HE=EC$, $AE=EI$), không đánh dấu $F$ là trung điểm hay $AG=\dfrac{1}{3}AI$. Không phải vẽ lại.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 5 | định dạng (lời Phần 1) | Chú ý: "số hạng cuối $B^2$ luôn dương" → "trong hằng đẳng thức, số hạng cuối $B^2$ luôn mang dấu cộng" | $B^2$ có thể bằng 0; điều cần nói là dấu của số hạng trong công thức |
| Câu 8 | định dạng (dòng Chưa chắc) | Xoá dòng `**Chưa chắc:**` (lo "hai cạnh đối song song" có thể là hai cặp ⇒ D) | Đã kiểm chắc: đề viết "hai cạnh đối song song" = một cặp ⇒ hình thang; hình thang có hai đường chéo bằng nhau là hình thang cân — đúng nguyên văn dấu hiệu SGK. Kể cả khi tứ giác là hình chữ nhật thì theo định nghĩa KNTT nó vẫn là hình thang cân ⇒ C đúng trong mọi cách hiểu, D không suy ra được. Khớp Pha 1 |
| Câu 10 | định dạng (Phần 1 lộ đáp án + nêu điều chưa chứng minh) | Chú ý: bỏ câu "hình bình hành $AECF$ có hai cạnh kề $AE$, $EC$ không bằng nhau và góc $A$ không vuông nên không thể là hình vuông" → "hình vuông phải có bốn góc vuông, nên ở ý b chỉ cần tính được một góc của $AECF$ rồi so với $90^\circ$…" | Câu cũ nói thẳng kết luận ý b ngay trong Phần 1 và khẳng định $AE\ne EC$ mà Phần 2 không chứng minh |
| Bài 2a | định dạng (lỗi chữ) | Mấu chốt: "khai triển cả hai vế trái" → "khai triển cả hai tích ở vế trái" | Câu cũ vô nghĩa (chỉ có một vế trái) |
| Bài 2b | định dạng (dòng Chưa chắc) | Xoá dòng `**Chưa chắc:**`, chuyển ý đó vào dòng `**Ghi chú:**` (đề viết "giá $y$ đồng" không nói rõ mỗi quyển; hiểu là giá mỗi quyển) | Đã kiểm chắc: đề nói tiếp "giảm 1500 đồng mỗi quyển", và nếu $y$ là tổng tiền thì kết quả $(x+4)\left(\dfrac{y}{x}-1500\right)$ không phải đa thức — trái yêu cầu "tìm đa thức". Chỉ còn một cách hiểu; vẫn để Ghi chú vì là chỗ đề gốc viết thiếu |
| Bài 3 | lập luận (thiếu lí do) | Ý b: thêm "(tiên đề Euclid)" sau "hai đường thẳng này trùng nhau"; ý c: thêm "(tính chất trọng tâm của tam giác)" sau $AG=\dfrac{2}{3}AE$ | Mỗi khẳng định hình phải có lí do; hai chỗ này là hai mắt xích chính của ý b, ý c |
| Bài 4a | kiến thức (dùng ngầm) + lập luận | Phần 2: bỏ dòng gom $(x^2+4y^2+9+4xy+6x+12y)=(x+2y+3)^2$; viết lại thành $[x^2+2x(2y+3)+(2y+3)^2]-(2y+3)^2+5y^2+16y+32$ → $(x+2y+3)^2-(4y^2+12y+9)+\dots$ → $(x+2y+3)^2+y^2+4y+23$ → $\dots+(y+2)^2+19$. Phần 1 Bước 1–3 viết lại theo đúng mạch đó ($A=x$, $B=2y+3$, thêm bớt $B^2$); bỏ chữ "tam thức bậc hai" | Dòng cũ dùng ngầm hằng đẳng thức bình phương của tổng **ba** số hạng — không có trong bảy hằng đẳng thức của sách; học sinh cũng không thấy được vì sao tách $5y^2=4y^2+y^2$, $32=9+4+19$. Cách mới chỉ dùng $(A+B)^2$, mỗi dòng một phép biến đổi (máy đã kiểm 6 dòng bằng nhau). Đáp số không đổi |
| Bài 4b | định dạng (dòng Chưa chắc) | Xoá dòng `**Chưa chắc:**` ("bài nâng cao, dùng số học lớp 6… đã tự kiểm bằng máy") | Không phải điều chưa chắc: lời giải đã soát đúng từng dòng (đồng nhất thức (1); trường hợp $m=n$; $m>n$ ⇒ $m\ne 0$ ⇒ $4m+4n+1>0$; ước nguyên tố chung $p$ ⇒ $p\mid m$ ⇒ $p\mid n$ ⇒ $p\mid 1$; hai số nguyên dương nguyên tố cùng nhau có tích chính phương), khớp hướng giải Pha 1, máy vét không có phản ví dụ. Số học lớp 6 nằm trong nền cho phép. Ý "câu nâng cao" chuyển xuống ghi chú cuối tệp |
| Ghi chú cuối tệp | định dạng | "10 mục lớn" → "14 mục lớn, nhập thành 17 câu"; nêu rõ Bài 2, Bài 4 là vỏ gom hai bài toán khác nhau, giữ nhãn gốc a, b; bỏ các chỗ trỏ tới dòng Chưa chắc đã xoá | $8+2+4=14$; khớp nội dung đã sửa |

## Câu còn `Chưa chắc`

Không có. (Ba dòng `Chưa chắc` của trạm soạn — Câu 8, Bài 2b, Bài 4b — đều đã kiểm chắc và xoá, lí do ở bảng trên.)

## Điều người duyệt nên biết (không phải lỗi)

- **Bài 4a** nhập trả lời ngắn ($19$) theo đúng dạng đề hỏi ("Tìm giá trị nhỏ nhất") — cùng cách với GKI-02 Bài 5a. Ở Pha 1 trạm soát ghi "tự luận" (vì bài làm phải nêu cả $x=1$, $y=-2$); nếu muốn học sinh trình bày thì đổi `tu_luan`.
- **Câu 9** Phần 2 xét theo thứ tự b) → d) → a) → c) (hình thoi trước, rồi phản ví dụ $AC=6$ cm, $BD=8$ cm cho hai ý sai), dòng cuối có kết luận đủ a) b) c) d). Giữ nguyên vì đó là mạch suy luận tự nhiên.
- **Câu 4** đề viết "Khai triển $x^2-25y^2$ theo hằng đẳng thức" (thực chất là viết thành tích) — chép nguyên văn đề, không sửa.
- **Bài 1a** dòng $=12x^6y^4:3x^2y^3+9x^5y^3:3x^2y^3-15x^2y^3:3x^2y^3$ viết không ngoặc quanh từng phép chia (theo lối viết SGK: đơn thức chia đứng liền sau dấu ":"); giữ nguyên.
