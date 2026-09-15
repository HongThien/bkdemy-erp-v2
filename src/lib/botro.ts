// Data-layer BỔ TRỢ BÙ (bù buổi nghỉ L1→L3). ADR: app.notion.com/p/389d4530bcdb81de9549fdb99ce1083e
// TÁI DÙNG buoi_hoc loai='bu' + buoi_hoc_hs.bu_cho_buoi_id (link per-HS về buổi mẹ). Funnel pure-derive.
import { supabase } from './supabase'
import { loadETForBuoi, listProblems } from './gami'

const LIMIT = 10000

// L1 — 1 lần-nghỉ = (HS × buổi-mẹ). id = buoi_hoc_hs.id ở buổi mẹ.
export type CanBuItem = { id: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; buoi_me_id: string; ngay: string; lop: string; mon: string; khoi: string | null }
// mon/lop_bu = LỚP GỐC (mẹ) của HS đang bù (buổi bù bản thân không có lớp — gom HS TỪ NHIỀU lớp/môn khác
// nhau, 07-07 phát hiện thiếu nhãn môn gây nhầm lẫn khi nhiều môn cùng chạy). bu_cho = "buổi gốc · ngày"
// (nội dung buổi học HS đang bù cho) — Thùy 07-07: PHẢI hiện, trước đây có data nhưng chưa render ra UI.
export type CaBoTroHS = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; diem_danh: string | null; lop_bu: string; mon: string; khoi: string | null; bu_cho: string }
// hs = HS CÒN nằm ở buổi bù này. hsVang = em đã tích vắng ⇒ lần nghỉ gốc đã quay về "Cần bù",
// em KHÔNG còn là việc của buổi này nữa (giữ lại để hiển thị vết, không tính vào sĩ số).
export type CaBoTro = { id: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; trang_thai: string; et_dong_at: string | null; danh_gia_xong_at: string | null; nguoi_day: string | null; nguoi_day_tg: string | null; gv_ten: string | null; ta_ten: string | null; hs: CaBoTroHS[]; hsVang: CaBoTroHS[] }

// ⭐ MỘT LẦN XẾP BÙ CHỈ "GIẢI QUYẾT" LẦN NGHỈ KHI NÓ THẬT SỰ DIỄN RA (sửa 12/08).
//
// Bug cũ: `handled` = tồn tại BẤT KỲ dòng buoi_hoc_hs nào có bu_cho_buoi_id = buổi mẹ.
// Không xét em đó có ĐẾN không, cũng không xét buổi bù còn sống hay ĐÃ HUỶ. Hệ quả: xếp
// bù xong là lần nghỉ biến mất khỏi hàng đợi VĨNH VIỄN, kể cả khi em vắng luôn buổi bù.
// Đo trên dữ liệu thật lúc sửa: **11 lượt vắng buổi bù + 6 lượt buổi bù bị huỷ = 17 lần
// nghỉ đã rơi khỏi hệ**, không ai xếp lại, không báo lỗi ở đâu cả (CEO: "ấn vắng ko thấy
// action gì"). Đúng lớp bug HANDOFF §"Bỏ qua âm thầm = bug sống lâu".
//
// Luật đúng: một dòng xếp bù chỉ tính là ĐÃ GIẢI QUYẾT khi
//   ① buổi bù CHƯA huỷ, VÀ ② em đó KHÔNG vắng ở chính buổi bù đó.
// Ngược lại ⇒ trả lần nghỉ về hàng đợi, kèm LÝ DO quay lại để người xếp biết đây là lần
// thứ mấy (khác hẳn nghỉ lần đầu — cùng một em trượt bù 2 lần là tín hiệu khác).
//
// ⚠ Không cần đổi schema: unique của buoi_hoc_hs là (buoi_hoc_id, hoc_sinh_id), KHÔNG phải
//   (hoc_sinh_id, bu_cho_buoi_id) ⇒ xếp lại vào buổi bù KHÁC là hợp lệ. DB đã có sẵn 2 ca
//   xếp 2 lần cho cùng buổi mẹ (ai đó làm tay) — luồng này vốn đã xảy ra ngoài đời.
export type LyDoQuayLai = 'vang_buoi_bu' | 'buoi_bu_huy'

// ⭐ ĐƯỜNG NGÀY của luật 48h (CEO chốt 12/08). Lúc bật luật có 126/141 lần nghỉ đã quá hạn
// — 89%. Cảnh báo mà đỏ hết thì không còn là cảnh báo, nên: lần nghỉ TỪ ngày này trở đi mới
// chịu hạn 48h; trước đó gom thành MỘT con số "tồn đọng trước khi có luật", xử dần.
// KHÔNG backdate, KHÔNG xoá — chỉ đánh dấu là chưa có luật (đúng khuôn đã dùng cho đánh giá).
// Đổi ngày này = đổi phạm vi nhắc; sửa ở ĐÚNG một chỗ.
export const NGAY_AP_HAN_48H = '2026-08-10'
export const HAN_XEP_BU_NGAY = 2 // 48h

