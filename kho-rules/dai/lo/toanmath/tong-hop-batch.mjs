// tong-hop-batch.mjs — KHÔNG đọc DB. Đếm số liệu báo cáo của 1 batch từ tệp soạn/soát (batch/<ma>/<MA>.soan.md, .soat.md, .soan.goc.md).
//   node kho-rules/dai/lo/toanmath/tong-hop-batch.mjs B001
// In bảng từng đề + tổng; ghi batch/<ma>/tong-hop.json.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
const MA = process.argv[2]
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const D = path.join(HERE, 'batch', MA)
const ds = JSON.parse(readFileSync(path.join(D, 'ds-de.json'), 'utf8'))
const rows = []
for (const d of ds) {
  const f = (x) => path.join(D, `${d.ma}.${x}`)
  const r = { ma: d.ma, don_vi: d.don_vi + (d.tach ? ` (${d.tach})` : ''), co_hd: !!d.hd, soan: existsSync(f('soan.md')), soat: null, sua: existsSync(f('soan.goc.md')) }
  if (r.soan) {
    const s = readFileSync(f('soan.md'), 'utf8')
    const cau = [...s.matchAll(/^### (.+?) \| kho=(\w+) \| loai=(\w+) \| dap_an=(.*)$/gm)]
    r.cau = cau.length
    r.loai = {}; for (const c of cau) r.loai[c[3]] = (r.loai[c[3]] || 0) + 1
    r.hinh = cau.filter((c) => c[2] === 'hinh_hoc').length
    r.chua_chac = [...s.matchAll(/^### (.+?) \|[\s\S]*?(?=^### |\Z)/gm)].filter((m) => /\*\*Chưa chắc:\*\*/.test(m[0])).map((m) => m[1].trim())
  }
  if (existsSync(f('soat.md'))) { const t = readFileSync(f('soat.md'), 'utf8'); r.soat = /KẾT LUẬN:\s*ĐẠT/.test(t) ? 'ĐẠT' : /KẾT LUẬN/.test(t) ? 'KHÔNG ĐẠT' : '?' }
  rows.push(r)
}
const T = { de: rows.length, soan: rows.filter((r) => r.soan).length, soat: rows.filter((r) => r.soat).length, dat: rows.filter((r) => r.soat === 'ĐẠT').length,
  sua: rows.filter((r) => r.soat && r.sua).length, cau: rows.reduce((a, r) => a + (r.cau || 0), 0), hinh: rows.reduce((a, r) => a + (r.hinh || 0), 0),
  co_hd: rows.filter((r) => r.co_hd).length, chua_chac: rows.flatMap((r) => (r.chua_chac || []).map((c) => `${r.ma} ${c}`)), loai: {} }
for (const r of rows) for (const [k, v] of Object.entries(r.loai || {})) T.loai[k] = (T.loai[k] || 0) + v
writeFileSync(path.join(D, 'tong-hop.json'), JSON.stringify({ tong: T, de: rows }, null, 1))
for (const r of rows) console.log(r.ma, String(r.cau ?? '-').padStart(3), 'câu', r.soat ?? (r.soan ? 'chờ soát' : 'chờ soạn'), r.sua ? '(soát có sửa)' : '', (r.chua_chac || []).length ? 'CC: ' + r.chua_chac.join('; ') : '', '|', r.don_vi)
console.log('TỔNG', JSON.stringify({ ...T, chua_chac: T.chua_chac.length }))
