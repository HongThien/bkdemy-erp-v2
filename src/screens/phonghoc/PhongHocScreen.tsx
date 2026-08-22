// Hub "Quản lý phòng học" — 2 tab, theo đúng mẫu TestDauVaoScreen.tsx (1 leaf, nhiều tab bên trong).
import { useState } from 'react'
import LichPhongScreen from './LichPhongScreen'
import TongQuanTuanScreen from './TongQuanTuanScreen'
import PhongScreen from './PhongScreen'

type Tab = 'lich' | 'tong_quan' | 'danh_muc'
const TABS: { v: Tab; lbl: string }[] = [{ v: 'lich', lbl: 'Lịch phòng' }, { v: 'tong_quan', lbl: 'Tổng quan phòng' }, { v: 'danh_muc', lbl: 'Danh mục phòng' }]

export default function PhongHocScreen() {
  const [tab, setTab] = useState<Tab>('lich')
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f5f7]">
      <div className="shrink-0 px-6 pt-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-4 flex w-fit flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {TABS.map((t) => (
              <button key={t.v} onClick={() => setTab(t.v)}
                className={`rounded-xl px-3.5 py-1.5 text-[14px] font-medium transition ${tab === t.v ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                {t.lbl}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === 'lich' ? <LichPhongScreen /> : tab === 'tong_quan' ? <TongQuanTuanScreen /> : <PhongScreen />}
      </div>
    </div>
  )
}
