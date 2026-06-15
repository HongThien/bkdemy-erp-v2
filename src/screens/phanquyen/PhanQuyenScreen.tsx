// Màn PHÂN QUYỀN (Founder) — lớp ① feature-access: định nghĩa "vai trò" (bó chức năng) + gán role cho vị trí.
// chuc_nang = leaf-id trong cây Admin (lấy từ adminLeaves). Quyền 1 người = UNION role các ghế.
// Tab 1 = MA TRẬN role × màn (tick ô, set theo ROLE không theo người). Tab 2 = gán role cho từng vị trí.
import { useEffect, useState } from 'react'
import { adminLeaves } from '../../mock/fixtures'
import {
  listRoles, createRole, updateRole, deleteRole, setRoleChucNang,
  listViTriGan, setViTriRole, type VaiTroFull, type ViTriGan,
} from '../../lib/quyen'

const CAP_LBL: Record<string, string> = { truong: 'Trưởng', pho: 'Phó', thanh_vien: 'Thành viên' }
const NHOMS = [...new Set(adminLeaves.map((l) => l.nhom))]

export default function PhanQuyenScreen() {
  const [tab, setTab] = useState<'role' | 'gan'>('role')
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#fafafb]">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-6">
        <span className="mr-3 py-2.5 text-sm font-semibold text-slate-900">Phân quyền</span>
        {([['role', 'Vai trò & chức năng'], ['gan', 'Gán role cho vị trí']] as const).map(([k, lbl]) => (
          <button key={k} onClick={() => setTab(k)} className={`-mb-px border-b-2 px-3 py-2 text-[13px] font-medium ${tab === k ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{lbl}</button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{tab === 'role' ? <MaTranTab /> : <GanTab />}</div>
    </div>
  )
}

// ── TAB 1: MA TRẬN role (hàng) × màn (cột). Tick ô = lưu ngay. ─────
function MaTranTab() {
  const [roles, setRoles] = useState<VaiTroFull[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null) // "roleId:leafId" đang lưu

  async function reload() { setLoading(true); try { setRoles(await listRoles()) } finally { setLoading(false) } }
  useEffect(() => { reload() }, []) // eslint-disable-line

  async function them() {
    const ten = prompt('Tên vai trò? (vd "Quản lý Ops", "GV thường")')?.trim()
    if (!ten) return
    await createRole(ten); reload()
  }
  async function doi(r: VaiTroFull) {
    const ten = prompt('Đổi tên vai trò:', r.ten)?.trim()
    if (!ten || ten === r.ten) return
    await updateRole(r.id, { ten }); reload()
  }
  async function xoa(r: VaiTroFull) {
    if (!confirm(`Xóa vai trò "${r.ten}"? ${r.so_ghe} ghế đang gán sẽ bị gỡ role (không mất vị trí).`)) return
    await deleteRole(r.id); reload()
  }
  // tick / bỏ tick 1 ô → cập nhật lạc quan + lưu diff
  async function toggle(r: VaiTroFull, leafId: string) {
    const has = r.chuc_nang.includes(leafId)
    const next = has ? r.chuc_nang.filter((c) => c !== leafId) : [...r.chuc_nang, leafId]
    setRoles((rs) => rs.map((x) => (x.id === r.id ? { ...x, chuc_nang: next } : x)))
    const key = r.id + ':' + leafId; setSaving(key)
    try { await setRoleChucNang(r.id, next) }
    catch (e: any) { alert(e.message ?? String(e)); reload() }
    finally { setSaving((s) => (s === key ? null : s)) }
  }

  if (loading) return <p className="p-6 text-sm text-slate-400">Đang tải…</p>

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 px-6 pt-4">
        <button onClick={them} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500">+ Tạo vai trò</button>
        <span className="text-[12px] text-slate-400">Tick ô = cấp màn cho vai trò (lưu ngay). Founder luôn thấy mọi màn (bypass).</span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {roles.length === 0 ? <p className="text-[13px] text-slate-400">Chưa có vai trò nào — bấm “+ Tạo vai trò”.</p> : (
          <table className="border-separate border-spacing-0 text-[13px]">
            <thead>
              {/* hàng nhóm màn */}
              <tr>
                <th className="sticky left-0 z-20 bg-[#fafafb]" />
                {NHOMS.map((n) => (
                  <th key={n} colSpan={adminLeaves.filter((l) => l.nhom === n).length} className="border-b border-l border-slate-200 bg-slate-50 px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">{n}</th>
                ))}
              </tr>
              {/* hàng tên màn (dọc) */}
              <tr>
                <th className="sticky left-0 z-20 bg-[#fafafb] px-3 pb-2 text-left text-[11px] uppercase text-slate-400">Vai trò</th>
                {adminLeaves.map((l) => (
                  <th key={l.id} className="h-28 border-l border-slate-100 align-bottom">
                    <div className="mx-auto flex w-7 items-center justify-center">
                      <span className="whitespace-nowrap text-[11px] text-slate-500 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                        {l.ten}{l.founderOnly ? ' ⚠' : ''}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} className="group">
                  <th className="sticky left-0 z-10 border-t border-slate-100 bg-white px-3 py-1.5 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-800">{r.ten}</span>
                      <button onClick={() => doi(r)} title="Đổi tên" className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-indigo-600">✎</button>
                      <button onClick={() => xoa(r)} title="Xóa" className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-600">🗑</button>
                      <span className="ml-1 text-[11px] font-normal text-slate-400">{r.so_ghe}👤</span>
                    </div>
                  </th>
                  {adminLeaves.map((l) => {
                    const on = r.chuc_nang.includes(l.id)
                    const key = r.id + ':' + l.id
                    return (
                      <td key={l.id} className="border-l border-t border-slate-100 text-center">
                        <button onClick={() => toggle(r, l.id)} disabled={saving === key}
                          className={`m-0.5 inline-flex h-6 w-6 items-center justify-center rounded ${on ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-transparent hover:bg-slate-200'}`}>
                          {on ? '✓' : '·'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-4 text-[12px] text-slate-400">⚠ = màn nhạy cảm (tài chính / tổ chức / phân quyền). Cấp cho role nào thì người ở role đó mới thấy.</p>
      </div>
    </div>
  )
}

// ── TAB 2: gán role cho từng vị trí ───────────────────────────────
function GanTab() {
  const [rows, setRows] = useState<ViTriGan[]>([])
  const [roles, setRoles] = useState<VaiTroFull[]>([])
  const [loading, setLoading] = useState(true)

  async function reload() { setLoading(true); try { const [v, r] = await Promise.all([listViTriGan(), listRoles()]); setRows(v); setRoles(r) } finally { setLoading(false) } }
  useEffect(() => { reload() }, []) // eslint-disable-line

  async function gan(viTriId: string, roleId: string) {
    await setViTriRole(viTriId, roleId || null)
    setRows((rs) => rs.map((r) => (r.id === viTriId ? { ...r, vai_tro_id: roleId || null } : r)))
  }

  if (loading) return <p className="p-6 text-sm text-slate-400">Đang tải…</p>
  return (
    <div className="min-h-0 overflow-auto p-6">
      {roles.length === 0 && <p className="mb-3 text-[13px] text-amber-600">Chưa có vai trò nào — tạo ở tab “Vai trò & chức năng” trước.</p>}
      <table className="w-full max-w-3xl text-sm">
        <thead><tr className="text-left text-[11px] uppercase text-slate-400">
          <th className="px-3 py-1.5">Vị trí</th><th className="px-3">Team</th><th className="px-3">Người đảm nhiệm</th><th className="px-3">Vai trò (quyền)</th>
        </tr></thead>
        <tbody>
          {rows.map((v) => (
            <tr key={v.id} className="border-t border-slate-100">
              <td className="px-3 py-1.5 font-medium text-slate-800">{v.ten ?? '(chưa đặt tên)'} <span className="text-[11px] font-normal text-slate-400">· {CAP_LBL[v.cap] ?? v.cap}</span></td>
              <td className="px-3 text-slate-500">{v.team_ten}</td>
              <td className="px-3 text-slate-500">{v.nguoi_ten ?? <span className="text-slate-300">— trống —</span>}</td>
              <td className="px-3">
                <select value={v.vai_tro_id ?? ''} onChange={(e) => gan(v.id, e.target.value)} className="rounded-md border border-slate-200 px-2 py-1 text-[13px]">
                  <option value="">— chưa gán —</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.ten}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
