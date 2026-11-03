KẾT LUẬN: ĐẠT

# Biên bản soát HS-E (C2.1, C2.3) — trạm soát Opus, 03/11

- 2 nhóm · 8 dạng · 16 ví dụ (tự giải lại bằng máy, gồm 10 câu chọn công thức: cả 40 phương án đã so với hình) · 13 hình (đã dựng ra ảnh và nhìn) · 18 chỗ sửa.
- Máy kiểm khuôn: `kiem-moi.mjs HS … C2.1,…,C2.3.3` → lỗi 0, cảnh báo 0.
- Script soát độc lập: `S\soat\HS-E\kiem.mjs` (TỔNG 0 lỗi), dựng hình `S\soat\HS-E\ve.mjs` → `hinh2.png`.
  - Đồ thị: phương án đúng trùng đường vẽ (lệch 0); MỖI phương án nhiễu lệch rõ so với đường vẽ trong khung hình (≥ 1); điểm ghi nhãn nằm trên đường; tiệm cận vẽ = tiệm cận thật (số); cực trị đọc từ hình = cực trị quét số.
  - Bảng biến thiên: suy BBT từ từng phương án (cột cực trị/gián đoạn, dấu y′, giá trị, hai đầu) → chỉ phương án đúng khớp.
  - C2.3.1 ví dụ 1 (a+b+d): đọc TCĐ, TCN, giao Oy, Ox từ CÔNG THỨC VẼ hình → a=2, b=−4, d=−1, a+b+d=−3 ✓. Ví dụ 2: thử c ∈ {0,5; 1; 3} đều cho a<0, b>0, d>0 ✓.
  - C2.3.2: tâm đối xứng (3−x)/(2x+4) → I(−2;−1/2) ✓; hình mới I(1;2) ✓; (4x−1)/(x+3): I(−3;4), OI=5, A(−2;−9)∈(C), B(−4;17)∈(C) ✓.
  - C2.3.3: quét m nguyên/bước 0,25 và quét GTNN trên [2;4] khớp đáp số (−1, 0; m=4; (3;4]; m=−5) ✓.
