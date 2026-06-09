import { useEffect, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { listTaiLieu, createTaiLieu, deleteTaiLieu, type TaiLieu } from '../../lib/tailieu'
import { Shell, Field, inp } from '../kho/ui'
import TaiLieuBuilder from './TaiLieuBuilder'

export default function TaiLieuScreen() {
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [list, setList] = useState<TaiLieu[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { setList(await listTaiLieu(khoi)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [khoi]) // eslint-disable-line

  if (openId) return <TaiLieuBuilder id={openId} onClose={() => { setOpenId(null); reload() }} />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Làm tài liệu</span>
        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-medium text-indigo-600">Giáo trình</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Khối</span>
          {KHOI_OPTIONS.map((k) => (
            <button key={k} onClick={() => setKhoi(k)} className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${khoi === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{k}</button>
          ))}
          <button onClick={() => setCreating(true)} className="ml-3 rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo giáo trình</button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có giáo trình khối {khoi}. Bấm <b className="text-slate-600">+ Tạo giáo trình</b>.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {list.map((t) => (
                <div key={t.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-[16px] font-semibold text-slate-900">{t.ten}</div>
                  <div className="mt-1 text-[12px] text-slate-400">Khối {t.khoi}{t.ma_chuyen_de ? ` · chuyên đề ${t.ma_chuyen_de}` : ''}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setOpenId(t.id)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500">Mở / Xuất</button>
                    <button onClick={async () => { if (confirm('Xoá giáo trình này?')) { await deleteTaiLieu(t.id); reload() } }} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {creating && <CreateModal khoi={khoi} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); reload(); setOpenId(id) }} />}
    </div>
  )
}

function CreateModal({ khoi, onClose, onCreated }: { khoi: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create() {
    if (!ten.trim()) return
    setBusy(true); setError(null)
    try { const tl = await createTaiLieu({ ten: ten.trim(), khoi }); onCreated(tl.id) }
    catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <Shell title={`Tạo giáo trình · Khối ${khoi}`} onClose={onClose}>
      <Field label="Tên giáo trình"><input value={ten} onChange={(e) => setTen(e.target.value)} className={inp} placeholder="vd: Ôn tập Phân số" autoFocus /></Field>
      <div className="mb-3 text-[11px] text-slate-400">Tạo xong vào Builder → bấm <b>+ Thêm chuyên đề</b> (thêm nhiều chuyên đề để gộp thành 1 tài liệu lớn).</div>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={create} disabled={!ten.trim() || busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
      </div>
    </Shell>
  )
}
