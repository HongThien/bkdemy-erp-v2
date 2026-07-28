// MÔ PHỎNG EXP mới cho 1 lớp/1 tháng — READ-ONLY (không ghi DB). Dùng để cảm nhận + calibrate LEVEL.
//   node scripts/sim_exp.mjs [TEN_LOP] [YYYY-MM]   (mặc định 9A1 2026-07)
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { etRankExp, monthlyBtvnExp, mtExp } from '../src/gami/exp.js'
import { expToLevel, stepCost, cumExpFor } from '../src/gami/level.js'
import { LEVEL } from '../src/gami/config.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const TEN = process.argv[2] || '9A1'
const YM = process.argv[3] || '2026-07'
const [Y, M] = YM.split('-').map(Number)
const from = `${YM}-01`
const to = M === 12 ? `${Y + 1}-01-01` : `${Y}-${String(M + 1).padStart(2, '0')}-01`

const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

const lop = (await q(`select id, ten_lop, mon from lop where ten_lop=$1`, [TEN]))[0]
if (!lop) { console.log('Không thấy lớp', TEN); await c.end(); process.exit(0) }

const buoi = await q(`select id, ngay from buoi_hoc where lop_id=$1 and trang_thai<>'huy' and loai='thuong' and ngay>=$2 and ngay<$3 order by ngay`, [lop.id, from, to])
const buoiIds = buoi.map(b => b.id)

// tên HS
const names = new Map()
for (const r of await q(`select id, ho_ten from hoc_sinh`)) names.set(r.id, r.ho_ten)

// ── ET: rank buổi (đã có sẵn trong history) → EXP ──
const et = await q(`select buoi_hoc_id, hoc_sinh_id, rank, rank_total from gami_elo_history where phase='et' and buoi_hoc_id=any($1)`, [buoiIds])
const etExp = new Map()   // hsId → tổng EXP ET
for (const r of et) {
  if (r.rank == null || r.rank_total == null) continue
  etExp.set(r.hoc_sinh_id, (etExp.get(r.hoc_sinh_id) ?? 0) + etRankExp(r.rank, r.rank_total))
}

// ── BTVN: trạng thái nộp + thái độ (mỗi buổi 1 bài) ──
const btvn = await q(`select buoi_hoc_id, hoc_sinh_id, trang_thai_nop, thai_do from btvn_ket_qua where buoi_hoc_id=any($1)`, [buoiIds])
const baisOf = new Map()   // hsId → [{trangThai, thaiDo}]
for (const r of btvn) { (baisOf.get(r.hoc_sinh_id) ?? baisOf.set(r.hoc_sinh_id, []).get(r.hoc_sinh_id)).push({ trangThai: r.trang_thai_nop, thaiDo: r.thai_do }) }

// điểm BTVN (độ đúng) từ gami_grades phase='btvn': acc buổi = pts/(n×100); acc tháng = TB các buổi
const grades = await q(`select p.buoi_hoc_id, g.hoc_sinh_id, count(*)::int n, sum(g.points)::float pts
  from gami_grades g join gami_session_problems p on p.id=g.problem_id
  where p.phase='btvn' and p.buoi_hoc_id=any($1) group by p.buoi_hoc_id, g.hoc_sinh_id`, [buoiIds])
const accBuois = new Map()  // hsId → [acc buổi]
for (const r of grades) { const acc = r.n ? r.pts / (r.n * 100) : 0; (accBuois.get(r.hoc_sinh_id) ?? accBuois.set(r.hoc_sinh_id, []).get(r.hoc_sinh_id)).push(acc) }
const accOf = new Map()     // hsId → acc tháng
for (const [id, arr] of accBuois) accOf.set(id, arr.reduce((s, x) => s + x, 0) / arr.length)
const accVals = [...accOf.values()]
const classMeanAcc = accVals.length ? accVals.reduce((s, x) => s + x, 0) / accVals.length : null

// ── MT: diem_thi rỗng → 0 (chờ nhập thang-10) ──
const mtRows = await q(`select count(*)::int c from diem_thi`)
const mtEmpty = mtRows[0].c === 0

// ── Gom mọi HS ──
const hsIds = new Set([...etExp.keys(), ...baisOf.keys()])
const out = []
for (const id of hsIds) {
  const et_ = etExp.get(id) ?? 0
  const bais = baisOf.get(id) ?? []
  const b = monthlyBtvnExp(bais, accOf.get(id) ?? null, classMeanAcc)
  const mt_ = 0
  const total = et_ + b.total + mt_
  out.push({ id, ten: names.get(id) ?? id.slice(0, 8), et: et_, btvn: b, mt: mt_, total, acc: accOf.get(id) })
}
out.sort((a, z) => z.total - a.total)

// ── IN ──
console.log(`\n════ EXP THÁNG ${YM} · ${TEN} (${lop.mon}) — ${out.length} HS · ${buoi.length} buổi · MT ${mtEmpty ? 'rỗng→0' : 'có'} ════`)
console.log(`TB độ-đúng BTVN lớp = ${classMeanAcc != null ? (classMeanAcc * 100).toFixed(0) + '%' : '-'}`)
console.log('\n#   Học sinh              ET   BTVNsub +full +lớp −lớp −miss  BTVN    MT   TỔNG   Lv  (acc)')
let sET = 0, sB = 0
out.forEach((r, i) => {
  const b = r.btvn; const lv = expToLevel(r.total)
  sET += r.et; sB += b.total
  const pad = (s, n) => String(s).padEnd(n); const P = (s, n) => String(s).padStart(n)
  console.log(`${P(i + 1, 2)}  ${pad(r.ten, 20)} ${P(r.et, 4)}  ${P(b.subtotal, 5)} ${P('+' + b.fullMonth, 4)} ${P((b.classHi ? '+' + b.classHi : '·'), 4)} ${P((b.classLo ? b.classLo : '·'), 4)} ${P((b.missPenalty ? b.missPenalty : '·'), 5)} ${P(b.total, 5)} ${P(r.mt, 4)} ${P(r.total, 5)}  L${P(lv.level, 2)} ${r.acc != null ? '(' + (r.acc * 100).toFixed(0) + '%)' : ''}`)
})
const sTot = sET + sB
console.log(`\nTỔNG lớp: ET ${sET} · BTVN ${sB} · TỔNG ${sTot} — BTVN chiếm ${(sB / sTot * 100).toFixed(0)}% (mục tiêu ~50%)`)
const avg = Math.round(sTot / out.length)
console.log(`TB/HS tháng này ≈ ${avg} EXP`)

// ── LEVEL: thang hiện tại + ngưỡng để calibrate ──
console.log(`\n── LEVEL thang hiện tại (BASE_COST=${LEVEL.BASE_COST}, GROWTH=${LEVEL.GROWTH}, MAX=${LEVEL.MAX}) ──`)
console.log(`  stepCost: L1→2=${stepCost(1)} · L5→6=${stepCost(5)} · L10→11=${stepCost(10)} · L20→21=${stepCost(20)}`)
const marks = [3, 6, 9, 12, 15, 18, 21]
console.log('  cumExp đạt Lx: ' + marks.map(L => `L${L}=${cumExpFor(L)}`).join(' · '))
console.log(`  → với TB/HS ${avg}/tháng, ước 1 mùa (~9 tháng) ≈ ${avg * 9} EXP; top ${out[0].total}/tháng → ~${out[0].total * 9}/mùa`)

await c.end()
