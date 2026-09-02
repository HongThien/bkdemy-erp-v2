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
import { Fragment, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { MathText } from '../ui'
import { type CheDoHinh } from '../../../lib/kho/hinhGiaoTrinh'
import { CHROME_CSS, buildPagedCss, gtPageCss, printWithFilename, safeFileName, GT_BK_CSS } from '../../tailieu/PrintView'
import { BK_CSS, BK_PAGE_CSS, ETHeaderBK, BtvnBkHead } from '../../tailieu/bkPrint'

// ── Model bản in ──────────────────────────────────────────────────
// Một BƯỚC con = node ẨN nở vào lời giải một ý (bản GV). Đứng TRƯỚC lời giải chính, sắp cap↑.
export type BuocIn = { phatBieu: string; giaThietPhu?: string | null; loiGiai?: string | null; anh?: string | null; ma?: string | null }
export type YIn = {
  nhan: string                 // "a" / "b"
  noiDung: string
  giaThietPhu?: string | null  // dữ kiện lẻ ở ĐỀ của ý (node + van trồi từ tiền đề) — vd "gọi I = AC∩BD"
  loiGiai?: string | null
  anh?: string | null          // hình ĐÁP ÁN của ý
  buoc?: BuocIn[]              // node ẨN nở thành bước con (chỉ bản GV) — sắp cap↑, trước lời giải chính
  bacThamChieu?: boolean       // lời giải rơi về node ⇒ khác tên điểm, phải nói rõ trên giấy
  ghiChu?: string | null       // vd "không có trong đề"
  ma?: string | null
  cap?: number | null
}
export type MucIn =
  | { kieu: 'chuong'; tieuDe: string; moTa?: string | null }
  | { kieu: 'nhac_lai'; items: { ma: string; phatBieu: string; cap: number }[] }
  | { kieu: 'de'; deBai: string; anhDe?: string | null; nguon?: string | null; ma?: string | null; ys: YIn[]; cheDo?: CheDoHinh; soDong?: number | null; moHinhId?: string | null }
  //   cheDo = 3 trạng thái hình (hien / o_trong / khong). soDong = số dòng kẻ mỗi ý trên bản HS.
  //   moHinhId = mô hình của node sâu nhất — để gom lý thuyết mô hình 1 lần/nhóm khi in (xem `Noi()`).

export type BanIn = {
  tieuDe: string
  phuDe?: string | null
  ghiChuDau?: string | null    // vd "Bài tương đương — tên điểm theo hệ thống"
  mucs: MucIn[]
  // ⭐ 08-10 (Thùy: "lý thuyết in ở phiếu bài tập trên lớp giống bên đại"): lý thuyết CỦA MÔ HÌNH, resolve
  // sẵn ở banInTheoMoHinh (CHỈ phan='lop' — khuôn Đại: LT chỉ hiện ở buổi trên lớp, không lặp lại ở BTVN).
  moHinhLyThuyet?: Record<string, { ten: string; noiDung: string }>
  // ⭐ 21/08 — chỉ dùng khi in perHS (ET): lớp + ngày hiện ở ETHeaderBK (pill góc phải + ô "Lớp"),
  // KHÔNG nhét vào `tieuDe`. Các đường gọi khác (giáo trình/ôn tập) không cần set 2 field này.
  lop?: string
  ngay?: string
  // ⭐ 02/09 MT Hình: tiêu đề in ở chế độ perHS — mặc định (không set) = "Đề kiểm tra cuối giờ lớp X" của ET;
  // MT đặt tên MT ("MT Học kỳ 1 — Toán 9") vì MT không phải ET cuối giờ.
  tieuDeIn?: string
  // ⭐ 24/08 (Thùy: "header BTVN linh tinh, làm giống hệt form Đại đi") — bản "Về nhà" dùng ĐÚNG
  // BtvnBkHead của Đại (masthead .gtbk-mh* + ô Họ tên/Lớp/Điểm) thay vì masthead `hpmh` chung, và
  // Lớp/Ngày phát/Hạn nộp lên PILL CÓ CẤU TRÚC (như Đại) — KHÔNG nhét chung vào `tieuDe` nữa.
  // `tieuBai` = tiêu đề buổi TRẦN (vd "Buổi 2 : Hình thang"), khác `tieuDe` (tên file đầy đủ dùng ở
  // toolbar/tải về, vd "BTVN 8B1 27/08/2026 · Buổi 2 : Hình thang") — Đại cũng tách 2 field y hệt vậy
  // (docTitle vs buoiTitle, xem PrintView.tsx).
  laBtvn?: boolean
  tieuBai?: string
  ngayNop?: string
  // ⭐ 28/08 (Thùy: "Bài tập Hình chưa có chế độ in cả lớp theo tên học sinh giống Đại số à") — HS có mặt
  // buổi này (khớp lop_id+ngay), gắn ở attachBtvnMeta (GiaoTrinhScreen.tsx), CÙNG hàm `hsCoMatCuaBuoi`
  // Đại dùng. Chỉ có ý nghĩa khi laBtvn — giáo trình 'lop'/ET không cần roster ở đây (ET dùng `perHS` prop
  // riêng vì mỗi HS có mã đề/mucs KHÁC NHAU, còn BTVN "Cả lớp" mọi HS CHUNG 1 mucs, chỉ khác tên trên đầu phiếu).
  roster?: { id: string; ho_ten: string }[]
}

// ⭐ 22/08 (Thùy: "làm nốt cho giống Đại — In nhanh"): `headless` = khuôn PrintView.tsx của Đại — ẩn
// toolbar, dựng xong TỰ gọi window.print() (native, không upload gì), đóng khi hộp thoại in đóng
// (`afterprint`). `onReady`/`onRenderErr` = tín hiệu cho worker gen-link PDF (PrintJobPage.tsx bridge
// sang `window.__pvState`) — KHÔNG kèm headless (worker chụp bản preview bình thường qua page.pdf(),
// toolbar tự ẩn nhờ class `no-print` sẵn có, đúng cách Đại làm — xem worker/index.mjs processHinhJob()).
export default function HinhPrintView({ ban, onClose, perHS, headless, onReady, onRenderErr }: {
  ban: BanIn; onClose: () => void; perHS?: HinhPerHS[]
  headless?: boolean; onReady?: () => void; onRenderErr?: (msg: string) => void
}) {
  const [gv, setGv] = useState(false)      // bản GV = kèm lời giải + hình đáp án
  // ⭐ 28/08 (Thùy: "chưa có chế độ in cả lớp theo tên học sinh giống Đại") — BTVN "Cả lớp": mọi HS chung
  // 1 mucs, chỉ khác tên đầu phiếu — khuôn `perHS` của Đại (PrintView.tsx `scope==='btvn'` toggle), tách
  // TÊN state riêng vì `perHS` (prop) đã có nghĩa khác ở đây (mã đề ET, mỗi HS mucs KHÁC nhau).
  const [perHSBtvn, setPerHSBtvn] = useState(false)
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
    // ⭐ header/footer: 'none' cho CẢ HAI — BỎ HẲN dải sóng cũ (khuôn Đại 08-03, rồi 08-08 bỏ luôn cả
    // footer sóng). Trước đây chỉ header='none', footer vẫn gọi qua buildPagedCss({footerText}) ⇒
    // pageChrome() vẽ dải sóng cong + logo chip CŨ ở đáy trang — sống sót qua đợt bỏ header vì tưởng
    // "giữ footer, Đại cũng giữ", nhưng Đại đã đổi footer sang gtPageCss (dải gradient THẲNG mảnh 3-4mm
    // trên/dưới trang qua pseudo-element + số trang/liên hệ qua @page margin box, KHÔNG còn sóng) từ
    // 08-08 — comment cũ ở đây lạc hậu, Thùy chỉ ra 17/08 "vẫn còn footer cũ" đúng y hệt vụ header hôm
    // trước. Dùng thẳng gtPageCss (đã export) thay vì chép lại CSS — cùng 1 nguồn, Hình tự động khớp
    // Đại nếu sau này đổi màu/kiểu dải, không phải sửa 2 nơi.
    const css = buildPagedCss({ ten: ban.tieuDe, khoi: '' }, { header: 'none', footer: 'none' }, '#0f766e')
      + gtPageCss('') + HINH_CSS + (perHS ? BK_CSS + BK_PAGE_CSS : '') + (ban.laBtvn ? BK_CSS + GT_BK_CSS : '')
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
      const msg = 'Dựng trang quá lâu (>30s) — đóng rồi thử lại.'
      setLoi(msg); setRendering(false); onRenderErr?.(msg)
    }, 30000)
    new Previewer().preview(html, [cssUrl], container)
      .then((flow: { total?: number }) => {
        if (settled) return
        settled = true; clearTimeout(watchdog)
        if (cancelled) { container.style.display = 'none'; return }
        Array.from(dst.children).forEach((c) => { if (c !== container) (c as HTMLElement).style.display = 'none' })
        activeRef.current = container
        setPages(flow?.total ?? 0); setRendering(false); onReady?.()
      })
      .catch((e: unknown) => {
        if (settled) return
        settled = true; clearTimeout(watchdog); container.style.display = 'none'
        if (!cancelled) { const msg = e instanceof Error ? e.message : String(e); setLoi(msg); setRendering(false); onRenderErr?.(msg) }
      })
      .finally(() => URL.revokeObjectURL(cssUrl))
    }, 0)
    return () => { cancelled = true; clearTimeout(hoan); if (watchdog) clearTimeout(watchdog) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ban, gv, perHS, perHSBtvn])

  // "In nhanh" (headless) — dựng xong TỰ gọi window.print() sau đệm 350ms (phòng render 2-pass), đóng
  // khi hộp thoại in đóng. Khuôn PrintView.tsx của Đại (headless KHÔNG linkOnly).
  const daTuIn = useRef(false)
  useEffect(() => {
    if (!headless || daTuIn.current || rendering || loi) return
    daTuIn.current = true
    const t = setTimeout(() => printWithFilename(safeFileName(`${ban.tieuDe}${gv ? ' - GV' : ''}`)), 350)
    return () => clearTimeout(t)
  }, [headless, rendering, loi, ban, gv])
  useEffect(() => {
    if (!headless) return
    const onAfter = () => onClose()
    window.addEventListener('afterprint', onAfter)
    return () => window.removeEventListener('afterprint', onAfter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headless])

  if (headless) return createPortal(
    <>
      <div className="pv-src" ref={srcRef} aria-hidden><Noi ban={ban} gv={gv} perHS={perHS} perHSBtvn={perHSBtvn} /></div>
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 88, width: '210mm', background: '#fff' }}><div ref={dstRef} className="pv-pages" /></div>
      {/* no-print: chỉ hiện trên màn hình, @media print tự ẩn khi window.print() mở — không lọt vào PDF/giấy. */}
      <div className="no-print fixed inset-0 z-[95] flex items-center justify-center bg-white">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-700 shadow-xl">
          {loi ? <span className="text-rose-600">{loi}</span> : <>⏳ Đang chuẩn bị in{pages ? ` (${pages} trang)` : ''}…</>}
          {loi && <button onClick={onClose} className="ml-3 rounded border border-slate-300 px-2.5 py-1 text-xs text-slate-600">Đóng</button>}
        </div>
      </div>
      <style>{CHROME_CSS}</style>
    </>,
    document.body,
  )

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
        {/* ⭐ 28/08 (Thùy: "chưa có chế độ in cả lớp theo tên học sinh giống Đại") — khuôn ĐÚNG toggle
            "Bản trống"/"🖨 Cả lớp (N)" của Đại (PrintView.tsx, scope==='btvn'), chỉ hiện cho BTVN — giáo
            trình 'lop'/ET không có khái niệm "cả lớp theo tên" (ET đã có mã đề riêng per-HS rồi). */}
        {ban.laBtvn && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5"
            title={ban.roster?.length ? `${ban.roster.length} HS có mặt — in mỗi HS 1 phiếu, tên sẵn` : 'Chưa điểm danh có mặt → chỉ in bản trống'}>
            <button onClick={() => setPerHSBtvn(false)} className={`rounded-md px-3 py-1 text-[12.5px] font-medium transition ${!perHSBtvn ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Bản trống</button>
            <button onClick={() => setPerHSBtvn(true)} disabled={!ban.roster?.length}
              className={`rounded-md px-3 py-1 text-[12.5px] font-medium transition disabled:opacity-40 ${perHSBtvn ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              🖨 Cả lớp{ban.roster?.length ? ` (${ban.roster.length})` : ''}
            </button>
          </div>
        )}
        <span className="text-[12px] text-slate-400">{rendering ? 'đang dựng trang…' : `${pages} trang`}</span>
        <button disabled={rendering || !!loi} onClick={() => printWithFilename(safeFileName(`${ban.tieuDe}${gv ? ' - GV' : ''}`))}
          className="ml-auto rounded-lg bg-teal-600 px-3 py-1.5 text-[13px] font-medium text-white disabled:bg-slate-300">⎙ In / Lưu PDF</button>
        <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Đóng</button>
      </div>
      {loi && <div className="no-print bg-rose-50 px-4 py-2 text-[12.5px] text-rose-700">{loi}</div>}

      {/* nguồn ẩn — paged.js đọc innerHTML từ đây rồi tự phân trang */}
      <div className="pv-src" ref={srcRef}><Noi ban={ban} gv={gv} perHS={perHS} perHSBtvn={perHSBtvn} /></div>
      <div className="pv-scroll h-[calc(100vh-42px)] overflow-y-auto bg-slate-200 p-5">
        <div className="pv-pages" ref={dstRef} />
      </div>
    </div>,
    document.body,
  )
}

