// Data-layer "Test đầu vào — Đề + Chấm + Nhận xét + Trả bài" (BKDEMY_TESTDAUVAO_SPEC_DETAIL.md).
// ca_test (tuyensinh.ts) = "buổi test" của spec. File này nối tiếp: gán đề (snapshot) → chấm Đ/C/S
// per câu → nhận xét (biểu đồ chuyên đề + lớp đề xuất) → trả bài (phiếu). KHÔNG feed mastery (§A cố ý).
// ⭐ Đề = CHỌN 1 tài liệu CÓ SẴN trong Kho (mig 0092, đảo quyết định "câu gõ tay riêng" của 0090) —
// de_test chỉ còn là CON TRỎ "đề đang dùng của khối×môn" → tai_lieu_id (bất kỳ loại nào: MT/ET/Đề
// thi/giáo trình…, xem layCauTheoThuTu ở tailieu.ts). Gán vào ca_test vẫn SNAPSHOT đầy đủ câu (§A.2).
import { supabase } from './supabase'
import { khoCuaMon, layCauTheoThuTu } from './tailieu'
import { toggleViec, updateUngVien } from './tuyensinh'
import type { MenhDe } from './kho/api'

const LIMIT = 10000

// ============================================================================
// ĐỀ TEST (con trỏ "đề đang dùng" của khối×môn — đổi định kỳ giữ lịch sử, KHÔNG xoá đề cũ)
// ============================================================================
export type DeTest = {
  id: string; khoi: string; mon: string; ten: string; active: boolean; createdAt: string
  taiLieuId: string; taiLieuTen: string; taiLieuLoai: string
}
function mapDeTest(r: any): DeTest {
  return { id: r.id, khoi: r.khoi, mon: r.mon, ten: r.ten, active: r.active, createdAt: r.created_at, taiLieuId: r.tai_lieu_id, taiLieuTen: r.tai_lieu?.ten ?? '?', taiLieuLoai: r.tai_lieu?.loai ?? '' }
}
export async function listDeTest(khoi?: string, mon?: string): Promise<DeTest[]> {
  let q = supabase.from('de_test').select('*, tai_lieu:tai_lieu_id(ten, loai)')
  if (khoi) q = q.eq('khoi', khoi)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q.order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapDeTest)
}
// Đặt 1 tài liệu (đã chọn từ Kho) làm "đề đang dùng" của khối×môn — tự TẮT đề đang dùng cũ (nếu
// có), KHÔNG xoá (giữ lịch sử §4 CLAUDE.md; unique index chỉ cho 1 active/khối×môn — mig 0092).
export async function datDeDangDung(input: { khoi: string; mon: string; ten: string; taiLieuId: string }): Promise<DeTest> {
  const { error: e0 } = await supabase.from('de_test').update({ active: false }).eq('khoi', input.khoi).eq('mon', input.mon).eq('active', true)
  if (e0) throw e0
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('de_test')
    .insert({ khoi: input.khoi, mon: input.mon, ten: input.ten, tai_lieu_id: input.taiLieuId, created_by: user?.id ?? null })
    .select('*, tai_lieu:tai_lieu_id(ten, loai)').single()
  if (error) throw error
  return mapDeTest(data)
}
export async function setDeTestActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase.from('de_test').update({ active }).eq('id', id)
  if (error) throw error
}

// ============================================================================
// GÁN ĐỀ vào ca_test — SNAPSHOT câu THẬT từ tài liệu (§A.2: đổi đề sau không hỏng bài đã chấm)
// ============================================================================
export async function ganDeCaTest(caTestId: string, deTestId: string): Promise<void> {
  const { data: dt, error: e0 } = await supabase.from('de_test').select('tai_lieu_id').eq('id', deTestId).single()
  if (e0) throw e0
  const cau = await layCauTheoThuTu((dt as any).tai_lieu_id)
  if (!cau.length) throw new Error('Tài liệu của đề chưa có câu nào.')
  const { error: e1 } = await supabase.from('ca_test').update({ de_test_id: deTestId }).eq('id', caTestId)
  if (e1) throw e1
  // Đúng/Sai (menh_de) snapshot NGUYÊN 1 câu (4 mệnh đề) — chấm HOLISTIC 1 mức Đ/C/S cho cả câu
  // (khác model gõ-tay cũ "mỗi ý 1 dòng" — đơn giản hơn, khớp cách MT/ET đã chấm dung_sai).
  const { error: e2 } = await supabase.from('ca_test_cau').insert(
    cau.map((c, i) => ({
      ca_test_id: caTestId, thu_tu: i + 1, ma_cau: c.ma_cau, loai_cau: c.loai_cau, noi_dung: c.noi_dung,
      lua_chon: c.lua_chon, menh_de: c.menh_de, dap_an: c.dap_an, loi_giai: c.loi_giai,
      anh_de: c.anh_de, anh_dap_an: c.anh_dap_an, ma_dang: c.dang_chinh, diem_toi_da: 1,
    })),
  )
  if (e2) throw e2
}

