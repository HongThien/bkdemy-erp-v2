import { txt, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
const data = [['Hà Nội', 8053663], ['Hải Phòng', 2028514], ['Đà Nẵng', 1134310], ['TP Hồ Chí|Minh', 8993082], ['Cần Thơ', 1235171]]
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const top = 70, step = 26, base = top + 10 * step   // 10 000 000 ở y=top, 0 ở y=base
const ax = 100
let b = txt(285, 28, 'Số dân của các Thành phố trực thuộc trung ương năm 2019', 16.5, 'middle', 'font-weight="bold"')
b += txt(ax - 10, 52, '(người)', 15, 'end', 'font-style="italic"')
for (let k = 1; k <= 10; k++) {
  const y = base - k * step
  b += `<line x1="${ax}" y1="${y}" x2="545" y2="${y}" stroke="#aab4c0" stroke-width="1"/>` + txt(ax - 6, y + 5, fmt(k * 1000000), 14, 'end')
}
b += txt(ax - 6, base + 5, '0', 14, 'end')
b += `<line x1="${ax}" y1="${base}" x2="${ax}" y2="${top - 14}"/><path d="M ${ax - 5} ${top - 8} L ${ax} ${top - 16} L ${ax + 5} ${top - 8}"/>`
b += `<line x1="${ax}" y1="${base}" x2="555" y2="${base}"/><path d="M 549 ${base - 5} L 557 ${base} L 549 ${base + 5}"/>`
const slot = 86, bw = 50
data.forEach(([ten, v], i) => {
  const hh = v / 1e6 * step, x = ax + 8 + i * slot + (slot - bw) / 2 - 4
  b += `<rect x="${x}" y="${base - hh}" width="${bw}" height="${hh}" fill="#cfd8e6" stroke="#222" stroke-width="2"/>`
  b += txt(x + bw / 2, base - hh - 6, fmt(v), 13.5)
  ten.split('|').forEach((l, k) => { b += txt(x + bw / 2, base + 22 + k * 18, l, 15) })
})
b += txt(560, base + 40, 'Thành phố', 15, 'end', 'font-style="italic"')
await ra(OUT, 'T105000000287', 575, base + 70, b)
baoCao(OUT, [{ ma_cau: 'T105000000287', tep: 'T105000000287.png', nguon: 've_lenh', trang_pdf: 120, ghi_chu: 'Biểu đồ cột 5 thành phố, cột cao đúng theo số liệu (trục 0–10 000 000, vạch mỗi 1 000 000)' }], [])
