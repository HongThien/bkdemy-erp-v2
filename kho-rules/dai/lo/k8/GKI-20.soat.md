KẾT LUẬN: ĐẠT

# GKI-20 — Biên bản soát (trạm soát, 10/10)

Đề: Trường TH&THCS Vạn An, phường Kinh Bắc — giữa học kì 1 Toán 8, 2025–2026, 90 phút. Đề có lớp chữ, in rõ; **không in đáp án** ⇒ chỉ có hai nguồn (bản soạn · giải mù).

## Số liệu

- Đề gốc 24 câu (20 trắc nghiệm + 4 tự luận). Bản soạn nộp **26 câu**; sau soát **27 câu** (tách thêm Câu 22 thành 22.1, 22.2) — đủ, không sót, không thừa câu của đề.
- **26 / 26 câu khớp đáp án Pha 1 ngay từ đầu** (giải mù `GKI-20.kiem.md`; số kiểm bằng `<LV>/tam/mu.mjs`, bài hình kiểm toạ độ 2 bộ). Riêng Câu 21.2 khớp theo cách đọc "4050" của bản soạn; cách đọc đúng như in cho đáp số khác (xem `Chưa chắc`).
- **Số câu phải sửa: 10** — không sửa đáp án nào. Trong đó 4 câu chỉ sửa định dạng đề (10, 17, 18, 23 phần đề), 6 câu sửa nội dung (15, 16, 19, 20, 21.2, 22) + vẽ lại hình giải Câu 23 + mục ghi chú cuối tệp.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng sau khi sửa (27 câu: 20 TN · 1 TLN · 6 tự luận · hình 1 · chưa chắc 1).

## Phân xử Câu 21.2 (lưu ý riêng của lượt này)

