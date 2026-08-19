// ============================================================================
// MẢNG "VẬN HÀNH BUỔI HỌC" — bộ tổng hợp + thông báo cho Trang (và Thùy).
// Spec: SPEC-troly-nhansu.md §2, §2.1, §4.5. Module này làm ĐẦU TIÊN vì đang chạy đầy đủ nhất.
//
// CEO 14/08 hình dung ra thành câu, không phải thành bảng:
//   *"Ngày hôm qua, các lớp XYZ đã hoàn thành điền dữ liệu, lớp ABC còn thiếu ET, lớp DEF thiếu
//    BTVN, lớp MN chưa điền đánh giá"* + *"Tổng hợp từ đầu tuần, các lớp GH còn nợ..."*
//   → *"Đọc cái này Trang sẽ biết luôn dữ liệu nào đang thiếu, từ đấy thông báo cho TA fill."*
//
// ⭐ NHỊP — "theo LỊCH hôm nay phải có gì, hệ ghi nhận được gì" (CEO chốt, thay cả hai phương án
//   Claude đưa ra). Nghĩa vụ suy từ LỊCH, không phải từ "hôm qua còn sót gì":
//     · ET · ĐÁNH GIÁ = nghĩa vụ của buổi VỪA DẠY  ⇒ hỏi vào sáng hôm sau.
//       Đo 60 ngày: ET đóng ngay trong ngày 244/339 ca (72%), thêm 43 ca sau 1 ngày ⇒ đúng nhịp.
//     · BTVN = chấm ở buổi KẾ TIẾP (thiết kế, không phải lười)  ⇒ đến hạn vào NGÀY CÓ CA KẾ.
//       Đo 60 ngày: đóng sau 2–6 ngày là chuẩn; đóng trong vòng 1 ngày chỉ 2/250 ca.
//       ⇒ Hỏi BTVN theo kiểu "hôm qua chưa có" là SAI 100%: sáng nào cũng đủ mặt mọi lớp,
//         kể cả lớp đang làm rất chuẩn. Danh sách mà lúc nào cũng đầy thì không ai đọc nữa.
//
// ⭐ LUẬT ĐO — chỉ tính NỢ khi có BẰNG CHỨNG phải làm (§2). Hệ KHÔNG có cột nào ghi lớp nào bắt
//   buộc ET/BTVN, nên suy từ hiện vật: có đề ET gắn buổi thì mới đòi ET, có doc BTVN thì mới đòi
//   BTVN. Thà bỏ sót còn hơn nêu tên người đang làm đúng.
//   NGOẠI LỆ: **đánh giá là BẮT BUỘC với mọi buổi thường** — CEO đảo lại 14/08 ("đòi như ET").
// ============================================================================
import { supabase } from './supabase'
import { buoiAoCuaNgay } from './gami'

const LIMIT = 10000

const ngayVN = (v: any): string =>
  typeof v === 'string' ? v.slice(0, 10) : new Date(v).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const congNgay = (ngay: string, n: number): string =>
  new Date(Date.parse(ngay + 'T00:00:00Z') + n * 86400000).toISOString().slice(0, 10)
const lechNgay = (tu: string, den: string): number =>
  Math.round((Date.parse(den + 'T00:00:00Z') - Date.parse(tu + 'T00:00:00Z')) / 86400000)
// Đầu tuần = THỨ HAI (tuần BK, khớp `tuan.ts`). getUTCDay: CN=0.
const dauTuan = (ngay: string): string => {
  const d = new Date(Date.parse(ngay + 'T00:00:00Z'))
  const thu = d.getUTCDay()
  return congNgay(ngay, thu === 0 ? -6 : 1 - thu)
}