export type LanNghi = CanBuItem & {
  soLanDaXep: number            // đã từng xếp bù mấy lần cho lần nghỉ này (0 = chưa lần nào)
  lyDoQuayLai: LyDoQuayLai | null // != null ⇒ đã xếp rồi mà trượt, KHÔNG phải nghỉ mới
  tuoiNgay: number
  quaHan: boolean               // chỉ đúng khi coLuat = true
  coLuat: boolean               // nghỉ từ NGAY_AP_HAN_48H trở đi mới chịu hạn
}

const ngayVN = (v: any): string =>
  typeof v === 'string' ? v.slice(0, 10) : new Date(v).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const lechNgay = (tu: string, den: string): number =>
  Math.round((Date.parse(den + 'T00:00:00Z') - Date.parse(tu + 'T00:00:00Z')) / 86400000)

// L1: vắng ở buổi thường, CHƯA xếp bù (hoặc đã xếp mà TRƯỢT) & CHƯA ghi không-bù.
export async function listCanBu(): Promise<CanBuItem[]> {
  return (await listLanNghiCanXep()).map(({ soLanDaXep, lyDoQuayLai, tuoiNgay, quaHan, coLuat, ...r }) => r)
}

export async function listLanNghiCanXep(): Promise<LanNghi[]> {
  const homNay = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
  const { data: vang } = await supabase.from('buoi_hoc_hs')
    .select('id, hoc_sinh_id, buoi_hoc_id, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), buoi:buoi_hoc_id(loai, trang_thai, ngay, lop:lop_id(ten_lop, mon, khoi))')
    .in('diem_danh', ['vang', 'vang_phep']).limit(LIMIT)
  const abs = (vang ?? []).filter((r: any) => r.buoi?.loai === 'thuong' && r.buoi?.trang_thai !== 'huy')

  // Mọi lần XẾP bù, kèm điểm danh ở buổi bù + trạng thái của chính buổi bù đó.
  // Embed đặt TÊN CỘT rõ ràng (`buoi:buoi_hoc_id`) — buoi_hoc_hs có 2 FK về buoi_hoc, để
  // PostgREST tự đoán là nhập nhằng rồi rỗng âm thầm (HANDOFF §"nhiều FK cùng đích").
  const { data: links } = await supabase.from('buoi_hoc_hs')
    .select('hoc_sinh_id, bu_cho_buoi_id, diem_danh, buoi:buoi_hoc_id(trang_thai)')
    .not('bu_cho_buoi_id', 'is', null).limit(LIMIT)

  const soLan = new Map<string, number>()          // đã xếp mấy lần
  const conHieuLuc = new Set<string>()             // lần xếp còn "giữ chỗ" được
  const lyDo = new Map<string, LyDoQuayLai>()      // vì sao phải xếp lại
  for (const l of (links ?? []) as any[]) {
    const k = `${l.hoc_sinh_id}|${l.bu_cho_buoi_id}`
    soLan.set(k, (soLan.get(k) ?? 0) + 1)
    if (l.buoi?.trang_thai === 'huy') { if (!conHieuLuc.has(k)) lyDo.set(k, 'buoi_bu_huy'); continue }
    if (l.diem_danh === 'vang' || l.diem_danh === 'vang_phep') { if (!conHieuLuc.has(k)) lyDo.set(k, 'vang_buoi_bu'); continue }
    // Chưa điểm danh (null) VẪN tính là còn hiệu lực — buổi bù chưa diễn ra hoặc chưa ai
    // đánh dấu; kéo về hàng đợi lúc này là đẻ ra lượt xếp trùng.
    conHieuLuc.add(k); lyDo.delete(k)
  }

  const { data: kb } = await supabase.from('bang_khong_bu').select('buoi_hoc_hs_id').limit(LIMIT)
  const decided = new Set((kb ?? []).map((k: any) => k.buoi_hoc_hs_id))

  return abs
    .filter((r: any) => !conHieuLuc.has(`${r.hoc_sinh_id}|${r.buoi_hoc_id}`) && !decided.has(r.id))
    .map((r: any) => {
      const k = `${r.hoc_sinh_id}|${r.buoi_hoc_id}`
      const ngay = ngayVN(r.buoi?.ngay)
      const tuoiNgay = lechNgay(ngay, homNay)
      const coLuat = ngay >= NGAY_AP_HAN_48H
      return {
        id: r.id, hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null,
        buoi_me_id: r.buoi_hoc_id, ngay, lop: r.buoi?.lop?.ten_lop ?? '?', mon: r.buoi?.lop?.mon ?? '', khoi: r.buoi?.lop?.khoi ?? null,
        soLanDaXep: soLan.get(k) ?? 0, lyDoQuayLai: lyDo.get(k) ?? null,
        tuoiNgay, coLuat, quaHan: coLuat && tuoiNgay > HAN_XEP_BU_NGAY,
      }
    })
    .sort((a, b) => b.tuoiNgay - a.tuoiNgay)
}

