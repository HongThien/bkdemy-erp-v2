// Data-layer MASTERY (seam) — suy động (HS × dạng) từ các lần đo, gộp qua engine PURE src/gami/mastery.js.
// KHÔNG lưu — mọi lần gọi tính lại từ measurements. UI chỉ gọi qua đây.
// Nguồn đo (Thùy 07-15, chốt lại — LOẠI ingame + đánh giá GV khỏi mastery): CHỈ et+mt mặc định (test có
// giám sát, khách quan) [+ btvn+bt nếu bật toggle — tự luyện, weight thấp hơn]. "Chấm bài trên lớp"(ingame)
// và "đánh giá GV"(dg) KHÔNG còn vào mastery nữa — dg đặc biệt bị loại vì "phụ thuộc cảm giác", không phải
// đo khách quan per-câu như et/mt/btvn/bt. Trọng số — xem MASTERY_CONFIG.WEIGHT (gami/mastery.js): mt=3
// (chuẩn nhất) · et=2 · btvn/bt=1 (tự luyện).
import { supabase } from './supabase'
import { masteryOfDang, RESULT_VALUE, MASTERY_CONFIG, MASTERY_CONFIG_HINH } from '../gami/mastery.js'
import { seasonOf, seasonStartUtc } from '../gami/season.js'
import { khoCuaMon } from './tailieu'

const LIMIT = 10000

export type EvalSrc = 'ingame' | 'et' | 'mt' | 'dg' | 'btvn' | 'bt' | 'tu_luyen'

// Cấp 1 = khối tiểu học (Thùy 17-20/08, phân khúc test-online): tự luyện KHÔNG có kênh nào khác để
// đối chiếu (không ET/BTVN online như cấp 3) ⇒ tính THẲNG vào mastery TRUNG TÂM, không qua toggle
// includeBTVN như btvn/bt. Danh sách khối = ĐÚNG bảng đã dùng lúc chốt mô hình tài khoản (DEVLOG 17/08).
const CAP1_KHOI = new Set(['3', '4', '4T', '5', '5T'])
function laCap1(khoi: string | null | undefined): boolean { return !!khoi && CAP1_KHOI.has(khoi) }
export type DangEval = { value: number; t: string; src: EvalSrc } // value 0|0.5|1 · t = ISO · src = nguồn
export type Mastery = { score: number; n: number; muc: 'dat' | 'can_luyen' | 'yeu'; tin: 'cao' | 'tb' | 'thap' }
export type DangMastery = {
  ma_dang: string
  ten_dang: string
  ten_chuyen_de: string
  muc_do: number | null // độ khó 1-5 (banDoTbl.muc_do) — null nếu bảng bản đồ không có cột này (vd hinh_ban_do)
  mastery: Mastery | null // null = CHƯA ĐO (không có lần đo nào)
  evals: DangEval[] // MỚI → CŨ
}

// Độ khó → nhóm cơ bản/nâng cao (Thùy 07-14): 1-3 = cơ bản · 4-5 = nâng cao. Dùng cho cả bản đồ kiến thức
// (bảng phụ theo scope) lẫn %MT cơ bản/nâng cao (chỉ số hoạt động).
export const bucketMucDo = (md: number | null | undefined): 'co_ban' | 'nang_cao' | null => (md == null ? null : md <= 3 ? 'co_ban' : 'nang_cao')

// Nhãn nguồn cho UI (IG/DG giữ lại cho Lịch sử hoạt động/badge cũ — KHÔNG còn xuất hiện trong mastery
// evals nữa, xem lý do loại ở đầu file). MT = kỳ thi lớn, chấm Đ/C/S per câu GIỐNG ET (giám sát) → LUÔN
// vào mastery. BTVN/BT (tự luyện) qua toggle includeBTVN — CẢ 2 cùng gate chung 1 toggle (Thùy 07-15).
// TU_LUYEN (tự luyện online, 18-20/08) — CẤP 1 luôn vào (không qua toggle), CẤP 3 qua toggle như btvn.
export const SRC_LABEL: Record<EvalSrc, string> = { ingame: 'IG', et: 'ET', mt: 'MT', dg: 'ĐG', btvn: 'BTVN', bt: 'BT', tu_luyen: 'TL' }

// ── NGUỒN ĐO ONLINE (test online 07-04): bai_lam_cau (verdict ≠ null) = phép đo ──
// ET + ĐỀ THI online → src 'et' (thi có giám sát, VÀO mastery — cùng chế độ THI, xem THI_LOAI HocSinhApp).
// TỰ LUYỆN (18-20/08) → src RIÊNG 'tu_luyen' — TÁCH khỏi 'btvn' vì trọng số VÀO-mastery-trung-tâm-mặc-định
// khác nhau theo cấp (xem laCap1 ở trên), dù cùng WEIGHT tính điểm (=1, gami/mastery.js).
// BTVN + giáo-trình online → src 'btvn' (tham khảo — chỉ vào khi bật toggle, đúng chính sách BTVN).
// Duyệt lại (manual/cache) sửa verdict tại chỗ → mastery tự đúng theo (suy động, không sync).
const THI_LOAI = new Set(['et', 'de_thi'])
type OnlineEvalRow = { hoc_sinh_id: string; ma_dang: string | null; value: number; t: string; src: EvalSrc; mon: string }
async function fetchOnlineEvals(hs: string | string[], sinceIso?: string | null): Promise<OnlineEvalRow[]> {
  // Embed 2 tầng FK ĐƠN (bai_lam_id → bai_test_id) + filter trên bảng nhúng qua !inner (pattern loadMasteryCells).
  let q = supabase.from('bai_lam_cau')
    .select('verdict, cham_at, lam:bai_lam_id!inner(hoc_sinh_id, trang_thai, test:bai_test_id(loai, mon)), cau:bai_test_cau_id(ma_dang)')
    .not('verdict', 'is', null).limit(LIMIT)
  q = Array.isArray(hs) ? q.in('lam.hoc_sinh_id', hs) : q.eq('lam.hoc_sinh_id', hs)
  if (sinceIso) q = q.gte('cham_at', sinceIso)
  const { data, error } = await q
  if (error) throw error
  const out: OnlineEvalRow[] = []
  for (const r of (data ?? []) as any[]) {
    const val = RESULT_VALUE[r.verdict as keyof typeof RESULT_VALUE]
    if (val === undefined || !r.lam) continue
    const loai = r.lam.test?.loai
    const laThi = THI_LOAI.has(loai)
    // Chế độ THI chỉ tính khi ĐÃ NỘP (verdict chỉ sinh lúc et_nop, nhưng belt-and-suspenders với backfill duyệt).
    if (laThi && r.lam.trang_thai !== 'da_nop') continue
    const src: EvalSrc = laThi ? 'et' : loai === 'tu_luyen' ? 'tu_luyen' : 'btvn'
    out.push({
      hoc_sinh_id: r.lam.hoc_sinh_id, ma_dang: r.cau?.ma_dang ?? null,
      value: val, t: r.cham_at, src, mon: r.lam.test?.mon ?? '',
    })
  }
  return out
}

// ── NGUỒN BT (bổ trợ tự luyện, mig 0094 bt_grades) — 1 HS × N câu, KHÔNG có buổi/session nên không
// nằm trong gami_grades. LUÔN vào mastery (không toggle) dù trọng số thấp (=1, xem MASTERY_CONFIG.WEIGHT).
type BTEvalRow = { hoc_sinh_id: string; ma_dang: string; value: number; t: string; mon: string }
async function fetchBTEvals(hs: string | string[], sinceIso?: string | null): Promise<BTEvalRow[]> {
  let q = supabase.from('bt_grades').select('result, graded_at, ma_dang, tl:tai_lieu_id!inner(hoc_sinh_id, mon)').limit(LIMIT)
  q = Array.isArray(hs) ? q.in('tl.hoc_sinh_id', hs) : q.eq('tl.hoc_sinh_id', hs)
  if (sinceIso) q = q.gte('graded_at', sinceIso)
  const { data, error } = await q
  if (error) throw error
  const out: BTEvalRow[] = []
  for (const r of (data ?? []) as any[]) {
    const val = RESULT_VALUE[r.result as keyof typeof RESULT_VALUE]
    if (val === undefined || !r.tl) continue
    out.push({ hoc_sinh_id: r.tl.hoc_sinh_id, ma_dang: r.ma_dang, value: val, t: r.graded_at, mon: r.tl.mon })
  }
  return out
}

