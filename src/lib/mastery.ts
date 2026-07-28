// Data-layer MASTERY (seam) — suy động (HS × dạng) từ các lần đo, gộp qua engine PURE src/gami/mastery.js.
// KHÔNG lưu — mọi lần gọi tính lại từ measurements. UI chỉ gọi qua đây.
// Nguồn đo (Thùy 07-15, chốt lại — LOẠI ingame + đánh giá GV khỏi mastery): CHỈ et+mt mặc định (test có
// giám sát, khách quan) [+ btvn+bt nếu bật toggle — tự luyện, weight thấp hơn]. "Chấm bài trên lớp"(ingame)
// và "đánh giá GV"(dg) KHÔNG còn vào mastery nữa — dg đặc biệt bị loại vì "phụ thuộc cảm giác", không phải
// đo khách quan per-câu như et/mt/btvn/bt. Trọng số — xem MASTERY_CONFIG.WEIGHT (gami/mastery.js): mt=3
// (chuẩn nhất) · et=2 · btvn/bt=1 (tự luyện).
import { supabase } from './supabase'
import { masteryOfDang, RESULT_VALUE, MASTERY_CONFIG } from '../gami/mastery.js'
import { khoCuaMon } from './tailieu'

const LIMIT = 10000

export type EvalSrc = 'ingame' | 'et' | 'mt' | 'dg' | 'btvn' | 'bt'
export type DangEval = { value: number; t: string; src: EvalSrc } // value 0|0.5|1 · t = ISO · src = nguồn
export type Mastery = { score: number; n: number; muc: 'dat' | 'can_luyen' | 'yeu'; tin: 'cao' | 'tb' | 'thap' }
export type DangMastery = {
  ma_dang: string
  ten_dang: string
  ten_chuyen_de: string
  muc_do: number | null // độ khó 1-5 (banDoTbl.muc_do) — null nếu bảng bản đồ không có cột này (vd hinh_ban_do)
  mastery: Mastery | null // null = CHƯA ĐO (không có lần đo nào)
  evals: DangEval[] // MỚI → CŨ
}

// Độ khó → nhóm cơ bản/nâng cao (Thùy 07-14): 1-3 = cơ bản · 4-5 = nâng cao. Dùng cho cả bản đồ kiến thức
// (bảng phụ theo scope) lẫn %MT cơ bản/nâng cao (chỉ số hoạt động).
export const bucketMucDo = (md: number | null | undefined): 'co_ban' | 'nang_cao' | null => (md == null ? null : md <= 3 ? 'co_ban' : 'nang_cao')

// Nhãn nguồn cho UI (IG/DG giữ lại cho Lịch sử hoạt động/badge cũ — KHÔNG còn xuất hiện trong mastery
// evals nữa, xem lý do loại ở đầu file). MT = kỳ thi lớn, chấm Đ/C/S per câu GIỐNG ET (giám sát) → LUÔN
// vào mastery. BTVN/BT (tự luyện) qua toggle includeBTVN — CẢ 2 cùng gate chung 1 toggle (Thùy 07-15).
export const SRC_LABEL: Record<EvalSrc, string> = { ingame: 'IG', et: 'ET', mt: 'MT', dg: 'ĐG', btvn: 'BTVN', bt: 'BT' }

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

// ── NGUỒN BT (bổ trợ tự luyện, mig 0094 bt_grades) — 1 HS × N câu, KHÔNG có buổi/session nên không
// nằm trong gami_grades. LUÔN vào mastery (không toggle) dù trọng số thấp (=1, xem MASTERY_CONFIG.WEIGHT).
type BTEvalRow = { hoc_sinh_id: string; ma_dang: string; value: number; t: string; mon: string }
async function fetchBTEvals(hs: string | string[], sinceIso?: string | null): Promise<BTEvalRow[]> {
  let q = supabase.from('bt_grades').select('result, graded_at, ma_dang, tl:tai_lieu_id!inner(hoc_sinh_id, mon)').limit(LIMIT)
  q = Array.isArray(hs) ? q.in('tl.hoc_sinh_id', hs) : q.eq('tl.hoc_sinh_id', hs)
  if (sinceIso) q = q.gte('graded_at', sinceIso)
  const { data, error } = await q
  if (error) throw error
  const out: BTEvalRow[] = []
  for (const r of (data ?? []) as any[]) {
    const val = RESULT_VALUE[r.result as keyof typeof RESULT_VALUE]
    if (val === undefined || !r.tl) continue
    out.push({ hoc_sinh_id: r.tl.hoc_sinh_id, ma_dang: r.ma_dang, value: val, t: r.graded_at, mon: r.tl.mon })
  }
  return out
}

