// OpsHome — shell + trang chủ app OPS (PLAN-app-ops.md). Bottom-tab (chạm, iPad/iPhone-first).
// UI REDESIGN 30/08 (Thùy duyệt mockup): style "app giáo dục làm việc" — mỗi tab 1 màu chủ đạo, hero
// đậm màu + vòng tiến độ việc trong ngày, card việc có icon squircle màu theo loại, bottom-tab active
// = pill màu, font Be Vietnam Pro (đã load ở ops.html). Nền vẫn sáng kiểu iPhone (KHÔNG sci-fi).
// ⚠ Tailwind JIT: class màu phải là CHUỖI LITERAL per-tab (cấm ghép chuỗi động).
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { MyProfile } from '../../lib/nhansu'
import type { MyQuyen } from '../../lib/quyen'
import { myBuoiAoCuaKhoang, getMyOpsTasks, getMyPrepTasks, OPS_TASK_LABEL, type OpsTask, type MyPrepTask } from '../../lib/opsvanhanh'
import { listCaTestDangChay, type CaTest } from '../../lib/tuyensinh'
import { homNayVN, ddmmVN, thuCuaNgay, mucDeadline } from '../../lib/tuan'
import { diemDanhTienDo, type BuoiAo } from '../../lib/gami'
import DiemDanhBuoi from './DiemDanhBuoi'
import OpsReportScreen from '../vanhanhops/OpsReportScreen'
import PrepScreen from '../vanhanhops/PrepScreen'
import DiemDanhTestScreen from '../vanhanhops/DiemDanhTestScreen'

type TabKey = 'home' | 'diemdanh' | 'report' | 'prep' | 'test'
// Tab ↔ leaf quyền (cùng leaf-id cây Admin ERP) + bộ màu literal. home luôn hiện.
const TABS: { key: TabKey; leaf: string | null; icon: string; label: string; pill: string; text: string }[] = [
  { key: 'home', leaf: null, icon: '🏠', label: 'Hôm nay', pill: 'bg-indigo-100', text: 'text-indigo-600' },
  { key: 'diemdanh', leaf: 'buoihoc', icon: '✅', label: 'Điểm danh', pill: 'bg-emerald-100', text: 'text-emerald-700' },
  { key: 'report', leaf: 'ops_report', icon: '📨', label: 'Report', pill: 'bg-blue-100', text: 'text-blue-700' },
  { key: 'prep', leaf: 'prep', icon: '🧹', label: 'Prep', pill: 'bg-amber-100', text: 'text-amber-700' },
  { key: 'test', leaf: 'test_dau_vao', icon: '📝', label: 'Test', pill: 'bg-violet-100', text: 'text-violet-700' },
]

const hhmm = (t: string | null) => (t ? t.slice(0, 5) : '—')

