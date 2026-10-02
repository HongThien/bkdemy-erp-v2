// Tiện ích chung của game Đấu Từ.

/** RNG có seed (mulberry32) — để 2 máy dựng cùng bộ đề khi cần. */
export function taoRng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function tron<T>(ds: T[], rng: () => number = Math.random): T[] {
  const a = [...ds]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function chon<T>(ds: T[], rng: () => number = Math.random): T {
  return ds[Math.floor(rng() * ds.length)]
}

/** Ngày theo giờ VN dạng YYYY-MM-DD (CLAUDE §2: cấm toISOString cho ngày local). */
export function ngayVN(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}

export function chuoiNgauNhien(n = 24): string {
  const kt = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const b = new Uint8Array(n)
  crypto.getRandomValues(b)
  return Array.from(b, (x) => kt[x % kt.length]).join('')
}

export function maSo(n = 6): string {
  let s = String(1 + Math.floor(Math.random() * 9))
  while (s.length < n) s += String(Math.floor(Math.random() * 10))
  return s
}

export const kep = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x))

export function docLS<T>(khoa: string, macDinh: T): T {
  try {
    const s = localStorage.getItem(khoa)
    return s ? (JSON.parse(s) as T) : macDinh
  } catch {
    return macDinh
  }
}

export function ghiLS(khoa: string, gt: unknown) {
  try { localStorage.setItem(khoa, JSON.stringify(gt)) } catch { /* bộ nhớ đầy / chế độ riêng tư */ }
}

/** Store nhỏ có subscribe — đủ dùng cho game, không kéo Zustand vào bundle riêng. */
export function taoKho<T>(dau: T) {
  let gt = dau
  const nghe = new Set<(v: T) => void>()
  return {
    lay: () => gt,
    dat(v: T | ((cu: T) => T)) {
      gt = typeof v === 'function' ? (v as (cu: T) => T)(gt) : v
      nghe.forEach((f) => f(gt))
    },
    nghe(f: (v: T) => void) {
      nghe.add(f)
      return () => { nghe.delete(f) }
    },
  }
}
