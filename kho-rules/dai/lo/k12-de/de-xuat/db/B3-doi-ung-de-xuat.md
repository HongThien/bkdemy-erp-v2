# B3 — Đối ứng dạng/nhóm CŨ → cây MỚI (ĐỀ XUẤT, CHƯA QUYẾT)

> Sinh 03/11 bằng SELECT. **Chỉ đề xuất — Thùy quyết.** Mã mới ghi theo mã LOGIC của JSON (C1.1.1…); mã DB NDB/NNB thật chỉ có sau khi `ghi-cay.mjs --ghi` (xem `db/ma-moi-<CH>.json`). Mã in trong `B2-dry-run.txt` là mã chạy thử, đã bỏ.

**Nhân chứng dùng:** (1) `dai_bdm_gan_cau` — câu đang gán ở dạng cũ; (2) `<CH>-cau.tsv` — câu đề thi đã được xếp vào dạng mới khi dựng cây (độc lập với gán cũ). "Tái dùng id" chỉ đáng xét khi ≥90% câu tìm thấy rơi vào MỘT dạng mới và số câu tìm thấy đủ lớn; còn lại = dạng cũ bị TÁCH ⇒ không tái dùng id, chuyển câu theo tsv (câu không có trong tsv ⇒ phân lại B4, không chuyển bừa).

**Vì sao tái dùng id quan trọng:** id cũ đang bị tham chiếu KHÔNG-FK (ET `gami_session_problems`, `bai_test_cau`, `ca_test_cau`, `tu_luyen_dang_lan`, giáo trình `tai_lieu_phan`) — xem `B1-do-hien-trang.md`. Tái dùng = UPDATE tên/mô tả/LT/VD + chuyển `nhom_id` của dạng cũ (ĐÈ nội dung Thùy viết, log giữ bản cũ) ⇒ cần Thùy gật riêng; `ghi-cay.mjs` hiện KHÔNG làm việc này.

## HS (NCD00094) — dạng cũ

