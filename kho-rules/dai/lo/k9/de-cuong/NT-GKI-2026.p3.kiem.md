# NT-GKI-2026 · P3 — giải MÙ (trạm soát, Opus) · 21/10

Nguồn: ảnh `trang/p-05.png` (Bài 2, 6 phương trình 1)–6) ⇒ ý a–f). Script kiểm: `<LV>\tam\soat_p3.mjs` (thay nghiệm vào đề + quét lưới $[-20;20]$ bước $0{,}001$ tìm đổi dấu, bỏ điểm mẫu bằng 0).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 2a | ĐKXĐ $x\ne-1$, $x\ne2$; khử mẫu $(x-2)+5(x+1)=3x$ ⇒ $3x=-3$ ⇒ $x=-1$ (loại) ⇒ **vô nghiệm** · `tu_luan` | Ảnh rõ. Vế trái rút gọn được thành $\dfrac{3}{x-2}\ne0$ — quét lưới không có đổi dấu. |
| Bài 2b | ĐKXĐ $x\ne\dfrac32$; mẫu chung $10(2x-3)$: $10(2x+3)-15=4(2x-3)$ ⇒ $12x=-27$ ⇒ $x=-\dfrac94$ (thoả) · `tu_luan` (phân số) | Ảnh rõ: $\dfrac{2x+3}{2x-3}-\dfrac{3}{4x-6}=\dfrac25$. |
| Bài 2c | ĐKXĐ $x\ne\pm1$; vế phải $=\dfrac{x^2-3}{x^2-1}$; $(x+1)^2-4(x-1)=x^2-3$ ⇒ $-2x=-8$ ⇒ $x=4$ (thoả) · `tra_loi_ngan` `4` | Ảnh rõ: vế phải $\dfrac{3-x^2}{1-x^2}$. |
| Bài 2d | ĐKXĐ $x\ne\pm3$; $(x+3)^2-(x-3)^2=-48$ ⇒ $12x=-48$ ⇒ $x=-4$ (thoả) · `tra_loi_ngan` `-4` | Ảnh rõ: vế phải $\dfrac{48}{9-x^2}$. |
| Bài 2e | ĐKXĐ $x\ne1$ ($x^2+x+1>0$ mọi $x$); $x^2+x+1+2x^2-5=4(x-1)$ ⇒ $3x(x-1)=0$ ⇒ $x=0$ (thoả), $x=1$ (loại) · `tra_loi_ngan` `0` | Ảnh rõ: $\dfrac{1}{x-1}+\dfrac{2x^2-5}{x^3-1}=\dfrac{4}{x^2+x+1}$. |
| Bài 2f | ĐKXĐ $x\ne1$, $x\ne-3$ ($x^2+2x-3=(x-1)(x+3)$); $2x(x+3)+4=(2x-5)(x-1)$ ⇒ $13x=1$ ⇒ $x=\dfrac1{13}$ (thoả) · `tu_luan` (phân số) | Ảnh rõ. |
