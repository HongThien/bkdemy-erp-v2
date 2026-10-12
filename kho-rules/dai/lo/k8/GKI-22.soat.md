KẾT LUẬN: ĐẠT

# GKI-22 — biên bản soát (THCS Văn Khê, phường Hà Đông — đề scan 1 trang, không in đáp án)

- **Số câu:** 12 (Bài 1a–1d, Bài 2a–2d, Bài 3, Bài 4.1, Bài 4.2, Bài 5 — đủ 5 bài của đề, không sót ý nào).
- **Khớp đáp án / đáp số với Pha 1 ngay từ đầu:** 12/12 (bảng giải mù `GKI-22.kiem.md`; máy tính lại `<LV>\tam\s_kiem.mjs`: đa thức thay 6 bộ số ngẫu nhiên, tìm $x$ thay ngược vào đề, Bài 4.2 dựng toạ độ 3 tam giác — 2 thường, 1 cân tại $M$).
- **Số câu phải sửa:** 5 (Bài 2a, 2c, 4.1, 4.2, 5) + 1 câu chỉ viết lại dòng `Chưa chắc` (Bài 1a). Theo loại lỗi: 2 hình · 3 lập luận · 2 định dạng · 1 ghi chú thừa · 2 dòng `Chưa chắc` thêm theo luật · 1 dòng `Chưa chắc` bỏ. Không có lỗi chép đề, đáp số, kiến thức, phân loại. Bản trước khi sửa: `GKI-22.soan.goc.md`.
- **Chép đề:** đối chiếu ảnh cắt 300 dpi từng bài (`<LV>\tam\s_b1…s_b5.png`) — đúng mọi số, số mũ, dấu, tên điểm, đủ ý. Hai chỗ nhoè tự đọc ở 600 và 1200 dpi (`s_1a`, `s_2c`, `s_z_*.png`), xem mục dưới.
- **Kiến thức:** không có đường trung bình / Thalès / đồng dạng / Pythagore, kể cả dùng ngầm. Bài 4.1 và ý a Bài 4.2 tự chứng minh bằng hai hình bình hành (dấu hiệu "hai đường chéo cắt nhau tại trung điểm mỗi đường" rồi "một cặp cạnh đối song song và bằng nhau") — đã kiểm từng mắt xích, đúng thứ tự đỉnh, đúng cặp cạnh đối. Ý c Bài 4.2 dùng tính chất + dấu hiệu "hình thang có hai đường chéo bằng nhau" (trong phạm vi) và hình bình hành $NGPH$, $MDHN$ — đúng, cùng kết luận với Pha 1 (Pha 1 đi đường khác: $\triangle PGH$ cân ⟺ $ME\perp NP$). Hằng đẳng thức được dùng vì đề chạm tới (Bài I c, d; II c, d; III). Trọng tâm tam giác là kiến thức lớp 7.
- **Phân loại:** `kho` (Bài 4.1, 4.2 = `hinh_hoc`, còn lại `dai`), `loai` (trả lời ngắn: Bài 2a $=2$, Bài 2d $=-4$, Bài 4.1 $=14{,}5$; Bài 2b, 2c đáp số phân số ⇒ tự luận), cách tách ý (tách Bài I, II; Bài III chung dữ kiện giữ một câu; Bài IV thành hai bài toán 4.1 / 4.2, không tách ý) — đúng luật, không sửa.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (12 câu · 0 TN · 3 TLN · 9 tự luận · chưa chắc 4).

## Hai chỗ nhoè của ảnh scan (tự đọc ở Pha 1)

