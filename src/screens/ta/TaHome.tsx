// TaHome — shell + trang chủ app TRỢ GIẢNG. REDESIGN 30/08 theo CEO duyệt (đúng khuôn OpsHome):
// · Trang chủ = MỖI NGHIỆP VỤ 1 BOX (Bài trên lớp / Chấm ET / Chấm BTVN), góc icon có BUBBLE ĐỎ
//   số việc đang nợ (kiểu noti). Bấm box → tab list card việc của nghiệp vụ đó. Bấm card → deeplink
//   ChamBuoi như cũ.
// · Bottom-tab: Hôm nay + 3 nghiệp vụ (mỗi tab cũng có bubble nợ) — giống hệt cấu trúc app OPS.
// · Header trắng gọn 1 hàng (avatar + tên + thoát) — như OpsHome, hero thu nhỏ.
// Việc = getMyTasks() (CÙNG derive với "Việc của tôi" ERP — 1 nguồn). Badge 📱 = số HS nộp BTVN app.
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { MyProfile } from '../../lib/nhansu'
import type { MyQuyen } from '../../lib/quyen'
import { getMyTasks, type MyTask } from '../../lib/gami'
import { demNopTheoBuois } from '../../lib/btvnnop'
import { homNayVN, ddmmVN, thuCuaNgay, mucDeadline, nhanConLai } from '../../lib/tuan'
import ChamBuoi from './ChamBuoi'
import DashTa from './DashTa'
import GopY from './GopY'

type NvKey = 'ingame' | 'et' | 'btvn'
type TabKey = 'home' | NvKey | 'dash'
// ⚠ Tailwind JIT: class màu là CHUỖI LITERAL per nghiệp vụ (cấm ghép chuỗi động) — bài học OpsHome.
const NGHIEP_VU: { key: NvKey; icon: string; label: string; chip: string; pill: string; text: string; strip: string }[] = [
  { key: 'ingame', icon: '📝', label: 'Bài trên lớp', chip: 'bg-sky-50', pill: 'bg-sky-100', text: 'text-sky-700', strip: 'bg-sky-600' },
  { key: 'et', icon: '🧪', label: 'Chấm ET', chip: 'bg-violet-50', pill: 'bg-violet-100', text: 'text-violet-700', strip: 'bg-violet-600' },
  { key: 'btvn', icon: '📚', label: 'Chấm BTVN', chip: 'bg-teal-50', pill: 'bg-teal-100', text: 'text-teal-700', strip: 'bg-teal-600' },
]
const nvOf = (k: NvKey) => NGHIEP_VU.find((n) => n.key === k)!

export type BuoiView = { buoiId: string; tab: NvKey; lop: string; ngay: string }

// Bubble đỏ số việc nợ (kiểu noti) — dùng ở góc icon box + góc icon bottom-tab.
function NoBadge({ n, small }: { n: number; small?: boolean }) {
  if (n <= 0) return null
  return (
    <span className={`absolute flex items-center justify-center rounded-full bg-rose-500 font-bold text-white ring-2 ring-white ${small ? '-right-1.5 -top-1 h-4 min-w-4 px-0.5 text-[9.5px]' : '-right-1.5 -top-1.5 h-5 min-w-5 px-1 text-[11px]'}`}>{n > 99 ? '99+' : n}</span>
  )
}

