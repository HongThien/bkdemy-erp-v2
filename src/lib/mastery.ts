// Data-layer MASTERY (seam) — suy động (HS × dạng) từ các lần đo, gộp qua engine PURE src/gami/mastery.js.
// KHÔNG lưu — mọi lần gọi tính lại từ measurements. UI chỉ gọi qua đây.
// Nguồn đo: gami_grades (phase ingame/et) + buoi_danh_gia_dang (đánh giá GV) [+ btvn nếu bật toggle].
import { supabase } from './supabase'
import { masteryOfDang, RESULT_VALUE, MASTERY_CONFIG } from '../gami/mastery.js'
import { khoCuaMon } from './tailieu'

const LIMIT = 10000

export type EvalSrc = 'ingame' | 'et' | 'dg' | 'btvn'
export type DangEval = { value: number; t: string; src: EvalSrc } // value 0|0.5|1 · t = ISO · src = nguồn
export type Mastery = { score: number; n: number; muc: 'dat' | 'can_luyen' | 'yeu'; tin: 'cao' | 'tb' | 'thap' }
export type DangMastery = {
  ma_dang: string
  ten_dang: string
  ten_chuyen_de: string
  mastery: Mastery | null // null = CHƯA ĐO (không có lần đo nào)
  evals: DangEval[] // MỚI → CŨ
}

// Nhãn nguồn cho UI.
export const SRC_LABEL: Record<EvalSrc, string> = { ingame: 'IG', et: 'ET', dg: 'ĐG', btvn: 'BT' }

// ── NGUỒN ĐO ONLINE (test online 07-04): bai_lam_cau (verdict ≠ null) = phép đo ──
// ET + ĐỀ THI online → src 'et' (thi có giám sát, VÀO mastery — cùng chế độ THI, xem THI_LOAI HocSinhApp).
// BTVN + giáo-trình online → src 'btvn' (tham khảo — chỉ vào khi bật toggle, đúng chính sách BTVN).
// Duyệt lại (manual/cache) sửa verdict tại chỗ → mastery tự đúng theo (suy động, không sync).
const THI_LOAI = new Set(['et', 'de_thi'])
type OnlineEvalRow = { hoc_sinh_id: string; ma_dang: string | null; value: number; t: string; src: EvalSrc; mon: string }
async function fetchOnlineEvals(hs: string | string[], sinceIso?: string | null): Promise<OnlineEvalRow[]> {
  // Embed 2 tầng FK ĐƠN (bai_lam_id → bai_test_id) + filter trên bảng nhúng qua !inner (pattern loadMasteryCells).
  let q = supabase.from('bai_lam_cau')
    .select('verdict, cham_at, lam:bai_lam_id!inner(hoc_sinh_id, trang_thai, test:bai_test_id(loai, mon)), cau:bai_test_cau_id(ma_dang)')
    .not('verdict', 'is', null).limit(LIMIT)
  q = Array.isArray(hs) ? q.in('lam.hoc_sinh_id', hs) : q.eq('lam.hoc_sinh_id', hs)
  if (sinceIso) q = q.gte('cham_at', sinceIso)
  const { data, error } = await q
  if (error) throw error
  const out: OnlineEvalRow[] = []
  for (const r of (data ?? []) as any[]) {
    const val = RESULT_VALUE[r.verdict as keyof typeof RESULT_VALUE]
    if (val === undefined || !r.lam) continue
    const loai = r.lam.test?.loai
    const laThi = THI_LOAI.has(loai)
    // Chế độ THI chỉ tính khi ĐÃ NỘP (verdict chỉ sinh lúc et_nop, nhưng belt-and-suspenders với backfill duyệt).
    if (laThi && r.lam.trang_thai !== 'da_nop') continue
    out.push({
      hoc_sinh_id: r.lam.hoc_sinh_id, ma_dang: r.cau?.ma_dang ?? null,
      value: val, t: r.cham_at, src: laThi ? 'et' : 'btvn', mon: r.lam.test?.mon ?? '',
    })
  }
  return out
}

