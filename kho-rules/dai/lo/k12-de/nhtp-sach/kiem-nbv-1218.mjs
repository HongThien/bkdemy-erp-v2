// kiem-nbv-1218.mjs — 4 tệp NBV 12-18 (E1, E2, E3 trả lời ngắn · F bài tập nâng cao): bài nào ĐÃ có trong kho, bài nào CHƯA.
//   node kho-rules/dai/lo/k12-de/nhtp-sach/kiem-nbv-1218.mjs
// Khớp bằng chuẩn hoá (bỏ LaTeX trang trí/khoảng trắng) + 3 đoạn dò; cần ≥2 đoạn cùng nằm trong MỘT dòng kho.
import fs from 'node:fs'
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const D = 'kho-rules/dai/lo/k12-de/nhtp-sach/'
const BS = String.fromCharCode(92)
const norm = (s) => String(s ?? '').normalize('NFC').toLowerCase()
  .replace(new RegExp(BS + BS + '(left|right|dfrac|tfrac|frac|displaystyle|limits|mathrm|text|,|;|!|mathbf|quad)', 'g'), '')
  .replace(/\[\[[^\]]*\]\]/g, '').replace(/[^\p{L}\p{N}]/gu, '')
const WANT = /^(E1|E2|E3|F)\./
const sach = JSON.parse(fs.readFileSync(D + 'bai-tap-sach.json', 'utf8')).filter((x) => /12-18/.test(x.nguon) && WANT.test(x.file))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
const rows = []
for (const b of ['dai_cau_hoi', 'hgt_cau_hoi']) {
  for (const r of (await c.query(`select ma_cau, noi_dung, lua_chon, menh_de from ${b} where xoa_at is null and ma_cau ~ '^T[13]12'`)).rows) {
    rows.push({ ma: r.ma_cau, k: norm((r.noi_dung ?? '') + (Array.isArray(r.lua_chon) ? r.lua_chon.join('') : '') + (Array.isArray(r.menh_de) ? r.menh_de.map((m) => m.noi_dung ?? '').join('') : '')) })
  }
}
await c.end()
console.log('kho K12 (dai+hgt):', rows.length, '· bài sách 4 tệp:', sach.length)
const co = [], chua = []
for (const x of sach) {
  const k = norm(x.noi_dung)
  if (k.length < 20) { chua.push({ ...x, ly_do: 'đề quá ngắn' }); continue }
  const n = k.length, L = Math.min(40, Math.floor(n / 3))
  const probes = [k.slice(0, L), k.slice(Math.floor(n / 2) - L / 2, Math.floor(n / 2) + L / 2), k.slice(n - L)]
  let hit = null
  for (const r of rows) { if (probes.filter((p) => r.k.includes(p)).length >= 2) { hit = r.ma; break } }
  if (hit) co.push({ file: x.file, so: x.so, ma_cau: hit }); else chua.push(x)
}
const byFile = (arr) => arr.reduce((o, x) => ((o[x.file] = (o[x.file] || 0) + 1), o), {})
console.log('ĐÃ có:', co.length, JSON.stringify(byFile(co)))
console.log('CHƯA có:', chua.length, JSON.stringify(byFile(chua)))
const loi = {}
for (const x of chua) { const k = x.loi.length ? x.loi.join(';') : (x.dap_an ? 'có đáp án' : (x.loi_giai ? 'chỉ có lời giải' : 'không lời giải')); loi[k] = (loi[k] || 0) + 1 }
console.log('CHƯA có — tình trạng:', JSON.stringify(loi))
fs.writeFileSync(D + 'nbv1218-chua-co.json', JSON.stringify(chua))
fs.writeFileSync(D + 'nbv1218-da-co.json', JSON.stringify(co))
