// Kiểm fn_bdm_dang_cua_cau TRONG ROLLBACK: node scripts/_test_bdm_dang_cua_cau.mjs [--mig file.sql]
// Câu K6–12 đã có dạng bài ⇒ đúng NDB của _do_o_bdm; câu cấp 1 / câu không quy được ⇒ không dòng; tắt công tắc ⇒ rỗng;
// không phải nhân sự ⇒ rỗng. Kèm: ô lưới chấm đã đổi NDB (mig 202610261847) khớp hàm ⇒ client không ghi ngược mã cũ.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0
const kt = (dk, ten, ct = '') => { if (dk) { ok++; console.log('  ✔', ten) } else { sai++; console.log('  ✘', ten, ct) } }
try {
  await q('begin')
  const im = process.argv.indexOf('--mig'); if (im > 0) await q(fs.readFileSync(process.argv[im + 1], 'utf8'))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const k9 = (await q(`select q.ma_cau, d.dang_bai_id from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
                         join bdm_cau_dang d on d.kho = 'dai' and d.ma_cau = q.ma_cau where b.khoi = '9' and q.xoa_at is null limit 5`))
  const hgt = (await q(`select h.ma_cau, d.dang_bai_id from hgt_cau_hoi h join bdm_cau_dang d on d.kho = 'hgt' and d.ma_cau = h.ma_cau limit 3`))
  const c1 = (await q(`select q.ma_cau from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh where b.khoi = '5' and q.xoa_at is null limit 3`)).map((r) => r.ma_cau)
  const mas = [...k9.map((r) => r.ma_cau), ...hgt.map((r) => r.ma_cau), ...c1, 'KHONG_CO', null]
  const t0 = Date.now()
  const rs = await q(`select * from fn_bdm_dang_cua_cau($1)`, [mas])
  const m = new Map(rs.map((r) => [r.ma_cau, r.ma_dang]))
  kt(Date.now() - t0 < 2000, `thời gian ${Date.now() - t0}ms cho ${mas.length} mã`)
  kt(k9.every((r) => m.get(r.ma_cau) === r.dang_bai_id), `câu Đại K9 ⇒ đúng dạng bài (${k9.length})`)
  kt(hgt.every((r) => m.get(r.ma_cau) === r.dang_bai_id), `câu HGT ⇒ đúng dạng bài (${hgt.length})`)
  kt(c1.every((x) => !m.has(x)) && !m.has('KHONG_CO'), 'cấp 1 + mã lạ ⇒ không dòng')
  kt(rs.every((r) => r.ma_dang.startsWith('NDB')), 'chỉ trả NDB')
  // ô lưới chấm đã đổi mã đợt 1 ⇒ hàm trả đúng mã đang nằm trong ô (client không còn ghi ngược)
  const o = await q(`select ma_cau, ma_dang from gami_session_problems where ma_dang_cu is not null and ma_cau is not null order by random() limit 200`)
  const ro = new Map((await q(`select * from fn_bdm_dang_cua_cau($1)`, [o.map((x) => x.ma_cau)])).map((r) => [r.ma_cau, r.ma_dang]))
  const lech = o.filter((x) => ro.get(x.ma_cau) !== x.ma_dang)
  kt(lech.length === 0, `ô đã đổi NDB khớp hàm ${o.length - lech.length}/${o.length}`, JSON.stringify(lech.slice(0, 3)))
  // tắt công tắc ⇒ rỗng
  await q(`update he_thong_cong_tac set bat = false where ma = 'mastery_ban_do_moi'`)
  kt((await q(`select * from fn_bdm_dang_cua_cau($1)`, [mas])).length === 0, 'tắt công tắc ⇒ rỗng')
  await q(`update he_thong_cong_tac set bat = true where ma = 'mastery_ban_do_moi'`)
  // không phải nhân sự (claims rỗng) ⇒ rỗng
  await q("select set_config('request.jwt.claims', '{}', true)")
  kt((await q(`select * from fn_bdm_dang_cua_cau($1)`, [mas])).length === 0, 'không đăng nhập nhân sự ⇒ rỗng')
} catch (e) { sai++; console.log('LỖI', e.message) } finally { await q('rollback'); await c.end() }
console.log(`\n${ok} đúng · ${sai} sai`)
process.exit(sai ? 1 : 0)
