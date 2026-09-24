// Lá "Bổ trợ" (Thùy 24/09): 1 lá duy nhất ở menu Vận hành → màn quản lý bổ trợ với THANH TOGGLE 5 nút phía trên
// (Đuổi · Bù · Yếu · Lịch phòng · Lịch trực) — "muốn chuyển chỉ cần 1 click". Không phải folder 5 lá con.
// Từng màn con giữ nguyên (BoTroDuoiScreen · BoTroScreen · XepLichBoTroYeuScreen · LichPhongScreen · LichTrucScreen); hub chỉ đổi màn.
// Tab đang mở nhớ ở module-level (CLAUDE.md §2 "rời màn rồi quay lại = đúng chỗ cũ"); nơi khác nhảy tới đúng tab bằng `moBoTroTab`.
import { useState } from 'react'
import BoTroDuoiScreen from './BoTroDuoiScreen'
import BoTroScreen from './BoTroScreen'
import XepLichBoTroYeuScreen from '../danhgia/XepLichBoTroYeuScreen'
import LichPhongScreen from './LichPhongScreen'
import LichTrucScreen from './LichTrucScreen'

export type BoTroTab = 'duoi' | 'bu' | 'yeu' | 'lichphong' | 'lichtruc'
const TABS: { k: BoTroTab; ten: string; mo_ta: string }[] = [
  { k: 'duoi', ten: 'Đuổi', mo_ta: 'HS vào lớp giữa chừng — đợt đuổi, kế hoạch dạng' },
  { k: 'bu', ten: 'Bù', mo_ta: 'HS nghỉ buổi thường — lần nghỉ cần bù' },
  { k: 'yeu', ten: 'Yếu', mo_ta: 'Case bổ trợ yếu: cần xếp · đã xếp · chờ retest · hoàn thành · retest' },
  { k: 'lichphong', ten: 'Lịch phòng', mo_ta: 'Đang diễn ra của cả 3 loại + xếp chung theo đơn vị ca trực' },
  { k: 'lichtruc', ten: 'Lịch trực', mo_ta: 'Ca trực cố định hằng tuần của trợ giảng' },
]
const NHO: { tab: BoTroTab } = { tab: 'lichphong' }
let capNhat: ((t: BoTroTab) => void) | null = null
// Nhảy tới đúng tab từ nơi khác (Việc của tôi, Trợ lý…): gọi TRƯỚC hoặc SAU setStaffLeaf('botro') đều được.
export function moBoTroTab(t: BoTroTab) { NHO.tab = t; capNhat?.(t) }

export default function BoTroHubScreen() {
  const [tab, setTabState] = useState<BoTroTab>(NHO.tab)
  capNhat = setTabState
  const setTab = (t: BoTroTab) => { NHO.tab = t; setTabState(t) }
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-white px-8 py-2.5">
        <span className="mr-2 text-[15px] font-bold text-slate-800">Bổ trợ</span>
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} title={t.mo_ta}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${tab === t.k ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {t.ten}
          </button>
        ))}
        <span className="ml-auto hidden text-[11.5px] text-slate-400 md:inline">{TABS.find((t) => t.k === tab)?.mo_ta}</span>
      </div>
      {tab === 'duoi' ? <BoTroDuoiScreen /> : tab === 'bu' ? <BoTroScreen /> : tab === 'yeu' ? <XepLichBoTroYeuScreen /> : tab === 'lichtruc' ? <LichTrucScreen /> : <LichPhongScreen />}
    </div>
  )
}
