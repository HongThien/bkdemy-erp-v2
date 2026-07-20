// opsvanhanh.ts — Vận hành Ops: phân công CA trực (spine) + Report/Báo tan (Story 1+2) + Prep phòng (Story 3).
// Seam: UI KHÔNG gọi supabase trực tiếp. Nguồn khác hẳn phan_cong_lop (gán GV/TA theo LỚP dài hạn,
// xem gami.ts) → tách file riêng, KHÔNG nhét vào gami.ts/TabKey. Xem PLAN.md (mục A/A.1/B/C) cho bối cảnh.
// ET (Story 4) GÁC LẠI — không có gì ở đây.
import { supabase } from './supabase'
import { getMyProfile } from './nhansu'
import { congNgay, homNayVN } from './tuan'
import { tinhHieuSuat, TIEN_DO_TIERS } from './vanhanh'
import { buoiAoCuaKhoang, type BuoiAo } from './gami'

const LIMIT = 2000

// ── Ngày → thu (CN=8, T2=2..T7=7) — cùng quy ước TKB/gami.ts (bản sao nhỏ, KHÔNG export ở gami.ts). ──
function thuOf(ngay: string): number { const d = new Date(ngay + 'T00:00:00').getDay(); return d === 0 ? 8 : d + 1 }
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))
const hhmm = (t: string) => t.slice(0, 5)

// ── CA TRỰC (Thùy chốt 07-19) — 3 ca CỐ ĐỊNH/ngày, MỌI ngày trong tuần (khác hẳn "isCuoiTuan" cũ chỉ áp
// T7/CN). Nguồn CHUẨN duy nhất cho khung giờ ca — đổi giờ ca thì sửa DUY NHẤT ở đây. "Lớp nào thuộc ca
// nào" = suy từ gio_bat_dau (KHÔNG lưu tĩnh) → thêm/sửa TKB tự vào đúng ca ngay, không cần re-fill.
export type CaTruc = 'sang' | 'chieu' | 'toi'
export const CA_TRUC_DEF: Record<CaTruc, { label: string; from: string; to: string }> = {
  sang: { label: 'Sáng', from: '08:00', to: '12:00' }, // Thùy 07-19: "tính từ 8h cho chắc" (có lớp CN học 08:00-08:30, trước 09:00 cũ)
  chieu: { label: 'Chiều', from: '14:00', to: '18:00' },
  toi: { label: 'Tối', from: '18:00', to: '21:30' },
}
export const CA_TRUC_LIST: CaTruc[] = ['sang', 'chieu', 'toi']
// Slot ngoài cả 3 khung giờ (vd lớp học lệch múi trưa/quá khuya) → null, KHÔNG gán ca nào — nơi gọi phải
// tự hiện cảnh báo "X lớp ngoài khung 3 ca" (triangulation, đừng nuốt lặng).
export function caOfGio(gioBatDau: string): CaTruc | null {
  const m = toMin(gioBatDau)
  for (const ca of CA_TRUC_LIST) { const d = CA_TRUC_DEF[ca]; if (m >= toMin(d.from) && m < toMin(d.to)) return ca }
  return null
}

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
// A — PHÂN CÔNG CA TRỰC OPS (Thùy chốt 07-19: theo CA — Sáng/Chiều/Tối — KHÔNG
// theo từng lớp trong TKB nữa). Pure-derive, effective-dated Y HỆT TKB (Thùy chốt
// 07-06: KHÔNG đóng băng tuần, KHÔNG bảng ngoại lệ). "Lớp nào thuộc ca nào" suy
// từ gio_bat_dau (caOfGio) — KHÔNG lưu quan hệ ca↔lớp tĩnh, thêm/sửa TKB tự vào
// đúng ca. Bảng phan_cong_ops CŨ (1 slot TKB = 1 người) đã NGỪNG DÙNG — xem
// migration 0103 (chưa xoá, chờ Thùy xác nhận).
// ============================================================================
export type CaAssignRow = {
  thu: number; ca: CaTruc
  nhanSuId: string | null; nhanSuTen: string | null
  lops: { lopTen: string; gioBatDau: string; gioKetThuc: string; phong: string | null }[]
}
// Slot TKB KHÔNG rơi vào ca nào trong 3 ca cố định — cảnh báo data-quality (triangulation), không nuốt lặng.
export type TkbNgoaiCa = { lopTen: string; thu: number; gioBatDau: string; gioKetThuc: string }

