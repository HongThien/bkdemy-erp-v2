// Data-layer ĐÁNH GIÁ KẾT QUẢ HỌC TẬP (seam) — nạp lần đo → gọi engine PURE `src/gami/danhgia.js`
// → trả **STAT SHEET SẠCH**. Theo `spec-danhgia-hoctap.md` + `PLAN-danhgia-hoctap.md` (Thùy duyệt 07-22).
//
// ⭐ NGUYÊN TẮC (spec §0): CODE TÍNH SỐ, CLAUDE PHÁN. Tầng này chỉ ra BẢNG SỐ + đề xuất có lý do.
//    Không viết văn, không tự đổi state. Người duyệt mới ghi (xem `duyetLevel`).
// ⭐ Mastery KHÔNG lưu — suy động mỗi lần gọi (CLAUDE.md §1). Tầng này cũng KHÔNG cache.
//
// ⚠ HAI BẪY ĐÃ DÍNH THẬT, mọi query ở đây phải né (HANDOFF ②):
//  1. `ma_dang` KHÔNG unique xuyên môn — 30 mã TRÙNG SỐ giữa `dai_ban_do`/`khtn_ban_do` (07-14 ghi
//     17, nay 30 và còn tăng). ⇒ có `mon` trong tay lúc nào thì dùng NGAY (`khoCuaMon`), CẤM gộp
//     2 bản đồ rồi join bằng `ma_dang` (lần verify đầu 07-22 nhân đôi 18.102 → 23.429 dòng đo).
//  2. Buổi BÙ có `lop_id` NULL ⇒ MẤT nhãn môn (134 lần đo ET). Phải lùi về buổi GỐC qua
//     `buoi_hoc_hs.bu_cho_buoi_id` mới lấy được môn. Bỏ qua = im lặng đánh rơi data thật.
import { supabase } from './supabase'
import { masteryOfDang, MASTERY_CONFIG, RESULT_VALUE } from '../gami/mastery.js'
import {
  DANHGIA_CONFIG, cuaSoCua, cuaSoTruoc, cuoiCuaSo, chuoiDiemChuyenDe, chamPha1, chamPha2,
  trungBinhTruot3, docAmLienTiep, dangDoiBucketXau, deXuatLevelKienThuc, deXuatLevelThaiDo,
  bucketOfScore, BUCKET_RANK,
} from '../gami/danhgia.js'
import { khoCuaMon } from './tailieu'

const LIMIT = 10000

// ⭐ MỐC 0.5 = 2 NGƯỠNG, KHÔNG PHẢI MÂU THUẪN (Thùy 07-22 — Claude hiểu sai lúc đầu, đã sửa):
//   NHÃN mức là "đánh giá chung" → 0.5 = **cần luyện**, dùng thẳng `masteryOfDang` ⇒ khớp màn
//   "Kết quả học tập", KHÔNG đẻ ra sự thật thứ hai.
//   TƯ CÁCH THÀNH VIÊN của diện bổ trợ mới dùng 2 mốc lệch (trễ): vào khi < 0.5 · ra khi > 0.5 ·
//   đúng 0.5 thì giữ nguyên trạng thái đang có. Logic ở `deXuatLevelKienThuc` (gami/danhgia.js).
//   Vì "ra" phụ thuộc trạng thái CŨ nên phải truyền `daMo` = dạng đang có trong đợt bổ trợ
//   (dòng `bo_tro_yeu_dang` chưa `dong_at`) — xem `napDangDangMo`.

export type LoaiLevel = 'kien_thuc' | 'thai_do'
export type DoEval = { value: number; t: string; src: string }

// ── STAT SHEET (spec §6: "CLAUDE đọc stat sheet của candidate") ────────────────────────
export type DangStat = {
  ma_dang: string
  ten_dang: string
  ten_chuyen_de: string
  muc_do: number | null
  score: number          // mastery GỘP (ET+MT+BTVN) — bản máy level dùng, spec §9
  scoreEtMt: number | null // mastery chỉ nguồn GIÁM SÁT — để bắt cờ "BTVN che" (PLAN §1.D)
  n: number              // tổng lần đo = độ tin (KHÁC 5 lần dùng tính điểm)
  muc: 'dat' | 'can_luyen' | 'yeu' // đánh giá CHUNG (masteryOfDang) — 0.5 = cần luyện
  // "TRƯỚC" = mastery tính TỚI cuối cửa sổ liền trước (không phải "của riêng cửa sổ đó": vẫn 5
  // lần đo gần nhất tính tới mốc cắt, chỉ bỏ lần đo SAU mốc — đúng engine, xem `cuoiCuaSo`).
  // `score`/`muc` ở trên là HIỆN TẠI (realtime). null = trước mốc chưa có lần đo nào ⇒ không so.
  scoreTruoc: number | null
  mucTruoc: 'dat' | 'can_luyen' | 'yeu' | null
  daMo: boolean          // đang có trong đợt bổ trợ yếu (bo_tro_yeu_dang chưa dong_at)
  trongDien: boolean     // sau khi áp 2 mốc trễ — nguồn sự thật cho HÀNH ĐỘNG
  cuoiCungAt: string     // lần đo gần nhất → cờ "cũ" nếu > 30 ngày (spec §1)
}
export type ChuyenDeStat = {
  ma_chuyen_de: string
  ten_chuyen_de: string
  chuoi: { cuaSo: string; score: number | null; n: number; itLanDo: boolean }[] // đủ mốc, khuyết = null
  cham: any                 // pha 1 (so lớp) hoặc pha 2 (so chính mình) — engine quyết
  vuotTbLopMuot: (number | null)[] // đường B đã mượt MA-3 (null = chưa đủ 3 chu kỳ)
  docAm: number             // số nhịp dốc B-mượt âm liên tiếp → trigger ngầm
  dangDoiBucketXau: { ma_dang: string; tu: string; den: string }[] // dạng con tụt bucket = ứng viên bổ trợ sẵn (spec §2.A①)
}
export type StatSheetHS = {
  hoc_sinh_id: string
  ho_ten: string
  mon: string
  levelKienThuc: number     // hiện tại (không có dòng = 0)
  levelThaiDo: number
  dangs: DangStat[]
  chuyenDes: ChuyenDeStat[]
  soLop: SoLopBai[]         // so với TB lớp theo TỪNG BÀI giám sát (≤8 bài gần nhất) — vùng 3 popup
  soLopKem: SoLopBai[]      // ⑤ so lớp GỘP ET+MT+BTVN (Thùy 08-17: càng nhiều nguồn càng tốt) — KHÁC soLop, xem lý do ở nơi tính
  coSoLopKem: boolean       // ⑤ ≥2/3 trong 3 bài gần nhất (gộp) dưới 80% TB lớp bài đó — CHỈ dùng cho deXuatLevelKienThuc, KHÔNG dùng cho candidate-list (xem coSoLopET/MT)
  coSoLopET: boolean        // Thùy 08-23: TB 4 buổi ET gần nhất < 90% TB lớp cùng 4 buổi — candidate-list kênh 3
  coSoLopMT: boolean        // Thùy 08-23: MT là test tháng, hiếm nhưng quan trọng — bài MT GẦN NHẤT (n≥1) < 90% TB lớp bài đó — candidate-list kênh 4
  thaiDo: { thai_do: string; t: string }[]
  coChuongDo: boolean       // ③ TA bấm lúc chấm BTVN
  coLoTienQuyet: boolean    // ④ GV báo hổng kiến thức NỀN
  deXuatKienThuc: any       // { deXuat, lyDo[], bangChung } — engine, KHÔNG tự ghi
  deXuatThaiDo: any
}

// So với TB lớp theo TỪNG BÀI có giám sát (1 buổi = 1 bài): điểm của em, TB lớp bài đó, và
// xếp hạng trong số các bạn CÙNG LÀM bài đó. Chỉ nguồn giám sát (ET/MT) — BTVN tự làm ở nhà
// không đưa vào so hạng (không giám sát ⇒ không công bằng để xếp hạng).
export type SoLopBai = {
  buoi_hoc_id: string
  t: string                 // thời điểm bài (graded_at đại diện) — để xếp thứ tự + suy cửa sổ
  cuaSo: string             // nửa-tháng chứa bài
  diemHS: number            // điểm trung bình của em trong bài đó (0–1)
  tbLop: number             // trung bình lớp CÙNG bài
  hang: number              // xếp hạng của em (1 = cao nhất) trong các bạn cùng làm bài
  siSo: number              // số bạn cùng làm bài (mẫu số của hạng)
}

