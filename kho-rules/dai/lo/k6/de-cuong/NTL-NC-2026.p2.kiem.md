# NTL-NC-2026 — trạm 2 — KIỂM MÙ (Opus, 24/10)

> Giải từ ảnh `t-01.png` (Tiết 19, nửa dưới trang 1) + phóng to 260 dpi `z/soat-p2-t19-01.png`, CHƯA mở bản soạn. Số kiểm bằng `node -e` (vét cạn số nguyên tố, ước, giá trị biểu thức).
> Vết bút trên trang 1 (gạch chân "Bài 1", "Bài 2" phần về nhà; dấu tích ở bảng Đúng/Sai) không phải đáp án — không dùng.

| Nhãn | Đáp án / đáp số | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| T19 TL Bài 2 | $43=2+41$ (cách duy nhất); $30=7+23=11+19=13+17$; $32=3+29=13+19$ — mỗi số chỉ cần một cách | Máy vét cạn: 43 chỉ có 2+41 (43 lẻ ⇒ phải có số hạng 2). Đề rõ. |
| T19 TL Bài 3 | $A$ hợp số ($2020.2021\vdots 5$, $5\vdots 5$ ⇒ $A\vdots 5$, $A>5$); $B$ hợp số ($B=99\dots9$ gồm 2020 chữ số 9 ⇒ $B\vdots 9$, $B>9$) | $A=4082425$. Đề rõ: $A=2020.2021+5$, $B=10^{2020}-1$. |
| T19 TL Bài 4* | $p=3$ | $p=2$: $p+2=4$ loại; $p=3$: $5$, $7$ nguyên tố; $p>3$: $p$ chia 3 dư 1 ⇒ $p+2\vdots 3$; dư 2 ⇒ $p+4\vdots 3$ ⇒ loại. Máy: $p<10^5$ chỉ có 3. Đáp số một số ⇒ trả lời ngắn `3`. |
| T19 TL Bài 5* | Chứng minh: $p>3$ ⇒ $p$ chia 3 dư 1 hoặc 2; dư 2 ⇒ $p+4\vdots 3$, $p+4>3$ ⇒ hợp số (trái giả thiết) ⇒ $p$ chia 3 dư 1 ⇒ $p+8\vdots 3$, $p+8>3$ ⇒ hợp số | Máy: không có $p>3$, $p<10^6$ nào để $p, p+4, p+8$ cùng nguyên tố. Đề rõ. |
| T19 VN Bài 1a | $\text{Ư}(40)=\{1;2;4;5;8;10;20;40\}$; ước nguyên tố: $2$; $5$ | tự luận |
| T19 VN Bài 1b | $\text{Ư}(85)=\{1;5;17;85\}$; ước nguyên tố: $5$; $17$ | tự luận |
| T19 VN Bài 2.A | $A=302+150+826$ hợp số (ba số hạng chẵn ⇒ $A\vdots 2$, $A>2$) | $A=1278$. |
| T19 VN Bài 2.B | $B=5.7.9-2.5.6$ hợp số (hai tích chia hết cho 5 ⇒ $B\vdots 5$, $B>5$; cũng chia hết cho 3) | $B=255$. |
| T19 VN Bài 2.C | $C=12.13.14.17+91$ hợp số ($12.13.14.17\vdots 13$, $91=7.13\vdots 13$ ⇒ $C\vdots 13$, $C>13$; cũng chia hết cho 7) | $C=37219=13.2863$. |
| T19 VN Bài 2.D | $D=7.8.39-2.3.5$ hợp số (hai tích chia hết cho 3 ⇒ $D\vdots 3$, $D>3$; cũng chia hết cho 2) | $D=2154$. |
| T19 VN Bài 3 | $p+5$ là hợp số: $p$ nguyên tố $>3$ ⇒ $p$ lẻ ⇒ $p+5$ chẵn, $p+5>2$ ⇒ hợp số (không cần dùng giả thiết $p+7$) | **ĐỀ IN LỖI (giả thiết không bao giờ xảy ra):** $p>3$ nguyên tố ⇒ $p$ lẻ ⇒ $p+7$ chẵn, $p+7\ge 12$ ⇒ $p+7$ luôn là hợp số. Máy: 0 số $p$ ($5\le p<10^6$) để $p+7$ nguyên tố. Kết luận "$p+5$ hợp số" vẫn đúng với MỌI số nguyên tố $p>3$ (vì $p+5$ chẵn). Không đoán được đề gốc định viết gì (vd $p+8$, $p+10$, $2p+7$…). |
