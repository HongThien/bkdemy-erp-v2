import { useEffect, useState } from 'react'
import type { User } from '../types'
import { useStore, staffNavFromScope, adminNavFromQuyen } from '../store/useStore'
import { getMyScope, type MyScope } from '../lib/nhansu'
import { getMyTasks, buoiAoCuaKhoang, moBuoi, diemDanhTienDo, type MyTask, type BuoiAo, type TabKey } from '../lib/gami'
import { homNayVN, tuanCuaNgay, khoangTuan, nhanTuan, mucDeadline, nhanConLai, type DeadlineMuc } from '../lib/tuan'
import { BuoiDetail } from './gami/BuoiHocScreen'
import { BuoiBuDetail } from './botro/BoTroScreen'
import PersonalCard from '../components/PersonalCard'
import NavTree from '../components/NavTree'
import KhoScreen from './kho/KhoScreen'
import NhapKhoScreen from './nhapkho/NhapKhoScreen'
import TaiLieuScreen from './tailieu/TaiLieuScreen'
import ETScreen from './tailieu/ETScreen'
import KhoTaiLieuScreen from './tailieu/KhoTaiLieuScreen'
import NhanSuScreen from './nhansu/NhanSuScreen'
import OrgChartScreen from './nhansu/OrgChartScreen'
import TKBScreen from './nhansu/TKBScreen'
import PhanCongScreen from './nhansu/PhanCongScreen'
import LopScreen from './nhansu/LopScreen'
import HocSinhScreen from './nhansu/HocSinhScreen'
import BuoiHocScreen from './gami/BuoiHocScreen'
import GamiDiemScreen from './gami/GamiDiemScreen'
import ThanhTichScreen from './gami/ThanhTichScreen'
import KetQuaScreen from './ketqua/KetQuaScreen'
import QuanLyLevelScreen from './gami/QuanLyLevelScreen'
import PhanQuyenScreen from './phanquyen/PhanQuyenScreen'
import BaoLoiScreen from './baoloi/BaoLoiScreen'
import TuyenSinhScreen from './tuyensinh/TuyenSinhScreen'
import BoTroScreen from './botro/BoTroScreen'
import BoTroDuoiScreen from './botro/BoTroDuoiScreen'

const ROLE_LBL: Record<string, string> = { gv: 'GV', tg: 'Trợ giảng', ops: 'OPS' }
const tabsCuaVai = (vai: 'gv' | 'tg'): TabKey[] => (vai === 'gv' ? ['danhgia', 'ingame'] : ['ingame', 'et'])
const ddmm = (s: string) => { const p = s.split('-'); return `${p[2]}/${p[1]}` }
type OpenBuoi = { id: string; tabs: TabKey[]; initialTab: TabKey; canManage: boolean; loai?: 'bu' }
type TienDo = { tong: number; daDanh: number }

// Badge deadline — dải NÓNG→NGUỘI dạng pill MỀM (hợp tông Apple, không khối đỏ đặc): đỏ→cam→hổ phách→xanh.
const DEADLINE_TONE: Record<DeadlineMuc, string> = {
  qua_han: 'border-red-200 bg-red-50 text-red-700',
  sat: 'border-orange-200 bg-orange-50 text-orange-700',
  gan: 'border-amber-200 bg-amber-50 text-amber-700',
  con_nhieu: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}
