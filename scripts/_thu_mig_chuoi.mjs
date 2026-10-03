// Chạy thử mig 202610011512 (chuỗi làm bài) trong 1 transaction rồi ROLLBACK — không ghi gì thật.
// node scripts/_thu_mig_chuoi.mjs
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  await c.query(fs.readFileSync('supabase/migrations/202610011512_chuoi_lam_bai.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const hs = await q(`select bl.hoc_sinh_id id, h.ho_ten, h.khoi from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id join hoc_sinh h on h.id=bl.hoc_sinh_id
    where bt.loai='tu_luyen' and bl.nop_at > now()-interval '30 days' group by 1,2,3 order by count(*) desc limit 12`)
  const t0 = Date.now()
  for (const h of hs) {
    const v = (await q(`select public._chuoi_cua($1) v`, [h.id]))[0].v
    console.log(`${h.ho_ten.padEnd(26)} k${h.khoi.padEnd(3)} chuỗi ${String(v.so_ngay).padStart(3)} · kỷ lục ${String(v.ky_luc).padStart(3)} · thẻ ${v.the_dong_bang} · hôm nay ${v.hom_nay_da_tinh ? '✔' : '·'} · chờ sửa ${JSON.stringify(v.ngay_cho_sua)} · 7 ngày ${v.bay_ngay.map((x) => ({ hoc: '🔥', dong_bang: '❄', nghi: '🏖', trong: '·', cho_sua: '?', dut: '✖' })[x.trang_thai] ?? x.trang_thai).join('')} · mốc ${v.moc_tiep}`)
  }
  console.log(`(${hs.length} em, ${Date.now() - t0} ms)`)
  // ngày nghỉ: thêm 1 khoảng cho khối của em đầu tiên, chuỗi không được giảm
  const h0 = hs[0]
  const truoc = (await q(`select public._chuoi_cua($1) v`, [h0.id]))[0].v
  await q(`insert into chuoi_ngay_nghi (tu, den, khoi, ly_do) values (current_date - 20, current_date - 10, array[$1], 'thử')`, [h0.khoi])
  const sau = (await q(`select public._chuoi_cua($1) v`, [h0.id]))[0].v
  console.log(`Ngày nghỉ 11 ngày cho khối ${h0.khoi}: chuỗi ${truoc.so_ngay} → ${sau.so_ngay} (không được giảm) · kỷ lục ${truoc.ky_luc} → ${sau.ky_luc}`)
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
