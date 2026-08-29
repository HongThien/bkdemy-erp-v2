// ============================================================================
// hocphi.ts — DATA-LAYER học phí (seam: UI KHÔNG gọi supabase trực tiếp).
// Spec: spec-hocphi.md (chốt 07-05, model mức học phí/học liệu tách bảng riêng).
// Pure-derive Ảo→Thật (như buổi học): phiếu ẢO tính realtime tới lúc "Chốt kỳ"
// đông cứng + snapshot. Người-trong-vòng-lặp ở chỗ tiền nhạy cảm — KHÔNG auto-giảm.
// ============================================================================
import { supabase } from './supabase'
import { tinhHeSoHocSinh, thanhTienHocPhi, thanhTienHocDuoi, deXuatCongThuc } from '../gami/hocphi.js'

const LIMIT = 2000

// ⚠ BUG THẬT (08-16, CEO báo "sai nghiêm trọng" số học phí tháng 7 trên 1 máy): nhét CẢ mảng ID
// (300-500+ UUID) thẳng vào `.in()` trên URL GET → URL dài chục nghìn ký tự → 400 Bad Request TRÊN
// MỘT SỐ MẠNG/PROXY (không phải mọi máy — tuỳ giới hạn URL của proxy/router giữa đường, nên lỗi
// KHÔNG tái hiện đều, đúng bẫy CLAUDE.md §2 "Debug 400 ... URL dài"). Lỗi ném ra KHÔNG được bắt ở
// nơi gọi (Uncaught in promise) → điểm danh/hệ số coi như rỗng cho phần lớn HS → tiền tính THIẾU
// (đo thật: hụt ~100 triệu/tháng), không báo lỗi rõ ràng trên UI. ID_BATCH nhỏ đủ để URL luôn an
// toàn (~60 UUID × ~39 ký tự mã hoá ≈ 2.400 ký tự/tham số, dưới MỌI giới hạn URL từng biết ≥8KB).
const ID_BATCH = 60
function chunkArr<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}
// Gọi lại 1 query theo từng LÔ id (thay vì 1 phát nhét cả mảng vào `.in()`) — dùng cho mọi chỗ
// `.in('hoc_sinh_id'|'lop_id', mảngToànTrường)`. Lỗi ở batch nào ném ngay, không nuốt im lặng.
async function selectByIdsBatched<T>(
  ids: string[],
  fetchBatch: (batch: string[]) => PromiseLike<{ data: T[] | null; error: any }>,
  size = ID_BATCH,
): Promise<T[]> {
  if (!ids.length) return []
  const out: T[] = []
  for (const batch of chunkArr(ids, size)) {
    const { data, error } = await fetchBatch(batch)
    if (error) throw error
    out.push(...(data ?? []))
  }
  return out
}

// ── MỨC HỌC PHÍ / HỌC ĐUỔI / HỌC LIỆU — 3 bảng ĐỘC LẬP, CÙNG quy tắc (Thùy 07-05):
// mỗi khoản 1 bảng mức riêng, LỚP tham chiếu FK riêng từng cái (không suy công thức chéo nhau).
// Tên mức TỰ ĐẶT theo giá (KHÔNG bắt gõ tay — "tên" và "giá" trùng nhau, Thùy chỉ ra).
export type MucHocPhi = { id: string; ten: string; don_gia_buoi: number; created_at?: string }
export type MucHocDuoi = { id: string; ten: string; gia: number; created_at?: string }
export type MucHocLieu = { id: string; ten: string; gia: number; created_at?: string }
const tenTuGia = (gia: number, hau_to = '') => `${Math.round(gia).toLocaleString('vi-VN')}đ${hau_to}`
const tienVN = (n: number) => `${Math.round(n).toLocaleString('vi-VN')}đ`

export async function listMucHocPhi(): Promise<MucHocPhi[]> {
  const { data, error } = await supabase.from('muc_hoc_phi').select('*').order('don_gia_buoi').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as MucHocPhi[]
}
export async function createMucHocPhi(donGiaBuoi: number): Promise<MucHocPhi> {
  const { data, error } = await supabase.from('muc_hoc_phi').insert({ ten: tenTuGia(donGiaBuoi, '/buổi'), don_gia_buoi: donGiaBuoi }).select().single()
  if (error) throw error
  return data as MucHocPhi
}
export async function deleteMucHocPhi(id: string): Promise<void> {
  const { error } = await supabase.from('muc_hoc_phi').delete().eq('id', id)
  if (error) throw error
}
export async function listMucHocDuoi(): Promise<MucHocDuoi[]> {
  const { data, error } = await supabase.from('muc_hoc_duoi').select('*').order('gia').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as MucHocDuoi[]
}
export async function createMucHocDuoi(gia: number): Promise<MucHocDuoi> {
  const { data, error } = await supabase.from('muc_hoc_duoi').insert({ ten: tenTuGia(gia, '/buổi đuổi'), gia }).select().single()
  if (error) throw error
  return data as MucHocDuoi
}
export async function deleteMucHocDuoi(id: string): Promise<void> {
  const { error } = await supabase.from('muc_hoc_duoi').delete().eq('id', id)
  if (error) throw error
}
export async function listMucHocLieu(): Promise<MucHocLieu[]> {
  const { data, error } = await supabase.from('muc_hoc_lieu').select('*').order('gia').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as MucHocLieu[]
}
export async function createMucHocLieu(gia: number): Promise<MucHocLieu> {
  const { data, error } = await supabase.from('muc_hoc_lieu').insert({ ten: tenTuGia(gia, '/tháng'), gia }).select().single()
  if (error) throw error
  return data as MucHocLieu
}
export async function deleteMucHocLieu(id: string): Promise<void> {
  const { error } = await supabase.from('muc_hoc_lieu').delete().eq('id', id)
  if (error) throw error
}

// ── HỆ SỐ HỌC PHÍ — thông tin CỦA HỌC SINH (Thùy chốt 07-05, KHÔNG phải gia đình) ──
// Pure-derive: hệ thống GỢI Ý (tính lúc đọc, không ghi), Nhân sự XÁC NHẬN mới ghi
// vào hoc_sinh.he_so_hoc_phi. `he_so_nguon`: 'auto' (theo gợi ý đã xác nhận) | 'manual' (sửa tay, ngoại lệ).
export type HocSinhHeSo = {
  id: string; ho_ten: string; phu_huynh_id: string | null; phu_huynh_ten: string | null
  mons: string[]; lops: string[]; he_so_hoc_phi: number; he_so_nguon: string; heSoGoiY: number; lyDoGoiY: string
}
// Bulk toàn bộ HS đang học ở BK — cho bảng quản lý hệ số (không lọc theo PH, hiện hết).
export async function listHeSoHocSinh(): Promise<HocSinhHeSo[]> {
  const { data: hocSinh, error: e1 } = await supabase.from('hoc_sinh')
    .select('id, ho_ten, phu_huynh_id, he_so_hoc_phi, he_so_nguon, phu_huynh:phu_huynh_id(ho_ten)')
    .eq('trang_thai', 'dang_hoc').order('ho_ten').limit(LIMIT)
  if (e1) throw e1
  const rows = (hocSinh ?? []) as any[]
  const ids = rows.map((r) => r.id as string)
  // 2 batch độc lập (đều chỉ cần `ids`, không cần kết quả của nhau) — chạy song song thay vì tuần tự.
  const [heSoMap, hsl] = await Promise.all([
    heSoHieuLucBatch(ids, kyHienTai()), // hệ số HIỆU LỰC tháng NÀY (effective-dated) → "hệ số hiện tại" luôn đúng
    selectByIdsBatched(ids, (batch) =>
      supabase.from('hoc_sinh_lop').select('hoc_sinh_id, lop:lop_id(mon, ten_lop)').in('hoc_sinh_id', batch).eq('trang_thai', 'dang_hoc').limit(LIMIT)),
  ])
  const monsByHS = new Map<string, Set<string>>()
  const lopsByHS = new Map<string, string[]>()
  for (const r of (hsl ?? []) as any[]) {
    if (!r.lop?.mon) continue
    const s = monsByHS.get(r.hoc_sinh_id) ?? new Set<string>()
    s.add(r.lop.mon); monsByHS.set(r.hoc_sinh_id, s)
    if (r.lop.ten_lop) {
      const arr = lopsByHS.get(r.hoc_sinh_id) ?? []
      arr.push(r.lop.ten_lop); lopsByHS.set(r.hoc_sinh_id, arr)
    }
  }
  // nhóm theo PH để check "có anh chị em cùng học chung ít nhất 1 môn"
  const bySiblingGroup = new Map<string, string[]>() // phu_huynh_id -> [hoc_sinh_id...]
  for (const r of rows) {
    if (!r.phu_huynh_id) continue
    const arr = bySiblingGroup.get(r.phu_huynh_id) ?? []
    arr.push(r.id); bySiblingGroup.set(r.phu_huynh_id, arr)
  }
  const tenById = new Map(rows.map((r) => [r.id as string, r.ho_ten as string]))
  const out = rows.map((r) => {
    const mons = [...(monsByHS.get(r.id) ?? [])]
    const siblings = (r.phu_huynh_id ? bySiblingGroup.get(r.phu_huynh_id) : [])?.filter((id) => id !== r.id) ?? []
    // anh/chị/em ĐẦU TIÊN cùng học chung ít nhất 1 môn + đúng (các) môn chung, để giải thích lý do gợi ý.
    let anhChiEm: { ten: string; monChung: string[] } | null = null
    for (const sid of siblings) {
      const monChung = mons.filter((m) => monsByHS.get(sid)?.has(m))
      if (monChung.length) { anhChiEm = { ten: tenById.get(sid) ?? '?', monChung }; break }
    }
    const lyDo: string[] = []
    if (mons.length >= 2) lyDo.push(`Học ${mons.length} môn: ${mons.join(', ')}`)
    if (anhChiEm) lyDo.push(`Có anh chị em ${anhChiEm.ten} cùng học ${anhChiEm.monChung.join(', ')}`)
    return {
      id: r.id, ho_ten: r.ho_ten, phu_huynh_id: r.phu_huynh_id, phu_huynh_ten: r.phu_huynh?.ho_ten ?? null,
      mons, lops: lopsByHS.get(r.id) ?? [], he_so_hoc_phi: heSoMap.get(r.id) ?? 1, he_so_nguon: r.he_so_nguon,
      heSoGoiY: tinhHeSoHocSinh(mons.length, !!anhChiEm), lyDoGoiY: lyDo.join(' · '),
    }
  })
  // HS lệch gợi ý (kể cả HS mới vào — vào lớp làm thay đổi gợi ý của chính nó HOẶC anh chị em) lên ĐẦU danh sách,
  // để Nhân sự thấy ngay chỗ cần xác nhận mà không phải dò cả bảng (Thùy 07-05).
  return out.sort((a, b) => {
    const lechA = a.he_so_nguon !== 'manual' && a.heSoGoiY !== a.he_so_hoc_phi ? 0 : 1
    const lechB = b.he_so_nguon !== 'manual' && b.heSoGoiY !== b.he_so_hoc_phi ? 0 : 1
    if (lechA !== lechB) return lechA - lechB
    return a.ho_ten.localeCompare(b.ho_ten, 'vi')
  })
}
// Refetch DERIVED info cho ĐÚNG 1 học sinh — dùng sau khi Xác nhận/Sửa tay/Bỏ tay 1 dòng ở bảng Hệ số,
// tránh load lại CẢ TRƯỜNG (300+ HS) chỉ để cập nhật 1 dòng (nguyên nhân lag 3-4s cũ). Vẫn tính lại từ
// DB thật (không đoán ở client) nên tôn trọng đúng luật effective-dated ("áp dụng từ kỳ" có thể chưa
// đổi hệ số hiển thị của kỳ hiện tại).
export async function getHeSoHocSinh(hocSinhId: string): Promise<HocSinhHeSo | null> {
  const { data: hs, error: e1 } = await supabase.from('hoc_sinh')
    .select('id, ho_ten, phu_huynh_id, he_so_nguon, phu_huynh:phu_huynh_id(ho_ten)')
    .eq('id', hocSinhId).maybeSingle()
  if (e1) throw e1
  if (!hs) return null
  const r = hs as any
  const heSoMap = await heSoHieuLucBatch([r.id], kyHienTai())

  let siblings: { id: string; ho_ten: string }[] = []
  if (r.phu_huynh_id) {
    const { data: sibs, error: e2 } = await supabase.from('hoc_sinh').select('id, ho_ten')
      .eq('phu_huynh_id', r.phu_huynh_id).eq('trang_thai', 'dang_hoc').neq('id', r.id).limit(LIMIT)
    if (e2) throw e2
    siblings = (sibs ?? []) as any[]
  }
  const { data: hsl, error: e3 } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, lop:lop_id(mon, ten_lop)')
    .in('hoc_sinh_id', [r.id, ...siblings.map((s) => s.id)]).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  if (e3) throw e3
  const monsByHS = new Map<string, Set<string>>()
  const lops: string[] = []
  for (const row of (hsl ?? []) as any[]) {
    if (!row.lop?.mon) continue
    const s = monsByHS.get(row.hoc_sinh_id) ?? new Set<string>()
    s.add(row.lop.mon); monsByHS.set(row.hoc_sinh_id, s)
    if (row.hoc_sinh_id === r.id && row.lop.ten_lop) lops.push(row.lop.ten_lop)
  }
  const mons = [...(monsByHS.get(r.id) ?? [])]
  const tenById = new Map(siblings.map((s) => [s.id, s.ho_ten]))
  let anhChiEm: { ten: string; monChung: string[] } | null = null
  for (const sib of siblings) {
    const monChung = mons.filter((m) => monsByHS.get(sib.id)?.has(m))
    if (monChung.length) { anhChiEm = { ten: tenById.get(sib.id) ?? '?', monChung }; break }
  }
  const lyDo: string[] = []
  if (mons.length >= 2) lyDo.push(`Học ${mons.length} môn: ${mons.join(', ')}`)
  if (anhChiEm) lyDo.push(`Có anh chị em ${anhChiEm.ten} cùng học ${anhChiEm.monChung.join(', ')}`)
  return {
    id: r.id, ho_ten: r.ho_ten, phu_huynh_id: r.phu_huynh_id, phu_huynh_ten: r.phu_huynh?.ho_ten ?? null,
    mons, lops, he_so_hoc_phi: heSoMap.get(r.id) ?? 1, he_so_nguon: r.he_so_nguon,
    heSoGoiY: tinhHeSoHocSinh(mons.length, !!anhChiEm), lyDoGoiY: lyDo.join(' · '),
  }
}
// Xác nhận hệ số GỢI Ý → ghi vào cột thật (nguồn='auto').
export async function xacNhanHeSo(hocSinhId: string, heSo: number): Promise<void> {
  const { error } = await supabase.from('hoc_sinh').update({ he_so_hoc_phi: heSo, he_so_nguon: 'auto' }).eq('id', hocSinhId)
  if (error) throw error
}
// Sửa hệ số TAY (học bổng, ngoại lệ…) — set nguồn='manual' để bảng không tự gợi ý đè.
export async function setHeSoThuCong(hocSinhId: string, heSo: number): Promise<void> {
  const { error } = await supabase.from('hoc_sinh').update({ he_so_hoc_phi: heSo, he_so_nguon: 'manual' }).eq('id', hocSinhId)
  if (error) throw error
}
// Trả về auto lại — hệ số THẬT giữ nguyên tới khi Nhân sự bấm "Xác nhận" gợi ý mới.
export async function boManualHeSo(hocSinhId: string): Promise<void> {
  const { error } = await supabase.from('hoc_sinh').update({ he_so_nguon: 'auto' }).eq('id', hocSinhId)
  if (error) throw error
}
// ── HỆ SỐ EFFECTIVE-DATED (Cách 2, Thùy 08-01) — hệ số áp dụng TỪ tháng nào (luật "đủ 1 tháng mới giảm") ──
// Đặt hệ số hiệu lực từ 1 kỳ: ghi entry (HS × hiệu-lực-từ) + đồng bộ he_so_hoc_phi denormalize nếu áp THÁNG NÀY.
export async function setHeSoHieuLuc(hocSinhId: string, heSo: number, hieuLucTu: string, nguon: 'auto' | 'manual'): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('hoc_sinh_he_so').upsert(
    { hoc_sinh_id: hocSinhId, he_so: heSo, hieu_luc_tu: hieuLucTu, nguon, created_by: user?.id ?? null },
    { onConflict: 'hoc_sinh_id,hieu_luc_tu' })
  if (error) throw error
  if (hieuLucTu <= kyHienTai()) { // entry này đang là hiệu lực của tháng hiện tại → cập nhật denormalize
    await supabase.from('hoc_sinh').update({ he_so_hoc_phi: heSo, he_so_nguon: nguon }).eq('id', hocSinhId)
  }
}
// Hệ số hiệu lực cho kỳ (BATCH) — entry hieu_luc_tu ≤ ky, MỚI NHẤT. Không có → caller dùng ?? 1.
export async function heSoHieuLucBatch(hsIds: string[], ky: string): Promise<Map<string, number>> {
  const m = new Map<string, number>()
  if (!hsIds.length) return m
  // Chia lô theo hoc_sinh_id → mọi dòng của 1 HS luôn rơi vào ĐÚNG 1 lô, thứ tự asc trong lô vẫn giữ
  // (order chạy trên từng batch) nên "ghi đè cuối = mới nhất ≤ ky" không đổi dù xử lý theo lô.
  const data = await selectByIdsBatched(hsIds, (batch) =>
    supabase.from('hoc_sinh_he_so').select('hoc_sinh_id, he_so, hieu_luc_tu')
      .in('hoc_sinh_id', batch).lte('hieu_luc_tu', ky).order('hieu_luc_tu', { ascending: true }).limit(LIMIT))
  for (const r of data as any[]) m.set(r.hoc_sinh_id, Number(r.he_so)) // asc → ghi cuối = mới nhất ≤ ky
  return m
}
// Lịch sử hệ số của 1 HS (cho tab Hệ số hiện + chọn) — mới nhất trước.
export async function listHeSoLichSu(hocSinhId: string): Promise<{ he_so: number; hieu_luc_tu: string; nguon: string }[]> {
  const { data, error } = await supabase.from('hoc_sinh_he_so').select('he_so, hieu_luc_tu, nguon').eq('hoc_sinh_id', hocSinhId).order('hieu_luc_tu', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({ he_so: Number(r.he_so), hieu_luc_tu: String(r.hieu_luc_tu).slice(0, 10), nguon: r.nguon }))
}

