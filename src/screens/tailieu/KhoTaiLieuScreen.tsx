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
import SearchSelect from '../../components/SearchSelect'
import BuoiNgaySelect from '../../components/BuoiNgaySelect'

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

  // ⭐ 07-12 — link PDF giờ gen TỰ ĐỘNG ngay lúc tài liệu tạo/sửa xong (`enqueueLinkGen`, hàng đợi TOÀN
  // CỤC xử lý bởi `LinkGenWorker` mount ở App.tsx — xem store `linkGenQueue`). Màn này KHÔNG còn tự
  // dựng/upload gì nữa — nút chỉ COPY link đã có sẵn, không click-để-chờ trong bất kỳ trường hợp nào
  // (Thùy 07-12: "T ko muốn hiện lấy link... người dùng chỉ click vào link để copy thôi, KO chờ đợi").
  function layLink(r: Row) {
    if (r.file_url) copyLink(r.file_url, r.id)
  }

  // Scope MÔN: GV/Học-thuật có môn → chỉ tài liệu môn mình; admin / không-gán-môn (Media/Marketing) → thấy tất.
  const visibleRows = useMemo(() => (laAdmin || myMons.length === 0) ? rows : rows.filter((r) => myMons.includes(r.mon)), [rows, laAdmin, myMons])
  const monsCo = useMemo(() => [...new Set(visibleRows.map((r) => r.mon).filter(Boolean))].sort(), [visibleRows])
  const loais = useMemo(() => [...new Set(visibleRows.map((r) => r.loai))], [visibleRows])
  const shown = visibleRows
    .filter((r) => monF === '__all__' || r.mon === monF)
    .filter((r) => loai === '__all__' || r.loai === loai)
    .filter((r) => !q.trim() || r.ten.toLowerCase().includes(q.trim().toLowerCase()))

  // Nhân bản = MỘT LƯỢT GÁN (Thùy 07-12: "phải được coi như 1 lần gán... như gán ET bình thường, khác
  // cái là có nội dung sẵn") — KHÔNG còn prompt() tên tự do + lop_id/ngay null. Mở modal bắt buộc chọn
  // Lớp + Ngày buổi học (đúng component BuoiNgaySelect/SearchSelect ETEditor dùng), tên tự sinh theo
  // lớp+ngày (giống ET/BTVN), không cho gõ tay tránh lệch quy ước đặt tên giữa các loại tài liệu.
  const [dup, setDup] = useState<Row | null>(null)
  const [dupLop, setDupLop] = useState<string | null>(null)
  const [dupNgay, setDupNgay] = useState('')
  const [dupErr, setDupErr] = useState<string | null>(null)
  const [dupBusy, setDupBusy] = useState(false)
  function nhanBan(r: Row) { setDup(r); setDupLop(r.lop_id ?? null); setDupNgay(''); setDupErr(null) }
  async function xacNhanNhanBan() {
    if (!dup) return
    const l = lops.find((x) => x.id === dupLop)
    if (!l) { setDupErr('Chọn lớp.'); return }
    if (!dupNgay) { setDupErr('Chọn ngày buổi học.'); return }
    setDupBusy(true); setDupErr(null)
    try {
      // Tên gốc CÓ THỂ đã sẵn gắn lớp+ngày cũ trong chuỗi (vd "ET 5T1 · 12/07/2026", do ETEditor/TrichPanel
      // tự đặt) — nếu nối thêm mù quáng sẽ ra tên lặp ("...5T1 · 12/07/2026 · 5T1 · 19/07/2026"). Thay THẾ
      // đúng lớp/ngày CŨ bằng MỚI nếu tìm thấy trong tên; chỉ nối thêm khi tên gốc là MẪU (chưa gắn buổi).
      const ngayVN = dupNgay.split('-').reverse().join('/')
      const oldLop = dup.lop_id ? lopTen(dup.lop_id) : null
      const oldNgayVN = dup.ngay ? dup.ngay.split('-').reverse().join('/') : null
      let ten = dup.ten
      if (oldLop) ten = ten.split(oldLop).join(l.ten_lop)
      if (oldNgayVN) ten = ten.split(oldNgayVN).join(ngayVN)
      if (!oldLop || !oldNgayVN) ten = `${ten} · ${l.ten_lop} · ${ngayVN}`
      const created = await duplicateTaiLieu(dup.id, { ten, lop_id: l.id, ngay: dupNgay })
      // ⭐ 07-12: bản sao ĐỦ NỘI DUNG ngay (copy từ nguồn) — enqueue link luôn, không đợi bấm.
      useStore.getState().enqueueLinkGen(created.id, created.loai)
      setDup(null)
      reload()
    } catch (e: any) { setDupErr(e.message ?? String(e)) } finally { setDupBusy(false) }
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
    // Tên in RA TRÊN trang (tiêu đề + header/footer) → đổi tên = đổi nội dung PDF → link cũ lỗi thời.
    useStore.getState().enqueueLinkGen(r.id, r.loai)
  }

  // Sửa tại chỗ: mở builder full-screen. Link PDF tự làm mới NGAY TRONG chính editor lúc đóng (nút
  // "← ..."/"← Kho tài liệu" của mỗi editor tự enqueueLinkGen trước khi gọi onClose) — không cần lặp
  // lại ở đây nữa (07-12, dọn theo pivot gen-tại-lúc-sửa).
  if (editEt) return <ETEditor et={editEt} onClose={() => { setEditEt(null); reload() }} />
  if (editGt) return <TaiLieuBuilder id={editGt} onClose={() => { setEditGt(null); reload() }} />
  if (editDeThi) return <DeThiEditor id={editDeThi} onClose={() => { setEditDeThi(null); reload() }} />
  if (editMT) return <MTEditor id={editMT} onClose={() => { setEditMT(null); reload() }} />

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
                        {/* Tên dài (vd "BTVN 8A2 · Buổi 4: Bình phương của tổng hoặc hiệu") từng xuống dòng
                            làm CHIỀU CAO HÀNG ĐÓ lệch hẳn so với hàng khác → bảng "xiêu vẹo" — Thùy 07-12
                            báo lần 2, lần trước chỉ sửa cột Thao tác, BỎ SÓT chính cột Tên (đo bằng
                            getBoundingClientRect xác nhận: hàng tên dài cao 109px, hàng tên ngắn 51px).
                            Cắt gọn 1 dòng (`truncate`, cần `min-w-0` trên span vì mặc định flex item
                            min-width:auto sẽ chặn truncate), xem tên đầy đủ qua `title` khi hover. */}
                        <button onClick={() => doiTen(r)} title={r.ten} className="group/n flex max-w-[280px] items-center gap-1.5 text-left font-medium text-slate-800 hover:text-indigo-600">
                          <span className="min-w-0 truncate">{r.ten}</span>
                          <span className="shrink-0 text-[11px] text-slate-300 opacity-0 transition group-hover/n:opacity-100">✎</span>
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3"><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">{loaiTen(r.loai)}</span></td>
                      <td className="whitespace-nowrap px-3 text-slate-500">{r.khoi || '—'}</td>
                      <td className="whitespace-nowrap px-3 text-slate-500">{r.lop_id && r.ngay ? `${lopTen(r.lop_id)} · ${fmt(r.ngay)}` : (r.loai === 'et' || r.loai === 'mt' ? <span className="text-violet-500">mẫu</span> : '—')}</td>
                      <td className="whitespace-nowrap px-3 text-slate-500">{fmt(r.created_at)}</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <div className="flex justify-end gap-1.5">
                          {EDITABLE.has(r.loai) && <button onClick={() => sua(r)} className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300">✎ Sửa</button>}
                          {PHAT_HANH_DUOC.has(r.loai) && r.lop_id && r.ngay && (
                            <button onClick={() => phatHanh(r)} disabled={phBusy === r.id} title="Phát hành online"
                              className="shrink-0 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[12px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">
                              {phBusy === r.id ? '…' : '📱'}
                            </button>
                          )}
                          <button onClick={() => setPrint({ id: r.id, loai: r.loai })} className="shrink-0 rounded-md bg-indigo-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-indigo-500">🖨 In</button>
                          {/* Bỏ qua bước xem thử, mở thẳng hộp thoại in (bản Học sinh mặc định) — Thùy
                              07-11: đổi hẳn từ html2canvas tự vẽ lại (hay lỗi) sang NATIVE print. */}
                          <button onClick={() => setDlDoc({ id: r.id, loai: r.loai })} className="shrink-0 rounded-md border border-indigo-300 px-2.5 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-50">🖨 In nhanh</button>
                          {/* ⭐ 07-12: link gen TỰ ĐỘNG ngay lúc tạo/sửa xong (LinkGenWorker toàn cục) —
                              nút này CHỈ COPY, không còn click-để-chờ trong bất kỳ trường hợp nào. Chưa
                              có link (vừa tạo, đang gen ở nền, hoặc tài liệu cũ từ trước tính năng này)
                              → nhãn thụ động, không phải nút chờ. */}
                          {r.file_url ? (
                            <button onClick={() => layLink(r)} title={r.file_url} className="shrink-0 rounded-md border border-sky-300 px-2.5 py-1 text-[12px] font-medium text-sky-700 hover:bg-sky-50">
                              {copiedId === r.id ? '✓ Đã copy' : '🔗 Copy link'}
                            </button>
                          ) : (
                            <span className="shrink-0 px-1 text-[12px] text-slate-300" title="Link PDF tự tạo trong ít phút — tài liệu vừa tạo/sửa hoặc tài liệu cũ từ trước tính năng này">— chưa có link</span>
                          )}
                          {/* "↻" — lối thoát khi job nền lỗi/treo (paged.js đôi khi treo, xem DEVLOG) và
                              tài liệu mãi không có link. KHÔNG hiện trạng thái chờ — bấm xong là quên, có
                              thì hiện ở lượt xem sau, ĐÚNG tinh thần "không chờ đợi gì cả" của Thùy. */}
                          <button onClick={() => useStore.getState().enqueueLinkGen(r.id, r.loai)} title="Tạo lại link (dùng khi mãi không thấy link, hoặc nội dung vừa đổi ở nơi khác)"
                            className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-[12px] text-slate-400 hover:border-sky-300 hover:text-sky-600">↻</button>
                          <button onClick={() => nhanBan(r)} className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300">Nhân bản</button>
                          <button onClick={async () => { if (confirm(`Xoá “${r.ten}”?`)) { await deleteTaiLieu(r.id); reload() } }} className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">Xoá</button>
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

      {dup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => !dupBusy && setDup(null)}>
          <div className="w-[420px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-[15px] font-semibold text-slate-900">Nhân bản · gán vào buổi</p>
            <p className="mt-1 text-[12px] text-slate-500">Sao chép nội dung "{dup.ten}" cho 1 lớp + ngày cụ thể — giống gán ET, chỉ khác là câu đã có sẵn.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-slate-600">Lớp</label>
                <SearchSelect value={dupLop} onChange={(v) => { setDupLop(v); setDupNgay('') }} placeholder="chọn lớp…"
                  options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-slate-600">Ngày buổi học</label>
                <BuoiNgaySelect lopId={dupLop} value={dupNgay} onChange={setDupNgay} className="h-9 w-full rounded-md border border-slate-300 px-2 text-[13px] disabled:bg-slate-50 disabled:text-slate-300" />
              </div>
            </div>
            {dupErr && <p className="mt-3 text-[12px] text-rose-600">{dupErr}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDup(null)} disabled={dupBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 disabled:opacity-40">Huỷ</button>
              <button onClick={xacNhanNhanBan} disabled={dupBusy || !dupLop || !dupNgay} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{dupBusy ? 'Đang tạo…' : 'Tạo bản sao'}</button>
            </div>
          </div>
        </div>
      )}

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
