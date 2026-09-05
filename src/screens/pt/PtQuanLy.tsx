// Tab QUẢN LÝ của app Phát triển = đúng 5 tab của màn ERP "Tạo & giao việc phát triển"
// (GiaoViecScreen) — TÁI DÙNG nguyên component, chỉ thay shell: không useStore (quyền truyền
// từ AppPt), pill cuộn ngang cho màn hẹp. Cùng data-layer giaoviec.ts ⇒ ERP và app không lệch.
import { useState } from 'react'
import IdeaTab from '../giaoviec/IdeaTab'
import BacklogTab from '../giaoviec/BacklogTab'
import WeeklyPlanningTab from '../giaoviec/WeeklyPlanningTab'
import CongKhaiTab from '../giaoviec/CongKhaiTab'
import LoaiViecTab from '../giaoviec/LoaiViecTab'

type Tab = 'idea' | 'backlog' | 'weekly' | 'congkhai' | 'loaiviec'
const TABS: { k: Tab; ten: string }[] = [
  { k: 'weekly', ten: 'Weekly' },
  { k: 'congkhai', ten: 'Công khai' },
  { k: 'idea', ten: 'Idea' },
  { k: 'backlog', ten: 'Backlog' },
  { k: 'loaiviec', ten: 'Loại việc' },
]

export default function PtQuanLy({ laAdmin, laQuanLy }: { laAdmin: boolean; laQuanLy: boolean }) {
  const [tab, setTab] = useState<Tab>('weekly')
  return (
    <div>
      <div className="sticky top-0 z-10 flex gap-1.5 overflow-x-auto border-b border-slate-200/70 bg-white px-3 py-2" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${tab === t.k ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 active:bg-slate-200'}`}>{t.ten}</button>
        ))}
      </div>
      <div className="px-3 pb-6 pt-3">
        {tab === 'idea' ? <IdeaTab laAdmin={laAdmin} laQuanLy={laQuanLy} /> :
         tab === 'backlog' ? <BacklogTab laAdmin={laAdmin} /> :
         tab === 'weekly' ? <WeeklyPlanningTab /> :
         tab === 'congkhai' ? <CongKhaiTab /> :
         <LoaiViecTab />}
      </div>
    </div>
  )
}
