# GKI-28 — Pha 1: giải MÙ (trạm soát, chưa mở bản soạn)

Đề: THCS Hoàng Hoa Thám (phường Ngọc Hà), giữa kì 1 Toán 8, 2025–2026 · 1 trang · 6 bài tự luận, không có trắc nghiệm, không in đáp án.
Đề đọc từ `trang/p-1.png` + ảnh cắt 300 dpi (`tam/soat-a.png`, `tam/soat-b.png`, `tam/soat-c.png`). Số kiểm bằng `tam/soat-kiem.mjs` (thay số ngẫu nhiên + toạ độ cho bài hình, tất cả OK).

| Nhãn | Đáp án / đáp số / hướng chứng minh | Ghi chú về đề |
|---|---|---|
| Bài 1.1 | $A=-6x^5y^5$ · bậc $10$ · hệ số $-6$ | |
| Bài 1.2 | $A=192$ (với $x=2$, $y=-1$: $-6\cdot 32\cdot(-1)$) | Ý 2 dùng kết quả thu gọn của ý 1 ⇒ không tách |
| Bài 2a | $10a^3b^4-5a^4b^3+a^3b^3$ | |
| Bài 2b | $-xy-1$ | |
| Bài 2c | $4xy-xy^2$ (hay $-xy^2+4xy$) | |
| Bài 3a | $x=-3$ | |
| Bài 3b | $x=\dfrac{1}{2}$ ($x^2$ triệt tiêu, còn $14x=7$) | |
| Bài 3c | $x=0$ hoặc $x=\dfrac{4}{3}$ (vế trái trừ $4$ còn $3x^2-4x=x(3x-4)$) | $x^2$ KHÔNG triệt tiêu ⇒ phải đặt $x$ làm thừa số chung và dùng "tích bằng $0$"; hai giá trị ⇒ `tu_luan` |
| Bài 4a | $43\ \text{m}^2$ ($28+8+4+3$) | |
| Bài 4b | $A-B=4x^2y+3xy^2+2\ (\text{m}^2)$ | Chung dữ kiện $A$, $B$ ⇒ không tách |
| Bài 5.1 | $HG=EF=40$ m (cạnh đối hình bình hành) · $EG=2EM=72$ m · $HF=2HM=32$ m (hai đường chéo cắt nhau tại trung điểm mỗi đường) | Đề cho hình (ảnh công trình kính) |
| Bài 5.2a | $ADHE$ là hình chữ nhật: $\widehat{A}=\widehat{D}=\widehat{E}=90^\circ$ ⇒ góc thứ tư $=360^\circ-270^\circ=90^\circ$ ⇒ bốn góc vuông (định nghĩa) — hoặc hình bình hành ($AD\parallel HE$, $AE\parallel DH$) có một góc vuông | "Tứ giác có ba góc vuông" không phải dấu hiệu ⇒ đi qua tổng bốn góc |
| Bài 5.2b | $DH\parallel AE$, $DH=AE$ (cạnh đối hình chữ nhật $ADHE$); $K$ thuộc đường thẳng $AE$, $EK=AE$ ⇒ $DH\parallel EK$, $DH=EK$ ⇒ $DHKE$ là hình bình hành (một cặp cạnh đối song song và bằng nhau) | |
| Bài 5.2c | $O=AH\cap DE$: $OA=OE$ (đường chéo hình chữ nhật) ⇒ $\widehat{OEA}=\widehat{OAE}=\widehat{HAC}$. $AM=\dfrac{1}{2}BC=MC$ (trung tuyến ứng cạnh huyền) ⇒ $\widehat{MAC}=\widehat{C}$. $\widehat{HAC}+\widehat{C}=90^\circ$ ($\triangle AHC$ vuông tại $H$) ⇒ $\widehat{QEA}+\widehat{QAE}=90^\circ$ ⇒ $\widehat{AQE}=90^\circ$ | Kiểm toạ độ 3 bộ: $\overrightarrow{QA}\cdot\overrightarrow{QE}=0$. Cần trung tuyến ứng cạnh huyền (bài Hình chữ nhật) — đề đã hỏi hình chữ nhật ở ý a nên dùng được |
| Bài 6 | Lớn nhất $4050\ \text{m}^2$, khi hai cạnh vuông góc với tường dài $45$ m, cạnh song song với tường dài $90$ m. $S=x(180-2x)=4050-2(x-45)^2\le 4050$ | Các bài 1–4 chỉ ở Chương I; không câu nào khác của đề chạm hằng đẳng thức. Trong phạm vi Chương I vẫn làm được: kiểm $2(x-45)(x-45)=2x^2-180x+4050$ bằng nhân đa thức rồi viết $S=4050-2(x-45)(x-45)$. $90>45$ ⇒ đúng "chiều dài song song với bờ tường" |
