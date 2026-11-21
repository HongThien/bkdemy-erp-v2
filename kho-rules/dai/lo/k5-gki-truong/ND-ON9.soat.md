KẾT LUẬN: ĐẠT

# Biên bản soát ND-ON9 (Đề ôn tập số 9 — TH Nguyễn Du) · luật 0d9cedba0342

- Mã luật dòng 1 tệp soạn: `0d9cedba0342` = mã hiện hành.
- Bản gốc trước khi sửa: `ND-ON9.soan.goc.md`.
- Giải mù (Pha 1): 18/18 câu (8 câu trắc nghiệm / Đúng-Sai + 10 câu tự luận sau tách ý), script `tam-kiem-ND-ON9/kiem.mjs` 21 phép thử, 0 FAIL.
- Đối chiếu đáp số giải mù ↔ bản soạn: **18 khớp / 0 lệch**. Không có đáp án in kèm (đề ôn).
- Cổng `dung-de-tu-soan.mjs --khoi 5 --chi-kiem` sau khi sửa: ✔ đạt cổng (2 phần · 18 câu · 7 TN · 11 tự luận · chưa chắc 0).

## Pha 0 — đối chiếu đề với ảnh

- Số bài / ý / phương án: Câu 1–8 đủ, mỗi câu TN đủ 4 phương án; Câu 8 đủ 4 ý a–d; Bài 1 (4 ý), Bài 2 (4 ý), Bài 3 (2 ý), Bài 4 (2 ý), Bài 5 (2 ý) đủ. Không sót, không thừa.
- Chép số: 12 005 000 · 47,08 · bốn dãy Câu 4 · 128,64 · 7 kg 50 g · bốn mệnh đề Câu 8 · các phân số, hỗn số $2\dfrac{1}{4}$ Bài 1 · Bài 2 · 250 × 47 × 4 · $\dfrac{7}{8}\times\dfrac{5}{11}+\dfrac{7}{8}\times\dfrac{6}{11}$ · 3 tấn 600 kg, $\dfrac{1}{3}$, $\dfrac{1}{4}$ · 0,9; 1,5; 13,99; 14,01: khớp ảnh.
- Nhãn giữ đúng bản in (Câu 1–8, Bài 1a–1d, Bài 2, Bài 3a–3b, Bài 4, Bài 5a–5b).
- Câu 1: tệp viết `$12005000$` liền — đúng §A5 ("số không chèn dấu cách hàng nghìn"); giữ nguyên, giữ dòng Ghi chú nêu cách in gốc.
- Câu 8: `loai=tu_luan`, `dap_an=ĐSĐĐ`, `dang=—`, `chac=—`, có Ghi chú "câu Đúng/Sai nhập dạng tự luận" — đúng mục khối 5 và brief batch.

## Bảng lỗi theo loại (số câu đã sửa)

| Loại | Số câu sửa | Câu |
|---|---|---|
| Chép đề | 0 | — |
| Đáp số | 0 | — |
| Lập luận | 1 | Bài 5a — `**Chú ý:**` Phần 1 ghi "chỉ cần so sánh phần nguyên với hai số đã cho" là sai (x = 1 và 1,5 cùng phần nguyên 1, phải so tiếp phần thập phân); thay bằng lời dặn đúng (đề hỏi số tự nhiên nên không lấy 1,2; 1,4…) |
| Phạm vi kiến thức | 0 | không có gọi ẩn, chuyển vế, ⇒ ⇔ ∈ ≤ ≥, \widehat |
| Định dạng | 0 | không \frac, \cdot, \text; card 3–4 bước, không lộ đáp số cuối |
| Phân loại (loai, kho, tách ý) | 0 | tách 1a–1d, 3a–3b, 5a–5b đúng mục khối 5; Bài 2, Bài 4 giữ một câu |
| Hình | 0 | đề không có hình mang số liệu |
| Phân dạng (`dang`/`chac`) | 0 | xem dưới |

Báo không sửa (mức):
- `hoi` — Bài 4 `dap_an=—`: bài lời văn hai ý, hai đáp số (1200 kg; 1,8 tấn). Mục khối 5 chỉ đòi `dap_an` khi có MỘT kết quả gọn nên giữ `—`; nếu trưởng khối muốn ghi `a) 1200 kg; b) 1,8 tấn` như khuôn 5T thì sửa ở lô mẫu.
- `nen_sua` — Bài 2a Phần 2 "$\dfrac{1}{4}$ giờ $=60:4=15$ phút": dòng trộn đơn vị giờ với phép tính số phút; có thể viết "$\dfrac{1}{4}$ giờ $=60\times\dfrac{1}{4}$ phút $=15$ phút". Không sai đáp số, để người duyệt mẫu quyết.