// TOÀN BỘ TKB còn hiệu lực, GOM theo (thu, ca) + người ĐANG trực ca đó (nếu có) — nguồn màn Phân công Ops.
// ⚠ Fix (Thùy báo lỗi 07-10, giữ nguyên khi đổi sang ca): lớp CHƯA khai giảng không đòi gán (đúng luật
// "lớp chưa khai giảng → session pure-derive tự KHÔNG sinh").
export async function listCaVoiNguoiTruc(): Promise<{ rows: CaAssignRow[]; ngoaiCa: TkbNgoaiCa[] }> {
  const { data: tkbAll, error } = await supabase.from('thoi_khoa_bieu')
    .select('id, lop_id, thu, gio_bat_dau, gio_ket_thuc, phong, lop:lop_id(ten_lop, mon, ngay_khai_giang)')
    .is('hieu_luc_den', null).order('thu').limit(LIMIT)
  if (error) throw error
  const homNay = homNayVN()
  const tkb = (tkbAll ?? []).filter((s: any) => !s.lop?.ngay_khai_giang || s.lop.ngay_khai_giang <= homNay)

  const { data: pcAll } = await supabase.from('phan_cong_ca').select('thu, ca, nhan_su_id, nhan_su:nhan_su_id(ho_ten)').is('hieu_luc_den', null).limit(LIMIT)
  const pcMap = new Map<string, any>()
  for (const p of (pcAll ?? []) as any[]) pcMap.set(`${p.thu}|${p.ca}`, p)

  const byKey = new Map<string, CaAssignRow>()
  const ngoaiCa: TkbNgoaiCa[] = []
  for (const s of tkb as any[]) {
    const ca = caOfGio(s.gio_bat_dau)
    if (!ca) { ngoaiCa.push({ lopTen: s.lop?.ten_lop ?? '?', thu: s.thu, gioBatDau: s.gio_bat_dau, gioKetThuc: s.gio_ket_thuc }); continue }
    const key = `${s.thu}|${ca}`
    if (!byKey.has(key)) {
      const p = pcMap.get(key)
      byKey.set(key, { thu: s.thu, ca, nhanSuId: p?.nhan_su_id ?? null, nhanSuTen: p?.nhan_su?.ho_ten ?? null, lops: [] })
    }
    byKey.get(key)!.lops.push({ lopTen: s.lop?.ten_lop ?? '?', gioBatDau: s.gio_bat_dau, gioKetThuc: s.gio_ket_thuc, phong: s.phong })
  }
  const rows = [...byKey.values()].sort((a, b) => a.thu - b.thu || CA_TRUC_LIST.indexOf(a.ca) - CA_TRUC_LIST.indexOf(b.ca))
  for (const r of rows) r.lops.sort((a, b) => a.gioBatDau.localeCompare(b.gioBatDau))
  return { rows, ngoaiCa }
}
// Gán/đổi người trực 1 ca (thu × ca) — đóng dòng cũ (nếu có) + mở dòng mới TỪ `tuNgay` (KHÔNG đè).
export async function assignCa(thu: number, ca: CaTruc, nhanSuId: string, tuNgay: string): Promise<void> {
  const { data: cur } = await supabase.from('phan_cong_ca').select('id').eq('thu', thu).eq('ca', ca).is('hieu_luc_den', null).maybeSingle()
  if (cur) await supabase.from('phan_cong_ca').update({ hieu_luc_den: congNgay(tuNgay, -1) }).eq('id', cur.id)
  const { error } = await supabase.from('phan_cong_ca').insert({ thu, ca, nhan_su_id: nhanSuId, hieu_luc_tu: tuNgay, hieu_luc_den: null })
  if (error) throw error
}
export async function unassignCa(thu: number, ca: CaTruc, tuNgay: string): Promise<void> {
  const { data: cur } = await supabase.from('phan_cong_ca').select('id').eq('thu', thu).eq('ca', ca).is('hieu_luc_den', null).maybeSingle()
  if (!cur) return
  const { error } = await supabase.from('phan_cong_ca').update({ hieu_luc_den: congNgay(tuNgay, -1) }).eq('id', cur.id)
  if (error) throw error
}
// Toàn bộ dòng phân công ca (KHÔNG lọc theo 1 ngày cố định — trả nguyên khoảng hiệu lực, resolve đúng
// người trực THEO NGÀY ở nơi gọi). `nhanSuId` lọc trước ở server khi chỉ cần của 1 người (getMyOpsTasks).
type PhanCongCaRaw = { thu: number; ca: CaTruc; nhan_su_id: string; hieu_luc_tu: string; hieu_luc_den: string | null }
async function listPhanCongCa(nhanSuId?: string): Promise<PhanCongCaRaw[]> {
  let q = supabase.from('phan_cong_ca').select('thu, ca, nhan_su_id, hieu_luc_tu, hieu_luc_den').limit(LIMIT)
  if (nhanSuId) q = q.eq('nhan_su_id', nhanSuId)
  const { data } = await q
  return (data ?? []) as any[]
}
// Người trực ca (thu, ca) vào 1 NGÀY cụ thể (resolve effective-date) — dùng cho prep/điểm danh.
function nguoiTrucCuaCa(rows: PhanCongCaRaw[], thu: number, ca: CaTruc, ngay: string): string | null {
  const r = rows.find((x) => x.thu === thu && x.ca === ca && x.hieu_luc_tu <= ngay && (!x.hieu_luc_den || x.hieu_luc_den >= ngay))
  return r?.nhan_su_id ?? null
}
// Điểm danh của TÔI trong khoảng ngày — LỌC theo ca đang trực (Thùy 07-19: "việc được phân công cho ops
// nào chỉ hiện cho ops đấy, hiện đang hiện chung cho tất cả ops" — bug nằm ở NhanSuHome.tsx gọi thẳng
// buoiAoCuaKhoang không lọc theo người). buoiAoCuaKhoang (gami.ts) trả TOÀN TRƯỜNG — lọc lại đúng
// membership ca, CÙNG logic getMyOpsTasks.
export async function myBuoiAoCuaKhoang(tu: string, den: string): Promise<(BuoiAo & { ngay: string })[]> {
  const prof = await getMyProfile()
  if (!prof) return []
  const myId = prof.nhanSu.id
  const myCa = await listPhanCongCa(myId)
  if (!myCa.length) return []
  const all = await buoiAoCuaKhoang(tu, den)
  return all.filter((ba) => {
    const ca = caOfGio(ba.slot.gio_bat_dau)
    return !!ca && nguoiTrucCuaCa(myCa, thuOf(ba.ngay), ca, ba.ngay) === myId
  })
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

// Task report/tan của TÔI trong khoảng ngày [tu, den] — pure-derive từ phan_cong_ca × TKB (thành viên
// suy theo NGÀY × CA của từng slot, KHÔNG map tĩnh tkb_id→người nữa), tra vh_ops_task xem đã đóng chưa.
export async function getMyOpsTasks(tu: string, den: string): Promise<OpsTask[]> {
  const prof = await getMyProfile()
  if (!prof) return []
  const myId = prof.nhanSu.id
  const myCa = await listPhanCongCa(myId)
  if (!myCa.length) return []
  const { data: tkb, error } = await supabase.from('thoi_khoa_bieu')
    .select('id, thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu, hieu_luc_den, lop:lop_id(ten_lop, ngay_khai_giang)').limit(LIMIT)
  if (error) throw error
  // ⚠ Fix 07-06 (Thùy báo lại): bản trước lọc `ngayReport >= tu` — SAI, chặn mất đúng ca "hôm nay = Thứ
  // 2 đầu tuần" (report của ca đó đến hạn TỐI QUA = Chủ nhật, thuộc TUẦN TRƯỚC nếu tính lịch, nhưng
  // vẫn phải hiện HÔM NAY vì còn nợ). Mở rộng khoảng đọc `vh_ops_task` thêm 1 ngày TRƯỚC `tu` để khớp.
  const tkbIds = (tkb ?? []).map((s: any) => s.id)
  const rangeStart = congNgay(tu, -1)
  const { data: doneRows } = tkbIds.length
    ? await supabase.from('vh_ops_task').select('*').in('tkb_id', tkbIds).gte('ngay', rangeStart).lte('ngay', den).limit(LIMIT)
    : { data: [] as any[] }
  const doneMap = new Map<string, any>()
  for (const r of (doneRows ?? []) as any[]) doneMap.set(`${r.tkb_id}|${r.ngay}|${r.tab}`, r)

  // Report hiển thị/đến hạn vào TỐI HÔM TRƯỚC ca học (KHÁC ngày diễn ra ca) → quét thêm 1 ngày SAU `den`
  // để không bỏ sót report của ca xảy ra NGAY SAU tuần đang xem (vd hôm nay = CN cuối tuần, ca Thứ 2
  // tuần sau vẫn phải hiện report TỐI NAY — bug Thùy báo 07-06: report cũ bị gắn nhầm vào ngày CA HỌC).
  const denExt = congNgay(den, 1)
  const out: OpsTask[] = []
  for (let d = tu; d <= denExt; d = congNgay(d, 1)) {
    const thu = thuOf(d)
    for (const s of (tkb ?? []) as any[]) {
      if (s.thu !== thu) continue
      if (!(s.hieu_luc_tu <= d && (!s.hieu_luc_den || s.hieu_luc_den >= d))) continue
      if (s.lop?.ngay_khai_giang && s.lop.ngay_khai_giang > d) continue
      const base = { tkbId: s.id, lopTen: s.lop?.ten_lop ?? '?', thu, gioBatDau: s.gio_bat_dau, gioKetThuc: s.gio_ket_thuc, phong: s.phong }
      // ⭐ Fix 07-19 (Thùy: "report trước buổi chỉ thực hiện vào ca tối, nhân sự trực ca tối report hết
      // toàn bộ") — sở hữu report giờ theo NGƯỜI TRỰC CA TỐI của TỐI HÔM TRƯỚC (ngayReport), KHÔNG theo
      // ca của chính lớp đó nữa (1 người tối gom report MỌI lớp hôm sau, bất kể lớp đó ca nào).
      const ngayReport = congNgay(d, -1)
      if (ngayReport <= den) {
        const thuReport = thuOf(ngayReport)
        if (nguoiTrucCuaCa(myCa, thuReport, 'toi', ngayReport) === myId) {
          const rp = doneMap.get(`${s.id}|${ngayReport}|report`)
          out.push({ ...base, ngay: ngayReport, tab: 'report', done: !!rp?.dong_at, doneAt: rp?.dong_at ?? null, anhUrl: rp?.anh_url ?? null, deadline: vnInstantLocal(ngayReport, REPORT_GIO_CO_DINH) })
        }
      }
      // Tan: sở hữu theo người trực CA CỦA CHÍNH LỚP trên NGÀY HỌC (giữ nguyên, khác report).
      if (d <= den) {
        const ca = caOfGio(s.gio_bat_dau)
        if (ca && nguoiTrucCuaCa(myCa, thu, ca, d) === myId) {
          const tn = doneMap.get(`${s.id}|${d}|tan`)
          out.push({ ...base, ngay: d, tab: 'tan', done: !!tn?.dong_at, doneAt: tn?.dong_at ?? null, anhUrl: tn?.anh_url ?? null, deadline: vnInstantLocal(d, hhmm(s.gio_ket_thuc)) + TAN_BIEN_PHUT * 60000 })
        }
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
// C — PREP PHÒNG / VỆ SINH LỚP (Story 3). "Lượt" = phòng × CA TRỰC (Thùy chốt
// 07-19: "vệ sinh lớp học theo ca, không theo ngày, trước MỖI CA 1 lần" — ĐỔI
// từ "T2-T6 1 lượt/ngày · T7-CN 2 lượt sáng/chiều" cũ sang ĐỒNG NHẤT 1 lượt/CA,
// MỌI ngày trong tuần. Dùng CHUNG CA_TRUC_DEF/caOfGio với phân công ops (§A).
// ⭐ Fix 07-19 lần 2 (Thùy: "mỗi ca dọn dẹp đều phải dọn 7 phòng chứ không phụ
// thuộc vào TKB") — TRƯỚC suy phòng-cần-dọn từ TKB (phòng nào có lớp mới có
// lượt) → phòng KHÔNG có lớp trong ca đó bị bỏ sót, trong khi phòng vẫn phải
// sẵn sàng bất kể có lớp hay không. Giờ DANH_SACH_PHONG CỐ ĐỊNH — mỗi (ngày,
// ca) LUÔN sinh đủ 7 lượt, không quét TKB nữa.
// ============================================================================
export const DANH_SACH_PHONG = ['101', '102', '201', '202', '301', '302', '303']
export type PrepLuotKey = CaTruc
export type PrepLuot = {
  phong: string; ngay: string; luot: PrepLuotKey; gioCaDau: string
  nhanSuId: string | null; nhanSuTen: string | null
}
// Suy TOÀN BỘ lượt-cần-prep trong 1 khoảng ngày — CỐ ĐỊNH 7 phòng × 3 ca × mỗi ngày, KHÔNG phụ thuộc TKB.
export async function luotPrepCuaKhoang(tu: string, den: string): Promise<PrepLuot[]> {
  const out: { phong: string; ngay: string; luot: PrepLuotKey }[] = []
  for (let d = tu; d <= den; d = congNgay(d, 1)) {
    for (const ca of CA_TRUC_LIST) {
      for (const phong of DANH_SACH_PHONG) out.push({ phong, ngay: d, luot: ca })
    }
  }
  // ⚠ Fix (Thùy báo lỗi 07-10, giữ nguyên khi đổi sang ca): tra người trực ĐÚNG THEO NGÀY CỦA TỪNG LƯỢT
  // (không đại diện cả tuần bằng 1 mốc) — nhân sự vừa được phân công GIỮA TUẦN vẫn khớp đúng.
  const pcRows = await listPhanCongCa()
  const nsIds = [...new Set(pcRows.map((r) => r.nhan_su_id))]
  const { data: nsAll } = nsIds.length ? await supabase.from('nhan_su').select('id, ho_ten').in('id', nsIds).limit(LIMIT) : { data: [] as any[] }
  const nsTenMap = new Map(((nsAll ?? []) as any[]).map((n) => [n.id, n.ho_ten]))
  return out.map((o): PrepLuot => {
    const nsId = nguoiTrucCuaCa(pcRows, thuOf(o.ngay), o.luot, o.ngay)
    return { phong: o.phong, ngay: o.ngay, luot: o.luot, gioCaDau: CA_TRUC_DEF[o.luot].from, nhanSuId: nsId, nhanSuTen: nsId ? nsTenMap.get(nsId) ?? null : null }
  })
}

// Cửa thời gian đóng task — CHỈNH ĐƯỢC ở đây (cùng quy ước NGUONG_DEADLINE của tuan.ts).
// Sáng/Chiều: cửa BÌNH THƯỜNG (đủ khoảng trống trước đó để dọn). Tối: cửa HẸP (Thùy 07-19 — Chiều
// 14h-18h kết thúc ĐÚNG lúc Tối 18h-21h30 bắt đầu, KHÔNG có khoảng trống giữa 2 ca → phải chuẩn bị gọn
// trong lúc ca Chiều còn diễn ra, giống quy tắc "cuối tuần liền kề" cũ, giờ áp riêng cho Tối).
export const NGUONG_PREP_CUA = { thuongTruocMax: 60, thuongTruocMin: 30, toiBien: 15 } // phút

export function prepCuaThoiGian(ngay: string, luot: PrepLuotKey, gioCaDau: string): { moTuLuc: number; dongLucMuon: number } {
  const caDauMs = vnInstantLocal(ngay, hhmm(gioCaDau))
  if (luot === 'toi') return { moTuLuc: caDauMs - NGUONG_PREP_CUA.toiBien * 60000, dongLucMuon: caDauMs }
  return { moTuLuc: caDauMs - NGUONG_PREP_CUA.thuongTruocMax * 60000, dongLucMuon: caDauMs - NGUONG_PREP_CUA.thuongTruocMin * 60000 }
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
