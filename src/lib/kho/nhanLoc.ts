// NHÃN LỌC ĐỘNG của kho (Thùy 23/11 — spec-kho-cau-hoi.md §14, mig 202611232047).
// Gán một nhãn bất kì (tên + màu) cho một BÀI trong kho; mỗi nhãn = một nút bật / tắt trên thanh lọc. Nhãn CHỈ để tìm bài:
// không vào mastery, không vào phân dạng, không đổi bài học / mô hình của bài, học sinh không đọc được.
// Đơn vị gán (mã gốc của bài — DB tự quy, client gửi mã nào của bài cũng được):
//   hinh_hoc   → HHB… (bài nhiều ý) · HHC… gốc (câu đơn và mọi bản sao của nó)
//   hinh_luyen → HLB… (bài kho)
// Mọi lệnh đọc / ghi là RPC (bảng kho_nhan_loc · kho_nhan_loc_gan không có policy ghi).
import { supabase } from '../supabase'
import { KHO_NHAN_LOC } from '../mon'

export type KhoNhan = keyof typeof KHO_NHAN_LOC
export type MauNhan = 'do' | 'cam' | 'vang' | 'luc' | 'ngoc' | 'lam' | 'tim' | 'xam'
// 8 màu ĐẬM, đủ tương phản với chữ trắng (Thùy 23/11: "nhãn đậm màu và chữ trắng"). Khoá = giá trị cột kho_nhan_loc.mau (CHECK ở DB).
export const MAU_NHAN: Record<MauNhan, { c: string; ten: string }> = {
  do: { c: '#dc2626', ten: 'Đỏ' }, cam: { c: '#ea580c', ten: 'Cam' }, vang: { c: '#ca8a04', ten: 'Vàng' }, luc: { c: '#16a34a', ten: 'Lục' },
  ngoc: { c: '#0d9488', ten: 'Ngọc' }, lam: { c: '#2563eb', ten: 'Lam' }, tim: { c: '#7c3aed', ten: 'Tím' }, xam: { c: '#52525b', ten: 'Xám' },
}
export const DS_MAU_NHAN = Object.keys(MAU_NHAN) as MauNhan[]

/** so_bai = số bài mang nhãn trong phạm vi đã hỏi (chỉ có nghĩa khi gọi kèm phạm vi) · tong = số bài mang nhãn theo từng kho. */
export type NhanLoc = { id: string; ten: string; mau: MauNhan; da_xoa: boolean; tao_boi: string | null; so_bai: number; tong: Partial<Record<KhoNhan, number>> }

const loi = (e: { message?: string }): never => { throw new Error(e.message ?? String(e)) }

/** Danh mục nhãn của bộ nhãn mà `kho` dùng. `phamVi` (hôm nay: mã bài học của kho Hình–Học) ⇒ kèm số bài mang nhãn trong phạm vi đó. */
export async function dsNhanLoc(kho: KhoNhan, phamVi?: string | null, caDaXoa = false): Promise<{ duocSua: boolean; nhan: NhanLoc[] }> {
  const b = KHO_NHAN_LOC[kho]
  const { data, error } = await supabase.rpc('fn_nhan_loc_ds', { p_mon: b.mon, p_nhanh: b.nhanh, p_kho: phamVi ? kho : null, p_pham_vi: phamVi ?? null, p_ca_da_xoa: caDaXoa })
  if (error) loi(error)
  const d = (data ?? {}) as { duoc_sua?: boolean; nhan?: NhanLoc[] }
  return { duocSua: !!d.duoc_sua, nhan: d.nhan ?? [] }
}
/** Tạo nhãn (tên đã có ⇒ DB trả nhãn đang có, không đẻ trùng). */
export async function taoNhanLoc(kho: KhoNhan, ten: string, mau: MauNhan): Promise<NhanLoc> {
  const b = KHO_NHAN_LOC[kho]
  const { data, error } = await supabase.rpc('fn_nhan_loc_tao', { p_mon: b.mon, p_nhanh: b.nhanh, p_ten: ten, p_mau: mau })
  if (error) loi(error)
  return { so_bai: 0, tong: {}, ...(data as Omit<NhanLoc, 'so_bai' | 'tong'>) }
}
/** Gán (bat) / gỡ một nhãn cho một hoặc nhiều bài. Trả mã gốc của các bài đã đổi — để màn vá tại chỗ. */
export async function ganNhanLoc(kho: KhoNhan, ma: string[], nhanId: string, bat: boolean): Promise<{ ma: string[]; doi: number }> {
  const { data, error } = await supabase.rpc('fn_nhan_loc_gan', { p_kho: kho, p_ma: ma, p_nhan: nhanId, p_bat: bat })
  if (error) loi(error)
  return data as { ma: string[]; doi: number }
}
/** Đổi tên / đổi màu — trưởng khối trở lên + quản trị (DB chặn). */
export async function suaNhanLoc(id: string, patch: { ten?: string; mau?: MauNhan }): Promise<Omit<NhanLoc, 'so_bai' | 'tong'>> {
  const { data, error } = await supabase.rpc('fn_nhan_loc_sua', { p_nhan: id, p_ten: patch.ten ?? null, p_mau: patch.mau ?? null })
  if (error) loi(error)
  return data as Omit<NhanLoc, 'so_bai' | 'tong'>
}
/** Xoá mềm (xoa) / khôi phục — trưởng khối trở lên + quản trị. Bài không mất gì; khôi phục là có lại nhãn. */
export async function xoaNhanLoc(id: string, xoa: boolean): Promise<Omit<NhanLoc, 'so_bai' | 'tong'>> {
  const { data, error } = await supabase.rpc('fn_nhan_loc_xoa', { p_nhan: id, p_xoa: xoa })
  if (error) loi(error)
  return data as Omit<NhanLoc, 'so_bai' | 'tong'>
}

/** Luật lọc (Thùy 23/11): bật nhiều nhãn = "và" — bài phải mang ĐỦ mọi nhãn đang bật. Dùng cho danh sách đã tải trọn (lọc phần đang hiện). */
export const duNhan = (cuaBai: readonly string[] | null | undefined, bat: readonly string[]): boolean => bat.every((id) => (cuaBai ?? []).includes(id))
