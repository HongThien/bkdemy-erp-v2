// opsvanhanh.ts — Vận hành Ops: phân công CA trực (spine) + Report/Báo tan (Story 1+2) + Prep phòng (Story 3).
// Seam: UI KHÔNG gọi supabase trực tiếp. Nguồn khác hẳn phan_cong_lop (gán GV/TA theo LỚP dài hạn,
// xem gami.ts) → tách file riêng, KHÔNG nhét vào gami.ts/TabKey. Xem PLAN.md (mục A/A.1/B/C) cho bối cảnh.
// ET (Story 4) GÁC LẠI — không có gì ở đây.
import { supabase } from './supabase'
import { getMyProfile } from './nhansu'
import { congNgay } from './tuan'
import { tinhHieuSuat, TIEN_DO_TIERS } from './vanhanh'

const LIMIT = 2000

// ── Ngày → thu (CN=8, T2=2..T7=7) — cùng quy ước TKB/gami.ts (bản sao nhỏ, KHÔNG export ở gami.ts). ──
function thuOf(ngay: string): number { const d = new Date(ngay + 'T00:00:00').getDay(); return d === 0 ? 8 : d + 1 }
const isCuoiTuan = (thu: number) => thu === 7 || thu === 8
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))
const hhmm = (t: string) => t.slice(0, 5)

// ── Upload ảnh evidence — cùng pattern uploadReportAnh (baoloi.ts), bucket kho-anh prefix ops/ ──
export async function uploadOpsAnh(blob: Blob): Promise<string> {
  const path = `ops/${Date.now()}-${Math.round(performance.now())}.png`
  const { error } = await supabase.storage.from('kho-anh').upload(path, blob, { contentType: blob.type || 'image/png', upsert: false })
  if (error) throw error
  return supabase.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}

// Nhân sự TEAM OPS (biên chế `nhan_su_team`, team.ma='ops') — dùng cho picker "người trực" (KHÔNG
// phải toàn bộ nhân sự công ty; cùng cách xác định team ops đã dùng ở vanhanh.ts `listNhanSuTeams`).
export async function listOpsStaff(): Promise<{ id: string; ho_ten: string }[]> {
  const { data: team } = await supabase.from('team').select('id').eq('ma', 'ops').maybeSingle()
  if (!team) return []
  const { data: links } = await supabase.from('nhan_su_team').select('nhan_su_id').eq('team_id', (team as any).id).limit(LIMIT)
  const ids = (links ?? []).map((l: any) => l.nhan_su_id)
  if (!ids.length) return []
  const { data: ns, error } = await supabase.from('nhan_su').select('id, ho_ten').in('id', ids).eq('trang_thai', 'dang_lam').order('ho_ten').limit(LIMIT)
  if (error) throw error
  return (ns ?? []) as any
}

