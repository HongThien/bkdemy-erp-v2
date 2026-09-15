// CHỈ ĐỌC — đếm công thức $…$ KaTeX parse LỖI trong dữ liệu cũ, theo từng bảng; xuất danh sách kèm mã câu.
// KHÔNG sửa dữ liệu (transaction READ ONLY — kể cả lỡ nối bằng role ghi cũng không ghi được).
// Chạy: npm run kiem:congthuc            (đọc DATABASE_URL_RO trong .env)
//       npm run kiem:congthuc -- --allow-rw   (chưa có DATABASE_URL_RO → tạm dùng DATABASE_URL, vẫn READ ONLY)
// Render y hệt app: cùng tiền xử lý (\frac→\dfrac, \vec 2 chữ→\overrightarrow) + cùng file macro (lib/math/macros).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
import katex from 'katex'
import { katexMacros } from '../src/lib/math/macros'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const allowRw = args.includes('--allow-rw')
const outArg = args.indexOf('--out') >= 0 ? args[args.indexOf('--out') + 1] : undefined

function envKey(txt: string, ten: string): string | null {
  const m = txt.match(new RegExp(`^\\s*${ten}\\s*=\\s*(.+?)\\s*$`, 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '') : null
}
function loadUrl(): string {
  let txt = ''
  try { txt = readFileSync(join(root, '.env'), 'utf8') } catch { console.error('❌ Không có .env'); process.exit(1) }
  const ro = envKey(txt, 'DATABASE_URL_RO')
  if (ro) return ro
  if (!allowRw) {
    console.error('❌ .env chưa có DATABASE_URL_RO (role claude_ro chỉ SELECT — CLAUDE.md §2.1).')
    console.error('   Tạm thời chạy bằng role ghi (vẫn ép READ ONLY ở transaction): thêm cờ --allow-rw')
    process.exit(1)
  }
  const rw = envKey(txt, 'DATABASE_URL')
  if (!rw) { console.error('❌ Thiếu cả DATABASE_URL'); process.exit(1) }
  console.warn('⚠️  Chưa có DATABASE_URL_RO — dùng DATABASE_URL, ép SET TRANSACTION READ ONLY.')
  return rw
}

// Bảng + cột chứa nội dung có công thức. Khoá hiển thị: ưu tiên ma_cau → ma → PK (tự dò trong pg_catalog).
const TABLES: { table: string; cols: string[] }[] = [
  { table: 'dai_cau_hoi', cols: ['noi_dung', 'dap_an', 'loi_giai', 'lua_chon', 'menh_de'] },
  { table: 'hgt_cau_hoi', cols: ['noi_dung', 'dap_an', 'loi_giai', 'lua_chon', 'menh_de'] },
  { table: 'khtn_cau_hoi', cols: ['noi_dung', 'dap_an', 'loi_giai', 'lua_chon', 'menh_de'] },
  { table: 'dai_cau_hoi_clone_cho_duyet', cols: ['noi_dung', 'dap_an', 'loi_giai', 'lua_chon', 'menh_de'] },
  { table: 'bai_test_cau', cols: ['noi_dung', 'loi_giai', 'ly_thuyet', 'menh_de'] },
  { table: 'ca_test_cau', cols: ['noi_dung', 'dap_an', 'loi_giai', 'menh_de'] },
  { table: 'dai_chuyen_de_ly_thuyet', cols: ['noi_dung'] },
  { table: 'dai_dang_ly_thuyet', cols: ['noi_dung'] },
  { table: 'hgt_chuyen_de_ly_thuyet', cols: ['noi_dung'] },
  { table: 'hgt_dang_ly_thuyet', cols: ['noi_dung'] },
  { table: 'khtn_chuyen_de_ly_thuyet', cols: ['noi_dung'] },
  { table: 'khtn_dang_ly_thuyet', cols: ['noi_dung'] },
  { table: 'hinh_baitoan', cols: ['phat_bieu', 'gia_thiet_phu', 'gia_thiet_rieng'] },
  { table: 'hinh_baitoan_bien_the', cols: ['de_bai', 'loi_giai'] },
  { table: 'hinh_bo_de', cols: ['phat_bieu'] },
  { table: 'hinh_bo_de_ly_thuyet', cols: ['noi_dung'] },
  { table: 'hinh_cach_giai', cols: ['loi_giai'] },
  { table: 'hinh_dang_ly_thuyet', cols: ['noi_dung'] },
  { table: 'hinh_mo_hinh', cols: ['gia_thiet', 'gia_thiet_them'] },
  { table: 'hinh_mo_hinh_ly_thuyet', cols: ['noi_dung'] },
  { table: 'hinh_y', cols: ['noi_dung', 'dap_an', 'loi_giai'] },
  { table: 'hinh_bai', cols: ['de_bai'] },
]

// ── Y HỆT ui.tsx (MathText) ──
const MATH_RE = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g
const fixTex = (s: string) => s
  .replace(/\\frac(?![a-zA-Z])/g, '\\dfrac')
  .replace(/\\vec\s*\{([A-Za-z][A-Za-z0-9']*)\}/g, (m, arg: string) => (arg.length >= 2 ? `\\overrightarrow{${arg}}` : m))
function oddDollars(s: string): boolean {
  let n = 0
  for (let i = 0; i < s.length; i++) if (s[i] === '$' && s[i - 1] !== '\\') n++
  return n % 2 === 1
}
type Loi = { table: string; key: string; col: string; formula: string; err: string }
function checkText(s: string, ctx: { table: string; key: string; col: string }, out: Loi[], stat: { formulas: number; odd: number }) {
  if (!s || !s.includes('$')) return
  if (oddDollars(s)) stat.odd++
  MATH_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = MATH_RE.exec(s))) {
    const f = (m[1] ?? m[2]) as string
    stat.formulas++
    try { katex.renderToString(fixTex(f), { displayMode: m[1] != null, throwOnError: true, output: 'html', strict: 'ignore', macros: katexMacros() }) }
    catch (e: any) { out.push({ ...ctx, formula: f, err: String(e?.message ?? e).replace(/^KaTeX parse error: /, '') }) }
  }
}
// jsonb (lua_chon: string[] · menh_de: {noi_dung, loi_giai…}[]) → mọi chuỗi bên trong.
function strings(v: unknown, acc: string[] = []): string[] {
  if (typeof v === 'string') acc.push(v)
  else if (Array.isArray(v)) v.forEach((x) => strings(x, acc))
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, acc))
  return acc
}

async function main() {
  const client = new pg.Client({ connectionString: loadUrl(), ssl: { rejectUnauthorized: false } })
  await client.connect()
  await client.query('BEGIN; SET TRANSACTION READ ONLY;')
  const loi: Loi[] = []
  const rows: string[] = []
  let tongForm = 0, tongLoi = 0
  for (const t of TABLES) {
    const colsQ = await client.query(
      `select a.attname, (select true from pg_index i where i.indrelid = a.attrelid and i.indisprimary and a.attnum = any(i.indkey)) as pk
       from pg_attribute a where a.attrelid = to_regclass($1) and a.attnum > 0 and not a.attisdropped`, [`public.${t.table}`])
    if (colsQ.rowCount === 0) { rows.push(`| ${t.table} | — | — | — | — | *(bảng không tồn tại — bỏ qua)* |`); continue }
    const names = new Set(colsQ.rows.map((r) => r.attname as string))
    const keyCol = names.has('ma_cau') ? 'ma_cau' : names.has('ma') ? 'ma' : (colsQ.rows.find((r) => r.pk)?.attname as string | undefined) ?? 'id'
    const cols = t.cols.filter((c) => names.has(c))
    const skipped = t.cols.filter((c) => !names.has(c))
    const where = names.has('xoa_at') ? 'where xoa_at is null' : ''
    const res = await client.query(`select ${[keyCol, ...cols].map((c) => `"${c}"`).join(', ')} from "${t.table}" ${where}`)
    const stat = { formulas: 0, odd: 0 }
    const before = loi.length
    const rowsWithErr = new Set<string>()
    for (const r of res.rows) {
      for (const c of cols) {
        const n0 = loi.length
        for (const s of strings(r[c])) checkText(s, { table: t.table, key: String(r[keyCol]), col: c }, loi, stat)
        if (loi.length > n0) rowsWithErr.add(String(r[keyCol]))
      }
    }
    const nLoi = loi.length - before
    tongForm += stat.formulas; tongLoi += nLoi
    rows.push(`| ${t.table} | ${res.rowCount} | ${stat.formulas} | ${nLoi} | ${rowsWithErr.size} | ${stat.odd}${skipped.length ? ` · *bỏ qua cột ${skipped.join(', ')}*` : ''} |`)
    console.log(`${t.table.padEnd(30)} dòng ${String(res.rowCount).padStart(6)}  công thức ${String(stat.formulas).padStart(7)}  lỗi ${String(nLoi).padStart(5)}  (${rowsWithErr.size} dòng)  $ lẻ ${stat.odd}`)
  }
  await client.query('ROLLBACK')
  await client.end()

  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date()).reduce((a, x) => ((a[x.type] = x.value), a), {} as Record<string, string>)
  const stamp = `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`
  const md: string[] = [
    `# Kiểm công thức KaTeX trong dữ liệu cũ — ${stamp} (CHỈ ĐỌC, chưa sửa gì)`, '',
    `Tổng: **${tongForm}** công thức · **${tongLoi}** parse lỗi. Render giống app (cùng tiền xử lý + macro).`, '',
    '| bảng | dòng quét | công thức | lỗi | dòng có lỗi | $ lẻ (thiếu đóng) |', '|---|---|---|---|---|---|', ...rows, '',
    '## Danh sách lỗi (bảng · mã · cột · công thức · lỗi KaTeX)', '',
    '| bảng | mã | cột | công thức | lỗi |', '|---|---|---|---|---|',
    ...loi.map((l) => `| ${l.table} | ${l.key} | ${l.col} | \`${l.formula.replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 120)}\` | ${l.err.replace(/\|/g, '\\|').slice(0, 140)} |`),
  ]
  const outPath = outArg ?? join(root, 'scripts', 'tmp', `kiem-cong-thuc-${p.year}${p.month}${p.day}${p.hour}${p.minute}.md`)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, md.join('\n'), 'utf8')
  console.log(`\nTổng ${tongForm} công thức · ${tongLoi} lỗi → ${outPath}`)
}
main().catch((e) => { console.error('❌', e?.message ?? e); process.exit(1) })
