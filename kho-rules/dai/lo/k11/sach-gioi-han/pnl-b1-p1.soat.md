KẾT LUẬN: ĐẠT

# pnl-b1-p1 — biên bản soát (nhân chứng thứ hai)

- Số câu: **110** (58 tự luận đã tách ý · 48 trắc nghiệm · 4 trả lời ngắn · 0 giảng · 0 Đ/S). `kiem.mjs`: ✔ đạt (trước và sau sửa).
- Lệch đáp số Pha 1 (giải mù, `pnl-b1-p1.kiem.md`) so với bản soạn: **trước 0 / sau 0**. Chỉ TN08 lệch SÁCH (bản soạn và bản mù cùng ra D).
- Đề chuẩn hoá đối chiếu nguồn `don-vi/pnl-b1-p1.txt`: đủ BT tự luận Dạng 1–5 + Câu 1–48, số / dấu / mũ / chỉ số giữ đúng. Hai chỗ soạn xử lí đúng: hai nhãn c) trùng ở D1 BT2 đánh lại a–f; D3 BT1 j và l in lặp y hệt ⇒ nhập 1 lần. Không có câu bỏ vì hình (chỉ hình máy tính ở D5BT2 — trang trí, soạn bỏ "Cách 3 bấm máy" đúng). Câu 49 thuộc đơn vị sau (phương án nằm ở `pnl-b1-p2`) — chỉ ghi nhận.
- Phạm vi: không L'Hôpital / đạo hàm / `\times` / `\left` `\right`. TN09 dùng tổng $(k+1)^3-k^3$ (trong phạm vi). Phần 1 không lộ đáp số (TN chỉ ghi "so với bốn phương án", không loại trừ). `kiem` đều tính lại từ dữ kiện đề (không tautology); TN42 kiểm cấu trúc bằng $N=10$ (hợp lí vì $2^{-2020}$ dưới độ chính xác số thực).
- Định dạng Phần 2: các dòng cách nhau một dòng trống — đúng `de-cuong/brief-soan.md` §6.

## Sửa

| id | lỗi | sửa gì |
|---|---|---|
| D3BT2a | lời giải (ĐKXĐ) | Thêm đoạn quy nạp $u_n>-1$ ⇒ $u_n+6>0$, $u_n+4>0$: dãy truy hồi và $\frac{u_n+1}{u_n+4}$ luôn xác định (sách và bản soạn bỏ qua). |
| D3BT2b · D4BT1h · D4BT2f · D5BT4 | lời giải (khuôn) | Dòng cuối không bắt đầu bằng "Vậy" ⇒ thêm dòng kết "Vậy …". |
| D1BT1c · D1BT1e · D1BT1f · TN01 | dạng | NDB01151 → **NDB01162** (vừa): tử hằng số, mẫu → ∞ — khớp đúng ví dụ $\lim\frac{5}{n^2-n}$ của 01162; 01162 đứng sau 01151 ⇒ dạng sau thắng. |
| D1BT2a · D1BT2b | dạng | NDB01148 → **NDB01151** (vừa): "chứng minh lim = L" của phân thức cùng bậc giải được bằng chia $n^k$; một cách giải thuộc dạng sau là đủ. |
| D1BT2c · D1BT2d | dạng | NDB01148 → **NDB01154** (vừa): thương luỹ thừa. |
| D1BT2f | dạng | NDB01148 → **NDB01158** (vừa): căn trừ $n$, nhân liên hợp. |
| D1BT2e | — | Giữ NDB01148 (vừa): cần chặn $\lvert\sin 3n\rvert\le1$, không dạng tính toán nào đứng sau hợp. |
| TN33 | dạng | NDB01148 → **NDB01160** (vừa): phương án sai là "$\lim q^n=0$ với $\lvert q\rvert>1$" — kiến thức của 01160, đứng sau 01148. |

Giữ nguyên (đã xét): D2BT1b / TN05 / TN06 / TN34 ở 01152 (dạng riêng cho tử bậc cao hơn, không đẩy sang 01162); TN36 ở 01161; TN09 / TN10 ở 01156 tạm (vừa); D3BT2a/b để trống.

## Còn nghi — cần CEO

1. **TN08 — LỆCH SÁCH (máy phân xử: D theo đề in).** Đề in mẫu $(2n-1)^2(n^2+3)^2$: bậc tử 5 (hoặc 2 khi $a=0$), bậc mẫu 6 ⇒ $L=0$ với mọi $a$ ⇒ không có $a$ để $L=\frac12$ ⇒ **D**. Tính số: $a\in\{-1,0,1,2\}$ ở $n=10^5$ đều cho $L\approx10^{-5}$ trở xuống. Lời giải sách viết mẫu $(2n-1)(n^2+3)^2$ (không bình phương) ⇒ $L=\frac{a^3}{2}$ ⇒ $a=1$ ⇒ **B**. Không biết lỗi in ở đề hay ở lời giải. Bản hiện tại: giữ đề in, đáp án D, có dòng "Lưu ý" đầu Phần 2. Thùy chọn: (a) giữ như vậy, hoặc (b) sửa đề thành $(2n-1)(n^2+3)^2$ và đáp án B.
2. **D1BT2a–f (6 câu "chứng minh lim = L")** — tôi đã đổi 5/6 câu sang dạng tính toán theo luật dạng sau thắng. Nếu Thùy muốn nhóm "chứng minh bằng định nghĩa / chặn" luôn ở 01148 (kĩ năng dạy là chặn $\lvert u_n-L\rvert$) thì trả về 01148 — bản `.goc.json` còn giữ.
3. **Bản đồ thiếu dạng:** (a) *dãy cho bởi công thức truy hồi — đặt dãy phụ cấp số nhân/cộng rồi tính giới hạn* (D3BT2a, D3BT2b đang để trống); (b) *tổng đặc biệt không phải CSC/CSN — tổng bình phương, tổng khử liên tiếp $\frac1{k(k+1)}$* (TN09, TN10 tạm ở 01156).
4. **TN28** — đề in $a^3+b^2$, lời giải sách tính $a^2+b^2$; với $a=1, b=3$ cả hai bằng 10 ⇒ đáp án D không đổi, không cần quyết.
