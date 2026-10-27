KẾT LUẬN: ĐẠT

# Biên bản soát — NTL-GKI-2026 phần 10 (Dạng 1 Bài 4a–4i, phân tích đa thức thành nhân tử)

- Số câu: **9** (9 tự luận, 0 TLN, 0 trắc nghiệm) — toàn Đại số. **Không có bài Hình** ⇒ luật trình bày Hình 7·8·9 không áp. **Không có câu tiếng Anh.**
- Khớp Pha 1 ngay từ đầu: **9/9** (cả 8 phân tích 4a–4h và kết luận 4i "đề sai, không phân tích được trên số nguyên").
  Máy: `<LV>\tam\kiem_soat_p10.mjs` (200 bộ số nguyên BigInt mỗi ý; 4i vét mọi cặp tam thức nguyên + nghiệm hữu tỉ ⇒ không có).
- Đề chép đúng ảnh `t-05.png` (đã phóng to 260 dpi `z\soat_p10_b4-05.png`): 9/9 khớp số, số mũ, dấu, ngoặc.
- Kiến thức: đặt nhân tử chung, nhóm, hằng đẳng thức, tách hạng tử (4h), đặt ẩn phụ (4i) — đều trong phạm vi NTL (Chương I + II đầy đủ). Không dùng công thức nghiệm, không "phương trình".
- Số câu phải sửa: **1** (4i) — **0 câu sửa vì lỗi toán**, 1 câu sửa lập luận/trình bày + ghi chú đề sai.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Dạng 1 Bài 4i | lập luận (chỉ trình bày, đáp số không đổi) | Câu kết "đây là tổng của một bình phương và một số dương, không phải hiệu hai bình phương nên không phân tích tiếp được" ⇒ "luôn $\geq 7>0$ nên không có nhân tử dạng $x-a$; ta dừng ở dạng gọn nhất này" | Lí do cũ không đúng về logic (tổng bình phương + số dương vẫn có thể phân tích kiểu khác, vd $x^4+4$); khẳng định "không phân tích được trên số nguyên" giữ ở dòng Vậy, chứng cứ máy nằm ở Ghi chú |
| Dạng 1 Bài 4i | trình bày | Thêm dòng $(x^2+5x+4)(x^2+5x+6)+8$ trước $=(t+4)(t+6)+8$ | Sau câu "Đặt $t=\dots$, ta có:" dòng mở bằng "$=$" không có vế trái |
| Dạng 1 Bài 4i | ghi chú đề sai | Ghi chú + dòng "Lưu ý" đầu Phần 2 + Ghi chú cho người duyệt: thêm khả năng đề đúng là **$-8$** ⇒ $(x^2+5x+2)(x^2+5x+8)$ (chỉ lệch dấu — khả năng in nhầm cao nhất), cạnh $+1$ và $-24$ | Bản soạn chỉ nêu $+1$; máy kiểm cả ba phương án |

Các câu 4a–4h: không sửa (đề đúng, đáp số đúng, Phần 1 3–4 bước nghĩ thật không lộ đáp số cuối, Phần 2 đúng khuôn, `\cdot` đúng).

## Đề sai (theo luật 24/10 — đã ghi "Đề sai" ở Ghi chú + "Lưu ý" đầu Phần 2, KHÔNG treo Chưa chắc)

- **Dạng 1 Bài 4i** — $(x+1)(x+2)(x+3)(x+4)+8=(x^2+5x+5)^2+7$ bất khả quy trên $\mathbb{Q}$; ảnh in rõ "$+8$". Đúng phải là $-8$ / $+1$ / $-24$.

## Câu còn `Chưa chắc`

Không.
