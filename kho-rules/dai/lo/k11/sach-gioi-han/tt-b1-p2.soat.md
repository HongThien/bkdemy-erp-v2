KẾT LUẬN: ĐẠT (sửa 8 câu; có 5 điểm cần Thùy chọn, xem cuối tệp)

# Soát tt-b1-p2 — Từ Tâm C3-B1 Giới hạn dãy số, phần 2/2

- Số câu: 45 (20 TN · 8 Đ/S · 3 TL · 14 TLN; đều `luyen`, 0 `giang`; nguồn không có mục "Ví dụ" nên đúng). Đủ câu 40–85; chỉ thiếu C54, bỏ đúng (xem dưới).
- Lệch với bản giải mù ở Pha 1: **trước sửa 1** (C67 ý c) · **sau sửa 0**. 44 câu còn lại khớp đáp án / đáp số / từng mệnh đề Đ/S.
- `kiem.mjs`: ✔ đạt trước và sau khi sửa. Bản gốc lưu ở `tt-b1-p2.goc.json`.

## Các chỗ đã sửa

| id | lỗi | sửa gì |
|---|---|---|
| C67 | đề + đáp số (ý c) | Sách in lủng "sau n chu kì năm công tác". Lời giải sách hiểu $u_n$ = lương **trong chu kì thứ n** ⇒ $5\,000\,000\cdot(\frac{26}{25})^{n-1}$ ⇒ ý c Sai. Bản soạn chuẩn hoá thành "**sau** $n$ chu kì" nhưng vẫn chấm Sai. Đọc theo chữ thì câu đó **Đúng**, vì ý a đã nói lương sau 3 năm (sau 1 chu kì) là $5{,}2$ triệu $=5\cdot\frac{26}{25}^1$ triệu. Đã sửa chữ ý c thành "trong chu kì công tác thứ $n$" để đề khớp đáp án Sai của sách, có ghi `ghi_chu` và thêm `kiem` |
| C84 | lời giải (khuôn đề sai) | Chuyển dòng "Lưu ý: đề sai…" lên đầu Phần 2 cho đúng brief (trước đó dòng này nằm giữa bài). Đáp số 3 giữ nguyên |
| C71 | dạng | Câu hợp cả NDB01156 (tổng CSC) và NDB01157 (căn dưới dấu thương, $\sqrt{n^2}=n$). Theo luật **dạng sau thắng**, đổi NDB01156 → **NDB01157** (`vua`) |
| C50, C56, C73, C79 | lời giải | Phần 2 chưa kết bằng "Vậy …" ⇒ đã thêm dòng kết. C79 ghi thêm $\approx-0{,}83$ rồi mới làm tròn |
| C52 | `kiem` | `kiem` cũ chỉ kiểm $h\le200$ mà không xét phương án nào ⇒ thêm kiểm cả 4 phương án với $h_n=200-\frac{200}{2^n}$ |

## Các điểm trạm soạn đã nêu: đã phân xử

