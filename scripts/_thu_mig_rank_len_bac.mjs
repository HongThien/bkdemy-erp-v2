// Thử mig rank_len_bac trong ROLLBACK: nhật ký lên bậc khớp fn_rank_mua, thời gian, tin Thế giới, quyền.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin'); await c.query("set local statement_timeout = '300s'")
  const file = fs.readdirSync('supabase/migrations').filter((f) => f.endsWith('_rank_len_bac.sql')).sort().pop()
  await c.query(fs.readFileSync('supabase/migrations/' + file, 'utf8'))
  console.log('✔ migration chạy được:', file)
  let t = Date.now(); const n = (await q(`select public._rank_len_bac_ghi('Toán', null) n`))[0].n
  console.log(`Quét cả môn Toán: ${n} dòng · ${Date.now() - t} ms`)
  // KHỚP fn_rank_mua: bậc cao nhất trong nhật ký = bậc hiện tại của em
  const khop = await q(`with a as (select hoc_sinh_id, max(bac) b from rank_len_bac where mon='Toán' group by 1), m as (select hoc_sinh_id, bac, diem_mua from public.fn_rank_mua('Toán'))
    select count(*)::int tong, count(*) filter (where coalesce(a.b,1) = m.bac)::int khop, count(*) filter (where m.bac >= 2)::int tren_novice from m left join a using (hoc_sinh_id)`)
  console.log('Bậc trong nhật ký vs fn_rank_mua:', khop[0])
  console.table(await q(`select ten_bac, count(*)::int so_em, min(dat_ngay) som_nhat, max(dat_ngay) muon_nhat, count(*) filter (where xem_at is null)::int chua_xem from rank_len_bac where mon='Toán' group by bac, ten_bac order by bac`))
  // tin Thế giới
  t = Date.now(); const tin = await q(`select tang, count(*)::int n from public._the_gioi_tin(now() - interval '7 days') where kieu='len_bac' group by 1`)
  console.log('Tin len_bac 7 ngày:', JSON.stringify(tin), `· ${Date.now() - t} ms`)
  // em mở app: hoạt cảnh
  const em = (await q(`select r.hoc_sinh_id id, tk.id tk from rank_len_bac r join tai_khoan tk on tk.hoc_sinh_id=r.hoc_sinh_id where r.mon='Toán' and r.xem_at is null limit 1`))[0]
  if (em) {
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: em.tk, role: 'authenticated' })])
    const moi = (await q(`select public.fn_hs_len_bac_moi('Toán') v`))[0].v
    console.log('Em mở app, bậc mới chưa xem:', JSON.stringify(moi))
    await q(`select public.fn_hs_len_bac_da_xem('Toán')`)
    console.log('Sau khi xem:', JSON.stringify((await q(`select public.fn_hs_len_bac_moi('Toán') v`))[0].v))
  } else console.log('Không có em nào có bậc mới chưa xem (toàn dữ liệu cũ) — không kiểm được hoạt cảnh')
  console.log('Quyền: ghi =', JSON.stringify((await q(`select has_function_privilege('anon','public._rank_len_bac_ghi(text,uuid[])','execute') anon, has_function_privilege('authenticated','public._rank_len_bac_ghi(text,uuid[])','execute') auth`))[0]))
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
