KẾT LUẬN: ĐẠT

# GKI-39 — biên bản soát (Phòng GD&ĐT huyện Tân Yên, giữa kì 1 Toán 8, 2024–2025)

- Số câu: **27** (20 trắc nghiệm + 7 tự luận sau khi tách: Câu 1.1a, 1.1b, 1.2, 2.1, 2.2, 3, 4).
- Khớp đáp án Pha 1 (giải mù, `GKI-39.kiem.md`) ngay từ đầu: **27 / 27**. Đề không in bảng đáp án ⇒ hai nguồn (bản soạn · giải mù có máy kiểm `tam/soat-pha1.mjs`).
- Số câu phải sửa: **4** (không câu nào sai đáp số, không câu nào vi phạm luật kiến thức). Bản trước khi sửa: `GKI-39.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng (27 câu · 20 TN · 2 TLN · 5 tự luận · hình 2 · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 10 | chép đề | Thêm `**Ghi chú:**` đề in "Từ giác", đã sửa thành "Tứ giác" | Bản soạn sửa lỗi in của đề mà không ghi chú (brief soạn mục 3.2) |
| Câu 10 | lập luận | Chú ý + dòng loại phương án ở Phần 2: "hình bình hành … không phải hình thang cân" ⇒ "hình bình hành **không phải là hình chữ nhật** … không phải hình thang cân", nêu rõ vì hai góc kề đáy $MN$ không bằng nhau | Hình chữ nhật là hình bình hành và vẫn là hình thang cân ⇒ câu cũ sai với trường hợp đó |
| Câu 19 | chép đề | Thêm `**Ghi chú:**` phương án B đề in "là bình hành", đã sửa thành "là hình bình hành" | Như Câu 10 — sửa lỗi in phải có ghi chú |
| Câu 4 (tự luận) | lập luận | Phần 2 thêm một dòng $\left[(x+y)^2-2 \cdot (x+y) \cdot 2+2^2\right]+\dots$ trước dòng $(x+y-2)^2+\dots$ | Bước ghép $x^2+y^2+2xy-4x-4y+4$ thành $(x+y-2)^2$ là bước khó nhất của câu, bản soạn nhảy thẳng; học sinh lớp 8 chỉ có hằng đẳng thức bình phương của một hiệu (hai số) nên phải thấy $a=x+y$, $b=2$ |
| Câu 3 (tự luận) | hình | `tam/ve.mjs`: dời nhãn $O$ sang bên trái điểm $O$ (trước đó đè lên đoạn $OG$); thu khung hình từ 420 còn 330 px (bỏ khoảng trắng bên phải). Vẽ lại `img/giai_cau3.png` | Nhãn không được đè đường |

## Đã kiểm, không sửa

- **Đề**: 27 câu chép đúng ảnh (đã đọc lại bản cắt 300 dpi `tam/s1..s4.png`): số mũ Câu 4, 5, 9, 11; đơn vị lẫn $dm$ / $cm$ ở Câu 15 phương án B, C; phương án D Câu 16 thiếu đơn vị (đã có ghi chú); Câu 3 tự luận "trung của $AG$" (đã có ghi chú). Không sót, không thừa câu.
- **Luật kiến thức**: đề có Pythagore (Câu 15, 16, 20), hằng đẳng thức (Câu 13, 1.2, 2.2, 4), hình chữ nhật – thoi – vuông (Câu 17, 18, 19, Câu 3) ⇒ được dùng. Lời giải không dùng đường trung bình, Thalès, đồng dạng, phân tích nhân tử. Câu 8, 12 nhân đa thức trực tiếp (không dùng hằng đẳng thức lập phương đề chưa chạm). Câu 17 không cần Pythagore (chỉ dùng tính chất đường chéo). Câu 19A và Câu 3a đi qua tổng góc $360^\circ$ rồi định nghĩa bốn góc vuông, không dùng "ba góc vuông" như dấu hiệu.
- **Câu 3 (hình)**: Phần 1 đi theo chiều phân tích đi lên (5 bước), Phần 2 đi ngược lại khớp từng mắt xích; ý b dùng hình bình hành $AHGC$ (hai đường chéo cắt nhau tại trung điểm) + tiên đề Euclid. Kiểm toạ độ 3 bộ: $D$, $H$, $G$ thẳng hàng, $HG\parallel AC$. Hình giải dựng đúng dữ kiện, đủ 8 điểm, chỉ đánh dấu giả thiết (4 góc vuông, $OH=OC$, $OA=OG$); $HG$, $CG$ là đường phụ của lời giải.
- **Hình đề**: `p2c16_1.png` (Câu 16) và `p2c18_1.png` (Câu 18) đúng hình của câu, không cụt.
- **Phân loại**: `kho` đúng (hình: Câu 10, 14–20, Câu 3 tự luận). Trả lời ngắn: Câu 1.2 (đáp số 1), Câu 4 (đáp số 2) — số nguyên đúng dạng đề hỏi. Tách ý: Câu 1 (3 ý tính độc lập), Câu 2 (2 bài toán độc lập); Câu 3 bài hình giữ chung.

## Câu còn `Chưa chắc` (gửi CEO)

Không có câu nào.

Điều người duyệt nên biết (cấp ĐỀ, không ảnh hưởng lời giải): `bo_sach: Cánh Diều` là đoán — đề không ghi bộ sách; có Pythagore ở giữa kì 1 nên là Cánh Diều hoặc CTST, trạm soát không phân xử được giữa hai bộ này.
