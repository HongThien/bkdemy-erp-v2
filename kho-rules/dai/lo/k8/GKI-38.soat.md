KẾT LUẬN: ĐẠT

# GKI-38 — Biên bản soát (THCS Ngô Quyền, quận Lê Chân — giữa học kì 1 Toán 8, 2024-2025)

- **Số câu:** 24 (15 trắc nghiệm · 1 trả lời ngắn · 8 tự luận; Bài 1, 2.1, 2.2 tách ý; Bài 3 hình và Bài 4 lời văn giữ một câu).
- **Khớp đáp án Pha 1 (giải mù) ngay từ đầu:** 24/24.
- **Ba nguồn cho 15 câu trắc nghiệm** (trạm soạn · trạm soát giải mù · chữ tô đỏ trong đề): 14 câu cả ba khớp; **Câu 10** hai trạm cùng ra C, đề tô đỏ B.
- **Số câu phải sửa:** 5 (Câu 1, Câu 10, Câu 13, Bài 2.2b, Bài 3) — không câu nào sai đáp số.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (chưa chắc 0).
- **Thử máy:** `<LV>\tam\s_kiem.mjs` — thay số ngẫu nhiên hai vế (Câu 3–9, Bài 1b, 2.1a–c, Bài 4), thay ngược nghiệm (Bài 2.2a, 2.2b), toạ độ Bài 3 với $\widehat{DAB}=50^\circ, 75^\circ, 90^\circ, 120^\circ$ (góc $P$ luôn vuông; $PM=PN$ chỉ khi $90^\circ$), tính lồi của Hình 2 và điểm cắt ở Hình 3 (Câu 10).
- **Luật kiến thức:** đề chạm Chương I, hằng đẳng thức, tứ giác → hình bình hành → hình chữ nhật, thoi, vuông (Câu 14, 15, Bài 3c). Lời giải không dùng đường trung bình, Thalès, Pythagore, phân tích nhân tử; Bài 3c đi từ ba góc vuông ⇒ tổng các góc tứ giác ⇒ bốn góc vuông ⇒ hình chữ nhật (đúng luật "ba góc vuông không phải dấu hiệu").

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 1 | chép đề | Phương án B: `$-x^6y$` → `$-x6y$` (đúng như đề in); viết lại `Ghi chú`, Mấu chốt, Chú ý, dòng Phần 2 theo $-x6y=(-1)\cdot x\cdot 6\cdot y=-6xy$ | Ảnh 300 dpi: chữ số 6 nằm ngang hàng với $x$, $y$, không phải số mũ. Trạm soạn tự đoán là rơi số mũ rồi sửa đề; "$-x6y$" vẫn là một đơn thức (chưa thu gọn) nên không có căn cứ để đổi đề. Đáp án B không đổi theo cả hai cách đọc — đã nói trong `Ghi chú` |
| Câu 10 | ghi chú (phân xử) + lập luận | Xoá `Chưa chắc`; viết lại `Ghi chú` (phần tô đỏ B sai, vì sao); sửa câu "đường thẳng chứa mỗi cạnh chéo…" thành "đường thẳng chứa một trong hai cạnh cắt nhau chia hai đỉnh còn lại về hai phía" | Đã phân xử chắc chắn: Hình 2 có 5 đỉnh và **lồi** (5 tích có hướng cùng dấu, toạ độ đọc từ ảnh 300 dpi); Hình 3 có hai cạnh cắt nhau (chấm giữa hình nằm đúng trên giao điểm) ⇒ theo đúng chữ câu hỏi "không phải đa giác lồi" chỉ Hình 3 thoả. Nếu hiểu là "không phải tứ giác lồi" thì Hình 2 và Hình 3 cùng thoả ⇒ B không là đáp án duy nhất ở cách hiểu nào. Giữ C. "Cạnh chéo" không phải thuật ngữ |
| Câu 13 | kiến thức (từ cấm) | Mấu chốt: "lập một phương trình theo $x$" → "viết đẳng thức tổng bốn góc để tìm $x$" | Giữa kì 1 chưa học "phương trình" (k8.md §10) |
| Bài 2.2b | định dạng + kiến thức (từ cấm) | Mấu chốt: "khai triển hai vế phải … còn lại phương trình chỉ chứa $x$" → "khai triển vế trái thì hạng tử $x^2$ triệt tiêu, còn lại đẳng thức chỉ chứa $x$ ở bậc nhất nên tìm $x$ bằng quy tắc chuyển vế" | Câu gốc viết lỗi ("hai vế phải") và dùng chữ "phương trình" |
| Bài 3 | ghi chú · lập luận · hình | (1) Xoá dòng `Ghi chú` ("Hình giải vẽ ở lời giải; … chứng minh cả hai chiều") — chuyển ý đó xuống mục ghi chú cuối tệp. (2) Phần 1 Bước 3: "hình chữ nhật, tức là có ba góc vuông" → "có bốn góc vuông; tìm ba góc vuông, góc thứ tư từ tổng các góc". (3) Phần 2 ý c: thêm lí do $MB\parallel NC$ (vì $AB\parallel CD$), tách dòng $BC=AD$ (hai cạnh đối của hình bình hành $ABCD$), thêm "(dấu hiệu nhận biết)". (4) Hình giải: thêm đoạn $MN$ nét đứt (`<LV>\tam\ve.mjs`, vẽ lại `giai_bai3.png`) | (1) `Ghi chú` chỉ dành cho lỗi đề gốc. (2) Câu chữ gốc đọc thành "ba góc vuông = hình chữ nhật", trái luật. (3) Mỗi khẳng định hình phải kèm lí do; $AD=BC$ dùng mà chưa nêu. (4) Lời giải dùng hình thoi $AMND$, $MBCN$ và các góc $\widehat{AMN}$, $\widehat{NMB}$ — hình cũ không có đoạn $MN$ |
| Cuối tệp | ghi chú | Cập nhật ba dòng (Câu 1, Câu 10, Bài 3) cho khớp các sửa trên | — |

