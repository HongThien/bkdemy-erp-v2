// ============================================================================
// "Phần 1 — Query" của trợ lý (CEO 18/08): model CHỈ chọn công cụ + điền tham số thô
// (xem src/lib/troly-tools.mjs). File này CHẠY Ở CLIENT, qua đúng `supabase` client
// bình thường (session thật người hỏi) → mọi RLS/quyền vẫn lọc y hệt UI — worker
// KHÔNG được tự trả data vì nó dùng service-role, bỏ qua RLS.
//
// ⭐ Resolve TÊN → id ở đây, KHÔNG để model tự đoán uuid (CLAUDE.md §2 "danh tính bám
// khoá tự nhiên"). Trùng tên ⇒ liệt kê để người hỏi gõ lại rõ hơn, KHÔNG tự chọn đại
// (§2 "lệch dù 1 phần tử ⇒ bỏ cả lượt, hỏi người" — áp cho cả việc chọn nhầm người).
// ============================================================================
import { supabase } from './supabase'
import { TROLY_TOOLS } from './troly-tools.mjs'
import { getTongQuanHS, getClassMatrix, type TongQuanHS, type ClassMatrix, type MatrixPhase } from './mastery'
import { getPhieuAo, type PhieuAo } from './hocphi'
import { tinhHieuSuatThang, type HieuSuatKy } from './giaoviec'

export { TROLY_TOOLS }

const thangHienTai = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// ── CHIỀU THỜI GIAN (CEO 19/08) — tu_thang/den_thang → danh sách tháng YYYY-MM.
// Trần 12 tháng: hỏi rộng hơn (vd "3 năm gần đây") vẫn chạy, nhưng CẮT và NÓI RÕ đã cắt
// (CLAUDE.md "không silent cap") — không âm thầm trả thiếu mà không ai biết.
const TRAN_THANG = 12
function thangTrongKhoang(thamSo: any): { thangs: string[]; daCat: boolean } {
  const tu = (thamSo?.tu_thang as string | undefined)?.trim() || thangHienTai()
  const den = (thamSo?.den_thang as string | undefined)?.trim()
  if (!den || den <= tu) return { thangs: [tu], daCat: false }
  const out: string[] = []
  let [y, m] = tu.split('-').map(Number)
  const [yEnd, mEnd] = den.split('-').map(Number)
  while ((y < yEnd || (y === yEnd && m <= mEnd)) && out.length < TRAN_THANG) {
    out.push(`${y}-${String(m).padStart(2, '0')}`)
    m++; if (m > 12) { m = 1; y++ }
  }
  const conThieu = y < yEnd || (y === yEnd && m <= mEnd)
  return { thangs: out, daCat: conThieu }
}

export type KetQuaCongCu =
  | { loai: 'loi'; thongDiep: string }
  | { loai: 'hoc_tap'; hoTen: string; maHs: string | null; mon: string; thang: string | null; data: TongQuanHS }
  | { loai: 'btvn_mt'; tenLop: string; phase: MatrixPhase; daCat: boolean; data: { thang: string; matrix: ClassMatrix }[] }
  | { loai: 'hoc_phi'; hoTen: string; daCat: boolean; data: { thang: string; phieu: PhieuAo }[] }
  | { loai: 'nhan_vien'; hoTen: string; daCat: boolean; data: { thang: string; hieuSuat: HieuSuatKy }[] }

