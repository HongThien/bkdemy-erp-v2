// BỐ CỤC LÀM SẴN cho bản đồ phiêu lưu 2D (Thùy 01/10 khuya: "làm sẵn bố cục 3–4–5…–10"). Toạ độ chuẩn hoá 0–1 trên khung 16:9
// (đúng tỉ lệ nền 1672×941 của Đơn 7). Đo 01/10: 2–10 chủ đề/khối · 1–8 chuyên đề/chủ đề · thường 3–10 dạng/chuyên đề ⇒ làm 1–12.
// Chỉ là HÌNH HỌC để vẽ (vị trí, kích thước, đường đi) — không có luật nghiệp vụ ở đây.

export type Diem = { x: number; y: number }
export const TI_LE = 1672 / 941 // rộng / cao của khung

// lệch nhẹ tất định (cùng mã luôn ra cùng chỗ) để bố cục không cứng như lưới
export function bam(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return (h >>> 0) / 4294967296 }
const lech = (s: string, k: number) => (bam(s) - 0.5) * 2 * k

// số phần tử mỗi hàng theo tổng số (hàng so le để nhìn tự nhiên)
const HANG: Record<number, number[]> = {
  1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 6: [3, 3], 7: [4, 3], 8: [4, 4], 9: [3, 3, 3], 10: [3, 4, 3], 11: [4, 4, 3], 12: [4, 4, 4],
}
function hangCua(n: number): number[] { if (HANG[n]) return HANG[n]; const r = Math.ceil(n / 4), ds: number[] = []; let con = n; for (let i = 0; i < r; i++) { const k = Math.ceil(con / (r - i)); ds.push(k); con -= k } return ds }

/** THẾ GIỚI: chỗ đặt n lục địa + cỡ tối đa (bề rộng, theo tỉ lệ khung) mỗi ô. `khoa` = mã lục địa (lệch tất định). */
export function boCucTheGioi(khoa: string[]): { diem: Diem; coToiDa: number }[] {
  const n = khoa.length, hang = hangCua(n), soHang = hang.length, maxHang = Math.max(...hang)
  const vungX = [0.09, 0.91], vungY = soHang === 1 ? [0.5, 0.5] : soHang === 2 ? [0.32, 0.74] : [0.2, 0.8]
  const oRong = (vungX[1] - vungX[0]) / maxHang, oCao = soHang === 1 ? 0.6 : (vungY[1] - vungY[0]) / (soHang - 1)
  const coToiDa = Math.min(oRong * 0.95, oCao * 1.18 / TI_LE, 0.3) // hộp vuông, đảo chiếm ~75% ⇒ hộp chồng nhẹ hàng kề vẫn không đè đất
  const kq: { diem: Diem; coToiDa: number }[] = []
  let i = 0
  hang.forEach((k, h) => {
    const y = soHang === 1 ? 0.52 : vungY[0] + h * oCao
    const rongHang = k * oRong, x0 = 0.5 - rongHang / 2 + oRong / 2 + (h % 2 ? oRong * 0.18 : -oRong * 0.18) * (k < maxHang ? 1 : 0)
    for (let j = 0; j < k; j++, i++) kq.push({ diem: { x: x0 + j * oRong + lech(khoa[i] + 'x', oRong * 0.1), y: y + lech(khoa[i] + 'y', 0.035) }, coToiDa })
  })
  return kq
}

/** Hệ số to/nhỏ của lục địa theo SỐ DẠNG (spec §4.5 "lục địa to nhỏ theo số dạng") — chỉ để vẽ: 0,72 (ít nhất) → 1 (nhiều nhất). */
export function heSoCo(soDang: number, ds: number[]): number {
  const lon = Math.max(1, ...ds), nho = Math.min(...ds)
  return lon === nho ? 0.9 : 0.72 + 0.28 * Math.sqrt((soDang - nho) / (lon - nho))
}

/** ĐƯỜNG UỐN KHÚC qua n điểm (mốc vùng / chặng): hàng ziczac trái→phải rồi vòng xuống phải→trái (rắn), n = 1–10+. */
export function boCucDuong(khoa: string[], vung = { x0: 0.1, x1: 0.9, y0: 0.24, y1: 0.82 }): Diem[] {
  const n = khoa.length
  const soHang = n <= 4 ? 1 : n <= 8 ? 2 : 3
  const moiHang = Math.ceil(n / soHang)
  const kq: Diem[] = []
  for (let i = 0; i < n; i++) {
    const h = Math.floor(i / moiHang), j = i % moiHang, kHang = Math.min(moiHang, n - h * moiHang)
    const t = kHang === 1 ? 0.5 : j / (kHang - 1)
    const tt = h % 2 ? 1 - t : t // hàng lẻ đi ngược ⇒ đường vòng như con rắn
    const yHang = soHang === 1 ? (vung.y0 + vung.y1) / 2 : vung.y0 + (h / (soHang - 1)) * (vung.y1 - vung.y0)
    const ziczac = soHang === 1 ? (j % 2 ? 0.12 : -0.12) : (j % 2 ? 0.05 : -0.05)
    kq.push({ x: vung.x0 + tt * (vung.x1 - vung.x0) + lech(khoa[i] + 'x', 0.02), y: yHang + ziczac + lech(khoa[i] + 'y', 0.02) })
  }
  return kq
}

/** Đường cong mượt (Catmull-Rom → Bézier) qua các điểm, toạ độ theo khung `w × h` — để vẽ SVG. */
export function duongCong(ds: Diem[], w: number, h: number): string {
  if (ds.length < 2) return ''
  const p = ds.map((d) => ({ x: d.x * w, y: d.y * h }))
  let s = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i], b = p[i], c = p[i + 1], d = p[i + 2] ?? c
    const c1 = { x: b.x + (c.x - a.x) / 6, y: b.y + (c.y - a.y) / 6 }, c2 = { x: c.x - (d.x - b.x) / 6, y: c.y - (d.y - b.y) / 6 }
    s += ` C${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`
  }
  return s
}

/** Hình lục địa TẠM (khi chưa có ảnh Đơn 7): đường viền khép kín lồi lõm tất định theo mã, trong hộp 100×100. */
export function vienTam(khoa: string): string {
  const n = 14, ds: Diem[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, r = 38 + lech(khoa + i, 9) + (i % 3 === 0 ? 4 : 0)
    ds.push({ x: 50 + Math.cos(a) * r * 1.12, y: 50 + Math.sin(a) * r * 0.86 })
  }
  ds.push(ds[0], ds[1], ds[2])
  const p = ds
  let s = `M${p[1].x.toFixed(1)},${p[1].y.toFixed(1)}`
  for (let i = 1; i < p.length - 2; i++) {
    const a = p[i - 1], b = p[i], c = p[i + 1], d = p[i + 2]
    s += ` C${(b.x + (c.x - a.x) / 6).toFixed(1)},${(b.y + (c.y - a.y) / 6).toFixed(1)} ${(c.x - (d.x - b.x) / 6).toFixed(1)},${(c.y - (d.y - b.y) / 6).toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`
  }
  return s + 'Z'
}
