# DC-09c — Trạm SOÁT, Pha 1: giải MÙ (chưa mở bản soạn)

Nguồn: `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K7\DC-09\trang\p-09.png`, `p-10.png` (+ phóng 300 dpi `z\c-p9-top-09.png`, `z\c-p10-nc-10.png`).
Máy kiểm: `C:\Users\WBPC\bk-kho-lam-viec\de-thi\K7\DC-09\tam\soat-c-mu.mjs` (BigInt phân số; Bài 15 vét cạn $x,y\in[-2000;2000]$; Bài 16 kiểm 3001 cặp số chính phương lẻ liên tiếp × 2 thứ tự).

| Nhãn | Đáp án / đáp số (1 dòng) | Ghi chú về đề |
|---|---|---|
| ÔT D2 Bài 2.7 | $\left(0,2+1\frac35x\right)(x^2-9)=0$ ⇒ $x\in\left\{-\dfrac18;3;-3\right\}$ | $1\frac35x$ = hỗn số nhân $x$ = $\dfrac85x$ (phóng to đã rõ) |
| ÔT D2 Bài 2.8 | $2\left(\frac35\right)^x+\frac15=\frac{23}{25}$ ⇒ $\left(\frac35\right)^x=\frac9{25}$ ⇒ $x=2$ | — |
| ÔT D2 Bài 2.9 | $2026^0-\left[\frac23-\left(x-\frac12\right)^3\right]=\frac1{27}$ ⇒ $\left(x-\frac12\right)^3=-\frac8{27}$ ⇒ $x=-\dfrac16$ | — |
| ÔT D2 Bài 2.10 | $4^x+4^{x+3}=4160$ ⇒ $4^x.65=4160$ ⇒ $4^x=64$ ⇒ $x=3$ | — |
| ÔT D2 Bài 2.11 | $x^{13}=27.x^{10}$ ⇒ $x^{10}(x^3-27)=0$ ⇒ $x\in\{0;3\}$ | dấu `.` là nhân |
| ÔT D2 Bài 2.12 | $(4x-1)^2=(1-4x)^4=\left[(4x-1)^2\right]^2$ ⇒ $(4x-1)^2\in\{0;1\}$ ⇒ $x\in\left\{0;\dfrac14;\dfrac12\right\}$ | — |
| ÔT D3 Bài 3 | a) $\frac56+1\frac13=\frac{13}{6}$ giờ (2 giờ 10 phút) · b) $(63-15):\frac43=36$ km/h | — |
| ÔT D3 Bài 4 | dài 25 m, chu vi 62,5 m · a) 5 000 000 đồng · b) $S=156,25$ m², 468,75 kg, 2 343 750 đồng · c) cạnh 12,5 m, chu vi 50 m, 4 000 000 đồng | c) cạnh hình vuông = $\sqrt{\frac{625}4}=\frac{25}2$ (căn bậc hai số học, trong phạm vi Chương II) |
| ÔT D3 Bài 5 | lãi 13 000 000 đồng ⇒ lãi suất $6,5\%$/năm | — |
| ÔT D3 Bài 6 | a) $860000.85\%.98\%=716380$ đồng · b) $999600:(85\%.98\%)=1200000$ đồng | "giảm thêm 2% trên giá đã giảm" ⇒ nhân tầng; b) hiểu mẹ vẫn được cả 2 lần giảm |
| ÔT D5 Bài 12 | $B=-\dfrac{11}{20}$ (9 thừa số âm; $\frac{1\cdot3}{2^2}\cdot\frac{2\cdot4}{3^2}\cdots\frac{9\cdot11}{10^2}=\frac1{10}\cdot\frac{11}2$) ⇒ $B<-\dfrac{11}{21}$ | — |
| ÔT D5 Bài 13 | $\frac2{n^2}<\frac2{(n-1)(n+1)}=\frac1{n-1}-\frac1{n+1}$ với $n=3,5,\dots,2025$ ⇒ $A<\frac12-\frac1{2026}=\frac{506}{1013}$ (đpcm) | máy: từng số hạng đúng `<`, tổng đúng `<` |
| ÔT D5 Bài 14 | mỗi thừa số $\frac{k+1}k-\frac2{k^2}=\frac{(k-1)(k+2)}{k^2}$, $k=2..100$ ⇒ $B=\frac1{100}\cdot\frac{101.102}{2.3}=\dfrac{1717}{100}=17,17$ | đáp số 5 kí tự ⇒ không vừa ô TLN ⇒ `tu_luan` |
| ÔT D5 Bài 15 | a) $(x+3)(y-2)=15$ ⇒ 8 cặp $(x;y)$: $(-2;17),(0;7),(2;5),(12;3),(-4;-13),(-6;-3),(-8;-1),(-18;1)$ · b) $(x+5)(y-1)=5$, $y\ne1$ ⇒ 4 cặp: $(-4;6),(0;2),(-6;-4),(-10;0)$ | vét cạn BigInt khớp đủ 8 + 4 cặp |
| ÔT D5 Bài 16 | $a=(2k+1)^2$, $b=(2k+3)^2$ (thứ tự nào cũng vậy): $(a-1)(b-1)=16.k(k+1)^2(k+2)$, $k(k+1)^2(k+2)\,\vdots\,3$ và $\vdots\,4$ ⇒ $(a-1)(b-1)\,\vdots\,192$ ⇒ đpcm (thừa số $a$ không cần) | máy 6002 cặp, 0 lỗi; khai triển $(2k+1)^2-1$ phải bằng phân phối (không hằng đẳng thức lớp 8) |

## Câu Đại trên ảnh mà bản soạn thiếu

Không có. Danh sách nhãn phủ đủ: Dạng 2 ý 7)–12) (đầu trang 9), Dạng 3 Bài 3–6, Dạng 5 Bài 12–16.
Câu bỏ đúng phạm vi: Dạng 4 Hình học Bài 7–11 (trên ảnh tiêu đề "Dạng 4: Hình học" đứng ngay trước Bài 7) — góc, tia phân giác, song song.
