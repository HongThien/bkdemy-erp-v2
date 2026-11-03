// PHÒNG LÀM VIỆC TRƯỞNG KHỐI (spec-phong-truong-khoi.md · Thùy 01/11).
// ERP là SẢNH chung (mọi việc, tới việc nhỏ nhất); phòng này cắt đúng theo việc của ghế trưởng khối.
// Luật: phòng là LỐI ĐI TẮT, không phải bản sao — mỗi ô mở đúng màn/hàm đang có ở sảnh, không có số/logic riêng,
// nên đi đường nào cũng ra cùng kết quả. Dữ liệu tự lọc theo phạm vi (fn_pham_vi_cua_toi) ở từng màn.
// Thùy 03/11: phòng là MÔI TRƯỜNG LÀM VIỆC như Sảnh (cùng vai trò, khác địa điểm) — cùng khung nền theo style (đổi được như Sảnh).
// Màn chính = CẢNH PHÒNG (CanhPhong): mỗi bàn một người, số trên đầu = hiệu suất tháng, bấm ⇒ chi tiết.
// Phần việc là ĐỒ VẬT trong cảnh: máy tính = Phiên Claude · 3 tranh giữa tường = Bản đồ · Quản trị · Chất lượng; mở ra có nút ← Về phòng chính.
// Phòng là KHU RIÊNG ngang Trang chính trên menu/đường dẫn (lib/menu.ts LEAF_PHONG), không thuộc nhóm Quản lý chất lượng.
// HAI CHẾ ĐỘ cùng một khuôn (fn_phong_che_do, theo ghế):
//   'tk'  = phòng trưởng khối — nhân vật = TA của khối mình.
//   'tbm' = phòng TRƯỞNG BỘ MÔN (Thùy 03/11: 'Phó GĐ chuyên môn' gọi đúng là trưởng bộ môn — vd anh Ngọc = KHTN; toàn hệ QLCL thấy mọi môn)
//           — nhân vật = các TRƯỞNG KHỐI + GHẾ TRỐNG cho ô chưa có trưởng khối, số = gộp TA trong khối (DB tính);
//           bấm 1 ghế ⇒ vào phòng của trưởng khối đó / của ô đó (TA của họ). Quản trị / Chất lượng nhìn mọi khối, chọn 1 khối ⇒ y như trưởng khối.
import { useEffect, useState, type CSSProperties } from 'react'
import PhienClaudeTab from './PhienClaudeTab'
import BanDoMoiScreen from '../kho/BanDoMoi'
import BaoCaoCaNhan from '../troly/BaoCaoCaNhan'
import WidgetDangYeu from '../qlcl/WidgetDangYeu'
import CanhPhong, { SO_GHE, mauHS, type DoVat, type NguoiCanh } from './CanhPhong'
import ChiTietCapDuoiPopup from './ChiTietCapDuoi'
import { QuanTriTbm, ChatLuongTbm } from './PhanViecPgd'
import { ChonGiaoDien } from '../HomeScreen'
import { cheDoPhong, listCapDuoi, listCapDuoiCuaGhe, listGheTbm, monTbm, type CapDuoi, type GheTbm } from '../../lib/phongTk'
import { useSkinErp } from '../../lib/erpSkin'
import { HoatCanhNen } from '../hocsinh/skin/HoatCanhNen'
import { HEAD } from '../home/khung'

type Mo = DoVat | null
type CheDo = 'tk' | 'tbm'
const TEN: Record<DoVat, string> = { phien: '🤖 Phiên Claude', ban_do: '🗺 Bản đồ', quan_tri: '📋 Quản trị', chat_luong: '📈 Chất lượng' }
const nhanKhoi = (o: string[]) => `Khối ${o.join(' · ')}`
// Sống tới F5: rời phòng quay lại = đúng chỗ cũ, danh sách không trắng (CLAUDE.md §2 React).
const NHO: { mo: Mo; cheDo: CheDo | null; mon: string[] | null; xemTk: GheTbm | null; ta: CapDuoi[] | null; tk: GheTbm[] | null } =
  { mo: null, cheDo: null, mon: null, xemTk: null, ta: null, tk: null }