// ⭐ TÍCH VẮNG Ở BUỔI BÙ = EM RỜI BUỔI ĐÓ, KHÔNG PHẢI "vẫn ở đây nhưng vắng" (sửa 14/08).
//
// `listLanNghiCanXep` đã trả lần nghỉ về "Cần bù" từ 12/08, nhưng tab "Đã xếp" vẫn đếm và vẫn
// vẽ đúng em đó ⇒ cùng một HS hiện ở HAI chỗ, người xếp không biết tin chỗ nào (CEO 14/08).
// Nặng hơn: buổi bù 1 HS mà em vắng thì `coMat = 0`, nút "Xác nhận ET"/"Hoàn thành đánh giá"
// KHÔNG hiện ⇒ hai mốc không bao giờ đóng được ⇒ card nằm lì ở "Đã xếp" VĨNH VIỄN. Đo lúc sửa:
// 4/20 buổi ở tab này là loại kẹt đó (và cả 4 đều toàn-bộ-HS-vắng).
//
// Luật: HS vắng ⇒ ra khỏi `hs` (sĩ số + chip + bộ lọc đều theo `hs`), giữ ở `hsVang` để còn thấy vết.
// Buổi KHÔNG còn ai (`hs` rỗng) mà có người vắng ⇒ "đã trả về Cần bù": biến khỏi Đã xếp/Hoàn thành,
// gom vào `listCaBoTroTraVe()` — vẫn mở được để sửa nhầm (bấm lại "Có mặt") hoặc huỷ buổi cho sạch.
// KHÔNG xoá âm thầm — đó là điểm khác với buổi 0-HS-từ-đầu (chưa ai bị vắng): loại đó vẫn nằm
// trong `listCaBoTro` như cũ, chỉ không vẽ ra card (màn lọc `hs.some(...)`) — hành vi cũ, không đụng.
const laVang = (d: string | null) => d === 'vang' || d === 'vang_phep'

type CaBoTroFull = CaBoTro & { xong: boolean; daTraVe: boolean }
async function taiCaBoTro(): Promise<CaBoTroFull[]> {
  // Tên GV/TA embed thẳng — buoi_hoc có HAI FK về nhan_su nên PHẢI đặt tên cột (`gv:nguoi_day`),
  // để PostgREST tự đoán là nhập nhằng rồi rỗng âm thầm (HANDOFF §"nhiều FK cùng đích").
  const { data: buois } = await supabase.from('buoi_hoc')
    .select('id, ngay, gio_bat_dau, gio_ket_thuc, phong, trang_thai, et_dong_at, danh_gia_xong_at, nguoi_day, nguoi_day_tg, gv:nguoi_day(ho_ten), ta:nguoi_day_tg(ho_ten)')
    .eq('loai', 'bu').neq('trang_thai', 'huy').order('ngay', { ascending: false }).limit(LIMIT)
  if (!(buois ?? []).length) return []
  const ids = (buois ?? []).map((b: any) => b.id)
  const { data: hs } = await supabase.from('buoi_hoc_hs')
    .select('buoi_hoc_id, hoc_sinh_id, diem_danh, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), bu_cho:bu_cho_buoi_id(ngay, lop:lop_id(ten_lop, mon, khoi))')
    .in('buoi_hoc_id', ids).limit(LIMIT)
  const by: Record<string, any[]> = {}
  for (const r of hs ?? []) (by[(r as any).buoi_hoc_id] ??= []).push(r)
  return (buois ?? []).map((b: any) => {
    const ros: CaBoTroHS[] = (by[b.id] ?? []).map((r: any) => ({
      hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null,
      diem_danh: r.diem_danh, lop_bu: r.bu_cho?.lop?.ten_lop ?? '', mon: r.bu_cho?.lop?.mon ?? '', khoi: r.bu_cho?.lop?.khoi ?? null,
      bu_cho: r.bu_cho ? `${r.bu_cho.lop?.ten_lop ?? ''} · ${r.bu_cho.ngay}` : '',
    }))
    const hsVang = ros.filter((r) => laVang(r.diem_danh))
    const con = ros.filter((r) => !laVang(r.diem_danh))
    return {
      ...b, gv_ten: b.gv?.ho_ten ?? null, ta_ten: b.ta?.ho_ten ?? null,
      hs: con, hsVang, xong: !!b.et_dong_at && !!b.danh_gia_xong_at, daTraVe: !con.length && hsVang.length > 0,
    }
  })
}

// L2 (done=false) / L3 (done=true): ca bổ trợ (buổi bù) + danh sách HS còn ở buổi.
export async function listCaBoTro(done: boolean): Promise<CaBoTro[]> {
  return (await taiCaBoTro()).filter((c) => !c.daTraVe && (done ? c.xong : !c.xong))
}
// Buổi bù mà MỌI HS đã vắng — lần nghỉ của họ đã về "Cần bù", buổi này chỉ còn là vỏ cần dọn.
export async function listCaBoTroTraVe(): Promise<CaBoTro[]> {
  return (await taiCaBoTro()).filter((c) => c.daTraVe)
}

export async function listKhongBu(): Promise<{ id: string; absId: string; loai: string; ly_do: string | null; ho_ten: string; ma_hs: string | null; info: string }[]> {
  const { data } = await supabase.from('bang_khong_bu')
    .select('id, buoi_hoc_hs_id, loai, ly_do, abs:buoi_hoc_hs_id(hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), buoi:buoi_hoc_id(ngay, lop:lop_id(ten_lop, mon)))')
    .order('created_at', { ascending: false }).limit(LIMIT)
  return (data ?? []).map((r: any) => ({
    id: r.id, absId: r.buoi_hoc_hs_id, loai: r.loai, ly_do: r.ly_do,
    ho_ten: r.abs?.hoc_sinh?.ho_ten ?? '?', ma_hs: r.abs?.hoc_sinh?.ma_hs ?? null,
    info: r.abs?.buoi ? `${r.abs.buoi.lop?.ten_lop ?? ''} (${r.abs.buoi.lop?.mon ?? ''}) · ${r.abs.buoi.ngay}` : '',
  }))
}

