# NTL-GKI-2026 — Phần 5 — Pha 1 giải MÙ (trạm soát, 27/10)

Nguồn: `<LV>\anh\t-02.png` (Tiết 20 tại lớp Bài 2–4), `t-03.png` (Bài 5); phóng to 260 dpi `z\soat_p5_bai2-02.png`, `soat_p5_bai34-02.png`, `soat_p5_bai5-03.png`.
Máy kiểm: `<LV>\tam\soat_p5_kiem.mjs` (đồng nhất thức BigInt trên lưới $x\in[-7;7]$, $y\in[-4;4]$) — 12/12 OK.

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề |
|---|---|---|
| Tiết 20 Bài 2a | $x^2+5x+4=(x+1)(x+4)$ (nghiệm $x=-1$) | — |
| Tiết 20 Bài 2b | $x^2-5x+6=(x-2)(x-3)$ (nghiệm $x=2$) | — |
| Tiết 20 Bài 2c | $2x^2-x-15=(x-3)(2x+5)$ (nghiệm $x=3$) | — |
| Tiết 20 Bài 2d | $9x^2-24x+15=3(x-1)(3x-5)$ (đặt 3, nghiệm $x=1$) | — |
| Tiết 20 Bài 2e | $2x^3-5x^2+8x-3=(2x-1)(x^2-2x+3)$ (nghiệm $x=\tfrac12$; $x^2-2x+3=(x-1)^2+2>0$ không phân tích tiếp) | Nghiệm hữu tỉ, không nguyên — nhẩm thử $\pm\tfrac12,\pm\tfrac32$ |
| Tiết 20 Bài 2f | $x^3-7x+6=(x-1)(x-2)(x+3)$ | — |
| Tiết 20 Bài 3a | VT $=x^3-3x^2-3x+9=(x-3)(x^2-3)$ ⇒ $x=3$; $x=\sqrt3$; $x=-\sqrt3$ | Có nghiệm vô tỉ $\pm\sqrt3$ (căn bậc hai lớp 7 — dùng được) |
| Tiết 20 Bài 3b | $3x(x-3)(x^2+3)=0$ ⇒ $x=0$; $x=3$ | — |
| Tiết 20 Bài 3c | $-2x^2+4x+48=0\Leftrightarrow (x-6)(x+4)=0$ ⇒ $x=6$; $x=-4$ | — |
| Tiết 20 Bài 4 | Hình vuông lớn cạnh $x+y$: $x^2$ + $xy$ + $xy$ + $y^2$ = $x^2+2xy+y^2=(x+y)^2$ | Hình: hàng trên cao $x$ (ô vuông $x\times x$ gạch + chữ nhật rộng $y$), hàng dưới cao $y$ (chữ nhật rộng $x$ + ô vuông $y\times y$ gạch) |
| Tiết 20 Bài 5a | Đặt $t=x^2-2x$: $t^2-t-6=(t-3)(t+2)$ ⇒ $(x-3)(x+1)(x^2-2x+2)$ | $x^2-2x+2=(x-1)^2+1>0$ không phân tích tiếp |
| Tiết 20 Bài 5b | $[x(x+3)][(x+1)(x+2)]+1=(x^2+3x)(x^2+3x+2)+1=(x^2+3x+1)^2$, $x^2+3x+1\in\mathbb Z$ ⇒ bằng $|x^2+3x+1|^2$ là bình phương số tự nhiên | Đề định nghĩa "bình phương của số tự nhiên" ⇒ cần nói $\lvert x^2+3x+1\rvert$ hoặc lấy giá trị tuyệt đối |
