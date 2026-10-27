# NTL-GKI-2026 — phần 23 (Đề số 04, B. Tự luận Bài 2–5) — Pha 1 giải MÙ (trạm soát)

Nguồn: `<LV>\anh\t-15.png` (trang 15) + phóng to 260 dpi `<LV>\z\soat_p23_bai23-15.png`, `soat_p23_bai5-15.png`. Kiểm máy: `<LV>\tam\soat_p23_kiem.mjs` (đồng nhất thức trên bộ số ngẫu nhiên, quét đổi dấu, vét cạn BigInt $|x|,|y|\le 2000$, toạ độ số 6 hình bình hành ngẫu nhiên — cả E trong lẫn ngoài đoạn AD). Chưa mở bản soạn khi viết bảng này.

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề |
|---|---|---|
| Đề 4 Bài 2a | $(x+y)^2-4=(x+y-2)(x+y+2)$ | — |
| Đề 4 Bài 2b | $(3x-5)(3x+5)-(2x+7)(3x-5)=(3x-5)(x-2)$ | — |
| Đề 4 Bài 2c | tách $-16x=-15x-x$: $(x-5)(3x-1)$ | — |
| Đề 4 Bài 3a | $x^2+4x-x^2-5x-6=5\Rightarrow -x=11\Rightarrow x=-11$ (TLN $-11$) | — |
| Đề 4 Bài 3b | $(x-3)(x^4-16)=(x-3)(x-2)(x+2)(x^2+4)=0\Rightarrow x\in\{3;2;-2\}$ ($x^2+4>0$) | — |
| Đề 4 Bài 3c | $27x^3+1-27x^3-3x=17\Rightarrow x=-\dfrac{16}{3}$ | — |
| Đề 4 Bài 4 | a) $AN\parallel MC$, $AM\parallel NC$ ⇒ HBH (định nghĩa). b) $AN=MC=\tfrac12 DC=\tfrac12 AB$ ⇒ N trung điểm AB; $DM\parallel NB$, $DM=NB$ ⇒ $DMBN$ HBH ⇒ $DN=BM$. c) $ANMD$, $NBCM$ HBH ⇒ I trung điểm AM, DN; K trung điểm BM, NC; $IM\parallel NK$, $IM=NK$ ⇒ $IMKN$ HBH; O trung điểm AC ⇒ O trung điểm MN (đường chéo HBH $AMCN$) ⇒ O trung điểm IK ⇒ thẳng hàng. d) $MB=ME$ (máy: đúng với mọi HBH): $MN\parallel AD$ ($ANMD$ HBH) ⇒ $MN\perp BE$ tại H; chứng minh H trung điểm BE bằng HBH + g.c.g (KHÔNG đường trung bình, KHÔNG trung tuyến ứng cạnh huyền — NTL chỉ tới HBH) ⇒ MH trung trực BE ⇒ $\triangle MBE$ cân tại M. Cách khác: $EM$ cắt $BC$ tại F, $\triangle MDE=\triangle MCF$ ⇒ M trung điểm EF, rồi tự chứng minh trung tuyến ứng cạnh huyền qua HBH + c.g.c | Bài có dữ kiện kiểu đường trung bình (M, N trung điểm) — cấm ĐTB; ý d) cân tại **M** ($MB=ME$), E có thể nằm ngoài đoạn AD |
| Đề 4 Bài 5 | $6x^2y^2+x^2+y^2-8xy=(x-y)^2+6xy(xy-1)=0$ ⇒ $(x-y)^2=6xy(1-xy)\ge0$ ⇒ $xy\in\{0;1\}$ ⇒ $(x;y)\in\{(0;0),(1;1),(-1;-1)\}$; vét cạn $|x|,|y|\le2000$ ra đúng 3 cặp | — |