export async function ghiKhongBu(absenceId: string, loai: 'khong_can_bu' | 'khong_xep_duoc', lyDo?: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('bang_khong_bu').upsert({ buoi_hoc_hs_id: absenceId, loai, ly_do: lyDo ?? null, actor: user?.id ?? null }, { onConflict: 'buoi_hoc_hs_id' })
  if (error) throw error
}
export async function xoaKhongBu(absenceId: string): Promise<void> {
  const { error } = await supabase.from('bang_khong_bu').delete().eq('buoi_hoc_hs_id', absenceId)
  if (error) throw error
}

// Tạo buổi bù MỚI (loai='bu', không lop_id; ngày+giờ+phòng+GV+TA).
export async function taoBuoiBu(input: { ngay: string; gio_bat_dau?: string | null; gio_ket_thuc?: string | null; phong?: string | null; nguoi_day?: string | null; nguoi_day_tg?: string | null }): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('buoi_hoc').insert({
    loai: 'bu', lop_id: null, ngay: input.ngay, gio_bat_dau: input.gio_bat_dau ?? null, gio_ket_thuc: input.gio_ket_thuc ?? null,
    phong: input.phong ?? null, nguoi_day: input.nguoi_day ?? null, nguoi_day_tg: input.nguoi_day_tg ?? null, trang_thai: 'mo', created_by: user?.id ?? null,
  }).select('id').single()
  if (error) throw error
  return (data as any).id
}
// Thêm các lần-nghỉ vào 1 buổi bù (set bu_cho_buoi_id = buổi mẹ của từng HS).
export async function themHSVaoBuoiBu(makeupId: string, items: { hoc_sinh_id: string; buoi_me_id: string }[]): Promise<void> {
  if (!items.length) return
  const { error } = await supabase.from('buoi_hoc_hs').insert(items.map((i) => ({ buoi_hoc_id: makeupId, hoc_sinh_id: i.hoc_sinh_id, bu_cho_buoi_id: i.buoi_me_id })))
  if (error) throw error
}
export const buoiBuSapToi = () => listCaBoTro(false) // cho "chọn buổi bù có sẵn"

// Thông tin per-HS (mã HS · lớp gốc+môn · nội dung buổi đang bù cho) của 1 buổi bù CỤ THỂ — dùng ở
// BuoiBuDetail (mở từ "Việc của tôi" chỉ có buoiId, KHÔNG có sẵn CaBoTro đầy đủ như màn Bổ trợ Bù).
export type BuoiBuHsInfo = { ma_hs: string | null; lop_bu: string; mon: string; bu_cho: string; buoi_me_id: string | null }
export async function getBuoiBuHsInfo(buoiId: string): Promise<Record<string, BuoiBuHsInfo>> {
  const { data } = await supabase.from('buoi_hoc_hs')
    .select('hoc_sinh_id, bu_cho_buoi_id, hoc_sinh:hoc_sinh_id(ma_hs), bu_cho:bu_cho_buoi_id(ngay, lop:lop_id(ten_lop, mon))')
    .eq('buoi_hoc_id', buoiId).limit(LIMIT)
  const out: Record<string, BuoiBuHsInfo> = {}
  for (const r of (data ?? []) as any[]) {
    out[r.hoc_sinh_id] = {
      ma_hs: r.hoc_sinh?.ma_hs ?? null, lop_bu: r.bu_cho?.lop?.ten_lop ?? '', mon: r.bu_cho?.lop?.mon ?? '',
      bu_cho: r.bu_cho ? `${r.bu_cho.lop?.ten_lop ?? ''} · ${r.bu_cho.ngay}` : '',
      buoi_me_id: r.bu_cho_buoi_id ?? null,
    }
  }
  return out
}

