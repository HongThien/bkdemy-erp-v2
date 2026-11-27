// Gói G23: 10 bảng hình tròn (đường kính/chu vi; bán kính/diện tích)
import { bang, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
const D = '…………'
const dt = (r) => String(Math.round(r * r * 3.14 * 10000) / 10000).replace('.', ',')
const bc = []
// chu vi: đường kính
const CV = {
  T105100407008: ['10 dm', '2,5 cm', '0,6 m', '15 cm'],
  T105100407009: ['12 dm', '3,5 cm', '1,5 m', '0,4 m'],
  T105100407010: ['2 dm', '4,5 cm', '0,5 m', '2,5 dm'],
}
for (const [ma, v] of Object.entries(CV)) {
  const t = bang([200, 95, 95, 95, 95], [['Đường kính hình tròn', ...v], ['Chu vi hình tròn', D, D, D, D]], 52, 18)
  await ra(OUT, ma, t.w, t.h, t.body)
  bc.push({ ma_cau: ma, ghi_chu: 'Bảng đường kính / chu vi, hàng chu vi để chỗ chấm như ảnh cũ' })
}
// diện tích: [bán kính, đơn vị], ô đầu có sẵn đáp số mẫu
const DT = {
  T105100407053: [[3, 'dm'], [4, 'cm'], [5, 'm'], [10, 'mm']],
  T105100407054: [[4, 'dm'], [5, 'cm'], [3, 'm'], [8, 'mm']],
  T105100407055: [[5, 'dm'], [6, 'cm'], [4, 'm'], [12, 'mm']],
  T105100407057: [[8, 'dm'], [9, 'cm'], [8, 'm'], [25, 'mm']],
  T105100407058: [[9, 'dm'], [10, 'cm'], [9, 'm'], [30, 'mm']],
  T105100407059: [[10, 'dm'], [12, 'cm'], [10, 'm'], [35, 'mm']],
  T105100407060: [[12, 'dm'], [15, 'cm'], [12, 'm'], [40, 'mm']],
}
const mau = { T105100407053: '28,26', T105100407054: '50,24', T105100407055: '78,5', T105100407057: '200,96', T105100407058: '254,34', T105100407059: '314', T105100407060: '452,16' }
for (const [ma, v] of Object.entries(DT)) {
  const m = dt(v[0][0])
  if (m !== mau[ma]) throw new Error(ma + ' mẫu ' + m + ' != ' + mau[ma])
  const t = bang([186, 150, 85, 85, 85], [['Bán kính hình tròn', ...v.map(([n, u]) => `${n} ${u}`)], ['Diện tích hình tròn', `${m} ${v[0][1]}²`, '', '', '']], 62, 18)
  await ra(OUT, ma, t.w, t.h, t.body)
  bc.push({ ma_cau: ma, ghi_chu: 'Bảng bán kính / diện tích, ô mẫu đầu có sẵn, 3 ô còn lại trống' })
}
baoCao(OUT, bc, [])
