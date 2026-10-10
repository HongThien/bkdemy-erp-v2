# GKI-08 — biên bản giải MÙ (Pha 1, trạm soát)

> Đề: THCS Ái Mộ (phường Bồ Đề) — Giữa học kì I Toán 6, 2025–2026, ngày thi 6/11/2025, mã đề 601. Giải từ ảnh `trang/p-1.png`, `p-2.png`
> (phóng to lại Bài 2a và Bài 4 bằng `pdftoppm -r 250` để chắc con số), CHƯA mở `GKI-08.soan.md`.
> Số tính lại bằng `node -e`. Đề không có phần tiếng Anh "Hệ T".

| Nhãn | Đáp án / đáp số | Ghi chú về đề |
|---|---|---|
| Câu 1 | C — $A=\{1;2;3;4;5;6\}$ nên $6\in A$ (A sai vì khác 0; B sai vì $5\in A$; D sai vì nhỏ hơn 7) | |
| Câu 2 | B — $A=\{2;4;6;8;10\}$ ($\mathbb{N}^*$ không có 0; $x\le 10$ nên có 10) | |
| Câu 3 | D — chữ số tận cùng 0 | Đề ghi "Số * thích hợp" (ý là chữ số) |
| Câu 4 | A — $28\vdots 2$ nên cần $m\vdots 2$; chỉ có 12 chẵn (15, 5, 23 lẻ) | Đề ghi "Để $(28+m)\vdots 2$ thì m là" |
| Câu 5 | D — $3^3.3^4=3^{3+4}=3^7$ | Phương án B in "$3^1$" |
| Câu 6 | B — $\text{Ư}(10)=\{1;2;5;10\}$, ước lớn hơn 5 là 10 | |
| Câu 7 | D — hình chữ nhật có hai cạnh đối bằng nhau (A sai: cạnh đối song song; B sai: hai đường chéo cắt nhau; C sai: chỉ bằng nhau, không vuông góc) | |
| Câu 8 | C — Hình 3 (hộp mứt 6 cạnh). Hình 1 giá treo hình thoi, Hình 2 ti vi hình chữ nhật, Hình 4 dây treo hình vuông / thoi | Cần hình (4 ảnh) |
| Bài 1a | $153+328+47-128=(153+47)+(328-128)=200+200=400$ | |
| Bài 1b | $36.27+36.58+36.15=36.(27+58+15)=36.100=3600$ | Dấu chấm là dấu nhân |
| Bài 1c | $192:6+5.2^2-4^5:4^3=32+20-16=36$ | |
| Bài 1d | $170-[2026^0+15.(5^2.2-7^2)^{2025}]=170-[1+15.1^{2025}]=170-16=154$ | |
| Bài 2a | **Không có số tự nhiên $x$ nào** — $28+x=15$ mà $28>15$ (ra $x=15-28$, không trừ được trong $\mathbb{N}$) | ⚠ ĐỀ IN LỖI (đã phóng to: đúng là "$28+x=15$"). Đề yêu cầu "tìm số tự nhiên $x$", GKI chưa học số nguyên âm. Có thể đề gốc định in số khác ($28+x=45$…?) — không đoán được |
| Bài 2b | $3x+6=3^2.4=36$ ⇒ $3x=30$ ⇒ $x=10$ | |
| Bài 2c | $5^{2x-1}=125=5^3$ ⇒ $2x-1=3$ ⇒ $2x=4$ ⇒ $x=2$ | |
| Bài 2d | $x\in\text{B}(4)$, $8\le x<20$ ⇒ $x\in\{8;12;16\}$ | Đáp số là một tập 3 số ⇒ không phải "một số ≤ 4 ô" |
| Bài 3 | a) Chu vi $(24+18).2=84$ (m); diện tích $24.18=432$ (m$^2$). b) Rau: $432.5=2160$ (kg); tiền: $2160.8000=17280000$ (đồng) | Ảnh minh hoạ ruộng rau — không cần để giải. Đề in "chiều rộng18 m" (thiếu dấu cách) |
| Bài 4 | **Không phân xử được — đề hai cách hiểu.** (i) Hiểu đúng chữ "số TIỀN mỗi loại bằng nhau": số tiền mỗi loại là bội chung của 10000, 20000, 50000, 100000 ⇒ $=100000.k$ ⇒ số tờ $10k+5k+2k+k=18k$; $18k=32$ **không có $k$ tự nhiên** (vét cạn bằng máy: 0 nghiệm) ⇒ vô nghiệm. Nếu đề là 36 tờ thì $k=2$: 20, 10, 4, 2 tờ, tổng 800000 đồng. (ii) Hiểu "số TỜ mỗi loại bằng nhau": $32:4=8$ tờ mỗi loại, tổng $8.(10000+20000+50000+100000)=1440000$ đồng | ⚠ ĐỀ NGHI IN LỖI (đã phóng to: đúng là "số tiền mỗi loại bằng nhau và tất cả có 32 tờ tiền"). Cách (i) là cách đọc đúng chữ và đúng kiểu bài BCNN nhưng vô nghiệm với 32; cách (ii) có nghiệm nhưng phải đọc "số tiền" thành "số tờ" và bài thành phép chia quá dễ cho câu 1 điểm cuối đề |
| Bài 5 | $x+13=(x-3)+16$ ⇒ $16\vdots(x-3)$ ⇒ $x-3\in\text{Ư}(16)=\{1;2;4;8;16\}$ ⇒ $x\in\{4;5;7;11;19\}$ (máy vét $x>3$: đúng 5 giá trị này) | Trong $\mathbb{N}$ (GKI chưa có số âm) cần $x-3$ là số tự nhiên khác 0 ⇒ $x>3$. Nếu tính cả số chia âm thì $x=1$, $x=2$ cũng thoả — ngoài phạm vi GKI. Đáp số là tập ⇒ tự luận |
