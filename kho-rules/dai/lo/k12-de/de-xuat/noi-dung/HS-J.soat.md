KẾT LUẬN: ĐẠT

Biên bản soát HS-J (nhóm C4.4 Tối ưu kinh tế, dạng C4.4.1–C4.4.6) — trạm soát Opus, 03/11.

- 1 nhóm · 6 dạng · 12 ví dụ (11 gốc + 1 viết mới), cả 12 tự giải lại bằng máy · 0 hình · 11 chỗ đã sửa.
- Máy kiểm: `kiem-moi.mjs HS noi-dung/HS-J.txt C4.4,C4.4.1…C4.4.6` → lỗi 0, cảnh báo 0.
- Script soát (độc lập trạm soạn): `S\soat\HS-J\giai.cjs` (quét số mịn hoặc quét số nguyên từng ví dụ; quét hai tầng t → x(t) cho C4.4.5; tích phân số chi phí biên cho C4.4.2 VD2) + giải lại 12 câu đề thật để chốt cách hiểu; `tra.cjs`, `dump.cjs` để tra câu đề.
- Miền thực tế: mọi đáp số tối ưu đã đối chiếu đơn vị và điều kiện nguyên/dương — số căn, số sản phẩm, số máy, số hộp, số ngày ra số nguyên; giá, vận tốc dương và nằm trong miền đề cho; đầu mút (C4.4.2 b, C4.4.3 b, C4.4.6 b) đúng.
- Đối chiếu đề thi: đã xem toàn bộ câu ánh xạ của C4.4.3–C4.4.6 (53 câu) và toàn bộ C4.4.1 (50 câu), C4.4.2 lọc theo từ khoá (thuế, vận tốc, chi phí biên, ln, lợi nhuận tối thiểu).
- Đối chiếu sách: trích `S\sach\kt\pnl-b5d4.md` (PNL Bài 05 Dạng 04 kinh tế, bản GV) và `S\sach\kt\tt-b2p2.md` (Từ Tâm C1-B2 GTLN-GTNN P2); hồ sơ `ho-so/hoso-tutam.md`, `hoso-nbv-3-4.md`. Công thức trong sách PNL là ảnh WMF nên chỉ đối chiếu được lời văn và cách giải: khớp L = R − C − thuế, thuế phụ thu hai tầng, thuế xuất khẩu tỉ lệ, số máy, số lô, chi phí trung bình tiến tới tiệm cận, so sánh hai số nguyên sát nghiệm.

## Chốt đích C4.4.4 "thời gian dùng hết nhiên liệu của hai người"
Câu đề là T1120000003349 (câu NEW trong `HS-thongke.md`, đã ánh xạ C4.4.4): An 32 lít, Bình 72 lít, mỗi ngày cả hai dùng tổng 10 lít, đáp 20. Bản đủ của nó với cùng số liệu là T112010403013 (hai tổ sản xuất 32 và 72 sản phẩm, tổng 10 sản phẩm mỗi ngày, đáp 20). Đáp 20 khớp đúng mô hình **tổng số ngày của hai người T(x) = 32/x + 72/(10−x)**, nhỏ nhất tại x = 4. Cách hiểu "hai người dùng song song, số ngày = max" cho 10,4, không khớp đáp án. Vậy đích = khuôn A/x + B/(S−x), một trường hợp riêng của "chia một tổng cố định". Trạm soạn chưa có ví dụ cho kiểu này (và cho rằng T112010403013 mơ hồ) ⇒ đã viết lại ví dụ 2.

