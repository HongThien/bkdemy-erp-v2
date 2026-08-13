// ============================================================================
// giaoviec.ts — DATA-LAYER Giao việc & Hiệu suất v2 (BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md).
// Luồng: Idea → Backlog → Weekly plan → Task (1 người) → nghiệm thu → hiệu suất.
// SCOPE v1 (chốt CEO 07-31): chỉ đo việc PHÁT TRIỂN. Ghi công idea + hiệu suất
// kỳ = DERIVE (không bảng materialize) — đúng CLAUDE §1 "suy động".
// Hằng số/công thức: giaoviec-config.ts (§4.8). UI KHÔNG gọi supabase trực tiếp.
// ============================================================================
import { supabase } from './supabase'
import { getMyScope } from './nhansu'
import {
  GV, tinhTienDo, tinhChatLuong, gopPhanTram,
  todayVN, kyTuanHienTai, thangCuaKyTuan, soNgayLech,
} from './giaoviec-config'

const LIMIT = 2000

// ── Ai là "tôi" (nhân sự) ────────────────────────────────────────────────────
export async function myNhanSuId(): Promise<string> {
  const { data: au } = await supabase.auth.getUser()
  const { data: tk } = await supabase.from('tai_khoan').select('nhan_su_id').eq('id', au.user?.id ?? '').maybeSingle()
  const id = (tk as any)?.nhan_su_id
  if (!id) throw new Error('Tài khoản chưa link nhân sự — không xác định được người thao tác.')
  return id
}

// Housekeeping (auto-đóng chờ-nghiệm-thu >7 ngày + ngủ đông backlog >3 tháng).
// Gọi LAZY khi mở màn Review/Cá nhân/Backlog. Idempotent, an toàn gọi nhiều lần.
export async function chayHousekeeping(): Promise<void> {
  const { error } = await supabase.rpc('giaoviec_housekeeping')
  if (error) throw error
}

// Batch tên nhân sự cho nhiều id.
async function nhanSuTenMap(ids: (string | null | undefined)[]): Promise<Map<string, string>> {
  const uniq = [...new Set(ids.filter(Boolean) as string[])]
  if (!uniq.length) return new Map()
  const { data } = await supabase.from('nhan_su').select('id, ho_ten').in('id', uniq).limit(LIMIT)
  return new Map(((data ?? []) as any[]).map((n) => [n.id, n.ho_ten]))
}

// ════════════════════════════════════════════════════════════════════════════
// 1) LOẠI VIỆC — bảng ĐỊNH LƯỢNG khối lượng (§6)
// ════════════════════════════════════════════════════════════════════════════
export type MucKhoiLuong = { ma: string; ten: string; kl: number }
export type LoaiViec = { id: string; ten: string; thang_kl: MucKhoiLuong[]; active: boolean; created_at?: string }

export async function listLoaiViec(activeOnly = true): Promise<LoaiViec[]> {
  let q = supabase.from('loai_viec').select('*').order('ten').limit(LIMIT)
  if (activeOnly) q = q.eq('active', true)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as LoaiViec[]
}
export async function createLoaiViec(p: { ten: string; thang_kl: MucKhoiLuong[] }): Promise<LoaiViec> {
  const { data, error } = await supabase.from('loai_viec').insert(p).select().single()
  if (error) throw error
  return data as LoaiViec
}
export async function updateLoaiViec(id: string, patch: Partial<Pick<LoaiViec, 'ten' | 'thang_kl' | 'active'>>): Promise<void> {
  const { error } = await supabase.from('loai_viec').update(patch).eq('id', id)
  if (error) throw error
}

// ════════════════════════════════════════════════════════════════════════════
// 2) Ý TƯỞNG (idea) + BACKLOG — §2. Idea→Backlog = ĐỔI TRẠNG THÁI (cùng dòng)
// ════════════════════════════════════════════════════════════════════════════
export type TrangThaiYTuong = 'moi' | 'backlog' | 'holding' | 'da_trien_khai' | 'ngu_dong' | 'tu_choi'
export type YTuong = {
  id: string; tieu_de: string; mo_ta: string | null; tac_gia_id: string
  trang_thai: TrangThaiYTuong; ly_do_tu_choi: string | null
  gia_tri: number | null; co: number | null; ngay_vao_backlog: string | null
  created_at: string
}
export type YTuongFull = YTuong & { tac_gia_ten?: string }

