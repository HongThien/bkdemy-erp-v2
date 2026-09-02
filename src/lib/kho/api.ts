// Data-layer Kho — UI KHÔNG đụng supabase trực tiếp, chỉ gọi các hàm ở đây.
// Tính/seam đặt ở đây để sau đổi nguồn (view Postgres, mock…) không phải sửa component.
import { supabase } from '../supabase'

const LIMIT = 10000 // spec-kho-v2 §1.3 — mọi list .limit(10000)

// Khối = KEY text. '4'/'5' = hệ thường; '4T'/'5T' = Tăng cường (CLC, chỉ tiểu học 4-5 —
// bản đồ khác cấu trúc nên là cây riêng). Thứ tự hiển thị theo ĐÚNG mảng này (KHÔNG lexsort).
// Mã prefix 2 ký tự: thường '4'→'04…', CLC '4T…' — phân biệt, không đụng.
export const KHOI_OPTIONS = ['3', '4', '4T', '5', '5T', '6', '7', '8', '9', '10', '11', '12'] as const
export const DEFAULT_KHOI = '8'

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

// ── CÂU HỎI của một dạng (dai_cau_hoi) ───────────────────────────
export type LoaiCau = 'tra_loi_ngan' | 'trac_nghiem' | 'dung_sai' | 'tu_luan'
export const LOAI_CAU: { value: LoaiCau; label: string }[] = [
  { value: 'tra_loi_ngan', label: 'Trả lời ngắn' },
  { value: 'tu_luan', label: 'Tự luận' },
  { value: 'trac_nghiem', label: 'Trắc nghiệm' },
  { value: 'dung_sai', label: 'Đúng/Sai' },
]
// Câu Đúng/Sai (Phần 2 đề 2025): 1 đề chung + 4 mệnh đề, MỖI mệnh đề có dạng RIÊNG (có thể khác chuyên đề).
export type MenhDe = { noi_dung: string; dap_an: 'D' | 'S'; ma_dang: string; loi_giai?: string | null }
export type CauHoi = {
  ma_cau: string
  dang_chinh: string
  loai_cau: string
  noi_dung: string
  dap_an: string | null
  loi_giai: string | null
  lua_chon: string[] | null     // trắc nghiệm: 4 phương án; dap_an = chữ cái đúng
  menh_de: MenhDe[] | null       // đúng/sai: 4 mệnh đề, mỗi cái 1 dạng
  anh_de: string | null
  anh_dap_an: string | null
  nguon: string                 // 'le' | 'clone'
  nguon_giai: string            // 'nguoi' (tin) | 'ai' (AI giải/clone — cần duyệt)
  parent_ma_cau: string | null
  clone_method: string | null
  ma_cum: string | null         // CỤM BÀI = lớp tương đương (thay được cho nhau ở mã đề). null = CHƯA phân cụm.
  xoa_at?: string | null        // kho rác — NULL = còn sống
  // ⭐ 20/08 (Thùy: "kho có rất nhiều câu, câu xịn câu không, cần nhãn chất lượng — đã/chưa kiểm duyệt.
  // Clone xong phải có người check"). Mặc định false — câu MỚI (clone/nhập) luôn vào hàng chờ duyệt.
  da_duyet: boolean
  duyet_boi: string | null      // nhan_su.id — ai duyệt (ghi vết, không chỉ 1 cờ boolean trơ)
  duyet_at: string | null
  created_at?: string
}

// ── CỤM BÀI (spec-cum-bai.md) ─────────────────────────────────────
// Trục TƯƠNG ĐƯƠNG, độc lập với trục NGUỒN GỐC (`nguon`/`parent_ma_cau`/`nguon_giai`).
// 1 cụm chứa được NHIỀU câu gốc — cụm ≠ chuỗi gốc-clone.
// ⭐ Khoá cụm dùng ở MỌI chỗ tiêu thụ = `ma_cum ?? parent_ma_cau ?? ma_cau`:
//   - `ma_cum`        → người đã xác nhận tương đương (thắng tuyệt đối)
//   - `parent_ma_cau` → lưới an toàn: clone sinh ra mà chưa kịp gán cụm vẫn dính với gốc của nó
//   - `ma_cau`        → câu chưa phân cụm thì tự là cụm của chính nó (hành vi y như trước khi có cụm)
export const cumKey = (c: Pick<CauHoi, 'ma_cum' | 'parent_ma_cau' | 'ma_cau'>): string =>
  c.ma_cum ?? c.parent_ma_cau ?? c.ma_cau

// ── KHO RÁC (mig 0111) ────────────────────────────────────────────
// Xoá câu = CHUYỂN VÀO RÁC (`xoa_at`), không xoá cứng. Lý do: `tai_lieu_cau` giữ `ma_cau` dạng text
// KHÔNG FK, nên xoá cứng làm câu RỤNG IM LẶNG khỏi tài liệu đã in (bug 07-21: 150 tham chiếu chết,
// Giáo trình 11A thiếu 24 câu). Rác vẫn resolve được → tài liệu cũ in đủ; kho đang dùng vẫn sạch.
// LUẬT: chỗ CHỌN câu lọc `xoa_at is null` · chỗ RESOLVE câu (getTaiLieuFull/bản in/chấm) KHÔNG lọc.
const CHUA_XOA = 'xoa_at' // tên cột, gom 1 chỗ cho dễ grep

// CHỌN câu → chỉ câu đang dùng.
// tbl = bảng câu theo MÔN (default Toán 'dai_cau_hoi'; KHTN 'khtn_cau_hoi'). Giữ default → Toán không đổi hành vi.
export async function listCauByDang(maDang: string, tbl = 'dai_cau_hoi'): Promise<CauHoi[]> {
  const { data, error } = await supabase.from(tbl).select('*')
    .eq('dang_chinh', maDang).is(CHUA_XOA, null).order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as CauHoi[]
}
type CauInput = {
  ma_cau?: string
  dang_chinh: string; loai_cau: string; noi_dung: string
  dap_an: string | null; loi_giai: string | null; lua_chon?: string[] | null; menh_de?: MenhDe[] | null
  anh_de?: string | null; anh_dap_an?: string | null
  nguon?: string; nguon_giai?: string; parent_ma_cau?: string | null; clone_method?: string | null
  ma_cum?: string | null
}
export async function createCau(input: CauInput, tbl = 'dai_cau_hoi'): Promise<CauHoi> {
  const { data, error } = await supabase.from(tbl).insert(input).select().single()
  if (error) throw error
  return data as CauHoi
}
export async function updateCau(ma_cau: string, patch: Partial<CauInput>, tbl = 'dai_cau_hoi'): Promise<void> {
  const { error } = await supabase.from(tbl).update(patch).eq('ma_cau', ma_cau)
  if (error) throw error
}
// Xoá câu = ĐƯA VÀO KHO RÁC (không xoá cứng — xem ghi chú KHO RÁC ở trên).
// KHÔNG ghi actor ở đây: trigger `log_kho_cau` (mig 0111) tự đẻ dòng `kho_cau_log` kèm jwt_uid().
// CLAUDE.md §4 — app không được tự nhớ ghi log, nếu không sẽ mất vết ở những đường không đi qua hàm này.
export async function deleteCau(ma_cau: string, tbl = 'dai_cau_hoi'): Promise<void> {
  const { error } = await supabase.from(tbl)
    .update({ xoa_at: new Date().toISOString() })
    .eq('ma_cau', ma_cau).is(CHUA_XOA, null)
  if (error) throw error
}
// ⭐ Kiểm duyệt nội dung (Thùy 20/08) — GHI VẾT ai + lúc nào (khuôn duyet_boi/duyet_at đã dùng ở
// bai_test_report/hoc_phi_xet_duyet…), không chỉ 1 cờ boolean trơ. Bỏ duyệt = về lại "chưa duyệt", KHÔNG
// giữ lịch sử ai đã từng duyệt (đơn giản hoá — cần audit sâu hơn thì có kho_cau_log/trigger sau).
// ⚠ Fix 02/09 (Thùy báo "violates foreign key constraint dai_cau_hoi_duyet_boi_fkey"): `duyet_boi` FK →
// nhan_su.id, nhưng code cũ ghi auth user id (auth.users) → FK chặn mọi lượt duyệt ở DangHub/DungSaiBank.
// Các đường duyệt khác (DuyetLoiGiaiScreen/ChoDuyetPanel) vốn đã map qua tai_khoan.nhan_su_id — làm y hệt.
async function nhanSuIdCuaToi(): Promise<string> {
  const { data: au } = await supabase.auth.getUser()
  const { data: tk } = await supabase.from('tai_khoan').select('nhan_su_id').eq('id', au.user?.id ?? '').maybeSingle()
  const id = (tk as { nhan_su_id?: string | null } | null)?.nhan_su_id
  if (!id) throw new Error('Tài khoản chưa link nhân sự — không ghi được ai duyệt.')
  return id
}
export async function duyetCau(ma_cau: string, tbl = 'dai_cau_hoi'): Promise<void> {
  const nguoiDuyet = await nhanSuIdCuaToi()
  const { error } = await supabase.from(tbl)
    .update({ da_duyet: true, duyet_boi: nguoiDuyet, duyet_at: new Date().toISOString() })
    .eq('ma_cau', ma_cau)
  if (error) throw error
}
export async function boDuyetCau(ma_cau: string, tbl = 'dai_cau_hoi'): Promise<void> {
  const { error } = await supabase.from(tbl)
    .update({ da_duyet: false, duyet_boi: null, duyet_at: null })
    .eq('ma_cau', ma_cau)
  if (error) throw error
}

// Tìm 1 câu THEO ma_cau xuyên suốt CẢ 3 bảng kho — dùng cho Duyệt chấm "Sửa trong Kho": chỗ gọi chỉ
// có `ma_cau` (text, KHÔNG FK — CLAUDE.md §2 "tham chiếu bằng TEXT"), không biết trước câu thuộc
// nhánh nào. Đã kiểm DB thật: `dai_cau_hoi` không có chữ cái đầu, `khtn_cau_hoi` bắt đầu 'K',
// `hgt_cau_hoi` bắt đầu 'T' — nhưng đó KHÔNG phải quy ước chính thức (không có ràng buộc nào ép),
// nên dò TỪNG bảng thay vì đoán theo tiền tố. Trả `null` nếu không thấy ở bảng nào (câu đã bị xoá
// cứng ngoài luồng kho rác, hoặc `ma_cau` không còn đúng — báo rõ ở nơi gọi, không giả định).
export async function findCauInKho(ma_cau: string): Promise<{ cau: CauHoi; cauTbl: string } | null> {
  for (const cauTbl of Object.keys(CUM_TBL)) {
    const { data, error } = await supabase.from(cauTbl).select('*').eq('ma_cau', ma_cau).maybeSingle()
    if (error) throw error
    if (data) return { cau: data as CauHoi, cauTbl }
  }
  return null
}

// ══ CỤM BÀI + TIỀN ĐỀ (spec-cum-bai.md) ═══════════════════════════════════════
// ⚠ ĐỪNG LẪN với `deleteDaiCum`/`deleteCum` đã có ở BranchConfig — "cụm" ở ĐÓ nghĩa là *một nhóm node
//   cây* (chủ đề/chuyên đề) đem xoá cả mảng. Mọi thứ của CỤM BÀI đều có hậu tố `CumBai` để grep sạch.
export type CumBai = { ma_cum: string; ma_dang: string; ten: string | null; thu_tu: number; ghi_chu: string | null }
export const tenCum = (c: CumBai) => c.ten?.trim() || `Cụm ${c.thu_tu}`   // chưa đặt tên → suy từ thứ tự
// Nhánh có cụm bài chưa? hgt_cau_hoi CHƯA có cột `ma_cum` (spec-cum-bai.md: để sau).
// ⚠ Ghi `ma_cum` vào bảng chưa có cột = PostgREST trả "Could not find the 'ma_cum' column ... in the
//   schema cache" và CHẾT CẢ LƯỢT LƯU. Mọi insert dính cụm phải đi qua cờ này.
export const coCumBai = (cauTbl: string) => !!CUM_TBL[cauTbl]

// Bảng cụm theo bảng câu. undefined = nhánh CHƯA có cụm (hgt/hình) → UI ẩn tab Cụm.
export const CUM_TBL: Record<string, string> = { dai_cau_hoi: 'dai_cum_bai', khtn_cau_hoi: 'khtn_cum_bai', hgt_cau_hoi: 'hgt_cum_bai' }
// Bảng cạnh tiền đề theo bảng câu: [dạng↔dạng, cụm↔cụm]
export const TIEN_DE_TBL: Record<string, { dang: string; cum: string }> = {
  dai_cau_hoi: { dang: 'dai_dang_tien_de', cum: 'dai_cum_tien_de' },
  khtn_cau_hoi: { dang: 'khtn_dang_tien_de', cum: 'khtn_cum_tien_de' },
  hgt_cau_hoi: { dang: 'hgt_dang_tien_de', cum: 'hgt_cum_tien_de' },
}
// Hàm bao đóng ở Postgres theo bảng câu (dùng chặn chu trình + sắp topo)
const RPC_HAU_DUE: Record<string, { dang: string; cum: string }> = {
  dai_cau_hoi: { dang: 'dai_dang_hau_due', cum: 'dai_cum_hau_due' },
  khtn_cau_hoi: { dang: 'khtn_dang_hau_due', cum: 'khtn_cum_hau_due' },
  hgt_cau_hoi: { dang: 'hgt_dang_hau_due', cum: 'hgt_cum_hau_due' },
}

export async function listCumBai(maDang: string, cauTbl = 'dai_cau_hoi'): Promise<CumBai[]> {
  const tbl = CUM_TBL[cauTbl]; if (!tbl) return []
  const { data, error } = await supabase.from(tbl).select('*').eq('ma_dang', maDang).order('thu_tu').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as CumBai[]
}
// Tạo cụm + (tuỳ chọn) gán ngay lô câu vừa chọn. thu_tu = kế tiếp trong dạng.
export async function createCumBai(a: { maDang: string; ten?: string | null; maCaus?: string[] }, cauTbl = 'dai_cau_hoi'): Promise<CumBai> {
  const tbl = CUM_TBL[cauTbl]; if (!tbl) throw new Error('Nhánh này chưa có cụm bài.')
  const hienCo = await listCumBai(a.maDang, cauTbl)
  const thu_tu = Math.max(0, ...hienCo.map((c) => c.thu_tu)) + 1
  const { data, error } = await supabase.from(tbl)
    .insert({ ma_dang: a.maDang, ten: a.ten?.trim() || null, thu_tu }).select().single()
  if (error) throw error
  const cum = data as CumBai
  if (a.maCaus?.length) await ganCumBai(a.maCaus, cum.ma_cum, cauTbl)
  return cum
}
export async function renameCumBai(maCum: string, ten: string | null, cauTbl = 'dai_cau_hoi'): Promise<void> {
  const tbl = CUM_TBL[cauTbl]; if (!tbl) return
  const { error } = await supabase.from(tbl).update({ ten: ten?.trim() || null }).eq('ma_cum', maCum)
  if (error) throw error
}
// Xoá cụm → FK `on delete set null` đẩy MỌI câu của cụm về rổ "chưa phân cụm". KHÔNG mất câu nào.
export async function deleteCumBai(maCum: string, cauTbl = 'dai_cau_hoi'): Promise<void> {
  const tbl = CUM_TBL[cauTbl]; if (!tbl) return
  const { error } = await supabase.from(tbl).delete().eq('ma_cum', maCum)
  if (error) throw error
}
// Gán lô câu vào cụm (maCum = null ⇒ GỠ khỏi cụm, về rổ chưa phân cụm).
// Clone đi theo gốc: gán/gỡ một câu gốc thì mọi clone `parent_ma_cau = câu đó` đi cùng — clone luôn
// tương đương gốc của nó nên không có ca nào clone ở lại cụm cũ mà đúng.
export async function ganCumBai(maCaus: string[], maCum: string | null, cauTbl = 'dai_cau_hoi'): Promise<number> {
  if (!maCaus.length) return 0
  const { data: con } = await supabase.from(cauTbl).select('ma_cau').in('parent_ma_cau', maCaus).is(CHUA_XOA, null).limit(LIMIT)
  const tatCa = [...new Set([...maCaus, ...((con ?? []) as { ma_cau: string }[]).map((c) => c.ma_cau)])]
  const { error } = await supabase.from(cauTbl).update({ ma_cum: maCum }).in('ma_cau', tatCa)
  if (error) throw error
  return tatCa.length
}
// Gộp cụm: mọi câu của `nguon` chuyển sang `dich`, rồi xoá cụm nguồn. Tên/tiền đề của cụm ĐÍCH giữ nguyên.
export async function gopCumBai(nguon: string, dich: string, cauTbl = 'dai_cau_hoi'): Promise<void> {
  if (nguon === dich) return
  const { error } = await supabase.from(cauTbl).update({ ma_cum: dich }).eq('ma_cum', nguon)
  if (error) throw error
  await deleteCumBai(nguon, cauTbl)
}

// ── Tiền đề — dùng chung 2 tầng (tang: 'dang' | 'cum') ──
export type Tang = 'dang' | 'cum'
const cotTienDe = (tang: Tang) => (tang === 'dang' ? { nut: 'ma_dang', td: 'tien_de_ma_dang' } : { nut: 'ma_cum', td: 'tien_de_ma_cum' })

// Trả về: tiền đề TRỰC TIẾP của nút (phải học trước) + nút phụ thuộc trực tiếp vào nó.
export async function listTienDe(nut: string, tang: Tang, cauTbl = 'dai_cau_hoi'): Promise<{ tienDe: string[]; phuThuoc: string[] }> {
  const tbl = TIEN_DE_TBL[cauTbl]?.[tang]; if (!tbl) return { tienDe: [], phuThuoc: [] }
  const c = cotTienDe(tang)
  const [a, b] = await Promise.all([
    supabase.from(tbl).select(c.td).eq(c.nut, nut).limit(LIMIT),
    supabase.from(tbl).select(c.nut).eq(c.td, nut).limit(LIMIT),
  ])
  if (a.error) throw a.error
  if (b.error) throw b.error
  return {
    tienDe: (a.data ?? []).map((r: any) => r[c.td] as string),
    phuThuoc: (b.data ?? []).map((r: any) => r[c.nut] as string),
  }
}
// Thêm cạnh `tienDe → nut`. CHẶN CHU TRÌNH bằng hàm hậu duệ ở Postgres: nếu `tienDe` đã nằm trong tập
// hậu duệ của `nut` thì nối vào là tạo vòng ⇒ từ chối. (DB chỉ chặn được tự-trỏ bằng CHECK.)
export async function themTienDe(nut: string, tienDe: string, tang: Tang, cauTbl = 'dai_cau_hoi'): Promise<void> {
  const tbl = TIEN_DE_TBL[cauTbl]?.[tang]; if (!tbl) throw new Error('Nhánh này chưa có tiền đề.')
  if (nut === tienDe) throw new Error('Không tự làm tiền đề của chính nó.')
  const rpc = RPC_HAU_DUE[cauTbl][tang]
  const { data, error: eR } = await supabase.rpc(rpc, { goc: nut })
  if (eR) throw eR
  const key = tang === 'dang' ? 'ma_dang' : 'ma_cum'
  if ((data ?? []).some((r: any) => r[key] === tienDe)) {
    throw new Error(`Nối cái này tạo VÒNG: ${tienDe} vốn đã phụ thuộc (trực tiếp hoặc gián tiếp) vào ${nut}.`)
  }
  const c = cotTienDe(tang)
  const { error } = await supabase.from(tbl).insert({ [c.nut]: nut, [c.td]: tienDe } as any)
  if (error) throw error
}
export async function xoaTienDe(nut: string, tienDe: string, tang: Tang, cauTbl = 'dai_cau_hoi'): Promise<void> {
  const tbl = TIEN_DE_TBL[cauTbl]?.[tang]; if (!tbl) return
  const c = cotTienDe(tang)
  const { error } = await supabase.from(tbl).delete().eq(c.nut, nut).eq(c.td, tienDe)
  if (error) throw error
}

// ── Màn KHO RÁC: xem / khôi phục / xoá vĩnh viễn ─────────────────
export type CauRac = CauHoi & { xoa_at: string; soTaiLieuDung: number }
export async function listCauRac(tbl = 'dai_cau_hoi'): Promise<CauRac[]> {
  const { data, error } = await supabase.from(tbl).select('*').not(CHUA_XOA, 'is', null).order('xoa_at', { ascending: false }).limit(LIMIT)
  if (error) throw error
  const caus = (data ?? []) as CauRac[]
  if (!caus.length) return []
  // Còn bao nhiêu TÀI LIỆU đang dùng câu này — con số quyết định có được xoá vĩnh viễn hay không.
  const { data: dung } = await supabase.from('tai_lieu_cau').select('ma_cau').in('ma_cau', caus.map((c) => c.ma_cau)).limit(LIMIT * 50)
  const dem = new Map<string, number>()
  for (const r of (dung ?? []) as { ma_cau: string }[]) dem.set(r.ma_cau, (dem.get(r.ma_cau) ?? 0) + 1)
  return caus.map((c) => ({ ...c, soTaiLieuDung: dem.get(c.ma_cau) ?? 0 }))
}
export async function khoiPhucCau(ma_cau: string, tbl = 'dai_cau_hoi'): Promise<void> {
  const { error } = await supabase.from(tbl).update({ xoa_at: null }).eq('ma_cau', ma_cau)
  if (error) throw error
}
// Xoá VĨNH VIỄN — chỉ cho phép khi KHÔNG còn tài liệu nào tham chiếu. Đây chính là cửa duy nhất còn
// sinh ra được tham chiếu chết, nên chặn ngay tại đây thay vì tin vào người bấm.
export async function xoaVinhVienCau(ma_cau: string, tbl = 'dai_cau_hoi'): Promise<void> {
  const { count, error: eC } = await supabase.from('tai_lieu_cau').select('id', { count: 'exact', head: true }).eq('ma_cau', ma_cau)
  if (eC) throw eC
  if (count) throw new Error(`Không xoá vĩnh viễn được: còn ${count} tài liệu đang dùng câu này. Thay câu trong các tài liệu đó trước.`)
  const { error } = await supabase.from(tbl).delete().eq('ma_cau', ma_cau).not(CHUA_XOA, 'is', null)
  if (error) throw error
}

