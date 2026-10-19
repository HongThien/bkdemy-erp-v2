// Kiểm mig nhãn Dạng bài / Bổ đề cho ý Hình–Luyện TRONG ROLLBACK (không ghi gì): node scripts/kho/test_hinh_y_nhan.mjs
import pg from 'pg'
import fs from 'node:fs'
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
let ok = 0, sai = 0
const kt = (dk, ten) => { if (dk) { ok++; console.log('  ✔', ten) } else { sai++; console.log('  ✘', ten) } }
const loiCua = async (sql, a) => { await c.query('savepoint s'); try { await c.query(sql, a); await c.query('release savepoint s'); return null } catch (e) { await c.query('rollback to savepoint s'); return e.message } }
await c.query('begin')
try {
  if (!(await c.query(`select to_regclass('hinh_y_dang') t`)).rows[0].t) {
    const f = fs.readdirSync('supabase/migrations').find((x) => x.includes('hinh_y_nhan_dang_bo_de'))
    await c.query(fs.readFileSync('supabase/migrations/' + f, 'utf8'))
  }
  const tk = (await c.query(`select t.id from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong order by t.created_at limit 1`)).rows[0]
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.id, role: 'authenticated' })])
  const y8 = (await c.query(`select y.id from hinh_y y join hinh_bai b on b.id = y.bai_id where b.khoi = '8' limit 1`)).rows[0].id
  const d8 = (await c.query(`select id, ten from hinh_dang where khoi = '8' limit 1`)).rows[0]
  const d9 = (await c.query(`select id, ten from hinh_dang where khoi = '9' limit 1`)).rows[0]
  const b8 = (await c.query(`select id from hinh_bo_de where khoi = '8' limit 1`)).rows[0]
  await c.query(`select fn_hl_y_nhan_dat($1,'dang',$2,true)`, [y8, d8.id])
  await c.query(`select fn_hl_y_nhan_dat($1,'bo_de',$2,true)`, [y8, b8.id])
  let n = (await c.query(`select (select count(*) from hinh_y_dang where y_id=$1) d, (select count(*) from hinh_y_bo_de where y_id=$1) b`, [y8])).rows[0]
  kt(+n.d === 1 && +n.b === 1, 'dán 1 dạng + 1 bổ đề cho ý lớp 8')
  kt(!(await loiCua(`select fn_hl_y_nhan_dat($1,'dang',$2,true)`, [y8, d8.id])), 'dán trùng ⇒ không lỗi, không nhân đôi')
  const loi = await loiCua(`select fn_hl_y_nhan_dat($1,'dang',$2,true)`, [y8, d9.id])
  kt(loi && loi.includes('lớp 9'), `nhãn lớp 9 cho ý lớp 8 ⇒ bị chặn ("${(loi ?? '').slice(0, 70)}…")`)
  await c.query(`select fn_hl_y_nhan_dat($1,'dang',$2,false)`, [y8, d8.id])
  kt(+(await c.query(`select count(*) from hinh_y_dang where y_id=$1`, [y8])).rows[0].count === 0, 'gỡ nhãn dạng')
  const dx1 = (await c.query(`insert into hinh_y_nhan_de_xuat (y_id, loai, nhan_id, ly_do) values ($1,'dang',$2,'thử') returning id`, [y8, d8.id])).rows[0].id
  await c.query(`select fn_hl_y_nhan_quyet($1,true)`, [dx1])
  n = (await c.query(`select nguon from hinh_y_dang where y_id=$1 and dang_id=$2`, [y8, d8.id])).rows[0]
  kt(n?.nguon === 'ai' && +(await c.query(`select count(*) from hinh_y_nhan_de_xuat where id=$1`, [dx1])).rows[0].count === 0, 'nhận đề xuất ⇒ thành nhãn nguon=ai, đề xuất biến mất')
  const b8b = (await c.query(`select id from hinh_bo_de where khoi = '8' and id <> $1 limit 1`, [b8.id])).rows[0]
  const dx2 = (await c.query(`insert into hinh_y_nhan_de_xuat (y_id, loai, nhan_id, ly_do) values ($1,'bo_de',$2,'thử') returning id`, [y8, b8b.id])).rows[0].id
  await c.query(`select fn_hl_y_nhan_quyet($1,false,'không dùng bổ đề này')`, [dx2])
  kt(+(await c.query(`select count(*) from hinh_y_nhan_tu_choi where y_id=$1 and nhan_id=$2`, [y8, b8b.id])).rows[0].count === 1, 'bác đề xuất ⇒ ghi từ chối kèm lý do')
  kt(!!(await loiCua(`insert into hinh_y_nhan_de_xuat (y_id, loai, nhan_id, ly_do) values ($1,'dang',$2,'thử')`, [y8, d9.id])), 'đề xuất AI nhãn lớp trên cũng bị chặn')
  const log = +(await c.query(`select count(*) from dai_bdm_log where bang in ('hinh_y_dang','hinh_y_bo_de')`)).rows[0].count
  kt(log >= 3, `ghi vết dai_bdm_log: ${log} dòng`)
  kt(!(await c.query(`select has_function_privilege('anon','fn_hl_y_nhan_dat(uuid,text,uuid,boolean)','execute') a`)).rows[0].a, 'anon không gọi được')
} catch (e) { sai++; console.log('LỖI:', e.message) }
await c.query('rollback'); await c.end()
console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK, không ghi gì)`)
process.exitCode = sai ? 1 : 0
