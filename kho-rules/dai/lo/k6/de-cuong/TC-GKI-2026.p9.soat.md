KẾT LUẬN: ĐẠT

# TC-GKI-2026 · trạm 9 (Bài 16a–16d, 17a, 18b, 18c — nâng cao) — biên bản soát (Opus, 20/10)

- Số câu: **7** (0 TN · 1 TLN · 6 tự luận, sau sửa). Không có hình đề, không cần hình giải.
- Khớp Pha 1 (`TC-GKI-2026.p9.kiem.md`) ngay từ đầu: **7/7** — kết luận chia hết / ƯCLN = 1 / $p=3$ / $n\in\{0;3\}$ trùng nhau; cách hiểu đề 16a–d cũng trùng (biểu thức vừa cho; 16d bỏ số hạng 2 thừa).
- Số câu phải sửa: **3** (1 phân loại, 2 định dạng nhỏ); thêm bằng chứng máy + đề xuất sửa đề vào 4 dòng `Chưa chắc` (không đổi ý).
- Đề chép đúng ảnh (đối chiếu ảnh 260 dpi `z/p9_bai16-6.png`): 16a "Chứng tỏ A", 16b "chứng tỏ rằng B", 16c "Chứng tỏ C" in thật; 16d in thật "$2+2^1+2^2+2^3+\dots+2^{60}$".
- Lời giải: đúng toán từng dòng; trong phạm vi lớp 6 (ghép nhóm + đặt thừa số chung theo NNB00913; ƯCLN $=d$ theo NNB00916–918; tách $2.(3n+5)=3.(2n+1)+7$ rồi thử lại theo NNB00911; số dư khi chia cho 3 viết $3k+1$, $3k+2$ — brief cho phép). Không chuyển vế / hằng đẳng thức / đồng dư. 16d chia hết cho 42 lấy thẳng từ $126=42.3$ nên không cần lập luận ƯCLN.
- Phần 1: 3–4 bước nghĩ thật, không lộ đáp số cuối.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 18b | phân loại | `loai=tu_luan · dap_an=—` → `loai=tra_loi_ngan · dap_an=3` | Đáp số là một số ($p=3$), khớp `^-?\d+(,\d+)?$` ⇒ trả lời ngắn (brief-soan-dc §3.3) |
| Bài 16a | định dạng | "Vì thừa số $3$ chia hết cho 3 nên $B\vdots 3$." → "Suy ra $B\vdots 3$." | Theo khuôn NNB00913 ("Suy ra A chia hết cho 3"), thống nhất với 16c, 16d |
| Bài 16b | định dạng | "Vì thừa số $4$ chia hết cho 4 nên $C\vdots 4$." → "Suy ra $C\vdots 4$." | Như trên |
| Bài 16a–16d | (bổ sung Chưa chắc) | Thêm kết quả máy của trạm soát + câu "Đề xuất sửa đề thành …" | Để CEO quyết sửa đề một lần (tiền lệ k6.md §9 10/10: đề gốc lỗi ⇒ CEO sửa đề cho rõ rồi nhập) |

## Câu còn `Chưa chắc` (gửi CEO)

| Câu | Lí do | Đề xuất |
|---|---|---|
| Bài 16a | Đề cho $B=2+2^2+\dots+2^{20}$ nhưng in "Chứng tỏ **A** chia hết cho 3" (chữ cái lệch, in thật). Lời giải chứng minh $B\vdots 3$ (máy: dư 0) | Sửa đề thành "Chứng tỏ $B$ chia hết cho 3" |
| Bài 16b | Đề cho $C=1+3+\dots+3^{99}$ nhưng in "chứng tỏ rằng **B** chia hết cho 4". Hiểu nguyên văn ($B$ của ý a) thì sai: $B$ chia 4 dư 2. Lời giải chứng minh $C\vdots 4$ | Sửa đề thành "Chứng tỏ rằng $C$ chia hết cho 4" |
| Bài 16c | Đề cho $D=1+4+\dots+4^{59}$ nhưng in "Chứng tỏ **C** chia hết cho 5; cho 21". Hiểu nguyên văn ($C$ của ý b) thì sai: $C$ chia 21 dư 19. Lời giải chứng minh $D\vdots 5$, $D\vdots 21$ | Sửa đề thành "Chứng tỏ $D$ chia hết cho 5; cho 21" |
| Bài 16d | Đề in $A=2+2^1+2^2+\dots+2^{60}$ — số hạng 2 trùng $2^1$; như in thì $A=2^{61}$ chia 7 dư 2 ⇒ đề sai. Chỉ cách hiểu $A=2^1+\dots+2^{60}$ cho $A\vdots 7$, $A\vdots 42$ (máy: dư 0); cách hiểu "$1+2+\dots+2^{60}$" là số lẻ, cũng sai. Lời giải theo cách hiểu bỏ số hạng 2 thừa, Phần 2 nêu rõ cách hiểu | Sửa đề thành $A=2+2^2+2^3+\dots+2^{60}$ (khi sửa, bỏ câu "Đề in có hai số hạng … ta hiểu …" ở đầu Phần 2 và Bước 1 / Chú ý ở Phần 1) |

Cổng: `✔ đạt cổng` — 7 câu (0 TN · 1 TLN · 6 tự luận) · chưa chắc 4.
