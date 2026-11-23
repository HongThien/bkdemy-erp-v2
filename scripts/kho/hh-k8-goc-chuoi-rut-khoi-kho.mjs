// Hình–Học K8 · 136 câu GỐC cuối kì 1 đã tách ý nhưng đang `rut_khoi_kho=false` (lượt "bật lại 65 câu" 23/11 bật nhầm câu gốc) ⇒ kho hiện TRÙNG: câu cả bài + các ý.
// Luật bài–ý (mig 202611091550/091902): câu cả bài cũ GIỮ cho tài liệu / điểm cũ nhưng RÚT khỏi kho; các ý (thẻ ý) là bản vào kho. Mọi khối khác đều như vậy (K7 190 · K8 165 · K9 423 câu gốc rút).
//   node scripts/kho/hh-k8-goc-chuoi-rut-khoi-kho.mjs          ⇒ chạy thử ROLLBACK
//   node scripts/kho/hh-k8-goc-chuoi-rut-khoi-kho.mjs --ghi    ⇒ commit (bản lùi: _luu-tru/du-lieu/hh-k8-goc-chuoi-rut-khoi-kho-23-11.json)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  const ds = await q(`select c.ma_cau from hinh_hoc_cau_hoi c where c.xoa_at is null and c.bai_y is null and not c.rut_khoi_kho and exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)`)
  console.log('câu gốc đã tách ý mà đang trong kho:', ds.length)
  const ma = ds.map((r) => r.ma_cau)
  await q(`update hinh_hoc_cau_hoi set rut_khoi_kho = true where ma_cau = any($1)`, [ma])
  const kt = await q(`select count(*) filter (where kho_chuan) con_chuan, count(*) n from hinh_hoc_cau_hoi where ma_cau = any($1)`, [ma]); console.log('gốc sau khi rút:', kt[0])
  const y = await q(`select count(*) n, count(*) filter (where c.kho_chuan) chuan from hinh_hoc_cau_hoi c where c.xoa_at is null and c.bai_y is not null and c.dang_chinh = any($1)`, [['HH00173','HH00174','HH00175','HH00176','HH00183','HH00184','HH00185','HH00186','HH00187','HH00188']]); console.log('ý trong 10 chuyên đề:', y[0])
  if (+kt[0].con_chuan !== 0 || +y[0].n !== +y[0].chuan) throw new Error('đọc lại không đạt')
  if (GHI) { fs.writeFileSync('_luu-tru/du-lieu/hh-k8-goc-chuoi-rut-khoi-kho-23-11.json', JSON.stringify(ma)); await c.query('commit'); console.log('ĐÃ GHI (commit)') }
  else { await c.query('rollback'); console.log('(chạy thử — ROLLBACK)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
