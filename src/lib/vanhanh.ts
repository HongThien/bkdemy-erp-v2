// vanhanh.ts — hỗ trợ Dashboard "Chất lượng vận hành": nhóm theo TEAM (Ops/TA/GV,
// 1 người có thể nhiều team) + độ giàu dữ liệu (tiến độ/chất lượng) cho card Chi tiết.
// TÁI DÙNG listAllStaffTasks (gami.ts) cho khung việc — file này chỉ thêm phần
// team-mapping + đào sâu chất lượng (KHÔNG tính lại đã-xong/deadline).
import { supabase } from './supabase'
import type { StaffTaskRow, TabKey } from './gami'
import { getMyProfile, getMyScope } from './nhansu'

const LIMIT = 10000

export type TeamKey = 'ops' | 'ta' | 'gv'
export const TEAM_LABEL: Record<TeamKey, string> = { ops: 'OPS', ta: 'Trợ giảng (TA)', gv: 'Giáo viên (GV)' }

export type NsTeamInfo = { nhan_su_id: string; ho_ten: string; teams: TeamKey[] }
// Ai thuộc team nào — GV/TA suy từ phan_cong_lop.vai_tro (đúng nguồn getMyTasks dùng), OPS suy từ nhan_su_team.ma='ops'.
export async function listNhanSuTeams(): Promise<NsTeamInfo[]> {
  const [{ data: pc }, { data: nsAll }, { data: teamLinks }, { data: teams }] = await Promise.all([
    supabase.from('phan_cong_lop').select('nhan_su_id, vai_tro').limit(LIMIT),
    supabase.from('nhan_su').select('id, ho_ten').eq('trang_thai', 'dang_lam').limit(LIMIT),
    supabase.from('nhan_su_team').select('nhan_su_id, team_id').limit(LIMIT),
    supabase.from('team').select('id, ma').limit(200),
  ])
  const opsTeamIds = new Set(((teams ?? []) as any[]).filter((t) => t.ma === 'ops').map((t) => t.id))
  const opsNs = new Set(((teamLinks ?? []) as any[]).filter((l) => opsTeamIds.has(l.team_id)).map((l) => l.nhan_su_id))
  const rolesByNs = new Map<string, Set<TeamKey>>()
  for (const r of (pc ?? []) as any[]) {
    const t: TeamKey = r.vai_tro === 'gv' ? 'gv' : 'ta'
    if (!rolesByNs.has(r.nhan_su_id)) rolesByNs.set(r.nhan_su_id, new Set())
    rolesByNs.get(r.nhan_su_id)!.add(t)
  }
  for (const id of opsNs) { if (!rolesByNs.has(id)) rolesByNs.set(id, new Set()); rolesByNs.get(id)!.add('ops') }
  return ((nsAll ?? []) as any[])
    .map((n) => ({ nhan_su_id: n.id as string, ho_ten: n.ho_ten as string, teams: [...(rolesByNs.get(n.id) ?? [])] }))
    .filter((n) => n.teams.length > 0)
}

