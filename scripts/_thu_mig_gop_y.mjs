// Chạy thử mig 202610011539 (góp ý / báo lỗi của HS) trong 1 transaction rồi ROLLBACK — không ghi gì thật.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const loi = async (f) => { await c.query('savepoint sp'); try { await f(); await c.query('release savepoint sp'); return 'KHÔNG LỖI (sai)' } catch (e) { await c.query('rollback to savepoint sp'); return 'chặn: ' + e.message.slice(0, 70) } }
try {
  await c.query('begin')
  await c.query(fs.readFileSync('supabase/migrations/202610011539_gop_y_bao_loi_hoc_sinh.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const hs = (await q(`select h.id, tk.id tk from hoc_sinh h join tai_khoan tk on tk.hoc_sinh_id=h.id where h.khoi='7' limit 1`))[0]
  const jwt = (sub) => c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub, role: 'authenticated' })])
  await jwt(hs.tk)
  const ok = (await q(`select public.fn_hs_gui_gop_y('bug', 'Bấm nút Nộp bài không thấy phản hồi gì cả', '/hs', '{"man":"tu_luyen","w":1180}'::jsonb) v`))[0].v
  console.log('Gửi:', JSON.stringify(ok))
  console.log('Ngắn quá   :', await loi(() => q(`select public.fn_hs_gui_gop_y('bug', 'lỗi')`)))
  console.log('Loại lạ    :', await loi(() => q(`select public.fn_hs_gui_gop_y('xyz', 'mô tả đủ dài rồi nhé em')`)))
  console.log('Ảnh ngoài  :', await loi(() => q(`select public.fn_hs_gui_gop_y('bug', 'mô tả đủ dài rồi nhé em', null, null, 'http://evil.example/a.png')`)))
  for (let i = 0; i < 4; i++) await q(`select public.fn_hs_gui_gop_y('yeu_cau', $1)`, ['Em muốn có thêm game nuôi thú số ' + i + ' ạ'])
  console.log('Gửi lần 6  :', await loi(() => q(`select public.fn_hs_gui_gop_y('yeu_cau', 'thêm một ý tưởng nữa nè thầy cô')`)))
  console.log('HS la_thanh_vien (RLS bảng bao_loi chỉ cho thành viên):', (await q('select public.la_thanh_vien() v'))[0].v)
  const ds = (await q(`select public.fn_hs_gop_y_cua_toi() v`))[0].v
  console.log(`HS thấy ${ds.length} góp ý · trạng thái đầu: ${ds[ds.length - 1].trang_thai} · loại ${ds[ds.length - 1].loai}`)
  // nhân sự trả lời
  const ns = (await q(`select tk.id from tai_khoan tk join nhan_su n on n.id=tk.nhan_su_id limit 1`))[0]
  await jwt(ns.id)
  await q(`select public.fn_bao_loi_tra_loi($1, 'Cảm ơn em, thầy cô đã sửa rồi nhé!')`, [ok.id])
  await jwt(hs.tk)
  const sau = (await q(`select public.fn_hs_gop_y_cua_toi() v`))[0].v.find((x) => x.id === ok.id)
  console.log('HS thấy trả lời:', sau.tra_loi, '| dấu mới:', sau.tra_loi_moi, '| chưa đọc:', (await q('select public.fn_hs_gop_y_chua_doc() v'))[0].v)
  await q('select public.fn_hs_gop_y_da_doc()')
  console.log('Sau khi đọc: chưa đọc =', (await q('select public.fn_hs_gop_y_chua_doc() v'))[0].v)
  await jwt(hs.tk)
  console.log('HS trả lời hộ  :', await loi(() => q(`select public.fn_bao_loi_tra_loi($1, 'tự trả lời')`, [ok.id])))
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
