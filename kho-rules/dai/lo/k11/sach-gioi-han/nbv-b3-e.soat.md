KẾT LUẬN: ĐẠT (sau sửa; còn 3 câu chờ Thùy chọn cách hiểu đề: 42, 27, 55)

- Số câu: 50 (48 trả lời ngắn + 2 tự luận: 29, 55), tất cả `luyen`, 0 Đ/S, 0 câu chưa dạng. Nguồn 60 câu, bỏ 10.
- Lệch đáp số Pha 1 (giải mù) với bản soạn: trước sửa 0 câu lệch; câu 42 tôi để mơ hồ (−2,5 nếu lấy khoảng liên tục lớn nhất, 0 theo điều kiện x>0) — bản soạn và sách lấy 0. Sau sửa: 0.
- Câu BỎ (đối chiếu nguồn `.txt`): 5, 13, 33, 38, 39, 40, 44, 47 — hàm số ở dạng `[[EQ-FAILED:oleObject…]]` (mất công thức, không giải lại được từ đề); 14 — đề là đồ thị `[[img]]`; 19 — bảng giá cước toàn ảnh WMF. Bỏ đúng. Câu 1, 26, 42 có ảnh nhưng đề đủ chữ ⇒ giữ đúng.
- `kiem.mjs` (có bộ quét LaTeX hỏng): ✔ đạt trước và sau sửa, không lỗi LaTeX.
- Đã kiểm từng câu: đề giữ nghĩa sách (số, dấu, miền nhánh); lời giải đúng toán, không đạo hàm/L'Hôpital (câu 4 xét hiệu f(y)−f(x), đúng); `kiem` tự tính lại từ đề, có phương án sai để đối chứng (không tautology).

| id | lỗi | sửa gì |
|---|---|---|
| nbv-b3-e-4 | lời giải: Phần 1 Mấu chốt + Bước 2 nêu thẳng hai khoảng (−1;0), (0;1) mỗi khoảng một nghiệm ⇒ lộ đáp số 2 | viết lại Mấu chốt, Bước 2 thành "các khoảng mà f đổi dấu" |
| nbv-b3-e-10 | lời giải: Phần 1 "ba khoảng đổi dấu", "trên ba khoảng", "nhiều nhất ba nghiệm" ⇒ lộ đáp số 3 | viết lại Mấu chốt, Bước 3, Bước 4 |
| nbv-b3-e-16 | lời giải: Phần 1 "chỉ ra đủ hai nghiệm", "hai khoảng", "tối đa hai nghiệm" ⇒ lộ đáp số 2 | viết lại Mấu chốt, Bước 3, Bước 4 |
| nbv-b3-e-21 | lời giải: Mấu chốt "ba khoảng đổi dấu cộng với bậc ba cho đúng số nghiệm" ⇒ lộ 3 | viết lại Mấu chốt |
| nbv-b3-e-42 | lời giải: Mấu chốt nêu thẳng "tập xác định là (0;+∞)" ⇒ lộ a=0; Phần 2 có dòng tính f(0), lim tại 0 thừa (x=0 ngoài miền đang xét) | viết lại Mấu chốt, Bước 3; bỏ dòng f(0) |
| nbv-b3-e-59 | dạng: NDB01193 (tham số ở cả hai nhánh) nhưng m chỉ ở nhánh x≤1 (chính `dang_bai_ly_do` cũng ghi vậy) | → NDB01191, cao |

Xác nhận các ghi chú của trạm soạn (đã kiểm bằng máy):
- 29: LỆCH SÁCH đúng — giới hạn tại 1 bằng 7/3 (máy: 2,33333), m = 19/9; sách ra 2. Để `tu_luan`.
- 55: đề in (√(x+7)−3)/(x−3) ⇒ a = −9−4√2 (máy khớp −14,6569); sách giải hàm khác ra −14. Để `tu_luan`, có Lưu ý.
- 9: −1/6 ≈ −0,2 (sách in thiếu dấu trừ). 7: m = −2/√3 ⇒ a−b = −1, có Lưu ý về "m>0" mâu thuẫn. 18: sửa "x≠1" thứ hai thành "x=1" — lỗi in hiển nhiên, đúng.
- 30 ≡ 43 (S = −36, máy: lim = −2 ⇒ c = −4), 36 ≡ 52 (m = 3): trùng đề trong sách, giữ cả hai theo nguồn.
- 25 (NDB01185, vừa) và 37 (NDB01169, vừa): khớp dạng tương đối, chấp nhận.

Câu CÒN NGHI cần CEO:
- **nbv-b3-e-42** — về toán f(x)=1/2+20/(5+2x) liên tục trên mọi (a;+∞) với a ≥ −5/2, nên a không duy nhất; khoảng lớn nhất cho a = −2,5. Sách (và bản soạn) lấy a = 0 theo điều kiện thực tế x>0. Đề còn lủng củng ("biểu thức vận tốc … đơn vị giờ"). Đề xuất: giữ 0 kèm Lưu ý, hoặc loại câu.
- **nbv-b3-e-27** — C(x) "giá khi quãng đường là x" đọc chữ thì là tổng tiền ⇒ C(5)=5 nghìn; sách hiểu là giá mỗi km theo bậc ⇒ 37. Bản soạn giữ 37 + Lưu ý. Câu không dùng kiến thức liên tục; cân nhắc loại.
- **nbv-b3-e-55** — sách đáp −14 (giải một hàm khác); theo đề in là −9−4√2. Nên xem bản gốc xem đề in sai hay lời giải sai.
