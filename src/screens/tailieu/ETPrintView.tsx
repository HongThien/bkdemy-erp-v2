// In ET cho HS làm — engine paged.js (tái dùng từ PrintView). Phiếu: header Họ-tên/Lớp/Điểm + mã ET.
// 3 dạng, CÙNG 1 định dạng mặc định (đề + dòng kẻ, KHÔNG bảng — Thùy chốt 07-11): TRẮC NGHIỆM (CauItem
// có phương án) · TRẢ LỜI NGẮN (dòng kẻ ngắn) · TỰ LUẬN (dòng kẻ dài hơn, số dòng = cau_hinh.btvnLinesByCau).
// Bản GV = kèm đáp án/lời giải mặc định (đề rồi lời giải bên dưới), không tách bảng riêng.
// THỨ TỰ CÂU: đọc thẳng `thu_tu` của DB, KHÔNG sắp xếp lại ở đây — việc gom theo nhóm in đã làm
// từ lúc LƯU (sortETCaus, xem lib/tailieu.ts). Đừng thêm sort vào file này: giấy sẽ lệch với hệ.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, etGroupOf, type ETGroup, type TaiLieuFull } from '../../lib/tailieu'
import type { CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import { CauItem, OptGrid, GvAnswer, WriteLines, splitStem, CHROME_CSS, buildPagedCss, uploadPagesAsLink, pageChrome, printWithFilename } from './PrintView'

const DEFAULT_TL_LINES = 4
const DEFAULT_TLN_LINES = 2

// headless = tự dựng ẩn → tải PDF → đóng (nút "⬇ Tải" ngay ở hàng Kho tài liệu, không mở preview).
// linkOnly (đi kèm headless) = CHỈ lấy link chia sẻ (upload + ghi file_url), KHÔNG tải file cục bộ —
// nút "🔗 Lấy link" riêng (KhoTaiLieuScreen), Thùy 07-11: "link phải có TRƯỚC khi bấm tải".
// onReady/onRenderErr (07-12, đời 2 server-gen): PrintJobPage (trang worker mở qua Puppeteer) cần biết
// paged.js dựng XONG hay LỖI để bấm nút "in ra PDF" đúng lúc — component tự bắn tín hiệu, worker không
// phải đoán mò qua DOM.
export default function ETPrintView({ id, onClose, headless, linkOnly, onFail, onReady, onRenderErr }: { id: string; onClose: () => void; headless?: boolean; linkOnly?: boolean; onFail?: () => void; onReady?: () => void; onRenderErr?: (msg: string) => void }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false)
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [, setDl] = useState(false) // "đang lấy link" — chỉ đọc trong headless linkOnly, nút "⬇ Tải PDF" đã bỏ
  const [dlErr, setDlErr] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  // Container ĐANG HIỂN THỊ (run mới nhất đã resolve xong) — uploadPagesAsLink/window.print CHỈ đọc trang
  // từ container này, KHÔNG quét cả dstRef (có thể còn container cũ ẩn/treo — xem comment effect dưới).
  const activeContainerRef = useRef<HTMLElement | null>(null)
  useEffect(() => { getTaiLieuFull(id).then(setFull).catch((e) => setErr(e.message ?? String(e))) }, [id])

  useEffect(() => {
    if (!full || !srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true)
    const ch = full.taiLieu.cau_hinh ?? {}
    const css = buildPagedCss(full.taiLieu, ch, ch.mau || '#7c3aed') + ET_CSS
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = srcRef.current.innerHTML
    // Race-safe: KHÔNG xoá DOM của container cũ — nếu Previewer của nó còn đang đo layout dở (paged.js
    // TREO không resolve, xem DEVLOG 07-11), rút container ra giữa chừng khiến nó sinh trang CHẠY LOẠN
    // (case thật: 1 tài liệu 2 trang tải ra 210 trang/20MB) — tệ hơn hẳn việc chỉ để nó tồn tại vô hại.
    // Thay vào đó: run mới luôn có container RIÊNG; khi resolve xong mới ẨN (display:none, không remove)
    // mọi container khác + cập nhật activeContainerRef trỏ đúng container hiện hành. Tải/in luôn theo
    // đúng activeContainerRef → không bao giờ dính trang của run cũ dù nó có settle hay không.
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
      onRenderErr?.('Dựng trang quá lâu (>30s)')
    }, 30000)
    new Previewer().preview(html, [cssUrl], container)
      .then((flow: { total?: number }) => {
        if (settled) return
        settled = true; clearTimeout(watchdog)
        if (cancelled) { container.style.display = 'none'; return }
        Array.from(dst.children).forEach((c) => { if (c !== container) (c as HTMLElement).style.display = 'none' })
        activeContainerRef.current = container
        setPages(flow?.total ?? 0); setRendering(false)
        onReady?.()
      })
      .catch((e: unknown) => {
        if (settled) return
        settled = true; clearTimeout(watchdog)
        container.style.display = 'none'
        if (!cancelled) { setDlErr('Dựng trang lỗi: ' + (e instanceof Error ? e.message : String(e))); setRendering(false); onRenderErr?.(e instanceof Error ? e.message : String(e)) }
      })
      .finally(() => URL.revokeObjectURL(cssUrl))
    return () => { cancelled = true; clearTimeout(watchdog) }
  }, [full, gv])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  const printFileName = () => `${full?.taiLieu.ten ?? ''}${gv ? ' - Bản GV' : ''}`
  // "🔗 Lấy link" — CHỈ dùng cho linkOnly (headless). "⬇ Tải PDF" cũ đã BỎ, giờ dùng NATIVE print
  // (window.print(), xem uploadPagesAsLink trong PrintView.tsx — quyết định kiến trúc 07-11).
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <ETDoc full={full} gv={gv} />}</div>
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
        <span className="text-sm font-semibold text-slate-800">Xem &amp; in ET</span>
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <ETDoc full={full} gv={gv} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

