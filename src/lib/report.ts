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
}
export const BC_EMPTY: BaoCaoPH = {
  thai_do: null, kien_thuc_ky_nang: null, ket_luan: null, ket_luan_muc: null, muc_tieu: null, muc_kien_thuc: null, muc_thai_do: null,
  nl_band: null, nl_diem: null, nl_sai_so: null,
  cs_thai_do: null, cs_tap_trung: null, cs_tiep_thu: null, cs_tu_duy: null, cs_ky_nang: null, cs_van_dung: null, cs_vuot_kho: null,
  cong_bo_at: null,
}
const BC_COLS = 'thai_do, kien_thuc_ky_nang, ket_luan, ket_luan_muc, muc_tieu, muc_kien_thuc, muc_thai_do, nl_band, nl_diem, nl_sai_so, cs_thai_do, cs_tap_trung, cs_tiep_thu, cs_tu_duy, cs_ky_nang, cs_van_dung, cs_vuot_kho, cong_bo_at'
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
async function rankByDiemMT(hocSinhId: string, rosterIds: string[], ktIds: string[]): Promise<{ rankNow: number; rankTotal: number } | null> {
  if (!rosterIds.includes(hocSinhId)) return null // HS không thuộc roster (đã rời lớp/môn…) → không có peer để xếp
  const sums = new Map<string, { sum: number; n: number }>()
  if (ktIds.length) {
    const { data: dt } = await supabase.from('diem_thi').select('hoc_sinh_id, diem').in('ky_thi_id', ktIds).limit(LIMIT)
    for (const r of (dt ?? []) as any[]) {
      if (r.diem == null) continue
      const a = sums.get(r.hoc_sinh_id) ?? { sum: 0, n: 0 }; a.sum += Number(r.diem); a.n++; sums.set(r.hoc_sinh_id, a)
    }
  }
  const scoreOf = (id: string) => { const s = sums.get(id); return s ? s.sum / s.n : 0 } // chưa có điểm → 0
  const myAvg = scoreOf(hocSinhId)
  const allAvg = rosterIds.map(scoreOf)
  return { rankNow: 1 + allAvg.filter((x) => x > myAvg).length, rankTotal: allAvg.length }
}

export type KhoiRankMT = { rankNow: number; rankTotal: number; khoi: string }
export async function getKhoiRankDiemMT(hocSinhId: string, mon: string, ym: string): Promise<KhoiRankMT | null> {
  const { data: hs } = await supabase.from('hoc_sinh').select('khoi').eq('id', hocSinhId).maybeSingle()
  const khoi = (hs as any)?.khoi as string | null
  if (!khoi) return null
  // Roster = TOÀN BỘ HS đang học ĐÚNG môn+khối này (kể cả chưa có điểm MT) — mẫu số của bảng xếp hạng.
  const { data: gd } = await supabase.from('hoc_sinh_lop')
    .select('hoc_sinh_id, lop:lop_id!inner(mon, khoi)').eq('trang_thai', 'dang_hoc').eq('lop.mon', mon).eq('lop.khoi', khoi).limit(LIMIT)
  const rosterIds = [...new Set(((gd ?? []) as any[]).map((r) => r.hoc_sinh_id as string))]
  const { from, to } = mtWindow(ym)
  const { data: kts } = await supabase.from('ky_thi').select('id, buoi:buoi_hoc_id(ngay)')
    .eq('loai', 'mt_sat_hach').eq('mon', mon).eq('khoi', khoi).limit(LIMIT)
  const ktIds = ((kts ?? []) as any[]).filter((k) => { const d = k.buoi?.ngay; return d && d >= from && d < to }).map((k) => k.id)
  const r = await rankByDiemMT(hocSinhId, rosterIds, ktIds)
  return r ? { ...r, khoi } : null
}

export type LopRankMT = { rankNow: number; rankTotal: number }
export async function getLopRankDiemMT(hocSinhId: string, lopId: string, mon: string, ym: string): Promise<LopRankMT | null> {
  // Roster = TOÀN BỘ HS đang học ĐÚNG lớp này (kể cả chưa có điểm MT) — mẫu số của bảng xếp hạng.
  const { data: gd } = await supabase.from('hoc_sinh_lop').select('hoc_sinh_id').eq('lop_id', lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  const rosterIds = [...new Set(((gd ?? []) as any[]).map((r) => r.hoc_sinh_id as string))]
  const { from, to } = mtWindow(ym)
  // ky_thi KHÔNG có lop_id trực tiếp — mỗi lớp 1 kỳ MT/đợt, tìm qua buoi_hoc_id!inner (bắt buộc để lọc
  // được embed lồng, xem CLAUDE.md §2 "PostgREST không filter được quan hệ lồng" — !inner mở khoá filter).
  const { data: kts } = await supabase.from('ky_thi').select('id, buoi:buoi_hoc_id!inner(ngay, lop_id)')
    .eq('loai', 'mt_sat_hach').eq('mon', mon).eq('buoi.lop_id', lopId).limit(LIMIT)
  const ktIds = ((kts ?? []) as any[]).filter((k) => { const d = k.buoi?.ngay; return d && d >= from && d < to }).map((k) => k.id)
  return rankByDiemMT(hocSinhId, rosterIds, ktIds)
}

// Hạng TRONG HỆ (lop.bac — band S/A/B/C… GV chọn khi xếp lớp, vd "lớp 7A1" → hệ "A") — Thùy 08-19: 3 hạng
// lớp/hệ/khối là 3 phạm vi LỒNG NHAU tăng dần (lớp ⊂ hệ ⊂ khối), NHƯNG hệ vẫn giới hạn trong ĐÚNG khối
// (đề MT khác nhau theo khối — không thể so điểm hệ A khối 7 với hệ A khối 9, khác đề).
export type HeRankMT = { rankNow: number; rankTotal: number; he: string; khoi: string }
export async function getHeRankDiemMT(hocSinhId: string, mon: string, ym: string): Promise<HeRankMT | null> {
  const { data: lopHS } = await supabase.from('hoc_sinh_lop')
    .select('lop:lop_id!inner(khoi, bac, mon)').eq('hoc_sinh_id', hocSinhId).eq('trang_thai', 'dang_hoc').eq('lop.mon', mon).maybeSingle()
  const khoi = (lopHS as any)?.lop?.khoi as string | null
  const he = (lopHS as any)?.lop?.bac as string | null
  if (!khoi || !he) return null
  // Roster = TOÀN BỘ HS đang học ĐÚNG môn+khối+hệ này (kể cả chưa có điểm MT).
  const { data: gd } = await supabase.from('hoc_sinh_lop')
    .select('hoc_sinh_id, lop:lop_id!inner(mon, khoi, bac)').eq('trang_thai', 'dang_hoc').eq('lop.mon', mon).eq('lop.khoi', khoi).eq('lop.bac', he).limit(LIMIT)
  const rosterIds = [...new Set(((gd ?? []) as any[]).map((r) => r.hoc_sinh_id as string))]
  const { from, to } = mtWindow(ym)
  const { data: kts } = await supabase.from('ky_thi').select('id, buoi:buoi_hoc_id(ngay)')
    .eq('loai', 'mt_sat_hach').eq('mon', mon).eq('khoi', khoi).limit(LIMIT)
  const ktIds = ((kts ?? []) as any[]).filter((k) => { const d = k.buoi?.ngay; return d && d >= from && d < to }).map((k) => k.id)
  const r = await rankByDiemMT(hocSinhId, rosterIds, ktIds)
  return r ? { ...r, he, khoi } : null
}
