// Data-layer GAMI (seam) — luồng buổi học chính: mở buổi → điểm danh → chấm → đóng phase.
// UI chỉ gọi qua đây. Engine thuần ở src/gami/*.js (đã test). Buổi pure-derive: đẻ dòng khi MỞ.
import { supabase } from './supabase'
import { getMyProfile } from './nhansu'
import { getETByBuoi, getETCaus, getBTVNByBuoi, getBTVNCaus, getGiaoTrinhBuoiDoc, khoCuaMon, laMaHinh } from './tailieu'
import { getMTInstanceByBuoi, getMTPhanCaus, type MTPhanCaus } from './mt'
import { loadHinhForBuoi, type HinhDapAn } from './kho/hinhGiaoTrinh'
import { getBaiTestByDoc, getBaiTestCaus, type BaiTest, type BaiTestCau } from './testonline'
import type { CauHoi } from './kho/api'
// Engine Elo/EXP đã XUỐNG DB (fn_dong_phase/fn_recompute_exp_thang — mig 202608300240, §2.0).
// src/gami/elo.js + exp.js chỉ còn problemPoints (điểm 1 bài lúc chấm) + tham chiếu công thức.
import { problemPoints } from '../gami/exp.js'
import { SEASON } from '../gami/config.js'
import { seasonOf, seasonLabel, seasonStartUtc } from '../gami/season.js'
import { vnInstant, congNgay } from './tuan'

const LIMIT = 10000

// Ngày hôm nay theo giờ VN ('YYYY-MM-DD') — KHÔNG toISOString (§2). Dịch +7h rồi đọc phần UTC.
function vnToday(): string {
  const vn = new Date(Date.now() + 7 * 3600 * 1000)
  return `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, '0')}-${String(vn.getUTCDate()).padStart(2, '0')}`
}

export type Phase = 'ingame' | 'et' | 'mt' | 'btvn'
export type DiemDanh = 'co_mat' | 'vang' | 'vang_phep'
export type BuoiHoc = {
  id: string; ma_buoi: string | null; loai: 'thuong' | 'bu' | 'bo_tro_yeu' | 'bo_tro_duoi' | 'mt'
  lop_id: string | null; ngay: string; thu: number | null; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null
  nguoi_day: string | null; nguoi_day_tg: string | null; trang_thai: 'mo' | 'hoan_tat' | 'huy'; ly_do_huy: string | null
  ingame_dong_at: string | null; et_dong_at: string | null; danh_gia_xong_at: string | null; btvn_dong_at?: string | null; mt_dong_at?: string | null
  noi_dung_buoi?: string | null; mo_ta?: string | null
}
export type BuoiHocHS = { id: string; buoi_hoc_id: string; hoc_sinh_id: string; diem_danh: DiemDanh | null; bao_den_at: string | null; bu_cho_buoi_id: string | null; bo_tro_duoi_id?: string | null; hoc_sinh?: { ho_ten: string; ma_hs: string | null; anh_url: string | null } }
export type Problem = {
  id: string; buoi_hoc_id: string; phase: Phase; problem_no: number; hidden: boolean; ma_dang: string | null; ma_cau?: string | null; hoc_sinh_id?: string | null
  hinh_baitoan_id?: string | null; hinh_bien_the_id?: string | null; hinh_y_id?: string | null; hinh_nhan?: string | null
}
export type Grade = { id: string; problem_id: string; hoc_sinh_id: string; result: string; presentation: string; speed: string; points: number; loi?: string[]; muc?: number | null }
export type ETResult = 'correct' | 'partial' | 'wrong'

// ── helpers ngày/mã (giờ VN) ──────────────────────────────────────
function thuOf(ngay: string): number { const d = new Date(ngay + 'T00:00:00').getDay(); return d === 0 ? 8 : d + 1 } // CN=8, T2=2..T7=7
const thuLabel = (t: number) => (t === 8 ? 'CN' : 'T' + t)
function maBuoi(tenLop: string, thu: number, ngay: string, suffix = ''): string {
  const [y, m, d] = ngay.split('-'); return `${tenLop}.${thuLabel(thu)}.${d}${m}${y}${suffix}`
}

// ── BUỔI ẢO: suy từ TKB × ngày (chưa đẻ dòng) ─────────────────────
export type BuoiAo = { lop: { id: string; ten_lop: string; mon: string; khoi: string | null; bac: string | null }; slot: { gio_bat_dau: string; gio_ket_thuc: string; phong: string | null }; buoi: BuoiHoc | null }
export async function buoiAoCuaNgay(ngay: string): Promise<BuoiAo[]> {
  const thu = thuOf(ngay)
  const { data: slots, error } = await supabase.from('thoi_khoa_bieu')
    .select('gio_bat_dau, gio_ket_thuc, phong, hieu_luc_den, lop:lop_id(id, ten_lop, mon, khoi, bac, ngay_khai_giang, trang_thai)')
    .eq('thu', thu).lte('hieu_luc_tu', ngay).limit(LIMIT)
  if (error) throw error
  const hieuLuc = (slots ?? []).filter((s: any) =>
    (!s.hieu_luc_den || s.hieu_luc_den >= ngay) && s.lop?.trang_thai === 'dang_hoc' &&
    s.lop?.ngay_khai_giang && s.lop.ngay_khai_giang <= ngay)
  if (!hieuLuc.length) return []
  const lopIds = [...new Set(hieuLuc.map((s: any) => s.lop.id))]
  const { data: opened } = await supabase.from('buoi_hoc').select('*').eq('ngay', ngay).eq('loai', 'thuong').in('lop_id', lopIds).limit(LIMIT)
  const openMap = new Map((opened ?? []).map((b: any) => [b.lop_id, b]))
  return hieuLuc.map((s: any) => ({ lop: s.lop, slot: { gio_bat_dau: s.gio_bat_dau, gio_ket_thuc: s.gio_ket_thuc, phong: s.phong }, buoi: (openMap.get(s.lop.id) as BuoiHoc) ?? null }))
}

// ── NGÀY HỢP LỆ CỦA 1 LỚP: suy từ TKB trong [tuNgay, denNgay] — chặn chọn ngày ngoài lịch khi gán tài liệu ──
export async function ngayBuoiHopLeCuaLop(lopId: string, tuNgay: string, denNgay: string): Promise<{ ngay: string; thu: number }[]> {
  const { data: lop } = await supabase.from('lop').select('ngay_khai_giang').eq('id', lopId).maybeSingle()
  const { data: slots } = await supabase.from('thoi_khoa_bieu').select('thu, hieu_luc_tu, hieu_luc_den').eq('lop_id', lopId).limit(LIMIT)
  if (!slots?.length) return []
  const khaiGiang = (lop as any)?.ngay_khai_giang as string | undefined
  let d = khaiGiang && khaiGiang > tuNgay ? khaiGiang : tuNgay
  const out: { ngay: string; thu: number }[] = []
  while (d <= denNgay) {
    const thu = thuOf(d)
    if (slots.some((s: any) => s.thu === thu && s.hieu_luc_tu <= d && (!s.hieu_luc_den || s.hieu_luc_den >= d))) out.push({ ngay: d, thu })
    d = congNgay(d, 1)
  }
  return out
}

// ── MỞ BUỔI: đẻ dòng snapshot + seed sĩ số từ ghi danh (idempotent) ──
export async function moBuoi(lopId: string, ngay: string, slot: { gio_bat_dau?: string; gio_ket_thuc?: string; phong?: string | null }): Promise<BuoiHoc> {
  const ex = await supabase.from('buoi_hoc').select('*').eq('lop_id', lopId).eq('ngay', ngay).eq('loai', 'thuong').maybeSingle()
  if (ex.data) return ex.data as BuoiHoc
  const { data: lop, error: eLop } = await supabase.from('lop').select('ten_lop').eq('id', lopId).single()
  if (eLop) throw eLop
  const thu = thuOf(ngay)
  const { data: { user } } = await supabase.auth.getUser()
  // GV chính phụ trách lớp (mặc định người dạy; dạy thay đổi sau)
  const { data: pc } = await supabase.from('phan_cong_lop').select('nhan_su_id').eq('lop_id', lopId).eq('vai_tro', 'gv').eq('la_chinh', true).maybeSingle()
  const { data: buoi, error } = await supabase.from('buoi_hoc').insert({
    ma_buoi: maBuoi((lop as any).ten_lop, thu, ngay), loai: 'thuong', lop_id: lopId, ngay, thu,
    gio_bat_dau: slot.gio_bat_dau ?? null, gio_ket_thuc: slot.gio_ket_thuc ?? null, phong: slot.phong ?? null,
    nguoi_day: (pc as any)?.nhan_su_id ?? null, created_by: user?.id ?? null,
  }).select().single()
  if (error) throw error
  // seed sĩ số = HS đang ghi danh lớp, đã vào lớp tính tới ngày
  const { data: hs } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, ngay_vao').eq('lop_id', lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  const roster = (hs ?? []).filter((h: any) => !h.ngay_vao || h.ngay_vao <= ngay)
  if (roster.length) await supabase.from('buoi_hoc_hs').insert(roster.map((h: any) => ({ buoi_hoc_id: (buoi as any).id, hoc_sinh_id: h.hoc_sinh_id })))
  return buoi as BuoiHoc
}

export async function getBuoi(id: string): Promise<BuoiHoc & { lop?: { ten_lop: string; mon: string; khoi: string | null }; gv_chinh_id: string | null }> {
  const { data, error } = await supabase.from('buoi_hoc').select('*, lop:lop_id(ten_lop, mon, khoi)').eq('id', id).single()
  if (error) throw error
  // GV chính của lớp (mặc định hiển thị khi nguoi_day trống — dạy thay mới ghi nguoi_day).
  // ⚠ Buổi bù/đuổi KHÔNG có lớp (`lop_id` null) ⇒ `.eq('lop_id', null)` gửi chuỗi "null" cho cột uuid →
  // Postgres 400 `invalid input syntax for type uuid` mỗi lần mở buổi bù. Không vỡ gì (pc undefined →
  // null) nên sống lâu trong console, nhưng là request hỏng vô ích: không có lớp thì không có GV chính.
  const lopId = (data as any).lop_id as string | null
  const { data: pc } = lopId
    ? await supabase.from('phan_cong_lop').select('nhan_su_id').eq('lop_id', lopId).eq('vai_tro', 'gv').eq('la_chinh', true).maybeSingle()
    : { data: null }
  return { ...(data as any), gv_chinh_id: (pc as any)?.nhan_su_id ?? null }
}
export async function setNguoiDay(buoiId: string, nhanSuId: string | null): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ nguoi_day: nhanSuId, updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
}
// Tên dạng theo ma_dang. Cho chỗ hiển thị dạng KHÔNG có khối context (vd buổi bù).
// ⭐ 07-07 bug thật: `ma_dang` KHÔNG unique xuyên môn (Toán/KHTN tự đánh số riêng, 17 mã hiện TRÙNG
// SỐ — vd '09010301' vừa là 1 dạng Toán vừa là 1 dạng KHTN) và `gami_session_problems` KHÔNG có cột
// `mon` (đúng gap đã biết trước, CLAUDE.md §1.6). Buổi bù 9C1 (Toán) hiện tên dạng KHTN vì tra CẢ 2
// bảng rồi gộp — bảng sau (khtn_ban_do) ĐÈ tên bảng trước cho mã trùng.
// → BẮT BUỘC truyền `mon` khi biết (context có mon, vd buổi bù suy mon từ buổi MẸ của từng HS) để
// CHỈ tra ĐÚNG 1 bảng, tránh đụng độ. Không có mon (call site cũ/chưa sửa) → fallback tra cả 2 (giữ
// hành vi cũ, vẫn có rủi ro đụng độ y hệt trước — nên truyền mon bất cứ khi nào có thể).
export async function getDangTen(maDangs: string[], mon?: string): Promise<Record<string, string>> {
  const uniq = [...new Set(maDangs.filter(Boolean))]
  if (!uniq.length) return {}
  const out: Record<string, string> = {}
  const tbls = mon ? [khoCuaMon(mon).banDoTbl] : ['dai_ban_do', 'khtn_ban_do']
  for (const tbl of tbls) {
    const { data } = await supabase.from(tbl).select('ma_dang, ten_dang').in('ma_dang', uniq).limit(LIMIT)
    for (const r of (data ?? []) as any[]) out[r.ma_dang] = r.ten_dang
  }
  return out
}
// Sửa thông tin buổi (bù/đuổi): ngày/giờ/phòng/GV/TA trong 1 lượt. Generic cho buoi_hoc.
export async function updateBuoiMeta(buoiId: string, patch: { ngay?: string; gio_bat_dau?: string | null; gio_ket_thuc?: string | null; phong?: string | null; nguoi_day?: string | null; nguoi_day_tg?: string | null }): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
}
// Nội dung buổi học (hiện trên ảnh gửi PH) + Mô tả (nội bộ) — cấp BUỔI, nhập ở tab Đánh giá sau buổi.
export async function setNoiDungBuoi(buoiId: string, patch: { noi_dung_buoi?: string | null; mo_ta?: string | null }): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
}
export async function huyBuoi(buoiId: string, lyDo: string): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ trang_thai: 'huy', ly_do_huy: lyDo, updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
}
// Hủy buổi tại danh sách (cả khi CHƯA mở): có dòng → set huy; chưa có → đẻ dòng huy luôn (không seed sĩ số).
// Hủy trước khi mở = kế hoạch · hủy sau khi mở = sự cố — cùng kết quả: buổi sang "Đã hủy".
export async function huyBuoiCuaNgay(lopId: string, ngay: string, slot: { gio_bat_dau?: string; gio_ket_thuc?: string; phong?: string | null }, lyDo: string): Promise<void> {
  const ex = await supabase.from('buoi_hoc').select('id').eq('lop_id', lopId).eq('ngay', ngay).eq('loai', 'thuong').maybeSingle()
  if (ex.data) { await huyBuoi((ex.data as any).id, lyDo); return }
  const { data: lop, error: eLop } = await supabase.from('lop').select('ten_lop').eq('id', lopId).single()
  if (eLop) throw eLop
  const thu = thuOf(ngay)
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('buoi_hoc').insert({
    ma_buoi: maBuoi((lop as any).ten_lop, thu, ngay), loai: 'thuong', lop_id: lopId, ngay, thu,
    gio_bat_dau: slot.gio_bat_dau ?? null, gio_ket_thuc: slot.gio_ket_thuc ?? null, phong: slot.phong ?? null,
    trang_thai: 'huy', ly_do_huy: lyDo, created_by: user?.id ?? null,
  })
  if (error) throw error
}

// Mở lại buổi ĐÃ HUỶ (hủy nhầm). Đảo đúng đường đã hủy: trang_thai → mo, xoá lý do. Buổi hủy TRƯỚC khi mở
// (dòng do huyBuoiCuaNgay đẻ, chưa có sĩ số, chưa có GV) thì seed y hệt moBuoi: GV chính của lớp + roster
// từ ghi danh (qua dongBoSiSo — chỉ THÊM HS thiếu, nên buổi hủy SAU khi mở giữ nguyên điểm danh/chấm cũ).
// Không xoá dòng để quay về "Chưa mở": giữ vết + tránh cấp lại id; kết quả = buổi "Đang mở".
export async function moLaiBuoiDaHuy(buoiId: string): Promise<void> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('lop_id, trang_thai, nguoi_day').eq('id', buoiId).single()
  if (error) throw error
  if ((b as any).trang_thai !== 'huy') return
  const patch: Record<string, unknown> = { trang_thai: 'mo', ly_do_huy: null, updated_at: new Date().toISOString() }
  if (!(b as any).nguoi_day && (b as any).lop_id) {
    const { data: pc } = await supabase.from('phan_cong_lop').select('nhan_su_id').eq('lop_id', (b as any).lop_id).eq('vai_tro', 'gv').eq('la_chinh', true).maybeSingle()
    if ((pc as any)?.nhan_su_id) patch.nguoi_day = (pc as any).nhan_su_id
  }
  const { error: eUp } = await supabase.from('buoi_hoc').update(patch).eq('id', buoiId).eq('trang_thai', 'huy')
  if (eUp) throw eUp
  await dongBoSiSo(buoiId)
}

