// Ngày giờ VN dùng chung (trước nằm trong giaoviec-config.ts của hệ việc cũ đã xoá).
// Hôm nay 'YYYY-MM-DD' giờ VN.
export const todayVN = (): string => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })

// Số ngày lệch b − a (a,b = 'YYYY-MM-DD'); dương nếu b sau a. UTC-midnight (không TZ-drift), format tay.
export function soNgayLech(a: string, b: string): number {
  const pa = a.split('-').map(Number), pb = b.split('-').map(Number)
  return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000)
}
