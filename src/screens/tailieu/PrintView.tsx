import { Children, Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Previewer } from 'pagedjs'
import { getTaiLieuFull, setTaiLieuFileUrl, DEFAULT_BTVN_LINES, kieuCols, type TaiLieuFull, type PhanResolved } from '../../lib/tailieu'
import type { CauHinh } from '../../lib/tailieu'
import { listLop } from '../../lib/nhansu'
import { hsCoMatCuaBuoi, ngayBuoiHopLeCuaLop } from '../../lib/gami'
import { congNgay } from '../../lib/tuan'
import { BK_CSS, BtvnBkHead } from './bkPrint'
import { MathText } from '../kho/ui'
import { uploadKhoFile } from '../../lib/kho/api'
import type { CauHoi } from '../../lib/kho/api'

// Bộ đếm render TOÀN CỤC → mỗi lần dựng trang có 1 class scope riêng (`pv-scope-N`) gắn lên container.
// CSS chrome (::before/::after) prefix bằng class này ⇒ stylesheet paged.js chèn vào <head> chỉ khớp ĐÚNG
// container của nó, không đè sang trang của render khác (gốc bug "nhầm lớp" — xem comment ở effect dựng trang).
let pvRenderSeq = 0
// Tên file an toàn Windows (bỏ \ / : * ? " < > | và khoảng trắng thừa).
export function safeFileName(s: string): string {
  return (s || 'tai-lieu').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120) || 'tai-lieu'
}
// Thùy 07-11: native print "không khác gì bấm in thủ công" nếu vẫn phải tự gõ tên file trong hộp thoại.
// Chromium (kể cả Microsoft Print to PDF) lấy document.title làm tên file GỢI Ý mặc định trong hộp thoại
// lưu — đổi title ngay trước khi print(), khôi phục lại sau khi hộp thoại đóng (`afterprint`, bắn dù bấm
// lưu hay huỷ) để không lộ tên file ra tiêu đề tab thật.
export function printWithFilename(filename: string) {
  const prev = document.title
  document.title = safeFileName(filename)
  const restore = () => { document.title = prev; window.removeEventListener('afterprint', restore) }
  window.addEventListener('afterprint', restore)
  window.print()
}
// ⭐ 08-18 (Thùy báo "ET 12A1 trang 2 trắng"): paged.js thỉnh thoảng DỰNG DỞ giữa chừng 1 trang rồi bỏ
// trống, dựng lại đúng ở trang sau (lỗi ENGINE — đo thật bằng Chrome headless + đếm trang: đổi break-inside/
// CSS grid/ảnh ở header và câu KHÔNG ăn thua, trang trắng vẫn y nguyên vị trí, không phải do 1 rule CSS cụ
// thể của ta). KHÁC với trang trắng CUỐI mỗi mã đề/phiếu (`.pv-de-recto{break-before:right}`, cố ý — canh
// mã đề/phiếu sau bắt đầu ở trang lẻ để in 2 mặt không dính nhau, Thùy xác nhận "chuẩn"). Sửa bằng dọn HẬU
// KỲ sau khi paged.js dựng xong: xoá trang trắng nào KHÔNG PHẢI đệm hợp lệ trước 1 khối mới — phân biệt
// bằng trang SAU nó có mở đầu phiếu (`.pv-bkh`) mới hay không. Trang trắng cuối cùng (không có trang sau
// để so) luôn GIỮ. Dùng chung ET + MT (cùng `.pv-bkh`/`.pv-de-recto`/paged.js — cùng lớp bug).
export function pruneGhostBlankPages(container: HTMLElement) {
  const pages = Array.from(container.querySelectorAll<HTMLElement>('.pagedjs_page'))
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i]
    if ((p.textContent ?? '').trim()) continue          // có nội dung thật — không đụng
    const next = pages[i + 1]
    if (!next) continue                                  // trắng CUỐI CÙNG — đệm hợp lệ (canh in 2 mặt), giữ
    if (next.querySelector('.pv-bkh')) continue          // ngay trước khối mới — đệm hợp lệ, giữ
    p.remove()                                            // còn lại = paged.js dựng dở giữa chừng — xoá
  }
}
// ⭐ 07-12 tiếp 6 — QUYẾT ĐỊNH KIẾN TRÚC: sau 3 LẦN sửa header/footer bằng html2canvas (override CSS
// `!important`, xoá rule CSSOM có chờ load, opacity:0 + gate selector `:not(.pv-no-chrome)`) ĐỀU
// THẤT BẠI qua verify THẬT trên máy Thùy (không phải giả lập) — chữ vẫn nhân đôi y hệt mỗi lần. Thùy:
// "cái lỗi canvas m đã gặp rất nhiều lần rồi đấy" — đúng, đây là bug thứ 4-5 CÙNG NGUỒN html2canvas
// trong session (JPEG rám, nền sóng lệch, giờ chữ đôi). KẾT LUẬN: html2canvas không đáng tin cho khối
// header/footer (dải màu+logo+chữ) DÙ CÁCH NÀO — nhưng THÂN BÀI (câu/lý thuyết/ảnh/KaTeX) qua
// html2canvas vẫn ổn định suốt session, không đáng để bỏ luôn html2canvas cho cả file.
// FIX TẬN GỐC: header/footer KHÔNG còn qua html2canvas nữa — vẽ TRỰC TIẾP bằng jsPDF (dải gradient mô
// phỏng bằng nhiều dải màu mảnh, logo qua `addImage`, chữ qua `pdf.text`) NGAY SAU KHI dán ảnh thân bài
// vào từng trang — vẽ ĐÈ LÊN nên dù html2canvas có chụp sót gì ở đúng vùng đó cũng bị che kín hoàn
// toàn, không còn phụ thuộc html2canvas "làm đúng" bất kỳ điều gì cho khối chrome nữa.
function hexRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}
function drawGradientBar(pdf: InstanceType<typeof import('jspdf').jsPDF>, x: number, y: number, w: number, h: number, colors: string[]) {
  const steps = 48
  const stepW = w / steps
  const stops = colors.map(hexRgb)
  for (let i = 0; i < steps; i++) {
    const t = (i / (steps - 1)) * (stops.length - 1)
    const idx = Math.min(Math.floor(t), stops.length - 2)
    const frac = t - idx
    const [r1, g1, b1] = stops[idx]; const [r2, g2, b2] = stops[idx + 1]
    pdf.setFillColor(Math.round(r1 + (r2 - r1) * frac), Math.round(g1 + (g2 - g1) * frac), Math.round(b1 + (b2 - b1) * frac))
    pdf.rect(x + i * stepW, y, stepW + 0.4, h, 'F') // +0.4mm chồng nhẹ, tránh khe hở trắng mảnh giữa các dải
  }
}
function drawChrome(pdf: InstanceType<typeof import('jspdf').jsPDF>, cr: PageChrome, logoImg: HTMLImageElement | null): void {
  if (cr.head) {
    drawGradientBar(pdf, 0, 0, 210, 18, ['#E91E8C', '#F7941E', '#2D9CDB'])
    pdf.setFillColor(255, 255, 255); pdf.setDrawColor(223, 229, 236)
    try { pdf.roundedRect(4.5, 1.5, 42, 9, 2, 2, 'FD') } catch { pdf.rect(4.5, 1.5, 42, 9, 'F') }
    if (logoImg) {
      try { const w = 5 * (logoImg.naturalWidth / logoImg.naturalHeight || 3); pdf.addImage(logoImg, 'PNG', 8, 3.5, w, 5) } catch { /* logo lỗi không chặn cả PDF */ }
    }
    pdf.setTextColor(255, 255, 255); pdf.setFont('times', 'bold'); pdf.setFontSize(11)
    pdf.text(cr.headText, 200, 10.5, { align: 'right', baseline: 'middle' })
  }
  if (cr.foot) {
    drawGradientBar(pdf, 0, 297 - 15, 210, 15, ['#2D9CDB', '#F7941E', '#E91E8C'])
    pdf.setTextColor(255, 255, 255); pdf.setFont('times', 'bold'); pdf.setFontSize(11)
    const lines = cr.footPre ? cr.footText.split('\n') : [cr.footText]
    const baseY = 297 - 15 / 2
    if (lines.length <= 1) pdf.text(cr.footText, 105, baseY, { align: 'center', baseline: 'middle' })
    else lines.forEach((ln, idx) => pdf.text(ln, 105, baseY - (lines.length - 1) * 2 + idx * 4, { align: 'center', baseline: 'middle' }))
  }
}
// ⭐ 07-11 — QUYẾT ĐỊNH KIẾN TRÚC (Thùy chốt sau nhiều lần lỗi rám chữ/nhân bản trang): "⬇ Tải PDF"
// (tải file cục bộ) KHÔNG còn tự dựng file qua html2canvas nữa — đổi thẳng sang `window.print()`
// (NATIVE, xem hàm `inNative` + headless effect) = ĐÚNG engine trình duyệt (giống hệt "Microsoft Print
// to PDF" Thùy đã xác nhận đẹp), không còn 1 dòng JS nào tự vẽ lại trang. Lý do html2canvas hay lỗi:
// nó là 1 thư viện JS RE-IMPLEMENT việc chụp màn hình (không phải engine in thật của trình duyệt) —
// chạy SONG SONG/đua với paged.js (thư viện phân trang, cũng chỉ là JS polyfill) → 2 thứ JS độc lập dễ
// lệch nhau (đúng nguồn gốc bug rám chữ + nhân bản trang). `window.print()` thì lấy THẲNG state DOM đã
// ổn định, do chính trình duyệt render — không có khâu "vẽ lại" nào để lệch. Đánh đổi DUY NHẤT: cần 1
// bước chọn đích trong hộp thoại in (không còn "1-click, không hộp thoại") — chấp nhận được, đổi lấy
// ĐỘ TIN CẬY thay vì tự vẽ lại và có thể sai.
// Hàm dưới đây (uploadPagesAsLink) GIỜ CHỈ CÒN 1 NHIỆM VỤ: dựng PDF qua html2canvas để có 1 FILE BLOB
// upload lên Storage cho action "🔗 Lấy link" — bắt buộc phải tự dựng (không dùng native print được) vì
// link cần tạo ẨN, không hộp thoại, không phụ thuộc Thùy có ở máy lúc đó hay không.
export async function uploadPagesAsLink(dst: HTMLElement, filename: string, chrome: PageChrome | undefined, taiLieuId: string): Promise<string> {
  const [h2cMod, jspdfMod] = await Promise.all([import('html2canvas-pro'), import('jspdf')])
  const html2canvas = h2cMod.default
  const pages = Array.from(dst.querySelectorAll('.pagedjs_page')) as HTMLElement[]
  if (!pages.length) throw new Error('Chưa có trang nào để tải — đợi dựng trang xong.')
  // Chờ FONT (KaTeX + Times) sẵn sàng → tránh chụp ra trang trắng chữ (vẫn cần cho THÂN BÀI qua html2canvas).
  try { await (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready } catch { /* */ }
  // Nạp logo để jsPDF vẽ trực tiếp (KHÔNG còn qua html2canvas nữa — xem drawChrome phía trên).
  let logoImg: HTMLImageElement | null = null
  if (chrome?.logoUrl) {
    logoImg = await new Promise<HTMLImageElement | null>((res) => {
      const im = new Image(); im.crossOrigin = 'anonymous'
      im.onload = () => res(im); im.onerror = () => res(null)
      im.src = chrome.logoUrl
    })
  }
  // `pv-no-chrome` (gate selector, mục tiếp 5) GIỮ LẠI — html2canvas khỏi phí công chụp pseudo-element
  // header/footer nữa (giờ vẽ đè bằng jsPDF rồi, chụp hay không cũng bị che, nhưng bỏ chụp cho NHẸ).
  const pageboxes = Array.from(dst.querySelectorAll('.pagedjs_pagebox')) as HTMLElement[]
  pageboxes.forEach((pb) => pb.classList.add('pv-no-chrome'))
  // Supabase storage (bucket 'kho-tailieu') có TRẦN dung lượng THẬT — đo trực tiếp 07-12: upload 40MB
  // qua được, 60MB bị chặn với lỗi 400 "The object exceeded the maximum allowed size" — ĐÚNG lỗi Thùy
  // gặp khi tài liệu dài (nhiều trang PNG scale:2 cộng dồn vượt trần). Build ở scale CAO nhất trước (giữ
  // nguyên chất lượng mặc định — đa số tài liệu KHÔNG vượt trần); CHỈ khi blob thật sự vượt ngưỡng an
  // toàn mới build LẠI ở scale thấp hơn. Giảm ĐỘ PHÂN GIẢI, KHÔNG đổi sang JPEG — JPEG đã bị loại bỏ
  // trước đó vì nén mất-dữ-liệu làm rám/vỡ viền chữ nhỏ (xem comment trong build()), đổi lại sẽ tái phạm.
  const SAFE_BYTES = 45 * 1024 * 1024
  async function build(scale: number): Promise<Blob> {
    const pdf = new jspdfMod.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale, useCORS: true, backgroundColor: '#ffffff', logging: false, imageTimeout: 15000 })
      if (i > 0) pdf.addPage()
      // PNG (KHÔNG JPEG) — JPEG nén mất-dữ-liệu làm rám/vỡ viền chữ nhỏ trên nền nhiều màu.
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297)
      // Vẽ header/footer BẰNG jsPDF, ĐÈ LÊN sau ảnh thân bài — xem comment kiến trúc ở drawChrome phía trên.
      if (chrome) drawChrome(pdf, chrome, logoImg)
    }
    return pdf.output('blob') as Blob
  }
  try {
    let blob = await build(2)
    if (blob.size > SAFE_BYTES) blob = await build(1.3)
    if (blob.size > SAFE_BYTES) throw new Error(`File PDF quá lớn (${(blob.size / 1024 / 1024).toFixed(1)}MB, giới hạn ~50MB) dù đã giảm độ phân giải — tài liệu quá dài, cần rút gọn nội dung.`)
    const outName = safeFileName(filename) + '.pdf'
    const { url } = await uploadKhoFile(new File([blob], outName, { type: 'application/pdf' }))
    await setTaiLieuFileUrl(taiLieuId, url)
    return url
  } finally {
    pageboxes.forEach((pb) => pb.classList.remove('pv-no-chrome'))
  }
}

