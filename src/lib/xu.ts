// Data-layer CHỐT XU THÁNG (seam) — ghi vào SỔ XU CHUNG `qlht_xu_ledger` (hệ quà của Hải; BK chỉ có
// 1 xu — Thùy chốt 08-29). Chốt tháng: EXP tháng per (HS×môn) → xu theo bảng mốc luong_bac; đóng băng;
// lệch (data trễ/sửa điểm) → CHỐT LẠI ghi dòng chênh ± 'chot_lai' (append-only, kiểu học phí).
// Ví/số dư đọc qua view `qlht_v_so_du_xu` (hợp đồng chung với app Hải + trợ lý AI).
// ⚠ CẦN SQL 1 LẦN (CEO chạy tay — bảng do postgres sở hữu): scripts/sql_chot_xu_qlht.sql
//   (thêm cột mon/thang/exp_snapshot, nới CHECK loai, policy INSERT, sửa view bỏ công thức tạm exp/10).
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
  khoi: string | null; tenLop: string | null    // lớp ĐANG HỌC của đúng môn dòng này (filter khối/lớp)
  exp: number; xu: number                       // theo data + thang HIỆN TẠI
  daChot: boolean; xuDaPhat: number; expLucChot: number | null; chotAt: string | null
  lech: number                                  // xu − xuDaPhat (0 = khớp; ≠0 → cần chốt lại)
  phatSinh: number                              // Σ cộng/trừ TAY của HS trong tháng (per HS, KHÔNG per môn — luồng riêng khỏi xu EXP)
}
export async function previewChotXu(ym: string): Promise<{ rows: ChotRow[]; bacs: BacXu[] }> {
  const [Y, M] = ym.split('-').map(Number)
  const mStart = new Date(Date.UTC(Y, M - 1, 1, -7, 0, 0)).toISOString()
  const mEnd = new Date(Date.UTC(Y, M, 1, -7, 0, 0)).toISOString()
  const [expMap, bacs, chotR, hsR, gdR, psR] = await Promise.all([
    expThangPerHsMon(ym), listBacXu(),
    supabase.from('qlht_xu_ledger').select('hoc_sinh_id, mon, loai, amount, exp_snapshot, created_at').eq('thang', ym).in('loai', ['chot_thang', 'chot_lai']).limit(LIMIT),
    supabase.from('hoc_sinh').select('id, ho_ten, ma_hs, khoi').limit(LIMIT),
    supabase.from('hoc_sinh_lop').select('hoc_sinh_id, lop:lop_id(mon, khoi, ten_lop)').eq('trang_thai', 'dang_hoc').limit(LIMIT),
    // Xu PHÁT SINH tháng = cộng/trừ tay (loai cong_tay/tru_tay) — luồng NGƯỜI QUYẾT, tách khỏi chốt EXP.
    supabase.from('qlht_xu_ledger').select('hoc_sinh_id, amount').in('loai', ['cong_tay', 'tru_tay']).gte('created_at', mStart).lt('created_at', mEnd).limit(LIMIT),
  ])
  if (chotR.error) throw chotR.error
  const hsName = new Map(((hsR.data ?? []) as any[]).map((h) => [h.id, h]))
  const lopMap = new Map<string, { khoi: string | null; ten_lop: string | null }>()
  for (const r of ((gdR.data ?? []) as any[])) if (r.lop?.mon) lopMap.set(r.hoc_sinh_id + '|' + r.lop.mon, { khoi: r.lop.khoi ?? null, ten_lop: r.lop.ten_lop ?? null })
  const psMap = new Map<string, number>()
  for (const r of ((psR.data ?? []) as any[])) psMap.set(r.hoc_sinh_id, (psMap.get(r.hoc_sinh_id) ?? 0) + Number(r.amount))
  // gom dòng chốt đã có per (HS×môn): xu cộng dồn (gốc + các lần chốt lại), exp_snapshot lấy dòng MỚI NHẤT
  const daChot = new Map<string, { xu: number; exp: number | null; at: string }>()
  for (const r of ((chotR.data ?? []) as any[]).sort((a, b) => (a.created_at < b.created_at ? -1 : 1))) {
    const k = r.hoc_sinh_id + '|' + (r.mon ?? '')
    const cur = daChot.get(k)
    daChot.set(k, { xu: (cur?.xu ?? 0) + Number(r.amount), exp: r.exp_snapshot ?? cur?.exp ?? null, at: r.created_at })
  }
  const keys = new Set([...expMap.keys(), ...daChot.keys()])
  const rows: ChotRow[] = []
  for (const k of keys) {
    const [hs, mon] = [k.slice(0, 36), k.slice(37)]
    const exp = expMap.get(k) ?? 0
    const xu = xuForExp(exp, bacs)
    const c = daChot.get(k)
    if (exp <= 0 && !c) continue
    const l = lopMap.get(k)
    rows.push({
      hoc_sinh_id: hs, ho_ten: hsName.get(hs)?.ho_ten ?? '?', ma_hs: hsName.get(hs)?.ma_hs ?? null, mon,
      khoi: l?.khoi ?? hsName.get(hs)?.khoi ?? null, tenLop: l?.ten_lop ?? null,
      exp, xu, daChot: !!c, xuDaPhat: c?.xu ?? 0, expLucChot: c?.exp ?? null, chotAt: c?.at ?? null,
      lech: xu - (c?.xu ?? 0), phatSinh: psMap.get(hs) ?? 0,
    })
  }
  rows.sort((a, b) => a.mon.localeCompare(b.mon) || b.exp - a.exp)
  return { rows, bacs }
}

