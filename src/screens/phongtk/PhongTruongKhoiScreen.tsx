// PHÒNG LÀM VIỆC TRƯỞNG KHỐI (spec-phong-truong-khoi.md · Thùy 01/11).
// ERP là SẢNH chung (mọi việc, tới việc nhỏ nhất); phòng này cắt đúng theo việc của ghế trưởng khối.
// Luật: phòng là LỐI ĐI TẮT, không phải bản sao — mỗi ô mở đúng màn/hàm đang có ở sảnh, không có số/logic riêng,
// nên đi đường nào cũng ra cùng kết quả. Dữ liệu tự lọc theo phạm vi (fn_pham_vi_cua_toi) ở từng màn.
// Thùy 03/11: phòng là MÔI TRƯỜNG LÀM VIỆC như Sảnh (cùng vai trò, khác địa điểm) — cùng khung nền theo style (đổi được như Sảnh),
// nút ⇄ đổi qua lại Sảnh. Màn chính = CẢNH PHÒNG (CanhPhong): mỗi bàn một TA cấp dưới, số trên đầu = hiệu suất tháng, bấm ⇒ chi tiết;
// Phần việc là ĐỒ VẬT trong cảnh: máy tính = Phiên Claude · 3 tranh giữa tường = Bản đồ · Quản trị · Chất lượng; mở ra có nút ← Về phòng chính.
// Phòng là KHU RIÊNG ngang Trang chính trên menu/đường dẫn (lib/menu.ts LEAF_PHONG), không thuộc nhóm Quản lý chất lượng.
import { useEffect, useState, type CSSProperties } from 'react'
import PhienClaudeTab from './PhienClaudeTab'
import BanDoMoiScreen from '../kho/BanDoMoi'
import BaoCaoCaNhan from '../troly/BaoCaoCaNhan'
import WidgetDangYeu from '../qlcl/WidgetDangYeu'
import CanhPhong, { SO_GHE, mauHS, type DoVat } from './CanhPhong'
import ChiTietCapDuoiPopup from './ChiTietCapDuoi'
import { ChonGiaoDien } from '../HomeScreen'
import { listCapDuoi, type CapDuoi } from '../../lib/phongTk'
import { useSkinErp } from '../../lib/erpSkin'
import { HoatCanhNen } from '../hocsinh/skin/HoatCanhNen'
import { HEAD } from '../home/khung'

type Mo = DoVat | null
const TEN: Record<DoVat, string> = { phien: '🤖 Phiên Claude', ban_do: '🗺 Bản đồ', quan_tri: '📋 Quản trị', chat_luong: '📈 Chất lượng' }
// Sống tới F5: rời phòng quay lại = đúng chỗ cũ, danh sách cấp dưới không trắng (CLAUDE.md §2 React).
const NHO: { mo: Mo; ds: CapDuoi[] | null } = { mo: null, ds: null }

