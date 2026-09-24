// XOÁ chuyên đề T1120301 (K12 "Ứng dụng đạo hàm xử lí bài toán thực tế") — CEO gật 24/09, 1 transaction:
//   1) 99 câu → kho rác (xoa_at) + dang_chinh → dạng chờ T112000000 + da_duyet=false (trigger cấm câu duyệt ở dạng chờ)
//   2) delete 4 dạng dai_ban_do (cascade 3 dai_dang_ly_thuyet)
// Trigger trg_log_doi_dang tự ghi kho_doi_dang_log. Verify đếm trước/sau; lệch kỳ vọng ⇒ rollback.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const lines = readFileSync('.env', 'utf8').split(/\r?\n/)
const envKey = (t) => { const l = lines.find((x) => x.trim().startsWith(t + '=')); return l ? l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : null }
const c = new pg.Client({ connectionString: envKey('DATABASE_URL') })
await c.connect()
const CD = 'T1120301', CHO = 'T112000000'
const n = async (sql, p = []) => Number((await c.query(sql, p)).rows[0].n)
await c.query('begin')
try {
  const dangs = (await c.query(`select ma_dang from dai_ban_do where ma_chuyen_de=$1 order by 1`, [CD])).rows.map(r => r.ma_dang)
  const truoc = { dang: dangs.length, cau: await n(`select count(*) n from dai_cau_hoi where dang_chinh = any($1)`, [dangs]), lt: await n(`select count(*) n from dai_dang_ly_thuyet where ma_dang = any($1)`, [dangs]), log: await n(`select count(*) n from kho_doi_dang_log`) }
  console.log('TRƯỚC', truoc, dangs)
  if (truoc.dang !== 4 || truoc.cau !== 99) throw new Error('Lệch kỳ vọng (4 dạng / 99 câu) — dừng')
  const u = await c.query(`update dai_cau_hoi set xoa_at = coalesce(xoa_at, now()), dang_chinh = $2, da_duyet = false where dang_chinh = any($1)`, [dangs, CHO])
  const d = await c.query(`delete from dai_ban_do where ma_chuyen_de = $1`, [CD])
  const sau = { cau_update: u.rowCount, dang_xoa: d.rowCount, con_dang: await n(`select count(*) n from dai_ban_do where ma_chuyen_de=$1`, [CD]), lt: await n(`select count(*) n from dai_dang_ly_thuyet where ma_dang = any($1)`, [dangs]), cau_rac_o_cho: await n(`select count(*) n from dai_cau_hoi where ma_cau like $1 || '%' and xoa_at is not null and dang_chinh = $2 and not da_duyet`, [CD, CHO]), log_them: (await n(`select count(*) n from kho_doi_dang_log`)) - truoc.log }
  console.log('SAU', sau)
  if (sau.cau_update !== 99 || sau.dang_xoa !== 4 || sau.con_dang !== 0 || sau.lt !== 0 || sau.cau_rac_o_cho !== 99) throw new Error('Verify sau lệch — rollback')
  await c.query('commit'); console.log('COMMIT ✅')
} catch (e) { await c.query('rollback'); console.error('ROLLBACK ❌', e.message); process.exitCode = 1 }
await c.end()
