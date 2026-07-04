// In ĐỀ THI — tái dùng engine PrintView (paged.js). KHÁC giáo trình/ET: render THEO PHẦN GỐC, THEO
// THỨ TỰ GỐC (không gom lại theo dạng/form) — CauItem đã tự dispatch theo loại câu (TN/ĐS/TLN/tự luận),
// nên chỉ cần lặp phần → lặp câu, số thứ tự "Câu N." đếm LIÊN TỤC xuyên mọi phần.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, kieuCols, type TaiLieuFull } from '../../lib/tailieu'
import { deThiMeta as getMeta } from '../../lib/dethi'
import { CauItem, CHROME_CSS, buildPagedCss, downloadPagesPdf, pageChrome } from './PrintView'

const DEFAULT_TL_LINES = 4
const CAP_LABEL: Record<string, string> = { vao_10: 'Tuyển sinh vào 10', thpt_qg: 'THPT Quốc gia', hsg: 'Học sinh giỏi' }

export default function DeThiPrintView({ id, onClose, headless }: { id: string; onClose: () => void; headless?: boolean }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false)
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [dl, setDl] = useState(false)
  const [dlErr, setDlErr] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  useEffect(() => { getTaiLieuFull(id).then(setFull).catch((e) => setErr(e.message ?? String(e))) }, [id])

  useEffect(() => {
    if (!full || !srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true)
    const ch = full.taiLieu.cau_hinh ?? {}
    const css = buildPagedCss(full.taiLieu, ch, ch.mau || '#2D9CDB') + DETHI_CSS
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = srcRef.current.innerHTML
    // Race-safe (như PrintView/ETPrintView): container riêng mỗi run, run stale tự xoá.
    const dst = dstRef.current
    const container = document.createElement('div')
    dst.appendChild(container)
    new Previewer().preview(html, [cssUrl], container)
      .then((flow: { total?: number }) => {
        if (cancelled) { container.remove(); return }
        Array.from(dst.children).forEach((c) => { if (c !== container) c.remove() })
        setPages(flow?.total ?? 0); setRendering(false)
      })
      .catch(() => { container.remove(); if (!cancelled) setRendering(false) })
      .finally(() => URL.revokeObjectURL(cssUrl))
    return () => { cancelled = true }
  }, [full, gv])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  async function taiPdf() {
    if (!dstRef.current || !full) return
    setDl(true); setDlErr(null)
    try { await downloadPagesPdf(dstRef.current, `${full.taiLieu.ten}${gv ? ' - Bản GV' : ''}`, pageChrome(full.taiLieu, full.taiLieu.cau_hinh ?? {})) }
    catch (e) { setDlErr('Tải PDF lỗi: ' + (e instanceof Error ? e.message : String(e))) }
    finally { setDl(false) }
  }

  const didAutoDl = useRef(false)
  useEffect(() => {
    if (!headless || didAutoDl.current || rendering || !full || !dstRef.current) return
    const t = setTimeout(() => { if (!didAutoDl.current) { didAutoDl.current = true; taiPdf().finally(onClose) } }, 350)
    return () => clearTimeout(t)
  }, [headless, rendering, full]) // eslint-disable-line

  if (headless) return createPortal(
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 88, width: '210mm', background: '#fff' }}><div ref={dstRef} className="pv-pages" /></div>
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <DeThiDoc full={full} gv={gv} />}</div>
      <div className="fixed inset-0 z-[95] flex items-center justify-center bg-white">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-700 shadow-xl">
          {dlErr ? <span className="text-rose-600">{dlErr}</span> : <>⏳ Đang tạo file PDF{pages ? ` (${pages} trang)` : ''}…</>}
          {dlErr && <button onClick={onClose} className="ml-3 rounded border border-slate-300 px-2.5 py-1 text-xs text-slate-600">Đóng</button>}
        </div>
      </div>
      <style>{CHROME_CSS}</style>
    </>,
    document.body,
  )
  return createPortal(
    <div className="pv-overlay fixed inset-0 z-[80] flex flex-col bg-slate-300/90">
      <div className="no-print flex items-center gap-3 border-b border-slate-300 bg-white px-5 py-2.5 shadow-sm">
        <span className="text-sm font-semibold text-slate-800">Xem &amp; in đề thi</span>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setGv(false)} className={seg(!gv)}>Bản học sinh</button>
          <button onClick={() => setGv(true)} className={seg(gv)}>Bản giáo viên</button>
        </div>
        <span className="text-[12px] text-slate-400">{rendering ? 'đang dựng trang…' : `${pages} trang`}</span>
        {dlErr && <span className="text-[12px] text-rose-600">{dlErr}</span>}
        <div className="ml-auto flex gap-2">
          <button onClick={taiPdf} disabled={rendering || dl} className="rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 disabled:opacity-40">{dl ? '⏳ Đang tạo…' : '⬇ Tải PDF'}</button>
          <button onClick={() => window.print()} disabled={rendering} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 In</button>
          <button onClick={onClose} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Đóng</button>
        </div>
      </div>
      <div className="pv-scroll min-h-0 flex-1 overflow-auto py-6">
        {err ? <p className="text-center text-rose-600">Lỗi: {err}</p>
          : !full ? <p className="text-center text-slate-400">Đang tải…</p>
          : <div ref={dstRef} className="pv-pages" />}
      </div>
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <DeThiDoc full={full} gv={gv} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