// Gom các lần đo của 1 HS (trong 1 MÔN) theo dạng → mastery + timeline.
// opts.includeBTVN: gộp cả phase='btvn' (mặc định KHÔNG — BTVN tham khảo, không vào mastery; toggle để Thùy soi).
// opts.days: chỉ lấy đo trong N ngày gần nhất (30/60/90). Bỏ trống = tất cả.
export async function getMasteryHS(
  hocSinhId: string,
  mon: string,
  opts?: { includeBTVN?: boolean; days?: number },
): Promise<DangMastery[]> {
  const K = khoCuaMon(mon) // banDoTbl theo môn → scope dạng đúng môn (bỏ dạng môn khác)
  const phases: EvalSrc[] = opts?.includeBTVN ? ['ingame', 'et', 'btvn'] : ['ingame', 'et']
  const sinceIso = opts?.days ? new Date(Date.now() - opts.days * 86400_000).toISOString() : null // boundary INSTANT (được phép, §windowing)

  // grades của HS, EMBED thẳng problem (phase, ma_dang) — FK problem_id→gami_session_problems ĐƠN, sạch
  // (khác buoi_hoc_hs 2-FK). 1 query thay 2 + bỏ IN(probIds) tránh URL dài. Song song với đánh giá GV.
  let gq = supabase.from('gami_grades').select('result, graded_at, prob:problem_id(phase, ma_dang)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (sinceIso) gq = gq.gte('graded_at', sinceIso)
  const [{ data: grades }, { data: dgs }, online] = await Promise.all([
    gq,
    (() => {
      let dq = supabase.from('buoi_danh_gia_dang').select('ma_dang, diem, updated_at').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
      if (sinceIso) dq = dq.gte('updated_at', sinceIso)
      return dq
    })(),
    fetchOnlineEvals(hocSinhId, sinceIso),
  ])

  // Gom measures theo ma_dang.
  const byDang: Record<string, DangEval[]> = {}
  const push = (ma: string | null | undefined, ev: DangEval) => { if (!ma) return; (byDang[ma] ??= []).push(ev) }
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob // to-one embed → object (null nếu problem mất, phòng thủ)
    if (!p || !p.ma_dang) continue
    if (!phases.includes(p.phase as EvalSrc)) continue // lọc phase (loại btvn nếu tắt toggle)
    const val = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]
    if (val === undefined) continue
    push(p.ma_dang, { value: val, t: g.graded_at, src: p.phase as EvalSrc })
  }
  for (const d of (dgs ?? []) as any[]) push(d.ma_dang, { value: Number(d.diem), t: d.updated_at, src: 'dg' })
  for (const o of online) if (phases.includes(o.src)) push(o.ma_dang, { value: o.value, t: o.t, src: o.src })

  const maList = Object.keys(byDang)
  if (maList.length === 0) return []

  // Resolve tên dạng + chuyên đề theo MÔN (scope: chỉ dạng thuộc bảng bản đồ của môn này).
  const dangs = ((await supabase.from(K.banDoTbl).select('ma_dang, ten_dang, ten_chuyen_de').in('ma_dang', maList).limit(LIMIT)).data ?? []) as { ma_dang: string; ten_dang: string; ten_chuyen_de: string }[]
  const dangMap = new Map(dangs.map((d) => [d.ma_dang, d]))

  const out: DangMastery[] = []
  for (const ma of maList) {
    const info = dangMap.get(ma)
    if (!info) continue // ma_dang không thuộc môn đang xem → bỏ
    const evals = byDang[ma].sort((a, b) => Date.parse(b.t) - Date.parse(a.t)) // mới → cũ
    out.push({
      ma_dang: ma,
      ten_dang: info.ten_dang,
      ten_chuyen_de: info.ten_chuyen_de,
      mastery: masteryOfDang(evals, MASTERY_CONFIG) as Mastery | null,
      evals,
    })
  }
  // Sort: YẾU trước, rồi MỚI đánh giá lên đầu (như V1: dạng cần chú ý nhất trên cùng).
  const rank = { yeu: 0, can_luyen: 1, dat: 2 } as const
  out.sort((a, b) => {
    const ra = a.mastery ? rank[a.mastery.muc] : 3
    const rb = b.mastery ? rank[b.mastery.muc] : 3
    if (ra !== rb) return ra - rb
    return Date.parse(b.evals[0]?.t ?? '0') - Date.parse(a.evals[0]?.t ?? '0')
  })
  return out
}

