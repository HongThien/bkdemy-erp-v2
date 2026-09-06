// Data-layer TOOL GIẢI BÀI (giaibai.bkacademy.edu.vn — Thùy chốt 06/09, mig 202609060122).
// UI chỉ gọi hàm ở đây; mọi list/đếm/nhận/nộp/duyệt/báo cáo = fn_giaibai_* ở Postgres (§2.0).
// Nhánh ('toan'|'khtn'|'hgt'|'hinh_baitoan'|'hinh_bien_the') = khoá dispatch bảng phía SQL (fn_giaibai_tbl);
// phía TS chỉ giữ NHÃN + map môn→nhánh (mirror KHO_MON của kho/api.ts).
import { supabase } from './supabase'
import type { MenhDe } from './kho/api'

const LIMIT = 10000

export type GiaiBaiNhanh = 'toan' | 'khtn' | 'hgt' | 'hinh_baitoan' | 'hinh_bien_the'
export const NHANH_LABEL: Record<GiaiBaiNhanh, string> = {
  toan: 'Đại số', khtn: 'KHTN', hgt: 'Hình giải tích', hinh_baitoan: 'Hình · bài toán gốc', hinh_bien_the: 'Hình · biến thể',
}
// Môn (nhãn nhan_su_mon) → nhánh của tool. Toán = Đại + HGT + Hình(2 loại) · KHTN = 1 cây. Mirror KHO_MON (kho/api.ts)
// — không import api.ts để bundle tool không kéo cả data-layer kho/Gemini.
export const GIAIBAI_MON: { mon: string; nhanh: GiaiBaiNhanh[] }[] = [
  { mon: 'Toán', nhanh: ['toan', 'hgt', 'hinh_baitoan', 'hinh_bien_the'] },
  { mon: 'KHTN', nhanh: ['khtn'] },
]
export const nhanhCuaMon = (mon: string): GiaiBaiNhanh[] => GIAIBAI_MON.find((m) => m.mon === mon)?.nhanh ?? []
export const laHinh = (n: GiaiBaiNhanh) => n.startsWith('hinh_')

export type TrangThaiNhan = 'cho_claude' | 'da_xong' | 'dang_giai' | 'cho_duyet' | 'can_sua' | 'da_duyet' | 'da_tra' | 'qua_han' | 'tu_choi_3'
export const TRANG_THAI_LABEL: Record<TrangThaiNhan, string> = {
  cho_claude: 'Claude đang giải', da_xong: 'Claude đã giải', dang_giai: 'Đang giải', cho_duyet: 'Chờ duyệt', can_sua: 'Cần sửa',
  da_duyet: 'Đã duyệt', da_tra: 'Đã trả', qua_han: 'Quá hạn', tu_choi_3: 'Từ chối 3 lần',
}

