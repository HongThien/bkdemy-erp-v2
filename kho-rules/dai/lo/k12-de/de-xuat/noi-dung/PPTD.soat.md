KẾT LUẬN: ĐẠT (sau khi sửa)

Lượt: PPTD, các dạng THÊM vào bản đồ Thùy dựng: M1 (NNB01507), M2 (NNB01512), nhóm mới MN1 «Cực trị trong không gian Oxyz» gồm M3–M7.
1 nhóm · 7 dạng · 14 ví dụ đã tự giải lại bằng máy · 0 hình · 11 chỗ đã sửa · máy kiểm `kiem-moi.mjs` lỗi 0, cảnh báo 0.
Bản gốc trạm soạn: `noi-dung/PPTD.goc.txt`.

## Đã kiểm bằng máy (script soát độc lập, ở scratchpad `soat/PPTD/`)
- `vd.cjs`: quét lưới / quét tham số / hạ dần nhiều điểm xuất phát cho 12 ví dụ M2–M7. Mọi đáp số khớp: M2 (45°, n=(1;-2;2); u=(1;4;1); cos=√7/3, d=√21/7) · M3 (√14 tại (3/2;1/2;1); √34≈5,83, M,N đúng thứ tự) · M4 (11 và 1; 5 và √17) · M5 (2 tại (1;1;-1) — bản mới; 99 tại (3;2;3)) · M6 (3, V=243/8; Vmin=13,5 tại a=6, b=4,5, c=3) · M7 (√5 tại t=-2; MN=1, d' không nằm trong (P)).
- M1: kiểm tay từng phương trình (dạng, hệ số, mẫu).
- `de-them.cjs`: kiểm bằng số các ý lý thuyết soát thêm, đối chiếu đáp án đề thật: T312000000209 (√181, tổng hoành độ 9), T312000000226 (4,89), T312000000320 (1,36), T312000000071 (8), T312000000144 (1), T312000000846 (R=0,2 m = 20 cm), T312010107090 (giải tích ra T=-4).
- Đúng dạng: M3 đối xứng / M4 quỹ tích đường tròn từ hệ thức / M5 điểm trên mặt cầu / M6 mặt phẳng qua điểm cố định / M7 tham số hoá trên đường thẳng — 5 kiểu không lẫn nhau. Ví dụ 2 khó hơn ví dụ 1 ở cả 7 dạng.

## Bảng chỗ đã sửa
| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| M1 | ví dụ 2 | lạc dạng (ý đề không hỏi) | Bỏ ý b) "tìm m để là phương trình mặt phẳng" (không câu đề nào hỏi); thay bằng "phương trình nào KHÔNG phải phương trình tổng quát" (kiểu đề T312000000443/609/901: tích hai biến, bình phương, dạng đoạn chắn). |
| MN1 | lý thuyết nhóm | trình bày (lặp) | Bỏ ý CY "đối xứng chỉ dùng khi cùng phía" — riêng của M3, đã có trong M3. |
| M3 | lý thuyết dạng | toán | Ý CY "đoạn MN=l thì tịnh tiến A theo vectơ MN" sai khi hướng MN tự do (đề 209, 226): thay bằng công thức √((HK−l)²+(h_A+h_B)²), HM:NK=h_A:h_B (thử khớp 2 đề). |
| M3 | lý thuyết dạng | thiếu cách giải đề hay hỏi | Thêm ca chu vi có một đỉnh trên mặt phẳng, một đỉnh trên đường thẳng (đề T312000000074). |
| M3 | lý thuyết dạng | lặp lý thuyết nhóm | Bỏ công thức điểm đối xứng chép lại trong ##PP. |
| M4 | lý thuyết dạng | thiếu cách giải đề hay hỏi | Ý "OM·AM=k" sửa thành: trừ hai phương trình mặt cầu ra mặt phẳng cố định (đề 320). Thêm: hình chiếu lên mặt phẳng quay quanh d chạy trên đường tròn đường kính AK (đề 071); điểm cách đường thẳng ⊥(P) và khoảng cách nhỏ nhất giữa hai đường tròn (đề 144). |
| M4 | lý thuyết dạng | lặp lý thuyết nhóm | ##PP bỏ công thức r=√(R²−d²) chép lại. |
| M5 | ví dụ 1 | số liệu chép đề | Mặt cầu + đáp số trùng đề T312000000245 ((S) y hệt, a+b+c=3): đổi sang (S) tâm (2;-1;1), (P): x−2y+2z+9=0, đáp số M(1;1;-1), a+b+c=1. |
| M5 | lý thuyết dạng | thiếu cách giải đề hay hỏi | Thêm vectơ tổng quy về MK (đề 650/349), tổng MA+MB lớn nhất (đề 183), khoảng cách theo phương cố định (đề 846); sửa CY cho khớp. |
| M6 | ví dụ 2 / lý thuyết dạng | trình bày (hai cách hiểu) + thiếu | Ví dụ 2 ghi rõ vách nào là (Oyz)/(Oxz) (trước đó phương trình mặt phẳng phụ thuộc cách đặt). Thêm ý tổng khoảng cách có hệ số α·d(B)+β·d(C) (đề T312010107090). |
| M7 | lý thuyết dạng | lặp lý thuyết nhóm | Bỏ ý "tam thức bậc hai" — đã có trong nhóm MN1. |

