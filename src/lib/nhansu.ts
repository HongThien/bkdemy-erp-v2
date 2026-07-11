// Data-layer khối STATIC: nhân sự · team · lớp · phân công · học sinh · TKB.
// UI KHÔNG gọi supabase trực tiếp — chỉ qua file này (seam, giống lib/kho/api.ts).
import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { reopenPhase, moLaiDanhGia } from './gami'

const LIMIT = 10000

// ── Types ─────────────────────────────────────────────────────────
export type NhanSu = { id: string; ma_ns?: string; ho_ten: string; so_dien_thoai: string | null; email: string | null; anh_url: string | null; trang_thai: 'dang_lam' | 'nghi'; ngay_vao_lam: string | null; created_at?: string }

// Ảnh đại diện → bucket public 'avatars' (tạo qua Dashboard, migration 0020). DB lưu URL.
export async function uploadAvatar(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('avatars').upload(path, file, { contentType: file.type || 'image/png', upsert: false })
  if (error) throw error
  return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
}
export type Team = { id: string; ma: string; ten: string; thu_tu: number }
// GHẾ (vị trí) — xương sống tổ chức. Cây = cha_id giữa GHẾ; người chỉ là kẻ ngồi (nhan_su_id null = ghế trống).
export type ViTri = { id: string; team_id: string; ten: string | null; cap: 'truong' | 'pho' | 'thanh_vien'; cha_id: string | null; nhan_su_id: string | null; vai_tro_id?: string | null; mon?: string | null }
export type MucNangLuc = { id: string; ma: string; bac: string; muc: number; thu_tu: number; ten: string | null }
export type Lop = { id: string; ten_lop: string; mon: string; khoi: string | null; bac: string | null; co_so: string | null; ngay_khai_giang: string | null; trang_thai: 'dang_hoc' | 'dong'; created_at?: string; muc_hoc_phi_id?: string | null; muc_hoc_lieu_id?: string | null }
export type PhanCongLop = { id: string; nhan_su_id: string; lop_id: string; vai_tro: 'gv' | 'tg'; la_chinh: boolean }
export type HocSinh = { id: string; ma_hs: string | null; ho_ten: string; ngay_sinh: string | null; gioi_tinh: 'nam' | 'nu' | null; khoi: string | null; trang_thai: 'dang_hoc' | 'bao_luu' | 'nghi'; phu_huynh_id: string | null; diem_test_dau_vao: number | null; ngay_nhap_hoc: string | null; dia_chi: string | null; truong_hoc: string | null; anh_url: string | null; created_at?: string }
export type PhuHuynh = { id: string; ma_ph: string; ho_ten: string; so_dien_thoai: string | null; email: string | null; dia_chi: string | null; created_at?: string }
export type HocSinhLop = { id: string; hoc_sinh_id: string; lop_id: string; muc_nang_luc_id: string | null; ngay_vao: string | null; ngay_roi: string | null; trang_thai: 'dang_hoc' | 'da_roi' }
// Ngày hôm nay giờ VN (CLAUDE.md §2 — không toISOString)
export const todayVN = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
export type ThoiKhoaBieu = { id: string; lop_id: string; thu: number; gio_bat_dau: string; gio_ket_thuc: string; phong: string | null; hieu_luc_tu: string; hieu_luc_den: string | null }

