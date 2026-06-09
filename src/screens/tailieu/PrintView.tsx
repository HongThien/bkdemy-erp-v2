import { useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { getTaiLieuFull, type TaiLieuFull, type PhanResolved } from '../../lib/tailieu'
import { MathText } from '../kho/ui'
import type { CauHoi } from '../../lib/kho/api'

export default function PrintView({ id, onClose }: { id: string; onClose: () => void }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false) // false = bản HS · true = bản GV
  useEffect(() => { getTaiLieuFull(id).then(setFull).catch((e) => setErr(e.message ?? String(e))) }, [id])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`

  return createPortal(
    <div className="pv-overlay fixed inset-0 z-[80] flex flex-col bg-slate-300/90">
      <div className="no-print flex items-center gap-3 border-b border-slate-300 bg-white px-5 py-2.5 shadow-sm">
        <span className="text-sm font-semibold text-slate-800">Xuất giáo trình</span>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setGv(false)} className={seg(!gv)}>Bản học sinh</button>
          <button onClick={() => setGv(true)} className={seg(gv)}>Bản giáo viên</button>
        </div>
        <span className="text-[12px] text-slate-400">{gv ? 'kèm lời giải + đáp án' : 'chỉ đề bài + BTVN'}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => window.print()} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">🖨 In / Lưu PDF</button>
          <button onClick={onClose} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Đóng</button>
        </div>
      </div>
      <div className="pv-scroll min-h-0 flex-1 overflow-auto py-6">
        {err ? <p className="text-center text-rose-600">Lỗi: {err}</p>
          : !full ? <p className="text-center text-slate-400">Đang tải…</p>
          : <Doc full={full} gv={gv} />}
      </div>
      <style>{PRINT_CSS}</style>
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
    <div className="pv-sheet" style={{ '--pv-accent': accent } as CSSProperties}>
      {ch.footer !== 'none' && (
        <div className="pv-runfoot">
          <svg viewBox="0 0 1200 70" preserveAspectRatio="none"><defs><linearGradient id="pvf" x1="0" x2="1"><stop offset="0" stopColor="#2D9CDB" /><stop offset=".5" stopColor="#F7941E" /><stop offset="1" stopColor="#E91E8C" /></linearGradient></defs><path d="M0,70 V28 C940,-10 760,58 520,22 C320,-12 150,48 0,14 V70 Z" fill="url(#pvf)" /></svg>
          <span className="pv-foot-txt">BK ACADEMY · {taiLieu.ten} · Khối {taiLieu.khoi}</span>
        </div>
      )}
      {ch.watermark === 'logo' && <div className="pv-watermark"><img src="/Logo.png" alt="" /></div>}
      {ch.header !== 'none' && (
        <div className="pv-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none"><defs><linearGradient id="pvh" x1="0" x2="1"><stop offset="0" stopColor="#E91E8C" /><stop offset=".5" stopColor="#F7941E" /><stop offset="1" stopColor="#2D9CDB" /></linearGradient></defs><path d="M0,0 H1200 V72 C940,120 760,34 520,80 C320,120 150,62 0,92 Z" fill="url(#pvh)" /></svg>
        </div>
      )}
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

function LtBlock({ title, lt, big }: { title: string; lt?: { noi_dung: string; file_url: string | null; ten_file: string | null } | null; big?: boolean }) {
  if (!lt || (!lt.noi_dung?.trim() && !lt.file_url)) return null
  return (
    <section className="pv-sec">
      <h2 className={big ? 'pv-h-lt' : 'pv-h-bt'}>{title}</h2>
      {lt.noi_dung?.trim() && <div className="pv-box-lt"><div className="pv-math"><MathText>{lt.noi_dung}</MathText></div></div>}
      {lt.file_url && <a href={lt.file_url} className="pv-filelink">📎 {lt.ten_file || 'Tài liệu kèm'}</a>}
    </section>
  )
}

function DangBlock({ no, p, gv }: { no: number; p: PhanResolved; gv: boolean }) {
  return (
    <section className="pv-sec">
      <h2 className="pv-h-dang">Dạng {no}: {p.dang?.ten_dang ?? p.ref_ma}</h2>
      {p.lyThuyetDang?.noi_dung?.trim() && (
        <div className="pv-box-lt"><div className="pv-box-label">Lý thuyết · Ví dụ</div><div className="pv-math"><MathText>{p.lyThuyetDang.noi_dung}</MathText></div></div>
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

const PRINT_CSS = `
.pv-sheet{width:210mm;margin:0 auto;background:#fff;padding:0 14mm 16mm;box-shadow:0 8px 36px rgba(0,0,0,.18);color:#23272b;font-family:'Be Vietnam Pro',system-ui,sans-serif;font-size:15px;line-height:1.6}
.pv-wave-top{margin:0 -14mm}
.pv-wave-top svg{display:block;width:100%;height:58px}
.pv-cover{text-align:center;padding-bottom:14px;margin:8px 0 18px;border-bottom:2px solid var(--pv-accent,#E91E8C)}
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
.pv-cau{margin:12px 0;break-inside:avoid;page-break-inside:avoid}
.pv-cau-no{font-weight:700;color:var(--pv-accent,#E91E8C);margin-right:5px}
.pv-img{display:block;margin:7px auto;max-height:60mm;max-width:100%}
.pv-opts{display:grid;column-gap:22px;row-gap:11px;margin-top:7px;align-items:start}
.pv-opt{display:flex;align-items:flex-start;gap:5px;line-height:2}
.pv-correct{color:#16a34a;font-weight:700}
.pv-loigiai{margin-top:7px;padding:9px 11px;background:#f6f7f8;border-left:3px solid #cbd2d8;border-radius:5px;font-size:14px}
.pv-filelink{display:inline-block;margin-top:6px;color:#2D9CDB}
.pv-math .katex-text{display:inline}
.pv-runfoot{display:none}
.pv-watermark{display:none}
@page{size:A4;margin:13mm 13mm 18mm}
@media print{
  body *{visibility:hidden!important}
  #root{display:none!important}
  .pv-overlay,.pv-overlay *{visibility:visible!important}
  .pv-overlay{position:static!important;overflow:visible!important;background:#fff!important}
  .pv-scroll{overflow:visible!important;padding:0!important}
  .no-print{display:none!important}
  .pv-sheet{width:auto!important;margin:0!important;padding:0!important;box-shadow:none!important}
  .pv-wave-top{margin:0!important}
  .pv-runfoot{display:block!important;position:fixed;left:0;right:0;bottom:0;height:15mm}
  .pv-runfoot svg{display:block;width:100%;height:15mm}
  .pv-foot-txt{position:absolute;bottom:3.5mm;left:0;right:0;text-align:center;font-size:9px;color:#fff;font-weight:600;letter-spacing:.3px}
  .pv-watermark{display:flex!important;position:fixed;inset:0;align-items:center;justify-content:center;pointer-events:none;opacity:.05;z-index:0}
  .pv-watermark img{width:62%}
}
`
