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
import { CauItem, CauList, OptGrid, GvAnswer, WriteLines, splitStem, CHROME_CSS, buildPagedCss, downloadPagesPdf, pageChrome } from './PrintView'

export default function BTPrintView({ id, onClose }: { id: string; onClose: () => void }) {
  const [bt, setBt] = useState<BT | null>(null)
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false)
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [dl, setDl] = useState(false)
  const [dlErr, setDlErr] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    Promise.all([getBT(id), getTaiLieuFull(id)]).then(([b, f]) => { setBt(b); setFull(f) }).catch((e) => setErr(e.message ?? String(e)))
  }, [id])

  useEffect(() => {
    if (!full || !srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true)
    const ch = full.taiLieu.cau_hinh ?? {}
    const css = buildPagedCss(full.taiLieu, ch, ch.mau || '#7c3aed') + BT_CSS
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = srcRef.current.innerHTML
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
    if (!dstRef.current || !full || !bt) return
    setDl(true); setDlErr(null)
    try { await downloadPagesPdf(dstRef.current, `${bt.hoc_sinh?.ho_ten ?? ''} - ${full.taiLieu.ten}${gv ? ' - Bản GV' : ''}`, pageChrome(full.taiLieu, full.taiLieu.cau_hinh ?? {})) }
    catch (e) { setDlErr('Tải PDF lỗi: ' + (e instanceof Error ? e.message : String(e))) }
    finally { setDl(false) }
  }

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
          <button onClick={taiPdf} disabled={rendering || dl} className="rounded-md border border-indigo-300 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 disabled:opacity-40">{dl ? '⏳ Đang tạo…' : '⬇ Tải PDF'}</button>
          <button onClick={() => window.print()} disabled={rendering} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 In</button>
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
