KẾT LUẬN: ĐẠT

# GKI-21 — biên bản soát (THCS Văn Yên, phường Hà Đông — đề scan 1 trang, không in đáp án)

- **Số câu:** 9 (Bài 1.1–1.4, Bài 2, Bài 3, Bài 4.1, Bài 4.2, Bài 5 — đủ 5 bài của đề, không sót ý nào).
- **Khớp đáp án / đáp số với Pha 1 ngay từ đầu:** 9/9 (bảng giải mù `GKI-21.kiem.md`; máy tính lại `<LV>\tam\soat-kiem.mjs`: đa thức thay 8 bộ số ngẫu nhiên, hình dựng toạ độ).
- **Số câu phải sửa:** 6 (1 kiến thức + hình · 2 lập luận · 3 định dạng). Bản trước khi sửa: `GKI-21.soan.goc.md`.
- **Chép đề:** đối chiếu ảnh cắt 300 dpi — đúng mọi số, số mũ, dấu, tên điểm. Không có lỗi chép đề.
- **Phân loại:** `kho`, `loai` (9 câu tự luận), cách tách ý (chỉ tách Bài 1 "Thực hiện phép tính"; Bài 4 tách thành hai bài toán 4.1 / 4.2, không tách ý) — đúng luật, không sửa.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (9 câu · hình 2 · chưa chắc 1).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 4.1 | kiến thức | Viết lại cả Phần 1 lẫn Phần 2: bỏ "$DE$ là đường trung bình của $\triangle ABC$", thay bằng tự chứng minh — lấy $F$ sao cho $E$ là trung điểm $DF$ ⇒ $ADCF$ là hình bình hành (hai đường chéo cắt nhau tại trung điểm mỗi đường) ⇒ $CF\parallel DB$, $CF=DB$ ⇒ $DBCF$ là hình bình hành ⇒ $DF\parallel BC$, $DF=BC$ ⇒ $DE=2{,}5$ cm và $\widehat{ABC}=\widehat{ADE}=70^\circ$ (đồng vị). Thêm dòng `Chưa chắc`. Sửa mục ghi chú cuối tệp | k8.md §10 cấm đường trung bình ở mọi đề giữa kì 1; bản soạn dùng thẳng với lí do "đề chạm tới". Quyết định của điều phối: thống nhất với Bài 4.1 đề GKI-17 (tự chứng minh bằng hai hình bình hành, để CEO quyết) |
| Bài 4.1 | hình | Vẽ thêm `giai_bai4_1.png` (dựng toạ độ đúng $BC=5$, $\widehat{A}=60^\circ$, $\widehat{B}=70^\circ$; $D$, $E$ trung điểm; điểm phụ $F$, đoạn $EF$, $CF$), khai `**Hình giải:**` | Lời giải mới có điểm phụ $F$ không có trên hình của đề |
| Bài 4.2 | lập luận | Ý c, phần $HD\perp HE$: bỏ cách cộng góc ($\widehat{DHE}=\widehat{DHA}+\widehat{AHE}$ dựa trên "tia $AH$ nằm giữa hai tia $AB$, $AC$" không kèm lí do, và điều cần thật ra là tia $HA$ nằm giữa $HD$, $HE$); thay bằng $\triangle HDE=\triangle ADE$ (c.c.c: $HD=AD$, $HE=AE$, $DE$ chung) ⇒ $\widehat{DHE}=\widehat{DAE}=90^\circ$. Sửa Bước 6 của Phần 1 cho khớp | Mỗi khẳng định hình phải có lí do; khẳng định vị trí tia không chứng minh. Cách c.c.c ngắn hơn và dùng lại đúng hai đẳng thức đã có |
| Bài 4.2 | hình | Tăng chiều cao canvas `giai_bai4_2.png` 320 → 350 (nội dung hình giữ nguyên) | Nhãn đáy $H$, $M$ cách mép dưới ~10px, brief soạn yêu cầu ≥ 35px |
| Bài 1.2 | lập luận | Sửa câu `Chú ý` ("hạng tử $-2x^3y^2$ và $x^3$ chỉ có một mình trong nhóm, giữ nguyên") thành: hai hạng tử chứa $x^3$ cùng dấu nên cộng lại; $-2x^3y^2$ không có hạng tử đồng dạng nên giữ nguyên | Câu cũ sai: $x^3$ có HAI hạng tử ($3x^3+3x^3$), không "một mình"; mâu thuẫn với chính Phần 2 |
| Bài 1.1 | định dạng | Phần 2 thêm dòng đầu chép lại biểu thức đề | Khuôn bài tính: mở bằng dòng chép lại biểu thức |
| Bài 1.3 | định dạng | Như Bài 1.1 | Như trên |
| Bài 3 | định dạng | `$1m^2$` → `1 $m^2$` trong đề | Số và đơn vị tách nhau, đơn vị viết `$m^2$` như các chỗ khác của câu |

## Soát riêng theo yêu cầu điều phối — Bài 4.2 có dùng ngầm đường trung bình không

**Không.** Ba chỗ dễ dính đều đã đi đường khác, hợp lệ:
- $DM=EC$ (ý b): từ $\triangle BDM=\triangle MEC$ (cạnh huyền – góc nhọn; góc đồng vị do $ME\parallel AB$ lấy từ hình chữ nhật $ADME$) — không dùng "qua trung điểm $M$, song song $AB$ thì qua trung điểm $AC$" (chiều đảo đường trung bình).
- $D$, $E$ là trung điểm của $AB$, $AC$ (ý c): từ $AD=ME=BD$ và $AE=DM=EC$ (cạnh đối hình chữ nhật + hai tam giác bằng nhau).
- $DE\parallel HM$ (ý c): từ cạnh đối của hình bình hành $DMCE$ — không dùng "$DE$ nối hai trung điểm nên song song $BC$".

Có dùng "trung tuyến ứng với cạnh huyền" (bài Hình chữ nhật, KNTT) — hợp lệ vì đề hỏi hình chữ nhật ở ý a. Ý a đi qua tổng góc $360^\circ$ rồi mới kết luận bốn góc vuông (không dùng "ba góc vuông" làm dấu hiệu).

## Các câu khác — soát không sửa

Bài 1.4, Bài 2, Bài 5: đúng toán từng dòng; dùng hằng đẳng thức (bình phương của tổng / hiệu, hiệu hai bình phương) — hợp lệ vì đề hỏi thẳng ($B=(2x+1)^2$, tìm giá trị lớn nhất). Không có phân tích nhân tử theo phương pháp Chương II, không "phương trình – tập nghiệm".
Bài 3: hiểu lối đi 3 m nằm bên trong hình chữ nhật $(x+y)$ × $(x-y)$ theo đúng hình vẽ (mũi tên kích thước chạy hết mép ngoài) — khớp Pha 1; dòng `Ghi chú` giải thích cách hiểu này là điều người duyệt cần biết nên giữ.
Hình đề `p1c3_san.png`, `p1c4_tamgiac.png`: đúng hình của câu, không cụt, không dính chữ câu khác.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 4.1** — dữ kiện của bài đúng là bài đường trung bình của tam giác ($D$, $E$ là trung điểm $AB$, $AC$; hỏi $DE$ theo $BC$ và góc $\widehat{ABC}$). Lời giải tự chứng minh bằng hai hình bình hành theo luật không dùng kiến thức chương sau (dài hơn nhiều so với đáp án 2 dòng của trường). CEO quyết có cho dùng đường trung bình ở đề này không (cùng tình huống với Bài 4.1 đề GKI-17).
