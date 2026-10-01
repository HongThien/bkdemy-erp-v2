// DRY RUN trong transaction rồi ROLLBACK — xem xoá dạng có bị FK RESTRICT chặn không, và trigger dạng chờ nói gì.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const lines = readFileSync('.env', 'utf8').split(/\r?\n/)
const envKey = (t) => { const l = lines.find((x) => x.trim().startsWith(t + '=')); return l ? l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : null }
const c = new pg.Client({ connectionString: envKey('DATABASE_URL') })
await c.connect()
const CD = 'T1120301'
console.log('dạng chờ K12 tồn tại?', (await c.query(`select ma_dang, ten_dang from dai_ban_do where ma_dang = 'T112000000'`)).rows)
for (const t of ['trg_chan_duyet_dang_cho', 'trg_log_doi_dang']) {
  const r = await c.query(`select pg_get_functiondef(tgfoid) d from pg_trigger where tgname=$1 and tgrelid='dai_cau_hoi'::regclass`, [t])
  console.log('\n-- ' + t + '\n' + r.rows[0].d)
}
await c.query('begin')
try {
  const a = await c.query(`update dai_cau_hoi set xoa_at = now() where dang_chinh in (select ma_dang from dai_ban_do where ma_chuyen_de=$1) and xoa_at is null`, [CD])
  console.log('\nDRY: câu vào rác =', a.rowCount)
  try { const b = await c.query(`delete from dai_ban_do where ma_chuyen_de=$1`, [CD]); console.log('DRY: xoá dạng OK =', b.rowCount) }
  catch (e) { console.log('DRY: xoá dạng BỊ CHẶN →', e.message) }
} finally { await c.query('rollback'); console.log('ROLLBACK xong — chưa đổi gì.') }
await c.end()
