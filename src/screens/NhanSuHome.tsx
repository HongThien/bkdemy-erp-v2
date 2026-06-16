import { useEffect, useState } from 'react'
import type { User } from '../types'
import { useStore, staffNavFromScope, adminNavFromQuyen } from '../store/useStore'
import { getMyScope, type MyScope } from '../lib/nhansu'
import { getMyTasks, buoiAoCuaNgay, moBuoi, diemDanhTienDo, type MyTask, type BuoiAo, type TabKey } from '../lib/gami'
import { BuoiDetail } from './gami/BuoiHocScreen'
import PersonalCard from '../components/PersonalCard'
import NavTree from '../components/NavTree'
import KhoScreen from './kho/KhoScreen'
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
import PhanQuyenScreen from './phanquyen/PhanQuyenScreen'

const ROLE_LBL: Record<string, string> = { gv: 'GV', tg: 'Trợ giảng', ops: 'OPS' }
const tabsCuaVai = (vai: 'gv' | 'tg'): TabKey[] => (vai === 'gv' ? ['danhgia', 'ingame'] : ['ingame', 'et'])
const todayVN = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
type OpenBuoi = { id: string; tabs: TabKey[]; initialTab: TabKey; canManage: boolean }

type TienDo = { tong: number; daDanh: number }
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
  const label = busy ? '…' : !b ? 'Mở buổi' : done ? '✓ Đã điểm danh' : 'Điểm danh'
  const tone = done ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300' : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
  return (
    <button onClick={go} disabled={busy} className={`rounded-xl border p-3 text-left transition disabled:opacity-50 ${tone}`}>
      <div className="flex items-center gap-2">
        <span className={`text-[14px] font-semibold ${done ? 'text-emerald-700' : 'text-slate-900'}`}>{label}</span>
        {td && b && <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{td.daDanh}/{td.tong}</span>}
        <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">OPS</span>
      </div>
      <div className="mt-1 text-[12px] text-slate-500">Lớp {ba.lop.ten_lop} · {ba.slot.gio_bat_dau?.slice(0, 5)}{ba.slot.phong ? ` · ${ba.slot.phong}` : ''}{b ? '' : ' · chưa mở'}</div>
    </button>
  )
}

function TaskCard({ t, done, onOpenBuoi }: { t: MyTask; done?: boolean; onOpenBuoi: (o: OpenBuoi) => void }) {
  return (
    <button onClick={() => onOpenBuoi({ id: t.buoiId, tabs: tabsCuaVai(t.vai), initialTab: t.tab, canManage: false })}
      className={`rounded-xl border p-3 text-left transition ${done ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300' : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'}`}>
      <div className="flex items-center gap-2">
        <span className={`text-[14px] font-semibold ${done ? 'text-emerald-700' : 'text-slate-900'}`}>{done ? '✓ ' : ''}{t.label}</span>
        <span className="ml-auto rounded bg-indigo-100 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700">{ROLE_LBL[t.vai]}</span>
      </div>
      <div className="mt-1 text-[12px] text-slate-500">Lớp {t.lop} · {t.ngay}{done ? ' · đã xong (mở để xem/sửa)' : ''}</div>
    </button>
  )
}

