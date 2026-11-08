KẾT LUẬN: ĐẠT

# NTL-GKI-2026 — phần 13 (Đề cương tuần 8 — Dạng 3. Nâng cao, Đại) — biên bản trạm SOÁT (Opus, giải mù 2 pha)

- **Số câu:** 8 (Dạng 3 Bài 1a, 1b, 1c, 1d, 2, 3, 4, 5) — 3 trả lời ngắn (1d = 4 · Bài 2 = 2024 · Bài 3 = 2024) · 5 tự luận.
- **Khớp Pha 1 ngay từ đầu:** 8/8 đáp số / hướng chứng minh (Pha 1: `NTL-GKI-2026.p13.kiem.md`; máy kiểm `<LV>\tam\soat_p13_kiem.mjs`, số hữu tỉ BigInt, 20 bộ ngẫu nhiên mỗi đồng nhất thức + điểm dấu "=").
- **Câu phải sửa:** 3/8 — **0 câu sửa vì lỗi toán**, 3 câu **chỉ sửa trình bày** (lời Phần 1 / Phần 2 thừa). Bản trước khi sửa: `NTL-GKI-2026.p13.soan.goc.md`.
- **Đề chép:** đối chiếu ảnh `t-06.png`, `t-07.png` + phóng to 260 dpi (`<LV>\z\soat_p13_t6-06.png`, `soat_p13_t7-07.png`) — 8/8 đúng (số, số mũ 2024/2025/2026, dấu, ngoặc).
- **Kiến thức:** đúng phạm vi NTL (Chương I + II, hằng đẳng thức, phân tích nhân tử, $a^3+b^3+c^3-3abc$ có trong đề cương). Không đường trung bình / Thalès / Pythagore / phân thức / phương trình / Vi-ét.
- **Phân loại:** đúng luật (1a, 1b, 1c đáp số phân số ⇒ tự luận; 1d, 2, 3 một số ≤ 4 kí tự ⇒ TLN; 4, 5 chứng minh).
- **Luật trình bày Hình 7·8·9:** không áp — phần này không có bài Hình. **Câu tiếng Anh:** không có trong phần này.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (8 câu · 3 TLN · 5 tự luận · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao | Lỗi toán / chỉ trình bày |
|---|---|---|---|---|
| Dạng 3 Bài 1b | lập luận (lời Phần 1) | Bước 4: "nhân với $-3$ nên đổi chiều bất đẳng thức" ⇒ "tích của số âm $-3$ với một số không âm là số không dương, nên biểu thức bị chặn trên". **Chú ý:** "số bớt ra ngoài ngoặc là $-3\cdot\frac{1}{36}$" ⇒ "thêm $\frac{1}{36}$ trong ngoặc thì thực chất cộng thêm $-3\cdot\frac{1}{36}$, nên bên ngoài phải cộng lại $3\cdot\frac{1}{36}$" | Quy tắc "nhân số âm đổi chiều bất đẳng thức" là bài Bất đẳng thức (sau lớp 8) — dùng quy tắc dấu của tích (lớp 6–7) là đủ; câu Chú ý cũ nói "bớt $-3\cdot\frac{1}{36}$" dễ hiểu ngược dấu so với dòng Phần 2 ($+3\cdot\frac{1}{36}$) | Chỉ trình bày (Phần 2 và đáp số đúng) |
| Dạng 3 Bài 3 | định dạng (Phần 2 thừa) | Bỏ dòng ngoặc cuối Phần 2 "(Bộ số thoả mãn đề có tồn tại, chẳng hạn $x=1,y=2,z=-3$…)" | Phần 2 = đúng cái HS viết vào bài; kiểm tồn tại là ghi chú cho người duyệt (đã có ở mục GHI CHÚ CHO NGƯỜI DUYỆT). Ví dụ đúng (đã kiểm $1+8-27=-18=3\cdot1\cdot2\cdot(-3)$) | Chỉ trình bày |
| Dạng 3 Bài 4 | lời Phần 1 | Mấu chốt: "…trong đó $ab+bc+ca$ là điều cần tìm" ⇒ "hiệu đó phân tích được thành $(a-b)(ab+bc+ca)$, và hệ thức $ab+bc+ca=0$ suy ra từ đó là chìa khoá để tính $c^2(a+b)$" | Câu cũ nói sai đối tượng (điều cần chứng minh là $c^2(a+b)=2012$, không phải $ab+bc+ca$) | Chỉ trình bày |

## Kiểm kỹ bằng máy (Dạng 3 nâng cao)

| Câu | Đã kiểm |
|---|---|
| 1a | $4x^2-2x+5\equiv\left(2x-\frac12\right)^2+\frac{19}{4}$; giá trị tại $x=\frac14$ đúng $\frac{19}{4}$ |
| 1b | $(1-x)(3x+4)\equiv-3\left(x+\frac16\right)^2+\frac{49}{12}$ |
| 1c | $\equiv-\left(x+\frac12\right)^2-\left(y-\frac12\right)^2+\frac32$ |
| 1d | $\equiv(x-y-6)^2+5(y-1)^2+4$; giá trị tại $(7;1)$ đúng $4$ |
| 2 | $\equiv(x+y)^2+(y-5)^2$; $A$ tính BigInt tại $(-5;5)$ = 2024 |
| 3 | HĐT $x^3+y^3+z^3-3xyz$; với $x+y+z=0$ thì $M\equiv2024$ |
| 4 | $a^2(b+c)-b^2(c+a)\equiv(a-b)(ab+bc+ca)$, $a^2(b+c)-c^2(a+b)\equiv(a-c)(ab+bc+ca)$; giả thiết có bộ thực đôi một khác nhau (vd $a=1,b=2,c=-\frac23$ co giãn) |
| 5 | với $c=-a-b$: $(a^2+b^2+c^2)^2\equiv2(a^4+b^4+c^4)$; thêm $a^2+b^2+c^2=-2(ab+bc+ca)$, $(ab+bc+ca)^2=\sum a^2b^2$ |

Mọi dòng biến đổi của Phần 2 (1b dòng $+3\cdot\frac{1}{36}+4$, 1d dòng nhóm $(x^2+y^2+36-2xy-12x+12y)+5y^2-10y+9$, Bài 4 dòng nhóm $ab(a-b)+c(a-b)(a+b)$, Bài 5 khai triển $(a+b)^4$ và $(a^2+ab+b^2)^2$) đã đối chiếu tay với đồng nhất thức máy — đúng.

## Đề sai / Chưa chắc

Không có. (Ghi chú "đề in GTLN (GTNN) chung" của Bài 1 giữ — đã xác định đúng: 1a, 1d GTNN; 1b, 1c GTLN.)
