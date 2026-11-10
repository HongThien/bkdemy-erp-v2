// PHÒNG LÀM VIỆC TRƯỞNG KHỐI (spec-phong-truong-khoi.md · Thùy 01/11).
// ERP là SẢNH chung (mọi việc, tới việc nhỏ nhất); phòng này cắt đúng theo việc của ghế trưởng khối.
// Luật: phòng là LỐI ĐI TẮT, không phải bản sao — mỗi ô mở đúng màn/hàm đang có ở sảnh, không có số/logic riêng,
// nên đi đường nào cũng ra cùng kết quả. Dữ liệu tự lọc theo phạm vi (fn_pham_vi_cua_toi) ở từng màn.
// Thùy 03/11: phòng là MÔI TRƯỜNG LÀM VIỆC như Sảnh (cùng vai trò, khác địa điểm) — cùng khung nền theo style (đổi được như Sảnh).
// Màn chính = CẢNH PHÒNG (CanhPhong): mỗi bàn một người, số trên đầu = hiệu suất tháng, bấm ⇒ chi tiết.
// Phần việc là ĐỒ VẬT trong cảnh: máy tính = Phiên Claude · 3 tranh giữa tường = Bản đồ · Quản trị · Chất lượng; mở ra có nút ← Về phòng chính.
// Phòng trưởng bộ môn có thêm BẢNG TIN "Hỏi vận hành TA" (Thùy 05/11): hỏi bằng lời lương/công/dữ liệu đã điền của TA trong môn (HoiVanHanhTa).
// Khay hồ sơ "Duyệt công" (Thùy 09/11): trưởng khối duyệt công TA thuộc khối mình (màn DuyetCongScreen ở sảnh, DB lọc theo phạm vi).
// Phòng là KHU RIÊNG ngang Trang chính trên menu/đường dẫn (lib/menu.ts LEAF_PHONG), không thuộc nhóm Quản lý chất lượng.
// HAI CHẾ ĐỘ cùng một khuôn (fn_phong_che_do, theo ghế):
//   'tk'  = phòng trưởng khối — nhân vật = TA của khối mình.
//   'tbm' = phòng TRƯỞNG BỘ MÔN (Thùy 03/11: 'Phó GĐ chuyên môn' gọi đúng là trưởng bộ môn — vd anh Ngọc = KHTN; toàn hệ QLCL thấy mọi môn)
//           — nhân vật = các TRƯỞNG KHỐI + GHẾ TRỐNG cho ô chưa có trưởng khối, số = gộp TA trong khối (DB tính);
//           bấm 1 ghế ⇒ vào phòng của trưởng khối đó / của ô đó (TA của họ). Quản trị / Chất lượng nhìn mọi khối, chọn 1 khối ⇒ y như trưởng khối.
// PHÒNG GIÁM ĐỐC (Thùy 03/11, fn_phong_la_gd — ghế gốc team core) nằm TRÊN phòng trưởng bộ môn: nhân vật = trưởng vận hành (Lộc — chưa có
//   cơ cấu phòng vận hành, ngồi tạm, chưa có số) + trưởng bộ môn từng môn (số gộp các ghế trưởng khối). Bấm trưởng bộ môn ⇒ phòng trưởng
//   bộ môn của môn đó ⇒ bấm trưởng khối ⇒ phòng trưởng khối. Đồ vật (Quản trị / Chất lượng / Báo cáo tuần) dùng khuôn trưởng bộ môn, mọi môn.
import { useEffect, useState, type CSSProperties } from 'react'
import PhienClaudeTab from './PhienClaudeTab'
import BanDoMoiScreen from '../kho/BanDoMoi'
import BaoCaoCaNhan from '../troly/BaoCaoCaNhan'
import CanhPhong, { SO_GHE, mauHS, type DoVat, type NguoiCanh } from './CanhPhong'
import ChiTietCapDuoiPopup from './ChiTietCapDuoi'
import { QuanTriTbm, ChatLuongTbm } from './PhanViecPgd'
import { ChatLuongTK } from './ChatLuongPhong'
import BaoCaoTuanTK from './BaoCaoTuanTK'
import BaoCaoTuanTBM from './BaoCaoTuanTBM'
import HoiVanHanhTa from './HoiVanHanhTa'
import DuyetCongScreen from '../tacong/DuyetCongScreen'
import { ChonGiaoDien } from '../HomeScreen'
import { cheDoPhong, laGiamDoc, listCapDuoi, listCapDuoiCuaGhe, listGheGd, listGheTbm, monTbm, soLuc, type CapDuoi, type GheGd, type GheTbm } from '../../lib/phongTk'
import { useSkinErp } from '../../lib/erpSkin'
import { HoatCanhNen } from '../hocsinh/skin/HoatCanhNen'
import { HEAD } from '../home/khung'

