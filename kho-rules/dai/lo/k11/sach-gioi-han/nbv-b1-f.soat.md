KẾT LUẬN: ĐẠT

# Soát nbv-b1-f (NBV · Giới hạn dãy số · F. Bài tập nâng cao)

- Số câu: **123** (đều `luyen`, `tu_luan`). Có dạng: 103. Để trống dạng: 20.
- Lệch đáp số so với giải mù Pha 1 (`nbv-b1-f.kiem.md`): trước sửa **0/123**, sau sửa **0/123**. Dãy truy hồi (D22C24–39) tôi tính lại bằng cách cho máy chạy công thức truy hồi tới số hạng lớn. D22C30 thì tìm ra $u_n/2^n=\frac2{n(n+1)(n+2)}$ rồi cộng lại.
- `kiem.mjs` ✔ đạt (gồm bộ quét LaTeX hỏng `quet-loi-latex.mjs` ✔ sạch). Bản trước sửa: `nbv-b1-f.goc.json`. Có 24 câu đã sửa.

## Đối chiếu nguồn (đề · bỏ câu · tách ý)
- Đề chuẩn hoá giữ đúng nghĩa đề sách: đã so từng câu với `don-vi/nbv-b1-f.txt` (số, dấu, mũ, căn, chỉ số). Đủ câu. Tách ý đúng luật: D1C3 có ý b dùng ý a nên giữ nguyên cả bài. D1C4 tách thành a/b vì hai dãy độc lập.
- **Bỏ câu 23 (Dạng 2.2): đồng ý.** Đề cho $u_1=-5$, $u_{n+1}=\sqrt{u_n}$ thì $u_2$ đã không xác định. Lời giải sách lại ứng với một đề khác ($v_1=9$, tức $u_1=10$), nên không có cách đọc đề nào hiển nhiên đúng.
- **Bỏ câu 41 (Mickey): đồng ý.** Đề chỉ nói hình sau có cạnh bằng nửa cạnh hình trước. Cạnh hình vuông số 1 ($\frac12$) chỉ có trên hình `image497.png`, nên đề phụ thuộc hình.
- Sửa chữ đề (lỗi in hiển nhiên, đã ghi ở `ghi_chu` và dòng «Lưu ý» trong Phần 2):
  - D1C1a: đề in $(-1)$, sửa thành $(-1)^n$ theo lời giải sách.
  - D22C19a: đề in $\dots+\frac1{16}+\dots+\frac1{n^2}$, sửa thành $\frac1{2^k}$ theo lời giải và đáp số 2 của sách.
  - Cả hai sửa đều không đổi đáp số. **Đồng ý.**
- D1C6: lời giải sách gõ $(n+2)^2$, trạm soạn giải theo đề in $(n+2)^n$. **Đúng.**