export async function listYTuong(trangThai?: TrangThaiYTuong | TrangThaiYTuong[]): Promise<YTuongFull[]> {
  let q = supabase.from('y_tuong').select('*').order('created_at', { ascending: false }).limit(LIMIT)
  if (trangThai) q = Array.isArray(trangThai) ? q.in('trang_thai', trangThai) : q.eq('trang_thai', trangThai)
  const { data, error } = await q
  if (error) throw error
  const rows = (data ?? []) as YTuong[]
  const nsMap = await nhanSuTenMap(rows.map((r) => r.tac_gia_id))
  return rows.map((r) => ({ ...r, tac_gia_ten: nsMap.get(r.tac_gia_id) ?? '?' }))
}

// Mọi người đề xuất (§2.1) — tối thiểu tiêu đề + mô tả; tác giả = tôi.
export async function createYTuong(p: { tieu_de: string; mo_ta?: string }): Promise<void> {
  const me = await myNhanSuId()
  const { error } = await supabase.from('y_tuong').insert({ tieu_de: p.tieu_de, mo_ta: p.mo_ta ?? null, tac_gia_id: me, trang_thai: 'moi' })
  if (error) throw error
}
// Refinement trưởng nhánh (§2.2): bổ sung gia_tri/co/mô tả TRƯỚC khi CEO đọc.
export async function refineYTuong(id: string, patch: { gia_tri?: number | null; co?: number | null; mo_ta?: string }): Promise<void> {
  const { error } = await supabase.from('y_tuong').update(patch).eq('id', id)
  if (error) throw error
}
// Triage — CEO DUYỆT: → backlog (đổi trạng thái, KHÔNG đẻ dòng mới). Dùng cho cả holding→backlog.
export async function duyetYTuongVaoBacklog(id: string): Promise<void> {
  const { error } = await supabase.from('y_tuong').update({ trang_thai: 'backlog', ngay_vao_backlog: todayVN() }).eq('id', id)
  if (error) throw error
}
// Triage — HOLDING: tạm hoãn quyết định (chưa gật, chưa từ chối). Quyết lại sau.
export async function holdingYTuong(id: string): Promise<void> {
  const { error } = await supabase.from('y_tuong').update({ trang_thai: 'holding' }).eq('id', id)
  if (error) throw error
}
// Từ chối — BẮT BUỘC lý do, hiện cho tác giả (§2.1). KHÔNG xoá (tra cứu + tránh đề xuất lại §2.1).
export async function tuChoiYTuong(id: string, lyDo: string): Promise<void> {
  if (!lyDo.trim()) throw new Error('Từ chối phải kèm lý do (hiện cho tác giả).')
  const { error } = await supabase.from('y_tuong').update({ trang_thai: 'tu_choi', ly_do_tu_choi: lyDo.trim() }).eq('id', id)
  if (error) throw error
}
// Top-down (§2.5): CEO tạo THẲNG vào backlog (việc chiến lược, không ai đề xuất).
export async function taoBacklogTopDown(p: { tieu_de: string; mo_ta?: string; gia_tri?: number | null; co?: number | null }): Promise<void> {
  const me = await myNhanSuId()
  const { error } = await supabase.from('y_tuong').insert({
    tieu_de: p.tieu_de, mo_ta: p.mo_ta ?? null, tac_gia_id: me,
    trang_thai: 'backlog', ngay_vao_backlog: todayVN(), gia_tri: p.gia_tri ?? null, co: p.co ?? null,
  })
  if (error) throw error
}

// BACKLOG đã sort (§2.3): gia_tri/co giảm dần (bản thô WSJF). Kèm trần WIP + cảnh báo.
export type BacklogInfo = { items: YTuongFull[]; soLuong: number; quaTran: boolean }
export async function getBacklog(): Promise<BacklogInfo> {
  const items = await listYTuong('backlog')
  // sort: gia_tri DESC, co DESC (null xuống cuối)
  items.sort((a, b) => (b.gia_tri ?? 0) - (a.gia_tri ?? 0) || (b.co ?? 0) - (a.co ?? 0))
  return { items, soLuong: items.length, quaTran: items.length > GV.TRAN_WIP_BACKLOG }
}

