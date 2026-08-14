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

export type BuoiHomQua = {
  lop: string; mon: string; buoiId: string
  etXong: boolean; coDeET: boolean
  dgXong: boolean
  du: boolean            // đủ nghĩa vụ của buổi vừa dạy (ET nếu có đề, + đánh giá)
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
  const [ds, aoHomNay] = await Promise.all([
    buoiKemHienVat(tuQuet, homQua),
    // Lớp nào HÔM NAY có ca — nguồn của nghĩa vụ BTVN (chấm ở buổi kế).
    buoiAoCuaNgay(homNay).catch(() => []),
  ])

  // ── ① HÔM QUA: ET + đánh giá của buổi vừa dạy ───────────────────────────────
  const buoiHomQua: BuoiHomQua[] = ds.filter((b) => b.ngay === homQua).map((b) => {
    const etXong = !!b.et_dong_at, dgXong = !!b.danh_gia_xong_at
    return {
      lop: b.lop?.ten_lop ?? '?', mon: b.lop?.mon ?? '', buoiId: b.id,
      etXong, coDeET: b.coDeET, dgXong,
      // "Đủ" = làm hết cái ĐÁNG LẼ phải làm. Không có đề ET thì ET không nằm trong nghĩa vụ.
      du: (!b.coDeET || etXong) && dgXong,
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
      if (!b.coDocBTVN) continue   // không có doc BTVN ⇒ không có nghĩa vụ, im
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
    if (b.coDeET && !b.et_dong_at) o.noET++
    // BTVN chỉ tính nợ khi ĐÃ QUA ngày có ca kế — ở đây xấp xỉ bằng "buổi đã đủ già".
    // Buổi hôm qua chưa tới hạn BTVN, đưa vào là lặp lại đúng cái sai nhịp đã nêu ở đầu file.
    if (b.coDocBTVN && !b.btvn_dong_at && lechNgay(b.ngay, homNay) >= 2) o.noBTVN++
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
      + `Nợ tính từ đầu tuần ${tuNgay}. ET chỉ đòi khi buổi có đề, BTVN chỉ đòi khi buổi có doc — `
      + `hệ không có chỗ ghi lớp nào bắt buộc, nên suy từ hiện vật. Đánh giá đòi ở MỌI buổi thường.`,
    khongBiet: [
      'Không biết lớp nào ĐÁNG LẼ phải có ET/BTVN mà chưa ai soạn đề — những buổi đó hệ im, không tính là nợ.',
      'Không biết ai là người phải fill từng khâu; báo cáo dừng ở mức LỚP, việc gán người là của người đọc.',
      'BTVN của buổi hôm qua chưa tới hạn (chấm ở buổi kế) nên cố ý không nằm trong mục "hôm qua".',
    ],
  }
}