// Gom các lần đo của 1 HS (trong 1 MÔN) theo dạng → mastery + timeline.
// opts.includeBTVN: gộp cả phase='btvn' + 'bt' + 'tu_luyen' (mặc định KHÔNG — tự luyện tham khảo,
// không vào mastery; toggle để Thùy soi — Thùy 07-15: BT/BTVN cùng gate 1 toggle, KHÔNG còn "bt luôn
// vào" như trước). NGOẠI LỆ: HS CẤP 1 (khối 3/4/4T/5/5T) → 'tu_luyen' LUÔN vào dù toggle tắt (Thùy
// 18-20/08: "không có kênh nào khác để đối chiếu" — cấp 1 không ET/BTVN online như cấp 3).
// ingame (chấm bài trên lớp) + dg (đánh giá GV) KHÔNG còn vào mastery (dg "phụ thuộc cảm giác" — Thùy 07-15).
// opts.days: chỉ lấy đo trong N ngày gần nhất (30/60/90). Bỏ trống = tất cả.
export async function getMasteryHS(
  hocSinhId: string,
  mon: string,
  opts?: { includeBTVN?: boolean; days?: number },
): Promise<DangMastery[]> {
  const K = khoCuaMon(mon) // banDoTbl theo môn → scope dạng đúng môn (bỏ dạng môn khác)
  const { data: hsRow } = await supabase.from('hoc_sinh').select('khoi').eq('id', hocSinhId).single()
  const phases: EvalSrc[] = opts?.includeBTVN ? ['et', 'mt', 'bt', 'btvn', 'tu_luyen']
    : laCap1(hsRow?.khoi) ? ['et', 'mt', 'tu_luyen'] : ['et', 'mt']
  const sinceIso = opts?.days ? new Date(Date.now() - opts.days * 86400_000).toISOString() : null // boundary INSTANT (được phép, §windowing)

  // grades của HS, EMBED thẳng problem (phase, ma_dang) — FK problem_id→gami_session_problems ĐƠN, sạch
  // (khác buoi_hoc_hs 2-FK). 1 query thay 2 + bỏ IN(probIds) tránh URL dài.
  let gq = supabase.from('gami_grades').select('result, graded_at, prob:problem_id(phase, ma_dang)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (sinceIso) gq = gq.gte('graded_at', sinceIso)
  const [{ data: grades }, online, bt] = await Promise.all([
    gq,
    fetchOnlineEvals(hocSinhId, sinceIso),
    fetchBTEvals(hocSinhId, sinceIso),
  ])

  // Gom measures theo ma_dang.
  const byDang: Record<string, DangEval[]> = {}
  const push = (ma: string | null | undefined, ev: DangEval) => { if (!ma) return; (byDang[ma] ??= []).push(ev) }
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob // to-one embed → object (null nếu problem mất, phòng thủ)
    if (!p || !p.ma_dang) continue
    if (!phases.includes(p.phase as EvalSrc)) continue // lọc phase (chỉ et/mt mặc định, +btvn/bt nếu bật toggle)
    const val = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]
    if (val === undefined) continue
    push(p.ma_dang, { value: val, t: g.graded_at, src: p.phase as EvalSrc })
  }
  for (const o of online) if (phases.includes(o.src)) push(o.ma_dang, { value: o.value, t: o.t, src: o.src })
  if (phases.includes('bt')) for (const b of bt) push(b.ma_dang, { value: b.value, t: b.t, src: 'bt' })

  const maList = Object.keys(byDang)
  if (maList.length === 0) return []

  // Resolve tên dạng + chuyên đề + độ khó theo MÔN (scope: chỉ dạng thuộc bảng bản đồ của môn này).
  const dangs = ((await supabase.from(K.banDoTbl).select('ma_dang, ten_dang, ten_chuyen_de, muc_do').in('ma_dang', maList).limit(LIMIT)).data ?? []) as { ma_dang: string; ten_dang: string; ten_chuyen_de: string; muc_do: number | null }[]
  const dangMap = new Map(dangs.map((d) => [d.ma_dang, d]))

  const out: DangMastery[] = []
  for (const ma of maList) {
    const info = dangMap.get(ma)
    if (!info) continue // ma_dang không thuộc môn đang xem → bỏ
    const evals = byDang[ma].sort((a, b) => Date.parse(b.t) - Date.parse(a.t)) // mới → cũ
    out.push({
      ma_dang: ma,
      ten_dang: info.ten_dang,
      ten_chuyen_de: info.ten_chuyen_de,
      muc_do: info.muc_do ?? null,
      mastery: masteryOfDang(evals, MASTERY_CONFIG) as Mastery | null,
      evals,
    })
  }
  // Sort: YẾU trước, rồi MỚI đánh giá lên đầu (như V1: dạng cần chú ý nhất trên cùng).
  const rank = { yeu: 0, can_luyen: 1, dat: 2 } as const
  out.sort((a, b) => {
    const ra = a.mastery ? rank[a.mastery.muc] : 3
    const rb = b.mastery ? rank[b.mastery.muc] : 3
    if (ra !== rb) return ra - rb
    return Date.parse(b.evals[0]?.t ?? '0') - Date.parse(a.evals[0]?.t ?? '0')
  })
  return out
}

// ── MASTERY HÌNH (mô hình) — Thùy chốt 21/08: KP = `hinh_baitoan_id` (mô hình TỐI THIỂU node gắn),
// KHÔNG phải dạng. "Mỗi mô hình đo qua bài TRỰC TIẾP gắn nó, không tính mô hình con" — vì mỗi bài toán
// chỉ gắn ĐÚNG 1 node (spec-kho-hinh-v3 luật 6), việc "không tính con" tự đúng: group theo
// hinh_baitoan_id không bao giờ lẫn quan sát của node khác, không cần lọc DAG cha/con gì thêm.
// Dạng (`hinh_dang`, gắn ở cách giải)/bổ đề chỉ là VIEW PHỤ tương lai — KHÔNG vào công thức này.
// Nguồn đo: CHỈ `gami_grades` trong buổi (et/mt/btvn qua `syncHinhProblems`) — Hình mô hình CHƯA có
// kênh test-online/tự luyện (ETScreen builder chỉ hỗ trợ Đại/Hình giải tích, không có nhánh mô hình).
export type HinhMastery = {
  hinh_baitoan_id: string
  ma: string           // hinh_baitoan.ma (vd "BT.08.047")
  ten_mo_hinh: string  // tên mô hình chứa node
  cap: number
  mastery: Mastery | null
  evals: DangEval[]
}
export async function getHinhMasteryHS(hocSinhId: string, opts?: { includeBTVN?: boolean; days?: number }): Promise<HinhMastery[]> {
  const phases: EvalSrc[] = opts?.includeBTVN ? ['et', 'mt', 'btvn'] : ['et', 'mt']
  const sinceIso = opts?.days ? new Date(Date.now() - opts.days * 86400_000).toISOString() : null
  let gq = supabase.from('gami_grades').select('result, graded_at, prob:problem_id(phase, hinh_baitoan_id)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT)
  if (sinceIso) gq = gq.gte('graded_at', sinceIso)
  const { data: grades, error } = await gq
  if (error) throw error

  const byNode: Record<string, DangEval[]> = {}
  const push = (id: string | null | undefined, ev: DangEval) => { if (!id) return; (byNode[id] ??= []).push(ev) }
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob // to-one embed
    if (!p || !p.hinh_baitoan_id) continue
    if (!phases.includes(p.phase as EvalSrc)) continue
    const val = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]
    if (val === undefined) continue
    push(p.hinh_baitoan_id, { value: val, t: g.graded_at, src: p.phase as EvalSrc })
  }
  const nodeIds = Object.keys(byNode)
  if (!nodeIds.length) return []

  const { data: bts } = await supabase.from('hinh_baitoan').select('id, ma, cap, mo_hinh_id').in('id', nodeIds).limit(LIMIT)
  const btArr = (bts ?? []) as { id: string; ma: string; cap: number; mo_hinh_id: string }[]
  const mhIds = [...new Set(btArr.map((b) => b.mo_hinh_id))]
  const { data: mhs } = await supabase.from('hinh_mo_hinh').select('id, ten').in('id', mhIds).limit(LIMIT)
  const mhMap = new Map(((mhs ?? []) as { id: string; ten: string }[]).map((m) => [m.id, m.ten]))
  const btMap = new Map(btArr.map((b) => [b.id, b]))

  const out: HinhMastery[] = []
  for (const id of nodeIds) {
    const info = btMap.get(id)
    if (!info) continue // node bị xoá khỏi kho sau khi đo → bỏ (tham chiếu text/uuid không FK cứng ở đây thì giữ, có FK thì đã rụng tự nhiên)
    const evals = byNode[id].sort((a, b) => Date.parse(b.t) - Date.parse(a.t))
    out.push({
      hinh_baitoan_id: id, ma: info.ma, ten_mo_hinh: mhMap.get(info.mo_hinh_id) ?? '', cap: info.cap,
      mastery: masteryOfDang(evals, MASTERY_CONFIG_HINH) as Mastery | null,
      evals,
    })
  }
  const rank = { yeu: 0, can_luyen: 1, dat: 2 } as const
  out.sort((a, b) => {
    const ra = a.mastery ? rank[a.mastery.muc] : 3
    const rb = b.mastery ? rank[b.mastery.muc] : 3
    if (ra !== rb) return ra - rb
    return Date.parse(b.evals[0]?.t ?? '0') - Date.parse(a.evals[0]?.t ?? '0')
  })
  return out
}

