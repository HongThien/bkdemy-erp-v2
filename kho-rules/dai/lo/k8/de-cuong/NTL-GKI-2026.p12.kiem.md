# Pha 1 — giải MÙ · NTL-GKI-2026 phần 12 (trạm SOÁT, 27/10)

Nguồn: `<LV>\anh\t-05.png` (Bài 7a, cuối trang), `t-06.png` (Bài 7b–d, Dạng 2 Bài 1–2); phóng 260 dpi: `z\soat_p12_7a-05.png`, `z\soat_p12_7bcd-06.png`, `z\soat_p12_vuon-06.png`, `z\soat_p12_kinh-06.png`.
Máy kiểm: `<LV>\tam\kiem_soat_p12.mjs` (phân số BigInt, 8 bộ số ngẫu nhiên mỗi biểu thức).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề |
|---|---|---|
| Dạng 1 Bài 7a | $A=-6$ (khai triển $(x-1)^3$, $x(x^2-1)$, $(x-1)(x^2+x+1)=x^3-1$, $(x-1)^2$; mọi hạng tử chứa $x$ triệt tiêu) — máy: luôn $-6$ | đọc rõ |
| Dạng 1 Bài 7b | Như in: $(2x+\frac13y)(4x^2-\frac23xy+\frac19y^2)=8x^3+\frac{1}{27}y^3$ ⇒ $B=-\frac{1}{27}y^3$ **còn phụ thuộc $y$** — máy: giá trị thay đổi, $B+\frac{y^3}{27}\equiv0$. Nếu đề là $\frac{1}{27}y^3$ thì $B=0$ | **Đề sai**: ảnh 260 dpi in rõ $\frac{2}{27}y^3$; đúng phải là $\frac{1}{27}y^3$ (khi đó $B=0$). Theo luật 24/10: giải theo số in, ghi "Đề sai" + Lưu ý |
| Dạng 1 Bài 7c | $C=-1$ ($(x-y)^3-(x^3-y^3)+3xy(x-y)-1$, các hạng tử $\mp3x^2y,\pm3xy^2$ triệt tiêu) — máy: luôn $-1$ | đọc rõ |
| Dạng 1 Bài 7d | $D=-59$ ($8x^3-32x-(8x^3+27)+32x-32$) — máy: luôn $-59$ | đọc rõ |
| Dạng 2 Bài 1 | a) $S=5y(2x+3y)-x(x+y)=-x^2+9xy+15y^2$ ; b) $x=5,y=3$: $S=285-40=245\ (\text{m}^2)$ — máy khớp | hình: vườn $5y\times(2x+3y)$, ao $x\times(x+y)$; số thực tế hợp lí (ao $5\times8$ nằm trong vườn $15\times19$) |
| Dạng 2 Bài 2 | Diện tích A $=x^2$, B $=x\cdot1=x$, C $=xy$ (m²). Tổng tấm: A $6$, B $7$, C $11$ ⇒ $T=a(6x^2+7x+11xy)=6ax^2+11axy+7ax$ (đồng) — máy khớp | hình: A $x\times x$, B $x\times1$, C $x\times y$; bảng Lần 1: 2,4,5; Lần 2: 4,3,6 — đọc rõ |