// ============================================================================
// CHẤM TEST (Story 2) — pool team học thuật, ai mở thì làm.
// ============================================================================
export type CaTestCau = {
  id: string; thuTu: number; maCau: string | null; loaiCau: string | null; noiDung: string | null
  luaChon: string[] | null; menhDe: MenhDe[] | null; dapAn: string | null; loiGiai: string | null
  anhDe: string | null; anhDapAn: string | null; diemToiDa: number; maDang: string | null
  ketQua: 'correct' | 'partial' | 'wrong' | null; diem: number | null
}
export type CaTestChoCham = {
  id: string; ungVienId: string; mon: string; ngay: string; baiUrl: string | null; deTestId: string | null
  hoTenHs: string; khoi: string | null
}
// Hàng đợi CHUNG (team học thuật) — đã điểm danh xong (có bài scan + đề gán) + chưa chấm xong.
export async function listCanCham(): Promise<CaTestChoCham[]> {
  const { data, error } = await supabase.from('ca_test')
    .select('id, ung_vien_id, mon, ngay, bai_url, de_test_id, cham_xong_at, trang_thai, ung_vien:ung_vien_id(ho_ten_hs, khoi)')
    .eq('trang_thai', 'hoan_thanh').not('de_test_id', 'is', null).is('cham_xong_at', null)
    .order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, deTestId: r.de_test_id, hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null }))
}
export async function listDaCham(ngay?: string): Promise<CaTestChoCham[]> {
  let q = supabase.from('ca_test').select('id, ung_vien_id, mon, ngay, bai_url, de_test_id, ung_vien:ung_vien_id(ho_ten_hs, khoi)').not('cham_xong_at', 'is', null)
  if (ngay) q = q.eq('ngay', ngay)
  const { data, error } = await q.order('cham_xong_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, deTestId: r.de_test_id, hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null }))
}
export async function getCaTestCauKq(caTestId: string): Promise<CaTestCau[]> {
  const { data: cau, error } = await supabase.from('ca_test_cau').select('*').eq('ca_test_id', caTestId).order('thu_tu').limit(LIMIT)
  if (error) throw error
  const ids = (cau ?? []).map((c: any) => c.id)
  const { data: kq } = ids.length ? await supabase.from('ca_test_cau_kq').select('*').in('ca_test_cau_id', ids).limit(LIMIT) : { data: [] as any[] }
  const kqMap = new Map(((kq ?? []) as any[]).map((k) => [k.ca_test_cau_id, k]))
  return (cau ?? []).map((c: any) => {
    const k = kqMap.get(c.id)
    return {
      id: c.id, thuTu: c.thu_tu, maCau: c.ma_cau, loaiCau: c.loai_cau, noiDung: c.noi_dung,
      luaChon: c.lua_chon, menhDe: c.menh_de, dapAn: c.dap_an, loiGiai: c.loi_giai,
      anhDe: c.anh_de, anhDapAn: c.anh_dap_an, diemToiDa: Number(c.diem_toi_da), maDang: c.ma_dang,
      ketQua: k?.ket_qua ?? null, diem: k ? Number(k.diem) : null,
    }
  })
}
const HE_SO: Record<'correct' | 'partial' | 'wrong', number> = { correct: 1, partial: 0.5, wrong: 0 }
// Click lại mức đang chọn = bỏ chấm (cùng UX ET đã có — HANDOFF ②).
export async function chamCauTest(caTestCauId: string, diemToiDa: number, ketQua: 'correct' | 'partial' | 'wrong' | null): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (ketQua === null) { const { error } = await supabase.from('ca_test_cau_kq').delete().eq('ca_test_cau_id', caTestCauId); if (error) throw error; return }
  const diem = diemToiDa * HE_SO[ketQua]
  const { error } = await supabase.from('ca_test_cau_kq').upsert({ ca_test_cau_id: caTestCauId, ket_qua: ketQua, diem, cham_boi: user?.id ?? null }, { onConflict: 'ca_test_cau_id' })
  if (error) throw error
}
export function tongDiem(cau: CaTestCau[]): { diem: number; toiDa: number; pct: number } {
  const toiDa = cau.reduce((s, c) => s + c.diemToiDa, 0)
  const diem = cau.reduce((s, c) => s + (c.diem ?? 0), 0)
  return { diem, toiDa, pct: toiDa ? Math.round((diem / toiDa) * 100) : 0 }
}
// Đóng chấm — mọi câu phải có kq (done-when spec). Auto tick 'cham_bai' ở ung_vien_viec (derive=true, xem tuyensinh.ts).
export async function dongChamTest(caTestId: string, ungVienId: string): Promise<void> {
  const cau = await getCaTestCauKq(caTestId)
  if (cau.some((c) => c.ketQua == null)) throw new Error('Còn câu chưa chấm.')
  const { error } = await supabase.from('ca_test').update({ cham_xong_at: new Date().toISOString() }).eq('id', caTestId).is('cham_xong_at', null)
  if (error) throw error
  await toggleViec(ungVienId, 'cham_bai', true).catch(() => {})
}
export async function moLaiChamTest(caTestId: string): Promise<void> {
  const { error } = await supabase.from('ca_test').update({ cham_xong_at: null }).eq('id', caTestId)
  if (error) throw error
}

