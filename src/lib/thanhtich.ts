// Data-layer THÀNH TÍCH (seam) — Level (Σ điểm sát hạch) · Xu (lương tháng) · catalog · điểm thi.
// Level/Xu = SUY ĐỘNG từ event (diem_thi / gami_exp_ledger). UI chỉ gọi qua đây.
import { supabase } from './supabase'
import { LEVEL } from '../gami/config.js'
import { seasonOf } from '../gami/season.js'

const LIMIT = 10000
const vnNow = () => new Date(Date.now() + 7 * 3600 * 1000) // giờ VN
const vnTodayStr = () => { const v = vnNow(); return `${v.getUTCFullYear()}-${String(v.getUTCMonth() + 1).padStart(2, '0')}-${String(v.getUTCDate()).padStart(2, '0')}` }
// Đầu tháng VN → instant UTC ISO (so created_at). Date.UTC -7h = VN-midnight.
const monthStartUtcISO = () => { const v = vnNow(); return new Date(Date.UTC(v.getUTCFullYear(), v.getUTCMonth(), 1, -7, 0, 0)).toISOString() }

export type Verdict = 'dat' | 'gan_dat' | 'khong_dat'
export type KyThi = { id: string; ten: string; loai: string; he_so: number; dot: string | null; ngay: string | null; mon: string | null; khoi: string | null; mua: string | null; buoi_hoc_id: string | null }
export type DiemThi = { ky_thi_id: string; hoc_sinh_id: string; diem: number | null; band_luc_thi: string | null; verdict: Verdict; vuot_band: boolean; diem_co_ban?: number | null; diem_nang_cao?: number | null; full_diem?: boolean }

// Điểm MT (BK sát hạch) = ĐIỂM CƠ BẢN + ĐIỂM NÂNG CAO (GV nhập thẳng). Trần: tổng ≥ 10 → 9.75.
// "Full điểm" (tick) → 10 (chỉ cách này ra 10 — làm trọn vẹn không sai). Làm tròn 2 chữ số.
export function tinhDiemMT(coBan: number | null | undefined, nangCao: number | null | undefined, full: boolean): number {
  if (full) return 10
  const tong = (coBan ?? 0) + (nangCao ?? 0)
  return tong >= 10 ? 9.75 : Math.round(tong * 100) / 100
}
// Verdict TỰ SUY từ điểm (màn MT bỏ chọn verdict tay — cột `verdict` NOT NULL nên vẫn lưu ngầm để Level dùng).
// Ngưỡng thang-10: đạt ≥8 · gần đạt 6.5–<8 · <6.5 không đạt.
export function verdictTuDiem(diem: number): Verdict {
  return diem >= 8 ? 'dat' : diem >= 6.5 ? 'gan_dat' : 'khong_dat'
}
export type ThanhTichLoai = { key: string; ten: string; icon: string | null; nhom: string | null; kieu: string | null; per_mon: boolean; thu_tu: number }
export type LuongBac = { min_exp: number; xu: number }

// Điểm Level mỗi lần đo: đạt=hệ số · gần đạt=½ hệ số (hệ2→1, hệ1→0.5) · không đạt=0.
export const verdictDiem = (v: Verdict, heSo: number) => (v === 'dat' ? heSo : v === 'gan_dat' ? heSo / 2 : 0)
const verdictPoint = verdictDiem
export const currentMua = () => seasonOf(vnTodayStr())

