// Hình–Học K8 · 136 câu cuối kì 1: hình vẽ nằm ở anh_dap_an (ảnh dưới lời giải), anh_de gần như trống ⇒ kho chuyên đề không hiện hình ở đề.
// Quy ước các bài Hình khác (K7/K9): hình chung của chuỗi = hinh_hoc_bai_y.anh_de (trigger _trg_hh_y_ghep ép anh_de của mọi ý theo thẻ).
// Việc làm: thẻ ý nào chưa có anh_de mà câu gốc có anh_dap_an ⇒ anh_de := anh_dap_an của câu gốc (giữ nguyên anh_dap_an). Thẻ đã có anh_de: không đụng.
//   node scripts/kho/hh-k8-cuoi-ki-hinh-vao-de.mjs          ⇒ chạy thử ROLLBACK
//   node scripts/kho/hh-k8-cuoi-ki-hinh-vao-de.mjs --ghi    ⇒ commit (bản lùi: _luu-tru/du-lieu/hh-k8-cuoi-ki-hinh-vao-de-23-11.json)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const ds = [...new Set([...JSON.parse(fs.readFileSync('_luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json', 'utf8')).map((x) => x.ma_cau), 'HHC015574'])]
await c.query('begin')
try {
  const the = await q(`select y.ma_bai_y, y.ma_cau_goc, y.anh_de, g.anh_dap_an from hinh_hoc_bai_y y join hinh_hoc_cau_hoi g on g.ma_cau = y.ma_cau_goc where y.xoa_at is null and y.ma_cau_goc = any($1)`, [ds])
  const can = the.filter((t) => !t.anh_de && t.anh_dap_an)
  const co = the.filter((t) => t.anh_de).length
  const khong = the.filter((t) => !t.anh_de && !t.anh_dap_an)
  console.log(`thẻ ý ${the.length} · đã có hình đề ${co} · sẽ gán từ ảnh giải ${can.length} · không có hình nào ${khong.length}:`, khong.map((t) => t.ma_cau_goc).join(' '))
  for (const t of can) await q(`update hinh_hoc_bai_y set anh_de = $2 where ma_bai_y = $1 and anh_de is null`, [t.ma_bai_y, t.anh_dap_an])
  const sau = await q(`select count(*) filter (where y.anh_de is not null) the_co_hinh, (select count(*) from hinh_hoc_cau_hoi c where c.bai_y = any(select ma_bai_y from hinh_hoc_bai_y where ma_cau_goc = any($1) and xoa_at is null) and c.xoa_at is null and c.anh_de is not null) y_co_hinh, (select count(*) from hinh_hoc_cau_hoi c where c.bai_y = any(select ma_bai_y from hinh_hoc_bai_y where ma_cau_goc = any($1) and xoa_at is null) and c.xoa_at is null) y_tong from hinh_hoc_bai_y y where y.xoa_at is null and y.ma_cau_goc = any($1)`, [ds])
  console.log('đọc lại:', sau[0])
  if (+sau[0].the_co_hinh !== co + can.length) throw new Error('đếm thẻ có hình không khớp')
  if (GHI) { fs.writeFileSync('_luu-tru/du-lieu/hh-k8-cuoi-ki-hinh-vao-de-23-11.json', JSON.stringify(can.map((t) => ({ ma_bai_y: t.ma_bai_y, ma_cau_goc: t.ma_cau_goc, anh_de_cu: null, anh_de_moi: t.anh_dap_an })), null, 1)); await c.query('commit'); console.log('ĐÃ GHI (commit)') }
  else { await c.query('rollback'); console.log('(chạy thử — ROLLBACK)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
