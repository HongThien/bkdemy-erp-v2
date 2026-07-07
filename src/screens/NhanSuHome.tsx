import { useEffect, useState } from 'react'
import type { User, NavGroup } from '../types'
import { useStore, staffNavFromScope, adminNavFromQuyen } from '../store/useStore'
import { getMyScope, type MyScope } from '../lib/nhansu'
import { useIsMobile } from '../hooks/useIsMobile'
import { getMyTasks, buoiAoCuaKhoang, moBuoi, diemDanhTienDo, type MyTask, type BuoiAo, type TabKey } from '../lib/gami'
import { getMyOpsTasks, getMyPrepTasks, OPS_TASK_LABEL, type OpsTask, type MyPrepTask } from '../lib/opsvanhanh'
import { homNayVN, tuanCuaNgay, khoangTuan, nhanTuan, mucDeadline, nhanConLai, thuCuaNgay, ddmmVN, type DeadlineMuc } from '../lib/tuan'
import { BuoiDetail } from './gami/BuoiHocScreen'
import { BuoiBuDetail } from './botro/BoTroScreen'
import { BuoiDuoiDetail } from './botro/BoTroDuoiScreen'
import PersonalCard from '../components/PersonalCard'
import NavTree from '../components/NavTree'
import KhoScreen from './kho/KhoScreen'
import NhapKhoScreen from './nhapkho/NhapKhoScreen'
import TaiLieuScreen from './tailieu/TaiLieuScreen'
import ETScreen from './tailieu/ETScreen'
import MTScreen from './tailieu/MTScreen'
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
import DuyetChamScreen from './duyetcham/DuyetChamScreen'
import HocPhiScreen from './hocphi/HocPhiScreen'
import GiaoViecScreen from './giaoviec/GiaoViecScreen'
import { listViecCuaToi, type ViecFull } from '../lib/giaoviec'
import QuanLyLevelScreen from './gami/QuanLyLevelScreen'
import PhanQuyenScreen from './phanquyen/PhanQuyenScreen'
import BaoLoiScreen from './baoloi/BaoLoiScreen'
import OpsReportScreen from './vanhanhops/OpsReportScreen'
import PrepScreen from './vanhanhops/PrepScreen'
import PhanCongOpsScreen from './vanhanhops/PhanCongOpsScreen'
import DiemDanhTestScreen from './vanhanhops/DiemDanhTestScreen'
import TuyenSinhScreen from './tuyensinh/TuyenSinhScreen'
import BoTroScreen from './botro/BoTroScreen'
import BoTroDuoiScreen from './botro/BoTroDuoiScreen'
import ChatLuongVanHanhScreen from './dashboard/ChatLuongVanHanhScreen'

const ROLE_LBL: Record<string, string> = { gv: 'GV', tg: 'Trợ giảng', ops: 'OPS' }
const tabsCuaVai = (vai: 'gv' | 'tg'): TabKey[] => (vai === 'gv' ? ['danhgia', 'ingame'] : ['ingame', 'et'])
const ddmm = (s: string) => { const p = s.split('-'); return `${p[2]}/${p[1]}` }
type OpenBuoi = { id: string; tabs: TabKey[]; initialTab: TabKey; canManage: boolean; loai?: 'bu' | 'bo_tro_duoi' }
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
// Loại việc cho filter chip — THEO VAI (Thùy 07-06: "Ops không có chấm bài như TA, phải hiện đúng
// việc của ops"): Ops thấy Điểm danh/Report/Báo tan/Chuẩn bị phòng · GV/TA thấy Chấm bài/ET/BTVN/Đánh
// giá. 'diemdanh' CHỈ thuộc nhóm Ops (GV/TA không có item diemdanh nào — xem TASKS_BY_VAI ở gami.ts).
type ChipDef = { key: string; ten: string; icon: string }
const OPS_CHIPS: ChipDef[] = [
  { key: 'diemdanh', ten: 'Điểm danh', icon: '👥' }, { key: 'report', ten: 'Report', icon: '📣' },
  { key: 'tan', ten: 'Báo tan', icon: '🔔' }, { key: 'prep', ten: 'Chuẩn bị phòng', icon: '🧹' },
]
const GVTA_CHIPS: ChipDef[] = [
  { key: 'ingame', ten: 'Chấm bài', icon: '✏️' }, { key: 'et', ten: 'Chấm ET', icon: '📝' },
  { key: 'btvn', ten: 'Chấm BTVN', icon: '📒' }, { key: 'danhgia', ten: 'Đánh giá', icon: '⭐' },
]
const chipCls = (on: boolean) => `rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition ${on ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`

