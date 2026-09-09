// GvHome — shell + trang chủ app GIÁO VIÊN (PLAN-app-gv.md §1, khuôn TaHome/OpsHome).
// · Trang chủ = box Dashboard tháng (tầng A) + 2 BOX nghiệp vụ (Đánh giá sau buổi / Bài trên lớp),
//   bubble đỏ nợ ở góc icon. Bấm box/card → màn ChamBuoiGv đúng tab.
// · Bottom-tab 5 nút: Hôm nay · Việc chấm · Học sinh · Lớp · Của tôi.
// Việc = getMyTasks() lọc vai 'gv' (CÙNG derive với "Việc của tôi" ERP — 1 nguồn, TASKS_BY_VAI).
// Phạm vi tab Học sinh/Lớp = lớp phân công vai 'gv' (chốt ④ 31/08 — khoá theo lớp phụ trách).
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { MyProfile } from '../../lib/nhansu'
import type { Lop } from '../../lib/nhansu'
import type { MyQuyen } from '../../lib/quyen'
import { getMyTasks, buoiAoCuaNgay, type MyTask, type BuoiAo } from '../../lib/gami'
import { gvDashboard, type GvDash } from '../../lib/gvdash'
import { homNayVN, ddmmVN, thuCuaNgay, mucDeadline, nhanConLai } from '../../lib/tuan'
import ChamBuoiGv from './ChamBuoiGv'
import HocSinhView from './HocSinhView'
import LopView, { type LopSubKey } from './LopView'
import DashGv from './DashGv'
import GopY from './GopY'

type NvKey = 'danhgia' | 'ingame'
type TabKey = 'home' | 'viec' | 'hs' | 'lop' | 'dash'
// ⚠ Tailwind JIT: class màu là CHUỖI LITERAL per nghiệp vụ (cấm ghép chuỗi động) — bài học OpsHome.
const NGHIEP_VU: { key: NvKey; icon: string; label: string; chip: string }[] = [
  { key: 'danhgia', icon: '⭐', label: 'Đánh giá sau buổi', chip: 'bg-green-50' },
  { key: 'ingame', icon: '📝', label: 'Bài trên lớp', chip: 'bg-sky-50' },
]
const nvOf = (k: NvKey) => NGHIEP_VU.find((n) => n.key === k)!

export type BuoiViewGv = { buoiId: string; tab: NvKey; lop: string; ngay: string }

function NoBadge({ n, small }: { n: number; small?: boolean }) {
  if (n <= 0) return null
  return (
    <span className={`absolute flex items-center justify-center rounded-full bg-rose-500 font-bold text-white ring-2 ring-white ${small ? '-right-1.5 -top-1 h-4 min-w-4 px-0.5 text-[9.5px]' : '-right-1.5 -top-1.5 h-5 min-w-5 px-1 text-[11px]'}`}>{n > 99 ? '99+' : n}</span>
  )
}

