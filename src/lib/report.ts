// Report tháng cho PHỤ HUYNH — data-layer. Số liệu SUY ĐỘNG (bảng theo buổi ET/BTVN); nhận xét GV lưu ở bao_cao_ph.
// Phần "tổng quan" (hoàn thành cơ bản/nâng cao, ET/BTVN/MT %) tái dùng getTongQuanHS (mastery.ts) — không lặp ở đây.
// Gọi KÈM opts.ym (08-17) để tổng quan chỉ tính trên đúng tháng report đang xem, khớp bảng buổi bên dưới.
import { supabase } from './supabase'

const LIMIT = 10000

// % ET/BTVN của MỘT buổi từ tổng điểm(points)/số câu đã chấm(n). Nguồn chân lý cho mọi màn hiển thị %
// theo buổi (Report PH, Trước buổi…) — đừng viết lại công thức này ở nơi khác.
export function pctFromAgg(pts: number, n: number): number | null {
  return n ? Math.min(100, Math.round((pts / (n * 100)) * 100)) : null
}

// 1 dòng bảng theo buổi (1 HS × môn × tháng). vang → cột ET ghi "Vắng" (ET bản chất = điểm danh).
export type ReportBuoiRow = {
  buoiId: string; ngay: string; maBuoi: string | null
  vang: boolean
  etPct: number | null           // % ET (null nếu chưa chấm / không có)
  btvnPct: number | null         // % BTVN
  btvnTrangThai: string | null   // nop_dung_han | nop_muon | xin_phep | khong_lam
  btvnThaiDo: string | null      // nghiem_tuc | chua_het_suc | chua_nghiem_tuc | chong_doi
}

export async function getReportBuoiHS(hocSinhId: string, mon: string, ym: string): Promise<ReportBuoiRow[]> {
  const [Y, M] = ym.split('-').map(Number)
  const from = `${ym}-01`, to = M === 12 ? `${Y + 1}-01-01` : `${Y}-${String(M + 1).padStart(2, '0')}-01`
  // Buổi HS tham gia trong tháng (embed buoi + lớp để lọc môn/loại/ngày ở client — 1 HS nên nhỏ).
  const { data: bhs } = await supabase.from('buoi_hoc_hs')
    .select('diem_danh, buoi:buoi_hoc_id(id, ngay, ma_buoi, loai, trang_thai, lop:lop_id(mon))')
    .eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  const buois = ((bhs ?? []) as any[])
    .filter((r) => r.buoi && r.buoi.loai === 'thuong' && r.buoi.trang_thai !== 'huy' && r.buoi.lop?.mon === mon && r.buoi.ngay >= from && r.buoi.ngay < to)
    .map((r) => ({ id: r.buoi.id as string, ngay: r.buoi.ngay as string, ma_buoi: r.buoi.ma_buoi as string | null, diem_danh: r.diem_danh as string | null }))
    .sort((a, b) => a.ngay.localeCompare(b.ngay))
  const ids = buois.map((b) => b.id)
  if (!ids.length) return []

  // Điểm ET + BTVN của HS theo buổi (embed !inner theo phase/buổi — không IN problem_id dài).
  const etAgg = new Map<string, { pts: number; n: number }>()
  const btAgg = new Map<string, { pts: number; n: number }>()
  const { data: gs } = await supabase.from('gami_grades')
    .select('points, prob:problem_id!inner(buoi_hoc_id, phase)')
    .eq('hoc_sinh_id', hocSinhId).in('prob.buoi_hoc_id', ids).in('prob.phase', ['et', 'btvn']).limit(LIMIT)
  for (const g of (gs ?? []) as any[]) {
    const b = g.prob?.buoi_hoc_id as string | undefined; const ph = g.prob?.phase as string | undefined
    if (!b) continue
    const m = ph === 'et' ? etAgg : ph === 'btvn' ? btAgg : null; if (!m) continue
    const a = m.get(b) ?? { pts: 0, n: 0 }; a.pts += Number(g.points); a.n += 1; m.set(b, a)
  }
  // Trạng thái nộp + thái độ BTVN
  const kqMap = new Map<string, { tt: string | null; td: string | null }>()
  const { data: kq } = await supabase.from('btvn_ket_qua').select('buoi_hoc_id, trang_thai_nop, thai_do').eq('hoc_sinh_id', hocSinhId).in('buoi_hoc_id', ids).limit(LIMIT)
  for (const r of (kq ?? []) as any[]) kqMap.set(r.buoi_hoc_id, { tt: r.trang_thai_nop, td: r.thai_do })

  const pct = (m: Map<string, { pts: number; n: number }>, id: string) => { const a = m.get(id); return pctFromAgg(a?.pts ?? 0, a?.n ?? 0) }
  return buois.map((b) => ({
    buoiId: b.id, ngay: b.ngay, maBuoi: b.ma_buoi,
    vang: b.diem_danh === 'vang' || b.diem_danh === 'vang_phep',
    etPct: pct(etAgg, b.id),
    btvnPct: pct(btAgg, b.id),
    btvnTrangThai: kqMap.get(b.id)?.tt ?? null,
    btvnThaiDo: kqMap.get(b.id)?.td ?? null,
  }))
}

