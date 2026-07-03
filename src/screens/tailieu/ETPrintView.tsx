// In ET cho HS làm — engine paged.js (tái dùng từ PrintView). Phiếu: header Họ-tên/Lớp/Điểm + mã ET.
// 3 dạng: TRẮC NGHIỆM (CauItem có phương án) · TRẢ LỜI NGẮN (BẢNG: đề trái / ô điền đáp án phải) ·
// TỰ LUẬN (dòng kẻ để viết, số dòng = cau_hinh.btvnLinesByCau[ma_cau]). Bản GV = kèm đáp án/lời giải.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, etFormOf, type TaiLieuFull } from '../../lib/tailieu'
import type { CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import { CauItem, OptGrid, GvAnswer, splitStem, CHROME_CSS, buildPagedCss, downloadPagesPdf, pageChrome } from './PrintView'

const DEFAULT_TL_LINES = 4

// headless = tự dựng ẩn → tải PDF → đóng (nút "⬇ Tải" ngay ở hàng Kho tài liệu, không mở preview).
export default function ETPrintView({ id, onClose, headless }: { id: string; onClose: () => void; headless?: boolean }) {
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
    const css = buildPagedCss(full.taiLieu, ch, ch.mau || '#7c3aed') + ET_CSS
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = srcRef.current.innerHTML
    // Race-safe (như PrintView): render vào container riêng, run stale tự xoá → chống paged.js nhân đôi trang.
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <ETDoc full={full} gv={gv} />}</div>
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
        <span className="text-sm font-semibold text-slate-800">Xem &amp; in ET</span>
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
  // gom theo FORM HIỂN THỊ đã chọn trong ET (etFormOf), KHÔNG theo loai_cau kho.
  // Câu Đúng/Sai (menh_de) → luôn đi nhánh CauItem (render đề chung + 4 mệnh đề); bảng trả-lời-ngắn không hiển thị nổi.
  const isDS = (c: CauHoi) => !!(c.menh_de && c.menh_de.length)
  const tn = caus.filter((c) => isDS(c) || etFormOf(c, ch) === 'trac_nghiem')
  const tln = caus.filter((c) => !isDS(c) && etFormOf(c, ch) === 'tra_loi_ngan')
  const tl = caus.filter((c) => !isDS(c) && etFormOf(c, ch) === 'tu_luan')
  let no = 0
  const next = () => ++no
  const roman = ['I', 'II', 'III', 'IV']
  let sec = 0
  const part = () => roman[sec++]
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

      {tn.length > 0 && (
        <section className="pv-sec"><h2 className="pv-h-dang">Phần {part()} · Trắc nghiệm</h2>
          <ol className="pv-caulist">{tn.map((c) => <CauItem key={c.ma_cau} no={next()} c={c} gv={gv} />)}</ol>
        </section>
      )}

      {tln.length > 0 && (
        <section className="pv-sec"><h2 className="pv-h-dang">Phần {part()} · Trả lời ngắn</h2>
          <table className="pv-et-tn"><tbody>{tln.map((c) => {
            const { stem, grid, emb } = splitStem(c) // ý con nhiều dòng → lưới cột (như trắc nghiệm), không đổ 6 dòng
            return (
              <tr key={c.ma_cau}>
                <td className="q"><div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Câu ${next()}.</span> `}>{stem}</MathText></div>{grid && <OptGrid grid={grid} emb={emb} />}</td>
                {/* Bản GV = đáp án + LỜI GIẢI chi tiết (không chỉ đáp án ngắn) */}
                <td className="a">{gv && (c.dap_an || c.loi_giai || c.anh_dap_an) ? (
                  <div className="pv-et-ans">
                    {c.dap_an && <div><b>Đáp án:</b> <MathText>{c.dap_an}</MathText></div>}
                    {c.loi_giai && <div className="pv-et-giai"><b>Lời giải:</b> <MathText>{c.loi_giai}</MathText></div>}
                    {c.anh_dap_an && <img src={c.anh_dap_an} alt="" className="pv-img" />}
                  </div>
                ) : ''}</td>
              </tr>
            )
          })}</tbody></table>
        </section>
      )}

      {tl.length > 0 && (
        <section className="pv-sec"><h2 className="pv-h-dang">Phần {part()} · Tự luận</h2>
          {/* Tự luận = đề + dòng kẻ (BỎ phương án dù câu kho có) · bản GV = đáp án/lời giải */}
          <ol className="pv-caulist">{tl.map((c) => {
            const { stem, grid, emb } = splitStem(c)
            return (
              <li key={c.ma_cau} className="pv-cau">
                <div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Câu ${next()}.</span> `}>{stem}</MathText></div>
                {grid && <OptGrid grid={grid} emb={emb} />}
                {c.anh_de && <img src={c.anh_de} alt="" className="pv-img" />}
                {gv
                  ? <GvAnswer c={c} />
                  : grid ? null : <div className="pv-write">{Array.from({ length: lines[c.ma_cau] ?? DEFAULT_TL_LINES }).map((_, k) => <div key={k} className="pv-wline" />)}</div>}
              </li>
            )
          })}</ol>
        </section>
      )}

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
.pv-et-tn{width:100%;border-collapse:collapse;margin-top:6px}
.pv-et-tn td{border:1px solid #cbd2d8;padding:8px 10px;vertical-align:top;font-size:15px}
.pv-et-tn td.q{width:66%}
.pv-et-tn td.a{width:34%;min-height:11mm}
/* Bản GV: ô đáp án chứa đáp án + lời giải chi tiết (font hơi nhỏ để gọn trong cột 34%). */
.pv-et-ans{font-size:13.5px;line-height:1.5}
.pv-et-giai{margin-top:3px;color:#334155}
.pv-empty{color:#8a9097;font-style:italic;margin-top:10px}
/* Heading "Phần …" KHÔNG gạch chân (gạch trông như dòng kẻ lạc — đã sửa ở BTVN hôm trước). */
.pv-et .pv-h-dang{border-bottom:none;padding-bottom:0;margin-bottom:6px}
/* Câu CHẢY liên tục: cho tách ngang trang thay vì nhảy cả câu → KHÔNG bỏ trống cuối trang. */
.pv-et .pv-cau{break-inside:auto}
.pv-et .pv-cau .pv-math:first-child{break-after:avoid}
`