// ── Sĩ số + điểm danh (OPS) ───────────────────────────────────────
export async function getRoster(buoiId: string): Promise<BuoiHocHS[]> {
  const { data, error } = await supabase.from('buoi_hoc_hs').select('*, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs, anh_url)').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  if (error) throw error
  // Thứ tự ỔN ĐỊNH theo tên HS (tie-break id). PostgREST không order được theo cột bảng nhúng;
  // không sort thì sau mỗi UPDATE điểm danh, dòng vừa sửa nhảy chỗ (MVCC) → roster loạn thứ tự.
  const rows = (data ?? []) as BuoiHocHS[]
  rows.sort((a, b) =>
    (a.hoc_sinh?.ho_ten ?? '').localeCompare(b.hoc_sinh?.ho_ten ?? '', 'vi') || a.id.localeCompare(b.id))
  return rows
}
// HS CÓ MẶT của buổi (lớp+ngày) — cho gán mã đề ET theo HS (in phiếu tên sẵn). Đọc buổi 'thuong' của
// lớp+ngày rồi lọc buoi_hoc_hs co_mat. Chưa điểm danh / chưa có buổi → [] (UI hiện nhắc điểm danh trước).
export async function hsCoMatCuaBuoi(lopId: string, ngay: string): Promise<{ id: string; ho_ten: string; ma_hs: string | null }[]> {
  const { data: buoi } = await supabase.from('buoi_hoc').select('id').eq('lop_id', lopId).eq('ngay', ngay).eq('loai', 'thuong').order('created_at', { ascending: true }).limit(1).maybeSingle()
  if (!buoi) return []
  const { data, error } = await supabase.from('buoi_hoc_hs')
    .select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs)').eq('buoi_hoc_id', (buoi as { id: string }).id).eq('diem_danh', 'co_mat').limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[])
    .map((r) => r.hoc_sinh).filter(Boolean)
    .map((h: any) => ({ id: h.id as string, ho_ten: h.ho_ten as string, ma_hs: (h.ma_hs ?? null) as string | null }))
    .sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi'))
}
// Tiến độ điểm danh nhiều buổi (1 query): buoiId → { tong, daDanh }. daDanh = số HS đã có trạng thái.
// "Điểm danh xong" = daDanh >= tong (mọi HS đã đánh dấu). Dùng để OPS task tự rời khỏi "cần làm".
export async function diemDanhTienDo(buoiIds: string[]): Promise<Record<string, { tong: number; daDanh: number }>> {
  if (!buoiIds.length) return {}
  const { data, error } = await supabase.from('buoi_hoc_hs').select('buoi_hoc_id, diem_danh').in('buoi_hoc_id', buoiIds).limit(LIMIT)
  if (error) throw error
  const out: Record<string, { tong: number; daDanh: number }> = {}
  for (const r of (data ?? []) as { buoi_hoc_id: string; diem_danh: string | null }[]) {
    const o = (out[r.buoi_hoc_id] ??= { tong: 0, daDanh: 0 })
    o.tong++; if (r.diem_danh) o.daDanh++
  }
  return out
}
// ⭐ TIẾN ĐỘ ĐÁNH GIÁ — derive từ DÒNG THẬT, không đọc cờ `danh_gia_xong_at` (thêm 14/08).
//
// Cả hệ (Việc của tôi · trợ lý · dashboard vận hành · Kết quả học tập) đều chỉ đọc MỘT cờ nhị phân
// `danh_gia_xong_at`, tức "đã bấm nút Hoàn thành hay chưa". Hệ quả: buổi đã điền nhận xét/chấm dạng
// cho ĐỦ HS mà người điền quên bấm nút thì hiện y hệt buổi TRẮNG TINH — công của TA/GV vô hình
// (CEO 14/08: "trợ giảng đã đánh giá nhưng hệ thống vẫn chưa hiện"). Đo thật lúc thêm: 8 buổi đã qua
// có dữ liệu đánh giá thật mà cờ vẫn NULL (vd 5T1 18/07 đủ 6/6 HS cả nhận xét lẫn chấm dạng).
//
// KHÔNG tự đóng mốc thay người: `danh_gia_xong_at` là tuyên bố của NGƯỜI phụ trách (§4 — mốc người
// tự chốt), tự set hộ là bịa chữ ký. Chỉ hiện thêm phần ĐÃ LÀM để "chưa xong" nói rõ chưa xong ở đâu.
// daDanh = HS có nhận xét KHÔNG rỗng HOẶC có ít nhất 1 ô chấm dạng. tong = HS `co_mat` (§4 R-DG:
// vắng không thuộc nghĩa vụ đánh giá) — buổi chưa điểm danh ⇒ tong = 0, không đòi gì.
export async function danhGiaTienDo(buoiIds: string[]): Promise<Record<string, { tong: number; daDanh: number }>> {
  if (!buoiIds.length) return {}
  const [ros, nx, dang] = await Promise.all([
    supabase.from('buoi_hoc_hs').select('buoi_hoc_id, hoc_sinh_id, diem_danh').in('buoi_hoc_id', buoiIds).limit(LIMIT),
    supabase.from('buoi_danh_gia').select('buoi_hoc_id, hoc_sinh_id, nhan_xet').in('buoi_hoc_id', buoiIds).limit(LIMIT),
    supabase.from('buoi_danh_gia_dang').select('buoi_hoc_id, hoc_sinh_id').in('buoi_hoc_id', buoiIds).limit(LIMIT),
  ])
  const co = new Set<string>()
  for (const r of (nx.data ?? []) as any[]) if ((r.nhan_xet ?? '').trim()) co.add(`${r.buoi_hoc_id}|${r.hoc_sinh_id}`)
  for (const r of (dang.data ?? []) as any[]) co.add(`${r.buoi_hoc_id}|${r.hoc_sinh_id}`)
  const out: Record<string, { tong: number; daDanh: number }> = {}
  for (const b of buoiIds) out[b] = { tong: 0, daDanh: 0 }
  for (const r of (ros.data ?? []) as any[]) {
    if (r.diem_danh !== 'co_mat') continue
    const o = (out[r.buoi_hoc_id] ??= { tong: 0, daDanh: 0 })
    o.tong++; if (co.has(`${r.buoi_hoc_id}|${r.hoc_sinh_id}`)) o.daDanh++
  }
  return out
}
export async function diemDanh(buoiHocHsId: string, trangThai: DiemDanh): Promise<void> {
  const { error } = await supabase.from('buoi_hoc_hs').update({ diem_danh: trangThai }).eq('id', buoiHocHsId)
  if (error) throw error
}
// Đánh dấu ĐÃ báo PH "con đã đến" cho các dòng roster này (chỉ set khi còn NULL → không đè lần báo trước).
// Timestamp instant (timestamptz) → toISOString() đúng chuẩn (không phải ngày-local nên không dính luật §2).
export async function markBaoDen(buoiHocHsIds: string[]): Promise<void> {
  if (!buoiHocHsIds.length) return
  const { error } = await supabase.from('buoi_hoc_hs').update({ bao_den_at: new Date().toISOString() }).in('id', buoiHocHsIds).is('bao_den_at', null)
  if (error) throw error
}
// Gỡ HS khỏi buổi (data SAI — xếp nhầm lớp). CHỈ xoá dòng RỖNG: chặn cứng nếu đã có đo lường thật
// (ET/điểm/elo/exp/BTVN/cảnh báo). Pure-derive: gỡ dòng buoi_hoc_hs → sĩ số tự đúng, không cascade.
export async function xoaHSKhoiBuoi(row: { id: string; buoi_hoc_id: string; hoc_sinh_id: string }): Promise<void> {
  const cnt = async (tbl: string, col: string) =>
    (await supabase.from(tbl).select('*', { count: 'exact', head: true }).eq('hoc_sinh_id', row.hoc_sinh_id).eq(col, row.buoi_hoc_id)).count ?? 0
  const [grades, elo, exp, btvn, canh, prob] = await Promise.all([
    cnt('gami_grades', 'buoi_hoc_id'), cnt('gami_elo_history', 'buoi_hoc_id'), cnt('gami_exp_ledger', 'ref_buoi_hoc_id'),
    cnt('btvn_ket_qua', 'buoi_hoc_id'), cnt('canh_bao_yeu', 'buoi_hoc_id'), cnt('gami_session_problems', 'buoi_hoc_id'),
  ])
  const chan: string[] = []
  if (grades) chan.push(`${grades} bài chấm ET`); if (elo) chan.push('lịch sử Elo'); if (exp) chan.push('điểm EXP')
  if (btvn) chan.push('kết quả BTVN'); if (canh) chan.push('cảnh báo yếu'); if (prob) chan.push('câu hỏi riêng (bù)')
  if (chan.length) throw new Error(`Không xoá được — HS đã có đo lường thật ở buổi này (${chan.join(', ')}). Sửa điểm danh thay vì xoá, hoặc xử lý dữ liệu đo trước.`)
  await supabase.from('bang_khong_bu').delete().eq('buoi_hoc_hs_id', row.id) // FK con duy nhất → dọn trước
  const { error } = await supabase.from('buoi_hoc_hs').delete().eq('id', row.id)
  if (error) throw error
}
// Đồng bộ sĩ số buổi ĐANG MỞ: THÊM HS đã ghi danh (dang_hoc, ngay_vao ≤ ngày buổi) còn THIẾU trong roster.
// Chỉ thêm, KHÔNG xoá (buổi = snapshot; HS rời giữa chừng vẫn giữ). Vá ca: ghi danh SAU khi đã mở buổi.
// ⭐ 07-10 (Thùy): buổi đã ĐÓNG chấm/đánh giá mà giờ có HS mới → TỰ MỞ LẠI (ingame/mt/đánh giá), y hệt
// bấm "Mở lại" thủ công (rollback sạch Elo/EXP qua reopenPhase, không nhân đôi khi chấm lại). Trước đây
// chỉ ET "trông như" tự đồng bộ vì hạn chót dài hơn (trưa hôm sau, so với 23:59 cùng ngày của 2 cái kia)
// — KHÔNG phải do cơ chế khác, roster đã luôn đúng cho mọi tab; lỗ hổng là Ở CHỖ khoá theo phase.
export async function dongBoSiSo(buoiId: string): Promise<number> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('lop_id, ngay, trang_thai, ingame_dong_at, mt_dong_at, danh_gia_xong_at').eq('id', buoiId).single()
  if (error) throw error
  if ((b as any).trang_thai === 'huy' || !(b as any).lop_id) return 0 // sync cả buổi hoan_tat (HS vào sau), chỉ bỏ huy
  const { data: hs } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, ngay_vao').eq('lop_id', (b as any).lop_id).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  const enrolled = (hs ?? []).filter((h: any) => !h.ngay_vao || h.ngay_vao <= (b as any).ngay).map((h: any) => h.hoc_sinh_id)
  if (!enrolled.length) return 0
  const { data: cur } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  const have = new Set((cur ?? []).map((r: any) => r.hoc_sinh_id))
  const missing = enrolled.filter((id) => !have.has(id))
  if (!missing.length) return 0
  const { error: eIns } = await supabase.from('buoi_hoc_hs').insert(missing.map((hsid) => ({ buoi_hoc_id: buoiId, hoc_sinh_id: hsid })))
  if (eIns) throw eIns
  if ((b as any).ingame_dong_at) await reopenPhase(buoiId, 'ingame')
  if ((b as any).mt_dong_at) await reopenPhase(buoiId, 'mt')
  if ((b as any).danh_gia_xong_at) await moLaiDanhGia(buoiId)
  return missing.length
}

// ── Bài + chấm ────────────────────────────────────────────────────
export async function listProblems(buoiId: string, phase: Phase): Promise<Problem[]> {
  const { data, error } = await supabase.from('gami_session_problems').select('*').eq('buoi_hoc_id', buoiId).eq('phase', phase).order('problem_no').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as Problem[]
}
export async function addProblem(buoiId: string, phase: Phase, maDang?: string | null): Promise<Problem> {
  const cur = await listProblems(buoiId, phase)
  const no = cur.length ? Math.max(...cur.map((p) => p.problem_no)) + 1 : 1
  const { data, error } = await supabase.from('gami_session_problems').insert({ buoi_hoc_id: buoiId, phase, problem_no: no, ma_dang: maDang ?? null }).select().single()
  if (error) throw error
  return data as Problem
}
// Gán/đổi dạng cho 1 bài (chấm bài trên lớp). null = bỏ gán.
export async function setProblemDang(problemId: string, maDang: string | null): Promise<void> {
  const { error } = await supabase.from('gami_session_problems').update({ ma_dang: maDang }).eq('id', problemId)
  if (error) throw error
}
// Bảng chấm bài trên lớp hiện sẵn N bài (mặc định 10) khi buổi chưa có bài nào.
// Bài = SLOT/cấu trúc (không phải phép đo) → tạo sẵn OK; anti-NULL §1.5 áp ở GRADE (chỉ sinh khi chấm thật).
export async function ensureProblems(buoiId: string, phase: Phase, n: number): Promise<void> {
  const cur = await listProblems(buoiId, phase)
  if (cur.length) return
  const rows = Array.from({ length: n }, (_, i) => ({ buoi_hoc_id: buoiId, phase, problem_no: i + 1 }))
  // ignoreDuplicates: chống đẻ TRÙNG khi effect chạy 2 lần (StrictMode) — unique (buoi,phase,problem_no).
  const { error } = await supabase.from('gami_session_problems').upsert(rows, { onConflict: 'buoi_hoc_id,phase,problem_no', ignoreDuplicates: true })
  if (error) throw error
}

// ── CHẤM ET: nạp câu từ tài liệu ET khớp buổi (lớp + ngày) ─────────
// ET ↔ buổi qua (lop_id, ngay) — KHÔNG FK (lúc tạo ET buổi còn ẢO). Câu ET → 1 problem/câu, gắn ma_dang của câu.
// Trả { etId, caus } (caus đúng thứ tự = thứ tự problem_no seed). etId null = chưa có ET cho buổi này.
export async function loadETForBuoi(buoiId: string): Promise<{ etId: string | null; caus: CauHoi[] }> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('lop_id, ngay').eq('id', buoiId).single()
  if (error) throw error
  const lopId = (b as any).lop_id as string | null
  if (!lopId) return { etId: null, caus: [] }
  const et = await getETByBuoi(lopId, (b as any).ngay)
  if (!et) return { etId: null, caus: [] }
  return { etId: et.id, caus: await getETCaus(et.id) }
}
// Xem live giáo trình ONLINE của buổi (lớp+ngày) — null nếu buổi này CHƯA phát hành online (đúng
// khớp qua tai_lieu loai='giao_trinh_buoi' rồi bai_test loai='giao_trinh', KHÔNG FK buoi_hoc, cùng
// nguyên lý ET/BTVN). Chỉ giáo trình cần xem live (reveal-ngay → verdict có ngay); ET/BTVN không cần.
export async function loadLiveTestForBuoi(buoiId: string): Promise<{ baiTest: BaiTest; caus: BaiTestCau[] } | null> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('lop_id, ngay').eq('id', buoiId).single()
  if (error) throw error
  const lopId = (b as any).lop_id as string | null
  const ngay = (b as any).ngay as string
  if (!lopId) return null
  const doc = await getGiaoTrinhBuoiDoc(lopId, ngay)
  if (!doc) return null
  const baiTest = await getBaiTestByDoc(doc.id, lopId, ngay, 'giao_trinh')
  if (!baiTest) return null
  return { baiTest, caus: await getBaiTestCaus(baiTest.id) }
}
// ── LƯỚI CHẤM BÁM ĐỀ (ET / MT / BTVN) ─────────────────────────────
// ⚠ BUG THẬT 07-21 (Thùy: "ET 5A2 hôm qua in ra 5 câu nhưng nhóm lớp lại 6 câu"): đời cũ seed lưới
// ĐÚNG MỘT LẦN (`if (cur.length) return`) rồi KHÔNG bao giờ theo đề nữa, và danh tính 1 ô chấm là
// VỊ TRÍ (problem_no ↔ index mảng câu). Sửa đề = thêm/bớt/đổi câu ở giữa → ô lệch câu → điểm gắn
// sang DẠNG khác → mastery sai. Tệ nhất: UI cũ chỉ cảnh báo khi SỐ câu lệch, nên đổi câu mà giữ
// nguyên số lượng thì hỏng HOÀN TOÀN IM LẶNG.
// Nay ô mang `ma_cau` (mig 0106) — danh tính là CÂU, vị trí chỉ còn là thứ tự hiển thị:
//   · câu còn trong đề → GIỮ nguyên ô + điểm (đồng bộ lại ma_dang nếu kho sửa dạng của câu)
//   · câu mới          → thêm ô
//   · ô mất câu, 0 điểm → xoá (ô rỗng = cấu trúc, không phải phép đo — §1.5, không mất gì)
//   · ô mất câu, CÒN ĐIỂM → GIỮ + báo lên UI cho người quyết. TUYỆT ĐỐI không tự xoá điểm.
// Phase ĐÃ ĐÓNG (Elo đã tính) thì KHÔNG đụng cấu trúc — chỉ trả chênh lệch để UI cảnh báo, người
// phải "Mở lại" mới sửa (§4: đã chốt thì giữ vết, không sửa lén sau lưng).
export type OMoCoi = { problem: Problem; soDiem: number }
export type LuoiSync = {
  probs: Problem[]          // ĐÚNG THỨ TỰ ĐỀ (ô mồ côi còn điểm xếp cuối) — UI hiển thị theo mảng này
  moCoi: OMoCoi[]           // ô mất câu nhưng còn điểm → cần người quyết
  khongRoRang: null | 'lech_so' | 'lech_dang'  // lưới đời cũ không gắn được nhãn — kèm LÝ DO (2 cái khác hẳn nhau)
  doiCauTruc: boolean       // có chênh lệch nhưng phase đã đóng nên chưa áp
}
const luoiNguyen = (probs: Problem[]): LuoiSync => ({ probs, moCoi: [], khongRoRang: null, doiCauTruc: false })

