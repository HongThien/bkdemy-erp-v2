# Danh sách XOÁ bản đồ CŨ K12 — 4 chủ đề làm lại (xoa-cu.mjs)

> Sinh bởi `xoa-cu.mjs` (chạy thử 14:10:22 3/11/2026). Thùy đã duyệt xoá 03/11. KHÔNG đụng NCD00095 (NHTP) · NCD00099 (PPTD). Sao lưu JSON: `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad\backup-xoa-cu`.

## 1. Số dòng mỗi bảng

| bảng | kiểu | xoá trực tiếp | cascade | tổng mất |
|---|---|---|---|---|
| `dai_bdm_gan_cau` | trực tiếp | 0 | 365 | **365** |
| `hgt_bdm_gan_cau` | trực tiếp | 0 | 0 | **0** |
| `dai_bdm_de_xuat` | trực tiếp | 0 | 352 | **352** |
| `hgt_bdm_de_xuat` | trực tiếp | 0 | 0 | **0** |
| `dai_bdm_kiem_mau` | trực tiếp | 0 | 0 | **0** |
| `hgt_bdm_kiem_mau` | trực tiếp | 0 | 0 | **0** |
| `dai_bdm_tu_choi` | trực tiếp | 0 | 0 | **0** |
| `hgt_bdm_tu_choi` | trực tiếp | 0 | 0 | **0** |
| `dai_cau_lop` | trực tiếp | 0 | 0 | **0** |
| `dai_bdm_doi_ung` | trực tiếp | 0 | 72 | **72** |
| `dai_bdm_doi_ung_cum` | trực tiếp | 0 | 11 | **11** |
| `dai_bdm_nhom_tien_de` | trực tiếp | 0 | 0 | **0** |
| `gami_session_problems` | trực tiếp | 0 | 127 | **127** |
| `gami_grades` | cascade ← gami_session_problems | 0 | 356 | **356** |
| `bai_test_dang_phat_hanh` | trực tiếp | 0 | 1 | **1** |
| `bai_test_cau` | trực tiếp | 0 | 226 | **226** |
| `bai_lam_cau` | cascade ← bai_test_cau | 0 | 112 | **112** |
| `bai_lam_cau_sua_log` | cascade ← bai_lam_cau | 0 | 0 | **0** |
| `bai_test_report` | cascade ← bai_lam_cau | 0 | 0 | **0** |
| `bai_test_cau_phat_hanh` | cascade ← bai_test_cau | 0 | 2 | **2** |
| `bai_test_cham_lai_log` | cascade ← bai_test_cau | 0 | 0 | **0** |
| `bai_lam_goi_y` | cascade ← bai_test_cau | 0 | 0 | **0** |
| `thi_thu_anh` | cascade ← bai_test_cau | 0 | 0 | **0** |
| `ca_test_cau` | trực tiếp | 0 | 49 | **49** |
| `ca_test_cau_kq` | cascade ← ca_test_cau | 0 | 49 | **49** |
| `tu_luyen_dang_lan` | trực tiếp | 0 | 44 | **44** |
| `tai_lieu_phan` | trực tiếp (ref_ma) + cascade con (cha_id) | undefined | NaN | **104** |
| `tai_lieu_cau` | cascade ← tai_lieu_phan | 0 | 293 | **293** |
| `dai_bdm_dang_bai` | trực tiếp | 0 | 17 | **17** |
| `dai_bdm_nhom` | trực tiếp | 0 | 68 | **68** |
| `dai_bdm_o` | trực tiếp | 0 | 9 | **9** |
| `dai_bdm_chuyen_de` | trực tiếp | 0 | 9 | **9** |
| **tổng** | | | | **2266** |

Kèm: `tai_lieu.updated_at` bump 3 giáo trình (CLAUDE.md §2). `dai_bdm_log` thêm 551 dòng (dai_bdm_chuyen_de/xoa 9 · dai_bdm_dang_bai/xoa 17 · dai_bdm_doi_ung/xoa 72 · dai_bdm_doi_ung_cum/xoa 11 · dai_bdm_gan_cau/xoa 365 · dai_bdm_nhom/xoa 68 · dai_bdm_o/xoa 9).

## 2. Cha sẽ RỖNG (không xoá — Thùy quyết)