function VietCuaToi({ scope, onOpenBuoi }: { scope: MyScope | null; onOpenBuoi: (o: OpenBuoi) => void }) {
  const [tasks, setTasks] = useState<MyTask[]>([])
  const [buoiAo, setBuoiAo] = useState<BuoiAo[]>([])
  const [tienDo, setTienDo] = useState<Record<string, TienDo>>({})
  const ngay = todayVN()
  useEffect(() => { getMyTasks().then(setTasks).catch(() => setTasks([])) }, [])
  useEffect(() => {
    if (!scope?.opsToanHe) return
    buoiAoCuaNgay(ngay).then(async (list) => {
      setBuoiAo(list)
      const ids = list.filter((ba) => ba.buoi && ba.buoi.trang_thai !== 'huy').map((ba) => ba.buoi!.id)
      try { setTienDo(await diemDanhTienDo(ids)) } catch { setTienDo({}) }
    }).catch(() => setBuoiAo([]))
  }, [scope?.opsToanHe]) // eslint-disable-line

  if (!scope) return <div className="text-sm text-slate-400">Tài khoản chưa gắn nhân sự — chưa có phạm vi việc.</div>
  const { trucTiep, opsToanHe, giamSatTrucTiep } = scope

  // điểm danh XONG = buổi đã mở & mọi HS đã đánh dấu (daDanh ≥ tong). Chưa mở / còn HS trống = CẦN làm.
  const opsXong = (ba: BuoiAo) => { const b = ba.buoi; if (!b || b.trang_thai === 'huy') return false; const t = tienDo[b.id]; return !!t && t.daDanh >= t.tong }
  const opsActive = buoiAo.filter((ba) => (!ba.buoi || ba.buoi.trang_thai !== 'huy') && !opsXong(ba))
  const opsDone = buoiAo.filter(opsXong)
  const taskActive = tasks.filter((t) => !t.done)
  const taskDone = tasks.filter((t) => t.done)

  return (
    <div className="mx-auto max-w-[900px]">
      <h2 className="mb-1 text-sm font-semibold">Việc của tôi</h2>
      <p className="mb-4 text-xs text-slate-400">Việc tự suy từ buổi hôm nay + phân công của bạn (không ai giao tay).</p>

      {opsToanHe && (
        <div className="mb-5">
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-400">Buổi hôm nay ({ngay}) — cần điểm danh{opsActive.length ? ` (${opsActive.length})` : ''}</div>
          {buoiAo.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-[13px] text-slate-500">Hôm nay không có buổi nào theo TKB.</div>
          ) : opsActive.length === 0 ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[13px] font-medium text-emerald-700">✓ Đã điểm danh xong toàn bộ buổi hôm nay.</div>
          ) : (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {opsActive.map((ba) => <OpsBuoiCard key={ba.lop.id} ba={ba} ngay={ngay} td={ba.buoi ? tienDo[ba.buoi.id] : undefined} onOpen={onOpenBuoi} />)}
            </div>
          )}
          {opsDone.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã điểm danh xong ({opsDone.length}) — bấm xem / sửa</summary>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                {opsDone.map((ba) => <OpsBuoiCard key={ba.lop.id} ba={ba} ngay={ngay} td={ba.buoi ? tienDo[ba.buoi.id] : undefined} done onOpen={onOpenBuoi} />)}
              </div>
            </details>
          )}
        </div>
      )}

      {(taskActive.length > 0 || taskDone.length > 0) && (
        <div className="mb-5">
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-400">Việc chấm / đánh giá{taskActive.length ? ` (${taskActive.length})` : ''}</div>
          {taskActive.length === 0 ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[13px] font-medium text-emerald-700">✓ Đã hoàn thành mọi việc chấm / đánh giá.</div>
          ) : (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {taskActive.map((t) => <TaskCard key={t.buoiId + t.tab} t={t} onOpenBuoi={onOpenBuoi} />)}
            </div>
          )}
          {taskDone.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã xong ({taskDone.length}) — bấm xem / sửa</summary>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                {taskDone.map((t) => <TaskCard key={t.buoiId + t.tab} t={t} done onOpenBuoi={onOpenBuoi} />)}
              </div>
            </details>
          )}
        </div>
      )}

      {!opsToanHe && taskActive.length === 0 && taskDone.length === 0 && (
        <div className="mb-4 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-[13px] text-slate-500">
          Chưa có việc vận hành nào — chưa có buổi nào đang mở ở lớp bạn phụ trách.
        </div>
      )}

      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-400">Lớp tôi phụ trách</div>
        {trucTiep.length === 0 ? (
          <p className="text-[13px] text-slate-400">{opsToanHe ? 'OPS — điểm danh toàn hệ (xem mục Buổi hôm nay).' : 'Chưa được phân công lớp nào.'}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trucTiep.map((sl) => (
              <span key={sl.lop_id + sl.work_role} className="rounded-md border border-slate-200 px-2.5 py-1 text-[13px]">
                <b className="text-slate-700">{sl.ten_lop}</b> <span className="text-slate-400">· {sl.mon} · {ROLE_LBL[sl.work_role]}</span>
              </span>
            ))}
          </div>
        )}
        {giamSatTrucTiep.length > 0 && <p className="mt-2 text-[12px] text-slate-500">Giám sát trực tiếp: <b>{giamSatTrucTiep.length}</b> người dưới quyền.</p>}
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

  if (openBuoi) return (
    <BuoiDetail id={openBuoi.id} initialTab={openBuoi.initialTab} tabs={openBuoi.tabs} canManage={openBuoi.canManage} onClose={() => setOpenBuoi(null)} />
  )

  // nav hợp nhất: Việc của tôi + tra cứu (vận hành) ++ leaf màn role cấp (phát triển)
  const groups = [...staffNavFromScope(scope), ...adminNavFromQuyen(quyen)]
  const isClass = staffLeaf.startsWith('tc:') && staffLeaf.split(':').length === 3
  const lop = staffLeaf.split(':')[2]

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
        <section className="min-h-0 overflow-auto p-8"><VietCuaToi scope={scope} onOpenBuoi={setOpenBuoi} /></section>
      ) : isClass ? (
        <section className="min-h-0 overflow-auto p-8">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-1 text-sm font-semibold">Lớp {lop}</h2>
            <p className="text-xs text-slate-400">Bản ghi đã làm của lớp này sẽ hiện khi lớp Vận hành chạy (đang dựng).</p>
          </div>
        </section>
      ) : staffLeaf === 'bdkt' ? <KhoScreen />
      : (staffLeaf === 'lamtailieu' || staffLeaf === 'lamtailieu:giao_trinh') ? <TaiLieuScreen />
      : staffLeaf === 'lamtailieu:et' ? <ETScreen />
      : staffLeaf === 'lamtailieu:kho' ? <KhoTaiLieuScreen />
      : (staffLeaf === 'lamtailieu:de_thi' || staffLeaf === 'lamtailieu:bo_tro') ? <section className="flex min-h-0 items-center justify-center p-8 text-sm text-slate-400">Loại tài liệu này dựng sau.</section>
      : staffLeaf === 'ns' ? <NhanSuScreen />
      : staffLeaf === 'phancong' ? <PhanCongScreen />
      : staffLeaf === 'tkb' ? <TKBScreen />
      : staffLeaf === 'orgchart' ? <OrgChartScreen />
      : staffLeaf === 'lop' ? <LopScreen />
      : staffLeaf === 'hs' ? <HocSinhScreen />
      : staffLeaf === 'buoihoc' ? <BuoiHocScreen />
      : staffLeaf === 'diemso' ? <GamiDiemScreen />
      : staffLeaf === 'phanquyen' ? <PhanQuyenScreen />
      : (
        <section className="flex min-h-0 items-center justify-center p-8 text-sm text-slate-400">Chọn một mục bên trái.</section>
      )}
      </div>
    </div>
  )
}
