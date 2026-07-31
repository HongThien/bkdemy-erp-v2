// Màn "Tạo & giao việc phát triển" (leaf `giaoviec`) — CÔNG CỤ QUẢN LÝ.
// Luồng (CEO chốt 07-31): Idea list → Backlog (chọn+xác nhận) → Weekly Planning
// (bảng task 2 tầng mẹ/con). "Việc của tôi" (cá nhân) nằm ở rail Việc-của-tôi NGOÀI,
// KHÔNG phải tab ở đây.
import { useEffect, useState } from 'react'
import { getMyScope, type MyScope } from '../../lib/nhansu'
import { useStore } from '../../store/useStore'
import IdeaTab from './IdeaTab'
import BacklogTab from './BacklogTab'
import WeeklyPlanningTab from './WeeklyPlanningTab'
import CongKhaiTab from './CongKhaiTab'
import LoaiViecTab from './LoaiViecTab'

type Tab = 'idea' | 'backlog' | 'weekly' | 'congkhai' | 'loaiviec'
const TABS: { k: Tab; ten: string }[] = [
  { k: 'idea', ten: 'Idea list' },
  { k: 'backlog', ten: 'Backlog' },
  { k: 'weekly', ten: 'Weekly Planning' },
  { k: 'congkhai', ten: 'Công khai' },
  { k: 'loaiviec', ten: 'Loại việc' },
]

export default function GiaoViecScreen() {
  const [tab, setTab] = useState<Tab>('idea')
  const [scope, setScope] = useState<MyScope | null>(null)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  useEffect(() => { getMyScope().then(setScope).catch(() => {}) }, [])
  const laQuanLy = laAdmin || !!scope?.laQuanLy

  const tabBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-xs font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Tạo &amp; giao việc phát triển</span>
        {TABS.map((t) => <button key={t.k} onClick={() => setTab(t.k)} className={tabBtn(tab === t.k)}>{t.ten}</button>)}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {!scope ? <p className="text-sm text-slate-400">Đang tải…</p> : (
          tab === 'idea' ? <IdeaTab laAdmin={laAdmin} laQuanLy={laQuanLy} /> :
          tab === 'backlog' ? <BacklogTab laAdmin={laAdmin} /> :
          tab === 'weekly' ? <WeeklyPlanningTab /> :
          tab === 'congkhai' ? <CongKhaiTab /> :
          <LoaiViecTab />
        )}
      </div>
    </div>
  )
}
