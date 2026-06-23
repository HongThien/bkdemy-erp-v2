// Tuần BK + deadline — util THUẦN (giờ VN). KHÔNG toISOString()/new Date('YYYY-MM-DD') cho ngày local (§2).
// ĐN (Thùy chốt): Tuần 1 = 29/6/2026 (T2) → 5/7/2026 (CN); BK week = T2→CN; trước tuần 1 = "Tuần khởi động" (số ≤ 0).

const DAY = 86400000
const WEEK1_MONDAY_UTC = Date.UTC(2026, 5, 29) // 2026-06-29 = thứ Hai tuần 1 (mốc BK)

// 'YYYY-MM-DD' → epoch UTC 00:00 (CHỈ để tính chênh ngày — KHÔNG phải instant VN)
function ymdToUTC(ngay: string): number { const [y, m, d] = ngay.split('-').map(Number); return Date.UTC(y, m - 1, d) }
function utcToYmd(ms: number): string { const t = new Date(ms); return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}` }

export function homNayVN(): string { const vn = new Date(Date.now() + 7 * 3600000); return utcToYmd(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate())) }
export function congNgay(ngay: string, n: number): string { return utcToYmd(ymdToUTC(ngay) + n * DAY) }

export function tuanCuaNgay(ngay: string): number { return Math.floor((ymdToUTC(ngay) - WEEK1_MONDAY_UTC) / (7 * DAY)) + 1 }
export function khoangTuan(tuan: number): { tu: string; den: string } {
  const start = WEEK1_MONDAY_UTC + (tuan - 1) * 7 * DAY
  return { tu: utcToYmd(start), den: utcToYmd(start + 6 * DAY) }
}
const ddmm = (s: string) => { const [, m, d] = s.split('-'); return `${d}/${m}` }
export function nhanTuan(tuan: number): string {
  const { tu, den } = khoangTuan(tuan)
  return `${tuan <= 0 ? 'Tuần khởi động' : `Tuần ${tuan}`} (${ddmm(tu)}–${ddmm(den)})`
}

// instant VN (epoch ms) của ngày + giờ 'HH:MM' (VN = UTC+7 → UTC = VN − 7h)
export function vnInstant(ngay: string, gio: string): number {
  const [y, m, d] = ngay.split('-').map(Number); const [hh, mm] = gio.split(':').map(Number)
  return Date.UTC(y, m - 1, d, hh, mm) - 7 * 3600000
}

// ── Deadline: 3 mức màu, NGƯỠNG CHỈNH ĐƯỢC (sau gắn UI settings) ──
export type DeadlineMuc = 'qua_han' | 'sat' | 'gan' | 'con_nhieu'
export const NGUONG_DEADLINE = { satGio: 2, ganGio: 8 } // sát ≤2h · gần ≤8h · còn nhiều >8h (CHỈNH Ở ĐÂY)
export function mucDeadline(deadlineMs: number | null, now = Date.now()): DeadlineMuc | null {
  if (deadlineMs == null) return null
  const conLai = deadlineMs - now
  if (conLai < 0) return 'qua_han'
  const h = conLai / 3600000
  if (h <= NGUONG_DEADLINE.satGio) return 'sat'
  if (h <= NGUONG_DEADLINE.ganGio) return 'gan'
  return 'con_nhieu'
}
export function nhanConLai(deadlineMs: number | null, now = Date.now()): string {
  if (deadlineMs == null) return ''
  const qua = deadlineMs - now < 0
  let s = Math.abs(deadlineMs - now)
  const ngay = Math.floor(s / DAY); s -= ngay * DAY
  const h = Math.floor(s / 3600000); const m = Math.floor((s % 3600000) / 60000)
  const txt = ngay >= 1 ? `${ngay} ngày${h ? ` ${h}h` : ''}` : h >= 1 ? `${h}h${m ? ` ${m}p` : ''}` : `${m} phút`
  return qua ? `quá hạn ${txt}` : `còn ${txt}`
}
