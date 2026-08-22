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

// ── ĐÀO SÂU 1 TASK (chi tiết) — ĐÚNG 3 quy tắc chốt (BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md):
// **Tiến độ** = hệ thống ĐỀ XUẤT theo độ trễ (deXuatTienDo, giờ) — máy lo tiến độ.
// **Chất lượng** = CHỈ người (leader) duyệt tay mới CHÍNH THỨC — trước khi duyệt, DỰ KIẾN mặc
// định 100% (đúng rule "leader duyệt mặc định 100%", KHÔNG suy từ tỉ lệ đúng-sai HS/mức chấm —
// đó là kết quả HỌC TẬP, không phải chất lượng LÀM VIỆC).
// **Hiệu suất** = avg(tiến độ, chất lượng); CHÍNH THỨC sau khi duyệt, DỰ KIẾN (preview) khi chưa.
// `daDuyet` là cờ DUY NHẤT phân biệt 2 trạng thái này — UI PHẢI luôn gắn nhãn (đề xuất)/(dự kiến)
// cho case chưa duyệt, đừng hiện trần con số dễ tưởng là số chốt. ──
export type TaskDetail = StaffTaskRow & {
  tienDoPct: number | null; chatLuongPct: number | null; chatLuongLabel: string | null; hieuSuatPct: number | null
  daDuyet: boolean; nguoiDuyetId?: string; duyetAt?: string
}
const CHAT_LUONG_MAC_DINH = 100
export async function layChiTietTasks(rows: StaffTaskRow[]): Promise<TaskDetail[]> {
  const buoiIds = [...new Set(rows.map((r) => r.buoiId))].filter(Boolean)
  if (!buoiIds.length) return []
  const { data: daDuyetRows } = await supabase.from('viec_van_hanh_duyet')
    .select('buoi_hoc_id, tab, nhan_su_id, tien_do, chat_luong, hieu_suat, nguoi_duyet, duyet_at').in('buoi_hoc_id', buoiIds).limit(LIMIT * 5)
  const daDuyetMap = new Map<string, { tien_do: number; chat_luong: number; hieu_suat: number | null; nguoi_duyet: string; duyet_at: string }>()
  for (const d of (daDuyetRows ?? []) as any[]) daDuyetMap.set(DA_DUYET_KEY(d.buoi_hoc_id, d.tab, d.nhan_su_id), d)

  return rows.map((r): TaskDetail => {
    const duyet = daDuyetMap.get(DA_DUYET_KEY(r.buoiId, r.tab, r.nhan_su_id))
    if (duyet) return { ...r, tienDoPct: duyet.tien_do, chatLuongPct: duyet.chat_luong, chatLuongLabel: 'Chất lượng', hieuSuatPct: duyet.hieu_suat, daDuyet: true, nguoiDuyetId: duyet.nguoi_duyet, duyetAt: duyet.duyet_at }
    // CHƯA XONG (r.done=false): CẢ 3 số đều là ước tính SỐNG — Tiến độ "nếu xong ngay bây giờ" (so
    // hiện tại với deadline, tụt dần nếu để càng lâu, giống badge Quá hạn/Sát hạn ở "Việc của tôi")
    // + Chất lượng mặc định 100% (cùng rule "leader duyệt mặc định 100%") → Hiệu suất SỐNG = avg 2
    // số này, tính lại ở `hieuSuatOf`. Khác task đã xong ở chỗ Tiến độ còn TỤT DẦN theo thời gian.
    if (!r.done) return { ...r, tienDoPct: tienDoNeuXongBayGio(r), chatLuongPct: CHAT_LUONG_MAC_DINH, chatLuongLabel: 'Chất lượng', hieuSuatPct: null, daDuyet: false }
    return { ...r, tienDoPct: deXuatTienDo(r).diem, chatLuongPct: CHAT_LUONG_MAC_DINH, chatLuongLabel: 'Chất lượng', hieuSuatPct: null, daDuyet: false }
  })
}

