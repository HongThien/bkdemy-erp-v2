KẾT LUẬN: ĐẠT (còn 1 câu chờ Thùy chọn đề: C68)

# Soát pnl-b3-p2 — PNL Bài 3 Hàm số liên tục, phần 2/3

- Số câu: 52 (49 trắc nghiệm Câu 28–76 + 3 Đúng/Sai Câu 1–3), đều `luyen`. Nguồn có đúng 52 câu mở đầu trong khúc, không thiếu / thừa, không câu nào bỏ vì hình (ảnh duy nhất ở C29 chỉ là "$x=3$", lặp lại trong lời giải).
- Lệch đáp số Pha 1 (bản giải mù của tôi so với bản soạn): trước 0 / sau 0. Cả 52 câu khớp, kể cả 3 câu LỆCH SÁCH (C31, C63, C68).
- `kiem.mjs`: ✔ đạt (trước và sau khi sửa). Quét định dạng (`\times`, `\left`, `$$`, dấu chấm làm dấu nhân, L'Hôpital / đạo hàm, lộ đáp án ở Phần 1): không có lỗi nào.
- Bản gốc trước khi sửa: `pnl-b3-p2.goc.json`.

## Phân xử các điểm trạm soạn nêu

| câu | trạm soạn | phân xử bằng máy | kết luận |
|---|---|---|---|
| C31 (= C66) | LỆCH SÁCH: sách gạch B, máy 3 nghiệm → D | quét nghiệm $x^3-3x-1$: −1,532; −0,347; 1,879. Lời giải sách cũng ra 3 nghiệm, chỉ gạch nhầm B | D đúng, giữ |
| C63 | k=310 → C, sách gạch B (340) | $T(60)=130=k-180$ ⇒ $k=310$; lời giải sách cũng dừng ở $k-180=130$ | C đúng, giữ |
| C68 | sách D, máy ra 1 nghiệm → A, nghi hệ số | đề in $x^4-3x^2+x-\frac18$: nghiệm −1,888 và 1,552 ⇒ trong $(-1;3)$ có đúng 1 ⇒ A. **Cả 5 giá trị trong lời giải sách** ($f(-1)=\frac{23}8$, $f(0)=-\frac18$, $f(\frac12)=\frac1{16}$, $f(1)=-\frac98$, $f(3)=\frac{23}8$) khớp đúng với $x^4-3x^3+x-\frac18$, và đa thức đó có 4 nghiệm trong $(-1;3)$ (−0,582; 0,131; 0,566; 2,885) ⇒ D | gần chắc đề gốc là $3x^3$, in nhầm thành $3x^2$. Giữ A theo đề in, thêm dòng "Lưu ý" đầu Phần 2. **Chờ Thùy chọn** |
| C38 | phương án B cũng đúng | $x=3>0$ thuộc nhánh phân thức xác định ⇒ liên tục tại 3 ⇒ B đúng; C cũng đúng (trái 2023, phải 1) | đề có 2 phương án đúng; giữ C theo sách, thêm "Lưu ý" và sửa câu Phần 2 đang nói ngầm B đúng mà không nêu |
| C28 | mơ hồ | B, C, D là tập con của ℝ nên cũng đúng theo nghĩa chữ; A là tập lớn nhất | giữ A, Lưu ý đã có sẵn trong Phần 2 |
| C76 | đổi "liên tục trên ℝ" thành "$[0;+\infty)$" | hàm cước chỉ có nghĩa với $x\ge0$; với mọi $a$ hàm liên tục trên $[0;+\infty)$ ⇒ $a\in\{1000;2000;3000;4000\}$ ⇒ 4 (C), đúng đáp án sách | chấp nhận (sửa chữ hiển nhiên, đáp án sách rõ). Nếu giữ nguyên chữ "ℝ" thì hàm không xác định với $x<0$, đáp số thành 0 — vô nghĩa |
| C34, C35, C50 | dựng lại đề từ lời giải sách (công thức MathType hỏng) | lời giải sách nêu đủ cả ba nhánh: C34 $f(1)=k^2$, trái $x^2+3$, phải $(x+1)^2$; C35 $f(1)=n$, phải $\frac{x^3-x^2}{x-1}$, trái $mx+1$; C50 $\frac{x^2-3x+2}{x-1}$ và $m^2+2m-4$ — đều khớp 4 phương án, đáp án gạch chân | đề dựng chắc (chỉ có thể lệch dấu ≤/< ở nhánh, không đổi đáp số) |
| C49 | dựng lại; nhánh $x\ne1$ chỉ suy ra "$x^2-3x$" | lời giải sách chỉ viết $\lim(x^2-3x)=-2$; bản gốc có thể là phân thức rút gọn về $x^2-3x$ | **còn nghi về chữ đề** (đáp số −6 không đổi); nên đối chiếu ảnh sách gốc nếu muốn giữ đúng đề |

## Bảng sửa

| id | lỗi | sửa gì |
|---|---|---|
| C51 | dạng | NDB01193 → **NDB01191** (tham số chỉ ở nhánh $x\le2$, nhánh $x>2$ không chứa $m$), chắc: cao |
| C52 | dạng | NDB01193 → **NDB01191** (tham số chỉ ở nhánh $x\le8$), chắc: cao |
| C38 | lời giải / đề sai | thêm "Lưu ý: đề sai — phương án B cũng đúng…; theo đáp án sách ta chọn C." đầu Phần 2; dòng xét $x=1$, $x=3$ nói rõ B cũng đúng |
| C68 | đề nghi in sai | thêm "Lưu ý" đầu Phần 2 (giá trị trong lời giải sách ứng với $3x^3$, khi đó chọn D); bổ sung bằng chứng vào `ghi_chu` |

Các câu còn lại: đề khớp nguồn (đã đối chiếu C28, C29, C40, C48, C54, C62, C63, C64, C67, C68, C76, ĐS1–3), dạng hợp `dich.md`, lời giải đúng từng dòng (đã đọc C28, C29, C31, C34, C38, C39, C41, C44, C49, C51–54, C59–61, C63, C64, C67–70, C74–76, ĐS1–3), `kiem` tính lại từ dữ kiện đề.

## Còn nghi — cần CEO

1. **C68** — sách: D (4 nghiệm), đề in $x^4-3x^2+x-\frac18$ cho A (1 nghiệm). Toàn bộ số trong lời giải sách khớp $x^4-3x^3+x-\frac18$. Chọn: (a) giữ đề in, đáp án A (hiện tại); hoặc (b) sửa đề thành $3x^3$, đáp án D, viết lại lời giải theo sách (đơn giản hơn nhiều: 4 khoảng đổi dấu + bậc 4 có tối đa 4 nghiệm).
2. **C38** — đề có 2 phương án đúng (B và C). Giữ C theo sách kèm Lưu ý, hay sửa phương án B (vd "liên tục tại $x=0$") để câu chỉ còn một đáp án.
3. **C49** — chữ đề nhánh $x\ne1$ dựng lại từ một dòng lời giải, có thể khác bản gốc (đáp số không đổi).
4. **C28** — mơ hồ nghĩa chữ (mọi phương án đều là tập con của ℝ); giữ A theo sách.