// ── TỔNG QUAN 1 HS — 3 VÙNG tách bạch (Thùy 07-14):
//   ① hoanThanh — % hoàn thành bản đồ kiến thức, MỖI card 2 nửa (Thùy 07-14): "etMt" = chỉ ET+MT (test có
//     giám sát) · "coBTVN" = etMt + BTVN + Bổ trợ (thêm nguồn tự luyện) — so 2 số cùng lúc để soi ĐỘ ĐÁNG
//     TIN của BTVN (dạng chỉ có BTVN mà không có ET/MT → etMt trống, coBTVN có → lộ rõ dạng "chỉ tự báo").
//     Dùng LẠI đúng engine masteryOfDang (weighted avg 5 lần GẦN NHẤT, MASTERY_CONFIG.WEIGHT: et=2·mt=3·
//     btvn=1·bt=1 — xem gami/mastery.js) — KHÔNG bịa công thức mới. Toàn bộ + Đại cơ bản/nâng cao (Hình:
//     UI tự render placeholder tĩnh, KHÔNG tính ở đây — xem lý do "chưa có dữ liệu" ở DangBaiTab).
//   ② hoatDong — %ET/%BTVN/%MT, MỖI nguồn tách CƠ BẢN/NÂNG CAO theo muc_do dạng của câu (bucketMucDo),
//     KHÔNG phân biệt Đại/Hình trong 1 mức (gộp chung) — 3 nguồn × 2 mức = 6 số.
//   ③ diem — ĐIỂM SỐ nhập tay qua ky_thi/diem_thi (khác %hoatDong ở trên — đó là %đúng câu, đây là điểm
//     thật): Điểm MT = TB diem_thi loai='mt_sat_hach' (nhập ở tab MT trong buổi) · Điểm thi trường = loai='truong'.
export type BucketPct = { dat: number; can_luyen: number; yeu: number; total: number; pct: number }
export type HoanThanhCard = { etMt: BucketPct; coBTVN: BucketPct }
export type ActPct = { pct: number | null; n: number }
export type TongQuanHS = {
  // hinhCoBan/hinhNangCao (Thùy 21/08: "giống đại, đo trên những mô hình đã có đánh giá" — CÙNG công
  // thức compPct, không cần denominator canonical riêng) — bucket theo `cap` CLIP 1-5, xem getHinhMasteryHS.
  hoanThanh: { toanBo: HoanThanhCard; daiCoBan: HoanThanhCard; daiNangCao: HoanThanhCard; hinhCoBan: HoanThanhCard; hinhNangCao: HoanThanhCard }
  hoatDong: {
    etCoBan: ActPct; etNangCao: ActPct
    btvnCoBan: ActPct; btvnNangCao: ActPct
    mtCoBan: ActPct; mtNangCao: ActPct
  }
  diem: {
    mt: { tb: number | null; n: number; coBan: number | null; nCoBan: number; nangCao: number | null; nNangCao: number }
    truong: { tb: number | null; n: number }
  }
  // TREND = chênh (điểm %) 30 ngày GẦN so với 30 ngày TRƯỚC đó; null = chưa đủ data 1 trong 2 kỳ.
  // (hoanThanhToanBo chỉ tính trên nửa etMt — nửa coBTVN là số đối chiếu, không cần trend riêng.)
  trend: {
    hoanThanhToanBo: number | null
    etCoBan: number | null; etNangCao: number | null
    btvnCoBan: number | null; btvnNangCao: number | null
    mtCoBan: number | null; mtNangCao: number | null
  }
}
export async function getTongQuanHS(hocSinhId: string, mon: string, opts?: { ym?: string }): Promise<TongQuanHS> {
  const K = khoCuaMon(mon)
  const [{ data: grades }, { data: dt }, online, btGradeEvals, { data: hsRow }] = await Promise.all([
    supabase.from('gami_grades').select('result, graded_at, prob:problem_id(phase, ma_dang, hinh_baitoan_id)').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    supabase.from('diem_thi').select('diem, diem_co_ban, diem_nang_cao, ky_thi:ky_thi_id(loai, mon, ngay, buoi:buoi_hoc_id(ngay))').eq('hoc_sinh_id', hocSinhId).limit(LIMIT),
    fetchOnlineEvals(hocSinhId),
    fetchBTEvals(hocSinhId),
    supabase.from('hoc_sinh').select('khoi').eq('id', hocSinhId).single(),
  ])
  const cap1 = laCap1(hsRow?.khoi)
  const now = Date.now(), D30 = 30 * 86400_000, cut1 = now - D30, cut2 = now - 2 * D30
  // SÀN MÙA: dữ liệu trước ngày khai mùa (1/7) = tháng 6 "chưa chính thức" → KHÔNG tính vào trend,
  // KHÔNG làm mốc so sánh (Thùy chốt). Nếu cửa sổ "kỳ trước" rơi hết vào trước mùa → prior rỗng → trend null.
  const seasonMs = Date.parse(seasonStartUtc(seasonOf(new Date(now + 7 * 3600_000).toISOString().slice(0, 10))))
  const inRecent = (t: number) => t >= cut1 && t >= seasonMs
  const inPrior = (t: number) => t >= cut2 && t < cut1 && t >= seasonMs

  // opts.ym ('YYYY-MM', 08-17): khi có → ①②③ "hiện tại" (không phải trend) CHỈ tính trên đo/điểm trong
  // ĐÚNG tháng đó — Report PH theo tháng cần "của tháng này", không phải suy động all-time. KHÔNG đổi hành
  // vi mặc định: nơi gọi không kèm opts (Kết quả học tập) vẫn suy động từ MỌI lần đo như cũ. Trend (30 ngày
  // gần/trước) đứng NGOÀI phạm vi này — luôn tính trên toàn bộ lịch sử, không lọc theo ym (xem dưới).
  let monthFromMs: number | null = null, monthToMs = 0, monthFromDate = '', monthToDate = ''
  // MT (Thùy 08-17): kỳ MT "của tháng M" thường tổ chức CUỐI tháng M hoặc ĐẦU tháng M+1 (không gọn trong
  // 1 tháng lịch như ET/BTVN) → quét riêng NGÀY 25/M → NGÀY 10/(M+1), không dùng monthFrom/To ở trên.
  let mtFromMs: number | null = null, mtToMs = 0, mtFromDate = '', mtToDate = ''
  if (opts?.ym) {
    const [Y, M] = opts.ym.split('-').map(Number)
    monthFromMs = Date.UTC(Y, M - 1, 1, -7, 0, 0)
    monthToMs = M === 12 ? Date.UTC(Y + 1, 0, 1, -7, 0, 0) : Date.UTC(Y, M, 1, -7, 0, 0)
    monthFromDate = `${opts.ym}-01`
    monthToDate = M === 12 ? `${Y + 1}-01-01` : `${Y}-${String(M + 1).padStart(2, '0')}-01`
    const nextY = M === 12 ? Y + 1 : Y, nextM = M === 12 ? 1 : M + 1
    mtFromMs = Date.UTC(Y, M - 1, 25, -7, 0, 0)
    mtToMs = Date.UTC(nextY, nextM - 1, 11, -7, 0, 0) // < ngày 11 = qua hết mùng 10
    mtFromDate = `${opts.ym}-25`
    mtToDate = `${nextY}-${String(nextM).padStart(2, '0')}-11`
  }
  const inMonth = (t: number) => monthFromMs == null || (t >= monthFromMs && t < monthToMs)
  const inMtWindow = (t: number) => mtFromMs == null || (t >= mtFromMs && t < mtToMs)

  // Raw theo NGUỒN (et/btvn/mt/tu_luyen) — bucket cơ bản/nâng cao SAU khi có muc_do (chung 1 vòng lặp).
  // tu_luyen TÁCH riêng khỏi btvn (khác chỗ được vào byDangTop hay không — xem dưới) dù cả 2 KHÔNG
  // đụng tới hoatDong (%ET/%BTVN/%MT hiện tại) — đó là 3 cột CỐ ĐỊNH, ngoài phạm vi việc hôm nay.
  type Raw = { ma: string | null; value: number; t: string }
  const etRows: Raw[] = [], btvnRows: Raw[] = [], mtRows: Raw[] = [], tuLuyenRows: Raw[] = []
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob; if (!p) continue
    const v = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]; if (v === undefined) continue
    if (p.phase === 'et') etRows.push({ ma: p.ma_dang ?? null, value: v, t: g.graded_at })
    else if (p.phase === 'mt') mtRows.push({ ma: p.ma_dang ?? null, value: v, t: g.graded_at })
    else if (p.phase === 'btvn') btvnRows.push({ ma: p.ma_dang ?? null, value: v, t: g.graded_at })
  }
  // Online: scope theo môn của TEST (có sẵn nhãn mon — §1.6).
  for (const o of online) {
    if (o.mon && o.mon !== mon) continue
    if (o.src === 'et') etRows.push({ ma: o.ma_dang, value: o.value, t: o.t })
    else if (o.src === 'tu_luyen') tuLuyenRows.push({ ma: o.ma_dang, value: o.value, t: o.t })
    else btvnRows.push({ ma: o.ma_dang, value: o.value, t: o.t })
  }

  // ① 2 bản đồ dạng: byDangTop = CHỈ et+mt (+tu_luyen NẾU cấp 1) · byDangBottom = top + btvn + bt +
  // tu_luyen (Bổ trợ) — Thùy 07-14: "trên là chỉ ETMT, dưới là có thêm BTVN, Bổ trợ". KHÔNG gồm
  // ingame/đánh giá GV (khác "Dạng bài" full-nguồn). tu_luyen LUÔN vào bottom (gộp-view, mọi cấp);
  // CHỈ vào top khi cấp 1 (Thùy 18-20/08: không có kênh nào khác để đối chiếu cho cấp 1).
  const byDangTop: Record<string, DangEval[]> = {}, byDangBottom: Record<string, DangEval[]> = {}
  const pushHT = (map: Record<string, DangEval[]>, ma: string | null, ev: DangEval) => { if (ma) (map[ma] ??= []).push(ev) }
  for (const e of etRows) { const ev: DangEval = { value: e.value, t: e.t, src: 'et' }; pushHT(byDangTop, e.ma, ev); pushHT(byDangBottom, e.ma, ev) }
  for (const m of mtRows) { const ev: DangEval = { value: m.value, t: m.t, src: 'mt' }; pushHT(byDangTop, m.ma, ev); pushHT(byDangBottom, m.ma, ev) }
  for (const b of btvnRows) pushHT(byDangBottom, b.ma, { value: b.value, t: b.t, src: 'btvn' })
  for (const tl of tuLuyenRows) {
    const ev: DangEval = { value: tl.value, t: tl.t, src: 'tu_luyen' }
    pushHT(byDangBottom, tl.ma, ev)
    if (cap1) pushHT(byDangTop, tl.ma, ev)
  }
  for (const b of btGradeEvals) { if (b.mon && b.mon !== mon) continue; pushHT(byDangBottom, b.ma_dang, { value: b.value, t: b.t, src: 'bt' }) }

  // byDang*Cur = bản LỌC theo opts.ym (nếu có), dùng cho ① "hiện tại" (htTop/htBottom) bên dưới. byDangTop/
  // byDangBottom GỐC (all-time, ngay trên) giữ nguyên cho maList/valid/mucDoMap (metadata dạng — không cần
  // lọc thời gian) VÀ cho trend (30 ngày gần/trước, dùng byDangTop trực tiếp).
  let byDangTopCur = byDangTop, byDangBottomCur = byDangBottom
  let etRowsCur = etRows, mtRowsCur = mtRows, btvnRowsCur = btvnRows
  if (monthFromMs != null) {
    const inMonthRow = (r: Raw) => inMonth(Date.parse(r.t))
    // mtRowsCur dùng inMtWindow (25/M→10/M+1), KHÔNG dùng inMonth — xem comment "MT" ở khai báo mtFromMs.
    etRowsCur = etRows.filter(inMonthRow); mtRowsCur = mtRows.filter((r) => inMtWindow(Date.parse(r.t))); btvnRowsCur = btvnRows.filter(inMonthRow)
    byDangTopCur = {}; byDangBottomCur = {}
    for (const e of etRowsCur) { const ev: DangEval = { value: e.value, t: e.t, src: 'et' }; pushHT(byDangTopCur, e.ma, ev); pushHT(byDangBottomCur, e.ma, ev) }
    for (const m of mtRowsCur) { const ev: DangEval = { value: m.value, t: m.t, src: 'mt' }; pushHT(byDangTopCur, m.ma, ev); pushHT(byDangBottomCur, m.ma, ev) }
    for (const b of btvnRowsCur) pushHT(byDangBottomCur, b.ma, { value: b.value, t: b.t, src: 'btvn' })
    for (const b of btGradeEvals) { if (b.mon && b.mon !== mon) continue; if (!inMonth(Date.parse(b.t))) continue; pushHT(byDangBottomCur, b.ma_dang, { value: b.value, t: b.t, src: 'bt' }) }
  }

  const maList = Object.keys(byDangBottom) // ⊇ byDangTop (bottom = top + btvn + bt) — all-time, xem comment trên
  let valid = new Set<string>()
  const mucDoMap = new Map<string, number>()
  if (maList.length) {
    const dd = ((await supabase.from(K.banDoTbl).select('ma_dang, muc_do').in('ma_dang', maList).limit(LIMIT)).data ?? []) as { ma_dang: string; muc_do: number }[]
    for (const x of dd) { valid.add(x.ma_dang); if (x.muc_do != null) mucDoMap.set(x.ma_dang, x.muc_do) }
  }
  const laCoBan = (md: number | null) => bucketMucDo(md) === 'co_ban'
  const laNangCao = (md: number | null) => bucketMucDo(md) === 'nang_cao'

  // % hoàn thành bản đồ (đạt=1·cần=0.5·yếu=0)/ĐÃ-ĐO trên 1 trong 2 bản đồ dạng — predMuc lọc theo bucket
  // muc_do của DẠNG (không phải câu); predTime chỉ dùng cho trend (30 ngày).
  const compPct = (map: Record<string, DangEval[]>, predMuc?: (md: number | null) => boolean, predTime?: (t: number) => boolean): BucketPct & { pctRaw: number | null } => {
    let d = 0, c = 0, y = 0, t = 0
    for (const ma of Object.keys(map)) {
      if (!valid.has(ma)) continue
      if (predMuc && !predMuc(mucDoMap.get(ma) ?? null)) continue
      const evs = predTime ? map[ma].filter((e) => predTime(Date.parse(e.t))) : map[ma]
      if (!evs.length) continue
      const r = masteryOfDang(evs, MASTERY_CONFIG); if (!r) continue
      t++; if (r.muc === 'dat') d++; else if (r.muc === 'can_luyen') c++; else y++
    }
    const pctRaw = t ? Math.round(((d + c * 0.5) / t) * 100) : null
    return { dat: d, can_luyen: c, yeu: y, total: t, pct: pctRaw ?? 0, pctRaw }
  }
  const toBucket = (b: ReturnType<typeof compPct>): BucketPct => ({ dat: b.dat, can_luyen: b.can_luyen, yeu: b.yeu, total: b.total, pct: b.pct })
  const htTop = compPct(byDangTopCur), htTopR = compPct(byDangTop, undefined, inRecent), htTopP = compPct(byDangTop, undefined, inPrior)
  const htBottom = compPct(byDangBottomCur)
  const htTopDaiCB = compPct(byDangTopCur, laCoBan), htBottomDaiCB = compPct(byDangBottomCur, laCoBan)
  const htTopDaiNC = compPct(byDangTopCur, laNangCao), htBottomDaiNC = compPct(byDangBottomCur, laNangCao)

  // ①-Hình (Thùy 21/08: "giống đại, đo trên những mô hình đã có đánh giá" — CÙNG công thức compPct,
  // KHÔNG cần denominator canonical). KP = hinh_baitoan_id, nguồn CHỈ et/mt/btvn (Hình mô hình chưa có
  // tự luyện/bt online — xem getHinhMasteryHS). Bucket cơ bản/nâng cao theo `cap` CLIP 1-5 (xấp xỉ
  // mucDoTuCap thật — như DangBaiTab, chưa join hinh_cach_giai/hinh_cach_bo_de).
  type RawH = { id: string | null; value: number; t: string }
  const hEtRows: RawH[] = [], hMtRows: RawH[] = [], hBtvnRows: RawH[] = []
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob; if (!p || !p.hinh_baitoan_id) continue
    const v = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]; if (v === undefined) continue
    if (p.phase === 'et') hEtRows.push({ id: p.hinh_baitoan_id, value: v, t: g.graded_at })
    else if (p.phase === 'mt') hMtRows.push({ id: p.hinh_baitoan_id, value: v, t: g.graded_at })
    else if (p.phase === 'btvn') hBtvnRows.push({ id: p.hinh_baitoan_id, value: v, t: g.graded_at })
  }
  const hinhTop: Record<string, DangEval[]> = {}, hinhBottom: Record<string, DangEval[]> = {}
  const pushHinh = (map: Record<string, DangEval[]>, id: string | null, ev: DangEval) => { if (id) (map[id] ??= []).push(ev) }
  for (const e of hEtRows) { const ev: DangEval = { value: e.value, t: e.t, src: 'et' }; pushHinh(hinhTop, e.id, ev); pushHinh(hinhBottom, e.id, ev) }
  for (const m of hMtRows) { const ev: DangEval = { value: m.value, t: m.t, src: 'mt' }; pushHinh(hinhTop, m.id, ev); pushHinh(hinhBottom, m.id, ev) }
  for (const b of hBtvnRows) pushHinh(hinhBottom, b.id, { value: b.value, t: b.t, src: 'btvn' })

  let hinhTopCur = hinhTop, hinhBottomCur = hinhBottom
  if (monthFromMs != null) {
    const inMonthRow = (r: RawH) => inMonth(Date.parse(r.t))
    const hEtCur = hEtRows.filter(inMonthRow), hMtCur = hMtRows.filter((r) => inMtWindow(Date.parse(r.t))), hBtvnCur = hBtvnRows.filter(inMonthRow)
    hinhTopCur = {}; hinhBottomCur = {}
    for (const e of hEtCur) { const ev: DangEval = { value: e.value, t: e.t, src: 'et' }; pushHinh(hinhTopCur, e.id, ev); pushHinh(hinhBottomCur, e.id, ev) }
    for (const m of hMtCur) { const ev: DangEval = { value: m.value, t: m.t, src: 'mt' }; pushHinh(hinhTopCur, m.id, ev); pushHinh(hinhBottomCur, m.id, ev) }
    for (const b of hBtvnCur) pushHinh(hinhBottomCur, b.id, { value: b.value, t: b.t, src: 'btvn' })
  }

  const hinhIdList = Object.keys(hinhBottom)
  const hinhValid = new Set<string>()
  const hinhCapMap = new Map<string, number>()
  if (hinhIdList.length) {
    const hb = ((await supabase.from('hinh_baitoan').select('id, cap').in('id', hinhIdList).limit(LIMIT)).data ?? []) as { id: string; cap: number }[]
    for (const x of hb) { hinhValid.add(x.id); if (x.cap != null) hinhCapMap.set(x.id, Math.min(5, Math.max(1, x.cap))) }
  }
  const hinhLaCoBan = (cap: number | null) => bucketMucDo(cap) === 'co_ban'
  const hinhLaNangCao = (cap: number | null) => bucketMucDo(cap) === 'nang_cao'
  const compPctHinh = (map: Record<string, DangEval[]>, predMuc?: (cap: number | null) => boolean): BucketPct & { pctRaw: number | null } => {
    let d = 0, c = 0, y = 0, t = 0
    for (const id of Object.keys(map)) {
      if (!hinhValid.has(id)) continue
      if (predMuc && !predMuc(hinhCapMap.get(id) ?? null)) continue
      const evs = map[id]
      if (!evs.length) continue
      const r = masteryOfDang(evs, MASTERY_CONFIG_HINH); if (!r) continue
      t++; if (r.muc === 'dat') d++; else if (r.muc === 'can_luyen') c++; else y++
    }
    const pctRaw = t ? Math.round(((d + c * 0.5) / t) * 100) : null
    return { dat: d, can_luyen: c, yeu: y, total: t, pct: pctRaw ?? 0, pctRaw }
  }
  const htTopHinhCB = compPctHinh(hinhTopCur, hinhLaCoBan), htBottomHinhCB = compPctHinh(hinhBottomCur, hinhLaCoBan)
  const htTopHinhNC = compPctHinh(hinhTopCur, hinhLaNangCao), htBottomHinhNC = compPctHinh(hinhBottomCur, hinhLaNangCao)

  // ② %ET/%BTVN/%MT cơ bản/nâng cao — bucket theo muc_do dạng của CÂU, gộp đại/hình (Thùy: "ko cần phân
  // biệt đại hình"). Câu không rõ muc_do (dạng không thuộc bản đồ môn này) → bỏ, đối xứng cả 3 nguồn.
  const actBucket = (rows: Raw[], predTime?: (t: number) => boolean, predMuc?: (md: number | null) => boolean) => {
    let s = 0, n = 0
    for (const r of rows) {
      if (!r.ma || !mucDoMap.has(r.ma)) continue
      if (predMuc && !predMuc(mucDoMap.get(r.ma)!)) continue
      const tm = Date.parse(r.t); if (predTime && !predTime(tm)) continue
      s += r.value; n++
    }
    return { s, n }
  }
  const pctOf = (b: { s: number; n: number }): ActPct => ({ pct: b.n ? Math.round((b.s / b.n) * 100) : null, n: b.n })
  const deltaPct = (r: { s: number; n: number }, p: { s: number; n: number }) => {
    const rp = r.n ? Math.round((r.s / r.n) * 100) : null, pp = p.n ? Math.round((p.s / p.n) * 100) : null
    return rp != null && pp != null ? rp - pp : null
  }
  const etCB = actBucket(etRowsCur, undefined, laCoBan), etNC = actBucket(etRowsCur, undefined, laNangCao)
  const btvnCB = actBucket(btvnRowsCur, undefined, laCoBan), btvnNC = actBucket(btvnRowsCur, undefined, laNangCao)
  const mtCB = actBucket(mtRowsCur, undefined, laCoBan), mtNC = actBucket(mtRowsCur, undefined, laNangCao)
  const etCBr = actBucket(etRows, inRecent, laCoBan), etCBp = actBucket(etRows, inPrior, laCoBan)
  const etNCr = actBucket(etRows, inRecent, laNangCao), etNCp = actBucket(etRows, inPrior, laNangCao)
  const btvnCBr = actBucket(btvnRows, inRecent, laCoBan), btvnCBp = actBucket(btvnRows, inPrior, laCoBan)
  const btvnNCr = actBucket(btvnRows, inRecent, laNangCao), btvnNCp = actBucket(btvnRows, inPrior, laNangCao)
  const mtCBr = actBucket(mtRows, inRecent, laCoBan), mtCBp = actBucket(mtRows, inPrior, laCoBan)
  const mtNCr = actBucket(mtRows, inRecent, laNangCao), mtNCp = actBucket(mtRows, inPrior, laNangCao)

  // ③ Điểm (nhập tay qua ky_thi/diem_thi) theo loại, scope môn — khao_sat_thang không hiện ở đây.
  // MT: cơ bản/nâng cao TÁCH RIÊNG (Thùy 08-10: "ngoài % hiện thêm điểm cơ bản-nâng cao-tổng") — mỗi cột
  // đếm/cộng ĐỘC LẬP, bỏ NULL riêng (không giả định 1 lượt luôn có đủ cả 2 — vd tick "Full" thì cả 2 null).
  let mtDiemSum = 0, mtDiemN = 0, trSum = 0, trN = 0
  let mtCoBanSum = 0, mtCoBanN = 0, mtNangCaoSum = 0, mtNangCaoN = 0
  for (const r of (dt ?? []) as any[]) {
    const k = r.ky_thi; if (!k || (k.mon && k.mon !== mon)) continue
    // opts.ym: lọc theo NGÀY THI (ky_thi.ngay) — kỳ thi thiếu ngay (nullable) thì BỎ khi đang xem theo
    // tháng (§1.5 "thiếu data = không có dòng", không đoán tháng cho nó). 'truong' theo lịch tháng thường
    // (monthFrom/To); 'mt_sat_hach' theo cửa sổ MT riêng 25/M→10/M+1 (mtFrom/To, xem comment khai báo).
    if (k.loai === 'truong') {
      if (monthFromMs != null && (!k.ngay || k.ngay < monthFromDate || k.ngay >= monthToDate)) continue
      if (r.diem != null) { trSum += Number(r.diem); trN++ }
    } else if (k.loai === 'mt_sat_hach') {
      // ky_thi.ngay THỰC TẾ luôn NULL cho MT (kỳ MT gắn buoi_hoc_id, không tự nhập ngày riêng — kiểm tra
      // DB thật 08-17: 20/20 bản ghi mt_sat_hach có ngay=null, buoi_hoc_id đủ 20/20) → fallback sang NGÀY
      // CỦA BUỔI qua buoi_hoc_id khi ngay trống.
      const ngayMT = k.ngay ?? k.buoi?.ngay ?? null
      if (mtFromMs != null && (!ngayMT || ngayMT < mtFromDate || ngayMT >= mtToDate)) continue
      if (r.diem != null) { mtDiemSum += Number(r.diem); mtDiemN++ }
      if (r.diem_co_ban != null) { mtCoBanSum += Number(r.diem_co_ban); mtCoBanN++ }
      if (r.diem_nang_cao != null) { mtNangCaoSum += Number(r.diem_nang_cao); mtNangCaoN++ }
    }
  }

  const delta = (r: number | null, p: number | null) => (r != null && p != null ? r - p : null)
  return {
    hoanThanh: {
      toanBo: { etMt: toBucket(htTop), coBTVN: toBucket(htBottom) },
      daiCoBan: { etMt: toBucket(htTopDaiCB), coBTVN: toBucket(htBottomDaiCB) },
      daiNangCao: { etMt: toBucket(htTopDaiNC), coBTVN: toBucket(htBottomDaiNC) },
      hinhCoBan: { etMt: toBucket(htTopHinhCB), coBTVN: toBucket(htBottomHinhCB) },
      hinhNangCao: { etMt: toBucket(htTopHinhNC), coBTVN: toBucket(htBottomHinhNC) },
    },
    hoatDong: {
      etCoBan: pctOf(etCB), etNangCao: pctOf(etNC),
      btvnCoBan: pctOf(btvnCB), btvnNangCao: pctOf(btvnNC),
      mtCoBan: pctOf(mtCB), mtNangCao: pctOf(mtNC),
    },
    diem: {
      mt: {
        tb: mtDiemN ? +(mtDiemSum / mtDiemN).toFixed(1) : null, n: mtDiemN,
        coBan: mtCoBanN ? +(mtCoBanSum / mtCoBanN).toFixed(1) : null, nCoBan: mtCoBanN,
        nangCao: mtNangCaoN ? +(mtNangCaoSum / mtNangCaoN).toFixed(1) : null, nNangCao: mtNangCaoN,
      },
      truong: { tb: trN ? +(trSum / trN).toFixed(1) : null, n: trN },
    },
    trend: {
      hoanThanhToanBo: delta(htTopR.pctRaw, htTopP.pctRaw),
      etCoBan: deltaPct(etCBr, etCBp), etNangCao: deltaPct(etNCr, etNCp),
      btvnCoBan: deltaPct(btvnCBr, btvnCBp), btvnNangCao: deltaPct(btvnNCr, btvnNCp),
      mtCoBan: deltaPct(mtCBr, mtCBp), mtNangCao: deltaPct(mtNCr, mtNCp),
    },
  }
}