// headless = KHÔNG hiện preview, tự dựng trang ẩn → tải PDF → đóng (nút "⬇ Tải" ngay ở hàng Kho tài liệu).
// onlyBuoiId = chỉ render 1 BUỔI (nút "👁 Xem buổi" ở Builder) — kiểm tra nhanh, khỏi cuộn cả giáo trình.
// onReady/onRenderErr (07-12, đời 2 server-gen): tín hiệu cho PrintJobPage (trang worker Puppeteer) —
// loại btvn/giao_trinh_buoi vẫn có thể render lại khi SCOPE tự chuyển (btvn → mặc định scope BTVN),
// nhưng KHÔNG còn render 2 lần vì lopTen nữa (fix 07-16 — dựng trang đợi lopTen nạp xong hẳn mới chạy,
// xem comment ở khai báo lopTen). PrintJobPage vẫn giữ debounce làm lớp an toàn phụ, không dựa vào nó.
export default function PrintView({ id, onClose, headless, onlyBuoiId, linkOnly, onFail, onReady, onRenderErr }: { id: string; onClose: () => void; headless?: boolean; onlyBuoiId?: string; linkOnly?: boolean; onFail?: () => void; onReady?: () => void; onRenderErr?: (msg: string) => void }) {
  const [full, setFull] = useState<TaiLieuFull | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [gv, setGv] = useState(false) // false = bản HS · true = bản GV
  const [scope, setScope] = useState<'all' | 'giaotrinh' | 'btvn'>('all') // tách quyển: giáo trình (LT+luyện) vs BTVN riêng
  const [perHS, setPerHS] = useState(false)              // in cả lớp: mỗi HS có mặt 1 phiếu, tên in sẵn
  const [roster, setRoster] = useState<{ id: string; ho_ten: string; ma_hs: string | null }[]>([])
  const [ngayNop, setNgayNop] = useState('')             // ngày nộp = buổi TKB kế tiếp − 1 ngày (dd/mm/yyyy)
  const lt = full?.taiLieu.cau_hinh?.inLyThuyet !== false // kèm LÝ THUYẾT = SETTING của giáo trình (default có); trích xuất kế thừa
  const buoiTitle = onlyBuoiId ? full?.phans.find((p) => p.id === onlyBuoiId)?.tieu_de : undefined
  const [pages, setPages] = useState(0)
  const [rendering, setRendering] = useState(true)
  const [renderErr, setRenderErr] = useState<string | null>(null)
  const [, setDl] = useState(false) // "đang lấy link" — chỉ đọc trong headless linkOnly, nút "⬇ Tải PDF" đã bỏ
  const srcRef = useRef<HTMLDivElement>(null)
  const dstRef = useRef<HTMLDivElement>(null)
  const activeContainerRef = useRef<HTMLElement | null>(null)
  // ⭐ Fix 07-16 (Thùy: in giáo trình buổi 9S1 ra lại hiện tên "7S2"): lopTen null = CHƯA nạp xong (khác
  // '' = có nạp nhưng không có lớp) — TRƯỚC đây fetch full và fetch lopTen là 2 effect TÁCH RỜI, không
  // reset lopTen khi id đổi và không có cờ "cancelled" → nếu PrintView bị TÁI SỬ DỤNG cho tài liệu khác
  // (id đổi mà component không unmount hẳn), lopTen của tài liệu CŨ có thể lộ ra hoặc trả lời SAU tài
  // liệu MỚI (race), in nhầm tên lớp. Gộp lại 1 effect DUY NHẤT, reset NGAY trước query (CLAUDE.md §2),
  // có "cancelled" guard — và bên dưới đợi lopTen nạp xong mới dựng trang (bỏ hẳn kiểu "render 2 lần rồi
  // debounce lấy lần cuối" cũ, vốn là chỗ hở cho race).
  const [lopTen, setLopTen] = useState<string | null>(null) // null = chưa nạp xong (buoiDoc), '' = không có lớp
  useEffect(() => {
    let cancelled = false
    setFull(null); setLopTen(null)
    getTaiLieuFull(id).then((f) => {
      if (cancelled) return
      setFull(f)
      const lopId = (f.taiLieu as { lop_id?: string | null }).lop_id
      if (!['btvn', 'giao_trinh_buoi'].includes(f.taiLieu.loai) || !lopId) { setLopTen(''); return }
      listLop().then((ls) => { if (!cancelled) setLopTen(ls.find((l) => l.id === lopId)?.ten_lop ?? '') })
        .catch(() => { if (!cancelled) setLopTen('') })
    }).catch((e) => { if (!cancelled) setErr(e.message ?? String(e)) })
    return () => { cancelled = true }
  }, [id])
  // Doc 'btvn' (trích xuất) → chỉ có phần BTVN → mặc định scope BTVN.
  useEffect(() => { if (full?.taiLieu.loai === 'btvn') setScope('btvn') }, [full])
  // BTVN: nạp HS có mặt (in tên sẵn) + tính NGÀY NỘP = buổi TKB kế tiếp − 1 ngày. Áp cho mọi doc có lớp+ngày
  // (btvn riêng hoặc giáo trình buổi) — không khóa theo loai để in cả lớp chạy cả khi xem BTVN từ giáo trình.
  useEffect(() => {
    const tl = full?.taiLieu as { lop_id?: string | null; ngay?: string | null } | undefined
    if (!tl?.lop_id || !tl.ngay) { setRoster([]); setNgayNop(''); return }
    let alive = true
    const lopId = tl.lop_id, ngay = tl.ngay
    hsCoMatCuaBuoi(lopId, ngay).then((r) => { if (alive) setRoster(r) }).catch(() => { if (alive) setRoster([]) })
    ngayBuoiHopLeCuaLop(lopId, ngay, congNgay(ngay, 120)).then((list) => {
      if (!alive) return
      const next = list.map((x) => x.ngay).find((d) => d > ngay)   // buổi TKB đầu tiên SAU ngày phát
      setNgayNop(next ? congNgay(next, -1).split('-').reverse().join('/') : '')
    }).catch(() => { if (alive) setNgayNop('') })
    return () => { alive = false }
  }, [full])

  // Phân trang THẬT bằng paged.js → preview = bản in (A4, header/footer + số trang mỗi trang).
  useEffect(() => {
    if (!full || !srcRef.current || !dstRef.current) return
    if (lopTen === null) return // buoiDoc: đợi lopTen nạp xong hẳn — KHÔNG dựng trang 2 lần nữa (fix 07-16, xem comment lopTen)
    let cancelled = false
    setRendering(true); setRenderErr(null)
    const ch0 = full.taiLieu.cau_hinh ?? {}
    // ⭐ Thùy chốt: BỎ HẲN dải header/footer sóng cũ ở MỌI NƠI (không tái dùng). Header luôn 'none'.
    //   Từ 08-08: GIÁO TRÌNH và BTVN DÙNG CHUNG kiểu BK mới — dải gradient trên/dưới + footer liên hệ + số
    //   trang (gtPageCss), nội dung theo GT_BK_CSS (masthead + card từng dạng). BTVN chỉ khác ở đầu phiếu
    //   (BtvnBkHead = masthead + ô Họ tên·Lớp·Điểm) và câu có dòng kẻ — style vẫn chung. BK_CSS giữ cho
    //   .pv-bkh* (ô HS của BtvnBkHead). Luật recto (in cả lớp chẵn trang) nằm trong gtPageCss.
    // → footer LUÔN 'none' (buildPagedCss không vẽ sóng nữa); chrome mới đều là pseudo tự thêm.
    const ch = { ...ch0, header: 'none' as const, footer: 'none' as const }
    // ⭐ Scope CSS chrome theo ĐÚNG container render này (class `pv-scope-N` gắn lên container bên dưới) →
    //   stylesheet paged.js chèn toàn cục vào <head> KHÔNG còn đè header lên trang của render khác. Đây là
    //   gốc bug "nhầm lớp": render doc trước (chậm) resolve SAU → chèn <style> sau cùng → header của nó
    //   thắng cascade, sơn "Lớp 6S2 · 16/07" lên trang 8B1 đang xem. Scope selector khớp đúng container.
    const scopeCls = `pv-scope-${++pvRenderSeq}`
    const css = buildPagedCss(full.taiLieu, ch, ch0.mau || '#E91E8C', undefined, `.${scopeCls}`)
      + BK_CSS + GT_BK_CSS + gtPageCss(`.${scopeCls} `)
    const cssUrl = URL.createObjectURL(new Blob([css], { type: 'text/css' }))
    const html = srcRef.current.innerHTML
    // Race-safe: mỗi lần render vào CONTAINER RIÊNG (append live để paged.js đo layout). KHÔNG xoá DOM
    // container cũ khi bắt đầu run mới (đã thử — rút DOM giữa lúc paged.js Previewer còn đo layout dở
    // của run TRƯỚC khiến nó sinh trang CHẠY LOẠN, case thật: tài liệu vài trang tải ra 200-400 trang/
    // 20-40MB, xem DEVLOG 07-11). Thay vào đó: resolve xong mới ẨN (display:none, KHÔNG remove) container
    // khác + trỏ activeContainerRef — tải/in luôn theo activeContainerRef, không quét cả dstRef.
    const dst = dstRef.current
    const container = document.createElement('div')
    container.className = scopeCls // scope chrome CSS: các .pagedjs_page paged.js sinh ra nằm TRONG container này
    dst.appendChild(container)
    // Watchdog: paged.js Previewer.preview() từng TREO VĨNH VIỄN không resolve/không lỗi (xem DEVLOG
    // 07-11) — không có nó, headless (in nhanh/lấy link) mắc kẹt "⏳" mãi mãi KHÔNG CÓ NÚT ĐÓNG (nút chỉ
    // hiện khi renderErr có giá trị). Quá 30s coi như treo → set renderErr (tự hiện nút Đóng + ngăn
    // auto-trigger in/lấy-link chạy tiếp trên trang dựng dở).
    let settled = false
    const watchdog = setTimeout(() => {
      if (settled || cancelled) return
      settled = true
      container.style.display = 'none'
      setRenderErr('Dựng trang quá lâu (>30s) — đóng rồi thử lại.'); setRendering(false)
      onRenderErr?.('Dựng trang quá lâu (>30s)')
    }, 30000)
    // ⭐ Chờ FONT (KaTeX + Times + Noto Sans) sẵn sàng TRƯỚC khi paged.js đo layout — thiếu bước này,
    // paged.js đo chiều cao từng khối bằng font FALLBACK (chưa tải xong), rồi font thật swap vào SAU
    // (FOUT) làm nội dung đổi chiều cao trong khi trang đã chốt xong theo số đo cũ → 1 khối bị đo/dựng
    // HAI LẦN LỆCH NHAU, sinh đúng bug Thùy báo (GT 8S1 14/08): card đầu buổi render DỞ ở trang 1, trang
    // 2 TRẮNG HOÀN TOÀN, rồi render LẠI TỪ ĐẦU y hệt ở trang 3. Đã có sẵn cho nhánh html2canvas
    // (uploadPagesAsLink, PrintView.tsx ~99) nhưng CHƯA áp cho Previewer chính — đây mới là đường
    // NGƯỜI DÙNG THẤY khi bấm 🖨 In (nhánh kia chỉ chạy khi bấm 🔗 Lấy link).
    ;(async () => {
      try { await (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready } catch { /* */ }
      // ⭐ 08-19 (Thùy báo "BTVN 4A1 trống trang 1"): CÙNG LỚP BUG với font ở comment trên, nhưng cho ẢNH
      // (logo masthead .gtbk-mh-logo, ảnh câu…) — chưa decode xong lúc paged.js đo lần đầu → masthead đo
      // SAI chiều cao (ảnh coi như 0/khác cỡ thật) → card kế tiếp bị tính hụt chỗ, đẩy hẳn sang trang sau dù
      // đo lại (final paint) thì masthead co đúng cỡ, để lại khoảng trắng đúng bằng phần hụt đó. fonts.ready
      // không bao giờ chờ ảnh — phải tự đợi riêng.
      try {
        const imgs = [...(srcRef.current?.querySelectorAll('img') ?? [])]
        await Promise.all(imgs.map((img) => img.complete ? Promise.resolve() : img.decode().catch(() => new Promise((res) => { img.onload = img.onerror = res }))))
      } catch { /* */ }
      if (settled || cancelled) return
      new Previewer().preview(html, [cssUrl], container)
        .then((flow: { total?: number }) => {
          if (settled) return
          settled = true; clearTimeout(watchdog)
          if (cancelled) { container.style.display = 'none'; return } // stale (deps đã đổi) → ẩn, không đụng state
          Array.from(dst.children).forEach((c) => { if (c !== container) (c as HTMLElement).style.display = 'none' })
          activeContainerRef.current = container
          setPages(flow?.total ?? 0); setRendering(false)
          onReady?.()
        })
        .catch((e: unknown) => {
          if (settled) return
          settled = true; clearTimeout(watchdog)
          container.style.display = 'none'
          if (!cancelled) { setRenderErr(e instanceof Error ? e.message : String(e)); setRendering(false); onRenderErr?.(e instanceof Error ? e.message : String(e)) }
        })
        .finally(() => URL.revokeObjectURL(cssUrl))
    })()
    return () => { cancelled = true; clearTimeout(watchdog) }
  }, [full, gv, scope, lopTen, onlyBuoiId, perHS, roster, ngayNop])

  const seg = (on: boolean) => `rounded-md px-3 py-1 text-[13px] font-medium transition ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`

  // Tên file DÙNG CHUNG cho "🖨 In / Xuất PDF" (title gợi ý hộp thoại) và "🔗 Lấy link" (tên file Storage)
  // — 2 đường xuất khác engine nhưng phải ra CÙNG 1 TÊN, không lệch nhau.
  function printFileName() {
    const scopeSuffix = scope === 'btvn' ? ' - BTVN' : scope === 'giaotrinh' ? ' - Giáo trình' : ''
    const buoiSuffix = onlyBuoiId && buoiTitle ? ` - ${buoiTitle}` : ''
    return `${full?.taiLieu.ten ?? ''}${buoiSuffix}${scopeSuffix}${gv ? ' - Bản GV' : ''}`
  }

  // "🔗 Lấy link" — CHỈ dùng cho linkOnly (headless), không dùng cho "⬇ Tải PDF" (giờ = native print, xem
  // dưới). Vẫn phải tự dựng qua html2canvas vì cần 1 FILE BLOB để upload ẨN, không hộp thoại.
  // Trả boolean (KHÔNG throw) — caller (didAutoDl, LinkGenWorker qua onClose/onFail) cần biết ĐÚNG kết
  // quả để báo lỗi ngay (linkGenFailed) thay vì đợi hết watchdog 45s mới coi là lỗi (chỉ watchdog mới
  // đúng cho ca TREO, còn lỗi tường minh — vd upload 400 — biết ngay không cần chờ).
  async function layLink(): Promise<boolean> {
    if (!activeContainerRef.current || !full) return false
    setDl(true); setRenderErr(null)
    const ch0 = full.taiLieu.cau_hinh ?? {}
    // Bỏ HẲN chrome sóng cũ ở MỌI NƠI, ĐỒNG BỘ với preview: header + footer đều 'none' (BTVN dùng footer
    // pill BK, giáo trình dùng dải/footer gradient — cả hai là pseudo trong CSS, không phải chrome vẽ tay).
    const ch = { ...ch0, header: 'none' as const, footer: 'none' as const }
    try { await uploadPagesAsLink(activeContainerRef.current, printFileName(), pageChrome(full.taiLieu, ch), full.taiLieu.id); return true }
    catch (e) { setRenderErr('Lấy link lỗi: ' + (e instanceof Error ? e.message : String(e))); return false }
    finally { setDl(false) }
  }

  // headless KHÔNG linkOnly = "⬇ Tải PDF" từ hàng Kho tài liệu → NATIVE PRINT (window.print(), xem quyết
  // định kiến trúc ở uploadPagesAsLink phía trên) — chờ trang dựng xong (350ms đệm phòng render 2-pass
  // của BTVN/giáo-trình-buổi) rồi mở hộp thoại in; đóng khi hộp thoại đóng (`afterprint`), KHÔNG tự đoán
  // thời điểm xong như trước (html2canvas là async, native print thì trình duyệt tự báo xong qua event).
  const didAutoDl = useRef(false)
  useEffect(() => {
    if (!headless || didAutoDl.current || rendering || renderErr || !full || !dstRef.current) return
    didAutoDl.current = true
    const t = setTimeout(() => { linkOnly ? layLink().then((ok) => (ok ? onClose() : (onFail ?? onClose)())) : printWithFilename(printFileName()) }, 350)
    return () => clearTimeout(t)
  }, [headless, rendering, renderErr, full, lopTen]) // eslint-disable-line
  useEffect(() => {
    if (!headless || linkOnly) return
    const onAfter = () => onClose()
    window.addEventListener('afterprint', onAfter)
    return () => window.removeEventListener('afterprint', onAfter)
  }, [headless, linkOnly]) // eslint-disable-line

  if (headless) return createPortal(
    <>
      {/* Trang dựng để chụp: on-screen top-left (html2canvas chụp ổn định hơn ngoài -99999px), NHƯNG nằm SAU lớp phủ đục. */}
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 88, width: '210mm', background: '#fff' }}><div ref={dstRef} className="pv-pages" /></div>
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <Doc full={full} gv={gv} scope={scope} lt={lt} perHS={perHS} roster={roster} ngayNop={ngayNop} lopTen={lopTen ?? ''} />}</div>
      {/* no-print: lớp phủ "đang xử lý" CHỈ hiện trên màn hình, KHÔNG bao giờ lọt vào bản in/PDF thật (dù
          window.print() có được gọi ngay khi lớp phủ còn đang hiện, @media print tự ẩn nó). */}
      <div className="no-print fixed inset-0 z-[95] flex items-center justify-center bg-white">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-700 shadow-xl">
          {renderErr ? <span className="text-rose-600">{renderErr}</span> : linkOnly ? <>⏳ Đang lấy link…</> : <>⏳ Đang chuẩn bị in{pages ? ` (${pages} trang)` : ''}…</>}
          {renderErr && <button onClick={onClose} className="ml-3 rounded border border-slate-300 px-2.5 py-1 text-xs text-slate-600">Đóng</button>}
        </div>
      </div>
      <style>{CHROME_CSS}</style>
    </>,
    document.body,
  )

  return createPortal(
    <div className="pv-overlay fixed inset-0 z-[80] flex flex-col bg-slate-300/90">
      <div className="no-print flex items-center gap-3 border-b border-slate-300 bg-white px-5 py-2.5 shadow-sm">
        <span className="text-sm font-semibold text-slate-800">{onlyBuoiId ? 'Xem thử buổi' : 'Xem thử & xuất giáo trình'}</span>
        {onlyBuoiId && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[12px] font-medium text-indigo-700" title="Chỉ xem buổi này — nút '🖨 Xem / Xuất PDF' ở thanh trên xem cả giáo trình">🗓️ {buoiTitle || 'Buổi'}</span>}
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => setGv(false)} className={seg(!gv)}>Bản học sinh</button>
          <button onClick={() => setGv(true)} className={seg(gv)}>Bản giáo viên</button>
        </div>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5" title="Tách quyển: in giáo trình và BTVN thành 2 file PDF riêng">
          <button onClick={() => setScope('all')} className={seg(scope === 'all')}>Toàn bộ</button>
          <button onClick={() => setScope('giaotrinh')} className={seg(scope === 'giaotrinh')}>Chỉ giáo trình</button>
          <button onClick={() => setScope('btvn')} className={seg(scope === 'btvn')}>Chỉ BTVN</button>
        </div>
        {scope === 'btvn' && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5" title={roster.length ? `${roster.length} HS có mặt — in mỗi HS 1 phiếu, tên sẵn` : 'Chưa điểm danh có mặt → chỉ in bản trống'}>
            <button onClick={() => setPerHS(false)} className={seg(!perHS)}>Bản trống</button>
            <button onClick={() => setPerHS(true)} disabled={!roster.length} className={`${seg(perHS)} disabled:opacity-40`}>🖨 Cả lớp{roster.length ? ` (${roster.length})` : ''}</button>
          </div>
        )}
        {scope !== 'btvn' && !lt && <span className="rounded bg-amber-50 px-2 py-0.5 text-[12px] font-medium text-amber-700" title="Đổi ở Builder → Trình bày → Lý thuyết">Không kèm lý thuyết</span>}
        <span className="text-[12px] text-slate-400">{rendering ? 'đang dựng trang…' : `${pages} trang`}</span>
        <div className="ml-auto flex gap-2">
          {/* Nút "⬇ Tải PDF" cũ đã BỎ (Thùy 07-11: html2canvas tự vẽ lại hay lệch — dùng NATIVE print
              luôn, đúng engine trình duyệt). "🖨 In" chọn "Lưu thành PDF"/"Microsoft Print to PDF" trong
              hộp thoại là ra file PDF y hệt bản đẹp Thùy đã xác nhận. */}
          <button onClick={() => printWithFilename(printFileName())} disabled={rendering} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 In / Xuất PDF</button>
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
      <div ref={srcRef} className="pv-src" aria-hidden>{full && <Doc full={full} gv={gv} scope={scope} lt={lt} onlyBuoiId={onlyBuoiId} perHS={perHS} roster={roster} ngayNop={ngayNop} lopTen={lopTen ?? ''} />}</div>
      <style>{CHROME_CSS}</style>
    </div>,
    document.body,
  )
}

