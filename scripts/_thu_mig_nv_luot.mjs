// Chạy thử mig 202610011525 (nhiệm vụ chỉ tính lượt học thật) trong 1 transaction rồi ROLLBACK — so TRƯỚC/SAU trên dữ liệu thật.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const tom = async () => {
  const r = await q(`select ma, tang, count(distinct hoc_sinh_id)::int hs, coalesce(sum(so),0)::int tong from public.fn_nhiem_vu_hoan_thanh('Toán', to_char(now() at time zone 'Asia/Ho_Chi_Minh','YYYY-MM')) where tang in ('ngay','tien_do') and ma in ('N1','N2','N3') group by 1,2 order by 1,2`)
  return Object.fromEntries(r.map((x) => [`${x.ma}/${x.tang}`, `${x.hs} em · ${x.tong}`]))
}
try {
  await c.query('begin'); await c.query("set local statement_timeout = '600s'")
  let t0 = Date.now(); const truoc = await tom(); console.log('TRƯỚC ' + (Date.now() - t0) + ' ms')
  const luotTruoc = (await q(`select count(*)::int n from public._luot_hoc_that((select hoc_sinh_id from bai_lam order by nop_at desc nulls last limit 1), '-infinity','infinity')`))[0].n
  await c.query(fs.readFileSync('supabase/migrations/202610011525_nhiem_vu_chi_tinh_luot_hoc_that.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const t = Date.now(); const sau = await tom(); console.log(`fn_nhiem_vu_hoan_thanh cả môn Toán: ${Date.now() - t} ms`)
  console.log('TRƯỚC:', truoc); console.log('SAU  :', sau)
  // _luot_hoc_that cũ vs mới phải CHO CÙNG KẾT QUẢ
  const em = (await q(`select distinct bl.hoc_sinh_id id from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id where bt.loai='tu_luyen' and bl.nop_at > now()-interval '30 days' limit 15`))
  let lech = 0, tong = 0
  for (const e of em) {
    const r = await q(`select tinh, ly_do, so_cau, dung from public._luot_hoc_that($1,'-infinity','infinity')`, [e.id]); tong += r.length
    const r2 = await q(`select t.tinh, t.ly_do, t.so_cau, t.dung from public._luot_tinh(array[$1::uuid],'-infinity','infinity') t`, [e.id])
    if (r.length !== r2.length) lech++
  }
  console.log(`_luot_hoc_that vs _luot_tinh: ${tong} lượt, lệch số dòng ở ${lech}/${em.length} em`)
  const hn = await q(`select count(*) filter (where tinh) tinh, count(*) filter (where ly_do='qua_nhanh') nhanh from public._luot_tinh((select array_agg(distinct x.hoc_sinh_id) from bai_lam x), now()-interval '30 days', now())`)
  console.log('Toàn trung tâm 30 ngày:', hn[0])
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
