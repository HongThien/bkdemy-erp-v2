// KHO TÀI LIỆU = bảng tổng MỌI tài liệu đã tạo trong hệ (giáo trình · ET · MT · chuyên đề…).
// Cột thông tin + nút IN (giáo trình→PrintView, ET→ETPrintView) + Nhân bản (tái sử dụng) + Xoá.
import { useEffect, useMemo, useState } from 'react'
import { listAllTaiLieu, deleteTaiLieu, duplicateTaiLieu, updateTaiLieu, type TaiLieu } from '../../lib/tailieu'
import { phatHanhTest, PHAT_HANH_DUOC } from '../../lib/testonline'
import { listLop, type Lop } from '../../lib/nhansu'
import { useStore } from '../../store/useStore'
import PrintView from './PrintView'
import ETPrintView from './ETPrintView'
import DeThiPrintView from './DeThiPrintView'
import MTPrintView from './MTPrintView'
import TaiLieuBuilder from './TaiLieuBuilder'
import { ETEditor, type ETView } from './ETScreen'
import { DeThiEditor } from './DeThiScreen'
import { MTEditor } from './MTScreen'

// Loại tài liệu có thể mở builder để sửa từ Kho. (mt_buoi = INSTANCE đã gán buổi — sửa nội dung
// phải qua master rồi gán lại, không sửa trực tiếp instance để tránh lệch với các lớp khác đã gán.)
const EDITABLE = new Set(['et', 'giao_trinh', 'giao_trinh_buoi', 'btvn', 'de_thi', 'mt'])

type Row = TaiLieu & { lop_id?: string | null; ngay?: string | null }
const LOAI_TEN: Record<string, string> = { giao_trinh: 'Giáo trình', giao_trinh_buoi: 'Giáo trình buổi', btvn: 'BTVN', et: 'ET', de_thi: 'Đề thi', bo_tro: 'Tài liệu bổ trợ', mt: 'MT', mt_buoi: 'MT buổi', chuyen_de: 'Chuyên đề' }
const loaiTen = (l: string) => LOAI_TEN[l] ?? l
const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—')

