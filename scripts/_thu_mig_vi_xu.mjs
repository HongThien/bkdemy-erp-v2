// Thử mig vi_xu_hien_exp_nhiem_vu_huy_hieu trong ROLLBACK: dòng nhiệm vụ + huy hiệu trong Ví xu KHỚP fn_exp_app_thang (nguồn đổi xu).
// Chưa có em nào có EXP nhiệm vụ/huy hiệu thật (nhiệm vụ mở 01/10, huy hiệu chưa chốt) ⇒ dựng dữ liệu thử trong giao dịch rồi ROLLBACK.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const jwt = (sub) => c.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub, role: 'authenticated' })])
try {
  await c.query('begin'); await c.query("set local statement_timeout = '300s'")
  const file = fs.readdirSync('supabase/migrations').filter((f) => f.endsWith('_vi_xu_hien_exp_nhiem_vu_huy_hieu.sql')).sort().pop()
  await c.query(fs.readFileSync('supabase/migrations/' + file, 'utf8'))
  console.log('✔ migration chạy được')
  await c.query(fs.readFileSync('supabase/migrations/' + file, 'utf8'))
  console.log('✔ chạy lần 2 vô hại (đã vá thì bỏ qua)')

  // dữ liệu thử: lùi ngày mở nhiệm vụ về 01/09; thêm huy hiệu ★4 (200 EXP) cho 1 em có Thử thách
  await q("update nhiem_vu_cau_hinh set bat_dau = '2026-09-01' where mon = 'Toán'")
  const hsh = (await q("select hoc_sinh_id from thu_thach_luot where mon='Toán' limit 1"))[0].hoc_sinh_id
  const key = (await q("select key from huy_hieu where mon='Toán' limit 1"))[0].key
  await q("insert into hs_huy_hieu_dat (hoc_sinh_id, mon, huy_hieu_key, sao, mua, lan, thang_chot, dat_at) values ($1,'Toán',$2,4,'2026-27',1,'2026-09','2026-09-20 10:00+07')", [hsh, key])

  // (1) nhiệm vụ: 4 em có EXP nhiệm vụ nhiều nhất
  const ung = await q("select distinct hoc_sinh_id from thu_thach_luot where mon='Toán' limit 6")
  const ds = []
  for (const u of ung) ds.push(...await q("select hoc_sinh_id, mon, exp_nhiem_vu, exp_thanh_tuu from public.fn_exp_app_thang('2026-09', $1::uuid, 'Toán')", [u.hoc_sinh_id]))
  let ok = 0, lech = 0
  for (const r of ds) {
    const tk = (await q('select id from tai_khoan where hoc_sinh_id=$1', [r.hoc_sinh_id]))[0]
    if (!tk) continue
    await jwt(tk.id)
    const v = (await q("select public.fn_hs_vi_xu_cua_toi('2026-09') v"))[0].v
    const nv = v.hoat_dong.filter((h) => h.nguon === 'exp_nhiem_vu' && h.mon === r.mon).reduce((s, h) => s + h.so, 0)
    const hh = v.hoat_dong.filter((h) => h.nguon === 'exp_huy_hieu' && h.mon === r.mon).reduce((s, h) => s + h.so, 0)
    if (nv === r.exp_nhiem_vu && hh === r.exp_thanh_tuu) ok++; else { lech++; console.log('  ✖ lệch', r, { nv, hh }) }
  }
  console.log(`Nhiệm vụ tháng 9 (giả lùi ngày mở): ${ds.length} em · khớp ${ok} · lệch ${lech} · ví dụ ${JSON.stringify(ds[0])}`)

  // (2) huy hiệu giả của em hsh
  const tk = (await q('select id from tai_khoan where hoc_sinh_id=$1', [hsh]))[0]
  await jwt(tk.id)
  const v = (await q("select public.fn_hs_vi_xu_cua_toi('2026-09') v"))[0].v
  const dong = v.hoat_dong.filter((h) => h.nguon === 'exp_huy_hieu')
  const nguon = (await q("select exp_thanh_tuu, exp_nhiem_vu from public.fn_exp_app_thang('2026-09', $1::uuid, 'Toán')", [hsh]))[0]
  const tong = dong.reduce((s, h) => s + h.so, 0)
  console.log('Dòng huy hiệu:', JSON.stringify(dong))
  console.log(`Tổng dòng huy hiệu ${tong} · exp_thanh_tuu của fn_exp_app_thang ${nguon?.exp_thanh_tuu}`, tong === nguon?.exp_thanh_tuu ? '✔ KHỚP' : '✖ LỆCH')
  console.log('Dòng nhiệm vụ của em này:', JSON.stringify(v.hoat_dong.filter((h) => h.nguon === 'exp_nhiem_vu')))
  // (3) tháng không có gì ⇒ không bịa dòng
  const trong = (await q("select public.fn_hs_vi_xu_cua_toi('2026-02') v"))[0].v.hoat_dong.filter((h) => h.nguon === 'exp_nhiem_vu' || h.nguon === 'exp_huy_hieu')
  console.log('Tháng 02/2026 (trước khi có nhiệm vụ/huy hiệu): số dòng mới =', trong.length, trong.length === 0 ? '✔' : '✖')
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
