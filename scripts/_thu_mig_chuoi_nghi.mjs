// Thử mig chuoi_nghi_quyen_rieng trong ROLLBACK: admin ghi được, HS/không quyền bị chặn, kiểm đầu vào, ngày nghỉ nối chuỗi.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const jwt = (sub) => c.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub, role: 'authenticated' })])
const loi = async (f) => { await c.query('savepoint sp'); try { await f(); await c.query('release savepoint sp'); return 'KHÔNG LỖI' } catch (e) { await c.query('rollback to savepoint sp'); return 'chặn: ' + e.message.slice(0, 80) } }
try {
  await c.query('begin')
  const file = fs.readdirSync('supabase/migrations').filter((f) => f.endsWith('_chuoi_nghi_quyen_rieng.sql')).sort().pop()
  await c.query(fs.readFileSync('supabase/migrations/' + file, 'utf8'))
  console.log('✔ migration chạy được')
  const admin = (await q("select tk.id from tai_khoan tk join nhan_su n on n.id=tk.nhan_su_id where n.la_admin_he_thong limit 1"))[0]
  const gv = (await q("select tk.id from tai_khoan tk join nhan_su n on n.id=tk.nhan_su_id where not coalesce(n.la_admin_he_thong,false) and not exists (select 1 from vi_tri v join vai_tro_chuc_nang vc on vc.vai_tro_id=v.vai_tro_id where v.nhan_su_id=n.id and vc.chuc_nang='chuoi_nghi') limit 1"))[0]
  const hs = (await q("select tk.id, h.id hid, h.khoi from tai_khoan tk join hoc_sinh h on h.id=tk.hoc_sinh_id where h.khoi='4T' limit 1"))[0]
  const homNay = (await q("select (now() at time zone 'Asia/Ho_Chi_Minh')::date d"))[0].d.toISOString().slice(0, 10)
  console.log(admin ? 'có admin' : 'KHÔNG có admin hệ thống'), console.log(gv ? 'có nhân sự không quyền' : 'không có nhân sự thường để thử')
  if (gv) { await jwt(gv.id); console.log('Nhân sự không quyền :', await loi(() => q("select public.fn_chuoi_ngay_nghi_ghi(current_date, current_date+2, '{}', 'thử')"))) }
  await jwt(hs.id); console.log('Học sinh            :', await loi(() => q("select public.fn_chuoi_ngay_nghi_ghi(current_date, current_date+2, '{}', 'thử')")))
  if (admin) {
    await jwt(admin.id)
    const id = (await q("select public.fn_chuoi_ngay_nghi_ghi(current_date - 12, current_date - 8, array['4T'], 'Tuần thi thử') v"))[0].v
    console.log('Admin ghi           : ✔', id)
    console.log('Ghi trùng           :', await loi(() => q("select public.fn_chuoi_ngay_nghi_ghi(current_date - 12, current_date - 8, array['4T'], 'Tuần thi thử')")))
    console.log('Đến < từ            :', await loi(() => q("select public.fn_chuoi_ngay_nghi_ghi(current_date, current_date - 1, '{}', 'x')")))
    console.log('Quá 60 ngày         :', await loi(() => q("select public.fn_chuoi_ngay_nghi_ghi(current_date, current_date + 70, '{}', 'x')")))
    console.log('Quá khứ > 30 ngày   :', await loi(() => q("select public.fn_chuoi_ngay_nghi_ghi(current_date - 45, current_date - 40, '{}', 'x')")))
    console.log('Thiếu lý do         :', await loi(() => q("select public.fn_chuoi_ngay_nghi_ghi(current_date, current_date + 1, '{}', '  ')")))
    // chuỗi của em khối 4T thấy ngày nghỉ
    await jwt(hs.id)
    const v = (await q('select public.fn_chuoi_cua_toi() v'))[0].v
    console.log('Chuỗi em 4T:', v.so_ngay, '· dải 7 ngày:', v.bay_ngay.map((x) => x.trang_thai).join(','))
    await jwt(admin.id)
    await q('select public.fn_chuoi_ngay_nghi_go($1)', [id])
    console.log('Sau khi gỡ, còn', (await q("select count(*)::int n from chuoi_ngay_nghi where xoa_at is null and ly_do='Tuần thi thử'"))[0].n, 'dòng chưa gỡ')
  }
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
