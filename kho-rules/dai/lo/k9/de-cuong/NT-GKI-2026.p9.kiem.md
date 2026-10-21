# NT-GKI-2026 · phần 9 — giải MÙ của trạm soát (Pha 1)

Máy: `<LV>\tam\kiem_p9_soat.mjs` (lượng giác bằng `Math`, Bài 3.2c dựng toạ độ $A(0;0)$, $B(0;6)$, $C(8;0)$ quét 1000 vị trí $M$ trên $AC$; Bài 5 quét 2 triệu điểm trên đường cong).

| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |
|---|---|---|
| Bài 3.1 | Góc hạ $=\widehat{ABC}$ (so le trong với tia ngang), $\tan\widehat{ABC}=\dfrac{150}{285}$ ⇒ $\approx27{,}76^\circ\approx28^\circ$; sau: $\triangle$ vuông có $\widehat{B'}=46^\circ$, cạnh kề $285$ m ⇒ độ cao $=285\cdot\tan46^\circ\approx295{,}13\approx295$ m. `tu_luan` (hai đại lượng). | Đề không nêu làm tròn góc hạ (mặc định đến độ). Hiểu: khí cầu bay thẳng đứng ⇒ hình chiếu $C$ không đổi, $CB=285$ m. |
| Bài 3.2 | a) $AC=8$ cm (Pythagore), $\sin C=\dfrac{6}{10}$ ⇒ $\widehat{C}\approx37^\circ$, $\widehat{B}\approx53^\circ$; b) $\triangle BIA\backsim\triangle BAC$ (g.g) ⇒ $AB^2=BI\cdot BC$, $BI=3{,}6$ cm; c) $\sin\widehat{AMB}=\dfrac{AB}{BM}$, $\cos\widehat{ABC}=\dfrac{AB}{BC}$ ⇒ VT $=\dfrac{BC}{BM}$; $\triangle BEA\backsim\triangle BAM$ ⇒ $BE\cdot BM=AB^2=BI\cdot BC$ ⇒ $\triangle BIM\backsim\triangle BEC$ (c.g.c) ⇒ $\dfrac{CE}{IM}=\dfrac{BC}{BM}$. `tu_luan`. | Máy: sai lệch hai vế ý c ≤ $10^{-15}$ với mọi $M$ trên $AC$ ($M\ne A$). Ý a đề yêu cầu làm tròn đến độ. |
| Bài 5 | $2(x^2-xy+y^2)=(x-y)^2+x^2+y^2$ ⇒ $P=18-(x-y)^2\le18$, dấu "=" khi $x=y=3$ hoặc $x=y=-3$. GTLN $=18$. `tra_loi_ngan`, `dap_an=18`. | Đề in thiếu "$x$, $y$" sau "các số thực" (người gõ đã thêm). |
