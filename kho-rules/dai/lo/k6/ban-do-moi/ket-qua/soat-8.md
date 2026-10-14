KẾT LUẬN: ĐẠT

# Biên bản soát gói 8 — Nâng cao ƯCLN–BCNN · phép chia có dư (Opus, 14/10)

- Đã soát: **16 ví dụ** (4 dạng × 2 = 8 ví dụ + 4 nhóm không có dạng × 2 = 8 ví dụ trong lý thuyết) · **7 khối lý thuyết** (NNB00927–00933, cả 7 đều mới hoàn toàn).
- Bản gốc trạm soạn: `out-8.goc.json`. Cổng `kiem-goi.mjs`: ✔ đạt cổng (sau sửa).

## Kiểm toán bằng máy (vét cạn, scratchpad `vet8.cjs`)

Mọi đáp số của 16 ví dụ khớp vét cạn độc lập (tìm cặp $a<b$ theo đề / tìm số nhỏ nhất theo số dư):
NDB00415 (6;72),(18;24) · (12;40),(20;24) [cả tập không lọc: 4 cặp] · NDB00416 (4;44),(20;28) · (6;84),(12;78),(24;66),(42;48) ·
NDB00417 (6;4) · (45;10) · NDB00418 (5;3) · (12;5) · NNB00930 (6;36),(12;18) · (4;288),(32;36) · NNB00931 (4;60),(12;20) · (9;180),(36;45) ·
NNB00932 28 · 17 · NNB00933 118 · 139 (số có ba chữ số).
Các dòng liệt kê trung gian (bảng phân tích thành tích, các hiệu tương ứng, cặp bị loại) đều đúng. ƯC(90,35)={1;5}, ƯC(15,2)=ƯC(60,7)={1} đúng với tên dạng "2 giá trị / 1 giá trị".
Kiểm thêm: với mọi BCNN, hiệu ≤ 300, nghiệm luôn có $k=\text{ƯCLN}(\text{BCNN},\text{hiệu})$ (0 ngoại lệ) — khớp ghi chú trạm soạn.

Không có chuyển vế, $(a^m)^n$, hằng đẳng thức, đồng dư, dấu hiệu 4/8/11/25; hệ thức $a.b=\text{ƯCLN}.\text{BCNN}$ không viện dẫn mà lập luận qua $a=k.m$, $b=k.n$ (đúng k6.md §1). Lập luận BCNN $=d.m.n$ dựa trên quy tắc BCNN qua phân tích thừa số nguyên tố + nhân hai luỹ thừa cùng cơ số — trong whitelist.

## Chỗ đã sửa

