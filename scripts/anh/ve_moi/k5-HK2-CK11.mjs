import { quat, txt, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
// theo chiều kim đồng hồ từ 12 giờ (như sách): C 23, D 20, A 24, B 33
const A = '#f0807a', B = '#6fbf80', C = '#f08fc8', D = '#b08ad0'
const sl = [{ pct: 23, fill: C, label: '23%' }, { pct: 20, fill: D, label: '20%' }, { pct: 24, fill: A, label: '24%' }, { pct: 33, fill: B, label: '33%' }]
let b = quat(150, 150, 130, sl, 22)
;[['Khán đài A', A], ['Khán đài B', B], ['Khán đài C', C], ['Khán đài D', D]].forEach(([t, c], i) => {
  b += `<rect x="310" y="${105 + i * 36}" width="20" height="20" fill="${c}" stroke="#222" stroke-width="1.5"/>` + txt(340, 122 + i * 36, t, 22, 'start')
})
await ra(OUT, 'T105000000258', 500, 310, b)
baoCao(OUT, [{ ma_cau: 'T105000000258', tep: 'T105000000258.png', nguon: 've_lenh', trang_pdf: 114, ghi_chu: 'Quạt tròn 4 khán đài 23/20/24/33 đúng tỉ lệ; màu theo chú giải (thứ tự quạt đối chiếu ảnh kho)' }], [])