export default function GvHome({ profile, quyen }: { profile: MyProfile; quyen: MyQuyen }) {
  const homNay = homNayVN()
  const [tab, setTab] = useState<TabKey>('home')
  const [view, setView] = useState<BuoiViewGv | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<MyTask[]>([])
  const [now, setNow] = useState(() => Date.now())
  const [dashTom, setDashTom] = useState<GvDash | null>(null)
  // Buổi ẢO hôm nay của lớp mình (TKB) → box "Trước buổi" trang chủ; bấm = mở tab Lớp đúng lớp + sub trước buổi.
  const [buoiHomNay, setBuoiHomNay] = useState<BuoiAo[]>([])
  const [lopInit, setLopInit] = useState<{ lopId: string; sub: LopSubKey; n: number } | null>(null)
  const coQuyen = quyen.laAdmin || quyen.chucNang.includes('buoihoc') // cùng leaf với tab chấm bên ERP

  // Lớp phụ trách vai GV (chốt ④) — nguồn cho tab Học sinh + Lớp.
  const lopsGv: Lop[] = []
  const seenLop = new Set<string>()
  for (const pc of profile.phanCong) {
    if (pc.vai_tro !== 'gv' || !pc.lop || seenLop.has(pc.lop_id)) continue
    seenLop.add(pc.lop_id); lopsGv.push(pc.lop)
  }
  lopsGv.sort((a, b) => a.ten_lop.localeCompare(b.ten_lop, 'vi'))

  async function reload(silent = false) {
    if (!silent) setLoading(true)
    try {
      const all = await getMyTasks().catch(() => [] as MyTask[])
      setTasks(all.filter((x) => x.vai === 'gv' && (x.tab === 'danhgia' || x.tab === 'ingame')))
    } finally { setLoading(false) }
    gvDashboard(homNay.slice(0, 7)).then(setDashTom).catch(() => setDashTom(null)) // best-effort, không chặn trang chủ
    buoiAoCuaNgay(homNay).then((all) => setBuoiHomNay(all.filter((b) => seenLop.has(b.lop.id)))).catch(() => setBuoiHomNay([]))
  }
  function moTruocBuoi(lopId: string) { setLopInit({ lopId, sub: 'truocbuoi', n: Date.now() }); setTab('lop') }
  useEffect(() => { reload() }, []) // eslint-disable-line
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id) }, [])
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible' && !view) reload(true) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [view]) // eslint-disable-line

  if (view) return <ChamBuoiGv view={view} onBack={() => { setView(null); reload(true) }} />

  // Sắp theo thời gian GẦN → XA (CEO 31/08) — preview box trang chủ cũng ăn theo thứ tự này.
  const canLam = tasks.filter((t) => !t.done).sort((a, b) => b.ngay.localeCompare(a.ngay) || a.lop.localeCompare(b.lop))
  const noCua = (k: NvKey) => canLam.filter((t) => t.tab === k).length

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'home' && <TrangChu profile={profile} homNay={homNay} loading={loading} coQuyen={coQuyen} tasks={tasks} canLam={canLam} noCua={noCua} now={now} onGo={setTab} dashTom={dashTom}
          buoiHomNay={buoiHomNay} coLop={lopsGv.length > 0} onTruocBuoi={moTruocBuoi} />}
        {tab === 'viec' && <ViecTab tasks={tasks} now={now} homNay={homNay} onOpen={setView} />}
        {tab === 'hs' && <HocSinhView lops={lopsGv} />}
        {tab === 'lop' && <LopView key={lopInit?.n ?? 0} lops={lopsGv} init={lopInit} />}
        {tab === 'dash' && <DashGv />}
      </div>
      {/* Nút 🐞 chuyển vào HeaderBar trang chủ (góc trên phải) — CEO 31/08: nổi đè mọi màn vướng thao tác. */}

      {/* bottom tab — active = pill màu (khuôn OpsHome), chừa safe-area */}
      <div className="border-t border-slate-200 bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[1000px]">
          <TabBtn active={tab === 'home'} icon="🏠" label="Hôm nay" pill="bg-slate-200/70" text="text-slate-700" no={0} onClick={() => setTab('home')} />
          <TabBtn active={tab === 'viec'} icon="✍️" label="Việc chấm" pill="bg-green-100" text="text-green-700" no={canLam.length} onClick={() => setTab('viec')} />
          <TabBtn active={tab === 'hs'} icon="🧑‍🎓" label="Học sinh" pill="bg-sky-100" text="text-sky-700" no={0} onClick={() => setTab('hs')} />
          <TabBtn active={tab === 'lop'} icon="📊" label="Lớp" pill="bg-violet-100" text="text-violet-700" no={0} onClick={() => setTab('lop')} />
          <TabBtn active={tab === 'dash'} icon="📈" label="Của tôi" pill="bg-amber-100" text="text-amber-700" no={0} onClick={() => setTab('dash')} />
        </div>
      </div>
    </div>
  )
}

function TabBtn({ active, icon, label, pill, text, no, onClick }: { active: boolean; icon: string; label: string; pill: string; text: string; no: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5">
      <span className={`relative rounded-full px-3.5 py-0.5 text-[17px] leading-[24px] transition ${active ? pill : ''}`}>{icon}<NoBadge n={no} small /></span>
      <span className={`text-[10px] font-semibold ${active ? text : 'text-slate-400'}`}>{label}</span>
    </button>
  )
}

