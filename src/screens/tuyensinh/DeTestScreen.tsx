// Đề test đầu vào — CHỌN 1 tài liệu CÓ SẴN trong Kho (mig 0092, đảo quyết định "gõ tay câu riêng"
// của bản đầu). de_test = con trỏ "đề đang dùng" của khối+môn; đổi đề = chọn tài liệu khác, đề cũ
// tự "Ngừng dùng" nhưng GIỮ LỊCH SỬ (ca_test đã gán đề cũ vẫn đọc được — snapshot §A.2).
// ⭐ Đề test đầu vào LUÔN TỒN TẠI, chỉ NỘI DUNG đổi theo kỳ (Thùy 07-10) — luồng chính hàng tháng là
// "Cập nhật nội dung" (sửa thẳng câu trong MT đang trỏ tới), KHÔNG phải tạo đề mới mỗi lần. "+ Đặt đề
// mới" chỉ dùng khi khối+môn CHƯA có đề, hoặc cố ý đổi hẳn sang 1 tài liệu MT khác.
import { useEffect, useState } from 'react'
import { listDeTest, datDeDangDung, setDeTestActive, type DeTest } from '../../lib/detest'
import { listAllTaiLieu, layCauTheoThuTu, type TaiLieu } from '../../lib/tailieu'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { MON_OPTIONS } from '../../lib/tuyensinh'
import { MTEditor } from '../tailieu/MTScreen'
import PrintView from '../tailieu/PrintView'
import ETPrintView from '../tailieu/ETPrintView'
import DeThiPrintView from '../tailieu/DeThiPrintView'
import MTPrintView from '../tailieu/MTPrintView'

const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const LOAI_TEN: Record<string, string> = { giao_trinh: 'Giáo trình', giao_trinh_buoi: 'Giáo trình buổi', btvn: 'BTVN', et: 'ET', de_thi: 'Đề thi', bo_tro: 'Tài liệu bổ trợ', mt: 'MT', mt_buoi: 'MT buổi' }
const loaiTen = (l: string) => LOAI_TEN[l] ?? l