export async function syncDocProblems(buoiId: string, phase: 'et' | 'mt' | 'btvn', caus: CauHoi[], daDong?: boolean): Promise<LuoiSync> {
  const curAll = await listProblems(buoiId, phase)
  // ⭐ Hình (mô hình) dùng CHUNG bảng+phase (xem `syncHinhProblems`) — chỉ diff/đụng phần CỦA MÌNH
  // (ma_cau), đừng đọc/xoá nhầm ô Hình (không có ma_cau, sẽ rơi vào "thừa" nếu không lọc trước).
  const cur = curAll.filter((p) => !p.hinh_baitoan_id)
  // problem_no là 1 slot chung cho CẢ buổi+phase (Đại lẫn Hình) — luôn cấp số tiếp theo TOÀN BẢNG,
  // không chỉ trong phần của mình, để khỏi đụng unique (buoi,phase,problem_no) với ô Hình.
  const noTiep = () => (curAll.length ? Math.max(...curAll.map((p) => p.problem_no)) : 0)
  // Đề rỗng/chưa tải được → KHÔNG đụng lưới. (Đừng để một lần load hỏng biến thành "xoá sạch ô chấm".)
  if (!caus.length) return luoiNguyen(cur)
  if (!cur.length) {
    if (daDong) return { ...luoiNguyen(cur), doiCauTruc: true }
    let no0 = noTiep()
    const rows = caus.map((c) => ({ buoi_hoc_id: buoiId, phase, problem_no: ++no0, ma_cau: c.ma_cau, ma_dang: c.dang_chinh ?? null }))
    // ignoreDuplicates: chống đẻ trùng khi effect chạy 2 lần (StrictMode) — unique (buoi,phase,problem_no).
    const { error } = await supabase.from('gami_session_problems').upsert(rows, { onConflict: 'buoi_hoc_id,phase,problem_no', ignoreDuplicates: true })
    if (error) throw error
    return luoiNguyen((await listProblems(buoiId, phase)).filter((p) => !p.hinh_baitoan_id))
  }

  // Lưới đời cũ (trước mig 0106) chưa có ma_cau. Chỉ dám gắn nhãn khi SỐ Ô == SỐ CÂU — bằng nhau tức
  // không có thêm/bớt, vị trí VẪN là danh tính đúng. Lệch số thì KHÔNG ĐOÁN: trả cờ, để người quyết.
  // Gắn nhãn KHÔNG bị chặn bởi `daDong`: nó chỉ ghi CHÚ THÍCH ô nào ứng câu nào — không thêm/bớt ô,
  // không đụng điểm, không đụng Elo. Chỉ ĐỔI CẤU TRÚC mới phải chờ "Mở lại".
  // ⚠ "Số ô == số câu ⇒ vị trí là danh tính" NGHE HỢP LÝ NHƯNG SAI. Phản ví dụ thật (5A2 20/07): bỏ 1
  // câu ở GIỮA rồi dọn ô rỗng cuối → số lại khớp, nhưng ô 3,4,5 vẫn giữ câu CŨ. Nên phải có nhân
  // chứng thứ hai: `ma_dang` của ô seed từ dang_chinh của câu LÚC CHẤM → chỉ nhận nhãn khi KHỚP.
  // Lệch dù chỉ 1 ô ⇒ bỏ cả lượt, để NULL, hỏi người. Thà bỏ trống còn hơn đánh sai (CLAUDE §1.5).
  let lam = cur
  if (cur.some((p) => !p.ma_cau)) {
    if (cur.length !== caus.length) return { ...luoiNguyen(cur), khongRoRang: 'lech_so' }
    const dangKhop = cur.every((p, i) => !p.ma_dang || !caus[i].dang_chinh || p.ma_dang === caus[i].dang_chinh)
    if (!dangKhop) return { ...luoiNguyen(cur), khongRoRang: 'lech_dang' }
    await Promise.all(cur.map((p, i) => supabase.from('gami_session_problems').update({ ma_cau: caus[i].ma_cau }).eq('id', p.id)))
    lam = cur.map((p, i) => ({ ...p, ma_cau: caus[i].ma_cau }))
  }

  // Bắt cặp theo MÃ CÂU (splice: đề có 2 câu trùng mã thì mỗi ô chỉ được dùng 1 lần).
  const thua = [...lam]
  const ghep = caus.map((c) => {
    const i = thua.findIndex((p) => p.ma_cau === c.ma_cau)
    return i >= 0 ? { co: thua.splice(i, 1)[0], cau: c } : { co: null, cau: c }
  })
  const thieu = ghep.filter((g) => !g.co)
  const lech = thieu.length > 0 || thua.length > 0
  if (lech && daDong) return { ...luoiNguyen(lam), doiCauTruc: true }

  // Ô mất câu: 0 điểm → xoá; còn điểm → giữ lại và báo.
  const moCoi: OMoCoi[] = []
  if (thua.length) {
    const ids = thua.map((p) => p.id)
    const { data: gs, error } = await supabase.from('gami_grades').select('problem_id').in('problem_id', ids).limit(LIMIT)
    if (error) throw error
    const dem = new Map<string, number>()
    for (const g of (gs ?? []) as { problem_id: string }[]) dem.set(g.problem_id, (dem.get(g.problem_id) ?? 0) + 1)
    const rong = thua.filter((p) => !dem.has(p.id))
    for (const p of thua) if (dem.has(p.id)) moCoi.push({ problem: p, soDiem: dem.get(p.id) as number })
    if (rong.length) {
      const { error: eDel } = await supabase.from('gami_session_problems').delete().in('id', rong.map((p) => p.id))
      if (eDel) throw eDel
    }
  }

  // Câu mới → thêm ô (nối tiếp problem_no lớn nhất TOÀN BẢNG; problem_no chỉ là slot, thứ tự hiển thị lấy từ đề).
  let no = noTiep()
  let daTao: Problem[] = []
  if (thieu.length) {
    const rows = thieu.map((g) => ({ buoi_hoc_id: buoiId, phase, problem_no: ++no, ma_cau: g.cau.ma_cau, ma_dang: g.cau.dang_chinh ?? null }))
    const { data, error } = await supabase.from('gami_session_problems').insert(rows).select()
    if (error) throw error
    daTao = (data ?? []) as Problem[]
  }

  // Dạng của câu có thể được sửa trong kho sau khi seed → đồng bộ lại nhãn của ô đang giữ.
  const doiDang = ghep.filter((g) => g.co && (g.co.ma_dang ?? null) !== (g.cau.dang_chinh ?? null))
  await Promise.all(doiDang.map((g) => supabase.from('gami_session_problems').update({ ma_dang: g.cau.dang_chinh ?? null }).eq('id', (g.co as Problem).id)))

  const taoMap = new Map(daTao.map((p) => [p.ma_cau as string, p]))
  const theoDe = ghep
    .map((g) => (g.co ? { ...g.co, ma_dang: g.cau.dang_chinh ?? null } : taoMap.get(g.cau.ma_cau)))
    .filter(Boolean) as Problem[]
  return { probs: [...theoDe, ...moCoi.map((m) => m.problem)], moCoi, khongRoRang: null, doiCauTruc: false }
}

// Sắp lưới theo THỨ TỰ ĐỀ mà không ghi DB — dùng cho reload sau mỗi lần chấm (sync đã chạy lúc mở tab).
export function xepLuoiTheoDe(probs: Problem[], caus: CauHoi[]): Problem[] {
  if (!caus.length) return probs
  const con = [...probs]
  const theoDe: Problem[] = []
  for (const c of caus) {
    const i = con.findIndex((p) => p.ma_cau === c.ma_cau)
    if (i >= 0) theoDe.push(con.splice(i, 1)[0])
  }
  return [...theoDe, ...con] // ô không khớp câu nào (mồ côi / lưới cũ chưa gắn nhãn) xếp cuối
}
// ── CHẤM MT: nạp câu từ tài liệu mt_buoi khớp buổi (lớp+ngày) — CÙNG mẫu ET (chấm dùng gradeET/
// deleteGrade generic, không cần hàm riêng — phase='mt' đã tách qua gami_session_problems.phase). ──
// Trả cả `phans` (GIỮ cấu trúc Phần I/II… đúng như file MT được gán — Thùy 07-08) lẫn `caus` phẳng
// (nối tiếp toàn bài, dùng seed problem_no cho ensureMTProblems).
export async function loadMTForBuoi(buoiId: string): Promise<{ mtId: string | null; phans: MTPhanCaus[]; caus: CauHoi[] }> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('lop_id, ngay').eq('id', buoiId).single()
  if (error) throw error
  const lopId = (b as any).lop_id as string | null
  if (!lopId) return { mtId: null, phans: [], caus: [] }
  const mt = await getMTInstanceByBuoi(lopId, (b as any).ngay)
  if (!mt) return { mtId: null, phans: [], caus: [] }
  const phans = await getMTPhanCaus(mt.id)
  return { mtId: mt.id, phans, caus: phans.flatMap((p) => p.caus) }
}
// MT/BTVN dùng CHUNG syncDocProblems với ET — cùng một bản chất "lưới bám đề", đừng đẻ 3 bản logic
// lệch nhau (bug ET lặp lại y hệt ở MT/BTVN vì trước đây copy-paste `if (cur.length) return`).
export const syncMTProblems = (buoiId: string, caus: CauHoi[], daDong?: boolean) => syncDocProblems(buoiId, 'mt', caus, daDong)

// ⭐ Thùy 02/09: "câu hỏi phải đi theo thứ tự trong builder — câu nào nằm phía trên thì tính trước" (Hình xen giữa
// Đại thì số cũng xen theo, mỗi Ý Hình = 1 số). syncDocProblems/syncHinhProblems chỉ cấp SLOT (nối max) nên sau khi
// cả hai sync xong phải ĐÁNH SỐ LẠI problem_no theo thứ tự đề. Số trên phiếu (MTPrintView) và số ở tab chấm phải
// là MỘT — lệch là chấm nhầm câu → bẩn mastery (bài học 07-21).
/** Thứ tự ô chấm MT theo đề: duyệt maCaus từng phần — câu kho khớp ma_cau; hàng Hình thứ k khớp các ô Hình có
 *  hinh_nhan bắt đầu bằng số k (nhãn "k"/"kA","kB"… — thứ tự pick trong hinh_gt_bai = thứ tự hàng Hình lúc gán). Ô
 *  không khớp (mồ côi) xếp cuối, giữ thứ tự cũ. */
export function thuTuMTTheoDe(probs: Problem[], phans: MTPhanCaus[]): Problem[] {
  const conLai = [...probs]
  const out: Problem[] = []
  let k = 0
  for (const ph of phans) for (const ma of ph.maCaus) {
    if (laMaHinh(ma)) {
      k++
      const cua = conLai.filter((p) => !!p.hinh_baitoan_id && parseInt(p.hinh_nhan ?? '', 10) === k).sort((a, b) => (a.hinh_nhan ?? '').localeCompare(b.hinh_nhan ?? ''))
      for (const p of cua) { out.push(p); conLai.splice(conLai.indexOf(p), 1) }
    } else {
      const i = conLai.findIndex((p) => !p.hinh_baitoan_id && p.ma_cau === ma)
      if (i >= 0) out.push(conLai.splice(i, 1)[0])
    }
  }
  return [...out, ...conLai]
}
/** Đánh số lại problem_no = vị trí trong `thuTu` (1-based). Không đổi gì nếu đã đúng; phase đã đóng → không đụng.
 *  Unique (buoi,phase,problem_no) ⇒ 2 bước: dời các ô đổi số lên vùng tạm (+100000) rồi hạ về số đích. */
export async function danhSoLaiTheoDe(buoiId: string, phase: Phase, thuTu: Problem[], daDong?: boolean): Promise<void> {
  if (daDong) return
  const doi = thuTu.map((p, i) => ({ p, no: i + 1 })).filter((x) => x.p.problem_no !== x.no)
  if (!doi.length) return
  for (const x of doi) { const { error } = await supabase.from('gami_session_problems').update({ problem_no: 100000 + x.no }).eq('id', x.p.id); if (error) throw error }
  for (const x of doi) { const { error } = await supabase.from('gami_session_problems').update({ problem_no: x.no }).eq('id', x.p.id); if (error) throw error }
  void buoiId; void phase
}
export const syncBTVNProblems = (buoiId: string, caus: CauHoi[], daDong?: boolean) => syncDocProblems(buoiId, 'btvn', caus, daDong)

// ── CHẤM Hình (mô hình) — nạp từ giáo trình Hình đã gán (lớp+ngày) ─────────────────
// Mirror `syncDocProblems` ở trên (§ "LƯỚI CHẤM BÁM ĐỀ") NHƯNG khoá tự nhiên là NODE
// (hinh_baitoan_id [+hinh_bien_the_id/hinh_y_id]), không phải `ma_cau` — pick giáo trình Hình
// không có mã câu phẳng; đơn vị chân lý mastery Hình = (Student × hinh_baitoan_id).
// `phan` của giáo trình Hình ('lop'|'nha') ↔ `phase` chấm: nha→btvn (rõ ràng, 1-1) · lop→et (chấm
// thường trong buổi) HOẶC mt (buổi được đánh dấu MT — Hình chưa có cơ chế gán MT riêng như
// Đại's `tai_lieu loai='mt_buoi'`, tạm dùng CHUNG nội dung 'lop', chỉ khác `phase` ghi ra;
// cần Thùy xác nhận nếu muốn tách nội dung MT riêng sau này).
const hinhKey = (d: { hinhBaitoanId: string; hinhBienTheId: string | null; hinhYId: string | null }) =>
  `${d.hinhBaitoanId}|${d.hinhBienTheId ?? ''}|${d.hinhYId ?? ''}`
const hinhKeyOfProblem = (p: Problem) => `${p.hinh_baitoan_id ?? ''}|${p.hinh_bien_the_id ?? ''}|${p.hinh_y_id ?? ''}`

export async function syncHinhProblems(buoiId: string, phase: 'et' | 'mt' | 'btvn', dapAn: HinhDapAn[], daDong?: boolean): Promise<LuoiSync> {
  const curAll = await listProblems(buoiId, phase)
  // ⭐ Chia miền NGƯỢC lại `syncDocProblems`: chỉ đụng ô Hình (có hinh_baitoan_id), đừng đọc/xoá nhầm ô Đại.
  const cur = curAll.filter((p) => !!p.hinh_baitoan_id)
  const noTiep = () => (curAll.length ? Math.max(...curAll.map((p) => p.problem_no)) : 0)
  if (!dapAn.length) return luoiNguyen(cur)
  if (!cur.length) {
    if (daDong) return { ...luoiNguyen(cur), doiCauTruc: true }
    let no0 = noTiep()
    const rows = dapAn.map((d) => ({
      buoi_hoc_id: buoiId, phase, problem_no: ++no0,
      hinh_baitoan_id: d.hinhBaitoanId, hinh_bien_the_id: d.hinhBienTheId, hinh_y_id: d.hinhYId, hinh_nhan: d.nhan,
    }))
    const { error } = await supabase.from('gami_session_problems').upsert(rows, { onConflict: 'buoi_hoc_id,phase,problem_no', ignoreDuplicates: true })
    if (error) throw error
    return luoiNguyen((await listProblems(buoiId, phase)).filter((p) => !!p.hinh_baitoan_id))
  }

  // Bắt cặp theo khoá NODE (splice: 1 buổi lỡ có 2 pick trùng node thì mỗi ô chỉ dùng 1 lần).
  const thua = [...cur]
  const ghep = dapAn.map((d) => {
    const key = hinhKey(d)
    const i = thua.findIndex((p) => hinhKeyOfProblem(p) === key)
    return i >= 0 ? { co: thua.splice(i, 1)[0], d } : { co: null, d }
  })
  const thieu = ghep.filter((g) => !g.co)
  const lech = thieu.length > 0 || thua.length > 0
  if (lech && daDong) return { ...luoiNguyen(cur), doiCauTruc: true }

  // Ô mất node: 0 điểm → xoá; còn điểm → giữ lại và báo (giống syncDocProblems).
  const moCoi: OMoCoi[] = []
  if (thua.length) {
    const ids = thua.map((p) => p.id)
    const { data: gs, error } = await supabase.from('gami_grades').select('problem_id').in('problem_id', ids).limit(LIMIT)
    if (error) throw error
    const dem = new Map<string, number>()
    for (const g of (gs ?? []) as { problem_id: string }[]) dem.set(g.problem_id, (dem.get(g.problem_id) ?? 0) + 1)
    const rong = thua.filter((p) => !dem.has(p.id))
    for (const p of thua) if (dem.has(p.id)) moCoi.push({ problem: p, soDiem: dem.get(p.id) as number })
    if (rong.length) {
      const { error: eDel } = await supabase.from('gami_session_problems').delete().in('id', rong.map((p) => p.id))
      if (eDel) throw eDel
    }
  }

  // Node mới → thêm ô (nối tiếp problem_no lớn nhất TOÀN BẢNG — tránh đụng ô Đại cùng buổi/phase).
  let no = noTiep()
  let daTao: Problem[] = []
  if (thieu.length) {
    const rows = thieu.map((g) => ({
      buoi_hoc_id: buoiId, phase, problem_no: ++no,
      hinh_baitoan_id: g.d.hinhBaitoanId, hinh_bien_the_id: g.d.hinhBienTheId, hinh_y_id: g.d.hinhYId, hinh_nhan: g.d.nhan,
    }))
    const { data, error } = await supabase.from('gami_session_problems').insert(rows).select()
    if (error) throw error
    daTao = (data ?? []) as Problem[]
  }

  // Nhãn (Bài số/chữ) có thể đổi nếu giáo trình đổi thứ tự pick → đồng bộ lại nhãn của ô đang giữ.
  const doiNhan = ghep.filter((g) => g.co && (g.co.hinh_nhan ?? null) !== g.d.nhan)
  await Promise.all(doiNhan.map((g) => supabase.from('gami_session_problems').update({ hinh_nhan: g.d.nhan }).eq('id', (g.co as Problem).id)))

  const taoMap = new Map(daTao.map((p) => [hinhKey({ hinhBaitoanId: p.hinh_baitoan_id!, hinhBienTheId: p.hinh_bien_the_id ?? null, hinhYId: p.hinh_y_id ?? null }), p]))
  const theoDe = ghep
    .map((g) => (g.co ? { ...g.co, hinh_nhan: g.d.nhan } : taoMap.get(hinhKey(g.d))))
    .filter(Boolean) as Problem[]
  return { probs: [...theoDe, ...moCoi.map((m) => m.problem)], moCoi, khongRoRang: null, doiCauTruc: false }
}
/** Đáp án Hình cần chấm cho `phase` này — nha→btvn (giáo trình, snapshot qua `ganLopSnapshot`) ·
 *  et→et · mt→mt (2 cái sau là tài liệu RIÊNG, KHÔNG phải giáo trình — xem
 *  `ensureHinhGtBuoiForBuoi`/`saveBuoiSelectionPhan`). MT Hình KHÔNG có master (khác Đại) — chọn
 *  trực tiếp mỗi buổi, ngay trong tab MT (Thùy 21/08: "MT là 1 thực thể — Đại Hình chỉ là 1 phần
 *  của nó", không phải 2 tài liệu tách rời — gộp ở lớp CHẤM, giống hệt ET/BTVN). */
export async function loadHinhForBuoiPhase(buoiId: string, phase: 'et' | 'mt' | 'btvn'): Promise<{ gtBuoiId: string | null; dapAn: HinhDapAn[] }> {
  return loadHinhForBuoi(buoiId, phase === 'btvn' ? 'nha' : phase)
}
export async function listGrades(buoiId: string): Promise<Grade[]> {
  const { data, error } = await supabase.from('gami_grades').select('*').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as Grade[]
}
// Chấm bài trên lớp: 1 mức 1-5 (gộp 3 chiều cũ). points = muc*20 (Elo); result map để code cũ còn hiểu.
export async function gradeMuc(p: { buoiId: string; problemId: string; hocSinhId: string; muc: number }): Promise<void> {
  const result = p.muc >= 4 ? 'correct' : p.muc === 3 ? 'partial' : 'wrong'
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('gami_grades').upsert(
    { buoi_hoc_id: p.buoiId, problem_id: p.problemId, hoc_sinh_id: p.hocSinhId, muc: p.muc, points: p.muc * 20, result, presentation: 'clean', speed: 'normal', graded_by: user?.id ?? null },
    { onConflict: 'problem_id,hoc_sinh_id' })
  if (error) throw error
}

