# TM-GKI-2024 · P8 (Dạng 5, Bài 26–29) — Pha 1 giải MÙ (trạm soát, Opus)

Đề đọc từ `t-5.png` + phóng to 260 dpi (`z/p8_b2627.png`, `z/p8_b2829.png`). Kiểm bằng máy: `<LV>\tam\kiem_p8.mjs` (quét 400 000 bộ ngẫu nhiên B26, 200 000 bộ B27/B28, lưới rời rạc + liên tục B29).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 26 | GTNN $P=9$ tại $x=y=z=\sqrt3$ (từ $P-(xy+yz+zx)=\frac12[(x-y)^2+(y-z)^2+(z-x)^2]\ge0$); GTLN $P=18$ tại $(4;1;1)$ và hoán vị (từ $(x-1)(y-1)\ge0$… cộng lại ⇒ $x+y+z\le6$, $P=(x+y+z)^2-18\le18$). Máy: min 9,00003, max 17,948 → khớp; vi phạm $s\le6$: 0. `tu_luan` | Đề rõ. GTNN tại $\sqrt3$ — chỉ cần căn bậc hai số học lớp 7 ($x^2=3$, $x\ge1$). |
| Bài 27 | Đặt $p=xy$, $0<p\le1$ (vì $(x-y)^2\ge0$); $x^2+y^2=4-2p$; $2-p^2(4-2p)=2(p^3-2p^2+1)=2(p-1)(p^2-p-1)\ge0$ vì $p-1\le0$, $p^2-p-1=p(p-1)-1<0$. Dấu "=" khi $x=y=1$. Máy: 0 vi phạm, max 2. `tu_luan` | Đề rõ. |
| Bài 28 | $MN=x$, $AM=h$, $x^2h=4$; $S=x^2+4xh=x^2+\frac{16}{x}$; $S-12=\frac{(x-2)^2(x+4)}{x}\ge0$ ⇒ $S_{\min}=12\ \text{dm}^2$ khi $x=2$, $h=1$. Đáp: $MN=2$ dm, $AM=1$ dm. `tu_luan` | Đề không in hình (ghi chú khung giữ). |
| Bài 29 | Gọi $x$ (triệu đồng) là số tiền giảm mỗi chiếc, $0\le x<4$: số máy $500+250x$; lợi nhuận $(4-x)(500+250x)=250[9-(x-1)^2]\le2250$; max khi $x=1$ ⇒ giá bán $21$ triệu đồng (lợi nhuận 2 250 triệu đồng, bán 750 chiếc). Rời rạc theo bước 200 nghìn: cũng $k=5$ bước → 21. `tra_loi_ngan`, `dap_an=21` | "lợi nhận" = lợi nhuận (in lỗi chính tả, không ảnh hưởng). Mô hình tuyến tính (giảm $x$ triệu ⇒ tăng $250x$ chiếc) là cách hiểu chuẩn; theo bước rời rạc vẫn ra cùng đáp số. |
