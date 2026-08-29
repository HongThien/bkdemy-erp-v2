// OpsHome — shell + trang chủ app OPS (PLAN-app-ops.md). Bottom-tab (chạm, iPad/iPhone-first) thay
// sidebar 40-leaf của NhanSuHome. Quyền tab = CÙNG leaf-id my_quyen với ERP (buoihoc/ops_report/prep/
// test_dau_vao) — không đẻ khái niệm quyền mới. Trang chủ = "Việc của tôi" bản OPS: gộp 4 nguồn task
// HÔM NAY (buổi cần điểm danh theo ca trực · report/tan · prep · ca test đang chạy), bấm card → sang tab.
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { MyProfile } from '../../lib/nhansu'
import type { MyQuyen } from '../../lib/quyen'
import { myBuoiAoCuaKhoang, getMyOpsTasks, getMyPrepTasks, OPS_TASK_LABEL, type OpsTask, type MyPrepTask } from '../../lib/opsvanhanh'
import { listCaTestDangChay, type CaTest } from '../../lib/tuyensinh'
import { homNayVN, ddmmVN, thuCuaNgay, mucDeadline } from '../../lib/tuan'
import type { BuoiAo } from '../../lib/gami'
import DiemDanhBuoi from './DiemDanhBuoi'
import OpsReportScreen from '../vanhanhops/OpsReportScreen'
import PrepScreen from '../vanhanhops/PrepScreen'
import DiemDanhTestScreen from '../vanhanhops/DiemDanhTestScreen'

type TabKey = 'home' | 'diemdanh' | 'report' | 'prep' | 'test'
// Tab ↔ leaf quyền (cùng leaf-id cây Admin ERP). home luôn hiện.
const TABS: { key: TabKey; leaf: string | null; icon: string; label: string }[] = [
  { key: 'home', leaf: null, icon: '🏠', label: 'Hôm nay' },
  { key: 'diemdanh', leaf: 'buoihoc', icon: '✅', label: 'Điểm danh' },
  { key: 'report', leaf: 'ops_report', icon: '📩', label: 'Report' },
  { key: 'prep', leaf: 'prep', icon: '🧹', label: 'Prep' },
  { key: 'test', leaf: 'test_dau_vao', icon: '📝', label: 'Test' },
]

const hhmm = (t: string | null) => (t ? t.slice(0, 5) : '—')
const DEADLINE_TONE: Record<string, string> = { qua_han: 'text-rose-600', sat: 'text-orange-600', gan: 'text-amber-600', con_nhieu: 'text-slate-400' }