// ── CHỐT: dòng CHƯA chốt → 'chot_thang'; dòng ĐÃ chốt mà lệch → 'chot_lai' (amount = chênh ±). Idempotent:
// chạy lại khi không đổi = 0 dòng. Unique index (SQL kèm) chặn race dòng gốc; 23505 = tab kia vừa chốt → bỏ qua.
// nguoi_tao = nhan_su hiện tại (map auth.uid → tai_khoan.nhan_su_id — cùng pattern giaoviec.ts).
export async function chotXu(ym: string): Promise<{ moi: number; dieuChinh: number; tongXu: number }> {
  const { data: au } = await supabase.auth.getUser()
  const { data: tk } = await supabase.from('tai_khoan').select('nhan_su_id').eq('id', au.user?.id ?? '').maybeSingle()
  const nsId = (tk as any)?.nhan_su_id
  if (!nsId) throw new Error('Tài khoản chưa gắn nhân sự — không ghi được sổ xu (nguoi_tao).')
  const { rows } = await previewChotXu(ym)
  const lyDo = (r: ChotRow, lai: boolean) => `${lai ? 'Chốt lại' : 'Chốt'} xu tháng ${ym} · ${r.mon || '?'} · ${r.exp.toLocaleString('vi-VN')} EXP`
  const goc = rows.filter((r) => !r.daChot && r.xu > 0)
    .map((r) => ({ hoc_sinh_id: r.hoc_sinh_id, loai: 'chot_thang', amount: r.xu, mon: r.mon, thang: ym, exp_snapshot: r.exp, ly_do: lyDo(r, false), nguoi_tao: nsId }))
  const lai = rows.filter((r) => r.daChot && r.lech !== 0)
    .map((r) => ({ hoc_sinh_id: r.hoc_sinh_id, loai: 'chot_lai', amount: r.lech, mon: r.mon, thang: ym, exp_snapshot: r.exp, ly_do: lyDo(r, true), nguoi_tao: nsId }))
  for (const batch of [goc, lai]) {
    if (!batch.length) continue
    const { error } = await supabase.from('qlht_xu_ledger').insert(batch)
    if (error && error.code !== '23505') throw error
  }
  return { moi: goc.length, dieuChinh: lai.length, tongXu: [...goc, ...lai].reduce((s, r) => s + r.amount, 0) }
}

// ── VÍ/SỐ DƯ XU — đọc qua view chung `qlht_v_so_du_xu` (khớp app Hải + trợ lý, 1 nguồn duy nhất) ──
export async function getViXu(hocSinhId: string): Promise<number> {
  const { data, error } = await supabase.from('qlht_v_so_du_xu').select('so_du').eq('hoc_sinh_id', hocSinhId).maybeSingle()
  if (error) throw error
  return Number((data as any)?.so_du ?? 0)
}
export async function listViXu(): Promise<Map<string, number>> {
  const { data, error } = await supabase.from('qlht_v_so_du_xu').select('hoc_sinh_id, so_du').limit(LIMIT)
  if (error) throw error
  return new Map(((data ?? []) as any[]).map((r) => [r.hoc_sinh_id, Number(r.so_du)]))
}