// ontaps = khối "Ôn tập" cuối phiếu BTVN (spec-btvn-ontap.md §7.1) — dạng ôn từ buổi trước, render SAU
// toàn bộ btvns, số câu đếm tiếp (KHÔNG reset), header riêng "PHẦN ÔN TẬP".
type Buoi = { id: string; title: string; dangs: PhanResolved[]; btvns: PhanResolved[]; ontaps: PhanResolved[] }
function buildBuois(phans: PhanResolved[]): Buoi[] {
  const out: Buoi[] = []
  let cur: Buoi | null = null
  const ensure = () => { if (!cur) { cur = { id: 'implicit', title: '', dangs: [], btvns: [], ontaps: [] }; out.push(cur) } return cur }
  for (const p of phans) {
    if (p.loai_phan === 'buoi') { cur = { id: p.id, title: p.tieu_de || 'Buổi', dangs: [], btvns: [], ontaps: [] }; out.push(cur) }
    else if (p.loai_phan === 'dang') ensure().dangs.push(p)
    else if (p.loai_phan === 'btvn') ensure().btvns.push(p)
    else if (p.loai_phan === 'ontap') ensure().ontaps.push(p)
  }
  return out
}

function Doc({ full, gv, scope, lt = true, onlyBuoiId, perHS = false, roster = [], ngayNop = '', lopTen = '' }: {
  full: TaiLieuFull; gv: boolean; scope: 'all' | 'giaotrinh' | 'btvn'; lt?: boolean; onlyBuoiId?: string
  perHS?: boolean; roster?: { id: string; ho_ten: string }[]; ngayNop?: string; lopTen?: string
}) {
  const { taiLieu, phans, ltChuyenDe, tenChuyenDe } = full
  const ch = taiLieu.cau_hinh ?? {}
  const accent = ch.mau || '#E91E8C'
  const linesByCau = ch.btvnLinesByCau ?? {}
  const colByCau = ch.colByCau ?? {}
  const ngayRaw = (taiLieu as { ngay?: string | null }).ngay ?? ''
  const ngayPhat = ngayRaw ? ngayRaw.split('-').reverse().join('/') : ''
  let buois = buildBuois(phans)
  if (onlyBuoiId) buois = buois.filter((b) => b.id === onlyBuoiId)
  // ⭐ 07-24 (Thùy chốt): BỎ đánh số dạng chạy 1,2,3… toàn giáo trình — số đó nhảy mỗi lần thêm/bớt/đổi
  // thứ tự dạng nên "Dạng 5" của bản in hôm nay ≠ hôm qua ≠ trong builder → đối chiếu là loạn. Tiêu đề
  // dạng giờ mang MÃ DẠNG của bản đồ kiến thức (bất biến, trỏ thẳng về đúng KP) — xem DangBlock/BtvnSheet.
  return (
    // .pv-rh/.pv-rf = running elements → paged.js đặt vào margin box (header/footer) MỌI trang.
    <div className={`pv-doc${scope === 'btvn' ? ' pv-doc-btvn' : ''}`} style={{ '--pv-accent': accent } as CSSProperties}>
      {ch.header !== 'none' && <div className="pv-rh">{taiLieu.ten} · Khối {taiLieu.khoi}</div>}
      {ch.footer !== 'none' && <div className="pv-rf">BK ACADEMY · {taiLieu.ten} · Khối {taiLieu.khoi}</div>}
      {/* BỎ BÌA khi: quyển BTVN (mỗi phiếu có header riêng) HOẶC giáo trình buổi trích xuất
          (tên buổi đã hiện 1 lần ở dải buổi; lớp/ngày ở header) HOẶC xem-nhanh-1-buổi (bìa cả giáo
          trình thừa khi chỉ soi 1 buổi) → tránh lặp tiêu đề. */}
      {!onlyBuoiId && scope !== 'btvn' && taiLieu.loai !== 'giao_trinh_buoi' && (
        <div className="pv-cover">
          {/* Logo nằm ở header (lặp mọi trang) → KHÔNG đặt thêm logo ở bìa để tránh trùng. */}
          <div className="pv-title">{taiLieu.ten}</div>
          <div className="pv-sub">KHỐI {taiLieu.khoi} · {scope === 'giaotrinh' ? (lt ? 'LÝ THUYẾT + LUYỆN · ' : 'LUYỆN TẬP · ') : ''}{gv ? 'BẢN GIÁO VIÊN' : 'BẢN HỌC SINH'}</div>
        </div>
      )}
      {/* QUYỂN BTVN riêng = chỉ các phiếu BTVN (mỗi buổi). Còn lại = giáo trình (skip BTVN nếu 'giaotrinh'). */}
      {scope === 'btvn'
        ? (() => {
          const btvnBuois = buois.filter((b) => b.btvns.some((x) => x.caus.length) || b.ontaps.some((x) => x.caus.length))
          const sheet = (b: Buoi, hoTen: string | undefined, key: string) => (
            <BtvnSheet key={key} btvns={b.btvns} ontaps={b.ontaps} gv={gv} docTitle={taiLieu.ten} buoiTitle={b.title} linesByCau={linesByCau} colByCau={colByCau}
              hoTen={hoTen} ngayPhat={ngayPhat} ngayNop={ngayNop} lopTen={lopTen} />
          )
          // In cả lớp: mỗi HS có mặt 1 phiếu (tên in sẵn). Bọc mỗi HS trong .pv-hs-recto → break-before:right
          // ép HS bắt đầu ở mặt TRƯỚC (trang lẻ) → in 2 mặt mỗi HS luôn CHẴN trang, thiếu thì paged.js tự
          // chèn trang trắng (HS lẻ trang không dính sang HS sau). Không perHS → 1 phiếu trống mỗi buổi như cũ.
          return (perHS && roster.length)
            ? roster.map((hs) => <div key={hs.id} className="pv-hs-recto">{btvnBuois.map((b) => sheet(b, hs.ho_ten, hs.id + b.id))}</div>)
            : btvnBuois.map((b) => sheet(b, undefined, b.id))
        })()
        : buois.map((b) => (
          <BuoiBlock key={b.id} buoi={b} gv={gv} scope={scope} lt={lt} docTitle={taiLieu.ten} ltCd={ltChuyenDe} tenCd={tenChuyenDe} linesByCau={linesByCau} colByCau={colByCau} lopTen={lopTen} ngayPhat={ngayPhat} />
        ))}
    </div>
  )
}

