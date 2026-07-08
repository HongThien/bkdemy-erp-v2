// Dashboard "Chất lượng vận hành" (leaf `db_chatluong`) — đo hoạt động VẬN HÀNH của
// nhân sự (GV/TG: đánh giá·chấm bài·chấm ET·chấm BTVN — theo ĐÚNG invariant getMyTasks/
// listAllStaffTasks, KHÔNG dựng lại; OPS: điểm danh, hiện team-wide vì buoi_hoc_hs
// không lưu "ai điểm danh" — chưa attribute per-person, xem DEVLOG 07-05).
// 4 TẦNG TRÊN (Thùy chốt 07-05 lần 4):
//   · Theo người — chọn 1 người → TẤT CẢ nghiệp vụ của người đó (mọi team họ thuộc), side-by-side.
//   · Theo mục   — chọn mục (Tất cả/Ops/TA/GV) → kết quả CHUNG mọi người trong mục đó.
//   · Chi tiết   — hiện HẾT mọi task (card), filter được theo NGƯỜI và/hoặc MỤC.
//   · Duyệt chất lượng — hàng đợi của CHÍNH người đang đăng nhập (cấp trên theo cây TRỪ
//     "Chấm bài trên lớp" của TA thì GV của lớp đó duyệt) — mặc định 100%, duyệt batch/daily.
// Kỳ chọn = toggle 3 tháng gần nhất + ‹ › lùi/tiến, LƯU qua useStore (không mất khi đổi màn).
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { useStore } from '../../store/useStore'
import { listAllStaffTasks, listOpsDiemDanhTeam, type StaffTaskRow, type TabKey } from '../../lib/gami'
import { listNhanSuTeams, layChiTietTasks, layDanhSachChoDuyet, duyetMot, duyetHangLoat, deXuatTienDo, getNsProfileMini, hieuSuatOf, tinhHieuSuat, PCT_QUICK_PICKS, TIEN_DO_TIERS, TASK_TAB_LABEL, TEAM_LABEL, type TeamKey, type TaskDetail, type NsProfileMini, type DuyetRow } from '../../lib/vanhanh'

// ── Kỳ (tháng) — toggle 3 gần nhất + lùi/tiến ────────────────────────────────
const ymNow = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
const ymAdd = (ym: string, delta: number) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + delta, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
const ymLabel = (ym: string) => { const [, m] = ym.split('-'); return `Th${Number(m)}` }
const ymRange = (ym: string) => { const [y, m] = ym.split('-').map(Number); return { tu: `${ym}-01`, den: new Date(y, m, 0).toISOString().slice(0, 10) } }

function KyToggle({ ky, setKy }: { ky: string; setKy: (k: string) => void }) {
  const window3 = [ymAdd(ky, -2), ymAdd(ky, -1), ky]
  const isFuture = ymAdd(ky, 1) > ymNow()
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setKy(ymAdd(ky, -1))} className="rounded-lg border border-slate-300 px-2 py-1.5 text-slate-500 hover:border-indigo-400">‹</button>
      {window3.map((m) => (
        <button key={m} onClick={() => setKy(m)} className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition ${m === ky ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-indigo-300'}`}>
          {ymLabel(m)}/{m.slice(0, 4)}
        </button>
      ))}
      <button disabled={isFuture} onClick={() => setKy(ymAdd(ky, 1))} className="rounded-lg border border-slate-300 px-2 py-1.5 text-slate-500 hover:border-indigo-400 disabled:opacity-30">›</button>
    </div>
  )
}

