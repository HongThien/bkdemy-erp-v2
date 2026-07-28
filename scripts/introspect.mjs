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
  // ⚠ ĐỌC pg_catalog, KHÔNG đọc information_schema — 3 query dưới đây từng dùng information_schema
  // và ĂN QUẢ LỪA IM LẶNG (07-22): các view đó TỰ LỌC THEO QUYỀN của role đang nối.
  //   · `columns`: chỉ hiện bảng role có ÍT NHẤT 1 quyền → bảng mới cấp chưa kịp = BIẾN MẤT khỏi
  //     schema.md, không lỗi, không cảnh báo. (Đã dính: 4 bảng đánh giá học tập + `phan_cong_ca`
  //     vô hình rất lâu — schema.md ghi 98 bảng trong khi DB có 103.)
  //   · `table_constraints`: theo docs PG chỉ hiện constraint của bảng mà user SỞ HỮU hoặc có
  //     quyền KHÁC SELECT. Role chỉ-đọc ⇒ PK/FK trống trơn dù bảng đã hiện — còn tệ hơn thiếu hẳn
  //     bảng, vì nhìn vào tưởng bảng thật sự không có khoá.
  // pg_catalog không lọc kiểu đó ⇒ schema.md phản ánh ĐÚNG DB bất kể role. Đây cũng là lý do
  // `checks`/`triggers`/`functions` bên dưới vốn đã đúng: chúng đọc pg_catalog từ đầu.
  columns: `select c.relname as table_name, a.attname as column_name, a.attnum as ordinal_position,
                   format_type(a.atttypid, a.atttypmod) as data_type,
                   t.typname as udt_name,
                   case when a.attnotnull then 'NO' else 'YES' end as is_nullable,
                   pg_get_expr(d.adbin, d.adrelid) as column_default
            from pg_class c
            join pg_namespace n on n.oid = c.relnamespace
            join pg_attribute a on a.attrelid = c.oid
            join pg_type t on t.oid = a.atttypid
            left join pg_attrdef d on d.adrelid = c.oid and d.adnum = a.attnum
            where n.nspname='public' and c.relkind in ('r','p') and a.attnum > 0 and not a.attisdropped
            order by c.relname, a.attnum`,
  pks: `select c.relname as table_name, a.attname as column_name
        from pg_constraint con
        join pg_class c on c.oid = con.conrelid
        join pg_namespace n on n.oid = c.relnamespace
        join unnest(con.conkey) with ordinality as k(attnum, ord) on true
        join pg_attribute a on a.attrelid = c.oid and a.attnum = k.attnum
        where n.nspname='public' and con.contype='p'
        order by c.relname, k.ord`,
  fks: `select c.relname as table_name, a.attname as column_name,
               rc.relname as ref_table, ra.attname as ref_column
        from pg_constraint con
        join pg_class c on c.oid = con.conrelid
        join pg_namespace n on n.oid = c.relnamespace
        join pg_class rc on rc.oid = con.confrelid
        join unnest(con.conkey, con.confkey) with ordinality as k(attnum, refattnum, ord) on true
        join pg_attribute a on a.attrelid = c.oid and a.attnum = k.attnum
        join pg_attribute ra on ra.attrelid = rc.oid and ra.attnum = k.refattnum
        where n.nspname='public' and con.contype='f'
        order by c.relname, a.attname`,
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