// Gom các lần đo của 1 HS (trong 1 MÔN) theo dạng → mastery + timeline.
// opts.includeBTVN: gộp cả phase='btvn' + 'bt' (mặc định KHÔNG — tự luyện tham khảo, không vào mastery;
// toggle để Thùy soi — Thùy 07-15: BT/BTVN cùng gate 1 toggle, KHÔNG còn "bt luôn vào" như trước).
// ingame (chấm bài trên lớp) + dg (đánh giá GV) KHÔNG còn vào mastery (dg "phụ thuộc cảm giác" — Thùy 07-15).
// opts.days: chỉ lấy đo trong N ngày gần nhất (30/60/90). Bỏ trống = tất cả.
export async function getMasteryHS(
  hocSinhId: string,
  mon: string,
  opts?: { includeBTVN?: boolean; days?: number },
): Promise<DangMastery[]> {
  const K = khoCuaMon(mon) // banDoTbl theo môn → scope dạng đúng môn (bỏ dạng môn khác)
  const phases: EvalSrc[] = opts?.includeBTVN ? ['et', 'mt', 'bt', 'btvn'] : ['et', 'mt']
  const sinceIso = opts?.days ? new Date(Date.now() - opts.days * 86400_000).toISOString() : null // boundary INSTANT (được phép, §windowing)

  // grades của HS, EMBED thẳng problem (phase, ma_dang) — FK problem_id→gami_session_problems ĐƠN, sạch
  // (khác buoi_hoc_hs 2-FK). 1 query thay 2 + bỏ IN(probIds) tránh URL dài.
  let gq = supabase.from('gami_grades').select('result, graded_at, prob:problem_id(phase, ma_dang)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (sinceIso) gq = gq.gte('graded_at', sinceIso)
  const [{ data: grades }, online, bt] = await Promise.all([
    gq,
    fetchOnlineEvals(hocSinhId, sinceIso),
    fetchBTEvals(hocSinhId, sinceIso),
  ])

  // Gom measures theo ma_dang.
  const byDang: Record<string, DangEval[]> = {}
  const push = (ma: string | null | undefined, ev: DangEval) => { if (!ma) return; (byDang[ma] ??= []).push(ev) }
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob // to-one embed → object (null nếu problem mất, phòng thủ)
    if (!p || !p.ma_dang) continue
    if (!phases.includes(p.phase as EvalSrc)) continue // lọc phase (chỉ et/mt mặc định, +btvn/bt nếu bật toggle)
    const val = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]
    if (val === undefined) continue
    push(p.ma_dang, { value: val, t: g.graded_at, src: p.phase as EvalSrc })
  }
  for (const o of online) if (phases.includes(o.src)) push(o.ma_dang, { value: o.value, t: o.t, src: o.src })
  if (phases.includes('bt')) for (const b of bt) push(b.ma_dang, { value: b.value, t: b.t, src: 'bt' })

  const maList = Object.keys(byDang)
  if (maList.length === 0) return []

  // Resolve tên dạng + chuyên đề + độ khó theo MÔN (scope: chỉ dạng thuộc bảng bản đồ của môn này).
  const dangs = ((await supabase.from(K.banDoTbl).select('ma_dang, ten_dang, ten_chuyen_de, muc_do').in('ma_dang', maList).limit(LIMIT)).data ?? []) as { ma_dang: string; ten_dang: string; ten_chuyen_de: string; muc_do: number | null }[]
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
      muc_do: info.muc_do ?? null,
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

