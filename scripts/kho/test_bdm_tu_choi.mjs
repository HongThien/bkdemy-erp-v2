// Kiểm "Từ chối + lý do" ở Duyệt kho Bản đồ mới TRONG ROLLBACK (không ghi gì): node scripts/kho/test_bdm_tu_choi.mjs
import pg from 'pg'
import fs from 'node:fs'
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
let ok = 0, sai = 0
const kt = (dk, ten) => { if (dk) { ok++; console.log('  ✔', ten) } else { sai++; console.log('  ✘', ten) } }
const loiCua = async (sql, a) => { await c.query('savepoint s'); try { await c.query(sql, a); await c.query('release savepoint s'); return null } catch (e) { await c.query('rollback to savepoint s'); return e.message } }
await c.query('begin')
try {
  if (!(await c.query(`select to_regclass('dai_bdm_tu_choi') t`)).rows[0].t)
    await c.query(fs.readFileSync('supabase/migrations/202610181720_bdm_duyet_tu_choi_ly_do.sql', 'utf8'))
  const tk = (await c.query(`select t.id from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong order by t.created_at limit 1`)).rows[0]
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.id, role: 'authenticated' })])
  const dx = (await c.query(`select x.ma_cau, x.dang_bai_id from dai_bdm_de_xuat x join dai_cau_hoi q on q.ma_cau = x.ma_cau and q.xoa_at is null limit 1`)).rows[0]
  const ai = (await c.query(`select g.ma_cau, g.dang_bai_id from dai_bdm_gan_cau g join dai_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null where g.nguon = 'ai' and not exists (select 1 from dai_bdm_kiem_mau k where k.ma_cau = g.ma_cau) limit 1`)).rows[0]
  const td = (await c.query(`select t.ma_cau from dai_bdm_cau_thieu_dang t join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null where t.nguon = 'ai' limit 1`)).rows[0]
  kt(await loiCua(`select fn_bdm_khop_quyet($1,'tu_choi',null,'  ')`, [dx.ma_cau]), 'thiếu lý do ⇒ bị chặn')
  await c.query(`select fn_bdm_khop_quyet($1,'tu_choi',null,'Câu là PT tích, không phải dạng này')`, [dx.ma_cau])
  let r = (await c.query(`select (select count(*) from dai_bdm_de_xuat where ma_cau=$1) dx, (select row_to_json(t) from dai_bdm_tu_choi t where ma_cau=$1) tc`, [dx.ma_cau])).rows[0]
  kt(+r.dx === 0 && r.tc?.hang === 'de_xuat' && r.tc?.dang_bai_ai_id === dx.dang_bai_id && !r.tc.kho_rac, `đề xuất ${dx.ma_cau}: gỡ đề xuất, lưu lý do (hàng de_xuat, chỗ AI ${dx.dang_bai_id})`)
  await c.query(`select fn_bdm_khop_quyet($1,'tu_choi',null,'AI gán sai nhóm')`, [ai.ma_cau])
  r = (await c.query(`select (select count(*) from dai_bdm_gan_cau where ma_cau=$1) g, (select ket_qua from dai_bdm_kiem_mau where ma_cau=$1) km, (select hang from dai_bdm_tu_choi where ma_cau=$1) h`, [ai.ma_cau])).rows[0]
  kt(+r.g === 0 && r.km === 'doi' && r.h === 'mau', `gán AI ${ai.ma_cau}: gỡ gán, kiểm mẫu ghi 'doi', hàng mau`)
  if (td) {
    await c.query(`select fn_bdm_khop_quyet($1,'kho_rac',null,'Đề lỗi, thiếu dữ kiện')`, [td.ma_cau])
    r = (await c.query(`select (select xoa_at is not null from dai_cau_hoi where ma_cau=$1) rac, (select count(*) from dai_bdm_cau_thieu_dang where ma_cau=$1) td, (select kho_rac from dai_bdm_tu_choi where ma_cau=$1) kr`, [td.ma_cau])).rows[0]
    kt(r.rac && +r.td === 0 && r.kr, `kho rác ${td.ma_cau}: câu vào kho rác, gỡ cờ thiếu dạng, lưu lý do`)
  }
  const nguoi = (await c.query(`select g.ma_cau from dai_bdm_gan_cau g join dai_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null where g.nguon = 'nguoi' limit 1`)).rows[0]
  if (nguoi) kt(await loiCua(`select fn_bdm_khop_quyet($1,'tu_choi',null,'thử')`, [nguoi.ma_cau]), 'gán của NGƯỜI ⇒ không từ chối qua đường này')
  kt(!(await c.query(`select has_table_privilege('authenticated','dai_bdm_tu_choi','update') u`)).rows[0].u, 'bảng lý do không UPDATE được (append-only)')
} catch (e) { sai++; console.log('LỖI:', e.message) }
await c.query('rollback'); await c.end()
console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK, không ghi gì)`)
process.exitCode = sai ? 1 : 0
