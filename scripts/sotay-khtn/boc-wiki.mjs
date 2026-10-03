// ============================================================================
// boc-wiki.mjs — bóc SỔ TAY KHTN từ bundle "KHTN Pocket" (artifact Thùy đưa 03/10, GV đã duyệt) ra JSON sạch.
// Chỉ chạy các module DỮ LIỆU (wiki-core, wiki-*, data-core, mon) trong vm sandbox rỗng — không chạy code app.
// Chạy: node scripts/sotay-khtn/boc-wiki.mjs <so-tay-*.js> <ra.json>
// ============================================================================
import fs from 'node:fs'
import vm from 'node:vm'

const [, , vao, ra] = process.argv
const s = fs.readFileSync(vao, 'utf8')
const dau = [...s.matchAll(/\/\* ([a-zA-Z0-9_.-]+\.js) \*\//g)].map((m) => ({ ten: m[1], i: m.index }))
const modCua = (ten) => { const k = dau.findIndex((d) => d.ten === ten); if (k < 0) throw new Error('thiếu ' + ten); return s.slice(dau[k].i, k + 1 < dau.length ? dau[k + 1].i : s.length) }

const ctx = vm.createContext({})
const chay = (ten) => vm.runInContext(modCua(ten).replace(/^const (\w+) =/gm, 'var $1 ='), ctx, { timeout: 2000, filename: ten })
chay('wiki-core.js')
for (const d of dau.filter((d) => /^wiki-[a-z0-9]+\.js$/.test(d.ten) && d.ten !== 'wiki-core.js')) chay(d.ten)
// chủ đề: TOPICS (data-core) + TOPICS_SOAN (mon) — chạy thử, lỗi thì bỏ (chỉ cần tên + thứ tự)
const chuDe = {}
for (const ten of ['data-core.js', 'mon.js']) { try { chay(ten) } catch (e) { console.warn('bỏ qua', ten, e.message) } }
for (const k of ['TOPICS', 'TOPICS_SOAN']) {
  const t = ctx[k]
  if (!t) continue
  for (const [id, v] of Object.entries(t)) chuDe[id] = { id, ten: v.ten, mon: v.mon, lop: v.lop, sub: v.sub ?? null }
}
const khung = ctx.KHUNG ?? null
const wiki = vm.runInContext('WIKI', ctx)
const loai = vm.runInContext('WLOAI', ctx)
fs.writeFileSync(ra, JSON.stringify({ loai, chuDe, khung, wiki }, null, 1))
console.log('mục', wiki.length, '· chủ đề', Object.keys(chuDe).length, '· KHUNG', khung ? 'có' : 'không')
