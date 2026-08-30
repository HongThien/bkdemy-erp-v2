// TaHome — shell + trang chủ app TRỢ GIẢNG (PLAN-app-ta.md §4-5, Thùy chốt 30/08). Khuôn OpsHome:
// bar trắng + hero card gradient (teal) + card việc, bottom-tab. Việc = getMyTasks() (CÙNG derive
// với "Việc của tôi" ERP — 1 nguồn) lọc 3 khâu app hỗ trợ v1: chấm bài trên lớp · chấm ET · chấm
// BTVN. Bấm card → ChamBuoi đúng tab. Badge 📱 = số HS đã nộp BTVN qua app (CEO ④: TA phải biết).
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { MyProfile } from '../../lib/nhansu'
import type { MyQuyen } from '../../lib/quyen'
import { getMyTasks, type MyTask, type TabKey } from '../../lib/gami'
import { demNopTheoBuois } from '../../lib/btvnnop'
import { homNayVN, ddmmVN, thuCuaNgay, mucDeadline, nhanConLai } from '../../lib/tuan'
import ChamBuoi from './ChamBuoi'

const APP_TABS: TabKey[] = ['ingame', 'et', 'btvn'] // v1 — mt/baosai/danhgia ở lại ERP
const TAB_META: Record<string, { icon: string; chip: string; accent: string }> = {
  ingame: { icon: '📝', chip: 'bg-sky-50', accent: 'text-sky-700' },
  et: { icon: '🧪', chip: 'bg-violet-50', accent: 'text-violet-700' },
  btvn: { icon: '🏠', chip: 'bg-teal-50', accent: 'text-teal-700' },
}

export type BuoiView = { buoiId: string; tab: 'ingame' | 'et' | 'btvn'; lop: string; ngay: string }

export default function TaHome({ profile, quyen }: { profile: MyProfile; quyen: MyQuyen }) {
  const [view, setView] = useState<BuoiView | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  if (view) return <ChamBuoi view={view} onBack={() => { setView(null); setReloadKey((k) => k + 1) }} />
  return <HomNay key={reloadKey} profile={profile} quyen={quyen} onOpen={setView} />
}

function ProgressRing({ done, tong }: { done: number; tong: number }) {
  const r = 21, c = 2 * Math.PI * r
  const phan = tong > 0 ? done / tong : 1
  return (
    <svg width="56" height="56" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="5" />
      <circle cx="26" cy="26" r={r} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round"
        strokeDasharray={`${c * phan} ${c}`} transform="rotate(-90 26 26)" />
      <text x="26" y="30" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#fff">{done}/{tong}</text>
    </svg>
  )
}

