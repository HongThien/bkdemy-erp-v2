KẾT LUẬN: ĐẠT

# GKI-15 — Biên bản soát (trạm soát, 10/10)

Đề: THCS Hoàng Văn Thụ — kiểm tra giữa học kì 1 Toán 8, 2024–2025, **mã đề T801**, 2 trang, có lớp chữ. 25 câu trắc nghiệm + 5 câu tự luận (Câu 26–30).
Đề **in sẵn đáp án trắc nghiệm bằng chữ đỏ** trên chữ cái phương án đúng (không có đáp án phần tự luận).

**Lượt soát này là lượt TIẾP NỐI.** Lượt trước bị ngắt giữa Pha 2: đã ghi `GKI-15.kiem.md` (bảng giải mù Pha 1) và chép `GKI-15.soan.goc.md`, nhưng **chưa sửa chữ nào**
trong `GKI-15.soan.md` (so từng byte lúc bắt đầu lượt này: hai tệp giống hệt nhau). Mọi chỗ sửa trong bảng dưới đều do lượt này làm. Hai tệp `kiem.md`, `soan.goc.md` giữ nguyên.
Lượt này đã mở lại hai ảnh trang + bản cắt 300 dpi phần tự luận, chạy lại `tam/kiem-soat.mjs` của Pha 1 (✔ khớp hết) rồi mới soát.

## Số liệu

