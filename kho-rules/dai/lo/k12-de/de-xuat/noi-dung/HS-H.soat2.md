KẾT LUẬN: ĐẠT

# Soát phần BỔ SUNG — HS lượt H (C3.1–C3.3), 03/11

Phạm vi: `diff HS-H.truoc-bs.txt HS-H.txt` (6 ví dụ mới ở C3.1.1, C3.1.2, C3.1.3, C3.2.1, C3.3.1, C3.3.2; sửa C3.2.1 bỏ song song/vuông góc; 3 ý lý thuyết mới ở C3.3.1, C3.3.2) + rà nhanh phần cũ.
Bản trước khi soát lượt này: `S\soat2\HS-H\HS-H.truoc-soat2.txt`.

## Đã kiểm
- Tự giải lại bằng số, độc lập script trạm bổ sung: `S\soat2\HS-H\giai.cjs` — 17 phép kiểm OK (6 ví dụ mới, mọi ý a) b) c); VD1 b) C3.2.1 đã đổi đề; tìm nghiệm/cực tiểu bằng quét số, không dùng lại lời giải).
- Đối chiếu đề thật (`cau-dang.cjs HS <dạng> 12/60`): mọi ý mới có câu đề cùng kiểu (vd "2a+3b" giao trục; "x³−2x² và −2x²+5x"; "y=m cắt x⁴−2x²+2 bốn điểm"; "MN trên Ox", "OM"; "k=−3 dạng y=mx+n", "diện tích tiếp tuyến với hai trục"; "thuyền – trạm I(−1;−1)"; "M(a;b), a<0 từ đồ thị"; "chu vi hình chữ nhật", "C_m diện tích 8", "2x+y−1=0 cắt hai tiệm cận").
- Quyết định Thùy: C3.2.1 không còn ý song song/vuông góc (lý thuyết nhóm, dạng, ví dụ). Không có hình mới trong phần bổ sung.
- Lý thuyết mới không lặp lý thuyết nhóm; không thêm ý đề không hỏi.
- Máy kiểm `kiem-moi.mjs HS … C3.1,C3.2,C3.3,C3.1.1–3,C3.2.1–2,C3.3.1–2`: 3 nhóm · 7 dạng · 20 ví dụ · 5 hình · lỗi 0 · cảnh báo 0.

## Chỗ đã sửa
| # | Vị trí | Lỗi | Sửa |
|---|---|---|---|
| 1 | C3.2.1 VD3 a) | Số liệu gần chép đề thật T112000000794 ($y=x^3-3x^2-2$, $k=-3$; bản bổ sung chỉ đổi hằng số thành $+1$) | Đổi thành $y=x^3-6x^2+4x-1$, $k=-8$: nghiệm kép $x=2$, tiếp tuyến $y=-8x+7$, $m+n=-1$ (đã thử máy) |
| 2 | Lý thuyết nhóm C3.2 | Dòng "hệ số góc của $Ax+By+C=0$ là $-A/B$" chỉ phục vụ ý song song/vuông góc đã bỏ; đề tiếp tuyến không cho đường dạng tổng quát | Xoá dòng |
| 3 | C3.3.2 lý thuyết (ý tam giác $IAB$) | "IA, IB lấy theo giá trị tuyệt đối toạ độ" — sai cách hiểu (phải là hiệu với toạ độ $I$) | Ghi rõ $IA=\lvert y_A-y_I\rvert$, $IB=\lvert x_B-x_I\rvert$ |
| 4 | C3.2.1 lý thuyết | Câu "Đề cho hệ số góc dưới dạng $y=mx+n$…" tối nghĩa | Viết lại: "Đề hỏi tiếp tuyến dưới dạng $y=mx+n$ thì thu gọn rồi đọc $m=k$, $n$ là hệ số tự do" |

## Rà nhanh phần cũ
Không đổi so với lượt soát trước (`HS-H.soat.md`), vẫn hợp lệ.

## Cần CEO xem
- Không có điểm mới. Điểm cũ còn mở: C3.1.2 — bảng ánh xạ xếp nhiều câu "giao điểm với hai trục" vào C3.1.2, nội dung đặt ở C3.1.1 theo mô tả cây (xem GHI CHÚ cuối tệp).
