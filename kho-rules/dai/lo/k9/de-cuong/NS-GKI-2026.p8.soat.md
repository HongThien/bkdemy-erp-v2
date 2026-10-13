KẾT LUẬN: ĐẠT

# NS-GKI-2026 · Phần 8 (B. Hình học, Bài 6–10) — biên bản SOÁT (13/10)

- Số câu: **5** (1 `tra_loi_ngan` · 4 `tu_luan`; cả 5 `kho=hgt`).
- Khớp Pha 1 (giải mù, `NS-GKI-2026.p8.kiem.md`, script `<LV>\tam\mu_p8.mjs`) ngay từ đầu: **5 / 5** — không câu nào lệch đáp số.
- Số câu phải sửa: **3** (Bài 7, 8, 10) — không sửa đáp số, không sửa đề, không đổi phân loại. Bản trước khi sửa: `NS-GKI-2026.p8.soan.goc.md`.
- Cổng: `✔ đạt cổng` (5 câu · 0 TN · 1 TLN · 4 tự luận · HGT 5 · hình 3 · chưa chắc 2).

## Chỗ đã sửa

| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 7 | định dạng | Phần 1: gộp Bước 4 ("làm tròn và ghi đơn vị") vào Bước 3 — còn 3 bước | Bước 4 vụn, không phải bước nghĩ riêng |
| Bài 8 | lập luận | Phần 1 Bước 2 viết lại: hai góc nhọn của cùng một tam giác vuông NÊN phụ nhau (bản soạn viết ngược: "phụ nhau, từ đó thấy cùng nằm trong một tam giác vuông"); gộp Bước 4 (chỉ "kết luận") vào Bước 3 | Suy luận ngược chiều; bước vụn |
| Bài 8 | lập luận | Phần 2: nêu điểm $C$ (nơi tia nắng chạm mặt đất) và tách riêng dòng "tạo với mặt đất góc $x$ nên $\widehat{ACB}=x$; tạo với cạnh $AB$ góc $y$ nên $\widehat{ABC}=y$"; thêm `Chú ý` ở Phần 1 rằng hình ghi $x$, $y$ ngược lời văn và kết quả không phụ thuộc cách ghi | Hình của đề ghi $x$ ở $B$, $y$ ở $C$ — học sinh nhìn hình sẽ thấy lệch với lời giải nếu không nói rõ lời giải gán góc theo lời văn |
| Bài 10 | lập luận | Phần 2: thêm dòng chỉ ra $K$ nằm giữa $B$ và $C$ (chân nhìn theo góc hạ, đỉnh nhìn theo góc nâng) trước khi viết $BC=BK+KC$; viết đủ căn cứ $AHBK$ là hình chữ nhật (ba góc vuông) | Bản soạn cộng $BK+KC$ mà chưa chỉ ra $K$ nằm giữa; "là hình chữ nhật" chưa nêu đủ lí do |
| Bài 10 | hình | `giai_B10.png` vẽ lại (`<LV>\tam\ve_p8.mjs`): hạ mặt đất 405 → 375 px, canvas 440 × 450 để chừa ≥ 35 px dưới nhãn $H$, $B$ (trước chỉ còn ~10 px); cung góc $34^\circ$ bán kính nhỏ hơn cung $62^\circ$ cho hai cung tách nhau | Brief soạn 3.5: chừa ≥ 35 px dưới nhãn đáy; hai cung cùng bán kính dính thành một cung |
| Bài 10 | (ghi chú) | Bổ sung dòng `Chưa chắc`: xác nhận hình lệch thật + hai cách đọc hình ($\approx32{,}1$ m và $\approx35{,}9$ m) | Dòng cũ nói "$34^\circ$ đặt giữa hai tia ngắm" nhưng chỉ tính cách "cả hai là góc hạ" ($32{,}1$ m); nếu $34^\circ$ là góc giữa hai tia thì góc hạ tới đỉnh là $28^\circ$ ⇒ $35{,}9$ m |

## Đã kiểm, không phải sửa

