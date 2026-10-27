# TX-GKI-2026 — Phần 2 — Pha 1 giải MÙ (trạm soát, chưa mở bản soạn)

Nguồn: `<LV>\anh\t-2.png` + phóng to 260 dpi trang 2 (`z\soat_p2_b678-2.png`, `z\soat_p2_hdt-2.png`). Máy kiểm: `<LV>\tam\soat_p2_kiem.mjs` (đồng nhất thức trên 20 bộ số hữu tỉ ngẫu nhiên, BigInt cho 3.3) — tất cả đúng.

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề |
|---|---|---|
| Dạng 1 Bài 6 | a) $A=4n^2+4n-3$, $B=4n^2-n-8$, $Q=5n+5$; b) $Q=5(n+1)$, $n$ nguyên ⇒ $n+1$ nguyên ⇒ $Q\vdots 5$ | — |
| Dạng 1 Bài 7 | a) $M=\dfrac{3}{2}x^2y^4+1$; b) $M=\dfrac{5}{2}$; c) $x^2y^4=x^2(y^2)^2\ge 0$ ⇒ $M\ge 1>0$ | Đề in hai lần "b)" — ý thứ ba là c) |
| Dạng 1 Bài 8 | a) $25+4-1=28$; b) $(x^2-9)^2\ge0$, $\lvert y-3\rvert\ge0$ ⇒ giá trị $\ge -1$, dấu "=" khi $x=\pm3$, $y=3$ ⇒ GTNN $=-1$; không có GTLN (biểu thức lớn tuỳ ý, vd $y\to$ lớn) | Đề sai: biểu thức có $\lvert y-3\rvert$ nên KHÔNG phải đa thức; "lớn nhất (hoặc nhỏ nhất)" — chỉ GTNN tồn tại |
| Dạng 2 Bài 1 | a) $A=6x-13$; b) $A=-19$; c) $B=2$ (không phụ thuộc $x$); d) $C=15-6x=13\Rightarrow x=\dfrac{1}{3}$ | — |
| Dạng 2 Bài 2 | a) $M=2x^2+8y^2$; b) $M=2(x^2+4y^2)=20$; c) $N=(x-2)^2+(y+3)^2+2\ge 2$, GTNN $=2$ khi $x=2$, $y=-3$ | — |
| Dạng 2 Bài 3.1 | a) $M=(a+b)^2-2ab=25$; b) $N=(a+b)^3-3ab(a+b)=343-252=91$ | — |
| Dạng 2 Bài 3.2 | $a^3-b^3=(a-b)^3+3ab(a-b)=1+3ab$ (hoặc $(a-b)(a^2+ab+b^2)=a^2-2ab+b^2+3ab=(a-b)^2+3ab$) | — |
| Dạng 2 Bài 3.3a | Nhân thêm $(2-1)=1$, dùng $(a-b)(a+b)=a^2-b^2$ liên tiếp ⇒ tích $=2^{64}-1$ ⇒ kết quả $-1$ (máy BigInt: $-1$) | Đề in "…": thừa số theo quy luật $2^{2^k}+1$, $k=0..5$ |
| Dạng 2 Bài 3.3b | Nhân tích với $(5-3)=2$ ⇒ $5^{128}-3^{128}$ ⇒ tích $=\dfrac{5^{128}-3^{128}}{2}$ ⇒ kết quả $5^{128}-3^{128}$ (máy BigInt khớp) | Đề in "…": thừa số $5^{2^k}+3^{2^k}$, $k=0..6$ |
