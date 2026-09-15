// BỘ CỤM CHUNG của trung tâm — ở DB (mig 202609081013_soan_cum_chung). Thùy 08/09: "ưu tiên ngôn ngữ chung trước".
// Mọi nhân sự đăng nhập đọc + thêm/sửa cùng 1 bộ; xoá = xoá mềm (xoa_at); vết sửa do trigger DB ghi (soan_cum_lich_su).
// Client CHỈ CRUD dòng đơn qua PostgREST (§2.0) — không tính toán gì ở đây. `tao_boi`/`sua_boi` = nhan_su.id của người
// đang đăng nhập (store.me), để trigger ghi "ai sửa"; không có me (chưa link nhân sự) thì null.
// localStorage (cum.ts) chỉ còn 2 việc: (1) dự phòng khi KHÔNG đăng nhập được (app soan chạy rời), (2) nguồn để
// "Đưa cụm trên máy này lên bộ chung" 1 lần.
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { loadCums, loadThuMucs, loadTabChung, type Cum, type ThuMuc } from './cum'

type CumRow = { id: string; ten: string; loai: 'cong_thuc' | 'doan'; noi_dung: string; go_tat: string | null; phim: string | null; mon: string; nhanh: string | null; thu_muc_id: string | null; tab: number; thu_tu: number | null; created_at: string }
type TmRow = { id: string; ten: string; mon: string; nhanh: string | null; khoi: number | null; tab_ten: Record<string, string> | null; created_at: string }

const meId = () => useStore.getState().me?.nhanSu.id ?? null
const toCum = (r: CumRow): Cum => ({ id: r.id, ten: r.ten, loai: r.loai, noiDung: r.noi_dung, goTat: r.go_tat ?? undefined, phim: r.phim ?? undefined, mon: r.mon, nhanh: r.nhanh ?? undefined, thuMucId: r.thu_muc_id ?? undefined, tab: r.tab, thuTu: r.thu_tu ?? undefined, created: Date.parse(r.created_at) })
const toTm = (r: TmRow): ThuMuc => ({ id: r.id, ten: r.ten, mon: r.mon, nhanh: r.nhanh ?? undefined, khoi: r.khoi ?? undefined, tabTen: r.tab_ten ?? {}, created: Date.parse(r.created_at) })
const cumRow = (c: Cum) => ({ id: c.id, ten: c.ten, loai: c.loai, noi_dung: c.noiDung, go_tat: c.goTat?.trim() || null, phim: c.phim || null, mon: c.mon, nhanh: c.nhanh ?? null, thu_muc_id: c.thuMucId ?? null, tab: c.tab ?? 1, thu_tu: c.thuTu ?? null })
const tmRow = (t: ThuMuc) => ({ id: t.id, ten: t.ten, mon: t.mon, nhanh: t.nhanh ?? null, khoi: t.khoi ?? null, tab_ten: t.tabTen ?? {} })

// id đã có trên DB (để biết insert hay update — insert mới điền tao_boi, update KHÔNG đè tao_boi).
const daCo = new Set<string>()

export type BoChung = { thuMucs: ThuMuc[]; cums: Cum[]; tabChung: Record<string, string> }
export async function taiBoChung(): Promise<BoChung> {
  const [tm, cm, tc] = await Promise.all([
    supabase.from('soan_thu_muc').select('id,ten,mon,nhanh,khoi,tab_ten,created_at').is('xoa_at', null).order('created_at').limit(500),
    supabase.from('soan_cum').select('id,ten,loai,noi_dung,go_tat,phim,mon,nhanh,thu_muc_id,tab,thu_tu,created_at').is('xoa_at', null).order('created_at').limit(5000),
    supabase.from('soan_tab_chung').select('tab,ten').limit(20),
  ])
  if (tm.error) throw tm.error
  if (cm.error) throw cm.error
  if (tc.error) throw tc.error
  daCo.clear()
  for (const r of tm.data as TmRow[]) daCo.add(r.id)
  for (const r of cm.data as CumRow[]) daCo.add(r.id)
  return {
    thuMucs: (tm.data as TmRow[]).map(toTm),
    cums: (cm.data as CumRow[]).map(toCum),
    tabChung: Object.fromEntries((tc.data as { tab: number; ten: string }[]).map((r) => [String(r.tab), r.ten])),
  }
}