// ── NẠP LẦN ĐO (1 lần cho N học sinh — bulk, không gọi từng HS) ────────────────────────
type DoRow = { hoc_sinh_id: string; ma_dang: string; value: number; t: string; src: string; buoi_hoc_id: string | null }

// Môn của lần đo = `lop.mon` của buổi; buổi BÙ (lop_id null) lùi về buổi gốc theo TỪNG HS
// (1 buổi bù gom HS từ nhiều lớp/môn khác nhau → không thể suy 1 môn cho cả buổi).
async function napLanDo(hsIds: string[], mon: string): Promise<DoRow[]> {
  if (!hsIds.length) return []
  const { data: grades, error } = await supabase
    .from('gami_grades')
    .select('hoc_sinh_id, result, graded_at, buoi_hoc_id, prob:problem_id(phase, ma_dang)')
    .in('hoc_sinh_id', hsIds)
    .limit(LIMIT)
  if (error) throw error
  const rows = (grades ?? []) as any[]

  // Môn của buổi: 1 query cho mọi buổi liên quan.
  const buoiIds = [...new Set(rows.map((r) => r.buoi_hoc_id).filter(Boolean))]
  const monCuaBuoi = new Map<string, string | null>()
  const buoiThieuMon: string[] = []
  if (buoiIds.length) {
    const { data: buois } = await supabase.from('buoi_hoc').select('id, lop:lop_id(mon)').in('id', buoiIds).limit(LIMIT)
    for (const b of (buois ?? []) as any[]) {
      const m = b.lop?.mon ?? null
      monCuaBuoi.set(b.id, m)
      if (!m) buoiThieuMon.push(b.id) // buổi bù — xử ở dưới
    }
  }
  // Bẫy #2: buổi bù → môn theo LỚP GỐC của từng HS.
  const monBuTheoHs = new Map<string, string>() // `${buoiId}|${hsId}` → mon
  if (buoiThieuMon.length) {
    const { data: links } = await supabase.from('buoi_hoc_hs')
      .select('buoi_hoc_id, hoc_sinh_id, goc:bu_cho_buoi_id(lop:lop_id(mon))')
      .in('buoi_hoc_id', buoiThieuMon).limit(LIMIT)
    for (const l of (links ?? []) as any[]) {
      const m = l.goc?.lop?.mon
      if (m) monBuTheoHs.set(`${l.buoi_hoc_id}|${l.hoc_sinh_id}`, m)
    }
  }

  const out: DoRow[] = []
  for (const r of rows) {
    const p = r.prob
    if (!p?.ma_dang) continue
    // Chỉ nguồn có trọng số > 0 (et/mt/btvn — spec §9). ingame/dg/bt weight 0 → loại tại đây,
    // KHÔNG để lọt xuống engine rồi mới rụng (lọt xuống thì `n` đếm sai độ tin).
    if (!(DANHGIA_CONFIG.WEIGHT as any)[p.phase]) continue
    const value = RESULT_VALUE[r.result as keyof typeof RESULT_VALUE]
    if (value === undefined) continue
    const m = monCuaBuoi.get(r.buoi_hoc_id) ?? monBuTheoHs.get(`${r.buoi_hoc_id}|${r.hoc_sinh_id}`) ?? null
    if (m !== mon) continue // scope MÔN (§1.6) — buổi bù đã lùi về lớp gốc ở trên
    out.push({ hoc_sinh_id: r.hoc_sinh_id, ma_dang: p.ma_dang, value, t: r.graded_at, src: p.phase, buoi_hoc_id: r.buoi_hoc_id ?? null })
  }
  return out
}

// Bản đồ dạng → chuyên đề + tên + độ khó, tra ĐÚNG 1 bảng theo môn (bẫy #1).
async function napBanDo(mon: string, maDangs: string[]) {
  const K = khoCuaMon(mon)
  const info = new Map<string, { ten_dang: string; ma_chuyen_de: string; ten_chuyen_de: string; muc_do: number | null }>()
  if (!maDangs.length) return info
  const { data } = await supabase.from(K.banDoTbl)
    .select('ma_dang, ten_dang, ma_chuyen_de, ten_chuyen_de, muc_do')
    .in('ma_dang', maDangs).limit(LIMIT)
  for (const d of (data ?? []) as any[]) {
    info.set(d.ma_dang, { ten_dang: d.ten_dang, ma_chuyen_de: d.ma_chuyen_de, ten_chuyen_de: d.ten_chuyen_de, muc_do: d.muc_do ?? null })
  }
  return info
}

