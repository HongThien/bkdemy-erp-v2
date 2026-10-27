// Thử mig 202610271607 (lọc nguồn tài liệu) trong ROLLBACK, đóng vai một tài khoản duyệt (quyền đọc hàng theo jwt_uid).
//   node scripts/_test_kho_loc_nguon.mjs [--da-ap] [khoi=10]
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const khoi = process.argv.find((a) => /^\d+T?$/.test(a)) || '10'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  if (!process.argv.includes('--da-ap')) await c.query(fs.readFileSync('supabase/migrations/202610271607_kho_loc_nguon_tai_lieu.sql', 'utf8'))
  const tk = (await c.query(`select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where ns.email ilike 'admin%' or tk.nhan_su_id = (select nguoi from kho_de_sau order by at desc limit 1) limit 1`)).rows[0]?.id
  await c.query(`select set_config('request.jwt.claims', $1, true), set_config('request.jwt.claim.sub', $2, true)`, [JSON.stringify({ sub: tk, role: 'authenticated' }), tk])
  const t0 = Date.now()
  const all = (await c.query(`select n, count(*) from (select unnest(_kho_nguon_cau(ma_cau)) n from dai_cau_hoi where xoa_at is null
     union all select unnest(_kho_nguon_cau(ma_cau)) from hgt_cau_hoi where xoa_at is null) x group by 1 order by 2 desc`)).rows
  console.log(`toàn kho Đại+HGT (${Date.now() - t0} ms):`); console.table(all)
  for (const hang of ['de_xuat', 'thieu', 'trong']) {
    let t = Date.now()
    const ds = (await c.query(`select * from fn_bdm_khop_nguon_ds($1, $2, null)`, [khoi, hang])).rows
    const ms1 = Date.now() - t; t = Date.now()
    const tat = (await c.query(`select fn_bdm_khop_hang($1, $2, 20, 0, null, null) j`, [khoi, hang])).rows[0].j.tong
    const loc = ds[0] ? (await c.query(`select fn_bdm_khop_hang($1, $2, 20, 0, null, $3) j`, [khoi, hang, ds[0].nguon])).rows[0].j : null
    const ms2 = Date.now() - t
    console.log(`K${khoi} ${hang}: tổng ${tat} · nguồn ${JSON.stringify(ds.map((x) => x.nguon + ':' + x.so_cau))} (${ms1} ms) · lọc ${ds[0]?.nguon} → ${loc?.tong} câu, trang đầu ${loc?.rows.length} (${ms2} ms)`)
  }
  const dem = (await c.query(`select fn_bdm_khop_dem($1, null, null) a, fn_bdm_khop_dem($1, null, 'de_thi') b`, [khoi])).rows[0]
  console.log('đếm tất cả', dem.a, '\nđếm đề thi', dem.b)
  const mau = (await c.query(`select ma_cau, nguon from fn_kho_nguon_cau_ds(array(select ma_cau from dai_cau_hoi where xoa_at is null and nguon_loai = 'tai_lieu' order by md5(ma_cau) limit 6))`)).rows
  console.log(mau)
} finally { await c.query('rollback'); await c.end() }