// ── TỔNG QUAN 1 HS — 3 VÙNG tách bạch (Thùy 07-14):
//   ① hoanThanh — % hoàn thành bản đồ kiến thức, MỖI card 2 nửa (Thùy 07-14): "etMt" = chỉ ET+MT (test có
//     giám sát) · "coBTVN" = etMt + BTVN + Bổ trợ (thêm nguồn tự luyện) — so 2 số cùng lúc để soi ĐỘ ĐÁNG
//     TIN của BTVN (dạng chỉ có BTVN mà không có ET/MT → etMt trống, coBTVN có → lộ rõ dạng "chỉ tự báo").
//     Dùng LẠI đúng engine masteryOfDang (weighted avg 5 lần GẦN NHẤT, MASTERY_CONFIG.WEIGHT: et=2·mt=3·
//     btvn=1·bt=1 — xem gami/mastery.js) — KHÔNG bịa công thức mới. Toàn bộ + Đại cơ bản/nâng cao (Hình:
//     UI tự render placeholder tĩnh, KHÔNG tính ở đây — xem lý do "chưa có dữ liệu" ở DangBaiTab).
//   ② hoatDong — %ET/%BTVN/%MT, MỖI nguồn tách CƠ BẢN/NÂNG CAO theo muc_do dạng của câu (bucketMucDo),
//     KHÔNG phân biệt Đại/Hình trong 1 mức (gộp chung) — 3 nguồn × 2 mức = 6 số.
//   ③ diem — ĐIỂM SỐ nhập tay qua ky_thi/diem_thi (khác %hoatDong ở trên — đó là %đúng câu, đây là điểm
//     thật): Điểm MT = TB diem_thi loai='mt_sat_hach' (nhập ở tab MT trong buổi) · Điểm thi trường = loai='truong'.
export type BucketPct = { dat: number; can_luyen: number; yeu: number; total: number; pct: number }
export type HoanThanhCard = { etMt: BucketPct; coBTVN: BucketPct }
export type ActPct = { pct: number | null; n: number }
export type TongQuanHS = {
  hoanThanh: { toanBo: HoanThanhCard; daiCoBan: HoanThanhCard; daiNangCao: HoanThanhCard }
  hoatDong: {
    etCoBan: ActPct; etNangCao: ActPct
    btvnCoBan: ActPct; btvnNangCao: ActPct
    mtCoBan: ActPct; mtNangCao: ActPct
  }
  diem: { mt: { tb: number | null; n: number }; truong: { tb: number | null; n: number } }
  // TREND = chênh (điểm %) 30 ngày GẦN so với 30 ngày TRƯỚC đó; null = chưa đủ data 1 trong 2 kỳ.
  // (hoanThanhToanBo chỉ tính trên nửa etMt — nửa coBTVN là số đối chiếu, không cần trend riêng.)
  trend: {
    hoanThanhToanBo: number | null
    etCoBan: number | null; etNangCao: number | null
    btvnCoBan: number | null; btvnNangCao: number | null
    mtCoBan: number | null; mtNangCao: number | null
  }
}
export async function getTongQuanHS(hocSinhId: string, mon: string): Promise<TongQuanHS> {
  const K = khoCuaMon(mon)
  const [{ data: grades }, { data: dt }, online, btGradeEvals] = await Promise.all([
    supabase.from('gami_grades').select('result, graded_at, prob:problem_id(phase, ma_dang)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    supabase.from('diem_thi').select('diem, ky_thi:ky_thi_id(loai, mon)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    fetchOnlineEvals(hocSinhId),
    fetchBTEvals(hocSinhId),
  ])
  const now = Date.now(), D30 = 30 * 86400_000, cut1 = now - D30, cut2 = now - 2 * D30
  const inRecent = (t: number) => t >= cut1
  const inPrior = (t: number) => t >= cut2 && t < cut1

  // Raw theo NGUỒN (et/btvn/mt) — bucket cơ bản/nâng cao SAU khi có muc_do (chung 1 vòng lặp, đối xứng 3 nguồn).
  type Raw = { ma: string | null; value: number; t: string }
  const etRows: Raw[] = [], btvnRows: Raw[] = [], mtRows: Raw[] = []
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob; if (!p) continue
    const v = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]; if (v === undefined) continue
    if (p.phase === 'et') etRows.push({ ma: p.ma_dang ?? null, value: v, t: g.graded_at })
    else if (p.phase === 'mt') mtRows.push({ ma: p.ma_dang ?? null, value: v, t: g.graded_at })
    else if (p.phase === 'btvn') btvnRows.push({ ma: p.ma_dang ?? null, value: v, t: g.graded_at })
  }
  // Online: scope theo môn của TEST (có sẵn nhãn mon — §1.6).
  for (const o of online) {
    if (o.mon && o.mon !== mon) continue
    if (o.src === 'et') etRows.push({ ma: o.ma_dang, value: o.value, t: o.t })
    else btvnRows.push({ ma: o.ma_dang, value: o.value, t: o.t })
  }

  // ① 2 bản đồ dạng: byDangTop = CHỈ et+mt · byDangBottom = top + btvn + bt (Bổ trợ) — Thùy 07-14: "trên
  // là chỉ ETMT, dưới là có thêm BTVN, Bổ trợ". KHÔNG gồm ingame/đánh giá GV (khác "Dạng bài" full-nguồn).
  const byDangTop: Record<string, DangEval[]> = {}, byDangBottom: Record<string, DangEval[]> = {}
  const pushHT = (map: Record<string, DangEval[]>, ma: string | null, ev: DangEval) => { if (ma) (map[ma] ??= []).push(ev) }
  for (const e of etRows) { const ev: DangEval = { value: e.value, t: e.t, src: 'et' }; pushHT(byDangTop, e.ma, ev); pushHT(byDangBottom, e.ma, ev) }
  for (const m of mtRows) { const ev: DangEval = { value: m.value, t: m.t, src: 'mt' }; pushHT(byDangTop, m.ma, ev); pushHT(byDangBottom, m.ma, ev) }
  for (const b of btvnRows) pushHT(byDangBottom, b.ma, { value: b.value, t: b.t, src: 'btvn' })
  for (const b of btGradeEvals) { if (b.mon && b.mon !== mon) continue; pushHT(byDangBottom, b.ma_dang, { value: b.value, t: b.t, src: 'bt' }) }

  const maList = Object.keys(byDangBottom) // ⊇ byDangTop (bottom = top + btvn + bt)
  let valid = new Set<string>()
  const mucDoMap = new Map<string, number>()
  if (maList.length) {
    const dd = ((await supabase.from(K.banDoTbl).select('ma_dang, muc_do').in('ma_dang', maList).limit(LIMIT)).data ?? []) as { ma_dang: string; muc_do: number }[]
    for (const x of dd) { valid.add(x.ma_dang); if (x.muc_do != null) mucDoMap.set(x.ma_dang, x.muc_do) }
  }
  const laCoBan = (md: number | null) => bucketMucDo(md) === 'co_ban'
  const laNangCao = (md: number | null) => bucketMucDo(md) === 'nang_cao'

  // % hoàn thành bản đồ (đạt=1·cần=0.5·yếu=0)/ĐÃ-ĐO trên 1 trong 2 bản đồ dạng — predMuc lọc theo bucket
  // muc_do của DẠNG (không phải câu); predTime chỉ dùng cho trend (30 ngày).
  const compPct = (map: Record<string, DangEval[]>, predMuc?: (md: number | null) => boolean, predTime?: (t: number) => boolean): BucketPct & { pctRaw: number | null } => {
    let d = 0, c = 0, y = 0, t = 0
    for (const ma of Object.keys(map)) {
      if (!valid.has(ma)) continue
      if (predMuc && !predMuc(mucDoMap.get(ma) ?? null)) continue
      const evs = predTime ? map[ma].filter((e) => predTime(Date.parse(e.t))) : map[ma]
      if (!evs.length) continue
      const r = masteryOfDang(evs, MASTERY_CONFIG); if (!r) continue
      t++; if (r.muc === 'dat') d++; else if (r.muc === 'can_luyen') c++; else y++
    }
    const pctRaw = t ? Math.round(((d + c * 0.5) / t) * 100) : null
    return { dat: d, can_luyen: c, yeu: y, total: t, pct: pctRaw ?? 0, pctRaw }
  }
  const toBucket = (b: ReturnType<typeof compPct>): BucketPct => ({ dat: b.dat, can_luyen: b.can_luyen, yeu: b.yeu, total: b.total, pct: b.pct })
  const htTop = compPct(byDangTop), htTopR = compPct(byDangTop, undefined, inRecent), htTopP = compPct(byDangTop, undefined, inPrior)
  const htBottom = compPct(byDangBottom)
  const htTopDaiCB = compPct(byDangTop, laCoBan), htBottomDaiCB = compPct(byDangBottom, laCoBan)
  const htTopDaiNC = compPct(byDangTop, laNangCao), htBottomDaiNC = compPct(byDangBottom, laNangCao)

  // ② %ET/%BTVN/%MT cơ bản/nâng cao — bucket theo muc_do dạng của CÂU, gộp đại/hình (Thùy: "ko cần phân
  // biệt đại hình"). Câu không rõ muc_do (dạng không thuộc bản đồ môn này) → bỏ, đối xứng cả 3 nguồn.
  const actBucket = (rows: Raw[], predTime?: (t: number) => boolean, predMuc?: (md: number | null) => boolean) => {
    let s = 0, n = 0
    for (const r of rows) {
      if (!r.ma || !mucDoMap.has(r.ma)) continue
      if (predMuc && !predMuc(mucDoMap.get(r.ma)!)) continue
      const tm = Date.parse(r.t); if (predTime && !predTime(tm)) continue
      s += r.value; n++
    }
    return { s, n }
  }
  const pctOf = (b: { s: number; n: number }): ActPct => ({ pct: b.n ? Math.round((b.s / b.n) * 100) : null, n: b.n })
  const deltaPct = (r: { s: number; n: number }, p: { s: number; n: number }) => {
    const rp = r.n ? Math.round((r.s / r.n) * 100) : null, pp = p.n ? Math.round((p.s / p.n) * 100) : null
    return rp != null && pp != null ? rp - pp : null
  }
  const etCB = actBucket(etRows, undefined, laCoBan), etNC = actBucket(etRows, undefined, laNangCao)
  const btvnCB = actBucket(btvnRows, undefined, laCoBan), btvnNC = actBucket(btvnRows, undefined, laNangCao)
  const mtCB = actBucket(mtRows, undefined, laCoBan), mtNC = actBucket(mtRows, undefined, laNangCao)
  const etCBr = actBucket(etRows, inRecent, laCoBan), etCBp = actBucket(etRows, inPrior, laCoBan)
  const etNCr = actBucket(etRows, inRecent, laNangCao), etNCp = actBucket(etRows, inPrior, laNangCao)
  const btvnCBr = actBucket(btvnRows, inRecent, laCoBan), btvnCBp = actBucket(btvnRows, inPrior, laCoBan)
  const btvnNCr = actBucket(btvnRows, inRecent, laNangCao), btvnNCp = actBucket(btvnRows, inPrior, laNangCao)
  const mtCBr = actBucket(mtRows, inRecent, laCoBan), mtCBp = actBucket(mtRows, inPrior, laCoBan)
  const mtNCr = actBucket(mtRows, inRecent, laNangCao), mtNCp = actBucket(mtRows, inPrior, laNangCao)

  // ③ Điểm (nhập tay qua ky_thi/diem_thi) theo loại, scope môn — khao_sat_thang không hiện ở đây.
  let mtDiemSum = 0, mtDiemN = 0, trSum = 0, trN = 0
  for (const r of (dt ?? []) as any[]) {
    const k = r.ky_thi; if (!k || (k.mon && k.mon !== mon) || r.diem == null) continue
    if (k.loai === 'truong') { trSum += Number(r.diem); trN++ }
    else if (k.loai === 'mt_sat_hach') { mtDiemSum += Number(r.diem); mtDiemN++ }
  }

  const delta = (r: number | null, p: number | null) => (r != null && p != null ? r - p : null)
  return {
    hoanThanh: {
      toanBo: { etMt: toBucket(htTop), coBTVN: toBucket(htBottom) },
      daiCoBan: { etMt: toBucket(htTopDaiCB), coBTVN: toBucket(htBottomDaiCB) },
      daiNangCao: { etMt: toBucket(htTopDaiNC), coBTVN: toBucket(htBottomDaiNC) },
    },
    hoatDong: {
      etCoBan: pctOf(etCB), etNangCao: pctOf(etNC),
      btvnCoBan: pctOf(btvnCB), btvnNangCao: pctOf(btvnNC),
      mtCoBan: pctOf(mtCB), mtNangCao: pctOf(mtNC),
    },
    diem: {
      mt: { tb: mtDiemN ? +(mtDiemSum / mtDiemN).toFixed(1) : null, n: mtDiemN },
      truong: { tb: trN ? +(trSum / trN).toFixed(1) : null, n: trN },
    },
    trend: {
      hoanThanhToanBo: delta(htTopR.pctRaw, htTopP.pctRaw),
      etCoBan: deltaPct(etCBr, etCBp), etNangCao: deltaPct(etNCr, etNCp),
      btvnCoBan: deltaPct(btvnCBr, btvnCBp), btvnNangCao: deltaPct(btvnNCr, btvnNCp),
      mtCoBan: deltaPct(mtCBr, mtCBp), mtNangCao: deltaPct(mtNCr, mtNCp),
    },
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
  dangInfo: Map<string, { ten_dang: string; ten_chuyen_de: string; muc_do: number | null }>
}
export type RollupScope = { mon: string; lopId?: string | null; khoi?: string | null; he?: string | null; includeBTVN?: boolean }
async function loadMasteryCells(opts: RollupScope): Promise<CellBundle> {
  const empty: CellBundle = { hsMap: new Map(), hsIds: [], byHS: new Map(), dangInfo: new Map() }
  const K = khoCuaMon(opts.mon)
  // Thùy 07-15: LOẠI ingame + đánh giá GV khỏi mastery (xem comment đầu file) — đối xứng với getMasteryHS.
  const phases: EvalSrc[] = opts.includeBTVN ? ['et', 'mt', 'bt', 'btvn'] : ['et', 'mt']

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
  const [{ data: grades }, online, bt] = await Promise.all([
    supabase.from('gami_grades').select('hoc_sinh_id, result, graded_at, prob:problem_id(phase, ma_dang)').in('hoc_sinh_id', hsIds).limit(LIMIT),
    fetchOnlineEvals(hsIds),
    fetchBTEvals(hsIds),
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
  for (const o of online) if (phases.includes(o.src)) add(o.hoc_sinh_id, o.ma_dang, { value: o.value, t: o.t, src: o.src })
  if (phases.includes('bt')) for (const b of bt) add(b.hoc_sinh_id, b.ma_dang, { value: b.value, t: b.t, src: 'bt' })

  // 3) tên dạng + độ khó + scope MÔN (banDo của môn → chỉ giữ dạng hợp lệ).
  const dangInfo = new Map<string, { ten_dang: string; ten_chuyen_de: string; muc_do: number | null }>()
  if (allMa.size) {
    const dd = ((await supabase.from(K.banDoTbl).select('ma_dang, ten_dang, ten_chuyen_de, muc_do').in('ma_dang', [...allMa]).limit(LIMIT)).data ?? []) as any[]
    for (const x of dd) dangInfo.set(x.ma_dang, { ten_dang: x.ten_dang, ten_chuyen_de: x.ten_chuyen_de, muc_do: x.muc_do ?? null })
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

// mucDo filter dùng chung (view#3, Thùy 07-15): 'tat_ca' | 'co_ban' (1-3) | 'nang_cao' (4-5) — toggle bar.
export type MucDoFilter = 'tat_ca' | 'co_ban' | 'nang_cao'
const khopMucDo = (md: number | null, filter?: MucDoFilter) => !filter || filter === 'tat_ca' || bucketMucDo(md) === filter

// PIVOT dạng (view#3): mỗi dạng — bao nhiêu HS đạt/cần-luyện/yếu → "dạng nào cả lớp yếu nhất".
export type DangRollup = { ma_dang: string; ten_dang: string; ten_chuyen_de: string; muc_do: number | null; dat: number; can_luyen: number; yeu: number; tin_thap: number; total: number }
export async function getMasteryByDang(opts: RollupScope, mucDo?: MucDoFilter): Promise<DangRollup[]> {
  const { byHS, dangInfo } = await loadMasteryCells(opts)
  const byDang = new Map<string, Mastery[]>()
  for (const cm of byHS.values()) for (const [ma, r] of cm) { const arr = byDang.get(ma) ?? []; arr.push(r); byDang.set(ma, arr) }
  const out: DangRollup[] = []
  for (const [ma, cells] of byDang) {
    const info = dangInfo.get(ma); if (!info) continue
    if (!khopMucDo(info.muc_do, mucDo)) continue
    let dat = 0, can = 0, yeu = 0, tin_thap = 0
    for (const c of cells) { if (c.muc === 'dat') dat++; else if (c.muc === 'can_luyen') can++; else yeu++; if (c.tin === 'thap') tin_thap++ }
    out.push({ ma_dang: ma, ten_dang: info.ten_dang, ten_chuyen_de: info.ten_chuyen_de, muc_do: info.muc_do, dat, can_luyen: can, yeu, tin_thap, total: dat + can + yeu })
  }
  return out
}

// PIVOT chuyên đề (view#3, gộp dạng): mỗi CHUYÊN ĐỀ — gộp mọi ô (HS × dạng thuộc chuyên đề) → chuyên đề nào lớp yếu.
// mucDo lọc TRƯỚC khi gộp (chỉ gộp dạng khớp bucket) — 1 chuyên đề có thể "biến mất" nếu không có dạng nào khớp.
export type ChuyenDeRollup = { ten_chuyen_de: string; dat: number; can_luyen: number; yeu: number; total: number }
export async function getMasteryByChuyenDe(opts: RollupScope, mucDo?: MucDoFilter): Promise<ChuyenDeRollup[]> {
  const { byHS, dangInfo } = await loadMasteryCells(opts)
  const byCd = new Map<string, Mastery[]>()
  for (const cm of byHS.values()) for (const [ma, r] of cm) {
    const info = dangInfo.get(ma)
    if (!khopMucDo(info?.muc_do ?? null, mucDo)) continue
    const cd = info?.ten_chuyen_de || '(không rõ)'
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
  chamBai: boolean; et: boolean; danhGia: boolean; btvn: boolean; mt: boolean
}
export async function listBuoiHoatDong(opts: { mon?: string; lopId?: string | null; hocSinhId?: string | null }): Promise<BuoiActivity[]> {
  const sel = 'id, ma_buoi, ngay, loai, trang_thai, ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at, mt_dong_at, lop:lop_id(ten_lop, mon)'
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
    chamBai: !!b.ingame_dong_at, et: !!b.et_dong_at, danhGia: !!b.danh_gia_xong_at, btvn: !!b.btvn_dong_at, mt: !!b.mt_dong_at,
  }))
}

// ── VIEW CẢ LỚP: ma trận (HS × buổi) cho 1 hoạt động (ET/BTVN/MT). Ô = % hoàn thành + trạng thái. ──
// Nhìn tổng quát cả lớp: ai làm/chưa làm, được bao nhiêu %. "Không làm" (BTVN xin phép/không làm) tô cảnh báo.
export type MatrixPhase = 'et' | 'btvn' | 'mt'
export type MatrixCell = { pct: number | null; status: 'done' | 'khong_lam' | 'vang' | 'none' }
export type ClassMatrix = {
  buois: { id: string; ngay: string; ma_buoi: string | null }[]        // cột — ngày tăng dần
  students: { id: string; ho_ten: string; ma_hs: string | null }[]     // dòng — theo tên
  cells: Record<string, MatrixCell>                                    // key `${hsId}:${buoiId}`
}
const DONG_AT: Record<MatrixPhase, string> = { et: 'et_dong_at', btvn: 'btvn_dong_at', mt: 'mt_dong_at' }
// ym = 'YYYY-MM' (tùy chọn) → chỉ lấy buổi trong tháng đó (điều hướng next/prev ở UI).
export async function getClassMatrix(lopId: string, phase: MatrixPhase, ym?: string): Promise<ClassMatrix> {
  // 1) buổi thường của lớp ĐÃ ĐÓNG hoạt động này → cột (lọc tháng nếu có)
  let bq = supabase.from('buoi_hoc')
    .select('id, ngay, ma_buoi').eq('lop_id', lopId).eq('loai', 'thuong').neq('trang_thai', 'huy')
    .not(DONG_AT[phase], 'is', null)
  if (ym) {
    const [y, m] = ym.split('-').map(Number)
    const to = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`
    bq = bq.gte('ngay', `${ym}-01`).lt('ngay', to)
  }
  const { data: bs, error: eB } = await bq.order('ngay', { ascending: true }).limit(LIMIT)
  if (eB) throw eB
  const buois = (bs ?? []).map((b: any) => ({ id: b.id, ngay: b.ngay, ma_buoi: b.ma_buoi }))
  const buoiIds = buois.map((b) => b.id)

  // 2) roster lớp (đang học — vắng vẫn hiện dòng)
  const { data: hl, error: eH } = await supabase.from('hoc_sinh_lop')
    .select('hoc_sinh(id, ho_ten, ma_hs)').eq('lop_id', lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  if (eH) throw eH
  const students = (hl ?? []).map((r: any) => r.hoc_sinh).filter(Boolean)
    .sort((a: any, b: any) => String(a.ho_ten).localeCompare(String(b.ho_ten), 'vi'))
  const cells: Record<string, MatrixCell> = {}
  if (!buoiIds.length || !students.length) return { buois, students, cells }

  // 3) điểm chấm (gami_grades × session_problems của phase) → gộp (hs×buổi): pts/(n×100)
  const { data: probs } = await supabase.from('gami_session_problems')
    .select('id, buoi_hoc_id').eq('phase', phase).in('buoi_hoc_id', buoiIds).limit(LIMIT)
  const probBuoi = new Map<string, string>((probs ?? []).map((p: any) => [p.id, p.buoi_hoc_id]))
  const probIds = [...probBuoi.keys()]
  const agg = new Map<string, { pts: number; n: number }>()
  if (probIds.length) {
    const { data: gs } = await supabase.from('gami_grades').select('hoc_sinh_id, problem_id, points').in('problem_id', probIds).limit(LIMIT)
    for (const g of (gs ?? []) as any[]) {
      const bId = probBuoi.get(g.problem_id); if (!bId) continue
      const k = g.hoc_sinh_id + ':' + bId
      const a = agg.get(k) ?? { pts: 0, n: 0 }; a.pts += Number(g.points); a.n += 1; agg.set(k, a)
    }
  }

  // 4) BTVN: xin phép / không làm → cảnh báo "không làm"
  const miss = new Set<string>()
  if (phase === 'btvn') {
    const { data: kq } = await supabase.from('btvn_ket_qua').select('hoc_sinh_id, buoi_hoc_id, trang_thai_nop').in('buoi_hoc_id', buoiIds).limit(LIMIT)
    for (const r of (kq ?? []) as any[]) if (r.trang_thai_nop === 'khong_lam' || r.trang_thai_nop === 'xin_phep') miss.add(r.hoc_sinh_id + ':' + r.buoi_hoc_id)
  }

  // 5) vắng → phân biệt "vắng" vs "chưa có dữ liệu"
  const vang = new Set<string>()
  const { data: dd } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id, buoi_hoc_id, diem_danh').in('buoi_hoc_id', buoiIds).limit(LIMIT)
  for (const r of (dd ?? []) as any[]) if (r.diem_danh === 'vang' || r.diem_danh === 'vang_phep') vang.add(r.hoc_sinh_id + ':' + r.buoi_hoc_id)

  // 6) dựng ô
  for (const s of students) for (const b of buois) {
    const k = s.id + ':' + b.id
    const a = agg.get(k)
    if (a && a.n > 0) cells[k] = { pct: Math.min(100, Math.round((a.pts / (a.n * 100)) * 100)), status: 'done' }
    else if (miss.has(k)) cells[k] = { pct: null, status: 'khong_lam' }
    else if (vang.has(k)) cells[k] = { pct: null, status: 'vang' }
    else cells[k] = { pct: null, status: 'none' }
  }
  return { buois, students, cells }
}
