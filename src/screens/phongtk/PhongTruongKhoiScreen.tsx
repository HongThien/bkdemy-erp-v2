// PHÒNG LÀM VIỆC TRƯỞNG KHỐI (spec-phong-truong-khoi.md · Thùy 01/11).
// ERP là SẢNH chung (mọi việc, tới việc nhỏ nhất); phòng này cắt đúng theo việc của ghế trưởng khối.
// Luật: phòng là LỐI ĐI TẮT, không phải bản sao — mỗi ô mở đúng màn/hàm đang có ở sảnh, không có số/logic riêng,
// nên đi đường nào cũng ra cùng kết quả. Dữ liệu tự lọc theo phạm vi (fn_pham_vi_cua_toi) ở từng màn.
// Thùy 03/11: phòng là MÔI TRƯỜNG LÀM VIỆC như Sảnh (cùng vai trò, khác địa điểm) — KHÔNG phải một tính năng:
// cùng khung nền theo style (useSkinErp, biến --sk-*), có nút ⇄ đổi qua lại Sảnh. Màn laptop thấp ⇒ dàn NGANG, không phình dọc.
import { useEffect, useState, type CSSProperties } from 'react'
import PhienClaudeTab from './PhienClaudeTab'
import BanDoMoiScreen from '../kho/BanDoMoi'
import BaoCaoCaNhan from '../troly/BaoCaoCaNhan'
import WidgetDangYeu from '../qlcl/WidgetDangYeu'
import NutDoiMoiTruong from './NutDoiMoiTruong'
import { useSkinErp } from '../../lib/erpSkin'
import { HoatCanhNen } from '../hocsinh/skin/HoatCanhNen'
import { HEAD } from '../home/khung'

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
  const sk = useSkinErp()
  const khung: CSSProperties = { ...sk.bien, background: 'var(--sk-page)', fontFamily: 'var(--sk-font)' }
  const tam: CSSProperties = { background: 'var(--sk-surface)', borderRadius: 'var(--sk-radius)', backdropFilter: 'var(--sk-blur)' }
  // Co vào giữa (lề ≥ 1 inch mỗi bên); riêng Bản đồ giữ rộng — các nhóm xếp ngang, càng rộng càng ít cuộn.
  const be = tab === 'ban_do' ? 'max-w-[1600px]' : 'max-w-[1180px]'
  return (
    // Giống Sảnh: tranh nền + hoạt cảnh ở section NGOÀI (đứng yên), nội dung cuộn trong khối bên trong.
    <section style={khung} className="relative h-full min-h-0 overflow-hidden text-[var(--sk-ink)]">
      {sk.hoatCanh && <HoatCanhNen hc={sk.hoatCanh} nenId={sk.nenId} doc={sk.doc} coTruoc={false} />}
      <div className="relative z-[1] h-full overflow-auto">
        <div className={`mx-auto w-full ${be} px-4 py-4 md:px-10`}>
          {/* 1 hàng: biển tên phòng · tab · nút đổi về Sảnh */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="mr-1 flex items-center gap-2 px-3.5 py-1.5" style={tam}>
              <span className="text-[20px]">🧑‍💼</span>
              <span className="text-[17px] font-bold leading-tight" style={HEAD}>Phòng làm việc trưởng khối</span>
            </div>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} title={t.goi_y}
                className={`px-3.5 py-1.5 text-[13px] font-semibold transition ${tab === t.id ? 'text-white' : 'text-[var(--sk-ink)] hover:brightness-110'}`}
                style={{ borderRadius: 'var(--sk-radius-pill)', ...(tab === t.id ? { background: 'var(--sk-acc)' } : { background: 'var(--sk-surface)', backdropFilter: 'var(--sk-blur)' }) }}>
                {t.ten}
              </button>
            ))}
            <div className="ml-auto"><NutDoiMoiTruong den="sanh" /></div>
          </div>
          {/* Giữ tab Phiên Claude luôn gắn (ẩn bằng CSS) — chuyển sang Bản đồ sửa tay rồi quay lại không mất khung chat đang chạy chữ. */}
          <div className={tab === 'phien' ? '' : 'hidden'}><PhienClaudeTab /></div>
          {/* Bản đồ tự cuộn bên trong (h-full) ⇒ khung phải có chiều cao cố định theo màn */}
          {tab === 'ban_do' && <div className="h-[calc(100vh-150px)] min-h-[460px] overflow-hidden rounded-2xl bg-white shadow-sm"><BanDoMoiScreen /></div>}
          {tab === 'quan_tri' && (
            <div className="space-y-3">
              <WidgetDangYeu onTaoCaNhe={onTaoCaNhe} />
              <div className="rounded-2xl bg-white/90 p-3 shadow-sm"><BaoCaoCaNhan /></div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