const DEADLINE_ICON: Record<DeadlineMuc, string> = { qua_han: '⚠', sat: '⏰', gan: '⏳', con_nhieu: '🕒' }
function DeadlineBadge({ deadline, now }: { deadline: number | null; now: number }) {
  const muc = mucDeadline(deadline, now)
  if (!muc) return null
  return <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${DEADLINE_TONE[muc]}`}>{DEADLINE_ICON[muc]} {nhanConLai(deadline, now)}</span>
}
// Style theo LOẠI việc (icon + màu chip + accent trái) — card sống động, phân biệt loại nhanh.
const TASK_STYLE: Record<TabKey, { icon: string; chip: string; accent: string }> = {
  diemdanh: { icon: '👥', chip: 'bg-blue-100', accent: 'border-l-blue-400' },
  ingame: { icon: '✏️', chip: 'bg-violet-100', accent: 'border-l-violet-400' },
  et: { icon: '📝', chip: 'bg-teal-100', accent: 'border-l-teal-400' },
  btvn: { icon: '📒', chip: 'bg-amber-100', accent: 'border-l-amber-400' },
  danhgia: { icon: '⭐', chip: 'bg-rose-100', accent: 'border-l-rose-400' },
}
// Loại việc cho filter chip (tab → nhãn ngắn).
const LOAI_TASK: { tab: TabKey; ten: string }[] = [
  { tab: 'diemdanh', ten: 'Điểm danh' }, { tab: 'ingame', ten: 'Chấm bài' }, { tab: 'et', ten: 'Chấm ET' }, { tab: 'btvn', ten: 'Chấm BTVN' }, { tab: 'danhgia', ten: 'Đánh giá' },
]
const chipCls = (on: boolean) => `rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition ${on ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`

// Dải số liệu — card TRẮNG nổi trên nền xám + số màu theo loại (gu Apple: trắng + bóng mềm, không viền nặng).
const METRIC_TONE: Record<string, string> = { slate: 'text-slate-700', red: 'text-red-600', orange: 'text-orange-600', emerald: 'text-emerald-600' }
function Metric({ label, value, tone }: { label: string; value: number; tone: keyof typeof METRIC_TONE }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm">
      <div className="text-[13px] font-medium text-slate-500">{label}</div>
      <div className={`text-[26px] font-semibold leading-tight ${METRIC_TONE[tone]}`}>{value}</div>
    </div>
  )
}
// Tiêu đề khu vực (vận hành / phát triển) — thanh màu + chữ to để nhìn rõ ranh giới.
function SectionHead({ label, count, color }: { label: string; count?: number; color: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={`h-5 w-1.5 rounded-full ${color}`} />
      <span className="text-[16px] font-semibold text-slate-800">{label}</span>
      {count != null && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[12px] font-semibold text-slate-500">{count}</span>}
    </div>
  )
}

function OpsBuoiCard({ ba, ngay, td, done, onOpen }: { ba: BuoiAo; ngay: string; td?: TienDo; done?: boolean; onOpen: (o: OpenBuoi) => void }) {
  const [busy, setBusy] = useState(false)
  const b = ba.buoi
  async function go() {
    setBusy(true)
    try {
      const id = b?.id ?? (await moBuoi(ba.lop.id, ngay, ba.slot)).id
      onOpen({ id, tabs: ['diemdanh'], initialTab: 'diemdanh', canManage: true })
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  const pct = td && td.tong ? Math.round((td.daDanh / td.tong) * 100) : 0
  const base = done ? 'border-l-emerald-500 bg-emerald-50' : `${TASK_STYLE.diemdanh.accent} bg-white`
  return (
    <button onClick={go} disabled={busy} className={`flex flex-col rounded-2xl border-l-4 p-4 text-left shadow-sm transition hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 ${base}`}>
      {/* dòng 1: icon + tên (full) */}
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[18px] ${done ? 'bg-emerald-100' : TASK_STYLE.diemdanh.chip}`}>{done ? '✓' : '👥'}</span>
        <div className={`flex-1 text-[15px] font-semibold leading-snug ${done ? 'text-emerald-700' : 'text-slate-900'}`}>Điểm danh</div>
      </div>
      {/* dòng 2: thông tin đầy đủ */}
      <div className="mt-2 text-[12px] text-slate-500">OPS · Lớp {ba.lop.ten_lop} · {ddmm(ngay)} · {ba.slot.gio_bat_dau?.slice(0, 5)}{ba.slot.phong ? ` · ${ba.slot.phong}` : ''}</div>
      {/* dòng cuối: tiến độ / mở buổi */}
      {b ? (
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} /></div>
          {td && <span className="shrink-0 text-[11px] font-medium text-slate-500">{td.daDanh}/{td.tong}</span>}
        </div>
      ) : (
        <div className="mt-2.5 text-[12px] font-medium text-indigo-600">Bấm để mở buổi →</div>
      )}
    </button>
  )
}

