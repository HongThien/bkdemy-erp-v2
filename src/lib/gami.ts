// Data-layer GAMI (seam) — luồng buổi học chính: mở buổi → điểm danh → chấm → đóng phase.
// UI chỉ gọi qua đây. Engine thuần ở src/gami/*.js (đã test). Buổi pure-derive: đẻ dòng khi MỞ.
import { supabase } from './supabase'
import { computeEloUpdate } from '../gami/elo.js'
import { problemPoints, expForRank, rankSession } from '../gami/exp.js'
import { RANK_EXP, ATTEND_FLOOR_EXP } from '../gami/config.js'

const LIMIT = 10000

export type Phase = 'ingame' | 'et' | 'mt'
export type DiemDanh = 'co_mat' | 'vang' | 'vang_phep'
export type BuoiHoc = {
  id: string; ma_buoi: string | null; loai: 'thuong' | 'bu' | 'bo_tro_yeu' | 'bo_tro_duoi' | 'mt'
  lop_id: string | null; ngay: string; thu: number | null; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null
  nguoi_day: string | null; nguoi_day_tg: string | null; trang_thai: 'mo' | 'hoan_tat' | 'huy'; ly_do_huy: string | null
  ingame_dong_at: string | null; et_dong_at: string | null
}
export type BuoiHocHS = { id: string; buoi_hoc_id: string; hoc_sinh_id: string; diem_danh: DiemDanh | null; bu_cho_buoi_id: string | null; hoc_sinh?: { ho_ten: string; ma_hs: string | null; anh_url: string | null } }
export type Problem = { id: string; buoi_hoc_id: string; phase: Phase; problem_no: number; hidden: boolean }
export type Grade = { id: string; problem_id: string; hoc_sinh_id: string; result: string; presentation: string; speed: string; points: number }

// ── helpers ngày/mã (giờ VN) ──────────────────────────────────────
function thuOf(ngay: string): number { const d = new Date(ngay + 'T00:00:00').getDay(); return d === 0 ? 8 : d + 1 } // CN=8, T2=2..T7=7
const thuLabel = (t: number) => (t === 8 ? 'CN' : 'T' + t)
function maBuoi(tenLop: string, thu: number, ngay: string, suffix = ''): string {
  const [y, m, d] = ngay.split('-'); return `${tenLop}.${thuLabel(thu)}.${d}${m}${y}${suffix}`
}

// ── BUỔI ẢO: suy từ TKB × ngày (chưa đẻ dòng) ─────────────────────
export type BuoiAo = { lop: { id: string; ten_lop: string; mon: string; khoi: string | null; bac: string | null }; slot: { gio_bat_dau: string; gio_ket_thuc: string; phong: string | null }; buoi: BuoiHoc | null }
export async function buoiAoCuaNgay(ngay: string): Promise<BuoiAo[]> {
  const thu = thuOf(ngay)
  const { data: slots, error } = await supabase.from('thoi_khoa_bieu')
    .select('gio_bat_dau, gio_ket_thuc, phong, hieu_luc_den, lop:lop_id(id, ten_lop, mon, khoi, bac, ngay_khai_giang, trang_thai)')
    .eq('thu', thu).lte('hieu_luc_tu', ngay).limit(LIMIT)
  if (error) throw error
  const hieuLuc = (slots ?? []).filter((s: any) =>
    (!s.hieu_luc_den || s.hieu_luc_den >= ngay) && s.lop?.trang_thai === 'dang_hoc' &&
    s.lop?.ngay_khai_giang && s.lop.ngay_khai_giang <= ngay)
  if (!hieuLuc.length) return []
  const lopIds = [...new Set(hieuLuc.map((s: any) => s.lop.id))]
  const { data: opened } = await supabase.from('buoi_hoc').select('*').eq('ngay', ngay).eq('loai', 'thuong').in('lop_id', lopIds).limit(LIMIT)
  const openMap = new Map((opened ?? []).map((b: any) => [b.lop_id, b]))
  return hieuLuc.map((s: any) => ({ lop: s.lop, slot: { gio_bat_dau: s.gio_bat_dau, gio_ket_thuc: s.gio_ket_thuc, phong: s.phong }, buoi: (openMap.get(s.lop.id) as BuoiHoc) ?? null }))
}

