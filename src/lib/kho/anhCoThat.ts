// Đọc KÍCH THƯỚC VẬT LÝ (mm) của ảnh PNG từ chunk pHYs (px/mét) — trình duyệt bỏ qua pHYs khi dựng <img>,
// nên ảnh "đúng cỡ thước" (vd scripts/kho/hinh-doan-thang-thuoc.mjs, 600 DPI) phải được đọc tay rồi đặt width bằng mm.
// Trả null nếu không phải PNG / không có pHYs theo mét / DPI nghi mặc định (≤ 96: ảnh chụp, không mang ý nghĩa cỡ thật).
const cache = new Map<string, number | null>()

export async function docCoThatMm(url: string): Promise<number | null> {
  if (cache.has(url)) return cache.get(url) ?? null
  let kq: number | null = null
  try {
    const r = await fetch(url)
    if (r.ok) kq = phanTichPng(new Uint8Array(await r.arrayBuffer()))
  } catch { /* CORS / mạng — coi như không đọc được */ }
  cache.set(url, kq)
  return kq
}

export function phanTichPng(b: Uint8Array): number | null {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10]
  if (b.length < 33 || sig.some((v, i) => b[i] !== v)) return null
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength)
  const wPx = dv.getUint32(16)
  let p = 8
  while (p + 12 <= b.length) {
    const len = dv.getUint32(p)
    const t = String.fromCharCode(b[p + 4], b[p + 5], b[p + 6], b[p + 7])
    if (t === 'pHYs' && b[p + 16] === 1) {
      const ppm = dv.getUint32(p + 8)
      if (ppm / 39.37 <= 96) return null // ≤ 96 dpi: không coi là cỡ thật
      return Math.round((wPx / ppm) * 1000 * 100) / 100
    }
    if (t === 'IDAT' || t === 'IEND') return null // pHYs phải đứng trước IDAT
    p += 12 + len
  }
  return null
}

const cacheGoc = new Map<string, number | null>()
/** Bề rộng GỐC của ảnh tính bằng mm: ảnh PNG mang DPI cỡ thật ⇒ theo DPI; còn lại ⇒ số pixel ở 96 dpi (đúng cách trình duyệt dựng). */
export async function coGocMm(url: string): Promise<number | null> {
  if (cacheGoc.has(url)) return cacheGoc.get(url) ?? null
  let mm = await docCoThatMm(url)
  if (!mm) {
    mm = await new Promise<number | null>((res) => {
      const im = new Image()
      im.onload = () => res(im.naturalWidth ? Math.round((im.naturalWidth / 96) * 25.4 * 100) / 100 : null)
      im.onerror = () => res(null)
      im.src = url
    })
  }
  cacheGoc.set(url, mm)
  return mm
}