// ── TỔNG QUAN 1 HS — chỉ số raw (%ET/%BTVN) + tổng kết (% hoàn thành bản đồ · điểm thi) ──
// %ET/%BTVN = (Đ + ½C)/số câu (mình chấm Đ/C/S, KHÔNG có thang điểm). % hoàn thành = tiến độ ước tính (đạt=1·cần=0.5·yếu=0)/ĐÃ-ĐO + 3 số detail đạt/cần/yếu.
// Điểm thi: Trường (loai='truong') vs Sát hạch (còn lại) — HIỆN TRỐNG (chưa nhập kỳ thi), tự lên khi có data.
// Điểm năng lực: CHƯA (cần cấu trúc đề + phân loại cơ-bản/nâng-cao + Hình) → UI để placeholder.
export type TongQuanHS = {
  pctET: number | null; nET: number
  pctBTVN: number | null; nBTVN: number
  hoanThanh: { dat: number; can_luyen: number; yeu: number; total: number; pct: number }
  diemThi: { satHach: number | null; truong: number | null; nSatHach: number; nTruong: number }
  // TREND = chênh (điểm %) 30 ngày GẦN so với 30 ngày TRƯỚC đó; null = chưa đủ data 1 trong 2 kỳ.
  trend: { et: number | null; btvn: number | null; hoanThanh: number | null }
}
export async function getTongQuanHS(hocSinhId: string, mon: string): Promise<TongQuanHS> {
  const K = khoCuaMon(mon)
  const [{ data: grades }, { data: dgs }, { data: dt }, online] = await Promise.all([
    supabase.from('gami_grades').select('result, graded_at, prob:problem_id(phase, ma_dang)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    supabase.from('buoi_danh_gia_dang').select('ma_dang, diem, updated_at').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    supabase.from('diem_thi').select('diem, ky_thi:ky_thi_id(loai, mon)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    fetchOnlineEvals(hocSinhId),
  ])
  const now = Date.now(), D30 = 30 * 86400_000, cut1 = now - D30, cut2 = now - 2 * D30
  const inRecent = (t: number) => t >= cut1
  const inPrior = (t: number) => t >= cut2 && t < cut1

  let etSum = 0, etN = 0, btSum = 0, btN = 0
  let etR = 0, etRN = 0, etP = 0, etPN = 0, btR = 0, btRN = 0, btP = 0, btPN = 0 // windowed ET/BTVN
  const byDang: Record<string, DangEval[]> = {}
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob; if (!p) continue
    const v = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]; if (v === undefined) continue
    const tm = Date.parse(g.graded_at)
    if (p.phase === 'et') { etSum += v; etN++; if (inRecent(tm)) { etR += v; etRN++ } else if (inPrior(tm)) { etP += v; etPN++ } }
    else if (p.phase === 'btvn') { btSum += v; btN++; if (inRecent(tm)) { btR += v; btRN++ } else if (inPrior(tm)) { btP += v; btPN++ } }
    if ((p.phase === 'ingame' || p.phase === 'et') && p.ma_dang) (byDang[p.ma_dang] ??= []).push({ value: v, t: g.graded_at, src: p.phase as EvalSrc })
  }
  for (const d of (dgs ?? []) as any[]) if (d.ma_dang) (byDang[d.ma_dang] ??= []).push({ value: Number(d.diem), t: d.updated_at, src: 'dg' })
  // Online: scope theo môn của TEST (có sẵn nhãn mon — §1.6); ET vào cả %ET lẫn byDang, btvn/gt chỉ %BTVN.
  for (const o of online) {
    if (o.mon && o.mon !== mon) continue
    const tm = Date.parse(o.t)
    if (o.src === 'et') {
      etSum += o.value; etN++
      if (inRecent(tm)) { etR += o.value; etRN++ } else if (inPrior(tm)) { etP += o.value; etPN++ }
      if (o.ma_dang) (byDang[o.ma_dang] ??= []).push({ value: o.value, t: o.t, src: 'et' })
    } else {
      btSum += o.value; btN++
      if (inRecent(tm)) { btR += o.value; btRN++ } else if (inPrior(tm)) { btP += o.value; btPN++ }
    }
  }

  const maList = Object.keys(byDang)
  let valid = new Set<string>()
  if (maList.length) valid = new Set((((await supabase.from(K.banDoTbl).select('ma_dang').in('ma_dang', maList).limit(LIMIT)).data ?? []) as any[]).map((x) => x.ma_dang))
  // % tiến độ hoàn thành (số CẢM NHẬN tầng trên): đạt=1 · cần luyện=0.5 · yếu=0 → Σ/ĐÃ-ĐO.
  // Trọng số theo BUCKET (khớp 3 số detail đạt/cần/yếu ngay dưới), scope môn; pred = cửa sổ thời gian (cho trend).
  const compPct = (pred?: (t: number) => boolean): { dat: number; can_luyen: number; yeu: number; total: number; pct: number | null } => {
    let d = 0, c = 0, y = 0, t = 0
    for (const ma of maList) {
      if (!valid.has(ma)) continue
      const evs = pred ? byDang[ma].filter((e) => pred(Date.parse(e.t))) : byDang[ma]
      if (!evs.length) continue
      const r = masteryOfDang(evs, MASTERY_CONFIG); if (!r) continue
      t++; if (r.muc === 'dat') d++; else if (r.muc === 'can_luyen') c++; else y++
    }
    return { dat: d, can_luyen: c, yeu: y, total: t, pct: t ? Math.round(((d + c * 0.5) / t) * 100) : null }
  }
  const all = compPct(), hR = compPct(inRecent), hP = compPct(inPrior)

  // Điểm thi theo loại (scope môn).
  let shSum = 0, shN = 0, trSum = 0, trN = 0
  for (const r of (dt ?? []) as any[]) {
    const k = r.ky_thi; if (!k || (k.mon && k.mon !== mon) || r.diem == null) continue
    if (k.loai === 'truong') { trSum += Number(r.diem); trN++ } else { shSum += Number(r.diem); shN++ }
  }

  const pct = (s: number, n: number) => (n ? Math.round((s / n) * 100) : null)
  const delta = (r: number | null, p: number | null) => (r != null && p != null ? r - p : null)
  return {
    pctET: pct(etSum, etN), nET: etN,
    pctBTVN: pct(btSum, btN), nBTVN: btN,
    hoanThanh: { dat: all.dat, can_luyen: all.can_luyen, yeu: all.yeu, total: all.total, pct: all.pct ?? 0 },
    diemThi: { satHach: shN ? +(shSum / shN).toFixed(1) : null, truong: trN ? +(trSum / trN).toFixed(1) : null, nSatHach: shN, nTruong: trN },
    trend: { et: delta(pct(etR, etRN), pct(etP, etPN)), btvn: delta(pct(btR, btRN), pct(btP, btPN)), hoanThanh: delta(hR.pct, hP.pct) },
  }
}

