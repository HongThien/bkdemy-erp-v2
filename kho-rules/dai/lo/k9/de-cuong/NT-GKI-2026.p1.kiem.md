# NT-GKI-2026 · P1 — giải MÙ của trạm soát (Pha 1, chưa mở bản soạn)

Nguồn: ảnh `trang\p-04.png` (Ví dụ 1) · `p-05.png` (Ví dụ 2) · `p-06.png`, `p-07.png` (Ví dụ 3) · `p-08.png`, `p-09.png` (Ví dụ 5).
Kiểm bằng máy: `<LV>\tam\kiem_p1_soat.mjs` (thay nghiệm vào đề, quét lưới $[-100;100]$ bước $0{,}001$, kiểm phân tích nhân tử, `Math.atan`/`asin`/`acos` theo độ) — tất cả OK.

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 1a | $x(x-4)-3x+12=0$ ⇒ $x(x-4)-3(x-4)=0$ ⇒ $(x-4)(x-3)=0$ ⇒ $x=4$; $x=3$ — `tu_luan` (hai nghiệm) | Không. Lời giải mẫu đề cương cùng đáp số. |
| Bài 1b | ĐKXĐ $x\ne-1$, $x\ne2$; khử mẫu $2(x-2)+(x+1)=3$ ⇒ $3x=6$ ⇒ $x=2$ (không thoả ĐKXĐ) ⇒ vô nghiệm — `tu_luan` | Không. Lời giải mẫu cùng kết luận. |
| Bài 2 | Thế $x=3-2y$ vào $6x+y=7$ ⇒ $11y=11$ ⇒ $y=1$, $x=1$ ⇒ nghiệm duy nhất $(x;y)=(1;1)$ — `tu_luan` | Không. Lời giải mẫu dùng dấu chấm làm dấu nhân ($6.(3-2y)$) — không chép. |
| Bài 3 | Gọi $x$ (sản phẩm/ngày theo kế hoạch, $x\in\mathbb{N}^*$): $\dfrac{120}{x}-\dfrac{128}{x+4}=2$ ⇒ $x^2+8x-240=0$ ⇒ $(x-12)(x+20)=0$ ⇒ $x=12$ (loại $-20$) — `tra_loi_ngan`, `dap_an=12` | Không. Thử lại: kế hoạch $10$ ngày; thực tế $16$ sp/ngày $\cdot 8$ ngày $=128$ sp, sớm $2$ ngày. Lời giải mẫu cùng $12$. |
| Bài 4 | Pythagore $BC=5$; $\sin B=\dfrac45$ (hoặc $\tan B=\dfrac43$) ⇒ $\widehat B\approx53^\circ$ ($53{,}13^\circ$); $\widehat C=90^\circ-\widehat B\approx37^\circ$ ($36{,}87^\circ$) — `tu_luan` | Yêu cầu "làm tròn số đo góc theo độ" chỉ in ở mục "Xác định yêu cầu" của bảng hướng dẫn, không ở câu đề. Lời giải mẫu cùng đáp số; mẫu dùng $\sin C=\dfrac{AB}{BC}$ tính riêng $\widehat C$ (được). |