export default function TaHome({ profile, quyen }: { profile: MyProfile; quyen: MyQuyen }) {
  const homNay = homNayVN()
  const [tab, setTab] = useState<TabKey>('home')
  const [view, setView] = useState<BuoiView | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<MyTask[]>([])
  const [nopCount, setNopCount] = useState<Record<string, number>>({})
  const [now, setNow] = useState(() => Date.now())
  const coQuyen = quyen.laAdmin || quyen.chucNang.includes('buoihoc') // cùng leaf với tab chấm bên ERP

  async function reload(silent = false) {
    if (!silent) setLoading(true)
    try {
      const all = await getMyTasks().catch(() => [] as MyTask[])
      const t = all.filter((x) => x.tab === 'ingame' || x.tab === 'et' || x.tab === 'btvn')
      setTasks(t)
      const btvnBuois = [...new Set(t.filter((x) => x.tab === 'btvn').map((x) => x.buoiId))]
      setNopCount(btvnBuois.length ? await demNopTheoBuois(btvnBuois).catch(() => ({})) : {})
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id) }, [])
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible' && !view) reload(true) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [view]) // eslint-disable-line

  if (view) return <ChamBuoi view={view} onBack={() => { setView(null); reload(true) }} />

  const canLam = tasks.filter((t) => !t.done)
  const noCua = (k: NvKey) => canLam.filter((t) => t.tab === k).length

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'home' && <TrangChu profile={profile} homNay={homNay} loading={loading} coQuyen={coQuyen} tasks={tasks} canLam={canLam} noCua={noCua} now={now} onGo={setTab} />}
        {tab === 'dash' && <DashTa />}
        {tab !== 'home' && tab !== 'dash' && <ViecTab key={tab} nv={nvOf(tab)} tasks={tasks.filter((t) => t.tab === tab)} nopCount={nopCount} now={now} homNay={homNay} onOpen={setView} />}
      </div>
      <GopY route={tab} />

      {/* bottom tab — active = pill màu (khuôn OpsHome), mỗi nghiệp vụ có bubble nợ, chừa safe-area */}
      <div className="border-t border-slate-200 bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[1000px]">
          <TabBtn active={tab === 'home'} icon="🏠" label="Hôm nay" pill="bg-slate-200/70" text="text-slate-700" no={0} onClick={() => setTab('home')} />
          {NGHIEP_VU.map((n) => (
            <TabBtn key={n.key} active={tab === n.key} icon={n.icon} label={n.label} pill={n.pill} text={n.text} no={noCua(n.key)} onClick={() => setTab(n.key)} />
          ))}
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

