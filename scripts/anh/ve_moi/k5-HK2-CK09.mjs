import { bang, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
const { body, w, h } = bang([100, 110, 110, 110, 110], [
  ['Chiều cao', 'Dưới 130 cm', ['130 cm –', 'dưới 135 cm'], ['135 cm –', 'dưới 140 cm'], ['140 cm', 'trở lên']],
  [['Số thành', 'viên'], '', '', '', '']], [56, 64], 17)
await ra(OUT, 'T105000000606', w, h, body)
baoCao(OUT, [{ ma_cau: 'T105000000606', tep: 'T105000000606.png', nguon: 've_lenh', trang_pdf: 108, ghi_chu: 'Bảng phân nhóm chiều cao, 4 ô số thành viên để trống cho HS điền' }], [])
