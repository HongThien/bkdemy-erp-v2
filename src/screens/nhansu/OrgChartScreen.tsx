import { useEffect, useMemo, useState } from 'react'
import { listTeam, listNhanSu, listViTri, createViTri, updateViTri, deleteViTri, listNhanSuTeamMap, listNhanSuMonMap, type Team, type NhanSu, type ViTri } from '../../lib/nhansu'
import { MON_LIST } from '../../lib/mon'
import { listRoles, setViTriRole, type VaiTroFull } from '../../lib/quyen'
import { Shell, Field, inp } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'

// Team CHUYÊN MÔN → mỗi môn 1 cây độc lập (ghế gắn mon). Còn lại (ops/media/marketing) = LIÊN-MÔN (mon=null).
const CHUYEN_MON_TEAMS = ['gv', 'ta', 'hoc_thuat']
const CAP_LABEL: Record<string, string> = { truong: 'Trưởng', pho: 'Phó', thanh_vien: 'Thành viên' }
const CAP_TONE: Record<string, string> = { truong: 'bg-indigo-600 text-white', pho: 'bg-indigo-100 text-indigo-700', thanh_vien: 'bg-slate-100 text-slate-500' }

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

// Sơ đồ tổ chức = CÂY GHẾ (vị trí). Ghế sinh ghế; người chỉ là kẻ được đặt vào ghế (trống vẫn hiện).
export default function OrgChartScreen() {
  const [teams, setTeams] = useState<Team[]>([])
  const [teamId, setTeamId] = useState<string | null>(null)
  const [dsNhanSu, setDsNhanSu] = useState<NhanSu[]>([])
  const [bienChe, setBienChe] = useState<Record<string, string[]>>({}) // nhan_su_id → [team_id] biên chế
  const [monOf, setMonOf] = useState<Record<string, string[]>>({}) // nhan_su_id → [mon] (lọc ứng viên theo môn)
  const [roles, setRoles] = useState<VaiTroFull[]>([]) // vai trò (gán cho ghế → quyền lúc login)
  const [ghe, setGhe] = useState<ViTri[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [sel, setSel] = useState<ViTri | null>(null)
  const [mon, setMon] = useState<string>(MON_LIST[0]) // môn đang xem (chỉ cho team chuyên môn)

  useEffect(() => {
    Promise.all([listTeam(), listNhanSu(), listNhanSuTeamMap(), listNhanSuMonMap(), listRoles()])
      .then(([t, ns, bc, mn, rl]) => { setTeams(t); setDsNhanSu(ns); setBienChe(bc); setMonOf(mn); setRoles(rl); setTeamId((cur) => cur ?? t[0]?.id ?? null) })
      .catch((e) => setErr(e.message ?? String(e)))
  }, [])

  async function reloadGhe(tid: string) {
    setLoading(true); setErr(null)
    try { setGhe(await listViTri(tid)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { if (teamId) reloadGhe(teamId) }, [teamId])

  const nsById = useMemo(() => new Map(dsNhanSu.map((n) => [n.id, n])), [dsNhanSu])
  const roleById = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles])
  const team = teams.find((t) => t.id === teamId)
  const isChuyenMon = !!team && CHUYEN_MON_TEAMS.includes(team.ma)
  // Team chuyên môn → mỗi môn 1 cây độc lập: chỉ hiện ghế của môn đang chọn. Liên-môn → hiện tất (mon null).
  const gheView = isChuyenMon ? ghe.filter((g) => g.mon === mon) : ghe
  const gheIds = useMemo(() => new Set(gheView.map((g) => g.id)), [gheView])
  const roots = gheView.filter((g) => !g.cha_id || !gheIds.has(g.cha_id))
    .sort((a, b) => (a.cap === 'truong' ? 0 : a.cap === 'pho' ? 1 : 2) - (b.cap === 'truong' ? 0 : b.cap === 'pho' ? 1 : 2))
  const childrenOf = (gheId: string) => gheView.filter((g) => g.cha_id === gheId)
  function descendants(gheId: string, acc = new Set<string>()): Set<string> {
    for (const c of childrenOf(gheId)) if (!acc.has(c.id)) { acc.add(c.id); descendants(c.id, acc) }
    return acc
  }

  async function themGheGoc() {
    if (!teamId) return
    await createViTri({ team_id: teamId, ten: null, cap: 'truong', cha_id: null, nhan_su_id: null, mon: isChuyenMon ? mon : null })
    reloadGhe(teamId)
  }

  function Card({ g }: { g: ViTri }) {
    const ns = g.nhan_su_id ? nsById.get(g.nhan_su_id) : null
    const trong = !ns
    const role = g.vai_tro_id ? roleById.get(g.vai_tro_id) : null
    return (
      <button onClick={() => setSel(g)}
        className={`relative w-32 overflow-hidden rounded-xl border text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
          trong ? 'border-dashed border-slate-300 bg-slate-50/60 hover:border-indigo-400' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
        {/* Quyền: ghế chưa gán role → người ngồi đăng nhập KHÔNG thấy màn nào */}
        {g.vai_tro_id
          ? <span title={`Quyền: ${role?.ten ?? '?'}`} className="absolute left-1 top-1 z-10 max-w-[7rem] truncate rounded bg-indigo-600/90 px-1.5 py-0.5 text-[9px] font-semibold text-white">{role?.ten ?? 'role'}</span>
          : <span title="Chưa gán quyền (role) — người ngồi ghế này đăng nhập sẽ không thấy màn nào. Bấm để gán." className="absolute left-1 top-1 z-10 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-semibold text-white">⚠ chưa quyền</span>}
        {ns?.anh_url
          ? <img src={ns.anh_url} alt="" className="h-28 w-full object-cover" />
          : ns
            ? <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-500 text-3xl font-bold text-white">{ns.ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase()}</div>
            : <div className="flex h-28 w-full items-center justify-center bg-slate-100 text-3xl text-slate-300">＋</div>}
        {/* vùng chữ CHIỀU CAO CỐ ĐỊNH + canh giữa → mọi thẻ bằng nhau, không lệch */}
        <div className="flex h-[78px] flex-col items-center justify-center gap-1 px-1.5">
          {/* GHẾ là chính: chức vụ nổi nhất, cắt tối đa 2 dòng */}
          <div className="line-clamp-2 text-[12px] font-semibold leading-tight text-slate-800">{g.ten || <span className="italic text-slate-400">Chưa đặt tên</span>}</div>
          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${CAP_TONE[g.cap]}`}>{CAP_LABEL[g.cap]}</span>
          {/* người ngồi (phụ) */}
          {ns
            ? <div className="line-clamp-1 leading-tight"><span className="text-[11px] font-medium text-slate-600">{ns.ho_ten}</span> <span className="font-mono text-[9px] text-slate-400">{ns.ma_ns}</span></div>
            : <div className="text-[11px] font-medium text-amber-600">Vị trí trống</div>}
        </div>
      </button>
    )
  }

  function Branch({ g }: { g: ViTri }) {
    const kids = childrenOf(g.id)
    return (
      <div className="oc-branch">
        <Card g={g} />
        {kids.length > 0 && (
          <div className="oc-kids mt-4">
            {kids.map((k) => <Branch key={k.id} g={k} />)}
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
        {/* Bộ chọn MÔN — chỉ team chuyên môn (mỗi môn 1 cây độc lập) */}
        {isChuyenMon && (
          <>
            <span className="mx-1 h-5 w-px self-center bg-slate-200" />
            <div className="flex gap-0.5 rounded-lg bg-violet-50 p-0.5">
              {MON_LIST.map((m) => (
                <button key={m} onClick={() => setMon(m)}
                  className={`h-6 rounded-md px-2.5 text-xs font-semibold transition ${mon === m ? 'bg-violet-600 text-white shadow-sm' : 'text-violet-600 hover:bg-violet-100'}`}>
                  {m}
                </button>
              ))}
            </div>
          </>
        )}
        <button onClick={themGheGoc} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Vị trí gốc {isChuyenMon ? `(${mon})` : ''}</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-8">
        {err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : gheView.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
              {isChuyenMon ? <>Môn <b className="text-violet-600">{mon}</b> chưa có vị trí.</> : 'Team chưa có vị trí.'} Bấm <b className="text-slate-600">+ Vị trí gốc</b> để dựng cây (vị trí sinh vị trí), rồi đặt người vào.
            </div>
          ) : (
            <div className="flex min-w-max justify-center gap-12">
              {roots.map((g) => <Branch key={g.id} g={g} />)}
            </div>
          )}
      </div>

      {sel && (
        <EditGhe g={sel} isChuyenMon={isChuyenMon} roles={roles} nsById={nsById} dsNhanSu={dsNhanSu} bienChe={bienChe} monOf={monOf} ghe={gheView} cam={descendants(sel.id)}
          onClose={() => setSel(null)}
          onSaved={() => { setSel(null); if (teamId) reloadGhe(teamId) }} />
      )}
    </div>
  )
}

function EditGhe({ g, isChuyenMon, roles, nsById, dsNhanSu, bienChe, monOf, ghe, cam, onClose, onSaved }: {
  g: ViTri; isChuyenMon: boolean; roles: VaiTroFull[]; nsById: Map<string, NhanSu>; dsNhanSu: NhanSu[]; bienChe: Record<string, string[]>; monOf: Record<string, string[]>; ghe: ViTri[]; cam: Set<string>
  onClose: () => void; onSaved: () => void
}) {
  const [ten, setTen] = useState(g.ten ?? '')
  const [cap, setCap] = useState(g.cap)
  const [chaId, setChaId] = useState(g.cha_id ?? '')
  const [nsId, setNsId] = useState(g.nhan_su_id ?? '')
  const [roleId, setRoleId] = useState(g.vai_tro_id ?? '')
  const [moRong, setMoRong] = useState(false) // mở rộng: bỏ lọc (hiện hết NS đang làm)
  const [busy, setBusy] = useState(false)
  const gheLabel = (x: ViTri) => `${x.ten || 'Vị trí chưa tên'}${x.nhan_su_id ? ` · ${nsById.get(x.nhan_su_id)?.ho_ten ?? ''}` : ' · trống'}`
  // Ứng viên — ghế CHUYÊN MÔN lọc theo MÔN của người (nhan_su_mon chứa g.mon); ghế LIÊN-MÔN lọc theo team biên chế.
  // "mở rộng" bỏ lọc; người ĐANG ngồi luôn giữ trong list (kể cả lệch) để không mất lựa chọn hiện tại.
  const thuocMon = (n: NhanSu) => !!g.mon && (monOf[n.id] ?? []).includes(g.mon)
  const thuocTeam = (n: NhanSu) => (bienChe[n.id] ?? []).includes(g.team_id)
  const phuHop = (n: NhanSu) => isChuyenMon ? (g.mon ? thuocMon(n) : true) : thuocTeam(n)
  const ungVien = dsNhanSu.filter((n) => n.trang_thai === 'dang_lam' && (moRong || phuHop(n) || n.id === g.nhan_su_id))

  async function save() {
    setBusy(true)
    try {
      await updateViTri(g.id, { ten: ten.trim() || null, cap, cha_id: chaId || null, nhan_su_id: nsId || null })
      if ((roleId || null) !== (g.vai_tro_id ?? null)) await setViTriRole(g.id, roleId || null) // gán/đổi quyền (lớp ①)
      onSaved()
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  async function themGheCon() {
    setBusy(true)
    try { await createViTri({ team_id: g.team_id, ten: null, cap: 'thanh_vien', cha_id: g.id, nhan_su_id: null, mon: g.mon ?? null }); onSaved() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  async function xoaGhe() {
    if (!confirm('Xoá vị trí này? (vị trí con sẽ nối lên vị trí cha của nó)')) return
    setBusy(true)
    try { await deleteViTri(g.id); onSaved() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <Shell title={`Vị trí · ${g.ten || 'chưa đặt tên'}`} onClose={onClose}>
      <div className="mb-3">
        {isChuyenMon
          ? <span className="rounded-md bg-violet-50 px-2 py-1 text-[12px] font-semibold text-violet-700">Môn: {g.mon ?? '— (ghế cũ chưa gán môn)'}</span>
          : <span className="rounded-md bg-slate-100 px-2 py-1 text-[12px] font-medium text-slate-500">Liên môn (Ops/Media/Marketing)</span>}
      </div>
      <Field label="Tên vị trí / chức vụ (scope phụ trách)">
        <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder="vd: Trưởng khối THCS / GV Toán 9" className={inp} autoFocus />
      </Field>
      <div className="mb-3">
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-600">Cấp (level)</span>
        <div className="flex gap-1.5">
          {(['truong', 'pho', 'thanh_vien'] as const).map((v) => (
            <button key={v} onClick={() => setCap(v)}
              className={`h-9 flex-1 rounded-lg border text-sm font-semibold transition ${cap === v ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
              {CAP_LABEL[v]}
            </button>
          ))}
        </div>
      </div>
      <Field label="Vị trí cha (nằm dưới vị trí nào)">
        <SearchSelect value={chaId || null} onChange={(id) => setChaId(id ?? '')} placeholder="— đỉnh team —"
          options={ghe.filter((x) => x.id !== g.id && !cam.has(x.id)).map((x) => ({ id: x.id, label: gheLabel(x) }))} />
      </Field>
      <Field label="Người đảm nhiệm">
        <SearchSelect value={nsId || null} onChange={(id) => setNsId(id ?? '')} placeholder="— vị trí trống —"
          options={ungVien.map((n) => ({ id: n.id, label: n.ho_ten, sub: `${n.ma_ns ?? ''}${!phuHop(n) ? (isChuyenMon ? ' · ngoài môn' : ' · ngoài team') : ''}`.trim() || undefined }))} />
        <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 text-[12px] text-slate-500">
          <input type="checkbox" checked={moRong} onChange={(e) => setMoRong(e.target.checked)} />
          {isChuyenMon ? <>Hiện cả nhân sự ngoài môn {g.mon}</> : 'Hiện cả nhân sự ngoài team'} ({dsNhanSu.filter((n) => n.trang_thai === 'dang_lam').length} người)
        </label>
        {isChuyenMon && !g.mon && <p className="mt-1 text-[11px] text-amber-600">Ghế này chưa gán môn — đang hiện toàn bộ. Tạo ghế trong tab môn để gắn đúng môn.</p>}
      </Field>
      <Field label="Vai trò (quyền — quyết định người ngồi đăng nhập THẤY màn nào)">
        <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className={inp}>
          <option value="">— chưa gán quyền (đăng nhập không thấy màn nào) —</option>
          {roles.map((r) => <option key={r.id} value={r.id}>{r.ten} ({r.chuc_nang.length} màn)</option>)}
        </select>
        {!roleId && <p className="mt-1 text-[11px] text-amber-600">⚠ Chưa gán quyền → người ngồi ghế này đăng nhập sẽ trống nav. Gán role rồi họ <b>đăng nhập lại</b> mới thấy.</p>}
      </Field>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={themGheCon} disabled={busy} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-40">+ Vị trí con</button>
          <button onClick={xoaGhe} disabled={busy} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] text-slate-500 hover:border-rose-300 hover:text-rose-600 disabled:opacity-40">Xoá vị trí</button>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={save} disabled={busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu'}</button>
        </div>
      </div>
    </Shell>
  )
}