// ── STAT SHEET cho CẢ LỚP (1 lượt) ────────────────────────────────────────────────────
// Vì sao theo LỚP chứ không theo HS: pha 1 (§2.A①) chấm bằng SO LỚP → bắt buộc có điểm của
// mọi bạn cùng lớp trong cùng cửa sổ mới tính được rank/trung vị. Gọi từng HS là không đủ data.
export async function getStatSheetLop(lopId: string): Promise<StatSheetHS[]> {
  const { data: lop } = await supabase.from('lop').select('id, mon, ten_lop, khoi').eq('id', lopId).single()
  if (!lop) return []
  const mon = (lop as any).mon as string

  const { data: roster } = await supabase.from('hoc_sinh_lop')
    .select('hoc_sinh_id, hoc_sinh:hoc_sinh_id(id, ho_ten)')
    .eq('lop_id', lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  const hsMap = new Map<string, string>()
  for (const r of (roster ?? []) as any[]) if (r.hoc_sinh) hsMap.set(r.hoc_sinh.id, r.hoc_sinh.ho_ten)
  const hsIds = [...hsMap.keys()]
  if (!hsIds.length) return []

  const [doRows, levels, thaiDoRows, canhBao, dangDangMo] = await Promise.all([
    napLanDo(hsIds, mon),
    getLevels(hsIds, mon),
    napThaiDo(hsIds),
    napCanhBao(hsIds),
    napDangDangMo(hsIds, mon),
  ])
  const banDo = await napBanDo(mon, [...new Set(doRows.map((r) => r.ma_dang))])
  const cdTen = new Map<string, string>()
  for (const info of banDo.values()) cdTen.set(info.ma_chuyen_de, info.ten_chuyen_de)

  // Gom: HS → dạng → lần đo (2 bản: GỘP và chỉ-GIÁM-SÁT, để bắt cờ "BTVN che").
  const byHS = new Map<string, { dang: Map<string, DoEval[]>; dangEtMt: Map<string, DoEval[]>; cd: Map<string, DoEval[]> }>()
  for (const r of doRows) {
    const info = banDo.get(r.ma_dang)
    if (!info) continue // dạng không thuộc bản đồ MÔN này → bỏ (verify 07-22: 0 dạng mồ côi)
    let h = byHS.get(r.hoc_sinh_id)
    if (!h) { h = { dang: new Map(), dangEtMt: new Map(), cd: new Map() }; byHS.set(r.hoc_sinh_id, h) }
    const ev: DoEval = { value: r.value, t: r.t, src: r.src }
    push(h.dang, r.ma_dang, ev)
    if (r.src !== 'btvn') push(h.dangEtMt, r.ma_dang, ev)
    push(h.cd, info.ma_chuyen_de, ev) // tầng chuyên đề: THẲNG CÂU, mọi dạng con
  }

  // Điểm chuyên đề của CẢ LỚP theo cửa sổ → nền cho pha 1 (so lớp) + đường B (vượt TB lớp).
  // { ma_chuyen_de → cuaSo → [score của từng HS] }
  const lopTheoCd = new Map<string, Map<string, number[]>>()
  const chuoiCuaHs = new Map<string, Map<string, ReturnType<typeof chuoiDiemChuyenDe>>>()
  for (const [hsId, h] of byHS) {
    const m = new Map<string, ReturnType<typeof chuoiDiemChuyenDe>>()
    for (const [cd, cau] of h.cd) {
      const chuoi = chuoiDiemChuyenDe(cau)
      m.set(cd, chuoi)
      let perWin = lopTheoCd.get(cd)
      if (!perWin) { perWin = new Map(); lopTheoCd.set(cd, perWin) }
      for (const p of chuoi) {
        if (p.diem == null) continue
        const arr = perWin.get(p.cuaSo) ?? []
        arr.push(p.diem.score)
        perWin.set(p.cuaSo, arr)
      }
    }
    chuoiCuaHs.set(hsId, m)
  }

  // ── SO LỚP THEO TỪNG BÀI (buổi giám sát) — nền cho vùng 3 popup ─────────────────────
  // 1 buổi = 1 bài. Điểm em trong bài = TB các câu giám sát của em buổi đó; TB lớp = TB điểm
  // của mọi bạn CÙNG làm bài. BTVN loại khỏi đây (không giám sát ⇒ xếp hạng không công bằng).
  const buoiMap = new Map<string, { t: string; perHS: Map<string, { sum: number; count: number }> }>()
  for (const r of doRows) {
    if (r.src === 'btvn' || !r.buoi_hoc_id) continue
    let b = buoiMap.get(r.buoi_hoc_id)
    if (!b) { b = { t: r.t, perHS: new Map() }; buoiMap.set(r.buoi_hoc_id, b) }
    if (Date.parse(r.t) > Date.parse(b.t)) b.t = r.t // mốc đại diện = câu chấm muộn nhất buổi
    const hh = b.perHS.get(r.hoc_sinh_id) ?? { sum: 0, count: 0 }
    hh.sum += r.value; hh.count++; b.perHS.set(r.hoc_sinh_id, hh)
  }
  const buoiTinh = [...buoiMap.entries()].map(([id, b]) => {
    const means = new Map<string, number>()
    for (const [hs, s] of b.perHS) means.set(hs, s.sum / s.count)
    return { buoi_hoc_id: id, t: b.t, cuaSo: cuaSoCua(b.t), means }
  })

  // ── SO LỚP KÊNH ⑤ (Thùy 08-17) — CÙNG PHÉP TÍNH TRÊN, KHÔNG LOẠI BTVN ───────────────
  // `soLop` ở trên loại BTVN vì dùng để XẾP HẠNG (không giám sát ⇒ không công bằng để so hạng).
  // Kênh ⑤ KHÔNG xếp hạng công khai, chỉ là 1 tín hiệu dò yếu — "càng nhiều nguồn tham khảo càng
  // tốt" (Thùy 08-17) nên gộp cả ET+MT+BTVN. 2 phép tính tách hẳn, không đụng `soLop`/vùng 3 popup
  // đang chạy thật. Dùng lại `doRows` đã nạp sẵn — không thêm query.
  const buoiMapKem = new Map<string, { t: string; perHS: Map<string, { sum: number; count: number }> }>()
  for (const r of doRows) {
    if (!r.buoi_hoc_id) continue
    let b = buoiMapKem.get(r.buoi_hoc_id)
    if (!b) { b = { t: r.t, perHS: new Map() }; buoiMapKem.set(r.buoi_hoc_id, b) }
    if (Date.parse(r.t) > Date.parse(b.t)) b.t = r.t
    const hh = b.perHS.get(r.hoc_sinh_id) ?? { sum: 0, count: 0 }
    hh.sum += r.value; hh.count++; b.perHS.set(r.hoc_sinh_id, hh)
  }
  const buoiTinhKem = [...buoiMapKem.entries()].map(([id, b]) => {
    const means = new Map<string, number>()
    for (const [hs, s] of b.perHS) means.set(hs, s.sum / s.count)
    return { buoi_hoc_id: id, t: b.t, cuaSo: cuaSoCua(b.t), means }
  })

  // ── ET-only / MT-only (Thùy 08-23) — TÁCH RIÊNG cho candidate-list MỚI (listCandidatesLop
  // kênh 3/4), KHÔNG đụng `soLopKem`/`coSoLopKem` ở trên (vẫn nguyên vẹn cho deXuatLevelKienThuc).
  // Trước đó kênh ⑤ gộp ET+MT+BTVN — Thùy 08-23 chốt tách hẳn 2 nguồn vì bản chất khác nhau
  // (ET đều đặn mỗi buổi, MT hiếm 1 lần/tháng nhưng trọng số cao nhất — "khung nào có MT thì
  // dựa MT là chính").
  function buoiTinhTheoNguon(nguon: string) {
    const m = new Map<string, { t: string; perHS: Map<string, { sum: number; count: number }> }>()
    for (const r of doRows) {
      if (r.src !== nguon || !r.buoi_hoc_id) continue
      let b = m.get(r.buoi_hoc_id)
      if (!b) { b = { t: r.t, perHS: new Map() }; m.set(r.buoi_hoc_id, b) }
      if (Date.parse(r.t) > Date.parse(b.t)) b.t = r.t
      const hh = b.perHS.get(r.hoc_sinh_id) ?? { sum: 0, count: 0 }
      hh.sum += r.value; hh.count++; b.perHS.set(r.hoc_sinh_id, hh)
    }
    return [...m.entries()].map(([id, b]) => {
      const means = new Map<string, number>()
      for (const [hs, s] of b.perHS) means.set(hs, s.sum / s.count)
      return { buoi_hoc_id: id, t: b.t, cuaSo: cuaSoCua(b.t), means }
    }).sort((a, b) => Date.parse(a.t) - Date.parse(b.t))
  }
  const buoiTinhET = buoiTinhTheoNguon('et')
  const buoiTinhMT = buoiTinhTheoNguon('mt')

  // Mốc cắt cho cột "TRƯỚC" = hết cửa sổ liền trước cửa sổ hiện tại (1 lần, dùng chung mọi dạng).
  const cuaSoHienTaiVal = cuaSoCua(Date.now())
  const cutTruoc = cuoiCuaSo(cuaSoTruoc(cuaSoHienTaiVal))

  const out: StatSheetHS[] = []
  for (const hsId of hsIds) {
    const h = byHS.get(hsId)
    const dangs: DangStat[] = []
    if (h) {
      for (const [ma, evs] of h.dang) {
        const info = banDo.get(ma)!
        const m = masteryOfDang(evs, MASTERY_CONFIG)
        if (!m) continue
        const mEtMt = h.dangEtMt.has(ma) ? masteryOfDang(h.dangEtMt.get(ma)!, MASTERY_CONFIG) : null
        const moiNhat = evs.reduce((a, b) => (Date.parse(b.t) > Date.parse(a.t) ? b : a))
        const score = (m as any).score as number
        const n = (m as any).n as number
        const daMo = dangDangMo.get(hsId)?.has(ma) ?? false
        // "TRƯỚC": chạy lại engine trên các lần đo TỚI mốc cắt (bỏ lần đo sau). null = trước
        // mốc chưa có lần đo nào (dạng mới xuất hiện cửa sổ này) ⇒ UI hiện "mới", không so delta.
        const evTruoc = evs.filter((e) => Date.parse(e.t) <= cutTruoc)
        const mTruoc = evTruoc.length ? masteryOfDang(evTruoc, MASTERY_CONFIG) : null
        dangs.push({
          ma_dang: ma, ten_dang: info.ten_dang, ten_chuyen_de: info.ten_chuyen_de, muc_do: info.muc_do,
          score, scoreEtMt: (mEtMt as any)?.score ?? null, n,
          muc: (m as any).muc, // đánh giá CHUNG — cùng engine với màn Kết quả học tập
          scoreTruoc: (mTruoc as any)?.score ?? null, mucTruoc: (mTruoc as any)?.muc ?? null,
          daMo,
          // 2 mốc trễ: đã mở thì ở lại tới khi > 0.5 · chưa mở thì phải < 0.5 + đủ độ tin.
          trongDien: daMo ? score <= DANHGIA_CONFIG.MOC : score < DANHGIA_CONFIG.MOC && n >= DANHGIA_CONFIG.GATE_N,
          cuoiCungAt: moiNhat.t,
        })
      }
    }
    dangs.sort((a, b) => a.score - b.score) // yếu nhất lên đầu — cái cần chú ý trước

    // Chuyên đề: chuỗi + chấm pha 1/2 + đường B mượt.
    const chuyenDes: ChuyenDeStat[] = []
    for (const [cd, chuoi] of chuoiCuaHs.get(hsId) ?? []) {
      const coDiem = chuoi.filter((p) => p.diem != null)
      // Pha 1 = cửa sổ ĐẦU TIÊN của chuyên đề (chưa có mốc bản thân) → so LỚP.
      // Pha 2 = từ cửa sổ thứ 2 → so CHÍNH MÌNH, giữ cả 2 số.
      let cham: any = null
      if (coDiem.length === 1) {
        const w = coDiem[0].cuaSo
        cham = chamPha1(coDiem[0].diem!.score, lopTheoCd.get(cd)?.get(w) ?? [])
      } else if (coDiem.length >= 2) {
        // ⚠ "Sau" phải là cửa sổ HIỆN TẠI hoặc liền trước — nếu chuyên đề lâu rồi chưa đo lại,
        // 2 mốc gần nhất CÓ DATA có thể lùi rất xa (vd tháng 7 khi giờ đã tháng 8). Dùng data đó
        // để kết luận "đang tụt" là SAI (CLAUDE.md §5: chưa-đo ≠ yếu — ở đây chưa-đo-LẠI ≠ đang-tụt).
        // Thùy 08-23: xác nhận đây là bug thật, fix recency, KHÔNG đổi ngưỡng bucket đi kèm.
        const cuaSoSau = coDiem[coDiem.length - 1].cuaSo
        if (cuaSoSau === cuaSoHienTaiVal || cuaSoSau === cuaSoTruoc(cuaSoHienTaiVal)) {
          const a = coDiem[coDiem.length - 2].diem!.score, b = coDiem[coDiem.length - 1].diem!.score
          cham = chamPha2(a, b)
        }
      }
      // Đường B: khoảng cách HS − TB lớp mỗi cửa sổ, rồi mượt MA-3 (spec §2.B).
      const vuot = chuoi.map((p) => {
        if (p.diem == null) return null
        const ds = lopTheoCd.get(cd)?.get(p.cuaSo) ?? []
        if (!ds.length) return null
        return p.diem.score - ds.reduce((x, y) => x + y, 0) / ds.length
      })
      const muot = trungBinhTruot3(vuot)
      // NET-BUCKET (spec §2.A①): chuyên đề tụt thì phải chỉ được dạng con nào tụt — đó chính là
      // danh sách ứng viên bổ trợ. Chỉ tính khi có ≥2 cửa sổ (cần mốc trước để so).
      let doiXau: { ma_dang: string; tu: string; den: string }[] = []
      if (coDiem.length >= 2 && h) {
        const evalsCuaCd: Record<string, DoEval[]> = {}
        for (const [ma, evs] of h.dang) if (banDo.get(ma)?.ma_chuyen_de === cd) evalsCuaCd[ma] = evs
        doiXau = dangDoiBucketXau(evalsCuaCd, coDiem[coDiem.length - 2].cuaSo, coDiem[coDiem.length - 1].cuaSo)
      }
      chuyenDes.push({
        ma_chuyen_de: cd,
        ten_chuyen_de: cdTen.get(cd) ?? cd,
        chuoi: chuoi.map((p) => ({ cuaSo: p.cuaSo, score: p.diem?.score ?? null, n: p.diem?.n ?? 0, itLanDo: !!p.diem?.itLanDo })),
        cham, vuotTbLopMuot: muot, docAm: docAmLienTiep(muot),
        dangDoiBucketXau: doiXau,
      })
    }

    // Vùng 3: 8 bài giám sát gần nhất em có tham gia, hiển thị cũ→mới.
    const soLop: SoLopBai[] = buoiTinh
      .filter((b) => b.means.has(hsId))
      .sort((a, b) => Date.parse(b.t) - Date.parse(a.t))
      .slice(0, 8)
      .map((b) => {
        const vals = [...b.means.values()]
        const diemHS = b.means.get(hsId)!
        const tbLop = vals.reduce((x, y) => x + y, 0) / vals.length
        // hạng 1 = cao nhất; đồng điểm cùng hạng (đếm số bạn điểm CAO HƠN + 1)
        const hang = vals.filter((v) => v > diemHS + 1e-9).length + 1
        return { buoi_hoc_id: b.buoi_hoc_id, t: b.t, cuaSo: b.cuaSo, diemHS, tbLop, hang, siSo: vals.length }
      })
      .reverse()

    // Kênh ⑤: cùng công thức trên `buoiTinhKem` (gộp BTVN). Gate n≥3 (nhất quán GATE_N toàn hệ):
    // < 3 bài tổng thì chưa đủ để kết luận, coSoLopKem giữ false.
    const soLopKem: SoLopBai[] = buoiTinhKem
      .filter((b) => b.means.has(hsId))
      .sort((a, b) => Date.parse(b.t) - Date.parse(a.t))
      .slice(0, 8)
      .map((b) => {
        const vals = [...b.means.values()]
        const diemHS = b.means.get(hsId)!
        const tbLop = vals.reduce((x, y) => x + y, 0) / vals.length
        const hang = vals.filter((v) => v > diemHS + 1e-9).length + 1
        return { buoi_hoc_id: b.buoi_hoc_id, t: b.t, cuaSo: b.cuaSo, diemHS, tbLop, hang, siSo: vals.length }
      })
      .reverse()
    // Thùy 08-18: so TRUNG BÌNH, không so từng bài riêng lẻ — mỗi ET chỉ 3-4 câu nên biên độ dao
    // động 1 bài rất lớn (1 câu sai lệch hẳn %). Gộp điểm HS và điểm lớp qua 3 bài rồi mới so 1 lần
    // — mượt nhiễu ngẫu nhiên của từng bài, giữ đúng gate n≥3 (đủ độ tin).
    const gan3Kem = soLopKem.slice(-3)
    const coSoLopKem = gan3Kem.length >= 3 && (() => {
      const tbHS = gan3Kem.reduce((s, b) => s + b.diemHS, 0) / gan3Kem.length
      const tbLop = gan3Kem.reduce((s, b) => s + b.tbLop, 0) / gan3Kem.length
      return tbHS < tbLop * 0.8
    })()

    // Kênh 3 (ET-only, candidate-list): TB các buổi ET TRONG 2 CỬA SỔ gần nhất (hiện tại + liền
    // trước) < 90% TB lớp cùng các buổi đó (average-vs-average, chống nhiễu 1-bài của kênh ⑤ cũ
    // nhưng KHÔNG gộp nguồn). Thùy 08-23 (vòng 3): BỎ luật cứng "đủ 4 buổi" — đo thật cho thấy đòi
    // 4 buổi NẰM TRONG đúng 2 cửa sổ (~1 tháng) làm kênh gần như vô hiệu (1,3% roster) vì lớp không
    // học ET đều ≥1 lần/tuần. Gate hạ còn n≥2 (đủ để lấy trung bình, chống 1 bài lẻ) — phạm vi 2 cửa
    // sổ tự nó ĐÃ giới hạn recency rồi, không cần thêm ngưỡng số lượng cứng chồng lên.
    const etTrong2CuaSo = buoiTinhET.filter((b) => b.means.has(hsId) && (b.cuaSo === cuaSoHienTaiVal || b.cuaSo === cuaSoTruoc(cuaSoHienTaiVal)))
    const coSoLopET = etTrong2CuaSo.length >= 2 && (() => {
      const tbHS = etTrong2CuaSo.reduce((s, b) => s + b.means.get(hsId)!, 0) / etTrong2CuaSo.length
      const tbLop = etTrong2CuaSo.reduce((s, b) => s + [...b.means.values()].reduce((x, y) => x + y, 0) / b.means.size, 0) / etTrong2CuaSo.length
      return tbHS < tbLop * 0.9
    })()

    // Kênh 4 (MT-only, candidate-list): bài MT GẦN NHẤT (n≥1 — MT hiếm 1 lần/tháng nhưng quan
    // trọng, không đòi n≥3 như ET/dạng) < 90% TB lớp bài đó — cũng giới hạn 2 cửa sổ như kênh 3.
    const mtGanNhat = buoiTinhMT.filter((b) => b.means.has(hsId) && (b.cuaSo === cuaSoHienTaiVal || b.cuaSo === cuaSoTruoc(cuaSoHienTaiVal))).at(-1)
    const coSoLopMT = !!mtGanNhat && (() => {
      const diemHS = mtGanNhat.means.get(hsId)!
      const tbLop = [...mtGanNhat.means.values()].reduce((x, y) => x + y, 0) / mtGanNhat.means.size
      return diemHS < tbLop * 0.9
    })()

    const td = thaiDoRows.filter((r) => r.hoc_sinh_id === hsId).map((r) => ({ thai_do: r.thai_do, t: r.t }))
    const cb = canhBao.filter((r) => r.hoc_sinh_id === hsId)
    // 'btvn' = báo lúc chấm BTVN · 'danh_gia' = báo lúc Đánh giá sau buổi (Thùy 08-23, cùng nút
    // 🚨 AlertModal, khác chỗ bấm) · 'chuong_do' = giá trị chung dự phòng — cả 3 đều là ③ chuông đỏ.
    const coChuongDo = cb.some((r) => r.nguon === 'btvn' || r.nguon === 'danh_gia' || r.nguon === 'chuong_do')
    const coLoTienQuyet = cb.some((r) => r.nguon === 'gv_tien_quyet')
    const lv = levels.get(hsId)

    out.push({
      hoc_sinh_id: hsId, ho_ten: hsMap.get(hsId)!, mon,
      levelKienThuc: lv?.kien_thuc ?? 0, levelThaiDo: lv?.thai_do ?? 0,
      dangs, chuyenDes, soLop, soLopKem, coSoLopKem, coSoLopET, coSoLopMT, thaiDo: td, coChuongDo, coLoTienQuyet,
      deXuatKienThuc: deXuatLevelKienThuc({
        levelHienTai: lv?.kien_thuc ?? 0, dangs, coChuongDo, coLoTienQuyet, coSoLopKem, bayGio: Date.now(),
      }), // `dangs` đã mang `daMo` → engine áp đúng luật trễ 2 mốc
      deXuatThaiDo: deXuatLevelThaiDo(td),
    })
  }
  return out
}

function push<T>(m: Map<string, T[]>, k: string, v: T) { const a = m.get(k) ?? []; a.push(v); m.set(k, a) }

// ── QUÉT CANDIDATE — 4 KÊNH DỮ LIỆU + báo động + thái độ (Thùy 08-23, siết lại) ────────
// "RULE lọc thô ra candidate → CLAUDE đọc stat sheet của candidate". Tầng này là RULE: chỉ
// lọc + xếp ưu tiên, KHÔNG phán. Claude/người đọc `lyDo` rồi mới quyết.
//
// LỊCH SỬ: logic cũ (bất kỳ 1 trong N kênh chạm là đủ) đo thật ra 217/300 = 72,3% roster Toán —
// quá tải, không dùng được làm hàng đợi "cần duyệt". Nguyên nhân gốc: OR với nhiều kênh, mỗi kênh
// đã có nhiễu riêng (sát biên, 1 lần đo lẻ), hợp lại luôn phình to bất kể siết ngưỡng kênh nào.
// Thùy 08-23 chốt: ĐÒI ≥2/4 KÊNH DỮ LIỆU cùng chạm mới đủ tin (đúng tinh thần "triangulation"
// CLAUDE.md §5 — 1 khâu mù, ≥2 khâu đồng ý mới chắc). Báo động ③④ và thái độ ② vẫn ĐỘC LẬP, tự
// đủ để vào 1 mình (không đổi). Đo thật 300 HS Toán với luật ≥2/4 mới: ~30% roster — khớp mục
// tiêu ban đầu. Xem DEVLOG.md 2026-08-23 cho toàn bộ quá trình calibrate + số liệu từng kênh.
export type Candidate = {
  hoc_sinh_id: string; ho_ten: string; mon: string
  kenh: ('trend' | 'thai_do' | 'chuong_do' | 'tien_quyet' | 'pct_yeu' | 'so_lop_et' | 'so_lop_mt')[]
  uuTien: number            // càng cao càng đọc trước — CHỈ để sắp xếp, không phải "mức độ nặng"
  trongDigest: boolean      // lọt digest tuần này (uuTien ≥ NGUONG_DIGEST) — xem ghi chú dưới
  lyDo: string[]
  duTinHieuKienThuc: boolean // ≥2/4 kênh dữ liệu HOẶC báo động HOẶC case kiến thức đang mở cần xử —
                              // dùng cái NÀY để lọc màn "Duyệt bổ trợ", đừng suy luận lại từ `kenh`
  deXuatKienThuc: any; deXuatThaiDo: any
  sheet: StatSheetHS
}
export async function listCandidatesLop(lopId: string): Promise<Candidate[]> {
  const sheets = await getStatSheetLop(lopId)
  const out: Candidate[] = []
  for (const s of sheets) {
    const kenh: Candidate['kenh'] = []
    const lyDo: string[] = []
    let uuTien = 0

    // ③④ — flag CỨNG của NGƯỜI. Tự đủ để vào danh sách, KHÔNG cần chờ ≥2/4 kênh dữ liệu.
    if (s.coChuongDo) { kenh.push('chuong_do'); lyDo.push('③ chuông đỏ: GV/TA báo lỗi nghiêm trọng (chấm BTVN hoặc đánh giá sau buổi)'); uuTien += 100 }
    if (s.coLoTienQuyet) { kenh.push('tien_quyet'); lyDo.push('④ GV báo hổng kiến thức NỀN'); uuTien += 100 }
    const baoDong = s.coChuongDo || s.coLoTienQuyet

    // Kênh 1 — chuyên đề tụt QUA NGƯỠNG bucket (đạt→cần luyện / cần luyện→yếu), pha 2 so chính
    // mình. "Qua ngưỡng là đủ" (Thùy 08-23: không thêm điều kiện delta biên độ). Recency đã fix
    // ở `getStatSheetLop` (`chamPha2` chỉ tính khi "sau" là cửa sổ hiện tại hoặc liền trước —
    // tránh dùng dữ liệu tháng trước để kết luận "đang tụt" hôm nay).
    const tutQuaNguong = s.chuyenDes.filter((c) => {
      if (c.cham?.pha !== 2) return false
      const bTruoc = bucketOfScore(c.cham.truoc), bSau = bucketOfScore(c.cham.sau)
      return BUCKET_RANK[bSau] < BUCKET_RANK[bTruoc]
    })
    const sig1 = tutQuaNguong.length > 0
    if (sig1) {
      kenh.push('trend')
      for (const c of tutQuaNguong) {
        const xau = c.dangDoiBucketXau
        lyDo.push(`① ${c.ten_chuyen_de}: ${c.cham.truoc.toFixed(2)} → ${c.cham.sau.toFixed(2)} (qua ngưỡng)`
          + (xau.length ? `  ▼ ${xau.length} dạng tụt (${xau.slice(0, 3).map((d) => `${d.tu}→${d.den}`).join(', ')})` : ''))
      }
      uuTien += 12
    }

    // Kênh 2 — % dạng yếu / tổng dạng đã đo > 10% (Thùy 08-23: thay "dạng yếu tuyệt đối tự đủ vào
    // danh sách" cũ — 1 dạng yếu lẻ giữa hàng chục dạng ổn không còn tự kéo HS vào hàng đợi nữa,
    // phải chiếm tỉ trọng đáng kể mới tính). Thùy 08-23 (vòng 2): PHẠM VI TỐI ĐA 2 CỬA SỔ — chỉ tính
    // trên dạng có lần đo GẦN NHẤT (`cuoiCungAt`) rơi vào cửa sổ hiện tại hoặc liền trước, cùng
    // nguyên tắc recency với kênh 1/3/4 — dạng đã lâu không đo lại không nên góp vào tỉ lệ "đang yếu".
    const hienTaiK2 = cuaSoHienTai(), truocK2 = cuaSoTruoc(hienTaiK2)
    const dangGanDay = s.dangs.filter((d) => { const w = cuaSoCua(d.cuoiCungAt); return w === hienTaiK2 || w === truocK2 })
    const nDangDo = dangGanDay.length
    const nYeu = dangGanDay.filter((d) => d.muc === 'yeu').length
    const pctYeu = nDangDo > 0 ? nYeu / nDangDo : 0
    const sig2 = nDangDo > 0 && pctYeu > 0.10
    if (sig2) {
      kenh.push('pct_yeu')
      lyDo.push(`② % dạng yếu (2 cửa sổ gần nhất): ${nYeu}/${nDangDo} = ${Math.round(pctYeu * 100)}%`)
      uuTien += 10
    }

    // Kênh 3 — ET-only: TB 4 buổi ET gần nhất < 90% TB lớp cùng 4 buổi (tách khỏi kênh ⑤ cũ,
    // KHÔNG gộp MT/BTVN nữa — xem `coSoLopET` ở getStatSheetLop).
    if (s.coSoLopET) {
      kenh.push('so_lop_et')
      lyDo.push('③ ET: TB các buổi trong 2 cửa sổ gần nhất dưới 90% TB lớp')
      uuTien += 12
    }

    // Kênh 4 — MT-only: bài MT GẦN NHẤT (n≥1, MT hiếm 1 lần/tháng nhưng trọng số cao nhất —
    // "khung nào có MT thì dựa MT là chính") dưới 90% TB lớp bài đó.
    if (s.coSoLopMT) {
      kenh.push('so_lop_mt')
      lyDo.push('④ MT: bài gần nhất dưới 90% TB lớp')
      uuTien += 10
    }

    // ≥1/4 kênh dữ liệu HOẶC báo động cứng — MỞ CASE MỚI.
    // ⚠ CASE ĐANG MỞ (levelKienThuc>0) mà đề xuất muốn ĐỔI (lên/xuống/đóng) thì LUÔN hiện, bất kể
    // ngưỡng — đây không phải "phát hiện mới" mà là "case đã mở cần xử tiếp", nếu ẩn đi vì thiếu
    // tín hiệu MỚI thì case cũ (mở từ trước, do dữ liệu CŨ) sẽ kẹt không ai thấy để đóng/xử tiếp.
    // Phân biệt rõ 2 việc: MỞ case mới (qua ngưỡng dưới) vs QUẢN LÝ case đã mở (luôn hiện — không đổi).
    //
    // Thùy 08-23 (vòng 4): hạ từ ≥2/4 xuống ≥1/4 (OR) — CHẠY THỬ 1 THÁNG để đo lệch so với ≥2/4.
    // Lý do đổi: cả 4 kênh giờ ĐÃ giới hạn recency (tối đa 2 cửa sổ, xem coSoLopET/MT/pct_yeu ở
    // trên + sig1's cd.cham) — đây mới là chỗ sửa thật sự làm OR bớt lỏng (50-58% trước khi giới
    // hạn cửa sổ → 29-32% sau khi giới hạn), luật ≥2/4 chỉ đang BÙ cho vấn đề recency chưa fix.
    // Giờ recency đã fix đều cả 4 kênh, ≥2/4 có thể không còn cần thiết — đo thật qua 1 tháng dùng
    // thật thay vì đoán tiếp. `soTinHieuKienThuc` (số kênh dữ liệu chạm, 0-4) VẪN giữ nguyên trong
    // logic bên dưới — cuối tháng lọc lại candidate có ĐÚNG 1 kênh (OR bắt, ≥2/4 sẽ bỏ sót) để
    // soát riêng nhóm đó mà KHÔNG cần thêm code/DB gì — dữ liệu để so sánh vốn có sẵn qua `kenh[]`.
    const soTinHieuKienThuc = [sig1, sig2, s.coSoLopET, s.coSoLopMT].filter(Boolean).length
    const caseDangMoCanXu = s.levelKienThuc > 0 && s.deXuatKienThuc.deXuat !== s.levelKienThuc
    const duTinHieuKienThuc = soTinHieuKienThuc >= 1 || baoDong || caseDangMoCanXu

    // ② THÁI ĐỘ — ĐỘC LẬP HOÀN TOÀN với 4 kênh kiến thức trên (không cộng vào ≥2, không bị ≥2
    // chặn lại) — chuẩn TUYỆT ĐỐI (dưới Nghiêm túc là tín hiệu), tự đủ để vào danh sách đọc.
    if (s.deXuatThaiDo.deXuat > 0) {
      kenh.push('thai_do')
      lyDo.push(`⑤ thái độ: ${s.deXuatThaiDo.lyDo.join(', ')}`)
      uuTien += s.deXuatThaiDo.deXuat * 20
    }

    // Diện bổ trợ (dạng yếu tuyệt đối, đủ độ tin) — vẫn hiện lý do khi đã lọt vì lý do khác, nhưng
    // KHÔNG còn tự đủ để lọt vào 1 mình (Thùy 08-23: đã gộp tinh thần vào kênh 2 %dạng yếu).
    const dien = s.deXuatKienThuc.bangChung.dien as string[]
    if (dien.length) lyDo.push(`${dien.length} dạng trong diện bổ trợ`)

    // Cờ chẩn đoán phụ — không tự đẩy vào candidate, nhưng nếu đã vào thì phải hiện.
    const che = s.deXuatKienThuc.bangChung.btvnChe as string[]
    if (che.length) lyDo.push(`⚠ ${che.length} dạng "BTVN che": yếu ở ET/MT nhưng ổn ở bài tự làm`)
    const thieu = s.deXuatKienThuc.bangChung.yeuThieuDo as string[]
    if (thieu.length) lyDo.push(`⚠ ${thieu.length} dạng yếu nhưng CHƯA đủ ${DANHGIA_CONFIG.GATE_N} lần đo — chưa gọi bổ trợ`)

    const doiLevel = s.deXuatKienThuc.deXuat !== s.levelKienThuc || s.deXuatThaiDo.deXuat !== s.levelThaiDo
    if (doiLevel) uuTien += 8

    if (!duTinHieuKienThuc && !kenh.includes('thai_do')) continue // không đủ tín hiệu → bỏ qua

    out.push({
      hoc_sinh_id: s.hoc_sinh_id, ho_ten: s.ho_ten, mon: s.mon,
      kenh, uuTien, trongDigest: uuTien >= DANHGIA_CONFIG.NGUONG_DIGEST, lyDo,
      duTinHieuKienThuc, // ⭐ dùng CÁI NÀY để lọc "Duyệt bổ trợ" — KHÔNG suy luận lại từ `kenh`
      // (đọc "kenh có > 1 phần tử ngoài thai_do" từng ĐÚNG hồi mỗi kênh là 1 OR độc lập, giờ SAI vì
      // 1 kênh riêng lẻ vẫn được push vào `kenh` để hiện lý do dù chưa đủ ≥2/4 — bug thật đã bắt 08-23).
      deXuatKienThuc: s.deXuatKienThuc, deXuatThaiDo: s.deXuatThaiDo, sheet: s,
    })
  }
  // ⚠ TRẢ VỀ HẾT, chỉ SẮP XẾP — không tự cắt. Phần còn lại VẪN trả về để UI hiện "còn N em dưới
  // ngưỡng" — cắt âm thầm sẽ đọc thành "chỉ có ngần này em cần chú ý", sai.
  return out.sort((a, b) => b.uuTien - a.uuTien)
}

async function napThaiDo(hsIds: string[]): Promise<{ hoc_sinh_id: string; thai_do: string; t: string }[]> {
  const { data } = await supabase.from('btvn_ket_qua')
    .select('hoc_sinh_id, thai_do, buoi:buoi_hoc_id(ngay)')
    .in('hoc_sinh_id', hsIds).not('thai_do', 'is', null).limit(LIMIT)
  return ((data ?? []) as any[])
    .filter((r) => r.buoi?.ngay)
    .map((r) => ({ hoc_sinh_id: r.hoc_sinh_id, thai_do: r.thai_do, t: r.buoi.ngay }))
}

// Dạng ĐANG MỞ trong đợt bổ trợ yếu (chưa `dong_at`) → cho phép luật "trễ": đã vào diện thì ở
// lại tới khi retest > 0.5, đúng 0.5 KHÔNG đủ để ra (Thùy 07-22).
// Trả { hoc_sinh_id → Set(ma_dang) }.
async function napDangDangMo(hsIds: string[], mon: string): Promise<Map<string, Set<string>>> {
  const out = new Map<string, Set<string>>()
  if (!hsIds.length) return out
  const { data: dots } = await supabase.from('bo_tro_yeu')
    .select('id, hoc_sinh_id').in('hoc_sinh_id', hsIds).eq('mon', mon).eq('trang_thai', 'dang_xu').limit(LIMIT)
  const dotHs = new Map<string, string>()
  for (const d of (dots ?? []) as any[]) dotHs.set(d.id, d.hoc_sinh_id)
  if (!dotHs.size) return out
  const { data: ds } = await supabase.from('bo_tro_yeu_dang')
    .select('bo_tro_yeu_id, ma_dang').in('bo_tro_yeu_id', [...dotHs.keys()]).is('dong_at', null).limit(LIMIT)
  for (const r of (ds ?? []) as any[]) {
    const hs = dotHs.get(r.bo_tro_yeu_id)
    if (!hs) continue
    const s = out.get(hs) ?? new Set<string>()
    s.add(r.ma_dang); out.set(hs, s)
  }
  return out
}

// ③ chuông đỏ + ④ lỗ tiên quyết — flag CỨNG của NGƯỜI, Claude KHÔNG xét lại (spec §2.A③④).
async function napCanhBao(hsIds: string[]): Promise<{ hoc_sinh_id: string; ma_dang: string; nguon: string; ghi_chu: string | null }[]> {
  const { data } = await supabase.from('canh_bao_yeu')
    .select('hoc_sinh_id, ma_dang, nguon, ghi_chu').in('hoc_sinh_id', hsIds).limit(LIMIT)
  return (data ?? []) as any
}

// ── LEVEL: đọc / duyệt ────────────────────────────────────────────────────────────────
// "Không có dòng" = L0 (§1.5 chống-NULL: KHÔNG seed roster ở L0) → coalesce về 0 ở đây.
export async function getLevels(hsIds: string[], mon: string): Promise<Map<string, { kien_thuc: number; thai_do: number }>> {
  const out = new Map<string, { kien_thuc: number; thai_do: number }>()
  if (!hsIds.length) return out
  const { data } = await supabase.from('hs_level')
    .select('hoc_sinh_id, loai, level').in('hoc_sinh_id', hsIds).eq('mon', mon).limit(LIMIT)
  for (const r of (data ?? []) as any[]) {
    const cur = out.get(r.hoc_sinh_id) ?? { kien_thuc: 0, thai_do: 0 }
    ;(cur as any)[r.loai] = r.level
    out.set(r.hoc_sinh_id, cur)
  }
  return out
}

// ⭐ DUYỆT — chỗ DUY NHẤT được đổi level (PLAN §1.F: máy chỉ đề xuất, NGƯỜI chốt).
// Ghi CẢ HAI VẾ vào `hs_level_log` ⇒ delta (`level_chot` ≠ `level_may_de_xuat`) lộ TỰ ĐỘNG,
// không cần bắt người tự khai đã sửa gì.
// `lyDoMay` = SNAPSHOT tín hiệu lúc đề xuất — PHẢI đóng băng: mastery suy-động nên đọc lại sau
// sẽ KHÔNG tái tạo được bối cảnh lúc quyết.
export async function duyetLevel(input: {
  hocSinhId: string; mon: string; loai: LoaiLevel
  levelChot: number
  levelMayDeXuat?: number | null
  lyDoMay?: any
  lyDoNguoi?: string | null
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: cur } = await supabase.from('hs_level')
    .select('level').eq('hoc_sinh_id', input.hocSinhId).eq('mon', input.mon).eq('loai', input.loai).maybeSingle()
  const levelCu = (cur as any)?.level ?? 0

  // Log TRƯỚC (bằng chứng quan trọng hơn trạng thái): nếu bước sau hỏng vẫn còn vết đã quyết gì.
  const { error: eLog } = await supabase.from('hs_level_log').insert({
    hoc_sinh_id: input.hocSinhId, mon: input.mon, loai: input.loai,
    level_cu: levelCu, level_may_de_xuat: input.levelMayDeXuat ?? null,
    ly_do_may: input.lyDoMay ?? {}, level_chot: input.levelChot,
    ly_do_nguoi: input.lyDoNguoi ?? null, actor: user?.id ?? null,
  })
  if (eLog) throw eLog

  // L0 = "bình thường" = KHÔNG có dòng (§1.5). Về 0 thì XOÁ dòng, không giữ dòng level=0.
  if (input.levelChot === 0) {
    const { error } = await supabase.from('hs_level')
      .delete().eq('hoc_sinh_id', input.hocSinhId).eq('mon', input.mon).eq('loai', input.loai)
    if (error) throw error
    return
  }
  const { error } = await supabase.from('hs_level').upsert({
    hoc_sinh_id: input.hocSinhId, mon: input.mon, loai: input.loai,
    level: input.levelChot, updated_at: new Date().toISOString(),
  }, { onConflict: 'hoc_sinh_id,mon,loai' })
  if (error) throw error
}

// Lịch sử duyệt của 1 HS = CASE LOG (spec §6 "log quyết định"; Thùy: "ghi lại toàn bộ để analys").
export type LevelLogRow = {
  id: string; loai: LoaiLevel; level_cu: number | null; level_may_de_xuat: number | null
  level_chot: number; ly_do_may: any; ly_do_nguoi: string | null; created_at: string
  lechVoiMay: boolean // = delta, suy tại chỗ cho UI khỏi tự so
}
export async function getLevelLog(hocSinhId: string, mon: string): Promise<LevelLogRow[]> {
  const { data, error } = await supabase.from('hs_level_log')
    .select('id, loai, level_cu, level_may_de_xuat, level_chot, ly_do_may, ly_do_nguoi, created_at')
    .eq('hoc_sinh_id', hocSinhId).eq('mon', mon)
    .order('created_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({
    ...r, lechVoiMay: r.level_may_de_xuat != null && r.level_may_de_xuat !== r.level_chot,
  }))
}