// ── CHU KỲ THÁNG — instant UTC (§8, KHÔNG format ngày-local) ────────────────
// ky = 'YYYY-MM-01' (ngày 1 đầu tháng, giờ VN). Trả [kyStart, kyEnd) dạng 'YYYY-MM-DD' để so cột `date`.
export function kyRange(ky: string): { kyStart: string; kyEnd: string } {
  const [y, m] = ky.split('-').map(Number)
  const kyEnd = new Date(Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1)).toISOString().slice(0, 10)
  return { kyStart: ky.slice(0, 10), kyEnd }
}
export function kyHienTai(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

// ── BÙ theo tháng buổi GỐC — NGUỒN DUY NHẤT (bảng "HS theo môn" + xét duyệt + phiếu cùng gọi) ───
// Bù của tháng 7 có thể diễn ra tháng 8 → tính theo tháng buổi GỐC (buổi bị vắng), KHÔNG theo ngày bù.
// GỒM: đã bù thật (hoàn tất + có mặt) · đã xếp chưa diễn ra · đã diễn ra mà vắng · bị HUỶ — tất cả tính
// (đã bỏ công sắp xếp, Thùy 08-01). DEDUPE theo buổi gốc: 1 vắng = tối đa 1 bù (bù không vượt số nghỉ).
// done=true chỉ để phân loại HIỂN THỊ (đã bù vs đã xếp). Trả Map `${hs}|${lopGốc}` -> gocId -> {done, ngày bù}.
// ⚠ buLinks .limit(LIMIT) toàn trường — nếu số link bù vượt 2000 phải paginate (cùng bẫy fetchAllBhh).
async function buByGocKy(hsIds: string[], kyStart: string, kyEnd: string): Promise<Map<string, Map<string, { done: boolean; ngay: string }>>> {
  const out = new Map<string, Map<string, { done: boolean; ngay: string }>>()
  if (!hsIds.length) return out
  const buLinks = await selectByIdsBatched(hsIds, (batch) =>
    supabase.from('buoi_hoc_hs')
      .select('hoc_sinh_id, buoi_hoc_id, bu_cho_buoi_id, diem_danh').in('hoc_sinh_id', batch).not('bu_cho_buoi_id', 'is', null).limit(LIMIT))
  const ids = [...new Set((buLinks as any[]).flatMap((l) => [l.buoi_hoc_id, l.bu_cho_buoi_id]))]
  const info = new Map<string, { ngay: string; lop_id: string | null; trang_thai: string }>()
  if (ids.length) {
    const { data: bs } = await supabase.from('buoi_hoc').select('id, ngay, lop_id, trang_thai').in('id', ids).limit(LIMIT)
    for (const b of (bs ?? []) as any[]) info.set(b.id, b)
  }
  for (const l of (buLinks ?? []) as any[]) {
    const bu = info.get(l.buoi_hoc_id); const goc = info.get(l.bu_cho_buoi_id)
    if (!bu || !goc?.lop_id) continue
    if (goc.ngay < kyStart || goc.ngay >= kyEnd) continue // thuộc kỳ theo buổi GỐC
    const done = bu.trang_thai === 'hoan_tat' && l.diem_danh === 'co_mat'
    const key = `${l.hoc_sinh_id}|${goc.lop_id}`
    let m = out.get(key); if (!m) { m = new Map(); out.set(key, m) }
    m.set(l.bu_cho_buoi_id, { done: (m.get(l.bu_cho_buoi_id)?.done ?? false) || done, ngay: bu.ngay })
  }
  return out
}
export function tachBu(m?: Map<string, { done: boolean; ngay: string }>): { soBuoiBu: number; soBuoiBuDaHoc: number; soBuoiBuDaXep: number; ngayBu: string[] } {
  const arr = [...(m?.values() ?? [])]
  const soBuoiBuDaHoc = arr.filter((x) => x.done).length
  return { soBuoiBu: arr.length, soBuoiBuDaHoc, soBuoiBuDaXep: arr.length - soBuoiBuDaHoc, ngayBu: arr.map((x) => x.ngay).sort() }
}

// ── THỐNG KÊ BUỔI (con × lớp × kỳ) — nền cho học phí + xét duyệt ────────────
export type ThongKeBuoi = { soBuoiLop: number; soBuoiWindow: number; soBuoiNghi: number; soBuoiDiHoc: number; soBuoiBu: number; soBuoiBuDaHoc: number; soBuoiBuDaXep: number }
async function thongKeBuoiConLop(hocSinhId: string, lopId: string, kyStart: string, kyEnd: string): Promise<ThongKeBuoi> {
  // buổi LỚP trong tháng: mo/hoan_tat, KHÁC huỷ, loai≠'bu' (bo_tro_duoi/bu không có lop_id nên tự loại — vẫn lọc tường minh theo spec).
  const { data: buoiLop, error: e1 } = await supabase.from('buoi_hoc').select('id, ngay')
    .eq('lop_id', lopId).neq('loai', 'bu').in('trang_thai', ['mo', 'hoan_tat']).gte('ngay', kyStart).lt('ngay', kyEnd).limit(LIMIT)
  if (e1) throw e1
  const soBuoiLop = (buoiLop ?? []).length
  // window ghi danh của con ở lớp này (dòng MỚI NHẤT — con có thể vào/rời/vào-lại).
  const { data: hslRows, error: e2 } = await supabase.from('hoc_sinh_lop').select('ngay_vao, ngay_roi')
    .eq('hoc_sinh_id', hocSinhId).eq('lop_id', lopId).order('ngay_vao', { ascending: false }).limit(1)
  if (e2) throw e2
  const w = (hslRows as { ngay_vao: string | null; ngay_roi: string | null }[])?.[0]
  const inWindow = (ngay: string) => (!w?.ngay_vao || ngay >= w.ngay_vao) && (!w?.ngay_roi || ngay <= w.ngay_roi)
  const buoiTrongWindow = (buoiLop ?? []).filter((b) => inWindow(b.ngay))
  const soBuoiWindow = buoiTrongWindow.length
  let soBuoiNghi = 0, soBuoiDiHoc = 0
  const buoiIds = buoiTrongWindow.map((b) => b.id)
  if (buoiIds.length) {
    const { data: bhh, error: e3 } = await supabase.from('buoi_hoc_hs').select('diem_danh').eq('hoc_sinh_id', hocSinhId).in('buoi_hoc_id', buoiIds).limit(LIMIT)
    if (e3) throw e3
    const dds = (bhh ?? []) as { diem_danh: string | null }[]
    soBuoiNghi = dds.filter((r) => r.diem_danh === 'vang' || r.diem_danh === 'vang_phep').length
    soBuoiDiHoc = dds.filter((r) => r.diem_danh === 'co_mat').length
  }
  // BÙ (đề xuất CT2 = đi học + bù) — CÙNG nguồn buByGocKy với bảng "HS theo môn", không đếm lệch.
  const bu = tachBu((await buByGocKy([hocSinhId], kyStart, kyEnd)).get(`${hocSinhId}|${lopId}`))
  return { soBuoiLop, soBuoiWindow, soBuoiNghi, soBuoiDiHoc, soBuoiBu: bu.soBuoiBu, soBuoiBuDaHoc: bu.soBuoiBuDaHoc, soBuoiBuDaXep: bu.soBuoiBuDaXep }
}

// ── CHI PHÍ PHÁT SINH — 1 chỗ nhập, 2 loại (Thùy 07-05) ─────────────────────
// 'lop': áp MỌI HS đang học (dang_hoc) lớp đó — pure-derive lúc tính phiếu, KHÔNG snapshot lúc nhập.
// 'ca_nhan': áp riêng 1 HS. Gắn theo KỲ — tự hiện trong phiếu ảo + cộng khi chốt.
export type PhatSinhEntry = {
  id: string; ky: string; loai: 'lop' | 'ca_nhan'; lop_id: string | null; hoc_sinh_id: string | null
  mo_ta: string; so_tien: number; lop_ten?: string | null; hoc_sinh_ten?: string | null
}
export async function listPhatSinhTheoKy(ky: string): Promise<PhatSinhEntry[]> {
  const { data, error } = await supabase.from('hoc_phi_phat_sinh')
    .select('id, ky, loai, lop_id, hoc_sinh_id, mo_ta, so_tien, lop:lop_id(ten_lop), hoc_sinh:hoc_sinh_id(ho_ten)')
    .eq('ky', ky).order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({
    id: r.id, ky: r.ky, loai: r.loai, lop_id: r.lop_id, hoc_sinh_id: r.hoc_sinh_id, mo_ta: r.mo_ta, so_tien: Number(r.so_tien),
    lop_ten: r.lop?.ten_lop ?? null, hoc_sinh_ten: r.hoc_sinh?.ho_ten ?? null,
  }))
}
export async function themPhatSinhLop(ky: string, lopId: string, moTa: string, soTien: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('hoc_phi_phat_sinh').insert({ ky, loai: 'lop', lop_id: lopId, mo_ta: moTa, so_tien: soTien, created_by: user?.id ?? null })
  if (error) throw error
}
export async function themPhatSinhCaNhan(ky: string, hocSinhId: string, moTa: string, soTien: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('hoc_phi_phat_sinh').insert({ ky, loai: 'ca_nhan', hoc_sinh_id: hocSinhId, mo_ta: moTa, so_tien: soTien, created_by: user?.id ?? null })
  if (error) throw error
}
export async function xoaPhatSinh(id: string): Promise<void> {
  const { error } = await supabase.from('hoc_phi_phat_sinh').delete().eq('id', id)
  if (error) throw error
}
// Phát sinh áp cho 1 HS trong kỳ: cá nhân (đúng HS) + theo lớp (đang học lớp đó).
async function layPhatSinhChoCon(hocSinhId: string, lopIds: string[], ky: string): Promise<{ mo_ta: string; so_tien: number }[]> {
  const { data: caNhan, error: e1 } = await supabase.from('hoc_phi_phat_sinh').select('mo_ta, so_tien').eq('ky', ky).eq('loai', 'ca_nhan').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (e1) throw e1
  let theoLop: { mo_ta: string; so_tien: number }[] = []
  if (lopIds.length) {
    const { data, error: e2 } = await supabase.from('hoc_phi_phat_sinh').select('mo_ta, so_tien').eq('ky', ky).eq('loai', 'lop').in('lop_id', lopIds).limit(LIMIT)
    if (e2) throw e2
    theoLop = ((data ?? []) as any[]).map((r) => ({ mo_ta: r.mo_ta, so_tien: Number(r.so_tien) }))
  }
  return [...((caNhan ?? []) as any[]).map((r) => ({ mo_ta: r.mo_ta, so_tien: Number(r.so_tien) })), ...theoLop]
}

