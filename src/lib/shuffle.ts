// Xáo trộn HIỂN THỊ ổn định theo (HS × bài × câu) — chống liếc bài khi làm test online.
// CHỈ đổi THỨ TỰ HIỂN THỊ; state/chấm luôn dùng chỉ số GỐC (orig) → KHÔNG đụng engine chấm
// (client gradeTracNghiem/gradeDungSai lẫn server et_nop đều so theo vị trí GỐC trong snapshot).
// Seed = chuỗi ổn định (hocSinhId+baiTestId[+cauId]) → cùng 1 HS mở lại bài vẫn thấy ĐÚNG thứ tự cũ
// (không xáo lại mỗi lần load), nhưng KHÁC giữa các HS → 2 bạn cạnh nhau nhìn màn hình khác nhau.
function seedNum(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
function mulberry32(a: number): () => number {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
// Hoán vị [0..n-1] xác định theo seed (Fisher-Yates + PRNG seed-able).
export function seededPerm(n: number, seed: string): number[] {
  const rnd = mulberry32(seedNum(seed))
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}
// Xáo mảng theo thứ tự HIỂN THỊ, giữ `orig` = index gốc để map ngược lúc ghi state/chấm.
export function seededShuffleWithOrig<T>(arr: T[], seed: string): { item: T; orig: number }[] {
  return seededPerm(arr.length, seed).map((orig) => ({ item: arr[orig], orig }))
}
