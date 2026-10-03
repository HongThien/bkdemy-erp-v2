// Chạy thử 2 mig sổ tay (mở rộng + nạp KHTN) trong 1 transaction rồi ROLLBACK — không ghi gì.
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
const M = ['202610031125_sotay_muc_mo_rong.sql', '202610031126_sotay_khtn_nap.sql']
await c.query('begin')
try {
  for (const f of M) { await c.query(fs.readFileSync('supabase/migrations/' + f, 'utf8')); console.log('áp thử', f, 'OK') }
  console.log(await q(`select loai, count(*) from sotay_cong_thuc where mon='KHTN' group by 1 order by 2 desc`))
  console.log('Toán còn nguyên:', await q(`select count(*) n, count(*) filter (where loai='ct') ct from sotay_cong_thuc where mon='Toán'`))

  await la('HS0557') // khối 9, học KHTN
  const cay = (await q(`select hs_sotay_muc_cay('KHTN') x`))[0].x
  console.log('\ncây KHTN (HS0557): khối', cay.khoi, '· khối có', cay.khoi_list, '· chủ đề', cay.chu_de.length, '·', cay.chu_de.slice(0, 4).map((d) => `${d.nhanh}/${d.ten} (${d.muc.length})`).join(' · '))
  console.log('cây khối 7:', (await q(`select jsonb_array_length(hs_sotay_muc_cay('KHTN','7')->'chu_de') n`))[0])
  const tim = (await q(`select hs_sotay_tim_ct('nguyen tu', 'KHTN', '7') x`))[0].x
  console.log('\ntìm "nguyen tu" khối 7:', tim.length, 'kết quả ·', tim.slice(0, 3).map((r) => `${r.ten} [${r.loai}]`).join(' · '))
  const muc = (await q(`select hs_sotay_muc('h7-nguyen-tu') x`))[0].x
  console.log('mở h7-nguyen-tu: khoá', Object.keys(muc).join(','), '\n  lq:', JSON.stringify(muc.lq), '\n  vd:', JSON.stringify(muc.vd).slice(0, 160))
  console.log('tìm không dấu "dinh luat ohm" khối 9:', ((await q(`select hs_sotay_tim_ct('dinh luat ohm', 'KHTN', '9') x`))[0].x ?? []).map((r) => r.ten))
  console.log('Toán tìm "dao ham" (0 thẻ duyệt ⇒ rỗng):', (await q(`select jsonb_array_length(hs_sotay_tim_ct('dao ham', 'Toán', '12')) n`))[0])

  // trigger: sửa nội dung mới ⇒ về chờ duyệt (role ghi, không JWT nhân sự)
  console.log('\nsửa y ⇒', await q(`update sotay_cong_thuc set y = '["thử"]'::jsonb where ma = 'h7-proton' returning trang_thai`))
  console.log('lịch sử h7-proton:', await q(`select hanh_dong, trang_thai_moi from sotay_ct_lich_su where ma_the = 'h7-proton' order by id`))
} finally { await c.query('rollback'); await c.end() }
