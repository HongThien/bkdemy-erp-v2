KẾT LUẬN: ĐẠT

# GKI-03 — biên bản soát (trạm soát, giải mù 2 pha)

- Đề: THCS Ba Đình, quận Ba Đình (Hà Nội) — giữa học kì I 2024–2025, 1 trang, 6 bài tự luận, ảnh SCAN. Đã cắt phóng to 300 dpi cả ba vùng của trang (`<LV>\tam\s_a.png`, `s_b.png`, `s_c.png`) để đọc số mũ, dấu, kích thước trên hình.
- **Số câu:** 10 (2 trả lời ngắn · 8 tự luận; Bài 2 tách 2a, 2b, 2c · Bài 3 tách 3a, 3b, 3c · Bài 1, 4, 5, 6 giữ chung).
- **Khớp đáp án Pha 1 ngay từ đầu:** 10 / 10 (bảng giải mù: `GKI-03.kiem.md`; máy kiểm `<LV>\tam\s_kiem.mjs` — phân số chính xác, 6 bộ số cho đa thức, thay ngược nghiệm + dò nghiệm lạ cho Bài 3, toạ độ 3 bộ cho Bài 5).
- **Số câu phải sửa:** 4 (Bài 1, Bài 3b, Bài 5, Bài 6) + tên đề + mục ghi chú cuối tệp + canvas hình giải. **Không câu nào sai đề, sai đáp án, sai lập luận toán.** Bản trước khi sửa: `GKI-03.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng (sau khi sửa).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 3b | kiến thức | Phần 1, `Mấu chốt`: "còn lại phương trình bậc nhất" → "còn lại đẳng thức chỉ chứa $x$ với số mũ 1" | k8.md §1.2 / §10: bài Tìm $x$ giữa kì 1 không gọi là "phương trình" (Chương VII, học kì 2) |
| Bài 1 | lập luận | Phần 1, `Chú ý`: bỏ vế "biến chỉ có ở một đơn thức vẫn giữ nguyên số mũ", viết lại thành "hệ số thì nhân (không cộng), số mũ của cùng một biến thì cộng (không nhân)" | Ở bài này cả ba biến $x$, $y$, $z$ đều có mặt ở cả $A$ lẫn $B$ ⇒ lời nhắc cũ nói về tình huống không có trong bài |
| Bài 6 | định dạng | Phần 2: tách dòng "$(a-2)^2+(b-2)^2+(c-2)^2=a^2+b^2+c^2-4(a+b+c)+12$" thành 3 dòng, thêm dòng khai triển $=a^2-4a+4+b^2-4b+4+c^2-4c+4$ | Mỗi phép biến đổi một dòng; bước khai triển ba bình phương là bước chính của bài mà bản soạn làm tắt |
| Bài 5 | định dạng (dòng ghi chú) | Thêm `**Ghi chú:**` nêu lỗi của đề gốc ở ý d; viết lại `**Chưa chắc:**` cho rõ việc cần người duyệt quyết | Mâu thuẫn $AB<AC$ ↔ $AB=AC$ là lỗi của ĐỀ GỐC (hai lượt giải độc lập cùng thấy) ⇒ thuộc `Ghi chú`; phần còn lại cần CEO chọn cách xử lý ⇒ giữ `Chưa chắc` |
| Bài 5 | hình | `ve.mjs`: canvas cao 375 → 390 px, vẽ lại `giai_bai5.png` | Nhãn $K$ ở đáy chỉ còn 24 px lề dưới (brief soạn 3.8 yêu cầu ≥ 35 px) |
| Tên đề | định dạng | Thêm "(Hà Nội)" | Cùng kiểu tên với đề mẫu GKI-01 ("… Vân Đồn (Quảng Ninh)") |
| Ghi chú cuối tệp | định dạng | Bỏ "(bản máy cắt thiếu kích thước $2y$ bên phải)"; ghi rõ ý d là lỗi đề gốc và $AC\neq 2AB$ chỉ để $ABDH$ không thành hình vuông | Ghi chú không nói chuyện "bản máy…"; người duyệt cần biết vai trò của điều kiện $AC\neq 2AB$ |

## Đã soát, không sửa (để người duyệt biết)

- **Đề:** đủ 6 bài, mọi ý; số mũ ($x^3y^2z$, $xy^3z^3$, $10x^5y^3-15x^5y^2$, $5x^4y^2$, $2023/2024/2025$), dấu, ngoặc, tên điểm khớp ảnh 300 dpi. Đề in thừa một dấu ngoặc "$AC\neq 2.AB))$" — bản soạn đã bỏ, không cần ghi chú. Dấu chấm nhân của đề ($M=A.B$, $2.AB$) đã đổi đúng luật.
- **Bài 4:** `p1c4_lai.png` đúng hình của bài, đủ ba kích thước $2x+10$, $2y$, $x+1$ và hai nhãn "Trồng hoa", "Trồng rau", không cụt. `kho=dai` đúng (bài thực tế viết / tính biểu thức). Dòng `Ghi chú` (dữ kiện chỉ có trên hình) giữ như đề mẫu.
- **Bài 5:** hình giải dựng đúng bằng toạ độ ($A(0;0)$, $B(0;3)$, $C(5;0)$ ⇒ $AB<AC$, $AC\neq 2AB$; $M$, $H$, $D=2M-H$, $K=A+C-M$), đủ 7 điểm, chỉ đánh dấu giả thiết ($MB=MC$, $HM=MD$, hai góc vuông tại $A$ và $H$), nhãn không đè. Lời giải **không dùng đường trung bình** (kể cả ngầm): ý b đi qua $AB\parallel DH$ (cùng vuông góc $AC$) + $BD\parallel AH$ (ý a) ⇒ hình bình hành có góc vuông — không cần $H$ là trung điểm $AC$. Trung tuyến ứng với cạnh huyền ở ý c hợp lệ vì đề hỏi hình chữ nhật. Phần 1 đi lên, Phần 2 đi ngược lại, khớp từng mắt xích (6 bước ↔ 4 ý).
- **Bài 3c:** bản soạn khai triển $(x+1)^3$ qua $(x+1)^2(x+1)$ thay vì dùng thẳng hằng đẳng thức lập phương của một tổng. Đúng toán, an toàn về luật kiến thức; đề có in $(x+1)^3$ nên dùng thẳng hằng đẳng thức cũng được — không sửa. Kết luận hai giá trị $x=\pm2$ đi từ $x^2=4$, không phân tích nhân tử.
- **Phân loại:** Bài 3a (đáp số 5), Bài 6 (đáp số $-1$) ⇒ trả lời ngắn; Bài 3b ($\dfrac{2}{7}$), Bài 3c (hai giá trị), các bài rút gọn ra đa thức ⇒ tự luận. Bài 1 (ba ý chung hai đơn thức), Bài 4 (lời văn), Bài 5 (hình) không tách — đúng luật.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 5 (ý d)** — đề gốc tự mâu thuẫn: đầu bài cho $AB<AC$, nhưng $AMCK$ là hình vuông ⇔ $AM\perp BC$ ⇔ $AB=AC$. Cả trạm soạn lẫn trạm soát (giải mù) đều ra "tam giác $ABC$ vuông cân tại $A$" — đáp án theo ý người ra đề; lời giải đã ghi rõ ở ý d bỏ giả thiết $AB<AC$. Cần CEO chọn: giữ nguyên đề + lời giải như hiện tại, hay bỏ "$AB<AC$" khỏi đề (các ý a, b, c không dùng tới điều kiện này).
