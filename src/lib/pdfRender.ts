// Render PDF/ảnh → canvas DPI cao + cắt vùng (bbox Gemini 0–1000). Dùng cho ingest (câu/lý thuyết).
import * as pdfjsLib from 'pdfjs-dist'
import './pdfWorker' // worker INLINE (hết lỗi fetch .mjs trên host/máy nhân sự)

const HI = 400 / 72   // 400 DPI (crop hình vector NÉT — mặc định nét hơn/bằng gốc, không để mờ; PNG lossless)
const GEM_W = 1300    // bề rộng ảnh GỬI Gemini (giảm token; bbox chuẩn hoá → độc lập cỡ. DPI cao ở trên KHÔNG tăng token)
const MAX_SRC = 4200  // trần canvas nguồn (A4@400dpi≈3308 < 4200 → không bị downscale, giữ đủ nét)

// File (mimeType+base64) → canvas[] ở DPI cao. PDF = mỗi trang 1 canvas; ảnh = 1 canvas.
export async function fileToCanvases(mimeType: string, dataBase64: string): Promise<HTMLCanvasElement[]> {
  if (mimeType === 'application/pdf') {
    const bytes = Uint8Array.from(atob(dataBase64), (c) => c.charCodeAt(0))
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
    const out: HTMLCanvasElement[] = []
    for (let p = 1; p <= pdf.numPages; p++) {
      const pg = await pdf.getPage(p)
      let vp = pg.getViewport({ scale: HI })
      if (vp.width > MAX_SRC) vp = pg.getViewport({ scale: HI * (MAX_SRC / vp.width) })
      const c = document.createElement('canvas'); c.width = Math.round(vp.width); c.height = Math.round(vp.height)
      await pg.render({ canvasContext: c.getContext('2d')!, viewport: vp }).promise
      out.push(c)
    }
    return out
  }
  const img = new Image()
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('Ảnh lỗi')); img.src = `data:${mimeType};base64,${dataBase64}` })
  const k = Math.min(1, MAX_SRC / img.naturalWidth)
  const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k)
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
  return [c]
}
// canvas → JPEG base64 (downscale) để gửi Gemini.
export function canvasToJpegBase64(c: HTMLCanvasElement, maxW = GEM_W): string {
  const k = Math.min(1, maxW / c.width)
  const t = document.createElement('canvas'); t.width = Math.round(c.width * k); t.height = Math.round(c.height * k)
  t.getContext('2d')!.drawImage(c, 0, 0, t.width, t.height)
  return t.toDataURL('image/jpeg', 0.85).split(',')[1]
}
// box Gemini [ymin,xmin,ymax,xmax] 0–1000 → dataURL PNG cắt từ canvas DPI cao.
// PAD: nới bbox 1 lề nhỏ (bbox AI hay ôm sát → cụt nhãn trục/mũi tên/số). Kẹp trong khung canvas.
export function cropCanvasBox(c: HTMLCanvasElement, box: [number, number, number, number], pad = 0.04): string {
  const [y0, x0, y1, x1] = box
  const bx0 = Math.min(x0, x1), bx1 = Math.max(x0, x1), by0 = Math.min(y0, y1), by1 = Math.max(y0, y1)
  const padX = (bx1 - bx0) * pad, padY = (by1 - by0) * pad
  const px0 = Math.max(0, bx0 - padX), px1 = Math.min(1000, bx1 + padX)
  const py0 = Math.max(0, by0 - padY), py1 = Math.min(1000, by1 + padY)
  const sx = Math.round(px0 / 1000 * c.width), sy = Math.round(py0 / 1000 * c.height)
  const sw = Math.round((px1 - px0) / 1000 * c.width), sh = Math.round((py1 - py0) / 1000 * c.height)
  const o = document.createElement('canvas'); o.width = Math.max(1, sw); o.height = Math.max(1, sh)
  o.getContext('2d')!.drawImage(c, sx, sy, sw, sh, 0, 0, o.width, o.height)
  return o.toDataURL('image/png')
}
