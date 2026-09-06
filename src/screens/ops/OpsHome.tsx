// OpsHome — shell + trang chủ app OPS. REDESIGN 07/09 (CEO gửi handoff ops1-6.png + kit SVG 7 màn):
// hero gradient lục + avatar/chào/trạng thái + nhân vật chibi, lưới 6 module (icon vuông màu),
// "Công việc hôm nay" gộp 1 danh sách (mèo ngủ khi trống), bottom-nav icon tự vẽ + pill màu theo màn.
// Report/Prep/Test là 3 màn TÁI DÙNG TỪ ERP (screens/vanhanhops/*, KHÔNG được sửa nội dung vì ảnh hưởng
// cả desktop ERP) — chỉ bọc header màu+nhân vật RIÊNG cho app OPS ở NGOÀI các component đó (ManCon).
// ⚠ Tailwind JIT: không ghép class màu động — mọi màu ở đây truyền qua style={{}} (OPS_UI tokens), an toàn.
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { MyProfile } from '../../lib/nhansu'
import type { MyQuyen } from '../../lib/quyen'
import { myBuoiAoCuaKhoang, getMyOpsTasks, getMyPrepTasks, OPS_TASK_LABEL, type OpsTask, type MyPrepTask } from '../../lib/opsvanhanh'
import { listCaTestDangChay, type CaTest } from '../../lib/tuyensinh'
import { homNayVN, ddmmVN, thuCuaNgay, mucDeadline } from '../../lib/tuan'
import { diemDanhTienDo, type BuoiAo } from '../../lib/gami'
import { OPS, OA, type OpsTone, OpsHero, IcoHome, IcoCheck, IcoMail, IcoBroom, IcoPencil, IcoGift, IcoChart, IcoCalendar, IcoPower } from '../../components/ops/OpsUI'
import DiemDanhBuoi from './DiemDanhBuoi'
import TuQuaScreen from './TuQuaScreen'
import OpsReportScreen from '../vanhanhops/OpsReportScreen'
import PrepScreen from '../vanhanhops/PrepScreen'
import DiemDanhTestScreen from '../vanhanhops/DiemDanhTestScreen'
import GopY from './GopY'
import DashOps from './DashOps'

type TabKey = 'home' | 'diemdanh' | 'report' | 'prep' | 'test' | 'tuqua' | 'dash'
// Tab ↔ leaf quyền (cùng leaf-id cây Admin ERP) + tông màu + icon tự vẽ. home + dash luôn hiện.
const TABS: { key: TabKey; leaf: string | null; label: string; tone: OpsTone; Ico: (p: { cls?: string }) => JSX.Element }[] = [
  { key: 'home', leaf: null, label: 'Hôm nay', tone: 'indigo', Ico: IcoHome },
  { key: 'diemdanh', leaf: 'buoihoc', label: 'Điểm danh', tone: 'green', Ico: IcoCheck },
  { key: 'report', leaf: 'ops_report', label: 'Report', tone: 'blue', Ico: IcoMail },
  { key: 'prep', leaf: 'prep', label: 'Prep', tone: 'amber', Ico: IcoBroom },
  { key: 'test', leaf: 'test_dau_vao', label: 'Test', tone: 'purple', Ico: IcoPencil },
  { key: 'tuqua', leaf: 'tu_qua', label: 'Tủ quà', tone: 'orange', Ico: IcoGift },
  { key: 'dash', leaf: null, label: 'Của tôi', tone: 'pink', Ico: IcoChart },
]

const hhmm = (t: string | null) => (t ? t.slice(0, 5) : '—')

