KẾT LUẬN: ĐẠT

# nbv-ot-d1 — soát (nhân chứng thứ hai)

- Số câu: 21 (12 TN · 4 Đ/S · 5 TLN), tất cả `luyen`; nguồn có 6 câu TLN, bỏ p3c6.
- Lệch đáp số so với Pha 1 giải mù: trước 0/21 · sau 0/21 (bản soạn, đáp số sách và bản giải mù khớp nhau ở cả 21 câu, kể cả 16 ý Đ/S).
- `kiem.mjs` (có bộ quét LaTeX hỏng): ✔ đạt cả trước và sau khi sửa, không có lỗi TAB hay mất dấu `\`.
- Bản gốc trước khi sửa: `nbv-ot-d1.goc.json`.

## Những gì đã sửa

| id | lỗi | sửa gì |
|---|---|---|
| nbv-ot-d1-p1c7 | kiem: lặp lại chính đáp số (`-3` truyền thẳng vào bộ so phương án) | kiểm bằng ví dụ số: 3 hàm liên tục trên $\mathbb{R}$ có giới hạn $-3$ tại 1, tính giới hạn hai phía rồi so $f(1)$ với 4 phương án |
| nbv-ot-d1-p2c4 | kiem a), b): chỉ là phép nhân hằng (`15*4===60`), không tính từ dữ kiện | tính từ tốc độ 15 L/phút và nồng độ 30 g/L ở nhiều giá trị $t$ |
| nbv-ot-d1-p3c4 | lời giải: dòng Lưu ý chưa nói đề hỏi "người" mà $f$ tính bằng nghìn người | viết lại Lưu ý: đáp số 500 tính theo đơn vị của $f$, tức 500 nghìn người (500 000 người); `ghi_chu` ghi "Đề sai đơn vị" |

## Đã soát, không phải sửa
- Đề chuẩn hoá: số, dấu, số mũ, ngoặc khớp nguồn; `\lim` của dãy đã thêm $n\to+\infty$; `5.7^{n+1}` thành $5\cdot7^{n+1}$ đúng nghĩa. Không thiếu, không thừa câu.
- **p3c6 bỏ là đúng:** công thức hàm số trong đề hỏng lúc chuyển đổi (`EQ-FAILED … U+0009`). Lời giải sách cho thấy nhánh $x\ne1$ là $\dfrac{\sqrt[3]{x+7}-\sqrt{3x+1}}{x-1}$ và $f(1)=a^2+a-\frac83$, nhưng không biết chắc cách chia nhánh, nên không dựng lại đề từ lời giải.
- **p2c2:** đề ghi đúng nhãn a); chỉ lời giải sách in nhầm ý a) thành "b)". Bản soạn theo đúng nội dung, `ghi_chu` đã có.
- Dạng: tất cả hợp `dich.md` và luật DẠNG SAU THẮNG. p1c1 lấy NDB01162 (đứng sau 01151) · p1c7 lấy NDB01187: không có dạng nào sát hơn cho câu "cho sẵn giả thiết liên tục, suy ra $f(x_0)$", nên để `vua` là hợp lý · p1c11 lấy NDB01184 (đứng sau 01179; đề là dạng $(-\infty)\cdot(+\infty)$, không phải $0\cdot\infty$) · p3c2, p3c3 lấy NDB01177 · p3c5 lấy NDB01197.
- Lời giải: đúng toán từng dòng; không dùng L'Hôpital hay đạo hàm; Phần 1 không lộ đáp số; trắc nghiệm kết bằng "Chọn X.", Đ/S kết bằng câu "Vậy các ý … lần lượt là …"; dùng `\cdot`, không có `\left`, `\right`, `\times`.
- TLN: 64 · 21 · 0 · 500 · -1, đều ≤ 4 ký tự.

## Còn nghi, cần CEO
- **p3c4 (đơn vị):** đề hỏi "bao nhiêu người" nhưng $f$ tính bằng nghìn người. Sách đáp 500, đúng ra là 500 000 người (6 ký tự, quá ngưỡng trả lời ngắn). Đang giữ 500 kèm Lưu ý, theo cách trạm soạn chọn. Muốn sửa chữ đề thành "bao nhiêu nghìn người" thì Thùy quyết.