- **32 câu** trong tệp soạn (24 trắc nghiệm · 1 trả lời ngắn · 7 tự luận) = 30 câu của đề, Câu 26 và Câu 27 tách thành a, b. Đủ, không sót, không thừa.
- **32 / 32 câu khớp đáp án Pha 1 ngay từ đầu.** Ba nguồn ở phần trắc nghiệm (bản soạn · giải mù · chữ đỏ trong đề): khớp cả ba ở 25 / 25 câu; đề không in đáp án đỏ sai câu nào.
- **Số câu phải sửa: 6** (Câu 4, 16, 17, 18, 23, 29) + 3 dòng ở mục ghi chú cuối tệp. **Không sửa đáp án câu nào.** Sửa đề 1 câu (Câu 18, thêm điều kiện đề gốc thiếu).
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng sau khi sửa (chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 4 | ghi chú | Viết lại `**Ghi chú:**`: "đề gốc in liền $2x^2y3xy^2$ (đơn thức chưa thu gọn, không có dấu nhân); đã thêm dấu nhân trước số 3 cho dễ đọc, nghĩa không đổi" | Ghi chú cũ nói đề "thiếu dấu nhân giữa hai đơn thức … cho đúng nghĩa" — đề gốc không sai, đó là một đơn thức chưa thu gọn viết liền |
| Câu 16 | lập luận (Phần 1) | Bước 3: "$A$, $B$ là căn của số hạng" → "$A$, $B$ là biểu thức đem bình phương ($2x$ và $3y$) chứ không phải chính hai số hạng $4x^2$, $9y^2$" | "Căn của số hạng" không đúng chữ (căn bậc hai của $4x^2$ là $\lvert 2x\rvert$) và lớp 8 chưa học căn của biểu thức chứa chữ |
| Câu 17 | chưa chắc (xoá) | Xoá dòng `**Chưa chắc:**` của trạm soạn; thêm `**Chú ý:**` ở Phần 1 (C và D mỗi phương án chỉ nêu một giá trị nên chưa đủ) | Đã kiểm chắc: $x^2-9=0$ có đúng hai giá trị nguyên $3$ và $-3$ (máy thay ngược), B "$\pm3$" là phương án duy nhất nêu đủ, trùng chữ đỏ trong đề — không còn gì chưa chắc |
| Câu 18 | chép đề (đề gốc thiếu điều kiện) | Đề: "Tam giác vuông $ABC$ có …" → "Tam giác $ABC$ vuông tại $A$ có …"; đổi dòng `**Chưa chắc:**` thành `**Ghi chú:**` nói rõ đã thêm gì và vì sao; Phần 1 Bước 1 sửa theo ("tam giác vuông tại $A$ nên $AB$, $AC$ là hai cạnh góc vuông") | Đề gốc không nói vuông tại đỉnh nào. Đã kiểm chắc bằng máy: vuông tại $A$ ⇒ $BC=5$ cm (phương án A, trùng chữ đỏ); vuông tại $B$ ⇒ $BC=\sqrt{7}$ cm (không có trong phương án); vuông tại $C$ ⇒ không có tam giác. Theo brief soạn mục 7: đề thiếu điều kiện ⇒ thêm điều kiện tối thiểu + ghi chú. Mã đề T802 cùng trường (GKI-16) cũng xử lí như vậy |
| Câu 23 | lập luận (Phần 1) | `**Chú ý:**`: "(hai góc kề bù nhau)" → "góc $\widehat{B}$ kề với $\widehat{A}$ (hai góc trong cùng phía của $AD\parallel BC$ nên bù nhau)" | "Hai góc kề bù nhau" dễ lẫn với khái niệm "hai góc kề bù" của lớp 7 và không nêu lí do |
| Câu 29 | lập luận (Phần 2, ý c) | "Vì $H$, $K$ thuộc đoạn $CD$ nên $DC=DH+HK+KC$" → "Trên đoạn thẳng $DC$, các điểm $D$, $H$, $K$, $C$ nằm theo thứ tự đó nên $DC=DH+HK+KC$" | "$H$, $K$ thuộc đoạn $CD$" chưa đủ để cộng đoạn thẳng (còn cần thứ tự $H$ trước $K$); nêu đúng điều đang dùng |
| Câu 29 | hình | Vẽ lại `giai_cau29.png`: canvas cao 380 → 410 (`tam/ve.mjs`) | Hàng nhãn đáy $D$, $H$, $E$, $K$, $C$ chỉ còn ~16px tới mép dưới; brief soạn 3.8 yêu cầu chừa ≥ 35px. Nội dung hình không đổi |
| Ghi chú cuối tệp | ghi chú | Xoá "(bản máy gõ lại sai ở Câu 2 phương án C, Câu 27b và đáp án Câu 8; đã sửa theo ảnh)"; sửa câu "không dùng phân tích … bằng đặt nhân tử chung" (đặt thừa số chung vốn được dùng; đề chỉ không hỏi nhóm / tách hạng tử); thay dòng "Câu 17 và Câu 18 có Chưa chắc" bằng dòng nói Câu 18 đã thêm "vuông tại $A$", Câu 4 đã thêm dấu nhân | Ghi chú về bản máy gõ thì xoá (brief soát); hai dòng còn lại không còn đúng với tệp sau khi sửa |

## Đã soát, không phải sửa

- **Đề**: 30 câu chép đúng ảnh — số, số mũ, dấu, ngoặc, phương án, tên điểm (phần tự luận đọc trên bản cắt 300 dpi `tam/s2c.png`; Câu 26b là $(x-2)(5x^2-4x)$, dấu trừ in nhỏ nhưng đọc chắc). Câu 14 đề in "77.46" — bản soạn viết $77 \cdot 46$ là đúng.
- **Câu 24** (yêu cầu kiểm lại trên ảnh): đề gốc **chỉ in ba phương án A, B, C, không có D** — đã xác nhận trên ảnh trang 2 (dòng thứ nhất A, B; dòng thứ hai chỉ có C tô đỏ; ngay sau là Câu 25).
  Bản soạn nhập `tu_luan`, giữ đủ ba phát biểu trong đề, lời giải xét từng phát biểu, kết luận C, có `**Ghi chú:**` — đúng (trắc nghiệm đòi đủ 4 phương án; không bịa phương án D). Đáp án C trùng giải mù và chữ đỏ.
- **Đáp án / đáp số**: 26a $10x^4y^3-2x^3y+6xy^2$ · 26b $5x^3-14x^2+8x$ · 27a $4x^2+12x+9$ · 27b $-30$ · 28a $2x^2y-20$ · 28b $-10xy^2+2xy$ · 30 $M=\dfrac{4}{5}$ ($x=2$, $y=\dfrac{2}{5}$) — tất cả trùng Pha 1, máy thay số khớp.
- **Luật kiến thức**: đề chạm đơn thức – đa thức, nhân, chia cho đơn thức, hằng đẳng thức (tới tổng / hiệu hai lập phương), định lí Pythagore (Câu 18, 21), tứ giác, hình thang cân, hình bình hành, hình chữ nhật.
  Không câu nào dùng đường trung bình, Thalès, đồng dạng, lượng giác, "phương trình – tập nghiệm". Câu 17 viết hiệu hai bình phương thành tích rồi "tích bằng 0" — trong phạm vi (đề có Câu 12, 16 cùng kiểu).
  Câu 24, 25 nhắc "đường chéo vuông góc là tính chất của hình thoi" chỉ để loại phương án — là kiến thức hình học trực quan lớp 6, không dùng trong chứng minh.
- **Câu 29** (hình chứng minh): a) $AH\parallel BK$ (cùng vuông góc $CD$), $AB\parallel HK$ ⇒ hình bình hành (định nghĩa) có một góc vuông ⇒ hình chữ nhật (dấu hiệu) — không dùng "ba góc vuông".
  b) $\triangle AHD=\triangle BKC$ (cạnh huyền – góc nhọn) từ hai tính chất của hình thang cân. c) $EC=HK=AB$, $AB\parallel EC$ ⇒ $ABCE$ là hình bình hành ⇒ $I$ là trung điểm $AC$ ⇒ thẳng hàng.
  Phần 1 đi theo phân tích đi lên (6 bước, "muốn có …, cần …"), Phần 2 đi ngược lại, khớp từng mắt xích; trùng hướng giải mù. Toạ độ 3 bộ: $DH=CK$, $EC=AB$, $I$ là trung điểm $AC$ ✔.
