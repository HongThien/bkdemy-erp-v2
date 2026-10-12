// ============================================================================
// tu-duyet.mjs — TỰ DUYỆT các câu của một lô đã ghi qua cổng (ghi-lo.mjs), cho khối mà CEO đã cho phép.
//
//   node scripts/kho/sach/tu-duyet.mjs <lô.json> [<lô2.json> …] --sach "<tên sách ghi ở ten_de_goc>" [--ghi]
//
// VÌ SAO có file này: Thùy 10/10/2026 — "bài của 8T, m auto duyệt đưa vào kho luôn nhé". Đây là quyết định RIÊNG cho khối 8T
// (kho-rules/dai/k8T.md §10); các khối khác vẫn theo luật lên cấp của spec-luong-kho.md (đo tỉ lệ lọt rồi mới tự duyệt).
// Chỉ khối có tên trong DUOC_TU_DUYET mới chạy được — thêm khối = CEO nói, ghi nhật ký của khối đó.
//
// Duyệt = da_duyet = true, duyet_nguon = 'ai' (trigger _kho_cau_duyet_nguon tự điền duyet_at; duyet_boi để trống — không ai bấm).
// KHÔNG tự duyệt (để người):
//   · câu ở dạng chờ …000000 (DB cũng chặn)            · câu cổng gắn cờ kiem_may = 'nghi'
//   · câu lô đánh dấu `cho_quyet` (đang chờ CEO quyết — có trên trang "câu cần chị xem")
//   · câu không phải do dây chuyền này ghi (giai_method ≠ 'claude_code') hoặc không thuộc lô đưa vào
// Không --ghi: chạy thử, ROLLBACK.
// ============================================================================
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const DUOC_TU_DUYET = ['8T']
const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const GHI = a.includes('--ghi'), SACH = lay('--sach')
const tep = a.filter((x, i) => !x.startsWith('--') && a[i - 1] !== '--sach')
if (!tep.length || !SACH) { console.error('Dùng: node scripts/kho/sach/tu-duyet.mjs <lô.json> … --sach "<tên sách>" [--ghi]'); process.exit(2) }
const lo = tep.flatMap((t) => JSON.parse(readFileSync(t, 'utf8')))
const khoi = [...new Set(lo.map((c) => c.khoi))]
if (khoi.length !== 1 || !DUOC_TU_DUYET.includes(khoi[0])) { console.error(`❌ Khối ${khoi.join(', ')} chưa được CEO cho tự duyệt (được: ${DUOC_TU_DUYET.join(', ')}).`); process.exit(2) }

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
try {
  await db.query('begin')
  const choQuyet = new Map(lo.filter((c) => c.cho_quyet).map((c) => [`${SACH} · ${c.ma_nguon}`, c.cho_quyet]))
  const nguon = lo.map((c) => `${SACH} · ${c.ma_nguon}`)
  const { rows } = await db.query(`select ma_cau, ten_de_goc, dang_chinh, da_duyet, kiem_may, giai_method from dai_cau_hoi where xoa_at is null and ten_de_goc = any($1::text[])`, [nguon])
  const duyet = [], bo = []
  for (const r of rows) {
    if (r.da_duyet) continue
    const ly = /000000$/.test(r.dang_chinh) ? 'đang ở dạng chờ' : r.kiem_may === 'nghi' ? 'cổng gắn cờ nghi' : r.giai_method !== 'claude_code' ? `giai_method = ${r.giai_method}` : choQuyet.get(r.ten_de_goc) ? `chờ CEO quyết: ${choQuyet.get(r.ten_de_goc)}` : null
    if (ly) bo.push(`${r.ma_cau} (${r.ten_de_goc.slice(SACH.length + 3)}): ${ly}`); else duyet.push(r)
  }
  if (duyet.length) await db.query(`update dai_cau_hoi set da_duyet = true, duyet_nguon = 'ai' where ma_cau = any($1::text[])`, [duyet.map((r) => r.ma_cau)])
  const dem = duyet.reduce((o, r) => { o[r.kiem_may ?? 'null'] = (o[r.kiem_may ?? 'null'] || 0) + 1; return o }, {})
  const { rows: [t] } = await db.query(`select count(*) filter (where da_duyet) duyet, count(*) filter (where not da_duyet) chua from dai_cau_hoi where xoa_at is null and left(dang_chinh, 4) = $1`, ['T1' + khoi[0]])
  console.log(`${GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)'} · lô có ${lo.length} câu · thấy trong kho ${rows.length} · đã duyệt từ trước ${rows.filter((r) => r.da_duyet).length} · TỰ DUYỆT ${duyet.length} ${JSON.stringify(dem)} · để người ${bo.length}`)
  for (const x of bo) console.log('   ⏸', x)
  console.log(`  kho Đại ${khoi[0]} sau lượt này: ${t.duyet} đã duyệt · ${t.chua} chưa duyệt`)
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message); process.exitCode = 1 } finally { await db.end() }
