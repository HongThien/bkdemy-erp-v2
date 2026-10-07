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
  await c.query(fs.readFileSync('supabase/migrations/202610071317_dtv_nhat_ky_bo_sung.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const [A, B] = await q(`select tk.id uid, tk.hoc_sinh_id hs from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc' limit 2`)
  await jwt(A.uid)
  const h1 = (await q(`select public.fn_dtv_ho_so_hs() j`))[0].j
  ok(h1.uid === 'hs_' + A.hs && JSON.stringify(h1.so_nho) === '{}', 'ho_so_hs trả kèm so_nho rỗng lần đầu')
  const nho = { t1: { gap: 3, nhanh: 2, muc: 'dang_nho', cuoi: 1, han: 2, giay: 2.5, lyDo: 'Đúng nhanh' } }
  await q(`select public.fn_dtv_so_nho_luu($1, $2::jsonb)`, [h1.uid, JSON.stringify(nho)])
  const h2 = (await q(`select public.fn_dtv_ho_so_hs() j`))[0].j
  ok(h2.so_nho.t1 && h2.so_nho.t1.gap === 3, 'sổ nhớ lưu theo tài khoản và đọc lại được (đổi máy vẫn thấy)')
  const e1 = await loi(() => q(`select public.fn_dtv_so_nho_luu($1, '{}'::jsonb)`, ['hs_' + (B ? B.hs : '00000000-0000-0000-0000-000000000000')]))
  ok(!!e1, 'lưu sổ nhớ vào hồ sơ người khác bị chặn: ' + e1)
  const e2 = await loi(() => q(`select public.fn_dtv_so_nho_luu('dmay_001', '{}'::jsonb)`))
  ok(!!e2, 'hồ sơ máy (không phải tài khoản) không lưu sổ nhớ: ' + e2)
  const e3 = await loi(() => q(`select public.fn_dtv_so_nho_luu($1, '[]'::jsonb)`, [h1.uid]))
  ok(!!e3, 'dữ liệu sai kiểu bị chặn: ' + e3)
  const tr = (await q(`select public.fn_dtv_ghi_tran_mon($1,'Tiếng Anh','bot','tron','thang',6,10,500,'') j`, [h1.uid]))[0].j
  const n = (await q(`select public.fn_dtv_ghi_cau($1,'Tiếng Anh','bot','tron',$2,null,$3::jsonb) n`, [h1.uid, tr.tran_id, JSON.stringify([{ thu_tu: 1, ma_cau: 'w1', cau_id: 'w1', tu_id: 'w1', de: 'apple', dap_an: 'quả táo', tra_loi: 'quả cam', dung: false, ms: 4200 }])]))[0].n
  const row = (await q(`select dap_an, tu_id, tra_loi, dung from dtv_cau_log where tran_id = $1`, [tr.tran_id]))[0]
  ok(n === 1 && row.dap_an === 'quả táo' && row.tu_id === 'w1' && row.tra_loi === 'quả cam' && row.dung === false, 'nhật ký lưu đáp án đúng + id từ + câu em chọn')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