function HeaderBar({ profile, sub }: { profile: MyProfile; sub: string }) {
  const ten = (profile.nhanSu.ho_ten ?? '').trim()
  const tenGoi = ten.split(/\s+/).pop() || 'bạn'
  return (
    <div className="border-b border-slate-200/60 bg-white px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
      <div className="mx-auto flex max-w-[1000px] items-center gap-2.5">
        {profile.nhanSu.anh_url
          ? <img src={profile.nhanSu.anh_url} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" />
          : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-[13px] font-bold text-green-700">{tenGoi.charAt(0).toUpperCase()}</span>}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13.5px] font-bold text-slate-800">{ten}</p>
          <p className="text-[11px] text-slate-400">{sub}</p>
        </div>
        <GopY route="home" />
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg px-2.5 py-1.5 text-[12px] text-slate-400 active:bg-slate-100">Thoát</button>
      </div>
    </div>
  )
}

// ── TRANG CHỦ: hero mỏng + box dashboard + 2 box nghiệp vụ ──
function TrangChu({ profile, homNay, loading, coQuyen, tasks, canLam, noCua, now, onGo, dashTom, buoiHomNay, coLop, onTruocBuoi }: {
  profile: MyProfile; homNay: string; loading: boolean; coQuyen: boolean
  tasks: MyTask[]; canLam: MyTask[]; noCua: (k: NvKey) => number; now: number; onGo: (t: TabKey) => void
  dashTom: GvDash | null; buoiHomNay: BuoiAo[]; coLop: boolean; onTruocBuoi: (lopId: string) => void
}) {
  const tenGoi = (profile.nhanSu.ho_ten ?? '').trim().split(/\s+/).pop() || 'bạn'
  const quaHan = canLam.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
  return (
    <div>
      <HeaderBar profile={profile} sub="BK Giáo viên" />
      <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
        <div className="relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 shadow-sm shadow-green-200">
          <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold text-white">Chào {tenGoi} 👋 <span className="font-medium text-green-100">· {thuCuaNgay(homNay)} {ddmmVN(homNay)}</span></p>
              <p className="mt-0.5 text-[12px] font-medium text-green-50">
                {loading ? 'Đang tải…' : !coQuyen ? 'Tài khoản chưa được cấp quyền màn Buổi học' : canLam.length === 0 ? '✓ Không còn việc chờ' : `Đang nợ ${canLam.length} việc${quaHan ? ` · ${quaHan} quá hạn` : ''}`}
              </p>
            </div>
            {!loading && canLam.length > 0 && <span className="shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-[15px] font-bold text-white">{canLam.length}</span>}
          </div>
        </div>

        {!loading && coQuyen && <BoxDashThang d={dashTom} onGo={() => onGo('dash')} />}

        {!loading && coLop && <BoxTruocBuoi buoi={buoiHomNay} onOpen={onTruocBuoi} onGoLop={() => onGo('lop')} />}

        {!loading && coQuyen && (
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
            {NGHIEP_VU.map((n) => {
              const cua = canLam.filter((t) => t.tab === n.key)
              const xong = tasks.filter((t) => t.tab === n.key && t.done).length
              const preview = cua.slice(0, 3)
              return (
                <button key={n.key} onClick={() => onGo('viec')} className="rounded-2xl border border-slate-200/70 bg-white p-3.5 text-left shadow-sm active:bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[21px] ${n.chip}`}>{n.icon}<NoBadge n={noCua(n.key)} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold text-slate-800">{n.label}</p>
                      <p className="text-[12px] text-slate-400">
                        {cua.length === 0 ? (xong > 0 ? `✓ Đã xong ${xong} buổi` : 'Không có việc') : `${cua.length} buổi chờ${xong ? ` · ${xong} đã xong` : ''}`}
                      </p>
                    </div>
                    <span className="text-slate-300">›</span>
                  </div>
                  {preview.length > 0 && (
                    <div className="mt-2.5 flex flex-col gap-1.5">
                      {preview.map((t) => <RowMini key={t.buoiId + t.tab} t={t} now={now} homNay={homNay} />)}
                      {cua.length > 3 && <p className="px-1 text-[11.5px] font-medium text-slate-400">+ {cua.length - 3} buổi nữa…</p>}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Box "📈 Công việc tháng này" — tầng A (chưa mốc thưởng/xếp hạng — CEO 31/08, hiện ở DashGv là đủ).
function BoxDashThang({ d, onGo }: { d: GvDash | null; onGo: () => void }) {
  const me = d?.me ?? {}
  const pct = me.pct ?? null
  const coViec = (me.tong ?? 0) > 0
  return (
    <button onClick={onGo} className="mb-3 w-full rounded-2xl border border-slate-200/70 bg-white p-3.5 text-left shadow-sm active:bg-slate-50">
      <div className="flex items-center gap-2.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[21px]">📈</span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-slate-800">Công việc tháng này</p>
          <p className="text-[12px] text-slate-400">
            {!d ? 'Đạt chuẩn / đến hạn — đánh giá + chấm bài'
              : !coViec ? 'Tháng này chưa có buổi của lớp bạn'
              : `Đạt chuẩn ${me.dat ?? 0}/${me.den_han ?? 0} việc đến hạn${(me.khong_dat ?? 0) > 0 ? ` · lỡ ${me.khong_dat}` : ''}`}
          </p>
        </div>
        {coViec && pct != null && <span className={`text-[22px] font-extrabold ${pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{pct}%</span>}
        <span className="text-slate-300">›</span>
      </div>
      {coViec && (
        <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${(pct ?? 0) >= 80 ? 'bg-green-500' : (pct ?? 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct ?? 0}%` }} />
        </div>
      )}
    </button>
  )
}

// Box "📋 Trước buổi hôm nay" (CEO 04/09): lớp mình có buổi HÔM NAY theo TKB (buổi ảo — chưa cần OPS mở),
// mỗi lớp 1 hàng → mở tab Lớp đúng lớp, sub Trước buổi. Không có buổi → đường tắt sang tab Lớp.
function BoxTruocBuoi({ buoi, onOpen, onGoLop }: { buoi: BuoiAo[]; onOpen: (lopId: string) => void; onGoLop: () => void }) {
  const rows = [...buoi].sort((a, b) => a.slot.gio_bat_dau.localeCompare(b.slot.gio_bat_dau) || a.lop.ten_lop.localeCompare(b.lop.ten_lop, 'vi'))
  return (
    <div className="mb-3 rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
      <button onClick={onGoLop} className="flex w-full items-center gap-2.5 text-left">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-[21px]">📋</span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-slate-800">Trước buổi</p>
          <p className="text-[12px] text-slate-400">{rows.length ? `Hôm nay ${rows.length} lớp có buổi — xem tình hình lớp trước giờ dạy` : 'Hôm nay lớp bạn không có buổi · xem lớp khác ở tab Lớp'}</p>
        </div>
        <span className="text-slate-300">›</span>
      </button>
      {rows.length > 0 && (
        <div className="mt-2.5 flex flex-col gap-1.5">
          {rows.map((b) => (
            <button key={b.lop.id} onClick={() => onOpen(b.lop.id)} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-left active:bg-slate-100">
              <span className="text-[13px] font-semibold text-slate-800">{b.lop.ten_lop}</span>
              <span className="min-w-0 truncate text-[11.5px] text-slate-400">{b.lop.mon} · {b.slot.gio_bat_dau.slice(0, 5)}{b.slot.phong ? ` · ${b.slot.phong}` : ''}</span>
              <span className="ml-auto shrink-0 text-[11.5px] font-semibold text-violet-600">Xem ›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RowMini({ t, now, homNay }: { t: MyTask; now: number; homNay: string }) {
  const muc = mucDeadline(t.deadline, now)
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-[13px] font-semibold text-slate-800">{t.lop}</span>
      <span className="min-w-0 truncate text-[11.5px] text-slate-400">{t.ngay === homNay ? 'hôm nay' : `${thuCuaNgay(t.ngay)} ${ddmmVN(t.ngay)}`}</span>
      {t.deadline != null && (
        <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${muc === 'qua_han' ? 'bg-rose-100 text-rose-700' : muc === 'sat' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200/60 text-slate-500'}`}>
          {muc === 'qua_han' ? '⚠ quá hạn' : nhanConLai(t.deadline, now)}
        </span>
      )}
    </div>
  )
}

// ── TAB VIỆC CHẤM: card việc CẢ 2 khâu, nhóm theo ngày + Đã xong collapse (khuôn ViecTab app TA) ──
function ViecTab({ tasks, now, homNay, onOpen }: {
  tasks: MyTask[]; now: number; homNay: string; onOpen: (v: BuoiViewGv) => void
}) {
  const [xemXong, setXemXong] = useState(false)
  // GẦN → XA (CEO 31/08): ngày giảm dần — hôm nay trên cùng, nợ cũ dần xuống dưới.
  const canLam = tasks.filter((t) => !t.done).sort((a, b) => b.ngay.localeCompare(a.ngay) || a.lop.localeCompare(b.lop) || a.tab.localeCompare(b.tab))
  const daXong = tasks.filter((t) => t.done).sort((a, b) => (b.doneAt ?? '').localeCompare(a.doneAt ?? '')).slice(0, 20)
  const ngays = [...new Set(canLam.map((t) => t.ngay))]
  return (
    <div>
      <div className="bg-green-600 px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <p className="mx-auto max-w-[1000px] text-[15px] font-bold text-white">✍️ Việc chấm <span className="font-medium opacity-75">· {canLam.length ? `${canLam.length} việc chờ` : 'sạch nợ ✓'}</span></p>
      </div>
      <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
        {canLam.length === 0 && <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">Không có việc nào chờ 🎉</p>}
        <div className="flex flex-col gap-3">
          {ngays.map((ngay) => (
            <div key={ngay}>
              <p className={`mb-1.5 px-1 text-[12px] font-bold uppercase tracking-wide ${ngay < homNay ? 'text-rose-500' : 'text-slate-400'}`}>
                {ngay < homNay ? '⚠ Còn nợ · ' : ''}{ngay === homNay ? 'Hôm nay · ' : ''}{thuCuaNgay(ngay)} · {ddmmVN(ngay)}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {canLam.filter((t) => t.ngay === ngay).map((t) => {
                  const muc = mucDeadline(t.deadline, now)
                  const nv = nvOf(t.tab as NvKey)
                  return (
                    <button key={t.buoiId + t.tab} onClick={() => onOpen({ buoiId: t.buoiId, tab: t.tab as NvKey, lop: t.lop, ngay: t.ngay })}
                      className="flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white p-3 text-left shadow-sm active:bg-slate-50">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[19px] ${nv.chip}`}>{nv.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-bold text-slate-800">{t.lop} <span className="font-medium text-slate-400">· {nv.label}</span></p>
                        <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-slate-400">
                          {t.deadline != null && (
                            <span className={muc === 'qua_han' ? 'font-semibold text-rose-500' : muc === 'sat' ? 'font-semibold text-orange-500' : ''}>
                              {muc === 'qua_han' ? '⚠ quá hạn' : `hạn ${nhanConLai(t.deadline, now)}`}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-slate-300">›</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {daXong.length > 0 && (
          <div className="mt-3">
            <button onClick={() => setXemXong(!xemXong)} className="px-1 text-[12.5px] font-semibold text-slate-400">
              {xemXong ? '▾' : '▸'} Đã xong ({daXong.length})
            </button>
            {xemXong && (
              <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {daXong.map((t) => (
                  <button key={t.buoiId + t.tab + 'd'} onClick={() => onOpen({ buoiId: t.buoiId, tab: t.tab as NvKey, lop: t.lop, ngay: t.ngay })}
                    className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-left">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-[13px] font-medium text-slate-500">{t.lop} · {nvOf(t.tab as NvKey).label}</span>
                    <span className="ml-auto text-[11.5px] text-slate-400">{ddmmVN(t.ngay)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
