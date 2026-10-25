KẾT LUẬN: ĐẠT

# Biên bản soát — YH-HKI-2026 p5 (ảnh trang 15–17, đuôi Câu 128 sang trang 18)

- Số câu: 75 (PHẦN 1: 2 TLN Câu 102, 103 · PHẦN 2: 73 tự luận Câu 104a – 128h). Đủ câu, không thừa, không bỏ; thứ tự đúng ảnh.
- Đáp số khớp Pha 1 (`YH-HKI-2026.p5.kiem.md`) ngay từ đầu: **75/75**. Các đẳng thức (107, 108, 109, 113a, 114d, 115a–d, 117a–b, 121.1–6, 122.1–4) kiểm 300 bộ ngẫu nhiên; PTLG 128a–h thay 13 giá trị k + quét 400 000 điểm, không sót nghiệm; đơn điệu 126a–d quét 20 000 điểm.
- Đề gõ: đối chiếu ảnh (phóng to 110, 113, 114, 118) — khớp.
- Số câu phải sửa: **10** (không câu nào sai đáp số; 1 ghi chú sai, 7 câu Phần 1 lộ kết luận / cụt nghĩa, 2 câu lập luận/diễn đạt).
- Cổng: `✔ đạt cổng` (2 TLN · 73 tự luận · chưa chắc 0).
- Bản gốc trước khi sửa: `YH-HKI-2026.p5.soan.goc.md`.

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| 110 | chép đề (ghi chú) | Xoá Ghi chú "đề in $\sin(-337)$ không có ký hiệu độ" (và mục tương ứng ở GHI CHÚ CHO NGƯỜI DUYỆT) | Ảnh phóng to 260 dpi in rõ $\sin(-337^\circ)$; đề gõ vốn đã đúng |
| 123b | định dạng (Phần 1) | Viết lại Mấu chốt | Câu cũ cụt nghĩa ("tổng của chúng có tính chẵn lẻ nào") |
| 123c | định dạng (Phần 1 lộ đáp số) | Mấu chốt bỏ "là hàm chẵn", chỉ nêu hai thừa số cùng đổi dấu | Không lộ kết luận ở Phần 1 |
| 124a | định dạng (Phần 1 lộ đáp số) | Mấu chốt bỏ "là hàm số chẵn" | như trên |
| 124b | định dạng (Phần 1 lộ đáp số) | Mấu chốt + Bước 2–3 viết lại thành thao tác so sánh, không khẳng định "không chẵn không lẻ" | như trên |
| 124c | định dạng (Phần 1 lộ đáp số) | Mấu chốt bỏ "thương là hàm lẻ" | như trên |
| 124d | định dạng (Phần 1 lộ đáp số) | Mấu chốt bỏ "tích là hàm chẵn" | như trên |
| 127a | định dạng (Phần 1 lộ đáp số) | Mấu chốt bỏ "không có điều kiện nào" | như trên |
| 121.6 | lập luận (diễn đạt) | Bước 3 "cung bù với $\frac{\pi}{2}$" → "công thức cung hơn kém $\frac{\pi}{2}$" | $\sin(\frac{\pi}{2}+2a)=\cos2a$ là cung hơn kém $\frac{\pi}{2}$, không phải cung bù |
| 126d | lập luận | Thêm dòng chỉ rõ $(\frac{\pi}{12};\frac{\pi}{2})\subset(-\frac{\pi}{2};\frac{\pi}{2})$, $(\frac{\pi}{2};\frac{5\pi}{6})\subset(\frac{\pi}{2};\frac{3\pi}{2})$ và khoảng $x$ tương ứng | Lời giải cũ nhảy từ khoảng đơn điệu của $\tan t$ sang kết luận theo $x$, thiếu bước bao hàm |

## Đã kiểm, giữ nguyên (các điểm điều phối dặn)

- **115b** — đề sai đúng như trạm soạn ghi: VT $=\frac{1+\cot a}{1-\cot a}$, VP in $\frac{1+\cot^2a}{1-\cot^2a}$ (máy: lệch tới $6\cdot10^3$; với VP không bình phương lệch $\le 3\cdot10^{-13}$). Có Ghi chú "đề sai" + dòng "Lưu ý" đầu Phần 2. Giữ.
- **118b** — ảnh in $\cos110^\circ$ (không mũ 2), giá trị ≈ 1,0410; với $\cos^2110^\circ$ ra đúng $\frac32$, cùng khuôn ý a). Lỗi in hiển nhiên ⇒ chấp nhận sửa chữ đề + Ghi chú "đề sai" + Lưu ý. Giữ.
- **126d** — hàm không xác định tại $x=\frac{\pi}{6}$ thuộc khoảng; kết luận đồng biến trên hai khoảng con (máy xác nhận). Giữ (đã bổ sung bước, xem bảng).
- **111b/c, 112b/c** — máy dựng cả hai nghiệm $a$ (111) và cả hai nghiệm $\tan a$ của $t^2-3t-1=0$ (112): cả hai dấu đều xảy ra ⇒ $\pm$ đúng; $C$ cùng dấu $B$.
- **114d** — đề in hai câu cùng số 114; nhãn 114d hợp lí, có Ghi chú.
- **122** — ảnh in "Cã 122", hiểu Câu 122, có Ghi chú.
- 128b, 128g: nghiệm theo độ như đề, kèm dòng đổi radian — chấp nhận.
- PHẦN 1 tiêu đề `trac_nghiem` nhưng hai câu là `tra_loi_ngan` (đề in "là……." / "Tính tổng…" không phương án) — theo cách điều phối giao; cổng đạt.

## Gửi CEO (đề sai / Chưa chắc)

- 115b — **đề sai**: vế phải thừa bình phương; lời giải chứng minh VT $=\frac{1+\cot a}{1-\cot a}$ và nêu phản ví dụ $a=\frac{\pi}{6}$.
- 118b — **đề sai** (lỗi in thiếu mũ 2 ở $\cos110^\circ$), đã sửa chữ đề thành $\cos^2110^\circ$, đáp số $\frac32$.
- Không câu nào `Chưa chắc`.