type Mo = DoVat | null
type CheDo = 'tk' | 'tbm'
const TEN: Record<DoVat, string> = { phien: '🤖 Phiên Claude', ban_do: '🗺 Bản đồ', quan_tri: '📋 Quản trị', chat_luong: '📈 Chất lượng', bao_cao: '📝 Báo cáo tuần', hoi_ta: '💬 Hỏi vận hành TA', duyet_cong: '🗂 Duyệt công' }
const nhanKhoi = (o: string[]) => `Khối ${o.join(' · ')}`
// Sống tới F5: rời phòng quay lại = đúng chỗ cũ, danh sách không trắng (CLAUDE.md §2 React).
const NHO: { mo: Mo; cheDo: CheDo | null; laGd: boolean; mon: string[] | null; xemMon: GheGd | null; xemTk: GheTbm | null; ta: CapDuoi[] | null; tk: GheTbm[] | null; gd: GheGd[] | null } =
  { mo: null, cheDo: null, laGd: false, mon: null, xemMon: null, xemTk: null, ta: null, tk: null, gd: null }

export default function PhongTruongKhoiScreen({ onTaoCaNhe }: { onTaoCaNhe: () => void }) {
  const [mo, setMoS] = useState<Mo>(NHO.mo)
  const setMo = (m: Mo) => { NHO.mo = m; setMoS(m) }
  const [cheDo, setCheDo] = useState<CheDo | null>(NHO.cheDo)
  const [xemTk, setXemTkS] = useState<GheTbm | null>(NHO.xemTk)
  const setXemTk = (t: GheTbm | null) => { NHO.xemTk = t; setXemTkS(t); if (t) { NHO.ta = null; setDsTa(null) } }
  const [laGd, setLaGd] = useState(NHO.laGd)
  const [xemMon, setXemMonS] = useState<GheGd | null>(NHO.xemMon)   // Giám đốc đang xem phòng trưởng bộ môn của môn này
  const setXemMon = (m: GheGd | null) => { NHO.xemMon = m; setXemMonS(m); NHO.tk = null; setDsTk(null) }
  const [dsGd, setDsGd] = useState<GheGd[] | null>(NHO.gd)
  const [vanHanh, setVanHanh] = useState<GheGd | null>(null)   // bấm trưởng vận hành: chưa có cơ cấu phòng ⇒ chỉ báo
  const [daMoPhien, setDaMoPhien] = useState(NHO.mo === 'phien')   // khung chat chỉ gắn từ lần đầu mở, rồi giữ luôn (không mất chữ đang chạy)
  const [dsTa, setDsTa] = useState<CapDuoi[] | null>(NHO.ta)
  const [dsTk, setDsTk] = useState<GheTbm[] | null>(NHO.tk)
  const [mon, setMon] = useState<string[] | null>(NHO.mon)   // môn của phòng trưởng bộ môn (null = mọi môn)
  const [loi, setLoi] = useState<string | null>(null)
  const [soTinhLuc, setSoTinhLuc] = useState<string | null>(null)   // số lưu sẵn tính lúc nào (ghế cũ nhất)
  const [nguoi, setNguoi] = useState<CapDuoi | null>(null)
  useEffect(() => { if (mo === 'phien') setDaMoPhien(true) }, [mo])
  useEffect(() => {
    laGiamDoc().then((g) => { NHO.laGd = g; setLaGd(g) }).catch(() => {})
    cheDoPhong().then((c) => {
      NHO.cheDo = c; setCheDo(c)
      if (c === 'tbm') monTbm().then((m) => { NHO.mon = m; setMon(m) }).catch(() => {})
    }).catch(() => { NHO.cheDo = 'tk'; setCheDo('tk') })
  }, [])
  const xemPhongTk = cheDo === 'tk' || !!xemTk   // cảnh đang là phòng có TA ngồi
  const xemPhongGd = laGd && !xemMon && !xemTk     // cảnh đang là phòng Giám đốc
  useEffect(() => {
    if (!cheDo) return
    // Thùy 10/11: số phòng KHÔNG realtime — DB lưu sẵn, máy tính lại ngầm mỗi 5 phút (mig 202611101537); màn chỉ đọc.
    // Chỉ gọi danh sách của cảnh ĐANG HIỆN (đổi cảnh mới gọi; mở 1 việc không gọi lại). Đọc lại NỀN mỗi 5 phút, không bao giờ trắng.
    const xong = () => setLoi(null), hong = (e: any) => setLoi(e?.message ?? String(e))
    const tai = () => {
      soLuc().then(setSoTinhLuc).catch(() => {})
      return laGd && !xemMon && !xemTk
        ? listGheGd().then((d) => { NHO.gd = d; setDsGd(d); xong() }).catch(hong)
        : cheDo === 'tbm' && !xemTk
        ? listGheTbm(xemMon?.mon).then((d) => { NHO.tk = d; setDsTk(d); xong() }).catch(hong)
        : (xemTk ? listCapDuoiCuaGhe(xemTk) : listCapDuoi()).then((d) => { NHO.ta = d; setDsTa(d); xong() }).catch(hong)
    }
    tai()
    const id = setInterval(() => { if (document.visibilityState === 'visible' && !NHO.mo) tai() }, 300_000)
    return () => clearInterval(id)
  }, [cheDo, xemTk, laGd, xemMon])

  const sk = useSkinErp()
  const khung: CSSProperties = { ...sk.bien, background: 'var(--sk-page)', fontFamily: 'var(--sk-font)' }
  const tam: CSSProperties = { background: 'var(--sk-surface)', borderRadius: 'var(--sk-radius)', backdropFilter: 'var(--sk-blur)' }
  const vien: CSSProperties = { ...tam, borderRadius: 'var(--sk-radius-pill)' }
  // Người ngồi trong cảnh: TA (phòng trưởng khối) hoặc ghế trưởng khối / ô trống (phòng trưởng bộ môn)
  const ngoi: NguoiCanh[] = xemPhongTk
    ? (dsTa ?? [])
    : xemPhongGd
    // trưởng vận hành trước, rồi trưởng bộ môn theo môn, ghế trống sau — chỉ sắp để vẽ
    ? [...(dsGd ?? [])].sort((a, b) => Number(a.vai !== 'van_hanh') - Number(b.vai !== 'van_hanh') || Number(!a.nhan_su_id) - Number(!b.nhan_su_id) || (a.mon ?? '').localeCompare(b.mon ?? '', 'vi'))
        .map((g) => ({ ...g, nhan_su_id: g.khoa, ho_ten: g.ho_ten ?? `Chưa có trưởng bộ môn ${g.mon}`, trong: !g.nhan_su_id,
                       nhan: g.vai === 'van_hanh' ? 'Trưởng vận hành' : `Bộ môn ${g.mon} · ${g.so_ghe} khối · ${g.so_ta} TA` }))
    // thứ tự hiển thị: trưởng khối ngồi trong phòng trước, ghế trống (ô chưa có trưởng khối) sau — chỉ sắp để vẽ, giữ thứ tự DB trong mỗi nhóm
    : [...(dsTk ?? [])].sort((a, b) => Number(!a.nhan_su_id) - Number(!b.nhan_su_id)).map((t) => ({ ...t, nhan_su_id: t.khoa, ho_ten: t.ho_ten ?? 'Chưa có trưởng khối', trong: !t.nhan_su_id, nhan: `${nhanKhoi(t.o)} · ${t.so_ta} TA` }))
  const thua = ngoi.slice(SO_GHE)
  const bamNguoi = (n: NguoiCanh) => {
    if (xemPhongTk) setNguoi(n as CapDuoi)
    else if (xemPhongGd) {
      const g = (dsGd ?? []).find((x) => x.khoa === n.nhan_su_id)
      if (g?.vai === 'van_hanh') setVanHanh(g); else if (g) setXemMon(g)
    }
    else setXemTk((dsTk ?? []).find((t) => t.khoa === n.nhan_su_id) ?? null)
  }
  // Nút góc phải: đang mở việc ⇒ về cảnh phòng; đang ở phòng của 1 trưởng khối (TBM) ⇒ về phòng chính của trưởng bộ môn.
  const coVe = !!mo || !!xemTk || !!xemMon
  const ve = () => { if (mo) setMo(null); else if (xemTk) setXemTk(null); else setXemMon(null) }
  const veGoc = () => { setMo(null); setXemTk(null); if (xemMon) setXemMon(null) }
  const tenPhong = laGd ? 'Phòng làm việc Giám đốc'
    : cheDo === 'tbm' ? `Phòng làm việc Trưởng bộ môn${mon?.length ? ' ' + mon.join(' · ') : ''}` : 'Phòng làm việc trưởng khối'
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
          {xemMon && <span className="px-3 py-1.5 text-[13.5px] font-semibold" style={vien}>› Trưởng bộ môn {xemMon.mon}{xemMon.ho_ten ? ` · ${xemMon.ho_ten}` : ' · chưa có người'}</span>}
          {xemTk && <span className="px-3 py-1.5 text-[13.5px] font-semibold" style={vien}>› {xemTk.ho_ten ? `Phòng của ${xemTk.ho_ten}` : 'Chưa có trưởng khối'} · {nhanKhoi(xemTk.o)}</span>}
          {mo && <span className="px-3 py-1.5 text-[13.5px] font-semibold" style={vien}>› {TEN[mo]}</span>}
          {!mo && ngoi.length > 0 && (
            <span className="px-3 py-1.5 text-[12.5px]" style={vien}>
              {xemPhongTk
                ? `${ngoi.length} trợ giảng · số trên đầu = hiệu suất tháng · bấm vào người để xem chi tiết`
                : xemPhongGd
                ? 'Trưởng vận hành + trưởng bộ môn · số trên đầu = hiệu suất trung bình của TA trong bộ môn · bấm để vào phòng của họ'
                : `${ngoi.length} ghế trưởng khối · số trên đầu = hiệu suất trung bình của TA trong khối · bấm để vào phòng của họ`}
              {soTinhLuc && ` · số tính lúc ${new Date(soTinhLuc).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })}`}
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
            <CanhPhong ds={ngoi} onMoNguoi={bamNguoi} onMoDoVat={setMo} coHoiTa={cheDo === 'tbm'} />
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
            <div className={`mx-auto w-full ${mo === 'duyet_cong' ? 'max-w-none' : mo === 'ban_do' ? 'max-w-[1600px]' : 'max-w-[1180px]'}`}>
              {mo === 'ban_do' && <div className="h-[calc(100vh-150px)] min-h-[460px] overflow-hidden rounded-2xl bg-white shadow-sm"><BanDoMoiScreen /></div>}
              {/* Quản trị = báo cáo sư phạm (việc TA) · Chất lượng = dạng yếu + học tập tuần (chất lượng học của HS). */}
              {mo === 'quan_tri' && (
                <div className="rounded-2xl bg-white p-4 shadow-sm">{cheDo === 'tbm' ? <QuanTriTbm /> : <BaoCaoCaNhan chiMuc={['baocao']} />}</div>
              )}
              {/* Báo cáo tuần (spec-bao-cao-tuan, P2): trưởng khối soạn/nộp báo cáo của mình; trưởng bộ môn báo cáo thay ô chưa có trưởng khối. Phòng trưởng bộ môn: duyệt / trả lại · ghép Báo cáo Chuyên môn tuần (P3). */}
              {/* Hỏi vận hành trợ giảng (Thùy 05/11): chỉ phòng trưởng bộ môn — DB khoá phạm vi môn của NGƯỜI HỎI (không theo môn đang xem). */}
              {mo === 'hoi_ta' && cheDo === 'tbm' && <div className="rounded-2xl bg-white p-4 shadow-sm"><HoiVanHanhTa mon={mon} /></div>}
              {/* Duyệt công trợ giảng (Thùy 09/11): cùng màn ở sảnh; DB chỉ trả công thuộc khối của người mở (fn_ta_cong_duoc_duyet). */}
              {mo === 'duyet_cong' && <div className="h-[calc(100vh-150px)] min-h-[460px] overflow-hidden rounded-2xl bg-white shadow-sm"><DuyetCongScreen /></div>}
              {mo === 'bao_cao' && <div className="rounded-2xl bg-white p-4 shadow-sm">{cheDo === 'tbm' ? <BaoCaoTuanTBM /> : <BaoCaoTuanTK />}</div>}
              {mo === 'chat_luong' && (
                <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                  {/* Thùy 10/11: trưởng khối — Dashboard học tập · Tình hình chung · Hồ sơ học tập · Danh sách bổ trợ (thay màn Duyệt bổ trợ cũ) */}
                  {cheDo === 'tbm' ? <ChatLuongTbm onTaoCaNhe={onTaoCaNhe} /> : <ChatLuongTK onTaoCaNhe={onTaoCaNhe} />}
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
      {vanHanh && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/45 p-4" onClick={() => setVanHanh(null)}>
          <div className="w-[min(440px,94vw)] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-[17px] font-bold text-slate-800">{vanHanh.ho_ten}</div>
            <div className="mb-3 text-[12.5px] text-slate-500">Trưởng vận hành</div>
            <p className="text-[13.5px] text-slate-600">Phòng vận hành chưa có cơ cấu nên chưa có số và chưa vào phòng được. Khi dựng xong, bấm vào đây sẽ ra phòng vận hành.</p>
            <div className="mt-4 text-right"><button onClick={() => setVanHanh(null)} className="rounded-lg bg-slate-100 px-4 py-1.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-200">Đóng</button></div>
          </div>
        </div>
      )}
      {nguoi && <ChiTietCapDuoiPopup ns={nguoi} ghe={xemTk} onDong={() => setNguoi(null)} />}
    </section>
  )
}