function DeThiDoc({ full, gv }: { full: TaiLieuFull; gv: boolean }) {
  const ch = full.taiLieu.cau_hinh ?? {}
  const dt = getMeta(full.taiLieu as any)
  const lines = ch.btvnLinesByCau ?? {}
  const phans = full.phans.filter((p) => p.loai_phan === 'custom')
  let no = 0
  const next = () => ++no
  return (
    <div className="pv-dethi" style={{ '--pv-accent': ch.mau || '#2D9CDB' } as CSSProperties}>
      <div className="pv-bt-head">
        <div className="pv-bt-titlewrap">
          <div className="pv-bt-eyebrow">{[dt.nguon, dt.cap && (CAP_LABEL[dt.cap] ?? dt.cap), dt.nam].filter(Boolean).join(' · ')}{gv ? ' · Đáp án' : ''}</div>
          <div className="pv-bt-title">{full.taiLieu.ten}</div>
          {(dt.thoiGianPhut || dt.thangDiem) && (
            <div className="pv-dethi-meta">{dt.thoiGianPhut ? `Thời gian làm bài: ${dt.thoiGianPhut} phút` : ''}{dt.thoiGianPhut && dt.thangDiem ? ' · ' : ''}{dt.thangDiem ? `Thang điểm: ${dt.thangDiem}` : ''}</div>
          )}
        </div>
        {!gv && (
          <div className="pv-bt-row">
            <div className="pv-bt-info">
              <div className="pv-bt-field"><span className="pv-bt-lbl">Họ và tên:</span><span className="pv-bt-fill" /></div>
              <div className="pv-bt-field"><span className="pv-bt-lbl">Lớp:</span><span className="pv-bt-fill" /></div>
              <div className="pv-bt-field"><span className="pv-bt-lbl">SBD:</span><span className="pv-bt-fill" /></div>
            </div>
            <div className="pv-bt-score"><div className="pv-bt-score-lbl">ĐIỂM</div><div className="pv-bt-score-box" /></div>
          </div>
        )}
      </div>

      {phans.map((p) => {
        const cols = kieuCols(p.kieu)
        return (
          <section key={p.id} className="pv-sec">
            <h2 className="pv-h-dang">{p.tieu_de}</h2>
            {p.caus.length === 0 ? <p className="pv-empty">Phần này chưa có câu.</p> : (
              <ol className={`pv-caulist${cols > 1 ? ' pv-multicol' : ''}`} style={cols > 1 ? { columnCount: cols } : undefined}>
                {p.caus.map((c) => (
                  <CauItem key={c.ma_cau} no={next()} c={c} gv={gv} lines={!gv && c.loai_cau === 'tu_luan' ? (lines[c.ma_cau] ?? DEFAULT_TL_LINES) : 0} />
                ))}
              </ol>
            )}
          </section>
        )
      })}
      {phans.length === 0 && <p className="pv-empty">Đề thi chưa có phần nào.</p>}
    </div>
  )
}

const DETHI_CSS = `
.pv-dethi-meta{font-size:12px;color:#64748b;margin-top:4px}
.pv-dethi .pv-h-dang{border-bottom:none;padding-bottom:0}
.pv-empty{color:#8a9097;font-style:italic;margin-top:10px}
`
