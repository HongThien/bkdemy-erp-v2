// Theo dõi bài tập trên app HS — CEO 17/09.
// Chỉ tính loại HS tự làm ngoài lớp: tự luyện · bổ trợ · retest.
// RPC trả 1 dòng/(HS, ngày có làm) + 1 dòng ngay=null cho HS không làm gì → client tự dựng
// bảng ngày×HS. Không tính toán nghiệp vụ ở TS (§2.0 CLAUDE.md) — chỉ group + format.
import { supabase } from './supabase'

export type BangLamBaiRow = {
  hoc_sinh_id: string
  ho_ten: string
  ma_hs: string | null
  khoi: string | null
  lop_id: string
  ten_lop: string
  ngay: string | null // YYYY-MM-DD (VN) hoặc null (HS không làm gì)
  so_cau: number
  so_dung: number
  so_sai: number
  thoi_gian_giay: number
}

export async function fetchBangLamBai(
  tu: string, den: string,
  lopIds?: string[] | null, hocSinhIds?: string[] | null,
): Promise<BangLamBaiRow[]> {
  const { data, error } = await supabase.rpc('fn_theodoi_bang_lam_bai', {
    p_tu: tu, p_den: den,
    p_lop_ids: lopIds ?? null,
    p_hoc_sinh_ids: hocSinhIds ?? null,
  })
  if (error) throw error
  return (data ?? []) as BangLamBaiRow[]
}

// Sinh mảng ngày (từ mới → cũ) trong khoảng [tu..den].
export function dayRangeDesc(tu: string, den: string): string[] {
  const out: string[] = []
  const t = new Date(tu + 'T00:00:00')
  const d = new Date(den + 'T00:00:00')
  for (let cur = new Date(d); cur >= t; cur.setDate(cur.getDate() - 1)) {
    const y = cur.getFullYear(), m = String(cur.getMonth() + 1).padStart(2, '0'), day = String(cur.getDate()).padStart(2, '0')
    out.push(`${y}-${m}-${day}`)
  }
  return out
}

export function homNayVNStr(): string {
  const d = new Date()
  // Đổi sang giờ VN bằng offset toLocaleDateString sv-SE (ISO date-only, không lệ thuộc TZ máy)
  return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' })
}

export function truNgay(ngay: string, soNgay: number): string {
  const [y, m, d] = ngay.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() - soNgay)
  return dt.toLocaleDateString('sv-SE', { timeZone: 'UTC' })
}

// Cấu trúc bảng đã group: 1 row = 1 HS, cells = Map<ngay, {so_cau, so_dung, ti_le, tg}>.
export type CellStat = { so_cau: number; so_dung: number; so_sai: number; thoi_gian_giay: number }
export type HocSinhRow = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null
  lop_id: string; ten_lop: string
  cells: Record<string, CellStat> // key = ngay YYYY-MM-DD
  tong_cau: number
  tong_dung: number
  so_ngay_lam: number
}

export function groupByHS(rows: BangLamBaiRow[]): HocSinhRow[] {
  const map = new Map<string, HocSinhRow>()
  for (const r of rows) {
    let hs = map.get(r.hoc_sinh_id)
    if (!hs) {
      hs = {
        hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.ho_ten, ma_hs: r.ma_hs, khoi: r.khoi,
        lop_id: r.lop_id, ten_lop: r.ten_lop,
        cells: {}, tong_cau: 0, tong_dung: 0, so_ngay_lam: 0,
      }
      map.set(r.hoc_sinh_id, hs)
    }
    if (r.ngay) {
      hs.cells[r.ngay] = {
        so_cau: r.so_cau, so_dung: r.so_dung, so_sai: r.so_sai, thoi_gian_giay: r.thoi_gian_giay,
      }
      hs.tong_cau += r.so_cau
      hs.tong_dung += r.so_dung
      if (r.so_cau > 0) hs.so_ngay_lam += 1
    }
  }
  return Array.from(map.values())
}
