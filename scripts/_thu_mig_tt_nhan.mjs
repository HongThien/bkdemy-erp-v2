// Chạy thử mig 202610071126 (thành tựu: đạt → bấm NHẬN QUÀ) trong 1 transaction rồi ROLLBACK — dữ liệu giả.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const ok = (cond, msg) => console.log((cond ? '  ✔ ' : '  ✖ ') + msg)
let seq = 0
async function luot(em, lop, d, h, dung) {
  const nop = `${d} ${String(h).padStart(2, '0')}:${String(10 + (seq++ % 40)).padStart(2, '0')}:00+07`
  const bt = (await q(`insert into bai_test (lop_id, ngay, loai, mon, hoc_sinh_id, so_cau, luyen_yeu) values ($1,$2,'tu_luyen','Toán',$3,10,true) returning id`, [lop, d, em]))[0].id
  const bl = (await q(`insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at, nop_at) values ($1,$2,'da_nop',$3::timestamptz - interval '400 seconds', $3) returning id`, [bt, em, nop]))[0].id
  for (let i = 0; i < 10; i++) {
    const tc = (await q(`insert into bai_test_cau (bai_test_id, thu_tu, loai_cau) values ($1,$2,'tn') returning id`, [bt, i + 1]))[0].id
    await q(`insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, verdict, cham_at) values ($1,$2,$3,$4::timestamptz - interval '1 second')`, [bl, tc, i < dung ? 'correct' : 'wrong', nop])
  }
}
try {
  await c.query('begin'); await c.query("set local statement_timeout = '600s'")
  await c.query(fs.readFileSync('supabase/migrations/202610071126_thanh_tuu_nhan_qua.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const tk = (await q(`select tk.id uid, tk.hoc_sinh_id hs, hl.lop_id from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc'
                       join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' join lop l on l.id = hl.lop_id and l.mon = 'Toán'
                       where not exists (select 1 from bai_lam x join bai_test y on y.id = x.bai_test_id where x.hoc_sinh_id = h.id and y.luyen_yeu)
                         and not exists (select 1 from thanh_tuu_dat t where t.hoc_sinh_id = h.id) limit 1`))[0]
  await c.query(`update nhiem_vu_cau_hinh set bat_dau = '2026-10-01' where mon='Toán'`)
  const ngay = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07']
  for (const d of ngay) await luot(tk.hs, tk.lop_id, d, 9, 8)    // 7 ngày, mỗi ngày 1 lượt đạt ⇒ TT05 b1, TT06 b1, TT07 b1,b2 (3,5), 7 lượt
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.uid, role: 'authenticated' })])

  const ct0 = (await q(`select public.fn_thanh_tuu_cua_toi() j`))[0].j
  const l = (ma) => ct0.loai.find(x => x.ma === ma)
  console.log('cho_nhan', ct0.cho_nhan, 'tien_do', JSON.stringify(ct0.tien_do))
  ok(ct0.cho_nhan === 3, 'ô Thành tựu có chỉ số: 3 thẻ chờ nhận (TT05, TT06, TT07)')
  ok(ct0.tien_do.TT05 === 7 && ct0.tien_do.TT06 === 7 && ct0.tien_do.TT07 === 7 && ct0.tien_do.TT04 === 0, 'tiến độ TT04..TT07 = 0/7/7/7')
  ok(l('TT05').bac[0].co_the_nhan === true && l('TT05').bac[0].dat === false && l('TT05').bac[1].co_the_nhan === false, 'TT05: bậc 1 chờ nhận, bậc 2 chưa')
  ok(ct0.tong_exp_mua === 0, 'CHƯA nhận ⇒ EXP mùa vẫn 0 (không tự thưởng)')
  const chot = (await q(`select public.fn_thanh_tuu_chot() j`))[0].j
  ok(chot.length === 0, 'fn_thanh_tuu_chot (app cũ) KHÔNG còn tự ghi sổ')
  const ym = ngay[6].slice(0, 7)
  let ea = (await q(`select * from public.fn_exp_app_thang($1, $2, 'Toán')`, [ym, tk.hs]))[0]
  ok(!ea || ea.exp_thanh_tuu === 0, 'pipeline EXP chưa có EXP thành tựu trước khi nhận')

  const n1 = (await q(`select public.fn_thanh_tuu_nhan('TT05', 1) j`))[0].j
  console.log('nhận TT05#1:', n1)
  ok(n1.moi === true && n1.exp === 100 && n1.ten === 'Chuỗi làm bài', 'nhận TT05 bậc 1: +100 EXP, moi=true')
  const n2 = (await q(`select public.fn_thanh_tuu_nhan('TT05', 1) j`))[0].j
  ok(n2.moi === false && n2.exp === 0, 'nhận lần 2: moi=false, không cộng thêm (idempotent)')
  let loi = null; try { await c.query('savepoint s'); await q(`select public.fn_thanh_tuu_nhan('TT05', 2)`) } catch (e) { loi = e.message; await c.query('rollback to savepoint s') }
  ok(!!loi, 'nhận bậc chưa đạt bị chặn: ' + loi)
  let loi2 = null; try { await c.query('savepoint s2'); await q(`select public.fn_thanh_tuu_nhan('TT13', 1)`) } catch (e) { loi2 = e.message; await c.query('rollback to savepoint s2') }
  ok(!!loi2, 'nhận thành tựu chưa mở (TT13) bị chặn: ' + loi2)
  ea = (await q(`select * from public.fn_exp_app_thang($1, $2, 'Toán')`, [ym, tk.hs]))[0]
  ok(ea && ea.exp_thanh_tuu === 100, 'sau khi nhận: EXP thành tựu vào pipeline = 100')
  const ct1 = (await q(`select public.fn_thanh_tuu_cua_toi() j`))[0].j
  ok(ct1.cho_nhan === 2 && ct1.tong_exp_mua === 100 && ct1.loai.find(x => x.ma === 'TT05').bac[0].dat === true, 'sau nhận: còn 2 thẻ chờ, EXP mùa 100, bậc 1 dat=true')
  const cn = (await q(`select public.fn_thanh_tuu_cho_nhan() n`))[0].n
  ok(cn === 2, 'fn_thanh_tuu_cho_nhan = 2 (chỉ số trên ô)')
  const t15 = ct1.loai.find(x => x.ma === 'TT15'); ok(t15.ten === 'Thành tựu ẩn', 'TT15 vẫn ẩn')
  const anon = (await q(`select has_function_privilege('anon','public.fn_thanh_tuu_nhan(text,integer)','execute') a, has_function_privilege('anon','public.fn_thanh_tuu_cho_nhan()','execute') b`))[0]
  ok(!anon.a && !anon.b, 'anon không gọi được')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
