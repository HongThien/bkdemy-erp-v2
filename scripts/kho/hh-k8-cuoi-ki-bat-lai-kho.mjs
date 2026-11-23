// Bật lại vào kho chuẩn 65 câu cuối kì 1 K8 đã dời vào HH00173–176 (Thùy 23/11: "Bật lại 65 câu").
// Chỉ đổi rut_khoi_kho true→false cho đúng danh sách bản lùi, và chỉ khi câu vẫn đang ở bài đã dời tới.
//   node scripts/kho/hh-k8-cuoi-ki-bat-lai-kho.mjs          ⇒ chạy thử ROLLBACK
//   node scripts/kho/hh-k8-cuoi-ki-bat-lai-kho.mjs --ghi    ⇒ commit
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const ds = JSON.parse(fs.readFileSync('_luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json', 'utf8'))
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
await c.query('begin')
try {
  let n = 0
  for (const d of ds) n += (await c.query(`update hinh_hoc_cau_hoi set rut_khoi_kho = false where ma_cau = $1 and dang_chinh = $2 and rut_khoi_kho`, [d.ma_cau, d.den])).rowCount
  console.log(`bật lại: ${n} câu (trong ${ds.length} câu đã dời; câu đã bật từ lượt trước không tính)`)
  const r = (await c.query(`select dang_chinh, count(*) n, count(*) filter (where kho_chuan) chuan from hinh_hoc_cau_hoi where ma_cau = any($1) group by 1 order by 1`, [ds.map((d) => d.ma_cau)])).rows
  console.log(JSON.stringify(r))
  const khong = (await c.query(`select ma_cau, kiem_may, da_duyet from hinh_hoc_cau_hoi where ma_cau = any($1) and not kho_chuan`, [ds.map((d) => d.ma_cau)])).rows
  if (khong.length) console.log('chưa vào kho chuẩn dù không còn rút (máy nghi lỗi, chưa duyệt — giữ nguyên):', JSON.stringify(khong))
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? 'ĐÃ GHI' : '(chạy thử — ROLLBACK)')
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