export default function KhoTaiLieuScreen() {
  const [rows, setRows] = useState<Row[]>([])
  const [lops, setLops] = useState<Lop[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [loai, setLoai] = useState<string>('__all__')
  const [monF, setMonF] = useState<string>('__all__')
  const me = useStore((s) => s.me)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  const myMons = me?.mons ?? []
  const [print, setPrint] = useState<{ id: string; loai: string } | null>(null)
  const [dlDoc, setDlDoc] = useState<{ id: string; loai: string } | null>(null)
  const [linkDoc, setLinkDoc] = useState<{ id: string; loai: string; autoCopy: boolean } | null>(null) // "🔗 Lấy link" — render ẩn, CHỈ upload+link, không tải file cục bộ
  const [linkQueue, setLinkQueue] = useState<{ id: string; loai: string }[]>([]) // hàng đợi lấy-link NỀN (làm mới sau sửa + bulk Thùy tự bấm)
  const [bulkRunning, setBulkRunning] = useState(false) // đang chạy hàng loạt (Thùy chủ động bấm) — khác nền-1-job-sau-khi-sửa
  const [linkErrId, setLinkErrId] = useState<string | null>(null) // id vừa timeout — báo lỗi thoáng qua trên đúng dòng
  const [editEt, setEditEt] = useState<ETView | null>(null) // sửa ET tại chỗ (mở ETEditor)
  const [editGt, setEditGt] = useState<string | null>(null) // sửa giáo trình/BTVN (mở TaiLieuBuilder)
  const [editDeThi, setEditDeThi] = useState<string | null>(null) // sửa đề thi (mở DeThiEditor)
  const [editMT, setEditMT] = useState<string | null>(null) // sửa MT master (mở MTEditor)
  const [phBusy, setPhBusy] = useState<string | null>(null) // id doc đang phát hành
  const [phRes, setPhRes] = useState<{ ok: boolean; msg: string; skipped?: { ma_cau: string; warn: string }[] } | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null) // feedback "✓ Đã copy" thoáng qua, không alert()
  async function copyLink(url: string, id: string) {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 2000)
  }
  const lopTen = (id?: string | null) => lops.find((l) => l.id === id)?.ten_lop ?? '?'

  async function phatHanh(r: Row) {
    setPhBusy(r.id)
    try {
      const kq = await phatHanhTest(r.id)
      setPhRes({ ok: true, msg: `Đã phát hành ${kq.added} câu cho học sinh làm online.`, skipped: kq.skipped })
    } catch (e: any) {
      setPhRes({ ok: false, msg: e?.message ?? String(e) })
    } finally { setPhBusy(null) }
  }

  async function reload() {
    setLoading(true)
    try {
      const [d, l] = await Promise.all([listAllTaiLieu(), listLop()])
      setRows(d as Row[]); setLops(l)
      return d as Row[]
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line

  // "🔗 Lấy link" — có link rồi thì copy luôn; chưa có thì dựng ẩn (headless+linkOnly) để upload+ghi
  // file_url, xong tự copy link mới. Thùy 07-11: "link phải có TRƯỚC khi bấm tải", nên tách hẳn khỏi
  // "⬇ Tải PDF" — bấm "Lấy link" không tạo ra file .pdf nào rơi vào Downloads.
  function layLink(r: Row) {
    if (r.file_url) { copyLink(r.file_url, r.id); return }
    setLinkDoc({ id: r.id, loai: r.loai, autoCopy: true })
  }
  // "↻" làm mới link ĐÃ CÓ (vd sau khi sửa nội dung nơi khác, hoặc file cũ bị lỗi render) — bấm thẳng,
  // không qua nhánh "đã có thì copy" của layLink().
  function lamMoiLink(r: Row) {
    setLinkDoc({ id: r.id, loai: r.loai, autoCopy: true })
  }
  // Hàng đợi NỀN — xử lý TUẦN TỰ (1 headless PrintView tại 1 thời điểm — effect dưới) để không hâm nóng
  // máy dựng hàng chục trang cùng lúc. KHÔNG tự copy (autoCopy false) — nền thì không được lặng lẽ ghi
  // đè clipboard của Thùy.
  // ⚠ 07-11 tiếp 9 (Thùy báo "vào Kho là load mãi Đang lấy link"): BỎ HẲN auto-backfill-mọi-tài-liệu-
  // lúc-mở-màn — 337/343 tài liệu cũ chưa có link, tự xếp hàng cả cục MỖI LẦN MỞ MÀN, và chỉ cần 1 tài
  // liệu bị treo (paged.js từng treo vĩnh viễn, xem DEVLOG) là cả hàng đợi kẹt cứng, Thùy thấy y hệt
  // "cứ load mãi". Giờ CHỈ enqueue khi: (a) Thùy chủ động bấm "Tạo link hàng loạt", (b) auto làm mới 1
  // doc vừa sửa (bounded, 1 job).
  function enqueueLink(id: string, loai: string) {
    setLinkQueue((q) => (q.some((x) => x.id === id) || linkDoc?.id === id) ? q : [...q, { id, loai }])
  }
  const missingCount = useMemo(() => rows.filter((r) => !r.file_url).length, [rows])
  function batDauLayLinkHangLoat() {
    const missing = rows.filter((r) => !r.file_url)
    if (missing.length === 0) return
    if (!confirm(`Tạo link cho ${missing.length} tài liệu còn thiếu? Chạy TUẦN TỰ ở nền, có thể mất khá lâu — bấm "⏹ Dừng" bất cứ lúc nào để huỷ phần chưa chạy (phần đã làm vẫn giữ).`)) return
    setLinkQueue((q) => { const have = new Set(q.map((x) => x.id)); return [...q, ...missing.filter((r) => !have.has(r.id)).map((r) => ({ id: r.id, loai: r.loai }))] })
    setBulkRunning(true)
  }
  function dungLayLinkHangLoat() { setLinkQueue([]); setBulkRunning(false) }
  useEffect(() => {
    if (linkDoc || linkQueue.length === 0) return
    const [next, ...rest] = linkQueue
    setLinkQueue(rest)
    setLinkDoc({ ...next, autoCopy: false })
  }, [linkDoc, linkQueue])
  useEffect(() => { if (bulkRunning && !linkDoc && linkQueue.length === 0) setBulkRunning(false) }, [bulkRunning, linkDoc, linkQueue])
  // Watchdog cho MỌI job (kể cả bấm tay — trước chỉ áp job nền, nhưng Thùy đã gặp "Đang lấy link" treo
  // mãi cả khi bấm tay). paged.js từng TREO VĨNH VIỄN không resolve/không lỗi (xem DEVLOG) → quá 40s thì
  // bỏ, báo lỗi thoáng qua trên đúng dòng, KHÔNG tự thử lại (tránh vòng lặp vô hạn trên 1 doc luôn treo).
  useEffect(() => {
    if (!linkDoc) return
    const cur = linkDoc
    const t = setTimeout(() => {
      setLinkDoc((now) => (now === cur ? null : now))
      setLinkErrId(cur.id)
      setTimeout(() => setLinkErrId((id) => (id === cur.id ? null : id)), 4000)
    }, 40000)
    return () => clearTimeout(t)
  }, [linkDoc])
  async function xongLayLink() {
    if (!linkDoc) return
    const { id, autoCopy } = linkDoc
    setLinkDoc(null)
    const fresh = await reload()
    if (autoCopy) { const row = fresh.find((x) => x.id === id); if (row?.file_url) copyLink(row.file_url, id) }
  }

  // Scope MÔN: GV/Học-thuật có môn → chỉ tài liệu môn mình; admin / không-gán-môn (Media/Marketing) → thấy tất.
  const visibleRows = useMemo(() => (laAdmin || myMons.length === 0) ? rows : rows.filter((r) => myMons.includes(r.mon)), [rows, laAdmin, myMons])
  const monsCo = useMemo(() => [...new Set(visibleRows.map((r) => r.mon).filter(Boolean))].sort(), [visibleRows])
  const loais = useMemo(() => [...new Set(visibleRows.map((r) => r.loai))], [visibleRows])
  const shown = visibleRows
    .filter((r) => monF === '__all__' || r.mon === monF)
    .filter((r) => loai === '__all__' || r.loai === loai)
    .filter((r) => !q.trim() || r.ten.toLowerCase().includes(q.trim().toLowerCase()))

  async function nhanBan(r: Row) {
    const ten = prompt('Tên bản sao (lưu vào kho để tái sử dụng):', `${r.ten} (sao)`)?.trim()
    if (!ten) return
    await duplicateTaiLieu(r.id, { ten, lop_id: null, ngay: null }) // bản sao KHÔNG gắn buổi → mẫu tái dùng
    reload()
  }
  function sua(r: Row) {
    if (r.loai === 'et') setEditEt({ ...(r as any), ten_lop: lopTen(r.lop_id) })
    else if (r.loai === 'de_thi') setEditDeThi(r.id)
    else if (r.loai === 'mt') setEditMT(r.id)
    else setEditGt(r.id)
  }
  // Đổi TÊN FILE ngay tại kho (= tai_lieu.ten, cột hiển thị) — khỏi vào builder (builder có ô tên buổi riêng dễ nhầm).
  // Tên cũng in RA TRÊN trang (tiêu đề + header/footer) → đổi tên = đổi nội dung PDF → phải làm mới link.
  async function doiTen(r: Row) {
    const ten = prompt('Đổi tên tài liệu (tên hiển thị trong kho):', r.ten)?.trim()
    if (!ten || ten === r.ten) return
    await updateTaiLieu(r.id, { ten })
    reload()
    enqueueLink(r.id, r.loai)
  }

  // Sửa tại chỗ: mở builder full-screen, đóng → tải lại bảng + LÀM MỚI link nền (nội dung vừa đổi, link
  // cũ giờ lỗi thời — Thùy 07-11 tiếp 8: "t cần lưu mọi file pdf", tự làm mới chứ không đợi bấm lại).
  if (editEt) return <ETEditor et={editEt} onClose={() => { const id = editEt.id; setEditEt(null); reload(); enqueueLink(id, 'et') }} />
  if (editGt) return <TaiLieuBuilder id={editGt} onClose={() => { const id = editGt; setEditGt(null); reload(); enqueueLink(id, 'giao_trinh') }} />
  if (editDeThi) return <DeThiEditor id={editDeThi} onClose={() => { const id = editDeThi; setEditDeThi(null); reload(); enqueueLink(id, 'de_thi') }} />
  if (editMT) return <MTEditor id={editMT} onClose={() => { const id = editMT; setEditMT(null); reload(); enqueueLink(id, 'mt') }} />

  const tab = (on: boolean) => `h-7 rounded-md px-2.5 text-xs font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Kho tài liệu</span>
        {monsCo.length > 1 && (
          <div className="mr-1 flex gap-0.5 rounded-lg bg-violet-50 p-0.5">
            <button onClick={() => setMonF('__all__')} className={`h-6 rounded-md px-2.5 text-xs font-semibold transition ${monF === '__all__' ? 'bg-violet-600 text-white shadow-sm' : 'text-violet-600 hover:bg-violet-100'}`}>Mọi môn</button>
            {monsCo.map((m) => <button key={m} onClick={() => setMonF(m)} className={`h-6 rounded-md px-2.5 text-xs font-semibold transition ${monF === m ? 'bg-violet-600 text-white shadow-sm' : 'text-violet-600 hover:bg-violet-100'}`}>{m}</button>)}
          </div>
        )}
        <button onClick={() => setLoai('__all__')} className={tab(loai === '__all__')}>Tất cả</button>
        {loais.map((l) => <button key={l} onClick={() => setLoai(l)} className={tab(loai === l)}>{loaiTen(l)}</button>)}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên…" className="ml-auto h-7 w-52 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" />
        {bulkRunning ? (
          <div className="flex items-center gap-2 rounded-md bg-sky-50 px-2.5 py-1 text-[12px] font-medium text-sky-700">
            <span>⏳ Đang lấy link hàng loạt… còn {linkQueue.length + (linkDoc && !linkDoc.autoCopy ? 1 : 0)}</span>
            <button onClick={dungLayLinkHangLoat} className="rounded border border-sky-300 px-1.5 py-0.5 text-[11px] hover:bg-sky-100">⏹ Dừng</button>
          </div>
        ) : missingCount > 0 && (
          <button onClick={batDauLayLinkHangLoat} title="Tự dựng + upload link cho mọi tài liệu chưa có, chạy tuần tự ở nền" className="rounded-md border border-sky-300 px-2.5 py-1 text-[12px] font-medium text-sky-700 hover:bg-sky-50">🔗 Tạo link hàng loạt ({missingCount} còn thiếu)</button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có tài liệu nào{loai !== '__all__' ? ` loại “${loaiTen(loai)}”` : ''}.</div>
          : (
            <div className="rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[13px]">
                <thead className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="sticky top-0 z-10 bg-slate-50 px-4 py-2.5">Tên tài liệu</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Loại</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Khối</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Gắn buổi</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Ngày tạo</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                      <td className="px-4 py-2">
                        <button onClick={() => doiTen(r)} title="Bấm để đổi tên file" className="group/n flex items-center gap-1.5 text-left font-medium text-slate-800 hover:text-indigo-600">
                          <span>{r.ten}</span>
                          <span className="text-[11px] text-slate-300 opacity-0 transition group-hover/n:opacity-100">✎</span>
                        </button>
                      </td>
                      <td className="px-3"><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">{loaiTen(r.loai)}</span></td>
                      <td className="px-3 text-slate-500">{r.khoi || '—'}</td>
                      <td className="px-3 text-slate-500">{r.lop_id && r.ngay ? `${lopTen(r.lop_id)} · ${fmt(r.ngay)}` : (r.loai === 'et' || r.loai === 'mt' ? <span className="text-violet-500">mẫu</span> : '—')}</td>
                      <td className="px-3 text-slate-500">{fmt(r.created_at)}</td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-1.5">
                          {EDITABLE.has(r.loai) && <button onClick={() => sua(r)} className="rounded-md border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300">✎ Sửa</button>}
                          {PHAT_HANH_DUOC.has(r.loai) && r.lop_id && r.ngay && (
                            <button onClick={() => phatHanh(r)} disabled={phBusy === r.id}
                              className="rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">
                              {phBusy === r.id ? '…' : '📱 Phát hành online'}
                            </button>
                          )}
                          <button onClick={() => setPrint({ id: r.id, loai: r.loai })} className="rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">🖨 In</button>
                          {/* Bỏ qua bước xem thử, mở thẳng hộp thoại in (bản Học sinh mặc định) — Thùy
                              07-11: đổi hẳn từ html2canvas tự vẽ lại (hay lỗi) sang NATIVE print. */}
                          <button onClick={() => setDlDoc({ id: r.id, loai: r.loai })} className="rounded-md border border-indigo-300 px-2.5 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-50">🖨 In nhanh</button>
                          <button onClick={() => layLink(r)} disabled={linkDoc?.id === r.id} title={linkErrId === r.id ? 'Dựng trang quá lâu (>40s), thử lại' : r.file_url ?? 'Bấm để tạo link chia sẻ'}
                            className={`rounded-md border px-2.5 py-1 text-[12px] font-medium disabled:opacity-40 ${linkErrId === r.id ? 'border-rose-300 text-rose-600 hover:bg-rose-50' : 'border-sky-300 text-sky-700 hover:bg-sky-50'}`}>
                            {linkDoc?.id === r.id ? '⏳ Đang lấy…' : copiedId === r.id ? '✓ Đã copy' : linkErrId === r.id ? '❌ Lỗi, bấm lại' : r.file_url ? '🔗 Copy link' : (linkQueue.some((x) => x.id === r.id) ? '⏳ Chờ xếp hàng…' : '🔗 Lấy link')}
                          </button>
                          {r.file_url && (
                            <button onClick={() => lamMoiLink(r)} disabled={linkDoc?.id === r.id} title="Tạo lại link (dùng khi nội dung vừa đổi ở nơi khác hoặc file cũ bị lỗi)"
                              className="rounded-md border border-slate-200 px-2 py-1 text-[12px] text-slate-400 hover:border-sky-300 hover:text-sky-600 disabled:opacity-40">↻</button>
                          )}
                          <button onClick={() => nhanBan(r)} className="rounded-md border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300">Nhân bản</button>
                          <button onClick={async () => { if (confirm(`Xoá “${r.ten}”?`)) { await deleteTaiLieu(r.id); reload() } }} className="rounded-md border border-slate-200 px-2.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {print && (print.loai === 'et'
        ? <ETPrintView id={print.id} onClose={() => { setPrint(null); reload() }} />
        : print.loai === 'de_thi'
        ? <DeThiPrintView id={print.id} onClose={() => { setPrint(null); reload() }} />
        : print.loai === 'mt' || print.loai === 'mt_buoi'
        ? <MTPrintView id={print.id} onClose={() => { setPrint(null); reload() }} />
        : <PrintView id={print.id} onClose={() => { setPrint(null); reload() }} />)}

      {/* "🖨 In nhanh" từ hàng (headless: dựng ẩn → mở hộp thoại in NATIVE → đóng khi hộp thoại đóng),
          không mở preview. KHÔNG còn ghi file_url (đó là việc riêng của "🔗 Lấy link" — xem dưới). */}
      {dlDoc && (dlDoc.loai === 'et'
        ? <ETPrintView id={dlDoc.id} headless onClose={() => { setDlDoc(null); reload() }} />
        : dlDoc.loai === 'de_thi'
        ? <DeThiPrintView id={dlDoc.id} headless onClose={() => { setDlDoc(null); reload() }} />
        : dlDoc.loai === 'mt' || dlDoc.loai === 'mt_buoi'
        ? <MTPrintView id={dlDoc.id} headless onClose={() => { setDlDoc(null); reload() }} />
        : <PrintView id={dlDoc.id} headless onClose={() => { setDlDoc(null); reload() }} />)}

      {/* "🔗 Lấy link" — dựng ẩn CHỈ để upload+ghi file_url (linkOnly: KHÔNG pdf.save(), không rơi file
          vào Downloads). autoCopy=true (bấm tay) mới copy vào clipboard; autoCopy=false (hàng đợi nền —
          backfill/làm mới sau sửa) chỉ âm thầm cập nhật file_url, KHÔNG đụng clipboard của Thùy. */}
      {linkDoc && (linkDoc.loai === 'et'
        ? <ETPrintView id={linkDoc.id} headless linkOnly onClose={xongLayLink} />
        : linkDoc.loai === 'de_thi'
        ? <DeThiPrintView id={linkDoc.id} headless linkOnly onClose={xongLayLink} />
        : linkDoc.loai === 'mt' || linkDoc.loai === 'mt_buoi'
        ? <MTPrintView id={linkDoc.id} headless linkOnly onClose={xongLayLink} />
        : <PrintView id={linkDoc.id} headless linkOnly onClose={xongLayLink} />)}

      {phRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setPhRes(null)}>
          <div className="w-[420px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className={`text-[15px] font-semibold ${phRes.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{phRes.ok ? '✓ Phát hành thành công' : 'Không phát hành được'}</p>
            <p className="mt-1 text-sm text-slate-600">{phRes.msg}</p>
            {phRes.skipped && phRes.skipped.length > 0 && (
              <div className="mt-3 rounded-lg bg-amber-50 p-3">
                <p className="text-[12px] font-semibold text-amber-700">{phRes.skipped.length} câu bị bỏ qua (không lên online):</p>
                <ul className="mt-1 max-h-40 overflow-auto text-[12px] text-amber-800">
                  {phRes.skipped.map((s, i) => <li key={i}>• {s.ma_cau}: {s.warn}</li>)}
                </ul>
              </div>
            )}
            <div className="mt-4 text-right">
              <button onClick={() => setPhRes(null)} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
