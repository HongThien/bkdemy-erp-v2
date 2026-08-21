import { useEffect, useState } from 'react'
import type { User, NavGroup } from '../types'
import { useStore, staffNavFromScope, adminNavFromQuyen } from '../store/useStore'
import { getMyScope, type MyScope } from '../lib/nhansu'
import { useIsMobile } from '../hooks/useIsMobile'
import { getMyTasks, moBuoi, diemDanhTienDo, danhGiaTienDo, type MyTask, type BuoiAo, type TabKey } from '../lib/gami'
import { getMyOpsTasks, getMyPrepTasks, myBuoiAoCuaKhoang, OPS_TASK_LABEL, type OpsTask, type MyPrepTask } from '../lib/opsvanhanh'
import { listCanScanDaCham, type CaTestChoScanDaCham } from '../lib/detest'
import { homNayVN, tuanCuaNgay, khoangTuan, nhanTuan, mucDeadline, nhanConLai, thuCuaNgay, ddmmVN, ngayCuaTs, type DeadlineMuc } from '../lib/tuan'
import { BuoiDetail } from './gami/BuoiHocScreen'
import { BuoiBuDetail } from './botro/BoTroScreen'
import { BuoiDuoiDetail } from './botro/BoTroDuoiScreen'
import PersonalCard from '../components/PersonalCard'
import NavTree from '../components/NavTree'
import KhoScreen from './kho/KhoScreen'
import NhapKhoScreen from './nhapkho/NhapKhoScreen'
import TaiLieuScreen from './tailieu/TaiLieuScreen'
import GiaoTrinhHinhEntry from './tailieu/GiaoTrinhHinhEntry'
import ETScreen from './tailieu/ETScreen'
import MTScreen from './tailieu/MTScreen'
import BTScreen from './tailieu/BTScreen'
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
import ReportPHScreen from './report/ReportPHScreen'
import DuyetChamScreen from './duyetcham/DuyetChamScreen'
import HocPhiScreen from './hocphi/HocPhiScreen'
import GiaoViecScreen from './giaoviec/GiaoViecScreen'
import VietCuaToiTab from './giaoviec/VietCuaToiTab'
import CongKhaiTab from './giaoviec/CongKhaiTab'
import TroLyTab from './troly/TroLyTab'
import { listDotChoDuyetDuoi } from '../lib/botro_duoi'
import QuanLyLevelScreen from './gami/QuanLyLevelScreen'
import PhanQuyenScreen from './phanquyen/PhanQuyenScreen'
import BaoLoiScreen from './baoloi/BaoLoiScreen'
import OpsReportScreen from './vanhanhops/OpsReportScreen'
import PrepScreen from './vanhanhops/PrepScreen'
import PhongHocScreen from './phonghoc/PhongHocScreen'
import PhanCongOpsScreen from './vanhanhops/PhanCongOpsScreen'
import ScanDaChamScreen from './vanhanhops/ScanDaChamScreen'
import TuyenSinhScreen from './tuyensinh/TuyenSinhScreen'
import TestDauVaoScreen from './tuyensinh/TestDauVaoScreen'
import BoTroScreen from './botro/BoTroScreen'
import BoTroDuoiScreen from './botro/BoTroDuoiScreen'
import ChatLuongVanHanhScreen from './dashboard/ChatLuongVanHanhScreen'
import PhDangNhapScreen from './dashboard/PhDangNhapScreen'
import XemAppScreen from './dashboard/XemAppScreen'
import DashboardHocTapScreen from './danhgia/DashboardHocTapScreen'

// tg thấy thêm tab 'mt' (chấm MT nếu buổi có gán — tự ẩn/hiện rỗng như ET nếu chưa có).
const tabsCuaVai = (vai: 'gv' | 'tg'): TabKey[] => (vai === 'gv' ? ['danhgia', 'ingame'] : ['ingame', 'et', 'mt'])
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
const TASK_STYLE: Record<TabKey, { icon: string; accent: string }> = {
  diemdanh: { icon: '👥', accent: 'border-l-blue-400' },
  ingame: { icon: '✏️', accent: 'border-l-violet-400' },
  et: { icon: '📝', accent: 'border-l-teal-400' },
  btvn: { icon: '📒', accent: 'border-l-amber-400' },
  danhgia: { icon: '⭐', accent: 'border-l-rose-400' },
  mt: { icon: '🏆', accent: 'border-l-fuchsia-400' },
  baosai: { icon: '🚩', accent: 'border-l-rose-500' },
}
// Loại việc cho filter chip — THEO VAI (Thùy 07-06: "Ops không có chấm bài như TA, phải hiện đúng
// việc của ops"): Ops thấy Điểm danh/Report/Báo tan/Chuẩn bị phòng · GV/TA thấy Chấm bài/ET/BTVN/Đánh
// giá. 'diemdanh' CHỈ thuộc nhóm Ops (GV/TA không có item diemdanh nào — xem TASKS_BY_VAI ở gami.ts).

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

