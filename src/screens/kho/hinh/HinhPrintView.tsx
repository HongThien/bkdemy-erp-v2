// Bản IN của nhánh HÌNH — paged.js, preview = bản in A4 thật (khung trang dùng chung với Đại:
// dải sóng + logo + số trang qua `buildPagedCss`).
//
// VÌ SAO KHÔNG DÙNG LẠI `PrintView` CỦA ĐẠI: Đại in theo *câu hỏi* (đề + phương án + dòng kẻ).
// Hình in theo *ý*, và mỗi ý kéo theo HAI hình khác nhau — **hình đề** (của đề gốc) và **hình đáp án**
// (hình chuẩn của node). Bố cục là "văn bản trái · hình phải", ngắt trang phải giữ hình dính với ý của nó.
// Dùng chung một component thì hai layout đá nhau; tách ra rẻ hơn nhiều so với nhồi cờ điều kiện.
//
// BA nguồn gọi tới, cùng một model `MucIn` (component không biết mình đang in cái gì):
//   · M9 Ôn tập     → phiếu ý rút từ BÀI THẬT (khác hình, khác lời văn, khác tên điểm)
//   · M9 Giảng dạy  → khúc A→B: mốc chương + nhắc lại + node theo thứ tự topo
//   · M8 Tài liệu chuẩn → đề chuẩn (giả thiết 1 lần) + lời giải liền mạch, bước trung gian gắn nhãn
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { MathText } from '../ui'
import { CHROME_CSS, buildPagedCss, printWithFilename, safeFileName } from '../../tailieu/PrintView'

// ── Model bản in ──────────────────────────────────────────────────
export type YIn = {
  nhan: string                 // "a" / "b"
  noiDung: string
  loiGiai?: string | null
  anh?: string | null          // hình ĐÁP ÁN của ý
  bacThamChieu?: boolean       // lời giải rơi về node ⇒ khác tên điểm, phải nói rõ trên giấy
  ghiChu?: string | null       // vd "không có trong đề"
  ma?: string | null
  cap?: number | null
}
export type MucIn =
  | { kieu: 'chuong'; tieuDe: string; moTa?: string | null }
  | { kieu: 'nhac_lai'; items: { ma: string; phatBieu: string; cap: number }[] }
  | { kieu: 'de'; deBai: string; anhDe?: string | null; nguon?: string | null; ma?: string | null; ys: YIn[]; anDe?: boolean; soDong?: number | null }
  //   anDe = ẨN hình đề → Ô VẼ cho HS. soDong = số dòng kẻ mỗi ý trên bản HS (BTVN chỉnh được).

export type BanIn = {
  tieuDe: string
  phuDe?: string | null
  ghiChuDau?: string | null    // vd "Bài tương đương — tên điểm theo hệ thống"
  mucs: MucIn[]
}

