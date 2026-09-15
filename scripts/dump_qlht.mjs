// Dump FULL source mọi hàm qlht_* + current_nhan_su_id + giai_thuong_check_slot + trigger/grants —
// tham chiếu cho spec-qlht-hien-trang.md (hệ của Hải tạo tay ngoài migration, đây là cách duy nhất soi).
import { readFileSync, writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

let out = ''
const fns = await q(`select proname, pg_get_functiondef(oid) def from pg_proc
  where pronamespace='public'::regnamespace and (proname like 'qlht_%' or proname in ('current_nhan_su_id','giai_thuong_check_slot'))
  order by proname`)
for (const r of fns) out += `\n${'═'.repeat(80)}\n${r.def}\n`

out += `\n${'═'.repeat(80)}\nTRIGGERS toàn DB gọi hàm qlht_/giai_thuong:\n`
for (const r of await q(`select t.tgname, t.tgrelid::regclass::text tbl, p.proname
  from pg_trigger t join pg_proc p on p.oid = t.tgfoid
  where not t.tgisinternal and (p.proname like 'qlht_%' or p.proname like 'giai_thuong%')`))
  out += `  ${r.tbl} · ${r.tgname} → ${r.proname}()\n`

out += `\nSEQUENCES/objects khác tên qlht:\n`
for (const r of await q(`select relname, relkind from pg_class where relname like 'qlht%' order by 1`))
  out += `  ${r.relname} (${r.relkind})\n`

out += `\nGRANTS trên các bảng qlht (role nào đọc/ghi được):\n`
for (const r of await q(`select table_name, grantee, string_agg(privilege_type, ',') privs
  from information_schema.role_table_grants where table_name like 'qlht%' group by 1,2 order by 1,2`))
  out += `  ${r.table_name} · ${r.grantee}: ${r.privs}\n`

const vnDate = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)
writeFileSync(join(root, `scripts/qlht_dump_${vnDate}.txt`), out)
console.log('OK ->', `scripts/qlht_dump_${vnDate}.txt`, `(${fns.length} hàm)`)
await c.end()
