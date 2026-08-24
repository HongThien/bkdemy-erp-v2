// TRAO GIẢI (thưởng tháng) — data-layer. Bảng ĐÃ build sẵn ở DB (giai_thuong, giai_thuong_lop_thang,
// xem schema.md) — file này KHÔNG tạo/sửa bảng, chỉ query + ghi. Đề xuất tính SỐNG (không lưu draft):
// mỗi lần mở màn tự tính lại theo dữ liệu mới nhất — đúng §1.5 anti-NULL "chỉ tạo dòng khi có kết quả
// THẬT": trước khi GV tick "Xác nhận", KHÔNG có dòng `giai_thuong` nào tồn tại cho slot đó.
//
// 3 luật xếp hạng (CEO chốt, KHÔNG tự đổi ở đây):
//   · Xuất sắc: MT(%) ↓ → ET(%) tháng ↓ → BTVN accuracy TB tháng ↓.
//   · Tiến bộ : tổng Σ delta Elo (phase='et') trong tháng ↓.
//   · Chăm chỉ: số buổi có BTVN ĐÃ CHẤM (đã giao BTVN + HS có mặt) trong tháng ↓ → accuracy TB ↓.
// Ưu tiên xử lý Xuất sắc > Tiến bộ > Chăm chỉ: HS đã CONFIRMED ở giải nào (bất kỳ) trong lớp/tháng đó
// bị loại khỏi pool đề xuất của MỌI giải còn lại — khớp UNIQUE(thang, mon, hoc_sinh_id) ở DB (1 HS chỉ
// nhận ĐÚNG 1 giải/tháng/môn, không phải 1 giải/loại).
//
// ⚠ Sửa 22/08 (CEO xác nhận): "Chăm chỉ" ban đầu spec dùng `btvn_ket_qua.hoan_thanh`/`.ti_le_dung`, nhưng
// 2 cột đó KHÔNG có pipeline nào trong app ghi (chỉ `trang_thai_nop`/`thai_do` được ghi qua setBtvnKetQua,
// xem gami.ts). Phát hiện: BTVN đã có CHẤM THẬT theo câu (`gami_grades` nối `gami_session_problems`
// phase='btvn'), dùng sẵn cho tính EXP tháng (`fetchBtvnAcc` ở gami.ts) — dùng lại nguồn đã đo thật này
// thay vì thêm UI ghi tay, tránh 2 nguồn sự thật song song cho cùng 1 khái niệm (đúng triết lý "đo lường
// suy động, không ghi tay" §1.5/§2 CLAUDE.md).
import { supabase } from './supabase'
import { listLop, listHSCuaLop, todayVN, type Lop } from './nhansu'

const LIMIT = 10000

// ── Loại giải / slot cố định (KHÔNG scale theo sĩ số — CEO chốt) ────────────
export type LoaiGiai = 'xuat_sac' | 'tien_bo' | 'cham_chi'
export const SLOT_COUNT: Record<LoaiGiai, number> = { xuat_sac: 3, tien_bo: 2, cham_chi: 1 }
export const TONG_SLOT = SLOT_COUNT.xuat_sac + SLOT_COUNT.tien_bo + SLOT_COUNT.cham_chi // 6
// Thứ tự ưu tiên xử lý (CEO chốt) — dùng để loại HS đã confirmed giải ưu tiên cao hơn khỏi pool thấp hơn.
export const LOAI_GIAI_THU_TU: LoaiGiai[] = ['xuat_sac', 'tien_bo', 'cham_chi']
export const LOAI_GIAI_TEN: Record<LoaiGiai, string> = { xuat_sac: 'Xuất sắc', tien_bo: 'Tiến bộ', cham_chi: 'Chăm chỉ' }

export type GiaiThuongRow = {
  id: string; thang: string; lop_id: string; mon: string; hoc_sinh_id: string
  loai_giai: LoaiGiai; duyet_boi: string; duyet_at: string; cong_bo_at: string | null
}
export type LopThangRow = { lop_id: string; thang: string; hoan_thanh_at: string | null; hoan_thanh_boi: string | null }

