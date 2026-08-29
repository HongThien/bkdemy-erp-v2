// ============================================================================
// gay.ts — DATA-LAYER "Gậy của BK" (hệ phạt nhân sự). 1 gậy = 20k.
// · Gậy TỰ ĐỘNG: quetGayTuDong() quét deadline ERP (vận hành TÁI DÙNG
//   listAllStaffTasks — KHÔNG tính lại deadline; giao tay đọc bảng viec) → đẻ
//   dòng gay_de_xuat 'cho'. Máy CHỈ đề xuất — leader chốt (chotDeXuat) mới
//   thành ledger. Quét lazy lúc mở màn (không pg_cron, pattern housekeeping).
// · Gậy THỦ CÔNG / GỠ: danhGayThuCong / goGay ghi thẳng ledger (dương/âm).
// · Tháng mới RESET: mọi tổng đều scope theo ky (ngày 1 của tháng VN) — derive
//   từ ledger, không cache. Chốt tháng = snapshot vào gay_chot_thang.
// UI KHÔNG gọi supabase trực tiếp — mọi thứ qua file này.
// ============================================================================
import { supabase } from './supabase'
import { myNhanSuId } from './giaoviec'
import { listAllStaffTasks } from './gami'
import { homNayVN, congNgay, vnInstant, ddmmVN } from './tuan'

const LIMIT = 5000

// Đơn giá 1 gậy (đ) — lưu vào gay_chot_thang lúc chốt nên đổi giá sau không phá lịch sử.
export const GAY_DON_GIA = 20000
// Lỗi hệ thống gắn cho gậy tự động (seed trong migration, tìm bằng khoá tự nhiên `ma`).
export const MA_LOI_CHAM_DEADLINE = 'cham_deadline'

// ── Kỳ tháng (gậy reset theo tháng, giờ VN) ─────────────────────────────────
export const kyHienTai = (): string => `${homNayVN().slice(0, 7)}-01`
export const kyTruoc = (): string => {
  const [y, m] = kyHienTai().split('-').map(Number)
  return m === 1 ? `${y - 1}-12-01` : `${y}-${String(m - 1).padStart(2, '0')}-01`
}
export const nhanKy = (ky: string) => `Tháng ${Number(ky.slice(5, 7))}/${ky.slice(0, 4)}`

// ── Types ───────────────────────────────────────────────────────────────────
export type GayLoi = { id: string; ma: string | null; ten: string; mo_ta: string | null; so_gay_mac_dinh: number; active: boolean }
export type GayHoatDong = { id: string; ten: string; mo_ta: string | null; so_gay_mac_dinh: number; active: boolean }
export type GayLedger = {
  id: string; nhan_su_id: string; ky: string; so_gay: number
  loai: 'tu_dong' | 'thu_cong' | 'go'
  loi_id: string | null; hoat_dong_id: string | null; ly_do: string | null
  ref_loai: string | null; ref_id: string | null
  nguoi_tao: string; created_at: string
  thu_hoi_at: string | null; nguoi_thu_hoi: string | null; thu_hoi_ly_do: string | null
}
export type GayLedgerFull = GayLedger & { ns_ten?: string; nguoi_tao_ten?: string; loi_ten?: string; hoat_dong_ten?: string }
export type GayDeXuat = {
  id: string; nhan_su_id: string; nguon: 'vanhanh' | 'giaoviec'; ref_key: string; mo_ta: string
  deadline_at: string | null; tre_phut: number | null
  trang_thai: 'cho' | 'da_danh' | 'bo_qua'; so_gay: number
  nguoi_quyet: string | null; quyet_at: string | null; ly_do_bo_qua: string | null
  ledger_id: string | null; created_at: string
}
export type GayDeXuatFull = GayDeXuat & { ns_ten?: string }
export type GayChotThang = {
  ky: string; nhan_su_id: string; so_gay_danh: number; so_gay_go: number; so_gay_chot: number
  don_gia: number; tien_phat: number; snapshot: unknown; nguoi_chot: string; chot_at: string
}
export type GayChotThangFull = GayChotThang & { ns_ten?: string; nguoi_chot_ten?: string }
// Tổng theo người trong 1 kỳ (derive từ ledger, bỏ dòng đã thu hồi).
export type BangGayRow = { nhan_su_id: string; ns_ten: string; soGayDanh: number; soGayGo: number; conLai: number; tienPhat: number; entries: GayLedgerFull[] }

