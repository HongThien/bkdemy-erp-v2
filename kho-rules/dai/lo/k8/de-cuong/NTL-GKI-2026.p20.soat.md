KẾT LUẬN: ĐẠT

# NTL-GKI-2026 — Phần 20 — Biên bản soát (trạm soát Opus, 27/10)

- **Số câu:** 10 (Đề 3 Câu 1–6 trắc nghiệm · Bài 1 · Bài 2a, 2b, 2c), kho giữ nguyên (3 `dai` TN + 3 `hinh_hoc` TN + 4 `dai` tự luận), không tách / gộp / đổi nhãn.
- **Khớp Pha 1 ngay từ đầu:** 10/10 (C1 B · C2 C · C3 A · C4 D · C5 D · C6 B · Bài 1: $B=10$, $A+B=x^5y+7x^2y+9$, $A-B=x^5y+6x^4+3x^2y-9$ · 2a $x=1$ · 2b $x=-\dfrac{2}{7}$ · 2c $x=0$ hoặc $x=-\dfrac{3}{2}$).
- **Số câu phải sửa:** 3 (Câu 4, 5, 6) — **cả 3 chỉ sửa TRÌNH BÀY** theo luật Hình 7·8·9; **0 câu sửa vì lỗi toán** (không đổi đáp án, không đổi đáp số, không sai kiến thức).
- **Đề:** đối chiếu `t-13.png`, phóng to `z\soat_p20_c1-13.png`, `soat_p20_c3-13.png`, `soat_p20_b1-13.png` — chép đúng số, số mũ, dấu, đủ 4 phương án / đủ ý.
- **Phân loại:** 2a `tra_loi_ngan` $1$ đúng khuôn; 2b (phân số), 2c (hai giá trị), Bài 1 (đa thức) `tu_luan` đúng.
- **Kiến thức (phạm vi NTL):** hiệu hai bình phương (C2, 2c), bình phương của tổng (2b), lập phương của tổng (2c), đặt nhân tử chung + tích bằng 0 (2c) — đều trong Chương I + II của NTL. Hình chỉ dùng hình thang / thang cân / hình bình hành; không đường trung bình, Thalès, Pythagore, phân thức, "phương trình".
- **Trắc nghiệm (luật mục 3, brief-bo-sung-4):** `dap_an` một chữ cái; Phần 1 3–5 bước, Phần 2 loại phương án bằng lí do, kết "Chọn X." — đạt.
- **Máy kiểm:** `<LV>\tam\soat_p20_kiem.mjs` (C2, C3, B(−1;2), A±B, 2a–2c thay ≥3 bộ số / đồng nhất thức).
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (10 câu · 6 TN · 1 TLN · 3 tự luận · chưa chắc 0).

| Câu | Loại lỗi | Sửa vì | Sửa gì | Vì sao |
|---|---|---|---|---|
| Đề 3 Câu 4 | định dạng (trình bày Hình) + lập luận nhỏ | chỉ trình bày | Phần 2 tách dòng ngắn (xuống dòng đơn), thêm "Vậy D đúng.", "(dấu hiệu nhận biết hình thang cân)", "(tính chất hình bình hành)", "(hai góc trong cùng phía)", "(định nghĩa hình thang cân)", "(tính chất hình thang cân)"; phản ví dụ nói rõ "hình bình hành **không có góc vuông**" (Phần 1 Bước 2 cũng vậy) | Dòng cũ dài 2–3 lần mốc 60 kí tự, thiếu chú thích tên tính chất; câu cũ "(trừ khi cùng là góc vuông) nên nó không là hình thang cân" mơ hồ về phạm vi phản ví dụ — đáp án D không đổi |
| Đề 3 Câu 5 | định dạng (trình bày Hình) | chỉ trình bày | Phần 2 thành khối "Xét tứ giác $ABCD$ có:" + "(tổng các góc của một tứ giác)", hai chỗ dùng dữ kiện thêm "(gt)", dòng thử lại tách hai dòng | Thiếu (gt) / tên định lí; dòng thử lại dài — đáp số $120^\circ$ không đổi |
| Đề 3 Câu 6 | định dạng (trình bày Hình) | chỉ trình bày | Phần 2 tách dòng ngắn (xuống dòng đơn); thêm "(định nghĩa hình bình hành)", "(định nghĩa hình thang)", "(tổng các góc của một tứ giác)", "(tính chất hình bình hành)"; khối hình thang cân viết mỗi điều kiện một dòng | Hai đoạn cũ dài > 150 kí tự, thiếu chú thích — đáp án B không đổi |

**Đính chính CEO 27/10 đã áp:** Phần 2 của Câu 4, 5, 6 các dòng nối bằng xuống dòng ĐƠN, KHÔNG dòng trống giữa các bước (giãn dòng là việc hiển thị ở app); dòng trống chỉ còn trước `**Phần 2. Trình bày**`. Phần 1 giữ khuôn card (`**Mấu chốt:**` / `**Bước k.**` mỗi card một đoạn). Cổng chạy lại ✔.

Cũng sửa mục "GHI CHÚ CHO NGƯỜI DUYỆT": dòng Câu 5 (trạm soạn nghi "người giao ghi ⇒ C") đổi thành "giải mù cũng ra D ⇒ chốt D"; thêm dòng ghi việc viết lại Phần 2 Câu 4–6.
Câu Đại (C1–C3, Bài 1, 2a–2c) không sửa: đúng toán, đúng khuôn, `\cdot` đúng chỗ, Phần 1 không lộ đáp số.
Không có bài Hình tự luận trong phần này ⇒ không có hình giải (Bài 4 hình của Đề 3 thuộc phần 21).

**Câu "Đề sai":** Đề 3 Câu 3 — phương án C và D in giống hệt nhau ($-10x^2y+4xy^2$, đều sai); đáp án đúng A vẫn chọn được. Trạm soạn đã ghi đúng luật 24/10 (`**Ghi chú:** Đề sai: …` + dòng "Lưu ý" đầu Phần 2) — giữ.

**Câu còn `Chưa chắc`:** không có.
