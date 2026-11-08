# pnl-b1-p1 — Pha 1 giải MÙ (chỉ từ `xem-de.mjs`, chưa mở JSON / nguồn)

Tính số bằng node (n = 1e5; mũ n = 200; truy hồi lặp 60–80 bước; D4BT2f tính dạng đã liên hợp ở n = 30).

| id | đáp số của tôi | ghi chú đề |
|---|---|---|
| D1BT1a | $-2$ |  |
| D1BT1b | $4$ |  |
| D1BT1c | $0$ |  |
| D1BT1d | $\frac12$ |  |
| D1BT1e | $0$ |  |
| D1BT1f | $0$ |  |
| D1BT1g | $0$ |  |
| D1BT1h | $0$ |  |
| D1BT1i | $0$ |  |
| D1BT1j | $0$ |  |
| D1BT1k | $0$ |  |
| D1BT1l | $0$ (mẫu cỡ $14^n$) |  |
| D1BT2a | $2$ (chứng minh) |  |
| D1BT2b | $6$ (chứng minh) |  |
| D1BT2c | $-2$ (chứng minh) |  |
| D1BT2d | $1$ (chứng minh) |  |
| D1BT2e | $3$ (chứng minh; $\vert\sin 3n\vert/3^n\le 3^{-n}$) |  |
| D1BT2f | $\frac12$ (chứng minh, liên hợp) |  |
| D2BT1a | $-2$ |  |
| D2BT1b | $+\infty$ |  |
| D2BT1c | $0$ |  |
| D2BT1d | $1$ |  |
| D2BT1e | $-2$ |  |
| D2BT1f | $5$ |  |
| D2BT2a | $-\frac32$ |  |
| D2BT2b | $0$ |  |
| D2BT2c | $2025$ |  |
| D2BT3 | mọi $b\in\mathbb R$ (giới hạn luôn $\frac25$) | câu hỏi "b nhận giá trị nào" — đáp: mọi b |
| D2BT4 | $a=2$ |  |
| D3BT1a | $+\infty$ |  |
| D3BT1b | $-\infty$ |  |
| D3BT1c | $\frac13$ |  |
| D3BT1d | $0$ |  |
| D3BT1e | $-\infty$ |  |
| D3BT1f | $0$ |  |
| D3BT1g | $\frac14$ |  |
| D3BT1h | $\frac9{10}$ |  |
| D3BT1i | $-10$ |  |
| D3BT1j | $0$ |  |
| D3BT1k | $0$ ($\vert 32/243\vert^n\to0$) |  |
| D3BT2a | $0$ ($v_n=\frac{u_n+1}{u_n+4}$ là CSN công bội $\frac25$, $v_1=\frac25$) |  |
| D3BT2b | $1$ ($u_n-1$ là CSN công bội $\frac12$) |  |
| D3BT3 | $3$ ($a=1;6;13$) |  |
| D4BT1a | $0$ |  |
| D4BT1b | $-\frac12$ |  |
| D4BT1c | $\frac13$ |  |
| D4BT1d | $\frac12$ |  |
| D4BT1e | $2$ |  |
| D4BT1f | $\sqrt2$ |  |
| D4BT1g | $2$ |  |
| D4BT1h | $0$ |  |
| D4BT2a | $0$ |  |
| D4BT2b | $\frac14$ |  |
| D4BT2c | $\sqrt3-1$ |  |
| D4BT2d | $-\frac34$ |  |
| D4BT2e | $\frac43$ |  |
| D4BT2f | $0$ (tử $\sim\frac1{3n^4}$, mẫu $\sim\frac1{2n^2}$) |  |
| D5BT1 | $\frac23$ |  |
| D5BT2 | $\frac7{33}$ |  |
| D5BT3 | $10$ |  |
| D5BT4 | $E=\frac{ST}{S+T-1}$ |  |
| D5BT5 | $2$ |  |
| TN01 | B |  |
| TN02 | C |  |
| TN03 | A |  |
| TN04 | C |  |
| TN05 | B |  |
| TN06 | D |  |
| TN07 | A |  |
| TN08 | D ($L=0$ với mọi $a$: bậc tử 5 hoặc 2, bậc mẫu 6) | ĐỀ IN LỖI nghi: nếu mẫu là $(2n-1)(n^2+3)^2$ thì $L=\frac{a^3}2$ ⇒ $a=1$ (B) |
| TN09 | A |  |
| TN10 | B |  |
| TN11 | B |  |
| TN12 | B |  |
| TN13 | D |  |
| TN14 | A |  |
| TN15 | A |  |
| TN16 | D |  |
| TN17 | D |  |
| TN18 | D ($\frac25$, $T=-11$) |  |
| TN19 | B ($a=-\frac14$) |  |
| TN20 | C ($a=2$) |  |
| TN21 | A |  |
| TN22 | D |  |
| TN23 | A |  |
| TN24 | B |  |
| TN25 | C |  |
| TN26 | D |  |
| TN27 | D |  |
| TN28 | D ($a=1,b=3$) |  |
| TN29 | B |  |
| TN30 | D ($a=4,b=8,c=2$) |  |
| TN31 | A |  |
| TN32 | A |  |
| TN33 | A |  |
| TN34 | B |  |
| TN35 | A |  |
| TN36 | B |  |
| TN37 | D |  |
| TN38 | A |  |
| TN39 | C |  |
| TN40 | B ($a=\pm2$) |  |
| TN41 | C |  |
| TN42 | A |  |
| TN43 | B |  |
| TN44 | B |  |
| TN45 | B |  |
| TN46 | C |  |
| TN47 | C |  |
| TN48 | D |  |
