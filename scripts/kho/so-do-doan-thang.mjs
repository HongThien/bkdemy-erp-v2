// SƠ ĐỒ ĐOẠN THẲNG (tiểu học) — máy vẽ SVG từ MÔ TẢ CÓ CẤU TRÚC, AI không vẽ điểm ảnh (spec-luong-kho.md §5.2 T4).
//   node scripts/kho/so-do-doan-thang.mjs mo-ta.json --out so-do.svg
//   import { veSoDo } from './so-do-doan-thang.mjs'  →  veSoDo(moTa) trả chuỗi SVG
//
// Mô tả (JSON):
// {
//   "tieu_de": "Sau 5 năm nữa",                       // tuỳ chọn, in nghiêng trên sơ đồ
//   "gia_tri_phan": 8,                                 // BẮT BUỘC: giá trị THẬT của 1 phần (lấy từ lời giải) — để vẽ đúng tỉ lệ
//   "hang": [                                          // mỗi hàng = một đại lượng
//     { "nhan": "Tuổi con", "phan": 1 },               // phan = số phần bằng nhau (số nguyên ≥ 1)
//     { "nhan": "Tuổi mẹ",  "phan": 1, "them": "25 tuổi" }   // them = đoạn thêm (tổng–hiệu), ghi nhãn trên đoạn
//     { "nhan": "Cam và bưởi", "phan": 2, "bot": "4 cây" }   // bot = đoạn THIẾU ở cuối (nét đứt): "kém 2 lần TBC 4 cây"
//   ],                                                 // độ dài them/bot lấy từ số đầu nhãn ("25 tuổi" ⇒ 25) hoặc them_gt/bot_gt
//   "tong": "41 tuổi",                                 // tuỳ chọn: ngoặc nhọn bên phải gộp tất cả hàng
//   "hieu": "27 tuổi",                                 // tuỳ chọn: ngoặc giữa 2 hàng đầu cho phần chênh (hiệu–tỉ)
//   "dau_hoi": ["Tuổi con"]                            // tuỳ chọn: hàng nào ghi "?" dưới đoạn
// }
// ⭐ ĐÚNG TỈ LỆ (CEO 08/10: "vẽ sơ đồ phải đúng tỉ lệ với số liệu bài toán"): mọi đoạn — phần, đoạn thêm, đoạn thiếu — dài theo
// giá trị thật. Giá trị mỗi hàng = phan × gia_tri_phan + them − bot. MÁY TỰ KIỂM: số trong nhãn "tong" phải bằng tổng các hàng,
// số trong nhãn "hieu" phải bằng chênh lệch hai hàng đầu — lệch thì TỪ CHỐI VẼ (sơ đồ sai số liệu không được ra khỏi máy).
// Quy ước vẽ theo sách tiểu học: hàng thẳng cột từ cùng một mốc trái, nhãn bên trái, dấu "?" dưới đoạn cần tìm, ngoặc tổng bên phải.
import { readFileSync, writeFileSync } from 'node:fs'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const soDau = (s) => { const k = String(s ?? '').replace(/\s/g, '').match(/^\d+/); return k ? Number(k[0]) : null }
const r1 = (x) => Math.round(x * 10) / 10