| dạng cũ | tên cũ | câu gán (nguồn) | tìm thấy trong tsv | phân bố sang dạng mới | đề xuất |
|---|---|---|---|---|---|
| NDB00804 | Xét tính đơn điệu của hàm số khi biết bảng biến thiên hoặc đồ thị hàm số | 239 (doi_ung 239) | 219/239 | C1.1.3 «Đọc khoảng đơn điệu từ bảng biến thiên» 97<br>C1.1.4 «Đọc khoảng đơn điệu từ đồ thị hàm số» 85<br>C1.1.5 «Suy đơn điệu từ bảng xét dấu hoặc đồ thị» 35<br>C1.3.6 «Đọc GTLN, GTNN từ bảng biến thiên hoặc b» 1<br>C2.1.2 «Nhận dạng đồ thị hàm bậc nhất trên bậc n» 1 | TÁCH (5 dạng mới, lớn nhất 44%) ⇒ không tái dùng id; chuyển 219 câu theo tsv, 20 câu còn lại phân lại |
| NDB00805 | Xét tính đơn điệu của khi biết hàm số | 187 (doi_ung 186, ai 1) | 142/187 | C1.1.1 «Tìm khoảng đơn điệu của hàm đa thức, phâ» 69<br>C1.1.6 «Xét đơn điệu khi f′ cho dạng tích» 18<br>C1.1.2 «Tìm khoảng đơn điệu của hàm căn, mũ, log» 16<br>C2.2.5 «Tìm m để hàm đa thức đơn điệu trên ℝ hoặ» 14<br>C2.3.3 «Tìm tham số cho hàm nhất biến» 8<br>C1.1.5 «Suy đơn điệu từ bảng xét dấu hoặc đồ thị» 4 | TÁCH (15 dạng mới, lớn nhất 49%) ⇒ không tái dùng id; chuyển 142 câu theo tsv, 45 câu còn lại phân lại |
| NDB00806 | Xét tính đơn điệu dựa của hàm phức tạp khi biết hàm f' | 22 (doi_ung 22) | 0/22 | — | KHÔNG có nhân chứng câu (câu cụm cũ, không phải câu đề thi). Gợi ý THEO TÊN (độ tin thấp): C2.5.1 «Xét đơn điệu của hàm hợp f(u(x)) khi biết f′» ⇒ hỏi Thùy; câu ⇒ phân lại B4 |
| NDB00807 | Xét tính đơn điệu dựa của hàm phức tạp khi biết đồ thị hàm số hoặc bảng biến thiên của hàm f' | 31 (doi_ung 31) | 31/31 | C1.1.5 «Suy đơn điệu từ bảng xét dấu hoặc đồ thị» 13<br>C1.2.5 «Suy cực trị từ bảng xét dấu hoặc đồ thị » 10<br>C2.5.2 «Đếm cực trị của hàm hợp, hàm chứa trị tu» 5<br>C2.5.1 «Xét đơn điệu của hàm hợp f(u(x)) khi biế» 3 | TÁCH (4 dạng mới, lớn nhất 42%) ⇒ không tái dùng id; chuyển 31 câu theo tsv, 0 câu còn lại phân lại |
| NDB00620 | Tiệm cận ngang khi biết hàm số | 41 (cum 40, ai 1) | 1/41 | C1.4.1 «Tìm tiệm cận đứng, ngang của hàm bậc nhấ» 1 | ÍT NHÂN CHỨNG (1/41 câu) ⇒ không đủ để tái dùng id; chuyển 1 câu theo tsv, 40 câu còn lại phân lại B4 |
| NDB00621 | Tìm tiệm cận khi biết đồ thị hoặc bảng biến thiên | 15 (cum 12, ai 3) | 0/15 | — | KHÔNG có nhân chứng câu (câu cụm cũ, không phải câu đề thi). Gợi ý THEO TÊN (độ tin thấp): C1.4.5 «Đọc và đếm tiệm cận từ bảng biến thiên» ⇒ hỏi Thùy; câu ⇒ phân lại B4 |
| NDB00622 | Tìm tiệm cận đứng của hàm số | 31 (cum 31) | 0/31 | — | KHÔNG có nhân chứng câu (câu cụm cũ, không phải câu đề thi). Gợi ý THEO TÊN (độ tin thấp): C1.4.1 «Tìm tiệm cận đứng, ngang của hàm bậc nhất trên bậc nhất» ⇒ hỏi Thùy; câu ⇒ phân lại B4 |
| NDB00623 | Tìm tiệm cận đứng khi biết đồ thị và bảng thiến thiên | 9 (cum 9) | 0/9 | — | KHÔNG có nhân chứng câu (câu cụm cũ, không phải câu đề thi). Gợi ý THEO TÊN (độ tin thấp): C1.4.3 «Tìm tiệm cận xiên» ⇒ hỏi Thùy; câu ⇒ phân lại B4 |
| NDB00624 | Tiệm cận của hàm hợp | 3 (cum 3) | 0/3 | — | KHÔNG có nhân chứng câu (câu cụm cũ, không phải câu đề thi). Gợi ý THEO TÊN (độ tin thấp): C2.5.4 «Tiệm cận của hàm hợp hoặc hàm có tham số» ⇒ hỏi Thùy; câu ⇒ phân lại B4 |
| NDB00811 | Tìm cực trị của hàm số cho trước | 155 (doi_ung 151, ai 4) | 126/155 | C1.2.1 «Tìm cực trị của hàm đa thức» 47<br>C1.2.6 «Đếm cực trị khi f′ cho dạng tích» 46<br>C1.2.2 «Tìm cực trị của hàm phân thức, căn, mũ, » 26<br>C2.2.4 «Hai điểm cực trị bậc ba: độ dài, diện tí» 2<br>C2.2.2 «Lập công thức hàm bậc ba từ đồ thị hoặc » 1<br>C2.5.2 «Đếm cực trị của hàm hợp, hàm chứa trị tu» 1 | TÁCH (9 dạng mới, lớn nhất 37%) ⇒ không tái dùng id; chuyển 126 câu theo tsv, 29 câu còn lại phân lại |
| NDB00812 | Tìm cực trị qua bảng biến thiên hoặc đồ thị hàm số | 219 (doi_ung 217, ai 2) | 213/219 | C1.2.3 «Đọc cực trị từ bảng biến thiên» 111<br>C1.2.4 «Đọc cực trị từ đồ thị hàm số» 63<br>C1.2.5 «Suy cực trị từ bảng xét dấu hoặc đồ thị » 37<br>C1.4.4 «Đọc tiệm cận từ đồ thị» 1<br>C1.1.3 «Đọc khoảng đơn điệu từ bảng biến thiên» 1 | TÁCH (5 dạng mới, lớn nhất 52%) ⇒ không tái dùng id; chuyển 213 câu theo tsv, 6 câu còn lại phân lại |

