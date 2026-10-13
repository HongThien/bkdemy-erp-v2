KẾT LUẬN: ĐẠT

# NS-GKI-2026 · phần 7 (B. Hình học — Bài 3, 4, 5) — biên bản SOÁT (Opus, 13/10)

- Số câu: **3** (đều `kho=hgt`, `tu_luan`, mỗi bài một câu nhiều ý — không tách, không đổi nhãn).
- Khớp Pha 1 (giải mù, `NS-GKI-2026.p7.kiem.md`, script `tam\mu_p7.mjs`) ngay từ đầu: **3 / 3** — mọi đáp số trùng:
  Bài 3 $\widehat{B}\approx56^\circ$, $AI\approx5{,}4$, $AH\approx4{,}7$ · Bài 4 $\widehat{B}=60^\circ$, $BC=18$, $AC\approx15{,}59$, $AH\approx7{,}79$, $BH=4{,}5$, $AD\approx8{,}07$ ·
  Bài 5 $AC=28$, $\widehat{C}\approx36^\circ52'$, $\widehat{B}\approx53^\circ8'$, $AH=16{,}8$, $AD\approx16{,}97$.
- Số câu phải sửa: **3** (không câu nào sai đáp số; sửa lập luận / định dạng nhỏ) + vẽ lại **3 hình giải**. Bản trước khi sửa: `NS-GKI-2026.p7.soan.goc.md`.
- Chép đề: đúng ảnh trang 3 (đã phóng to 260 dpi: `z\soat_p7_b345.png`). Ghi chú của người gõ ở Bài 4 ý b (đề in "Kẻ đường cao của tam giác AH. của tam giác ABC") — cách nhập đúng, giữ.
- Luật kiến thức: không hệ thức đường cao, không định lí sin / côsin, không biến đổi căn chương III ($\sqrt{325}$, $\sqrt{288}$ để nguyên rồi bấm máy), không `⇔`. Đường cao tính bằng $\sin$, $\cos$ trong tam giác vuông $AHB$
  (Bài 4, 5) và bằng hai cách tính diện tích (Bài 3); đường phân giác dùng tính chất đường phân giác lớp 8 (Bài 3, 5) và tổng ba góc + tam giác vuông $AHD$ (Bài 4) — từng bước có lí do, có xét vị trí $H$ giữa $B$ và $D$.
- Phần 1: 4–5 bước nghĩ thật mỗi bài, không lộ đáp số (kể cả Chú ý).
- Cổng: `✔ đạt cổng` (3 câu · HGT 3 · chưa chắc 1).

## Chỗ đã sửa

| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 3 | lập luận (làm tròn) | Ý b: giữ $AI=\dfrac{150}{10+\sqrt{325}}$ rồi mới ghi $\approx5{,}3518$ (lưu trong máy). Ý c: bỏ hai dòng thay số $\sqrt{10^2+5{,}3518^2}$ và $\dfrac{10\cdot5{,}3518}{11{,}3421}$, viết $BI^2=AB^2+AI^2$, $AH=\dfrac{AB\cdot AI}{BI}$ với giá trị $AI$ chưa làm tròn. | Bản soạn tính tiếp từ số đã làm tròn 4 chữ số: $10\cdot5{,}3518:11{,}3421=4{,}71853$ chứ không phải $4{,}7186$ như đã ghi (giá trị đúng $4{,}718579$). Đáp số cuối $4{,}7$ không đổi, nhưng dòng tính sai ở chữ số thứ tư và trái luật "không tính tiếp từ số đã làm tròn". |
| Bài 3 | lập luận | Thêm câu kết "Vậy $\widehat{B}\approx56^\circ$" cho ý a; thêm "(vì $BC>0$)" khi lấy $BC=\sqrt{325}$. | Mỗi ý phải có kết luận bằng lời; lấy căn phải nêu độ dài dương. |
| Bài 4 | lập luận | Ý a: $AC=AB\cdot\tan B=9\cdot\tan60^\circ$ thay cho $AC=BC\cdot\cos C=18\cdot\cos30^\circ$; sửa Bước 1 của Phần 1 cho khớp. | `hgt\k9.md` §2: giải tam giác vuông ưu tiên tính từ dữ kiện gốc; Bước 1 bản soạn tự mâu thuẫn ("tính từ $BC$ … luôn dùng dữ kiện gốc"). |
| Bài 4 | lập luận | Ý b: thêm dòng "Vì $AH$ là đường cao của $\triangle ABC$ nên $AH\perp BC$ tại $H$" trước khi xét $\triangle AHB$ vuông tại $H$. | Phải nêu vì sao tam giác vuông, vuông tại đâu. |
| Bài 4 | định dạng | $BC=18{,}00$ → $18$; $BH=4{,}50$ → $4{,}5$ ở các câu "Vậy". | Giá trị đúng (không làm tròn) không thêm số $0$ vô nghĩa. |
| Bài 5 | lập luận + định dạng | Ý b: thêm dòng "$AH\perp BC$ tại $H$" (như Bài 4); $AC=28{,}00$ → $28$; $AH=16{,}80$ → $16{,}8$. | Như trên. |
| Bài 3, 4, 5 | hình | Viết lại `tam\ve_p7.mjs`, vẽ lại `giai_B3.png`, `giai_B4.png`, `giai_B5.png`: hai nửa góc của đường phân giác đánh dấu bằng **hai cung cùng bán kính, mỗi cung một gạch** (bỏ hai cung lệch bán kính chồng lên ô vuông góc ở $A$); gạch đặt lệch khỏi đường cao $AH$; phóng to tỉ lệ; số đo cạnh đáy ($15$ cm, $35$ cm) đưa xuống hàng riêng giữa cạnh để không bị đọc nhầm thành $IC$, $DC$; script tự kiểm góc vuông, hai nửa góc bằng nhau, $\widehat{C}=30^\circ$, $BD=15$. | Trạm soạn báo hình rối ở góc $A$. Hình mới: đủ $H$, $D$, $I$, nhãn không đè, chỉ ghi số đo đề cho, không ghi kết quả. |

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 3** — đề không nêu cách làm tròn (cả góc lẫn độ dài). Đang theo mặc định luật hgt khối 9: góc tới độ ($56^\circ$), độ dài 1 chữ số thập phân ($AI\approx5{,}4$ cm, $AH\approx4{,}7$ cm).
  Hai bài kế (4, 5) của chính đề cương yêu cầu 2 chữ số thập phân và góc tới phút — nếu muốn thống nhất thì đáp số là $\widehat{B}\approx56^\circ19'$, $AI\approx5{,}35$ cm, $AH\approx4{,}72$ cm (đã kiểm bằng máy).

## Ghi nhận khác (không phải lỗi)

- Bài 5 phần B in lặp lại nguyên văn ở phần C (Bài 5, trang 4) — nếu phần 9 cũng nhập thì kho có hai câu trùng; người ghép đề quyết.