// ── MỞ BUỔI: đẻ dòng snapshot + seed sĩ số từ ghi danh (idempotent) ──
export async function moBuoi(lopId: string, ngay: string, slot: { gio_bat_dau?: string; gio_ket_thuc?: string; phong?: string | null }): Promise<BuoiHoc> {
  const ex = await supabase.from('buoi_hoc').select('*').eq('lop_id', lopId).eq('ngay', ngay).eq('loai', 'thuong').maybeSingle()
  if (ex.data) return ex.data as BuoiHoc
  const { data: lop, error: eLop } = await supabase.from('lop').select('ten_lop').eq('id', lopId).single()
  if (eLop) throw eLop
  const thu = thuOf(ngay)
  const { data: { user } } = await supabase.auth.getUser()
  // GV chính phụ trách lớp (mặc định người dạy; dạy thay đổi sau)
  const { data: pc } = await supabase.from('phan_cong_lop').select('nhan_su_id').eq('lop_id', lopId).eq('vai_tro', 'gv').eq('la_chinh', true).maybeSingle()
  const { data: buoi, error } = await supabase.from('buoi_hoc').insert({
    ma_buoi: maBuoi((lop as any).ten_lop, thu, ngay), loai: 'thuong', lop_id: lopId, ngay, thu,
    gio_bat_dau: slot.gio_bat_dau ?? null, gio_ket_thuc: slot.gio_ket_thuc ?? null, phong: slot.phong ?? null,
    nguoi_day: (pc as any)?.nhan_su_id ?? null, created_by: user?.id ?? null,
  }).select().single()
  if (error) throw error
  // seed sĩ số = HS đang ghi danh lớp, đã vào lớp tính tới ngày
  const { data: hs } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, ngay_vao').eq('lop_id', lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  const roster = (hs ?? []).filter((h: any) => !h.ngay_vao || h.ngay_vao <= ngay)
  if (roster.length) await supabase.from('buoi_hoc_hs').insert(roster.map((h: any) => ({ buoi_hoc_id: (buoi as any).id, hoc_sinh_id: h.hoc_sinh_id })))
  return buoi as BuoiHoc
}

export async function getBuoi(id: string): Promise<BuoiHoc & { lop?: { ten_lop: string; mon: string } }> {
  const { data, error } = await supabase.from('buoi_hoc').select('*, lop:lop_id(ten_lop, mon)').eq('id', id).single()
  if (error) throw error
  return data as any
}
export async function setNguoiDay(buoiId: string, nhanSuId: string | null): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ nguoi_day: nhanSuId, updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
}
export async function huyBuoi(buoiId: string, lyDo: string): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ trang_thai: 'huy', ly_do_huy: lyDo, updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
}

// ── Sĩ số + điểm danh (OPS) ───────────────────────────────────────
export async function getRoster(buoiId: string): Promise<BuoiHocHS[]> {
  const { data, error } = await supabase.from('buoi_hoc_hs').select('*, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs, anh_url)').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as BuoiHocHS[]
}
export async function diemDanh(buoiHocHsId: string, trangThai: DiemDanh): Promise<void> {
  const { error } = await supabase.from('buoi_hoc_hs').update({ diem_danh: trangThai }).eq('id', buoiHocHsId)
  if (error) throw error
}

// ── Bài + chấm ────────────────────────────────────────────────────
export async function listProblems(buoiId: string, phase: Phase): Promise<Problem[]> {
  const { data, error } = await supabase.from('gami_session_problems').select('*').eq('buoi_hoc_id', buoiId).eq('phase', phase).order('problem_no').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as Problem[]
}
export async function addProblem(buoiId: string, phase: Phase): Promise<Problem> {
  const cur = await listProblems(buoiId, phase)
  const no = cur.length ? Math.max(...cur.map((p) => p.problem_no)) + 1 : 1
  const { data, error } = await supabase.from('gami_session_problems').insert({ buoi_hoc_id: buoiId, phase, problem_no: no }).select().single()
  if (error) throw error
  return data as Problem
}
export async function listGrades(buoiId: string): Promise<Grade[]> {
  const { data, error } = await supabase.from('gami_grades').select('*').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as Grade[]
}
export async function gradeProblem(p: { buoiId: string; problemId: string; hocSinhId: string; result: string; presentation: string; speed: string }): Promise<void> {
  const points = problemPoints({ result: p.result, presentation: p.presentation, speed: p.speed })
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('gami_grades').upsert(
    { buoi_hoc_id: p.buoiId, problem_id: p.problemId, hoc_sinh_id: p.hocSinhId, result: p.result, presentation: p.presentation, speed: p.speed, points, graded_by: user?.id ?? null },
    { onConflict: 'problem_id,hoc_sinh_id' })
  if (error) throw error
}

