KẾT LUẬN: ĐẠT

# GKI-18 — Biên bản soát (trạm soát, 10/10)

Đề: THCS Nguyễn Du, phường Hoàn Kiếm — giữa học kì 1 Toán 8, 2025–2026 (kiểm tra 07/11/2025), 1 trang, 6 bài tự luận. Đề gốc không có bảng đáp án.
Lưu ý của lượt này: trạm soạn bị ngắt ngay sau khi viết bản soạn ⇒ đã soát lại cả phần "thử bằng máy", hình giải và mục ghi chú cuối (xem "Phần trạm soạn có thể còn dở").

## Số liệu

- **12 câu** trong tệp soạn (Bài 1a, 1b · 2a, 2b, 2c · 3a, 3b, 3c · Bài 4 · Bài 5.1 · Bài 5.2 · Bài 6) — đủ, không sót, không thừa câu của đề.
- **12 / 12 câu khớp đáp án Pha 1 ngay từ đầu** (giải mù, `GKI-18.kiem.md`; số kiểm bằng `tam/soat-kiem.mjs`: thay số ngẫu nhiên cho Bài 2, thay ngược cho Bài 3, dựng toạ độ 3 bộ cho Bài 5.2).
- **Số câu phải sửa: 3** (Bài 1b, Bài 2c, Bài 5.2) + 1 dòng ở mục ghi chú cuối tệp + vẽ lại hình giải. Không sửa đáp án, không sửa đề của câu nào.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng sau khi sửa.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1b | định dạng (ghi chú thừa) | Xoá dòng `**Ghi chú:** dấu chấm trong $28.144$ của đề là dấu nhân…` | Đổi dấu chấm thành `\cdot` là chuẩn hoá chung của kho (k8.md §3), không phải lỗi của đề gốc và không phải điều người duyệt cần xử lí; các đề khác của lô không ghi |
| Bài 2c | định dạng (khuôn Phần 2) | Bỏ dòng tính phụ đứng lẻ giữa bài và dòng `$C=…$` viết lại lần hai; thay bằng chuỗi `$=\dots$` liền mạch: dòng chia từng hạng tử $3x^4:(3x^2)-6x^3:(3x^2)+9x^2:(3x^2)$ → $(16-x^2)+(x^2-2x+3)$ → bỏ ngoặc → kết quả. Thêm ngoặc cho đơn thức chia $(3x^2)$ ở Phần 2 và ở `Chú ý` | Khuôn bài rút gọn: mở bằng dòng chép đề, mỗi bước một dòng `$=\dots$`. Viết $9x^2:3x^2$ không ngoặc dễ đọc thành $(9x^2:3)\cdot x^2$; đề gốc cũng viết có ngoặc |
| Bài 5.2 (ý b, phần "A là trung điểm của GF") | lập luận | Thay đường chứng minh "$\triangle GDA=\triangle AEF$ (c.g.c) rồi cộng ba góc kề nhau tại $A$ ra $180^\circ$" bằng: $AEDG$ là hình bình hành ($DG\parallel AE$, $DG=AE$) ⇒ $AG\parallel DE$, $AG=DE$; $ADEF$ là hình bình hành ⇒ $AF\parallel DE$, $AF=DE$; qua $A$ có hai đường thẳng cùng song song với $DE$ ⇒ trùng nhau (tiên đề Euclid) ⇒ $G$, $A$, $F$ thẳng hàng; $AG=AF$ ⇒ trung điểm. Viết lại `Mấu chốt`, Bước 3–5 và `Chú ý` của Phần 1 cho khớp từng mắt xích | Bản cũ đúng toán nhưng dòng "$G$ và $E$ nằm khác phía đối với $AB$, $F$ và $D$ nằm khác phía đối với $AC$ nên các góc kề nhau" là khẳng định **không có lí do** (luật: mỗi khẳng định hình có lí do), và phép cộng góc chỉ đúng nhờ vị trí đó. Đường mới chỉ dùng dấu hiệu / tính chất hình bình hành + tiên đề Euclid (đều trong phạm vi), ngắn hơn, cùng kiểu các đề đã đạt (GKI-04, 05, 08). Đã kiểm bằng toạ độ 3 bộ |
| Bài 5.2 (ý b, phần hình bình hành) | lập luận (chữ) | "$F$ thuộc $ME$" → "$F$ thuộc đường thẳng $ME$" (Phần 1 Bước 2 và Phần 2) | $F$ nằm ngoài đoạn $ME$ (trên tia $ME$, quá $E$) |
| Bài 5.2 | hình | Vẽ lại `giai_bai5_2.png` (sửa `tam/ve.mjs`): đổi $M$ từ sát $B$ ($t=0{,}15$) ra khoảng giữa $BC$ ($t=0{,}6$, không phải trung điểm, khác $H$); đặt $AC$ nằm ngang; vẽ tia $Ax$ kéo quá $F$ có nhãn $x$; thêm $HD$, $HE$, $HO$ nét đứt cho ý c | Hình cũ đúng dữ kiện nhưng bẹt (hình chữ nhật $ADME$ cao 44 px), nhãn $O$ đè đoạn $ME$, nhãn $D$ chạm gạch bằng nhau và sát $B$, không có tia $Ax$, không thấy tam giác $DHE$ của ý c |
| Ghi chú cuối tệp | ghi chú | Dòng Bài 5.2: nói rõ hình không vẽ $AG$, $GF$; ý b đi qua hai hình bình hành + tiên đề Euclid; ý c dùng trung tuyến ứng với cạnh huyền và chiều đảo | Khớp với lời giải và hình sau khi sửa |

