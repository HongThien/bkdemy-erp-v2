// CONVERT EXP gộp → CHI TIẾT THEO HOẠT ĐỘNG (08-29). Cùng logic recomputeExpThang (gami.ts):
// • 'exp_et' per (HS×buổi) = etRankExp(rank buổi) · 'exp_btvn' per (HS×buổi) = btvnBaiExp(trạng thái, thái độ)
// • 'exp_btvn_thang' per (HS×tháng) = monthlyBtvnExp.total − subtotal (đủ-tháng/so-lớp/phạt-miss, CÓ THỂ ÂM)
// • Σ dòng chi tiết (HS×tháng) = đúng số 'exp_thang' gộp cũ — script IN đối chiếu từng lệch (nếu có).
// Phạm vi: các (lớp×tháng) của MÙA hiện tại. KHÔNG đụng 'attend_floor' (bù/bổ trợ, per-buổi sẵn rồi).
// Dry-run mặc định (backup + in số). Ghi thật: thêm cờ --write
import { readFileSync, writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { etRankExp, btvnBaiExp, monthlyBtvnExp } from '../src/gami/exp.js'
import { seasonOf } from '../src/gami/season.js'
import { SEASON } from '../src/gami/config.js'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const WRITE = process.argv.includes('--write')
const vnToday = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)
const MUA = seasonOf(vnToday)
const SEASON_START = `${MUA.split('-')[0]}-${String(SEASON.START_MONTH).padStart(2, '0')}-${String(SEASON.START_DAY).padStart(2, '0')}`
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

// ── BACKUP ──
const bk = await q(`select * from gami_exp_ledger`)
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
writeFileSync(join(root, `scripts/_backup_gami_exp_ledger_${stamp}.json`), JSON.stringify(bk))
console.log(`BACKUP → scripts/_backup_gami_exp_ledger_${stamp}.json (${bk.length} dòng)`)
console.log(`Phạm vi: mùa ${MUA} (buổi thường từ ${SEASON_START}, đến hôm nay ${vnToday})`)

// ── FACTS: mọi buổi thường không-huỷ trong mùa, gom theo (lớp×tháng) ──
const buois = await q(`select b.id, b.lop_id, to_char(b.ngay,'YYYY-MM') ym, l.mon
  from buoi_hoc b join lop l on l.id=b.lop_id
  where b.loai='thuong' and b.trang_thai<>'huy' and b.ngay >= $1 and b.ngay <= $2 order by b.ngay`, [SEASON_START, vnToday])
const groups = new Map() // 'lop|ym' → {lopId, ym, mon, buoiIds}
for (const b of buois) {
  const k = b.lop_id + '|' + b.ym
  if (!groups.has(k)) groups.set(k, { lopId: b.lop_id, ym: b.ym, mon: b.mon ?? 'Toán', buoiIds: [] })
  groups.get(k).buoiIds.push(b.id)
}
console.log(`${groups.size} nhóm (lớp×tháng) · ${buois.length} buổi`)

