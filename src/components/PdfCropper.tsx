// Công cụ CẮT HÌNH dùng chung: nạp PDF/ảnh → render trang ở DPI cao (hình vector nét) →
// người dùng kéo chuột khoanh vùng → cắt đúng vùng đó ở DPI cao → trả File PNG cho caller.
// Dùng cho: ảnh đề/đáp án của câu (ImageSlot) + (sau) chèn ảnh vào lý thuyết.
// KHÔNG tự upload — caller quyết đổ đi đâu (uploadKhoImage → cột anh_de / chèn markdown…).
import { useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const HI_DPI = 300        // DPI render để cắt — in A4 sắc nét; hình vector nét tuyệt đối ở DPI này
const MAX_SRC = 3200      // chặn canvas nguồn quá to (bộ nhớ)
const MAX_DISP_W = 860    // bề rộng canvas hiển thị (để kéo box thoải mái)

type Sel = { x: number; y: number; w: number; h: number }

export default function PdfCropper({ onClose, onCrop, title = 'Cắt hình từ PDF / ảnh' }: {
  onClose: () => void
  onCrop: (file: File) => void | Promise<void>
  title?: string
}) {
  const srcRef = useRef<HTMLCanvasElement | null>(null)   // canvas nguồn DPI cao (không hiển thị)
  const dispRef = useRef<HTMLCanvasElement | null>(null)  // canvas hiển thị (downscale từ nguồn)
  const pdfRef = useRef<any>(null)
  const dragRef = useRef<{ ox: number; oy: number } | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [hasSrc, setHasSrc] = useState(false)
  const [dispW, setDispW] = useState(0)
  const [dispH, setDispH] = useState(0)
  const [sel, setSel] = useState<Sel | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [hint, setHint] = useState('Chọn file PDF hoặc ảnh để bắt đầu.')

  const getSrc = () => (srcRef.current ??= document.createElement('canvas'))

  function paintDisplay() {
    const src = getSrc(), disp = dispRef.current
    if (!disp || !src.width) return
    const scale = Math.min(1, MAX_DISP_W / src.width)
    const w = Math.round(src.width * scale), h = Math.round(src.height * scale)
    disp.width = w; disp.height = h
    disp.getContext('2d')!.drawImage(src, 0, 0, w, h)
    setDispW(w); setDispH(h); setSel(null)
  }

  async function renderPdfPage(n: number) {
    const pdf = pdfRef.current; if (!pdf) return
    const pg = await pdf.getPage(n)
    let vp = pg.getViewport({ scale: HI_DPI / 72 })
    if (vp.width > MAX_SRC) vp = pg.getViewport({ scale: (HI_DPI / 72) * (MAX_SRC / vp.width) })
    const src = getSrc()
    src.width = Math.round(vp.width); src.height = Math.round(vp.height)
    await pg.render({ canvasContext: src.getContext('2d')!, viewport: vp }).promise
    setHasSrc(true); paintDisplay()
  }

  async function onFile(f: File | undefined) {
    if (!f) return
    setErr(null); setSel(null); setHint('Đang nạp…')
    try {
      if (f.type === 'application/pdf') {
        const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise
        pdfRef.current = pdf; setNumPages(pdf.numPages); setPage(1)
        await renderPdfPage(1)
        setHint(pdf.numPages > 1 ? `PDF ${pdf.numPages} trang — chuyển trang rồi kéo chuột khoanh vùng hình.` : 'Kéo chuột khoanh vùng hình.')
      } else if (f.type.startsWith('image/')) {
        pdfRef.current = null; setNumPages(0)
        const url = URL.createObjectURL(f)
        const img = new Image()
        await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('Ảnh lỗi')); img.src = url })
        const src = getSrc()
        const scale = Math.min(1, MAX_SRC / img.naturalWidth)
        src.width = Math.round(img.naturalWidth * scale); src.height = Math.round(img.naturalHeight * scale)
        src.getContext('2d')!.drawImage(img, 0, 0, src.width, src.height)
        URL.revokeObjectURL(url)
        setHasSrc(true); paintDisplay(); setHint('Kéo chuột khoanh vùng hình.')
      } else setErr('Chỉ nhận PDF hoặc ảnh.')
    } catch (e: any) { setErr(e?.message ?? String(e)); setHint('Chọn file PDF hoặc ảnh để bắt đầu.') }
  }

  async function goPage(n: number) { if (n >= 1 && n <= numPages) { setPage(n); await renderPdfPage(n) } }

  // Map con trỏ → toạ độ canvas NỘI TẠI bằng TỈ LỆ rect thật (chống lệch do zoom:1.15 ở #root:
  // clientX ở hệ viewport, rect.width đã bị zoom → phải chia rect.width chứ KHÔNG trừ thẳng).
  function pos(e: React.PointerEvent) {
    const c = dispRef.current!, r = c.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * c.width
    const y = ((e.clientY - r.top) / r.height) * c.height
    return { x: Math.max(0, Math.min(dispW, x)), y: Math.max(0, Math.min(dispH, y)) }
  }
  function down(e: React.PointerEvent) { if (!hasSrc) return; const p = pos(e); dragRef.current = { ox: p.x, oy: p.y }; setSel({ x: p.x, y: p.y, w: 0, h: 0 }); (e.target as Element).setPointerCapture(e.pointerId) }
  function move(e: React.PointerEvent) { const d = dragRef.current; if (!d) return; const p = pos(e); setSel({ x: Math.min(d.ox, p.x), y: Math.min(d.oy, p.y), w: Math.abs(p.x - d.ox), h: Math.abs(p.y - d.oy) }) }
  function up() { dragRef.current = null }

  async function cat() {
    const src = getSrc()
    if (!sel || sel.w < 6 || sel.h < 6) { setErr('Khoanh vùng hình trước (kéo chuột tạo khung).'); return }
    const ratio = src.width / dispW   // hiển thị → nguồn DPI cao
    const sx = Math.round(sel.x * ratio), sy = Math.round(sel.y * ratio)
    const sw = Math.round(sel.w * ratio), sh = Math.round(sel.h * ratio)
    const out = document.createElement('canvas'); out.width = sw; out.height = sh
    out.getContext('2d')!.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh)
    const blob: Blob = await new Promise((res) => out.toBlob((b) => res(b!), 'image/png'))
    const file = new File([blob], `crop_${sw}x${sh}.png`, { type: 'image/png' })
    setBusy(true); setErr(null)
    try { await onCrop(file) } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="flex max-h-[92vh] w-[960px] max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
          <span className="text-sm font-semibold text-slate-900">✂️ {title}</span>
          <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">
            Chọn PDF / ảnh
            <input type="file" accept="application/pdf,image/*" hidden onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = '' }} />
          </label>
          {numPages > 1 && (
            <div className="flex items-center gap-1.5 text-[13px] text-slate-600">
              <button onClick={() => goPage(page - 1)} disabled={page <= 1} className="h-7 w-7 rounded border border-slate-200 disabled:opacity-30">‹</button>
              <span>Trang {page}/{numPages}</span>
              <button onClick={() => goPage(page + 1)} disabled={page >= numPages} className="h-7 w-7 rounded border border-slate-200 disabled:opacity-30">›</button>
            </div>
          )}
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-4">
          {!hasSrc
            ? <div className="flex h-64 items-center justify-center text-sm text-slate-400">{hint}</div>
            : (
              <div className="relative mx-auto select-none" style={{ width: dispW, height: dispH }}>
                <canvas ref={dispRef} className="block rounded shadow" onPointerDown={down} onPointerMove={move} onPointerUp={up} style={{ touchAction: 'none', cursor: 'crosshair' }} />
                {sel && sel.w > 0 && (
                  <div className="pointer-events-none absolute border-2 border-indigo-500 bg-indigo-500/15"
                    style={{ left: sel.x, top: sel.y, width: sel.w, height: sel.h }} />
                )}
              </div>
            )}
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          <span className="text-[12px] text-slate-400">{err ? <span className="text-rose-600">{err}</span> : hasSrc ? hint : 'Render ở 300 DPI — hình vector cắt ra nét, in đẹp.'}</span>
          <button onClick={cat} disabled={busy || !sel || (sel.w < 6)} className="ml-auto rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang cắt…' : '✂️ Cắt & dùng'}</button>
        </div>
      </div>
    </div>
  )
}
