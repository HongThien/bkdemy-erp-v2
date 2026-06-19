// Render PDF/ảnh → canvas DPI cao + cắt vùng (bbox Gemini 0–1000). Dùng cho ingest (câu/lý thuyết).
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const HI = 300 / 72   // 300 DPI (hình vector nét; in A4 sắc)
const GEM_W = 1300    // bề rộng ảnh gửi Gemini (giảm token; bbox chuẩn hoá nên không phụ thuộc cỡ)
const MAX_SRC = 3200  // chặn canvas nguồn quá to

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
export function cropCanvasBox(c: HTMLCanvasElement, box: [number, number, number, number]): string {
  const [y0, x0, y1, x1] = box
  const sx = Math.round(Math.min(x0, x1) / 1000 * c.width), sy = Math.round(Math.min(y0, y1) / 1000 * c.height)
  const sw = Math.round(Math.abs(x1 - x0) / 1000 * c.width), sh = Math.round(Math.abs(y1 - y0) / 1000 * c.height)
  const o = document.createElement('canvas'); o.width = Math.max(1, sw); o.height = Math.max(1, sh)
  o.getContext('2d')!.drawImage(c, sx, sy, sw, sh, 0, 0, o.width, o.height)
  return o.toDataURL('image/png')
}
