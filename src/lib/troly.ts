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
import { listDotDuoi, type DotDuoi } from './botro_duoi'
import { getMyTasks } from './gami'
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
  tab: TabRaSoat; nhan: string; vai: 'gv' | 'tg'
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
  tab: string; nhan: string; vai: 'gv' | 'tg'
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

export async function nhacViecHomNay(): Promise<BangNhac> {
  const homNay = todayVN()
  const tasks = (await getMyTasks()).filter((t) => !t.done)

  const qd = new Map<string, { quyetDinh: QuyetDinh; gacDen: string | null }>()
  const ids = [...new Set(tasks.map((t) => t.buoiId))]
  if (ids.length) {
    const { data } = await supabase.from('troly_ra_soat')
      .select('buoi_hoc_id, tab, ket_luan, gac_den').in('buoi_hoc_id', ids).limit(5000)
    for (const r of (data ?? []) as any[]) qd.set(`${r.buoi_hoc_id}|${r.tab}`, { quyetDinh: r.ket_luan, gacDen: r.gac_den })
  }

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

export async function nhanDinhHeThong(): Promise<NhanDinh[]> {
  const homNay = todayVN()
  const ra: NhanDinh[] = []

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
  khongBiet: string[]
}

export async function boiCanhChoHoi(): Promise<BoiCanhTroLy> {
  const [bang, nd, hn] = await Promise.all([nhacViecHomNay(), nhanDinhHeThong(), viecHomNay()])

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
    // §4 "thiếu dấu vết thì khai là không biết" — nêu THẲNG giới hạn của bảng này,
    // để model không lấp bằng phỏng đoán khi bị hỏi ngoài phạm vi.
    khongBiet: [
      'Bảng này CHỈ có việc của người đang đăng nhập — không có việc của người khác.',
      'Không có dữ liệu vì sao một khâu bị bỏ; chỉ biết nó chưa đóng.',
      'Không có thông tin lớp nào BẮT BUỘC làm khâu nào (hệ chưa ghi luật đó ở đâu cả).',
      'Không có nội dung bài/điểm số của học sinh trong bảng này.',
    ],
  }
}

export type LuotHoi = { hoi: string; dap: string }
export type PhienDap = { id: string; trang_thai: 'pending' | 'processing' | 'done' | 'failed'; tra_loi: string | null; error: string | null; usage: any; model: string | null }

// Ghi job → `worker/troly.mjs` quét mỗi 5s. Key Anthropic Ở SERVER, không vào bundle browser.
export async function hoiTroLy(phien: string, cauHoi: string, lichSu: LuotHoi[]): Promise<string> {
  const boiCanh = await boiCanhChoHoi()
  const { data: au } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('troly_hoi_dap').insert({
    phien, cau_hoi: cauHoi.trim(), boi_canh: boiCanh,
    lich_su: lichSu.slice(-6), // giữ 6 lượt gần nhất — đủ mạch, không phình token vô hạn
    nguoi: au.user?.id ?? null,
  }).select('id').single()
  if (error) throw error
  return (data as any).id
}

export async function docDap(id: string): Promise<PhienDap | null> {
  const { data } = await supabase.from('troly_hoi_dap')
    .select('id, trang_thai, tra_loi, error, usage, model').eq('id', id).maybeSingle()
  return (data as any) ?? null
}

