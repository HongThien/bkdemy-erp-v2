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

// Xáo CÂU trong đề: GIỮ NGUYÊN vị trí khối của từng dạng (thứ tự các dạng đúng như soạn — có chủ
// ý sư phạm: dạng dễ trước/khó sau, dạng liên quan đặt gần nhau), CHỈ xáo vị trí giữa các câu
// CÙNG 1 dạng với nhau (Thùy 17/08: "không trộn toàn bộ thứ tự, chỉ trộn các câu trong 1 dạng
// thôi"). Câu không có `ma_dang` (đề thi bóc từ nguồn ngoài, chưa gắn dạng) GIỮ NGUYÊN vị trí —
// không gộp chung 1 nhóm với nhau để xáo (§1.5 "thà bỏ trống còn hơn đánh sai": không có dạng thì
// không có căn cứ để coi là "cùng nhóm" với câu không-có-dạng khác).
export function seededPermByDang(items: { ma_dang?: string | null }[], seed: string): number[] {
  const n = items.length
  const result = new Array<number>(n)
  const groups = new Map<string, number[]>()
  items.forEach((it, i) => {
    const key = it.ma_dang ? `d:${it.ma_dang}` : `_:${i}` // không rõ dạng → nhóm riêng 1 câu, không xáo
    const g = groups.get(key)
    if (g) g.push(i); else groups.set(key, [i])
  })
  for (const [key, idxs] of groups) {
    // Vị trí (idxs) GIỮ NGUYÊN — chỉ đổi CÂU NÀO ngồi vào đúng các vị trí đó.
    const localPerm = seededPerm(idxs.length, `${seed}:${key}`)
    localPerm.forEach((localOrig, localPos) => { result[idxs[localPos]] = idxs[localOrig] })
  }
  return result
}