## Phân dạng — soát với `ban-do-k5.md`

| Câu | dang / chac | Nhận xét |
|---|---|---|
| Câu 1 | NDB02072 / vua | giữ — đếm chữ số 0 dùng bảng hàng–lớp, mô tả dạng hỏi hàng/lớp, chưa khớp thẳng |
| Câu 2 | NDB02090 / cao | giữ — đúng mô tả "hỏi phân số nào là phân số thập phân" |
| Câu 3 | NDB02106 / cao | giữ — mô tả có "hỏi phần nguyên" |
| Câu 4 | NDB02101 / cao | giữ |
| Câu 5 | NDB02140 / vua | giữ — đề không có hình, dạng mô tả đếm trên hình |
| Câu 6 | NDB02104 / cao | giữ |
| Câu 7 | NDB02102 / cao | giữ — khối lượng hai tên đơn vị viết thành STP |
| Câu 8 | — / — | đúng luật Đúng/Sai khối 5 thường |
| Bài 1a, 1c, 1d | NDB02085 / cao | giữ — một phép tính giữa phân số (hoặc số tự nhiên) |
| Bài 1b | NDB02094 / vua | giữ — hỗn số trừ phân số, mô tả dạng là hai hỗn số; NDB02085 cũng hợp |
| Bài 2 | NDB02102 / vua | giữ — các ý rải NDB02139 (giờ–phút), NDB02102 (m, tạ), NDB02103/NDB02141 (m² → ha) |
| Bài 3a | — / — | giữ — NDB02078 chỉ cộng trừ, NDB02079 là tổng tích, NDB02111 đòi số thập phân |
| Bài 3b | NDB02088 / cao | giữ |
| Bài 4 | NDB02808 / cao | giữ — hai tên đơn vị (3 tấn 600 kg) + tìm phân số của một số, đúng mô tả; NDB02089 cũng hợp nhưng đứng trước ⇒ dạng sau thắng, vẫn cao; NDB02115 không hợp (số liệu không là STP) |
| Bài 5a, 5b | NDB02101 / vua | giữ — mô tả dạng có "tìm các số thập phân nằm giữa hai số cho trước", đề tìm số tự nhiên |

Số câu hạ `chac`: 0. Không có gán sai ở mức `cao`.

## Cờ `**Chưa chắc:**`

- Xoá: 0 (bản soạn không có cờ).
- Thêm: 0.

## Nhận xét hai "đề xuất dạng mới" của trạm soạn

1. **"Tính thuận tiện dạng tích với số tự nhiên (giao hoán – kết hợp ghép cặp cho tích tròn)"** — câu làm chứng Bài 3a. Đồng ý có lỗ: bản đồ khối 5 có NDB02078 (tổng), NDB02079 (tổng tích, hiệu tích) cho số tự nhiên, còn kiểu "ghép 250 × 4, 25 × 4, 125 × 8" chỉ có ở NDB02111 cho số thập phân. Kiểu bài này rất hay gặp ở đề giữa kì I (ôn tập lớp 4) ⇒ đề xuất hợp lý; phương án nhẹ hơn: nới mô tả NDB02078 thành "tổng hoặc tích nhiều số tự nhiên". Mới một câu làm chứng — chờ thêm câu từ TM-D1 / lô sau.
2. **"Tìm số tự nhiên (hoặc chữ số) thoả mãn bất đẳng thức với số thập phân"** — chưa cần dạng mới: mô tả NDB02101 đã có "tìm các số thập phân nằm giữa hai số cho trước", Bài 5 chỉ khác ở chỗ số cần tìm là số tự nhiên. Đề xuất nhẹ hơn: thêm vào mô tả NDB02101 "hoặc số tự nhiên" (khi đó Bài 5 lên `cao`). Tên đề xuất dùng chữ "bất đẳng thức" là thuật ngữ trên lớp 5 — nếu lập dạng nên gọi "Tìm số tự nhiên nằm giữa hai số thập phân".