// Batch tên nhân sự (cùng pattern giaoviec.ts).
async function nhanSuTenMap(ids: (string | null | undefined)[]): Promise<Map<string, string>> {
  const uniq = [...new Set(ids.filter(Boolean) as string[])]
  if (!uniq.length) return new Map()
  const { data } = await supabase.from('nhan_su').select('id, ho_ten').in('id', uniq).limit(LIMIT)
  return new Map(((data ?? []) as any[]).map((n) => [n.id, n.ho_ten]))
}

// ════════════════════════════════════════════════════════════════════════════
// 1) DANH MỤC (lỗi + hoạt động gỡ) — CEO tự thêm/sửa qua UI
// ════════════════════════════════════════════════════════════════════════════
export async function listGayLoi(activeOnly = true): Promise<GayLoi[]> {
  let q = supabase.from('gay_loi').select('*').order('created_at').limit(LIMIT)
  if (activeOnly) q = q.eq('active', true)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as GayLoi[]
}
export async function createGayLoi(p: { ten: string; mo_ta?: string; so_gay_mac_dinh?: number }): Promise<void> {
  const { error } = await supabase.from('gay_loi').insert({ ten: p.ten.trim(), mo_ta: p.mo_ta?.trim() || null, so_gay_mac_dinh: p.so_gay_mac_dinh ?? 1 })
  if (error) throw error
}
export async function updateGayLoi(id: string, patch: Partial<Pick<GayLoi, 'ten' | 'mo_ta' | 'so_gay_mac_dinh' | 'active'>>): Promise<void> {
  const { error } = await supabase.from('gay_loi').update(patch).eq('id', id)
  if (error) throw error
}
export async function listGayHoatDong(activeOnly = true): Promise<GayHoatDong[]> {
  let q = supabase.from('gay_hoat_dong').select('*').order('created_at').limit(LIMIT)
  if (activeOnly) q = q.eq('active', true)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as GayHoatDong[]
}
export async function createGayHoatDong(p: { ten: string; mo_ta?: string; so_gay_mac_dinh?: number }): Promise<void> {
  const { error } = await supabase.from('gay_hoat_dong').insert({ ten: p.ten.trim(), mo_ta: p.mo_ta?.trim() || null, so_gay_mac_dinh: p.so_gay_mac_dinh ?? 1 })
  if (error) throw error
}
export async function updateGayHoatDong(id: string, patch: Partial<Pick<GayHoatDong, 'ten' | 'mo_ta' | 'so_gay_mac_dinh' | 'active'>>): Promise<void> {
  const { error } = await supabase.from('gay_hoat_dong').update(patch).eq('id', id)
  if (error) throw error
}

// ════════════════════════════════════════════════════════════════════════════
// 2) QUÉT GẬY TỰ ĐỘNG — đẻ đề xuất 'cho'. Idempotent: ref_key UNIQUE vĩnh viễn
//    (1 việc trễ = đề xuất đúng 1 lần, kể cả quét lại mỗi lần mở màn).
//    Chỉ soi deadline RƠI TRONG THÁNG NÀY (tháng cũ đã chốt sổ, không truy hồi).
//    ⭐ 1 VIỆC TRỄ = 1 NGƯỜI (Thùy 29/08): listAllStaffTasks đẻ task cho MỌI
//    người được phân lớp (leader khối kèm nhiều lớp cũng dính) → lọc về đúng
//    NGƯỜI PHỤ TRÁCH CHÍNH theo phan_cong_lop.la_chinh. Không xác định được
//    chính chủ (≥2 ứng viên, không ai la_chinh) → BỎ TRỐNG, không đánh bừa
//    (CLAUDE §1.5 "thà bỏ trống còn hơn đánh sai").
//    ⭐ nhan_su.mien_gay = true → quét tự động bỏ qua (gậy thủ công vẫn đánh được).
// ════════════════════════════════════════════════════════════════════════════
type DeXuatMoi = Omit<GayDeXuat, 'id' | 'trang_thai' | 'so_gay' | 'nguoi_quyet' | 'quyet_at' | 'ly_do_bo_qua' | 'ledger_id' | 'created_at'>
type PhanCongRow = { nhan_su_id: string; lop_id: string; vai_tro: 'gv' | 'tg'; la_chinh: boolean }

