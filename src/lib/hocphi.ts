// ============================================================================
// hocphi.ts — DATA-LAYER học phí (seam: UI KHÔNG gọi supabase trực tiếp).
// Spec: spec-hocphi.md (chốt 07-05, model mức học phí/học liệu tách bảng riêng).
// Pure-derive Ảo→Thật (như buổi học): phiếu ẢO tính realtime tới lúc "Chốt kỳ"
// đông cứng + snapshot. Người-trong-vòng-lặp ở chỗ tiền nhạy cảm — KHÔNG auto-giảm.
// ============================================================================
import { supabase } from './supabase'
import { tinhHeSoGiaDinh, thanhTienHocPhi, thanhTienHocDuoi, canXetDuyetNghi30 } from '../gami/hocphi.js'

const LIMIT = 2000

// ── MỨC HỌC PHÍ / MỨC HỌC LIỆU (config, sửa 1 chỗ đổi hàng loạt lớp) ────────
export type MucHocPhi = { id: string; ten: string; don_gia_buoi: number; gia_duoi: number; created_at?: string }
export type MucHocLieu = { id: string; ten: string; gia: number; created_at?: string }

export async function listMucHocPhi(): Promise<MucHocPhi[]> {
  const { data, error } = await supabase.from('muc_hoc_phi').select('*').order('don_gia_buoi').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as MucHocPhi[]
}
export async function createMucHocPhi(p: { ten: string; don_gia_buoi: number; gia_duoi: number }): Promise<MucHocPhi> {
  const { data, error } = await supabase.from('muc_hoc_phi').insert(p).select().single()
  if (error) throw error
  return data as MucHocPhi
}
export async function updateMucHocPhi(id: string, patch: Partial<Omit<MucHocPhi, 'id'>>): Promise<void> {
  const { error } = await supabase.from('muc_hoc_phi').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteMucHocPhi(id: string): Promise<void> {
  const { error } = await supabase.from('muc_hoc_phi').delete().eq('id', id)
  if (error) throw error
}
export async function listMucHocLieu(): Promise<MucHocLieu[]> {
  const { data, error } = await supabase.from('muc_hoc_lieu').select('*').order('gia').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as MucHocLieu[]
}
export async function createMucHocLieu(p: { ten: string; gia: number }): Promise<MucHocLieu> {
  const { data, error } = await supabase.from('muc_hoc_lieu').insert(p).select().single()
  if (error) throw error
  return data as MucHocLieu
}
export async function updateMucHocLieu(id: string, patch: Partial<Omit<MucHocLieu, 'id'>>): Promise<void> {
  const { error } = await supabase.from('muc_hoc_lieu').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteMucHocLieu(id: string): Promise<void> {
  const { error } = await supabase.from('muc_hoc_lieu').delete().eq('id', id)
  if (error) throw error
}

// ── HỆ SỐ HỌC PHÍ — tài sản GIA ĐÌNH (§4): tính 1 lần ở mức PH, đóng dấu mọi con ──
// n_con = con `dang_hoc` có ≥1 ghi danh `dang_hoc` · n_con_3mon = trong đó có ≥3 MÔN (distinct lop.mon).
export async function tinhHeSoPH(phuHuynhId: string): Promise<number> {
  const { data: cons, error: e1 } = await supabase.from('hoc_sinh').select('id').eq('phu_huynh_id', phuHuynhId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  if (e1) throw e1
  const conIds = (cons ?? []).map((c) => c.id as string)
  if (!conIds.length) return 1.0
  const { data: hsl, error: e2 } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, lop:lop_id(mon)').in('hoc_sinh_id', conIds).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  if (e2) throw e2
  const monsByCon = new Map<string, Set<string>>()
  for (const r of (hsl ?? []) as any[]) {
    if (!r.lop?.mon) continue
    const s = monsByCon.get(r.hoc_sinh_id) ?? new Set<string>()
    s.add(r.lop.mon); monsByCon.set(r.hoc_sinh_id, s)
  }
  const activeConIds = [...monsByCon.keys()] // con thực sự đang có ≥1 lớp active (loại con ghi danh xong nhưng chưa/không còn lớp nào)
  const nCon = activeConIds.length
  const nCon3Mon = activeConIds.filter((id) => (monsByCon.get(id)?.size ?? 0) >= 3).length
  return tinhHeSoGiaDinh(nCon, nCon3Mon)
}
// Recompute + đóng dấu lên MỌI con — bỏ qua con `he_so_nguon='manual'` (KHÔNG đè, §4 ngoại lệ tay).
// Gọi khi con vào/rời lớp, thêm/bớt môn (hook ghiDanh/chuyenLop/setNgayRoi — §nhansu).
export async function recomputeHeSoPH(phuHuynhId: string): Promise<void> {
  const heSo = await tinhHeSoPH(phuHuynhId)
  const { data: cons, error } = await supabase.from('hoc_sinh').select('id, he_so_nguon, he_so_hoc_phi').eq('phu_huynh_id', phuHuynhId).limit(LIMIT)
  if (error) throw error
  for (const c of (cons ?? []) as any[]) {
    if (c.he_so_nguon === 'manual' || c.he_so_hoc_phi === heSo) continue
    await supabase.from('hoc_sinh').update({ he_so_hoc_phi: heSo }).eq('id', c.id)
  }
}
// Đổi hệ số TAY (học bổng…) — set nguồn='manual' để auto không đè.
export async function setHeSoThuCong(hocSinhId: string, heSo: number): Promise<void> {
  const { error } = await supabase.from('hoc_sinh').update({ he_so_hoc_phi: heSo, he_so_nguon: 'manual' }).eq('id', hocSinhId)
  if (error) throw error
}
// Trả về auto lại (recompute sẽ tính và đè từ lần gọi tiếp theo).
export async function boManualHeSo(hocSinhId: string, phuHuynhId: string): Promise<void> {
  const { error } = await supabase.from('hoc_sinh').update({ he_so_nguon: 'auto' }).eq('id', hocSinhId)
  if (error) throw error
  await recomputeHeSoPH(phuHuynhId)
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

// ── THỐNG KÊ BUỔI (con × lớp × kỳ) — nền cho học phí + xét duyệt ────────────
export type ThongKeBuoi = { soBuoiLop: number; soBuoiWindow: number; soBuoiNghi: number }
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
  let soBuoiNghi = 0
  const buoiIds = buoiTrongWindow.map((b) => b.id)
  if (buoiIds.length) {
    const { data: bhh, error: e3 } = await supabase.from('buoi_hoc_hs').select('diem_danh').eq('hoc_sinh_id', hocSinhId).in('buoi_hoc_id', buoiIds).limit(LIMIT)
    if (e3) throw e3
    soBuoiNghi = ((bhh ?? []) as { diem_danh: string | null }[]).filter((r) => r.diem_danh === 'vang' || r.diem_danh === 'vang_phep').length
  }
  return { soBuoiLop, soBuoiWindow, soBuoiNghi }
}

// ── XÉT DUYỆT (người-trong-vòng-lặp, KHÔNG auto-giảm — §5) ──────────────────
export type XetDuyet = {
  id: string; hoc_sinh_id: string; lop_id: string; ky: string; ly_do: 'nghi_30' | 'window_lech'
  so_buoi_lop: number | null; so_buoi_window: number | null; so_buoi_nghi: number | null
  trang_thai: 'cho_duyet' | 'da_duyet'; so_buoi_chot: number | null; quyet_dinh: string | null
  nguoi_duyet?: string | null; duyet_at?: string | null; created_at?: string
}
// Đảm bảo có hàng xét duyệt nếu rơi vào 1 trong 2 case (§5.1/§5.2) — idempotent (unique hs+lop+ky).
async function ensureXetDuyet(hocSinhId: string, lopId: string, ky: string, tk: ThongKeBuoi): Promise<XetDuyet | null> {
  const windowLech = tk.soBuoiWindow < tk.soBuoiLop
  const nghi30 = canXetDuyetNghi30(tk.soBuoiNghi, tk.soBuoiWindow)
  if (!windowLech && !nghi30) return null
  const lyDo = nghi30 ? 'nghi_30' : 'window_lech' // nghỉ 30% ưu tiên hiện (nghiêm trọng hơn), 1 hàng/kỳ theo unique constraint
  const { data: existed } = await supabase.from('hoc_phi_xet_duyet').select('*').eq('hoc_sinh_id', hocSinhId).eq('lop_id', lopId).eq('ky', ky).limit(1)
  if (existed?.length) return existed[0] as XetDuyet
  const { data, error } = await supabase.from('hoc_phi_xet_duyet').insert({
    hoc_sinh_id: hocSinhId, lop_id: lopId, ky, ly_do: lyDo,
    so_buoi_lop: tk.soBuoiLop, so_buoi_window: tk.soBuoiWindow, so_buoi_nghi: tk.soBuoiNghi,
  }).select().single()
  if (error) throw error
  return data as XetDuyet
}
export async function listXetDuyetChoDuyet(): Promise<XetDuyet[]> {
  const { data, error } = await supabase.from('hoc_phi_xet_duyet').select('*').eq('trang_thai', 'cho_duyet').order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as XetDuyet[]
}
// Người chốt: ghi quyết định (số buổi tính lại / miễn=0 / giữ nguyên=so_buoi_window).
export async function duyetXetDuyet(id: string, soBuoiChot: number, quyetDinh: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('hoc_phi_xet_duyet').update({
    trang_thai: 'da_duyet', so_buoi_chot: soBuoiChot, quyet_dinh: quyetDinh, nguoi_duyet: user?.id ?? null, duyet_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw error
}

// ── PHIẾU ẢO (pure-derive realtime, §7) ──────────────────────────────────────
export type DongPhieu = {
  loai: 'hoc_phi' | 'hoc_duoi' | 'hoc_lieu' | 'phat_sinh' | 'no_ky_truoc'
  hoc_sinh_id: string | null; hoc_sinh_ten?: string; lop_id: string | null; lop_ten?: string
  mo_ta: string | null; so_luong: number | null; don_gia: number | null; he_so: number | null; thanh_tien: number
}
export type PhieuAo = { phu_huynh_id: string; ky: string; dong: DongPhieu[]; tongTien: number; choDuyet: XetDuyet[]; soDuNoTruoc: number }

export async function getPhieuAo(phuHuynhId: string, ky: string): Promise<PhieuAo> {
  const { kyStart, kyEnd } = kyRange(ky)
  const dong: DongPhieu[] = []
  const choDuyet: XetDuyet[] = []

  const { data: cons, error: e0 } = await supabase.from('hoc_sinh').select('id, ho_ten, he_so_hoc_phi').eq('phu_huynh_id', phuHuynhId).limit(LIMIT)
  if (e0) throw e0
  for (const con of (cons ?? []) as { id: string; ho_ten: string; he_so_hoc_phi: number }[]) {
    // ghi danh CÓ HIỆU LỰC trong kỳ (đã vào trước kyEnd, chưa rời hoặc rời trong/sau kỳ).
    const { data: hslAll, error: e1 } = await supabase.from('hoc_sinh_lop')
      .select('lop_id, ngay_vao, ngay_roi, lop:lop_id(ten_lop, muc_hoc_phi_id, muc_hoc_lieu_id)')
      .eq('hoc_sinh_id', con.id).limit(LIMIT)
    if (e1) throw e1
    for (const enroll of (hslAll ?? []) as any[]) {
      if (enroll.ngay_vao && enroll.ngay_vao >= kyEnd) continue
      if (enroll.ngay_roi && enroll.ngay_roi < kyStart) continue
      const tk = await thongKeBuoiConLop(con.id, enroll.lop_id, kyStart, kyEnd)
      const xd = await ensureXetDuyet(con.id, enroll.lop_id, ky, tk)
      if (xd && xd.trang_thai === 'cho_duyet') choDuyet.push(xd)
      const soBuoi = xd?.trang_thai === 'da_duyet' ? (xd.so_buoi_chot ?? 0) : tk.soBuoiWindow
      const muc = enroll.lop?.muc_hoc_phi_id ? (await supabase.from('muc_hoc_phi').select('*').eq('id', enroll.lop.muc_hoc_phi_id).single()).data as MucHocPhi | null : null
      if (muc && soBuoi > 0) {
        dong.push({
          loai: 'hoc_phi', hoc_sinh_id: con.id, hoc_sinh_ten: con.ho_ten, lop_id: enroll.lop_id, lop_ten: enroll.lop?.ten_lop,
          mo_ta: null, so_luong: soBuoi, don_gia: muc.don_gia_buoi, he_so: con.he_so_hoc_phi,
          thanh_tien: thanhTienHocPhi(muc.don_gia_buoi, soBuoi, con.he_so_hoc_phi),
        })
      }
      if (enroll.lop?.muc_hoc_lieu_id) {
        const mucLieu = (await supabase.from('muc_hoc_lieu').select('*').eq('id', enroll.lop.muc_hoc_lieu_id).single()).data as MucHocLieu | null
        if (mucLieu) dong.push({ loai: 'hoc_lieu', hoc_sinh_id: con.id, hoc_sinh_ten: con.ho_ten, lop_id: enroll.lop_id, lop_ten: enroll.lop?.ten_lop, mo_ta: mucLieu.ten, so_luong: 1, don_gia: mucLieu.gia, he_so: null, thanh_tien: mucLieu.gia })
      }
    }
    // học đuổi: buổi loai='bo_tro_duoi' HS thực dự (diem_danh='co_mat') trong kỳ, group theo lớp GỐC (bo_tro_duoi.lop_id).
    const { data: bhhDuoi, error: e4 } = await supabase.from('buoi_hoc_hs')
      .select('bo_tro_duoi_id, diem_danh, buoi:buoi_hoc_id!inner(ngay, loai)')
      .eq('hoc_sinh_id', con.id).eq('diem_danh', 'co_mat').eq('buoi.loai', 'bo_tro_duoi').gte('buoi.ngay', kyStart).lt('buoi.ngay', kyEnd).limit(LIMIT)
    if (e4) throw e4
    const caseIds = [...new Set((bhhDuoi ?? []).map((r: any) => r.bo_tro_duoi_id).filter(Boolean))]
    if (caseIds.length) {
      const { data: cases } = await supabase.from('bo_tro_duoi').select('id, lop_id').in('id', caseIds).limit(LIMIT)
      const lopOfCase = new Map(((cases ?? []) as { id: string; lop_id: string | null }[]).map((c) => [c.id, c.lop_id]))
      const countByLop = new Map<string, number>()
      for (const r of (bhhDuoi ?? []) as any[]) {
        const lopId = lopOfCase.get(r.bo_tro_duoi_id); if (!lopId) continue
        countByLop.set(lopId, (countByLop.get(lopId) ?? 0) + 1)
      }
      for (const [lopId, soBuoi] of countByLop) {
        const { data: lopRow } = await supabase.from('lop').select('ten_lop, muc_hoc_phi_id').eq('id', lopId).single()
        const muc = lopRow?.muc_hoc_phi_id ? (await supabase.from('muc_hoc_phi').select('*').eq('id', lopRow.muc_hoc_phi_id).single()).data as MucHocPhi | null : null
        if (muc) dong.push({ loai: 'hoc_duoi', hoc_sinh_id: con.id, hoc_sinh_ten: con.ho_ten, lop_id: lopId, lop_ten: lopRow?.ten_lop, mo_ta: `Học đuổi ${soBuoi} buổi`, so_luong: soBuoi, don_gia: muc.gia_duoi, he_so: null, thanh_tien: thanhTienHocDuoi(muc.gia_duoi, soBuoi) })
      }
    }
  }

  const soDuNoTruoc = await tinhSoDuNo(phuHuynhId)
  if (soDuNoTruoc > 0) dong.push({ loai: 'no_ky_truoc', hoc_sinh_id: null, lop_id: null, mo_ta: 'Nợ kỳ trước', so_luong: null, don_gia: null, he_so: null, thanh_tien: soDuNoTruoc })

  return { phu_huynh_id: phuHuynhId, ky, dong, tongTien: dong.reduce((s, d) => s + d.thanh_tien, 0), choDuyet, soDuNoTruoc }
}

// Thêm dòng PHÁT SINH tay (0..n dòng, mô tả tự do) — TRƯỚC khi chốt kỳ (phiếu chưa tồn tại → lưu client-state
// ở UI cho tới lúc chốt, giống pattern nhập-kho — KHÔNG bảng nháp riêng). chotKy(...) nhận thêm mảng này.

// ── CHỐT KỲ (Ảo→Thật, atomic claim — §7/§266) ───────────────────────────────
export async function tinhSoDuNo(phuHuynhId: string): Promise<number> {
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
  return tongHoaDon - tongDaThu
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

// Chốt kỳ = đông cứng phiếu ảo thành hoa_don + hoa_don_dong (snapshot). Chặn nếu còn hàng CHỜ xét duyệt (§5).
// Atomic: insert hoa_don (unique phu_huynh_id+ky chống chốt trùng — DB tự chặn nếu đã chốt).
export async function chotKy(phuHuynhId: string, ky: string, phatSinh: { mo_ta: string; thanh_tien: number }[] = []): Promise<{ hoaDonId: string; tongTien: number }> {
  const ao = await getPhieuAo(phuHuynhId, ky)
  if (ao.choDuyet.length) throw new Error(`Còn ${ao.choDuyet.length} hàng chờ xét duyệt cho kỳ này — duyệt xong mới chốt được.`)
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
export async function ghiThanhToan(hoaDonId: string, soTien: number, opts?: { ngay?: string; phuongThuc?: string; ghiChu?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error: e1 } = await supabase.from('thanh_toan').insert({
    hoa_don_id: hoaDonId, so_tien: soTien, ngay: opts?.ngay ?? new Date().toISOString().slice(0, 10),
    phuong_thuc: opts?.phuongThuc ?? null, ghi_chu: opts?.ghiChu ?? null, nguoi_thu: user?.id ?? null,
  })
  if (e1) throw e1
  // cập nhật trạng thái phiếu theo tổng đã thu.
  const { data: hd, error: e2 } = await supabase.from('hoa_don').select('id, tong_tien').eq('id', hoaDonId).single()
  if (e2) throw e2
  const { data: tts, error: e3 } = await supabase.from('thanh_toan').select('so_tien').eq('hoa_don_id', hoaDonId).limit(LIMIT)
  if (e3) throw e3
  const daThu = (tts ?? []).reduce((s, t) => s + Number(t.so_tien), 0)
  const tt = daThu >= Number((hd as any).tong_tien) ? 'da_thu' : daThu > 0 ? 'thu_mot_phan' : 'chua_thu'
  await supabase.from('hoa_don').update({ trang_thai: tt }).eq('id', hoaDonId)
}
export async function listThanhToan(hoaDonId: string): Promise<ThanhToan[]> {
  const { data, error } = await supabase.from('thanh_toan').select('*').eq('hoa_don_id', hoaDonId).order('ngay', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as ThanhToan[]
}

// ── DANH SÁCH PHỤ HUYNH (để chọn phiếu) — chỉ PH có con đang học ────────────
export type PHOpt = { id: string; ho_ten: string; ma_ph: string; soCon: number }
export async function listPhuHuynhCoConDangHoc(): Promise<PHOpt[]> {
  const { data, error } = await supabase.from('hoc_sinh').select('phu_huynh_id, phu_huynh:phu_huynh_id(id, ho_ten, ma_ph)').eq('trang_thai', 'dang_hoc').not('phu_huynh_id', 'is', null).limit(LIMIT)
  if (error) throw error
  const byPH = new Map<string, PHOpt>()
  for (const r of (data ?? []) as any[]) {
    const ph = r.phu_huynh; if (!ph) continue
    const cur = byPH.get(ph.id) ?? { id: ph.id, ho_ten: ph.ho_ten, ma_ph: ph.ma_ph, soCon: 0 }
    cur.soCon++; byPH.set(ph.id, cur)
  }
  return [...byPH.values()].sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi'))
}

// Đã chốt phiếu tháng này chưa (cho danh sách tổng quan) — bulk theo mọi PH.
export async function listHoaDonByKy(ky: string): Promise<{ phu_huynh_id: string; trang_thai: string; tong_tien: number }[]> {
  const { data, error } = await supabase.from('hoa_don').select('phu_huynh_id, trang_thai, tong_tien').eq('ky', ky).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as any[]
}

// ── DANH SÁCH TỔNG (bulk, cho màn quản lý + xuất ảnh/PDF thông báo PH) ──────
// Nhẹ: dùng hoa_don đã chốt cho tiền (không tính lại phiếu ảo cho CẢ danh sách — tốn N+1 nếu 300 PH).
// PH chưa chốt hiện "chưa chốt" — muốn xem/tải phiếu of PH đó thì bấm vào (tính ảo on-demand qua getPhieuAo).
export type DongSoHang = { phu_huynh_id: string; ho_ten: string; ma_ph: string; soCon: number; daChot: boolean; tongTien: number | null; trangThai: string | null }
export async function listPhieuTheoKy(ky: string): Promise<DongSoHang[]> {
  const [phs, hds] = await Promise.all([listPhuHuynhCoConDangHoc(), listHoaDonByKy(ky)])
  const hdMap = new Map(hds.map((h) => [h.phu_huynh_id, h]))
  return phs.map((p) => {
    const hd = hdMap.get(p.id)
    return { phu_huynh_id: p.id, ho_ten: p.ho_ten, ma_ph: p.ma_ph, soCon: p.soCon, daChot: !!hd, tongTien: hd ? Number(hd.tong_tien) : null, trangThai: hd?.trang_thai ?? null }
  })
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
