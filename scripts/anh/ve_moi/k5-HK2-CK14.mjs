import { quat, txt, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
const R = '#f0807a', G = '#6fbf80', V = '#a98bb0', P = '#f08fc8', Bl = '#6fa8e8'
const sl = [{ pct: 26, fill: R, label: '26%' }, { pct: 30, fill: G, label: '30%' }, { pct: 14, fill: V, label: '14%' }, { pct: 20, fill: P, label: '?' }, { pct: 10, fill: Bl, label: '10%' }]
let b = quat(150, 150, 130, sl, 22)
;[['Chơi thể thao', R], ['Đọc truyện', G], ['Xem ti vi', V], ['Nghe nhạc', P], ['Vẽ tranh', Bl]].forEach(([t, c], i) => {
  b += `<rect x="300" y="${88 + i * 36}" width="20" height="20" fill="${c}" stroke="#222" stroke-width="1.5"/>` + txt(330, 105 + i * 36, t, 22, 'start')
})
await ra(OUT, 'T105000000375', 500, 310, b)
baoCao(OUT, [{ ma_cau: 'T105000000375', tep: 'T105000000375.png', nguon: 've_lenh', trang_pdf: 123, ghi_chu: 'Quạt tròn 26/30/14/?/10 (ô ? = phần còn lại, đề cho sẵn dấu ?), đúng tỉ lệ' }], [])