// ── ĐÀO SÂU 1 TASK (chi tiết): tiến độ% (đã chấm/tổng HS có mặt) + chất lượng% (theo loại).
// Chất lượng: ĐÃ DUYỆT (viec_van_hanh_duyet) → dùng số CHÍNH THỨC đó · CHƯA DUYỆT → fallback
// số TỰ ĐỘNG suy từ data thô (Thùy chốt 07-05: "cái gì duyệt rồi thì hiện số duyệt, chưa duyệt
// thì để số tự động"). ──
export type TaskDetail = StaffTaskRow & {
  tienDoPct: number | null; chatLuongPct: number | null; chatLuongLabel: string | null; hieuSuatPct: number | null
  daDuyet: boolean; nguoiDuyetId?: string; duyetAt?: string
}
export async function layChiTietTasks(rows: StaffTaskRow[]): Promise<TaskDetail[]> {
  const buoiIds = [...new Set(rows.map((r) => r.buoiId))].filter(Boolean)
  if (!buoiIds.length) return []
  const [{ data: roster }, { data: grades }, { data: btvn }, { data: danhgia }, { data: daDuyetRows }] = await Promise.all([
    supabase.from('buoi_hoc_hs').select('buoi_hoc_id, hoc_sinh_id, diem_danh').in('buoi_hoc_id', buoiIds).limit(LIMIT * 5),
    supabase.from('gami_grades').select('buoi_hoc_id, hoc_sinh_id, muc, result, problem:problem_id(phase)').in('buoi_hoc_id', buoiIds).limit(LIMIT * 5),
    supabase.from('btvn_ket_qua').select('buoi_hoc_id, hoc_sinh_id, trang_thai_nop').in('buoi_hoc_id', buoiIds).limit(LIMIT * 5),
    supabase.from('buoi_danh_gia_dang').select('buoi_hoc_id, hoc_sinh_id, diem').in('buoi_hoc_id', buoiIds).limit(LIMIT * 5),
    supabase.from('viec_van_hanh_duyet').select('buoi_hoc_id, tab, nhan_su_id, tien_do, chat_luong, hieu_suat, nguoi_duyet, duyet_at').in('buoi_hoc_id', buoiIds).limit(LIMIT * 5),
  ])
  const daDuyetMap = new Map<string, { tien_do: number; chat_luong: number; hieu_suat: number | null; nguoi_duyet: string; duyet_at: string }>()
  for (const d of (daDuyetRows ?? []) as any[]) daDuyetMap.set(DA_DUYET_KEY(d.buoi_hoc_id, d.tab, d.nhan_su_id), d)
  const rosterCoMat = new Map<string, Set<string>>() // buoiId -> hs có mặt
  for (const r of (roster ?? []) as any[]) {
    if (r.diem_danh !== 'co_mat') continue
    if (!rosterCoMat.has(r.buoi_hoc_id)) rosterCoMat.set(r.buoi_hoc_id, new Set())
    rosterCoMat.get(r.buoi_hoc_id)!.add(r.hoc_sinh_id)
  }
  // gami_grades tách theo phase (ingame/et) — group riêng.
  const gradesByBuoi: Record<'ingame' | 'et', Map<string, any[]>> = { ingame: new Map(), et: new Map() }
  for (const g of (grades ?? []) as any[]) {
    const phase = g.problem?.phase === 'et' ? 'et' : 'ingame'
    if (!gradesByBuoi[phase].has(g.buoi_hoc_id)) gradesByBuoi[phase].set(g.buoi_hoc_id, [])
    gradesByBuoi[phase].get(g.buoi_hoc_id)!.push(g)
  }
  const btvnByBuoi = new Map<string, any[]>()
  for (const b of (btvn ?? []) as any[]) { if (!btvnByBuoi.has(b.buoi_hoc_id)) btvnByBuoi.set(b.buoi_hoc_id, []); btvnByBuoi.get(b.buoi_hoc_id)!.push(b) }
  const dgByBuoi = new Map<string, any[]>()
  for (const d of (danhgia ?? []) as any[]) { if (!dgByBuoi.has(d.buoi_hoc_id)) dgByBuoi.set(d.buoi_hoc_id, []); dgByBuoi.get(d.buoi_hoc_id)!.push(d) }

  const mucToPct = (muc: number) => ((muc - 1) / 4) * 100
  const etResultToPct = (r: string) => r === 'correct' ? 100 : r === 'partial' ? 50 : 0

  return rows.map((r): TaskDetail => {
    const roster = rosterCoMat.get(r.buoiId)?.size ?? 0
    let tienDoPct: number | null = null, chatLuongPct: number | null = null, chatLuongLabel: string | null = null
    if (r.tab === 'ingame' || r.tab === 'et') {
      const list = gradesByBuoi[r.tab].get(r.buoiId) ?? []
      const distinctHs = new Set(list.map((g) => g.hoc_sinh_id)).size
      tienDoPct = roster > 0 ? Math.round((distinctHs / roster) * 100) : null
      if (list.length) {
        chatLuongPct = r.tab === 'ingame'
          ? Math.round(list.filter((g) => g.muc != null).reduce((s, g) => s + mucToPct(g.muc), 0) / (list.filter((g) => g.muc != null).length || 1))
          : Math.round(list.reduce((s, g) => s + etResultToPct(g.result), 0) / list.length)
      }
      chatLuongLabel = r.tab === 'ingame' ? 'TB mức chấm' : '% câu đúng'
    } else if (r.tab === 'btvn') {
      const list = btvnByBuoi.get(r.buoiId) ?? []
      const distinctHs = new Set(list.map((b) => b.hoc_sinh_id)).size
      tienDoPct = roster > 0 ? Math.round((distinctHs / roster) * 100) : null
      const dungHan = list.filter((b) => b.trang_thai_nop === 'nop_dung_han').length
      chatLuongPct = list.length ? Math.round((dungHan / list.length) * 100) : null
      chatLuongLabel = '% HS nộp đúng hạn'
    } else if (r.tab === 'danhgia') {
      const list = dgByBuoi.get(r.buoiId) ?? []
      const distinctHs = new Set(list.map((d) => d.hoc_sinh_id)).size
      tienDoPct = roster > 0 ? Math.round((distinctHs / roster) * 100) : null
      chatLuongPct = list.length ? Math.round((list.reduce((s, d) => s + Number(d.diem) * 100, 0) / list.length)) : null
      chatLuongLabel = '% điểm đánh giá TB'
    }
    // ĐÃ DUYỆT → ghi đè CẢ tiến độ lẫn chất lượng bằng số CHÍNH THỨC người đã chốt (Thùy 07-05 lần 2:
    // tiến độ giờ cũng là đề-xuất-máy + người chốt, không còn thuần tự động sau khi duyệt).
    // hiệu suất = snapshot đã tính lúc duyệt (auto, không phải người điền) — CHƯA duyệt thì để trống
    // (không tự suy hiệu suất "nháp" từ số thô, tránh nhầm với số chính thức).
    const duyet = daDuyetMap.get(DA_DUYET_KEY(r.buoiId, r.tab, r.nhan_su_id))
    if (duyet) return { ...r, tienDoPct: duyet.tien_do, chatLuongPct: duyet.chat_luong, chatLuongLabel: chatLuongLabel ?? 'Chất lượng', hieuSuatPct: duyet.hieu_suat, daDuyet: true, nguoiDuyetId: duyet.nguoi_duyet, duyetAt: duyet.duyet_at }
    return { ...r, tienDoPct, chatLuongPct, chatLuongLabel, hieuSuatPct: null, daDuyet: false }
  })
}

