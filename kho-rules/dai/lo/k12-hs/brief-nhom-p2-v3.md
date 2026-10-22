# Brief — soạn LÝ THUYẾT NHÓM cho 4 nhóm "Các loại hàm số" (P2.1–P2.4), cây v3 (22/10)

Thùy chốt 22/10: Phần 2 đi **theo từng loại hàm**; nhóm = một loại hàm; dạng = bài toán ĐẶC TRƯNG của loại hàm đó (dấu của a,b,c,d · điểm uốn · tâm đối xứng · đường thẳng qua hai điểm cực trị…). Bài đơn giản (tìm cực trị, xét đơn điệu, tìm tiệm cận của hàm cho sẵn) ở Phần 1; **"khảo sát và vẽ đồ thị" là bài giảng, KHÔNG phải dạng bài — đừng nhắc tới như một dạng, đừng viết quy trình khảo sát–vẽ**.

Cây: `kho-rules/dai/lo/k12-hs/cau-truc.mjs` (xem nhóm P2.1, P2.2, P2.3, P2.4: tên, mô tả, danh sách dạng — mỗi dạng có mã v3 `P2.x.y` và mã v1 `H…`; dạng mã `M…` là dạng mới chưa có lý thuyết).
Khuôn và quy tắc định dạng: giống `brief-nhom.md` (cùng thư mục) — đọc trước. Nhóm là **bức tranh chung của loại hàm**: ##TC các tính chất/đặc trưng dùng cho MỌI dạng trong nhóm; ##PP phương pháp tổng quát; ##CY bẫy hay sai. ~1000–1500 ký tự mỗi nhóm.

Nêu rõ **đặc trưng của loại hàm** (suy ra từ 4 phương diện Phần 1):
- P2.1 Hàm bậc ba: dạng đồ thị theo dấu a và Δ′ của y′, điểm uốn là tâm đối xứng, vị trí hai điểm cực trị và đường thẳng qua chúng (chia y cho y′), số nghiệm f(x)=m đọc từ đồ thị, ý nghĩa dấu của a, b, c, d.
- P2.2 Hàm trùng phương: đồ thị nhận Oy làm trục đối xứng; y′=2x(2ax²+b); một hoặc ba cực trị tuỳ dấu ab; ba cực trị tạo tam giác cân, dấu của a,b,c từ đồ thị.
- P2.3 Hàm bậc nhất trên bậc nhất: tiệm cận đứng x=−d/c và ngang y=a/c, tâm đối xứng là giao hai tiệm cận, dấu của ad−bc quyết định đơn điệu, đọc a,b,c,d từ tiệm cận và giao điểm trục.
- P2.4 Hàm bậc hai trên bậc nhất: tiệm cận đứng và xiên (chia đa thức), y′ có hai nghiệm ⇒ cực đại/cực tiểu hai bên tiệm cận đứng, tâm đối xứng là giao hai tiệm cận.

Có thể tham khảo (chỉ để lấy ý/văn phong, KHÔNG chép nguyên): `ra/N2.v2-cu.txt` (lý thuyết nhóm của bản v2 cũ, có nhắc "khảo sát" nên phải viết lại), `ra/J*.txt` (lý thuyết + ví dụ dạng v1).

Ra: `kho-rules/dai/lo/k12-hs/ra/N2.txt` gồm 4 khối `=== N P2.1` … `=== N P2.4` (khuôn `@ly_thuyet:` như brief-nhom.md; không `@vi_du`, không hình).
Kiểm: `node kho-rules/dai/lo/k12-hs/kiem.mjs kho-rules/dai/lo/k12-hs/ra/N2.txt P2.1,P2.2,P2.3,P2.4` phải **lỗi 0** (bỏ qua dòng "No character metrics" của KaTeX).
Trả lời cuối ≤ 100 từ: số nhóm, lỗi 0 chưa, điểm cần Thùy xem. KHÔNG sửa tệp nào khác ngoài `ra/N2.txt`; KHÔNG chạm DB.
