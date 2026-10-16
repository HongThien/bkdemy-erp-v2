// thithucham.ts — CHẤM tự luận Thi thử (Ôn thi GK1 pha 4; spec-on-thi-gk1.md). Chỉ GỌI RPC (mig 202610161401): hàng đợi derive ở DB,
// điểm/"còn mấy câu chờ" do DB tính. Ảnh HS nộp ở bucket PRIVATE 'thi-thu-anh' → ký URL như lib/btvnnop.ts.
import { supabase } from './supabase'

export const THI_THU_ANH_BUCKET = 'thi-thu-anh'

export type BaiChoCham = {
  bai_lam_id: string; hoc_sinh_id: string; ma_hs: string | null; ho_ten: string
  de_id: string | null; de_ten: string | null; mon: string; khoi: string | null
  so_cau_cho: number; so_cau_tu_luan: number; nop_at: string | null
}
export type AnhThiThu = { id: string; path: string; thu_tu: number }
export type CauTuLuanCham = {
  bai_test_cau_id: string; thu_tu: number; phan: string | null
  noi_dung: string | null; anh_de: string | null
  dap_an: unknown; loi_giai: string | null; anh_dap_an: string | null
  diem_toi_da: number; da_cham: boolean; diem: number | null; nhan_xet: string | null
  anh: AnhThiThu[]
}
export type BaiChamChiTiet = {
  bai_lam_id: string; hoc_sinh_id: string; ma_hs: string | null; ho_ten: string
  de_ten: string | null; mon: string; khoi: string | null; nop_at: string | null; cho: number
  cau: CauTuLuanCham[]
}
export type KetQuaCham = { bai_test_cau_id: string; verdict: 'correct' | 'partial' | 'wrong'; diem: number; cho: number; xong: boolean; diem_10: number | null }

export async function listBaiChoCham(): Promise<BaiChoCham[]> {
  const { data, error } = await supabase.rpc('fn_thi_thu_cho_cham')
  if (error) throw error
  return (data ?? []) as BaiChoCham[]
}
export async function baiChamChiTiet(baiLamId: string): Promise<BaiChamChiTiet | null> {
  const { data, error } = await supabase.rpc('fn_thi_thu_cau_cho_cham', { p_bai_lam: baiLamId })
  if (error) throw error
  return (data ?? null) as BaiChamChiTiet | null
}
export async function chamTuLuan(baiLamId: string, cauId: string, diem: number, nhanXet: string | null): Promise<KetQuaCham> {
  const { data, error } = await supabase.rpc('fn_thi_thu_cham_tu_luan', { p_bai_lam: baiLamId, p_bai_test_cau: cauId, p_diem: diem, p_nhan_xet: nhanXet })
  if (error) throw error
  return data as KetQuaCham
}
export async function kyAnhThiThu(paths: string[]): Promise<Record<string, string>> {
  if (!paths.length) return {}
  const { data, error } = await supabase.storage.from(THI_THU_ANH_BUCKET).createSignedUrls(paths, 3600)
  if (error) throw error
  const out: Record<string, string> = {}
  for (const r of data ?? []) if (r.signedUrl && r.path) out[r.path] = r.signedUrl
  return out
}
