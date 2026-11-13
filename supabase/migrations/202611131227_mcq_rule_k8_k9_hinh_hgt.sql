-- Lớp 8–9 (MCQ Hình giải tích + Hình học, độ khó 1–3): rule nhiễu R600–R649 (luồng lớp 8–9). Chỉ INSERT.
-- Bảng rule RIÊNG từng nhánh (hgt_mcq_rule, hinh_hoc_mcq_rule — CLAUDE.md §1.6) nhưng cùng bộ mã: nhập vào hgt rồi chép sang hình học.
insert into hgt_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active) values
 ('R600', 'Biểu thức lượng giác: nhầm dấu khi nhóm các cặp góc phụ', 'Nhóm đúng các cặp sin²α + sin²(90°−α) = 1 nhưng cộng cả hai nhóm thay vì giữ dấu trừ ở nhóm sau.', 'P = (sin²30°+sin²60°) − (sin²40°+sin²50°): làm 1 + 1 = 2 (đúng 0)', 'khai_niem', array[]::text[], false, true),
 ('R601', 'Biểu thức lượng giác: chỉ tính nhóm thứ nhất, bỏ nhóm còn lại', 'Rút gọn đúng một nhóm góc phụ rồi dừng, quên nhóm thứ hai.', 'sin²30°+sin²60° = 1 rồi kết luận P = 1 (đúng 0)', 'tinh', array[]::text[], false, true),
 ('R602', 'Biểu thức lượng giác: chỉ tính nhóm thứ hai (kèm dấu trừ), bỏ nhóm còn lại', 'Rút gọn đúng nhóm đứng sau dấu trừ rồi dừng, bỏ nhóm đầu.', '−(sin²40°+sin²50°) = −1 rồi kết luận P = −1 (đúng 0)', 'tinh', array[]::text[], false, true),
 ('R603', 'Biểu thức lượng giác: quên một thừa số trong tích', 'Tính đúng các thừa số đặc biệt nhưng bỏ sót một thừa số khi nhân.', 'tan45°·cot30°·cot30° làm thành 1·√3 = √3 (đúng 3)', 'tinh', array[]::text[], false, true),
 ('R604', 'Biểu thức lượng giác: nhầm cot với tan (lấy giá trị nghịch đảo)', 'Dùng cot30° = 1/√3 (giá trị của tan30°) thay cho cot30° = √3.', 'tan45°·tan30°·tan30° = 1/3 (đúng 3)', 'khai_niem', array[]::text[], false, true),
 ('R605', 'Thực tế lượng giác: dùng sin thay cho tỉ số lượng giác đúng', 'Chọn sai tỉ số: dùng sin của góc thay cho tan/cos cần dùng ở tam giác vuông.', 'Cần cos nhưng lấy sin của góc', 'khai_niem', array[]::text[], false, true),
 ('R606', 'Thực tế lượng giác: lấy góc phụ (90° trừ góc cần tìm)', 'Tính đúng một góc nhọn của tam giác vuông nhưng trả lời góc còn lại.', 'Góc cần tìm 68° nhưng trả lời 22°', 'khai_niem', array[]::text[], false, true),
 ('R607', 'Góc đặc biệt: nhầm sin30° = cos60° thành √3/2', 'Lấy giá trị đặc biệt của sin30° (hoặc cos60°) là √3/2 thay vì 1/2.', 'cos²42°·√3/2 + sin²42°·√3/2 = √3/2 (đúng 1/2)', 'khai_niem', array[]::text[], false, true),
 ('R608', 'Biểu thức lượng giác: quên nhân hệ số chung sau khi dùng sin²α + cos²α = 1', 'Rút gọn đúng cặp bình phương bằng 1 nhưng bỏ hệ số chung đứng ngoài.', '(1/2)(cos²42°+sin²42°) làm thành 1 (đúng 1/2)', 'tinh', array[]::text[], false, true),
 ('R609', 'Biểu thức lượng giác: nhân hệ số chung hai lần', 'Đưa hệ số chung ra ngoài rồi nhân thêm lần nữa với chính nó.', '(1/2)·(1/2)·1 = 1/4 (đúng 1/2)', 'tinh', array[]::text[], false, true),
 ('R610', 'Biểu thức lượng giác: coi mỗi cặp góc phụ bằng 2 thay vì 1', 'Nhầm cos²α + cos²(90°−α) = 2.', 'cos²10°+cos²80° = 2 → tổng 3 cặp = 6 (đúng 3)', 'khai_niem', array[]::text[], false, true),
 ('R611', 'Thực tế lượng giác: đảo tỉ số (nhân thay vì chia hoặc ngược lại)', 'Chọn đúng hàm lượng giác nhưng đặt tỉ số ngược: nhân thay vì chia hoặc ngược lại.', '66/tan25° làm thành 66·tan25°', 'khai_niem', array[]::text[], false, true),
 ('R612', 'Biểu thức lượng giác: coi mỗi cặp góc phụ bằng 1/2', 'Nhầm cos²α + cos²(90°−α) = 1/2 (lấy một nửa).', '3 cặp × 1/2 = 3/2 (đúng 3)', 'khai_niem', array[]::text[], false, true),
 ('R614', 'Biểu thức lượng giác: nhân thừa một thừa số', 'Nhân thêm một thừa số lượng giác không có trong biểu thức.', 'tan45°·cot30°·cot30°·cot30° = 3√3 (đúng 3)', 'tinh', array[]::text[], false, true),
 ('R615', 'Biểu thức lượng giác: đếm thiếu một cặp góc phụ', 'Ghép được 2 cặp góc phụ nhưng bỏ sót cặp thứ ba.', '2 cặp × 1 = 2 (đúng 3 cặp)', 'tinh', array[]::text[], false, true),
 ('R616', 'Thực tế lượng giác: dùng cos thay cho tỉ số lượng giác đúng', 'Chọn sai tỉ số: dùng cos của góc thay cho sin/tan cần dùng ở tam giác vuông.', 'Cần tan nhưng lấy cos của góc', 'khai_niem', array[]::text[], false, true),
 ('R617', 'Thực tế lượng giác: dùng tan thay cho tỉ số lượng giác đúng', 'Chọn sai tỉ số: dùng tan của góc thay cho sin/cos cần dùng ở tam giác vuông.', 'Cần cos nhưng lấy tan', 'khai_niem', array[]::text[], false, true),
 ('R618', 'Chuyển động đều: lấy luôn khoảng thời gian đề cho', 'Dừng ở dữ kiện thời gian đã cho mà không tính thời gian còn lại.', 'Đề cho 6 phút giữa hai lần quan sát → trả lời 6 phút', 'khai_niem', array[]::text[], false, true),
 ('R619', 'Chuyển động đều: tính thời gian từ mốc quan sát đầu thay vì mốc sau', 'Tính thời gian đi hết quãng đường từ lần nhìn thứ nhất, không trừ phần đã đi.', '6 + 3 = 9 phút (đúng: còn 3 phút kể từ lần nhìn thứ hai)', 'khai_niem', array[]::text[], false, true),
 ('R621', 'Chuyển động đều: dùng tỉ lệ quãng đường thay vì thời gian còn lại', 'Lấy thời gian × (quãng đường sau / quãng đường đầu) thay vì chia cho quãng đường đã đi được.', '6·(57,7/173,2) = 2 phút (đúng 3 phút)', 'tinh', array[]::text[], false, true),
 ('R631', 'Hai tiếp tuyến cắt nhau: trả lời độ dài đoạn thay vì giá trị x', 'Giải đúng x rồi thay vào biểu thức độ dài và trả lời độ dài.', 'x = 3 nhưng trả lời AB = 7·3 − 4 = 17', 'khai_niem', array[]::text[], false, true),
 ('R632', 'Phương trình độ dài: sai dấu hạng tử tự do khi chuyển vế', 'Chuyển vế mà không đổi dấu hạng tử tự do.', '7x − 4 = 3x + 8 làm thành 7x + 4 = 3x + 8 → x = 1 (đúng 3)', 'tinh', array[]::text[], false, true),
 ('R633', 'Phương trình độ dài: cộng hệ số của x thay vì trừ', 'Gộp hạng tử x hai vế bằng phép cộng hệ số.', '(4+8)/(7+3) = 1,2 (đúng 3)', 'tinh', array[]::text[], false, true),
 ('R634', 'Hai tiếp tuyến cắt nhau: lấy góc giữa hai tiếp tuyến bằng góc ở tâm', 'Nhầm góc tạo bởi hai tiếp tuyến với góc ở tâm chắn cung nối hai tiếp điểm.', 'COB = 130° ⇒ CMB = 130° (đúng 50°)', 'khai_niem', array[]::text[], false, true),
 ('R635', 'Hai tiếp tuyến cắt nhau: lấy một nửa góc ở tâm (góc nội tiếp) làm kết quả', 'Nhầm với góc nội tiếp chắn cùng cung.', 'COB = 130° ⇒ CMB = 65° (đúng 50°)', 'khai_niem', array[]::text[], false, true),
 ('R637', 'Hai tiếp tuyến cắt nhau: chỉ tính một nửa góc (góc OMB thay vì CMB)', 'Tính đúng CMB = 50° nhưng trả lời một nửa là góc OMB.', 'CMB = 50° trả lời 25°', 'tinh', array[]::text[], false, true),
 ('R638', 'Độ dài/góc hình học: lấy một nửa kết quả (quên nhân 2)', 'Dừng ở một nửa đại lượng cần tìm vì quên nhân đôi.', 'Chu vi = 2·MN nhưng trả lời MN', 'tinh', array[]::text[], false, true),
 ('R639', 'Độ dài/chu vi hình học: nhân thừa (gấp 2 hoặc 4 lần)', 'Nhân thừa hệ số 2 ở bước cuối.', 'Chu vi 2·MN = 16 trả lời 32', 'tinh', array[]::text[], false, true),
 ('R640', 'Hai tiếp tuyến cắt nhau: bỏ sót một đoạn tiếp tuyến khi cộng chu vi', 'Cộng các đoạn tiếp tuyến nhưng thiếu một đoạn.', '2(AM+CE) = 28 thay cho 2(AM+BP+CE) = 34', 'tinh', array[]::text[], false, true),
 ('R641', 'Chu vi tiếp tuyến: lấy chu vi của tam giác lớn thay vì tam giác cần tìm', 'Trả lời chu vi tam giác ngoại tiếp ban đầu.', 'Trả lời chu vi ABC = 18 thay cho chu vi AEF', 'khai_niem', array[]::text[], false, true),
 ('R642', 'Tiếp tuyến: lấy khoảng cách từ tâm thay cho độ dài tiếp tuyến', 'Dùng đoạn nối điểm ngoài với tâm thay cho độ dài tiếp tuyến.', '2·MO = 20 thay cho 2·MN = 16', 'khai_niem', array[]::text[], false, true),
 ('R644', 'Độ dài hình học: lấy đoạn khác thay cho đoạn cần tính', 'Trả lời độ dài của một đoạn đã biết hoặc đã tính ở bước trước.', 'Cần BD nhưng trả lời BC', 'khai_niem', array[]::text[], false, true),
 ('R645', 'Đường tròn: lấy đường kính thay cho đoạn cần tính', 'Trả lời độ dài đường kính CD thay cho dây cần tìm.', 'Cần BD nhưng trả lời CD = 6', 'khai_niem', array[]::text[], false, true),
 ('R646', 'Góc: lấy góc bù (180° trừ kết quả)', 'Tính đúng góc nhọn rồi trả lời góc kề bù.', 'BOC = 106° trả lời 180° − 53° = 127°', 'khai_niem', array[]::text[], false, true),
 ('R647', 'Độ dài dây curoa: dùng cung nhỏ thay cho cung lớn ở đường tròn lớn', 'Chọn cung nhỏ MP thay cho cung lớn MP khi dây ôm vòng ngoài.', 'Dùng 120° thay cho 240°', 'khai_niem', array[]::text[], false, true),
 ('R648', 'Độ dài dây curoa: dùng cung lớn cho cả hai đường tròn', 'Chọn cung lớn cho cả đường tròn nhỏ thay vì cung nhỏ NQ.', 'Dùng 240° cho cả (O) và (O'')', 'khai_niem', array[]::text[], false, true)
on conflict (ma) do nothing;

insert into hinh_hoc_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active)
select ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active from hgt_mcq_rule where ma ~ '^R6[0-4][0-9]$'
on conflict (ma) do nothing;
