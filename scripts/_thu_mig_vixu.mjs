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
  await c.query(fs.readFileSync('supabase/migrations/202610071216_vi_xu_nguon_moi.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const tk = (await q(`select tk.id uid, tk.hoc_sinh_id hs, hl.lop_id from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc'
                       join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' join lop l on l.id = hl.lop_id and l.mon = 'Toán'
                       where not exists (select 1 from bai_lam x join bai_test y on y.id = x.bai_test_id where x.hoc_sinh_id = h.id and y.luyen_yeu)
                         and not exists (select 1 from thanh_tuu_dat t where t.hoc_sinh_id = h.id) limit 1`))[0]
  await c.query(`update nhiem_vu_cau_hinh set bat_dau = '2026-10-01' where mon='Toán'`)
  for (const d of ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07']) await luot(tk.hs, tk.lop_id, d, 9, 8)
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.uid, role: 'authenticated' })])
  await q(`select public.fn_thanh_tuu_nhan('TT05', 1)`)
  const v = (await q(`select public.fn_hs_vi_xu_cua_toi() j`))[0].j
  const hd = v.hoat_dong
  const tt = hd.find(x => x.nguon === 'exp_thanh_tuu'); const nv = hd.find(x => x.nguon === 'exp_nhiem_vu')
  console.log('thanh tuu:', tt, '\nnhiem vu:', nv)
  ok(tt && tt.so === 100 && tt.ten === 'Chuỗi làm bài' && tt.bac === 1, 'Ví có dòng THÀNH TỰU: Chuỗi làm bài · bậc 1 · +100 EXP')
  ok(nv && nv.dht === 190 && !('cap' in nv) && !('so_ruong' in nv), 'dòng NHIỆM VỤ trả ĐHT (7 lượt × 20 + việc tuần 50 = 190) thay cấp/rương')
  ok(v.so_du !== undefined && Array.isArray(v.lich_su_mua), 'cấu trúc cũ (so_du, lich_su_mua) giữ nguyên')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
