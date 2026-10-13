// Đọc thân 3 trigger + fn_dai_chuyen_dang (chỉ đọc) — phụ của _audit_ma_goc.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const pick = k => (txt.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm')) || [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: pick('DATABASE_URL_RO') || pick('DATABASE_URL'), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
for (const n of ['trg_chi_khoan_bf', 'hinh_baitoan_gen_ma', '_sotay_ct_truoc_ghi', 'fn_dai_chuyen_dang']) {
  const r = await c.query(`select pg_get_functiondef(p.oid) d from pg_proc p join pg_namespace s on s.oid=p.pronamespace and s.nspname='public' where p.proname=$1 limit 1`, [n])
  console.log(`\n===== ${n} =====\n${(r.rows[0]?.d || '(không thấy)').slice(0, 2800)}`)
}
await c.query('ROLLBACK'); await c.end()