type Status = 'dat' | 'cham' | 'chua_xong'
function statusOf(t: StaffTaskRow): Status {
  if (t.done) return (t.deadline != null && t.doneAt && new Date(t.doneAt).getTime() > t.deadline) ? 'cham' : 'dat'
  return 'chua_xong'
}
const STATUS_UI: Record<Status, { ten: string; cls: string }> = {
  dat: { ten: 'Đạt', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  cham: { ten: 'Chậm', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  chua_xong: { ten: 'Chưa xong', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
}
const TEAM_TABS_OF: Record<TeamKey, TabKey[]> = { gv: ['danhgia', 'ingame'], ta: ['ingame', 'et', 'btvn'], ops: [] }
type Muc = 'tatca' | TeamKey

export default function ChatLuongVanHanhScreen() {
  const ky = useStore((s) => s.dbVanHanhKy) || ymNow()
  const setKy = useStore((s) => s.setDbVanHanhKy)
  const view = useStore((s) => s.dbVanHanhView)
  const setView = useStore((s) => s.setDbVanHanhView)

  const [rows, setRows] = useState<StaffTaskRow[]>([])
  const [teams, setTeams] = useState<Map<string, TeamKey[]>>(new Map())
  const [nsNames, setNsNames] = useState<Map<string, string>>(new Map())
  const [ops, setOps] = useState<{ tongBuoi: number; tongHs: number; daDiemDanh: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const { tu, den } = ymRange(ky)

  useEffect(() => {
    setLoading(true); setErr(null)
    Promise.all([listAllStaffTasks(tu, den), listOpsDiemDanhTeam(tu, den), listNhanSuTeams()])
      .then(([r, o, tms]) => { setRows(r); setOps(o); setTeams(new Map(tms.map((t) => [t.nhan_su_id, t.teams]))); setNsNames(new Map(tms.map((t) => [t.nhan_su_id, t.ho_ten]))) })
      .catch((e) => setErr(e?.message ?? String(e))).finally(() => setLoading(false))
  }, [tu, den])

  const tabBtn = (on: boolean) => `h-8 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Chất lượng vận hành</span>
        <button onClick={() => setView('theonguoi')} className={tabBtn(view === 'theonguoi')}>Theo người</button>
        <button onClick={() => setView('theomuc')} className={tabBtn(view === 'theomuc')}>Theo mục</button>
        <button onClick={() => setView('chitiet')} className={tabBtn(view === 'chitiet')}>Chi tiết</button>
        <button onClick={() => setView('duyet')} className={tabBtn(view === 'duyet')}>Duyệt chất lượng</button>
        <span className="mx-2 h-5 w-px bg-slate-200" />
        <KyToggle ky={ky} setKy={setKy} />
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {err && <div className="mx-auto mb-3 max-w-[1000px] rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
          view === 'theonguoi' ? <TheoNguoi rows={rows} teams={teams} nsNames={nsNames} /> :
          view === 'theomuc' ? <TheoMuc rows={rows} teams={teams} nsNames={nsNames} ops={ops} /> :
          view === 'chitiet' ? <ChiTiet rows={rows} teams={teams} nsNames={nsNames} /> :
          <DuyetChatLuong rows={rows} nsNames={nsNames} />
        )}
      </div>
    </div>
  )
}

// ── DUYỆT CHẤT LƯỢNG: hàng đợi của CHÍNH người đang đăng nhập —
// tiến độ = máy ĐỀ XUẤT theo độ trễ (4 mức), người CHỐT (đổi khác đề xuất PHẢI ghi lý do) ·
// chất lượng mặc định 100% · hiệu suất TỰ SINH (avg 2 số, không phải người điền) ·
// duyệt TỪNG CÁI hoặc HÀNG LOẠT (theo đề xuất máy, đa số giống nhau, thường=daily). ──
function DuyetChatLuong({ rows, nsNames }: { rows: StaffTaskRow[]; nsNames: Map<string, string> }) {
  const [pending, setPending] = useState<DuyetRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { setPending(await layDanhSachChoDuyet(rows)) } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [rows])

  async function onDuyetMot(r: DuyetRow, tienDo: number, chatLuong: number, tienDoLyDo?: string) {
    const k = r.buoiId + r.tab + r.nhan_su_id
    setBusy(k)
    try { await duyetMot(r, { tienDo, chatLuong, tienDoLyDo }); setFlash(`Đã duyệt ${TASK_TAB_LABEL[r.tab]} — ${nsNames.get(r.nhan_su_id) ?? '?'}.`); await reload() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  async function onDuyetHangLoat() {
    setBusy('all')
    try { await duyetHangLoat(pending, 100); setFlash(`Đã duyệt hàng loạt ${pending.length} task (theo đề xuất tiến độ + 100% chất lượng).`); await reload() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      {err && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {err}</div>}
      {flash && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-700">{flash}</div>}
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-slate-600">{pending.length} task đang chờ duyệt (của bạn — cấp trên theo cây tổ chức, riêng "Chấm bài trên lớp" của TA thì bạn là GV lớp đó).</span>
        {pending.length > 0 && (
          <button disabled={busy === 'all'} onClick={onDuyetHangLoat} className="ml-auto rounded-lg bg-emerald-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40">
            {busy === 'all' ? 'Đang duyệt…' : `✓ Duyệt tất cả (theo đề xuất) — ${pending.length}`}
          </button>
        )}
      </div>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : !pending.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-[13px] text-slate-400">Không có task nào đang chờ bạn duyệt. 🎉</div>
      ) : (
        <div className="space-y-2">
          {pending.map((r) => (
            <DuyetRowCard key={r.buoiId + r.tab + r.nhan_su_id} r={r} hoTen={nsNames.get(r.nhan_su_id) ?? '?'} busy={busy === r.buoiId + r.tab + r.nhan_su_id}
              onDuyet={(td, cl, lyDo) => onDuyetMot(r, td, cl, lyDo)} />
          ))}
        </div>
      )}
    </div>
  )
}
// Ô nhập % dùng chung (tiến độ khi đổi khác đề xuất + chất lượng) — quick-pick 100/95/90/85/80, 1 click; gõ tay nếu khác.
function PctQuickPick({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {PCT_QUICK_PICKS.map((p) => (
        <button key={p} type="button" onClick={() => onChange(p)} className={`rounded-md px-2 py-1 text-[11px] font-semibold ring-1 transition ${value === p ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-600 ring-slate-300 hover:ring-indigo-300'}`}>{p}</button>
      ))}
      <input type="number" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-14 rounded-md border border-slate-300 px-1.5 py-1 text-[12px]" />
    </div>
  )
}
// Tiến độ giờ CHỈ 4 NÚT rời rạc (Đạt/Chậm 1/2/3) — khớp đúng 4 mức TIEN_DO_TIERS, không còn quick-pick số.
function TienDoTierPick({ tierIdx, onChange }: { tierIdx: number; onChange: (i: number) => void }) {
  return (
    <div className="flex gap-1">
      {TIEN_DO_TIERS.map((t, i) => (
        <button key={t.key} type="button" onClick={() => onChange(i)}
          className={`rounded-md px-2 py-1 text-[11px] font-semibold ring-1 transition ${i === tierIdx ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-600 ring-slate-300 hover:ring-indigo-300'}`}>
          {i === 0 ? 'Đạt' : `Chậm ${i}`}
        </button>
      ))}
    </div>
  )
}
// Gọn theo CHIỀU NGANG (1 hàng/task, không phải card cao) — nhiều hàng vừa 1 màn hình.
function DuyetRowCard({ r, hoTen, busy, onDuyet }: { r: DuyetRow; hoTen: string; busy: boolean; onDuyet: (tienDo: number, chatLuong: number, lyDo?: string) => void }) {
  const deXuat = deXuatTienDo(r)
  const deXuatIdx = TIEN_DO_TIERS.findIndex((t) => t.diem === deXuat.diem)
  const [tienDoIdx, setTienDoIdx] = useState(deXuatIdx)
  const [chatLuong, setChatLuong] = useState(100)
  const [lyDo, setLyDo] = useState('')
  const tienDo = TIEN_DO_TIERS[tienDoIdx].diem
  const doiKhacDeXuat = tienDoIdx !== deXuatIdx
  const hieuSuat = tinhHieuSuat(tienDo, chatLuong)
  const canDuyet = !doiKhacDeXuat || lyDo.trim().length > 0

  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-44 shrink-0">
          <div className="truncate text-[12.5px] font-semibold text-slate-800">{TASK_TAB_LABEL[r.tab]} · {hoTen}</div>
          <div className="truncate text-[10.5px] text-slate-500">{new Date(r.ngay).toLocaleDateString('vi-VN')} · {r.lop}</div>
        </div>
        <TienDoTierPick tierIdx={tienDoIdx} onChange={setTienDoIdx} />
        <PctQuickPick value={chatLuong} onChange={setChatLuong} />
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span className="text-[12px] text-slate-500">HS <b className="text-slate-800">{hieuSuat}%</b></span>
          <button disabled={busy || !canDuyet} onClick={() => onDuyet(tienDo, chatLuong, lyDo)} className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40">{busy ? '…' : '✓ Duyệt'}</button>
        </div>
      </div>
      {doiKhacDeXuat && (
        <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder={`Bắt buộc: lý do đổi khác đề xuất (${deXuat.label})…`}
          className={`mt-1.5 w-full rounded-md border px-2 py-1 text-[11.5px] ${!lyDo.trim() ? 'border-rose-300 bg-rose-50' : 'border-slate-300'}`} />
      )}
    </div>
  )
}