// Người phụ trách CHÍNH của 1 khâu trong 1 lớp — danhgia: GV · chấm (ingame/et/btvn/mt):
// TG, riêng ingame lớp KHÔNG có TG thì về GV. 1 ứng viên → người đó; nhiều ứng viên →
// người la_chinh duy nhất; vẫn nhập nhằng → null (không đánh ai).
export function nguoiPhuTrach(pcs: PhanCongRow[], tab: string): string | null {
  const chon = (vai: 'gv' | 'tg'): string | null => {
    const cands = pcs.filter((p) => p.vai_tro === vai)
    if (cands.length === 1) return cands[0].nhan_su_id
    const chinh = cands.filter((p) => p.la_chinh)
    return chinh.length === 1 ? chinh[0].nhan_su_id : null
  }
  if (tab === 'danhgia') return chon('gv')
  if (tab === 'ingame') return pcs.some((p) => p.vai_tro === 'tg') ? chon('tg') : chon('gv')
  return chon('tg') // et / btvn / mt
}

export async function quetGayTuDong(): Promise<number> {
  const today = homNayVN()
  const monthStart = kyHienTai()
  const monthStartMs = vnInstant(monthStart, '00:00')
  const now = Date.now()
  const props: DeXuatMoi[] = []

  const [{ data: mienRows }, { data: pcAll }] = await Promise.all([
    supabase.from('nhan_su').select('id').eq('mien_gay', true).limit(LIMIT),
    supabase.from('phan_cong_lop').select('nhan_su_id, lop_id, vai_tro, la_chinh').limit(LIMIT),
  ])
  const mien = new Set(((mienRows ?? []) as any[]).map((r) => r.id))
  const pcByLop = new Map<string, PhanCongRow[]>()
  for (const p of (pcAll ?? []) as PhanCongRow[]) {
    if (!pcByLop.has(p.lop_id)) pcByLop.set(p.lop_id, [])
    pcByLop.get(p.lop_id)!.push(p)
  }

  // ── (a) Việc VẬN HÀNH (chấm bài/đánh giá/ET/BTVN/MT) — tái dùng đúng invariant
  // listAllStaffTasks, KHÔNG tính lại deadline. Lùi 7 ngày để bắt buổi cuối tháng
  // trước có deadline lấn sang tháng này (vd ET trưa hôm sau).
  const rows = await listAllStaffTasks(congNgay(monthStart, -7), today)
  for (const r of rows) {
    if (r.deadline == null || r.deadline < monthStartMs) continue
    // chỉ tính cho NGƯỜI PHỤ TRÁCH CHÍNH của khâu này — task của người khác bỏ qua
    if (nguoiPhuTrach(pcByLop.get(r.lopId) ?? [], r.tab) !== r.nhan_su_id) continue
    if (mien.has(r.nhan_su_id)) continue
    let tre = 0
    if (r.done && r.doneAt) tre = new Date(r.doneAt).getTime() - r.deadline
    else if (!r.done) tre = now - r.deadline
    if (tre <= 0) continue // đúng hạn (hoặc chưa tới hạn) — "1 phút cũng phạt" nên KHÔNG có ân hạn
    props.push({
      nhan_su_id: r.nhan_su_id, nguon: 'vanhanh',
      ref_key: `vh:${r.buoiId}|${r.tab}|${r.nhan_su_id}`,
      mo_ta: `${r.label} — ${r.lop} ${ddmmVN(r.ngay)}${r.done ? '' : ' (chưa xong)'}`,
      deadline_at: new Date(r.deadline).toISOString(),
      tre_phut: Math.ceil(tre / 60000),
    })
  }

  // ── (b) Việc GIAO TAY (bảng viec) — deadline là NGÀY: trễ = nộp/quét SAU ngày
  // deadline (deadline hiện hành, tức đã tính gia hạn được duyệt). hold/huy/chuyen bỏ.
  const { data: viecs, error } = await supabase.from('viec')
    .select('id, tieu_de, nguoi_lam_id, deadline, ngay_nop, hoan_thanh_at, trang_thai')
    .not('deadline', 'is', null).gte('deadline', monthStart)
    .in('trang_thai', ['moi_giao', 'dang_lam', 'cho_nghiem_thu', 'tra_lai', 'dat'])
    .limit(LIMIT)
  if (error) throw error
  for (const v of (viecs ?? []) as any[]) {
    if (mien.has(v.nguoi_lam_id)) continue
    // ngày nộp thật: ngay_nop (đã duyệt đạt) hoặc ngày VN của hoan_thanh_at (đang chờ nghiệm thu)
    const nop: string | null = v.ngay_nop ?? (v.hoan_thanh_at ? new Date(new Date(v.hoan_thanh_at).getTime() + 7 * 3600000).toISOString().slice(0, 10) : null)
    let treNgay = 0
    if (nop) treNgay = Math.max(0, Math.round((vnInstant(nop, '00:00') - vnInstant(v.deadline, '00:00')) / 86400000))
    else if (today > v.deadline) treNgay = Math.round((vnInstant(today, '00:00') - vnInstant(v.deadline, '00:00')) / 86400000)
    if (treNgay <= 0) continue
    props.push({
      nhan_su_id: v.nguoi_lam_id, nguon: 'giaoviec',
      ref_key: `viec:${v.id}`,
      mo_ta: `${v.tieu_de}${nop ? '' : ' (chưa nộp)'}`,
      deadline_at: new Date(vnInstant(v.deadline, '23:59')).toISOString(),
      tre_phut: treNgay * 1440,
    })
  }

  if (!props.length) return 0
  // ignoreDuplicates: dòng đã tồn tại (kể cả đã chốt/bỏ qua) GIỮ NGUYÊN — không đè quyết định của người.
  const { error: eUp } = await supabase.from('gay_de_xuat').upsert(props, { onConflict: 'ref_key', ignoreDuplicates: true })
  if (eUp) throw eUp
  return props.length
}