| Chỗ | Đọc được | Căn cứ | Xử lí |
|---|---|---|---|
| Bài 1a — hệ số hạng tử thứ hai | $3$ (không loại hẳn được $5$) | Phóng 1200 dpi (`s_z_1a.png`): nửa trên chỉ còn hai chấm, nửa dưới là nét bụng cong mở về bên trái — hợp với 3, nhưng nửa dưới của chữ số 5 cùng phông (`s_z_1b5.png`) cũng cong như vậy. Không phải 8, 9, 0. Trạm soạn và bản máy cũng đọc 3 | **Giữ `Chưa chắc`**, viết lại cho rõ hai khả năng ($3\Rightarrow -9xy^2$; $5\Rightarrow -11xy^2$) |
| Bài 2c — số mũ của $(x-5)$ | $2$ | Phóng 1200 dpi (`s_z_2c.png`): còn nguyên nét móc phía trên rồi nét xiên xuống trái, dưới chân là một hàng chấm ngang (vết chân của chữ số 2) — trùng dáng số mũ 2 ở ý d cùng dòng (`s_z_2d.png`), khác hẳn số mũ 3 ở Bài 1d (`s_z_1d.png`, hai bụng cong về bên phải). Mũ 2 thì hai hạng tử $x^2$ triệt tiêu như ba ý còn lại của bài | **Bỏ `Chưa chắc`** của trạm soạn. *(Ghi để biết: nếu là mũ 3 thì đẳng thức thành bậc ba, có nghiệm $x=10$ nhưng phải phân tích nhân tử — đề không chạm tới.)* |

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1a | (dòng `Chưa chắc`) | Viết lại: nêu rõ ba lượt đọc đều ra 3, khả năng còn lại là 5 và đáp số khi đó | Dòng cũ chỉ nói "nếu là số khác thì hệ số cuối thay đổi" — CEO không biết phải so với khả năng nào |
| Bài 2a | định dạng | Phần 1 Bước 1: `$2 \cdot (3x-1)=10$` → `$2(3x-1)=10$` | Số với ngoặc viết liền (k8 §3) |
| Bài 2c | lập luận | Mấu chốt: "hạng tử $x^2$ ở hai vế triệt tiêu" → "hai hạng tử $x^2$ và $-x^2$ ở vế trái triệt tiêu". Chú ý: "chia hai vế cho số âm đừng quên đổi dấu kết quả" → "số âm chia cho số âm được số dương" | Cả hai hạng tử $x^2$ đều ở vế trái (vế phải là số 5). Câu "đổi dấu kết quả" sai nghĩa: $-20:(-12)$ ra dương, không có gì phải đổi dấu |
| Bài 2c | (dòng `Chưa chắc`) | Xoá | Đã đọc chắc số mũ 2 — xem bảng trên |
| Bài 4.1 | hình | Thêm `**Hình giải:** giai_bai4_1.png` (vẽ bằng code, đúng tỉ lệ $18$ – $32$ – $29$, điểm phụ $K$, các đường phụ $BK$, $PK$, $MK$, $PA$ nét đứt) | Lời giải dựng điểm phụ $K$ không có trên hình của đề; cùng cách làm với GKI-17, GKI-21 |
| Bài 4.1 | lập luận | Phần 1 Bước 2: "lấy $K$ đối xứng với $A$ qua $B$" → "lấy $K$ trên tia đối của tia $BA$ sao cho $BK=BA$"; Phần 2 hai dòng đầu thêm "Theo hình vẽ, $A$ nằm trên cạnh $MN$…", "$B$ nằm trên cạnh $MP$…" | Khớp chữ với Phần 2 và không dùng khái niệm đối xứng qua một điểm; $MA=AN$ chỉ cho trung điểm khi $A$ nằm trên đoạn $MN$ |
| Bài 4.1 | (dòng `Chưa chắc`) | Thêm dòng chuẩn "dữ kiện đúng là bài đường trung bình… CEO quyết…" | Luật k8 §10 / brief soạn §7: bài đúng kiểu đường trung bình phải báo CEO |
| Bài 4.2 | hình | Vẽ lại `giai_bai4_2.png`: bỏ 4 gạch $MG=GH$; thêm điểm phụ $K$ (ý a) với $FK$, $MK$, $DK$ nét đứt và đoạn $NH$ (ý c) nét đứt; dời $M$ để tam giác lệch rõ | Gạch đánh dấu trên $GH$ đặt ở $\dfrac{1}{4}$ đoạn, rơi đúng vào đoạn $GE$ ⇒ hình đọc thành "$GE=MG$" (sai). Lời giải dùng $K$, $NH$ mà hình không có. Tam giác cũ gần cân tại $M$ ($297$ – $322$), trong khi cân tại $M$ chính là đáp số ý c |
| Bài 4.2 | lập luận | Ý b: thay "Vì $G$ là trọng tâm nên $MG=2GE$" bằng hai dòng: hai trung tuyến cắt nhau tại $G$ ⇒ $G$ là trọng tâm; $MG=\dfrac{2}{3}ME$ ⇒ $GE=\dfrac{1}{3}ME$ ⇒ $MG=2GE$. Phần 1 Bước 2: "lấy $K$ đối xứng với $E$ qua $F$" → "trên tia đối của tia $FE$ sao cho $FK=FE$" | Mỗi khẳng định hình phải có lí do; tính chất trọng tâm học ở dạng $\dfrac{2}{3}$ trung tuyến |
| Bài 4.2 | (dòng `Chưa chắc`) | Thêm dòng chuẩn "dữ kiện đúng là bài đường trung bình…" | Ý a ($EF\parallel MN$ với $E$, $F$ là hai trung điểm) đúng kiểu đường trung bình |
| Bài 5 | ghi chú | Xoá `**Ghi chú:**` "Đề in 'đồng/ 1 ngày' xuống dòng giữa chừng…" | Không phải lỗi của đề gốc, người duyệt không cần biết |
| Bài 5 | lập luận | Phần 2: thêm dòng "Cứ tăng giá thêm 20 nghìn đồng thì có thêm 2 phòng trống, tức là cứ tăng 10 nghìn đồng thì trống thêm 1 phòng" trước khi viết $400+10x$ | Bản cũ dùng "cứ tăng 10 nghìn thì trống 1 phòng" như dữ kiện của đề; đề cho 20 nghìn – 2 phòng |
| Bài 5 | định dạng | Mấu chốt: "giá phòng × số phòng thuê theo một ẩn" → "giá một phòng nhân với số phòng được thuê… theo một chữ $x$" | Không dùng dấu "×" (khối 8 dùng `\cdot`); tránh chữ "ẩn" của bài phương trình |
| Ghi chú cuối tệp | — | Viết lại gạch đầu dòng về hai chỗ nhoè và về hình giải | Khớp với các thay đổi trên |

