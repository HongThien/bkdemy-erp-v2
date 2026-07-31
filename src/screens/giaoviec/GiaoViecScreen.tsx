// Màn "Giao việc & Hiệu suất" v2 (leaf `giaoviec`). BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md v2.
// Luồng: Idea → Backlog → Weekly plan → Task (1 người) → nghiệm thu → hiệu suất.
// 6 tab. Quyền: CEO (laAdmin) duyệt triage/tạo hạng mục; quản lý (cây vị trí) refinement + giao.
import { useEffect, useState } from 'react'
import { getMyScope, type MyScope } from '../../lib/nhansu'
import { useStore } from '../../store/useStore'
import ReviewTuanTab from './ReviewTuanTab'
import VietCuaToiTab from './VietCuaToiTab'
import IdeaTab from './IdeaTab'
import BacklogTab from './BacklogTab'
import CongKhaiTab from './CongKhaiTab'
import LoaiViecTab from './LoaiViecTab'

type Tab = 'review' | 'toi' | 'idea' | 'backlog' | 'congkhai' | 'loaiviec'
const TABS: { k: Tab; ten: string }[] = [
  { k: 'review', ten: 'Review tuần' },
  { k: 'toi', ten: 'Việc của tôi' },
  { k: 'idea', ten: 'Ý tưởng' },
  { k: 'backlog', ten: 'Backlog & Hạng mục' },
  { k: 'congkhai', ten: 'Công khai' },
  { k: 'loaiviec', ten: 'Loại việc' },
]

export default function GiaoViecScreen() {
  const [tab, setTab] = useState<Tab>('review')
  const [scope, setScope] = useState<MyScope | null>(null)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  useEffect(() => { getMyScope().then(setScope).catch(() => {}) }, [])
  const laQuanLy = laAdmin || !!scope?.laQuanLy

  const tabBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-xs font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Giao việc & hiệu suất</span>
        {TABS.map((t) => <button key={t.k} onClick={() => setTab(t.k)} className={tabBtn(tab === t.k)}>{t.ten}</button>)}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {!scope ? <p className="text-sm text-slate-400">Đang tải…</p> : (
          tab === 'review' ? <ReviewTuanTab /> :
          tab === 'toi' ? <VietCuaToiTab nhanSuId={scope.nhanSu.id} /> :
          tab === 'idea' ? <IdeaTab laAdmin={laAdmin} laQuanLy={laQuanLy} /> :
          tab === 'backlog' ? <BacklogTab laAdmin={laAdmin} /> :
          tab === 'congkhai' ? <CongKhaiTab /> :
          <LoaiViecTab />
        )}
      </div>
    </div>
  )
}
