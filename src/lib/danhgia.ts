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
  DANHGIA_CONFIG, cuaSoCua, chuoiDiemChuyenDe, chamPha1, chamPha2,
  trungBinhTruot3, docAmLienTiep, dangDoiBucketXau, deXuatLevelKienThuc, deXuatLevelThaiDo,
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
  thaiDo: { thai_do: string; t: string }[]
  coChuongDo: boolean       // ③ TA bấm lúc chấm BTVN
  coLoTienQuyet: boolean    // ④ GV báo hổng kiến thức NỀN
  deXuatKienThuc: any       // { deXuat, lyDo[], bangChung } — engine, KHÔNG tự ghi
  deXuatThaiDo: any
}

// ── NẠP LẦN ĐO (1 lần cho N học sinh — bulk, không gọi từng HS) ────────────────────────
type DoRow = { hoc_sinh_id: string; ma_dang: string; value: number; t: string; src: string }

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
    out.push({ hoc_sinh_id: r.hoc_sinh_id, ma_dang: p.ma_dang, value, t: r.graded_at, src: p.phase })
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
        dangs.push({
          ma_dang: ma, ten_dang: info.ten_dang, ten_chuyen_de: info.ten_chuyen_de, muc_do: info.muc_do,
          score, scoreEtMt: (mEtMt as any)?.score ?? null, n,
          muc: (m as any).muc, // đánh giá CHUNG — cùng engine với màn Kết quả học tập
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
        const a = coDiem[coDiem.length - 2].diem!.score, b = coDiem[coDiem.length - 1].diem!.score
        cham = chamPha2(a, b)
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

    const td = thaiDoRows.filter((r) => r.hoc_sinh_id === hsId).map((r) => ({ thai_do: r.thai_do, t: r.t }))
    const cb = canhBao.filter((r) => r.hoc_sinh_id === hsId)
    const coChuongDo = cb.some((r) => r.nguon === 'btvn' || r.nguon === 'chuong_do')
    const coLoTienQuyet = cb.some((r) => r.nguon === 'gv_tien_quyet')
    const lv = levels.get(hsId)

    out.push({
      hoc_sinh_id: hsId, ho_ten: hsMap.get(hsId)!, mon,
      levelKienThuc: lv?.kien_thuc ?? 0, levelThaiDo: lv?.thai_do ?? 0,
      dangs, chuyenDes, thaiDo: td, coChuongDo, coLoTienQuyet,
      deXuatKienThuc: deXuatLevelKienThuc({
        levelHienTai: lv?.kien_thuc ?? 0, dangs, coChuongDo, coLoTienQuyet, bayGio: Date.now(),
      }), // `dangs` đã mang `daMo` → engine áp đúng luật trễ 2 mốc
      deXuatThaiDo: deXuatLevelThaiDo(td),
    })
  }
  return out
}

function push<T>(m: Map<string, T[]>, k: string, v: T) { const a = m.get(k) ?? []; a.push(v); m.set(k, a) }