// ── Tìm theo tên — trùng tên thì BẮT chọn lại, không tự đoán ────────────────
async function timHocSinhTheoTen(ten: string) {
  const { data, error } = await supabase.from('hoc_sinh')
    .select('id, ho_ten, ma_hs, khoi, phu_huynh_id')
    .ilike('ho_ten', `%${ten.trim()}%`).eq('trang_thai', 'dang_hoc').order('ho_ten').limit(8)
  if (error) throw error
  return (data ?? []) as { id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; phu_huynh_id: string | null }[]
}
// Môn HS đang học — query riêng (khuôn theo hocphi.ts, không đoán cú pháp embed ngược).
async function monCuaHocSinh(hocSinhId: string): Promise<string[]> {
  const { data, error } = await supabase.from('hoc_sinh_lop')
    .select('lop:lop_id(mon)').eq('hoc_sinh_id', hocSinhId).eq('trang_thai', 'dang_hoc').limit(20)
  if (error) throw error
  return [...new Set(((data ?? []) as any[]).map((r) => r.lop?.mon).filter(Boolean))]
}
async function timLopTheoTen(ten: string) {
  const { data, error } = await supabase.from('lop').select('id, ten_lop, mon').ilike('ten_lop', `%${ten.trim()}%`).limit(8)
  if (error) throw error
  return (data ?? []) as { id: string; ten_lop: string; mon: string }[]
}
// nhan_su chưa có hàm tìm theo tên (chỉ có listNhanSu() lấy hết) — viết riêng ở đây,
// khuôn theo listPhuHuynh() (nhansu.ts) chứ không sửa listNhanSu (tránh đụng chỗ dùng khác).
async function timNhanVienTheoTen(ten: string) {
  const { data, error } = await supabase.from('nhan_su').select('id, ho_ten, ma_ns, trang_thai')
    .ilike('ho_ten', `%${ten.trim()}%`).order('ho_ten').limit(8)
  if (error) throw error
  return (data ?? []) as { id: string; ho_ten: string; ma_ns?: string; trang_thai: string }[]
}

function loiTrungTen(loai: string, ten: string, ds: { ho_ten: string; phu?: string }[]): KetQuaCongCu {
  const ds2 = ds.map((d) => d.ho_ten + (d.phu ? ` (${d.phu})` : '')).join(', ')
  return { loai: 'loi', thongDiep: `Có ${ds.length} ${loai} tên gần giống "${ten}": ${ds2}. Hỏi lại rõ hơn (kèm lớp/mã) để chọn đúng người.` }
}

