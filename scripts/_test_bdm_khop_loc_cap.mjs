// Thử mig 202611051718 (lọc Duyệt kho bản đồ mới theo cấp chủ đề/chuyên đề/nhóm/dạng bài) trong ROLLBACK, đóng vai admin.
//   node scripts/_test_bdm_khop_loc_cap.mjs [--da-ap] [khoi=8]
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const khoi = process.argv.find((a) => /^\d+T?$/.test(a)) || '8'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  if (!process.argv.includes('--da-ap')) await c.query(fs.readFileSync('supabase/migrations/202611051718_bdm_khop_loc_theo_cap.sql', 'utf8'))
  const tk = (await q(`select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where ns.email ilike 'admin%' limit 1`))[0]?.id
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk, role: 'authenticated' })])
  const t0 = Date.now()
  const tat = (await q(`select fn_bdm_khop_dem($1) d`, [khoi]))[0].d
  console.log(`K${khoi} đếm (không lọc):`, tat, `${Date.now() - t0} ms`)
  for (const cap of ['chu_de', 'chuyen_de', 'nhom', 'dang_bai']) {
    const ds = await q(`select * from fn_bdm_khop_loc_ds($1, 'de_xuat', $2)`, [khoi, cap])
    const tong = ds.reduce((s, x) => s + Number(x.so_cau), 0)
    const dau = ds[0]
    const h = dau ? (await q(`select fn_bdm_khop_hang($1, 'de_xuat', 20, 0, null, null, $2) j`, [khoi, dau.id]))[0].j : null
    const d = dau ? (await q(`select fn_bdm_khop_dem($1, null, null, $2) d`, [khoi, dau.id]))[0].d : null
    console.log(`${cap}: ${ds.length} mục, cộng ${tong} câu (hàng Chưa chắc ${tat.de_xuat}) · mục đầu ${dau?.id} «${dau?.ten}» [${dau?.duong ?? ''}] ${dau?.so_cau} câu → hàng ${h?.tong} · đếm ${d?.de_xuat} · dạng các câu ${[...new Set(h?.rows.map((r) => r.dang_bai_id))].slice(0, 4).join(',')}`)
  }
  console.log('nguồn trong dạng đầu:', await q(`select * from fn_bdm_khop_nguon_ds($1, 'de_xuat', null, (select id from fn_bdm_khop_loc_ds($1, 'de_xuat', 'dang_bai') limit 1))`, [khoi]))
} finally { await c.query('rollback'); await c.end() }