## HS (NCD00094) — nhóm cũ (chỉ gợi ý THEO TÊN, độ tin thấp)

| nhóm cũ | tên cũ | LT Thùy viết (ký tự) | giáo trình trỏ tới (tai_lieu_phan) | gợi ý nhóm mới gần tên nhất |
|---|---|---|---|---|
| NNB01188 | Bài toán liên quan đến hệ số hàm bậc 3 | 769 | — | C2.2 «Hàm bậc ba (và đa thức bậc cao có tham số)» |
| NNB01189 | Bài toán liên quan đến đồ thị hàm số bậc 3 | 1740 | Ôn tập hàm số (nhom); Ôn tập hàm số (nhom_chua_phan); Ôn tập hàm số (btvn_nhom) | C2.1 «Nhận dạng hàm số qua đồ thị, bảng biến thiên» |
| NNB01190 | Bài toán liên quan đến cực trị hàm bậc 3 | 0 | — | C1.2 «Cực trị» |
| NNB01191 | Bài toán liên quan đến các hệ số của hàm bậc nhất trên bậc nhất | 474 | Ôn tập hàm số (nhom); Ôn tập hàm số (nhom_chua_phan); Ôn tập hàm số (btvn_nhom) | C2.3 «Hàm bậc nhất trên bậc nhất» |
| NNB01192 | Bài toán liên quan đến đồ thị hàm số bậc nhất trên bậc nhất | 0 | Ôn tập hàm số (nhom); Ôn tập hàm số (nhom_chua_phan); Ôn tập hàm số (btvn_nhom) | C2.3 «Hàm bậc nhất trên bậc nhất» |
| NNB01193 | Bài toán liên quan đến khoảng cách đến hai đường tiệm cận hàm bậc nhất trên bậc nhất | 0 | — | C1.4 «Tiệm cận» |
| NNB01194 | Bài toán liên quan hệ số của hàm bậc hai trên bậc nhất | 126 | Ôn tập hàm số (nhom); Ôn tập hàm số (nhom_chua_phan); Ôn tập hàm số (btvn_nhom) | C2.3 «Hàm bậc nhất trên bậc nhất» |
| NNB01195 | Bài toán liên quan đến đồ thị hàm bậc hai trên bậc nhất | 129 | Ôn tập hàm số (nhom); Ôn tập hàm số (nhom_chua_phan); Ôn tập hàm số (btvn_nhom) | C2.3 «Hàm bậc nhất trên bậc nhất» |
| NNB01196 | Phương trình đường thẳng đi qua hai điểm cực trị | 1106 | — | C1.2 «Cực trị» |
| NNB01197 | Một số bài toán cơ bản liên quan đến phương trình tiếp tuyến | 3704 | — | C3.2 «Tiếp tuyến» |
| NNB01198 | Khoảng cách đến các tiệm cận | 0 | — | C1.4 «Tiệm cận» |
| NNB01199 | Các bài toán có sẵn mô hình : diện tích , thể tích , doanh thu, lợi nhuận, khỏang cách (đang phân lại — lô đầu) | 0 | — | C4.1 «Hàm mô hình cho sẵn» |
| NNB01200 | Các bài toán thực tế có sẵn biểu thức (đang phân lại — lô đầu) | 0 | — | — (không gần tên nào) |
| NNB01201 | Tối ưu khi hàm số đã cho sẵn | 0 | — | C4.2 «Tối ưu phải lập hàm từ hình học» |
| NNB01202 | Tối ưu phải lập hàm từ hình học | 0 | — | C4.2 «Tối ưu phải lập hàm từ hình học» |
| NNB01203 | Tối ưu phải lập hàm từ kinh tế | 0 | — | C4.4 «Tối ưu kinh tế» |
| NNB01204 | Tối ưu quãng đường – thời gian | 0 | — | C4.3 «Tối ưu đường đi, khoảng cách, góc» |
| NNB01205 | Chuyển động: quãng đường – vận tốc – gia tốc | 0 | — | C4.5 «Chuyển động: vận tốc, gia tốc» |
| NNB01206 | Tốc độ thay đổi của một đại lượng | 0 | — | C4.6 «Tốc độ thay đổi của đại lượng» |
| NNB01207 | Tốc độ liên quan giữa hai đại lượng | 0 | — | C4.6 «Tốc độ thay đổi của đại lượng» |
| NNB01208 | Tiệm cận và giới hạn dài hạn trong mô hình | 0 | — | C1.4 «Tiệm cận» |
| NNB01503 | Tính đơn điệu của hàm số | 0 | Ôn tập hàm số (nhom); Ôn tập hàm số (btvn_nhom) | C1.1 «Tính đơn điệu» |
| NNB01185 | Tìm GTLN - GTNN của hàm số trên khoảng cho trước khi biết đồ thị hoặc bảng biến thiên | 414 | Ôn tập hàm số (nhom); Ôn tập hàm số (nhom_chua_phan) | C2.1 «Nhận dạng hàm số qua đồ thị, bảng biến thiên» |
| NNB01186 | Tìm GTLN - GTNN trên khoảng cho trước khi biết hàm số | 0 | Ôn tập hàm số (nhom); Ôn tập hàm số (nhom_chua_phan) | — (không gần tên nào) |
| NNB01187 | Ứng dụng GTLN - GTNN | 414 | Ôn tập hàm số (nhom); Ôn tập hàm số (nhom_chua_phan); Ôn tập hàm số (btvn_nhom) | — (không gần tên nào) |
| NNB01178 | Tìm tiệm cận ngang của hàm số | 886 | Ôn tập hàm số (nhom); Ôn tập hàm số (btvn_nhom) | C1.4 «Tiệm cận» |
| NNB01179 | Tìm tiệm cận đứng của hàm số | 1297 | Ôn tập hàm số (nhom); Ôn tập hàm số (btvn_nhom) | C1.4 «Tiệm cận» |
| NNB01180 | Tìm tiệm cận xiên của hàm số | 278 | — | C1.4 «Tiệm cận» |
| NNB01181 | Tìm tiệm cận xiên của hàm số khi biết đồ thị hoặc bảng biến thiên | 0 | — | C1.4 «Tiệm cận» |
| NNB01182 | Tiệm cận của hàm căn thức | 0 | Ôn tập hàm số (nhom); Ôn tập hàm số (nhom_chua_phan); Ôn tập hàm số (btvn_nhom) | C1.4 «Tiệm cận» |
| NNB01183 | Tìm tiệm cận bằng định nghĩa | 0 | — | C1.4 «Tiệm cận» |
| NNB01184 | góc giữa đường thẳng và tiệm cận | 0 | — | C1.4 «Tiệm cận» |
| NNB01504 | Cực trị của hàm số | 0 | Ôn tập hàm số (nhom); Ôn tập hàm số (btvn_nhom) | C1.2 «Cực trị» |

