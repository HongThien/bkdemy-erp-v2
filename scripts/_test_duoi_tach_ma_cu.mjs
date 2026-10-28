// Kiểm mig 202610261929 (tách mã cũ mục tiêu đuổi → mọi dạng bài) TRONG ROLLBACK: node scripts/_test_duoi_tach_ma_cu.mjs [--mig]
// Chụp TRƯỚC → (--mig: áp file trong cùng transaction) → chụp SAU: số dòng, tiến trình từng đợt (tổng dạng · số xong khớp DB), cấp 1 y hệt, thời gian.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
const J = (x) => JSON.stringify(x)
const MIG = 'supabase/migrations/202610261929_duoi_tach_ma_cu_sang_dang_bai.sql'
const tg = {}
async function do_(ten, sql, a) { const t = Date.now(); const r = await q(sql, a); (tg[ten] ??= []).push(Date.now() - t); return r }
const vai = async (sub) => q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub, role: 'authenticated' })])
const DEM = `select (select count(*) from bo_tro_duoi_dang)::int dang, (select count(*) from bo_tro_duoi_dang where ma_dang_cu is not null)::int dang_quy,
  (select count(*) from hoc_tu_dau_dang)::int htd, (select count(*) from hoc_tu_dau_dang where ma_dang_cu is not null)::int htd_quy,
  (select count(*) from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id where bt.loai in ('htd_luyen','htd_test') and btc.ma_dang_cu is not null)::int btc_quy,
  (select count(*) from bo_tro_duoi_dang y join bo_tro_duoi bd on bd.id = y.bo_tro_duoi_id join lop l on l.id = bd.lop_id
    where bd.trang_thai = 'can_duoi' and l.mon = 'Toán' and y.ma_dang not like 'NDB%' and coalesce(l.khoi,'') not in ('3','4','4T','5','5T'))::int con_cu`
// số dạng + số xong của đợt tính thẳng từ bảng (nhân chứng độc lập với fn_duoi_tien_trinh)
const DB_DOT = `select count(*)::int tong, count(h.test_nop_at)::int xong from bo_tro_duoi_dang y join bo_tro_duoi bd on bd.id = y.bo_tro_duoi_id join lop l on l.id = bd.lop_id
  left join hoc_tu_dau_dang h on h.hoc_sinh_id = bd.hoc_sinh_id and h.mon = l.mon and h.ma_dang = y.ma_dang where bd.id = $1`
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  const dots = await q(`select bd.id, bd.hoc_sinh_id hs, l.mon, l.khoi, (select tk.id from tai_khoan tk where tk.hoc_sinh_id = bd.hoc_sinh_id limit 1) tk
                        from bo_tro_duoi bd join lop l on l.id = bd.lop_id where bd.trang_thai = 'can_duoi' order by l.khoi, bd.id`)
  const chup = async () => {
    const o = { tt: {}, lt: {}, db: {} }
    await vai(ad.id)
    for (const d of dots) {
      o.tt[d.id] = ((await do_('fn_duoi_tien_trinh (TA/ERP)', 'select fn_duoi_tien_trinh($1) x', [d.hs]))[0].x ?? []).find((x) => x.bo_tro_duoi_id === d.id)
      o.db[d.id] = (await q(DB_DOT, [d.id]))[0]
    }
    for (const d of dots) if (d.tk) { await vai(d.tk); o.lt[d.id] = (await do_('htd_lo_trinh (HS)', 'select htd_lo_trinh($1) x', [d.mon]))[0].x; await do_('fn_duoi_tien_trinh (HS)', 'select fn_duoi_tien_trinh() x') }
    await vai(ad.id)
    return o
  }
  const dem0 = (await q(DEM))[0]
  const truoc = await chup()
  console.log('  TRƯỚC:', J(dem0))
  if (process.argv.includes('--mig')) {
    const t0 = Date.now(); await q(fs.readFileSync(MIG, 'utf8')); console.log(`  áp mig: ${Date.now() - t0} ms`)
  }
  const dem1 = (await q(DEM))[0]
  console.log('  SAU  :', J(dem1))
  const sau = await chup()
  const cap1 = (d) => ['3', '4', '4T', '5', '5T'].includes(d.khoi) || d.mon !== 'Toán'
  for (const d of dots) {
    const a = truoc.tt[d.id], b = sau.tt[d.id], db = sau.db[d.id]
    if (cap1(d)) { kt(J(a) === J(b) && J(truoc.lt[d.id]) === J(sau.lt[d.id]), `${d.mon} K${d.khoi} ${d.id.slice(0, 8)}: y hệt trước`); continue }
    kt(b?.tong === db.tong && b?.xong === db.xong, `Toán K${d.khoi} ${d.id.slice(0, 8)}: tiến trình ${a?.tong} dạng/${a?.xong} xong → ${b?.tong}/${b?.xong} (khớp bảng ${db.tong}/${db.xong})`)
    const ndb = (b?.dangs ?? []).filter((x) => x.ma_dang.startsWith('NDB'))
    kt(ndb.every((x) => x.tren_app && x.ten_dang && x.ma_chuyen_de), `   ${ndb.length} dạng bài NDB trên app, có tên + chuyên đề; còn ${(b?.dangs ?? []).length - ndb.length} mã cũ`)
  }
  if (process.argv.includes('--mig')) {
    // mỗi mã cũ đã tách: đợt có ĐỦ mọi dạng bài đích; dạng cũ đã xong ⇒ các dạng bài của nó đều xong
    const thieu = await q(`select y.bo_tro_duoi_id, y.ma_dang_cu from bo_tro_duoi_dang y where y.ma_dang_cu is not null and y.ma_dang like 'NDB%'
      and exists (select 1 from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id join bo_tro_duoi bd on bd.id = y.bo_tro_duoi_id
                  where bt.hoc_sinh_id = bd.hoc_sinh_id and bt.loai in ('htd_luyen','htd_test') and btc.ma_dang_cu = y.ma_dang_cu
                    and not exists (select 1 from bo_tro_duoi_dang y2 where y2.bo_tro_duoi_id = y.bo_tro_duoi_id and y2.ma_dang = btc.ma_dang))`)
    kt(thieu.length === 0, `mọi câu bài làm đã đổi đều có dạng bài tương ứng trong đợt (lệch ${thieu.length})`)
    const xongLech = await q(`select h0.ma_dang_cu from hoc_tu_dau_dang h0 where h0.ma_dang_cu is not null
      group by h0.hoc_sinh_id, h0.mon, h0.ma_dang_cu having count(distinct (h0.test_nop_at is not null)) > 1`)
    kt(xongLech.length === 0, `dạng cũ tách ra: các dạng bài cùng trạng thái xong (lệch ${xongLech.length})`)
    const trung = await q(`select bo_tro_duoi_id, ma_dang from bo_tro_duoi_dang group by 1, 2 having count(*) > 1`)
    kt(trung.length === 0, 'không dòng mục tiêu trùng')
  }
  console.log('\nTHỜI GIAN (ms):')
  for (const [k, v] of Object.entries(tg)) console.log(`  ${k.padEnd(30)} max ${String(Math.max(...v)).padStart(5)}  n=${v.length}`)
} finally {
  await q('rollback'); await c.end()
  if (ok + sai) console.log(`\n${ok}/${ok + sai} đạt${sai ? ` — ${sai} SAI` : ''}`)
}