// ============================================================================
// NHẬN XÉT (Story 3) — biểu đồ chuyên đề (derive từ Đ/C/S per câu, "chỉ để trông xịn") + nhận xét tay.
// ============================================================================
export type NhanXet = { trinhBay?: 'tot' | 'on' | 'kem'; tinhToan?: 'tot' | 'on' | 'kem'; kienThuc?: { hinhCoBan?: string; daiCoBan?: string; hinhNangCao?: string; daiNangCao?: string }; khac?: string }
export type CaTestChoNhanXet = CaTestChoCham & { deTestId: string }
export async function listCanNhanXet(): Promise<CaTestChoNhanXet[]> {
  const { data, error } = await supabase.from('ca_test')
    .select('id, ung_vien_id, mon, ngay, bai_url, de_test_id, ung_vien:ung_vien_id(ho_ten_hs, khoi)')
    .not('cham_xong_at', 'is', null).is('danh_gia_xong_at', null).order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, deTestId: r.de_test_id, hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null }))
}
export type BieuDoChuyenDe = { chuyenDe: string; diem: number; toiDa: number; pct: number }
// Gom Đ/C/S per câu (đã chấm) theo CHUYÊN ĐỀ của ma_dang neo — tra đúng kho theo MÔN (CLAUDE.md §1.6: có `mon` trong tay → dùng NGAY).
export async function getBieuDoChuyenDe(caTestId: string, mon: string): Promise<BieuDoChuyenDe[]> {
  const cau = await getCaTestCauKq(caTestId)
  const withDang = cau.filter((c) => c.maDang && c.ketQua != null)
  if (!withDang.length) return []
  const { banDoTbl } = khoCuaMon(mon)
  const maDangs = [...new Set(withDang.map((c) => c.maDang!))]
  const { data: map } = await supabase.from(banDoTbl).select('ma_dang, ten_chuyen_de').in('ma_dang', maDangs).limit(LIMIT)
  const tenChuyenDe = new Map(((map ?? []) as any[]).map((r) => [r.ma_dang, r.ten_chuyen_de as string]))
  const byCd = new Map<string, { diem: number; toiDa: number }>()
  for (const c of withDang) {
    const cd = tenChuyenDe.get(c.maDang!) ?? 'Khác'
    const g = byCd.get(cd) ?? { diem: 0, toiDa: 0 }
    g.diem += c.diem ?? 0; g.toiDa += c.diemToiDa
    byCd.set(cd, g)
  }
  return [...byCd.entries()].map(([chuyenDe, g]) => ({ chuyenDe, diem: g.diem, toiDa: g.toiDa, pct: g.toiDa ? Math.round((g.diem / g.toiDa) * 100) : 0 }))
}
export async function setNhanXet(caTestId: string, nhanXet: NhanXet): Promise<void> {
  const { error } = await supabase.from('ca_test').update({ nhan_xet: nhanXet }).eq('id', caTestId)
  if (error) throw error
}
// done-when: ≥1 mục nhận xét + lớp đề xuất đã chọn + đóng. Lớp đề xuất REUSE ung_vien.lop_du_kien_id.
export async function dongNhanXet(caTestId: string, ungVienId: string, lopDeXuatId: string | null): Promise<void> {
  if (!lopDeXuatId) throw new Error('Chưa chọn lớp đề xuất.')
  await updateUngVien(ungVienId, { lop_du_kien_id: lopDeXuatId })
  const { error } = await supabase.from('ca_test').update({ danh_gia_xong_at: new Date().toISOString() }).eq('id', caTestId).is('danh_gia_xong_at', null)
  if (error) throw error
}
export async function moLaiNhanXet(caTestId: string): Promise<void> {
  const { error } = await supabase.from('ca_test').update({ danh_gia_xong_at: null }).eq('id', caTestId)
  if (error) throw error
}
// Thư viện câu mẫu (gõ-để-tìm, mirror V1 sat_hach_nhan_xet_templates).
export type NhanXetMau = { id: string; mon: string; nhom: 'ky_nang' | 'kien_thuc' | 'khac'; noiDung: string }
export async function timNhanXetMau(mon: string, nhom: NhanXetMau['nhom'], q: string): Promise<NhanXetMau[]> {
  let query = supabase.from('nhan_xet_mau').select('*').eq('mon', mon).eq('nhom', nhom)
  if (q.trim()) query = query.ilike('noi_dung', `%${q.trim()}%`)
  const { data, error } = await query.order('created_at', { ascending: false }).limit(20)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, mon: r.mon, nhom: r.nhom, noiDung: r.noi_dung }))
}
export async function luuNhanXetMau(mon: string, nhom: NhanXetMau['nhom'], noiDung: string): Promise<void> {
  if (!noiDung.trim()) return
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('nhan_xet_mau').insert({ mon, nhom, noi_dung: noiDung.trim(), created_by: user?.id ?? null })
  if (error) throw error
}