- Bài test hết câu (11): `0c884c6d-95d6-4bcd-b836-f84448fc9314` (giao_trinh, Toán, 19/8/2026, 21 câu) · `1884b20f-4e45-47aa-bd5d-aee472029476` (giao_trinh, Toán, 19/8/2026, 15 câu) · `4459c150-650f-49ff-828e-31146bc6b4a1` (giao_trinh, Toán, 19/8/2026, 20 câu) · `57aa16f0-c6a4-4fa2-8a1c-d89660576f2a` (btvn, Toán, 19/8/2026, 25 câu) · `8c4f8ea1-91e6-491a-934d-eab917091da8` (et, Toán, 19/8/2026, 15 câu) · `a7bd6de2-0d58-4b4e-aa3e-b4ef37ca36bb` (et, Toán, 19/8/2026, 15 câu) · `a886a34b-c7e5-45ac-aab9-fabc59663dac` (btvn, Toán, 19/8/2026, 23 câu) · `7da4c52e-adff-4982-b021-1c3c580e6af4` (et, Toán, 23/8/2026, 15 câu) · `966eba5a-a8fe-4759-bd6e-a5e81ce4f283` (tu_luyen, Toán, 17/9/2026, 1 câu) · `d2a2b571-9162-4580-b89d-3c06b623bc03` (tu_luyen, Toán, 4/10/2026, 10 câu) · `320e1a4a-71bc-4b5f-b628-526e3f7e30a5` (tu_luyen, Toán, 18/10/2026, 10 câu)
- Buổi × phase hết câu (7): `71a215d4-0bcb-4114-b2aa-3dbcf4fcd9d6`/et (18/6/2026, 3 câu) · `49e92957-90c2-4966-a0f9-d9d0b6d5e02d`/et (27/6/2026, 3 câu) · `def2dd69-9192-4282-937a-e11001d1a3a6`/et (8/7/2026, 3 câu) · `9f55f18b-8fec-4d5d-95dc-d42ca26622ba`/et (18/8/2026, 12 câu) · `d170fd6d-1a7b-43ff-a741-dfe7a611fc34`/btvn (19/8/2026, 25 câu) · `d170fd6d-1a7b-43ff-a741-dfe7a611fc34`/et (19/8/2026, 5 câu) · `6596db77-3a08-489d-8c9f-d3beb1e54cef`/et (23/8/2026, 5 câu)
- Ca test hết câu: 0
- Phần giáo trình cha hết con (4): Giáo Trình 12B / «Buổi 2» (`a9fc02fd-0362-4260-9618-7cbb595f0898`) · Giáo Trình 12B / «Buổi 3» (`3430c403-92d7-4956-a879-7ea8038d58c7`) · Giáo trình 12A / «Buổi 4» (`b81b9c58-ac1b-4ad8-be6e-07396889d096`) · Giáo trình 12A / «Buổi 2» (`e36d08c8-9f16-4b51-93e2-94643530991a`)
- Giáo trình: «Giáo trình 12A» mất 27/43 phần · «Giáo Trình 12B» mất 37/50 phần · «Ôn tập hàm số» mất 40/42 phần
- **MT**: buổi `053e2447-afc0-4120-a8f3-5c738ac25780` xoá 29/30 câu MT; kỳ thi `bf6205b0-ac39-4a72-9a58-1f2518b0bec1` có 5 dòng `diem_thi` — giữ nguyên (xem VAN-DE-xoa.md)

## 3. Id cũ sẽ xoá (94)

### NCD00094 (HS)