export const TASK_TABS: TabKey[] = ['danhgia', 'ingame', 'et', 'btvn']
export const TASK_TAB_LABEL: Record<TabKey, string> = { diemdanh: 'Điểm danh', danhgia: 'Đánh giá sau buổi', ingame: 'Chấm bài trên lớp', et: 'Chấm ET', btvn: 'Chấm BTVN' }

// ============================================================================
// DUYỆT CHẤT LƯỢNG (mig 0081) — mỗi task XONG cần 1 lượt duyệt mới coi CHÍNH THỨC.
// Người duyệt: MẶC ĐỊNH cấp trên theo cây tổ chức (span-of-control, getMyScope) —
// RIÊNG "Chấm bài trên lớp" khi người làm là TA (vai='tg') thì người duyệt là
// GV CỦA CHÍNH LỚP ĐÓ (phạm vi lớp ghi đè cây tổ chức, vì 1 TA trợ nhiều lớp/GV).
// Anti-NULL: "chưa duyệt" = KHÔNG có dòng viec_van_hanh_duyet — KHÔNG tạo trước.
// ============================================================================
export type DuyetRow = StaffTaskRow & { duyetBoi: 'to_chuc' | 'gv_lop' }
const DA_DUYET_KEY = (buoiId: string, tab: string, nsId: string) => `${buoiId}|${tab}|${nsId}`

// ── TIẾN ĐỘ THEO HẠN — 4 mức (Thùy chốt 07-05 lần 2+3), máy ĐỀ XUẤT theo độ trễ, người CHỐT CUỐI.
export const TIEN_DO_TIERS = [
  { key: 'dung_han', label: 'Đúng hạn', diem: 100 },
  { key: 'cham_1', label: 'Chậm cấp 1', diem: 90 },
  { key: 'cham_2', label: 'Chậm cấp 2', diem: 80 },
  { key: 'cham_3', label: 'Chậm cấp 3', diem: 70 },
] as const
const CHAM_NGUONG_GIO = { cap1: 12, cap2: 24 } // trễ <12h=cấp1 · 12-24h=cấp2 · ≥24h=cấp3 (Thùy chốt)
export function deXuatTienDo(r: StaffTaskRow): { key: string; label: string; diem: number } {
  if (!r.done || !r.doneAt || r.deadline == null) return TIEN_DO_TIERS[0]
  const treGio = (new Date(r.doneAt).getTime() - r.deadline) / 3600000
  if (treGio <= 0) return TIEN_DO_TIERS[0]
  return treGio <= CHAM_NGUONG_GIO.cap1 ? TIEN_DO_TIERS[1] : treGio <= CHAM_NGUONG_GIO.cap2 ? TIEN_DO_TIERS[2] : TIEN_DO_TIERS[3]
}
// Quick-pick chung cho ô nhập % (tiến độ khi đổi khác đề xuất + chất lượng) — 1 click, đỡ gõ tay.
export const PCT_QUICK_PICKS = [100, 95, 90, 85, 80]

