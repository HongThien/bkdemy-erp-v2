// QUYẾT ĐỊNH sau khi gán mù (4 lượt Sonnet: 2 độc lập / câu) + soát tay từng câu của Claude (19/10).
// GAN = chắc ⇒ ghi dai_bdm_gan_cau (nguon 'ai'; vào mẫu kiểm 10% của học thuật).  DEXUAT = vẫn "vừa" ⇒ cập nhật đề xuất + lý do.
// KHONGKHOP = chỉ dùng tan / hình học khác, không dạng nào trong chuyên đề ⇒ chỉ ghi chú vào lý do đề xuất (KHÔNG xoá, KHÔNG chuyển).
const P = 'T110000000', Q = 'T11003020'

export const GAN = [ // [ma_cau, dạng, ghi chú ngắn]
  // NDB00773 — thực tế + tính diện tích tam giác/đa giác (giải tam giác trước)
  [P + '178', 'NDB00773', 'Mảnh đất hình thang: giải tam giác rồi tính diện tích'],
  [P + '255', 'NDB00773', 'Mảnh đất tứ giác: chia 2 tam giác, Pythagore + Hê-rông'],
  [P + '377', 'NDB00773', 'Mảnh đất tứ giác: chia 2 tam giác tính diện tích, đền bù'],
  [Q + '4041', 'NDB00773', 'Vườn tam giác: tỉ lệ sin → ba cạnh → diện tích'],
  [Q + '4046', 'NDB00773', 'Mảnh đất hình thang (bản trùng 178)'],
  [Q + '4047', 'NDB00773', 'Mảnh vườn tứ giác: diện tích phần thu hồi'],
  [Q + '4048', 'NDB00773', 'Mảnh đất tứ giác: cosin + Hê-rông, đền bù'],
  [Q + '4050', 'NDB00773', 'Mảnh đất tứ giác (bản trùng 377)'],
  // NDB01035 — dùng diện tích để tìm yếu tố khác (r, h_a, sin, cạnh)
  [P + '188', 'NDB01035', 'Cho S, tìm sin C rồi cạnh AB'],
  [P + '300', 'NDB01035', 'Cho S, tìm sin C rồi cạnh AB (TN)'],
  [Q + '4022', 'NDB01035', 'Cho S, tìm AB (trùng 300)'],
  [P + '333', 'NDB01035', 'Cho S, tìm sin A'],
  [Q + '4016', 'NDB01035', 'Cho S, tìm sin A (trùng 333)'],
  [P + '390', 'NDB01035', 'Cho S và chu vi, tìm r'],
  [Q + '4026', 'NDB01035', 'Cho S và chu vi, tìm r (trùng 390)'],
  [Q + '4019', 'NDB01035', 'Cho S và chu vi, tìm r'],
  [P + '410', 'NDB01035', 'Đường cao h_a qua S'],
  [Q + '4003', 'NDB01035', 'Đường cao AH qua S'],
  [Q + '4031', 'NDB01035', 'Đường cao h_a qua S'],
  [Q + '4006', 'NDB01035', 'Bán kính nội tiếp r qua S'],
  [Q + '4049', 'NDB01035', 'Tấm bìa tam giác: hình tròn lớn nhất = nội tiếp, r = S/p'],
  // NDB01034 — tính R bằng định lí sin (không thực tế)
  ...['3001', '3002', '3005', '3008', '3009', '3010', '3013', '3015', '3027', '3028'].map((s) => [Q + s, 'NDB01034', 'Tính R bằng định lí sin']),
  // thực tế dùng sin/cos (đã đối chiếu lời giải: KHÔNG chỉ dùng tan) — hai trạm đồng ý, ≥ 1 trạm "cao"
  [Q + '3072', 'NDB00771', 'Tấm bìa tròn: sin tìm R rồi diện tích hình tròn'],
  [P + '187', 'NDB00771', 'Thực tế định lí sin'], [P + '235', 'NDB00771', 'Thực tế định lí sin'], [P + '290', 'NDB00771', 'Thực tế định lí sin'], [P + '320', 'NDB00771', 'Thực tế định lí sin'],
  [Q + '3049', 'NDB00771', 'Thực tế định lí sin'], [Q + '3059', 'NDB00771', 'Thực tế định lí sin'], [Q + '3066', 'NDB00771', 'Thực tế định lí sin'], [Q + '3067', 'NDB00771', 'Thực tế định lí sin'],
  [Q + '3070', 'NDB00771', 'Thực tế định lí sin'], [Q + '3071', 'NDB00771', 'Thực tế định lí sin'], [Q + '3074', 'NDB00771', 'Thực tế định lí sin (khác bản tan 073)'], [Q + '3079', 'NDB00771', 'Thực tế định lí sin'],
  [P + '253', 'NDB00767', 'Thực tế định lí cosin'], [P + '297', 'NDB00767', 'Thực tế định lí cosin'], [P + '347', 'NDB00767', 'Thực tế định lí cosin'],
  // diện tích / giải tam giác thuần
  [P + '323', 'NDB00772', 'Diện tích tam giác biết 3 cạnh (Hê-rông)'], [P + '364', 'NDB00772', 'Diện tích tam giác biết 3 cạnh (Hê-rông)'],
  [Q + '4015', 'NDB00772', 'Diện tích tam giác biết 3 cạnh (Hê-rông)'], [Q + '4033', 'NDB00772', 'Diện tích tam giác biết 3 cạnh (Hê-rông)'],
  [Q + '3007', 'NDB00769', 'Biết 2 góc (B qua cosB, C) và 1 cạnh: tìm cạnh bằng định lí sin'],
]