// Tách "Buổi N" khỏi tên chủ đề để dựng hero BK: eyebrow "Buổi N" + huy hiệu số N + tiêu đề = chủ đề.
// Không khớp mẫu "Buổi N" (tên tự do) → không eyebrow/huy hiệu, tiêu đề = cả tên.
function parseBuoiTitle(title: string): { eyebrow: string; num: string; heading: string } {
  const m = title.match(/^\s*Bu[ổôổ]i\s*0*(\d+)\s*[:：.\-–—]?\s*(.*)$/iu)
  if (!m) return { eyebrow: '', num: '', heading: title }
  const rest = (m[2] ?? '').trim()
  return rest
    ? { eyebrow: `Buổi ${m[1]}`, num: m[1], heading: rest }   // có chủ đề → tách
    : { eyebrow: '', num: m[1], heading: `Buổi ${m[1]}` }     // chỉ "Buổi N" → tiêu đề = "Buổi N"
}

// 1 BUỔI: hero BK (Buổi N · chủ đề · lớp/ngày · huy hiệu) → [LT chuyên đề + card từng dạng] → phiếu BTVN.
function BuoiBlock({ buoi, gv, scope, lt = true, docTitle, ltCd, tenCd, linesByCau, colByCau, lopTen = '', ngayPhat = '' }: {
  buoi: Buoi; gv: boolean; scope: 'all' | 'giaotrinh'; lt?: boolean; docTitle: string; ltCd: Record<string, { noi_dung: string; file_url: string | null; ten_file: string | null } | null>; tenCd: Record<string, string>; linesByCau: Record<string, number>; colByCau: Record<string, number>; lopTen?: string; ngayPhat?: string
}) {
  // Gom dạng liền nhau theo chuyên đề → mỗi nhóm hiện LT chuyên đề 1 lần (buổi tách chuyên đề vẫn có LT).
  const groups: { cd: string; dangs: PhanResolved[] }[] = []
  for (const d of buoi.dangs) {
    const cd = d.dang?.ma_chuyen_de ?? ''
    const last = groups[groups.length - 1]
    if (last && last.cd === cd) last.dangs.push(d); else groups.push({ cd, dangs: [d] })
  }
  const { num, heading } = parseBuoiTitle(buoi.title || '')
  const sub = [lopTen && `Lớp ${lopTen}`, ngayPhat && `Ngày ${ngayPhat}`].filter(Boolean).join('  ·  ')
  const logoUrl = location.origin + '/Logo.png' // logo THẬT của trung tâm (không dùng ô vuông placeholder mockup)
  const btvnHere = scope === 'all' && (buoi.btvns.some((b) => b.caus.length) || buoi.ontaps.some((b) => b.caus.length))
  // ⭐ 08-19 (Thùy báo "BTVN 4A1 trống trang 1"): doc BTVN THUẦN (không title, không dạng — buildBuois
  // dựng buổi 'implicit') thì `.pv-buoi` bọc ngoài KHÔNG thêm gì (không masthead, groups rỗng) — chỉ còn
  // 1 tầng lồng THỪA quanh BtvnSheet (chính nó đã có `.pv-btvn{break-before:page}` lo phân trang rồi).
  // Y HỆT lớp bug "Fragment thay div/section thừa" đã dính ở groups.map dưới (xem comment): tầng lồng thừa
  // làm paged.js dựng dở — vẽ xong masthead của BtvnSheet rồi bỏ TRẮNG hết phần trang còn lại, card đầu
  // nhảy hẳn sang trang sau dù còn thừa chỗ. Bỏ `.pv-buoi` khi thuần BTVN → BtvnSheet tự lo phân trang, hết 1 tầng.
  if (!buoi.title && groups.length === 0) return btvnHere ? <BtvnSheet btvns={buoi.btvns} ontaps={buoi.ontaps} gv={gv} docTitle={docTitle} buoiTitle={buoi.title} linesByCau={linesByCau} colByCau={colByCau} /> : null
  return (
    <section className="pv-buoi gtbk">
      {buoi.title && (
        // Masthead cao cấp: khung gradient bo góc · logo thật · pill Buổi/Bài luyện · tiêu đề chủ đề ·
        // dòng phụ = Lớp · Ngày · huy hiệu tròn "BUỔI N" bên phải. (Redesign v2 08-08 — mockup BK Buổi10 v2.)
        <div className={`gtbk-mh${num ? '' : ' gtbk-mh-nobadge'}`}>
          <div className="gtbk-mh-grid" />
          <div className="gtbk-mh-main">
            <div className="gtbk-mh-brand"><img className="gtbk-mh-logo" src={logoUrl} alt="BK Academy" /></div>
            <div className="gtbk-mh-kicker">
              {num && <span className="gtbk-mh-pill">Buổi {num}</span>}
              <span className="gtbk-mh-tag">Bài luyện</span>
            </div>
            <h1 className="gtbk-mh-title">{heading}</h1>
            {sub && <div className="gtbk-mh-sub">{sub}</div>}
          </div>
          {num && <div className="gtbk-mh-badge"><small>Buổi</small><strong>{num}</strong></div>}
        </div>
      )}
      {/* ⭐ Fragment, KHÔNG PHẢI <div> — đây là GỐC bug "chèn trang trắng + lặp nội dung" (Thùy báo GT 8S1
          14/08, verify bằng render thật): <div> bọc nhóm tạo thêm 1 lớp BOX LỒNG chứa TOÀN BỘ card của nhóm.
          paged.js xé được từng card, nhưng xé lớp box bọc-tất-cả này thì hỏng: nó dựng DỞ card đầu ở trang 1,
          để TRẮNG HẲN trang 2, rồi dựng LẠI TỪ ĐẦU card đó ở trang 3 (mất/lặp nội dung thật, không chỉ xấu).
          Bỏ lớp box đó đi (Fragment không sinh thẻ DOM) → nội dung chảy đúng như mong đợi: hết trang 1 thì
          sang trang 2, không trang trắng, không lặp. Đã tự tay loại trừ mọi nghi phạm CSS khác: overflow:hidden,
          min-height, pseudo trang trí, break-inside/after ở masthead + card-head + box-label, nền/viền của
          .pv-box-lt, chờ document.fonts.ready — bỏ từng cái đều KHÔNG hết bug; bỏ <div> này thì hết ngay.
          ⚠ ĐỪNG đổi ngược về <div> để "gom nhóm cho gọn" — bug quay lại y hệt. */}
      {groups.map((g, gi) => (
        <Fragment key={gi}>
          {/* 1 chuyên đề: chỉ "Lý thuyết" (tên chuyên đề ĐÃ ở dải buổi → khỏi lặp). Nhiều chuyên đề: ghi tên để phân biệt.
              Ẩn cả khối chuyên đề nếu MỌI dạng trong nhóm đều tắt hien_lt (vd buổi chỉ ôn dạng cũ). */}
          {lt && g.dangs.some((d) => d.hien_lt !== false) && <LtBlock title={groups.length > 1 ? `Lý thuyết chuyên đề: ${tenCd[g.cd] ?? ''}` : 'Lý thuyết'} lt={ltCd[g.cd]} big />}
          {g.dangs.map((d) => <DangBlock key={d.id} p={d} gv={gv} lt={lt} colByCau={colByCau} />)}
        </Fragment>
      ))}
      {btvnHere && (
        <BtvnSheet btvns={buoi.btvns} ontaps={buoi.ontaps} gv={gv} docTitle={docTitle} buoiTitle={buoi.title} linesByCau={linesByCau} colByCau={colByCau} />
      )}
    </section>
  )
}

