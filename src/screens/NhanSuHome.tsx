import { useEffect, useState } from 'react'
import type { User } from '../types'
import { useStore, staffNavFromScope, adminNavFromQuyen } from '../store/useStore'
import { getMyScope, type MyScope } from '../lib/nhansu'
import { getMyTasks, buoiAoCuaNgay, moBuoi, type MyTask, type BuoiAo, type TabKey } from '../lib/gami'
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
import PhanQuyenScreen from './phanquyen/PhanQuyenScreen'

const ROLE_LBL: Record<string, string> = { gv: 'GV', tg: 'Trợ giảng', ops: 'OPS' }
const tabsCuaVai = (vai: 'gv' | 'tg'): TabKey[] => (vai === 'gv' ? ['danhgia', 'ingame'] : ['ingame', 'et'])
const todayVN = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
type OpenBuoi = { id: string; tabs: TabKey[]; initialTab: TabKey; canManage: boolean }

function OpsBuoiCard({ ba, ngay, onOpen }: { ba: BuoiAo; ngay: string; onOpen: (o: OpenBuoi) => void }) {
  const [busy, setBusy] = useState(false)
  const b = ba.buoi
  async function go() {
    setBusy(true)
    try {
      const id = b?.id ?? (await moBuoi(ba.lop.id, ngay, ba.slot)).id
      onOpen({ id, tabs: ['diemdanh'], initialTab: 'diemdanh', canManage: true })
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <button onClick={go} disabled={busy} className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-indigo-300 hover:shadow-sm disabled:opacity-50">
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-semibold text-slate-900">{busy ? '…' : b ? 'Điểm danh' : 'Mở buổi'}</span>
        <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">OPS</span>
      </div>
      <div className="mt-1 text-[12px] text-slate-500">Lớp {ba.lop.ten_lop} · {ba.slot.gio_bat_dau?.slice(0, 5)}{ba.slot.phong ? ` · ${ba.slot.phong}` : ''}{b ? '' : ' · chưa mở'}</div>
    </button>
  )
}

function VietCuaToi({ scope, onOpenBuoi }: { scope: MyScope | null; onOpenBuoi: (o: OpenBuoi) => void }) {
  const [tasks, setTasks] = useState<MyTask[]>([])
  const [buoiAo, setBuoiAo] = useState<BuoiAo[]>([])
  const ngay = todayVN()
  useEffect(() => { getMyTasks().then(setTasks).catch(() => setTasks([])) }, [])
  useEffect(() => { if (scope?.opsToanHe) buoiAoCuaNgay(ngay).then(setBuoiAo).catch(() => setBuoiAo([])) }, [scope?.opsToanHe]) // eslint-disable-line

  if (!scope) return <div className="text-sm text-slate-400">Tài khoản chưa gắn nhân sự — chưa có phạm vi việc.</div>
  const { trucTiep, opsToanHe, giamSatTrucTiep } = scope

  return (
    <div className="mx-auto max-w-[900px]">
      <h2 className="mb-1 text-sm font-semibold">Việc của tôi</h2>
      <p className="mb-4 text-xs text-slate-400">Việc tự suy từ buổi hôm nay + phân công của bạn (không ai giao tay).</p>

      {opsToanHe && (
        <div className="mb-5">
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-400">Buổi hôm nay ({ngay}) — điểm danh</div>
          {buoiAo.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-[13px] text-slate-500">Hôm nay không có buổi nào theo TKB.</div>
          ) : (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {buoiAo.map((ba) => <OpsBuoiCard key={ba.lop.id} ba={ba} ngay={ngay} onOpen={onOpenBuoi} />)}
            </div>
          )}
        </div>
      )}

      {tasks.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-400">Việc chấm / đánh giá</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {tasks.map((t) => (
              <button key={t.buoiId + t.tab} onClick={() => onOpenBuoi({ id: t.buoiId, tabs: tabsCuaVai(t.vai), initialTab: t.tab, canManage: false })}
                className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-indigo-300 hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-900">{t.label}</span>
                  <span className="ml-auto rounded bg-indigo-100 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700">{ROLE_LBL[t.vai]}</span>
                </div>
                <div className="mt-1 text-[12px] text-slate-500">Lớp {t.lop} · {t.ngay}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!opsToanHe && tasks.length === 0 && (
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
      {/* Vận hành (Việc của tôi / tra cứu lớp) cuộn trong section; màn phát triển tự quản chiều cao */}
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
      : staffLeaf === 'phanquyen' ? <PhanQuyenScreen />
      : (
        <section className="flex min-h-0 items-center justify-center p-8 text-sm text-slate-400">Chọn một mục bên trái.</section>
      )}
    </div>
  )
}
