// Kiểm mig 202610241000 (bổ trợ theo bản đồ của CA) TRONG ROLLBACK: node scripts/_test_bo_tro_ban_do_ca.mjs [--mig]
// TẮT: điền dạng yếu + đề xuất cho ca cũ y hệt trước. BẬT: ca mới tự 'moi' ⇒ dạng NDB có tên; ca cũ vẫn mã cũ; gợi ý mới ra NDB.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
const J = (x) => JSON.stringify(x)
const JS = (dx) => J({ ...dx, chi_tiet: dx.chi_tiet.map(J).sort() })   // thứ tự chi_tiet không mang nghĩa
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const caCu = (await q(`select y.id from bo_tro_yeu y join hoc_sinh h on h.id = y.hoc_sinh_id where y.trang_thai = 'dang_xu' and y.mon = 'Toán' and h.khoi in ('7','8','9') order by y.created_at desc limit 5`)).map((r) => r.id)
  const doc = async () => ({
    dx: (await q(`select fn_btyeu_de_xuat_dang_moi('Toán', null, false) x`))[0].x,
    yeu: (await q(`select coalesce(jsonb_agg(t order by t::text), '[]') x from bo_tro_yeu y cross join lateral fn_btyeu_dang_yeu_2_cua_so(y.hoc_sinh_id, y.mon) t where y.id = any($1)`, [caCu]))[0].x,
  })
  const truoc = await doc()
  if (process.argv.includes('--mig')) await q(fs.readFileSync('supabase/migrations/202610241000_bo_tro_theo_ban_do_cua_ca.sql', 'utf8'))
  const tat = await doc()
  kt(JS(truoc.dx) === JS(tat.dx), `TẮT ⇒ đề xuất dạng mới y hệt trước (${truoc.dx.chi_tiet.length} dòng)`)
  kt(J(truoc.yeu) === J(tat.yeu), 'TẮT ⇒ dạng yếu 2 cửa sổ (bản cũ) y hệt trước')
  kt((await q(`select count(*) filter (where ban_do <> 'cu')::int n from bo_tro_yeu`))[0].n === 0, 'mọi ca hiện có = cu')
  // BẬT + mở 1 ca mới cho HS K7 có nhiều lượt đo, chưa có ca đang xử
  await q(`select fn_he_thong_cong_tac_dat('mastery_ban_do_moi', true)`)
  const [hs] = await q(`select h.id, (select hl.lop_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' and l.mon = 'Toán' limit 1) lop
                         from hoc_sinh h where h.khoi = '7' and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = h.id and y.trang_thai = 'dang_xu')
                           and (select count(*) from gami_grades g where g.hoc_sinh_id = h.id) > 80
                           and exists (select 1 from fn_btyeu_dang_yeu_2_cua_so_moi(h.id, 'Toán')) limit 1`)
  const [caMoi] = await q(`insert into bo_tro_yeu (hoc_sinh_id, lop_id, mon, nguon, ly_do, trang_thai, ban_do) values ($1, $2, 'Toán', 'tay', 'test', 'dang_xu', 'cu') returning id, ban_do`, [hs.id, hs.lop])
  kt(caMoi.ban_do === 'moi', `ca mở khi BẬT tự nhận ban_do = moi (truyền 'cu' vẫn bị đè: ${caMoi.ban_do})`)
  const n = (await q(`select fn_btyeu_fill_dang_yeu($1) n`, [caMoi.id]))[0].n
  const dang = await q(`select d.ma_dang, _kho_ten_dang('Toán', d.ma_dang) ten from bo_tro_yeu_dang d where d.bo_tro_yeu_id = $1`, [caMoi.id])
  kt(n > 0 && dang.every((d) => !/^T[13]\d/.test(d.ma_dang)) && dang.some((d) => /^NDB/.test(d.ma_dang)) && dang.every((d) => d.ten),
    `ca mới: điền ${n} dạng yếu, bản đồ mới, có tên (${dang.slice(0, 3).map((d) => d.ma_dang + ' ' + d.ten).join(' · ')})`)
  for (const id of caCu) await q(`select fn_btyeu_fill_dang_yeu($1)`, [id])
  const ndbCu = (await q(`select count(*)::int n from bo_tro_yeu_dang where bo_tro_yeu_id = any($1) and ma_dang like 'NDB%'`, [caCu]))[0].n
  kt(ndbCu === 0, `BẬT ⇒ ca CŨ điền dạng vẫn mã cũ (${caCu.length} ca, 0 NDB)`)
  const dx = (await q(`select fn_btyeu_de_xuat_dang_moi('Toán', $1, false) x`, [caMoi.id]))[0].x
  kt(dx.chi_tiet.every((r) => !/^T[13]\d/.test(r.ma_dang)), `đề xuất cho ca mới không có mã Đại/HGT cũ (${dx.chi_tiet.length} dòng)`)
  const gy = await q(`select * from fn_btyeu_dang_goi_y_moi($1, 'Toán')`, [hs.id])
  kt(gy.length > 0 && gy.some((r) => /^NDB/.test(r.ma_dang)) && gy.every((r) => r.ten_dang), `gợi ý "+ Thêm dạng" ca mới: ${gy.length} dạng, NDB có tên`)
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
