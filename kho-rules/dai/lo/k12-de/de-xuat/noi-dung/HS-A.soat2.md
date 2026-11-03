KẾT LUẬN: ĐẠT

Trạm soát 2 (Opus) · 03/11 · soát PHẦN BỔ SUNG của `HS-A.txt` (so với `HS-A.truoc-bs.txt`), mã giao C1.1, C1.1.1–C1.1.6.

- Phần mới (theo `diff`): C1.1.4 thêm 2 ý lý thuyết + ví dụ 2 mới (đồ thị bậc bốn, 4 mệnh đề đúng/sai; ví dụ phân thức cũ thành ví dụ 3) · C1.1.5 thêm 1 ý TC, 2 bước PP, 1 ý CY + ví dụ 3 (cột kẻ đôi f′ không xác định) + ví dụ 4 (f′<0 mọi x, đếm nghiệm nguyên f(u)>f(v)) · C1.1.6 thêm 1 ý TC (g = k·f) + ví dụ 3 · GHI CHÚ.
- Tự giải lại 4 ví dụ mới bằng script riêng `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad\soat2\HS-A\giai.cjs`: quét dấu f′ của −x⁴+2x²+2 (đỉnh (±1;3), đáy (0;2), a Đ · b S · c Đ · d Đ); C1.1.5 VD3 dựng f′ mẫu (x+1)(x−2)/∛x² rồi tích phân số → f nghịch biến qua x=0 khi liên tục; VD4 đếm thẳng nghiệm nguyên (5: −1…3) và đối chiếu bằng một f mẫu nghịch biến; C1.1.6 VD3 dấu g′ → (2;4), m·n=8. Tất cả khớp lời giải.
- Hình mới (2) dựng ra ảnh `…\scratchpad\soat2\HS-A\hinh-moi.png` (script `ve.mjs`) và đã nhìn: đồ thị chữ M khớp đề/lời giải; bảng dấu + 0 − ‖ − 0 + với cột kẻ đôi tại x=0 đúng.
- Đối chiếu đề thật `cau-dang.cjs HS C1.1.4/5/6 200` (114/86/28 câu): có câu đồ thị bậc bốn, câu dấu f′ đọc từ đồ thị (T112010101… "f′(x)<0 ∀x∈(a;x₂)"); câu "f xác định với mọi x≠−6, bảng xét dấu f′" (T1120000004041) và bảng dấu f′ với f liên tục ⇒ cả hai ý a), b) của C1.1.5 VD3 đều có đề hỏi; câu f′<0 ∀x, đếm x nguyên thỏa f(22x)<f(x³) (T1120000005913); câu g=−2f đồng biến trên (m;n), n−m lớn nhất (C1.1.6). Số liệu ví dụ mới khác đề (hàm, hệ số, đại lượng hỏi đều đổi).
- Lý thuyết thêm không lặp lý thuyết nhóm C1.1 (nhóm chỉ có định nghĩa, định lí dấu, đọc chiều trên hình). Không có quyết định nào của Thùy trong brief-bo-sung áp riêng cho C1.1; quy ước ad−bc, f″ không xuất hiện trong lượt.
- Rà nhanh phần cũ: không đổi, vẫn hợp lệ.
- Máy kiểm `kiem-moi.mjs HS … C1.1,C1.1.1…C1.1.6`: 1 nhóm · 6 dạng · 16 ví dụ · 8 hình · lỗi 0 · cảnh báo 0.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C1.1.4 | lý thuyết ##TC | toán (hẹp sai) | "đồ thị bậc bốn **trùng phương** có một hoặc ba điểm đổi chiều" → "đồ thị bậc bốn có một hoặc ba điểm đổi chiều" (đúng cho mọi hàm bậc bốn; đề gọi "hàm số đa thức bậc bốn" chung, ví dụ 2 cũng nói "hàm số bậc bốn"). |

## Cần CEO xem

- C1.1.5: ý "cột kẻ đôi" nay nằm ở cả ##TC, ##PP và ##CY (ba lần, cùng nội dung). Không sai, nhưng có thể gọn lại chỉ giữ TC + PP nếu CEO thấy thừa.
- C1.1.6 ví dụ 3 cùng khuôn câu với đề thật (g = −k·f, khoảng đồng biến có n−m lớn nhất) — số liệu và đại lượng hỏi đã đổi (f′=(x−2)(x−4), k=−3, hỏi m·n), không chép đề.