// ⭐ Per-HS (Thùy 21/08, "làm đầy đủ giống Đại"): mỗi HS 1 phiếu, đầu phiếu kiểu BK (pv-bkh, khuôn
// ETPrintView) thay cho masthead thường — mã đề đã gán hiện thành nhãn, đánh số Bài 1.. RIÊNG từng phiếu
// (không cộng dồn xuyên các HS). Nội dung mucs của mỗi HS đã được resolve theo mã đề TRƯỚC khi vào đây
// (ETScreen.tsx) — component này không biết "mã đề" là gì, chỉ vẽ mucs được đưa.
export type HinhPerHS = { hoTen: string; maDe: number; mucs: MucIn[] }

function Noi({ ban, gv, perHS, perHSBtvn }: { ban: BanIn; gv: boolean; perHS?: HinhPerHS[]; perHSBtvn?: boolean }) {
  const logoUrl = location.origin + '/Logo.png'
  if (perHS) {
    // ⭐ Thùy 21/08 ("làm giống bên Đại số đi, cứ sáng tạo thêm làm gì"): dùng ĐÚNG `ETHeaderBK` của ET
    // Đại — không tự vẽ header riêng cho Hình. Tiêu đề = "Đề kiểm tra cuối giờ lớp {lớp}" y hệt Đại,
    // KHÔNG chữ "Hình"/"Buổi học". Ngày lên pill góc phải (prop `ngay` của ETHeaderBK), không nhét vào tiêu đề.
    const title = ban.tieuDeIn ?? `Đề kiểm tra cuối giờ lớp ${ban.lop ?? ''}`
    return (
      <div>
        {perHS.map((hs, hi) => (
          <div key={hi} className="pv-de-recto">
            <ETHeaderBK title={title} ngay={ban.ngay ?? ''} lop={ban.lop ?? ''} made={String(hs.maDe)}
              hoTen={hs.hoTen} soCau={hs.mucs.filter((m) => m.kieu === 'de').length} gv={gv} />
            <MucsBlock mucs={hs.mucs} gv={gv} moHinhLyThuyet={ban.moHinhLyThuyet} />
          </div>
        ))}
      </div>
    )
  }
  if (ban.laBtvn) {
    // ⭐ 24/08 (Thùy: "header BTVN linh tinh, làm giống hệt form Đại đi") — BtvnBkHead ĐÚNG như Đại:
    // masthead .gtbk-mh (pill "BTVN" + tiêu đề buổi TRẦN, không nhét lớp/ngày vào) + Lớp/Ngày phát/Hạn
    // nộp trên dòng sub CÓ CẤU TRÚC + hàng ô Họ tên/Lớp/Điểm cho HS điền tay (bản GV ẩn hàng ô này).
    // ⭐ 28/08 (Thùy: "chưa có chế độ in cả lớp theo tên học sinh giống Đại số à") — "Cả lớp": mọi HS
    // CHUNG 1 `ban.mucs` (khác ET, mỗi HS mucs riêng vì mã đề đổi) — chỉ lặp lại phiếu N lần, đổi TÊN ở
    // đầu mỗi phiếu. `.hp-hs-recto` (trừ phiếu đầu) = ngắt sang trang LẺ, khuôn `.pv-hs-recto` của Đại
    // (in 2 mặt không dính phiếu HS này sang HS khác).
    if (perHSBtvn && ban.roster?.length) {
      return (
        <div>
          {ban.roster.map((hs, hi) => (
            <div key={hs.id} className={hi > 0 ? 'hp-hs-recto' : undefined}>
              <BtvnBkHead buoiTitle={ban.tieuBai || ban.tieuDe} ngayPhat={ban.ngay ?? ''} ngayNop={ban.ngayNop ?? ''} lopTen={ban.lop ?? ''} hoTen={hs.ho_ten} gv={gv} />
              {ban.ghiChuDau && <div className="hp-note">{ban.ghiChuDau}</div>}
              <MucsBlock mucs={ban.mucs} gv={gv} moHinhLyThuyet={ban.moHinhLyThuyet} />
            </div>
          ))}
        </div>
      )
    }
    return (
      <div>
        <BtvnBkHead buoiTitle={ban.tieuBai || ban.tieuDe} ngayPhat={ban.ngay ?? ''} ngayNop={ban.ngayNop ?? ''} lopTen={ban.lop ?? ''} gv={gv} />
        {ban.ghiChuDau && <div className="hp-note">{ban.ghiChuDau}</div>}
        <MucsBlock mucs={ban.mucs} gv={gv} moHinhLyThuyet={ban.moHinhLyThuyet} />
      </div>
    )
  }
  return (
    <div>
      {/* Masthead — khuôn "mới nhất" bên Đại (gtbk-mh, commit redesign BK 08-08): khung gradient bo góc +
          vạch trái cầu vồng + logo thật + tiêu đề. Namespace RIÊNG `hpmh-*` (không đụng `.gtbk-*` của Đại).
          BỎ huy hiệu tròn "Buổi N" của Đại: Hình không có số buổi tách bạch sẵn ở MỌI nơi gọi (Kho tài
          liệu chỉ có tên ghép sẵn) — snapshot đơn giản hoá, xem DEVLOG. Dùng cho giáo trình 'lop'/ôn tập —
          BTVN ('nha') đã tách nhánh riêng ở trên. */}
      <div className="hpmh">
        <div className="hpmh-grid" />
        <div className="hpmh-brand"><img className="hpmh-logo" src={logoUrl} alt="BK Academy" /></div>
        <h1 className="hpmh-title">{ban.tieuDe}</h1>
        {ban.phuDe && <div className="hpmh-sub">{ban.phuDe}</div>}
      </div>
      {ban.ghiChuDau && <div className="hp-note">{ban.ghiChuDau}</div>}
      <MucsBlock mucs={ban.mucs} gv={gv} moHinhLyThuyet={ban.moHinhLyThuyet} />
    </div>
  )
}

