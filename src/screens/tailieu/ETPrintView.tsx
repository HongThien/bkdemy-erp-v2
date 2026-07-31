// In ET cho HS làm — engine paged.js (tái dùng từ PrintView). Phiếu: header Họ-tên/Lớp/Điểm + mã ET.
// 3 dạng, CÙNG 1 định dạng mặc định (đề + dòng kẻ, KHÔNG bảng — Thùy chốt 07-11): TRẮC NGHIỆM (CauItem
// có phương án) · TRẢ LỜI NGẮN (dòng kẻ ngắn) · TỰ LUẬN (dòng kẻ dài hơn, số dòng = cau_hinh.btvnLinesByCau).
// Bản GV = kèm đáp án/lời giải mặc định (đề rồi lời giải bên dưới), không tách bảng riêng.
// THỨ TỰ CÂU: đọc thẳng `thu_tu` của DB, KHÔNG sắp xếp lại ở đây — việc gom theo nhóm in đã làm
// từ lúc LƯU (sortETCaus, xem lib/tailieu.ts). Đừng thêm sort vào file này: giấy sẽ lệch với hệ.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, etGroupOf, khoCuaMon, type ETGroup, type TaiLieuFull, type CauHinh } from '../../lib/tailieu'
import { fetchCausByMa } from '../../lib/ontap'
import { BK_CSS } from './bkPrint'
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
// perHS: in theo HÌNH THỨC MỖI HS 1 PHIẾU — mã đề đã gán + họ tên in sẵn (gán ở ETScreen, cau_hinh.hsMaDe).
// Không truyền → in 3 mã đề tổng quát như cũ (ô tên trống).
// fullOverride/varCauOverride: render từ dữ liệu ĐANG SOẠN (in-memory) thay vì đọc bản đã lưu — cho phép
// PREVIEW ngay trong màn tạo ET, chưa cần lưu (Thùy 07-31).
export default function ETPrintView({ id, onClose, headless, linkOnly, onFail, onReady, onRenderErr, perHS, fullOverride, varCauOverride }: { id: string; onClose: () => void; headless?: boolean; linkOnly?: boolean; onFail?: () => void; onReady?: () => void; onRenderErr?: (msg: string) => void; perHS?: { id: string; ho_ten: string; maDe: number }[]; fullOverride?: TaiLieuFull; varCauOverride?: Record<string, CauHoi> }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false)
  const [kieu, setKieu] = useState<'gon' | 'bk'>('bk')   // kiểu đầu phiếu: gọn (cũ) / BK (thiết kế mới)
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [, setDl] = useState(false) // "đang lấy link" — chỉ đọc trong headless linkOnly, nút "⬇ Tải PDF" đã bỏ
  const [dlErr, setDlErr] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  // Container ĐANG HIỂN THỊ (run mới nhất đã resolve xong) — uploadPagesAsLink/window.print CHỈ đọc trang
  // từ container này, KHÔNG quét cả dstRef (có thể còn container cũ ẩn/treo — xem comment effect dưới).
  const activeContainerRef = useRef<HTMLElement | null>(null)
  // Câu của MÃ ĐỀ 2/3 (chỉ lưu ma_cau trong cau_hinh.etMaDe) — nạp nội dung để in. varReady chặn paged.js
  // dựng trang TRƯỚC khi có câu 2/3 (không thì đề 2/3 in RỖNG rồi headless tự in mất).
  const [varCau, setVarCau] = useState<Record<string, CauHoi>>({})
  const [varReady, setVarReady] = useState(false)
  useEffect(() => { if (fullOverride) { setFull(fullOverride); return } getTaiLieuFull(id).then(setFull).catch((e) => setErr(e.message ?? String(e))) }, [id, fullOverride])
  useEffect(() => {
    if (!full) return
    setVarReady(false)
    if (varCauOverride) { setVarCau(varCauOverride); setVarReady(true); return }
    const ch = full.taiLieu.cau_hinh ?? {}
    const need = new Set<string>()
    for (const arr of Object.values(ch.etMaDe ?? {})) for (const m of arr) if (m) need.add(m)
    if (!need.size) { setVarCau({}); setVarReady(true); return }
    let alive = true
    fetchCausByMa([...need], khoCuaMon(full.taiLieu.mon).cauTbl)
      .then((cs) => { if (alive) { setVarCau(Object.fromEntries(cs.map((c) => [c.ma_cau, c]))); setVarReady(true) } })
      .catch(() => { if (alive) setVarReady(true) })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full])

  useEffect(() => {
    if (!full || !varReady || !srcRef.current || !dstRef.current) return
    let cancelled = false
    setRendering(true)
    const ch0 = full.taiLieu.cau_hinh ?? {}
    // Kiểu BK có thương hiệu riêng trong thân → BỎ cả dải header TRÊN lẫn footer DƯỚI của trang (khỏi trùng/lệch tông).
    const ch = kieu === 'bk' ? { ...ch0, header: 'none' as const, footer: 'none' as const } : ch0
    // BK: accent XANH LAM (chữ Phần/Câu theo tông BK) + kéo lề trên lên (đã bỏ header) + border đậm hơn.
    const accent = kieu === 'bk' ? '#3b5bd8' : (ch.mau || '#7c3aed')
    const css = buildPagedCss(full.taiLieu, ch, accent) + ET_CSS + BK_CSS + (kieu === 'bk' ? ET_CSS_BK : '')
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
  }, [full, gv, varReady, kieu])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`
  const printFileName = () => `${full?.taiLieu.ten ?? ''}${gv ? ' - Bản GV' : ''}`
  // "🔗 Lấy link" — CHỈ dùng cho linkOnly (headless). "⬇ Tải PDF" cũ đã BỎ, giờ dùng NATIVE print
  // (window.print(), xem uploadPagesAsLink trong PrintView.tsx — quyết định kiến trúc 07-11).
  async function layLink(): Promise<boolean> {
    if (!activeContainerRef.current || !full) return false
    setDl(true); setDlErr(null)
    try {
      const ch0 = full.taiLieu.cau_hinh ?? {}
      const chChrome = kieu === 'bk' ? { ...ch0, header: 'none' as const, footer: 'none' as const } : ch0  // BK bỏ header + footer
      await uploadPagesAsLink(activeContainerRef.current, printFileName(), pageChrome(full.taiLieu, chChrome), full.taiLieu.id); return true
    }
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <ETAllDe full={full} gv={gv} varCau={varCau} perHS={perHS} kieu={kieu} />}</div>
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
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setKieu('bk')} className={seg(kieu === 'bk')}>Kiểu BK</button>
          <button onClick={() => setKieu('gon')} className={seg(kieu === 'gon')}>Kiểu gọn</button>
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <ETAllDe full={full} gv={gv} varCau={varCau} perHS={perHS} kieu={kieu} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

// 3 MÃ ĐỀ (Thùy 07-31): đề gốc = câu phan 'custom'; đề 2/3 = thay từng câu bằng ma_cau trong etMaDe
// (neo theo CÂU GỐC, đúng thứ tự gốc → cùng nhóm form → in ra 3 phiếu cấu trúc y hệt, khác câu). ET cũ
// (không etMaDe / chưa đủ) → in 1 đề như trước (backward-compatible).
function ETAllDe({ full, gv, varCau, perHS, kieu }: { full: TaiLieuFull; gv: boolean; varCau: Record<string, CauHoi>; perHS?: { id: string; ho_ten: string; maDe: number }[]; kieu: 'gon' | 'bk' }) {
  const ch = full.taiLieu.cau_hinh ?? {}
  const base = full.phans.find((p) => p.loai_phan === 'custom')?.caus ?? []
  const etMaDe = ch.etMaDe
  const complete = !!etMaDe && base.length > 0 && base.every((c) => { const a = etMaDe[c.ma_cau]; return a && a[0] && a[1] })
  const build = (v: number) => (complete ? (base.map((c) => varCau[etMaDe![c.ma_cau][v] as string]).filter(Boolean) as CauHoi[]) : [])
  // Đề 2/3 KẾ THỪA số dòng (tự luận) của câu gốc: lines keyed theo ma_cau nên phải map ma_cau gốc → biến
  // thể lúc IN. Nguồn DUY NHẤT = btvnLinesByCau của câu gốc → đổi dòng đề 1 rồi lưu là đề 2/3 tự khớp.
  const chVar = (vIdx: number): CauHinh => {
    const lines = { ...(ch.btvnLinesByCau ?? {}) }
    for (const bc of base) { const vm = etMaDe![bc.ma_cau][vIdx]; const bl = ch.btvnLinesByCau?.[bc.ma_cau]; if (vm && bl != null) lines[vm] = bl }
    return { ...ch, btvnLinesByCau: lines }
  }
  // Mã đề n → (câu, cấu hình dòng). Chưa đủ 3 mã đề thì mọi mã về đề gốc (an toàn).
  const deOf = (maDe: number) => (complete && maDe === 2) ? { caus: build(0), ch: chVar(0) }
    : (complete && maDe === 3) ? { caus: build(1), ch: chVar(1) } : { caus: base, ch }
  // Chế độ IN THEO HS: mỗi HS 1 phiếu = mã đề đã gán + tên in sẵn.
  if (perHS) {
    return <>{perHS.map((hs, i) => { const d = deOf(hs.maDe)
      return <div key={hs.id} className={i ? 'pv-de-break' : ''}><ETDoc ten={full.taiLieu.ten} caus={d.caus} ch={d.ch} gv={gv} badge={`Mã đề ${hs.maDe}`} hoTen={hs.ho_ten} kieu={kieu} /></div> })}</>
  }
  const des = complete
    ? [{ label: 'Mã đề 1', caus: base, ch }, { label: 'Mã đề 2', caus: build(0), ch: chVar(0) }, { label: 'Mã đề 3', caus: build(1), ch: chVar(1) }]
    : [{ label: '', caus: base, ch }]
  return <>{des.map((d, i) => <div key={i} className={i ? 'pv-de-break' : ''}><ETDoc ten={full.taiLieu.ten} caus={d.caus} ch={d.ch} gv={gv} badge={d.label} kieu={kieu} /></div>)}</>
}

function ETDoc({ ten, caus, ch, gv, badge, hoTen, kieu }: { ten: string; caus: CauHoi[]; ch: CauHinh; gv: boolean; badge?: string; hoTen?: string; kieu: 'gon' | 'bk' }) {
  const lines = ch.btvnLinesByCau ?? {}
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
  // "ET 6S1 · 31/07/2026" → tên đề "Đề kiểm tra cuối giờ lớp 6S1" + ngày riêng (mỗi thứ 1 dòng ở cột phải).
  const _dot = ten.indexOf(' · ')
  const rawName = _dot >= 0 ? ten.slice(0, _dot) : ten
  const tenDe = rawName.replace(/^ET\s+/, 'Đề kiểm tra cuối giờ lớp ')
  const ngayDe = _dot >= 0 ? ten.slice(_dot + 3) : ''
  const tenLop = rawName.replace(/^ET\s+/, '')                    // "6S1"
  const made = badge ? badge.replace(/^Mã đề\s*/i, '') : ''       // "2" (từ "Mã đề 2")
  if (kieu === 'bk') return (
    <div className="pv-et pv-et-bk">
      <ETHeaderBK title={tenDe} ngay={ngayDe} lop={tenLop} made={made} hoTen={hoTen} soCau={caus.length} gv={gv} />
      {runs.map((run, ri) => (
        <section key={ri} className="pv-sec"><h2 className="pv-h-dang">Phần {part()} · {GLBL[run.g]}</h2>
          <ol className="pv-caulist">{run.items.map((c) => {
            if (run.g === 0) return <CauItem key={c.ma_cau} no={next()} c={c} gv={gv} />
            const { stem, grid, emb } = splitStem(c)
            return (
              <li key={c.ma_cau} className="pv-cau">
                <div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Câu ${next()}.</span> `}>{stem}</MathText></div>
                {grid && <OptGrid grid={grid} emb={emb} />}
                {c.anh_de && <img src={c.anh_de} alt="" className="pv-img" />}
                {gv ? <GvAnswer c={c} /> : grid ? null : <WriteLines n={lines[c.ma_cau] ?? (run.g === 1 ? DEFAULT_TLN_LINES : DEFAULT_TL_LINES)} />}
              </li>
            )
          })}</ol>
        </section>
      ))}
      {caus.length === 0 && <p className="pv-empty">ET chưa có câu nào.</p>}
    </div>
  )
  return (
    <div className="pv-et">
      <div className="pv-bt-head">
        {/* 2 cột ngang: TRÁI = họ tên HS (tên to), PHẢI = tên đề (bé) · ngày · mã đề, mỗi thứ 1 dòng. */}
        <div className="pv-et-head2">
          {!gv && (
            <div className="pv-et-hs">
              <div className="pv-et-hs-lbl">Họ tên</div>
              {hoTen ? <div className="pv-et-hs-name">{hoTen}</div> : <div className="pv-et-hs-blank" />}
            </div>
          )}
          <div className="pv-et-de">
            <div className="pv-et-de-ten">{tenDe}{gv ? ' · Đáp án' : ''}</div>
            {ngayDe && <div className="pv-et-de-sub">{ngayDe}</div>}
            {badge && <div className="pv-et-de-sub pv-et-made">{badge}</div>}
          </div>
        </div>
        {!gv && (
          /* Bảng điểm THEO CÂU nằm DƯỚI CÙNG: 2 hàng — trên = Câu i, dưới = ô trống điền Đ/S. */
          <table className="pv-et-score"><tbody>
            <tr>{caus.map((_, i) => <th key={i}>Câu {i + 1}</th>)}</tr>
            <tr>{caus.map((_, i) => <td key={i} />)}</tr>
          </tbody></table>
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

// Đầu phiếu KIỂU BK (thiết kế mới, Thùy 07-31 — theo mockup BK Academy). Thương hiệu + nhãn "Bài test cuối
// giờ" + thời gian 10 phút + ngày; tiêu đề; bảng HS (Họ tên · Lớp · Mã đề); lưới "Đánh giá từng câu" Đ/C/S,
// số ô = SỐ CÂU của đề. Bản GV bỏ bảng HS + lưới chấm.
function ETHeaderBK({ title, ngay, lop, made, hoTen, soCau, gv }: {
  title: string; ngay: string; lop: string; made: string; hoTen?: string; soCau: number; gv: boolean
}) {
  return (
    <div className="pv-bkh">
      <div className="pv-bkh-top">
        <div className="pv-bkh-brand">
          <img className="pv-bkh-logo" src={location.origin + '/Logo.png'} alt="BK ACADEMY" />
          <div className="pv-bkh-bn"><strong>BK ACADEMY</strong></div>
        </div>
        <div className="pv-bkh-label">Bài test cuối giờ{gv ? ' · Đáp án' : ''}</div>
        <div className="pv-bkh-meta">
          <div className="pv-bkh-pill"><span>Thời gian</span><strong>10 phút</strong></div>
          <div className="pv-bkh-pill"><span>Ngày</span><strong>{ngay}</strong></div>
        </div>
      </div>
      <div className="pv-bkh-hero">
        <h1 className="pv-bkh-title">{title}</h1>
        <div className="pv-bkh-divider" />
      </div>
      {!gv && (
        <div className="pv-bkh-student">
          <div className="pv-bkh-field"><div className="pv-bkh-flbl">Họ và tên học sinh</div><div className="pv-bkh-fval">{hoTen || ' '}</div></div>
          <div className="pv-bkh-field"><div className="pv-bkh-flbl">Lớp</div><div className="pv-bkh-fval">{lop}</div></div>
          <div className="pv-bkh-field"><div className="pv-bkh-flbl">Mã đề</div><div className="pv-bkh-fval">{made || ' '}</div></div>
        </div>
      )}
      {!gv && (
        <div className="pv-bkh-assess">
          <div className="pv-bkh-ahead"><div className="pv-bkh-atitle">Đánh giá từng câu</div><div className="pv-bkh-anote">Trợ giảng tích Đ / C / S cho mỗi câu</div></div>
          <div className="pv-bkh-grid">
            {Array.from({ length: soCau }, (_, i) => (
              <div key={i} className="pv-bkh-qcard">
                <div className="pv-bkh-qno">Câu {i + 1}</div>
                <div className="pv-bkh-status">{['Đ', 'C', 'S'].map((s) => <span key={s} className="pv-bkh-circle">{s}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ET_CSS = `
/* Header 2 CỘT có VẠCH NGĂN giữa (viền phải cột trái). TRÁI = họ tên HS (tên to). PHẢI = tên đề · ngày ·
   mã đề, căn CHÍNH GIỮA cột 2. 2 cột CĂN TRÊN (lề trên ngang nhau). Chữ TÍM (accent) đồng bộ cả file. */
.pv-et-head2{display:flex;align-items:stretch;margin:2px 0 12px}
.pv-et-hs{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:flex-start;padding-right:16px;border-right:1.5px solid #cbd5e1}
.pv-et-hs-lbl{font-size:12px;font-weight:600;color:var(--pv-accent,#7c3aed)}
.pv-et-hs-name{font-size:20px;font-weight:800;color:var(--pv-accent,#7c3aed);line-height:1.15;margin-top:1px;word-break:break-word}
.pv-et-hs-blank{border-bottom:1.5px dotted #9aa6b2;height:20px;margin-top:6px;max-width:70mm}
.pv-et-de{flex:1;min-width:0;padding-left:16px;text-align:center;display:flex;flex-direction:column;justify-content:flex-start}
.pv-et-de-ten{font-size:13.5px;font-weight:700;color:var(--pv-accent,#7c3aed);line-height:1.25}
.pv-et-de-sub{font-size:12px;color:var(--pv-accent,#7c3aed);margin-top:2px}
.pv-et-made{font-weight:700;color:var(--pv-accent,#7c3aed)}
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
/* Mỗi MÃ ĐỀ 1 trang mới (mỗi HS 1 phiếu riêng). */
.pv-de-break{break-before:page}
`

// CSS pv-bkh (đầu phiếu BK) DÙNG CHUNG ở bkPrint.ts (BK_CSS). Đây chỉ còn override cấp trang khi bật BK:
// đã bỏ header/footer chrome → lề 4 phía HẸP (in PHIẾU, không phải sách) ~1/2 lề cũ.
const ET_CSS_BK = `@page{margin:8mm 7mm}`
