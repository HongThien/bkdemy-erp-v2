# DTD-GKI-2026 — phần 3 — lượt giải MÙ của trạm soát (Pha 1, trước khi mở bản soạn)

Nguồn: `<LV>\trang\p-3.png` + phóng to 220 dpi (`z\p3_s3a.png`, `z\p3_s3b.png`). Máy kiểm: `<LV>\tam\soat_p3.mjs` (thay 8 bộ số hữu tỉ ngẫu nhiên, phân số BigInt — mọi dòng OK).
Phạm vi DTD: CHỈ Chương I — không hằng đẳng thức, không phân tích nhân tử (trừ đặt thừa số chung).

| Nhãn | Đáp án / đáp số / hướng (1 dòng) | Ghi chú về đề |
|---|---|---|
| Bài 20a | $(x+3)(x^2+3x-5)=x^3+6x^2+4x-15$ — nhân đa × đa | Ảnh rõ |
| Bài 20b | $(x^2-1)(x^2+2x)=x^4+2x^3-x^2-2x$ — nhân đa × đa (không dùng gì thêm) | Ảnh rõ |
| Bài 20c | $(2x-1)(3x+2)(3-x)=-6x^3+17x^2+5x-6$ — nhân hai thừa số đầu ($6x^2+x-2$) rồi nhân tiếp | Ảnh rõ |
| Bài 21a | $A=4x^2-xy+2$ — chia đa thức cho đơn thức | Ảnh rõ |
| Bài 21b | $B=\dfrac{4}{3}x^2-\dfrac{2}{3}xy+\dfrac{8}{9}$ | Ảnh rõ |
| Bài 22a | $x^2+4xy^2-3y^3$ (= $-3y^3+4xy^2+x^2$) | Ảnh rõ |
| Bài 22b | Đặt khối $t=y-x$: $(x-y)^5=-(y-x)^5$, $(x-y)^4=(y-x)^4$ (luỹ thừa bậc lẻ/chẵn của số đối — lớp 7) ⇒ $[-15t^5-10t^4-20t^3]:5t^3=-3(y-x)^2-2(y-x)-4$ (khai triển: $-3x^2+6xy-3y^2+2x-2y-4$, muốn khai triển phải viết $(y-x)(y-x)$ rồi nhân — KHÔNG hằng đẳng thức). Điều kiện $x\ne y$ | Ảnh rõ. Phạm vi: $5(y-x)^3$ không phải đơn thức theo $x,y$ — phải coi $y-x$ là một khối (chia như đơn thức một "biến" khối); không được phân tích nhân tử / hằng đẳng thức |
| Bài 23 (B) | $B=1-2x$ (với $x\ne\dfrac12$) ⇒ tại $x=501$: $B=-1001$ (hoặc thay số trước: $(-1001)^3:(-1001)^2=-1001$). Đáp số 5 kí tự ⇒ `tu_luan` | Ảnh rõ |
| Bài 23 (D) | Cơ số $-x-y+z$ và $-y+z-x$ là cùng một biểu thức ⇒ $D=-x-y+z=-3-3+1=-5$ (cơ số $=-5\ne0$) ⇒ TLN `-5` | Ảnh rõ |
| Bài 24a | $A=7x^3-4x^2+10x$; tại $x=2$: $A=60$ | Ảnh rõ. Đề hỏi rút gọn rồi tính giá trị — đáp số cuối là một số |
| Bài 24b | $C=6x$ (các hạng tử $x^3$, $x^2$ triệt tiêu); tại $x=-4$: $C=-24$ | Ảnh rõ |
| Bài 25a | $M=-2xy+4-6y^2$; tại $x=\dfrac12,\ y=4$: $M=-96$ | Ảnh rõ ("$y=4$" rồi "b)" liền nhau trên ảnh — không ảnh hưởng) |
| Bài 25b | $N=\dfrac{1}{6}y^3-\dfrac{1}{3}x^3$; tại $x=-3,\ y=3$: $N=\dfrac{9}{2}+9=\dfrac{27}{2}=13{,}5$ ⇒ TLN `13,5` | Ảnh rõ |