// Cửa sổ hiện tại (giờ VN) — UI hiện "đang ở kỳ nào".
export const cuaSoHienTai = () => cuaSoCua(Date.now())

// ── NHỜ CLAUDE PHÁN (spec §0 "code tính số, Claude phán" · §6) ─────────────────
// Client tính stat sheet → ghi job → `worker/danhgia.mjs` gọi Anthropic API → ghi kết quả.
// ⚠ KHÔNG gọi Anthropic thẳng từ browser: key sẽ nằm trong bundle (`VITE_*`), ai
//   cũng đốt được. Repo đã cháy tiền một lần vì gọi model đắt (DEVLOG "vụ 920k").
export type AiJob = {
  id: string; trang_thai: 'pending' | 'processing' | 'done' | 'failed'
  ket_qua: any; usage: any; model: string | null; model_chon: string | null
  error: string | null; created_at: string; done_at: string | null
}

// Model cho Thùy tự chọn & so. Giá USD/1 triệu token — số THẬT từ bảng giá Anthropic.
// Đo thật 07-23 trên lớp 11B1 (4 em có tín hiệu): Opus 4.8 = 4.078 đ/lượt, 88 giây.
export const MODEL_CHON = [
  { id: 'claude-sonnet-5', ten: 'Sonnet 5', mo_ta: 'nhanh & rẻ hơn ~60%', vao: 2, ra: 10 },
  { id: 'claude-opus-4-8', ten: 'Opus 4.8', mo_ta: 'mạnh nhất, đắt nhất', vao: 5, ra: 25 },
] as const
export const MODEL_MAC_DINH = 'claude-sonnet-5'

