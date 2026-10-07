// Chạy thử mig 202610071018 (thành tựu giai đoạn 1) trong 1 transaction rồi ROLLBACK — dữ liệu giả, không ghi gì.
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
  await c.query(fs.readFileSync('supabase/migrations/202610071018_thanh_tuu_moi_giai_doan_1.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const tk = (await q(`select tk.id uid, tk.hoc_sinh_id hs, hl.lop_id from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc'
                       join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' join lop l on l.id = hl.lop_id and l.mon = 'Toán' where not exists (select 1 from bai_lam x join bai_test y on y.id = x.bai_test_id where x.hoc_sinh_id = h.id and y.luyen_yeu) limit 1`))[0]
  const hom = (await q(`select (now() at time zone 'Asia/Ho_Chi_Minh')::date::text d`))[0].d
  console.log('hôm nay', hom)
  await c.query(`update nhiem_vu_cau_hinh set bat_dau = '2026-10-01' where mon='Toán'`)
  await c.query(`update thanh_tuu_bac set nguong = 50 where ma='TT08' and bac=1`)
  // d1, d2 đạt · 1 lượt TRƯỢT (3/10) ngày 2 · d3..d7 đạt + 3 lượt thêm ngày 7  ⇒ TT07: chuỗi 2 rồi 8 (bậc 3 & 5 có, 10 không)
  const ngay = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07']
  await luot(tk.hs, tk.lop_id, ngay[0], 9, 8); await luot(tk.hs, tk.lop_id, ngay[1], 9, 8)
  await luot(tk.hs, tk.lop_id, ngay[1], 15, 3)
  for (const d of ngay.slice(2)) await luot(tk.hs, tk.lop_id, d, 9, 8)
  for (let i = 0; i < 3; i++) await luot(tk.hs, tk.lop_id, ngay[6], 10 + i, 8)

  const dd = await q(`select ma, bac, mon, dat_at::text from public._tt_dat_duoc($1) order by ma, bac`, [tk.hs])
  console.table(dd)
  const has = (ma, bac) => dd.some(x => x.ma === ma && x.bac === bac)
  ok(has('TT05', 1) && !has('TT05', 2), 'TT05: chuỗi 7 ngày ⇒ bậc 1 (7), chưa bậc 2 (14)')
  ok(has('TT06', 1) && !has('TT06', 2), 'TT06: 7 ngày nhiệm vụ liên tiếp ⇒ bậc 1')
  ok(has('TT07', 1) && has('TT07', 2) && !has('TT07', 3), 'TT07: chuỗi đạt 8 liên tiếp ⇒ bậc 3 và 5, chưa bậc 10 (lượt trượt cắt chuỗi cũ)')
  ok(has('TT08', 1) && !has('TT08', 2), 'TT08: hạ ngưỡng bậc 1 còn 50 câu ⇒ có; bậc 2 (2.000) chưa')

  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.uid, role: 'authenticated' })])
  const moi = (await q(`select public.fn_thanh_tuu_chot() j`))[0].j
  console.log('mới ghi:', moi.map(x => `${x.ma}#${x.bac}+${x.exp}`).join(' · '))
  const tongExp = moi.reduce((a, x) => a + x.exp, 0)
  ok(moi.length === dd.length, `ghi đủ ${dd.length} bậc`)
  const lai = (await q(`select public.fn_thanh_tuu_chot() j`))[0].j
  ok(lai.length === 0, 'chốt lần 2 KHÔNG ghi thêm (idempotent)')
  const ym = hom.slice(0, 7)
  const ea = (await q(`select * from public.fn_exp_app_thang($1, $2, 'Toán')`, [ym, tk.hs]))[0]
  console.log('exp_app:', ea)
  ok(ea && ea.exp_thanh_tuu === tongExp, `EXP thành tựu vào pipeline = ${tongExp}`)
  const ct = (await q(`select public.fn_thanh_tuu_cua_toi() j`))[0].j
  ok(ct.loai.length === 15 && ct.mua === '2026-27', 'fn_thanh_tuu_cua_toi: 15 loại, mùa 2026-27')
  const t15 = ct.loai.find(x => x.ma === 'TT15'); ok(t15.ten === 'Thành tựu ẩn' && !JSON.stringify(t15).includes('Master'), 'TT15 ẩn: không lộ tên/mô tả')
  const t5 = ct.loai.find(x => x.ma === 'TT05'); ok(t5.tien_do === 7 && t5.bac[0].dat === true, 'TT05: tiến độ 7, bậc 1 đã đạt')
  const anon = (await q(`select has_function_privilege('anon','public.fn_thanh_tuu_chot()','execute') a, has_function_privilege('anon','public.fn_thanh_tuu_cua_toi()','execute') b,
                         has_function_privilege('authenticated','public._tt_dat_duoc(uuid)','execute') c`))[0]
  ok(!anon.a && !anon.b && !anon.c, 'anon không gọi được; hàm nội bộ _tt_dat_duoc không mở cho authenticated')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
