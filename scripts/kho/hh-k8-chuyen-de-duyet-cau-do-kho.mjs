// Hình–Học K8 · 10 bài chuyên đề (HH00173–176, 183–188): (1) đẩy câu lẻ HHC015574 vào HH00176 · (2) duyệt câu trong kho (trừ câu máy nghi lỗi) · (3) ghi độ khó bài học.
// Thùy 23/11: "đẩy bài vào kho đi còn chờ gì nữa. tự duyệt các bài luôn đi" + độ khó theo đề xuất (không có số riêng).
//   node scripts/kho/hh-k8-chuyen-de-duyet-cau-do-kho.mjs [--ghi]
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const DO_KHO = { HH00173: 4, HH00174: 3, HH00175: 5, HH00176: 5, HH00183: 3, HH00184: 4, HH00185: 3, HH00186: 4, HH00187: 3, HH00188: 2 }
const B = Object.keys(DO_KHO)
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  // (1) câu lẻ — "Chứng minh BK=CE" (hai đoạn bằng nhau) ⇒ chuyên đề hệ thức
  const n1 = (await c.query(`update hinh_hoc_cau_hoi set dang_chinh = 'HH00176', rut_khoi_kho = false where ma_cau = 'HHC015574' and dang_chinh = 'HH08000000'`)).rowCount
  console.log('dời HHC015574 → HH00176:', n1)
  // (2) duyệt câu (trừ máy nghi lỗi) — duyet_boi NULL (Claude theo lệnh Thùy), nguồn 'ai'
  const n2 = (await c.query(`update hinh_hoc_cau_hoi set da_duyet = true, duyet_at = now(), duyet_nguon = 'ai' where dang_chinh = any($1) and xoa_at is null and not da_duyet and kiem_may is distinct from 'nghi'`, [B])).rowCount
  console.log('duyệt câu:', n2)
  // (3) độ khó
  for (const [ma, md] of Object.entries(DO_KHO)) await c.query(`update hinh_hoc_bai set muc_do = $2 where ma_bai = $1 and khoi = '8'`, [ma, md])
  const r = await q(`select b.ma_bai, b.muc_do, count(k.*) n, count(*) filter (where k.da_duyet) duyet, count(*) filter (where k.kho_chuan) chuan from hinh_hoc_bai b left join hinh_hoc_cau_hoi k on k.dang_chinh = b.ma_bai and k.xoa_at is null where b.ma_bai = any($1) group by 1, 2 order by 1`, [B])
  console.log(JSON.stringify(r))
  const chuaDuyet = await q(`select ma_cau, kiem_may from hinh_hoc_cau_hoi where dang_chinh = any($1) and xoa_at is null and not da_duyet`, [B])
  console.log('chưa duyệt (máy nghi lỗi):', JSON.stringify(chuaDuyet))
  if (r.reduce((a, x) => a + +x.n, 0) !== 136 || r.some((x) => x.muc_do !== DO_KHO[x.ma_bai])) throw new Error('không khớp')
  if (GHI) {
    const tep = '_luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json'; const cu = JSON.parse(fs.readFileSync(tep, 'utf8'))
    if (n1) cu.push({ ma_cau: 'HHC015574', tu: 'HH08000000', den: 'HH00176', rut_cu: true })
    fs.writeFileSync(tep, JSON.stringify(cu, null, 1))
    await c.query('commit'); console.log('ĐÃ GHI')
  } else { await c.query('rollback'); console.log('(chạy thử — ROLLBACK)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