// ── PHIẾU ẢO (pure-derive realtime, §7) ──────────────────────────────────────
export type DongPhieu = {
  loai: 'hoc_phi' | 'hoc_duoi' | 'hoc_lieu' | 'phat_sinh' | 'no_ky_truoc' | 'giam_gioi_thieu'
  hoc_sinh_id: string | null; hoc_sinh_ten?: string; lop_id: string | null; lop_ten?: string
  mo_ta: string | null; so_luong: number | null; don_gia: number | null; he_so: number | null; thanh_tien: number
}
export type PhieuAo = { phu_huynh_id: string; ky: string; dong: DongPhieu[]; tongTien: number; soDuNoTruoc: number }

export async function getPhieuAo(phuHuynhId: string, ky: string): Promise<PhieuAo> {
  const { kyStart, kyEnd } = kyRange(ky)
  const dong: DongPhieu[] = []

  const { data: cons, error: e0 } = await supabase.from('hoc_sinh').select('id, ho_ten, he_so_hoc_phi').eq('phu_huynh_id', phuHuynhId).limit(LIMIT)
  if (e0) throw e0
  // Chọn CT1/CT2 TAY (nếu có, ở "HS theo môn") — else auto theo ngưỡng nghỉ 30%. (Bỏ xét duyệt 08-01.)
  const conIds = (cons ?? []).map((c: any) => c.id as string)
  const ctMap = new Map<string, CongThuc>()
  if (conIds.length) {
    const { data: ctRows } = await supabase.from('hoc_phi_cong_thuc').select('hoc_sinh_id, lop_id, cong_thuc').eq('ky', ky).in('hoc_sinh_id', conIds).limit(LIMIT)
    for (const r of (ctRows ?? []) as any[]) ctMap.set(`${r.hoc_sinh_id}|${r.lop_id}`, r.cong_thuc)
  }
  const heSoMap = await heSoHieuLucBatch(conIds, ky) // ⭐ hệ số HIỆU LỰC cho kỳ (effective-dated, Cách 2 — luật "đủ 1 tháng")
  for (const con of (cons ?? []) as { id: string; ho_ten: string; he_so_hoc_phi: number }[]) {
    const heSoCon = heSoMap.get(con.id) ?? 1
    // ghi danh CÓ HIỆU LỰC trong kỳ (đã vào trước kyEnd, chưa rời hoặc rời trong/sau kỳ).
    const { data: hslAll, error: e1 } = await supabase.from('hoc_sinh_lop')
      .select('lop_id, ngay_vao, ngay_roi, lop:lop_id(ten_lop, mon, muc_hoc_phi_id, muc_hoc_lieu_id)')
      .eq('hoc_sinh_id', con.id).limit(LIMIT)
    if (e1) throw e1
    const lopIdsHieuLuc: string[] = []
    // 1 HS - 1 môn chỉ 1 lần phí tài liệu/kỳ — chuyển lớp giữa kỳ để lại 2 dòng hoc_sinh_lop hiệu lực
    // (lớp cũ + lớp mới) cùng môn, không được tính học liệu 2 lần.
    const monDaTinhHocLieu = new Set<string>()
    for (const enroll of (hslAll ?? []) as any[]) {
      if (enroll.ngay_vao && enroll.ngay_vao >= kyEnd) continue
      if (enroll.ngay_roi && enroll.ngay_roi < kyStart) continue
      lopIdsHieuLuc.push(enroll.lop_id)
      const tk = await thongKeBuoiConLop(con.id, enroll.lop_id, kyStart, kyEnd)
      // Auto CT1/CT2 (bỏ xét duyệt): CT2 khi nghỉ ≥30% hoặc chọn tay → tiền theo (đi học + bù);
      // CT1 theo số buổi lớp. Không còn gate người duyệt — chốt được ngay.
      // Mẫu số xét ngưỡng nghỉ-30% = buổi TRONG WINDOW ghi danh (không tính buổi sau khi HS đã rời lớp),
      // KHỚP listHocPhiTheoMonV2 (card/chốt) — nếu không, HS rời giữa tháng bị loãng tỉ lệ nghỉ → lật CT1↔CT2.
      const ct = ctMap.get(`${con.id}|${enroll.lop_id}`) ?? deXuatCongThuc(tk.soBuoiNghi, tk.soBuoiWindow)
      const soBuoi = ct === 'ct2' ? tk.soBuoiDiHoc + tk.soBuoiBu : tk.soBuoiWindow
      const muc = enroll.lop?.muc_hoc_phi_id ? (await supabase.from('muc_hoc_phi').select('*').eq('id', enroll.lop.muc_hoc_phi_id).single()).data as MucHocPhi | null : null
      const coHocPhi = !!muc && soBuoi > 0
      if (coHocPhi) {
        // Ghi rõ bù trên phiếu để PH hiểu đầy đủ (thông báo đủ, Thùy 08-01): "gồm X buổi bù (Y đã bù, Z đã xếp)".
        const moTaBu = tk.soBuoiBu > 0 ? `gồm ${tk.soBuoiBu} buổi bù (${tk.soBuoiBuDaHoc} đã bù${tk.soBuoiBuDaXep ? `, ${tk.soBuoiBuDaXep} đã xếp lịch` : ''})` : null
        dong.push({
          loai: 'hoc_phi', hoc_sinh_id: con.id, hoc_sinh_ten: con.ho_ten, lop_id: enroll.lop_id, lop_ten: enroll.lop?.ten_lop,
          mo_ta: moTaBu, so_luong: soBuoi, don_gia: muc!.don_gia_buoi, he_so: heSoCon,
          thanh_tien: thanhTienHocPhi(muc!.don_gia_buoi, soBuoi, heSoCon),
        })
      }
      // Học liệu CHỈ tính khi tháng đó thật sự có học phí (≥1 buổi) — chưa phát sinh học phí thì
      // KHÔNG mặc định thu học liệu (Thùy 07-05).
      const monEnroll = enroll.lop?.mon as string | undefined
      if (coHocPhi && enroll.lop?.muc_hoc_lieu_id && (!monEnroll || !monDaTinhHocLieu.has(monEnroll))) {
        const mucLieu = (await supabase.from('muc_hoc_lieu').select('*').eq('id', enroll.lop.muc_hoc_lieu_id).single()).data as MucHocLieu | null
        if (mucLieu) {
          dong.push({ loai: 'hoc_lieu', hoc_sinh_id: con.id, hoc_sinh_ten: con.ho_ten, lop_id: enroll.lop_id, lop_ten: enroll.lop?.ten_lop, mo_ta: mucLieu.ten, so_luong: 1, don_gia: mucLieu.gia, he_so: null, thanh_tien: mucLieu.gia })
          if (monEnroll) monDaTinhHocLieu.add(monEnroll)
        }
      }
    }
    // Chi phí phát sinh (cá nhân + theo lớp đang học) — 1 chỗ nhập ở tab "Phát sinh" (Thùy 07-05).
    const phatSinhCon = await layPhatSinhChoCon(con.id, lopIdsHieuLuc, ky)
    for (const p of phatSinhCon) {
      dong.push({ loai: 'phat_sinh', hoc_sinh_id: con.id, hoc_sinh_ten: con.ho_ten, lop_id: null, mo_ta: p.mo_ta, so_luong: null, don_gia: null, he_so: null, thanh_tien: p.so_tien })
    }
    // học đuổi: ĐỘC LẬP với lớp gốc — giá theo MỨC của CHÍNH CA đuổi (buoi_hoc.muc_hoc_duoi_id),
    // KHÔNG suy từ lớp HS đang đuổi (Thùy 07-05: "Học đuổi thay đổi theo ca Bổ trợ đuổi").
    // buổi loai='bo_tro_duoi' HS thực dự (diem_danh='co_mat') trong kỳ, group theo MỨC của ca.
    const { data: bhhDuoi, error: e4 } = await supabase.from('buoi_hoc_hs')
      .select('bo_tro_duoi_id, diem_danh, buoi:buoi_hoc_id!inner(ngay, loai, muc_hoc_duoi_id)')
      .eq('hoc_sinh_id', con.id).eq('diem_danh', 'co_mat').eq('buoi.loai', 'bo_tro_duoi').gte('buoi.ngay', kyStart).lt('buoi.ngay', kyEnd).limit(LIMIT)
    if (e4) throw e4
    const caseIds = [...new Set((bhhDuoi ?? []).map((r: any) => r.bo_tro_duoi_id).filter(Boolean))]
    const lopOfCase = new Map<string, string | null>()
    if (caseIds.length) {
      const { data: cases } = await supabase.from('bo_tro_duoi').select('id, lop_id').in('id', caseIds).limit(LIMIT)
      for (const c of (cases ?? []) as { id: string; lop_id: string | null }[]) lopOfCase.set(c.id, c.lop_id)
    }
    const countByMuc = new Map<string, { soBuoi: number; lopIds: Set<string> }>()
    for (const r of (bhhDuoi ?? []) as any[]) {
      const mucId = r.buoi?.muc_hoc_duoi_id
      if (!mucId) continue // ca chưa gán mức → chờ Vận hành gán, chưa tính tiền (thà bỏ trống còn hơn đánh sai)
      const cur = countByMuc.get(mucId) ?? { soBuoi: 0, lopIds: new Set<string>() }
      cur.soBuoi++
      const lopId = lopOfCase.get(r.bo_tro_duoi_id); if (lopId) cur.lopIds.add(lopId)
      countByMuc.set(mucId, cur)
    }
    if (countByMuc.size) {
      const { data: mucRows } = await supabase.from('muc_hoc_duoi').select('*').in('id', [...countByMuc.keys()]).limit(LIMIT)
      const mucById = new Map(((mucRows ?? []) as MucHocDuoi[]).map((m) => [m.id, m]))
      const lopIdsAll = [...new Set([...countByMuc.values()].flatMap((v) => [...v.lopIds]))]
      const { data: lopRows } = lopIdsAll.length ? await supabase.from('lop').select('id, ten_lop').in('id', lopIdsAll).limit(LIMIT) : { data: [] as any[] }
      const tenLopById = new Map(((lopRows ?? []) as { id: string; ten_lop: string }[]).map((l) => [l.id, l.ten_lop]))
      for (const [mucId, { soBuoi, lopIds }] of countByMuc) {
        const muc = mucById.get(mucId); if (!muc) continue
        const lopTen = [...lopIds].map((id) => tenLopById.get(id)).filter(Boolean).join(', ')
        dong.push({
          loai: 'hoc_duoi', hoc_sinh_id: con.id, hoc_sinh_ten: con.ho_ten, lop_id: null, lop_ten: lopTen || undefined,
          mo_ta: `Học đuổi ${soBuoi} buổi (${muc.ten})`, so_luong: soBuoi, don_gia: muc.gia, he_so: null, thanh_tien: thanhTienHocDuoi(muc.gia, soBuoi),
        })
      }
    }
  }

  // Giảm giới thiệu — trừ vào HỌC PHÍ tháng này (dong lúc này chỉ có học phí/liệu/đuổi/phát sinh, chưa gồm nợ).
  // Trải đến hết: trừ tối đa = số học phí; dư mang sang tháng sau (tinDungConLaiBatch tự trừ phần đã dùng ở hoá đơn chốt).
  const hocPhiSubtotal = dong.reduce((s, d) => s + d.thanh_tien, 0)
  const giam = Math.min((await tinDungConLaiBatch([phuHuynhId], ky)).get(phuHuynhId) ?? 0, Math.max(0, hocPhiSubtotal))
  if (giam > 0) dong.push({ loai: 'giam_gioi_thieu', hoc_sinh_id: null, lop_id: null, mo_ta: 'Giảm giới thiệu', so_luong: null, don_gia: null, he_so: null, thanh_tien: -Math.round(giam) })

  const soDuNoTruoc = await tinhSoDuNo(phuHuynhId)
  if (soDuNoTruoc > 0) dong.push({ loai: 'no_ky_truoc', hoc_sinh_id: null, lop_id: null, mo_ta: 'Nợ kỳ trước', so_luong: null, don_gia: null, he_so: null, thanh_tien: soDuNoTruoc })

  return { phu_huynh_id: phuHuynhId, ky, dong, tongTien: dong.reduce((s, d) => s + d.thanh_tien, 0), soDuNoTruoc }
}