## Câu đề lỗi
- **T312000000659 — SAI ĐÁP ÁN.** Nội dung y hệt T312000000201 (A(1;1;2), B(−1;2;1), E(−3;3;1), M∈(P): x+y+z−1=0, MA=√2·MB, hỏi EM lớn nhất). Bằng chứng: MA²=2MB² ⇔ x²+y²+z²+6x−6y+6=0, mặt cầu tâm (−3;3;0), R²=12; d(I,(P))=1/√3 ⇒ đường tròn bán kính √(35/3)≈3,416, tâm J(−8/3;10/3;1/3); E∈(P), EJ=√6/3≈0,816 ⇒ EM_max≈4,232 → **4,2**. Quét số 62 832 điểm trên đường tròn: max 4,23215, min 2,59915 (≈2,6 — nên 2,5 cũng không phải giá trị nhỏ nhất). DB đang ghi `dap_an`=`2,5`, trong khi `loi_giai` của chính câu này ra 4,23; câu 201 ghi 4.2 đúng. Cần sửa đáp án 659 thành 4,2 (CHƯA sửa DB).
- **T312000000176 — ĐÚNG (không cụt).** Bản trích `cau-dang.cjs` cắt ở 600 ký tự nên trạm soạn tưởng cụt; nội dung đầy đủ trong `k12de/lo-009.jsonl` và DB có câu hỏi "tính khoảng cách từ góc tường O đến mặt phẳng (ABC)". Giải lại: 1/a+2/b+1/c=1, Vmin=9 tại a=3, b=6, c=3 (quét lưới ra đúng), (ABC): 2x+y+2z−6=0, d(O)=6/3=**2** = đáp án DB. (Lời giải DB có lỗi gõ nhỏ `\text{\Rightarrow abc\ge 54.}` — chỉ hiển thị.)

## Đối chiếu sách
Đã trích (scratchpad `sach/pptd/md/`): NBV 12-20 (A. Lý thuyết, F. Nâng cao), 12-CD21 (A, F), 12-CD22 (F); PNL Chương 5 Bài 1 Dạng 1, Bài 2 Dạng 4, Bài 3 Dạng 3 (GV); Từ Tâm C5 Bài 1-P1, Bài 2-P2, Bài 3-P2. Định nghĩa phương trình tổng quát (A,B,C không đồng thời bằng 0), đoạn chắn, chính tắc khớp SGK. Các kiểu cực trị M3–M6 đều có trong phần nâng cao NBV/PNL (MA+MB, đoạn chắn – thể tích, điểm trên mặt cầu gần/xa mặt phẳng, laser/5G thực tế). Hạn chế: công thức trong sách là ảnh WMF nên chỉ đối chiếu được loại bài và lời văn, công thức kiểm bằng máy.

## Đối chiếu khuôn với DB
Nhánh hgt khối 12 trong `dai_bdm_dang_bai` chưa có dạng nào có lý thuyết (44 dạng, 0 lý thuyết); mẫu Thùy viết ở hgt khối 10 (36 dạng): lý thuyết trung bình 576 ký tự (307–898). Bản PPTD dài ~1,6–2,0 nghìn ký tự/dạng (M2 ~3,4 nghìn), ngang các tệp K12 khác của đợt (HS-A, HS-B). Khung ##TC/##PP/##CY/##VD giống nhau.

## Cần CEO xem
- T312000000659: sửa `dap_an` 2,5 → 4,2 (hoặc xoá bản trùng của T312000000201).
- Độ dài lý thuyết: dài hơn mẫu hgt khối 10 khoảng 3 lần; có muốn cắt các ý chỉ phục vụ một câu đề (M4, M5, M6) không.
- M1: đề thi coi dạng đoạn chắn là "không phải phương trình tổng quát" (T312000000609 đáp án B, loại D) — ví dụ 2 dạy theo đúng cách hiểu này; xác nhận đây là quy ước muốn dạy.
- M5: đề T312000000191 (đèn chiếu trên đường tròn giao tuyến, nón 60°) chưa có ý lý thuyết riêng — chỉ một câu, tạm để.
