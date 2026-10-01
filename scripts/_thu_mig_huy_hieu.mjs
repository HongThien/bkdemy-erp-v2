// Chạy thử mig 202609281846_huy_hieu trong 1 transaction rồi ROLLBACK: chốt tháng 7, 8 → phân bố sao · album 1 HS · việc trao · EXP app.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = {}
for (const l of readFileSync('.env', 'utf8').split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, '') }
const c = new pg.Client({ connectionString: env.DATABASE_URL }); c.on('error', (e) => console.log('pg error', e.message)); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const KHONG_GHI = process.argv.includes('--that') ? false : true
try {
  await c.query('begin')
  if (KHONG_GHI) { await c.query(readFileSync('supabase/migrations/202609281846_huy_hieu.sql', 'utf8')); console.log('mig OK') }
  const staff = (await q(`select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id limit 1`))[0].id
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: staff, role: 'authenticated' })])
  let t = Date.now()
  const hs1 = (await q(`select hoc_sinh_id from buoi_hoc_hs limit 1`))[0].hoc_sinh_id
  console.log('① đo 1 HS tháng 8:', (await q(`select thanh_tuu_key k, ket_qua from fn_thanh_tuu_thang('Toán','2026-08', array['${hs1}'::uuid]) order by 1`)).map((r) => r.k + ':' + r.ket_qua).join(' '), Date.now() - t, 'ms')
  for (const ym of ['2026-07', '2026-08']) {
    t = Date.now(); console.log('② chốt', ym, (await q(`select fn_huy_hieu_chot_thang('Toán', $1) v`, [ym]))[0].v, Date.now() - t, 'ms')
  }
  console.log('③ % em đạt từng thành tựu (tháng 7 · 8):')
  console.table(await q(`select thanh_tuu_key k,
     round(100.0*count(*) filter (where thang='2026-07' and ket_qua='dat')/nullif(count(*) filter (where thang='2026-07' and ket_qua<>'khong_ap_dung'),0)) t7,
     round(100.0*count(*) filter (where thang='2026-08' and ket_qua='dat')/nullif(count(*) filter (where thang='2026-08' and ket_qua<>'khong_ap_dung'),0)) t8,
     count(*) filter (where ket_qua='khong_ap_dung') kad from hs_thanh_tuu_thang where mon='Toán' group by 1 order by 1`))
  console.log('④ sao đạt sau 2 tháng:')
  console.table(await q(`select huy_hieu_key hh, count(*) filter (where sao=1) s1, count(*) filter (where sao=2) s2, count(*) filter (where sao>=3) s3p from hs_huy_hieu_dat where mon='Toán' group by 1 order by 1`))
  console.log('   EXP app tháng 9 (huy hiệu đạt hôm nay):', (await q(`select sum(exp_thanh_tuu) tt, count(*) n from fn_exp_app_thang(to_char(now() at time zone 'Asia/Ho_Chi_Minh','YYYY-MM'))`))[0])
  const hs = (await q(`select d.hoc_sinh_id, tk.id tk from hs_huy_hieu_dat d join tai_khoan tk on tk.hoc_sinh_id = d.hoc_sinh_id group by 1,2 order by count(*) desc limit 1`))[0]
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: hs.tk, role: 'authenticated' })])
  t = Date.now(); const al = (await q(`select fn_hs_album('Toán') v`))[0].v
  console.log('⑤ album HS nhiều sao nhất:', Date.now() - t, 'ms')
  for (const h of al.huy_hieu) console.log(`   ${h.bieu_tuong} ${h.ten} ★${h.sao} · chuẩn ${h.n_chuan} (tạm ${h.n_chuan_tam}) · hoàn hảo ${h.n_hoan_hao} · ${h.dat.map((d) => '★' + d.sao + ' ' + d.so_ban_khoi + '/' + al.si_so_khoi).join(' ')} · tháng này: ${h.thang_nay.map((x) => x.key + '=' + x.ket_qua).join(',')}`)
  console.log('   anon album?', (await q(`select has_function_privilege('anon','public.fn_hs_album(text)','execute') a`))[0].a)
} catch (e) { console.log('LỖI:', e.message, e.where ?? '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong') }
