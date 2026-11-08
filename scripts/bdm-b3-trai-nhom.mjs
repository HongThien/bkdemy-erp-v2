// Cặp với bdm-b3-xuat-ds.mjs: TRẢI kết quả của bản sao ĐẠI DIỆN (nhóm bản sao có câu gốc đã xoá) ra mọi bản sao cùng nhóm,
// vì gốc đã xoá thì bản sao không đi theo gốc được — mỗi bản sao cần dòng riêng ở hàng đề xuất / thiếu dạng. CHỈ ĐỌC DB.
//   node scripts/bdm-b3-trai-nhom.mjs <thư mục lô>    ⇒ ghi lại <thư mục>/ket_qua.json (bản trước khi trải: ket_qua.truoc-trai.json)
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
process.loadEnvFile('.env')
const D = process.argv[2]
if (!D) { console.error('Dùng: node scripts/bdm-b3-trai-nhom.mjs <thư mục lô>'); process.exit(2) }
const kq = JSON.parse(fs.readFileSync(path.join(D, 'ket_qua.json'), 'utf8'))
const nhom = JSON.parse(fs.readFileSync(path.join(D, 'nhom.json'), 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL })
await c.connect()
const tatCa = Object.values(nhom).flat()
const goXoa = new Set((await c.query(`select q.ma_cau from dai_cau_hoi q join dai_cau_hoi p on p.ma_cau = q.parent_ma_cau
  where q.ma_cau = any($1) and p.xoa_at is not null and q.xoa_at is null`, [tatCa])).rows.map((r) => r.ma_cau))
await c.end()
const co = new Set(kq.map((r) => r.ma_cau))
const them = []
for (const r of kq) for (const m of nhom[r.ma_cau] ?? []) {
  if (m === r.ma_cau || co.has(m) || !goXoa.has(m)) continue
  them.push({ ...r, ma_cau: m, ly_do: `${r.ly_do ?? ''} (cùng gốc đã xoá với ${r.ma_cau})`.trim() }); co.add(m)
}
fs.copyFileSync(path.join(D, 'ket_qua.json'), path.join(D, 'ket_qua.truoc-trai.json'))
fs.writeFileSync(path.join(D, 'ket_qua.json'), JSON.stringify([...kq, ...them], null, 1))
console.log(`${D}: ${kq.length} + trải ${them.length} bản sao (gốc đã xoá) = ${kq.length + them.length}`)
