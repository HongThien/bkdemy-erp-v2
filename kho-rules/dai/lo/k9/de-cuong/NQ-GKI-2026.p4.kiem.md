# NQ-GKI-2026 · p4 (PHẦN 4 — Dạng 4: Toán nâng cao) — GIẢI MÙ của trạm soát

Nguồn: ảnh `trang/p-3.png` (Dạng 4, Bài 1–2). Script kiểm: `<LV>\tam\soat_mu.mjs` (Bài 1 thử 5000 bộ $(a;b;c)$ dương ngẫu nhiên; Bài 2 thay nghiệm + quét lưới; mọi dòng OK).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 1 | Giá $=k\cdot m^2$ ($k>0$); cắt thành $a,b,c>0$, $a+b+c=m$: tiền $=k(a^2+b^2+c^2)$; $m^2=(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)>a^2+b^2+c^2$ ⇒ **giảm**. $(a-b)^2+(b-c)^2+(c-a)^2\ge0$ ⇒ $3(a^2+b^2+c^2)\ge(a+b+c)^2$ ⇒ tiền $\ge\dfrac{km^2}{3}$, dấu "=" khi $a=b=c=\dfrac m3$ ⇒ **giảm nhiều nhất khi cắt ba phần bằng nhau, giảm 3 lần**. `tu_luan` | Đề in thiếu dấu "?" cuối câu ("giảm bao nhiêu lần") — không ảnh hưởng. |
| Bài 2 | ĐKXĐ $x\ne-4;-5;-6;-7$; $\dfrac1{(x+4)(x+5)}=\dfrac1{x+4}-\dfrac1{x+5}$… ⇒ VT $=\dfrac1{x+4}-\dfrac1{x+7}=\dfrac3{(x+4)(x+7)}$ ⇒ $(x+4)(x+7)=54$ ⇒ $x^2+11x-26=0$ ⇒ $(x-2)(x+13)=0$ ⇒ **$x=2$ hoặc $x=-13$** (đều thoả ĐKXĐ; lưới chỉ ra hai nghiệm). `tu_luan` | — |