// Quy tiền từ `usage` THẬT của lượt gọi — không ước, không đoán.
// (Ước lượng ban đầu của Claude lệch 2,3 lần vì đánh giá thấp token suy nghĩ.)
const USD_VND = 26_000
export function tienCuaLuot(job: AiJob): number | null {
  const g = MODEL_CHON.find((m) => job.model?.startsWith(m.id) || job.model_chon === m.id)
  if (!g || !job.usage) return null
  const u = job.usage
  return Math.round(((u.input_tokens * g.vao + u.output_tokens * g.ra) / 1e6) * USD_VND)
}

// Rút gọn stat sheet trước khi gửi: bỏ trường chỉ UI cần. Ít token = rẻ hơn VÀ
// Claude đỡ nhiễu — gửi cả cục raw là đi ngược §0 ("Claude đọc stat sheet SẠCH").
export function goiGon(sheets: StatSheetHS[], tenLop: string, soHSCaLop?: number) {
  return {
    ten_lop: tenLop, cua_so: cuaSoHienTai(),
    // Nói rõ đã lọc bao nhiêu, để Claude không tưởng lớp chỉ có ngần này em rồi
    // kết luận sai về mặt bằng chung (§: cắt mà không nói = đọc thành "cả lớp chỉ có thế").
    si_so_ca_lop: soHSCaLop ?? sheets.length,
    ghi_chu: soHSCaLop && soHSCaLop > sheets.length
      ? `Chỉ gửi ${sheets.length}/${soHSCaLop} em CÓ TÍN HIỆU cần xem. ${soHSCaLop - sheets.length} em còn lại không có tín hiệu nào, đã lược bỏ.`
      : 'Gửi toàn bộ học sinh của lớp.',
    hoc_sinh: sheets.map((s) => ({
      hoc_sinh_id: s.hoc_sinh_id, ho_ten: s.ho_ten,
      level_hien_tai: { kien_thuc: s.levelKienThuc, thai_do: s.levelThaiDo },
      // Chỉ dạng đáng nói: trong diện, hoặc yếu/cần luyện. Dạng đã Đạt không cần Claude đọc.
      dang: s.dangs.filter((d) => d.trongDien || d.muc !== 'dat').map((d) => ({
        ma: d.ma_dang, ten: d.ten_dang, chuyen_de: d.ten_chuyen_de,
        diem: +d.score.toFixed(2), diem_chi_giam_sat: d.scoreEtMt == null ? null : +d.scoreEtMt.toFixed(2),
        so_lan_do: d.n, muc: d.muc, trong_dien_bo_tro: d.trongDien,
      })),
      chuyen_de: s.chuyenDes.map((c) => ({
        ten: c.ten_chuyen_de,
        chuoi: c.chuoi.map((p) => ({ cua_so: p.cuaSo, diem: p.score == null ? null : +p.score.toFixed(2), so_cau: p.n, it_lan_do: p.itLanDo })),
        dang_tut_hang: c.dangDoiBucketXau,
      })),
      thai_do_cac_buoi: s.thaiDo,
      chuong_do: s.coChuongDo, lo_tien_quyet: s.coLoTienQuyet,
      // Đề xuất của RULE ENGINE — để Claude đối chiếu, KHÔNG phải để chép lại.
      de_xuat_cua_may: { kien_thuc: s.deXuatKienThuc, thai_do: s.deXuatThaiDo },
    })),
  }
}