// ── ROLLUP LỚP/KHỐI — mỗi HS: đếm dạng đạt/cần-luyện/yếu (thanh 100% "bộ nhớ iPhone") ──
// BULK: ~4 query cho CẢ lớp (không gọi getMasteryHS từng HS). Tái dùng engine masteryOfDang.
export type HSRollup = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; lop: string | null
  dat: number; can_luyen: number; yeu: number; total: number // total = số dạng ĐÃ ĐO (đạt+cần+yếu)
}
// SHARED: nạp measures 1 phạm vi (lớp/khối) → mastery cell (HS × dạng). Dùng CHUNG cho rollup HS (view#2) + pivot dạng (view#3).
// ~4 query: HS-list → grades(embed)+đánh-giá IN(hsIds) → banDo (tên + scope môn) → engine masteryOfDang mỗi ô.
export type CellBundle = {
  hsMap: Map<string, { ho_ten: string; ma_hs: string | null; lop: string | null }>
  hsIds: string[]
  byHS: Map<string, Map<string, Mastery>> // mastery ĐÃ tính (non-null), CHỈ dạng thuộc môn
  dangInfo: Map<string, { ten_dang: string; ten_chuyen_de: string; muc_do: number | null }>
}
export type RollupScope = { mon: string; lopId?: string | null; khoi?: string | null; he?: string | null; includeBTVN?: boolean }
// export: dùng trực tiếp khi cần cell (HS × dạng) thô — vd Trước buổi cần "dạng yếu mức S, n>=3" theo HS,
// khác getMasteryRollup/getMasteryByDang vốn chỉ trả về số đã GỘP (đếm), không giữ lại từng ô.
export async function loadMasteryCells(opts: RollupScope): Promise<CellBundle> {
  const empty: CellBundle = { hsMap: new Map(), hsIds: [], byHS: new Map(), dangInfo: new Map() }
  const K = khoCuaMon(opts.mon)
  // Thùy 07-15: LOẠI ingame + đánh giá GV khỏi mastery (xem comment đầu file) — đối xứng với getMasteryHS.
  // tu_luyen (18-20/08): includeBTVN=true → vào cho MỌI HS (gộp-view) — thêm ngay ở đây. includeBTVN=false
  // → chỉ cấp 1 (cap1Set dưới), xử RIÊNG per-HS ở vòng lặp add() vì phases là danh sách DÙNG CHUNG cả batch.
  const phases: EvalSrc[] = opts.includeBTVN ? ['et', 'mt', 'bt', 'btvn', 'tu_luyen'] : ['et', 'mt']

  // 1) HS trong phạm vi (lớp / khối / HỆ-band × môn), đang học. +khoi để biết cấp 1 (tu_luyen trung tâm).
  let sq
  if (opts.lopId) sq = supabase.from('hoc_sinh_lop').select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs, khoi), lop:lop_id(ten_lop)').eq('lop_id', opts.lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  else if (opts.khoi) sq = supabase.from('hoc_sinh_lop').select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs, khoi), lop:lop_id!inner(ten_lop, khoi, mon)').eq('trang_thai', 'dang_hoc').eq('lop.khoi', opts.khoi).eq('lop.mon', opts.mon).limit(LIMIT)
  else if (opts.he) sq = supabase.from('hoc_sinh_lop').select('hoc_sinh:hoc_sinh_id(id, ho_ten, ma_hs, khoi), lop:lop_id!inner(ten_lop, mon), muc:muc_nang_luc_id!inner(bac)').eq('trang_thai', 'dang_hoc').eq('lop.mon', opts.mon).eq('muc.bac', opts.he).limit(LIMIT)
  else return empty
  const { data: sd, error: se } = await sq
  if (se) throw se
  const hsMap = new Map<string, { ho_ten: string; ma_hs: string | null; lop: string | null }>()
  const cap1Set = new Set<string>()
  for (const r of (sd ?? []) as any[]) {
    const h = r.hoc_sinh; if (!h) continue
    if (!hsMap.has(h.id)) hsMap.set(h.id, { ho_ten: h.ho_ten, ma_hs: h.ma_hs, lop: r.lop?.ten_lop ?? null })
    if (laCap1(h.khoi)) cap1Set.add(h.id)
  }
  const hsIds = [...hsMap.keys()]
  if (hsIds.length === 0) return { ...empty, hsMap }

  // 2) measures BULK.
  const [{ data: grades }, online, bt] = await Promise.all([
    supabase.from('gami_grades').select('hoc_sinh_id, result, graded_at, prob:problem_id(phase, ma_dang)').in('hoc_sinh_id', hsIds).limit(LIMIT),
    fetchOnlineEvals(hsIds),
    fetchBTEvals(hsIds),
  ])
  const evByHS = new Map<string, Map<string, DangEval[]>>()
  const allMa = new Set<string>()
  const add = (hsId: string, ma: string | null | undefined, ev: DangEval) => {
    if (!ma) return
    allMa.add(ma)
    let m = evByHS.get(hsId); if (!m) { m = new Map(); evByHS.set(hsId, m) }
    const arr = m.get(ma) ?? []; arr.push(ev); m.set(ma, arr)
  }
  for (const g of (grades ?? []) as any[]) {
    const p = g.prob; if (!p || !p.ma_dang || !phases.includes(p.phase as EvalSrc)) continue
    const val = RESULT_VALUE[g.result as keyof typeof RESULT_VALUE]; if (val === undefined) continue
    add(g.hoc_sinh_id, p.ma_dang, { value: val, t: g.graded_at, src: p.phase as EvalSrc })
  }
  for (const o of online) {
    // tu_luyen: đã ở trong `phases` khi includeBTVN=true (mọi HS) — nhánh sau chỉ cần cho ca
    // includeBTVN=false + đúng HS đó là cấp 1 (per-HS, không thể nhét vào `phases` dùng chung batch).
    const okTuLuyen = o.src === 'tu_luyen' && !opts.includeBTVN && cap1Set.has(o.hoc_sinh_id)
    if (phases.includes(o.src) || okTuLuyen) add(o.hoc_sinh_id, o.ma_dang, { value: o.value, t: o.t, src: o.src })
  }
  if (phases.includes('bt')) for (const b of bt) add(b.hoc_sinh_id, b.ma_dang, { value: b.value, t: b.t, src: 'bt' })

  // 3) tên dạng + độ khó + scope MÔN (banDo của môn → chỉ giữ dạng hợp lệ).
  const dangInfo = new Map<string, { ten_dang: string; ten_chuyen_de: string; muc_do: number | null }>()
  if (allMa.size) {
    const dd = ((await supabase.from(K.banDoTbl).select('ma_dang, ten_dang, ten_chuyen_de, muc_do').in('ma_dang', [...allMa]).limit(LIMIT)).data ?? []) as any[]
    for (const x of dd) dangInfo.set(x.ma_dang, { ten_dang: x.ten_dang, ten_chuyen_de: x.ten_chuyen_de, muc_do: x.muc_do ?? null })
  }

  // 4) mastery cell (HS × dạng thuộc môn).
  const byHS = new Map<string, Map<string, Mastery>>()
  for (const hsId of hsIds) {
    const em = evByHS.get(hsId); if (!em) continue
    const cm = new Map<string, Mastery>()
    for (const [ma, evals] of em) { if (!dangInfo.has(ma)) continue; const r = masteryOfDang(evals, MASTERY_CONFIG) as Mastery | null; if (r) cm.set(ma, r) }
    if (cm.size) byHS.set(hsId, cm)
  }
  return { hsMap, hsIds, byHS, dangInfo }
}

