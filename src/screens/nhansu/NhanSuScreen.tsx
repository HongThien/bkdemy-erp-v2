import { useEffect, useRef, useState } from 'react'
import { listNhanSu, createNhanSu, updateNhanSu, deleteNhanSu, listTeam, listViTri, listNhanSuTeamMap, setTeamsOfNhanSu, listTaiKhoanMap, capTaiKhoan, goTaiKhoan, suggestMaNS, uploadAvatar, type NhanSu, type Team } from '../../lib/nhansu'
import { Shell, Field, inp, Seg, Actions } from '../kho/ui'

const TT_LABEL: Record<string, string> = { dang_lam: 'Đang làm', nghi: 'Nghỉ' }

export default function NhanSuScreen() {
  const [list, setList] = useState<NhanSu[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [teamOf, setTeamOf] = useState<Record<string, string[]>>({}) // nhan_su_id → [team ma] (suy từ GHẾ đang ngồi)
  const [bienChe, setBienChe] = useState<Record<string, string[]>>({}) // nhan_su_id → [team_id] BIÊN CHẾ (n-n)
  const [tkMap, setTkMap] = useState<Record<string, string>>({}) // nhan_su_id → email tài khoản
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [edit, setEdit] = useState<NhanSu | null | 'new'>(null)
  const [capTk, setCapTk] = useState<NhanSu | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [ns, tm, ghe, bc, tk] = await Promise.all([listNhanSu(), listTeam(), listViTri(), listNhanSuTeamMap(), listTaiKhoanMap()])
      setList(ns); setTeams(tm); setBienChe(bc); setTkMap(tk)
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
                <th className="px-3">Mã</th><th className="px-3">Họ tên</th><th className="px-3">SĐT</th><th className="px-3">Email</th><th className="px-3">Team</th><th className="px-3">Tài khoản</th><th className="px-3">Trạng thái</th><th></th>
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
                      <div className="flex flex-wrap items-center gap-1">
                        {/* team BIÊN CHẾ (chính, n-n) */}
                        {(bienChe[n.id] ?? []).map((tid) => <span key={tid} className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">{teams.find((t) => t.id === tid)?.ten ?? '?'}</span>)}
                        {(bienChe[n.id] ?? []).length === 0 && <span className="text-[12px] text-slate-300">chưa xếp team</span>}
                        {/* team theo VỊ TRÍ đang ngồi (phụ — chỉ hiện nếu NGOÀI biên chế) */}
                        {(teamOf[n.id] ?? []).filter((ma) => { const tid = teams.find((t) => t.ma === ma)?.id; return tid && !(bienChe[n.id] ?? []).includes(tid) })
                          .map((ma) => <span key={ma} title="đang giữ vị trí ở team này" className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">+{teams.find((t) => t.ma === ma)?.ten ?? ma}</span>)}
                      </div>
                    </td>
                    <td className="px-3">
                      {tkMap[n.id] !== undefined
                        ? <button title={`${tkMap[n.id]} — click để GỠ link (khi đã xóa user bên Auth Dashboard)`}
                            onClick={async () => { if (confirm(`Gỡ link tài khoản ${tkMap[n.id]} khỏi ${n.ho_ten}? (chỉ gỡ liên kết trong app — xóa account thật thì vào Auth Dashboard)`)) { await goTaiKhoan(n.id); reload() } }}
                            className="text-[12px] font-medium text-emerald-600 hover:text-rose-600">✓ có TK</button>
                        : <button onClick={() => setCapTk(n)} className="rounded border border-slate-200 px-2 py-0.5 text-[12px] font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-700">+ Cấp TK</button>}
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

      {edit && <EditModal nhanSu={edit === 'new' ? null : edit} teams={teams} teamIds={edit === 'new' ? [] : bienChe[edit.id] ?? []} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload() }} />}
      {capTk && <CapTkModal nhanSu={capTk} onClose={() => setCapTk(null)} onDone={() => { setCapTk(null); reload() }} />}
    </div>
  )
}

function Empty() {
  return <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có nhân sự. Bấm <b className="text-slate-600">+ Thêm nhân sự</b>.</div>
}

// Mật khẩu ngẫu nhiên dễ đọc (đưa tay cho NS, họ tự đổi sau nếu muốn).
function randPass(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzACDEFHJKLMNPQRSTUVWXYZ23456789'
  return Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => chars[b % chars.length]).join('')
}

// Cấp tài khoản đăng nhập NGAY TRÊN WEB (signUp bằng client phụ — admin không bị đá session).
function CapTkModal({ nhanSu, onClose, onDone }: { nhanSu: NhanSu; onClose: () => void; onDone: () => void }) {
  const [email, setEmail] = useState(nhanSu.email ?? '')
  const [pass, setPass] = useState(randPass())
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create() {
    setBusy(true); setError(null)
    try { await capTaiKhoan(nhanSu.id, email.trim(), pass); setOk(true) }
    catch (e: any) { setError(e.message ?? String(e)); setBusy(false) }
  }

  if (ok) return (
    <Shell title={`Đã cấp tài khoản · ${nhanSu.ho_ten}`} onClose={onDone}>
      <p className="mb-2 text-sm text-slate-600">Gửi thông tin này cho nhân sự (copy ngay — mật khẩu không hiện lại):</p>
      <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2.5 font-mono text-[13px] leading-6 text-slate-800">
        Email: <b>{email.trim()}</b><br />Mật khẩu: <b>{pass}</b>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => navigator.clipboard.writeText(`Email: ${email.trim()}\nMật khẩu: ${pass}`)} className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-indigo-300">📋 Copy</button>
        <button onClick={onDone} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">Xong</button>
      </div>
    </Shell>
  )
  return (
    <Shell title={`Cấp tài khoản · ${nhanSu.ho_ten}`} onClose={onClose}>
      <Field label="Email đăng nhập"><input value={email} onChange={(e) => setEmail(e.target.value)} className={inp} placeholder="email thật của nhân sự" autoFocus /></Field>
      <Field label="Mật khẩu (đã sinh sẵn — sửa được)">
        <div className="flex gap-1.5">
          <input value={pass} onChange={(e) => setPass(e.target.value)} className={`${inp} font-mono`} />
          <button onClick={() => setPass(randPass())} title="Sinh lại" className="shrink-0 rounded-md border border-slate-200 px-2.5 text-sm text-slate-500 hover:border-indigo-300">↻</button>
        </div>
      </Field>
      <p className="mb-2 text-[11px] text-slate-400">Tài khoản tạo xong tự gắn với nhân sự này — họ đăng nhập là vào được Hồ sơ của tôi.</p>
      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={create} disabled={!email.trim() || pass.length < 6 || busy} saving={busy} label="Tạo tài khoản" />
    </Shell>
  )
}

