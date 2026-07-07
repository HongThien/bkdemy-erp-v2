// Data-layer Tuyển sinh (phễu Test đầu vào L5→L8). ADR: app.notion.com/p/389d4530bcdb81749d0fd6f0a741c233
// Lead = `ung_vien` RIÊNG; convert L7→L8 tạo hoc_sinh. UI chỉ gọi qua đây.
import { supabase } from './supabase'
import { suggestMaHS, suggestMaPH, createHocSinh, createPhuHuynh, ghiDanh } from './nhansu'
import { homNayVN, vnInstant } from './tuan'
import { MON_LIST, type Mon } from './mon'
import { uploadKhoFile } from './kho/api'

const LIMIT = 10000

export type UngVienLevel = 'L5' | 'L6' | 'L7'
export type UngVienTrangThai = 'dang_chay' | 'loai' | 'da_convert'
export type UngVien = {
  id: string; ma_uv: string | null; ho_ten_hs: string; ho_ten_ph: string | null; sdt_ph: string | null
  khoi: string | null; mon: string; nguon: string | null; level: UngVienLevel; trang_thai: UngVienTrangThai
  ly_do_loai: string | null; diem_test: number | null; lop_du_kien_id: string | null; ngay_hoc_thu: string | null
  ghi_chu: string | null; hoc_sinh_id: string | null; created_at: string
  // thông tin HS đầy đủ (nhập từ lead → convert copy thẳng)
  ngay_sinh: string | null; gioi_tinh: string | null; dia_chi: string | null; truong_hoc: string | null; email_ph: string | null
  phu_huynh_id: string | null // link PH cũ (con thứ 2…) — convert dùng thẳng, không tạo trùng
  hoc_sinh_goc_id: string | null // lead = HS CŨ học thêm môn → convert chỉ ghi danh, không tạo HS mới
  can_bo_tro_duoi: boolean // tích → khi convert tạo case bổ trợ đuổi (HS chậm hơn chương trình lớp)
}
export const MON_OPTIONS = MON_LIST // danh mục môn dùng chung (src/lib/mon.ts)
export type MonTS = Mon
// input tạo/sửa lead — các trường thông tin (KHÔNG gồm id/ma_uv/trang_thai/hoc_sinh_id…)
export type UngVienInput = Partial<Pick<UngVien, 'ho_ten_hs' | 'ho_ten_ph' | 'sdt_ph' | 'email_ph' | 'phu_huynh_id' | 'hoc_sinh_goc_id' | 'can_bo_tro_duoi' | 'khoi' | 'mon' | 'nguon' | 'ghi_chu' | 'ngay_sinh' | 'gioi_tinh' | 'dia_chi' | 'truong_hoc'>>

// Tìm HS cũ (cho lead "học thêm môn") — gõ tên/mã.
export async function timHocSinh(q: string): Promise<{ id: string; ma_hs: string | null; ho_ten: string; khoi: string | null }[]> {
  if (!q.trim()) return []
  const { data, error } = await supabase.from('hoc_sinh').select('id, ma_hs, ho_ten, khoi').or(`ho_ten.ilike.%${q.trim()}%,ma_hs.ilike.%${q.trim()}%`).order('ho_ten').limit(8)
  if (error) throw error
  return (data ?? []) as any
}
// Lấy thông tin HS cũ + PH (để fill form lead). Trả các field khớp UngVienInput.
export async function chiTietHSChoLead(hsId: string): Promise<UngVienInput & { hoc_sinh_goc_id: string }> {
  const { data: h, error } = await supabase.from('hoc_sinh').select('ho_ten, ngay_sinh, gioi_tinh, khoi, truong_hoc, dia_chi, phu_huynh_id').eq('id', hsId).single()
  if (error) throw error
  const out: UngVienInput & { hoc_sinh_goc_id: string } = {
    hoc_sinh_goc_id: hsId, ho_ten_hs: (h as any).ho_ten, ngay_sinh: (h as any).ngay_sinh, gioi_tinh: (h as any).gioi_tinh,
    khoi: (h as any).khoi, truong_hoc: (h as any).truong_hoc, dia_chi: (h as any).dia_chi, phu_huynh_id: (h as any).phu_huynh_id ?? null,
  }
  if ((h as any).phu_huynh_id) {
    const { data: p } = await supabase.from('phu_huynh').select('ho_ten, so_dien_thoai, email').eq('id', (h as any).phu_huynh_id).single()
    if (p) { out.ho_ten_ph = (p as any).ho_ten; out.sdt_ph = (p as any).so_dien_thoai; out.email_ph = (p as any).email }
  }
  return out
}