- **C41 — LỆCH SÁCH: đồng ý.** Lời giải sách viết "Chọn A" nhưng chính lời giải ấy kết luận $\lim(\frac13)^n=0$. Máy tính: $4/e\approx1{,}47>1$, $|5/3|>1$ ⇒ **chọn B**.
- **C61 ý c — LỆCH SÁCH: đồng ý với bản soạn (Đúng).** $I=\frac{a^2-a-2}{2}$; $I=0\Leftrightarrow a\in\{-1;2\}$, tổng bằng 1, đúng như mệnh đề. Sách chấm Sai là sai. Đã kiểm bằng máy ở $n=10^7$.
- **C84 — đề sai: đồng ý.** Vế trái có giới hạn $\frac43$ (máy: 1,33333); vế phải in trong đề (a=2, b=1) cho $\frac23$, tức thiếu thừa số 2 ở tử. Đáp số $S=3$ không đổi.
- **C54 — bỏ: đồng ý.** Câu này đủ chữ để đọc, nhưng cả hai cách giải trong sách đều ngoài phạm vi: cách 1 dùng diện tích hình tròn kèm nguyên lí kẹp hình học, cách 2 dùng tích phân. Không giải được bằng kiến thức lớp 11 chương V.
- **C57 / C58 / C59 — chuyển sang tự luận: nên GIỮ.** Đề đủ chữ, đáp số máy khớp lời giải sách: $\frac{91}{1380}$, $\frac{30}{121}$, $\frac{2^{n+1}-1}{2^n}$. Bốn phương án là ảnh WMF; tự bịa phương án nhiễu thì không đúng sách. Đáp số là phân số hoặc công thức nên không thể làm trả lời ngắn. Cần biết: C57 và C58 là **tổng hữu hạn**, không có giới hạn, chỉ luyện kĩ năng tách hiệu. C59 là tổng cấp số nhân hữu hạn. Ba câu này hợp làm bài khởi động cho dạng "tổng rút gọn", chưa phải câu giới hạn.
- **Bản đồ thiếu dạng: xác nhận.**
  - "Tổng rút gọn liên tiếp (tách hiệu, khử số hạng)": C49, C55, C56, C57, C58, C74. Trạm soạn liệt kê cả C48 nhưng C48 trộn bốn kiểu.
  - "Dãy truy hồi (đưa về CSN / chuyển qua giới hạn)": C48 (phương án C), C50, C51, C79.
  - C48 để `null` là hợp lí: một câu trắc nghiệm gộp bốn kiểu (phân thức, liên hợp, truy hồi, tổng rút gọn).
- **C41 có số $e$:** chỉ dùng $e\approx2{,}718$ như một hằng số để so với 4, không dùng giới hạn $(1+\frac1n)^n$. Lời giải hợp lệ về toán, nhưng chạm luật "CẤM e" của brief, nên **cần Thùy chọn** (xem dưới).
- **C52:** cần Thùy chọn (xem dưới).
- **C63 ý d:** cần Thùy chọn (xem dưới).

## Soát chung (không cần sửa)
- Đề chuẩn hoá giữ nguyên số, dấu, số mũ. Kiểm kĩ C44, C45, C46, C49, C53, C72, C73, C77: đúng nghĩa đề sách.
- Phạm vi: không có L'Hôpital, đạo hàm, `\times`, `\left` / `\right`.
- Phần 1 không lộ đáp số cuối. C45 / C52: Mấu chốt nói "tổng hữu hạn / bị chặn" nên loại được phương án D, nhưng không lộ đáp án.
- `kiem` đều tính lại từ dữ kiện đề, không có câu nào tự khẳng định đáp số của chính nó. C68, C69, C80–C83 so biểu thức gốc với dạng đã biến đổi tại n = 10⁴ (đọc a, b từ đó).
- TLN đều là số ≤ 4 ký tự. Các đáp số phân số / công thức đều đã để tự luận.

## Câu CÒN nghi, cần CEO

| id | sách | bản này | cần chọn |
|---|---|---|---|
| C41 | Chọn A (in lỗi) | B | (1) Giữ nguyên phương án A $(\frac4e)^n$, chỉ dùng $e\approx2{,}718$ làm hằng số, hay (2) đổi A thành một cơ số không có $e$, ví dụ $(\frac43)^n$, để khỏi chạm luật "cấm e"? |
| C52 | C | C | Phương án B "Chiều cao mô hình **tối đa là** 2 mét" có thể hiểu là "≤ 2 m", và đọc như vậy thì B cũng đúng. Bản này hiểu "tối đa" = đạt được 2 m nên B sai. Giữ nguyên, hay sửa B thành "Chiều cao mô hình có thể đạt đúng 2 mét"? |
| C63 ý d | Sai (P=27) | Sai | Đề nói "$b,c$ là các tham số" nên $b,c$ không xác định duy nhất. Lời giải ngầm coi $c=0$. Kết luận Sai vẫn đứng được, nhưng đề nên sửa thành "$L=b\sqrt3$ với $b$ là số thực". |
| C67 ý c | Sai | Sai (đã đổi chữ đề) | Đã viết lại ý c thành "trong chu kì công tác thứ $n$" theo lời giải sách. Nếu muốn giữ chữ "sau $n$ chu kì" thì đáp án phải đổi thành **Đúng**. |
| C57 / C58 / C59 | trắc nghiệm, phương án là ảnh | tự luận | Giữ ở dạng tự luận (khuyên giữ), hay bỏ vì không phải câu giới hạn? |
