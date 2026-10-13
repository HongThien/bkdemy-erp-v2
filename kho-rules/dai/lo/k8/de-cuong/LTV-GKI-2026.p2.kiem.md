# LTV-GKI-2026 — Phần 2 — Pha 1 giải MÙ (trạm soát, 13/10)

Nguồn: `trang/p-2.png`, `p-3.png` + phóng to `goc.pdf` 300 dpi (Bài 6–8) và 600 dpi (7f, 7g, 7i). Tính bằng máy (phân số BigInt, vét nghiệm hữu tỉ $p/q$, $|p|\le 400$, $q\le 40$; bậc đo bằng sai phân hữu hạn).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 6a | Khai triển: $3x^2+10x-8-3x^2-6x+11-4x=3$ ⇒ $P=3$ không phụ thuộc $x$ | Rõ |
| Bài 6b | VT $=3x^3+3x^2y-3xy^2+x^2y+xy^2-y^3-4x^2y-xy^2+y^3=3x^3-3xy^2=3x(x^2-y^2)$ (máy: 3 bộ số khớp) | Rõ |
| Bài 7a | $2x=12\Rightarrow x=6$ | Rõ |
| Bài 7b | $5x^2+4x-6=5x^2-4x\Rightarrow 8x=6\Rightarrow x=\dfrac{3}{4}$ | Rõ |
| Bài 7c | $9x^2-1-9x^2-9x=20\Rightarrow -9x=21\Rightarrow x=-\dfrac{7}{3}$ | Rõ |
| Bài 7d | $-30x-35=16\Rightarrow x=-\dfrac{17}{10}$ | Rõ |
| Bài 7e | $2x+90=55\Rightarrow x=-\dfrac{35}{2}$ | Rõ |
| Bài 7f | Thu gọn: $-2x^2+29x-4=35\Leftrightarrow 2x^2-29x+39=0$ ⇒ $\left(x-\dfrac{29}{4}\right)^2=\left(\dfrac{23}{4}\right)^2$ ⇒ $x=13$ hoặc $x=\dfrac{3}{2}$ | Phóng to 600 dpi: in RÕ đúng như chép (vệt nhỏ sau $(x+3)$ là bẩn scan). Bậc hai, nghiệm hữu tỉ đẹp ⇒ nhiều khả năng đề cố ý (dạng "đưa về tích" của Bài 9 Ch II — ngoài trọng tâm). Thử đổi một hệ số (4→6 trước $(x+1)^2$) ra bậc nhất nhưng $x=\dfrac{37}{33}$ xấu ⇒ không có bản "in đúng" thuyết phục |
| Bài 7g | $x^3-2x^2+2x+11=x^3-9x^2+27x-1\Leftrightarrow 7x^2-25x+12=0$ ⇒ $\left(x-\dfrac{25}{14}\right)^2=\left(\dfrac{17}{14}\right)^2$ ⇒ $x=3$ hoặc $x=\dfrac{4}{7}$ | In RÕ (mũ 3 cả hai lập phương). Bậc hai nghiệm hữu tỉ — như 7f |
| Bài 7h | $(x+4)^3-8=0\Rightarrow (x+4)^3=2^3\Rightarrow x+4=2\Rightarrow x=-2$ | Rõ, đúng phạm vi (lập phương của tổng viết ngược) |
| Bài 7i | $9x^2-12x+4-4x+3=4x^2+4\Leftrightarrow 5x^2-16x+3=0$ ⇒ $\left(x-\dfrac{8}{5}\right)^2=\left(\dfrac{7}{5}\right)^2$ ⇒ $x=3$ hoặc $x=\dfrac{1}{5}$ (đều $\ne 0$) | In RÕ ($4x^2$ vế phải). Nếu vế phải là $9x^2+4$ thì ra $x=\dfrac{3}{16}$ (xấu) ⇒ không chắc là in lỗi; bậc hai nghiệm đẹp — như 7f |
| Bài 8a | Chia: $A(x)=(x+2)(3x^2-8x+21)+m+1985$ ⇒ chia hết $\Leftrightarrow m+1985=0\Leftrightarrow m=-1985$ | Rõ |
| Bài 8b | Chia cho $x^2+4x+4$: thương $2x-4$, dư $(2m+13)x+n+13$ ⇒ $m=-\dfrac{13}{2}$, $n=-13$ (khi đó $A=2(x+2)^2(x-2)$, máy khớp) | Rõ; đề không nói $m,n$ nguyên |
| Bài 8c | Cần $m-2\ge 3$ và $8-m\ge 2$ ($m\in\mathbb N$) ⇒ $m\in\{5;6\}$ (hai hạng tử không đồng dạng với mọi $m$) | Rõ |
| Bài 9 | $f(x)=(x-1)(x-3)q(x)+ax+b$; thay $x=1$: $a+b=4$, $x=3$: $3a+b=14$ ⇒ dư $5x-1$ | Rõ; dư bậc $<2$ nên dạng $ax+b$ — cần nói vì sao |