export default function PhongTruongKhoiScreen({ onTaoCaNhe }: { onTaoCaNhe: () => void }) {
  const [mo, setMoS] = useState<Mo>(NHO.mo)
  const setMo = (m: Mo) => { NHO.mo = m; setMoS(m) }
  const [cheDo, setCheDo] = useState<CheDo | null>(NHO.cheDo)
  const [xemTk, setXemTkS] = useState<GheTbm | null>(NHO.xemTk)
  const setXemTk = (t: GheTbm | null) => { NHO.xemTk = t; setXemTkS(t); if (t) { NHO.ta = null; setDsTa(null) } }
  const [daMoPhien, setDaMoPhien] = useState(NHO.mo === 'phien')   // khung chat chỉ gắn từ lần đầu mở, rồi giữ luôn (không mất chữ đang chạy)
  const [dsTa, setDsTa] = useState<CapDuoi[] | null>(NHO.ta)
  const [dsTk, setDsTk] = useState<GheTbm[] | null>(NHO.tk)
  const [mon, setMon] = useState<string[] | null>(NHO.mon)   // môn của phòng trưởng bộ môn (null = mọi môn)
  const [loi, setLoi] = useState<string | null>(null)
  const [nguoi, setNguoi] = useState<CapDuoi | null>(null)
  useEffect(() => { if (mo === 'phien') setDaMoPhien(true) }, [mo])
  useEffect(() => {
    cheDoPhong().then((c) => {
      NHO.cheDo = c; setCheDo(c)
      if (c === 'tbm') monTbm().then((m) => { NHO.mon = m; setMon(m) }).catch(() => {})
    }).catch(() => { NHO.cheDo = 'tk'; setCheDo('tk') })
  }, [])
  const xemPhongTk = cheDo === 'tk' || !!xemTk   // cảnh đang là phòng có TA ngồi
  useEffect(() => {
    if (!cheDo) return
    // Thùy 03/11: hiệu suất hiện REALTIME — số tháng đang chạy, tính lại mỗi lần gọi (không đóng băng, không lấy tháng trước).
    // Refetch NỀN mỗi 60 giây khi đang ở cảnh phòng: giữ danh sách cũ tới khi có danh sách mới, không bao giờ trắng.
    const xong = () => setLoi(null), hong = (e: any) => setLoi(e?.message ?? String(e))
    const tai = () => cheDo === 'tbm' && !xemTk
      ? listGheTbm().then((d) => { NHO.tk = d; setDsTk(d); xong() }).catch(hong)
      : (xemTk ? listCapDuoiCuaGhe(xemTk) : listCapDuoi()).then((d) => { NHO.ta = d; setDsTa(d); xong() }).catch(hong)
    tai()
    if (mo) return
    const id = setInterval(() => { if (document.visibilityState === 'visible') tai() }, 60_000)
    return () => clearInterval(id)
  }, [mo, cheDo, xemTk])

  const sk = useSkinErp()
  const khung: CSSProperties = { ...sk.bien, background: 'var(--sk-page)', fontFamily: 'var(--sk-font)' }
  const tam: CSSProperties = { background: 'var(--sk-surface)', borderRadius: 'var(--sk-radius)', backdropFilter: 'var(--sk-blur)' }
  const vien: CSSProperties = { ...tam, borderRadius: 'var(--sk-radius-pill)' }
  // Người ngồi trong cảnh: TA (phòng trưởng khối) hoặc ghế trưởng khối / ô trống (phòng trưởng bộ môn)
  const ngoi: NguoiCanh[] = xemPhongTk
    ? (dsTa ?? [])
    // thứ tự hiển thị: trưởng khối ngồi trong phòng trước, ghế trống (ô chưa có trưởng khối) sau — chỉ sắp để vẽ, giữ thứ tự DB trong mỗi nhóm
    : [...(dsTk ?? [])].sort((a, b) => Number(!a.nhan_su_id) - Number(!b.nhan_su_id)).map((t) => ({ ...t, nhan_su_id: t.khoa, ho_ten: t.ho_ten ?? 'Chưa có trưởng khối', trong: !t.nhan_su_id, nhan: `${nhanKhoi(t.o)} · ${t.so_ta} TA` }))
  const thua = ngoi.slice(SO_GHE)
  const bamNguoi = (n: NguoiCanh) => {
    if (xemPhongTk) setNguoi(n as CapDuoi)
    else setXemTk((dsTk ?? []).find((t) => t.khoa === n.nhan_su_id) ?? null)
  }
  // Nút góc phải: đang mở việc ⇒ về cảnh phòng; đang ở phòng của 1 trưởng khối (TBM) ⇒ về phòng chính của trưởng bộ môn.
  const coVe = !!mo || !!xemTk
  const ve = () => { if (mo) setMo(null); else setXemTk(null) }
  const veGoc = () => { setMo(null); setXemTk(null) }
  const tenPhong = cheDo === 'tbm' ? `Phòng làm việc Trưởng bộ môn${mon?.length ? ' ' + mon.join(' · ') : ''}` : 'Phòng làm việc trưởng khối'
  return (
    <section style={khung} className="relative h-full min-h-0 overflow-hidden text-[var(--sk-ink)]">
      {sk.hoatCanh && <HoatCanhNen hc={sk.hoatCanh} nenId={sk.nenId} doc={sk.doc} coTruoc={false} />}
      <div className="relative z-[1] flex h-full flex-col">
        {/* 1 hàng: biển tên phòng › (phòng trưởng khối đang xem) › (việc đang mở) · đổi giao diện · NÚT VỀ PHÒNG CHÍNH ở góc phải.
            Thùy 03/11: làm việc chủ yếu ở phòng ⇒ nút góc phải là về PHÒNG CHÍNH, không phải về Sảnh (về Sảnh: nút 🏠 trên thanh trên cùng). */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 px-4 pt-3 md:px-8">
          <button onClick={veGoc} title="Về phòng chính" className="flex items-center gap-2 px-3.5 py-1.5" style={tam}>
            <span className="text-[20px]">{cheDo === 'tbm' ? '👩‍💼' : '🧑‍💼'}</span>
            <span className="text-[17px] font-bold leading-tight" style={HEAD}>{cheDo ? tenPhong : 'Phòng làm việc'}</span>
          </button>
          {xemTk && <span className="px-3 py-1.5 text-[13.5px] font-semibold" style={vien}>› {xemTk.ho_ten ? `Phòng của ${xemTk.ho_ten}` : 'Chưa có trưởng khối'} · {nhanKhoi(xemTk.o)}</span>}
          {mo && <span className="px-3 py-1.5 text-[13.5px] font-semibold" style={vien}>› {TEN[mo]}</span>}
          {!mo && ngoi.length > 0 && (
            <span className="px-3 py-1.5 text-[12.5px]" style={vien}>
              {xemPhongTk
                ? `${ngoi.length} trợ giảng · số trên đầu = hiệu suất tháng · bấm vào người để xem chi tiết`
                : `${ngoi.length} ghế trưởng khối · số trên đầu = hiệu suất trung bình của TA trong khối · bấm để vào phòng của họ`}
            </span>
          )}
          <div className="ml-auto flex items-start gap-2">
            <ChonGiaoDien hep={false} />
            {coVe && (
              // no-nut-ve: hook chung useNutQuayVe tự ẨN mọi nút "←" đầu màn (thay bằng ← trên thanh địa chỉ) — nút này phải luôn hiện (Thùy 03/11)
              <button onClick={ve} className="no-nut-ve px-4 py-2 text-[13px] font-bold text-white shadow-sm transition hover:brightness-110"
                style={{ background: 'var(--sk-acc)', borderRadius: 'var(--sk-radius-pill)' }}>← {mo && xemTk ? 'Về phòng' : 'Về phòng chính'}</button>
            )}
          </div>
        </div>

        {/* CẢNH PHÒNG — vừa khít chiều cao còn lại (laptop thấp: không bắt cuộn để thấy hết phòng) */}
        <div className={mo ? 'hidden' : 'flex min-h-0 flex-1 flex-col px-4 pb-3 pt-2 md:px-8'}>
          {loi && <p className="mb-1 self-center rounded-lg bg-white/90 px-3 py-1 text-[12.5px] text-rose-600">Chưa tải được danh sách: {loi}</p>}
          <div className="min-h-0 flex-1">
            <CanhPhong ds={ngoi} onMoNguoi={bamNguoi} onMoDoVat={setMo} />
          </div>
          {thua.length > 0 && (
            <div className="mt-2 flex shrink-0 flex-wrap items-center justify-center gap-1.5">
              <span className="text-[12px] font-semibold" style={HEAD}>Ngồi phòng bên ({thua.length}):</span>
              {thua.map((n) => (
                <button key={n.nhan_su_id} onClick={() => bamNguoi(n)} className="rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-medium text-slate-700 shadow-sm hover:bg-white">
                  {n.trong ? <span className="text-rose-600">{n.nhan} · chưa có trưởng khối</span> : n.ho_ten} <b style={{ color: mauHS(n.hieu_suat) }}>{n.hieu_suat == null ? '—' : `${Math.round(n.hieu_suat)}%`}</b>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PHẦN VIỆC — mở từ đồ vật trong cảnh. Nền trắng riêng cho dễ đọc. */}
        {mo && mo !== 'phien' && (
          <div className="min-h-0 flex-1 overflow-auto px-4 pb-4 pt-3 md:px-8">
            <div className={`mx-auto w-full ${mo === 'ban_do' ? 'max-w-[1600px]' : 'max-w-[1180px]'}`}>
              {mo === 'ban_do' && <div className="h-[calc(100vh-150px)] min-h-[460px] overflow-hidden rounded-2xl bg-white shadow-sm"><BanDoMoiScreen /></div>}
              {/* Quản trị = báo cáo sư phạm (việc TA) · Chất lượng = dạng yếu + học tập tuần (chất lượng học của HS). */}
              {mo === 'quan_tri' && (
                <div className="rounded-2xl bg-white p-4 shadow-sm">{cheDo === 'tbm' ? <QuanTriTbm /> : <BaoCaoCaNhan chiMuc={['baocao']} />}</div>
              )}
              {mo === 'chat_luong' && (
                <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                  {cheDo === 'tbm' ? <ChatLuongTbm onTaoCaNhe={onTaoCaNhe} /> : <>
                    <WidgetDangYeu className="" onTaoCaNhe={onTaoCaNhe} />
                    <BaoCaoCaNhan chiMuc={['tuan']} />
                  </>}
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
