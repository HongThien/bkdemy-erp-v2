// Leaf ERP `khaosat` — Khảo sát "Bạn của con ở BK" (spec-khao-sat-hs.md). 3 tab: Làm khảo sát (cùng component với
// PWA iPad — KhaoSatLuoi) · Khớp tên (§5) · Kết quả (4 query + tổng quan). App iPad riêng: khaosat.html / AppKhaoSat.
import { useState } from 'react'
import KhaoSatLuoi from './KhaoSatLuoi'
import KhopTenTab from './KhopTenTab'
import KetQuaTab from './KetQuaTab'

type Tab = 'lam' | 'khop' | 'ketqua'
const TABS: { key: Tab; ten: string }[] = [{ key: 'lam', ten: 'Làm khảo sát' }, { key: 'khop', ten: 'Khớp tên' }, { key: 'ketqua', ten: 'Kết quả' }]

export default function KhaoSatScreen() {
  const [tab, setTab] = useState<Tab>('lam')
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-5 py-3">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">Khảo sát "Bạn của con ở BK"</h2>
          <p className="text-[11px] text-slate-500">Đồ thị quan hệ HS (cùng lớp trường / cùng toà / rủ vào) — chạy 1 lần, TA cầm iPad giờ ra chơi. App iPad riêng: <span className="font-mono">khaosat.bkacademy.edu.vn</span></p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1 rounded-lg bg-slate-100 p-0.5">
          {TABS.map((t) => <button key={t.key} onClick={() => setTab(t.key)} className={`h-8 whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition ${tab === t.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t.ten}</button>)}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'lam' ? <KhaoSatLuoi embedded /> : <div className="p-5">{tab === 'khop' ? <KhopTenTab /> : <KetQuaTab />}</div>}
      </div>
    </div>
  )
}
