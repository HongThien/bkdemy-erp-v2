// KHUÔN ĐÁP SỐ của một câu — thuộc tính của CÂU, KHÔNG phải của bản đồ (26/10, Thùy "chuyển hẳn sang bản đồ + kho mới").
//
// Khuôn = "máy đọc đáp số của câu này bằng bộ nào + sinh nhiễu bằng bộ nào + thứ tự rule ưu tiên + cờ đọc số"
// (TEXT_DANG / SPECIAL_DANG / ANSWER_DANG / UU_TIEN / CHAM_LA_NHAN ở mcq-auto.mjs, TEXT_FN ở mcq-sinh.mjs,
// KHUON_MAY_KY ở dưới). Trước 26/10 các bảng đó tra theo MÃ DẠNG CŨ của câu (`dang_chinh`), nên pipeline MCQ
// dính chặt bản đồ cũ. Giờ:
//   • ĐƠN VỊ chọn câu / báo cáo / duyệt = dạng bài bản đồ mới (NDB…, view `bdm_cau_hoi`).
//   • KHUÔN là một nhãn riêng của câu, đọc qua MỘT chỗ duy nhất (`khuonSql`) — mã khuôn hiện có = chép NGUYÊN mã
//     dạng cũ (đã đóng băng, không còn nghĩa bản đồ; đổi tên khuôn là đổi hành vi máy nên không đổi).
//   • Nguồn khuôn:  bảng `<kho>_cau_khuon` nếu ĐÃ có (migration nháp supabase/migrations-nhap/202610261852_kho_cau_khuon_dap_so.sql, chờ Thùy
//     duyệt) — ngược lại cột lưu trữ `dang_chinh` (bỏ mã chờ …000000). Có bảng ⇒ tự chuyển, không sửa script nào.
//   • Câu KHÔNG có khuôn ⇒ "khuôn chung": AST nếu đáp số là 1 giá trị hữu tỉ, `--theo-dap-so` ép nhánh sinh nhiễu từ
//     đáp số. Khối (đọc phẩy thập phân, khối ≤4 "24,51" là 2 số) lấy từ dạng bài NDB của câu.

export const laMaCho = (ma) => /0{6}$/.test(String(ma ?? '')) // mã dạng chờ T1xx000000 / T3xx000000 — không phải khuôn

// Bảng khuôn đã tồn tại chưa (migration nháp). → { dai: bool, hgt: bool }
export async function coBangKhuon(c) {
  const { rows } = await c.query(`select to_regclass('public.dai_cau_khuon') is not null dai, to_regclass('public.hgt_cau_khuon') is not null hgt`)
  return rows[0]
}
// Biểu thức SQL trả khuôn của câu `alias` (bảng gốc `kho`_cau_hoi). NULL = câu chưa có khuôn (khuôn chung).
export function khuonSql(kho, alias, coBang) {
  if (coBang?.[kho]) return `(select k.khuon from ${kho}_cau_khuon k where k.ma_cau = ${alias}.ma_cau)`
  return `(case when ${alias}.dang_chinh is not null and ${alias}.dang_chinh !~ '0{6}$' then ${alias}.dang_chinh end)`
}
// Khoá tra bảng dispatch của máy (mcq-auto / mcq-sinh / kho-quet). Có khuôn ⇒ chính khuôn. Không có ⇒ khoá TRỐNG mang
// khối (`T1kk000000`, không trùng khuôn nào ⇒ rơi nhánh chung; khoiCuaDang() đọc được khối). Không biết khối ⇒ `duPhong`
// (luồng cũ theo mã dạng cấp 1 truyền chính dang_chinh ⇒ y hệt trước).
export function khoaMay(khuon, khoi, duPhong = null) {
  if (khuon) return khuon
  const k = Number(khoi)
  if (Number.isInteger(k) && k > 0) return `T1${String(k).padStart(2, '0')}000000`
  return duPhong
}

// WHITELIST KHUÔN máy được KÝ đáp số kho (kho-quet-dapso.mjs, spec-kho-chuan.md §2 mức A) — chuyển từ kho-quet-dapso.mjs
// sang đây 26/10, KHÔNG đổi nội dung. Khoá = mã khuôn (lịch sử = mã dạng cũ). `chamLaNhan`: dấu chấm giữa 2 số = phép
// NHÂN (lớp 6 số tự nhiên, lớp 8 hằng đẳng thức). Lý do từng khuôn loại ra: xem đầu kho-quet-dapso.mjs.
const C = { chamLaNhan: true }
export const KHUON_MAY_KY = {
  // K3–K4: cộng trừ số tự nhiên, tính thuận tiện, nhân
  T103020103: {}, T104020101: {}, T104020102: {}, T104020103: {}, T104020104: {},
  T14T040101: {}, T14T040102: {}, T14T040103: {},
  // K5: biểu thức số tự nhiên, phân số, hỗn số, số thập phân (KHÔNG chia đặt tính, KHÔNG quy đồng, KHÔNG đơn vị)
  T105010202: {}, T105010203: {}, T105020201: {}, T105020202: {}, T105020203: {}, T105020204: {},
  T105030101: {}, T105030201: {}, T105030202: {}, T105030203: {}, T105040103: {}, T105040201: {}, T105040202: {}, T105040204: {},
  T15T020101: {}, T15T020102: {},
  // K6: số tự nhiên — dấu chấm là nhân
  T106020202: C, T106020203: C, T106020301: C, T106020302: C, T106020303: C,
  T106020401: C, T106020402: C, T106020403: C, T106020501: C, T106020503: C,
  // K7: số hữu tỉ (tính, tìm x, luỹ thừa, thứ tự phép tính)
  T107010201: {}, T107010202: {}, T107010203: {}, T107010206: {}, T107010207: {}, T107010301: {},
  T107010401: {}, T107010403: {}, T107010404: {}, T10770330201: {}, T107703330301: {},
  // K8–K9
  T108020402: C, T109020101: {}, T109020102: {},
}