## VT (NCD00096) — dạng cũ

| dạng cũ | tên cũ | câu gán (nguồn) | tìm thấy trong tsv | phân bố sang dạng mới | đề xuất |
|---|---|---|---|---|---|
| NDB00640 | Hình hộp | 42 (ai 3, cum 39) | 4/42 | C1.2.1 «Rút gọn tổng, hiệu vectơ trong hình hộp,» 4 | ÍT NHÂN CHỨNG (4/42 câu) ⇒ không đủ để tái dùng id; chuyển 4 câu theo tsv, 38 câu còn lại phân lại B4 |
| NDB00641 | Lăng trụ | 5 (cum 5) | 0/5 | — | KHÔNG có nhân chứng câu (câu cụm cũ, không phải câu đề thi). Gợi ý THEO TÊN (độ tin thấp): C1.2.1 «Rút gọn tổng, hiệu vectơ trong hình hộp, lăng trụ» ⇒ hỏi Thùy; câu ⇒ phân lại B4 |
| NDB00642 | Hình chóp | 19 (cum 14, ai 5) | 3/19 | C1.2.2 «Rút gọn tổng, hiệu vectơ trong hình chóp» 3 | ÍT NHÂN CHỨNG (3/19 câu) ⇒ không đủ để tái dùng id; chuyển 3 câu theo tsv, 16 câu còn lại phân lại B4 |
| NDB00643 | Tích của 2 vector độc lập | 40 (cum 16, ai 24) | 2/40 | C2.1.1 «Đọc toạ độ vectơ viết theo i, j, k» 2 | ÍT NHÂN CHỨNG (2/40 câu) ⇒ không đủ để tái dùng id; chuyển 2 câu theo tsv, 38 câu còn lại phân lại B4 |
| NDB00644 | Tích của 2 vector trên hình | 27 (cum 25, ai 2) | 0/27 | — | KHÔNG có nhân chứng câu (câu cụm cũ, không phải câu đề thi). Gợi ý THEO TÊN (độ tin thấp): C1.3.2 «Tính tích vô hướng hai vectơ trên hình khối» ⇒ hỏi Thùy; câu ⇒ phân lại B4 |
| NDB00645 | Tính góc giữa 2 vector độc lập | 21 (cum 21) | 0/21 | — | KHÔNG có nhân chứng câu (câu cụm cũ, không phải câu đề thi). Gợi ý THEO TÊN (độ tin thấp): C1.3.3 «Tính góc giữa hai vectơ trên hình khối» ⇒ hỏi Thùy; câu ⇒ phân lại B4 |

