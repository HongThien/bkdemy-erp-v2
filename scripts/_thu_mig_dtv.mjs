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
  await c.query(fs.readFileSync('supabase/migrations/202610071314_dtv_theo_tai_khoan.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const tks = await q(`select tk.id uid, tk.hoc_sinh_id hs, h.ho_ten, h.gioi_tinh from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc' limit 2`)
  const [A, B] = tks
  await jwt(A.uid)
  const hsA = (await q(`select public.fn_dtv_ho_so_hs() j`))[0].j
  const uidA = hsA.uid
  console.log('hồ sơ:', uidA, hsA.ho_so.ten, hsA.ho_so.nv, '| họ tên gốc:', A.ho_ten, A.gioi_tinh)
  ok(uidA === 'hs_' + A.hs && hsA.ho_so.ten && hsA.ho_so.nv.startsWith('tham_hiem'), 'hồ sơ tự tạo, uid = hs_<id>, tên + nhân vật tự có')
  const lai = (await q(`select public.fn_dtv_ho_so_hs() j`))[0].j
  ok(lai.ho_so.ma === hsA.ho_so.ma, 'gọi lần 2 không tạo lại hồ sơ (cùng mã)')

  const tran = (await q(`select public.fn_dtv_ghi_tran_mon($1,'Toán','bot','tron','thang',7,10,640,'bot') j`, [uidA]))[0].j
  ok(!!tran.tran_id && tran.xp_nhan > 0, `ghi trận: có tran_id, +${tran.xp_nhan} XP`)
  const row = (await q(`select hoc_sinh_id from dtv_tran where id = $1`, [tran.tran_id]))[0]
  ok(row.hoc_sinh_id === A.hs, 'dtv_tran.hoc_sinh_id (suy từ uid) = đúng học sinh')
  const thap = (await q(`select public.fn_dtv_thap_ghi_mon($1,'song_con','Toán','',12,2,9000) j`, [uidA]))[0].j
  ok(!!thap.luot_id, 'ghi tháp: có luot_id')
  const n = (await q(`select public.fn_dtv_ghi_cau($1,'Toán','bot','tron',$2,null,$3::jsonb) n`, [uidA, tran.tran_id, JSON.stringify([
    { thu_tu: 1, ma_cau: 'X1', cau_id: 'x1', de: 'Đề 1', tra_loi: 'a', dung: true, ms: 3100 }, { thu_tu: 2, ma_cau: 'X2', de: 'Đề 2', tra_loi: '', dung: false, ms: 12000 }])]))[0].n
  ok(n === 2, 'ghi nhật ký 2 câu theo lô')
  const nl = (await q(`select count(*)::int n, bool_and(hoc_sinh_id = $2) ok from dtv_cau_log where tran_id = $1`, [tran.tran_id, A.hs]))[0]
  ok(nl.n === 2 && nl.ok, 'dtv_cau_log.hoc_sinh_id đúng và gắn trận')
  const n2 = (await q(`select public.fn_dtv_ghi_cau($1,'Toán','song_con','',null,$2,$3::jsonb) n`, [uidA, thap.luot_id, JSON.stringify([{ thu_tu: 1, ma_cau: 'T1', dung: true, ms: 2000 }])]))[0].n
  ok(n2 === 1, 'ghi nhật ký câu gắn lượt tháp')

  // bảo vệ: người khác / ẩn danh KHÔNG dùng được hồ sơ hs_*
  if (B) {
    const e1 = await loi(() => q(`select public.fn_dtv_ghi_tran_mon($1,'Toán','bot','tron','thang',5,10,500,'')`, ['hs_' + B.hs]))
    ok(!!e1 && /quyền/.test(e1), 'A KHÔNG ghi được vào hồ sơ của B: ' + e1)
    const e2 = await loi(() => q(`select public.fn_dtv_ho_so($1)`, ['hs_' + B.hs]))
    ok(!!e2, 'A không đọc được hồ sơ B: ' + e2)
  }
  await jwt(null)
  const e3 = await loi(() => q(`select public.fn_dtv_ghi_tran_mon($1,'Toán','bot','tron','thang',5,10,500,'')`, [uidA]))
  ok(!!e3 && /quyền/.test(e3), 'ẩn danh (không phiên) KHÔNG ghi được vào hồ sơ hs_*: ' + e3)
  const e4 = await loi(() => q(`select public.fn_dtv_ghi_cau($1,'Toán','bot','tron',null,null,'[]'::jsonb)`, [uidA]))
  ok(!!e4, 'ẩn danh không ghi được nhật ký hs_*: ' + e4)
  await jwt(A.uid)
  const e5 = await loi(() => q(`select public.fn_dtv_ghi_cau($1,'Toán','bot','tron',$2,null,'[{"thu_tu":1,"dung":true}]'::jsonb)`, [uidA, '00000000-0000-0000-0000-000000000000']))
  ok(!!e5, 'gắn nhật ký vào trận không thuộc về em bị chặn: ' + e5)

  // hồ sơ MÁY (demo cũ) vẫn chạy như trước, không cần phiên
  await jwt(null)
  await q(`select public.fn_dtv_ho_so_luu('dtest_device_001','Bé Máy','tham_hiem_nam')`)
  const t2 = (await q(`select public.fn_dtv_ghi_tran_mon('dtest_device_001','Tiếng Anh','bot','tron','thua',3,10,200,'') j`))[0].j
  ok(t2.xp_nhan >= 0 && !!t2.tran_id, 'hồ sơ máy (demo) vẫn hoạt động, không cần đăng nhập')
  const hs0 = (await q(`select hoc_sinh_id from dtv_tran where id = $1`, [t2.tran_id]))[0]
  ok(hs0.hoc_sinh_id === null, 'trận của hồ sơ máy: hoc_sinh_id = NULL (không gắn học sinh)')
  await jwt(A.uid)
  const bx = (await q(`select public.fn_dtv_thap_bxh_mon('song_con','Toán','',true,$1) j`, [uidA]))[0].j
  ok(bx.toi && bx.toi.tang === 12, 'BXH tháp (của em) vẫn đọc được, thấy hạng của chính em')
  const anon = (await q(`select has_function_privilege('anon','public.fn_dtv_ho_so_hs(text)','execute') a, has_function_privilege('anon','public._dtv_kiem_uid(text)','execute') b`))[0]
  ok(!anon.a && !anon.b, 'anon không gọi được fn_dtv_ho_so_hs / _dtv_kiem_uid')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
