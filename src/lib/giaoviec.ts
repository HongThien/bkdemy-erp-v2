// ============================================================================
// giaoviec.ts — DATA-LAYER Giao việc & đo hiệu suất phát triển.
// Spec: BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md. SCOPE v1 (chốt 07-05, thu hẹp — xem
// DEVLOG): chỉ đo việc PHÁT TRIỂN (giao→làm→nghiệm thu+bằng chứng→%). Lương/cấp
// bậc/skill/vận hành-nối-ống HOÃN (chưa có lương nhân sự trong ERP để hoà vào).
// Hiệu suất kỳ KHÔNG lưu bảng riêng — pure-derive từ `viec` lúc đọc (§1 CLAUDE.md).
// ============================================================================
import { supabase } from './supabase'
import { getMyScope } from './nhansu'

const LIMIT = 2000

export type PhuongThucCham = 'frontline' | 'phat_trien'
export type MucKhoiLuong = { ma: string; ten: string; kl: number }
export type LoaiViec = {
  id: string
  ten: string
  phuong_thuc_cham: PhuongThucCham
  task_nho: boolean
  thang_kl: MucKhoiLuong[]
  active: boolean
  created_at?: string
}
export type TrangThaiViec = 'giao' | 'dang_lam' | 'cho_nghiem_thu' | 'dat' | 'tra_lai'
export type Viec = {
  id: string
  loai_viec_id: string
  tieu_de: string
  mo_ta: string | null
  nguoi_giao: string
  khoi_luong: number
  trang_thai: TrangThaiViec
  tien_do: number | null
  chat_luong: number | null
  phan_tram: number | null
  bang_chung: string | null
  ky_tinh: string | null
  han_nghiem_thu: string | null
  created_at?: string
  hoan_thanh_at: string | null
  nghiem_thu_at: string | null
  ghi_chu_nghiem_thu: string | null
}
export type ViecFull = Viec & {
  loai_viec?: LoaiViec
  nguoi_giao_ten?: string
  nguoi_lam: { nhan_su_id: string; ho_ten: string }[]
}

// ── LOẠI VIỆC (registry, cấu hình) ───────────────────────────────────────────
export async function listLoaiViec(activeOnly = true): Promise<LoaiViec[]> {
  let q = supabase.from('loai_viec').select('*').order('ten').limit(LIMIT)
  if (activeOnly) q = q.eq('active', true)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as LoaiViec[]
}
export async function createLoaiViec(p: { ten: string; phuong_thuc_cham: PhuongThucCham; task_nho?: boolean; thang_kl: MucKhoiLuong[] }): Promise<LoaiViec> {
  const { data, error } = await supabase.from('loai_viec').insert({ ...p, task_nho: p.task_nho ?? false }).select().single()
  if (error) throw error
  return data as LoaiViec
}
export async function updateLoaiViec(id: string, patch: Partial<Pick<LoaiViec, 'ten' | 'phuong_thuc_cham' | 'task_nho' | 'thang_kl' | 'active'>>): Promise<void> {
  const { error } = await supabase.from('loai_viec').update(patch).eq('id', id)
  if (error) throw error
}

// ── AI GIAO ĐƯỢC CHO AI — tái dùng span-of-control đã có (getMyScope), KHÔNG
//    dựng lại RBAC riêng (spec §3: cây vị trí, đa-mũ tự hợp qua giamSatTrucTiep/Sau) ──
export type NguoiDuocGiao = { nhan_su_id: string; ho_ten: string; ma_ns?: string }
export async function listNguoiDuocGiao(): Promise<NguoiDuocGiao[]> {
  const scope = await getMyScope()
  if (!scope) return []
  const seen = new Map<string, NguoiDuocGiao>()
  seen.set(scope.nhanSu.id, { nhan_su_id: scope.nhanSu.id, ho_ten: scope.nhanSu.ho_ten + ' (tôi)', ma_ns: (scope.nhanSu as any).ma_ns })
  for (const r of [...scope.giamSatTrucTiep, ...scope.giamSatSau]) {
    if (!seen.has(r.nhan_su_id)) seen.set(r.nhan_su_id, { nhan_su_id: r.nhan_su_id, ho_ten: r.ho_ten, ma_ns: r.ma_ns })
  }
  return [...seen.values()]
}

