// SƠ ĐỒ ĐOẠN THẲNG (tiểu học) — máy vẽ SVG từ MÔ TẢ CÓ CẤU TRÚC, AI không vẽ điểm ảnh (spec-luong-kho.md §5.2 T4).
//   node scripts/kho/so-do-doan-thang.mjs mo-ta.json --out so-do.svg
//   import { veSoDo } from './so-do-doan-thang.mjs'  →  veSoDo(moTa) trả chuỗi SVG
//
// Mô tả (JSON):
// {
//   "tieu_de": "Sau 5 năm nữa",                       // tuỳ chọn, in nghiêng trên sơ đồ
//   "hang": [                                          // mỗi hàng = một đại lượng
//     { "nhan": "Tuổi con", "phan": 1 },               // phan = số phần bằng nhau (số nguyên ≥ 1)
//     { "nhan": "Tuổi mẹ",  "phan": 1, "them": "25 tuổi" }   // them = đoạn thêm (tổng–hiệu), ghi nhãn trên đoạn
//   ],
//   "tong": "41 tuổi",                                 // tuỳ chọn: ngoặc nhọn bên phải gộp tất cả hàng
//   "hieu": "27 tuổi",                                 // tuỳ chọn: ngoặc đứng giữa 2 hàng cho phần chênh (hiệu–tỉ)
//   "dau_hoi": ["Tuổi con"]                            // tuỳ chọn: hàng nào ghi "?" ở cuối đoạn
// }
// Quy ước vẽ theo sách tiểu học: mỗi phần = 1 ô dài bằng nhau, hàng thẳng cột từ cùng một mốc trái, nhãn bên trái, dấu "?" dưới
// đoạn cần tìm, ngoặc nhọn tổng bên phải. Đoạn "thêm" vẽ ngắn hơn 1 phần (không tỉ lệ) và có nhãn ở trên — đúng cách sách vẽ.
import { readFileSync, writeFileSync } from 'node:fs'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function veSoDo(m) {
  const PHAN = 56, THEM = 36, H = 44, LEFT = 110, TOP = m.tieu_de ? 34 : 14, TICK = 7
  const hang = m.hang || []
  if (!hang.length) throw new Error('hang rỗng')
  const maxPhan = Math.max(...hang.map((h) => (h.phan || 1)))
  const maxLen = Math.max(...hang.map((h) => (h.phan || 1) * PHAN + (h.them ? THEM : 0)))
  const W = LEFT + maxLen + (m.tong ? 70 : 24) + 10
  const Hh = TOP + hang.length * H + 10 + (m.hieu ? 30 : 0)
  const out = []
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" font-family="Arial, Helvetica, sans-serif" font-size="14">`)
  out.push(`<rect width="${W}" height="${Hh}" fill="#fff"/>`)
  if (m.tieu_de) out.push(`<text x="${LEFT}" y="20" font-style="italic" fill="#334155">${esc(m.tieu_de)}</text>`)
  hang.forEach((h, i) => {
    const y = TOP + i * H + 18
    const n = h.phan || 1
    const len = n * PHAN
    out.push(`<text x="${LEFT - 10}" y="${y + 5}" text-anchor="end" fill="#0f172a">${esc(h.nhan)}:</text>`)
    // đoạn chính chia phần
    out.push(`<line x1="${LEFT}" y1="${y}" x2="${LEFT + len}" y2="${y}" stroke="#0f172a" stroke-width="2"/>`)
    for (let k = 0; k <= n; k++) out.push(`<line x1="${LEFT + k * PHAN}" y1="${y - TICK}" x2="${LEFT + k * PHAN}" y2="${y + TICK}" stroke="#0f172a" stroke-width="2"/>`)
    let end = LEFT + len
    if (h.them) {
      out.push(`<line x1="${end}" y1="${y}" x2="${end + THEM}" y2="${y}" stroke="#0f172a" stroke-width="2"/>`)
      out.push(`<line x1="${end + THEM}" y1="${y - TICK}" x2="${end + THEM}" y2="${y + TICK}" stroke="#0f172a" stroke-width="2"/>`)
      out.push(`<text x="${end + THEM / 2}" y="${y - 10}" text-anchor="middle" font-size="12" fill="#b45309">${esc(h.them)}</text>`)
      end += THEM
    }
    if ((m.dau_hoi || []).includes(h.nhan)) out.push(`<text x="${LEFT + len / 2}" y="${y + 20}" text-anchor="middle" fill="#dc2626">?</text>`)
    h._end = end; h._y = y
  })
  if (m.tong) {
    const x = LEFT + maxLen + 14
    const y1 = hang[0]._y - 8, y2 = hang[hang.length - 1]._y + 8, ym = (y1 + y2) / 2
    // ngoặc nhọn phải
    out.push(`<path d="M${x},${y1} q8,0 8,8 L${x + 8},${ym - 8} q0,8 8,8 q-8,0 -8,8 L${x + 8},${y2 - 8} q0,8 -8,8" fill="none" stroke="#0f172a" stroke-width="1.5"/>`)
    out.push(`<text x="${x + 22}" y="${ym + 5}" fill="#0f172a">${esc(m.tong)}</text>`)
  }
  if (m.hieu && hang.length >= 2) {
    const a = hang[0], b = hang[1]
    const x1 = Math.min(a._end, b._end), x2 = Math.max(a._end, b._end)
    const y = Math.max(a._y, b._y) + 26
    out.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#0f172a" stroke-width="1"/>`)
    out.push(`<line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="#0f172a" stroke-width="1"/>`)
    out.push(`<line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="#0f172a" stroke-width="1"/>`)
    out.push(`<text x="${(x1 + x2) / 2}" y="${y + 16}" text-anchor="middle" font-size="12" fill="#0f172a">${esc(m.hieu)}</text>`)
  }
  out.push('</svg>')
  return out.join('\n')
}

if (process.argv[1] && process.argv[1].endsWith('so-do-doan-thang.mjs')) {
  const f = process.argv[2]
  if (!f) { console.error('Cần file mô tả .json'); process.exit(1) }
  const i = process.argv.indexOf('--out')
  const svg = veSoDo(JSON.parse(readFileSync(f, 'utf8')))
  if (i > 0) { writeFileSync(process.argv[i + 1], svg); console.log('→', process.argv[i + 1]) } else process.stdout.write(svg)
}
