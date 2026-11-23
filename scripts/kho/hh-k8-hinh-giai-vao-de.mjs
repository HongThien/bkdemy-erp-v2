// Hình–Học KHỐI 8 (mọi bài) · hình vẽ chỉ nằm ở anh_dap_an (ảnh dưới lời giải), anh_de trống ⇒ kho không hiện hình ở đề (Thùy 23/11: "vẫn còn 1 đống bài chưa có hình").
//   Quy ước: chuỗi (thẻ ý) → hinh_hoc_bai_y.anh_de := anh_dap_an của câu gốc (trigger ép xuống mọi ý) · câu thường (không bai_y, không thẻ ý) → anh_de := anh_dap_an.
//   Chỉ điền chỗ anh_de đang trống; không đụng anh_dap_an; không đụng K7 / K9 / các khối khác. Chỗ nào không có hình ở đâu cả thì để trống (không có gì để điền).
//   node scripts/kho/hh-k8-hinh-giai-vao-de.mjs          ⇒ chạy thử ROLLBACK
//   node scripts/kho/hh-k8-hinh-giai-vao-de.mjs --ghi    ⇒ commit (bản lùi: _luu-tru/du-lieu/hh-k8-hinh-giai-vao-de-23-11.json)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const dem = () => q(`select count(*) n, count(*) filter (where c.anh_de is null) thieu, count(*) filter (where c.anh_de is null and c.anh_dap_an is null) khong_co_gi from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh where c.xoa_at is null and b.khoi = '8' and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)`).then((r) => r[0])
await c.query('begin')
try {
  console.log('trước (đơn vị hiển thị K8):', await dem())
  const the = await q(`select y.ma_bai_y, y.ma_cau_goc, g.anh_dap_an from hinh_hoc_bai_y y join hinh_hoc_bai b on b.ma_bai = y.dang_chinh join hinh_hoc_cau_hoi g on g.ma_cau = y.ma_cau_goc where y.xoa_at is null and b.khoi = '8' and y.anh_de is null and g.anh_dap_an is not null`)
  for (const t of the) await q(`update hinh_hoc_bai_y set anh_de = $2 where ma_bai_y = $1 and anh_de is null`, [t.ma_bai_y, t.anh_dap_an])
  console.log('thẻ ý gán hình:', the.length)
  const le = await q(`select c.ma_cau, c.anh_dap_an from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh where c.xoa_at is null and b.khoi = '8' and c.bai_y is null and c.anh_de is null and c.anh_dap_an is not null and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc = c.ma_cau and yg.xoa_at is null)`)
  for (const r of le) await q(`update hinh_hoc_cau_hoi set anh_de = $2 where ma_cau = $1 and anh_de is null`, [r.ma_cau, r.anh_dap_an])
  console.log('câu thường gán hình:', le.length)
  const sau = await dem(); console.log('sau:', sau)
  console.log('theo bài còn thiếu:', await q(`select b.ma_bai, left(b.ten_bai,34) ten, count(*) filter (where c.anh_de is null) thieu, count(*) n from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai=c.dang_chinh where c.xoa_at is null and b.khoi='8' and not exists (select 1 from hinh_hoc_bai_y yg where yg.ma_cau_goc=c.ma_cau and yg.xoa_at is null) group by 1,2 having count(*) filter (where c.anh_de is null)>0 order by 3 desc limit 8`))
  if (GHI) { fs.writeFileSync('_luu-tru/du-lieu/hh-k8-hinh-giai-vao-de-23-11.json', JSON.stringify({ the: the.map((t) => ({ ma_bai_y: t.ma_bai_y, anh_de_moi: t.anh_dap_an })), cau: le.map((r) => ({ ma_cau: r.ma_cau, anh_de_moi: r.anh_dap_an })) })); await c.query('commit'); console.log('ĐÃ GHI (commit)') }
  else { await c.query('rollback'); console.log('(chạy thử — ROLLBACK)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
