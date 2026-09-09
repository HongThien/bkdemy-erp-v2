// Màn "Tạo & giao việc phát triển" (leaf `giaoviec`) — CÔNG CỤ QUẢN LÝ.
// Luồng (CEO chốt 07-31): Idea list → Backlog (chọn+xác nhận) → Weekly Planning
// (bảng task 2 tầng mẹ/con). "Việc của tôi" (cá nhân) nằm ở rail Việc-của-tôi NGOÀI,
// KHÔNG phải tab ở đây.
import { useEffect, useState } from 'react'
import { getMyScope, type MyScope } from '../../lib/nhansu'
import { listChoNghiemThuCuaToi } from '../../lib/giaoviec'
import { useStore } from '../../store/useStore'
import IdeaTab from './IdeaTab'
import BacklogTab from './BacklogTab'
import WeeklyPlanningTab from './WeeklyPlanningTab'
import DuyetTab from './DuyetTab'
import CongKhaiTab from './CongKhaiTab'
import LoaiViecTab from './LoaiViecTab'

type Tab = 'idea' | 'backlog' | 'weekly' | 'duyet' | 'congkhai' | 'loaiviec'
const TABS: { k: Tab; ten: string }[] = [
  { k: 'idea', ten: 'Idea list' },
  { k: 'backlog', ten: 'Backlog' },
  { k: 'weekly', ten: 'Weekly Planning' },
  { k: 'duyet', ten: 'Duyệt' },
  { k: 'congkhai', ten: 'Công khai' },
  { k: 'loaiviec', ten: 'Loại việc' },
]

export default function GiaoViecScreen() {
  const [tab, setTab] = useState<Tab>('idea')
  const [scope, setScope] = useState<MyScope | null>(null)
  const [choDuyet, setChoDuyet] = useState(0)
  const laAdmin = !!useStore((s) => s.quyen)?.laAdmin
  useEffect(() => { getMyScope().then(setScope).catch(() => {}) }, [])
  // Nạp trước số chờ duyệt (badge phải thấy NGAY, không đợi bấm vào tab mới lộ ra).
  useEffect(() => { listChoNghiemThuCuaToi().then((r) => setChoDuyet(r.length)).catch(() => {}) }, [tab])
  const laQuanLy = laAdmin || !!scope?.laQuanLy

  const tabBtn = (on: boolean) => `h-7 rounded-md px-2.5 text-xs font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Tạo &amp; giao việc phát triển</span>
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={tabBtn(tab === t.k)}>
            {t.ten}{t.k === 'duyet' && choDuyet > 0 && <span className="ml-1.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{choDuyet}</span>}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {!scope ? <p className="text-sm text-slate-400">Đang tải…</p> : (
          tab === 'idea' ? <IdeaTab laAdmin={laAdmin} laQuanLy={laQuanLy} /> :
          tab === 'backlog' ? <BacklogTab laAdmin={laAdmin} /> :
          tab === 'weekly' ? <WeeklyPlanningTab /> :
          tab === 'duyet' ? <DuyetTab onCountChange={setChoDuyet} /> :
          tab === 'congkhai' ? <CongKhaiTab /> :
          <LoaiViecTab />
        )}
      </div>
    </div>
  )
}
