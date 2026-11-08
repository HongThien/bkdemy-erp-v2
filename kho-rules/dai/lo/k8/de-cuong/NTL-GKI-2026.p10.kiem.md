# NTL-GKI-2026 — phần 10 — Pha 1 giải MÙ (trạm soát)

Nguồn: `anh\t-05.png` (trang 5) + phóng to 260 dpi `z\soat_p10_b4-05.png` (Bài 4, Dạng 1, phần Đại số). Máy kiểm: `<LV>\tam\kiem_soat_p10.mjs` (thay 200 bộ số nguyên BigInt mỗi ý; ý 9 vét phân tích nguyên + nghiệm hữu tỉ).
Phần này toàn Đại (phân tích đa thức thành nhân tử) — không có bài Hình, không có câu tiếng Anh.

| Nhãn | Đáp án / đáp số / hướng (1 dòng) | Ghi chú về đề |
|---|---|---|
| Dạng 1 Bài 4a | $3x^2y-9xy^2+12x^2y^2=3xy(x-3y+4xy)$ (đặt nhân tử chung) | Ảnh rõ |
| Dạng 1 Bài 4b | $3x(x-y)+6x^2(y-x)=3x(x-y)(1-2x)$ (đổi dấu $y-x=-(x-y)$) | Ảnh rõ |
| Dạng 1 Bài 4c | $9(x-y)^2-4(x+y)^2=(x-5y)(5x-y)$ (hiệu hai bình phương) | Ảnh rõ |
| Dạng 1 Bài 4d | $x^3y-x^2y+xy-y=y(x-1)(x^2+1)$ (đặt $y$, nhóm) | Ảnh rõ |
| Dạng 1 Bài 4e | $4x^2-9y^2-4x-6y=(2x+3y)(2x-3y-2)$ (HĐT + nhóm) | Ảnh rõ |
| Dạng 1 Bài 4f | $x^2-z^2+4xy+4y^2=(x+2y-z)(x+2y+z)$ (nhóm thành $(x+2y)^2-z^2$) | Ảnh rõ |
| Dạng 1 Bài 4g | $x^3-4x^2+4x-xy^2=x(x-y-2)(x+y-2)$ | Ảnh rõ |
| Dạng 1 Bài 4h | $2x^2-x-15=(x-3)(2x+5)$ (tách $-x=-6x+5x$) | Ảnh rõ |
| Dạng 1 Bài 4i | Ghép $(x+1)(x+4)$, $(x+2)(x+3)$, đặt $t=x^2+5x+5$ ⇒ $(t-1)(t+1)+8=(x^2+5x+5)^2+7$ — **KHÔNG phân tích tiếp được** (máy: không có nghiệm hữu tỉ, không tách được thành hai tam thức hệ số nguyên; $\ge 7>0$) | **Đề sai (nghi in lỗi hằng số):** với $+8$ đa thức bất khả quy trên $\mathbb{Q}$. Nếu là $-8$ ⇒ $(x^2+5x+2)(x^2+5x+8)$; $+1$ ⇒ $(x^2+5x+5)^2$; $-24$ ⇒ $x(x+5)(x^2+5x+10)$ (máy kiểm cả ba). Ảnh phóng to rõ "+8" — không phải lỗi đọc |
