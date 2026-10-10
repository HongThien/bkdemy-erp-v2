# GKI-07 — bản giải MÙ của trạm soát (Pha 1)

> Đề: Giữa học kì I Toán 6, Trường TH, THCS & THPT Đa Trí Tuệ, năm học 2025–2026, **Mã đề 02** (2 trang: `p-1.png`, `p-2.png`).
> Giải từ ảnh trang, CHƯA mở `GKI-07.soan.md`. Số tính lại bằng `node -e`.
> Trang `p-3.png`, `p-4.png` là đề của trường khác (mã GKI-07b) — không thuộc đề này.
> Đề không có phần tiếng Anh "Hệ T". Đề không có hình.

| Nhãn | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu) |
|---|---|---|
| Câu 1 | **A** — $5^2.5^3=5^{2+3}=5^5$ | |
| Câu 2 | **KHÔNG CHỐT ĐƯỢC — hai phương án cùng đúng: B ($20000$) và C ($20$)** | ⚠ Lỗi đề gốc: số $24\,826$ có HAI chữ số 2 — chữ số 2 hàng chục nghìn có giá trị $20000$ (B), chữ số 2 hàng chục có giá trị $20$ (C). Đề hỏi "chữ số 2" mà không nói chữ số nào. `k6.md` §4: TN nhiều phương án đúng ⇒ không tự chọn, đưa vào danh sách treo. |
| Câu 3 | **D** — $9<x<13$, $x\in\mathbb{N}$ ⇒ $A=\{10;11;12\}$ | |
| Câu 4 | **A** — $A=\{1;2;3\}$ (dấu ngoặc nhọn) | |
| Câu 5 | **C** — XVI $=10+5+1=16$ | Phương án in sát chữ cái ("B.14", "C.16", "D.21") nhưng đọc rõ. |
| Câu 6 | **A** — Luỹ thừa → Nhân, chia → Cộng, trừ | |
| Câu 7 | **A** — $5\in M$ | $M=\{a;5;b;c\}$ |
| Câu 8 | **B** — $\text{Ư}(15)=\{1;3;5;15\}$ | Phương án A in thiếu dấu chấm cuối (không ảnh hưởng). |
| Câu 9 | **B** — $H=\{0;2;4;6;8\}$ nên $6\in H$ | $10\notin H$ vì $x<10$; $12>10$; $7$ lẻ. |
| Câu 10 | **C** — $17$ | $12$, $4$, $22$ đều là hợp số. |
| Câu 11 | **B** — $152$ (chữ số tận cùng là 2) | |
| Câu 12 | **B** — $1$ | |
| Bài 1a | $18=2.3^2$ | Đề yêu cầu "bằng sơ đồ cột hoặc sơ đồ cây". |
| Bài 1b | $120=2^3.3.5$ | |
| Bài 1c | $275=5^2.11$ | |
| Bài 2a | $1000$ — $(382+218)+(134+266)=600+400$ | |
| Bài 2b | $2300$ — $24.(82+18)-100=2400-100$ | Dấu chấm trong $24.82$, $24.18$ là dấu NHÂN (không phải số thập phân). |
| Bài 2c | $39$ — $\{[5.10-4]:2\}+20-2^2=23+20-4$ | Biểu thức: $\{[(2^2+1).10-(10:2-1)]:2\}+20-(10:5)^2$. |
| Bài 3a | $x=39$ | |
| Bài 3b | $x=80$ — $180-x=100$ | |
| Bài 3c | $x=2$ — vế phải $=210-25.7=35$; $3^{2x-1}=27=3^3$; $2x-1=3$ | Số mũ là $2x-1$; trong ngoặc vuông là $5^2.(2^3-1)$. |
| Bài 4 | Nhiều nhất **24** phần thưởng; mỗi phần **2** quyển vở và **3** chiếc bút bi | $\text{ƯCLN}(48;72)=24$; $48:24=2$; $72:24=3$. |
| Bài 5 | Chứng minh (không có đáp số). Ý chính: $p>3$ nguyên tố ⇒ $p$ lẻ ⇒ $p+1\ \vdots\ 2$. Xét $p$ chia cho 3: $p=3k+1$ ⇒ $p+2=3k+3\ \vdots\ 3$ và $p+2>3$ ⇒ hợp số (loại); nên $p=3k+2$ ⇒ $p+1=3k+3\ \vdots\ 3$. $p+1$ là bội chung của 2 và 3 ⇒ chia hết cho $\text{BCNN}(2;3)=6$. | Đã thử máy mọi cặp nguyên tố sinh đôi $p<100000$: $p+1$ luôn chia hết cho 6. Bước "chia hết cho 2 và 3 ⇒ chia hết cho 6" phải dựa trên BC/BCNN (lớp 6), không dùng "nguyên tố cùng nhau ⇒ chia hết cho tích" như một quy tắc trích dẫn. |
