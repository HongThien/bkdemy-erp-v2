// de-xuat-ban-do-5t-du-lieu.mjs — DỮ LIỆU bản đồ đề xuất 5T (một nguồn cho trang HTML và cho script ghi DB ghi-ban-do-5t.mjs).
// nhom: { ten, tt: 'co'|'moi'|'doi', ma?, dang: [..], nguon, uu, cau? } — 'co' = đã có trong DB (giữ), 'moi' = thêm, 'doi' = chuyên đề mới chứa nhóm chuyển sang.
// ── bản đồ đề xuất ──  nhom: { ten, tt: 'co'|'moi'|'doi', ma?, dang: [..], nguon, uu: 1..3, cau? }
export const CD = [
  { id: 'A', ten: 'Cấu tạo số · Số tự nhiên', ghi: 'Khuôn 4T có "Cấu tạo số", "Số tự nhiên". 5T hiện KHÔNG có chỗ nào cho phần này, trong khi sách ME dành 4/14 chuyên đề (CĐ1, 2, 3, 6) và đề CLC ~18% câu (cấu tạo số + dãy số + chia hết + tận cùng); TLTK chỉ có trong phần Ôn tập (mục II Dãy số 7 bài · III Chia hết 10 bài · IV Cấu tạo số 8 bài · XIII Toán tư duy 14 bài), không có chuyên đề riêng.', cdn: [
    { ten: 'Cấu tạo số', tt: 'moi', nhom: [
      { ten: 'Thêm – bớt chữ số', tt: 'moi', dang: ['Thêm/bớt chữ số bên phải (số mới hơn/kém k)', 'Thêm/bớt chữ số bên trái (số mới gấp k lần)', 'Thêm chữ số ở hai đầu (cho hiệu)', 'Viết thêm chữ số vào giữa (gấp k lần)'], nguon: 'ME CĐ1 (VD2, B1–3, 5–11, 16, 18) · CLC "cấu tạo số" 22 bài', uu: 2 },
      { ten: 'Đổi chỗ chữ số', tt: 'moi', dang: ['Đảo thứ tự các chữ số (hơn/kém/gấp)', 'Chuyển chữ số cuối lên đầu'], nguon: 'ME CĐ1 (VD1, B19)', uu: 2 },
      { ten: 'Số và các chữ số của nó', tt: 'moi', dang: ['Số chia cho tổng các chữ số (có dư)', 'Số gấp k lần tổng / tích / một chữ số của nó', 'Cực trị: thương số ÷ tổng chữ số lớn nhất / nhỏ nhất'], nguon: 'ME CĐ1 (B4, 13–15, 17, 22–23, 25–26)', uu: 2 },
      { ten: 'Tổng các số cấu tạo (ẩn chữ)', tt: 'moi', dang: ['abcd + abc + ab + a = N', 'Có phần thập phân (a,bcd + ab,cd + …)'], nguon: 'ME CĐ1 (B20, 21, 24) · TLTK Ôn IV (cấu tạo số)', uu: 3 },
    ] },
    { ten: 'Lập số và quy tắc đếm', tt: 'moi', nhom: [
      { ten: 'Đếm số lập được', tt: 'moi', dang: ['Chữ số được lặp lại', 'Chữ số phải khác nhau (hàng đơn vị là 0: chia 2 trường hợp)', 'Đếm theo điều kiện (tổng / hiệu / chữ số đứng cạnh)'], nguon: 'ME CĐ6 (26 bài, B1a, 2, 5–8, 11–19)', uu: 2 },
      { ten: 'Số lớn nhất – nhỏ nhất – tổng các số lập được', tt: 'moi', dang: ['Số lớn nhất / nhỏ nhất / lẻ lớn nhất lập được', 'Tổng tất cả các số lập được'], nguon: 'ME CĐ6 (B1b–c, 3, 4, 9, 10, 20)', uu: 3 },
      { ten: 'Bắt tay và đếm cách', tt: 'moi', dang: ['Bài bắt tay / số trận đấu vòng tròn', 'Đếm cách xếp / tô màu / đường đi'], nguon: 'ME CĐ6 (B21–26)', uu: 3 },
    ] },
    { ten: 'Chia hết · Chẵn lẻ · Chữ số tận cùng', tt: 'moi', nhom: [
      { ten: 'Chẵn – lẻ', tt: 'moi', dang: ['Kiểm tra phép tính bằng chẵn–lẻ (không tính)', 'Chứng minh "có hay không tồn tại" bằng chẵn–lẻ'], nguon: 'ME CĐ3 (VD1, B11–15)', uu: 2 },
      { ten: 'Chữ số tận cùng', tt: 'moi', dang: ['Tận cùng của tổng / hiệu / tích', 'Tận cùng của tích nhiều thừa số giống nhau (4×4×…)', 'Tận cùng của tổng các tích / giai thừa'], nguon: 'ME CĐ3 (VD2, B1–2, 14) · CLC "chữ số tận cùng" 13 bài', uu: 2 },
      { ten: 'Chữ số 0 tận cùng của tích', tt: 'moi', dang: ['Đếm số chữ số 0 tận cùng của tích', 'Tìm n để tích 1×2×…×n có đúng k chữ số 0', 'Gạch bớt thừa số để tích tận cùng cho trước'], nguon: 'ME CĐ3 (B4–10)', uu: 3 },
      { ten: 'Dấu hiệu chia hết · Chia có dư', tt: 'moi', dang: ['Nhận biết số chia hết cho 2, 3, 5, 9', 'Tìm chữ số thoả điều kiện chia hết', 'Chia có dư: tìm số dư / số chia / số bị chia'], nguon: 'Khuôn 4T (Dấu hiệu chia hết 8 dạng · Phép chia có dư 5 dạng) · CLC "chia hết" 52 bài', uu: 1 },
    ] },
    { ten: 'Dãy số', tt: 'moi', nhom: [
      { ten: 'Dãy cách đều', tt: 'moi', dang: ['Số số hạng', 'Tổng các số hạng', 'Số hạng thứ n · số hạng đầu · số hạng cuối', 'Tìm số hạng cuối khi biết tổng (ẩn x)'], nguon: 'ME CĐ2 (VD1b, B2–3, 5, 10b, 14, 16) · CLC "dãy số" 44 bài', uu: 1 },
      { ten: 'Đếm chữ số (đánh số trang)', tt: 'moi', dang: ['Đếm số chữ số của dãy 1 → N', 'Biết số chữ số, tìm số trang', 'Đếm chữ số loại cụ thể (số chữ số 1, 0) · tổng các chữ số'], nguon: 'ME CĐ2 (VD2, B6–8, 11, 17)', uu: 1 },
      { ten: 'Chữ số thứ k của dãy viết liền', tt: 'moi', dang: ['Tìm chữ số thứ k', 'Tìm vị trí xuất hiện của một dãy chữ số liền nhau'], nguon: 'ME CĐ2 (VD1a, B9, 10a, 15, 18)', uu: 2 },
      { ten: 'Dãy có quy luật (không cách đều)', tt: 'moi', dang: ['Số sau = tổng hai số liền trước', 'Hiệu hai số liền nhau tăng đều', 'Số hạng theo số thứ tự (n×n, n×(n+1))'], nguon: 'ME CĐ2 (B1, 2c, 4)', uu: 2 },
      { ten: 'Dãy tuần hoàn · xếp bảng', tt: 'moi', dang: ['Chu kỳ lặp (chữ, màu): chia dư', 'Xếp số vào bảng zigzag: số N ở cột nào', 'Đếm số chia hết trong dãy (loại trừ)'], nguon: 'ME CĐ2 (B12–13, 19–22)', uu: 2 },
    ] },
  ] },
  { id: 'B', ten: 'Phân số · Số thập phân', ghi: 'Hai nhóm ✅ đang nằm ở chuyên đề "Các phép tính toán cơ bản" của chủ đề "Bài toán tỉ số" — đề xuất ✏️ chuyển sang đây (mã nhóm giữ nguyên, câu giữ nguyên).', cdn: [
    { ten: 'Phân số', tt: 'doi', nhom: [
      { ten: 'Các phép tính toán cơ bản về phân số', tt: 'co', ma: 'NNB01807', cau: 22, dang: ['Cộng trừ nhiều phân số', 'Tính thuận tiện'], nguon: 'TLTK CĐ1', uu: 1 },
      { ten: 'Hỗn số · so sánh · tìm thành phần chưa biết', tt: 'moi', dang: ['Hỗn số ↔ phân số, phép tính hỗn số (tách phần nguyên – phần phân số)', 'So sánh phân số (trực tiếp / gián tiếp qua số trung gian)', 'Tìm y có phân số'], nguon: 'TLTK CĐ1 (thiếu hỗn số, so sánh) · CLC "tính toán, so sánh"', uu: 1 },
      { ten: 'Tính nhanh với phân số "lặp số"', tt: 'moi', dang: ['Tích phân số có tử/mẫu lặp (1313/2121, 165165/143143…): tách 1313 = 13×101 rồi rút gọn'], nguon: 'ME CĐ5 (B2c, e)', uu: 3 },
      { ten: 'Dãy phân số đặc biệt', tt: 'moi', dang: ['Mẫu sau gấp mẫu trước k lần (2×B − B)', 'Triệt tiêu lẫn nhau (hiệu – tích)', 'Dãy tích các phân số'], nguon: 'TLTK CĐ4 · ME CĐ5 §1.2', uu: 2 },
    ] },
    { ten: 'Số thập phân', tt: 'doi', nhom: [
      { ten: 'Bài toán về số thập phân', tt: 'co', ma: 'NNB01808', cau: 329, dang: ['Tính chất STP', 'Tính thuận tiện', 'Biểu thức hỗn hợp', 'Tìm x', 'Lời văn', 'Nâng cao cấu tạo STP (dịch dấu phẩy)'], nguon: 'TLTK CĐ10, 12, 13 (6 dạng hiện có)', uu: 1 },
      { ten: 'Nhân chia nhẩm · thay đổi thành phần phép tính', tt: 'moi', dang: ['Nhân/chia với 0,5; 0,25; 0,125 (= chia 2, 4, 8)', 'Gấp/giảm một thừa số, thêm/bớt số hạng ⇒ tích/tổng thay đổi thế nào'], nguon: 'ME CĐ9 §1.1b, §1.2', uu: 2 },
    ] },
    { ten: 'So sánh và tính toán tổng hợp', tt: 'moi', nhom: [
      { ten: 'So sánh STN – phân số – STP', tt: 'moi', dang: ['Xếp thứ tự dãy số hỗn hợp (1,001; 7/8; 2021/2020; 8/9)', 'So sánh gián tiếp (phần bù, phần thừa, quy đồng tử)'], nguon: 'CLC "tính toán, so sánh" 142 bài — CHUYÊN ĐỀ LỚN NHẤT của bộ CLC', uu: 1 },
      { ten: 'Biểu thức hỗn hợp STN – phân số – STP', tt: 'moi', dang: ['Tính giá trị biểu thức nhiều loại số', 'Tìm x trong biểu thức hỗn hợp'], nguon: 'CLC "tính toán" · TLTK Ôn I', uu: 1 },
    ] },
    { ten: 'Đơn vị đo', tt: 'moi', nhom: [
      { ten: 'Đổi đơn vị đo', tt: 'moi', dang: ['Độ dài · khối lượng', 'Diện tích · thể tích', 'Thời gian (giờ–phút–giây) · dạng STP'], nguon: 'TLTK CĐ11 · khuôn 4T "Đo lường › Đổi đơn vị"', uu: 3 },
    ] },
  ] },
  { id: 'C', ten: 'Bài toán tỉ số', ghi: 'Chủ đề hiện có (NCD00215) — giữ nguyên tên và mã. Đề xuất thêm các nhóm 🆕 còn thiếu so với TLTK + CLC (hai hiệu số, giả thiết tạm, khử, tính tuổi, tính ngược) và các dạng còn thiếu của phần trăm (từ 25 câu "chưa có dạng").', cdn: [
    { ten: 'Các bài toán về tỉ số', tt: 'co', ma: 'NCH00545', nhom: [
      { ten: 'Bài toán tổng tỉ – hiệu tỉ hai đại lượng', tt: 'co', ma: 'NNB01803', cau: 151, dang: ['Cơ bản', 'Có thay đổi đại lượng', 'Số tuổi'], nguon: 'TLTK CĐ6', uu: 1 },
      { ten: 'Bài toán tỉ số nhiều đại lượng', tt: 'co', ma: 'NNB01804', cau: 66, dang: ['3 đại lượng có tỉ số đôi một', '3 đại lượng có dãy tỉ số', 'Các bài toán tổng hợp'], nguon: 'TLTK CĐ6', uu: 1 },
      { ten: 'Bài toán Hai tỉ số', tt: 'co', ma: 'NNB01805', cau: 101, dang: ['Một đại lượng không đổi', 'Tổng không đổi', 'Hiệu không đổi'], nguon: 'TLTK CĐ8 · ME CĐ7 §1.2 · CLC "hai tỉ số" 12 bài', uu: 1 },
      { ten: 'Các bài toán về phân số', tt: 'co', ma: 'NNB01806', cau: 142, dang: ['Tìm phân số của một số', 'Tìm số khi biết phân số: biết một phần / tổng hiệu các phần / phần còn lại'], nguon: 'TLTK CĐ2 · ME CĐ7 §1.1', uu: 1 },
      { ten: 'Bài toán Hai hiệu số', tt: 'moi', dang: ['Thừa – thiếu (hai lần chia)', 'Thừa đơn vị chứa'], nguon: 'TLTK CĐ7 · CLC "hai hiệu số" 5 bài', uu: 3 },
      { ten: 'Giả thiết tạm và phương pháp khử', tt: 'moi', dang: ['Giả sử tất cả là một loại (gà–chó, tiền xu)', 'Khử: cùng hệ số', 'Khử: khác hệ số (đưa về cùng)'], nguon: 'TLTK CĐ30–31 · CLC "giả thiết tạm" 10 bài', uu: 2 },
      { ten: 'Bài toán tính tuổi', tt: 'moi', dang: ['Hiệu tuổi không đổi', 'Tổng tuổi / tỉ số tuổi ở hai thời điểm', 'Tuổi và phân số (gấp k lần, hơn kém)'], nguon: 'CLC "tính tuổi" 32 bài (tuyển tập riêng) — hiện dạng "số tuổi" mới chỉ là 1 dạng trong tổng tỉ', uu: 2 },
      { ten: 'Trung bình cộng', tt: 'moi', dang: ['Trung bình cộng cơ bản (tìm TBC, tìm tổng, tìm một số)', 'Thay đổi trung bình cộng khi thêm / bớt đại lượng', 'Quan hệ của một số với trung bình cộng của cả nhóm'], nguon: 'TLTK CĐ6 + Ôn tập mục V (7 bài) · khuôn 4T (TBC 12 dạng)', uu: 2 },
      { ten: 'Bài toán tính ngược', tt: 'moi', dang: ['Tính ngược từ cuối (lưu đồ / sơ đồ)', 'Tính ngược với phân số "phần còn lại" (đã có ở nhóm phân số)'], nguon: 'TLTK CĐ9', uu: 3 },
    ] },
    { ten: 'Các bài toán logic thường gặp', tt: 'co', ma: 'NCH00547', nhom: [
      { ten: 'Tỉ lệ thuận – Tỉ lệ nghịch', tt: 'co', ma: 'NNB01809', cau: 105, dang: ['Cơ bản về tỉ lệ thuận', 'Cơ bản về tỉ lệ nghịch', 'Tỉ lệ kép', 'Thay đổi số người (đổi từ đầu / giữa chừng)'], nguon: 'TLTK CĐ5 · ME CĐ4 (25 bài: kép, lương thực nhiều giai đoạn)', uu: 1 },
      { ten: 'Bài toán công việc chung riêng', tt: 'co', ma: 'NNB01810', cau: 23, dang: ['Cơ bản', 'Có thay đổi công việc giữa chừng', 'Phương pháp khử (0 câu)'], nguon: 'TLTK CĐ3 · ME CĐ4 B24–25 (vòi nước) · CLC "công việc" 12 bài', uu: 2 },
    ] },
    { ten: 'Tỉ số phần trăm', tt: 'co', ma: 'NCH00638', ghi: 'Thùy dựng 08/11 (tên đang gõ "phầm trăm"). Gợi ý bổ sung từ 25 câu hiện CHƯA CÓ DẠNG:', nhom: [
      { ten: 'Phép toán với tỉ số phần trăm', tt: 'co', ma: 'NNB02088', cau: 41, dang: ['Cộng trừ nhân chia tỉ số %', 'Tính thuận tiện (0 câu)', 'Tìm % của một số', 'Tìm một số khi biết % của nó'], nguon: 'TLTK CĐ14–15 · ME CĐ10 (Dạng 1–3) · CLC "tỉ số %" 71 bài', uu: 1 },
      { ten: '🆕 thêm dạng: Tính tỉ số % và đổi số ↔ %', tt: 'moi', dang: ['Đổi số thập phân / phân số ↔ %', 'Tính tỉ số % của hai đại lượng (a chiếm bao nhiêu % b)'], nguon: '9 câu hiện thiếu dạng (LT 14.1–14.3, LT 15.1–15.5, ON 79)', uu: 1 },
      { ten: 'Bài toán bán hàng', tt: 'co', ma: 'NNB02089', cau: 210, dang: ['Cơ bản', 'Lãi theo giá bán', 'Giảm giá', 'Giảm giá kép'], nguon: 'TLTK CĐ17 · 200 câu mới sinh 08/11', uu: 1 },
      { ten: 'Bài toán thay đổi phần trăm của tích', tt: 'co', ma: 'NNB02090', cau: 5, dang: ['Doanh thu – chi phí', 'Diện tích (dài × rộng)', '🆕 Năng suất – thời gian – số người (thay đổi % của thương / nghịch đảo)', '🆕 Thể tích hộp (3 kích thước)'], nguon: 'TLTK CĐ17 · 5 câu hiện thiếu dạng (LT 17.12–17.14, 17.5, 17.11)', uu: 2 },
      { ten: 'Bài toán hỗn hợp', tt: 'co', ma: 'NNB02091', cau: 15, dang: ['Trộn A và B tìm hỗn hợp', 'Cho hỗn hợp tìm ngược lại A, B', '🆕 Pha loãng / cô đặc (Thùy chốt 08/11 thuộc hỗn hợp)', '🆕 Hạt tươi – hạt khô (6 câu chờ Thùy xác nhận)'], nguon: 'TLTK CĐ16', uu: 2 },
      { ten: '🆕 nhóm: Tăng – giảm liên tiếp và lãi suất', tt: 'moi', dang: ['Tăng / giảm liên tiếp một đại lượng', 'Lãi suất ngân hàng (lãi nhập vốn)'], nguon: '4 câu hiện thiếu dạng (LT 17.1, 17.2, 17.17, ON 85)', uu: 3 },
    ] },
  ] },
  { id: 'D', ten: 'Chuyển động', ghi: 'Toàn bộ chuyển động CHƯA có trong bản đồ 5T (TLTK 5 chuyên đề CĐ25–29, ME CĐ13 20 bài, CLC 67 bài). Bài chuyển động PHẢI có sơ đồ minh hoạ (CEO 09/10 — máy vẽ có sẵn).', cdn: [
    { ten: 'Chuyển động đều', tt: 'moi', nhom: [
      { ten: 'Vận tốc – quãng đường – thời gian', tt: 'moi', dang: ['Công thức s = v × t, đổi đơn vị (km/giờ, m/giây, giờ–phút)', 'Vận tốc trung bình', 'Cùng quãng đường: vận tốc ↔ thời gian tỉ lệ nghịch (cùng thời gian: tỉ lệ thuận)'], nguon: 'TLTK CĐ25, 28, 29 · ME CĐ13 (VD2) · CLC "chuyển động" 67 bài', uu: 1 },
    ] },
    { ten: 'Hai chuyển động', tt: 'moi', nhom: [
      { ten: 'Ngược chiều – gặp nhau', tt: 'moi', dang: ['Tìm quãng đường / thời gian gặp (tổng vận tốc)', 'Gặp nhau sau khi đi / nghỉ giữa đường'], nguon: 'TLTK CĐ26 · ME CĐ13 §1b, VD1', uu: 1 },
      { ten: 'Cùng chiều – đuổi kịp', tt: 'moi', dang: ['Đuổi kịp (hiệu vận tốc)', 'Xuất phát lệch giờ'], nguon: 'TLTK CĐ26 · ME CĐ13', uu: 1 },
      { ten: 'Chuyển động trên đường tròn · nhiều lần gặp', tt: 'moi', dang: ['Hai xe cùng/ngược chiều trên đường tròn', 'Xe đi lại, quay đầu, gặp nhiều lần'], nguon: 'ME CĐ13 (B10–12 — sách không có lý thuyết)', uu: 3 },
    ] },
    { ten: 'Chuyển động đặc biệt', tt: 'moi', nhom: [
      { ten: 'Dòng nước', tt: 'moi', dang: ['Xuôi dòng – ngược dòng', 'Tìm vận tốc dòng nước / vận tốc thực'], nguon: 'TLTK CĐ27', uu: 2 },
      { ten: 'Vật có chiều dài', tt: 'moi', dang: ['Đoàn tàu qua cầu / qua cột / qua người', 'Hai tàu gặp nhau, vượt nhau'], nguon: 'TLTK CĐ29', uu: 2 },
    ] },
  ] },
  { id: 'E', ten: 'Hình học', ghi: 'Toàn bộ hình học CHƯA có trong 5T (TLTK CĐ18–24, ME CĐ11–12, CLC diện tích 90 + hình tròn 23 + hình không gian 62 bài ≈ 24% đề). Khuôn 4T chỉ có "Chu vi các hình". Hình đề vẽ bằng code (CEO 07/10).', cdn: [
    { ten: 'Tam giác và hình thang', tt: 'moi', nhom: [
      { ten: 'Công thức diện tích', tt: 'moi', dang: ['Nhận biết các dạng tam giác / hình thang (thường, vuông, cân)', 'Tính diện tích tam giác / hình thang', 'Suy ngược đáy / chiều cao từ diện tích', 'Hình chữ nhật, vuông, bình hành, thoi'], nguon: 'TLTK CĐ18, 20 · ME CĐ11 · CLC "diện tích" 90 bài', uu: 1 },
      { ten: 'Hai tam giác chung đáy – chung đường cao', tt: 'moi', dang: ['Tính diện tích tam giác dùng tỉ lệ cạnh (chung đường cao ⇒ tỉ số diện tích = tỉ số đáy)', 'Tính diện tích tam giác dùng tỉ lệ đường cao (chung đáy ⇒ tỉ số diện tích = tỉ số đường cao)', 'Trung điểm / điểm chia cạnh theo tỉ số'], nguon: 'TLTK CĐ19 (mục 2, 3) · ME CĐ11 (VD1–2)', uu: 1 },
      { ten: 'Diện tích gián tiếp', tt: 'moi', dang: ['Chia hình thành các miếng ghép (diện tích = tổng các miếng)', 'Quy về phần bằng nhau bằng sơ đồ phần', 'Hai đoạn nối đỉnh cắt nhau trong tam giác', 'Hình thang: kéo dài cạnh, thay đổi đáy'], nguon: 'TLTK CĐ19–20 · ME CĐ11 (VD3, B4–23)', uu: 1 },
    ] },
    { ten: 'Hình tròn', tt: 'moi', nhom: [
      { ten: 'Chu vi – diện tích hình tròn', tt: 'moi', dang: ['Chu vi, diện tích, tìm bán kính từ chu vi', 'Hình vành khăn (thành giếng, đường chạy)', 'Chu vi nhiều hình tròn chia từ đường kính'], nguon: 'TLTK CĐ21 · ME CĐ12 (VD1, B1–2, 10) · CLC "hình tròn" 23 bài', uu: 2 },
      { ten: 'Diện tích phần tô đậm', tt: 'moi', dang: ['Hình vuông nội/ngoại tiếp hình tròn', 'Hình hoa, cắt ghép, nửa/một phần tư hình tròn', 'Bù trừ diện tích (hai phần bằng nhau)'], nguon: 'ME CĐ12 (B3–9) · TLTK CĐ21', uu: 1 },
    ] },
    { ten: 'Hình hộp chữ nhật và hình lập phương', tt: 'moi', nhom: [
      { ten: 'S xung quanh · S toàn phần · thể tích', tt: 'moi', dang: ['Tính S, V; tìm kích thước ngược lại (hiệu–tỉ, sơ đồ phần)', 'Hộp từ tấm bìa (cắt 4 góc)', 'Nước tràn / vật chìm / mực nước'], nguon: 'TLTK CĐ22 · ME CĐ12 (VD2, B11–12, 14) · CLC "hình không gian" 62 bài', uu: 1 },
      { ten: 'Xếp khối và sơn mặt', tt: 'moi', dang: ['Đếm khối được sơn 0 / 1 / 2 / 3 mặt', 'Xếp xen kẽ màu, xếp theo lớp / bậc thang', 'Ghép khối từ hộp: cạnh khối lớn nhất (ƯCLN)'], nguon: 'TLTK CĐ23–24 · ME CĐ12 (VD3, B13, 15–20)', uu: 1 },
    ] },
  ] },
  { id: 'F', ten: 'Toán tư duy · tổng hợp (để sau)', ghi: 'ME CĐ14 (≈25 bài trộn nhiều dạng: ma phương, suy luận hội thoại, bắt tay, bất biến — nhiều bài mức THCS/Olympic) + 140 câu "khác" của CLC (17% đề) mà tôi chưa phân loại được. Chưa đủ dữ liệu để chia dạng — đề xuất làm SAU khi 6 chủ đề trên xong.', cdn: [] },
]
