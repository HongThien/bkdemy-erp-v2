// IN CHUỖI BÀI của một mô hình Hình–Luyện cho HS làm (Thùy 23/10) — cùng engine paged.js + khung trang với
// ChuyenDeHinhPrintView (Bản học sinh / Bản giáo viên). Bố cục như file chuỗi Thùy soạn: giả thiết mô hình rồi lần lượt
// từng nhánh ("Nhánh phụ: …", "đi tiếp từ …"), mỗi khối = giả thiết + hình của nhánh + các bài; bản GV thêm lời giải.
// Thứ tự khối, số "Bài N." = số B hiển thị (suy, không lưu) — CayNhanh dựng sẵn model `KhoiIn` từ dữ liệu đã nạp.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { MathText } from '../ui'
import { CHROME_CSS, buildPagedCss, printWithFilename } from '../../tailieu/PrintView'

export type BaiIn = { ma: string; so: string; rieng: string | null; phatBieu: string; loiGiai: string | null; anhLoiGiai: string | null; doKho: number | null }
export type KhoiIn = { id: string; nhan: string; giaThiet: string; anh: string | null; bai: BaiIn[] }

const SAO = (n: number) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n))

export default function ChuoiHinhPrintView({ ten, ma, khoi, khois, onClose }: { ten: string; ma: string; khoi: string; khois: KhoiIn[]; onClose: () => void }) {
  const [gv, setGv] = useState(false)
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true); setErr(null)
    const css = buildPagedCss({ ten, khoi }, { header: 'none', footer: 'none' }, '#0f766e') + CHUOI_CSS
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
  }, [gv, ten, khoi, khois])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  const tenFile = `Chuỗi ${ma} - ${ten}${gv ? ' - Bản GV' : ''}`
  return createPortal(
    <div className="pv-overlay fixed inset-0 z-[80] flex flex-col bg-slate-300/90">
      <div className="no-print flex items-center gap-3 border-b border-slate-300 bg-white px-5 py-2.5 shadow-sm">
        <span className="text-sm font-semibold text-slate-800">In chuỗi bài · {ma}</span>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setGv(false)} className={seg(!gv)}>Bản học sinh</button>
          <button onClick={() => setGv(true)} className={seg(gv)}>Bản giáo viên</button>
        </div>
        <span className="text-[12px] text-slate-400">{rendering ? 'đang dựng trang…' : `${pages} trang`}</span>
        {err && <span className="text-[12px] text-rose-600">{err}</span>}
        <div className="ml-auto flex gap-2">
          <button onClick={() => printWithFilename(tenFile)} disabled={rendering} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 In / Xuất PDF</button>
          <button onClick={onClose} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Đóng</button>
        </div>
      </div>
      <div className="pv-scroll min-h-0 flex-1 overflow-auto py-6"><div ref={dstRef} className="pv-pages" /></div>
      <div ref={srcRef} className="pv-src" aria-hidden><Doc ten={ten} khoi={khoi} khois={khois} gv={gv} /></div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

function Doc({ ten, khoi, khois, gv }: { ten: string; khoi: string; khois: KhoiIn[]; gv: boolean }) {
  return (
    <div className="pv-chuoi">
      <div className="pv-bt-head"><div className="pv-bt-titlewrap">
        <div className="pv-bt-eyebrow">Chuỗi bài Hình · Khối {khoi}{gv ? ' · Bản giáo viên' : ''}</div>
        <div className="pv-bt-title">{ten}</div>
      </div></div>
      {!gv && <div className="ch-hs">Họ và tên: ……………………………………………… Lớp: ………… Ngày: …………</div>}
      {khois.map((k, i) => (
        <section key={k.id} className="ch-khoi">
          <div className="ch-dau">
            <div className="ch-chu">
              <div className={`ch-nhan ${i === 0 ? 'ch-goc' : ''}`}>{k.nhan}</div>
              <div className="pv-math ch-gt"><MathText>{k.giaThiet}</MathText></div>
            </div>
            {k.anh && <img className="ch-anh" src={k.anh} alt="" />}
          </div>
          {k.bai.map((b) => (
            <div key={b.ma} className="pv-cau ch-bai">
              <div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Bài ${b.so.replace(/\D/g, '')}.</span> `}>{[b.rieng, b.phatBieu].filter((x) => x && x.trim()).join(' ')}</MathText>
                {b.doKho != null && <span className="ch-sao" title={`Độ khó ${b.doKho}/5`}>{SAO(b.doKho)}</span>}</div>
              {gv && (b.loiGiai || b.anhLoiGiai) && (
                <div className="pv-loigiai">
                  {b.loiGiai && <div className="pv-math"><MathText className="lg-lien">{b.loiGiai}</MathText></div>}
                  {b.anhLoiGiai && <img className="pv-img" src={b.anhLoiGiai} alt="" />}
                </div>)}
            </div>))}
        </section>))}
    </div>
  )
}

// Khối giả thiết: chữ trái · hình phải, giữ liền với bài đầu tiên; bài được chảy qua trang (như chuyên đề).
const CHUOI_CSS = `
.pv-chuoi .pv-cau{break-inside:auto}
.pv-chuoi .ch-hs{margin:4px 0 10px;color:#334155}
.pv-chuoi .ch-khoi{margin-top:12px}
.pv-chuoi .ch-dau{display:flex;gap:14px;align-items:flex-start;break-inside:avoid;break-after:avoid;margin-bottom:4px}
.pv-chuoi .ch-chu{flex:1;min-width:0}
.pv-chuoi .ch-nhan{font-weight:800;font-size:15px;color:#334155;border-left:4px solid #0f766e;padding:2px 0 2px 8px;margin:2px 0 4px}
.pv-chuoi .ch-nhan.ch-goc{color:#0f766e}
.pv-chuoi .ch-gt{font-style:normal}
.pv-chuoi .ch-anh{width:32%;max-height:165px;object-fit:contain;flex-shrink:0}
.pv-chuoi .ch-bai{margin:3px 0 3px 4px}
.pv-chuoi .ch-sao{margin-left:8px;color:#c2410c;font-size:12px;letter-spacing:1px;white-space:nowrap}
`
