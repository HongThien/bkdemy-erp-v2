# TC-GKI-2026 · trạm 9 — kiểm MÙ (Opus, 20/10)

Giải từ ảnh `t-6.png` + phóng to 260 dpi (`z/p9_bai16-6.png`), chưa mở bản soạn. Mọi đáp số kiểm bằng `node -e` (BigInt / vét cạn).

| Nhãn | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 16a | $B=(2+2^2)+\dots+(2^{19}+2^{20})=3.(2+2^3+\dots+2^{19})\ \vdots\ 3$ (20 số hạng, ghép 10 cặp). Máy: $B$ chia 3 dư 0 | Đề cho $B$ mà kết luận "Chứng tỏ **A**" — chữ cái lệch, hiểu là $B$ |
| Bài 16b | $C=(1+3)+\dots+(3^{98}+3^{99})=4.(1+3^2+\dots+3^{98})\ \vdots\ 4$ (100 số hạng, 50 cặp). Máy: dư 0 | Đề cho $C$ mà kết luận "**B** chia hết cho 4" — hiểu là $C$ |
| Bài 16c | $D$: 60 số hạng; ghép 2 ⇒ $1+4=5$ ⇒ $D\vdots 5$; ghép 3 ⇒ $1+4+4^2=21$ ⇒ $D\vdots 21$. Máy: dư 0 cả hai | Đề cho $D$ mà kết luận "**C** chia hết cho 5; cho 21" — hiểu là $D$ |
| Bài 16d | Đọc nguyên văn $A=2+2^1+2^2+\dots+2^{60}$ (số 2 xuất hiện hai lần) thì $A=2^{61}$, KHÔNG chia hết cho 7 (máy: dư 2) ⇒ mệnh đề sai. Hiểu $A=2^1+2^2+\dots+2^{60}$ (60 số hạng): ghép 3 ⇒ $2.(1+2+4)=14$ ⇒ $A\vdots 7$; ghép 2 ⇒ $2+4=6$ ⇒ $A\vdots 6$; $\text{ƯCLN}(6,7)=1$ ⇒ $A\vdots 42$ (máy: dư 0). Hiểu $1+2+\dots+2^{60}$ thì lẻ ⇒ cũng sai | **Đề in lỗi**: số hạng đầu "2" trùng $2^1$; chỉ cách hiểu $A=2+2^2+\dots+2^{60}$ (bỏ $2^1$ thừa) cho kết luận đúng ⇒ Chưa chắc |
| Bài 17a | Gọi $d=\text{ƯCLN}(2n+5,4n+9)$; $2.(2n+5)=4n+10$; $(4n+10)-(4n+9)=1\vdots d$ ⇒ $d=1$ (máy: $n<10^5$ không ngoại lệ) | — |
| Bài 18b | $p=3$ (máy vét $p<10^5$ chỉ ra 3). Lí do: $p=3$ ⇒ 3, 7, 11 nguyên tố; $p\ne 3$ ⇒ $p$ chia 3 dư 1 thì $p+8\vdots 3$, dư 2 thì $p+4\vdots 3$, mà lớn hơn 3 ⇒ hợp số | Đáp số một số ⇒ trả lời ngắn `3` |
| Bài 18c | $n\in\{0;3\}$: $2.(3n+5)=6n+10=3.(2n+1)+7$ ⇒ $7\vdots(2n+1)$ ⇒ $2n+1\in\{1;7\}$ (máy vét $n<10^5$: 0, 3) | Hai giá trị ⇒ tự luận |