// Idea quá 1 chu kỳ triage (2 tuần) chưa duyệt → ĐỎ (§2.2).
export function ideaQuaHanTriage(created_at: string): boolean {
  return soNgayLech(created_at.slice(0, 10), todayVN()) > GV.CHU_KY_TRIAGE_TUAN * 7
}

// ════════════════════════════════════════════════════════════════════════════
// 3) AI GIAO ĐƯỢC CHO AI — reuse span-of-control (getMyScope), §5
// ════════════════════════════════════════════════════════════════════════════
export type NguoiDuocGiao = { nhan_su_id: string; ho_ten: string; ma_ns?: string }
export async function listNguoiDuocGiao(): Promise<NguoiDuocGiao[]> {
  const scope = await getMyScope()
  if (!scope) return []
  const seen = new Map<string, NguoiDuocGiao>()
  // Tự nhận việc = tự-giao cho mình (§5).
  seen.set(scope.nhanSu.id, { nhan_su_id: scope.nhanSu.id, ho_ten: scope.nhanSu.ho_ten + ' (tôi)', ma_ns: (scope.nhanSu as any).ma_ns })
  for (const r of [...scope.giamSatTrucTiep, ...scope.giamSatSau]) {
    if (!seen.has(r.nhan_su_id)) seen.set(r.nhan_su_id, { nhan_su_id: r.nhan_su_id, ho_ten: r.ho_ten, ma_ns: r.ma_ns })
  }
  return [...seen.values()]
}

// ════════════════════════════════════════════════════════════════════════════
// 5) VIỆC (task) — vòng đời §4
// ════════════════════════════════════════════════════════════════════════════
export type TrangThaiViec = 'moi_giao' | 'dang_lam' | 'cho_nghiem_thu' | 'dat' | 'tra_lai' | 'hold' | 'huy' | 'chuyen'
export type Viec = {
  id: string; loai_viec_id: string | null; task_me_id: string | null; y_tuong_id: string | null
  tieu_de: string; muc_tieu: string | null; output: string | null; mo_ta: string | null
  nguoi_lam_id: string | null; nguoi_giao_id: string; khoi_luong: number; nguon: 'ke_hoach' | 'phat_sinh'
  trang_thai: TrangThaiViec; deadline: string | null; deadline_goc: string | null; so_lan_gia_han: number
  gia_han_xin_deadline: string | null; gia_han_xin_ly_do: string | null
  ngay_nop: string | null; ky_tuan: string | null
  tien_do: number | null; chat_luong: number | null; phan_tram: number | null; so_lan_tra_lai: number
  evidence: string | null; phan_tram_ghi_nhan: number | null; ly_do_huy: string | null; ngay_hold: string | null
  viec_ke_thua_id: string | null; ghi_chu_nghiem_thu: string | null
  created_at: string; hoan_thanh_at: string | null; nghiem_thu_at: string | null
  // AI ĐỌC CỘT NÀY: 'dat' do người duyệt vs do housekeeping tự xả sau 7 ngày là HAI
  // chuyện khác nhau — trước đây chỉ phân biệt được bằng chuỗi trong ghi_chu_nghiem_thu.
  // Đếm 'tu_dong' theo tuần = chỉ số đo trợ lý có chặn được lỗ đen không (mong đợi: 0).
  nghiem_thu_nguon: 'nguoi' | 'tu_dong' | null
}
export type ViecFull = Viec & {
  nguoi_lam_ten?: string; nguoi_giao_ten?: string; loai_viec_ten?: string; y_tuong_tieu_de?: string
  so_con?: number; so_con_dat?: number      // chỉ set cho task MẸ (decorateViec đếm con)
}