// ── ROLLUP LỚP/KHỐI — mỗi HS: đếm dạng đạt/cần-luyện/yếu (thanh 100% "bộ nhớ iPhone") ──
// BULK: ~4 query cho CẢ lớp (không gọi getMasteryHS từng HS). Tái dùng engine masteryOfDang.
export type HSRollup = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; lop: string | null
  dat: number; can_luyen: number; yeu: number; total: number // total = số dạng ĐÃ ĐO (đạt+cần+yếu)
}
// SHARED: nạp measures 1 phạm vi (lớp/khối) → mastery cell (HS × dạng). Dùng CHUNG cho rollup HS (view#2) + pivot dạng (view#3).
// ~4 query: HS-list → grades(embed)+đánh-giá IN(hsIds) → banDo (tên + scope môn) → engine masteryOfDang mỗi ô.
type CellBundle = {
  hsMap: Map<string, { ho_ten: string; ma_hs: string | null; lop: string | null }>
  hsIds: string[]
  byHS: Map<string, Map<string, Mastery>> // mastery ĐÃ tính (non-null), CHỈ dạng thuộc môn
  dangInfo: Map<string, { ten_dang: string; ten_chuyen_de: string }>
}
export type RollupScope = { mon: string; lopId?: string | null; khoi?: string | null; he?: string | null; includeBTVN?: boolean }
async function loadMasteryCells(opts: RollupScope): Promise<CellBundle> {
  const empty: CellBundle = { hsMap: new Map(), hsIds: [], byHS: new Map(), dangInfo: new Map() }
  const K = khoCuaMon(opts.mon)
  const phases: EvalSrc[] = opts.includeBTVN ? ['ingame', 'et', 'btvn'] : ['ingame', 'et']

  // 1) HS trong phạm vi (lớp / khối / HỆ-band × môn), đang học.
  let sq
  if (opts.lopId) sq = supabase.from('hoc_sinh_lop').select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs), lop:lop_id(ten_lop)').eq('lop_id', opts.lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  else if (opts.khoi) sq = supabase.from('hoc_sinh_lop').select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs), lop:lop_id!inner(ten_lop, khoi, mon)').eq('trang_thai', 'dang_hoc').eq('lop.khoi', opts.khoi).eq('lop.mon', opts.mon).limit(LIMIT)
  else if (opts.he) sq = supabase.from('hoc_sinh_lop').select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs), lop:lop_id!inner(ten_lop, mon), muc:muc_nang_luc_id!inner(bac)').eq('trang_thai', 'dang_hoc').eq('lop.mon', opts.mon).eq('muc.bac', opts.he).limit(LIMIT)
  else return empty
  const { data: sd, error: se } = await sq
  if (se) throw se
  const hsMap = new Map<string, { ho_ten: string; ma_hs: string | null; lop: string | null }>()
  for (const r of (sd ?? []) as any[]) { const h = r.hoc_sinh; if (h && !hsMap.has(h.id)) hsMap.set(h.id, { ho_ten: h.ho_ten, ma_hs: h.ma_hs, lop: r.lop?.ten_lop ?? null }) }
  const hsIds = [...hsMap.keys()]
  if (hsIds.length === 0) return { ...empty, hsMap }

  // 2) measures BULK.
  const [{ data: grades }, { data: dgs }, online] = await Promise.all([
    supabase.from('gami_grades').select('hoc_sinh_id, result, graded_at, prob:problem_id(phase, ma_dang)').in('hoc_sinh_id', hsIds).limit(LIMIT),
    supabase.from('buoi_danh_gia_dang').select('hoc_sinh_id, ma_dang, diem, updated_at').in('hoc_sinh_id', hsIds).limit(LIMIT),
    fetchOnlineEvals(hsIds),
  ])
  const evByHS = new Map<string, Map<string, DangEval[]>>()
  const allMa = new Set<string>()
  const add = (hsId: string, ma: string | null | undefined, ev: DangEval) => {
    if (!ma) return
    allMa.add(ma)
    let m = evByHS.get(hsId); if (!m) { m = new Map(); evByHS.set(hsId, m) }
    const arr = m.get(ma) ?? []; arr.push(ev); m.set(ma, arr)
  }
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob; if (!p || !p.ma_dang || !phases.includes(p.phase as EvalSrc)) continue
    const val = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]; if (val === undefined) continue
    add(g.hoc_sinh_id, p.ma_dang, { value: val, t: g.graded_at, src: p.phase as EvalSrc })
  }
  for (const d of (dgs ?? []) as any[]) add(d.hoc_sinh_id, d.ma_dang, { value: Number(d.diem), t: d.updated_at, src: 'dg' })
  for (const o of online) if (phases.includes(o.src)) add(o.hoc_sinh_id, o.ma_dang, { value: o.value, t: o.t, src: o.src })

  // 3) tên dạng + scope MÔN (banDo của môn → chỉ giữ dạng hợp lệ).
  const dangInfo = new Map<string, { ten_dang: string; ten_chuyen_de: string }>()
  if (allMa.size) {
    const dd = ((await supabase.from(K.banDoTbl).select('ma_dang, ten_dang, ten_chuyen_de').in('ma_dang', [...allMa]).limit(LIMIT)).data ?? []) as any[]
    for (const x of dd) dangInfo.set(x.ma_dang, { ten_dang: x.ten_dang, ten_chuyen_de: x.ten_chuyen_de })
  }

  // 4) mastery cell (HS × dạng thuộc môn).
  const byHS = new Map<string, Map<string, Mastery>>()
  for (const hsId of hsIds) {
    const em = evByHS.get(hsId); if (!em) continue
    const cm = new Map<string, Mastery>()
    for (const [ma, evals] of em) { if (!dangInfo.has(ma)) continue; const r = masteryOfDang(evals, MASTERY_CONFIG) as Mastery | null; if (r) cm.set(ma, r) }
    if (cm.size) byHS.set(hsId, cm)
  }
  return { hsMap, hsIds, byHS, dangInfo }
}

