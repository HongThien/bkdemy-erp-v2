// TRƯỚC BUỔI — báo cáo tình hình học tập lớp gửi GV (spec-truocbuoi.md). READ-ONLY tuyệt đối:
// không insert/update/upsert/delete, không migration, không bảng mới — toàn bộ là view suy động
// trên dữ liệu đã có. Không gọi AI (đã đo ở Dashboard học tập — tần suất module này quá cao để thêm AI).
import { supabase } from './supabase'
import { khoCuaMon } from './tailieu'
import { loadMasteryCells } from './mastery'
import { pctFromAgg } from './report'
import { getLevels } from './danhgia'
import { tenNganHS } from './hoten'
import { TRUOCBUOI_CONFIG as CFG } from '../gami/config.js'

const LIMIT = 10000
const HIST_BUOI_LIMIT = 120 // ~4-5 tháng ngược cho lớp 1-2 buổi/tuần — đủ tìm buổi trước + tháng này + tháng trước

export type TrangThaiNop = 'nop_dung_han' | 'xin_phep' | 'khong_lam' | 'nop_muon'
export type ThaiDo = 'nghiem_tuc' | 'chua_het_suc' | 'chua_nghiem_tuc' | 'chong_doi'
export type OBuoiBTVN = { buoiId: string; trangThai: TrangThaiNop | null; chuaCham: boolean }
export type DangNgan = { maDang: string; tenDang: string; n?: number }
export type LyDo = 'btvn' | 'et' | 'dang'

export type HangHS = {
  hocSinhId: string
  tenNgan: string
  level: number | null
  btvnTruoc: { trangThai: TrangThaiNop | null; thaiDo: ThaiDo | null; chuaCham: boolean }
  btvnThang: { oPerBuoi: OBuoiBTVN[]; soDatHan: number; tongBuoi: number }
  etTruoc: { pct: number | null; vang: boolean }
  etThang: { pct: number | null; deltaThangTruoc: number | null } // null = không đủ căn cứ, ẩn mũi tên
  dangYeuTruoc: DangNgan[] // verdict S tại buổi trước (buoi_danh_gia_dang, KHÔNG qua mastery, không cần đủ mẫu)
  dangYeuThang: DangNgan[] // mastery mức yếu, n>=CFG.MASTERY_YEU_N_MIN (loadMasteryCells — TOÀN BỘ lịch sử,
  // khớp đúng "Kết quả học tập → Dạng bài" — KHÔNG tự khoanh cửa sổ tháng, tránh 2 màn ra 2 số khác nhau)
  batThuong: LyDo[] // rỗng = không vào Lớp 1
}

export type BaoCaoTruocBuoi = {
  buoiTruoc: { id: string; ngay: string; maBuoi: string | null } | null
  thang: string // 'YYYY-MM'
  hang: HangHS[]
  chuaChamBTVN: { daCham: number; tong: number }
  trangThaiRong: 'ok' | 'chua_co_buoi_truoc' | 'chua_co_du_lieu_thang'
}

type TruocBuoiArgs = { lopId: string; ngayBuoi: string; mon: string }

const EMPTY: BaoCaoTruocBuoi = { buoiTruoc: null, thang: '', hang: [], chuaChamBTVN: { daCham: 0, tong: 0 }, trangThaiRong: 'chua_co_buoi_truoc' }

function firstOfMonth(ngay: string): string { return ngay.slice(0, 7) + '-01' }
function prevMonthStart(ymd: string): string {
  const [y, m] = ymd.slice(0, 7).split('-').map(Number)
  return m === 1 ? `${y - 1}-12-01` : `${y}-${String(m - 1).padStart(2, '0')}-01`
}