- **Đọc ảnh trang 4 (phóng to 260–520 dpi):** Bài 6 $AB=4$ m, $BH=1{,}5$ m · Bài 7 $60^\circ$, $6{,}8$ m · Bài 8 $\cos x\approx0{,}78$, $\cot x\approx1{,}25$ · Bài 9 $AB=6$ cm, $\tan B=\dfrac{5}{12}$ · Bài 10 $50$ m, $62^\circ$, $34^\circ$ — đề đã gõ khớp ảnh từng số.
- **Bài 6:** cách xử lí "không cách tường" → "chân thang cách tường" đúng (hình: $B$ chân thang, $H$ chân tường, góc vuông tại $H$). $\cos\widehat{ABH}=0{,}375$ ⇒ $67{,}98^\circ\approx68^\circ$. Chỉ dùng định nghĩa tỉ số. `tra_loi_ngan`, `68` đúng luật (một số, đề nêu làm tròn hàng đơn vị).
- **Bài 7:** số liệu người gõ viết thêm vào lời văn ($6{,}8$ m là khoảng cách từ điểm quan sát tới chân tháp, $60^\circ$ là góc tại điểm đó, đỉnh tháp là $A$) khớp hình. $6{,}8\cdot\tan60^\circ=11{,}7779\ldots\approx11{,}78$ m; `11,78` dài 5 kí tự ⇒ `tu_luan` đúng.
- **Bài 8:** lời giải lập luận trên $\triangle ABC$ vuông tại chân toà nhà $A$, hai tỉ số suy thẳng từ định nghĩa ($\sin y=\dfrac{AC}{BC}=\cos x$; $\tan y=\dfrac{AC}{AB}=\cot x$) — không cần viện dẫn công thức ngoài. Đã kiểm bằng toạ độ. Hai số liệu của đề chỉ khớp nhau xấp xỉ ($\cos x=0{,}78$ ⇒ $\cot x\approx1{,}2464$) nhưng đáp số hàng phần trăm không đổi: $0{,}78$ và $1{,}25$. Theo kí hiệu của hình (ngược lời văn) đáp số vẫn y hệt.
- **Bài 9:** xác nhận hình của đề cương lệch thật — dấu hai gạch đặt trên $AB$, $MC$, $HC$ (không có trên $AM$), trong khi theo đề $AB=6$, $MC=1{,}25$, $HC\approx0{,}96$ ⇒ không đưa hình đó vào đề là đúng. $AC=2{,}5$; $BC=6{,}5$; $AH=AB\cdot\sin B=\dfrac{30}{13}$; $BM=\dfrac{\sqrt{601}}{4}$ — khớp toạ độ. Không dùng hệ thức đường cao (kể cả ngầm): $AH$ đi qua $\sin B$ trong hai tam giác vuông $ABC$, $ABH$. `giai_B9.png` đúng tỉ lệ ($6$ và $2{,}5$), đủ $H$, $M$, dấu trung điểm trên $AM$, $MC$, chỉ ghi "6 cm".
- **Bài 10:** xác nhận hình của đề cương lệch thật (đỉnh cột thấp hơn nóc cao ốc ⇒ không thể có "góc nâng"). Lời văn là bài quen thuộc, giải theo lời văn: $50+\dfrac{50\cdot\tan34^\circ}{\tan62^\circ}\approx67{,}93$ m. Không tính tiếp từ số đã làm tròn. Để `tu_luan` là đúng (đề không nêu cách làm tròn ⇒ đáp số không có một dạng duy nhất).

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 9** — đề không nêu cách làm tròn: lấy mặc định 1 chữ số thập phân ($AH\approx2{,}3$ cm; $BM\approx6{,}1$ cm); giá trị đúng $AH=\dfrac{30}{13}$ cm, $BM=\dfrac{\sqrt{601}}{4}$ cm (2 chữ số thập phân: $2{,}31$ và $6{,}13$). Hình của đề cương lệch lời văn nên không dùng, lời giải có hình vẽ lại.
- **Bài 10** — (1) hình của đề cương lệch lời văn: giải theo lời văn ra $\approx67{,}9$ m; theo hình thì $\approx32{,}1$ m (nếu $34^\circ$ là góc hạ tới đỉnh) hoặc $\approx35{,}9$ m (nếu $34^\circ$ là góc giữa hai tia ngắm); (2) đề không nêu cách làm tròn: lấy 1 chữ số thập phân.

(Bài 8 không ghi `Chưa chắc`: hình ghi $x$, $y$ ngược lời văn nhưng đáp số không phụ thuộc — đã nêu ở `Ghi chú` và `Chú ý`.)
