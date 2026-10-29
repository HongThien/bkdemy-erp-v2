KẾT LUẬN: ĐẠT

# Biên bản soát — VD-CKI-2025 khúc 1 (Đề ôn tập số 1, trang 1–4, PHẦN 11–14)

- Số câu: 21 (12 TN · 2 Đ/S · 2 TLN · 5 tự luận). Đủ câu, không thừa/thiếu so với ảnh.
- Khớp Pha 1 ngay từ đầu (đáp án / đáp số): 21/21 (đối chiếu `VD-CKI-2025.p1.kiem.md`, script `<LV>\tam\soat_p1.mjs`).
- Đề gõ: khớp ảnh, không phải sửa chữ đề.
- Hình giải `giai_P13C16.png`, `giai_P14C21.png`: đúng dữ kiện, nét khuất đúng (MN, PQ, QM ở C16; MN, NP, PQ, BD ở C21), đủ điểm, nhãn không đè — không sửa.
- Số câu phải sửa: 5 (C2, C5, C13, C14, C19) + chỉnh ghi chú C16 (không đổi đáp án câu nào).
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng.

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P11 C2 | lập luận (Phần 1) | Bước 4 "loại nghiệm làm một mẫu bằng 0" ⇒ "loại nghiệm (nếu có)…" | Câu cũ ngầm báo trước có nghiệm bị loại |
| P11 C5 | lập luận (Phần 1 lộ đáp án) | Bước 3 viết lại thành câu hỏi "có hằng số lớn hơn / nhỏ hơn mọi $u_n$ hay không" | Bản cũ "chặn trên… và chặn dưới…" lộ thẳng phương án B |
| P12 C13 | định dạng / ghi chú | Bỏ dòng Ghi chú ý a) và dòng tương ứng ở GHI CHÚ CHO NGƯỜI DUYỆT | Ý a) là mệnh đề sai hợp lệ, ảnh in rõ — không phải lỗi đề, ghi chú gây nhiễu |
| P12 C14 | ghi chú "đề sai" + định dạng | Ghi chú d) đổi thành: mệnh đề sai hợp lệ, không coi là đề sai (nêu khả năng trường định SSDD); bỏ dòng "Lưu ý" đầu Phần 2; `\left(\frac12\right)` ⇒ `\Big(\dfrac12\Big)` | Đ/S có mệnh đề sai là bình thường, HS vẫn trả lời S không mơ hồ; brief-cki cấm `\left` `\right` |
| P14 C19 | chưa chắc ⇒ giải quyết | Xoá `Chưa chắc`, thay bằng Ghi chú; dòng "Lưu ý" ⇒ câu lập luận "chỉ tăng giữa các liều nên trước liều 1 có $2\cdot10^9$"; kết luận ghi số chính xác 1 201 060 000 | Đề nói rõ "giữa các liều thuốc" ⇒ trước liều 1 không tăng; cách hiểu 2 phải thêm dữ kiện đề không có. Kết quả $u_5=1{,}20106\cdot10^9$ là số đúng, không cần "khoảng" |
| P13 C16 | định dạng ghi chú | "không phải số hữu hạn tô được" ⇒ "là số vô tỉ, không tô chính xác được trên 4 ô" | Diễn đạt sai khái niệm |

Đã kiểm đạt, không sửa: C1, C3, C4, C6–C12, C15, C17, C18, C20, C21 (C16, C17 để tự luận đúng: $\frac{\sqrt5}{5}$ và $\frac{331}{6}$ không tô được 4 ô; C15 = 9, C18 = 30 đúng TLN).

## Gửi CEO

- Không còn câu `Chưa chắc`, không câu nào "đề sai".
- Để CEO biết: P12 Câu 14d — theo đề in d) SAI (mẫu đúng $31\cdot2^{19}$, đề in $15\cdot2^{19}$), đáp án SSDS. Nếu trường định d) đúng thì đáp án gốc là SSDD.
- P14 Câu 19 — đã chốt cách hiểu theo chữ "giữa các liều" (không tăng trước liều 1), đáp số 1 201 060 000; cách hiểu khác (tăng trước liều 1) ra ≈ 1,726·10^9, ghi ở Ghi chú.
