// ghi-so-nguyen-noidung.mjs — điền LÝ THUYẾT nhóm + LÝ THUYẾT/VÍ DỤ dạng cho chủ đề SỐ NGUYÊN (K6) từ so-nguyen-nd/cd-*.json (agent soạn).
//   node kho-rules/dai/lo/k6/ban-do-moi/ghi-so-nguyen-noidung.mjs [--ghi]   (mặc định kiểm + ROLLBACK)
// Kiểm: tên khớp cây · số nhóm/dạng đủ · KaTeX render · không \cdot/\times · không |x| · chạy mảng `kiem` (JS) phải true · chỉ ghi ô RỖNG (điều kiện trong CÙNG câu UPDATE).
import pg from 'pg'
import { createRequire } from 'node:module'
import { readFileSync, existsSync } from 'node:fs'
process.loadEnvFile('.env')
const D = 'kho-rules/dai/lo/k6/ban-do-moi/'
const require = createRequire(new URL('../../../../../package.json', import.meta.url))
const katex = require('katex')
const cay = JSON.parse(readFileSync(D + 'de-xuat-so-nguyen.json', 'utf8')).cd
const ma = JSON.parse(readFileSync(D + 'so-nguyen-ma.json', 'utf8'))
const loi = []
const rd = (f) => (existsSync(D + 'so-nguyen-nd/' + f) ? JSON.parse(readFileSync(D + 'so-nguyen-nd/' + f, 'utf8')) : null)
// gom: cd index → danh sách nhóm theo thứ tự cây
const nhomOut = cay.map((c) => new Array(c.nhom.length).fill(null))
for (const f of ['cd-1.json', 'cd-2a.json', 'cd-2b.json', 'cd-3.json', 'cd-4.json', 'cd-5.json']) {
  const j = rd(f)
  if (!j) { loi.push(`thiếu file ${f}`); continue }
  const i = j.cd - 1
  // nhóm trong file khớp theo TÊN (an toàn khi tách 2a/2b)
  for (const nh of j.nhom) {
    const k = cay[i].nhom.findIndex((x) => x.ten === nh.ten)
    if (k < 0) { loi.push(`${f}: nhóm lạ «${nh.ten}»`); continue }
    nhomOut[i][k] = nh
  }
}
const ghi = [] // {nhomId, ltNhom, dang:[{id,lt,vd}]}
cay.forEach((c, i) => c.nhom.forEach((nh, k) => {
  const o = nhomOut[i][k]
  if (!o) { loi.push(`thiếu nhóm «${nh.ten}»`); return }
  const mn = ma.cd[i].nhom[k]
  if (!o.ly_thuyet?.trim()) loi.push(`nhóm «${nh.ten}» thiếu LT`)
  const dg = []
  nh.dang.forEach((d, h) => {
    const x = o.dang?.[h]
    if (!x || x.ten !== d[0]) { loi.push(`nhóm «${nh.ten}» dạng ${h + 1} lệch tên (${x?.ten} ≠ ${d[0]})`); return }
    if (!x.ly_thuyet?.trim() || !x.vi_du?.trim()) loi.push(`dạng «${d[0]}» thiếu LT/VD`)
    if (!/^##VD/m.test(x.vi_du || '')) loi.push(`dạng «${d[0]}» VD thiếu ##VD`)
    if (!(x.kiem?.length)) loi.push(`dạng «${d[0]}» thiếu kiem`)
    const nVD = (x.vi_du.match(/^##VD/gm) || []).length
    if (x.kiem && x.kiem.length < nVD) loi.push(`dạng «${d[0]}»: ${nVD} ví dụ nhưng ${x.kiem.length} kiem`)
    dg.push({ id: mn.dang[h], ten: d[0], lt: x.ly_thuyet, vd: x.vi_du, kiem: x.kiem || [] })
  })
  if ((o.dang?.length || 0) !== nh.dang.length) loi.push(`nhóm «${nh.ten}»: ${o.dang?.length} dạng ≠ ${nh.dang.length}`)
  ghi.push({ id: mn.id, ten: nh.ten, lt: o.ly_thuyet, dang: dg })
}))
const soat = (grp, s) => {
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${grp}: số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${grp}: KaTeX «${m[1].slice(0, 40)}» ${e.message.slice(0, 60)}`) }
    if (/\\cdot|\\times/.test(m[1])) loi.push(`${grp}: cấm \\cdot/\\times`)
    if (/\|[^|$]+\||\\mid\s*[^\\]*\\mid/.test(m[1]) && /\\left\||\\lvert|\\vert/.test(m[1])) loi.push(`${grp}: có giá trị tuyệt đối?`)
  }
  if (/chuyển vế/i.test(s)) loi.push(`${grp}: «chuyển vế»`)
  if (/giá trị tuyệt đối/i.test(s)) loi.push(`${grp}: «giá trị tuyệt đối»`)
}
let nVD = 0, nKiem = 0
for (const g of ghi) {
  soat('nhóm ' + g.ten, g.lt)
  for (const d of g.dang) {
    soat('dạng ' + d.ten + ' LT', d.lt); soat('dạng ' + d.ten + ' VD', d.vd)
    nVD += (d.vd.match(/^##VD/gm) || []).length
    for (const e of d.kiem) { nKiem++; let r; try { r = (0, eval)(e) } catch (err) { r = 'lỗi ' + err.message } if (r !== true) loi.push(`kiem ✘ «${d.ten}»: ${e.slice(0, 80)} → ${r}`) }
  }
}
if (loi.length) { console.error('✘\n  ' + loi.join('\n  ')); process.exit(3) }
console.log(`✔ kiểm: ${ghi.length} nhóm · ${ghi.reduce((a, g) => a + g.dang.length, 0)} dạng · ${nVD} ví dụ · ${nKiem} phép kiểm số`)

const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  let dn = 0, dd = 0
  for (const g of ghi) {
    dn += (await c.query(`update dai_bdm_nhom set ly_thuyet=$2, updated_at=now() where id=$1 and coalesce(btrim(ly_thuyet),'')=''`, [g.id, g.lt])).rowCount
    for (const d of g.dang) dd += (await c.query(`update dai_bdm_dang_bai set ly_thuyet=$2, vi_du=$3, updated_at=now() where id=$1 and coalesce(btrim(ly_thuyet),'')='' and coalesce(btrim(vi_du),'')=''`, [d.id, d.lt, d.vd])).rowCount
  }
  console.log(`điền được: ${dn}/${ghi.length} nhóm · ${dd}/${ghi.reduce((a, g) => a + g.dang.length, 0)} dạng`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