// Card việc — Thùy 07-11 (2 vòng góp ý): card gọn cho MỌI viewport (không còn biến thể cao 3 dòng cũ) +
// LUÔN ĐÚNG 2 DÒNG (vòng 1 "1 dòng" bị vỡ thành 3 dòng khi tên dài — flex ngang ép label+deadline chung
// 1 hàng, label dài tự xuống dòng mà deadline vẫn đứng cạnh → cao lệch). Fix: bỏ hẳn flex-ngang-1-hàng,
// chuyển hẳn sang flex-col 2 DÒNG CỐ ĐỊNH — dòng 1 = icon+tên việc (full, không truncate), dòng 2 =
// deadline nhỏ hơn, thụt vào ngang icon dòng trên.
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
  const base = done ? 'border-l-emerald-500 bg-emerald-50' : `${TASK_STYLE.diemdanh.accent} bg-white`
  return (
    <button onClick={go} disabled={busy} className={`flex flex-col gap-0.5 rounded-lg border-l-4 px-2.5 py-2 text-left shadow-sm transition disabled:opacity-50 ${base}`}>
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 text-[15px]">{done ? '✓' : '👥'}</span>
        <span className={`min-w-0 flex-1 text-[13px] font-medium ${done ? 'text-emerald-700' : 'text-slate-800'}`}>Điểm danh · {ba.lop.ten_lop}</span>
      </div>
      {td && <span className="pl-[21px] text-[11px] font-medium text-slate-400">{td.daDanh}/{td.tong}</span>}
    </button>
  )
}

function TaskCard({ t, now, done, dg, onOpenBuoi, onGoLeaf }: { t: MyTask; now: number; done?: boolean; dg?: { tong: number; daDanh: number }; onOpenBuoi: (o: OpenBuoi) => void; onGoLeaf: (leaf: string) => void }) {
  const st = TASK_STYLE[t.tab]
  const base = done ? 'border-l-emerald-500 bg-emerald-50' : `${st.accent} bg-white`
  // 'baosai' KHÔNG phải khâu của buổi — nó là hàng đợi duyệt của test online ⇒ đi tới màn
  // "Duyệt chấm online", không mở BuoiDetail (mở buổi thì chẳng có tab nào tương ứng).
  const onClick = () => (t.tab === 'baosai'
    ? onGoLeaf('duyetcham')
    : onOpenBuoi({ id: t.buoiId, tabs: tabsCuaVai(t.vai), initialTab: t.tab, canManage: false, loai: t.loai }))
  // Đánh giá đã điền dở/đủ mà chưa bấm Hoàn thành: nói ra số. Điền ĐỦ mà chưa chốt là ca hay gặp
  // nhất (người làm tưởng xong rồi) → tô hổ phách để phân biệt hẳn với buổi chưa ai đụng.
  const duDien = !!dg && dg.tong > 0 && dg.daDanh >= dg.tong
  return (
    <button onClick={onClick} className={`flex flex-col gap-0.5 rounded-lg border-l-4 px-2.5 py-2 text-left shadow-sm transition ${base}`}>
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 text-[15px]">{done ? '✓' : st.icon}</span>
        <span className={`min-w-0 flex-1 text-[13px] font-medium ${done ? 'text-emerald-700' : 'text-slate-800'}`}>{t.label} · {t.lop}</span>
      </div>
      {!done && dg && dg.daDanh > 0 && (
        <span className={`pl-[21px] text-[11px] font-medium ${duDien ? 'text-amber-600' : 'text-slate-400'}`}>
          đã điền {dg.daDanh}/{dg.tong}{duDien ? ' — bấm ✓ Hoàn thành để chốt' : ''}
        </span>
      )}
      {!done && t.deadline != null && <div className="pl-[21px]"><DeadlineBadge deadline={t.deadline} now={now} /></div>}
    </button>
  )
}
// Report/Báo tan (Ops, xem opsvanhanh.ts) — card TÓM TẮT, bấm → sang màn "Report & Báo tan" (làm việc
// thật ở đó: copy tin nhắn + chụp ảnh + đóng — không nhồi hết luồng vào đây).
const OPS_TASK_ICON: Record<OpsTask['tab'], string> = { report: '📣', tan: '🔔' }
function OpsExtraCard({ t, now, done, onGoLeaf }: { t: OpsTask; now: number; done?: boolean; onGoLeaf: (leaf: string) => void }) {
  const base = done ? 'border-l-emerald-500 bg-emerald-50' : 'border-l-sky-400 bg-white'
  return (
    <button onClick={() => onGoLeaf('ops_report')} className={`flex flex-col gap-0.5 rounded-lg border-l-4 px-2.5 py-2 text-left shadow-sm transition ${base}`}>
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 text-[15px]">{done ? '✓' : OPS_TASK_ICON[t.tab]}</span>
        <span className={`min-w-0 flex-1 text-[13px] font-medium ${done ? 'text-emerald-700' : 'text-slate-800'}`}>{OPS_TASK_LABEL[t.tab]} · {t.lopTen}</span>
      </div>
      {!done && <div className="pl-[21px]"><DeadlineBadge deadline={t.deadline} now={now} /></div>}
    </button>
  )
}
// Chuẩn bị phòng (Ops, xem opsvanhanh.ts) — card TÓM TẮT, bấm → sang màn "Chuẩn bị phòng".
const PREP_LUOT_LABEL: Record<string, string> = { sang: 'Sáng', chieu: 'Chiều', toi: 'Tối' }
function PrepTaskCard({ t, now, done, onGoLeaf }: { t: MyPrepTask; now: number; done?: boolean; onGoLeaf: (leaf: string) => void }) {
  const base = done ? 'border-l-emerald-500 bg-emerald-50' : 'border-l-amber-400 bg-white'
  return (
    <button onClick={() => onGoLeaf('prep')} className={`flex flex-col gap-0.5 rounded-lg border-l-4 px-2.5 py-2 text-left shadow-sm transition ${base}`}>
      <div className="flex items-center gap-1.5">
        <span className="shrink-0 text-[15px]">{done ? '✓' : '🧹'}</span>
        <span className={`min-w-0 flex-1 text-[13px] font-medium ${done ? 'text-emerald-700' : 'text-slate-800'}`}>Chuẩn bị {t.phong} · {PREP_LUOT_LABEL[t.luot] ?? t.luot}</span>
      </div>
      {!done && <div className="pl-[21px]"><DeadlineBadge deadline={t.deadline} now={now} /></div>}
    </button>
  )
}

