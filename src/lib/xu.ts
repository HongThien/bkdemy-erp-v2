// Data-layer VÍ XU (seam) — chốt tháng EXP→xu per (HS×môn) theo bảng mốc luong_bac; ví = Σ xu_ledger
// (suy động, không cột balance). Đóng băng sau chốt; lệch (data trễ/sửa điểm) → CHỐT LẠI ghi dòng
// chênh lệch ± 'chot_lai' (append-only, kiểu học phí — không xoá/sửa dòng đã phát). UI chỉ gọi qua đây.
import { supabase } from './supabase'
import { pagedLedger, EXP_NOTE_SOURCES } from './gami'
import { xuForExp } from '../gami/xu.js'

const LIMIT = 10000

// ── BẢNG MỐC QUY ĐỔI (luong_bac: min_exp PK → xu) — CEO chỉnh trên ERP, engine chạy theo bảng ──
export type BacXu = { min_exp: number; xu: number }
export async function listBacXu(): Promise<BacXu[]> {
  const { data, error } = await supabase.from('luong_bac').select('min_exp, xu').order('min_exp', { ascending: true }).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as BacXu[]
}
export async function addBacXu(minExp: number, xu: number): Promise<void> {
  const { error } = await supabase.from('luong_bac').insert({ min_exp: minExp, xu })
  if (error) throw error
}
export async function updateBacXu(minExp: number, xu: number): Promise<void> {
  const { error } = await supabase.from('luong_bac').update({ xu }).eq('min_exp', minExp)
  if (error) throw error
}
export async function deleteBacXu(minExp: number): Promise<void> {
  const { error } = await supabase.from('luong_bac').delete().eq('min_exp', minExp)
  if (error) throw error
}

// ── EXP THÁNG per (HS×môn) — nguồn CHUNG cho preview & chốt (đọc gami_exp_ledger, phân trang vượt cap 1000) ──
// note-keyed lọc note=ym; attend_floor (bù, không note) lọc created_at trong cửa sổ tháng VN.
async function expThangPerHsMon(ym: string): Promise<Map<string, number>> {
  const [Y, M] = ym.split('-').map(Number)
  const mStart = new Date(Date.UTC(Y, M - 1, 1, -7, 0, 0)).toISOString()
  const mEnd = new Date(Date.UTC(Y, M, 1, -7, 0, 0)).toISOString()
  const [noteRows, floorRows] = await Promise.all([
    pagedLedger((q) => q.select('hoc_sinh_id, mon, amount').in('source', EXP_NOTE_SOURCES).eq('note', ym)),
    pagedLedger((q) => q.select('hoc_sinh_id, mon, amount').eq('source', 'attend_floor').gte('created_at', mStart).lt('created_at', mEnd)),
  ])
  const m = new Map<string, number>()
  for (const r of [...noteRows, ...floorRows] as any[]) {
    const k = r.hoc_sinh_id + '|' + (r.mon ?? '')
    m.set(k, (m.get(k) ?? 0) + Number(r.amount))
  }
  return m
}