// ── TÌM CÂU (để sửa câu sai nhanh) — THEO KHO ĐANG XEM (per cauTbl), KHÔNG xuyên môn ──
const BAN_DO_OF: Record<string, string> = { dai_cau_hoi: 'dai_ban_do', khtn_cau_hoi: 'khtn_ban_do' }
export type CauTimThay = CauHoi & { dangTen: string }
// q khớp MÃ (prefix) HOẶC NỘI DUNG (chứa). Sanitize ,() vì là ký tự phân tách của PostgREST .or().
export async function searchCau(q: string, tbl = 'dai_cau_hoi'): Promise<CauTimThay[]> {
  const safe = q.trim().replace(/[,()]/g, ' ').trim()
  if (!safe) return []
  const { data, error } = await supabase.from(tbl).select('*')
    .or(`ma_cau.ilike.${safe}%,noi_dung.ilike.%${safe}%`)
    .is(CHUA_XOA, null)
    .order('ma_cau').limit(200)
  if (error) throw error
  const caus = (data ?? []) as CauHoi[]
  const dangMas = [...new Set(caus.map((c) => c.dang_chinh).filter(Boolean))]
  const ten: Record<string, string> = {}
  if (dangMas.length) {
    const { data: d2 } = await supabase.from(BAN_DO_OF[tbl] ?? 'dai_ban_do').select('ma_dang, ten_dang').in('ma_dang', dangMas).limit(LIMIT)
    for (const r of (d2 ?? []) as any[]) ten[r.ma_dang] = r.ten_dang
  }
  return caus.map((c) => ({ ...c, dangTen: ten[c.dang_chinh] ?? c.dang_chinh }))
}
// Tuỳ chọn dạng cho editor Đúng/Sai (mệnh đề gán dạng bất kỳ trong MÔN). Lấy cả môn từ ban_do.
export async function listDangOptions(tbl = 'dai_cau_hoi'): Promise<{ id: string; label: string; sub: string }[]> {
  const banDo = BAN_DO_OF[tbl] ?? 'dai_ban_do'
  const { data, error } = await supabase.from(banDo)
    .select('ma_dang, ten_dang, ten_chu_de, ten_chuyen_de, khoi').order('ma_dang').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.ma_dang, label: r.ten_dang, sub: `K${r.khoi} · ${r.ten_chu_de} › ${r.ten_chuyen_de}` }))
}

// ── BANK ĐÚNG/SAI: con của CHUYÊN ĐỀ (như lý thuyết). câu loai_cau='dung_sai' có dang_chinh ∈ dạng của chuyên đề đó. ──
export async function listDungSaiByDang(dangMas: string[], tbl = 'dai_cau_hoi'): Promise<CauHoi[]> {
  if (!dangMas.length) return []
  const { data, error } = await supabase.from(tbl).select('*').eq('loai_cau', 'dung_sai').in('dang_chinh', dangMas).is(CHUA_XOA, null).order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as CauHoi[]
}
// AI bóc câu đúng/sai từ tài liệu (PDF/ảnh): đề chung + 4 mệnh đề + Đ/S + lời giải. Người chỉ sửa đáp án + gán dạng.
export type IngestDungSai = { de_chung: string; loi_giai: string | null; menh_de: { noi_dung: string; dap_an: 'D' | 'S'; loi_giai: string | null }[] }
export const DUNGSAI_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      de_chung: { type: 'STRING', description: 'Phần dẫn/đề chung của câu. Giữ nguyên xuống dòng bằng \\n.' },
      loi_giai: { type: 'STRING', description: 'Lời giải chi tiết chung của câu (nếu tài liệu có). Giữ xuống dòng.' },
      menh_de: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            noi_dung: { type: 'STRING', description: 'Nội dung 1 mệnh đề (a/b/c/d).' },
            dap_an: { type: 'STRING', description: "'D' nếu mệnh đề ĐÚNG, 'S' nếu SAI." },
            loi_giai: { type: 'STRING', description: 'Giải thích riêng cho mệnh đề (nếu có).' },
          },
          required: ['noi_dung', 'dap_an'],
        },
      },
    },
    required: ['de_chung', 'menh_de'],
  },
}
export function buildDungSaiIngestPrompt(): string {
  return [
    'Đây là tài liệu (ảnh/PDF) chứa các CÂU TRẮC NGHIỆM ĐÚNG/SAI (Phần 2 đề thi).',
    'Mỗi câu gồm: 1 ĐỀ CHUNG (phần dẫn) + 4 MỆNH ĐỀ a) b) c) d). Với mỗi mệnh đề học sinh xác định ĐÚNG hay SAI.',
    'TÁCH từng câu theo thứ tự xuất hiện. Với MỖI câu trả: de_chung, loi_giai (lời giải chi tiết nếu tài liệu CÓ — nếu không có thì để trống), và menh_de = MẢNG đúng 4 phần tử theo thứ tự a,b,c,d.',
    "Mỗi mệnh đề: noi_dung; dap_an = 'D' nếu mệnh đề ĐÚNG / 'S' nếu SAI (đọc đáp án trong tài liệu; nếu tài liệu không ghi, suy luận chính xác nhất); loi_giai (giải thích riêng nếu có).",
    'Công thức toán viết LaTeX trong $…$. Bảng số liệu dùng $\\begin{array}{…}…\\end{array}$ (KHÔNG coi là hình). Giữ nguyên xuống dòng bằng \\n. TUYỆT ĐỐI không bịa thêm câu/mệnh đề không có trong tài liệu.',
    'Trả JSON: MẢNG các câu [ { "de_chung":"…", "loi_giai":"…", "menh_de":[ {"noi_dung":"…","dap_an":"D","loi_giai":"…"}, …đúng 4 phần tử ] } ].',
  ].join('\n')
}
export function parseDungSaiJson(text: string): IngestDungSai[] {
  let arr: any
  try { arr = JSON.parse(text) } catch { return [] }
  if (!Array.isArray(arr)) arr = arr?.cau ?? arr?.cau_hoi ?? arr?.items ?? []
  return (arr as any[]).map((c) => ({
    de_chung: String(c.de_chung ?? c.de ?? '').trim(),
    loi_giai: String(c.loi_giai ?? '').trim() || null,
    menh_de: (Array.isArray(c.menh_de) ? c.menh_de : []).slice(0, 4).map((m: any) => ({
      noi_dung: String(m.noi_dung ?? '').trim(),
      dap_an: (String(m.dap_an ?? 'D').trim().toUpperCase().startsWith('S') ? 'S' : 'D') as 'D' | 'S',
      loi_giai: String(m.loi_giai ?? '').trim() || null,
    })),
  })).filter((c) => c.de_chung && c.menh_de.length)
}
// Tạo câu đúng/sai: dang_chinh = dạng đại diện của chuyên đề nhà (cho ma_cau + browse). menh_de = 4 mệnh đề (mỗi cái dạng riêng).
export async function createCauDungSai(input: { dang_chinh: string; noi_dung: string; loi_giai?: string | null; menh_de: MenhDe[]; anh_de?: string | null }, tbl = 'dai_cau_hoi'): Promise<CauHoi> {
  const ma_cau = maCau(input.dang_chinh, await nextCauSeq(input.dang_chinh, tbl))
  const { data, error } = await supabase.from(tbl).insert({
    ma_cau, dang_chinh: input.dang_chinh, loai_cau: 'dung_sai', noi_dung: input.noi_dung,
    loi_giai: input.loi_giai ?? null, menh_de: input.menh_de, anh_de: input.anh_de ?? null,
    dap_an: null, lua_chon: null, nguon: 'le', nguon_giai: 'nguoi',
  }).select().single()
  if (error) throw error
  return data as CauHoi
}

// ── Ảnh: upload lên Supabase Storage (bucket public 'kho-anh'), DB chỉ lưu URL ngắn (không base64) ──
export const KHO_BUCKET = 'kho-anh'
export async function uploadKhoImage(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(KHO_BUCKET).upload(path, file, { contentType: file.type || 'image/png', upsert: false })
  if (error) throw error
  return supabase.storage.from(KHO_BUCKET).getPublicUrl(path).data.publicUrl
}

// File lý thuyết / tài liệu (PDF, Word…) — bucket public 'kho-tailieu'. Trả URL + tên gốc.
export const KHO_FILE_BUCKET = 'kho-tailieu'
export async function uploadKhoFile(file: File): Promise<{ url: string; name: string }> {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(KHO_FILE_BUCKET).upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false })
  if (error) throw error
  return { url: supabase.storage.from(KHO_FILE_BUCKET).getPublicUrl(path).data.publicUrl, name: file.name }
}
// Mã câu = mã DẠNG + STT 3 chữ số (vd 07010103 → 07010103001). Lấy max STT hiện có +1 (không tái dùng số đã xoá).
const maCau = (dangChinh: string, seq: number) => `${dangChinh}${String(seq).padStart(3, '0')}`
async function nextCauSeq(dangChinh: string, tbl = 'dai_cau_hoi'): Promise<number> {
  const { data, error } = await supabase.from(tbl).select('ma_cau').eq('dang_chinh', dangChinh).limit(LIMIT)
  if (error) throw error
  let max = 0
  for (const r of data ?? []) {
    const n = parseInt(String((r as { ma_cau: string }).ma_cau).slice(dangChinh.length), 10)
    if (Number.isFinite(n) && n > max) max = n
  }
  return max + 1
}

// ── CLONE: prompt + parse JSON + lưu batch (gốc 'le' + biến thể 'clone') ──
type CauNoiDung = { noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon?: string[] | null; anh_de?: string | null; anh_dap_an?: string | null; nguon_giai?: string }
const loaiVi = (v: string): string => ({ tra_loi_ngan: 'Trả lời ngắn', tu_luan: 'Tự luận', trac_nghiem: 'Trắc nghiệm 4 phương án', dung_sai: 'Đúng/Sai' } as Record<string, string>)[v] ?? v
// Trường JSON + quy tắc đáp án theo LOẠI câu
function loaiFields(loaiCau: string): { spec: string; obj: string; ruleDapAn: string } {
  if (loaiCau === 'trac_nghiem') return {
    spec: 'de_bai, lua_chon (mảng 4 phương án A→D, CHỈ nội dung — không kèm "A."/"B."), dap_an (CHỮ CÁI đúng), loi_giai',
    obj: '{ "de_bai": "...", "lua_chon": ["...","...","...","..."], "dap_an": "B", "loi_giai": "..." }',
    ruleDapAn: '- "dap_an" = CHỮ CÁI phương án đúng ("A"|"B"|"C"|"D"); đáp án có thể nằm ở "Chọn X" / "Đáp án: X" trong lời giải → lấy đúng chữ cái đó. ĐÚNG 4 phương án, chỉ 1 đúng.',
  }
  return {
    spec: 'de_bai, dap_an (CHỈ kết quả số/phân số), loi_giai',
    obj: '{ "de_bai": "...", "dap_an": "...", "loi_giai": "..." }',
    ruleDapAn: '- "dap_an" CHỈ là kết quả cuối (số/phân số), KHÔNG đơn vị, KHÔNG chữ giải thích. Đơn vị (quả, cm²...) ghi TRONG "loi_giai". Phân số dùng $\\\\dfrac{a}{b}$.',
  }
}
// Quy tắc trình bày + JSON (bê từ prompt v1 đã thực chiến)
const FMT_RULES = [
  'QUY TẮC TRÌNH BÀY:',
  '- ⚠ KHÔNG chép nhãn "Câu N" / "Bài N" vào đầu de_bai — de_bai bắt đầu THẲNG từ nội dung đề (hệ thống TỰ đánh số câu). Bản gốc có "Câu 3." → BỎ nhãn đó, chỉ lấy phần đề.',
  '- ⚠ Câu TRẮC NGHIỆM: de_bai CHỈ chứa đề dẫn (câu hỏi), TUYỆT ĐỐI KHÔNG chép 4 phương án "A. … B. … C. … D. …" vào de_bai — phương án CHỈ đặt ở lua_chon (hệ thống tự render lưới đáp án).',
  '- Công thức toán DÙNG LaTeX trong $...$ (inline) hoặc $$...$$ (block).',
  '- ⚠ MỖI công thức/phân số/biểu thức phải bọc RIÊNG trong $...$ — KỂ CẢ khi liệt kê nhiều: viết "$\\\\dfrac{6}{5}$; $\\\\dfrac{4}{3}$" (TUYỆT ĐỐI KHÔNG để "\\\\dfrac{6}{5}" trần ngoài $).',
  '- ⚠ XUỐNG DÒNG: GIỮ ĐÚNG bố cục NHIỀU DÒNG của đề & lời giải gốc — mỗi ý, mỗi câu hỏi, mỗi bước giải đặt trên MỘT DÒNG riêng (ngăn bằng ký tự xuống dòng thật trong chuỗi). Gốc bao nhiêu dòng thì giữ bấy nhiêu. TUYỆT ĐỐI KHÔNG gộp tất cả thành một đoạn liền, KHÔNG dùng thẻ "<br>".',
  '- Phân số DÙNG \\\\dfrac{a}{b} (KHÔNG dùng \\\\frac vì hiển thị bé). KHÔNG viết dạng a/b.',
  '- ⚠ KÝ HIỆU CHIA HẾT (Gemini RẤT HAY ĐỌC SAI — đọc kỹ ngữ cảnh): "a chia hết cho b" = ba dấu chấm DỌC ⋮ → viết "$a \\\\vdots b$". "a KHÔNG chia hết cho b" = ⋮ có GẠCH CHÉO → viết "$a \\\\not\\\\vdots b$". TUYỆT ĐỐI KHÔNG nhầm ⋮ thành dấu hai chấm ":", ba chấm ngang "...", \\\\div, hay "%". Gặp chữ "chia hết / không chia hết" trong đề/lời giải PHẢI dùng \\\\vdots / \\\\not\\\\vdots.',
  '- ⚠ CÔNG THỨC HOÁ HỌC (KHTN) — kí hiệu nguyên tố/hợp chất PHẢI ĐỨNG THẲNG (KHÔNG nghiêng như biến số toán $x$, $y$) — bọc trong $\\\\mathrm{...}$, KỂ CẢ khi KHÔNG có chỉ số: "Fe" → "$\\\\mathrm{Fe}$", "NaCl" → "$\\\\mathrm{NaCl}$", "khí argon (Ar)" → "khí argon ($\\\\mathrm{Ar}$)" — không được để trần ngoài $...$ (nghiêng/thẳng lẫn lộn giữa các công thức trong CÙNG một đề là lỗi thường gặp, phải nhất quán \\\\mathrm cho MỌI công thức). Chỉ số dưới dùng "_" NGAY TRONG \\\\mathrm: "$\\\\mathrm{H_2O}$", "$\\\\mathrm{CO_2}$", "$\\\\mathrm{H_2SO_4}$", "$\\\\mathrm{Fe_2O_3}$", "$\\\\mathrm{Al_2(SO_4)_3}$". Chỉ số dưới NHIỀU KÝ TỰ bọc ngoặc nhọn: "$\\\\mathrm{C_{12}H_{22}O_{11}}$" (KHÔNG viết "C_12" — chỉ "1" bị hạ xuống, "2" vẫn cỡ thường). Ion/điện tích dùng "^" cũng trong \\\\mathrm: "$\\\\mathrm{Fe^{2+}}$", "$\\\\mathrm{SO_4^{2-}}$".',
  '- Số đơn lẻ KHÔNG cần $: viết "30 quả" không phải "$30$ quả". KHÔNG để tiếng Việt có dấu bên trong $...$.',
  '- Số thập phân dùng dấu chấm: "0.6" (không "0,6").',
  '- Nếu đề có BẢNG BIẾN THIÊN / ĐỒ THỊ / HÌNH VẼ: ghi "[hình]" đúng vị trí trong de_bai + mô tả 1 câu ngắn; KHÔNG cố vẽ lại bằng LaTeX (nhân sự sẽ cắt ảnh đính sau).',
  '',
  '⚠ QUY TẮC JSON (CỰC KỲ QUAN TRỌNG):',
  "- Trích dẫn trong chuỗi DÙNG nháy đơn ' ... ', KHÔNG nháy kép (sẽ hỏng JSON).",
  '- Mọi lệnh LaTeX PHẢI DOUBLE backslash trong JSON: "\\\\dfrac", "\\\\times", "\\\\neq".',
  '- CHỈ trả JSON, KHÔNG bọc ```json```, KHÔNG thêm chữ nào ngoài JSON.',
].join('\n')
// Bỏ nhãn "Câu N" / "Bài N" ở ĐẦU đề (hệ thống tự đánh số → nhãn này dư, gây số trùng/lệch).
// Chỉ strip khi CÒN nội dung sau đó (không để rỗng). Cap CỨNG ở code — không tin mỗi prompt.
export const stripCauLabel = (s: string): string => {
  const t = s.replace(/^[\s*]*(?:câu|bài)\s*\d+\s*[.:)\-]?\s*/i, '')
  return t.trim() ? t : s
}
// Bỏ tiền tố ý con "a)" "b." "c)" … ở đầu MỖI dòng (đề nhiều ý → clone hay chèn nhãn a/b/c; người muốn bỏ hết).
// Chỉ cắt nhãn 1 chữ cái a–h + ')' hoặc '.' + khoảng trắng → không đụng nội dung/công thức toán.
export const stripYCon = (s: string): string =>
  s.split('\n').map((ln) => ln.replace(/^(\s*)[a-h][.)]\s+/, '$1')).join('\n')