| loại | id | tên | cha |
|---|---|---|---|
| chuyên đề | NCH00343 | Khảo sát và vẽ đồ thị hàm số |  |
| chuyên đề | NCH00344 | Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |  |
| chuyên đề | NCH00428 | Các đặc trưng của hàm số |  |
| dang | NDB00620 | Tiệm cận ngang khi biết hàm số | NNB01178 Tìm tiệm cận ngang của hàm số |
| dang | NDB00621 | Tìm tiệm cận khi biết đồ thị hoặc bảng biến thiên | NNB01178 Tìm tiệm cận ngang của hàm số |
| dang | NDB00622 | Tìm tiệm cận đứng của hàm số | NNB01179 Tìm tiệm cận đứng của hàm số |
| dang | NDB00623 | Tìm tiệm cận đứng khi biết đồ thị và bảng thiến thiên | NNB01179 Tìm tiệm cận đứng của hàm số |
| dang | NDB00624 | Tiệm cận của hàm hợp | NNB01179 Tìm tiệm cận đứng của hàm số |
| dang | NDB00804 | Xét tính đơn điệu của hàm số khi biết bảng biến thiên hoặc đồ thị hàm số | NNB01503 Tính đơn điệu của hàm số |
| dang | NDB00805 | Xét tính đơn điệu của khi biết hàm số | NNB01503 Tính đơn điệu của hàm số |
| dang | NDB00806 | Xét tính đơn điệu dựa của hàm phức tạp khi biết hàm f' | NNB01503 Tính đơn điệu của hàm số |
| dang | NDB00807 | Xét tính đơn điệu dựa của hàm phức tạp khi biết đồ thị hàm số hoặc bảng biến thiên của hàm f' | NNB01503 Tính đơn điệu của hàm số |
| dang | NDB00811 | Tìm cực trị của hàm số cho trước | NNB01504 Cực trị của hàm số |
| dang | NDB00812 | Tìm cực trị qua bảng biến thiên hoặc đồ thị hàm số | NNB01504 Cực trị của hàm số |
| nhom | NNB01178 | Tìm tiệm cận ngang của hàm số | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01179 | Tìm tiệm cận đứng của hàm số | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01180 | Tìm tiệm cận xiên của hàm số | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01181 | Tìm tiệm cận xiên của hàm số khi biết đồ thị hoặc bảng biến thiên | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01182 | Tiệm cận của hàm căn thức | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01183 | Tìm tiệm cận bằng định nghĩa | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01184 | góc giữa đường thẳng và tiệm cận | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01185 | Tìm GTLN - GTNN của hàm số trên khoảng cho trước khi biết đồ thị hoặc bảng biến thiên | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01186 | Tìm GTLN - GTNN trên khoảng cho trước khi biết hàm số | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01187 | Ứng dụng GTLN - GTNN | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01188 | Bài toán liên quan đến hệ số hàm bậc 3 | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01189 | Bài toán liên quan đến đồ thị hàm số bậc 3 | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01190 | Bài toán liên quan đến cực trị hàm bậc 3 | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01191 | Bài toán liên quan đến các hệ số của hàm bậc nhất trên bậc nhất | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01192 | Bài toán liên quan đến đồ thị hàm số bậc nhất trên bậc nhất | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01193 | Bài toán liên quan đến khoảng cách đến hai đường tiệm cận hàm bậc nhất trên bậc nhất | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01194 | Bài toán liên quan hệ số của hàm bậc hai trên bậc nhất | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01195 | Bài toán liên quan đến đồ thị hàm bậc hai trên bậc nhất | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01196 | Phương trình đường thẳng đi qua hai điểm cực trị | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01197 | Một số bài toán cơ bản liên quan đến phương trình tiếp tuyến | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01198 | Khoảng cách đến các tiệm cận | NCH00343 Khảo sát và vẽ đồ thị hàm số |
| nhom | NNB01199 | Các bài toán có sẵn mô hình : diện tích , thể tích , doanh thu, lợi nhuận, khỏang cách (đang phân lại — lô đầu) | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01200 | Các bài toán thực tế có sẵn biểu thức (đang phân lại — lô đầu) | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01201 | Tối ưu khi hàm số đã cho sẵn | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01202 | Tối ưu phải lập hàm từ hình học | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01203 | Tối ưu phải lập hàm từ kinh tế | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01204 | Tối ưu quãng đường – thời gian | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01205 | Chuyển động: quãng đường – vận tốc – gia tốc | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01206 | Tốc độ thay đổi của một đại lượng | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01207 | Tốc độ liên quan giữa hai đại lượng | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01208 | Tiệm cận và giới hạn dài hạn trong mô hình | NCH00344 Ứng dụng đạo hàm để giải quyết một số vấn đề thực tiễn |
| nhom | NNB01503 | Tính đơn điệu của hàm số | NCH00428 Các đặc trưng của hàm số |
| nhom | NNB01504 | Cực trị của hàm số | NCH00428 Các đặc trưng của hàm số |

### NCD00096 (VT)

