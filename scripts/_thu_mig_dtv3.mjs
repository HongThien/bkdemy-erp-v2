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
  await c.query(fs.readFileSync('supabase/migrations/202610071335_dtv_may_chu_cham_thap.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const [A, B] = await q(`select tk.id uid, tk.hoc_sinh_id hs from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc' limit 2`)
  await jwt(A.uid)
  const hs = (await q(`select public.fn_dtv_ho_so_hs() j`))[0].j; const uid = hs.uid
  const khoi = (await q(`select public.fn_dtv_kho_khoi('Toán') j`))[0].j.sort((a, b) => b.so_cau - a.so_cau)[0].khoi
  console.log('khối thử:', khoi)
  const de = (await q(`select public.fn_dtv_de_moi($1,'Toán','song_con',$2,null) j`, [uid, khoi]))[0].j
  ok(!!de.de_id && de.so_cau >= 5 && de.giay_goc === 40 && de.nhom === khoi, `đề mới: ${de.so_cau} câu, nhóm ${de.nhom}`)
  const e0 = await loi(() => q(`select public.fn_dtv_cham($1,$2,1,0,2000)`, [uid, de.de_id]))
  ok(!!e0 && /chưa bắt đầu/.test(e0), 'trả lời trước khi bắt đầu bị chặn: ' + e0)
  await q(`select public.fn_dtv_de_bat_dau($1,$2)`, [uid, de.de_id])
  const lo = (await q(`select public.fn_dtv_de_lay($1,$2,1,5) j`, [uid, de.de_id]))[0].j
  ok(lo.length === 5 && lo.every(x => x.opts?.length === 4 && !('dung' in x) && !('giai' in x)), 'phát 5 câu KHÔNG kèm đáp án/lời giải')
  const dap = async (k) => (await q(`select public._dtv_kho_cau_mot('Toán', $1) j`, [lo[k].ma_cau]))[0].j   // chỉ để TEST biết đáp án đúng (hàm nội bộ, cần quyền owner)
  const d1 = await dap(0), d2 = await dap(1)
  const e1 = await loi(() => q(`select public.fn_dtv_cham($1,$2,2,0,2000)`, [uid, de.de_id]))
  ok(!!e1 && /thứ tự/.test(e1), 'nhảy cóc câu 2 bị chặn: ' + e1)
  const r1 = (await q(`select public.fn_dtv_cham($1,$2,1,$3,2500) j`, [uid, de.de_id, d1.dung]))[0].j
  ok(r1.dung === true && r1.dung_idx === d1.dung && r1.so_dung === 1, 'câu 1 chọn ĐÚNG ⇒ máy chủ chấm đúng')
  const e2 = await loi(() => q(`select public.fn_dtv_cham($1,$2,1,$3,2500)`, [uid, de.de_id, d1.dung]))
  ok(!!e2, 'trả lời lại câu 1 bị chặn: ' + e2)
  const r2 = (await q(`select public.fn_dtv_cham($1,$2,2,$3,3000) j`, [uid, de.de_id, (d2.dung + 1) % 4]))[0].j
  ok(r2.dung === false && r2.dung_idx === d2.dung && r2.so_sai === 1, 'câu 2 chọn SAI ⇒ máy chủ chấm sai, trả đáp án đúng')
  const log = await q(`select thu_tu, dung, nguon_cham, ms, dap_an from dtv_cau_log where de_id = $1 order by thu_tu`, [de.de_id])
  ok(log.length === 2 && log.every(x => x.nguon_cham === 'server') && log[0].ms >= 150, 'nhật ký ghi nguon_cham = server (2 dòng)')
  // Người khác không dùng được đề
  if (B) { await jwt(B.uid); const e3 = await loi(() => q(`select public.fn_dtv_cham($1,$2,3,0,1000)`, ['hs_' + B.hs, de.de_id])); ok(!!e3, 'học sinh khác KHÔNG chấm/phát vào đề của em: ' + e3); await jwt(A.uid) }
  const ket = (await q(`select public.fn_dtv_thap_ket($1,$2) j`, [uid, de.de_id]))[0].j
  ok(ket.tang === 1 && ket.sai === 1 && !!ket.luot_id && ket.xp_nhan === 2, `kết: tầng ${ket.tang} (máy chủ đếm), sai ${ket.sai}, +${ket.xp_nhan} XP`)
  const luot = (await q(`select nguon_cham, tang, de_id from dtv_thap_luot where id = $1`, [ket.luot_id]))[0]
  ok(luot.nguon_cham === 'server' && luot.de_id === de.de_id, 'dtv_thap_luot ghi nguon_cham = server + de_id')
  const ket2 = (await q(`select public.fn_dtv_thap_ket($1,$2) j`, [uid, de.de_id]))[0].j
  ok(ket2.luot_id === ket.luot_id && ket2.xp_nhan === 0, 'kết lần 2 idempotent (cùng lượt, không cộng thêm)')
  const e4 = await loi(() => q(`select public.fn_dtv_cham($1,$2,3,0,1000)`, [uid, de.de_id]))
  ok(!!e4 && /kết thúc/.test(e4), 'sau khi kết thúc không nhận câu nữa: ' + e4)
  const nl = (await q(`select count(*)::int n from dtv_thap_luot where de_id = $1`, [de.de_id]))[0].n
  ok(nl === 1, 'đúng 1 lượt tháp cho 1 đề')

  // Sinh tồn quá giờ
  const de2 = (await q(`select public.fn_dtv_de_moi($1,'Toán','song_con',$2,null) j`, [uid, khoi]))[0].j
  await q(`select public.fn_dtv_de_bat_dau($1,$2)`, [uid, de2.de_id])
  await c.query(`update dtv_de set bat_dau_at = clock_timestamp() - interval '400 seconds' where id = $1`, [de2.de_id])
  const rg = (await q(`select public.fn_dtv_cham($1,$2,1,0,1000) j`, [uid, de2.de_id]))[0].j
  ok(rg.het_gio === true, 'Sinh tồn: trả lời sau 5 phút ⇒ het_gio, không ghi')
  // Vô tận: sai ⇒ rơi; quá giờ câu ⇒ rơi
  const de3 = (await q(`select public.fn_dtv_de_moi($1,'Toán','vo_tan',$2,null) j`, [uid, khoi]))[0].j
  await q(`select public.fn_dtv_de_bat_dau($1,$2)`, [uid, de3.de_id])
  const l3 = (await q(`select public.fn_dtv_de_lay($1,$2,1,3) j`, [uid, de3.de_id]))[0].j
  const x1 = (await q(`select public._dtv_kho_cau_mot('Toán', $1) j`, [l3[0].ma_cau]))[0].j
  await c.query(`update dtv_de set bat_dau_at = clock_timestamp() - interval '70 seconds' where id = $1`, [de3.de_id])
  const rv = (await q(`select public.fn_dtv_cham($1,$2,1,$3,1000) j`, [uid, de3.de_id, x1.dung]))[0].j
  ok(rv.dung === false && rv.het_gio === true, 'Vô tận: đúng nhưng QUÁ GIỜ câu (70s > 40s) ⇒ tính là rơi')
  const e5 = await loi(() => q(`select public.fn_dtv_cham($1,$2,2,0,1000)`, [uid, de3.de_id]))
  ok(!!e5, 'đã rơi thì không trả lời tiếp: ' + e5)
  // Chưa đăng nhập / hồ sơ máy không có đề chấm
  await jwt(null)
  const e6 = await loi(() => q(`select public.fn_dtv_de_moi('dtest_may','Toán','song_con',$1,null)`, [khoi]))
  ok(!!e6, 'hồ sơ máy (demo) không có đề chấm ở máy chủ: ' + e6)
  const anon = (await q(`select has_function_privilege('anon','public.fn_dtv_cham(text,uuid,integer,integer,integer)','execute') a, has_function_privilege('anon','public._dtv_kho_cau_mot(text,text)','execute') b, has_function_privilege('authenticated','public._dtv_kho_cau_mot(text,text)','execute') c`))[0]
  ok(!anon.a && !anon.b && !anon.c, 'anon không gọi được fn_dtv_cham; hàm đọc đáp án KHÔNG mở cho anon/authenticated')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
