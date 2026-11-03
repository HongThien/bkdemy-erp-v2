KẾT LUẬN: ĐẠT

# Biên bản soát HS-F (03/11) — nhóm C2.2 + dạng C2.2.1–C2.2.6

- 1 nhóm · 6 dạng · 12 ví dụ đã tự giải lại bằng máy (12/12 đúng sau sửa) · 4 hình đã kiểm (giá trị đọc từ hình khớp công thức vẽ) · 9 chỗ sửa.
- Máy kiểm: `kiem-moi.mjs HS noi-dung/HS-F.txt C2.2,C2.2.1..C2.2.6` → lỗi 0, cảnh báo 0.
- Script soát (độc lập trạm soạn): `S\soat\HS-F\kiem.cjs` — quét lưới tìm cực trị, giải hệ bậc ba bằng Gauss, quét m cho đơn điệu/cực trị/vuông góc, kiểm đối xứng tâm f(x0−t)+f(x0+t)=2f(x0); thêm 4 câu đề thật để thử các ý lý thuyết mới (T1120000006276 = 4, T1120000006638 = 3, T112000000462 = 9, T112020105015 ≈ 2,7: đều khớp đáp án đề).
- Đối chiếu đề thi: `cau-dang.cjs HS C2.2.x` (44 / 36 / 17 / 18 / 32 / 3 câu).
- Đối chiếu sách: trích mới `S\sach\nbv121-lt.md`, `nbv122-lt.md`, `nbv125-lt.md`, `nbv125-tl.md` (NBV NEW FULL 12-1, 12-2, 12-5); PNL Bài 1 Dạng 03 GV (`S\txt\pnl\…`); hồ sơ `k12-hs/ho-so/hoso-nbv-5-6-7.md`. Công thức trong Word là ảnh WMF, chỉ so được lời văn: tâm đối xứng (hoành độ nghiệm y″=0), cực trị theo dấu y′, PNL dùng điều kiện y″ và hệ thức Viète, "tam giác vuông ⇔ tích vô hướng bằng 0" — khớp nội dung đã viết.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C2.2 | lý thuyết nhóm | thiếu ý đề hỏi | Thêm ý "Δ′ là bình phương ⇒ y′=0 có nghiệm viết theo m, dùng thẳng" (đề hỏi ở cả C2.2.5 lẫn C2.2.6: nghịch biến trên (0;1), hai cực trị trong (−2;3)); đặt ở nhóm để hai dạng không lặp nhau. |
| C2.2.2 | ví dụ 2 | trình bày | Đề "điểm cực đại A với hoành độ 1, giá trị cực đại bằng 2" viết gọn thành "điểm cực đại A(1;2), đạt cực tiểu tại x=3". |
| C2.2.3 | ví dụ 2 | trình bày (gần chép đề) | Hàm ⅓x³−2x²+3x+1 gần như lật dấu câu đề T1120000003285 (−x³/3+2x²+3x+1, cùng hỏi P=a+3b) ⇒ đổi sang −⅓x³+x²+3x−1, đáp số P=9 (hệ số âm làm bẫy mẫu số −b/(3a) rõ hơn). |
| C2.2.4 | lý thuyết dạng | ý đề không hỏi | Bỏ song song / vuông góc / đối xứng qua đường thẳng d và khoảng cách từ O đến AB: không câu đề nào trong 18 câu hỏi kiểu này. |
| C2.2.4 | lý thuyết dạng | thiếu ý đề hỏi | Thêm diện tích tam giác tạo bởi AB và hai trục (s²/(2|r|), đề T112020105017) và tam giác OAB vuông tại O ⇔ x_Ax_B+y_Ay_B=0 (đề T1120000005950). |
| C2.2.4 | ##PP, ##CY | lạc dạng / ý thừa | PP bỏ bước "song song, vuông góc, đối xứng"; CY thay bẫy "đối xứng cần đủ hai điều kiện" bằng bẫy "thử lại m: không có hai cực trị hoặc A/B trùng O thì loại". |
| C2.2.4 | ví dụ 2 | ý đề không hỏi | Thay bài "A, B đối xứng qua y=x" bằng bài cùng kiểu với đề: y=x³−3mx²+4m, tìm m để tam giác OAB vuông tại O ⇒ 16m²(1−m²)=0, loại m=0 ⇒ m=±1 (máy kiểm cả ba giá trị). |
| C2.2.5 | lý thuyết dạng + ##PP | thiếu ý đề hỏi | Thêm cách làm khi không cô lập được m nhưng y′=0 có nghiệm theo m: "nghịch biến trên K ⇔ K⊂[x₁;x₂]" (đề T1120000006276). |
| C2.2.6 | lý thuyết dạng | thiếu ý đề hỏi | Thêm hệ thức không đối xứng (x₁+2x₂=1, đề T112020105015) và "hai cực trị nằm trong (α;β)" bằng nghiệm viết theo m (đề T1120000006638), hai câu đang nằm ở C2.2.5 sẽ chuyển sang. |

## Đã kiểm, giữ nguyên
- C2.2.1 VD1/VD2: hình x³−6x²+9x+1 (cực trị x=1, 3) và −x³−3x²+2 (cực trị (−2;−2), (0;2)) đọc đúng; dấu a,b,c,d đúng; VD2 có hệ số bằng 0, khó hơn.
- C2.2.2 VD1 f=x³−3x+4 (f(3)=22, T=8), VD2 f=x³−6x²+9x−2 (f(−1)=−18); loại cực trị khớp.
- C2.2.3 VD1 tâm I(2;2) khớp điểm ghi trên hình.
- C2.2.4 VD1: A(0;1), B(2;−7), phép chia y=(x/3−1/3)y′−4x+1 đúng, AB=2√17, S=1.
- C2.2.5 VD1: 7 giá trị (−1..5); VD2: m≥0, m=0 nhận (quét x>2).
- C2.2.6 VD1: a+b=−31 (A(−3;5) đúng là CĐ), m∈{3,4,5}; VD2: m=2 cho Δ′=0 (y′=3(x−3)²) bị loại đúng, m=−7/2 cho x₁²+x₂²=18.
- Chi tiết cố ý C2.2.6 VD2 (loại m=2): đúng. Chi tiết C2.2.4 VD2 cũ (m²=½) đúng về toán nhưng cả ví dụ bị thay vì đề không hỏi kiểu đối xứng qua đường thẳng.

## Cần CEO xem
- C2.2.5: phạm vi lý thuyết (chỉ đơn điệu) đúng mô tả; không cần sửa phạm vi dạng. Cần gắn lại câu: khoảng 11 câu cực trị theo m → C2.2.6; 2 câu "góc OAB nhọn" (T1120000005931, T112020105013) → C2.2.4; 2 câu GTLN theo m (T1120000006683, T112010402127) → chương GTLN–GTNN.
- C2.2.6: chỉ 3 câu đề thật; kiểu "cực đại tại 0 của x¹²+…" mới có trong lý thuyết, chưa có ví dụ; kiểu xác suất ghép hai trùng phương chưa có ví dụ. Có muốn thêm ví dụ thứ ba không.
- C2.2.4: câu "MA+MB nhỏ nhất với M trên đường thẳng qua hai cực trị" (T112020401099) dùng kiến thức lớp 10, chưa đưa vào lý thuyết.
- C2.2.6: điều kiện đủ bằng y″ không có trong lý thuyết SGK (NBV 12-2 chỉ dạy dấu y′) nhưng PNL dùng; đang giữ.
