// ============================================================================
// troly.ts — TẦNG ĐỌC của Trợ lý AI. Pilot: chuỗi BỔ TRỢ ĐUỔI.
//
// VÌ SAO mảng này được chọn làm pilot (audit 12/08, xem DEVLOG):
//   Đây là chỗ DUY NHẤT trong hệ mà `must-exist` đã nằm sẵn trong dữ liệu. Một dòng
//   `bo_tro_duoi` trạng thái 'can_duoi' là lời tuyên bố tường minh của một CON NGƯỜI
//   rằng em này cần học đuổi — không suy diễn, không quy ước ngầm, không phụ thuộc
//   "lớp này có làm ET không". Mọi mảng khác đều thiếu vế must-exist:
//     · `viec` (học liệu): 15 dòng, cả 15 đứng ở 'moi_giao' — chưa từng chạy hết 1 vòng đời.
//     · `vh_ops_task`: dòng chỉ sinh ra KHI việc đã xong ⇒ không có khái niệm "đang chờ".
//     · vận hành sau buổi: đánh giá KHÔNG bắt buộc (CEO 12/08), ET/BTVN áp dụng theo LỚP
//       mà chưa chỗ nào ghi lớp nào cần ⇒ `*_dong_at` null là "chưa làm" HAY "không cần"
//       thì không phân biệt được. Quay lại khi có cờ theo lớp.
//
// RANH GIỚI (doc §4): file này CHỈ ĐỌC VÀ ĐẾM. Không xếp ưu tiên, không diễn đạt,
//   không gọi model. Số ở đây phải khớp 100% với query thô — đó là tiêu chí "sai đọc = 0%".
//   Phần phán đoán/xếp thứ tự là việc của model, ăn đầu ra của file này.
//
// KHÔNG QUERY LẠI: tái dùng `listDotDuoi` của botro_duoi.ts. Viết một bản đọc thứ hai
//   cho cùng khái niệm = hai nguồn sự thật rồi lệch nhau, và người dùng sẽ thấy trợ lý
//   nói khác màn hình. (Đã suýt dính: bản nháp đầu tự tính "task ma" từ `bai_test` —
//   sai hoàn toàn vì đó là luồng test ONLINE, xem DEVLOG 12/08.)
// ============================================================================
import { listDotDuoi, listDotChoDuyetDuoi, type DotDuoi } from './botro_duoi'
import { getMyTasks, buoiAoCuaNgay, diemDanhTienDo, TASKS_BY_VAI, type VaiViec } from './gami'
import { getMyProfile, getMyScope } from './nhansu'
import { myBuoiAoCuaKhoang, getMyOpsTasks, getMyPrepTasks, OPS_TASK_LABEL } from './opsvanhanh'
import { listCanScanDaCham } from './detest'
import { listViecCuaToi, listViecToiGiao, type ViecFull, type TrangThaiViec } from './giaoviec'
import { anhChupBoTroBu, NGAY_AP_HAN_48H, type AnhChupBu } from './botro'
import { ngayCuaTs } from './tuan'
import { supabase } from './supabase'
import { todayVN, soNgayLech } from './giaoviec-config'

// ── NGƯỠNG: rút từ hành vi THẬT, không bịa ───────────────────────────────────
// Ngưỡng "bao nhiêu ngày là bất thường" KHÔNG được đặt tay. Đo phân phối thời gian
// của các đợt ĐÃ hoàn thành rồi so — ngưỡng rút từ hành vi thật thì cãi lại được,
// ngưỡng bịa thì không.
//
// ⚠ THIÊN LỆCH KẺ SỐNG SÓT (survivorship bias) — phải biết khi đọc mấy số này:
//   cohort "đã hoàn thành" thiên về ca DỄ (ca khó còn đang mở, chưa vào mẫu). Nên
//   p75/p90 là CẬN DƯỚI của "bình thường", không phải chân lý. Ngược lại `toiDa`
//   (lâu nhất từng hoàn thành) thì vững: vượt qua nó nghĩa là chưa đợt nào từng
//   mất ngần ấy thời gian mà vẫn về đích — kết luận này không cần giả định gì thêm.
export type Nguong = {
  soCaMau: number   // bao nhiêu đợt đã hoàn thành được dùng để rút ngưỡng
  p50: number; p75: number; p90: number
  toiDa: number     // đợt lâu nhất TỪNG hoàn thành
  duTinCay: boolean // mẫu quá nhỏ thì đừng kết luận mạnh
}

// timestamptz → 'YYYY-MM-DD' giờ VN (CLAUDE §2: KHÔNG toISOString cho ngày local).
const ngayVN = (ts: string): string =>
  new Date(ts).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })

// Khớp ĐÚNG `percentile_disc` của Postgres: giá trị NHỎ NHẤT mà tỉ lệ tích luỹ ≥ p.
// Phải khớp, vì ngưỡng công bố cho người dùng được kiểm chứng bằng query thô — hai công
// thức percentile lệch nhau một bậc là "sai đọc", đúng thứ §9 bắt phải bằng 0.
const percentile = (sorted: number[], p: number): number =>
  sorted.length ? sorted[Math.max(0, Math.ceil(p * sorted.length) - 1)] : 0

export async function nguongTuCohort(): Promise<Nguong> {
  const xong = await listDotDuoi(true)
  const ngay = xong
    .filter((d) => d.created_at && d.hoan_thanh_at)
    .map((d) => soNgayLech(ngayVN(d.created_at), ngayVN(d.hoan_thanh_at!)))
    .filter((n) => n >= 0)
    .sort((a, b) => a - b)
  return {
    soCaMau: ngay.length,
    p50: percentile(ngay, 0.5), p75: percentile(ngay, 0.75), p90: percentile(ngay, 0.9),
    toiDa: ngay.length ? ngay[ngay.length - 1] : 0,
    duTinCay: ngay.length >= 20,
  }
}

// ── TRẠM KẸT: đợt đang đứng ở đâu trong chuỗi ────────────────────────────────
// Chuỗi thật (đọc từ botro_duoi.ts + đo 34 đợt đã hoàn thành):
//   ① mở đợt → ② chốt kế hoạch (so_buoi_du_kien + scope dạng) → ③ Ops xếp buổi
//   → ④ HS học đủ N buổi CÓ MẶT → ⑤ GV bấm Hoàn thành (hệ đề xuất, không đóng câm)
//
// ⚠ `so_dang = 0` KHÔNG phải dấu hiệu kẹt: 29/34 đợt đã hoàn thành cũng có 0 dạng.
//   Bước gán dạng trên thực tế là TUỲ CHỌN. (Bản nháp đầu đọc nhầm chỗ này.)
//   Dấu kẹt thật ở bước ② là `so_buoi_du_kien = NULL` — botro_duoi.ts ghi rõ
//   "NULL = chưa chốt kế hoạch, UI bắt chốt trước khi xếp".
export type TramKet =
  | 'chua_chot_ke_hoach'   // ② chưa ai chốt số buổi → không xếp lịch được
  | 'chua_xep_du_buoi'     // ③ kế hoạch có rồi, suất xếp chưa đủ
  | 'dang_hoc'             // ④ đã xếp đủ, HS đang học — không phải việc của ai
  | 'du_buoi_cho_dong'     // ⑤ đủ buổi rồi, chỉ còn bấm Hoàn thành

export type MucCanhBao = 'binh_thuong' | 'cham' | 'rat_cham' | 'chua_tung_thay'

export type CaTreo = {
  caseId: string; ho_ten: string; ma_hs: string | null; lop: string; mon: string
  tuoiNgay: number
  tramKet: TramKet
  muc: MucCanhBao
  choKhau: string          // mô tả người-đọc-hiểu về khâu đang chặn
  soBuoiDuKien: number | null; daXep: number; daHoc: number
  soDang: number; daDuyetDang: boolean
  khongBiet: string[]      // §4: cái hệ KHÔNG biết, khai thẳng — cấm để model tự suy
}

function tramCua(d: DotDuoi): TramKet {
  if (d.so_buoi_du_kien == null) return 'chua_chot_ke_hoach'
  if (d.daHoc >= d.so_buoi_du_kien) return 'du_buoi_cho_dong'
  if (d.daXep < d.so_buoi_du_kien) return 'chua_xep_du_buoi'
  return 'dang_hoc'
}

const MO_TA_TRAM: Record<TramKet, string> = {
  chua_chot_ke_hoach: 'Chưa ai chốt kế hoạch (số buổi) — chưa xếp lịch được',
  chua_xep_du_buoi: 'Kế hoạch đã có nhưng chưa xếp đủ suất',
  dang_hoc: 'Đã xếp đủ, HS đang học',
  du_buoi_cho_dong: 'Đã học đủ số buổi — chỉ còn bấm Hoàn thành',
}

function mucCua(tuoi: number, n: Nguong): MucCanhBao {
  if (n.toiDa && tuoi > n.toiDa) return 'chua_tung_thay'
  if (n.p90 && tuoi > n.p90) return 'rat_cham'
  if (n.p75 && tuoi > n.p75) return 'cham'
  return 'binh_thuong'
}

// Cái hệ KHÔNG biết về đợt này. Doc §4: "thiếu dấu vết thì AI phải khai là không biết".
// Trả về danh sách để đưa NGUYÊN VĂN vào payload — model không được tự lấp.
function khongBietCua(d: DotDuoi, tram: TramKet): string[] {
  const ra: string[] = []
  // Hệ KHÔNG lưu ai chịu trách nhiệm chốt kế hoạch / xếp buổi cho từng đợt —
  // `bo_tro_duoi` không có cột owner. Chỉ suy được theo VAI, không ra tên người.
  if (tram === 'chua_chot_ke_hoach') ra.push('Không có dữ liệu ai chịu trách nhiệm chốt kế hoạch cho đợt này (bảng không lưu owner).')
  if (tram === 'chua_xep_du_buoi') ra.push('Không có dữ liệu ai chịu trách nhiệm xếp buổi cho đợt này (bảng không lưu owner).')
  if (!d.ly_do) ra.push('Không ghi lý do vì sao em này cần học đuổi.')
  if (!d.lop_id) ra.push('Đợt không gắn lớp — không suy được môn/khối.')
  return ra
}

