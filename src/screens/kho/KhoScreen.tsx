import { useState } from 'react'
import { KHOI_OPTIONS } from '../../lib/kho/api'
import DaiBanDo from './DaiBanDo'

type Tab = 'dai' | 'hinh'

export default function KhoScreen() {
  const [tab, setTab] = useState<Tab>('dai')
  const [khoi, setKhoi] = useState<string>(KHOI_OPTIONS[2]) // mặc định K8

  return (
    <div className="flex h-[calc(100vh-49px)] flex-col bg-[#fafafb]">
      {/* Thanh đầu */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-900">Bản đồ kiến thức</span>
        </div>
        {/* Tab nhánh — segmented */}
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <TabBtn active={tab === 'dai'} onClick={() => setTab('dai')}>Đại số</TabBtn>
          <TabBtn active={tab === 'hinh'} onClick={() => setTab('hinh')}>Hình học</TabBtn>
        </div>
        {/* Khối */}
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">Khối</span>
          {KHOI_OPTIONS.map((k) => (
            <button key={k} onClick={() => setKhoi(k)}
              className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-medium transition ${
                khoi === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
              }`}>{k}</button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {tab === 'dai'
          ? <DaiBanDo key={khoi} khoi={khoi} />
          : <div className="flex h-full items-center justify-center text-sm text-slate-400">Nhánh Hình — dựng tiếp sau khi Đại chạy ổn.</div>}
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-md px-3 py-1 text-sm font-medium transition ${
        active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}>{children}</button>
  )
}