// Chấm ET (1-click): kết quả 3 mức Đ/C/S (correct/partial/wrong) + mã lỗi (E01..) khi C/S.
// presentation/speed neutral (ET chỉ đo KẾT QUẢ, không trình bày/tốc độ). points = problemPoints để engine cũ chạy.
export async function gradeET(p: { buoiId: string; problemId: string; hocSinhId: string; result: ETResult; loi: string[] }): Promise<void> {
  const points = problemPoints({ result: p.result, presentation: 'clean', speed: 'normal' })
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('gami_grades').upsert(
    { buoi_hoc_id: p.buoiId, problem_id: p.problemId, hoc_sinh_id: p.hocSinhId, result: p.result, presentation: 'clean', speed: 'normal', points, loi: p.loi, graded_by: user?.id ?? null },
    { onConflict: 'problem_id,hoc_sinh_id' })
  if (error) throw error
}

// Tích hàng loạt: 1 HS × TOÀN BỘ câu = cùng 1 verdict, MỘT lần upsert (thay vì N lần gọi gradeET).
// Ca dùng (CEO 16/08): đề 60 câu, HS đúng 59 — tích "Tất cả Đ" 1 phát, xong sửa riêng câu sai. Không
// suy đoán mã lỗi (loi=[]) cho mọi ô: GV mở ô cần sửa gắn lỗi sau, đúng luật §1.5 "thà bỏ trống hơn
// đánh sai" — bulk verdict là quyết định thật của GV, còn LOẠI lỗi cụ thể thì không.
export async function gradeETBulk(p: { buoiId: string; hocSinhId: string; problemIds: string[]; result: ETResult }): Promise<void> {
  if (!p.problemIds.length) return
  const points = problemPoints({ result: p.result, presentation: 'clean', speed: 'normal' })
  const { data: { user } } = await supabase.auth.getUser()
  const rows = p.problemIds.map((problemId) => ({
    buoi_hoc_id: p.buoiId, problem_id: problemId, hoc_sinh_id: p.hocSinhId,
    result: p.result, presentation: 'clean', speed: 'normal', points, loi: [] as string[], graded_by: user?.id ?? null,
  }))
  const { error } = await supabase.from('gami_grades').upsert(rows, { onConflict: 'problem_id,hoc_sinh_id' })
  if (error) throw error
}

// ET ONLINE → lưới chấm ET của buổi (Thùy 03/09: "dữ liệu ET HS làm từ điện thoại chưa đi thẳng vào
// chỗ nhập liệu ET buổi học"). Toàn bộ ở DB — fn_et_online_dong_bo (mig 202609031709): verdict của
// bai_lam_cau (đã nộp) → gami_grades phase='et', khớp ô↔câu qua ma_cau, ghi khoá nguồn
// gami_grades.bai_lam_cau_id. KHÔNG ghi đè ô chấm tay (bai_lam_cau_id null) · KHÔNG đụng phase đã
// đóng · HS nộp mà không trong roster buổi thì đếm `khongTrongBuoi` để người xem. Idempotent — gọi
// mỗi lần mở tab ET (sau syncDocProblems để ô đã có) và khi GV bấm "Lấy lại".
export type ETOnlineDongBo = { daDong?: boolean; khongCoTest?: boolean; hsNop?: number; moi?: number; capNhat?: number; giuTay?: number; khongKhopO?: number; khongTrongBuoi?: number }
export async function dongBoETOnline(buoiId: string): Promise<ETOnlineDongBo> {
  const { data, error } = await supabase.rpc('fn_et_online_dong_bo', { p_buoi: buoiId })
  if (error) throw error
  return (data ?? {}) as ETOnlineDongBo
}

// Bỏ chấm 1 ô (HS × bài): xoá dòng grade (anti-NULL: chưa đo = không có dòng). Dùng khi click lại mức đang chọn.
export async function deleteGrade(problemId: string, hocSinhId: string): Promise<void> {
  const { error } = await supabase.from('gami_grades').delete().match({ problem_id: problemId, hoc_sinh_id: hocSinhId })
  if (error) throw error
}

// ════════════════════ BTVN (chấm buổi sau) ════════════════════
// Câu BTVN = doc loai='btvn' của buổi (lớp+ngày). Chấm Đ/C/S per-câu NHƯ ET (gradeET, phase='btvn'),
// NHƯNG dữ liệu BTVN = THAM KHẢO (home/không giám sát) → KHÔNG vào mastery/Elo. Thưởng EXP hoàn thành.
export async function loadBTVNForBuoi(buoiId: string): Promise<{ btvnId: string | null; caus: CauHoi[] }> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('lop_id, ngay').eq('id', buoiId).single()
  if (error) throw error
  const lopId = (b as any).lop_id as string | null
  if (!lopId) return { btvnId: null, caus: [] }
  const doc = await getBTVNByBuoi(lopId, (b as any).ngay)
  if (!doc) return { btvnId: null, caus: [] }
  return { btvnId: doc.id, caus: await getBTVNCaus(doc.id) }
}

// Trạng thái nộp + thái độ (per HS×buổi) — btvn_ket_qua. Upsert idempotent.
export type BtvnTrangThai = 'nop_dung_han' | 'xin_phep' | 'khong_lam' | 'nop_muon'
export type BtvnThaiDo = 'nghiem_tuc' | 'chua_het_suc' | 'chua_nghiem_tuc' | 'chong_doi'
export type BtvnKQ = { trang_thai_nop: string | null; thai_do: string | null }
export async function getBtvnKetQua(buoiId: string): Promise<Record<string, BtvnKQ>> {
  const { data, error } = await supabase.from('btvn_ket_qua').select('hoc_sinh_id, trang_thai_nop, thai_do').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  if (error) throw error
  const m: Record<string, BtvnKQ> = {}
  for (const r of (data ?? []) as any[]) m[r.hoc_sinh_id] = { trang_thai_nop: r.trang_thai_nop, thai_do: r.thai_do }
  return m
}
export async function setBtvnKetQua(buoiId: string, hocSinhId: string, patch: Partial<BtvnKQ>): Promise<void> {
  const { error } = await supabase.from('btvn_ket_qua').upsert(
    { buoi_hoc_id: buoiId, hoc_sinh_id: hocSinhId, ...patch, updated_at: new Date().toISOString() },
    { onConflict: 'hoc_sinh_id,buoi_hoc_id' })
  if (error) throw error
}

// CẢNH BÁO "HS kém dạng" — tín hiệu NGƯỜI-CONFIRM (tin), nguồn hỗ trợ. Append; gỡ được nếu bấm nhầm.
export type CanhBao = { id: string; hoc_sinh_id: string; ma_dang: string; ghi_chu: string | null }
export async function listCanhBao(buoiId: string): Promise<CanhBao[]> {
  const { data, error } = await supabase.from('canh_bao_yeu').select('id, hoc_sinh_id, ma_dang, ghi_chu').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as CanhBao[]
}
// `nguon` mặc định 'btvn' (chỗ gọi cũ giữ nguyên); app GV/ERP DanhGiaTab truyền 'danhgia'
// (CEO 31/08 — chuông ở đánh giá sau buổi). CHECK canh_bao_yeu_nguon_chk giữ tập giá trị.
export async function themCanhBao(p: { buoiId: string; hocSinhId: string; maDang: string; ghiChu?: string; nguon?: 'btvn' | 'danhgia' }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('canh_bao_yeu').insert({ buoi_hoc_id: p.buoiId, hoc_sinh_id: p.hocSinhId, ma_dang: p.maDang, ghi_chu: p.ghiChu ?? null, nguon: p.nguon ?? 'btvn', created_by: user?.id ?? null })
  if (error) throw error
}
export async function xoaCanhBao(id: string): Promise<void> {
  const { error } = await supabase.from('canh_bao_yeu').delete().eq('id', id)
  if (error) throw error
}

// ════ EXP THÁNG (redesign 07-28, Thùy chốt) — EXP = CHĂM CHỈ, TÍNH LẠI theo (lớp × tháng) ════
// EXP mỗi buổi (ET rank) + phần THÁNG (BTVN: base/bài × thái độ + thưởng/phạt so lớp). Tháng = Σ buổi.
// CHI TIẾT THEO HOẠT ĐỘNG (08-29, giống gami_elo_history — mỗi sự kiện 1 dòng, tổng tháng = Σ dòng):
//   'exp_et'         per (HS×buổi), ref_buoi_hoc_id = buổi   — EXP hạng ET buổi đó
//   'exp_btvn'       per (HS×buổi), ref_buoi_hoc_id = buổi   — EXP BTVN buổi đó (base×thời điểm×thái độ)
//   'exp_btvn_thang' per (HS×lớp×tháng)                      — điều chỉnh tháng (đủ tháng/so lớp/phạt miss),
//       CÓ THỂ ÂM; = monthlyBtvnExp.total − subtotal. ref_buoi_hoc_id = BUỔI CUỐI tháng của lớp — không phải
//       "thuộc buổi đó" mà để dòng LỚP-SCOPED: HS chuyển lớp giữa tháng giữ điều chỉnh CẢ 2 lớp (model gộp
//       cũ per-lớp ghi đè nhau, mất phần lớp kia), và recompute lớp nào chỉ xoá dòng lớp đó (theo ref_buoi).
// MỌI dòng đều note=ym (tháng EXP THUỘC VỀ) — reader lọc tháng/mùa theo note, KHÔNG theo created_at.
// Tổng (HS×tháng) = et + max(0, subtotal+bonus/phạt) — ĐÚNG BẰNG số exp_thang gộp cũ (chỉ đổi độ mịn).
// TỰ recompute khi buổi đổi (đóng/mở ET|BTVN); idempotent. Bù/bổ trợ vẫn 'attend_floor' riêng.
// 'exp_thang' (gộp cũ) không ghi nữa nhưng reader vẫn cộng — data cũ convert bằng scripts/recalc_exp_chitiet.mjs.

// (fetchBtvnAcc đã xuống DB — nằm trong fn_recompute_exp_thang, §2.0.)

// Nguồn EXP hợp lệ khi CỘNG TỔNG: nhóm key theo note=ym (chi tiết mới + exp_thang gộp legacy) và
// attend_floor (bù/bổ trợ, không note → lọc created_at). Reader nào cộng EXP đều dùng 2 hằng này.
export const EXP_NOTE_SOURCES = ['exp_thang', 'exp_et', 'exp_btvn', 'exp_btvn_thang']
export const EXP_SOURCES = [...EXP_NOTE_SOURCES, 'attend_floor']

// ⚠ PostgREST cắt cứng 1000 dòng/response — `.limit(10000)` KHÔNG vượt được (đã ghi ở fetchBtvnAcc).
// Ledger chi tiết (08-29) đẩy các query EXP diện-rộng qua ngưỡng này → HS bị cắt hiện "0 EXP" (bug
// Lâm Anh 6S2 08-29). Mọi chỗ đọc ledger có thể >1000 dòng PHẢI phân trang qua đây; `order` bắt buộc
// (range không order = trang không ổn định, dòng trùng/sót).
export async function pagedLedger(build: (q: any) => any): Promise<any[]> {
  const PAGE = 1000, out: any[] = []
  for (let from = 0; from < 200000; from += PAGE) {
    const { data, error } = await build(supabase.from('gami_exp_ledger')).order('id').range(from, from + PAGE - 1)
    if (error) throw error
    const rows = (data ?? []) as any[]
    out.push(...rows)
    if (rows.length < PAGE) break
  }
  return out
}

// Tính lại EXP THÁNG cho 1 lớp (idempotent). Thay MỌI EXP của (lớp×tháng): xoá per-buổi cũ (ref_buoi trong
// tháng: rank_*/btvn/exp_et/exp_btvn) + dòng tháng cũ (exp_thang/exp_btvn_thang) → chèn dòng CHI TIẾT.
// KHÔNG đụng bù/bổ trợ (buổi loai≠'thuong', attend_floor).
export async function recomputeExpThang(lopId: string, ym: string): Promise<{ hs: number; tong: number }> {
  // §2.0 (30/08): toàn bộ engine EXP tháng (ET theo hạng + BTVN theo bài + điều chỉnh
  // tháng + xoá-ghi ledger) chạy NGUYÊN TỬ trong fn_recompute_exp_thang (mig 202608300240).
  const { data, error } = await supabase.rpc('fn_recompute_exp_thang', { p_lop_id: lopId, p_ym: ym })
  if (error) throw error
  return { hs: Number((data as any)?.hs ?? 0), tong: Number((data as any)?.tong ?? 0) }
}

// Đóng BTVN: CHỐT trạng thái buổi → recompute EXP tháng (idempotent). KHÔNG Elo.
// ⚠ CEO 21/08: TRƯỚC đây "KHÔNG gate hoàn-tất" — cố tình, vì BTVN buổi thường thường đóng ở BUỔI SAU (deadline
// = trước ca kế tiếp), nên nếu bắt buộc mới "Hoàn tất" thì buổi treo "chưa xong" cả tuần dù trong-buổi đã xong
// sạch. CEO xác nhận muốn đổi: "Hoàn tất" giờ ĐÚNG NGHĨA ĐEN — đủ cả 4 — chấp nhận đánh đổi buổi treo lâu hơn.
export async function closeBTVN(buoiId: string): Promise<{ already?: boolean; thuong: number }> {
  // §2.0 (30/08): claim + recompute EXP + hoàn tất trong MỘT transaction (fn_dong_btvn).
  const { data, error } = await supabase.rpc('fn_dong_btvn', { p_buoi_id: buoiId })
  if (error) throw error
  const r = (data ?? {}) as any
  if (r.already) return { already: true, thuong: 0 }
  return { thuong: Number(r.thuong ?? 0) }
}
export async function reopenBTVN(buoiId: string): Promise<void> {
  const { data: b } = await supabase.from('buoi_hoc').select('lop_id, ngay').eq('id', buoiId).maybeSingle()
  // .neq trang_thai 'huy': cùng lý do như moLaiDanhGia — không un-huỷ buổi qua đường mở lại BTVN.
  await supabase.from('buoi_hoc').update({ btvn_dong_at: null, trang_thai: 'mo', updated_at: new Date().toISOString() }).eq('id', buoiId).neq('trang_thai', 'huy')
  if (b && (b as any).lop_id) await recomputeExpThang((b as any).lop_id, String((b as any).ngay).slice(0, 7))
}

// ── BẢNG TÍNH ELO 1 phase (đọc lại từ history — kiểm tra/quản lý sau khi đóng) ──
// Hiện đủ: điểm thô · kỳ vọng E · thực tế A · Δ=K(A−E) · Elo trước→sau · +EXP. Sắp theo điểm thô (hạng).
export type EloBreakdown = { hoc_sinh_id: string; ho_ten: string; points: number; expected: number; actual: number; delta: number; eloBefore: number; eloAfter: number; exp: number; rank: number; coElo: boolean }
export async function getEloBreakdown(buoiId: string, phase: Phase): Promise<EloBreakdown[]> {
  const [{ data: hist }, { data: expRows }] = await Promise.all([
    supabase.from('gami_elo_history').select('hoc_sinh_id, expected, actual, delta, elo_before, elo_after').eq('buoi_hoc_id', buoiId).eq('phase', phase).limit(LIMIT),
    supabase.from('gami_exp_ledger').select('hoc_sinh_id, amount').eq('ref_buoi_hoc_id', buoiId).in('source', ['rank_' + phase, 'exp_' + phase, 'attend_floor']).limit(LIMIT),
  ])
  const probs = await listProblems(buoiId, phase)
  const probIds = probs.map((p) => p.id)
  const grades = probIds.length ? ((await supabase.from('gami_grades').select('hoc_sinh_id, points').in('problem_id', probIds).limit(LIMIT)).data ?? []) : []
  const ptMap = new Map<string, number>(); for (const g of grades as any[]) ptMap.set(g.hoc_sinh_id, (ptMap.get(g.hoc_sinh_id) ?? 0) + Number(g.points))
  const expMap = new Map<string, number>(); for (const e of (expRows ?? []) as any[]) expMap.set(e.hoc_sinh_id, (expMap.get(e.hoc_sinh_id) ?? 0) + Number(e.amount))
  const histMap = new Map((hist ?? []).map((h: any) => [h.hoc_sinh_id, h]))
  const ids = [...new Set([...(hist ?? []).map((h: any) => h.hoc_sinh_id), ...(expRows ?? []).map((e: any) => e.hoc_sinh_id)])]
  if (!ids.length) return []
  const { data: hs } = await supabase.from('hoc_sinh').select('id, ho_ten').in('id', ids).limit(LIMIT)
  const nameMap = new Map((hs ?? []).map((h: any) => [h.id, h.ho_ten]))
  const rows: EloBreakdown[] = ids.map((id) => {
    const h: any = histMap.get(id)
    return { hoc_sinh_id: id, ho_ten: nameMap.get(id) ?? '?', points: ptMap.get(id) ?? 0,
      expected: h ? Number(h.expected) : 0, actual: h ? Number(h.actual) : 0, delta: h ? h.delta : 0,
      eloBefore: h ? h.elo_before : 0, eloAfter: h ? h.elo_after : 0, exp: expMap.get(id) ?? 0, rank: 0, coElo: !!h }
  })
  rows.sort((a, b) => b.points - a.points || b.delta - a.delta)
  rows.forEach((r, i) => { r.rank = i + 1 })
  return rows
}

