// Data-layer GAMI (seam) — luồng buổi học chính: mở buổi → điểm danh → chấm → đóng phase.
// UI chỉ gọi qua đây. Engine thuần ở src/gami/*.js (đã test). Buổi pure-derive: đẻ dòng khi MỞ.
import { supabase } from './supabase'
import { getMyProfile } from './nhansu'
import { getETByBuoi, getETCaus } from './tailieu'
import type { CauHoi } from './kho/api'
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
export type Problem = { id: string; buoi_hoc_id: string; phase: Phase; problem_no: number; hidden: boolean; ma_dang: string | null }
export type Grade = { id: string; problem_id: string; hoc_sinh_id: string; result: string; presentation: string; speed: string; points: number; loi?: string[]; muc?: number | null }
export type ETResult = 'correct' | 'partial' | 'wrong'

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

export async function getBuoi(id: string): Promise<BuoiHoc & { lop?: { ten_lop: string; mon: string; khoi: string | null }; gv_chinh_id: string | null }> {
  const { data, error } = await supabase.from('buoi_hoc').select('*, lop:lop_id(ten_lop, mon, khoi)').eq('id', id).single()
  if (error) throw error
  // GV chính của lớp (mặc định hiển thị khi nguoi_day trống — dạy thay mới ghi nguoi_day)
  const { data: pc } = await supabase.from('phan_cong_lop').select('nhan_su_id').eq('lop_id', (data as any).lop_id).eq('vai_tro', 'gv').eq('la_chinh', true).maybeSingle()
  return { ...(data as any), gv_chinh_id: (pc as any)?.nhan_su_id ?? null }
}
export async function setNguoiDay(buoiId: string, nhanSuId: string | null): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ nguoi_day: nhanSuId, updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
}
export async function huyBuoi(buoiId: string, lyDo: string): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ trang_thai: 'huy', ly_do_huy: lyDo, updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
}
// Hủy buổi tại danh sách (cả khi CHƯA mở): có dòng → set huy; chưa có → đẻ dòng huy luôn (không seed sĩ số).
// Hủy trước khi mở = kế hoạch · hủy sau khi mở = sự cố — cùng kết quả: buổi sang "Đã hủy".
export async function huyBuoiCuaNgay(lopId: string, ngay: string, slot: { gio_bat_dau?: string; gio_ket_thuc?: string; phong?: string | null }, lyDo: string): Promise<void> {
  const ex = await supabase.from('buoi_hoc').select('id').eq('lop_id', lopId).eq('ngay', ngay).eq('loai', 'thuong').maybeSingle()
  if (ex.data) { await huyBuoi((ex.data as any).id, lyDo); return }
  const { data: lop, error: eLop } = await supabase.from('lop').select('ten_lop').eq('id', lopId).single()
  if (eLop) throw eLop
  const thu = thuOf(ngay)
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('buoi_hoc').insert({
    ma_buoi: maBuoi((lop as any).ten_lop, thu, ngay), loai: 'thuong', lop_id: lopId, ngay, thu,
    gio_bat_dau: slot.gio_bat_dau ?? null, gio_ket_thuc: slot.gio_ket_thuc ?? null, phong: slot.phong ?? null,
    trang_thai: 'huy', ly_do_huy: lyDo, created_by: user?.id ?? null,
  })
  if (error) throw error
}

// ── Sĩ số + điểm danh (OPS) ───────────────────────────────────────
export async function getRoster(buoiId: string): Promise<BuoiHocHS[]> {
  const { data, error } = await supabase.from('buoi_hoc_hs').select('*, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs, anh_url)').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as BuoiHocHS[]
}
// Tiến độ điểm danh nhiều buổi (1 query): buoiId → { tong, daDanh }. daDanh = số HS đã có trạng thái.
// "Điểm danh xong" = daDanh >= tong (mọi HS đã đánh dấu). Dùng để OPS task tự rời khỏi "cần làm".
export async function diemDanhTienDo(buoiIds: string[]): Promise<Record<string, { tong: number; daDanh: number }>> {
  if (!buoiIds.length) return {}
  const { data, error } = await supabase.from('buoi_hoc_hs').select('buoi_hoc_id, diem_danh').in('buoi_hoc_id', buoiIds).limit(LIMIT)
  if (error) throw error
  const out: Record<string, { tong: number; daDanh: number }> = {}
  for (const r of (data ?? []) as { buoi_hoc_id: string; diem_danh: string | null }[]) {
    const o = (out[r.buoi_hoc_id] ??= { tong: 0, daDanh: 0 })
    o.tong++; if (r.diem_danh) o.daDanh++
  }
  return out
}
export async function diemDanh(buoiHocHsId: string, trangThai: DiemDanh): Promise<void> {
  const { error } = await supabase.from('buoi_hoc_hs').update({ diem_danh: trangThai }).eq('id', buoiHocHsId)
  if (error) throw error
}
// Đồng bộ sĩ số buổi ĐANG MỞ: THÊM HS đã ghi danh (dang_hoc, ngay_vao ≤ ngày buổi) còn THIẾU trong roster.
// Chỉ thêm, KHÔNG xoá (buổi = snapshot; HS rời giữa chừng vẫn giữ). Vá ca: ghi danh SAU khi đã mở buổi.
export async function dongBoSiSo(buoiId: string): Promise<number> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('lop_id, ngay, trang_thai').eq('id', buoiId).single()
  if (error) throw error
  if ((b as any).trang_thai !== 'mo' || !(b as any).lop_id) return 0
  const { data: hs } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, ngay_vao').eq('lop_id', (b as any).lop_id).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  const enrolled = (hs ?? []).filter((h: any) => !h.ngay_vao || h.ngay_vao <= (b as any).ngay).map((h: any) => h.hoc_sinh_id)
  if (!enrolled.length) return 0
  const { data: cur } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  const have = new Set((cur ?? []).map((r: any) => r.hoc_sinh_id))
  const missing = enrolled.filter((id) => !have.has(id))
  if (!missing.length) return 0
  const { error: eIns } = await supabase.from('buoi_hoc_hs').insert(missing.map((hsid) => ({ buoi_hoc_id: buoiId, hoc_sinh_id: hsid })))
  if (eIns) throw eIns
  return missing.length
}