## VT (NCD00096) — nhóm cũ (chỉ gợi ý THEO TÊN, độ tin thấp)

| nhóm cũ | tên cũ | LT Thùy viết (ký tự) | giáo trình trỏ tới (tai_lieu_phan) | gợi ý nhóm mới gần tên nhất |
|---|---|---|---|---|
| NNB01230 | Tổng hiệu giữa các vecto | 921 | Giáo trình 12A (nhom); Giáo trình 12A (btvn_nhom); Giáo trình 12A (nhom); Giáo trình 12A (btvn_nhom); Giáo Trình 12B (nhom); Giáo Trình 12B (btvn_nhom); Giáo Trình 12B (nhom); Giáo Trình 12B (btvn_nhom); Giáo Trình 12B (nhom); Giáo Trình 12B (btvn_nhom) | — (không gần tên nào) |
| NNB01231 | Tính tích vô hướng giữa hai vecto khi biết góc | 212 | Giáo trình 12A (nhom); Giáo trình 12A (btvn_nhom); Giáo trình 12A (nhom); Giáo trình 12A (btvn_nhom); Giáo Trình 12B (nhom); Giáo Trình 12B (btvn_nhom) | C1.3 «Tích vô hướng và góc giữa hai vectơ trên hình» |
| NNB01232 | Tính góc giữa hai vecto khi biết tích vô hướng | 257 | Giáo Trình 12B (nhom); Giáo Trình 12B (btvn_nhom) | C1.3 «Tích vô hướng và góc giữa hai vectơ trên hình» |
| NNB01233 | Dùng hệ thức trung điểm, trọng tâm để tính toán hoặc chứng minh. | 683 | Giáo Trình 12B (nhom); Giáo Trình 12B (nhom_chua_phan); Giáo Trình 12B (btvn_nhom); Giáo Trình 12B (nhom); Giáo Trình 12B (nhom_chua_phan); Giáo Trình 12B (btvn_nhom) | — (không gần tên nào) |
| NNB01234 | Tính góc giữa hai vecto trong một số hình đặc biệt | 0 | Giáo Trình 12B (nhom); Giáo Trình 12B (nhom_chua_phan); Giáo Trình 12B (btvn_nhom); Giáo Trình 12B (nhom); Giáo Trình 12B (nhom_chua_phan); Giáo Trình 12B (btvn_nhom) | C1.3 «Tích vô hướng và góc giữa hai vectơ trên hình» |
| NNB01235 | Điều kiện đồng phẳng giữa các vecto | 608 | Giáo Trình 12B (nhom); Giáo Trình 12B (nhom_chua_phan); Giáo Trình 12B (btvn_nhom) | — (không gần tên nào) |
| NNB01236 | Một số mô hình toán thực tế liên quan đến Lực | 0 | Giáo Trình 12B (nhom); Giáo Trình 12B (nhom_chua_phan); Giáo Trình 12B (btvn_nhom) | — (không gần tên nào) |
| NNB01237 | Tích có hướng giữa hai vecto và ứng dụng | 1685 | — | C1.3 «Tích vô hướng và góc giữa hai vectơ trên hình» |
| NNB01238 | Tìm tọa độ điểm hoặc vecto một điều kiện cho trước. | 563 | Giáo trình 12A (nhom); Giáo trình 12A (btvn_nhom) | C3.2 «Tìm toạ độ điểm» |
| NNB01239 | Một số mô hình toán thực tế | 0 | Giáo trình 12A (nhom); Giáo trình 12A (nhom_chua_phan); Giáo trình 12A (btvn_nhom) | C4.2 «Mô hình công trình, đồ vật bằng toạ độ» |
| NNB01240 | Tìm toạ độ của điểm hoặc véc tơ từ dữ kiện cho trước | 0 | — | C3.2 «Tìm toạ độ điểm» |
| NNB01241 | Tính tổng, hiệu, tích của véc tơ với một số theo toạ độ | 229 | — | C3.2 «Tìm toạ độ điểm» |
| NNB01242 | Tính tích vô hướng và góc giữa hai véc tơ theo toạ độ | 791 | — | C3.4 «Tích vô hướng, góc, vuông góc và tích có hướng theo toạ độ» |
| NNB01243 | Tính độ dài véc tơ hoặc khoảng cách giữa hai điểm | 400 | — | C3.3 «Độ dài vectơ và khoảng cách giữa hai điểm» |
| NNB01244 | Dùng hệ thức trung điểm, trọng tâm theo toạ độ | 495 | — | C3.2 «Tìm toạ độ điểm» |
| NNB01245 | Xét hai véc tơ cùng phương, vuông góc hoặc ba véc tơ đồng phẳng | 0 | — | — (không gần tên nào) |
| NNB01246 | Tìm điểm thoả mãn điều kiện cho trước hoặc cực trị hình học (tâm tỉ cự) | 1337 | — | — (không gần tên nào) |
| NNB01247 | Toạ độ hoá một số bài toán hình học không gian | 0 | — | C3.2 «Tìm toạ độ điểm» |
| NNB01248 | Điều kiện cùng phương của hai vecto | 333 | — | — (không gần tên nào) |
| NNB01249 | Toán thực tế liên quan đến vecto vận tốc | 0 | Giáo trình 12A (nhom); Giáo trình 12A (nhom_chua_phan); Giáo trình 12A (btvn_nhom); Giáo trình 12A (nhom); Giáo trình 12A (nhom_chua_phan); Giáo trình 12A (btvn_nhom) | — (không gần tên nào) |
| NNB01250 | Một số bài toán thực tế liên quan đến Lực | 0 | Giáo trình 12A (nhom); Giáo trình 12A (nhom_chua_phan); Giáo trình 12A (btvn_nhom); Giáo trình 12A (nhom); Giáo trình 12A (nhom_chua_phan); Giáo trình 12A (btvn_nhom) | — (không gần tên nào) |