// Catalog việc/level (CỨNG). derive=true: sẽ tự suy từ TA chấm test (seam ADR riêng) — TẠM tick tay.
export const VIEC_BY_LEVEL: Record<UngVienLevel, { key: string; ten: string; derive?: boolean }[]> = {
  L5: [{ key: 'gui_quy_trinh', ten: 'Gửi quy trình test' }],
  L6: [{ key: 'cham_bai', ten: 'Chấm bài', derive: true }, { key: 'tra_bai', ten: 'Trả bài' }, { key: 'chot_lich', ten: 'Chốt lịch học thử' }],
  L7: [{ key: 'xac_nhan_dk', ten: 'Xác nhận đăng ký chính thức' }],
}
export const LEVELS: UngVienLevel[] = ['L5', 'L6', 'L7']
export const LEVEL_TEN: Record<string, string> = { L5: 'Đăng ký test', L6: 'Đến test', L7: 'Học thử', L8: 'Chính thức', loai: 'Đã loại' }
const NEXT: Record<UngVienLevel, UngVienLevel | 'L8'> = { L5: 'L6', L6: 'L7', L7: 'L8' }

export async function suggestMaUV(): Promise<string> {
  const { data } = await supabase.from('ung_vien').select('ma_uv').not('ma_uv', 'is', null).limit(LIMIT)
  let max = 0
  for (const r of (data ?? []) as any[]) { const m = String(r.ma_uv ?? '').match(/\d+/); if (m) max = Math.max(max, parseInt(m[0], 10)) }
  return 'UV' + String(max + 1).padStart(4, '0')
}

