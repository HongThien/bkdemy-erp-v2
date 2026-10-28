# TX-GKI-2026 — phần 3 — Pha 1 giải MÙ (trạm soát, 24/10)

Nguồn: `<LV>\anh\t-2.png` (Bài 1a, 1b), `t-3.png` (Bài 1c, 2, 3); phóng to 260 dpi: `<LV>\z\soat_p3_b1ab-2.png`, `soat_p3_b12-3.png`, `soat_p3_b3ad-3.png`.
Máy kiểm: `<LV>\tam\kiem_soat_p3.mjs` (phân số BigInt, vét nghiệm hữu tỉ p/q, |p|≤400, q≤60, bậc bằng sai phân).

| Nhãn | Đáp án / đáp số / hướng (1 dòng) | Ghi chú về đề |
|---|---|---|
| Dạng 3 Bài 1a | Bỏ ngoặc: $3x^2$ triệt tiêu ⇒ $-3x-2=8$ ⇒ $x=-\dfrac{10}{3}$ | Rõ |
| Dạng 3 Bài 1b | $24x^2$ triệt tiêu ⇒ $6x=30$ ⇒ $x=5$ | Rõ |
| Dạng 3 Bài 1c | $6x^2$ triệt tiêu ⇒ $5x=20$ ⇒ $x=4$ | Rõ |
| Dạng 3 Bài 2a | $2x^2-10x-(2x^2+3x-2)=28$ ⇒ $-13x+2=28$ ⇒ $x=-2$ | Rõ |
| Dạng 3 Bài 2b | $(48x^2-32x+5)-(48x^2-19x+1)=81$ ⇒ $-13x+4=81$ ⇒ $x=-\dfrac{77}{13}$ | Rõ (nghiệm xấu nhưng đúng theo đề) |
| Dạng 3 Bài 2c | VT $=6x^2-24x-2$, VP $=6x^2-22x+20$ ⇒ $-2x=22$ ⇒ $x=-11$ | Rõ |
| Dạng 3 Bài 3a | $(x+3)(x-2)=0$ ⇒ $x=-3$ hoặc $x=2$ | Scan mất ngoặc; phóng to: khoảng trống đúng chỗ ⇒ $x(x+3)-2(x+3)=0$ — **khớp khôi phục** |
| Dạng 3 Bài 3b | VT $\equiv 7x^2+\dfrac{13}{4}\ge\dfrac{13}{4}>0$ ⇒ không có $x$ | Scan mất ngoặc; phóng to: khoảng trống trước $2x$, chữ "2" mũ nằm sau khoảng trống sau "1", trước $x^2$ và trước $x-2$ ⇒ $\dfrac{5}{4}(2x+1)^2+2(x^2-4)-5(x-2)=0$ — **khớp khôi phục**. **Đề sai** (vô nghiệm — có thể đề gốc khác số; phần $2(x^2-4)-5(x-2)=(x-2)(2x-1)$ cho thấy dụng ý phân tích nhân tử) |
| Dạng 3 Bài 3c | $(x-2)(5x-3)=0$ ⇒ $x=2$ hoặc $x=\dfrac{3}{5}$ | Scan mất ngoặc ⇒ $5x(x-2)-3(x-2)=0$ — **khớp khôi phục** |
| Dạng 3 Bài 3d | $(x^2-9)(x^3+8)=0$ ⇒ $x=3$, $x=-3$, $x=-2$ | Scan mất ngoặc ⇒ $x^3(x^2-9)-8(9-x^2)=0$ — **khớp khôi phục**; đổi dấu $9-x^2=-(x^2-9)$ |
| Dạng 3 Bài 3e | $x(x^2+4x-21)=x[(x+2)^2-25]=x(x-3)(x+7)=0$ ⇒ $x=0$, $x=3$, $x=-7$ | Rõ (không mất ngoặc); $x^2+4x-21$ phân tích bằng hoàn thành bình phương + hiệu hai bình phương (trong phạm vi TX) |
