// AUDIT (chỉ đọc) — luật "MÃ GỐC BẤT BIẾN" (CLAUDE.md §2, CEO 14/10).
// Tìm mọi đường có thể GHI ĐÈ / CẤP LẠI mã của một đối tượng sau khi nó đã sinh:
//   A. trigger function gán NEW.<cột mã>  — kèm sự kiện (INSERT/UPDATE) và danh sách "UPDATE OF"
//   B. function/RPC có câu UPDATE ... SET <cột mã> = ...
//   C. cột mã có default nextval (nơi sinh mã) — để biết bảng nào "có mã gốc"
// Chạy: node scripts/_audit_ma_goc.mjs      (mở transaction READ ONLY; không ghi gì)
import { readFileSync } from 'node:fs'
import pg from 'pg'

const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const pick = k => (txt.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm')) || [])[1]?.replace(/^["']|["']$/g, '')
const url = pick('DATABASE_URL_RO') || pick('DATABASE_URL')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
await c.query('BEGIN READ ONLY')

const COT_MA = String.raw`(ma|ma_[a-z0-9_]+|[a-z0-9_]+_ma|ma_dang|ma_cau|ma_bai|ma_y)`

// C. cột mã có default nextval
const C = await c.query(`
  select c.table_name, c.column_name, c.column_default
  from information_schema.columns c
  join information_schema.tables t using (table_schema, table_name)
  where c.table_schema='public' and t.table_type='BASE TABLE'
    and (c.column_name ~ '^(ma|ma_[a-z0-9_]+)$')
    and c.column_default ilike '%nextval%'
  order by 1,2`)

// A. trigger function gán NEW.<cột mã>
const A = await c.query(`
  select cl.relname as bang, tg.tgname, p.proname as ham,
         case when (tg.tgtype & 4)>0 then 'INSERT ' else '' end ||
         case when (tg.tgtype & 16)>0 then 'UPDATE' else '' end ||
         case when (tg.tgtype & 8)>0 then ' DELETE' else '' end as su_kien,
         (select string_agg(a.attname, ',') from pg_attribute a
            where a.attrelid=tg.tgrelid and a.attnum = any(tg.tgattr)) as update_of,
         p.prosrc
  from pg_trigger tg
  join pg_class cl on cl.oid=tg.tgrelid
  join pg_namespace n on n.oid=cl.relnamespace and n.nspname='public'
  join pg_proc p on p.oid=tg.tgfoid
  where not tg.tgisinternal
    and p.prosrc ~* 'new\\.${COT_MA}\\s*:?='
  order by 1,2`)

// B. function có UPDATE ... SET <cột mã> =
const B = await c.query(`
  select p.proname as ham, pg_get_function_identity_arguments(p.oid) as args,
         (regexp_matches(p.prosrc, '(update\\s+[a-z0-9_."]+\\s+(?:as\\s+\\w+\\s+)?set[^;]*?\\y${COT_MA}\\s*=)', 'gi'))[1] as cau
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace and n.nspname='public'
  where p.prosrc ~* 'update\\s+[a-z0-9_."]+\\s+(as\\s+\\w+\\s+)?set[^;]*?\\y${COT_MA}\\s*='
  order by 1`)

await c.query('ROLLBACK')
await c.end()

const ngan = s => (s || '').replace(/\s+/g, ' ').slice(0, 160)
console.log(`\n== C. Bảng có cột mã sinh từ sequence: ${C.rowCount} ==`)
for (const r of C.rows) console.log(`  ${r.table_name}.${r.column_name}`)

console.log(`\n== A. Trigger gán NEW.<mã>: ${A.rowCount} ==`)
for (const r of A.rows) {
  const chayLaiKhiUpdate = /UPDATE/.test(r.su_kien)
  // có guard "tg_op = 'INSERT'" / "old.ma is distinct" / "new.ma is null" không?
  const guard = /tg_op\s*=\s*'insert'|new\.\w+\s+is\s+null|coalesce\(\s*new\.\w+/i.test(r.prosrc)
  const co = /old\.\w+\s*(is\s+distinct\s+from|<>|!=)\s*new\./i.test(r.prosrc)
  console.log(`  ${chayLaiKhiUpdate ? '⚠' : '✓'} ${r.bang}.${r.tgname} → ${r.ham}()  [${r.su_kien.trim()}${r.update_of ? ' OF ' + r.update_of : ''}]  guard=${guard ? 'có' : 'KHÔNG'} so-OLD=${co ? 'có' : 'không'}`)
}

console.log(`\n== B. Hàm UPDATE … SET <mã> = …: ${B.rowCount} ==`)
for (const r of B.rows) console.log(`  ${r.ham}(${ngan(r.args)})  ::  ${ngan(r.cau)}`)