// ── ĐÓNG PHASE: tính Elo (buổi thường/MT) + ghi EXP. Idempotent. ──
export type RevealRow = { hoc_sinh_id: string; rawPoints: number; rank: number; exp: number; eloBefore?: number; eloAfter?: number; delta?: number }
export async function closePhase(buoiId: string, phase: Phase): Promise<{ already?: boolean; reveal?: RevealRow[] }> {
  const { data: buoi, error: eB } = await supabase.from('buoi_hoc').select('*').eq('id', buoiId).single()
  if (eB) throw eB
  const b = buoi as BuoiHoc
  const dongCol = phase === 'et' ? 'et_dong_at' : 'ingame_dong_at'
  if ((b as any)[dongCol]) return { already: true }
  const coElo = b.loai === 'thuong' || b.loai === 'mt'

  // HS có mặt (R-ET: chấm = có mặt)
  const { data: rosterRows } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id, diem_danh').eq('buoi_hoc_id', buoiId).eq('diem_danh', 'co_mat').limit(LIMIT)
  const hsIds = (rosterRows ?? []).map((r: any) => r.hoc_sinh_id)
  if (!hsIds.length) { await markClosed(buoiId, dongCol, phase, b.loai); return { reveal: [] } }

  // điểm thô = Σ điểm bài của phase
  const probs = await listProblems(buoiId, phase)
  const probIds = probs.map((p) => p.id)
  const grades = probIds.length ? (await supabase.from('gami_grades').select('hoc_sinh_id, problem_id, points').in('problem_id', probIds).limit(LIMIT)).data ?? [] : []
  const raw: Record<string, number> = {}
  for (const id of hsIds) raw[id] = 0
  for (const g of grades as any[]) if (g.hoc_sinh_id in raw) raw[g.hoc_sinh_id] += Number(g.points)

  const reveal: RevealRow[] = []
  if (coElo) {
    // đảm bảo có dòng elo (mặc định 1000)
    const { data: eloRows } = await supabase.from('gami_elo').select('*').in('hoc_sinh_id', hsIds).limit(LIMIT)
    const eloMap = new Map((eloRows ?? []).map((e: any) => [e.hoc_sinh_id, e]))
    const missing = hsIds.filter((id) => !eloMap.has(id))
    if (missing.length) {
      const { data: created } = await supabase.from('gami_elo').insert(missing.map((id) => ({ hoc_sinh_id: id }))).select()
      for (const e of (created ?? []) as any[]) eloMap.set(e.hoc_sinh_id, e)
    }
    const students = hsIds.map((id) => ({ studentId: id, elo: eloMap.get(id).elo, points: raw[id], sessionsPlayed: eloMap.get(id).sessions_played }))
    const updates = computeEloUpdate(students, { isMT: phase === 'mt', classSize: hsIds.length } as any)
    const incSession = phase !== 'et' // ingame/mt mới +1 (calibration)
    for (const u of updates) {
      await supabase.from('gami_elo_history').insert({ hoc_sinh_id: u.studentId, buoi_hoc_id: buoiId, phase, elo_before: u.eloBefore, expected: u.expected, actual: u.actual, delta: u.delta, elo_after: u.eloAfter })
      await supabase.from('gami_elo').update({ elo: u.eloAfter, sessions_played: eloMap.get(u.studentId).sessions_played + (incSession ? 1 : 0), updated_at: new Date().toISOString() }).eq('hoc_sinh_id', u.studentId)
    }
    // xếp hạng (điểm thô; hoà → Δ Elo) → EXP
    const ranks = rankSession(updates.map((u: any) => ({ studentId: u.studentId, rawPoints: raw[u.studentId], eloDelta: u.delta })))
    const deltaMap = new Map(updates.map((u: any) => [u.studentId, u]))
    for (const r of ranks) {
      const exp = expForRank(r.rank, hsIds.length, RANK_EXP[phase])
      await supabase.from('gami_exp_ledger').insert({ hoc_sinh_id: r.studentId, source: 'rank_' + phase, amount: exp, ref_buoi_hoc_id: buoiId })
      const u: any = deltaMap.get(r.studentId)
      reveal.push({ hoc_sinh_id: r.studentId, rawPoints: raw[r.studentId], rank: r.rank, exp, eloBefore: u.eloBefore, eloAfter: u.eloAfter, delta: u.delta })
    }
  } else {
    // bù/bổ trợ: không Elo, EXP sàn (đi học là có)
    for (const id of hsIds) {
      await supabase.from('gami_exp_ledger').insert({ hoc_sinh_id: id, source: 'attend_floor', amount: ATTEND_FLOOR_EXP, ref_buoi_hoc_id: buoiId })
      reveal.push({ hoc_sinh_id: id, rawPoints: raw[id], rank: 0, exp: ATTEND_FLOOR_EXP })
    }
  }
  await markClosed(buoiId, dongCol, phase, b.loai)
  return { reveal }
}
async function markClosed(buoiId: string, dongCol: string, phase: Phase, loai: string): Promise<void> {
  const patch: Record<string, unknown> = { [dongCol]: new Date().toISOString(), updated_at: new Date().toISOString() }
  if (phase === 'et' || loai !== 'thuong') patch.trang_thai = 'hoan_tat' // ET xong / buổi mt/bù xong = hoàn tất
  await supabase.from('buoi_hoc').update(patch).eq('id', buoiId)
}