// 'baosai' CỐ Ý không nằm trong TASK_TABS: đây là danh sách khâu ĐO HIỆU SUẤT theo buổi
// (đúng hạn/chậm). Duyệt báo sai là hàng đợi phát sinh, không gắn buổi, không có "phải làm
// mỗi buổi" ⇒ đưa vào đây là đẻ mẫu số giả (buổi nào không có báo sai cũng bị tính thiếu).
export const TASK_TABS: TabKey[] = ['danhgia', 'ingame', 'et', 'btvn', 'mt']
export const TASK_TAB_LABEL: Record<TabKey, string> = { diemdanh: 'Điểm danh', danhgia: 'Đánh giá sau buổi', ingame: 'Chấm bài trên lớp', et: 'Chấm ET', btvn: 'Chấm BTVN', mt: 'Chấm MT', baosai: 'Duyệt báo sai' }

// Hiệu suất KHÔNG PHẢI trung bình cộng — Tiến độ là LÕI PHẠT: Đúng hạn=0 phạt, Chậm 1/2/3 = trừ
// 10/20/30% (đúng khớp 100−tienDo vì TIEN_DO_TIERS đã là 100/90/80/70). Hiệu suất = Chất lượng −
// phạt tiến độ (Thùy chốt): vd Chậm 3 (tienDo=70, phạt 30) + Chất lượng 90 → 90−30 = 60%.
export function tinhHieuSuat(tienDoPct: number, chatLuongPct: number): number {
  const phat = 100 - tienDoPct
  return Math.max(0, Math.round(chatLuongPct - phat))
}
// Hiệu suất: CHÍNH THỨC (đã duyệt) → số snapshot lúc chốt. DỰ KIẾN (chưa duyệt) → tính theo công
// thức trên với tiến độ đề xuất + chất lượng mặc định 100% — CHỈ để xem-trước, đổi ngay khi leader
// duyệt (kể cả giữ 100% thì cũng chuyển thành "chính thức", KHÁC "dự kiến" tuy trùng số). Gọi kèm
// `t.daDuyet` khi hiển thị để phân biệt 2 trạng thái — đừng in trần con số.
export function hieuSuatOf(t: TaskDetail): number | null {
  if (t.daDuyet) return t.hieuSuatPct
  return t.tienDoPct != null && t.chatLuongPct != null ? tinhHieuSuat(t.tienDoPct, t.chatLuongPct) : null
}

// ── Profile gọn cho header "Theo người" (khác getMyProfile — cho phép xem của NGƯỜI KHÁC, không chỉ mình).
export type NsProfileMini = { id: string; ho_ten: string; ma_ns: string | null; anh_url: string | null }
export async function getNsProfileMini(nsId: string): Promise<NsProfileMini | null> {
  const { data, error } = await supabase.from('nhan_su').select('id, ho_ten, ma_ns, anh_url').eq('id', nsId).single()
  if (error) return null
  return data as NsProfileMini
}

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
// Tiến độ SỐNG cho task CHƯA XONG — giả định "nếu hoàn thành NGAY BÂY GIỜ" thì rơi vào tier nào,
// so hiện tại với deadline (cùng ngưỡng CHAM_NGUONG_GIO). Số này TỤT DẦN theo thời gian trôi qua
// nếu vẫn chưa làm — khác "đề xuất" tĩnh của deXuatTienDo (đã có doneAt cố định).
export function tienDoNeuXongBayGio(r: StaffTaskRow): number {
  if (r.deadline == null) return TIEN_DO_TIERS[0].diem
  const treGio = (Date.now() - r.deadline) / 3600000
  if (treGio <= 0) return TIEN_DO_TIERS[0].diem
  return treGio <= CHAM_NGUONG_GIO.cap1 ? TIEN_DO_TIERS[1].diem : treGio <= CHAM_NGUONG_GIO.cap2 ? TIEN_DO_TIERS[2].diem : TIEN_DO_TIERS[3].diem
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
  const hieuSuat = tinhHieuSuat(p.tienDo, p.chatLuong)
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
      tien_do: diem, tien_do_de_xuat: diem, chat_luong: chatLuong, hieu_suat: tinhHieuSuat(diem, chatLuong),
      nguoi_duyet: prof.nhanSu.id, duyet_at: new Date().toISOString(),
    }
  })
  const { error } = await supabase.from('viec_van_hanh_duyet').upsert(payload, { onConflict: 'buoi_hoc_id,tab,nhan_su_id' })
  if (error) throw error
}