export default function PhongTruongKhoiScreen({ onTaoCaNhe }: { onTaoCaNhe: () => void }) {
  const [mo, setMoS] = useState<Mo>(NHO.mo)
  const setMo = (m: Mo) => { NHO.mo = m; setMoS(m) }
  const [daMoPhien, setDaMoPhien] = useState(NHO.mo === 'phien')   // khung chat chỉ gắn từ lần đầu mở, rồi giữ luôn (không mất chữ đang chạy)
  const [ds, setDs] = useState<CapDuoi[] | null>(NHO.ds)
  const [loi, setLoi] = useState<string | null>(null)
  const [nguoi, setNguoi] = useState<CapDuoi | null>(null)
  useEffect(() => { if (mo === 'phien') setDaMoPhien(true) }, [mo])
  useEffect(() => {
    // Thùy 03/11: hiệu suất hiện REALTIME — số tháng đang chạy, tính lại mỗi lần gọi (không đóng băng, không lấy tháng trước).
    // Refetch NỀN mỗi 60 giây khi đang ở cảnh phòng: giữ ds cũ tới khi có ds mới, không bao giờ trắng.
    const tai = () => listCapDuoi().then((d) => { NHO.ds = d; setDs(d); setLoi(null) }).catch((e) => setLoi(e?.message ?? String(e)))
    tai()
    if (mo) return
    const id = setInterval(() => { if (document.visibilityState === 'visible') tai() }, 60_000)
    return () => clearInterval(id)
  }, [mo])

  const sk = useSkinErp()
  const khung: CSSProperties = { ...sk.bien, background: 'var(--sk-page)', fontFamily: 'var(--sk-font)' }
  const tam: CSSProperties = { background: 'var(--sk-surface)', borderRadius: 'var(--sk-radius)', backdropFilter: 'var(--sk-blur)' }
  const thua = (ds ?? []).slice(SO_GHE)
  return (
    <section style={khung} className="relative h-full min-h-0 overflow-hidden text-[var(--sk-ink)]">
      {sk.hoatCanh && <HoatCanhNen hc={sk.hoatCanh} nenId={sk.nenId} doc={sk.doc} coTruoc={false} />}
      <div className="relative z-[1] flex h-full flex-col">
        {/* 1 hàng: biển tên phòng · (đang mở việc: tên việc) · đổi giao diện · NÚT VỀ PHÒNG CHÍNH ở góc phải.
            Thùy 03/11: trưởng khối làm việc chủ yếu ở phòng ⇒ nút góc phải là về PHÒNG CHÍNH, không phải về Sảnh
            (về Sảnh đã có nút 🏠 trên thanh trên cùng). */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 px-4 pt-3 md:px-8">
          <button onClick={() => setMo(null)} title="Về phòng chính" className="flex items-center gap-2 px-3.5 py-1.5" style={tam}>
            <span className="text-[20px]">🧑‍💼</span>
            <span className="text-[17px] font-bold leading-tight" style={HEAD}>Phòng làm việc trưởng khối</span>
          </button>
          {mo && <span className="px-3 py-1.5 text-[13.5px] font-semibold" style={{ ...tam, borderRadius: 'var(--sk-radius-pill)' }}>› {TEN[mo]}</span>}
          {!mo && ds && ds.length > 0 && (
            <span className="px-3 py-1.5 text-[12.5px]" style={{ ...tam, borderRadius: 'var(--sk-radius-pill)' }}>
              {ds.length} trợ giảng · số trên đầu = hiệu suất tháng · bấm vào người để xem chi tiết
            </span>
          )}
          <div className="ml-auto flex items-start gap-2">
            <ChonGiaoDien hep={false} />
            {mo && (
              // no-nut-ve: hook chung useNutQuayVe tự ẨN mọi nút "←" đầu màn (thay bằng ← trên thanh địa chỉ) — nút này phải luôn hiện (Thùy 03/11)
              <button onClick={() => setMo(null)} className="no-nut-ve px-4 py-2 text-[13px] font-bold text-white shadow-sm transition hover:brightness-110"
                style={{ background: 'var(--sk-acc)', borderRadius: 'var(--sk-radius-pill)' }}>← Về phòng chính</button>
            )}
          </div>
        </div>

        {/* CẢNH PHÒNG — vừa khít chiều cao còn lại (laptop thấp: không bắt cuộn để thấy hết phòng) */}
        <div className={mo ? 'hidden' : 'flex min-h-0 flex-1 flex-col px-4 pb-3 pt-2 md:px-8'}>
          {loi && <p className="mb-1 self-center rounded-lg bg-white/90 px-3 py-1 text-[12.5px] text-rose-600">Chưa tải được danh sách trợ giảng: {loi}</p>}
          <div className="min-h-0 flex-1">
            <CanhPhong ds={ds ?? []} onMoNguoi={setNguoi} onMoDoVat={setMo} />
          </div>
          {thua.length > 0 && (
            <div className="mt-2 flex shrink-0 flex-wrap items-center justify-center gap-1.5">
              <span className="text-[12px] font-semibold" style={HEAD}>Ngồi phòng bên ({thua.length}):</span>
              {thua.map((n) => (
                <button key={n.nhan_su_id} onClick={() => setNguoi(n)} className="rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-medium text-slate-700 shadow-sm hover:bg-white">
                  {n.ho_ten} <b style={{ color: mauHS(n.hieu_suat) }}>{n.hieu_suat == null ? '—' : `${Math.round(n.hieu_suat)}%`}</b>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3 PHẦN VIỆC — mở từ đồ vật trong cảnh */}
        {mo && mo !== 'phien' && (
          <div className="min-h-0 flex-1 overflow-auto px-4 pb-4 pt-3 md:px-8">
            <div className={`mx-auto w-full ${mo === 'ban_do' ? 'max-w-[1600px]' : 'max-w-[1180px]'}`}>
              {mo === 'ban_do' && <div className="h-[calc(100vh-150px)] min-h-[460px] overflow-hidden rounded-2xl bg-white shadow-sm"><BanDoMoiScreen /></div>}
              {/* Thùy 03/11: Quản trị = báo cáo sư phạm (việc TA) · Chất lượng = dạng yếu + học tập tuần (chất lượng học của HS). Nền trắng riêng cho dễ đọc. */}
              {mo === 'quan_tri' && <div className="rounded-2xl bg-white p-4 shadow-sm"><BaoCaoCaNhan chiMuc={['baocao']} /></div>}
              {mo === 'chat_luong' && (
                <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                  <WidgetDangYeu className="" onTaoCaNhe={onTaoCaNhe} />
                  <BaoCaoCaNhan chiMuc={['tuan']} />
                </div>
              )}
            </div>
          </div>
        )}
        {/* Phiên Claude giữ gắn sau lần mở đầu (ẩn bằng CSS) — sang Bản đồ sửa tay rồi quay lại không mất khung chat đang chạy chữ. */}
        {daMoPhien && (
          <div className={mo === 'phien' ? 'min-h-0 flex-1 overflow-auto px-4 pb-4 pt-3 md:px-8' : 'hidden'}>
            {/* Thùy 03/11: nền TRẮNG riêng — chat đặt thẳng trên tranh nền phòng khó đọc */}
            <div className="mx-auto w-full max-w-[1180px] rounded-2xl bg-white p-4 shadow-sm"><PhienClaudeTab /></div>
          </div>
        )}
      </div>
      {nguoi && <ChiTietCapDuoiPopup ns={nguoi} onDong={() => setNguoi(null)} />}
    </section>
  )
}