// ── Bài + chấm ────────────────────────────────────────────────────
export async function listProblems(buoiId: string, phase: Phase): Promise<Problem[]> {
  const { data, error } = await supabase.from('gami_session_problems').select('*').eq('buoi_hoc_id', buoiId).eq('phase', phase).order('problem_no').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as Problem[]
}
export async function addProblem(buoiId: string, phase: Phase, maDang?: string | null): Promise<Problem> {
  const cur = await listProblems(buoiId, phase)
  const no = cur.length ? Math.max(...cur.map((p) => p.problem_no)) + 1 : 1
  const { data, error } = await supabase.from('gami_session_problems').insert({ buoi_hoc_id: buoiId, phase, problem_no: no, ma_dang: maDang ?? null }).select().single()
  if (error) throw error
  return data as Problem
}
// Gán/đổi dạng cho 1 bài (chấm bài trên lớp). null = bỏ gán.
export async function setProblemDang(problemId: string, maDang: string | null): Promise<void> {
  const { error } = await supabase.from('gami_session_problems').update({ ma_dang: maDang }).eq('id', problemId)
  if (error) throw error
}
// Bảng chấm bài trên lớp hiện sẵn N bài (mặc định 10) khi buổi chưa có bài nào.
// Bài = SLOT/cấu trúc (không phải phép đo) → tạo sẵn OK; anti-NULL §1.5 áp ở GRADE (chỉ sinh khi chấm thật).
export async function ensureProblems(buoiId: string, phase: Phase, n: number): Promise<void> {
  const cur = await listProblems(buoiId, phase)
  if (cur.length) return
  const rows = Array.from({ length: n }, (_, i) => ({ buoi_hoc_id: buoiId, phase, problem_no: i + 1 }))
  // ignoreDuplicates: chống đẻ TRÙNG khi effect chạy 2 lần (StrictMode) — unique (buoi,phase,problem_no).
  const { error } = await supabase.from('gami_session_problems').upsert(rows, { onConflict: 'buoi_hoc_id,phase,problem_no', ignoreDuplicates: true })
  if (error) throw error
}