export async function getMasteryRollup(opts: RollupScope): Promise<HSRollup[]> {
  const { hsMap, hsIds, byHS } = await loadMasteryCells(opts)
  const out: HSRollup[] = []
  for (const hsId of hsIds) {
    const info = hsMap.get(hsId)!
    const cm = byHS.get(hsId)
    let dat = 0, can = 0, yeu = 0
    if (cm) for (const r of cm.values()) { if (r.muc === 'dat') dat++; else if (r.muc === 'can_luyen') can++; else yeu++ }
    out.push({ hoc_sinh_id: hsId, ho_ten: info.ho_ten, ma_hs: info.ma_hs, lop: info.lop, dat, can_luyen: can, yeu, total: dat + can + yeu })
  }
  return out
}

// mucDo filter dùng chung (view#3, Thùy 07-15): 'tat_ca' | 'co_ban' (1-3) | 'nang_cao' (4-5) — toggle bar.
export type MucDoFilter = 'tat_ca' | 'co_ban' | 'nang_cao'
const khopMucDo = (md: number | null, filter?: MucDoFilter) => !filter || filter === 'tat_ca' || bucketMucDo(md) === filter

// PIVOT dạng (view#3): mỗi dạng — bao nhiêu HS đạt/cần-luyện/yếu → "dạng nào cả lớp yếu nhất".
export type DangRollup = { ma_dang: string; ten_dang: string; ten_chuyen_de: string; muc_do: number | null; dat: number; can_luyen: number; yeu: number; tin_thap: number; total: number }
export async function getMasteryByDang(opts: RollupScope, mucDo?: MucDoFilter): Promise<DangRollup[]> {
  const { byHS, dangInfo } = await loadMasteryCells(opts)
  const byDang = new Map<string, Mastery[]>()
  for (const cm of byHS.values()) for (const [ma, r] of cm) { const arr = byDang.get(ma) ?? []; arr.push(r); byDang.set(ma, arr) }
  const out: DangRollup[] = []
  for (const [ma, cells] of byDang) {
    const info = dangInfo.get(ma); if (!info) continue
    if (!khopMucDo(info.muc_do, mucDo)) continue
    let dat = 0, can = 0, yeu = 0, tin_thap = 0
    for (const c of cells) { if (c.muc === 'dat') dat++; else if (c.muc === 'can_luyen') can++; else yeu++; if (c.tin === 'thap') tin_thap++ }
    out.push({ ma_dang: ma, ten_dang: info.ten_dang, ten_chuyen_de: info.ten_chuyen_de, muc_do: info.muc_do, dat, can_luyen: can, yeu, tin_thap, total: dat + can + yeu })
  }
  return out
}

