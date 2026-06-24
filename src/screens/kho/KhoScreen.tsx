import { Fragment, useEffect, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import BanDo from './BanDo'
import { daiBranch, hinhBranch, khtnBranch } from './branches'

type Tab = 'dai' | 'hinh'
type Mon = 'toan' | 'khtn'

// Nhớ màn hình gần nhất (preference cá nhân → localStorage, không phải data dùng chung)
const readKhoi = () => {
  const k = localStorage.getItem('kho.khoi')
  return k && (KHOI_OPTIONS as readonly string[]).includes(k) ? k : DEFAULT_KHOI
}
const readTab = () => (localStorage.getItem('kho.tab') === 'hinh' ? 'hinh' : 'dai') as Tab
const readMon = () => (localStorage.getItem('kho.mon') === 'khtn' ? 'khtn' : 'toan') as Mon

export default function KhoScreen() {
  const [mon, setMon] = useState<Mon>(readMon)
  const [tab, setTab] = useState<Tab>(readTab)
  const [khoi, setKhoi] = useState<string>(readKhoi)
  useEffect(() => { localStorage.setItem('kho.khoi', khoi) }, [khoi])
  useEffect(() => { localStorage.setItem('kho.tab', tab) }, [tab])
  useEffect(() => { localStorage.setItem('kho.mon', mon) }, [mon])
  // môn KHTN = 1 cây (không nhánh Đại/Hình); Toán = nhánh tab → branch.
  const config = mon === 'khtn' ? khtnBranch : tab === 'dai' ? daiBranch : hinhBranch

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      {/* Thanh đầu */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-900">Bản đồ kiến thức</span>
        </div>
        {/* Bộ chọn MÔN — segmented (sau scope theo nhân sự: 1-môn → khoá) */}
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <TabBtn active={mon === 'toan'} onClick={() => setMon('toan')}>Toán</TabBtn>
          <TabBtn active={mon === 'khtn'} onClick={() => setMon('khtn')}>KHTN</TabBtn>
        </div>
        {/* Tab nhánh (chỉ Toán) — segmented */}
        {mon === 'toan' && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            <TabBtn active={tab === 'dai'} onClick={() => setTab('dai')}>Đại số</TabBtn>
            <TabBtn active={tab === 'hinh'} onClick={() => setTab('hinh')}>Hình học</TabBtn>
          </div>
        )}
        {/* Khối */}
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Khối</span>
          {KHOI_OPTIONS.map((k) => {
            const tc = k.endsWith('T') // Tăng cường (CLC)
            const active = khoi === k
            return (
              <Fragment key={k}>
                {k === '6' && <span className="mx-1 h-5 w-px self-center bg-slate-200" />}
                <button onClick={() => setKhoi(k)}
                  title={tc ? `Khối ${k[0]} Tăng cường (CLC)` : `Khối ${k}`}
                  className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${
                    active
                      ? tc ? 'bg-violet-600 text-white shadow-sm' : 'bg-indigo-600 text-white shadow-sm'
                      : tc ? 'text-violet-600 hover:bg-violet-50' : 'text-slate-500 hover:bg-slate-100'
                  }`}>{k}</button>
              </Fragment>
            )
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <BanDo key={`${config.key}-${khoi}`} config={config} khoi={khoi} />
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
