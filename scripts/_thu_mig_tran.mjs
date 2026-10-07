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
  await c.query(fs.readFileSync('supabase/migrations/202610071526_dtv_may_chu_cham_tran.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const [A, B] = await q(`select tk.id uid, tk.hoc_sinh_id hs from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc' limit 2`)
  await jwt(A.uid)
  const uid = (await q(`select public.fn_dtv_ho_so_hs() j`))[0].j.uid
  const khoi = (await q(`select public.fn_dtv_kho_khoi('Toán') j`))[0].j.sort((a, b) => b.so_cau - a.so_cau)[0].khoi
  const de = (await q(`select public.fn_dtv_de_tran_moi($1,'Toán',$2,'tron',5) j`, [uid, khoi]))[0].j
  ok(!!de.de_id && de.so_cau === 5, 'đề trận 5 câu dựng ở máy chủ')
  const lo = (await q(`select public.fn_dtv_de_lay($1,$2,1,5) j`, [uid, de.de_id]))[0].j
  ok(lo.length === 5 && lo.every(x => !('dung' in x) && !('giai' in x)), 'phát 5 câu KHÔNG kèm đáp án')
  const dap = async (k) => (await q(`select public._dtv_kho_cau_mot('Toán',$1) j`, [lo[k].ma_cau]))[0].j
  const cham = (k, idx, ms = 2500) => q(`select public.fn_dtv_cham_tran($1,$2,$3,$4,$5) j`, [uid, de.de_id, k, idx, ms]).then(r => r[0].j)
  const d1 = await dap(0), d2 = await dap(1), d4 = await dap(3), d5 = await dap(4)
  const r1 = await cham(1, d1.dung); ok(r1.dung === true, 'câu 1 đúng')
  const r2 = await cham(2, (d2.dung + 1) % 4); ok(r2.dung === false && r2.dung_idx === d2.dung, 'câu 2 sai ⇒ trả đáp án đúng')
  const e1 = await loi(() => cham(3, -1)); ok(!!e1 && /Chưa hết lượt/.test(e1), 'bỏ qua QUÁ SỚM (<2s) bị chặn — không xem đáp án hàng loạt: ' + e1)
  await c.query(`update dtv_de set cau_cuoi_at = clock_timestamp() - interval '3 seconds' where id = $1`, [de.de_id])
  const r3 = await cham(3, -1); ok(r3.dung === false && Number.isInteger(r3.dung_idx), 'bỏ qua sau ≥2s: mất câu + xem đáp án')
  const r4 = await cham(4, d4.dung); ok(r4.dung === true, 'câu 4 đúng')
  const r5 = await cham(5, (d5.dung + 2) % 4); ok(r5.dung === false, 'câu 5 sai')
  const e2 = await loi(() => cham(6, 0)); ok(!!e2, 'câu thứ 6 không tồn tại / sai thứ tự: ' + e2)
  const ket = (await q(`select public.fn_dtv_tran_ket($1,$2,'thang',640,'Boss Thùy') j`, [uid, de.de_id]))[0].j
  console.log('kết:', ket.xp_nhan, 'XP · tran', ket.tran_id)
  ok(!!ket.tran_id && ket.xp_nhan === 2 * 5 + 40, `XP theo số câu đúng do MÁY CHỦ đếm (2 đúng ⇒ 50 XP) — có ${ket.xp_nhan}`)
  const t = (await q(`select so_dung, so_cau, nguon_cham, de_id, hoc_sinh_id from dtv_tran where id = $1`, [ket.tran_id]))[0]
  ok(t.so_dung === 2 && t.so_cau === 5 && t.nguon_cham === 'server' && t.de_id === de.de_id && t.hoc_sinh_id === A.hs, 'dtv_tran: 2/5 đúng, nguon_cham=server, gắn đề + học sinh')
  const n = (await q(`select count(*)::int n, count(*) filter (where tran_id = $2)::int g from dtv_cau_log where de_id = $1`, [de.de_id, ket.tran_id]))[0]
  ok(n.n === 5 && n.g === 5, 'nhật ký 5 câu đã gắn vào trận')
  const ket2 = (await q(`select public.fn_dtv_tran_ket($1,$2,'thang',640,'x') j`, [uid, de.de_id]))[0].j
  ok(ket2.xp_nhan === 0 && ket2.tran_id === ket.tran_id, 'kết lần 2 idempotent (không cộng XP)')
  const e3 = await loi(() => cham(1, 0)); ok(!!e3 && /kết thúc/.test(e3), 'sau khi kết thúc không nhận câu nữa: ' + e3)
  // đề tháp ≠ đề trận
  const thap = (await q(`select public.fn_dtv_de_moi($1,'Toán','song_con',$2,null) j`, [uid, khoi]))[0].j
  const e4 = await loi(() => q(`select public.fn_dtv_cham_tran($1,$2,1,0,1000)`, [uid, thap.de_id]))
  ok(!!e4 && /không phải trận/.test(e4), 'đề THÁP không chấm được bằng hàm TRẬN: ' + e4)
  const e5 = await loi(() => q(`select public.fn_dtv_cham($1,$2,1,0,1000)`, [uid, de.de_id]))
  ok(!!e5, 'đề TRẬN không chấm được bằng hàm THÁP: ' + e5)
  if (B) { await jwt(B.uid); const e6 = await loi(() => q(`select public.fn_dtv_cham_tran($1,$2,1,0,1000)`, ['hs_' + B.hs, de.de_id])); ok(!!e6, 'học sinh khác không dùng được đề: ' + e6) }
  await c.query(fs.readFileSync('supabase/migrations/202610071540_dtv_khoa_kho_bo_cau.sql', 'utf8'))
  const p = (await q(`select has_function_privilege('anon','public.fn_dtv_kho_bo_cau(text,text,text,integer,text,boolean)','execute') a, has_function_privilege('authenticated','public.fn_dtv_kho_bo_cau(text,text,text,integer,text,boolean)','execute') b,
                             has_function_privilege('anon','public.fn_dtv_cham_tran(text,uuid,integer,integer,integer)','execute') c`))[0]
  ok(!p.a && !p.b && !p.c, 'fn_dtv_kho_bo_cau (lộ đáp án) ĐÃ KHOÁ với anon/authenticated; anon không chấm trận được')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
