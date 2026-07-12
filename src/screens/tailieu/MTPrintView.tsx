// In MT (kỳ thi lớn) — tái dùng engine PrintView (paged.js), mẫu bám sát DeThiPrintView/ETPrintView.
// GIỮ NGUYÊN cấu trúc PHẦN + THỨ TỰ GỐC (không gom lại theo loại câu) — đúng yêu cầu Thùy 07-08 "cấu
// trúc chấm/in MT phải giống file MT được gán, không làm phẳng". Mỗi câu tôn trọng FORM HIỂN THỊ
// (`etFormByCau`/`etFormOf`, GIỐNG ET — MT dùng chung cơ chế "chỉnh dòng" với ET): câu kho có phương án
// nhưng bị ép hiển thị "tự luận"/"trả lời ngắn" thì KHÔNG hiện phương án (CauItem tự động hiện phương án
// nếu có lua_chon nên không dùng thẳng được cho 2 form này — phải tách stem thủ công như ET đã làm).
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, etFormOf, type TaiLieuFull, type CauHinh } from '../../lib/tailieu'
import type { CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import { CauItem, CauList, OptGrid, GvAnswer, WriteLines, splitStem, CHROME_CSS, buildPagedCss, uploadPagesAsLink, pageChrome, printWithFilename } from './PrintView'

const DEFAULT_TL_LINES = 4

// headless = tự dựng ẩn → tải PDF → đóng (nút "⬇ Tải" ngay ở hàng Kho tài liệu, không mở preview).
export default function MTPrintView({ id, onClose, headless, linkOnly }: { id: string; onClose: () => void; headless?: boolean; linkOnly?: boolean }) {
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
    const css = buildPagedCss(full.taiLieu, ch, ch.mau || '#7c3aed') + MT_CSS
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
  const printFileName = () => `${full?.taiLieu.ten ?? ''}${gv ? ' - Bản GV' : ''}`
  // "🔗 Lấy link" — CHỈ dùng cho linkOnly (headless). "⬇ Tải PDF" cũ đã BỎ, giờ dùng NATIVE print
  // (window.print(), xem uploadPagesAsLink trong PrintView.tsx — quyết định kiến trúc 07-11).
  async function layLink() {
    if (!activeContainerRef.current || !full) return
    setDl(true); setDlErr(null)
    try { await uploadPagesAsLink(activeContainerRef.current, printFileName(), pageChrome(full.taiLieu, full.taiLieu.cau_hinh ?? {}), full.taiLieu.id) }
    catch (e) { setDlErr('Lấy link lỗi: ' + (e instanceof Error ? e.message : String(e))) }
    finally { setDl(false) }
  }

  const didAutoDl = useRef(false)
  useEffect(() => {
    if (!headless || didAutoDl.current || rendering || dlErr || !full || !dstRef.current) return
    didAutoDl.current = true
    const t = setTimeout(() => { linkOnly ? layLink().finally(onClose) : printWithFilename(printFileName()) }, 350)
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <MTDoc full={full} gv={gv} />}</div>
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
        <span className="text-sm font-semibold text-slate-800">Xem &amp; in MT</span>
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <MTDoc full={full} gv={gv} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

// 1 câu trong MT — tôn trọng FORM HIỂN THỊ (etFormOf), KHÁC CauItem thô (CauItem luôn hiện lua_chon
// nếu câu kho có, bất kể form override). Đúng/Sai (menh_de) luôn qua CauItem (form không áp dụng).
function MtCau({ no, c, gv, ch }: { no: number; c: CauHoi; gv: boolean; ch: CauHinh }) {
  const isDS = !!(c.menh_de && c.menh_de.length)
  if (isDS) return <CauItem no={no} c={c} gv={gv} />
  const form = etFormOf(c, ch)
  if (form === 'trac_nghiem') return <CauItem no={no} c={c} gv={gv} />
  // tự luận / trả lời ngắn ÉP hiển thị: bỏ qua lua_chon dù câu kho có (tách stem thủ công, giống ET).
  const { stem, grid, emb } = splitStem(c)
  const lines = ch.btvnLinesByCau?.[c.ma_cau] ?? DEFAULT_TL_LINES
  return (
    <div className="pv-cau">
      <div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Câu ${no}.</span> `}>{stem}</MathText></div>
      {grid && <OptGrid grid={grid} emb={emb} />}
      {c.anh_de && <img src={c.anh_de} alt="" className="pv-img" />}
      {gv ? <GvAnswer c={c} /> : grid ? null : form === 'tu_luan'
        ? <WriteLines n={lines} />
        : <div className="pv-tln-ans"><span className="pv-tln-lbl">Đáp án:</span><span className="pv-tln-fill" /></div>}
    </div>
  )
}

function MTDoc({ full, gv }: { full: TaiLieuFull; gv: boolean }) {
  const ch = full.taiLieu.cau_hinh ?? {}
  const phans = full.phans.filter((p) => p.loai_phan === 'custom')
  let no = 0
  const next = () => ++no
  return (
    <div className="pv-mt" style={{ '--pv-accent': ch.mau || '#7c3aed' } as CSSProperties}>
      <div className="pv-bt-head">
        <div className="pv-bt-titlewrap">
          <div className="pv-bt-eyebrow">Kỳ thi lớn (MT){gv ? ' · Đáp án' : ''}</div>
          <div className="pv-bt-title">{full.taiLieu.ten}</div>
        </div>
        {!gv && (
          <div className="pv-bt-row">
            <div className="pv-bt-info">
              <div className="pv-bt-field"><span className="pv-bt-lbl">Họ và tên:</span><span className="pv-bt-fill" /></div>
              <div className="pv-bt-field"><span className="pv-bt-lbl">Lớp:</span><span className="pv-bt-fill" /></div>
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
              {p.caus.map((c) => <MtCau key={c.ma_cau} no={next()} c={c} gv={gv} ch={ch} />)}
            </CauList>
          )}
        </section>
      ))}
      {phans.length === 0 && <p className="pv-empty">MT chưa có phần nào.</p>}
    </div>
  )
}

const MT_CSS = `
.pv-mt .pv-h-dang{border-bottom:none;padding-bottom:0}
.pv-empty{color:#8a9097;font-style:italic;margin-top:10px}
/* Trả lời ngắn (form ép, không phải tự luận): 1 dòng đáp án ngắn thay vì nhiều dòng kẻ. */
.pv-tln-ans{margin-top:6px;display:flex;align-items:center;gap:8px;font-size:14px}
.pv-tln-lbl{font-weight:700;color:#475569;white-space:nowrap}
.pv-tln-fill{flex:1;max-width:70mm;border-bottom:1.5px dotted #9aa6b2;height:14px}
`