export async function listDeXuat(trangThai: GayDeXuat['trang_thai'] = 'cho'): Promise<GayDeXuatFull[]> {
  const { data, error } = await supabase.from('gay_de_xuat').select('*').eq('trang_thai', trangThai)
    .order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as GayDeXuat[]
  const nsMap = await nhanSuTenMap(rows.map((r) => r.nhan_su_id))
  return rows.map((r) => ({ ...r, ns_ten: nsMap.get(r.nhan_su_id) ?? '?' }))
}

// Chốt 1 đề xuất → ledger. Claim nguyên tử (update ... eq trang_thai='cho') chống
// 2 leader cùng bấm — người sau nhận lỗi "đã xử lý" thay vì đánh đúp gậy.
export async function chotDeXuat(dx: GayDeXuat, p: { soGay: number; loiId: string; lyDo?: string }): Promise<void> {
  if (p.soGay < 1) throw new Error('Số gậy phải ≥ 1.')
  const me = await myNhanSuId()
  const { data: claimed, error: eClaim } = await supabase.from('gay_de_xuat')
    .update({ trang_thai: 'da_danh', so_gay: p.soGay, nguoi_quyet: me, quyet_at: new Date().toISOString() })
    .eq('id', dx.id).eq('trang_thai', 'cho').select('id')
  if (eClaim) throw eClaim
  if (!claimed?.length) throw new Error('Đề xuất này đã được người khác xử lý.')
  const { data: led, error: eLed } = await supabase.from('gay_ledger').insert({
    nhan_su_id: dx.nhan_su_id, so_gay: p.soGay, loai: 'tu_dong', loi_id: p.loiId,
    ly_do: p.lyDo?.trim() || dx.mo_ta, ref_loai: dx.nguon, ref_id: dx.ref_key, nguoi_tao: me,
  }).select('id').single()
  if (eLed) { // trả đề xuất về 'cho' để không kẹt (ledger không ghi được thì chưa ai bị đánh)
    await supabase.from('gay_de_xuat').update({ trang_thai: 'cho', nguoi_quyet: null, quyet_at: null }).eq('id', dx.id)
    throw eLed
  }
  await supabase.from('gay_de_xuat').update({ ledger_id: (led as any).id }).eq('id', dx.id)
}