// ── Nhận xét GV cho (HS × môn × tháng) ──
// muc_kien_thuc / muc_thai_do = thang 5 (GV tự chọn 1..5, không suy động).
// nl_* = năng lực (band GV chọn + điểm + sai số); cs_* = 7 chỉ số phát triển mức 1..5.
export type BaoCaoPH = {
  thai_do: string | null; kien_thuc_ky_nang: string | null; ket_luan: string | null; ket_luan_muc: string | null; muc_tieu: string | null; muc_kien_thuc: number | null; muc_thai_do: number | null
  nl_band: string | null; nl_diem: number | null; nl_sai_so: number | null
  cs_thai_do: number | null; cs_tap_trung: number | null; cs_tiep_thu: number | null; cs_tu_duy: number | null; cs_ky_nang: number | null; cs_van_dung: number | null; cs_vuot_kho: number | null
  cong_bo_at: string | null // NULL = nháp (PH không thấy); NOT NULL = đã chốt & công bố
  anh_bao_cao_url: string | null // URL ảnh snapshot chụp lúc chốt (app hiện ở Hồ sơ học tập)
}
export const BC_EMPTY: BaoCaoPH = {
  thai_do: null, kien_thuc_ky_nang: null, ket_luan: null, ket_luan_muc: null, muc_tieu: null, muc_kien_thuc: null, muc_thai_do: null,
  nl_band: null, nl_diem: null, nl_sai_so: null,
  cs_thai_do: null, cs_tap_trung: null, cs_tiep_thu: null, cs_tu_duy: null, cs_ky_nang: null, cs_van_dung: null, cs_vuot_kho: null,
  cong_bo_at: null, anh_bao_cao_url: null,
}
const BC_COLS = 'thai_do, kien_thuc_ky_nang, ket_luan, ket_luan_muc, muc_tieu, muc_kien_thuc, muc_thai_do, nl_band, nl_diem, nl_sai_so, cs_thai_do, cs_tap_trung, cs_tiep_thu, cs_tu_duy, cs_ky_nang, cs_van_dung, cs_vuot_kho, cong_bo_at, anh_bao_cao_url'
export async function getBaoCaoPH(hocSinhId: string, mon: string, thang: string): Promise<BaoCaoPH> {
  const { data, error } = await supabase.from('bao_cao_ph').select(BC_COLS)
    .eq('hoc_sinh_id', hocSinhId).eq('mon', mon).eq('thang', thang).maybeSingle()
  if (error) throw error
  return (data as BaoCaoPH) ?? { ...BC_EMPTY }
}

// GV chủ nhiệm (GV chính) của lớp — cho dòng "GV: …" trên report.
export async function getGVChinhLop(lopId: string): Promise<string | null> {
  const { data } = await supabase.from('phan_cong_lop')
    .select('nhan_su:nhan_su_id(ho_ten)').eq('lop_id', lopId).eq('vai_tro', 'gv').eq('la_chinh', true).maybeSingle()
  return (data as any)?.nhan_su?.ho_ten ?? null
}
export async function upsertBaoCaoPH(hocSinhId: string, mon: string, thang: string, patch: Partial<BaoCaoPH>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('bao_cao_ph').upsert(
    { hoc_sinh_id: hocSinhId, mon, thang, ...patch, updated_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'hoc_sinh_id,mon,thang' })
  if (error) throw error
}