- Phóng 600 dpi đúng dòng đó (`<LV>/tam/s_c21_2.png`) và đọc lớp chữ PDF (`lop-chu.txt`): đề in **$2025^2+2026^2-2050\cdot 2026$** — chữ số 2 rõ, không mờ, không phải bản soạn đọc nhầm.
- Đúng như in: $=4\,052\,001$ (máy tính BigInt). Sửa thành $4050$: $=(2025-2026)^2=1$.
- Kết luận của trạm soát: **lỗi in của đề** — yêu cầu "Tính nhanh", ba hạng tử đúng khuôn $a^2+b^2-2ab$ với $2ab=2\cdot2025\cdot2026=4050\cdot2026$, lệch đúng một chữ số; với 2050 không có đường tính nhanh nào tự nhiên. Giữ bản sửa $4050$ của trạm soạn, đáp số $1$ (`tra_loi_ngan`), **giữ `Chưa chắc`** nêu cả hai cách đọc và đáp số của từng cách vì không có đáp án của trường để đối chiếu.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 10, 16, 17, 18, 20, 23 | định dạng | Tên điểm / tên hình trong đề ("ABCD", "ABC", "AM", "Q, A, K"…) đưa vào `$…$`; ở Câu 10 cả hai chỗ trong lời giải | Brief: mọi công thức trong `$…$`; đề mẫu và các đề đã soát đều viết `$ABCD$`; cùng một câu mà đề chữ đứng, lời giải chữ nghiêng |
| Câu 15 | lập luận | Phần 2: thay "hình bình hành cũng thoả mãn" bằng phản ví dụ cụ thể (hình bình hành có $\widehat M=60^\circ$, $\widehat N=120^\circ$); phương án D viết đủ lí do ($\widehat M+\widehat Q=180^\circ$ nên bằng nhau thì cùng $90^\circ$ — hình thang vuông, chưa chắc cân). Chú ý của Phần 1 sửa theo | Câu cũ "hình bình hành … không phải hình thang cân" không đúng với mọi hình bình hành (hình chữ nhật là hình thang cân); lí do loại D cũ chỉ là "không phải điều kiện" — chưa phải lí do |
| Câu 16 | lập luận | Phần 2: thay "B, C là điều kiện của hình chữ nhật; D không đủ" bằng một phản ví dụ chung — hình chữ nhật $4$ cm × $2$ cm thoả cả B, C, D mà không là hình thoi; Bước 3 và Mấu chốt sửa khớp | "Là điều kiện của hình chữ nhật" chưa giải thích vì sao không là hình thoi (hình vuông vừa là hình chữ nhật vừa là hình thoi); D không có lí do |
| Câu 19 | lập luận | Phần 2, dòng xét C: thêm phản ví dụ dựng được (hai đường chéo $AC=BD=4$ cm vuông góc tại $O$, $OB=OD=2$, $OA=1$, $OC=3$ — đã kiểm toạ độ: không cặp cạnh đối nào song song) | Bước 3 của Phần 1 bảo "tìm một tứ giác…" nhưng Phần 2 không đưa ra tứ giác nào — hai phần không khớp |
| Câu 20 | kiến thức (chứng minh thừa) + định dạng | Phần 2 dùng thẳng tính chất "trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền" (2 dòng); Phần 1 viết lại 3 bước (nhận ra vai trò của $AM$ · vì sao có tính chất · thay số). Đơn vị `$10cm$` → `$10$ cm` ở đề và 4 phương án | Bản soạn dựng điểm $D$, chứng minh lại tính chất qua hình chữ nhật — không sai nhưng không phải cái học sinh viết cho một câu trắc nghiệm; tính chất này thuộc bài Hình chữ nhật, **được dùng** vì đề hỏi tới hình chữ nhật / thoi / vuông (Câu 10, 16–19, 23) và chính Câu 20 kiểm tra nó (cùng cách các đề GKI-03, 06, 07 đã ĐẠT). Phần 1 cũ lại chép đúng các bước của Phần 2 |
| Câu 21.2 | ghi chú | Viết lại `Ghi chú` (chỉ nói đề in gì, đã sửa gì) và `Chưa chắc` (hai cách đọc + đáp số từng cách, kèm biến đổi cho cách đọc đúng như in) | `Chưa chắc` cũ chỉ nêu một phía; yêu cầu của lượt soát: sửa đề thì phải để người duyệt thấy cả hai cách đọc và hai đáp số |
| Câu 22 | phân loại | Tách thành **Câu 22.1** (tìm đa thức $M$) và **Câu 22.2** (chứng minh không phụ thuộc biến), mỗi câu Phần 1 riêng (3 và 4 bước), thêm dòng "Vậy $M=…$" | Câu 22 là cái vỏ gom hai bài toán khác hẳn nhau, mỗi bài một bộ dữ kiện (brief soạn mục 3.4) — đúng cách chính bản soạn đã làm với Câu 21 (21.1a, 21.1b, 21.2) |
| Câu 23 | hình | `ve.mjs`: vẽ thêm đường phụ $PN$; canvas cao 380 → 400 | Lời giải ý b dựa hẳn vào $PN$ ($AQ\parallel PN$, $AK\parallel PN$) mà hình không có $PN$; nhãn $Q$ ở đáy còn dưới 35 px lề. Không vẽ $AQ$, $AK$, $QK$ (điều phải chứng minh) |
| Ghi chú cuối tệp | ghi chú | Cập nhật: Câu 20 dùng thẳng tính chất; Câu 22 đã tách (27 câu); Câu 21.2 nêu cả đáp số theo đề in; Câu 23 có $PN$; thêm dòng về Câu 10 | Khớp với các chỗ đã sửa |

## Đã soát, không phải sửa

