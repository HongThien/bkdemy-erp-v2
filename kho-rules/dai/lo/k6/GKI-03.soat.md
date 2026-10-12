KẾT LUẬN: ĐẠT

# GKI-03 — biên bản SOÁT (trạm soát, 10/10)

> Đề: THCS Nguyễn Công Trứ, quận Ba Đình — giữa học kì 1 Toán 6, 2024–2025, kiểm tra ngày 28/10/2024 (2 trang, không có phần tiếng Anh, không in mã đề).
> Pha 1 giải mù: `GKI-03.kiem.md` (ghi trước khi mở bản soạn). Bản soạn trước khi sửa: `GKI-03.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (19 câu: 8 TN · 7 TLN · 4 tự luận · HGT 3 · hình 3 · chưa chắc 1).

## Số liệu

- Số câu: **19** (Câu 1–8; Bài 1a–1c; Bài 2a–2b; Bài 3a–3c; Bài 4; Bài 5; Bài 6). Không sót, không thừa câu; không bỏ câu nào.
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **19 / 19** (15 câu có `dap_an` trùng từng chữ / từng số; 4 câu tự luận — Bài 3c tập $\{1;2;3;5;6\}$, Bài 4 gồm 420000 đồng · 13000 đồng, Bài 5 gồm 77 m$^2$ · 59 m$^2$ · 236 viên, Bài 6 "hợp số" vì chia hết cho 3 — trùng kết quả). Mọi phép tính đã chạy lại bằng `node -e`.
- Số câu phải sửa: **6 / 19** (Câu 1, Câu 4, Câu 8, Bài 1b, Bài 4, Bài 5) — không câu nào đổi đáp số; 1 câu sửa chép đề (cách viết số tiền), còn lại là lời giải / dòng ghi chú. Bài 6 chỉ viết lại dòng `Chưa chắc` cho rõ (không tính là sửa).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 1 | lập luận (Phần 1) | Bước 1 "Đọc kĩ các phần tử của tập hợp $A$…" ⇒ "Xác định các phần tử của tập hợp $A$: đó là năm số được liệt kê trong ngoặc nhọn." | Brief soạn cấm bước kiểu "Đọc kĩ đề"; đổi thành thao tác thật |
| Câu 4 | lập luận | Chú ý "1 và 2 nhỏ hơn 4 nên không thể là bội của 4 (trừ số 0)" ⇒ "bội khác 0 của 4 thì không nhỏ hơn 4, nên 1 và 2 không thể là bội của 4". Phần 2: liệt kê $\text{B}(4)$ tới 16; dòng kết ⇒ "Trong các số $1;2;8;15$ chỉ có 8 là bội của 4 (vì $8=4.2$)." | Câu "(trừ số 0)" viết tối nghĩa (đọc thành "1 và 2 … trừ số 0"). Danh sách bội dừng ở 12 thì chưa thấy 15 bị loại; bản cũ chỉ loại 15, không nói 1 và 2 |
| Câu 8 | định dạng (dòng `Chưa chắc`) + lập luận | Xoá `**Chưa chắc:**` của trạm soạn, chuyển thành `**Ghi chú:**`. Phần 2 thêm dòng mở "Hình đã cho là hình lục giác đều $ABCDEG$." | Đã kiểm chắc chắn: hình (`p1c7_2.png`) có sáu cạnh đánh dấu bằng nhau, ba đường chéo $AD$, $BE$, $CG$ đồng quy tại $O$ — đúng hình lục giác đều của SGK KNTT (đỉnh thứ sáu gọi là $G$). Trong 4 phương án chỉ $CG$ là đường chéo chính; $AE$, $AC$, $BD$ đều nối hai đỉnh cách nhau một đỉnh. Pha 1 giải mù cũng ra D. Lời giải phải nói rõ căn cứ "lục giác đều" lấy từ hình |
| Bài 1b | định dạng (dòng `Ghi chú`) | Xoá dòng `**Ghi chú:** Bản máy gõ nhầm thành "$3^8$"…` | `Ghi chú` chỉ dành cho lỗi của đề gốc; đây là lỗi công cụ bóc. Đề trên ảnh rõ ràng là $38-8.(6-4)^2$, bản soạn chép đúng |
| Bài 4 | chép đề | Số tiền trong lời đề: "500000 / 16000 / 10000 / 67000 đồng" ⇒ "500 000 / 16 000 / 10 000 / 67 000 đồng" | Đề chép nguyên văn như ảnh và như mẫu GKI-01 (Câu 5, Bài 3 giữ dấu cách hàng nghìn trong lời đề); luật "viết liền" chỉ áp cho số trong công thức — Phần 2 giữ `$16000.20$` |
| Bài 5 | lập luận | Phần 2 ý 1), dòng vẽ $BC$: thêm "(điểm $C$ nằm cùng phía với điểm $D$ so với đường thẳng $AB$)" | Thiếu điều kiện này thì $C$ có thể nằm khác phía với $D$, nối $D$ với $C$ không ra hình vuông |
| Cuối tệp | định dạng | Mục "GHI CHÚ CHO NGƯỜI DUYỆT": bỏ dòng kể lỗi bản máy gõ, thay bằng dòng nói tệp hình nào thuộc câu nào | Lỗi công cụ báo ở biên bản này (mục dưới), không để trong tệp soạn |

## Đã soát, không sửa (ghi để người duyệt biết)

- **Chép đề**: 19 câu đối chiếu ảnh — đúng số, số mũ ($7.7^5$, $x^3$, $(6-4)^2$, $3^2$, $2025^0$, $2^3.5$, $p^2$), gạch ngang $\overline{75x}$, đủ 4 phương án, đủ ý. Hai `Ghi chú` về lỗi in của đề gốc là đúng: Câu 7 "minh hoa" ⇒ "minh hoạ"; Bài 6 "Vì sao" thiếu dấu hỏi. Câu 8 đề gọi $AD$ là "cạnh" (thật ra là đường chéo) — chữ của đề gốc, giữ nguyên.
- **Kiến thức**: không chuyển vế (Bài 3a tìm số hạng, 3b tìm số trừ rồi thừa số); chỉ dùng dấu hiệu chia hết cho 2 và 5 (Câu 5); luỹ thừa cùng cơ số, $a^0=1$; Bài 2 đúng khuôn tính thuận tiện (gom cặp tròn trăm; $a.b+a=a.b+a.1$). Bài 5c đổi sang $cm^2$ nên không cần số thập phân.
- **Phân loại**: `kho=hgt` cho Câu 7, Câu 8, Bài 5; còn lại `dai`. Bài 3c đáp số là tập 5 số ⇒ `tu_luan`; 7 ý Tính / Tìm $x$ còn lại đáp số ≤ 4 chữ số ⇒ `tra_loi_ngan`. Chỉ Bài 1, 2 (Tính) và Bài 3 (Tìm $x$) được tách ý; Bài 4, Bài 5 giữ chung (Bài 5 gồm ý 1 vẽ hình + ý 2 a b c).
- **Hình**: `p1c7_1.png` (logo Mitsubishi, đủ) cho Câu 7; `p1c7_2.png` (lục giác $ABCDEG$ tâm $O$, đủ nhãn và dấu gạch) cho Câu 8 — tên tệp mang số câu 7 nhưng đúng hình Câu 8; `p2c8_1.png` (mảnh đất 11 m × 7 m, phần kẻ sọc 6 m × 3 m, đủ số đo) cho Bài 5. Không hình nào cụt.
- **Bài 6**: soát từng dòng — $2025=3.675$, $2028=3.676$; hai trường hợp $p=3k+1$, $p=3k+2$ biến đổi đúng bằng tính chất phân phối, không dùng bình phương của tổng; kết luận "chia hết cho 3 và lớn hơn 3 nên là hợp số" đúng. Pha 1 ra cùng kết luận (còn một cách khác: $p^2+2024=(p-1).(p+1)+2025$).
- **Lỗi công cụ bóc** (trạm soạn đã tự sửa đúng, không nằm trong tệp soạn nữa): bản máy gõ Bài 1b thành "$3^8$"; gắn hình `p2c8_1` vào Bài 3c thay vì Bài 5; không gắn hình cho Câu 8.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 6** — đáp số và phép tính đã chắc (hai trạm khớp). Điều cần CEO quyết là **khuôn trình bày**: lời giải viết $p=3k+1$ / $p=3k+2$ (số dư khi chia cho 3) + tính chất phân phối, trong khi nhóm "chia có dư" và "Nâng cao" trên bản đồ K6 chưa có lý thuyết (`k6.md` §1 luật 3). Trạm soát không tự phán được khuôn này có được chấp nhận hay không.

(Một điểm để CEO biết, không phải nghi ngờ đáp số: **Bài 5 ý 2b, 2c** phụ thuộc vào hình — kích thước phần trồng hoa 6 m × 3 m chỉ có trên `p2c8_1.png`; và ý 1 "Vẽ hình vuông" lời giải chưa có hình vẽ, đã có `Ghi chú`.)