// ── Ngày tháng — CHUỖI THUẦN, không new Date()/toISOString cho ngày local (CLAUDE.md §2) ───────────
export const curYM = (): string => todayVN().slice(0, 7)
export const monthStart = (ym: string): string => `${ym}-01`
function monthNext(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`
}
function monthEndExclusive(ym: string): string { return `${monthNext(ym)}-01` }
// Cửa sổ MT lệch (CEO chốt): 25 của THÁNG ĐÓ → 10 của THÁNG SAU (inclusive cả 2 đầu).
function mtWindow(ym: string): { tu: string; den: string } { return { tu: `${ym}-25`, den: `${monthNext(ym)}-10` } }
export const shiftYM = (ym: string, delta: number): string => {
  const [y, m] = ym.split('-').map(Number); const i = y * 12 + (m - 1) + delta
  return `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}`
}

// ════════════════════════════════════════════════════════════════════════════
// METRICS — tính SỐNG từ gami_grades/gami_elo_history/btvn_ket_qua cho 1 (lớp × tháng).
// ════════════════════════════════════════════════════════════════════════════
export type XuatSacMetric = { mtPct: number | null; etPct: number | null; hwPct: number | null }
export type TienBoMetric = { totalDelta: number; eloBefore: number | null; eloAfter: number | null; buoiCount: number }
export type ChamChiMetric = { hoanThanh: number; tongBuoi: number; avgTiLeDung: number | null }
type RosterHS = { id: string; ho_ten: string; ma_hs: string | null }
type LopMetrics = { roster: RosterHS[]; xuatSac: Map<string, XuatSacMetric>; tienBo: Map<string, TienBoMetric>; chamChi: Map<string, ChamChiMetric> }

// Buổi CÔNG NHẬN đo lường: buổi thường, chưa huỷ, lớp X, trong [tu, den).
async function buoiThuongCuaLop(lopId: string, tu: string, denExclusive: string): Promise<{ id: string; ngay: string }[]> {
  const { data, error } = await supabase.from('buoi_hoc').select('id, ngay')
    .eq('lop_id', lopId).eq('loai', 'thuong').neq('trang_thai', 'huy')
    .gte('ngay', tu).lt('ngay', denExclusive).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as { id: string; ngay: string }[]
}
async function buoiThuongCuaLopInclusive(lopId: string, tu: string, denInclusive: string): Promise<{ id: string; ngay: string }[]> {
  const { data, error } = await supabase.from('buoi_hoc').select('id, ngay')
    .eq('lop_id', lopId).eq('loai', 'thuong').neq('trang_thai', 'huy')
    .gte('ngay', tu).lte('ngay', denInclusive).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as { id: string; ngay: string }[]
}

// Buổi MT của lớp trong cửa sổ (CEO xác nhận: CHỈ 1 buổi/lớp/cửa sổ) — hỏi thẳng gami_session_problems
// (giống pattern listCaHoc.hasMT ở gami.ts) vì MT giờ là 1 PHASE của buổi thường, không có buổi riêng.
async function timBuoiMT(buoiIds: string[]): Promise<string | null> {
  if (!buoiIds.length) return null
  const { data, error } = await supabase.from('gami_session_problems').select('buoi_hoc_id').eq('phase', 'mt').in('buoi_hoc_id', buoiIds).limit(LIMIT)
  if (error) throw error
  const ids = [...new Set(((data ?? []) as { buoi_hoc_id: string }[]).map((r) => r.buoi_hoc_id))]
  return ids[0] ?? null // >1 (không nên xảy ra) → lấy bản đầu, không crash
}

// % 1 HS trong 1 buổi+phase = Σ điểm CÁC CÂU ĐÃ CHẤM / (100 × SỐ CÂU ĐÃ CHẤM cho chính em đó).
// Mẫu số theo dòng CHẤM THẬT (gami_grades, upsert 1 dòng/câu/HS — xem gradeET), KHÔNG theo tổng slot đã
// seed (ensureProblems tạo slot RỖNG trước khi chấm) — câu chưa chấm = "chưa đo" (§1.5), không phải 0.
async function pctByHsTrongBuoi(buoiId: string, phase: 'et' | 'mt'): Promise<Map<string, number>> {
  const { data: probs, error: eP } = await supabase.from('gami_session_problems').select('id').eq('buoi_hoc_id', buoiId).eq('phase', phase).limit(LIMIT)
  if (eP) throw eP
  const probIds = ((probs ?? []) as { id: string }[]).map((p) => p.id)
  const out = new Map<string, number>()
  if (!probIds.length) return out
  const { data: grades, error: eG } = await supabase.from('gami_grades').select('hoc_sinh_id, points').in('problem_id', probIds).limit(LIMIT)
  if (eG) throw eG
  const agg = new Map<string, { pts: number; n: number }>()
  for (const g of (grades ?? []) as { hoc_sinh_id: string; points: number }[]) {
    const a = agg.get(g.hoc_sinh_id) ?? { pts: 0, n: 0 }
    a.pts += Number(g.points); a.n += 1
    agg.set(g.hoc_sinh_id, a)
  }
  for (const [hs, a] of agg) if (a.n) out.set(hs, a.pts / (100 * a.n))
  return out
}

// ET % TRUNG BÌNH THÁNG = trung bình % TỪNG BUỔI (trọng số ngang nhau giữa các buổi) — KHÔNG gộp thẳng
// theo tổng số câu, tránh 1 buổi nhiều câu lấn át buổi ít câu (đề mỗi buổi dài ngắn khác nhau).
async function etPctThangByHs(buoiIds: string[]): Promise<Map<string, number>> {
  const out = new Map<string, number>()
  if (!buoiIds.length) return out
  const { data: probs, error: eP } = await supabase.from('gami_session_problems').select('id, buoi_hoc_id').eq('phase', 'et').in('buoi_hoc_id', buoiIds).limit(LIMIT)
  if (eP) throw eP
  const probRows = (probs ?? []) as { id: string; buoi_hoc_id: string }[]
  if (!probRows.length) return out
  const buoiOfProb = new Map(probRows.map((p) => [p.id, p.buoi_hoc_id]))
  const { data: grades, error: eG } = await supabase.from('gami_grades').select('hoc_sinh_id, problem_id, points').in('problem_id', probRows.map((p) => p.id)).limit(LIMIT)
  if (eG) throw eG
  const perBuoi = new Map<string, Map<string, { pts: number; n: number }>>()
  for (const g of (grades ?? []) as { hoc_sinh_id: string; problem_id: string; points: number }[]) {
    const buoiId = buoiOfProb.get(g.problem_id); if (!buoiId) continue
    const m = perBuoi.get(buoiId) ?? new Map<string, { pts: number; n: number }>(); perBuoi.set(buoiId, m)
    const a = m.get(g.hoc_sinh_id) ?? { pts: 0, n: 0 }
    a.pts += Number(g.points); a.n += 1
    m.set(g.hoc_sinh_id, a)
  }
  const sums = new Map<string, { s: number; n: number }>()
  for (const m of perBuoi.values()) for (const [hs, a] of m) {
    if (!a.n) continue
    const pct = a.pts / (100 * a.n)
    const cur = sums.get(hs) ?? { s: 0, n: 0 }; cur.s += pct; cur.n += 1; sums.set(hs, cur)
  }
  for (const [hs, v] of sums) out.set(hs, v.s / v.n)
  return out
}

// HS có mặt (diem_danh='co_mat') per buổi — dùng để loại buổi vắng khỏi BTVN/Chăm chỉ.
async function coMatMapCuaBuoi(buoiIds: string[]): Promise<Map<string, Set<string>>> {
  const out = new Map<string, Set<string>>()
  if (!buoiIds.length) return out
  const { data, error } = await supabase.from('buoi_hoc_hs').select('buoi_hoc_id, hoc_sinh_id, diem_danh').in('buoi_hoc_id', buoiIds).eq('diem_danh', 'co_mat').limit(LIMIT)
  if (error) throw error
  for (const r of (data ?? []) as { buoi_hoc_id: string; hoc_sinh_id: string }[]) {
    const s = out.get(r.buoi_hoc_id) ?? new Set<string>(); s.add(r.hoc_sinh_id); out.set(r.buoi_hoc_id, s)
  }
  return out
}

type BtvnAgg = { hoanThanh: number; tong: number; tiLeSum: number; tiLeN: number }
// Mẫu số "có giao BTVN" = buổi có ≥1 gami_session_problems phase='btvn' (giống ensureProblems ở gami.ts
// tạo slot RỖNG trước khi chấm — sự TỒN TẠI của problem, không phải của grade, mới xác định "đã giao").
// "Hoàn thành" = HS đó CÓ ≥1 dòng gami_grades đã chấm cho buổi đó (câu chưa chấm không tính — §1.5 "chưa
// đo" ≠ 0). accuracy/buổi = Σđiểm / (100×số câu đã chấm cho chính HS đó), TB các buổi có chấm (trọng số
// ngang nhau giữa buổi — cùng cách tính etPctThangByHs ở trên, tránh buổi nhiều câu lấn át buổi ít câu).
async function btvnAggByHs(buoiIds: string[], coMatMap: Map<string, Set<string>>): Promise<Map<string, BtvnAgg>> {
  const out = new Map<string, BtvnAgg>()
  if (!buoiIds.length) return out
  const { data: probs, error: eP } = await supabase.from('gami_session_problems').select('id, buoi_hoc_id').eq('phase', 'btvn').in('buoi_hoc_id', buoiIds).limit(LIMIT)
  if (eP) throw eP
  const probRows = (probs ?? []) as { id: string; buoi_hoc_id: string }[]
  if (!probRows.length) return out
  const buoiOfProb = new Map(probRows.map((p) => [p.id, p.buoi_hoc_id]))
  const btvnBuoiIds = [...new Set(probRows.map((p) => p.buoi_hoc_id))]

  const { data: grades, error: eG } = await supabase.from('gami_grades').select('hoc_sinh_id, problem_id, points').in('problem_id', probRows.map((p) => p.id)).limit(LIMIT)
  if (eG) throw eG
  const perHsBuoi = new Map<string, { pts: number; n: number }>() // key = `${hs}:${buoi}`
  for (const g of (grades ?? []) as { hoc_sinh_id: string; problem_id: string; points: number }[]) {
    const buoiId = buoiOfProb.get(g.problem_id); if (!buoiId) continue
    const key = `${g.hoc_sinh_id}:${buoiId}`
    const a = perHsBuoi.get(key) ?? { pts: 0, n: 0 }
    a.pts += Number(g.points); a.n += 1
    perHsBuoi.set(key, a)
  }
  for (const buoiId of btvnBuoiIds) {
    const coMat = coMatMap.get(buoiId)
    if (!coMat) continue
    for (const hs of coMat) {
      const a = out.get(hs) ?? { hoanThanh: 0, tong: 0, tiLeSum: 0, tiLeN: 0 }
      a.tong += 1
      const g = perHsBuoi.get(`${hs}:${buoiId}`)
      if (g && g.n > 0) { a.hoanThanh += 1; a.tiLeSum += g.pts / (100 * g.n); a.tiLeN += 1 }
      out.set(hs, a)
    }
  }
  return out
}

// Σ delta Elo (phase='et') trong tháng — QUYẾT ĐỊNH KỸ THUẬT (CTO): dùng 1 con số Elo delta đã encode sẵn
// "thay đổi tương đối so với chính mình + đối thủ" thay vì tự tính riêng 2 chỉ số rời rạc "đổi hạng" +
// "%điểm tăng" (2 chỉ số đó dễ lệch nhau — vd hạng tăng nhưng điểm tuyệt đối giảm nếu cả lớp cùng giảm).
// elo_before/elo_after hiển thị thêm cho GV dễ hiểu ("Elo 1020 → 1085") — KHÔNG dùng để xếp hạng.
async function tienBoMetricByHs(buoiIds: string[], hsIds: string[]): Promise<Map<string, TienBoMetric>> {
  const out = new Map<string, TienBoMetric>()
  if (!buoiIds.length || !hsIds.length) return out
  const { data, error } = await supabase.from('gami_elo_history').select('hoc_sinh_id, delta, elo_before, elo_after, created_at')
    .eq('phase', 'et').in('buoi_hoc_id', buoiIds).in('hoc_sinh_id', hsIds).order('created_at', { ascending: true }).limit(LIMIT)
  if (error) throw error
  for (const r of (data ?? []) as { hoc_sinh_id: string; delta: number; elo_before: number; elo_after: number }[]) {
    const a = out.get(r.hoc_sinh_id) ?? { totalDelta: 0, eloBefore: null, eloAfter: null, buoiCount: 0 }
    a.totalDelta += r.delta
    if (a.eloBefore == null) a.eloBefore = r.elo_before // dòng ĐẦU (đã order created_at asc)
    a.eloAfter = r.elo_after // ghi đè liên tục → còn lại là dòng CUỐI
    a.buoiCount += 1
    out.set(r.hoc_sinh_id, a)
  }
  return out
}

async function computeLopMetrics(lopId: string, ym: string): Promise<LopMetrics> {
  const rosterRows = await listHSCuaLop(lopId)
  const roster: RosterHS[] = rosterRows.map((r) => ({ id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null }))
  if (!roster.length) return { roster: [], xuatSac: new Map(), tienBo: new Map(), chamChi: new Map() }
  const hsIds = roster.map((r) => r.id)

  const tu = monthStart(ym), denExcl = monthEndExclusive(ym)
  const mtW = mtWindow(ym)
  const [buoiThang, buoiMTCua] = await Promise.all([
    buoiThuongCuaLop(lopId, tu, denExcl),
    buoiThuongCuaLopInclusive(lopId, mtW.tu, mtW.den),
  ])
  const buoiThangIds = buoiThang.map((b) => b.id)
  const buoiMTIds = buoiMTCua.map((b) => b.id)

  const mtBuoiId = await timBuoiMT(buoiMTIds)
  const [mtPctMap, etPctMap, coMatMap] = await Promise.all([
    mtBuoiId ? pctByHsTrongBuoi(mtBuoiId, 'mt') : Promise.resolve(new Map<string, number>()),
    etPctThangByHs(buoiThangIds),
    coMatMapCuaBuoi(buoiThangIds),
  ])
  const btvnAgg = await btvnAggByHs(buoiThangIds, coMatMap)
  const tienBoMap = await tienBoMetricByHs(buoiThangIds, hsIds)

  const xuatSac = new Map<string, XuatSacMetric>()
  const chamChi = new Map<string, ChamChiMetric>()
  for (const hs of roster) {
    const hw = btvnAgg.get(hs.id)
    xuatSac.set(hs.id, {
      mtPct: mtPctMap.get(hs.id) ?? null,
      etPct: etPctMap.get(hs.id) ?? null,
      hwPct: hw && hw.tiLeN ? hw.tiLeSum / hw.tiLeN : null,
    })
    chamChi.set(hs.id, {
      hoanThanh: hw?.hoanThanh ?? 0,
      tongBuoi: hw?.tong ?? 0,
      avgTiLeDung: hw && hw.tiLeN ? hw.tiLeSum / hw.tiLeN : null,
    })
  }
  return { roster, xuatSac, tienBo: tienBoMap, chamChi }
}

// ════════════════════════════════════════════════════════════════════════════
// XẾP HẠNG + GHÉP SLOT (đề xuất SỐNG + slot đã confirmed)
// ════════════════════════════════════════════════════════════════════════════
function hasDuLieu(loaiGiai: LoaiGiai, id: string, m: LopMetrics): boolean {
  if (loaiGiai === 'xuat_sac') { const x = m.xuatSac.get(id); return !!x && (x.mtPct != null || x.etPct != null || x.hwPct != null) }
  if (loaiGiai === 'tien_bo') return (m.tienBo.get(id)?.buoiCount ?? 0) > 0
  return (m.chamChi.get(id)?.tongBuoi ?? 0) > 0
}
function rankRoster(loaiGiai: LoaiGiai, m: LopMetrics): string[] {
  const ids = m.roster.map((r) => r.id).filter((id) => hasDuLieu(loaiGiai, id, m))
  if (loaiGiai === 'xuat_sac') {
    return ids.sort((a, b) => {
      const A = m.xuatSac.get(a)!, B = m.xuatSac.get(b)!
      return (B.mtPct ?? -1) - (A.mtPct ?? -1) || (B.etPct ?? -1) - (A.etPct ?? -1) || (B.hwPct ?? -1) - (A.hwPct ?? -1)
    })
  }
  if (loaiGiai === 'tien_bo') return ids.sort((a, b) => (m.tienBo.get(b)?.totalDelta ?? -Infinity) - (m.tienBo.get(a)?.totalDelta ?? -Infinity))
  return ids.sort((a, b) => {
    const A = m.chamChi.get(a)!, B = m.chamChi.get(b)!
    return B.hoanThanh - A.hoanThanh || (B.avgTiLeDung ?? -1) - (A.avgTiLeDung ?? -1)
  })
}
export type MetricChip = { label: string; strong?: boolean; up?: boolean }
function metricChips(loaiGiai: LoaiGiai, id: string, m: LopMetrics): MetricChip[] {
  const pct = (v: number | null) => v == null ? null : `${Math.round(v * 100)}%`
  if (loaiGiai === 'xuat_sac') {
    const x = m.xuatSac.get(id); const out: MetricChip[] = []
    if (x?.mtPct != null) out.push({ label: `MT ${pct(x.mtPct)}`, strong: true })
    if (x?.etPct != null) out.push({ label: `ET ${pct(x.etPct)}` })
    if (x?.hwPct != null) out.push({ label: `BTVN ${pct(x.hwPct)}` })
    return out
  }
  if (loaiGiai === 'tien_bo') {
    const t = m.tienBo.get(id); if (!t) return []
    const out: MetricChip[] = [{ label: `Elo ${t.totalDelta >= 0 ? '+' : ''}${t.totalDelta}`, up: true }]
    if (t.eloBefore != null && t.eloAfter != null) out.push({ label: `${t.eloBefore} → ${t.eloAfter}`, up: true })
    return out
  }
  const c = m.chamChi.get(id); if (!c) return []
  const out: MetricChip[] = [{ label: `${c.hoanThanh}/${c.tongBuoi} buổi BTVN`, strong: true }]
  if (c.avgTiLeDung != null) out.push({ label: `TB đúng ${pct(c.avgTiLeDung)}` })
  return out
}

export type TraoGiaiSlot = {
  slotIndex: number
  hocSinhId: string
  hoTen: string
  maHs: string | null
  confirmed: boolean
  giaiThuongId: string | null
  metrics: MetricChip[]
}
export type TraoGiaiAward = { loaiGiai: LoaiGiai; slotCount: number; slots: TraoGiaiSlot[] }
export type TraoGiaiClass = {
  lopId: string; tenLop: string; mon: string; khoi: string | null
  siSo: number
  hoanThanhAt: string | null
  hoanThanhBoi: string | null
  awards: TraoGiaiAward[]
  roster: RosterHS[]
  daXacNhan: number
  // metric chips cho MỌI HS trong lớp (không chỉ HS đang chiếm slot) — dùng khi GV đổi dropdown sang
  // 1 HS khác ngoài đề xuất top-N, UI vẫn hiện được số liệu thật thay vì để trống.
  metricsCuaHs: Record<LoaiGiai, Record<string, MetricChip[]>>
}

export async function getTraoGiaiThang(ym: string, khoi?: string): Promise<TraoGiaiClass[]> {
  const thangDate = monthStart(ym)
  const allLop = await listLop(khoi)
  const activeLop = allLop.filter((l) => l.trang_thai === 'dang_hoc')
  if (!activeLop.length) return []
  const lopIds = activeLop.map((l) => l.id)

  const [{ data: giaiRows, error: eG }, { data: ltRows, error: eL }] = await Promise.all([
    supabase.from('giai_thuong').select('*').eq('thang', thangDate).in('lop_id', lopIds).limit(LIMIT),
    supabase.from('giai_thuong_lop_thang').select('*').eq('thang', thangDate).in('lop_id', lopIds).limit(LIMIT),
  ])
  if (eG) throw eG
  if (eL) throw eL
  const giaiByLop = new Map<string, GiaiThuongRow[]>()
  for (const r of (giaiRows ?? []) as GiaiThuongRow[]) { const a = giaiByLop.get(r.lop_id) ?? []; a.push(r); giaiByLop.set(r.lop_id, a) }
  const ltByLop = new Map(((ltRows ?? []) as LopThangRow[]).map((r) => [r.lop_id, r]))

  return Promise.all(activeLop.map(async (lop): Promise<TraoGiaiClass> => {
    const metrics = await computeLopMetrics(lop.id, ym)
    const confirmed = giaiByLop.get(lop.id) ?? []
    const allConfirmedIds = new Set(confirmed.map((r) => r.hoc_sinh_id))
    const nameOf = (id: string) => metrics.roster.find((r) => r.id === id)

    const awards: TraoGiaiAward[] = LOAI_GIAI_THU_TU.map((loaiGiai) => {
      const already = confirmed.filter((r) => r.loai_giai === loaiGiai).sort((a, b) => a.duyet_at.localeCompare(b.duyet_at))
      // 1 HS/1 giải/tháng (UNIQUE DB) → loại HẾT HS đã confirmed ở BẤT KỲ giải nào khỏi pool đề xuất còn lại.
      const ranked = rankRoster(loaiGiai, metrics).filter((id) => !allConfirmedIds.has(id))
      const remaining = Math.max(0, SLOT_COUNT[loaiGiai] - already.length)
      const fill = ranked.slice(0, remaining)
      const slots: TraoGiaiSlot[] = [
        ...already.map((row, i): TraoGiaiSlot => ({
          slotIndex: i, hocSinhId: row.hoc_sinh_id, hoTen: nameOf(row.hoc_sinh_id)?.ho_ten ?? '?', maHs: nameOf(row.hoc_sinh_id)?.ma_hs ?? null,
          confirmed: true, giaiThuongId: row.id, metrics: metricChips(loaiGiai, row.hoc_sinh_id, metrics),
        })),
        ...fill.map((id, i): TraoGiaiSlot => ({
          slotIndex: already.length + i, hocSinhId: id, hoTen: nameOf(id)?.ho_ten ?? '?', maHs: nameOf(id)?.ma_hs ?? null,
          confirmed: false, giaiThuongId: null, metrics: metricChips(loaiGiai, id, metrics),
        })),
      ]
      return { loaiGiai, slotCount: SLOT_COUNT[loaiGiai], slots }
    })

    const lt = ltByLop.get(lop.id) ?? null
    const metricsCuaHs: Record<LoaiGiai, Record<string, MetricChip[]>> = { xuat_sac: {}, tien_bo: {}, cham_chi: {} }
    for (const loaiGiai of LOAI_GIAI_THU_TU) for (const hs of metrics.roster) metricsCuaHs[loaiGiai][hs.id] = metricChips(loaiGiai, hs.id, metrics)
    return {
      lopId: lop.id, tenLop: lop.ten_lop, mon: lop.mon, khoi: lop.khoi,
      siSo: metrics.roster.length,
      hoanThanhAt: lt?.hoan_thanh_at ?? null, hoanThanhBoi: lt?.hoan_thanh_boi ?? null,
      awards, roster: metrics.roster,
      daXacNhan: confirmed.length,
      metricsCuaHs,
    }
  }))
}

// Danh sách khối có lớp đang học (cho filter) — không phụ thuộc tháng.
export async function listKhoiCoLop(): Promise<string[]> {
  const lops = await listLop()
  return [...new Set(lops.filter((l: Lop) => l.trang_thai === 'dang_hoc' && l.khoi).map((l: Lop) => l.khoi as string))].sort()
}

// ════════════════════════════════════════════════════════════════════════════
// GHI — 3 mức workflow (KHÔNG gộp, xem CLAUDE.md §Trao giải):
//  · slot   : insert/delete 1 dòng giai_thuong.
//  · lớp    : upsert giai_thuong_lop_thang.hoan_thanh_at.
//  · tháng  : bulk update giai_thuong.cong_bo_at (áp MỌI lớp cùng lúc — công bố ra app PH/HS).
// ════════════════════════════════════════════════════════════════════════════
function friendlyGiaiThuongError(e: unknown): Error {
  const msg = String((e as { message?: string })?.message ?? e)
  const code = (e as { code?: string })?.code
  if (/đã đủ/.test(msg) && /slot/i.test(msg)) return new Error('Lớp này vừa đủ slot cho giải này (có thể do người khác vừa xác nhận) — tải lại trang rồi thử lại.')
  if (code === '23505' || /duplicate key|unique/i.test(msg)) return new Error('Học sinh này đã được trao 1 giải khác trong tháng — tải lại trang để xem dữ liệu mới nhất.')
  return e instanceof Error ? e : new Error(msg)
}

export async function xacNhanSlot(p: { thangYm: string; lopId: string; mon: string; hocSinhId: string; loaiGiai: LoaiGiai; nhanSuId: string }): Promise<string> {
  const { data, error } = await supabase.from('giai_thuong').insert({
    thang: monthStart(p.thangYm), lop_id: p.lopId, mon: p.mon, hoc_sinh_id: p.hocSinhId, loai_giai: p.loaiGiai, duyet_boi: p.nhanSuId,
  }).select('id').single()
  if (error) throw friendlyGiaiThuongError(error)
  return (data as { id: string }).id
}

async function layLopThang(lopId: string, thangYm: string): Promise<LopThangRow | null> {
  const { data, error } = await supabase.from('giai_thuong_lop_thang').select('*').eq('lop_id', lopId).eq('thang', monthStart(thangYm)).maybeSingle()
  if (error) throw error
  return data as LopThangRow | null
}

// Bỏ xác nhận = DELETE dòng thật — chỉ cho phép khi lớp CHƯA "Hoàn thành" (khoá sửa). Kiểm tra lại từ DB
// (không tin state UI) để tránh xoá lọt khi 2 tab/2 người thao tác cùng lúc.
export async function boXacNhanSlot(giaiThuongId: string, lopId: string, thangYm: string): Promise<void> {
  const lt = await layLopThang(lopId, thangYm)
  if (lt?.hoan_thanh_at) throw new Error('Lớp đã hoàn thành — bấm "Mở lại lớp" trước khi bỏ xác nhận.')
  const { error } = await supabase.from('giai_thuong').delete().eq('id', giaiThuongId)
  if (error) throw error
}

// Đổi người ở 1 slot ĐÃ confirmed (dropdown vẫn mở khi lớp chưa hoàn thành, xem mockup) = xoá dòng cũ +
// tạo dòng mới, GIỮ NGUYÊN trạng thái "đã xác nhận" (không tự bỏ tick).
export async function doiNguoiSlotDaXacNhan(p: { giaiThuongIdCu: string; thangYm: string; lopId: string; mon: string; hocSinhIdMoi: string; loaiGiai: LoaiGiai; nhanSuId: string }): Promise<string> {
  const lt = await layLopThang(p.lopId, p.thangYm)
  if (lt?.hoan_thanh_at) throw new Error('Lớp đã hoàn thành — bấm "Mở lại lớp" trước khi đổi người.')
  const { error: eDel } = await supabase.from('giai_thuong').delete().eq('id', p.giaiThuongIdCu)
  if (eDel) throw eDel
  return xacNhanSlot({ thangYm: p.thangYm, lopId: p.lopId, mon: p.mon, hocSinhId: p.hocSinhIdMoi, loaiGiai: p.loaiGiai, nhanSuId: p.nhanSuId })
}

export async function hoanThanhLop(lopId: string, thangYm: string, nhanSuId: string): Promise<void> {
  const { error } = await supabase.from('giai_thuong_lop_thang').upsert(
    { lop_id: lopId, thang: monthStart(thangYm), hoan_thanh_at: new Date().toISOString(), hoan_thanh_boi: nhanSuId },
    { onConflict: 'lop_id,thang' })
  if (error) throw error
}
export async function moLaiLop(lopId: string, thangYm: string): Promise<void> {
  const { error } = await supabase.from('giai_thuong_lop_thang').upsert(
    { lop_id: lopId, thang: monthStart(thangYm), hoan_thanh_at: null, hoan_thanh_boi: null },
    { onConflict: 'lop_id,thang' })
  if (error) throw error
}

// Chốt kết quả THÁNG (toàn trung tâm) — bulk công bố MỌI giai_thuong chưa công bố của tháng đang xem
// (không riêng từng lớp). Trả số dòng vừa công bố.
export async function chotKetQuaThang(thangYm: string): Promise<number> {
  const { data, error } = await supabase.from('giai_thuong').update({ cong_bo_at: new Date().toISOString() })
    .eq('thang', monthStart(thangYm)).is('cong_bo_at', null).select('id')
  if (error) throw error
  return (data ?? []).length
}