// 1 BÀI chưa có lời giải (v_giaibai_bai) — kèm ai đang giữ (yc_* null = còn trong pool).
export type BaiChuaGiai = {
  nhanh: GiaiBaiNhanh; key: string; ma: string; khoi: string; mon: string
  nhom_ten: string; nhom_ma: string; nhom_truoc: string; muc_do: number | null
  loai_cau: string; de_bai: string; gia_thiet: string | null; anh: string | null
  lua_chon: string[] | null; menh_de: MenhDe[] | null; dap_an: string | null; nguon: string; created_at: string
  yc_id: string | null; yc_nguoi_giai: string | null; yc_nguoi_giai_ten: string | null; yc_trang_thai: TrangThaiNhan | null; yc_han_at: string | null; yc_created_at: string | null; yc_ghi_chu: string | null
  // Pool 'hoan_thien' (v_giaibai_hoan_thien): loi_giai_ai = bản Claude đã giải (xem trước trên card), ai_model=
  // 'claude_code'. Pool 'giai' (v_giaibai_bai): cả 4 đều null (cột thừa từ thiết kế worker API đã bỏ 06/09).
  loi_giai_ai: string | null; dap_an_ai: string | null; ai_model: string | null; ai_de_xuat_at: string | null
}
// 1 DÒNG NHẬN BÀI (v_giaibai_nhan) — của người hoặc Claude, mọi trạng thái.
export type DongNhan = {
  nhanh: GiaiBaiNhanh; id: string; key: string; ghi_chu: string | null; nguoi_yeu_cau: string | null; created_at: string; xu_ly_at: string | null
  nguoi_giai: string | null; trang_thai: TrangThaiNhan; han_at: string | null; nop_at: string | null; cap_nhat_at: string | null
  loi_giai_nhap: string | null; anh_nhap: string | null; dap_an_nhap: string | null
  tu_choi_lan: number; ly_do_tu_choi: string | null; tu_choi_at: string | null; duyet_boi: string | null; duyet_at: string | null
  so_ky_tu: number; so_cong_thuc: number
  ma: string; khoi: string; nhom_ten: string; nhom_ma: string; nhom_truoc: string; muc_do: number | null
  loai_cau: string; de_bai: string; gia_thiet: string | null; anh: string | null
  lua_chon: string[] | null; menh_de: MenhDe[] | null; dap_an: string | null; bai_loi_giai: string | null
  mon: string; dang_giu: boolean; qua_han: boolean; nguoi_giai_ten: string | null; duyet_boi_ten: string | null; giay_giai: number | null
  // che_do set lúc Nhận (mig 202609061526): 'hoan_thien' ⇒ loi_giai_ai = SNAPSHOT bản Claude gốc lúc nhận (bất
  // biến, để so với bản người sửa) · 'giai' ⇒ loi_giai_ai null (viết từ đầu).
  che_do: CheDo; loi_giai_ai: string | null; ai_model: string | null
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data as T
}

// ── 2 CHẾ ĐỘ (Thùy 06/09): 'giai' = giải TỪ ĐẦU — câu thiếu CẢ đáp án lẫn lời giải chi tiết (phòng lúc Claude
// có sự cố vẫn có việc làm) · 'hoan_thien' = trên NỀN Claude đã giải THẬT (nguon_giai='ai' + giai_method=
// 'claude_code', chưa duyệt — KHÔNG phải clone). 2 pool loại trừ nhau; fn_giaibai_nhan/duyệt TỰ DÒ theo câu,
// client chỉ truyền cheDo khi LIỆT KÊ pool. Hình: v_giaibai_hoan_thien lấy từ hinh_cach_giai/bien_the.
export type CheDo = 'giai' | 'hoan_thien'
export const CHE_DO_LABEL: Record<CheDo, string> = { giai: 'Giải', hoan_thien: 'Hoàn thiện' }

// ── Kho bài (pool) ──
export const listPool = (nhanh: GiaiBaiNhanh[], khoi: string | null, cheDo: CheDo = 'giai') =>
  rpc<BaiChuaGiai[]>('fn_giaibai_pool', { p_nhanh: nhanh, p_khoi: khoi, p_limit: LIMIT, p_che_do: cheDo }).then((r) => r ?? [])
export type DemPool = { khoi: string; so_bai: number }
export const demPool = (nhanh: GiaiBaiNhanh[], cheDo: CheDo = 'giai') =>
  rpc<DemPool[]>('fn_giaibai_dem_pool', { p_nhanh: nhanh, p_che_do: cheDo }).then((r) => r ?? [])

// ── Nhận / trả / nháp / nộp — DB tự chặn: >3 bài đang giữ · bài đã có người/Claude giữ · bị từ chối 3 lần ──
export const nhanBai = (nhanh: GiaiBaiNhanh, key: string, me: string) => rpc<string>('fn_giaibai_nhan', { p_nhanh: nhanh, p_key: key, p_me: me })
export const traBai = (nhanh: GiaiBaiNhanh, id: string, me: string) => rpc<void>('fn_giaibai_tra', { p_nhanh: nhanh, p_id: id, p_me: me })
export type NoiDungGiai = { loiGiai: string | null; anh: string | null; dapAn: string | null }
export const luuNhap = (nhanh: GiaiBaiNhanh, id: string, me: string, a: NoiDungGiai) =>
  rpc<void>('fn_giaibai_luu_nhap', { p_nhanh: nhanh, p_id: id, p_me: me, p_loi_giai: a.loiGiai, p_anh: a.anh, p_dap_an: a.dapAn })