// ── CHẤM ET: nạp câu từ tài liệu ET khớp buổi (lớp + ngày) ─────────
// ET ↔ buổi qua (lop_id, ngay) — KHÔNG FK (lúc tạo ET buổi còn ẢO). Câu ET → 1 problem/câu, gắn ma_dang của câu.
// Trả { etId, caus } (caus đúng thứ tự = thứ tự problem_no seed). etId null = chưa có ET cho buổi này.
export async function loadETForBuoi(buoiId: string): Promise<{ etId: string | null; caus: CauHoi[] }> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('lop_id, ngay').eq('id', buoiId).single()
  if (error) throw error
  const lopId = (b as any).lop_id as string | null
  if (!lopId) return { etId: null, caus: [] }
  const et = await getETByBuoi(lopId, (b as any).ngay)
  if (!et) return { etId: null, caus: [] }
  return { etId: et.id, caus: await getETCaus(et.id) }
}
// Seed problem ET 1-câu-1-bài (idempotent: chỉ seed khi chưa có problem ET nào). ma_dang lấy từ câu.
export async function ensureETProblems(buoiId: string, caus: CauHoi[]): Promise<void> {
  const cur = await listProblems(buoiId, 'et')
  if (cur.length || !caus.length) return
  const rows = caus.map((c, i) => ({ buoi_hoc_id: buoiId, phase: 'et', problem_no: i + 1, ma_dang: c.dang_chinh ?? null }))
  const { error } = await supabase.from('gami_session_problems').upsert(rows, { onConflict: 'buoi_hoc_id,phase,problem_no', ignoreDuplicates: true })
  if (error) throw error
}
// Đồng bộ lại khi ET đổi số câu (CHỈ khi chưa chấm): xoá problem ET cũ + seed lại theo câu mới.
export async function resyncETProblems(buoiId: string, caus: CauHoi[]): Promise<void> {
  const cur = await listProblems(buoiId, 'et')
  const ids = cur.map((p) => p.id)
  if (ids.length) {
    const { data: g } = await supabase.from('gami_grades').select('id').in('problem_id', ids).limit(1)
    if (g && g.length) throw new Error('ET đã có bài chấm — không thể đồng bộ lại (xoá điểm trước nếu cần).')
    const { error } = await supabase.from('gami_session_problems').delete().in('id', ids)
    if (error) throw error
  }
  await ensureETProblems(buoiId, caus)
}
export async function listGrades(buoiId: string): Promise<Grade[]> {
  const { data, error } = await supabase.from('gami_grades').select('*').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as Grade[]
}
// Chấm bài trên lớp: 1 mức 1-5 (gộp 3 chiều cũ). points = muc*20 (Elo); result map để code cũ còn hiểu.
export async function gradeMuc(p: { buoiId: string; problemId: string; hocSinhId: string; muc: number }): Promise<void> {
  const result = p.muc >= 4 ? 'correct' : p.muc === 3 ? 'partial' : 'wrong'
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('gami_grades').upsert(
    { buoi_hoc_id: p.buoiId, problem_id: p.problemId, hoc_sinh_id: p.hocSinhId, muc: p.muc, points: p.muc * 20, result, presentation: 'clean', speed: 'normal', graded_by: user?.id ?? null },
    { onConflict: 'problem_id,hoc_sinh_id' })
  if (error) throw error
}

// Chấm ET (1-click): kết quả 3 mức Đ/C/S (correct/partial/wrong) + mã lỗi (E01..) khi C/S.
// presentation/speed neutral (ET chỉ đo KẾT QUẢ, không trình bày/tốc độ). points = problemPoints để engine cũ chạy.
export async function gradeET(p: { buoiId: string; problemId: string; hocSinhId: string; result: ETResult; loi: string[] }): Promise<void> {
  const points = problemPoints({ result: p.result, presentation: 'clean', speed: 'normal' })
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('gami_grades').upsert(
    { buoi_hoc_id: p.buoiId, problem_id: p.problemId, hoc_sinh_id: p.hocSinhId, result: p.result, presentation: 'clean', speed: 'normal', points, loi: p.loi, graded_by: user?.id ?? null },
    { onConflict: 'problem_id,hoc_sinh_id' })
  if (error) throw error
}

// Bỏ chấm 1 ô (HS × bài): xoá dòng grade (anti-NULL: chưa đo = không có dòng). Dùng khi click lại mức đang chọn.
export async function deleteGrade(problemId: string, hocSinhId: string): Promise<void> {
  const { error } = await supabase.from('gami_grades').delete().match({ problem_id: problemId, hoc_sinh_id: hocSinhId })
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

// ── ĐÁNH GIÁ SAU BUỔI (GV) ────────────────────────────────────────
// Dạng của buổi = các dạng đã gắn ở "Chấm bài trên lớp" (ingame). GV cho mỗi HS:
//   verdict per-dạng {0/0.5/1} (= phép đo summative, feed mastery) + nhận xét định tính.
export type DanhGiaDiem = 0 | 0.5 | 1
export type DanhGiaHS = { hoc_sinh_id: string; nhan_xet: string | null; diemTheoDang: Record<string, DanhGiaDiem> }

// Dạng buổi này dạy (distinct ma_dang của bài ingame, bỏ null)
export async function dangCuaBuoi(buoiId: string): Promise<string[]> {
  const { data, error } = await supabase.from('gami_session_problems').select('ma_dang').eq('buoi_hoc_id', buoiId).eq('phase', 'ingame').limit(LIMIT)
  if (error) throw error
  return [...new Set((data ?? []).map((r: any) => r.ma_dang).filter(Boolean))] as string[]
}

export async function getDanhGia(buoiId: string): Promise<Record<string, DanhGiaHS>> {
  const [nx, dg] = await Promise.all([
    supabase.from('buoi_danh_gia').select('hoc_sinh_id, nhan_xet').eq('buoi_hoc_id', buoiId).limit(LIMIT),
    supabase.from('buoi_danh_gia_dang').select('hoc_sinh_id, ma_dang, diem').eq('buoi_hoc_id', buoiId).limit(LIMIT),
  ])
  if (nx.error) throw nx.error
  if (dg.error) throw dg.error
  const out: Record<string, DanhGiaHS> = {}
  const ensure = (id: string) => (out[id] ??= { hoc_sinh_id: id, nhan_xet: null, diemTheoDang: {} })
  for (const r of (nx.data ?? []) as any[]) ensure(r.hoc_sinh_id).nhan_xet = r.nhan_xet
  for (const r of (dg.data ?? []) as any[]) ensure(r.hoc_sinh_id).diemTheoDang[r.ma_dang] = Number(r.diem) as DanhGiaDiem
  return out
}

// verdict 1 ô (HS × dạng). null = xoá (anti-NULL: chưa đánh giá = không có dòng).
export async function setDanhGiaDang(buoiId: string, hsId: string, maDang: string, diem: DanhGiaDiem | null): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (diem === null) {
    const { error } = await supabase.from('buoi_danh_gia_dang').delete().match({ buoi_hoc_id: buoiId, hoc_sinh_id: hsId, ma_dang: maDang })
    if (error) throw error; return
  }
  const { error } = await supabase.from('buoi_danh_gia_dang').upsert(
    { buoi_hoc_id: buoiId, hoc_sinh_id: hsId, ma_dang: maDang, diem, graded_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'buoi_hoc_id,hoc_sinh_id,ma_dang' })
  if (error) throw error
}

