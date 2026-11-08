# NTL-GKI-2026 — phần 13 (Dạng 3. Nâng cao, Đại) — Pha 1 giải MÙ (trạm soát)

Nguồn: `<LV>\anh\t-06.png` (Bài 1–4), `t-07.png` (Bài 5); phóng to 260 dpi `<LV>\z\soat_p13_t6-06.png`, `soat_p13_t7-07.png` — đọc rõ, không chỗ mờ.
Máy kiểm: `<LV>\tam\soat_p13_kiem.mjs` (số hữu tỉ BigInt, 20 bộ ngẫu nhiên mỗi đồng nhất thức + điểm dấu "=") ⇒ ✔ mọi đồng nhất thức đúng.
Phần này toàn Đại, không có bài Hình, không có câu tiếng Anh.

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề |
|---|---|---|
| Dạng 3 Bài 1a | $4x^2-2x+5=\left(2x-\dfrac{1}{2}\right)^2+\dfrac{19}{4}\ge\dfrac{19}{4}$ ⇒ GTNN $=\dfrac{19}{4}$ khi $x=\dfrac{1}{4}$ (không có GTLN) | Đề ghi chung "lớn nhất (nhỏ nhất)" — hệ số $x^2$ dương ⇒ ý a hỏi GTNN |
| Dạng 3 Bài 1b | $(1-x)(3x+4)=-3x^2-x+4=-3\left(x+\dfrac{1}{6}\right)^2+\dfrac{49}{12}\le\dfrac{49}{12}$ ⇒ GTLN $=\dfrac{49}{12}$ khi $x=-\dfrac{1}{6}$ | Hệ số $x^2$ âm ⇒ GTLN |
| Dạng 3 Bài 1c | $-x^2-y^2-x+y+1=-\left(x+\dfrac{1}{2}\right)^2-\left(y-\dfrac{1}{2}\right)^2+\dfrac{3}{2}\le\dfrac{3}{2}$ ⇒ GTLN $=\dfrac{3}{2}$ khi $x=-\dfrac{1}{2}$, $y=\dfrac{1}{2}$ | GTLN |
| Dạng 3 Bài 1d | $x^2-2xy+6y^2-12x+2y+45=(x-y-6)^2+5(y-1)^2+4\ge4$ ⇒ GTNN $=4$ khi $y=1$, $x=7$ | GTNN; đề gõ chữ đứng "x² - 2xy…" (khác phông) — không ảnh hưởng |
| Dạng 3 Bài 2 | $(x+y)^2+(y-5)^2=0$ ⇒ $y=5$, $x=-5$ ⇒ $A=0^{2024}+(-1)^{2025}+(-1)^{2026}+2024=2024$ | — |
| Dạng 3 Bài 3 | $x^3+y^3+z^3-3xyz=(x+y+z)\cdot\dfrac{1}{2}\left[(x-y)^2+(y-z)^2+(z-x)^2\right]=0$, ngoặc $>0$ (đôi một khác nhau) ⇒ $x+y=-z$ ⇒ $M=z^2-z^2+2024=2024$ | Hằng đẳng thức $a^3+b^3+c^3-3abc$ nằm trong phạm vi NTL (bài về nhà e*) |
| Dạng 3 Bài 4 | $a^2(b+c)-b^2(c+a)=(a-b)(ab+bc+ca)=0$, $a\ne b$ ⇒ $ab+bc+ca=0$; $a^2(b+c)-c^2(a+b)=(a-c)(ab+bc+ca)=0$ ⇒ $c^2(a+b)=a^2(b+c)=2012$ | Giả thiết tồn tại thật (vd $a=t$, $b=2t$, $c=-\tfrac{2}{3}t$ co giãn) |
| Dạng 3 Bài 5 | $c=-a-b$: $a^2+b^2+c^2=2(a^2+ab+b^2)$, $a^4+b^4+c^4=2(a^2+ab+b^2)^2$ ⇒ VT $=4(a^2+ab+b^2)^2=$ VP. (Cách khác: $a^2+b^2+c^2=-2(ab+bc+ca)$, $(ab+bc+ca)^2=a^2b^2+b^2c^2+c^2a^2$) | — |
