KẾT LUẬN: ĐẠT

Trạm soát (Opus) · VT lượt B · 03/11 · 3 nhóm (C2.1, C2.2, C3.1) · 7 dạng · 14 ví dụ (18 ý). Máy tự giải lại cả 18 ý: 36 phép kiểm đều đúng (script `S\soat\VT-B\kiem.mjs`). Không có hình `[[HINH]]`. 13 chỗ sửa. Máy kiểm `kiem-moi.mjs`: lỗi 0, cảnh báo 0. Bản gốc trạm soạn: `VT-B.goc.txt`.

Không có lỗi toán: mọi đáp số của trạm soạn đều đúng. Lỗi chủ yếu là **lý thuyết dạng lặp lý thuyết nhóm** (4 dạng) và **thiếu kiểu câu đề thật hay hỏi** (2 dạng).

## Đối chiếu
- **Đề thi thật** (`cau-dang.cjs VT <dạng>`): C2.1.1 94 câu · C2.1.2 97 · C2.2.1 24 · C2.2.2 21 (đọc cả 21) · C3.1.1 78 (đọc hết câu trả lời ngắn) · C3.1.2 61 · C3.1.3 13. Các ví dụ cùng loại và cùng mức với đề; không có ý nào đề không hỏi.
- **Sách:** Từ Tâm `tt-vt-B2P1.md`, `tt-vt-B3P1.md` (Bài 2 Dạng 1–3; Bài 3 Dạng 1, 2, 4); NBV `vt/nbv-9-lt.md`, `vt/nbv-9-tl.md`; **PNL đọc được**: bản chữ đã có sẵn ở `S\sach\vt\pnl-b2d1.md`, `pnl-b2d2.md`, `pnl-b3d1.md` (trạm soạn tưởng phải giải nén .rar; máy không có 7z nhưng có WinRAR, và không cần dùng vì đã có bản trích). Công thức của cả ba sách nằm trong ảnh WMF ⇒ đối chiếu theo cấu trúc dạng + SGK. PNL Bài 2 Dạng 2 có đúng bài máy bay cất cánh ⇒ xác nhận cần thêm kiểu bài góc vào C2.2.2.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C2.1.1 | lý thuyết dạng | trình bày (lặp nhóm) | TC chép lại 3 ý của nhóm C2.1 (u=ai+bj+ck, OM↔M, vectơ bằng nhau) ⇒ thay bằng các kiểu đề riêng: thứ tự lộn/thiếu thành phần, cho $\overrightarrow{AO}$ (đề thật T1120000004281), chiều điểm→biểu diễn, hệ số chứa ẩn |
| C2.1.2 | lý thuyết dạng | trình bày | Bước PP đối xứng ("thành phần ứng với trục", "thành phần bị vuông góc") mơ hồ ⇒ viết rõ luật cho trục / mặt phẳng / gốc O |
| C2.2 (nhóm) | lý thuyết nhóm | trình bày | $M=\dfrac{A+B}{2}$ (cộng điểm, không có trong SGK) ⇒ công thức theo từng thành phần |
| C2.2.1 | ví dụ 1 | trình bày | Lập luận "C′ đối diện A qua tâm" và "D′ cùng hoành độ với D (và A)" thiếu/lệch ⇒ suy từ C, D cùng hoành độ, tung độ và cao độ 2 |
| C2.2.2 | lý thuyết dạng | thiếu kiểu đề | TC chỉ có toạ độ phẳng $(r\cos\alpha;r\sin\alpha;0)$ ⇒ thay bằng công thức bài máy bay $M(r\cos\beta\cos\alpha;\ r\cos\beta\sin\alpha;\ r\sin\beta)$ (mô tả dạng: "có góc cho trước… lượng giác"; đề thật 3/21 câu) |
| C2.2.2 | lý thuyết dạng (PP) | trình bày | $M=P+k(Q-P)$ ⇒ viết theo từng thành phần; thêm bước cho bài có góc |
| C2.2.2 | ví dụ 1 | thiếu kiểu đề | Thêm ý b) máy bay: OM=8, góc (Ox,OH)=60°, MOH=30° ⇒ $M(2\sqrt3;6;4)$ (đã kiểm lại OM, các góc bằng số) |
| C2.2.2 | ví dụ 2 | trình bày | Thêm dòng đối chiếu $S_0=AS^2=21$ (đúng bước "kiểm lại bằng độ dài" của PP) |
| C3.1.1 | lý thuyết dạng | trình bày (lặp nhóm) + thiếu kiểu đề | TC chép lại công thức cộng/trừ/nhân của nhóm C3.1 ⇒ giữ tổ hợp + đẳng thức vectơ ẩn, thêm phân tích $\vec d=x\vec a+y\vec b+z\vec c$ (3 câu trả lời ngắn của dạng) |
| C3.1.1 | lý thuyết dạng (PP, CY) | trình bày (lặp nhóm) | CY "nhân k với toàn bộ vectơ" trùng CY nhóm ⇒ thay bằng bẫy chuyển vế đổi dấu; PP thêm bước lập hệ cho hệ số chưa biết |
| C3.1.1 | ví dụ 2 | thiếu kiểu đề | Thêm ý b) phân tích $\vec d$ theo $\vec p,\vec q,\vec r$ (hệ 3 ẩn, định thức ≠ 0, nghiệm 2; −1; 3, tổng 4); dùng ẩn m, n, k cho khỏi trùng $\vec x$ của ý a) |
| C3.1.2 | lý thuyết dạng | trình bày (lặp nhóm) | Bỏ công thức $\overrightarrow{AB}$ (đã có ở nhóm), giữ $\overrightarrow{BA}=-\overrightarrow{AB}$ và tìm điểm từ vectơ |
| C3.1.3 | lý thuyết dạng | trình bày (lặp nhóm) | Bỏ định nghĩa cùng phương / thẳng hàng chép lại từ nhóm; giữ dạng tỉ lệ, ca thành phần 0, $\overrightarrow{AB}=k\overrightarrow{AC}$ (khớp ví dụ), điểm thuộc đường AB và mặt phẳng toạ độ |

## Đã kiểm, không sửa
- Ví dụ 2 khó hơn ví dụ 1 ở cả 7 dạng; hai ví dụ khác hẳn nhau; số liệu không suy biến (C3.1.3: A≠C, k xác định từ thành phần không chứa ẩn; C3.1.1 b: định thức hệ ≠ 0).
- Ranh giới VT/PP toạ độ: không có phương trình mặt phẳng/đường thẳng/mặt cầu.
- `$S_0$` ở C2.2.2 ví dụ 2: hợp lý, giữ.
- C3.1.2 ví dụ 2 ($2\overrightarrow{MN}-\overrightarrow{NP}$) có phép tổ hợp gần C3.1.1, nhưng trọng tâm là lập vectơ từ điểm ⇒ giữ.

## Cần CEO xem
- C2.2.2: danh sách câu đề của dạng có câu cột điện (góc nhị diện, hỏi côsin góc hai vectơ), lồng đèn (thể tích), tứ diện đều A1B1C1D1, tờ giấy gấp (góc hai mặt phẳng) — thực chất là bài tích vô hướng / ứng dụng; chỉ khâu đặt toạ độ thuộc dạng này. Có nên chuyển các câu đó sang dạng ứng dụng (C3.3/C4) trong bảng ánh xạ không?
- C2.2.2: ví dụ máy bay dùng góc đặc biệt (60°, 30°) cho số đẹp; đề thật dùng góc lẻ + làm tròn. Muốn ví dụ giống hẳn đề (góc lẻ, làm tròn đến phần mười) thì báo.