// ── ĐÓNG PHASE: tính Elo (buổi thường/MT) + ghi EXP. Idempotent. ──
export type RevealRow = { hoc_sinh_id: string; rawPoints: number; rank: number; exp: number; eloBefore?: number; eloAfter?: number; delta?: number }
// khongCoDuLieu = đã ĐÓNG phase nhưng KHÔNG tính Elo/EXP vì không có dòng chấm nào. UI PHẢI nói ra —
// im lặng bỏ qua chính là cách bug 07-21 sống sót cả tháng.
export async function closePhase(buoiId: string, phase: Phase): Promise<{ already?: boolean; khongCoDuLieu?: boolean; reveal?: RevealRow[] }> {
  // §2.0 (30/08): TOÀN BỘ engine đóng phase (order-lock, claim, Elo pairwise, hạng, EXP)
  // chạy trong MỘT transaction ở DB — fn_dong_phase (mig 202608300240/0243). Test vàng
  // reopen+reclose buổi thật: mọi số Elo khớp lịch sử per-HS; hạng nhóm hoà giờ TẤT ĐỊNH
  // (JS cũ hên xui theo thứ tự fetch roster). Client chỉ gọi + hiển thị reveal.
  const { data, error } = await supabase.rpc('fn_dong_phase', { p_buoi_id: buoiId, p_phase: phase })
  if (error) throw error
  const r = (data ?? {}) as any
  if (r.already) return { already: true }
  return { reveal: (r.reveal ?? []) as RevealRow[], khongCoDuLieu: r.khongCoDuLieu === true ? true : undefined }
}

// (markClosed đã xuống DB — nằm trong fn_dong_phase, §2.0.)

// Buổi THƯỜNG "hoàn tất" = ingame + ET + Đánh giá sau buổi + BTVN đều đã đóng (+ MT nếu buổi có gán).
// CEO 21/08: trước đây chỉ xét ingame+ET(+MT) — nhãn xanh "Hoàn tất" ở màn Buổi học nói dối phần Đánh
// giá/BTVN còn thiếu (task engine "Việc của tôi" vẫn nhắc đúng, độc lập cột này, nhưng không ai để ý
// sang đó khi đã thấy nhãn xanh). Gọi lại mỗi khi 1 trong 4 việc đổi trạng thái (đóng HOẶC mở lại).
async function recomputeHoanTat(buoiId: string): Promise<void> {
  const { data: b } = await supabase.from('buoi_hoc')
    .select('trang_thai, ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at, mt_dong_at').eq('id', buoiId).maybeSingle()
  if (!b || (b as any).trang_thai === 'huy') return
  const hasMT = !!(await supabase.from('gami_session_problems').select('id', { count: 'exact', head: true }).eq('buoi_hoc_id', buoiId).eq('phase', 'mt')).count
  const du = !!(b as any).ingame_dong_at && !!(b as any).et_dong_at && !!(b as any).danh_gia_xong_at && !!(b as any).btvn_dong_at && (!hasMT || !!(b as any).mt_dong_at)
  const next = du ? 'hoan_tat' : 'mo'
  if ((b as any).trang_thai !== next) await supabase.from('buoi_hoc').update({ trang_thai: next, updated_at: new Date().toISOString() }).eq('id', buoiId)
}

// ── ĐÁNH GIÁ SAU BUỔI (GV) ────────────────────────────────────────
// Dạng của buổi = các dạng đã gắn ở "Chấm bài trên lớp" (ingame). GV cho mỗi HS:
//   verdict per-dạng {0/0.5/1} (= phép đo summative, feed mastery) + nhận xét định tính + % hoàn thành
//   buổi (mig 0101, Thùy 07-16 — ước lượng thô để PH/GV định lượng nhanh, KHÔNG phải phép đo mastery).
export type DanhGiaDiem = 0 | 0.5 | 1
export type DanhGiaHS = { hoc_sinh_id: string; nhan_xet: string | null; hoanThanhPct: number | null; muc: number | null; mucMa: string | null; diemTheoDang: Record<string, DanhGiaDiem> }
// Mốc % (LEGACY — buổi cũ đã chấm; UI mới dùng Mức).
export const HOAN_THANH_PCT_OPTS = Array.from({ length: 21 }, (_, i) => 100 - i * 5)

// ── Mức chấm buổi (định tính, GV nhập tay) — 5 cao → 1 thấp ──────────
// MỘT mức có NHIỀU nhãn (CEO 16/08): cùng "Mức 4" nhưng "theo kịp bài" ≠ "tốt nhưng chậm"
// ≠ "khá tốt nhưng còn sai sót". Số mức nói ĐỘ, mã nhãn nói VÌ SAO.
// DB lưu `muc_ma` (danh tính) + `muc` (độ, để xếp/so sánh); câu chữ ở đây, sửa được.
// ⚠ Thêm mã mới PHẢI kèm migration nới `buoi_danh_gia_muc_ma_chk` (CLAUDE.md §2.1).
export type MucItem = { ma: string; muc: number; nhan: string }
export const MUC_CATALOG: readonly MucItem[] = [
  { ma: '5a', muc: 5, nhan: 'Con làm đúng bài và làm nhanh.' },
  { ma: '4a', muc: 4, nhan: 'Con theo kịp bài học, hoàn thành được yêu cầu đưa ra.' },
  { ma: '4b', muc: 4, nhan: 'Con làm bài tốt nhưng tốc độ chưa nhanh.' },
  { ma: '4c', muc: 4, nhan: 'Con làm bài khá tốt nhưng vẫn còn sai sót.' },
  { ma: '3a', muc: 3, nhan: 'Con bị quên kiến thức. Khi được nhắc lại thì làm bài tốt.' },
  { ma: '3b', muc: 3, nhan: 'Con làm được bài nhưng con làm rất chậm.' },
  { ma: '3c', muc: 3, nhan: 'Con làm được bài nhưng chưa được hoàn thiện, còn rất hay sai sót.' },
  { ma: '3d', muc: 3, nhan: 'Con đang gặp khó khăn với tốc độ học của lớp. Một số phần con còn chưa theo kịp.' },
  { ma: '2a', muc: 2, nhan: 'Con chưa tự làm được bài, còn cần thầy cô hướng dẫn.' },
  { ma: '2b', muc: 2, nhan: 'Con đang chưa theo kịp tốc độ học của lớp. Nhiều kiến thức con chưa được học.' },
  { ma: '1a', muc: 1, nhan: 'Con chưa hiểu được nội dung bài học.' },
]
export const MUC_OPTS = [5, 4, 3, 2, 1] as const // thứ tự NHÓM khi hiển thị
export const mucItem = (ma: string | null | undefined) => MUC_CATALOG.find((m) => m.ma === ma) ?? null
// Nhãn CŨ (1 nhãn / mức, dùng tới 16/08). 321 dòng mức 3/4 trong DB mang nghĩa theo bộ này và
// `muc_ma` = null. KHÔNG xoá khỏi code: xoá thì lịch sử hiện "Mức 4" trống nghĩa — hoặc tệ hơn,
// bị đọc bằng nhãn MỚI (CLAUDE.md §2: cấm xoá cứng bên được tham chiếu bằng text).
export const MUC_NHAN_CU: Record<number, string> = {
  5: 'Làm đúng bài, làm nhanh',
  4: 'Làm đúng bài, chưa nhanh hoặc còn sai sót ít',
  3: 'Làm bài không ổn định, sai nhiều',
  2: 'Không tự làm được, cần hướng dẫn',
  1: 'Chưa tư duy được cách làm bài',
}
// Nhãn để HIỂN THỊ 1 dòng đánh giá: ưu tiên mã mới, không có thì rơi về nhãn cũ theo số mức.
export function nhanMuc(muc: number | null, mucMa: string | null): string | null {
  const it = mucItem(mucMa)
  if (it) return it.nhan
  return muc == null ? null : (MUC_NHAN_CU[muc] ?? null)
}

// Dạng buổi này dạy (distinct ma_dang của bài ingame, bỏ null)
export async function dangCuaBuoi(buoiId: string): Promise<string[]> {
  const { data, error } = await supabase.from('gami_session_problems').select('ma_dang').eq('buoi_hoc_id', buoiId).eq('phase', 'ingame').limit(LIMIT)
  if (error) throw error
  return [...new Set((data ?? []).map((r: any) => r.ma_dang).filter(Boolean))] as string[]
}

export async function getDanhGia(buoiId: string): Promise<Record<string, DanhGiaHS>> {
  const [nx, dg] = await Promise.all([
    supabase.from('buoi_danh_gia').select('hoc_sinh_id, nhan_xet, hoan_thanh_pct, muc, muc_ma').eq('buoi_hoc_id', buoiId).limit(LIMIT),
    supabase.from('buoi_danh_gia_dang').select('hoc_sinh_id, ma_dang, diem').eq('buoi_hoc_id', buoiId).limit(LIMIT),
  ])
  if (nx.error) throw nx.error
  if (dg.error) throw dg.error
  const out: Record<string, DanhGiaHS> = {}
  const ensure = (id: string) => (out[id] ??= { hoc_sinh_id: id, nhan_xet: null, hoanThanhPct: null, muc: null, mucMa: null, diemTheoDang: {} })
  for (const r of (nx.data ?? []) as any[]) { const e = ensure(r.hoc_sinh_id); e.nhan_xet = r.nhan_xet; e.hoanThanhPct = r.hoan_thanh_pct ?? null; e.muc = r.muc ?? null; e.mucMa = r.muc_ma ?? null }
  for (const r of (dg.data ?? []) as any[]) ensure(r.hoc_sinh_id).diemTheoDang[r.ma_dang] = Number(r.diem) as DanhGiaDiem
  return out
}

// Mốc HOÀN THÀNH đánh giá sau buổi (task định tính — không có Elo/đóng phase). Bấm nút → set; mở lại → null.
// Đóng/mở đều có thể đổi trang_thai "Hoàn tất" của buổi thường (xem recomputeHoanTat) — mở lại thì LUÔN
// rớt về 'mo' (thiếu đánh giá là chắc chắn chưa đủ 4, không cần đọc lại 3 việc kia để biết).
export async function dongDanhGia(buoiId: string): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ danh_gia_xong_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
  await recomputeHoanTat(buoiId)
}
export async function moLaiDanhGia(buoiId: string): Promise<void> {
  // .neq trang_thai 'huy': buổi đã huỷ không hiện tab này (UI chặn), nhưng đừng để 1 lời gọi lạc đường un-huỷ nó.
  const { error } = await supabase.from('buoi_hoc').update({ danh_gia_xong_at: null, trang_thai: 'mo', updated_at: new Date().toISOString() }).eq('id', buoiId).neq('trang_thai', 'huy')
  if (error) throw error
}

// verdict 1 ô (HS × dạng). null = xoá (anti-NULL: chưa đánh giá = không có dòng).
export async function setDanhGiaDang(buoiId: string, hsId: string, maDang: string, diem: DanhGiaDiem | null): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (diem === null) {
    const { error } = await supabase.from('buoi_danh_gia_dang').delete().match({ buoi_hoc_id: buoiId, hoc_sinh_id: hsId, ma_dang: maDang })
    if (error) throw error; return
  }
  const { error } = await supabase.from('buoi_danh_gia_dang').upsert(
    { buoi_hoc_id: buoiId, hoc_sinh_id: hsId, ma_dang: maDang, diem, graded_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'buoi_hoc_id,hoc_sinh_id,ma_dang' })
  if (error) throw error
}