// ⭐ GIÁO TRÌNH · BTVN · ET CỦA BUỔI MẸ, ngay trong buổi bù (CEO 14/08: "để nhân sự khỏi lục kho tài liệu").
//
// Buổi bù gom HS TỪ NHIỀU lớp/ngày khác nhau ⇒ tài liệu là chuyện CỦA TỪNG EM, không phải của buổi bù:
// mỗi em học lại đúng nội dung buổi em đã nghỉ. Vì vậy tra theo `bu_cho_buoi_id` của từng dòng roster.
//
// ⚠ Tài liệu vận hành KHÔNG có FK về `buoi_hoc` — nó bám (lop_id, ngay) (xem `tailieu.ts`, cùng đường
// mà loadETForBuoi/getBTVNByBuoi/getGiaoTrinhBuoiDoc đang đi). PostgREST không lọc được theo CẶP cột,
// nên lấy rộng theo 2 tập rồi ghép đúng cặp ở JS — lọc thiếu một vế sẽ kéo nhầm tài liệu lớp khác
// cùng ngày, mà sai kiểu đó trông vẫn "có tài liệu" nên rất khó phát hiện.
export type DocBuoi = { id: string; loai: 'giao_trinh_buoi' | 'btvn' | 'et'; ten: string; file_url: string | null }
const LOAI_DOC_BUOI: DocBuoi['loai'][] = ['giao_trinh_buoi', 'btvn', 'et'] // thứ tự hiển thị = thứ tự dùng
export async function taiLieuCuaBuoiMe(buoiMeIds: string[]): Promise<Record<string, DocBuoi[]>> {
  const ids = [...new Set(buoiMeIds.filter(Boolean))]
  if (!ids.length) return {}
  const { data: bs } = await supabase.from('buoi_hoc').select('id, lop_id, ngay').in('id', ids).limit(LIMIT)
  const buois = ((bs ?? []) as any[]).filter((b) => b.lop_id && b.ngay)
  if (!buois.length) return {}
  // `order created_at desc` + giữ bản ĐẦU cho mỗi (lớp|ngày|loại): unique doc vận hành có thể còn sót
  // bản trùng từ thời trước, và cả hệ đã thống nhất "lỡ trùng thì lấy bản mới nhất, đừng throw cả màn"
  // (getBTVNByBuoi/getGiaoTrinhBuoiDoc, tailieu.ts).
  const { data: tls } = await supabase.from('tai_lieu').select('id, loai, ten, file_url, lop_id, ngay')
    .in('loai', LOAI_DOC_BUOI).in('lop_id', [...new Set(buois.map((b) => b.lop_id))])
    .in('ngay', [...new Set(buois.map((b) => ngayVN(b.ngay)))])
    .order('created_at', { ascending: false }).limit(LIMIT)
  const theoCap = new Map<string, DocBuoi[]>()
  const daCo = new Set<string>()
  for (const t of (tls ?? []) as any[]) {
    const cap = `${t.lop_id}|${ngayVN(t.ngay)}`
    if (daCo.has(`${cap}|${t.loai}`)) continue
    daCo.add(`${cap}|${t.loai}`)
    const ds = theoCap.get(cap) ?? []
    ds.push({ id: t.id, loai: t.loai, ten: t.ten, file_url: t.file_url ?? null })
    theoCap.set(cap, ds)
  }
  const out: Record<string, DocBuoi[]> = {}
  for (const b of buois) {
    const ds = theoCap.get(`${b.lop_id}|${ngayVN(b.ngay)}`) ?? []
    out[b.id] = [...ds].sort((x, y) => LOAI_DOC_BUOI.indexOf(x.loai) - LOAI_DOC_BUOI.indexOf(y.loai))
  }
  return out
}

// Gợi ý mặc định cho buổi bù từ LỚP MẸ của HS nghỉ: TA (người bổ trợ mặc định) + GV + giờ + phòng.
export async function goiYBuoiBu(buoiMeId: string): Promise<{ gv_id: string | null; ta_id: string | null; gio: string | null; phong: string | null }> {
  const { data: b } = await supabase.from('buoi_hoc').select('lop_id, gio_bat_dau, phong').eq('id', buoiMeId).single()
  const lopId = (b as any)?.lop_id
  let gv_id: string | null = null, ta_id: string | null = null
  if (lopId) {
    const { data: pc } = await supabase.from('phan_cong_lop').select('nhan_su_id, vai_tro, la_chinh').eq('lop_id', lopId).limit(LIMIT)
    const pick = (vai: string) => (pc ?? []).find((p: any) => p.vai_tro === vai && p.la_chinh)?.nhan_su_id ?? (pc ?? []).find((p: any) => p.vai_tro === vai)?.nhan_su_id ?? null
    gv_id = pick('gv'); ta_id = pick('tg')
  }
  return { gv_id, ta_id, gio: ((b as any)?.gio_bat_dau ?? null) as string | null, phong: ((b as any)?.phong ?? null) as string | null }
}

// Seed ET buổi bù = ET buổi MẸ của TỪNG HS (per-HS, gắn hoc_sinh_id). Idempotent (chỉ seed khi chưa có problem ET).
export async function ensureBuoiBuETProblems(makeupId: string): Promise<void> {
  const cur = await listProblems(makeupId, 'et')
  if (cur.length) return
  const { data: ros } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id, bu_cho_buoi_id').eq('buoi_hoc_id', makeupId).not('bu_cho_buoi_id', 'is', null).limit(LIMIT)
  let no = 0
  const rows: any[] = []
  for (const r of ros ?? []) {
    const { caus } = await loadETForBuoi((r as any).bu_cho_buoi_id) // ET buổi mẹ
    for (const c of caus) { no++; rows.push({ buoi_hoc_id: makeupId, phase: 'et', problem_no: no, ma_dang: (c as any).dang_chinh ?? null, hoc_sinh_id: (r as any).hoc_sinh_id }) }
  }
  if (rows.length) { const { error } = await supabase.from('gami_session_problems').upsert(rows, { onConflict: 'buoi_hoc_id,phase,problem_no', ignoreDuplicates: true }); if (error) throw error }
}

