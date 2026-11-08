KẾT LUẬN: ĐẠT (còn 1 câu chờ Thùy chọn cách hiểu đề: II4)

- Số câu: 19 (TN 11 · Đ/S 3 · TLN 5), tất cả `luyen`; 0 câu `giang` (đề ôn tập, không có mục "Ví dụ").
- Lệch đáp số Pha 1 (giải mù) vs bản soạn: trước 0 / sau 0. Cả 19 câu khớp đáp án sách.
- `kiem.mjs`: ✔ đạt sau khi sửa.

## Câu bỏ — xác nhận trong nguồn
| câu sách | lý do | xác nhận |
|---|---|---|
| I7 | công thức hàm số mất (`[[EQ-FAILED:oleObject33.bin]]`) | Đúng. Lời giải sách cho thấy nhánh trái là $x$, nhánh phải $x^2+1$, $f(0)=0$, nhưng không biết chắc chỗ chia nhánh ($x\le0$ hay $x<0$…) ⇒ không dựng lại đề (§1.5). |
| III5 | công thức hàm số mất (`[[EQ-FAILED:oleObject109.bin]]`) | Đúng. Lời giải sách lộ hai nhánh $\frac{\sqrt{x+4}-2}{x}$ ($x>0$) và $mx+m+\frac14$ ($x<0$…), đáp án 0, nhưng dòng cuối sách in rác ("$F=(-\frac52;-2;0)$") ⇒ không dựng lại. |
| II3 | bãi đỗ xe — ý a), c) nói "đồ thị (hình vẽ)", `[[img:image86.png]]`; lời giải ý c cũng mất công thức | Đúng là phụ thuộc hình. (Hàm cước mô tả đủ bằng chữ nên có thể viết lại đề không cần hình nếu Thùy muốn — không tự làm.) |

## Bảng lỗi / sửa
| id | lỗi | sửa gì |
|---|---|---|
| nbv-ot-d2-I2 | dạng: `NDB01155` (dãy chứa cả $n^k$ và $q^n$) — đề $\lim(9^n-5^n)$ không có $n^k$ | → `NDB01161` (rút luỹ thừa trội, quy tắc tích ra $\pm\infty$; đứng sau 01154/01155), giữ `vua`. Ghi chú: bản đồ chưa có dạng riêng "hiệu $a^n-b^n$ ra vô cực". |
| nbv-ot-d2-II4 | lời giải: dòng "Lưu ý" nhắc đáp án / lỗi in của sách (không phải chữ HS viết) và không nêu cách hiểu còn lại | Viết lại "Lưu ý": nói rõ đề mơ hồ, bài giải theo cách hiểu 10000 đ/km; nếu hiểu trọn gói thì $f(30)=408250$ và chỉ ý b) đổi thành Sai. Lỗi in của sách chuyển vào `ghi_chu`. |

Các mục còn lại đã soát, không lỗi: đề chuẩn hoá giữ nghĩa (số, dấu, mũ, ∞; "Giá mở của/Giá cưới" sửa chính tả hiển nhiên); `vai` đúng; Đ/S không dạng; lời giải đúng toán từng dòng, trong phạm vi (không L'Hôpital/đạo hàm), Phần 1 không lộ đáp số; TLN đều ≤ 4 ký tự; `kiem` tính lại từ dữ kiện đề (I11 và ý a của II4 kiểm hơi yếu nhưng không tautology). Dạng I5 = NDB01180 (nhân liên hợp được đưa về ∞/∞ — đúng luật "một cách giải là đủ"), III6 = NDB01201: đồng ý. III6: `[[img:image109.wmf]]` thay cho chữ $m$ — xác nhận (lời giải sách dùng $m$ xuyên suốt).

## Câu còn nghi — cần Thùy
- **nbv-ot-d2-II4** (taxi). Bảng giá: "Giá mở cửa (0,5 km) — 10 000 đồng".
  - Cách hiểu A (bản soạn, khớp đáp án sách): 10 000 đ/km cho 0,5 km đầu ⇒ $f(x)=10000x$ khi $x\le0{,}5$, $f(30)=403250$, $f(40)=513250$ ⇒ **a S · b Đ · c Đ · d S**.
  - Cách hiểu B (nghĩa thường của "giá mở cửa"; chính lời giải sách cũng viết "$f(x)=10000$ khi $0<x\le0{,}5$" rồi lại kết luận công thức $10000x$ — tự mâu thuẫn): trọn gói 10 000 đ ⇒ $f(30)=408250$, $f(40)=518250$ ⇒ **a S · b S · c Đ · d S** (ý c xét đúng hàm đã cho trong đề nên vẫn Đ; d sai theo cả hai cách).
  - Máy: A $f(40)=513250$, B $f(40)=518250$; cả hai ≠ 515000. Hai cách hiểu CHỈ khác ý b). Đang giữ A (khớp sách) + Lưu ý ghi cách B. Thùy chọn: giữ A, đổi sang B, hay sửa chữ đề thành "10 000 đồng/km cho 0,5 km đầu" để hết mơ hồ.
