// SPIKE Phase 2 (ingest) — ĐO chi phí + độ chính xác của "AI tự cắt hình + bóc câu cả trang".
// Luồng: nạp PDF/ảnh → render trang DPI cao → gửi ảnh (downscale) cho Gemini → nhận {câu + bbox hình}
//   → tự cắt hình từ bản DPI cao → hiện token usage + danh sách câu (đề + ảnh cắt) để người DUYỆT → lưu.
// Mục tiêu spike: xem token/trang (cent) + AI dò đúng mấy %, KHÔNG phải bản production.
import { useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { callGeminiRich, buildIngestPrompt, parseIngestJson, INGEST_SCHEMA, geminiCostVND, uploadKhoImage, saveCauBatch, type GeminiUsage } from '../../lib/kho/api'
import { MathText } from './ui'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
const HI_DPI = 300, MAX_SRC = 3200, GEM_W = 1300

type Item = { noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon: string[] | null; coHinh: boolean; crop: string | null; approved: boolean }
const MODELS = [{ v: 'gemini-2.5-flash-lite', l: 'Flash-Lite (rẻ nhất)' }, { v: 'gemini-2.5-flash', l: 'Flash' }, { v: 'gemini-2.5-pro', l: 'Pro (đắt ~10×)' }]

export default function IngestSpike({ dangChinh, tenDang, loaiCau, onClose, onSaved }: {
  dangChinh: string; tenDang?: string; loaiCau: string; onClose: () => void; onSaved?: () => void
}) {
  const srcRef = useRef<HTMLCanvasElement | null>(null)
  const pdfRef = useRef<any>(null)
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [srcName, setSrcName] = useState<string | null>(null)
  const [hasSrc, setHasSrc] = useState(false)
  const [model, setModel] = useState('gemini-2.5-flash')
  const [think, setThink] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [usage, setUsage] = useState<GeminiUsage | null>(null)
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [note, setNote] = useState('Nạp PDF/ảnh 1 trang → "Phân tích trang".')
  const getSrc = () => (srcRef.current ??= document.createElement('canvas'))

  // render trang n vào srcCanvas (chỉ vẽ, KHÔNG đụng state — dùng trong vòng lặp đa trang)
  async function raster(n: number) {
    const pg = await pdfRef.current.getPage(n)
    let vp = pg.getViewport({ scale: HI_DPI / 72 })
    if (vp.width > MAX_SRC) vp = pg.getViewport({ scale: (HI_DPI / 72) * (MAX_SRC / vp.width) })
    const s = getSrc(); s.width = Math.round(vp.width); s.height = Math.round(vp.height)
    await pg.render({ canvasContext: s.getContext('2d')!, viewport: vp }).promise
  }
  async function renderPdf(n: number) { await raster(n); setHasSrc(true); setItems([]); setUsage(null) }
  async function onFile(f: File | undefined) {
    if (!f) return; setErr(null); setItems([]); setUsage(null); setNote('Đang nạp…'); setSrcName(f.name)
    try {
      if (f.type === 'application/pdf') {
        pdfRef.current = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise
        setNumPages(pdfRef.current.numPages); setPage(1); await renderPdf(1)
        setNote('Bấm "Phân tích trang".')
      } else if (f.type.startsWith('image/')) {
        pdfRef.current = null; setNumPages(0)
        const url = URL.createObjectURL(f); const img = new Image()
        await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('Ảnh lỗi')); img.src = url })
        const s = getSrc(); const k = Math.min(1, MAX_SRC / img.naturalWidth)
        s.width = Math.round(img.naturalWidth * k); s.height = Math.round(img.naturalHeight * k)
        s.getContext('2d')!.drawImage(img, 0, 0, s.width, s.height); URL.revokeObjectURL(url)
        setHasSrc(true); setNote('Bấm "Phân tích trang".')
      } else setErr('Chỉ nhận PDF hoặc ảnh.')
    } catch (e: any) { setErr(e?.message ?? String(e)) }
  }
  async function goPage(n: number) { if (n >= 1 && n <= numPages) { setPage(n); await renderPdf(n) } }

  // downscale bản DPI cao → JPEG base64 (gửi Gemini cho rẻ token; bbox chuẩn hoá nên không phụ thuộc cỡ).
  function gemImage(): string {
    const s = getSrc(); const k = Math.min(1, GEM_W / s.width)
    const c = document.createElement('canvas'); c.width = Math.round(s.width * k); c.height = Math.round(s.height * k)
    c.getContext('2d')!.drawImage(s, 0, 0, c.width, c.height)
    return c.toDataURL('image/jpeg', 0.85).split(',')[1]
  }
  function cropBox(box: [number, number, number, number]): string {
    const s = getSrc(); const [y0, x0, y1, x1] = box
    const sx = Math.round(Math.min(x0, x1) / 1000 * s.width), sy = Math.round(Math.min(y0, y1) / 1000 * s.height)
    const sw = Math.round(Math.abs(x1 - x0) / 1000 * s.width), sh = Math.round(Math.abs(y1 - y0) / 1000 * s.height)
    const o = document.createElement('canvas'); o.width = Math.max(1, sw); o.height = Math.max(1, sh)
    o.getContext('2d')!.drawImage(s, sx, sy, sw, sh, 0, 0, o.width, o.height)
    return o.toDataURL('image/png')
  }
  // Đọc 1 trang ĐANG ở srcCanvas → câu + crop hình của trang đó (cộng dồn token bên ngoài).
  async function readCanvas(): Promise<{ items: Item[]; usage: GeminiUsage }> {
    const { text, usage } = await callGeminiRich(buildIngestPrompt({ tenDang, loaiCau }), {
      model, think: think ? 4096 : 0, schema: INGEST_SCHEMA, files: [{ mimeType: 'image/jpeg', dataBase64: gemImage() }],
    })
    const items = parseIngestJson(text).map((c) => ({
      noi_dung: c.noi_dung, dap_an: c.dap_an, loi_giai: c.loi_giai, lua_chon: c.lua_chon,
      coHinh: c.coHinh, crop: c.coHinh && c.box ? cropBox(c.box) : null, approved: true,
    }))
    return { items, usage }
  }
  async function analyze() {
    setBusy(true); setErr(null); setNote('AI đang đọc trang…')
    try { const r = await readCanvas(); setItems(r.items); setUsage(r.usage); setNote(`AI dò ${r.items.length} câu (${r.items.filter((i) => i.coHinh).length} có hình). Kiểm rồi lưu.`) }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  // KB2: đọc CẢ tài liệu (mọi trang) → gộp câu, cộng dồn token. Mỗi trang 1 call.
  async function analyzeAll() {
    setBusy(true); setErr(null); setItems([]); setUsage(null)
    try {
      const pages = pdfRef.current ? numPages : 1
      let acc: Item[] = [], u: GeminiUsage = { in: 0, out: 0, think: 0 }
      for (let p = 1; p <= pages; p++) {
        setNote(`AI đang đọc trang ${p}/${pages}…`)
        if (pdfRef.current) await raster(p)
        const r = await readCanvas()
        acc = acc.concat(r.items); u = { in: u.in + r.usage.in, out: u.out + r.usage.out, think: u.think + r.usage.think }
        setItems([...acc]); setUsage({ ...u })
      }
      setNote(`AI dò ${acc.length} câu / ${pages} trang (${acc.filter((i) => i.coHinh).length} có hình). Kiểm rồi lưu.`)
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  async function save() {
    const chosen = items.filter((i) => i.approved && i.noi_dung.trim())
    if (!chosen.length) { setErr('Không có câu nào được chọn.'); return }
    setSaving(true); setErr(null)
    try {
      const withImg = await Promise.all(chosen.map(async (i) => {
        let anh: string | null = null
        if (i.crop) { const blob = await (await fetch(i.crop)).blob(); anh = await uploadKhoImage(new File([blob], 'fig.png', { type: 'image/png' })) }
        return { noi_dung: i.noi_dung, dap_an: i.dap_an, loi_giai: i.loi_giai, lua_chon: i.lua_chon, anh_de: anh }
      }))
      const n = await saveCauBatch({ dangChinh, loaiCau, items: withImg })
      setNote(`Đã lưu ${n} câu vào dạng.`); setItems([]); onSaved?.()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }

  const tok = usage ? usage.in + usage.out + usage.think : 0
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="flex max-h-[94vh] w-[1040px] max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-3">
          <span className="text-sm font-semibold text-slate-900">🧪 Nhập tự động (thử) · {tenDang ?? 'dạng'}</span>
          <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">
            {srcName ? 'Đổi PDF/ảnh' : 'Chọn PDF/ảnh'}
            <input type="file" accept="application/pdf,image/*" hidden onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = '' }} />
          </label>
          {numPages > 1 && <span className="flex items-center gap-1 text-[13px] text-slate-600"><button onClick={() => goPage(page - 1)} disabled={page <= 1} className="h-7 w-7 rounded border border-slate-200 disabled:opacity-30">‹</button>Trang {page}/{numPages}<button onClick={() => goPage(page + 1)} disabled={page >= numPages} className="h-7 w-7 rounded border border-slate-200 disabled:opacity-30">›</button></span>}
          <select value={model} onChange={(e) => setModel(e.target.value)} className="h-8 rounded-md border border-slate-300 px-2 text-[12px]">{MODELS.map((m) => <option key={m.v} value={m.v}>{m.l}</option>)}</select>
          <label className="flex items-center gap-1 text-[12px] text-slate-600"><input type="checkbox" checked={think} onChange={(e) => setThink(e.target.checked)} /> suy luận</label>
          <button onClick={analyze} disabled={!hasSrc || busy} className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-[13px] font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-40">{busy ? 'Đang đọc…' : '🔍 Trang này'}</button>
          <button onClick={analyzeAll} disabled={!hasSrc || busy} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40" title="Đọc toàn bộ tài liệu (mỗi trang 1 lần gọi AI)">{busy ? 'Đang đọc…' : `📚 Cả tài liệu${numPages > 1 ? ` (${numPages} trang)` : ''}`}</button>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        {usage && (
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-2 text-[12px]">
            <span className="font-semibold text-slate-700">Token trang này:</span>
            <span>input <b>{usage.in.toLocaleString()}</b></span>
            <span>output <b>{usage.out.toLocaleString()}</b></span>
            <span>suy luận <b>{usage.think.toLocaleString()}</b></span>
            <span className="text-slate-500">tổng <b>{tok.toLocaleString()}</b></span>
            <span className="font-bold text-emerald-600">≈ {geminiCostVND(usage, model).toLocaleString('vi-VN')}₫</span>
            <span className="text-slate-400">(ước tính theo GEMINI_GIA — sửa giá ở api.ts khi Google đổi)</span>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {err && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">{err}</div>}
          {items.length === 0
            ? <div className="py-10 text-center text-sm text-slate-400">{note}</div>
            : (
              <div className="space-y-2">
                {items.map((it, i) => (
                  <div key={i} className={`flex gap-3 rounded-xl border bg-white p-3 ${it.approved ? 'border-slate-200' : 'border-slate-100 opacity-50'}`}>
                    <label className="flex shrink-0 items-start pt-0.5"><input type="checkbox" checked={it.approved} onChange={(e) => setItems((s) => s.map((x, j) => j === i ? { ...x, approved: e.target.checked } : x))} /></label>
                    <span className="shrink-0 text-[13px] font-bold text-violet-600">Câu {i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] leading-relaxed text-slate-800"><MathText>{it.noi_dung}</MathText></div>
                      {it.lua_chon?.length ? <div className="mt-1 text-[12px] text-slate-500">{it.lua_chon.map((o, k) => <span key={k} className="mr-3">{String.fromCharCode(65 + k)}. <MathText>{o}</MathText></span>)}</div> : null}
                      {it.dap_an && <div className="mt-0.5 text-[12px] text-emerald-700">ĐA: <MathText>{it.dap_an}</MathText></div>}
                    </div>
                    {it.coHinh && (
                      <div className="shrink-0">
                        {it.crop ? <img src={it.crop} alt="" className="max-h-28 w-auto rounded border border-slate-200" /> : <span className="text-[11px] text-amber-600">có hình nhưng AI không khoanh box</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          <span className="text-[12px] text-slate-400">{items.length ? `${items.filter((i) => i.approved).length}/${items.length} câu sẽ lưu vào dạng "${tenDang}"` : 'Hình AI cắt sẽ gắn vào câu khi lưu.'}</span>
          <button onClick={save} disabled={saving || !items.some((i) => i.approved)} className="ml-auto rounded-md bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-emerald-500 disabled:opacity-40">{saving ? 'Đang lưu…' : '💾 Lưu câu đã duyệt'}</button>
        </div>
      </div>
    </div>
  )
}