// ── Danh mục seed (đọc 1 lần) ─────────────────────────────────────
export async function listTeam(): Promise<Team[]> {
  const { data, error } = await supabase.from('team').select('*').order('thu_tu').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as Team[]
}
export async function listMucNangLuc(): Promise<MucNangLuc[]> {
  const { data, error } = await supabase.from('muc_nang_luc').select('*').order('thu_tu', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as MucNangLuc[]
}

// Đề xuất mã kế tiếp = max phần SỐ + 1 (NS001/HS0001…). Chỉ là GỢI Ý — user sửa được.
// Parse phần SỐ của MỌI mã (chịu được format lẫn PH347 vs PH0001) trên TOÀN BỘ dòng (kể cả đã nghỉ)
// → KHÔNG bao giờ tái dùng số. (Trước đây sort theo CHUỖI → sai max khi mã không cùng độ dài.)
async function suggestNextMa(table: string, col: string, prefix: string, pad: number): Promise<string> {
  const { data, error } = await supabase.from(table).select(col).not(col, 'is', null).limit(LIMIT)
  if (error) throw error
  let max = 0
  for (const r of (data ?? []) as any[]) {
    const m = String(r[col] ?? '').match(/\d+/)
    if (m) { const n = parseInt(m[0], 10); if (n > max) max = n }
  }
  return prefix + String(max + 1).padStart(pad, '0')
}
export const suggestMaNS = () => suggestNextMa('nhan_su', 'ma_ns', 'NS', 3)
export const suggestMaHS = () => suggestNextMa('hoc_sinh', 'ma_hs', 'HS', 4)
export const suggestMaPH = () => suggestNextMa('phu_huynh', 'ma_ph', 'PH', 4)

// ── Nhân sự ───────────────────────────────────────────────────────
export async function listNhanSu(): Promise<NhanSu[]> {
  const { data, error } = await supabase.from('nhan_su').select('*').order('ho_ten').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as NhanSu[]
}
export async function createNhanSu(p: Partial<NhanSu> & { ho_ten: string }): Promise<NhanSu> {
  const { data, error } = await supabase.from('nhan_su').insert(p).select().single()
  if (error) throw error
  return data as NhanSu
}
export async function updateNhanSu(id: string, patch: Partial<NhanSu>): Promise<void> {
  const { error } = await supabase.from('nhan_su').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteNhanSu(id: string): Promise<void> {
  const { error } = await supabase.from('nhan_su').delete().eq('id', id)
  if (error) throw error
}

// ── Cấp tài khoản NGAY TRÊN WEB (admin bấm, khỏi vào Dashboard) ───
// Dùng CLIENT PHỤ (không persist session) để signUp → session admin đang đăng nhập KHÔNG bị đá.
// ⚠ Cần Dashboard tắt "Confirm email" 1 lần (Authentication → Sign In/Up), không thì tài khoản
// mới phải bấm link trong mail mới đăng nhập được.
export async function capTaiKhoan(nhanSuId: string, email: string, password: string): Promise<void> {
  const url = import.meta.env.VITE_SUPABASE_URL as string
  const key = import.meta.env.VITE_SUPABASE_KEY as string
  const tmp = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await tmp.auth.signUp({ email, password })
  if (error) throw new Error(error.message.includes('already registered')
    ? 'Email này ĐÃ có tài khoản — người đó chỉ cần đăng nhập, app tự link theo email trùng.'
    : error.message)
  const uid = data.user?.id
  if (!uid) throw new Error('Không lấy được id tài khoản mới (email có thể đã tồn tại).')
  // link tài khoản ↔ nhân sự luôn (ghi bằng client CHÍNH của admin)
  const { error: e2 } = await supabase.from('tai_khoan').upsert({ id: uid, nhan_su_id: nhanSuId, email }, { onConflict: 'id' })
  if (e2) throw e2
}
// Gỡ link tài khoản ↔ nhân sự (vd đã xóa user bên Auth Dashboard → dọn dòng nối mồ côi).
export async function goTaiKhoan(nhanSuId: string): Promise<void> {
  const { error } = await supabase.from('tai_khoan').delete().eq('nhan_su_id', nhanSuId)
  if (error) throw error
}
// Map nhan_su_id → email tài khoản (để bảng Nhân sự hiện ai có TK rồi).
export async function listTaiKhoanMap(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('tai_khoan').select('nhan_su_id,email').limit(LIMIT)
  if (error) throw error
  const map: Record<string, string> = {}
  for (const r of (data ?? []) as { nhan_su_id: string | null; email: string | null }[]) if (r.nhan_su_id) map[r.nhan_su_id] = r.email ?? ''
  return map
}

// ── Hồ sơ CỦA TÔI (tài khoản nhân sự — Thùy chốt 06-11) ──────────
// Link tài khoản: admin tạo user Auth (Dashboard) TRÙNG email nhân sự → lần đăng nhập đầu app TỰ LINK
// (ghi tai_khoan id=auth.uid → nhan_su). NS tự sửa được ảnh/SĐT/email; team/vị trí/phân công CHỈ XEM.
export type MyProfile = {
  nhanSu: NhanSu
  teams: Team[]                                   // biên chế (chỉ xem)
  viTris: (ViTri & { team_ten: string })[]        // vị trí đang giữ (chỉ xem)
  phanCong: (PhanCongLop & { lop?: Lop })[]       // phân công lớp (chỉ xem)
  mons: string[]                                  // môn được phân (scope④ — gate kho/tài liệu theo môn)
}
export async function getMyProfile(): Promise<MyProfile | null> {
  const { data: au } = await supabase.auth.getUser()
  const u = au?.user
  if (!u) return null
  // 1) đã link chưa?
  const { data: tk, error: eTk } = await supabase.from('tai_khoan').select('*').eq('id', u.id).maybeSingle()
  if (eTk) throw eTk
  let nsId: string | null = (tk as { nhan_su_id: string | null } | null)?.nhan_su_id ?? null
  // 2) chưa link → tự link theo email trùng (0 hoặc ≥2 kết quả thì KHÔNG tự quyết — thà bỏ trống còn hơn gán sai)
  if (!nsId && u.email) {
    const { data: cands, error } = await supabase.from('nhan_su').select('id').ilike('email', u.email).limit(2)
    if (error) throw error
    if (cands?.length === 1) {
      nsId = (cands[0] as { id: string }).id
      const { error: eUp } = await supabase.from('tai_khoan').upsert({ id: u.id, nhan_su_id: nsId, email: u.email }, { onConflict: 'id' })
      if (eUp) throw eUp
    }
  }
  if (!nsId) return null
  const [nsRes, teamAll, teamMap, vtRes, pcRes, monRows] = await Promise.all([
    supabase.from('nhan_su').select('*').eq('id', nsId).single(),
    listTeam(), listNhanSuTeamMap(),
    supabase.from('vi_tri').select('*').eq('nhan_su_id', nsId).limit(LIMIT),
    supabase.from('phan_cong_lop').select('*, lop(*)').eq('nhan_su_id', nsId).limit(LIMIT),
    listMonOfNhanSu(nsId),
  ])
  if (nsRes.error) throw nsRes.error
  const tmById = new Map(teamAll.map((t) => [t.id, t]))
  return {
    nhanSu: nsRes.data as NhanSu,
    teams: (teamMap[nsId] ?? []).map((tid) => tmById.get(tid)).filter(Boolean) as Team[],
    viTris: ((vtRes.data ?? []) as ViTri[]).map((v) => ({ ...v, team_ten: tmById.get(v.team_id)?.ten ?? '?' })),
    phanCong: (pcRes.data ?? []) as (PhanCongLop & { lop?: Lop })[],
    mons: monRows,
  }
}
// ── SCOPE ENGINE — "ai thấy task nào" (Thùy chốt 12/06) ──────────
// Gốc rễ RBAC (ABAC): task mang nhãn (loại việc × lớp); người thấy task nếu khớp 3 chiều:
//   ① LOẠI việc = từ phan_cong_lop.vai_tro (gv→đánh giá, tg→chấm) + team ops→điểm danh/xếp bù.
//   ② PHẠM VI  = đúng lớp được phân (GV/TA); OPS = toàn hệ (phase này).
//   ③ VAI TRÒ  = OWNER (việc của tôi) vs GIÁM SÁT (việc người DƯỚI tôi trong cây vị trí — đệ quy cha_id).
// Task pure-derive (chưa có bảng) sẽ LỌC qua scope này khi dựng lớp vận hành (điểm danh/ET…).
export type WorkRole = 'gv' | 'tg' | 'ops'
export const WORKTYPE_BY_ROLE: Record<WorkRole, { key: string; ten: string }[]> = {
  gv: [{ key: 'danh_gia', ten: 'Đánh giá buổi' }, { key: 'noi_dung', ten: 'Nội dung buổi' }],
  tg: [{ key: 'cham_et', ten: 'Chấm ET' }, { key: 'cham_btvn', ten: 'Chấm BTVN' }],
  ops: [{ key: 'diem_danh', ten: 'Điểm danh' }, { key: 'xep_bu', ten: 'Xếp bù' }],
}
export type ScopeLop = { lop_id: string; ten_lop: string; mon: string; work_role: WorkRole; worktypes: { key: string; ten: string }[] }
export type ScopeNguoiDuoi = { nhan_su_id: string; ho_ten: string; ma_ns?: string; lops: { ten_lop: string; work_role: WorkRole }[] }
export type MyScope = {
  nhanSu: NhanSu
  trucTiep: ScopeLop[]      // ① OWNER — việc tôi đích thân làm (từ phân công lớp; GV "đến dạy rồi về" cũng chỉ có cái này)
  opsToanHe: boolean        // thuộc team OPS → worktype OPS áp MỌI lớp
  // ② GIÁM SÁT (span-of-control): quyền QL từ GHẾ trong cây vị trí, KHÔNG từ vai GV.
  giamSatTrucTiep: ScopeNguoiDuoi[] // cấp dưới TRỰC TIẾP — view MẶC ĐỊNH (mỗi người gánh tình trạng nhánh dưới họ)
  giamSatSau: ScopeNguoiDuoi[]      // cấp dưới của cấp dưới — PASSIVE, drill khi cần
  laQuanLy: boolean
}
export async function getMyScope(): Promise<MyScope | null> {
  const prof = await getMyProfile()
  if (!prof) return null
  const nsId = prof.nhanSu.id

  // ① + ② trực tiếp = phân công lớp của tôi (vai GV/TG = loại việc)
  const trucTiep: ScopeLop[] = prof.phanCong.map((pc) => {
    const role: WorkRole = pc.vai_tro === 'gv' ? 'gv' : 'tg'
    return { lop_id: pc.lop_id, ten_lop: pc.lop?.ten_lop ?? '?', mon: pc.lop?.mon ?? '', work_role: role, worktypes: WORKTYPE_BY_ROLE[role] }
  })
  const opsToanHe = prof.teams.some((t) => t.ma === 'ops')

  // ② giám sát = người DƯỚI tôi trong cây vị trí (mọi team tôi có vị trí), TÍNH ĐỘ SÂU.
  // Quyền QL đến từ GHẾ (Trưởng/Phó), KHÔNG từ vai GV — GV thường quản lý ZERO người.
  // GV xem được data lớp mình = trục B (data-scope, dashboard), KHÔNG nằm ở task-scope này.
  const depthByNs = new Map<string, number>() // nhan_su_id → độ sâu NHỎ NHẤT dưới tôi (1 = trực tiếp)
  for (const vt of prof.viTris) {
    const all = await listViTri(vt.team_id)
    const childrenOf = (id: string) => all.filter((x) => x.cha_id === id)
    const seenSeat = new Set<string>()
    let frontier = childrenOf(vt.id), depth = 1
    while (frontier.length) {
      const next: ViTri[] = []
      for (const cur of frontier) {
        if (seenSeat.has(cur.id)) continue
        seenSeat.add(cur.id)
        if (cur.nhan_su_id && cur.nhan_su_id !== nsId) {
          const prev = depthByNs.get(cur.nhan_su_id)
          if (prev === undefined || depth < prev) depthByNs.set(cur.nhan_su_id, depth)
        }
        next.push(...childrenOf(cur.id))
      }
      frontier = next; depth++
    }
  }
  const giamSatTrucTiep: ScopeNguoiDuoi[] = [], giamSatSau: ScopeNguoiDuoi[] = []
  if (depthByNs.size) {
    const ids = [...depthByNs.keys()]
    const [nsRows, pcRows] = await Promise.all([
      supabase.from('nhan_su').select('id, ho_ten, ma_ns').in('id', ids).limit(LIMIT),
      supabase.from('phan_cong_lop').select('nhan_su_id, vai_tro, lop(ten_lop)').in('nhan_su_id', ids).limit(LIMIT),
    ])
    const nsMap = new Map(((nsRows.data ?? []) as any[]).map((r) => [r.id, r]))
    const pcByNs = new Map<string, { ten_lop: string; work_role: WorkRole }[]>()
    for (const r of (pcRows.data ?? []) as any[]) {
      const arr = pcByNs.get(r.nhan_su_id) ?? []
      arr.push({ ten_lop: r.lop?.ten_lop ?? '?', work_role: r.vai_tro === 'gv' ? 'gv' : 'tg' })
      pcByNs.set(r.nhan_su_id, arr)
    }
    for (const id of ids) {
      const ns = nsMap.get(id)
      const row: ScopeNguoiDuoi = { nhan_su_id: id, ho_ten: ns?.ho_ten ?? '?', ma_ns: ns?.ma_ns, lops: pcByNs.get(id) ?? [] }
      ;(depthByNs.get(id) === 1 ? giamSatTrucTiep : giamSatSau).push(row)
    }
  }
  return { nhanSu: prof.nhanSu, trucTiep, opsToanHe, giamSatTrucTiep, giamSatSau, laQuanLy: depthByNs.size > 0 }
}

// NS chỉ được sửa 3 trường cá nhân — whitelist ngay tại seam, UI không lách được.
export async function updateMyProfile(nhanSuId: string, p: { so_dien_thoai?: string | null; email?: string | null; anh_url?: string | null }): Promise<void> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if ('so_dien_thoai' in p) patch.so_dien_thoai = p.so_dien_thoai
  if ('email' in p) patch.email = p.email
  if ('anh_url' in p) patch.anh_url = p.anh_url
  const { error } = await supabase.from('nhan_su').update(patch).eq('id', nhanSuId)
  if (error) throw error
}

// ── Biên chế team (n-n: 1 NS thuộc NHIỀU team — Thùy chốt 06-11) ──
// Map nhan_su_id → [team_id]. Đọc 1 phát cho cả màn (bảng + filter sơ đồ).
export async function listNhanSuTeamMap(): Promise<Record<string, string[]>> {
  const { data, error } = await supabase.from('nhan_su_team').select('*').limit(LIMIT)
  if (error) throw error
  const map: Record<string, string[]> = {}
  for (const r of (data ?? []) as { nhan_su_id: string; team_id: string }[]) (map[r.nhan_su_id] ??= []).push(r.team_id)
  return map
}
// Set trọn bộ team của 1 NS (delete + insert — bảng nối nhỏ, đơn giản là đủ).
export async function setTeamsOfNhanSu(nhanSuId: string, teamIds: string[]): Promise<void> {
  const { error: e1 } = await supabase.from('nhan_su_team').delete().eq('nhan_su_id', nhanSuId)
  if (e1) throw e1
  if (!teamIds.length) return
  const { error } = await supabase.from('nhan_su_team').insert(teamIds.map((t) => ({ nhan_su_id: nhanSuId, team_id: t })))
  if (error) throw error
}

// ── Chiều MÔN ở nhân sự (scope④ — mig 0056) ───────────────────────
// Môn vào NGƯỜI (n-n). STRICT: chưa gán → không thấy môn nào (admin la_admin bypass ở client).
export async function listNhanSuMonMap(): Promise<Record<string, string[]>> {
  const { data, error } = await supabase.from('nhan_su_mon').select('*').limit(LIMIT)
  if (error) throw error
  const map: Record<string, string[]> = {}
  for (const r of (data ?? []) as { nhan_su_id: string; mon: string }[]) (map[r.nhan_su_id] ??= []).push(r.mon)
  return map
}
export async function listMonOfNhanSu(nhanSuId: string): Promise<string[]> {
  const { data, error } = await supabase.from('nhan_su_mon').select('mon').eq('nhan_su_id', nhanSuId).limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => r.mon as string)
}
// Set trọn bộ môn của 1 NS (delete + insert — bảng nối nhỏ).
export async function setMonOfNhanSu(nhanSuId: string, mons: string[]): Promise<void> {
  const { error: e1 } = await supabase.from('nhan_su_mon').delete().eq('nhan_su_id', nhanSuId)
  if (e1) throw e1
  if (!mons.length) return
  const { error } = await supabase.from('nhan_su_mon').insert(mons.map((m) => ({ nhan_su_id: nhanSuId, mon: m })))
  if (error) throw error
}

