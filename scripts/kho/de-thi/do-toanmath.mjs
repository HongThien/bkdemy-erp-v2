// do-toanmath.mjs — CHỈ ĐỌC. Đo bộ đề toanmath đã tải (E:\BK ACADEMY\Tài liệu tham khảo\_toanmath-danh-sach.csv)
// so với DB: dòng CSV (1 bài đăng = 1 hoặc nhiều đề) nào đã có trong kho.
// Nhân chứng: (1) sha256 file ∈ tai_lieu.cau_hinh.deThi.sha256 · (2) sha256 ∈ nhap_kho_log
//             (3) tên file (bỏ đuôi) ∈ dai_cau_hoi/hgt_cau_hoi.ten_de_goc (lượt Word K12 không tạo tai_lieu).
//   node --env-file=.env scripts/kho/de-thi/do-toanmath.mjs [--goc "E:\BK ACADEMY\Tài liệu tham khảo"] [--ra <file.json>]
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import pg from 'pg'

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const GOC = arg('--goc', 'E:\\BK ACADEMY\\Tài liệu tham khảo')
const RA = arg('--ra', null)

const parse = (l) => { const r = []; let c = '', q = false; for (const ch of l) { if (ch === '"') { q = !q; continue } if (ch === ',' && !q) { r.push(c); c = ''; continue } c += ch } r.push(c); return r }
const csv = fs.readFileSync(path.join(GOC, '_toanmath-danh-sach.csv'), 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/)
const head = parse(csv[0]); const rows = csv.slice(1).map((l) => Object.fromEntries(parse(l).map((v, i) => [head[i], v])))

const DUOI = /\.(pdf|docx?|zip|rar)$/i
const walk = (p) => { if (!fs.existsSync(p)) return []; const st = fs.statSync(p); if (st.isFile()) return DUOI.test(p) ? [p] : []
  return fs.readdirSync(p).flatMap((f) => walk(path.join(p, f))) }
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
await c.query('set default_transaction_read_only = on')
const tl = new Map((await c.query(`select cau_hinh->'deThi'->>'sha256' s, id, ten, cau_hinh->>'kieu' kieu from tai_lieu where loai='de_thi' and cau_hinh->'deThi'->>'sha256' is not null`)).rows.map((r) => [r.s, r]))
const log = new Set((await c.query(`select sha256 from nhap_kho_log`)).rows.map((r) => r.sha256))
const tdg = new Map()
for (const t of ['dai_cau_hoi', 'hgt_cau_hoi']) for (const r of (await c.query(`select ten_de_goc t, count(*)::int n from ${t} where ten_de_goc is not null group by 1`)).rows) tdg.set(r.t, (tdg.get(r.t) || 0) + r.n)
await c.end()

const kq = []
let i = 0
for (const r of rows) {
  const base = path.join(GOC, r.khoi, ...r.folder.split('/'), r.ten_bai)
  const files = [...walk(base + '.pdf'), ...walk(base)]
  const f = files.map((p) => { const s = sha(p); const ten = path.basename(p).replace(DUOI, '')
    return { p: path.relative(GOC, p), duoi: path.extname(p).slice(1).toLowerCase(), tl: tl.get(s)?.id ?? null, log: log.has(s), tdg: tdg.get(ten) ?? tdg.get(ten.slice(0, 200)) ?? 0 } })
  const co = f.some((x) => x.tl || x.log || x.tdg)
  kq.push({ khoi: r.khoi, folder: r.folder, ten_bai: r.ten_bai, ghi_chu: r.ghi_chu, so_file: f.length, so_file_co: f.filter((x) => x.tl || x.log || x.tdg).length, co, files: f })
  if (++i % 200 === 0) console.error(`… ${i}/${rows.length}`)
}

const g = {}
for (const x of kq) { const k = `${x.khoi.padEnd(4)} ${x.folder}`; g[k] ??= { bai: 0, co: 0, thieu_file: 0, file: 0, file_co: 0 }
  const o = g[k]; o.bai++; if (x.co) o.co++; if (!x.so_file) o.thieu_file++; o.file += x.so_file; o.file_co += x.so_file_co }
console.log('khối folder'.padEnd(30), 'bài', 'đã có', 'chưa', 'không thấy file', '| file', 'file đã có')
let T = { bai: 0, co: 0, thieu_file: 0, file: 0, file_co: 0 }
for (const k of Object.keys(g).sort()) { const o = g[k]; for (const z in T) T[z] += o[z]
  console.log(k.padEnd(30), String(o.bai).padStart(4), String(o.co).padStart(5), String(o.bai - o.co).padStart(5), String(o.thieu_file).padStart(6), '|', String(o.file).padStart(5), String(o.file_co).padStart(5)) }
console.log('TỔNG'.padEnd(30), T)
if (RA) fs.writeFileSync(RA, JSON.stringify(kq, null, 1))
