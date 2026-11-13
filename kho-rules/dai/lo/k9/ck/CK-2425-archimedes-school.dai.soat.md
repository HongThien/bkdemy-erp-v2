KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2425-archimedes-school · phần Đại số (trạm soát Opus, 13/11)

- Số câu: **60** (10 phần, toàn tự luận). Pha 0: không sót bài, không bài hình nhập nhầm, không trùng lượt Hình (Hình đã lấy Bài 33–38, Đề 1–5 Bài 4, Đề 3 Bài 5, Đề 4 Bài 5; Đề 1 Bài V khay nhôm đúng là của lượt Đại).
- Đáp số khớp Pha 1 (`.dai.kiem.md`, thử máy `<LV>\tam\soat_dai_mu.mjs`): **60/60** câu khớp đáp số ngay từ đầu (Bài 19 lệch ở chữ đề, không ở phép tính).
- Số câu phải sửa: **17** (12 kiến thức · 1 chép đề/đề sai · 3 định dạng/lập luận nhỏ · 1 bỏ Chưa chắc).
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng. Không có TAB/FF/ký tự điều khiển, không có `\notin`/`\neq`/`\ne` vỡ dòng (`tam\kiem_vo_dong.mjs`: 0 dòng).
- Bản gốc trước sửa: `CK-2425-archimedes-school.dai.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P2 Bài 9b | kiến thức | Viết lại: $(x-1)^2=10-m^2$, hai nghiệm $1\pm\sqrt{10-m^2}$, nghiệm nhỏ âm ⇒ $m^2<9$; bỏ Ghi chú Viète | Viète cấm ở HK I, giải được bằng hoàn thành bình phương |
| P2 Bài 10c | kiến thức | Thay Viète bằng hai nghiệm $1\pm\sqrt{m^2+1}$, $(x_1+1)(x_2+1)=3-m^2$; bỏ Ghi chú | như trên |
| P3 Bài 14b | kiến thức | $\left(x-(m-1)\right)^2=m^2-m+4>0$, $x_1^2+x_2^2=2(m-1)^2+2(m^2-m+4)$; bỏ Ghi chú | bỏ $\Delta'$ + Viète |
| P3 Bài 16b | kiến thức | Hai nghiệm $-\frac52\pm t$, xét hai cách gán, $t=\frac{13}{2}$ ⇒ $m=-36$; bỏ Ghi chú | bỏ Viète |
| P3 Bài 18b | kiến thức | Hai nghiệm $(m+2)\pm\sqrt{m+6}$, tổng/tích tính trực tiếp; bỏ Ghi chú | bỏ $\Delta'$ + Viète |
| P3 Bài 19 | chép đề + kiến thức | Trả chữ đề về "giá trị lớn nhất" như in; Ghi chú + "Lưu ý" ghi ĐỀ SAI; lời giải chỉ ra $T=5m^2+8m+5$ không có GTLN, nêu GTNN $\frac95$ tại $m=-\frac45$; ý a chứng minh trái dấu bằng $s>\lvert m+1\rvert$ | Luật: giữ chữ in, ghi đề sai; bỏ Viète / $a\cdot c<0$ |
| P3 Bài 20b | kiến thức | Tổng/tích lấy từ hai nghiệm $m-1\pm\sqrt{m^2-m+4}$; bỏ Ghi chú | bỏ $\Delta'$ + Viète |
| P3 Bài 21 | kiến thức | Viết lại toàn bài bằng $\left(x-(m+1)\right)^2=6m-2$, $P=(m-1)(m-3)$, $S=2(m+1)$ tính trực tiếp; Ghi chú giữ phần sửa thiếu chữ $x$ | bỏ $\Delta'$ + Viète |
| P3 Bài 22 | kiến thức | $\left(x-(m+2)\right)^2=m^2+3m+5>0$, tổng/tích tính trực tiếp; bỏ Ghi chú | bỏ $\Delta'$ + Viète |
| Đề 1 Bài 2.2b | kiến thức | $(x-m)^2=m^2-4$, $(x_1+1)^2+(x_2+1)^2=2(m+1)^2+2(m^2-4)$; Ghi chú chỉ giữ ý nghiệm kép | bỏ $\Delta'$ + Viète |
| Đề 3 Bài 2.2b | kiến thức | Hai nghiệm $-\frac32\pm t$, xét hai cách gán, $t=\frac12$ ⇒ $m=1$; bỏ Ghi chú | bỏ Viète |
| Đề 4 Bài 2.2c | kiến thức | Tổng/tích lấy từ hai nghiệm $-2\pm\sqrt{3-m}$; bỏ Ghi chú | bỏ Viète |
| P4 Bài 30 | định dạng | Thêm dòng $-6x^2-60x+7200=0$ trước khi chia | mỗi phép biến đổi một dòng |
| Đề 3 Bài 3 | định dạng | Thêm dòng $4x^2-12x-1080=0$ | như trên |
| P5 Bài 39 | lập luận (kết luận) | Kết luận nói rõ "tăng thêm $75$ nghìn (lên $175$ nghìn)" | đề hỏi "tăng giá vé lên bao nhiêu", hai cách đọc |
| P5 Bài 40 | định dạng | Ghi chú: "tối ưu liên tục là tăng $35$ nghìn (giá $65$ nghìn)" thay vì "$65$ nghìn" mơ hồ | tránh lẫn mức tăng với giá |
| P5 Bài 42 | Chưa chắc | Xoá `Chưa chắc` (86 vs 144 bạn), giữ Ghi chú ba bữa | Đề nêu giá suất ăn trưa ⇒ tính bữa trưa; bài gốc SGK Toán 9 KNTT đáp số 86 |

Mục `## GHI CHÚ CHO NGƯỜI DUYỆT` đã cập nhật theo các sửa trên.

## Câu còn `Chưa chắc` (gửi CEO)

- **Đề số 5 Bài 5** (khách sạn 50 phòng): hiểu giá tăng liên tục ⇒ $450$ nghìn (thu nhập $20\,250$ nghìn); hiểu chỉ tăng theo từng bước $20$ nghìn ⇒ $440$ hoặc $460$ nghìn ($20\,240$ nghìn). Lời giải theo $450$ (đáp án phổ biến của bài này).
