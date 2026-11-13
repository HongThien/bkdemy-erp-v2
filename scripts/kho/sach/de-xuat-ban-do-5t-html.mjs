// de-xuat-ban-do-5t-html.mjs — trang HTML ĐỀ XUẤT bản đồ kiến thức 5T cho Thùy xem (KHÔNG ghi DB; "đề xuất trước, ghi sau").
//   node scripts/kho/sach/de-xuat-ban-do-5t-html.mjs reports/5T-de-xuat-ban-do-kien-thuc.html
// Nguồn: bản đồ 5T đang có (DB 08/11) · Toán 5 TLTK (31 CĐ) · 250+ Bài toán chọn lọc lớp 5 (ME, 14 CĐ — đọc phần ĐỀ tr.7–100) ·
//        bộ CLC (58 đề / 805 câu; 16 chuyên đề Word 738 bài) · khuôn 4T. Mã: ✅ = đã có trong bản đồ, 🆕 = đề xuất thêm, ✏️ = đề xuất chuyển/đổi.
import { writeFileSync } from 'node:fs'
const ra = process.argv[2]
if (!ra) { console.error('Dùng: node scripts/kho/sach/de-xuat-ban-do-5t-html.mjs <ra.html>'); process.exit(2) }
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ── tần suất chủ đề trong 803 câu CLC (ước bằng từ khoá, chỉ để xếp ưu tiên) ──
const TAN_SUAT = [
  ['Tính toán, so sánh (STN – phân số – STP)', 106], ['Diện tích (tam giác, thang, chữ nhật…)', 104], ['Hình tròn / hình khối', 92],
  ['Tỉ số phần trăm / lãi lỗ', 79], ['Chuyển động', 61], ['Dãy số / quy luật', 56], ['Chia hết / chữ số tận cùng', 49],
  ['Cấu tạo số / lập số', 38], ['Tính tuổi', 29], ['Tỉ số / tổng–hiệu–tỉ', 29], ['Công việc / vòi nước', 20], ['Khác / tổng hợp (chưa phân loại được)', 140],
]

