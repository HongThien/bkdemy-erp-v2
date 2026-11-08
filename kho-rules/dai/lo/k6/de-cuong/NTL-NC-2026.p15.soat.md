KẾT LUẬN: ĐẠT

# NTL-NC-2026 · trạm 15 — biên bản soát (Opus)

Phạm vi: Ôn tập GK I — Dạng 3, Bài 1a–1e (tìm chữ số x, y theo dấu hiệu chia hết) và Bài 2a–2c (tổng / hiệu luỹ thừa của 10 có chia hết không). Nguồn: ảnh `t-10.png` + phóng to 300 dpi `z/s15/d3a-10.png`, `z/s15/d3b-10.png`.

- Số câu: **8** (0 TN · 0 TLN · 8 tự luận).
- Khớp Pha 1 ngay từ đầu: **8/8** (đáp số kiểm bằng vét cạn x, y ∈ {0..9} và BigInt — xem `NTL-NC-2026.p15.kiem.md`).
- Đề chép đúng ảnh: 8/8. Phân loại đúng: 8/8 (đáp số là cặp chữ số / câu trả lời có-không ⇒ `tu_luan`).
- Phải sửa: **4 câu** (1 lập luận ở Phần 1, 1 lập luận ở Phần 2, 2 định dạng). Không đổi đáp số nào.
- Cổng: `✔ đạt cổng` (8 câu, chưa chắc 0).

## Bảng sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| ÔT D3 Bài 1d | lập luận | Dòng `**Chú ý:**` "chỉ trừ 1 ở chữ số tận cùng… không cần mượn sang hàng khác" ⇒ "chữ số tận cùng là 0 nên khi bớt 1 phải mượn 1 ở hàng chục: hàng đơn vị thành 9, hàng chục 6 thành 5" | Câu cũ sai: $\overline{4x60}-1=\overline{4x59}$ CÓ mượn ở hàng chục. Nó cũng mâu thuẫn với Bước 2 và Phần 2 của chính câu này |
| ÔT D3 Bài 1c | định dạng | `14+x\vdots 9` ⇒ `(14+x)\vdots 9` | Thiếu ngoặc thì công thức đọc thành $14+(x\vdots 9)$; các dòng khác trong bài đều đã có ngoặc |
| ÔT D3 Bài 1e | định dạng | `19+x\vdots 9` ⇒ `(19+x)\vdots 9` | Như trên |
| ÔT D3 Bài 2c | lập luận | Phần 2 thêm lí do cho dạng chữ số: $10^{2020}-1=99\dots9$ (2020 chữ số 9) nên $10^{2020}-4=99\dots9-3=99\dots96$ | Bản soạn viết thẳng kết quả $99\dots96$ mà không lập luận; Phần 1 (Bước 1) có nói tới ý này nhưng Phần 2 bỏ qua |

## Câu còn `Chưa chắc`

Không có.
