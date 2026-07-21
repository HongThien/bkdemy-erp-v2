// Introspect schema public (read-only) từ Supabase -> schema.md
// Chạy: npm run schema   (đọc DATABASE_URL_RO trong .env)
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function loadUrl() {
  let txt
  try { txt = readFileSync(join(root, '.env'), 'utf8') }
  catch { console.error('❌ .env không có. Copy .env.example -> .env rồi điền DATABASE_URL_RO.'); process.exit(1) }
  const m = txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)
  if (!m) { console.error('❌ Thiếu DATABASE_URL trong .env'); process.exit(1) }
  return m[1].replace(/^["']|["']$/g, '')
}

const Q = {
  columns: `select table_name, column_name, ordinal_position, data_type, udt_name, is_nullable, column_default
            from information_schema.columns where table_schema='public'
            order by table_name, ordinal_position`,
  pks: `select tc.table_name, kcu.column_name
        from information_schema.table_constraints tc
        join information_schema.key_column_usage kcu
          on kcu.constraint_name=tc.constraint_name and kcu.table_schema=tc.table_schema
        where tc.table_schema='public' and tc.constraint_type='PRIMARY KEY'
        order by tc.table_name, kcu.ordinal_position`,
  fks: `select tc.table_name, kcu.column_name, ccu.table_name as ref_table, ccu.column_name as ref_column
        from information_schema.table_constraints tc
        join information_schema.key_column_usage kcu
          on kcu.constraint_name=tc.constraint_name and kcu.table_schema=tc.table_schema
        join information_schema.constraint_column_usage ccu
          on ccu.constraint_name=tc.constraint_name and ccu.table_schema=tc.table_schema
        where tc.table_schema='public' and tc.constraint_type='FOREIGN KEY'
        order by tc.table_name, kcu.column_name`,
  enums: `select t.typname, e.enumlabel from pg_type t
          join pg_enum e on e.enumtypid=t.oid
          join pg_namespace n on n.oid=t.typnamespace
          where n.nspname='public' order by t.typname, e.enumsortorder`,
  triggers: `select c.relname as table_name, t.tgname as trigger_name, t.tgtype, p.proname as func
             from pg_trigger t
             join pg_class c on c.oid=t.tgrelid
             join pg_namespace n on n.oid=c.relnamespace
             join pg_proc p on p.oid=t.tgfoid
             where n.nspname='public' and not t.tgisinternal
             order by c.relname, t.tgname`,
  functions: `select p.proname, pg_get_function_arguments(p.oid) as args, pg_get_function_result(p.oid) as result
              from pg_proc p join pg_namespace n on n.oid=p.pronamespace
              where n.nspname='public' order by p.proname`,
  // CHECK constraint — cột `text` KHÔNG nói lên tập giá trị hợp lệ. Thiếu cái này thì code
  // mở rộng union type mà constraint đứng yên = drift ngầm, chỉ lộ khi user bấm nút và ăn
  // "violates check constraint" (đã dính 2 lần: prep_phong.luot, viec_van_hanh_duyet.tab).
  checks: `select c.relname as table_name, con.conname, pg_get_constraintdef(con.oid) as def
           from pg_constraint con
           join pg_class c on c.oid=con.conrelid
           join pg_namespace n on n.oid=c.relnamespace
           where n.nspname='public' and con.contype='c'
           order by c.relname, con.conname`,
}

// Tách "x = ANY (ARRAY['a','b'])" -> { col: 'x', vals: ['a','b'] }. Check phức tạp hơn (so sánh
// số, biểu thức nhiều cột...) trả null -> rơi xuống mục "Checks khác" in nguyên văn, không đoán bừa.
function parseEnumCheck(def) {
  if (!/ = ANY \(\(?ARRAY\[/.test(def)) return null
  // Cột text -> `col = ANY`; cột varchar -> `(col)::text = ANY`. Cast là TÙY CHỌN, đừng bắt buộc.
  const col = def.match(/\(\(?([a-z_][a-z0-9_]*)\)?(?:::text)? = ANY/)?.[1]
  if (!col) return null
  const vals = [...def.matchAll(/'((?:[^']|'')*)'::(?:text|character varying)/g)].map(m => m[1].replace(/''/g, "'"))
  return vals.length ? { col, vals } : null
}

const url = loadUrl()
const client = new pg.Client({ connectionString: url })

try {
  await client.connect()
  const cols  = (await client.query(Q.columns)).rows
  const pks   = (await client.query(Q.pks)).rows
  const fks   = (await client.query(Q.fks)).rows
  const enums = (await client.query(Q.enums)).rows
  const trigs = (await client.query(Q.triggers)).rows
  const funcs = (await client.query(Q.functions)).rows
  const checks = (await client.query(Q.checks)).rows

  const pkSet = new Set(pks.map(r => `${r.table_name}.${r.column_name}`))
  const fkMap = new Map()
  for (const f of fks) fkMap.set(`${f.table_name}.${f.column_name}`, `${f.ref_table}.${f.ref_column}`)
  // Check dạng enum -> gắn thẳng vào dòng cột (nhìn phát thấy ngay). Còn lại -> bảng riêng cuối file.
  const chkMap = new Map()
  const chkKhac = []
  for (const k of checks) {
    const p = parseEnumCheck(k.def)
    if (p) chkMap.set(`${k.table_name}.${p.col}`, p.vals)
    else chkKhac.push(k)
  }

  const tables = [...new Set(cols.map(c => c.table_name))]
  let md = `# Schema (public) — auto-generated, KHÔNG sửa tay\n\n`
  md += `> Sinh bởi \`npm run schema\` từ DB live (read-only). Nguồn chuẩn = DB.\n\n`
  md += `${tables.length} bảng · ${enums.length ? new Set(enums.map(e=>e.typname)).size : 0} enum · ${trigs.length} trigger · ${funcs.length} function\n\n`

  for (const t of tables) {
    md += `## ${t}\n\n| cột | kiểu | null | default | khóa | giá trị hợp lệ |\n|---|---|---|---|---|---|\n`
    for (const c of cols.filter(c => c.table_name === t)) {
      const key = `${t}.${c.column_name}`
      const type = c.data_type === 'USER-DEFINED' ? c.udt_name : (c.data_type === 'ARRAY' ? c.udt_name : c.data_type)
      const tag = [pkSet.has(key) ? 'PK' : '', fkMap.has(key) ? `FK→${fkMap.get(key)}` : ''].filter(Boolean).join(' ')
      const chk = chkMap.has(key) ? chkMap.get(key).map(v => `\`${v}\``).join(' · ') : ''
      md += `| ${c.column_name} | ${type} | ${c.is_nullable === 'YES' ? 'Y' : ''} | ${(c.column_default || '').replace(/\|/g, '\\|')} | ${tag} | ${chk} |\n`
    }
    md += `\n`
  }

  if (enums.length) {
    md += `## Enums\n\n`
    const byType = {}
    for (const e of enums) (byType[e.typname] ||= []).push(e.enumlabel)
    for (const [name, vals] of Object.entries(byType)) md += `- **${name}**: ${vals.map(v => `\`${v}\``).join(' · ')}\n`
    md += `\n`
  }
  if (trigs.length) {
    md += `## Triggers\n\n| bảng | trigger | timing | event | function |\n|---|---|---|---|---|\n`
    for (const t of trigs) {
      const ty = Number(t.tgtype)
      const timing = (ty & 64) ? 'INSTEAD OF' : ((ty & 2) ? 'BEFORE' : 'AFTER')
      const ev = [(ty&4)&&'INSERT', (ty&8)&&'DELETE', (ty&16)&&'UPDATE', (ty&32)&&'TRUNCATE'].filter(Boolean).join('/')
      md += `| ${t.table_name} | ${t.trigger_name} | ${timing} | ${ev} | ${t.func} |\n`
    }
    md += `\n`
  }
  if (funcs.length) {
    md += `## Functions\n\n`
    for (const f of funcs) md += `- \`${f.proname}(${f.args})\` → ${f.result}\n`
    md += `\n`
  }

  if (chkKhac.length) {
    md += `## Checks khác (không phải dạng enum)\n\n| bảng | constraint | định nghĩa |\n|---|---|---|\n`
    for (const k of chkKhac) md += `| ${k.table_name} | ${k.conname} | \`${k.def.replace(/\|/g, '\\|')}\` |\n`
    md += `\n`
  }

  writeFileSync(join(root, 'schema.md'), md, 'utf8')
  console.log(`OK -> schema.md  (${tables.length} bảng, ${trigs.length} trigger, ${funcs.length} function, ${checks.length} check: ${chkMap.size} enum + ${chkKhac.length} khác)`)
} catch (e) {
  console.error('❌ Lỗi:', e.message)
  process.exit(1)
} finally {
  await client.end().catch(() => {})
}
