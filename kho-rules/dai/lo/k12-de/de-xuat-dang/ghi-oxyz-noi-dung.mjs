// ghi-oxyz-noi-dung.mjs — điền mô tả / lý thuyết / ví dụ cho 44 dạng Oxyz (NCD00099) từ oxyz-ra-A..E.json.
//   node kho-rules/dai/lo/k12-de/de-xuat-dang/ghi-oxyz-noi-dung.mjs [--ghi]    (mặc định ROLLBACK)
// CHỈ ĐIỀN Ô TRỐNG: ly_thuyet / vi_du chỉ ghi khi đang rỗng. mo_ta: giữ chữ của Thùy làm câu đầu, nối mô tả mới phía sau
// (mo_ta mới = null ⇒ không đụng). Sao lưu giá trị cũ ra oxyz-sao-luu-truoc-ghi.json.
import fs from 'node:fs'
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const D = 'kho-rules/dai/lo/k12-de/de-xuat-dang/'
const all = []
for (const k of 'ABCDE') all.push(...JSON.parse(fs.readFileSync(D + `oxyz-ra-${k}.json`, 'utf8')))
const co = (s) => (s ?? '').trim() !== ''
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const ids = all.map((x) => x.id)
  const cu = (await c.query(`select d.id, d.ten, d.mo_ta, d.ly_thuyet, d.vi_du, n.chu_de_id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where d.id = any($1)`, [ids])).rows
  if (cu.length !== ids.length) throw new Error(`thiếu dạng: DB ${cu.length}/${ids.length}`)
  if (cu.some((r) => r.chu_de_id !== 'NCD00099')) throw new Error('có dạng không thuộc NCD00099')
  if (GHI) fs.writeFileSync(D + 'oxyz-sao-luu-truoc-ghi.json', JSON.stringify(cu))
  const map = new Map(cu.map((r) => [r.id, r]))
  const dem = { mo_ta: 0, ly_thuyet: 0, vi_du: 0, bo_qua_lt: 0, bo_qua_vd: 0 }
  for (const x of all) {
    const o = map.get(x.id)
    let mo = null
    if (x.mo_ta != null) {
      const cuMo = (o.mo_ta ?? '').trim()
      mo = cuMo ? (cuMo.replace(/[.\s]+$/, '') + '. ' + x.mo_ta.trim()) : x.mo_ta.trim()
      dem.mo_ta++
    }
    const lt = co(o.ly_thuyet) ? null : x.ly_thuyet; if (!lt) dem.bo_qua_lt++; else dem.ly_thuyet++
    const vd = co(o.vi_du) ? null : x.vi_du; if (!vd) dem.bo_qua_vd++; else dem.vi_du++
    const r = await c.query(`update dai_bdm_dang_bai set mo_ta = coalesce($2, mo_ta), ly_thuyet = coalesce($3, ly_thuyet), vi_du = coalesce($4, vi_du), updated_at = now() where id = $1`, [x.id, mo, lt, vd])
    if (r.rowCount !== 1) throw new Error('update lỗi ' + x.id)
  }
  console.log('đã cập nhật:', JSON.stringify(dem))
  // đọc lại: 51 dạng NCD00099 phải đủ cả ba mục (lý thuyết có thể ở dạng hoặc nhóm)
  const chk = (await c.query(`select d.id, (coalesce(d.mo_ta,'')<>'') mo, (coalesce(d.ly_thuyet,'')<>'' or coalesce(n.ly_thuyet,'')<>'') lt, (coalesce(d.vi_du,'')<>'') vd from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where n.chu_de_id = 'NCD00099'`)).rows
  const thieu = chk.filter((r) => !r.mo || !r.lt || !r.vd)
  console.log(`NCD00099: ${chk.length} dạng · còn thiếu mô tả/lý thuyết/ví dụ: ${thieu.length}`, thieu.map((r) => r.id).join(','))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