// ── Header trắng gọn 1 hàng — dùng chung trang chủ + tab nghiệp vụ ──
function HeaderBar({ profile, sub }: { profile: MyProfile; sub: string }) {
  const ten = (profile.nhanSu.ho_ten ?? '').trim()
  const tenGoi = ten.split(/\s+/).pop() || 'bạn'
  return (
    <div className="border-b border-slate-200/60 bg-white px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
      <div className="mx-auto flex max-w-[1000px] items-center gap-2.5">
        {profile.nhanSu.anh_url
          ? <img src={profile.nhanSu.anh_url} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" />
          : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-[13px] font-bold text-teal-700">{tenGoi.charAt(0).toUpperCase()}</span>}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13.5px] font-bold text-slate-800">{ten}</p>
          <p className="text-[11px] text-slate-400">{sub}</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg px-2.5 py-1.5 text-[12px] text-slate-400 active:bg-slate-100">Thoát</button>
      </div>
    </div>
  )
}

// ── TRANG CHỦ: hero mỏng + 3 box nghiệp vụ (bubble nợ ở góc icon, bấm box → tab list việc) ──
function TrangChu({ profile, homNay, loading, coQuyen, tasks, canLam, noCua, now, onGo }: {
  profile: MyProfile; homNay: string; loading: boolean; coQuyen: boolean
  tasks: MyTask[]; canLam: MyTask[]; noCua: (k: NvKey) => number; now: number; onGo: (t: TabKey) => void
}) {
  const tenGoi = (profile.nhanSu.ho_ten ?? '').trim().split(/\s+/).pop() || 'bạn'
  const quaHan = canLam.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
  return (
    <div>
      <HeaderBar profile={profile} sub="BK Trợ giảng" />
      <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
        {/* hero MỎNG: 1 dải gradient thấp, chỉ chào + tổng nợ */}
        <div className="relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-3 shadow-sm shadow-teal-200">
          <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-bold text-white">Chào {tenGoi} 👋 <span className="font-medium text-teal-100">· {thuCuaNgay(homNay)} {ddmmVN(homNay)}</span></p>
              <p className="mt-0.5 text-[12px] font-medium text-teal-50">
                {loading ? 'Đang tải…' : !coQuyen ? 'Tài khoản chưa được cấp quyền màn Buổi học' : canLam.length === 0 ? '✓ Không còn bài chờ chấm' : `Đang nợ ${canLam.length} việc chấm${quaHan ? ` · ${quaHan} quá hạn` : ''}`}
              </p>
            </div>
            {!loading && canLam.length > 0 && <span className="shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-[15px] font-bold text-white">{canLam.length}</span>}
          </div>
        </div>

        {!loading && coQuyen && (
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3">
            {NGHIEP_VU.map((n) => {
              const cua = canLam.filter((t) => t.tab === n.key)
              const xong = tasks.filter((t) => t.tab === n.key && t.done).length
              const preview = cua.slice(0, 3)
              return (
                <button key={n.key} onClick={() => onGo(n.key)} className="rounded-2xl border border-slate-200/70 bg-white p-3.5 text-left shadow-sm active:bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[21px] ${n.chip}`}>{n.icon}<NoBadge n={noCua(n.key)} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold text-slate-800">{n.label}</p>
                      <p className="text-[12px] text-slate-400">
                        {cua.length === 0 ? (xong > 0 ? `✓ Đã xong ${xong} buổi` : 'Không có việc') : `${cua.length} buổi chờ chấm${xong ? ` · ${xong} đã xong` : ''}`}
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

function RowMini({ t, now, homNay }: { t: MyTask; now: number; homNay: string }) {
  const muc = mucDeadline(t.deadline, now)
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-[13px] font-semibold text-slate-800">{t.lop}</span>
      <span className="min-w-0 truncate text-[11.5px] text-slate-400">{t.ngay === homNay ? 'hôm nay' : `${thuCuaNgay(t.ngay)} ${ddmmVN(t.ngay)}`}{t.loai ? ` · ${t.loai === 'bu' ? 'buổi bù' : t.loai}` : ''}</span>
      {t.deadline != null && (
        <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${muc === 'qua_han' ? 'bg-rose-100 text-rose-700' : muc === 'sat' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200/60 text-slate-500'}`}>
          {muc === 'qua_han' ? '⚠ quá hạn' : nhanConLai(t.deadline, now)}
        </span>
      )}
    </div>
  )
}

// ── TAB 1 NGHIỆP VỤ: dải màu mỏng + list card việc (nhóm theo ngày) + Đã xong collapse ──
function ViecTab({ nv, tasks, nopCount, now, homNay, onOpen }: {
  nv: (typeof NGHIEP_VU)[number]; tasks: MyTask[]; nopCount: Record<string, number>
  now: number; homNay: string; onOpen: (v: BuoiView) => void
}) {
  const [xemXong, setXemXong] = useState(false)
  const canLam = tasks.filter((t) => !t.done).sort((a, b) => a.ngay.localeCompare(b.ngay) || a.lop.localeCompare(b.lop))
  const daXong = tasks.filter((t) => t.done).sort((a, b) => (b.doneAt ?? '').localeCompare(a.doneAt ?? '')).slice(0, 20)
  const ngays = [...new Set(canLam.map((t) => t.ngay))]
  return (
    <div>
      <div className={`${nv.strip} px-4 pb-2`} style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <p className="mx-auto max-w-[1000px] text-[15px] font-bold text-white">{nv.icon} {nv.label} <span className="font-medium opacity-75">· {canLam.length ? `${canLam.length} buổi chờ chấm` : 'sạch nợ ✓'}</span></p>
      </div>
      <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
        {canLam.length === 0 && <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">Không có buổi nào chờ chấm 🎉</p>}
        <div className="flex flex-col gap-3">
          {ngays.map((ngay) => (
            <div key={ngay}>
              <p className={`mb-1.5 px-1 text-[12px] font-bold uppercase tracking-wide ${ngay < homNay ? 'text-rose-500' : 'text-slate-400'}`}>
                {ngay < homNay ? '⚠ Còn nợ · ' : ''}{ngay === homNay ? 'Hôm nay · ' : ''}{thuCuaNgay(ngay)} · {ddmmVN(ngay)}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {canLam.filter((t) => t.ngay === ngay).map((t) => {
                  const muc = mucDeadline(t.deadline, now)
                  const nop = t.tab === 'btvn' ? nopCount[t.buoiId] ?? 0 : 0
                  return (
                    <button key={t.buoiId + t.vai} onClick={() => onOpen({ buoiId: t.buoiId, tab: nv.key, lop: t.lop, ngay: t.ngay })}
                      className="flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white p-3 text-left shadow-sm active:bg-slate-50">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[19px] ${nv.chip}`}>{nv.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-bold text-slate-800">{t.lop}</p>
                        <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-slate-400">
                          {t.loai && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500">{t.loai === 'bu' ? 'buổi bù' : t.loai}</span>}
                          {nop > 0 && <span className="rounded bg-teal-50 px-1.5 py-0.5 font-semibold text-teal-700">📱 {nop} nộp app</span>}
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
                  <button key={t.buoiId + 'd'} onClick={() => onOpen({ buoiId: t.buoiId, tab: nv.key, lop: t.lop, ngay: t.ngay })}
                    className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-left">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-[13px] font-medium text-slate-500">{t.lop}</span>
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
