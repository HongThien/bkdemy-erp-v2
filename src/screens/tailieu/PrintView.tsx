import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, DEFAULT_BTVN_LINES, type TaiLieuFull, type PhanResolved } from '../../lib/tailieu'
import type { CauHinh } from '../../lib/tailieu'
import { MathText } from '../kho/ui'
import type { CauHoi } from '../../lib/kho/api'

export default function PrintView({ id, onClose }: { id: string; onClose: () => void }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false) // false = bản HS · true = bản GV
  const [scope, setScope] = useState<'all' | 'giaotrinh' | 'btvn'>('all') // tách quyển: giáo trình (LT+luyện) vs BTVN riêng
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [renderErr, setRenderErr] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  useEffect(() => { getTaiLieuFull(id).then(setFull).catch((e) => setErr(e.message ?? String(e))) }, [id])
  // Doc 'btvn' (trích xuất) → chỉ có phần BTVN → mặc định scope BTVN.
  useEffect(() => { if (full?.taiLieu.loai === 'btvn') setScope('btvn') }, [full])

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
  }, [full, gv, scope])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`

  return createPortal(
    <div className="pv-overlay fixed inset-0 z-[80] flex flex-col bg-slate-300/90">
      <div className="no-print flex items-center gap-3 border-b border-slate-300 bg-white px-5 py-2.5 shadow-sm">
        <span className="text-sm font-semibold text-slate-800">Xem thử &amp; xuất giáo trình</span>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setGv(false)} className={seg(!gv)}>Bản học sinh</button>
          <button onClick={() => setGv(true)} className={seg(gv)}>Bản giáo viên</button>
        </div>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5" title="Tách quyển: in giáo trình và BTVN thành 2 file PDF riêng">
          <button onClick={() => setScope('all')} className={seg(scope === 'all')}>Toàn bộ</button>
          <button onClick={() => setScope('giaotrinh')} className={seg(scope === 'giaotrinh')}>Chỉ giáo trình</button>
          <button onClick={() => setScope('btvn')} className={seg(scope === 'btvn')}>Chỉ BTVN</button>
        </div>
        <span className="text-[12px] text-slate-400">{rendering ? 'đang dựng trang…' : `${pages} trang`}</span>
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <Doc full={full} gv={gv} scope={scope} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

type Buoi = { id: string; title: string; dangs: PhanResolved[]; btvns: PhanResolved[] }
function buildBuois(phans: PhanResolved[]): Buoi[] {
  const out: Buoi[] = []
  let cur: Buoi | null = null
  const ensure = () => { if (!cur) { cur = { id: 'implicit', title: '', dangs: [], btvns: [] }; out.push(cur) } return cur }
  for (const p of phans) {
    if (p.loai_phan === 'buoi') { cur = { id: p.id, title: p.tieu_de || 'Buổi', dangs: [], btvns: [] }; out.push(cur) }
    else if (p.loai_phan === 'dang') ensure().dangs.push(p)
    else if (p.loai_phan === 'btvn') ensure().btvns.push(p)
  }
  return out
}

function Doc({ full, gv, scope }: { full: TaiLieuFull; gv: boolean; scope: 'all' | 'giaotrinh' | 'btvn' }) {
  const { taiLieu, phans, ltChuyenDe, tenChuyenDe } = full
  const ch = taiLieu.cau_hinh ?? {}
  const accent = ch.mau || '#E91E8C'
  const linesByCau = ch.btvnLinesByCau ?? {}
  const buois = buildBuois(phans)
  // Đánh số dạng (trên lớp) LIÊN TỤC toàn giáo trình theo ma_dang (vd buổi1: dạng1,2 · buổi2: dạng3,4).
  const dangNoByMa: Record<string, number> = {}
  let n = 0
  for (const p of phans) if (p.loai_phan === 'dang' && p.ref_ma && !(p.ref_ma in dangNoByMa)) dangNoByMa[p.ref_ma] = ++n
  return (
    // .pv-rh/.pv-rf = running elements → paged.js đặt vào margin box (header/footer) MỌI trang.
    <div className={`pv-doc${scope === 'btvn' ? ' pv-doc-btvn' : ''}`} style={{ '--pv-accent': accent } as CSSProperties}>
      {ch.header !== 'none' && <div className="pv-rh">{taiLieu.ten} · Khối {taiLieu.khoi}</div>}
      {ch.footer !== 'none' && <div className="pv-rf">BK ACADEMY · {taiLieu.ten} · Khối {taiLieu.khoi}</div>}
      {/* QUYỂN BTVN: mỗi phiếu đã có header riêng (tên tài liệu + Họ tên/Lớp/Điểm) → BỎ bìa (khỏi thừa trang đầu). */}
      {scope !== 'btvn' && (
        <div className="pv-cover">
          {/* Logo nằm ở header (lặp mọi trang) → KHÔNG đặt thêm logo ở bìa để tránh trùng. */}
          <div className="pv-title">{taiLieu.ten}</div>
          <div className="pv-sub">KHỐI {taiLieu.khoi} · {scope === 'giaotrinh' ? 'LÝ THUYẾT + LUYỆN · ' : ''}{gv ? 'BẢN GIÁO VIÊN' : 'BẢN HỌC SINH'}</div>
        </div>
      )}
      {/* QUYỂN BTVN riêng = chỉ các phiếu BTVN (mỗi buổi). Còn lại = giáo trình (skip BTVN nếu 'giaotrinh'). */}
      {scope === 'btvn'
        ? buois.filter((b) => b.btvns.some((x) => x.caus.length)).map((b) => (
          <BtvnSheet key={b.id} btvns={b.btvns} gv={gv} docTitle={taiLieu.ten} buoiTitle={b.title} dangNoByMa={dangNoByMa} linesByCau={linesByCau} />
        ))
        : buois.map((b) => (
          <BuoiBlock key={b.id} buoi={b} gv={gv} scope={scope} docTitle={taiLieu.ten} ltCd={ltChuyenDe} tenCd={tenChuyenDe} dangNoByMa={dangNoByMa} linesByCau={linesByCau} />
        ))}
    </div>
  )
}

// 1 BUỔI: tiêu đề buổi → [LT chuyên đề + các dạng] gom theo chuyên đề → phiếu BTVN của buổi.
function BuoiBlock({ buoi, gv, scope, docTitle, ltCd, tenCd, dangNoByMa, linesByCau }: {
  buoi: Buoi; gv: boolean; scope: 'all' | 'giaotrinh'; docTitle: string; ltCd: Record<string, { noi_dung: string; file_url: string | null; ten_file: string | null } | null>; tenCd: Record<string, string>; dangNoByMa: Record<string, number>; linesByCau: Record<string, number>
}) {
  // Gom dạng liền nhau theo chuyên đề → mỗi nhóm hiện LT chuyên đề 1 lần (buổi tách chuyên đề vẫn có LT).
  const groups: { cd: string; dangs: PhanResolved[] }[] = []
  for (const d of buoi.dangs) {
    const cd = d.dang?.ma_chuyen_de ?? ''
    const last = groups[groups.length - 1]
    if (last && last.cd === cd) last.dangs.push(d); else groups.push({ cd, dangs: [d] })
  }
  return (
    <section className="pv-buoi">
      {buoi.title && <h1 className="pv-h-buoi">{buoi.title}</h1>}
      {groups.map((g, gi) => (
        <div key={gi}>
          <LtBlock title={`Lý thuyết chuyên đề: ${tenCd[g.cd] ?? ''}`} lt={ltCd[g.cd]} big />
          {g.dangs.map((d) => <DangBlock key={d.id} no={dangNoByMa[d.ref_ma ?? ''] ?? 0} p={d} gv={gv} />)}
        </div>
      ))}
      {scope === 'all' && buoi.btvns.some((b) => b.caus.length) && (
        <BtvnSheet btvns={buoi.btvns} gv={gv} docTitle={docTitle} buoiTitle={buoi.title} dangNoByMa={dangNoByMa} linesByCau={linesByCau} />
      )}
    </section>
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

// BTVN của 1 BUỔI = phiếu RIÊNG (sang trang mới), nhóm theo DẠNG (mirror trên lớp). HS viết thẳng vào dòng kẻ.
// Đầu phiếu: tiêu đề = tên tài liệu · trái = Họ tên + Lớp · phải = ô Điểm. Bản GV = đáp án (bỏ ô điền, hiện lời giải).
function BtvnSheet({ btvns, gv, docTitle, buoiTitle, dangNoByMa, linesByCau }: {
  btvns: PhanResolved[]; gv: boolean; docTitle: string; buoiTitle: string; dangNoByMa: Record<string, number>; linesByCau: Record<string, number>
}) {
  return (
    <section className="pv-sec pv-btvn">
      <div className="pv-bt-head">
        <div className="pv-bt-titlewrap">
          <div className="pv-bt-eyebrow">Bài tập về nhà{buoiTitle ? ` · ${buoiTitle}` : ''}{gv ? ' · Đáp án' : ''}</div>
          <div className="pv-bt-title">{docTitle}</div>
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
      {(() => { let bno = 0; return btvns.filter((b) => b.caus.length).map((b) => (
        <div key={b.id} className="pv-sec">
          <h2 className="pv-h-dang">Dạng {dangNoByMa[b.ref_ma ?? ''] ?? ''}: {b.dang?.ten_dang ?? b.ref_ma}</h2>
          {/* Số câu BTVN đếm LIÊN TỤC xuyên các dạng (dạng 1: 1,2 → dạng 2: 3,4,5…) — KHÔNG reset mỗi dạng. */}
          <ol className="pv-caulist">{b.caus.map((c) => { bno += 1; return <CauItem key={c.ma_cau} no={bno} c={c} gv={gv} lines={gv ? 0 : (linesByCau[c.ma_cau] ?? DEFAULT_BTVN_LINES)} /> })}</ol>
        </div>
      )) })()}
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
export function CauItem({ no, c, gv, lines = 0 }: { no: number; c: CauHoi; gv: boolean; lines?: number }) {
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
      {lines > 0 && !hasOpts && <div className="pv-write">{Array.from({ length: lines }).map((_, i) => <div key={i} className="pv-wline" />)}</div>}
    </li>
  )
}

// CSS toàn cục (màn hình + cô lập khi in) — KHÔNG đưa vào paged.js.
export const CHROME_CSS = `
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
.pv-cover{text-align:center;padding-bottom:14px;margin:8mm 0 18px;border-bottom:2px solid var(--pv-accent,#E91E8C)}
.pv-title{font-size:25px;font-weight:800;color:#23272b}
.pv-sub{color:#8a9097;font-size:12.5px;margin-top:5px;letter-spacing:1px}
.pv-sec{margin-top:18px}
.pv-h-lt{color:#2D9CDB;font-size:21px;font-weight:800;border-left:4px solid #2D9CDB;padding-left:8px;margin:0 0 5px}
.pv-h-dang{color:var(--pv-accent,#E91E8C);font-size:20px;font-weight:800;border-bottom:2px solid #e3e8ee;padding-bottom:3px;margin:0 0 5px}
.pv-h-btvn{color:#F7941E;font-size:20px;font-weight:800;margin:0 0 5px}
.pv-h-bt{color:#16a34a;font-weight:800;font-size:18px;margin:10px 0 3px}
.pv-box-lt{background:#eff7fd;border:1px solid #cfe6f5;border-radius:9px;padding:11px 13px;margin-top:6px}
.pv-box-label{font-size:18px;font-weight:800;text-transform:uppercase;color:#2D9CDB;letter-spacing:.3px;margin-bottom:5px}
.pv-caulist{list-style:none;margin:4px 0 0;padding:0}
.pv-cau{margin:12px 0;break-inside:avoid}
.pv-cau-no{font-weight:700;color:var(--pv-accent,#E91E8C);margin-right:5px}
.pv-img{display:block;margin:7px auto;max-height:60mm;max-width:100%}
.mt-img{display:block;margin:6px auto;max-height:60mm;max-width:100%;break-inside:avoid}
.pv-opts{display:grid;column-gap:22px;row-gap:11px;margin-top:7px;align-items:start}
.pv-opt{display:flex;align-items:flex-start;gap:5px;line-height:2}
.pv-correct{color:#16a34a;font-weight:700}
.pv-loigiai{margin-top:7px;padding:9px 11px;background:#f6f7f8;border-left:3px solid #cbd2d8;border-radius:5px;font-size:14px}
/* Buổi = tầng 1: mỗi buổi sang trang mới, có dải tiêu đề "Buổi N". */
.pv-buoi{break-before:page}
.pv-buoi:first-of-type{break-before:auto}
.pv-h-buoi{background:var(--pv-accent,#E91E8C);color:#fff;font-size:20px;font-weight:800;padding:7px 14px;border-radius:9px;margin:0 0 8px;letter-spacing:.5px;break-after:avoid}
/* BTVN = phiếu riêng → sang trang mới; mỗi bài có dòng kẻ chấm để HS viết thẳng vào phiếu. */
.pv-btvn{break-before:page}
/* Quyển BTVN riêng (scope btvn, không bìa): phiếu ĐẦU bắt đầu ngay trang 1, không chừa trang trống.
   Chỉ áp trong quyển BTVN (pv-doc-btvn) — KHÔNG đụng BTVN nhúng trong giáo trình (scope all vẫn sang trang). */
.pv-doc-btvn > .pv-btvn:first-of-type{break-before:auto}
/* Trong BTVN, tiêu đề dạng đi liền ngay câu 1 → bỏ gạch chân (không để như "dòng kẻ lạc" giữa Dạng và Câu 1). */
.pv-btvn .pv-h-dang{border-bottom:none;padding-bottom:0;margin-bottom:6px}
.pv-write{margin-top:7px}
.pv-wline{height:9mm;border-bottom:1px dotted #9aa6b2}
/* BTVN chảy LIÊN TỤC: câu được phép tách ngang trang (nửa trên / nửa dưới) thay vì nhảy cả câu → bỏ trống cuối trang. */
.pv-btvn .pv-cau{break-inside:auto}
.pv-btvn .pv-cau .pv-math:first-child{break-after:avoid}
/* Khối tiêu đề phiếu BTVN: tiêu đề (tên tài liệu) trên cùng · trái = họ tên + lớp · phải = ô điểm. */
.pv-bt-head{border:1.5px solid var(--pv-accent,#E91E8C);border-radius:12px;padding:12px 16px 14px;margin-bottom:16px;break-inside:avoid;break-after:avoid}
.pv-bt-titlewrap{text-align:center;margin-bottom:13px}
.pv-bt-eyebrow{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#8a9097}
.pv-bt-title{font-size:22px;font-weight:800;color:var(--pv-accent,#E91E8C);line-height:1.2;margin-top:2px}
.pv-bt-row{display:flex;align-items:stretch;gap:16px}
.pv-bt-info{flex:1;display:flex;flex-direction:column;justify-content:center;gap:11px}
.pv-bt-field{display:flex;align-items:flex-end;gap:7px;font-size:14.5px}
.pv-bt-lbl{font-weight:700;color:#23272b;white-space:nowrap}
.pv-bt-fill{flex:1;border-bottom:1.5px dotted #9aa6b2;height:15px}
.pv-bt-score{width:36mm;display:flex;flex-direction:column;border:1.5px solid var(--pv-accent,#E91E8C);border-radius:9px;overflow:hidden}
.pv-bt-score-lbl{background:var(--pv-accent,#E91E8C);color:#fff;font-weight:800;font-size:12.5px;letter-spacing:2px;text-align:center;padding:4px 0}
.pv-bt-score-box{flex:1;min-height:20mm}
.pv-filelink{display:inline-block;margin-top:6px;color:#2D9CDB}
.pv-math .katex-text{display:inline}
.pv-rh,.pv-rf{display:none}
/* Ngắt trang: tiêu đề/nhãn KHÔNG mồ côi cuối trang; mỗi khối lý thuyết không bị xé ngang */
.pv-h-lt,.pv-h-dang,.pv-h-btvn,.pv-h-bt,.pv-box-label{break-after:avoid}
.pv-sec{break-inside:auto}
.pv-blk{break-inside:auto;margin:0 0 5px}
.pv-blk:last-child{margin-bottom:0}
.pv-box-lt .mline{break-inside:avoid}
`

function cssStr(s: string): string { return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"' }
function waveUri(path: string, c1: string, c2: string, c3: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 100' preserveAspectRatio='none'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='${c1}'/><stop offset='.5' stop-color='${c2}'/><stop offset='1' stop-color='${c3}'/></linearGradient></defs><path d='${path}' fill='url(#g)'/></svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

// Stylesheet cho paged.js: A4 + lề + dải sóng full-bleed (pseudo của pagebox) + số trang (@page margin box).
export function buildPagedCss(taiLieu: TaiLieuFull['taiLieu'], ch: CauHinh, accent: string): string {
  const head = ch.header !== 'none', foot = ch.footer !== 'none'
  // Dải MÀU cao hơn (phủ gần hết dải) → text canh giữa nằm TRỌN trên màu, không rơi vào khoảng trắng trên sóng.
  const headUri = waveUri('M0,0 H1200 V84 C940,100 760,66 520,88 C300,100 150,76 0,92 Z', '#E91E8C', '#F7941E', '#2D9CDB')
  const footUri = waveUri('M0,100 H1200 V14 C940,0 760,34 520,10 C300,0 150,26 0,16 Z', '#2D9CDB', '#F7941E', '#E91E8C')
  const headTxt = cssStr(`${taiLieu.ten} · Khối ${taiLieu.khoi}`)
  const footTxt = cssStr(`BK ACADEMY · ${taiLieu.ten} · Khối ${taiLieu.khoi}`)
  const logoUrl = location.origin + '/Logo.png' // PHẢI tuyệt đối: paged.js rewrite url() theo base blob → '/x' sẽ throw
  // Chip trắng bo góc + viền làm nền cho logo (đọc rõ trên dải sóng). viewBox 140:30 = 42:9 mm → không méo.
  const chipUri = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 30'><rect x='1.2' y='1.2' width='137.6' height='27.6' rx='7' fill='#ffffff' stroke='#dfe5ec' stroke-width='1.4'/></svg>`)
  return CONTENT_CSS + `
.katex{font-size:0.95em!important}.pagedjs_page{font-family:'Times New Roman',Tinos,Times,serif;font-size:17px;color:#23272b;line-height:1.55;--pv-accent:${accent}}
.pagedjs_pagebox{position:relative}
${head ? `.pagedjs_pagebox::before{content:${headTxt};position:absolute;top:0;left:0;right:0;height:18mm;padding:0 10mm 0 50mm;box-sizing:border-box;background:url("${logoUrl}") 8mm 3.5mm / auto 5mm no-repeat, url("${chipUri}") 4.5mm 1.5mm / 42mm 9mm no-repeat, url("${headUri}") center/100% 100% no-repeat;display:flex;align-items:center;justify-content:flex-end;color:#fff;font-weight:700;font-size:11px;letter-spacing:.3px;text-shadow:0 1px 2px rgba(0,0,0,.25);z-index:1}` : ''}
${foot ? `.pagedjs_pagebox::after{content:${footTxt};position:absolute;bottom:0;left:0;right:0;height:15mm;padding:0 16mm;box-sizing:border-box;background:url("${footUri}") center/100% 100% no-repeat;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:11px;letter-spacing:.3px;text-shadow:0 1px 3px rgba(0,0,0,.35);z-index:1}` : ''}
@page{
  size:A4;
  margin:18mm 14mm 22mm;
  ${foot ? `@bottom-right{content:counter(page) " / " counter(pages);color:#1f2937;font-family:'Times New Roman',serif;font-weight:800;font-size:12px;vertical-align:top}` : ''}
}
`
}