// ── ĐẦU RA CHÍNH ─────────────────────────────────────────────────────────────
// MỌI đợt đang mở, kèm tuổi + trạm kẹt + mức. KHÔNG lọc ở đây: việc quyết định
// nêu hay dìm là của tầng trên, và tầng trên phải GIẢI TRÌNH mọi dòng nhận được
// (§9 "bỏ sót") — lọc sớm ở đây thì bỏ sót thành vô hình, không đếm được.
export type AnhChupDuoi = {
  ngayChup: string
  nguong: Nguong
  tongDangMo: number
  ca: CaTreo[]            // sort: nặng trước, cùng mức thì cũ trước
  phamViDaQuet: string    // §6: luôn kèm "đã quét cái gì" — cắt mà không nói = đọc thành toàn bộ
}

export async function anhChupChuoiDuoi(): Promise<AnhChupDuoi> {
  const [dangMo, nguong] = await Promise.all([listDotDuoi(false), nguongTuCohort()])
  const homNay = todayVN()
  const THU_TU: MucCanhBao[] = ['chua_tung_thay', 'rat_cham', 'cham', 'binh_thuong']

  const ca: CaTreo[] = dangMo.map((d) => {
    const tuoiNgay = d.created_at ? soNgayLech(ngayVN(d.created_at), homNay) : 0
    const tram = tramCua(d)
    return {
      caseId: d.caseId, ho_ten: d.ho_ten, ma_hs: d.ma_hs, lop: d.lop, mon: d.mon,
      tuoiNgay, tramKet: tram, muc: mucCua(tuoiNgay, nguong), choKhau: MO_TA_TRAM[tram],
      soBuoiDuKien: d.so_buoi_du_kien, daXep: d.daXep, daHoc: d.daHoc,
      soDang: d.dangs.length, daDuyetDang: !!d.dangDuyetAt,
      khongBiet: khongBietCua(d, tram),
    }
  }).sort((a, b) => THU_TU.indexOf(a.muc) - THU_TU.indexOf(b.muc) || b.tuoiNgay - a.tuoiNgay)

  return {
    ngayChup: homNay,
    nguong,
    tongDangMo: dangMo.length,
    ca,
    phamViDaQuet: `Toàn bộ ${dangMo.length} đợt bổ trợ đuổi đang mở (trang_thai='can_duoi') tính đến ${homNay}. `
      + `Ngưỡng chậm rút từ ${nguong.soCaMau} đợt đã hoàn thành: p75=${nguong.p75} ngày, p90=${nguong.p90} ngày, `
      + `lâu nhất từng hoàn thành=${nguong.toiDa} ngày.`
      + (nguong.duTinCay ? '' : ' ⚠ Mẫu dưới 20 đợt — ngưỡng chỉ nên coi là tham khảo.'),
  }
}

// ════════════════════════════════════════════════════════════════════════════
// LƯỢT 1 — RÀ SOÁT VIỆC CỦA CHÍNH MÌNH (bộ hiệu chuẩn)
//
// VÌ SAO đổi từ bổ trợ đuổi sang đây (CEO 12/08: "test bằng bổ trợ t ko quản hơi khó
//   kết luận"): chuỗi đuổi có dữ liệu sạch nhất, NHƯNG người dò không quản mảng đó nên
//   không xác nhận nổi đúng/sai — mà không xác nhận được thì hiệu chuẩn bằng 0. Tiêu chí
//   "ground truth phải do CHÍNH người dò kiểm được" đứng trên "dữ liệu sạch".
//   Chuỗi đuổi lên lượt 2, lúc đó Lộc chỉ cần xác nhận SỰ THẬT (4 ca), không cần dùng trợ lý.
//
// ⭐ LƯỢT NÀY KHÔNG SINH RA ĐỂ ĐÚNG — nó sinh ra để MOI LUẬT RA THÀNH DỮ LIỆU.
//   Hệ hiện KHÔNG biết lớp nào bắt buộc làm đánh giá (CEO 12/08: "không bắt buộc, do quản
//   lý chưa chặt vì ERP đang test"). Nên câu trả lời ĐÚNG của máy lúc này chỉ có thể là
//   "có N buổi chưa đóng, nhưng tôi không biết lớp nào bắt buộc" — đúng luật §4 và vô dụng.
//   Người rà từng mục mới sinh ra được cờ must-exist theo lớp. Đó mới là §10 "dò lỗ hổng
//   dữ liệu" làm cho tới: không phải phát hiện ra thiếu (đã biết), mà là THU ĐƯỢC cái thiếu.
//   ⇒ Ở lượt này KHÔNG gọi model. Model chỉ vào khi số đã đúng và luật đã có.
//
// CỬA SỔ 3–14 NGÀY — rút từ dữ liệu, không đặt tay (đo 445 buổi/60 ngày, DEVLOG 12/08):
//   tỉ lệ đóng theo tuổi buổi = 0-2n: 37-47% · 3-7n: 54-67% · 8-14n: 62-74% · 15-30n: 80-84%
//   · >30n: 72-79% (KHÔNG cải thiện so với 15-30).
//   ⇒ Mép TRƯỚC 3 ngày: dưới mốc này chưa tới một nửa số buổi được đóng — nhắc ở đây thì
//     hơn nửa số lần rơi vào người đang làm bình thường (§6 "nhắc dai chỉ hiệu quả khi hiếm").
//   ⇒ Mép SAU 14 ngày: qua 30 ngày tỉ lệ đứng yên vĩnh viễn ⇒ phần hở đó KHÔNG AI ĐÓNG NỮA;
//     nhắc vào đấy là tự dạy người dùng phớt lờ trợ lý (§6 "nhắc mà không đóng được thì đừng nhắc").
//     Lấy 14 (không phải 30) cho lượt hiệu chuẩn để bộ rà vừa một lượt ngồi.
// ════════════════════════════════════════════════════════════════════════════
export const CUA_SO_TU = 3
export const CUA_SO_DEN = 14

// Chỉ 2 khâu này ở lượt 1 (CEO chốt "cả đi"). ET/BTVN để ngoài: chúng áp dụng theo LỚP mà
// chưa chỗ nào ghi lớp nào cần, nên đưa vào chỉ tổ đẻ nhiễu không phân xử được.
export type TabRaSoat = 'danhgia' | 'ingame'
const NHAN_TAB: Record<TabRaSoat, string> = { danhgia: 'Đánh giá sau buổi', ingame: 'Chấm bài trên lớp' }

// Ba phán quyết người rà có thể ra. Đây CHÍNH LÀ dữ liệu đang thiếu:
//   thieu_that    → việc thật, chưa làm  ⇒ must-exist = có, does-exist = không
//   lop_khong_lam → lớp này không làm khâu này ⇒ must-exist = KHÔNG (nguồn cho cờ theo lớp)
//   lam_ngoai_he  → đã làm nhưng không ghi vào ERP ⇒ lỗ hổng GHI NHẬN, khác hẳn hai cái trên
export type KetLuanRaSoat = 'thieu_that' | 'lop_khong_lam' | 'lam_ngoai_he'

export type MucRaSoat = {
  buoiId: string; lopId: string; lop: string; ngay: string; tuoiNgay: number
  tab: TabRaSoat; nhan: string; vai: VaiViec
  ketLuan: KetLuanRaSoat | null   // null = chưa rà
  ghiChu: string | null
}

export type AnhChupViecToi = {
  ngayChup: string
  cuaSo: { tu: number; den: number }
  muc: MucRaSoat[]
  daRa: number; conLai: number
  // §6 + bài học `goiGon` của danhgia.ts: CẮT MÀ KHÔNG NÓI = người đọc hiểu thành toàn bộ.
  // Luôn khai đã bỏ ra ngoài bao nhiêu và vì sao.
  ngoaiPhamVi: { duoiCuaSo: number; trenCuaSo: number; ghiChu: string }
  phamViDaQuet: string
}

// Kết luận đã rà, khoá theo (buổi × khâu). Đọc riêng để ghép vào ảnh chụp.
async function ketLuanDaCo(buoiIds: string[]): Promise<Map<string, { ketLuan: KetLuanRaSoat; ghiChu: string | null }>> {
  if (!buoiIds.length) return new Map()
  const { data } = await supabase.from('troly_ra_soat')
    .select('buoi_hoc_id, tab, ket_luan, ghi_chu').in('buoi_hoc_id', buoiIds).limit(5000)
  return new Map(((data ?? []) as any[]).map((r) => [`${r.buoi_hoc_id}|${r.tab}`, { ketLuan: r.ket_luan, ghiChu: r.ghi_chu }]))
}

