KẾT LUẬN: ĐẠT

# GKI-09 — biên bản soát (trạm soát, giải mù 2 pha)

- Đề: giữa học kì 1 năm học 2024–2025, Toán 8, 90 phút, 1 trang — đề không ghi tên trường. Đề có lớp chữ, ảnh rõ; phần trắc nghiệm và hình Câu 10 đã cắt phóng to 300 dpi để đọc số mũ, nhãn hình.
- **Số câu:** 12 (6 trắc nghiệm · 0 trả lời ngắn · 6 tự luận; Câu 7 tách 7a, 7b, 7c).
- **Khớp đáp án Pha 1 ngay từ đầu:** 12 / 12 (bảng giải mù: `GKI-09.kiem.md`; Câu 2, 3, 7a, 7b, 7c, 8, 10 đã thử bằng máy — `<LV>\tam\soat_pha1.mjs`, 20 bộ số).
- **Số câu phải sửa:** 5 (Câu 4, 5, 6, 7a, 10) + 1 chỗ ở mục ghi chú cuối tệp. Không câu nào sai đáp án, không câu nào sai luật kiến thức. Bản trước khi sửa: `GKI-09.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng (trước và sau khi sửa).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 6 | lập luận | Phần 1, Bước 3: "Phương án "vuông góc" chỉ đúng với một số hình đặc biệt, không phải định nghĩa" → "trong hình chữ nhật, hai cạnh vuông góc với nhau là hai cạnh **kề**, không phải hai cạnh đối" | Câu cũ sai toán: hai cạnh **đối** của hình bình hành song song nên không bao giờ vuông góc, ở hình đặc biệt nào cũng vậy. Câu cũ làm học sinh tưởng hình chữ nhật có cạnh đối vuông góc (lẫn cạnh đối với cạnh kề) |
| Câu 4 | lập luận (diễn đạt) | `Chú ý`: "hệ số $-11$ không chia hết 10" → "hệ số 10 không chia hết cho $-11$" (sửa cả câu tương ứng ở ghi chú cuối tệp) | Viết ngược quan hệ chia hết: số bị chia là 10, số chia là $-11$ |
| Câu 5 | định dạng | Đề + 4 phương án + `Chú ý` + Phần 2: `$2cm$`, `$\sqrt{10}cm$`… → `$2$ cm`, `$\sqrt{10}$ cm`; dòng kết quả Phần 2 ghi `$\sqrt{10}$ (cm)` | Đơn vị để ngoài công thức (trong `$…$` chữ "cm" hiện nghiêng như tích hai biến $c\cdot m$) — theo quy ước các đề đã soát (GKI-02, GKI-07) và brief soạn mục 4 |
| Câu 7a | định dạng | Phần 2, dòng tách phép chia: thêm ngoặc $(xy:3xy)-(2x^2y:3xy)+(3x^2y^2:3xy)$ | Dòng cũ $xy:3xy-2x^2y:3xy+\dots$ không có ngoặc, đọc được thành nhiều thứ tự phép tính; sách giáo khoa viết có ngoặc |
| Câu 10 | chép đề | "trung bình $1$ ($m^2$)" → "$1$ $m^2$" | Đề gốc in "1 $m^2$" không có ngoặc (chỉ "(m)", "(kg)" mới có ngoặc) |
| Ghi chú cuối tệp | — | Thêm dòng về cách hiểu Câu 10 (lượng mía của cả mảnh vườn mới; nêu đáp số nếu chỉ tính phần mở rộng) | Điều người duyệt cần biết — xem mục dưới |

## Đã soát, không sửa (để người duyệt biết)

- **Đề:** 10 câu gốc của ảnh chép đủ, đúng số mũ / dấu / phương án / tên điểm. Dấu chấm nhân của đề ở Câu 3 $(x-2y).(x+2y)$ và Câu 7b $4x.(x+y)$ đã bỏ (ngoặc với ngoặc viết liền) — đúng luật định dạng.
- **Tách ý Câu 7:** ba ý là ba bài toán độc lập, mỗi ý một lời dẫn và một biểu thức riêng (Thực hiện phép tính · Chứng tỏ không phụ thuộc biến · Tính nhanh), không ý nào dùng kết quả ý khác ⇒ tách 7a, 7b, 7c là đúng.
- **Phân loại:** Câu 5, 6, 9 `hinh_hoc`; còn lại `dai` (Câu 10 là bài thực tế viết biểu thức đại số ⇒ `dai`). Không câu nào đủ điều kiện trả lời ngắn: đáp số là đa thức / biểu thức (7a, 8, 10), chứng minh (7b, 9), số 7 chữ số $4\,000\,000$ (7c).
- **Luật kiến thức:** đề chạm tới hằng đẳng thức (Câu 3, 7b, 7c) và hình chữ nhật (Câu 9) ⇒ lời giải dùng bình phương của một tổng / một hiệu, định nghĩa và tính chất đường chéo hình chữ nhật là hợp lệ. Không có đường trung bình, Thalès, Pythagore (Câu 5 có $\sqrt{10}$ nhưng chỉ cần "hai cạnh bên bằng nhau"), không phân tích nhân tử.
- **Câu 9:** ý a đi đúng đường "ba góc vuông ⇒ góc thứ tư $=360^\circ-3\cdot 90^\circ$ ⇒ bốn góc vuông ⇒ hình chữ nhật (định nghĩa)", không dùng "tứ giác có ba góc vuông" như một dấu hiệu. Ý c: so đường vuông góc với đường xiên (lớp 7), rồi **tự chứng minh** $H$ là trung điểm $BC$ bằng hai tam giác vuông bằng nhau (cạnh huyền – cạnh góc vuông) thay vì trích "đường cao tam giác cân là trung tuyến" — chặt. Phần 1 viết theo chiều đi lên ("muốn có …, cần …"), Phần 2 đi ngược lại, khớp từng mắt xích (Bước 1–2 ↔ a, Bước 3 ↔ b, Bước 4–5 ↔ c).
- **Hình giải `giai_cau9.png`:** dựng bằng toạ độ đúng dữ kiện ($AB=AC$, $\widehat{A}=90^\circ$, $M$ trên $BC$ không ở trung điểm, $N$, $P$ là chân đường vuông góc, $H$ trung điểm $BC$ vẽ nét đứt cho ý c); đủ 7 điểm, nhãn không đè, không cụt; chỉ đánh dấu góc vuông giả thiết tại $A$, $N$, $P$ và tại $H$ (đường kẻ thêm), **không** đánh dấu góc vuông tại $M$ và không gạch $AM=NP$ (điều phải chứng minh). Không phải vẽ lại.
- **Hình Câu 10 `p1c10_1.png`:** đúng hình của câu, đủ ba nhãn $C=20\,(m)$, $y\,(m)$, $8x\,(m)$, không cụt (tệp máy cắt `p2c9_1.png` bị cụt nhãn $8x$ và gắn nhầm sang Câu 9 — bản soạn đã cắt lại và không dùng tệp đó).
- **Câu 10 — cách hiểu đề:** "lượng mía thu hoạch được sau khi mở rộng mảnh vườn" hiểu là của cả mảnh vườn mới $(5+y)(5+8x)$ m²; trạm soạn và trạm soát giải độc lập đều hiểu như vậy, đáp số $56xy+280x+35y+175$ (kg) khớp máy. Cách hiểu "chỉ phần mở rộng thêm" ($56xy+280x+35y$) gượng so với câu chữ ⇒ không đặt `Chưa chắc`, chỉ ghi ở mục ghi chú cuối tệp cho người duyệt.
- Phần 1 các câu trắc nghiệm định nghĩa (Câu 5, 6) có nhắc lại tính chất / định nghĩa — cùng kiểu với đề mẫu GKI-01 (Câu 7, 8), không coi là lộ đáp số.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
