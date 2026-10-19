# TC-GKI-2026 — Phần 2 — Pha 1 giải MÙ (trạm soát, chưa mở bản soạn)

Nguồn: `<LV>\anh\t-1.png` (Bài 1a, 1b) và `t-2.png` (Bài 1c, 1d, Bài 2a–2f), đã phóng to bằng `crop.mjs` để đọc số mũ / ngoặc / dấu.
Kiểm bằng máy: thay 8 bộ số hữu tỉ ngẫu nhiên (phân số BigInt) so biểu thức đề với đáp số — 11/11 khớp (gồm cả hai cách đọc Bài 2c).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Đại Bài 1a | $-xy(2x^3y^4)\left(\dfrac{-5}{4}x^2y^3\right)=\dfrac{5}{2}x^6y^8$; hệ số $\dfrac{5}{2}$, bậc $14$ | — |
| Đại Bài 1b | $5xyz\cdot 4x^3y^2(-2x^5y)=-40x^9y^4z$; hệ số $-40$, bậc $14$ | Đề in dấu chấm "5xyz.4x³y²" = dấu nhân |
| Đại Bài 1c | $-1\dfrac{1}{2}x^3y^2\left(\dfrac{-4}{3}x^2y\right)^2=-\dfrac{3}{2}\cdot\dfrac{16}{9}x^7y^4=-\dfrac{8}{3}x^7y^4$; hệ số $-\dfrac{8}{3}$, bậc $11$ | $-1\dfrac{1}{2}$ là hỗn số $=-\dfrac{3}{2}$ (không phải $-1\cdot\dfrac12$) |
| Đại Bài 1d | $\dfrac{2}{3}x^2\cdot\dfrac{1}{4}xy\cdot\left(\dfrac{1}{2}x^3y\right)^3=\dfrac{1}{48}x^{12}y^4$; hệ số $\dfrac{1}{48}$, bậc $16$ | — |
| Đại Bài 2a | $18x^7:6x^4=3x^3$ | — |
| Đại Bài 2b | $6x^2y^2z^2:3xy=2xyz^2$ | — |
| Đại Bài 2c | Như in (chia trước, cộng sau): $5x^2y^2+9x^3y^4:(-3xy^2)=5x^2y^2-3x^2y^2=2x^2y^2$ | **Hai cách hiểu:** đề in KHÔNG có ngoặc quanh $5x^2y^2+9x^3y^4$ (phóng to xác nhận: chỉ có ngoặc quanh $-3xy^2$). Nếu có ngoặc (như các ý f–i): $(5x^2y^2+9x^3y^4):(-3xy^2)=-3x^2y^2-\dfrac{5}{3}x$. Cách in ra kết quả gọn ⇒ có thể chủ ý đề; vẫn giữ cờ |
| Đại Bài 2d | $8x^6y^7z^2:4x^4y^7=2x^2z^2$ | — |
| Đại Bài 2e | $(-xy)^{10}:(-xy)^5=(-xy)^5=-x^5y^5$ | — |
| Đại Bài 2f | $(5xy-8x^2):x=5y-8x$ ($=-8x+5y$) | — |

Phân loại dự kiến: cả 10 câu `tu_luan` (đáp số là đơn thức / đa thức, không phải MỘT số).