// 1 NGÀY = 1 hàng: cột Ngày (Thứ + dd/mm) BÊN TRÁI + lưới card NHIỀU CỘT bên phải (Thùy 07-11: "card
// phải như cũ chứ ko phải mỗi card biến thành 1 dòng" — card giữ đúng dạng gọn cũ, chỉ đổi vị trí nhãn
// ngày từ THANH NGANG phía trên → CỘT dọc bên trái, đứng ngang hàng với card luôn).
function DayRow({ ngay, today, isFuture, onToggle, children }: { ngay: string; today: boolean; isFuture: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <div className={`flex w-[62px] shrink-0 flex-col rounded-lg border-l-4 px-2 py-1.5 ${today ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 bg-slate-50'}`}>
        <span className="text-[13px] font-semibold text-slate-800">{thuCuaNgay(ngay)}</span>
        <span className="text-[11px] text-slate-500">{ddmmVN(ngay)}</span>
        {today && <span className="mt-1 w-fit rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">Hôm nay</span>}
        {isFuture && <button onClick={onToggle} className="mt-1 text-left text-[10px] font-medium text-indigo-500">▾ ẩn</button>}
      </div>
      <div className="grid flex-1 content-start gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">{children}</div>
    </div>
  )
}

// VIỆC CỦA TÔI: VẬN HÀNH (cột trái, 2 cột) lọc theo TUẦN + deadline · PHÁT TRIỂN (cột phải, 1 cột) = placeholder giao việc.
function VietCuaToi({ scope, onOpenBuoi }: { scope: MyScope | null; onOpenBuoi: (o: OpenBuoi) => void }) {
  const tuanNay = tuanCuaNgay(homNayVN())
  const [tasks, setTasks] = useState<MyTask[]>([])
  const [opsWeek, setOpsWeek] = useState<(BuoiAo & { ngay: string })[]>([])
  const [tienDo, setTienDo] = useState<Record<string, TienDo>>({})
  const [dgTienDo, setDgTienDo] = useState<Record<string, { tong: number; daDanh: number }>>({})
  const [tuan, setTuan] = useState(tuanNay)
  // 'rasoat' = tab TRỢ LÝ (nhắc việc hàng ngày + nhận định cấp hệ) — screens/troly/TroLyTab.tsx.
  // CỐ Ý không đẻ leaf mới: leaf kéo theo quyền per-leaf ở Phân quyền + hiện trong nav của
  // MỌI role, trong khi lượt này chỉ 1 người dùng. Tab thì bỏ đi cũng sạch.
  const [view, setView] = useState<'vanhanh' | 'phattrien' | 'rasoat'>('vanhanh')
  // Phát triển: mặc định CẢ TEAM (kế hoạch tuần công khai — Thùy chốt 08-13: team bé, làm
  // gương, không có rủi ro tâm lý) — option bên cạnh để thu hẹp về chỉ việc của mình.
  const [phatTrienXem, setPhatTrienXem] = useState<'team' | 'toi'>('team')
  const [doneShown, setDoneShown] = useState(20)
  const [now, setNow] = useState(() => Date.now())
  // Report/Báo tan + Chuẩn bị phòng (Ops, xem opsvanhanh.ts) — Thùy 07-06: "các loại việc chính của
  // ops chưa được đưa vào Việc của tôi". Nguồn = phan_cong_ca/prep_phong (KHÁC phan_cong_lop/MyTask),
  // fetch riêng theo TỪNG NGƯỜI (không gate theo opsToanHe — assignment là per-person).
  const [opsExtra, setOpsExtra] = useState<OpsTask[]>([])
  const [prepTasks, setPrepTasks] = useState<MyPrepTask[]>([])
  // Team học thuật (0100): đợt bổ trợ đuổi CHỜ chốt/duyệt dạng — derive theo môn học thuật của tôi (hocThuatMons).
  const [choDuyetDuoi, setChoDuyetDuoi] = useState(0)
  // Test đầu vào — Scan bài đã chấm (Ops) — Thùy 07-19 lần 2: "không cần tab riêng, chỉ cần derive task
  // cho Ops". Pool chung (như Chấm test), KHÔNG lọc theo người — ai mở thì làm.
  const [scanTest, setScanTest] = useState<CaTestChoScanDaCham[]>([])
  const me = useStore((s) => s.me)
  const setStaffLeaf = useStore((s) => s.setStaffLeaf)
  const isMobile = useIsMobile()
  // Ngày TƯƠNG LAI chủ động bấm mở xem trước — hôm nay + ngày ĐÃ QUA (còn nợ) LUÔN mở sẵn (Thùy 07-06:
  // "mục tiêu 1 màn nhìn thấy gần hết việc cần làm" — cùng pattern đã áp OpsReportScreen/PrepScreen).
  const [xemThem, setXemThem] = useState<Set<string>>(new Set())

  useEffect(() => {
    getMyTasks().then(async (ts) => {
      setTasks(ts)
      // Việc "Đánh giá" chưa chốt: hỏi thêm ĐÃ ĐIỀN tới đâu (dòng thật), để card nói "5/6" thay vì
      // im lặng như buổi trắng — xem `danhGiaTienDo` (gami.ts) cho lý do.
      const ids = [...new Set(ts.filter((t) => t.tab === 'danhgia' && !t.done).map((t) => t.buoiId))]
      try { setDgTienDo(ids.length ? await danhGiaTienDo(ids) : {}) } catch { setDgTienDo({}) }
    }).catch(() => setTasks([]))
  }, [])
  useEffect(() => {
    const htMons = me?.hocThuatMons ?? []
    if (!htMons.length) { setChoDuyetDuoi(0); return }
    listDotChoDuyetDuoi(htMons).then((r) => setChoDuyetDuoi(r.length)).catch(() => setChoDuyetDuoi(0))
  }, [me?.hocThuatMons])
  useEffect(() => {
    if (!scope?.opsToanHe) { setScanTest([]); return }
    listCanScanDaCham().then(setScanTest).catch(() => setScanTest([]))
  }, [scope?.opsToanHe])
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id) }, [])
  useEffect(() => {
    if (!scope?.opsToanHe) { setOpsWeek([]); return }
    const { tu, den } = khoangTuan(tuan)
    // ⭐ Fix 07-19 (Thùy: "việc phân công cho ops nào chỉ hiện cho ops đấy, đang hiện chung cho tất cả
    // ops") — buoiAoCuaKhoang trả TOÀN TRƯỜNG (mọi lớp), KHÔNG lọc theo người. Đổi sang myBuoiAoCuaKhoang
    // (opsvanhanh.ts) — lọc đúng theo ca đang trực của TÔI, cùng cơ chế getMyOpsTasks/getMyPrepTasks.
    myBuoiAoCuaKhoang(tu, den).then(async (list) => {
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

  // OPS điểm danh (trong tuần đang chọn): XONG = buổi mở & mọi HS đã đánh dấu.
  const opsXong = (ba: BuoiAo) => { const b = ba.buoi; if (!b || b.trang_thai === 'huy') return false; const t = tienDo[b.id]; return !!t && t.daDanh >= t.tong }
  const opsList = opsWeek.filter((ba) => !ba.buoi || ba.buoi.trang_thai !== 'huy')
  const opsActive = opsList.filter((ba) => !opsXong(ba))
  const opsDone = opsList.filter(opsXong)

  // GV/TG: việc trong TUẦN + filter loại. Gom/lọc theo NGÀY của việc:
  //  • BTVN → theo NGÀY DEADLINE (Thùy 07-11: hạn = 2h trước ca học TIẾP THEO, cách xa ngày buổi → phải
  //    hiện ở hàng ngày hạn, thường sang tuần sau — chấm ở buổi kế).
  //  • Còn lại (chấm bài/đánh giá/ET/MT) → theo NGÀY BUỔI. ⭐ Bug 07-26 (Bảo Ngân, lớp học CHỦ NHẬT):
  //    trước gom MỌI task theo deadline; ET hạn 12h TRƯA HÔM SAU, mà buổi CN là ngày CUỐI tuần BK (T2→CN)
  //    → deadline rơi sang THỨ 2 = TUẦN SAU → task ET của buổi hôm nay biến mất khỏi "tuần này". Các task
  //    này là việc NGAY của buổi nên phải nằm cùng tuần/ngày buổi; deadline vẫn hiển thị riêng ở badge.
  const ngayViec = (t: MyTask) => (t.tab === 'btvn' && t.deadline != null ? ngayCuaTs(t.deadline) : t.ngay)
  const weekTasks = tasks.filter((t) => tuanCuaNgay(ngayViec(t)) === tuan)
  const taskActive = weekTasks.filter((t) => !t.done)
  // Lịch sử "đã xong" — TẤT CẢ thời gian, gần→xa theo doneAt (20/lần). Độc lập filter tuần.
  const doneHistory = tasks.filter((t) => t.done).sort((a, b) => (b.doneAt ?? '').localeCompare(a.doneAt ?? ''))
  // Report/Báo tan + Chuẩn bị phòng — đã fetch SẴN theo đúng tuần đang chọn (opsExtra/prepTasks).
  const opsExtraFiltered = opsExtra
  const opsExtraActive = opsExtraFiltered.filter((t) => !t.done)
  const opsExtraDone = opsExtraFiltered.filter((t) => t.done)
  const prepFiltered = prepTasks
  const prepActive = prepFiltered.filter((t) => !t.done)
  const prepDone = prepFiltered.filter((t) => t.done)
  const hasActive = opsActive.length + taskActive.length + opsExtraActive.length + prepActive.length + scanTest.length > 0
  const canLam = opsActive.length + taskActive.length + opsExtraActive.length + prepActive.length + scanTest.length
  const quaHan = taskActive.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
    + opsExtraActive.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
    + prepActive.filter((t) => mucDeadline(t.deadline, now) === 'qua_han').length
  const satHan = taskActive.filter((t) => mucDeadline(t.deadline, now) === 'sat').length
    + opsExtraActive.filter((t) => mucDeadline(t.deadline, now) === 'sat').length
    + prepActive.filter((t) => mucDeadline(t.deadline, now) === 'sat').length
  const daXongTuan = opsDone.length + weekTasks.filter((t) => t.done).length + opsExtraDone.length + prepDone.length

  // Gom việc ĐANG cần làm theo NGÀY DEADLINE (KHÔNG phải ngày buổi/ngày tạo) → mỗi ngày 1 hàng. Sắp ngày
  // tăng dần. opsActive (điểm danh) không có deadline riêng — hạn = chính ngày buổi nên vẫn gom theo ngay.
  const homNay = homNayVN()
  const dayMap = new Map<string, { ops: typeof opsActive; tasks: typeof taskActive; opsExtra: typeof opsExtraActive; prep: typeof prepActive }>()
  const bucket = (ngay: string) => dayMap.get(ngay) ?? { ops: [], tasks: [], opsExtra: [], prep: [] }
  for (const ba of opsActive) { const g = bucket(ba.ngay); g.ops.push(ba); dayMap.set(ba.ngay, g) }
  for (const t of taskActive) { const k = ngayViec(t); const g = bucket(k); g.tasks.push(t); dayMap.set(k, g) }
  for (const t of opsExtraActive) { const k = ngayCuaTs(t.deadline); const g = bucket(k); g.opsExtra.push(t); dayMap.set(k, g) }
  for (const t of prepActive) { const k = ngayCuaTs(t.deadline); const g = bucket(k); g.prep.push(t); dayMap.set(k, g) }
  // Trong CÙNG 1 ngày, sắp thêm theo GIỜ deadline chính xác tăng dần (gần hạn nhất lên đầu) — không chỉ
  // gom theo ngày mà bằng nhau thứ tự tuỳ ý (Thùy 07-11: "việc gần đến deadline phải ở trên").
  for (const g of dayMap.values()) {
    g.tasks.sort((a, b) => (a.deadline ?? Infinity) - (b.deadline ?? Infinity))
    g.opsExtra.sort((a, b) => a.deadline - b.deadline)
    g.prep.sort((a, b) => a.deadline - b.deadline)
  }
  const dayGroups = [...dayMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const toggleXem = (ngay: string) => setXemThem((s) => { const n = new Set(s); n.has(ngay) ? n.delete(ngay) : n.add(ngay); return n })

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Header + điều hướng tuần — Thùy 07-19 (mobile): "lởm quá, quá nhiều thông tin thừa" — bỏ h2
          "Việc của tôi" trùng lặp (top bar mobile đã hiện rồi, xem NhanSuHome ~dòng 493), tuần dồn gọn
          góc phải, MÀN HÌNH CHỈ CÒN CARD VIỆC LÀ CHÍNH. */}
      <div className={isMobile ? 'mb-3 flex flex-wrap items-center gap-2' : 'mb-4 flex flex-wrap items-center gap-3'}>
        {!isMobile && <h2 className="text-[22px] font-semibold text-slate-800">Việc của tôi</h2>}
        {/* TOGGLE Vận hành / Phát triển — thay cho filter loại việc (CEO chốt 07-31). Số task trực quan,
            không cần lọc; Phát triển tách hẳn sang view riêng cho rộng rãi. */}
        <div className="inline-flex rounded-full bg-slate-100 p-0.5">
          {([['vanhanh', '🛠 Vận hành'], ['phattrien', '🚀 Phát triển'], ['rasoat', '🤖 Trợ lý']] as const).map(([k, ten]) => (
            <button key={k} onClick={() => setView(k)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${view === k ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{ten}</button>
          ))}
        </div>
        {view === 'vanhanh' && (
          <div className={isMobile ? 'flex items-center gap-1' : 'ml-auto flex items-center gap-1.5'}>
            <button onClick={() => setTuan((t) => t - 1)} className={isMobile ? 'rounded-md border border-slate-200 px-2 py-1 text-[14px] leading-none text-slate-600' : 'rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300'}>‹</button>
            <span className={isMobile ? 'text-center text-[12.5px] font-semibold text-slate-700' : 'min-w-[210px] text-center text-[15px] font-semibold text-slate-700'}>
              {isMobile ? `${ddmmVN(khoangTuan(tuan).tu)}–${ddmmVN(khoangTuan(tuan).den)}` : nhanTuan(tuan)}
            </span>
            <button onClick={() => setTuan((t) => t + 1)} className={isMobile ? 'rounded-md border border-slate-200 px-2 py-1 text-[14px] leading-none text-slate-600' : 'rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300'}>›</button>
            {tuan !== tuanNay && <button onClick={() => setTuan(tuanNay)} className={isMobile ? 'ml-1 rounded-md bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-600' : 'ml-1 rounded-md bg-indigo-50 px-2.5 py-1.5 text-[14px] font-medium text-indigo-600 hover:bg-indigo-100'}>Tuần này</button>}
          </div>
        )}
      </div>

      {view === 'vanhanh' ? (
        <>
      {/* Dải số liệu tổng quan — compact (mobile, Thùy 07-06: "4 cái thẻ đếm quá to") */}
      <div className={isMobile ? 'mb-4 grid grid-cols-4 gap-1.5' : 'mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4'}>
        <Metric label="Cần làm" value={canLam} tone="slate" compact={isMobile} />
        <Metric label="Quá hạn" value={quaHan} tone="red" compact={isMobile} />
        <Metric label="Sát hạn" value={satHan} tone="orange" compact={isMobile} />
        <Metric label="Đã xong tuần" value={daXongTuan} tone="emerald" compact={isMobile} />
      </div>

        {/* VẬN HÀNH — full width */}
        <div className="min-w-0">
          {!hasActive ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[13px] font-medium text-emerald-700">✓ Không còn việc vận hành cần làm trong {nhanTuan(tuan).toLowerCase()}.</div>
          ) : (
            <div className="flex flex-col gap-2.5">
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
                  <DayRow key={ngay} ngay={ngay} today={ngay === homNay} isFuture={isFuture} onToggle={() => toggleXem(ngay)}>
                    {g.ops.map((ba) => <OpsBuoiCard key={ba.lop.id + ba.ngay} ba={ba} ngay={ba.ngay} td={ba.buoi ? tienDo[ba.buoi.id] : undefined} onOpen={onOpenBuoi} />)}
                    {g.tasks.map((t) => <TaskCard key={t.buoiId + t.tab} t={t} now={now} dg={t.tab === 'danhgia' ? dgTienDo[t.buoiId] : undefined} onOpenBuoi={onOpenBuoi} onGoLeaf={setStaffLeaf} />)}
                    {g.opsExtra.map((t) => <OpsExtraCard key={t.tkbId + t.tab} t={t} now={now} onGoLeaf={setStaffLeaf} />)}
                    {g.prep.map((t) => <PrepTaskCard key={t.phong + t.luot + t.ngay} t={t} now={now} onGoLeaf={setStaffLeaf} />)}
                  </DayRow>
                )
              })}
            </div>
          )}

          {/* Test đầu vào — Scan bài đã chấm (Ops, pool chung — không lọc theo người, cùng cơ chế Chấm
              test). Không có deadline/ngày riêng để gom theo NgàyRow nên để RIÊNG 1 khối flat. */}
          {scanTest.length > 0 && (
            <div className="mt-3">
              <div className="mb-1.5 text-[12px] font-semibold text-slate-500">📷 Test đầu vào — cần scan bài đã chấm ({scanTest.length})</div>
              <div className="grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                {scanTest.map((c) => (
                  <button key={c.id} onClick={() => setStaffLeaf('test_dau_vao_scan')} className="flex flex-col gap-0.5 rounded-lg border-l-4 border-l-fuchsia-400 bg-white px-2.5 py-2 text-left shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-1.5">
                      <span className="shrink-0 text-[15px]">📷</span>
                      <span className="min-w-0 flex-1 text-[13px] font-medium text-slate-800">{c.hoTenHs} · {c.mon}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(opsExtraDone.length > 0 || prepDone.length > 0) && (
            <details className="mt-3">
              <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã xong report/tan/prep tuần này ({opsExtraDone.length + prepDone.length})</summary>
              <div className="mt-2 grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                {opsExtraDone.map((t) => <OpsExtraCard key={t.tkbId + t.tab} t={t} now={now} done onGoLeaf={setStaffLeaf} />)}
                {prepDone.map((t) => <PrepTaskCard key={t.phong + t.luot + t.ngay} t={t} now={now} done onGoLeaf={setStaffLeaf} />)}
              </div>
            </details>
          )}

          {opsDone.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã điểm danh xong tuần này ({opsDone.length})</summary>
              <div className="mt-2 grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
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
                <div className="mt-2 grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                  {doneHistory.slice(0, doneShown).map((t) => <TaskCard key={t.buoiId + t.tab} t={t} now={now} done onOpenBuoi={onOpenBuoi} onGoLeaf={setStaffLeaf} />)}
                </div>
                {doneHistory.length > doneShown && (
                  <button onClick={() => setDoneShown((n) => n + 20)} className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">Mở thêm ({doneHistory.length - doneShown})</button>
                )}
              </>
            )}
          </details>
        </div>
        </>
      ) : view === 'rasoat' ? (
        /* TRỢ LÝ — nhắc việc hàng ngày, 3 nút Làm/Huỷ/Gác. KHÔNG gọi model (xem đầu TroLyTab.tsx). */
        <TroLyTab />
      ) : (
        /* PHÁT TRIỂN — view riêng, full width (task THẬT viec/task mẹ-con, không reset theo tuần) */
        <div>
          {/* Team học thuật: đợt bổ trợ đuổi chờ chốt dạng (derive theo hocThuatMons) — Thùy 07-15 */}
          {choDuyetDuoi > 0 && (
            <button onClick={() => setStaffLeaf('botro_duoi')} className="mx-auto mb-3 block w-full max-w-[900px] rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-left shadow-sm hover:shadow-md">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-amber-800">📚 {choDuyetDuoi} đợt bổ trợ đuổi chờ chốt dạng</div>
              <p className="mt-1 text-[12px] leading-relaxed text-amber-700">Ops đã tạo card đuổi — bạn (team học thuật) chốt dạng cần đuổi + số buổi để GV dạy bám theo.</p>
            </button>
          )}
          <div className="mx-auto mb-3 flex max-w-[960px] items-center justify-end">
            <div className="inline-flex rounded-full bg-slate-100 p-0.5">
              {([['team', '👥 Cả team'], ['toi', '🙋 Chỉ tôi']] as const).map(([k, ten]) => (
                <button key={k} onClick={() => setPhatTrienXem(k)}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${phatTrienXem === k ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{ten}</button>
              ))}
            </div>
          </div>
          {phatTrienXem === 'team' ? <CongKhaiTab /> : (scope && <VietCuaToiTab nhanSuId={scope.nhanSu.id} />)}
        </div>
      )}
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
      {/* Back desktop (Thùy 07-19: "có nút back về màn hình trước") — mobile đã có "‹ Việc của tôi" ở top
          bar riêng (dòng ~490); desktop trước đó KHÔNG có đường quay lại nào ngoài bấm lại sidebar. */}
      {!isMobile && staffLeaf !== 'viec' && (
        <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-1.5">
          <button onClick={() => setStaffLeaf('viec')} className="rounded-md px-1.5 py-1 text-[13px] font-medium text-indigo-600 hover:bg-indigo-50">‹ Việc của tôi</button>
        </div>
      )}
      {chiXemManHinh && (
        <div className="shrink-0 flex items-center gap-1.5 border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-[12px] font-medium text-amber-700">
          🔒 Bạn chỉ có quyền XEM ở màn này — thao tác lưu/sửa/xoá sẽ bị chặn.
        </div>
      )}
      {/* grid-cols-[minmax(0,1fr)]: track co được (0→1fr) nên screen root — grid item — KHÔNG bị min-width:auto
          (theo nội dung) ép phình. Thiếu track này thì màn có nội dung rộng (org chart, ma trận phân quyền,
          bảng học phí…) tự nong ra rồi bị overflow-hidden của shell CẮT CỤT không cuộn tới được. Có track,
          root co về đúng bề rộng, phần thân overflow-auto tự cuộn ngang. */}
      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden">
      {loading ? (
        <section className="p-8 text-sm text-slate-400">Đang tải…</section>
      ) : staffLeaf === 'viec' ? (
        <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8"><VietCuaToi scope={scope} onOpenBuoi={setOpenBuoi} /></section>
      ) : staffLeaf === 'bdkt' ? <KhoScreen />
      : staffLeaf === 'nhapkho' ? <NhapKhoScreen />
      : (staffLeaf === 'lamtailieu' || staffLeaf === 'lamtailieu:giao_trinh') ? <TaiLieuScreen />
      : staffLeaf === 'lamtailieu:giao_trinh_hinh' ? <GiaoTrinhHinhEntry />
      : staffLeaf === 'lamtailieu:et' ? <ETScreen />
      : staffLeaf === 'lamtailieu:mt' ? <MTScreen />
      : staffLeaf === 'tl' ? <KhoTaiLieuScreen />
      : staffLeaf === 'lamtailieu:bo_tro' ? <BTScreen />
      : staffLeaf === 'hocphi' ? <HocPhiScreen />
      : staffLeaf === 'giaoviec' ? <GiaoViecScreen />
      : staffLeaf === 'db_chatluong' ? <ChatLuongVanHanhScreen />
      : staffLeaf === 'db_phdangnhap' ? <PhDangNhapScreen />
      : staffLeaf === 'db_xemapp' ? <XemAppScreen />
      : staffLeaf === 'db_hoctap' ? <DashboardHocTapScreen />
      : staffLeaf === 'ns' ? <NhanSuScreen />
      : staffLeaf === 'phancong' ? <PhanCongScreen />
      : staffLeaf === 'tkb' ? <TKBScreen />
      : staffLeaf === 'orgchart' ? <OrgChartScreen />
      : staffLeaf === 'lop' ? <LopScreen />
      : staffLeaf === 'hs' ? <HocSinhScreen />
      : staffLeaf === 'tuyensinh' ? <TuyenSinhScreen />
      : staffLeaf === 'test_dau_vao' ? <TestDauVaoScreen />
      : staffLeaf === 'botro' ? <BoTroScreen />
      : staffLeaf === 'botro_duoi' ? <BoTroDuoiScreen />
      : staffLeaf === 'buoihoc' ? <BuoiHocScreen />
      : staffLeaf === 'diemso' ? <GamiDiemScreen />
      : staffLeaf === 'thanhtich' ? <ThanhTichScreen />
      : staffLeaf === 'ketqua' ? <KetQuaScreen />
      : staffLeaf === 'report_ph' ? <ReportPHScreen />
      : staffLeaf === 'duyetcham' ? <DuyetChamScreen />
      : staffLeaf === 'quanlylevel' ? <QuanLyLevelScreen />
      : staffLeaf === 'phanquyen' ? <PhanQuyenScreen />
      : staffLeaf === 'baoloi' ? <BaoLoiScreen />
      : staffLeaf === 'ops_report' ? <OpsReportScreen />
      : staffLeaf === 'prep' ? <PrepScreen />
      : staffLeaf === 'phong_hoc' ? <PhongHocScreen />
      : staffLeaf === 'phancong_ops' ? <PhanCongOpsScreen />
      // "Scan bài đã chấm" (test đầu vào) — Thùy 07-19 lần 2: "không cần tab riêng, chỉ cần derive task
      // cho Ops" → KHÔNG nằm trong bar tab TestDauVaoScreen/sidebar, chỉ vào được qua card derive dưới đây.
      : staffLeaf === 'test_dau_vao_scan' ? <ScanDaChamScreen />
      : (
        <section className="flex min-h-0 items-center justify-center p-8 text-sm text-slate-400">Chọn một mục bên trái.</section>
      )}
      </div>
      </div>
    </div>
  )
}
