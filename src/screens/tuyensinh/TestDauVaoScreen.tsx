// Module "Test đầu vào" (BKDEMY_TESTDAUVAO_SPEC_DETAIL.md) — TÁCH RIÊNG khỏi `Tuyển sinh`
// (Thùy 07-08: Tuyển sinh = quản lý LEVEL học sinh L5-L8; test đầu vào = 4 story vận hành
// điểm danh→chấm→nhận xét→trả bài, module riêng). Bar tab cùng style bar L5-L8 cho gọn.
import { useState } from 'react'
import DiemDanhTestScreen from '../vanhanhops/DiemDanhTestScreen'
import DeTestScreen from './DeTestScreen'
import ChamTestScreen from './ChamTestScreen'
import NhanXetTestScreen from './NhanXetTestScreen'

type Tab = 'diem_danh' | 'de' | 'cham' | 'nhan_xet'
const TABS: { v: Tab; lbl: string }[] = [
  { v: 'diem_danh', lbl: 'Điểm danh test' }, { v: 'de', lbl: 'Đề test' },
  { v: 'cham', lbl: 'Chấm test' }, { v: 'nhan_xet', lbl: 'Nhận xét test' },
]

export default function TestDauVaoScreen() {
  const [tab, setTab] = useState<Tab>('diem_danh')
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f5f7]">
      <div className="shrink-0 p-6 pb-0">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-4">
            <h2 className="text-[22px] font-semibold text-slate-800">Test đầu vào</h2>
            <p className="text-[13px] text-slate-500">Điểm danh + scan → Chấm Đ/C/S → Nhận xét + lớp đề xuất → Trả bài (gộp trong Điểm danh test)</p>
          </div>

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
        {tab === 'diem_danh' ? <DiemDanhTestScreen />
          : tab === 'de' ? <DeTestScreen />
          : tab === 'cham' ? <ChamTestScreen />
          : <NhanXetTestScreen />}
      </div>
    </div>
  )
}