export async function demTabBoTro(): Promise<Record<string, number>> {
  const [l1, cas] = await Promise.all([listCanBu(), taiCaBoTro()])
  const { count } = await supabase.from('bang_khong_bu').select('id', { count: 'exact', head: true })
  const song = cas.filter((c) => !c.daTraVe)
  return { canbu: l1.length, daxep: song.filter((c) => !c.xong).length, xong: song.filter((c) => c.xong).length, khongbu: count ?? 0 }
}

// ════════════════════════════════════════════════════════════════════════════
// ẢNH CHỤP HÀNG NGÀY — 5 thứ CEO cần nhìn mỗi sáng (chốt 12/08)
//
// Đây là tầng ĐỌC thuần: chỉ đọc + đếm, không đổi state, không gọi model. Trợ lý ăn
// đầu ra này. Số ở đây phải khớp query thô — sai đọc thì mọi thứ phía trên vô nghĩa.
//
// ⚠ Cái BẪY của mục ①: "buổi bù đã qua mà chưa đóng ET/đánh giá" KHÔNG đồng nghĩa với
//   "chưa fill đủ". Đo thật lúc dựng: 7 buổi đã qua chưa đóng, nhưng 3 trong đó TOÀN HS
//   VẮNG hoặc 0 HS — không có gì để chấm, đóng cũng không được (nút "Xác nhận ET" chỉ
//   hiện khi có HS có mặt). Nhắc nguyên 7 là sai 3 lần ngay ngày đầu, và người sẽ học
//   được rằng danh sách này không đáng tin. ⇒ Lọc `coMat > 0`; buổi toàn vắng thuộc mục
//   ③ (phải xếp lại), buổi 0 HS là rác cần dọn — hai chuyện khác hẳn nhau.
// ════════════════════════════════════════════════════════════════════════════
export type BuoiThieuFill = {
  buoiId: string; ngay: string; gio: string | null; phong: string | null; tuoiNgay: number
  soHS: number; coMat: number; chuaDiemDanh: number
  thieu: string[]        // liệt kê ĐÍCH DANH cái còn thiếu, không phải cờ "chưa xong"
  hs: string[]           // tên HS có mặt mà hồ sơ còn khuyết
}
export type BuoiSapToi = {
  buoiId: string; ngay: string; gio: string | null; phong: string | null; conMayNgay: number
  hs: { ho_ten: string; ma_hs: string | null; lop_bu: string; mon: string; bu_cho: string; diem_danh: string | null }[]
}
export type AnhChupBu = {
  ngay: string
  chuaFillDu: BuoiThieuFill[]
  sapToi: BuoiSapToi[]
  phaiXepLai: LanNghi[]
  quaHan: LanNghi[]
  canXep: { tong: number; trongHan: number; quaHan: number; tonDongCu: number; cuNhat: string | null }
  khongXepDuoc: number
  buoiRong: number
  // ⭐ "Đóng khống" KHÔNG phải một loại. Đo 14/08 tách ra hai thứ NGƯỢC nhau:
  //   khongDe = buổi mẹ chưa soạn ET ⇒ không có gì để chấm ⇒ BÌNH THƯỜNG, không phải việc.
  //   coDe    = có đề hẳn hoi mà 0 dòng chấm ⇒ đóng cho xong ⇒ dữ liệu đo mất vĩnh viễn.
  // Và quan trọng nhất: `ganDay` — chuyện này đã TỰ DỪNG. Gộp một số rồi nhắc mỗi ngày là
  // nhắc một việc không còn xảy ra, đúng thứ làm người ta học cách phớt lờ trợ lý.
  dongKhong: { coDe: number; khongDe: number; ganDay: number; moiNhat: string | null }
  phamVi: string
  khongBiet: string[]
}

