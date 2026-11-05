// Kiểm mig 202611051603 (kho trên lớp Hình–Học) TRONG ROLLBACK: node scripts/_test_hh_kho_lop.mjs
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t, ct = '') => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t, ct) }
const loiKhi = async (s, a) => { await q('savepoint s'); try { await q(s, a); await q('release savepoint s'); return null } catch (e) { await q('rollback to savepoint s'); return e.message } }
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  // một bài học có ≥2 câu kho luyện
  const [b] = await q(`select b.ma_bai, b.khoi from hinh_hoc_bai b
    where (select count(*) from hinh_hoc_cau_hoi q where q.dang_chinh = b.ma_bai and q.xoa_at is null) >= 2 order by b.ma_bai limit 1`)
  const cs = (await q(`select ma_cau from hinh_hoc_cau_hoi where dang_chinh = $1 and xoa_at is null order by ma_cau limit 2`, [b.ma_bai])).map((r) => r.ma_cau)
  console.log('bài', b.ma_bai, 'khối', b.khoi, 'câu luyện', cs)

  const [t] = await q(`select * from fn_hh_lop_them($1, 'giang', '{"noi_dung":"Cho tam giác ABC…","ghi_chu":"mở bài"}'::jsonb)`, [b.ma_bai])
  kt(/^HHL\d{6}$/.test(t.ma_cau) && t.thu_tu === 0 && t.ghi_chu === 'mở bài', 'thêm: mã HHL + thứ tự 0', t.ma_cau)
  const ch = await q(`select * from fn_hh_lop_chep_tu_kho($1, 'giang', $2)`, [b.ma_bai, cs])
  kt(ch.length === 2 && ch[0].thu_tu === 1 && ch[1].thu_tu === 2 && ch[0].nguon_ma_cau === cs[0], 'chép 2 câu kho luyện, nối cuối chuỗi, nhớ nguồn')
  await q(`select fn_hh_lop_xep($1, 'luyen', $2)`, [b.ma_bai, [ch[0].ma_cau]])
  const ds = await q(`select ma_cau, vai, thu_tu from fn_hh_lop_cua_dang($1)`, [b.ma_bai])
  kt(ds.length === 3 && ds.find((x) => x.ma_cau === ch[0].ma_cau)?.vai === 'luyen', 'xếp: chuyển câu sang vai luyện')
  const [d] = await q(`select * from fn_hh_lop_dem($1) where dang_bai_id = $2`, [b.khoi, b.ma_bai])
  kt(d?.so_giang === 2 && d?.so_luyen === 1, 'đếm theo khối', JSON.stringify(d))
  const [{ j }] = await q(`select fn_hh_lop_cua_bai($1) j`, [b.ma_bai])
  kt(j.length === 3 && 'so_lan_dung' in j[0], 'builder: câu của bài + số lần dùng')
  kt(!!(await loiKhi(`update hinh_hoc_cau_lop set ma_cau = 'X' where ma_cau = $1`, [t.ma_cau])), 'mã gốc không đổi được')
  kt(!!(await loiKhi(`select fn_hh_lop_xep($1, 'luyen', array['LOP000001'])`, [b.ma_bai])), 'xếp câu bài khác ⇒ chặn')
  kt(!!(await loiKhi(`select * from fn_hh_lop_chep_tu_kho($1, 'giang', array['KHONG_CO'])`, [b.ma_bai])), 'chép câu không có ⇒ chặn')
  kt(!!(await loiKhi(`delete from hinh_hoc_bai where ma_bai = $1`, [b.ma_bai])), 'xoá bài còn câu kho trên lớp ⇒ DB chặn')

  // ── builder giáo trình Hình (mig 202611051610): phần bài học nhận câu HHL, nội dung đọc được ──
  const [ph] = await q(`select p.id, p.ref_ma, p.tai_lieu_id from tai_lieu_phan p join tai_lieu t on t.id = p.tai_lieu_id
    where p.loai_phan = 'dang' and t.ban_do = 'moi' and t.nhanh = 'hinh' and t.luu_tru_tu is null
      and exists (select 1 from hinh_hoc_bai hb where hb.ma_bai = p.ref_ma) limit 1`)
  if (!ph) console.log('  (bỏ qua: chưa có giáo trình Hình nào có phần bài học)')
  else {
    const [x] = await q(`select * from fn_hh_lop_them($1, 'giang', '{"noi_dung":"Câu giảng thử builder"}'::jsonb)`, [ph.ref_ma])
    const [lk] = await q(`select ma_cau from hinh_hoc_cau_hoi where dang_chinh = $1 and xoa_at is null limit 1`, [ph.ref_ma])
    const truoc = (await q(`select ma_cau from tai_lieu_cau where phan_id = $1 order by thu_tu`, [ph.id])).map((r) => r.ma_cau)
    const loiDat = await loiKhi(`select fn_tl_hh_dat_cau($1, $2)`, [ph.id, [x.ma_cau, ...(lk ? [lk.ma_cau] : [])]])
    kt(!loiDat, 'đặt câu HHL + câu kho luyện vào phần bài học', loiDat ?? '')
    const [{ nd }] = await q(`select fn_tl_hl_noi_dung($1) nd`, [ph.tai_lieu_id])
    const caus = nd.buoi.flatMap((bu) => bu.hoc).find((h) => h.phan_id === ph.id)?.caus ?? []
    const c0 = caus.find((c) => c.ma_cau === x.ma_cau)
    kt(c0?.noi_dung === 'Câu giảng thử builder' && c0?.kho_lop === true && c0?.con_trong_kho === true, 'nội dung câu HHL hiện trong builder')
    const [kl] = await q(`select ma_cau from hinh_hoc_cau_lop where dang_bai_id <> $1 and xoa_at is null limit 1`, [ph.ref_ma])
    const [y] = kl ? [kl] : await q(`select * from fn_hh_lop_them((select ma_bai from hinh_hoc_bai where ma_bai <> $1 limit 1), 'giang', '{"noi_dung":"bài khác"}'::jsonb)`, [ph.ref_ma])
    kt(!!(await loiKhi(`select fn_tl_hh_dat_cau($1, $2)`, [ph.id, [y.ma_cau]])), 'câu HHL của bài khác ⇒ chặn')
    console.log('  (phần', ph.id, 'trước có', truoc.length, 'câu — ROLLBACK trả lại nguyên)')
  }
} finally { await q('rollback'); await c.end() }
console.log(`\n${ok} đạt · ${sai} sai (đã ROLLBACK, DB không đổi)`)
process.exit(sai ? 1 : 0)