export default function OpsHome({ profile, quyen }: { profile: MyProfile; quyen: MyQuyen }) {
  const [tab, setTab] = useState<TabKey>('home')
  const coQuyen = (leaf: string | null) => !leaf || quyen.laAdmin || quyen.chucNang.includes(leaf)
  const tabs = TABS.filter((t) => coQuyen(t.leaf))

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]">
      {/* header gọn: tên app + người + đăng xuất */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <span className="text-[15px] font-bold text-indigo-700">BK Vận hành</span>
        <span className="ml-auto max-w-[45%] truncate text-[13px] text-slate-500">{profile.nhanSu.ho_ten}</span>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg px-2.5 py-1.5 text-[12px] text-slate-400 active:bg-slate-100">Thoát</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'home' && <HomTay onGo={setTab} coQuyen={coQuyen} />}
        {tab === 'diemdanh' && <DiemDanhBuoi />}
        {tab === 'report' && <OpsReportScreen />}
        {tab === 'prep' && <PrepScreen />}
        {tab === 'test' && <DiemDanhTestScreen />}
      </div>

      {/* bottom tab bar — vùng chạm chính, ≥44px, chừa safe-area iPhone */}
      <div className="border-t border-slate-200 bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[760px]">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 ${tab === t.key ? 'text-indigo-600' : 'text-slate-400'}`}>
              <span className="text-[18px] leading-none">{t.icon}</span>
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Trang chủ "Hôm nay" — gộp việc của TÔI hôm nay từ 4 nguồn, đếm + liệt kê, bấm → sang tab ──
function HomTay({ onGo, coQuyen }: { onGo: (t: TabKey) => void; coQuyen: (leaf: string | null) => boolean }) {
  const homNay = homNayVN()
  const [loading, setLoading] = useState(true)
  const [buoi, setBuoi] = useState<(BuoiAo & { ngay: string })[]>([])
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

  const buoiCanDanh = buoi.filter((b) => !b.buoi || b.buoi.trang_thai !== 'huy')
  const opsCanLam = opsTasks.filter((t) => !t.done)
  const prepCanLam = preps.filter((p) => !p.done)
  const tongViec = buoiCanDanh.length + opsCanLam.length + prepCanLam.length + caTests.length

  return (
    <div className="mx-auto max-w-[760px] px-3 pb-24 pt-4">
      <p className="mb-1 pl-1 text-[13px] text-slate-400">{thuCuaNgay(homNay)} · {ddmmVN(homNay)}</p>
      <h1 className="mb-4 pl-1 text-[22px] font-bold text-slate-800">
        {loading ? 'Đang tải…' : tongViec === 0 ? '✓ Hôm nay không còn việc' : `Hôm nay còn ${tongViec} việc`}
      </h1>

      {!loading && (
        <div className="flex flex-col gap-4">
          {coQuyen('buoihoc') && (
            <SectionCard icon="✅" title="Điểm danh buổi học" count={buoiCanDanh.length} onGo={() => onGo('diemdanh')}
              empty={buoi.length ? '✓ Xong các buổi trong ca trực' : 'Không có ca trực điểm danh hôm nay'}>
              {buoiCanDanh.map((b) => (
                <RowLine key={b.lop.id} main={`${b.lop.ten_lop} · ${hhmm(b.slot.gio_bat_dau)}`}
                  sub={b.buoi ? 'đã mở — điểm danh tiếp' : 'chưa mở buổi'} tone={b.buoi ? 'text-emerald-600' : 'text-amber-600'} />
              ))}
            </SectionCard>
          )}
          {coQuyen('ops_report') && (
            <SectionCard icon="📩" title="Report & Báo tan" count={opsCanLam.length} onGo={() => onGo('report')}
              empty="✓ Không còn report/báo tan hôm nay">
              {opsCanLam.map((t) => {
                const muc = mucDeadline(t.deadline, now)
                return <RowLine key={t.tkbId + t.tab + t.ngay} main={`${OPS_TASK_LABEL[t.tab]} · ${t.lopTen}`}
                  sub={muc === 'qua_han' ? '⚠ Quá hạn' : `hạn ${new Date(t.deadline).toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })}`}
                  tone={DEADLINE_TONE[muc ?? 'con_nhieu']} />
              })}
            </SectionCard>
          )}
          {coQuyen('prep') && (
            <SectionCard icon="🧹" title="Chuẩn bị phòng" count={prepCanLam.length} onGo={() => onGo('prep')}
              empty={preps.length ? '✓ Xong các lượt prep hôm nay' : 'Không có lượt prep hôm nay'}>
              {/* gom theo ca cho gọn: 7 phòng/ca là 21 dòng nếu liệt kê hết */}
              {(['sang', 'chieu', 'toi'] as const).filter((ca) => prepCanLam.some((p) => p.luot === ca)).map((ca) => {
                const cua = prepCanLam.filter((p) => p.luot === ca)
                return <RowLine key={ca} main={`Ca ${ca === 'sang' ? 'Sáng' : ca === 'chieu' ? 'Chiều' : 'Tối'} · ${cua.length} phòng`}
                  sub={cua.map((p) => p.phong).join(', ')} tone="text-slate-400" />
              })}
            </SectionCard>
          )}
          {coQuyen('test_dau_vao') && (
            <SectionCard icon="📝" title="Ca test đầu vào đang chạy" count={caTests.length} onGo={() => onGo('test')}
              empty="Không có ca test nào đang chạy">
              {caTests.map((c) => <RowLine key={c.id} main={`${c.mon} · bắt đầu ${hhmm(c.gioBatDau)}`} sub={`${c.thoiLuongPhut} phút`} tone="text-slate-400" />)}
            </SectionCard>
          )}
        </div>
      )}
    </div>
  )
}

function SectionCard({ icon, title, count, empty, onGo, children }: {
  icon: string; title: string; count: number; empty: string; onGo: () => void; children?: React.ReactNode
}) {
  return (
    <button onClick={onGo} className="rounded-2xl border-l-4 border-indigo-400 bg-white p-4 text-left shadow-sm active:bg-slate-50">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[16px]">{icon}</span>
        <span className="text-[15px] font-semibold text-slate-800">{title}</span>
        {count > 0 && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[12px] font-bold text-white">{count}</span>}
        <span className="ml-auto text-slate-300">›</span>
      </div>
      {count === 0 ? <p className="text-[13px] text-slate-400">{empty}</p> : <div className="flex flex-col gap-1">{children}</div>}
    </button>
  )
}
function RowLine({ main, sub, tone }: { main: string; sub: string; tone: string }) {
  return (
    <p className="text-[13px] text-slate-700">
      <span className="font-medium">{main}</span>
      <span className={`ml-2 text-[12px] ${tone}`}>{sub}</span>
    </p>
  )
}