// ── VIỆC CỦA TÔI (task-derive cho GV/TG) ──────────────────────────
// Pure-derive (§4): buổi đang mở của lớp tôi phụ trách → task theo vai (KHÔNG đẻ row task).
//   GV → đánh giá sau buổi + chấm bài trên lớp · TG → chấm bài trên lớp + chấm ET.
// 'baosai' = duyệt HS báo sai ở test online — KHÔNG phải khâu của buổi như 5 tab kia:
// nó mở màn "Duyệt chấm online", không mở BuoiDetail (xem TaskCard ở NhanSuHome).
export type TabKey = 'diemdanh' | 'danhgia' | 'ingame' | 'et' | 'btvn' | 'mt' | 'baosai'
// deadline (Thùy chốt): chấm bài + đánh giá = 23h59 ngày buổi · ET = 12h trưa hôm sau · BTVN = 2h TRƯỚC ca học tiếp theo của lớp · MT = 23h59 ngày thi (giống chấm bài).
export type MyTask = { buoiId: string; lopId: string; lop: string; ngay: string; vai: 'gv' | 'tg'; tab: TabKey; label: string; done: boolean; doneAt: string | null; deadline: number | null; loai?: 'bu' | 'bo_tro_duoi' | 'bo_tro_yeu' }
// Export: trợ lý cần ĐÚNG bảng vai→khâu này để dựng rổ "dự kiến hôm nay" cho buổi CHƯA MỞ
// (chưa có dòng buoi_hoc ⇒ chưa có task để đọc). Chép lại một bản thứ hai ở troly.ts là đẻ
// hai nguồn sự thật rồi lệch — thêm khâu ở đây mà quên bên kia thì rổ dự kiến thiếu âm thầm.
export const TASKS_BY_VAI: Record<'gv' | 'tg', { tab: TabKey; label: string }[]> = {
  gv: [{ tab: 'danhgia', label: 'Đánh giá sau buổi' }, { tab: 'ingame', label: 'Chấm bài trên lớp' }],
  tg: [{ tab: 'ingame', label: 'Chấm bài trên lớp' }, { tab: 'et', label: 'Chấm ET' }, { tab: 'btvn', label: 'Chấm BTVN' }],
}
export async function getMyTasks(): Promise<MyTask[]> {
  const prof = await getMyProfile()
  if (!prof) return []
  // 1 người có thể giữ NHIỀU vai trên CÙNG lớp (vd gv-phụ + tg) → gom TẤT CẢ vai, đừng gộp về 1.
  const rolesByLop = new Map<string, Set<'gv' | 'tg'>>()
  for (const pc of prof.phanCong) {
    const v = pc.vai_tro === 'gv' ? 'gv' : 'tg'
    if (!rolesByLop.has(pc.lop_id)) rolesByLop.set(pc.lop_id, new Set())
    rolesByLop.get(pc.lop_id)!.add(v)
  }
  const lopIds = [...rolesByLop.keys()]
  if (!lopIds.length) return []
  // mo + hoan_tat (bỏ huy): task XONG vẫn trả về (cờ done + doneAt) để hiện ở nhóm "Đã xong" — mở lại xem/sửa được.
  const { data: buois, error } = await supabase.from('buoi_hoc')
    .select('id, lop_id, ngay, ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at, mt_dong_at, lop:lop_id(ten_lop)').neq('trang_thai', 'huy').eq('loai', 'thuong').in('lop_id', lopIds).order('ngay').limit(LIMIT)
  if (error) throw error
  // MT (Thùy 07-08: "phải hiện trong buổi học giống ET") KHÔNG tự có trên MỌI buổi (khác ingame/et/btvn
  // luôn có) → phải hỏi thật buổi nào ĐÃ được gán MT (tai_lieu loai='mt_buoi' khớp lớp+ngày), tránh vỡ
  // "Việc của tôi" với "Chấm MT" rỗng ở 99% ngày thường.
  const mtKeys = new Set<string>()
  if ((buois ?? []).length) {
    const { data: mtDocs } = await supabase.from('tai_lieu').select('lop_id, ngay').eq('loai', 'mt_buoi').in('lop_id', lopIds).limit(LIMIT)
    for (const d of (mtDocs ?? []) as any[]) mtKeys.add(`${d.lop_id}|${d.ngay}`)
  }
  // TKB cho deadline BTVN (= 2h trước ca học tiếp theo của lớp). Tải 1 lần, suy ca-kế client.
  const { data: tkb } = await supabase.from('thoi_khoa_bieu')
    .select('lop_id, thu, gio_bat_dau, hieu_luc_tu, hieu_luc_den, lop:lop_id(ngay_khai_giang)').in('lop_id', lopIds).limit(LIMIT)
  const tkbByLop = new Map<string, any[]>()
  for (const s of (tkb ?? []) as any[]) { if (!tkbByLop.has(s.lop_id)) tkbByLop.set(s.lop_id, []); tkbByLop.get(s.lop_id)!.push(s) }
  // ⭐ Fix 07-19 (Thùy: "kiểm tra lại deadline BTVN, phải trước buổi tiếp theo"): TKB chỉ là LỊCH LẶP —
  // ngày TKB dự đoán "buổi tiếp theo" có thể đã bị HUỶ ad-hoc (huyBuoi/huyBuoiCuaNgay, vd "GV bận") mà TKB
  // không biết. Trước đây caTiepTheo bỏ qua việc này → tính deadline theo 1 buổi ĐÃ HUỶ, cắt ngắn hạn nộp
  // BTVN vô lý (buổi thật kế tiếp có thể xa hơn nhiều). Nạp danh sách buổi 'thuong' đã huỷ để SKIP qua.
  const { data: huyRows } = await supabase.from('buoi_hoc')
    .select('lop_id, ngay').eq('loai', 'thuong').eq('trang_thai', 'huy').in('lop_id', lopIds).limit(LIMIT)
  const huyKeys = new Set((huyRows ?? []).map((r: any) => `${r.lop_id}|${r.ngay}`))
  const caTiepTheo = (lopId: string, after: string): number | null => {
    for (let i = 1; i <= 21; i++) {
      const day = congNgay(after, i); const thu = thuOf(day)
      if (huyKeys.has(`${lopId}|${day}`)) continue // buổi ngày này đã huỷ → không phải "buổi tiếp theo" thật
      const slot = (tkbByLop.get(lopId) ?? []).find((s: any) => s.thu === thu && s.hieu_luc_tu <= day && (!s.hieu_luc_den || s.hieu_luc_den >= day) && (!s.lop?.ngay_khai_giang || s.lop.ngay_khai_giang <= day))
      if (slot) return vnInstant(day, String(slot.gio_bat_dau).slice(0, 5))
    }
    return null
  }
  // ⭐ ET ONLINE: máy chấm + tự đổ vào lưới (fn_et_online_dong_bo, 03/09) nhưng vẫn cần người
  // bấm "Xác nhận ET" mới tính Elo/EXP + đóng buổi. Thùy 03/09: "Dữ liệu tự vào. TA chỉ cần bấm
  // xác nhận để đóng như bình thường" ⇒ GIỮ task, chỉ đổi nhãn "Xác nhận ET (online)". (Trước
  // đây bỏ hẳn task theo spec §9 — hậu quả: không ai vào tab, Elo ET online = 0 suốt từ đầu.)
  const etOnlineKeys = new Set<string>()
  {
    const { data: etTests } = await supabase.from('bai_test')
      .select('lop_id, ngay').eq('loai', 'et').in('lop_id', lopIds).limit(LIMIT)
    for (const t of (etTests ?? []) as any[]) etOnlineKeys.add(`${t.lop_id}|${t.ngay}`)
  }

  const out: MyTask[] = []
  for (const b of (buois ?? []) as any[]) {
    const doneAtTab: Record<TabKey, string | null> = { diemdanh: null, ingame: b.ingame_dong_at, danhgia: b.danh_gia_xong_at, et: b.et_dong_at, btvn: b.btvn_dong_at, mt: b.mt_dong_at, baosai: null }
    const deadlineOf = (tab: TabKey): number | null => {
      if (tab === 'ingame' || tab === 'danhgia' || tab === 'mt') return vnInstant(b.ngay, '23:59')
      if (tab === 'et') return vnInstant(congNgay(b.ngay, 1), '12:00')
      if (tab === 'btvn') { const ca = caTiepTheo(b.lop_id, b.ngay); return ca == null ? null : ca - 2 * 3600000 }
      return null
    }
    const roles = rolesByLop.get(b.lop_id)!
    const seen = new Set<TabKey>() // dedup tab trùng (chấm bài có ở cả gv lẫn tg)
    for (const vai of ['gv', 'tg'] as const) {
      if (!roles.has(vai)) continue
      for (const t of TASKS_BY_VAI[vai]) {
        if (seen.has(t.tab)) continue
        seen.add(t.tab)
        // Buổi có ET online: máy đã chấm + đổ lưới, việc còn lại là bấm xác nhận — nhãn nói rõ để TA khỏi đi tìm bài giấy.
        const label = t.tab === 'et' && etOnlineKeys.has(`${b.lop_id}|${b.ngay}`) ? 'Xác nhận ET (online)' : t.label
        out.push({ buoiId: b.id, lopId: b.lop_id, lop: b.lop?.ten_lop ?? '?', ngay: b.ngay, vai, tab: t.tab, label, done: !!doneAtTab[t.tab], doneAt: doneAtTab[t.tab], deadline: deadlineOf(t.tab) })
      }
      // MT — CHỈ khi buổi này thật sự có gán MT (mtKeys). TG chấm (giống ET); GV không có task riêng.
      if (vai === 'tg' && mtKeys.has(`${b.lop_id}|${b.ngay}`) && !seen.has('mt')) {
        seen.add('mt')
        out.push({ buoiId: b.id, lopId: b.lop_id, lop: b.lop?.ten_lop ?? '?', ngay: b.ngay, vai: 'tg', tab: 'mt', label: 'Chấm MT', done: !!b.mt_dong_at, doneAt: b.mt_dong_at, deadline: deadlineOf('mt') })
      }
    }
  }
  // ── DUYỆT BÁO SAI test online (spec test-online §9) — THAY cho task "Chấm ET" đã bỏ ở trên.
  // Pure-derive đúng nghĩa: report `moi` TỒN TẠI ⇒ task; duyệt xong (dung/sai) là task tự biến
  // mất, không có cờ done nào phải dọn. Gom về 1 task / (lớp × buổi) để không vỡ list khi 1 câu
  // bị 20 HS cùng báo.
  // ⚠ PostgREST không filter được quan hệ LỒNG (CLAUDE.md §2) — bảng report nhỏ nên tải hết
  // rồi lọc client theo lớp của tôi, đừng cố nhét filter vào select lồng 3 tầng.
  {
    const tgLops = new Set([...rolesByLop.entries()].filter(([, r]) => r.has('tg')).map(([id]) => id))
    if (tgLops.size) {
      const { data: reps } = await supabase.from('bai_test_report')
        .select('created_at, blc:bai_lam_cau_id(cau:bai_test_cau_id(test:bai_test_id(lop_id, ngay)))')
        .eq('trang_thai', 'moi').limit(LIMIT)
      // gom theo lớp|ngày → đếm + report cũ nhất (để tính deadline)
      const gom = new Map<string, { n: number; sinh: number }>()
      for (const r of (reps ?? []) as any[]) {
        const t = r.blc?.cau?.test
        if (!t?.lop_id || !tgLops.has(t.lop_id)) continue
        const k = `${t.lop_id}|${t.ngay}`
        const cu = gom.get(k) ?? { n: 0, sinh: Number.POSITIVE_INFINITY }
        gom.set(k, { n: cu.n + 1, sinh: Math.min(cu.sinh, new Date(r.created_at).getTime()) })
      }
      for (const [k, v] of gom) {
        const [lopId, ngay] = k.split('|')
        const b = (buois ?? []).find((x: any) => x.lop_id === lopId && x.ngay === ngay) as any
        out.push({
          buoiId: b?.id ?? '', lopId, lop: b?.lop?.ten_lop ?? '?', ngay, vai: 'tg', tab: 'baosai',
          label: `Duyệt báo sai (${v.n})`,
          done: false, doneAt: null,
          deadline: Number.isFinite(v.sinh) ? v.sinh + 24 * 3600000 : null, // 24h từ báo sai đầu tiên
        })
      }
    }
  }

  // ── BUỔI BÙ (loai='bu'): TA đứng lớp (nguoi_day_tg) LÀM CẢ chấm ET LẪN đánh giá. Buổi bù do TA chạy
  // (người bổ trợ mặc định); màn BuoiBuDetail gộp CẢ ET lẫn đánh giá + 2 nút đóng vào 1 chỗ → ai mở buổi
  // làm cả hai. GV KHÔNG nhận task ở buổi bù (Thùy chốt 07-26). KHÔNG qua phan_cong_lop, KHÔNG Elo.
  // ⚠ BUG CŨ (đã sửa 07-26): đánh giá route nhầm sang nguoi_day (GV) nên TA — người thật sự đánh giá —
  //   KHÔNG BAO GIỜ thấy task "Đánh giá buổi bù" ở Việc của tôi (chỉ thấy ET). Nay cả 2 về TA.
  // ⭐ Fix 07-16 (Thùy: "HS báo vắng nhưng Task ET không tự mất"): R-ET/R-DG pure-derive đúng nghĩa phải
  // là "CÓ HS co_mat" — trước đây chỉ dựa vào cờ et_dong_at/danh_gia_xong_at, mà nút "Xác nhận ET"/"Hoàn
  // thành đánh giá" ở BuoiBuDetail (BoTroScreen.tsx) chỉ hiện khi coMat.length>0 → buổi bù toàn vắng
  // (HS báo bù rồi lại không đến) thì KHÔNG CÁCH NÀO set được cờ, task kẹt vĩnh viễn. Sửa tận gốc: buổi
  // 0 HS có mặt = không có gì để chấm/đánh giá → KHÔNG sinh task luôn (N/A, không phải "chưa xong"). ──
  const myId = prof.nhanSu.id
  // owner buổi bổ trợ = TA đứng lớp (nguoi_day_tg); nếu buổi CHƯA gán TA thì fallback GV (nguoi_day) để
  // task không mồ côi. Lấy cả 2 slot rồi lọc theo owner ở client (PostgREST khó biểu diễn "coalesce = me").
  const { data: bu } = await supabase.from('buoi_hoc')
    .select('id, ngay, nguoi_day, nguoi_day_tg, et_dong_at, danh_gia_xong_at').eq('loai', 'bu').neq('trang_thai', 'huy')
    .or(`nguoi_day.eq.${myId},nguoi_day_tg.eq.${myId}`).limit(LIMIT)
  const buMine = ((bu ?? []) as any[]).filter((b) => (b.nguoi_day_tg ?? b.nguoi_day) === myId)
  const buIds = buMine.map((b) => b.id)
  const coMatCountBu = new Map<string, number>()
  const chuaDDBu = new Map<string, number>() // HS CHƯA điểm danh (diem_danh null) — KHÁC vắng
  if (buIds.length) {
    const { data: buRoster } = await supabase.from('buoi_hoc_hs').select('buoi_hoc_id, diem_danh').in('buoi_hoc_id', buIds).limit(LIMIT)
    for (const r of (buRoster ?? []) as any[]) {
      if (r.diem_danh === 'co_mat') coMatCountBu.set(r.buoi_hoc_id, (coMatCountBu.get(r.buoi_hoc_id) ?? 0) + 1)
      else if (r.diem_danh == null) chuaDDBu.set(r.buoi_hoc_id, (chuaDDBu.get(r.buoi_hoc_id) ?? 0) + 1)
    }
  }
  for (const b of buMine) {
    // ⭐ Bug Ánh Tuyết (07-26): guard cũ chỉ đếm co_mat nên buổi CHƯA ai điểm danh (diem_danh null) bị
    // ẩn HẲN khỏi Việc của tôi → TA không có đường vào để điểm danh + chấm. Điểm danh buổi bù làm NGAY
    // trong BuoiBuDetail (không có task 'diemdanh' riêng), nên task ET/đánh giá PHẢI hiện khi buổi còn
    // HS chưa điểm danh. CHỈ bỏ qua khi điểm danh XONG mà 0 ai có mặt (toàn vắng — không có gì để chấm).
    if ((coMatCountBu.get(b.id) ?? 0) === 0 && (chuaDDBu.get(b.id) ?? 0) === 0) continue
    const vaiBu: 'gv' | 'tg' = b.nguoi_day_tg ? 'tg' : 'gv' // nhãn vai theo slot owner thật (fallback GV khi thiếu TA)
    out.push({ buoiId: b.id, lopId: '', lop: 'Buổi bù', ngay: b.ngay, vai: vaiBu, tab: 'et', label: 'Chấm ET (bù)', done: !!b.et_dong_at, doneAt: b.et_dong_at, deadline: vnInstant(congNgay(b.ngay, 1), '12:00'), loai: 'bu' })
    out.push({ buoiId: b.id, lopId: '', lop: 'Buổi bù', ngay: b.ngay, vai: vaiBu, tab: 'danhgia', label: 'Đánh giá buổi bù', done: !!b.danh_gia_xong_at, doneAt: b.danh_gia_xong_at, deadline: vnInstant(b.ngay, '23:59'), loai: 'bu' })
  }
  // ── BUỔI BỔ TRỢ YẾU (loai='bo_tro_yeu'): TA/GV cao cấp đứng lớp (nguoi_day_tg) làm CẢ chấm ET LẪN
  // đánh giá, ĐỐI XỨNG buổi bù (khác đuổi — đuổi không đo mastery nên không có ET). 1 buổi = 1 HS,
  // không gom nhiều em như buổi bù (PLAN-botro-yeu.md §0 mục 4). Cùng luật "0 HS có mặt = không sinh
  // task" như buổi bù (N/A, không phải "chưa xong") — xem bug 07-16 ở khối BUỔI BÙ phía trên.
  const { data: by } = await supabase.from('buoi_hoc')
    .select('id, ngay, nguoi_day, nguoi_day_tg, et_dong_at, danh_gia_xong_at').eq('loai', 'bo_tro_yeu').neq('trang_thai', 'huy')
    .or(`nguoi_day.eq.${myId},nguoi_day_tg.eq.${myId}`).limit(LIMIT)
  const byMine = ((by ?? []) as any[]).filter((b) => (b.nguoi_day_tg ?? b.nguoi_day) === myId)
  const byIds = byMine.map((b) => b.id)
  const coMatCountBy = new Map<string, number>()
  const chuaDDBy = new Map<string, number>()
  if (byIds.length) {
    const { data: byRoster } = await supabase.from('buoi_hoc_hs').select('buoi_hoc_id, diem_danh').in('buoi_hoc_id', byIds).limit(LIMIT)
    for (const r of (byRoster ?? []) as any[]) {
      if (r.diem_danh === 'co_mat') coMatCountBy.set(r.buoi_hoc_id, (coMatCountBy.get(r.buoi_hoc_id) ?? 0) + 1)
      else if (r.diem_danh == null) chuaDDBy.set(r.buoi_hoc_id, (chuaDDBy.get(r.buoi_hoc_id) ?? 0) + 1)
    }
  }
  for (const b of byMine) {
    if ((coMatCountBy.get(b.id) ?? 0) === 0 && (chuaDDBy.get(b.id) ?? 0) === 0) continue
    const vaiBy: 'gv' | 'tg' = b.nguoi_day_tg ? 'tg' : 'gv'
    out.push({ buoiId: b.id, lopId: '', lop: 'Bổ trợ yếu', ngay: b.ngay, vai: vaiBy, tab: 'et', label: 'Chấm ET (bổ trợ yếu)', done: !!b.et_dong_at, doneAt: b.et_dong_at, deadline: vnInstant(congNgay(b.ngay, 1), '12:00'), loai: 'bo_tro_yeu' })
    out.push({ buoiId: b.id, lopId: '', lop: 'Bổ trợ yếu', ngay: b.ngay, vai: vaiBy, tab: 'danhgia', label: 'Đánh giá bổ trợ yếu', done: !!b.danh_gia_xong_at, doneAt: b.danh_gia_xong_at, deadline: vnInstant(b.ngay, '23:59'), loai: 'bo_tro_yeu' })
  }
  // ── BUỔI ĐUỔI (loai='bo_tro_duoi'): TA đứng lớp (nguoi_day_tg) nhận xét + tick "dạng đã dạy" ở
  // BuoiDuoiDetail. Buổi đuổi do TA chạy như buổi bù (Thùy chốt 07-26 — nhất quán với buổi bù); GV
  // chốt/duyệt KẾ HOẠCH đợt ở màn Bổ trợ Đuổi, KHÔNG cầm task đánh giá per-buổi nữa. Đuổi KHÔNG có ET.
  // ⚠ BUG CŨ (đã sửa 07-26): route sang nguoi_day (GV) — nay về nguoi_day_tg (TA) cho khớp người đứng lớp.
  const { data: duoi } = await supabase.from('buoi_hoc')
    .select('id, ngay, nguoi_day, nguoi_day_tg, danh_gia_xong_at').eq('loai', 'bo_tro_duoi').neq('trang_thai', 'huy')
    .or(`nguoi_day.eq.${myId},nguoi_day_tg.eq.${myId}`).limit(LIMIT)
  for (const b of (duoi ?? []) as any[]) {
    if ((b.nguoi_day_tg ?? b.nguoi_day) !== myId) continue // owner = TA đứng lớp, fallback GV khi buổi chưa gán TA
    const vaiDuoi: 'gv' | 'tg' = b.nguoi_day_tg ? 'tg' : 'gv'
    out.push({ buoiId: b.id, lopId: '', lop: 'Buổi đuổi', ngay: b.ngay, vai: vaiDuoi, tab: 'danhgia', label: 'Đánh giá buổi đuổi', done: !!b.danh_gia_xong_at, doneAt: b.danh_gia_xong_at, deadline: vnInstant(b.ngay, '23:59'), loai: 'bo_tro_duoi' })
  }
  return out
}

// ── DASHBOARD VẬN HÀNH (đo hoạt động MỌI nhân sự, không riêng "tôi") ────────
// Tái dùng ĐÚNG invariant của getMyTasks (đánh giá/chấm bài/ET/BTVN) — chỉ BATCH
// cho NHIỀU người 1 lần (tránh N+1 gọi getMyTasks lặp lại per-person).
// KHÔNG gồm OPS điểm danh: buoi_hoc_hs không có cột "ai điểm danh" → team-wide,
// chưa attribute được theo TỪNG NGƯỜI (xem listOpsDiemDanhTeam bên dưới, đo theo TEAM).
export type StaffTaskRow = MyTask & { nhan_su_id: string; lop: string }
export async function listAllStaffTasks(tu: string, den: string): Promise<StaffTaskRow[]> {
  const { data: pcAll, error: e1 } = await supabase.from('phan_cong_lop').select('nhan_su_id, lop_id, vai_tro').limit(LIMIT)
  if (e1) throw e1
  const rolesByLop = new Map<string, Map<string, Set<'gv' | 'tg'>>>() // lop_id -> nhan_su_id -> roles
  const lopIdsSet = new Set<string>()
  for (const pc of (pcAll ?? []) as any[]) {
    lopIdsSet.add(pc.lop_id)
    const v: 'gv' | 'tg' = pc.vai_tro === 'gv' ? 'gv' : 'tg'
    if (!rolesByLop.has(pc.lop_id)) rolesByLop.set(pc.lop_id, new Map())
    const byNs = rolesByLop.get(pc.lop_id)!
    if (!byNs.has(pc.nhan_su_id)) byNs.set(pc.nhan_su_id, new Set())
    byNs.get(pc.nhan_su_id)!.add(v)
  }
  const lopIds = [...lopIdsSet]
  if (!lopIds.length) return []
  const { data: buois, error } = await supabase.from('buoi_hoc')
    .select('id, lop_id, ngay, ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at, mt_dong_at, lop:lop_id(ten_lop)')
    .neq('trang_thai', 'huy').eq('loai', 'thuong').in('lop_id', lopIds).gte('ngay', tu).lte('ngay', den).order('ngay').limit(LIMIT)
  if (error) throw error
  // MT KHÔNG tự có trên mọi buổi (khác ingame/et/btvn) → hỏi thật buổi nào đã gán MT (tai_lieu loai='mt_buoi'
  // khớp lớp+ngày), CÙNG logic getMyTasks — trước đây bị bỏ sót ở đây (comment cũ "buổi thường không có phase mt").
  const mtKeys = new Set<string>()
  if ((buois ?? []).length) {
    const { data: mtDocs } = await supabase.from('tai_lieu').select('lop_id, ngay').eq('loai', 'mt_buoi').in('lop_id', lopIds).limit(LIMIT)
    for (const d of (mtDocs ?? []) as any[]) mtKeys.add(`${d.lop_id}|${d.ngay}`)
  }
  const { data: tkb } = await supabase.from('thoi_khoa_bieu')
    .select('lop_id, thu, gio_bat_dau, hieu_luc_tu, hieu_luc_den, lop:lop_id(ngay_khai_giang)').in('lop_id', lopIds).limit(LIMIT)
  const tkbByLop = new Map<string, any[]>()
  for (const s of (tkb ?? []) as any[]) { if (!tkbByLop.has(s.lop_id)) tkbByLop.set(s.lop_id, []); tkbByLop.get(s.lop_id)!.push(s) }
  // ⭐ Fix 07-19 — cùng bug với getMyTasks (xem comment ở đó): TKB không biết buổi bị huỷ ad-hoc.
  const { data: huyRows } = await supabase.from('buoi_hoc')
    .select('lop_id, ngay').eq('loai', 'thuong').eq('trang_thai', 'huy').in('lop_id', lopIds).limit(LIMIT)
  const huyKeys = new Set((huyRows ?? []).map((r: any) => `${r.lop_id}|${r.ngay}`))
  const caTiepTheo = (lopId: string, after: string): number | null => {
    for (let i = 1; i <= 21; i++) {
      const day = congNgay(after, i); const thu = thuOf(day)
      if (huyKeys.has(`${lopId}|${day}`)) continue
      const slot = (tkbByLop.get(lopId) ?? []).find((s: any) => s.thu === thu && s.hieu_luc_tu <= day && (!s.hieu_luc_den || s.hieu_luc_den >= day) && (!s.lop?.ngay_khai_giang || s.lop.ngay_khai_giang <= day))
      if (slot) return vnInstant(day, String(slot.gio_bat_dau).slice(0, 5))
    }
    return null
  }
  const out: StaffTaskRow[] = []
  for (const b of (buois ?? []) as any[]) {
    const doneAtTab: Record<TabKey, string | null> = { diemdanh: null, ingame: b.ingame_dong_at, danhgia: b.danh_gia_xong_at, et: b.et_dong_at, btvn: b.btvn_dong_at, mt: b.mt_dong_at, baosai: null }
    const deadlineOf = (tab: TabKey): number | null => {
      if (tab === 'ingame' || tab === 'danhgia' || tab === 'mt') return vnInstant(b.ngay, '23:59')
      if (tab === 'et') return vnInstant(congNgay(b.ngay, 1), '12:00')
      if (tab === 'btvn') { const ca = caTiepTheo(b.lop_id, b.ngay); return ca == null ? null : ca - 2 * 3600000 }
      return null
    }
    const byNs = rolesByLop.get(b.lop_id)
    if (!byNs) continue
    for (const [nsId, roles] of byNs) {
      const seen = new Set<TabKey>()
      for (const vai of ['gv', 'tg'] as const) {
        if (!roles.has(vai)) continue
        for (const t of TASKS_BY_VAI[vai]) {
          if (seen.has(t.tab)) continue
          seen.add(t.tab)
          out.push({
            nhan_su_id: nsId, buoiId: b.id, lopId: b.lop_id, lop: b.lop?.ten_lop ?? '?', ngay: b.ngay, vai, tab: t.tab,
            label: t.label, done: !!doneAtTab[t.tab], doneAt: doneAtTab[t.tab], deadline: deadlineOf(t.tab),
          })
        }
        // MT — CHỈ khi buổi này thật sự có gán MT (mtKeys), CHỈ TG chấm (giống getMyTasks/ET).
        if (vai === 'tg' && mtKeys.has(`${b.lop_id}|${b.ngay}`) && !seen.has('mt')) {
          seen.add('mt')
          out.push({
            nhan_su_id: nsId, buoiId: b.id, lopId: b.lop_id, lop: b.lop?.ten_lop ?? '?', ngay: b.ngay, vai: 'tg', tab: 'mt',
            label: 'Chấm MT', done: !!b.mt_dong_at, doneAt: b.mt_dong_at, deadline: deadlineOf('mt'),
          })
        }
      }
    }
  }
  return out
}

