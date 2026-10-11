# NSHM-GKI-2026 — Phần 10 (V. Chủ đề chuyên, Bài 16–20) — trạm soát giải MÙ (Pha 1)

> Giải từ ảnh `trang/p-3.png` TRƯỚC khi mở bản soạn. Kiểm bằng máy (`node -e`, BigInt, vét cạn).

| Nhãn | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 16 | a) $7=2+5=3+4$; $8=3+5$; $9=2+7=4+5$; $10=3+7$ (máy vét: 7 và 9 có 2 cách, 8 và 10 chỉ 1 cách). b) $n$ lẻ: $n=2+(n-2)$, $n-2$ lẻ $\ge 5$. $n=4m$ ($m\ge 2$): $n=(2m-1)+(2m+1)$ — hai số lẻ liên tiếp. $n=4m+2$ ($m\ge 2$): $n=(2m-1)+(2m+3)$ — hai số lẻ hơn kém 4, ước chung chia hết hiệu 4 mà lẻ ⇒ 1. Máy kiểm cách tách đúng mọi $n$ từ 7 tới 100000. | "Hai số nguyên tố cùng nhau lớn hơn 1" = hai số (không nhất thiết nguyên tố) có ƯCLN = 1, mỗi số > 1. Đề đúng. |
| Bài 17 | a) Ghép cặp ước $d\leftrightarrow \dfrac{n}{d}$; 39 lẻ ⇒ có ước $a$ với $a=\dfrac{n}{a}$ ⇒ $n=a^2$. b) 38 ước còn lại ghép 19 cặp, mỗi cặp tích $n$ ⇒ tích các ước $=n^{19}.a=a^{38}.a=a^{39}$. | **ĐỀ IN SAI:** ảnh ghi rõ "Tích các ước của n bằng $a^3$" (phóng to xác nhận số mũ 3). Đúng phải là $a^{39}$. Máy: 5 số nhỏ nhất có 39 ước (36864, 102400, 200704, 495616, 692224) — tích các ước đều $=a^{39}$, không số nào $=a^3$. |
| Bài 18 | Đặt $A=\underbrace{11\dots1}_{50}$ ⇒ $10^{50}=9A+1$, $M=A.10^{50}+A=9A^2+2A$, $N=2A$ ⇒ $M-N=9A^2=(3A)^2=(\underbrace{33\dots3}_{50})^2$. Máy: đúng (BigInt). | Đề đúng. |
| Bài 19 | a) Tổng chữ số $=1+1+1+1+8=12\vdots 3$; mỗi luỹ thừa $10^k$ ($k\ge 3$) $=2^k.5^k\vdots 8$, $8\vdots 8$ ⇒ $A\vdots 8$; $\text{ƯCLN}(3,8)=1$ ⇒ $A\vdots 24$. b) $A$ tận cùng 8, số chính phương không tận cùng 2, 3, 7, 8 ⇒ $A$ không chính phương. Máy: $A \bmod 24=0$, chữ số tận cùng 8. | Đề đúng. (Không được dùng dấu hiệu chia hết cho 8 — k6.md §1 luật 4.) |
| Bài 20 | $\{a;b;c\}=\{2;3;5\}$ (và các hoán vị). Giả sử $a<b<c$: $ab+bc+ca<3bc$ ⇒ $a<3$ ⇒ $a=2$; $bc<2b+2c<4c$ ⇒ $b<4$ ⇒ $b=3$; $6c<6+5c$ ⇒ $c<6$ ⇒ $c=5$. Thử: $30<31$. Máy vét số nguyên tố < 200: chỉ (2,3,5). | Đề đúng. Đáp số là bộ ba ⇒ `tu_luan`. |