// Phân trang .range() — pattern chuẩn của repo (mastery.ts pagedByBuoi / hocphi.ts fetchAllBhh), viết
// đúng luôn dù lớp đơn chưa chạm LIMIT: view "cả khối" sẽ tới, đừng để phải vá.
// orderCols PHẢI là cột thật ở bảng gốc (không phải cột của bảng embed) — PostgREST không order được
// theo cột nằm trong quan hệ nhúng (vd `prob.buoi_hoc_id`), xem fetchGradeAgg (mastery.ts) order theo
// problem_id/hoc_sinh_id chứ không theo buoi_hoc_id dù đó là điều kiện filter.
async function pagedIn(table: string, cols: string, buoiIds: string[], hsIds: string[], orderCols: string[], extra?: (q: any) => any): Promise<any[]> {
  const out: any[] = []
  if (!buoiIds.length || !hsIds.length) return out
  const PAGE = 1000
  for (let from = 0; ; from += PAGE) {
    let q: any = supabase.from(table).select(cols).in('buoi_hoc_id', buoiIds).in('hoc_sinh_id', hsIds)
    if (extra) q = extra(q)
    for (const c of orderCols) q = q.order(c)
    const { data, error } = await q.range(from, from + PAGE - 1)
    if (error) throw error
    const rows = (data ?? []) as any[]
    out.push(...rows)
    if (rows.length < PAGE) break
  }
  return out
}

