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
export type DiemThi = { ky_thi_id: string; hoc_sinh_id: string; diem: number | null; band_luc_thi: string | null; verdict: Verdict; vuot_band: boolean }
export type ThanhTichLoai = { key: string; ten: string; icon: string | null; nhom: string | null; kieu: string | null; per_mon: boolean; thu_tu: number }
export type LuongBac = { min_exp: number; xu: number }

// Điểm Level mỗi lần đo: đạt=hệ số · gần đạt=½ hệ số (hệ2→1, hệ1→0.5) · không đạt=0.
const verdictPoint = (v: Verdict, heSo: number) => (v === 'dat' ? heSo : v === 'gan_dat' ? heSo / 2 : 0)

// ── LEVEL + XU của 1 HS × môn (mùa hiện tại + lương THÁNG hiện tại) ──
export type LevelXu = { mua: string; level: number; levelMax: number; xu: number; expThang: number; xuKe: number | null; expKeMoc: number | null }
export async function getLevelXu(hocSinhId: string, mon: string): Promise<LevelXu> {
  const mua = seasonOf(vnTodayStr())
  const [dt, exp, bac] = await Promise.all([
    supabase.from('diem_thi').select('verdict, ky_thi:ky_thi_id(he_so, mon, mua)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    supabase.from('gami_exp_ledger').select('amount').eq('hoc_sinh_id', hocSinhId).eq('mon', mon).gte('created_at', monthStartUtcISO()).limit(LIMIT),
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
// Nhập/sửa điểm thi 1 HS. verdict do staff duyệt (gợi ý theo band sau). Anti-NULL: có dòng = đã chấm.
export async function upsertDiemThi(d: { kyThiId: string; hocSinhId: string; diem: number | null; bandLucThi: string | null; verdict: Verdict; vuotBand: boolean }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('diem_thi').upsert(
    { ky_thi_id: d.kyThiId, hoc_sinh_id: d.hocSinhId, diem: d.diem, band_luc_thi: d.bandLucThi, verdict: d.verdict, vuot_band: d.vuotBand, graded_by: user?.id ?? null, updated_at: new Date().toISOString() },
    { onConflict: 'ky_thi_id,hoc_sinh_id' })
  if (error) throw error
}
