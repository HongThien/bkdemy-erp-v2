KẾT LUẬN: ĐẠT

Lượt HS-G · 2 nhóm (C2.4, C2.5) · 7 dạng · 14 ví dụ đã tự giải lại bằng máy (1 ví dụ thay mới) · 6 hình đã kiểm (dò lại 6, dựng thử hình mới) · 15 chỗ sửa · máy kiểm `kiem-moi.mjs` lỗi 0, cảnh báo 0.

Script soát (độc lập trạm soạn): `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad\soat\HS-G\kiem.cjs` — tính lại cực trị, tiệm cận, dấu đạo hàm bằng sai phân và quét lưới; quét tham số $m$ cho C2.4.3 VD2, C2.5.1 VD2, C2.5.2 VD2, C2.5.3 VD1, C2.5.4 VD2; hình VD mới C2.5.3 kiểm bằng nguyên hàm rằng đẳng thức $f(0)+f(1)=f(3)+f(4)$ đúng với chính đồ thị $f'$ vẽ ra. Cùng script giải lại 7 câu đề thật để kiểm quy ước (T112010102243 = 3 · xúc xắc = 61 · hình chữ nhật = 392 · $\sqrt{x^2-4x+m}$ = 2029 · $\sqrt{x-m}$ = 49 · $(x-1)/(2x^2+6x-m-3)$ = 17): khớp hết đáp án đề. Hai dòng "SAI" khi chạy là nhiễu số của script (đếm trúng điểm lưới đúng bằng nghiệm kép; sai phân vượt qua tiệm cận đứng ở $x\to3$), đã kiểm lại bằng tay.

