// Chạy thử mig 202610011501 (lượt học thật + không lặp câu) trong 1 transaction rồi ROLLBACK — không ghi gì thật.
// node scripts/_thu_mig_luot_hoc_that.mjs
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  await c.query(fs.readFileSync('supabase/migrations/202610011501_luot_hoc_that_khong_lap_cau.sql', 'utf8'))
  console.log('✔ migration chạy được trong transaction')

  // 1) Lượt học thật 30 ngày — mọi HS có tự luyện
  const hsList = await q(`select distinct bl.hoc_sinh_id from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id where bt.loai='tu_luyen' and bl.nop_at > now()-interval '30 days'`)
  const tong = {}
  for (const { hoc_sinh_id } of hsList) for (const r of await q(`select tinh, coalesce(ly_do,'TÍNH') ly_do from public._luot_hoc_that($1, now()-interval '30 days', now())`, [hoc_sinh_id])) tong[r.ly_do] = (tong[r.ly_do] ?? 0) + 1
  console.log('Lượt luyện thêm 30 ngày theo kết quả:', tong, `(${hsList.length} em)`)

  // 2) Sinh 1 lượt Tổng hợp cho 1 HS thật (đóng vai HS qua jwt) — câu ra không được nằm trong tập đã gặp
  const hs = (await q(`select bl.hoc_sinh_id, tk.id tk, bt.mon from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id join tai_khoan tk on tk.hoc_sinh_id=bl.hoc_sinh_id
     where bt.loai='tu_luyen' and bl.nop_at > now()-interval '30 days' group by 1,2,3 order by count(*) desc limit 1`))[0]
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: hs.tk, role: 'authenticated' })])
  const dangs = (await q(`select t.ma_dang from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id join bai_test_cau t on t.bai_test_id=bt.id
     where bl.hoc_sinh_id=$1 and bt.loai='tu_luyen' and t.ma_dang is not null group by 1 order by count(*) desc limit 10`, [hs.hoc_sinh_id])).map((r) => r.ma_dang)
  const gapTruoc = new Set((await q(`select ma_cau from public._hs_cau_lan_gap($1)`, [hs.hoc_sinh_id])).map((r) => r.ma_cau))
  const kq = (await q(`select public.tu_luyen_sinh($1, $2::jsonb) v`, [hs.mon, JSON.stringify(dangs)]))[0].v
  const cau = (await q(`select ma_cau, ma_dang from bai_test_cau where bai_test_id=$1`, [kq.bai_test_id]))
  const lap = cau.filter((x) => gapTruoc.has(x.ma_cau))
  // dạng nào ra câu lặp thì kiểm: dạng đó còn câu chưa gặp không (nếu còn ⇒ SAI luật)
  for (const x of lap) {
    const tbl = (await q(`select public._kho_cau_tbl($1, public._kho_nhanh_cua_dang($1, $2)) t`, [hs.mon, x.ma_dang]))[0].t
    const dk = (await q(`select public._kho_dk_online_hs_sql($1) d`, [tbl]))[0].d
    const con = (await q(`select count(*)::int n from ${tbl} c where c.dang_chinh=$1 and c.xoa_at is null and ${dk} and not exists (select 1 from public._hs_cau_lan_gap($2) g where g.ma_cau=c.ma_cau)`, [x.ma_dang, hs.hoc_sinh_id]))[0].n
    console.log(`  câu lặp ${x.ma_cau} (dạng ${x.ma_dang}): dạng còn ${con} câu chưa gặp ${con ? '✖ SAI LUẬT' : '✔ (hết câu mới — đúng luật)'}`)
  }
  console.log(`Tổng hợp HS ${hs.hoc_sinh_id.slice(0, 8)}: ${cau.length} câu, ${lap.length} câu đã gặp trước`)

  // 3) Kết quả 1 lượt qua hàm cho app
  const blTruoc = (await q(`select bl.id from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id where bl.hoc_sinh_id=$1 and bt.loai='tu_luyen' and bl.trang_thai='da_nop' order by bl.nop_at desc limit 1`, [hs.hoc_sinh_id]))[0]
  console.log('fn_luot_hoc_that_ket_qua (lượt gần nhất):', JSON.stringify((await q(`select public.fn_luot_hoc_that_ket_qua($1) v`, [blTruoc.id]))[0].v))
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