// ============================================================================
// A — PHÂN CÔNG CA TRỰC OPS (spine, PLAN.md §A). Pure-derive, effective-dated
// Y HỆT TKB (Thùy chốt 07-06: KHÔNG đóng băng tuần, KHÔNG bảng ngoại lệ).
// ============================================================================
export type TkbOpsRow = {
  tkbId: string; lopId: string; lopTen: string; mon: string; thu: number
  gioBatDau: string; gioKetThuc: string; phong: string | null
  phanCongId: string | null; nhanSuId: string | null; nhanSuTen: string | null
}
// TOÀN BỘ slot TKB còn hiệu lực + người ĐANG trực (nếu có) — nguồn màn Phân công Ops.
export async function listTkbVoiNguoiTruc(): Promise<TkbOpsRow[]> {
  const { data: tkb, error } = await supabase.from('thoi_khoa_bieu')
    .select('id, lop_id, thu, gio_bat_dau, gio_ket_thuc, phong, lop:lop_id(ten_lop, mon)')
    .is('hieu_luc_den', null).order('thu').limit(LIMIT)
  if (error) throw error
  const tkbIds = (tkb ?? []).map((s: any) => s.id)
  const { data: pc } = tkbIds.length
    ? await supabase.from('phan_cong_ops').select('id, tkb_id, nhan_su_id, nhan_su:nhan_su_id(ho_ten)').is('hieu_luc_den', null).in('tkb_id', tkbIds).limit(LIMIT)
    : { data: [] as any[] }
  const pcByTkb = new Map<string, any>()
  for (const p of (pc ?? []) as any[]) pcByTkb.set(p.tkb_id, p)
  return (tkb ?? []).map((s: any): TkbOpsRow => {
    const p = pcByTkb.get(s.id)
    return {
      tkbId: s.id, lopId: s.lop_id, lopTen: s.lop?.ten_lop ?? '?', mon: s.lop?.mon ?? '', thu: s.thu,
      gioBatDau: s.gio_bat_dau, gioKetThuc: s.gio_ket_thuc, phong: s.phong,
      phanCongId: p?.id ?? null, nhanSuId: p?.nhan_su_id ?? null, nhanSuTen: p?.nhan_su?.ho_ten ?? null,
    }
  })
}
// Gán/đổi người trực 1 slot TKB — đóng dòng cũ (nếu có) + mở dòng mới TỪ `tuNgay` (KHÔNG đè).
// Đổi vĩnh viễn = xong ngay. Swap 1 buổi thì tự gán lại người cũ sau đó (Thùy chốt — chấp nhận tự
// "reset" tay 1 lần, đổi lấy KHỎI cần dựng bảng tuần/ngoại lệ riêng).
export async function ganNguoiTruc(tkbId: string, nhanSuId: string, tuNgay: string): Promise<void> {
  const { data: cur } = await supabase.from('phan_cong_ops').select('id').eq('tkb_id', tkbId).is('hieu_luc_den', null).maybeSingle()
  if (cur) await supabase.from('phan_cong_ops').update({ hieu_luc_den: congNgay(tuNgay, -1) }).eq('id', cur.id)
  const { error } = await supabase.from('phan_cong_ops').insert({ tkb_id: tkbId, nhan_su_id: nhanSuId, hieu_luc_tu: tuNgay, hieu_luc_den: null })
  if (error) throw error
}
export async function goNguoiTruc(tkbId: string, tuNgay: string): Promise<void> {
  const { data: cur } = await supabase.from('phan_cong_ops').select('id').eq('tkb_id', tkbId).is('hieu_luc_den', null).maybeSingle()
  if (!cur) return
  const { error } = await supabase.from('phan_cong_ops').update({ hieu_luc_den: congNgay(tuNgay, -1) }).eq('id', cur.id)
  if (error) throw error
}
// Người trực của MỘT SỐ tkb_id tại 1 ngày cụ thể — fetch hết rồi lọc CLIENT (PostgREST không lồng
// AND/OR phức tạp gọn — cùng cách gami.ts caTiepTheo làm, tránh câu OR dài).
async function mapNguoiTrucTheoTkb(tkbIds: string[], ngay: string): Promise<Map<string, string>> {
  if (!tkbIds.length) return new Map()
  const { data } = await supabase.from('phan_cong_ops').select('tkb_id, nhan_su_id, hieu_luc_tu, hieu_luc_den').in('tkb_id', tkbIds).limit(LIMIT)
  const m = new Map<string, string>()
  for (const r of (data ?? []) as any[]) if (r.hieu_luc_tu <= ngay && (!r.hieu_luc_den || r.hieu_luc_den >= ngay)) m.set(r.tkb_id, r.nhan_su_id)
  return m
}