function HomNay({ profile, quyen, onOpen }: { profile: MyProfile; quyen: MyQuyen; onOpen: (v: BuoiView) => void }) {
  const homNay = homNayVN()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<MyTask[]>([])
  const [nopCount, setNopCount] = useState<Record<string, number>>({})
  const [xemXong, setXemXong] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  // Quyền màn: cùng leaf `buoihoc` với tab chấm bên ERP — không đẻ leaf mới.
  const coQuyen = quyen.laAdmin || quyen.chucNang.includes('buoihoc')

  async function reload(silent = false) {
    if (!silent) setLoading(true)
    try {
      const all = await getMyTasks().catch(() => [] as MyTask[])
      const t = all.filter((x) => APP_TABS.includes(x.tab))
      setTasks(t)
      const btvnBuois = [...new Set(t.filter((x) => x.tab === 'btvn').map((x) => x.buoiId))]
      setNopCount(btvnBuois.length ? await demNopTheoBuois(btvnBuois).catch(() => ({})) : {})
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id) }, [])
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible') reload(true) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, []) // eslint-disable-line

  const canLam = tasks.filter((t) => !t.done).sort((a, b) => a.ngay.localeCompare(b.ngay) || a.lop.localeCompare(b.lop))
  const daXong = tasks.filter((t) => t.done).sort((a, b) => (b.doneAt ?? '').localeCompare(a.doneAt ?? '')).slice(0, 20)
  const tongHomNay = tasks.filter((t) => t.ngay <= homNay).length
  const xongHomNay = tasks.filter((t) => t.ngay <= homNay && t.done).length
  const tenGoi = (profile.nhanSu.ho_ten ?? '').trim().split(/\s+/).pop() || 'bạn'
  const nsAnh = profile.nhanSu.anh_url

  // nhóm cần-làm theo ngày (quá hạn nổi trước — ngày cũ đứng đầu vì sort asc)
  const ngays = [...new Set(canLam.map((t) => t.ngay))]

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="border-b border-slate-200/60 bg-white px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto flex max-w-[760px] items-center gap-2.5">
          {nsAnh
            ? <img src={nsAnh} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" />
            : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-[13px] font-bold text-teal-700">{tenGoi.charAt(0).toUpperCase()}</span>}
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13.5px] font-bold text-slate-800">{profile.nhanSu.ho_ten}</p>
            <p className="text-[11px] text-slate-400">BK Trợ giảng</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="rounded-lg px-2.5 py-1.5 text-[12px] text-slate-400 active:bg-slate-100">Thoát</button>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-3 pb-10 pt-3">
        <div className="relative mb-3 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 p-4 shadow-md shadow-teal-200">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-14 right-16 h-28 w-28 rounded-full bg-white/[0.07]" />
          <div className="relative flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-medium text-teal-100">{thuCuaNgay(homNay)} · {ddmmVN(homNay)}</p>
              <p className="mt-0.5 truncate text-[21px] font-bold text-white">Chào {tenGoi} 👋</p>
              <p className="mt-1 inline-block rounded-full bg-white/15 px-2.5 py-1 text-[12.5px] font-medium text-teal-50">
                {loading ? 'Đang tải việc chấm…' : !coQuyen ? 'Tài khoản chưa được cấp quyền màn Buổi học' : canLam.length === 0 ? '✓ Không còn bài chờ chấm, đỉnh!' : `Còn ${canLam.length} việc chấm`}
              </p>
            </div>
            {!loading && tongHomNay > 0 && <ProgressRing done={xongHomNay} tong={tongHomNay} />}
          </div>
        </div>

        {!loading && coQuyen && (
          <div className="flex flex-col gap-3">
            {ngays.map((ngay) => (
              <div key={ngay}>
                <p className={`mb-1.5 px-1 text-[12px] font-bold uppercase tracking-wide ${ngay < homNay ? 'text-rose-500' : 'text-slate-400'}`}>
                  {ngay < homNay ? '⚠ Còn nợ · ' : ''}{thuCuaNgay(ngay)} · {ddmmVN(ngay)}
                </p>
                <div className="flex flex-col gap-2">
                  {canLam.filter((t) => t.ngay === ngay).map((t) => {
                    const m = TAB_META[t.tab]
                    const muc = mucDeadline(t.deadline, now)
                    const nop = t.tab === 'btvn' ? nopCount[t.buoiId] ?? 0 : 0
                    return (
                      <button key={t.buoiId + t.tab + t.vai} onClick={() => onOpen({ buoiId: t.buoiId, tab: t.tab as BuoiView['tab'], lop: t.lop, ngay: t.ngay })}
                        className="flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white p-3 text-left shadow-sm active:bg-slate-50">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[19px] ${m.chip}`}>{m.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-bold text-slate-800">{t.label} · {t.lop}</p>
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
            {canLam.length === 0 && <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">Không có bài nào chờ chấm 🎉</p>}

            {daXong.length > 0 && (
              <div className="mt-1">
                <button onClick={() => setXemXong(!xemXong)} className="px-1 text-[12.5px] font-semibold text-slate-400">
                  {xemXong ? '▾' : '▸'} Đã xong ({daXong.length})
                </button>
                {xemXong && (
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    {daXong.map((t) => (
                      <button key={t.buoiId + t.tab + 'd'} onClick={() => onOpen({ buoiId: t.buoiId, tab: t.tab as BuoiView['tab'], lop: t.lop, ngay: t.ngay })}
                        className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-left">
                        <span className="text-emerald-500">✓</span>
                        <span className="text-[13px] font-medium text-slate-500">{t.label} · {t.lop}</span>
                        <span className="ml-auto text-[11.5px] text-slate-400">{ddmmVN(t.ngay)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
