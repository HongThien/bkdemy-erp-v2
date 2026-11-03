KẾT LUẬN: ĐẠT

# Biên bản soát phần BỔ SUNG — HS lượt J (C4.4, C4.4.1–C4.4.6), 03/11

Phần mới so với `HS-J.truoc-bs.txt`: chỉ ví dụ 3 của C4.4.4 (chia 9 ngày cho hai kênh, x, y nguyên, câu b chặn y ≤ 5) + 2 dòng GHI CHÚ. Phần cũ (đã soát ĐẠT ở `HS-J.soat.md`) không đổi nội dung.

## Ví dụ mới — C4.4.4 VD3
- Tự giải lại: `S\soat2\HS-J\vd3-c444.mjs` (duyệt cả 10 giá trị x = 0..9). Khai triển P(x) = −14x² + 74x + 585 đúng; đỉnh 37/14 ≈ 2,64; a) x = 3, y = 6, P = 681; b) x ≥ 4, lớn nhất tại x = 4, y = 5, P = 657. Khớp lời giải.
- Miền thực tế: P_B ≥ 0 với mọi y = 0..9; số ngày nguyên, tổng đúng 9. Không suy biến.
- Kiểu đề thật T112020401286 (10 ngày, P_A = x² + 2x, P_B = 326y − 27y², y ≤ 6, ĐA 4): cùng khuôn, cùng loại trả lời ngắn. Số liệu khác hẳn, không chép đề.
- Đúng dạng C4.4.4 (phân bổ một tổng cố định), không lạc sang dạng khác.

## Chỗ đã sửa
| # | Vị trí | Lỗi | Sửa |
|---|---|---|---|
| 1 | Cả tệp `HS-J.txt` | Tệp bị NHÂN ĐÔI: dòng 302–600 là bản chép lại toàn bộ các khối C4.4…C4.4.6 + GHI CHÚ (bản cũ hơn, không có header `=== N C4.4`). Máy kiểm vẫn báo lỗi 0 nên không bắt được. | Giữ dòng 1–301 (bản đầy đủ, mới nhất), bỏ phần chép lại. Phần bị bỏ trùng 100% nội dung phía trên, trừ GHI CHÚ thiếu 2 dòng mới. Bản trước khi sửa lưu ở `S\soat2\HS-J\HS-J.truoc-soat2.txt`. |
| 2 | GHI CHÚ, dòng C4.4.6 | Hai gạch đầu dòng dính vào một dòng ("…kWh).- C4.4.4: …") | Tách thành hai dòng. |

## Cần CEO xem
- Đề thật T112020401286 có đỉnh (≈ 4,15) nằm TRONG miền đã chặn, nên phải so hai số nguyên 4 và 5. Ví dụ 3 tách ra hai cơ chế: câu a) so hai số nguyên sát đỉnh, câu b) đỉnh nằm ngoài miền nên lấy đầu mút. Gộp lại vẫn phủ đủ cách giải, nhưng không có câu nào ghép cả hai cơ chế cùng lúc như đề thật. Theo tôi như vậy là đạt; nếu CEO muốn sát đề hơn thì đổi số ở câu b) để đỉnh nằm trong miền.
- `kiem-moi.mjs` không phát hiện các khối dạng bị lặp trong cùng một tệp (vẫn báo 13 ví dụ, lỗi 0). Nên thêm luật kiểm "mỗi dạng chỉ xuất hiện một lần".

Máy kiểm sau khi sửa: `HS-J.txt: 1 nhóm · 6 dạng · ví dụ 13 · hình 0 · lỗi 0 · cảnh báo 0`.