// ── PREVIEW CHỐT: mỗi (HS×môn) có EXP HOẶC đã có dòng chốt tháng đó — kèm chênh lệch nếu đã chốt ──
export type ChotRow = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; mon: string
  exp: number; xu: number                       // theo data + thang HIỆN TẠI
  daChot: boolean; xuDaPhat: number; expLucChot: number | null; chotAt: string | null
  lech: number                                  // xu − xuDaPhat (0 = khớp; ≠0 → cần chốt lại)
}
export async function previewChotXu(ym: string): Promise<{ rows: ChotRow[]; bacs: BacXu[] }> {
  const [expMap, bacs, chotR, hsR] = await Promise.all([
    expThangPerHsMon(ym), listBacXu(),
    supabase.from('xu_ledger').select('hoc_sinh_id, mon, loai, xu, exp_snapshot, created_at').eq('thang', ym).in('loai', ['chot_thang', 'chot_lai']).limit(LIMIT),
    supabase.from('hoc_sinh').select('id, ho_ten, ma_hs').limit(LIMIT),
  ])
  if (chotR.error) throw chotR.error
  const hsName = new Map(((hsR.data ?? []) as any[]).map((h) => [h.id, h]))
  // gom dòng chốt đã có per (HS×môn): xu cộng dồn (gốc + các lần chốt lại), exp_snapshot lấy dòng MỚI NHẤT
  const daChot = new Map<string, { xu: number; exp: number | null; at: string }>()
  for (const r of ((chotR.data ?? []) as any[]).sort((a, b) => (a.created_at < b.created_at ? -1 : 1))) {
    const k = r.hoc_sinh_id + '|' + (r.mon ?? '')
    const cur = daChot.get(k)
    daChot.set(k, { xu: (cur?.xu ?? 0) + Number(r.xu), exp: r.exp_snapshot ?? cur?.exp ?? null, at: r.created_at })
  }
  const keys = new Set([...expMap.keys(), ...daChot.keys()])
  const rows: ChotRow[] = []
  for (const k of keys) {
    const [hs, mon] = [k.slice(0, 36), k.slice(37)]
    const exp = expMap.get(k) ?? 0
    const xu = xuForExp(exp, bacs)
    const c = daChot.get(k)
    if (exp <= 0 && !c) continue
    rows.push({
      hoc_sinh_id: hs, ho_ten: hsName.get(hs)?.ho_ten ?? '?', ma_hs: hsName.get(hs)?.ma_hs ?? null, mon,
      exp, xu, daChot: !!c, xuDaPhat: c?.xu ?? 0, expLucChot: c?.exp ?? null, chotAt: c?.at ?? null,
      lech: xu - (c?.xu ?? 0),
    })
  }
  rows.sort((a, b) => a.mon.localeCompare(b.mon) || b.exp - a.exp)
  return { rows, bacs }
}

// ── CHỐT: dòng CHƯA chốt → 'chot_thang'; dòng ĐÃ chốt mà lệch → 'chot_lai' (xu = chênh ±). Idempotent:
// chạy lại khi không có gì đổi = 0 dòng. Unique index chặn race dòng gốc; lỗi 23505 = tab kia vừa chốt → bỏ qua.
export async function chotXu(ym: string): Promise<{ moi: number; dieuChinh: number; tongXu: number }> {
  const { data: { user } } = await supabase.auth.getUser()
  const { rows } = await previewChotXu(ym)
  const goc = rows.filter((r) => !r.daChot && r.xu > 0)
    .map((r) => ({ hoc_sinh_id: r.hoc_sinh_id, loai: 'chot_thang', xu: r.xu, mon: r.mon, thang: ym, exp_snapshot: r.exp, created_by: user?.id ?? null }))
  const lai = rows.filter((r) => r.daChot && r.lech !== 0)
    .map((r) => ({ hoc_sinh_id: r.hoc_sinh_id, loai: 'chot_lai', xu: r.lech, mon: r.mon, thang: ym, exp_snapshot: r.exp, created_by: user?.id ?? null }))
  for (const batch of [goc, lai]) {
    if (!batch.length) continue
    const { error } = await supabase.from('xu_ledger').insert(batch)
    if (error && error.code !== '23505') throw error
  }
  return { moi: goc.length, dieuChinh: lai.length, tongXu: [...goc, ...lai].reduce((s, r) => s + r.xu, 0) }
}

// ── VÍ XU (Σ ledger) ──
export async function getViXu(hocSinhId: string): Promise<number> {
  const { data, error } = await supabase.from('xu_ledger').select('xu').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[]).reduce((s, r) => s + Number(r.xu), 0)
}
// Ví của CẢ danh sách (bảng chốt/quản trị) — đọc toàn sổ phân trang (sổ lớn dần theo tháng).
export async function listViXu(): Promise<Map<string, number>> {
  const rows = await pagedLedgerXu()
  const m = new Map<string, number>()
  for (const r of rows) m.set(r.hoc_sinh_id, (m.get(r.hoc_sinh_id) ?? 0) + Number(r.xu))
  return m
}
async function pagedLedgerXu(): Promise<any[]> {
  const PAGE = 1000, out: any[] = []
  for (let from = 0; from < 200000; from += PAGE) {
    const { data, error } = await supabase.from('xu_ledger').select('hoc_sinh_id, xu').order('id').range(from, from + PAGE - 1)
    if (error) throw error
    const rows = (data ?? []) as any[]
    out.push(...rows)
    if (rows.length < PAGE) break
  }
  return out
}