// Dải số liệu — card TRẮNG nổi trên nền xám + số màu theo loại (gu Apple: trắng + bóng mềm, không viền nặng).
// `compact` (mobile, Thùy 07-06: "4 cái thẻ đếm quá to") = 1 hàng label+số gọn, KHÔNG xếp dọc to như desktop.
const METRIC_TONE: Record<string, string> = { slate: 'text-slate-700', red: 'text-red-600', orange: 'text-orange-600', emerald: 'text-emerald-600' }
function Metric({ label, value, tone, compact }: { label: string; value: number; tone: keyof typeof METRIC_TONE; compact?: boolean }) {
  if (compact) return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-white px-2.5 py-1.5 shadow-sm">
      <span className="text-[11px] font-medium text-slate-500">{label}</span>
      <span className={`text-[15px] font-semibold ${METRIC_TONE[tone]}`}>{value}</span>
    </div>
  )
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

function OpsBuoiCard({ ba, ngay, td, done, onOpen, compact }: { ba: BuoiAo; ngay: string; td?: TienDo; done?: boolean; onOpen: (o: OpenBuoi) => void; compact?: boolean }) {
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
  // Mobile (Thùy 07-06: "card chỉ cần 2 thông tin chính — loại việc + lớp"): gọn 1 hàng, bỏ tiến độ/mở-buổi.
  if (compact) return (
    <button onClick={go} disabled={busy} className={`flex items-center gap-2 rounded-lg border-l-4 px-2.5 py-2 text-left shadow-sm transition disabled:opacity-50 ${base}`}>
      <span className="shrink-0 text-[15px]">{done ? '✓' : '👥'}</span>
      <span className={`min-w-0 flex-1 truncate text-[13px] font-medium ${done ? 'text-emerald-700' : 'text-slate-800'}`}>Điểm danh · {ba.lop.ten_lop}</span>
      {td && <span className="shrink-0 text-[11px] font-medium text-slate-400">{td.daDanh}/{td.tong}</span>}
    </button>
  )
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

// 1 HÀNG = việc của 1 NGÀY (Thùy: dễ nhìn hơn lưới ô vuông tràn ngang). Đầu hàng = thanh màu + kẻ dọc (design §259).
function DayRow({ ngay, today, count, compact, children }: { ngay: string; today: boolean; count: number; compact?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className={`mb-2 flex items-center gap-2 border-l-4 pl-2.5 ${today ? 'border-indigo-500' : 'border-slate-300'}`}>
        <span className="text-[15px] font-semibold text-slate-800">{thuCuaNgay(ngay)}</span>
        <span className="text-[13px] text-slate-500">{ddmmVN(ngay)}</span>
        {today && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">Hôm nay</span>}
        <span className="ml-auto text-[12px] font-medium text-slate-400">{count} việc</span>
      </div>
      <div className={compact ? 'flex flex-col gap-1.5' : 'grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]'}>{children}</div>
    </div>
  )
}
function TaskCard({ t, now, done, onOpenBuoi, compact }: { t: MyTask; now: number; done?: boolean; onOpenBuoi: (o: OpenBuoi) => void; compact?: boolean }) {
  const st = TASK_STYLE[t.tab]
  const base = done ? 'border-l-emerald-500 bg-emerald-50' : `${st.accent} bg-white`
  const onClick = () => onOpenBuoi({ id: t.buoiId, tabs: tabsCuaVai(t.vai), initialTab: t.tab, canManage: false, loai: t.loai })
  // Mobile (Thùy 07-06): gọn 1 hàng — chỉ 2 thông tin chính (loại việc + lớp) + deadline nhỏ cuối hàng.
  if (compact) return (
    <button onClick={onClick} className={`flex items-center gap-2 rounded-lg border-l-4 px-2.5 py-2 text-left shadow-sm transition ${base}`}>
      <span className="shrink-0 text-[15px]">{done ? '✓' : st.icon}</span>
      <span className={`min-w-0 flex-1 truncate text-[13px] font-medium ${done ? 'text-emerald-700' : 'text-slate-800'}`}>{t.label} · {t.lop}</span>
      {!done && t.deadline != null && <DeadlineBadge deadline={t.deadline} now={now} />}
    </button>
  )
  return (
    <button onClick={onClick}
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
// Report/Báo tan (Ops, xem opsvanhanh.ts) — card TÓM TẮT, bấm → sang màn "Report & Báo tan" (làm việc
// thật ở đó: copy tin nhắn + chụp ảnh + đóng — không nhồi hết luồng vào đây).
const OPS_TASK_ICON: Record<OpsTask['tab'], string> = { report: '📣', tan: '🔔' }
function OpsExtraCard({ t, now, done, onGoLeaf, compact }: { t: OpsTask; now: number; done?: boolean; onGoLeaf: (leaf: string) => void; compact?: boolean }) {
  const base = done ? 'border-l-emerald-500 bg-emerald-50' : 'border-l-sky-400 bg-white'
  if (compact) return (
    <button onClick={() => onGoLeaf('ops_report')} className={`flex items-center gap-2 rounded-lg border-l-4 px-2.5 py-2 text-left shadow-sm transition ${base}`}>
      <span className="shrink-0 text-[15px]">{done ? '✓' : OPS_TASK_ICON[t.tab]}</span>
      <span className={`min-w-0 flex-1 truncate text-[13px] font-medium ${done ? 'text-emerald-700' : 'text-slate-800'}`}>{OPS_TASK_LABEL[t.tab]} · {t.lopTen}</span>
      {!done && <DeadlineBadge deadline={t.deadline} now={now} />}
    </button>
  )
  return (
    <button onClick={() => onGoLeaf('ops_report')} className={`flex flex-col rounded-2xl border-l-4 p-4 text-left shadow-sm transition hover:shadow-md hover:-translate-y-0.5 ${base}`}>
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[18px] ${done ? 'bg-emerald-100' : 'bg-sky-100'}`}>{done ? '✓' : OPS_TASK_ICON[t.tab]}</span>
        <div className={`flex-1 text-[15px] font-semibold leading-snug ${done ? 'text-emerald-700' : 'text-slate-900'}`}>{OPS_TASK_LABEL[t.tab]}</div>
      </div>
      <div className="mt-2 text-[12px] text-slate-500">Lớp {t.lopTen} · {ddmm(t.ngay)} · OPS</div>
      {done ? (
        <div className="mt-2 text-[11px] font-medium text-emerald-600">✓ Đã xong · bấm để xem</div>
      ) : (
        <div className="mt-2.5"><DeadlineBadge deadline={t.deadline} now={now} /></div>
      )}
    </button>
  )
}
// Chuẩn bị phòng (Ops, xem opsvanhanh.ts) — card TÓM TẮT, bấm → sang màn "Chuẩn bị phòng".
const PREP_LUOT_LABEL: Record<string, string> = { ngay: 'Cả buổi tối', sang: 'Sáng', chieu: 'Chiều' }
function PrepTaskCard({ t, now, done, onGoLeaf, compact }: { t: MyPrepTask; now: number; done?: boolean; onGoLeaf: (leaf: string) => void; compact?: boolean }) {
  const base = done ? 'border-l-emerald-500 bg-emerald-50' : 'border-l-amber-400 bg-white'
  if (compact) return (
    <button onClick={() => onGoLeaf('prep')} className={`flex items-center gap-2 rounded-lg border-l-4 px-2.5 py-2 text-left shadow-sm transition ${base}`}>
      <span className="shrink-0 text-[15px]">{done ? '✓' : '🧹'}</span>
      <span className={`min-w-0 flex-1 truncate text-[13px] font-medium ${done ? 'text-emerald-700' : 'text-slate-800'}`}>Chuẩn bị {t.phong} · {PREP_LUOT_LABEL[t.luot] ?? t.luot}</span>
      {!done && <DeadlineBadge deadline={t.deadline} now={now} />}
    </button>
  )
  return (
    <button onClick={() => onGoLeaf('prep')} className={`flex flex-col rounded-2xl border-l-4 p-4 text-left shadow-sm transition hover:shadow-md hover:-translate-y-0.5 ${base}`}>
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[18px] ${done ? 'bg-emerald-100' : 'bg-amber-100'}`}>{done ? '✓' : '🧹'}</span>
        <div className={`flex-1 text-[15px] font-semibold leading-snug ${done ? 'text-emerald-700' : 'text-slate-900'}`}>Chuẩn bị phòng {t.phong}</div>
      </div>
      <div className="mt-2 text-[12px] text-slate-500">{PREP_LUOT_LABEL[t.luot] ?? t.luot} · {ddmm(t.ngay)} · ca đầu {t.gioCaDau.slice(0, 5)}</div>
      {done ? (
        <div className="mt-2 text-[11px] font-medium text-emerald-600">✓ Đã xong · bấm để xem</div>
      ) : (
        <div className="mt-2.5"><DeadlineBadge deadline={t.deadline} now={now} /></div>
      )}
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
  const [loai, setLoai] = useState<Set<string>>(new Set())
  const [doneShown, setDoneShown] = useState(20)
  const [now, setNow] = useState(() => Date.now())
  const [viecPT, setViecPT] = useState<ViecFull[]>([])
  // Report/Báo tan + Chuẩn bị phòng (Ops, xem opsvanhanh.ts) — Thùy 07-06: "các loại việc chính của
  // ops chưa được đưa vào Việc của tôi". Nguồn = phan_cong_ops/prep_phong (KHÁC phan_cong_lop/MyTask),
  // fetch riêng theo TỪNG NGƯỜI (không gate theo opsToanHe — assignment là per-person).
  const [opsExtra, setOpsExtra] = useState<OpsTask[]>([])
  const [prepTasks, setPrepTasks] = useState<MyPrepTask[]>([])
  const setStaffLeaf = useStore((s) => s.setStaffLeaf)
  const isMobile = useIsMobile()
  // Ngày TƯƠNG LAI chủ động bấm mở xem trước — hôm nay + ngày ĐÃ QUA (còn nợ) LUÔN mở sẵn (Thùy 07-06:
  // "mục tiêu 1 màn nhìn thấy gần hết việc cần làm" — cùng pattern đã áp OpsReportScreen/PrepScreen).
  const [xemThem, setXemThem] = useState<Set<string>>(new Set())

  useEffect(() => { getMyTasks().then(setTasks).catch(() => setTasks([])) }, [])
  useEffect(() => { if (scope?.nhanSu.id) listViecCuaToi(scope.nhanSu.id).then(setViecPT).catch(() => setViecPT([])) }, [scope?.nhanSu.id])
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
  useEffect(() => {
    const { tu, den } = khoangTuan(tuan)
    getMyOpsTasks(tu, den).then(setOpsExtra).catch(() => setOpsExtra([]))
    getMyPrepTasks(tu, den).then(setPrepTasks).catch(() => setPrepTasks([]))
  }, [tuan])

  if (!scope) return <div className="text-sm text-slate-400">Tài khoản chưa gắn nhân sự — chưa có phạm vi việc.</div>

  const matchLoai = (tab: string) => loai.size === 0 || loai.has(tab)
  const toggleLoai = (tab: string) => setLoai((s) => { const n = new Set(s); n.has(tab) ? n.delete(tab) : n.add(tab); return n })
  // Vai trò quyết định BỘ CHIP nào hiện — Ops KHÔNG có chấm-bài-như-TA (Thùy 07-06), GV/TA không có
  // điểm danh/report/tan/prep. `trucTiep` = có ghế gv/tg lớp nào không (MyScope, nhansu.ts).
  const isOps = !!scope.opsToanHe
  const isGvTa = scope.trucTiep.length > 0
  const chipDefs: ChipDef[] = [...(isOps ? OPS_CHIPS : []), ...(isGvTa ? GVTA_CHIPS : [])]

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
  // Report/Báo tan + Chuẩn bị phòng — đã fetch SẴN theo đúng tuần đang chọn (opsExtra/prepTasks), qua
  // CÙNG bộ lọc loại việc (report/tan/prep giờ có chip riêng trong OPS_CHIPS).
  const opsExtraFiltered = opsExtra.filter((t) => matchLoai(t.tab))
  const opsExtraActive = opsExtraFiltered.filter((t) => !t.done)
  const opsExtraDone = opsExtraFiltered.filter((t) => t.done)
  const prepFiltered = matchLoai('prep') ? prepTasks : []
  const prepActive = prepFiltered.filter((t) => !t.done)
  const prepDone = prepFiltered.filter((t) => t.done)
  const hasActive = opsActive.length + taskActive.length + opsExtraActive.length + prepActive.length > 0
  const canLam = opsActive.length + taskActive.length + opsExtraActive.length + prepActive.length
  const quaHan = taskActive.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
    + opsExtraActive.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
    + prepActive.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
  const satHan = taskActive.filter((t) => mucDeadline(t.deadline, now) === 'sat').length
    + opsExtraActive.filter((t) => mucDeadline(t.deadline, now) === 'sat').length
    + prepActive.filter((t) => mucDeadline(t.deadline, now) === 'sat').length
  const daXongTuan = opsDone.length + weekTasks.filter((t) => t.done).length + opsExtraDone.length + prepDone.length

  // Gom việc ĐANG cần làm theo NGÀY → mỗi ngày 1 hàng (dễ nhìn hơn lưới tràn ngang). Sắp ngày tăng dần.
  const homNay = homNayVN()
  const dayMap = new Map<string, { ops: typeof opsActive; tasks: typeof taskActive; opsExtra: typeof opsExtraActive; prep: typeof prepActive }>()
  const bucket = (ngay: string) => dayMap.get(ngay) ?? { ops: [], tasks: [], opsExtra: [], prep: [] }
  for (const ba of opsActive) { const g = bucket(ba.ngay); g.ops.push(ba); dayMap.set(ba.ngay, g) }
  for (const t of taskActive) { const g = bucket(t.ngay); g.tasks.push(t); dayMap.set(t.ngay, g) }
  for (const t of opsExtraActive) { const g = bucket(t.ngay); g.opsExtra.push(t); dayMap.set(t.ngay, g) }
  for (const t of prepActive) { const g = bucket(t.ngay); g.prep.push(t); dayMap.set(t.ngay, g) }
  const dayGroups = [...dayMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const toggleXem = (ngay: string) => setXemThem((s) => { const n = new Set(s); n.has(ngay) ? n.delete(ngay) : n.add(ngay); return n })

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
      {/* Filter loại việc — chip THEO VAI (Ops/GV/TA khác bộ, xem chipDefs) */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {chipDefs.map((x) => <button key={x.key} onClick={() => toggleLoai(x.key)} className={chipCls(loai.has(x.key))}>{x.icon} {x.ten}</button>)}
        {loai.size > 0 && <button onClick={() => setLoai(new Set())} className="px-2 py-1 text-[12px] text-slate-400 hover:text-slate-600">× Xoá lọc</button>}
      </div>

      {/* Dải số liệu tổng quan — compact (mobile, Thùy 07-06: "4 cái thẻ đếm quá to") */}
      <div className={isMobile ? 'mb-4 grid grid-cols-4 gap-1.5' : 'mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4'}>
        <Metric label="Cần làm" value={canLam} tone="slate" compact={isMobile} />
        <Metric label="Quá hạn" value={quaHan} tone="red" compact={isMobile} />
        <Metric label="Sát hạn" value={satHan} tone="orange" compact={isMobile} />
        <Metric label="Đã xong tuần" value={daXongTuan} tone="emerald" compact={isMobile} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* VẬN HÀNH — chiếm hết phần còn lại */}
        <div className="min-w-0">
          <SectionHead label="Vận hành" count={hasActive ? opsActive.length + taskActive.length + opsExtraActive.length + prepActive.length : undefined} color="bg-indigo-500" />
          {!hasActive ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[13px] font-medium text-emerald-700">✓ Không còn việc vận hành cần làm trong {nhanTuan(tuan).toLowerCase()}.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {dayGroups.map(([ngay, g]) => {
                // Chỉ hôm nay + ngày ĐÃ QUA (còn nợ) mở sẵn — ngày tương lai gấp lại, bấm mới xem
                // (Thùy 07-06: "chưa ẩn việc của các ngày sau" + mục tiêu "1 màn nhìn gần hết việc cần làm").
                const isFuture = ngay > homNay
                const expanded = !isFuture || xemThem.has(ngay)
                const count = g.ops.length + g.tasks.length + g.opsExtra.length + g.prep.length
                if (!expanded) return (
                  <button key={ngay} onClick={() => toggleXem(ngay)} className="flex items-center gap-2 rounded-lg border-l-4 border-slate-300 bg-white px-2.5 py-2 text-left shadow-sm">
                    <span className="text-[13px] font-semibold text-slate-700">{thuCuaNgay(ngay)}</span>
                    <span className="text-[12px] text-slate-500">{ddmmVN(ngay)}</span>
                    <span className="text-[12px] text-slate-400">· {count} việc</span>
                    <span className="ml-auto text-[11px] font-medium text-indigo-500">▸ Xem</span>
                  </button>
                )
                return (
                  <div key={ngay}>
                    {isFuture && (
                      <button onClick={() => toggleXem(ngay)} className="mb-1 text-[11px] font-medium text-indigo-500">▾ Ẩn bớt {thuCuaNgay(ngay)} {ddmmVN(ngay)}</button>
                    )}
                    <DayRow ngay={ngay} today={ngay === homNay} count={count} compact={isMobile}>
                      {g.ops.map((ba) => <OpsBuoiCard key={ba.lop.id + ba.ngay} ba={ba} ngay={ba.ngay} td={ba.buoi ? tienDo[ba.buoi.id] : undefined} onOpen={onOpenBuoi} compact={isMobile} />)}
                      {g.tasks.map((t) => <TaskCard key={t.buoiId + t.tab} t={t} now={now} onOpenBuoi={onOpenBuoi} compact={isMobile} />)}
                      {g.opsExtra.map((t) => <OpsExtraCard key={t.tkbId + t.tab} t={t} now={now} onGoLeaf={setStaffLeaf} compact={isMobile} />)}
                      {g.prep.map((t) => <PrepTaskCard key={t.phong + t.luot + t.ngay} t={t} now={now} onGoLeaf={setStaffLeaf} compact={isMobile} />)}
                    </DayRow>
                  </div>
                )
              })}
            </div>
          )}

          {(opsExtraDone.length > 0 || prepDone.length > 0) && (
            <details className="mt-3">
              <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã xong report/tan/prep tuần này ({opsExtraDone.length + prepDone.length})</summary>
              <div className={isMobile ? 'mt-2 flex flex-col gap-1.5' : 'mt-2 grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]'}>
                {opsExtraDone.map((t) => <OpsExtraCard key={t.tkbId + t.tab} t={t} now={now} done onGoLeaf={setStaffLeaf} compact={isMobile} />)}
                {prepDone.map((t) => <PrepTaskCard key={t.phong + t.luot + t.ngay} t={t} now={now} done onGoLeaf={setStaffLeaf} compact={isMobile} />)}
              </div>
            </details>
          )}

          {opsDone.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã điểm danh xong tuần này ({opsDone.length})</summary>
              <div className={isMobile ? 'mt-2 flex flex-col gap-1.5' : 'mt-2 grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]'}>
                {opsDone.map((ba) => <OpsBuoiCard key={ba.lop.id + ba.ngay} ba={ba} ngay={ba.ngay} td={ba.buoi ? tienDo[ba.buoi.id] : undefined} done onOpen={onOpenBuoi} compact={isMobile} />)}
              </div>
            </details>
          )}

          <details className="mt-3">
            <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã xong — lịch sử ({doneHistory.length})</summary>
            {doneHistory.length === 0 ? (
              <p className="mt-2 text-[12px] text-slate-400">Chưa có việc nào hoàn thành.</p>
            ) : (
              <>
                <div className={isMobile ? 'mt-2 flex flex-col gap-1.5' : 'mt-2 grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]'}>
                  {doneHistory.slice(0, doneShown).map((t) => <TaskCard key={t.buoiId + t.tab} t={t} now={now} done onOpenBuoi={onOpenBuoi} compact={isMobile} />)}
                </div>
                {doneHistory.length > doneShown && (
                  <button onClick={() => setDoneShown((n) => n + 20)} className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">Mở thêm ({doneHistory.length - doneShown})</button>
                )}
              </>
            )}
          </details>
        </div>

        {/* PHÁT TRIỂN — rail hẹp, ngăn cách bằng đường kẻ dọc. Task THẬT (viec/viec_nguoi_lam), không reset theo tuần. */}
        <div className="lg:border-l-2 lg:border-slate-200 lg:pl-5">
          <SectionHead label="Phát triển" color="bg-violet-500" />
          {viecPT.filter((v) => v.trang_thai !== 'dat').length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-[14px] font-medium text-slate-700">📨 Chưa có việc phát triển nào</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">Việc phát triển được cấp trên giao (soạn tài liệu, nhập kho…) sẽ hiện ở đây khi có.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {viecPT.filter((v) => v.trang_thai !== 'dat').map((v) => (
                <button key={v.id} onClick={() => setStaffLeaf('giaoviec')} className="block w-full rounded-2xl bg-white p-3.5 text-left shadow-sm hover:shadow-md">
                  <div className="text-[13px] font-semibold text-slate-800">{v.tieu_de}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{v.loai_viec?.ten} · {v.nguoi_giao_ten} giao{v.han_nghiem_thu ? ` · hạn ${new Date(v.han_nghiem_thu).toLocaleDateString('vi-VN')}` : ''}</div>
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setStaffLeaf('giaoviec')} className="mt-2 text-[12px] font-medium text-indigo-600 hover:underline">Mở màn Giao việc →</button>
        </div>
      </div>
    </div>
  )
}

// Tìm nhãn hiển thị của leaf đang chọn (kể cả con lamtailieu:*) — dùng cho tiêu đề top bar mobile.
function tenLeafDangChon(groups: NavGroup[], selected: string): string {
  for (const g of groups) for (const l of g.leaves) {
    if (l.id === selected) return l.ten
    const c = l.children?.find((x) => x.id === selected)
    if (c) return c.ten
  }
  return 'BKdemy ERP'
}

// MÀN DUY NHẤT (theo spec): 1 cây nav = Việc của tôi (vận hành) + các màn role cấp (phát triển).
// KHÔNG còn 2 tab Nhân sự/Admin.
export default function NhanSuHome({ user }: { user: User }) {
  const { staffLeaf, setStaffLeaf, quyen } = useStore()
  const [scope, setScope] = useState<MyScope | null>(null)
  const [loading, setLoading] = useState(true)
  const [openBuoi, setOpenBuoi] = useState<OpenBuoi | null>(null)
  const isMobile = useIsMobile()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => { getMyScope().then(setScope).finally(() => setLoading(false)) }, [])

  if (openBuoi) return openBuoi.loai === 'bu'
    ? <BuoiBuDetail buoiId={openBuoi.id} onClose={() => setOpenBuoi(null)} />
    : openBuoi.loai === 'bo_tro_duoi'
    ? <BuoiDuoiDetail buoiId={openBuoi.id} onClose={() => setOpenBuoi(null)} />
    : <BuoiDetail id={openBuoi.id} initialTab={openBuoi.initialTab} tabs={openBuoi.tabs} canManage={openBuoi.canManage} onClose={() => setOpenBuoi(null)} />

  // nav hợp nhất: Việc của tôi (vận hành) ++ leaf màn role cấp (phát triển)
  const groups = [...staffNavFromScope(scope), ...adminNavFromQuyen(quyen)]
  // "Chỉ xem" (RBAC ①, xem lib/supabase.ts): banner cảnh báo — chặn THẬT nằm ở seam, đây chỉ để người dùng hiểu vì sao lưu/sửa báo lỗi.
  const chiXemManHinh = quyen && !quyen.laAdmin && quyen.chiXem.includes(staffLeaf.split(':')[0])
  const chonLeaf = (id: string) => { setStaffLeaf(id); setNavOpen(false) } // mobile: chọn xong tự đóng drawer

  return (
    <div className={isMobile ? 'flex h-full min-h-0 flex-col overflow-hidden' : 'grid h-full min-h-0 grid-cols-[240px_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden'}>
      {isMobile ? (
        <>
          {/* Top bar mobile: ☰ mở drawer nav thay sidebar cố định (240px không đủ chỗ trên điện thoại).
              "‹ Việc của tôi" — Thùy 07-06: "không có nút back khiến dùng mobile khá khó chịu" — luôn
              có đường về "nhà" (Việc của tôi) mà không cần mở lại drawer, trừ khi đã đang ở đó. */}
          <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
            {staffLeaf !== 'viec' && (
              <button onClick={() => setStaffLeaf('viec')} className="rounded-md border border-slate-200 px-2.5 py-2 text-[14px] font-medium text-indigo-600 active:bg-indigo-50">‹ Việc của tôi</button>
            )}
            <button onClick={() => setNavOpen(true)} className="rounded-md border border-slate-200 px-3 py-2 text-[15px] text-slate-600 active:bg-slate-100">☰</button>
            <span className="truncate text-[14px] font-semibold text-slate-800">{tenLeafDangChon(groups, staffLeaf)}</span>
          </div>
          {navOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div className="h-full w-[82vw] max-w-[300px] overflow-auto bg-white p-3 shadow-2xl">
                <PersonalCard user={user} />
                <NavTree groups={groups} selected={staffLeaf} onSelect={chonLeaf} />
              </div>
              <div className="flex-1 bg-slate-900/40" onClick={() => setNavOpen(false)} />
            </div>
          )}
        </>
      ) : (
        <aside className="min-h-0 overflow-auto border-r bg-white/60 p-3">
          <PersonalCard user={user} />
          <NavTree groups={groups} selected={staffLeaf} onSelect={setStaffLeaf} />
        </aside>
      )}
      {/* Khung phải: min-w-0 để bảng rộng (vd chấm bài nhiều bài) CUỘN trong khung thay vì bung cột → tràn layout. */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {chiXemManHinh && (
        <div className="shrink-0 flex items-center gap-1.5 border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-[12px] font-medium text-amber-700">
          🔒 Bạn chỉ có quyền XEM ở màn này — thao tác lưu/sửa/xoá sẽ bị chặn.
        </div>
      )}
      <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden">
      {loading ? (
        <section className="p-8 text-sm text-slate-400">Đang tải…</section>
      ) : staffLeaf === 'viec' ? (
        <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8"><VietCuaToi scope={scope} onOpenBuoi={setOpenBuoi} /></section>
      ) : staffLeaf === 'bdkt' ? <KhoScreen />
      : staffLeaf === 'nhapkho' ? <NhapKhoScreen />
      : (staffLeaf === 'lamtailieu' || staffLeaf === 'lamtailieu:giao_trinh') ? <TaiLieuScreen />
      : staffLeaf === 'lamtailieu:et' ? <ETScreen />
      : staffLeaf === 'lamtailieu:mt' ? <MTScreen />
      : staffLeaf === 'tl' ? <KhoTaiLieuScreen />
      : staffLeaf === 'lamtailieu:bo_tro' ? <section className="flex min-h-0 items-center justify-center p-8 text-sm text-slate-400">Loại tài liệu này dựng sau.</section>
      : staffLeaf === 'hocphi' ? <HocPhiScreen />
      : staffLeaf === 'giaoviec' ? <GiaoViecScreen />
      : staffLeaf === 'db_chatluong' ? <ChatLuongVanHanhScreen />
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
      : staffLeaf === 'duyetcham' ? <DuyetChamScreen />
      : staffLeaf === 'quanlylevel' ? <QuanLyLevelScreen />
      : staffLeaf === 'phanquyen' ? <PhanQuyenScreen />
      : staffLeaf === 'baoloi' ? <BaoLoiScreen />
      : staffLeaf === 'ops_report' ? <OpsReportScreen />
      : staffLeaf === 'prep' ? <PrepScreen />
      : staffLeaf === 'phancong_ops' ? <PhanCongOpsScreen />
      : staffLeaf === 'diem_danh_test' ? <DiemDanhTestScreen />
      : (
        <section className="flex min-h-0 items-center justify-center p-8 text-sm text-slate-400">Chọn một mục bên trái.</section>
      )}
      </div>
      </div>
    </div>
  )
}