export default function OpsHome({ profile, quyen }: { profile: MyProfile; quyen: MyQuyen }) {
  const [tab, setTab] = useState<TabKey>('home')
  const coQuyen = (leaf: string | null) => !leaf || quyen.laAdmin || quyen.chucNang.includes(leaf)
  const tabs = TABS.filter((t) => coQuyen(t.leaf))

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'home' && <HomTay profile={profile} onGo={setTab} coQuyen={coQuyen} onThoat={() => supabase.auth.signOut()} />}
        {tab === 'diemdanh' && <DiemDanhBuoi />}
        {tab === 'report' && <ManCon mau="bg-blue-700"><OpsReportScreen /></ManCon>}
        {tab === 'prep' && <ManCon mau="bg-amber-600"><PrepScreen /></ManCon>}
        {tab === 'test' && <ManCon mau="bg-violet-600"><DiemDanhTestScreen /></ManCon>}
      </div>

      {/* bottom tab bar — active = pill màu (mockup duyệt), chừa safe-area iPhone */}
      <div className="border-t border-slate-200 bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[760px]">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5">
              <span className={`rounded-full px-3.5 py-0.5 text-[17px] leading-[24px] transition ${tab === t.key ? t.pill : ''}`}>{t.icon}</span>
              <span className={`text-[10px] font-semibold ${tab === t.key ? t.text : 'text-slate-400'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Dải màu mỏng cho 3 màn tái dùng từ ERP (chưa restyle sâu) — kéo vào tông màu app + đệm safe-area
// iPhone PWA (màn ERP tự có header chữ nên dải này KHÔNG lặp tiêu đề).
function ManCon({ mau, children }: { mau: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`${mau} pb-2`} style={{ paddingTop: 'max(0.25rem, env(safe-area-inset-top))' }} />
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  )
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

// ── Trang chủ "Hôm nay" — hero tím (chào + vòng tiến độ) + card việc theo loại, bấm → sang tab ──
function HomTay({ profile, onGo, coQuyen, onThoat }: { profile: MyProfile; onGo: (t: TabKey) => void; coQuyen: (leaf: string | null) => boolean; onThoat: () => void }) {
  const homNay = homNayVN()
  const [loading, setLoading] = useState(true)
  const [buoi, setBuoi] = useState<(BuoiAo & { ngay: string })[]>([])
  const [tienDo, setTienDo] = useState<Record<string, { tong: number; daDanh: number }>>({})
  const [opsTasks, setOpsTasks] = useState<OpsTask[]>([])
  const [preps, setPreps] = useState<MyPrepTask[]>([])
  const [caTests, setCaTests] = useState<CaTest[]>([])
  const [now, setNow] = useState(() => Date.now())

  async function reload(silent = false) {
    if (!silent) setLoading(true)
    try {
      const [b, o, p, c] = await Promise.all([
        coQuyen('buoihoc') ? myBuoiAoCuaKhoang(homNay, homNay).catch(() => []) : Promise.resolve([]),
        coQuyen('ops_report') ? getMyOpsTasks(homNay, homNay).catch(() => []) : Promise.resolve([]),
        coQuyen('prep') ? getMyPrepTasks(homNay, homNay).catch(() => []) : Promise.resolve([]),
        coQuyen('test_dau_vao') ? listCaTestDangChay().catch(() => []) : Promise.resolve([]),
      ])
      setBuoi(b); setOpsTasks(o); setPreps(p); setCaTests(c)
      const ids = b.filter((x) => x.buoi && x.buoi.trang_thai !== 'huy').map((x) => x.buoi!.id)
      setTienDo(ids.length ? await diemDanhTienDo(ids).catch(() => ({})) : {})
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id) }, [])
  // Quay lại foreground → refetch (ERP + app = 2 đầu nhập cùng 1 DB).
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible') reload(true) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, []) // eslint-disable-line

  // Buổi "xong" = đã mở + điểm danh đủ. Ring = xong / tổng (mọi nguồn; ca test đang chạy luôn là việc mở).
  const buoiSong = buoi.filter((b) => !b.buoi || b.buoi.trang_thai !== 'huy')
  const buoiXong = buoiSong.filter((b) => { const td = b.buoi && tienDo[b.buoi.id]; return td && td.tong > 0 && td.daDanh >= td.tong })
  const opsXong = opsTasks.filter((t) => t.done)
  const prepXong = preps.filter((p) => p.done)
  const tongViec = buoiSong.length + opsTasks.length + preps.length + caTests.length
  const tongXong = buoiXong.length + opsXong.length + prepXong.length
  const conLai = tongViec - tongXong

  const tenGoi = (profile.nhanSu.ho_ten ?? '').trim().split(/\s+/).pop() || 'bạn'
  const buoiCanDanh = buoiSong.filter((b) => !buoiXong.includes(b))
  const opsCanLam = opsTasks.filter((t) => !t.done)
  const prepCanLam = preps.filter((p) => !p.done)

  return (
    <div>
      {/* hero tím: chào + tiến độ ngày */}
      <div className="bg-indigo-600 px-4 pb-5" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto max-w-[760px]">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wide text-indigo-200">BK Vận hành</span>
            <button onClick={onThoat} className="ml-auto rounded-lg px-2 py-1 text-[12px] text-indigo-200 active:bg-indigo-500">Thoát</button>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] text-indigo-200">{thuCuaNgay(homNay)} · {ddmmVN(homNay)}</p>
              <p className="truncate text-[21px] font-bold text-white">Chào {tenGoi} 👋</p>
              <p className="mt-0.5 text-[13px] text-indigo-100">
                {loading ? 'Đang tải việc hôm nay…' : tongViec === 0 ? 'Hôm nay không có việc — nghỉ ngơi thôi ☕' : conLai === 0 ? '✓ Xong hết việc hôm nay, đỉnh!' : `Còn ${conLai} việc hôm nay`}
              </p>
            </div>
            {!loading && tongViec > 0 && <ProgressRing done={tongXong} tong={tongViec} />}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-3 pb-24 pt-4">
        {!loading && (
          <div className="flex flex-col gap-3">
            {coQuyen('buoihoc') && (
              <SectionCard icon="✅" chip="bg-emerald-50" badge="bg-emerald-600" title="Điểm danh buổi học"
                sub={buoiSong.length ? `${buoiSong.length} buổi trong ca của bạn` : ''} count={buoiCanDanh.length} onGo={() => onGo('diemdanh')}
                empty={buoiSong.length ? '✓ Xong các buổi trong ca trực' : 'Không có ca trực điểm danh hôm nay'}>
                {buoiCanDanh.map((b) => {
                  const td = b.buoi && tienDo[b.buoi.id]
                  return <RowMini key={b.lop.id} main={b.lop.ten_lop} sub={`${hhmm(b.slot.gio_bat_dau)} · ${b.slot.phong ?? '—'}`}
                    badge={b.buoi ? (td ? `${td.daDanh}/${td.tong}` : 'đang mở') : 'chưa mở'}
                    badgeCls={b.buoi ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} />
                })}
              </SectionCard>
            )}
            {coQuyen('ops_report') && (
              <SectionCard icon="📨" chip="bg-blue-50" badge="bg-blue-600" title="Report & Báo tan"
                sub="" count={opsCanLam.length} onGo={() => onGo('report')} empty="✓ Không còn report/báo tan hôm nay">
                {opsCanLam.map((t) => {
                  const muc = mucDeadline(t.deadline, now)
                  const han = new Date(t.deadline).toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
                  return <RowMini key={t.tkbId + t.tab + t.ngay} main={`${OPS_TASK_LABEL[t.tab]} · ${t.lopTen}`} sub={muc === 'qua_han' ? '' : `hạn ${han}`}
                    badge={muc === 'qua_han' ? '⚠ quá hạn' : muc === 'sat' ? 'sát hạn' : han}
                    badgeCls={muc === 'qua_han' ? 'bg-rose-100 text-rose-700' : muc === 'sat' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'} />
                })}
              </SectionCard>
            )}
            {coQuyen('prep') && (
              <SectionCard icon="🧹" chip="bg-amber-50" badge="bg-amber-500" title="Chuẩn bị phòng"
                sub="" count={prepCanLam.length} onGo={() => onGo('prep')}
                empty={preps.length ? '✓ Xong các lượt prep hôm nay' : 'Không có lượt prep hôm nay'}>
                {(['sang', 'chieu', 'toi'] as const).filter((ca) => prepCanLam.some((p) => p.luot === ca)).map((ca) => {
                  const cua = prepCanLam.filter((p) => p.luot === ca)
                  return <RowMini key={ca} main={`Ca ${ca === 'sang' ? 'Sáng' : ca === 'chieu' ? 'Chiều' : 'Tối'}`}
                    sub={`phòng ${cua.map((p) => p.phong).join(', ')}`} badge={`${cua.length} phòng`} badgeCls="bg-amber-100 text-amber-800" />
                })}
              </SectionCard>
            )}
            {coQuyen('test_dau_vao') && (
              <SectionCard icon="📝" chip="bg-violet-50" badge="bg-violet-600" title="Test đầu vào"
                sub="" count={caTests.length} onGo={() => onGo('test')} empty="Không có ca test nào đang chạy">
                {caTests.map((c) => <RowMini key={c.id} main={`Ca test ${c.mon}`} sub={`bắt đầu ${hhmm(c.gioBatDau)} · ${c.thoiLuongPhut} phút`} badge="đang chạy" badgeCls="bg-violet-100 text-violet-700" />)}
              </SectionCard>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionCard({ icon, chip, badge, title, sub, count, empty, onGo, children }: {
  icon: string; chip: string; badge: string; title: string; sub: string; count: number; empty: string; onGo: () => void; children?: React.ReactNode
}) {
  return (
    <button onClick={onGo} className="rounded-2xl border border-slate-200/70 bg-white p-3.5 text-left shadow-sm active:bg-slate-50">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[19px] ${chip}`}>{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-bold text-slate-800">{title}</p>
          {count === 0 ? <p className="text-[12.5px] text-slate-400">{empty}</p> : sub ? <p className="text-[12.5px] text-slate-400">{sub}</p> : null}
        </div>
        {count > 0 && <span className={`rounded-full px-2.5 py-0.5 text-[12.5px] font-bold text-white ${badge}`}>{count}</span>}
        <span className="text-slate-300">›</span>
      </div>
      {count > 0 && <div className="mt-2.5 flex flex-col gap-1.5">{children}</div>}
    </button>
  )
}
function RowMini({ main, sub, badge, badgeCls }: { main: string; sub: string; badge: string; badgeCls: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-[13px] font-semibold text-slate-800">{main}</span>
      {sub && <span className="min-w-0 truncate text-[12px] text-slate-400">{sub}</span>}
      <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeCls}`}>{badge}</span>
    </div>
  )
}