// PIVOT chuyên đề (view#3, gộp dạng): mỗi CHUYÊN ĐỀ — gộp mọi ô (HS × dạng thuộc chuyên đề) → chuyên đề nào lớp yếu.
// mucDo lọc TRƯỚC khi gộp (chỉ gộp dạng khớp bucket) — 1 chuyên đề có thể "biến mất" nếu không có dạng nào khớp.
export type ChuyenDeRollup = { ten_chuyen_de: string; dat: number; can_luyen: number; yeu: number; total: number }
export async function getMasteryByChuyenDe(opts: RollupScope, mucDo?: MucDoFilter): Promise<ChuyenDeRollup[]> {
  const { byHS, dangInfo } = await loadMasteryCells(opts)
  const byCd = new Map<string, Mastery[]>()
  for (const cm of byHS.values()) for (const [ma, r] of cm) {
    const info = dangInfo.get(ma)
    if (!khopMucDo(info?.muc_do ?? null, mucDo)) continue
    const cd = info?.ten_chuyen_de || '(không rõ)'
    const arr = byCd.get(cd) ?? []; arr.push(r); byCd.set(cd, arr)
  }
  const out: ChuyenDeRollup[] = []
  for (const [cd, cells] of byCd) {
    let dat = 0, can = 0, yeu = 0
    for (const c of cells) { if (c.muc === 'dat') dat++; else if (c.muc === 'can_luyen') can++; else yeu++ }
    out.push({ ten_chuyen_de: cd, dat, can_luyen: can, yeu, total: dat + can + yeu })
  }
  return out
}