export default function DeTestScreen() {
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [mon, setMon] = useState(MON_OPTIONS[0] as string)
  const [list, setList] = useState<DeTest[]>([])
  const [loading, setLoading] = useState(true)
  const [picking, setPicking] = useState(false)
  const [printDoc, setPrintDoc] = useState<{ id: string; loai: string } | null>(null)
  const [editingTaiLieuId, setEditingTaiLieuId] = useState<string | null>(null)

  async function reload() { setLoading(true); try { setList(await listDeTest(khoi, mon)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [khoi, mon]) // eslint-disable-line

  if (editingTaiLieuId) return <MTEditor id={editingTaiLieuId} onClose={() => { setEditingTaiLieuId(null); reload() }} />

  return (
    <div className="h-full overflow-auto">
    <div className="mx-auto max-w-[900px] p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Đề test đầu vào</h2>
          <p className="text-[12px] text-slate-400">Đề test luôn tồn tại cho mỗi khối+môn, chỉ nội dung đổi theo kỳ — dùng "✏️ Cập nhật nội dung" để sửa câu. "+ Đặt đề mới" chỉ dùng khi chưa có đề hoặc muốn đổi hẳn sang tài liệu khác.</p>
        </div>
        <button onClick={() => setPicking(true)} className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Đặt đề mới</button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select className={inputCls + ' w-auto'} value={khoi} onChange={(e) => setKhoi(e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}</select>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {MON_OPTIONS.map((m) => <button key={m} onClick={() => setMon(m)} className={`rounded-md px-3 py-1.5 text-[13px] font-medium ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{m}</button>)}
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có đề nào cho khối {khoi} · {mon}.</div>
      ) : (
        <div className="grid gap-2.5">
          {list.map((d) => <DeCard key={d.id} d={d} onPrint={() => setPrintDoc({ id: d.taiLieuId, loai: d.taiLieuLoai })} onEdit={() => setEditingTaiLieuId(d.taiLieuId)} onChanged={reload} />)}
        </div>
      )}

      {picking && (
        <ChonTaiLieuModal khoiMacDinh={khoi} monMacDinh={mon} onClose={() => setPicking(false)}
          onDone={async (dat) => { setPicking(false); setKhoi(dat.khoi); setMon(dat.mon) }} />
      )}
      {printDoc && (printDoc.loai === 'et'
        ? <ETPrintView id={printDoc.id} onClose={() => setPrintDoc(null)} />
        : printDoc.loai === 'de_thi'
        ? <DeThiPrintView id={printDoc.id} onClose={() => setPrintDoc(null)} />
        : printDoc.loai === 'mt' || printDoc.loai === 'mt_buoi'
        ? <MTPrintView id={printDoc.id} onClose={() => setPrintDoc(null)} />
        : <PrintView id={printDoc.id} onClose={() => setPrintDoc(null)} />)}
    </div>
    </div>
  )
}

function DeCard({ d, onPrint, onEdit, onChanged }: { d: DeTest; onPrint: () => void; onEdit: () => void; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  const [soCau, setSoCau] = useState<number | null>(null)
  useEffect(() => { layCauTheoThuTu(d.taiLieuId).then((c) => setSoCau(c.length)).catch(() => setSoCau(null)) }, [d.taiLieuId])
  async function toggle(active: boolean) { setBusy(true); try { await setDeTestActive(d.id, active); onChanged() } finally { setBusy(false) } }
  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-xl border p-3.5 shadow-sm ${d.active ? 'border-emerald-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-70'}`}>
      <div>
        <div className="text-[14px] font-semibold text-slate-800">{d.ten}</div>
        <div className="text-[12px] text-slate-400">
          📘 {d.taiLieuTen} <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{loaiTen(d.taiLieuLoai)}</span>
          {soCau != null && ` · ${soCau} câu`} · {new Date(d.createdAt).toLocaleDateString('vi-VN')}
        </div>
      </div>
      <span className={`ml-auto rounded-full px-2.5 py-1 text-[11px] font-medium ${d.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{d.active ? 'Đang dùng' : 'Ngừng dùng'}</span>
      {d.taiLieuLoai === 'mt' && <button onClick={onEdit} className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-[12px] font-medium text-violet-700 hover:bg-violet-100">✏️ Cập nhật nội dung</button>}
      <button onClick={onPrint} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">🖨 In đề</button>
      {d.active
        ? <button disabled={busy} onClick={() => toggle(false)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-500 hover:bg-slate-50">Ngừng dùng</button>
        : <button disabled={busy} onClick={() => toggle(true)} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[12px] font-medium text-emerald-700 hover:bg-emerald-50">Đặt lại làm đề đang dùng</button>}
    </div>
  )
}

// ── Chọn 1 tài liệu CÓ SẴN trong Kho làm đề — Môn + Khối chọn NGAY trong popup (không kế thừa ngầm
// từ màn ngoài), danh sách MẶC ĐỊNH chỉ MT (đề test hầu như luôn là MT) — gõ tìm tên mới mở rộng mọi
// loại tài liệu (Thùy 07-10: "đề test đầu vào không bao giờ là ET/Giáo trình/BTVN, gần như sẽ là MT").
function ChonTaiLieuModal({ khoiMacDinh, monMacDinh, onClose, onDone }: { khoiMacDinh: string; monMacDinh: string; onClose: () => void; onDone: (dat: { khoi: string; mon: string }) => void }) {
  const [mon, setMon] = useState(monMacDinh)
  const [khoi, setKhoi] = useState(khoiMacDinh)
  const [all, setAll] = useState<TaiLieu[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<TaiLieu | null>(null)
  const [ten, setTen] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { setLoading(true); setPicked(null); listAllTaiLieu(mon).then(setAll).finally(() => setLoading(false)) }, [mon])
  const dangTim = !!q.trim()
  const filtered = all.filter((t) => t.khoi === khoi && (dangTim || t.loai === 'mt') && (!dangTim || t.ten.toLowerCase().includes(q.trim().toLowerCase())))

  function chon(t: TaiLieu) { setPicked(t); setTen(`Đề test đầu vào K${khoi} · ${mon} — ${t.ten}`) }
  async function xacNhan() {
    if (!picked || !ten.trim()) return
    setBusy(true); setErr(null)
    try { await datDeDangDung({ khoi, mon, ten: ten.trim(), taiLieuId: picked.id }); onDone({ khoi, mon }) }
    catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }

  if (picked) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
        <div className="w-full max-w-[480px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="mb-3 text-[16px] font-semibold text-slate-800">Đặt làm đề đang dùng — Khối {khoi} · {mon}</div>
          <p className="mb-3 text-[13px] text-slate-500">📘 {picked.ten} <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{loaiTen(picked.loai)}</span></p>
          <label className="mb-1 block text-[13px] font-medium text-slate-600">Tên nhãn (Ops tự đặt)</label>
          <input className={inputCls} value={ten} onChange={(e) => setTen(e.target.value)} autoFocus />
          {err && <p className="mt-1.5 text-[12px] text-rose-600">{err}</p>}
          <div className="mt-4 flex justify-between">
            <button onClick={() => setPicked(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">← Chọn tài liệu khác</button>
            <button onClick={xacNhan} disabled={busy || !ten.trim()} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang đặt…' : 'Xác nhận'}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-slate-100 p-5">
          <div className="mb-1 text-[16px] font-semibold text-slate-800">Đặt đề mới</div>
          <p className="mb-3 text-[12px] text-slate-400">Chỉ dùng khi khối+môn CHƯA có đề, hoặc cố ý đổi hẳn sang tài liệu khác — đổi định kỳ nên dùng "✏️ Cập nhật nội dung" ở đề đang có.</p>
          <label className="mb-1 block text-[12px] font-medium text-slate-600">Môn</label>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {MON_OPTIONS.map((m) => (
              <button key={m} type="button" onClick={() => setMon(m)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium ${mon === m ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${mon === m ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300'}`}>{mon === m ? '✓' : ''}</span>
                {m}
              </button>
            ))}
          </div>
          <label className="mb-1 block text-[12px] font-medium text-slate-600">Khối</label>
          <select className={inputCls + ' mb-3 w-auto'} value={khoi} onChange={(e) => setKhoi(e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}</select>
          <label className="mb-1 block text-[12px] font-medium text-slate-600">Tên tài liệu (tìm trong Kho — Khối {khoi} · {mon})</label>
          <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mặc định chỉ hiện MT — gõ tên để tìm cả loại khác…" autoFocus />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {loading ? <p className="p-4 text-sm text-slate-400">Đang tải…</p> : filtered.length === 0 ? (
            <p className="p-4 text-sm text-slate-400">{dangTim ? 'Không tìm thấy tài liệu khớp.' : `Khối ${khoi} · ${mon} chưa có MT nào trong Kho — gõ tên để tìm loại tài liệu khác.`}</p>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((t) => (
                <button key={t.id} onClick={() => chon(t)} className="flex w-full items-center gap-2 rounded-lg border border-slate-100 p-2.5 text-left hover:border-indigo-300 hover:bg-indigo-50/40">
                  <span className="min-w-0 flex-1 truncate text-[13px] text-slate-700">{t.ten}</span>
                  <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{loaiTen(t.loai)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end border-t border-slate-100 p-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
      </div>
    </div>
  )
}
