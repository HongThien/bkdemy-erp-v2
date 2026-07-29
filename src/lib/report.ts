// Report tháng cho PHỤ HUYNH — data-layer. Số liệu SUY ĐỘNG (bảng theo buổi ET/BTVN); nhận xét GV lưu ở bao_cao_ph.
// Phần "tổng quan" (hoàn thành cơ bản/nâng cao, ET/BTVN/MT %) tái dùng getTongQuanHS (mastery.ts) — không lặp ở đây.
import { supabase } from './supabase'

const LIMIT = 10000

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

  const pct = (m: Map<string, { pts: number; n: number }>, id: string) => { const a = m.get(id); return a && a.n ? Math.min(100, Math.round((a.pts / (a.n * 100)) * 100)) : null }
  return buois.map((b) => ({
    buoiId: b.id, ngay: b.ngay, maBuoi: b.ma_buoi,
    vang: b.diem_danh === 'vang' || b.diem_danh === 'vang_phep',
    etPct: pct(etAgg, b.id),
    btvnPct: pct(btAgg, b.id),
    btvnTrangThai: kqMap.get(b.id)?.tt ?? null,
    btvnThaiDo: kqMap.get(b.id)?.td ?? null,
  }))
}

// ── Nhận xét GV (3 ô) cho (HS × môn × tháng) ──
export type BaoCaoPH = { thai_do: string | null; kien_thuc_ky_nang: string | null; ket_luan: string | null }
export async function getBaoCaoPH(hocSinhId: string, mon: string, thang: string): Promise<BaoCaoPH> {
  const { data, error } = await supabase.from('bao_cao_ph').select('thai_do, kien_thuc_ky_nang, ket_luan')
    .eq('hoc_sinh_id', hocSinhId).eq('mon', mon).eq('thang', thang).maybeSingle()
  if (error) throw error
  return (data as BaoCaoPH) ?? { thai_do: null, kien_thuc_ky_nang: null, ket_luan: null }
}
export async function upsertBaoCaoPH(hocSinhId: string, mon: string, thang: string, patch: Partial<BaoCaoPH>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('bao_cao_ph').upsert(
    { hoc_sinh_id: hocSinhId, mon, thang, ...patch, updated_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'hoc_sinh_id,mon,thang' })
  if (error) throw error
}