// ── BẢNG HỌC PHÍ HS × MÔN (audit) — nền để check trước khi tin bảng theo PH (Thùy 07-05) ──
// KHÁC getPhieuAo: bulk toàn trường (không lọc theo PH), toàn batch-query (không N+1 per HS)
// nên KHÔNG chạy xét duyệt (nghỉ ≥30%/lệch window) — luôn hiện số buổi RAW trong window ghi danh.
// Xem để ĐỐI CHIẾU với "Phiếu"/"Danh sách" theo PH; số cuối cùng dùng để thu tiền vẫn lấy ở đó.
export type DongHocSinhTheoMon = {
  hoc_sinh_id: string; hoc_sinh_ten: string; ma_hs: string | null; phu_huynh_ten: string | null
  mon: string; lop_ten: string; so_buoi: number; don_gia: number; he_so: number; thanh_tien: number
}
export async function listHocPhiTheoHocSinhVaMon(ky: string): Promise<DongHocSinhTheoMon[]> {
  const { kyStart, kyEnd } = kyRange(ky)
  const { data: hsRows, error: e0 } = await supabase.from('hoc_sinh')
    .select('id, ho_ten, ma_hs, he_so_hoc_phi, phu_huynh:phu_huynh_id(ho_ten)').eq('trang_thai', 'dang_hoc').order('ho_ten').limit(LIMIT)
  if (e0) throw e0
  const hsIds = (hsRows ?? []).map((r: any) => r.id as string)
  if (!hsIds.length) return []
  const hsl = await selectByIdsBatched(hsIds, (batch) =>
    supabase.from('hoc_sinh_lop')
      .select('hoc_sinh_id, lop_id, ngay_vao, ngay_roi, lop:lop_id(ten_lop, mon, muc_hoc_phi_id)').in('hoc_sinh_id', batch).limit(LIMIT))
  const lopIds = [...new Set(hsl.map((r: any) => r.lop_id).filter(Boolean))]
  const buoiRows = lopIds.length
    ? await selectByIdsBatched(lopIds, (batch) =>
        supabase.from('buoi_hoc').select('id, lop_id, ngay').in('lop_id', batch).neq('loai', 'bu').in('trang_thai', ['mo', 'hoan_tat']).gte('ngay', kyStart).lt('ngay', kyEnd).limit(LIMIT))
    : []
  const buoiByLop = new Map<string, { ngay: string }[]>()
  for (const b of buoiRows as any[]) { const a = buoiByLop.get(b.lop_id) ?? []; a.push(b); buoiByLop.set(b.lop_id, a) }
  const mucIds = [...new Set(hsl.map((r: any) => r.lop?.muc_hoc_phi_id).filter(Boolean))]
  const { data: mucRows } = mucIds.length ? await supabase.from('muc_hoc_phi').select('*').in('id', mucIds).limit(LIMIT) : { data: [] as MucHocPhi[] }
  const mucById = new Map(((mucRows ?? []) as MucHocPhi[]).map((m) => [m.id, m]))
  const heSoById = new Map((hsRows ?? []).map((r: any) => [r.id, Number(r.he_so_hoc_phi)]))
  const tenById = new Map((hsRows ?? []).map((r: any) => [r.id, r.ho_ten]))
  const maHsById = new Map((hsRows ?? []).map((r: any) => [r.id, r.ma_hs ?? null]))
  const phById = new Map((hsRows ?? []).map((r: any) => [r.id, r.phu_huynh?.ho_ten ?? null]))

  const out: DongHocSinhTheoMon[] = []
  for (const enroll of (hsl ?? []) as any[]) {
    if (enroll.ngay_vao && enroll.ngay_vao >= kyEnd) continue
    if (enroll.ngay_roi && enroll.ngay_roi < kyStart) continue
    if (!enroll.lop?.muc_hoc_phi_id) continue
    const muc = mucById.get(enroll.lop.muc_hoc_phi_id); if (!muc) continue
    const buois = buoiByLop.get(enroll.lop_id) ?? []
    const inWindow = (ngay: string) => (!enroll.ngay_vao || ngay >= enroll.ngay_vao) && (!enroll.ngay_roi || ngay <= enroll.ngay_roi)
    const soBuoi = buois.filter((b) => inWindow(b.ngay)).length
    if (soBuoi <= 0) continue
    const heSo = heSoById.get(enroll.hoc_sinh_id) ?? 1
    out.push({
      hoc_sinh_id: enroll.hoc_sinh_id, hoc_sinh_ten: tenById.get(enroll.hoc_sinh_id) ?? '?', ma_hs: maHsById.get(enroll.hoc_sinh_id) ?? null,
      phu_huynh_ten: phById.get(enroll.hoc_sinh_id) ?? null,
      mon: enroll.lop.mon ?? '', lop_ten: enroll.lop.ten_lop ?? '', so_buoi: soBuoi, don_gia: muc.don_gia_buoi, he_so: heSo,
      thanh_tien: thanhTienHocPhi(muc.don_gia_buoi, soBuoi, heSo),
    })
  }

  // Học đuổi (batch, giống tinhTamTinhTheoPH) — Thùy 07-05: "chưa thấy thông tin về bổ trợ đuổi"
  // trong bảng này, cộng vào đây làm dòng riêng "Học đuổi" (KHÔNG nhân hệ số, giá theo mức của CA).
  const bhhDuoi = await selectByIdsBatched(hsIds, (batch) =>
    supabase.from('buoi_hoc_hs')
      .select('hoc_sinh_id, diem_danh, buoi:buoi_hoc_id!inner(ngay, loai, muc_hoc_duoi_id)')
      .in('hoc_sinh_id', batch).eq('diem_danh', 'co_mat').eq('buoi.loai', 'bo_tro_duoi').gte('buoi.ngay', kyStart).lt('buoi.ngay', kyEnd).limit(LIMIT))
  const countByHSMuc = new Map<string, number>() // `${hocSinhId}|${mucId}` -> soBuoi
  for (const r of bhhDuoi as any[]) {
    const mucId = r.buoi?.muc_hoc_duoi_id; if (!mucId) continue
    const key = `${r.hoc_sinh_id}|${mucId}`
    countByHSMuc.set(key, (countByHSMuc.get(key) ?? 0) + 1)
  }
  if (countByHSMuc.size) {
    const mucDuoiIds = [...new Set([...countByHSMuc.keys()].map((k) => k.split('|')[1]))]
    const { data: mucDuoiRows } = await supabase.from('muc_hoc_duoi').select('*').in('id', mucDuoiIds).limit(LIMIT)
    const mucDuoiById = new Map(((mucDuoiRows ?? []) as MucHocDuoi[]).map((m) => [m.id, m]))
    for (const [key, soBuoi] of countByHSMuc) {
      const [hocSinhId, mucId] = key.split('|')
      const muc = mucDuoiById.get(mucId); if (!muc) continue
      out.push({
        hoc_sinh_id: hocSinhId, hoc_sinh_ten: tenById.get(hocSinhId) ?? '?', ma_hs: maHsById.get(hocSinhId) ?? null,
        phu_huynh_ten: phById.get(hocSinhId) ?? null,
        mon: 'Học đuổi', lop_ten: '—', so_buoi: soBuoi, don_gia: muc.gia, he_so: 1,
        thanh_tien: thanhTienHocDuoi(muc.gia, soBuoi),
      })
    }
  }
  return out.sort((a, b) => a.hoc_sinh_ten.localeCompare(b.hoc_sinh_ten, 'vi') || a.mon.localeCompare(b.mon, 'vi'))
}

// Thêm dòng PHÁT SINH tay (0..n dòng, mô tả tự do) — TRƯỚC khi chốt kỳ (phiếu chưa tồn tại → lưu client-state
// ở UI cho tới lúc chốt, giống pattern nhập-kho — KHÔNG bảng nháp riêng). chotKy(...) nhận thêm mảng này.

// Nợ (số dư) theo TỪNG PH — batch (không N+1), dùng cho list "Học phí tổng".
// = Σ(hoá đơn ĐÃ CHỐT) − Σ(đã thu), group theo PH. >0 = còn nợ.
// Nợ CHI TIẾT theo PH: khởi tạo (điền tay `phu_huynh.no_khoi_tao`) + hệ thống (Σ hoá đơn chốt − đã thu).
async function noChiTietTheoPH(): Promise<Map<string, { khoiTao: number; heThong: number }>> {
  const m = new Map<string, { khoiTao: number; heThong: number }>()
  const get = (id: string) => { let x = m.get(id); if (!x) { x = { khoiTao: 0, heThong: 0 }; m.set(id, x) } return x }
  const { data: phs, error: e0 } = await supabase.from('phu_huynh').select('id, no_khoi_tao').gt('no_khoi_tao', 0).limit(LIMIT)
  if (e0) throw e0
  for (const p of (phs ?? []) as any[]) get(p.id).khoiTao = Number(p.no_khoi_tao)
  const { data: hds, error: e1 } = await supabase.from('hoa_don').select('id, phu_huynh_id, tong_tien').not('dong_at', 'is', null).limit(LIMIT)
  if (e1) throw e1
  const hdPh = new Map<string, string>()
  for (const h of (hds ?? []) as any[]) { get(h.phu_huynh_id).heThong += Number(h.tong_tien); hdPh.set(h.id, h.phu_huynh_id) }
  const hdIds = [...hdPh.keys()]
  if (hdIds.length) {
    const { data: tts, error: e2 } = await supabase.from('thanh_toan').select('hoa_don_id, so_tien').in('hoa_don_id', hdIds).limit(LIMIT)
    if (e2) throw e2
    for (const t of (tts ?? []) as any[]) { const ph = hdPh.get(t.hoa_don_id); if (ph) get(ph).heThong -= Number(t.so_tien) }
  }
  return m
}
// Tổng nợ (khởi tạo + hệ thống) theo PH — dùng cho list "Học phí tổng" + tính "nợ kỳ trước" trên phiếu.
export async function soDuNoTheoPH(): Promise<Map<string, number>> {
  const out = new Map<string, number>()
  for (const [id, v] of await noChiTietTheoPH()) out.set(id, v.khoiTao + v.heThong)
  return out
}
// Nợ khởi tạo (điền tay) của 1 PH — cho tab Nợ sửa.
export async function setNoKhoiTao(phuHuynhId: string, so: number): Promise<void> {
  const { error } = await supabase.from('phu_huynh').update({ no_khoi_tao: Math.max(0, Math.round(so)) }).eq('id', phuHuynhId)
  if (error) throw error
}

