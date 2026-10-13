KẾT LUẬN: ĐẠT

# Biên bản soát — LTV-GKI-2026 · phần 3 (Bài 10–19)

- Trạm soát: Opus, 2 pha (Pha 1 giải mù ⇒ `LTV-GKI-2026.p3.kiem.md`, kiểm bằng `<LV>\tam\soat_mu_p3.mjs`; Pha 2 soát bản soạn). Bản gốc trước khi sửa: `LTV-GKI-2026.p3.soan.goc.md`.
- **Số câu:** 13 (5 trả lời ngắn: 12a = 136 · 12b = 81 · 12c = −180 · 15 = −1 · 18 = 0; 8 tự luận).
- **Khớp Pha 1 ngay từ đầu:** 13/13 đáp số / kết luận (10c $85\ \text{m}^2$ · 11 $1120\ \text{m}^2$, $112\,000\,000$ đồng · 19 $M=2^{2025}$ …).
- **Đề:** chép đúng ảnh cả 13 câu (đã phóng to 220 dpi Bài 12, 14–19). Bài 13 giữ dòng `Ghi chú` của người gõ (bỏ chữ "và" thừa).
- **Phân loại:** đúng (Bài 10, 11 nhiều ý ⇒ `tu_luan`; Bài 19 đáp số $2^{2025}$ ⇒ `tu_luan`).
- **Số câu phải sửa:** 2 (cả hai lỗi kiến thức theo phạm vi LTV; không đổi đáp số nào).
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 13 (ý a) | kiến thức | Phần 2 ý a: bỏ cách xét hiệu rồi **nhóm** $x^2-y^2+xz-yz=(x-y)(x+y)+z(x-y)=(x-y)(x+y+z)$; thay bằng $z=-(x+y)$, khai triển cả ba biểu thức ra cùng $x^2+xy+y^2$. Phần 1 Bước 2, 3 và dòng Chú ý viết lại theo cách mới | Phụ lục LTV cấm các phương pháp phân tích nhân tử của Bài 9 (nhóm hạng tử…); lời giải cũ đúng toán nhưng là đúng phương pháp nhóm để làm xuất hiện nhân tử $x+y+z$. Cách thay biến chỉ dùng nhân đa thức + bình phương một tổng |
| Bài 19 | kiến thức (HĐT ngoài danh sách, dùng ngầm) | Phần 2: $(x-2y-2)^2$ không còn ghi thẳng kết quả khai triển, mà viết $[(x-2y)-2]^2=(x-2y)^2-4(x-2y)+4=x^2-4xy+4y^2-4x+8y+4$; dòng nhóm sau đó sắp lại cho khớp. Phần 1 Bước 2 nói rõ cách khai triển | Bình phương của ba số hạng không nằm trong danh sách hằng đẳng thức đã học (chỉ bình phương một tổng / hiệu hai số); phải đưa về bình phương một hiệu hai lần |

## Soát kĩ các bài nâng cao (hằng đẳng thức dùng ở từng bước)

| Bài | Hằng đẳng thức / kĩ thuật trong lời giải | Nhận xét |
|---|---|---|
| 12b | lập phương một hiệu (viết ngược chiều) | Đúng — không dùng $x^3-y^3=(x-y)(x^2+xy+y^2)$ |
| 13b | lập phương một tổng, $x+y=-z$ | Đúng — không dùng $a^3+b^3+c^3-3abc=(a+b+c)(\dots)$ |
| 14 | $(a+b)^5$ tính bằng NHÂN $(a+b)^2(a+b)^3$; $(a+b)(a^2+ab+b^2)$ kiểm bằng nhân tay; $c^2=(a+b)^2$ | Đúng — không dùng tổng hai lập phương; từng dòng khai triển đã kiểm bằng máy |
| 15 | bình phương một hiệu; "tổng các bình phương bằng 0 thì từng số bằng 0" | Đúng |
| 16a | hiệu hai bình phương (ngược chiều) + đặt thừa số chung; tích hai số nguyên liên tiếp chia hết cho 2, thừa số $3n$ | Đúng, chặt với mọi $n\in\mathbb{Z}$ |
| 16b, 17 | chỉ nhân đa thức + đặt thừa số chung | Đúng |
| 18 | nhân hai vế với $abc\ne0$ (không cộng phân thức); $(a+b+c)(ab+bc+ca)$ và $(a+b)(b+c)(c+a)$ đều khai triển bằng nhân; tích ba số thực bằng 0 ⇒ một thừa số bằng 0 | Chấp nhận: đẳng thức có được bằng khai triển so sánh, không bằng phương pháp phân tích nhân tử; "tích các số bằng 0" là tính chất của số (lớp 6–7) |
| 19 | (sau sửa) bình phương một hiệu hai lần; tổng hai bình phương bằng 0 | Đúng |

## Câu còn `Chưa chắc`

Không.
