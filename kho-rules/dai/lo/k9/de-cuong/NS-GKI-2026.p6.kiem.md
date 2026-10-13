# NS-GKI-2026 · Phần 6 — GIẢI MÙ của trạm soát (13/10)

> B. Hình học, Bài 1 (a–d) và Bài 2 (a–d), trang 3 của đề cương. Giải trước khi mở bản soạn.
> Máy tính: `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\NS-GKI-2026\tam\soat_p6.mjs` (`Math.sin`… theo độ; kiểm cả các đẳng thức góc phụ nhau và chuỗi so sánh trung gian).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 1a | $\cos40^\circ<\sin51^\circ<\cos30^\circ<\sin70^\circ$ — đưa về sin: $\cos30^\circ=\sin60^\circ$, $\cos40^\circ=\sin50^\circ$; $50^\circ<51^\circ<60^\circ<70^\circ$, góc nhọn tăng thì sin tăng | Đọc rõ: $\sin70^\circ,\ \cos30^\circ,\ \cos40^\circ,\ \sin51^\circ$ |
| Bài 1b | $\cos34^\circ<\sin57^\circ<\cot32^\circ$ — $\cos34^\circ=\sin56^\circ<\sin57^\circ<1$; $\cot32^\circ=\tan58^\circ>\tan45^\circ=1$ | Đọc rõ: $\cos34^\circ,\ \sin57^\circ,\ \cot32^\circ$. Sin và cot không cùng loại ⇒ phải so qua số $1$ |
| Bài 1c | $\sin40^\circ<\tan42^\circ<\cot43^\circ<\cot40^\circ$ — $\cot40^\circ=\tan50^\circ$, $\cot43^\circ=\tan47^\circ$; $\sin40^\circ<\tan40^\circ$ (vì $\cos40^\circ<1$) $<\tan42^\circ<\tan47^\circ<\tan50^\circ$ | Đọc rõ. $\tan42^\circ\approx0{,}90<1$ nên KHÔNG so $\sin40^\circ$ với tan qua số $1$ được — phải dùng $\sin\alpha<\tan\alpha$ |
| Bài 1d | $\sin27^\circ<\cot63^\circ<\tan52^\circ<\cot31^\circ<\tan72^\circ$ — $\cot63^\circ=\tan27^\circ$, $\cot31^\circ=\tan59^\circ$; $\sin27^\circ<\tan27^\circ<\tan52^\circ<\tan59^\circ<\tan72^\circ$ | Đề in thừa dấu phẩy cuối dòng (sau $\sin27^\circ$), đủ 5 tỉ số. $\tan27^\circ\approx0{,}51<1$ ⇒ cũng phải dùng $\sin\alpha<\tan\alpha$ |
| Bài 2a | $P=0$ — $\sin^260^\circ=\cos^230^\circ$, $\sin^250^\circ=\cos^240^\circ$ ⇒ $P=(\sin^230^\circ+\cos^230^\circ)-(\sin^240^\circ+\cos^240^\circ)=1-1$ | Đọc rõ |
| Bài 2b | $B=3$ (theo đúng bản in $\tan45^\circ\cdot\cot30^\circ\cdot\cot30^\circ=1\cdot\sqrt3\cdot\sqrt3$) | Đề in HAI lần $\cot30^\circ$ (đã phóng to 260 dpi, cả hai đều là $30^\circ$). Có thể đề gốc định in $\cot30^\circ\cdot\cot60^\circ$ (khi đó $B=1$) — không có căn cứ để tự sửa; giải theo bản in |
| Bài 2c | $C=\dfrac12$ $(=0{,}5)$ — $\cos^265^\circ=\sin^225^\circ$, $\cos^255^\circ=\sin^235^\circ$ ⇒ $C=1-1+\cos^245^\circ$ | Đọc rõ; dấu xen kẽ $+\ -\ +\ -\ +$ |
| Bài 2d | $C=\dfrac72$ $(=3{,}5)$ — 7 số hạng ($15^\circ,25^\circ,\ldots,75^\circ$): ba cặp phụ nhau, mỗi cặp bằng $1$, cộng $\cos^245^\circ=\dfrac12$ | Đề đặt tên biểu thức ý d cũng là $C$ (trùng ý c). Dấu "…" hiểu là cách đều $10^\circ$ |
