// Kiểm mig "nhóm mô hình" Hình–Luyện TRONG ROLLBACK (không ghi gì): node scripts/kho/test_nhom_mo_hinh.mjs
import pg from 'pg'
import fs from 'node:fs'
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
let ok = 0, sai = 0
const kt = (dk, ten) => { if (dk) { ok++; console.log('  ✔', ten) } else { sai++; console.log('  ✘', ten) } }
const thu = async (sql, args) => { await c.query('savepoint s'); try { await c.query(sql, args); await c.query('release savepoint s'); return null } catch (e) { await c.query('rollback to savepoint s'); return e.message } }
await c.query('begin')
try {
  if (!(await c.query(`select to_regclass('hinh_nhom_mo_hinh') t`)).rows[0].t) {
    const f = fs.readdirSync('supabase/migrations').find((x) => x.includes('hinh_nhom_mo_hinh'))
    await c.query(fs.readFileSync('supabase/migrations/' + f, 'utf8'))
  }
  const tk = (await c.query(`select t.id from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong order by t.created_at limit 1`)).rows[0]
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.id, role: 'authenticated' })])
  const cds = (await c.query(`select id from dai_bdm_chu_de where khoi = '8' and nhanh = 'hinh_luyen' order by thu_tu`)).rows.map((r) => r.id)
  const mhCu = (await c.query(`select id, chu_de_id from hinh_mo_hinh where phan = 'luyen' and neo_baitoan_id is null and chu_de_id = $1 limit 1`, [cds[1] ?? cds[0]])).rows[0]
  const n1 = (await c.query(`insert into hinh_nhom_mo_hinh (chu_de_id, ten, mo_ta) values ($1, 'Thử nhóm A', 'tứ giác có hai đường chéo vuông góc') returning *`, [mhCu.chu_de_id])).rows[0]
  const n2 = (await c.query(`insert into hinh_nhom_mo_hinh (chu_de_id, ten) values ($1, 'Thử nhóm B') returning *`, [mhCu.chu_de_id])).rows[0]
  kt(/^NMH\d{5}$/.test(n1.id) && n2.thu_tu === n1.thu_tu + 1, `mã ${n1.id}, thứ tự tự cấp ${n1.thu_tu} → ${n2.thu_tu}`)
  const mhMoi = (await c.query(`select fn_hl_tao_mo_hinh_trong_nhom($1, 'Thử mô hình', 'Cho hình chữ nhật ABCD.', null) id`, [n1.id])).rows[0].id
  const m = (await c.query(`select nhom_mh_id, chu_de_id, khoi, phan from hinh_mo_hinh where id = $1`, [mhMoi])).rows[0]
  kt(m.nhom_mh_id === n1.id && m.chu_de_id === n1.chu_de_id && m.khoi === '8' && m.phan === 'luyen', 'tạo mô hình trong nhóm ⇒ đúng nhóm · chủ đề · khối · luyen')
  await c.query(`update hinh_mo_hinh set nhom_mh_id = $2 where id = $1`, [mhCu.id, n2.id])
  kt((await c.query(`select nhom_mh_id from hinh_mo_hinh where id = $1`, [mhCu.id])).rows[0].nhom_mh_id === n2.id, 'chuyển mô hình cũ vào nhóm B')
  if (cds.length > 1) {
    const khac = cds.find((x) => x !== mhCu.chu_de_id)
    await c.query(`update hinh_mo_hinh set chu_de_id = $2 where id = $1`, [mhCu.id, khac])
    kt((await c.query(`select nhom_mh_id from hinh_mo_hinh where id = $1`, [mhCu.id])).rows[0].nhom_mh_id === null, 'đổi sang chủ đề khác ⇒ tự rời nhóm')
  }
  await c.query(`select fn_hl_nhom_mh_sap($1)`, [[n2.id, n1.id]])
  const tt = (await c.query(`select id, thu_tu from hinh_nhom_mo_hinh where id = any($1) order by thu_tu`, [[n1.id, n2.id]])).rows.map((r) => r.id)
  kt(tt[0] === n2.id, 'sắp lại thứ tự nhóm')
  kt(await thu(`select fn_hl_nhom_mh_xoa($1)`, [n1.id]), 'xoá nhóm CÒN mô hình ⇒ bị chặn')
  kt(!(await thu(`select fn_hl_nhom_mh_xoa($1)`, [n2.id])), 'xoá nhóm rỗng ⇒ được')
  const log = +(await c.query(`select count(*) from dai_bdm_log where bang = 'hinh_nhom_mo_hinh' and khoa = any($1)`, [[n1.id, n2.id]])).rows[0].count
  kt(log >= 4, `ghi vết dai_bdm_log: ${log} dòng`)
  const acl = (await c.query(`select has_function_privilege('anon','fn_hl_nhom_mh_xoa(text)','execute') a`)).rows[0].a
  kt(!acl, 'anon không gọi được hàm')
} catch (e) { sai++; console.log('LỖI:', e.message) }
await c.query('rollback'); await c.end()
console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK, không ghi gì)`)
process.exitCode = sai ? 1 : 0