// ── LEVEL + XU của 1 HS × môn (mùa hiện tại + lương THÁNG hiện tại) ──
export type LevelXu = { mua: string; level: number; levelMax: number; xu: number; expThang: number; xuKe: number | null; expKeMoc: number | null }
export async function getLevelXu(hocSinhId: string, mon: string): Promise<LevelXu> {
  const mua = seasonOf(vnTodayStr())
  const [dt, exp, bac] = await Promise.all([
    supabase.from('diem_thi').select('verdict, ky_thi:ky_thi_id(he_so, mon, mua)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    // LOẠI legacy rank_*/btvn (mô hình cũ thay bằng exp_thang; legacy mùa cũ đóng-muộn có thể lọt window created_at).
    supabase.from('gami_exp_ledger').select('amount').eq('hoc_sinh_id', hocSinhId).eq('mon', mon).gte('created_at', monthStartUtcISO()).not('source', 'in', '(rank_et,rank_ingame,rank_mt,btvn)').limit(LIMIT),
    supabase.from('luong_bac').select('min_exp, xu').order('min_exp', { ascending: true }).limit(LIMIT),
  ])
  let level = 0
  for (const r of (dt.data ?? []) as any[]) { const k = r.ky_thi; if (k && k.mon === mon && k.mua === mua) level += verdictPoint(r.verdict, k.he_so) }
  const expThang = ((exp.data ?? []) as any[]).reduce((s, x) => s + Number(x.amount), 0)
  const bacs = (bac.data ?? []) as LuongBac[]
  let xu = 0, xuKe: number | null = null, expKeMoc: number | null = null
  for (let i = 0; i < bacs.length; i++) {
    if (expThang >= bacs[i].min_exp) { xu = bacs[i].xu; const nx = bacs[i + 1]; xuKe = nx?.xu ?? null; expKeMoc = nx?.min_exp ?? null }
  }
  return { mua, level, levelMax: LEVEL.MAX, xu, expThang, xuKe, expKeMoc }
}

// ── Catalog thành tích ──
export async function listThanhTichLoai(): Promise<ThanhTichLoai[]> {
  const { data } = await supabase.from('thanh_tich_loai').select('key, ten, icon, nhom, kieu, per_mon, thu_tu').eq('active', true).order('thu_tu', { ascending: true }).limit(LIMIT)
  return (data ?? []) as ThanhTichLoai[]
}

// Nhãn dùng chung (Quản lý Level view-only + tab Điểm thi trong Kết quả học tập).
export const LOAI_KY_THI: Record<string, string> = { truong: 'Thi trường', mt_sat_hach: 'BK sát hạch (MT)', khao_sat_thang: 'Khảo sát tháng' }
export const HE_SO_KY_THI: Record<string, number> = { truong: 2, mt_sat_hach: 2, khao_sat_thang: 1 }
export const DOT_LABEL: Record<string, string> = { giua_ky_1: 'Giữa kì I', cuoi_ky_1: 'Cuối kì I', giua_ky_2: 'Giữa kì II', cuoi_ky_2: 'Cuối kì II' }
export const DOT_ORDER = ['giua_ky_1', 'cuoi_ky_1', 'giua_ky_2', 'cuoi_ky_2'] as const

// ── Kì thi / điểm thi (khung cho tab quản lý Level) ──
export async function listKyThi(mua: string, mon?: string): Promise<KyThi[]> {
  let q = supabase.from('ky_thi').select('*').eq('mua', mua).order('ngay', { ascending: true }).limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as KyThi[]
}
export async function createKyThi(k: Omit<KyThi, 'id'>): Promise<KyThi> {
  const { data, error } = await supabase.from('ky_thi').insert(k).select().single()
  if (error) throw error
  return data as KyThi
}
export async function getDiemThi(kyThiId: string): Promise<DiemThi[]> {
  const { data, error } = await supabase.from('diem_thi').select('*').eq('ky_thi_id', kyThiId).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as DiemThi[]
}
// Điểm thi của NHIỀU kì thi (cho ma trận Level của 1 lớp).
export async function listDiemThiByKyThi(kyThiIds: string[]): Promise<DiemThi[]> {
  if (!kyThiIds.length) return []
  const { data, error } = await supabase.from('diem_thi').select('*').in('ky_thi_id', kyThiIds).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as DiemThi[]
}
// Nhập/sửa điểm thi 1 HS. verdict do staff duyệt (gợi ý theo band sau). Anti-NULL: có dòng = đã chấm.
export async function upsertDiemThi(d: { kyThiId: string; hocSinhId: string; diem: number | null; bandLucThi: string | null; verdict: Verdict; vuotBand: boolean; coBan?: number | null; nangCao?: number | null; full?: boolean }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('diem_thi').upsert(
    { ky_thi_id: d.kyThiId, hoc_sinh_id: d.hocSinhId, diem: d.diem, band_luc_thi: d.bandLucThi, verdict: d.verdict, vuot_band: d.vuotBand,
      diem_co_ban: d.coBan ?? null, diem_nang_cao: d.nangCao ?? null, full_diem: d.full ?? false,
      graded_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'ky_thi_id,hoc_sinh_id' })
  if (error) throw error
}

// ── ĐIỂM MT trong buổi (Thùy 07-14): "Điểm MT" tách riêng khỏi chấm Đ/C/S từng câu — TÁI DÙNG hạ tầng
// ky_thi/diem_thi (loai='mt_sat_hach') thay vì đẻ bảng mới. 1 ky_thi GẮN buoi_hoc_id (cột có sẵn cho đúng
// việc này) → tìm-hoặc-tạo LẦN ĐẦU nhập điểm ở tab MT, các lần mở lại tái dùng (idempotent, không đẻ trùng
// kỳ thi). KHÔNG ảnh hưởng query khác: mastery.ts/thanhtich.ts đọc ky_thi qua (mon, mua, loai) — buoi_hoc_id
// chỉ là liên kết PHỤ để tab MT tự tìm lại đúng kỳ thi của buổi, không đổi cách các nơi khác truy vấn.
export async function getOrCreateKyThiMTChoBuoi(buoiId: string, ten: string, mon: string, khoi: string | null, mua: string): Promise<KyThi> {
  // ⚠ BUG 08-07 (Thùy: "điểm MT chưa lưu được"): "tìm-hoặc-tạo" NÀY KHÔNG an-toàn-race — check-rồi-insert
  // KHÔNG nguyên tử + KHÔNG unique index trên (buoi_hoc_id) where loai='mt_sat_hach'. Hai lần gọi ĐỒNG THỜI
  // (StrictMode dev double-fire useEffect, hoặc 2 tab/2 người mở cùng buổi) đều SELECT thấy rỗng rồi cùng
  // INSERT → 2 ky_thi TRÙNG cho 1 buổi (đã thấy thật: buổi 9S1 07-08 có 2 kỳ). Kèm theo `.limit(1)` KHÔNG
  // `order` → mỗi lần đọc trả kỳ BẤT KỲ trong 2 kỳ: điểm nhập vào kỳ A, lần mở sau đọc trúng kỳ B (rỗng)
  // ⇒ "điểm chưa lưu". FIX (không xoá data): đọc DETERMINISTIC theo `created_at asc` — read & write LUÔN
  // hội tụ về ĐÚNG 1 kỳ (cũ nhất). Bản trùng mới (nếu lỡ đẻ) thành kỳ chết vô hại, không bao giờ được đọc/ghi.
  // (Chặn đẻ trùng tận gốc = unique partial index — cần migration + dedup bản cũ, làm riêng.)
  const read = async () => {
    const { data, error } = await supabase.from('ky_thi').select('*')
      .eq('buoi_hoc_id', buoiId).eq('loai', 'mt_sat_hach').order('created_at', { ascending: true }).limit(1)
    if (error) throw error
    return (data?.[0] as KyThi | undefined) ?? null
  }
  const found = await read()
  if (found) return found
  try {
    return await createKyThi({ ten, loai: 'mt_sat_hach', he_so: HE_SO_KY_THI.mt_sat_hach, dot: null, ngay: null, mon, khoi, mua, buoi_hoc_id: buoiId })
  } catch (e: any) {
    // Race: lần gọi kia đã INSERT trước → unique index `ky_thi_mt_1_per_buoi` (mig 202608071759) chặn INSERT
    // của mình (23505). KHÔNG còn đẻ trùng như xưa — chỉ cần đọc lại kỳ vừa được tạo mà trả về (idempotent).
    if (e?.code === '23505') { const again = await read(); if (again) return again }
    throw e
  }
}

// ── ĐIỂM THI TRÊN TRƯỜNG (pivot, tab riêng trong Kết quả học tập) — mỗi HS × 4 đợt (GK1/GK2/CK1/CK2),
// nguồn NHẬP THỦ CÔNG loai='truong' (ky_thi/diem_thi, cùng hạ tầng "Nhập điểm"). Roster theo lớp/khối/toàn
// bộ (giống loadMasteryCells) — KHÔNG gọi getMasteryHS, đây là điểm số nhập tay, không phải mastery suy động.
export type TruongDiemRow = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; lop: string | null; truong_hoc: string | null
  diem: Partial<Record<typeof DOT_ORDER[number], number | null>>
}
export async function getDiemThiTruong(opts: { mon: string; mua: string; lopId?: string | null; khoi?: string | null }): Promise<TruongDiemRow[]> {
  let sq
  if (opts.lopId) sq = supabase.from('hoc_sinh_lop').select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs, truong_hoc), lop:lop_id(ten_lop)').eq('lop_id', opts.lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  else if (opts.khoi) sq = supabase.from('hoc_sinh_lop').select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs, truong_hoc), lop:lop_id!inner(ten_lop, khoi, mon)').eq('trang_thai', 'dang_hoc').eq('lop.khoi', opts.khoi).eq('lop.mon', opts.mon).limit(LIMIT)
  else sq = supabase.from('hoc_sinh_lop').select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs, truong_hoc), lop:lop_id!inner(ten_lop, mon)').eq('trang_thai', 'dang_hoc').eq('lop.mon', opts.mon).limit(LIMIT)
  const { data: sd, error: se } = await sq
  if (se) throw se
  const hsMap = new Map<string, TruongDiemRow>()
  for (const r of (sd ?? []) as any[]) {
    const h = r.hoc_sinh; if (!h || hsMap.has(h.id)) continue
    hsMap.set(h.id, { hoc_sinh_id: h.id, ho_ten: h.ho_ten, ma_hs: h.ma_hs, lop: r.lop?.ten_lop ?? null, truong_hoc: h.truong_hoc ?? null, diem: {} })
  }
  const hsIds = [...hsMap.keys()]
  if (!hsIds.length) return []

  const { data: kts, error: ke } = await supabase.from('ky_thi').select('id, dot').eq('loai', 'truong').eq('mon', opts.mon).eq('mua', opts.mua).not('dot', 'is', null).limit(LIMIT)
  if (ke) throw ke
  const dotOfKy = new Map(((kts ?? []) as { id: string; dot: string }[]).map((k) => [k.id, k.dot]))
  const kyIds = [...dotOfKy.keys()]
  if (kyIds.length) {
    const { data: dts, error: de } = await supabase.from('diem_thi').select('ky_thi_id, hoc_sinh_id, diem').in('ky_thi_id', kyIds).in('hoc_sinh_id', hsIds).limit(LIMIT)
    if (de) throw de
    for (const d of (dts ?? []) as any[]) {
      const row = hsMap.get(d.hoc_sinh_id); if (!row) continue
      const dot = dotOfKy.get(d.ky_thi_id); if (!dot) continue
      row.diem[dot as typeof DOT_ORDER[number]] = d.diem
    }
  }
  return [...hsMap.values()]
}
