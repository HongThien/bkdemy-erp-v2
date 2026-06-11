import { useEffect, useMemo, useState } from 'react'
import { listTeam, listNhanSu, listMembershipByTeam, updateMembership, type Team, type NhanSu, type ThanhVienTeam } from '../../lib/nhansu'
import { Shell } from '../kho/ui'

const VAI_LABEL: Record<string, string> = { truong: 'Trưởng', pho: 'Phó', thanh_vien: 'Thành viên' }
const VAI_TONE: Record<string, string> = { truong: 'bg-indigo-600 text-white', pho: 'bg-indigo-100 text-indigo-700', thanh_vien: 'bg-slate-100 text-slate-500' }

// CSS cây org chart: stub dọc + thanh ngang nối anh em (kiểu family-tree).
const OC_CSS = `
.oc-kids{display:flex;align-items:flex-start;justify-content:center;position:relative}
.oc-kids::before{content:'';position:absolute;top:-16px;left:50%;width:1.5px;height:16px;background:#cbd5e1}
.oc-kids>.oc-branch{position:relative;padding:16px 10px 0}
.oc-kids>.oc-branch::before{content:'';position:absolute;top:0;left:50%;width:1.5px;height:16px;background:#cbd5e1}
.oc-kids>.oc-branch::after{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:#cbd5e1}
.oc-kids>.oc-branch:first-child::after{left:50%}
.oc-kids>.oc-branch:last-child::after{right:50%}
.oc-kids>.oc-branch:only-child::after{content:none}
.oc-branch{display:flex;flex-direction:column;align-items:center}
`

// Sơ đồ tổ chức per-team: thẻ bài dựng (ảnh + tên + vai), nối dây. Click thẻ → sửa vai/cấp trên.
export default function OrgChartScreen() {
  const [teams, setTeams] = useState<Team[]>([])
  const [teamId, setTeamId] = useState<string | null>(null)
  const [dsNhanSu, setDsNhanSu] = useState<NhanSu[]>([])
  const [mem, setMem] = useState<ThanhVienTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [sel, setSel] = useState<ThanhVienTeam | null>(null)

  useEffect(() => {
    Promise.all([listTeam(), listNhanSu()])
      .then(([t, ns]) => { setTeams(t); setDsNhanSu(ns); setTeamId((cur) => cur ?? t[0]?.id ?? null) })
      .catch((e) => setErr(e.message ?? String(e)))
  }, [])

  async function reloadMem(tid: string) {
    setLoading(true); setErr(null)
    try { setMem(await listMembershipByTeam(tid)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { if (teamId) reloadMem(teamId) }, [teamId])

  const nsById = useMemo(() => new Map(dsNhanSu.map((n) => [n.id, n])), [dsNhanSu])
  const inTeam = useMemo(() => new Set(mem.map((m) => m.nhan_su_id)), [mem])
  const roots = mem.filter((m) => !m.quan_ly_id || !inTeam.has(m.quan_ly_id))
    .sort((a, b) => (a.vai_tro === 'truong' ? 0 : a.vai_tro === 'pho' ? 1 : 2) - (b.vai_tro === 'truong' ? 0 : b.vai_tro === 'pho' ? 1 : 2))
  const childrenOf = (nsId: string) => mem.filter((m) => m.quan_ly_id === nsId)
  function descendants(nsId: string, acc = new Set<string>()): Set<string> {
    for (const c of childrenOf(nsId)) if (!acc.has(c.nhan_su_id)) { acc.add(c.nhan_su_id); descendants(c.nhan_su_id, acc) }
    return acc
  }

  function Card({ m }: { m: ThanhVienTeam }) {
    const ns = nsById.get(m.nhan_su_id)
    return (
      <button onClick={() => setSel(m)}
        className="w-28 overflow-hidden rounded-xl border border-slate-200 bg-white text-center shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
        {ns?.anh_url
          ? <img src={ns.anh_url} alt="" className="h-24 w-full object-cover" />
          : <div className="flex h-24 w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-500 text-3xl font-bold text-white">{ns?.ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? '?'}</div>}
        <div className="px-1.5 py-1.5">
          <div className="truncate text-[12px] font-semibold leading-tight text-slate-800">{ns?.ho_ten ?? '?'}</div>
          <div className="font-mono text-[10px] text-slate-400">{ns?.ma_ns ?? ''}</div>
          <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${VAI_TONE[m.vai_tro]}`}>{VAI_LABEL[m.vai_tro]}</span>
          {m.chuc_vu && <div className="mt-1 truncate rounded bg-amber-50 px-1 py-0.5 text-[10px] font-medium leading-tight text-amber-700" title={m.chuc_vu}>{m.chuc_vu}</div>}
        </div>
      </button>
    )
  }

  function Branch({ m }: { m: ThanhVienTeam }) {
    const kids = childrenOf(m.nhan_su_id)
    return (
      <div className="oc-branch">
        <Card m={m} />
        {kids.length > 0 && (
          <div className="oc-kids mt-4">
            {kids.map((k) => <Branch key={k.id} m={k} />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <style>{OC_CSS}</style>
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-3 text-sm font-semibold text-slate-900">Sơ đồ tổ chức</span>
        {teams.map((t) => (
          <button key={t.id} onClick={() => setTeamId(t.id)}
            className={`h-7 rounded-md px-2.5 text-xs font-semibold transition ${teamId === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
            {t.ten}
          </button>
        ))}
        <span className="ml-auto text-[12px] text-slate-400">Click thẻ để đổi vai trò / cấp trên</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-8">
        {err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : mem.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
              Team chưa có thành viên. Vào <b className="text-slate-600">Nhân sự</b> tick team cho từng người trước.
            </div>
          ) : (
            <div className="flex min-w-max justify-center gap-12">
              {roots.map((m) => <Branch key={m.id} m={m} />)}
            </div>
          )}
      </div>

      {sel && (
        <EditNode m={sel} nsById={nsById} mem={mem} inTeam={inTeam} cam={descendants(sel.nhan_su_id)}
          onClose={() => setSel(null)}
          onSaved={() => { setSel(null); if (teamId) reloadMem(teamId) }} />
      )}
    </div>
  )
}