Các câu không sửa: Bài 1b, 1c, 1d, 2b, 2d, 3 — đề, đáp số, lời giải, Phần 1 đều đạt.

## Câu còn `Chưa chắc` (gửi CEO)

| Câu | Lí do |
|---|---|
| Bài 1a | Ảnh scan mất nét nửa trên của hệ số ở hạng tử thứ hai: đọc là $3xy^2$ (đáp số $-9xy^2$), không loại hẳn được $5xy^2$ (đáp số $-11xy^2$). Cần bản đề rõ hơn để chốt |
| Bài 4.1 | Dữ kiện đúng là bài đường trung bình ($A$, $B$ là trung điểm $MN$, $MP$; hỏi $AB$ theo $NP$). Lời giải tự chứng minh bằng hai hình bình hành — CEO quyết có cho dùng đường trung bình ở đề này không |
| Bài 4.2 | Ý a ($EFMN$ là hình thang ⇐ $EF\parallel MN$) đúng kiểu đường trung bình; lời giải tự chứng minh bằng hai hình bình hành — CEO quyết như Bài 4.1 |
| Bài 5 | Đề có hai cách hiểu: tăng theo tỉ lệ (10 nghìn – 1 phòng) ⇒ tăng 50 nghìn đồng, doanh thu 20 250 nghìn (lời giải chọn cách này); chỉ tăng nguyên lần 20 nghìn ⇒ tăng 40 hoặc 60 nghìn đồng, doanh thu 20 240 nghìn |