// ============================================================================
// B — REPORT (Story 1) + BÁO TAN (Story 2). Bảng tự chứa `vh_ops_task` (PLAN.md
// §A.1 — KHÔNG đụng buoi_hoc, vì Report phải đóng được TRƯỚC KHI buổi "mở").
// ============================================================================
export type OpsTaskTab = 'report' | 'tan'
export const OPS_TASK_LABEL: Record<OpsTaskTab, string> = { report: 'Report trước buổi', tan: 'Báo tan' }
export type OpsTask = {
  tkbId: string; ngay: string; tab: OpsTaskTab; lopTen: string; thu: number
  gioBatDau: string; gioKetThuc: string; phong: string | null
  done: boolean; doneAt: string | null; anhUrl: string | null; deadline: number
}
const REPORT_GIO_CO_DINH = '20:00' // Thùy chốt 07-06: mốc CỐ ĐỊNH tối hôm trước, KHÔNG trừ ngược N-giờ-trước-ca.
const TAN_BIEN_PHUT = 15
function vnInstantLocal(ngay: string, gio: string): number {
  const [y, m, d] = ngay.split('-').map(Number); const [hh, mm] = gio.split(':').map(Number)
  return Date.UTC(y, m - 1, d, hh, mm) - 7 * 3600000
}
// Render tin nhắn ĐỘNG lúc gọi (đọc TKB hiện tại, KHÔNG lưu văn bản chết).
export function buildReportMessage(lopTen: string, thu: number, ngay: string, gioBatDau: string, gioKetThuc: string): string {
  const [, m, d] = ngay.split('-')
  const thuLabel = thu === 8 ? 'Chủ nhật' : `Thứ ${thu}`
  return `Ngày mai ${thuLabel}, ${d}/${m} các con lớp ${lopTen} có lịch học ${hhmm(gioBatDau)}–${hhmm(gioKetThuc)}, bố mẹ nhắc con đi học đúng giờ, mang đủ đồ dùng.`
}
export const TAN_MESSAGE = 'Lớp đã tan ạ.'

// Task report/tan của TÔI trong khoảng ngày [tu, den] — pure-derive từ phan_cong_ops × TKB, tra vh_ops_task xem đã đóng chưa.
export async function getMyOpsTasks(tu: string, den: string): Promise<OpsTask[]> {
  const prof = await getMyProfile()
  if (!prof) return []
  const myId = prof.nhanSu.id
  const { data: pcAll, error } = await supabase.from('phan_cong_ops').select('tkb_id, nhan_su_id, hieu_luc_tu, hieu_luc_den').eq('nhan_su_id', myId).limit(LIMIT)
  if (error) throw error
  const tkbIds = [...new Set((pcAll ?? []).map((r: any) => r.tkb_id))]
  if (!tkbIds.length) return []
  const { data: tkb } = await supabase.from('thoi_khoa_bieu')
    .select('id, thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu, hieu_luc_den, lop:lop_id(ten_lop, ngay_khai_giang)').in('id', tkbIds).limit(LIMIT)
  const tkbById = new Map((tkb ?? []).map((s: any) => [s.id, s]))
  const { data: doneRows } = await supabase.from('vh_ops_task').select('*').in('tkb_id', tkbIds).gte('ngay', tu).lte('ngay', den).limit(LIMIT)
  const doneMap = new Map<string, any>()
  for (const r of (doneRows ?? []) as any[]) doneMap.set(`${r.tkb_id}|${r.ngay}|${r.tab}`, r)

  // Report hiển thị/đến hạn vào TỐI HÔM TRƯỚC ca học (KHÁC ngày diễn ra ca) → quét thêm 1 ngày SAU `den`
  // để không bỏ sót report của ca xảy ra NGAY SAU tuần đang xem (vd hôm nay = CN cuối tuần, ca Thứ 2
  // tuần sau vẫn phải hiện report TỐI NAY — bug Thùy báo 07-06: report cũ bị gắn nhầm vào ngày CA HỌC).
  const denExt = congNgay(den, 1)
  const out: OpsTask[] = []
  for (let d = tu; d <= denExt; d = congNgay(d, 1)) {
    const thu = thuOf(d)
    for (const pc of (pcAll ?? []) as any[]) {
      if (!(pc.hieu_luc_tu <= d && (!pc.hieu_luc_den || pc.hieu_luc_den >= d))) continue
      const s = tkbById.get(pc.tkb_id); if (!s) continue
      if (s.thu !== thu) continue
      if (!(s.hieu_luc_tu <= d && (!s.hieu_luc_den || s.hieu_luc_den >= d))) continue
      if (s.lop?.ngay_khai_giang && s.lop.ngay_khai_giang > d) continue
      const base = { tkbId: s.id, lopTen: s.lop?.ten_lop ?? '?', thu, gioBatDau: s.gio_bat_dau, gioKetThuc: s.gio_ket_thuc, phong: s.phong }
      // Report: ngay = hôm trước ca học — chỉ đẩy nếu rơi trong [tu,den] (tránh trùng qua tuần trước).
      const ngayReport = congNgay(d, -1)
      if (ngayReport >= tu && ngayReport <= den) {
        const rp = doneMap.get(`${s.id}|${ngayReport}|report`)
        out.push({ ...base, ngay: ngayReport, tab: 'report', done: !!rp?.dong_at, doneAt: rp?.dong_at ?? null, anhUrl: rp?.anh_url ?? null, deadline: vnInstantLocal(ngayReport, REPORT_GIO_CO_DINH) })
      }
      // Tan: ngay = chính ngày học — chỉ đẩy khi d trong tuần đang xem (bỏ ngày mở rộng denExt).
      if (d <= den) {
        const tn = doneMap.get(`${s.id}|${d}|tan`)
        out.push({ ...base, ngay: d, tab: 'tan', done: !!tn?.dong_at, doneAt: tn?.dong_at ?? null, anhUrl: tn?.anh_url ?? null, deadline: vnInstantLocal(d, hhmm(s.gio_ket_thuc)) + TAN_BIEN_PHUT * 60000 })
      }
    }
  }
  return out.sort((a, b) => a.ngay.localeCompare(b.ngay) || a.gioBatDau.localeCompare(b.gioBatDau))
}

