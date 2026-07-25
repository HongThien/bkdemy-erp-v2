// Ngưỡng/nhãn của nhánh HÌNH — spec-kho-hinh-v3 §1.1.
// PROVISIONAL: sửa Ở MỘT CHỖ, toàn kho tính lại (không rải số ma thuật trong component).

// cap (số tính chất phải CM trước nó, TOÀN CỤC) → độ khó 1..5.
export const NGUONG_DO_KHO: { do_kho: number; cap_tu: number; cap_den: number }[] = [
  { do_kho: 1, cap_tu: 1, cap_den: 2 },
  { do_kho: 2, cap_tu: 2, cap_den: 3 },
  { do_kho: 3, cap_tu: 3, cap_den: 4 },
  { do_kho: 4, cap_tu: 5, cap_den: 7 },
  { do_kho: 5, cap_tu: 8, cap_den: 99 },
]

/** Độ khó của một ý: tra ngưỡng từ `cap` của node; +1 bậc nếu cách giải có bổ đề (§1.1). */
export function mucDoTuCap(cap: number | null | undefined, coBoDe = false): number | null {
  if (cap == null) return null
  // Dải ngưỡng CHỒNG NHAU (cap 2 thuộc cả do_kho 1 và 2) — lấy khớp ĐẦU TIÊN để một cap
  // chỉ ra một độ khó, không nhập nhằng.
  const hit = NGUONG_DO_KHO.find((n) => cap >= n.cap_tu && cap <= n.cap_den)
  const base = hit ? hit.do_kho : NGUONG_DO_KHO[NGUONG_DO_KHO.length - 1].do_kho
  return Math.min(5, base + (coBoDe ? 1 : 0))
}

// Mã màu xuyên suốt nhánh Hình (spec §4): mô hình = teal · bài toán nhỏ = xanh dương
// · dạng = tím · bổ đề = hổ phách. Gu staff: clean/modern nhiều màu, KHÔNG sci-fi.
export const TONE = {
  mh: { bg: 'bg-teal-50', bd: 'border-teal-300', tx: 'text-teal-700', so: 'bg-teal-500', ring: 'ring-teal-400' },
  bt: { bg: 'bg-blue-50', bd: 'border-blue-300', tx: 'text-blue-700', so: 'bg-blue-500', ring: 'ring-blue-400' },
  dg: { bg: 'bg-violet-50', bd: 'border-violet-300', tx: 'text-violet-700', so: 'bg-violet-500', ring: 'ring-violet-400' },
  bd: { bg: 'bg-amber-50', bd: 'border-amber-300', tx: 'text-amber-700', so: 'bg-amber-500', ring: 'ring-amber-400' },
} as const