// ⭐ LỚP NÀO THẬT SỰ CHẠY ET / BTVN — SUY TỪ HÀNH VI, không bắt ai tick 46 lớp.
//
// CEO 14/08: *"Tất cả các lớp m vừa báo là thực tế chưa chạy ET, vì nhiều lý do khác nhau.
// M bỏ qua cái này. Những lớp thực sự chạy là những lớp còn lại. m chỉ care các lớp đã chạy"*.
//
// Đo 60 ngày (14/08) — tín hiệu TÁCH ĐÔI rất sạch, không phải nhiễu:
//   · 27 lớp ở 70–100% buổi có đề ET  (9B1 92% · 9A2 88% · 9S1/9C1 87% · nhóm 5A/6A 100%)
//   · 14 lớp ở 0–29%                  (12B1 4% · 12C1/8S0/8K1/9K2 0% · toàn bộ Tiếng Anh, Văn)
//   · ĐÚNG 1 lớp ở giữa (8B2 43%)
// Khoảng trống 43% → 74% đủ rộng để đặt ngưỡng mà không phải bịa. Lấy 60%.
//
// ⚠ Mẫu nhỏ thì KHÔNG phân loại: lớp mới mở 1–3 buổi chưa nói lên gì (5E1, 8V1 mỗi lớp 1 buổi).
//   Xếp nhầm một lớp mới vào "không chạy" là im lặng suốt, đúng lỗi bỏ-qua-âm-thầm.
const CUA_SO_PHAN_LOAI = 60
const NGUONG_CHAY = 0.6
const MAU_TOI_THIEU = 4

export type KhauLop = { chay: boolean; tyLe: number; soBuoi: number; duMau: boolean }
export type PhanLoaiLop = Map<string, { et: KhauLop; btvn: KhauLop }>

export async function phanLoaiLopTheoKhau(): Promise<PhanLoaiLop> {
  const homNay = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
  const tu = congNgay(homNay, -CUA_SO_PHAN_LOAI)
  const ds = await buoiKemHienVat(tu, homNay)
  const gom = new Map<string, { n: number; et: number; btvn: number }>()
  for (const b of ds) {
    const o = gom.get(b.lop_id) ?? { n: 0, et: 0, btvn: 0 }
    o.n++; if (b.coDeET) o.et++; if (b.coDocBTVN) o.btvn++
    gom.set(b.lop_id, o)
  }
  const ra: PhanLoaiLop = new Map()
  for (const [lopId, o] of gom) {
    const mk = (c: number): KhauLop => {
      const tyLe = o.n ? c / o.n : 0
      const duMau = o.n >= MAU_TOI_THIEU
      // Chưa đủ mẫu ⇒ coi như CÓ chạy: thà hỏi thừa một lớp mới còn hơn im lặng cả tháng.
      return { chay: duMau ? tyLe >= NGUONG_CHAY : true, tyLe, soBuoi: o.n, duMau }
    }
    ra.set(lopId, { et: mk(o.et), btvn: mk(o.btvn) })
  }
  return ra
}

export type BuoiHomQua = {
  lop: string; mon: string; buoiId: string
  etXong: boolean; coDeET: boolean
  lopChayET: boolean     // lớp này có thật sự chạy ET không (suy từ 60 ngày)
  thieuDe: boolean       // lớp CHẠY ET mà buổi này không có đề ⇒ nhiều khả năng QUÊN GÁN
  dgXong: boolean
  du: boolean            // đủ nghĩa vụ của buổi vừa dạy (ET nếu lớp chạy + có đề, + đánh giá)
}
export type BtvnDenHan = {
  lop: string; mon: string; buoiTruoc: string; treNgay: number; daGhiNhan: boolean
}
export type NoTuanLop = { lop: string; noET: number; noBTVN: number; noDanhGia: number; soBuoi: number }

export type BaoCaoVanHanh = {
  ngay: string; homQua: string; tuNgay: string
  buoiHomQua: BuoiHomQua[]
  btvn: BtvnDenHan[]        // lớp CÓ CA HÔM NAY ⇒ BTVN buổi trước đến hạn
  noTuan: NoTuanLop[]
  phamVi: string
  khongBiet: string[]
}

