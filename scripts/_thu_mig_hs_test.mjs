// Chạy thử mig 202610031034_hoc_sinh_test trong 1 transaction rồi ROLLBACK — không ghi gì.
// So số liệu em THẬT trước/sau (phải y hệt) + giả danh em TEST (tài khoản giả trong transaction) xem app chạy đủ.
import pg from 'pg'
import fs from 'node:fs'
import crypto from 'node:crypto'
process.loadEnvFile('.env')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
const q = async (s, p = []) => { await c.query('savepoint s'); try { return (await c.query(s, p)).rows } catch (e) { return 'LỖI: ' + e.message } finally { await c.query('rollback to savepoint s') } }
const laUid = (uid) => c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid })])
const uidCua = async (ma) => (await c.query(`select tk.id from tai_khoan tk join hoc_sinh h on h.id=tk.hoc_sinh_id where h.ma_hs=$1`, [ma])).rows[0]?.id
const soLieuThat = async () => {
  await laUid(await uidCua('HS0557'))
  return {
    rank_mua_k9: (await q(`select count(*)::int n from fn_rank_mua('Toán', '9')`))[0],
    bxh_tu_luyen_k9: (await q(`select jsonb_array_length(hs_xep_hang_tu_luyen('9', 'Toán')) n`))[0],
    the_gioi_7ngay: (await q(`select count(*)::int n from _the_gioi_tin(now() - interval '7 days')`))[0],
    hs_dang_hoc: (await q(`select count(*)::int n from hoc_sinh where trang_thai = 'dang_hoc'`))[0],
    lop_dang_hoc: (await q(`select count(*)::int n from lop where trang_thai = 'dang_hoc'`))[0],
  }
}
await c.query('begin')
try {
  const truoc = await soLieuThat()
  await c.query(fs.readFileSync('supabase/migrations/202610031034_hoc_sinh_test.sql', 'utf8'))
  const sau = await soLieuThat()
  console.log('EM THẬT trước:', JSON.stringify(truoc))
  console.log('EM THẬT sau  :', JSON.stringify(sau))
  console.log('em test + lớp:', await q(`select h.ma_hs, h.khoi, h.gioi_tinh, string_agg(l.ten_lop, ' | ' order by l.mon) lop from hoc_sinh h join hoc_sinh_lop hl on hl.hoc_sinh_id=h.id join lop l on l.id=hl.lop_id where h.trang_thai='test' group by 1,2,3 order by 1`))

  // giả tài khoản cho 3 em test (chỉ trong transaction)
  for (const ma of ['TEST06', 'TEST10', 'TEST01']) {
    const uid = crypto.randomUUID()
    await c.query(`insert into tai_khoan (id, hoc_sinh_id, email) select $1, id, lower(ma_hs) || '@hs.bkdemy.local' from hoc_sinh where ma_hs = $2`, [uid, ma])
    await laUid(uid)
    console.log(`\n== ${ma}`)
    console.log(' môn:', JSON.stringify(await q('select * from hs_mon_hoc_cua_toi()')), ' ô riêng:', JSON.stringify(await q('select * from hs_mon_rieng_cua_toi()')))
    console.log(' khối/cấp1/cấp2:', JSON.stringify(await q('select hs_khoi_cua_toi() k, hs_cap1_cua_toi() c1, hs_cap2_cua_toi() c2')))
    console.log(' dạng Toán:', (await q(`select jsonb_array_length(tu_luyen_chu_de_ds_dang('Toán')) n`))[0])
    const ma1 = (await q(`select x->>'ma_dang' m from jsonb_array_elements(tu_luyen_chu_de_ds_dang('Toán')) x limit 1`))[0]?.m
    if (ma1) console.log(' sinh bài Toán:', JSON.stringify(await q(`select tu_luyen_chu_de_sinh('Toán', $1, 'tu_luyen')->'tong' t`, [ma1])))
    console.log(' rank:', JSON.stringify(await q(`select fn_hs_rank_cua_toi('Toán') is not null co`)))
    console.log(' thế giới home:', JSON.stringify(await q(`select fn_the_gioi_home() is not null co`)))
  }
  // em test 9 thấy BXH khối 9 có em test (TEST06 vừa sinh bài nhưng chưa làm câu nào ⇒ chưa lên BXH là đúng); em thật thì không
  await laUid(await uidCua('HS0557'))
  console.log('\nEM THẬT thấy em test trong rank khối 9?', JSON.stringify(await q(`select count(*)::int n from fn_rank_mua('Toán','9') r join hoc_sinh h on h.id=r.hoc_sinh_id where h.trang_thai='test'`)))
  const uid6 = (await c.query(`select tk.id from tai_khoan tk join hoc_sinh h on h.id=tk.hoc_sinh_id where h.ma_hs='TEST06'`)).rows[0].id
  await laUid(uid6)
  console.log('TEST06 thấy em test trong rank khối 9?', JSON.stringify(await q(`select count(*)::int n from fn_rank_mua('Toán','9') r join hoc_sinh h on h.id=r.hoc_sinh_id where h.trang_thai='test'`)))
} finally { await c.query('rollback'); await c.end() }