## Đã soát, không sửa

- Câu 2–9, 11, 12, 14, 15, Bài 1a, 1b, 2.1a–c, 2.2a, Bài 4: đề khớp ảnh (số mũ, dấu, phương án), lời giải đúng từng dòng, đúng phạm vi kiến thức, Phần 1 đủ 3–6 bước nghĩ thật.
- Câu 4: `Ghi chú` "phương án C và D in trùng nhau" là lỗi thật của đề gốc — giữ.
- Bài 2.2a giải bằng "hai số có bình phương bằng nhau thì bằng nhau hoặc đối nhau" (lớp 7) — hợp lệ, không cần phân tích nhân tử.
- Hình: `p1c10_hinh.png` (đủ 4 hình + nhãn Hình 1–4, không dính chữ câu khác) · `p1c13_1.png` (đủ $M$, $N$, $P$, $Q$ và bốn số đo) · `giai_bai3.png` (dựng đúng $AB=2AD$, $M$, $N$ trung điểm, $P$, $Q$ là giao điểm; chỉ đánh dấu giả thiết).
- Phân loại: câu hình ⇒ `hinh_hoc`, còn lại `dai`; Bài 1a đáp số $8$ ⇒ trả lời ngắn; Bài 1b đáp số $-\dfrac{1}{2}$ ⇒ tự luận.

## Câu còn `Chưa chắc` (gửi CEO)

Không còn câu nào.

**Hai điều CEO nên biết (đã ghi ở `Ghi chú` của câu, không phải `Chưa chắc`):**

1. **Câu 10** — đáp án của kho là **C (Hình 3)**, khác chữ tô đỏ của trường (**B, Hình 2**). Câu hỏi gốc tự nó có lỗi: gọi cả bốn hình là "tứ giác" trong khi Hình 2 có 5 đỉnh. Nếu CEO muốn theo đáp án của trường thì phải sửa cả câu hỏi (vd "hình nào không phải là tứ giác?"), không chỉ đổi chữ cái.
2. **Câu 1** — phương án B giữ nguyên như đề in "$-x6y$"; nếu CEO cho rằng đề rơi số mũ thì đổi thành $-x^6y$ (đáp án vẫn B).
