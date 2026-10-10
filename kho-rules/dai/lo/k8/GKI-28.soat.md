KẾT LUẬN: ĐẠT

# GKI-28 — Biên bản soát (trạm soát, 10/10)

Đề: THCS Hoàng Hoa Thám, phường Ngọc Hà (Hà Nội) — giữa học kì 1 Toán 8, 2025–2026. Đề 1 trang, 6 bài tự luận, không có trắc nghiệm, **không in đáp án** ⇒ hai nguồn đối chiếu: bản soạn · giải mù của trạm soát.

## Số liệu

- **11 câu** trong tệp soạn (Bài 1 · Bài 2a, 2b, 2c · Bài 3a, 3b, 3c · Bài 4 · Bài 5.1 · Bài 5.2 · Bài 6) — đủ 6 bài của đề, không sót, không thừa.
- **11 / 11 câu khớp đáp án Pha 1 ngay từ đầu** (giải mù, `GKI-28.kiem.md`; số kiểm bằng `tam/soat-kiem.mjs`: đa thức thay 6 bộ số ngẫu nhiên, giá trị $x$ thay ngược vào đề, Bài 5.2 dựng toạ độ 3 tam giác vuông).
- **Số câu phải sửa: 2** (Bài 5.2, Bài 6) — đều ở lời giải / hình giải. Không sửa đề, không sửa đáp án, không sửa phân loại của câu nào.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng sau khi sửa (11 câu · 2 trả lời ngắn · 9 tự luận · 3 hình · 1 chưa chắc).
- Bản trước khi sửa: `GKI-28.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 5.2 | lập luận (Phần 2 không khớp Phần 1) | Ý b, hai dòng đầu: "tứ giác $ADHE$ có các góc đối bằng nhau nên là hình bình hành (dấu hiệu nhận biết)" → "$ADHE$ là hình chữ nhật (câu a) nên cũng là hình bình hành; do đó $DH\parallel AE$, $DH=AE$ (hai cạnh đối của hình bình hành)". Phần 1 Bước 3 ghi rõ cùng lí do đó | Bản cũ đúng toán nhưng đi vòng (chứng minh lại hình bình hành bằng dấu hiệu góc đối trong khi ý a đã có hình chữ nhật) và lệch với Phần 1, nơi ghi "cạnh đối của $ADHE$, ý a" — hai phần phải khớp từng mắt xích |
| Bài 5.2 | lập luận (Phần 1, câu Chú ý sai chữ) | "các góc ở $Q$ đổi thành góc ở $D$, $M$" → "$\widehat{QEA}$ chính là $\widehat{DEA}$, $\widehat{QAE}$ chính là $\widehat{MAC}$" | Hai góc được đổi tên có đỉnh $E$ và $A$, không phải "góc ở $Q$"; câu cũ làm học sinh hiểu sai |
| Bài 5.2 | hình | `tam/ve.mjs`: thu tỉ lệ ($k$ 70 → 64) và nâng gốc ($oy$ 400 → 378), vẽ lại `giai_bai5_2.png` | Nhãn $A$, $D$, $B$ ở đáy chỉ cách mép dưới khoảng 18px, luật vẽ yêu cầu chừa ≥ 35px; nội dung hình không đổi |
| Bài 6 | định dạng Phần 1 (lộ đáp số cuối) | Viết lại Bước 1–4 và Chú ý: bỏ các số $4050$, $x=45$, $y=90$ khỏi các bước; các bước nói cách nghĩ (đưa $S$ về "một số trừ hai lần một bình phương", tìm $a$ để $2(x-a)(x-a)$ khớp hạng tử bậc nhất). Chú ý nói rõ vì sao phải tự nhân $(x-45)(x-45)$ ra | Bước 3, Bước 4 và Chú ý của bản cũ ghi thẳng đáp số $4050$ (câu này lại là câu trả lời ngắn) và chép lại phép tính của Phần 2. Luật k8 §1.1 điều 3: phải nói rõ ở Phần 1 khi tự chứng minh một kết quả chưa được dùng |
| Bài 6 | định dạng (dùng từ) | Phần 2: "Diện tích hàng rào" → "Diện tích khu đất được rào" | Hàng rào không có diện tích; đề hỏi diện tích rào được |
| Bài 6 | ghi chú | Dòng `Chưa chắc` của trạm soạn: giữ, sửa chữ cho gọn và ghi thêm "hai trạm giải độc lập, máy kiểm" | Xem mục cuối |

## Đã soát, không phải sửa

- **Đề**: 11 câu chép đúng ảnh — đã phóng 300 dpi toàn bộ trang (`tam/soat-a.png`, `soat-b.png`, `soat-c.png`) để đọc số mũ ở Bài 1, 2, 3, 4. Bài 3c đúng là $(x-2)(3x+5)$; Bài 4 đúng $A=7x^2y+4xy^2+2xy+3$, $B=3x^2y+xy^2+2xy+1$; Bài 5.1 đúng $EF=40$, $EM=36$, $HM=16$.
- **Đáp số** (cả hai trạm cùng ra): Bài 1: $A=-6x^5y^5$, bậc $10$, hệ số $-6$, giá trị $192$ · 2a: $10a^3b^4-5a^4b^3+a^3b^3$ · 2b: $-xy-1$ · 2c: $4xy-xy^2$ · 3a: $x=-3$ · 3b: $x=\dfrac{1}{2}$ · 3c: $x=0$ hoặc $x=\dfrac{4}{3}$ · 4a: $43\ m^2$ · 4b: $4x^2y+3xy^2+2$ · 5.1: $HG=40$ m, $EG=72$ m, $FH=32$ m · 6: $4050\ m^2$.
- **Luật kiến thức**: đề chạm Chương I (đơn thức, nhân – chia đa thức cho đơn thức, nhân đa thức với đa thức) và Chương III tới hình chữ nhật (Bài 5.2 a hỏi thẳng). Không câu nào dùng đường trung bình, Thalès, đồng dạng, Pythagore, "phương trình – tập nghiệm".
  - Bài 3c: đặt $x$ làm thừa số chung trong $3x^2-4x$ là tính chất phân phối (lớp 6–7), rồi "tích bằng $0$" — hợp lệ, không sửa.
  - Bài 5.2 a: ba góc vuông → góc thứ tư tính từ tổng $360^\circ$ → bốn góc vuông (định nghĩa), không dùng "tứ giác có ba góc vuông" như dấu hiệu — đúng luật.
  - Bài 5.2 c: dùng trung tuyến ứng với cạnh huyền ($MA=MC$) và hai đường chéo hình chữ nhật — được dùng vì chính đề hỏi tới hình chữ nhật. Các bước đổi tên góc ($Q$ trên tia $ED$, tia $AM$) có nêu lí do.
  - Bài 6: không dùng hằng đẳng thức; $(x-45)(x-45)$ được nhân ra tường minh trước khi dùng.
- **Bài hình chứng minh (Bài 5.2)**: Phần 1 sáu bước đi theo phân tích đi lên ("muốn có …, cần …"), Phần 2 đi ngược lại, sau khi sửa ý b thì khớp từng mắt xích.
- **Phân loại**: `kho` đúng (Bài 5.1, 5.2 = `hinh_hoc`; còn lại `dai`, kể cả Bài 4 và Bài 6 bối cảnh mảnh vườn). Tách ý đúng luật: Bài 2, Bài 3 tách từng ý; Bài 1 (ý 2 dùng kết quả ý 1) và Bài 4 (chung $A$, $B$) giữ một câu; Bài 5 là vỏ gom hai bài toán hình khác dữ kiện ⇒ Bài 5.1, Bài 5.2, không tách ý. Trả lời ngắn: Bài 3a ($-3$), Bài 6 ($4050$) — đều một số nguyên ≤ 4 ô; 3b (phân số), 3c (hai giá trị), 5.1 (ba độ dài) để tự luận là đúng.
- **Hình của đề**: `p1c4_vuon.png` (Bài 4), `p1c5_kinh.png` (Bài 5.1), `p1c6_rao.png` (Bài 6) — đúng hình của câu, không cụt, không dính chữ câu khác.
- **Hình giải** `giai_bai5_2.png`: dựng bằng toạ độ ($AB=3$, $AC=5$ ⇒ $AB<AC$; $H$ là chân đường cao, $D$, $E$ là hình chiếu, $K$ đối xứng $A$ qua $E$, $M$ trung điểm $BC$, $Q=DE\cap AM$ đều tính bằng phép tính). Đủ 9 điểm; kí hiệu chỉ đánh dấu giả thiết (góc vuông tại $A$, $D$, $E$, $H$; $MB=MC$; $AE=EK$), không đánh dấu góc vuông tại $Q$ hay $DH=EK$; nhãn không đè, không cụt.
- **Ghi chú** của Bài 5.2 ("$AM$ là trung tuyến của $\triangle ABC$, $M$ là trung điểm $BC$" — đề không định nghĩa $M$): là điều người duyệt cần biết về đề gốc ⇒ giữ.
- **Định dạng**: dấu nhân `\cdot`, phân số `\dfrac`, Phần 1 mỗi câu 3–6 bước; `**Thử lại:**` ở Bài 3a, 3b theo khuôn có sẵn của dây chuyền khối 6.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 6** — đáp số $4050\ m^2$ chắc chắn (hai trạm giải độc lập, máy kiểm). Điều cần CEO quyết là **cách trình bày**: bài tìm giá trị lớn nhất này vốn ra để dùng hằng đẳng thức bình phương của một hiệu, nhưng cả đề không có câu nào khác về hằng đẳng thức, nên theo luật k8 §10 lời giải tự nhân $(x-45)(x-45)$ ra rồi mới dùng "bình phương của một số thì không âm". Nếu CEO coi Bài 6 chính là câu "chạm tới hằng đẳng thức" của đề thì đổi hai dòng đó thành $x^2-90x+2025=(x-45)^2$; đáp số không đổi.
