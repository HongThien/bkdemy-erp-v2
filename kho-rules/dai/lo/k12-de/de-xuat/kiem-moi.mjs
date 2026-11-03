// kiem-moi.mjs — máy kiểm KHUÔN tệp lý thuyết + ví dụ cho cây dạng MỚI (de-xuat/<CH>.json). Dùng lại bộ kiểm của k12-hs/kiem.mjs.
//   node kho-rules/dai/lo/k12-de/de-xuat/kiem-moi.mjs <CH> <tệp ra.txt> [<mã,mã…>]
// Mã khối: nhóm viết `=== N C1.2`, dạng viết `=== C1.2.3` (mã của JSON).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { docTep, kiemKhoi, DANG, NHOM } from '../../k12-hs/kiem.mjs'

const DIR = dirname(fileURLToPath(import.meta.url))
const [ch, tep, dsArg] = process.argv.slice(2)
const j = JSON.parse(readFileSync(join(DIR, ch + '.json'), 'utf8'))
for (const k of Object.keys(DANG)) delete DANG[k]
for (const k of Object.keys(NHOM)) delete NHOM[k]
for (const cd of (j.chuyen_de ?? [])) for (const n of cd.nhom) { NHOM[n.id] = { id: n.id, ten: n.ten, dang: n.dang }; for (const d of n.dang) DANG[d.id] = { ten: d.ten, mo_ta: d.mo_ta, hinh: d.hinh || 'khong', nhom: n.id } }
if (ch === 'NHTP' || ch === 'PPTD') { console.log('chương bổ sung: dùng mã M…'); for (const d of j.them) { DANG[d.id] = { ten: d.ten, mo_ta: d.mo_ta, hinh: d.hinh || 'khong', nhom: d.nhom }; if (!NHOM[d.nhom]) NHOM[d.nhom] = { id: d.nhom } } ; NHOM.MN1 = { id: 'MN1', ten: 'Cực trị trong không gian Oxyz' } }

const khoi = docTep(readFileSync(tep, 'utf8'))
const loi = [], canh = []
const ds = dsArg ? dsArg.split(',') : null
if (ds) for (const id of ds) if (!khoi.some((k) => k.id === id)) loi.push(`${id}: THIẾU khối`)
for (const k of khoi) {
  if (ds && !ds.includes(k.id)) { loi.push(`${k.id}: không thuộc danh sách giao`); continue }
  const r = kiemKhoi(k)
  for (const l of r.loi) loi.push(`${k.id}: ${l}`)
  for (const l of r.canhBao) canh.push(`${k.id}: ${l}`)
}
for (const l of loi) console.log('✖ ' + l)
for (const l of canh) console.log('⚠ ' + l)
const dang = khoi.filter((k) => !k.la_nhom)
console.log(`${tep.split(/[\\/]/).pop()}: ${khoi.filter((k) => k.la_nhom).length} nhóm · ${dang.length} dạng · ví dụ ${dang.reduce((s, k) => s + ((k.vd ?? '').match(/^##VD/gm) || []).length, 0)} · hình ${dang.reduce((s, k) => s + ((k.vd ?? '').match(/\[\[HINH/g) || []).length, 0)} · lỗi ${loi.length} · cảnh báo ${canh.length}`)
process.exit(loi.length ? 1 : 0)