const allNew = []      // dòng chi tiết sẽ chèn
const delMonthKeys = [] // {mon, ym, hsIds} để xoá exp_thang/exp_btvn_thang cũ
const tongMoiHs = new Map() // 'hs|mon|ym' → Σ mới (gộp MỌI lớp — HS chuyển lớp giữa tháng có 2 nhóm)
const soLop = new Map()     // 'hs|mon|ym' → số lớp có sự kiện (đánh dấu chuyển lớp khi đối chiếu)
for (const g of [...groups.values()].sort((a, b) => a.ym.localeCompare(b.ym))) {
  const eh = await q(`select hoc_sinh_id, buoi_hoc_id, rank, rank_total from gami_elo_history where phase='et' and buoi_hoc_id = any($1)`, [g.buoiIds])
  const kq = await q(`select hoc_sinh_id, buoi_hoc_id, trang_thai_nop, thai_do from btvn_ket_qua where buoi_hoc_id = any($1)`, [g.buoiIds])
  const acc = await q(`select g2.hoc_sinh_id, p.buoi_hoc_id, sum(g2.points)::float pts, count(*)::int n
       from gami_grades g2 join gami_session_problems p on p.id=g2.problem_id
       where p.phase='btvn' and p.buoi_hoc_id = any($1) group by 1,2`, [g.buoiIds])
  const perHs = new Map()
  const ensure = (id) => perHs.get(id) ?? perHs.set(id, { et: [], btvn: [], bais: [], acc: [] }).get(id)
  for (const r of eh) if (r.rank != null && r.rank_total != null) ensure(r.hoc_sinh_id).et.push({ buoiId: r.buoi_hoc_id, amount: etRankExp(r.rank, r.rank_total) })
  for (const r of kq) { const a = ensure(r.hoc_sinh_id); a.bais.push({ trangThai: r.trang_thai_nop, thaiDo: r.thai_do }); a.btvn.push({ buoiId: r.buoi_hoc_id, amount: btvnBaiExp(r.trang_thai_nop, r.thai_do) }) }
  for (const r of acc) ensure(r.hoc_sinh_id).acc.push(r.n ? r.pts / (r.n * 100) : 0)
  const means = [...perHs.values()].map((p) => p.acc.length ? p.acc.reduce((s, x) => s + x, 0) / p.acc.length : null).filter((x) => x != null)
  const classMean = means.length ? means.reduce((s, x) => s + x, 0) / means.length : null

  for (const [hs, p] of perHs) {
    const studentAcc = p.acc.length ? p.acc.reduce((s, x) => s + x, 0) / p.acc.length : null
    const bt = monthlyBtvnExp(p.bais, studentAcc, classMean)
    for (const e of p.et) allNew.push({ hoc_sinh_id: hs, source: 'exp_et', amount: e.amount, mon: g.mon, note: g.ym, ref_buoi_hoc_id: e.buoiId })
    for (const e of p.btvn) if (e.amount > 0) allNew.push({ hoc_sinh_id: hs, source: 'exp_btvn', amount: e.amount, mon: g.mon, note: g.ym, ref_buoi_hoc_id: e.buoiId })
    // ref = BUỔI CUỐI tháng của lớp (lớp-scoped, khớp recomputeExpThang) — HS 2 lớp giữ điều chỉnh cả 2 lớp
    const dieuChinh = bt.total - bt.subtotal
    if (dieuChinh !== 0) allNew.push({ hoc_sinh_id: hs, source: 'exp_btvn_thang', amount: dieuChinh, mon: g.mon, note: g.ym, ref_buoi_hoc_id: g.buoiIds[g.buoiIds.length - 1] })
    const k = hs + '|' + g.mon + '|' + g.ym
    tongMoiHs.set(k, (tongMoiHs.get(k) ?? 0) + p.et.reduce((s, e) => s + e.amount, 0) + bt.total)
    soLop.set(k, (soLop.get(k) ?? 0) + 1)
  }
  delMonthKeys.push({ mon: g.mon, ym: g.ym, hsIds: [...perHs.keys()] })
}
// ── ĐỐI CHIẾU per (HS×môn×tháng) GỘP MỌI LỚP với exp_thang gộp cũ. Lệch hợp lệ có 2 nguồn đã biết:
// (1) HS chuyển lớp giữa tháng — model cũ per-lớp GHI ĐÈ, mất phần lớp kia (bug cũ; [2lớp] = số mới ĐÚNG hơn);
// (2) recompute cũ chưa chạy lại sau lần đổi data cuối. Cả 2 đều ghi số MỚI (suy thẳng từ nguồn).
let lech = 0
const oldRows = await q(`select hoc_sinh_id, mon, note, sum(amount)::int tong from gami_exp_ledger where source='exp_thang' group by 1,2,3`)
for (const r of oldRows) {
  const k = r.hoc_sinh_id + '|' + r.mon + '|' + r.note
  const moi = tongMoiHs.get(k)
  if (moi != null && moi !== r.tong) { lech++; console.log(`  LỆCH ${r.mon} ${r.note} hs=${r.hoc_sinh_id}${(soLop.get(k) ?? 1) > 1 ? ` [${soLop.get(k)}lớp]` : ''}: cũ=${r.tong} mới=${moi}`) }
}
const tongMoi = allNew.reduce((s, r) => s + r.amount, 0)
const tongCu = bk.filter((r) => r.source === 'exp_thang' && r.note >= SEASON_START.slice(0, 7)).reduce((s, r) => s + Number(r.amount), 0)
console.log(`Dòng chi tiết mới: ${allNew.length} (et=${allNew.filter(r=>r.source==='exp_et').length} · btvn=${allNew.filter(r=>r.source==='exp_btvn').length} · tháng=${allNew.filter(r=>r.source==='exp_btvn_thang').length})`)
console.log(`Σ mới = ${tongMoi} · Σ exp_thang cũ (mùa) = ${tongCu} · lệch HS: ${lech}`)

if (!WRITE) { console.log('DRY-RUN — không ghi. Thêm --write để ghi thật.'); await c.end(); process.exit(0) }

// ── GHI (transaction): xoá per-buổi cũ theo ref_buoi + dòng tháng cũ theo (source,mon,note,hs) → chèn chi tiết ──
await c.query('begin')
try {
  const allBuoiIds = buois.map((b) => b.id)
  await c.query(`delete from gami_exp_ledger where ref_buoi_hoc_id = any($1)
    and source in ('rank_ingame','rank_et','rank_mt','btvn','exp_et','exp_btvn','exp_btvn_thang')`, [allBuoiIds])
  for (const d of delMonthKeys) if (d.hsIds.length)
    await c.query(`delete from gami_exp_ledger where source='exp_thang' and mon=$1 and note=$2 and hoc_sinh_id = any($3)`, [d.mon, d.ym, d.hsIds])
  for (let i = 0; i < allNew.length; i += 500) {
    const chunk = allNew.slice(i, i + 500)
    const vals = []; const params = []
    chunk.forEach((r, j) => { const o = j * 6; vals.push(`($${o+1},$${o+2},$${o+3},$${o+4},$${o+5},$${o+6})`); params.push(r.hoc_sinh_id, r.source, r.amount, r.mon, r.note, r.ref_buoi_hoc_id) })
    await c.query(`insert into gami_exp_ledger (hoc_sinh_id, source, amount, mon, note, ref_buoi_hoc_id) values ${vals.join(',')}`, params)
  }
  await c.query('commit')
  console.log(`ĐÃ GHI: ${allNew.length} dòng chi tiết (mùa ${MUA}).`)
} catch (e) { await c.query('rollback'); throw e }
await c.end()
