// PHÒNG LÀM VIỆC TRƯỞNG KHỐI (spec-phong-truong-khoi.md · Thùy 01/11).
// ERP là SẢNH chung (mọi việc, tới việc nhỏ nhất); phòng này cắt đúng theo việc của ghế trưởng khối.
// Luật: phòng là LỐI ĐI TẮT, không phải bản sao — mỗi ô mở đúng màn/hàm đang có ở sảnh, không có số/logic riêng,
// nên đi đường nào cũng ra cùng kết quả. Dữ liệu tự lọc theo phạm vi (fn_pham_vi_cua_toi) ở từng màn.
// Bản thử: 🤖 Phiên Claude (mới) · 🗺 Bản đồ (màn Bản đồ mới sẵn có — sửa tay) · 📋 Quản trị (báo cáo + dạng yếu sẵn có).
import { useEffect, useState } from 'react'
import PhienClaudeTab from './PhienClaudeTab'
import BanDoMoiScreen from '../kho/BanDoMoi'
import BaoCaoCaNhan from '../troly/BaoCaoCaNhan'
import WidgetDangYeu from '../qlcl/WidgetDangYeu'

type Tab = 'phien' | 'ban_do' | 'quan_tri'
const NHO: { tab: Tab } = { tab: 'phien' }   // rời phòng rồi quay lại = đúng tab cũ

const TABS: { id: Tab; ten: string; goi_y: string }[] = [
  { id: 'phien', ten: '🤖 Phiên Claude', goi_y: 'Ra lệnh cho Claude dựng / sửa bản đồ' },
  { id: 'ban_do', ten: '🗺 Bản đồ', goi_y: 'Xem và sửa tay bản đồ (rồi bảo Claude "làm tiếp")' },
  { id: 'quan_tri', ten: '📋 Quản trị', goi_y: 'Báo cáo sư phạm · dạng yếu của khối' },
]

export default function PhongTruongKhoiScreen({ onTaoCaNhe }: { onTaoCaNhe: () => void }) {
  const [tab, setTab] = useState<Tab>(NHO.tab)
  useEffect(() => { NHO.tab = tab }, [tab])
  // Thùy 03/11: phòng CO VÀO GIỮA (lề ≥ 1 inch mỗi bên) — card đang thừa chỗ, trải sát 2 mép khó đọc.
  // Riêng tab Bản đồ giữ full ngang: các nhóm xếp ngang, càng rộng càng ít phải cuộn.
  const giua = 'mx-auto w-full max-w-[1180px] px-4 md:px-10'
  return (
    <div className="px-1">
      <div className={`mb-3 flex flex-wrap items-end gap-2 ${giua}`}>
        <div className="mr-2">
          <div className="text-[18px] font-bold text-slate-800">Phòng làm việc trưởng khối</div>
          <div className="text-[12px] text-slate-500">{TABS.find((t) => t.id === tab)?.goi_y}</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${tab === t.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'}`}>
              {t.ten}
            </button>
          ))}
        </div>
      </div>
      {/* Giữ tab Phiên Claude luôn gắn (ẩn bằng CSS) — chuyển sang Bản đồ sửa tay rồi quay lại không mất khung chat đang chạy chữ. */}
      <div className={tab === 'phien' ? giua : 'hidden'}><PhienClaudeTab /></div>
      {tab === 'ban_do' && <BanDoMoiScreen />}
      {tab === 'quan_tri' && (
        <div className={`space-y-3 ${giua}`}>
          <WidgetDangYeu kieu="so" onTaoCaNhe={onTaoCaNhe} />
          <BaoCaoCaNhan />
        </div>
      )}
    </div>
  )
}
