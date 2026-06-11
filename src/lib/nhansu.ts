// Data-layer khối STATIC: nhân sự · team · lớp · phân công · học sinh · TKB.
// UI KHÔNG gọi supabase trực tiếp — chỉ qua file này (seam, giống lib/kho/api.ts).
import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

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
export type ViTri = { id: string; team_id: string; ten: string | null; cap: 'truong' | 'pho' | 'thanh_vien'; cha_id: string | null; nhan_su_id: string | null }
export type MucNangLuc = { id: string; ma: string; bac: string; muc: number; thu_tu: number; ten: string | null }
export type Lop = { id: string; ten_lop: string; mon: string; khoi: number | null; bac: string | null; co_so: string | null; trang_thai: 'dang_hoc' | 'dong'; created_at?: string }
export type PhanCongLop = { id: string; nhan_su_id: string; lop_id: string; vai_tro: 'gv' | 'tg'; la_chinh: boolean }
export type HocSinh = { id: string; ma_hs: string | null; ho_ten: string; ngay_sinh: string | null; gioi_tinh: 'nam' | 'nu' | null; khoi: number | null; trang_thai: 'dang_hoc' | 'bao_luu' | 'nghi'; phu_huynh_id: string | null; diem_test_dau_vao: number | null; ngay_nhap_hoc: string | null; dia_chi: string | null; truong_hoc: string | null; anh_url: string | null; created_at?: string }
export type PhuHuynh = { id: string; ma_ph: string; ho_ten: string; so_dien_thoai: string | null; email: string | null; dia_chi: string | null; created_at?: string }
export type HocSinhLop = { id: string; hoc_sinh_id: string; lop_id: string; muc_nang_luc_id: string | null; ngay_vao: string | null; trang_thai: 'dang_hoc' | 'da_roi' }
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

// Đề xuất mã kế tiếp = max hiện có +1 (NS001/HS0001…). Chỉ là GỢI Ý hiện sẵn trong form — user sửa được.
async function suggestNextMa(table: string, col: string, prefix: string, pad: number): Promise<string> {
  const { data, error } = await supabase.from(table).select(col).like(col, `${prefix}%`).order(col, { ascending: false }).limit(1)
  if (error) throw error
  const last = (data?.[0] as unknown as Record<string, string> | undefined)?.[col]
  const n = last ? parseInt(last.slice(prefix.length), 10) + 1 : 1
  return prefix + String(isNaN(n) ? 1 : n).padStart(pad, '0')
}
export const suggestMaNS = () => suggestNextMa('nhan_su', 'ma_ns', 'NS', 3)
export const suggestMaHS = () => suggestNextMa('hoc_sinh', 'ma_hs', 'HS', 4)

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
  const [nsRes, teamAll, teamMap, vtRes, pcRes] = await Promise.all([
    supabase.from('nhan_su').select('*').eq('id', nsId).single(),
    listTeam(), listNhanSuTeamMap(),
    supabase.from('vi_tri').select('*').eq('nhan_su_id', nsId).limit(LIMIT),
    supabase.from('phan_cong_lop').select('*, lop(*)').eq('nhan_su_id', nsId).limit(LIMIT),
  ])
  if (nsRes.error) throw nsRes.error
  const tmById = new Map(teamAll.map((t) => [t.id, t]))
  return {
    nhanSu: nsRes.data as NhanSu,
    teams: (teamMap[nsId] ?? []).map((tid) => tmById.get(tid)).filter(Boolean) as Team[],
    viTris: ((vtRes.data ?? []) as ViTri[]).map((v) => ({ ...v, team_ten: tmById.get(v.team_id)?.ten ?? '?' })),
    phanCong: (pcRes.data ?? []) as (PhanCongLop & { lop?: Lop })[],
  }
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
export async function updateViTri(id: string, patch: Partial<Pick<ViTri, 'ten' | 'cap' | 'cha_id' | 'nhan_su_id'>>): Promise<void> {
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
  if (khoi) q = q.eq('khoi', Number(khoi))
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
export async function removePhanCong(id: string): Promise<void> {
  const { error } = await supabase.from('phan_cong_lop').delete().eq('id', id)
  if (error) throw error
}

// ── Học sinh ──────────────────────────────────────────────────────
export async function listHocSinh(khoi?: string): Promise<HocSinh[]> {
  let q = supabase.from('hoc_sinh').select('*').order('ho_ten').limit(LIMIT)
  if (khoi) q = q.eq('khoi', Number(khoi))
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as HocSinh[]
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
export async function ghiDanh(hocSinhId: string, lopId: string, mucNangLucId: string | null = null): Promise<void> {
  // upsert idempotent: ghi danh lại lớp cũ (đã rời) → bật lại 'dang_hoc'.
  const { error } = await supabase.from('hoc_sinh_lop')
    .upsert({ hoc_sinh_id: hocSinhId, lop_id: lopId, muc_nang_luc_id: mucNangLucId, trang_thai: 'dang_hoc' }, { onConflict: 'hoc_sinh_id,lop_id' })
  if (error) throw error
}
// Rời lớp = đánh dấu da_roi (GIỮ dòng — lịch sử), KHÔNG xoá cứng.
export async function roiLop(ghiDanhId: string): Promise<void> {
  const { error } = await supabase.from('hoc_sinh_lop').update({ trang_thai: 'da_roi' }).eq('id', ghiDanhId)
  if (error) throw error
}
export async function setBandGhiDanh(ghiDanhId: string, mucNangLucId: string | null): Promise<void> {
  const { error } = await supabase.from('hoc_sinh_lop').update({ muc_nang_luc_id: mucNangLucId }).eq('id', ghiDanhId)
  if (error) throw error
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
// Bỏ 1 slot = ĐÓNG hiệu lực (không xoá — giữ vết để suy buổi quá khứ đúng).
export async function dongTKB(id: string, ngayDong: string): Promise<void> {
  const { error } = await supabase.from('thoi_khoa_bieu').update({ hieu_luc_den: ngayDong }).eq('id', id)
  if (error) throw error
}