// Danh sách PH đang NỢ (tab "Học phí nợ") — tách khởi tạo / hệ thống, chỉ PH tổng nợ >0, sort giảm.
// coConDangHoc=false + conDaNghi = con đã nghỉ nhưng vẫn còn nợ (nợ cũ) → UI đánh dấu rõ (Thùy 08-03).
export type DongNo = { phu_huynh_id: string; ho_ten: string; ma_ph: string; noKhoiTao: number; noHeThong: number; no: number; coConDangHoc: boolean; conDaNghi: string[] }
export async function listNoPhaiThu(): Promise<DongNo[]> {
  const m = await noChiTietTheoPH()
  const es = [...m.entries()].map(([id, v]) => ({ id, noKhoiTao: Math.round(v.khoiTao), noHeThong: Math.round(v.heThong) })).filter((r) => r.noKhoiTao + r.noHeThong > 0.5)
  if (!es.length) return []
  const ids = es.map((e) => e.id)
  const [{ data: phs, error }, { data: cons, error: eCon }] = await Promise.all([
    supabase.from('phu_huynh').select('id, ho_ten, ma_ph').in('id', ids).limit(LIMIT),
    supabase.from('hoc_sinh').select('ho_ten, trang_thai, phu_huynh_id').in('phu_huynh_id', ids).limit(LIMIT),
  ])
  if (error) throw error
  if (eCon) throw eCon
  const phMap = new Map(((phs ?? []) as any[]).map((p) => [p.id, p]))
  const conByPH = new Map<string, { dangHoc: boolean; nghi: string[] }>()
  for (const c of (cons ?? []) as any[]) {
    const cur = conByPH.get(c.phu_huynh_id) ?? { dangHoc: false, nghi: [] as string[] }
    if (c.trang_thai === 'dang_hoc') cur.dangHoc = true
    else if (c.ho_ten) cur.nghi.push(c.ho_ten)
    conByPH.set(c.phu_huynh_id, cur)
  }
  return es
    .map((e) => ({ phu_huynh_id: e.id, ho_ten: phMap.get(e.id)?.ho_ten ?? '(không rõ)', ma_ph: phMap.get(e.id)?.ma_ph ?? '', noKhoiTao: e.noKhoiTao, noHeThong: e.noHeThong, no: e.noKhoiTao + e.noHeThong, coConDangHoc: conByPH.get(e.id)?.dangHoc ?? false, conDaNghi: conByPH.get(e.id)?.nghi ?? [] }))
    .sort((a, b) => b.no - a.no)
}

// ── TÍN DỤNG GIỚI THIỆU (08-01) — người cũ giới thiệu HS mới → trừ vào học phí, trễ 1 tháng, trải đến hết ──
export type TinDung = { id: string; phu_huynh_id: string; hoc_sinh_moi_id: string | null; hoc_sinh_moi_ten: string | null; so_tien: number; hieu_luc_tu: string; mo_ta: string | null }
export async function themTinDung(phuHuynhId: string, hocSinhMoiId: string | null, soTien: number, hieuLucTu: string, moTa: string | null): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('hoc_phi_tin_dung').insert({ phu_huynh_id: phuHuynhId, hoc_sinh_moi_id: hocSinhMoiId, so_tien: Math.round(soTien), hieu_luc_tu: hieuLucTu, mo_ta: moTa, created_by: user?.id ?? null })
  if (error) throw error
}
export async function xoaTinDung(id: string): Promise<void> {
  const { error } = await supabase.from('hoc_phi_tin_dung').delete().eq('id', id)
  if (error) throw error
}
export async function listTinDung(): Promise<(TinDung & { phu_huynh_ten: string | null; ma_ph: string | null })[]> {
  const { data, error } = await supabase.from('hoc_phi_tin_dung')
    .select('id, phu_huynh_id, hoc_sinh_moi_id, so_tien, hieu_luc_tu, mo_ta, hoc_sinh:hoc_sinh_moi_id(ho_ten), phu_huynh:phu_huynh_id(ho_ten, ma_ph)')
    .order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({ id: r.id, phu_huynh_id: r.phu_huynh_id, hoc_sinh_moi_id: r.hoc_sinh_moi_id, hoc_sinh_moi_ten: r.hoc_sinh?.ho_ten ?? null, so_tien: Number(r.so_tien), hieu_luc_tu: String(r.hieu_luc_tu).slice(0, 10), mo_ta: r.mo_ta, phu_huynh_ten: r.phu_huynh?.ho_ten ?? null, ma_ph: r.phu_huynh?.ma_ph ?? null }))
}
// Tín dụng CÒN LẠI theo PH cho kỳ (batch): Σ cấp (hieu_luc_tu ≤ ky) − Σ ĐÃ TRỪ (dòng giam_gioi_thieu ở hoá đơn CHỐT).
export async function tinDungConLaiBatch(phIds: string[], ky: string): Promise<Map<string, number>> {
  const out = new Map<string, number>()
  if (!phIds.length) return out
  const { data: tds, error: e1 } = await supabase.from('hoc_phi_tin_dung').select('phu_huynh_id, so_tien').in('phu_huynh_id', phIds).lte('hieu_luc_tu', ky).limit(LIMIT)
  if (e1) throw e1
  for (const t of (tds ?? []) as any[]) out.set(t.phu_huynh_id, (out.get(t.phu_huynh_id) ?? 0) + Number(t.so_tien))
  if (out.size) {
    // ĐÃ TRỪ = Σ |giam_gioi_thieu| ở hoá đơn ĐÃ CHỐT của PH (dòng âm → cộng trị tuyệt đối).
    const { data: hds } = await supabase.from('hoa_don').select('id, phu_huynh_id').in('phu_huynh_id', [...out.keys()]).not('dong_at', 'is', null).limit(LIMIT)
    const hdPh = new Map(((hds ?? []) as any[]).map((h) => [h.id, h.phu_huynh_id]))
    const hdIds = [...hdPh.keys()]
    if (hdIds.length) {
      const { data: dd } = await supabase.from('hoa_don_dong').select('hoa_don_id, thanh_tien').eq('loai', 'giam_gioi_thieu').in('hoa_don_id', hdIds).limit(LIMIT)
      for (const d of (dd ?? []) as any[]) { const ph = hdPh.get(d.hoa_don_id); if (ph) out.set(ph, (out.get(ph) ?? 0) - Math.abs(Number(d.thanh_tien))) }
    }
  }
  for (const [k, v] of out) out.set(k, Math.max(0, v)) // còn lại ≥ 0
  return out
}

// ── CHỐT KỲ (Ảo→Thật, atomic claim — §7/§266) ───────────────────────────────
export async function tinhSoDuNo(phuHuynhId: string): Promise<number> {
  // Nợ khởi tạo (điền tay) tự cộng vào "nợ kỳ trước" trên phiếu (Thùy 08-01).
  const { data: ph } = await supabase.from('phu_huynh').select('no_khoi_tao').eq('id', phuHuynhId).maybeSingle()
  const khoiTao = Number((ph as { no_khoi_tao?: number } | null)?.no_khoi_tao ?? 0)
  const { data: hds, error: e1 } = await supabase.from('hoa_don').select('id, tong_tien').eq('phu_huynh_id', phuHuynhId).not('dong_at', 'is', null).limit(LIMIT)
  if (e1) throw e1
  const hdIds = (hds ?? []).map((h) => h.id)
  const tongHoaDon = (hds ?? []).reduce((s, h) => s + Number(h.tong_tien), 0)
  let tongDaThu = 0
  if (hdIds.length) {
    const { data: tt, error: e2 } = await supabase.from('thanh_toan').select('so_tien').in('hoa_don_id', hdIds).limit(LIMIT)
    if (e2) throw e2
    tongDaThu = (tt ?? []).reduce((s, t) => s + Number(t.so_tien), 0)
  }
  return khoiTao + tongHoaDon - tongDaThu
}

// HUỶ CHỐT (sửa học phí sau chốt, Thùy 08-01): đưa PH về phiếu ẢO — xoá hoá đơn + dòng + thanh toán + log
// theo thứ tự lá→gốc. Sau đó phiếu tự tính lại theo data/công thức mới → chốt lại.
export async function huyChot(hoaDonId: string): Promise<void> {
  for (const tbl of ['thanh_toan', 'hoa_don_log', 'hoa_don_dong'] as const) {
    const { error } = await supabase.from(tbl).delete().eq('hoa_don_id', hoaDonId)
    if (error) throw error
  }
  const { error } = await supabase.from('hoa_don').delete().eq('id', hoaDonId)
  if (error) throw error
}

export async function getHoaDonByKy(phuHuynhId: string, ky: string): Promise<{ id: string; trang_thai: string; tong_tien: number } | null> {
  const { data, error } = await supabase.from('hoa_don').select('id, trang_thai, tong_tien').eq('phu_huynh_id', phuHuynhId).eq('ky', ky).limit(1)
  if (error) throw error
  return (data as any[])?.[0] ?? null
}
// Dòng hoá đơn ĐÃ CHỐT (đọc lại sau chốt kỳ — snapshot, không tính lại). Join tên con/lớp để hiện giống phiếu ảo.
export async function getHoaDonDong(hoaDonId: string): Promise<DongPhieu[]> {
  const { data, error } = await supabase.from('hoa_don_dong')
    .select('loai, hoc_sinh_id, lop_id, mo_ta, so_luong, don_gia, he_so, thanh_tien, hoc_sinh:hoc_sinh_id(ho_ten), lop:lop_id(ten_lop)')
    .eq('hoa_don_id', hoaDonId).limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({
    loai: r.loai, hoc_sinh_id: r.hoc_sinh_id, hoc_sinh_ten: r.hoc_sinh?.ho_ten, lop_id: r.lop_id, lop_ten: r.lop?.ten_lop,
    mo_ta: r.mo_ta, so_luong: r.so_luong, don_gia: r.don_gia, he_so: r.he_so, thanh_tien: Number(r.thanh_tien),
  }))
}

// Chốt kỳ = đông cứng phiếu ảo thành hoa_don + hoa_don_dong (snapshot). (Bỏ gate xét duyệt 08-01 — CT1/CT2 auto.)
// Atomic: insert hoa_don (unique phu_huynh_id+ky chống chốt trùng — DB tự chặn nếu đã chốt).
export async function chotKy(phuHuynhId: string, ky: string, phatSinh: { mo_ta: string; thanh_tien: number }[] = []): Promise<{ hoaDonId: string; tongTien: number }> {
  const ao = await getPhieuAo(phuHuynhId, ky)
  const dongPhatSinh: DongPhieu[] = phatSinh.map((p) => ({ loai: 'phat_sinh', hoc_sinh_id: null, lop_id: null, mo_ta: p.mo_ta, so_luong: null, don_gia: null, he_so: null, thanh_tien: p.thanh_tien }))
  const allDong = [...ao.dong, ...dongPhatSinh]
  const tongTien = allDong.reduce((s, d) => s + d.thanh_tien, 0)

  const { data: { user } } = await supabase.auth.getUser()
  const { data: hd, error: e1 } = await supabase.from('hoa_don').insert({
    phu_huynh_id: phuHuynhId, ky, trang_thai: 'chua_thu', tong_tien: tongTien, dong_at: new Date().toISOString(), created_by: user?.id ?? null,
  }).select().single()
  if (e1) throw e1 // unique (phu_huynh_id, ky) tự chặn chốt 2 lần
  const hoaDon = hd as { id: string }
  const rows = allDong.map((d) => ({
    hoa_don_id: hoaDon.id, loai: d.loai, hoc_sinh_id: d.hoc_sinh_id, lop_id: d.lop_id, mo_ta: d.mo_ta,
    so_luong: d.so_luong, don_gia: d.don_gia, he_so: d.he_so, thanh_tien: d.thanh_tien,
    snapshot: { so_buoi: d.so_luong, don_gia: d.don_gia, he_so: d.he_so },
  }))
  const { error: e2 } = await supabase.from('hoa_don_dong').insert(rows)
  if (e2) throw e2
  return { hoaDonId: hoaDon.id, tongTien }
}

