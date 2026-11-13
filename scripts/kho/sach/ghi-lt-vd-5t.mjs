// ============================================================================
// ghi-lt-vd-5t.mjs — KIỂM rồi GHI mô tả · lý thuyết · ví dụ của dạng bài 5T do các trạm soạn (định dạng khối "=== NDB… / @@mo_ta / @@ly_thuyet / @@vi_du").
//
//   node scripts/kho/sach/ghi-lt-vd-5t.mjs <lt-ra-1.md> [<lt-ra-2.md> …] [--ghi]
//
// Kiểm (spec-format-noidung): lý thuyết = các khối mở bằng thẻ ##ĐN/##ĐL/##TC/##CY/##PP/##NX cách nhau 1 dòng trống, KHÔNG có ví dụ/"Bài giải";
// ví dụ = ##VD, đề liền (không dòng trống) rồi "**Hướng dẫn giải:**"; không ký hiệu cấm; KaTeX hợp lệ. Dạng không đạt ⇒ KHÔNG ghi, in lý do.
// Ghi CHỈ VÀO Ô TRỐNG (không đè nội dung đã có) — riêng `mo_ta` của dạng do máy tạo 13/11 (id ≥ NDB02900, mô tả sơ sài lấy từ ngoặc) thì thay.
// Không --ghi: chạy thử (ROLLBACK).
// ============================================================================
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'
const require = createRequire(import.meta.url)
const katex = require('katex')

const a = process.argv.slice(2), GHI = a.includes('--ghi'), DE = a.includes('--ghi-de'), tep = a.filter((x) => !x.startsWith('--'))
if (!tep.length) { console.error('Dùng: node scripts/kho/sach/ghi-lt-vd-5t.mjs <lt-ra-N.md>… [--ghi]'); process.exit(2) }
const THE = /^##(ĐN|ĐL|TC|CY|PP|NX)\s*$/

function docKhoi(txt) {
  const kq = new Map()
  for (const k of txt.replace(/\r\n/g, '\n').split(/^=== /m).slice(1)) {
    const i = k.indexOf('\n'); const id = k.slice(0, i).trim()
    const m = k.slice(i + 1).match(/^@@mo_ta\n([\s\S]*?)\n@@ly_thuyet\n([\s\S]*?)\n@@vi_du\n([\s\S]*)$/)
    kq.set(id, m ? { mo_ta: m[1].trim(), ly_thuyet: m[2].trim(), vi_du: m[3].trim() } : null)
  }
  return kq
}
function kiemKatex(s) {
  const loi = []
  if ((s.match(/\$/g) || []).length % 2) loi.push('số dấu $ lẻ')
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    const w = []; const o = console.warn; console.warn = (x) => w.push(x)
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'warn' }) } catch (e) { w.push(e.message) }
    console.warn = o
    if (w.length) loi.push(`KaTeX: ${m[1].slice(0, 40)} | ${String(w[0]).slice(0, 60)}`)
  }
  return loi
}
function kiem(c) {
  const loi = []
  if (!c) return ['khối không đúng khuôn @@mo_ta / @@ly_thuyet / @@vi_du']
  if (c.mo_ta.length < 40 || c.mo_ta.length > 1200) loi.push(`mô tả dài ${c.mo_ta.length} ký tự (cần 40–1200)`)
  const kl = c.ly_thuyet.split(/\n[ \t]*\n/).map((x) => x.trim()).filter(Boolean)
  if (!kl.length) loi.push('lý thuyết rỗng')
  const co = new Set()
  for (const k of kl) { const t = k.split('\n')[0].trim(); if (!THE.test(t)) loi.push(`khối lý thuyết không mở bằng thẻ: «${k.slice(0, 40)}»`); else co.add(t.slice(2)) }
  if (!co.has('TC') && !co.has('PP')) loi.push('lý thuyết thiếu ##TC hoặc ##PP')
  if (/##VD|Bài giải|Hướng dẫn giải/i.test(c.ly_thuyet)) loi.push('lý thuyết chứa ví dụ / lời giải')
  const vd = c.vi_du.split(/^##VD\s*$/m).slice(1)
  if (!c.vi_du.startsWith('##VD') || !vd.length) loi.push('ví dụ không mở bằng ##VD')
  for (const [i, v] of vd.entries()) {
    const j = v.indexOf('**Hướng dẫn giải:**')
    if (j < 0) { loi.push(`VD${i + 1}: thiếu "**Hướng dẫn giải:**"`); continue }
    const de = v.slice(0, j).trim()
    if (/\n[ \t]*\n/.test(de)) loi.push(`VD${i + 1}: đề có dòng trống (cắt khung)`)
    if (de.length < 20) loi.push(`VD${i + 1}: đề quá ngắn`)
    const lg = v.slice(j + 19).trim()
    if (lg.length < 8) loi.push(`VD${i + 1}: lời giải rỗng`)   // bài Tính / điền kết quả không có dòng "Đáp số" (k5T.md §1.5) — không bắt buộc
  }
  for (const [ten, s] of [['mô tả', c.mo_ta], ['lý thuyết', c.ly_thuyet], ['ví dụ', c.vi_du]]) {
    if (/[⇒⇔∈∀≤≥]/.test(s)) loi.push(`${ten}: ký hiệu cấm (⇒ ⇔ ∈ ∀ ≤ ≥)`)
    if (/\\div|\\frac\b/.test(s)) loi.push(`${ten}: dùng \\div / \\frac (phải dấu : và \\dfrac)`)
    for (const l of kiemKatex(s)) loi.push(`${ten}: ${l}`)
  }
  return loi
}

const goi = new Map()
for (const f of tep) for (const [id, c] of docKhoi(readFileSync(f, 'utf8'))) { if (goi.has(id)) console.log(`⚠ ${id} xuất hiện ở nhiều tệp — lấy bản sau`); goi.set(id, c) }
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await db.connect()
let ma = 0
try {
  await db.query('begin')
  const { rows } = await db.query(`select d.id, d.mo_ta, d.ly_thuyet, d.vi_du from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = '5T' and cd.nhanh = 'toan'`)
  const hien = new Map(rows.map((r) => [r.id, r]))
  const dem = { ghi: 0, hong: 0, khong_co: 0, la: 0 }; const hong = []
  for (const [id, c] of goi) {
    const h = hien.get(id)
    if (!h) { dem.la++; console.log(`✘ ${id}: không phải dạng 5T`); continue }
    const loi = kiem(c)
    if (loi.length) { dem.hong++; hong.push(id); console.log(`✘ ${id}: ${loi.join(' · ')}`); continue }
    const moi = id >= 'NDB02900'
    const sets = [], val = [id]
    const them = (col, v, chiTrong) => { if (chiTrong && h[col]?.trim()) return; val.push(v); sets.push(`${col} = $${val.length}`) }
    them('mo_ta', c.mo_ta, !moi); them('ly_thuyet', c.ly_thuyet, !DE); them('vi_du', c.vi_du, !DE)   // --ghi-de: SỬA lại lý thuyết + ví dụ đã ghi (mô tả của người vẫn không đụng)
    if (sets.length) { await db.query(`update dai_bdm_dang_bai set ${sets.join(', ')} where id = $1`, val); dem.ghi++ }
  }
  for (const id of hien.keys()) if (!goi.has(id)) dem.khong_co++
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', JSON.stringify(dem), '· dạng 5T chưa có trong tệp:', dem.khong_co)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { ma = 1; await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message) } finally { await db.end() }
process.exit(ma)
