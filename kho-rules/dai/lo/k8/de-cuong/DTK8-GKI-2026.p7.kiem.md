# DTK8-GKI-2026 — Phần 7 — Pha 1 giải MÙ (trạm soát, Opus)

Nguồn: `<LV>\anh\t-5.png` (trang 34) + phóng to 260 dpi `z\soat_p7_b26_29-5.png`. Máy kiểm: `<LV>\tam\soat_p7_kiem.mjs` (vét cạn + BigInt 50 bộ ngẫu nhiên).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề |
|---|---|---|
| Bài 26 | $196;\ 803;\ 914$. $3a+5b=8c\Leftrightarrow 3(a-c)=5(c-b)$ ⇒ $a-c$ chia hết cho 5, $a\ne c$ ⇒ $a-c=\pm5$ ⇒ $c-b=\pm3$; $a-c=5,c-b=3$: $c\in\{3;4\}$ ⇒ 803, 914; $a-c=-5,c-b=-3$: $c=6$ ⇒ 196. Vét cạn máy: 12 số thoả (kể cả 111, 222, …, 999), bỏ 9 số ba chữ số giống nhau ⇒ còn 3 | Đề rõ. `tu_luan` (ba giá trị) |
| Bài 27 | $P(5)-P(0)=30$. $P(2)=0\Rightarrow 4a+2b+c=-8$; $P(3)=0\Rightarrow 9a+3b+c=-27$; trừ ⇒ $5a+b=-19$; $P(5)-P(0)=125+25a+5b=125+5(5a+b)=125-95=30$. Máy: 20 bộ ngẫu nhiên đều ra 30 | Đề rõ ("P(3) = 0" xuống dòng). TLN `30` |
| Bài 28 | Chứng minh: $4p(p-a)=2p(2p-2a)=(a+b+c)(b+c-a)$, nhân trực tiếp ra $b^2+c^2+2bc-a^2$ = VT. Máy BigInt 50 bộ: đúng | Đề rõ. `tu_luan` |
| Bài 29 | $M=N=P=abc$: $a+b=-c$, $a+c=-b$, $b+c=-a$ ⇒ $M=a(-c)(-b)=abc$, $N=b(-a)(-c)=abc$, $P=c(-b)(-a)=abc$. Máy BigInt 50 bộ: đúng | Đề rõ. `tu_luan` |
