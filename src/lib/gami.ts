// Data-layer GAMI (seam) — luồng buổi học chính: mở buổi → điểm danh → chấm → đóng phase.
// UI chỉ gọi qua đây. Engine thuần ở src/gami/*.js (đã test). Buổi pure-derive: đẻ dòng khi MỞ.
import { supabase } from './supabase'
import { getMyProfile } from './nhansu'
import { getETByBuoi, getETCaus, getBTVNByBuoi, getBTVNCaus, getGiaoTrinhBuoiDoc, khoCuaMon } from './tailieu'
import { getMTInstanceByBuoi, getMTPhanCaus, type MTPhanCaus } from './mt'
import { getBaiTestByDoc, getBaiTestCaus, type BaiTest, type BaiTestCau } from './testonline'
import type { CauHoi } from './kho/api'
import { computeEloUpdate } from '../gami/elo.js'
import { problemPoints, rankSession, etRankExp, monthlyBtvnExp } from '../gami/exp.js'
import { ATTEND_FLOOR_EXP } from '../gami/config.js'
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
export type Problem = { id: string; buoi_hoc_id: string; phase: Phase; problem_no: number; hidden: boolean; ma_dang: string | null; ma_cau?: string | null; hoc_sinh_id?: string | null }
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
  // GV chính của lớp (mặc định hiển thị khi nguoi_day trống — dạy thay mới ghi nguoi_day)
  const { data: pc } = await supabase.from('phan_cong_lop').select('nhan_su_id').eq('lop_id', (data as any).lop_id).eq('vai_tro', 'gv').eq('la_chinh', true).maybeSingle()
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
  const cur = await listProblems(buoiId, phase)
  // Đề rỗng/chưa tải được → KHÔNG đụng lưới. (Đừng để một lần load hỏng biến thành "xoá sạch ô chấm".)
  if (!caus.length) return luoiNguyen(cur)
  if (!cur.length) {
    if (daDong) return { ...luoiNguyen(cur), doiCauTruc: true }
    const rows = caus.map((c, i) => ({ buoi_hoc_id: buoiId, phase, problem_no: i + 1, ma_cau: c.ma_cau, ma_dang: c.dang_chinh ?? null }))
    // ignoreDuplicates: chống đẻ trùng khi effect chạy 2 lần (StrictMode) — unique (buoi,phase,problem_no).
    const { error } = await supabase.from('gami_session_problems').upsert(rows, { onConflict: 'buoi_hoc_id,phase,problem_no', ignoreDuplicates: true })
    if (error) throw error
    return luoiNguyen(await listProblems(buoiId, phase))
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

  // Câu mới → thêm ô (nối tiếp problem_no lớn nhất; problem_no chỉ là slot, thứ tự hiển thị lấy từ đề).
  let no = lam.length ? Math.max(...lam.map((p) => p.problem_no)) : 0
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
export const syncBTVNProblems = (buoiId: string, caus: CauHoi[], daDong?: boolean) => syncDocProblems(buoiId, 'btvn', caus, daDong)
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
export async function themCanhBao(p: { buoiId: string; hocSinhId: string; maDang: string; ghiChu?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('canh_bao_yeu').insert({ buoi_hoc_id: p.buoiId, hoc_sinh_id: p.hocSinhId, ma_dang: p.maDang, ghi_chu: p.ghiChu ?? null, nguon: 'btvn', created_by: user?.id ?? null })
  if (error) throw error
}
export async function xoaCanhBao(id: string): Promise<void> {
  const { error } = await supabase.from('canh_bao_yeu').delete().eq('id', id)
  if (error) throw error
}

// ════ EXP THÁNG (redesign 07-28, Thùy chốt) — EXP = CHĂM CHỈ, TÍNH LẠI theo (lớp × tháng) ════
// EXP mỗi buổi (ET rank) + phần THÁNG (BTVN: base/bài × thái độ + thưởng/phạt so lớp). Tháng = Σ buổi.
// Lưu 1 dòng ledger source='exp_thang', note=ym / (HS×môn×tháng). TỰ recompute khi buổi đổi (đóng/mở ET|BTVN).
// Nguồn chính = recompute (idempotent) → không còn ghi rank_*/btvn per-buổi. Bù/bổ trợ vẫn 'attend_floor' riêng.

// BTVN grades → độ-đúng per (hs×buổi). PHÂN TRANG: 1 lớp/tháng cũng có thể >1000 grades (PostgREST cap).
async function fetchBtvnAcc(buoiIds: string[]): Promise<Map<string, number[]>> {
  const accByHs = new Map<string, number[]>()
  if (!buoiIds.length) return accByHs
  const agg = new Map<string, { pts: number; n: number }>()
  const PAGE = 1000
  for (let fromR = 0; fromR < 200000; fromR += PAGE) {
    const { data, error } = await supabase.from('gami_grades')
      .select('hoc_sinh_id, points, prob:problem_id!inner(buoi_hoc_id, phase)')
      .eq('prob.phase', 'btvn').in('prob.buoi_hoc_id', buoiIds)
      .order('problem_id').order('hoc_sinh_id').range(fromR, fromR + PAGE - 1)
    if (error) throw error
    const rows = (data ?? []) as any[]
    for (const g of rows) { const bId = g.prob?.buoi_hoc_id; if (!bId) continue; const k = g.hoc_sinh_id + ':' + bId; const a = agg.get(k) ?? { pts: 0, n: 0 }; a.pts += Number(g.points); a.n += 1; agg.set(k, a) }
    if (rows.length < PAGE) break
  }
  for (const [k, v] of agg) { const hs = k.split(':')[0]; const acc = v.n ? v.pts / (v.n * 100) : 0; (accByHs.get(hs) ?? accByHs.set(hs, []).get(hs)!).push(acc) }
  return accByHs
}

// Tính lại EXP THÁNG cho 1 lớp (idempotent). Thay MỌI EXP của (lớp×tháng): xoá per-buổi cũ (ref_buoi trong
// tháng: rank_*/btvn) + exp_thang cũ → chèn exp_thang. KHÔNG đụng bù/bổ trợ (buổi loai≠'thuong', attend_floor).
export async function recomputeExpThang(lopId: string, ym: string): Promise<{ hs: number; tong: number }> {
  const { data: lopRow } = await supabase.from('lop').select('mon').eq('id', lopId).maybeSingle()
  const mon = (lopRow as any)?.mon ?? 'Toán'
  const [Y, M] = ym.split('-').map(Number)
  const from = `${ym}-01`, to = M === 12 ? `${Y + 1}-01-01` : `${Y}-${String(M + 1).padStart(2, '0')}-01`
  const { data: bs } = await supabase.from('buoi_hoc').select('id').eq('lop_id', lopId).eq('loai', 'thuong').neq('trang_thai', 'huy').gte('ngay', from).lt('ngay', to).limit(LIMIT)
  const buoiIds = ((bs ?? []) as any[]).map((b) => b.id)

  type Acc = { et: number; bais: { trangThai: string; thaiDo: string }[]; acc: number[] }
  const perHs = new Map<string, Acc>()
  const ensure = (id: string) => perHs.get(id) ?? perHs.set(id, { et: 0, bais: [], acc: [] }).get(id)!
  if (buoiIds.length) {
    const { data: eh } = await supabase.from('gami_elo_history').select('hoc_sinh_id, rank, rank_total').eq('phase', 'et').in('buoi_hoc_id', buoiIds).limit(LIMIT)
    for (const r of (eh ?? []) as any[]) if (r.rank != null && r.rank_total != null) ensure(r.hoc_sinh_id).et += etRankExp(r.rank, r.rank_total)
    const { data: kq } = await supabase.from('btvn_ket_qua').select('hoc_sinh_id, trang_thai_nop, thai_do').in('buoi_hoc_id', buoiIds).limit(LIMIT)
    for (const r of (kq ?? []) as any[]) ensure(r.hoc_sinh_id).bais.push({ trangThai: r.trang_thai_nop, thaiDo: r.thai_do })
    for (const [hs, arr] of await fetchBtvnAcc(buoiIds)) ensure(hs).acc = arr
  }
  const means = [...perHs.values()].map((p) => p.acc.length ? p.acc.reduce((s, x) => s + x, 0) / p.acc.length : null).filter((x): x is number => x != null)
  const classMean = means.length ? means.reduce((s, x) => s + x, 0) / means.length : null

  const rows = [] as { hoc_sinh_id: string; source: string; amount: number; mon: string; note: string }[]
  for (const [hs, p] of perHs) {
    const studentAcc = p.acc.length ? p.acc.reduce((s, x) => s + x, 0) / p.acc.length : null
    const total = p.et + monthlyBtvnExp(p.bais, studentAcc, classMean).total   // MT = 0 (diem_thi rỗng)
    if (total > 0) rows.push({ hoc_sinh_id: hs, source: 'exp_thang', amount: total, mon, note: ym })
  }
  if (buoiIds.length) await supabase.from('gami_exp_ledger').delete().in('ref_buoi_hoc_id', buoiIds)   // per-buổi cũ
  const hsList = [...perHs.keys()]
  if (hsList.length) await supabase.from('gami_exp_ledger').delete().eq('source', 'exp_thang').eq('mon', mon).eq('note', ym).in('hoc_sinh_id', hsList)
  if (rows.length) await supabase.from('gami_exp_ledger').insert(rows)
  return { hs: rows.length, tong: rows.reduce((s, r) => s + r.amount, 0) }
}

// Đóng BTVN: chỉ CHỐT trạng thái buổi → recompute EXP tháng (idempotent). KHÔNG Elo, KHÔNG gate hoàn-tất.
export async function closeBTVN(buoiId: string): Promise<{ already?: boolean; thuong: number }> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('btvn_dong_at, lop_id, ngay').eq('id', buoiId).single()
  if (error) throw error
  if ((b as any).btvn_dong_at) return { already: true, thuong: 0 }
  const claim = await supabase.from('buoi_hoc').update({ btvn_dong_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', buoiId).is('btvn_dong_at', null).select('id')
  if (claim.error) throw claim.error
  if (!claim.data?.length) return { already: true, thuong: 0 }
  const res = await recomputeExpThang((b as any).lop_id, String((b as any).ngay).slice(0, 7))
  return { thuong: res.hs }
}
export async function reopenBTVN(buoiId: string): Promise<void> {
  const { data: b } = await supabase.from('buoi_hoc').select('lop_id, ngay').eq('id', buoiId).maybeSingle()
  await supabase.from('buoi_hoc').update({ btvn_dong_at: null, updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (b && (b as any).lop_id) await recomputeExpThang((b as any).lop_id, String((b as any).ngay).slice(0, 7))
}

// ── BẢNG TÍNH ELO 1 phase (đọc lại từ history — kiểm tra/quản lý sau khi đóng) ──
// Hiện đủ: điểm thô · kỳ vọng E · thực tế A · Δ=K(A−E) · Elo trước→sau · +EXP. Sắp theo điểm thô (hạng).
export type EloBreakdown = { hoc_sinh_id: string; ho_ten: string; points: number; expected: number; actual: number; delta: number; eloBefore: number; eloAfter: number; exp: number; rank: number; coElo: boolean }
export async function getEloBreakdown(buoiId: string, phase: Phase): Promise<EloBreakdown[]> {
  const [{ data: hist }, { data: expRows }] = await Promise.all([
    supabase.from('gami_elo_history').select('hoc_sinh_id, expected, actual, delta, elo_before, elo_after').eq('buoi_hoc_id', buoiId).eq('phase', phase).limit(LIMIT),
    supabase.from('gami_exp_ledger').select('hoc_sinh_id, amount').eq('ref_buoi_hoc_id', buoiId).in('source', ['rank_' + phase, 'attend_floor']).limit(LIMIT),
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
  const { data: buoi, error: eB } = await supabase.from('buoi_hoc').select('*').eq('id', buoiId).single()
  if (eB) throw eB
  const b = buoi as BuoiHoc
  // MT giờ là 1 phase CỦA buổi thường (cùng mô hình ET — Thùy 07-08), cần cột đóng RIÊNG `mt_dong_at`
  // (KHÔNG dùng chung ingame_dong_at nữa — buổi thường có ingame THẬT, dùng chung sẽ đụng độ).
  const dongCol = phase === 'et' ? 'et_dong_at' : phase === 'mt' ? 'mt_dong_at' : 'ingame_dong_at'
  if ((b as any)[dongCol]) return { already: true }
  // ── KHÓA THỨ TỰ (ET): chỉ đóng ET khi MỌI buổi thường TRƯỚC (cùng lớp) đã đóng ET. ──
  // Elo mới có λ (kéo về mean) phụ thuộc TRẠNG THÁI → phải áp tuần tự theo ngày, cấm đóng nhảy cóc.
  if (phase === 'et' && b.loai === 'thuong') {
    const { data: earlier } = await supabase.from('buoi_hoc')
      .select('ngay').eq('lop_id', b.lop_id).eq('loai', 'thuong').neq('trang_thai', 'huy')
      .lt('ngay', b.ngay).is('et_dong_at', null).order('ngay', { ascending: true }).limit(1)
    if (earlier && earlier.length) throw new Error(`Chưa đóng ET buổi ${(earlier[0] as any).ngay}. Phải đóng ET các buổi theo đúng thứ tự ngày (Elo tính tuần tự).`)
  }
  // CLAIM cờ đóng NGAY + atomic (chỉ set được khi đang null) → chống đóng 2 lần (double-click/race tính Elo×2).
  const claim = await supabase.from('buoi_hoc').update({ [dongCol]: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', buoiId).is(dongCol, null).select('id')
  if (claim.error) throw claim.error
  if (!claim.data || !claim.data.length) return { already: true }
  const coRank = b.loai === 'thuong' || b.loai === 'mt'   // buổi có xếp hạng (ingame/et/mt) → EXP theo hạng
  // Elo TẠM chỉ tính ET. Ingame & MT đều CHƯA vào Elo:
  //  · ingame (chấm lớp): data chưa ổn định.
  //  · MT: cần ĐIỂM CHI TIẾT thang 10 riêng (chưa có) — điểm thô 0/50/100 theo bài không đủ mịn.
  //    Engine MT×4 (isMT) giữ nguyên; bật lại `|| phase === 'mt'` + nguồn điểm MT khi có luồng chấm thang 10.
  const coElo = coRank && phase === 'et'
  // Phase KIA đã đóng chưa? buổi thường = hoàn tất khi ingame + et + (mt NẾU buổi này có gán MT) đều đóng.
  // MT không auto-tồn-tại trên mọi buổi (khác ingame/et luôn có) → phải hỏi thật có gami_session_problems phase='mt' không.
  const hasMT = phase === 'mt' ? true : !!(await supabase.from('gami_session_problems').select('id', { count: 'exact', head: true }).eq('buoi_hoc_id', buoiId).eq('phase', 'mt')).count
  const otherClosed = phase === 'et' ? !!(b as any).ingame_dong_at && (!hasMT || !!(b as any).mt_dong_at)
    : phase === 'mt' ? !!(b as any).ingame_dong_at && !!(b as any).et_dong_at
    : !!(b as any).et_dong_at && (!hasMT || !!(b as any).mt_dong_at)
  // Elo/EXP TÁCH THEO MÔN của lớp (cùng buổi = cùng lớp = cùng môn).
  const { data: lopRow } = await supabase.from('lop').select('mon').eq('id', b.lop_id).maybeSingle()
  const mon = (lopRow as any)?.mon ?? 'Toán'

  // HS có mặt (R-ET: chấm = có mặt)
  const { data: rosterRows } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id, diem_danh').eq('buoi_hoc_id', buoiId).eq('diem_danh', 'co_mat').limit(LIMIT)
  const hsIds = (rosterRows ?? []).map((r: any) => r.hoc_sinh_id)
  if (!hsIds.length) { await markClosed(buoiId, dongCol, b.loai, otherClosed); return { reveal: [] } }

  // điểm thô = Σ điểm bài của phase
  const probs = await listProblems(buoiId, phase)
  const probIds = probs.map((p) => p.id)
  const grades = probIds.length ? (await supabase.from('gami_grades').select('hoc_sinh_id, problem_id, points').in('problem_id', probIds).limit(LIMIT)).data ?? [] : []
  const raw: Record<string, number> = {}
  for (const id of hsIds) raw[id] = 0
  for (const g of grades as any[]) if (g.hoc_sinh_id in raw) raw[g.hoc_sinh_id] += Number(g.points)

  // ⭐ BUG THẬT 07-21 (Thùy): KHÔNG CÓ DÒNG CHẤM NÀO ⇒ HUỶ LUÔN PHIÊN ELO, đừng tính.
  // Đời cũ khởi tạo raw[id]=0 cho mọi HS rồi cứ thế chạy → 0 dữ liệu bị hiểu thành "CẢ LỚP HOÀ".
  // Hoà thì actual đều nhau nhưng expected phụ thuộc Elo ⇒ HS Elo CAO mất điểm, HS Elo THẤP được
  // điểm: một buổi không ai chấm âm thầm kéo cả lớp về trung bình. Thực đo: 81/329 phiên trống,
  // 8955 điểm Elo biến động vô nghĩa, HS lệch tới ±245.
  // Đây đúng §1.5: "thiếu data = KHÔNG có dòng", KHÔNG phải "mọi người 0 điểm". Cùng khuôn với
  // nhánh !hsIds.length ở trên — vẫn ĐÓNG phase (vận hành xong), chỉ không sinh phép đo.
  // Áp cho MỌI phase có Elo (ingame/et/mt): cùng một bản chất, đừng để lệch nhau (§1.6 symmetry).
  if (coElo && grades.length === 0) { await markClosed(buoiId, dongCol, b.loai, otherClosed); return { reveal: [], khongCoDuLieu: true } }

  const reveal: RevealRow[] = []
  if (coRank) {
    // ── ELO: CHỈ ET + MT (ingame chưa tính — data chấm lớp chưa ổn định). eloOf rỗng khi ingame. ──
    const eloOf = new Map<string, any>()   // studentId → update (chỉ có khi coElo)
    let eloMap = new Map<string, any>()
    if (coElo) {
      // đảm bảo có dòng elo (mặc định 1000)
      const { data: eloRows } = await supabase.from('gami_elo').select('*').eq('mon', mon).in('hoc_sinh_id', hsIds).limit(LIMIT)
      eloMap = new Map((eloRows ?? []).map((e: any) => [e.hoc_sinh_id, e]))
      const missing = hsIds.filter((id) => !eloMap.has(id))
      if (missing.length) {
        const { data: created } = await supabase.from('gami_elo').insert(missing.map((id) => ({ hoc_sinh_id: id, mon }))).select()
        for (const e of (created ?? []) as any[]) eloMap.set(e.hoc_sinh_id, e)
      }
      // pre = elo hiện tại TRỪ delta của CHÍNH buổi này đã áp (phase Elo kia, nếu có). Model cộng-dồn.
      const { data: priorHist } = await supabase.from('gami_elo_history').select('hoc_sinh_id, delta').eq('buoi_hoc_id', buoiId).limit(LIMIT)
      const priorDelta = new Map<string, number>()
      for (const h of (priorHist ?? []) as any[]) priorDelta.set(h.hoc_sinh_id, (priorDelta.get(h.hoc_sinh_id) ?? 0) + h.delta)
      const students = hsIds.map((id) => ({ studentId: id, elo: eloMap.get(id).elo - (priorDelta.get(id) ?? 0), points: raw[id] }))
      // isMT=false: hiện chỉ ET vào Elo. Khi bật MT (có điểm thang 10) → truyền isMT=(phase==='mt').
      const updates = computeEloUpdate(students, { isMT: false, classSize: hsIds.length } as any)
      for (const u of updates) eloOf.set(u.studentId, u)
    }
    // ── HẠNG buổi (theo điểm thô, eloDelta là tie-break) — cho MỌI phase xếp hạng ──
    const ranks = rankSession(hsIds.map((id) => ({ studentId: id, rawPoints: raw[id], eloDelta: eloOf.get(id)?.delta ?? 0 })))
    const rankMap = new Map(ranks.map((r) => [r.studentId, r.rank]))
    const rankTotal = hsIds.length
    // ghi Elo (chỉ ET/MT): elo_before/after = mốc TRƯỚC BUỔI → +delta. gami_elo CỘNG DỒN delta.
    if (coElo) for (const [id, u] of eloOf) {
      await supabase.from('gami_elo_history').insert({ hoc_sinh_id: id, buoi_hoc_id: buoiId, phase, mon, elo_before: u.eloBefore, expected: u.expected, actual: u.actual, delta: u.delta, elo_after: u.eloAfter, rank: rankMap.get(id) ?? null, rank_total: rankTotal })
      await supabase.from('gami_elo').update({ elo: eloMap.get(id).elo + u.delta, updated_at: new Date().toISOString() }).eq('hoc_sinh_id', id).eq('mon', mon)
    }
    // EXP KHÔNG ghi per-buổi nữa (nguồn chính = recomputeExpThang cuối hàm). Reveal chỉ HIỂN THỊ đóng góp
    // buổi: ET = etRankExp(hạng) · ingame/mt = 0 (không vào EXP). EXP THÁNG thật được tính lại sau markClosed.
    for (const r of ranks) {
      const exp = phase === 'et' ? etRankExp(r.rank, hsIds.length) : 0
      const u: any = eloOf.get(r.studentId)
      reveal.push({ hoc_sinh_id: r.studentId, rawPoints: raw[r.studentId], rank: r.rank, exp, eloBefore: u?.eloBefore, eloAfter: u?.eloAfter, delta: u?.delta })
    }
  } else {
    // bù/bổ trợ: không Elo, EXP sàn (đi học là có) — GIỮ per-buổi, KHÔNG vào model tháng
    for (const id of hsIds) {
      await supabase.from('gami_exp_ledger').insert({ hoc_sinh_id: id, source: 'attend_floor', amount: ATTEND_FLOOR_EXP, ref_buoi_hoc_id: buoiId, mon })
      reveal.push({ hoc_sinh_id: id, rawPoints: raw[id], rank: 0, exp: ATTEND_FLOOR_EXP })
    }
  }
  await markClosed(buoiId, dongCol, b.loai, otherClosed)
  // TỰ cập nhật EXP tháng khi đóng ET buổi thường (ET là nguồn EXP; ingame/mt không đổi EXP).
  if (phase === 'et' && b.loai === 'thuong' && b.lop_id) { try { await recomputeExpThang(b.lop_id, String(b.ngay).slice(0, 7)) } catch (e) { console.error('recomputeExpThang lỗi sau đóng ET:', e) } }
  return { reveal }
}
async function markClosed(buoiId: string, dongCol: string, loai: string, otherClosed: boolean): Promise<void> {
  const patch: Record<string, unknown> = { [dongCol]: new Date().toISOString(), updated_at: new Date().toISOString() }
  // bù/mt = 1 phase → đóng là hoàn tất. buổi thường = hoàn tất khi CẢ ingame & et đã đóng (phase kia đã đóng từ trước).
  if (loai !== 'thuong' || otherClosed) patch.trang_thai = 'hoan_tat'
  await supabase.from('buoi_hoc').update(patch).eq('id', buoiId)
}

// ── ĐÁNH GIÁ SAU BUỔI (GV) ────────────────────────────────────────
// Dạng của buổi = các dạng đã gắn ở "Chấm bài trên lớp" (ingame). GV cho mỗi HS:
//   verdict per-dạng {0/0.5/1} (= phép đo summative, feed mastery) + nhận xét định tính + % hoàn thành
//   buổi (mig 0101, Thùy 07-16 — ước lượng thô để PH/GV định lượng nhanh, KHÔNG phải phép đo mastery).
export type DanhGiaDiem = 0 | 0.5 | 1
export type DanhGiaHS = { hoc_sinh_id: string; nhan_xet: string | null; hoanThanhPct: number | null; diemTheoDang: Record<string, DanhGiaDiem> }
// Mốc % hợp lệ cho "Mức độ hoàn thành buổi học" — cách nhau 5%, KHÔNG có 0 tận cùng lẻ (khớp CHECK constraint DB).
export const HOAN_THANH_PCT_OPTS = Array.from({ length: 21 }, (_, i) => 100 - i * 5)

// Dạng buổi này dạy (distinct ma_dang của bài ingame, bỏ null)
export async function dangCuaBuoi(buoiId: string): Promise<string[]> {
  const { data, error } = await supabase.from('gami_session_problems').select('ma_dang').eq('buoi_hoc_id', buoiId).eq('phase', 'ingame').limit(LIMIT)
  if (error) throw error
  return [...new Set((data ?? []).map((r: any) => r.ma_dang).filter(Boolean))] as string[]
}

export async function getDanhGia(buoiId: string): Promise<Record<string, DanhGiaHS>> {
  const [nx, dg] = await Promise.all([
    supabase.from('buoi_danh_gia').select('hoc_sinh_id, nhan_xet, hoan_thanh_pct').eq('buoi_hoc_id', buoiId).limit(LIMIT),
    supabase.from('buoi_danh_gia_dang').select('hoc_sinh_id, ma_dang, diem').eq('buoi_hoc_id', buoiId).limit(LIMIT),
  ])
  if (nx.error) throw nx.error
  if (dg.error) throw dg.error
  const out: Record<string, DanhGiaHS> = {}
  const ensure = (id: string) => (out[id] ??= { hoc_sinh_id: id, nhan_xet: null, hoanThanhPct: null, diemTheoDang: {} })
  for (const r of (nx.data ?? []) as any[]) { const e = ensure(r.hoc_sinh_id); e.nhan_xet = r.nhan_xet; e.hoanThanhPct = r.hoan_thanh_pct ?? null }
  for (const r of (dg.data ?? []) as any[]) ensure(r.hoc_sinh_id).diemTheoDang[r.ma_dang] = Number(r.diem) as DanhGiaDiem
  return out
}

// Mốc HOÀN THÀNH đánh giá sau buổi (task định tính — không có Elo/đóng phase). Bấm nút → set; mở lại → null.
export async function dongDanhGia(buoiId: string): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ danh_gia_xong_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', buoiId)
  if (error) throw error
}
export async function moLaiDanhGia(buoiId: string): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ danh_gia_xong_at: null, updated_at: new Date().toISOString() }).eq('id', buoiId)
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
export type TabKey = 'diemdanh' | 'danhgia' | 'ingame' | 'et' | 'btvn' | 'mt'
// deadline (Thùy chốt): chấm bài + đánh giá = 23h59 ngày buổi · ET = 12h trưa hôm sau · BTVN = 2h TRƯỚC ca học tiếp theo của lớp · MT = 23h59 ngày thi (giống chấm bài).
export type MyTask = { buoiId: string; lopId: string; lop: string; ngay: string; vai: 'gv' | 'tg'; tab: TabKey; label: string; done: boolean; doneAt: string | null; deadline: number | null; loai?: 'bu' | 'bo_tro_duoi' }
const TASKS_BY_VAI: Record<'gv' | 'tg', { tab: TabKey; label: string }[]> = {
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
  const out: MyTask[] = []
  for (const b of (buois ?? []) as any[]) {
    const doneAtTab: Record<TabKey, string | null> = { diemdanh: null, ingame: b.ingame_dong_at, danhgia: b.danh_gia_xong_at, et: b.et_dong_at, btvn: b.btvn_dong_at, mt: b.mt_dong_at }
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
        out.push({ buoiId: b.id, lopId: b.lop_id, lop: b.lop?.ten_lop ?? '?', ngay: b.ngay, vai, tab: t.tab, label: t.label, done: !!doneAtTab[t.tab], doneAt: doneAtTab[t.tab], deadline: deadlineOf(t.tab) })
      }
      // MT — CHỈ khi buổi này thật sự có gán MT (mtKeys). TG chấm (giống ET); GV không có task riêng.
      if (vai === 'tg' && mtKeys.has(`${b.lop_id}|${b.ngay}`) && !seen.has('mt')) {
        seen.add('mt')
        out.push({ buoiId: b.id, lopId: b.lop_id, lop: b.lop?.ten_lop ?? '?', ngay: b.ngay, vai: 'tg', tab: 'mt', label: 'Chấm MT', done: !!b.mt_dong_at, doneAt: b.mt_dong_at, deadline: deadlineOf('mt') })
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
    const doneAtTab: Record<TabKey, string | null> = { diemdanh: null, ingame: b.ingame_dong_at, danhgia: b.danh_gia_xong_at, et: b.et_dong_at, btvn: b.btvn_dong_at, mt: b.mt_dong_at }
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
  const that = ((rows ?? []) as BuoiHoc[]).map((b) => {
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
  // Mới/sắp tới trước, cùng ngày thì theo giờ. Ngày dạng 'YYYY-MM-DD' nên so chuỗi = so thời gian.
  return [...ao, ...that].sort((a, b) => b.ngay.localeCompare(a.ngay) || (a.slot.gio_bat_dau ?? '').localeCompare(b.slot.gio_bat_dau ?? ''))
}

// MỞ LẠI 1 phase đã đóng để SỬA (vd TA sửa điểm ET): rollback Elo/EXP của phase đó rồi gỡ cờ đóng + về 'mo'.
// Idempotent với đóng lại: xoá elo_history + exp_ledger của phase, hoàn elo về elo_before, trừ session nếu phase tính session.
export async function reopenPhase(buoiId: string, phase: Phase): Promise<void> {
  const dongCol = phase === 'et' ? 'et_dong_at' : phase === 'mt' ? 'mt_dong_at' : 'ingame_dong_at'
  const { data: hist } = await supabase.from('gami_elo_history').select('*').eq('buoi_hoc_id', buoiId).eq('phase', phase).limit(LIMIT)
  const incSession = phase !== 'et'
  for (const h of (hist ?? []) as any[]) {
    const mon = h.mon ?? 'Toán'
    // model cộng-dồn: gỡ phase = TRỪ delta khỏi elo hiện tại (KHÔNG revert về elo_before — sẽ xoá delta phase kia).
    const { data: e } = await supabase.from('gami_elo').select('elo, sessions_played').eq('hoc_sinh_id', h.hoc_sinh_id).eq('mon', mon).maybeSingle()
    if (!e) continue
    await supabase.from('gami_elo').update({ elo: (e as any).elo - h.delta, sessions_played: Math.max(0, ((e as any).sessions_played ?? 0) - (incSession ? 1 : 0)), updated_at: new Date().toISOString() }).eq('hoc_sinh_id', h.hoc_sinh_id).eq('mon', mon)
  }
  await supabase.from('gami_elo_history').delete().eq('buoi_hoc_id', buoiId).eq('phase', phase)
  await supabase.from('gami_exp_ledger').delete().eq('ref_buoi_hoc_id', buoiId).in('source', ['rank_' + phase, 'attend_floor'])
  await supabase.from('buoi_hoc').update({ [dongCol]: null, trang_thai: 'mo', updated_at: new Date().toISOString() }).eq('id', buoiId)
  // Mở lại ET buổi thường → EXP tháng đổi → tự tính lại.
  if (phase === 'et') { const { data: b } = await supabase.from('buoi_hoc').select('lop_id, ngay, loai').eq('id', buoiId).maybeSingle(); if (b && (b as any).loai === 'thuong' && (b as any).lop_id) try { await recomputeExpThang((b as any).lop_id, String((b as any).ngay).slice(0, 7)) } catch (e) { console.error('recomputeExpThang lỗi sau mở ET:', e) } }
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
  // EXP = MÙA HIỆN TẠI (reset mỗi mùa) — window created_at ≥ đầu mùa (cũng đưa số dòng <1000, tránh cap
  // PostgREST vốn âm thầm cắt EXP all-time). LOẠI nguồn legacy `rank_*`/`btvn` (mô hình cũ đang bị thay bằng
  // `exp_thang`; buổi mùa-nay đã sạch legacy — chỉ còn legacy mùa CŨ đóng-muộn lọt window created_at).
  const muaStart = seasonStartUtc(seasonOf(new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)))
  const { data: exp } = await supabase.from('gami_exp_ledger').select('hoc_sinh_id, mon, amount')
    .gte('created_at', muaStart).not('source', 'in', '(rank_et,rank_ingame,rank_mt,btvn)').limit(LIMIT)
  const expMap = new Map<string, number>()
  for (const r of (exp ?? []) as any[]) { const k = r.hoc_sinh_id + '|' + (r.mon ?? ''); expMap.set(k, (expMap.get(k) ?? 0) + Number(r.amount)) }
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
  const [eloR, histR, expR] = await Promise.all([
    supabase.from('gami_elo').select('mon, elo, sessions_played').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    supabase.from('gami_elo_history').select('buoi_hoc_id, phase, mon, elo_before, delta, elo_after, created_at, buoi:buoi_hoc_id(ngay, lop:lop_id(ten_lop))').eq('hoc_sinh_id', hocSinhId).order('created_at', { ascending: false }).limit(LIMIT),
    supabase.from('gami_exp_ledger').select('source, amount, mon, created_at, buoi:ref_buoi_hoc_id(ngay, lop:lop_id(ten_lop))').eq('hoc_sinh_id', hocSinhId).order('created_at', { ascending: false }).limit(LIMIT),
  ])
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
async function getDanhGiaRow(buoiId: string, hsId: string): Promise<{ nhan_xet: string | null; hoan_thanh_pct: number | null } | null> {
  const { data, error } = await supabase.from('buoi_danh_gia').select('nhan_xet, hoan_thanh_pct').match({ buoi_hoc_id: buoiId, hoc_sinh_id: hsId }).maybeSingle()
  if (error) throw error
  return data as any
}
export async function setNhanXet(buoiId: string, hsId: string, nhanXet: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const txt = nhanXet.trim()
  const cur = await getDanhGiaRow(buoiId, hsId)
  if (!txt && cur?.hoan_thanh_pct == null) { // cả 2 đều rỗng → xoá dòng (không giữ dòng trống)
    const { error } = await supabase.from('buoi_danh_gia').delete().match({ buoi_hoc_id: buoiId, hoc_sinh_id: hsId })
    if (error) throw error; return
  }
  const { error } = await supabase.from('buoi_danh_gia').upsert(
    { buoi_hoc_id: buoiId, hoc_sinh_id: hsId, nhan_xet: txt || null, graded_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'buoi_hoc_id,hoc_sinh_id' })
  if (error) throw error
}
// Mức độ hoàn thành buổi học (0-100, mốc 5%) — null = xoá lựa chọn (chưa ước lượng, không phải 0%).
export async function setHoanThanhPct(buoiId: string, hsId: string, pct: number | null): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const cur = await getDanhGiaRow(buoiId, hsId)
  if (pct == null && !cur?.nhan_xet?.trim()) { // cả 2 đều rỗng → xoá dòng
    const { error } = await supabase.from('buoi_danh_gia').delete().match({ buoi_hoc_id: buoiId, hoc_sinh_id: hsId })
    if (error) throw error; return
  }
  const { error } = await supabase.from('buoi_danh_gia').upsert(
    { buoi_hoc_id: buoiId, hoc_sinh_id: hsId, hoan_thanh_pct: pct, graded_by: user?.id ?? null, updated_at: new Date().toISOString() },
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