// Đóng task report/tan — BẮT BUỘC có ảnh evidence mới đóng được (§A nguyên tắc chung).
export async function dongOpsTask(tkbId: string, ngay: string, tab: OpsTaskTab, anhUrl: string): Promise<void> {
  if (!anhUrl) throw new Error('Cần ảnh evidence mới đóng được task.')
  const prof = await getMyProfile()
  if (!prof) throw new Error('Không xác định được người thực hiện.')
  const { error } = await supabase.from('vh_ops_task')
    .upsert({ tkb_id: tkbId, ngay, tab, nhan_su_id: prof.nhanSu.id, anh_url: anhUrl, dong_at: new Date().toISOString() }, { onConflict: 'tkb_id,ngay,tab' })
  if (error) throw error
}

// ── Duyệt (leader, auto-pass mặc định 100%) — công thức TÁI DÙNG tinhHieuSuat/TIEN_DO_TIERS (vanhanh.ts),
// lưu vào CHÍNH vh_ops_task (không reuse viec_van_hanh_duyet — bảng đó bắt buộc buoi_hoc_id not null). ──
const CHAM_NGUONG_GIO_OPS = { cap1: 12, cap2: 24 } // trễ <12h=cấp1 · 12-24h=cấp2 · ≥24h=cấp3 (đồng bộ vanhanh.ts)
export function deXuatTienDoOps(doneAt: string | null, deadline: number): { key: string; label: string; diem: number } {
  if (!doneAt) return TIEN_DO_TIERS[0]
  const treGio = (new Date(doneAt).getTime() - deadline) / 3600000
  if (treGio <= 0) return TIEN_DO_TIERS[0]
  return treGio <= CHAM_NGUONG_GIO_OPS.cap1 ? TIEN_DO_TIERS[1] : treGio <= CHAM_NGUONG_GIO_OPS.cap2 ? TIEN_DO_TIERS[2] : TIEN_DO_TIERS[3]
}
export type OpsChoDuyet = OpsTask & { nhanSuId: string; nhanSuTen: string }
// Task đã đóng nhưng CHƯA duyệt trong khoảng ngày — cho màn "Leader duyệt".
export async function listOpsChoDuyet(tu: string, den: string): Promise<OpsChoDuyet[]> {
  const { data: rows, error } = await supabase.from('vh_ops_task')
    .select('*, tkb:tkb_id(id, thu, gio_bat_dau, gio_ket_thuc, phong, lop:lop_id(ten_lop)), nhan_su:nhan_su_id(ho_ten)')
    .not('dong_at', 'is', null).is('duyet_at', null).gte('ngay', tu).lte('ngay', den).limit(LIMIT)
  if (error) throw error
  return ((rows ?? []) as any[]).map((r): OpsChoDuyet => {
    const s = r.tkb
    const deadline = r.tab === 'report' ? vnInstantLocal(congNgay(r.ngay, -1), REPORT_GIO_CO_DINH) : vnInstantLocal(r.ngay, hhmm(s.gio_ket_thuc)) + TAN_BIEN_PHUT * 60000
    return {
      tkbId: r.tkb_id, ngay: r.ngay, tab: r.tab, lopTen: s?.lop?.ten_lop ?? '?', thu: s?.thu ?? 0,
      gioBatDau: s?.gio_bat_dau ?? '', gioKetThuc: s?.gio_ket_thuc ?? '', phong: s?.phong ?? null,
      done: true, doneAt: r.dong_at, anhUrl: r.anh_url, deadline,
      nhanSuId: r.nhan_su_id, nhanSuTen: r.nhan_su?.ho_ten ?? '?',
    }
  })
}
export async function duyetOpsHangLoat(rows: OpsChoDuyet[], chatLuong = 100): Promise<void> {
  const prof = await getMyProfile()
  if (!prof) throw new Error('Không xác định được người duyệt')
  if (!rows.length) return
  const payload = rows.map((r) => ({
    tkb_id: r.tkbId, ngay: r.ngay, tab: r.tab, nhan_su_id: r.nhanSuId,
    anh_url: r.anhUrl, dong_at: r.doneAt, chat_luong: chatLuong, nguoi_duyet: prof.nhanSu.id, duyet_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from('vh_ops_task').upsert(payload, { onConflict: 'tkb_id,ngay,tab' })
  if (error) throw error
}
export function hieuSuatOpsOf(r: OpsChoDuyet, chatLuong: number): number {
  return tinhHieuSuat(deXuatTienDoOps(r.doneAt, r.deadline).diem, chatLuong)
}

// ============================================================================
// C — PREP PHÒNG (Story 3). "Lượt" = phòng × cửa sổ giờ (Thùy chốt 07-06, ĐƠN
// GIẢN HOÁ — KHÔNG thuật toán gộp-theo-khoảng-cách-phút): T2-T6 = 1 lượt/ngày
// (dù tối có mấy ca) · T7/CN = 2 lượt (sáng/chiều, ranh giới = mốc 12:00 TKB).
// ============================================================================
export type PrepLuotKey = 'ngay' | 'sang' | 'chieu'
export type PrepLuot = {
  phong: string; ngay: string; luot: PrepLuotKey; gioCaDau: string; tkbCaDauId: string
  nhanSuId: string | null; nhanSuTen: string | null
}
// Suy TOÀN BỘ lượt-cần-prep trong 1 khoảng ngày — quét TKB active MỌI phòng/lớp (cross-lớp, khác truy vấn theo lop_id thường thấy).
export async function luotPrepCuaKhoang(tu: string, den: string): Promise<PrepLuot[]> {
  const { data: tkb, error } = await supabase.from('thoi_khoa_bieu')
    .select('id, thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu, hieu_luc_den, lop:lop_id(ngay_khai_giang)')
    .not('phong', 'is', null).limit(LIMIT)
  if (error) throw error
  const all = (tkb ?? []) as any[]
  const out: { phong: string; ngay: string; luot: PrepLuotKey; caDau: any }[] = []
  for (let d = tu; d <= den; d = congNgay(d, 1)) {
    const thu = thuOf(d)
    const homNay = all.filter((s) => s.thu === thu && s.hieu_luc_tu <= d && (!s.hieu_luc_den || s.hieu_luc_den >= d) && (!s.lop?.ngay_khai_giang || s.lop.ngay_khai_giang <= d))
    const byPhong = new Map<string, any[]>()
    for (const s of homNay) { const k = s.phong as string; if (!byPhong.has(k)) byPhong.set(k, []); byPhong.get(k)!.push(s) }
    for (const [phong, slots] of byPhong) {
      const earliest = (arr: any[]) => arr.reduce((a, b) => (toMin(a.gio_bat_dau) <= toMin(b.gio_bat_dau) ? a : b))
      if (isCuoiTuan(thu)) {
        const sang = slots.filter((s) => toMin(s.gio_bat_dau) < 720)
        const chieu = slots.filter((s) => toMin(s.gio_bat_dau) >= 720)
        if (sang.length) out.push({ phong, ngay: d, luot: 'sang', caDau: earliest(sang) })
        if (chieu.length) out.push({ phong, ngay: d, luot: 'chieu', caDau: earliest(chieu) })
      } else if (slots.length) {
        out.push({ phong, ngay: d, luot: 'ngay', caDau: earliest(slots) })
      }
    }
  }
  const tkbIds = [...new Set(out.map((o) => o.caDau.id as string))]
  const nguoiTrucMap = await mapNguoiTrucTheoTkb(tkbIds, tu) // xấp xỉ: dùng ngày đầu khoảng để tra 1 lần (đủ dùng cho hiển thị tuần)
  const nsIds = [...new Set([...nguoiTrucMap.values()])]
  const { data: nsAll } = nsIds.length ? await supabase.from('nhan_su').select('id, ho_ten').in('id', nsIds).limit(LIMIT) : { data: [] as any[] }
  const nsTenMap = new Map(((nsAll ?? []) as any[]).map((n) => [n.id, n.ho_ten]))
  return out.map((o): PrepLuot => {
    const nsId = nguoiTrucMap.get(o.caDau.id) ?? null
    return { phong: o.phong, ngay: o.ngay, luot: o.luot, gioCaDau: o.caDau.gio_bat_dau, tkbCaDauId: o.caDau.id, nhanSuId: nsId, nhanSuTen: nsId ? nsTenMap.get(nsId) ?? null : null }
  })
}

// Cửa thời gian đóng task — CHỈNH ĐƯỢC ở đây (cùng quy ước NGUONG_DEADLINE của tuan.ts).
export const NGUONG_PREP_CUA = { thuongTruocMax: 60, thuongTruocMin: 30, cuoiTuanBien: 15 } // phút

export function prepCuaThoiGian(ngay: string, luot: PrepLuotKey, gioCaDau: string): { moTuLuc: number; dongLucMuon: number } {
  const caDauMs = vnInstantLocal(ngay, hhmm(gioCaDau))
  if (luot === 'ngay') return { moTuLuc: caDauMs - NGUONG_PREP_CUA.thuongTruocMax * 60000, dongLucMuon: caDauMs - NGUONG_PREP_CUA.thuongTruocMin * 60000 }
  // T7/CN: turnaround ngắn hơn (đặc biệt lượt chiều bám ngay sau lượt sáng) → cửa hẹp lại còn 1 biên trước ca đầu.
  return { moTuLuc: caDauMs - NGUONG_PREP_CUA.cuoiTuanBien * 60000, dongLucMuon: caDauMs }
}

export type PrepRow = {
  phong: string; ngay: string; luot: PrepLuotKey
  donPhong: boolean; chuanBiKit: boolean; anhUrl: string | null; dongAt: string | null
  gvDiemNen: number; gvGhiChu: string | null; gvChamAt: string | null; leaderChotAt: string | null
}
export async function getPrepRow(phong: string, ngay: string, luot: PrepLuotKey): Promise<PrepRow | null> {
  const { data, error } = await supabase.from('prep_phong').select('*').eq('phong', phong).eq('ngay', ngay).eq('luot', luot).maybeSingle()
  if (error) throw error
  if (!data) return null
  return { phong: data.phong, ngay: data.ngay, luot: data.luot, donPhong: data.don_phong, chuanBiKit: data.chuan_bi_kit, anhUrl: data.anh_url, dongAt: data.dong_at, gvDiemNen: data.gv_diem_nen, gvGhiChu: data.gv_ghi_chu, gvChamAt: data.gv_cham_at, leaderChotAt: data.leader_chot_at }
}
// Tick checklist / gắn ảnh tạm — upsert (đúng anti-NULL: dòng ra đời khi Ops bắt đầu thao tác, KHÔNG
// phải lúc mở tab). anhUrl lưu NGAY lúc dán/chọn (không chỉ giữ ở state UI) — kẻo tick checklist SAU
// đó reload lại `getPrepRow` sẽ trả anh_url=null, làm mất ảnh vừa dán trên màn hình.
export async function tickPrepChecklist(phong: string, ngay: string, luot: PrepLuotKey, patch: { donPhong?: boolean; chuanBiKit?: boolean; anhUrl?: string }): Promise<void> {
  const p: any = { phong, ngay, luot }
  if (patch.donPhong !== undefined) p.don_phong = patch.donPhong
  if (patch.chuanBiKit !== undefined) p.chuan_bi_kit = patch.chuanBiKit
  if (patch.anhUrl !== undefined) p.anh_url = patch.anhUrl
  const { error } = await supabase.from('prep_phong').upsert(p, { onConflict: 'phong,ngay,luot' })
  if (error) throw error
}
// Đóng task prep — chặn nếu chưa đủ checklist/ảnh HOẶC ngoài cửa thời gian (quá sớm CHẶN CỨNG, không chỉ tính trễ).
export async function dongPrep(phong: string, ngay: string, luot: PrepLuotKey, gioCaDau: string, anhUrl: string): Promise<void> {
  const cur = await getPrepRow(phong, ngay, luot)
  if (!cur?.donPhong || !cur?.chuanBiKit) throw new Error('Chưa tick đủ checklist (dọn phòng + chuẩn bị KIT).')
  const { moTuLuc } = prepCuaThoiGian(ngay, luot, gioCaDau)
  if (Date.now() < moTuLuc) throw new Error('Chưa tới cửa đóng task — dọn xong quá sớm thì phòng có thể bẩn lại, đợi thêm.')
  const { error } = await supabase.from('prep_phong').upsert({ phong, ngay, luot, anh_url: anhUrl, dong_at: new Date().toISOString() }, { onConflict: 'phong,ngay,luot' })
  if (error) throw error
}
export async function chamPrepGV(phong: string, ngay: string, luot: PrepLuotKey, diem: number, ghiChu?: string): Promise<void> {
  const { error } = await supabase.from('prep_phong').update({ gv_diem_nen: diem, gv_ghi_chu: ghiChu ?? null, gv_cham_at: new Date().toISOString() }).eq('phong', phong).eq('ngay', ngay).eq('luot', luot)
  if (error) throw error
}
export async function chotPrepLeader(phong: string, ngay: string, luot: PrepLuotKey): Promise<void> {
  const { error } = await supabase.from('prep_phong').update({ leader_chot_at: new Date().toISOString() }).eq('phong', phong).eq('ngay', ngay).eq('luot', luot)
  if (error) throw error
}

// Lượt Prep CỦA TÔI trong khoảng ngày (lọc theo người trực ca đầu) + trạng thái đã đóng chưa —
// dùng cho "Việc của tôi" (bulk, KHÔNG N+1 gọi getPrepRow từng lượt).
export type MyPrepTask = { phong: string; ngay: string; luot: PrepLuotKey; gioCaDau: string; done: boolean; dongAt: string | null; deadline: number }
export async function getMyPrepTasks(tu: string, den: string): Promise<MyPrepTask[]> {
  const prof = await getMyProfile()
  if (!prof) return []
  const all = await luotPrepCuaKhoang(tu, den)
  const mine = all.filter((l) => l.nhanSuId === prof.nhanSu.id)
  if (!mine.length) return []
  const phongs = [...new Set(mine.map((m) => m.phong))]
  const { data } = await supabase.from('prep_phong').select('phong, ngay, luot, dong_at').in('phong', phongs).gte('ngay', tu).lte('ngay', den).limit(LIMIT)
  const doneMap = new Map<string, string | null>()
  for (const r of (data ?? []) as any[]) doneMap.set(`${r.phong}|${r.ngay}|${r.luot}`, r.dong_at)
  return mine.map((l): MyPrepTask => {
    const dongAt = doneMap.get(`${l.phong}|${l.ngay}|${l.luot}`) ?? null
    return { phong: l.phong, ngay: l.ngay, luot: l.luot, gioCaDau: l.gioCaDau, done: !!dongAt, dongAt, deadline: prepCuaThoiGian(l.ngay, l.luot, l.gioCaDau).dongLucMuon }
  })
}
