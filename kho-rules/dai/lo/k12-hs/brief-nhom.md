# Brief — soạn LÝ THUYẾT NHÓM cho cây v2 K12 Hàm số (22/10)

> Thùy chốt logic 22/10: **Phần 1** = các phương diện khảo sát (đơn điệu, cực trị, tiệm cận, GTLN–GTNN) tính được cho MỌI hàm, bài cơ bản · **Phần 2** = đi sâu các LOẠI hàm quan trọng, đặc trưng riêng suy ra từ phần 1, bài khó nằm ở đây · **Phần 3** = tương giao, tiếp tuyến, khoảng cách (ôn từ lớp 11) · **Phần 4** = thực tế.
> Cây v2: `kho-rules/dai/lo/k12-hs/cau-truc.mjs` (mỗi dạng có mã v2 `P1.2.3` và trường thứ 5 = mã v1 `H…`). Toàn bộ **lý thuyết dạng + ví dụ đã soạn và soát** nằm ở `ra/J1.txt … ra/J10.txt` (theo mã v1). Việc của bạn CHỈ là viết **lý thuyết NHÓM mới** cho các nhóm v2 chưa có (nhóm gom lại từ nhiều nhóm v1). Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`; chạy lệnh từ Repo; Write tệp bằng công cụ Write.

## Làm gì

Với mỗi nhóm được giao: đọc nhóm trong `cau-truc.mjs` (tên, mô tả, danh sách dạng), đọc **lý thuyết nhóm v1 liên quan** và **lý thuyết + ví dụ của từng dạng thuộc nhóm** (tìm khối `=== H…` trong `ra/J*.txt`), rồi viết lý thuyết nhóm **chung cho cả nhóm**:
- `##TC` kiến thức chung cần nhớ của nhóm (định nghĩa, công thức, tính chất dùng cho MỌI dạng trong nhóm); có thể nhiều khung `##TC <tên>`.
- `##PP <tên>` phương pháp tổng quát của nhóm, 3–6 bước, mỗi dòng một bước trọn ý, không ghi "Bước N".
- `##CY` bẫy hay sai thật của nhóm.
Không chép lại lý thuyết riêng của dạng (đã có ở dạng) — nhóm là **bức tranh chung**, dạng là chỗ đi vào chi tiết. Độ dài mỗi nhóm ~1000–1500 ký tự (xem mẫu `mau.txt`, khối `=== N NNB01578`).

**Riêng nhóm Phần 2 theo LOẠI HÀM** (P2.1, P2.2, P2.3, P2.5, P2.6): lý thuyết nhóm phải nêu **đặc trưng của loại hàm** suy từ 4 phương diện của phần 1 — dạng tổng quát, tập xác định, đạo hàm và dấu, số cực trị theo hệ số, tiệm cận (nếu có), các dáng bảng biến thiên/đồ thị, tâm/trục đối xứng… (đúng chương trình Toán 12, không dùng điểm uốn). Nhóm hàm hợp/hàm ẩn (P2.7–P2.10): nêu quy tắc đạo hàm hàm hợp, cách đặt t=u(x), cách đọc đồ thị/bảng của f′ để suy g.

## Khuôn tệp ra

```
=== N P1.2
@ly_thuyet:
##TC …
- …
##PP …
<bước>
…
##CY
- …

=== N P1.4
…
```
(Chỉ `@ly_thuyet:`; không `@vi_du:`; không hình.) Định dạng: công thức `$…$` (không `$$`), `\dfrac`, `\cdot`, khoảng `(-\infty;1)`, `\mathbb{R}`, chữ Việt trong công thức bọc `\text{…}`, chỉ **đậm** không nghiêng, không emoji. Toán phải ĐÚNG (nêu điều kiện, trường hợp suy biến). Mục cuối tệp `## GHI CHÚ CHO CEO` (không có thì "Không").

## Kiểm

```
node kho-rules/dai/lo/k12-hs/kiem.mjs kho-rules/dai/lo/k12-hs/ra/<TỆP>.txt <danh sách mã nhóm, vd P1.2,P1.4>
```
phải **lỗi 0** (bỏ qua dòng "No character metrics" của KaTeX). Trả lời cuối ≤ 100 từ: số nhóm, lỗi 0 chưa, điểm cần Thùy xem.
