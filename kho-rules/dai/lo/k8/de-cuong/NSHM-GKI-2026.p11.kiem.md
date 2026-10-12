# NSHM-GKI-2026 — Phần 11 (Bài 23–27) — Pha 1 giải MÙ (trạm soát, Opus, 12/10)

> Giải trước khi mở `NSHM-GKI-2026.p11.soan.md`. Nguồn: ảnh `anh/5.webp` (phóng to vùng Bài 23–27 ×2,5 và ×6).
> Máy: `<LV>\tam\kiem_p11_soat.mjs` (BigInt; Bài 23 vét $m\le 3000$ + kiểm thẳng tổng gốc $n\le 2100$; Bài 24, 25 vét $|n|,|k|\le 10^5$;
> Bài 26 vét $x\le 300,\ y\le 200$; Bài 27 vét $|a|,|b|,|c|\le 40$).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 23 | $n\in\{2011;\ 2017\}$. Tổng $=2^{2008}(113+2^m)$, $m=n-2008\ge1$ ⇒ cần $113+2^m=s^2$. $m$ chẵn ($m=2k$): $(s-2^k)(s+2^k)=113$ nguyên tố ⇒ $2^{k+1}=112$ vô lí. $m$ lẻ: thử $m=3$ ($121=11^2$), $m=9$ ($625=25^2$); **loại hết $m$ lẻ còn lại thì không có chứng minh sơ cấp** (phương trình dạng $s^2-2t^2=113$, cần số học vành $\mathbb{Z}[\sqrt2]$) — máy vét $m\le3000$ chỉ có $m=3,\ 9$. | Đọc ảnh ×6: số mũ là $2008,\ 2012,\ 2013,\ 2014$ (chữ "3", không phải "5"). Nếu là $2^{2015}$ thì đáp số duy nhất $n=2012$ — chỉ ghi nhận, ảnh đọc rõ 2013. Bài không chứng minh trọn được trong phạm vi lớp 8 ⇒ phải có `Chưa chắc`. |
| Bài 24 | $n\in\{-3;\ 2\}$ ($A=49$). $A-(n^2+n)^2=n^2+n+7>0$; $(n^2+n+1)^2-A=(n+3)(n-2)$ ⇒ với $n>2$ hoặc $n<-3$ thì $A$ kẹp nghiêm ngặt giữa hai bình phương liên tiếp ($n^2+n\ge0$); xét $n\in\{-3,\dots,2\}$: chỉ $n=-3,\ 2$. | — |
| Bài 25 | $k\in\{1;\ 3\}$ ($B=0$; $B=4$). $B=(k^2-4k+3)^2+(k-1)^2=(k-1)^2\left[(k-3)^2+1\right]$; $k\ne1$ ⇒ cần $(k-3)^2+1$ chính phương ⇒ $(k-3)=0$. | Số chính phương gồm $0$ ⇒ $k=1$ được nhận. |
| Bài 26 | $(x;y)=(1;1)$ (giá trị $9$). $x\ge2$: $2^x+5^y+2\equiv 0+1+2=3\pmod 4$ ⇒ loại. $x=1$: $5^y=(s-2)(s+2)$ ⇒ $s-2=5^a,\ s+2=5^b$, $5^b-5^a=4$ ⇒ $a=0,\ b=1$ ⇒ $y=1$. | — |
| Bài 27 | Không tồn tại. Ba số $X=ab^2c,\ Y=bc^2a,\ Z=ca^2b$ mỗi số $=$ (chính phương) $-2\equiv 2$ hoặc $3\pmod 4$; $XYZ=(abc)^4$. $abc$ lẻ ⇒ $X,Y,Z\equiv3$ ⇒ tích $\equiv3\pmod4$, mà luỹ thừa 4 lẻ $\equiv1$. $abc$ chẵn ⇒ $16\mid XYZ$ nhưng mỗi thừa số chẵn chỉ $\equiv2\pmod4$ (một thừa số $2$), tối đa $2^3$ ⇒ vô lí. ($abc=0$ ⇒ $X=0$, $0+2=2$ không chính phương — nằm trong lập luận.) | — |