## Các lỗi đã sửa
| id | lỗi | sửa gì |
|---|---|---|
| D3C7a | lời giải: Phần 1 lộ đáp số (Mấu chốt «tăng vượt mọi số dương») | viết lại Mấu chốt và Bước 2: so cơ số với 1, dùng giới hạn cơ bản của $q^n$ |
| D3C1d | lời giải: Phần 1 lộ đáp số («nghịch đảo … có giới hạn 0») | Mấu chốt và Bước 3 chỉ nêu cách làm: tìm giới hạn của mẫu rồi dùng quy tắc thương |
| D22C7a | lời giải: Bước 3 nêu «$\lim\frac c{n+1}=0$» · dạng | Bước 3 chỉ nêu cách làm. Đổi dạng `NDB01151` → `NDB01162` (vừa): sau khi $\sin n\pi=0$, bài thành hằng số chia một dãy dần tới $+\infty$. Đúng mô tả 01162, mà 01162 đứng sau nên thắng |
| D22C7b | lời giải: Phần 1 dùng khuôn chứng minh «dãy chặn có giới hạn 0», lộ đáp số của câu «Tìm» | viết lại Phần 1 cho câu này |
| D22C13b | lời giải: Bước 3 lộ «tử dần tới vô cực, mẫu dương» (tức là $+\infty$) | sửa thành «tính giới hạn tử, mẫu (chú ý dấu) rồi dùng quy tắc thương» |
| D22C5c, D3C3a–c, D3C6a–d | lời giải: Bước 1 «để biết giới hạn là vô cực» | sửa thành «để chọn cách biến đổi phù hợp» |
| D1C7a, D1C7b | lời giải: Phần 1 dùng khuôn «chia cho $n$, dùng $\lim\frac1n=0$», không khớp Phần 2 (Phần 2 làm bằng liên hợp rồi chặn, D1C7b chặn bởi $\frac1{2\sqrt n}$) | viết lại Phần 1: liên hợp → tử là hằng số → chặn bởi dãy cơ bản → kẹp |
| D22C19a, D22C19b | lời giải: Bước 3 «chia cho luỹ thừa cao nhất của $n$» (sai cách, bài là tổng cấp số nhân) | sửa thành «dùng $\lim q^n=0$ khi $\lvert q\rvert<1$» |
| D3C7b | lời giải: Phần 1 «rút luỹ thừa cao nhất của $n$» (bài có $5^n$, không có $n^k$) | viết lại Phần 1 theo cơ số lớn nhất $5^n$ |
| D3C3d | phạm vi: Phần 2 kết luận $+\infty$ bằng «quy tắc so sánh». SGK KNTT không có quy tắc này | viết lại Phần 2: chặn mẫu $\le6n^2$ ⇒ $u_n\ge\frac n6$. Với mọi $M>0$, khi $n>6M$ thì $u_n>M$ ⇒ theo định nghĩa có $+\infty$. Sửa Phần 1 và `kiem` theo (bây giờ `kiem` cộng trực tiếp $\sum k^3$, không dùng công thức đóng) |
| D3C8 | phạm vi: lỗi giống D3C3d | thêm dòng «khi $n>M^2$ thì $u_n\ge\sqrt n>M$», rồi kết luận theo định nghĩa. Sửa Phần 1 theo |
| D22C34 | lời giải (toán): viết «quy nạp $0<u_n<2$» trong khi $u_1=2$ | sửa thành $0<u_n\le2$ |
| D1C2b | ghi chú: nhãn «LỆCH SÁCH» không đúng, vì đáp số / kết luận vẫn khớp sách | ghi lại: sách gõ mẫu $2^n+1$, giải theo đề in |
| D22C17a, D22C22d | ghi chú: trùng câu | ghi rõ «trùng nội dung D22C10d / D22C5b (sách in lặp; giữ đủ câu)» |

## Những điểm trạm soạn nêu: kết quả soát
- **D22C5c LỆCH SÁCH: soạn đúng.** Theo đề in, tử bậc 3 > mẫu bậc 2 nên giới hạn là $+\infty$ (máy: $n=10^5$ cho $\approx1{,}5\cdot10^5$). Sách ra $\frac32$ vì chia tử cho $n^3$ nhưng chia mẫu cho $n^2$. Nếu đề gốc là $3n^2$ thì $\frac32$ đúng → **cần Thùy chọn** (xem cuối file).
- **D22C13d LỆCH SÁCH: soạn đúng ($0$).** Liên hợp ra tử $-2n$, mẫu cỡ $3n^2$. Máy: $n=10^6$ cho $\approx-6{,}7\cdot10^{-7}$. Sách rút gọn sai ra $-\frac23$. Kết quả $-\frac23$ là của D22C18c ($\sqrt[3]{n^3-2n^2}$).
- **D3C7d: soạn đúng.** Sách ghi giới hạn của tử là $-3$, đúng phải là $-2$. Kết luận $-\infty$ không đổi.
- **D1C2b, D1C1a, D1C6, D22C19a:** xem phần trên. Đồng ý với trạm soạn, chỉ sửa ghi chú của D1C2b.
- **Đổi cách giải cho nằm trong SGK: đồng ý.**
  - D22C37–39: không dùng định lí «đơn điệu bị chặn». Thay bằng chặn $\lvert u_n-L\rvert\le c\,q^{n-1}$ rồi kẹp. Tôi đã kiểm từng bất đẳng thức:
    - D22C37: mẫu $>3$ ✓.
    - D22C38: $u_n+3>3$ ✓.
    - D22C39: $\frac{(u_n-2)^2}{3u_n^2+4}<\frac13\iff u_n>\frac23$ ✓.
  - D22C15: chia cho $n$ trực tiếp, mẫu có giới hạn $1\ne0$, không cần liên hợp ✓.
  - D3C3d: không dùng công thức tổng lập phương ✓. Kết luận nay đi qua định nghĩa.