function ETDoc({ full, gv }: { full: TaiLieuFull; gv: boolean }) {
  const ch = full.taiLieu.cau_hinh ?? {}
  const lines = ch.btvnLinesByCau ?? {}
  const caus = full.phans.find((p) => p.loai_phan === 'custom')?.caus ?? []
  // ⭐ 07-20: KHÔNG gom lại theo loại ở đây nữa. Thứ tự in = ĐÚNG `thu_tu` của DB (đã gom theo nhóm
  // từ lúc LƯU — sortETCaus trong ETScreen.luu). Trước đây gom ở render nên "Câu 3" trên giấy khác
  // "Câu 3" ở bảng phiếu chấm / màn Chấm ET / ET online → chấm nhầm câu → sai ma_dang → bẩn mastery.
  // Heading "Phần …" giờ cắt theo KHÚC LIÊN TIẾP cùng nhóm: ET lưu từ nay ra đúng 3 phần; ET CŨ
  // (thu_tu chưa gom) vẫn in ĐÚNG THỨ TỰ — chỉ có thể nhiều khúc hơn, mở ra lưu lại 1 lần là gọn.
  const runs: { g: ETGroup; items: CauHoi[] }[] = []
  for (const c of caus) {
    const g = etGroupOf(c, ch)
    const last = runs[runs.length - 1]
    if (last && last.g === g) last.items.push(c)
    else runs.push({ g, items: [c] })
  }
  let no = 0
  const next = () => ++no
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
  let sec = 0
  const part = () => { const i = sec++; return roman[i] ?? String(i + 1) }
  const GLBL = ['Trắc nghiệm', 'Trả lời ngắn', 'Tự luận']
  return (
    <div className="pv-et">
      <div className="pv-bt-head">
        <div className="pv-bt-titlewrap">
          <div className="pv-bt-eyebrow">Đề ET{gv ? ' · Đáp án' : ''}</div>
          <div className="pv-bt-title">{full.taiLieu.ten}</div>
        </div>
        {!gv && (
          <>
            {/* Họ tên + Lớp CÙNG 1 dòng */}
            <div className="pv-et-info">
              <span className="pv-bt-field pv-et-name"><span className="pv-bt-lbl">Họ và tên:</span><span className="pv-bt-fill" /></span>
              <span className="pv-bt-field pv-et-lop"><span className="pv-bt-lbl">Lớp:</span><span className="pv-bt-fill" /></span>
            </div>
            {/* ET chấm THEO CÂU: bảng ngang 2 hàng — trên = Câu i, dưới = ô trống điền Đ/S. Bao nhiêu câu bấy nhiêu cột. */}
            <table className="pv-et-score"><tbody>
              <tr>{caus.map((_, i) => <th key={i}>Câu {i + 1}</th>)}</tr>
              <tr>{caus.map((_, i) => <td key={i} />)}</tr>
            </tbody></table>
          </>
        )}
      </div>

      {runs.map((run, ri) => (
        <section key={ri} className="pv-sec"><h2 className="pv-h-dang">Phần {part()} · {GLBL[run.g]}</h2>
          {/* g=0 trắc nghiệm → CauItem (đề + phương án, hoặc 4 mệnh đề Đ-S).
              g=1 trả lời ngắn → đề + dòng kẻ NGẮN · g=2 tự luận → đề + dòng kẻ DÀI hơn (BỎ phương án
              dù câu kho có). Bản GV: cả 3 nhóm kèm đáp án/lời giải thay cho dòng kẻ. */}
          <ol className="pv-caulist">{run.items.map((c) => {
            if (run.g === 0) return <CauItem key={c.ma_cau} no={next()} c={c} gv={gv} />
            const { stem, grid, emb } = splitStem(c)
            return (
              <li key={c.ma_cau} className="pv-cau">
                <div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Câu ${next()}.</span> `}>{stem}</MathText></div>
                {grid && <OptGrid grid={grid} emb={emb} />}
                {c.anh_de && <img src={c.anh_de} alt="" className="pv-img" />}
                {gv
                  ? <GvAnswer c={c} />
                  : grid ? null : <WriteLines n={lines[c.ma_cau] ?? (run.g === 1 ? DEFAULT_TLN_LINES : DEFAULT_TL_LINES)} />}
              </li>
            )
          })}</ol>
        </section>
      ))}

      {caus.length === 0 && <p className="pv-empty">ET chưa có câu nào.</p>}
    </div>
  )
}

const ET_CSS = `
/* Họ tên + Lớp cùng 1 dòng (Họ tên co giãn, Lớp cố định). */
.pv-et-info{display:flex;align-items:flex-end;gap:20px;margin:4px 0 11px}
.pv-et-name{flex:1}
.pv-et-lop{width:42mm}
/* Bảng điểm THEO CÂU: 2 hàng (Câu i / ô trống Đ-S), bao nhiêu câu bấy nhiêu cột.
   Cap rộng tối đa 60% (ít câu → ô to, nhiều câu → ô bé, nhưng KHÔNG quá rộng) · căn GIỮA. */
.pv-et-score{width:60%;margin:0 auto;border-collapse:collapse;table-layout:fixed}
.pv-et-score th{border:1px solid var(--pv-accent,#7c3aed);background:#f5f3ff;color:#6d28d9;font-weight:700;font-size:11.5px;padding:3px 1px;text-align:center}
.pv-et-score td{border:1px solid #9aa6b2;height:10mm}
.pv-empty{color:#8a9097;font-style:italic;margin-top:10px}
/* Heading "Phần …" KHÔNG gạch chân (gạch trông như dòng kẻ lạc — đã sửa ở BTVN hôm trước). */
.pv-et .pv-h-dang{border-bottom:none;padding-bottom:0;margin-bottom:6px}
/* Câu CHẢY liên tục: cho tách ngang trang thay vì nhảy cả câu → KHÔNG bỏ trống cuối trang. */
.pv-et .pv-cau{break-inside:auto}
.pv-et .pv-cau .pv-math:first-child{break-after:avoid}
`