export default function HinhPrintView({ ban, onClose }: { ban: BanIn; onClose: () => void }) {
  const [gv, setGv] = useState(false)      // bản GV = kèm lời giải + hình đáp án
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!srcRef.current || !dstRef.current) return
    let cancelled = false
    let watchdog: ReturnType<typeof setTimeout> | undefined
    setRendering(true); setLoi(null)
    // ⚠ HOÃN 1 TICK — KHÔNG gọi Previewer thẳng trong effect. React StrictMode chạy effect HAI LẦN
    // (mount → cleanup → mount): hai Previewer chạy CHỒNG NHAU trên cùng document thì paged.js sinh
    // ra ĐÚNG 0 TRANG, không lỗi, không cảnh báo — nhìn như treo. Hoãn bằng setTimeout(0) rồi
    // clearTimeout trong cleanup ⇒ lần chạy đầu bị huỷ trước khi kịp bắt đầu, chỉ còn MỘT run.
    // (`PrintView` của Đại vô tình né được vì nó đợi `full` nạp xong mới dựng — nhánh Hình dựng từ
    //  dữ liệu có sẵn trong tay nên đụng ngay.)
    const src = srcRef.current, dst = dstRef.current
    const hoan = setTimeout(() => {
    const css = buildPagedCss({ ten: ban.tieuDe, khoi: '' }, {}, '#0f766e', {
      headerText: `${ban.tieuDe}${gv ? ' · BẢN GV' : ''}`,
      footerText: 'BK Academy        Tel : 0963.209.309        Địa chỉ : 17A10 KĐT Geleximco',
    }) + HINH_CSS
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = src.innerHTML
    // Cùng cách chống race của PrintView: mỗi run một container riêng, resolve xong mới ẨN container
    // khác (KHÔNG remove giữa lúc Previewer còn đo layout — đã từng sinh 200-400 trang, DEVLOG 07-11).
    const container = document.createElement('div')
    dst.appendChild(container)
    let settled = false
    watchdog = setTimeout(() => {
      if (settled || cancelled) return
      settled = true; container.style.display = 'none'
      setLoi('Dựng trang quá lâu (>30s) — đóng rồi thử lại.'); setRendering(false)
    }, 30000)
    new Previewer().preview(html, [cssUrl], container)
      .then((flow: { total?: number }) => {
        if (settled) return
        settled = true; clearTimeout(watchdog)
        if (cancelled) { container.style.display = 'none'; return }
        Array.from(dst.children).forEach((c) => { if (c !== container) (c as HTMLElement).style.display = 'none' })
        activeRef.current = container
        setPages(flow?.total ?? 0); setRendering(false)
      })
      .catch((e: unknown) => {
        if (settled) return
        settled = true; clearTimeout(watchdog); container.style.display = 'none'
        if (!cancelled) { setLoi(e instanceof Error ? e.message : String(e)); setRendering(false) }
      })
      .finally(() => URL.revokeObjectURL(cssUrl))
    }, 0)
    return () => { cancelled = true; clearTimeout(hoan); if (watchdog) clearTimeout(watchdog) }
  }, [ban, gv])

  return createPortal(
    <div className="pv-overlay fixed inset-0 z-[60] bg-slate-900/40">
      <style>{CHROME_CSS}</style>
      <div className="no-print flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
        <span className="text-[13px] font-semibold text-slate-800">{ban.tieuDe}</span>
        {ban.phuDe && <span className="text-[12px] text-slate-400">{ban.phuDe}</span>}
        <div className="ml-4 flex overflow-hidden rounded-lg border border-slate-300">
          {[['HS', false], ['GV (kèm lời giải)', true]].map(([lb, v]) => (
            <button key={String(v)} onClick={() => setGv(v as boolean)}
              className={`px-3 py-1 text-[12.5px] font-medium ${gv === v ? 'bg-teal-600 text-white' : 'bg-white text-slate-600'}`}>
              Bản {lb as string}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-slate-400">{rendering ? 'đang dựng trang…' : `${pages} trang`}</span>
        <button disabled={rendering || !!loi} onClick={() => printWithFilename(safeFileName(`${ban.tieuDe}${gv ? ' - GV' : ''}`))}
          className="ml-auto rounded-lg bg-teal-600 px-3 py-1.5 text-[13px] font-medium text-white disabled:bg-slate-300">⎙ In / Lưu PDF</button>
        <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Đóng</button>
      </div>
      {loi && <div className="no-print bg-rose-50 px-4 py-2 text-[12.5px] text-rose-700">{loi}</div>}

      {/* nguồn ẩn — paged.js đọc innerHTML từ đây rồi tự phân trang */}
      <div className="pv-src" ref={srcRef}><Noi ban={ban} gv={gv} /></div>
      <div className="pv-scroll h-[calc(100vh-42px)] overflow-y-auto bg-slate-200 p-5">
        <div className="pv-pages" ref={dstRef} />
      </div>
    </div>,
    document.body,
  )
}

function Noi({ ban, gv }: { ban: BanIn; gv: boolean }) {
  let soDe = 0
  return (
    <div>
      <div className="hp-cover">
        <div className="hp-title">{ban.tieuDe}</div>
        {ban.phuDe && <div className="hp-sub">{ban.phuDe}</div>}
      </div>
      {ban.ghiChuDau && <div className="hp-note">{ban.ghiChuDau}</div>}

      {ban.mucs.map((m, i) => {
        if (m.kieu === 'chuong') return (
          <div key={i} className="hp-chuong">
            <div className="hp-chuong-t">{m.tieuDe}</div>
            {m.moTa && <div className="hp-chuong-m"><MathText>{m.moTa}</MathText></div>}
          </div>
        )
        if (m.kieu === 'nhac_lai') return (
          <div key={i} className="hp-nhac">
            <div className="hp-nhac-t">Nhắc lại đầu buổi — đã học buổi trước</div>
            {m.items.map((x) => (
              <div key={x.ma} className="hp-nhac-i">• <MathText>{x.phatBieu}</MathText> <span className="hp-ma">{x.ma} · cấp {x.cap}</span></div>
            ))}
          </div>
        )
        soDe++
        return (
          <div key={i} className="hp-de">
            <div className="hp-de-h">Bài {soDe}.</div>
            {/* văn bản TRÁI · hình PHẢI — hình dính với đề, không trôi sang trang khác.
                anDe (ẩn hình): bản HS chừa Ô VẼ 40% bên phải; bản GV vẫn hiện hình để đối chiếu. */}
            <div className={`hp-row${m.anDe ? ' hp-row-ve' : ''}`}>
              <div className="hp-txt"><MathText>{m.deBai}</MathText></div>
              {m.anDe
                ? (gv && m.anhDe
                  ? <div className="hp-fig"><img src={m.anhDe} alt="" /></div>
                  : <div className="hp-draw"><span>Vẽ hình</span></div>)
                : (m.anhDe && <div className="hp-fig"><img src={m.anhDe} alt="" /></div>)}
            </div>
            {m.ys.map((y, j) => (
              <div key={j} className="hp-y">
                <div className="hp-row">
                  <div className="hp-txt">
                    {y.nhan && <b>{y.nhan}) </b>}<MathText>{y.noiDung}</MathText>
                    {y.ghiChu && <span className="hp-tag">{y.ghiChu}</span>}
                  </div>
                  {gv && y.anh && <div className="hp-fig"><img src={y.anh} alt="" /></div>}
                </div>
                {gv
                  ? (
                    <div className="hp-giai">
                      {y.bacThamChieu && <div className="hp-bac">Lời giải THAM CHIẾU — lấy từ bài chuẩn, tên điểm theo hệ thống (không phải tên điểm của đề này).</div>}
                      <MathText>{y.loiGiai ?? '—'}</MathText>
                    </div>
                  )
                  : <div className="hp-ke" style={m.soDong ? { height: `${Math.max(1, m.soDong) * 7.7}mm` } : undefined} />}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

// CSS nội dung bản Hình. Nối SAU buildPagedCss nên ghi đè được phần chung khi cần.
const HINH_CSS = `
.hp-cover{text-align:center;padding-bottom:12px;margin:6mm 0 14px;border-bottom:2px solid #0f766e}
.hp-title{font-size:24px;font-weight:800;color:#134e4a}
.hp-sub{color:#6b7280;font-size:12.5px;margin-top:4px}
.hp-note{background:#fffaf1;border:1px solid #f0c987;border-radius:8px;padding:8px 11px;font-size:14px;color:#8a5a12;margin-bottom:12px}
.hp-chuong{background:#e6f5f1;border:1px solid #5eccb0;border-radius:8px;padding:9px 12px;margin:14px 0 8px;break-inside:avoid;break-after:avoid}
.hp-chuong-t{font-weight:800;color:#0f6e56;font-size:17px}
.hp-chuong-m{font-size:15px;color:#374151;margin-top:2px}
.hp-nhac{border:1px dashed #cbd5e1;border-radius:8px;padding:9px 12px;margin-bottom:12px;background:#fafbfc;break-inside:avoid}
.hp-nhac-t{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280;font-weight:700;margin-bottom:4px}
.hp-nhac-i{font-size:15px;color:#374151;margin:2px 0}
.hp-de{margin:0 0 6px;break-inside:auto}
.hp-de-h{font-weight:800;color:#134e4a;font-size:18px;margin:4px 0 3px;break-after:avoid}
/* văn bản trái · hình phải: inline-block thay vì flex/grid — paged.js đo layout grid không đáng tin (DEVLOG 07-05) */
.hp-row{font-size:0;break-inside:avoid}
.hp-txt{display:inline-block;vertical-align:top;width:66%;font-size:17px;padding-right:4mm;box-sizing:border-box}
.hp-fig{display:inline-block;vertical-align:top;width:34%;box-sizing:border-box}
.hp-fig img{width:100%;max-height:52mm;object-fit:contain;border:1px solid #e2e8f0;border-radius:6px;background:#fff}
/* Ẩn hình → chừa Ô VẼ cho HS: đề 60% trái · ô vẽ 40% phải */
.hp-row-ve .hp-txt{width:60%}
.hp-draw{display:inline-block;vertical-align:top;width:40%;height:58mm;box-sizing:border-box;border:1px dashed #94a3b8;border-radius:6px;background:#fff;position:relative}
.hp-draw span{position:absolute;top:4px;left:6px;font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em}
.hp-y{margin:4px 0 0}
.hp-ma{font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#94a3b8}
.hp-tag{display:inline-block;background:#faeeda;border:1px solid #ef9f27;color:#854f0b;border-radius:10px;padding:0 7px;font-size:11.5px;margin-left:5px;vertical-align:middle}
.hp-giai{font-size:16px;color:#374151;background:#fbfcff;border:1px solid #e5e9f0;border-radius:7px;padding:7px 10px;margin-top:4px}
.hp-bac{font-size:12px;color:#8a5a12;background:#fffaf1;border-radius:5px;padding:3px 7px;margin-bottom:5px}
/* bản HS: chỗ trống có dòng kẻ để viết */
.hp-ke{height:26mm;margin-top:4px;background-image:repeating-linear-gradient(to bottom,transparent 0 7.6mm,#d7dee7 7.6mm 7.7mm)}
`
