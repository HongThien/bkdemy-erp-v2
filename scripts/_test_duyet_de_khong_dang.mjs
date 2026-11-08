// Kiểm mig 202610202045 (duyệt đề không đòi phân dạng) TRONG ROLLBACK: node scripts/_test_duyet_de_khong_dang.mjs [--mig file]
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
  // đề Toán chưa duyệt, đủ đáp án, có câu Đại ở dạng chờ chưa duyệt
  const des = await q(`select t.id, t.ten from tai_lieu t where t.loai = 'de_thi' and t.mon = 'Toán' and t.duyet_at is null order by t.created_at desc limit 80`)
  let de = null, cauCho = []
  for (const d of des) {
    const [{ v }] = await q(`select fn_de_thi_thieu($1) v`, [d.id]); if (+v.so_chan) continue
    const cs = await q(`select c.ma_cau from fn_de_thi_cau($1) c join dai_cau_hoi h on h.ma_cau = c.ma_cau where c.kho = 'dai' and _kho_la_dang_cho(h.dang_chinh) and not h.da_duyet`, [d.id])
    if (cs.length) { de = d; cauCho = cs.map((x) => x.ma_cau); break }
  }
  kt(!!de, `tìm được đề chờ duyệt có ${cauCho.length} câu dạng chờ (${de?.ten?.slice(0, 50)})`)
  const [{ r }] = await q(`select fn_de_thi_duyet($1) r`, [de.id])
  const tong = (await q(`select count(*)::int n from fn_de_thi_cau($1)`, [de.id]))[0].n
  kt(r.so_cau === tong, `duyệt đề: ${r.so_cau}/${tong} câu đã duyệt nội dung, ${r.so_cau_cho_dang} còn chờ phân dạng`)
  const conChua = await q(`select ma_cau from dai_cau_hoi where ma_cau = any($1) and not da_duyet`, [cauCho])
  kt(conChua.length === 0, 'câu dạng chờ CŨNG được đánh dấu đã duyệt')
  const hang = await q(`select ma_cau from fn_kho_hang_duyet('toan', 'chua_dang', null, 100000, 0) where ma_cau = any($1)`, [cauCho])
  kt(hang.length === cauCho.length, `câu đó vẫn nằm ở hàng "Chưa phân dạng" (${hang.length}/${cauCho.length})`)
  // đường duyệt câu lẻ vẫn chặn dạng chờ
  const [mot] = await q(`select ma_cau from dai_cau_hoi where _kho_la_dang_cho(dang_chinh) and not da_duyet and xoa_at is null limit 1`)
  await q('savepoint s'); let e = null
  try { await q(`update dai_cau_hoi set da_duyet = true where ma_cau = $1`, [mot.ma_cau]) } catch (x) { e = x.message } await q('rollback to savepoint s')
  kt(e && e.includes('Chưa phân dạng'), 'duyệt câu lẻ (ngoài duyệt đề) vẫn bị chặn khi dạng chờ', e)
  const [{ s }] = await q(`select coalesce(current_setting('kho.duyet_noi_dung', true), '') s`)
  kt(s !== 'on', 'cờ duyệt nội dung đã tắt sau khi duyệt đề')
} catch (e) { sai++; console.log('LỖI:', e.message, e.where ?? '') }
await q('rollback'); await c.end()
console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`)
process.exitCode = sai ? 1 : 0