## Phần trạm soạn có thể còn dở (đã kiểm từng mục)

- **Thử lại bằng máy**: `tam/kiem.mjs` của trạm soạn có sẵn; chạy lại ⇒ "TẤT CẢ OK". Thêm `tam/soat-kiem.mjs` của trạm soát (độc lập) ⇒ khớp.
- **Hình giải**: Bài 5.2 là bài hình tự luận duy nhất đề không cho hình; tệp đã có nhưng xấu ⇒ vẽ lại (bảng trên). Bài 5.1 dùng hình của đề.
- **Mục `## GHI CHÚ CHO NGƯỜI DUYỆT`**: đã có đủ (bộ sách, phạm vi, tách ý, loại câu, Bài 6, Bài 5.2, không có bảng đáp án); chỉ sửa dòng Bài 5.2.

## Đã soát, không phải sửa

- **Đề**: 12 câu chép đúng ảnh trang (đối chiếu thêm lớp chữ `lop-chu.txt`): số mũ Bài 2, Bài 3, Bài 6 ($2023$, $2024$, $2025$), dấu, ngoặc, tên điểm Bài 5.2, đủ ý a) b) c). Bài 5.1: $\widehat{A}=105^\circ$, $\widehat{D}=86^\circ$, góc vuông tại $B$ — đọc ở ảnh cắt 300 dpi (`tam/soat_hinh51.png`).
- **Hình đề** `p1b5_1.png`: đúng hình của Bài 5.1, đủ bốn đỉnh và hai số đo, không cụt, không dính chữ câu khác. Dòng `**Ghi chú:**` của Bài 5.1 (dữ kiện chỉ có trên hình) hợp lệ, giữ.
- **Luật kiến thức**: đề chạm Chương I (nhân, chia đa thức cho đơn thức), hằng đẳng thức (bình phương của tổng, của hiệu, hiệu hai bình phương — Bài 1, 2, 3), Chương III tới hình chữ nhật. Không có câu phân tích đa thức thành nhân tử ⇒ Bài 3c đi $(x+1)^2=2^2\Rightarrow x+1=2$ hoặc $x+1=-2$ — đúng. Bài 5.2a đi qua tổng góc $360^\circ$ rồi định nghĩa hình chữ nhật (không dùng "ba góc vuông" như một dấu hiệu) — đúng. Bài 5.2c dùng trung tuyến ứng với cạnh huyền + chiều đảo — được, vì đề hỏi hình chữ nhật. Bài 6 nhân $(a+b+c)(a+b+c)$ ra chín hạng tử, không trích $(a+b+c)^2$ như hằng đẳng thức — đúng. Không câu nào dùng đường trung bình, Thalès, đồng dạng, Pythagore.
- **Bài 5.2c**: bản soạn tách riêng trường hợp $H$ trùng $M$ (khi đó $\triangle AHM$ suy biến) — đúng và cần.
- **Phân loại**: `kho` đúng (Bài 5.1, 5.2 = `hinh_hoc`; còn lại `dai`). Tách ý Bài 1, 2, 3 (Tính nhanh / Rút gọn / Tìm $x$, các ý độc lập) — đúng; Bài 4 (ý b thay số vào biểu thức ý a) giữ một câu — đúng; Bài 5 là vỏ gom hai bài toán hình ⇒ 5.1 và 5.2, không tách ý trong 5.2 — đúng. Trả lời ngắn: 1a ($9400$), 3a ($-6$), 5.1 ($79$), 6 ($0$) — đều là một số nguyên ≤ 4 ô; 1b ($10000$, 5 chữ số), 3b (phân số), 3c (hai giá trị) để tự luận — đúng.
- **Phần 1** mọi câu 3–6 bước, là bước nghĩ thật, không lộ đáp số cuối; Bài 5.2 viết theo chiều phân tích đi lên và Phần 2 đi ngược lại.
- **Định dạng**: dấu nhân `\cdot`, không `\times`, không dấu chấm làm dấu nhân; `\dfrac`, `\widehat`, `\parallel`, `\perp`.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

Ghi nhận thêm (không phải `Chưa chắc`): Bài 5.2b, bước cuối "$G$, $A$, $F$ thẳng hàng và $AG=AF$ nên $A$ là trung điểm của $GF$" ngầm dùng $G$ khác $F$ (hiển nhiên: $G$ thuộc đường thẳng $MD$, $F$ thuộc đường thẳng $ME$, hai đường thẳng này chỉ gặp nhau tại $M$) — viết theo mức trình bày của vở lớp 8, không nêu riêng.
