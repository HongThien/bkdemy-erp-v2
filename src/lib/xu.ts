// Data-layer XU (seam) — sổ xu CHUNG `qlht_xu_ledger` (hệ quà của Hải; BK chỉ có 1 xu — Thùy chốt 08-29).
// Thùy 06/10: KHÔNG chốt theo tháng nữa — EXP (HS×môn×tháng) đổi ra xu REALTIME ở DB (`_xu_dong_bo`: đích =
// fn_gami_exp_xu_thang, ghi dòng chênh chot_thang/chot_lai, append-only). EXP giảm ⇒ trừ thật, ví được âm.
// Thùy 28/10: màn Chốt xu bỏ hẳn → màn Tổng kết xu (fn_xu_tong_ket) + nút ± phát sinh tay.
import { supabase } from './supabase'

const LIMIT = 10000

// ── ĐỒNG BỘ XU (Thùy 06/10: KHÔNG chốt theo tháng nữa — tính realtime). Thay hàm chotXu cũ (tính chênh ở
// client rồi insert — vi phạm §2.0). Toàn bộ "đích − đã phát → ghi chot_thang/chot_lai" chạy ở DB (`_xu_dong_bo`,
// khoá ví như tủ quà). Tự chạy: HS mở ví · pg_cron mỗi giờ (tháng trước + tháng này, từ 2026-09). Gọi tay ở đây:
//   hocSinhId null = mọi HS · ym null = cửa sổ mặc định; ym tường minh = đồng bộ đúng tháng đó (kể cả tháng 8 đóng băng).
// Người gọi: TuQuaScreen (đồng bộ nền trước khi đổi quà).
export async function dongBoXu(hocSinhId: string | null, ym: string | null): Promise<{ so_dong: number; tong_xu: number }> {
  const { data, error } = await supabase.rpc('fn_xu_dong_bo', { p_hoc_sinh_id: hocSinhId, p_thang: ym })
  if (error) throw error
  const r = (Array.isArray(data) ? data[0] : data) ?? { so_dong: 0, tong_xu: 0 }
  return { so_dong: Number(r.so_dong ?? 0), tong_xu: Number(r.tong_xu ?? 0) }
}

// ── PHÁT SINH TAY: cộng/trừ xu ngay tại màn Tổng kết xu (loai suy từ dấu — cong_tay ≥0, tru_tay <0).
// Ghi thẳng vào sổ chung qlht_xu_ledger (append-only, KHÔNG sửa/xoá dòng cũ — kiểu học phí).
export async function themPhatSinh(hocSinhId: string, amount: number, lyDo: string): Promise<void> {
  if (!amount) return
  const { data: au } = await supabase.auth.getUser()
  const { data: tk } = await supabase.from('tai_khoan').select('nhan_su_id').eq('id', au.user?.id ?? '').maybeSingle()
  const nsId = (tk as any)?.nhan_su_id
  if (!nsId) throw new Error('Tài khoản chưa gắn nhân sự — không ghi được sổ xu (nguoi_tao).')
  const { error } = await supabase.from('qlht_xu_ledger')
    .insert({ hoc_sinh_id: hocSinhId, loai: amount > 0 ? 'cong_tay' : 'tru_tay', amount, ly_do: lyDo || null, nguoi_tao: nsId })
  if (error) throw error
}

// ── TỔNG KẾT XU (Thùy 28/10 — thay màn Chốt xu): mỗi HS 1 dòng, xu theo NGUỒN. Mọi con số tính ở DB
// (fn_xu_tong_ket · fn_xu_tong_ket_tong, mig 202610281926) — client chỉ render/sort/lọc (§2.0).
// Cột từ EXP (et…thanh_tuu) = xu ĐÃ VÀO SỔ chia theo tỉ lệ nguồn (phần dư lớn nhất) ⇒ các cột cộng đúng = tong.
// ky null = từ 8/2026 tới nay. so_du luôn là số dư HIỆN TẠI (không theo kỳ).
export type XuTongKet = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null; trang_thai: string
  et: number; btvn: number; tren_lop: number; tham_du: number
  nhiem_vu: number; vong_quay: number; thanh_tuu: number; nong_trai: number
  giai_thuong: number; thay_co_cong: number; thay_co_tru: number; khac: number
  tong: number; da_tieu: number; so_du: number
}
export type XuTongKetTong = Omit<XuTongKet, 'hoc_sinh_id' | 'ho_ten' | 'ma_hs' | 'khoi' | 'lop' | 'trang_thai'> & { so_hs: number }
export async function listTongKetXu(ky: string | null): Promise<XuTongKet[]> {
  const { data, error } = await supabase.rpc('fn_xu_tong_ket', { p_thang: ky }).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as XuTongKet[]
}
export async function getTongKetXuHS(ky: string | null, hocSinhId: string): Promise<XuTongKet | null> {
  const { data, error } = await supabase.rpc('fn_xu_tong_ket', { p_thang: ky, p_hoc_sinh_id: hocSinhId })
  if (error) throw error
  return ((data ?? []) as XuTongKet[])[0] ?? null
}
export async function getTongKetXuTong(ky: string | null): Promise<XuTongKetTong | null> {
  const { data, error } = await supabase.rpc('fn_xu_tong_ket_tong', { p_thang: ky })
  if (error) throw error
  return ((data ?? []) as XuTongKetTong[])[0] ?? null
}