## XS (NCD00097) — chỉ có nhóm cũ, 0 dạng, 0 câu gán

Nhân chứng = trường `tu`/`gop` trong JSON (người dựng cây ghi rõ nhóm cũ nào đi vào dạng mới nào). Nhóm cũ ≠ dạng mới (khác bảng) nên không "tái dùng id" được; chỉ để biết đường đi của `dai_bdm_doi_ung.dich_nhom`.

| nhóm cũ | tên cũ | đi vào | 
|---|---|---|
| NNB01251 | Tính xác suất có điều kiện khi đã cho sẵn các xác suất bằng số | C1.1.2 «Tính P(A|B) khi cho sẵn P(AB), P(A), P(B)» (nhóm mới C1.1 «Công thức xác suất có điều kiện») |
| NNB01252 | Tính xác suất có điều kiện từ bảng số liệu hoặc dữ kiện đếm | C1.2.1 «Tính xác suất có điều kiện từ bảng số liệu, t» (nhóm mới C1.2 «Tính xác suất có điều kiện bằng đếm») |
| NNB01253 | Công thức nhân xác suất và sơ đồ hình cây | C1.3.1 «Tính xác suất giao bằng công thức nhân, sơ đồ» (nhóm mới C1.3 «Công thức nhân xác suất và biến cố độc lập») |
| NNB01254 | Kiểm tra tính độc lập của hai biến cố | C1.3.2 «Dùng tính độc lập của hai biến cố» (nhóm mới C1.3 «Công thức nhân xác suất và biến cố độc lập») |
| NNB01255 | Tính xác suất bằng công thức xác suất toàn phần | C2.1.3 «Bài toán thực tế tính xác suất bằng công thức» (nhóm mới C2.1 «Công thức xác suất toàn phần cơ bản») |
| NNB01256 | Tính xác suất hậu nghiệm bằng công thức Bayes | C2.3.1 «Tính xác suất hậu nghiệm bằng công thức Bayes» (nhóm mới C2.3 «Công thức Bayes») |
| NNB01257 | Giải bài toán thực tiễn bằng công thức toàn phần hoặc Bayes | C2.3.2 «Bayes nhiều tầng hoặc sau khi chuyển hộp» (nhóm mới C2.3 «Công thức Bayes») |

