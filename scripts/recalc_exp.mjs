// XEM TRƯỚC (READ-ONLY) EXP theo engine MỚI (exp.js), per (HS×môn) cho MÙA hiện tại — KHÔNG ghi gì.
// EXP = chăm chỉ: ET rank buổi + BTVN theo tháng + MT(rỗng→0). Cộng dồn trong mùa → tổng → Level. So ledger hiện tại.
//   node scripts/recalc_exp.mjs [YYYY-YY]   (mặc định 2026-27)
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { etRankExp, monthlyBtvnExp } from '../src/gami/exp.js'
import { expToLevel } from '../src/gami/level.js'
import { seasonStartUtc } from '../src/gami/season.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const MUA = process.argv.find(a => /^\d{4}-\d{2}$/.test(a)) || '2026-27'
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

const y0 = Number(MUA.split('-')[0])
const monthsOfMua = []
for (let i = 0; i < 12; i++) { const m = 7 + i; const yy = m > 12 ? y0 + 1 : y0; const mm = ((m - 1) % 12) + 1; monthsOfMua.push(`${yy}-${String(mm).padStart(2, '0')}`) }

const lops = await q(`select id, ten_lop, mon from lop where mon in ('Toán','KHTN') order by ten_lop`)

async function monthExp(lop, ym) {
  const [Y, M] = ym.split('-').map(Number)
  const from = `${ym}-01`, to = M === 12 ? `${Y + 1}-01-01` : `${Y}-${String(M + 1).padStart(2, '0')}-01`
  const buoi = await q(`select id from buoi_hoc where lop_id=$1 and trang_thai<>'huy' and loai='thuong' and ngay>=$2 and ngay<$3`, [lop.id, from, to])
  const bIds = buoi.map(b => b.id); if (!bIds.length) return []
  const et = await q(`select hoc_sinh_id, rank, rank_total from gami_elo_history where phase='et' and buoi_hoc_id=any($1)`, [bIds])
  const etExp = new Map(); for (const r of et) if (r.rank != null && r.rank_total != null) etExp.set(r.hoc_sinh_id, (etExp.get(r.hoc_sinh_id) ?? 0) + etRankExp(r.rank, r.rank_total))
  const btvn = await q(`select hoc_sinh_id, trang_thai_nop, thai_do from btvn_ket_qua where buoi_hoc_id=any($1)`, [bIds])
  const baisOf = new Map(); for (const r of btvn) (baisOf.get(r.hoc_sinh_id) ?? baisOf.set(r.hoc_sinh_id, []).get(r.hoc_sinh_id)).push({ trangThai: r.trang_thai_nop, thaiDo: r.thai_do })
  const grades = await q(`select g.hoc_sinh_id, p.buoi_hoc_id, count(*)::int n, sum(g.points)::float pts from gami_grades g join gami_session_problems p on p.id=g.problem_id where p.phase='btvn' and p.buoi_hoc_id=any($1) group by g.hoc_sinh_id, p.buoi_hoc_id`, [bIds])
  const accB = new Map(); for (const r of grades) { const a = r.n ? r.pts / (r.n * 100) : 0; (accB.get(r.hoc_sinh_id) ?? accB.set(r.hoc_sinh_id, []).get(r.hoc_sinh_id)).push(a) }
  const accOf = new Map(); for (const [id, arr] of accB) accOf.set(id, arr.reduce((s, x) => s + x, 0) / arr.length)
  const av = [...accOf.values()]; const mean = av.length ? av.reduce((s, x) => s + x, 0) / av.length : null
  const ids = new Set([...etExp.keys(), ...baisOf.keys()])
  const out = []
  for (const id of ids) { const et_ = etExp.get(id) ?? 0; const b = monthlyBtvnExp(baisOf.get(id) ?? [], accOf.get(id) ?? null, mean); out.push({ hsId: id, total: et_ + b.total }) }
  return out
}

const total = new Map(); const monthsSeen = new Set()
for (const lop of lops) for (const ym of monthsOfMua) {
  const rows = await monthExp(lop, ym)
  if (rows.length) monthsSeen.add(ym)
  for (const r of rows) if (r.total > 0) { const k = r.hsId + '|' + lop.mon; total.set(k, (total.get(k) ?? 0) + r.total) }
}

const startUtc = seasonStartUtc(MUA)
const oldLedger = await q(`select hoc_sinh_id, mon, sum(amount)::int tot from gami_exp_ledger where created_at >= $1 group by hoc_sinh_id, mon`, [startUtc])
let oldSum = 0; for (const r of oldLedger) oldSum += r.tot
let newSum = 0; for (const v of total.values()) newSum += v

console.log(`\n════ XEM TRƯỚC EXP MỚI · MÙA ${MUA} (từ ${startUtc.slice(0,10)}) · ${lops.length} lớp Toán/KHTN ════`)
console.log(`Tháng có dữ liệu: ${[...monthsSeen].sort().join(', ') || '(không có)'}`)
console.log(`\nTỔNG EXP mùa: ledger CŨ ${oldSum.toLocaleString()} → MỚI ${newSum.toLocaleString()}  ·  ${total.size} cặp HS×môn`)
const lvHist = {}; for (const v of total.values()) { const L = expToLevel(v).level; lvHist[L] = (lvHist[L] ?? 0) + 1 }
console.log('Phân bố Level (mới):', Object.keys(lvHist).map(Number).sort((a,b)=>a-b).map(L=>`L${L}:${lvHist[L]}`).join(' · '))

console.log('\nLớp        HS   TB-EXP  TB-Lv  (min–max)')
for (const lop of lops) {
  const hs = (await q(`select hoc_sinh_id from hoc_sinh_lop where lop_id=$1 and trang_thai='dang_hoc'`, [lop.id])).map(r => r.hoc_sinh_id)
  const vals = hs.map(id => total.get(id + '|' + lop.mon) ?? 0).filter(v => v > 0)
  if (!vals.length) continue
  const lvs = vals.map(v => expToLevel(v).level)
  const avg = Math.round(vals.reduce((s, x) => s + x, 0) / vals.length)
  const avgLv = (lvs.reduce((s, x) => s + x, 0) / lvs.length).toFixed(1)
  console.log(`${lop.ten_lop.padEnd(10)} ${String(vals.length).padStart(2)}  ${String(avg).padStart(6)}  L${avgLv}  (L${Math.min(...lvs)}–L${Math.max(...lvs)})`)
}
console.log('\n[READ-ONLY] Chưa ghi gì. Đây là số EXP mới sẽ áp khi recalc.')
await c.end()
