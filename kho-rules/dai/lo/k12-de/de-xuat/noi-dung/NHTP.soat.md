KẾT LUẬN: ĐẠT

Chương NHTP · dạng THÊM M1 «Tính tích phân từ nguyên hàm cho sẵn (F(b)−F(a))» vào nhóm NNB01217 · 0 nhóm · 1 dạng · 5 ý ví dụ cũ + 2 ý mới đã tự giải lại bằng máy (7/7 khớp) · 1 hình (mới) đã dựng và kiểm · 7 chỗ sửa.
Bản gốc trạm soạn: `NHTP.goc.txt`. Script soát: `S\soat\NHTP\thu-M1.mjs` (Simpson + sai phân, quét cực trị hình), truy vấn DB chỉ đọc `S\soat\NHTP\db.cjs` (transaction read only).
Máy kiểm: `kiem-moi.mjs NHTP noi-dung/NHTP.txt M1` → 1 dạng · 2 ví dụ · 1 hình · lỗi 0 · cảnh báo 0.

## Đã đối chiếu
- DB (SELECT): lý thuyết nhóm NNB01217 «Áp dụng định nghĩa – tính chất» (đã có ĐN $F(b)-F(a)$, 5 tính chất, ý nghĩa hình học, $\int f'=f(b)-f(a)$); dạng lân cận NDB00751, NDB00752 (Thùy viết: ly_thuyet trống, 2 ví dụ ngắn) và NDB00747 (đã ở nhóm Nguyên hàm NNB01407). M1 không trùng việc của 751 (cận/nối cận) và 752 (tổng hiệu khi cho sẵn tích phân).
- Sách (trích vào `S\sach\nhtp\`): Từ Tâm `C4-B2-TÍCH PHÂN-P1.docx` (lý thuyết + Dạng 1) · NBV `12-17 TICH PHAN\A. LY THUYET.docx` · PNL `Bài 02_Dạng 01 …_GV.docx`. Khớp SGK: "$F$ là một nguyên hàm bất kì", quy ước đảo cận, $\int f'=f(b)-f(a)$. Công thức trong sách là ảnh WMF, chỉ đối chiếu được phần chữ.
- Đề thật: `cau-dang.cjs NHTP M1 53` — đủ 53 câu: chọn mệnh đề/định nghĩa (~25, gồm $F,G$ hai nguyên hàm, $F(0)-F(1)=\int_1^0 f$), cho $F$ công thức / $F(a),F(b)$, $\int f'$ từ giá trị/đồ thị (3 câu đồ thị)/công thức $f$/giao với đường thẳng, hỏi ngược $F(a)$, $f(a)$, có hằng số $k$, $c$.

## Chỗ đã sửa
| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| M1 | lý thuyết dạng ##TC | lặp nhóm | Bỏ khung chép lại ĐN Newton–Leibniz và $\int f'=f(b)-f(a)$ (đã có ở NNB01217); thay bằng 4 ý riêng đề M1 hỏi: hai nguyên hàm cho cùng kết quả, $F(a)-F(b)=\int_b^a f$, cho công thức $f$ thì khỏi tính $f'$, $f(a)$ đọc từ đồ thị/điểm thuộc đường |
| M1 | lý thuyết dạng ##CY | lặp nhóm / thiếu bẫy đề | Bỏ ý "đảo cận" chung; thêm $\int k f'=k[f(b)-f(a)]$ (đề: $\int 2f'$, $\int 7f'$) và bẫy nhầm $\int f=f(b)-f(a)$ (phương án nhiễu phổ biến nhất) |
| M1 | ##PP | trình bày | Bước hỏi ngược mở rộng cho cả $F(a)$ (đề T1120000007002, T112000000405) |
| M1 | ví dụ 1 b) | bám đề | Đổi thành $\int_5^1 f$ để luyện hiệu ngược (đề hỏi $F(0)-F(1)$); đáp số $-8$ |
| M1 | ví dụ 2 b) + hình | thiếu kiểu đề | Thêm ý đọc đồ thị $\int_{-1}^1 2f'$ (mô tả dạng và 3 câu đề có); hình $f=x^3-3x+1$, CĐ $(-1;3)$, CT $(1;-1)$, tỉ lệ 1:1; $J=-8$ |
| M1 | ví dụ 2 c) | số liệu | Đổi tên hàm $g$ (tránh trùng $f$ ở ý a của cùng ví dụ) và dữ kiện cho $g(2)=1$ thay vì $0$ |
| M1 | GHI CHÚ | khuôn | Viết lại: bỏ dòng "chưa đọc sách", ghi nguồn đã đối chiếu |

## Cần CEO xem
- M1: khoảng một nửa câu đề là trắc nghiệm "chọn mệnh đề đúng"; ví dụ tự luận không có ý dạng này (chỉ phủ qua ##TC/##CY) — nếu muốn, thêm một ý a)/b) "đúng hay sai" vào ví dụ 1.
- M1: câu "bậc hai cắt đường thẳng $y=9x+8$ tại $x=-1$, $x=4$, tính $\int f'$" chỉ 1/53 câu, đã nhắc trong ##TC nhưng không làm ví dụ.