Đã đối chiếu sách (bản trích chữ): `S\sach\hsd\nbv-tc-lt.md`, `pnl-tc-1.md`, `pnl-tc-3.md` (tiệm cận có tham số: "nghiệm kép hoặc hai nghiệm phân biệt có một nghiệm trùng tử" ⇒ đúng một tiệm cận đứng); `S\sach\gtln\nbv_A.md`, `pnl_D1.md` (đồ thị $f'$ kèm đẳng thức), `tutam_P1.md` (Dạng 1–5, có phương trình–bất phương trình chứa $m$); hồ sơ `kho-rules/dai/lo/k12-hs/ho-so/hoso-nbv-5-6-7.md` (NBV: bậc hai/bậc nhất "tử không chia hết cho mẫu"), `hoso-tutam.md` (K7, C39: đúng một TCĐ ⇔ mẫu có nghiệm kép hoặc nghiệm trùng tử), `hoso-pnl-3-5.md`. Công thức trong sách đa số là ảnh WMF nên chỉ đối chiếu được lời văn và cách giải.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C2.4 | lý thuyết nhóm | trình bày (lặp) | Bỏ ý tâm đối xứng (trùng lý thuyết dạng C2.4.2), bỏ chữ "tâm đối xứng" ở ##PP nhóm. |
| C2.4.2 | lý thuyết dạng | thừa (đề không hỏi) | Bỏ ý "hai điểm hoành độ $x_0\pm t$ có tổng tung độ $2y_0$" — 12 câu đề đều chỉ hỏi tìm tâm, tính biểu thức. |
| C2.4.3 | lý thuyết dạng | trình bày (lặp) | Rút gọn ý đường thẳng $AB$, chỉ dẫn $y_i=u'/v'$ từ nhóm. |
| C2.4.3 | lý thuyết dạng | thiếu (đề có hỏi) | Thêm diện tích hình chữ nhật nhận $AB$ làm đường chéo (đề T1120000004596). |
| C2.4.3 | lý thuyết dạng | thiếu (đề có hỏi) | Thêm điều kiện đơn điệu trên khoảng $K$ cho trước: $x_0\notin K$, xét dấu $g$ trên $K$ (đề xúc xắc "nghịch biến trên $(1;3)$"). |
| C2.4.3 | ##CY | thiếu (đề có hỏi) | Thêm bẫy hàm suy biến: được tính khi hỏi đơn điệu, phải loại khi hỏi cực trị (khớp đáp án T112010102243). |
| C2.5.2 | lý thuyết dạng | thiếu (đề có hỏi) | Thêm hàm ngoài là đa thức của $f$ ($f^3-3f^2+2$, đề T1120000004094). |
| C2.5.2 | ví dụ 1 | trình bày | "Nhánh bên trái đi lên mãi" (dễ hiểu ngược) ⇒ viết bằng giới hạn $x\to\pm\infty$. |
| C2.5.3 | lý thuyết dạng | thiếu (đề có hỏi) | Thêm kiểu tham số chỉ cộng thêm $y=h(x)+m$ (đề có 2 câu: $x^3-2x^2-7x+m$, $e^{x+2}+5x-m$). |
| C2.5.3 | lý thuyết dạng | trình bày | Ý đồ thị $f'$ + đẳng thức: viết rõ cách dùng (chuyển vế thành hiệu hai giá trị cùng khoảng đơn điệu). |
| C2.5.3 | ví dụ 2 | lạc kiểu đề (độ phủ) | Thay ví dụ $f(x^2-2x)+m$ (1/14 câu đề) bằng đồ thị $f'$ có điểm chạm + đẳng thức $f(0)+f(1)=f(3)+f(4)$ (2/14 câu đề, kiểu khó nhất, mô tả nêu đích danh). Hình mới, số liệu kiểm bằng nguyên hàm: đẳng thức đúng với đồ thị; đáp số $a=1$, $b=0$. |
| C2.5.4 | lý thuyết dạng | thừa (đề không hỏi) | Bỏ ý "$1/(f+m)$ bậc ba: 1, 2 hoặc 3 TCĐ theo $-m$" — 10 câu đề không câu nào có tham số trong $1/(f+m)$. Đổi tiêu đề ##TC theo. |
| C2.5.4 | lý thuyết dạng | thiếu (đề có hỏi) | Thêm mẫu là biểu thức của $f$ ($2f-3$, $f^2-5f$, $f^2-4f+3$: 4 câu đề) và mẫu chứa căn ($\sqrt{x-m}$, $\sqrt{x^2-4x+m}$: 2 câu đề). |
| C2.5.4 | ##CY | toán | "Nghiệm của mẫu trùng nghiệm đơn của tử thì không là TCĐ" sai khi nghiệm đó là nghiệm kép của mẫu (bội $2>1$ vẫn là TCĐ) ⇒ sửa theo quy tắc so bội. |
| — | GHI CHÚ CHO CEO | cập nhật | Bỏ các điểm đã giải quyết (quy ước nghiệm kép, chưa đọc sách), ghi nguồn sách trạm soát đã đọc, ghi độ phủ đề thi của từng dạng. |

Kiểm quy ước theo yêu cầu: (1) "Nghiệm kép của mẫu vẫn là tiệm cận đứng" — ĐÚNG theo định nghĩa ($\lim=\infty$), khớp PNL Dạng 3 và Từ Tâm C39, khớp đáp án đề thật. Bản soạn sai ở vế sau của câu CY (đã sửa). (2) "Hàm suy biến khi tử mẫu có nhân tử chung" — khớp NBV ("tử không chia hết cho mẫu") ở lý thuyết nhóm; với câu hỏi đơn điệu đề thật vẫn tính giá trị suy biến — đã ghi vào CY của C2.4.3.

Phần không sửa, đã kiểm đúng: lý thuyết nhóm C2.4 (chia đa thức, dấu $\alpha\gamma$, $y=u'/v'$ tại cực trị), C2.4.1 (công thức chia với mẫu $x+d$), C2.5 nhóm, C2.5.1, C2.5.2 (công thức $|f|$ = $p+q$; $f(|x|)$ = $2k+1$; ý $|f|$ giữ lại vì đề T1120000004339 hỏi $|f(|2024x-2025|)-1|$). Ví dụ 2 khó hơn ví dụ 1 ở cả 7 dạng (C2.4.1 hai ví dụ cùng bậc: đồ thị/đếm dấu vs BBT/tính tổng — chấp nhận).

## Cần CEO xem

- C2.5.3: dạng gộp bốn kiểu, 14 câu đề chia 8 (tham số trong công thức, gồm 2 câu chỉ cộng $m$) · 3 (hàm ẩn: 2 câu đồ thị $f'$ + đẳng thức, 1 câu $f(u)+m$ từ đồ thị $f$) · 2 (phương trình–bất phương trình chứa $m$ dùng max–min) · 2 (biểu thức nhiều biến có ràng buộc, một câu mũ với hàm đặc trưng). Hai ví dụ chỉ phủ được hai kiểu. Đề xuất tách thành 3 dạng: (a) GTLN–GTNN có tham số trong công thức; (b) GTLN–GTNN hàm ẩn (đồ thị $f$/$f'$, hàm hợp); (c) ứng dụng max–min: phương trình–bất phương trình chứa $m$ và biểu thức nhiều biến. Nếu giữ một dạng thì kiểu (c) chỉ có ở lý thuyết.
- C2.5.4: mô tả (ĐÍCH) nêu "$g=1/(f(x)+m)$, tìm $m$ để có đúng $k$ tiệm cận" nhưng không câu đề nào có tham số kiểu đó (tham số chỉ có ở hàm cho bằng công thức); trạm soát đã bỏ ý này khỏi lý thuyết. Kiểu $h(x)/(\text{biểu thức của }f)$ (3/10 câu) chưa có ví dụ — nếu cần, có thể đổi ví dụ 1 thành kiểu này (mẫu $f^2-kf$ có điểm chạm, tử có nhân tử trùng).
- C2.4.3: quy ước hàm suy biến trong câu "đồng biến trên từng khoảng xác định" (tính $m$ làm hàm thành bậc nhất) đang theo đáp án đề T112010102243; nếu Thùy muốn quy ước khác (loại giá trị suy biến) thì sửa CY.
- C2.4.3 và C2.5.4: một số kiểu đề hay gặp chỉ có ở lý thuyết (đơn điệu có tham số; mẫu chứa căn) vì mỗi dạng chỉ hai ví dụ.