// Buổi thường trong khoảng, kèm cờ "có đề ET / có doc BTVN" — hiện vật quyết định có đòi hay không.
async function buoiKemHienVat(tu: string, den: string) {
  const { data: buois } = await supabase.from('buoi_hoc')
    .select('id, lop_id, ngay, et_dong_at, btvn_dong_at, danh_gia_xong_at, lop:lop_id(ten_lop, mon)')
    .eq('loai', 'thuong').neq('trang_thai', 'huy').gte('ngay', tu).lte('ngay', den).limit(LIMIT)
  const ds = ((buois ?? []) as any[]).map((b) => ({ ...b, ngay: ngayVN(b.ngay) }))
  if (!ds.length) return ds.map((b) => ({ ...b, coDeET: false, coDocBTVN: false }))

  // Tài liệu bám (lop_id, ngay) chứ KHÔNG có FK về buoi_hoc ⇒ ghép cặp ở JS theo khoá tự nhiên.
  const lopIds = [...new Set(ds.map((b) => b.lop_id))]
  const { data: tls } = await supabase.from('tai_lieu')
    .select('loai, lop_id, ngay').in('loai', ['et', 'btvn']).in('lop_id', lopIds).limit(LIMIT)
  const et = new Set<string>(); const btvn = new Set<string>()
  for (const t of (tls ?? []) as any[]) {
    const k = `${t.lop_id}|${ngayVN(t.ngay)}`
    if (t.loai === 'et') et.add(k); else btvn.add(k)
  }
  return ds.map((b) => ({ ...b, coDeET: et.has(`${b.lop_id}|${b.ngay}`), coDocBTVN: btvn.has(`${b.lop_id}|${b.ngay}`) }))
}

