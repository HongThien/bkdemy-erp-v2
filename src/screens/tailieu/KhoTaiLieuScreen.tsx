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
  const [editEt, setEditEt] = useState<ETView | null>(null) // sửa ET tại chỗ (mở ETEditor)
  const [editGt, setEditGt] = useState<string | null>(null) // sửa giáo trình/BTVN (mở TaiLieuBuilder)
  const [editDeThi, setEditDeThi] = useState<string | null>(null) // sửa đề thi (mở DeThiEditor)
  const [editMT, setEditMT] = useState<string | null>(null) // sửa MT master (mở MTEditor)
  const [phBusy, setPhBusy] = useState<string | null>(null) // id doc đang phát hành
  const [phRes, setPhRes] = useState<{ ok: boolean; msg: string; skipped?: { ma_cau: string; warn: string }[] } | null>(null)
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
    try { const [d, l] = await Promise.all([listAllTaiLieu(), listLop()]); setRows(d as Row[]); setLops(l) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line

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
  async function doiTen(r: Row) {
    const ten = prompt('Đổi tên tài liệu (tên hiển thị trong kho):', r.ten)?.trim()
    if (!ten || ten === r.ten) return
    await updateTaiLieu(r.id, { ten })
    reload()
  }

  // Sửa tại chỗ: mở builder full-screen, đóng → tải lại bảng.
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
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[13px]">
                <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-2.5">Tên tài liệu</th>
                    <th className="px-3">Loại</th>
                    <th className="px-3">Khối</th>
                    <th className="px-3">Gắn buổi</th>
                    <th className="px-3">Ngày tạo</th>
                    <th className="px-3 text-right">Thao tác</th>
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
                          <button onClick={() => setDlDoc({ id: r.id, loai: r.loai })} className="rounded-md border border-indigo-300 px-2.5 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-50">⬇ Tải PDF</button>
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
        ? <ETPrintView id={print.id} onClose={() => setPrint(null)} />
        : print.loai === 'de_thi'
        ? <DeThiPrintView id={print.id} onClose={() => setPrint(null)} />
        : print.loai === 'mt' || print.loai === 'mt_buoi'
        ? <MTPrintView id={print.id} onClose={() => setPrint(null)} />
        : <PrintView id={print.id} onClose={() => setPrint(null)} />)}

      {/* Tải PDF THẲNG từ hàng (headless: dựng ẩn → tải → tự đóng), không mở preview. */}
      {dlDoc && (dlDoc.loai === 'et'
        ? <ETPrintView id={dlDoc.id} headless onClose={() => setDlDoc(null)} />
        : dlDoc.loai === 'de_thi'
        ? <DeThiPrintView id={dlDoc.id} headless onClose={() => setDlDoc(null)} />
        : dlDoc.loai === 'mt' || dlDoc.loai === 'mt_buoi'
        ? <MTPrintView id={dlDoc.id} headless onClose={() => setDlDoc(null)} />
        : <PrintView id={dlDoc.id} headless onClose={() => setDlDoc(null)} />)}

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
