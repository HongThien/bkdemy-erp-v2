// Danh mục phòng — thêm/sửa/đóng phòng. Đóng = ẩn khỏi mọi nơi chọn phòng, KHÔNG xoá (tham chiếu
// TEXT không FK ở buoi_hoc/thoi_khoa_bieu → cấm xoá cứng, CLAUDE.md §2).
import { useEffect, useState } from 'react'
import { listPhong, createPhong, updatePhong, dongPhong, moLaiPhong, type Phong } from '../../lib/phong'
import { inp } from '../kho/ui'

type Form = { id?: string; ma_phong: string; ten_phong: string; suc_chua: string; thu_tu: string; ghi_chu: string }
const emptyForm: Form = { ma_phong: '', ten_phong: '', suc_chua: '', thu_tu: '', ghi_chu: '' }

export default function PhongScreen() {
  const [rows, setRows] = useState<Phong[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Form | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    try { setRows(await listPhong(true)) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm({ ...emptyForm, thu_tu: String((rows.reduce((m, r) => Math.max(m, r.thu_tu), 0) + 1)) }) }
  function openEdit(p: Phong) { setForm({ id: p.id, ma_phong: p.ma_phong, ten_phong: p.ten_phong, suc_chua: p.suc_chua != null ? String(p.suc_chua) : '', thu_tu: String(p.thu_tu), ghi_chu: p.ghi_chu ?? '' }) }

  async function save() {
    if (!form) return
    if (!form.ma_phong.trim() || !form.ten_phong.trim()) { alert('Nhập mã và tên phòng'); return }
    setBusy(true)
    try {
      const patch = { ma_phong: form.ma_phong.trim(), ten_phong: form.ten_phong.trim(), suc_chua: form.suc_chua ? Number(form.suc_chua) : null, thu_tu: Number(form.thu_tu) || 0, ghi_chu: form.ghi_chu.trim() || null }
      if (form.id) await updatePhong(form.id, patch)
      else await createPhong(patch)
      setForm(null); await load()
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }

  async function toggle(p: Phong) {
    if (!confirm(p.dang_hoat_dong ? `Đóng phòng ${p.ma_phong}? (ẩn khỏi mọi nơi chọn phòng, không mất dữ liệu cũ)` : `Mở lại phòng ${p.ma_phong}?`)) return
    try { await (p.dang_hoat_dong ? dongPhong(p.id) : moLaiPhong(p.id)); await load() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  return (
    <div className="h-full min-h-0 overflow-auto bg-[#f5f5f7] p-6">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[13px] text-slate-500">Đóng phòng = ẩn khỏi mọi nơi chọn phòng, không xoá dữ liệu cũ.</p>
          <button onClick={openNew} className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[14px] font-medium text-white hover:bg-indigo-500">+ Thêm phòng</button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-4 py-2.5 font-medium">Thứ tự</th>
                <th className="px-4 py-2.5 font-medium">Mã</th>
                <th className="px-4 py-2.5 font-medium">Tên</th>
                <th className="px-4 py-2.5 font-medium">Sức chứa</th>
                <th className="px-4 py-2.5 font-medium">Trạng thái</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">Đang tải…</td></tr> : rows.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-2.5 text-slate-500">{p.thu_tu}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-800">{p.ma_phong}</td>
                  <td className="px-4 py-2.5 text-slate-700">{p.ten_phong}</td>
                  <td className="px-4 py-2.5 text-slate-500">{p.suc_chua ?? '—'}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${p.dang_hoat_dong ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-100 text-slate-500 ring-slate-200'}`}>
                      {p.dang_hoat_dong ? 'Đang dùng' : 'Đã đóng'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => openEdit(p)} className="mr-2 text-indigo-600 hover:underline">Sửa</button>
                    <button onClick={() => toggle(p)} className="text-slate-500 hover:underline">{p.dang_hoat_dong ? 'Đóng' : 'Mở lại'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4" onClick={() => setForm(null)}>
          <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-[16px] font-semibold text-slate-800">{form.id ? 'Sửa phòng' : 'Thêm phòng'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-[12px] font-medium text-slate-600">Mã phòng *</label><input className={inp} value={form.ma_phong} onChange={(e) => setForm({ ...form, ma_phong: e.target.value })} placeholder="P101" /></div>
                <div><label className="mb-1 block text-[12px] font-medium text-slate-600">Tên hiển thị *</label><input className={inp} value={form.ten_phong} onChange={(e) => setForm({ ...form, ten_phong: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-[12px] font-medium text-slate-600">Sức chứa</label><input type="number" className={inp} value={form.suc_chua} onChange={(e) => setForm({ ...form, suc_chua: e.target.value })} /></div>
                <div><label className="mb-1 block text-[12px] font-medium text-slate-600">Thứ tự hiển thị</label><input type="number" className={inp} value={form.thu_tu} onChange={(e) => setForm({ ...form, thu_tu: e.target.value })} /></div>
              </div>
              <div><label className="mb-1 block text-[12px] font-medium text-slate-600">Ghi chú</label><input className={inp} value={form.ghi_chu} onChange={(e) => setForm({ ...form, ghi_chu: e.target.value })} /></div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setForm(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
              <button onClick={save} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang lưu…' : 'Lưu'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