export function veSoDo(m) {
  const H = 44, TOP = m.tieu_de ? 34 : 14, TICK = 7
  const hang = (m.hang || []).map((h) => ({ ...h }))   // bản sao: hàm vẽ ghi _end/_y vào hàng — KHÔNG được làm bẩn mô tả của người gọi
  if (!hang.length) throw new Error('hang rỗng')
  const gtp = Number(m.gia_tri_phan)
  if (!(gtp > 0)) throw new Error('Thiếu "gia_tri_phan" (giá trị thật của 1 phần) — sơ đồ phải đúng tỉ lệ với số liệu')
  const gt = hang.map((h) => {
    const n = h.phan || 1
    const them = h.them ? (h.them_gt ?? soDau(h.them)) : 0
    const bot = h.bot ? (h.bot_gt ?? soDau(h.bot)) : 0
    if (them == null) throw new Error(`Hàng "${h.nhan}": không đọc được số của đoạn thêm "${h.them}" — ghi them_gt`)
    if (bot == null) throw new Error(`Hàng "${h.nhan}": không đọc được số của đoạn thiếu "${h.bot}" — ghi bot_gt`)
    if (bot >= gtp) throw new Error(`Hàng "${h.nhan}": đoạn thiếu ${bot} không nhỏ hơn 1 phần (${gtp})`)
    return { n, them, bot, tong: n * gtp + them - bot }
  })
  // máy tự kiểm sơ đồ khớp số liệu đề
  const tongDe = soDau(m.tong)
  if (tongDe != null) {
    const s = gt.reduce((a, g) => a + g.tong, 0)
    if (s !== tongDe) throw new Error(`Sơ đồ SAI SỐ LIỆU: tổng các hàng = ${s} nhưng nhãn tổng ghi ${tongDe}`)
  }
  const hieuDe = soDau(m.hieu)
  if (hieuDe != null && hang.length >= 2) {
    const d = Math.abs(gt[0].tong - gt[1].tong)
    if (d !== hieuDe) throw new Error(`Sơ đồ SAI SỐ LIỆU: chênh lệch hai hàng = ${d} nhưng nhãn hiệu ghi ${hieuDe}`)
  }
  // tỉ lệ: hàng dài nhất rộng MAXW px; 1 đơn vị = MAXW / giá trị lớn nhất
  const maxPhan = Math.max(...gt.map((g) => g.n))
  const MAXW = Math.min(480, Math.max(300, maxPhan * 56))
  const maxGt = Math.max(...gt.map((g) => g.tong))
  const U = MAXW / maxGt, PHAN = gtp * U
  // lề trái nới theo nhãn dài nhất (≈7,6 px/ký tự cỡ 14) để nhãn như "Trung bình cộng:" không bị cắt
  const LEFT = Math.max(110, Math.ceil(Math.max(...hang.map((h) => String(h.nhan).length + 1)) * 7.6) + 20)
  const W = Math.ceil(LEFT + MAXW + (m.tong ? 70 : 24) + 10)
  const Hh = TOP + hang.length * H + 10 + (m.hieu ? 38 : 0)
  const out = []
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" font-family="Arial, Helvetica, sans-serif" font-size="14">`)
  out.push(`<rect width="${W}" height="${Hh}" fill="#fff"/>`)
  if (m.tieu_de) out.push(`<text x="${LEFT}" y="20" font-style="italic" fill="#334155">${esc(m.tieu_de)}</text>`)
  const vach = (x, y, w = 2) => out.push(`<line x1="${r1(x)}" y1="${y - TICK}" x2="${r1(x)}" y2="${y + TICK}" stroke="#0f172a" stroke-width="${w}"/>`)
  const doan = (x1, x2, y, extra = 'stroke-width="2"') => out.push(`<line x1="${r1(x1)}" y1="${y}" x2="${r1(x2)}" y2="${y}" stroke="#0f172a" ${extra}/>`)
  const nhanTren = (x, y, s) => out.push(`<text x="${r1(x)}" y="${y - 10}" text-anchor="middle" font-size="12" fill="#b45309">${esc(s)}</text>`)
  hang.forEach((h, i) => {
    const { n, them, bot } = gt[i]
    const y = TOP + i * H + 18
    const len = n * PHAN
    out.push(`<text x="${LEFT - 10}" y="${y + 5}" text-anchor="end" fill="#0f172a">${esc(h.nhan)}:</text>`)
    // đoạn chính chia phần; có "bot" thì khúc cuối (dài đúng bot) vẽ nét đứt và đoạn thật dừng trước nó
    const lien = len - bot * U
    doan(LEFT, LEFT + lien, y)
    for (let k = 0; k <= n; k++) vach(LEFT + k * PHAN, y, h.bot && k === n ? 1 : 2)
    let end = LEFT + len
    if (h.bot) {
      doan(LEFT + lien, LEFT + len, y, 'stroke-width="1.5" stroke-dasharray="4 3"')
      vach(LEFT + lien, y)
      nhanTren(LEFT + lien + (bot * U) / 2, y, h.bot)
      end = LEFT + lien
    }
    if (h.them) {
      const w = them * U
      doan(end, end + w, y)
      vach(end + w, y)
      nhanTren(end + w / 2, y, h.them)
      end += w
    }
    if ((m.dau_hoi || []).includes(h.nhan)) out.push(`<text x="${r1((LEFT + end) / 2)}" y="${y + 20}" text-anchor="middle" fill="#dc2626">?</text>`)
    h._end = end; h._y = y
  })
  if (m.tong) {
    const x = r1(LEFT + Math.max(...hang.map((h) => h._end - LEFT)) + 14)
    const y1 = hang[0]._y - 8, y2 = hang[hang.length - 1]._y + 8, ym = (y1 + y2) / 2
    // ngoặc nhọn phải
    out.push(`<path d="M${x},${y1} q8,0 8,8 L${x + 8},${ym - 8} q0,8 8,8 q-8,0 -8,8 L${x + 8},${y2 - 8} q0,8 -8,8" fill="none" stroke="#0f172a" stroke-width="1.5"/>`)
    out.push(`<text x="${x + 22}" y="${ym + 5}" fill="#0f172a">${esc(m.tong)}</text>`)
  }
  if (m.hieu && hang.length >= 2) {
    const a = hang[0], b = hang[1]
    const x1 = r1(Math.min(a._end, b._end)), x2 = r1(Math.max(a._end, b._end))
    const y = Math.max(a._y, b._y) + 34   // dưới dấu "?" của hàng (y+20), không đè
    out.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#0f172a" stroke-width="1"/>`)
    out.push(`<line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="#0f172a" stroke-width="1"/>`)
    out.push(`<line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="#0f172a" stroke-width="1"/>`)
    out.push(`<text x="${r1((x1 + x2) / 2)}" y="${y + 16}" text-anchor="middle" font-size="12" fill="#0f172a">${esc(m.hieu)}</text>`)
  }
  out.push('</svg>')
  return out.join('\n')
}

if (process.argv[1] && process.argv[1].endsWith('so-do-doan-thang.mjs')) {
  const f = process.argv[2]
  if (!f) { console.error('Cần file mô tả .json'); process.exit(1) }
  const i = process.argv.indexOf('--out')
  let svg
  try { svg = veSoDo(JSON.parse(readFileSync(f, 'utf8'))) } catch (e) { console.error('✘', f, '—', e.message); process.exit(1) }
  if (i > 0) { writeFileSync(process.argv[i + 1], svg); console.log('→', process.argv[i + 1]) } else process.stdout.write(svg)
}