export async function getMasteryRollup(opts: RollupScope): Promise<HSRollup[]> {
  const { hsMap, hsIds, byHS } = await loadMasteryCells(opts)
  const out: HSRollup[] = []
  for (const hsId of hsIds) {
    const info = hsMap.get(hsId)!
    const cm = byHS.get(hsId)
    let dat = 0, can = 0, yeu = 0
    if (cm) for (const r of cm.values()) { if (r.muc === 'dat') dat++; else if (r.muc === 'can_luyen') can++; else yeu++ }
    out.push({ hoc_sinh_id: hsId, ho_ten: info.ho_ten, ma_hs: info.ma_hs, lop: info.lop, dat, can_luyen: can, yeu, total: dat + can + yeu })
  }
  return out
}

// PIVOT dạng (view#3): mỗi dạng — bao nhiêu HS đạt/cần-luyện/yếu → "dạng nào cả lớp yếu nhất".
export type DangRollup = { ma_dang: string; ten_dang: string; ten_chuyen_de: string; dat: number; can_luyen: number; yeu: number; tin_thap: number; total: number }
export async function getMasteryByDang(opts: RollupScope): Promise<DangRollup[]> {
  const { byHS, dangInfo } = await loadMasteryCells(opts)
  const byDang = new Map<string, Mastery[]>()
  for (const cm of byHS.values()) for (const [ma, r] of cm) { const arr = byDang.get(ma) ?? []; arr.push(r); byDang.set(ma, arr) }
  const out: DangRollup[] = []
  for (const [ma, cells] of byDang) {
    const info = dangInfo.get(ma); if (!info) continue
    let dat = 0, can = 0, yeu = 0, tin_thap = 0
    for (const c of cells) { if (c.muc === 'dat') dat++; else if (c.muc === 'can_luyen') can++; else yeu++; if (c.tin === 'thap') tin_thap++ }
    out.push({ ma_dang: ma, ten_dang: info.ten_dang, ten_chuyen_de: info.ten_chuyen_de, dat, can_luyen: can, yeu, tin_thap, total: dat + can + yeu })
  }
  return out
}