// ── RAW DATA — nhật ký buổi (xem lại kết quả không qua vận hành) ────────────────
// Mỗi buổi = 1 "thẻ hoạt động"; cờ chamBai/et/danhGia/btvn = phase ĐÃ ĐÓNG (đã chốt kết quả).
// Lọc theo lớp / học sinh; xếp thời gian gần → xa. Bỏ buổi đã HỦY (không có kết quả để xem).
export type BuoiActivity = {
  id: string; ma_buoi: string | null; ngay: string; ten_lop: string | null; mon: string | null
  loai: string; trang_thai: string
  chamBai: boolean; et: boolean; danhGia: boolean; btvn: boolean; mt: boolean
}
export async function listBuoiHoatDong(opts: { mon?: string; lopId?: string | null; hocSinhId?: string | null }): Promise<BuoiActivity[]> {
  const sel = 'id, ma_buoi, ngay, loai, trang_thai, ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at, mt_dong_at, lop:lop_id(ten_lop, mon)'
  // HS scope: KHÔNG embed buoi_hoc_hs!inner — bảng có 2 FK về buoi_hoc (buoi_hoc_id + bu_cho_buoi_id)
  // → embed nhập nhằng → query lỗi. Tách 2 bước: lấy buoi_hoc_id của HS rồi query buổi theo IN.
  let buoiIds: string[] | null = null
  if (opts.hocSinhId) {
    const { data: bhs, error: e1 } = await supabase.from('buoi_hoc_hs').select('buoi_hoc_id').eq('hoc_sinh_id', opts.hocSinhId).limit(LIMIT)
    if (e1) throw e1
    buoiIds = [...new Set((bhs ?? []).map((r: any) => r.buoi_hoc_id).filter(Boolean))]
    if (buoiIds.length === 0) return []
  }
  let q = supabase.from('buoi_hoc').select(sel).neq('trang_thai', 'huy').order('ngay', { ascending: false }).limit(LIMIT)
  if (opts.lopId) q = q.eq('lop_id', opts.lopId)
  if (buoiIds) q = q.in('id', buoiIds)
  const { data, error } = await q
  if (error) throw error
  let rows = (data ?? []) as any[]
  if (opts.mon) rows = rows.filter((b) => b.lop?.mon === opts.mon) // buổi bù (lop_id null) → mon null → bị lọc khi chọn môn (chấp nhận)
  return rows.map((b) => ({
    id: b.id, ma_buoi: b.ma_buoi, ngay: b.ngay, ten_lop: b.lop?.ten_lop ?? null, mon: b.lop?.mon ?? null,
    loai: b.loai, trang_thai: b.trang_thai,
    chamBai: !!b.ingame_dong_at, et: !!b.et_dong_at, danhGia: !!b.danh_gia_xong_at, btvn: !!b.btvn_dong_at, mt: !!b.mt_dong_at,
  }))
}

// ── VIEW CẢ LỚP: ma trận (HS × buổi) cho 1 hoạt động (ET/BTVN/MT). Ô = % hoàn thành + trạng thái. ──
// Nhìn tổng quát cả lớp: ai làm/chưa làm, được bao nhiêu %. "Không làm" (BTVN xin phép/không làm) tô cảnh báo.
export type MatrixPhase = 'et' | 'btvn' | 'mt'
export type MatrixCell = { pct: number | null; status: 'done' | 'khong_lam' | 'vang' | 'none' }
export type ClassMatrix = {
  buois: { id: string; ngay: string; ma_buoi: string | null }[]        // cột — ngày tăng dần
  students: { id: string; ho_ten: string; ma_hs: string | null }[]     // dòng — theo tên
  cells: Record<string, MatrixCell>                                    // key `${hsId}:${buoiId}`
}
const DONG_AT: Record<MatrixPhase, string> = { et: 'et_dong_at', btvn: 'btvn_dong_at', mt: 'mt_dong_at' }

// gami_grades (phase + buổi) → gộp (hs×buổi)={pts,n}. Filter qua embed !inner theo buoi_hoc_id (list buổi
// NHỎ, tránh IN problem_id dài). ⚠ PHÂN TRANG bắt buộc: PostgREST cap max-rows=1000 → .limit(10000) bị bỏ
// qua, nếu >1000 grades sẽ RỚT nguyên vài buổi (thứ tự trả về không theo ngày) → ô hiện "·" dù đã chấm.
async function fetchGradeAgg(phase: MatrixPhase, buoiIds: string[]): Promise<Map<string, { pts: number; n: number }>> {
  const agg = new Map<string, { pts: number; n: number }>()
  if (!buoiIds.length) return agg
  const PAGE = 1000
  for (let from = 0; from < 200000; from += PAGE) {
    const { data, error } = await supabase.from('gami_grades')
      .select('hoc_sinh_id, points, prob:problem_id!inner(buoi_hoc_id, phase)')
      .eq('prob.phase', phase).in('prob.buoi_hoc_id', buoiIds)
      .order('problem_id').order('hoc_sinh_id').range(from, from + PAGE - 1)
    if (error) throw error
    const rows = (data ?? []) as any[]
    for (const g of rows) {
      const bId = g.prob?.buoi_hoc_id; if (!bId) continue
      const k = g.hoc_sinh_id + ':' + bId
      const a = agg.get(k) ?? { pts: 0, n: 0 }; a.pts += Number(g.points); a.n += 1; agg.set(k, a)
    }
    if (rows.length < PAGE) break
  }
  return agg
}

