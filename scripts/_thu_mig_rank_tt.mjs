// Thử mig rank_thu_thach_chi_tinh_luot_hoc_that trong ROLLBACK: nộp lại các lượt Thử thách cũ và so điểm.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  const file = fs.readdirSync('supabase/migrations').filter((f) => f.endsWith('rank_thu_thach_chi_tinh_luot_hoc_that.sql')).sort().pop()
  await c.query(fs.readFileSync('supabase/migrations/' + file, 'utf8'))
  console.log('✔ migration chạy được:', file)
  const luot = await q(`select * from thu_thach_luot order by created_at`)
  let giu = 0, mat = 0, lech = 0
  for (const l of luot) {
    const tinh = (await q(`select t.tinh, t.giay_tb, t.dung, t.so_cau from public._luot_tinh(array[$1::uuid],'-infinity','infinity') t where t.bai_lam_id=$2`, [l.hoc_sinh_id, l.bai_lam_id]))[0]
    await q(`delete from thu_thach_luot where bai_lam_id=$1`, [l.bai_lam_id])
    await q(`update bai_lam set trang_thai='dang_lam' where id=$1`, [l.bai_lam_id])
    await q(`update bai_lam set trang_thai='da_nop' where id=$1`, [l.bai_lam_id])
    const moi = (await q(`select diem_goc, diem, pass from thu_thach_luot where bai_lam_id=$1`, [l.bai_lam_id]))[0]
    if (!moi) { lech++; console.log('  ✖ không ghi lại lượt', l.bai_lam_id); continue }
    const kyVong = tinh?.tinh ? l.diem_goc : 0
    if (moi.diem_goc !== kyVong) { lech++; console.log('  ✖ lệch', l.bai_lam_id, { cu: l.diem_goc, moi: moi.diem_goc, tinh }) }
    else if (l.diem_goc > 0 && moi.diem_goc === 0) mat++
    else giu++
  }
  console.log(`${luot.length} lượt Thử thách cũ nộp lại: giữ điểm ${giu} · MẤT điểm vì không phải lượt học thật ${mat} · lệch ${lech}`)
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
