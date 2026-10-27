# NTL-GKI-2026 · Phần 11 — lượt giải MÙ (trạm soát, Pha 1)

Nguồn: `<LV>\anh\t-05.png` (trang 5, Đề cương tuần 8 — Phần 1 Đại số, II. Tự luận, Dạng 1 Bài 5–6), phóng to 260 dpi `z\soat_p11_a-05.png`, `z\soat_p11_b-05.png`.
Máy kiểm: `<LV>\tam\soat_p11_kiem.mjs` (phân số BigInt; Bài 5 vét nghiệm hữu tỉ $p/q$, $|p|\le 60$, $q\le 12$; Bài 6 so VT − VP tại 6 bộ số hữu tỉ).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề |
|---|---|---|
| Dạng 1 Bài 5a | $-2x^2+6x+2x^2-x=10\Rightarrow 5x=10\Rightarrow x=2$ | Đề gõ chữ thường "-2x(x-3) + x(2x-1) =10" (font khác) — đọc rõ |
| Dạng 1 Bài 5b | $(2x-x+1)(2x+x-1)=0\Rightarrow(x+1)(3x-1)=0\Rightarrow x=-1$ hoặc $x=\dfrac{1}{3}$ | — (cần hiệu hai bình phương + $A\cdot B=0$, trong phạm vi NTL) |
| Dạng 1 Bài 5c | $x^3+8-x^3-2x=15\Rightarrow -2x=7\Rightarrow x=-\dfrac{7}{2}$ | — |
| Dạng 1 Bài 5d | $3x^2+4x^2-4-7x^2+7x=x+12\Rightarrow 6x=16\Rightarrow x=\dfrac{8}{3}$ | — |
| Dạng 1 Bài 5e | $(x+1)^3-(x-1)^3=6x^2+2$; $6x^2+2-6x^2+12x-6=-10\Rightarrow 12x=-6\Rightarrow x=-\dfrac{1}{2}$ | — |
| Dạng 1 Bài 5f | $x^3-27+x(4-x^2)=1\Rightarrow 4x-27=1\Rightarrow x=7$ | — |
| Dạng 1 Bài 5g | $x(x^3-3x^2+3x-1)=x(x-1)^3=0\Rightarrow x=0$ hoặc $x=1$ | — |
| Dạng 1 Bài 5h | $(x-1)(x-2)=0\Rightarrow x=1$ hoặc $x=2$ (tách hạng tử $-3x=-x-2x$) | — |
| Dạng 1 Bài 6a | **Đẳng thức như đề in là SAI**: tại $x=2$ VT $=5\cdot3\cdot7=105$, VP $=63$. Đúng phải là $(x+1)(x^2-x+1)(x^3-1)=(x^3+1)(x^3-1)=x^6-1$ (máy: VT − VP ≡ 0) | **Đề sai**: in $(x^2+1)$, đúng là $(x+1)$ (in lỗi số mũ) |
| Dạng 1 Bài 6b | $(a^6-3a^3+9)(a^3+3)=a^9+27$; $(a^9+27)(a^9-27)=a^{18}-729$ | — |
| Dạng 1 Bài 6c | $(x^2+y^2)(x^4+2x^2y^2+y^4-3x^2y^2)=(x^2+y^2)(x^4-x^2y^2+y^4)=x^6+y^6$ (tổng hai lập phương) | — |
| Dạng 1 Bài 6d | $(x^2-xy+y^2)(x^2+xy+y^2)=(x^2+y^2)^2-x^2y^2=x^4+x^2y^2+y^4$; nhân $(x^2-y^2)$ ⇒ $x^6-y^6$ (hiệu hai lập phương) | — |
