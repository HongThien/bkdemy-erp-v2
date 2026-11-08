// Tải BÀI ĐÃ CHẤM của 1 HS về máy TA để gửi phụ huynh (CEO 08/11/2026): gom các trang (bản chấm đỏ nếu có,
// không thì ảnh gốc đã xoay đúng chiều) thành 1 file PDF, hoặc tải từng ảnh. Chỉ ĐỌC ảnh — không ghi gì vào DB.
import type { BtvnNopAnh } from './btvnnop'

const safe = (s: string) => s.normalize('NFC').replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, '_')

// Ảnh 1 trang → canvas đã xoay đúng chiều (bản chấm đã đứng sẵn, ảnh gốc xoay theo `xoay`). Cạnh dài ≤ 2000px.
async function trangCanvas(a: BtvnNopAnh, url: string): Promise<HTMLCanvasElement> {
  const blob = await (await fetch(url)).blob()
  const bmp = await createImageBitmap(blob)
  const goc = a.path_cham ? 0 : ((a.xoay % 360) + 360) % 360
  const s = Math.min(1, 2000 / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * s), h = Math.round(bmp.height * s)
  const c = document.createElement('canvas')
  const ngang = goc === 90 || goc === 270
  c.width = ngang ? h : w; c.height = ngang ? w : h
  const g = c.getContext('2d')!
  g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height)
  g.translate(c.width / 2, c.height / 2); g.rotate((goc * Math.PI) / 180)
  g.drawImage(bmp, -w / 2, -h / 2, w, h)
  bmp.close?.()
  return c
}

const urlCua = (a: BtvnNopAnh, urls: Record<string, string>) => urls[a.path_cham ?? a.path]

export async function taoPdfBai(anh: BtvnNopAnh[], urls: Record<string, string>, ten: string): Promise<File> {
  const { jsPDF } = await import('jspdf')
  let pdf: InstanceType<typeof jsPDF> | null = null
  for (const a of anh) {
    const u = urlCua(a, urls)
    if (!u) continue
    const c = await trangCanvas(a, u)
    // khổ A4, ảnh vừa khít trong lề 5mm, giữ tỉ lệ
    const W = 210, H = 297, m = 5
    const k = Math.min((W - 2 * m) / c.width, (H - 2 * m) / c.height)
    const w = c.width * k, h = c.height * k
    if (!pdf) pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    else pdf.addPage('a4', 'portrait')
    pdf.addImage(c.toDataURL('image/jpeg', 0.85), 'JPEG', (W - w) / 2, (H - h) / 2, w, h)
  }
  if (!pdf) throw new Error('Chưa có ảnh nào để gom.')
  return new File([pdf.output('blob')], `${safe(ten)}.pdf`, { type: 'application/pdf' })
}

export async function taoAnhBai(anh: BtvnNopAnh[], urls: Record<string, string>, ten: string): Promise<File[]> {
  const out: File[] = []
  for (const [i, a] of anh.entries()) {
    const u = urlCua(a, urls)
    if (!u) continue
    const c = await trangCanvas(a, u)
    const blob = await new Promise<Blob>((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error('Không tạo được ảnh'))), 'image/jpeg', 0.88))
    out.push(new File([blob], `${safe(ten)}_trang${i + 1}.jpg`, { type: 'image/jpeg' }))
  }
  if (!out.length) throw new Error('Chưa có ảnh nào để tải.')
  return out
}

// Điện thoại có bảng chia sẻ (Zalo/Messenger…) thì mở bảng chia sẻ; không thì tải file xuống.
export const chiaSeDuoc = (files: File[]) => typeof navigator !== 'undefined' && !!navigator.canShare?.({ files })
export async function chiaSe(files: File[], tieuDe: string) { await navigator.share({ files, title: tieuDe }) }
export function taiXuong(files: File[]) {
  for (const f of files) {
    const u = URL.createObjectURL(f)
    const a = document.createElement('a')
    a.href = u; a.download = f.name
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(u), 10000)
  }
}
