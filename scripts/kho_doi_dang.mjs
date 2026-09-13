// ============================================================================
// kho_doi_dang.mjs — in "bài học đổi dạng": người duyệt đã sửa dạng của câu/mệnh đề ra sao
// (bảng kho_doi_dang_log, mig 202609132226). Claude chạy TRƯỚC bước gán dạng trong /nhap-kho
// để không lặp lại lỗi cũ (CEO 13/09).
//   node scripts/kho_doi_dang.mjs --subject hgt [--khoi 12] [--tu 2026-09-01] [--json]
// Đọc bằng DATABASE_URL_RO (chỉ SELECT). Mỗi dòng: dạng cũ → dạng mới · số lần · 3 ví dụ đề.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import pg from 'pg'

const args = {}
const av = process.argv.slice(2)
for (let i = 0; i < av.length; i++) if (av[i].startsWith('--')) { const n = av[i + 1]; if (!n || n.startsWith('--')) args[av[i].slice(2)] = true; else { args[av[i].slice(2)] = n; i++ } }
if (!['dai', 'hgt', 'khtn'].includes(args.subject)) { console.error('❌ --subject dai|hgt|khtn'); process.exit(2) }

const env = {}
for (const f of ['.env', '.env.local']) if (existsSync(f)) for (const l of readFileSync(f, 'utf8').split(/\r?\n/)) {
  if (!l.includes('=') || l.trim().startsWith('#')) continue
  const i = l.indexOf('='); env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '')
}
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
try {
  const { rows } = await c.query(`select * from fn_kho_doi_dang_tk($1, $2, $3)`, [args.subject, args.khoi ?? null, args.tu ?? null])
  if (args.json) { process.stdout.write(JSON.stringify(rows, null, 2) + '\n') }
  else {
    console.log(`# Đổi dạng khi duyệt — ${args.subject}${args.khoi ? ' K' + args.khoi : ''}${args.tu ? ' từ ' + args.tu : ''} — ${rows.length} cặp`)
    for (const r of rows) {
      console.log(`\n${r.dang_cu} (${r.ten_cu}) → ${r.dang_moi} (${r.ten_moi}) · ${r.so_lan} lần · lần cuối ${new Date(r.lan_cuoi).toISOString().slice(0, 10)}`)
      for (const vd of r.vi_du ?? []) console.log('   - ' + String(vd).replace(/\s+/g, ' ').slice(0, 160))
    }
  }
} finally { await c.end() }
