// kiem-goi.mjs — CỔNG kiểm kết quả trạm soạn LÝ THUYẾT + VÍ DỤ bản đồ mới K6.
//   node kho-rules/dai/lo/k6/ban-do-moi/kiem-goi.mjs <goi-N.json> <out-N.json>
// Kiểm: khoá thuộc đúng gói · mỗi dạng ≥1 ##VD có "Hướng dẫn giải" · nhóm cần LT có ≥1 tag · KaTeX · dấu nhân chấm · chữ Việt trong công thức ·
// không "chuyển vế" · ##VD không nằm trong lý thuyết nhóm CÓ dạng bài · tag lạ.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../../../../..')
const katex = createRequire(join(REPO, 'package.json'))('katex')
const [fGoi, fOut] = process.argv.slice(2)
if (!fGoi || !fOut) { console.error('Dùng: node …/kiem-goi.mjs <goi.json> <out.json>'); process.exit(2) }
const goi = JSON.parse(readFileSync(fGoi, 'utf8'))
const out = JSON.parse(readFileSync(fOut, 'utf8'))
const loi = [], nhac = []
const dangs = Object.fromEntries(goi.nhom.flatMap((n) => n.dang.map((d) => [d.id, { ...d, nhom: n }])))
const nhoms = Object.fromEntries(goi.nhom.map((n) => [n.id, n]))
const TAGS = /^##(ĐN|DN|ĐL|DL|TC|CY|PP|VD|NX|BT)\b/i

function kiemCongThuc(ma, s) {
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${ma}: số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${ma}: KaTeX hỏng «${m[1].slice(0, 60)}» — ${e.message.slice(0, 70)}`) }
    if (/\\cdot|\\times/.test(m[1])) loi.push(`${ma}: dấu nhân phải là dấu chấm (k6.md §3) — «${m[1].slice(0, 50)}»`)
    if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${ma}: chữ Việt ngoài \\text{} trong công thức «${m[1].slice(0, 50)}»`)
  }
  if (/chuyển vế|đổi dấu/i.test(s)) loi.push(`${ma}: dùng "chuyển vế / đổi dấu" (k6.md §1 luật 4)`)
}

for (const [ma, vd] of Object.entries(out.vi_du ?? {})) {
  const d = dangs[ma]
  if (!d) { loi.push(`vi_du.${ma}: không thuộc gói`); continue }
  const s = String(vd)
  const nVD = (s.match(/^##VD\b/gm) || []).length
  const nGiai = (s.match(/\*\*Hướng dẫn giải:\*\*/g) || []).length
  if (nVD < 1) loi.push(`${ma} ${d.ten}: chưa có khối ##VD`)
  if (nGiai < nVD) loi.push(`${ma} ${d.ten}: ${nVD} ví dụ nhưng chỉ ${nGiai} "**Hướng dẫn giải:**"`)
  if (nVD > 4) nhac.push(`${ma}: ${nVD} ví dụ (nhiều)`)
  for (const dong of s.split('\n')) if (/^##/.test(dong) && !TAGS.test(dong)) loi.push(`${ma}: tag lạ «${dong.slice(0, 30)}»`)
  kiemCongThuc(`${ma} ${d.ten}`, s)
}
if (!(Object.keys(out.ly_thuyet_dang ?? {}).length && !Object.keys(out.vi_du ?? {}).length)) // đợt "lý thuyết dạng" không viết ví dụ
  for (const d of Object.values(dangs)) if (!(out.vi_du ?? {})[d.id] && !(d.vi_du_hien_co || '').trim()) loi.push(`${d.id} ${d.ten}: THIẾU ví dụ`)

for (const [ma, lt] of Object.entries(out.ly_thuyet ?? {})) {
  const n = nhoms[ma]
  if (!n) { loi.push(`ly_thuyet.${ma}: không thuộc gói`); continue }
  if (!n.can_ly_thuyet) loi.push(`${ma}: nhóm ĐÃ có lý thuyết — không ghi đè`)
  const s = String(lt)
  if (!TAGS.test(s.trim()) && !/^##/m.test(s)) loi.push(`${ma} ${n.ten}: lý thuyết chưa có tag ##…`)
  if (/^##VD\b/m.test(s) && !n.khong_co_dang) loi.push(`${ma} ${n.ten}: nhóm CÓ dạng bài thì ví dụ nằm ở dạng, không đặt ##VD trong lý thuyết`)
  for (const dong of s.split('\n')) if (/^##/.test(dong) && !TAGS.test(dong)) loi.push(`${ma}: tag lạ «${dong.slice(0, 30)}»`)
  kiemCongThuc(`${ma} ${n.ten}`, s)
}
for (const n of goi.nhom) if (n.can_ly_thuyet && !(out.ly_thuyet ?? {})[n.id]) loi.push(`${n.id} ${n.ten}: THIẾU lý thuyết`)
for (const n of goi.nhom) if (n.khong_co_dang && n.can_ly_thuyet && !/^##VD\b/m.test((out.ly_thuyet ?? {})[n.id] ?? '')) loi.push(`${n.id} ${n.ten}: nhóm KHÔNG có dạng bài — lý thuyết phải kèm ≥1 ##VD`)

// lý thuyết CẤP DẠNG BÀI (Thùy 14/10: "sao các dạng lớp 6 m ko điền lý thuyết") — khoá out.ly_thuyet_dang
for (const [ma, lt] of Object.entries(out.ly_thuyet_dang ?? {})) {
  const d = dangs[ma]
  if (!d) { loi.push(`ly_thuyet_dang.${ma}: không thuộc gói`); continue }
  if ((d.ly_thuyet_dang_hien_co || '').trim()) loi.push(`${ma} ${d.ten}: dạng ĐÃ có lý thuyết — không ghi đè`)
  const s = String(lt)
  const nTag = (s.match(/^##(ĐN|DN|ĐL|DL|TC|CY|PP|NX)\b/gim) || []).length
  if (nTag < 1) loi.push(`${ma} ${d.ten}: lý thuyết dạng chưa có tag ##…`)
  if (/^##VD\b/m.test(s)) loi.push(`${ma} ${d.ten}: ví dụ nằm ở trường vi_du, không đặt ##VD trong lý thuyết dạng`)
  if (s.trim().length < 80) loi.push(`${ma} ${d.ten}: lý thuyết quá ngắn`)
  for (const dong of s.split('\n')) if (/^##/.test(dong) && !TAGS.test(dong)) loi.push(`${ma}: tag lạ «${dong.slice(0, 30)}»`)
  kiemCongThuc(`${ma} ${d.ten}`, s)
}
if (fOut.includes('out-ld') || Object.keys(out.ly_thuyet_dang ?? {}).length) {
  for (const d of Object.values(dangs)) if (!(d.ly_thuyet_dang_hien_co || '').trim() && !(out.ly_thuyet_dang ?? {})[d.id]) loi.push(`${d.id} ${d.ten}: THIẾU lý thuyết dạng`)
}

const nVi = Object.keys(out.vi_du ?? {}).length, nLt = Object.keys(out.ly_thuyet ?? {}).length, nLd = Object.keys(out.ly_thuyet_dang ?? {}).length
console.log(`${fOut}: ví dụ ${nVi} dạng · lý thuyết ${nLt} nhóm · lý thuyết dạng ${nLd} · ghi chú ${(out.ghi_chu ?? []).length}`)
for (const x of nhac) console.log('  ⚠', x)
if (loi.length) { console.error(`❌ ${loi.length} lỗi:\n  ` + loi.join('\n  ')); process.exit(1) }
console.log('✔ đạt cổng')