// ── VIỆC CỦA TÔI (task-derive cho GV/TG) ──────────────────────────
// Pure-derive (§4): buổi đang mở của lớp tôi phụ trách → task theo vai (KHÔNG đẻ row task).
//   GV → đánh giá sau buổi + chấm bài trên lớp · TG → chấm bài trên lớp + chấm ET.
export type TabKey = 'diemdanh' | 'danhgia' | 'ingame' | 'et'
export type MyTask = { buoiId: string; lop: string; ngay: string; vai: 'gv' | 'tg'; tab: TabKey; label: string }
const TASKS_BY_VAI: Record<'gv' | 'tg', { tab: TabKey; label: string }[]> = {
  gv: [{ tab: 'danhgia', label: 'Đánh giá sau buổi' }, { tab: 'ingame', label: 'Chấm bài trên lớp' }],
  tg: [{ tab: 'ingame', label: 'Chấm bài trên lớp' }, { tab: 'et', label: 'Chấm ET' }],
}
export async function getMyTasks(): Promise<MyTask[]> {
  const prof = await getMyProfile()
  if (!prof) return []
  // 1 người có thể giữ NHIỀU vai trên CÙNG lớp (vd gv-phụ + tg) → gom TẤT CẢ vai, đừng gộp về 1.
  const rolesByLop = new Map<string, Set<'gv' | 'tg'>>()
  for (const pc of prof.phanCong) {
    const v = pc.vai_tro === 'gv' ? 'gv' : 'tg'
    if (!rolesByLop.has(pc.lop_id)) rolesByLop.set(pc.lop_id, new Set())
    rolesByLop.get(pc.lop_id)!.add(v)
  }
  const lopIds = [...rolesByLop.keys()]
  if (!lopIds.length) return []
  const { data: buois, error } = await supabase.from('buoi_hoc')
    .select('id, lop_id, ngay, lop:lop_id(ten_lop)').eq('trang_thai', 'mo').eq('loai', 'thuong').in('lop_id', lopIds).order('ngay').limit(LIMIT)
  if (error) throw error
  const out: MyTask[] = []
  for (const b of (buois ?? []) as any[]) {
    const roles = rolesByLop.get(b.lop_id)!
    const seen = new Set<TabKey>() // dedup tab trùng (chấm bài có ở cả gv lẫn tg)
    for (const vai of ['gv', 'tg'] as const) {
      if (!roles.has(vai)) continue
      for (const t of TASKS_BY_VAI[vai]) {
        if (seen.has(t.tab)) continue
        seen.add(t.tab)
        out.push({ buoiId: b.id, lop: b.lop?.ten_lop ?? '?', ngay: b.ngay, vai, tab: t.tab, label: t.label })
      }
    }
  }
  return out
}

export async function setNhanXet(buoiId: string, hsId: string, nhanXet: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const txt = nhanXet.trim()
  if (!txt) { // rỗng → xoá dòng (không giữ nhận xét trống)
    const { error } = await supabase.from('buoi_danh_gia').delete().match({ buoi_hoc_id: buoiId, hoc_sinh_id: hsId })
    if (error) throw error; return
  }
  const { error } = await supabase.from('buoi_danh_gia').upsert(
    { buoi_hoc_id: buoiId, hoc_sinh_id: hsId, nhan_xet: txt, graded_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'buoi_hoc_id,hoc_sinh_id' })
  if (error) throw error
}