## Bảng chỗ đã sửa
| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C4.4.4 | ví dụ 2 | lạc dạng / thiếu kiểu đề hỏi | Thay ví dụ phân bón (khuôn f(x)+g(S−x) có chặn, 1 câu đề) bằng ví dụ hai tài xế 18 lít và 50 lít, tổng 8 lít mỗi ngày, ra x = 3, T = 16 ngày (An 6 ngày, Bình 10 ngày, đều nguyên). Cùng khuôn với 2 câu đề T1120000003349 và T112010403013; khó hơn ví dụ 1 (giải 25x² = 9(8−x)²). |
| C4.4.4 | lý thuyết dạng | thiếu kiểu đề hỏi | Thêm ý T(x) = A/x + B/(S−x) cho hai người hoặc hai tổ, T′ = 0 đưa về Bx² = A(S−x)²; thêm ý n trạm phụ cách đều thì có n+1 khoảng (câu đề T112020401123 trạm 5G, T112020401287 trạm bơm). |
| C4.4.4 | lý thuyết dạng | lặp nhóm | Bỏ ý "biến đếm nguyên thì so sánh hai số nguyên sát nghiệm" (nhóm đã có). |
| C4.4.4 | lý thuyết dạng (##CY) | lặp nhóm | Bỏ ý "nghiệm ngoài miền chặn thì lấy đầu mút" (trùng ##CY nhóm). |
| C4.4.6 | lý thuyết dạng | thiếu kiểu đề hỏi | Thêm: chi phí theo km thì nhân S, theo giờ thì nhân S/v; đi ngược rồi xuôi dòng thì thời gian là S/(v−w) + S/(v+w); lợi nhuận chuyến = tiền vé − chi phí; đổi công suất W sang kWh. Đây là kiểu của 7 câu vận tốc đang nằm nhầm ở C4.4.2/C4.4.3 (đã giải lại: T1120000004272 → 144, T112020401143 → 8,66, T1120000003719 → 30, T112020401004 → 130). |
| C4.4.6 | lý thuyết dạng (##CY) | lặp nhóm | Thay "chi phí mỗi giờ phải nhân số giờ" (trùng nhóm) bằng bẫy riêng của dạng: phân biệt khoản tính theo đồng/giờ với khoản tính theo đồng/km. |
| C4.4.1 | lý thuyết dạng (##CY) | thiếu kiểu đề hỏi | Thêm bẫy phần không bán được vẫn thu tiền (rau thừa bán làm thức ăn, phòng trống cho thuê làm kho: T1120000003263, T1120000003829, T1120000003808). |
| C4.4.2 | lý thuyết dạng | lặp nhóm | Bỏ "chi phí bình quân G(x) thì C = x·G(x)" (nhóm đã có); giữ ý cộng hết các khoản chi phí. |
| C4.4.2 | lý thuyết dạng (##CY) | lặp nhóm | Cả 3 bẫy cũ trùng ##CY nhóm (quên nhân x, nghiệm ngoài miền, đơn vị) ⇒ thay bằng 2 bẫy riêng của dạng: lợi nhuận biên là p − C′(x); bài "ít nhất bao nhiêu sản phẩm để lợi nhuận từ k trở lên" phải lấy số nguyên lớn hơn gần nhất (câu đề T112020401080, T112020401131, T112020401247). |
| C4.4.3 | lý thuyết dạng | lặp nhóm | Bỏ định nghĩa chi phí trung bình bằng C(x)/x (nhóm đã có); thêm ý chi phí trung bình theo thời gian thì chia cho thời gian (câu đề T112020401377, T112020401372). |
| C4.4.5 | lý thuyết dạng (##CY) | lặp nhóm | Bỏ "chi phí một sản phẩm g(x) thì tổng chi phí là x·g(x)" (trùng ##CY nhóm). |

Các ví dụ còn lại (C4.4.1 VD1–2, C4.4.2 VD1–2, C4.4.3 VD1–2, C4.4.4 VD1, C4.4.5 VD1–2, C4.4.6 VD1–2) tự giải lại đều đúng đáp số, đúng dạng, ví dụ 2 khó hơn ví dụ 1; ##PP đều có 4–5 bước.

## Cần CEO xem
- **Ánh xạ câu đề lệch dạng (đã xác nhận bằng cách giải lại):** T112020401351 (thuế đặc biệt t, cầu Q = 5000 − P/3, đáp Q = 800) đang ở C4.4.1 → đúng là **C4.4.5**. T112020401004 (tàu cao tốc 60 km, thời gian ≤ 1 giờ 30 phút ⇒ v ≥ 40, tối ưu ở đầu mút v = 40, giá vé 130 nghìn) đang ở C4.4.2 → đúng là **C4.4.6**.
- Cùng loại lệch (đúng như mô tả C4.4.5/C4.4.6 dự báo): thuế phụ thu hai tầng T112020401113, T112020401201, T112020401261, T112020401370 (C4.4.2 → C4.4.5; đáp đều bằng t = m/2, đã kiểm). Vận tốc: T1120000004272, T112020401092, T112020401112, T112020401136, T112020401143, T112020401172 (C4.4.2) và T1120000003719 (C4.4.3) → C4.4.6. Câu T112020401296 (cho sẵn C(v) = 16000/v + 5v/2) đang ở C4.4.3, các bản giống nó (T112020401157, T1120000006559) nằm ở C4.1.1 ⇒ nên gom về C4.1.1.
- C4.4.4: ví dụ 2 được viết mới theo khuôn "hai người" thay cho ví dụ phân bón. Khuôn "tổng hai hàm theo x + y cố định có chặn" (đề T112020401286, đáp số ngày nguyên 4) giờ chỉ còn ở lý thuyết. Nếu muốn giữ cả hai thì cần thêm ví dụ thứ ba hoặc tách dạng.
- C4.4.3: T112020401365 hỏi "chi phí trung bình TỐI ĐA" nhưng đáp 250 là giới hạn dưới (chi phí trung bình luôn lớn hơn 250) ⇒ đề viết sai chữ. T1120000004411 (thuế 15%) trong C4.4.2 không có đáp án.
- C4.4.2: câu chi phí biên hỏi GIÁ TRỊ lợi nhuận (T1120000001127) cần nguyên hàm, ngoài chương ⇒ ví dụ chỉ hỏi sản lượng (giữ như trạm soạn).
