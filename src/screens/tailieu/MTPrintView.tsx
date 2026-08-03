// In MT (kỳ thi lớn) — tái dùng engine PrintView (paged.js), mẫu bám sát DeThiPrintView/ETPrintView.
// GIỮ NGUYÊN cấu trúc PHẦN + THỨ TỰ GỐC (không gom lại theo loại câu) — đúng yêu cầu Thùy 07-08 "cấu
// trúc chấm/in MT phải giống file MT được gán, không làm phẳng". Mỗi câu tôn trọng FORM HIỂN THỊ
// (`etFormByCau`/`etFormOf`, GIỐNG ET — MT dùng chung cơ chế "chỉnh dòng" với ET): câu kho có phương án
// nhưng bị ép hiển thị "tự luận"/"trả lời ngắn" thì KHÔNG hiện phương án (CauItem tự động hiện phương án
// nếu có lua_chon nên không dùng thẳng được cho 2 form này — phải tách stem thủ công như ET đã làm).
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, etFormOf, khoCuaMon, type TaiLieuFull, type CauHinh } from '../../lib/tailieu'
import { fetchCausByMa } from '../../lib/ontap'
import type { CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import { cauItemParts, CauFlow, OptGrid, GvAnswer, splitStem, CHROME_CSS, buildPagedCss, uploadPagesAsLink, pageChrome, printWithFilename } from './PrintView'

const DEFAULT_TL_LINES = 4

// headless = tự dựng ẩn → tải PDF → đóng (nút "⬇ Tải" ngay ở hàng Kho tài liệu, không mở preview).
// perHS (Thùy: "MT in trước khi vào lớp, phải in cho CẢ danh sách lớp" — khác ET in theo HS CÓ MẶT vì ET
// in trong buổi, sau điểm danh): mỗi HS 1 phiếu, mã đề đã gán + tên/lớp in sẵn (gán ở màn Chia đề MT).
// Không truyền → in 3 mã đề liên tiếp như cũ (ô tên trống, dùng làm bản lưu/photo tại chỗ).
export default function MTPrintView({ id, onClose, headless, linkOnly, onFail, onReady, onRenderErr, perHS, lopTen }: { id: string; onClose: () => void; headless?: boolean; linkOnly?: boolean; onFail?: () => void; onReady?: () => void; onRenderErr?: (msg: string) => void; perHS?: { id: string; ho_ten: string; maDe: number }[]; lopTen?: string }) {
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
  // Câu của MÃ ĐỀ 2/3 (chỉ lưu ma_cau trong cau_hinh.etMaDe) — nạp nội dung để in (giống ETPrintView).
  // varReady chặn paged.js dựng TRƯỚC khi có câu 2/3 (không thì đề 2/3 in RỖNG rồi headless tự in mất).
  const [varCau, setVarCau] = useState<Record<string, CauHoi>>({})
  const [varReady, setVarReady] = useState(false)
  useEffect(() => { getTaiLieuFull(id).then(setFull).catch((e) => setErr(e.message ?? String(e))) }, [id])
  useEffect(() => {
    if (!full) return
    setVarReady(false)
    const ch = full.taiLieu.cau_hinh ?? {}
    const need = new Set<string>()
    for (const arr of Object.values(ch.etMaDe ?? {})) for (const m of arr) if (m) need.add(m)
    if (!need.size) { setVarCau({}); setVarReady(true); return }
    let alive = true
    fetchCausByMa([...need], khoCuaMon(full.taiLieu.mon).cauTbl)
      .then((cs) => { if (alive) { setVarCau(Object.fromEntries(cs.map((c) => [c.ma_cau, c]))); setVarReady(true) } })
      .catch(() => { if (alive) setVarReady(true) })
    return () => { alive = false }
  }, [full])

  useEffect(() => {
    if (!full || !varReady || !srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true)
    // Bỏ HẲN dải header chrome (Thùy chốt: MT/ET/giáo trình đều bỏ header) — MT đã có đầu đề pv-bt-head
    // trong thân; giữ footer (số trang + liên hệ).
    const ch = { ...(full.taiLieu.cau_hinh ?? {}), header: 'none' as const }
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
  }, [full, gv, varReady])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  const printFileName = () => `${full?.taiLieu.ten ?? ''}${gv ? ' - Bản GV' : ''}`
  // "🔗 Lấy link" — CHỈ dùng cho linkOnly (headless). "⬇ Tải PDF" cũ đã BỎ, giờ dùng NATIVE print
  // (window.print(), xem uploadPagesAsLink trong PrintView.tsx — quyết định kiến trúc 07-11).
  async function layLink(): Promise<boolean> {
    if (!activeContainerRef.current || !full) return false
    setDl(true); setDlErr(null)
    try { await uploadPagesAsLink(activeContainerRef.current, printFileName(), pageChrome(full.taiLieu, { ...(full.taiLieu.cau_hinh ?? {}), header: 'none' as const }), full.taiLieu.id); return true }
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <MTDoc full={full} gv={gv} varCau={varCau} perHS={perHS} lopTen={lopTen} />}</div>
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <MTDoc full={full} gv={gv} varCau={varCau} perHS={perHS} lopTen={lopTen} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

// 1 câu trong MT tách ĐỀ/ĐÁP ÁN (cho CauColumns ghép cặp) — tôn trọng FORM HIỂN THỊ (etFormOf), KHÁC
// cauItemParts thô (luôn hiện lua_chon nếu câu kho có). Đúng/Sai (menh_de) + trắc nghiệm → dùng cauItemParts.
// ⚠ CHỈ còn gọi cho tự luận (bản HS) và MỌI form ở bản GV — trả lời ngắn (bản HS) giờ render qua
// MTTlnTable/mtRunsOf (bảng câu-hỏi|ô-đáp-án), KHÔNG còn đi qua hàm này nữa (xem mtRunsOf).
function mtCauParts(no: number, c: CauHoi, gv: boolean, ch: CauHinh): { content: React.ReactNode; lines: number } {
  const isDS = !!(c.menh_de && c.menh_de.length)
  if (isDS || etFormOf(c, ch) === 'trac_nghiem') return cauItemParts({ no, c, gv })
  // tự luận / trả lời ngắn (bản GV) ÉP hiển thị: bỏ qua lua_chon dù câu kho có (tách stem thủ công, giống ET).
  const { stem, grid, emb } = splitStem(c)
  const form = etFormOf(c, ch)
  const nLines = ch.btvnLinesByCau?.[c.ma_cau] ?? DEFAULT_TL_LINES
  return {
    content: (<>
      <div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Câu ${no}.</span> `}>{stem}</MathText></div>
      {grid && <OptGrid grid={grid} emb={emb} />}
      {c.anh_de && <img src={c.anh_de} alt="" className="pv-img" />}
      {gv && <GvAnswer c={c} />}
    </>),
    lines: (!gv && !grid && form === 'tu_luan') ? nLines : 0,
  }
}
// Câu hỏi THUẦN (đề + hình + grid nhúng, KHÔNG đáp án/dòng kẻ) — dùng trong ô cột 1 của MTTlnTable.
function tlnQuestionContent(no: number, c: CauHoi): React.ReactNode {
  const { stem, grid, emb } = splitStem(c)
  return (<>
    <div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Câu ${no}.</span> `}>{stem}</MathText></div>
    {grid && <OptGrid grid={grid} emb={emb} />}
    {c.anh_de && <img src={c.anh_de} alt="" className="pv-img" />}
  </>)
}
// Trả lời ngắn (Thùy: "đưa về dạng bảng — cột 1 câu hỏi, cột 2 chỗ ghi đáp án") — BẢNG 2 cột thay cho
// dòng chấm-chấm 1 dòng cũ. KHÔNG dùng <table>/CSS grid/column-count (paged.js TREO — xem PrintView.tsx
// "Nhiều cột = ghép câu theo HÀNG, KHÔNG column-count/grid/table" / DEVLOG 07-05) — dựng bằng div/flex
// như CauColumns, mỗi hàng break-inside:avoid nhưng cả khối vẫn CHẢY được (ngắt giữa các hàng).
function MTTlnTable({ rows }: { rows: { key: string; content: React.ReactNode }[] }) {
  return (
    <div className="pv-tlnt">
      {rows.map((r) => (
        <div key={r.key} className="pv-tlnt-row">
          <div className="pv-tlnt-q">{r.content}</div>
          <div className="pv-tlnt-a" />
        </div>
      ))}
    </div>
  )
}
// Gom câu TRẢ LỜI NGẮN LIÊN TIẾP (bản HS) thành 1 BẢNG — chỉ gộp TRÌNH BÀY các câu CÙNG NHÓM liền kề,
// KHÔNG đổi thứ tự/cấu trúc phần gốc (giữ đúng bất biến MT "giữ nguyên cấu trúc phần + thứ tự", xem đầu
// file). Bản GV giữ style cũ (đáp án hiện luôn qua GvAnswer, không cần bảng) → chỉ gom khi !gv.
function mtRunsOf(caus: CauHoi[], mapCau: (c: CauHoi, v: number | null) => CauHoi, ver: { v: number | null; ch: CauHinh }, gv: boolean): { tln: boolean; items: CauHoi[] }[] {
  const runs: { tln: boolean; items: CauHoi[] }[] = []
  for (const c of caus) {
    const m = mapCau(c, ver.v)
    const isTln = !gv && !(m.menh_de && m.menh_de.length) && etFormOf(m, ver.ch) === 'tra_loi_ngan'
    const last = runs[runs.length - 1]
    if (last && last.tln === isTln) last.items.push(c)
    else runs.push({ tln: isTln, items: [c] })
  }
  return runs
}

// 3 MÃ ĐỀ (như ET): đề gốc = câu các phần; đề 2/3 = thay từng câu bằng ma_cau trong etMaDe (neo theo CÂU
// GỐC, GIỮ NGUYÊN cấu trúc phần + thứ tự). Chưa đủ mã đề (etMaDe thiếu/ô trống) → in 1 đề như cũ.
// perHS: mỗi HS 1 phiếu ĐÚNG mã đề đã gán (thay vì luôn in đủ 3 mã đề liên tiếp) + tên/lớp in sẵn.
function MTDoc({ full, gv, varCau, perHS, lopTen }: { full: TaiLieuFull; gv: boolean; varCau: Record<string, CauHoi>; perHS?: { id: string; ho_ten: string; maDe: number }[]; lopTen?: string }) {
  const ch = full.taiLieu.cau_hinh ?? {}
  const phans = full.phans.filter((p) => p.loai_phan === 'custom')
  const base = phans.flatMap((p) => p.caus)
  const etMaDe = ch.etMaDe
  const complete = !!etMaDe && base.length > 0 && base.every((c) => { const a = etMaDe[c.ma_cau]; return a && a[0] && a[1] })
  // Map câu gốc → biến thể theo version v (0=đề2, 1=đề3). Thiếu nội dung biến thể → FALLBACK câu gốc
  // (giữ vị trí + đúng dạng), KHÔNG dồn. v=null = đề gốc.
  const mapCau = (c: CauHoi, v: number | null): CauHoi => (v == null ? c : (varCau[etMaDe![c.ma_cau][v] as string] ?? c))
  // Biến thể KẾ THỪA số dòng (tự luận) của câu gốc: lines keyed theo ma_cau → map ma_cau gốc → biến thể.
  const chVar = (v: number): CauHinh => {
    const lines = { ...(ch.btvnLinesByCau ?? {}) }
    for (const c of base) { const vm = etMaDe![c.ma_cau][v]; const bl = ch.btvnLinesByCau?.[c.ma_cau]; if (vm && bl != null) lines[vm] = bl }
    return { ...ch, btvnLinesByCau: lines }
  }
  // maDe (1/2/3) → { badge, v, ch } — DÙNG CHUNG cho in-đủ-3-đề (mặc định) và in-theo-HS (perHS, mỗi HS
  // chỉ 1 mã). maDe 2/3 mà chưa đủ 3 mã đề (complete=false) → an toàn về đề gốc (không in đề rỗng).
  const verOf = (maDe: number): { badge: string; v: number | null; ch: CauHinh } =>
    (complete && maDe === 2) ? { badge: 'Mã đề 2', v: 0, ch: chVar(0) }
    : (complete && maDe === 3) ? { badge: 'Mã đề 3', v: 1, ch: chVar(1) }
    : { badge: complete ? 'Mã đề 1' : '', v: null, ch }

  // Mỗi mã đề/phiếu HS luôn bắt đầu Ở TRANG LẺ (giống ET, xem ETPrintView.tsx — .pv-de-recto áp cho
  // MỌI đề, kể cả đề/phiếu ĐẦU, không chỉ i>0): in 2 mặt rồi cắt/đóng ghim, mỗi đề/phiếu phải NẰM TRỌN
  // trên các trang RIÊNG (không dính mặt sau của đề/phiếu trước) — .pv-de-recto = break-before:right,
  // KHÁC .pv-mt-de-break (break-before:page, sang trang kế tiếp bất kỳ, có thể là trang CHẴN).
  if (perHS) {
    return <>{perHS.map((hs) => (
      <div key={hs.id} className="pv-de-recto"><MTPhieu full={full} phans={phans} ver={verOf(hs.maDe)} gv={gv} mapCau={mapCau} hoTen={hs.ho_ten} lopTen={lopTen} /></div>
    ))}</>
  }
  const versions = complete ? [1, 2, 3].map(verOf) : [verOf(1)]
  return <>{versions.map((ver, vi) => (
    <div key={vi} className="pv-de-recto"><MTPhieu full={full} phans={phans} ver={ver} gv={gv} mapCau={mapCau} /></div>
  ))}</>
}

function MTPhieu({ full, phans, ver, gv, mapCau, hoTen, lopTen }: {
  full: TaiLieuFull; phans: TaiLieuFull['phans']; ver: { badge: string; v: number | null; ch: CauHinh }; gv: boolean
  mapCau: (c: CauHoi, v: number | null) => CauHoi; hoTen?: string; lopTen?: string
}) {
  let no = 0
  const next = () => ++no
  return (
    <div className="pv-mt" style={{ '--pv-accent': ver.ch.mau || '#7c3aed' } as CSSProperties}>
      <div className="pv-bt-head">
        <div className="pv-bt-titlewrap">
          <div className="pv-bt-eyebrow">Kỳ thi lớn (MT){ver.badge ? ` · ${ver.badge}` : ''}{gv ? ' · Đáp án' : ''}</div>
          <div className="pv-bt-title">{full.taiLieu.ten}</div>
        </div>
        {!gv && (
          <div className="pv-bt-row">
            <div className="pv-bt-info">
              <div className="pv-bt-field"><span className="pv-bt-lbl">Họ và tên:</span>{hoTen ? <span className="pv-bt-filled">{hoTen}</span> : <span className="pv-bt-fill" />}</div>
              <div className="pv-bt-field"><span className="pv-bt-lbl">Lớp:</span>{lopTen ? <span className="pv-bt-filled">{lopTen}</span> : <span className="pv-bt-fill" />}</div>
              {ver.badge && <div className="pv-bt-field"><span className="pv-bt-lbl">{ver.badge}</span></div>}
            </div>
            <div className="pv-bt-score"><div className="pv-bt-score-lbl">ĐIỂM</div><div className="pv-bt-score-box" /></div>
          </div>
        )}
      </div>

      {phans.map((p) => (
        <section key={p.id} className="pv-sec">
          <h2 className="pv-h-dang">{p.tieu_de}</h2>
          {p.caus.length === 0 ? <p className="pv-empty">Phần này chưa có câu.</p> : mtRunsOf(p.caus, mapCau, ver, gv).map((run, ri) => (
            run.tln
              ? <MTTlnTable key={ri} rows={run.items.map((c) => { const n = next(); return { key: c.ma_cau, content: tlnQuestionContent(n, mapCau(c, ver.v)) } })} />
              : <CauFlow key={ri} items={run.items.map((c) => ({ key: c.ma_cau, cols: ver.ch.colByCau?.[c.ma_cau] ?? 1, ...mtCauParts(next(), mapCau(c, ver.v), gv, ver.ch) }))} />
          ))}
        </section>
      ))}
      {phans.length === 0 && <p className="pv-empty">MT chưa có phần nào.</p>}
    </div>
  )
}

const MT_CSS = `
.pv-mt .pv-h-dang{border-bottom:none;padding-bottom:0}
.pv-empty{color:#8a9097;font-style:italic;margin-top:10px}
/* Tên/lớp IN SẴN (perHS) — thay ô trống chấm chấm bằng chữ đậm, giống BTPrintView. */
.pv-bt-filled{flex:1;font-weight:600;color:#1e293b}
/* Mỗi MÃ ĐỀ/PHIẾU HS luôn bắt đầu Ở TRANG LẺ (giống ET) — MT không import bkPrint.tsx nên khai lại
   TẠI ĐÂY (bkPrint.tsx định nghĩa y hệt cho ET, DÙNG CHUNG Ý NGHĨA, đừng đổi lệch giữa 2 nơi). */
.pv-de-recto{break-before:right}
/* ⭐ Câu (1 cột, KHÔNG qua CauColumns) phải CHẢY được giữa các trang — mặc định .pv-cau (PrintView.tsx)
   break-inside:avoid khiến CẢ KHỐI (đề + mọi dòng kẻ viết) nhảy nguyên cục sang trang sau, bỏ trống cuối
   trang HOẶC xuống dòng lệch khi khối dài hơn 1 trang. Giống ET đã fix (.pv-et .pv-cau), MT thiếu bản
   này → "1 cột lỗi, 2 cột thì ngon" (Thùy báo) vì cột>1 đi qua CauColumns/.pv-lrow (chảy theo hàng, không
   dính .pv-cau) nên không dính lỗi. .pv-wpair vẫn break-inside:avoid riêng (không mồ côi nửa cặp dòng kẻ). */
.pv-mt .pv-cau{break-inside:auto}
.pv-mt .pv-cau .pv-math:first-child{break-after:avoid}
/* Trả lời ngắn — BẢNG câu hỏi | ô ghi đáp án (Thùy). Mỗi hàng break-inside:avoid (không xé đôi 1 câu)
   nhưng khối bảng vẫn CHẢY được giữa các hàng — không dùng <table>/grid/column-count (paged.js TREO). */
.pv-tlnt{margin:4px 0}
.pv-tlnt-row{display:flex;align-items:stretch;border-bottom:1px solid #e2e8f0;break-inside:avoid;min-height:11mm}
.pv-tlnt-row:first-child{border-top:1px solid #e2e8f0}
.pv-tlnt-q{flex:1;min-width:0;padding:7px 10px 7px 0;display:flex;align-items:center}
.pv-tlnt-a{width:42mm;flex-shrink:0;border-left:1px solid #e2e8f0}
`