- Đối chiếu đề thật: `cau-dang.cjs HS <dạng>` cho cả 8 dạng (C2.3.2 đọc hết 43 câu, C2.3.1 hết 62 câu).
- Đối chiếu sách (trích vào `S\sach\nhd\`): NBV `12-5. HAM SO BAC 3\A. LY THUYET.docx`, NBV `12-6. HAM SO HUU TI\A. LY THUYET.docx`, NBV `12-6\C. BAI TAP TRAC NGHIEM - DA.docx`, Từ Tâm `C1-B4-KHẢO SÁT VÀ VẼ ĐỒ THỊ HÀM SỐ CƠ BẢN-P2.docx`; hồ sơ `k12-hs/ho-so/hoso-nbv-5-6-7.md`. Công thức trong sách là ảnh WMF (không đọc được số) — đối chiếu được quy ước và cách làm: khớp (tâm đối xứng = giao hai tiệm cận; B2/B1 tử không chia hết mẫu; nhận dạng = loại hàm → dấu a → điểm đi qua).

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C2.1 | lý thuyết nhóm | toán | CY "dấu hệ số cao nhất theo đầu bên phải" chỉ đúng với hàm đa thức → ghi rõ "Với hàm đa thức". |
| C2.1.1 | lý thuyết dạng | thừa ý | Bỏ "tâm đối xứng có hoành độ −b/(3a)" (không câu đề nào của dạng dùng). |
| C2.1.1 | ví dụ 1 + hình | trình bày (gần chép đề) | Hàm x³−3x+1 với nhiễu −x³+3x+1 + phân thức gần trùng đề T112020202071 → đổi sang x³+3x²−1, nhiễu x³−3x²−1 cùng giao Oy (bắt buộc giải y′=0); hình vẽ lại. |
| C2.1.1 | ví dụ 2 | trình bày | Đổi thứ tự phương án (đáp án c). |
| C2.1.2 | ví dụ 1, 2 | trình bày | Đổi thứ tự phương án (đáp án d, b). |
| C2.1.3 | ví dụ 2 | trình bày | Đổi thứ tự phương án (đáp án d); lý do loại phương án hệ số góc âm viết theo giới hạn hai đầu. |
| C2.1.4 | ví dụ 1 + hình | trình bày | Đổi thứ tự phương án (đáp án b); dời nhãn y=f(x) sát đường cong. |
| C2.1.5 | lý thuyết dạng | trình bày / thiếu ý | Bỏ dấu hiệu mơ hồ "hai đầu đi ngược phía theo hai nhánh"; thêm dấu hiệu LOẠI hàm từ bảng biến thiên (ví dụ 2 dùng bảng). |
| C2.1.5 | ví dụ 1 | trình bày | Đổi thứ tự phương án (đáp án c). |
| C2.1.5 | ví dụ 2 + hình | khó dễ / lặp | Bảng cũ trùng hàm (x²−x+1)/(x−1) của C2.1.3 và không khó hơn ví dụ 1 → bảng hàm bậc ba x³−3x²+2, nhiễu gồm bậc hai/bậc nhất (cũng 2 cực trị, hai đầu ±∞) và trùng phương: phải nhận ra "không có cột kẻ đôi" và "hai đầu ngược phía". Đáp án b. |
| (C2.1) | toàn bộ | trình bày | Bản soạn để đáp án luôn là a) ở cả 10 câu → đã xáo (a/b/c/d). |
| C2.3 | lý thuyết nhóm | lặp nhóm–dạng | Bỏ tâm đối xứng khỏi nhóm (thuộc C2.3.2); thêm giao điểm với trục vào nhóm (dùng chung C2.3.1, C2.3.2); CY nhóm chỉ còn dấu trừ của tiệm cận đứng. |
| C2.3.1 | lý thuyết dạng | lặp nhóm–dạng | TC chép lại công thức tiệm cận/giao trục/dấu ad−bc của nhóm → viết lại thành ý riêng của dạng: hình chỉ cho TỈ SỐ, phải có một hệ số biết giá trị/dấu để chuẩn hoá; ##PP bước 1–2 sửa theo đó (không mặc định c=1). |
| C2.3.2 | lý thuyết dạng | thiếu ý đề hay hỏi / lặp | Thêm đọc tâm từ ĐỒ THỊ (dạng câu đề nhiều nhất); CY dấu trừ (trùng nhóm) → bẫy thật trong đề: mẫu 1−x đổi dấu c (vd (3x−2)/(1−x) có I(1;−3)); ##PP thêm OI. |
| C2.3.2 | ví dụ 1 + hình | lệch đề thật | Ý b) bảng biến thiên (1/43 câu đề) → đồ thị (≈ nửa số câu đề); vẽ hình (2x+2)/(x−1), I(1;2). |
| C2.3.2 | ví dụ 2 | lệch đề thật / khó dễ | Thay ví dụ chỉ hỏi điểm đối xứng bằng ví dụ 2 ý: a) độ dài OI (kiểu đề thật), b) điểm đối xứng qua I thuộc đồ thị (giữ theo mô tả). |
| C2.3.3 | lý thuyết dạng | lặp nhóm–dạng | Bỏ dòng "đơn điệu trên từng khoảng: dấu ad−bc" (đã ở nhóm); dòng tiệm cận bỏ công thức lặp. |
| — | GHI CHÚ CHO CEO | cập nhật | Ghi nguồn sách đã đối chiếu; thêm điểm C2.1.5, C2.1.4, C2.3.2. |

## Cần CEO xem

- C2.1.5: mô tả "bốn phương án khác loại", nhưng 5/6 câu đề thật xếp vào dạng có hai phương án cùng loại → cần chốt ranh giới với C2.1.1–C2.1.3 (mô tả các dạng đó đã nhận "phương án lẫn loại khác").
- C2.3.2: mô tả có "điểm đối xứng qua tâm" nhưng 43 câu đề thật không câu nào hỏi; ví dụ 2 b) đang giữ theo mô tả — bỏ hay giữ?
- C2.1.4: một câu đề hỏi ngược (cho công thức, chọn 1 trong 4 hình); ví dụ chưa có chiều này.