// ── GIAO VIỆC ────────────────────────────────────────────────────────────────
export async function createViec(p: {
  loai_viec_id: string; tieu_de: string; mo_ta?: string; nguoi_lam_ids: string[]; khoi_luong: number; han_nghiem_thu?: string | null
}): Promise<Viec> {
  if (!p.nguoi_lam_ids.length) throw new Error('Cần giao cho ít nhất 1 người')
  const { data: userRes } = await supabase.auth.getUser()
  const { data: taikhoan } = await supabase.from('tai_khoan').select('nhan_su_id').eq('id', userRes.user?.id ?? '').maybeSingle()
  const nguoiGiao = taikhoan?.nhan_su_id
  if (!nguoiGiao) throw new Error('Không xác định được người giao (tài khoản chưa link nhân sự)')
  const { data: viec, error } = await supabase.from('viec').insert({
    loai_viec_id: p.loai_viec_id, tieu_de: p.tieu_de, mo_ta: p.mo_ta ?? null,
    nguoi_giao: nguoiGiao, khoi_luong: p.khoi_luong, han_nghiem_thu: p.han_nghiem_thu ?? null,
  }).select().single()
  if (error) throw error
  const { error: e2 } = await supabase.from('viec_nguoi_lam').insert(p.nguoi_lam_ids.map((id) => ({ viec_id: viec.id, nhan_su_id: id })))
  if (e2) throw e2
  return viec as Viec
}

// ── VIỆC CỦA TÔI (tôi LÀM) — cho "Việc của tôi" rail Phát triển ─────────────
export async function listViecCuaToi(nhanSuId: string): Promise<ViecFull[]> {
  const { data: links, error } = await supabase.from('viec_nguoi_lam').select('viec_id').eq('nhan_su_id', nhanSuId).limit(LIMIT)
  if (error) throw error
  const ids = (links ?? []).map((r: any) => r.viec_id)
  if (!ids.length) return []
  return fetchViecFull(ids)
}
// ── VIỆC TÔI ĐÃ GIAO (theo dõi/nghiệm thu) ──────────────────────────────────
export async function listViecToiGiao(nguoiGiaoId: string): Promise<ViecFull[]> {
  const { data, error } = await supabase.from('viec').select('id').eq('nguoi_giao', nguoiGiaoId).order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  const ids = (data ?? []).map((r: any) => r.id)
  if (!ids.length) return []
  return fetchViecFull(ids)
}
async function fetchViecFull(ids: string[]): Promise<ViecFull[]> {
  const [{ data: viecs, error }, { data: links }, { data: loaiViecs }, { data: nhanSus }] = await Promise.all([
    supabase.from('viec').select('*').in('id', ids).order('created_at', { ascending: false }).limit(LIMIT),
    supabase.from('viec_nguoi_lam').select('viec_id, nhan_su_id').in('viec_id', ids).limit(LIMIT * 5),
    supabase.from('loai_viec').select('*').limit(LIMIT),
    supabase.from('nhan_su').select('id, ho_ten').limit(LIMIT),
  ])
  if (error) throw error
  const lvMap = new Map(((loaiViecs ?? []) as any[]).map((l) => [l.id, l]))
  const nsMap = new Map(((nhanSus ?? []) as any[]).map((n) => [n.id, n.ho_ten]))
  const nguoiLamByViec = new Map<string, { nhan_su_id: string; ho_ten: string }[]>()
  for (const l of (links ?? []) as any[]) {
    const arr = nguoiLamByViec.get(l.viec_id) ?? []
    arr.push({ nhan_su_id: l.nhan_su_id, ho_ten: nsMap.get(l.nhan_su_id) ?? '?' })
    nguoiLamByViec.set(l.viec_id, arr)
  }
  return ((viecs ?? []) as Viec[]).map((v) => ({
    ...v, loai_viec: lvMap.get(v.loai_viec_id), nguoi_giao_ten: nsMap.get(v.nguoi_giao) ?? '?',
    nguoi_lam: nguoiLamByViec.get(v.id) ?? [],
  }))
}