function TaskCard({ t, now, done, onOpenBuoi }: { t: MyTask; now: number; done?: boolean; onOpenBuoi: (o: OpenBuoi) => void }) {
  const st = TASK_STYLE[t.tab]
  const base = done ? 'border-l-emerald-500 bg-emerald-50' : `${st.accent} bg-white`
  return (
    <button onClick={() => onOpenBuoi({ id: t.buoiId, tabs: tabsCuaVai(t.vai), initialTab: t.tab, canManage: false, loai: t.loai })}
      className={`flex flex-col rounded-2xl border-l-4 p-4 text-left shadow-sm transition hover:shadow-md hover:-translate-y-0.5 ${base}`}>
      {/* dòng 1: icon + tên task (full) */}
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[18px] ${done ? 'bg-emerald-100' : st.chip}`}>{done ? '✓' : st.icon}</span>
        <div className={`flex-1 text-[15px] font-semibold leading-snug ${done ? 'text-emerald-700' : 'text-slate-900'}`}>{t.label}</div>
      </div>
      {/* dòng 2: thông tin đầy đủ */}
      <div className="mt-2 text-[12px] text-slate-500">Lớp {t.lop} · {ddmm(t.ngay)} · {ROLE_LBL[t.vai]}</div>
      {/* dòng cuối: deadline (1 dòng riêng) / trạng thái xong */}
      {done ? (
        <div className="mt-2 text-[11px] font-medium text-emerald-600">✓ Đã xong · bấm để xem / sửa</div>
      ) : t.deadline != null ? (
        <div className="mt-2.5"><DeadlineBadge deadline={t.deadline} now={now} /></div>
      ) : null}
    </button>
  )
}

// VIỆC CỦA TÔI: VẬN HÀNH (cột trái, 2 cột) lọc theo TUẦN + deadline · PHÁT TRIỂN (cột phải, 1 cột) = placeholder giao việc.
function VietCuaToi({ scope, onOpenBuoi }: { scope: MyScope | null; onOpenBuoi: (o: OpenBuoi) => void }) {
  const tuanNay = tuanCuaNgay(homNayVN())
  const [tasks, setTasks] = useState<MyTask[]>([])
  const [opsWeek, setOpsWeek] = useState<(BuoiAo & { ngay: string })[]>([])
  const [tienDo, setTienDo] = useState<Record<string, TienDo>>({})
  const [tuan, setTuan] = useState(tuanNay)
  const [loai, setLoai] = useState<Set<TabKey>>(new Set())
  const [doneShown, setDoneShown] = useState(20)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => { getMyTasks().then(setTasks).catch(() => setTasks([])) }, [])
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id) }, [])
  useEffect(() => {
    if (!scope?.opsToanHe) { setOpsWeek([]); return }
    const { tu, den } = khoangTuan(tuan)
    buoiAoCuaKhoang(tu, den).then(async (list) => {
      setOpsWeek(list)
      const ids = list.filter((ba) => ba.buoi && ba.buoi.trang_thai !== 'huy').map((ba) => ba.buoi!.id)
      try { setTienDo(ids.length ? await diemDanhTienDo(ids) : {}) } catch { setTienDo({}) }
    }).catch(() => setOpsWeek([]))
  }, [scope?.opsToanHe, tuan]) // eslint-disable-line

  if (!scope) return <div className="text-sm text-slate-400">Tài khoản chưa gắn nhân sự — chưa có phạm vi việc.</div>

  const matchLoai = (tab: TabKey) => loai.size === 0 || loai.has(tab)
  const toggleLoai = (tab: TabKey) => setLoai((s) => { const n = new Set(s); n.has(tab) ? n.delete(tab) : n.add(tab); return n })

  // OPS điểm danh (trong tuần đang chọn): XONG = buổi mở & mọi HS đã đánh dấu.
  const opsXong = (ba: BuoiAo) => { const b = ba.buoi; if (!b || b.trang_thai === 'huy') return false; const t = tienDo[b.id]; return !!t && t.daDanh >= t.tong }
  const opsList = matchLoai('diemdanh') ? opsWeek.filter((ba) => !ba.buoi || ba.buoi.trang_thai !== 'huy') : []
  const opsActive = opsList.filter((ba) => !opsXong(ba))
  const opsDone = opsList.filter(opsXong)

  // GV/TG: việc trong TUẦN (theo ngày buổi) + filter loại.
  const weekTasks = tasks.filter((t) => tuanCuaNgay(t.ngay) === tuan && matchLoai(t.tab))
  const taskActive = weekTasks.filter((t) => !t.done)
  // Lịch sử "đã xong" — TẤT CẢ thời gian, gần→xa theo doneAt (20/lần). Độc lập filter tuần.
  const doneHistory = tasks.filter((t) => t.done && matchLoai(t.tab)).sort((a, b) => (b.doneAt ?? '').localeCompare(a.doneAt ?? ''))
  const hasActive = opsActive.length + taskActive.length > 0
  const canLam = opsActive.length + taskActive.length
  const quaHan = taskActive.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
  const satHan = taskActive.filter((t) => mucDeadline(t.deadline, now) === 'sat').length
  const daXongTuan = opsDone.length + weekTasks.filter((t) => t.done).length

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Header + điều hướng tuần */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="text-[22px] font-semibold text-slate-800">Việc của tôi</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setTuan((t) => t - 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">‹</button>
          <span className="min-w-[210px] text-center text-[15px] font-semibold text-slate-700">{nhanTuan(tuan)}</span>
          <button onClick={() => setTuan((t) => t + 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">›</button>
          {tuan !== tuanNay && <button onClick={() => setTuan(tuanNay)} className="ml-1 rounded-md bg-indigo-50 px-2.5 py-1.5 text-[14px] font-medium text-indigo-600 hover:bg-indigo-100">Tuần này</button>}
        </div>
      </div>
      {/* Filter loại việc */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {LOAI_TASK.map((x) => <button key={x.tab} onClick={() => toggleLoai(x.tab)} className={chipCls(loai.has(x.tab))}>{TASK_STYLE[x.tab].icon} {x.ten}</button>)}
        {loai.size > 0 && <button onClick={() => setLoai(new Set())} className="px-2 py-1 text-[12px] text-slate-400 hover:text-slate-600">× Xoá lọc</button>}
      </div>

      {/* Dải số liệu tổng quan */}
      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Metric label="Cần làm" value={canLam} tone="slate" />
        <Metric label="Quá hạn" value={quaHan} tone="red" />
        <Metric label="Sát hạn" value={satHan} tone="orange" />
        <Metric label="Đã xong tuần" value={daXongTuan} tone="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* VẬN HÀNH — chiếm hết phần còn lại */}
        <div className="min-w-0">
          <SectionHead label="Vận hành" count={hasActive ? opsActive.length + taskActive.length : undefined} color="bg-indigo-500" />
          {!hasActive ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[13px] font-medium text-emerald-700">✓ Không còn việc vận hành cần làm trong {nhanTuan(tuan).toLowerCase()}.</div>
          ) : (
            <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]">
              {opsActive.map((ba) => <OpsBuoiCard key={ba.lop.id + ba.ngay} ba={ba} ngay={ba.ngay} td={ba.buoi ? tienDo[ba.buoi.id] : undefined} onOpen={onOpenBuoi} />)}
              {taskActive.map((t) => <TaskCard key={t.buoiId + t.tab} t={t} now={now} onOpenBuoi={onOpenBuoi} />)}
            </div>
          )}

          {opsDone.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã điểm danh xong tuần này ({opsDone.length})</summary>
              <div className="mt-2 grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]">
                {opsDone.map((ba) => <OpsBuoiCard key={ba.lop.id + ba.ngay} ba={ba} ngay={ba.ngay} td={ba.buoi ? tienDo[ba.buoi.id] : undefined} done onOpen={onOpenBuoi} />)}
              </div>
            </details>
          )}

          <details className="mt-3">
            <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã xong — lịch sử ({doneHistory.length})</summary>
            {doneHistory.length === 0 ? (
              <p className="mt-2 text-[12px] text-slate-400">Chưa có việc nào hoàn thành.</p>
            ) : (
              <>
                <div className="mt-2 grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]">
                  {doneHistory.slice(0, doneShown).map((t) => <TaskCard key={t.buoiId + t.tab} t={t} now={now} done onOpenBuoi={onOpenBuoi} />)}
                </div>
                {doneHistory.length > doneShown && (
                  <button onClick={() => setDoneShown((n) => n + 20)} className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">Mở thêm ({doneHistory.length - doneShown})</button>
                )}
              </>
            )}
          </details>
        </div>

        {/* PHÁT TRIỂN — rail hẹp, ngăn cách bằng đường kẻ dọc */}
        <div className="lg:border-l-2 lg:border-slate-200 lg:pl-5">
          <SectionHead label="Phát triển" color="bg-violet-500" />
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-[14px] font-medium text-slate-700">📨 Giao việc — sắp có</div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">Việc phát triển được cấp trên giao (soạn tài liệu, nhập kho…) sẽ hiện ở đây — là task THẬT, không reset theo tuần.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// MÀN DUY NHẤT (theo spec): 1 cây nav = Việc của tôi (vận hành) + các màn role cấp (phát triển).
// KHÔNG còn 2 tab Nhân sự/Admin.
export default function NhanSuHome({ user }: { user: User }) {
  const { staffLeaf, setStaffLeaf, quyen } = useStore()
  const [scope, setScope] = useState<MyScope | null>(null)
  const [loading, setLoading] = useState(true)
  const [openBuoi, setOpenBuoi] = useState<OpenBuoi | null>(null)

  useEffect(() => { getMyScope().then(setScope).finally(() => setLoading(false)) }, [])

  if (openBuoi) return openBuoi.loai === 'bu'
    ? <BuoiBuDetail buoiId={openBuoi.id} onClose={() => setOpenBuoi(null)} />
    : <BuoiDetail id={openBuoi.id} initialTab={openBuoi.initialTab} tabs={openBuoi.tabs} canManage={openBuoi.canManage} onClose={() => setOpenBuoi(null)} />

  // nav hợp nhất: Việc của tôi (vận hành) ++ leaf màn role cấp (phát triển)
  const groups = [...staffNavFromScope(scope), ...adminNavFromQuyen(quyen)]

  return (
    <div className="grid h-full min-h-0 grid-cols-[240px_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden">
      <aside className="min-h-0 overflow-auto border-r bg-white/60 p-3">
        <PersonalCard user={user} />
        <NavTree groups={groups} selected={staffLeaf} onSelect={setStaffLeaf} />
      </aside>
      {/* Khung phải: min-w-0 để bảng rộng (vd chấm bài nhiều bài) CUỘN trong khung thay vì bung cột → tràn layout. */}
      <div className="grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)] overflow-hidden">
      {loading ? (
        <section className="p-8 text-sm text-slate-400">Đang tải…</section>
      ) : staffLeaf === 'viec' ? (
        <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8"><VietCuaToi scope={scope} onOpenBuoi={setOpenBuoi} /></section>
      ) : staffLeaf === 'bdkt' ? <KhoScreen />
      : staffLeaf === 'nhapkho' ? <NhapKhoScreen />
      : (staffLeaf === 'lamtailieu' || staffLeaf === 'lamtailieu:giao_trinh') ? <TaiLieuScreen />
      : staffLeaf === 'lamtailieu:et' ? <ETScreen />
      : staffLeaf === 'tl' ? <KhoTaiLieuScreen />
      : (staffLeaf === 'lamtailieu:de_thi' || staffLeaf === 'lamtailieu:bo_tro') ? <section className="flex min-h-0 items-center justify-center p-8 text-sm text-slate-400">Loại tài liệu này dựng sau.</section>
      : staffLeaf === 'ns' ? <NhanSuScreen />
      : staffLeaf === 'phancong' ? <PhanCongScreen />
      : staffLeaf === 'tkb' ? <TKBScreen />
      : staffLeaf === 'orgchart' ? <OrgChartScreen />
      : staffLeaf === 'lop' ? <LopScreen />
      : staffLeaf === 'hs' ? <HocSinhScreen />
      : staffLeaf === 'tuyensinh' ? <TuyenSinhScreen />
      : staffLeaf === 'botro' ? <BoTroScreen />
      : staffLeaf === 'botro_duoi' ? <BoTroDuoiScreen />
      : staffLeaf === 'buoihoc' ? <BuoiHocScreen />
      : staffLeaf === 'diemso' ? <GamiDiemScreen />
      : staffLeaf === 'thanhtich' ? <ThanhTichScreen />
      : staffLeaf === 'ketqua' ? <KetQuaScreen />
      : staffLeaf === 'quanlylevel' ? <QuanLyLevelScreen />
      : staffLeaf === 'phanquyen' ? <PhanQuyenScreen />
      : staffLeaf === 'baoloi' ? <BaoLoiScreen />
      : (
        <section className="flex min-h-0 items-center justify-center p-8 text-sm text-slate-400">Chọn một mục bên trái.</section>
      )}
      </div>
    </div>
  )
}