export const nopBai = (nhanh: GiaiBaiNhanh, id: string, me: string, a: NoiDungGiai) =>
  rpc<void>('fn_giaibai_nop', { p_nhanh: nhanh, p_id: id, p_me: me, p_loi_giai: a.loiGiai, p_anh: a.anh, p_dap_an: a.dapAn })
export const listCuaToi = (me: string) => rpc<DongNhan[]>('fn_giaibai_cua_toi', { p_me: me }).then((r) => r ?? [])

// ── Duyệt (ghế học thuật đúng môn / admin — DB kiểm lại) ──
export const listChoDuyet = (nhanh: GiaiBaiNhanh[]) => rpc<DongNhan[]>('fn_giaibai_cho_duyet', { p_nhanh: nhanh }).then((r) => r ?? [])
export const duyetBai = (nhanh: GiaiBaiNhanh, id: string, me: string) => rpc<void>('fn_giaibai_duyet', { p_nhanh: nhanh, p_id: id, p_me: me })
export const tuChoiBai = (nhanh: GiaiBaiNhanh, id: string, me: string, lyDo: string) =>
  rpc<void>('fn_giaibai_tu_choi', { p_nhanh: nhanh, p_id: id, p_me: me, p_ly_do: lyDo })
export const laNguoiDuyet = (me: string, nhanh: GiaiBaiNhanh) => rpc<boolean>('fn_giaibai_la_nguoi_duyet', { p_me: me, p_nhanh: nhanh })

// ── Dashboard quản trị (ghế học thuật đúng môn / admin — DB kiểm lại): mỗi người đang giữ/chờ duyệt/đã duyệt bao nhiêu ──
export type DashboardHang = {
  nhan_su_id: string; ho_ten: string
  dang_giu: number; qua_han: number; cho_duyet: number; da_duyet: number; tu_choi_3: number; da_tra: number
}
export const dashboard = (nhanh: GiaiBaiNhanh[], me: string) => rpc<DashboardHang[]>('fn_giaibai_dashboard', { p_nhanh: nhanh, p_me: me }).then((r) => r ?? [])

// ── Báo cáo (bài đã duyệt trong khoảng ngày VN, theo duyet_at) — Thùy tự tính tiền từ đây ──
export type BaoCaoTong = {
  nguoi_giai: string; ho_ten: string; so_bai: number; md1: number; md2: number; md3: number; md4: number; md5: number; md_khac: number
  tong_ky_tu: number; tong_cong_thuc: number; tb_giay_giai: number | null
}
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const baoCaoTong = (tu: Date, den: Date) => rpc<BaoCaoTong[]>('fn_giaibai_bao_cao_tong', { p_tu: ymd(tu), p_den: ymd(den) }).then((r) => r ?? [])
export const baoCaoChiTiet = (tu: Date, den: Date) => rpc<DongNhan[]>('fn_giaibai_bao_cao_chi_tiet', { p_tu: ymd(tu), p_den: ymd(den) }).then((r) => r ?? [])

// ── Format hiển thị ──
export const fmtTs = (s: string | null | undefined) => s ? new Date(s).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : ''
export function conLai(hanAt: string | null): { text: string; gap: boolean } {
  if (!hanAt) return { text: '', gap: false }
  const ms = new Date(hanAt).getTime() - Date.now()
  if (ms <= 0) return { text: 'quá hạn', gap: true }
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000)
  return { text: h >= 1 ? `còn ${h}h${m ? String(m).padStart(2, '0') : ''}` : `còn ${m} phút`, gap: h < 6 }
}
export const fmtGiay = (s: number | null) => s == null ? '' : s < 3600 ? `${Math.round(s / 60)} phút` : `${(s / 3600).toFixed(1)} giờ`
export const LOAI_CAU_LABEL: Record<string, string> = {
  tra_loi_ngan: 'Trả lời ngắn', tu_luan: 'Tự luận', trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng/Sai',
  bai_toan_goc: 'Bài toán gốc', bien_the_doi_so: 'Biến thể đổi số', bien_the_doi_dinh: 'Biến thể đổi đỉnh', bien_the_ca_hai: 'Biến thể đổi số + đỉnh',
}