export async function boQuaDeXuat(id: string, lyDo: string): Promise<void> {
  if (!lyDo.trim()) throw new Error('Bỏ qua đề xuất phải kèm lý do (vết cho về sau).')
  const me = await myNhanSuId()
  const { data, error } = await supabase.from('gay_de_xuat')
    .update({ trang_thai: 'bo_qua', ly_do_bo_qua: lyDo.trim(), nguoi_quyet: me, quyet_at: new Date().toISOString() })
    .eq('id', id).eq('trang_thai', 'cho').select('id')
  if (error) throw error
  if (!data?.length) throw new Error('Đề xuất này đã được người khác xử lý.')
}

// ════════════════════════════════════════════════════════════════════════════
// 3) ĐÁNH / GỠ THỦ CÔNG + THU HỒI
// ════════════════════════════════════════════════════════════════════════════
export async function danhGayThuCong(p: { nhanSuId: string; loiId: string; soGay: number; lyDo?: string }): Promise<void> {
  if (p.soGay < 1) throw new Error('Số gậy phải ≥ 1.')
  const me = await myNhanSuId()
  const { error } = await supabase.from('gay_ledger').insert({
    nhan_su_id: p.nhanSuId, so_gay: p.soGay, loai: 'thu_cong', loi_id: p.loiId, ly_do: p.lyDo?.trim() || null, nguoi_tao: me,
  })
  if (error) throw error
}
export async function goGay(p: { nhanSuId: string; hoatDongId: string; soGay: number; lyDo?: string }): Promise<void> {
  if (p.soGay < 1) throw new Error('Số gậy gỡ phải ≥ 1.')
  const me = await myNhanSuId()
  const { error } = await supabase.from('gay_ledger').insert({
    nhan_su_id: p.nhanSuId, so_gay: -p.soGay, loai: 'go', hoat_dong_id: p.hoatDongId, ly_do: p.lyDo?.trim() || null, nguoi_tao: me,
  })
  if (error) throw error
}
// Thu hồi mềm (đánh/gỡ nhầm) — dòng vẫn nằm đó làm vết, chỉ bị loại khỏi mọi tổng.
export async function thuHoiGay(id: string, lyDo: string): Promise<void> {
  if (!lyDo.trim()) throw new Error('Thu hồi phải kèm lý do.')
  const me = await myNhanSuId()
  const { error } = await supabase.from('gay_ledger')
    .update({ thu_hoi_at: new Date().toISOString(), nguoi_thu_hoi: me, thu_hoi_ly_do: lyDo.trim() })
    .eq('id', id).is('thu_hoi_at', null)
  if (error) throw error
}

// ════════════════════════════════════════════════════════════════════════════
// 4) BẢNG GẬY THÁNG (công khai toàn công ty) — derive từ ledger, KHÔNG cache
// ════════════════════════════════════════════════════════════════════════════
export async function bangGay(ky: string): Promise<BangGayRow[]> {
  const { data, error } = await supabase.from('gay_ledger').select('*').eq('ky', ky)
    .order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as GayLedger[]
  const [nsMap, lois, hds] = await Promise.all([
    nhanSuTenMap([...rows.map((r) => r.nhan_su_id), ...rows.map((r) => r.nguoi_tao)]),
    listGayLoi(false), listGayHoatDong(false),
  ])
  const loiMap = new Map(lois.map((l) => [l.id, l.ten]))
  const hdMap = new Map(hds.map((h) => [h.id, h.ten]))
  const byNs = new Map<string, GayLedgerFull[]>()
  for (const r of rows) {
    const full: GayLedgerFull = {
      ...r, ns_ten: nsMap.get(r.nhan_su_id) ?? '?', nguoi_tao_ten: nsMap.get(r.nguoi_tao) ?? '?',
      loi_ten: r.loi_id ? loiMap.get(r.loi_id) : undefined, hoat_dong_ten: r.hoat_dong_id ? hdMap.get(r.hoat_dong_id) : undefined,
    }
    if (!byNs.has(r.nhan_su_id)) byNs.set(r.nhan_su_id, [])
    byNs.get(r.nhan_su_id)!.push(full)
  }
  const out: BangGayRow[] = []
  for (const [nsId, entries] of byNs) {
    const hieuLuc = entries.filter((e) => !e.thu_hoi_at)
    const danh = hieuLuc.filter((e) => e.so_gay > 0).reduce((s, e) => s + e.so_gay, 0)
    const go = -hieuLuc.filter((e) => e.so_gay < 0).reduce((s, e) => s + e.so_gay, 0)
    const conLai = Math.max(0, danh - go) // gỡ dư không thành "gậy âm" để dành — sàn 0
    out.push({ nhan_su_id: nsId, ns_ten: nsMap.get(nsId) ?? '?', soGayDanh: danh, soGayGo: go, conLai, tienPhat: conLai * GAY_DON_GIA, entries })
  }
  return out.sort((a, b) => b.conLai - a.conLai || b.soGayDanh - a.soGayDanh)
}