| loại | id | tên | cha |
|---|---|---|---|
| chuyên đề | NCH00348 | Vectơ trong không gian |  |
| chuyên đề | NCH00349 | Hệ trục toạ độ trong không gian |  |
| chuyên đề | NCH00350 | Biểu thức toạ độ của các phép toán vectơ |  |
| dang | NDB00640 | Hình hộp | NNB01230 Tổng hiệu giữa các vecto |
| dang | NDB00641 | Lăng trụ | NNB01230 Tổng hiệu giữa các vecto |
| dang | NDB00642 | Hình chóp | NNB01230 Tổng hiệu giữa các vecto |
| dang | NDB00643 | Tích của 2 vector độc lập | NNB01231 Tính tích vô hướng giữa hai vecto khi biết góc |
| dang | NDB00644 | Tích của 2 vector trên hình | NNB01231 Tính tích vô hướng giữa hai vecto khi biết góc |
| dang | NDB00645 | Tính góc giữa 2 vector độc lập | NNB01232 Tính góc giữa hai vecto khi biết tích vô hướng |
| nhom | NNB01230 | Tổng hiệu giữa các vecto | NCH00348 Vectơ trong không gian |
| nhom | NNB01231 | Tính tích vô hướng giữa hai vecto khi biết góc | NCH00348 Vectơ trong không gian |
| nhom | NNB01232 | Tính góc giữa hai vecto khi biết tích vô hướng | NCH00348 Vectơ trong không gian |
| nhom | NNB01233 | Dùng hệ thức trung điểm, trọng tâm để tính toán hoặc chứng minh. | NCH00348 Vectơ trong không gian |
| nhom | NNB01234 | Tính góc giữa hai vecto trong một số hình đặc biệt | NCH00348 Vectơ trong không gian |
| nhom | NNB01235 | Điều kiện đồng phẳng giữa các vecto | NCH00348 Vectơ trong không gian |
| nhom | NNB01236 | Một số mô hình toán thực tế liên quan đến Lực | NCH00348 Vectơ trong không gian |
| nhom | NNB01237 | Tích có hướng giữa hai vecto và ứng dụng | NCH00349 Hệ trục toạ độ trong không gian |
| nhom | NNB01238 | Tìm tọa độ điểm hoặc vecto một điều kiện cho trước. | NCH00349 Hệ trục toạ độ trong không gian |
| nhom | NNB01239 | Một số mô hình toán thực tế | NCH00349 Hệ trục toạ độ trong không gian |
| nhom | NNB01240 | Tìm toạ độ của điểm hoặc véc tơ từ dữ kiện cho trước | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01241 | Tính tổng, hiệu, tích của véc tơ với một số theo toạ độ | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01242 | Tính tích vô hướng và góc giữa hai véc tơ theo toạ độ | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01243 | Tính độ dài véc tơ hoặc khoảng cách giữa hai điểm | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01244 | Dùng hệ thức trung điểm, trọng tâm theo toạ độ | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01245 | Xét hai véc tơ cùng phương, vuông góc hoặc ba véc tơ đồng phẳng | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01246 | Tìm điểm thoả mãn điều kiện cho trước hoặc cực trị hình học (tâm tỉ cự) | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01247 | Toạ độ hoá một số bài toán hình học không gian | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01248 | Điều kiện cùng phương của hai vecto | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01249 | Toán thực tế liên quan đến vecto vận tốc | NCH00350 Biểu thức toạ độ của các phép toán vectơ |
| nhom | NNB01250 | Một số bài toán thực tế liên quan đến Lực | NCH00350 Biểu thức toạ độ của các phép toán vectơ |

### NCD00097 (XS)

| loại | id | tên | cha |
|---|---|---|---|
| chuyên đề | NCH00351 | Xác suất có điều kiện |  |
| chuyên đề | NCH00352 | Công thức xác suất toàn phần và công thức Bayes |  |
| nhom | NNB01251 | Tính xác suất có điều kiện khi đã cho sẵn các xác suất bằng số | NCH00351 Xác suất có điều kiện |
| nhom | NNB01252 | Tính xác suất có điều kiện từ bảng số liệu hoặc dữ kiện đếm | NCH00351 Xác suất có điều kiện |
| nhom | NNB01253 | Công thức nhân xác suất và sơ đồ hình cây | NCH00351 Xác suất có điều kiện |
| nhom | NNB01254 | Kiểm tra tính độc lập của hai biến cố | NCH00351 Xác suất có điều kiện |
| nhom | NNB01255 | Tính xác suất bằng công thức xác suất toàn phần | NCH00352 Công thức xác suất toàn phần và công thức Bayes |
| nhom | NNB01256 | Tính xác suất hậu nghiệm bằng công thức Bayes | NCH00352 Công thức xác suất toàn phần và công thức Bayes |
| nhom | NNB01257 | Giải bài toán thực tiễn bằng công thức toàn phần hoặc Bayes | NCH00352 Công thức xác suất toàn phần và công thức Bayes |

### NCD00098 (SDT)

| loại | id | tên | cha |
|---|---|---|---|
| chuyên đề | NCH00353 | Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm |  |
| nhom | NNB01258 | Tính khoảng biến thiên của mẫu số liệu ghép nhóm | NCH00353 Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm |
| nhom | NNB01259 | Tính tứ phân vị và khoảng tứ phân vị của mẫu ghép nhóm | NCH00353 Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm |
| nhom | NNB01260 | Tính phương sai và độ lệch chuẩn của mẫu ghép nhóm | NCH00353 Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm |
| nhom | NNB01261 | So sánh độ phân tán của hai mẫu số liệu | NCH00353 Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm |
| nhom | NNB01262 | Ý nghĩa và lựa chọn số đặc trưng phù hợp | NCH00353 Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm |
| nhom | NNB01263 | Lập bảng ghép nhóm từ số liệu thô rồi tính số đặc trưng | NCH00353 Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm |
| nhom | NNB01264 | Phát hiện giá trị bất thường bằng tứ phân vị | NCH00353 Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm |

