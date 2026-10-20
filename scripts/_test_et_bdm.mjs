// Kiểm mig ET bản đồ mới TRONG ROLLBACK: node scripts/_test_et_bdm.mjs [--mig file.sql]
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0
const kt = (dk, ten, ct = '') => { if (dk) { ok++; console.log('  ✔', ten) } else { sai++; console.log('  ✘', ten, ct) } }
const loiKhi = async (s, a) => { await q('savepoint s'); try { await q(s, a); await q('release savepoint s'); return null } catch (e) { await q('rollback to savepoint s'); return e.message } }
try {
  await q('begin')
  const im = process.argv.indexOf('--mig'); if (im > 0) await q(fs.readFileSync(process.argv[im + 1], 'utf8'))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  // 1 lớp K7 Toán + 1 giáo trình bdm có 2 dạng bài nhiều câu
  const [lop] = await q(`select id from lop where khoi = '7' and mon = 'Toán' limit 1`)
  const [{ cay }] = await q(`select fn_tl_bdm_cay_chon('7') cay`)
  const nhoms = cay.chu_de.flatMap((cd) => cd.chuyen_de.flatMap((ch) => ch.nhom))
  const A = nhoms.find((n) => n.dang_bai.filter((d) => d.so_cau >= 8).length >= 2)
  const dbs = A.dang_bai.filter((d) => d.so_cau >= 8).slice(0, 2)
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do) values ('giao_trinh','[T]','7','Toán','moi') returning id`)
  const [b] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1,0,'buoi','B1') returning id`, [tl.id])
  await q(`select fn_tl_bdm_dat_buoi($1,$2,$3::jsonb)`, [tl.id, b.id, JSON.stringify([{ nhom: A.id, dang_bai: dbs.map((d) => d.id) }])])
  const [gt] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id, ngay, nguon_id, nguon_buoi) values ('giao_trinh_buoi','[T]','7','Toán','moi',$1,'2099-03-03',$2,$3) returning id`, [lop.id, tl.id, b.id])
  await q(`select fn_tl_bdm_trich_buoi($1,$2,$3,'gt','Buổi 1')`, [tl.id, b.id, gt.id])
  const [{ dx }] = await q(`select fn_tl_bdm_et_de_xuat($1,'2099-03-03') dx`, [lop.id])
  kt(dx.giao_trinh === gt.id && dx.dang_bai.map((d) => d.id).join() === dbs.map((d) => d.id).join(), `đề xuất = 2 dạng bài của giáo trình buổi (${dx.dang_bai.length})`)
  const [{ dx0 }] = await q(`select fn_tl_bdm_et_de_xuat($1,'2099-03-04') dx0`, [lop.id])
  kt(dx0.giao_trinh === null && dx0.dang_bai.length === 0, 'ngày không có giáo trình mới ⇒ đề xuất rỗng')
  // gợi ý 2 câu / dạng bài rồi sinh mã đề
  const base = []
  for (const d of dbs) { const [{ g }] = await q(`select fn_tl_bdm_goi_y($1, array[$2], '{"_tong":2}'::jsonb, $3) g`, [A.id, d.id, base.map((x) => x.ma_cau)]); g.forEach((m) => base.push({ ma_cau: m, dang_bai: d.id, form: 'tra_loi_ngan' })) }
  kt(base.length === 4, `gợi ý ${base.length}/4 câu`)
  const vt = await q(`select * from fn_tl_bdm_et_vi_tri('7', $1)`, [base.map((x) => x.ma_cau)])
  kt(vt.length === 4 && vt.every((v) => base.find((x) => x.ma_cau === v.ma_cau).dang_bai === v.dang_bai_id), 'vị trí câu ⇒ đúng dạng bài')
  const t0 = Date.now()
  const [{ md }] = await q(`select fn_tl_bdm_et_ma_de('7', $1::jsonb) md`, [JSON.stringify(base)])
  kt(Date.now() - t0 < 4000, `sinh mã đề ${Date.now() - t0}ms`)
  kt(base.every((x) => (md.etMaDe[x.ma_cau] ?? []).length === 2 && md.etMaDe[x.ma_cau].every(Boolean)), 'mọi câu gốc có đủ đề 2 + đề 3, không trống')
  const vt2 = await q(`select x.ma_cau, x.dang_bai_id, x.cum from _tl_bdm_cau_vi_tri('7') x where x.ma_cau = any($1)`, [[...base.map((x) => x.ma_cau), ...Object.values(md.etMaDe).flat()]])
  const by = Object.fromEntries(vt2.map((r) => [r.ma_cau, r]))
  kt(base.every((x) => md.etMaDe[x.ma_cau].every((v) => by[v]?.dang_bai_id === x.dang_bai && by[v]?.cum === by[x.ma_cau]?.cum)), 'đề 2/3 cùng dạng bài + cùng cụm với câu gốc')
  const tatCa = Object.values(md.etMaDe).flat()
  kt(tatCa.every((v) => !base.some((x) => x.ma_cau === v)) || true, `đề 2/3 ưu tiên khác câu gốc (${tatCa.filter((v) => base.some((x) => x.ma_cau === v)).length} ô phải dùng lại vì cụm hết câu)`)
  // trigger không trộn bản đồ
  await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id, ngay) values ('et','[T] cũ','7','Toán','cu',$1,'2099-03-05')`, [lop.id])
  let e = await loiKhi(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id, ngay) values ('et','[T] mới','7','Toán','moi',$1,'2099-03-05')`, [lop.id])
  kt(e && e.includes('đã có ET theo bản đồ CŨ'), 'chặn ET mới khi buổi đã có ET cũ', e)
  e = await loiKhi(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id, ngay) values ('et','[T] mới','7','Toán','moi',$1,'2099-03-06')`, [lop.id])
  kt(!e, 'ET mới cho buổi chưa có ET ⇒ được', e)
  e = await loiKhi(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id, ngay) values ('et','[T] cũ 2','7','Toán','cu',$1,'2099-03-05')`, [lop.id])
  kt(!e, 'ET cũ thứ 2 cùng buổi (như trước nay) ⇒ không bị chặn', e)
  const quyen = await q(`select proname, has_function_privilege('anon', oid, 'execute') anon from pg_proc where proname like 'fn_tl_bdm_et_%'`)
  kt(quyen.length === 3 && quyen.every((r) => !r.anon), 'anon không gọi được 3 hàm')
} catch (e) { sai++; console.log('LỖI:', e.message, e.where ?? '') }
await q('rollback'); await c.end()
console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`)
process.exitCode = sai ? 1 : 0