// ⭐ MẶC ĐỊNH CHỈ GỬI EM CÓ TÍN HIỆU (`chiCanDocData`), không gửi cả lớp.
// Đo thật 07-23: cả lớp 9S1 (13 HS) = 16.891 token; chỉ em có tín hiệu = ít hơn
// nhiều lần. Em không có tín hiệu nào thì Claude cũng chỉ trả về "ổn định" —
// trả tiền cho một câu mình đã biết trước. Cần soi cả lớp thì `{ caLop: true }`.
export async function taoAiJob(lopId: string, opts?: { caLop?: boolean; model?: string }): Promise<string> {
  const { data: lop } = await supabase.from('lop').select('ten_lop, mon').eq('id', lopId).single()
  if (!lop) throw new Error('Không tìm thấy lớp')
  const sheets = await getStatSheetLop(lopId)
  if (!sheets.length) throw new Error('Lớp chưa có dữ liệu đo')

  let gui = sheets
  if (!opts?.caLop) {
    const cands = new Set((await listCandidatesLop(lopId)).map((c) => c.hoc_sinh_id))
    gui = sheets.filter((s) => cands.has(s.hoc_sinh_id))
    if (!gui.length) throw new Error('Lớp này không có em nào có tín hiệu cần xem — chưa cần hỏi Claude.')
  }

  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('danhgia_ai_job').insert({
    lop_id: lopId, mon: (lop as any).mon,
    stat_sheet: goiGon(gui, (lop as any).ten_lop, sheets.length),
    model_chon: opts?.model ?? MODEL_MAC_DINH, // worker theo cột này; để trống thì worker dùng mặc định của nó
    created_by: user?.id ?? null,
  }).select('id').single()
  if (error) throw error
  return (data as any).id
}

