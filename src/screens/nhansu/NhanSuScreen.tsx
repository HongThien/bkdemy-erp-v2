import { useEffect, useRef, useState } from 'react'
import { listNhanSu, createNhanSu, updateNhanSu, deleteNhanSu, listTeam, listViTri, suggestMaNS, uploadAvatar, type NhanSu, type Team } from '../../lib/nhansu'
import { Shell, Field, inp, Seg, Actions } from '../kho/ui'

const TT_LABEL: Record<string, string> = { dang_lam: 'Đang làm', nghi: 'Nghỉ' }

export default function NhanSuScreen() {
  const [list, setList] = useState<NhanSu[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [teamOf, setTeamOf] = useState<Record<string, string[]>>({}) // nhan_su_id → [team ma] (suy từ GHẾ đang ngồi)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [edit, setEdit] = useState<NhanSu | null | 'new'>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [ns, tm, ghe] = await Promise.all([listNhanSu(), listTeam(), listViTri()])
      setList(ns); setTeams(tm)
      const tmById = new Map(tm.map((t) => [t.id, t.ma]))
      const map: Record<string, string[]> = {}
      for (const g of ghe) {
        if (!g.nhan_su_id) continue
        const ma = tmById.get(g.team_id); if (!ma) continue
        const arr = (map[g.nhan_su_id] ??= [])
        if (!arr.includes(ma)) arr.push(ma)
      }
      setTeamOf(map)
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Nhân sự</span>
        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-medium text-indigo-600">{list.length} người</span>
        <button onClick={() => setEdit('new')} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Thêm nhân sự</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : list.length === 0 ? <Empty />
          : (
            <table className="w-full border-separate border-spacing-y-1.5 text-sm">
              <thead><tr className="text-left text-[12px] uppercase tracking-wider text-slate-400">
                <th className="px-3">Mã</th><th className="px-3">Họ tên</th><th className="px-3">SĐT</th><th className="px-3">Email</th><th className="px-3">Team (theo vị trí)</th><th className="px-3">Trạng thái</th><th></th>
              </tr></thead>
              <tbody>
                {list.map((n) => (
                  <tr key={n.id} className="bg-white shadow-sm">
                    <td className="rounded-l-lg px-3 py-2.5 font-mono text-[12px] text-indigo-600">{n.ma_ns ?? '—'}</td>
                    <td className="px-3 font-medium text-slate-800">
                      <span className="flex items-center gap-2">
                        {n.anh_url
                          ? <img src={n.anh_url} alt="" className="h-7 w-7 rounded-lg object-cover" />
                          : <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 text-[12px] font-bold text-white">{n.ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase()}</span>}
                        {n.ho_ten}
                      </span>
                    </td>
                    <td className="px-3 text-slate-500">{n.so_dien_thoai ?? '—'}</td>
                    <td className="px-3 text-slate-500">{n.email ?? '—'}</td>
                    <td className="px-3">
                      <div className="flex flex-wrap gap-1">
                        {(teamOf[n.id] ?? []).map((ma) => <span key={ma} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">{teams.find((t) => t.ma === ma)?.ten ?? ma}</span>)}
                        {(teamOf[n.id] ?? []).length === 0 && <span className="text-[12px] text-slate-300">chưa có vị trí</span>}
                      </div>
                    </td>
                    <td className="px-3"><span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${n.trang_thai === 'dang_lam' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{TT_LABEL[n.trang_thai]}</span></td>
                    <td className="rounded-r-lg px-3 text-right">
                      <button onClick={() => setEdit(n)} className="text-[13px] text-indigo-600 hover:underline">Sửa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {edit && <EditModal nhanSu={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload() }} />}
    </div>
  )
}

function Empty() {
  return <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có nhân sự. Bấm <b className="text-slate-600">+ Thêm nhân sự</b>.</div>
}

// Form = chỉ THÔNG TIN NGƯỜI. Ghế/team gán ở Sơ đồ tổ chức (ghế sinh ghế → đặt người vào ghế).
function EditModal({ nhanSu, onClose, onSaved }: { nhanSu: NhanSu | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !nhanSu
  const [ho_ten, setHoTen] = useState(nhanSu?.ho_ten ?? '')
  const [ma_ns, setMaNs] = useState(nhanSu?.ma_ns ?? '')
  useEffect(() => { if (isNew) suggestMaNS().then(setMaNs).catch(() => {}) }, [isNew]) // đề xuất sẵn, sửa được
  const [sdt, setSdt] = useState(nhanSu?.so_dien_thoai ?? '')
  const [email, setEmail] = useState(nhanSu?.email ?? '')
  const [trang_thai, setTrangThai] = useState<NhanSu['trang_thai']>(nhanSu?.trang_thai ?? 'dang_lam')
  const [anh_url, setAnhUrl] = useState(nhanSu?.anh_url ?? '')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    if (!ho_ten.trim()) return
    setBusy(true); setError(null)
    try {
      const patch = { ho_ten: ho_ten.trim(), so_dien_thoai: sdt.trim() || null, email: email.trim() || null, trang_thai, anh_url: anh_url || null, ...(ma_ns.trim() ? { ma_ns: ma_ns.trim() } : {}) }
      if (isNew) await createNhanSu(patch)
      else await updateNhanSu(nhanSu!.id, patch)
      onSaved()
    } catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <Shell title={isNew ? 'Thêm nhân sự' : `Sửa · ${nhanSu!.ho_ten}`} onClose={onClose}>
      {/* Ảnh đại diện */}
      <div className="mb-4 flex items-center gap-3">
        {anh_url
          ? <img src={anh_url} alt="" className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />
          : <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-xl font-bold text-white">{ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? '?'}</div>}
        <div>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-40">
            {uploading ? 'Đang tải…' : anh_url ? 'Đổi ảnh' : '+ Ảnh đại diện'}
          </button>
          {anh_url && <button onClick={() => setAnhUrl('')} className="ml-2 text-[12px] text-slate-400 hover:text-rose-600">gỡ</button>}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0]; e.target.value = ''
            if (!f) return
            setUploading(true)
            try { setAnhUrl(await uploadAvatar(f)) } catch (er: any) { setError(er.message ?? String(er)) } finally { setUploading(false) }
          }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <Field label="Họ tên"><input value={ho_ten} onChange={(e) => setHoTen(e.target.value)} className={inp} autoFocus /></Field>
        <Field label="Mã NS"><input value={ma_ns} onChange={(e) => setMaNs(e.target.value)} className={`${inp} font-mono`} /></Field>
        <Field label="Số điện thoại"><input value={sdt} onChange={(e) => setSdt(e.target.value)} className={inp} /></Field>
        <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} className={inp} /></Field>
      </div>
      <Field label="Trạng thái"><Seg options={['dang_lam', 'nghi'] as const} value={trang_thai} onChange={setTrangThai} render={(o) => TT_LABEL[o]} /></Field>
      <p className="mb-2 text-[11px] text-slate-400">Team/vị trí KHÔNG gán ở đây — vào <b>Sơ đồ tổ chức</b> tạo vị trí rồi đặt người vào.{!isNew && <> · Xoá nhân sự: <button onClick={async () => { if (confirm('Xoá nhân sự này? (vị trí đang đảm nhiệm sẽ thành vị trí trống)')) { await deleteNhanSu(nhanSu!.id); onSaved() } }} className="text-rose-600 hover:underline">tại đây</button></>}</p>

      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={save} disabled={!ho_ten.trim() || busy} saving={busy} label={isNew ? 'Tạo' : 'Lưu'} />
    </Shell>
  )
}