// ── THANH TOÁN & NỢ (§9) ─────────────────────────────────────────────────────
export type ThanhToan = { id: string; hoa_don_id: string; so_tien: number; ngay: string; phuong_thuc: string | null; ghi_chu: string | null; created_at?: string }
// §2.0 (30/08): client CHỈ ghi dòng thanh toán — trạng thái phiếu (chua_thu/thu_mot_phan/
// da_thu) do TRIGGER tg_thanh_toan_trang_thai suy từ Σ thanh_toan NGAY TRONG transaction.
// Bản cũ đọc-cộng-suy-update ở client: 2 tab thu tiền song song là đè trạng thái của nhau.
export async function ghiThanhToan(hoaDonId: string, soTien: number, opts?: { ngay?: string; phuongThuc?: string; ghiChu?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('thanh_toan').insert({
    hoa_don_id: hoaDonId, so_tien: soTien, ngay: opts?.ngay ?? new Date().toISOString().slice(0, 10),
    phuong_thuc: opts?.phuongThuc ?? null, ghi_chu: opts?.ghiChu ?? null, nguoi_thu: user?.id ?? null,
  })
  if (error) throw error
}
export async function listThanhToan(hoaDonId: string): Promise<ThanhToan[]> {
  const { data, error } = await supabase.from('thanh_toan').select('*').eq('hoa_don_id', hoaDonId).order('ngay', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as ThanhToan[]
}

// ── DANH SÁCH PHỤ HUYNH (để chọn phiếu) — chỉ PH có con đang học ────────────
export type PHOpt = { id: string; ho_ten: string; ma_ph: string; soCon: number; tenCon: string[] }
export async function listPhuHuynhCoConDangHoc(): Promise<PHOpt[]> {
  const { data, error } = await supabase.from('hoc_sinh').select('ho_ten, phu_huynh:phu_huynh_id(id, ho_ten, ma_ph)').eq('trang_thai', 'dang_hoc').not('phu_huynh_id', 'is', null).order('ho_ten').limit(LIMIT)
  if (error) throw error
  const byPH = new Map<string, PHOpt>()
  for (const r of (data ?? []) as any[]) {
    const ph = r.phu_huynh; if (!ph) continue
    const cur = byPH.get(ph.id) ?? { id: ph.id, ho_ten: ph.ho_ten, ma_ph: ph.ma_ph, soCon: 0, tenCon: [] as string[] }
    cur.soCon++; if (r.ho_ten) cur.tenCon.push(r.ho_ten) // tên con để hiện + search theo tên HS ra PH
    byPH.set(ph.id, cur)
  }
  return [...byPH.values()].sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi'))
}

// Danh sách PH để NHẬP NỢ KHỞI TẠO (nợ cũ trước khi có ERP) — GỒM cả PH có con đã nghỉ hết.
// KHÁC listPhuHuynhCoConDangHoc (chỉ dang_hoc, cho luồng chốt kỳ HS đang học): ở đây HS đã nghỉ vẫn
// nợ học phí cũ nên PH phải chọn được để ghi nợ. Tên con NGHỈ được đánh dấu "(đã nghỉ)"; coConDangHoc=false
// khi PH không còn con nào đang học (để UI gắn nhãn rõ — Thùy 08-03).
export type PHNoOpt = PHOpt & { coConDangHoc: boolean }
export async function listPhuHuynhChoNo(): Promise<PHNoOpt[]> {
  const { data, error } = await supabase.from('hoc_sinh').select('ho_ten, trang_thai, phu_huynh:phu_huynh_id(id, ho_ten, ma_ph)').not('phu_huynh_id', 'is', null).order('ho_ten').limit(LIMIT)
  if (error) throw error
  const byPH = new Map<string, PHNoOpt>()
  for (const r of (data ?? []) as any[]) {
    const ph = r.phu_huynh; if (!ph) continue
    const cur = byPH.get(ph.id) ?? { id: ph.id, ho_ten: ph.ho_ten, ma_ph: ph.ma_ph, soCon: 0, tenCon: [] as string[], coConDangHoc: false }
    cur.soCon++
    if (r.ho_ten) cur.tenCon.push(r.trang_thai === 'dang_hoc' ? r.ho_ten : `${r.ho_ten} (đã nghỉ)`)
    if (r.trang_thai === 'dang_hoc') cur.coConDangHoc = true
    byPH.set(ph.id, cur)
  }
  return [...byPH.values()].sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi'))
}

// Đã chốt phiếu tháng này chưa (cho danh sách tổng quan) — bulk theo mọi PH.
export async function listHoaDonByKy(ky: string): Promise<{ id: string; phu_huynh_id: string; trang_thai: string; tong_tien: number; trang_thai_tb: TrangThaiTB; bao_lan1_at: string | null }[]> {
  const { data, error } = await supabase.from('hoa_don').select('id, phu_huynh_id, trang_thai, tong_tien, trang_thai_tb, bao_lan1_at').eq('ky', ky).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as any[]
}
// Đánh dấu "Đã báo (lần 1)" — set mốc thời gian để tính cảnh báo quá-3-ngày (task 3, 08-01).
export async function danhDauDaBao(hoaDonId: string): Promise<void> {
  const { error } = await supabase.from('hoa_don').update({ bao_lan1_at: new Date().toISOString() }).eq('id', hoaDonId)
  if (error) throw error
}

// ── TRẠNG THÁI THÔNG BÁO thu học phí — 3 bước, "Xong" tự nhảy bước kế (Thùy 07-05) ──
// Mỗi bước có sẵn nội dung copy-paste gửi PH — Nhân sự không phải nghĩ chữ, chỉ Copy → dán gửi.
export type TrangThaiTB = 'thong_bao_1' | 'cho_xu_ly' | 'hoan_thanh'
export const TRANG_THAI_TB_LABEL: Record<TrangThaiTB, string> = { thong_bao_1: 'Đã thông báo lần 1', cho_xu_ly: 'Chưa nộp — đang xử lý', hoan_thanh: 'Đã hoàn thành' }
const TRANG_THAI_TB_KE_TIEP: Record<TrangThaiTB, TrangThaiTB | null> = { thong_bao_1: 'cho_xu_ly', cho_xu_ly: 'hoan_thanh', hoan_thanh: null }
export function trangThaiTBKeTiep(t: TrangThaiTB): TrangThaiTB | null { return TRANG_THAI_TB_KE_TIEP[t] }
export async function capNhatTrangThaiTB(hoaDonId: string, trangThai: TrangThaiTB): Promise<void> {
  const { error } = await supabase.from('hoa_don').update({ trang_thai_tb: trangThai }).eq('id', hoaDonId)
  if (error) throw error
}
// Tên các con ĐANG HỌC của 1 PH — ghép câu "HS A và HS B" cho nội dung thông báo.
export async function layTenConDangHoc(phuHuynhId: string): Promise<string[]> {
  const { data, error } = await supabase.from('hoc_sinh').select('ho_ten').eq('phu_huynh_id', phuHuynhId).eq('trang_thai', 'dang_hoc').order('ho_ten').limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as { ho_ten: string }[]).map((r) => r.ho_ten)
}
function ghepTenCon(tenCon: string[]): string {
  if (tenCon.length <= 1) return tenCon[0] ?? 'con'
  return tenCon.slice(0, -1).join(', ') + ' và ' + tenCon[tenCon.length - 1]
}
// Nội dung thông báo THEO BƯỚC — soạn sẵn, Nhân sự chỉ Copy → dán gửi PH (Thùy 07-05).
export function soanThongBao(trangThai: TrangThaiTB, tenCon: string[], ky: string, tongTien: number): string {
  const thang = Number(ky.slice(5, 7))
  const ds = ghepTenCon(tenCon)
  const tien = tienVN(tongTien)
  if (trangThai === 'thong_bao_1') return `Trung tâm thông báo học phí tháng ${thang} của ${ds} là ${tien}. Quý phụ huynh vui lòng thanh toán giúp trung tâm trong tuần này ạ. Trân trọng cảm ơn!`
  if (trangThai === 'cho_xu_ly') return `Hiện tại trung tâm chưa nhận được học phí tháng ${thang} của ${ds}, bố mẹ giúp trung tâm kiểm tra lại giúp ạ. Trân trọng cảm ơn!`
  return `Trung tâm xác nhận đã nhận đủ học phí tháng ${thang} của ${ds}. Cảm ơn quý phụ huynh đã đồng hành cùng trung tâm!`
}

// Tạm tính TÁCH RIÊNG học chính (học phí+học liệu+phát sinh) và học đuổi cho MỌI PH cùng lúc —
// batch-query như listHocPhiTheoHocSinhVaMon (không N+1 per PH). 2 khoản này là 2 luồng billing
// KHÁC NHAU (Thùy 07-05: "1 tab riêng Học phí bổ trợ đuổi, danh sách kia là Học phí học chính").
// KHÔNG gồm nợ kỳ trước và phát sinh TAY nhập ngay lúc chốt (2 cái đó chỉ tính chính xác ở "Phiếu").
async function tinhTamTinhTheoPH(ky: string): Promise<{ chinh: Map<string, number>; duoi: Map<string, number> }> {
  const { kyStart, kyEnd } = kyRange(ky)
  const tongByHS = new Map<string, number>()
  const duoiByHS = new Map<string, number>()
  const hsPhMap = new Map<string, string>() // hoc_sinh_id -> phu_huynh_id

  const { data: hsRows, error: e0 } = await supabase.from('hoc_sinh').select('id, phu_huynh_id, he_so_hoc_phi').eq('trang_thai', 'dang_hoc').limit(LIMIT)
  if (e0) throw e0
  const hsIds = (hsRows ?? []).map((r: any) => r.id as string)
  for (const r of (hsRows ?? []) as any[]) if (r.phu_huynh_id) hsPhMap.set(r.id, r.phu_huynh_id)
  if (!hsIds.length) return { chinh: new Map(), duoi: new Map() }
  const heSoById = new Map((hsRows ?? []).map((r: any) => [r.id, Number(r.he_so_hoc_phi)]))
  const them = (hocSinhId: string, tien: number) => tongByHS.set(hocSinhId, (tongByHS.get(hocSinhId) ?? 0) + tien)
  const themDuoi = (hocSinhId: string, tien: number) => duoiByHS.set(hocSinhId, (duoiByHS.get(hocSinhId) ?? 0) + tien)

  // học phí + học liệu (batch giống listHocPhiTheoHocSinhVaMon)
  const hsl = await selectByIdsBatched(hsIds, (batch) =>
    supabase.from('hoc_sinh_lop')
      .select('hoc_sinh_id, lop_id, ngay_vao, ngay_roi, lop:lop_id(muc_hoc_phi_id, muc_hoc_lieu_id)').in('hoc_sinh_id', batch).limit(LIMIT))
  const lopIds = [...new Set(hsl.map((r: any) => r.lop_id).filter(Boolean))]
  const buoiRows = lopIds.length
    ? await selectByIdsBatched(lopIds, (batch) =>
        supabase.from('buoi_hoc').select('lop_id, ngay').in('lop_id', batch).neq('loai', 'bu').in('trang_thai', ['mo', 'hoan_tat']).gte('ngay', kyStart).lt('ngay', kyEnd).limit(LIMIT))
    : []
  const buoiByLop = new Map<string, { ngay: string }[]>()
  for (const b of buoiRows as any[]) { const a = buoiByLop.get(b.lop_id) ?? []; a.push(b); buoiByLop.set(b.lop_id, a) }
  const mucPhiIds = [...new Set(hsl.map((r: any) => r.lop?.muc_hoc_phi_id).filter(Boolean))]
  const mucLieuIds = [...new Set((hsl ?? []).map((r: any) => r.lop?.muc_hoc_lieu_id).filter(Boolean))]
  const [{ data: mucPhiRows }, { data: mucLieuRows }] = await Promise.all([
    mucPhiIds.length ? supabase.from('muc_hoc_phi').select('*').in('id', mucPhiIds).limit(LIMIT) : Promise.resolve({ data: [] as MucHocPhi[] }),
    mucLieuIds.length ? supabase.from('muc_hoc_lieu').select('*').in('id', mucLieuIds).limit(LIMIT) : Promise.resolve({ data: [] as MucHocLieu[] }),
  ])
  const mucPhiById = new Map(((mucPhiRows ?? []) as MucHocPhi[]).map((m) => [m.id, m]))
  const mucLieuById = new Map(((mucLieuRows ?? []) as MucHocLieu[]).map((m) => [m.id, m]))
  const lopIdsHieuLucByHS = new Map<string, string[]>() // hoc_sinh_id -> lop_id[] (ghi danh hiệu lực trong kỳ) — cho phát sinh theo lớp
  for (const enroll of (hsl ?? []) as any[]) {
    if (enroll.ngay_vao && enroll.ngay_vao >= kyEnd) continue
    if (enroll.ngay_roi && enroll.ngay_roi < kyStart) continue
    const arr = lopIdsHieuLucByHS.get(enroll.hoc_sinh_id) ?? []; arr.push(enroll.lop_id); lopIdsHieuLucByHS.set(enroll.hoc_sinh_id, arr)
    const heSo = heSoById.get(enroll.hoc_sinh_id) ?? 1
    let coHocPhi = false
    if (enroll.lop?.muc_hoc_phi_id) {
      const muc = mucPhiById.get(enroll.lop.muc_hoc_phi_id)
      if (muc) {
        const inWindow = (ngay: string) => (!enroll.ngay_vao || ngay >= enroll.ngay_vao) && (!enroll.ngay_roi || ngay <= enroll.ngay_roi)
        const soBuoi = (buoiByLop.get(enroll.lop_id) ?? []).filter((b) => inWindow(b.ngay)).length
        if (soBuoi > 0) { coHocPhi = true; them(enroll.hoc_sinh_id, thanhTienHocPhi(muc.don_gia_buoi, soBuoi, heSo)) }
      }
    }
    // Học liệu CHỈ tính khi tháng đó thật sự có học phí — chưa phát sinh học phí thì KHÔNG mặc định
    // thu học liệu (Thùy 07-05), khớp quy tắc trong getPhieuAo.
    if (coHocPhi && enroll.lop?.muc_hoc_lieu_id) {
      const mucLieu = mucLieuById.get(enroll.lop.muc_hoc_lieu_id)
      if (mucLieu) them(enroll.hoc_sinh_id, mucLieu.gia)
    }
  }

  // học đuổi (batch): buổi loai='bo_tro_duoi', co_mat, trong kỳ — giá theo mức CỦA CA (buoi_hoc.muc_hoc_duoi_id).
  const bhhDuoi = await selectByIdsBatched(hsIds, (batch) =>
    supabase.from('buoi_hoc_hs')
      .select('hoc_sinh_id, diem_danh, buoi:buoi_hoc_id!inner(ngay, loai, muc_hoc_duoi_id)')
      .in('hoc_sinh_id', batch).eq('diem_danh', 'co_mat').eq('buoi.loai', 'bo_tro_duoi').gte('buoi.ngay', kyStart).lt('buoi.ngay', kyEnd).limit(LIMIT))
  const countByHSMuc = new Map<string, number>() // `${hocSinhId}|${mucId}` -> soBuoi
  for (const r of bhhDuoi as any[]) {
    const mucId = r.buoi?.muc_hoc_duoi_id; if (!mucId) continue
    const key = `${r.hoc_sinh_id}|${mucId}`
    countByHSMuc.set(key, (countByHSMuc.get(key) ?? 0) + 1)
  }
  if (countByHSMuc.size) {
    const mucDuoiIds = [...new Set([...countByHSMuc.keys()].map((k) => k.split('|')[1]))]
    const { data: mucDuoiRows } = await supabase.from('muc_hoc_duoi').select('*').in('id', mucDuoiIds).limit(LIMIT)
    const mucDuoiById = new Map(((mucDuoiRows ?? []) as MucHocDuoi[]).map((m) => [m.id, m]))
    for (const [key, soBuoi] of countByHSMuc) {
      const [hocSinhId, mucId] = key.split('|')
      const muc = mucDuoiById.get(mucId); if (!muc) continue
      themDuoi(hocSinhId, thanhTienHocDuoi(muc.gia, soBuoi))
    }
  }

  // Chi phí phát sinh (batch, 1 query cho CẢ kỳ) — cá nhân cộng thẳng vào HS; theo lớp cộng cho MỌI
  // HS đang ghi danh hiệu lực lớp đó trong kỳ (Thùy 07-05, khớp getPhieuAo).
  const { data: phatSinhRows, error: e4 } = await supabase.from('hoc_phi_phat_sinh').select('loai, lop_id, hoc_sinh_id, so_tien').eq('ky', ky).limit(LIMIT)
  if (e4) throw e4
  for (const p of (phatSinhRows ?? []) as any[]) {
    const soTien = Number(p.so_tien)
    if (p.loai === 'ca_nhan' && p.hoc_sinh_id) them(p.hoc_sinh_id, soTien)
    else if (p.loai === 'lop' && p.lop_id) {
      for (const [hocSinhId, lopIds] of lopIdsHieuLucByHS) if (lopIds.includes(p.lop_id)) them(hocSinhId, soTien)
    }
  }

  const chinhByPH = new Map<string, number>()
  for (const [hocSinhId, tien] of tongByHS) {
    const phId = hsPhMap.get(hocSinhId); if (!phId) continue
    chinhByPH.set(phId, (chinhByPH.get(phId) ?? 0) + tien)
  }
  const duoiByPH = new Map<string, number>()
  for (const [hocSinhId, tien] of duoiByHS) {
    const phId = hsPhMap.get(hocSinhId); if (!phId) continue
    duoiByPH.set(phId, (duoiByPH.get(phId) ?? 0) + tien)
  }
  return { chinh: chinhByPH, duoi: duoiByPH }
}

// ── DANH SÁCH TỔNG (bulk, cho màn quản lý + xuất ảnh/PDF thông báo PH) ──────
// Nhẹ: dùng hoa_don đã chốt cho tiền đã CHỐT; PH CHƯA chốt hiện TẠM TÍNH (batch, không N+1 — Thùy 07-05).
// Số tạm tính KHÔNG gồm nợ kỳ trước/phát sinh tay — số cuối cùng để thu tiền vẫn lấy ở "Phiếu" (getPhieuAo).
export type DongSoHang = {
  phu_huynh_id: string; ho_ten: string; ma_ph: string; soCon: number; tenCon: string[]; daChot: boolean; tongTien: number | null; trangThai: string | null
  tienChinh: number; tienDuoi: number; tienNo: number // breakdown TẠM TÍNH (chưa chốt); chốt rồi thì xem chi tiết hoá đơn
  dong: DongPhieu[] // CHI TIẾT từng dòng (như phiếu) — chưa chốt: batch tính; chốt: hoa_don_dong
  hoaDonId: string | null; trangThaiTB: TrangThaiTB | null; baoLan1At: string | null; daThuKy: number
}
// Chi tiết từng dòng theo PH (BATCH, không N+1) — để card hiện ĐỦ như phiếu. Nguồn = listHocPhiTheoMonV2
// (CT1/CT2 + bù, KHỚP getPhieuAo) + phát sinh. KHÔNG gồm nợ (nợ thêm ở listPhieuTheoKy).
export async function listChiTietTheoPH(ky: string): Promise<Map<string, DongPhieu[]>> {
  const rows = await listHocPhiTheoMonV2(ky)
  const hsIds = [...new Set(rows.map((r) => r.hoc_sinh_id))]
  const phOf = new Map<string, string>(); const tenOf = new Map<string, string>()
  if (hsIds.length) {
    const { data } = await supabase.from('hoc_sinh').select('id, ho_ten, phu_huynh_id').in('id', hsIds).limit(LIMIT)
    for (const h of (data ?? []) as any[]) { if (h.phu_huynh_id) phOf.set(h.id, h.phu_huynh_id); tenOf.set(h.id, h.ho_ten) }
  }
  const out = new Map<string, DongPhieu[]>()
  const push = (phId: string, d: DongPhieu) => { const a = out.get(phId) ?? []; a.push(d); out.set(phId, a) }
  for (const r of rows) {
    const phId = phOf.get(r.hoc_sinh_id); if (!phId) continue
    const ct = r.congThucChon ?? r.congThucDeXuat
    const soBuoiTinh = ct === 'ct2' ? r.soBuoiDiHoc + r.soBuoiBu : r.soBuoiLop
    if (r.tienHocChinh > 0) push(phId, { loai: 'hoc_phi', hoc_sinh_id: r.hoc_sinh_id, hoc_sinh_ten: r.hoc_sinh_ten, lop_id: r.lop_id || null, lop_ten: r.lop_ten, so_luong: soBuoiTinh, don_gia: r.donGia, he_so: r.heSo, thanh_tien: r.tienHocChinh, mo_ta: r.soBuoiBu > 0 ? `gồm ${r.soBuoiBu} bù (${r.soBuoiBuDaHoc} đã bù${r.soBuoiBuDaXep ? `, ${r.soBuoiBuDaXep} đã xếp` : ''})` : null })
    if (r.tienHocLieu > 0) push(phId, { loai: 'hoc_lieu', hoc_sinh_id: r.hoc_sinh_id, hoc_sinh_ten: r.hoc_sinh_ten, lop_id: r.lop_id || null, lop_ten: r.lop_ten, so_luong: 1, don_gia: r.tienHocLieu, he_so: null, thanh_tien: r.tienHocLieu, mo_ta: r.hocLieuTen })
    if (r.tienDuoi > 0) push(phId, { loai: 'hoc_duoi', hoc_sinh_id: r.hoc_sinh_id, hoc_sinh_ten: r.hoc_sinh_ten, lop_id: r.lop_id || null, lop_ten: r.lop_ten, so_luong: r.soBuoiDuoi, don_gia: null, he_so: null, thanh_tien: r.tienDuoi, mo_ta: `${r.soBuoiDuoi} buổi đuổi` })
  }
  const { data: psRows } = await supabase.from('hoc_phi_phat_sinh').select('loai, lop_id, hoc_sinh_id, mo_ta, so_tien').eq('ky', ky).limit(LIMIT)
  // HS có phát sinh CÁ NHÂN nhưng KHÔNG ghi danh trong kỳ (vd đã nghỉ trước kỳ) → resolve PH+tên để không sót.
  const psThieu = [...new Set((psRows ?? []).filter((p: any) => p.loai === 'ca_nhan' && p.hoc_sinh_id && !phOf.has(p.hoc_sinh_id)).map((p: any) => p.hoc_sinh_id as string))]
  if (psThieu.length) {
    const { data: mh } = await supabase.from('hoc_sinh').select('id, ho_ten, phu_huynh_id').in('id', psThieu).limit(LIMIT)
    for (const h of (mh ?? []) as any[]) { if (h.phu_huynh_id) phOf.set(h.id, h.phu_huynh_id); tenOf.set(h.id, h.ho_ten) }
  }
  for (const ps of (psRows ?? []) as any[]) {
    const so = Number(ps.so_tien)
    if (ps.loai === 'ca_nhan' && ps.hoc_sinh_id) { const phId = phOf.get(ps.hoc_sinh_id); if (phId) push(phId, { loai: 'phat_sinh', hoc_sinh_id: ps.hoc_sinh_id, hoc_sinh_ten: tenOf.get(ps.hoc_sinh_id), lop_id: null, so_luong: null, don_gia: null, he_so: null, thanh_tien: so, mo_ta: ps.mo_ta }) }
    else if (ps.loai === 'lop' && ps.lop_id) { for (const r of rows) if (r.lop_id === ps.lop_id) { const phId = phOf.get(r.hoc_sinh_id); if (phId) push(phId, { loai: 'phat_sinh', hoc_sinh_id: r.hoc_sinh_id, hoc_sinh_ten: r.hoc_sinh_ten, lop_id: r.lop_id || null, lop_ten: r.lop_ten, so_luong: null, don_gia: null, he_so: null, thanh_tien: so, mo_ta: ps.mo_ta }) } }
  }
  return out
}
export async function listPhieuTheoKy(ky: string): Promise<DongSoHang[]> {
  const [allPH, hds, chiTiet, noByPH] = await Promise.all([listPhuHuynhChoNo(), listHoaDonByKy(ky), listChiTietTheoPH(ky), soDuNoTheoPH()])
  // Tập PH của kỳ = (còn con đang học) ∪ (PHÁT SINH phí kỳ này — kể cả con NGHỈ giữa tháng) ∪ (đã có
  // hoá đơn) ∪ (đang nợ). KHÔNG chỉ "con đang học": HS nghỉ giữa tháng vẫn phải hiện học phí đã phát sinh.
  const relevant = new Set<string>()
  for (const p of allPH) if (p.coConDangHoc) relevant.add(p.id)
  for (const id of chiTiet.keys()) relevant.add(id)
  for (const h of hds) relevant.add(h.phu_huynh_id)
  for (const [id, no] of noByPH) if ((no ?? 0) > 0) relevant.add(id)
  const phById = new Map(allPH.map((p) => [p.id, p]))
  const phs = [...relevant].map((id) => phById.get(id)).filter(Boolean) as PHOpt[]
  const tinDungConLai = await tinDungConLaiBatch(phs.map((p) => p.id), ky) // tín dụng giới thiệu còn lại theo PH
  const hdMap = new Map(hds.map((h) => [h.phu_huynh_id, h]))
  const hdIds = hds.map((h) => h.id)
  const hdToPh = new Map(hds.map((h) => [h.id, h.phu_huynh_id]))
  // Batch: đã thu + DÒNG hoá đơn ĐÃ CHỐT (hiện chi tiết cho card chốt).
  const daThuByPH = new Map<string, number>()
  const dongChotByPH = new Map<string, DongPhieu[]>()
  if (hdIds.length) {
    const [{ data: tts }, { data: dd }] = await Promise.all([
      supabase.from('thanh_toan').select('hoa_don_id, so_tien').in('hoa_don_id', hdIds).limit(LIMIT),
      supabase.from('hoa_don_dong').select('hoa_don_id, loai, hoc_sinh_id, lop_id, mo_ta, so_luong, don_gia, he_so, thanh_tien, hoc_sinh:hoc_sinh_id(ho_ten), lop:lop_id(ten_lop)').in('hoa_don_id', hdIds).limit(LIMIT),
    ])
    for (const t of (tts ?? []) as any[]) { const ph = hdToPh.get(t.hoa_don_id); if (ph) daThuByPH.set(ph, (daThuByPH.get(ph) ?? 0) + Number(t.so_tien)) }
    for (const d of (dd ?? []) as any[]) { const ph = hdToPh.get(d.hoa_don_id); if (!ph) continue; const a = dongChotByPH.get(ph) ?? []; a.push({ loai: d.loai, hoc_sinh_id: d.hoc_sinh_id, hoc_sinh_ten: d.hoc_sinh?.ho_ten, lop_id: d.lop_id, lop_ten: d.lop?.ten_lop, mo_ta: d.mo_ta, so_luong: d.so_luong, don_gia: d.don_gia, he_so: d.he_so, thanh_tien: Number(d.thanh_tien) }); dongChotByPH.set(ph, a) }
  }
  const rows = phs.map((p) => {
    const hd = hdMap.get(p.id)
    const ct = chiTiet.get(p.id) ?? []
    const chinh = ct.filter((d) => d.loai !== 'hoc_duoi').reduce((s, d) => s + d.thanh_tien, 0) // học phí + liệu + phát sinh
    const duoi = ct.filter((d) => d.loai === 'hoc_duoi').reduce((s, d) => s + d.thanh_tien, 0)
    const no = Math.max(0, noByPH.get(p.id) ?? 0)
    // Giảm giới thiệu: trừ vào HỌC PHÍ tháng này (chinh + đuổi), tối đa = số học phí; dư dồn sang tháng sau.
    const giam = Math.min(tinDungConLai.get(p.id) ?? 0, Math.max(0, chinh + duoi))
    const dongAo = [...ct]
    if (no > 0) dongAo.push({ loai: 'no_ky_truoc', hoc_sinh_id: null, lop_id: null, mo_ta: null, so_luong: null, don_gia: null, he_so: null, thanh_tien: Math.round(no) })
    if (giam > 0) dongAo.push({ loai: 'giam_gioi_thieu', hoc_sinh_id: null, lop_id: null, mo_ta: 'Giảm giới thiệu', so_luong: null, don_gia: null, he_so: null, thanh_tien: -Math.round(giam) })
    return {
      phu_huynh_id: p.id, ho_ten: p.ho_ten, ma_ph: p.ma_ph, soCon: p.soCon, tenCon: p.tenCon, daChot: !!hd,
      tongTien: hd ? Number(hd.tong_tien) : chinh + duoi + no - giam, trangThai: hd?.trang_thai ?? null,
      tienChinh: chinh, tienDuoi: duoi, tienNo: no,
      dong: hd ? (dongChotByPH.get(p.id) ?? []) : dongAo, // chốt → dòng hoá đơn thật; chưa chốt → tính batch + nợ
      hoaDonId: hd?.id ?? null, trangThaiTB: hd?.trang_thai_tb ?? null, baoLan1At: hd?.bao_lan1_at ?? null, daThuKy: daThuByPH.get(p.id) ?? 0,
    }
  })
  // PH học phí = 0đ (chưa phát sinh gì trong kỳ) → đẩy XUỐNG CUỐI, không lẫn với PH có phí cần xử lý (Thùy 07-05).
  return rows.sort((a, b) => {
    const zeroA = (a.tongTien ?? 0) === 0 ? 1 : 0, zeroB = (b.tongTien ?? 0) === 0 ? 1 : 0
    if (zeroA !== zeroB) return zeroA - zeroB
    return a.ho_ten.localeCompare(b.ho_ten, 'vi')
  })
}

// ── DANH SÁCH RIÊNG: HỌC PHÍ BỔ TRỢ ĐUỔI (Thùy 07-05: luồng billing KHÁC học chính, tách tab) ──
// Đuổi KHÔNG có chốt kỳ riêng (vẫn nằm chung hoá đơn khi chốt) — tab này CHỈ để xem/đối chiếu
// PH nào đang có con học đuổi trong kỳ và tổng tiền đuổi bao nhiêu, tính tạm luôn (không N+1).
export type DongDuoiSoHang = { phu_huynh_id: string; ho_ten: string; ma_ph: string; tongTienDuoi: number }
export async function listDuoiTheoKy(ky: string): Promise<DongDuoiSoHang[]> {
  const [phs, tamTinh] = await Promise.all([listPhuHuynhCoConDangHoc(), tinhTamTinhTheoPH(ky)])
  return phs
    .map((p) => ({ phu_huynh_id: p.id, ho_ten: p.ho_ten, ma_ph: p.ma_ph, tongTienDuoi: tamTinh.duoi.get(p.id) ?? 0 }))
    .filter((r) => r.tongTienDuoi > 0)
    .sort((a, b) => b.tongTienDuoi - a.tongTienDuoi)
}

// ── MA TRẬN ĐIỂM DANH THEO LỚP (tab "Điểm danh" — Thùy 07-13: OPS view nhanh cả lớp) ─────────
// Cột = buổi (ngày) của lớp trong kỳ · hàng = HS · ô = co_mat/vang/(chưa điểm danh).
export type DiemDanhLop = {
  buois: { id: string; ngay: string }[]
  hs: { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; dd: Record<string, string | null> }[] // dd[buoiId]
}
export async function getDiemDanhTheoLop(lopId: string, ky: string): Promise<DiemDanhLop> {
  const { kyStart, kyEnd } = kyRange(ky)
  const [{ data: buois, error: e1 }, { data: roster, error: e2 }] = await Promise.all([
    supabase.from('buoi_hoc').select('id, ngay').eq('lop_id', lopId).neq('loai', 'bu').in('trang_thai', ['mo', 'hoan_tat']).gte('ngay', kyStart).lt('ngay', kyEnd).order('ngay').limit(LIMIT),
    supabase.from('hoc_sinh_lop').select('hoc_sinh_id, ngay_vao, ngay_roi, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs)').eq('lop_id', lopId).limit(LIMIT),
  ])
  if (e1) throw e1
  if (e2) throw e2
  const buoiIds = (buois ?? []).map((b: any) => b.id)
  const ddByHS = new Map<string, Record<string, string | null>>()
  if (buoiIds.length) {
    const { data: bhh, error: e3 } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id, buoi_hoc_id, diem_danh').in('buoi_hoc_id', buoiIds).limit(LIMIT)
    if (e3) throw e3
    for (const r of (bhh ?? []) as any[]) {
      const m = ddByHS.get(r.hoc_sinh_id) ?? {}
      m[r.buoi_hoc_id] = r.diem_danh; ddByHS.set(r.hoc_sinh_id, m)
    }
  }
  // HS từng ghi danh lớp — window giao với kỳ (HS rời trước kỳ không hiện; đang học/rời trong kỳ hiện).
  const hs = ((roster ?? []) as any[])
    .filter((r) => (!r.ngay_vao || r.ngay_vao < kyEnd) && (!r.ngay_roi || r.ngay_roi >= kyStart))
    .map((r) => ({ hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null, dd: ddByHS.get(r.hoc_sinh_id) ?? {} }))
    .sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi'))
  return { buois: (buois ?? []) as any[], hs }
}

// ── BẢNG HS × MÔN ĐỜI 2 (Thùy 07-13) — mỗi dòng 1 HS × lớp với ĐỦ vận hành + công thức ────────
// Thùy: "cột PH/Đơn giá/Hệ số không quan trọng — cái cần là: lớp học mấy buổi / nghỉ mấy / bù mấy /
// học đuổi / thành tiền + cột CÔNG THỨC (hệ đề xuất, người dùng chọn lại) + Detail popup".
// Công thức tổng quát: Học phí = Học phí CHÍNH (ct1/ct2) + Học phí BỔ TRỢ ĐUỔI + Phí TÀI LIỆU.
export type CongThuc = 'ct1' | 'ct2'
export type DongTheoMonV2 = {
  hoc_sinh_id: string; hoc_sinh_ten: string; ma_hs: string | null
  lop_id: string; lop_ten: string; mon: string
  soBuoiLop: number; soBuoiNghi: number; soBuoiDiHoc: number; soBuoiBu: number; soBuoiBuDaHoc: number; soBuoiBuDaXep: number; soBuoiDuoi: number
  donGia: number; heSo: number
  congThucDeXuat: CongThuc; congThucChon: CongThuc | null // null = theo đề xuất (không có dòng trong hoc_phi_cong_thuc)
  tienHocChinh: number; tienDuoi: number; tienHocLieu: number; thanhTien: number
  hocLieuTen: string | null
  ngayDiHoc: string[]; ngayNghi: string[]; ngayBu: string[]; ngayDuoi: string[]
}
// Toàn bộ join/tính (bù theo buổi gốc, CT1/CT2, hệ số hiệu lực, dedupe học liệu theo môn) chạy TRONG
// Postgres qua RPC `hoc_phi_theo_mon_ky` (migration 202608271637) — client chỉ gọi + map tên cột.
// Trước đây hàm này kéo hết hoc_sinh_lop/buoi_hoc/buoi_hoc_hs toàn trường về rồi tự chia lô 60 + join
// bằng vòng lặp TUẦN TỰ (đo thật: >2 phút cho 319 HS, scale gần bậc 2 theo sĩ số). Đã parity-test so
// với bản JS cũ trên toàn bộ 426 dòng thật + đối chiếu chéo getPhieuAo cho các ca bù/đuổi/CT2/multi-môn.
export async function listHocPhiTheoMonV2(ky: string): Promise<DongTheoMonV2[]> {
  const { data, error } = await supabase.rpc('hoc_phi_theo_mon_ky', { p_ky: ky })
  if (error) throw error
  const out: DongTheoMonV2[] = ((data ?? []) as any[]).map((r) => ({
    hoc_sinh_id: r.hoc_sinh_id, hoc_sinh_ten: r.hoc_sinh_ten, ma_hs: r.ma_hs ?? null,
    lop_id: r.lop_id ?? '', lop_ten: r.ten_lop ?? '', mon: r.mon ?? '',
    soBuoiLop: r.so_buoi_lop, soBuoiNghi: r.so_buoi_nghi, soBuoiDiHoc: r.so_buoi_di_hoc,
    soBuoiBu: r.so_buoi_bu, soBuoiBuDaHoc: r.so_buoi_bu_da_hoc, soBuoiBuDaXep: r.so_buoi_bu_da_xep, soBuoiDuoi: r.so_buoi_duoi,
    donGia: Number(r.don_gia), heSo: Number(r.he_so),
    congThucDeXuat: r.cong_thuc_de_xuat, congThucChon: r.cong_thuc_chon,
    tienHocChinh: Number(r.tien_hoc_chinh), tienDuoi: Number(r.tien_duoi), tienHocLieu: Number(r.tien_hoc_lieu), thanhTien: Number(r.thanh_tien),
    hocLieuTen: r.hoc_lieu_ten ?? null,
    ngayDiHoc: r.ngay_di_hoc ?? [], ngayNghi: r.ngay_nghi ?? [], ngayBu: r.ngay_bu ?? [], ngayDuoi: r.ngay_duoi ?? [],
  }))
  return out.sort((a, b) => a.hoc_sinh_ten.localeCompare(b.hoc_sinh_ten, 'vi') || a.mon.localeCompare(b.mon, 'vi'))
}
// Chọn công thức TAY cho 1 HS×lớp×kỳ (ct=null → xoá dòng = quay về theo đề xuất của hệ).
export async function setCongThucHocPhi(hocSinhId: string, lopId: string, ky: string, ct: CongThuc | null): Promise<void> {
  if (ct === null) {
    const { error } = await supabase.from('hoc_phi_cong_thuc').delete().match({ hoc_sinh_id: hocSinhId, lop_id: lopId, ky })
    if (error) throw error
    return
  }
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('hoc_phi_cong_thuc')
    .upsert({ hoc_sinh_id: hocSinhId, lop_id: lopId, ky, cong_thuc: ct, actor: user?.id ?? null, updated_at: new Date().toISOString() }, { onConflict: 'hoc_sinh_id,lop_id,ky' })
  if (error) throw error
}

// Dữ liệu ĐỦ cho 1 phiếu thông báo (ảnh/PDF gửi PH) — dùng chốt nếu có, ảo nếu chưa (xem trước).
export type PhieuThongBao = { phTen: string; maPh: string; ky: string; dong: DongPhieu[]; tongTien: number; daChot: boolean }
export async function getPhieuThongBao(phuHuynhId: string, phTen: string, maPh: string, ky: string): Promise<PhieuThongBao> {
  const hd = await getHoaDonByKy(phuHuynhId, ky)
  if (hd) {
    const dong = await getHoaDonDong(hd.id)
    return { phTen, maPh, ky, dong, tongTien: Number(hd.tong_tien), daChot: true }
  }
  const ao = await getPhieuAo(phuHuynhId, ky)
  return { phTen, maPh, ky, dong: ao.dong, tongTien: ao.tongTien, daChot: false }
}
