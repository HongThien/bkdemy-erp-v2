KẾT LUẬN: ĐẠT

# GKI-05 — Biên bản soát (trạm soát, 10/10)

> Đề: THCS Thanh Quan — Giữa học kì I, Toán 6, 2024–2025, ĐỀ 1 (2 trang, không có phần tiếng Anh "Hệ T").
> Pha 1 giải mù: `GKI-05.kiem.md` (ghi xong trước khi mở bản soạn). Bản soạn nguyên gốc: `GKI-05.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (2 phần · 18 câu: 8 TN · 5 TLN · 5 tự luận · HGT 5 · hình 4 · chưa chắc 0).

## Số liệu

- Số câu: **18** (Câu 1–8; Bài 1a, 1b, 1c; Bài 2a, 2b, 2c, 2d; Bài 3; Bài 4; Bài 5).
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **18 / 18** (đã tính lại bằng `node -e`).
- Số câu phải sửa: **4 / 18** (Câu 4, 5, 8, Bài 2d) — đều ở Phần 1 (lời hướng dẫn), **không câu nào sai đề, sai đáp số hay sai Phần 2**. Ngoài ra sửa tên đề và mục ghi chú cuối tệp.

## Đã soát, không phải sửa

- **Chép đề:** 18 / 18 khớp ảnh trang (số mũ Câu 2, Bài 1c $5^{11}$, $5^{12}$, Bài 2b $7^2$; gạch ngang $\overline{28x0}$; đủ 4 phương án mọi câu TN; đủ ý a) b) c) Bài 4).
- **Phân loại:** `kho=hgt` cho Câu 5, 6, 7, 8 và Bài 4 (hình / chu vi / diện tích) — đúng; còn lại `dai`. `tra_loi_ngan` cho 1a (8700), 1b (1600), 1c (14), 2a (88), 2b (8) — đều một số ≤ 4 ô; 2c (hai giá trị), 2d (ba giá trị) để `tu_luan` — đúng. Tách ý chỉ ở Bài 1 (Tính) và Bài 2 (Tìm $x$); Bài 3, 4, 5 giữ chung — đúng luật.
- **Kiến thức:** không chuyển vế (2a, 2b tìm thành phần chưa biết đúng khuôn NNB00894 / NNB00901); Bài 1c không dùng luỹ thừa của luỹ thừa (đổi $25=5^2$ rồi nhân / chia cùng cơ số); Bài 2d chỉ dùng dấu hiệu chia hết cho 3; Bài 5 nhóm hai số hạng, đặt thừa số chung (khuôn NNB00913).
- **Hình:** `p1c5_lai.png` (4 hình (1)–(4), đủ nhãn), `p1c7_1.png` (tam giác đều), `p1c7_2.png` (hình chữ L đủ 4 số đo và 6 tên đỉnh), `p2c4_1.png` (vườn 20 m × 5 m, ô "Trồng hoa") — đúng câu, không cụt, không dính chữ câu khác.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Tên đề (dòng `# ĐỀ`) | định dạng | Bỏ "tổ Tự nhiên" ⇒ "THCS Thanh Quan (đề 1, kiểm tra ngày 31/10/2024)" | "Tổ Tự nhiên" là tổ bộ môn, không phải địa danh; khuôn tên đề là trường + quận / phường. Đề không in quận nên không tự thêm |
| Câu 4 | lập luận (Phần 1) | Bước 2: "để được một số tròn nghìn" ⇒ "$359+251$ cho số tròn chục nên tổng hai món là số tròn chục nghìn". Chú ý: "sai một hàng nghìn là chọn nhầm" ⇒ "bốn phương án hơn kém nhau 10 000 đồng nên lệch một đơn vị ở hàng chục nghìn là chọn nhầm" | Cả ba giá đã là số tròn nghìn sẵn nên lí do cũ vô nghĩa; bốn phương án cách nhau 10 000 chứ không phải 1 000 |
| Câu 5 | lập luận (Phần 1) | Bước 1: '"đều" nghĩa là các cạnh có kí hiệu gạch bằng nhau' ⇒ '"đều" nghĩa là 6 cạnh bằng nhau và 6 góc bằng nhau; trên hình, các cạnh bằng nhau được đánh dấu bằng vạch gạch giống nhau' | Câu cũ lẫn định nghĩa với kí hiệu vẽ hình |
| Câu 8 | lập luận (Phần 1) | Bước 3 viết lại: "$MF$ dài bằng tổng hai cạnh thẳng đứng bên phải là $NP$ và $KE$, nên lấy $MF$ trừ đi $NP$". Chú ý: thay câu "không tính đoạn nào nằm bên trong" (hình không có đoạn nào bên trong) bằng bẫy thật: bỏ sót $KE$ ra 92 (phương án A) | Câu cũ khó hiểu ("gồm đoạn $NP$ cùng độ cao với phần bên phải"); chú ý cũ không ứng với hình. Đã kiểm: $104-12=92$ |
| Bài 2d | lập luận (Phần 1) | Dòng "Thử lại" bổ sung đủ ba giá trị: $2820:3=940$; $2850:3=950$; $2880:3=960$ | Đáp án có ba giá trị, bản soạn chỉ thử một |
| Mục `## GHI CHÚ CHO NGƯỜI DUYỆT` | định dạng | Xoá dòng "Bản máy gõ lại (`de.json`) sai số mũ…"; rút dòng Câu 5 còn "dùng một ảnh chung `p1c5_lai.png`"; dòng Câu 8 thêm ý "hình không đánh dấu góc vuông" | Lỗi công cụ không ghi vào bản soạn (báo ở dưới) |

## Lỗi công cụ (không phải lỗi đề gốc — báo để sửa máy bóc)

- `de.json` mất số mũ: Bài 1c ghi $5^1$, $5^2$ thay vì $5^{11}$, $5^{12}$; Bài 2b ghi "72" thay vì $7^2$.
- Câu 5: máy cắt hình thành 4 ảnh nhỏ `p1c5_1…4` thứ tự không theo (1)(2)(3)(4); trạm soạn đã cắt lại `p1c5_lai.png`.
- Trong `<LV>\img\` còn tệp thừa `_zoom_b1.png` (ảnh phóng to của trạm soạn) — không câu nào trỏ tới, chưa xoá.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

Điều người duyệt nên biết (không tới mức "chưa chắc"):

- **Câu 8:** hình chữ L không đánh dấu góc vuông; lời giải hiểu các cạnh ngang / dọc vuông góc với nhau — cách hiểu duy nhất cho ra một phương án (104 cm = B).
- **Bài 2d:** đề ghi "tìm số tự nhiên $x$" trong khi $x$ là chữ số của $\overline{28x0}$; đáp án $x\in\{2;5;8\}$ (câu giữ dòng `Ghi chú`).
- **Bài 4b:** cạnh hình vuông trồng hoa (5 m) không ghi bằng chữ trong đề, đọc từ hình (hình vuông cao bằng chiều rộng vườn).
