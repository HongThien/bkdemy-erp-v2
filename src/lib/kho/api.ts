// Data-layer Kho — UI KHÔNG đụng supabase trực tiếp, chỉ gọi các hàm ở đây.
// Tính/seam đặt ở đây để sau đổi nguồn (view Postgres, mock…) không phải sửa component.
import { supabase } from '../supabase'

const LIMIT = 10000 // spec-kho-v2 §1.3 — mọi list .limit(10000)

// Khối: spec cho '3'..'12','4T','5T'. Thu gọn THCS+THPT cho bản đầu, chỉnh sau nếu cần.
export const KHOI_OPTIONS = ['6', '7', '8', '9', '10', '11', '12'] as const

export type LopBac = { ma: string; ten: string; thu_tu: number }

export type DaiDang = {
  ma_dang: string
  khoi: string
  ma_chu_de: string
  ten_chu_de: string
  ma_chuyen_de: string
  ten_chuyen_de: string
  ten_dang: string
  muc_do: number
  bac_toi_thieu: string
  created_at?: string
}
export type DaiDangInput = Omit<DaiDang, 'ma_dang' | 'created_at'>
export type DaiDangRow = Omit<DaiDang, 'created_at'> // gồm ma_dang (nay sinh tay theo mã vị trí)

// ── Danh mục bậc lớp (S>A>B>C) ───────────────────────────────────
export async function listLopBac(): Promise<LopBac[]> {
  const { data, error } = await supabase
    .from('lop_bac').select('*').order('thu_tu', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ── Đọc dạng Đại theo khối ───────────────────────────────────────
export async function listDaiDang(khoi: string): Promise<DaiDang[]> {
  const { data, error } = await supabase
    .from('dai_ban_do').select('*')
    .eq('khoi', khoi)
    .order('ma_chu_de').order('ma_chuyen_de').order('ma_dang')
    .limit(LIMIT)
  if (error) throw error
  return (data ?? []) as DaiDang[]
}

// #câu treo theo dạng (tạm group ở client; TODO: chuyển sang view Postgres khi có data lớn)
export async function countCauByDang(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('dai_cau_hoi').select('dang_chinh').limit(LIMIT)
  if (error) throw error
  const m: Record<string, number> = {}
  for (const r of data ?? []) m[r.dang_chinh] = (m[r.dang_chinh] ?? 0) + 1
  return m
}

// ── CRUD dạng ────────────────────────────────────────────────────
export async function createDaiDang(row: DaiDangRow): Promise<DaiDang> {
  const { data, error } = await supabase.from('dai_ban_do').insert(row).select().single()
  if (error) throw error
  return data as DaiDang
}
export async function updateDaiDang(ma_dang: string, patch: Partial<DaiDangInput>): Promise<void> {
  const { error } = await supabase.from('dai_ban_do').update(patch).eq('ma_dang', ma_dang)
  if (error) throw error
}
export async function deleteDaiDang(ma_dang: string): Promise<void> {
  // ON DELETE RESTRICT phía DB sẽ chặn nếu còn câu treo → ném lỗi cho UI bắt.
  const { error } = await supabase.from('dai_ban_do').delete().eq('ma_dang', ma_dang)
  if (error) throw error
}

// ── Group phẳng → cây Chủ đề → Chuyên đề → Dạng ──────────────────
export type ChuyenDeNode = {
  ma_chuyen_de: string
  ten_chuyen_de: string
  dangs: DaiDang[]
}
export type ChuDeNode = {
  ma_chu_de: string
  ten_chu_de: string
  chuyenDes: ChuyenDeNode[]
  soDang: number
}
export function groupDai(rows: DaiDang[]): ChuDeNode[] {
  const cd = new Map<string, ChuDeNode>()
  for (const r of rows) {
    let c = cd.get(r.ma_chu_de)
    if (!c) {
      c = { ma_chu_de: r.ma_chu_de, ten_chu_de: r.ten_chu_de, chuyenDes: [], soDang: 0 }
      cd.set(r.ma_chu_de, c)
    }
    let cde = c.chuyenDes.find((x) => x.ma_chuyen_de === r.ma_chuyen_de)
    if (!cde) {
      cde = { ma_chuyen_de: r.ma_chuyen_de, ten_chuyen_de: r.ten_chuyen_de, dangs: [] }
      c.chuyenDes.push(cde)
    }
    cde.dangs.push(r)
    c.soDang++
  }
  return [...cd.values()]
}

// ── Sinh MÃ VỊ TRÍ (auto-suggest; người sửa được) ────────────────
// Mã chủ đề  = khối(2) + thứ tự(2)              vd K7 → 0701
// Mã chuyên đề = mã chủ đề + thứ tự(2)          vd 070101
// Mã dạng    = mã chuyên đề + thứ tự(2)         vd 07010103  (thứ tự TRONG chuyên đề)
// Append-only: thứ tự mới = max anh em + 1 (xoá để lại lỗ, không đánh lại số).
const pad2 = (n: number) => String(n).padStart(2, '0')
export const khoiCode = (khoi: string) => khoi.padStart(2, '0')
const maxOrd = (codes: string[], from: number): number => {
  const ords = codes.map((c) => parseInt(c.slice(from), 10)).filter((n) => Number.isFinite(n))
  return ords.length ? Math.max(...ords) : 0
}
export function suggestChuDeMa(khoi: string, tree: ChuDeNode[]): string {
  return khoiCode(khoi) + pad2(maxOrd(tree.map((c) => c.ma_chu_de), 2) + 1)
}
export function suggestChuyenDeMa(cdCode: string, chude: ChuDeNode | null): string {
  return cdCode + pad2(maxOrd((chude?.chuyenDes ?? []).map((x) => x.ma_chuyen_de), 4) + 1)
}
export function suggestDangMa(cdeCode: string, chuyende: ChuyenDeNode | null): string {
  return cdeCode + pad2(maxOrd((chuyende?.dangs ?? []).map((d) => d.ma_dang), 6) + 1)
}
