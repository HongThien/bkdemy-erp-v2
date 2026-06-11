import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { listNhanSu, createNhanSu, updateNhanSu, deleteNhanSu, listTeam, listMembership, setMembership, suggestMaNS, uploadAvatar, type NhanSu, type Team, type ThanhVienTeam } from '../../lib/nhansu'
import { Shell, Field, inp, Seg, Actions } from '../kho/ui'

const TT_LABEL: Record<string, string> = { dang_lam: 'Đang làm', nghi: 'Nghỉ' }

export default function NhanSuScreen() {
  const [list, setList] = useState<NhanSu[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [teamOf, setTeamOf] = useState<Record<string, string[]>>({}) // nhan_su_id → [team ma]
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [edit, setEdit] = useState<NhanSu | null | 'new'>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [ns, tm] = await Promise.all([listNhanSu(), listTeam()])
      setList(ns); setTeams(tm)
      // map team badges (1 query gộp)
      const tmById = new Map(tm.map((t) => [t.id, t.ma]))
      const all = await Promise.all(ns.map((n) => listMembership(n.id)))
      const map: Record<string, string[]> = {}
      ns.forEach((n, i) => { map[n.id] = all[i].map((m) => tmById.get(m.team_id) ?? '').filter(Boolean) })
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
                <th className="px-3">Mã</th><th className="px-3">Họ tên</th><th className="px-3">SĐT</th><th className="px-3">Email</th><th className="px-3">Team</th><th className="px-3">Trạng thái</th><th></th>
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
                        {(teamOf[n.id] ?? []).length === 0 && <span className="text-[12px] text-slate-300">—</span>}
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

      {edit && <EditModal nhanSu={edit === 'new' ? null : edit} teams={teams} dsNhanSu={list} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload() }} />}
    </div>
  )
}

function Empty() {
  return <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có nhân sự. Bấm <b className="text-slate-600">+ Thêm nhân sự</b>.</div>
}

// 1 dòng membership trong form (local state — new: ghi lúc Tạo; sửa: ghi lúc Lưu)
type MemDraft = { team_id: string; vai_tro: ThanhVienTeam['vai_tro']; quan_ly_id: string | null }

function EditModal({ nhanSu, teams, onClose, onSaved }: { nhanSu: NhanSu | null; teams: Team[]; dsNhanSu: NhanSu[]; onClose: () => void; onSaved: () => void }) {
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
  // Draft membership: chọn ngay trong form (cả new lẫn sửa), bấm Tạo/Lưu mới ghi DB 1 mạch.
  const [mem, setMem] = useState<MemDraft[]>([])
  useEffect(() => {
    if (nhanSu) listMembership(nhanSu.id).then((rows) => setMem(rows.map((r) => ({ team_id: r.team_id, vai_tro: r.vai_tro, quan_ly_id: r.quan_ly_id })))).catch(() => {})
  }, [nhanSu])

  const memOf = (teamId: string) => mem.find((m) => m.team_id === teamId)
  const toggleTeam = (teamId: string, on: boolean) =>
    setMem((p) => on ? [...p, { team_id: teamId, vai_tro: 'thanh_vien', quan_ly_id: null }] : p.filter((m) => m.team_id !== teamId))

  async function save() {
    if (!ho_ten.trim()) return
    setBusy(true); setError(null)
    try {
      const patch = { ho_ten: ho_ten.trim(), so_dien_thoai: sdt.trim() || null, email: email.trim() || null, trang_thai, anh_url: anh_url || null, ...(ma_ns.trim() ? { ma_ns: ma_ns.trim() } : {}) }
      const id = isNew ? (await createNhanSu(patch)).id : nhanSu!.id
      if (!isNew) await updateNhanSu(id, patch)
      // sync membership: upsert các team đã chọn, gỡ team bỏ chọn
      const before = isNew ? [] : await listMembership(id)
      for (const m of mem) await setMembership(id, m.team_id, true, m.vai_tro, m.quan_ly_id)
      for (const b of before) if (!mem.some((m) => m.team_id === b.team_id)) await setMembership(id, b.team_id, false)
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
        <Field label="Trạng thái"><Seg options={['dang_lam', 'nghi'] as const} value={trang_thai} onChange={setTrangThai} render={(o) => TT_LABEL[o]} /></Field>
        <Field label="Số điện thoại"><input value={sdt} onChange={(e) => setSdt(e.target.value)} className={inp} /></Field>
        <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} className={inp} /></Field>
      </div>

      <div className="mb-3">
        <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Thuộc team</div>
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-slate-200 p-2">
          {teams.map((t) => {
            const m = memOf(t.id)
            return (
              <label key={t.id} className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 ${m ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                <input type="checkbox" checked={!!m} onChange={(e) => toggleTeam(t.id, e.target.checked)} />
                <span className="text-[13px] font-medium text-slate-700">{t.ten}</span>
              </label>
            )
          })}
        </div>
        <p className="mt-1 text-[11px] text-slate-400">Phân cấp (trưởng/phó, ai dưới ai) chỉnh ở <b>Sơ đồ tổ chức</b>.{!isNew && <> · Xoá nhân sự: <button onClick={async () => { if (confirm('Xoá nhân sự này?')) { await deleteNhanSu(nhanSu!.id); onSaved() } }} className="text-rose-600 hover:underline">tại đây</button></>}</p>
      </div>

      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={save} disabled={!ho_ten.trim() || busy} saving={busy} label={isNew ? 'Tạo' : 'Lưu'} />
    </Shell>
  )
}