// ── bản đồ đề xuất ──  nhom: { ten, tt: 'co'|'moi'|'doi', ma?, dang: [..], nguon, uu: 1..3, cau? }
const CD = [
  { id: 'A', ten: 'Cấu tạo số · Số tự nhiên', ghi: 'Khuôn 4T có "Cấu tạo số", "Số tự nhiên". 5T hiện KHÔNG có chỗ nào cho phần này, trong khi sách ME dành 4/14 chuyên đề (CĐ1, 2, 3, 6) và đề CLC ~18% câu (cấu tạo số + dãy số + chia hết + tận cùng); TLTK chỉ có rải rác trong phần Ôn tập.', cdn: [
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
      { ten: 'Công thức diện tích', tt: 'moi', dang: ['Tính diện tích tam giác / hình thang', 'Suy ngược đáy / chiều cao từ diện tích', 'Hình chữ nhật, vuông, bình hành, thoi'], nguon: 'TLTK CĐ18, 20 · ME CĐ11 · CLC "diện tích" 90 bài', uu: 1 },
      { ten: 'Hai tam giác chung đáy – chung đường cao', tt: 'moi', dang: ['Chung đường cao ⇒ tỉ số diện tích = tỉ số đáy', 'Chung đáy ⇒ tỉ số diện tích = tỉ số đường cao', 'Trung điểm / điểm chia cạnh theo tỉ số'], nguon: 'TLTK CĐ19 · ME CĐ11 (VD1–2)', uu: 1 },
      { ten: 'Diện tích gián tiếp', tt: 'moi', dang: ['Quy về phần bằng nhau bằng sơ đồ phần', 'Hai đoạn nối đỉnh cắt nhau trong tam giác', 'Hình thang: kéo dài cạnh, thay đổi đáy'], nguon: 'TLTK CĐ19–20 · ME CĐ11 (VD3, B4–23)', uu: 1 },
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

const TT = { co: ['✅ đã có', 'b-co'], moi: ['🆕 thêm', 'b-moi'], doi: ['✏️ chuyển / đổi', 'b-doi'] }
const badge = (t) => `<span class="b ${TT[t][1]}">${TT[t][0]}</span>`
const uuC = ['', '⭐⭐⭐ cao', '⭐⭐ vừa', '⭐ thấp']
let nCD = 0, nNhom = 0, nDang = 0, nMoiNhom = 0, nCoNhom = 0, nDangMoi = 0
const html = CD.map((c) => {
  nCD++
  const hang = c.cdn.map((ch) => {
    const rows = ch.nhom.map((n, i) => {
      nNhom++; nDang += n.dang.length; if (n.tt === 'moi') nMoiNhom++; if (n.tt === 'co') nCoNhom++
      return `<tr><td class="cdn">${i === 0 ? `<b>${esc(ch.ten)}</b><br>${badge(ch.tt)}${ch.ma ? ` <small>${ch.ma}</small>` : ''}${ch.ghi ? `<div class="gc">${esc(ch.ghi)}</div>` : ''}` : ''}</td>
        <td class="nh"><b>${esc(n.ten)}</b><br>${badge(n.tt)}${n.ma ? ` <small>${n.ma}</small>` : ''}${n.cau != null ? `<br><small>${n.cau} câu hiện có</small>` : ''}</td>
        <td><ul>${n.dang.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></td>
        <td class="ng">${esc(n.nguon)}<br><span class="uu u${n.uu}">${uuC[n.uu]}</span></td></tr>`
    }).join('')
    return rows
  }).join('')
  return `<section id="cd${c.id}"><h2><span class="id">${c.id}</span> ${esc(c.ten)}</h2><p class="ghi">${esc(c.ghi)}</p>${c.cdn.length ? `<table><thead><tr><th>Chuyên đề</th><th>Nhóm</th><th>Dạng bài đề xuất</th><th>Nguồn · ưu tiên</th></tr></thead><tbody>${hang}</tbody></table>` : ''}</section>`
}).join('')

const tong = TAN_SUAT.reduce((s, x) => s + x[1], 0)
const bars = TAN_SUAT.map(([t, n]) => `<div class="bar"><span class="bt">${esc(t)}</span><span class="bb"><i style="width:${(n / 140) * 100}%"></i></span><span class="bn">${n} <small>(${Math.round((n / tong) * 100)}%)</small></span></div>`).join('')

writeFileSync(ra, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>5T — Đề xuất bản đồ kiến thức</title>
<style>:root{--bg:#fff;--fg:#1b1f23;--mut:#667;--line:#dde3ea;--card:#fafbfc;--acc:#2f6fdb}
@media(prefers-color-scheme:dark){:root{--bg:#14181d;--fg:#e6e9ee;--mut:#9aa6b2;--line:#2b3541;--card:#1a2027}}
body{font:15px/1.55 system-ui,sans-serif;max-width:1180px;margin:0 auto;padding:16px;color:var(--fg);background:var(--bg)}
h1{font-size:22px;margin:.2em 0}h2{font-size:18px;margin:34px 0 4px;padding:8px 12px;background:var(--card);border-left:5px solid var(--acc);border-radius:4px}.id{display:inline-block;background:var(--acc);color:#fff;border-radius:50%;width:26px;height:26px;text-align:center;line-height:26px;font-size:14px;margin-right:6px}
.ghi{color:var(--mut);margin:4px 0 10px}table{border-collapse:collapse;width:100%;font-size:13.5px}th{background:var(--card);text-align:left;padding:6px 8px;border:1px solid var(--line)}td{padding:6px 8px;border:1px solid var(--line);vertical-align:top}
td.cdn{width:17%;background:var(--card)}td.nh{width:20%}td.ng{width:25%;color:var(--mut);font-size:12.5px}ul{margin:0;padding-left:17px}li{margin:1px 0}.gc{font-size:12px;color:var(--mut);margin-top:4px}
.b{display:inline-block;font-size:11px;padding:0 6px;border-radius:9px;border:1px solid}.b-co{color:#0b7a3b;border-color:#0b7a3b}.b-moi{color:#b25e00;border-color:#b25e00}.b-doi{color:#6a3fc9;border-color:#6a3fc9}
.uu{font-size:11px;font-weight:600}.u1{color:#c0392b}.u2{color:#b25e00}.u3{color:var(--mut)}small{color:var(--mut)}
.box{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:10px 14px;margin:12px 0}.bar{display:flex;align-items:center;gap:8px;margin:3px 0;font-size:13px}.bt{width:330px}.bb{flex:1;background:var(--line);border-radius:3px;height:12px}.bb i{display:block;height:100%;background:var(--acc);border-radius:3px}.bn{width:80px;text-align:right}
.src td,.src th{font-size:13px}@media(max-width:760px){.bt{width:150px}td.ng{display:none}}</style></head><body>
<h1>5T — Đề xuất bản đồ kiến thức</h1>
<p><small>Bản NHÁP để Thùy xem · chưa ghi vào DB · 08–13/11/2026 · mã: ✅ đã có trong bản đồ · 🆕 đề xuất thêm · ✏️ đề xuất chuyển</small></p>
<div class="box"><b>Tóm tắt:</b> ${nCD - 1} chủ đề + 1 chủ đề để sau · ${nNhom} nhóm (${nCoNhom} nhóm ✅ đã có, ${nMoiNhom} nhóm 🆕) · ${nDang} dạng bài đề xuất. Bản đồ 5T hiện chỉ có <b>1 chủ đề · 4 chuyên đề · 12 nhóm · 40 dạng</b> (toàn bộ nằm dưới chủ đề "Bài toán tỉ số"). Phần ✅ giữ nguyên mã và tên — câu đã gán không bị đụng.
<br><b>Ba chỗ hổng lớn so với đề CLC:</b> ① <b>Số học</b> (cấu tạo số, dãy số, chia hết–chẵn lẻ–tận cùng, lập số đếm) — không có chỗ nào, mà đề CLC ~18%; sách TLTK chỉ có rải rác nên kho 5T đang gần như trống · ② <b>Chuyển động</b> — không có · ③ <b>Hình học</b> (~24% đề CLC) — không có.</div>

<h2 style="margin-top:22px">Nguồn đã dùng và phủ được gì</h2>
<table class="src"><thead><tr><th>Nguồn</th><th>Đã đọc</th><th>Phủ</th><th>Hổng</th></tr></thead><tbody>
<tr><td><b>Toán 5 TLTK</b></td><td>31 chuyên đề · 836 câu đã giải (dạng chờ)</td><td>Phân số, tỉ số, tỉ lệ, công việc, số thập phân, %, hình học, chuyển động, giả thiết tạm, khử</td><td>Cấu tạo số · dãy số · chẵn lẻ/chữ số tận cùng · lập số/đếm · so sánh/tính toán CLC</td></tr>
<tr><td><b>250+ Bài toán chọn lọc lớp 5</b> (ME, Trần Nhật Minh)</td><td>14 chuyên đề, phần ĐỀ tr.7–100 (đáp án tr.101–272 chưa đọc). Sách chỉ in đề; "dạng" tôi rút từ đề (mục sách tự nêu tên thì dùng nguyên)</td><td><b>Lấp hổng số học</b> (CĐ1, 2, 3, 6) + nâng cao tỉ lệ nhiều giai đoạn, dãy phân số, hình tròn/khối</td><td>Chưa giải câu nào; có chỗ dùng ẩn a, b, x, n! vượt tiểu học; CĐ14 mức Olympic</td></tr>
<tr><td><b>Bộ CLC lớp 6</b></td><td>58 đề · 805 câu đã soạn + kiểm độc lập (chưa ghi DB) · 16 chuyên đề gom từ đề (738 bài — chỉ dùng đo tần suất, Thùy 10/10: không nhập)</td><td>Cho biết <b>đề thật ra gì, nhiều ít ra sao</b> (xếp ưu tiên bên dưới)</td><td>Chưa ghi kho · chưa chốt khối 5T hay 5 · 6 nhãn sơ đồ chờ sửa</td></tr>
<tr><td><b>Bản đồ 5T + khuôn 4T</b></td><td>DB 08/11</td><td>Khuôn 4T: Số tự nhiên · Hình học · Logic · Cấu tạo số · Lời văn · Phân số — 5T đề xuất đi tiếp khuôn này</td><td>—</td></tr></tbody></table>

<h2 style="margin-top:22px">Đề CLC ra gì nhiều nhất <small>(ước theo từ khoá trên 803 câu — thô, chỉ để xếp ưu tiên)</small></h2>
<div class="box">${bars}</div>

${html}

<h2>Cần Thùy quyết (mặc định tôi đề xuất)</h2>
<div class="box"><ol>
<li><b>Chủ đề:</b> giữ "Bài toán tỉ số" (NCD00215) chứa luôn Phần trăm và Logic như hiện tại, và tách 5 chủ đề mới A, B, D, E, F — <i>mặc định: đúng như bảng trên</i>. Nếu Thùy muốn Phần trăm thành chủ đề riêng thì chuyển nguyên chuyên đề NCH00638 (mã bất biến).</li>
<li><b>✏️ Chuyển 2 nhóm</b> "Các phép tính toán cơ bản về phân số" + "Bài toán về số thập phân" sang chủ đề B — <i>mặc định: chuyển</i>; chuyên đề cũ NCH00546 còn rỗng thì để Thùy xoá.</li>
<li><b>Thứ tự làm</b> (theo tần suất CLC × độ trống): <b>E Hình học → D Chuyển động → A Số học (chia hết, dãy số trước) → B So sánh/tính toán → phần 🆕 của C</b> — <i>mặc định như vậy</i>.</li>
<li><b>Nguồn câu cho phần trống:</b> A lấy từ sách ME (chưa giải) + 805 câu CLC; D, E lấy từ TLTK (đã giải) + CLC — <i>mặc định: giải ME phần số học trước, rồi gán CLC theo bản đồ</i>. Câu hỏi khối 5T hay 5 cho 58 đề CLC (chưa chốt từ 10/10) — <i>mặc định: 5T</i>.</li>
<li>Lý thuyết / ví dụ của dạng mới: đang để trống — <i>mặc định: tôi điền nháp từ TLTK + ME vào HTML cho Thùy duyệt, KHÔNG ghi DB cho tới khi Thùy nói "ghi"</i>.</li></ol></div>
</body></html>`)
console.log('→', ra, { chu_de: nCD, nhom: nNhom, dang: nDang, nhom_co: nCoNhom, nhom_moi: nMoiNhom })