// ── MỤC SELECTOR (Tất cả/Ops/TA/GV) — dùng chung Theo-mục + Chi-tiết ─────────
function MucSelector({ muc, setMuc }: { muc: Muc; setMuc: (m: Muc) => void }) {
  const opt = (on: boolean) => `rounded-full px-3 py-1 text-[12px] font-medium ring-1 transition ${on ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-600 ring-slate-300 hover:ring-indigo-300'}`
  return (
    <div className="flex gap-1.5">
      <button onClick={() => setMuc('tatca')} className={opt(muc === 'tatca')}>Tất cả</button>
      <button onClick={() => setMuc('ops')} className={opt(muc === 'ops')}>{TEAM_LABEL.ops}</button>
      <button onClick={() => setMuc('ta')} className={opt(muc === 'ta')}>{TEAM_LABEL.ta}</button>
      <button onClick={() => setMuc('gv')} className={opt(muc === 'gv')}>{TEAM_LABEL.gv}</button>
    </div>
  )
}

// ── THEO NGƯỜI: sidebar chọn 1 người → header profile + card/nghiệp-vụ (số to = hiệu suất TB,
// số nhỏ = chi tiết) → click card mở POPUP chi tiết TỪNG task (tái dùng TaskCard của tab Chi tiết,
// KHÔNG dựng 1 mục "danh sách chi tiết" riêng — xem lý do ở HANDOFF/DEVLOG 07-06). ──
function TheoNguoi({ rows, teams, nsNames }: { rows: StaffTaskRow[]; teams: Map<string, TeamKey[]>; nsNames: Map<string, string> }) {
  const nsId = useStore((s) => s.dbVanHanhNsId)
  const setNsId = useStore((s) => s.setDbVanHanhNsId)
  const nsList = useMemo(() => [...teams.keys()].map((id) => ({ id, ho_ten: nsNames.get(id) ?? '?' })).sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi')), [teams, nsNames])
  const rowsOfNs = useMemo(() => rows.filter((r) => r.nhan_su_id === nsId), [rows, nsId])
  const tabsOfNs = useMemo(() => {
    const tms = teams.get(nsId ?? '') ?? []
    const set = new Set<TabKey>()
    for (const t of tms) for (const tab of TEAM_TABS_OF[t]) set.add(tab)
    return [...set]
  }, [teams, nsId])

  const [details, setDetails] = useState<TaskDetail[]>([])
  const [loadingDetail, setLoadingDetail] = useState(false)
  useEffect(() => {
    if (!rowsOfNs.length) { setDetails([]); return }
    setLoadingDetail(true)
    layChiTietTasks(rowsOfNs).then(setDetails).finally(() => setLoadingDetail(false))
  }, [rowsOfNs])

  const [profile, setProfile] = useState<NsProfileMini | null>(null)
  useEffect(() => { if (!nsId) { setProfile(null); return } getNsProfileMini(nsId).then(setProfile) }, [nsId])

  const [popupTab, setPopupTab] = useState<TabKey | null>(null)

  return (
    <div className="mx-auto flex max-w-[1180px] items-start gap-4">
      <NsSidebar list={nsList} nsId={nsId} setNsId={setNsId} />
      <div className="min-w-0 flex-1 space-y-4">
        {!nsId ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-[13px] text-slate-400">Chọn 1 nhân sự bên trái để xem hồ sơ hiệu suất.</div>
        ) : (
          <>
            {profile && <ProfileHeaderCard profile={profile} teams={teams.get(nsId) ?? []} />}
            {!tabsOfNs.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-[13px] text-slate-400">Người này chưa gán vào team nào có nghiệp vụ đo được (OPS chỉ đo team-wide).</div>
            ) : loadingDetail ? <p className="text-sm text-slate-400">Đang tải…</p> : (
              <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                {tabsOfNs.map((tab) => (
                  <NghiepVuCard key={tab} tab={tab} details={details.filter((d) => d.tab === tab)} onClick={() => setPopupTab(tab)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {popupTab && nsId && createPortal(
        <PopupChiTietTask tab={popupTab} hoTen={nsNames.get(nsId) ?? '?'} details={details.filter((d) => d.tab === popupTab)} onClose={() => setPopupTab(null)} />,
        document.body,
      )}
    </div>
  )
}
// Sidebar danh sách TẤT CẢ nhân sự — click đổi (thay dropdown, dễ lướt/so sánh nhanh nhiều người).
function NsSidebar({ list, nsId, setNsId }: { list: { id: string; ho_ten: string }[]; nsId: string | null; setNsId: (id: string) => void }) {
  const [q, setQ] = useState('')
  const filtered = list.filter((n) => !q.trim() || n.ho_ten.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <div className="w-60 shrink-0 rounded-2xl bg-white p-2 shadow-sm">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm nhân sự…" className="mb-1.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12.5px] outline-none focus:border-indigo-400" />
      <div className="max-h-[65vh] space-y-0.5 overflow-y-auto">
        {filtered.map((n) => (
          <button key={n.id} onClick={() => setNsId(n.id)} className={`block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-[13px] transition ${n.id === nsId ? 'bg-indigo-600 font-semibold text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            {n.ho_ten}
          </button>
        ))}
        {!filtered.length && <div className="px-2.5 py-4 text-center text-[12px] text-slate-400">Không tìm thấy.</div>}
      </div>
    </div>
  )
}
function ProfileHeaderCard({ profile, teams }: { profile: NsProfileMini; teams: TeamKey[] }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-sm">
      {profile.anh_url ? <img src={profile.anh_url} className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-slate-100" /> : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[18px] font-semibold text-slate-400">{profile.ho_ten.charAt(0)}</div>
      )}
      <div className="min-w-0">
        <div className="truncate text-[15px] font-semibold text-slate-900">{profile.ho_ten}{profile.ma_ns ? <span className="ml-1.5 font-normal text-slate-400">· {profile.ma_ns}</span> : null}</div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {teams.map((t) => <span key={t} className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">{TEAM_LABEL[t]}</span>)}
        </div>
      </div>
    </div>
  )
}
// Card 1 nghiệp vụ — SỐ TO NHẤT = hiệu suất trung bình (tổng quan, xem trước), số nhỏ bên dưới
// = chi tiết (Đạt/Chậm/Chưa xong) — chỉ cần soi số nhỏ khi số to có vấn đề.
function NghiepVuCard({ tab, details, onClick }: { tab: TabKey; details: TaskDetail[]; onClick: () => void }) {
  const hsVals = details.map(hieuSuatOf).filter((v): v is number => v != null)
  const avg = hsVals.length ? Math.round(hsVals.reduce((s, v) => s + v, 0) / hsVals.length) : null
  const soDuyet = details.filter((t) => t.daDuyet).length
  let dat = 0, cham = 0, chuaXong = 0
  for (const t of details) { const s = statusOf(t); s === 'dat' ? dat++ : s === 'cham' ? cham++ : chuaXong++ }
  const color = avg == null ? 'text-slate-300' : avg >= 70 ? 'text-emerald-600' : avg >= 40 ? 'text-amber-600' : 'text-rose-600'
  return (
    <button onClick={onClick} className="rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-transparent transition hover:shadow-md hover:ring-indigo-200">
      <div className="text-[13px] font-semibold text-slate-700">{TASK_TAB_LABEL[tab]}</div>
      <div className={`mt-1 text-[34px] font-bold leading-tight tabular-nums ${color}`}>{avg == null ? '—' : `${avg}%`}</div>
      <div className="text-[11px] text-slate-400">
        Hiệu suất trung bình · {details.length} task{soDuyet < details.length ? <span className="text-amber-500"> · {details.length - soDuyet} chưa duyệt (dự kiến)</span> : null}
      </div>
      <div className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-2.5 text-[12px]">
        <span className="text-emerald-600">Đạt <b>{dat}</b></span>
        <span className="text-amber-600">Chậm <b>{cham}</b></span>
        <span className="text-rose-600">Chưa xong <b>{chuaXong}</b></span>
      </div>
    </button>
  )
}
// Popup chi tiết task — mở TỪ card nghiệp vụ, tái dùng TaskCard (đồng nhất với tab Chi tiết,
// không đẻ thêm 1 mục "danh sách chi tiết" riêng).
function PopupChiTietTask({ tab, hoTen, details, onClose }: { tab: TabKey; hoTen: string; details: TaskDetail[]; onClose: () => void }) {
  const withStatus = details.map((r) => ({ ...r, status: statusOf(r) })).sort((a, b) => b.ngay.localeCompare(a.ngay))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[85vh] w-[880px] max-w-full overflow-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[14px] font-semibold text-slate-900">{TASK_TAB_LABEL[tab]} · {hoTen}</span>
          <span className="text-[12px] text-slate-400">({withStatus.length} task)</span>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {withStatus.map((t, i) => <TaskCard key={t.buoiId + t.tab + i} t={t} />)}
          {!withStatus.length && <div className="col-span-full rounded-xl border border-dashed border-slate-300 py-8 text-center text-[13px] text-slate-400">Không có task nào.</div>}
        </div>
      </div>
    </div>
  )
}

// ── THEO MỤC: chọn mục (Tất cả/Ops/TA/GV) → kết quả CHUNG mọi người trong mục đó ──
function TheoMuc({ rows, teams, nsNames, ops }: { rows: StaffTaskRow[]; teams: Map<string, TeamKey[]>; nsNames: Map<string, string>; ops: { tongBuoi: number; tongHs: number; daDiemDanh: number } | null }) {
  const muc = useStore((s) => s.dbVanHanhMuc)
  const setMuc = useStore((s) => s.setDbVanHanhMuc)
  const rowsOfMuc = useMemo(() => muc === 'tatca' ? rows : rows.filter((r) => (teams.get(r.nhan_su_id) ?? []).includes(muc)), [rows, teams, muc])

  return (
    <div className="mx-auto max-w-[1000px] space-y-4">
      <MucSelector muc={muc} setMuc={setMuc} />
      {muc === 'ops' ? (
        <div className="rounded-2xl border-l-4 border-l-sky-400 bg-white p-5 shadow-sm">
          <div className="text-[14px] font-semibold text-slate-700">OPS · Điểm danh (team-wide)</div>
          <p className="mt-1 text-[12px] text-slate-500">Chưa tách theo từng người — <code>buoi_hoc_hs</code> không lưu "ai điểm danh". Các việc OPS khác (report…) sẽ nối dần khi phát sinh.</p>
          {ops && <div className="mt-3 text-[13px] text-slate-700">{ops.tongBuoi} buổi mở · {ops.daDiemDanh}/{ops.tongHs} lượt HS đã điểm danh (<b>{ops.tongHs ? Math.round((ops.daDiemDanh / ops.tongHs) * 100) : 0}%</b>)</div>}
        </div>
      ) : muc === 'tatca' ? (
        <BangTongQuan perNs={aggByNs(rowsOfMuc, nsNames)} />
      ) : (
        <div className="space-y-6">
          {TEAM_TABS_OF[muc].map((tab) => (
            <div key={tab}>
              <div className="mb-2 text-[13px] font-semibold text-slate-700">{TASK_TAB_LABEL[tab]}</div>
              <BangTongQuan perNs={aggByNs(rowsOfMuc.filter((r) => r.tab === tab), nsNames)} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
function aggByNs(rows: StaffTaskRow[], nsNames: Map<string, string>) {
  const m = new Map<string, { dat: number; cham: number; chuaXong: number }>()
  for (const t of rows) {
    const cur = m.get(t.nhan_su_id) ?? { dat: 0, cham: 0, chuaXong: 0 }
    const s = statusOf(t)
    cur[s === 'dat' ? 'dat' : s === 'cham' ? 'cham' : 'chuaXong']++
    m.set(t.nhan_su_id, cur)
  }
  return [...m.entries()].map(([id, c]) => {
    const tong = c.dat + c.cham + c.chuaXong
    return { nhan_su_id: id, ho_ten: nsNames.get(id) ?? '?', tong, ...c, pctDat: tong ? Math.round((c.dat / tong) * 100) : 0, pctCham: tong ? Math.round((c.cham / tong) * 100) : 0, pctChuaXong: tong ? Math.round((c.chuaXong / tong) * 100) : 0 }
  }).sort((a, b) => a.pctDat - b.pctDat)
}
function BangTongQuan({ perNs, compact }: { perNs: ReturnType<typeof aggByNs>; compact?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm ${compact ? '' : 'mx-auto max-w-[1000px]'}`}>
      <table className="w-full text-[13px]">
        <thead><tr className="text-left text-[11px] text-slate-400">
          <th className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 py-2 font-medium">Nhân sự</th><th className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 py-2 font-medium">Tổng task</th>
          <th className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 py-2 font-medium">Đạt</th><th className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 py-2 font-medium">Chậm</th><th className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 py-2 font-medium">Chưa xong</th>
        </tr></thead>
        <tbody>
          {perNs.map((r) => (
            <tr key={r.nhan_su_id} className="border-b border-slate-50 last:border-0">
              <td className="px-4 py-2.5 font-medium text-slate-800">{r.ho_ten}</td>
              <td className="px-4 py-2.5 text-slate-500">{r.tong}</td>
              <td className="px-4 py-2.5"><PctBar pct={r.pctDat} n={r.dat} cls="bg-emerald-500" /></td>
              <td className="px-4 py-2.5"><PctBar pct={r.pctCham} n={r.cham} cls="bg-amber-500" /></td>
              <td className="px-4 py-2.5"><PctBar pct={r.pctChuaXong} n={r.chuaXong} cls="bg-rose-500" /></td>
            </tr>
          ))}
          {!perNs.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Không có dữ liệu trong khoảng này.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
function PctBar({ pct, n, cls }: { pct: number; n: number; cls: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${cls}`} style={{ width: `${pct}%` }} /></div>
      <span className="text-[12px] text-slate-500">{pct}% ({n})</span>
    </div>
  )
}

// ── CHI TIẾT: hiện HẾT mọi task (card) — filter được theo NGƯỜI và/hoặc MỤC ──
function ChiTiet({ rows, teams, nsNames }: { rows: StaffTaskRow[]; teams: Map<string, TeamKey[]>; nsNames: Map<string, string> }) {
  const muc = useStore((s) => s.dbVanHanhMuc)
  const setMuc = useStore((s) => s.setDbVanHanhMuc)
  const nsId = useStore((s) => s.dbVanHanhNsId)
  const setNsId = useStore((s) => s.setDbVanHanhNsId)
  const [details, setDetails] = useState<TaskDetail[]>([])
  const [loadingDetail, setLoadingDetail] = useState(false)

  const nsOpts: Opt[] = [...teams.entries()]
    .filter(([, tms]) => muc === 'tatca' || tms.includes(muc))
    .map(([id, tms]) => ({ id, label: `${nsNames.get(id) ?? '?'} (${tms.map((t) => TEAM_LABEL[t]).join(', ')})` }))

  const filteredRows = useMemo(() => rows
    .filter((r) => muc === 'tatca' || (teams.get(r.nhan_su_id) ?? []).includes(muc))
    .filter((r) => !nsId || r.nhan_su_id === nsId), [rows, teams, muc, nsId])

  useEffect(() => {
    if (!filteredRows.length) { setDetails([]); return }
    setLoadingDetail(true)
    layChiTietTasks(filteredRows).then(setDetails).finally(() => setLoadingDetail(false))
  }, [filteredRows])

  const withStatus = details.map((r) => ({ ...r, status: statusOf(r), ho_ten: nsNames.get(r.nhan_su_id) ?? '?' })).sort((a, b) => b.ngay.localeCompare(a.ngay))
  const counts = { dat: withStatus.filter((r) => r.status === 'dat').length, cham: withStatus.filter((r) => r.status === 'cham').length, chua_xong: withStatus.filter((r) => r.status === 'chua_xong').length }

  return (
    <div className="mx-auto max-w-[1000px] space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <MucSelector muc={muc} setMuc={setMuc} />
        <SearchSelect value={nsId} onChange={setNsId} options={nsOpts} placeholder="Lọc theo người (tuỳ chọn)…" className="w-72" />
        <span className="ml-auto text-[12px] text-slate-500">
          <span className="text-emerald-600">Đạt {counts.dat}</span> · <span className="text-amber-600">Chậm {counts.cham}</span> · <span className="text-rose-600">Chưa xong {counts.chua_xong}</span>
        </span>
      </div>
      {muc === 'ops' ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-[13px] text-slate-400">OPS chưa có task chi tiết per-person (xem tab Theo mục — team-wide).</div>
      ) : loadingDetail ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {withStatus.map((t, i) => <TaskCard key={t.buoiId + t.tab + i} t={t} />)}
          {!withStatus.length && <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white py-8 text-center text-[13px] text-slate-400">Không có task nào khớp bộ lọc.</div>}
        </div>
      )}
    </div>
  )
}
function TaskCard({ t }: { t: TaskDetail & { status: Status; ho_ten?: string } }) {
  const hieuSuat = hieuSuatOf(t)
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[13px] font-semibold text-slate-800">{TASK_TAB_LABEL[t.tab] ?? t.label}</div>
          <div className="mt-0.5 text-[11px] text-slate-500">{t.ho_ten ? `${t.ho_ten} · ` : ''}{new Date(t.ngay).toLocaleDateString('vi-VN')} · {t.lop}</div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${STATUS_UI[t.status].cls}`}>{STATUS_UI[t.status].ten}</span>
      </div>
      <div className="mt-3 space-y-1.5 text-[12px]">
        <MetricRow label={t.daDuyet ? 'Tiến độ' : t.done ? 'Tiến độ (đề xuất)' : 'Tiến độ (nếu xong ngay)'} pct={t.tienDoPct} />
        <MetricRow label={t.daDuyet ? (t.chatLuongLabel ?? 'Chất lượng') : 'Chất lượng (mặc định)'} pct={t.chatLuongPct} />
        <MetricRow label={t.daDuyet ? 'Hiệu suất' : t.done ? 'Hiệu suất (dự kiến)' : 'Hiệu suất (sống)'} pct={hieuSuat} bold />
      </div>
      <div className="mt-2 text-[10px] font-medium">
        {t.daDuyet ? <span className="text-emerald-600">✓ Đã duyệt chính thức</span> : !t.done ? <span className="text-rose-400">Chưa hoàn thành — số trên là ước tính SỐNG (tụt dần nếu để càng lâu)</span> : <span className="text-slate-400">Chưa duyệt — số trên là DỰ KIẾN, đổi khi leader chốt</span>}
      </div>
    </div>
  )
}
function MetricRow({ label, pct, bold }: { label: string; pct: number | null; bold?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-28 shrink-0 text-slate-500 ${bold ? 'font-semibold text-slate-700' : ''}`}>{label}</span>
      {pct == null ? <span className="text-slate-300">— (chưa có dữ liệu)</span> : (
        <div className="flex flex-1 items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} /></div>
          <span className={`w-9 shrink-0 text-right ${bold ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{pct}%</span>
        </div>
      )}
    </div>
  )
}