// ── Ghế (vị trí) ──────────────────────────────────────────────────
export async function listViTri(teamId?: string): Promise<ViTri[]> {
  let q = supabase.from('vi_tri').select('*').order('created_at').limit(LIMIT)
  if (teamId) q = q.eq('team_id', teamId)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as ViTri[]
}
export async function createViTri(p: Partial<ViTri> & { team_id: string }): Promise<ViTri> {
  const { data, error } = await supabase.from('vi_tri').insert(p).select().single()
  if (error) throw error
  return data as ViTri
}
export async function updateViTri(id: string, patch: Partial<Pick<ViTri, 'ten' | 'cap' | 'cha_id' | 'nhan_su_id' | 'mon'>>): Promise<void> {
  const { error } = await supabase.from('vi_tri').update(patch).eq('id', id)
  if (error) throw error
}
// Xoá ghế: con của nó được nối lên ghế ông (không mồ côi cả nhánh).
export async function deleteViTri(id: string): Promise<void> {
  const { data, error: e0 } = await supabase.from('vi_tri').select('cha_id').eq('id', id).single()
  if (e0) throw e0
  const { error: e1 } = await supabase.from('vi_tri').update({ cha_id: (data as ViTri).cha_id }).eq('cha_id', id)
  if (e1) throw e1
  const { error } = await supabase.from('vi_tri').delete().eq('id', id)
  if (error) throw error
}