export async function getBaoCaoTruocBuoi(a: TruocBuoiArgs): Promise<BaoCaoTruocBuoi> {
  const thang = a.ngayBuoi.slice(0, 7)
  const monthStart = firstOfMonth(a.ngayBuoi)
  const prevStart = prevMonthStart(a.ngayBuoi)

  // 1) Lịch sử buổi THƯỜNG đã mở/hoàn tất của lớp, ngược từ trước ngày đang xem → buổi trước (gần nhất)
  //    + danh sách buổi trong tháng này + tháng trước (cho delta ET).
  const { data: bh, error: eB } = await supabase.from('buoi_hoc')
    .select('id, ngay, ma_buoi').eq('lop_id', a.lopId).eq('loai', 'thuong').in('trang_thai', ['mo', 'hoan_tat'])
    .lt('ngay', a.ngayBuoi).order('ngay', { ascending: false }).limit(HIST_BUOI_LIMIT)
  if (eB) throw eB
  const hist = (bh ?? []) as { id: string; ngay: string; ma_buoi: string | null }[]
  const buoiTruoc = hist[0] ? { id: hist[0].id, ngay: hist[0].ngay, maBuoi: hist[0].ma_buoi } : null
  if (!buoiTruoc) return { ...EMPTY, thang }

  // hist là ngày GIẢM DẦN (cần vậy để hist[0] = buổi trước) — nhưng dải ô BTVN tháng phải hiện theo
  // thời gian TĂNG DẦN (đọc trái→phải như mockup, kết thúc ở buổi trước) → đảo lại khi lọc theo tháng.
  const monthBuois = hist.filter((b) => b.ngay >= monthStart).slice().reverse()
  const prevMonthBuois = hist.filter((b) => b.ngay >= prevStart && b.ngay < monthStart)
  const monthBuoiIds = monthBuois.map((b) => b.id)
  const prevMonthBuoiIds = prevMonthBuois.map((b) => b.id)
  const trangThaiRong: BaoCaoTruocBuoi['trangThaiRong'] = monthBuoiIds.length ? 'ok' : 'chua_co_du_lieu_thang'

  // 2) Roster = HS đang học của lớp tính tới ngày đang xem (không lệ thuộc HS có mặt ở buổi trước — HS
  //    mới vào sau buổi trước vẫn phải xuất hiện, chỉ là chưa có dữ liệu buổi trước/tháng).
  const { data: hl, error: eH } = await supabase.from('hoc_sinh_lop')
    .select('hoc_sinh_id, ngay_vao, hoc_sinh:hoc_sinh_id(id, ho_ten)').eq('lop_id', a.lopId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  if (eH) throw eH
  const roster = ((hl ?? []) as any[])
    .filter((r) => !r.ngay_vao || r.ngay_vao <= a.ngayBuoi)
    .map((r) => ({ id: r.hoc_sinh_id as string, hoTen: (r.hoc_sinh?.ho_ten as string) ?? '' }))
    .sort((x, y) => x.hoTen.localeCompare(y.hoTen, 'vi') || x.id.localeCompare(y.id))
  if (!roster.length) return { ...EMPTY, buoiTruoc, thang, trangThaiRong: 'ok' }
  const hsIds = roster.map((r) => r.id)

  // 3) Điểm danh buổi trước (chỉ 1 buổi, nhỏ) — cho biết ai VẮNG (ET = điểm danh).
  const { data: ddRows, error: eD } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id, diem_danh').eq('buoi_hoc_id', buoiTruoc.id).in('hoc_sinh_id', hsIds).limit(LIMIT)
  if (eD) throw eD
  const vangMap = new Map<string, boolean>()
  for (const r of (ddRows ?? []) as any[]) vangMap.set(r.hoc_sinh_id, r.diem_danh === 'vang' || r.diem_danh === 'vang_phep')

  // 4) BTVN — bulk toàn bộ buổi thường trong tháng + buổi trước (nếu buổi trước rơi ngoài tháng này).
  const btvnBuoiIds = [...new Set([...monthBuoiIds, buoiTruoc.id])]
  const kqRows = await pagedIn('btvn_ket_qua', 'hoc_sinh_id, buoi_hoc_id, trang_thai_nop, thai_do', btvnBuoiIds, hsIds, ['buoi_hoc_id', 'hoc_sinh_id'])
  const kqByHsBuoi = new Map<string, { tt: string | null; td: string | null }>()
  for (const r of kqRows as any[]) kqByHsBuoi.set(r.hoc_sinh_id + ':' + r.buoi_hoc_id, { tt: r.trang_thai_nop, td: r.thai_do })

  // 5) ET — bulk gami_grades phase='et' cho buổi tháng này + buổi trước + tháng trước (cần cho delta).
  //    Dùng lại ĐÚNG công thức pctFromAgg (report.ts) — không viết lại arithmetic. buoi_hoc_id là cột
  //    THẬT trên gami_grades (denormalized) — chỉ cần embed problem để lọc phase.
  const etBuoiIds = [...new Set([...monthBuoiIds, buoiTruoc.id, ...prevMonthBuoiIds])]
  const gRows = await pagedIn('gami_grades', 'hoc_sinh_id, buoi_hoc_id, points, problem_id, prob:problem_id!inner(phase)', etBuoiIds, hsIds, ['problem_id', 'hoc_sinh_id'], (q) => q.eq('prob.phase', 'et'))
  const etAgg = new Map<string, { pts: number; n: number }>() // key hsId:buoiId
  for (const g of gRows as any[]) {
    const bId = g.buoi_hoc_id as string | undefined
    if (!bId) continue
    const k = g.hoc_sinh_id + ':' + bId
    const cur = etAgg.get(k) ?? { pts: 0, n: 0 }; cur.pts += Number(g.points); cur.n += 1; etAgg.set(k, cur)
  }

  // 6) Dạng yếu BUỔI TRƯỚC — verdict thô S (diem=0) tại buoi_danh_gia_dang, KHÔNG qua mastery, không cần đủ mẫu.
  const { data: dgRows, error: eG } = await supabase.from('buoi_danh_gia_dang').select('hoc_sinh_id, ma_dang')
    .eq('buoi_hoc_id', buoiTruoc.id).eq('diem', 0).in('hoc_sinh_id', hsIds).limit(LIMIT)
  if (eG) throw eG
  const dgByHs = new Map<string, string[]>()
  for (const r of (dgRows ?? []) as any[]) { const arr = dgByHs.get(r.hoc_sinh_id) ?? []; arr.push(r.ma_dang); dgByHs.set(r.hoc_sinh_id, arr) }
  const dgMaList = [...new Set((dgRows ?? []).map((r: any) => r.ma_dang as string))]
  const dgNameMap = new Map<string, string>()
  if (dgMaList.length) {
    const K = khoCuaMon(a.mon)
    const { data: names } = await supabase.from(K.banDoTbl).select('ma_dang, ten_dang').in('ma_dang', dgMaList).limit(LIMIT)
    for (const n of (names ?? []) as any[]) dgNameMap.set(n.ma_dang, n.ten_dang)
  }

  // 7) Dạng yếu THÁNG — mastery mức yếu, n đủ mẫu. Tái dùng NGUYÊN VẸN engine dùng chung (khớp "Kết quả
  //    học tập → Dạng bài" — mastery suy động trên TOÀN BỘ lịch sử đo, không tự khoanh lại theo tháng).
  const cells = await loadMasteryCells({ mon: a.mon, lopId: a.lopId })
  const dangYeuThangByHs = new Map<string, DangNgan[]>()
  for (const hsId of hsIds) {
    const cm = cells.byHS.get(hsId); if (!cm) continue
    const weak: (DangNgan & { score: number })[] = []
    for (const [ma, cell] of cm) {
      if (cell.muc !== 'yeu' || cell.n < CFG.MASTERY_YEU_N_MIN) continue
      const info = cells.dangInfo.get(ma); if (!info) continue
      weak.push({ maDang: ma, tenDang: info.ten_dang, n: cell.n, score: cell.score })
    }
    weak.sort((x, y) => x.score - y.score) // yếu nhất trước
    dangYeuThangByHs.set(hsId, weak.map(({ score, ...d }) => d))
  }

  // 8) Level (chỉ hiển thị ở Lớp 1) — kiến thức, khớp Dashboard học tập.
  const levelMap = await getLevels(hsIds, a.mon)

  let daCham = 0
  const hang: HangHS[] = roster.map((r) => {
    const kqTruoc = kqByHsBuoi.get(r.id + ':' + buoiTruoc.id)
    const btvnTruoc = { trangThai: (kqTruoc?.tt as TrangThaiNop) ?? null, thaiDo: (kqTruoc?.td as ThaiDo) ?? null, chuaCham: !kqTruoc }
    if (kqTruoc) daCham++

    const oPerBuoi: OBuoiBTVN[] = monthBuois.map((b) => {
      const kq = kqByHsBuoi.get(r.id + ':' + b.id)
      return { buoiId: b.id, trangThai: (kq?.tt as TrangThaiNop) ?? null, chuaCham: !kq }
    })
    const soDatHan = oPerBuoi.filter((o) => o.trangThai === 'nop_dung_han' || o.trangThai === 'nop_muon').length

    const aggTruoc = etAgg.get(r.id + ':' + buoiTruoc.id)
    const vang = vangMap.get(r.id) ?? false
    const etTruocPct = vang ? null : pctFromAgg(aggTruoc?.pts ?? 0, aggTruoc?.n ?? 0)

    const etThangCells = monthBuois.map((b) => pctFromAgg(etAgg.get(r.id + ':' + b.id)?.pts ?? 0, etAgg.get(r.id + ':' + b.id)?.n ?? 0)).filter((v): v is number => v != null)
    const etThangPct = etThangCells.length ? Math.round(etThangCells.reduce((s, v) => s + v, 0) / etThangCells.length) : null
    const etPrevCells = prevMonthBuois.map((b) => pctFromAgg(etAgg.get(r.id + ':' + b.id)?.pts ?? 0, etAgg.get(r.id + ':' + b.id)?.n ?? 0)).filter((v): v is number => v != null)
    const etPrevPct = etPrevCells.length ? Math.round(etPrevCells.reduce((s, v) => s + v, 0) / etPrevCells.length) : null
    const deltaThangTruoc = etThangPct != null && etPrevPct != null ? etThangPct - etPrevPct : null

    const dangYeuTruoc: DangNgan[] = (dgByHs.get(r.id) ?? []).map((ma) => ({ maDang: ma, tenDang: dgNameMap.get(ma) ?? ma }))
    const dangYeuThang = dangYeuThangByHs.get(r.id) ?? []

    const batThuong: LyDo[] = []
    if (btvnTruoc.trangThai === 'khong_lam' || btvnTruoc.trangThai === 'nop_muon' ||
        btvnTruoc.thaiDo === 'chua_het_suc' || btvnTruoc.thaiDo === 'chua_nghiem_tuc' || btvnTruoc.thaiDo === 'chong_doi') batThuong.push('btvn')
    if ((etTruocPct != null && etTruocPct < CFG.ET_THAP) || (deltaThangTruoc != null && deltaThangTruoc <= -CFG.ET_TUT)) batThuong.push('et')
    if (dangYeuThang.length > 0) batThuong.push('dang')

    return {
      hocSinhId: r.id, tenNgan: tenNganHS(r.hoTen), level: levelMap.get(r.id)?.kien_thuc ?? null,
      btvnTruoc, btvnThang: { oPerBuoi, soDatHan, tongBuoi: monthBuois.length },
      etTruoc: { pct: etTruocPct, vang }, etThang: { pct: etThangPct, deltaThangTruoc },
      dangYeuTruoc, dangYeuThang, batThuong,
    }
  })

  return { buoiTruoc, thang, hang, chuaChamBTVN: { daCham, tong: roster.length }, trangThaiRong }
}
