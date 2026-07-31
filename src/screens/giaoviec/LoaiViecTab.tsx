// TAB LOẠI VIỆC (registry §6) — bảng định lượng khối lượng khách quan (loại × cỡ).
import { useEffect, useState } from 'react'
import { listLoaiViec, createLoaiViec, updateLoaiViec, type LoaiViec, type MucKhoiLuong } from '../../lib/giaoviec'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Empty, ErrBar, Modal, Field } from './ui'

export default function LoaiViecTab() {
  const [rows, setRows] = useState<LoaiViec[]>([])
  const [loading, setLoading] = useState(true); const [err, setErr] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  async function reload() {
    setLoading(true); setErr(null)
    try { setRows(await listLoaiViec(false)) } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <ErrBar msg={err} />
      <button onClick={() => setShowNew(true)} className={CX_BTN}>+ Loại việc mới</button>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : !rows.length ? <Empty>Chưa có loại việc nào — tạo bảng định lượng để chọn khối lượng lúc giao.</Empty> : (
        <div className="space-y-2">
          {rows.map((lv) => (
            <div key={lv.id} className={`rounded-2xl bg-white p-4 shadow-sm ${!lv.active ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{lv.ten}</span>
                <button onClick={() => updateLoaiViec(lv.id, { active: !lv.active }).then(reload)} className="ml-auto text-[12px] text-slate-400 hover:text-indigo-600">{lv.active ? 'Ẩn' : 'Kích hoạt lại'}</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lv.thang_kl.map((m) => <span key={m.ma} className="rounded bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 ring-1 ring-slate-200">{m.ten}: {m.kl}</span>)}
                {!lv.thang_kl.length && <span className="text-[11px] italic text-slate-400">Chưa có mức khối lượng</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      {showNew && <LoaiViecModal onClose={() => setShowNew(false)} onDone={() => { setShowNew(false); reload() }} />}
    </div>
  )
}

function LoaiViecModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [ten, setTen] = useState('')
  const [thangKl, setThangKl] = useState<MucKhoiLuong[]>([{ ma: 'nho', ten: 'Nhỏ', kl: 1 }, { ma: 'vua', ten: 'Vừa', kl: 2 }, { ma: 'lon', ten: 'Lớn', kl: 4 }])
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)
  function upd(i: number, patch: Partial<MucKhoiLuong>) { setThangKl((r) => r.map((x, idx) => idx === i ? { ...x, ...patch } : x)) }
  async function submit() {
    if (!ten.trim()) { setErr('Cần tên.'); return }
    setSaving(true); setErr(null)
    try { await createLoaiViec({ ten: ten.trim(), thang_kl: thangKl.filter((m) => m.ten.trim()) }); onDone() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }
  return (
    <Modal title="Loại việc mới" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Tên"><input value={ten} onChange={(e) => setTen(e.target.value)} className={CX_INPUT} placeholder="VD: Soạn tài liệu" /></Field>
        <Field label="Bảng định lượng (mức → khối lượng)">
          <div className="space-y-1.5">
            {thangKl.map((m, i) => (
              <div key={i} className="flex gap-1.5">
                <input value={m.ten} onChange={(e) => upd(i, { ten: e.target.value, ma: e.target.value.toLowerCase().replace(/\s+/g, '_') || `muc${i}` })} className={`${CX_INPUT} flex-1`} placeholder="Tên mức" />
                <input type="number" value={m.kl} onChange={(e) => upd(i, { kl: Number(e.target.value) })} className={`${CX_INPUT} w-24`} placeholder="KL" />
                <button onClick={() => setThangKl((r) => r.filter((_, idx) => idx !== i))} className="rounded-lg border border-slate-300 px-2 text-slate-400 hover:text-rose-600">✕</button>
              </div>
            ))}
            <button onClick={() => setThangKl((r) => [...r, { ma: `muc${r.length}`, ten: '', kl: 1 }])} className="text-[12px] font-medium text-indigo-600 hover:underline">+ Thêm mức</button>
          </div>
        </Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button><button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? '…' : 'Tạo'}</button></div>
      </div>
    </Modal>
  )
}
