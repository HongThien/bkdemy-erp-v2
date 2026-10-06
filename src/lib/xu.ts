// Data-layer XU (seam) — sổ xu CHUNG `qlht_xu_ledger` (hệ quà của Hải; BK chỉ có 1 xu — Thùy chốt 08-29).
// Thùy 06/10: KHÔNG chốt theo tháng nữa — EXP (HS×môn×tháng) đổi ra xu REALTIME ở DB (`_xu_dong_bo`: đích =
// fn_gami_exp_xu_thang, ghi dòng chênh chot_thang/chot_lai, append-only). EXP giảm ⇒ trừ thật, ví được âm.
// Màn Chốt xu còn lại = theo dõi + nút đồng bộ ngay + phát sinh tay.
// Ví/số dư đọc qua view `qlht_v_so_du_xu` (hợp đồng chung với app Hải + trợ lý AI).
import { supabase } from './supabase'

const LIMIT = 10000

// ── BẢNG KHÚC QUY ĐỔI (luong_bac: min_exp PK = đầu khúc → xu = xu cho MỖI 1000 EXP trong khúc) — CEO chỉnh
// trên ERP, engine (fn_xu_tu_exp ở DB) chạy theo bảng. Client chỉ CRUD dòng, KHÔNG tính (§2.0). ──
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

// ── EXP THÁNG + XU per (HS×môn) — nguồn CHUNG cho preview & chốt. Tổng EXP (note-keyed + attend_floor cửa sổ
// tháng VN) và xu lũy tiến đều tính ở DB (fn_gami_exp_xu_thang → fn_xu_tu_exp). Key 'hoc_sinh_id|mon' (mon '' nếu NULL).
export type ExpXuRow = { hoc_sinh_id: string; mon: string; exp: number; xu: number; moc_ke: number | null; xu_moc_ke: number | null }
async function expXuThang(ym: string): Promise<Map<string, ExpXuRow>> {
  const { data, error } = await supabase.rpc('fn_gami_exp_xu_thang', { p_ym: ym })
  if (error) throw error
  return new Map(((data ?? []) as ExpXuRow[]).map((r) => [r.hoc_sinh_id + '|' + (r.mon ?? ''), r]))
}

// ── PREVIEW CHỐT: mỗi (HS×môn) có EXP HOẶC đã có dòng chốt tháng đó — kèm chênh lệch nếu đã chốt ──
export type ChotRow = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; mon: string
  khoi: string | null; tenLop: string | null    // lớp HS học ĐÚNG TRONG THÁNG NÀY (không phải lớp hiện tại — HS
  // chuyển lớp giữa chừng thì tháng cũ vẫn phải hiện lớp cũ, xem fn_lop_hs_thang · Thùy 20-09)
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
    expXuThang(ym), listBacXu(),
    supabase.from('qlht_xu_ledger').select('hoc_sinh_id, mon, loai, amount, exp_snapshot, created_at').eq('thang', ym).in('loai', ['chot_thang', 'chot_lai']).limit(LIMIT),
    supabase.from('hoc_sinh').select('id, ho_ten, ma_hs, khoi').limit(LIMIT),
    // Lớp CỦA THÁNG ym (không phải lớp hiện tại) — HS chuyển lớp giữa chừng vẫn tra đúng lớp cũ cho tháng cũ.
    supabase.rpc('fn_lop_hs_thang', { p_ym: ym }),
    // Xu PHÁT SINH tháng = cộng/trừ tay (loai cong_tay/tru_tay) — luồng NGƯỜI QUYẾT, tách khỏi chốt EXP.
    supabase.from('qlht_xu_ledger').select('hoc_sinh_id, amount').in('loai', ['cong_tay', 'tru_tay']).gte('created_at', mStart).lt('created_at', mEnd).limit(LIMIT),
  ])
  if (chotR.error) throw chotR.error
  if (gdR.error) throw gdR.error
  const hsName = new Map(((hsR.data ?? []) as any[]).map((h) => [h.id, h]))
  const lopMap = new Map<string, { khoi: string | null; ten_lop: string | null }>()
  for (const r of ((gdR.data ?? []) as any[])) lopMap.set(r.hoc_sinh_id + '|' + r.mon, { khoi: r.khoi ?? null, ten_lop: r.ten_lop ?? null })
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
    const e = expMap.get(k)
    const exp = e?.exp ?? 0, xu = e?.xu ?? 0
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

// ── ĐỒNG BỘ XU (Thùy 06/10: KHÔNG chốt theo tháng nữa — tính realtime). Thay hàm chotXu cũ (tính chênh ở
// client rồi insert — vi phạm §2.0). Toàn bộ "đích − đã phát → ghi chot_thang/chot_lai" chạy ở DB (`_xu_dong_bo`,
// khoá ví như tủ quà). Tự chạy: HS mở ví · pg_cron mỗi giờ (tháng trước + tháng này, từ 2026-09). Gọi tay ở đây:
//   hocSinhId null = mọi HS · ym null = cửa sổ mặc định; ym tường minh = đồng bộ đúng tháng đó (kể cả tháng 8 đóng băng).
export const THANG_TU_DONG = '2026-09' // tháng đầu quy đổi tự động — khớp hằng c_tu trong _xu_dong_bo
export async function dongBoXu(hocSinhId: string | null, ym: string | null): Promise<{ so_dong: number; tong_xu: number }> {
  const { data, error } = await supabase.rpc('fn_xu_dong_bo', { p_hoc_sinh_id: hocSinhId, p_thang: ym })
  if (error) throw error
  const r = (Array.isArray(data) ? data[0] : data) ?? { so_dong: 0, tong_xu: 0 }
  return { so_dong: Number(r.so_dong ?? 0), tong_xu: Number(r.tong_xu ?? 0) }
}

// ── PHÁT SINH TAY: cộng/trừ xu ngay tại màn Chốt xu (loai suy từ dấu — cong_tay ≥0, tru_tay <0).
// Ghi thẳng vào sổ chung qlht_xu_ledger (append-only, KHÔNG sửa/xoá dòng cũ — kiểu học phí).
export async function themPhatSinh(hocSinhId: string, amount: number, lyDo: string): Promise<void> {
  if (!amount) return
  const { data: au } = await supabase.auth.getUser()
  const { data: tk } = await supabase.from('tai_khoan').select('nhan_su_id').eq('id', au.user?.id ?? '').maybeSingle()
  const nsId = (tk as any)?.nhan_su_id
  if (!nsId) throw new Error('Tài khoản chưa gắn nhân sự — không ghi được sổ xu (nguoi_tao).')
  const { error } = await supabase.from('qlht_xu_ledger')
    .insert({ hoc_sinh_id: hocSinhId, loai: amount > 0 ? 'cong_tay' : 'tru_tay', amount, ly_do: lyDo || null, nguoi_tao: nsId })
  if (error) throw error
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