// PIVOT chuyên đề (view#3, gộp dạng): mỗi CHUYÊN ĐỀ — gộp mọi ô (HS × dạng thuộc chuyên đề) → chuyên đề nào lớp yếu.
export type ChuyenDeRollup = { ten_chuyen_de: string; dat: number; can_luyen: number; yeu: number; total: number }
export async function getMasteryByChuyenDe(opts: RollupScope): Promise<ChuyenDeRollup[]> {
  const { byHS, dangInfo } = await loadMasteryCells(opts)
  const byCd = new Map<string, Mastery[]>()
  for (const cm of byHS.values()) for (const [ma, r] of cm) {
    const cd = dangInfo.get(ma)?.ten_chuyen_de || '(không rõ)'
    const arr = byCd.get(cd) ?? []; arr.push(r); byCd.set(cd, arr)
  }
  const out: ChuyenDeRollup[] = []
  for (const [cd, cells] of byCd) {
    let dat = 0, can = 0, yeu = 0
    for (const c of cells) { if (c.muc === 'dat') dat++; else if (c.muc === 'can_luyen') can++; else yeu++ }
    out.push({ ten_chuyen_de: cd, dat, can_luyen: can, yeu, total: dat + can + yeu })
  }
  return out
}

// ── RAW DATA — nhật ký buổi (xem lại kết quả không qua vận hành) ────────────────
// Mỗi buổi = 1 "thẻ hoạt động"; cờ chamBai/et/danhGia/btvn = phase ĐÃ ĐÓNG (đã chốt kết quả).
// Lọc theo lớp / học sinh; xếp thời gian gần → xa. Bỏ buổi đã HỦY (không có kết quả để xem).
export type BuoiActivity = {
  id: string; ma_buoi: string | null; ngay: string; ten_lop: string | null; mon: string | null
  loai: string; trang_thai: string
  chamBai: boolean; et: boolean; danhGia: boolean; btvn: boolean
}
export async function listBuoiHoatDong(opts: { mon?: string; lopId?: string | null; hocSinhId?: string | null }): Promise<BuoiActivity[]> {
  const sel = 'id, ma_buoi, ngay, loai, trang_thai, ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at, lop:lop_id(ten_lop, mon)'
  // HS scope: KHÔNG embed buoi_hoc_hs!inner — bảng có 2 FK về buoi_hoc (buoi_hoc_id + bu_cho_buoi_id)
  // → embed nhập nhằng → query lỗi. Tách 2 bước: lấy buoi_hoc_id của HS rồi query buổi theo IN.
  let buoiIds: string[] | null = null
  if (opts.hocSinhId) {
    const { data: bhs, error: e1 } = await supabase.from('buoi_hoc_hs').select('buoi_hoc_id').eq('hoc_sinh_id', opts.hocSinhId).limit(LIMIT)
    if (e1) throw e1
    buoiIds = [...new Set((bhs ?? []).map((r: any) => r.buoi_hoc_id).filter(Boolean))]
    if (buoiIds.length === 0) return []
  }
  let q = supabase.from('buoi_hoc').select(sel).neq('trang_thai', 'huy').order('ngay', { ascending: false }).limit(LIMIT)
  if (opts.lopId) q = q.eq('lop_id', opts.lopId)
  if (buoiIds) q = q.in('id', buoiIds)
  const { data, error } = await q
  if (error) throw error
  let rows = (data ?? []) as any[]
  if (opts.mon) rows = rows.filter((b) => b.lop?.mon === opts.mon) // buổi bù (lop_id null) → mon null → bị lọc khi chọn môn (chấp nhận)
  return rows.map((b) => ({
    id: b.id, ma_buoi: b.ma_buoi, ngay: b.ngay, ten_lop: b.lop?.ten_lop ?? null, mon: b.lop?.mon ?? null,
    loai: b.loai, trang_thai: b.trang_thai,
    chamBai: !!b.ingame_dong_at, et: !!b.et_dong_at, danhGia: !!b.danh_gia_xong_at, btvn: !!b.btvn_dong_at,
  }))
}
