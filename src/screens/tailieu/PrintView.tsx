import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, type TaiLieuFull, type PhanResolved } from '../../lib/tailieu'
import type { CauHinh } from '../../lib/tailieu'
import { MathText } from '../kho/ui'
import type { CauHoi } from '../../lib/kho/api'

export default function PrintView({ id, onClose }: { id: string; onClose: () => void }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false) // false = bản HS · true = bản GV
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [renderErr, setRenderErr] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  useEffect(() => { getTaiLieuFull(id).then(setFull).catch((e) => setErr(e.message ?? String(e))) }, [id])

  // Phân trang THẬT bằng paged.js → preview = bản in (A4, header/footer + số trang mỗi trang).
  useEffect(() => {
    if (!full || !srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true); setRenderErr(null)
    const ch = full.taiLieu.cau_hinh ?? {}
    const css = buildPagedCss(full.taiLieu, ch, ch.mau || '#E91E8C')
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = srcRef.current.innerHTML
    dstRef.current.innerHTML = ''
    new Previewer().preview(html, [cssUrl], dstRef.current)
      .then((flow: { total?: number }) => { if (!cancelled) { setPages(flow?.total ?? 0); setRendering(false) } })
      .catch((e: unknown) => { if (!cancelled) { setRenderErr(e instanceof Error ? e.message : String(e)); setRendering(false) } })
      .finally(() => URL.revokeObjectURL(cssUrl))
    return () => { cancelled = true }
  }, [full, gv])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`

  return createPortal(
    <div className="pv-overlay fixed inset-0 z-[80] flex flex-col bg-slate-300/90">
      <div className="no-print flex items-center gap-3 border-b border-slate-300 bg-white px-5 py-2.5 shadow-sm">
        <span className="text-sm font-semibold text-slate-800">Xem thử &amp; xuất giáo trình</span>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setGv(false)} className={seg(!gv)}>Bản học sinh</button>
          <button onClick={() => setGv(true)} className={seg(gv)}>Bản giáo viên</button>
        </div>
        <span className="text-[12px] text-slate-400">{rendering ? 'đang dựng trang…' : `${pages} trang · ${gv ? 'kèm lời giải' : 'chỉ đề bài'}`}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => window.print()} disabled={rendering} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 In / Lưu PDF</button>
          <button onClick={onClose} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Đóng</button>
        </div>
      </div>
      <div className="pv-scroll min-h-0 flex-1 overflow-auto py-6">
        {err ? <p className="text-center text-rose-600">Lỗi: {err}</p>
          : !full ? <p className="text-center text-slate-400">Đang tải…</p>
          : <>
              {renderErr && <p className="no-print mb-3 text-center text-sm text-rose-600">Lỗi dựng trang: {renderErr}</p>}
              {rendering && !renderErr && <p className="no-print mb-3 text-center text-sm text-slate-400">Đang dựng trang…</p>}
              <div ref={dstRef} className="pv-pages" />
            </>}
      </div>
      {/* Nguồn ẩn — chỉ để lấy HTML cho paged.js (KaTeX đã render sẵn trong này) */}
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <Doc full={full} gv={gv} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

function Doc({ full, gv }: { full: TaiLieuFull; gv: boolean }) {
  const { taiLieu, phans } = full
  const ch = taiLieu.cau_hinh ?? {}
  const accent = ch.mau || '#E91E8C'
  let dangNo = 0
  return (
    // .pv-rh/.pv-rf = running elements → paged.js đặt vào margin box (header/footer) MỌI trang.
    <div className="pv-doc" style={{ '--pv-accent': accent } as CSSProperties}>
      {ch.header !== 'none' && <div className="pv-rh">{taiLieu.ten} · Khối {taiLieu.khoi}</div>}
      {ch.footer !== 'none' && <div className="pv-rf">BK ACADEMY · {taiLieu.ten} · Khối {taiLieu.khoi}</div>}
      <div className="pv-cover">
        <img src="/Logo.png" alt="BK Academy" />
        <div className="pv-title">{taiLieu.ten}</div>
        <div className="pv-sub">KHỐI {taiLieu.khoi} · {gv ? 'BẢN GIÁO VIÊN' : 'BẢN HỌC SINH'}</div>
      </div>
      {phans.map((p) => {
        if (p.loai_phan === 'lt_chuyen_de') return <LtBlock key={p.id} title={p.tieu_de || 'Lý thuyết chuyên đề'} lt={p.ltChuyenDe} big />
        if (p.loai_phan === 'dang') { dangNo += 1; return <DangBlock key={p.id} no={dangNo} p={p} gv={gv} /> }
        if (p.loai_phan === 'btvn') return p.caus.length ? <BtvnBlock key={p.id} title={p.tieu_de || 'Bài tập về nhà'} caus={p.caus} gv={gv} /> : null
        return p.noi_dung ? <section key={p.id} className="pv-sec"><MathText>{p.noi_dung}</MathText></section> : null
      })}
    </div>
  )
}

// Render nội dung lý thuyết thành các KHỐI (tách bởi dòng trống) — mỗi khối không bị xé ngang trang.
function LyThuyetBody({ text }: { text: string }) {
  const blocks = text.split(/\n[ \t]*\n/).map((b) => b.trim()).filter(Boolean)
  if (blocks.length <= 1) return <div className="pv-math"><MathText>{text}</MathText></div>
  return <>{blocks.map((b, i) => <div key={i} className="pv-blk pv-math"><MathText>{b}</MathText></div>)}</>
}

function LtBlock({ title, lt, big }: { title: string; lt?: { noi_dung: string; file_url: string | null; ten_file: string | null } | null; big?: boolean }) {
  if (!lt || (!lt.noi_dung?.trim() && !lt.file_url)) return null
  return (
    <section className="pv-sec">
      <h2 className={big ? 'pv-h-lt' : 'pv-h-bt'}>{title}</h2>
      {lt.noi_dung?.trim() && <div className="pv-box-lt"><LyThuyetBody text={lt.noi_dung} /></div>}
      {lt.file_url && <a href={lt.file_url} className="pv-filelink">📎 {lt.ten_file || 'Tài liệu kèm'}</a>}
    </section>
  )
}

function DangBlock({ no, p, gv }: { no: number; p: PhanResolved; gv: boolean }) {
  return (
    <section className="pv-sec">
      <h2 className="pv-h-dang">Dạng {no}: {p.dang?.ten_dang ?? p.ref_ma}</h2>
      {p.lyThuyetDang?.noi_dung?.trim() && (
        <div className="pv-box-lt"><div className="pv-box-label">Lý thuyết · Ví dụ</div><LyThuyetBody text={p.lyThuyetDang.noi_dung} /></div>
      )}
      {p.caus.length > 0 && (<>
        <div className="pv-h-bt">Bài luyện</div>
        <ol className="pv-caulist">{p.caus.map((c, i) => <CauItem key={c.ma_cau} no={i + 1} c={c} gv={gv} />)}</ol>
      </>)}
    </section>
  )
}

function BtvnBlock({ title, caus, gv }: { title: string; caus: CauHoi[]; gv: boolean }) {
  return (
    <section className="pv-sec">
      <h2 className="pv-h-btvn">{title}</h2>
      <ol className="pv-caulist">{caus.map((c, i) => <CauItem key={c.ma_cau} no={i + 1} c={c} gv={gv} />)}</ol>
    </section>
  )
}

// Ước lượng "độ rộng nhìn thấy" của 1 phương án (phân số tính theo chữ số dài nhất, lệnh latex = 1).
function optVisLen(s: string): number {
  return s.replace(/\$/g, '')
    .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, (_m, a: string, b: string) => '0'.repeat(Math.max(a.length, b.length)))
    .replace(/\\[a-zA-Z]+/g, 'x').replace(/[{}^_\\]/g, '').length
}
// Ngắn → 4 cột (1 dòng) · vừa → 2 cột (2×2) · dài → 1 cột (4 dòng).
function optCols(opts: string[]): number {
  const max = Math.max(0, ...opts.map(optVisLen))
  return max <= 6 ? 4 : max <= 16 ? 2 : 1
}
function CauItem({ no, c, gv }: { no: number; c: CauHoi; gv: boolean }) {
  const hasOpts = !!(c.lua_chon && c.lua_chon.length)
  const letter = (i: number) => String.fromCharCode(65 + i)
  const cols = hasOpts ? optCols(c.lua_chon!) : 0
  return (
    <li className="pv-cau">
      <div className="pv-math"><span className="pv-cau-no">Câu {no}.</span><MathText>{c.noi_dung}</MathText></div>
      {c.anh_de && <img src={c.anh_de} alt="" className="pv-img" />}
      {hasOpts && (
        <div className="pv-opts" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {c.lua_chon!.map((o, i) => {
            const correct = gv && (c.dap_an ?? '').trim().toUpperCase() === letter(i)
            return <div key={i} className={`pv-opt ${correct ? 'pv-correct' : ''}`}><b>{letter(i)}.</b> <span className="pv-math"><MathText>{o}</MathText></span>{correct ? ' ✓' : ''}</div>
          })}
        </div>
      )}
      {gv && (c.loi_giai || c.dap_an) && (
        <div className="pv-loigiai">
          {!hasOpts && c.dap_an && <div><b>Đáp án:</b> <MathText>{c.dap_an}</MathText></div>}
          {c.loi_giai && <div><b>Lời giải:</b> <MathText>{c.loi_giai}</MathText></div>}
          {c.anh_dap_an && <img src={c.anh_dap_an} alt="" className="pv-img" />}
        </div>
      )}
    </li>
  )
}

// CSS toàn cục (màn hình + cô lập khi in) — KHÔNG đưa vào paged.js.
const CHROME_CSS = `
.pv-src{position:absolute;left:-99999px;top:0;width:210mm;opacity:0;pointer-events:none}
.pv-pages{margin:0 auto}
.pv-pages .pagedjs_page{background:#fff;box-shadow:0 6px 22px rgba(0,0,0,.16);margin:0 auto 16px}
@media print{
  #root{display:none!important}
  .no-print{display:none!important}
  .pv-src{display:none!important}
  .pv-overlay{position:static!important;background:#fff!important}
  .pv-scroll{overflow:visible!important;padding:0!important}
  .pv-pages .pagedjs_page{box-shadow:none!important;margin:0!important}
}
`

// Style nội dung (pv-*) — dùng chung cho mọi trang paged.js.
const CONTENT_CSS = `
.pv-cover{text-align:center;padding-bottom:14px;margin:2mm 0 18px;border-bottom:2px solid var(--pv-accent,#E91E8C)}
.pv-cover img{height:50px}
.pv-title{font-size:25px;font-weight:800;margin-top:14px;color:#23272b}
.pv-sub{color:#8a9097;font-size:12.5px;margin-top:5px;letter-spacing:1px}
.pv-sec{margin-top:18px}
.pv-h-lt{color:#2D9CDB;font-size:18px;font-weight:800;border-left:4px solid #2D9CDB;padding-left:8px;margin:0 0 5px}
.pv-h-dang{color:var(--pv-accent,#E91E8C);font-size:17px;font-weight:800;border-bottom:2px solid #e3e8ee;padding-bottom:3px;margin:0 0 5px}
.pv-h-btvn{color:#F7941E;font-size:17px;font-weight:800;margin:0 0 5px}
.pv-h-bt{color:#16a34a;font-weight:700;font-size:14px;margin:9px 0 2px}
.pv-box-lt{background:#eff7fd;border:1px solid #cfe6f5;border-radius:9px;padding:11px 13px;margin-top:6px}
.pv-box-label{font-size:10.5px;font-weight:700;text-transform:uppercase;color:#2D9CDB;letter-spacing:.5px;margin-bottom:4px}
.pv-caulist{list-style:none;margin:4px 0 0;padding:0}
.pv-cau{margin:12px 0;break-inside:avoid}
.pv-cau-no{font-weight:700;color:var(--pv-accent,#E91E8C);margin-right:5px}
.pv-img{display:block;margin:7px auto;max-height:60mm;max-width:100%}
.pv-opts{display:grid;column-gap:22px;row-gap:11px;margin-top:7px;align-items:start}
.pv-opt{display:flex;align-items:flex-start;gap:5px;line-height:2}
.pv-correct{color:#16a34a;font-weight:700}
.pv-loigiai{margin-top:7px;padding:9px 11px;background:#f6f7f8;border-left:3px solid #cbd2d8;border-radius:5px;font-size:14px}
.pv-filelink{display:inline-block;margin-top:6px;color:#2D9CDB}
.pv-math .katex-text{display:inline}
.pv-rh,.pv-rf{display:none}
/* Ngắt trang: tiêu đề/nhãn KHÔNG mồ côi cuối trang; mỗi khối lý thuyết không bị xé ngang */
.pv-h-lt,.pv-h-dang,.pv-h-btvn,.pv-h-bt,.pv-box-label{break-after:avoid}
.pv-sec{break-inside:auto}
.pv-blk{break-inside:avoid;margin:0 0 5px}
.pv-blk:last-child{margin-bottom:0}
.pv-box-lt .mline{break-inside:avoid}
`

function cssStr(s: string): string { return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"' }
function waveUri(path: string, c1: string, c2: string, c3: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 100' preserveAspectRatio='none'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='${c1}'/><stop offset='.5' stop-color='${c2}'/><stop offset='1' stop-color='${c3}'/></linearGradient></defs><path d='${path}' fill='url(#g)'/></svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

// Stylesheet cho paged.js: A4 + lề + dải sóng full-bleed (pseudo của pagebox) + số trang (@page margin box).
function buildPagedCss(taiLieu: TaiLieuFull['taiLieu'], ch: CauHinh, accent: string): string {
  const head = ch.header !== 'none', foot = ch.footer !== 'none'
  const headUri = waveUri('M0,0 H1200 V68 C940,104 760,44 520,74 C300,106 150,56 0,78 Z', '#E91E8C', '#F7941E', '#2D9CDB')
  const footUri = waveUri('M0,100 V34 C940,2 760,60 520,28 C300,-4 150,48 0,24 V100 Z', '#2D9CDB', '#F7941E', '#E91E8C')
  const headTxt = cssStr(`${taiLieu.ten} · Khối ${taiLieu.khoi}`)
  const footTxt = cssStr(`BK ACADEMY · ${taiLieu.ten} · Khối ${taiLieu.khoi}`)
  const logoUrl = location.origin + '/Logo.png' // PHẢI tuyệt đối: paged.js rewrite url() theo base blob → '/x' sẽ throw
  // Chip trắng bo góc + viền làm nền cho logo (đọc rõ trên dải sóng). viewBox 140:30 = 42:9 mm → không méo.
  const chipUri = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 30'><rect x='1.2' y='1.2' width='137.6' height='27.6' rx='7' fill='#ffffff' stroke='#dfe5ec' stroke-width='1.4'/></svg>`)
  return CONTENT_CSS + `
.pagedjs_page{font-family:'Times New Roman',Tinos,Times,serif;font-size:16px;color:#23272b;line-height:1.55;--pv-accent:${accent}}
.pagedjs_pagebox{position:relative}
${head ? `.pagedjs_pagebox::before{content:${headTxt};position:absolute;top:0;left:0;right:0;height:18mm;padding:0 10mm 0 50mm;box-sizing:border-box;background:url("${logoUrl}") 8mm 3.5mm / auto 5mm no-repeat, url("${chipUri}") 4.5mm 1.5mm / 42mm 9mm no-repeat, url("${headUri}") center/100% 100% no-repeat;display:flex;align-items:center;justify-content:flex-end;color:#fff;font-weight:700;font-size:11px;letter-spacing:.3px;text-shadow:0 1px 2px rgba(0,0,0,.25);z-index:1}` : ''}
${foot ? `.pagedjs_pagebox::after{content:${footTxt};position:absolute;bottom:0;left:0;right:0;height:13mm;padding:0 16mm;box-sizing:border-box;background:url("${footUri}") center/100% 100% no-repeat;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:10px;letter-spacing:.3px;text-shadow:0 1px 2px rgba(0,0,0,.25);z-index:1}` : ''}
@page{
  size:A4;
  margin:18mm 14mm 17mm;
  ${foot ? `@bottom-right{content:counter(page) " / " counter(pages);color:#9aa6b2;font-family:'Times New Roman',serif;font-weight:600;font-size:10px;vertical-align:top}` : ''}
}
`
}
