// Chạy thử mig 202610261847 TRONG ROLLBACK: số dòng đổi / còn cũ từng bảng + mastery mới 4 lớp trước/sau.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const BANG = ['gami_session_problems', 'bai_test_cau', 'tu_luyen_dang_lan', 'ca_test_cau', 'bai_test_dang_phat_hanh', 'buoi_danh_gia_dang', 'canh_bao_yeu']
try {
  await q('begin'); await q('set local statement_timeout = 0')
  const lops = await q(`select l.ten_lop, (select array_agg(hoc_sinh_id) from hoc_sinh_lop where lop_id = l.id and trang_thai = 'dang_hoc') hs from lop l where l.ten_lop in ('6A1','7A1','9A1','11A1') and l.mon = 'Toán'`)
  const cells = async () => { const o = {}; for (const l of lops) o[l.ten_lop] = await q(`select hoc_sinh_id, ma_dang, round(score, 4) s, n from fn_mastery_cells_bdm($1, true) order by 1, 2`, [l.hs]); return o }
  const truoc = await cells()
  const t = Date.now()
  await q(fs.readFileSync('supabase/migrations/202610261847_lich_su_doi_ma_dang_sang_ndb_dot1.sql', 'utf8').replace(/on commit drop/g, ''))
  console.log('mig', Date.now() - t, 'ms · mã cũ có đích:', (await q(`select count(*)::int n from _ma`))[0].n, '/', (await q(`select count(*)::int n from _cu`))[0].n)
  for (const b of BANG) {
    const [r] = await q(`select count(*) filter (where ma_dang_cu is not null)::int doi, count(*) filter (where ma_dang in (select ma_dang from _cu))::int con_cu from ${b}`)
    console.log(b.padEnd(26), 'đổi', String(r.doi).padStart(6), '· còn mã cũ K6–12', String(r.con_cu).padStart(6))
  }
  const sau = await cells()
  for (const l of lops) {
    const a = truoc[l.ten_lop], b = sau[l.ten_lop]
    const ka = new Map(a.map((r) => [r.hoc_sinh_id + r.ma_dang, r.s + '/' + r.n])), kb = new Map(b.map((r) => [r.hoc_sinh_id + r.ma_dang, r.s + '/' + r.n]))
    let khac = 0; for (const [k, v] of kb) if (ka.get(k) !== v) khac++
    for (const k of ka.keys()) if (!kb.has(k)) khac++
    console.log(`${l.ten_lop}: ô trước ${a.length} · sau ${b.length} · khác ${khac}`)
  }
  // phát hành khớp câu
  console.log('phát hành lệch câu:', (await q(`select count(*)::int n from bai_test_dang_phat_hanh p where p.ma_dang_cu is not null and not exists (select 1 from bai_test_cau t where t.bai_test_id = p.bai_test_id and t.ma_dang = p.ma_dang)`))[0].n)
} catch (e) { console.log('LỖI', e.message) } finally { await q('rollback'); await c.end() }
