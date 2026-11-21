// Vẽ lại hình — Đại K6 lô 1 (21/11): T106000000365 — 3 thùng rác (ảnh gốc infographic, chữ ~5px ở màn 360px, nền ảnh mờ)
//   node scripts/anh/ve_lai/dai6-k6-lo1.mjs "<thu_muc_ra>"
// Nội dung KHỚP ảnh gốc từng loại rác (dữ liệu của đề, không phải đáp số trung gian). Mã lỗi: a (không đọc chắc ở khung hẹp).
import { svgDoc, luu } from '../ve_hinh_lib.mjs'

const RA = process.argv[2]
const FF = `font-family="'Times New Roman',Times,serif"`
const tx = (x, y, t, s, col = '#111', bold = false) =>
  `<text x="${x}" y="${y}" fill="${col}" stroke="none" ${FF} font-size="${s}"${bold ? ' font-weight="bold"' : ''}>${t}</text>`

const thung = [
  { mau: '#2e9e5b', nen: '#e6f4ea', ten: 'RÁC DỄ PHÂN HỦY', dong: ['Thức ăn … dư thừa, rau củ quả, hoa lá, cây cỏ,', 'bã trà, giấy ăn'] },
  { mau: '#d99a00', nen: '#fdf3d6', ten: 'RÁC TÁI CHẾ', dong: ['Giấy báo, thùng carton, hộp giấy, bì thư,', 'vỏ bao thuốc lá, vỏ lon, hộp đựng trà, kim loại,', 'đồ nhựa, chai nhựa, bình xịt, vải, quần áo cũ'] },
  { mau: '#707070', nen: '#ececec', ten: 'RÁC KHÓ PHÂN HỦY', dong: ['Nhãn chai, túi nilon, hộp đựng: bánh, kem, cơm hộp,', 'văn phòng phẩm, đồ gốm, sứ, thủy tinh, vỏ sò, vỏ trứng,', 'đồ da, cao su, tấm xốp, đồng hồ, băng keo, đĩa CD'] },
]
const W = 560, rowH = [100, 126, 126], gap = 12
let y = 12, b = ''
thung.forEach((t, i) => {
  const h = rowH[i]
  b += `<rect x="10" y="${y}" width="${W - 20}" height="${h}" rx="10" fill="${t.nen}" stroke="${t.mau}" stroke-width="2.5"/>`
  // thùng rác: nắp + thân hình thang
  const cx = 52, top = y + h / 2 - 34
  b += `<rect x="${cx - 28}" y="${top}" width="56" height="9" rx="3" fill="${t.mau}" stroke="none"/>`
  b += `<rect x="${cx - 8}" y="${top - 6}" width="16" height="7" rx="2" fill="${t.mau}" stroke="none"/>`
  b += `<path d="M ${cx - 24} ${top + 12} L ${cx + 24} ${top + 12} L ${cx + 19} ${top + 68} L ${cx - 19} ${top + 68} Z" fill="${t.mau}" stroke="none"/>`
  b += `<path d="M ${cx - 9} ${top + 26} L ${cx - 9} ${top + 54} M ${cx} ${top + 26} L ${cx} ${top + 54} M ${cx + 9} ${top + 26} L ${cx + 9} ${top + 54}" stroke="#fff" stroke-width="2.5"/>`
  b += tx(100, y + 30, t.ten, 22, t.mau, true)
  t.dong.forEach((d, k) => { b += tx(100, y + 58 + k * 25, d, 18) })
  y += h + gap
})
const H = y
await luu(RA, 'T106000000365', W, H, svgDoc(W, H, b))
