KẾT LUẬN: ĐẠT

# TX-GKI-2026 — phần 5 (Phần nâng cao, Khác Bài 1a–5) — biên bản soát

- Số câu: **8** (3 trả lời ngắn · 5 tự luận). Hình: 0.
- Khớp Pha 1 (giải mù, `TX-GKI-2026.p5.kiem.md`) ngay từ đầu: **8/8** — cùng phân tích tổng bình phương ở cả 8 câu; Bài 3 = $8$ tại $(8;4;2)$, Bài 4 = $-27$ tại $\left(\dfrac{3}{2};-\dfrac{3}{2}\right)$, Bài 5 = $1$ tại $(2;2)$; 2a $(3;\dfrac{3}{2})$, 2b $(2;1)$, 2c $(2;2;1)$.
- Máy kiểm: `<LV>\tam\soat_p5_kiem.mjs` — đồng nhất thức BigInt 200 bộ ngẫu nhiên / câu đều đúng; lưới số thực xác nhận min (1a: min thật $\dfrac{66}{41}>0$, lời giải chặn dưới bởi $1$ — đủ để chứng minh).
- Đề chép đúng ảnh `t-4.png` (phóng to 260 dpi). Kiến thức: chỉ $(a\pm b)^2$, bình phương không âm, đặt thừa số chung — đúng phạm vi TX. Mỗi bước đúng với mọi số thực; Bài 3, 4, 5 có kiểm dấu "=" tồn tại. Phân loại TLN đúng (một số ≤ 4 kí tự).
- Số câu phải sửa: **4** (1a, 2a, 2c, 3) — đều là lời Phần 1, không đổi đáp số. Cổng: ✔ đạt.

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Khác Bài 1a | lập luận (Phần 1) | Bước 1: "hệ số $-6$ chỉ có thể đến từ $(x-ky)^2$" → "chọn $(x-ky)^2$ có hạng tử $-2kxy$ khớp $-6xy$" | "chỉ có thể" sai về toán (nhiều cách ghép khác cũng ra $-6xy$) — bước nghĩ là một lựa chọn, không phải điều bắt buộc |
| Khác Bài 2a | lập luận (Phần 1) | Bước 2: "tích $xy$ chỉ đến từ $(x-2y)^2$" → "$-4xy$ cùng $x^2$ là hai hạng tử của $(x-2y)^2$ (lấy $4y^2$ từ $8y^2$)" | Như trên |
| Khác Bài 2c | lập luận (Phần 1) + định dạng | Bước 2, 3: bỏ "chỉ đến từ khai triển"; Ghi chú "Đề sai/thiếu lệnh:" → "Đề sai (thiếu biến trong lệnh):" | Như trên; Ghi chú mở bằng "Đề sai" đúng luật 24/10 (đã có dòng "Lưu ý" đầu Phần 2) |
| Khác Bài 3 | lập luận (Phần 1) | Bước 1, 2: bỏ "chỉ đến từ khai triển" | Như trên |

**Đề sai:** Khác Bài 2c — lệnh chung "Tìm $x,\ y$" nhưng ý c có $z$ ⇒ giải tìm cả $x,\ y,\ z$; đã có Ghi chú "Đề sai" + "Lưu ý" đầu Phần 2. (Khác Bài 1a: lệnh ghi $x,\ y,\ z$ nhưng biểu thức không có $z$ — vô hại, chỉ ghi chú, không coi là đề sai.)

**Chưa chắc:** không có.