export async function baoCaoVanHanh(): Promise<BaoCaoVanHanh> {
  const homNay = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
  const homQua = congNgay(homNay, -1)
  const tuNgay = dauTuan(homNay)

  // Quét từ đầu tuần (hoặc sớm hơn nếu hôm qua rơi trước đầu tuần — sáng thứ Hai).
  const tuQuet = tuNgay < homQua ? tuNgay : homQua
  const [ds, aoHomNay, phanLoai] = await Promise.all([
    buoiKemHienVat(tuQuet, homQua),
    // Lớp nào HÔM NAY có ca — nguồn của nghĩa vụ BTVN (chấm ở buổi kế).
    buoiAoCuaNgay(homNay).catch(() => []),
    phanLoaiLopTheoKhau(),
  ])
  const chayET = (lopId: string) => phanLoai.get(lopId)?.et.chay ?? true
  const chayBTVN = (lopId: string) => phanLoai.get(lopId)?.btvn.chay ?? true

  // ── ① HÔM QUA: ET + đánh giá của buổi vừa dạy ───────────────────────────────
  const buoiHomQua: BuoiHomQua[] = ds.filter((b) => b.ngay === homQua).map((b) => {
    const etXong = !!b.et_dong_at, dgXong = !!b.danh_gia_xong_at
    const lopChayET = chayET(b.lop_id)
    // ⭐ Lớp CHẠY ET mà buổi lại không có đề = tín hiệu MỚI, trước đây bị nuốt.
    //   Bản trước im ở mọi buổi thiếu đề ⇒ lớp chạy ET đều 87% mà quên gán đề một buổi thì
    //   hệ cũng im, và đó chính là chỗ đáng hỏi nhất (quên soạn/quên gán, không phải không làm).
    const thieuDe = lopChayET && !b.coDeET
    return {
      lop: b.lop?.ten_lop ?? '?', mon: b.lop?.mon ?? '', buoiId: b.id,
      etXong, coDeET: b.coDeET, lopChayET, thieuDe, dgXong,
      du: (!lopChayET || !b.coDeET || etXong) && dgXong,
    }
  }).sort((a, b) => a.lop.localeCompare(b.lop))

  // ── ② BTVN ĐẾN HẠN HÔM NAY: lớp có ca hôm nay ⇒ BTVN buổi TRƯỚC phải xong ──
  const btvn: BtvnDenHan[] = []
  const lopCoCaHomNay = new Set((aoHomNay as any[]).map((a) => a.lop.id))
  if (lopCoCaHomNay.size) {
    // Buổi gần nhất TRƯỚC hôm nay của mấy lớp đó (quét lùi 30 ngày là đủ cho mọi nhịp lớp).
    const truoc = await buoiKemHienVat(congNgay(homNay, -30), congNgay(homNay, -1))
    const ganNhat = new Map<string, any>()
    for (const b of truoc) {
      if (!lopCoCaHomNay.has(b.lop_id)) continue
      const cu = ganNhat.get(b.lop_id)
      if (!cu || b.ngay > cu.ngay) ganNhat.set(b.lop_id, b)
    }
    for (const b of ganNhat.values()) {
      if (!chayBTVN(b.lop_id)) continue  // lớp này không chạy BTVN ⇒ không có nghĩa vụ
      if (!b.coDocBTVN) continue         // buổi không có doc ⇒ không có gì để chấm
      btvn.push({
        lop: b.lop?.ten_lop ?? '?', mon: b.lop?.mon ?? '', buoiTruoc: b.ngay,
        treNgay: lechNgay(b.ngay, homNay), daGhiNhan: !!b.btvn_dong_at,
      })
    }
    btvn.sort((a, b) => Number(a.daGhiNhan) - Number(b.daGhiNhan) || b.treNgay - a.treNgay || a.lop.localeCompare(b.lop))
  }

  // ── ③ TỪ ĐẦU TUẦN: nợ tích luỹ theo lớp ────────────────────────────────────
  const gom = new Map<string, NoTuanLop>()
  for (const b of ds) {
    if (b.ngay < tuNgay) continue
    const ten = b.lop?.ten_lop ?? '?'
    const o = gom.get(ten) ?? { lop: ten, noET: 0, noBTVN: 0, noDanhGia: 0, soBuoi: 0 }
    o.soBuoi++
    if (chayET(b.lop_id) && b.coDeET && !b.et_dong_at) o.noET++
    // BTVN chỉ tính nợ khi ĐÃ QUA ngày có ca kế — ở đây xấp xỉ bằng "buổi đã đủ già".
    // Buổi hôm qua chưa tới hạn BTVN, đưa vào là lặp lại đúng cái sai nhịp đã nêu ở đầu file.
    if (chayBTVN(b.lop_id) && b.coDocBTVN && !b.btvn_dong_at && lechNgay(b.ngay, homNay) >= 2) o.noBTVN++
    if (!b.danh_gia_xong_at) o.noDanhGia++
    gom.set(ten, o)
  }
  const noTuan = [...gom.values()]
    .filter((o) => o.noET || o.noBTVN || o.noDanhGia)
    .sort((a, b) => (b.noET + b.noBTVN + b.noDanhGia) - (a.noET + a.noBTVN + a.noDanhGia) || a.lop.localeCompare(b.lop))

  return {
    ngay: homNay, homQua, tuNgay,
    buoiHomQua, btvn, noTuan,
    phamVi: `Buổi thường TOÀN HỆ. Hôm qua ${homQua}: ${buoiHomQua.length} buổi. `
      + `Nợ tính từ đầu tuần ${tuNgay}. CHỈ tính lớp thật sự chạy khâu đó — suy từ 60 ngày gần nhất `
      + `(≥60% buổi có đề/doc thì coi là có chạy). Lớp không chạy ET/BTVN bị bỏ hẳn khỏi mọi con số. `
      + `Đánh giá đòi ở MỌI buổi thường.`,
    khongBiet: [
      'Lớp "có chạy ET/BTVN hay không" là SUY từ 60 ngày gần nhất, không phải ai đó khai. Lớp mới mở dưới 4 buổi thì mặc định coi như có chạy (thà hỏi thừa còn hơn im).',
      'Không biết ai là người phải fill từng khâu; báo cáo dừng ở mức LỚP, việc gán người là của người đọc.',
      'BTVN của buổi hôm qua chưa tới hạn (chấm ở buổi kế) nên cố ý không nằm trong mục "hôm qua".',
    ],
  }
}