// ── Lớp ───────────────────────────────────────────────────────────
export async function listLop(khoi?: string): Promise<Lop[]> {
  let q = supabase.from('lop').select('*').order('ten_lop').limit(LIMIT)
  if (khoi) q = q.eq('khoi', khoi) // khoi là TEXT (4T/5T là khối riêng)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Lop[]
}
export async function createLop(p: Partial<Lop> & { ten_lop: string; mon: string }): Promise<Lop> {
  const { data, error } = await supabase.from('lop').insert(p).select().single()
  if (error) throw error
  return data as Lop
}
export async function updateLop(id: string, patch: Partial<Lop>): Promise<void> {
  const { error } = await supabase.from('lop').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteLop(id: string): Promise<void> {
  const { error } = await supabase.from('lop').delete().eq('id', id)
  if (error) throw error
}

// Thống kê per-lớp cho card (sĩ số · GV/TG · có TKB · band đủ chưa).
export type LopThongKe = { siSo: number; gvChinh?: string; gvPhu?: string; tg?: string; coTkb: boolean; bandDu: number }
export async function thongKeLop(lopIds: string[]): Promise<Record<string, LopThongKe>> {
  const out: Record<string, LopThongKe> = {}
  for (const id of lopIds) out[id] = { siSo: 0, coTkb: false, bandDu: 0 }
  if (!lopIds.length) return out
  const [pc, hs, tkb] = await Promise.all([
    supabase.from('phan_cong_lop').select('lop_id, vai_tro, la_chinh, nhan_su:nhan_su_id(ho_ten)').in('lop_id', lopIds).limit(LIMIT),
    supabase.from('hoc_sinh_lop').select('lop_id, muc_nang_luc_id').eq('trang_thai', 'dang_hoc').in('lop_id', lopIds).limit(LIMIT),
    supabase.from('thoi_khoa_bieu').select('lop_id').is('hieu_luc_den', null).in('lop_id', lopIds).limit(LIMIT),
  ])
  for (const r of (hs.data ?? []) as any[]) { const o = out[r.lop_id]; if (o) { o.siSo++; if (r.muc_nang_luc_id) o.bandDu++ } }
  for (const r of (pc.data ?? []) as any[]) { const o = out[r.lop_id]; if (!o) continue; const nm = r.nhan_su?.ho_ten; if (r.vai_tro === 'tg') o.tg = nm; else if (r.la_chinh) o.gvChinh = nm; else o.gvPhu = nm }
  for (const r of (tkb.data ?? []) as any[]) { if (out[r.lop_id]) out[r.lop_id].coTkb = true }
  return out
}

// ── Phân công GV/TA × lớp ─────────────────────────────────────────
export async function listPhanCongByLop(lopId: string): Promise<PhanCongLop[]> {
  const { data, error } = await supabase.from('phan_cong_lop').select('*').eq('lop_id', lopId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as PhanCongLop[]
}
export async function addPhanCong(p: Omit<PhanCongLop, 'id'>): Promise<void> {
  const { error } = await supabase.from('phan_cong_lop').insert(p)
  if (error) throw error
}
// Toàn bộ phân công (cho ma trận Phân công). Group client-side theo lớp.
export async function listPhanCongAll(): Promise<PhanCongLop[]> {
  const { data, error } = await supabase.from('phan_cong_lop').select('*').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as PhanCongLop[]
}
// Set 1 SLOT của lớp (gv_chinh: 1 GV chịu trách nhiệm · gv_phu: 1 GV phụ · tg: 1 TG ôm toàn bộ chấm).
// Xóa người cũ ở slot rồi gán mới. null = bỏ trống slot. Ghi vào phan_cong_lop (cùng seam với màn Lớp).
export async function setPhanCongSlot(lopId: string, slot: 'gv_chinh' | 'gv_phu' | 'tg', nhanSuId: string | null): Promise<void> {
  const vai: 'gv' | 'tg' = slot === 'tg' ? 'tg' : 'gv'
  let del = supabase.from('phan_cong_lop').delete().eq('lop_id', lopId).eq('vai_tro', vai)
  if (slot === 'gv_chinh') del = del.eq('la_chinh', true)
  else if (slot === 'gv_phu') del = del.eq('la_chinh', false)
  const { error: e1 } = await del   // tg: xóa hết TG của lớp (1 TG/lớp)
  if (e1) throw e1
  if (nhanSuId) {
    const { error } = await supabase.from('phan_cong_lop').insert({ nhan_su_id: nhanSuId, lop_id: lopId, vai_tro: vai, la_chinh: slot !== 'gv_phu' })
    if (error) throw error
  }
}
export async function removePhanCong(id: string): Promise<void> {
  const { error } = await supabase.from('phan_cong_lop').delete().eq('id', id)
  if (error) throw error
}

// ── Học sinh ──────────────────────────────────────────────────────
export async function listHocSinh(khoi?: string): Promise<HocSinh[]> {
  let q = supabase.from('hoc_sinh').select('*').order('ho_ten').limit(LIMIT)
  if (khoi) q = q.eq('khoi', khoi) // khoi là TEXT
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as HocSinh[]
}
// Đếm số lớp ĐANG HỌC của nhiều HS bằng 1 query (cho list — tránh N query khi xem "Tất cả khối").
export async function countLopActiveByHS(hocSinhIds: string[]): Promise<Record<string, number>> {
  if (!hocSinhIds.length) return {}
  const { data, error } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id').eq('trang_thai', 'dang_hoc').in('hoc_sinh_id', hocSinhIds).limit(LIMIT)
  if (error) throw error
  const c: Record<string, number> = {}
  for (const r of (data ?? []) as { hoc_sinh_id: string }[]) c[r.hoc_sinh_id] = (c[r.hoc_sinh_id] ?? 0) + 1
  return c
}
export async function createHocSinh(p: Partial<HocSinh> & { ho_ten: string }): Promise<HocSinh> {
  const { data, error } = await supabase.from('hoc_sinh').insert(p).select().single()
  if (error) throw error
  return data as HocSinh
}
export async function updateHocSinh(id: string, patch: Partial<HocSinh>): Promise<void> {
  const { error } = await supabase.from('hoc_sinh').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteHocSinh(id: string): Promise<void> {
  const { error } = await supabase.from('hoc_sinh').delete().eq('id', id)
  if (error) throw error
}

// ── Phụ huynh (1 PH ↔ nhiều con) ──────────────────────────────────
export async function listPhuHuynh(q?: string): Promise<PhuHuynh[]> {
  let query = supabase.from('phu_huynh').select('*').order('ho_ten').limit(LIMIT)
  if (q?.trim()) query = query.or(`ho_ten.ilike.%${q.trim()}%,ma_ph.ilike.%${q.trim()}%,so_dien_thoai.ilike.%${q.trim()}%`)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as PhuHuynh[]
}
export async function createPhuHuynh(p: Partial<PhuHuynh> & { ho_ten: string }): Promise<PhuHuynh> {
  const { data, error } = await supabase.from('phu_huynh').insert(p).select().single()
  if (error) throw error
  return data as PhuHuynh
}
export async function updatePhuHuynh(id: string, patch: Partial<PhuHuynh>): Promise<void> {
  const { error } = await supabase.from('phu_huynh').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
// Các con của 1 PH (cho thu học phí / tài khoản PH theo dõi).
export async function listConByPH(phuHuynhId: string): Promise<HocSinh[]> {
  const { data, error } = await supabase.from('hoc_sinh').select('*').eq('phu_huynh_id', phuHuynhId).order('ho_ten').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as HocSinh[]
}

// ── Ghi danh HS vào lớp (đa-lớp — chỗ V1 hay lỗi) ─────────────────
// 1 HS nhiều lớp = nhiều dòng. Filter theo lớp = join, không load-all-RAM.
export type GhiDanh = HocSinhLop & { lop?: Lop }
// Các lớp 1 HS đang/đã học (kèm thông tin lớp).
export async function listLopCuaHS(hocSinhId: string): Promise<GhiDanh[]> {
  const { data, error } = await supabase.from('hoc_sinh_lop').select('*, lop(*)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as GhiDanh[]
}
// Các HS của 1 lớp (kèm band). Chỉ HS đang học mặc định.
export type HSTrongLop = HocSinhLop & { hoc_sinh?: HocSinh }
export async function listHSCuaLop(lopId: string, gomDaRoi = false): Promise<HSTrongLop[]> {
  let q = supabase.from('hoc_sinh_lop').select('*, hoc_sinh(*)').eq('lop_id', lopId).limit(LIMIT)
  if (!gomDaRoi) q = q.eq('trang_thai', 'dang_hoc')
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as HSTrongLop[]
}
// Khi HS vào lớp: tự thêm vào roster MỌI buổi đã mở của lớp từ ngay_vao trở đi (mo + hoan_tat, bỏ huy) →
// HS thêm-sau-khi-mở-buổi vẫn vào luồng điểm danh NGAY (không cần mở lại buổi). Idempotent (bỏ buổi đã có HS).
// ⭐ 07-10 (Thùy): buổi đã ĐÓNG chấm/đánh giá mà giờ có HS mới → TỰ MỞ LẠI (ingame/mt/đánh giá) — xem
// ghi chú đầy đủ ở dongBoSiSo (gami.ts), 2 hàm này cùng chung 1 lỗ hổng (khoá theo phase, không phải roster).
async function syncHSVaoBuoiTuNgay(hocSinhId: string, lopId: string, tuNgay: string): Promise<void> {
  const { data: buois } = await supabase.from('buoi_hoc').select('id, ingame_dong_at, mt_dong_at, danh_gia_xong_at')
    .eq('lop_id', lopId).eq('loai', 'thuong').neq('trang_thai', 'huy').gte('ngay', tuNgay).limit(LIMIT)
  const all = (buois ?? []) as { id: string; ingame_dong_at: string | null; mt_dong_at: string | null; danh_gia_xong_at: string | null }[]
  const ids = all.map((b) => b.id)
  if (!ids.length) return
  const { data: co } = await supabase.from('buoi_hoc_hs').select('buoi_hoc_id').eq('hoc_sinh_id', hocSinhId).in('buoi_hoc_id', ids).limit(LIMIT)
  const have = new Set((co ?? []).map((r: any) => r.buoi_hoc_id))
  const moi = all.filter((b) => !have.has(b.id))
  if (!moi.length) return
  const { error } = await supabase.from('buoi_hoc_hs').insert(moi.map((b) => ({ buoi_hoc_id: b.id, hoc_sinh_id: hocSinhId })))
  if (error) throw error
  for (const b of moi) {
    if (b.ingame_dong_at) await reopenPhase(b.id, 'ingame')
    if (b.mt_dong_at) await reopenPhase(b.id, 'mt')
    if (b.danh_gia_xong_at) await moLaiDanhGia(b.id)
  }
}
export async function ghiDanh(hocSinhId: string, lopId: string, mucNangLucId: string | null = null, ngayVao?: string): Promise<void> {
  // upsert idempotent: ghi danh lại lớp cũ (đã rời) → bật lại 'dang_hoc' với ngày vào MỚI.
  // ngay_vao = cổng thời gian data học tập (BTVN/ET của HS chỉ tính từ ngày này). Trigger DB tự log.
  const ngay = ngayVao ?? todayVN()
  const { error } = await supabase.from('hoc_sinh_lop')
    .upsert({ hoc_sinh_id: hocSinhId, lop_id: lopId, muc_nang_luc_id: mucNangLucId, trang_thai: 'dang_hoc', ngay_vao: ngay, ngay_roi: null }, { onConflict: 'hoc_sinh_id,lop_id' })
  if (error) throw error
  await syncHSVaoBuoiTuNgay(hocSinhId, lopId, ngay) // HS vào luồng điểm danh ngay, khỏi mở lại buổi
  // Hệ số học phí: KHÔNG auto-ghi ở đây — gợi ý tính pure-derive lúc đọc bảng "Hệ số",
  // Nhân sự xác nhận mới ghi (§hocphi.ts, Thùy chốt 07-05).
}
// Rời lớp = đánh dấu da_roi + ngay_roi (GIỮ dòng — lịch sử), KHÔNG xoá cứng. Trigger DB tự log.
export async function roiLop(ghiDanhId: string, ngayRoi?: string): Promise<void> {
  const { error } = await supabase.from('hoc_sinh_lop').update({ trang_thai: 'da_roi', ngay_roi: ngayRoi ?? todayVN() }).eq('id', ghiDanhId)
  if (error) throw error
}
export async function setNgayVao(ghiDanhId: string, ngayVao: string): Promise<void> {
  const { data, error } = await supabase.from('hoc_sinh_lop').update({ ngay_vao: ngayVao }).eq('id', ghiDanhId).select('hoc_sinh_id, lop_id, trang_thai').single()
  if (error) throw error
  if (data && (data as any).trang_thai === 'dang_hoc') await syncHSVaoBuoiTuNgay((data as any).hoc_sinh_id, (data as any).lop_id, ngayVao)
}
// CHUYỂN LỚP: rời lớp cũ (ngay_roi) + vào lớp mới (ngay_vao) — 2 sự kiện đều được trigger log.
export async function chuyenLop(ghiDanhCuId: string, hocSinhId: string, lopMoiId: string, giuBandId: string | null, ngay?: string): Promise<void> {
  const d = ngay ?? todayVN()
  await roiLop(ghiDanhCuId, d)
  await ghiDanh(hocSinhId, lopMoiId, giuBandId, d)
}
// HS đang học (khối tùy chọn) CHƯA có lớp môn này — nguồn hợp lệ duy nhất cho "thêm HS vào lớp".
// (HS đã có lớp môn đó phải đi đường CHUYỂN LỚP từ hồ sơ HS — không add chồng.)
export async function listHSChuaCoLopMon(mon: string, khoi?: string): Promise<HocSinh[]> {
  const [hs, ghiDanhMon] = await Promise.all([
    listHocSinh(khoi),
    supabase.from('hoc_sinh_lop').select('hoc_sinh_id, lop!inner(mon)').eq('trang_thai', 'dang_hoc').eq('lop.mon', mon).limit(LIMIT),
  ])
  if (ghiDanhMon.error) throw ghiDanhMon.error
  const daCo = new Set((ghiDanhMon.data ?? []).map((r: any) => r.hoc_sinh_id))
  return hs.filter((h) => h.trang_thai === 'dang_hoc' && !daCo.has(h.id))
}
export async function setBandGhiDanh(ghiDanhId: string, mucNangLucId: string | null): Promise<void> {
  const { error } = await supabase.from('hoc_sinh_lop').update({ muc_nang_luc_id: mucNangLucId }).eq('id', ghiDanhId)
  if (error) throw error
}

// Toàn bộ slot đang hiệu lực + thông tin lớp (cho bảng TKB tuần).
export type TKBSlot = ThoiKhoaBieu & { lop?: Lop }
export async function listAllTKB(): Promise<TKBSlot[]> {
  const { data, error } = await supabase.from('thoi_khoa_bieu').select('*, lop(*)').is('hieu_luc_den', null).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as TKBSlot[]
}

// ── Thời khóa biểu (khung lặp, hiệu-lực-theo-thời-gian) ───────────
// Mặc định chỉ slot CÒN hiệu lực (hieu_luc_den null).
export async function listTKB(lopId: string, gomHetHan = false): Promise<ThoiKhoaBieu[]> {
  let q = supabase.from('thoi_khoa_bieu').select('*').eq('lop_id', lopId).order('thu').limit(LIMIT)
  if (!gomHetHan) q = q.is('hieu_luc_den', null)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as ThoiKhoaBieu[]
}
export async function addTKB(p: Omit<ThoiKhoaBieu, 'id'>): Promise<void> {
  const { error } = await supabase.from('thoi_khoa_bieu').insert(p)
  if (error) throw error
}
// Chỉnh hiệu lực slot (hieu_luc_tu = ngày khai giảng / bắt đầu áp; hieu_luc_den = ngừng).
export async function suaHieuLucTKB(id: string, patch: { hieu_luc_tu?: string; hieu_luc_den?: string | null }): Promise<void> {
  const { error } = await supabase.from('thoi_khoa_bieu').update(patch).eq('id', id)
  if (error) throw error
}
// Bỏ 1 slot = ĐÓNG hiệu lực (không xoá — giữ vết để suy buổi quá khứ đúng).
export async function dongTKB(id: string, ngayDong: string): Promise<void> {
  const { error } = await supabase.from('thoi_khoa_bieu').update({ hieu_luc_den: ngayDong }).eq('id', id)
  if (error) throw error
}
