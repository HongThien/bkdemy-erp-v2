// Data-layer "Test đầu vào — Chấm + Trả bài (gồm nhận xét)" (BKDEMY_TESTDAUVAO_SPEC_ADDENDUM.md).
// ca_test (tuyensinh.ts) = "buổi test". File này nối tiếp: gán đề (snapshot từ Kho MT) → chấm Đ/C/S
// per câu ∥ scan bài đã chấm (2 nguồn ĐỘC LẬP) → Trả bài (gộp nhận xét + biểu đồ + lớp đề xuất + phiếu,
// Thùy chốt 07-19: "ở trong task trả bài đó" — KHÔNG còn là bước riêng gate giữa Chấm và Trả bài).
// ⭐ Đề = CHỌN THẲNG 1 tài liệu MT trong Kho (mig 0105, bỏ hẳn de_test — Thùy chốt 07-19: "chọn trong
// kho MT có filter khối là được"). ca_test.tai_lieu_id trỏ THẲNG tai_lieu (không qua lớp trung gian).
// KHÔNG feed mastery (§A cố ý).
import { supabase } from './supabase'
import { khoCuaMon, layCauTheoThuTu } from './tailieu'
import { updateUngVien, toggleViec } from './tuyensinh'
import type { MenhDe } from './kho/api'

const LIMIT = 10000

// ============================================================================
// GÁN ĐỀ vào ca_test — SNAPSHOT câu THẬT từ tài liệu MT (anti-live-ref: đổi/sửa MT sau KHÔNG hỏng bài
// đã chấm). Đổi đề (Ops đổi tại phòng, HS kêu khó) = XOÁ SẠCH câu cũ rồi snapshot lại câu mới — Thùy
// chốt 07-19: "xoá câu đề cũ trước khi snapshot đề mới" (tránh chồng câu cũ+mới nếu đổi đề 2 lần).
// ============================================================================
export async function ganDeCaTest(caTestId: string, taiLieuId: string): Promise<void> {
  const cau = await layCauTheoThuTu(taiLieuId)
  if (!cau.length) throw new Error('Tài liệu chưa có câu nào.')
  const { data: cauCu } = await supabase.from('ca_test_cau').select('id').eq('ca_test_id', caTestId).limit(LIMIT)
  const idCu = ((cauCu ?? []) as any[]).map((c) => c.id)
  if (idCu.length) {
    // Xoá kết quả chấm CỦA ĐỀ CŨ trước (FK con) rồi mới xoá câu — HS lỡ được chấm 1 phần trước khi đổi
    // đề thì kết quả đó không còn ý nghĩa (câu đã đổi hẳn sang đề khác).
    await supabase.from('ca_test_cau_kq').delete().in('ca_test_cau_id', idCu)
    await supabase.from('ca_test_cau').delete().in('id', idCu)
  }
  const { error: e1 } = await supabase.from('ca_test').update({ tai_lieu_id: taiLieuId }).eq('id', caTestId)
  if (e1) throw e1
  // Đúng/Sai (menh_de) snapshot NGUYÊN 1 câu (4 mệnh đề) — chấm HOLISTIC 1 mức Đ/C/S cho cả câu.
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
// CHẤM TEST (Story 2) — pool team học thuật, ai mở thì làm. Bảng nhập liệu Đ/C/S THUẦN (Thùy 07-19:
// "bỏ cột scan" — người chấm chấm từ giấy NGOÀI hệ thống, không cần xem lại scan trên màn).
// ============================================================================
export type CaTestCau = {
  id: string; thuTu: number; maCau: string | null; loaiCau: string | null; noiDung: string | null
  luaChon: string[] | null; menhDe: MenhDe[] | null; dapAn: string | null; loiGiai: string | null
  anhDe: string | null; anhDapAn: string | null; diemToiDa: number; maDang: string | null
  ketQua: 'correct' | 'partial' | 'wrong' | null; diem: number | null
}
export type CaTestChoCham = {
  id: string; ungVienId: string; mon: string; ngay: string; baiUrl: string | null; taiLieuId: string | null
  hoTenHs: string; khoi: string | null
}
// Hàng đợi CHUNG (team học thuật) — đã điểm danh xong (có đề gán) + chưa chấm xong.
export async function listCanCham(): Promise<CaTestChoCham[]> {
  const { data, error } = await supabase.from('ca_test')
    .select('id, ung_vien_id, mon, ngay, bai_url, tai_lieu_id, cham_xong_at, trang_thai, ung_vien:ung_vien_id(ho_ten_hs, khoi)')
    .eq('trang_thai', 'hoan_thanh').not('tai_lieu_id', 'is', null).is('cham_xong_at', null)
    .order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, taiLieuId: r.tai_lieu_id, hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null }))
}
export async function listDaCham(ngay?: string): Promise<CaTestChoCham[]> {
  let q = supabase.from('ca_test').select('id, ung_vien_id, mon, ngay, bai_url, tai_lieu_id, ung_vien:ung_vien_id(ho_ten_hs, khoi)').not('cham_xong_at', 'is', null)
  if (ngay) q = q.eq('ngay', ngay)
  const { data, error } = await q.order('cham_xong_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, taiLieuId: r.tai_lieu_id, hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null }))
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
// Đóng chấm — mọi câu phải có kq (done-when spec). Auto tick 'cham_bai' ở ung_vien_viec (derive=true, xem tuyensinh.ts) — giữ nguyên hành vi cũ.
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
// SCAN BÀI ĐÃ CHẤM (task Ops MỚI, addendum §1 Task 3) — ĐỘC LẬP với Chấm, không ép thứ tự. Người chấm
// khoanh Đ/C/S trên giấy xong → đưa Ops → Ops scan → upload (KHÁC bai_url = bài CHƯA chấm ở Điểm danh).
// ============================================================================
export type CaTestChoScanDaCham = CaTestChoCham
export async function listCanScanDaCham(): Promise<CaTestChoScanDaCham[]> {
  const { data, error } = await supabase.from('ca_test')
    .select('id, ung_vien_id, mon, ngay, bai_url, tai_lieu_id, ung_vien:ung_vien_id(ho_ten_hs, khoi)')
    .eq('trang_thai', 'hoan_thanh').is('bai_da_cham_url', null).order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, taiLieuId: r.tai_lieu_id, hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null }))
}
export async function listDaScanDaCham(ngay?: string): Promise<CaTestChoScanDaCham[]> {
  let q = supabase.from('ca_test').select('id, ung_vien_id, mon, ngay, bai_url, tai_lieu_id, ung_vien:ung_vien_id(ho_ten_hs, khoi)').not('bai_da_cham_url', 'is', null)
  if (ngay) q = q.eq('ngay', ngay)
  const { data, error } = await q.order('ngay', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, taiLieuId: r.tai_lieu_id, hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null }))
}
export async function dongScanDaCham(caTestId: string, url: string): Promise<void> {
  if (!url) throw new Error('Cần ảnh/scan bài đã chấm.')
  const { error } = await supabase.from('ca_test').update({ bai_da_cham_url: url }).eq('id', caTestId)
  if (error) throw error
}