export const DEXUAT = [ // [ma_cau, dạng đề xuất, lý do] — vẫn "vừa": người duyệt chốt
  [P + '190', 'NDB00762', 'Chọn mệnh đề đúng: đáp án là định lí cosin (các ý còn lại lẫn sin, S) — nhận diện công thức, ứng viên 764'],
  [P + '375', 'NDB00762', 'Tìm khẳng định sai: ý sai là công thức định lí cosin (lẫn sin, S) — ứng viên 764'],
  [Q + '1060', 'NDB00762', 'Tìm khẳng định sai: ý sai là công thức định lí cosin (lẫn sin, S) — ứng viên 764'],
  [Q + '1042', 'NDB00763', 'Chọn khẳng định đúng: đáp án là định lí sin a/sinA=2R (lẫn công thức S) — ứng viên 764'],
  [Q + '1044', 'NDB00763', 'Chọn khẳng định đúng: đáp án là b/sinB=2R (lẫn S, cos) — ứng viên 764'],
  [Q + '1047', 'NDB00763', 'Tìm phát biểu sai: ý sai là R=a/sinA (định lí sin) — ứng viên 764'],
  [Q + '1050', 'NDB00763', 'Tìm phát biểu sai: ý sai là R=a/sinA (định lí sin) — ứng viên 764'],
  [P + '206', 'NDB01034', 'Tam giác vuông: R=BC/2, không dùng định lí sin — dạng R gần nhất; Thùy xác nhận có đưa vào 01034 không'],
  [Q + '3019', 'NDB01034', 'Tam giác vuông: R=BC/2, không dùng định lí sin — dạng R gần nhất; Thùy xác nhận có đưa vào 01034 không'],
  [P + '236', 'NDB01035', 'Tự luận 2 ý: a) BC bằng cosin (765) b) đường cao qua diện tích (01035); chọn theo ý cuối'],
  [Q + '3047', 'NDB00771', 'Thực tế đĩa vỡ: cosin tìm AC rồi sin tìm R (đáp số là R) — hai ứng viên 767/771'],
  [Q + '3054', 'NDB00771', 'Thực tế giếng tròn: cosin tìm BC rồi sin tìm R, tính diện tích tròn — ứng viên 767/773'],
  [Q + '4040', 'NDB00773', 'Cánh diều: S lớn nhất khi sinB=1 rồi tính tổng hai đường chéo — thực tế + diện tích tứ giác (có thể không dạng nào khớp)'],
  [Q + '4044', 'NDB00773', 'Logo ngôi sao: cosin tìm R rồi diện tích phần nền — thực tế + diện tích đa giác'],
  [Q + '4051', 'NDB00773', 'Họa tiết sơn: diện tích tam giác (Hê-rông) trừ hình tròn nội tiếp — thực tế + diện tích (ứng viên 01035)'],
]

export const KHONGKHOP = { // chỉ dùng tan trong tam giác vuông / hình học khác — KHÔNG dạng nào trong chuyên đề
  [P + '222']: 'Chiều cao cây: chỉ dùng tan/hình chữ nhật',
  [P + '396']: 'Chiều cao tháp: chỉ dùng tan',
  [P + '411']: 'Độ cao núi: chỉ dùng tan hai tam giác vuông',
  [Q + '3073']: 'Độ cao núi: chỉ dùng tan (trùng 411)',
  [Q + '3045']: 'Chiều cao tháp: chỉ dùng tan',
  [Q + '3053']: 'Chiều cao cây: chỉ dùng tan',
  [Q + '3056']: 'Độ cao núi: chỉ dùng tan',
  [Q + '3062']: 'Chiều cao hải đăng: chỉ dùng tan',
  [Q + '3085']: 'Tâm ngoại tiếp bằng toạ độ, không dùng định lí sin/cos',
}
