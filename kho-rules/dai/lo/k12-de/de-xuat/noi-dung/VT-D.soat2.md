KẾT LUẬN: ĐẠT (sau khi sửa 1 lỗi toán + 2 chỗ lệch kiểu đề)

# Biên bản soát lần 2 — phần BỔ SUNG lượt VT-D (03/11)

Phạm vi: `diff VT-D.truoc-bs.txt VT-D.txt` (C3.5.2 lý thuyết + VD3, VD4 · C4.2.1 lý thuyết + VD3 · C4.3.2 lý thuyết + VD3 · GHI CHÚ), rà nhanh phần cũ. Bản trước soát 2: `VT-D.truoc-soat2.txt`.
Tự giải lại: `S\soat2\VT-D\kiem.cjs` (quét lưới/tối ưu số, độc lập trạm soạn) — 4 ví dụ mới/đổi + 2 ví dụ cũ đã thay + 5 câu đề thật (T312000000069 → 10, T312000000090 → 6,71, T312000000269 → 14, T312000000142 bỏ cột → 5,70, kiểm công thức ca h < d) đều khớp.
Đối chiếu đề thật: `cau-dang.cjs VT C3.5.2 30` và nội dung T312000000269, T1120000006474, T312000000142, T312000000100, T312010802051, T312010802024.
Máy kiểm `kiem-moi.mjs VT … C3.5,C4.1,C4.2,C4.3,…`: 4 nhóm · 8 dạng · 20 ví dụ · lỗi 0 · cảnh báo 0.

## Chỗ đã sửa

| # | Vị trí | Loại | Trước | Sau | Lý do |
|---|---|---|---|---|---|
| 1 | C3.5.2 ##TC ý "hai điểm M, N" + ##CY | Sai toán | "Nếu h ≥ d thì min = √((h−d)²+v²)"; CY: "nếu h < d thì giá trị nhỏ nhất là v" | Công thức √((h−d)²+v²) đúng mọi trường hợp; bỏ câu h < d | A₁ chạy trên ĐƯỜNG TRÒN bán kính d (không phải hình tròn) nên khoảng cách ngang nhỏ nhất là \|h−d\|. Kiểm số: A(0;0;1), B(1;0;2), d=3 ra √13 ≈ 3,606, không phải 3 |
| 2 | C3.5.2 ý/PP/CY/VD4 "M thuộc trục" | Lệch kiểu đề (ý đề không hỏi) | Công thức tổng quát qua khoảng cách đến trục r=√(x²+z²), VD A(3;2;4), B(6;10;8) | Thu hẹp: A, B trong mặt phẳng toạ độ chứa trục, đối xứng qua trục rồi cho thẳng hàng; VD4 mới bối cảnh flycam A(0;1;6), B(0;9;9) → M(0;21/5;0), 17 km | **Quyết GIỮ** ý: có 1 câu đề thật T312000000269, luật bổ sung cho phép kiểu có câu thật và Thùy yêu cầu bổ sung chỗ thiếu. Nhưng câu đề có hai flycam nằm trong (Oyz) — công thức r=√(x²+z²) là thứ đề không hỏi ⇒ bỏ. Số liệu không chép đề |
| 3 | C4.2.1 ##TC/PP/CY/VD3 dây điện dọc tường | Lệch kiểu đề (thấp hơn mức đề) | Hai tường KỀ, một điểm gấp (5 m) | Hai tường ĐỐI DIỆN, dây qua tường giữa, hai điểm gấp: phòng 6×4×3, A(1;0;2,75), B(1;4;0,25) → 6,5 m, P(0;0;7/3), Q(0;4;2/3); so sánh đường vòng phía kia (14 m ngang, dài hơn) | Cả hai câu đề thật cùng bài (T1120000006474 = T312000000142) đặt đèn và công tắc trên hai tường đối diện; lý thuyết tổng quát lên 3 vectơ |
| 4 | C3.5.2 VD3, C4.2.1 TC/VD3 | Ranh giới VT/PPTD | "mặt phẳng z=−2", "mặt phẳng y=4", "mép x=0, y=4" | Nói bằng cao độ / "tường đối diện" / "trục Oz" | Tránh viết mặt phẳng bằng phương trình |
| 5 | GHI CHÚ C4.2.1 | Nhầm mã câu | "T312000000100 — phòng có cột; T312000000142 — dây LED sân" | Đổi lại đúng: T142 là phòng, T100 là dây LED sân | Đọc đề thật |

Không đổi: C3.5.2 VD3 (13 — đúng, kiểu khớp T069/T090, số khác đề); C4.3.2 VD3 (lần đầu còn 25 km sau 2 phút, dưới 25 km trong 8 phút, nhỏ nhất 15 km lúc t=6 — đúng, khớp kiểu T051 "lần đầu chạm mốc" + T024 "thời gian trên màn radar"). Rà phần cũ: không còn phương trình mặt cầu/mặt phẳng/đường thẳng (chỉ còn "hệ phương trình" ẩn lực căng ở C4.1.2 — đúng phạm vi).

## Cần CEO xem
- **C4.3.1 ↔ C4.3.2 chồng nhau:** mô tả MỚI của C4.3.2 là "hai vật chuyển động, khoảng cách nhỏ nhất…", nhưng C4.3.1 vẫn giữ ý "hai vật, khoảng cách nhỏ nhất ở đỉnh tam thức" + VD2 (hai flycam, 12 m) theo mô tả cũ của C4.3.1 ("gồm ~7 câu khoảng cách nhỏ nhất… gộp"). Đề nghị: chuyển ý + VD2 đó sang C4.3.2 (và sửa mô tả C4.3.1), hoặc giữ như cũ. Chưa sửa vì đổi phân dạng.
- C4.3.2: VD1 (radar đứng yên, IM ≤ R) và VD2 (tỉ lệ thời gian, cùng xuất phát O) không còn khớp chữ "hai vật chuyển động" trong mô tả mới, dù đề thật có nhiều câu loại này. Cần chốt mô tả có gồm "radar cố định/tỉ lệ thời gian" không.
- C4.2.1: chi tiết "cột nhô ra trên tường" của bài phòng (đáp án 6,09 thay vì 5,70 khi bỏ cột) chưa đưa vào ví dụ — chỉ 1 bài đề.