// ============================================================================
// NHẬN XÉT — biểu đồ chuyên đề (derive từ Đ/C/S per câu, "chỉ để trông xịn") + nhận xét tay + lớp đề
// xuất. Thùy chốt 07-19: KHÔNG còn là bước/gate riêng — nhập NGAY TRONG Trả bài (xem mục dưới).
// ============================================================================
export type NhanXet = { trinhBay?: 'tot' | 'on' | 'kem'; tinhToan?: 'tot' | 'on' | 'kem'; kienThuc?: { hinhCoBan?: string; daiCoBan?: string; hinhNangCao?: string; daiNangCao?: string }; khac?: string }
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
// Lưu nháp nhận xét — gọi bất cứ lúc nào (autosave khi gõ), KHÔNG gate gì.
export async function setNhanXet(caTestId: string, nhanXet: NhanXet): Promise<void> {
  const { error } = await supabase.from('ca_test').update({ nhan_xet: nhanXet }).eq('id', caTestId)
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
// TRẢ BÀI (Story 4) — sinh SỚM ngay khi điểm danh đóng (trang_thai='hoan_thanh'), nhưng CHẶN ĐÓNG tới
// khi ĐỦ: chấm xong + có scan-đã-chấm + đã chọn lớp đề xuất (nhận xét gộp vào đây — Thùy chốt 07-19).
// Card báo rõ đang thiếu gì. Ops xem/xuất phiếu (kèm bài đã chấm) → gửi Zalo → đóng. HẾT chuỗi.
// ============================================================================
export type CaTestChoTraBai = CaTestChoCham & {
  choChamXong: boolean; choScanDaCham: boolean; choLopDeXuat: boolean
  baiDaChamUrl: string | null; lopDeXuatId: string | null; nhanXet: NhanXet | null
}
function mapTraBai(r: any): CaTestChoTraBai {
  return {
    id: r.id, ungVienId: r.ung_vien_id, mon: r.mon, ngay: r.ngay, baiUrl: r.bai_url, taiLieuId: r.tai_lieu_id,
    hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null,
    choChamXong: !r.cham_xong_at, choScanDaCham: !r.bai_da_cham_url, choLopDeXuat: !r.ung_vien?.lop_du_kien_id,
    baiDaChamUrl: r.bai_da_cham_url ?? null, lopDeXuatId: r.ung_vien?.lop_du_kien_id ?? null, nhanXet: r.nhan_xet ?? null,
  }
}
const TRA_BAI_SELECT = 'id, ung_vien_id, mon, ngay, bai_url, tai_lieu_id, cham_xong_at, bai_da_cham_url, nhan_xet, ung_vien:ung_vien_id(ho_ten_hs, khoi, lop_du_kien_id)'
export async function listCanTraBai(): Promise<CaTestChoTraBai[]> {
  const { data, error } = await supabase.from('ca_test').select(TRA_BAI_SELECT)
    .eq('trang_thai', 'hoan_thanh').is('tra_bai_xong_at', null).order('ngay').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map(mapTraBai)
}
export async function listDaTraBai(): Promise<CaTestChoTraBai[]> {
  const { data, error } = await supabase.from('ca_test').select(TRA_BAI_SELECT)
    .not('tra_bai_xong_at', 'is', null).order('tra_bai_xong_at', { ascending: false }).limit(100)
  if (error) throw error
  return (data ?? []).map(mapTraBai)
}
// Đóng trả bài — validate ĐỦ 3 nguồn trước khi đóng (evidence-trước-khi-đóng). lopDeXuatId bắt buộc
// (ghi ung_vien.lop_du_kien_id, REUSE, cùng field cũ dongNhanXet từng ghi).
export async function dongTraBai(caTestId: string, ungVienId: string, lopDeXuatId: string | null): Promise<void> {
  const { data: ct, error: e0 } = await supabase.from('ca_test').select('cham_xong_at, bai_da_cham_url').eq('id', caTestId).single()
  if (e0) throw e0
  const r: any = ct
  if (!r.cham_xong_at) throw new Error('Chưa chấm xong.')
  if (!r.bai_da_cham_url) throw new Error('Chưa có bài scan đã chấm.')
  if (!lopDeXuatId) throw new Error('Chưa chọn lớp đề xuất.')
  await updateUngVien(ungVienId, { lop_du_kien_id: lopDeXuatId })
  const { error } = await supabase.from('ca_test').update({ danh_gia_xong_at: new Date().toISOString(), tra_bai_xong_at: new Date().toISOString() }).eq('id', caTestId).is('tra_bai_xong_at', null)
  if (error) throw error
}

// ── Dữ liệu ghép phiếu kết quả (§D) — điểm+%·biểu đồ·nhận xét·lớp đề xuất·bài đã chấm. ──
export type PhieuKetQua = {
  hoTenHs: string; khoi: string | null; mon: string; ngay: string
  diem: number; toiDa: number; pct: number
  bieuDo: BieuDoChuyenDe[]; nhanXet: NhanXet | null; lopDeXuatTen: string | null; baiDaChamUrl: string | null
}
export async function getPhieuKetQua(caTestId: string): Promise<PhieuKetQua> {
  const { data: ct, error } = await supabase.from('ca_test').select('mon, ngay, nhan_xet, bai_da_cham_url, ung_vien:ung_vien_id(ho_ten_hs, khoi, lop_du_kien_id)').eq('id', caTestId).single()
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
  return { hoTenHs: r.ung_vien?.ho_ten_hs ?? '?', khoi: r.ung_vien?.khoi ?? null, mon: r.mon, ngay: r.ngay, diem, toiDa, pct, bieuDo, nhanXet: r.nhan_xet ?? null, lopDeXuatTen, baiDaChamUrl: r.bai_da_cham_url ?? null }
}
