# NTL-GKI-2026 · p21 — Pha 1 giải MÙ (trạm SOÁT, Opus, 27/10)

Nguồn: `<LV>\anh\t-13.png` (Bài 3, 4.1) · `t-14.png` (hình 4.1, 4.2, Bài 5) · phóng to 260 dpi `z\soat_p21_*`. Máy kiểm: `<LV>\tam\soat_p21_kiem.mjs` (BigInt đồng nhất thức 20 bộ số; 4.2c dựng toạ độ + chia đôi tìm cấu hình $ND\perp BC$).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề |
|---|---|---|
| Đề 3 Bài 3a | $10x^2(x+y)-15x(x+y)=5x(x+y)(2x-3)$ (máy ✓) | — |
| Đề 3 Bài 3b | $x^2-2x+2y-y^2=(x-y)(x+y)-2(x-y)=(x-y)(x+y-2)$ (máy ✓) | — |
| Đề 3 Bài 3c | $5(x-y)^2-3(x-y)=(x-y)(5x-5y-3)$ (máy ✓) | — |
| Đề 3 Bài 4a (4.1) | $S=\dfrac{(4x+6x)\cdot 30}{2}=150x=1500\Rightarrow x=10$; $DC=60$, HCN $EFCD$ $=60\cdot 30=1800$; mua thêm $1800-1500=300\ \text{m}^2$ (hai tam giác vuông, mỗi cái $\dfrac{10\cdot 30}{2}=150$) | Hình: HTC $ABCD$, $AB=4x$, $DC=6x$, cao $AH=30$; HCN $EFCD$ bao ngoài |
| Đề 3 Bài 4b (4.2) | a) $M$ trung điểm $BC$ và $AD$ ⇒ $ACDB$ HBH (hai đường chéo cắt nhau tại trung điểm mỗi đường). b) $AE\parallel DF$ (vì $AC\parallel BD$), $AE=DF$ ⇒ $AEDF$ HBH ⇒ $AF=ED$; đường chéo $EF$ đi qua trung điểm $M$ của $AD$, $M\in BC$ ⇒ $AD,BC,EF$ đồng quy tại $M$. c) $EQ=AE=FD$, $EQ\parallel FD$ ⇒ $EQDF$ HBH ⇒ $DQ\parallel EF$; $ND\perp BC$ ⇒ $EF\perp BC$ tại $M$, $M$ trung điểm $EF$ ⇒ $BC$ là trung trực $EF$ ⇒ $BE=BF$ ⇒ $\widehat{BEF}=\widehat{BFE}$; $EF\parallel ND$ ⇒ (đồng vị) $\widehat{BND}=\widehat{BDN}$ ⇒ $BN=BD$ ⇒ $EN=FD$; $ENDF$ là hình thang ($EF\parallel ND$) có $\widehat{NEF}=\widehat{DFE}$ (bù hai góc bằng nhau) ⇒ HTC ⇒ $FN=ED=AF$ ⇒ $\triangle AFN$ cân tại $F$. Máy: 6 cấu hình ngẫu nhiên có $ND\perp BC$ đều $FA=FN$ (khác $AN$) | Không dùng HCN/thoi/vuông, không đường trung bình. "DQ cắt BE" hiểu là hai ĐƯỜNG THẲNG ($N$ nằm trên tia $BE$ quá $E$). Ngoài lề: $AN\parallel BC$ luôn đúng (không cần) |
| Đề 3 Bài 5a | Bình phương rồi cộng: $(a^3-3ab^2)^2+(b^3-3a^2b)^2=(a^2+b^2)^3$ (máy ✓) $=100+900=1000\Rightarrow a^2+b^2=10\Rightarrow P=2024\cdot 1^{2025}=2024$. Tồn tại $a,b$ thực ($a\approx 2{,}892$; $b\approx -1{,}279$) | `tra_loi_ngan` 2024 |
| Đề 3 Bài 5b | Rộng $w$, dài $w+2$, cao $2w-4$ ($w>2$); $w(w+2)(2w-4)=210\Rightarrow w^3-4w-105=0\Rightarrow(w-5)(w^2+5w+21)=0$ (máy ✓), $w^2+5w+21>0$ ⇒ $w=5$: dài 7 in, rộng 5 in, cao 6 in | Đề tiếng Anh: đề giữ nguyên, giải tiếng Việt; đáp nhiều số ⇒ `tu_luan`. Không gọi "phương trình" (nhẩm nghiệm $w=5$ ⇒ đặt nhân tử $w-5$, Bézout được dùng ở NTL) |