export default function OpsHome({ profile, quyen }: { profile: MyProfile; quyen: MyQuyen }) {
  const [tab, setTab] = useState<TabKey>('home')
  const coQuyen = (leaf: string | null) => !leaf || quyen.laAdmin || quyen.chucNang.includes(leaf)
  const tabs = TABS.filter((t) => coQuyen(t.leaf))

  return (
    <div className="flex h-[100dvh] flex-col bg-[#F5F8FF]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'home' && <HomTay profile={profile} onGo={setTab} coQuyen={coQuyen} onThoat={() => supabase.auth.signOut()} />}
        {tab === 'diemdanh' && <DiemDanhBuoi />}
        {tab === 'report' && <ManCon tone="blue" title="Report & Báo tan" character={OA('report/header_boy.svg')} bubble="Làm xong rồi nè!"><OpsReportScreen chiViec /></ManCon>}
        {tab === 'prep' && <ManCon tone="amber" title="Chuẩn bị phòng" character={OA('prep/header_girl.svg')} bubble="Phòng sạch là học vui hơn!"><PrepScreen /></ManCon>}
        {tab === 'test' && <ManCon tone="purple" title="Test đầu vào" character={OA('test/header_boy_clipboard.svg')} bubble="Cố lên! Bạn làm được mà!"><DiemDanhTestScreen /></ManCon>}
        {tab === 'tuqua' && <TuQuaScreen />}
        {tab === 'dash' && <DashOps profile={profile} />}
      </div>

      {/* bottom tab — icon tự vẽ (currentColor), active = pill màu theo tông, chừa safe-area iPhone */}
      <div className="border-t border-[#EAEFFB] bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-[760px]">
          {tabs.map((t) => {
            const c = OPS[t.tone]; const active = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5">
                <span className="flex h-7 w-11 items-center justify-center rounded-full transition" style={{ background: active ? c.chip : 'transparent', color: active ? c.solid : '#9AA5C4' }}>
                  <t.Ico cls="h-[19px] w-[19px]" />
                </span>
                <span className="text-[10px] font-bold" style={{ color: active ? c.solid : '#9AA5C4' }}>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Dải header cho 3 màn TÁI DÙNG TỪ ERP (Report/Prep/Test) — bọc NGOÀI, không đụng nội dung bên trong
// (OpsReportScreen/PrepScreen/DiemDanhTestScreen dùng chung với desktop ERP, sửa trong đó ảnh hưởng cả 2 nơi).
function ManCon({ tone, character, bubble, children }: { tone: OpsTone; title: string; character: string; bubble: string; children: React.ReactNode }) {
  // KHÔNG truyền title — 3 màn tái dùng ERP (Report/Prep/Test) đã tự có tiêu đề riêng bên trong, tránh lặp chữ.
  return (
    <div className="flex h-full min-h-0 flex-col">
      <OpsHero tone={tone} character={character} bubble={bubble} characterSize={82} />
      <div className="min-h-0 flex-1 overflow-auto bg-white">{children}</div>
    </div>
  )
}

type Item = { key: string; tone: OpsTone; Ico: (p: { cls?: string }) => JSX.Element; main: string; sub: string; badge: string; badgeStrong?: boolean }

// ── Trang chủ "Hôm nay" — hero lục (avatar + chào + trạng thái + nhân vật), thanh ngày, lưới 6
//    module, "Công việc hôm nay" gộp 1 danh sách (mèo ngủ khi trống), banner câu động viên ──
function HomTay({ profile, onGo, coQuyen, onThoat }: { profile: MyProfile; onGo: (t: TabKey) => void; coQuyen: (leaf: string | null) => boolean; onThoat: () => void }) {
  const homNay = homNayVN()
  const [loading, setLoading] = useState(true)
  const [buoi, setBuoi] = useState<(BuoiAo & { ngay: string })[]>([])
  const [tienDo, setTienDo] = useState<Record<string, { tong: number; daDanh: number }>>({})
  const [opsTasks, setOpsTasks] = useState<OpsTask[]>([])
  const [preps, setPreps] = useState<MyPrepTask[]>([])
  const [caTests, setCaTests] = useState<CaTest[]>([])
  const [now, setNow] = useState(() => Date.now())
  const [loc, setLoc] = useState<'tatca' | 'diemdanh' | 'report' | 'prep' | 'test'>('tatca')

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

  // Gộp 4 nguồn thành 1 danh sách việc — filter theo `loc` (chip lọc, thuần UI trên dữ liệu đã fetch).
  const viecGop: Item[] = [
    ...buoiCanDanh.map((b): Item => ({ key: 'dd' + b.lop.id, tone: 'green', Ico: IcoCheck, main: b.lop.ten_lop, sub: `${hhmm(b.slot.gio_bat_dau)} · ${b.slot.phong ?? '—'}`, badge: b.buoi ? (tienDo[b.buoi.id] ? `${tienDo[b.buoi.id].daDanh}/${tienDo[b.buoi.id].tong}` : 'đang mở') : 'chưa mở' })),
    ...opsCanLam.map((t): Item => {
      const muc = mucDeadline(t.deadline, now)
      const han = new Date(t.deadline).toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
      return { key: 'rp' + t.tkbId + t.tab + t.ngay, tone: 'blue', Ico: IcoMail, main: `${OPS_TASK_LABEL[t.tab]} · ${t.lopTen}`, sub: muc === 'qua_han' ? 'quá hạn' : `hạn ${han}`, badge: muc === 'qua_han' ? '⚠' : muc === 'sat' ? '⏰' : '', badgeStrong: muc === 'qua_han' }
    }),
    ...(['sang', 'chieu', 'toi'] as const).filter((ca) => prepCanLam.some((p) => p.luot === ca)).map((ca): Item => {
      const cua = prepCanLam.filter((p) => p.luot === ca)
      return { key: 'pr' + ca, tone: 'amber', Ico: IcoBroom, main: `Prep ca ${ca === 'sang' ? 'Sáng' : ca === 'chieu' ? 'Chiều' : 'Tối'}`, sub: `phòng ${cua.map((p) => p.phong).join(', ')}`, badge: `${cua.length} phòng` }
    }),
    ...caTests.map((c): Item => ({ key: 'ts' + c.id, tone: 'purple', Ico: IcoPencil, main: `Ca test ${c.mon}`, sub: `bắt đầu ${hhmm(c.gioBatDau)} · ${c.thoiLuongPhut} phút`, badge: 'đang chạy' })),
  ]
  const LOC_TABS = (
    [{ key: 'tatca', label: 'Tất cả' }, { key: 'diemdanh', label: 'Điểm danh' }, { key: 'report', label: 'Report' }, { key: 'prep', label: 'Prep' }, { key: 'test', label: 'Test' }] as const
  ).filter((l) => l.key === 'tatca' || viecGop.some((v) => v.key.startsWith(l.key === 'diemdanh' ? 'dd' : l.key === 'report' ? 'rp' : l.key === 'prep' ? 'pr' : 'ts')))
  const viecHien = loc === 'tatca' ? viecGop : viecGop.filter((v) => v.key.startsWith(loc === 'diemdanh' ? 'dd' : loc === 'report' ? 'rp' : loc === 'prep' ? 'pr' : 'ts'))

  const MODULES: { key: TabKey; leaf: string | null; tone: OpsTone; Ico: (p: { cls?: string }) => JSX.Element; label: string; sub: string }[] = [
    { key: 'diemdanh', leaf: 'buoihoc', tone: 'green', Ico: IcoCheck, label: 'Điểm danh buổi học', sub: buoiSong.length ? `${buoiCanDanh.length} buổi chờ` : 'Không có ca hôm nay' },
    { key: 'report', leaf: 'ops_report', tone: 'blue', Ico: IcoMail, label: 'Report & Báo tan', sub: opsCanLam.length ? `${opsCanLam.length} chờ gửi` : 'Không có báo cáo hôm nay' },
    { key: 'prep', leaf: 'prep', tone: 'amber', Ico: IcoBroom, label: 'Chuẩn bị phòng', sub: prepCanLam.length ? `${prepCanLam.length} lượt chờ` : 'Không có lượt prep hôm nay' },
    { key: 'test', leaf: 'test_dau_vao', tone: 'purple', Ico: IcoPencil, label: 'Test đầu vào', sub: caTests.length ? `${caTests.length} ca đang chạy` : 'Không có ca test hôm nay' },
    // ⚠ "Quà" ở đây = TỦ QUÀ (đổi xu học sinh lấy quà — vận hành), KHÁC "Shopping" trong Của tôi
    // (điểm tích luỹ CÁ NHÂN của nhân viên). Đừng nhầm 2 khái niệm khi sửa label/sub.
    { key: 'tuqua', leaf: 'tu_qua', tone: 'orange', Ico: IcoGift, label: 'Tủ quà', sub: 'Đổi xu học sinh lấy quà' },
    { key: 'dash', leaf: null, tone: 'pink', Ico: IcoChart, label: 'Của tôi', sub: 'Xếp hạng, gậy, điểm cá nhân' },
  ]

  const nsAnh = profile.nhanSu.anh_url
  return (
    <div>
      <OpsHero tone="green" title="" right={
        <div className="flex shrink-0 items-center gap-1.5">
          <GopY route="home" />
          <button onClick={onThoat} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white active:bg-white/30" aria-label="Thoát"><IcoPower cls="h-[18px] w-[18px]" /></button>
        </div>
      }>
        {/* hàng avatar + chào + trạng thái (thay cho title mặc định) — đặt lại vì layout Home khác các màn khác */}
        <div className="relative -mt-9 flex items-center gap-3">
          {nsAnh
            ? <img src={nsAnh} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover ring-[3px] ring-white/70" />
            : <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/25 text-[20px] font-extrabold text-white ring-[3px] ring-white/70">{tenGoi.charAt(0).toUpperCase()}</span>}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[20px] font-extrabold text-white">Chào {tenGoi} 👋</p>
            <p className="text-[12px] font-semibold text-white/80">BK Vận hành</p>
          </div>
        </div>
        <p className="mt-2 inline-block max-w-full truncate rounded-full bg-white/20 px-3 py-1.5 text-[12.5px] font-semibold text-white">
          {loading ? 'Đang tải việc hôm nay…' : tongViec === 0 ? '☕ Không còn việc — nghỉ ngơi thôi!' : conLai === 0 ? '✓ Xong hết việc hôm nay, đỉnh!' : `Còn ${conLai} việc hôm nay`}
        </p>
        <div className="mt-2 flex items-end justify-end">
          <img src={OA('common/avatar_ta_girl_sign.svg')} alt="" className="h-[76px] w-[76px] object-contain drop-shadow" draggable={false} />
        </div>
      </OpsHero>

      <div className="mx-auto max-w-[760px] px-3 pb-24 pt-3">
        {/* thanh ngày — trắng, nổi lên trên hero */}
        <div className="-mt-6 mb-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-md">
          <IcoCalendar cls="h-5 w-5 text-[#16A34A]" />
          <p className="text-[14.5px] font-extrabold text-[#16224D]">{thuCuaNgay(homNay)}, {ddmmVN(homNay)}</p>
        </div>

        {/* lưới 6 module */}
        {!loading && (
          <div className="grid grid-cols-2 gap-2.5">
            {MODULES.filter((m) => coQuyen(m.leaf)).map((m) => {
              const c = OPS[m.tone]
              return (
                <button key={m.key} onClick={() => onGo(m.key)} className="rounded-2xl bg-white p-3 text-left shadow-sm active:bg-[#F7F9FF]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: c.chip, color: c.solid }}><m.Ico cls="h-6 w-6" /></span>
                  <p className="mt-2 text-[13.5px] font-extrabold leading-tight text-[#16224D]">{m.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[#6B7AAE]">{m.sub}</p>
                </button>
              )
            })}
          </div>
        )}

        {/* Công việc hôm nay — gộp 1 danh sách, chip lọc theo loại */}
        {!loading && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[15px] font-extrabold text-[#16224D]"><span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]" />Công việc hôm nay</p>
            </div>
            {LOC_TABS.length > 1 && (
              <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5">
                {LOC_TABS.map((l) => (
                  <button key={l.key} onClick={() => setLoc(l.key)} className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold"
                    style={loc === l.key ? { background: '#E7E9FF', color: '#38399B' } : { background: '#fff', color: '#9AA5C4' }}>{l.label}</button>
                ))}
              </div>
            )}
            {viecHien.length === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <img src={OA('common/sleeping_cat.svg')} alt="" className="h-16 w-16 shrink-0 object-contain" draggable={false} />
                <div className="min-w-0">
                  <p className="text-[13.5px] font-extrabold text-[#16224D]">Hôm nay chưa có công việc nào</p>
                  <p className="text-[11.5px] leading-snug text-[#6B7AAE]">Tranh thủ nghỉ ngơi để có năng lượng cho những buổi học tiếp theo nhé!</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {viecHien.map((v) => (
                  <div key={v.key} className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: OPS[v.tone].chip, color: OPS[v.tone].solid }}><v.Ico cls="h-[18px] w-[18px]" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-bold text-[#16224D]">{v.main}</p>
                      <p className="truncate text-[11px] text-[#6B7AAE]">{v.sub}</p>
                    </div>
                    {v.badge && <span className="shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold" style={v.badgeStrong ? { background: '#FFE1E7', color: '#9F2244' } : { background: OPS[v.tone].chip, color: OPS[v.tone].text }}>{v.badge}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* câu động viên cuối màn — chọn cố định theo ngày trong tháng để khỏi nhảy khi re-render */}
        <div className="mt-3 rounded-2xl bg-[#E0FBE9] px-4 py-2.5 text-center">
          <p className="text-[12px] font-semibold text-[#0E6B37]">🌱 {QUOTES[new Date(homNay).getDate() % QUOTES.length]}</p>
        </div>
      </div>
    </div>
  )
}
const QUOTES = ['"Không cần hoàn hảo, chỉ cần tiến bộ mỗi ngày."', '"Việc nhỏ làm tốt mỗi ngày, tạo nên khác biệt lớn."', '"Chăm chỉ hôm nay, an tâm hôm sau."', '"Mỗi ca trực chỉn chu là một viên gạch cho BK vững vàng hơn."']