// ── QUÉT CANDIDATE — 4 KÊNH (spec §2.A + §6) ──────────────────────────────────────────
// "RULE lọc thô ra candidate → CLAUDE đọc stat sheet của candidate". Tầng này là RULE: chỉ
// lọc + xếp ưu tiên, KHÔNG phán. Claude/người đọc `lyDo` rồi mới quyết.
//
// 4 kênh KHÔNG cộng dồn thành 1 điểm số — mỗi kênh bắt một thứ khác nhau, gộp thành 1 số là
// mất thông tin (spec: "con người phán chỗ máy mù; máy đo chỗ người không quét xuể"). Vì vậy
// trả về `kenh[]` để thấy vì sao HS này lọt vào, và chỉ dùng `uuTien` để XẾP THỨ TỰ đọc.
export type Candidate = {
  hoc_sinh_id: string; ho_ten: string; mon: string
  kenh: ('trend' | 'thai_do' | 'chuong_do' | 'tien_quyet')[]
  uuTien: number            // càng cao càng đọc trước — CHỈ để sắp xếp, không phải "mức độ nặng"
  trongDigest: boolean      // lọt digest tuần này (uuTien ≥ NGUONG_DIGEST) — xem ghi chú dưới
  lyDo: string[]
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

    // ③④ — flag CỨNG của NGƯỜI. Ưu tiên cao nhất, Claude KHÔNG xét lại (spec §2.A③④).
    if (s.coChuongDo) { kenh.push('chuong_do'); lyDo.push('③ chuông đỏ: TA báo lỗi nghiêm trọng khi chấm BTVN'); uuTien += 100 }
    if (s.coLoTienQuyet) { kenh.push('tien_quyet'); lyDo.push('④ GV báo hổng kiến thức NỀN'); uuTien += 100 }

    // ① TREND chuyên đề — kênh định lượng chính. Bắt "đang rơi", không đợi chạm sàn.
    const tut = s.chuyenDes.filter((c) => c.cham?.pha === 2 && c.cham.huong === 'lui')
    const docAm = s.chuyenDes.filter((c) => c.docAm >= 2) // dốc B-mượt âm liên tiếp (spec §2.B)
    if (tut.length || docAm.length) {
      kenh.push('trend')
      for (const c of tut) {
        const xau = c.dangDoiBucketXau
        // Dòng lý do đúng dạng spec §2.A① mô tả: "PT bậc nhất: 0.81 → 0.62 ▼ 4 dạng chuyển Đ→C".
        lyDo.push(`${c.ten_chuyen_de}: ${c.cham.truoc.toFixed(2)} → ${c.cham.sau.toFixed(2)}`
          + (xau.length ? `  ▼ ${xau.length} dạng tụt (${xau.slice(0, 3).map((d) => `${d.tu}→${d.den}`).join(', ')})` : ''))
      }
      for (const c of docAm) lyDo.push(`${c.ten_chuyen_de}: vượt-TB-lớp dốc âm ${c.docAm} nhịp liên tiếp`)
      uuTien += tut.length * 10 + docAm.length * 15
    }

    // ② THÁI ĐỘ — leading, độc lập ①. Chuẩn TUYỆT ĐỐI (dưới Nghiêm túc là tín hiệu).
    if (s.deXuatThaiDo.deXuat > 0) {
      kenh.push('thai_do')
      lyDo.push(`② thái độ: ${s.deXuatThaiDo.lyDo.join(', ')}`)
      uuTien += s.deXuatThaiDo.deXuat * 20
    }

    // Diện bổ trợ có dạng yếu đủ độ tin → luôn là candidate (dù chưa kênh nào bật).
    const dien = s.deXuatKienThuc.bangChung.dien as string[]
    if (dien.length) { uuTien += dien.length * 5; lyDo.push(`${dien.length} dạng trong diện bổ trợ`) }

    // Cờ chẩn đoán phụ — không tự đẩy vào candidate, nhưng nếu đã vào thì phải hiện.
    const che = s.deXuatKienThuc.bangChung.btvnChe as string[]
    if (che.length) lyDo.push(`⚠ ${che.length} dạng "BTVN che": yếu ở ET/MT nhưng ổn ở bài tự làm`)
    const thieu = s.deXuatKienThuc.bangChung.yeuThieuDo as string[]
    if (thieu.length) lyDo.push(`⚠ ${thieu.length} dạng yếu nhưng CHƯA đủ ${DANHGIA_CONFIG.GATE_N} lần đo — chưa gọi bổ trợ`)

    // Đề xuất đổi level cũng là lý do để lọt vào danh sách đọc.
    const doiLevel = s.deXuatKienThuc.deXuat !== s.levelKienThuc || s.deXuatThaiDo.deXuat !== s.levelThaiDo
    if (!kenh.length && !dien.length && !doiLevel) continue // không có gì để nói → bỏ qua
    if (doiLevel) uuTien += 8

    out.push({
      hoc_sinh_id: s.hoc_sinh_id, ho_ten: s.ho_ten, mon: s.mon,
      kenh, uuTien, trongDigest: uuTien >= DANHGIA_CONFIG.NGUONG_DIGEST, lyDo,
      deXuatKienThuc: s.deXuatKienThuc, deXuatThaiDo: s.deXuatThaiDo, sheet: s,
    })
  }
  // ⚠ TRẢ VỀ HẾT, chỉ SẮP XẾP — không tự cắt. Đo thật: quét thô ra 38% roster, `trongDigest`
  // (uuTien ≥ 40) khoanh còn ~11% đúng mục tiêu spec §8. Phần còn lại VẪN trả về để UI hiện
  // "còn N em dưới ngưỡng" — cắt âm thầm sẽ đọc thành "chỉ có ngần này em cần chú ý", sai.
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
  ket_qua: any; usage: any; model: string | null; error: string | null
  created_at: string; done_at: string | null
}

// Rút gọn stat sheet trước khi gửi: bỏ trường chỉ UI cần. Ít token = rẻ hơn VÀ
// Claude đỡ nhiễu — gửi cả cục raw là đi ngược §0 ("Claude đọc stat sheet SẠCH").
function goiGon(sheets: StatSheetHS[], tenLop: string) {
  return {
    ten_lop: tenLop, cua_so: cuaSoHienTai(),
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

export async function taoAiJob(lopId: string): Promise<string> {
  const { data: lop } = await supabase.from('lop').select('ten_lop, mon').eq('id', lopId).single()
  if (!lop) throw new Error('Không tìm thấy lớp')
  const sheets = await getStatSheetLop(lopId)
  if (!sheets.length) throw new Error('Lớp chưa có dữ liệu đo')
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('danhgia_ai_job').insert({
    lop_id: lopId, mon: (lop as any).mon,
    stat_sheet: goiGon(sheets, (lop as any).ten_lop),
    created_by: user?.id ?? null,
  }).select('id').single()
  if (error) throw error
  return (data as any).id
}

export async function getAiJob(id: string): Promise<AiJob | null> {
  const { data } = await supabase.from('danhgia_ai_job')
    .select('id, trang_thai, ket_qua, usage, model, error, created_at, done_at').eq('id', id).maybeSingle()
  return (data as any) ?? null
}

// Lượt hỏi gần nhất của lớp — mở màn là thấy ngay kết quả cũ, khỏi hỏi lại (tốn tiền).
export async function getAiJobMoiNhat(lopId: string): Promise<AiJob | null> {
  const { data } = await supabase.from('danhgia_ai_job')
    .select('id, trang_thai, ket_qua, usage, model, error, created_at, done_at')
    .eq('lop_id', lopId).order('created_at', { ascending: false }).limit(1).maybeSingle()
  return (data as any) ?? null
}