// OPS điểm danh — team-wide (KHÔNG per-person, xem comment listAllStaffTasks): tỉ lệ HS đã điểm danh /
// tổng HS mọi buổi mở trong khoảng, cho biết CẢ TEAM OPS đang theo kịp không.
export async function listOpsDiemDanhTeam(tu: string, den: string): Promise<{ tongBuoi: number; tongHs: number; daDiemDanh: number }> {
  const { data: buois, error } = await supabase.from('buoi_hoc').select('id').eq('loai', 'thuong').neq('trang_thai', 'huy').gte('ngay', tu).lte('ngay', den).limit(LIMIT)
  if (error) throw error
  const ids = (buois ?? []).map((b: any) => b.id)
  if (!ids.length) return { tongBuoi: 0, tongHs: 0, daDiemDanh: 0 }
  const { data: rows, error: e2 } = await supabase.from('buoi_hoc_hs').select('diem_danh').in('buoi_hoc_id', ids).limit(LIMIT * 10)
  if (e2) throw e2
  const all = (rows ?? []) as any[]
  return { tongBuoi: ids.length, tongHs: all.length, daDiemDanh: all.filter((r) => r.diem_danh != null).length }
}

// OPS điểm danh theo TUẦN: buổi ảo (TKB × mỗi ngày trong khoảng) — như buoiAoCuaNgay nhưng cho cả khoảng, kèm `ngay`.
export async function buoiAoCuaKhoang(tu: string, den: string): Promise<(BuoiAo & { ngay: string })[]> {
  const { data: slots, error } = await supabase.from('thoi_khoa_bieu')
    .select('thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu, hieu_luc_den, lop:lop_id(id, ten_lop, mon, khoi, bac, ngay_khai_giang, trang_thai)')
    .lte('hieu_luc_tu', den).limit(LIMIT)
  if (error) throw error
  const { data: opened } = await supabase.from('buoi_hoc').select('*').gte('ngay', tu).lte('ngay', den).eq('loai', 'thuong').limit(LIMIT)
  const openMap = new Map((opened ?? []).map((b: any) => [`${b.lop_id}|${b.ngay}`, b]))
  const out: (BuoiAo & { ngay: string })[] = []
  for (let day = tu; day <= den; day = congNgay(day, 1)) {
    const thu = thuOf(day)
    for (const s of (slots ?? []) as any[]) {
      if (s.thu !== thu || s.hieu_luc_tu > day || (s.hieu_luc_den && s.hieu_luc_den < day)) continue
      if (s.lop?.trang_thai !== 'dang_hoc' || !s.lop?.ngay_khai_giang || s.lop.ngay_khai_giang > day) continue
      out.push({ lop: s.lop, slot: { gio_bat_dau: s.gio_bat_dau, gio_ket_thuc: s.gio_ket_thuc, phong: s.phong }, buoi: (openMap.get(`${s.lop.id}|${day}`) as BuoiHoc) ?? null, ngay: day })
    }
  }
  return out
}

// ── TÌM BUỔI THEO LỚP (thanh search màn Buổi học) ──────────────────────────────────────────────
// Màn chính là "buổi ẢO của MỘT NGÀY" (TKB × ngày) — muốn xem buổi 22/07 của 9A1 phải bấm đúng ngày đó.
// Hàm này lật trục: gõ tên lớp → MỌI buổi của lớp đó xuyên thời gian. Hai nguồn, gộp lại:
//   ① buổi THẬT (`buoi_hoc`, mọi loai: thường/bù/bổ trợ/MT) — quá khứ + đã mở, cái hay cần tìm nhất;
//   ② buổi ẢO SẮP TỚI (TKB, hôm nay → +14 ngày, chưa đẻ dòng) — để mở buổi thẳng từ đây, khỏi quay lại lịch.
// CHỈ tra TKB của các lớp ĐÃ KHỚP TÊN (khác buoiAoCuaKhoang quét toàn trung tâm) → rẻ, gõ tới đâu chạy tới đó.
export type BuoiTim = {
  lop: { id: string; ten_lop: string; mon: string; khoi: string | null }
  ngay: string; thu: number
  slot: { gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null }
  buoi: BuoiHoc | null   // null = chưa mở (ảo, suy từ TKB)
  coMT?: boolean         // buổi có gán MT (có câu phase='mt') → hiện nhãn 🏆 khi tìm
}
const NGAY_TIM_TOI = 14  // buổi ảo sắp tới: hôm nay → +14 ngày
export async function timBuoiTheoLop(q: string): Promise<BuoiTim[]> {
  const tu = q.trim()
  if (!tu) return []
  // Tên lớp là mã ngắn (9A1, 7S2…) → khớp CHỨA, không phân biệt hoa thường.
  const { data: lops, error } = await supabase.from('lop')
    .select('id, ten_lop, mon, khoi, ngay_khai_giang, trang_thai').ilike('ten_lop', `%${tu}%`).limit(50)
  if (error) throw error
  const dsLop = (lops ?? []) as { id: string; ten_lop: string; mon: string; khoi: string | null; ngay_khai_giang: string | null; trang_thai: string }[]
  if (!dsLop.length) return []
  const lopMap = new Map(dsLop.map((l) => [l.id, l]))
  const ids = dsLop.map((l) => l.id)

  // ① Buổi THẬT — mới nhất trước. Lấy mọi `loai` (buổi bù/bổ trợ cũng là buổi của lớp, cần tìm được).
  const { data: rows } = await supabase.from('buoi_hoc').select('*')
    .in('lop_id', ids).order('ngay', { ascending: false }).limit(500)
  const that: BuoiTim[] = ((rows ?? []) as BuoiHoc[]).map((b) => {
    const l = lopMap.get(b.lop_id as string)!
    return { lop: { id: l.id, ten_lop: l.ten_lop, mon: l.mon, khoi: l.khoi }, ngay: b.ngay, thu: b.thu ?? thuOf(b.ngay), slot: { gio_bat_dau: b.gio_bat_dau, gio_ket_thuc: b.gio_ket_thuc, phong: b.phong }, buoi: b }
  })
  const daCo = new Set(that.filter((r) => r.buoi?.loai === 'thuong').map((r) => `${r.lop.id}|${r.ngay}`))

  // ② Buổi ẢO sắp tới (chỉ lớp đang học) — bỏ ngày đã có buổi thường (nó đã nằm ở ①).
  const homNay = vnToday()
  const den = congNgay(homNay, NGAY_TIM_TOI)
  const { data: slots } = await supabase.from('thoi_khoa_bieu')
    .select('lop_id, thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu, hieu_luc_den').in('lop_id', ids).lte('hieu_luc_tu', den).limit(LIMIT)
  // 1 (lớp × ngày) = 1 buổi thường DUY NHẤT (moBuoi tra theo lop+ngay) → gom về 1 dòng, giữ slot SỚM NHẤT.
  // Cần thật: TKB có slot TRÙNG THỨ còn hiệu lực chồng nhau (9A1 có 2 dòng T6 15:00, 1 dòng đã hết hiệu
  // lực) — không gom thì ra 2 dòng y hệt trong kết quả tìm, bấm "Mở buổi" ở dòng nào cũng ra cùng 1 buổi.
  const aoMap = new Map<string, BuoiTim>()
  for (let day = homNay; day <= den; day = congNgay(day, 1)) {
    const thu = thuOf(day)
    for (const s of ((slots ?? []) as any[])) {
      const l = lopMap.get(s.lop_id)
      if (!l || l.trang_thai !== 'dang_hoc' || !l.ngay_khai_giang || l.ngay_khai_giang > day) continue
      if (s.thu !== thu || s.hieu_luc_tu > day || (s.hieu_luc_den && s.hieu_luc_den < day)) continue
      const k = `${l.id}|${day}`
      if (daCo.has(k)) continue
      const cu = aoMap.get(k)
      if (cu && (cu.slot.gio_bat_dau ?? '') <= (s.gio_bat_dau ?? '')) continue
      aoMap.set(k, { lop: { id: l.id, ten_lop: l.ten_lop, mon: l.mon, khoi: l.khoi }, ngay: day, thu, slot: { gio_bat_dau: s.gio_bat_dau, gio_ket_thuc: s.gio_ket_thuc, phong: s.phong }, buoi: null })
    }
  }
  const ao = [...aoMap.values()]
  // Cờ "có MT": buổi có câu phase='mt' (MT đã gán). 1 query cho mọi buổi thật tìm được.
  const buoiThatIds = that.map((r) => r.buoi?.id).filter(Boolean) as string[]
  if (buoiThatIds.length) {
    const { data: mtp } = await supabase.from('gami_session_problems').select('buoi_hoc_id').eq('phase', 'mt').in('buoi_hoc_id', buoiThatIds).limit(LIMIT)
    const coMTSet = new Set((mtp ?? []).map((p: any) => p.buoi_hoc_id))
    for (const r of that) if (r.buoi && coMTSet.has(r.buoi.id)) r.coMT = true
  }
  // Mới/sắp tới trước, cùng ngày thì theo giờ. Ngày dạng 'YYYY-MM-DD' nên so chuỗi = so thời gian.
  return [...ao, ...that].sort((a, b) => b.ngay.localeCompare(a.ngay) || (a.slot.gio_bat_dau ?? '').localeCompare(b.slot.gio_bat_dau ?? ''))
}

// MỞ LẠI 1 phase đã đóng để SỬA (vd TA sửa điểm ET): rollback Elo/EXP của phase đó rồi gỡ cờ đóng + về 'mo'.
// Idempotent với đóng lại: xoá elo_history + exp_ledger của phase, hoàn elo về elo_before, trừ session nếu phase tính session.
export async function reopenPhase(buoiId: string, phase: Phase): Promise<void> {
  // §2.0 (30/08): rollback Elo (trừ delta cộng dồn) + xoá history/ledger + gỡ cờ + recompute
  // EXP tháng — NGUYÊN TỬ trong fn_mo_lai_phase (mig 202608300240). Bản cũ N update rời,
  // đứt giữa chừng là Elo lệch vĩnh viễn (đúng ca audit nêu).
  const { error } = await supabase.rpc('fn_mo_lai_phase', { p_buoi_id: buoiId, p_phase: phase })
  if (error) throw error
}

// ── QUẢN LÝ ĐIỂM (Elo/EXP) — bảng tổng + hồ sơ HS ─────────────────
// `he` = bậc lớp (S/A/B/C) và `ten_lop` lấy THEO ĐÚNG MÔN của dòng Elo (§1.6: dữ liệu học tập scope
// theo môn) — 1 HS học Toán lớp S mà KHTN lớp B là chuyện thường, không có "hệ chung chung".
// null = HS không còn lớp đang-học của môn đó (đã rời lớp nhưng Elo cũ vẫn còn) → lọc "Chưa xếp lớp".
export type DiemRow = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; anh_url: string | null; mon: string; elo: number; sessions: number; exp: number; he: string | null; ten_lop: string | null }
// Bảng tổng: mỗi (HS × môn) 1 dòng Elo + tổng EXP của môn đó. Sắp Elo giảm dần (leaderboard). Lọc theo môn.
export async function listGamiBangTong(mon?: string): Promise<DiemRow[]> {
  let q = supabase.from('gami_elo').select('hoc_sinh_id, mon, elo, sessions_played, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs, khoi, anh_url)').order('elo', { ascending: false }).limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  const { data: elo, error } = await q
  if (error) throw error
  // EXP = MÙA HIỆN TẠI (reset mỗi mùa). ⚠ exp_thang key theo `note` (tháng EXP THUỘC VỀ) trong khoảng
  // tháng của mùa [startYm, nextStartYm) — KHÔNG theo created_at: recompute mùa/tháng cũ có thể chạy sang
  // tháng mới (reset đầu mùa recompute tháng 7 đúng 1/8) → created_at lọt window mà note thì không. attend_floor
  // (bù, no note, sinh 1 lần lúc đóng) lọc created_at ≥ đầu mùa. Vẫn loại legacy rank_*/btvn.
  const nowVn = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)
  const muaStart = seasonStartUtc(seasonOf(nowVn))
  const startY = Number(seasonOf(nowVn).split('-')[0])
  const startYm = `${startY}-${String(SEASON.START_MONTH).padStart(2, '0')}`, nextStartYm = `${startY + 1}-${String(SEASON.START_MONTH).padStart(2, '0')}`
  // Ledger chi tiết = vài nghìn dòng/mùa (>cap 1000) → PHẢI pagedLedger, không .limit() trần.
  const exp = await pagedLedger((q) => q.select('hoc_sinh_id, mon, amount, source, note, created_at').in('source', EXP_SOURCES))
  const expMap = new Map<string, number>()
  for (const r of exp as any[]) {
    const keep = r.source === 'attend_floor' ? r.created_at >= muaStart : (r.note >= startYm && r.note < nextStartYm)
    if (keep) { const k = r.hoc_sinh_id + '|' + (r.mon ?? ''); expMap.set(k, (expMap.get(k) ?? 0) + Number(r.amount)) }
  }
  // Ghi danh ĐANG HỌC → (HS × môn) ⇒ hệ + tên lớp. Lấy TOÀN BỘ rồi lọc ở client, KHÔNG `.in(hsIds)`:
  // 300+ uuid nhét vào URL là đường dẫn tới lỗi "URL quá dài" (CLAUDE.md §2), mà bảng này vốn nhỏ.
  const { data: gd } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id, lop:lop_id(mon, bac, ten_lop)').eq('trang_thai', 'dang_hoc').limit(LIMIT)
  const lopMap = new Map<string, { bac: string | null; ten_lop: string | null }>()
  for (const r of (gd ?? []) as any[]) if (r.lop?.mon) lopMap.set(r.hoc_sinh_id + '|' + r.lop.mon, { bac: r.lop.bac ?? null, ten_lop: r.lop.ten_lop ?? null })
  return ((elo ?? []) as any[]).map((e) => {
    const l = lopMap.get(e.hoc_sinh_id + '|' + e.mon)
    return {
      hoc_sinh_id: e.hoc_sinh_id, ho_ten: e.hoc_sinh?.ho_ten ?? '?', ma_hs: e.hoc_sinh?.ma_hs ?? null,
      khoi: e.hoc_sinh?.khoi ?? null, anh_url: e.hoc_sinh?.anh_url ?? null, mon: e.mon,
      elo: e.elo, sessions: e.sessions_played, exp: expMap.get(e.hoc_sinh_id + '|' + e.mon) ?? 0,
      he: l?.bac ?? null, ten_lop: l?.ten_lop ?? null,
    }
  })
}
// Môn cho bảng xếp hạng = MÔN CÓ LỚP (danh mục), KHÔNG suy từ Elo-đang-có (KHTN chưa có buổi đóng vẫn phải hiện bảng riêng).
export async function listGamiMons(): Promise<string[]> {
  const { data } = await supabase.from('lop').select('mon').limit(LIMIT)
  return [...new Set((data ?? []).map((r: any) => r.mon).filter(Boolean))].sort()
}
export type EloHist = { buoi_hoc_id: string; phase: string; mon: string | null; elo_before: number; delta: number; elo_after: number; created_at: string; ngay?: string | null; lop?: string | null }
// Danh sách CA HỌC (buổi thường) cho bảng quản trị Elo — mỗi ca: mã + 2 bảng Elo (lớp / ET).
export type CaHoc = { id: string; ma_buoi: string | null; ten_lop: string; ngay: string; mon: string | null; ingame_dong: boolean; et_dong: boolean; hasMT: boolean; mt_dong: boolean; trang_thai: string }
export async function listCaHoc(): Promise<CaHoc[]> {
  const { data, error } = await supabase.from('buoi_hoc').select('id, ma_buoi, ngay, trang_thai, ingame_dong_at, et_dong_at, mt_dong_at, lop:lop_id(ten_lop, mon)').eq('loai', 'thuong').order('ngay', { ascending: false }).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as any[]
  // hasMT (buổi có gán MT không) — CHỈ hỏi khi có buổi (né query rỗng); giống mtKeys ở getMyTasks/listAllStaffTasks
  // nhưng ở đây cần biết ĐÚNG buổi nào (không chỉ lớp+ngày) → hỏi thẳng gami_session_problems.phase='mt'.
  const mtBuoiIds = new Set<string>()
  if (rows.length) {
    const { data: mp } = await supabase.from('gami_session_problems').select('buoi_hoc_id').eq('phase', 'mt').in('buoi_hoc_id', rows.map((b) => b.id)).limit(LIMIT)
    for (const r of (mp ?? []) as any[]) mtBuoiIds.add(r.buoi_hoc_id)
  }
  return rows.map((b) => ({ id: b.id, ma_buoi: b.ma_buoi, ten_lop: b.lop?.ten_lop ?? '?', ngay: b.ngay, mon: b.lop?.mon ?? null, ingame_dong: !!b.ingame_dong_at, et_dong: !!b.et_dong_at, hasMT: mtBuoiIds.has(b.id), mt_dong: !!b.mt_dong_at, trang_thai: b.trang_thai }))
}
export type ExpRow = { source: string; amount: number; mon: string | null; created_at: string; ngay?: string | null; lop?: string | null }
export type DiemHS = { elo: { mon: string; elo: number; sessions: number; exp: number }[]; hist: EloHist[]; exp: ExpRow[] }
// Hồ sơ điểm 1 HS: Elo per môn (+EXP môn) · lịch sử Elo (timeline) · dòng EXP.
export async function getDiemHS(hocSinhId: string): Promise<DiemHS> {
  // exp: 1 HS ledger chi tiết cả mùa ~vài trăm dòng, cuối mùa CÓ THỂ >1000 (cap PostgREST) → pagedLedger.
  const [eloR, histR, expRows] = await Promise.all([
    supabase.from('gami_elo').select('mon, elo, sessions_played').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    supabase.from('gami_elo_history').select('buoi_hoc_id, phase, mon, elo_before, delta, elo_after, created_at, buoi:buoi_hoc_id(ngay, lop:lop_id(ten_lop))').eq('hoc_sinh_id', hocSinhId).order('created_at', { ascending: false }).limit(LIMIT),
    pagedLedger((q) => q.select('source, amount, mon, created_at, buoi:ref_buoi_hoc_id(ngay, lop:lop_id(ten_lop))').eq('hoc_sinh_id', hocSinhId)),
  ])
  const expR = { data: [...expRows].sort((a: any, b: any) => (a.created_at < b.created_at ? 1 : -1)) }
  const expByMon = new Map<string, number>()
  for (const r of (expR.data ?? []) as any[]) expByMon.set(r.mon ?? '', (expByMon.get(r.mon ?? '') ?? 0) + Number(r.amount))
  return {
    elo: ((eloR.data ?? []) as any[]).map((e) => ({ mon: e.mon, elo: e.elo, sessions: e.sessions_played, exp: expByMon.get(e.mon) ?? 0 })),
    hist: ((histR.data ?? []) as any[]).map((h) => ({ buoi_hoc_id: h.buoi_hoc_id, phase: h.phase, mon: h.mon, elo_before: h.elo_before, delta: h.delta, elo_after: h.elo_after, created_at: h.created_at, ngay: h.buoi?.ngay, lop: h.buoi?.lop?.ten_lop })),
    exp: ((expR.data ?? []) as any[]).map((x) => ({ source: x.source, amount: x.amount, mon: x.mon, created_at: x.created_at, ngay: x.buoi?.ngay, lop: x.buoi?.lop?.ten_lop })),
  }
}