async function decorateViec(rows: Viec[]): Promise<ViecFull[]> {
  if (!rows.length) return []
  const ids = rows.map((r) => r.id)
  const [nsMap, lvMap, ytMap, conRows] = await Promise.all([
    nhanSuTenMap(rows.flatMap((r) => [r.nguoi_lam_id, r.nguoi_giao_id])),
    mapById('loai_viec', rows.map((r) => r.loai_viec_id), 'ten'),
    mapById('y_tuong', rows.map((r) => r.y_tuong_id), 'tieu_de'),
    supabase.from('viec').select('task_me_id, trang_thai').in('task_me_id', ids).limit(LIMIT * 5),
  ])
  const conCnt = new Map<string, { tong: number; dat: number }>()
  for (const c of ((conRows.data ?? []) as any[])) {
    const m = conCnt.get(c.task_me_id) ?? { tong: 0, dat: 0 }
    m.tong++; if (c.trang_thai === 'dat') m.dat++
    conCnt.set(c.task_me_id, m)
  }
  return rows.map((v) => ({
    ...v,
    nguoi_lam_ten: v.nguoi_lam_id ? (nsMap.get(v.nguoi_lam_id) ?? '?') : undefined,
    nguoi_giao_ten: nsMap.get(v.nguoi_giao_id) ?? '?',
    loai_viec_ten: v.loai_viec_id ? lvMap.get(v.loai_viec_id) : undefined,
    y_tuong_tieu_de: v.y_tuong_id ? ytMap.get(v.y_tuong_id) : undefined,
    so_con: conCnt.get(v.id)?.tong ?? 0,
    so_con_dat: conCnt.get(v.id)?.dat ?? 0,
  }))
}
async function mapById(table: string, ids: (string | null)[], col: string): Promise<Map<string, string>> {
  const uniq = [...new Set(ids.filter(Boolean) as string[])]
  if (!uniq.length) return new Map()
  const { data } = await supabase.from(table).select(`id, ${col}`).in('id', uniq).limit(LIMIT)
  return new Map(((data ?? []) as any[]).map((r) => [r.id, r[col]]))
}

// GIAO VIỆC (§4.1). Task LẺ/CON = 1 người. Task MẸ = nguoi_lam null (con là đơn vị làm).
// deadline_goc = deadline (bất biến). ky_tuan = tuần plan. Nếu từ backlog (y_tuong_id):
// cửa 2 — ĐẺ DÒNG viec mới + y_tuong → da_trien_khai (không chuyển dòng vật lý).
export async function createViec(p: {
  tieu_de: string; nguoi_lam_id?: string | null; khoi_luong: number
  loai_viec_id?: string | null; task_me_id?: string | null; y_tuong_id?: string | null
  muc_tieu?: string; output?: string; mo_ta?: string; deadline?: string | null
  nguon?: 'ke_hoach' | 'phat_sinh'; ky_tuan?: string
}): Promise<Viec> {
  const me = await myNhanSuId()
  const { data: viec, error } = await supabase.from('viec').insert({
    tieu_de: p.tieu_de, nguoi_lam_id: p.nguoi_lam_id ?? null, nguoi_giao_id: me, khoi_luong: p.khoi_luong,
    loai_viec_id: p.loai_viec_id ?? null, task_me_id: p.task_me_id ?? null, y_tuong_id: p.y_tuong_id ?? null,
    muc_tieu: p.muc_tieu ?? null, output: p.output ?? null, mo_ta: p.mo_ta ?? null,
    deadline: p.deadline ?? null, deadline_goc: p.deadline ?? null,
    nguon: p.nguon ?? 'ke_hoach', ky_tuan: p.ky_tuan ?? kyTuanHienTai(), trang_thai: 'moi_giao',
  }).select().single()
  if (error) throw error
  if (p.y_tuong_id) await supabase.from('y_tuong').update({ trang_thai: 'da_trien_khai' }).eq('id', p.y_tuong_id)
  return viec as Viec
}

// XÁC NHẬN TUẦN (story §3): CEO chọn nhiều item backlog → mỗi item đẻ 1 TASK MẸ ở tuần
// này (Weekly Planning) + y_tuong → da_trien_khai. Task mẹ chưa gán người (tách con sau).
export async function xacNhanTuan(yTuongIds: string[], kyTuan?: string): Promise<void> {
  const ky = kyTuan ?? kyTuanHienTai()
  const { data: yts } = await supabase.from('y_tuong').select('id, tieu_de, mo_ta').in('id', yTuongIds).limit(LIMIT)
  for (const yt of (yts ?? []) as any[]) {
    await createViec({ tieu_de: yt.tieu_de, mo_ta: yt.mo_ta ?? undefined, y_tuong_id: yt.id, khoi_luong: 0, ky_tuan: ky, nguon: 'ke_hoach' })
  }
}