// ════════════════════════════════════════════════════════════════════════════
// 5) CHỐT THÁNG — snapshot bất biến để thu tiền; chốt lại = ghi đè kỳ đó
//    (idempotent kiểu recomputeExpThang, có vết nguoi_chot/chot_at + gay_log)
// ════════════════════════════════════════════════════════════════════════════
export async function chotThang(ky: string): Promise<number> {
  const me = await myNhanSuId()
  const bang = await bangGay(ky)
  const coGay = bang.filter((b) => b.soGayDanh > 0 || b.soGayGo > 0)
  if (!coGay.length) return 0
  const payload = coGay.map((b) => ({
    ky, nhan_su_id: b.nhan_su_id, so_gay_danh: b.soGayDanh, so_gay_go: b.soGayGo, so_gay_chot: b.conLai,
    don_gia: GAY_DON_GIA, tien_phat: b.tienPhat,
    snapshot: b.entries.map((e) => ({ id: e.id, so_gay: e.so_gay, loai: e.loai, loi: e.loi_ten ?? null, hoat_dong: e.hoat_dong_ten ?? null, ly_do: e.ly_do, nguoi_tao: e.nguoi_tao_ten, created_at: e.created_at, thu_hoi_at: e.thu_hoi_at })),
    nguoi_chot: me, chot_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from('gay_chot_thang').upsert(payload, { onConflict: 'ky,nhan_su_id' })
  if (error) throw error
  return payload.length
}

export async function listChotThang(ky: string): Promise<GayChotThangFull[]> {
  const { data, error } = await supabase.from('gay_chot_thang').select('*').eq('ky', ky).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as GayChotThang[]
  const nsMap = await nhanSuTenMap([...rows.map((r) => r.nhan_su_id), ...rows.map((r) => r.nguoi_chot)])
  return rows
    .map((r) => ({ ...r, ns_ten: nsMap.get(r.nhan_su_id) ?? '?', nguoi_chot_ten: nsMap.get(r.nguoi_chot) ?? '?' }))
    .sort((a, b) => b.so_gay_chot - a.so_gay_chot)
}

// ── MIỄN GẬY TỰ ĐỘNG (nhan_su.mien_gay) — CEO bật/tắt qua UI Danh mục ────────
export type NsMienGay = { id: string; ho_ten: string; ma_ns: string | null }
export async function listMienGay(): Promise<NsMienGay[]> {
  const { data, error } = await supabase.from('nhan_su').select('id, ho_ten, ma_ns').eq('mien_gay', true).order('ho_ten').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as NsMienGay[]
}
export async function setMienGay(nhanSuId: string, mien: boolean): Promise<void> {
  const { error } = await supabase.from('nhan_su').update({ mien_gay: mien }).eq('id', nhanSuId)
  if (error) throw error
}

// Đếm đề xuất đang chờ (badge tab). Không quét — chỉ đọc.
export async function demDeXuatCho(): Promise<number> {
  const { count, error } = await supabase.from('gay_de_xuat').select('id', { count: 'exact', head: true }).eq('trang_thai', 'cho')
  if (error) throw error
  return count ?? 0
}
