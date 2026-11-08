KẾT LUẬN: ĐẠT

# Soát phần BỔ SUNG — HS, lượt D (C1.4, C1.5 · C1.4.1–C1.4.6, C1.5.1, C1.5.2) — 03/11

Phạm vi: `diff HS-D.truoc-bs.txt HS-D.txt` (5 ví dụ mới, 6 ý lý thuyết mới, bỏ f″ ở C1.5.1). Tự giải lại mọi số liệu mới bằng `S\soat2\HS-D\kiem.mjs` (22 phép kiểm, đạt hết sau sửa); đối chiếu đề thật bằng `cau-dang.cjs HS <dạng> 200` cho C1.4.1, C1.4.2, C1.4.3, C1.4.6, C1.5.1 (bản lưu ở `S\soat2\HS-D\`). Hình mới dựng ra ảnh `S\soat2\HS-D\hinh.png` và đã nhìn: cắt $Ox$ tại −2, 1, 3, qua $(0;6)$, khớp đề + lời giải. Bản trước soát: `S\soat2\HS-D\HS-D.truoc-soat2.txt`.

Toán của phần bổ sung đúng hết; kiểu bài đều có câu đề thật (ln, căn ở mẫu, mẫu cho bằng đồ thị bậc ba, TCX tạo tam giác, tử bậc ba, tham số qua điểm, log nhận Oy, mệnh đề TCĐ/TCN, định nghĩa đơn điệu/GTLN). Lỗi chính: **chép số liệu đề thật**. Quyết định Thùy (bỏ f″ ở cực trị C1.5.1/C1.4) đã áp đúng; y″ còn ở C1.5.2 chỉ để tìm tâm đối xứng, không dùng cho cực trị.

## Chỗ đã sửa

| # | Vị trí | Lỗi | Sửa |
|---|---|---|---|
| 1 | C1.4.1 VD3 a) | $y=1+\frac{2x+1}{x+2}$ chép nguyên câu đề thật | Đổi sang $y=2+\frac{x-3}{2x+1}=\frac{5x-1}{2x+1}$, TCN $y=\frac52$ |
| 2 | C1.4.2 VD3 c) + hình | Tử $(x+1)(x^2-1)$ trên $f(x)$ bậc ba có đồ thị chép nguyên câu T1120000006279 | Đổi sang $\frac{(x-1)(x^2-4)}{f(x)}$, $f=(x+2)(x-1)(x-3)$, $f(0)=6$; đáp số 2 (TCĐ $x=3$, TCN $y=1$); vẽ lại hình |
| 3 | C1.4.3 VD3 a) | $\frac{2x^2+x-1}{x+2}$ trùng câu đề thật (T112010305042) | Đổi sang $\frac{3x^2+5x-1}{x+2}$, TCX $y=3x-1$, $S_{OAB}=\frac16$ |
| 4 | C1.4.3 VD3 b) | $\frac{x^3+2}{x^2-2x}$ trùng câu đề thật | Đổi sang $\frac{x^3-x^2+3}{x^2+x}$, TCX $y=x-2$ |
| 5 | C1.4.3 lý thuyết | Ý mới "bậc tử hơn bậc mẫu đúng 1 thì chia đa thức" lặp lý thuyết nhóm C1.4 | Xoá |
| 6 | C1.4.6 VD3 a) c) | Danh sách $x^2,\sin x,\log x,2^x$ và hai mệnh đề $x=-a$, $y=-b$ chép gần nguyên phương án đề thật | a) đổi sang $x^3,\cos x,\ln x,3^x$; c) đổi thành (i) $\lim_{x\to3^+}=+\infty\Rightarrow y=3$ là TCN (sai), (ii) $\lim_{x\to+\infty}=-4\Rightarrow y=-4$ là TCN (đúng); b) đổi số 2 → −1 |
| 7 | C1.4.6 lý thuyết | Ý "mệnh đề tổng quát… cùng số" lặp 2 ý đầu của chính dạng | Bỏ khỏi ##TC, viết lại thành 1 ý ##CY "giữ đúng loại đường và đúng số, không đổi dấu"; ý log viết gọn cho hàm đa thức/sin/cos/$a^x$ |
| 8 | C1.5.1 VD3 a) b) c) | a) b) chép gần nguyên phương án đề (T1120000001265, T112010402202) | a) nói về nghịch biến; b) GTLN trên $[0;4]$ với $f(1)=5$; c) $f'<0$ trên $(1;4)$ |
| 9 | GHI CHÚ CHO CEO | — | Cập nhật mô tả C1.4.6, thêm dòng soát bổ sung |

Máy kiểm `kiem-moi.mjs HS … C1.4,C1.5,C1.4.1–C1.4.6,C1.5.1,C1.5.2`: 2 nhóm · 8 dạng · 21 ví dụ · 9 hình · **lỗi 0** · cảnh báo 0.

Phần cũ rà nhanh: còn hợp lệ, không đụng.

## Cần CEO xem
- C1.4.2 VD3 a) ($\frac{2x-4}{\sqrt{x^2-4}}$) và b) (hàm $\ln$ của phân thức) **giữ nguyên khung** của câu đề thật (khác số, đáp số trùng 3). Đây là kiểu đề nên khó đổi khung; nếu Thùy muốn khác hẳn thì báo.
- Giữ các điểm cũ trong GHI CHÚ (câu T112000000890 đáp án không chặt).
