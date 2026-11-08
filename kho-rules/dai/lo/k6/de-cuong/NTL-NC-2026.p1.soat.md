KẾT LUẬN: ĐẠT

# NTL-NC-2026 · trạm 1 (Tiết 19 — Số nguyên tố, hợp số tiết 1) — biên bản soát (Opus, 24/10)

- Số câu: **9** (5 TN · 0 TLN · 4 tự luận).
- Khớp Pha 1 (`p1.kiem.md`) ngay từ đầu: **8/9**. Lệch 1: T19 Bài 1 khẳng định 3 (soạn Đúng · soát Sai) — lệch do đề thiếu chữ "lớn hơn 1", không phải lỗi tính.
- Đề: 9/9 chép đúng ảnh `t-01.png` (đã phóng to 260 dpi). Vết bút khoanh trên trang 1 (Câu 3 khoanh C) là SAI — đáp án đúng B (61; 67), không dùng.
- Số câu phải sửa: **7** (Bài 1 · Câu 3 · Câu 4 · Câu 5 · TL Bài 1.1 · 1.2 · 1.3). Bản gốc: `NTL-NC-2026.p1.soan.goc.md`.
- Cổng: `✔ đạt cổng`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| T19 Bài 1 | đáp số + lập luận | Khẳng định 3: Đúng → **Sai** (phản ví dụ số 0); 4 giữ Đúng, lí do viết lại (mọi hợp số có ≥ 3 ước; số > 1 có ≥ 3 ước là hợp số). Phần 1 Bước 1–2: nêu điều kiện "lớn hơn 1" và thử số 0 thay cho "so 'nhiều hơn 2' với 'ít nhất 3'". Viết lại `Chưa chắc`. | Lí do cũ của 3) tự mâu thuẫn: dẫn định nghĩa CÓ "lớn hơn 1" để kết luận khẳng định KHÔNG có "lớn hơn 1" là đúng. Số 0 chia hết cho 1; 2; 3 nên có nhiều hơn 2 ước mà không là hợp số (bản đồ NNB00908: "Số 0 và số 1 không là số nguyên tố cũng không là hợp số"). |
| T19 Câu 3 | kiến thức | Phần 1 Bước 3 + Phần 2: thay "chia cho các số nguyên tố có bình phương không vượt quá số đó / $11.11=121>67$" bằng "chia lần lượt cho $2;3;4;\dots$, dừng khi thương nhỏ hơn số chia" (61 dừng ở 8, 67 dừng ở 9) | Cách "bình phương không vượt quá" KHÔNG có trong lý thuyết bản đồ K6; whitelist là ##PP của dạng NDB00376 (nhóm NNB00908): *"chia số đó lần lượt cho 2; 3; 4; … và dừng khi thương nhỏ hơn số chia"* — đúng như hai ví dụ 13, 29, 37 trên bản đồ. Điểm dừng tính bằng máy. |
| T19 Câu 4 | kiến thức | Phương án D: $5.5=25>19$ → chia 2; 3; 4, dừng ở $19:5$ thương 3 | như trên |
| T19 Câu 5 | kiến thức | Phần 1 Bước 3 + kiểm 97: dừng ở $97:10$ thương 9 | như trên |
| T19 TL Bài 1.1 | kiến thức | Phần 1 Bước 2 + Chú ý; Phần 2 kiểm 37 (dừng ở 7), 61 (dừng ở 8) | như trên |
| T19 TL Bài 1.2 | kiến thức | Phần 1 Bước 3; Phần 2 kiểm 23, 29, 17, 37, 47, 67, 97 | như trên |
| T19 TL Bài 1.3 | kiến thức | Phần 1 Bước 2 ("thử chia tiếp cho 7" — thiếu điểm dừng); Phần 2 kiểm 31, 37, 83, 89 | như trên |

Không sửa: Câu 1, Câu 2 (đúng đáp án, lập luận và kiến thức). Đáp án TN 5/5 khớp Pha 1: C · C · B · A · B. Đáp số tự luận khớp: 1.1 (37; 61 nguyên tố — 12; 55; 87 hợp số) · 1.2 (* ∈ {3; 9} và * ∈ {1; 3; 4; 6; 9}) · 1.3 (* ∈ {0; 2; 3; 4; 5; 6; 8; 9} và * ∈ {0; 1; 2; 4; 5; 6; 7; 8}).

Trạm soạn hỏi (b) — "bình phương không vượt quá" ngoài whitelist k6.md: **đúng là ngoài whitelist**, đã thay hết (grep 0 chỗ còn lại).

## Câu còn `Chưa chắc` (gửi CEO)

| Nhãn | Lí do |
|---|---|
| T19 Bài 1 | Khẳng định 3 ("Hợp số là số tự nhiên có nhiều hơn 2 ước") và 4 thiếu "lớn hơn 1". Theo định nghĩa SGK + số 0 (có nhiều hơn 2 ước, không là hợp số) thì 3) **Sai** — lời giải đang ghi Sai. 4) hiểu là điều kiện cần thì **Đúng** (đang ghi Đúng). Trạm soạn chọn 3) Đúng ("hiểu theo ý đề"). CEO chốt, hoặc sửa đề thêm "lớn hơn 1" vào khẳng định 3 (khi đó 3 thành Đúng). |
