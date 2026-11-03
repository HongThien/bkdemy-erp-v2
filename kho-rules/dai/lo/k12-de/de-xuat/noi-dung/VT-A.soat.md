KẾT LUẬN: ĐẠT (sau khi sửa)

Trạm soát Opus · 03/11 · tệp `VT-A.txt` (bản gốc trạm soạn: `VT-A.goc.txt`)

- 3 nhóm (C1.1, C1.2, C1.3) · 9 dạng (C1.1.1–C1.1.2, C1.2.1–C1.2.4, C1.3.1–C1.3.3) · 18 ví dụ tự giải lại bằng máy · 0 hình (hình khối mô tả bằng lời) · 14 chỗ sửa.
- Máy kiểm khuôn `kiem-moi.mjs VT … C1.1,C1.2,C1.3,C1.1.1,…,C1.3.3`: lỗi 0 · cảnh báo 0 (trước và sau sửa).
- Script kiểm độc lập: `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad\soat\VT-A\thu.cjs` — dựng toạ độ cụ thể: hình hộp XIÊN tổng quát (để đẳng thức không đúng "nhờ" vuông góc), lăng trụ xiên, lập phương, lăng trụ đứng đáy đều, chóp tứ giác đều đáy 4 cạnh bên 6, chóp $SA\perp$ đáy, tứ diện đều, tứ diện bất kì, điểm ngẫu nhiên cho các đẳng thức "với mọi điểm"; đếm vectơ C1.1.1 bằng cách duyệt hết 56 cặp đỉnh; quét $k\in[-10;10]$ để chắc $k=2$ duy nhất. 59/59 phép kiểm khớp. Đề hiểu được không cần hình: mọi ví dụ nêu đủ tên đỉnh, quy ước đáy/cạnh bên, độ dài.
- Đối chiếu đề thật: `cau-dang.cjs VT <dạng>` (C1.1.1 58 câu · C1.1.2 31 · C1.2.1 149 · C1.2.2 57 · C1.2.3 49 · C1.2.4 36 · C1.3.1 48 · C1.3.2 54 · C1.3.3 63).
- Đối chiếu sách (`S\sach\vt\`; công thức trong cả 3 bộ ở dạng ảnh WMF nên chỉ đối chiếu được cấu trúc + lời): `nbv-8-lt.md` (NBV lý thuyết: quy tắc hình hộp, định nghĩa tích vô hướng — không có "đồng phẳng"), `tt-b1-P1.md` (Từ Tâm: 4 dạng định nghĩa · tổng hiệu (ba điểm, hình bình hành, hình hộp, hiệu) · tích với số (trung điểm, trọng tâm, thẳng hàng) · tích vô hướng và góc — khớp lý thuyết nhóm C1.1–C1.3), `pnl-1.md` (PNL: có mục đồng phẳng / phân tích theo ba vectơ không đồng phẳng — khớp C1.2.4); chỉ dò từ khoá ở `nbv-9-lt.md`, `pnl-2.md`, `pnl-b2d1.md`, `pnl-b3d2.md`, `tt-b1-P2.md`, `S\sach\vt-nbv\*.md`. Không thấy điều mâu thuẫn với tệp; không phát hiện lỗi sách.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C1.1.1 | lý thuyết dạng | lặp nhóm | Bỏ dòng "vectơ bằng $\overrightarrow{AB}$ trong hình hộp" (nhóm C1.1 đã có nguyên); thay bằng cặp ngược hướng trên chóp đáy hình bình hành tâm $O$ ($\overrightarrow{OA}=-\overrightarrow{OC}$, $\overrightarrow{DA}$ và $\overrightarrow{BC}$) — đề thật hỏi đúng kiểu này. |
| C1.1.1 | lý thuyết dạng | bám đề (thiếu) | Thêm "$n$ điểm cho $n(n-1)$ vectơ khác $\vec 0$; tứ diện $12$" (đề có câu đếm vectơ của tứ diện, vectơ có giá trong $(SCD)$). |
| C1.1.1 | ví dụ 1 | trình bày (chép đề) | Bốn đẳng thức b), c), d) trùng nguyên câu đề T1120000006029 ⇒ viết lại trên lăng trụ $ABC.A'B'C'$ (bằng / vectơ đối / cùng hướng), đáp số a), d) đúng. |
| C1.1.2 | lý thuyết dạng ##TC | phạm vi (dùng kiến thức nhóm sau) | Bỏ đẳng thức $|\vec a+\vec b|^2+|\vec a-\vec b|^2=\dots$ (cần tích vô hướng, C1.3); thay bằng ý "tổng hai vectơ chung gốc = $2$ lần vectơ tới tâm hình bình hành" ($|\overrightarrow{SA}+\overrightarrow{SC}|=2SO$, $|\overrightarrow{AB}+\overrightarrow{AC}|=2AM$) — đề thật hỏi chóp đều, $\overrightarrow{IA'}+\overrightarrow{IC'}$. |
| C1.1.2 | lý thuyết dạng ##PP | phạm vi | Bỏ bước "dùng đẳng thức bình phương độ dài"; thêm bước thay tổng bằng $2$ lần vectơ tới tâm. |
| C1.1.2 | lý thuyết dạng ##CY | trình bày | Thiếu dấu cách trước công thức sau dấu hai chấm. |
| C1.1.2 | ví dụ 2 b | phạm vi / bám đề | Câu $|\vec a|,|\vec b|,|\vec a+\vec b|\to|\vec a-\vec b|$ chuyển sang C1.3.1; thay bằng chóp tứ giác đều đáy $4$, cạnh bên $6$: $|\overrightarrow{SA}-\overrightarrow{SC}|=4\sqrt2$, $|\overrightarrow{SA}+\overrightarrow{SC}|=2SO=4\sqrt7$ (chọn cạnh bên $6$ để tránh ca trùng $4\sqrt2=4\sqrt2$ khi mọi cạnh bằng nhau). |
| C1.2.2 | lý thuyết dạng ##TC | bám đề (thừa) | Bỏ chiều đảo "đẳng thức đúng ⇒ $ABCD$ là hình bình hành" (không câu đề nào hỏi); thay bằng hai đẳng thức SAI hay gặp ở đáp án nhiễu ($\overrightarrow{SA}+\overrightarrow{SB}=\overrightarrow{SC}+\overrightarrow{SD}$, $\overrightarrow{SA}+\overrightarrow{SD}=\overrightarrow{SB}+\overrightarrow{SC}$). |
| C1.2.2 | ví dụ 1 + ví dụ 2 | bám đề / độ khó | Ví dụ 2 cũ chỉ là chiều đảo của ví dụ 1 b) (không khác hẳn, đề không hỏi). Sắp lại: ví dụ 1 = tứ diện (rút gọn + chứng minh $\overrightarrow{AB}+\overrightarrow{CD}=\overrightarrow{AD}+\overrightarrow{CB}$ bằng chèn điểm); ví dụ 2 = chóp đáy hình bình hành (chứng minh $\overrightarrow{SA}+\overrightarrow{SC}=\overrightarrow{SB}+\overrightarrow{SD}$ + rút gọn $\overrightarrow{SC}+\overrightarrow{BA}+\overrightarrow{DB}=\overrightarrow{SB}$, cần thay cạnh song song — khó hơn một bậc, không trùng đề T112070101191). |
| C1.3.1 | lý thuyết dạng ##TC | bám đề (thiếu) | Thêm $|\vec a-\vec b|^2=2(|\vec a|^2+|\vec b|^2)-|\vec a+\vec b|^2$ (câu $26,28,48$ của đề được ánh xạ vào C1.3.1). |
| C1.3.1 | ví dụ 1 c | bám đề | Hỏi thêm $|\vec a-\vec b|=\sqrt{19}$. |
| C1.3.3 | lý thuyết dạng ##TC | lặp nhóm + toán (lý do sai) + bám đề | Bỏ công thức $\cos$ và ý "đổi hướng thì góc bù" (nhóm C1.3 đã có); sửa lý do "$(\overrightarrow{AC},\overrightarrow{DB'})=90^\circ$ vì mặt chéo ⊥ đường chéo khối" thành "$AC\perp$ mặt chéo $BDD'B'$ chứa $DB'$"; thêm "hai đường chéo mặt chung đỉnh tạo góc $60^\circ$" (đề hỏi $(\overrightarrow{BD},\overrightarrow{B'C})$, $(\overrightarrow{MN},\overrightarrow{A'B})$ đều $60^\circ$). |
| C1.3.3 | lý thuyết dạng ##CY | lặp nhóm | Bẫy "góc vectơ có thể tù / góc đường thẳng lấy bù" trùng ##CY nhóm ⇒ thay bằng bẫy đề cho $|\vec a-\vec b|$ (đề T1120000003470). |
| C1.3.3 | ví dụ 1 c, ví dụ 2 | trình bày | Chữ $a$ vừa là tên vectơ $\vec a$ vừa là độ dài cạnh ⇒ bỏ độ dài $a$, lập luận bằng $|\vec a|=|\vec b|$ và vuông góc; ví dụ 2 "Đặt $\overrightarrow{AB}\cdot\overrightarrow{AC}=\dots$" ⇒ "Ta có". |

Không sửa: lý thuyết 3 nhóm (đúng SGK); C1.1.1 ví dụ 2 (đếm $3$, $7$, $4$ đúng trên hộp xiên); C1.1.2 ví dụ 1, ví dụ 2 a); C1.2.1 cả hai ví dụ (kiểm trên hộp xiên); C1.2.3 cả hai ví dụ ($AI/AG=3/4$, $k=2$ duy nhất); C1.2.4 cả hai ví dụ ($x+y+z=5/3$, $\vec z=\vec x+3\vec y$); C1.3.1 ví dụ 2 ($-1$, $2\sqrt7$, $200\ J$); C1.3.2 cả hai ví dụ; C1.3.3 kết quả số ($45^\circ$, $135^\circ$, $90^\circ$, $\cos=\frac{\sqrt3}{6}$).

## Cần CEO xem

- C1.1.2 ↔ C1.3.1: trạm soát đã CHUYỂN câu "cho $|\vec a|,|\vec b|,|\vec a+\vec b|$, tính $|\vec a-\vec b|$" sang C1.3.1 (cần tích vô hướng; mô tả C1.3.1 có "khai triển $(\vec a+\vec b)^2$ rồi suy độ dài"; bảng ánh xạ đã xếp câu $26,28,48$ vào cả hai dạng). Khi chốt ánh xạ câu, nên gỡ câu này khỏi C1.1.2. Nếu muốn giữ ở C1.1.2 thì phải chứng minh bằng đẳng thức hình bình hành (lớp 10), không dùng tích vô hướng.
- C1.1.1: câu "vectơ pháp tuyến của mặt phẳng $(ABCD)$" (lập phương) đã bỏ — xác nhận thuộc PP toạ độ theo ranh giới Thùy chốt; nên gỡ khỏi ánh xạ C1.1.1.
- C1.1.2 đứng trước nhóm C1.2 nhưng phải dùng quy tắc ba điểm / hình bình hành / hình hộp (dạy ở C1.2); lý thuyết dạng nhắc lại các quy tắc này. CEO cân nhắc đặt nhóm C1.1 sau C1.2, hoặc chấp nhận nhắc lại.
- C1.2.4: "đồng phẳng" không có trong lý thuyết SGK 2018 (NBV A. LÝ THUYẾT không nhắc), nhưng đề thi và PNL có hỏi — giữ theo cây đã duyệt.
