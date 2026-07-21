// Module "Test đầu vào" (BKDEMY_TESTDAUVAO_SPEC_ADDENDUM.md — đảo luồng 07-19) — TÁCH RIÊNG khỏi
// `Tuyển sinh` (Thùy 07-08: Tuyển sinh = quản lý LEVEL học sinh L5-L8; test đầu vào = vận hành
// điểm danh→{chấm ∥ scan-đã-chấm}→trả bài, module riêng). Bar tab cùng style bar L5-L8 cho gọn.
// ⭐ Đảo 07-19: bỏ tab "Đề test" (đề chọn thẳng từ Kho MT ngay ở Điểm danh, không còn CRUD riêng) + bỏ
// tab "Nhận xét test" (gộp vào Trả bài). ⭐ 07-19 lần 2 (Thùy: "Trả bài đáng lẽ tab riêng tương đương
// Chấm test; Scan bài không cần tab riêng, chỉ cần derive task cho Ops"): tách Trả bài thành TAB RIÊNG
// (KHÔNG còn lồng trong Điểm danh) — "Scan bài đã chấm" bỏ hẳn khỏi bar tab, giờ chỉ hiện dạng task
// derive ở "Việc của tôi" (xem NhanSuHome.tsx).
import { useState } from 'react'
import DiemDanhTestScreen from '../vanhanhops/DiemDanhTestScreen'
import ChamTestScreen from './ChamTestScreen'
import TraBaiTestScreen from './TraBaiTestScreen'

type Tab = 'diem_danh' | 'cham' | 'tra_bai'
const TABS: { v: Tab; lbl: string }[] = [
  { v: 'diem_danh', lbl: 'Điểm danh test' }, { v: 'cham', lbl: 'Chấm test' }, { v: 'tra_bai', lbl: 'Trả bài' },
]

export default function TestDauVaoScreen() {
  const [tab, setTab] = useState<Tab>('diem_danh')
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f5f7]">
      <div className="shrink-0 p-6 pb-0">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-4">
            <h2 className="text-[22px] font-semibold text-slate-800">Test đầu vào</h2>
            <p className="text-[13px] text-slate-500">Điểm danh (chọn đề từ Kho MT) → Chấm Đ/C/S ∥ Scan bài đã chấm (Ops, việc riêng ở "Việc của tôi") → Trả bài (nhận xét + lớp đề xuất + phiếu)</p>
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
          : tab === 'cham' ? <ChamTestScreen />
          : <TraBaiTestScreen />}
      </div>
    </div>
  )
}