export async function listUngVien(level: UngVienLevel, mon?: string): Promise<UngVien[]> {
  let q = supabase.from('ung_vien').select('*').eq('trang_thai', 'dang_chay').eq('level', level)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q.order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as UngVien[]
}
export async function listLoai(mon?: string): Promise<UngVien[]> {
  let q = supabase.from('ung_vien').select('*').eq('trang_thai', 'loai')
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q.order('updated_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as UngVien[]
}
// việc đã xong của nhóm UV → map uvId -> Set(viec_key)
export async function getViecXong(uvIds: string[]): Promise<Record<string, Set<string>>> {
  if (!uvIds.length) return {}
  const { data, error } = await supabase.from('ung_vien_viec').select('ung_vien_id, viec_key').in('ung_vien_id', uvIds).limit(LIMIT)
  if (error) throw error
  const m: Record<string, Set<string>> = {}
  for (const r of (data ?? []) as any[]) { (m[r.ung_vien_id] ??= new Set<string>()).add(r.viec_key) }
  return m
}
// nguồn lead đã dùng (distinct) — gợi ý khi điền (free text, tự thêm mới)
export async function listNguon(): Promise<string[]> {
  const { data } = await supabase.from('ung_vien').select('nguon').not('nguon', 'is', null).limit(LIMIT)
  return [...new Set((data ?? []).map((r: any) => String(r.nguon).trim()).filter(Boolean))].sort()
}

export async function createUngVien(input: UngVienInput & { ma_uv?: string }): Promise<UngVien> {
  if (!input.ho_ten_hs?.trim()) throw new Error('Thiếu tên học sinh')
  const { data: { user } } = await supabase.auth.getUser()
  const ma_uv = input.ma_uv?.trim() || (await suggestMaUV())
  const { data, error } = await supabase.from('ung_vien').insert({ ...input, ma_uv, created_by: user?.id ?? null }).select().single()
  if (error) throw error
  return data as UngVien
}
export async function updateUngVien(id: string, patch: Partial<UngVien>): Promise<void> {
  const { error } = await supabase.from('ung_vien').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
// tick / bỏ tick 1 việc (anti-NULL §1.5: CÓ dòng = đã xong)
export async function toggleViec(uvId: string, viecKey: string, on: boolean): Promise<void> {
  if (on) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('ung_vien_viec').upsert({ ung_vien_id: uvId, viec_key: viecKey, nguoi_xong: user?.id ?? null }, { onConflict: 'ung_vien_id,viec_key', ignoreDuplicates: true })
    if (error) throw error
  } else {
    const { error } = await supabase.from('ung_vien_viec').delete().eq('ung_vien_id', uvId).eq('viec_key', viecKey)
    if (error) throw error
  }
}
export function duViec(level: UngVienLevel, done: Set<string> | undefined): boolean {
  return VIEC_BY_LEVEL[level].every((v) => done?.has(v.key))
}
// Hoàn thành level → promote (L5→L6→L7). L7 KHÔNG promote ở đây (phải convert qua form).
export async function hoanThanhLevel(uv: UngVien): Promise<void> {
  const next = NEXT[uv.level]
  if (next === 'L8') throw new Error('L7 hoàn thành = convert (tạo HS) — gọi convertUngVien qua form.')
  await updateUngVien(uv.id, { level: next })
}
export async function loaiUngVien(id: string, lyDo: string): Promise<void> { await updateUngVien(id, { trang_thai: 'loai', ly_do_loai: lyDo }) }
export async function moLaiUngVien(id: string): Promise<void> { await updateUngVien(id, { trang_thai: 'dang_chay', ly_do_loai: null }) }

// CONVERT L7→L8: gộp/ tạo PH theo SĐT + tạo HS + (tuỳ) ghi danh lớp. Set hoc_sinh_id + da_convert. Trả hoc_sinh_id.
export async function convertUngVien(uv: UngVien, opts: { khoi?: string | null; lopId?: string | null; mucNangLucId?: string | null; duoi?: boolean }): Promise<string> {
  // duoi=true (nút "Bổ trợ đuổi" ở L6/L7) → tạo case (nguon=tuyen_sinh) gắn lớp vừa xếp. Bỏ qua nếu trùng.
  const taoCaseDuoiNeuCan = async (hsId: string) => {
    if (!opts.duoi) return
    const lopId = opts.lopId ?? uv.lop_du_kien_id ?? null
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('bo_tro_duoi').insert({ hoc_sinh_id: hsId, lop_id: lopId, nguon: 'tuyen_sinh', actor: user?.id ?? null })
  }
  // Lead = HS CŨ học thêm môn → KHÔNG tạo HS/PH mới, chỉ ghi danh vào lớp môn mới.
  if (uv.hoc_sinh_goc_id) {
    const hsId = uv.hoc_sinh_goc_id
    if (opts.lopId) { try { await ghiDanh(hsId, opts.lopId, opts.mucNangLucId ?? null) } catch { /* lỗi lớp không chặn convert */ } }
    await taoCaseDuoiNeuCan(hsId)
    await updateUngVien(uv.id, { trang_thai: 'da_convert', hoc_sinh_id: hsId })
    return hsId
  }
  let phId: string | null = uv.phu_huynh_id ?? null // PH cũ đã chọn → dùng thẳng
  if (!phId && uv.sdt_ph?.trim()) {
    const { data: ex } = await supabase.from('phu_huynh').select('id').eq('so_dien_thoai', uv.sdt_ph.trim()).limit(1)
    phId = (ex?.[0] as any)?.id ?? null
  }
  if (!phId && (uv.ho_ten_ph?.trim() || uv.sdt_ph?.trim())) {
    const ph = await createPhuHuynh({ ma_ph: await suggestMaPH(), ho_ten: uv.ho_ten_ph?.trim() || `PH của ${uv.ho_ten_hs}`, so_dien_thoai: uv.sdt_ph?.trim() || null, email: uv.email_ph?.trim() || null })
    phId = ph.id
  }
  const hs = await createHocSinh({
    ma_hs: await suggestMaHS(), ho_ten: uv.ho_ten_hs, khoi: opts.khoi ?? uv.khoi ?? null,
    ngay_sinh: uv.ngay_sinh, gioi_tinh: (uv.gioi_tinh ?? null) as any, dia_chi: uv.dia_chi, truong_hoc: uv.truong_hoc,
    phu_huynh_id: phId, diem_test_dau_vao: uv.diem_test ?? null, ngay_nhap_hoc: homNayVN(), trang_thai: 'dang_hoc',
  })
  if (opts.lopId) { try { await ghiDanh(hs.id, opts.lopId, opts.mucNangLucId ?? null) } catch { /* lỗi lớp không chặn convert */ } }
  await taoCaseDuoiNeuCan(hs.id)
  await updateUngVien(uv.id, { trang_thai: 'da_convert', hoc_sinh_id: hs.id })
  return hs.id
}

// đếm cho toggle bar: L5–L7 từ ung_vien dang_chay; L8 = hoc_sinh đang học; loai = đã loại
export async function demTheoLevel(mon?: string): Promise<Record<string, number>> {
  const out: Record<string, number> = { L5: 0, L6: 0, L7: 0, L8: 0, loai: 0 }
  let q = supabase.from('ung_vien').select('level, trang_thai').limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  const { data } = await q
  for (const r of (data ?? []) as any[]) { if (r.trang_thai === 'dang_chay') out[r.level] = (out[r.level] ?? 0) + 1; else if (r.trang_thai === 'loai') out.loai++ }
  out.L8 = (await listHSDangHoc(mon)).length
  return out
}
// L8 = list HS đang học. Có mon → chỉ HS đang học ở lớp môn đó (distinct).
export async function listHSDangHoc(mon?: string): Promise<{ id: string; ma_hs: string | null; ho_ten: string; khoi: string | null }[]> {
  if (mon) {
    const { data, error } = await supabase.from('hoc_sinh_lop')
      .select('hoc_sinh:hoc_sinh_id(id, ma_hs, ho_ten, khoi, trang_thai), lop:lop_id!inner(mon)')
      .eq('trang_thai', 'dang_hoc').eq('lop.mon', mon).limit(LIMIT)
    if (error) throw error
    const seen = new Set<string>(); const out: any[] = []
    for (const r of (data ?? []) as any[]) { const h = r.hoc_sinh; if (h && h.trang_thai === 'dang_hoc' && !seen.has(h.id)) { seen.add(h.id); out.push({ id: h.id, ma_hs: h.ma_hs, ho_ten: h.ho_ten, khoi: h.khoi }) } }
    return out.sort((a, b) => a.ho_ten.localeCompare(b.ho_ten))
  }
  const { data, error } = await supabase.from('hoc_sinh').select('id, ma_hs, ho_ten, khoi').eq('trang_thai', 'dang_hoc').order('ho_ten').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as any
}

// ============================================================================
// CA TEST ĐẦU VÀO (điểm danh test) — OPS tạo lúc HS THẬT SỰ tới test (đặt lịch
// trước hoặc walk-in, chưa có web PH tự đăng ký). Ghi nhận bằng chứng thật "đã
// đến test" cho ops-lead tuyển sinh audit L5→L6 (KHÁC checklist tick tay
// `ung_vien_viec`, vẫn giữ nguyên ở bước này). Chọn ứng viên L5 có sẵn → app tự
// nhảy level='L6' (đã có mặt = bằng chứng đủ). Walk-in mới → tạo thẳng L6.
// ============================================================================
export const THOI_LUONG_OPTIONS = [45, 60, 75, 90, 120] as const
export type CaTestTrangThai = 'dang_test' | 'hoan_thanh'
export type CaTest = {
  id: string; ungVienId: string; mon: string; ngay: string; gioBatDau: string
  thoiLuongPhut: number; trangThai: CaTestTrangThai; baiUrl: string | null; hoanThanhAt: string | null
  createdAt: string
  ungVien: { hoTenHs: string; maUv: string | null; khoi: string | null; hoTenPh: string | null; sdtPh: string | null }
}
const CA_TEST_SELECT = '*, ung_vien:ung_vien_id(ho_ten_hs, ma_uv, khoi, ho_ten_ph, sdt_ph)'
function mapCaTest(r: any): CaTest {
  return {
    id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, gioBatDau: r.gio_bat_dau,
    thoiLuongPhut: r.thoi_luong_phut, trangThai: r.trang_thai, baiUrl: r.bai_url, hoanThanhAt: r.hoan_thanh_at,
    createdAt: r.created_at,
    ungVien: { hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', maUv: r.ung_vien?.ma_uv ?? null, khoi: r.ung_vien?.khoi ?? null, hoTenPh: r.ung_vien?.ho_ten_ph ?? null, sdtPh: r.ung_vien?.sdt_ph ?? null },
  }
}
// Deadline (epoch ms) hiển thị đếm ngược — tái dùng vnInstant/mucDeadline/nhanConLai (tuan.ts).
export function gioKetThucCaTest(t: Pick<CaTest, 'ngay' | 'gioBatDau' | 'thoiLuongPhut'>): number {
  return vnInstant(t.ngay, t.gioBatDau.slice(0, 5)) + t.thoiLuongPhut * 60000
}

// Ca đang chạy (mọi HS, mọi OPS — hàng đợi chung, không phải "của riêng tôi").
export async function listCaTestDangChay(): Promise<CaTest[]> {
  const { data, error } = await supabase.from('ca_test').select(CA_TEST_SELECT).eq('trang_thai', 'dang_test').order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapCaTest)
}
export async function listCaTestHoanThanh(ngay: string): Promise<CaTest[]> {
  const { data, error } = await supabase.from('ca_test').select(CA_TEST_SELECT).eq('trang_thai', 'hoan_thanh').eq('ngay', ngay).order('hoan_thanh_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapCaTest)
}
// Tìm ứng viên L5 (đang chạy) theo tên/mã — cho SearchSelect ở popup tạo ca test.
export async function listUngVienL5(): Promise<{ id: string; ho_ten_hs: string; ma_uv: string | null; khoi: string | null; mon: string }[]> {
  const { data, error } = await supabase.from('ung_vien').select('id, ho_ten_hs, ma_uv, khoi, mon').eq('level', 'L5').eq('trang_thai', 'dang_chay').order('ho_ten_hs').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as any
}
export async function getUngVien(id: string): Promise<UngVien> {
  const { data, error } = await supabase.from('ung_vien').select('*').eq('id', id).single()
  if (error) throw error
  return data as UngVien
}

export type TaoCaTestInput = {
  ungVienId?: string // đã có ở L5 → dùng thẳng
  ungVienMoi?: { hoTenHs: string; mon: string; khoi?: string | null; ngaySinh?: string | null; hoTenPh?: string | null; sdtPh?: string | null; truongHoc?: string | null } // walk-in
  ngay: string; gioBatDau: string; thoiLuongPhut: number
}
export async function taoCaTest(input: TaoCaTestInput): Promise<CaTest> {
  const { data: { user } } = await supabase.auth.getUser()
  let ungVienId = input.ungVienId ?? null
  let mon: string
  if (ungVienId) {
    const { data: uv, error } = await supabase.from('ung_vien').select('mon, level').eq('id', ungVienId).single()
    if (error) throw error
    mon = (uv as any).mon
    if ((uv as any).level === 'L5') await updateUngVien(ungVienId, { level: 'L6' }) // đã có mặt tại trung tâm = bằng chứng "đến test" đủ
  } else {
    if (!input.ungVienMoi?.hoTenHs.trim()) throw new Error('Thiếu tên học sinh')
    const created = await createUngVien({
      ho_ten_hs: input.ungVienMoi.hoTenHs.trim(), mon: input.ungVienMoi.mon, khoi: input.ungVienMoi.khoi ?? null,
      ngay_sinh: input.ungVienMoi.ngaySinh || null, ho_ten_ph: input.ungVienMoi.hoTenPh?.trim() || null,
      sdt_ph: input.ungVienMoi.sdtPh?.trim() || null, truong_hoc: input.ungVienMoi.truongHoc?.trim() || null,
    })
    ungVienId = created.id
    mon = created.mon
    await updateUngVien(ungVienId, { level: 'L6' }) // walk-in: đăng ký + đến diễn ra cùng lúc, bỏ qua L5
  }
  const { data, error } = await supabase.from('ca_test')
    .insert({ ung_vien_id: ungVienId, mon, ngay: input.ngay, gio_bat_dau: input.gioBatDau, thoi_luong_phut: input.thoiLuongPhut, created_by: user?.id ?? null })
    .select(CA_TEST_SELECT).single()
  if (error) throw error
  return mapCaTest(data)
}

// Upload bài test scan (PDF/ảnh, 1 file — giống hướng "scan cả lớp thành 1 PDF" của Story-4 OPS spec).
export async function uploadCaTestBai(file: File): Promise<string> { return (await uploadKhoFile(file)).url }
export async function ganBaiCaTest(id: string, baiUrl: string): Promise<void> {
  const { error } = await supabase.from('ca_test').update({ bai_url: baiUrl }).eq('id', id)
  if (error) throw error
}
// Đóng ca — BẮT BUỘC đã có bài scan mới đóng được (cùng luật evidence-trước-khi-đóng của OPS spec).
export async function hoanThanhCaTest(id: string, baiUrl: string | null): Promise<void> {
  if (!baiUrl) throw new Error('Cần upload bài test mới hoàn tất được.')
  const { error } = await supabase.from('ca_test').update({ trang_thai: 'hoan_thanh', hoan_thanh_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