export async function getAiJob(id: string): Promise<AiJob | null> {
  const { data } = await supabase.from('danhgia_ai_job')
    .select('id, trang_thai, ket_qua, usage, model, model_chon, error, created_at, done_at').eq('id', id).maybeSingle()
  return (data as any) ?? null
}

// Lượt hỏi gần nhất của lớp — mở màn là thấy ngay kết quả cũ, khỏi hỏi lại (tốn tiền).
export async function getAiJobMoiNhat(lopId: string): Promise<AiJob | null> {
  const { data } = await supabase.from('danhgia_ai_job')
    .select('id, trang_thai, ket_qua, usage, model, model_chon, error, created_at, done_at')
    .eq('lop_id', lopId).order('created_at', { ascending: false }).limit(1).maybeSingle()
  return (data as any) ?? null
}

// Các lượt đã chạy của lớp — để ĐẶT CẠNH NHAU mà so model, đó là cách duy nhất
// biết Sonnet có đủ dùng không (đọc 2 bản trên CÙNG dữ liệu, không so bằng cảm giác).
export async function listAiJobs(lopId: string, limit = 8): Promise<AiJob[]> {
  const { data } = await supabase.from('danhgia_ai_job')
    .select('id, trang_thai, ket_qua, usage, model, model_chon, error, created_at, done_at')
    .eq('lop_id', lopId).order('created_at', { ascending: false }).limit(limit)
  return (data ?? []) as any
}

