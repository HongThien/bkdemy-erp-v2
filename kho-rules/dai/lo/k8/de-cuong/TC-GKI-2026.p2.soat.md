KẾT LUẬN: ĐẠT

# TC-GKI-2026 — Phần 2 (Đại Bài 1a–1d, 2a–2f) — biên bản soát

- Số câu: **10** (10 tự luận, 0 trả lời ngắn).
- Khớp Pha 1 ngay từ đầu: **10/10** đáp số (Pha 1: `TC-GKI-2026.p2.kiem.md`, kiểm bằng máy 8 bộ số hữu tỉ BigInt / câu, gồm cả hai cách đọc Bài 2c).
- Đề chép đúng ảnh `t-1.png`, `t-2.png` (phóng to Bài 1a–1d, 2a–2f): 10/10.
- Kiến thức: chỉ Chương I (nhân, chia đơn thức; chia đa thức cho đơn thức; luỹ thừa lớp 7) — không hằng đẳng thức, không phân tích nhân tử. Phân loại `tu_luan` đúng cả 10.
- Số câu phải sửa: **1** (lập luận — câu Chú ý). Bản trước khi sửa: `TC-GKI-2026.p2.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Đại Bài 2b | lập luận (Phần 1) | **Chú ý** "$x:x$ không phải $0$ mà là số mũ $2-1=1$" ⇒ "$x^2:x=x$ (số mũ $2-1=1$) chứ không phải $1$ …; tương tự $y^2:y=y$" | Câu cũ lẫn $x:x$ với $x^2:x$ và nói "không phải $0$" — sai chữ, dễ làm HS hiểu nhầm |
| Đại Bài 2c | (không lỗi — làm rõ cờ) | Viết lại dòng **Chưa chắc**: ghi ảnh phóng to đã xác nhận không có ngoặc + lí do cách in nhiều khả năng là chủ ý; sắp đáp số cách hiểu kia theo luỹ thừa giảm $-3x^2y^2-\dfrac{5}{3}x$ | Để CEO quyết nhanh |

## Câu còn `Chưa chắc` (gửi CEO)

- **Đại Bài 2c** — $5x^2y^2+9x^3y^4:(-3xy^2)$: ảnh phóng to xác nhận KHÔNG có ngoặc quanh tử ⇒ giải như in (chia trước, cộng sau) $=2x^2y^2$. Cách in nhiều khả năng là chủ ý (thương $-3x^2y^2$ đồng dạng với $5x^2y^2$), nhưng các ý f–i có ngoặc nên không loại được khả năng in thiếu; nếu có ngoặc thì $-3x^2y^2-\dfrac{5}{3}x$.
