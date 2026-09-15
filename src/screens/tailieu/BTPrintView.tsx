// In BT (tài liệu bổ trợ) — tái dùng engine PrintView (paged.js), mẫu bám sát MTPrintView. Khác ET/MT:
// tiêu đề có TÊN RIÊNG học sinh (Thùy 07-10: "tiêu đề có tên riêng của học sinh và tên tài liệu bổ
// trợ") — không phải phiếu chung của lớp nên KHÔNG có dòng "Họ và tên: ___" bỏ trống, điền sẵn luôn.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, etFormOf, DEFAULT_BTVN_LINES, type TaiLieuFull, type PhanResolved, type CauHinh } from '../../lib/tailieu'
import { getBT, type BT } from '../../lib/bt'
import type { CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import { CauItem, CauList, OptGrid, GvAnswer, WriteLines, splitStem, CHROME_CSS, buildPagedCss, printWithFilename, uploadPagesAsLink, pageChrome } from './PrintView'

// headless+linkOnly (07-12) — dựng ẩn CHỈ để upload+ghi file_url, dùng bởi LinkGenWorker (hàng đợi
// toàn cục, xem component đó) khi 1 BT vừa tạo/sửa xong. Mirror ĐÚNG pattern DeThiPrintView/MTPrintView.
export default function BTPrintView({ id, onClose, headless, linkOnly, onFail, onReady, onRenderErr }: { id: string; onClose: () => void; headless?: boolean; linkOnly?: boolean; onFail?: () => void; onReady?: () => void; onRenderErr?: (msg: string) => void }) {
  const [bt, setBt] = useState<BT | null>(null)
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false)
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [, setDl] = useState(false)
  const [dlErr, setDlErr] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  const activeContainerRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    Promise.all([getBT(id), getTaiLieuFull(id)]).then(([b, f]) => { setBt(b); setFull(f) }).catch((e) => setErr(e.message ?? String(e)))
  }, [id])

  useEffect(() => {
    if (!full || !srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true)
    // ⭐ 08-19 (Thùy: "bỏ hẳn header footer cũ khỏi TẤT CẢ tài liệu" — BT bổ trợ bị sót khỏi đợt 08-08,
    // xem PrintView.tsx/ETPrintView.tsx/MTPrintView.tsx cùng dòng comment): dải sóng cũ vẫn hiện vì `ch`
    // truyền thẳng cau_hinh chưa ép 'none'. Ép cứng như mọi loại tài liệu khác.
    const ch0 = full.taiLieu.cau_hinh ?? {}
    const ch = { ...ch0, header: 'none' as const, footer: 'none' as const }
    const css = buildPagedCss(full.taiLieu, ch, ch.mau || '#7c3aed') + BT_CSS
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = srcRef.current.innerHTML
    // Race-safe: KHÔNG xoá DOM của container cũ (rút DOM giữa lúc paged.js còn đo layout dở → sinh trang
    // CHẠY LOẠN — xem DEVLOG 07-11). Run mới có container RIÊNG; resolve xong mới ẨN container khác +
    // trỏ activeContainerRef.
    const dst = dstRef.current
    const container = document.createElement('div')
    dst.appendChild(container)
    // Watchdog: paged.js từng TREO VĨNH VIỄN không resolve (xem DEVLOG 07-11) — quá 30s coi như treo.
    let settled = false
    const watchdog = setTimeout(() => {
      if (settled || cancelled) return
      settled = true
      container.style.display = 'none'
      setDlErr('Dựng trang quá lâu (>30s) — đóng rồi thử lại.'); setRendering(false)
      onRenderErr?.('Dựng trang quá lâu (>30s)')
    }, 30000)
    // Chờ font sẵn sàng TRƯỚC khi đo layout — xem PrintView.tsx (fix cùng đợt): thiếu bước này paged.js
    // đo bằng font fallback rồi font thật swap vào sau làm 1 khối bị đo/dựng 2 lần lệch nhau → trang
    // trắng + nội dung nhân đôi. Đồng bộ với PrintView.tsx/ETPrintView.tsx/MTPrintView.tsx (cùng lớp bug).
    ;(async () => {
      try { await (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready } catch { /* */ }
      if (settled || cancelled) return
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
    })()
    return () => { cancelled = true; clearTimeout(watchdog) }
  }, [full, gv])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  const printFileName = () => `${bt?.hoc_sinh?.ho_ten ?? ''} - ${full?.taiLieu.ten ?? ''}${gv ? ' - Bản GV' : ''}`
  async function layLink(): Promise<boolean> {
    if (!activeContainerRef.current || !full) return false
    setDl(true); setDlErr(null)
    const chChrome = { ...(full.taiLieu.cau_hinh ?? {}), header: 'none' as const, footer: 'none' as const }
    try { await uploadPagesAsLink(activeContainerRef.current, printFileName(), pageChrome(full.taiLieu, chChrome), full.taiLieu.id); return true }
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && bt && <BTDoc full={full} bt={bt} gv={gv} />}</div>
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
        <span className="text-sm font-semibold text-slate-800">Xem &amp; in BT</span>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setGv(false)} className={seg(!gv)}>Bản học sinh</button>
          <button onClick={() => setGv(true)} className={seg(gv)}>Bản giáo viên</button>
        </div>
        <span className="text-[12px] text-slate-400">{rendering ? 'đang dựng trang…' : `${pages} trang`}</span>
        {dlErr && <span className="text-[12px] text-rose-600">{dlErr}</span>}
        <div className="ml-auto flex gap-2">
          {/* "⬇ Tải PDF" cũ (html2canvas) đã BỎ — Thùy 07-11: dùng NATIVE print, đúng engine trình duyệt. */}
          <button onClick={() => printWithFilename(printFileName())} disabled={rendering} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 In / Xuất PDF</button>
          <button onClick={onClose} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Đóng</button>
        </div>
      </div>
      <div className="pv-scroll min-h-0 flex-1 overflow-auto py-6">
        {err ? <p className="text-center text-rose-600">Lỗi: {err}</p>
          : !full || !bt ? <p className="text-center text-slate-400">Đang tải…</p>
          : <div ref={dstRef} className="pv-pages" />}
      </div>
      <div ref={srcRef} className="pv-src" aria-hidden>{full && bt && <BTDoc full={full} bt={bt} gv={gv} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

// 1 câu — tôn trọng FORM ĐÃ CHỌN (etFormOf/etFormByCau), KHÔNG chỉ loai_cau gốc trong kho (Thùy 07-10:
// "chưa cho chọn tự luận để thêm dòng" — GV ép 1 câu hiển thị Tự luận thì phải in ra dòng kẻ tương ứng).
function BtCau({ no, c, gv, ch }: { no: number; c: CauHoi; gv: boolean; ch: CauHinh }) {
  const isDS = !!(c.menh_de && c.menh_de.length)
  if (isDS) return <CauItem no={no} c={c} gv={gv} />
  const form = etFormOf(c, ch)
  if (form === 'trac_nghiem') return <CauItem no={no} c={c} gv={gv} />
  const { stem, grid, emb } = splitStem(c)
  const lines = ch.btvnLinesByCau?.[c.ma_cau] ?? DEFAULT_BTVN_LINES
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

// 1 khối DẠNG — mirror DangBlock (PrintView.tsx, giáo trình): tiêu đề "Dạng: tên" + câu theo FORM đã chọn.
function DangBlockBT({ no, p, gv, ch }: { no: number; p: PhanResolved; gv: boolean; ch: CauHinh }) {
  return (
    <section className="pv-sec">
      <h2 className="pv-h-dang">Dạng {no}: {p.dang?.ten_dang ?? p.ref_ma}</h2>
      {p.caus.length > 0 && (
        <CauList kieu={p.kieu}>{p.caus.map((c, i) => <BtCau key={c.ma_cau} no={i + 1} c={c} gv={gv} ch={ch} />)}</CauList>
      )}
    </section>
  )
}

function BTDoc({ full, bt, gv }: { full: TaiLieuFull; bt: BT; gv: boolean }) {
  const ch = full.taiLieu.cau_hinh ?? {}
  const dangs = full.phans.filter((p) => p.loai_phan === 'dang')
  return (
    <div className="pv-mt" style={{ '--pv-accent': ch.mau || '#16a34a' } as CSSProperties}>
      <div className="pv-bt-head">
        <div className="pv-bt-titlewrap">
          <div className="pv-bt-eyebrow">Tài liệu bổ trợ (BT){gv ? ' · Đáp án' : ''}</div>
          <div className="pv-bt-title">{bt.hoc_sinh?.ho_ten} — {full.taiLieu.ten}</div>
        </div>
        {!gv && (
          <div className="pv-bt-row">
            <div className="pv-bt-info">
              <div className="pv-bt-field"><span className="pv-bt-lbl">Học sinh:</span><span className="pv-bt-filled">{bt.hoc_sinh?.ho_ten}{bt.hoc_sinh?.ma_hs ? ` (${bt.hoc_sinh.ma_hs})` : ''}</span></div>
              <div className="pv-bt-field"><span className="pv-bt-lbl">Khối:</span><span className="pv-bt-filled">{full.taiLieu.khoi}</span></div>
            </div>
          </div>
        )}
      </div>

      {dangs.length === 0 ? <p className="pv-empty">BT chưa có dạng nào.</p> : (
        dangs.map((p, i) => <DangBlockBT key={p.id} no={i + 1} p={p} gv={gv} ch={ch} />)
      )}
    </div>
  )
}

const BT_CSS = `
.pv-mt .pv-h-dang{border-bottom:none;padding-bottom:0}
.pv-empty{color:#8a9097;font-style:italic;margin-top:10px}
.pv-bt-filled{font-weight:600;color:#1e293b}
.pv-tln-ans{margin-top:6px;display:flex;align-items:center;gap:8px;font-size:14px}
.pv-tln-lbl{font-weight:700;color:#475569;white-space:nowrap}
.pv-tln-fill{flex:1;max-width:70mm;border-bottom:1.5px dotted #9aa6b2;height:14px}
`