// ── NHÂN SỰ BẤM "HOÀN THÀNH" → chuyển cho leader nghiệm thu ─────────────────
export async function banHoanThanh(viecId: string): Promise<void> {
  const { error } = await supabase.from('viec').update({ trang_thai: 'cho_nghiem_thu', hoan_thanh_at: new Date().toISOString() }).eq('id', viecId)
  if (error) throw error
}
// NS tự bấm bắt đầu làm (rời trạng thái 'giao' ban đầu) — không bắt buộc, chỉ để track.
export async function batDauLam(viecId: string): Promise<void> {
  const { error } = await supabase.from('viec').update({ trang_thai: 'dang_lam' }).eq('id', viecId)
  if (error) throw error
}
// Việc bị trả lại → NS gửi lại nghiệm thu (không phải sửa lại từ đầu, giữ nguyên tiến độ NS tự thấy đã sửa).
export async function guiLaiNghiemThu(viecId: string): Promise<void> {
  const { error } = await supabase.from('viec').update({ trang_thai: 'cho_nghiem_thu', hoan_thanh_at: new Date().toISOString() }).eq('id', viecId)
  if (error) throw error
}

// ── LEADER NGHIỆM THU — chốt tiến độ + chất lượng + bằng chứng bắt buộc (trừ task_nho) ──
// Mốc tính = NGÀY NGHIỆM THU (ky_tinh = tháng hiện tại lúc bấm, KHÔNG phải lúc giao).
export async function nghiemThu(viecId: string, p: {
  dat: boolean; tien_do: number; chat_luong: number; bang_chung?: string | null; ghi_chu?: string | null
}): Promise<void> {
  const { data: viec, error: e0 } = await supabase.from('viec').select('*, loai_viec:loai_viec_id(task_nho)').eq('id', viecId).single()
  if (e0) throw e0
  const taskNho = !!(viec as any)?.loai_viec?.task_nho
  if (p.dat && !taskNho && !p.bang_chung?.trim()) throw new Error('Loại việc này cần bằng chứng mới chốt Đạt được (task nhỏ mới miễn).')
  const now = new Date()
  const ky = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const phanTram = p.dat ? Math.round((p.tien_do * 0.4 + p.chat_luong * 0.6) * 10) / 10 : 0
  const { error } = await supabase.from('viec').update({
    trang_thai: p.dat ? 'dat' : 'tra_lai',
    tien_do: p.tien_do, chat_luong: p.chat_luong, phan_tram: phanTram,
    bang_chung: p.bang_chung ?? null, ghi_chu_nghiem_thu: p.ghi_chu ?? null,
    ky_tinh: p.dat ? ky : null, nghiem_thu_at: now.toISOString(),
  }).eq('id', viecId)
  if (error) throw error
}

// ── HIỆU SUẤT KỲ (pure-derive, KHÔNG lưu bảng — tính lúc đọc) ───────────────
// Σ(khối_lượng × %) / Σ khối_lượng — CHUẨN HOÁ (20 việc hay 5 việc đều ra %).
// Sản lượng = Σ khối lượng đã ĐẠT (song song, KHÔNG gộp vào rate).
export type HieuSuatKy = { hieuSuat: number | null; sanLuong: number; soViecDat: number; soViecTraLai: number }
export async function tinhHieuSuatKy(nhanSuId: string, ky: string): Promise<HieuSuatKy> {
  const { data: links, error } = await supabase.from('viec_nguoi_lam').select('viec_id').eq('nhan_su_id', nhanSuId).limit(LIMIT)
  if (error) throw error
  const ids = (links ?? []).map((r: any) => r.viec_id)
  if (!ids.length) return { hieuSuat: null, sanLuong: 0, soViecDat: 0, soViecTraLai: 0 }
  const { data: viecs, error: e2 } = await supabase.from('viec').select('khoi_luong, phan_tram, trang_thai, ky_tinh').in('id', ids).limit(LIMIT)
  if (e2) throw e2
  const datTrongKy = ((viecs ?? []) as any[]).filter((v) => v.trang_thai === 'dat' && v.ky_tinh === ky)
  const traLaiTrongKy = ((viecs ?? []) as any[]).filter((v) => v.trang_thai === 'tra_lai')
  const sumKl = datTrongKy.reduce((s, v) => s + Number(v.khoi_luong), 0)
  const sumKlPct = datTrongKy.reduce((s, v) => s + Number(v.khoi_luong) * Number(v.phan_tram ?? 0), 0)
  return {
    hieuSuat: sumKl > 0 ? Math.round((sumKlPct / sumKl) * 10) / 10 : null,
    sanLuong: sumKl, soViecDat: datTrongKy.length, soViecTraLai: traLaiTrongKy.length,
  }
}