// Hàng đang CHỜ DUYỆT của người ĐANG ĐĂNG NHẬP (cấp trên của người làm, HOẶC GV của lớp nếu là TA-chấm-lớp).
export async function layDanhSachChoDuyet(allRows: StaffTaskRow[]): Promise<DuyetRow[]> {
  const [prof, scope] = await Promise.all([getMyProfile(), getMyScope()])
  if (!prof || !scope) return []
  const myId = prof.nhanSu.id
  const duoiToi = new Set([...scope.giamSatTrucTiep, ...scope.giamSatSau].map((r) => r.nhan_su_id))
  const { data: gvLop } = await supabase.from('phan_cong_lop').select('lop_id').eq('nhan_su_id', myId).eq('vai_tro', 'gv').limit(LIMIT)
  const myGvLopIds = new Set(((gvLop ?? []) as any[]).map((r) => r.lop_id))

  const done = allRows.filter((r) => r.done)
  const routed: DuyetRow[] = []
  for (const r of done) {
    if (r.tab === 'ingame' && r.vai === 'tg' && myGvLopIds.has(r.lopId)) { routed.push({ ...r, duyetBoi: 'gv_lop' }); continue }
    if (duoiToi.has(r.nhan_su_id) && !(r.tab === 'ingame' && r.vai === 'tg')) routed.push({ ...r, duyetBoi: 'to_chuc' })
  }
  const buoiIds = [...new Set(routed.map((r) => r.buoiId))]
  if (!buoiIds.length) return []
  const { data: daDuyet } = await supabase.from('viec_van_hanh_duyet').select('buoi_hoc_id, tab, nhan_su_id').in('buoi_hoc_id', buoiIds).limit(LIMIT)
  const daDuyetSet = new Set(((daDuyet ?? []) as any[]).map((d) => DA_DUYET_KEY(d.buoi_hoc_id, d.tab, d.nhan_su_id)))
  return routed.filter((r) => !daDuyetSet.has(DA_DUYET_KEY(r.buoiId, r.tab, r.nhan_su_id))).sort((a, b) => a.ngay.localeCompare(b.ngay))
}

// Duyệt 1 task — tienDo mặc định = đề xuất máy (r truyền vào để tính đề xuất + validate lý do khi đổi).
// Đổi tienDo KHÁC đề xuất máy mà không ghi lý do → CHẶN (chống nhân sự tự ý sửa hiệu suất cho nhau).
export async function duyetMot(r: StaffTaskRow, p: { tienDo: number; chatLuong: number; tienDoLyDo?: string | null; ghiChu?: string | null }): Promise<void> {
  const prof = await getMyProfile()
  if (!prof) throw new Error('Không xác định được người duyệt')
  const deXuat = deXuatTienDo(r).diem
  if (p.tienDo !== deXuat && !p.tienDoLyDo?.trim()) throw new Error('Đổi tiến độ khác đề xuất của hệ thống — cần ghi lý do.')
  const hieuSuat = Math.round((p.tienDo + p.chatLuong) / 2)
  const { error } = await supabase.from('viec_van_hanh_duyet').upsert(
    {
      buoi_hoc_id: r.buoiId, tab: r.tab, nhan_su_id: r.nhan_su_id,
      tien_do: p.tienDo, tien_do_de_xuat: deXuat, tien_do_ly_do: p.tienDo !== deXuat ? p.tienDoLyDo!.trim() : null,
      chat_luong: p.chatLuong, hieu_suat: hieuSuat,
      nguoi_duyet: prof.nhanSu.id, ghi_chu: p.ghiChu ?? null, duyet_at: new Date().toISOString(),
    },
    { onConflict: 'buoi_hoc_id,tab,nhan_su_id' })
  if (error) throw error
}
// Duyệt HÀNG LOẠT — LUÔN theo đề xuất máy (không ai gõ tay hàng loạt), chất lượng mặc định 100%
// (đa số task giống nhau, đúng cadence Thùy nói = daily; task đặc biệt thì duyệt riêng bằng duyetMot).
export async function duyetHangLoat(rows: StaffTaskRow[], chatLuong = 100): Promise<void> {
  const prof = await getMyProfile()
  if (!prof) throw new Error('Không xác định được người duyệt')
  if (!rows.length) return
  const payload = rows.map((r) => {
    const diem = deXuatTienDo(r).diem
    return {
      buoi_hoc_id: r.buoiId, tab: r.tab, nhan_su_id: r.nhan_su_id,
      tien_do: diem, tien_do_de_xuat: diem, chat_luong: chatLuong, hieu_suat: Math.round((diem + chatLuong) / 2),
      nguoi_duyet: prof.nhanSu.id, duyet_at: new Date().toISOString(),
    }
  })
  const { error } = await supabase.from('viec_van_hanh_duyet').upsert(payload, { onConflict: 'buoi_hoc_id,tab,nhan_su_id' })
  if (error) throw error
}