// Form = thông tin người + TEAM BIÊN CHẾ n-n (Thùy chốt: 1 NS thuộc NHIỀU team; làm filter cho Sơ đồ).
// VỊ TRÍ vẫn gán bên Sơ đồ tổ chức (vị trí sinh vị trí → đặt người vào).
function EditModal({ nhanSu, teams, teamIds, onClose, onSaved }: { nhanSu: NhanSu | null; teams: Team[]; teamIds: string[]; onClose: () => void; onSaved: () => void }) {
  const isNew = !nhanSu
  const [ho_ten, setHoTen] = useState(nhanSu?.ho_ten ?? '')
  const [ma_ns, setMaNs] = useState(nhanSu?.ma_ns ?? '')
  useEffect(() => { if (isNew) suggestMaNS().then(setMaNs).catch(() => {}) }, [isNew]) // đề xuất sẵn, sửa được
  const [sdt, setSdt] = useState(nhanSu?.so_dien_thoai ?? '')
  const [email, setEmail] = useState(nhanSu?.email ?? '')
  const [selTeams, setSelTeams] = useState<Set<string>>(new Set(teamIds))
  const toggleTeam = (id: string) => setSelTeams((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
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
      const id = isNew ? (await createNhanSu(patch)).id : nhanSu!.id
      if (!isNew) await updateNhanSu(id, patch)
      await setTeamsOfNhanSu(id, [...selTeams])
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
      <div className="mb-3">
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-600">Team (biên chế — chọn được NHIỀU)</span>
        <div className="flex flex-wrap gap-1.5">
          {teams.map((t) => (
            <button key={t.id} onClick={() => toggleTeam(t.id)}
              className={`h-8 rounded-lg border px-2.5 text-[13px] font-semibold transition ${selTeams.has(t.id) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
              {selTeams.has(t.id) ? '✓ ' : ''}{t.ten}
            </button>
          ))}
        </div>
      </div>
      <Field label="Trạng thái"><Seg options={['dang_lam', 'nghi'] as const} value={trang_thai} onChange={setTrangThai} render={(o) => TT_LABEL[o]} /></Field>
      <p className="mb-2 text-[11px] text-slate-400">VỊ TRÍ gán bên <b>Sơ đồ tổ chức</b> (tạo vị trí → đặt người vào) — team ở đây là biên chế, dùng lọc sẵn danh sách bên đó.{!isNew && <> · Xoá nhân sự: <button onClick={async () => { if (confirm('Xoá nhân sự này? (vị trí đang đảm nhiệm sẽ thành vị trí trống)')) { await deleteNhanSu(nhanSu!.id); onSaved() } }} className="text-rose-600 hover:underline">tại đây</button></>}</p>

      {error && <p className="mb-2 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={save} disabled={!ho_ten.trim() || selTeams.size === 0 || busy} saving={busy} label={isNew ? 'Tạo' : 'Lưu'} />
    </Shell>
  )
}
