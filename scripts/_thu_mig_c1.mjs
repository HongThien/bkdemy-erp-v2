// Chạy thử mig 202610071314 (Đấu Từ theo tài khoản + nhật ký câu) trong 1 transaction rồi ROLLBACK.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const ok = (cond, msg) => console.log((cond ? '  ✔ ' : '  ✖ ') + msg)
const jwt = (sub) => c.query(`select set_config('request.jwt.claims', $1, true)`, [sub ? JSON.stringify({ sub, role: 'authenticated' }) : '{}'])
const loi = async (f) => { try { await c.query('savepoint s'); await f(); return null } catch (e) { await c.query('rollback to savepoint s'); return e.message } }
try {
  await c.query('begin'); await c.query("set local statement_timeout = '600s'")
  await c.query(fs.readFileSync('supabase/migrations/202610071340_bxh_c1_leo_thap.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const tks = await q(`select tk.id uid, tk.hoc_sinh_id hs, h.khoi from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc'
                       join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' join lop l on l.id = hl.lop_id and l.mon = 'Toán' where h.khoi is not null`)
  const A = tks[0]; const B = tks.find((x) => x.khoi === A.khoi && x.hs !== A.hs)
  console.log('khối', A.khoi, '| có bạn cùng khối:', !!B)
  await jwt(A.uid)
  await q(`select public.fn_dtv_ho_so_hs()`)
  if (B) { await jwt(B.uid); await q(`select public.fn_dtv_ho_so_hs()`) }
  const ins = (hs, tang, sai, nguon) => c.query(`insert into dtv_thap_luot (uid, mon, nhom, che_do, ngay, tang, sai, ms, nguon_cham) values ('hs_' || $1, 'Toán', $2, 'song_con', (now() at time zone 'Asia/Ho_Chi_Minh')::date, $3, $4, 200000, $5)`, [hs, A.khoi, tang, sai, nguon])
  await ins(A.hs, 18, 3, 'server'); await ins(A.hs, 25, 0, 'client')            // client "khai khống" 25 tầng ⇒ KHÔNG được tính
  if (B) { await ins(B.hs, 18, 1, 'server') }                                    // cùng 18 tầng nhưng ít sai hơn ⇒ đứng trên A
  await jwt(A.uid)
  const r = (await q(`select public.fn_bxh('C1','Toán','khoi','hom_nay') j`))[0].j
  console.log(JSON.stringify(r.top.map(x => [x.hang, x.ten, x.gia_tri])), 'toi', r.toi)
  ok(r.san_sang === true && r.toi && Number(r.toi.gia_tri) === 18, 'C1 mở; tầng của em = 18 (lượt client khai 25 tầng KHÔNG tính)')
  if (B) ok(r.toi.hang === 2 && r.top[0].hang === 1 && Number(r.top[0].gia_tri) === 18, 'hoà 18 tầng: ít sai hơn (B) đứng trên, A hạng 2')
  const r2 = (await q(`select public.fn_bxh('C1','Toán','toan_bk','hien_tai') j`))[0].j
  ok(r2.tong >= r.tong, `Toàn BK / Kỷ lục chạy được (${r2.tong} em)`)
  await c.query('savepoint sp')
  const r3 = (await q(`select public.fn_bxh('C1','Toán','khoi','tuan') j`).catch(e => ({ err: e.message })))
  await c.query('rollback to savepoint sp')
  ok(r3.err && /Kỳ không hợp lệ/.test(r3.err), 'kỳ "tuần" không hợp lệ cho C1: ' + r3.err)
  const dm = (await q(`select public.fn_bxh_danh_muc() j`))[0].j
  ok(dm.find(x => x.ma === 'C1').san_sang === true && dm.filter(x => x.san_sang).length === 6, 'danh mục: C1 sẵn sàng (6 bảng sẵn sàng)')
  const bx = (await q(`select public.fn_dtv_thap_bxh_mon('song_con','Toán',$1,true,'hs_' || $2) j`, [A.khoi, A.hs]))[0].j
  ok(Number(bx.toi.tang) === 18, 'BXH trong game (môn có kho) chỉ tính lượt máy chủ chấm: tầng của em = 18, không phải 25')
  const bxa = (await q(`select public.fn_dtv_thap_bxh_mon('song_con','Tiếng Anh','',true,'hs_' || $1) j`, [A.hs]))[0].j
  ok(typeof bxa.so_nguoi === 'number', 'môn không có kho (Tiếng Anh) vẫn đọc bảng như cũ')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
