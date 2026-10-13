# NS-GKI-2026 · Phần 1 (A. Đại số — Bài 1, Bài 2) · PHA 1 giải MÙ của trạm soát

> Giải độc lập từ ảnh `trang/p-1.png` (phóng to 260 dpi: `z/p1_b1.png`, `z/p1_b2.png`), CHƯA mở bản soạn.
> Tính bằng `tam/mu_p1.mjs` (phân số chính xác BigInt): thay nghiệm vào ĐỀ GỐC, kiểm phép thu gọn bằng 3000 bộ số ngẫu nhiên, quét lưới tìm nghiệm sót.

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 1a | $(x;y)=(4;-3)$ — cộng hai phương trình: $5x=20$ | Rõ |
| Bài 1b | $(x;y)=(5;3)$ — nhân 10 khử thập phân: $3x+5y=30$; $15x-20y=15$ (hay $3x-4y=3$), trừ: $9y=27$ | Rõ; số thập phân dấu phẩy $0{,}3$; $0{,}5$; $1{,}5$ |
| Bài 1c | Vô số nghiệm — hai phương trình cùng là $x-3y=-4$; nghiệm tổng quát $(3y-4;\,y)$ với $y$ tuỳ ý (hay $\left(x;\dfrac{x+4}{3}\right)$) | Rõ |
| Bài 1d | $(x;y)=(2;3)$ — cộng: $3x=6$ | Rõ |
| Bài 1e | $(x;y)=(3;-1)$ — nhân 3 và nhân 2 rồi trừ: $5x=15$ | Nhãn in "c)" lần hai (mờ nét chữ e) — là ý e |
| Bài 1f | $(x;y)=(-2;2)$ — trừ: $-8y=-16$ | Rõ |
| Bài 1g | $(x;y)=\left(\dfrac52;1\right)$ — nhân 4 và nhân 5 rồi cộng: $46x=115$ | Rõ; nghiệm $x$ là phân số, đề in đúng |
| Bài 1h | Vô nghiệm — nhân phương trình thứ nhất với $-2$: $-2x+6y=-10$, mâu thuẫn với $-2x+6y=10$ ($0x+0y=20$) | Rõ |
| Bài 2b | $(x;y)=\left(1;-\dfrac12\right)$ — ĐK $x\ne0$, $y\ne0$; $u=\dfrac1x$, $v=\dfrac1y$: $u=1$, $v=-2$ | Rõ |
| Bài 2c | $(x;y)=\left(-\dfrac{30}{11};\dfrac{8}{31}\right)$ — ĐK $x\ne-2$, $y\ne0$; $u=\dfrac1{x+2}$, $v=\dfrac1y$: $u=-\dfrac{11}{8}$, $v=\dfrac{31}{8}$ | Đã phóng to: hệ số in rõ $7$; $3$; $2$ và $1$; $1$; $\dfrac52$ — không có nét mờ / nghi in sai. Nghiệm xấu nhưng thoả đề (kiểm phân số chính xác); hệ theo $u,v$ là bậc nhất nên nghiệm duy nhất |
| Bài 2d | $(x;y)=\left(-\dfrac14;1\right)$ — thu gọn: $4x+9y=8$; $-8x+3y=5$ | Rõ |
| Bài 2e | $(x;y)=(12;5)$ — khai triển, $xy$ triệt tiêu: $x-2y=2$; $-2x+8y=16$ (hay $-x+4y=8$) | Rõ |
| Bài 2f | $(x;y)=\left(\dfrac{37}{5};\dfrac{31}{5}\right)$ — khai triển, $xy$ triệt tiêu: $x-2y=-5$; $3x-y=16$ | Đã phóng to: các số $1,2,1,3$ và $5,4,4,1$ in rõ. Nghiệm phân số nhưng thoả đề gốc |

Bài 2a: đề cương in thiếu vế phải của phương trình thứ nhất (xác nhận trên ảnh phóng to: $\dfrac{x+y}{2}+\dfrac{x-y}{4}$ rồi hết) — người gõ không nhập là đúng.
