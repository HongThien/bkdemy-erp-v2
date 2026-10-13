# DC-02d — giải MÙ (trạm soát, Pha 1, chưa mở bản soạn)

Nguồn: Đề cương ôn tập GKI Toán 7 — THCS Tây Mỗ, phần BÀI TẬP NÂNG CAO (cuối p-09 = PDF tr.9 (in 29): Bài 1; nửa trên p-10 = PDF tr.10 (in 30): Bài 2–9). Phóng 400 dpi đọc đề. Số liệu kiểm bằng `node -e`.

| Nhãn | Đáp án / đáp số | Ghi chú về đề |
|---|---|---|
| Bài 1 | $A>B$ (máy: $A\approx0,004392$, $B\approx0,003711$). Cách: $1011A=S_{le}$, $1010B=S_{chan}$ (cùng 1010 số hạng); $S_{le}-S_{chan}>1-\dfrac12$ nên $S_{le}>S_{chan}+\dfrac12$; $S_{chan}<1010.\dfrac12=505$ ⇒ $1010.S_{le}>1011.S_{chan}$ | Đề rõ |
| Bài 2 | $2023$ ($C=\dfrac1{1012}+\dots+\dfrac1{2022}=D$ ⇒ $C-D=0$) | Đề in `D = 1/1012 + 1/1013 −+ 1/1014 + …` — dấu "−+" thừa, hiểu là toàn dấu cộng (nếu không thì $C\ne D$ và bài không ra số đẹp) |
| Bài 3 | Đúng: $5S=1-\dfrac1{2^{2020}}<1$ ⇒ $S<0,2$ (nhân $2^2$ rồi cộng $S$) | Đề rõ |
| Bài 4 | $(x;y)\in\{(40;0);(-40;1);(8;-2);(-8;3)\}$ — từ $x.(1-2y)=40$, $1-2y$ lẻ ⇒ ước lẻ $\pm1,\pm5$ (máy quét $|x|,|y|\le200$ ra đúng 4 cặp) | Đề rõ |
| Bài 5 | Đúng: $P=99-\left(\dfrac1{2^2}+\dots+\dfrac1{100^2}\right)$, ngoặc $<1-\dfrac1{100}<1$ ⇒ $P>98$ (máy $P\approx98,365$) | Đề rõ |
| Bài 6 | Đúng: $\dfrac{2k+1}{k^2(k+1)^2}=\dfrac1{k^2}-\dfrac1{(k+1)^2}$ ⇒ $B=1-\dfrac1{(n+1)^2}<1$ | Không ghi $n$ nguyên dương — hiểu ngầm |
| Bài 7 | $c$ nhỏ nhất $=-\dfrac23$ khi $a=\dfrac43$, $b=\dfrac13$, $c=-\dfrac23$ ($1=a+b+c\le(c+2)+(c+1)+c=3c+3$) | In "giá tị" (giá trị); không nói $a,b,c$ là số gì — hiểu số thực/hữu tỉ |
| Bài 8 | $x=14$, $M$ nhỏ nhất $=-28$ ($M=-1+\dfrac{27}{x-15}$) | Đề rõ ($x\ne15$) |
| Bài 9 | $B=50$ (mẫu: $\dfrac1{a.(100-a)}=\dfrac1{100}.\left(\dfrac1a+\dfrac1{100-a}\right)$ ⇒ mẫu $=\dfrac{2}{100}.$tử) | `1.99` là $1.99$ = tích $1$ nhân $99$ (dấu chấm nhân), không phải số thập phân |
