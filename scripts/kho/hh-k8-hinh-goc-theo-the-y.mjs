// Hình–Học K8 · danh sách kho (DangHub) liệt kê cả câu GỐC của chuỗi đã tách ý; câu gốc anh_de trống (hình nằm ở thẻ ý / anh_dap_an) ⇒ thẻ trong kho không hiện hình.
// Việc làm: câu gốc K8 có thẻ ý mà anh_de trống ⇒ anh_de := hinh_hoc_bai_y.anh_de của thẻ (đã gán ở hh-k8-cuoi-ki-hinh-vao-de / hh-k8-hinh-giai-vao-de); thẻ chưa có thì dùng anh_dap_an của chính câu gốc.
//   node scripts/kho/hh-k8-hinh-goc-theo-the-y.mjs          ⇒ chạy thử ROLLBACK
//   node scripts/kho/hh-k8-hinh-goc-theo-the-y.mjs --ghi    ⇒ commit (bản lùi: _luu-tru/du-lieu/hh-k8-hinh-goc-theo-the-y-23-11.json)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const dem = () => q(`select count(*) n, count(*) filter (where c.anh_de is null) thieu, count(*) filter (where c.anh_de is null and coalesce(y.anh_de, c.anh_dap_an) is null) khong_co_gi from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh join hinh_hoc_bai_y y on y.ma_cau_goc = c.ma_cau and y.xoa_at is null where c.xoa_at is null and b.khoi = '8' and c.bai_y is null`).then((r) => r[0])
await c.query('begin')
try {
  console.log('trước (câu gốc K8 có thẻ ý):', await dem())
  const ds = await q(`select c.ma_cau, coalesce(y.anh_de, c.anh_dap_an) anh from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh join hinh_hoc_bai_y y on y.ma_cau_goc = c.ma_cau and y.xoa_at is null where c.xoa_at is null and b.khoi = '8' and c.bai_y is null and c.anh_de is null and coalesce(y.anh_de, c.anh_dap_an) is not null`)
  for (const r of ds) await q(`update hinh_hoc_cau_hoi set anh_de = $2 where ma_cau = $1 and anh_de is null`, [r.ma_cau, r.anh])
  console.log('gán hình cho câu gốc:', ds.length)
  const sau = await dem(); console.log('sau:', sau)
  if (+sau.thieu !== +sau.khong_co_gi) throw new Error('còn câu gốc có hình để gán mà chưa gán')
  if (GHI) { fs.writeFileSync('_luu-tru/du-lieu/hh-k8-hinh-goc-theo-the-y-23-11.json', JSON.stringify(ds.map((r) => ({ ma_cau: r.ma_cau, anh_de_cu: null, anh_de_moi: r.anh })))); await c.query('commit'); console.log('ĐÃ GHI (commit)') }
  else { await c.query('rollback'); console.log('(chạy thử — ROLLBACK)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