async function ghi(table: 'soan_cum' | 'soan_thu_muc', rows: { id: string }[]) {
  const me = meId()
  const moi = rows.filter((r) => !daCo.has(r.id)).map((r) => ({ ...r, tao_boi: me, sua_boi: me }))
  const cu = rows.filter((r) => daCo.has(r.id)).map((r) => ({ ...r, sua_boi: me }))
  if (moi.length) { const { error } = await supabase.from(table).insert(moi); if (error) throw error; for (const r of moi) daCo.add(r.id) }
  for (const r of cu) { const { error } = await supabase.from(table).update(r).eq('id', r.id); if (error) throw error }
}
async function xoaMem(table: 'soan_cum' | 'soan_thu_muc', ids: string[]) {
  if (!ids.length) return
  const { error } = await supabase.from(table).update({ xoa_at: new Date().toISOString(), sua_boi: meId() }).in('id', ids)
  if (error) throw error
}
export const luuCums = (l: Cum[]) => ghi('soan_cum', l.map(cumRow))
export const xoaCums = (ids: string[]) => xoaMem('soan_cum', ids)
export const luuThuMucs = (l: ThuMuc[]) => ghi('soan_thu_muc', l.map(tmRow))
export const xoaThuMucs = (ids: string[]) => xoaMem('soan_thu_muc', ids)
export async function luuTabChung(m: Record<string, string>) {
  const rows = Object.entries(m).filter(([, ten]) => ten.trim()).map(([tab, ten]) => ({ tab: Number(tab), ten: ten.trim() }))
  const { error: e1 } = await supabase.from('soan_tab_chung').delete().gte('tab', 0)
  if (e1) throw e1
  if (rows.length) { const { error } = await supabase.from('soan_tab_chung').insert(rows); if (error) throw error }
}

// Trùng theo NỘI DUNG hay GÕ TẮT (bộ chung 1 gõ tắt = 1 cụm) thì bỏ qua — không đẻ bản sao.
export const coCumLocal = () => { try { return !!localStorage.getItem('soan.cum.v2') || !!localStorage.getItem('soan.cum.v1') } catch { return false } }
export async function nhapTuMay(hienCo: BoChung): Promise<{ tm: number; cum: number; boQua: number }> {
  const tmLocal = loadThuMucs()
  const cumLocal = loadCums(tmLocal)
  const tabLocal = loadTabChung()
  const uuid = () => crypto.randomUUID()
  // Thư mục: khớp theo (tên, nhánh, khối) đã có → dùng lại; chưa có → tạo mới với id mới.
  const tmMap = new Map<string, string>()
  const tmMoi: ThuMuc[] = []
  for (const t of tmLocal) {
    const co = hienCo.thuMucs.find((x) => x.ten === t.ten && (x.nhanh ?? '') === (t.nhanh ?? '') && (x.khoi ?? 0) === (t.khoi ?? 0))
    if (co) { tmMap.set(t.id, co.id); continue }
    const id = uuid(); tmMap.set(t.id, id); tmMoi.push({ ...t, id })
  }
  const goTatCo = new Set(hienCo.cums.map((c) => c.goTat?.toLowerCase()).filter(Boolean))
  const noiDungCo = new Set(hienCo.cums.map((c) => c.noiDung.trim()))
  const cumMoi: Cum[] = []
  let boQua = 0
  for (const c of cumLocal) {
    const g = c.goTat?.trim().toLowerCase()
    if ((g && goTatCo.has(g)) || noiDungCo.has(c.noiDung.trim())) { boQua++; continue }
    if (g) goTatCo.add(g)
    noiDungCo.add(c.noiDung.trim())
    cumMoi.push({ ...c, id: uuid(), thuMucId: c.thuMucId ? tmMap.get(c.thuMucId) : undefined })
  }
  if (tmMoi.length) await luuThuMucs(tmMoi)
  if (cumMoi.length) await luuCums(cumMoi)
  if (Object.keys(tabLocal).length && !Object.keys(hienCo.tabChung).length) await luuTabChung(tabLocal)
  return { tm: tmMoi.length, cum: cumMoi.length, boQua }
}
