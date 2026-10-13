# DTD-GKI-2026 — Phần 6 — Pha 1: giải MÙ (trạm soát, 13/10)

Nguồn: `trang/p-5.png` + phóng to 300 dpi (`z/s6_a.png`, `z/s6_b.png`) + lớp chữ `pdftotext`. Kiểm bằng máy: script số hữu tỉ chính xác (BigInt), thay 432 bộ $(x,y,a,b)$; Bài 40 thay $n=-30..30$.
Phạm vi: CHỈ Chương I ⇒ không hằng đẳng thức — $(y-1)(y+1)$ phải nhân từng hạng tử.

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 37a | Bỏ ngoặc: $-5xy^2-10x^2-5+5xy^2+10x^2=-5$ ⇒ $A=-5$, không phụ thuộc biến | Ảnh rõ. Máy: 1 giá trị duy nhất $-5$ |
| Bài 37b | $4x^3y-12xy^3+6x^3+12xy^3-6x^3-4x^3y=0$ ⇒ $B=0$ | Ảnh rõ. Máy: luôn $0$ |
| Bài 38a | $(xy+3x)(y^2-1)=xy^3-xy+3xy^2-3x$; $xy(y-1)(y+1)=xy(y^2-1)=xy^3-xy$ (nhân từng hạng tử); trừ $3xy^2-3x+12$ ⇒ $-12$ | Ảnh rõ. Máy: luôn $-12$ |
| Bài 38b | Theo bản in: biểu thức $=aby^2-aby^4=ab(y^2-y^4)$ — **PHỤ THUỘC $y$** (không phụ thuộc $x$); vd $a=b=1$: $y=1\to0$, $y=2\to-12$, $y=3\to-72$ | **ĐỀ IN SAI.** Ảnh 300 dpi đọc chắc chắn: $-x^2y(a^2+b^2)+(ax^2+by)(ay+bx^2)-ab(x^4+y^4)$ (lớp chữ cũng $x^4\ y^4$). Máy vét các biến thể số mũ 1/2 (mỗi chỗ $y$) và 1–4 (mũ $y$ ở ngoặc cuối): chỉ 2 biến thể ra hằng số — ngoặc cuối $(x^4+y^2)$ ⇒ $0$ (sửa 1 chỗ, khả dĩ nhất) · hoặc mọi $y$ ở 3 chỗ đầu thành $y^2$ ⇒ $0$ |
| Bài 39 | $\dfrac{2}{3}x^2y^3:\left(-\dfrac{1}{3}xy\right)=-2xy^2$; $2x(y-1)(y+1)=2xy^2-2x$; $2(x-2)=2x-4$ ⇒ $A=-4$ với mọi $x,y\ne0$ ⇒ **A luôn ÂM, không dương** | **ĐỀ IN SAI.** Ảnh rõ là $2(x-2)$ (lớp chữ cũng vậy). Máy: luôn $-4$. Nếu là $2(x+2)$ thì $A=4>0$ đúng yêu cầu (sửa 1 dấu) |
| Bài 40a | $A=n^2+5n-(n^2-n-6)=6n+6=6(n+1)$, $n+1\in\mathbb Z$ ⇒ $A\ \vdots\ 6$ | Máy: $A=6(n+1)$ với $n=-30..30$ |
| Bài 40b | $(2n+1)(n^2-3n-1)=2n^3-5n^2-5n-1$ ⇒ $B=-5n^2-5n=5(-n^2-n)$ ⇒ $B\ \vdots\ 5$ | Máy: $B=-5n(n+1)$ |
| Bài 40c | $C=(n^2-1)-(n^2-12n+35)=12n-36=12(n-3)$ ⇒ $C\ \vdots\ 12$ | Máy khớp |
| Bài 40d | $E=(15ab-25a-9b+15)-(15ab-9a-25b+15)=16b-16a=16(b-a)$ | Đề viết $\forall a,b\in\mathbb R$: "chia hết" chỉ có nghĩa khi $a,b$ nguyên; với số thực chỉ nói được $E=16(b-a)$ (là bội của 16 theo nghĩa $E=16\cdot$ một số) |