function EditNode({ m, nsById, mem, inTeam, cam, onClose, onSaved }: {
  m: ThanhVienTeam; nsById: Map<string, NhanSu>; mem: ThanhVienTeam[]; inTeam: Set<string>; cam: Set<string>
  onClose: () => void; onSaved: () => void
}) {
  const [vai, setVai] = useState(m.vai_tro)
  const [ql, setQl] = useState(m.quan_ly_id && inTeam.has(m.quan_ly_id) ? m.quan_ly_id : '')
  const [chucVu, setChucVu] = useState(m.chuc_vu ?? '')
  const [busy, setBusy] = useState(false)
  const ns = nsById.get(m.nhan_su_id)
  async function save() {
    setBusy(true)
    try { await updateMembership(m.id, { vai_tro: vai, quan_ly_id: ql || null, chuc_vu: chucVu.trim() || null }); onSaved() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Shell title={`${ns?.ho_ten ?? '?'} · vị trí trong team`} onClose={onClose}>
      <div className="mb-3">
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-600">Vai trò</span>
        <div className="flex gap-1.5">
          {(['truong', 'pho', 'thanh_vien'] as const).map((v) => (
            <button key={v} onClick={() => setVai(v)}
              className={`h-9 flex-1 rounded-lg border text-sm font-semibold transition ${vai === v ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
              {VAI_LABEL[v]}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-600">Chức vụ (scope phụ trách — khác level)</span>
        <input value={chucVu} onChange={(e) => setChucVu(e.target.value)} placeholder="vd: Quản lý khối THCS / Quản lý khối tiểu học" className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm" />
      </div>
      <div className="mb-4">
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-600">Cấp trên trực tiếp</span>
        <select value={ql} onChange={(e) => setQl(e.target.value)} className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm">
          <option value="">— đỉnh team (không có cấp trên) —</option>
          {mem.filter((x) => x.nhan_su_id !== m.nhan_su_id && !cam.has(x.nhan_su_id)).map((x) => (
            <option key={x.nhan_su_id} value={x.nhan_su_id}>{nsById.get(x.nhan_su_id)?.ho_ten ?? '?'}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={save} disabled={busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu'}</button>
      </div>
    </Shell>
  )
}
