KẾT LUẬN: ĐẠT (sau khi sửa)

# Biên bản soát HS-H — C3.1, C3.2, C3.3 (03/11, trạm soát Opus)

- 3 nhóm · 7 dạng · 14 ví dụ, cả 14 đã tự giải lại bằng script riêng (`S\soat\HS-H\kiem.cjs`: quét nghiệm, sai phân đạo hàm, quét GTNN, đếm điểm nguyên, quét m) · 5 hình đã kiểm: giá trị đọc từ hình (giao điểm, cực trị, đường tiệm cận) khớp công thức vẽ.
- Máy kiểm `kiem-moi.mjs HS … <10 mã>`: lỗi 0, cảnh báo 0.
- Bản gốc trạm soạn: `HS-H.goc.txt`. Số chỗ sửa: 12.
- Đối chiếu đề thật: `cau-dang.cjs HS <dạng>` cho cả 7 dạng (C3.1.1: 6 câu · C3.1.2: 48 · C3.1.3: 5 · C3.2.1: 5 · C3.2.2: 2 · C3.3.1: 14 · C3.3.2: 12).
- Đối chiếu sách (trích bằng `docx-doc.mjs` vào `S\sach\c3h\`): PNL `Bài 04_Dạng 04. Ứng dụng khảo sát hàm số vào bài toán thực tế_GV` · NBV `12-6 HAM SO HUU TI/A. LY THUYET` và `F. BAI TAP NANG CAO - DA` · Từ Tâm `C1-B4-KHẢO SÁT VÀ VẼ ĐỒ THỊ HÀM SỐ CƠ BẢN-P2`. Công thức tiếp tuyến, tiệm cận, khoảng cách khớp SGK; lấy thêm từ PNL cách "điểm gần nhất = tiếp điểm của tiếp tuyến song song với đường" cho bài hồ/đảo.

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C3.1 | lý thuyết nhóm | trình bày (lặp) | Bỏ ý Viète khỏi nhóm (chỉ C3.1.3 dùng, dạng đã nêu lại) |
| C3.1.1 | lý thuyết dạng | thừa so với đề | Bỏ ý "mẫu hệ số $c\ne\pm1$" và chú ý tương ứng (6 câu đề đều mẫu $x+d$); nêu rõ trường hợp hàm nhất biến $a=0$ |
| C3.1.1 | lý thuyết dạng (CY) | bổ sung theo đề | Thêm chú ý viết đúng $(0;y_0)$ / $(x_0;0)$ khi đọc giao điểm từ hình (đề hỏi kiểu này 2/6 câu) |
| C3.1.2 | ví dụ 2 b) | lạc dạng | Ý "giao với hai trục, tính $6a+4b$" thuộc C3.1.1 theo mô tả cây → thay bằng "đếm $m$ nguyên để $y=m$ không cắt đồ thị phân thức" (câu đề thật của dạng), có lập BBT |
| C3.1.2 | lý thuyết dạng | thiếu so với đề | Thêm ý hàm trùng phương cắt $y=m$ tại 4 điểm và ý "đề cho công thức thì lập BBT" (đề có các câu đó); PP bước 2 nói rõ |
| C3.1.3 | lý thuyết dạng | thừa so với đề | Bỏ trung điểm, $x_1^2+x_2^2$, bước "đối chiếu điều kiện tham số" (5 câu đề không có tham số, không hỏi trung điểm); thêm đổi $Ax+By+C=0$ về $y=kx+n$, $MN$ trên $Ox$, cách kẹp $a_n$ |
| C3.1.3 | lý thuyết dạng (CY) | thừa so với đề | Thay chú ý về tham số bằng bẫy "cùng hệ số $x^2$ → phương trình bậc nhất, nghiệm trùng mẫu phải loại" (câu $OM$ của đề) |
| C3.1.3 | ví dụ 2 | thừa so với đề | Thay bài "tìm $m$ để trung điểm thuộc đường thẳng" (đề không hỏi) bằng: a) $y_1+y_2$ với $d$ dạng tổng quát; b) $\lim a_n$ (hai kiểu câu đề thật; mô tả có "giới hạn của hoành độ giao điểm" mà bản soạn không có ví dụ nào) |
| C3.3 | lý thuyết nhóm | trình bày (lặp) | Ý toạ độ $M\left(x_I+u;y_I+\frac{K}{u}\right)$ lặp với C3.3.1 → nhóm chỉ giữ $M(t;f(t))$ |
| C3.3.1 | lý thuyết dạng | thiếu so với đề | Thêm: tích khoảng cách tới TCĐ và tiệm cận xiên (câu vệ tinh); bài thực tế hồ/đảo/sông và quy đổi đơn vị; tiếp tuyến song song $d$; $MI^2$ với $I$ là tâm đối xứng (câu "thu sóng tốt nhất") |
| C3.3.1 | ví dụ 2 | không cùng loại đề | Bài thuần toán "bậc ba trên $[0;3]$, $d:x+y=0$" đổi thành bài hồ nước – con đường (đơn vị 100 m, làm tròn ra mét) như phần lớn 14 câu đề; thêm hình vẽ bờ hồ và đường $d$ |
| C3.3.2 | ví dụ 2 / hình | hình | Hình hình thang đặt sau ý b) (của hàm khác) → chuyển lên ngay sau ý a) |

Đã kiểm, không sửa: C3.1.1 VD1 (4 điểm, giao trục; hình bậc ba cắt $Ox$ tại $-1;1;2$, $Oy$ tại $2$ đúng công thức) · VD2 (4 điểm nguyên) · C3.1.2 VD1 (CĐ $1$, CT $-3$; số nghiệm $3,2,1$) · VD2 a) ($5$ giá trị) · C3.1.3 VD1 ($MN=8\sqrt2$) · C3.2.1 cả hai ví dụ · C3.2.2 cả hai ví dụ (diện tích $2$ với mọi $M$; chu vi nhỏ nhất $8+\sqrt{32}$ tại $M(3;3)$, $M(-1;-1)$) · C3.3.1 VD1 ($6$; $P=-7$) · C3.3.2 cả hai ví dụ.

## Cần CEO xem
- C3.1.1 / C3.1.2: bảng ánh xạ đặt nhiều câu "đồ thị cắt trục tung/trục hoành tại điểm nào" vào C3.1.2, trong khi mô tả C3.1.1 nói rõ "giao điểm với trục toạ độ". Trạm soát theo mô tả (ĐÍCH), giữ các câu đó ở C3.1.1; cần xác nhận khi xếp câu.
- C3.2.1: mô tả có "vuông góc", nhưng trong 5 câu đề thật không câu nào hỏi song song/vuông góc (đề hỏi: biết $k$, tại $x_0$, tại giao với $Ox$, $k$ lớn nhất, diện tích tam giác với hai trục). Lý thuyết vẫn giữ song song/vuông góc vì mô tả là ĐÍCH — nếu theo luật "đề không hỏi thì bỏ" thì có thể rút khỏi mô tả.
- C3.3.1: mô tả có "tổng khoảng cách tới hai đường thẳng nhỏ nhất" (1 câu đề, mức rất khó, anh Điệp); lý thuyết chỉ có công thức khoảng cách chung, chưa có ví dụ riêng.
