// ============================================================================
// tuluyen.ts — TỰ LUYỆN (Thùy 18-20/08): mỗi ngày HS mở → hệ tự sinh 10 câu, làm thêm được
// tối đa 30/ngày. 40% ngẫu nhiên trong dạng ĐÃ HỌC · 60% trong dạng đang YẾU.
//
// KIẾN TRÚC: tái dùng NGUYÊN bai_test/bai_test_cau/bai_lam/bai_lam_cau (loai='tu_luyen',
// bai_test.hoc_sinh_id set — bài CÁ NHÂN, khác ET/BTVN dùng chung cả lớp). Chọn CÂU + snapshot
// chạy Ở SERVER (RPC `tu_luyen_sinh`, security definer — kho câu hỏi staff-only). Chọn DẠNG chạy
// Ở CLIENT bằng ĐÚNG `masteryOfDang` (gami/mastery.js) — KHÔNG bịa công thức SQL riêng; RPC
// `hs_dang_evals` chỉ trả dữ liệu thô (điểm đúng/sai CỦA CHÍNH HS, không nhạy cảm).
// Mastery hệ số (cấp 1 = trung tâm hệ số 1, cấp 3 = chỉ gộp view HS) do mastery.ts tự phân biệt
// qua `loai='tu_luyen'` khi build — KHÔNG xử ở đây (xem DEVLOG "còn treo" ngày viết file này).
// ============================================================================
import { supabase } from './supabase'
import { masteryOfDang, MASTERY_CONFIG } from '../gami/mastery.js'

const SO_CAU_MOI_LUOT = 10
const TRAN_NGAY = 30

export type TuLuyenHomNay = { baiTestId: string; soCau: number; daNop: boolean }

// Bài tự luyện CỦA HÔM NAY nếu đã có (mở lại, hoặc vừa "làm thêm" ở tab khác) — không tạo mới.
export async function timTuLuyenHomNay(mon: string): Promise<TuLuyenHomNay | null> {
  const { data: hocSinhId } = await supabase.rpc('my_hoc_sinh_id')
  if (!hocSinhId) return null
  const homNay = ngayVN()
  const { data: bt, error } = await supabase.from('bai_test').select('id, so_cau')
    .eq('hoc_sinh_id', hocSinhId).eq('mon', mon).eq('loai', 'tu_luyen').eq('ngay', homNay).limit(1)
  if (error) throw error
  const row = (bt as { id: string; so_cau: number }[])?.[0]
  if (!row) return null
  const { data: lam } = await supabase.from('bai_lam').select('trang_thai').eq('bai_test_id', row.id).limit(1)
  return { baiTestId: row.id, soCau: row.so_cau, daNop: (lam as { trang_thai: string }[])?.[0]?.trang_thai === 'da_nop' }
}

// Ngày hôm nay giờ VN dạng 'YYYY-MM-DD' — KHÔNG dùng toISOString()/new Date('...') (CLAUDE.md §2 cấm).
function ngayVN(): string {
  const vn = new Date(Date.now() + 7 * 3600000)
  return `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, '0')}-${String(vn.getUTCDate()).padStart(2, '0')}`
}

type RawEval = { ma_dang: string; value: number; t: string; src: 'et' | 'mt' | 'btvn' | 'bt' }

// 40% NGẪU NHIÊN trong dạng ĐÃ HỌC (toàn bộ, không giới hạn thời gian) · 60% trong dạng đang
// YẾU. Đọc "yếu" = NỬA DƯỚI khi xếp theo điểm mastery (không đòi dạng phải chính thức ở mức
// 'yeu' — nếu chưa dạng nào tệ tới mức đó thì vẫn cần 1 nhóm để rút, nửa dưới luôn có).
// Mỗi CÂU trong 10 câu là 1 lượt rút ĐỘC LẬP (không phải "6 dạng cố định + 4 dạng cố định") —
// nên 1 dạng có thể ra nhiều hơn 1 câu trong cùng đợt, đặc biệt khi HS mới học ít dạng.
export function chonDangTuLuyen(evals: RawEval[], soCau = SO_CAU_MOI_LUOT): string[] {
  const byDang = new Map<string, { value: number; t: string; src: RawEval['src'] }[]>()
  for (const e of evals) { const arr = byDang.get(e.ma_dang) ?? []; arr.push({ value: e.value, t: e.t, src: e.src }); byDang.set(e.ma_dang, arr) }
  const scored = [...byDang.entries()]
    .map(([ma, evs]) => ({ ma, m: masteryOfDang(evs, MASTERY_CONFIG) }))
    .filter((x): x is { ma: string; m: NonNullable<ReturnType<typeof masteryOfDang>> } => !!x.m)
  if (!scored.length) return [] // chưa có dữ liệu học tập nào — không suy đoán được gì để luyện
  scored.sort((a, b) => a.m.score - b.m.score) // yếu nhất trước
  const toanBo = scored.map((x) => x.ma)
  const yeu = toanBo.slice(0, Math.max(1, Math.ceil(toanBo.length / 2)))
  const out: string[] = []
  for (let i = 0; i < soCau; i++) {
    const pool = Math.random() < 0.6 ? yeu : toanBo
    out.push(pool[Math.floor(Math.random() * pool.length)])
  }
  return out
}

export type SinhTuLuyenKetQua = { baiTestId: string; them: number; tong: number }

// Sinh 1 đợt câu (mặc định 10, "làm thêm" cũng gọi lại đúng hàm này) — RPC tự cộng dồn/chặn trần.
export async function sinhTuLuyen(mon: string, soCau = SO_CAU_MOI_LUOT): Promise<SinhTuLuyenKetQua> {
  const { data: evals, error: e1 } = await supabase.rpc('hs_dang_evals', { p_mon: mon })
  if (e1) throw e1
  const dangs = chonDangTuLuyen((evals ?? []) as RawEval[], soCau)
  if (!dangs.length) throw new Error('Chưa có dữ liệu học tập nào để tự luyện — học vài buổi đã rồi quay lại nhé.')
  const { data, error: e2 } = await supabase.rpc('tu_luyen_sinh', { p_mon: mon, p_dangs: dangs })
  if (e2) throw e2
  return { baiTestId: data.bai_test_id, them: data.them, tong: data.tong }
}

export const TU_LUYEN_TRAN_NGAY = TRAN_NGAY
export const TU_LUYEN_SO_CAU_MOI_LUOT = SO_CAU_MOI_LUOT

// Môn HS đang học — cần đọc THẲNG qua RPC vì `lop`/`hoc_sinh_lop` staff-only (verify: HS SELECT
// hoc_sinh_lop → 0 dòng, không lỗi). Trước giờ app chỉ suy mon GIÁN TIẾP từ bai_test HS đang có
// (tests[0]?.mon) — HS cấp 1 (chỉ tự luyện, không ET/BTVN online) sẽ ra rỗng theo đường đó.
// Hiện thực tế 100% dữ liệu là 1 môn (Toán) — lấy phần tử đầu; nhiều môn thật thì cần chọn môn ở UI.
export async function monCuaHS(): Promise<string | null> {
  const { data, error } = await supabase.rpc('hs_mon_cua_toi')
  if (error) throw error
  return (data as string[] | null)?.[0] ?? null
}