## SDT (NCD00098) — chỉ có nhóm cũ, 0 dạng, 0 câu gán

Nhân chứng = trường `tu`/`gop` trong JSON (người dựng cây ghi rõ nhóm cũ nào đi vào dạng mới nào). Nhóm cũ ≠ dạng mới (khác bảng) nên không "tái dùng id" được; chỉ để biết đường đi của `dai_bdm_doi_ung.dich_nhom`.

| nhóm cũ | tên cũ | đi vào | 
|---|---|---|
| NNB01258 | Tính khoảng biến thiên của mẫu số liệu ghép nhóm | C1.1.1 «Tính khoảng biến thiên của mẫu số liệu ghép n» (nhóm mới C1.1 «Khoảng biến thiên») |
| NNB01259 | Tính tứ phân vị và khoảng tứ phân vị của mẫu ghép nhóm | C1.2.3 «Tính khoảng tứ phân vị từ bảng ghép nhóm» (nhóm mới C1.2 «Tứ phân vị và khoảng tứ phân vị») |
| NNB01260 | Tính phương sai và độ lệch chuẩn của mẫu ghép nhóm | C1.3.1 «Tính phương sai, độ lệch chuẩn từ bảng ghép n» (nhóm mới C1.3 «Phương sai và độ lệch chuẩn») |
| NNB01261 | So sánh độ phân tán của hai mẫu số liệu | C2.1.1 «So sánh độ phân tán của hai mẫu số liệu ghép » (nhóm mới C2.1 «So sánh độ phân tán») |
| NNB01262 | Ý nghĩa và lựa chọn số đặc trưng phù hợp | C1.3.2 «Quan hệ phương sai – độ lệch chuẩn, công thức» (nhóm mới C1.3 «Phương sai và độ lệch chuẩn») |
| NNB01263 | Lập bảng ghép nhóm từ số liệu thô rồi tính số đặc trưng | C2.2.1 «Ghép nhóm số liệu thô rồi tính số đặc trưng» (nhóm mới C2.2 «Từ số liệu thô đến mẫu ghép nhóm») |
| NNB01264 | Phát hiện giá trị bất thường bằng tứ phân vị | gộp vào C1.2.2 |

## Câu hỏi cho Thùy (B3)

1. Dạng cũ nào trong bảng trên Thùy muốn **giữ mã gốc** (tái dùng id, đè tên/mô tả/LT/VD bằng bản mới)? Theo nhân chứng câu: KHÔNG dạng nào đạt ngưỡng 90% — mọi dạng cũ có câu đề thi đều bị TÁCH ra 3–6 dạng mới.
2. Dạng tiệm cận NDB00620–624 và Vectơ NDB00640–645: câu gán là câu cụm cũ, không có trong tsv đề thi ⇒ chỉ có gợi ý theo tên. Chấp nhận chuyển theo tên, hay để phân lại (B4)?
3. Nhóm cũ đang được giáo trình trỏ tới (cột "giáo trình"): khi xoá B5, giáo trình mất phần đó — Thùy muốn giáo trình trỏ sang nhóm mới nào?