- **Hình giải** `giai_cau29.png`: dựng bằng toạ độ ($HE=DH=CK=70$, $I$ là trung điểm $EB$ tính bằng phép tính, và đúng là trung điểm $AC$); đủ 8 điểm, nhãn đúng chỗ, không đè; chỉ đánh dấu giả thiết
  ($DH=HE$, $IE=IB$, hai cạnh bên bằng nhau, hai góc vuông tại $H$, $K$); **không vẽ đoạn $AC$** (điều phải chứng minh ở ý c).
- **Phân loại**: `kho` đúng (Câu 18–25, 29 = `hinh_hoc`; còn lại `dai`). Tách Câu 26 (a, b cùng "Làm tính nhân", độc lập) và Câu 27 (a "Tính", b "Rút gọn", độc lập) là đúng; Câu 28 (chung $M$, $N$) và Câu 29 (hình) giữ một câu là đúng.
  Câu 27b đáp số là số nguyên $-30$ ⇒ `tra_loi_ngan` hợp lệ; Câu 30 đáp số là phân số ⇒ `tu_luan` đúng.
- **Định dạng**: dấu nhân `\cdot`, Phần 1 mỗi câu 3–6 bước, không chép lại Phần 2, không ghi đáp số cuối; câu trắc nghiệm kết bằng `Chọn X.` trùng `dap_an`.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

Ghi nhận thêm (không phải `Chưa chắc` của câu nào):

- **`bo_sach`**: bản soạn ghi `Cánh Diều` vì đề có Pythagore ở học kì 1 (luật k8.md §10) — đây là ĐOÁN, đề không ghi bộ sách. Phạm vi còn lại của đề (Chương I + hằng đẳng thức + tứ giác → hình chữ nhật, không hình chóp, không phân thức)
  lại giống đề KNTT. Mã đề T802 cùng trường (`GKI-16.soan.md`) đang ghi `KNTT` ⇒ hai mã của một trường đang lệch nhau; trạm soát không đủ căn cứ để chốt, để nguyên `Cánh Diều`. Không ảnh hưởng lời giải (cả hai cách ghi đều cho phép dùng đúng những gì đề hỏi tới).
- **Câu 29c**: thứ tự $D$, $H$, $K$, $C$ trên đáy lớn lấy theo hình (đề chỉ nói "$H$, $K$ thuộc $CD$") — mức trình bày vở lớp 8 chấp nhận, đã ghi ở mục ghi chú cuối tệp soạn.
- GKI-15 (T801) và GKI-16 (T802) là hai mã của cùng một đề (luật trùng ≥ 70% ⇒ chỉ nhập mã đầu, k8.md §10) — việc của trạm điều phối, không thuộc lượt soát này.