// Render nội dung lý thuyết thành các KHỐI (tách bởi dòng trống) — mỗi khối không bị xé ngang trang.
// ⭐ Khối DÀI còn được chẻ tiếp theo TỪNG DÒNG. Lý do KHÔNG phải thẩm mỹ mà là né bug paged.js: ngắt trang
// GIỮA hai .pv-blk (anh em ruột) thì chạy đúng, nhưng ngắt TRONG lòng 1 .pv-blk (sâu 2 tầng, giữa các
// .mline) thì paged.js bỏ phí nốt phần trang còn lại — dạng kế tiếp nhảy hẳn trang mới (Thùy báo 8S1).
// Vậy nên: cấm xé trong khối (.pv-blk break-inside:avoid) + chẻ khối dài thành nhiều khối NGẮN để vẫn có
// đủ chỗ ngắt hợp lệ → trang vừa đầy vừa không phí. Khối ngắn (≤ LT_BLK_MAX dòng) giữ nguyên để 1 Ví dụ
// ngắn không bị xé rời khỏi nhãn của nó. Dòng đầu khối dài dính dòng sau nhờ .pv-blk-keep (break-after:avoid).
const LT_BLK_MAX = 3
function LyThuyetBody({ text }: { text: string }) {
  const blocks = text.split(/\n[ \t]*\n/).map((b) => b.trim()).filter(Boolean)
  if (blocks.length <= 1 && blocks[0] && blocks[0].split('\n').length <= LT_BLK_MAX) {
    return <div className="pv-math"><MathText>{text}</MathText></div>
  }
  const out: { html: string; keep: boolean }[] = []
  for (const b of blocks) {
    const lines = b.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length <= LT_BLK_MAX) { out.push({ html: b, keep: false }); continue }
    // chẻ theo dòng; dòng ĐẦU của khối giữ dính dòng kế (nhãn "Ví dụ N." không mồ côi cuối trang)
    lines.forEach((l, i) => out.push({ html: l, keep: i === 0 }))
  }
  return <>{out.map((o, i) => <div key={i} className={`pv-blk pv-math${o.keep ? ' pv-blk-keep' : ''}`}><MathText>{o.html}</MathText></div>)}</>
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

// Danh sách câu NHIỀU CỘT kiểu GHÉP HÀNG (inline-block) — dùng cho BÀI TẬP / ĐỀ THI (câu không có dòng kẻ
// viết tay, chỉ cần xếp 2-4 cột cho gọn). BTVN/ET/MT dùng CauFlow/CauColumns (tách đề/dòng-kẻ, căn lưới).
// Nhiều cột = ghép câu theo HÀNG (KHÔNG column-count/grid/table — paged.js treo, xem DEVLOG 07-05).
export function CauList({ kieu, children }: { kieu?: string; children: React.ReactNode }) {
  const cols = kieuCols(kieu)
  if (cols <= 1) return <div className="pv-caulist">{children}</div>
  const items = Children.toArray(children)
  const rows: React.ReactNode[][] = []
  for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols))
  return (
    <div className="pv-caulist">
      {rows.map((row, i) => <div key={i} className="pv-row" style={{ '--cols': cols } as CSSProperties}>{row}</div>)}
    </div>
  )
}

// 1 DẠNG = 1 card BK: đầu card (mã dạng · tên dạng · pill "Bài luyện") → thân (LT·ví dụ nếu có → câu).
// Card KHÔNG break-inside:avoid (dạng dài hơn 1 trang vẫn phải chảy, không thì paged.js cắt mất nội dung);
// chỉ giữ đầu card không mồ côi (break-after:avoid trong CSS).
function DangBlock({ p, gv, lt = true, colByCau }: { p: PhanResolved; gv: boolean; lt?: boolean; colByCau: Record<string, number> }) {
  return (
    <section className="pv-sec gtbk-card">
      <div className="gtbk-card-head">
        <span className="gtbk-code">{p.ref_ma}</span>
        <div className="gtbk-card-title">{p.dang?.ten_dang ?? p.ref_ma}</div>
        <span className="gtbk-pill">Bài luyện</span>
      </div>
      <div className="gtbk-card-body">
        {lt && p.hien_lt !== false && p.lyThuyetDang?.noi_dung?.trim() && (
          <div className="pv-box-lt"><div className="pv-box-label">Lý thuyết · Ví dụ</div><LyThuyetBody text={p.lyThuyetDang.noi_dung} /></div>
        )}
        {p.caus.length > 0 && (
          <CauFlow items={p.caus.map((c, i) => ({ key: c.ma_cau, cols: colByCau[c.ma_cau] ?? 1, ...cauItemParts({ no: i + 1, c, gv }) }))} />
        )}
      </div>
    </section>
  )
}

// BTVN của 1 BUỔI = phiếu RIÊNG (sang trang mới), nhóm theo DẠNG (mirror trên lớp). HS viết thẳng vào dòng kẻ.
// Đầu phiếu: tiêu đề = tên tài liệu · trái = Họ tên + Lớp · phải = ô Điểm. Bản GV = đáp án (bỏ ô điền, hiện lời giải).
function BtvnSheet({ btvns, ontaps = [], gv, docTitle, buoiTitle, linesByCau, colByCau, hoTen, ngayPhat = '', ngayNop = '', lopTen = '' }: {
  btvns: PhanResolved[]; ontaps?: PhanResolved[]; gv: boolean; docTitle: string; buoiTitle: string; linesByCau: Record<string, number>; colByCau: Record<string, number>
  hoTen?: string; ngayPhat?: string; ngayNop?: string; lopTen?: string
}) {
  // LUÔN đầu phiếu BK (Thùy: bỏ HẲN header/footer cũ, không tái dùng). Tiêu đề = tên buổi (hoặc tên doc).
  return (
    <section className="pv-sec pv-btvn">
      <BtvnBkHead buoiTitle={buoiTitle || docTitle} ngayPhat={ngayPhat} ngayNop={ngayNop} lopTen={lopTen} hoTen={hoTen} gv={gv} />
      {(() => {
        let bno = 0
        // Mỗi dạng = 1 card kiểu giáo trình (mã dạng · tên dạng · pill "BTVN"); câu có dòng kẻ để HS viết.
        const dangBlock = (b: PhanResolved) => (
          <div key={b.id} className="pv-sec gtbk-card">
            <div className="gtbk-card-head">
              <span className="gtbk-code">{b.ref_ma}</span>
              <div className="gtbk-card-title">{b.dang?.ten_dang ?? b.ref_ma}</div>
              <span className="gtbk-pill">BTVN</span>
            </div>
            {/* Số câu đếm LIÊN TỤC xuyên các dạng (dạng 1: 1,2 → dạng 2: 3,4,5…) — KHÔNG reset mỗi dạng,
                kể cả sang khối Ôn tập bên dưới (đếm 1 mạch hết phiếu, đúng spec §7.1). */}
            <div className="gtbk-card-body">
              <CauFlow items={b.caus.map((c) => { bno += 1; return { key: c.ma_cau, cols: colByCau[c.ma_cau] ?? 1, ...cauItemParts({ no: bno, c, gv, lines: gv ? 0 : (linesByCau[c.ma_cau] ?? DEFAULT_BTVN_LINES) }) } })} />
            </div>
          </div>
        )
        const btvnBlocks = btvns.filter((b) => b.caus.length).map(dangBlock)
        const ontapList = ontaps.filter((b) => b.caus.length)
        return <>
          {btvnBlocks}
          {ontapList.length > 0 && (
            <div className="pv-sec pv-ontap">
              <h2 className="pv-h-ontap">PHẦN ÔN TẬP</h2>
              {ontapList.map(dangBlock)}
            </div>
          )}
        </>
      })()}
    </section>
  )
}

