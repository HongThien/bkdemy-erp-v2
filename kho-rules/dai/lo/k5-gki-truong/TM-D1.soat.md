KẾT LUẬN: ĐẠT

# TM-D1 — Biên bản soát (trạm kiểm Opus)

Tệp: `TM-D1.soan.md` (bản gốc trạm soạn: `TM-D1.soan.goc.md`). Mã luật dòng 1: `0d9cedba0342` = mã hiện hành.
Cổng: `dung-de-tu-soan.mjs … --khoi 5 --chi-kiem` ⇒ "✔ đạt cổng" (2 phần · 18 câu · 5 TN · 13 tự luận · 1 hình · 0 chưa chắc), chạy sau khi sửa.

## Đáp số: giải mù ↔ bản soạn

- Giải mù (Pha 1, `TM-D1.kiem.md`): 22 mục theo bản in = 18 câu của tệp soạn (Bài 1 và Bài 5 giữ một câu).
- Khớp 18/18 câu · lệch 0. Script `tam-kiem-TM-D1/kiem.mjs` 26 phép thử, 0 FAIL; `tam-kiem-TM-D1/goc.mjs` đếm góc trên toạ độ đọc từ hình: 2 góc bẹt, 5 góc tù (cùng số với bản soạn).
- Không có đáp án in ⇒ không có cột so với bản in.

## Pha 0 — đối chiếu đề với ảnh

- Bài, ý, phương án: đủ (Câu 1–7, Bài 1–5), không thừa. Trang 2 kết thúc ở Bài 5 — không có Bài 6 / "Câu 6" phần tự luận như brief batch dự kiến; ghi chú của trạm soạn về việc này đúng.
- Số, đơn vị, dấu phẩy: khớp ảnh ở cả 18 câu.
- Chỗ dựng lại vì cắt mép phải (đã phóng từ PDF gốc: chữ bị cắt ngay trong bản quét): Câu 3 "371 000 km" + phương án đều ghi km² ⇒ `km^2` hợp lý · Câu 5 "thôn Ki…" ⇒ "Kim Lư" không ảnh hưởng đáp số · Câu 6 "b[ạn]", "từ[ng]" · Câu 7.1 "ngà[y]", "sả[n]" · Câu 7.2 "ngà[y]". Mỗi câu có `**Ghi chú:**`. Hợp lý.
- Tách Câu 7 thành 7.1 / 7.2 / 7.3: đúng §A10 ("gom 2 bài toán khác hẳn ⇒ 4.1, 4.2"): ba bài độc lập (hai bài lời văn khác số liệu, một bài đếm góc trên hình); không phải dạng "nhiều ý cùng kiểu" mà mục khối 5 bảo giữ chung.
- Hình `TM-D1_c7_hinh.png | nguon=goc`: mở ảnh — sạch, đủ nhãn A B C D G H, không dính chữ câu khác, không vết viết tay ⇒ không có lỗi a–f, giữ `goc`.

## Bảng lỗi theo loại (số câu đã sửa)

| Loại | Số câu sửa | Câu | Nội dung |
|---|---|---|---|
| Chép đề | 0 | — | — |
| Đáp số | 0 | — | — |
| Lập luận | 0 | — | — |
| Phạm vi kiến thức | 1 | Câu 5 | Mấu chốt và Chú ý dùng biểu thức chữ "thế kỉ thứ $n$ … $(n-1)\times 100+1$ … $n\times 100$" (biểu thức chữ, ngoài cách viết Toán 5) ⇒ viết lại bằng lời, không lộ đáp số |
| Định dạng | 1 | Câu 7.3 | `**Ghi chú:**` có câu chuyện trạm "Đã đếm lại bằng toạ độ đo từ ảnh hình" (§A14) ⇒ xoá câu đó |
| Phân loại (loai, kho, tách ý) | 0 | — | Câu 6 (4 ô) và Câu 7.3 (2 ô) `tu_luan` đúng: đáp án nhiều số, không phải một số ≤ 4 ô; mục khối 5 "còn lại `tu_luan`". Câu 7.1, 7.2, Bài 2a–2d một số vẫn `tu_luan` theo mục khối 5 (giống ND-ON9) |
| Phân dạng | 0 | — | xem dưới |
| Hình | 0 | — | — |

Ký hiệu cấm (⇒ ⇔ ∈ ≤ ≥ \widehat \angle \cdot \frac): 0 chỗ. Phần 1 các câu 3–6 bước, không lộ đáp số.

## Phân dạng (so `ban-do-k5.md`)

- Giữ cả 18 dòng, hạ `chac` 0 câu.
- Câu 7.3 NDB02140 `cao`: mô tả dạng ghi đúng "đề cho hình vẽ … hỏi đếm số góc nhọn, góc vuông, góc tù"; NDB02676 là đếm miếng ghép, không hợp ⇒ giữ `cao`.
- Bài 4 NDB02080 `cao`: lời văn tiền, nhiều phép tính số tự nhiên; không có số thập phân nên không vào NDB02115 ⇒ giữ.
- Bài 2a–2d NDB02107 `cao`: đúng "một phép cộng hoặc một phép trừ, đặt tính rồi tính" ⇒ giữ.
- Câu 3 NDB02141 (đứng sau NDB02808, mô tả có "so sánh … diện tích địa danh") · Câu 7.1, 7.2 NDB02808 · Bài 3a, 3b NDB02111 (dạng thuận tiện STP duy nhất không hỗn số) · Câu 1 NDB02100 · Câu 2 NDB02106 · Câu 4 NDB02101: giữ `cao`.
- Câu 6, Bài 5 NDB02101 `vua`; Bài 1 NDB02102 `vua` (ý c thuộc NDB02103): giữ.

## Cờ `**Chưa chắc:**`

- Xoá 0 · thêm 0 (bản soạn không có cờ nào).
- Ghi cho người duyệt (mức `hoi`, không sửa): Câu 7.3 đáp số 5 góc tù là cách đếm MỌI góc tạo bởi hai tia của hình (tính cả góc ghép DGH, AGC); nếu trường chỉ đếm góc "đơn" thì 3. Lời giải liệt kê đủ từng góc nên giáo viên đối chiếu được.

## Đề xuất dạng mới của trạm soạn — "Thế kỉ và số La Mã" (Câu 5)

- Đồng ý để `dang=—`: câu hỏi xếp năm vào thế kỉ, không phải đổi số đo.
- Ghi chú người duyệt của trạm soạn ghi "dạng Đổi đơn vị đo thời gian không nói tới thế kỉ": đúng với NDB02129, nhưng NDB02139 "Đổi đơn vị đo lường" CÓ nêu "thế kỉ, năm" trong mô tả (chỉ cho phép đổi 1 thế kỉ = 100 năm) — người duyệt nên xem NDB02139 khi quyết đề xuất. Mới có 1 câu làm chứng trong lô này.

## Các mức chỉ báo (không sửa)

- `hoi`: Câu 3, Bài 4 đề viết số có dấu cách hàng nghìn ngoài `$…$` ("1 830 000 ha", "8 200 đồng") theo bản in; trong công thức đã viết liền.
