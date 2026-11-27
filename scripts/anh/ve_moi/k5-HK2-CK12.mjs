import { bang, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
const { body, w, h } = bang([110, 110, 110, 110, 110], [
  [['Lượng mưa', '(mm)'], 'Dưới 150 mm', ['150 mm đến', 'dưới 300 mm'], ['300 mm đến', 'dưới 450 mm'], ['450 mm', 'trở lên']],
  [['Số tháng', 'trong năm'], '', '', '', '']], [60, 64], 16)
await ra(OUT, 'T105000000266', w, h, body)
baoCao(OUT, [{ ma_cau: 'T105000000266', tep: 'T105000000266.png', nguon: 've_lenh', trang_pdf: 116, ghi_chu: 'Bảng phân nhóm lượng mưa, 4 ô số tháng để trống' }], [])