| Mã (NDB/NNB) | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| NNB00928 | toán (lý thuyết) | "ƯCLN(m,n)=1 đúng khi m và m+n nguyên tố cùng nhau" chỉ chứng minh một chiều (ước chung của $m$, $m+n$ là ước của $n$) mà phát biểu và dùng như hai chiều ⇒ viết đủ hai chiều (ước của tổng + ước của hiệu) và phát biểu "khi và chỉ khi" | Phương pháp loại cặp dựa vào cả hai chiều; chiều đã viết lại đúng là chiều KHÔNG cần cho câu chữ "đúng khi" |
| NNB00932 | toán (lý thuyết) | "mọi bội chung $t$ … cho $t-s$ chia $a$ dư $m$" ⇒ thêm "khác 0", $u\geq1$ | Bội chung 0 cho $0-s$ không phải số tự nhiên |
| NNB00933 | toán (lý thuyết) | như trên ("bội chung $t$ khác 0", $u\geq1$) | như trên |
| NNB00932 | toán (lý thuyết) | ##CY: "BCNN có thể làm $t.x+s$ chưa chia hết cho $t$" (vô nghĩa — $t.x+s$ chính là bội chung) ⇒ "bội chung trừ $s$ chưa chia hết cho $t$, hoặc $x$ tính ra chưa đúng số dư ⇒ lấy bội chung kế tiếp" | Câu cũ sai nội dung |
| NNB00932 | toán (lý thuyết) / thiếu điều kiện | ##TC dùng chữ $t$ cho cả "bội chung" lẫn "số nhân $t$" ⇒ đổi bội chung thành $c$; ##PP thêm cách liệt kê khi không tìm được $t$ | Hai nghĩa một chữ trong cùng khối; số $t$ với $a-t.m=b-t.n$ không phải lúc nào cũng có |
| NNB00933 | toán (lý thuyết) | ##CY "liệt kê các số chia hết cho số lớn nhất" ⇒ "liệt kê các số chia cho số chia lớn nhất có đúng số dư đề cho"; "hai phép chia" ⇒ "các phép chia" (+ nhớ thử lại) | Số cần tìm không chia hết cho số chia nào; ba phép chia chứ không phải hai |
| NNB00929 | toán (lý thuyết) | ##PP Bước 2 "(hai giá trị, hoặc chỉ một giá trị $k=1$)" ⇒ "(có thể có nhiều giá trị; chỉ một giá trị $k=1$ khi ƯC $=\{1\}$)"; ##TC ghi rõ $a>b>0$ | ƯC(BCNN, hiệu) có thể có >2 phần tử (vd ƯCLN = 6 ⇒ 4 giá trị); đặt $m>n$ cần $a>b$ |
| NNB00927 | thiếu điều kiện | thêm "Với $a$, $b$ khác 0" + khối "Ngược lại": $m$, $n$ nguyên tố cùng nhau thì $d.m$, $d.n$ có ƯCLN $=d$, BCNN $=d.m.n$ | Lý thuyết chỉ có chiều cần, thiếu lý do vì sao mọi cặp tìm được đều là nghiệm |
| NNB00928 | thiếu điều kiện | thêm "Với $a$, $b$ khác 0" | ƯCLN với số 0 không theo khuôn $a=d.m$, $m\in\mathbb{N}^*$ |
| NNB00931 | khuôn (câu chữ) | ##CY "Không có sẵn công thức … để áp dụng" (giọng ghi chú nội bộ) ⇒ "Khi trình bày phải viết lại lập luận $a.b=k.(k.m.n)=k.M$ … không dùng như công thức có sẵn" | Tờ lý thuyết HS đọc |
| NNB00932 (VD 2) | khuôn | "Vì $2x+1\geq 1$ nên bội chung nhỏ nhất có thể là $2x+1=35$" ⇒ "Vì $2x+1$ khác 0 và $x$ nhỏ nhất nên $2x+1=35$" | Lý do đúng là "khác 0", không phải "≥ 1" |

Không ví dụ nào phải thay: 16/16 đúng đáp số, đúng dạng, đúng kiến thức lớp 6, đúng dấu nhân chấm.

## ghi_chu còn lại gửi CEO

1. **NDB00417 / NDB00418** — tên dạng "ƯCLN của a và b có 2 giá trị / có 1 giá trị" hiểu theo mô tả = tập $\text{ƯC}(\text{BCNN},\text{hiệu})$ có 2 phần tử / chỉ có $\{1\}$. Ứng viên của NDB00418 trùng hệt NDB00417 (cùng cụm cũ DCUM01490) nên không dùng được; ví dụ NDB00418 tự soạn (đã vét cạn đúng).
2. **NDB00417** — thực tế nghiệm luôn có $k=\text{ƯCLN}(\text{BCNN},\text{hiệu})$ (đã chứng minh + vét cạn ≤ 300), nên với dạng "2 giá trị" trường hợp $k=1$ luôn bị loại. Lý thuyết giữ cách xét từng $k$ (đúng tài liệu CEO, đúng lớp 6); CEO quyết có thêm mẹo không.
3. **Tên dạng/nhóm NDB00416 / NNB00928** thừa chữ "biết biết".
4. **NNB00930 / NNB00931** (ƯCLN & tích, BCNN & tích) không có tài liệu mẫu — lý thuyết + ví dụ tự soạn theo khuôn $a=d.m$, $b=d.n$.
5. **NNB00932 / NNB00933** (chia có dư) không có tài liệu mẫu — lý thuyết tự soạn. Trường hợp **hai phần còn thiếu khác nhau** (nhân $x$ lên $t$ lần / liệt kê) chỉ dùng được khi có $t$ với $b-a$ chia hết cho $n-m$, và có đề **vô nghiệm** (vd chia 4 dư 1, chia 6 dư 2: một điều kiện bắt số lẻ, một bắt số chẵn). CEO xem có giữ trường hợp này ở lớp 6 hay tách thành dạng riêng.
6. Ví dụ có điều kiện lọc thêm (NDB00415 VD 2 "đều có hai chữ số", NNB00933 VD 2 "số có ba chữ số") vẫn đúng mô tả dạng.
7. Ví dụ dùng kí hiệu $\text{ƯCLN}(a,b)$ / $\text{BCNN}(a,b)$ thay $(a,b)$ / $[a,b]$ của ứng viên cũ — theo k6.md §3.