// Hạng theo ĐIỂM MT TỔNG của đúng tháng report (Thùy 08-19, thay bản Elo trước đó — Elo là thi đấu tích
// luỹ cả mùa, không phải "của tháng này"). Dùng chung cho cả 2 phạm vi KHỐI và LỚP (Thùy 08-19: thêm
// hạng-trong-lớp bên cạnh hạng-trong-khối) — logic tính hạng giống hệt, chỉ khác ROSTER (ai là peer).
// Cửa sổ ngày = 25/tháng→10/tháng sau, ĐÚNG logic getTongQuanHS (MT hay tổ chức cuối/đầu tháng), đọc qua
// buoi_hoc.ngay vì ky_thi.ngay thực tế luôn NULL cho MT (xem comment ở mastery.ts).
// ⚠ NGOẠI LỆ CÓ CHỦ ĐÍCH so §5 CLAUDE.md ("chưa-đo ≠ 0"): Thùy 08-19 chốt RIÊNG cho bảng xếp hạng này —
// HS đang học mà CHƯA có điểm MT trong cửa sổ → tính 0đ để rank đủ TOÀN BỘ roster (không loại khỏi mẫu
// số như mastery bình thường). Chỉ áp cho xếp hạng — không áp cho ô "Điểm MT" hiển thị (vẫn "—").
function mtWindow(ym: string): { from: string; to: string } {
  const [Y, M] = ym.split('-').map(Number)
  const nextY = M === 12 ? Y + 1 : Y, nextM = M === 12 ? 1 : M + 1
  return { from: `${ym}-25`, to: `${nextY}-${String(nextM).padStart(2, '0')}-11` } // < ngày 11 = qua hết mùng 10
}
// ⚠ CHỐT (Thùy 08-21, sau 2 lần sửa hụt với Trần Thị Vân Khánh & Phan Bảo Nhi): điểm MT là CỦA EM, ĐI
// THEO EM — thi ở lớp nào không quan trọng, đề chung nên điểm nào cũng dùng được. Cái ĐỔI theo phạm vi
// (lớp/hệ/khối) chỉ là ROSTER — ai được đem ra so sánh — KHÔNG PHẢI cách tính điểm của từng em. Vậy: điểm
// của 1 HS = TRUNG BÌNH mọi diem_thi (mt_sat_hach, đúng môn, đúng cửa sổ tháng) của CHÍNH em, bất kể kỳ
// thi đó tổ chức ở lớp/hệ nào. (2 bản sửa trước đều SAI vì cố khớp lớp/hệ của kỳ thi với lớp/hệ hiện tại
// của em — đúng hướng "chống lẫn điểm" nhưng SAI chỗ áp dụng: đúng ra không cần khớp gì cả.)
// §2.0 (30/08): xếp hạng tính ở DB — fn_rank_diem_mt (roster + avg cửa sổ + rank trong 1 câu
// SQL; parity 14/14 với thuật toán JS trên lớp 9A1). Client chỉ resolve DANH SÁCH LỚP theo
// phạm vi (lớp/hệ/khối) rồi gọi fn. Luật giữ nguyên: điểm của em đi theo em; chưa điểm = 0đ
// (ngoại lệ 08-19 riêng bảng xếp hạng).
async function rankByDiemMT(hocSinhId: string, lopIds: string[], mon: string, ym: string): Promise<{ rankNow: number; rankTotal: number } | null> {
  if (!lopIds.length) return null
  const { data, error } = await supabase.rpc('fn_rank_diem_mt', { p_hs: hocSinhId, p_lop_ids: lopIds, p_mon: mon, p_ym: ym })
  if (error) throw error
  const r = ((data ?? []) as any[])[0]
  return r ? { rankNow: Number(r.rank_now), rankTotal: Number(r.rank_total) } : null
}

export type KhoiRankMT = { rankNow: number; rankTotal: number; khoi: string }
export async function getKhoiRankDiemMT(hocSinhId: string, mon: string, ym: string): Promise<KhoiRankMT | null> {
  const { data: hs } = await supabase.from('hoc_sinh').select('khoi').eq('id', hocSinhId).maybeSingle()
  const khoi = (hs as any)?.khoi as string | null
  if (!khoi) return null
  const { data: lops } = await supabase.from('lop').select('id').eq('mon', mon).eq('khoi', khoi).limit(LIMIT)
  const r = await rankByDiemMT(hocSinhId, ((lops ?? []) as any[]).map((l) => l.id as string), mon, ym)
  return r ? { ...r, khoi } : null
}

export type LopRankMT = { rankNow: number; rankTotal: number }
export async function getLopRankDiemMT(hocSinhId: string, lopId: string, mon: string, ym: string): Promise<LopRankMT | null> {
  return rankByDiemMT(hocSinhId, [lopId], mon, ym)
}

// Hạng TRONG HỆ (lop.bac — band S/A/B/C… GV chọn khi xếp lớp, vd "lớp 7A1" → hệ "A") — 3 hạng lớp/hệ/khối
// là 3 phạm vi LỒNG NHAU tăng dần (lớp ⊂ hệ ⊂ khối) — chỉ khác ROSTER, cách tính điểm từng em GIỐNG HỆT.
export type HeRankMT = { rankNow: number; rankTotal: number; he: string; khoi: string }
export async function getHeRankDiemMT(hocSinhId: string, mon: string, ym: string): Promise<HeRankMT | null> {
  const { data: lopHS } = await supabase.from('hoc_sinh_lop')
    .select('lop:lop_id!inner(khoi, bac, mon)').eq('hoc_sinh_id', hocSinhId).eq('trang_thai', 'dang_hoc').eq('lop.mon', mon).maybeSingle()
  const khoi = (lopHS as any)?.lop?.khoi as string | null
  const he = (lopHS as any)?.lop?.bac as string | null
  if (!khoi || !he) return null
  const { data: lops } = await supabase.from('lop').select('id').eq('mon', mon).eq('khoi', khoi).eq('bac', he).limit(LIMIT)
  const r = await rankByDiemMT(hocSinhId, ((lops ?? []) as any[]).map((l) => l.id as string), mon, ym)
  return r ? { ...r, he, khoi } : null
}
