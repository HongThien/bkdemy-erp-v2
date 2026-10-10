KẾT LUẬN: ĐẠT

# GKI-04 — Biên bản soát (THCS Vạn Phúc, Hà Đông — giữa kì 1 Toán 8, 2024–2025; đề scan 1 trang, 7 bài tự luận)

- Số câu sau khi tách ý: **9** (Bài 1, 2, 3, 4a, 4b, 5a, 5b, 6, 7) — 2 trả lời ngắn, 7 tự luận; 8 câu `dai`, 1 câu `hinh_hoc`.
- Khớp đáp án Pha 1 (giải mù, `GKI-04.kiem.md`) ngay từ đầu: **9 / 9**.
- Số câu phải sửa: **3** (Bài 1 — bỏ dòng Chưa chắc; Bài 6 — hình giải; Bài 7 — kiến thức). Không câu nào sai đề, sai đáp số hay sai lập luận.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng (9 câu · 0 TN · 2 TLN · 7 tự luận · chưa chắc 0).
- Bản trước khi sửa: `GKI-04.soan.goc.md` (hình: `<LV>\tam\ve.goc.mjs`).

## Cách soát

- Pha 1: đọc `trang/p-1.png`, cắt phóng to 300 dpi cả trang thành 3 dải + 600 dpi cho Bài 3, Bài 4 (số mũ nhỏ) — `tam/s_b12.png`, `s_b34.png`, `s_b567.png`, `s_b3z.png`, `s_b4z.png`.
  Máy kiểm `tam/s_kiem.mjs`: mọi đẳng thức đa thức thay 8 bộ phân số ngẫu nhiên (số học chính xác), tìm $x$ thay ngược vào đề, Bài 6 dựng toạ độ
  (bốn cạnh $ABDE$ bằng nhau, $E, D, C$ thẳng hàng, $EB=AC$) — tất cả khớp.
- Pha 2: so từng câu của bản soạn với ảnh (số, số mũ, dấu, tên điểm, đủ ý) — **đề chép đúng 9 / 9**; đọc từng dòng lời giải theo luật kiến thức `k8.md` §1, §10.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1 | định dạng (dòng Chưa chắc thừa) | Xoá dòng `**Chưa chắc:**` của trạm soạn ("nếu đề gốc là $3xy^4z^3$…"); chuyển thành một dòng giải thích ở mục GHI CHÚ CHO NGƯỜI DUYỆT | Phóng to 300 dpi: số 4 in cùng cỡ, cùng dòng chân với $x$, $y$, $z$, còn số mũ 3 của $z$ thì nhỏ và nhô cao rõ ⇒ đề in đúng là $3xy4z^3$ (đơn thức chưa thu gọn — kiểu câu hỏi chuẩn, đi cặp với ý a đã thu gọn). Đã kiểm chắc nên bỏ |
| Bài 6 | hình | Vẽ lại `giai_bai6.png`: nhãn $60^\circ$ thu cỡ chữ 20 và dời vào giữa $AB$ – $AC$; canvas $380\times 450$, dịch hình lên 8px | Bản cũ nhãn $60^\circ$ (cỡ 26) đè lên cạnh $AB$; dưới nhãn $E$ chỉ còn khoảng 26px (luật ≥ 35px). Dữ kiện, điểm, dấu giả thiết của hình vốn đã đúng (không đánh dấu $AE$, $DE$ — điều phải chứng minh) |
| Bài 7 | kiến thức | Bỏ dòng `$=5(2n+2)$`; kết luận bằng "$10n$ chia hết cho 5, 10 chia hết cho 5 ⇒ $10n+10$ chia hết cho 5 (tính chất chia hết của một tổng)". Sửa Mấu chốt, Bước 3, Chú ý của Phần 1 cho khớp | Đề không có câu nào về phân tích đa thức thành nhân tử ⇒ đặt nhân tử chung là kiến thức học sau (k8.md §10; đề mẫu GKI-01 Câu 13 xử lí đúng như vậy). Đáp số / kết luận không đổi |

## Đã soát, không sửa (ghi để người duyệt biết)

- **Bài 6 — luật kiến thức:** lời giải chỉ dùng: tam giác cân có một góc $60^\circ$ là tam giác đều, hai tam giác vuông bằng nhau (cạnh huyền – cạnh góc vuông), dấu hiệu hình bình hành
  (hai đường chéo cắt nhau tại trung điểm), dấu hiệu hình thoi (hình bình hành có hai đường chéo vuông góc), tiên đề Euclid, tính chất đường chéo hình thoi là phân giác,
  tổng các góc tứ giác, c.g.c. Không đường trung bình, không Pythagore, không dùng ngầm. Đề có hỏi hình thoi nên được dùng Chương III tới Bài 5.
  Phần 1 đi đúng chiều phân tích đi lên (5 bước), Phần 2 đi ngược lại, khớp từng mắt xích.
- **Bài 6 — dòng `Ghi chú`:** giữ (báo người duyệt biết lời dẫn "Chứng minh rằng:" được kéo lên chung cho cả ba ý; đề gốc chỉ ghi ở ý a).
- **Bài 1, Bài 3 không tách ý:** đúng luật (chỉ tách bài Tính / Rút gọn / Phân tích nhân tử / Tìm $x$); Bài 4, Bài 5 tách ý đúng.
- **Bài 3:** đề gốc đánh số "1) Tìm đa thức A, D biết" nhưng không có mục 2) — bản soạn bỏ chữ "1)", đã ghi ở GHI CHÚ CHO NGƯỜI DUYỆT.
- **Phân loại trả lời ngắn:** Bài 2 (đáp số 3) và Bài 5b ($x=2$) là số nguyên ⇒ `tra_loi_ngan`; Bài 5a ($x=\dfrac{1}{2}$) là phân số ⇒ `tu_luan` — đúng luật.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
