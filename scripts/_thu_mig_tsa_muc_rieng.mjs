// Chạy thử mig 202610030228 trong 1 transaction rồi ROLLBACK — không ghi gì. Giả JWT 1 em khối 12 + 1 em khối 9.
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const q = async (s, p = []) => { await c.query('savepoint s'); try { return (await c.query(s, p)).rows } catch (e) { return 'LỖI: ' + e.message } finally { await c.query('rollback to savepoint s') } }
const la = async (ma) => {
  const [{ id }] = (await c.query(`select tk.id from tai_khoan tk join hoc_sinh h on h.id=tk.hoc_sinh_id where h.ma_hs=$1`, [ma])).rows
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: id })])
}
const [{ ma_hs: hs12 }] = (await c.query(`select h.ma_hs from hoc_sinh h join tai_khoan tk on tk.hoc_sinh_id=h.id where h.khoi='12' and h.trang_thai='dang_hoc' order by 1 limit 1`)).rows
await c.query('begin')
try {
  // trước mig — em khối 9 làm mốc
  await la('HS0557')
  const truoc9 = { ds: (await q(`select jsonb_array_length(tu_luyen_chu_de_ds_dang('Toán')) n`))[0], mon: await q('select * from hs_mon_hoc_cua_toi()') }
  await c.query(fs.readFileSync('supabase/migrations/202610030228_tsa_muc_rieng_khoi_12.sql', 'utf8'))
  console.log('lớp neo:', await q(`select l.ten_lop, l.mon, l.khoi, l.trang_thai, m.mon m_mon from mon_mo_ca_khoi m join lop l on l.id=m.lop_id`))

  await la(hs12)
  console.log(`\n== ${hs12} (khối 12)`)
  console.log(' hs_mon_rieng_cua_toi', await q('select * from hs_mon_rieng_cua_toi()'))
  console.log(' hs_mon_hoc_cua_toi  ', await q('select * from hs_mon_hoc_cua_toi()'))
  const ds = await q(`select tu_luyen_chu_de_ds_dang('TSA') x`)
  const dangs = Array.isArray(ds) ? ds[0].x : []
  console.log(' ds dạng TSA:', Array.isArray(ds) ? dangs.length : ds, dangs.slice(0, 2).map((d) => `${d.ma_dang} ${d.ten_dang} (${d.tong_cau} câu)`))
  if (dangs[0]) {
    const s = await q(`select tu_luyen_chu_de_sinh('TSA', $1, 'tu_luyen') x`, [dangs[0].ma_dang])
    console.log(' sinh theo chủ đề:', typeof s === 'string' ? s : s[0].x)
    const s2 = await q(`with b as (select (tu_luyen_chu_de_sinh('TSA', $1, 'tu_luyen')->>'bai_test_id')::uuid id)
      select bt.mon, l.ten_lop, bt.so_cau, (select string_agg(distinct btc.loai_cau, ',') from bai_test_cau btc where btc.bai_test_id = bt.id) loai from b join bai_test bt on bt.id=b.id join lop l on l.id=bt.lop_id`, [dangs[0].ma_dang])
    console.log(' bài sinh ra:', s2)
  }
  console.log(' tổng hợp:', await q(`select fn_tu_luyen_sinh_tu_dong('TSA') x`))

  await la('HS0557')
  console.log('\n== HS0557 (khối 9) — phải y như trước')
  const sau9 = { ds: (await q(`select jsonb_array_length(tu_luyen_chu_de_ds_dang('Toán')) n`))[0], mon: await q('select * from hs_mon_hoc_cua_toi()') }
  console.log(' trước', JSON.stringify(truoc9), '\n sau  ', JSON.stringify(sau9))
  console.log(' hs_mon_rieng_cua_toi', await q('select * from hs_mon_rieng_cua_toi()'))
  console.log(' ds TSA (khối 9 không được):', await q(`select tu_luyen_chu_de_ds_dang('TSA') x`))
  console.log(' sinh Toán:', await q(`select tu_luyen_chu_de_sinh('Toán', (select x->>'ma_dang' from jsonb_array_elements(tu_luyen_chu_de_ds_dang('Toán')) x limit 1), 'tu_luyen')->'tong' t`))
} finally { await c.query('rollback'); await c.end() }
