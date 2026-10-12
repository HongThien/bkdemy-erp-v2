# GKI-35 — Pha 1: giải MÙ (trạm soát, chưa mở bản soạn)

Đề: THCS Bát Tràng — Đề 2, giữa học kì I Toán 8, năm học 2025–2026 (12 câu TN + 6 bài TL, 90 phút). Đề không in đáp án.
Đọc ảnh `trang/p-1.png`, `p-2.png` + cắt 300 dpi (`tam/s_c24.png`, `s_c56.png`, `s_b12.png`, `s_b6.png`). Máy kiểm: `tam/soat-pha1.mjs` (phân số BigInt, 5 bộ số) — tất cả khớp.

| Nhãn | Đáp án / đáp số / hướng chứng minh | Ghi chú về đề |
|---|---|---|
| Câu 1 | **D** ($\dfrac{-5}{7}x$ là đơn thức; A có biến ở mẫu, B và C là tổng / hiệu) | |
| Câu 2 | **A** (tích $=\dfrac{17}{30}x^4yz^3$, bậc $4+1+3=8$) | |
| Câu 3 | **A** ($P=2xy^2-xy-1$) | |
| Câu 4 | **B** ($7y^2x^3$ cùng phần biến $x^3y^2$) | |
| Câu 5 | **C** (thu gọn: $-2x^5+2x^5=0$, còn $2x^2y-xy^3-3$, bậc $4$) | Ảnh 300 dpi: $-2x^5+2x^2y-xy^3+2x^5-3$ |
| Câu 6 | **C** ($-2x^3y$: cả hai hạng tử đều chia hết; A, B hỏng vì $x^3$ không chia hết cho $x^4$; D hỏng vì $y^2$ không chia hết cho $y^3$) | Ảnh 300 dpi: $7x^3y^2z-2x^4y^3$; A. $3x^4$ · B. $-3x^4$ · C. $-2x^3y$ · D. $2xy^3$ |
| Câu 7 | **A** ($\widehat{BCD}=180^\circ-120^\circ=60^\circ$ (trong cùng phía, $AB\parallel CD$); $\widehat{ADC}=\widehat{BCD}=60^\circ$ (hai góc kề đáy $CD$)) | |
| Câu 8 | **B** ($360^\circ-140^\circ-56^\circ-72^\circ=92^\circ$) | |
| Câu 9 | **A** (hai đường chéo cắt nhau tại trung điểm ⇒ hình bình hành; thêm bằng nhau ⇒ hình chữ nhật). B ra hình bình hành, C ra hình chữ nhật, D ra hình thoi | |
| Câu 10 | **D** (hình chữ nhật nào cũng có bốn góc vuông ⇒ không suy ra hình vuông) | |
| Câu 11 | **B** (hình thang có hai cạnh bên bằng nhau chưa chắc cân — phản ví dụ: hình bình hành không phải hình chữ nhật). A = dấu hiệu SGK, D = định nghĩa, C = "tứ giác có hai cạnh đối song song" là hình thang + hai đường chéo bằng nhau ⇒ cân | Chỉ một phương án sai, không có hai cách hiểu |
| Câu 12 | **B** | |
| Bài 1a | $A=x^3y^2+6$ | Ảnh 300 dpi: $A=2x^3y^2-5xy-x^3y^2+5xy+6$ |
| Bài 1b | $A=(-1)^3\cdot 2^2+6=2$ | |
| Bài 2a | $M+N=3xy-2y^2-4$ | |
| Bài 2b | $A=12$ với mọi $x,y$ (nhân đa thức với đa thức: $(x+2y)(x^2-2xy+4y^2)=x^3+8y^3$) | Biểu thức tên $A$ trùng tên với Bài 1 — không ảnh hưởng |
| Bài 2c | $3x^3-\dfrac{5}{4}x^2y^2+3x$ | Ảnh 300 dpi: $(12x^4y^2-5x^3y^4+12x^2y^2):(4xy^2)$ |
| Bài 3a | $x=3$ | |
| Bài 3b | $x=-4$ (vế trái thu gọn còn $-2x+2$) | |
| Bài 4 | $(x+10)(x+y)-x^2=xy+10x+10y$ (m²) | Hình đề: chữ nhật cạnh $x+y$, $x+10$, ao vuông cạnh $x$ |
| Bài 5a | $\widehat{A}=\widehat{D}=\widehat{E}=90^\circ$ ⇒ góc thứ tư $\widehat{DME}=360^\circ-270^\circ=90^\circ$ ⇒ bốn góc vuông ⇒ $ADME$ là hình chữ nhật | |
| Bài 5b | $MA=MB$ (trung tuyến ứng cạnh huyền) ⇒ $\triangle MAB$ cân tại $M$, $MD\perp AB$ ⇒ $D$ là trung điểm $AB$ (hoặc $\triangle MDA=\triangle MDB$ cạnh huyền – cạnh góc vuông) ⇒ $DB=DA=ME$; $ME\parallel AD$ ⇒ $ME\parallel DB$ ⇒ $MBDE$ là hình bình hành (một cặp cạnh đối song song và bằng nhau) | Không được dùng đường trung bình / "đường thẳng qua trung điểm song song…" |
| Bài 5c | $MK=2ME=2DB=AB$, $MK\parallel AB$ ⇒ $ABMK$ là hình bình hành ⇒ hai đường chéo $AM$, $BK$ cắt nhau tại trung điểm mỗi đường; $I$ là trung điểm $AM$ (đường chéo hình chữ nhật $ADME$) ⇒ $I$ là trung điểm $BK$ ⇒ $B,I,K$ thẳng hàng. Toạ độ kiểm 2 bộ: đúng | |
| Bài 6 | $M=1$ (thay $2026=x+1$, các hạng tử khử nhau từng cặp, còn $1$). Máy tính thẳng bằng BigInt với $x=2025$: $M=1$ | Dấu "…" hiểu là dãy tiếp tục cùng quy luật: hệ số $2026$, dấu xen kẽ ($-$ ở luỹ thừa lẻ, $+$ ở luỹ thừa chẵn) từ $x^9$ xuống hệ số tự do — cả hai đầu dãy in trong đề đều khớp quy luật này, không có cách hiểu thứ hai hợp lí |