export async function anhChupBoTroBu(): Promise<AnhChupBu> {
  const homNay = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
  const [lanNghi, { data: buois }] = await Promise.all([
    listLanNghiCanXep(),
    supabase.from('buoi_hoc')
      .select('id, ngay, gio_bat_dau, phong, et_dong_at, danh_gia_xong_at')
      .eq('loai', 'bu').neq('trang_thai', 'huy').order('ngay').limit(LIMIT),
  ])
  const ds = ((buois ?? []) as any[]).map((b) => ({ ...b, ngay: ngayVN(b.ngay) }))
  const ids = ds.map((b) => b.id)

  // Roster + hồ sơ đã fill, lấy 1 lượt cho MỌI buổi bù rồi ghép ở JS (tránh N+1).
  const [ros, gr, dg, dgd, de] = ids.length ? await Promise.all([
    supabase.from('buoi_hoc_hs')
      .select('buoi_hoc_id, hoc_sinh_id, diem_danh, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), bu_cho:bu_cho_buoi_id(ngay, lop:lop_id(ten_lop, mon))')
      .in('buoi_hoc_id', ids).limit(LIMIT),
    supabase.from('gami_grades').select('buoi_hoc_id, hoc_sinh_id').in('buoi_hoc_id', ids).limit(LIMIT),
    supabase.from('buoi_danh_gia').select('buoi_hoc_id, hoc_sinh_id, nhan_xet').in('buoi_hoc_id', ids).limit(LIMIT),
    supabase.from('buoi_danh_gia_dang').select('buoi_hoc_id, hoc_sinh_id').in('buoi_hoc_id', ids).limit(LIMIT),
    // Đề ET seed cho TỪNG HS (ensureBuoiBuETProblems). Không có dòng nào ⇒ buổi mẹ của em
    // đó không có ET ⇒ khâu chấm ET KHÔNG áp dụng, đừng đòi.
    supabase.from('gami_session_problems').select('buoi_hoc_id, hoc_sinh_id').eq('phase', 'et').in('buoi_hoc_id', ids).limit(LIMIT),
  ]) : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }] as any

  const theoBuoi = new Map<string, any[]>()
  for (const r of (ros.data ?? []) as any[]) { const a = theoBuoi.get(r.buoi_hoc_id) ?? []; a.push(r); theoBuoi.set(r.buoi_hoc_id, a) }
  const key = (b: string, h: string) => `${b}|${h}`
  const coChamET = new Set((gr.data ?? []).map((r: any) => key(r.buoi_hoc_id, r.hoc_sinh_id)))
  const coDangDG = new Set((dgd.data ?? []).map((r: any) => key(r.buoi_hoc_id, r.hoc_sinh_id)))
  const coNhanXet = new Set((dg.data ?? []).filter((r: any) => (r.nhan_xet ?? '').trim()).map((r: any) => key(r.buoi_hoc_id, r.hoc_sinh_id)))
  const coDeET = new Set((de.data ?? []).filter((r: any) => r.hoc_sinh_id).map((r: any) => key(r.buoi_hoc_id, r.hoc_sinh_id)))

  const chuaFillDu: BuoiThieuFill[] = []
  const sapToi: BuoiSapToi[] = []
  let buoiRong = 0
  // Cửa sổ "CÒN đang xảy ra" = 14 ngày.
  // ⚠ Đặt 21 ngày trước, và nó nói dối ngay lần chạy đầu: ca cuối cùng là 26/07, cách hôm nay
  //   19 ngày ⇒ vẫn lọt cửa sổ ⇒ màn hình báo "7 buổi trong 21 ngày qua" như thể chuyện đang
  //   diễn ra, trong khi dữ liệu theo tuần nói ngược lại: tuần 20/07 hở 20/34 buổi, tuần 27/07
  //   còn 1/23, rồi hai tuần gần nhất 24/24 buổi ĐỀU có chấm. Tức nó đã dứt.
  //   14 ngày = đúng khoảng đã có bằng chứng sạch, không phải con số vặn cho vừa ý.
  const mocGanDay = new Date(Date.parse(homNay + 'T00:00:00Z') - 14 * 86400000).toISOString().slice(0, 10)
  let dkCoDe = 0, dkKhongDe = 0, dkGanDay = 0
  let dkMoiNhat: string | null = null

  for (const b of ds) {
    const hs = theoBuoi.get(b.id) ?? []
    if (b.ngay >= homNay) {
      sapToi.push({
        buoiId: b.id, ngay: b.ngay, gio: b.gio_bat_dau?.slice(0, 5) ?? null, phong: b.phong,
        conMayNgay: lechNgay(homNay, b.ngay),
        hs: hs.map((r: any) => ({
          ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null,
          lop_bu: r.bu_cho?.lop?.ten_lop ?? '', mon: r.bu_cho?.lop?.mon ?? '',
          bu_cho: r.bu_cho ? `${r.bu_cho.lop?.ten_lop ?? ''} · ${ngayVN(r.bu_cho.ngay).slice(8)}/${ngayVN(r.bu_cho.ngay).slice(5, 7)}` : '', diem_danh: r.diem_danh,
        })),
      })
      continue
    }
    // ── buổi ĐÃ QUA ──
    if (!hs.length) { buoiRong++; continue }                  // buổi rỗng = rác, không phải việc
    const coMat = hs.filter((r: any) => r.diem_danh === 'co_mat')
    const chuaDD = hs.filter((r: any) => r.diem_danh == null)
    // Toàn vắng ⇒ không có gì để fill; đó là ca "phải xếp lại" (mục ③), không phải thiếu hồ sơ.
    if (!coMat.length) continue

    // ⭐ CỔNG ĐẦU TIÊN = hai mốc NGƯỜI TỰ CHỐT (`et_dong_at` / `danh_gia_xong_at`).
    //   Buổi đã chốt cả hai ⇒ người phụ trách đã tuyên bố xong, KHÔNG lôi ra nhắc nữa.
    //   (Bản đầu bỏ cổng này, chỉ soi per-HS ⇒ ra **105/151 buổi** — gồm cả buổi đóng đủ,
    //   vì HS không có dòng chấm ET. Mà buổi mẹ không có ET thì lấy gì mà chấm: đó là
    //   "KHÔNG ÁP DỤNG", không phải "chưa làm". Đúng cái bẫy ghi ở đầu mục này, tự dẫm.)
    if (b.et_dong_at && b.danh_gia_xong_at) {
      // Vẫn đếm riêng ca "chốt mà không có lấy một dòng chấm nào" — tín hiệu chất lượng
      // khác hẳn, chỉ nên là MỘT CON SỐ, không phải danh sách 98 dòng.
      const coCham = coMat.some((r: any) => coChamET.has(key(b.id, r.hoc_sinh_id)) || coDangDG.has(key(b.id, r.hoc_sinh_id)))
      if (!coCham) {
        // Có đề ET seed cho ít nhất 1 em có mặt ⇒ đã có thứ để chấm mà không ai chấm.
        if (coMat.some((r: any) => coDeET.has(key(b.id, r.hoc_sinh_id)))) {
          dkCoDe++
          if (b.ngay > (dkMoiNhat ?? '')) dkMoiNhat = b.ngay
          if (b.ngay >= mocGanDay) dkGanDay++
        } else dkKhongDe++
      }
      continue
    }

    const thieu: string[] = []
    if (chuaDD.length) thieu.push(`${chuaDD.length} HS chưa điểm danh`)
    // Chỉ soi ET/đánh-giá-dạng khi buổi THẬT SỰ có đề ET cho em đó (seed từ buổi mẹ).
    // Không có đề ⇒ khâu không áp dụng ⇒ im, đừng đòi.
    const coDe = (h: string) => coDeET.has(key(b.id, h))
    const koET = coMat.filter((r: any) => coDe(r.hoc_sinh_id) && !coChamET.has(key(b.id, r.hoc_sinh_id)))
    const koDG = coMat.filter((r: any) => coDe(r.hoc_sinh_id) && !coDangDG.has(key(b.id, r.hoc_sinh_id)))
    const koNX = coMat.filter((r: any) => !coNhanXet.has(key(b.id, r.hoc_sinh_id)))
    if (koET.length) thieu.push(`${koET.length} HS chưa chấm ET`)
    if (koDG.length) thieu.push(`${koDG.length} HS chưa đánh giá dạng`)
    if (koNX.length) thieu.push(`${koNX.length} HS chưa có nhận xét`)
    if (!b.et_dong_at) thieu.push('chưa xác nhận ET')
    if (!b.danh_gia_xong_at) thieu.push('chưa hoàn thành đánh giá')
    if (!thieu.length) continue
    chuaFillDu.push({
      buoiId: b.id, ngay: b.ngay, gio: b.gio_bat_dau?.slice(0, 5) ?? null, phong: b.phong,
      tuoiNgay: lechNgay(b.ngay, homNay), soHS: hs.length, coMat: coMat.length, chuaDiemDanh: chuaDD.length,
      thieu, hs: coMat.map((r: any) => r.hoc_sinh?.ho_ten ?? '?'),
    })
  }
  chuaFillDu.sort((a, b) => b.tuoiNgay - a.tuoiNgay)
  sapToi.sort((a, b) => a.ngay.localeCompare(b.ngay) || (a.gio ?? '').localeCompare(b.gio ?? ''))

  const phaiXepLai = lanNghi.filter((l) => l.lyDoQuayLai)
  const conLai = lanNghi.filter((l) => !l.lyDoQuayLai)   // chưa từng xếp — tránh đếm 2 lần với mục ③
  const { count: koXep } = await supabase.from('bang_khong_bu').select('id', { count: 'exact', head: true }).eq('loai', 'khong_xep_duoc')

  return {
    ngay: homNay,
    chuaFillDu, sapToi, phaiXepLai,
    quaHan: conLai.filter((l) => l.quaHan),
    canXep: {
      tong: conLai.length,
      trongHan: conLai.filter((l) => l.coLuat && !l.quaHan).length,
      quaHan: conLai.filter((l) => l.quaHan).length,
      tonDongCu: conLai.filter((l) => !l.coLuat).length,
      cuNhat: conLai.length ? conLai[0].ngay : null,   // đã sort tuổi GIẢM dần ⇒ [0] = cũ nhất
    },
    khongXepDuoc: koXep ?? 0,
    buoiRong,
    dongKhong: { coDe: dkCoDe, khongDe: dkKhongDe, ganDay: dkGanDay, moiNhat: dkMoiNhat },
    phamVi: `Toàn bộ buổi bù chưa huỷ + mọi lần nghỉ chưa xử lý, tính đến ${homNay}. `
      + `Hạn xếp bù ${HAN_XEP_BU_NGAY * 24}h chỉ áp cho lần nghỉ TỪ ${NGAY_AP_HAN_48H} trở đi; `
      + `trước đó gom vào "tồn đọng cũ" (có luật muộn, không phải người dùng trễ).`,
    khongBiet: [
      'Hệ không ghi vì sao HS vắng buổi bù — không phân biệt được em báo trước hay tự nghỉ.',
      'Không có chỗ ghi "đã xác nhận lịch buổi bù", nên buổi sắp tới chỉ liệt kê để nhìn, không đánh dấu được đã xem.',
      // CEO 12/08 làm rõ: "không xếp được" = gặp vấn đề về LỊCH và ko xếp LUÔN.
      // Tức đây là trạng thái KẾT THÚC do người quyết, KHÔNG phải việc đang treo.
      // ⇒ cố ý không nhắc lại, và cũng không đếm vào hàng đợi. Nêu ra chỉ để biết quy mô.
      `${koXep ?? 0} ca "không xếp được" (vướng lịch, đã chốt thôi không xếp) — cố ý nằm ngoài mọi mục ở đây.`,
    ],
  }
}
