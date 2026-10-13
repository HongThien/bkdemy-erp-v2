KẾT LUẬN: ĐẠT

# Biên bản soát — DTD-GKI-2026 · Phần 1 (Bài 1–12) — trạm soát Opus, 13/10

- Số câu: **19** (0 TN · 0 TLN · 19 tự luận) · khớp lượt giải mù (`DTD-GKI-2026.p1.kiem.md`) ngay từ đầu: **19/19** đáp án · số câu phải sửa: **4** (không đổi đáp số nào, không đổi đề, không đổi loại).
- Đề: đối chiếu ảnh `trang/p-1.png`, `p-2.png` (phóng to 220/400 dpi) — bản gõ khớp ảnh cả 19 câu (đã xác nhận $-2x^2y^2x$ ở 4c, $x^5$ ở 1d, $-3{,}5abx^2yz$ ở 6d, $\dfrac{1}{2}x^2y^2x$ ở Bài 8, đủ hạng tử Bài 11, 12).
- Kiến thức: chỉ Chương I — không hằng đẳng thức, không phân tích nhân tử (Bài 2b khai triển $\dfrac{2}{3}(a^2+b^2)x^3y$ bằng tính chất phân phối; Bài 8d dùng $x^4=(x^2)^2$ là luỹ thừa của luỹ thừa, lớp 7). Không câu nào vượt phạm vi.
- Máy: `<LV>\tam\kiem_p1_soat.mjs` (thay ≥ 6 bộ số cho 6a–6d, 8, 9a, 9b, 10, 11a, 11b, 12; tính 7, 8c, 10c, 11a, 11b) — tất cả khớp.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: **✔ đạt cổng**. Bản gốc trước khi sửa: `DTD-GKI-2026.p1.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1 | lập luận | Câu kết "Vậy …" thêm "các đa thức là a), b), d)" (bản soạn chỉ nói "a) là đa thức không phải đơn thức") | Đề hỏi cả "biểu thức nào là đa thức"; Phần 2 đã nói b), d) cũng là đa thức nhưng câu kết không kể ⇒ đáp án thiếu |
| Bài 1 | lời Phần 1 | `Chú ý` viết lại: khi kể các đa thức phải kể cả các đơn thức | Câu cũ hướng tới cách trả lời "đa thức mà không phải đơn thức" — lệch câu hỏi của đề |
| Bài 2 | lập luận | `Chú ý` viết lại | Lí do cũ sai toán: "nếu hằng số bằng 0 thì cả biểu thức chỉ còn số 0" — thật ra $a=0$ thì biểu thức thứ ba thành $-bxy$ (đơn thức), kết luận đổi. Giữ giả thiết "hằng số khác 0" nhưng nêu đúng lí do |
| Bài 4c | lời Phần 1 | `Chú ý` bỏ chỉ đích danh $x^2y^2x$ và "thiếu biến $z$" | Lộ đáp án ngay trong Phần 1 |
| Bài 11b | lời Phần 1 | `Chú ý` cũ ("ta trả lời đúng theo đề in, không tự thêm hạng tử") ⇒ thay bằng điểm học thật: đa thức không không có bậc, khác bậc 0 của số khác 0 | Câu cũ là ghi chú cho người duyệt, không phải điều HS cần nghĩ (chỗ đó đã có dòng `Chưa chắc`) |

## Kiểm lại kết luận của trạm soạn ở Bài 11b và 12 (theo yêu cầu)

- **Bài 11b — đồng ý.** Máy xác nhận $Q=x^3+x^2y+xy^2-x^2y-xy^2-x^3\equiv0$ (mọi cặp hạng tử đối nhau). Đa thức không không có bậc ⇒ câu "tìm bậc" vô nghĩa; giá trị bằng 0. Giữ `Chưa chắc`. Không đoán được bản đúng (vd hạng tử cuối là $-y^3$ thì $Q=x^3-y^3$, bậc 3, giá trị 9 — chỉ là một khả năng, không ghi vào câu).
- **Bài 12 — đồng ý.** $A=(2-m)xy^2+7xy$; bậc 3 ⇔ $m\ne2$ (đã xét trường hợp bậc giảm $m=2\Rightarrow A=7xy$ bậc 2). Giữ `Chưa chắc` (đáp số là một điều kiện, không phải một giá trị; nếu đề gốc "bậc là 2" thì $m=2$).

## Câu còn `Chưa chắc` (gửi CEO)

| Nhãn | Lí do |
|---|---|
| Bài 11b | $Q$ thu gọn là đa thức không ⇒ không có bậc; nghi đề in lỗi một hạng tử. Lời giải theo bản in: $Q=0$, không có bậc, giá trị 0 |
| Bài 12 | Theo bản in (bậc 3) đáp số là "$m\ne2$", không phải một giá trị; nếu đề gốc là "bậc là 2" thì $m=2$ |

Ghi chú nhỏ (không sửa): Bài 2 phải giả sử các hằng số khác 0 (đề không nói) — đã ghi trong `Chú ý`, không cần cờ.
