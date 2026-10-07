// Chạy thử mig 202610070954 (bảng xếp hạng) trong 1 transaction rồi ROLLBACK — dữ liệu giả, không ghi gì.
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
    const tc = (await q(`insert into bai_test_cau (bai_test_id, thu_tu, loai_cau, ma_dang) values ($1,$2,'tn','DANG_THU_1') returning id`, [bt, i + 1]))[0].id
    await q(`insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, verdict, cham_at) values ($1,$2,$3,$4::timestamptz - interval '1 second')`, [bl, tc, i < dung ? 'correct' : 'wrong', nop])
  }
}
const bxh = async (loai, pv = 'khoi', ky = null) => (await q(`select public.fn_bxh($1,'Toán',$2,$3) j`, [loai, pv, ky]))[0].j
try {
  await c.query('begin'); await c.query("set local statement_timeout = '600s'")
  await c.query(fs.readFileSync('supabase/migrations/202610070954_bang_xep_hang.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const tk = (await q(`select tk.id uid, tk.hoc_sinh_id hs, hl.lop_id, h.khoi from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc'
                       join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' join lop l on l.id = hl.lop_id and l.mon = 'Toán' where h.khoi = '9' limit 1`))[0]
  const ban = (await q(`select h.id hs, hl.lop_id from hoc_sinh h join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id and hl.trang_thai='dang_hoc' join lop l on l.id=hl.lop_id and l.mon='Toán'
                        where h.khoi = '9' and h.trang_thai = 'dang_hoc' and h.id <> $1 limit 1`, [tk.hs]))[0]
  const hom = (await q(`select (now() at time zone 'Asia/Ho_Chi_Minh')::date::text d`))[0].d
  await c.query(`update nhiem_vu_cau_hinh set bat_dau = '2026-10-01' where mon='Toán'`)
  for (let i = 0; i < 3; i++) await luot(tk.hs, tk.lop_id, hom, 9 + i, 8)
  await luot(ban.hs, ban.lop_id, hom, 9, 9)
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.uid, role: 'authenticated' })])

  const dm = (await q(`select public.fn_bxh_danh_muc() j`))[0].j
  ok(dm.length === 8 && dm.filter(x => x.san_sang).length === 5, 'danh mục 8 bảng, 5 sẵn sàng')
  const a1 = await bxh('A1')
  console.log('A1', JSON.stringify(a1).slice(0, 400))
  ok(a1.toi?.hang === 1 && Number(a1.toi.gia_tri) === 3 && a1.top[0].la_toi === true, 'A1: em 3 lượt đứng hạng 1 trên bạn 1 lượt')
  ok(a1.top.some(x => x.ma_hs && x.lop) && a1.top.length <= 20, 'A1: top có tên + lớp, ≤ 20 dòng')
  const a1b = await bxh('A1', 'toan_bk')
  ok(a1b.tong >= a1.tong, `A1 Toàn BK (${a1b.tong}) ≥ Khối (${a1.tong})`)
  const a2 = await bxh('A2', 'khoi', 'thang')
  ok(Number(a2.toi?.gia_tri) === 24 + 0 && a2.toi.hang === 1 || Number(a2.toi?.gia_tri) === 24, 'A2: em 24 câu đúng (3 lượt × 8)')
  const a3 = await bxh('A3'); console.log('A3 tong', a3.tong, 'toi', a3.toi)
  ok(a3.toi && Number(a3.toi.gia_tri) === 100, 'A3: 1 dạng 30 câu đúng 80% ⇒ đạt 100% dạng đã đo')
  const a5 = await bxh('A5'); console.log('A5 tong', a5.tong, 'toi', a5.toi)
  ok(a5.toi && Number(a5.toi.gia_tri) >= 1, 'A5: chuỗi của em ≥ 1 ngày')
  const b1 = await bxh('B1'); console.log('B1 tong', b1.tong)
  ok(typeof b1.tong === 'number', 'B1 chạy được')
  const a4 = await bxh('A4'); ok(a4.san_sang === false, 'A4 "Sắp có"')
  for (const [loai, pv, ky, nhan] of [['A3', 'khoi', 'tuan', 'kỳ sai'], ['A1', 'lop', null, 'phạm vi sai'], ['ZZ', 'khoi', null, 'bảng không tồn tại']]) {
    let loi = null; try { await c.query('savepoint s'); await bxh(loai, pv, ky) } catch (e) { loi = e.message; await c.query('rollback to savepoint s') }
    ok(!!loi, `${nhan} bị chặn: ${loi}`)
  }
  const anon = (await q(`select has_function_privilege('anon','public.fn_bxh(text,text,text,text)','execute') a, has_function_privilege('anon','public.fn_bxh_danh_muc()','execute') b`))[0]
  ok(!anon.a && !anon.b, 'anon KHÔNG gọi được fn_bxh / fn_bxh_danh_muc')
  const t0 = Date.now(); await bxh('A5', 'toan_bk'); console.log('A5 Toàn BK:', Date.now() - t0, 'ms')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
