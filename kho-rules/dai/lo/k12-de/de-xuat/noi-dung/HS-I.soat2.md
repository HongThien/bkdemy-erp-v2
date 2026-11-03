KẾT LUẬN: ĐẠT

# Soát phần BỔ SUNG — HS, lượt I (C4.1, C4.2) — trạm soát 2 (Opus, 03/11)

Phạm vi: `diff HS-I.truoc-bs.txt HS-I.txt` — lý thuyết thêm ở C4.1.3, C4.2.2, C4.2.3; ví dụ 3 mới ở C4.1.3 (a căn, b thuế chia khúc, c hàm mũ), C4.2.2 (a lưới qua cọc, b máng nước theo góc), C4.2.3 (a bến thuyền–con đường, b điểm trên parabol gần điểm A). Phần cũ: rà nhanh, không đổi gì ngoài hình C4.1.2.

Tự giải lại bằng máy: `S\soat2\HS-I\giai.cjs` (quét lưới 10⁶ điểm, 7 đáp số: 81 · 112 [P(111)=−0,3; P(112)=2,4] · 201 [P(200)≈29910,5; P(201)≈30060,3; e⁶≈403,4] · S_min=24 tại t=8 · S_max=300√3 tại θ=π/3 · 0,745 đv ≈ 75 m tại x=2 · MA_min=4) — tất cả khớp lời giải. Miền thực tế: các nghiệm tối ưu đều nằm trong miền (t>4, 0<θ<π/2, 0≤x≤5, khúc 80–200, [100;3000]).
Đối chiếu đề thật (`S\soat2\HS-I\tim.cjs`, lọc HS-cau.tsv): C4.1.3 có câu căn `10√v−v` (T1120000004228), thuế chia khúc (T112020401221), mũ `100e^{0,001x}` (T112020401293) → ví dụ mới cùng kiểu, số liệu khác đề. C4.2.2 có máng tôn (T112020401055, …233, T1120000004008) và lưới qua cọc (T1120000005696) → khớp. C4.2.3 có bến thuyền–con đường (T1120000005976) → khớp ý a; **không có câu nào hỏi khoảng cách điểm trên parabol đến điểm cố định** (kiểu parabol–đường tròn nằm ở C4.3.2).
Phạm vi chương: hàm mũ chỉ cần (e^{kx})′ (lớp 11) để chứng minh đồng biến, ngưỡng tìm bằng máy tính — đúng cách đề làm; căn dùng (√x)′ lớp 11. Không vượt chương.
Hình: theo LUẬT ĐỒ THỊ 1:1 (Thùy 03/11) dựng lại cả 3 hình bằng `ve.mjs` mới (`S\soat2\HS-I\h1..h3.png`), đối chiếu giá trị đọc từ hình.

## Chỗ đã sửa

| # | Vị trí | Loại lỗi | Sửa |
|---|---|---|---|
| 1 | C4.2.3 VD3 b) (điểm M trên parabol y=x²/4 gần A(0;5)) | Ý đề không hỏi ở dạng này / lạc dạng anh em (C4.3.2); "cổng chào" mà parabol quay lên | Xoá ý b) cùng lời giải; VD3 còn một ý (bỏ nhãn a) |
| 2 | C4.2.3 lý thuyết dạng, gạch "Khoảng cách từ điểm trên đường cong" | Ý thừa (MA điểm–điểm, theo cùng lý do #1) | Bỏ câu về MA, giữ công thức điểm–đường thẳng |
| 3 | C4.1.2 VD2 a), hình `x^3-9*x^2+24*x` (x∈[−1;7], y∈[−5;40]) | Hình lỗi luật 1:1 (hai trục khác đơn vị: phút – mét) | Thêm `"tyle":"tudo"` |
| 4 | GHI CHÚ CHO CEO, mục C4.2.3 | Cập nhật theo #1 | Ghi rõ kiểu parabol–điểm/đường tròn thuộc C4.3.2 |

Hai hình còn lại (C4.2.3 VD1 cổng parabol, VD2 cầu hẻm núi) cùng đơn vị hai trục, tỉ lệ 1:1 hiển thị tốt; A(−3;0), B(3;0), I(0;6) và O, D(6;6), đáy hẻm ≈(3,6;−4,2) khớp đề + lời giải.

Máy kiểm: `kiem-moi.mjs HS HS-I.txt C4.1,C4.2,C4.1.1–4,C4.2.1–3` → 2 nhóm · 7 dạng · 17 ví dụ · 3 hình · lỗi 0 · cảnh báo 0.

## Cần CEO xem
- C4.1.3 VD3 c): giống đề thật, phần mũ gần như không ảnh hưởng ngưỡng (60e^{0,4}≈90 triệu so với 30 tỉ) nên đáp số ≈ 30000/150 + 1. Đúng kiểu đề (đề thật cũng vậy: ĐA 126) — giữ nguyên.
- C4.2.3 VD2 hình: nhãn "OD" ở đầu đoạn thẳng đè sát nhãn điểm D (thẩm mỹ, không sai số liệu).