// ============================================================================
// TRẢ BÀI (Story 4) — Ops xem/xuất phiếu → gửi Zalo → đóng. HẾT chuỗi.
// ============================================================================
export type CaTestChoTraBai = CaTestChoCham & { lopDeXuatId: string | null }
export async function listCanTraBai(): Promise<CaTestChoTraBai[]> {
  const { data, error } = await supabase.from('ca_test')
    .select('id, ung_vien_id, mon, ngay, bai_url, de_test_id, ung_vien:ung_vien_id(ho_ten_hs, khoi, lop_du_kien_id)')
    .not('danh_gia_xong_at', 'is', null).is('tra_bai_xong_at', null).order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, deTestId: r.de_test_id, hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null, lopDeXuatId: r.ung_vien?.lop_du_kien_id ?? null }))
}
export async function listDaTraBai(): Promise<CaTestChoTraBai[]> {
  const { data, error } = await supabase.from('ca_test')
    .select('id, ung_vien_id, mon, ngay, bai_url, de_test_id, ung_vien:ung_vien_id(ho_ten_hs, khoi, lop_du_kien_id)')
    .not('tra_bai_xong_at', 'is', null).order('tra_bai_xong_at', { ascending: false }).limit(100)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, deTestId: r.de_test_id, hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null, lopDeXuatId: r.ung_vien?.lop_du_kien_id ?? null }))
}
export async function dongTraBai(caTestId: string): Promise<void> {
  const { error } = await supabase.from('ca_test').update({ tra_bai_xong_at: new Date().toISOString() }).eq('id', caTestId).is('tra_bai_xong_at', null)
  if (error) throw error
}

// ── Dữ liệu ghép phiếu kết quả (§D) — điểm+%·biểu đồ·nhận xét·lớp đề xuất. Dùng cho card Nhận xét (preview) + Trả bài (xuất). ──
export type PhieuKetQua = {
  hoTenHs: string; khoi: string | null; mon: string; ngay: string
  diem: number; toiDa: number; pct: number
  bieuDo: BieuDoChuyenDe[]; nhanXet: NhanXet | null; lopDeXuatTen: string | null
}
export async function getPhieuKetQua(caTestId: string): Promise<PhieuKetQua> {
  const { data: ct, error } = await supabase.from('ca_test').select('mon, ngay, nhan_xet, ung_vien:ung_vien_id(ho_ten_hs, khoi, lop_du_kien_id)').eq('id', caTestId).single()
  if (error) throw error
  const r: any = ct
  const cau = await getCaTestCauKq(caTestId)
  const { diem, toiDa, pct } = tongDiem(cau)
  const bieuDo = await getBieuDoChuyenDe(caTestId, r.mon)
  let lopDeXuatTen: string | null = null
  if (r.ung_vien?.lop_du_kien_id) {
    const { data: lop } = await supabase.from('lop').select('ten_lop').eq('id', r.ung_vien.lop_du_kien_id).single()
    lopDeXuatTen = (lop as any)?.ten_lop ?? null
  }
  return { hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null, mon: r.mon, ngay: r.ngay, diem, toiDa, pct, bieuDo, nhanXet: r.nhan_xet ?? null, lopDeXuatTen }
}