// Ước lượng "độ rộng nhìn thấy" của 1 phương án (phân số tính theo chữ số dài nhất, lệnh latex = 1).
function optVisLen(s: string): number {
  return s.replace(/\$/g, '')
    .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, (_m, a: string, b: string) => '0'.repeat(Math.max(a.length, b.length)))
    .replace(/\\[a-zA-Z]+/g, 'x').replace(/[{}^_\\]/g, '').length
}
// Ngắn → 4 cột (1 dòng) · vừa → 2 cột (2×2) · dài → 1 cột (mỗi ý 1 dòng). Ngưỡng 14/30 (Thùy chốt).
function optCols(opts: string[]): number {
  const max = Math.max(0, ...opts.map(optVisLen))
  return max <= 14 ? 4 : max <= 30 ? 2 : 1
}
// Tách nhãn a)b)c)… (ý con) HOẶC A)B)C)D. (đáp án nhúng trong đề — câu lua_chon=null) → cho lên lưới cột.
// Yêu cầu ≥2 nhãn LIÊN TỤC theo `seq` (chống bắt nhầm "a)"/"A." lẻ trong văn). Trả null nếu không phải.
function splitLabeled(s: string, seq: string): { stem: string; parts: { lbl: string; body: string }[] } | null {
  const cls = seq[0] === 'A' ? 'A-Z' : 'a-l' // uppercase (đáp án) vs lowercase (ý con)
  const re = new RegExp(`(?:^|\\n)[ \\t]*([${cls}])[ \\t]*[).][ \\t]+`, 'g')
  const marks: { idx: number; lbl: string; start: number }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) marks.push({ idx: m.index, lbl: m[1], start: re.lastIndex })
  if (marks.length < 2) return null
  for (let i = 0; i < marks.length; i++) if (marks[i].lbl !== seq[i]) return null
  const stem = s.slice(0, marks[0].idx).trim()
  const parts = marks.map((mk, i) => ({ lbl: mk.lbl, body: s.slice(mk.start, i + 1 < marks.length ? marks[i + 1].idx : undefined).trim() }))
  return { stem, parts }
}
// Công thức trải NHIỀU dòng: $…$ / $$…$$ có \n bên trong (vd \begin{cases}…\\…\end{cases}) = KHỐI toán liền.
const MATH_SPAN = /\$\$[\s\S]+?\$\$|\$[^$]+?\$/g
// KHÔNG nhãn: đề (dòng đầu) + ≥3 ý NGẮN song song, mỗi ý 1 dòng → cho lên lưới cột (như trắc nghiệm).
// Chỉ kích hoạt khi MỌI dòng ý đều ngắn (≤30) → không phá đề nhiều dòng/lời văn dài. Ngưỡng cột dùng optCols.
function splitUnlabeled(s: string): { stem: string; parts: { lbl: string; body: string }[] } | null {
  if ((s.match(MATH_SPAN) ?? []).some((seg) => seg.includes('\n'))) return null // ĐỪNG xé khối toán nhiều dòng (cases…)
  const lines = s.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length < 4) return null // đề + ≥3 ý
  const [stem, ...rest] = lines
  if (rest.some((l) => optVisLen(l) > 30)) return null
  return { stem, parts: rest.map((body) => ({ lbl: '', body })) }
}
// Tách đề + lưới ý con — DÙNG CHUNG (PrintView giáo trình + ET). Ưu tiên: đáp án A/B/C/D nhúng → ý con a/b/c → ý con KHÔNG nhãn (đã strip).
export function splitStem(c: CauHoi): { stem: string; grid: { lbl: string; body: string }[] | null; emb: boolean } {
  // "[hình]" là quy ước NHẬP LIỆU (kho/api.ts: nhân sự cắt ảnh đính sau vào anh_de) — không phải nội dung
  // đề thật. Đã có anh_de (ảnh đã đính) mà chuỗi thô vẫn còn placeholder → strip lúc IN, đừng để lộ literal
  // "[hình]" ra giấy (Thùy báo ảnh chụp MT câu 7). KHÔNG sửa DB — chỉ ẩn lúc render.
  const noiDung = c.anh_de ? c.noi_dung.replace(/\[\s*hình\s*\]/gi, '').replace(/\s+/g, ' ').trim() : c.noi_dung
  const hasOpts = !!(c.lua_chon && c.lua_chon.length)
  const emb = hasOpts ? null : splitLabeled(noiDung, 'ABCDEFGH')
  const yc = hasOpts || emb ? null : splitLabeled(noiDung, 'abcdefghijkl')
  const un = hasOpts || emb || yc ? null : splitUnlabeled(noiDung)
  return { stem: emb?.stem ?? yc?.stem ?? un?.stem ?? noiDung, grid: emb?.parts ?? yc?.parts ?? un?.parts ?? null, emb: !!emb }
}
// Lưới ý con (đáp án nhúng / ý con có/không nhãn). Không nhãn → chỉ hiện nội dung, không dấu ).
export function OptGrid({ grid, emb }: { grid: { lbl: string; body: string }[]; emb: boolean }) {
  return (
    <div className="pv-opts" style={{ gridTemplateColumns: `repeat(${optCols(grid.map((p) => p.body))}, minmax(0,1fr))` }}>
      {grid.map((p, i) => <div key={i} className="pv-opt">{p.lbl ? <><b>{p.lbl}{emb ? '.' : ')'}</b> </> : null}<span className="pv-math"><MathText>{p.body}</MathText></span></div>)}
    </div>
  )
}
// Bản GV: khối đáp án CHI TIẾT cho MỌI loại câu (trắc nghiệm / đúng-sai / trả lời ngắn / tự luận).
//  · trắc nghiệm: nêu rõ chữ cái đáp án (kèm ✓ ở lưới) · đúng/sai: gom lời giải từng mệnh đề (Đ/S đã hiện ở danh sách)
//  · trả lời ngắn / tự luận: đáp án + lời giải. Luôn kèm ảnh đáp án nếu có.
export function GvAnswer({ c }: { c: CauHoi }) {
  const md = c.menh_de && c.menh_de.length ? c.menh_de : null
  const mdGiai = md ? md.filter((m) => m.loi_giai?.trim()) : []
  const hasContent = (!md && (c.dap_an || c.loi_giai)) || (md && (mdGiai.length || c.loi_giai)) || c.anh_dap_an
  if (!hasContent) return null
  return (
    <div className="pv-loigiai">
      {c.dap_an && !md && <div><b>Đáp án:</b> <MathText>{c.dap_an}</MathText></div>}
      {md && mdGiai.length > 0 && md.map((m, i) => m.loi_giai?.trim()
        ? <div key={i}><b>{String.fromCharCode(97 + i)})</b> <MathText>{m.loi_giai}</MathText></div> : null)}
      {c.loi_giai && <div><b>Lời giải:</b> <MathText>{c.loi_giai}</MathText></div>}
      {c.anh_dap_an && <img src={c.anh_dap_an} alt="" className="pv-img" />}
    </div>
  )
}
// Khối dòng-kẻ-để-viết — GỘP TỪNG CẶP (lẻ dư nằm ở ĐẦU, không phải cuối) + mỗi cặp break-inside:avoid.
// BTVN cho câu tách ngang trang để đỡ tốn giấy (`.pv-btvn .pv-cau{break-inside:auto}`) — nhưng KHÔNG
// được để 1 dòng kẻ mồ côi tách khỏi cặp của nó, rơi sang đầu trang sau dính sát câu kế tiếp (Thùy báo
// ảnh 07-11). Gộp cặp từ ĐẦU → phần CUỐI (dễ bị đẩy sang trang mới nhất khi tràn) luôn còn nguyên cặp.
// Xem DEVLOG 07-11 — ĐỪNG đổi `.pv-write` thành break-inside:avoid nguyên khối (đã thử, gây nhảy cả
// khối 5 dòng sang trang mới → bỏ trống cuối trang, đúng lỗi mà break-inside:auto sinh ra để tránh).
export function WriteLines({ n }: { n: number }) {
  if (n <= 0) return null
  const groups: number[] = []
  let i = n % 2 === 1 ? 1 : 0
  if (i) groups.push(1)
  for (; i < n; i += 2) groups.push(2)
  return (
    <div className="pv-write">
      {groups.map((cnt, gi) => (
        <div key={gi} className="pv-wpair">{Array.from({ length: cnt }).map((_, j) => <div key={j} className="pv-wline" />)}</div>
      ))}
    </div>
  )
}
// TÁCH 1 câu thành `content` (đề + hình + ý con + phương án/mệnh đề/lời giải GV — mọi thứ TRỪ dòng kẻ) và
// `lines` (SỐ dòng kẻ viết tay, 0 nếu không có). Dòng kẻ tách riêng để CauColumns rải THÀNH TỪNG HÀNG lưới
// (ngắt được giữa các dòng → lấp đáy trang), còn content thì giữ nguyên khối.
export type CauPart = { key: string; content: React.ReactNode; lines: number; hasImg: boolean }
export function cauItemParts({ no, c, gv, lines = 0 }: { no: number; c: CauHoi; gv: boolean; lines?: number }): { content: React.ReactNode; lines: number; hasImg: boolean } {
  const md = c.menh_de && c.menh_de.length ? c.menh_de : null // câu Đúng/Sai: 4 mệnh đề, mỗi cái Đ/S riêng
  const hasOpts = !!(c.lua_chon && c.lua_chon.length)
  const letter = (i: number) => String.fromCharCode(65 + i)
  const cols = hasOpts ? optCols(c.lua_chon!) : 0
  const { stem, grid, emb } = splitStem(c)
  return {
    content: (<>
      {/* THỨ TỰ: đề → HÌNH → ý con → phương án/Đ-S → lời giải GV (Thùy chốt) */}
      <div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Câu ${no}.</span> `}>{md ? c.noi_dung : stem}</MathText></div>
      {c.anh_de && <img src={c.anh_de} alt="" className="pv-img" />}
      {!md && grid && <OptGrid grid={grid} emb={emb} />}
      {md && (
        <ol className="pv-ds">
          {md.map((m, i) => (
            <li key={i} className="pv-ds-item">
              <span className="pv-ds-lbl">{String.fromCharCode(97 + i)})</span>
              <span className="pv-math"><MathText>{m.noi_dung}</MathText></span>
              {gv && <span className={`pv-ds-kq ${m.dap_an === 'D' ? 'pv-correct' : 'pv-wrong'}`}>{m.dap_an === 'D' ? 'Đúng' : 'Sai'}</span>}
            </li>
          ))}
        </ol>
      )}
      {!md && hasOpts && (
        <div className="pv-opts" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {c.lua_chon!.map((o, i) => {
            const correct = gv && (c.dap_an ?? '').trim().toUpperCase() === letter(i)
            return <div key={i} className={`pv-opt ${correct ? 'pv-correct' : ''}`}><b>{letter(i)}.</b> <span className="pv-math"><MathText>{o}</MathText></span>{correct ? ' ✓' : ''}</div>
          })}
        </div>
      )}
      {gv && <GvAnswer c={c} />}
    </>),
    lines: (lines > 0 && !hasOpts && !grid && !md && !gv) ? lines : 0,
    hasImg: !!c.anh_de,
  }
}
export function CauItem(props: { no: number; c: CauHoi; gv: boolean; lines?: number }) {
  const { content, lines } = cauItemParts(props)
  return <div className="pv-cau">{content}{lines > 0 && <WriteLines n={lines} />}</div>
}
// Câu hỏi THUẦN (đề + hình + grid nhúng, KHÔNG đáp án/dòng kẻ) — dùng cho ô cột 1 của TLNTable.
export function questionOnlyContent(no: number, c: CauHoi): React.ReactNode {
  const { stem, grid, emb } = splitStem(c)
  return (<>
    <div className="pv-math"><MathText prefix={`<span class="pv-cau-no">Câu ${no}.</span> `}>{stem}</MathText></div>
    {grid && <OptGrid grid={grid} emb={emb} />}
    {c.anh_de && <img src={c.anh_de} alt="" className="pv-img" />}
  </>)
}
// Trả lời ngắn (Thùy: "đưa về dạng bảng — cột 1 đề, cột 2 điền đáp án") — BẢNG 2 cột thay dòng-kẻ-viết-tay.
// DÙNG CHUNG ET + MT (form hiển thị vốn đã "DÙNG CHUNG", xem etFormOf/tailieu.ts — lệch 1 bản là tái diễn
// bug). KHÔNG dùng <table>/CSS grid/column-count (paged.js TREO — xem CauColumns/DEVLOG 07-05) — dựng
// bằng div/flex, mỗi hàng break-inside:avoid (không xé đôi 1 câu) nhưng cả khối vẫn CHẢY được giữa các hàng.
export type TLNRow = { key: string; content: React.ReactNode }
export function TLNTable({ rows }: { rows: TLNRow[] }) {
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
// Layout NHIỀU CỘT theo CẶP: mỗi hàng `cols` câu. Băng ĐỀ (content) = 1 flex-row, các cell tự cao bằng đề CAO
// NHẤT → đề thấp chừa dòng trống → dòng kẻ 2 cột bắt đầu NGANG NHAU. DÒNG KẺ = từng HÀNG lưới riêng (mỗi hàng
// 1 dòng/cột), là block rời nên paged.js NGẮT ĐƯỢC giữa các dòng → chảy lấp đáy trang, KHÔNG nhảy cả câu
// (khác atomic). Lưới --pitch giữ mọi dòng thẳng hàng. cols<=1 → 1 cột như thường.
export function CauColumns({ cols, parts }: { cols: number; parts: CauPart[] }) {
  if (cols <= 1) return <div className="pv-caulist">{parts.map((p) => <div key={p.key} className="pv-cau">{p.content}{p.lines > 0 && <WriteLines n={p.lines} />}</div>)}</div>
  const rows: (CauPart | null)[][] = []
  for (let i = 0; i < parts.length; i += cols) {
    const row: (CauPart | null)[] = parts.slice(i, i + cols)
    while (row.length < cols) row.push(null) // ô trống giữ đúng bề rộng cột ở hàng cuối
    rows.push(row)
  }
  return (
    <div className="pv-caulist pv-cols">
      {rows.map((row, i) => {
        const maxLines = Math.max(0, ...row.map((p) => p?.lines ?? 0))
        return (
          <div key={i} className="pv-pair">
            <div className="pv-band">{row.map((p, k) => <div key={k} className="pv-pcell">{p?.content}</div>)}</div>
            {Array.from({ length: maxLines }, (_, li) => (
              <div key={li} className="pv-lrow">{row.map((p, k) => <div key={k} className="pv-lcell">{p && li < p.lines ? <div className="pv-wline" /> : null}</div>)}</div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
// Xếp câu theo TAG CỘT PER-CÂU (colByCau): gom các câu LIÊN TIẾP cùng số cột (>1) thành 1 nhóm ghép cặp;
// câu cols=1 (hoặc không tag) = full width. Câu cùng tag nhưng CÁCH XA (có câu khác chen giữa) KHÔNG gộp.
// Câu CÓ ẢNH (c.anh_de) LUÔN ép cols=1 (không vào băng ghép cặp) dù được tag cột: .pv-band buộc
// break-inside:avoid nguyên hàng (giữ 2 cột lên dòng kẻ ngang nhau — không đổi được, xem PrintView.tsx:848),
// ảnh cao tới 60mm (.pv-img) làm băng dễ cao hơn khoảng trống còn lại cuối trang → cả băng nhảy sang trang
// sau, bỏ trống trang trước (Thùy báo). Câu có ảnh in full-width, không xé nhóm 2 cột xung quanh nó.
export type CauFlowItem = CauPart & { cols: number }
export function CauFlow({ items }: { items: CauFlowItem[] }) {
  const groups: { cols: number; parts: CauPart[] }[] = []
  for (const it of items) {
    const cols = it.cols > 1 && !it.hasImg ? it.cols : 1
    const last = groups[groups.length - 1]
    if (last && last.cols === cols) last.parts.push(it)
    else groups.push({ cols, parts: [it] })
  }
  return <>{groups.map((g, i) => <CauColumns key={i} cols={g.cols} parts={g.parts} />)}</>
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
.pv-caulist{margin:4px 0 0}
/* NHIỀU CỘT theo CẶP (xem CauColumns): 1 hàng = băng ĐỀ (.pv-band, flex) + N HÀNG DÒNG KẺ (.pv-lrow).
   ⭐ Băng đề break-inside:avoid (giữ khối, cân chiều cao → dòng kẻ 2 cột bắt đầu NGANG NHAU); .pv-pair KHÔNG
   atomic + mỗi .pv-lrow là block rời ⇒ paged.js NGẮT ĐƯỢC giữa các dòng kẻ → dòng kẻ CHẢY LẤP đáy trang,
   không nhảy cả câu (hết bỏ trống trang). ⭐ Lưới --pitch: line-height chữ = --pitch + mỗi dòng kẻ = --pitch
   ⇒ mọi dòng thẳng lưới, đề thấp chừa đúng số dòng nguyên. Dòng kẻ trong từng cột (khe giữa trống → phân
   biệt 2 cột). (Rủi ro đã báo: 1 dòng công thức cao hơn --pitch đội lưới ở dòng đó.) */
.pv-caulist.pv-cols{--pitch:7.5mm;line-height:var(--pitch)}
.pv-caulist.pv-cols .pv-pair{margin:0 0 var(--pitch)}
.pv-caulist.pv-cols .pv-band{display:flex;gap:9mm;align-items:stretch;break-inside:avoid}
.pv-caulist.pv-cols .pv-lrow{display:flex;gap:9mm;break-inside:avoid}
.pv-caulist.pv-cols .pv-pcell,.pv-caulist.pv-cols .pv-lcell{flex:1 1 0;min-width:0}
.pv-caulist.pv-cols .pv-wline{height:var(--pitch);margin:0}
/* CauList (bài tập / đề thi) nhiều cột = ghép HÀNG inline-block: 1 .pv-row = N câu ngang, canh TOP. */
.pv-row{break-inside:avoid;font-size:0}
.pv-row > .pv-cau{display:inline-block;vertical-align:top;font-size:17px;box-sizing:border-box;width:calc((100% - (var(--cols) - 1)*9mm)/var(--cols))}
.pv-row > .pv-cau:not(:first-child){margin-left:9mm}
.pv-cau{margin:12px 0;break-inside:avoid}
.pv-cau-no{font-weight:700;color:var(--pv-accent,#E91E8C);margin-right:5px}
/* Trả lời ngắn dạng BẢNG (TLNTable, xem PrintView.tsx) — cột 1 đề, cột 2 chỗ điền đáp án. Mỗi hàng
   break-inside:avoid (không xé đôi 1 câu) nhưng cả khối vẫn CHẢY được giữa các hàng qua trang. */
.pv-tlnt{margin:4px 0}
.pv-tlnt-row{display:flex;align-items:stretch;border-bottom:1px solid #e2e8f0;break-inside:avoid;min-height:11mm}
.pv-tlnt-row:first-child{border-top:1px solid #e2e8f0}
/* flex-direction:column (KHÔNG phải row mặc định): questionOnlyContent trả về NHIỀU con (đề + <img> nếu
   câu có anh_de, vd câu trắc nghiệm bị ép hiển thị "trả lời ngắn" mà vẫn còn hình minh hoạ). row sẽ xếp
   đề/ảnh CẠNH NHAU → đề bị bóp còn 1 cột chữ hẹp dính từng từ (Thùy báo ảnh chụp, MT câu 7). column xếp
   đề rồi ảnh CHỒNG DỌC như cauItemParts vẫn làm, justify-content:center giữ nguyên ý "canh giữa" ban đầu. */
.pv-tlnt-q{flex:1;min-width:0;padding:7px 10px 7px 0;display:flex;flex-direction:column;justify-content:center}
.pv-tlnt-a{width:42mm;flex-shrink:0;border-left:1px solid #e2e8f0}
.pv-img{display:block;margin:7px auto;max-height:60mm;max-width:100%}
.mt-img{display:block;margin:6px auto;max-height:60mm;max-width:100%;break-inside:avoid}
.pv-opts{display:grid;column-gap:22px;row-gap:11px;margin-top:7px;align-items:start}
.pv-opt{display:flex;align-items:flex-start;gap:5px;line-height:2}
.pv-correct{color:#16a34a;font-weight:700}
.pv-wrong{color:#dc2626;font-weight:700}
/* ĐÚNG/SAI: danh sách 4 mệnh đề a·b·c·d (bản GV có nhãn Đúng/Sai đẩy về phải). */
.pv-ds{list-style:none;margin:5px 0 0;padding:0}
.pv-ds-item{display:flex;align-items:flex-start;gap:6px;line-height:1.9;margin:2px 0;break-inside:avoid}
.pv-ds-lbl{font-weight:700;color:var(--pv-accent,#E91E8C);flex-shrink:0}
.pv-ds-kq{margin-left:auto;white-space:nowrap;padding-left:12px}
.pv-loigiai{margin-top:7px;padding:9px 11px;background:#f6f7f8;border-left:3px solid #cbd2d8;border-radius:5px;font-size:14px}
/* Buổi = tầng 1: mỗi buổi sang trang mới, có dải tiêu đề "Buổi N". */
.pv-buoi{break-before:page}
.pv-buoi:first-of-type{break-before:auto}
.pv-h-buoi{background:var(--pv-accent,#E91E8C);color:#fff;font-size:20px;font-weight:800;padding:7px 14px;border-radius:9px;margin:0 0 8px;letter-spacing:.5px;break-after:avoid}
/* Khối "Ôn tập" cuối phiếu BTVN (spec-btvn-ontap.md §7.1) — dải NHỎ hơn .pv-h-buoi, màu trung tính
   (không dùng --pv-accent) để HS/PH phân biệt ngay "bài mới" (hồng) vs "ôn lại" (xám). */
.pv-h-ontap{display:inline-block;background:#eef0f4;color:#4b5563;font-size:13px;font-weight:800;padding:4px 12px;border-radius:7px;margin:16px 0 8px;letter-spacing:.5px;break-after:avoid}
/* BTVN = phiếu riêng → sang trang mới; mỗi bài có dòng kẻ chấm để HS viết thẳng vào phiếu. */
.pv-btvn{break-before:page}
/* Quyển BTVN riêng (scope btvn, không bìa): phiếu ĐẦU bắt đầu ngay trang 1, không chừa trang trống.
   Chỉ áp trong quyển BTVN (pv-doc-btvn) — KHÔNG đụng BTVN nhúng trong giáo trình (scope all vẫn sang trang). */
.pv-doc-btvn > .pv-btvn:first-of-type{break-before:auto}
/* Trong BTVN, tiêu đề dạng đi liền ngay câu 1 → bỏ gạch chân (không để như "dòng kẻ lạc" giữa Dạng và Câu 1). */
.pv-btvn .pv-h-dang{border-bottom:none;padding-bottom:0;margin-bottom:6px}
/* Dòng kẻ để viết — GỘP CẶP qua .pv-wpair (xem WriteLines, PrintView.tsx) để tránh mồ côi khi tách
   trang, KHÔNG break-inside:avoid nguyên .pv-write (từng gây nhảy cả khối sang trang mới, bỏ trống
   cuối trang — đúng lỗi mà .pv-btvn .pv-cau{break-inside:auto} sinh ra để tránh). Xem DEVLOG 07-11. */
.pv-write{margin-top:7px}
.pv-wpair{break-inside:avoid}
.pv-wline{height:9mm;border-bottom:1px dotted #9aa6b2}
/* BTVN chảy LIÊN TỤC: câu được phép tách ngang trang (nửa trên / nửa dưới) thay vì nhảy cả câu → bỏ trống cuối trang. */
.pv-btvn .pv-cau{break-inside:auto}
.pv-btvn .pv-cau .pv-math:first-child{break-after:avoid}
/* Khối tiêu đề phiếu BTVN: tiêu đề (tên tài liệu) trên cùng · trái = họ tên + lớp · phải = ô điểm. */
.pv-bt-head{border:1.5px solid var(--pv-accent,#E91E8C);border-radius:12px;padding:12px 16px 14px;margin-bottom:16px;break-inside:avoid}
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
/* span.katex-text CHỨ KHÔNG PHẢI .katex-text: MathText trả <span> khi 1 dòng, <div> (chứa các .mline
   BLOCK) khi NHIỀU dòng. Ép display:inline lên CẢ <div> nhiều dòng tạo cảnh "block nằm trong inline" —
   trình duyệt phải đẻ anonymous box, paged.js xé trang ngay chỗ đó thì đo sai → tài liệu phình thêm trang.
   Giới hạn inline cho đúng <span> 1 dòng: GT 8S1 từ 8 trang xuống 7 mà nội dung không đổi. */
.pv-math span.katex-text{display:inline}
.pv-rh,.pv-rf{display:none}
/* Ngắt trang: tiêu đề/nhãn KHÔNG mồ côi cuối trang; mỗi khối lý thuyết không bị xé ngang */
.pv-h-lt,.pv-h-dang,.pv-h-btvn,.pv-h-bt,.pv-box-label{break-after:avoid}
.pv-sec{break-inside:auto}
/* ⭐ break-inside:avoid (KHÔNG phải auto) — mỗi khối lý thuyết (1 Ví dụ, tách nhau bởi dòng trống) giữ
   NGUYÊN VẸN 1 trang. Đây KHÔNG chỉ là thẩm mỹ: nếu để auto, paged.js xé được khối ra giữa trang, mà
   HỄ xé trúng trong hộp lý thuyết (.pv-box-lt) thì phần trang CÒN LẠI bị bỏ phí — dạng kế tiếp KHÔNG chịu
   xuống nằm cùng trang mà nhảy hẳn trang mới (Thùy báo: "dạng 1 mới hết nửa trang 2, dạng 2 nhảy trang").
   Đo thật (GT 8S1): auto → trang 2 chỉ dùng 10%; avoid → trang 2 dùng 95%, dạng 1 và dạng 2 nằm CHUNG trang.
   Đã loại trừ: không phải do nền/viền/bo góc .pv-box-lt (bỏ hết vẫn y hệt), không phải break rule ở
   .gtbk-card-head — là giới hạn của paged.js khi nối tiếp phần bị xé. Đánh đổi: 1 Ví dụ dài quá chỗ trống
   cuối trang sẽ dời NGUYÊN sang trang sau (trang trước hụt ~nửa) — chấp nhận, đổi lấy không phí cả trang. */
.pv-blk{break-inside:avoid;margin:0 0 5px}
/* dòng ĐẦU của khối bị chẻ (nhãn "Ví dụ N.") không được đứng lẻ cuối trang — xem LyThuyetBody */
.pv-blk-keep{break-after:avoid}
.pv-blk:last-child{margin-bottom:0}
.pv-box-lt .mline{break-inside:avoid}
`

// ⭐ REDESIGN giáo trình 08-08 (Thùy — mockup BK_Academy_Buoi10). Kiểu BK cho phần in giáo trình:
//   · hero từng buổi: eyebrow "Buổi N" + tiêu đề chủ đề + dòng lớp/ngày + huy hiệu tròn số buổi;
//   · mỗi DẠNG = 1 card bo góc (đầu: mã dạng nền navy · tên dạng · pill "Bài luyện"; thân: LT·ví dụ + câu);
//   · dải gradient mảnh trên/dưới mọi trang + footer liên hệ + số trang (gtPageCss).
// Bảng màu lấy đúng mockup (KHÔNG theo accent doc): gradient #1997d4→#18a889→#f0a63b→#e83483, navy #13233f.
// Font tiêu đề/card = sans (Noto Sans) tách khỏi phần câu (Times) cho ra chất "sách in".
const GT_SANS = "'Noto Sans','Segoe UI',Arial,sans-serif"
const GT_GRAD = 'linear-gradient(90deg,#1997d4 0%,#18a889 34%,#f0a63b 66%,#e83483 100%)'
const GT_BK_CSS = `
/* Masthead buổi (đầu mỗi buổi): khung gradient bo góc + logo thật + pill + tiêu đề + Lớp/Ngày + huy hiệu tròn.
   ⚠ ĐỪNG thêm break-after:page/avoid vào đây để "chữa" bug trắng trang — đã thử, chỉ đổi chỗ lãng phí chứ
   không sửa gốc (gốc nằm ở thẻ <div> bọc nhóm card trong BuoiBlock, xem comment ở đó). */
.gtbk-mh{position:relative;overflow:hidden;margin:2mm 0 5mm;min-height:40mm;padding:5mm 6mm;border:1px solid #dbe7f4;border-radius:5mm;background:linear-gradient(112deg,#f5fbff 0%,#f8fbff 42%,#fff7fb 100%);break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.gtbk-mh:before{content:"";position:absolute;left:0;top:0;bottom:0;width:2.3mm;background:linear-gradient(180deg,#1997d4 0%,#18a889 36%,#f0a63b 68%,#e83483 100%);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.gtbk-mh:after{content:"";position:absolute;right:-10mm;top:-16mm;width:62mm;height:62mm;border-radius:50%;border:9mm solid rgba(25,151,212,.055);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.gtbk-mh-grid{position:absolute;right:33mm;top:4mm;width:43mm;height:29mm;opacity:.16;background-image:radial-gradient(#53739c 1px,transparent 1px);background-size:5px 5px;transform:rotate(-5deg);z-index:0}
.gtbk-mh-main{position:relative;z-index:3;width:calc(100% - 31mm)}
.gtbk-mh-brand{display:flex;align-items:center;gap:2.4mm;margin-bottom:3mm}
.gtbk-mh-logo{height:6.5mm;width:auto;display:block}
.gtbk-mh-kicker{display:flex;align-items:center;gap:2mm;margin-bottom:1.8mm}
.gtbk-mh-pill{display:inline-flex;align-items:center;height:6.2mm;padding:0 2.8mm;border-radius:99px;background:#e7f7f3;border:1px solid #c4eae1;color:#0f7e72;font-family:${GT_SANS};font-size:8.5pt;font-weight:900;letter-spacing:.06em;text-transform:uppercase;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.gtbk-mh-tag{display:inline-flex;align-items:center;height:6.2mm;padding:0 2.8mm;border-radius:99px;background:#fff;border:1px solid #e6dce5;color:#a64875;font-family:${GT_SANS};font-size:8pt;font-weight:800;letter-spacing:.045em;text-transform:uppercase}
.gtbk-mh-title{margin:0;font-family:${GT_SANS};font-size:23pt;line-height:1.06;letter-spacing:-.03em;color:#142744;font-weight:900}
.gtbk-mh-sub{margin-top:1.8mm;font-family:${GT_SANS};font-size:9.6pt;color:#6a7a93;font-weight:600}
.gtbk-mh-badge{position:absolute;z-index:4;right:6.5mm;top:50%;transform:translateY(-50%);width:24mm;height:24mm;border-radius:6.5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;background:linear-gradient(145deg,#168fcf 0%,#4867cc 100%);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.gtbk-mh-badge small{font-family:${GT_SANS};font-size:6.5pt;font-weight:800;letter-spacing:.12em;opacity:.86;margin-bottom:.5mm;text-transform:uppercase}
.gtbk-mh-badge strong{font-family:${GT_SANS};font-size:22pt;line-height:.9;font-weight:900}
/* Masthead KHÔNG huy hiệu (buổi không rõ số / BTVN) → phần chữ dùng full chiều ngang. */
.gtbk-mh-nobadge .gtbk-mh-main{width:100%}
/* Đầu phiếu BTVN = masthead + hàng ô Họ tên · Lớp · Điểm (tái dùng .pv-bkh-* trong BK_CSS). */
.gtbk-btvn-head{break-inside:avoid;margin-bottom:12px}
/* BTVN: masthead trong .gtbk-btvn-head KHÔNG lấy break-after:page của .gtbk-mh (bên dưới) — phiếu BTVN in
   RIÊNG TỪNG HS, ép thêm 1 trang chỉ để chứa masthead = NHÂN ĐÔI giấy cho MỌI HS trong lớp, phí quá nhiều
   so với 1 buổi giáo trình in 1 bản. Bug trắng-trang/mất-nội-dung chỉ thấy ở giáo trình (masthead đứng 1
   mình đầu buổi + card đầu ngay sau) — BTVN chưa báo, giữ hành vi cũ (dính liền) cho tới khi có bằng chứng. */
.gtbk-btvn-head .gtbk-mh{margin:2mm 0 3mm;break-after:avoid}
.gtbk-btvn-head .pv-bkh-student{margin:0}
/* Card mỗi dạng — KHÔNG atomic (dạng dài phải CHẢY nối tiếp qua trang, không bỏ trống nhảy trang).
   ⭐ TUYỆT ĐỐI không overflow:hidden ở đây: paged.js coi box overflow:hidden là KHÔNG tách được → nguyên
   card nhảy sang trang sau khi cuối trang không đủ chỗ (đúng lỗi "đề mục mới luôn sang trang"). Bo góc đầu
   card xử bằng border-radius trên .gtbk-card-head thay cho overflow:hidden. */
.gtbk-card{border:1px solid #dce5ef;border-radius:3.2mm;background:#fff;margin:0 0 4mm;break-inside:auto}
.gtbk-card-head{display:flex;align-items:center;gap:2.6mm;padding:2.4mm 3.2mm;background:#f3f7fb;border-bottom:1px solid #e2e8f0;border-radius:3mm 3mm 0 0;break-after:avoid;break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.gtbk-code{flex:none;padding:1mm 2.6mm;background:#13233f;color:#fff;border-radius:99px;font-family:${GT_SANS};font-size:8.5pt;font-weight:900;letter-spacing:.04em;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.gtbk-card-title{flex:1;font-family:${GT_SANS};font-size:12pt;font-weight:800;color:#203454;line-height:1.22}
.gtbk-pill{flex:none;font-family:${GT_SANS};font-size:8pt;color:#0e806f;font-weight:900;letter-spacing:.04em;text-transform:uppercase;background:#e8f8f3;border:1px solid #c9eee3;border-radius:99px;padding:.9mm 2.2mm;white-space:nowrap;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.gtbk-card-body{padding:2.4mm 3.4mm 2.8mm}
.gtbk-card-body .pv-cau:first-child{margin-top:2px}
/* ⭐ .pv-cau mặc định break-inside:avoid (PrintView.tsx) — ET/BTVN/MT đã override break-inside:auto
   riêng (.pv-et/.pv-btvn/.pv-mt .pv-cau) NHƯNG giáo trình (card .gtbk-card-body) thì CHƯA, nên vẫn dính
   đúng lỗi cũ: câu không đủ chỗ cuối trang bị đẩy nguyên khối sang trang sau → bỏ trống cuối trang, và
   paged.js từng ĐÁNH RƠI LUÔN câu đó (không phải chỉ đẩy trang) khi avoid + không đủ chỗ — Thùy báo ảnh
   "GT 7S2 14/08" mất hẳn Câu 1 của dạng T107010506 (chỉ còn Câu 2 ở trang sau, Câu 1 biến mất). Xem
   DEVLOG 07-11 — cùng cơ chế "khối atomic quá cao" đã sinh bug này cho ET/BTVN/MT.
   .pv-math:first-child break-after:avoid vẫn giữ (không mồ côi "Câu N." đứng 1 mình cuối trang, đề rơi sau). */
.gtbk-card-body .pv-cau{break-inside:auto}
.gtbk-card-body .pv-cau .pv-math:first-child{break-after:avoid}
`

// @page + dải gradient/footer cho giáo trình BK. `sc` = selector container (vd '.pv-scope-7 ') để 2 pseudo
// dải chỉ sơn lên trang TRONG container render này (không rò sang render khác — xem comment scope ở effect).
// @page (margin + số trang + liên hệ) buộc phải toàn cục như buildPagedCss; render đang xem là <style> sau cùng.
export const gtPageCss = (sc: string) => `
@page{
  margin:11mm 13mm 15mm;
  @bottom-center{content:"BK Academy   ·   Tel: 0963.209.309   ·   17A10 KĐT Geleximco";font-family:${GT_SANS};color:#6a7a93;font-weight:700;font-size:8pt;vertical-align:middle}
  @bottom-right{content:counter(page) " / " counter(pages);font-family:${GT_SANS};color:#233755;font-weight:900;font-size:8.5pt;vertical-align:middle}
}
${sc}.pagedjs_pagebox::before{content:"";position:absolute;top:0;left:0;right:0;height:4mm;background:${GT_GRAD};z-index:2;-webkit-print-color-adjust:exact;print-color-adjust:exact}
${sc}.pagedjs_pagebox::after{content:"";position:absolute;bottom:0;left:0;right:0;height:3mm;background:${GT_GRAD};z-index:2;-webkit-print-color-adjust:exact;print-color-adjust:exact}
/* In cả lớp: mỗi HS bắt đầu ở TRANG LẺ (mặt trước) → in 2 mặt mỗi HS luôn chẵn trang, không dính HS sau
   (paged.js tự chèn trang trắng). Con đầu không break thêm (wrapper đã break). */
.pv-hs-recto{break-before:right}
.pv-hs-recto>.pv-btvn:first-child{break-before:auto}
`

function cssStr(s: string): string { return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"' }
function waveUri(path: string, c1: string, c2: string, c3: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 100' preserveAspectRatio='none'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='${c1}'/><stop offset='.5' stop-color='${c2}'/><stop offset='1' stop-color='${c3}'/></linearGradient></defs><path d='${path}' fill='url(#g)'/></svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

// Chrome trang (dải sóng header/footer + logo + text) — DÙNG CHUNG cho paged.js CSS (pseudo) và onclone của html2canvas (phần tử thật).
export type PageChrome = { head: boolean; foot: boolean; headUri: string; footUri: string; headText: string; footText: string; footPre: boolean; logoUrl: string; chipUri: string }
// `taiLieu` chỉ dùng để dựng chữ header/footer mặc định ⇒ nhận kiểu TỐI THIỂU, không đòi cả row
// `tai_lieu`. Nhờ vậy nhánh HÌNH (in từ node/chuỗi, KHÔNG có row tài liệu nào) tái dùng được y hệt
// khung trang A4 + dải sóng + số trang, thay vì đẻ bản sao thứ hai của cùng bộ CSS.
export type ChromeSrc = { ten: string; khoi: string }
export function pageChrome(taiLieu: ChromeSrc, ch: CauHinh, opts?: { headerText?: string; footerText?: string }): PageChrome {
  return {
    head: ch.header !== 'none', foot: ch.footer !== 'none',
    // Dải MÀU cao hơn (phủ gần hết dải) → text canh giữa nằm TRỌN trên màu.
    headUri: waveUri('M0,0 H1200 V84 C940,100 760,66 520,88 C300,100 150,76 0,92 Z', '#E91E8C', '#F7941E', '#2D9CDB'),
    footUri: waveUri('M0,100 H1200 V14 C940,0 760,34 520,10 C300,0 150,26 0,16 Z', '#2D9CDB', '#F7941E', '#E91E8C'),
    headText: opts?.headerText ?? `${taiLieu.ten} · Khối ${taiLieu.khoi}`,
    footText: opts?.footerText ?? `BK ACADEMY · ${taiLieu.ten} · Khối ${taiLieu.khoi}`,
    footPre: !!opts?.footerText, // footer override nhiều khoảng trắng → white-space:pre
    logoUrl: location.origin + '/Logo.png', // tuyệt đối: paged.js rewrite url() theo base blob → '/x' throw
    // Chip trắng bo góc làm nền cho logo (đọc rõ trên dải sóng). viewBox 140:30 = 42:9 mm.
    chipUri: 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 30'><rect x='1.2' y='1.2' width='137.6' height='27.6' rx='7' fill='#ffffff' stroke='#dfe5ec' stroke-width='1.4'/></svg>`),
  }
}
// Stylesheet cho paged.js: A4 + lề + dải sóng full-bleed (pseudo của pagebox) + số trang (@page margin box).
// `scopeSel` (vd '.pv-scope-7') — prefix ancestor cho 2 rule chrome (::before/::after) để stylesheet này
// chỉ khớp trang TRONG đúng container render của nó, không rò sang render khác (xem PrintView effect). Rỗng
// = toàn cục (giữ tương thích các caller khác).
export function buildPagedCss(taiLieu: ChromeSrc, ch: CauHinh, accent: string, opts?: { headerText?: string; footerText?: string }, scopeSel = ''): string {
  const cr = pageChrome(taiLieu, ch, opts)
  const { head, foot, headUri, footUri, logoUrl, chipUri } = cr
  const headTxt = cssStr(cr.headText)
  const footTxt = cssStr(cr.footText)
  const footWS = cr.footPre ? 'white-space:pre;' : ''
  const sc = scopeSel ? scopeSel + ' ' : ''
  return CONTENT_CSS + `
.katex{font-size:0.95em!important}.pagedjs_page{font-family:'Times New Roman',Tinos,Times,serif;font-size:17px;color:#23272b;line-height:1.55;--pv-accent:${accent}}
.pagedjs_pagebox{position:relative}
${/* ⭐ 07-12 tiếp 5: `:not(.pv-no-chrome)` — gate SELECTOR (không phải property override) cho đường
    html2canvas. 2 lần trước cố "tắt" pseudo BẰNG property (content:none/xoá rule CSSOM) đều KHÔNG ăn —
    verify nhiều lần bằng file thật vẫn còn chữ nhân đôi. html2canvas được cho là hỗ trợ pseudo-element
    KHÔNG ĐÁNG TIN CẬY cho việc "ẩn nó đi", nhưng SELECTOR MATCHING (rule có áp dụng cho phần tử hay
    không) là hành vi CSS cơ bản, đáng tin hơn hẳn 1 property riêng lẻ. `uploadPagesAsLink` gắn class
    `pv-no-chrome` lên `.pagedjs_pagebox` TRÊN DOM SỐNG (không phải bản clone) NGAY TRƯỚC khi gọi
    html2canvas → rule đơn giản KHÔNG CÒN KHỚP nữa, không cần html2canvas "tôn trọng" gì thêm. */ ''}
${head ? `${sc}.pagedjs_pagebox:not(.pv-no-chrome)::before{content:${headTxt};position:absolute;top:0;left:0;right:0;height:18mm;padding:0 10mm 0 50mm;box-sizing:border-box;background:url("${logoUrl}") 8mm 3.5mm / auto 5mm no-repeat, url("${chipUri}") 4.5mm 1.5mm / 42mm 9mm no-repeat, url("${headUri}") center/100% 100% no-repeat;display:flex;align-items:center;justify-content:flex-end;color:#fff;font-weight:700;font-size:11px;letter-spacing:.3px;text-shadow:0 1px 2px rgba(0,0,0,.25);z-index:1}` : ''}
${foot ? `${sc}.pagedjs_pagebox:not(.pv-no-chrome)::after{content:${footTxt};${footWS}position:absolute;bottom:0;left:0;right:0;height:15mm;padding:0 16mm;box-sizing:border-box;background:url("${footUri}") center/100% 100% no-repeat;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:11px;letter-spacing:.3px;text-shadow:0 1px 3px rgba(0,0,0,.35);z-index:1}` : ''}
@page{
  size:A4;
  margin:18mm 14mm 22mm;
  ${foot ? `@bottom-right{content:counter(page) " / " counter(pages);color:#1f2937;font-family:'Times New Roman',serif;font-weight:800;font-size:12px;vertical-align:top}` : ''}
}
`
}
