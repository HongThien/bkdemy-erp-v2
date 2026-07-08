// Đề test đầu vào — chuẩn bị TRƯỚC (Ops/học thuật), theo khối+môn. Đổi định kỳ = tạo đề mới,
// đề cũ ngừng dùng nhưng GIỮ LỊCH SỬ (ca_test đã gán đề cũ vẫn đọc được — snapshot §A.2).
import { useEffect, useState } from 'react'
import {
  listDeTest, createDeTest, setDeTestActive, listDeTestCau, addDeTestCau, updateDeTestCau, deleteDeTestCau,
  type DeTest, type DeTestCau,
} from '../../lib/detest'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { MON_OPTIONS } from '../../lib/tuyensinh'

const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const Lbl = ({ children }: { children: React.ReactNode }) => <label className="mb-1 block text-[13px] font-medium text-slate-600">{children}</label>

export default function DeTestScreen() {
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [mon, setMon] = useState(MON_OPTIONS[0] as string)
  const [list, setList] = useState<DeTest[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  async function reload() { setLoading(true); try { setList(await listDeTest(khoi, mon)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [khoi, mon]) // eslint-disable-line

  return (
    <div className="h-full overflow-auto">
    <div className="mx-auto max-w-[900px] p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Đề test đầu vào</h2>
          <p className="text-[12px] text-slate-400">Chuẩn bị trước theo khối + môn. Đổi đề = tạo đề mới, đề cũ ngừng dùng nhưng giữ lịch sử.</p>
        </div>
        <button onClick={() => setForm(true)} className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo đề</button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select className={inputCls + ' w-auto'} value={khoi} onChange={(e) => setKhoi(e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}</select>
        <select className={inputCls + ' w-auto'} value={mon} onChange={(e) => setMon(e.target.value)}>{MON_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</select>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có đề nào cho khối {khoi} · {mon}.</div>
      ) : (
        <div className="grid gap-2.5">
          {list.map((d) => (
            <button key={d.id} onClick={() => setOpenId(d.id)} className={`flex items-center gap-2 rounded-xl border p-3.5 text-left shadow-sm transition hover:shadow-md ${d.active ? 'border-emerald-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-70'}`}>
              <div>
                <div className="text-[14px] font-semibold text-slate-800">{d.ten}</div>
                <div className="text-[12px] text-slate-400">Khối {d.khoi} · {d.mon} · {new Date(d.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
              <span className={`ml-auto rounded-full px-2.5 py-1 text-[11px] font-medium ${d.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{d.active ? 'Đang dùng' : 'Ngừng dùng'}</span>
            </button>
          ))}
        </div>
      )}

      {form && <TaoDeModal khoi={khoi} mon={mon} onClose={() => setForm(false)} onDone={async (id) => { setForm(false); await reload(); setOpenId(id) }} />}
      {openId && <DeDetail id={openId} onClose={() => setOpenId(null)} onChanged={reload} />}
    </div>
    </div>
  )
}

function TaoDeModal({ khoi, mon, onClose, onDone }: { khoi: string; mon: string; onClose: () => void; onDone: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  async function save() {
    if (!ten.trim()) { setErr('Nhập tên đề'); return }
    setBusy(true); setErr(null)
    try { const d = await createDeTest({ khoi, mon, ten: ten.trim() }); onDone(d.id) }
    catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-[440px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 text-[16px] font-semibold text-slate-800">Tạo đề — Khối {khoi} · {mon}</div>
        <Lbl>Tên đề</Lbl>
        <input className={inputCls} value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Đề test đầu vào K8 - đợt 1" autoFocus />
        {err && <p className="mt-1.5 text-[12px] text-rose-600">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={save} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang tạo…' : 'Tạo & thêm câu'}</button>
        </div>
      </div>
    </div>
  )
}

function DeDetail({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const [cau, setCau] = useState<DeTestCau[]>([])
  const [loading, setLoading] = useState(true)
  async function reload() { setLoading(true); try { setCau(await listDeTestCau(id)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [id]) // eslint-disable-line

  async function themCau() {
    await addDeTestCau(id, { nhan: `Câu ${cau.length + 1}`, diemToiDa: 1 })
    await reload()
  }
  async function sua(cauId: string, patch: Partial<{ nhan: string; diemToiDa: number; dapAn: string | null; maDang: string | null }>) {
    await updateDeTestCau(cauId, patch)
    setCau((s) => s.map((c) => (c.id === cauId ? { ...c, ...patch } : c)))
  }
  async function xoa(cauId: string) { if (!confirm('Xoá câu này khỏi đề?')) return; await deleteDeTestCau(cauId); await reload() }

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[88vh] w-full max-w-[720px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2">
          <div className="text-[16px] font-semibold text-slate-800">Câu trong đề</div>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <p className="mb-3 text-[12px] text-slate-400">Mỗi Ý = 1 câu (câu Đúng/Sai nhiều mệnh đề → tách thành nhiều dòng, mỗi dòng 1 dạng riêng nếu cần).</p>

        {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
          <div className="space-y-2">
            {cau.map((c) => (
              <div key={c.id} className="grid grid-cols-12 gap-2 rounded-lg border border-slate-100 p-2.5">
                <input className={inputCls + ' col-span-3'} value={c.nhan} onChange={(e) => sua(c.id, { nhan: e.target.value })} placeholder="Câu 1" />
                <input className={inputCls + ' col-span-2'} type="number" step="0.25" value={c.diemToiDa} onChange={(e) => sua(c.id, { diemToiDa: Number(e.target.value) })} placeholder="Điểm" />
                <input className={inputCls + ' col-span-4'} value={c.dapAn ?? ''} onChange={(e) => sua(c.id, { dapAn: e.target.value || null })} placeholder="Đáp án đối chiếu" />
                <input className={inputCls + ' col-span-2'} value={c.maDang ?? ''} onChange={(e) => sua(c.id, { maDang: e.target.value || null })} placeholder="Mã dạng" />
                <button onClick={() => xoa(c.id)} className="col-span-1 rounded-md text-[13px] text-rose-500 hover:bg-rose-50">✕</button>
              </div>
            ))}
            <button onClick={themCau} className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-[13px] font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600">+ Thêm câu</button>
          </div>
        )}

        <div className="mt-4 flex justify-between border-t border-slate-100 pt-3">
          <NgungDungBtn id={id} onChanged={onChanged} />
          <button onClick={onClose} className="rounded-lg bg-slate-800 px-4 py-2 text-[14px] font-medium text-white hover:bg-slate-700">Xong</button>
        </div>
      </div>
    </div>
  )
}

function NgungDungBtn({ id, onChanged }: { id: string; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  async function toggle(active: boolean) { setBusy(true); try { await setDeTestActive(id, active); onChanged() } finally { setBusy(false) } }
  return (
    <div className="flex gap-2">
      <button disabled={busy} onClick={() => toggle(true)} className="rounded-lg border border-emerald-200 px-3 py-2 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50">Đang dùng</button>
      <button disabled={busy} onClick={() => toggle(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50">Ngừng dùng</button>
    </div>
  )
}