- **Đề**: 24 câu của đề chép đúng ảnh (đã phóng 300 dpi toàn bộ hai trang, 600 dpi cho Câu 21.2): số, số mũ, dấu, phương án, tên điểm, đủ ý. Câu 3 đề in phương án A và D giống hệt nhau ($2xy$) — bản soạn giữ nguyên và có `Ghi chú`, đúng (cả hai đều sai, đáp án C). Câu 13 dấu trừ in sẵn trước chỗ trống ⇒ A ($12x$), không phải D.
- **Đáp án**: 20 câu trắc nghiệm B B C A D D A C C A D A A B C A D C C B; tự luận 21.1a $x^3y-x^2y^2+xy^3$ · 21.1b $2x^3y^2-\dfrac83x^2y^3+1$ · 22.1 $M=7x^2-2xy-xyz+5$ · 22.2 $P=36$ · 24a $3xy$ · 24b 90 km — trùng giải mù, máy thay số xác nhận.
- **Luật kiến thức**: đề KNTT, chạm Chương I, hằng đẳng thức (Câu 12, 13, 21.2, 22.2) và Chương III tới hình thoi, hình vuông. Không câu nào dùng đường trung bình, Thalès, đồng dạng, Pythagore, phân tích nhân tử. Câu 6 nhân từng hạng tử; Câu 12, 13, 21.2, 22.2 dùng hằng đẳng thức — hợp lệ.
- **Câu 23** (hình chứng minh): ý a đi qua tổng bốn góc $360^\circ$ rồi "bốn góc vuông" — không dùng "ba góc vuông" như dấu hiệu. Ý b: hai hình bình hành $APNQ$, $ANPK$ (một cặp cạnh đối song song và bằng nhau) ⇒ $AQ\parallel PN$, $AK\parallel PN$ ⇒ tiên đề Euclid. Kiểm toạ độ: $\overrightarrow{AP}=\overrightarrow{QN}$, $\overrightarrow{AN}=\overrightarrow{KP}$, các tích có hướng bằng 0 ⇒ thứ tự đỉnh của hai tứ giác đúng. Không ngầm dùng đường trung bình. Phần 1 đi theo phân tích đi lên (thẳng hàng ⇐ cùng song song $PN$ ⇐ hai hình bình hành ⇐ hình chữ nhật ý a + giả thiết trung điểm), Phần 2 đi ngược lại, khớp từng mắt xích. Hướng giải khác với giải mù của trạm soát (qua trung tuyến ứng cạnh huyền + hình bình hành $AMCQ$, $AMBK$) — cả hai đều đúng, cách của bản soạn sơ cấp hơn nên giữ.
- **Câu 24**: thuyền xuôi dòng, ca nô ngược dòng từ cùng một bến ⇒ đi về hai phía ⇒ khoảng cách là tổng hai quãng đường; một cách hiểu duy nhất, không cần `Chưa chắc`.
- **Phân loại**: `kho` đúng (Câu 10, 14–20, 23 = `hinh_hoc`; còn lại `dai`). `loai`: 21.1a, 21.1b, 22.1 đáp số là đa thức ⇒ `tu_luan`; 21.2 đáp số là số nguyên 1 ⇒ `tra_loi_ngan`; 23, 24 chung dữ kiện ⇒ không tách.
- **Hình**: `p2c17_lai.png` đúng hình Câu 17 (đủ $A$, $B$, $C$, $D$, kí hiệu $x$ ở đỉnh $A$ giữa $AB$ và $AC$, $60^\circ$ ở đỉnh $D$), không cụt, không dính chữ. `giai_cau23.png` (sau khi vẽ lại): tam giác vuông tại $A$ với $AB<AC$, $M$ trung điểm $BC$, $N$, $P$ là chân đường vuông góc tính bằng toạ độ, $Q$, $K$ lấy đối xứng qua $N$, $P$; gạch bằng nhau $MN=NQ$ (một gạch), $MP=PK$ (hai gạch), ba kí hiệu góc vuông đều là giả thiết; nhãn không đè, không cụt.
- **Định dạng**: dấu nhân `\cdot`, không `\times`; Phần 1 mỗi câu 3–4 bước, không lộ đáp số cuối; câu trắc nghiệm kết bằng `Chọn X.`.

## Câu còn `Chưa chắc` (gửi CEO)

- **Câu 21.2** — đề in "Tính nhanh: $2025^2+2026^2-2050\cdot 2026$". Bản đang dùng coi 2050 là gõ nhầm của 4050 ⇒ đáp số **1**. Nếu giữ đúng như in ⇒ đáp số **4 052 001** (khi đó câu phải chuyển sang `tu_luan` vì không vừa 4 ô, và lời giải đổi thành $(2026-2025)^2+2000\cdot2026$). Cần CEO chốt một trong hai.

Ghi nhận thêm (không phải `Chưa chắc`): Câu 10 — hình chữ nhật cũng là một hình thang cân nên phương án B không sai về mặt bao hàm, nhưng "là hình gì" thì A (hình chữ nhật) là câu trả lời đúng và đủ nhất; Câu 9 — $n=0$ cũng thoả nhưng không có trong phương án.
