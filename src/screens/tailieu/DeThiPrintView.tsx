// In ĐỀ THI — tái dùng engine PrintView (paged.js). KHÁC giáo trình/ET: render THEO PHẦN GỐC, THEO
// THỨ TỰ GỐC (không gom lại theo dạng/form) — CauItem đã tự dispatch theo loại câu (TN/ĐS/TLN/tự luận),
// nên chỉ cần lặp phần → lặp câu, số thứ tự "Câu N." đếm LIÊN TỤC xuyên mọi phần.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, type TaiLieuFull } from '../../lib/tailieu'
import { deThiMeta as getMeta } from '../../lib/dethi'
import { CauItem, CauList, CHROME_CSS, buildPagedCss, uploadPagesAsLink, pageChrome, printWithFilename } from './PrintView'

const DEFAULT_TL_LINES = 4
const CAP_LABEL: Record<string, string> = { vao_10: 'Tuyển sinh vào 10', thpt_qg: 'THPT Quốc gia', hsg: 'Học sinh giỏi' }

export default function DeThiPrintView({ id, onClose, headless, linkOnly, onFail }: { id: string; onClose: () => void; headless?: boolean; linkOnly?: boolean; onFail?: () => void }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false)
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [, setDl] = useState(false) // "đang lấy link" — chỉ đọc trong headless linkOnly, nút "⬇ Tải PDF" đã bỏ
  const [dlErr, setDlErr] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  const activeContainerRef = useRef<HTMLElement | null>(null)
  useEffect(() => { getTaiLieuFull(id).then(setFull).catch((e) => setErr(e.message ?? String(e))) }, [id])

  useEffect(() => {
    if (!full || !srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true)
    const ch = full.taiLieu.cau_hinh ?? {}
    const css = buildPagedCss(full.taiLieu, ch, ch.mau || '#2D9CDB') + DETHI_CSS
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = srcRef.current.innerHTML
    // Race-safe: KHÔNG xoá DOM của container cũ (rút DOM giữa lúc paged.js còn đo layout dở → sinh trang
    // CHẠY LOẠN — xem DEVLOG 07-11). Run mới có container RIÊNG; resolve xong mới ẨN container khác +
    // trỏ activeContainerRef. Tải/in luôn theo activeContainerRef, không quét cả dstRef.
    const dst = dstRef.current
    const container = document.createElement('div')
    dst.appendChild(container)
    // Watchdog: paged.js từng TREO VĨNH VIỄN không resolve (xem DEVLOG 07-11) — headless (in nhanh/lấy
    // link) mắc kẹt "⏳" mãi mãi KHÔNG CÓ NÚT ĐÓNG nếu không set dlErr. Quá 30s coi như treo.
    let settled = false
    const watchdog = setTimeout(() => {
      if (settled || cancelled) return
      settled = true
      container.style.display = 'none'
      setDlErr('Dựng trang quá lâu (>30s) — đóng rồi thử lại.'); setRendering(false)
    }, 30000)
    new Previewer().preview(html, [cssUrl], container)
      .then((flow: { total?: number }) => {
        if (settled) return
        settled = true; clearTimeout(watchdog)
        if (cancelled) { container.style.display = 'none'; return }
        Array.from(dst.children).forEach((c) => { if (c !== container) (c as HTMLElement).style.display = 'none' })
        activeContainerRef.current = container
        setPages(flow?.total ?? 0); setRendering(false)
      })
      .catch((e: unknown) => {
        if (settled) return
        settled = true; clearTimeout(watchdog)
        container.style.display = 'none'; if (!cancelled) { setDlErr('Dựng trang lỗi: ' + (e instanceof Error ? e.message : String(e))); setRendering(false) }
      })
      .finally(() => URL.revokeObjectURL(cssUrl))
    return () => { cancelled = true; clearTimeout(watchdog) }
  }, [full, gv])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  // "🔗 Lấy link" — CHỈ dùng cho linkOnly (headless). "⬇ Tải PDF" cũ đã BỎ, giờ dùng NATIVE print
  // (window.print(), xem uploadPagesAsLink trong PrintView.tsx — quyết định kiến trúc 07-11).
  const printFileName = () => `${full?.taiLieu.ten ?? ''}${gv ? ' - Bản GV' : ''}`
  async function layLink(): Promise<boolean> {
    if (!activeContainerRef.current || !full) return false
    setDl(true); setDlErr(null)
    try { await uploadPagesAsLink(activeContainerRef.current, printFileName(), pageChrome(full.taiLieu, full.taiLieu.cau_hinh ?? {}), full.taiLieu.id); return true }
    catch (e) { setDlErr('Lấy link lỗi: ' + (e instanceof Error ? e.message : String(e))); return false }
    finally { setDl(false) }
  }

  const didAutoDl = useRef(false)
  useEffect(() => {
    if (!headless || didAutoDl.current || rendering || dlErr || !full || !dstRef.current) return
    didAutoDl.current = true
    const t = setTimeout(() => { linkOnly ? layLink().then((ok) => (ok ? onClose() : (onFail ?? onClose)())) : printWithFilename(printFileName()) }, 350)
    return () => clearTimeout(t)
  }, [headless, rendering, dlErr, full]) // eslint-disable-line
  useEffect(() => {
    if (!headless || linkOnly) return
    const onAfter = () => onClose()
    window.addEventListener('afterprint', onAfter)
    return () => window.removeEventListener('afterprint', onAfter)
  }, [headless, linkOnly]) // eslint-disable-line

  if (headless) return createPortal(
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 88, width: '210mm', background: '#fff' }}><div ref={dstRef} className="pv-pages" /></div>
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <DeThiDoc full={full} gv={gv} />}</div>
      <div className="no-print fixed inset-0 z-[95] flex items-center justify-center bg-white">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-700 shadow-xl">
          {dlErr ? <span className="text-rose-600">{dlErr}</span> : linkOnly ? <>⏳ Đang lấy link…</> : <>⏳ Đang chuẩn bị in{pages ? ` (${pages} trang)` : ''}…</>}
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
          <button onClick={() => printWithFilename(printFileName())} disabled={rendering} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 In / Xuất PDF</button>
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

      {phans.map((p) => (
        <section key={p.id} className="pv-sec">
          <h2 className="pv-h-dang">{p.tieu_de}</h2>
          {p.caus.length === 0 ? <p className="pv-empty">Phần này chưa có câu.</p> : (
            <CauList kieu={p.kieu}>
              {p.caus.map((c) => (
                <CauItem key={c.ma_cau} no={next()} c={c} gv={gv} lines={!gv && c.loai_cau === 'tu_luan' ? (lines[c.ma_cau] ?? DEFAULT_TL_LINES) : 0} />
              ))}
            </CauList>
          )}
        </section>
      ))}
      {phans.length === 0 && <p className="pv-empty">Đề thi chưa có phần nào.</p>}
    </div>
  )
}

const DETHI_CSS = `
.pv-dethi-meta{font-size:12px;color:#64748b;margin-top:4px}
.pv-dethi .pv-h-dang{border-bottom:none;padding-bottom:0}
.pv-empty{color:#8a9097;font-style:italic;margin-top:10px}
`