// WEEKLY PLANNING (story §4): mọi task của tuần (mẹ + con + lẻ). UI gom cụm theo task_me_id.
export async function listWeeklyPlanning(kyTuan: string): Promise<ViecFull[]> {
  const { data, error } = await supabase.from('viec').select('*').eq('ky_tuan', kyTuan)
    .not('trang_thai', 'in', '("huy","chuyen")').order('created_at', { ascending: true }).limit(LIMIT)
  if (error) throw error
  return decorateViec((data ?? []) as Viec[])
}

// NS bắt đầu làm (rời 'moi_giao').
export async function batDauLam(id: string): Promise<void> {
  const { error } = await supabase.from('viec').update({ trang_thai: 'dang_lam' }).eq('id', id)
  if (error) throw error
}
// NS BÁO HOÀN THÀNH — evidence BẮT BUỘC (§4.2, người làm tự đính). → cho_nghiem_thu.
export async function banHoanThanh(id: string, evidence: string): Promise<void> {
  if (!evidence.trim()) throw new Error('Phải đính bằng chứng (ảnh/file/link) khi báo hoàn thành.')
  const { error } = await supabase.from('viec').update({
    trang_thai: 'cho_nghiem_thu', evidence: evidence.trim(), hoan_thanh_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw error
}

// XIN GIA HẠN (§4.3) — chỉ TRƯỚC hạn, ≤ GIA_HAN_TOI_DA lần, không có yêu cầu đang chờ.
export async function xinGiaHan(id: string, deadlineMoi: string, lyDo: string): Promise<void> {
  const { data: v, error: e0 } = await supabase.from('viec').select('deadline, so_lan_gia_han, gia_han_xin_deadline').eq('id', id).single()
  if (e0) throw e0
  const viec = v as any
  if (viec.gia_han_xin_deadline) throw new Error('Đã có yêu cầu gia hạn đang chờ duyệt.')
  if (viec.so_lan_gia_han >= GV.GIA_HAN_TOI_DA) throw new Error(`Mỗi task chỉ được gia hạn tối đa ${GV.GIA_HAN_TOI_DA} lần.`)
  if (viec.deadline && soNgayLech(todayVN(), viec.deadline) < 0) throw new Error('Chỉ xin gia hạn được TRƯỚC hạn — quá hạn rồi thì đó là trễ, không phải gia hạn.')
  const { error } = await supabase.from('viec').update({ gia_han_xin_deadline: deadlineMoi, gia_han_xin_ly_do: lyDo.trim() || null }).eq('id', id)
  if (error) throw error
}
// LEADER duyệt/từ chối gia hạn (§4.4). deadline_goc BẤT BIẾN (không đụng).
export async function duyetGiaHan(id: string, dongY: boolean): Promise<void> {
  const { data: v, error: e0 } = await supabase.from('viec').select('gia_han_xin_deadline, so_lan_gia_han').eq('id', id).single()
  if (e0) throw e0
  const viec = v as any
  if (!viec.gia_han_xin_deadline) throw new Error('Không có yêu cầu gia hạn để duyệt.')
  const patch: any = { gia_han_xin_deadline: null, gia_han_xin_ly_do: null }
  if (dongY) { patch.deadline = viec.gia_han_xin_deadline; patch.so_lan_gia_han = viec.so_lan_gia_han + 1 }
  const { error } = await supabase.from('viec').update(patch).eq('id', id)
  if (error) throw error
}

// LEADER NGHIỆM THU (§4.2 một chạm). Đạt = chất lượng 100 mặc định; HẠ điểm mới bắt gõ lý do.
// Tiến độ = MÁY tính (ngay_nop vs deadline). Chất lượng bị chặn trần theo số lần trả lại.
export async function nghiemThu(id: string, p: { dat: boolean; chat_luong?: number; ly_do?: string | null }): Promise<void> {
  const { data: v, error: e0 } = await supabase.from('viec').select('*').eq('id', id).single()
  if (e0) throw e0
  const viec = v as Viec
  if (p.dat) {
    const diemLeader = p.chat_luong ?? 100
    if (diemLeader < 100 && !p.ly_do?.trim()) throw new Error('Hạ chất lượng dưới 100 thì phải ghi lý do.')
    const ngayNop = (viec.hoan_thanh_at ? new Date(viec.hoan_thanh_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }) : todayVN())
    const tienDo = tinhTienDo(viec.deadline, ngayNop)
    const chatLuong = tinhChatLuong(diemLeader, viec.so_lan_tra_lai)
    const { error } = await supabase.from('viec').update({
      trang_thai: 'dat', ngay_nop: ngayNop, tien_do: tienDo, chat_luong: chatLuong,
      phan_tram: gopPhanTram(tienDo, chatLuong), nghiem_thu_at: new Date().toISOString(),
      nghiem_thu_nguon: 'nguoi', // đối trọng với 'tu_dong' của giaoviec_housekeeping()
      ghi_chu_nghiem_thu: p.ly_do?.trim() || null,
    }).eq('id', id)
    if (error) throw error
  } else {
    // TRẢ LẠI (§4.6): đếm số lần → trần chất lượng 100/85/70 cho lần sau. Cần lý do.
    if (!p.ly_do?.trim()) throw new Error('Trả lại phải ghi lý do (để người làm biết sửa gì).')
    const { error } = await supabase.from('viec').update({
      trang_thai: 'tra_lai', so_lan_tra_lai: viec.so_lan_tra_lai + 1, ghi_chu_nghiem_thu: p.ly_do.trim(),
    }).eq('id', id)
    if (error) throw error
  }
}
// NS gửi lại nghiệm thu sau khi bị trả lại (đính lại evidence).
export async function guiLaiNghiemThu(id: string, evidence: string): Promise<void> {
  await banHoanThanh(id, evidence)
}

// HOLD (§4.4) — rút khỏi mẫu số kỳ; bật lại tính kỳ MỚI. Quá 3 tuần → đỏ (dashboard).
export async function holdViec(id: string): Promise<void> {
  const { error } = await supabase.from('viec').update({ trang_thai: 'hold', ngay_hold: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function boHold(id: string): Promise<void> {
  // bật lại → 'dang_lam', tính vào kỳ MỚI (ky_tuan = tuần hiện tại), xoá dấu hold.
  const { error } = await supabase.from('viec').update({ trang_thai: 'dang_lam', ngay_hold: null, ky_tuan: kyTuanHienTai() }).eq('id', id)
  if (error) throw error
}

// HUỶ (§4.4) — leader nhập tay phần_trăm_ghi_nhận (partial cho người làm) + lý do.
// Số lần huỷ = chỉ số kỷ luật giao việc của NGƯỜI GIAO (derive, xem demViecHuyCuaNguoiGiao).
export async function huyViec(id: string, phanTramGhiNhan: number, lyDo: string): Promise<void> {
  if (phanTramGhiNhan < 0 || phanTramGhiNhan > 100) throw new Error('Phần trăm ghi nhận phải 0–100.')
  if (!lyDo.trim()) throw new Error('Huỷ phải kèm lý do.')
  const { error } = await supabase.from('viec').update({
    trang_thai: 'huy', phan_tram_ghi_nhan: phanTramGhiNhan, ly_do_huy: lyDo.trim(),
  }).eq('id', id)
  if (error) throw error
}

// CHUYỂN NGƯỜI = macro 2 bước (§4.5): đóng task cũ ('chuyen' + partial) + ĐẺ task mới
// cho người mới (khối lượng = phần còn lại). Mỗi task luôn đúng 1 người từ đầu→cuối.
export async function chuyenNguoi(id: string, nguoiMoiId: string, phanTramGhiNhan: number, lyDo: string): Promise<Viec> {
  if (phanTramGhiNhan < 0 || phanTramGhiNhan > 100) throw new Error('Phần trăm ghi nhận phải 0–100.')
  const me = await myNhanSuId()
  const { data: cu, error: e0 } = await supabase.from('viec').select('*').eq('id', id).single()
  if (e0) throw e0
  const viec = cu as Viec
  const klConLai = Math.round(Number(viec.khoi_luong) * (1 - phanTramGhiNhan / 100) * 100) / 100
  // đẻ task mới cho người mới
  const { data: moi, error: e1 } = await supabase.from('viec').insert({
    tieu_de: viec.tieu_de, muc_tieu: viec.muc_tieu, output: viec.output, mo_ta: viec.mo_ta,
    nguoi_lam_id: nguoiMoiId, nguoi_giao_id: me, khoi_luong: klConLai,
    loai_viec_id: viec.loai_viec_id, task_me_id: viec.task_me_id, y_tuong_id: viec.y_tuong_id,
    deadline: viec.deadline, deadline_goc: viec.deadline, nguon: viec.nguon, ky_tuan: kyTuanHienTai(), trang_thai: 'moi_giao',
  }).select().single()
  if (e1) throw e1
  // đóng task cũ với partial + link kế thừa
  const { error: e2 } = await supabase.from('viec').update({
    trang_thai: 'chuyen', phan_tram_ghi_nhan: phanTramGhiNhan, ly_do_huy: lyDo.trim() || null, viec_ke_thua_id: (moi as any).id,
  }).eq('id', id)
  if (e2) throw e2
  return moi as Viec
}

// Leader sửa thông tin (§4.4) — KHÔNG đổi người (chuyển người là hành động riêng §4.5).
export async function suaViec(id: string, patch: { tieu_de?: string; muc_tieu?: string; output?: string; deadline?: string | null; khoi_luong?: number }): Promise<void> {
  const { error } = await supabase.from('viec').update(patch).eq('id', id)
  if (error) throw error
}

// ── QUERIES ──────────────────────────────────────────────────────────────────
export async function listViecCuaToi(nhanSuId: string): Promise<ViecFull[]> {
  const { data, error } = await supabase.from('viec').select('*').eq('nguoi_lam_id', nhanSuId).order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return decorateViec((data ?? []) as Viec[])
}
export async function listViecToiGiao(nguoiGiaoId: string): Promise<ViecFull[]> {
  const { data, error } = await supabase.from('viec').select('*').eq('nguoi_giao_id', nguoiGiaoId).order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return decorateViec((data ?? []) as Viec[])
}
// REVIEW TUẦN (§7 màn 1): mọi task ĐANG MỞ của cả team (nghiệm thu hàng loạt) — toàn trung tâm.
export async function listViecDangMo(): Promise<ViecFull[]> {
  const { data, error } = await supabase.from('viec').select('*')
    .in('trang_thai', ['moi_giao', 'dang_lam', 'cho_nghiem_thu', 'tra_lai', 'hold'])
    .order('deadline', { ascending: true, nullsFirst: false }).limit(LIMIT)
  if (error) throw error
  return decorateViec((data ?? []) as Viec[])
}
// CÔNG KHAI (§7 màn 2, toàn trung tâm): mọi task của một tuần plan.
export async function listViecTheoTuan(kyTuan: string): Promise<ViecFull[]> {
  const { data, error } = await supabase.from('viec').select('*').eq('ky_tuan', kyTuan).order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return decorateViec((data ?? []) as Viec[])
}

// ════════════════════════════════════════════════════════════════════════════
// 6) HIỆU SUẤT KỲ (pure-derive §7) — kỳ = TUẦN PLAN; tháng = Σ tuần
// ════════════════════════════════════════════════════════════════════════════
// Hiệu suất = Σ(kl × %)/Σ(kl) (chuẩn hoá). Sản lượng = Σ kl (giữ song song).
// 2 trục tien_do/chat_luong lưu riêng. Gồm task ĐÃ CÓ % trong kỳ: 'dat' (phan_tram)
// + 'huy'/'chuyen' (phan_tram_ghi_nhan, partial). 'hold' rút khỏi mẫu số.
export type HieuSuatKy = {
  hieuSuat: number | null; sanLuong: number
  soViecDat: number; soViecTraLai: number
  trungBinhTienDo: number | null; trungBinhChatLuong: number | null
}
function tinhTuViecs(viecs: Viec[]): HieuSuatKy {
  let sumKl = 0, sumKlPct = 0           // mẫu số hiệu suất (dat + huy/chuyen partial)
  let sumKlDat = 0, sumKlTd = 0, sumKlCl = 0, soDat = 0, soTraLai = 0
  for (const v of viecs) {
    const kl = Number(v.khoi_luong)
    if (v.trang_thai === 'dat') {
      sumKl += kl; sumKlPct += kl * Number(v.phan_tram ?? 0)
      sumKlDat += kl; sumKlTd += kl * Number(v.tien_do ?? 0); sumKlCl += kl * Number(v.chat_luong ?? 0); soDat++
    } else if (v.trang_thai === 'huy' || v.trang_thai === 'chuyen') {
      sumKl += kl; sumKlPct += kl * Number(v.phan_tram_ghi_nhan ?? 0)   // partial (2 trục không có → bỏ qua)
    } else if (v.trang_thai === 'tra_lai') soTraLai++
  }
  const r1 = (x: number) => Math.round(x * 10) / 10
  return {
    hieuSuat: sumKl > 0 ? r1(sumKlPct / sumKl) : null,
    sanLuong: Math.round(sumKl * 100) / 100, soViecDat: soDat, soViecTraLai: soTraLai,
    trungBinhTienDo: sumKlDat > 0 ? r1(sumKlTd / sumKlDat) : null,
    trungBinhChatLuong: sumKlDat > 0 ? r1(sumKlCl / sumKlDat) : null,
  }
}
// Hiệu suất THÁNG ('YYYY-MM') = gộp mọi tuần plan có ky_tuan rơi vào tháng đó.
// CHỈ đếm task LEAF (loại task mẹ có con) — con carry credit, không đếm 2 lần.
export async function tinhHieuSuatThang(nhanSuId: string, thang: string): Promise<HieuSuatKy> {
  const { data, error } = await supabase.from('viec').select('*').eq('nguoi_lam_id', nhanSuId).not('ky_tuan', 'is', null).limit(LIMIT)
  if (error) throw error
  let viecs = ((data ?? []) as Viec[]).filter((v) => v.ky_tuan && thangCuaKyTuan(v.ky_tuan) === thang)
  if (viecs.length) {
    const { data: cons } = await supabase.from('viec').select('task_me_id').in('task_me_id', viecs.map((v) => v.id)).limit(LIMIT * 5)
    const laMe = new Set(((cons ?? []) as any[]).map((c) => c.task_me_id))
    viecs = viecs.filter((v) => !laMe.has(v.id))
  }
  return tinhTuViecs(viecs)
}

// TỈ TRỌNG vận-hành : phát-triển (§7 màn cá nhân). v1 chỉ có phát triển → phát-triển=100%.
// (Nối vận hành derive ở pha sau — chốt CEO 07-31.) Trả về sản lượng phát triển làm mốc.
export async function tiTrongViec(nhanSuId: string, thang: string): Promise<{ phatTrien: number; vanHanh: number }> {
  const hs = await tinhHieuSuatThang(nhanSuId, thang)
  return { phatTrien: hs.sanLuong, vanHanh: 0 }
}

// ════════════════════════════════════════════════════════════════════════════
// 7) DASHBOARD TỔNG (§7 phụ) — throughput, tỉ lệ phát sinh, huỷ theo người giao
// ════════════════════════════════════════════════════════════════════════════
// Tỉ lệ phát sinh của một tuần (chỉ số sức khoẻ §2.5). >50% = đang chữa cháy.
export async function tiLePhatSinh(kyTuan: string): Promise<{ tong: number; phatSinh: number; tiLe: number | null }> {
  const { data, error } = await supabase.from('viec').select('nguon').eq('ky_tuan', kyTuan).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as any[]
  const phatSinh = rows.filter((r) => r.nguon === 'phat_sinh').length
  return { tong: rows.length, phatSinh, tiLe: rows.length ? Math.round((phatSinh / rows.length) * 1000) / 10 : null }
}
// Số lần huỷ theo NGƯỜI GIAO (§4.4 — kỷ luật giao việc của leader, KHÔNG lỗi người làm).
export async function demViecHuyTheoNguoiGiao(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('viec').select('nguoi_giao_id').eq('trang_thai', 'huy').limit(LIMIT)
  if (error) throw error
  const c: Record<string, number> = {}
  for (const r of (data ?? []) as any[]) c[r.nguoi_giao_id] = (c[r.nguoi_giao_id] ?? 0) + 1
  return c
}
// Hold quá HOLD_CANH_BAO_TUAN tuần → đỏ.
export function holdQuaHan(ngayHold: string | null): boolean {
  if (!ngayHold) return false
  return Math.floor(soNgayLech(ngayHold.slice(0, 10), todayVN()) / 7) >= GV.HOLD_CANH_BAO_TUAN
}
