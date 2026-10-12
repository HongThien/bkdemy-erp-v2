# NSHM-GKI-2026 · Phần 12 (Bài 28–32) — lượt giải MÙ của trạm soát (Opus, 12/10)

> Giải trước khi mở bản soạn. Máy: `<LV>\tam\soat_mu_p12.mjs` (BigInt). Đề đối chiếu ảnh `5.webp` (phóng to `z/soat_p12_a.png`).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 28 | **Không có.** Giả sử $x<y$, $xy+x=a^2$, $xy+y=b^2$ ($a,b\in\mathbb{N}^*$) ⇒ $a<b$ ⇒ $b\ge a+1$ ⇒ $y-x=b^2-a^2\ge 2a+1$; $a^2=x(y+1)>x^2$ ⇒ $a>x$ ⇒ $y-x>2x+1$ ⇒ $y>3x+1\ge 3\cdot 999+1>1994$, mâu thuẫn. Máy: 0 cặp trong $999\dots1993$ | Khoảng mở $(998;1994)$ ⇒ $999\le x,y\le 1993$. "khác nhau" của hai số chính phương là tự động khi $x\ne y$. Đề rõ. |
| Bài 29 | $4i(i+1)(i+2)=i(i+1)(i+2)(i+3)-(i-1)i(i+1)(i+2)$ ⇒ cộng sai phân $4B=k(k+1)(k+2)(k+3)$ ⇒ $4B+1=(k^2+3k)(k^2+3k+2)+1=(k^2+3k+1)^2$. Máy: đúng $k=1\dots3000$ | "$k$ là số tự nhiên": $k=0$ thì tổng rỗng, $B=0$, $4B+1=1=1^2$ vẫn đúng; thực chất cần $k\ge1$. Không ảnh hưởng. |
| Bài 30 | $n^2-1=3m(m+1)$ ⇒ $4n^2-1=3(2m+1)^2$ ⇒ $(2n-1)(2n+1)=3(2m+1)^2$, hai thừa số lẻ liên tiếp nguyên tố cùng nhau ⇒ một số $=3p^2$, số kia $=q^2$ (bổ đề: tích hai số nguyên tố cùng nhau là số chính phương thì mỗi số là số chính phương — chứng minh bằng phân tích ra thừa số nguyên tố, lớp 6). $2n-1=3p^2,\ 2n+1=q^2$ loại vì $q^2\equiv 2\pmod 3$ ⇒ $2n-1=q^2$, $q=2a+1$ ⇒ $n=2a^2+2a+1=a^2+(a+1)^2$. Máy: $n=1,13,181,2521,35113,489061$ đều đúng | $n=1$: $\dfrac{0}{3}=0=0\cdot1$ ⇒ $1=0^2+1^2$ — cần coi $0$ là số chính phương / số tự nhiên. Đề rõ. |
| Bài 31 | $A=(n^2+1)(n+1)^2$; với $n\ge1$: $n^2<n^2+1<(n+1)^2$ ⇒ $n^2+1$ không chính phương ⇒ $A$ không chính phương. Hoặc kẹp: $(n^2+n)^2<A=(n^2+n)^2+(n+1)^2<(n^2+n+1)^2=A+n^2$. Máy: kẹp đúng $n=1\dots10^5$; chỉ $n=0$ cho $A$ chính phương | Đề "$n>1$" — thật ra đúng cả $n=1$ ($A=8$). Không lỗi. |
| Bài 32 | $A=n^2(n+1)^2(n^2-2n+2)$; $n>1$ ⇒ $(n-1)^2<(n-1)^2+1=n^2-2n+2<n^2$ ⇒ thừa số không chính phương ⇒ $A$ không chính phương (bổ đề: $k\ne0$, $k^2m$ chính phương ⇒ $m$ chính phương — số mũ mỗi thừa số nguyên tố). Máy: phân tích đúng $n=0\dots10^5$; $A$ chính phương chỉ ở $n=0,1$ | $n=1$: $A=4$ là số chính phương ⇒ điều kiện $n>1$ là cần. Đề rõ. |
