// Chạy thử mig 202610011515 (mốc chuỗi → Thế giới BK) trong 1 transaction rồi ROLLBACK — không ghi gì thật.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  let t = Date.now(); const truoc = (await q(`select count(*)::int n from public._the_gioi_tin(now() - interval '7 days')`))[0].n; const msTruoc = Date.now() - t
  await c.query(fs.readFileSync('supabase/migrations/202610011515_chuoi_moc_the_gioi.sql', 'utf8'))
  console.log('✔ migration chạy được')
  // tìm em có chuỗi 7–9 ngày
  const ds = await q(`select distinct bl.hoc_sinh_id id, h.ho_ten from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id join hoc_sinh h on h.id=bl.hoc_sinh_id
    where bt.loai='tu_luyen' and bl.nop_at > now()-interval '14 days'`)
  let em = null
  for (const h of ds) { const v = (await q(`select public._chuoi_cua($1) v`, [h.id]))[0].v; if (v.so_ngay >= 7 && v.so_ngay <= 9) { em = { ...h, v }; break } }
  if (!em) { console.log('Không có em chuỗi 7–9 ngày để thử — thử với ngưỡng thấp: không kiểm được trigger'); }
  else {
    console.log(`Em thử: ${em.ho_ten} · chuỗi ${em.v.so_ngay} từ ${em.v.bat_dau}`)
    const bl = (await q(`select bl.id from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id where bl.hoc_sinh_id=$1 and bt.loai='tu_luyen' and bl.trang_thai='da_nop' order by bl.nop_at desc limit 1`, [em.id]))[0]
    await q(`update bai_lam set trang_thai='dang_lam' where id=$1`, [bl.id])
    await q(`update bai_lam set trang_thai='da_nop' where id=$1`, [bl.id])
    console.log('Mốc ghi được:', JSON.stringify(await q(`select moc, bat_dau, mon from chuoi_moc_dat where hoc_sinh_id=$1`, [em.id])))
    console.log('Tin Thế giới:', JSON.stringify(await q(`select khoa, tang, kieu, mon, chi_tiet from public._the_gioi_tin(now() - interval '1 day') where kieu='chuoi'`)))
    // nộp lại lần nữa không được ghi trùng
    await q(`update bai_lam set trang_thai='dang_lam' where id=$1`, [bl.id]); await q(`update bai_lam set trang_thai='da_nop' where id=$1`, [bl.id])
    console.log('Sau khi nộp lại: số mốc =', (await q(`select count(*)::int n from chuoi_moc_dat where hoc_sinh_id=$1`, [em.id]))[0].n)
  }
  t = Date.now(); const sau = (await q(`select count(*)::int n from public._the_gioi_tin(now() - interval '7 days')`))[0].n
  console.log(`_the_gioi_tin 7 ngày: ${truoc} tin (${msTruoc} ms) → ${sau} tin (${Date.now() - t} ms)`)
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
