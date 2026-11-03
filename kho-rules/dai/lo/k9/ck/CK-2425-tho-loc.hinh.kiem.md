# Giải MÙ — CK-2425-tho-loc · phần Hình (trạm soát, Pha 1)

Nguồn: ảnh `trang\p-5.png` … `p-7.png` (B. Hình học, Dạng 1–5, Bài 1–11). Tính bằng máy: `<LV>\tam\soat_kiem.mjs` (Bài 6–8: 2000 tam giác nhọn ngẫu nhiên; Bài 9, 11: 1000 cấu hình ngẫu nhiên; 0 lệch).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| P1 Bài 1a | $A=\sin23^\circ-\cos67^\circ=0$ (hai góc phụ nhau: $\cos67^\circ=\sin23^\circ$) | — |
| P1 Bài 1b | $B=\tan18^\circ-\cot72^\circ=0$ ($\cot72^\circ=\tan18^\circ$) | — |
| P1 Bài 1c | $C=\dfrac{\frac{\sqrt3}{2}\cdot\frac{\sqrt3}{2}}{2\cdot1}=\dfrac38$ | — |
| P1 Bài 1d | $D=\cot44^\circ\cdot\cot45^\circ\cdot\cot46^\circ=1$ ($\cot46^\circ=\tan44^\circ$, $\tan\cdot\cot=1$, $\cot45^\circ=1$) | — |
| P1 Bài 1e | $E=0$ ($\cos50^\circ=\sin40^\circ$, $\cos80^\circ=\sin10^\circ$) | — |
| P1 Bài 1f | $F=12-8=4$ ($\tan58^\circ=\cot32^\circ$, $\cot35^\circ=\tan55^\circ$) | — |
| P1 Bài 2 | Kẻ $AH\perp BC$: $AH=4\sin40^\circ\approx2{,}571$, $BH=4\cos40^\circ\approx3{,}064$, $HC\approx1{,}436$ ⇒ $AC\approx2{,}9$ cm; $\tan C=\dfrac{AH}{HC}$ ⇒ $\widehat C\approx61^\circ$ ($60{,}82^\circ$) | Đề không nêu làm tròn ⇒ mặc định; viết "$B=40^\circ$" (ý là $\widehat B$). Tam giác thường ⇒ kẻ đường cao, không định lí côsin |
| P1 Bài 3 | a) $\widehat B=60^\circ$, $BC=18$ cm, $AC=9\sqrt3\approx15{,}6$ cm · b) $AH=\dfrac{9\sqrt3}{2}\approx7{,}8$ cm, $CH=13{,}5$ cm · c) $\widehat{ADB}=75^\circ$ ⇒ $AD=\dfrac{AH}{\sin75^\circ}\approx8{,}07$ cm (đúng: $\dfrac{9\sqrt6}{1+\sqrt3}$) | Ý c đề in "phân giác của $BAC$" (thiếu mũ góc) — ý là $\widehat{BAC}$ |
| P1 Bài 4 | Chiều cao tháp $=13{,}65\cdot\tan58^\circ+1{,}55\approx23{,}39$ m | **Chữ đề in "3,65m", hình kèm đề ghi "13,65 m"** (phóng to 260 dpi `z\soat_b4_chu.png`, `z\soat_b4_hinh.png`: cả hai đọc rõ, không mờ). Nhân chứng độc lập: đề cương THCS Thăng Long 2024–2025 (`CK-2425-thang-long`, lớp chữ PDF) in đúng đề này, cùng câu chữ, với "13,65 m". ⇒ chữ đề Thọ Lộc mất chữ số 1 (lỗi in hiển nhiên), lấy $13{,}65$ m. (Nếu theo chữ in $3{,}65$ m thì $\approx7{,}39$ m.) |
| P1 Bài 5 | $h=x\tan30^\circ=(80-x)\tan60^\circ$ ⇒ $x=60$ ⇒ $h=20\sqrt3\approx34{,}64$ m; $M$ cách trụ có góc nâng $30^\circ$ là $60$ m, cách trụ có góc nâng $60^\circ$ là $20$ m | — |
| P1 Bài 6 | Kẻ đường cao $AH$: $AH=AB\sin B$ (tam giác vuông $ABH$) ⇒ $S=\dfrac12BC\cdot AH=\dfrac12BA\cdot BC\sin B$; tương tự hai đẳng thức còn lại (đường cao từ $B$, từ $C$) | Tam giác nhọn ⇒ chân đường cao nằm trong cạnh |
| P1 Bài 7 | $\triangle ABN$ vuông tại $N$: $AN=AB\cos A$; $\triangle BCL$ vuông tại $L$: $BL=BC\cos B$; $\triangle CAM$ vuông tại $M$: $CM=CA\cos C$ ⇒ nhân vế | — |
| P1 Bài 8 | a) kẻ $AH\perp BC$: $AH=AB\sin B=AC\sin C$ · b) $BC=BH+HC=AB\cos B+AC\cos C$ ($H$ nằm giữa $B$, $C$ vì tam giác nhọn) | — |
| P1 Bài 9 | a) $I$ trung điểm $AO$, $IB=IA=IO$ ⇒ $\widehat{ABO}=90^\circ$ (không góc nội tiếp) ⇒ $AB\perp OB$ tại $B\in(O)$ ⇒ tiếp tuyến; tương tự $AC$ · b) $AB=AC$ (tính chất hai tiếp tuyến cắt nhau, hoặc Pythagore) · c) $AO$ là tia phân giác của $\widehat{BAC}$ và $\widehat{BOC}$ | Ý c đề in mũ cung kiểu $\widehat{}$ — ý là góc |
| P1 Bài 10 | a) $\widehat{EMI}=30^\circ$, $\widehat{EIF}=120^\circ$ ($\widehat{EIM}=60^\circ$, $IM$ phân giác) · b) $MI=\dfrac{IE}{\sin30^\circ}=12$ cm | — |
| P1 Bài 11 | a) $OA=OB$, $PA=PB$ ⇒ $OP$ trung trực $AB$ ⇒ $OP\perp AB$ · b) $PA=PB=\sqrt{4^2-2^2}=2\sqrt3\approx3{,}5$ cm · c) $OA=OB=OD$ ⇒ $\widehat{BAD}=90^\circ$ ⇒ $AD\perp AB$, mà $PO\perp AB$ ⇒ $AD\parallel PO$ · d) $OK\parallel PB$ (cùng $\perp OB$) ⇒ $\widehat{KOP}=\widehat{OPB}=\widehat{OPA}$ ⇒ $\triangle KOP$ cân tại $K$ ⇒ $KO=KP$ | Với $R=2$, $PO=4$: $K$ ở $\tfrac13$ đoạn $AP$ tính từ $A$, $KO=KP\approx2{,}31$ (máy) |

**So với CK-2526-tho-loc:** cùng một đề cương (xem biên bản soát).
