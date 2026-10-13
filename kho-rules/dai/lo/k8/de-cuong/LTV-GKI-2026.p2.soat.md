KẾT LUẬN: ĐẠT

# LTV-GKI-2026 — Phần 2 (Bài 6a–6b, 7a–7i, 8a–8c, 9) — biên bản soát (Opus, 13/10)

- Số câu: **15** (4 trả lời ngắn: 7a `6` · 7b `0,75` · 7d `-1,7` · 7h `-2`; 11 tự luận).
- Khớp Pha 1 (`LTV-GKI-2026.p2.kiem.md`) ngay từ đầu: **15/15** đáp số (6a $P=3$ · 6b đúng · 7a 6 · 7b $\tfrac34$ · 7c $-\tfrac73$ · 7d $-\tfrac{17}{10}$ · 7e $-\tfrac{35}{2}$ · 7f $13;\tfrac32$ · 7g $3;\tfrac47$ · 7h $-2$ · 7i $3;\tfrac15$ · 8a $m=-1985$ · 8b $m=-\tfrac{13}{2},n=-13$ · 8c $m\in\{5;6\}$ · 9 dư $5x-1$).
- Đề so ảnh (`trang/p-2.png`, `p-3.png` + phóng to 300/600 dpi): 15/15 chép đúng.
- Kiến thức: không dùng tổng/hiệu hai lập phương, không phương pháp phân tích nhân tử Bài 9, không "phương trình/tập nghiệm", không Bézout (8a, 8b, 9 tự lập luận hai chiều bằng phép chia đa thức một biến lớp 7 + so bậc). Bậc hai 7f/7g/7i giải bằng bình phương của một hiệu viết ngược + căn bậc hai lớp 7 — hợp lệ.
- Phân loại: đúng (7b, 7d là TLN theo tiền lệ NSHM 5g/5i: phân số đổi được ra thập phân ≤ 4 kí tự; 7e $-17{,}5$ quá 4 kí tự ⇒ tự luận).
- Số câu phải sửa: **3** (7f, 7g, 7i — cùng một lỗi lập luận nhỏ + cập nhật dòng Chưa chắc). Bản gốc: `LTV-GKI-2026.p2.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng (15 câu · 4 TLN · 11 tự luận · chưa chắc 3).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| 7f | lập luận | Dòng "Suy ra $4x-29=23$ hoặc $4x-29=-23$" thêm lí do "(chỉ có hai số có bình phương bằng $23^2$ là $23$ và $-23$)" | Phần 2 thiếu lí do của bước then chốt; lí do phải là căn bậc hai lớp 7 (không có "tích bằng 0" vì chưa học phân tích nhân tử) |
| 7g | lập luận | Như 7f, với $17^2$ | Như trên |
| 7i | lập luận | Như 7f, với $7^2$ | Như trên |
| 7f, 7g, 7i | ghi chú | Viết lại dòng `Chưa chắc`: thêm kết luận đọc ảnh phóng to (đề in rõ) + kết quả thử đổi hằng số | Theo yêu cầu kiểm lại đề in lỗi |

## Kiểm đề in lỗi 7f, 7g, 7i (yêu cầu riêng)

Phóng to `goc.pdf` 600 dpi: ba đề in sắc nét, số mũ và dấu đọc chắc chắn, đúng như bản chép (7f: vệt nhỏ sau $(x+3)$ là bẩn scan, không phải kí hiệu). Máy thử đổi TỪNG hằng số / số mũ của mỗi đề trong khoảng $-9..60$:
7g không bản nào ra bậc nhất; 7f chỉ ra bậc nhất với nghiệm xấu ($\tfrac{37}{33}$, …); 7i ra bậc nhất khi vế phải $9x^2+4$ ($x=\tfrac{3}{16}$) hoặc $(2x-2)^2$ ($x=\tfrac14$) — không thuyết phục. Cả ba đều có nghiệm hữu tỉ đẹp và hệ số bậc hai không triệt tiêu
⇒ kết luận: **đề cố ý ra bậc hai** (dạng "đưa về tích" của Bài 9 Chương II — ngoài trọng tâm LTV "đến hết bài 7"), không phải in lỗi. Lời giải giữ cách hoàn thành bình phương.

## Câu còn `Chưa chắc` (gửi CEO)

- **7f** — bậc hai ($x=13$ hoặc $x=\tfrac32$); đề in rõ, cố ý; ngoài trọng tâm đến bài 7 ⇒ CEO quyết có cho dùng tách hạng tử không.
- **7g** — bậc hai ($x=3$ hoặc $x=\tfrac47$); như trên.
- **7i** — bậc hai ($x=3$ hoặc $x=\tfrac15$); như trên.