// Bỏ khối đáp án "A. … B. … C. … D. …" ở CUỐI đề (khi câu ĐÃ có lua_chon riêng) → chống hiện 2 lần
// (1 lần trong đề + 1 lần ở lưới đáp án). Cắt từ dòng bắt đầu "A." tới hết. Chỉ khi còn nội dung sau cắt.
const stripEmbeddedOpts = (s: string): string => {
  const t = s.replace(/\n\s*A\s*[.):][\s\S]*$/, '').trimEnd()
  return t.trim() ? t : s
}
// Có nhà (đã thấy ở DeepSeek, KHÔNG phải lần nào cũng) escape lố `\n` thành HAI KÝ TỰ backslash+n
// ⇒ parse xong ra chữ "\n" nằm giữa lời giải thay vì xuống dòng, in ra thấy rác. Chỉ sửa khi chuỗi
// KHÔNG có xuống dòng thật (có rồi thì `\n` còn lại nhiều khả năng là LaTeX, đừng đụng vào).
const suaXuongDongLo = (s: string) => (s.includes('\n') ? s : s.replace(/\\n/g, '\n'))
const normCau = (x: any): CauNoiDung => {
  const lua_chon = Array.isArray(x.lua_chon) && x.lua_chon.length ? x.lua_chon.map((o: any) => String(o)) : null
  let noi_dung = suaXuongDongLo(stripYCon(stripCauLabel(String(x.de_bai ?? x.noi_dung ?? '').trim())))
  if (lua_chon) noi_dung = stripEmbeddedOpts(noi_dung) // câu trắc nghiệm: đề KHÔNG chứa 4 đáp án
  const loi_giai = x.loi_giai != null && String(x.loi_giai).trim() ? suaXuongDongLo(stripYCon(String(x.loi_giai).trim())) : null
  return {
    noi_dung,
    dap_an: x.dap_an != null && String(x.dap_an).trim() ? String(x.dap_an).trim() : null,
    loi_giai,
    lua_chon,
  }
}
export function buildClonePrompt(a: { soBienThe: number; ghiChu: string; tenDang: string; loaiCau: string }): string {
  const f = loaiFields(a.loaiCau)
  return [
    'Bạn là chuyên gia ra đề toán tiểu học/THCS. Bên dưới là 1 BÀI MẪU (có thể kèm ảnh sơ đồ).',
    `Dạng bài: "${a.tenDang}". Loại câu: ${loaiVi(a.loaiCau)}.`,
    '',
    'Làm 2 việc:',
    `1) Trích bài mẫu thành các trường: ${f.spec}. GIỮ NGUYÊN văn đề mẫu, không sửa chữ.`,
    `2) Sinh ĐÚNG ${a.soBienThe} biến thể (KHÔNG nhiều hơn, KHÔNG ít hơn — mảng "variants" có ĐÚNG ${a.soBienThe} phần tử).`,
    '',
    '⚠ RÀNG BUỘC BÁM BÀI GỐC (tuân thủ TUYỆT ĐỐI — đây là yêu cầu quan trọng nhất):',
    '- BÁM SÁT bài mẫu: GIỮ NGUYÊN cấu trúc câu, phương pháp giải, SỐ BƯỚC và THỨ TỰ bước của lời giải. CHỈ thay con số / tên người / bối cảnh.',
    '- CẤM: thêm bước, bớt bước, đổi cách giải, thêm dữ kiện/điều kiện/giả thiết KHÔNG có trong bài gốc, hay "diễn giải" dài hơn gốc. Lời giải biến thể phải SONG ÁNH từng bước với gốc, chỉ khác con số.',
    '- SỐ LIỆU thay phải cho KẾT QUẢ ĐẸP (số nguyên hoặc phân số tối giản đơn giản giống bài gốc), CÙNG độ khó & CÙNG độ lớn. TUYỆT ĐỐI KHÔNG để ra số lẻ/xấu (vd 7.3333, 0.17): nếu một bộ số ra kết quả xấu thì THỬ BỘ SỐ KHÁC cho tới khi đẹp, đừng giữ.',
    '- Nếu bài gốc không nói rõ một bước, biến thể CŨNG không tự bịa bước đó.',
    '- ⚠ KHÔNG thêm nhãn ý con "a)", "b)", "c)"… vào đầu dòng trong de_bai / loi_giai — viết THẲNG nội dung từng ý trên dòng riêng, KHÔNG kèm chữ cái đánh mục.',
    a.ghiChu ? `- ⚠ GHI CHÚ CỦA NGƯỜI RA ĐỀ = RÀNG BUỘC CỨNG, ưu tiên CAO NHẤT, áp cho MỌI biến thể (bám rất sát, không được phớt lờ): ${a.ghiChu}` : '',
    '',
    f.ruleDapAn,
    FMT_RULES,
    '',
    'Trả về JSON đúng format:',
    `{ "bai_goc": ${f.obj},`,
    `  "variants": [ ${f.obj} ] }`,
  ].filter(Boolean).join('\n')
}
// Gemini HAY trả LaTeX 1 backslash trong chuỗi JSON ("\dfrac") → JSON.parse ném "Bad escaped character".
// Sửa: thử parse thẳng (nhanh), lỗi thì NHÂN ĐÔI mọi backslash KHÔNG thuộc escape hợp lệ
// (giữ nguyên \" \\ \/ \b \f \n \r \t \uXXXX) rồi parse lại → "\dfrac" thành "\\dfrac" hợp lệ, parse ra "\dfrac".
function lenientJsonParse(t: string): any {
  try { return JSON.parse(t) }
  catch { return JSON.parse(t.replace(/\\(["\\/bfnrtu])|\\/g, (m, g) => (g ? m : '\\\\'))) }
}
export function parseCloneJson(text: string): { goc: CauNoiDung; variants: CauNoiDung[] } {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  let obj: any
  try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const bg = obj.bai_goc ?? obj.baiGoc
  if (!bg || !bg.de_bai) throw new Error('Thiếu "bai_goc.de_bai" trong JSON.')
  const variants = (Array.isArray(obj.variants) ? obj.variants : []).filter((v: any) => v?.de_bai).map(normCau)
  return { goc: normCau(bg), variants }
}
// ── 2 BƯỚC (Thùy 07-31): tách OCR bài gốc ↔ clone. Trước đây 1 call vừa bóc gốc vừa sinh biến thể → OCR
// gốc sai kéo biến thể sai theo, sửa lại phải sinh lại cả mớ. Giờ: BƯỚC 1 chỉ bóc gốc (extraction, think 0)
// → người CHỐT gốc chuẩn → BƯỚC 2 clone TỪ TEXT gốc đã chốt (generation, Flash + think), KHÔNG đọc lại ảnh. ──
export function buildOcrGocPrompt(a: { tenDang: string; loaiCau: string }): string {
  const f = loaiFields(a.loaiCau)
  return [
    'Bạn là trợ lý bóc đề toán tiểu học/THCS. Bên dưới là ẢNH 1 BÀI MẪU (có thể kèm sơ đồ).',
    `Dạng bài: "${a.tenDang}". Loại câu: ${loaiVi(a.loaiCau)}.`,
    '',
    `NHIỆM VỤ DUY NHẤT: TRÍCH NGUYÊN VĂN bài mẫu thành các trường: ${f.spec}.`,
    '⚠ GIỮ NGUYÊN văn đề mẫu, KHÔNG sửa chữ, KHÔNG tự giải khác, TUYỆT ĐỐI KHÔNG sinh thêm câu/biến thể nào.',
    '',
    f.ruleDapAn,
    FMT_RULES,
    '',
    'Trả về JSON đúng format:',
    `{ "bai_goc": ${f.obj} }`,
  ].filter(Boolean).join('\n')
}
export function parseGocJson(text: string): CauNoiDung {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  let obj: any
  try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const bg = obj.bai_goc ?? obj.baiGoc ?? obj
  if (!bg || !bg.de_bai) throw new Error('Thiếu "bai_goc.de_bai" trong JSON.')
  return normCau(bg)
}
export function buildCloneFromGocPrompt(a: { goc: CauNoiDung; soBienThe: number; ghiChu: string; tenDang: string; loaiCau: string }): string {
  const f = loaiFields(a.loaiCau)
  const g = a.goc
  const gocText = [
    'BÀI GỐC (người ra đề đã CHỐT chuẩn — clone phải bám ĐÚNG bài này, coi như văn bản gốc tuyệt đối):',
    `de_bai: ${g.noi_dung}`,
    g.lua_chon?.length ? `lua_chon: ${JSON.stringify(g.lua_chon)}` : '',
    `dap_an: ${g.dap_an ?? ''}`,
    `loi_giai: ${g.loi_giai ?? ''}`,
  ].filter(Boolean).join('\n')
  return [
    'Bạn là chuyên gia ra đề toán tiểu học/THCS.',
    `Dạng bài: "${a.tenDang}". Loại câu: ${loaiVi(a.loaiCau)}.`,
    '',
    gocText,
    '',
    `NHIỆM VỤ: Sinh ĐÚNG ${a.soBienThe} biến thể của BÀI GỐC trên (mảng "variants" có ĐÚNG ${a.soBienThe} phần tử, KHÔNG hơn KHÔNG kém). KHÔNG trả lại bài gốc.`,
    '',
    '⚠ RÀNG BUỘC BÁM BÀI GỐC (tuân thủ TUYỆT ĐỐI — quan trọng nhất):',
    '- BÁM SÁT bài gốc: GIỮ NGUYÊN cấu trúc câu, phương pháp giải, SỐ BƯỚC và THỨ TỰ bước của lời giải. CHỈ thay con số / tên người / bối cảnh.',
    '- CẤM: thêm bước, bớt bước, đổi cách giải, thêm dữ kiện/điều kiện/giả thiết KHÔNG có trong bài gốc, hay diễn giải dài hơn gốc. Lời giải biến thể phải SONG ÁNH từng bước với gốc, chỉ khác con số.',
    '- SỐ LIỆU thay phải cho KẾT QUẢ ĐẸP (số nguyên hoặc phân số tối giản đơn giản giống gốc), CÙNG độ khó & CÙNG độ lớn. TUYỆT ĐỐI KHÔNG ra số lẻ/xấu — ra xấu thì THỬ bộ số khác cho tới khi đẹp.',
    '- Nếu bài gốc không nói rõ một bước, biến thể CŨNG không tự bịa bước đó.',
    '- ⚠ KHÔNG thêm nhãn ý con "a)","b)","c)"… vào đầu dòng.',
    a.ghiChu ? `- ⚠ GHI CHÚ NGƯỜI RA ĐỀ = RÀNG BUỘC CỨNG, ưu tiên CAO NHẤT, áp cho MỌI biến thể: ${a.ghiChu}` : '',
    '',
    f.ruleDapAn,
    FMT_RULES,
    '',
    'Trả về JSON đúng format:',
    `{ "variants": [ ${f.obj} ] }`,
  ].filter(Boolean).join('\n')
}
export function parseVariantsJson(text: string): CauNoiDung[] {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  let obj: any
  try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  return (Array.isArray(obj.variants) ? obj.variants : []).filter((v: any) => v?.de_bai).map(normCau)
}
// maCum: cụm mà bài gốc thuộc về (người chọn lúc nhập). Bộ clone sinh ra THỪA KẾ y hệt cụm đó —
// clone luôn tương đương với gốc của nó nên không có lý do để nằm cụm khác.
export async function saveCloneBatch(a: {
  dangChinh: string; loaiCau: string; goc: CauNoiDung; variants: CauNoiDung[]; maCum?: string | null
}, tbl = 'dai_cau_hoi'): Promise<{ goc: string; soClone: number }> {
  const start = await nextCauSeq(a.dangChinh, tbl)
  const g = await createCau({
    ma_cau: maCau(a.dangChinh, start),
    dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: a.goc.noi_dung, dap_an: a.goc.dap_an, loi_giai: a.goc.loi_giai, lua_chon: a.goc.lua_chon ?? null,
    anh_de: a.goc.anh_de ?? null, anh_dap_an: a.goc.anh_dap_an ?? null, nguon: 'le',
    nguon_giai: a.goc.nguon_giai ?? 'nguoi', // gốc = người ra đề (tin)
    ...(coCumBai(tbl) ? { ma_cum: a.maCum ?? null } : {}),
  }, tbl)
  if (a.variants.length) {
    const rows = a.variants.map((v, i) => ({
      ma_cau: maCau(a.dangChinh, start + 1 + i),
      dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
      noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
      anh_de: v.anh_de ?? null, anh_dap_an: v.anh_dap_an ?? null,
      nguon: 'clone', nguon_giai: 'ai', parent_ma_cau: g.ma_cau, clone_method: 'manual_gemini', // biến thể = AI giải
      ...(coCumBai(tbl) ? { ma_cum: a.maCum ?? null } : {}),
    }))
    const { error } = await supabase.from(tbl).insert(rows)
    if (error) throw error
  }
  return { goc: g.ma_cau, soClone: a.variants.length }
}

// CLONE TỪ BÀI CÓ SẴN TRONG KHO — chỉ đẻ BIẾN THỂ, không tạo gốc mới.
// Biến thể bám vào câu đang có (`parent_ma_cau`) và THỪA KẾ `ma_cum` của nó ⇒ rơi đúng cụm bài,
// không phải gom tay lại. Đây là điểm khác duy nhất so với `saveCloneBatch` (vốn đẻ gốc + biến thể).
export async function saveCloneVariants(a: {
  goc: Pick<CauHoi, 'ma_cau' | 'dang_chinh' | 'loai_cau' | 'ma_cum'>; variants: CauNoiDung[]
}, tbl = 'dai_cau_hoi'): Promise<number> {
  if (!a.variants.length) return 0
  const start = await nextCauSeq(a.goc.dang_chinh, tbl)
  const rows = a.variants.map((v, i) => ({
    ma_cau: maCau(a.goc.dang_chinh, start + i),
    dang_chinh: a.goc.dang_chinh, loai_cau: a.goc.loai_cau,
    noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
    anh_de: v.anh_de ?? null, anh_dap_an: v.anh_dap_an ?? null,
    nguon: 'clone', nguon_giai: 'ai', parent_ma_cau: a.goc.ma_cau, clone_method: 'manual_gemini',
    ...(coCumBai(tbl) ? { ma_cum: a.goc.ma_cum ?? null } : {}),
  }))
  const { error } = await supabase.from(tbl).insert(rows)
  if (error) throw error
  return rows.length
}

// ── HÀNG ĐỢI CLONE (26/08) — nút "✨ Clone" thêm lựa chọn "đưa vào hàng đợi" thay vì gọi API
// ngay: nhân sự đặt yêu cầu (không cần credential gì), Claude Code quét định kỳ/theo lệnh xử lý
// cả lô, ghi kết quả vào bảng NHÁP riêng — KHÔNG chọc thẳng vào dai_cau_hoi thật. Lý do tách:
// `da_duyet` trên dai_cau_hoi chỉ là nhãn HẬU KIỂM (không chặn dùng, câu cũ vẫn sống bình thường
// dù chưa duyệt) — còn câu CLONE MỚI phải bị chặn HẲN tới khi có người duyệt, 2 khái niệm khác
// nhau dù cùng tên cột (thảo luận 26/08, đừng gộp lại tưởng trùng).
export type YeuCauClone = {
  id: string; ma_cau_goc: string; so_bien_the: number; ghi_chu: string | null
  nguoi_yeu_cau: string | null; created_at: string; xu_ly_at: string | null
}
export async function createYeuCauClone(a: { maCauGoc: string; soBienThe: number; ghiChu: string; nguoiYeuCau?: string | null }): Promise<void> {
  const { error } = await supabase.from('dai_cau_hoi_yeu_cau_clone').insert({
    ma_cau_goc: a.maCauGoc, so_bien_the: a.soBienThe, ghi_chu: a.ghiChu || null, nguoi_yeu_cau: a.nguoiYeuCau ?? null,
  })
  if (error) throw error
}
// xu_ly_at NULL = chưa xử lý — hàng đợi thật (không suy ra được, khác Story 2 bên dưới).
export async function listYeuCauCloneCho(): Promise<YeuCauClone[]> {
  const { data, error } = await supabase.from('dai_cau_hoi_yeu_cau_clone').select('*')
    .is('xu_ly_at', null).order('created_at').limit(LIMIT)
  if (error) throw error
  return data ?? []
}
export async function danhDauYeuCauXuLy(id: string): Promise<void> {
  const { error } = await supabase.from('dai_cau_hoi_yeu_cau_clone').update({ xu_ly_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export type CloneChoDuyet = {
  id: string; yeu_cau_id: string | null; dang_chinh: string; loai_cau: string
  noi_dung: string; lua_chon: string[] | null; dap_an: string | null; loi_giai: string | null
  parent_ma_cau: string | null; clone_method: string; created_at: string
  duyet_boi: string | null; duyet_at: string | null
  tu_choi_boi: string | null; tu_choi_at: string | null; tu_choi_ly_do: string | null
}
export async function saveCloneChoDuyet(a: {
  yeuCauId?: string | null; dangChinh: string; loaiCau: string; variants: CauNoiDung[]
  parentMaCau?: string | null; cloneMethod?: string
}): Promise<number> {
  if (!a.variants.length) return 0
  const rows = a.variants.map((v) => ({
    yeu_cau_id: a.yeuCauId ?? null, dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
    parent_ma_cau: a.parentMaCau ?? null, clone_method: a.cloneMethod ?? 'claude_code_batch',
  }))
  const { error } = await supabase.from('dai_cau_hoi_clone_cho_duyet').insert(rows)
  if (error) throw error
  return rows.length
}
export async function listCloneChoDuyet(): Promise<CloneChoDuyet[]> {
  const { data, error } = await supabase.from('dai_cau_hoi_clone_cho_duyet').select('*')
    .is('tu_choi_at', null).order('created_at').limit(LIMIT)
  if (error) throw error
  return data ?? []
}
// Duyệt = promote sang dai_cau_hoi thật (da_duyet=true LUÔN — vừa được người kiểm xong, không
// cần qua vòng hậu kiểm chung nữa), dùng ĐÚNG nextCauSeq/maCau như saveCloneVariants — rồi xoá khỏi nháp.
export async function duyetCloneChoDuyet(row: CloneChoDuyet, nguoiDuyet: string): Promise<string> {
  const start = await nextCauSeq(row.dang_chinh, 'dai_cau_hoi')
  const ma_cau_moi = maCau(row.dang_chinh, start)
  const { error: e1 } = await supabase.from('dai_cau_hoi').insert({
    ma_cau: ma_cau_moi, dang_chinh: row.dang_chinh, loai_cau: row.loai_cau,
    noi_dung: row.noi_dung, dap_an: row.dap_an, loi_giai: row.loi_giai, lua_chon: row.lua_chon,
    nguon: 'clone', nguon_giai: 'ai', parent_ma_cau: row.parent_ma_cau, clone_method: row.clone_method,
    da_duyet: true, duyet_boi: nguoiDuyet, duyet_at: new Date().toISOString(),
  })
  if (e1) throw e1
  const { error: e2 } = await supabase.from('dai_cau_hoi_clone_cho_duyet').delete().eq('id', row.id)
  if (e2) throw e2
  return ma_cau_moi
}
// Từ chối: CHỈ đánh dấu trong bảng nháp (giữ lại để soát/audit), không đụng dai_cau_hoi.
export async function tuChoiCloneChoDuyet(id: string, nguoiTuChoi: string, lyDo: string): Promise<void> {
  const { error } = await supabase.from('dai_cau_hoi_clone_cho_duyet')
    .update({ tu_choi_at: new Date().toISOString(), tu_choi_boi: nguoiTuChoi, tu_choi_ly_do: lyDo || null })
    .eq('id', id)
  if (error) throw error
}

// ── STORY 2 (26/08): GIẢI CÂU CHƯA CÓ ĐÁP ÁN — hàng đợi = `loi_giai IS NULL` trực tiếp, KHÔNG
// thêm cột trạng thái — đúng nguyên tắc invariant CLAUDE.md §1 ("việc của tôi" = query, không
// phải bảng tasks). Khác Story 1 ở trên (đó là YÊU CẦU thật, không suy ra được nên phải lưu). ──
export async function listCauChuaGiai(tbl = 'dai_cau_hoi'): Promise<CauHoi[]> {
  const { data, error } = await supabase.from(tbl).select('*')
    .is('loi_giai', null).is('xoa_at', null).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as CauHoi[]
}
// Mẫu tham khảo cách trình bày: ưu tiên CÙNG CỤM (ma_cum, đơn vị tương đương đã có sẵn) đã duyệt;
// rơi về CÙNG DẠNG nếu câu chưa thuộc cụm nào. Chỉ lấy vài câu — không đọc cả dạng (tốn token vô ích).
export async function layMauThamKhao(cau: Pick<CauHoi, 'ma_cau' | 'dang_chinh' | 'ma_cum'>, tbl = 'dai_cau_hoi', soLuong = 2): Promise<CauHoi[]> {
  let q = supabase.from(tbl).select('*').eq('da_duyet', true).not('loi_giai', 'is', null).neq('ma_cau', cau.ma_cau)
  q = cau.ma_cum ? q.eq('ma_cum', cau.ma_cum) : q.eq('dang_chinh', cau.dang_chinh)
  const { data, error } = await q.limit(soLuong)
  if (error) throw error
  return (data ?? []) as CauHoi[]
}
// giai_method: NULL = câu cũ (tồn đọng, không rõ nguồn — vd từ tính năng Clone lâu rồi) ·
// 'claude_code' = MỚI, do đúng luồng "giải bài chưa có đáp án" ghi (28/08 — tách khỏi backlog cũ).
export async function giaiCauAI(maCauGiai: string, a: { loiGiai: string; dapAn: string | null }, tbl = 'dai_cau_hoi'): Promise<void> {
  const { error } = await supabase.from(tbl)
    .update({ loi_giai: a.loiGiai, dap_an: a.dapAn, nguon_giai: 'ai', giai_method: 'claude_code' })
    .eq('ma_cau', maCauGiai)
  if (error) throw error
}

// ── DUYỆT LỜI GIẢI AI (27/08) — màn gộp theo khối, dùng chung cho Đại/KHTN/HGT (xem hinh.ts
// cho nhánh Hình — bảng khác hẳn nên hàm riêng, không ép vào registry này). ──
export type CauChoDuyetLoiGiai = {
  nhanh: KhoMon; maCau: string; khoi: string; noiDung: string; dapAn: string | null; loiGiai: string
}
// chiMoi: true = chỉ lời giải MỚI (giai_method='claude_code', luồng hôm nay) ·
//         false/undefined = "câu trong kho" — backlog cũ (giai_method IS NULL, chủ yếu từ Clone).
export async function listCauChoDuyetLoiGiai(mon: KhoMon, khoi?: string, chiMoi?: boolean): Promise<CauChoDuyetLoiGiai[]> {
  const { cauTbl, banDoTbl } = khoTbls(mon)
  let q = supabase.from(cauTbl).select(`ma_cau, noi_dung, dap_an, loi_giai, ${banDoTbl}!inner(khoi)`)
    .eq('nguon_giai', 'ai').eq('da_duyet', false).limit(LIMIT)
  q = chiMoi ? q.eq('giai_method', 'claude_code') : q.is('giai_method', null)
  if (khoi) q = q.eq(`${banDoTbl}.khoi`, khoi)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    nhanh: mon, maCau: r.ma_cau, khoi: r[banDoTbl]?.khoi ?? '', noiDung: r.noi_dung, dapAn: r.dap_an, loiGiai: r.loi_giai ?? '',
  }))
}
export async function duyetLoiGiaiCau(mon: KhoMon, maCau: string, nguoiDuyet: string): Promise<void> {
  const { cauTbl } = khoTbls(mon)
  const { error } = await supabase.from(cauTbl).update({ da_duyet: true, duyet_boi: nguoiDuyet, duyet_at: new Date().toISOString() }).eq('ma_cau', maCau)
  if (error) throw error
}

// ── NHẬP CHUỖI CÂU CÓ SẴN (batch): prompt tách + parse + lưu (tất cả 'le') ──
// Luật lời giải theo 2 luồng: bóc-nguyên (người, tin) vs AI-tự-giải (cần duyệt).
const giaiRule = (giaiAI?: boolean) => giaiAI
  ? '⚠ LỜI GIẢI: tài liệu KHÔNG có lời giải sẵn → HÃY TỰ GIẢI chi tiết, đúng & gọn, BÁM "dap_an" có sẵn nếu có; trình bày từng bước. (Lời giải AI sẽ được người DUYỆT lại.)'
  : '⚠ LỜI GIẢI: CHỈ bóc lời giải CÓ SẴN trong tài liệu — TUYỆT ĐỐI KHÔNG tự giải/sửa/bịa. Câu nào tài liệu không có lời giải → để "loi_giai" RỖNG (chuỗi rỗng).'
export function buildBatchPrompt(a: { ghiChu: string; tenDang: string; loaiCau: string; giaiAI?: boolean }): string {
  const f = loaiFields(a.loaiCau)
  return [
    'Bạn là trợ lý số hoá đề toán. Bên dưới tôi paste MỘT DANH SÁCH câu hỏi cùng một dạng.',
    `Dạng: "${a.tenDang}".`,
    'Hãy TÁCH thành từng câu và chuẩn hoá — KHÔNG sinh thêm câu mới, KHÔNG bỏ sót, KHÔNG đổi nội dung toán.',
    'MỖI BÀI = 1 CÂU độc lập (KHÔNG tách thành ý a/b/c).',
    'Tài liệu có thể ở NHIỀU DẠNG — tự nhận diện & bóc đúng dù dạng nào:',
    '  (a) Có nhãn: "Đề bài:" / "Đáp án:" / "Lời giải [chi tiết]:".',
    '  (b) Dạng đề thi: "Câu N." + đề + phương án A/B/C/D + "Lời giải" + "Chọn X" + giải thích.',
    `Mỗi câu gồm các trường: ${f.spec}.`,
    a.ghiChu ? `Ghi chú: ${a.ghiChu}` : '',
    '',
    giaiRule(a.giaiAI),
    f.ruleDapAn,
    FMT_RULES,
    '',
    `Trả về JSON: { "cau_hoi": [ ${f.obj} ] }`,
  ].filter(Boolean).join('\n')
}
export function parseBatchJson(text: string): CauNoiDung[] {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any
  try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const arr = Array.isArray(obj) ? obj : (obj.cau_hoi ?? obj.cauHoi ?? obj.variants)
  if (!Array.isArray(arr)) throw new Error('Cần JSON dạng { "cau_hoi": [ … ] } hoặc một mảng câu.')
  return arr.filter((x: any) => x?.de_bai || x?.noi_dung).map(normCau)
}
// Tách câu từ VĂN BẢN CÓ CẤU TRÚC (không cần AI). Mốc câu: "Câu N."/"Bài N.";
// nhãn trường: "Đề bài:", "Đáp án:", "Lời giải [chi tiết]:" / "Hướng dẫn:".
function parseBlock(block: string): CauNoiDung {
  const buf = { de: [] as string[], da: [] as string[], lg: [] as string[] }
  const opts: string[] = []
  let cur: 'de' | 'da' | 'lg' = 'de'
  for (let ln of block.split('\n')) {
    ln = ln.replace(/^\s*(?:câu|bài)\s*\d+\s*[.:)\-]?\s*/i, '') // bỏ mốc "Câu N." nếu dính đầu dòng
    let m: RegExpMatchArray | null
    if (/^\s*(?:lựa\s*chọn|phương\s*án)\s*[:.]/i.test(ln)) continue                  // nhãn "Lựa chọn:"
    if ((m = ln.match(/^\s*[A-D][.):]\s*(.+)$/))) { opts.push(m[1].trim()); continue } // phương án A/B/C/D
    if ((m = ln.match(/^\s*đề\s*bài\s*[:.]?\s*(.*)$/i))) { cur = 'de'; buf.de.push(m[1]) }
    else if ((m = ln.match(/^\s*đáp\s*án\s*[:.]?\s*(.*)$/i))) { cur = 'da'; buf.da.push(m[1]) }
    else if ((m = ln.match(/^\s*(?:lời\s*giải(?:\s*chi\s*tiết)?|hướng\s*dẫn)\s*[:.]?\s*(.*)$/i))) { cur = 'lg'; buf.lg.push(m[1]) }
    else buf[cur].push(ln)
  }
  const join = (arr: string[]) => arr.join('\n').trim()
  return { noi_dung: join(buf.de), dap_an: join(buf.da) || null, loi_giai: join(buf.lg) || null, lua_chon: opts.length ? opts : null }
}
export function parseStructuredText(text: string): CauNoiDung[] {
  const boundary = /^\s*(?:câu|bài)\s*\d+\b/i
  const blocks: string[][] = []
  let cur: string[] | null = null
  for (const ln of text.replace(/\r\n/g, '\n').split('\n')) {
    if (boundary.test(ln)) { cur = [ln]; blocks.push(cur) }
    else if (cur) cur.push(ln)
    else if (ln.trim()) { cur = [ln]; blocks.push(cur) }
  }
  return blocks.map((b) => parseBlock(b.join('\n'))).filter((c) => c.noi_dung.trim())
}

export async function saveCauBatch(a: { dangChinh: string; loaiCau: string; items: CauNoiDung[] }, tbl = 'dai_cau_hoi'): Promise<number> {
  if (!a.items.length) return 0
  const start = await nextCauSeq(a.dangChinh, tbl)
  const rows = a.items.map((v, i) => ({
    ma_cau: maCau(a.dangChinh, start + i),
    dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
    anh_de: v.anh_de ?? null, anh_dap_an: v.anh_dap_an ?? null, nguon: 'le', nguon_giai: v.nguon_giai ?? 'nguoi',
  }))
  const { error } = await supabase.from(tbl).insert(rows)
  if (error) throw error
  return rows.length
}

// ── ĐO TOKEN + QUY RA TIỀN ──────────────────────────────────────────
// Giá USD / 1 TRIỆU token (thinking tính như OUTPUT). ⚠ PROVISIONAL — cập nhật theo ai.google.dev/pricing.
export const USD_VND = 25400
export const GEMINI_GIA: Record<string, { in: number; out: number }> = {
  'gemini-2.5-flash-lite': { in: 0.10, out: 0.40 },
  'gemini-2.5-flash': { in: 0.30, out: 2.50 },
  'gemini-2.5-pro': { in: 1.25, out: 10.0 },
}
const giaOf = (m: string) => GEMINI_GIA[m] ?? (m.includes('pro') ? GEMINI_GIA['gemini-2.5-pro'] : m.includes('lite') ? GEMINI_GIA['gemini-2.5-flash-lite'] : GEMINI_GIA['gemini-2.5-flash'])
export type GeminiUsage = { in: number; out: number; think: number }
export function geminiCostVND(u: GeminiUsage, model: string): number {
  const g = giaOf(model)
  return Math.round(((u.in * g.in + (u.out + u.think) * g.out) / 1e6) * USD_VND)
}
// Bộ đếm theo PHIÊN (reset khi F5 / bấm reset). UI subscribe để hiện badge.
export type GeminiMeter = { in: number; out: number; think: number; calls: number; vnd: number }
let _meter: GeminiMeter = { in: 0, out: 0, think: 0, calls: 0, vnd: 0 }
const _meterListeners = new Set<() => void>()
export function getGeminiMeter(): GeminiMeter { return _meter }
export function onGeminiMeter(fn: () => void): () => void { _meterListeners.add(fn); return () => { _meterListeners.delete(fn) } }
export function resetGeminiMeter() { _meter = { in: 0, out: 0, think: 0, calls: 0, vnd: 0 }; _meterListeners.forEach((f) => f()) }
function recordUsage(u: GeminiUsage, model: string) {
  _meter = { in: _meter.in + u.in, out: _meter.out + u.out, think: _meter.think + u.think, calls: _meter.calls + 1, vnd: _meter.vnd + geminiCostVND(u, model) }
  _meterListeners.forEach((f) => f())
}
// Nhà khác Gemini — giá USD / 1 TRIỆU token. ⚠ PROVISIONAL, kiểm lại theo trang giá của từng nhà.
// (DeepSeek: api-docs.deepseek.com/quick_start/pricing · Anthropic: platform.claude.com/docs/en/pricing)
export const AI_GIA: Record<string, { in: number; out: number }> = {
  'deepseek-chat': { in: 0.27, out: 1.10 },
  'deepseek-reasoner': { in: 0.55, out: 2.19 },
  'claude-haiku-4-5': { in: 1.0, out: 5.0 },
  'claude-sonnet-5': { in: 3.0, out: 15.0 },   // có giá giới thiệu $2/$10 tới 31/08/2026 — để giá CHÍNH THỨC cho đồng hồ không báo thiếu
  'claude-opus-5': { in: 5.0, out: 25.0 },     // ⚠ Opus 4.7 GIÁ Y HỆT Opus 5 → hạ đời không rẻ hơn, muốn rẻ phải sang Sonnet/Haiku
}
function recordUsageKhac(u: { in: number; out: number }, model: string) {
  const g = AI_GIA[model] ?? { in: 1, out: 5 }
  const vnd = Math.round(((u.in * g.in + u.out * g.out) / 1e6) * USD_VND)
  _meter = { in: _meter.in + u.in, out: _meter.out + u.out, think: _meter.think, calls: _meter.calls + 1, vnd: _meter.vnd + vnd }
  _meterListeners.forEach((f) => f())
  console.info(`[${model}] tokens — in:${u.in} out:${u.out} ≈ ${vnd.toLocaleString('vi')}đ`)
}

// ══ NHÀ AI CHO CLONE — DeepSeek | Claude ═══════════════════════════════════
// VÌ SAO (Thùy 14/08): Gemini clone kém. CLONE = generation thuần text → đổi nhà là đổi sạch,
// không vướng gì. OCR / bóc bài gốc / nhập chuỗi câu / cắt bbox hình VẪN Ở GEMINI — nó là nhà duy
// nhất trong 3 nhà này làm được khoản đọc ảnh + toạ độ hình.
//
// ⚠ KEY NẰM TRONG BUNDLE TRÌNH DUYỆT (`VITE_*`) — ai mở app là đọc được, đăng nhập KHÔNG che được
//   (file JS tải về trước cả màn login). Khác Gemini, key Anthropic/DeepSeek KHÔNG khoá theo tên miền
//   được. Chấp nhận vì 2 tài khoản đều nạp-tới-đâu-tiêu-tới-đó (Thùy 14/08) ⇒ mất tối đa = số dư.
//   ⛔ TRƯỚC KHI DEPLOY ERP RA ĐỊA CHỈ PUBLIC: chuyển 2 lời gọi này qua proxy ở `worker/`.
// Bội số tiền = ĐO THẬT trên bài DC000006, 2 biến thể, cùng prompt (15/08/2026):
//   DeepSeek 27đ · Haiku ~150đ · Sonnet 597đ · Opus 787đ.
// ⚠ Sonnet KHÔNG rẻ bằng tỉ lệ giá niêm yết (1,7×) vì nó xài nhiều output token hơn Opus
//   (1043 vs 714) ⇒ thực tế chỉ rẻ hơn Opus ~24%. Muốn rẻ THẬT thì bước xuống DeepSeek/Haiku,
//   không phải Opus→Sonnet. (Và Opus 4.7 giá y hệt Opus 5 — hạ đời không tiết kiệm gì.)
export type AiNha = 'deepseek' | 'claude'
export const AI_MODELS: { nha: AiNha; value: string; label: string; sub: string }[] = [
  { nha: 'deepseek', value: 'deepseek-chat', label: 'DeepSeek', sub: 'rẻ nhất · mặc định' },
  { nha: 'deepseek', value: 'deepseek-reasoner', label: 'DeepSeek R1', sub: 'suy luận sâu, chậm hơn' },
  { nha: 'claude', value: 'claude-haiku-4-5', label: 'Claude Haiku', sub: '~5× DeepSeek · nhanh' },
  { nha: 'claude', value: 'claude-sonnet-5', label: 'Claude Sonnet 5', sub: '~22× DeepSeek · khi DeepSeek sai' },
  { nha: 'claude', value: 'claude-opus-5', label: 'Claude Opus 5', sub: '⚠ ~29× DeepSeek · chỉ toán khó nhất' },
]
export const nhaCuaModel = (m: string): AiNha => (m.startsWith('claude') ? 'claude' : 'deepseek')

// DeepSeek — chuẩn OpenAI. JSON mode cần chữ "json" xuất hiện trong prompt (prompt clone đã có).
async function callDeepSeekJson(prompt: string, model: string): Promise<string> {
  const key = import.meta.env.VITE_DEEPSEEK_KEY as string | undefined
  if (!key) throw new Error('Chưa có VITE_DEEPSEEK_KEY trong .env.local → chọn nhà khác hoặc thêm key.')
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model, max_tokens: 8192, stream: false,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`DeepSeek lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  const u = data?.usage
  recordUsageKhac({ in: u?.prompt_tokens ?? 0, out: u?.completion_tokens ?? 0 }, model)
  const txt: string = data?.choices?.[0]?.message?.content ?? ''
  if (data?.choices?.[0]?.finish_reason === 'length') throw new Error('DeepSeek bị CẮT do output quá dài (JSON dở) → giảm "Số biến thể" rồi thử lại.')
  if (!txt.trim()) throw new Error('DeepSeek trả rỗng.')
  return txt
}

// Claude — dùng SDK chính thức (@anthropic-ai/sdk đã có sẵn trong repo).
// `dangerouslyAllowBrowser` = thừa nhận key nằm ở client (xem cảnh báo đầu mục).
// Suy luận: để adaptive — clone toán là GENERATION, cần nghĩ; Opus 5 mặc định đã bật.
async function callClaudeJson(prompt: string, model: string): Promise<string> {
  // Nhận cả 2 tên biến — .env.local đang dùng VITE_ANTHROPIC_API_KEY.
  const key = (import.meta.env.VITE_ANTHROPIC_API_KEY ?? import.meta.env.VITE_ANTHROPIC_KEY) as string | undefined
  if (!key) throw new Error('Chưa có VITE_ANTHROPIC_API_KEY trong .env.local → chọn nhà khác hoặc thêm key.')
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })
  // Haiku KHÔNG nhận adaptive thinking (API trả 400) — chỉ bật suy luận cho Opus/Sonnet.
  const res = await client.messages.create({
    model, max_tokens: 16000,
    ...(model.includes('haiku') ? {} : { thinking: { type: 'adaptive' as const } }),
    messages: [{ role: 'user', content: prompt }],
  })
  const u = res.usage
  recordUsageKhac({ in: u?.input_tokens ?? 0, out: u?.output_tokens ?? 0 }, model)
  if (res.stop_reason === 'refusal') throw new Error('Claude từ chối yêu cầu này — đổi nhà hoặc sửa đề bài.')
  if (res.stop_reason === 'max_tokens') throw new Error('Claude bị CẮT do output quá dài (JSON dở) → giảm "Số biến thể" rồi thử lại.')
  // Bỏ khối thinking, chỉ lấy text.
  const txt = res.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('')
  if (!txt.trim()) throw new Error('Claude trả rỗng.')
  return txt
}

// Cửa vào CHUNG cho clone. Không ép schema như Gemini (2 nhà này không dùng cùng format schema) —
// bù lại `parseVariantsJson`/`parseCloneJson` vốn đã gỡ ```fence``` + parse nới lỏng.
export async function callAiClone(prompt: string, model: string): Promise<string> {
  return nhaCuaModel(model) === 'claude' ? callClaudeJson(prompt, model) : callDeepSeekJson(prompt, model)
}

// ── AUTO: gọi Gemini API thẳng từ client (key VITE_GEMINI_KEY — rủi ro lộ, chấp nhận) ──
export type GeminiFile = { mimeType: string; dataBase64: string }  // ảnh/PDF base64 (bỏ tiền tố data:)
// Schema ép JSON hợp lệ (Type enum UPPERCASE). 1 câu = de_bai (bắt buộc) + đáp án/lời giải/lựa chọn (tuỳ).
// ⚠ de_bai/loi_giai có description ÉP GIỮ XUỐNG DÒNG: responseSchema (constrained decoding) hay gộp
//   chuỗi về 1 dòng → mất bố cục. Description per-field là cách Gemini tôn trọng để chèn '\n'.
const CAU_ITEM_SCHEMA = { type: 'OBJECT', properties: {
  de_bai: { type: 'STRING', description: 'Đề bài. GIỮ bố cục NHIỀU DÒNG: mỗi ý / mỗi câu hỏi / mỗi dòng của đề đặt trên MỘT dòng riêng, ngăn nhau bằng ký tự xuống dòng. KHÔNG gộp tất cả thành một đoạn liền.' },
  dap_an: { type: 'STRING' },
  loi_giai: { type: 'STRING', description: 'Lời giải trình bày TỪNG BƯỚC, mỗi bước trên MỘT dòng riêng, ngăn nhau bằng ký tự xuống dòng. KHÔNG gộp thành một đoạn.' },
  lua_chon: { type: 'ARRAY', items: { type: 'STRING' } },
}, required: ['de_bai'] }
export const CLONE_SCHEMA = { type: 'OBJECT', properties: { bai_goc: CAU_ITEM_SCHEMA, variants: { type: 'ARRAY', items: CAU_ITEM_SCHEMA } }, required: ['bai_goc', 'variants'] }
// 2 bước: GOC = chỉ bóc bài gốc (bước 1) · VARIANTS = chỉ sinh biến thể từ gốc đã chốt (bước 2).
export const GOC_SCHEMA = { type: 'OBJECT', properties: { bai_goc: CAU_ITEM_SCHEMA }, required: ['bai_goc'] }
export const VARIANTS_SCHEMA = { type: 'OBJECT', properties: { variants: { type: 'ARRAY', items: CAU_ITEM_SCHEMA } }, required: ['variants'] }
export const BATCH_SCHEMA = { type: 'OBJECT', properties: { cau_hoi: { type: 'ARRAY', items: CAU_ITEM_SCHEMA } }, required: ['cau_hoi'] }
export const LYTHUYET_SCHEMA = { type: 'OBJECT', properties: { noi_dung: { type: 'STRING' } }, required: ['noi_dung'] }
export async function callGeminiJson(prompt: string, opts?: { model?: string; files?: GeminiFile[]; think?: number; schema?: any }): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_KEY as string | undefined
  if (!key) throw new Error('Chưa có VITE_GEMINI_KEY trong .env.local → luồng AUTO chưa bật. Dùng MANUAL hoặc thêm key.')
  const model = opts?.model || (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || 'gemini-2.5-flash'
  const parts: any[] = [{ text: prompt }]
  for (const f of opts?.files ?? []) parts.push({ inline_data: { mime_type: f.mimeType, data: f.dataBase64 } })
  // ⚠ TIỀN: Gemini 2.5 mặc định BẬT thinking — token suy nghĩ TÍNH NHƯ OUTPUT (vụ cháy 1tr3 06-10).
  // OCR/bóc đề/nhập-chuỗi = extraction → KHÔNG cần nghĩ (budget 0). CLONE = GENERATION (dựng+giải+số đẹp)
  // → CẦN suy luận, caller truyền opts.think (vd 8192) nếu không clone toán sẽ sai. Pro ép min 128.
  const thinkingBudget = opts?.think ?? (model.includes('pro') ? 128 : 0)
  // responseSchema (constrained decoding) = ép JSON hợp lệ + tự escape → hết lỗi "Bad escaped"/"Expected , or }"
  // do LaTeX 1-backslash hay " chưa escape (clone/batch/lý-thuyết hay dính). Caller truyền schema theo shape.
  const genCfg: any = { responseMimeType: 'application/json', maxOutputTokens: 65536, thinkingConfig: { thinkingBudget } }
  if (opts?.schema) genCfg.responseSchema = opts.schema
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: genCfg }),
  })
  if (!res.ok) throw new Error(`Gemini API lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  // Soi chi phí từng call ngay tại console: prompt/output/THINKING token.
  const u = data?.usageMetadata
  if (u) console.info(`[gemini ${model}] tokens — in:${u.promptTokenCount ?? 0} out:${u.candidatesTokenCount ?? 0} think:${u.thoughtsTokenCount ?? 0}`)
  recordUsage({ in: u?.promptTokenCount ?? 0, out: u?.candidatesTokenCount ?? 0, think: u?.thoughtsTokenCount ?? 0 }, model)
  const cand = data?.candidates?.[0]
  const txt: string = (cand?.content?.parts ?? []).map((p: any) => p.text ?? '').join('')
  if (cand?.finishReason === 'MAX_TOKENS') throw new Error('AI bị CẮT do output quá dài (JSON dở) → giảm "Số biến thể" hoặc cho input ngắn hơn rồi thử lại.')
  if (!txt.trim()) throw new Error(`Gemini trả rỗng${cand?.finishReason ? ` (lý do: ${cand.finishReason})` : ''}.`)
  return txt
}

// ── SPIKE Phase 2 (ingest): gọi Gemini trả KÈM token usage (đo chi phí) + prompt dò câu+bbox hình ──
// responseSchema = constrained decoding → Gemini BUỘC xuất JSON hợp lệ cấu trúc + tự escape chuỗi
// (hết lỗi "Bad escaped character" / "Expected , or }" do LaTeX 1-backslash hay " chưa escape).
export async function callGeminiRich(prompt: string, opts?: { model?: string; files?: GeminiFile[]; think?: number; schema?: any }): Promise<{ text: string; usage: GeminiUsage }> {
  const key = import.meta.env.VITE_GEMINI_KEY as string | undefined
  if (!key) throw new Error('Chưa có VITE_GEMINI_KEY trong .env.local.')
  const model = opts?.model || 'gemini-2.5-flash'
  const parts: any[] = [{ text: prompt }]
  for (const f of opts?.files ?? []) parts.push({ inline_data: { mime_type: f.mimeType, data: f.dataBase64 } })
  const thinkingBudget = opts?.think ?? (model.includes('pro') ? 128 : 0)
  const genCfg: any = { responseMimeType: 'application/json', maxOutputTokens: 65536, thinkingConfig: { thinkingBudget } }
  if (opts?.schema) genCfg.responseSchema = opts.schema
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: genCfg }),
  })
  if (!res.ok) throw new Error(`Gemini API lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  const u = data?.usageMetadata ?? {}
  const cand = data?.candidates?.[0]
  const text: string = (cand?.content?.parts ?? []).map((p: any) => p.text ?? '').join('')
  if (cand?.finishReason === 'MAX_TOKENS') throw new Error('AI bị CẮT (JSON dở) — trang quá dày, thử trang ngắn hơn / ít câu hơn.')
  if (!text.trim()) throw new Error(`Gemini trả rỗng${cand?.finishReason ? ` (${cand.finishReason})` : ''}.`)
  const usage: GeminiUsage = { in: u.promptTokenCount ?? 0, out: u.candidatesTokenCount ?? 0, think: u.thoughtsTokenCount ?? 0 }
  recordUsage(usage, model)
  return { text, usage }
}

// Câu suy ra từ ingest 1 trang: text fields + cờ có hình + bbox hình (Gemini format [ymin,xmin,ymax,xmax] 0–1000).
// ⭐ HAI bbox riêng — ĐỀ và ĐÁP ÁN (Thùy 17/08: "đang không phân biệt được hình ở đề hay đáp án. Giữa đề
// và đáp án sẽ có 1 ranh giới là từ Giải/Lời giải/Bài giải — sau đó là đáp án, trước đó là đề"). TRƯỚC đây
// chỉ có 1 cặp co_hinh/box_hinh ⇒ hình đáp án (nếu có) bị gộp lẫn vào box đề hoặc mất, và ingest luôn đổ
// thẳng vào anh_de — anh_dap_an luôn null bất kể trang có hình ở phần lời giải hay không.
export type IngestCau = {
  noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon: string[] | null
  coHinhDe: boolean; boxDe: [number, number, number, number] | null
  coHinhDapAn: boolean; boxDapAn: [number, number, number, number] | null
}
// Schema ép Gemini xuất JSON đúng cấu trúc (Type enum UPPERCASE theo proto). required tối thiểu = de_bai.
export const INGEST_SCHEMA = {
  type: 'OBJECT',
  properties: {
    cau: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          de_bai: { type: 'STRING' }, dap_an: { type: 'STRING' }, loi_giai: { type: 'STRING' },
          lua_chon: { type: 'ARRAY', items: { type: 'STRING' } },
          co_hinh_de: { type: 'BOOLEAN' }, box_hinh_de: { type: 'ARRAY', items: { type: 'NUMBER' } },
          co_hinh_dap_an: { type: 'BOOLEAN' }, box_hinh_dap_an: { type: 'ARRAY', items: { type: 'NUMBER' } },
        },
        required: ['de_bai'],
      },
    },
  },
  required: ['cau'],
}
export function buildIngestPrompt(a: { tenDang?: string; loaiCau?: string; giaiAI?: boolean }): string {
  const f = loaiFields(a.loaiCau || 'tu_luan')
  return [
    'Đây là ẢNH 1 TRANG tài liệu toán. TÁCH thành từng CÂU HỎI theo thứ tự xuất hiện (mỗi bài = 1 câu, KHÔNG tách ý a/b/c).',
    a.tenDang ? `Gợi ý: các câu thường cùng dạng "${a.tenDang}".` : '',
    `Mỗi câu gồm: ${f.spec}.`,
    '⚠ RANH GIỚI ĐỀ / ĐÁP ÁN của một câu = dòng chữ "Giải:" / "Lời giải:" / "Bài giải:" (hoặc tương đương). Hình xuất hiện TRƯỚC dòng đó (kể cả không có dòng đó — cả câu chỉ có đề) = HÌNH ĐỀ. Hình xuất hiện SAU dòng đó = HÌNH ĐÁP ÁN. Một câu có thể có CẢ HAI, chỉ một, hoặc không hình nào — đừng gộp 2 hình khác vị trí vào chung 1 box.',
    '⚠ MỖI câu thêm 4 trường HÌNH: "co_hinh_de"/"box_hinh_de" cho hình Ở ĐỀ (trước ranh giới), "co_hinh_dap_an"/"box_hinh_dap_an" cho hình Ở ĐÁP ÁN (sau ranh giới). box = [ymin,xmin,ymax,xmax] toạ độ CHUẨN HOÁ 0–1000 của vùng hình (ôm TRỌN hình đó, chừa lề nhỏ) — chỉ HÌNH VẼ/SƠ ĐỒ/ĐỒ THỊ (KHÔNG tính bảng số). Không có hình phía đó → co_hinh_* = false, box_hinh_* = null.',
    'BẢNG số liệu → viết bằng LaTeX $\\begin{array}{…}…\\end{array}$ trong de_bai/loi_giai (KHÔNG coi là hình).',
    giaiRule(a.giaiAI),
    f.ruleDapAn,
    FMT_RULES,
    'Trả JSON: { "cau": [ { "de_bai":"…", "dap_an":"…", "loi_giai":"…", "lua_chon":["…"], "co_hinh_de": false, "box_hinh_de": null, "co_hinh_dap_an": false, "box_hinh_dap_an": null } ] }',
  ].filter(Boolean).join('\n')
}
export function parseIngestJson(text: string): IngestCau[] {
  let t = text.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any; try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const arr = Array.isArray(obj) ? obj : (obj.cau ?? obj.cau_hoi ?? [])
  if (!Array.isArray(arr)) throw new Error('Cần JSON dạng { "cau": [ … ] }.')
  const box4 = (v: any): [number, number, number, number] | null =>
    Array.isArray(v) && v.length === 4 ? (v.map(Number) as [number, number, number, number]) : null
  return arr.filter((x: any) => x?.de_bai || x?.noi_dung).map((x: any) => ({
    noi_dung: String(x.de_bai ?? x.noi_dung ?? '').trim(),
    dap_an: x.dap_an != null && String(x.dap_an).trim() ? String(x.dap_an).trim() : null,
    loi_giai: x.loi_giai != null && String(x.loi_giai).trim() ? String(x.loi_giai).trim() : null,
    lua_chon: Array.isArray(x.lua_chon) && x.lua_chon.length ? x.lua_chon.map(String) : null,
    coHinhDe: !!x.co_hinh_de, boxDe: box4(x.box_hinh_de),
    coHinhDapAn: !!x.co_hinh_dap_an, boxDapAn: box4(x.box_hinh_dap_an),
  }))
}

// ════════════════════════════════════════════════════════════════
// LUỒNG NHẬP KHO (ingest-first, scope = CHỦ ĐỀ): 1 file → bóc MỌI loại → gán dạng → verify → đẩy kho.
// Bóc/crop hình chạy ở SCREEN (DOM); ở đây = prompt + parse + phân loại grounded + verify + AI-giải + save + log.
// ════════════════════════════════════════════════════════════════
export type KhoMon = 'toan' | 'khtn' | 'hgt'
export function khoTbls(mon: KhoMon): { cauTbl: string; banDoTbl: string; lyThuyetTbl: string } {
  return mon === 'khtn'
    ? { cauTbl: 'khtn_cau_hoi', banDoTbl: 'khtn_ban_do', lyThuyetTbl: 'khtn_dang_ly_thuyet' }
    : mon === 'hgt'
    ? { cauTbl: 'hgt_cau_hoi', banDoTbl: 'hgt_ban_do', lyThuyetTbl: 'hgt_dang_ly_thuyet' }
    : { cauTbl: 'dai_cau_hoi', banDoTbl: 'dai_ban_do', lyThuyetTbl: 'dai_dang_ly_thuyet' }
}

// Chủ đề trong 1 khối — chọn ở ĐẦU luồng (tài liệu chung 1 chủ đề, người biết sẵn).
export type ChuDeOption = { ma_chu_de: string; ten_chu_de: string; soDang: number }
export async function listChuDeOptions(mon: KhoMon, khoi: string): Promise<ChuDeOption[]> {
  const { banDoTbl } = khoTbls(mon)
  const { data, error } = await supabase.from(banDoTbl).select('ma_chu_de, ten_chu_de').eq('khoi', khoi).limit(LIMIT)
  if (error) throw error
  const m = new Map<string, ChuDeOption>()
  for (const r of (data ?? []) as any[]) {
    const c = m.get(r.ma_chu_de) ?? { ma_chu_de: r.ma_chu_de, ten_chu_de: r.ten_chu_de, soDang: 0 }
    c.soDang++; m.set(r.ma_chu_de, c)
  }
  return [...m.values()].sort((a, b) => a.ma_chu_de.localeCompare(b.ma_chu_de))
}

// Dạng ứng viên TRONG 1 chủ đề (candidate cho classify + chip). Kèm mo_ta_ngan (grounded, ~0 token biên).
export type DangCandidate = { ma_dang: string; ten_dang: string; ma_chuyen_de: string; ten_chuyen_de: string; mo_ta_ngan: string | null }
export async function listDangByChuDe(mon: KhoMon, khoi: string, maChuDe: string): Promise<DangCandidate[]> {
  const { banDoTbl } = khoTbls(mon)
  const { data, error } = await supabase.from(banDoTbl)
    .select('ma_dang, ten_dang, ma_chuyen_de, ten_chuyen_de, mo_ta_ngan')
    .eq('khoi', khoi).eq('ma_chu_de', maChuDe).order('ma_dang').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ ma_dang: r.ma_dang, ten_dang: r.ten_dang, ma_chuyen_de: r.ma_chuyen_de, ten_chuyen_de: r.ten_chuyen_de, mo_ta_ngan: r.mo_ta_ngan ?? null }))
}

// Lý thuyết 1 dạng (RAG cho verify + AI-giải). '' nếu chưa có.
export async function getDangLyThuyet(mon: KhoMon, maDang: string): Promise<string> {
  const { lyThuyetTbl } = khoTbls(mon)
  const { data, error } = await supabase.from(lyThuyetTbl).select('noi_dung').eq('ma_dang', maDang).limit(1)
  if (error) throw error
  return String((data?.[0] as any)?.noi_dung ?? '').trim()
}

// ── Bóc 1 pass (schema HỢP NHẤT): loai_cau + de_bai + dap_an? + lua_chon? + menh_de? + hình ──
const KHO_MENHDE_SCHEMA = { type: 'OBJECT', properties: {
  noi_dung: { type: 'STRING' }, dap_an: { type: 'STRING', description: "'D' nếu mệnh đề ĐÚNG, 'S' nếu SAI." }, loi_giai: { type: 'STRING' },
}, required: ['noi_dung', 'dap_an'] }
export const INGEST_KHO_SCHEMA = { type: 'OBJECT', properties: { cau: { type: 'ARRAY', items: {
  type: 'OBJECT', properties: {
    loai_cau: { type: 'STRING', description: "'trac_nghiem' | 'dung_sai' | 'tra_loi_ngan' | 'tu_luan'" },
    de_bai: { type: 'STRING', description: 'Đề bài (đúng/sai: đề CHUNG). GIỮ bố cục nhiều dòng bằng ký tự xuống dòng.' },
    dap_an: { type: 'STRING' },
    lua_chon: { type: 'ARRAY', items: { type: 'STRING' } },
    menh_de: { type: 'ARRAY', items: KHO_MENHDE_SCHEMA },
    loi_giai: { type: 'STRING', description: 'Lời giải chi tiết, mỗi bước 1 dòng.' },
    co_hinh: { type: 'BOOLEAN' }, box_hinh: { type: 'ARRAY', items: { type: 'NUMBER' } },
  }, required: ['loai_cau', 'de_bai'],
} } }, required: ['cau'] }
export function buildKhoIngestPrompt(a: { tenChuDe?: string; giaiAI?: boolean }): string {
  return [
    'Đây là ẢNH 1 TRANG tài liệu toán. TÁCH thành từng CÂU theo thứ tự xuất hiện (mỗi bài = 1 câu, KHÔNG tách ý a/b/c thành nhiều câu).',
    a.tenChuDe ? `Bối cảnh: tài liệu thuộc chủ đề "${a.tenChuDe}".` : '',
    'MỖI câu tự nhận diện "loai_cau" ∈ { trac_nghiem, dung_sai, tra_loi_ngan, tu_luan } và bóc đúng cấu trúc:',
    '- trac_nghiem (4 phương án A/B/C/D): "de_bai" = đề dẫn (KHÔNG kèm A./B./C./D.); "lua_chon" = mảng 4 nội dung phương án; "dap_an" = CHỮ CÁI đúng.',
    '- dung_sai (Phần 2: 1 đề chung + 4 mệnh đề a/b/c/d): "de_bai" = đề CHUNG; "menh_de" = mảng ĐÚNG 4 phần tử { noi_dung, dap_an ("D"|"S"), loi_giai }; để "lua_chon" trống.',
    '- tra_loi_ngan / tu_luan: "de_bai" = toàn bộ đề; "dap_an" = kết quả (nếu có); để "lua_chon"/"menh_de" trống.',
    '⚠ MỖI câu thêm "co_hinh" (true nếu có HÌNH VẼ/SƠ ĐỒ/ĐỒ THỊ/BẢNG BIẾN THIÊN/BẢNG XÉT DẤU cần giữ làm ảnh) và "box_hinh" = [ymin,xmin,ymax,xmax] toạ độ CHUẨN HOÁ 0–1000 ôm trọn hình (chỉ khi co_hinh=true, không thì null).',
    '⚠ BẢNG BIẾN THIÊN / BẢNG XÉT DẤU (có mũi tên ↗↘, dòng x · y′ · y, dấu ∞) = KHÔNG viết LaTeX cho đúng được → BẮT BUỘC coi là HÌNH: đặt co_hinh=true + box_hinh ôm trọn bảng, trong de_bai chỉ ghi "[bảng biến thiên]" đúng vị trí (KHÔNG cố dựng bằng \\begin{array}).',
    'CHỈ bảng SỐ LIỆU thuần (không mũi tên, không biến thiên) mới viết LaTeX $\\begin{array}{…}…\\end{array}$ trong de_bai (không coi là hình).',
    giaiRule(a.giaiAI),
    FMT_RULES,
    'Trả JSON: { "cau": [ { "loai_cau":"…", "de_bai":"…", "dap_an":"…", "lua_chon":[…], "menh_de":[…], "loi_giai":"…", "co_hinh":false, "box_hinh":null } ] }',
  ].filter(Boolean).join('\n')
}
export type KhoIngestMenhDe = { noi_dung: string; dap_an: 'D' | 'S'; loi_giai: string | null }
export type KhoIngestCau = { loai_cau: LoaiCau; noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon: string[] | null; menh_de: KhoIngestMenhDe[] | null; coHinh: boolean; box: [number, number, number, number] | null }
const LOAI_HOP_LE = new Set<LoaiCau>(['trac_nghiem', 'dung_sai', 'tra_loi_ngan', 'tu_luan'])
export function parseKhoIngestJson(text: string): KhoIngestCau[] {
  let t = text.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any; try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const arr = Array.isArray(obj) ? obj : (obj.cau ?? obj.cau_hoi ?? [])
  if (!Array.isArray(arr)) throw new Error('Cần JSON dạng { "cau": [ … ] }.')
  return arr.filter((x: any) => x?.de_bai || x?.noi_dung).map((x: any): KhoIngestCau => {
    let loai = String(x.loai_cau ?? 'tu_luan').trim() as LoaiCau
    if (!LOAI_HOP_LE.has(loai)) loai = Array.isArray(x.menh_de) && x.menh_de.length ? 'dung_sai' : Array.isArray(x.lua_chon) && x.lua_chon.length ? 'trac_nghiem' : 'tu_luan'
    const lua_chon = Array.isArray(x.lua_chon) && x.lua_chon.length ? x.lua_chon.map(String) : null
    let noi_dung = suaXuongDongLo(stripYCon(stripCauLabel(String(x.de_bai ?? x.noi_dung ?? '').trim())))
    if (loai === 'trac_nghiem' && lua_chon) noi_dung = stripEmbeddedOpts(noi_dung)
    const menh_de = loai === 'dung_sai' && Array.isArray(x.menh_de)
      ? x.menh_de.slice(0, 4).map((m: any): KhoIngestMenhDe => ({ noi_dung: String(m.noi_dung ?? '').trim(), dap_an: String(m.dap_an ?? 'D').trim().toUpperCase().startsWith('S') ? 'S' : 'D', loi_giai: String(m.loi_giai ?? '').trim() || null })).filter((m: KhoIngestMenhDe) => m.noi_dung)
      : null
    return {
      loai_cau: loai, noi_dung,
      dap_an: x.dap_an != null && String(x.dap_an).trim() ? String(x.dap_an).trim() : null,
      loi_giai: x.loi_giai != null && String(x.loi_giai).trim() ? stripYCon(String(x.loi_giai).trim()) : null,
      lua_chon: loai === 'dung_sai' ? null : lua_chon,
      menh_de,
      coHinh: !!x.co_hinh,
      box: Array.isArray(x.box_hinh) && x.box_hinh.length === 4 ? (x.box_hinh.map(Number) as [number, number, number, number]) : null,
    }
  })
}

// ── BÓC ĐỀ THI (DeThiScreen — thêm de_meta trang đầu + phan_goi_y mỗi câu so với INGEST_KHO_SCHEMA ở
// trên; KHÔNG đụng INGEST_KHO_SCHEMA/buildKhoIngestPrompt/parseKhoIngestJson đang dùng ở NhapKhoScreen,
// đúng convention đã có sẵn kiểu buildDungSaiIngestPrompt/DUNGSAI_SCHEMA riêng cho DungSaiBank). ──
export type DeThiIngestMeta = { nguon: string | null; nam: number | null; cap: string | null; thoiGianPhut: number | null; thangDiem: number | null }
const DETHI_META_SCHEMA = { type: 'OBJECT', properties: {
  nguon: { type: 'STRING', description: 'Tên trường/sở ra đề' }, nam: { type: 'NUMBER', description: 'Năm học/năm thi' },
  cap: { type: 'STRING', description: "vd 'vào 10', 'thi thử', 'học kỳ 1'" },
  thoi_gian_phut: { type: 'NUMBER' }, thang_diem: { type: 'NUMBER' },
} }
export const DETHI_INGEST_SCHEMA = { type: 'OBJECT', properties: {
  de_meta: DETHI_META_SCHEMA,
  tiep_noi: { type: 'STRING', description: 'CHỈ điền khi TOÀN BỘ trang này KHÔNG có "Câu N:" mới nào ở đầu dòng — nghĩa là cả trang chỉ là LỜI GIẢI TIẾP NỐI của câu cuối lượt trước (bị cắt ngang trang). Ghi nguyên văn phần lời giải tiếp nối thấy được vào đây, để "cau" RỖNG. Có câu mới trên trang → để trống field này.' },
  cau: { type: 'ARRAY', items: {
    type: 'OBJECT', properties: {
      loai_cau: { type: 'STRING', description: "'trac_nghiem' | 'dung_sai' | 'tra_loi_ngan' | 'tu_luan'" },
      stt_goc: { type: 'NUMBER', description: 'Số thứ tự "Câu N." IN TRÊN TRANG (đọc đúng số gốc, TRƯỚC khi hệ tự đánh số lại) — để trống nếu đề không đánh số câu.' },
      phan_goi_y: { type: 'STRING', description: 'Tiêu đề PHẦN đang thấy ngay TRÊN câu này trong đề (vd "Phần I. Trắc nghiệm") — để trống nếu đề không chia phần rõ.' },
      de_bai: { type: 'STRING', description: 'Đề bài (đúng/sai: đề CHUNG). GIỮ bố cục nhiều dòng bằng ký tự xuống dòng.' },
      dap_an: { type: 'STRING' },
      lua_chon: { type: 'ARRAY', items: { type: 'STRING' } },
      menh_de: { type: 'ARRAY', items: KHO_MENHDE_SCHEMA },
      loi_giai: { type: 'STRING', description: 'Lời giải chi tiết, mỗi bước 1 dòng.' },
      co_hinh: { type: 'BOOLEAN' }, box_hinh: { type: 'ARRAY', items: { type: 'NUMBER' } },
      anh_idx: { type: 'NUMBER', description: 'Số thứ tự ẢNH (0-based) TRONG LƯỢT NÀY mà câu này xuất hiện — chỉ cần khi lượt có NHIỀU HƠN 1 ảnh (nhiều trang gộp lại); để trống nếu chỉ có 1 ảnh.' },
    }, required: ['loai_cau', 'de_bai'],
  } },
}, required: ['cau'] }
export function buildDeThiIngestPrompt(a: { trangDau: boolean; nhieuAnh?: boolean; chuan?: boolean; giaiAI?: boolean; cauCuoi?: { stt: number | null; phan: string | null } | null }): string {
  // ⚠ Prompt đợt trước dồn quá nhiều rule "⚠⚠" chồng nhau (cấu trúc chuẩn, ranh giới câu, TN 4 đáp
  // án, bảng biến thiên...) → Thùy báo AI bị NHIỄU, quay lại nhận diện SAI cả 12 câu trắc nghiệm vốn
  // đã đúng trước đó (prompt càng dài/nhấn mạnh dồn dập càng dễ loãng, các mô hình AI đều có giới hạn
  // này). Viết GỌN LẠI: mỗi ý 1 câu, bỏ lặp, KHÔNG lạm dụng ⚠⚠ (chỉ giữ cho đúng 1 rule quan trọng
  // nhất — ranh giới câu), rule TN/bảng biến thiên gộp về 1 chỗ mỗi loại thay vì rải 2-3 dòng riêng.
  const doanBangBienThien = 'Hình vẽ/sơ đồ/đồ thị/bảng biến thiên/bảng xét dấu → "co_hinh"=true, "box_hinh"=[ymin,xmin,ymax,xmax] (0–1000) ôm trọn vùng đó, "de_bai" chỉ ghi "[bảng biến thiên]" đúng vị trí. Bảng biến thiên/xét dấu thường KHÔNG có khung viền (chỉ là đường kẻ + số + mũi tên nổi trên nền trắng) — vẫn ước lượng box_hinh theo rìa ngoài của đường kẻ/số/mũi tên, đừng bỏ qua chỉ vì không có khung. Sau "[bảng biến thiên]", tiếp tục đọc và giữ nguyên phần câu hỏi đứng NGAY SAU trong cùng "de_bai" (vd "Tính giá trị lớn nhất..."), đừng để mất.'
  return [
    a.nhieuAnh
      ? 'Đây là NHIỀU ẢNH — các trang liên tiếp của 1 đề thi theo đúng thứ tự đưa vào. Đọc lần lượt từng ảnh, tách thành từng câu theo thứ tự xuất hiện xuyên suốt các ảnh, không trộn nội dung 2 ảnh liền kề vào 1 câu.'
      : 'Đây là ảnh 1 trang đề thi.',
    a.trangDau
      ? 'Đây là trang đầu — đọc phần header (trường/sở, năm học, cấp/kỳ thi, thời gian làm bài, thang điểm) vào "de_meta", để trống field không thấy.'
      : '(Không phải trang đầu — để "de_meta" trống.)',
    a.chuan
      ? 'Đề có cấu trúc cố định, 3 phần theo thứ tự: Phần I Trắc nghiệm (12 câu) → Phần II Đúng/Sai (4 câu) → Phần III Trả lời ngắn (6 câu). Mỗi phần tự đánh số câu riêng, Phần II/III bắt đầu lại từ "Câu 1" (không cộng dồn từ phần trước) — đọc đúng số in trên trang.'
      : '',
    '⚠ Tách đề thành từng câu theo thứ tự xuất hiện, mỗi bài = 1 câu (không tách ý a/b/c thành nhiều câu). RANH GIỚI CÂU: 1 câu mới CHỈ bắt đầu khi thấy "Câu N:" ở ĐẦU DÒNG riêng — không tách chỉ vì xuống dòng hay chữ "câu" xuất hiện giữa câu (vd "xem lại câu 3"); nếu không thấy "Câu N:" đầu dòng thì nội dung vẫn thuộc câu đang bóc.',
    `Mỗi câu ghi "stt_goc" = số N đọc được ở trên (có thể reset về nhỏ giữa các phần, để trống nếu không đánh số) và "phan_goi_y" = tiêu đề phần đang thấy (giữ nguyên văn, để trống nếu không rõ)${a.nhieuAnh ? '; thêm "anh_idx" = số thứ tự ảnh (0-based) chứa câu này (chỉ cần khi lượt có nhiều ảnh)' : ''}.`,
    a.cauCuoi
      ? `Lượt TRƯỚC đã bóc xong đến "Câu ${a.cauCuoi.stt ?? '?'}"${a.cauCuoi.phan ? ` (${a.cauCuoi.phan})` : ''} — lời giải câu đó có thể DÀI, bị cắt ngang khi hết trang. Nếu trang NÀY không có bất kỳ "Câu N:" nào mới ở đầu dòng, TOÀN BỘ nội dung trang chỉ là lời giải TIẾP NỐI của câu trên — ghi vào "tiep_noi" (nguyên văn), để "cau" RỖNG ([]). TUYỆT ĐỐI đừng bịa câu mới từ nội dung lời giải đang dở.`
      : '',
    'Xác định "loai_cau" ∈ { trac_nghiem, dung_sai, tra_loi_ngan, tu_luan } và bóc theo đúng cấu trúc:',
    '- trac_nghiem: "de_bai" = đề dẫn (không kèm A/B/C/D); "lua_chon" = ĐÚNG 4 phương án A/B/C/D ngay sau đề dẫn; "dap_an" = chữ cái đúng. Lời giải/giải thích đứng sau 4 phương án luôn để riêng ở "loi_giai" — KHÔNG lấy 1 dòng trong đó làm phương án thứ 5.',
    '- dung_sai: "de_bai" = đề chung; "menh_de" = ĐÚNG 4 phần tử { noi_dung, dap_an ("D"|"S"), loi_giai }; để "lua_chon" trống.',
    '- tra_loi_ngan / tu_luan: "de_bai" = toàn bộ đề; "dap_an" = kết quả (nếu có); để "lua_chon"/"menh_de" trống.',
    doanBangBienThien,
    'Bảng SỐ LIỆU thuần (không mũi tên/biến thiên) viết LaTeX $\\begin{array}{…}…\\end{array}$ trong de_bai, không coi là hình.',
    giaiRule(a.giaiAI),
    FMT_RULES,
    'Trả JSON: { "de_meta": { "nguon":"…", "nam":0, "cap":"…", "thoi_gian_phut":0, "thang_diem":0 }, "tiep_noi":null, "cau": [ { "loai_cau":"…", "stt_goc":0, "phan_goi_y":"…", "de_bai":"…", "dap_an":"…", "lua_chon":[…], "menh_de":[…], "loi_giai":"…", "co_hinh":false, "box_hinh":null, "anh_idx":0 } ] }',
  ].filter(Boolean).join('\n')
}
export type DeThiIngestCau = KhoIngestCau & { phanGoiY: string | null; sttGoc: number | null; anhIdx: number | null }
export function parseDeThiIngestJson(text: string): { meta: Partial<DeThiIngestMeta>; caus: DeThiIngestCau[]; tiepNoi: string | null } {
  let t = text.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any; try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const arr = Array.isArray(obj) ? obj : (obj.cau ?? obj.cau_hoi ?? [])
  if (!Array.isArray(arr)) throw new Error('Cần JSON dạng { "cau": [ … ] }.')
  const dm = obj.de_meta ?? {}
  const meta: Partial<DeThiIngestMeta> = {
    nguon: dm.nguon != null && String(dm.nguon).trim() ? String(dm.nguon).trim() : null,
    nam: Number.isFinite(Number(dm.nam)) && Number(dm.nam) > 0 ? Number(dm.nam) : null,
    cap: dm.cap != null && String(dm.cap).trim() ? String(dm.cap).trim() : null,
    thoiGianPhut: Number.isFinite(Number(dm.thoi_gian_phut)) && Number(dm.thoi_gian_phut) > 0 ? Number(dm.thoi_gian_phut) : null,
    thangDiem: Number.isFinite(Number(dm.thang_diem)) && Number(dm.thang_diem) > 0 ? Number(dm.thang_diem) : null,
  }
  const caus: DeThiIngestCau[] = arr.filter((x: any) => x?.de_bai || x?.noi_dung).map((x: any): DeThiIngestCau => {
    let loai = String(x.loai_cau ?? 'tu_luan').trim() as LoaiCau
    if (!LOAI_HOP_LE.has(loai)) loai = Array.isArray(x.menh_de) && x.menh_de.length ? 'dung_sai' : Array.isArray(x.lua_chon) && x.lua_chon.length ? 'trac_nghiem' : 'tu_luan'
    // ⚠ CHỈ ĐÚNG 4 phương án — cắt cứng ở code (không tin riêng prompt): AI thỉnh thoảng lẫn 1 dòng
    // lời giải vào cuối mảng lua_chon (thành "phương án thứ 5") — .slice(0,4) chặn tận gốc, giống cách
    // menh_de đúng/sai đã cắt cứng ở đây từ trước.
    const lua_chon = Array.isArray(x.lua_chon) && x.lua_chon.length ? x.lua_chon.slice(0, 4).map(String) : null
    let noi_dung = suaXuongDongLo(stripYCon(stripCauLabel(String(x.de_bai ?? x.noi_dung ?? '').trim())))
    if (loai === 'trac_nghiem' && lua_chon) noi_dung = stripEmbeddedOpts(noi_dung)
    const menh_de = loai === 'dung_sai' && Array.isArray(x.menh_de)
      ? x.menh_de.slice(0, 4).map((m: any): KhoIngestMenhDe => ({ noi_dung: String(m.noi_dung ?? '').trim(), dap_an: String(m.dap_an ?? 'D').trim().toUpperCase().startsWith('S') ? 'S' : 'D', loi_giai: String(m.loi_giai ?? '').trim() || null })).filter((m: KhoIngestMenhDe) => m.noi_dung)
      : null
    return {
      loai_cau: loai, noi_dung, phanGoiY: x.phan_goi_y != null && String(x.phan_goi_y).trim() ? String(x.phan_goi_y).trim() : null,
      sttGoc: Number.isFinite(Number(x.stt_goc)) && Number(x.stt_goc) > 0 ? Number(x.stt_goc) : null,
      anhIdx: Number.isFinite(Number(x.anh_idx)) && Number(x.anh_idx) >= 0 ? Number(x.anh_idx) : null,
      dap_an: x.dap_an != null && String(x.dap_an).trim() ? String(x.dap_an).trim() : null,
      loi_giai: x.loi_giai != null && String(x.loi_giai).trim() ? stripYCon(String(x.loi_giai).trim()) : null,
      lua_chon: loai === 'dung_sai' ? null : lua_chon,
      menh_de,
      coHinh: !!x.co_hinh,
      box: Array.isArray(x.box_hinh) && x.box_hinh.length === 4 ? (x.box_hinh.map(Number) as [number, number, number, number]) : null,
    }
  })
  const tiepNoi = obj.tiep_noi != null && String(obj.tiep_noi).trim() ? stripYCon(String(obj.tiep_noi).trim()) : null
  return { meta, caus, tiepNoi }
}

// ── PHÂN LOẠI DẠNG (grounded theo chủ đề, 1 call/lô) → { ma_dang, confidence, ma_dang_2 } ──
export type ClassifyResult = { ma_dang: string | null; confidence: number; ma_dang_2: string | null }
const CLASSIFY_SCHEMA = { type: 'OBJECT', properties: { ket_qua: { type: 'ARRAY', items: {
  type: 'OBJECT', properties: { index: { type: 'NUMBER' }, ma_dang: { type: 'STRING' }, confidence: { type: 'NUMBER' }, ma_dang_2: { type: 'STRING' } }, required: ['index', 'ma_dang', 'confidence'],
} } }, required: ['ket_qua'] }
export function buildClassifyPrompt(caus: string[], cands: DangCandidate[]): string {
  const ds = cands.map((d) => `${d.ma_dang} | ${d.ten_dang} | Chuyên đề: ${d.ten_chuyen_de}${d.mo_ta_ngan ? ` | ${d.mo_ta_ngan}` : ''}`).join('\n')
  const qs = caus.map((c, i) => `[${i}] ${c.slice(0, 400)}`).join('\n')
  return [
    'Bạn là chuyên gia phân loại câu hỏi Toán theo BẢN ĐỒ KIẾN THỨC. Với MỖI câu, chọn MÃ DẠNG phù hợp nhất trong danh sách (chỉ trong danh sách này).',
    'DANH SÁCH DẠNG (ma_dang | tên | chuyên đề | định nghĩa):', ds,
    'CÁC CÂU:', qs,
    'Với mỗi câu trả: index, ma_dang (phù hợp nhất), confidence (0.0–1.0, độ chắc chắn), ma_dang_2 (ứng viên hợp lý thứ nhì — để trống nếu không có).',
    'Trả JSON: { "ket_qua": [ { "index":0, "ma_dang":"…", "confidence":0.0, "ma_dang_2":"…" } ] }',
  ].join('\n')
}
export async function classifyDang(caus: string[], cands: DangCandidate[], model?: string): Promise<ClassifyResult[]> {
  const out: ClassifyResult[] = caus.map(() => ({ ma_dang: null, confidence: 0, ma_dang_2: null }))
  if (!caus.length || !cands.length) return out
  const text = await callGeminiJson(buildClassifyPrompt(caus, cands), { model, think: 0, schema: CLASSIFY_SCHEMA })
  let obj: any; try { obj = lenientJsonParse(text.replace(/```(?:json)?|```/g, '').trim()) } catch { return out }
  const valid = new Set(cands.map((c) => c.ma_dang))
  for (const r of (obj?.ket_qua ?? []) as any[]) {
    const i = Number(r.index)
    if (!Number.isInteger(i) || i < 0 || i >= out.length) continue
    const ma = valid.has(String(r.ma_dang)) ? String(r.ma_dang) : null
    const ma2 = valid.has(String(r.ma_dang_2)) ? String(r.ma_dang_2) : null
    out[i] = { ma_dang: ma, confidence: Math.max(0, Math.min(1, Number(r.confidence) || 0)), ma_dang_2: ma2 }
  }
  return out
}

// ── VERIFY 1 câu (CHỈ chạy cho confidence thấp) bằng LÝ THUYẾT dạng → { khop, ma_dang_dung } ──
export type VerifyResult = { khop: boolean; ma_dang_dung: string | null; ghi_chu: string | null }
const VERIFY_SCHEMA = { type: 'OBJECT', properties: { khop: { type: 'BOOLEAN' }, ma_dang_dung: { type: 'STRING' }, ghi_chu: { type: 'STRING' } }, required: ['khop'] }
export async function verifyDangByLyThuyet(deBai: string, dangHienTai: DangCandidate, lyThuyet: string, cands: DangCandidate[], model?: string): Promise<VerifyResult> {
  if (!lyThuyet.trim()) return { khop: true, ma_dang_dung: null, ghi_chu: 'chưa có lý thuyết' } // không có lý thuyết → không chặn
  const ds = cands.map((d) => `${d.ma_dang} | ${d.ten_dang}`).join('\n')
  const prompt = [
    `Kiểm tra: câu hỏi dưới có ĐÚNG thuộc dạng "${dangHienTai.ten_dang}" (mã ${dangHienTai.ma_dang}) không, dựa trên ĐỊNH NGHĨA/LÝ THUYẾT của dạng đó.`,
    'LÝ THUYẾT DẠNG:', lyThuyet.slice(0, 4000),
    'CÂU HỎI:', deBai.slice(0, 800),
    'Nếu khớp → khop=true. Nếu KHÔNG khớp → khop=false, chọn ma_dang_dung phù hợp hơn trong danh sách:', ds,
    'Trả JSON: { "khop": true, "ma_dang_dung": "…", "ghi_chu": "…" }',
  ].join('\n')
  const text = await callGeminiJson(prompt, { model, think: 1024, schema: VERIFY_SCHEMA })
  let obj: any; try { obj = lenientJsonParse(text.replace(/```(?:json)?|```/g, '').trim()) } catch { return { khop: true, ma_dang_dung: null, ghi_chu: null } }
  const valid = new Set(cands.map((c) => c.ma_dang))
  const dung = valid.has(String(obj?.ma_dang_dung)) ? String(obj.ma_dang_dung) : null
  return { khop: !!obj?.khop, ma_dang_dung: dung, ghi_chu: String(obj?.ghi_chu ?? '').trim() || null }
}

// ── AI GIẢI 1 câu — ĐỌC lý thuyết dạng TRƯỚC (RAG), lời giải = nguon_giai 'ai' (cần duyệt) ──
const GIAI_SCHEMA = { type: 'OBJECT', properties: { loi_giai: { type: 'STRING' } }, required: ['loi_giai'] }
export async function aiGiaiCau(item: { noi_dung: string; loai_cau: string; dap_an: string | null; lua_chon: string[] | null }, lyThuyet: string, model?: string): Promise<string> {
  const prompt = [
    'Bạn là giáo viên Toán. HÃY GIẢI câu dưới, BÁM theo LÝ THUYẾT/PHƯƠNG PHÁP của dạng (nếu có) — trình bày từng bước, đúng & gọn.',
    lyThuyet.trim() ? '⚠ Đọc kỹ LÝ THUYẾT DẠNG rồi mới giải, dùng đúng phương pháp/ký hiệu của dạng:\n' + lyThuyet.slice(0, 4000) : '(Dạng chưa có lý thuyết — giải theo kiến thức chuẩn.)',
    'CÂU HỎI:', item.noi_dung,
    item.lua_chon?.length ? 'Phương án: ' + item.lua_chon.map((o, k) => `${'ABCD'[k]}. ${o}`).join(' | ') : '',
    item.dap_an ? `Đáp án đúng: ${item.dap_an} → giải thích để RA đúng đáp án này.` : '',
    FMT_RULES,
    'Trả JSON: { "loi_giai": "…" }',
  ].filter(Boolean).join('\n')
  const text = await callGeminiJson(prompt, { model, think: 8192, schema: GIAI_SCHEMA })
  let obj: any; try { obj = lenientJsonParse(text.replace(/```(?:json)?|```/g, '').trim()) } catch { return '' }
  return stripYCon(String(obj?.loi_giai ?? '').trim())
}

// ── LƯU 1 câu vào ĐÚNG dạng của nó (mỗi câu 1 dạng riêng) → trả ma_cau ──
export async function saveCauToDang(a: { dangChinh: string; loaiCau: string; noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon: string[] | null; anh_de: string | null; anh_dap_an: string | null; nguon_giai: string }, tbl: string): Promise<string> {
  const seq = await nextCauSeq(a.dangChinh, tbl)
  const c = await createCau({
    ma_cau: maCau(a.dangChinh, seq), dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: a.noi_dung, dap_an: a.dap_an, loi_giai: a.loi_giai, lua_chon: a.lua_chon ?? null,
    anh_de: a.anh_de ?? null, anh_dap_an: a.anh_dap_an ?? null, nguon: 'le', nguon_giai: a.nguon_giai,
  }, tbl)
  return c.ma_cau
}

// ── LOG gán dạng (precision@1 + nguồn vòng-học) — ghi lúc đẩy kho ──
export type TagLogRow = { mon: KhoMon; ma_cau: string | null; loai_field?: string; ai_value: string | null; final_value: string | null; ai_confidence?: number | null; da_verify?: boolean }
export async function logKhoTag(rows: TagLogRow[]): Promise<void> {
  if (!rows.length) return
  const { error } = await supabase.from('kho_tag_log').insert(rows.map((r) => ({
    mon: r.mon, ma_cau: r.ma_cau, loai_field: r.loai_field ?? 'dang',
    ai_value: r.ai_value, final_value: r.final_value, ai_confidence: r.ai_confidence ?? null, da_verify: r.da_verify ?? false,
  })))
  if (error) throw error
}
// precision@1 = (final = ai) / (tổng câu AI có đề xuất), field 'dang'.
export async function khoTagPrecision(mon: KhoMon): Promise<{ dung: number; tong: number; pct: number }> {
  const { data, error } = await supabase.from('kho_tag_log').select('ai_value, final_value').eq('mon', mon).eq('loai_field', 'dang').not('ai_value', 'is', null).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as { ai_value: string; final_value: string }[]
  const tong = rows.length
  const dung = rows.filter((r) => r.ai_value === r.final_value).length
  return { dung, tong, pct: tong ? Math.round((dung / tong) * 100) : 0 }
}

// ── KB4: ingest LÝ THUYẾT có hình — AI trả text + marker [[H1]].. đúng vị trí + bbox hình theo thứ tự ──
export type TheoryIngest = { noiDung: string; hinh: { box: [number, number, number, number] | null }[] }
export const THEORY_SCHEMA = {
  type: 'OBJECT',
  properties: {
    noi_dung: { type: 'STRING' },
    hinh: { type: 'ARRAY', items: { type: 'OBJECT', properties: { box: { type: 'ARRAY', items: { type: 'NUMBER' } } } } },
  },
  required: ['noi_dung'],
}
export function buildTheoryIngestPrompt(): string {
  return [
    'Đây là ẢNH 1 trang LÝ THUYẾT toán. Bóc TOÀN BỘ nội dung (định nghĩa/tính chất/ví dụ…) thành văn bản theo ĐÚNG thứ tự, đầy đủ, KHÔNG bịa thêm.',
    '⚠ Ở MỖI vị trí xuất hiện HÌNH VẼ/SƠ ĐỒ/ĐỒ THỊ, chèn marker [[H1]], [[H2]]… (đánh số theo thứ tự xuất hiện) ĐÚNG vị trí trong văn bản — KHÔNG mô tả hình bằng chữ, chỉ đặt marker. (Bảng số liệu KHÔNG phải hình → viết bằng LaTeX $\\begin{array}{…}…\\end{array}$.)',
    'Trường "hinh" = mảng theo ĐÚNG thứ tự H1,H2,…; mỗi phần tử { box:[ymin,xmin,ymax,xmax] } toạ độ CHUẨN HOÁ 0–1000 ôm TRỌN hình (chừa lề nhỏ).',
    FMT_RULES,
    'Trả JSON: { "noi_dung": "…văn bản có [[H1]]…", "hinh": [ { "box":[0,0,0,0] } ] }',
  ].join('\n')
}
export function parseTheoryIngest(text: string): TheoryIngest {
  let t = text.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any; try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const hinh = Array.isArray(obj.hinh) ? obj.hinh.map((h: any) => ({ box: Array.isArray(h?.box) && h.box.length === 4 ? (h.box.map(Number) as [number, number, number, number]) : null })) : []
  return { noiDung: String(obj.noi_dung ?? obj.noiDung ?? '').trim(), hinh }
}

// #câu theo dạng — ĐẾM Ở POSTGRES (RPC count_cau_by_dang, mig 0062, trả 1 dòng jsonb).
// KHÔNG group ở client nữa: fetch mọi câu bị PostgREST cap max-rows (~1000) → kho >1000 câu đếm CỤT → thẻ "0/50".
export async function countCauByDang(): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc('count_cau_by_dang', { p_tbl: 'dai_cau_hoi' })
  if (error) throw error
  return (data ?? {}) as Record<string, number>
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

// ════════════════════════════════════════════════════════════════
// TIỀN TỐ KHO — danh tính MÔN/NHÁNH nằm ngay trong mã (migration 202608141259).
// ════════════════════════════════════════════════════════════════
// Mã = <TIỀN TỐ> + khối(2) + chủ đề(2) + chuyên đề(2) + dạng(2), vd `T107010103`.
// TRƯỚC migration mã chỉ có phần vị trí (`07010103`) nên MỌI kho sinh cùng dải mã ⇒
// Toán và KHTN trùng 62 mã, và đo lường (`ma_dang` text trần, KHÔNG nhãn môn) gộp ô
// (HS × dạng) của hai môn vào nhau âm thầm. Tiền tố làm mã TỰ mang danh tính.
//
// ⚠ Tiền tố DÀI KHÁC NHAU (K = 1 ký tự, T1/T2/T3 = 2) ⇒ CẤM cắt mã bằng chỉ số tuyệt
// đối (`ma.slice(0,6)`). Mọi phép cắt theo vị trí phải đi qua `tachTienTo` bên dưới.
export type KhoKey = 'dai' | 'hinh' | 'hinhgt' | 'khtn'
export const KHO_TIEN_TO: Record<KhoKey, string> = { dai: 'T1', hinh: 'T2', hinhgt: 'T3', khtn: 'K' }
// V = Văn, A = Anh — để dành, chưa có kho.
const RE_TIEN_TO = /^(T[123]|K|V|A)(?=[0-9])/
/** Tách mã thành (tiền tố kho, phần vị trí). Mã cũ chưa có tiền tố → tienTo = ''. */
export function tachTienTo(ma: string): { tienTo: string; vt: string } {
  const m = RE_TIEN_TO.exec(ma)
  return m ? { tienTo: m[1], vt: ma.slice(m[1].length) } : { tienTo: '', vt: ma }
}
/** Mã CHỦ ĐỀ chứa mã này (giữ tiền tố) — vd T107010103 → T10701. */
export const maChuDeCua = (ma: string) => { const { tienTo, vt } = tachTienTo(ma); return tienTo + vt.slice(0, 4) }
/** Mã CHUYÊN ĐỀ chứa mã này (giữ tiền tố) — vd T107010103 → T1070101. */
export const maChuyenDeCua = (ma: string) => { const { tienTo, vt } = tachTienTo(ma); return tienTo + vt.slice(0, 6) }
/** Số thứ tự tại một tầng (bỏ tiền tố) — vd (T1070103, 4) → '03'. */
export const soThuTuCua = (ma: string, from: number) => tachTienTo(ma).vt.slice(from)

// ── Sinh MÃ VỊ TRÍ (auto-suggest; người sửa được) ────────────────
// Mã chủ đề  = tiền tố + khối(2) + thứ tự(2)     vd Đại K7 → T10701
// Mã chuyên đề = mã chủ đề + thứ tự(2)           vd T1070101
// Mã dạng    = mã chuyên đề + thứ tự(2)          vd T107010103  (thứ tự TRONG chuyên đề)
// Append-only: thứ tự mới = max anh em + 1 (xoá để lại lỗ, không đánh lại số).
const pad2 = (n: number) => String(n).padStart(2, '0')
export const khoiCode = (khoi: string) => khoi.padStart(2, '0')
const maxOrd = (codes: string[], from: number): number => {
  // cắt trên PHẦN VỊ TRÍ, không phải mã thô — nếu không thì mã có tiền tố lệch 1-2 ký tự
  // và số thứ tự đọc ra sai ⇒ mã mới đè lên mã đang có.
  const ords = codes.map((c) => parseInt(soThuTuCua(c, from), 10)).filter((n) => Number.isFinite(n))
  return ords.length ? Math.max(...ords) : 0
}
export function suggestChuDeMa(khoi: string, tree: ChuDeNode[], tienTo = KHO_TIEN_TO.dai): string {
  return tienTo + khoiCode(khoi) + pad2(maxOrd(tree.map((c) => c.ma_chu_de), 2) + 1)
}
export function suggestChuyenDeMa(cdCode: string, chude: ChuDeNode | null): string {
  return cdCode + pad2(maxOrd((chude?.chuyenDes ?? []).map((x) => x.ma_chuyen_de), 4) + 1)
}
export function suggestDangMa(cdeCode: string, chuyende: ChuyenDeNode | null): string {
  return cdeCode + pad2(maxOrd((chuyende?.dangs ?? []).map((d) => d.ma_dang), 6) + 1)
}

// ════════════════════════════════════════════════════════════════
// SHAPE CHUNG cho mọi nhánh bản đồ (Đại + Hình đều 3 tầng phẳng).
// Component duyệt chỉ biết MapRow; api map qua lại cột DB thật của từng nhánh.
// ════════════════════════════════════════════════════════════════
export type MapRow = {
  leafMa: string                 // PK lá (ma_dang / ma_dang_hinh) — FK-target, phải ổn định
  khoi: string
  t1Ma: string; t1Ten: string    // tầng 1 (Chủ đề / Mảng)
  t2Ma: string; t2Ten: string    // tầng 2 (Chuyên đề / Loại câu hỏi)
  leafTen: string                // tên lá (Dạng / Dạng-hình)
  bac: string                    // bac_toi_thieu
  mucDo: number | null           // Đại có; Hình null (độ khó ở Bài, không ở node)
}
export type Tier2Node = { t2Ma: string; t2Ten: string; leaves: MapRow[] }
export type Tier1Node = { t1Ma: string; t1Ten: string; tier2s: Tier2Node[]; soLeaf: number }

export function groupMap(rows: MapRow[]): Tier1Node[] {
  const m = new Map<string, Tier1Node>()
  for (const r of rows) {
    let t1 = m.get(r.t1Ma)
    if (!t1) { t1 = { t1Ma: r.t1Ma, t1Ten: r.t1Ten, tier2s: [], soLeaf: 0 }; m.set(r.t1Ma, t1) }
    let t2 = t1.tier2s.find((x) => x.t2Ma === r.t2Ma)
    if (!t2) { t2 = { t2Ma: r.t2Ma, t2Ten: r.t2Ten, leaves: [] }; t1.tier2s.push(t2) }
    t2.leaves.push(r); t1.soLeaf++
  }
  return [...m.values()]
}
export function suggestT1Ma(khoi: string, tree: Tier1Node[], tienTo = KHO_TIEN_TO.dai): string {
  return tienTo + khoiCode(khoi) + pad2(maxOrd(tree.map((t) => t.t1Ma), 2) + 1)
}
export function suggestT2Ma(t1Code: string, t1: Tier1Node | null): string {
  return t1Code + pad2(maxOrd((t1?.tier2s ?? []).map((x) => x.t2Ma), 4) + 1)
}
export function suggestLeafMa(t2Code: string, t2: Tier2Node | null): string {
  return t2Code + pad2(maxOrd((t2?.leaves ?? []).map((d) => d.leafMa), 6) + 1)
}

// ── ĐẠI: map qua MapRow ──────────────────────────────────────────
export async function listDaiMap(khoi: string): Promise<MapRow[]> {
  const rows = await listDaiDang(khoi)
  return rows.map((r) => ({
    leafMa: r.ma_dang, khoi: r.khoi,
    t1Ma: r.ma_chu_de, t1Ten: r.ten_chu_de,
    t2Ma: r.ma_chuyen_de, t2Ten: r.ten_chuyen_de,
    leafTen: r.ten_dang, bac: r.bac_toi_thieu, mucDo: r.muc_do,
  }))
}
export async function createDaiMap(row: MapRow): Promise<void> {
  await createDaiDang({
    ma_dang: row.leafMa, khoi: row.khoi,
    ma_chu_de: row.t1Ma, ten_chu_de: row.t1Ten,
    ma_chuyen_de: row.t2Ma, ten_chuyen_de: row.t2Ten,
    ten_dang: row.leafTen, muc_do: row.mucDo ?? 3, bac_toi_thieu: row.bac,
  })
}
export async function updateDaiLeaf(leafMa: string, patch: { leafTen: string; bac: string; mucDo: number | null }): Promise<void> {
  await updateDaiDang(leafMa, { ten_dang: patch.leafTen, bac_toi_thieu: patch.bac, muc_do: patch.mucDo ?? undefined })
}
export const deleteDaiLeaf = (leafMa: string) => deleteDaiDang(leafMa)
export async function deleteDaiLeaves(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error } = await supabase.from('dai_ban_do').delete().in('ma_dang', leafMas)
  if (error) throw error
}
// Đổi TÊN chủ đề / chuyên đề (denormalize trong dai_ban_do — update mọi dòng cùng mã). KHÔNG đổi MÃ (mã là FK-target).
export async function renameDaiChuDe(khoi: string, maChuDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('dai_ban_do').update({ ten_chu_de: ten }).eq('khoi', khoi).eq('ma_chu_de', maChuDe)
  if (error) throw error
}
export async function renameDaiChuyenDe(maChuyenDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('dai_ban_do').update({ ten_chuyen_de: ten }).eq('ma_chuyen_de', maChuyenDe)
  if (error) throw error
}
// Xoá CẢ CỤM (chủ đề/chuyên đề) KÈM câu: xoá dai_cau_hoi trước (cascade tai_lieu_cau/bo_đề/parent), rồi dai_ban_do (cascade lý thuyết).
export async function deleteDaiCum(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error: e1 } = await supabase.from('dai_cau_hoi').update({ xoa_at: new Date().toISOString() }).in('dang_chinh', leafMas).is('xoa_at', null)
  if (e1) throw e1
  const { error: e2 } = await supabase.from('dai_ban_do').delete().in('ma_dang', leafMas)
  if (e2) throw e2
}

// ── LÝ THUYẾT: prompt bóc tài liệu (ảnh/PDF) → 1 khối text LaTeX (KHÔNG clone) ──
export function buildLyThuyetPrompt(a: { tenDang: string; ghiChu?: string }): string {
  return [
    'Bạn là trợ lý số hoá tài liệu toán. Bên dưới là tài liệu LÝ THUYẾT của một dạng bài (ảnh/PDF).',
    `Dạng: "${a.tenDang}".`,
    'Chép lại TOÀN BỘ phần lý thuyết / phương pháp / ví dụ mẫu thành MỘT chuỗi text có định dạng — GIỮ nguyên nội dung, KHÔNG tóm tắt, KHÔNG thêm bớt.',
    a.ghiChu ? `Ghi chú: ${a.ghiChu}` : '',
    '',
    'QUY TẮC:',
    '- Công thức toán DÙNG LaTeX trong $...$ (inline) hoặc $$...$$ (block). Phân số DÙNG \\\\dfrac (không \\\\frac).',
    '- Đề mục/tiêu đề để nguyên dòng; xuống dòng giữ bằng xuống dòng thật.',
    '- TÁCH mỗi ý/khối logic (mỗi Ví dụ, mỗi Quy tắc, mỗi Tính chất…) bằng MỘT DÒNG TRỐNG để khi in không bị xé ngang trang.',
    '- Nhãn đầu dòng (Ví dụ, Quy tắc, Lưu ý, Chú ý, Nhận xét, Định nghĩa, Định lý, Tính chất, Hệ quả, Phương pháp…) bọc **đậm**, vd: "**Ví dụ 1:** ...".',
    '- Nếu có BẢNG / ĐỒ THỊ / HÌNH VẼ: ghi "[hình]" + mô tả 1 dòng ngắn, KHÔNG vẽ lại bằng LaTeX.',
    '- Trong JSON: lệnh LaTeX PHẢI double backslash ("\\\\dfrac", "\\\\neq"); trích dẫn dùng nháy đơn; CHỈ trả JSON.',
    'Trả về JSON: { "noi_dung": "..." }',
  ].filter(Boolean).join('\n')
}
export function parseLyThuyetJson(text: string): string {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any
  try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  return String(obj.noi_dung ?? obj.noiDung ?? '').trim()
}

// ── OCR đề toán (ảnh clipboard/file) → text + LaTeX ──────────────
// Đề Hình hay có công thức/ký hiệu ($\triangle$, $\perp$, $AB^2 = BH\cdot BC$). Dán ảnh → AI chép chữ,
// công thức bọc $…$. CHỈ lấy CHỮ, bỏ qua hình vẽ (hình đề đính riêng, không nhờ AI vẽ). Tái dùng
// LYTHUYET_SCHEMA/parseLyThuyetJson (cùng shape { noi_dung }) — không đẻ schema mới cho việc y hệt.
export function buildOcrDePrompt(): string {
  return [
    'Ảnh dưới là một đoạn ĐỀ TOÁN (hình học, có thể chứa công thức/ký hiệu).',
    'Chép lại NGUYÊN VĂN phần CHỮ thành một chuỗi text — GIỮ đúng câu chữ, KHÔNG giải, KHÔNG tóm tắt, KHÔNG thêm bớt.',
    'QUY TẮC:',
    '- Ký hiệu/công thức toán DÙNG LaTeX trong $...$ — vd $\\triangle ABC$, $\\angle BAC = 90^\\circ$, $AB^2 = BH \\cdot BC$, $\\perp$, $\\parallel$, $\\widehat{ABC}$.',
    '- Giữ xuống dòng bằng xuống dòng thật.',
    '- Có HÌNH VẼ thì BỎ QUA hình (đừng mô tả) — chỉ lấy CHỮ của đề.',
    '- Trong JSON: lệnh LaTeX PHẢI double backslash ("\\\\triangle", "\\\\perp", "\\\\cdot"); CHỈ trả JSON.',
    'Trả về JSON: { "noi_dung": "..." }',
  ].join('\n')
}
export async function ocrDeTuAnh(file: { mimeType: string; dataBase64: string }): Promise<string> {
  const raw = await callGeminiJson(buildOcrDePrompt(), { schema: LYTHUYET_SCHEMA, files: [file] })
  return parseLyThuyetJson(raw)
}

// ── Ingest CẢ BÀI Hình (ảnh/PDF) → tách ĐỀ + LỜI GIẢI + HÌNH VẼ ────────────
// Up nguyên 1 bài rồi AI tách, thay vì điền tay từng ô. CHỮ (đề/lời giải) do Gemini đọc; HÌNH VẼ hình học
// AI KHÔNG vẽ lại được nhưng NHẬN DIỆN + KHOANH VÙNG được (box_hinh) — khuôn NGUYÊN pattern
// co_hinh/box_hinh đã chạy ổn ở kho Đại (buildKhoIngestPrompt/INGEST_KHO_SCHEMA) — caller (hinhUi.tsx
// IngestBaiButton) tự CẮT ảnh từ canvas DPI cao bằng bbox này (cropCanvasBox, không qua AI vẽ).
// ⭐ 08-20 (Thùy: "hệ thống tự nhận diện được Hình vẽ luôn — module này bên Đại có rồi"): thêm co_hinh/
// box_hinh/trang_hinh — trang_hinh vì 1 bài Hình có thể up NHIỀU trang/ảnh (khác Đại ingest-per-trang).
export const HINH_BAI_SCHEMA = { type: 'OBJECT', properties: {
  de_bai: { type: 'STRING' }, loi_giai: { type: 'STRING' },
  co_hinh: { type: 'BOOLEAN' },
  box_hinh: { type: 'ARRAY', items: { type: 'NUMBER' }, description: '[ymin,xmin,ymax,xmax] toạ độ CHUẨN HOÁ 0-1000 ôm trọn HÌNH VẼ HÌNH HỌC trên ảnh/trang chứa nó — chỉ điền khi co_hinh=true.' },
  trang_hinh: { type: 'NUMBER', description: 'Số thứ tự ảnh/trang (đếm từ 0, theo đúng thứ tự file được đưa vào) chứa hình vẽ đó — chỉ điền khi co_hinh=true.' },
}, required: ['de_bai'] }
export function buildIngestBaiHinhPrompt(): string {
  return [
    'Ảnh/PDF dưới là MỘT BÀI TOÁN HÌNH HỌC hoàn chỉnh (gồm ĐỀ, có thể kèm LỜI GIẢI, có thể nhiều trang/ảnh).',
    'TÁCH thành các phần, chép NGUYÊN VĂN phần CHỮ — GIỮ đúng câu chữ, KHÔNG tóm tắt, KHÔNG thêm bớt:',
    '- "de_bai": toàn bộ ĐỀ (giả thiết + câu hỏi/yêu cầu). Đề nhiều ý (a, b, c) giữ đủ.',
    '- "loi_giai": toàn bộ LỜI GIẢI / chứng minh nếu có; KHÔNG có thì để "".',
    'QUY TẮC:',
    '- Ký hiệu/công thức DÙNG LaTeX trong $...$ — vd $\\triangle ABC$, $\\angle BAC=90^\\circ$, $AB^2=BH\\cdot BC$, $\\perp$, $\\parallel$. Phân số \\\\dfrac.',
    '- Giữ xuống dòng bằng xuống dòng thật; mỗi ý/bước một dòng.',
    '- Có HÌNH VẼ HÌNH HỌC (tam giác/tứ giác/đường tròn/hình không gian…) thì ĐỪNG chép chữ mô tả hình, ĐỪNG vẽ lại — chỉ đánh dấu vị trí: "co_hinh"=true + "box_hinh"=[ymin,xmin,ymax,xmax] toạ độ CHUẨN HOÁ 0-1000 ôm SÁT hình vẽ đó (không ôm chữ đề xung quanh) + "trang_hinh" = ảnh/trang thứ mấy (đếm từ 0) chứa nó. Nhiều hình trong 1 bài (đề + lời giải đều có hình) thì chỉ lấy hình CỦA ĐỀ BÀI (hình đầu tiên, dùng để hiểu giả thiết). Không có hình nào → "co_hinh"=false, bỏ qua "box_hinh"/"trang_hinh".',
    '- Nhiều trang/ảnh: gộp CHỮ theo đúng thứ tự.',
    '- Trong JSON: lệnh LaTeX PHẢI double backslash ("\\\\triangle", "\\\\perp", "\\\\cdot", "\\\\dfrac"); CHỈ trả JSON.',
    'Trả về JSON: { "de_bai": "...", "loi_giai": "...", "co_hinh": false, "box_hinh": null, "trang_hinh": null }',
  ].join('\n')
}
export async function ingestBaiHinh(files: GeminiFile[]): Promise<{ de_bai: string; loi_giai: string; co_hinh: boolean; box_hinh: [number, number, number, number] | null; trang_hinh: number }> {
  const raw = await callGeminiJson(buildIngestBaiHinhPrompt(), { schema: HINH_BAI_SCHEMA, files })
  let t = raw.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  const obj = lenientJsonParse(t)
  const box = Array.isArray(obj.box_hinh) && obj.box_hinh.length === 4 ? (obj.box_hinh.map(Number) as [number, number, number, number]) : null
  return {
    de_bai: String(obj.de_bai ?? obj.deBai ?? '').trim(), loi_giai: String(obj.loi_giai ?? obj.loiGiai ?? '').trim(),
    co_hinh: !!obj.co_hinh && !!box, box_hinh: box, trang_hinh: Number(obj.trang_hinh ?? 0) || 0,
  }
}

// ── SINH BIẾN THỂ HÌNH (đổi số) — clone TỪ TEXT bài gốc, giống engine clone bên Đại (buildCloneFromGocPrompt) ──
// Khác Đại: hình học KHÔNG vẽ lại được bằng AI → biến thể DÙNG LẠI hình gốc. Vì vậy CHỈ đổi CON SỐ, GIỮ NGUYÊN
// cấu hình hình + tên điểm (đổi tên điểm là kiểu "thay điểm" riêng). Nếu số nằm TRÊN hình → người phải vẽ lại (UI cảnh báo).
export function buildSinhBienTheHinhPrompt(a: { de: string; loiGiai: string; ghiChu?: string }): string {
  const gocText = [
    'BÀI GỐC (người ra đề đã chốt — biến thể phải bám ĐÚNG bài này):',
    `de_bai: ${a.de}`,
    `loi_giai: ${a.loiGiai || '(chưa có lời giải — tự giải theo đúng phương pháp chuẩn của bài)'}`,
  ].join('\n')
  return [
    'Bạn là chuyên gia ra đề toán HÌNH HỌC THCS.',
    '',
    gocText,
    '',
    'NHIỆM VỤ: Sinh 1 BIẾN THỂ của bài gốc — CÙNG logic, CHỈ KHÁC SỐ LIỆU. Trả ĐÚNG 1 đề + 1 lời giải.',
    '',
    '⚠ RÀNG BUỘC BÁM BÀI GỐC (tuân thủ TUYỆT ĐỐI — quan trọng nhất):',
    '- BÁM SÁT bài gốc: GIỮ NGUYÊN cấu trúc câu hỏi, phương pháp giải, SỐ BƯỚC và THỨ TỰ bước của lời giải. Lời giải biến thể phải SONG ÁNH từng bước với gốc, chỉ khác con số.',
    '- ⚠ CHỈ thay CON SỐ (độ dài đoạn, số đo góc, diện tích…). TUYỆT ĐỐI GIỮ NGUYÊN: tên các điểm/ký hiệu ($A,B,C,H,M$…), cấu hình hình học (loại tam giác, quan hệ vuông góc / song song / thẳng hàng / trung điểm…). Đổi tên điểm là việc KHÁC — ở đây KHÔNG đổi.',
    '- ⚠ Biến thể DÙNG LẠI HÌNH VẼ của bài gốc → cấu hình hình PHẢI y hệt gốc, chỉ số đo khác. KHÔNG đổi hình dạng/tương quan khiến hình cũ không còn đúng.',
    '- CẤM: thêm bước, bớt bước, đổi cách giải, thêm/bớt dữ kiện hay câu hỏi, diễn giải dài hơn gốc.',
    '- SỐ LIỆU mới phải cho KẾT QUẢ ĐẸP (số nguyên hoặc căn/phân số tối giản đơn giản giống gốc), CÙNG độ khó & CÙNG độ lớn. Ra số lẻ/xấu thì THỬ bộ số khác cho tới khi đẹp.',
    '- Nếu bài gốc THUẦN chứng minh (không có giá trị số nào để đổi) → GIỮ NGUYÊN đề, chỉ trả lại y hệt.',
    a.ghiChu ? `- ⚠ GHI CHÚ NGƯỜI RA ĐỀ = RÀNG BUỘC CỨNG, ưu tiên CAO NHẤT: ${a.ghiChu}` : '',
    '',
    FMT_RULES,
    '',
    'Trả về JSON: { "de_bai": "...", "loi_giai": "..." }',
  ].filter(Boolean).join('\n')
}
export async function sinhBienTheHinh(goc: { de: string; loiGiai: string | null }, ghiChu?: string): Promise<{ de_bai: string; loi_giai: string }> {
  const raw = await callGeminiJson(
    buildSinhBienTheHinhPrompt({ de: goc.de, loiGiai: goc.loiGiai ?? '', ghiChu: ghiChu?.trim() || undefined }),
    { model: 'gemini-2.5-flash', think: 8192, schema: HINH_BAI_SCHEMA }, // generation → bật suy luận (giống clone Đại)
  )
  let t = raw.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  const obj = lenientJsonParse(t)
  return { de_bai: String(obj.de_bai ?? obj.deBai ?? '').trim(), loi_giai: String(obj.loi_giai ?? obj.loiGiai ?? '').trim() }
}

// ── ĐỔI ĐỈNH bằng AI: GIỮ NGUYÊN số + logic + cấu hình, CHỈ đổi TÊN các điểm sang bộ khác, nhất quán ──
// Khác relabel regex (doiDiem chỉ đổi trong $…$): AI đổi cả nhãn ngoài $ và tự chọn bộ đỉnh mới. Hình DÙNG LẠI gốc → nhãn điểm trên hình phải sửa (UI cảnh báo).
export function buildDoiDinhHinhPrompt(a: { de: string; loiGiai: string; ghiChu?: string }): string {
  const gocText = [
    'BÀI GỐC (người ra đề đã chốt):',
    `de_bai: ${a.de}`,
    `loi_giai: ${a.loiGiai || '(chưa có lời giải — tự giải theo đúng phương pháp chuẩn của bài)'}`,
  ].join('\n')
  return [
    'Bạn là chuyên gia ra đề toán HÌNH HỌC THCS.',
    '',
    gocText,
    '',
    'NHIỆM VỤ: Sinh 1 biến thể "ĐỔI ĐỈNH" — GIỮ NGUYÊN mọi số liệu, cấu hình hình và phương pháp giải; CHỈ ĐỔI TÊN các điểm/đỉnh sang bộ ký hiệu KHÁC. Trả 1 đề + 1 lời giải.',
    '',
    '⚠ RÀNG BUỘC (tuân thủ TUYỆT ĐỐI):',
    '- ĐỔI TÊN mọi điểm sang bộ chữ KHÁC (vd $A,B,C,H \\to M,N,P,K$). NHẤT QUÁN: một điểm cũ ↦ đúng MỘT điểm mới ở MỌI chỗ trong đề + lời giải, kể cả trong lẫn ngoài $…$.',
    '- GIỮ NGUYÊN TUYỆT ĐỐI: mọi con số / số đo, cấu hình hình (loại tam giác, vuông góc / song song / thẳng hàng / trung điểm…), SỐ BƯỚC & THỨ TỰ lời giải. KHÔNG đổi số, KHÔNG đổi logic, KHÔNG thêm/bớt dữ kiện.',
    '- Bộ đỉnh mới phải KHÁC bộ cũ và không trùng ký hiệu đang dùng cho mục đích khác (đơn vị, biến số).',
    '- KHÔNG đổi chữ KHÔNG phải tên điểm (đơn vị cm, ký hiệu $^\\circ$, tên đại lượng…).',
    a.ghiChu ? `- ⚠ GHI CHÚ NGƯỜI RA ĐỀ = RÀNG BUỘC CỨNG, ưu tiên CAO NHẤT: ${a.ghiChu}` : '',
    '',
    FMT_RULES,
    '',
    'Trả về JSON: { "de_bai": "...", "loi_giai": "..." }',
  ].filter(Boolean).join('\n')
}
export async function doiDinhHinh(goc: { de: string; loiGiai: string | null }, ghiChu?: string): Promise<{ de_bai: string; loi_giai: string }> {
  const raw = await callGeminiJson(
    buildDoiDinhHinhPrompt({ de: goc.de, loiGiai: goc.loiGiai ?? '', ghiChu: ghiChu?.trim() || undefined }),
    { model: 'gemini-2.5-flash', think: 8192, schema: HINH_BAI_SCHEMA },
  )
  let t = raw.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  const obj = lenientJsonParse(t)
  return { de_bai: String(obj.de_bai ?? obj.deBai ?? '').trim(), loi_giai: String(obj.loi_giai ?? obj.loiGiai ?? '').trim() }
}

// ── ĐỔI ĐỈNH CẢ CHUỖI (một LỨA) — N bài nối tiền đề, đổi đỉnh bằng ĐÚNG MỘT map điểm cho cả chuỗi ──
// Vì cả chuỗi CHUNG một hình: điểm A ở câu 1 và câu 3 phải đổi thành CÙNG một tên. Đổi từng câu riêng =
// mỗi câu một bộ điểm → ghép a,b,c vô nghĩa. Gộp 1 call để AI chốt 1 map dùng chung.
// ⭐ 08-20 (Thùy: "sao hệ thống tự đẻ ra chữ Chứng minh vậy, t nhập/AI trả gì thì hiện đúng thế, không
// được tự sinh"): TRƯỚC gộp giả thiết+câu hỏi vào 1 field "de_bai" rồi lúc hiển thị lứa lại DÒ chữ
// "Chứng minh" để cắt ngược ra 2 phần (`tachDe`) — hỏng ngay khi câu hỏi gốc không có chữ đó (vd "Tính
// …") hoặc AI không tự thêm lại. Đổi hẳn: AI trả "giai_thiet"/"cau_hoi" TÁCH RIÊNG — không phải NỐI rồi
// CẮT NGƯỢC, khỏi cần đoán mốc chữ nào cả. Client tự ghép lại bằng `ghepDeBai` (SoanTaiLieu.tsx, mốc kỹ
// thuật do CLIENT chèn — không nhờ AI "nhớ giữ").
export const HINH_CHUOI_ITEM_SCHEMA = { type: 'OBJECT', properties: {
  giai_thiet: { type: 'STRING', description: 'CHỈ phần giả thiết (không kèm câu hỏi) sau khi đổi đỉnh — để trống nếu câu này không có giả thiết riêng.' },
  cau_hoi: { type: 'STRING', description: 'CHỈ phần câu hỏi/yêu cầu sau khi đổi đỉnh — GIỮ NGUYÊN VĂN cách hỏi gốc (không tự thêm chữ "Chứng minh" hay bất kỳ chữ nào khác nếu gốc không có), không kèm giả thiết.' },
  loi_giai: { type: 'STRING' },
}, required: ['cau_hoi'] }
export const HINH_CHUOI_SCHEMA = { type: 'OBJECT', properties: { cau: { type: 'ARRAY', items: HINH_CHUOI_ITEM_SCHEMA } }, required: ['cau'] }
export function buildDoiDinhChuoiPrompt(cau: { ma: string; giaThiet: string; cauHoi: string; loiGiai: string }[], ghiChu?: string): string {
  const list = cau.map((c, i) => [`--- Câu ${i + 1} (${c.ma}) ---`, `giai_thiet: ${c.giaThiet || '(không có riêng)'}`, `cau_hoi: ${c.cauHoi}`, `loi_giai: ${c.loiGiai || '(tự giải theo phương pháp chuẩn)'}`].join('\n')).join('\n\n')
  return [
    'Bạn là chuyên gia ra đề toán HÌNH HỌC THCS.',
    `Dưới đây là ${cau.length} bài toán NỐI TIẾP trong MỘT chuỗi — CÙNG một hình, ý sau dùng kết quả ý trước. Mỗi câu đã tách sẵn "giai_thiet" (giả thiết riêng, có thể trống) và "cau_hoi" (yêu cầu):`,
    '',
    list,
    '',
    `NHIỆM VỤ: Sinh biến thể "ĐỔI ĐỈNH" cho CẢ ${cau.length} câu — GIỮ NGUYÊN số liệu, cấu hình hình, logic; CHỈ đổi TÊN các điểm. Trả riêng "giai_thiet"/"cau_hoi" đã đổi tên — ĐỪNG gộp chung, ĐỪNG tự thêm/bớt chữ nào ngoài việc đổi tên điểm (câu hỏi gốc viết sao thì giữ nguyên cách viết đó, kể cả không có chữ "Chứng minh").`,
    '',
    `⚠ RÀNG BUỘC QUAN TRỌNG NHẤT — MỘT BỘ ĐIỂM DUY NHẤT cho cả ${cau.length} câu:`,
    '- Chọn MỘT map đổi tên điểm (vd $A,B,C,H \\to M,N,P,K$) rồi áp Y HỆT cho MỌI câu. Điểm $A$ ở câu 1 và câu 3 PHẢI đổi thành CÙNG một tên. TUYỆT ĐỐI KHÔNG mỗi câu một bộ điểm khác nhau.',
    '- Một điểm cũ ↦ đúng MỘT điểm mới, nhất quán toàn chuỗi (đề + lời giải, trong lẫn ngoài $…$).',
    '- GIỮ NGUYÊN: mọi số / số đo, cấu hình hình, số bước & thứ tự lời giải từng câu. KHÔNG đổi số, KHÔNG đổi logic, KHÔNG thêm/bớt.',
    `- Giữ ĐÚNG thứ tự & số lượng: mảng "cau" có ĐÚNG ${cau.length} phần tử, phần tử i ứng với câu i ở trên.`,
    ghiChu ? `- ⚠ GHI CHÚ NGƯỜI RA ĐỀ = RÀNG BUỘC CỨNG, ưu tiên CAO NHẤT: ${ghiChu}` : '',
    '',
    FMT_RULES,
    '',
    `Trả về JSON: { "cau": [ ĐÚNG ${cau.length} phần tử dạng { "giai_thiet": "...", "cau_hoi": "...", "loi_giai": "..." } ] }`,
  ].filter(Boolean).join('\n')
}
export async function doiDinhChuoiHinh(cau: { ma: string; giaThiet: string; cauHoi: string; loiGiai: string }[], ghiChu?: string): Promise<{ giai_thiet: string; cau_hoi: string; loi_giai: string }[]> {
  const raw = await callGeminiJson(buildDoiDinhChuoiPrompt(cau, ghiChu?.trim() || undefined), { model: 'gemini-2.5-flash', think: 8192, schema: HINH_CHUOI_SCHEMA })
  let t = raw.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  const obj = lenientJsonParse(t)
  const arr = Array.isArray(obj.cau) ? obj.cau : []
  return arr.map((x: any) => ({
    giai_thiet: String(x.giai_thiet ?? x.giaThiet ?? '').trim(),
    cau_hoi: String(x.cau_hoi ?? x.cauHoi ?? '').trim(),
    loi_giai: String(x.loi_giai ?? x.loiGiai ?? '').trim(),
  }))
}

// ── NHẬP LỨA ĐÃ CLONE SẴN (ảnh/PDF) — Thùy 08-20: "hệ thống chưa clone được 1 chuỗi hoàn chỉnh, t tự
// clone bên ngoài, muốn NHẬP lại + tự khớp vào chuỗi gốc". Khác doiDinhChuoiHinh (AI TỰ SINH text, chỉ đổi
// tên điểm) — đây là NGƯỜI đã tự làm ra bản clone thật (đổi số/đổi hình/đổi gì cũng được), AI CHỈ ĐỌC +
// KHỚP từng ý vào ĐÚNG bài gốc trong chuỗi (không tự bịa nội dung) — khuôn ingest, không phải sinh.
// Khớp theo "ma" (khoá tự nhiên) — không theo VỊ TRÍ/thứ tự in (CLAUDE.md §2 "danh tính bám khoá tự
// nhiên"): bản clone có thể thiếu/thừa/đảo thứ tự so với chuỗi gốc, AI phải tự đối chiếu NỘI DUNG.
// ⭐ 08-20 (Thùy: "không được tự sinh ra cái gì hết"): "giai_thiet"/"cau_hoi" TÁCH RIÊNG, KHÔNG gộp vào
// 1 "de_bai" rồi cắt ngược bằng mốc chữ (xem lý do y hệt ở doiDinhChuoiHinh phía trên).
export const INGEST_LUA_CHUOI_ITEM_SCHEMA = { type: 'OBJECT', properties: {
  khop_voi_ma: { type: 'STRING', description: 'Mã bài GỐC (lấy NGUYÊN trong ngoặc [ ] ở danh sách đối chiếu) mà Ý NÀY khớp nội dung/logic/vị trí trong chuỗi nhất.' },
  giai_thiet: { type: 'STRING', description: 'CHỈ phần giả thiết dùng chung (đã đổi số/đổi tên theo bản clone) — không kèm câu hỏi.' },
  cau_hoi: { type: 'STRING', description: 'CHỈ phần câu hỏi/yêu cầu riêng của ý này — CHÉP NGUYÊN VĂN cách hỏi trong ảnh (không tự thêm chữ "Chứng minh" hay chữ nào khác nếu ảnh không viết vậy), không kèm giả thiết.' },
  loi_giai: { type: 'STRING' },
}, required: ['khop_voi_ma', 'cau_hoi'] }
export const INGEST_LUA_CHUOI_SCHEMA = { type: 'OBJECT', properties: {
  y: { type: 'ARRAY', items: INGEST_LUA_CHUOI_ITEM_SCHEMA },
  co_hinh: { type: 'BOOLEAN' },
  box_hinh: { type: 'ARRAY', items: { type: 'NUMBER' }, description: '[ymin,xmin,ymax,xmax] toạ độ CHUẨN HOÁ 0-1000 ôm trọn HÌNH VẼ dùng chung cho cả chuỗi (thường chỉ 1 hình ở đầu) — chỉ điền khi co_hinh=true.' },
  trang_hinh: { type: 'NUMBER', description: 'Số thứ tự ảnh/trang (đếm từ 0) chứa hình đó — chỉ điền khi co_hinh=true.' },
}, required: ['y'] }
export function buildIngestLuaChuoiPrompt(chuoiGoc: { ma: string; phat_bieu: string }[]): string {
  const list = chuoiGoc.map((c) => `[${c.ma}] ${c.phat_bieu}`).join('\n')
  return [
    'Ảnh/PDF dưới là MỘT CHUỖI bài toán hình học đã được CLONE (đổi số/đổi tên điểm/vẽ lại…) từ một chuỗi',
    'GỐC cho bên dưới — thường trình bày dạng: 1 hình vẽ + 1 giả thiết CHUNG, rồi các ý a), b), c)… nối',
    'tiếp nhau (ý sau dùng kết quả ý trước), có thể kèm lời giải từng ý.',
    '',
    `CHUỖI GỐC (${chuoiGoc.length} bài — CHỈ dùng để KHỚP nội dung/logic, đây KHÔNG phải đề trong ảnh):`,
    list,
    '',
    'NHIỆM VỤ: tách ảnh/PDF thành từng Ý, mỗi ý khớp với ĐÚNG 1 bài gốc ở trên qua "khop_voi_ma":',
    '- Khớp theo LOGIC/NỘI DUNG/VỊ TRÍ trong chuỗi (ý đầu thường ≈ bài đầu chuỗi, ý dùng kết quả ý trước ≈',
    '  bài có tiền đề là bài trước nó…) — KHÔNG máy móc theo đúng thứ tự in nếu nội dung cho thấy khác.',
    '- Ảnh/PDF có thể clone THIẾU vài bài gốc hoặc THỪA ý ngoài chuỗi — cứ trả đúng những gì đọc được,',
    '  ĐỪNG bịa ý cho đủ số, ĐỪNG gán ép một ý vào bài không khớp.',
    'QUY TẮC chép chữ (mỗi "giai_thiet"/"cau_hoi"/"loi_giai"):',
    '- Chép NGUYÊN VĂN — GIỮ đúng câu chữ ảnh viết, KHÔNG thêm/bớt/diễn giải lại (kể cả không thêm chữ',
    '  "Chứng minh"/"Tính"… nếu ảnh không có sẵn chữ đó ở đầu câu hỏi).',
    '- Ký hiệu/công thức DÙNG LaTeX trong $...$; phân số \\\\dfrac. Giữ xuống dòng thật; mỗi bước 1 dòng.',
    '- Có HÌNH VẼ HÌNH HỌC dùng chung cho cả chuỗi (thường vẽ 1 lần ở đầu): "co_hinh"=true + "box_hinh"',
    '  ôm sát hình + "trang_hinh" = ảnh/trang thứ mấy (đếm từ 0) chứa nó. Không có → "co_hinh"=false.',
    '- Trong JSON: lệnh LaTeX PHẢI double backslash; CHỈ trả JSON.',
    'Trả về JSON: { "y": [ { "khop_voi_ma":"...", "giai_thiet":"...", "cau_hoi":"...", "loi_giai":"..." } ], "co_hinh":false, "box_hinh":null, "trang_hinh":null }',
  ].join('\n')
}
export async function ingestLuaChuoiHinh(files: GeminiFile[], chuoiGoc: { ma: string; phat_bieu: string }[]): Promise<{
  y: { khop_voi_ma: string; giai_thiet: string; cau_hoi: string; loi_giai: string }[]
  co_hinh: boolean; box_hinh: [number, number, number, number] | null; trang_hinh: number
}> {
  const raw = await callGeminiJson(buildIngestLuaChuoiPrompt(chuoiGoc), { schema: INGEST_LUA_CHUOI_SCHEMA, files })
  let t = raw.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  const obj = lenientJsonParse(t)
  const box = Array.isArray(obj.box_hinh) && obj.box_hinh.length === 4 ? (obj.box_hinh.map(Number) as [number, number, number, number]) : null
  const y = (Array.isArray(obj.y) ? obj.y : []).map((x: any) => ({
    khop_voi_ma: String(x.khop_voi_ma ?? x.khopVoiMa ?? '').trim(),
    giai_thiet: String(x.giai_thiet ?? x.giaThiet ?? '').trim(),
    cau_hoi: String(x.cau_hoi ?? x.cauHoi ?? '').trim(),
    loi_giai: String(x.loi_giai ?? x.loiGiai ?? '').trim(),
  })).filter((x: any) => x.khop_voi_ma && x.cau_hoi)
  return { y, co_hinh: !!obj.co_hinh && !!box, box_hinh: box, trang_hinh: Number(obj.trang_hinh ?? 0) || 0 }
}

// ── Lý thuyết đi kèm dạng Đại (1-1) + chuẩn completeness ──────────
export const CHUAN_SO_CAU = 50 // chuẩn kho: mỗi dạng ≥ 50 câu (sàn SỐ LƯỢNG, chỉnh 1 chỗ)
// noi_dung = nội dung lý thuyết (text + LaTeX); file_url/ten_file = đính kèm; khong_can = đánh dấu "không cần" (chỉ chuyên đề)
export type LyThuyet = { noi_dung: string; file_url: string | null; ten_file: string | null; khong_can?: boolean; cap_nhat_at?: string }

export async function listDaiLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('dai_dang_ly_thuyet').select('*').limit(LIMIT)
  if (error) throw error
  const m: Record<string, LyThuyet> = {}
  for (const r of data ?? []) m[r.ma_dang] = { noi_dung: r.noi_dung ?? '', file_url: r.file_url, ten_file: r.ten_file, cap_nhat_at: r.cap_nhat_at }
  return m
}
export async function upsertDaiLyThuyet(ma_dang: string, noi_dung: string, file_url: string | null, ten_file: string | null): Promise<void> {
  const { error } = await supabase.from('dai_dang_ly_thuyet')
    .upsert({ ma_dang, noi_dung, file_url, ten_file }, { onConflict: 'ma_dang' })
  if (error) throw error
}
export async function deleteDaiLyThuyet(ma_dang: string): Promise<void> {
  const { error } = await supabase.from('dai_dang_ly_thuyet').delete().eq('ma_dang', ma_dang)
  if (error) throw error
}
// Lý thuyết CHUNG cấp chuyên đề (Tier 2) — tuỳ chọn, khoá theo ma_chuyen_de
export async function listDaiChuyenDeLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('dai_chuyen_de_ly_thuyet').select('*').limit(LIMIT)
  if (error) throw error
  const m: Record<string, LyThuyet> = {}
  for (const r of data ?? []) m[r.ma_chuyen_de] = { noi_dung: r.noi_dung ?? '', file_url: r.file_url, ten_file: r.ten_file, khong_can: r.khong_can ?? false, cap_nhat_at: r.cap_nhat_at }
  return m
}
export async function upsertDaiChuyenDeLyThuyet(ma_chuyen_de: string, noi_dung: string, file_url: string | null, ten_file: string | null, khong_can = false): Promise<void> {
  const { error } = await supabase.from('dai_chuyen_de_ly_thuyet')
    .upsert({ ma_chuyen_de, noi_dung, file_url, ten_file, khong_can }, { onConflict: 'ma_chuyen_de' })
  if (error) throw error
}
export async function deleteDaiChuyenDeLyThuyet(ma_chuyen_de: string): Promise<void> {
  const { error } = await supabase.from('dai_chuyen_de_ly_thuyet').delete().eq('ma_chuyen_de', ma_chuyen_de)
  if (error) throw error
}

// ── HÌNH: bản đồ dạng-hình (hinh_ban_do) ─────────────────────────
export async function listHinhMap(khoi: string): Promise<MapRow[]> {
  const { data, error } = await supabase
    .from('hinh_ban_do').select('*')
    .eq('khoi', khoi)
    .order('ma_mang').order('ma_loai_ch').order('ma_dang_hinh')
    .limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    leafMa: r.ma_dang_hinh, khoi: r.khoi,
    t1Ma: r.ma_mang, t1Ten: r.ten_mang,
    t2Ma: r.ma_loai_ch, t2Ten: r.ten_loai_ch,
    leafTen: r.ten_dang, bac: r.bac_toi_thieu, mucDo: null,
  }))
}
export async function createHinhMap(row: MapRow): Promise<void> {
  const { error } = await supabase.from('hinh_ban_do').insert({
    ma_dang_hinh: row.leafMa, khoi: row.khoi,
    ma_mang: row.t1Ma, ten_mang: row.t1Ten,
    ma_loai_ch: row.t2Ma, ten_loai_ch: row.t2Ten,
    ten_dang: row.leafTen, bac_toi_thieu: row.bac,
  })
  if (error) throw error
}
export async function updateHinhLeaf(leafMa: string, patch: { leafTen: string; bac: string }): Promise<void> {
  const { error } = await supabase.from('hinh_ban_do')
    .update({ ten_dang: patch.leafTen, bac_toi_thieu: patch.bac }).eq('ma_dang_hinh', leafMa)
  if (error) throw error
}
export async function deleteHinhLeaf(leafMa: string): Promise<void> {
  const { error } = await supabase.from('hinh_ban_do').delete().eq('ma_dang_hinh', leafMa)
  if (error) throw error
}
export async function deleteHinhLeaves(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error } = await supabase.from('hinh_ban_do').delete().in('ma_dang_hinh', leafMas)
  if (error) throw error
}
// #ý treo theo dạng-hình — TRẢ RỖNG từ 2026-07-24.
// Model Hình v3 (spec-kho-hinh-v3) bỏ cột `hinh_y.dang_hinh`: ý không còn trỏ thẳng dạng
// mà trỏ NODE lưới (`hinh_y.baitoan_id`), dạng gắn ở CÁCH GIẢI của node. Bản đồ dạng-hình
// cũ (`hinh_ban_do`, 87 dòng) giữ nguyên để tra cứu nhưng không còn ý nào treo vào nó.
export async function countYByDangHinh(): Promise<Record<string, number>> {
  return {}
}

// ── KHTN: bản đồ (clone shape Đại, bảng khtn_*) — 1 cây Chủ-đề→Chuyên-đề→Dạng, KHÔNG nhánh ──
export async function listKhtnMap(khoi: string): Promise<MapRow[]> {
  const { data, error } = await supabase.from('khtn_ban_do').select('*')
    .eq('khoi', khoi).order('ma_chu_de').order('ma_chuyen_de').order('ma_dang').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    leafMa: r.ma_dang, khoi: r.khoi, t1Ma: r.ma_chu_de, t1Ten: r.ten_chu_de,
    t2Ma: r.ma_chuyen_de, t2Ten: r.ten_chuyen_de, leafTen: r.ten_dang, bac: r.bac_toi_thieu, mucDo: r.muc_do,
  }))
}
export async function createKhtnMap(row: MapRow): Promise<void> {
  const { error } = await supabase.from('khtn_ban_do').insert({
    ma_dang: row.leafMa, khoi: row.khoi, ma_chu_de: row.t1Ma, ten_chu_de: row.t1Ten,
    ma_chuyen_de: row.t2Ma, ten_chuyen_de: row.t2Ten, ten_dang: row.leafTen, muc_do: row.mucDo ?? 3, bac_toi_thieu: row.bac,
  })
  if (error) throw error
}
export async function updateKhtnLeaf(leafMa: string, patch: { leafTen: string; bac: string; mucDo: number | null }): Promise<void> {
  const { error } = await supabase.from('khtn_ban_do').update({ ten_dang: patch.leafTen, bac_toi_thieu: patch.bac, muc_do: patch.mucDo ?? undefined }).eq('ma_dang', leafMa)
  if (error) throw error
}
export const deleteKhtnLeaf = async (leafMa: string) => { const { error } = await supabase.from('khtn_ban_do').delete().eq('ma_dang', leafMa); if (error) throw error }
export async function deleteKhtnLeaves(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error } = await supabase.from('khtn_ban_do').delete().in('ma_dang', leafMas); if (error) throw error
}
export async function deleteKhtnCum(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error: e1 } = await supabase.from('khtn_cau_hoi').update({ xoa_at: new Date().toISOString() }).in('dang_chinh', leafMas).is('xoa_at', null); if (e1) throw e1
  const { error: e2 } = await supabase.from('khtn_ban_do').delete().in('ma_dang', leafMas); if (e2) throw e2
}
export async function renameKhtnChuDe(khoi: string, maChuDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('khtn_ban_do').update({ ten_chu_de: ten }).eq('khoi', khoi).eq('ma_chu_de', maChuDe); if (error) throw error
}
export async function renameKhtnChuyenDe(maChuyenDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('khtn_ban_do').update({ ten_chuyen_de: ten }).eq('ma_chuyen_de', maChuyenDe); if (error) throw error
}
export async function countCauByDangKhtn(): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc('count_cau_by_dang', { p_tbl: 'khtn_cau_hoi' })
  if (error) throw error
  return (data ?? {}) as Record<string, number>
}
export async function listKhtnLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('khtn_dang_ly_thuyet').select('*').limit(LIMIT); if (error) throw error
  const m: Record<string, LyThuyet> = {}; for (const r of data ?? []) { const x = r as any; m[x.ma_dang] = { noi_dung: x.noi_dung ?? '', file_url: x.file_url, ten_file: x.ten_file, cap_nhat_at: x.cap_nhat_at } } return m
}
export async function upsertKhtnLyThuyet(ma_dang: string, noi_dung: string, file_url: string | null, ten_file: string | null): Promise<void> {
  const { error } = await supabase.from('khtn_dang_ly_thuyet').upsert({ ma_dang, noi_dung, file_url, ten_file }, { onConflict: 'ma_dang' }); if (error) throw error
}
export async function deleteKhtnLyThuyet(ma_dang: string): Promise<void> {
  const { error } = await supabase.from('khtn_dang_ly_thuyet').delete().eq('ma_dang', ma_dang); if (error) throw error
}
export async function listKhtnChuyenDeLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('khtn_chuyen_de_ly_thuyet').select('*').limit(LIMIT); if (error) throw error
  const m: Record<string, LyThuyet> = {}; for (const r of data ?? []) { const x = r as any; m[x.ma_chuyen_de] = { noi_dung: x.noi_dung ?? '', file_url: x.file_url, ten_file: x.ten_file, khong_can: x.khong_can ?? false, cap_nhat_at: x.cap_nhat_at } } return m
}
export async function upsertKhtnChuyenDeLyThuyet(ma_chuyen_de: string, noi_dung: string, file_url: string | null, ten_file: string | null, khong_can = false): Promise<void> {
  const { error } = await supabase.from('khtn_chuyen_de_ly_thuyet').upsert({ ma_chuyen_de, noi_dung, file_url, ten_file, khong_can }, { onConflict: 'ma_chuyen_de' }); if (error) throw error
}
export async function deleteKhtnChuyenDeLyThuyet(ma_chuyen_de: string): Promise<void> {
  const { error } = await supabase.from('khtn_chuyen_de_ly_thuyet').delete().eq('ma_chuyen_de', ma_chuyen_de); if (error) throw error
}

// ── HÌNH GIẢI TÍCH (hgt_*): clone shape Đại, nhánh thứ 3 của Toán (Đại/Hình/Hình-giải-tích) — lượng
// giác, sau này Oxy/Oxyz. Tư duy như Đại (chia chuyên đề/dạng) chứ không mô-hình/DAG như Hình tổng hợp.
// `tai_lieu.mon` của tài liệu Hình giải tích vẫn 'Toán' (RBAC/billing sạch) — phân biệt qua `tai_lieu.nhanh`.
export async function listHgtMap(khoi: string): Promise<MapRow[]> {
  const { data, error } = await supabase.from('hgt_ban_do').select('*')
    .eq('khoi', khoi).order('ma_chu_de').order('ma_chuyen_de').order('ma_dang').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    leafMa: r.ma_dang, khoi: r.khoi, t1Ma: r.ma_chu_de, t1Ten: r.ten_chu_de,
    t2Ma: r.ma_chuyen_de, t2Ten: r.ten_chuyen_de, leafTen: r.ten_dang, bac: r.bac_toi_thieu, mucDo: r.muc_do,
  }))
}
export async function createHgtMap(row: MapRow): Promise<void> {
  const { error } = await supabase.from('hgt_ban_do').insert({
    ma_dang: row.leafMa, khoi: row.khoi, ma_chu_de: row.t1Ma, ten_chu_de: row.t1Ten,
    ma_chuyen_de: row.t2Ma, ten_chuyen_de: row.t2Ten, ten_dang: row.leafTen, muc_do: row.mucDo ?? 3, bac_toi_thieu: row.bac,
  })
  if (error) throw error
}
export async function updateHgtLeaf(leafMa: string, patch: { leafTen: string; bac: string; mucDo: number | null }): Promise<void> {
  const { error } = await supabase.from('hgt_ban_do').update({ ten_dang: patch.leafTen, bac_toi_thieu: patch.bac, muc_do: patch.mucDo ?? undefined }).eq('ma_dang', leafMa)
  if (error) throw error
}
export const deleteHgtLeaf = async (leafMa: string) => { const { error } = await supabase.from('hgt_ban_do').delete().eq('ma_dang', leafMa); if (error) throw error }
export async function deleteHgtLeaves(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error } = await supabase.from('hgt_ban_do').delete().in('ma_dang', leafMas); if (error) throw error
}
export async function deleteHgtCum(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error: e1 } = await supabase.from('hgt_cau_hoi').update({ xoa_at: new Date().toISOString() }).in('dang_chinh', leafMas).is('xoa_at', null); if (e1) throw e1
  const { error: e2 } = await supabase.from('hgt_ban_do').delete().in('ma_dang', leafMas); if (e2) throw e2
}
export async function renameHgtChuDe(khoi: string, maChuDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('hgt_ban_do').update({ ten_chu_de: ten }).eq('khoi', khoi).eq('ma_chu_de', maChuDe); if (error) throw error
}
export async function renameHgtChuyenDe(maChuyenDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('hgt_ban_do').update({ ten_chuyen_de: ten }).eq('ma_chuyen_de', maChuyenDe); if (error) throw error
}
export async function countCauByDangHgt(): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc('count_cau_by_dang', { p_tbl: 'hgt_cau_hoi' })
  if (error) throw error
  return (data ?? {}) as Record<string, number>
}
export async function listHgtLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('hgt_dang_ly_thuyet').select('*').limit(LIMIT); if (error) throw error
  const m: Record<string, LyThuyet> = {}; for (const r of data ?? []) { const x = r as any; m[x.ma_dang] = { noi_dung: x.noi_dung ?? '', file_url: x.file_url, ten_file: x.ten_file, cap_nhat_at: x.cap_nhat_at } } return m
}
export async function upsertHgtLyThuyet(ma_dang: string, noi_dung: string, file_url: string | null, ten_file: string | null): Promise<void> {
  const { error } = await supabase.from('hgt_dang_ly_thuyet').upsert({ ma_dang, noi_dung, file_url, ten_file }, { onConflict: 'ma_dang' }); if (error) throw error
}
export async function deleteHgtLyThuyet(ma_dang: string): Promise<void> {
  const { error } = await supabase.from('hgt_dang_ly_thuyet').delete().eq('ma_dang', ma_dang); if (error) throw error
}
export async function listHgtChuyenDeLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('hgt_chuyen_de_ly_thuyet').select('*').limit(LIMIT); if (error) throw error
  const m: Record<string, LyThuyet> = {}; for (const r of data ?? []) { const x = r as any; m[x.ma_chuyen_de] = { noi_dung: x.noi_dung ?? '', file_url: x.file_url, ten_file: x.ten_file, khong_can: x.khong_can ?? false, cap_nhat_at: x.cap_nhat_at } } return m
}
export async function upsertHgtChuyenDeLyThuyet(ma_chuyen_de: string, noi_dung: string, file_url: string | null, ten_file: string | null, khong_can = false): Promise<void> {
  const { error } = await supabase.from('hgt_chuyen_de_ly_thuyet').upsert({ ma_chuyen_de, noi_dung, file_url, ten_file, khong_can }, { onConflict: 'ma_chuyen_de' }); if (error) throw error
}
export async function deleteHgtChuyenDeLyThuyet(ma_chuyen_de: string): Promise<void> {
  const { error } = await supabase.from('hgt_chuyen_de_ly_thuyet').delete().eq('ma_chuyen_de', ma_chuyen_de); if (error) throw error
}

// ── HÌNH v3 (spec-kho-hinh-v3): lưới mô hình + lưới bài toán nhỏ + kho bài vật lý ──
// Ở FILE RIÊNG `hinh.ts` cho dễ đọc; re-export tại đây để UI chỉ cần 1 cửa `kho/api`.
export * from './hinh'
export * from './hinhConfig'