// Lấy HẾT dòng theo buoi_hoc_id — PHÂN TRANG (PostgREST cap max-rows=1000). apply = filter thêm (vd co_mat).
// ⚠ Overview gộp buổi CẢ 38 lớp → điểm danh/btvn_ket_qua dễ >1000 → nếu .limit(10000) sẽ RỚT lớp → sai số.
async function pagedByBuoi(table: string, cols: string, buoiIds: string[], apply?: (q: any) => any): Promise<any[]> {
  const out: any[] = []
  if (!buoiIds.length) return out
  const PAGE = 1000
  for (let from = 0; from < 500000; from += PAGE) {
    let query: any = supabase.from(table).select(cols).in('buoi_hoc_id', buoiIds)
    if (apply) query = apply(query)
    const { data, error } = await query.order('buoi_hoc_id').order('hoc_sinh_id').range(from, from + PAGE - 1)
    if (error) throw error
    const rows = (data ?? []) as any[]
    out.push(...rows)
    if (rows.length < PAGE) break
  }
  return out
}

// ym = 'YYYY-MM' (tùy chọn) → chỉ lấy buổi trong tháng đó (điều hướng next/prev ở UI).
export async function getClassMatrix(lopId: string, phase: MatrixPhase, ym?: string): Promise<ClassMatrix> {
  // 1) buổi thường của lớp ĐÃ ĐÓNG hoạt động này → cột (lọc tháng nếu có)
  let bq = supabase.from('buoi_hoc')
    .select('id, ngay, ma_buoi').eq('lop_id', lopId).eq('loai', 'thuong').neq('trang_thai', 'huy')
    .not(DONG_AT[phase], 'is', null)
  if (ym) {
    const [y, m] = ym.split('-').map(Number)
    const to = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`
    bq = bq.gte('ngay', `${ym}-01`).lt('ngay', to)
  }
  const { data: bs, error: eB } = await bq.order('ngay', { ascending: true }).limit(LIMIT)
  if (eB) throw eB
  const buois = (bs ?? []).map((b: any) => ({ id: b.id, ngay: b.ngay, ma_buoi: b.ma_buoi }))
  const buoiIds = buois.map((b) => b.id)

  // 2) roster lớp (đang học — vắng vẫn hiện dòng)
  const { data: hl, error: eH } = await supabase.from('hoc_sinh_lop')
    .select('hoc_sinh(id, ho_ten, ma_hs)').eq('lop_id', lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  if (eH) throw eH
  const students = (hl ?? []).map((r: any) => r.hoc_sinh).filter(Boolean)
    .sort((a: any, b: any) => String(a.ho_ten).localeCompare(String(b.ho_ten), 'vi'))
  const cells: Record<string, MatrixCell> = {}
  if (!buoiIds.length || !students.length) return { buois, students, cells }

  // 3) điểm chấm → gộp (hs×buổi): pts/(n×100). Phân trang (fetchGradeAgg) vì PostgREST cap 1000 dòng.
  const agg = await fetchGradeAgg(phase, buoiIds)

  // 4) BTVN: xin phép / không làm → cảnh báo "không làm"
  const miss = new Set<string>()
  if (phase === 'btvn') {
    for (const r of await pagedByBuoi('btvn_ket_qua', 'hoc_sinh_id, buoi_hoc_id, trang_thai_nop', buoiIds))
      if (r.trang_thai_nop === 'khong_lam' || r.trang_thai_nop === 'xin_phep') miss.add(r.hoc_sinh_id + ':' + r.buoi_hoc_id)
  }

  // 5) vắng → phân biệt "vắng" vs "chưa có dữ liệu"
  const vang = new Set<string>()
  for (const r of await pagedByBuoi('buoi_hoc_hs', 'hoc_sinh_id, buoi_hoc_id, diem_danh', buoiIds))
    if (r.diem_danh === 'vang' || r.diem_danh === 'vang_phep') vang.add(r.hoc_sinh_id + ':' + r.buoi_hoc_id)

  // 6) dựng ô
  for (const s of students) for (const b of buois) {
    const k = s.id + ':' + b.id
    const a = agg.get(k)
    if (a && a.n > 0) cells[k] = { pct: Math.min(100, Math.round((a.pts / (a.n * 100)) * 100)), status: 'done' }
    else if (miss.has(k)) cells[k] = { pct: null, status: 'khong_lam' }
    else if (vang.has(k)) cells[k] = { pct: null, status: 'vang' }
    else cells[k] = { pct: null, status: 'none' }
  }
  return { buois, students, cells }
}

// ── TỔNG QUAN TẤT CẢ LỚP: tỉ lệ HOÀN THÀNH DỮ LIỆU của từng lớp cho 1 hoạt động (ET/BTVN/MT) ──
// "Hoàn thành" = ô (HS-có-mặt × buổi) đã có dữ liệu / tổng ô kỳ vọng. ET/MT: có chấm điểm. BTVN: đã ghi
// trạng thái nộp (btvn_ket_qua — kể cả "không làm" cũng là ĐÃ ghi). Dùng để soi lớp nào GV chưa nhập kịp.
export type ClassCompletion = { lopId: string; tenLop: string; buoiCount: number; expected: number; done: number; pct: number | null }
export async function getAllClassesCompletion(mon: string, phase: MatrixPhase, ym: string): Promise<ClassCompletion[]> {
  const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('mon', mon).limit(LIMIT)
  const lopList = (lops ?? []) as { id: string; ten_lop: string }[]
  if (!lopList.length) return []
  const [y, m] = ym.split('-').map(Number)
  const to = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`
  const { data: bs } = await supabase.from('buoi_hoc').select('id, lop_id')
    .in('lop_id', lopList.map((l) => l.id)).eq('loai', 'thuong').neq('trang_thai', 'huy')
    .not(DONG_AT[phase], 'is', null).gte('ngay', `${ym}-01`).lt('ngay', to).limit(LIMIT)
  const buois = (bs ?? []) as { id: string; lop_id: string }[]
  const buoiLop = new Map<string, string>(buois.map((b) => [b.id, b.lop_id]))
  const buoiIds = buois.map((b) => b.id)
  const per = new Map<string, { buoi: Set<string>; expected: Set<string>; done: Set<string> }>()
  for (const l of lopList) per.set(l.id, { buoi: new Set(), expected: new Set(), done: new Set() })
  for (const b of buois) per.get(b.lop_id)?.buoi.add(b.id)

  if (buoiIds.length) {
    // ô KỲ VỌNG = HS có mặt × buổi (PHÂN TRANG — gộp cả 38 lớp dễ >1000 dòng)
    for (const a of await pagedByBuoi('buoi_hoc_hs', 'hoc_sinh_id, buoi_hoc_id', buoiIds, (q) => q.eq('diem_danh', 'co_mat'))) {
      const lop = buoiLop.get(a.buoi_hoc_id); if (lop) per.get(lop)?.expected.add(a.hoc_sinh_id + ':' + a.buoi_hoc_id)
    }
    // ô ĐÃ CÓ DỮ LIỆU
    const donePairs = new Set<string>()   // hs:buoi
    if (phase === 'btvn') {
      for (const r of await pagedByBuoi('btvn_ket_qua', 'hoc_sinh_id, buoi_hoc_id', buoiIds)) donePairs.add(r.hoc_sinh_id + ':' + r.buoi_hoc_id)
    } else {
      const agg = await fetchGradeAgg(phase, buoiIds)   // phân trang + embed (xem fetchGradeAgg)
      for (const k of agg.keys()) donePairs.add(k)
    }
    for (const k of donePairs) { const bId = k.split(':')[1]; const lop = buoiLop.get(bId); if (lop) per.get(lop)?.done.add(k) }
  }

  return lopList.map((l) => {
    const p = per.get(l.id)!
    let done = 0; for (const k of p.done) if (p.expected.has(k)) done++   // chỉ đếm trong ô kỳ vọng
    const expected = p.expected.size
    return { lopId: l.id, tenLop: l.ten_lop, buoiCount: p.buoi.size, expected, done, pct: expected ? Math.round((done / expected) * 100) : null }
  }).filter((c) => c.buoiCount > 0)
    .sort((a, z) => (a.pct ?? 101) - (z.pct ?? 101) || a.tenLop.localeCompare(z.tenLop, 'vi'))   // lag (thấp) lên đầu
}