// Ảnh chụp việc CỦA NGƯỜI ĐANG ĐĂNG NHẬP trong cửa sổ hành động.
// Tái dùng `getMyTasks` — ĐÚNG invariant mà màn "Việc của tôi" đang dùng. Tự tính lại
// bằng SQL sẽ đẻ bản hiện thực thứ hai rồi lệch, và trợ lý sẽ nói khác màn hình.
export async function anhChupViecCuaToi(): Promise<AnhChupViecToi> {
  const homNay = todayVN()
  const tatCa = await getMyTasks()

  // Chỉ khâu đang rà, và chỉ việc CHƯA xong. Việc đã xong không phải thứ cần phân xử.
  const chuaXong = tatCa.filter((t) => !t.done && (t.tab === 'danhgia' || t.tab === 'ingame'))
  const kemTuoi = chuaXong.map((t) => ({ t, tuoi: soNgayLech(t.ngay, homNay) }))

  const trongCuaSo = kemTuoi.filter((x) => x.tuoi >= CUA_SO_TU && x.tuoi <= CUA_SO_DEN)
  const duoiCuaSo = kemTuoi.filter((x) => x.tuoi < CUA_SO_TU).length
  const trenCuaSo = kemTuoi.filter((x) => x.tuoi > CUA_SO_DEN).length

  const daCo = await ketLuanDaCo([...new Set(trongCuaSo.map((x) => x.t.buoiId))])
  const muc: MucRaSoat[] = trongCuaSo.map(({ t, tuoi }) => {
    const cu = daCo.get(`${t.buoiId}|${t.tab}`)
    return {
      buoiId: t.buoiId, lopId: t.lopId, lop: t.lop, ngay: t.ngay, tuoiNgay: tuoi,
      tab: t.tab as TabRaSoat, nhan: NHAN_TAB[t.tab as TabRaSoat], vai: t.vai,
      ketLuan: cu?.ketLuan ?? null, ghiChu: cu?.ghiChu ?? null,
    }
  }).sort((a, b) => b.tuoiNgay - a.tuoiNgay || a.lop.localeCompare(b.lop) || a.tab.localeCompare(b.tab))

  const daRa = muc.filter((m) => m.ketLuan).length
  return {
    ngayChup: homNay,
    cuaSo: { tu: CUA_SO_TU, den: CUA_SO_DEN },
    muc, daRa, conLai: muc.length - daRa,
    ngoaiPhamVi: {
      duoiCuaSo, trenCuaSo,
      ghiChu: `Đã BỎ RA NGOÀI ${duoiCuaSo} mục dưới ${CUA_SO_TU} ngày (còn trong nhịp làm bình thường) `
        + `và ${trenCuaSo} mục trên ${CUA_SO_DEN} ngày (quá mốc này tỉ lệ đóng đứng yên — không ai quay lại đóng nữa). `
        + `Hai nhóm đó KHÔNG mất đi, chỉ không thuộc lượt rà này.`,
    },
    phamViDaQuet: `${muc.length} mục thuộc 2 khâu (đánh giá sau buổi · chấm bài trên lớp) của riêng người đang đăng nhập, `
      + `buổi thường, tuổi ${CUA_SO_TU}–${CUA_SO_DEN} ngày tính đến ${homNay}. `
      + `ET/BTVN CỐ Ý để ngoài: hai khâu đó áp dụng theo lớp mà hệ chưa ghi lớp nào cần.`,
  }
}

// Ghi kết luận rà soát. Đây là DỮ LIỆU MỚI mà lượt rà sinh ra — nguồn để sau này
// dựng cờ must-exist theo lớp (gom 'lop_khong_lam' theo lop_id).
export async function ghiKetLuan(buoiId: string, tab: TabRaSoat, ketLuan: KetLuanRaSoat, ghiChu?: string | null): Promise<void> {
  const { data: au } = await supabase.auth.getUser()
  const { error } = await supabase.from('troly_ra_soat').upsert({
    buoi_hoc_id: buoiId, tab, ket_luan: ketLuan, ghi_chu: ghiChu?.trim() || null,
    nguoi: au.user?.id ?? null,
  }, { onConflict: 'buoi_hoc_id,tab' })
  if (error) throw error
}

// ════════════════════════════════════════════════════════════════════════════
// TRỢ LÝ NHẮC VIỆC HÀNG NGÀY — bản CEO thật sự cần (chốt 12/08)
//
// *"1 đứa trợ lý nhắc việc hàng ngày, và khi nó nhắc việc thì t sẽ nhận ra được cái gì
//  cần phải làm, cái gì cần hủy, cái gì cần gác lại"*
//
// ⭐ VÌ SAO BA NÚT NÀY GỠ ĐƯỢC BẾ TẮC: bản trước kẹt ở "hệ không biết lớp nào bắt buộc làm
//   khâu nào (must-exist) nên không dám nhắc" → đâm đi vá dữ liệu. Sai hướng. Nhắc sai thì
//   người bấm HUỶ, thế là xong; **luật lộ ra TỪ các lần bấm**, không cần biết trước.
//   ⇒ Vì thế mở HẾT mọi khâu (kể cả ET/BTVN/MT vốn sợ nhiễu): nhiễu đã có nút huỷ xử lý.
//
// KHÔNG LỌC THEO CỬA SỔ NGÀY ở đây. Bản trước cắt 3–14 ngày cho gọn lượt rà — nhưng với công
// cụ HÀNG NGÀY thì cắt = giấu, mà giấu thì đúng thứ §9 gọi là "bỏ sót không hiện ra để kiểm".
// Việc cũ tự biến mất khi người bấm huỷ/gác, không cần code giấu hộ.
// ════════════════════════════════════════════════════════════════════════════
export type QuyetDinh = 'lam' | 'huy' | 'gac'

export type ViecNhac = {
  buoiId: string; lopId: string; lop: string; ngay: string; tuoiNgay: number
  tab: string; nhan: string; vai: VaiViec
  deadline: number | null
  quaHan: boolean
  quyetDinh: QuyetDinh | null   // null = chưa quyết
  gacDen: string | null
}

export type BangNhac = {
  ngayChup: string
  can: ViecNhac[]        // đang cần nhắc (đã trừ huỷ + gác chưa tới hạn)
  soHuy: number          // đã tắt vĩnh viễn
  soGacChuaToi: number   // đang gác, sẽ quay lại
  gacHomNay: number      // gác tới hạn HÔM NAY → quay lại danh sách
  phamVi: string
}

// Quyết định người đã bấm, khoá (buổi × khâu). Tách hàm vì CẢ hai màn đều phải trừ
// đúng một tập như nhau — việc đã bấm HUỶ mà rổ "nợ" vẫn kêu thì ba nút thành vô nghĩa.
async function docQuyetDinh(buoiIds: string[]): Promise<Map<string, { quyetDinh: QuyetDinh; gacDen: string | null }>> {
  const m = new Map<string, { quyetDinh: QuyetDinh; gacDen: string | null }>()
  if (!buoiIds.length) return m
  const { data } = await supabase.from('troly_ra_soat')
    .select('buoi_hoc_id, tab, ket_luan, gac_den').in('buoi_hoc_id', buoiIds).limit(5000)
  for (const r of (data ?? []) as any[]) m.set(`${r.buoi_hoc_id}|${r.tab}`, { quyetDinh: r.ket_luan, gacDen: r.gac_den })
  return m
}

export async function nhacViecHomNay(): Promise<BangNhac> {
  const homNay = todayVN()
  const tasks = (await getMyTasks()).filter((t) => !t.done)
  const qd = await docQuyetDinh([...new Set(tasks.map((t) => t.buoiId))])

  const now = Date.now()
  let soHuy = 0, soGacChuaToi = 0, gacHomNay = 0
  const can: ViecNhac[] = []

  for (const t of tasks) {
    const d = qd.get(`${t.buoiId}|${t.tab}`)
    if (d?.quyetDinh === 'huy') { soHuy++; continue }
    // Gác: ẩn tới ngày hẹn rồi TỰ QUAY LẠI. Không có đường quay lại thì "gác" = xoá ngầm.
    if (d?.quyetDinh === 'gac' && d.gacDen && d.gacDen > homNay) { soGacChuaToi++; continue }
    if (d?.quyetDinh === 'gac') gacHomNay++
    can.push({
      buoiId: t.buoiId, lopId: t.lopId, lop: t.lop, ngay: t.ngay,
      tuoiNgay: soNgayLech(t.ngay, homNay),
      tab: t.tab, nhan: t.label, vai: t.vai,
      deadline: t.deadline, quaHan: t.deadline != null && t.deadline < now,
      quyetDinh: d?.quyetDinh ?? null, gacDen: d?.gacDen ?? null,
    })
  }
  // Quá hạn lên đầu, rồi cũ trước — càng treo lâu càng đẩy lên (doc §6 "nhớ mức 2").
  can.sort((a, b) => Number(b.quaHan) - Number(a.quaHan) || b.tuoiNgay - a.tuoiNgay || a.lop.localeCompare(b.lop))

  return {
    ngayChup: homNay, can, soHuy, soGacChuaToi, gacHomNay,
    phamVi: `Toàn bộ việc chưa xong của bạn (mọi khâu, mọi buổi) tính đến ${homNay}. `
      + `Đã trừ ${soHuy} việc bạn bấm huỷ và ${soGacChuaToi} việc đang gác.`
      + (gacHomNay ? ` ⏰ ${gacHomNay} việc gác tới hạn hôm nay, đã quay lại danh sách.` : ''),
  }
}

// Ghi quyết định. `gac` BẮT BUỘC có ngày quay lại (DB cũng chặn) — gác không hẹn = xoá ngầm.
export async function ghiQuyetDinh(buoiId: string, tab: string, quyetDinh: QuyetDinh, gacDen?: string | null): Promise<void> {
  if (quyetDinh === 'gac' && !gacDen) throw new Error('Gác lại thì phải chọn ngày nhắc lại.')
  const { data: au } = await supabase.auth.getUser()
  const { error } = await supabase.from('troly_ra_soat').upsert({
    buoi_hoc_id: buoiId, tab, ket_luan: quyetDinh,
    gac_den: quyetDinh === 'gac' ? gacDen : null,
    nguoi: au.user?.id ?? null,
  }, { onConflict: 'buoi_hoc_id,tab' })
  if (error) throw error
}

// ════════════════════════════════════════════════════════════════════════════
// TẦNG 2 — NHẬN ĐỊNH CẤP HỆ ("trợ lý thấy gì")
//
// CEO 12/08: *"những cái m vừa nói, chính là những thứ trợ lý nói. Nhưng ko phải ở khung chat
// này mà phải ở trên ERP để test. Cả test trợ lý lẫn fix dữ liệu erp"*.
//
// Tầng 1 nhắc VIỆC LẺ. Tầng này nêu chuyện cấp hệ mà nhìn từng việc không thấy — kiểu "dòng
// dữ liệu này đang chảy vào hư không". Đây là thứ giúp người quyết CÁI GÌ CẦN SỬA Ở ERP,
// không phải cái gì cần làm hôm nay.
//
// LUẬT CỦA TẦNG NÀY:
//  · **Số liệu tính LẠI mỗi lần đọc.** Không lưu text vào DB — ảnh chụp chết thì 2 tuần sau
//    sai số mà không ai biết. DB chỉ giữ QUYẾT ĐỊNH của người (`troly_nhan_dinh`).
//  · **Chỉ nêu khi thật sự có gì để nêu** (ngưỡng ngay trong từng hàm). Không có thì im —
//    doc §6 "được phép báo hôm nay không có gì". Bắt buộc phải tìm ra cái gì đó để nói thì
//    nó sẽ bới việc vụn lấp chỗ trống.
//  · Mỗi nhận định phải **chỉ ra được số nào sinh ra nó** (doc §4 "truy nguồn").
// ════════════════════════════════════════════════════════════════════════════
export type NhanDinh = {
  ma: string          // mã ỔN ĐỊNH — đổi mã = mất quyết định cũ của người
  tieuDe: string
  so: string          // số liệu sống, gọn — nguồn của nhận định
  dienGiai: string    // vì sao đáng chú ý
  goiY: string        // hướng xử, KHÔNG tự làm
  quyetDinh: QuyetDinh | null
  gacDen: string | null
}