- **Định lí kẹp cho dãy (D1, D22C7b, D22C33–36, D22C12a, D3C1c/d): hợp phạm vi.** Mọi chỗ dùng kẹp đều có dạng $\lvert u_n-L\rvert\le v_n$, $\lim v_n=0$ ⇒ $\lim u_n=L$. Đây đúng là nhận xét trong SGK, nhất quán với các lần soát `pnl-b1-p2` và `nbv-b1-b`. Không chỗ nào dùng kẹp hai phía với giới hạn khác 0.
- **Gán `vua` cho D22C7a, D1C7a, D1C7b: giữ `vua`.**
  - D1C7a/b là bài «chứng minh giới hạn 0» nhưng giải bằng liên hợp. Hợp cả 01148 lẫn 01158, nên lấy 01158 vì đứng sau.
  - D22C7a nay ở 01162, cũng `vua`.
- **Trùng nội dung D22C22d≡D22C5b, D22C17a≡D22C10d:** giữ cả hai câu như sách, đã ghi chú. Khi ghi DB, nếu kho chống trùng thì bỏ một câu mỗi cặp.

## Dạng
- Đồng ý mọi gán còn lại (đối chiếu `dich.md`, áp luật dạng sau thắng).
- 20 câu để trống: đồng ý, nhất quán với cách xử lý ở `tt-b1-p1`, `pnl-b1-p1`, `pnl-b1-p2`, `nbv-b1-e`. Bản đồ thiếu 3 dạng:
  - (a) *Giới hạn dãy cho bởi công thức truy hồi* (đưa về CSC/CSN, hoặc dự đoán điểm bất động rồi chặn bởi CSN): D22C24–D22C39, 16 câu.
  - (b) *Tổng rút gọn dây chuyền (tách hiệu)*: D22C21a, D22C21b.
  - (c) *Tổng đặc biệt không phải CSC/CSN, chặn dưới* (giới hạn $+\infty$): D3C3d, D3C8.
- Có thể tạm xếp: D22C28 sau khi cộng dồn là đúng một tổng CSN, có thể tạm vào `NDB01156` (vừa). Tôi giữ trống cho đồng bộ với các câu truy hồi khác.

## Câu còn nghi, cần CEO
1. **D22C5c**: sách ra $\frac32$, bản này ra $+\infty$ (đúng với đề in). Nếu Thùy biết đề gốc là $\frac{3n^2-2n+5}{2n^2+5n-3}$ thì sửa đề, đáp số thành $\frac32$ (dạng chuyển sang `NDB01151`). Nếu không thì giữ như hiện tại (đã ghi «LỆCH SÁCH»).
2. **Bản đồ thiếu 3 dạng** (20 câu đang trống, xem mục Dạng): thêm dạng, hay để trống?
3. **Hai cặp câu trùng** (D22C22d/D22C5b, D22C17a/D22C10d): lên kho cả hai, hay bỏ một câu mỗi cặp?