// ── Điều phối: model chọn tenCongCu + thamSo (thô) → resolve id → gọi đúng hàm data-layer ──
export async function chayCongCu(tenCongCu: string, thamSo: any): Promise<KetQuaCongCu> {
  if (tenCongCu === 'hoc_tap_hoc_sinh') {
    const ten = String(thamSo?.ten_hoc_sinh ?? '').trim()
    if (!ten) return { loai: 'loi', thongDiep: 'Thiếu tên học sinh.' }
    const ds = await timHocSinhTheoTen(ten)
    if (!ds.length) return { loai: 'loi', thongDiep: `Không tìm thấy học sinh nào tên "${ten}" đang học.` }
    if (ds.length > 1) return loiTrungTen('học sinh', ten, ds.map((h) => ({ ho_ten: h.ho_ten, phu: h.ma_hs ?? undefined })))
    const hs = ds[0]
    const mons = await monCuaHocSinh(hs.id)
    const mon = (thamSo?.mon as string | undefined) || mons[0]
    if (!mon) return { loai: 'loi', thongDiep: `${hs.ho_ten} hiện không học lớp nào — không có dữ liệu học tập.` }
    // KHÔNG dùng thangTrongKhoang ở đây — hàm gốc chỉ nhận 1 mốc (hoặc suy động toàn bộ lịch
    // sử nếu bỏ trống, đã là "mặc định thường đúng ý hơn" — xem mô tả công cụ).
    const thang = (thamSo?.thang as string | undefined)?.trim() || null
    const data = await getTongQuanHS(hs.id, mon, thang ? { ym: thang } : undefined)
    return { loai: 'hoc_tap', hoTen: hs.ho_ten, maHs: hs.ma_hs, mon, thang, data }
  }

  if (tenCongCu === 'ket_qua_btvn_lop' || tenCongCu === 'ket_qua_mt_lop') {
    const ten = String(thamSo?.ten_lop ?? '').trim()
    if (!ten) return { loai: 'loi', thongDiep: 'Thiếu tên lớp.' }
    const ds = await timLopTheoTen(ten)
    if (!ds.length) return { loai: 'loi', thongDiep: `Không tìm thấy lớp nào tên "${ten}".` }
    if (ds.length > 1) return loiTrungTen('lớp', ten, ds.map((l) => ({ ho_ten: l.ten_lop, phu: l.mon })))
    const lop = ds[0]
    const phase: MatrixPhase = tenCongCu === 'ket_qua_mt_lop' ? 'mt' : 'btvn'
    const { thangs, daCat } = thangTrongKhoang(thamSo)
    const data = await Promise.all(thangs.map(async (thang) => {
      let matrix = await getClassMatrix(lop.id, phase, thang)
      // "buổi gần nhất" — cắt matrix về đúng cột cuối, giữ nguyên shape để dùng chung 1 kiểu render.
      if (phase === 'btvn' && thamSo?.pham_vi === 'buoi_gan_nhat' && matrix.buois.length > 1) {
        const buoiCuoi = matrix.buois[matrix.buois.length - 1]
        const cells: typeof matrix.cells = {}
        for (const s of matrix.students) { const k = `${s.id}:${buoiCuoi.id}`; if (matrix.cells[k]) cells[k] = matrix.cells[k] }
        matrix = { buois: [buoiCuoi], students: matrix.students, cells }
      }
      return { thang, matrix }
    }))
    return { loai: 'btvn_mt', tenLop: lop.ten_lop, phase, daCat, data }
  }

  if (tenCongCu === 'hoc_phi_hoc_sinh') {
    const ten = String(thamSo?.ten_hoc_sinh ?? '').trim()
    if (!ten) return { loai: 'loi', thongDiep: 'Thiếu tên học sinh.' }
    const ds = await timHocSinhTheoTen(ten)
    if (!ds.length) return { loai: 'loi', thongDiep: `Không tìm thấy học sinh nào tên "${ten}" đang học.` }
    if (ds.length > 1) return loiTrungTen('học sinh', ten, ds.map((h) => ({ ho_ten: h.ho_ten, phu: h.ma_hs ?? undefined })))
    const hs = ds[0]
    if (!hs.phu_huynh_id) return { loai: 'loi', thongDiep: `${hs.ho_ten} chưa gắn phụ huynh trong hệ thống — không tra được học phí.` }
    const { thangs, daCat } = thangTrongKhoang(thamSo)
    const data = await Promise.all(thangs.map(async (thang) => ({ thang, phieu: await getPhieuAo(hs.phu_huynh_id!, `${thang}-01`) })))
    return { loai: 'hoc_phi', hoTen: hs.ho_ten, daCat, data }
  }

  if (tenCongCu === 'tinh_trang_nhan_vien') {
    const ten = String(thamSo?.ten_nhan_vien ?? '').trim()
    if (!ten) return { loai: 'loi', thongDiep: 'Thiếu tên nhân viên.' }
    const ds = await timNhanVienTheoTen(ten)
    if (!ds.length) return { loai: 'loi', thongDiep: `Không tìm thấy nhân viên nào tên "${ten}".` }
    if (ds.length > 1) return loiTrungTen('nhân viên', ten, ds.map((n) => ({ ho_ten: n.ho_ten, phu: n.ma_ns })))
    const nv = ds[0]
    const { thangs, daCat } = thangTrongKhoang(thamSo)
    const data = await Promise.all(thangs.map(async (thang) => ({ thang, hieuSuat: await tinhHieuSuatThang(nv.id, thang) })))
    return { loai: 'nhan_vien', hoTen: nv.ho_ten, daCat, data }
  }

  return { loai: 'loi', thongDiep: `Không nhận ra công cụ "${tenCongCu}".` }
}