const dem = async (bang: string, ap?: (q: any) => any): Promise<number> => {
  let q = supabase.from(bang).select('*', { count: 'exact', head: true })
  if (ap) q = ap(q)
  const { count } = await q
  return count ?? 0
}

// ⭐ NHẬN ĐỊNH VỀ BỔ TRỢ BÙ — CEO 12/08: *"T cần nhận xét ở trên erp, chỗ AI ấy"*.
// Bốn danh sách ở khối Bổ trợ bù mới chỉ là DỮ LIỆU; cái biến nó thành trợ lý là câu
// NHẬN XÉT rút ra từ chúng. Ăn thẳng snapshot đã load ở màn — KHÔNG query lại (query lần
// hai là mở đường cho hai con số lệch nhau trên cùng một màn hình).
// Ngưỡng nằm ngay trong hàm: không có gì đáng nói thì IM, đừng bới cho đủ chỗ trống.
function nhanDinhBu(d: AnhChupBu): NhanDinh[] {
  const ra: NhanDinh[] = []
  if (d.phaiXepLai.length) {
    const cu = d.phaiXepLai[0]
    const vang = d.phaiXepLai.filter((l) => l.lyDoQuayLai === 'vang_buoi_bu').length
    ra.push({
      ma: 'bu_phai_xep_lai',
      tieuDe: 'Có học sinh đã xếp bù nhưng trượt, chưa ai xếp lại',
      so: `${d.phaiXepLai.length} lượt (${vang} vắng buổi bù · ${d.phaiXepLai.length - vang} buổi bù bị huỷ) · cũ nhất ${cu.ho_ten} nghỉ ${cu.ngay} (${cu.tuoiNgay} ngày)`,
      dienGiai: 'Trước 12/08 hệ coi "đã xếp bù" là xong vĩnh viễn, không xét em có đến hay buổi có bị huỷ — nên mấy lượt này rơi khỏi hàng đợi mà không ai biết. Nay chúng đã quay lại "Cần xếp bù".',
      goiY: 'Xếp lại cho nhóm này trước: đây là các em đã lỡ hai lần, và có em lỡ tới hai lượt khác nhau.',
      quyetDinh: null, gacDen: null,
    })
  }
  if (d.canXep.tonDongCu >= 20) ra.push({
    ma: 'bu_ton_dong_cu',
    tieuDe: 'Tồn đọng xếp bù tích lại từ trước khi có luật hạn',
    so: `${d.canXep.tonDongCu} lượt nghỉ trước ${NGAY_AP_HAN_48H}${d.canXep.cuNhat ? ` · cũ nhất ${d.canXep.cuNhat}` : ''} · ${d.canXep.trongHan} lượt mới đang trong hạn 48h`,
    dienGiai: 'Khối này không nằm trong luật 48h (luật mới áp từ 10/08), nên nó sẽ không tự nổi lên ở mục quá hạn. Không ai đụng thì nó nằm im mãi.',
    goiY: 'Chọn một mốc: xử hết trong vài đợt, hoặc chốt là quá cũ rồi và đánh dấu không cần bù hàng loạt. Để lơ lửng là tệ nhất — số cứ to dần mà không nói lên điều gì.',
    quyetDinh: null, gacDen: null,
  })
  // ⭐ CHỈ nêu khi chuyện CÒN ĐANG xảy ra. Đo 14/08: 47 buổi "có đề mà không chấm" dồn hết
  //   vào tháng 6 → 26/07 (riêng tuần 20/07 là 20/34 buổi); hai tuần gần nhất 24/24 buổi đều
  //   có chấm. Tức nó đã TỰ DỪNG. Gộp thành một con số rồi nhắc mỗi sáng là nhắc một việc
  //   không còn xảy ra — người sẽ học được rằng danh sách này không đáng đọc.
  //   (Bản trước đúng là làm vậy, và còn khuyên "nói lại với người chấm" — sai địa chỉ lẫn
  //   sai thì: chuyện của tháng trước, người chấm hiện tại không liên quan.)
  if (d.dongKhong.ganDay > 0) ra.push({
    ma: 'bu_dong_khong',
    tieuDe: 'Buổi bù được chốt xong mà không có lấy một dòng chấm nào',
    so: `${d.dongKhong.ganDay} buổi trong 14 ngày qua (tổng từ trước tới nay ${d.dongKhong.coDe})${d.dongKhong.moiNhat ? ` · gần nhất ${d.dongKhong.moiNhat}` : ''}`,
    dienGiai: 'Buổi có đề ET hẳn hoi nhưng không ai chấm, vẫn bấm đóng đủ hai mốc. Nó tính là hoàn thành trong mọi thống kê mà không đóng góp gì cho mastery của HS — và dữ liệu đo của buổi đó mất luôn, không lấy lại được.',
    goiY: 'Mở vài buổi gần nhất xem người chấm vướng ở đâu. Nếu là thói quen bấm cho xong thì chặn ở nút đóng sẽ rẻ hơn nhắc.',
    quyetDinh: null, gacDen: null,
  })
  return ra
}

export async function nhanDinhHeThong(bu?: AnhChupBu | null): Promise<NhanDinh[]> {
  const homNay = todayVN()
  const ra: NhanDinh[] = bu ? nhanDinhBu(bu) : []

  // ① Cảnh báo yếu chảy vào hư không: đầu PHÁT chạy đều, đầu NHẬN không tồn tại.
  const [soCanhBao, soCaYeu] = await Promise.all([dem('canh_bao_yeu'), dem('bo_tro_yeu')])
  if (soCanhBao > 0 && soCaYeu === 0) {
    const { data: cb } = await supabase.from('canh_bao_yeu').select('created_at').order('created_at').limit(1)
    ra.push({
      ma: 'canh_bao_yeu_khong_noi_nhan',
      tieuDe: 'Cảnh báo HS yếu đang chảy vào hư không',
      so: `${soCanhBao} cảnh báo đã ghi${cb?.[0] ? ` (từ ${ngayVN((cb[0] as any).created_at)})` : ''} · 0 ca bổ trợ yếu được tạo`,
      dienGiai: 'Hệ phát hiện HS yếu lúc chấm BTVN và ghi lại đều đặn, nhưng chưa có đường nào biến cảnh báo thành ca bổ trợ. Đầu phát chạy, đầu nhận chưa có.',
      goiY: 'Hoặc nối cảnh báo → ca bổ trợ yếu, hoặc khai tử việc ghi cảnh báo. Để nguyên thì người ghi sẽ tự bỏ vì thấy nó không dẫn tới đâu.',
      quyetDinh: null, gacDen: null,
    })
  }

  // ② Level: đầu vào có, công thức thiếu 2/3 loại kỳ ⇒ không chốt được, không phải lười.
  const [soDiem, soLevel] = await Promise.all([
    dem('diem_thi', (q: any) => q.not('verdict', 'is', null)), dem('hs_level'),
  ])
  if (soDiem > 0 && soLevel === 0) {
    const { data: loai } = await supabase.from('ky_thi').select('loai').limit(1000)
    const cacLoai = [...new Set(((loai ?? []) as any[]).map((k) => k.loai))]
    ra.push({
      ma: 'level_thieu_loai_ky_thi',
      tieuDe: 'Điểm thi nhập đều nhưng chưa chốt được Level nào',
      so: `${soDiem} điểm đã có verdict · 0 level được chốt · kỳ thi mới có loại: ${cacLoai.join(', ') || '(chưa có)'}`,
      dienGiai: 'Công thức Level cần đủ các loại kỳ (thi trường · sát hạch · khảo sát tháng). Hiện chỉ một loại được nhập, nên không phải "chưa ai bấm" mà là chưa đủ đầu vào để bấm.',
      goiY: 'Hoặc bắt đầu nhập các loại kỳ còn thiếu, hoặc thu gọn công thức Level lại theo đúng loại đang có.',
      quyetDinh: null, gacDen: null,
    })
  }

  // ③ Job AI treo — không có cơ chế reap; treo mãi thì không ai biết worker đã chết.
  const soTreo = await dem('danhgia_ai_job', (q: any) => q.eq('trang_thai', 'processing'))
  if (soTreo > 0) {
    const { data: j } = await supabase.from('danhgia_ai_job').select('created_at').eq('trang_thai', 'processing').order('created_at').limit(1)
    const tuoi = j?.[0] ? soNgayLech(ngayVN((j[0] as any).created_at), homNay) : 0
    if (tuoi > 1) ra.push({
      ma: 'ai_job_treo',
      tieuDe: 'Có lượt gọi AI treo giữa chừng',
      so: `${soTreo} job đứng ở 'processing', cũ nhất ${tuoi} ngày`,
      dienGiai: 'Worker chết giữa job và không có cơ chế dọn job chết. Job treo mãi ⇒ nhìn vào không biết hệ đang chạy hay đã hỏng.',
      goiY: 'Thêm bước tự đánh dấu thất bại cho job quá N phút, hoặc dọn tay rồi ghi vào việc cần làm.',
      quyetDinh: null, gacDen: null,
    })
  }

  // ④ Việc giao đứng im: có giao, chưa từng chạy hết một vòng đời.
  const soMoiGiao = await dem('viec', (q: any) => q.eq('trang_thai', 'moi_giao'))
  const soDaXong = await dem('viec', (q: any) => q.eq('trang_thai', 'dat'))
  if (soMoiGiao > 0 && soDaXong === 0) {
    const { data: v } = await supabase.from('viec').select('created_at').eq('trang_thai', 'moi_giao').order('created_at').limit(1)
    ra.push({
      ma: 'viec_chua_chay_vong_nao',
      tieuDe: 'Module giao việc chưa chạy hết một vòng nào',
      so: `${soMoiGiao} việc đứng ở "mới giao"${v?.[0] ? `, cũ nhất ${soNgayLech(ngayVN((v[0] as any).created_at), homNay)} ngày` : ''} · 0 việc từng được nghiệm thu`,
      dienGiai: 'Việc được giao nhưng chưa có việc nào đi hết vòng đời. Chưa rõ là chưa tới lượt dùng hay luồng có chỗ tắc.',
      goiY: 'Chạy thử trọn một việc từ giao đến nghiệm thu để xem tắc ở đâu, hoặc gác module này lại cho tới khi cần thật.',
      quyetDinh: null, gacDen: null,
    })
  }

  // Trừ đi cái người đã tắt / đang gác. Ngưỡng ở trên đã lo phần "không có gì thì im".
  const { data: qd } = await supabase.from('troly_nhan_dinh').select('ma, quyet_dinh, gac_den').limit(500)
  const m = new Map(((qd ?? []) as any[]).map((r) => [r.ma, r]))
  return ra.map((n) => {
    const d = m.get(n.ma)
    return d ? { ...n, quyetDinh: d.quyet_dinh, gacDen: d.gac_den } : n
  }).filter((n) => n.quyetDinh !== 'huy' && !(n.quyetDinh === 'gac' && n.gacDen && n.gacDen > homNay))
}

