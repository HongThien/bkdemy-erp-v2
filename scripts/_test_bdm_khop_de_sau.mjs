// Thử mig 202610221621 (fn_bdm_khop_hang xếp câu "Để sau" xuống cuối) trong ROLLBACK, đóng vai người đã bấm Để sau.
//   node scripts/_test_bdm_khop_de_sau.mjs [--da-ap]   (--da-ap: không nạp lại file migration, đọc hàm đang có trong DB)
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  if (!process.argv.includes('--da-ap')) await c.query(fs.readFileSync('supabase/migrations/202610221621_bdm_khop_hang_de_sau_xuong_cuoi.sql', 'utf8'))
  const ds = (await c.query(`select d.ma, d.at, d.nguoi from kho_de_sau d where d.doi_tuong = 'bdm_khop' order by d.at desc`)).rows
  console.log('câu đã để sau:', ds.length)
  // nguoi = nhan_su id (default current_nhan_su_id()) ⇒ đổi ra tài khoản (quyền đọc hàng theo jwt_uid = tai_khoan.id)
  const uid = (await c.query(`select id from tai_khoan where nhan_su_id = $1 limit 1`, [ds[0]?.nguoi])).rows[0]?.id
  console.log('đóng vai tài khoản', uid)
  await c.query(`select set_config('request.jwt.claims', $1, true), set_config('request.jwt.claim.sub', $2, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' }), uid])
  // khối + hàng của các câu để sau
  const cau = (await c.query(`select q.ma_cau, b.khoi from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh where q.ma_cau = any($1)`, [ds.map((x) => x.ma)])).rows
  const khoi = [...new Set(cau.map((x) => x.khoi))]
  console.log('khối có câu để sau:', khoi.join(', '))
  const daSau = new Set(ds.map((x) => x.ma))
  for (const k of khoi) for (const h of ['de_xuat', 'trong', 'thieu', 'mau']) {
    const r = (await c.query(`select fn_bdm_khop_hang($1, $2, 100, 0, null) j`, [k, h])).rows[0].j
    if (!r.tong) continue
    const ma = r.rows.map((x) => x.ma_cau)
    const vt = ma.map((m, i) => (daSau.has(m) ? i : -1)).filter((i) => i >= 0)
    const p20 = (await c.query(`select fn_bdm_khop_hang($1, $2, 20, 0, null) j`, [k, h])).rows[0].j.rows.filter((x) => daSau.has(x.ma_cau)).length
    console.log(`K${k} ${h}: tổng ${r.tong} · trang 100 đầu: câu để sau ở vị trí ${JSON.stringify(vt)} · trong 20 câu đầu: ${p20}`)
  }
} finally { await c.query('rollback'); await c.end() }