/** Render danh sách MucIn — tách khỏi `Noi` để dùng lại được cho CẢ bản gộp (1 khối) LẪN mỗi phiếu perHS
 *  (đánh số "Bài N" RIÊNG từng lần gọi — `soDe`/`moHinhLtDaHien` là biến cục bộ, không rò giữa các lần gọi). */
// batDau = số "Bài" bắt đầu (mặc định 1) — nối số qua nhiều lần gọi.
// cauTu (MT, Thùy 02/09: "đánh giá theo từng ý") = đánh số THEO Ý nối tiếp câu Đại: bài 3 ý sau 16 câu Đại =
// "Câu 17–19." ở đầu bài, từng ý "Câu 17." "Câu 18." "Câu 19." (thay a/b/c); bài 1 ý = "Câu 17." không nhãn ý.
export function MucsBlock({ mucs, gv, moHinhLyThuyet, batDau = 1, cauTu }: { mucs: MucIn[]; gv: boolean; moHinhLyThuyet?: BanIn['moHinhLyThuyet']; batDau?: number; cauTu?: number }) {
  let soDe = batDau - 1
  let soCau = (cauTu ?? 1) - 1
  const nhanY = (y: YIn, k0: number, j: number, n: number): string => (cauTu != null ? (n > 1 ? `Câu ${k0 + j}.` : '') : (y.nhan ? `${y.nhan})` : ''))
  let moHinhLtDaHien = ''  // gom LT mô hình 1 lần/nhóm liền nhau (khuôn Đại: LT chuyên đề hiện 1 lần)
  return (
    <>
      {mucs.map((m, i) => {
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
        const k0 = soCau + 1; const nY = m.ys.length; soCau += nY
        const tieuDe = cauTu != null ? `Câu ${k0}${nY > 1 ? `–${k0 + nY - 1}` : ''}.` : `Bài ${soDe}.`
        // LT mô hình — hiện MỘT LẦN ngay trước bài đầu tiên của mỗi nhóm mô hình liền nhau (chỉ có data
        // khi banInTheoMoHinh dựng cho phan='lop' — bản BTVN không kèm, khuôn Đại "LT chỉ ở trên lớp").
        const ltMh = m.moHinhId ? moHinhLyThuyet?.[m.moHinhId] : null
        const hienLt = !!ltMh && m.moHinhId !== moHinhLtDaHien
        if (hienLt) moHinhLtDaHien = m.moHinhId!
        return (
          <Fragment key={i}>
            {hienLt && (
              <div className="hp-box-lt">
                <div className="hp-box-lt-t">Lý thuyết · {ltMh!.ten}</div>
                <MathText>{ltMh!.noiDung}</MathText>
              </div>
            )}
          <div className="hp-de">
            {/* ⭐ 16/08 (Thùy): ĐỀ và ĐÁP ÁN là HAI KHU RIÊNG — hình của đề ngang với đề, hình của lời
                giải ngang với lời giải. Trước đây cả bài là MỘT dòng chảy: hình đề `float:right` còn
                đứng đó thì hộp `.hp-giai` (có viền + nền) trượt xuống DƯỚI hình, rồi hình lời giải lại
                float vào chỗ đã bị chiếm ⇒ bố cục loạn, hình như hiện 2 lần lệch nhau.
                `.hp-khoi{display:flow-root}` cho mỗi khu tự chứa float của mình.
                ⚠ Dùng `flow-root`, KHÔNG dùng `overflow:hidden` — overflow ẩn trong paged.js CẮT nội
                dung ở chỗ sang trang (bẫy đã ghi trong DEVLOG), còn flow-root vẫn cho ngắt trang bình thường. */}
            <div className="hp-khoi hp-khoi-de">
              <div className="hp-de-h">{tieuDe}</div>
              {/* Hình / ô-vẽ FLOAT phải → đề + câu hỏi chảy SÁT bên trái, không bị đẩy xuống dưới hình.
                  Chi tiết 3 trạng thái ở khối ngay dưới. */}
              {/* 3 TRẠNG THÁI (Thùy 17/08):
                  'hien'    → in hình NẾU kho có ảnh. Kho KHÔNG có ảnh ⇒ không có hình, chấm hết — KHÔNG
                              tự suy ra ô vẽ (Thùy 17/08 lần 2: "bài nào trong kho mà ko có hình nghĩa là
                              'Không có hình' luôn, ko cần để trống để vẽ". Ô vẽ là lựa chọn CHỦ ĐỘNG của
                              người soạn — chỉ 'o_trong' mới có, không phải hệ quả của thiếu ảnh.)
                  'o_trong' → CHỦ ĐỘNG ẩn hình, chừa ô vẽ cho HS; bản GV vẫn hiện hình để đối chiếu.
                  'khong'   → KHÔNG hình, KHÔNG ô — kể cả khi kho có ảnh. */}
              {(() => {
                const cd = m.cheDo ?? 'hien'
                if (cd === 'khong') return null
                if (cd === 'o_trong') {
                  return gv && m.anhDe
                    ? <div className="hp-fig-r"><img src={m.anhDe} alt="" /></div>
                    : <div className="hp-draw-r"><span>Vẽ hình</span></div>
                }
                return m.anhDe ? <div className="hp-fig-r"><img src={m.anhDe} alt="" /></div> : null
              })()}
              <div className="hp-txt-flow"><MathText>{m.deBai}</MathText></div>
              {/* ⭐ 08-09 (Thùy chốt): dòng kẻ gán theo CẢ BÀI (chuỗi ghép a,b,c = 1 bài), nên đề a,b,c
                  phải in LIỀN KHỐI trước, RỒI MỚI đến phần giải chung — không xen kẽ "a - giải a - b -
                  giải b" như trước (đọc rối, và HS phải đợi giải xong ý này mới thấy đề ý sau). */}
              {m.ys.map((y, j) => (
                <div key={j} className="hp-y hp-txt-flow">
                  {nhanY(y, k0, j, nY) && <b>{nhanY(y, k0, j, nY)} </b>}<MathText>{y.giaThietPhu ? `${y.giaThietPhu}. ${y.noiDung}` : y.noiDung}</MathText>
                  {y.ghiChu && <span className="hp-tag">{y.ghiChu}</span>}
                </div>
              ))}
            </div>
            {gv
              ? <div className="hp-khoi hp-khoi-giai">{m.ys.map((y, j) => (
                <div key={`giai-${j}`} className="hp-y">
                  <div className="hp-giai">
                    {nhanY(y, k0, j, nY) && <b>{nhanY(y, k0, j, nY)} </b>}
                    {y.bacThamChieu && <div className="hp-bac">Lời giải THAM CHIẾU — lấy từ bài chuẩn, tên điểm theo hệ thống (không phải tên điểm của đề này).</div>}
                    {/* Node ẨN nở thành bước con (đề không hỏi vẫn phải giải) — đứng TRƯỚC lời giải chính. */}
                    {(y.buoc ?? []).map((b, bi) => (
                      <div key={bi} className="hp-buoc">
                        <b>Bước {bi + 1} — {b.phatBieu}: </b>
                        <MathText>{b.giaThietPhu ? `${b.giaThietPhu}. ${b.loiGiai ?? '—'}` : (b.loiGiai ?? '—')}</MathText>
                        {b.anh && <div className="hp-fig-r"><img src={b.anh} alt="" /></div>}
                      </div>
                    ))}
                    <MathText>{y.loiGiai ?? '—'}</MathText>
                    {/* Chỉ hiện hình ở KHU GIẢI khi nó là hình RIÊNG của lời giải (khác hình đề đã hiện
                        ở trên) — Thùy 17/08: "bài nào ko có hình riêng thì đáp án ko cần hiện hình nữa,
                        dùng hình đề bài là được". Nhiều nơi build YIn fallback y.anh = anh của đề khi
                        cách giải không có anh_loi_giai riêng ⇒ y.anh trùng hệt m.anhDe ⇒ lặp hình 2 lần. */}
                    {y.anh && y.anh !== m.anhDe && <div className="hp-fig-r"><img src={y.anh} alt="" /></div>}
                  </div>
                </div>
              ))}</div>
              // Bản HS: MỘT khối dòng kẻ chung cho cả bài (không phải 1 khối/ý — đúng "gán dòng theo cả
              // bài"), số dòng theo soDong đã chỉnh ở builder (ApplyDongChuoi, khuôn Đại "cả dạng" chứ
              // không theo từng ý), mặc định 3 dòng khi chưa chỉnh. soDong=0 → không kẻ (đề tự luận
              // không cần viết, vd đã ẩn hình cho HS vẽ).
              // ⭐ 17/08 (Thùy): "dòng kẻ lúc đậm lúc nhạt" — 1 div nền `repeating-linear-gradient` cao cả
              // khối bị rasterize print ra không đều (mép dải lặp lại rơi giữa 2 pixel-print thì mờ, rơi
              // đúng biên thì đậm). Đổi sang TỪNG DÒNG 1 div `border-bottom` riêng — đúng kỹ thuật Đại
              // đang dùng cho BTVN (`.pv-wline`, PrintView.tsx) — border là 1 nét browser vẽ y hệt nhau
              // mỗi dòng, không phụ thuộc rasterize gradient.
              : m.soDong !== 0 && (
                <div className="hp-ke">
                  {Array.from({ length: m.soDong ? Math.max(1, m.soDong) : 3 }).map((_, i) => <div key={i} className="hp-wline" />)}
                </div>
              )}
            <div style={{ clear: 'both' }} />
          </div>
          </Fragment>
        )
      })}
    </>
  )
}

