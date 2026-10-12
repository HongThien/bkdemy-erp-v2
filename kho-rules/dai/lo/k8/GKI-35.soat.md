KẾT LUẬN: ĐẠT

# GKI-35 — biên bản soát (THCS Bát Tràng, đề 2 — giữa học kì 1 Toán 8, 2025–2026)

- Số câu: **21** (12 trắc nghiệm · 3 trả lời ngắn · 6 tự luận). Đề không in đáp án ⇒ hai nguồn: bản soạn + lượt giải mù (`GKI-35.kiem.md`, máy kiểm `tam/soat-pha1.mjs`).
- Khớp đáp án Pha 1 ngay từ đầu: **21 / 21**.
- Số câu phải sửa: **4** (không câu nào sai đáp số, không câu nào chép sai đề). Bản trước khi sửa: `GKI-35.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng.

## Đã soát gì

- **Đề:** đối chiếu từng câu với ảnh trang; các chỗ trạm soạn báo bản máy gõ sai (Câu 5, Câu 6, Bài 1, Bài 2c) + Câu 2–4, Bài 2, Bài 6 đọc lại trên ảnh cắt 300 dpi — bản soạn chép đúng hết (số mũ, dấu, phương án, đủ ý).
- **Đáp án:** 21 câu trùng lượt giải mù; mọi câu Đại thay 5 bộ số phân số (BigInt), Bài 6 tính thẳng bằng BigInt với $x=2025$ ra $1$, Bài 5 kiểm toạ độ 2 bộ.
- **Kiến thức:** đề chạm Chương I + Chương III tới hình thoi, hình vuông (Câu 9–12) ⇒ hình chữ nhật được dùng. Bài 5 không dùng đường trung bình, kể cả ngầm: $ME\parallel AB$ lấy từ hình chữ nhật $ADME$, $ME=DB$ từ $\triangle BDM=\triangle MEC$ (cạnh huyền – góc nhọn); ý a đi qua tổng góc $360^\circ$ + định nghĩa, không dùng "ba góc vuông" làm dấu hiệu. Bài 2b nhân đa thức với đa thức, không dùng hằng đẳng thức. Bài 6 chỉ thay $2026=x+1$ rồi bỏ ngoặc.
- **Phân loại:** `kho` đúng (Câu 7–12, Bài 5 = `hinh_hoc`; Bài 4 bối cảnh mảnh vườn = `dai`). Bài 2 là vỏ gom ba bài toán khác dữ kiện ⇒ tách 2a / 2b / 2c đúng; Bài 3 (Tìm $x$) tách đúng; Bài 1 (ý b dùng ý a) và Bài 5 (hình) giữ chung đúng. Trả lời ngắn: Bài 3a ($3$), 3b ($-4$), Bài 6 ($1$) — đều là một số nguyên theo đúng dạng đề hỏi.
- **Hình:** `p2c4_1.png` đúng hình Bài 4, không cụt. `giai_bai5.png`: dựng đúng dữ kiện ($AB<AC$, $M$ trung điểm $BC$, $D$, $E$ là chân đường vuông góc, $E$ trung điểm $MK$, $I=AM\cap DE$), đủ 8 điểm, chỉ đánh dấu giả thiết (ba góc vuông, $BM=MC$, $ME=EK$), không vẽ $BK$ (điều phải chứng minh), nhãn không đè — không phải sửa.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 1 | kiến thức (từ ngữ) | Phần 1 Bước 3: "biến có nằm ở mẫu của một phân thức" → "có biến nào nằm ở mẫu (phép chia cho biến)" | "Phân thức" là Chương VI, học sau giữa kì 1 |
| Câu 5 | định dạng | Phần 2: tách chuỗi hai dấu "=" trên một dòng thành ba dòng | Luật mỗi bước biến đổi một dòng |
| Câu 11 | ghi chú (Chưa chắc) + lập luận | Xoá dòng `Chưa chắc`; Phần 2 ý B nói rõ hai góc kề đáy $AB$ không bằng nhau, tương tự với đáy $CD$ | Đã phân xử chắc chắn: chỉ B sai theo định nghĩa SGK (xem dưới). Hình thang cân xét "một đáy" bất kì nên phải loại cả hai đáy |
| Bài 5 | ghi chú | Bỏ dòng `**Ghi chú:**` ở câu, chuyển nội dung xuống mục GHI CHÚ CHO NGƯỜI DUYỆT | Dòng Ghi chú của câu chỉ dành cho lỗi đề gốc; đây là lời bàn về cách giải |

## Phân xử các chỗ được giao

- **Câu 11** (dòng `Chưa chắc` của trạm soạn — đã xoá): SGK định nghĩa hình thang là tứ giác có hai cạnh đối song song, hình thang cân là hình thang có hai góc kề một đáy bằng nhau. A = dấu hiệu nhận biết; D = định nghĩa; C: "tứ giác có hai cạnh đối song song" chính là hình thang, thêm hai đường chéo bằng nhau ⇒ quy về A, đúng; B có phản ví dụ là hình bình hành không phải hình chữ nhật (hai cạnh bên bằng nhau, hai góc kề mỗi đáy bù nhau mà không bằng nhau). Đúng một phương án sai ⇒ **B**, hai lượt giải độc lập trùng nhau.
- **Bài 6** (dấu "…"): hai đầu dãy in trong đề ($-2026x^9+2026x^8-2026x^7$ và $-2026x^3+2026x^2-2026x+2026$) cùng một quy luật — hệ số $2026$, dấu trừ ở luỹ thừa lẻ, dấu cộng ở luỹ thừa chẵn — nên phần bị lược chỉ có một cách điền. $M=1$ (máy tính thẳng). Không cần `Chưa chắc`.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
