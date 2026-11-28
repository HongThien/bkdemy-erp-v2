// Quét kho Hình–Học: câu Hình NHIỀU Ý còn nằm nguyên một câu HHC (chưa tách thành HHB + ý) — luật spec-giai-bai "Mặc định vào kho là đã tách ý" (Thùy 28/11).
// CHỈ ĐỌC. Dùng: node scripts/kho/hh-quet-chua-tach-y.mjs [số ngày gần đây, mặc định 10; 0 = toàn kho] [--ds]
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const env = fs.readFileSync('.env', 'utf8')
const url = (env.match(/^\s*DATABASE_URL_RO\s*=\s*(.+?)\s*$/m) ?? env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m))[1].replace(/^["']|["']$/g, '')
const ngay = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 10)
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c.connect()
const rows = (await c.query(`select b.khoi, to_char(q.created_at at time zone 'Asia/Ho_Chi_Minh','YYYY-MM-DD') ngay, q.ma_cau, q.noi_dung
  from hinh_hoc_cau_hoi q join hinh_hoc_bai b on b.ma_bai = q.dang_chinh
 where q.xoa_at is null and q.bai_y is null and not q.rut_khoi_kho and q.parent_ma_cau is null and q.loai_cau in ('tu_luan','tra_loi_ngan')
   and ($1::int = 0 or q.created_at > now() - make_interval(days => $1::int))
   and not exists (select 1 from hinh_hoc_bai_y y where y.ma_cau_goc = q.ma_cau and y.xoa_at is null)`, [ngay])).rows
await c.end()
const A = /(^|\n)\s*(\*\*)?a\)/, B = /(^|\n)\s*(\*\*)?b\)/
const m = rows.filter((r) => A.test(r.noi_dung) && B.test(r.noi_dung))
const g = new Map()
for (const r of m) { const k = `K${r.khoi} · ${r.ngay}`; if (!g.has(k)) g.set(k, []); g.get(k).push(r.ma_cau) }
for (const [k, v] of [...g].sort()) console.log(k.padEnd(18), String(v.length).padStart(4), process.argv.includes('--ds') ? v.join(' ') : v.slice(0, 5).join(' ') + (v.length > 5 ? ' …' : ''))
console.log(`\nTổng câu Hình nhiều ý chưa tách: ${m.length} / ${rows.length} câu ${ngay ? `nhập trong ${ngay} ngày` : 'toàn kho'}`)
