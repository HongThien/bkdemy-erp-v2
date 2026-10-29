KẾT LUẬN: ĐẠT

# TC-GKI-2026 · P5 (PHẦN 2 = B. Hình học, Bài 1–10) — biên bản trạm SOÁT (Opus, 29/10)

- Số câu: **11** (4 trả lời ngắn: Bài 1a `-1`, Bài 3 `6`, Bài 4 `2,21`, Bài 5 `2468` · 7 tự luận: Bài 1b, 2, 6, 7, 8, 9, 10). `kho=hinh_hoc` cả 11, giữ nguyên.
- Khớp Pha 1 ngay từ đầu: **11/11** (giải mù ở `TC-GKI-2026.p5.kiem.md`, máy `<LV>\tam\soat_p5.mjs`).
  - Số: 1a $-1$ · 1b $-0{,}25$ · 2: $13{,}9892$ · 3: $5{,}71^\circ$ · 4: $2{,}2068$ · 5: $2467{,}68$ (kiểm $AC-BC=500$) · 6a $AC=6$, $CK=3\sqrt3$, $\widehat{CAK}=60^\circ$; 6c $S=5{,}8518$ · 8a $AC=6$, $AB=2\sqrt3$ · 9a $\widehat B=60^\circ$, $BH=1{,}5$ · 10a $\widehat{ACB}=36^\circ52{,}2'$, $AH=4{,}8$.
  - Ý chứng minh (6b, 7, 8b–c, 9b–c, 10b–c) dựng toạ độ trên số đề VÀ trên bộ số khác: các đẳng thức đúng tới $10^{-12}$.
  - **8d (kiểm độc lập bằng toạ độ):** $\dfrac{S_{BHD}}{S_{BKC}\cos^2\widehat{ABD}}=\cos^2\widehat{ABC}$, không phụ thuộc vị trí $K$ (máy: $\widehat B=30^\circ,45^\circ,60^\circ,75^\circ$ ⇒ $0{,}75;\ 0{,}5;\ 0{,}25;\ 0{,}067$). Điều kiện $\widehat{ABC}=60^\circ$ — đề ĐÚNG, không phải "đề sai".
- Phân loại 4 câu TLN đúng: một số ≤ 4 kí tự đúng dạng đề hỏi (1a giá trị biểu thức; 3 góc làm tròn đến độ; 4 làm tròn hai chữ số thập phân; 5 làm tròn hàng đơn vị). 1b ($-0{,}25$) và 2 ($13{,}99$) 5 kí tự ⇒ tự luận — đúng.
- Đề: chép đúng ảnh `p-3.png`, `p-4.png` (Bài 5 thêm chữ "Tính" vì đề in thiếu động từ; "điều kiền" → "điều kiện" — lỗi in hiển nhiên). Không đề sai.
- Luật kiến thức: Bài 7 suy hệ thức từ tỉ số lượng giác ($\cos C$ hai cách, $\tan\widehat{ABH}=\tan\widehat{CAH}$); 8b, 9b–c, 10b từ tam giác đồng dạng (g.g / c.g.c); không dùng thẳng hệ thức đường cao; 10a tính $AH$ bằng $AC\cdot\sin C$; 10c dùng tính chất trung tuyến ứng với cạnh huyền (không đường trung bình). Bài 3 (dạng Bài 1 — tỉ số) chỉ dùng định nghĩa $\tan$. Không `⇔`, không sin/côsin tam giác thường. Đạt.
- Phần 1: 3–5 bước nghĩ thật mỗi câu, không lộ đáp số (kể cả 8d chỉ nói "tìm giá trị của $\cos B$").
- Hình: 4 hình đề `de_PBB2…5` đúng câu, không dính chữ câu khác. 8 hình giải `giai_P5B2, 3, 4, 6, 7, 8, 9, 10` đúng dữ kiện (Bài 3 tỉ lệ $1:10$; Bài 8 $AB:AC=\tan30^\circ$; Bài 9 $AB=3$, $BC=6$; Bài 10 $AB=6$ đứng, $AC=8$ ngang), đủ điểm mọi ý, chỉ ghi số đo đề cho, nhãn không đè. Bài 5 dùng nguyên hình đề (đã là hình hình học đủ điểm) — hợp lệ. Không sửa hình.
- Số câu phải sửa: **4** (Bài 6, 7, 8, 10 — chỉ trình bày). Không đổi đáp số, không đổi phân loại.
- Cổng `--chi-kiem`: ✔ đạt cổng. Bản gốc trước sửa: `TC-GKI-2026.p5.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 6, 7, 8, 10 | định dạng | Tách 12 dòng "Xét $\triangle …$ vuông tại … có $X=…$ (hệ thức / định nghĩa / Pythagore)" thành 2 dòng: "Xét … có" / "$X=…$ (căn cứ)"; Bài 10c tách dòng trung tuyến thành "Vì $\triangle ABC$ vuông tại $A$ (gt) / và $AI$ là đường trung tuyến … (gt)", tách $KF=AF\cdot\cos\widehat{AFK}$ / $=AF\cdot\cos B$ và tương tự cho $AF$ | Luật trình bày Hình 7·8·9 (dòng ngắn ≲ 60 kí tự hiển thị); các dòng cũ 63–78 kí tự |
| Bài 6b, 7c | lập luận (thiếu căn cứ) | 6b: "nên $\widehat B$, $\widehat C$ nhọn / và chân đường cao $K$ nằm giữa $B$ và $C$"; 7c: "Vì $\widehat B$, $\widehat C$ nhọn ($\triangle ABC$ vuông tại $A$) / nên $H$ nằm giữa $B$ và $C$ / Do đó $BH+HC=BC$" | Khẳng định "$K$ / $H$ nằm giữa" không có lí do trong ngoặc |
| Bài 10c | định dạng (căn cứ) | "$\widehat{AFK}=\widehat{AFE}=\widehat B$ (câu b, …)" → "$\widehat{AFK}=\widehat{AFE}$ ($K$ thuộc cạnh $EF$) / và $\widehat{AFE}=\widehat B$ (cmt) / nên …"; dòng (5) ghi căn cứ $\widehat{HAF}=\widehat{HAC}=\widehat B$ | Kết quả ý trước ghi `(cmt)` theo luật trình bày Hình |

Đã kiểm, không sửa: Bài 1a, 1b, 2, 3, 4, 5, 9 (đúng toán, đúng luật, đủ căn cứ). Dòng `**Ghi chú:**` của trạm soạn ở Bài 8 ("điều kiện là $\widehat{ABC}=60^\circ$") chỉ cho người duyệt — đã kiểm độc lập, đúng; giữ. Nhãn "$5\ \text{cm}$" (Bài 6) và "$8\ \text{cm}$" (Bài 10) nằm dưới đoạn $KC$ / $FC$ vì chân đường cao chia cạnh — chấp nhận (ghi cho cả cạnh $BC$ / $AC$), không vẽ lại.

## Câu còn `Chưa chắc`

Không có.
