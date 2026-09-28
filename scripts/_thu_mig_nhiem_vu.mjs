// Chạy thử mig 202609281809 + 202609281810 trong 1 transaction rồi ROLLBACK — không ghi DB thật.
// Lùi bat_dau Toán về 01/09 TRONG transaction để đo trên dữ liệu tháng 9 thật.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = {}
for (const l of readFileSync('.env', 'utf8').split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, '') }
const c = new pg.Client({ connectionString: env.DATABASE_URL }); c.on('error', (e) => console.log('pg error', e.message)); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const T = (r) => console.table(r)
try {
  await c.query('begin')
  for (const f of ['202609281809_mastery_tinh_den_ngay', '202609281810_nhiem_vu_vong_quay']) { await c.query(readFileSync(`supabase/migrations/${f}.sql`, 'utf8')); console.log('mig OK', f) }
  console.log('mastery p_den: số ô trước/sau (1 HS)', (await q(`with h as (select hoc_sinh_id from hoc_sinh_lop limit 1) select (select count(*) from fn_mastery_cells(array(select * from h))) a, (select count(*) from fn_mastery_cells(array(select * from h), false, null,5,5,3, now())) b, (select count(*) from fn_mastery_cells(array(select * from h), false, null,5,5,3, '2026-09-01')) c`))[0])
  await q(`update nhiem_vu_cau_hinh set bat_dau = '2026-09-01' where mon = 'Toán'`)
  let t = Date.now()
  const all = await q(`select ma, tang, count(distinct hoc_sinh_id)::int hs, sum(so)::int so from fn_nhiem_vu_hoan_thanh('Toán','2026-09') group by 1,2 order by 2,1`)
  console.log('① Toàn bộ HS Toán tháng 9:', Date.now() - t, 'ms'); T(all)
  t = Date.now()
  const ch = await q(`select * from fn_nhiem_vu_chang_thang('Toán','2026-09')`)
  console.log('② Chặng tháng 9:', Date.now() - t, 'ms, số HS có điểm', ch.length)
  const pb = {}; for (const r of ch) { const k = r.cap >= 30 ? '30' : r.cap >= 20 ? '20-29' : r.cap >= 10 ? '10-19' : r.cap >= 1 ? '1-9' : '0'; pb[k] = (pb[k] ?? 0) + 1 }
  console.log('   phân bố cấp:', pb, '| EXP max', Math.max(...ch.map((r) => r.exp)), '| EXP TB', Math.round(ch.reduce((s, r) => s + r.exp, 0) / ch.length))
  t = Date.now()
  const app = await q(`select * from fn_exp_app_thang('2026-09')`)
  console.log('③ fn_exp_app_thang:', Date.now() - t, 'ms, dòng', app.length, '| xu app (trần 30) TB', (app.reduce((s, r) => s + Math.min(30, Math.ceil(r.exp_app / 100)), 0) / app.length).toFixed(1))
  // 1 HS đang dùng app nhiều
  const hs = (await q(`select bl.hoc_sinh_id, tk.id tk from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id join tai_khoan tk on tk.hoc_sinh_id=bl.hoc_sinh_id
                       where bt.loai='tu_luyen' and bt.mon='Toán' and bt.ngay >= '2026-09-15' group by 1,2 order by count(*) desc limit 1`))[0]
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: hs.tk, role: 'authenticated' })])
  t = Date.now()
  const me = (await q(`select fn_hs_nhiem_vu_cua_toi('Toán') v`))[0].v
  console.log('④ fn_hs_nhiem_vu_cua_toi (HS dùng app nhiều nhất):', Date.now() - t, 'ms')
  console.log(JSON.stringify({ ngay: me.ngay, tuan_nv: me.tuan_nv, thang_nv: me.thang_nv, ruong: me.ruong, chang: me.chang, vong_quay: me.vong_quay }, null, 1))
  const mm = (await q(`select fn_may_man_hs_cua_toi() v`))[0].v
  console.log('⑤ vòng quay:', JSON.stringify({ che_do: mm.che_do, du: mm.du_dieu_kien, ti_le: mm.ti_le }))
  // Quay 2000 lần giả để kiểm phân bố giải (xoá lượt hôm nay mỗi lần — trong transaction)
  if (mm.du_dieu_kien.du) {
    const dem = {}
    for (let i = 0; i < 300; i++) { await q(`delete from may_man_hs_luot where hoc_sinh_id = $1 and ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date`, [hs.hoc_sinh_id]); const r = (await q(`select fn_may_man_hs_quay() v`))[0].v; dem[r.exp] = (dem[r.exp] ?? 0) + 1 }
    console.log('   300 lượt quay:', dem)
  }
  console.log('   anon execute fn_hs_nhiem_vu_cua_toi?', (await q(`select has_function_privilege('anon','public.fn_hs_nhiem_vu_cua_toi(text)','execute') a`))[0].a)
} catch (e) { console.log('LỖI:', e.message, e.where ?? '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong') }