export async function ghiQuyetDinhNhanDinh(ma: string, quyetDinh: QuyetDinh, gacDen?: string | null): Promise<void> {
  if (quyetDinh === 'gac' && !gacDen) throw new Error('Gác lại thì phải chọn ngày nhắc lại.')
  const { data: au } = await supabase.auth.getUser()
  const { error } = await supabase.from('troly_nhan_dinh').upsert({
    ma, quyet_dinh: quyetDinh, gac_den: quyetDinh === 'gac' ? gacDen : null,
    nguoi: au.user?.id ?? null, updated_at: new Date().toISOString(),
  }, { onConflict: 'ma' })
  if (error) throw error
}

// ════════════════════════════════════════════════════════════════════════════
// HỎI–ĐÁP VỚI TRỢ LÝ — chỗ AI vào lần đầu trong module này
//
// CEO 12/08: *"trợ lý đưa ra 1 đống thứ. t cần trao đổi với nó như đang trao đổi với m.
// chứ hệ thống đưa ra thì khác gì dashboard và việc của tôi nhỉ"*.
//
// RANH GIỚI (doc §4, không được nới):
//   · CODE tính SỐ → gói thành BẢNG SẠCH ở đây.  · MODEL chỉ ĐỌC bảng rồi trò chuyện.
//   · Mọi phép gộp/đếm/xếp hạng model có thể cần đều PHẢI tính sẵn — để nó không có
//     lý do gì phải tự cộng. Model tự cộng là mở đường cho sai số im lặng.
//   · Hỏi cái ngoài bảng ⇒ model phải nói "không có số đó", cấm đoán.
// ════════════════════════════════════════════════════════════════════════════
export type BoiCanhTroLy = {
  ngay: string
  homNay: BangHomNay          // ⭐ rổ trả lời câu "hôm nay tôi cần hoàn thành gì"
  phamVi: string
  tomTat: { canQuyet: number; quaHan: number; daHuy: number; dangGac: number }
  theoLop: { lop: string; tong: number; quaHan: number; cuNhat: number }[]
  theoKhau: { khau: string; tong: number; quaHan: number; cuNhat: number }[]
  viec: { lop: string; ngay: string; tuoi: number; khau: string; quaHan: boolean }[]
  nhanDinh: { ma: string; tieuDe: string; so: string; dienGiai: string; goiY: string }[]
  // Story đầu tiên được khai đầy đủ. Gộp sẵn theo mục, KÈM vài dòng chi tiết có tên — hỏi
  // "em nào phải xếp lại" mà bảng chỉ có con số thì model đúng luật sẽ phải trả lời là
  // không biết, và người hỏi thấy trợ lý vô dụng dù dữ liệu nằm ngay đó.
  boTroBu: {
    tomTat: {
      chuaFillDu: number; sapToi: number; phaiXepLai: number; quaHan: number; canXep: number; tonDongCu: number; khongXepDuoc: number
      // "đóng khống": coDe = có đề mà không chấm (mất dữ liệu đo thật) · khongCoDe = buổi mẹ
      // chưa soạn ET nên không có gì để chấm (bình thường) · ganDay = còn xảy ra trong 21 ngày.
      dongKhongCoDe: number; dongKhongGanDay: number; dongKhongKhongCoDe: number
    }
    phaiXepLai: { ho_ten: string; lop: string; ngayNghi: string; tuoi: number; vi: string; soLanDaXep: number }[]
    sapToi: { ngay: string; gio: string | null; phong: string | null; hs: string[] }[]
    chuaFillDu: { ngay: string; tuoi: number; thieu: string[]; hs: string[] }[]
  } | null
  khongBiet: string[]
}

export async function boiCanhChoHoi(): Promise<BoiCanhTroLy> {
  // Bổ trợ bù load TRƯỚC vì nhận định ăn chính snapshot đó — hai nguồn thì hai con số.
  const bu = await anhChupBoTroBu().catch(() => null)
  const [bang, nd, hn] = await Promise.all([nhacViecHomNay(), nhanDinhHeThong(bu), viecHomNay()])

  // Gộp sẵn — model KHÔNG phải đếm. Đây là phần quyết định chất lượng câu trả lời:
  // thiếu bảng gộp thì model sẽ tự cộng từ danh sách thô và cộng sai lúc nào không ai biết.
  const gom = (key: (v: ViecNhac) => string) => {
    const m = new Map<string, { tong: number; quaHan: number; cuNhat: number }>()
    for (const v of bang.can) {
      const k = key(v)
      const o = m.get(k) ?? { tong: 0, quaHan: 0, cuNhat: 0 }
      o.tong++; if (v.quaHan) o.quaHan++; o.cuNhat = Math.max(o.cuNhat, v.tuoiNgay)
      m.set(k, o)
    }
    return [...m.entries()].map(([k, o]) => ({ ...o, _k: k })).sort((a, b) => b.tong - a.tong)
  }

  return {
    ngay: bang.ngayChup,
    homNay: hn,
    phamVi: bang.phamVi,
    tomTat: {
      canQuyet: bang.can.length, quaHan: bang.can.filter((v) => v.quaHan).length,
      daHuy: bang.soHuy, dangGac: bang.soGacChuaToi,
    },
    theoLop: gom((v) => v.lop).map(({ _k, ...o }) => ({ lop: _k, ...o })),
    theoKhau: gom((v) => v.nhan).map(({ _k, ...o }) => ({ khau: _k, ...o })),
    viec: bang.can.map((v) => ({ lop: v.lop, ngay: v.ngay, tuoi: v.tuoiNgay, khau: v.nhan, quaHan: v.quaHan })),
    nhanDinh: nd.map(({ ma, tieuDe, so, dienGiai, goiY }) => ({ ma, tieuDe, so, dienGiai, goiY })),
    boTroBu: bu ? {
      tomTat: {
        chuaFillDu: bu.chuaFillDu.length, sapToi: bu.sapToi.length, phaiXepLai: bu.phaiXepLai.length,
        quaHan: bu.quaHan.length, canXep: bu.canXep.tong, tonDongCu: bu.canXep.tonDongCu, khongXepDuoc: bu.khongXepDuoc,
        // Giữ cả số LỊCH SỬ lẫn số GẦN ĐÂY: hỏi tới thì trả lời được, nhưng không nhắc hằng ngày.
        dongKhongCoDe: bu.dongKhong.coDe, dongKhongGanDay: bu.dongKhong.ganDay, dongKhongKhongCoDe: bu.dongKhong.khongDe,
      },
      phaiXepLai: bu.phaiXepLai.map((l) => ({
        ho_ten: l.ho_ten, lop: l.lop, ngayNghi: l.ngay, tuoi: l.tuoiNgay,
        vi: l.lyDoQuayLai === 'vang_buoi_bu' ? 'vắng buổi bù' : 'buổi bù bị huỷ', soLanDaXep: l.soLanDaXep,
      })),
      sapToi: bu.sapToi.map((b) => ({ ngay: b.ngay, gio: b.gio, phong: b.phong, hs: b.hs.map((h) => h.ho_ten) })),
      chuaFillDu: bu.chuaFillDu.map((b) => ({ ngay: b.ngay, tuoi: b.tuoiNgay, thieu: b.thieu, hs: b.hs })),
    } : null,
    // §4 "thiếu dấu vết thì khai là không biết" — nêu THẲNG giới hạn của bảng này,
    // để model không lấp bằng phỏng đoán khi bị hỏi ngoài phạm vi.
    khongBiet: [
      'Bảng này CHỈ có việc của người đang đăng nhập — không có việc của người khác.',
      'Không có dữ liệu vì sao một khâu bị bỏ; chỉ biết nó chưa đóng.',
      'Không có thông tin lớp nào BẮT BUỘC làm khâu nào (hệ chưa ghi luật đó ở đâu cả).',
      'Không có nội dung bài/điểm số của học sinh trong bảng này.',
      'Mục bổ trợ bù: hệ không ghi VÌ SAO học sinh vắng buổi bù, và không có chỗ đánh dấu "đã xác nhận lịch buổi bù sắp tới".',
      '"Không xếp được" là quyết định KẾT THÚC (vướng lịch, chốt thôi không xếp) — cố ý không nằm trong hàng đợi, đừng đọc thành tồn đọng.',
    ],
  }
}

export type LuotHoi = { hoi: string; dap: string }
export type DapTroLy = { traLoi: string | null; congCu: string | null; thamSo: any }