// ════════════════════════════════════════════════════════════════════════════
// "HÔM NAY TÔI CÓ NHỮNG VIỆC GÌ CẦN HOÀN THÀNH?" — tiêu chí nghiệm thu số 1
//
// CEO 12/08 chốt gọn, sau khi Claude lại phức tạp hoá (nhét cả buổi dạy, chuẩn bị phòng,
// report/báo tan vào):
//   *"Hôm nay là những việc có deadline là hôm nay thôi"*
//   *"những việc phải hoàn thành hôm nay | những việc đã được start và chưa hoàn thành
//     để t nhận thức được nó đang diễn ra"*
//
// ⇒ ĐÚNG HAI RỔ, không thêm gì:
//   ① HẠN HÔM NAY  — deadline rơi đúng hôm nay (theo ngày của DEADLINE, không phải ngày buổi).
//   ② ĐANG DỞ      — đã có dấu vết BẮT ĐẦU nhưng chưa đóng. Đây không phải "việc phải làm",
//                    nó là thứ để người ta NHẬN THỨC đang có cái gì dở dang.
//
// ⚠ Nợ cũ (hạn đã qua từ trước) CHỈ còn là một con số. CEO: *"ko phải là mấy cái nợ kia nhé"*.
//   Trộn vào là câu trả lời chìm nghỉm giữa gần trăm dòng — đúng lỗi của bản trước.
//
// "ĐÃ START" suy từ HIỆN VẬT, không đoán: có dòng con cho buổi đó mà cột đóng còn null.
//   đánh giá → `buoi_danh_gia` · chấm lớp → `gami_grades` · BTVN → `btvn_ket_qua`
//   ⚠ ET KHÔNG có bảng hiện vật theo buổi mà tự tin nhận ra được ⇒ CỐ Ý bỏ khỏi rổ ②
//     và khai thẳng trong `khongBiet`. Thà thiếu còn hơn đoán bừa là "đang dở".
// ════════════════════════════════════════════════════════════════════════════
export type ViecHanHomNay = { nhan: string; lop: string; ngayBuoi: string; hanLuc: string; quaGio: boolean }
export type ViecDangDo = { nhan: string; lop: string; ngayBuoi: string; tuoiNgay: number }

export type BangHomNay = {
  ngay: string; thu: string
  hanHomNay: ViecHanHomNay[]
  dangDo: ViecDangDo[]
  noCu: number
  phamVi: string
  khongBiet: string[]
}

const THU_VN = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
const gioVN = (ms: number) => new Date(ms).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' })

// Buổi nào ĐÃ có dấu vết bắt đầu, theo từng khâu.
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
  const chuaXong = (await getMyTasks()).filter((t) => !t.done)

  const batDau = await daBatDau([...new Set(chuaXong.map((t) => t.buoiId))])

  const hanHomNay: ViecHanHomNay[] = []
  const dangDo: ViecDangDo[] = []
  let noCu = 0

  for (const t of chuaXong) {
    const hanNgay = t.deadline != null ? ngayCuaTs(t.deadline) : null
    if (hanNgay === homNay) {
      hanHomNay.push({ nhan: t.label, lop: t.lop, ngayBuoi: t.ngay, hanLuc: gioVN(t.deadline!), quaGio: t.deadline! < now })
    } else if (hanNgay != null && hanNgay < homNay) noCu++

    // Rổ ② độc lập rổ ① — một việc vừa quá hạn vừa đang dở thì xuất hiện ở cả hai,
    // vì hai rổ trả lời hai câu khác nhau ("phải xong" vs "đang diễn ra").
    if (batDau[t.tab]?.has(t.buoiId)) {
      dangDo.push({ nhan: t.label, lop: t.lop, ngayBuoi: t.ngay, tuoiNgay: soNgayLech(t.ngay, homNay) })
    }
  }

  hanHomNay.sort((a, b) => a.hanLuc.localeCompare(b.hanLuc))
  dangDo.sort((a, b) => b.tuoiNgay - a.tuoiNgay)
  const [y, m, d] = homNay.split('-').map(Number)

  return {
    ngay: homNay, thu: THU_VN[new Date(Date.UTC(y, m - 1, d)).getUTCDay()],
    hanHomNay, dangDo, noCu,
    phamVi: `Chỉ việc có HẠN rơi đúng ngày ${homNay}, cộng việc ĐANG DỞ (đã bắt đầu, chưa đóng). `
      + `KHÔNG gồm ${noCu} việc hạn đã qua từ trước — đó là nợ cũ, mục riêng.`,
    khongBiet: [
      'Chấm ET không có bảng dấu vết theo buổi nên KHÔNG xác định được là đang dở hay chưa bắt đầu.',
      'Việc không có hạn (deadline trống) không nằm ở rổ nào — không suy được là hôm nay hay không.',
    ],
  }
}
