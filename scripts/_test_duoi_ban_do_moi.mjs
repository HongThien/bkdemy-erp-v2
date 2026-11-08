// Kiểm mig 202610261821 (bổ trợ ĐUỔI + học từ đầu sang bản đồ mới) TRONG ROLLBACK: node scripts/_test_duoi_ban_do_moi.mjs [--mig]
// Không --mig: chỉ đo thời gian các hàm như đang chạy. --mig: chụp TRƯỚC → áp file mig trong cùng transaction → chụp SAU → so + đo.
// Vai: admin = tai_khoan của nhan_su admin@gmail.com; HS = tai_khoan.hoc_sinh_id (jwt claims, KHÔNG set role).
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
const J = (x) => JSON.stringify(x)
const CAP1 = ['3', '4', '4T', '5', '5T']
const MIG = 'supabase/migrations/202610261821_duoi_hoc_tu_dau_ban_do_moi.sql'
const thoiGian = {}   // tên hàm → [ms…]
async function do_(ten, sql, a) { const t = Date.now(); const r = await q(sql, a); (thoiGian[ten] ??= []).push(Date.now() - t); return r }
const vai = async (sub) => q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub, role: 'authenticated' })])
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  const dots = await q(`select bd.id, bd.hoc_sinh_id hs, l.mon, l.khoi, (select tk.id from tai_khoan tk where tk.hoc_sinh_id = bd.hoc_sinh_id limit 1) tk,
                          (select array_agg(distinct hh.buoi_hoc_id) from buoi_hoc_hs hh where hh.bo_tro_duoi_id = bd.id) buois
                        from bo_tro_duoi bd join lop l on l.id = bd.lop_id where bd.trang_thai = 'can_duoi' order by l.khoi, bd.id`)
  const buois = [...new Set(dots.flatMap((d) => d.buois ?? []))]
  const chup = async () => {
    const o = { tt: {}, lt: {}, mo: {}, hs_tt: {}, dtt: {}, ca: null }
    await vai(ad.id)
    for (const d of dots) o.tt[d.id] = (await do_('fn_duoi_tien_trinh (TA/ERP)', 'select fn_duoi_tien_trinh($1) x', [d.hs]))[0].x
    for (const b of buois) o.dtt[b] = (await do_('fn_duoi_dang_trang_thai (TA)', 'select fn_duoi_dang_trang_thai($1) x', [b]))[0].x
    o.ca = (await do_('fn_duoi_ca_cua_toi (TA, admin)', 'select fn_duoi_ca_cua_toi() x'))[0].x
    for (const d of dots) {
      if (!d.tk) continue
      await vai(d.tk)
      o.mo[d.id] = (await do_('htd_co_mo (HS)', 'select htd_co_mo($1) x', [d.mon]))[0].x
      o.lt[d.id] = (await do_('htd_lo_trinh (HS)', 'select htd_lo_trinh($1) x', [d.mon]))[0].x
      o.hs_tt[d.id] = (await do_('fn_duoi_tien_trinh (HS)', 'select fn_duoi_tien_trinh() x'))[0].x
    }
    await vai(ad.id)
    return o
  }
  const truoc = await chup()
  if (!process.argv.includes('--mig')) {
    console.log('(không --mig: chỉ đo)')
  } else {
    const t0 = Date.now()
    await q(fs.readFileSync(MIG, 'utf8'))
    console.log(`  áp mig trong transaction: ${Date.now() - t0} ms`)
    const sau = await chup()
    // dữ liệu đã quy
    const [n] = await q(`select (select count(*) from bo_tro_duoi_dang y join bo_tro_duoi bd on bd.id = y.bo_tro_duoi_id where y.ma_dang_cu is not null and bd.trang_thai = 'can_duoi')::int dang_dang,
                                (select count(*) from bo_tro_duoi_dang y join bo_tro_duoi bd on bd.id = y.bo_tro_duoi_id where y.ma_dang_cu is not null and bd.trang_thai <> 'can_duoi')::int dang_xong,
                                (select count(*) from hoc_tu_dau_dang where ma_dang_cu is not null)::int htd,
                                (select count(*) from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id where bt.loai in ('htd_luyen','htd_test') and btc.ma_dang_cu is not null)::int btc`)
    console.log('  QUY:', J(n))
    const con = await q(`select l.khoi, count(*)::int n from bo_tro_duoi_dang y join bo_tro_duoi bd on bd.id = y.bo_tro_duoi_id join lop l on l.id = bd.lop_id
                          where bd.trang_thai = 'can_duoi' and l.mon = 'Toán' and y.ma_dang not like 'NDB%' and coalesce(l.khoi,'') <> all($1) group by 1 order by 1`, [CAP1])
    console.log('  CÒN MÃ CŨ (đợt đang đuổi Toán K6–12):', J(con))
    for (const d of dots) {
      const a = truoc.tt[d.id], b = sau.tt[d.id]
      const ta = (a ?? []).find((x) => x.bo_tro_duoi_id === d.id), tb = (b ?? []).find((x) => x.bo_tro_duoi_id === d.id)
      const cap1 = CAP1.includes(d.khoi) || d.mon !== 'Toán'
      if (cap1) {
        kt(J(a) === J(b) && J(truoc.lt[d.id]) === J(sau.lt[d.id]) && truoc.mo[d.id] === sau.mo[d.id] && J(truoc.hs_tt[d.id]) === J(sau.hs_tt[d.id]),
          `${d.mon} K${d.khoi} (${d.id.slice(0, 8)}): tiến trình + lộ trình + cổng y hệt trước`)
        continue
      }
      const ndb = (tb?.dangs ?? []).filter((x) => x.ma_dang.startsWith('NDB'))
      kt(ta?.tong === tb?.tong && ta?.xong === tb?.xong, `Toán K${d.khoi} (${d.id.slice(0, 8)}): giữ đủ ${tb?.tong} dạng, xong ${ta?.xong}→${tb?.xong}`)
      kt(ndb.every((x) => x.tren_app && x.ten_dang && x.ma_chuyen_de && x.ten_chu_de),
        `  ${ndb.length} dạng bài NDB đều trên app, có tên + chuyên đề${ndb[0] ? ` (vd ${ndb[0].ma_dang} ${ndb[0].ten_dang} · ${ndb[0].tong_cau} câu · ${ndb[0].trang_thai})` : ''}`)
      // dạng mã cũ còn lại: y hệt trước (bản đồ cũ không đổi)
      const cuA = Object.fromEntries((ta?.dangs ?? []).map((x) => [x.ma_dang, x]))
      const cuB = (tb?.dangs ?? []).filter((x) => !x.ma_dang.startsWith('NDB'))
      const lech = cuB.filter((x) => J(x) !== J(cuA[x.ma_dang]))
      // chấp nhận DUY NHẤT: dạng mã cũ đứng sau 1 dạng vừa sang bản đồ mới (khác chuyên đề) ⇒ hết bị khoá (khoa → toi_luot)
      const moKhoa = (x) => { const a = cuA[x.ma_dang]; return J({ ...x, mo: a.mo, trang_thai: a.trang_thai }) === J(a) && a.trang_thai === 'khoa' && x.trang_thai === 'toi_luot' }
      kt(lech.every(moKhoa), `  ${cuB.length} dạng mã cũ còn lại y hệt trước${lech.length ? ` (trừ ${lech.length} dạng hết khoá vì dạng đứng trước đã sang bản đồ mới)` : ''}`)
      for (const x of lech) console.log("     LỆCH", x.ma_dang, J(Object.fromEntries(Object.keys(x).filter((k) => J(x[k]) !== J(cuA[x.ma_dang]?.[k])).map((k) => [k, [cuA[x.ma_dang]?.[k], x[k]]]))))
      const tt = (tb?.dangs ?? []).map((x) => x.trang_thai)
      kt(tt.includes('toi_luot') || tt.includes('dang_hoc') || tt.every((s) => s === 'xong' || s === 'giay') || !tt.length, `  khoá tuần tự còn mở được dạng (${[...new Set(tt)].join(',')})`)
      if (d.tk) kt(sau.mo[d.id] === true || !(tb?.dangs ?? []).some((x) => x.tren_app), `  HS: cổng Học từ đầu mở = ${sau.mo[d.id]}`)
    }
    for (const b of buois) {
      const A = truoc.dtt[b], B = sau.dtt[b]
      kt(A.length === B.length && B.every((x) => typeof x.co_mcq === 'boolean'), `dạng × trạng thái buổi ${b.slice(0, 8)}: ${B.length} dòng, có MCQ ${B.filter((x) => x.co_mcq).length}`)
    }
    const dc = (await q(`select fn_duoi_dang_chon('Toán', '6') a, fn_duoi_dang_chon('Toán', '5') b, fn_duoi_dang_chon('KHTN', '9') k`))[0]
    kt(dc.a.ban_do === 'moi' && dc.a.dangs.length > 0 && dc.a.dangs.every((x) => x.ma_dang.startsWith('NDB')), `bộ chọn K6: bản đồ mới, ${dc.a.dangs.length} dạng bài`)
    kt(dc.b.ban_do === 'cu' && dc.k.ban_do === 'cu', 'bộ chọn K5 (cấp 1) + KHTN: giữ bộ chọn cũ')
    const md = (await q(`select _kho_muc_do_dang('Toán', ma_dang) m, muc_do from bdm_ban_do where muc_do is not null limit 1`))[0]
    kt(md && md.m === md.muc_do, `_kho_muc_do_dang đọc độ khó dạng bài NDB (${md?.m})`)
    // luồng HS trên 1 dạng bài NDB của đợt: đọc lý thuyết → sinh luyện → sinh test (câu mang mã NDB)
    const [x] = await q(`select bd.hoc_sinh_id hs, l.mon, y.ma_dang, (select tk.id from tai_khoan tk where tk.hoc_sinh_id = bd.hoc_sinh_id limit 1) tk
                           from bo_tro_duoi_dang y join bo_tro_duoi bd on bd.id = y.bo_tro_duoi_id join lop l on l.id = bd.lop_id
                          where bd.trang_thai = 'can_duoi' and y.ma_dang like 'NDB%' and exists (select 1 from tai_khoan tk where tk.hoc_sinh_id = bd.hoc_sinh_id)
                          order by (select count(*) from bdm_cau_hoi c where c.dang_chinh = y.ma_dang) desc limit 1`)
    if (x) {
      await vai(x.tk)
      const lt = (await do_('htd_ly_thuyet (HS)', 'select htd_ly_thuyet($1, $2) x', [x.mon, x.ma_dang]))[0].x
      kt(lt && 'noi_dung' in lt, `htd_ly_thuyet ${x.ma_dang}: ${lt.noi_dung ? 'có' : 'chưa có'} lý thuyết`)
      for (const loai of ['htd_luyen', 'htd_test']) {
        try {
          const s = (await do_(`tu_luyen_chu_de_sinh ${loai} (HS)`, 'select tu_luyen_chu_de_sinh($1, $2, $3) x', [x.mon, x.ma_dang, loai]))[0].x
          const id = s?.bai_test_id ?? s?.id
          const cs = id ? await q('select ma_dang from bai_test_cau where bai_test_id = $1', [id]) : []
          kt(cs.length > 0 && cs.every((r) => r.ma_dang === x.ma_dang), `sinh ${loai} ${x.ma_dang}: ${cs.length} câu mang mã dạng bài`)
        } catch (e) { kt(false, `sinh ${loai} ${x.ma_dang}: ${e.message}`) }
      }
      await vai(ad.id)
    }
  }
  console.log('\nTHỜI GIAN (ms, max / trung bình / số lần):')
  for (const [k, v] of Object.entries(thoiGian)) console.log(`  ${k.padEnd(38)} max ${String(Math.max(...v)).padStart(5)}  tb ${String(Math.round(v.reduce((s, x) => s + x, 0) / v.length)).padStart(5)}  n=${v.length}`)
} finally {
  await q('rollback'); await c.end()
  if (ok + sai) console.log(`\n${ok}/${ok + sai} đạt${sai ? ` — ${sai} SAI` : ''}`)
}
