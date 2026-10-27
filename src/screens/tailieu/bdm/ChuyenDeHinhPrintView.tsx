// In CHUYÊN ĐỀ HÌNH (Thùy 21/10) — tái dùng engine paged.js + CSS chung của PrintView (cùng khuôn DeThiPrintView).
// Phần → mô hình → bài (đề chung + hình + các ý a, b, c… — hình đi theo ý). Bản GV thêm đáp án + lời giải từng ý.
// Số "Bài N." đếm LIÊN TỤC cả tài liệu (suy lúc in, không lưu). Nội dung đọc 1 lần fn_tl_hl_noi_dung.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { cdhNoiDung, type CdhNoiDung } from '../../../lib/chuyenDeHinh'
import { nguonCau } from '../../../lib/tailieuBdm'
import { BaiHinhIn, CDH_CSS } from './HinhLuyenIn'
import { CHROME_CSS, buildPagedCss, printWithFilename } from '../PrintView'

export default function ChuyenDeHinhPrintView({ id, onlyPhanId, onClose }: { id: string; onlyPhanId?: string; onClose: () => void }) {
  const [nd, setNd] = useState<CdhNoiDung | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false)
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  const [nguon, setNguon] = useState<Record<string, string>>({})   // chú thích "đề cương / đề thi trường nào" từng bài (fn_tl_nguon_cau)
  // Nạp nội dung + nguồn CÙNG LÚC rồi mới set ⇒ dựng trang 1 lần.
  useEffect(() => {
    Promise.all([cdhNoiDung(id, onlyPhanId ?? null), nguonCau(id)])
      .then(([n, m]) => { setNguon(m); setNd(n) }).catch((e) => setErr(e.message ?? String(e)))
  }, [id, onlyPhanId])

  useEffect(() => {
    if (!nd?.tai_lieu || !srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true)
    const ch = { ...(nd.tai_lieu.cau_hinh ?? {}), header: 'none' as const, footer: 'none' as const }
    const css = buildPagedCss({ ten: nd.tai_lieu.ten, khoi: nd.tai_lieu.khoi }, ch, (ch as { mau?: string }).mau || '#2D9CDB') + CDH_CSS
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = srcRef.current.innerHTML
    const dst = dstRef.current
    const container = document.createElement('div')
    dst.appendChild(container)
    let settled = false
    const watchdog = setTimeout(() => { if (settled || cancelled) return; settled = true; container.style.display = 'none'; setErr('Dựng trang quá lâu (>30s) — đóng rồi thử lại.'); setRendering(false) }, 30000)
    ;(async () => {
      try { await (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready } catch { /* */ }
      if (settled || cancelled) return
      new Previewer().preview(html, [cssUrl], container)
        .then((flow: { total?: number }) => {
          if (settled) return
          settled = true; clearTimeout(watchdog)
          if (cancelled) { container.style.display = 'none'; return }
          Array.from(dst.children).forEach((c) => { if (c !== container) (c as HTMLElement).style.display = 'none' })
          setPages(flow?.total ?? 0); setRendering(false)
        })
        .catch((e: unknown) => { if (settled) return; settled = true; clearTimeout(watchdog); container.style.display = 'none'; if (!cancelled) { setErr('Dựng trang lỗi: ' + (e instanceof Error ? e.message : String(e))); setRendering(false) } })
        .finally(() => URL.revokeObjectURL(cssUrl))
    })()
    return () => { cancelled = true; clearTimeout(watchdog) }
  }, [nd, gv])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  const ten = nd?.tai_lieu?.ten ?? 'Chuyên đề'
  return createPortal(
    <div className="pv-overlay fixed inset-0 z-[80] flex flex-col bg-slate-300/90">
      <div className="no-print flex items-center gap-3 border-b border-slate-300 bg-white px-5 py-2.5 shadow-sm">
        <span className="text-sm font-semibold text-slate-800">{onlyPhanId ? 'Xem thử phần' : 'Xem & in chuyên đề Hình'}</span>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setGv(false)} className={seg(!gv)}>Bản học sinh</button>
          <button onClick={() => setGv(true)} className={seg(gv)}>Bản giáo viên</button>
        </div>
        <span className="text-[12px] text-slate-400">{rendering ? 'đang dựng trang…' : `${pages} trang`}</span>
        {err && <span className="text-[12px] text-rose-600">{err}</span>}
        <div className="ml-auto flex gap-2">
          <button onClick={() => printWithFilename(`${ten}${gv ? ' - Bản GV' : ''}`)} disabled={rendering} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 In / Xuất PDF</button>
          <button onClick={onClose} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Đóng</button>
        </div>
      </div>
      <div className="pv-scroll min-h-0 flex-1 overflow-auto py-6">
        {!nd ? <p className="text-center text-slate-400">{err ?? 'Đang tải…'}</p> : <div ref={dstRef} className="pv-pages" />}
      </div>
      <div ref={srcRef} className="pv-src" aria-hidden>{nd && <Doc nd={nd} gv={gv} nguon={nguon} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

function Doc({ nd, gv, nguon }: { nd: CdhNoiDung; gv: boolean; nguon: Record<string, string> }) {
  const ch = (nd.tai_lieu?.cau_hinh ?? {}) as { mau?: string }
  let no = 0
  return (
    <div className="pv-cdh" style={{ '--pv-accent': ch.mau || '#2D9CDB' } as CSSProperties}>
      <div className="pv-bt-head"><div className="pv-bt-titlewrap">
        <div className="pv-bt-eyebrow">Chuyên đề Hình · Khối {nd.tai_lieu?.khoi}{gv ? ' · Bản giáo viên' : ''}</div>
        <div className="pv-bt-title">{nd.tai_lieu?.ten}</div>
      </div></div>
      {nd.buoi.map((p) => (
        <section key={p.id} className="pv-sec">
          <h2 className="pv-h-dang">{p.tieu_de}</h2>
          {p.mo_hinh.length === 0 && !p.khac?.bai.length && <p className="pv-empty">Phần này chưa có mô hình.</p>}
          {/* Khối bài chưa có mô hình in cuối phần, đầu "Bài tập khác"; phần CHỈ có khối này thì không lặp đầu (tên phần đã nói). */}
          {[...p.mo_hinh, ...(p.khac?.bai.length ? [{ phan_id: p.khac.phan_id, ten: p.mo_hinh.length ? 'Bài tập khác' : '', bai: p.khac.bai }] : [])].map((m) => (
            <div key={m.phan_id} className="cdh-mh">
              {m.ten !== '' && <div className="cdh-mh-head">{m.ten ?? '(mô hình đã xoá khỏi bản đồ)'}</div>}
              {m.bai.map((b) => { no += 1; return <BaiHinhIn key={b.ma_bai} b={b} no={no} gv={gv} nguon={nguon[b.ma_bai]} /> })}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
