KẾT LUẬN: ĐẠT

# DTD-GKI-2026 — Phần 4 (Bài 26–30) — biên bản soát (Opus, 13/10)

- Số câu: **15** (26a, 26b, 27a, 27b, 28a–28d, 29a–29d, 30a–30c) — 12 trả lời ngắn · 3 tự luận.
- Khớp lượt giải mù (`DTD-GKI-2026.p4.kiem.md`) ngay từ đầu: **15/15** đáp số.
- Số câu phải sửa: **0** ⇒ không tạo `….p4.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng (15 câu · 12 TLN · 3 tự luận · chưa chắc 0).

## Đã soát

| Mục | Kết quả |
|---|---|
| Chép đề | Đối chiếu `trang/p-3.png`, `trang/p-4.png` + bản phóng `z/p4_b26_27.png`, `z/p4_b28_30.png`: đúng từng số mũ, dấu, ngoặc ở 15 câu |
| Đáp số | Máy (BigInt, sai phân bậc 2–3 bằng 0 ⇒ bậc nhất): 28a $3$ · 28b $-1$ · 28c $\dfrac{15}{8}$ · 28d $1$ · 29a $\dfrac{1}{5}$ · 29b $\dfrac{17}{30}$ · 29c $-\dfrac{3}{2}$ · 29d $\dfrac{6}{29}$ · 30a $-2$ · 30b $1$ · 30c $1$; Bài 26 cộng đủ 100 hạng tử ($100$; $0$); Bài 27 thay $y=2-x$ ($2$; $3$) |
| Từng dòng Phần 2 | Đúng toán; các dòng nhóm của 27a ($x^2(x-2)-xy(y-2)+2(x+y)-2$) và 27b ($x^3(x+y-2)+x^2y(x+y-2)-x(x+y-2)+3$, $(x+y-2)(x^3+x^2y-x)+3$) kiểm đồng nhất tại 4 bộ số |
| Kiến thức (CHỈ Chương I) | **Không có hằng đẳng thức** ở cả 15 câu: 30b nhân dần $(x+1)(x+2)$ rồi nhân với $(x+5)$; 27b KHÔNG đi đường $x^4+2x^3y+x^2y^2=x^2(x+y)^2$ (bẫy hằng đẳng thức) mà tách $2x^3y=x^3y+x^3y$ rồi đặt đơn thức chung từng nhóm. Bài 27 chỉ dùng đặt thừa số chung theo tính chất phân phối (27b có thêm một bước đặt thừa số chung $x+y-2$ — vẫn là phân phối, thuộc ngoại lệ được dùng). Tìm $x$ bằng chuyển vế từng dòng, không "phương trình / nghiệm / $S$"; 28d khai triển hai vế, không chia cho $x-1$, không dùng "tích bằng 0" |
| Phân loại | Khớp khuôn phiếu 4 ô (`^-?\d+(,\d+)?$`, ≤ 4 kí tự, dấu "," ở ô 2 hoặc 3, dấu "−" chỉ ô 1 — `hopLePhieu4O` của Kho đề thi và `ONhap4O` của app HS): `0,2` (29a — dấu phẩy ô 2, 3 kí tự) và `-1,5` (29c — "−" ô 1, phẩy ô 3, 4 kí tự) **hợp lệ, tô được**; `100`, `0`, `2`, `3`, `-1`, `-2`, `1` hợp lệ. 28c $\dfrac{15}{8}=1{,}875$ (5 kí tự), 29b $\dfrac{17}{30}$, 29d $\dfrac{6}{29}$ (thập phân vô hạn) ⇒ `tu_luan` đúng. Cùng tiền lệ NSHM 5g (`3,75`), 7b (`0,75`). Phần 2 của 29a, 29c có dòng đổi ra thập phân và câu kết "Vậy $x=0{,}2$" / "Vậy $x=-1{,}5$" khớp `dap_an` |
| Phần 1 | 3–4 bước / câu, bước nghĩ thật, không bước "đọc kĩ đề"; không lộ đáp số ở các bước. Dòng `Thử lại:` (27a, 27b, 28c, 29b, 29d) có chứa đáp số — brief cho phép đoạn `Thử lại`, giữ |
| Định dạng | `\cdot` đúng chỗ, không `\times`, không dấu chấm làm dấu nhân, thập phân `{,}`, mỗi dòng biến đổi một đoạn |

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| — | — | Không sửa | — |

## Câu còn `Chưa chắc`

Không có. (29d nghiệm $\dfrac{6}{29}$ xấu nhưng đề in rõ, 29b cũng là phân số — không đủ căn cứ nghi in lỗi.)
