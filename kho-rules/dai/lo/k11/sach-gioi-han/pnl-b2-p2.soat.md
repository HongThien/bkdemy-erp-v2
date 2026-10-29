KẾT LUẬN: ĐẠT

# Soát pnl-b2-p2 (PNL Bài 2 Giới hạn hàm số, phần 2/2)

- 77 câu (49 TN = Câu 19–67 · 13 Đ/S · 15 TLN), tất cả `luyen`, không tách ý. Nguồn có Đ/S Câu 1–14: Câu 9 cần đồ thị ⇒ bỏ đúng. TN63 có `[[img]]` thấu kính nhưng đề đủ chữ ⇒ giữ đúng.
- Lệch Pha 1 (giải mù, `pnl-b2-p2.kiem.md`) so với bản soạn: **trước 0 / sau 0**. Cả 49 TN, 52 ý Đ/S, 15 TLN khớp; mọi `sach_dap_so` khớp trừ 2 ý đã ghi LỆCH SÁCH (bên dưới).
- `kiem.mjs`: ✔ đạt (sau sửa). Bản gốc: `pnl-b2-p2.goc.json`.

## Sửa

| id | lỗi | sửa gì |
|---|---|---|
| TN22 | dạng | NDB01182 vừa → **NDB01184 cao**: $\frac{x-1}{x^2}$ = tích $L<0$ với $\frac1{x^2}\to+\infty$, trùng ví dụ của 01184 ($\frac{x-4}{(x-1)^2}$); dạng sau thắng |
| TN23 | dạng | NDB01183 vừa → **NDB01184 cao**: lời giải rút $x$ rồi quy tắc tích |
| TN26 | dạng | NDB01180 vừa → **NDB01184 cao**: $3x-\sqrt{9x^2-1}$ khi $x\to-\infty$ là $(-\infty)+(-\infty)$, KHÔNG phải ∞−∞; rút $x$ + quy tắc tích |
| TN28, TN53 | dạng | NDB01180 vừa → **NDB01184 cao**: hình thức ∞−∞ nhưng lời giải (và cách tự nhiên) là rút $x$ + quy tắc tích; 01184 đứng sau 01180 |
| TN37 | dạng | NDB01181 → **NDB01180 vừa**: $\frac1x\to0$ và $\sqrt{x^2+16}-x\to0$ ⇒ dạng 0·0, không phải 0·∞; lời giải liên hợp phần ∞−∞ |
| TN34, TN35, TN38 | độ chắc | NDB01181 vừa → **cao** (đúng dạng $0\cdot\infty$ tại vô cực, đưa vào căn / chia) |
| TLN12, TLN13 | dạng | NDB01178 → **NDB01183 vừa**: tử bậc cao hơn mẫu (16>12; 18>11) ⇒ giới hạn vô cực; dạng sau thắng (giống tiền lệ C57 ở tệp soát trước) |
| TLN14 | độ chắc | NDB01178 vừa → **cao** (tử bậc 16 < mẫu 19, giới hạn 0) |
| TN29 | lời giải (lộ đáp số) | Bước 3 Phần 1 nói "phân số có giới hạn bằng 0, rồi cộng với 1" ⇒ viết lại không nêu số |
| TN52 | lời giải (lộ đáp số) | Mấu chốt nói "phân thức dần tới 0" ⇒ viết lại |
| TN59, TN60 | ghi_chu | Bản soạn ghi "sách in sai phương án (700/400)" — sai: đó là phương án NHIỄU có chủ ý, đáp án D đúng; sửa ghi chú |
| TN58 | kiem yếu | thêm kiểm $a=1{,}9\Rightarrow-\infty$, $a=2{,}5\Rightarrow+\infty$, $a=2\Rightarrow+\infty$ (kiểm cả điều kiện $a\ge2$, không chỉ $P\ge4$) |

Đã xác nhận đúng (không sửa): TN58 điều kiện $a\ge2$ (kể cả $a=2$: tử → −3, mẫu → $0^-$) ⇒ min P = 4; sửa chữ đề TLN2 ($n\sqrt3\to x\sqrt3$), TLN10 (AH→OH), Đ/S12 ($a,3,c\to a,b,c$) là lỗi in hiển nhiên, lời giải sách xác nhận. Không thấy L'Hôpital/đạo hàm (TN67 dùng giới hạn tỉ số, đúng phạm vi), không `\times`/`\left`/`$$`.

## Độ chắc dạng 'vừa' sau soát: 31 → 22
Giữ 'vừa' có lý do:
- **Bản đồ thiếu dạng "tìm tham số để giới hạn tại vô cực bằng giá trị cho trước"** (8 câu): TN19, TN20, TN57, TN58 (→01179) · TN27, TN30, TLN1, TLN3 (→01180). Tương tự NDB01153 của dãy số / NDB01174 của 0/0 nhưng chưa có cho hàm tại vô cực.
- **Bản đồ thiếu dạng "0·∞ tại một điểm (một bên)"**: TN32, TN33, TN39, TN40 tạm 01181 (01181 nằm trong nhóm "tại vô cực").
- TN36 (0·∞ cho kết quả +∞ — 01181 thuộc nhóm hữu hạn), TN37 (0·0), TN48 (01169 + bất phương trình tham số), TN49 (quy tắc ở vô cực, 01169 là tại điểm), TN59/60/65 (lập biểu thức C(t), chưa lấy giới hạn), TN67 (vận tốc tức thời), TLN12/13 (câu hỏi chỉ hỏi bước rút luỹ thừa).

## Câu CÒN nghi cần CEO
| id | vấn đề | sách | bản này |
|---|---|---|---|
| DS1 ý d | đề in $f(x)-g(x)$, lời giải sách tính $f(x)+g(x)$ | Đúng (=1/2 với $f+g$) | theo số in: $f-g$ tại −1 có tử → 4, mẫu → 0 ⇒ không hữu hạn ⇒ **Sai**. Nếu Thùy coi là lỗi in hiển nhiên thì sửa đề thành $f+g$ và đổi ý d thành Đúng |
| DS12 ý c, d | đề in $a+2b=1$, $a+b=1$; lời giải sách dùng $a-2b=1$, $a-b=1$ | c Đúng, d Đúng | theo số in: $a+2b=1\Rightarrow L=-2$, $a+b=1\Rightarrow L=-1$ ⇒ **Sai, Sai**. Nghi mất dấu trừ (cùng câu đã mất chữ b → 3) ⇒ nếu sửa đề thì cả hai thành Đúng |
| TLN9, TLN11 | đẳng thức GIỚI HẠN không xác định duy nhất a, b, c, d (vd TLN9: $a=2,b=9$ cũng cho $\frac16$) | 9; 16 | giữ 9; 16 (đáp án dự định theo phép liên hợp). Có thể sửa đề thành "biến đổi … về dạng" cho chặt |
| TLN7 | vế phải chỉ là phần $\sqrt{x^2-x}-x$; đẳng thức đúng ở mức giới hạn, $a/b$ tối giản ⇒ $a=b=1$ | 2 | giữ 2 |
| Bản đồ | thiếu 2 dạng nêu trên (tham số tại vô cực · 0·∞ tại một điểm) | | Thùy quyết có thêm dạng không |
