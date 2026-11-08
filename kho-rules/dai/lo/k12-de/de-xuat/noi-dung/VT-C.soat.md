KẾT LUẬN: ĐẠT

# Biên bản soát VT-C (Opus) — 03/11

- Phạm vi: 3 nhóm (C3.2, C3.3, C3.4) · 8 dạng (C3.2.1–C3.2.3, C3.3.1–C3.3.2, C3.4.1–C3.4.3) · 16 ví dụ · 0 hình.
- Nguyên bản trạm soạn: `noi-dung/VT-C.goc.txt`.
- Máy kiểm `kiem-moi.mjs VT … <11 mã>`: lỗi 0 · cảnh báo 0 (trước và sau khi sửa).
- Tự giải lại bằng script riêng `S\soat\VT-C\kiem.mjs`: 16/16 ví dụ, 69 phép kiểm đều đúng (toạ độ, độ dài, góc bằng arccos, quét tham số nguyên, kiểm phân giác bằng hai góc bằng nhau, kiểm hình hộp không dẹt, kiểm đường cao bằng chân đường cao). Số liệu mới tìm bằng `S\soat\VT-C\tim.mjs`, `tim2.mjs`. Bản gốc của trạm soạn không có lỗi tính toán; các sửa đổi là bám đề thi, trùng lặp, suy biến.
- Đối chiếu đề thi thật: toàn bộ câu đề của 8 dạng (`cau-dang.cjs VT <dạng> 200`, lưu ở `S\soat\VT-C\de-*.txt`; 68/57/32/42/7/78/14/16 câu).
- Đối chiếu sách: PNL ch.2 (`pnl-b2d1`, `pnl-b2d2`, `pnl-b3d1`, `pnl-b3d2`), Từ Tâm ch.2 (`tt-b1-P1`, `tt-b1-P2`, `tt-b3p1`, `tt-b3p2`), NBV 12-9 (`vt-nbv/A._LY_THUYET.md`, `B._TU_LUAN.md`, `C._BAI_TAP_TRAC_NGHIEM.md`, `E._TRA_LOI_NGAN.md`, trùng với `vt/nbv-9-*.md`). Công thức trong sách là ảnh WMF; đối chiếu được mục lục, phân dạng, ý ví dụ và lời văn.
- Số chỗ đã sửa: 15.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C3.2.1 | lý thuyết dạng | thiếu ý đề hỏi | Thêm "biết A và trung điểm M của BC thì AG = 2/3 AM" (đề có 3 câu kiểu này). |
| C3.2.2 | lý thuyết dạng | thiếu ý đề hỏi | Thêm "tâm hình hộp = trung điểm AC′" (đề có 3 câu). |
| C3.2.3 | ví dụ 2 | suy biến | BC cũ song song trục Ox (B, C cùng y, z) nên hai thành phần y, z hiển nhiên; đổi sang A(1;2;−1), B(−1;1;1), C(7;5;5), AB = 3, AC = 9, D(1;2;2), cả ba phương trình đều phải giải. |
| C3.3 | lý thuyết nhóm | ý thừa | Bỏ "\|u\| = 0 khi và chỉ khi u = 0" (đề không hỏi). |
| C3.3 | lý thuyết nhóm ##CY | trình bày | Ý 2 cũ không phải bẫy (lặp ##PP); thay bằng bẫy dấu khi bình phương hiệu toạ độ âm. |
| C3.3.2 | lý thuyết dạng | thiếu ý đề hỏi | Thêm "cách I không quá R ⇔ MI² ≤ R²" (câu drone đề thật). |
| C3.3.2 | ##PP | thiếu ý đề hỏi | Bước 3–4 bao cả bất phương trình. |
| C3.3.2 | ##CY | lặp lý thuyết nhóm | Ý 1 cũ ("đừng khai căn, so sánh bình phương") trùng nhóm; thay bằng bẫy "không quá = ≤, đếm số nguyên trong khoảng". |
| C3.3.2 | ví dụ 2 | thiếu kiểu đề | Thêm b) P(m; m+1; 3), PI ≤ 5, đếm số nguyên m (6 giá trị). |
| C3.4.1 | lý thuyết dạng + ##PP + ##CY | thiếu ý đề hỏi | Đề có ≥6 câu "tìm m để góc giữa hai vectơ bằng 60°/120°…"; thêm cách lập phương trình cos, điều kiện dấu trước khi bình phương, bẫy nghiệm của góc bù. |
| C3.4.1 | ví dụ 2 | trùng ví dụ 1 | Ví dụ 2 cũ dùng đúng cặp vectơ (1;1;0), (−1;0;1) của ví dụ 1 (BA, BC). Thay bằng a) góc lớn nhất của tam giác A(3;3;2), B(1;2;0), C(−2;−1;0) = 135° (kiểu đề "góc lớn nhất có số đo a°"); b) u = (1;0;1), v = (1;1;m), góc 120° ⇒ m = −4 (loại m = 0). |
| C3.4.2 | lý thuyết dạng | trình bày | "H nằm trong mặt phẳng tam giác" ghi rõ thành điều kiện AH, AB, AC đồng phẳng. |
| C3.4.3 | lý thuyết dạng | ý thừa / thiếu ý đề hỏi | Bỏ "chiều cao tứ diện h = 3V/S" (đề không hỏi); thêm "đường cao tam giác AH = 2S/BC" (đề có) và "mọi vectơ vuông góc với cả a, b có dạng k[a,b]" (đề có câu c = (12;m;n)). |
| C3.4.3 | ví dụ 1 | thiếu kiểu đề | a) thêm tìm w có cao độ 10 vuông góc với u, v ⇒ (−2;14;10); b) thêm đường cao từ A = 3√5/5. |
| C3.4.3 | ví dụ 2 | ý thừa | Bỏ phần chiều cao tứ diện; giữ thể tích (ghi \|5\|) và đồng phẳng. |
| — | GHI CHÚ CHO CEO | nội dung sai | Sửa nhận định "tích có hướng không có trong SGK": NBV 12-9 (Cánh Diều) và PNL đều có mục tích có hướng; cập nhật danh sách sách đã đọc (thêm NBV 12-9). |

## Cần CEO xem

- **C3.4.3** — câu `T112020302060` ("Đồ thị ở hình sau là đồ thị của hàm số nào") là câu Hàm số bị gắn nhầm vào dạng tích có hướng trong `VT-cau.tsv`; cần chuyển về chương HS.
- **C3.4.3** — tích có hướng: SGK Cánh Diều (qua NBV 12-9) có giới thiệu, nhưng công thức diện tích/thể tích/đồng phẳng bằng tích có hướng là ngoài SGK; đã giữ vì đề và cả ba sách dùng. Công thức toạ độ đã kiểm bằng máy.
- **C3.4.3** — "vectơ pháp tuyến của (ABC)" là khái niệm chương PP toạ độ; giữ trong VT vì đề xếp 2 câu chỉ hỏi tên gọi này vào dạng (không dùng phương trình mặt phẳng). CEO xác nhận ranh giới.
- **C3.4.3** — mô tả dạng có "thể tích hình hộp" nhưng 16 câu đề không có câu nào; lý thuyết giữ một dòng vì mô tả (ĐÍCH) có nêu. Bỏ hay giữ?
- **C3.4.1 / C3.4.2** — kiểu "tìm m để góc giữa hai vectơ bằng 60°/120°" đang được xếp vào C3.4.1 trong đề thật, trong khi mô tả C3.4.2 ("tích vô hướng bằng 0 hoặc giá trị cho trước") cũng gần; đã đưa vào C3.4.1 theo cách xếp đề.