// 1 dòng buoi_danh_gia mang 2 trường ĐỘC LẬP (nhan_xet + hoan_thanh_pct, mig 0101) — trước khi xoá dòng
// vì 1 trường rỗng, phải tra trường KIA còn dữ liệu không (xoá nhầm mất field còn lại — anti-NULL: chỉ
// xoá dòng khi CẢ 2 đều rỗng).
// buoi_danh_gia mang các trường ĐỘC LẬP (nhan_xet + hoan_thanh_pct[legacy] + muc) — chỉ xoá dòng khi CẢ 3 rỗng.
// `muc_ma` đi KÈM `muc` (CHECK ở DB: có mã ⇒ có mức) nên kiểm `muc` là đủ, không cần kiểm riêng.
async function getDanhGiaRow(buoiId: string, hsId: string): Promise<{ nhan_xet: string | null; hoan_thanh_pct: number | null; muc: number | null } | null> {
  const { data, error } = await supabase.from('buoi_danh_gia').select('nhan_xet, hoan_thanh_pct, muc').match({ buoi_hoc_id: buoiId, hoc_sinh_id: hsId }).maybeSingle()
  if (error) throw error
  return data as any
}
export async function setNhanXet(buoiId: string, hsId: string, nhanXet: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const txt = nhanXet.trim()
  const cur = await getDanhGiaRow(buoiId, hsId)
  if (!txt && cur?.hoan_thanh_pct == null && cur?.muc == null) { // cả 3 rỗng → xoá dòng
    const { error } = await supabase.from('buoi_danh_gia').delete().match({ buoi_hoc_id: buoiId, hoc_sinh_id: hsId })
    if (error) throw error; return
  }
  const { error } = await supabase.from('buoi_danh_gia').upsert(
    { buoi_hoc_id: buoiId, hoc_sinh_id: hsId, nhan_xet: txt || null, graded_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'buoi_hoc_id,hoc_sinh_id' })
  if (error) throw error
}
// Mức chấm buổi — GV chọn 1 NHÃN (mã trong MUC_CATALOG); số mức suy từ nhãn, không nhập rời
// (2 chiều rời nhau là mở đường cho '4b' đi kèm muc=3). null = xoá lựa chọn (chưa chấm, ≠ mức 0).
export async function setMuc(buoiId: string, hsId: string, ma: string | null): Promise<void> {
  const it = mucItem(ma)
  if (ma != null && !it) throw new Error(`Mã mức không hợp lệ: ${ma}`)
  const { data: { user } } = await supabase.auth.getUser()
  const cur = await getDanhGiaRow(buoiId, hsId)
  if (!it && !cur?.nhan_xet?.trim() && cur?.hoan_thanh_pct == null) { // cả 3 rỗng → xoá dòng
    const { error } = await supabase.from('buoi_danh_gia').delete().match({ buoi_hoc_id: buoiId, hoc_sinh_id: hsId })
    if (error) throw error; return
  }
  const { error } = await supabase.from('buoi_danh_gia').upsert(
    { buoi_hoc_id: buoiId, hoc_sinh_id: hsId, muc: it?.muc ?? null, muc_ma: it?.ma ?? null, graded_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'buoi_hoc_id,hoc_sinh_id' })
  if (error) throw error
}

// ══════════════════════════════════════════════════════════════════════════
// BẢNG THÀNH TÍCH (showcase) — KHOE thành tích, per-môn. PURE-DERIVE.
// Gồm: Elo CAO NHẤT (peak từ history) · HẠNG hiện tại (vị trí leaderboard môn).
// Level + avatar: nguồn = "điểm tiến trình" RIÊNG (≠ EXP) — CHƯA define → UI để placeholder.
// EXP KHÔNG ở đây (EXP = lương tháng → xu, màn khác). Huy hiệu = theo mùa (seasonLabel), define sau.
// ⚠ "Hạng CAO NHẤT từng đạt" cần snapshot hạng theo thời gian (chưa có cơ chế) → giờ là hạng HIỆN TẠI.
// ══════════════════════════════════════════════════════════════════════════
export type ThanhTichMon = {
  mon: string
  elo: number; sessions: number        // Elo hiện tại
  eloPeak: number                       // Elo cao nhất từng đạt (từ history)
  rankNow: number; rankTotal: number    // hạng hiện tại trên leaderboard môn: #rankNow / rankTotal
  top1: { lop: number; et: number; mt: number } // số lần Top 1 theo loại đấu
  tongBuoi: number                      // tổng buổi thi đấu (có Elo: ingame/mt)
  chuoiDiHoc: number                    // chuỗi đi học liên tục (co_mat) gần nhất
}
export type ThanhTich = { season: string; seasonLabel: string; mons: ThanhTichMon[] }

// Hồ sơ thành tích 1 HS — dùng chung cho màn Thành tích lẫn tab trong Học sinh.
export async function getThanhTich(hocSinhId: string): Promise<ThanhTich> {
  const season = seasonOf(vnToday())
  const [eloR, histR, attR] = await Promise.all([
    supabase.from('gami_elo').select('mon, elo, sessions_played').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    supabase.from('gami_elo_history').select('mon, phase, rank, elo_before, elo_after, buoi_hoc_id').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    supabase.from('buoi_hoc_hs').select('diem_danh, buoi:buoi_hoc_id(ngay, lop:lop_id(mon))').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
  ])
  const eloRows = (eloR.data ?? []) as any[]
  const hist = (histR.data ?? []) as any[]
  const monSet = [...new Set(eloRows.map((e) => e.mon))]
  // Leaderboard mỗi môn (để tính hạng hiện tại) — lấy toàn bộ elo cùng môn.
  const { data: all } = monSet.length
    ? await supabase.from('gami_elo').select('mon, elo').in('mon', monSet).limit(LIMIT)
    : { data: [] as { mon: string; elo: number }[] }
  const lbByMon = new Map<string, number[]>()
  for (const r of (all ?? []) as any[]) { const a = lbByMon.get(r.mon) ?? []; a.push(Number(r.elo)); lbByMon.set(r.mon, a) }
  // Chuỗi đi học per môn: buổi của môn đó, sort ngày giảm dần, đếm co_mat liên tục từ gần nhất.
  const attByMon = new Map<string, { ngay: string; co: boolean }[]>()
  for (const a of (attR.data ?? []) as any[]) {
    const m = a.buoi?.lop?.mon; if (!m || !a.buoi?.ngay) continue
    const arr = attByMon.get(m) ?? []; arr.push({ ngay: a.buoi.ngay, co: a.diem_danh === 'co_mat' }); attByMon.set(m, arr)
  }
  const mons: ThanhTichMon[] = eloRows.map((e) => {
    const hm = hist.filter((h) => (h.mon ?? '') === e.mon)
    const eloPeak = Math.max(e.elo, ...hm.flatMap((h) => [h.elo_after, h.elo_before]).filter((x) => x != null))
    const lb = lbByMon.get(e.mon) ?? [e.elo]
    const top1 = (ph: string) => hm.filter((h) => h.phase === ph && h.rank === 1).length
    const buoiSet = new Set(hm.filter((h) => h.phase === 'ingame' || h.phase === 'mt').map((h) => h.buoi_hoc_id))
    const att = (attByMon.get(e.mon) ?? []).sort((a, b) => (a.ngay < b.ngay ? 1 : -1))
    let streak = 0; for (const a of att) { if (a.co) streak++; else break }
    return {
      mon: e.mon, elo: e.elo, sessions: e.sessions_played, eloPeak,
      rankNow: 1 + lb.filter((x) => x > e.elo).length, rankTotal: lb.length,
      top1: { lop: top1('ingame'), et: top1('et'), mt: top1('mt') }, tongBuoi: buoiSet.size, chuoiDiHoc: streak,
    }
  }).sort((a, b) => b.eloPeak - a.eloPeak)
  return { season, seasonLabel: seasonLabel(season), mons }
}

// ── BẢNG ELO + EXP tháng của cả roster (đầu buổi chiếu cho HS xem) — PURE-DERIVE, 2 query batch. ──
// ELO = mốc HIỆN TẠI (gami_elo, thiếu dòng → 1000). EXP tháng = Σ ledger tháng này (đúng bộ lọc
// getLevelXu: loại legacy rank_*/btvn, chỉ tính exp_thang/attend_floor của THÁNG hiện tại). Scope MÔN.
export type EloExpRow = { hoc_sinh_id: string; elo: number; expThang: number }
export async function getBangEloExp(hocSinhIds: string[], mon: string): Promise<EloExpRow[]> {
  const ids = [...new Set(hocSinhIds.filter(Boolean))]
  if (!ids.length) return []
  // Tháng VN hiện tại. `ym` = tháng EXP THUỘC VỀ (khoá đúng), monthStart chỉ để lọc attend_floor.
  // ⚠ EXP THÁNG phải key theo `note`=ym (recomputeExpThang ghi exp_thang note=ym), KHÔNG theo created_at:
  // recompute có thể chạy ở tháng khác (vd reset đầu mùa recompute tháng 7 ĐÚNG NGÀY 1/8) → dòng note='2026-07'
  // lại có created_at=1/8 sẽ lọt cửa sổ "tháng 8" nếu lọc bằng created_at. attend_floor (bù, không có note)
  // chỉ sinh 1 lần lúc đóng nên created_at ≈ đúng tháng buổi → lọc created_at cho nó là ổn.
  const v = new Date(Date.now() + 7 * 3600 * 1000)
  const ym = `${v.getUTCFullYear()}-${String(v.getUTCMonth() + 1).padStart(2, '0')}`
  const monthStart = new Date(Date.UTC(v.getUTCFullYear(), v.getUTCMonth(), 1, -7, 0, 0)).toISOString()
  // Lọc THÁNG ngay trên server (note=ym / attend_floor theo created_at) — ledger chi tiết cả mùa của 1 lớp
  // có thể >1000 dòng (cap PostgREST), còn 1 THÁNG 1 lớp thì luôn nhỏ → khỏi phân trang.
  const [eloR, expNoteR, expFloorR] = await Promise.all([
    supabase.from('gami_elo').select('hoc_sinh_id, elo').eq('mon', mon).in('hoc_sinh_id', ids).limit(LIMIT),
    supabase.from('gami_exp_ledger').select('hoc_sinh_id, amount')
      .eq('mon', mon).in('hoc_sinh_id', ids).in('source', EXP_NOTE_SOURCES).eq('note', ym).limit(LIMIT),
    supabase.from('gami_exp_ledger').select('hoc_sinh_id, amount')
      .eq('mon', mon).in('hoc_sinh_id', ids).eq('source', 'attend_floor').gte('created_at', monthStart).limit(LIMIT),
  ])
  const eloMap = new Map(((eloR.data ?? []) as any[]).map((e) => [e.hoc_sinh_id, Number(e.elo)]))
  const expMap = new Map<string, number>()
  for (const r of [...(expNoteR.data ?? []), ...(expFloorR.data ?? [])] as any[])
    expMap.set(r.hoc_sinh_id, (expMap.get(r.hoc_sinh_id) ?? 0) + Number(r.amount))
  return ids.map((id) => ({ hoc_sinh_id: id, elo: eloMap.get(id) ?? 1000, expThang: expMap.get(id) ?? 0 }))
}

// ── GHIM thành tích thi đấu khoe (ADR §6): HS tự chọn ≤4 loại; chưa ghim → UI dùng gợi ý. ──
// PK (hoc_sinh_id, mon, loai_key); thu_tu = thứ tự hiển thị.
export async function getThanhTichGhim(hocSinhId: string, mon: string): Promise<string[]> {
  const { data } = await supabase.from('hoc_sinh_thanh_tich_ghim')
    .select('loai_key, thu_tu').eq('hoc_sinh_id', hocSinhId).eq('mon', mon)
    .order('thu_tu', { ascending: true }).limit(100)
  return ((data ?? []) as any[]).map((r) => r.loai_key as string)
}
export async function setThanhTichGhim(hocSinhId: string, mon: string, keys: string[]): Promise<void> {
  await supabase.from('hoc_sinh_thanh_tich_ghim').delete().eq('hoc_sinh_id', hocSinhId).eq('mon', mon)
  const rows = keys.slice(0, 4).map((k, i) => ({ hoc_sinh_id: hocSinhId, mon, loai_key: k, thu_tu: i }))
  if (rows.length) { const { error } = await supabase.from('hoc_sinh_thanh_tich_ghim').insert(rows); if (error) throw error }
}

// Danh sách mọi HS (per môn) cho màn Thành tích — sắp Elo giảm dần, hạng = vị trí trong môn.
export type ThanhTichRow = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; anh_url: string | null; mon: string; elo: number; rankNow: number }
export async function listThanhTich(mon?: string): Promise<{ season: string; seasonLabel: string; rows: ThanhTichRow[] }> {
  const season = seasonOf(vnToday())
  let q = supabase.from('gami_elo').select('hoc_sinh_id, mon, elo, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs, khoi, anh_url)').order('elo', { ascending: false }).limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  const seen = new Map<string, number>() // hạng theo môn = thứ tự trong nhóm môn (đã order elo desc)
  const rows: ThanhTichRow[] = ((data ?? []) as any[]).map((e) => {
    const r = (seen.get(e.mon) ?? 0) + 1; seen.set(e.mon, r)
    return { hoc_sinh_id: e.hoc_sinh_id, ho_ten: e.hoc_sinh?.ho_ten ?? '?', ma_hs: e.hoc_sinh?.ma_hs ?? null, khoi: e.hoc_sinh?.khoi ?? null, anh_url: e.hoc_sinh?.anh_url ?? null, mon: e.mon, elo: e.elo, rankNow: r }
  })
  return { season, seasonLabel: seasonLabel(season), rows }
}