// CSS nội dung bản Hình. Nối SAU buildPagedCss nên ghi đè được phần chung khi cần.
const HP_SANS = "'Noto Sans','Segoe UI',Arial,sans-serif"
export const HINH_CSS = `
/* Masthead — khuôn "mới nhất" bên Đại (gtbk-mh), namespace RIÊNG hpmh-* (xem comment ở Noi()). */
.hpmh{position:relative;overflow:hidden;margin:2mm 0 5mm;min-height:26mm;padding:5mm 6mm;border:1px solid #dbe7f4;border-radius:5mm;background:linear-gradient(112deg,#f5fbff 0%,#f8fbff 42%,#fff7fb 100%);break-inside:avoid;break-after:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hpmh:before{content:"";position:absolute;left:0;top:0;bottom:0;width:2.3mm;background:linear-gradient(180deg,#1997d4 0%,#18a889 36%,#f0a63b 68%,#e83483 100%);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hpmh:after{content:"";position:absolute;right:-10mm;top:-16mm;width:62mm;height:62mm;border-radius:50%;border:9mm solid rgba(25,151,212,.055);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hpmh-grid{position:absolute;right:8mm;top:4mm;width:43mm;height:20mm;opacity:.16;background-image:radial-gradient(#53739c 1px,transparent 1px);background-size:5px 5px;transform:rotate(-5deg);z-index:0}
.hpmh-brand{position:relative;z-index:3;margin-bottom:3mm}
.hpmh-logo{height:6.5mm;width:auto;display:block}
.hpmh-title{position:relative;z-index:3;margin:0;font-family:${HP_SANS};font-size:21pt;line-height:1.1;letter-spacing:-.03em;color:#142744;font-weight:900}
.hpmh-sub{position:relative;z-index:3;margin-top:1.8mm;font-family:${HP_SANS};font-size:9.6pt;color:#6a7a93;font-weight:600}
.hp-note{background:#fffaf1;border:1px solid #f0c987;border-radius:8px;padding:8px 11px;font-size:14px;color:#8a5a12;margin-bottom:12px}
/* "Cả lớp" BTVN — mỗi phiếu HS (trừ phiếu đầu) ngắt sang trang LẺ, khuôn .pv-hs-recto của Đại (PrintView.tsx). */
.hp-hs-recto{break-before:right}
/* Lý thuyết mô hình — khuôn .pv-box-lt/.pv-box-label của Đại (PrintView.tsx), namespace hp-*. */
.hp-box-lt{background:#eff7fd;border:1px solid #cfe6f5;border-radius:9px;padding:11px 13px;margin-bottom:10px;break-inside:avoid}
.hp-box-lt-t{font-size:15px;font-weight:800;text-transform:uppercase;color:#2D9CDB;letter-spacing:.3px;margin-bottom:5px;break-after:avoid}
.hp-chuong{background:#e6f5f1;border:1px solid #5eccb0;border-radius:8px;padding:9px 12px;margin:14px 0 8px;break-inside:avoid;break-after:avoid}
.hp-chuong-t{font-weight:800;color:#0f6e56;font-size:17px}
.hp-chuong-m{font-size:15px;color:#374151;margin-top:2px}
.hp-nhac{border:1px dashed #cbd5e1;border-radius:8px;padding:9px 12px;margin-bottom:12px;background:#fafbfc;break-inside:avoid}
.hp-nhac-t{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280;font-weight:700;margin-bottom:4px}
.hp-nhac-i{font-size:15px;color:#374151;margin:2px 0}
.hp-de{margin:0 0 8px;break-inside:auto}
/* Mỗi KHU (đề · lời giải) tự chứa float của mình ⇒ hình luôn ngang với phần văn bản của chính nó.
   flow-root chứ KHÔNG overflow:hidden — overflow ẩn cắt nội dung khi paged.js sang trang. */
.hp-khoi{display:flow-root}
.hp-khoi-giai{margin-top:5px}
.hp-de-h{font-weight:800;color:#134e4a;font-size:18px;margin:4px 0 3px;break-after:avoid}
/* Đề + câu hỏi CHẢY sát bên trái · hình/ô-vẽ FLOAT phải (câu hỏi nằm ngay sau đề, không đợi hết chiều cao hình) */
.hp-txt-flow{font-size:17px}
.hp-fig-r{float:right;width:36%;margin:0 0 3px 5mm;box-sizing:border-box}
.hp-fig-r img{width:100%;max-height:50mm;object-fit:contain;border:1px solid #e2e8f0;border-radius:6px;background:#fff}
/* ⭐ Ô TRỐNG vẽ hình (Thùy 28/08: "to hơn 1 chút và có chia lưới ô vuông mờ mờ để HS vẽ hình cho dễ") —
   to hơn (40%×58mm → 46%×68mm) + lưới ô vuông 5mm mờ (giống giấy kẻ ly) làm nền, không đụng khung/nhãn. */
.hp-draw-r{float:right;width:46%;height:68mm;margin:0 0 3px 5mm;box-sizing:border-box;border:1px dashed #94a3b8;border-radius:6px;background:#fff;position:relative;
  background-image:linear-gradient(#eef1f6 1px,transparent 1px),linear-gradient(90deg,#eef1f6 1px,transparent 1px);background-size:5mm 5mm}
.hp-draw-r span{position:absolute;top:4px;left:6px;font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;background:#fff;padding:0 3px}
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
/* flow-root: hình của lời giải (float) phải nằm TRONG hộp có viền, không tràn ra ngoài khi lời giải ngắn. */
.hp-giai{display:flow-root;font-size:16px;color:#374151;background:#fbfcff;border:1px solid #e5e9f0;border-radius:7px;padding:7px 10px;margin-top:4px}
.hp-bac{font-size:12px;color:#8a5a12;background:#fffaf1;border-radius:5px;padding:3px 7px;margin-bottom:5px}
.hp-buoc{margin:0 0 5px;padding-left:9px;border-left:2px solid #cdd6e4}
.hp-buoc b{color:#0f766e}
/* bản HS: chỗ trống có DÒNG KẺ để viết — mỗi dòng 1 div border-bottom riêng (khuôn .pv-wline của Đại,
   PrintView.tsx) — KHÔNG dùng repeating-linear-gradient nữa (rasterize print ra đậm/nhạt không đều). */
.hp-ke{margin-top:3px}
.hp-wline{height:7.7mm;border-bottom:1px dotted #9aa6b2}
`