// ── DETAIL — "soi" (Thùy 08-18): lịch sử làm bài của CHUYÊN ĐỀ, giống detail dạng bài (loại bài ·
// ngày · trạng thái DCS). ChuyenDeStat.chuoi chỉ có điểm GỘP theo cửa sổ, không đủ để soi từng lần
// làm — hàm này nạp riêng, gọi LƯỜI lúc người bấm mở detail (không load sẵn cho mọi chuyên đề).
export type LanLamChuyenDe = { ma_dang: string; ten_dang: string; nguon: string; ngay: string; result: string }
export async function getLichSuChuyenDe(hocSinhId: string, maChuyenDe: string, mon: string): Promise<LanLamChuyenDe[]> {
  const K = khoCuaMon(mon)
  const { data: dangs, error: eD } = await supabase.from(K.banDoTbl).select('ma_dang, ten_dang').eq('ma_chuyen_de', maChuyenDe).limit(LIMIT)
  if (eD) throw eD
  const rows = (dangs ?? []) as { ma_dang: string; ten_dang: string }[]
  if (!rows.length) return []
  const tenMap = new Map(rows.map((d) => [d.ma_dang, d.ten_dang]))
  const maDangSet = new Set(rows.map((d) => d.ma_dang))

  const { data: grades, error: eG } = await supabase.from('gami_grades')
    .select('result, graded_at, prob:problem_id(ma_dang, phase)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (eG) throw eG
  return ((grades ?? []) as any[])
    .filter((g) => g.prob?.ma_dang && maDangSet.has(g.prob.ma_dang))
    .map((g) => ({ ma_dang: g.prob.ma_dang, ten_dang: tenMap.get(g.prob.ma_dang) ?? g.prob.ma_dang, nguon: g.prob.phase, ngay: g.graded_at, result: g.result }))
    .sort((a, b) => Date.parse(b.ngay) - Date.parse(a.ngay))
    .slice(0, 10)
}