// Gọi thẳng serverless function `api/troly.mjs` (Vercel) — KHÔNG còn ghi job rồi chờ worker
// polling nữa (CEO 19/08: worker đứng-một-mình-24/7 không hợp hạ tầng đang có). Key AI vẫn
// CHỈ nằm ở server (biến môi trường Vercel), y hệt ranh giới cũ — chỉ đổi CÁCH gọi.
//
// ⭐ KHÔNG cần SUPABASE_SERVICE_ROLE cho ghi log (CEO 19/08 hỏi "đặt ở đây có rủi ro gì
// không" — đúng, key service-role bỏ qua MỌI RLS, không cần tới khi việc ghi log này vốn
// đã được `troly_hoi_dap`'s policy cho phép qua chính quyền người hỏi). Gửi kèm access
// token của phiên đăng nhập hiện tại → server dùng ĐÚNG token đó để ghi, bị RLS lọc y hệt
// mọi thao tác khác trong app — không có secret mạnh nào cần thêm trên Vercel.
export async function hoiTroLy(phien: string, cauHoi: string, lichSu: LuotHoi[]): Promise<DapTroLy> {
  const boiCanh = await boiCanhChoHoi()
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch('/api/troly', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(session?.access_token ? { authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify({ phien, cauHoi: cauHoi.trim(), boiCanh, lichSu: lichSu.slice(-6) }),
  })
  const j = await res.json().catch(() => null)
  if (!res.ok) throw new Error(j?.error ?? `Lỗi máy chủ (HTTP ${res.status}).`)
  return { traLoi: j?.traLoi ?? null, congCu: j?.congCu ?? null, thamSo: j?.thamSo ?? null }
}

// ════════════════════════════════════════════════════════════════════════════
// "HÔM NAY" — BA RỔ, GOM MỌI NGUỒN VIỆC (CEO chốt 12/08, lượt 2)
//
// *"Lúc báo việc thì phải báo việc đang NỢ, việc đang CẦN HOÀN THÀNH, và việc DỰ KIẾN sẽ
//  phải làm trong hôm nay mới có cái nhìn đầy đủ chứ."*
// *"Bản chất của việc hàng ngày chính là 'Việc của tôi', nhưng là 1 phiên bản có nhận định
//  và đầy đủ hơn. Thay vì t phải đi click khắp nơi thì t chỉ còn click 1 chỗ."*
//
// ⇒ HAI thay đổi so với bản trước, cả hai đều là SỬA SAI:
//  ① Nợ cũ KHÔNG còn là một con số. Bản trước rút gọn nó thành con số vì CEO nói "ko phải
//    mấy cái nợ kia nhé" — hiểu đúng ý lúc đó (đừng trộn lẫn) nhưng làm SAI cách (giấu đi).
//    Đúng là TÁCH RỔ: vẫn thấy đủ, không lẫn vào nhau.
//  ② Gom MỌI nguồn việc, không riêng task buổi. Trợ lý chỉ đọc `getMyTasks` thì nó đúng là
//    "một dashboard nữa" — người vẫn phải sang chỗ khác xem điểm danh, report, phòng ốc.
//    "Đầy đủ hơn Việc của tôi" là YÊU CẦU, không phải tính năng thêm.
//
// LUẬT GOM (CEO chốt): *"mọi chỗ mà có việc của nó hoặc SẮP có việc của nó thì đều ở chỗ
// trợ lý"* ⇒ thêm nguồn việc mới ở bất kỳ đâu trong app thì PHẢI nối vào đây, không phải
// tuỳ chọn. Thiếu một nguồn là người lại phải đi chỗ khác — hỏng đúng lý do tồn tại của màn này.
//
// TÁM NGUỒN (VẬN HÀNH ①–⑥ khớp `VietCuaToi` + PHÁT TRIỂN ⑦⑧ khớp `VietCuaToiTab` giao việc):
//   ① getMyTasks            — đánh giá · chấm bài · ET · BTVN · MT (GV/TG, theo phân công lớp)
//   ② myBuoiAoCuaKhoang     — điểm danh ca TÔI trực (Ops)
//   ③ getMyOpsTasks         — report trước buổi · báo tan
//   ④ getMyPrepTasks        — chuẩn bị phòng
//   ⑤ listDotChoDuyetDuoi   — đợt bổ trợ đuổi chờ chốt kế hoạch (team học thuật, theo môn)
//   ⑥ listCanScanDaCham     — bài test đã chấm chờ scan (pool Ops, KHÔNG theo người)
//   ⑦ listViecCuaToi        — task PHÁT TRIỂN được giao cho tôi (đang mở)
//   ⑧ listViecToiGiao       — task tôi GIAO, người ta nộp rồi, đang CHỜ TÔI nghiệm thu
// ⑧ là loại dễ quên nhất mà lại đúng chỗ nghẽn đã đo được: `vh_ops_task` 427/447 dòng đóng
// mà chưa duyệt. Việc "chờ tôi duyệt" vẫn là việc CỦA TÔI, dù tôi không phải người làm.
// Nguồn nào không áp cho người đang đăng nhập thì tự trả rỗng — không cần gate thêm ở đây,
// TRỪ ⑥ (pool chung, phải gate `opsToanHe` nếu không ai cũng thấy).
//
// ⚠ KHÔNG tự định nghĩa lại luật HẠN ở file này. Hạn do chính nguồn sinh ra (`deadline` của
//   MyTask/OpsTask/MyPrepTask). Chép lại công thức hạn sang đây là đẻ nguồn sự thật thứ hai,
//   rồi sửa một bên quên bên kia — đúng lỗi CLAUDE.md §2 đã ghi.
//
// PHÂN RỔ theo NGÀY CỦA HẠN, không theo ngày buổi:
//   ① NỢ         — hạn đã qua trước hôm nay, chưa xong.
//   ② HÔM NAY    — hạn rơi đúng hôm nay.
//   ③ DỰ KIẾN    — việc PHÁT SINH hôm nay mà hạn chưa tới (gồm buổi hôm nay CHƯA MỞ:
//                  chưa có dòng `buoi_hoc` nên chưa có task nào để đọc, phải dựng từ vai).
//   ④ KHÔNG HẠN  — việc thật, đang chờ, nhưng hệ không có mốc hạn. Nêu ra chứ KHÔNG giấu:
//                  giấu vì "không xếp được vào rổ nào" là đúng thứ §9 gọi là bỏ sót.
//
// "ĐANG DỞ" (yêu cầu cũ, vẫn còn hiệu lực: *"để t nhận thức được nó đang diễn ra"*) giờ là
// CỜ trên từng dòng, không phải rổ thứ năm — cùng một việc vừa quá hạn vừa đang dở thì đáng
// nằm ở rổ NỢ với dấu "đang dở", chứ không phải xuất hiện hai lần ở hai rổ.
// ════════════════════════════════════════════════════════════════════════════
export type NhomViec = 'buoi' | 'diemdanh' | 'report_tan' | 'prep' | 'duyet_duoi' | 'scan_test' | 'giao_viec' | 'nghiem_thu'
const TEN_NHOM: Record<NhomViec, string> = {
  buoi: 'Buổi học', diemdanh: 'Điểm danh', report_tan: 'Report / Báo tan',
  prep: 'Chuẩn bị phòng', duyet_duoi: 'Bổ trợ đuổi', scan_test: 'Test đầu vào',
  giao_viec: 'Phát triển', nghiem_thu: 'Chờ bạn nghiệm thu',
}
// Trạng thái việc phát triển còn ĐANG MỞ với người làm. 'cho_nghiem_thu' KHÔNG nằm đây —
// nộp rồi thì bóng sang sân người giao, để nguyên trong danh sách người làm là nhắc nhầm người.
const VIEC_DANG_MO: TrangThaiViec[] = ['moi_giao', 'dang_lam', 'tra_lai']

export type ViecGom = {
  khoa: string              // ổn định — key React + khoá gắn quyết định 3 nút
  nhom: NhomViec; nhomTen: string
  nhan: string              // tên việc
  boiCanh: string           // lớp / phòng / học sinh — ngữ cảnh gọn 1 dòng
  ngay: string              // ngày GỐC của việc (ngày buổi / ngày ca / hạn)
  // ⚠ HAI KHÁI NIỆM KHÁC NHAU, đừng gộp: "trễ hạn" đòi phải CÓ hạn để mà trễ; "tuổi" thì
  //   việc nào cũng có. Gộp lại thì việc không-hạn nộp từ hôm qua bị gắn nhãn NỢ — bịa ra
  //   một mốc hạn chưa từng tồn tại rồi kết tội người dùng trễ nó.
  coHan: boolean            // hệ có mốc hạn cho việc này không
  soNgay: number            // coHan ? số ngày ĐÃ TRỄ (0 = chưa trễ) : TUỔI của việc
  hanLuc: string | null     // 'HH:mm' giờ VN — null = hạn tính theo NGÀY, không có mốc giờ
  quaGio: boolean           // đã qua mốc hạn (dùng cho rổ ②: hạn hôm nay nhưng đã quá giờ)
  dangDo: boolean           // có hiện vật đã bắt đầu mà chưa đóng
  buoiId: string | null     // buoiId + tab đều có ⇒ bấm được Làm/Huỷ/Gác
  tab: string | null
}

export type BangHomNay = {
  ngay: string; thu: string
  no: ViecGom[]
  hanHomNay: ViecGom[]
  duKien: ViecGom[]
  khongHan: ViecGom[]
  soDangDo: number
  nguonDaQuet: string[]     // khai thẳng "một chỗ" này gồm những gì — người mới đọc biết ngay
  phamVi: string
  khongBiet: string[]
}

const THU_VN = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
const gioVN = (ms: number) => new Date(ms).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' })
const hhmm = (s: string) => String(s).slice(0, 5)

// Buổi nào ĐÃ có dấu vết bắt đầu, theo từng khâu. Suy từ HIỆN VẬT, không đoán.
// ⚠ Chấm ET KHÔNG có bảng dấu vết theo buổi đủ tin ⇒ CỐ Ý bỏ, và khai trong `khongBiet`.
//   Thà thiếu cờ "đang dở" còn hơn gắn bừa rồi người tin nhầm là đã làm dở.
async function daBatDau(buoiIds: string[]): Promise<Record<string, Set<string>>> {
  const ra: Record<string, Set<string>> = { danhgia: new Set(), ingame: new Set(), btvn: new Set() }
  if (!buoiIds.length) return ra
  const [dg, ig, bt] = await Promise.all([
    supabase.from('buoi_danh_gia').select('buoi_hoc_id').in('buoi_hoc_id', buoiIds).limit(5000),
    supabase.from('gami_grades').select('buoi_hoc_id').in('buoi_hoc_id', buoiIds).limit(20000),
    supabase.from('btvn_ket_qua').select('buoi_hoc_id').in('buoi_hoc_id', buoiIds).limit(5000),
  ])
  for (const r of (dg.data ?? []) as any[]) ra.danhgia.add(r.buoi_hoc_id)
  for (const r of (ig.data ?? []) as any[]) ra.ingame.add(r.buoi_hoc_id)
  for (const r of (bt.data ?? []) as any[]) ra.btvn.add(r.buoi_hoc_id)
  return ra
}

export async function viecHomNay(): Promise<BangHomNay> {
  const homNay = todayVN()
  const now = Date.now()

  // Gọi song song — 6 nguồn độc lập nhau, tuần tự thì màn chờ dài gấp mấy lần vô ích.
  // Mỗi nguồn tự chịu lỗi riêng: một nguồn hỏng KHÔNG được kéo sập cả màn (trợ lý mất
  // điểm danh vẫn hơn trợ lý trắng bảng), nhưng phải KHAI ra là nguồn đó lỗi — hỏng mà
  // im lặng thì người đọc hiểu thành "không có việc nào", đúng lỗi §9 bỏ sót.
  const hong: string[] = []
  const anToan = async <T,>(ten: string, p: Promise<T>, macDinh: T): Promise<T> => {
    try { return await p } catch { hong.push(ten); return macDinh }
  }
  const [tatCa, prof, scope, opsDD, opsRT, prep] = await Promise.all([
    anToan('việc buổi', getMyTasks(), [] as Awaited<ReturnType<typeof getMyTasks>>),
    getMyProfile(),
    anToan('phạm vi', getMyScope(), null),
    anToan('điểm danh', myBuoiAoCuaKhoang(homNay, homNay), [] as Awaited<ReturnType<typeof myBuoiAoCuaKhoang>>),
    anToan('report/báo tan', getMyOpsTasks(homNay, homNay), [] as Awaited<ReturnType<typeof getMyOpsTasks>>),
    anToan('chuẩn bị phòng', getMyPrepTasks(homNay, homNay), [] as Awaited<ReturnType<typeof getMyPrepTasks>>),
  ])

  const gom: ViecGom[] = []
  const duKienRieng: ViecGom[] = []   // rổ ③ dựng tay (buổi chưa mở) — không đi qua đường hạn

  // ── ① VIỆC BUỔI (GV/TG) ───────────────────────────────────────────────────
  const chuaXong = tatCa.filter((t) => !t.done)
  const qd = await anToan('quyết định đã bấm', docQuyetDinh([...new Set(chuaXong.map((t) => t.buoiId))]), new Map())
  // Trừ đúng tập mà màn "Việc cần quyết" đang trừ: bấm Huỷ rồi mà rổ Nợ vẫn kêu thì ba nút vô nghĩa.
  const conSong = chuaXong.filter((t) => {
    const d = qd.get(`${t.buoiId}|${t.tab}`)
    if (d?.quyetDinh === 'huy') return false
    if (d?.quyetDinh === 'gac' && d.gacDen && d.gacDen > homNay) return false
    return true
  })
  const batDau = await anToan('dấu vết đang dở', daBatDau([...new Set(conSong.map((t) => t.buoiId))]), { danhgia: new Set<string>(), ingame: new Set<string>(), btvn: new Set<string>() })
  for (const t of conSong) {
    gom.push({
      khoa: `buoi:${t.buoiId}|${t.tab}`, nhom: 'buoi', nhomTen: TEN_NHOM.buoi,
      nhan: t.label, boiCanh: `${t.lop} · buổi ${t.ngay.slice(5)}`, ngay: t.ngay,
      hanLuc: t.deadline != null ? gioVN(t.deadline) : null,
      coHan: t.deadline != null,
      soNgay: t.deadline != null ? Math.max(0, soNgayLech(ngayCuaTs(t.deadline), homNay)) : soNgayLech(t.ngay, homNay),
      quaGio: t.deadline != null && t.deadline < now,
      dangDo: !!batDau[t.tab]?.has(t.buoiId),
      buoiId: t.buoiId, tab: t.tab,
    })
  }

  // ── ② ĐIỂM DANH ca tôi trực hôm nay ───────────────────────────────────────
  // Buổi ĐÃ MỞ mà chưa đánh dấu đủ HS ⇒ việc thật hôm nay. Buổi CHƯA MỞ ⇒ dự kiến (rổ ③).
  const buoiDaMo = opsDD.filter((ba) => ba.buoi && ba.buoi.trang_thai !== 'huy')
  const tienDo = buoiDaMo.length
    ? await anToan('tiến độ điểm danh', diemDanhTienDo(buoiDaMo.map((ba) => ba.buoi!.id)), {} as Record<string, { tong: number; daDanh: number }>)
    : {}
  for (const ba of opsDD) {
    if (ba.buoi && ba.buoi.trang_thai === 'huy') continue
    const boiCanh = `${ba.lop.ten_lop} · ${hhmm(ba.slot.gio_bat_dau)}${ba.slot.phong ? ` · phòng ${ba.slot.phong}` : ''}`
    if (!ba.buoi) {
      duKienRieng.push({
        khoa: `dd-ao:${ba.lop.id}|${ba.ngay}`, nhom: 'diemdanh', nhomTen: TEN_NHOM.diemdanh,
        nhan: 'Mở buổi + điểm danh', boiCanh: `${boiCanh} · buổi chưa mở`, ngay: ba.ngay,
        coHan: false, soNgay: 0, hanLuc: null, quaGio: false, dangDo: false, buoiId: null, tab: null,
      })
      continue
    }
    const td = tienDo[ba.buoi.id]
    if (td && td.daDanh >= td.tong) continue // xong rồi
    gom.push({
      khoa: `dd:${ba.buoi.id}`, nhom: 'diemdanh', nhomTen: TEN_NHOM.diemdanh,
      nhan: 'Điểm danh', boiCanh: `${boiCanh}${td ? ` · ${td.daDanh}/${td.tong} HS` : ''}`, ngay: ba.ngay,
      // Điểm danh không có cột hạn riêng — hạn thực tế là chính ngày buổi. Suy tại chỗ từ NGÀY,
      // không phải chép công thức giờ của nguồn khác.
      coHan: true, soNgay: Math.max(0, soNgayLech(ba.ngay, homNay)), hanLuc: null, quaGio: false,
      dangDo: !!td && td.daDanh > 0 && td.daDanh < td.tong,
      buoiId: null, tab: null,
    })
  }

  // ── ③ REPORT / BÁO TAN ────────────────────────────────────────────────────
  for (const t of opsRT) {
    if (t.done) continue
    gom.push({
      khoa: `ops:${t.tkbId}|${t.ngay}|${t.tab}`, nhom: 'report_tan', nhomTen: TEN_NHOM.report_tan,
      nhan: OPS_TASK_LABEL[t.tab], boiCanh: `${t.lopTen} · ${hhmm(t.gioBatDau)}–${hhmm(t.gioKetThuc)}`, ngay: t.ngay,
      coHan: true, soNgay: Math.max(0, soNgayLech(ngayCuaTs(t.deadline), homNay)), hanLuc: gioVN(t.deadline),
      quaGio: t.deadline < now, dangDo: false, buoiId: null, tab: null,
    })
  }

  // ── ④ CHUẨN BỊ PHÒNG ──────────────────────────────────────────────────────
  for (const t of prep) {
    if (t.done) continue
    gom.push({
      khoa: `prep:${t.phong}|${t.ngay}|${t.luot}`, nhom: 'prep', nhomTen: TEN_NHOM.prep,
      nhan: 'Chuẩn bị phòng', boiCanh: `Phòng ${t.phong} · ca ${hhmm(t.gioCaDau)}`, ngay: t.ngay,
      coHan: true, soNgay: Math.max(0, soNgayLech(ngayCuaTs(t.deadline), homNay)), hanLuc: gioVN(t.deadline),
      quaGio: t.deadline < now, dangDo: false, buoiId: null, tab: null,
    })
  }

  // ── ⑤ ĐỢT BỔ TRỢ ĐUỔI CHỜ CHỐT (team học thuật, theo môn) ─────────────────
  // KHÔNG có mốc hạn trong hệ ⇒ rổ ④. Vẫn phải hiện: đây đúng loại việc nằm im hàng tháng
  // vì không ai có lý do nào để nhớ tới nó.
  const htMons = prof?.hocThuatMons ?? []
  const choDuyet = htMons.length ? await anToan('bổ trợ đuổi chờ chốt', listDotChoDuyetDuoi(htMons), [] as DotDuoi[]) : []
  for (const d of choDuyet) {
    gom.push({
      khoa: `duoi:${d.caseId}`, nhom: 'duyet_duoi', nhomTen: TEN_NHOM.duyet_duoi,
      nhan: 'Chốt kế hoạch đợt đuổi', boiCanh: `${d.ho_ten} · ${d.lop}`,
      ngay: d.created_at ? ngayVN(d.created_at) : homNay,
      coHan: false, soNgay: d.created_at ? soNgayLech(ngayVN(d.created_at), homNay) : 0,
      hanLuc: null, quaGio: false, dangDo: false, buoiId: null, tab: null,
    })
  }

  // ── ⑥ BÀI TEST ĐÃ CHẤM CHỜ SCAN (pool chung của Ops) ──────────────────────
  // Pool, KHÔNG theo người ⇒ phải gate `opsToanHe`, không thì mọi nhân sự đều thấy việc
  // của Ops. (VietCuaToi gate đúng chỗ này — bỏ gate là đổi hành vi, không phải "gom thêm".)
  const scan = scope?.opsToanHe ? await anToan('bài test chờ scan', listCanScanDaCham(), [] as Awaited<ReturnType<typeof listCanScanDaCham>>) : []
  for (const c of scan) {
    gom.push({
      khoa: `scan:${c.id}`, nhom: 'scan_test', nhomTen: TEN_NHOM.scan_test,
      nhan: 'Scan bài test đã chấm', boiCanh: `${c.hoTenHs}${c.khoi ? ` · khối ${c.khoi}` : ''} · ${c.mon}`, ngay: c.ngay,
      coHan: false, soNgay: Math.max(0, soNgayLech(c.ngay, homNay)), hanLuc: null, quaGio: false,
      dangDo: false, buoiId: null, tab: null,
    })
  }

  // ── ⑦⑧ VIỆC PHÁT TRIỂN (giao việc) ────────────────────────────────────────
  // Hai chiều, KHÁC NHAU về ai đang cầm bóng:
  //   ⑦ tôi LÀM  — trạng thái còn mở (mới giao / đang làm / bị trả lại)
  //   ⑧ tôi DUYỆT — người ta nộp rồi, đang chờ chính tôi nghiệm thu
  // `viec.deadline` là NGÀY ('YYYY-MM-DD'), không phải mốc mili-giây như OpsTask ⇒ so theo
  // ngày, KHÔNG dựng giờ giả để nhét cho vừa khuôn (giờ bịa sẽ hiện ra màn như thật).
  const myId = prof?.nhanSu.id
  const [viecToiLam, viecToiGiao] = myId
    ? await Promise.all([
        anToan('việc phát triển của bạn', listViecCuaToi(myId), [] as ViecFull[]),
        anToan('việc chờ bạn nghiệm thu', listViecToiGiao(myId), [] as ViecFull[]),
      ])
    : [[] as ViecFull[], [] as ViecFull[]]
  for (const v of viecToiLam) {
    if (!VIEC_DANG_MO.includes(v.trang_thai)) continue
    gom.push({
      khoa: `viec:${v.id}`, nhom: 'giao_viec', nhomTen: TEN_NHOM.giao_viec,
      nhan: v.tieu_de,
      boiCanh: [v.loai_viec_ten, v.trang_thai === 'tra_lai' ? 'bị trả lại' : null, v.nguoi_giao_ten ? `giao bởi ${v.nguoi_giao_ten}` : null].filter(Boolean).join(' · ') || 'Việc phát triển',
      ngay: v.deadline ?? ngayVN(v.created_at),
      hanLuc: null,
      coHan: !!v.deadline,
      soNgay: v.deadline ? Math.max(0, soNgayLech(v.deadline, homNay)) : soNgayLech(ngayVN(v.created_at), homNay),
      quaGio: false, dangDo: v.trang_thai === 'dang_lam', buoiId: null, tab: null,
    })
  }
  for (const v of viecToiGiao) {
    if (v.trang_thai !== 'cho_nghiem_thu') continue
    gom.push({
      khoa: `nt:${v.id}`, nhom: 'nghiem_thu', nhomTen: TEN_NHOM.nghiem_thu,
      nhan: `Nghiệm thu: ${v.tieu_de}`,
      boiCanh: [v.nguoi_lam_ten ? `${v.nguoi_lam_ten} đã nộp` : 'đã nộp', v.ngay_nop ? `ngày ${v.ngay_nop.slice(5)}` : null].filter(Boolean).join(' · '),
      ngay: v.ngay_nop ?? v.deadline ?? ngayVN(v.created_at),
      hanLuc: null,
      // Nghiệm thu KHÔNG có hạn riêng trong hệ. Đếm tuổi từ NGÀY NỘP: nộp xong nằm im
      // chính là lỗ đen đã đo được (housekeeping tự xả sau 7 ngày rồi ghi 'dat' — việc
      // chưa ai xem thành việc đạt). Để tuổi hiện ra thì người còn kịp duyệt trước mốc đó.
      coHan: false,
      soNgay: v.ngay_nop ? Math.max(0, soNgayLech(v.ngay_nop.slice(0, 10), homNay)) : 0,
      quaGio: false, dangDo: false, buoiId: null, tab: null,
    })
  }

  // ── ⑨ BUỔI HÔM NAY CHƯA MỞ → việc sẽ phát sinh (rổ ③) ─────────────────────
  // Buổi chưa mở thì CHƯA CÓ dòng `buoi_hoc` ⇒ `getMyTasks` không sinh task nào ⇒ nếu chỉ
  // đọc task thì lịch dạy hôm nay vô hình. Dựng từ (vai trên lớp × TASKS_BY_VAI) — dùng
  // CHÍNH bảng vai→khâu của gami.ts, không chép lại.
  // ⚠ KHÔNG gán hạn cho nhóm này: hạn của chúng do luật hạn sinh ra SAU KHI buổi mở; đoán
  //   trước ở đây là copy luật sang nguồn thứ hai (xem cảnh báo đầu mục).
  const vaiTheoLop = new Map<string, Set<'gv' | 'tg'>>()
  for (const pc of prof?.phanCong ?? []) {
    const v = pc.vai_tro === 'gv' ? 'gv' : 'tg'
    if (!vaiTheoLop.has(pc.lop_id)) vaiTheoLop.set(pc.lop_id, new Set())
    vaiTheoLop.get(pc.lop_id)!.add(v)
  }
  if (vaiTheoLop.size) {
    const aoHomNay = await anToan('lịch dạy hôm nay', buoiAoCuaNgay(homNay), [] as Awaited<ReturnType<typeof buoiAoCuaNgay>>)
    for (const a of aoHomNay) {
      const vais = vaiTheoLop.get(a.lop.id)
      if (!vais || a.buoi) continue          // đã mở ⇒ task thật đã có ở nguồn ①, không nhân đôi
      const seen = new Set<string>()
      for (const vai of ['gv', 'tg'] as const) {
        if (!vais.has(vai)) continue
        for (const k of TASKS_BY_VAI[vai]) {
          if (seen.has(k.tab)) continue
          seen.add(k.tab)
          duKienRieng.push({
            khoa: `du-kien:${a.lop.id}|${homNay}|${k.tab}`, nhom: 'buoi', nhomTen: TEN_NHOM.buoi,
            nhan: k.label, boiCanh: `${a.lop.ten_lop} · ca ${hhmm(a.slot.gio_bat_dau)} · buổi chưa mở`,
            ngay: homNay, coHan: false, soNgay: 0, hanLuc: null, quaGio: false, dangDo: false, buoiId: null, tab: null,
          })
        }
      }
    }
  }

  // ── PHÂN RỔ ───────────────────────────────────────────────────────────────
  const no: ViecGom[] = []; const hanHomNay: ViecGom[] = []
  const duKien: ViecGom[] = [...duKienRieng]; const khongHan: ViecGom[] = []
  for (const v of gom) {
    // Không có hạn ⇒ KHÔNG được xếp vào nợ/hôm nay dù tuổi lớn cỡ nào. Việc nằm 30 ngày mà
    // hệ chưa từng đặt hạn cho nó thì đó là lỗ hổng KHAI BÁO, không phải người dùng trễ hạn.
    if (!v.coHan) { khongHan.push(v); continue }
    if (v.soNgay > 0) no.push(v)
    else if (v.ngay === homNay || v.hanLuc != null) hanHomNay.push(v)
    else duKien.push(v)
  }

  no.sort((a, b) => b.soNgay - a.soNgay || a.nhomTen.localeCompare(b.nhomTen))
  hanHomNay.sort((a, b) => (a.hanLuc ?? '99:99').localeCompare(b.hanLuc ?? '99:99') || a.boiCanh.localeCompare(b.boiCanh))
  duKien.sort((a, b) => a.boiCanh.localeCompare(b.boiCanh))
  // Không có hạn thì thứ tự duy nhất đáng tin là TUỔI — nằm lâu nhất lên đầu.
  khongHan.sort((a, b) => b.soNgay - a.soNgay || a.nhomTen.localeCompare(b.nhomTen))

  const [y, m, d] = homNay.split('-').map(Number)
  const soDangDo = [...no, ...hanHomNay].filter((v) => v.dangDo).length

  return {
    ngay: homNay, thu: THU_VN[new Date(Date.UTC(y, m - 1, d)).getUTCDay()],
    no, hanHomNay, duKien, khongHan, soDangDo,
    nguonDaQuet: [
      'Việc buổi học của bạn (đánh giá · chấm bài · ET · BTVN · MT)',
      'Điểm danh ca bạn trực', 'Report trước buổi · Báo tan', 'Chuẩn bị phòng',
      'Đợt bổ trợ đuổi chờ chốt kế hoạch (nếu bạn ở team học thuật)',
      'Bài test đã chấm chờ scan (nếu bạn ở Ops)',
      'Task phát triển được giao cho bạn',
      'Task bạn giao, người ta đã nộp và đang chờ bạn nghiệm thu',
    ],
    phamVi: `Gom từ 8 nguồn việc, tính đến ${homNay}. Đã trừ việc bạn đã bấm Huỷ và việc đang gác chưa tới hẹn.`
      + (hong.length ? ` ⚠ KHÔNG đọc được: ${hong.join(', ')} — phần đó đang thiếu khỏi bảng, không phải là không có việc.` : ''),
    khongBiet: [
      'Chấm ET không có bảng dấu vết theo buổi nên không xác định được là đang dở hay chưa bắt đầu.',
      'Điểm danh và mấy việc ở mục "không có hạn" thì hệ không lưu mốc hạn — thứ tự trong đó chỉ theo ngày, không theo độ gấp.',
      'Việc dự kiến của buổi CHƯA MỞ chưa có hạn: hạn chỉ sinh ra sau khi buổi được mở.',
      'Bảng này chỉ có việc của người đang đăng nhập — không có việc của người khác.',
    ],
  }
}
