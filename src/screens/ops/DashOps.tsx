// DashOps — "Của tôi" app OPS. CEO 07/09 (sau khi thấy bản LIST theo 07_my.png): "làm giống hệt như
// bên app TA" — chuyển sang DÙNG LẠI CHÍNH XÁC cơ chế/khung của DashTa.tsx (tranh nền vẽ sẵn +
// BKProfileSummary + lưới 2×3 BKMenuCard + BKMascotBanner), thay vì khung LIST rời. CEO 07/09 (sau đó)
// gửi thêm `ops_Cuatoi.png` — TRANH RIÊNG cho OPS (cùng khuôn bg_cua_toi.jpg của TA nhưng đổi "TAs"→
// "QLHTs", tagline theo học sinh) → dùng ĐÚNG cơ chế BK_TRANH/BKTranhNen/bkTranhStyle của TA cho màn
// gốc (không phải fallback BKPageHeader gradient trơn nữa). Sub-screen (Xếp hạng/Gậy/…) CHƯA có tranh
// riêng cho OPS nên vẫn dùng BKPageHeader (nền trời gradient — chính TA cũng định nghĩa component này
// cho trường hợp chưa có tranh), đổi khẩu hiệu góc phải (`slogan`) + logo góc trái để không hiện chữ "TA".
// Ảnh minh hoạ 6 ô + mascot dùng CHUNG file với TA (public/bk-ui/*.png) vì đều là hình BK chung, KHÔNG
// có chữ "TA" (đã kiểm từng file).
// Dữ liệu: opsDashboard (đạt chuẩn — dùng lại tên "Tiến trình" cho hợp ngữ cảnh vận hành theo ca) ·
// xepHangChung · tichLuy — mọi số ở Postgres (§2.0). Sub-screen TÁI DÙNG NGUYÊN từ khu Của tôi app TA
// (components/bk/*) — generic theo props, không đụng code TA khi OPS dùng lại.
import { useEffect, useState } from 'react'
import { opsDashboard, type OpsDash } from '../../lib/opsdash'
import { xepHangChung, type XepHangChung } from '../../lib/xephang'
import { tichLuy, type TichLuy } from '../../lib/tichluy'
import { GAY_DON_GIA } from '../../lib/gay'
import { homNayVN } from '../../lib/tuan'
import type { MyProfile } from '../../lib/nhansu'
import { BKPageHeader, BKProfileSummary, BKMenuCard, BKMascotBanner, BKTranhNen, bkTranhStyle, type BKTranh } from '../../components/bk/BKUI'
import { XepHangScreen } from '../../components/bk/XepHangScreen'
import { GayCuaToiScreen } from '../../components/bk/GayCuaToiScreen'
import { MayManScreen } from '../../components/bk/MayManScreen'
import { ShopScreen } from '../../components/bk/ShopScreen'
import { HuongDanScreen } from '../../components/bk/HuongDanScreen'
import { DatChuanScreen } from '../../components/bk/DatChuanScreen'

// Tranh riêng OPS cho màn gốc "Của tôi" (CEO up 07/09, ops_Cuatoi.png 941×1672, KHÔNG có status bar giả
// nên không cắt như bg_cua_toi.jpg) — cảnh (logo·CỦA TÔI·biển báo·mascot) dính đỉnh y0–465, dưới là trời phẳng.
const OPS_TRANH_CUATOI: BKTranh = { url: '/bk-ui/bg_ops_cuatoi.jpg', rong: 941, canh: 465, troi: ['#CCE7FE', '#CCE7FE'] }

// KHÔNG có box "Cài đặt" — TA cũng không có (Đăng xuất/Góp ý nằm ở header tab Hôm nay, xem OpsHome.HomTay),
// giữ ĐÚNG cơ chế TA thay vì bịa thêm màn TA không có (CEO 07/09: "giống hệt như bên app TA").
type Box = 'xephang' | 'gay' | 'maymai' | 'tientrinh' | 'shop' | 'huongdan'
const A = (n: string) => `/bk-ui/${n}.png`   // asset PNG chung với TA (public/bk-ui) — ảnh generic, không chữ "TA"
const TIEU_DE: Record<Box, { title: string; tagline: string; mascot: string; bubble: string }> = {
  xephang: { title: 'Xếp hạng', tagline: 'Cùng nhau toả sáng, làm nên một BK tuyệt hơn! ♡', mascot: A('mascot_cheer'), bubble: 'Nỗ lực hôm nay, toả sáng ngày mai!' },
  gay: { title: 'Gậy', tagline: 'Lỗi bị nhắc & lý do ♡', mascot: A('mascot_hearts'), bubble: 'Cố lên bạn ơi!' },
  maymai: { title: 'May mắn', tagline: 'Quay nhỏ mỗi ngày, thêm niềm vui lớn! ♡', mascot: A('mascot_cheer'), bubble: 'Vận may cùng BK!' },
  tientrinh: { title: 'Tiến trình', tagline: 'Nỗ lực hôm nay, tạo giá trị ngày mai! 💙', mascot: A('mascot_wave'), bubble: 'Cùng cố gắng nha!' },
  shop: { title: 'Shopping', tagline: 'Đổi quà bằng điểm. Làm nhiều, nhận quà xịn! ♡', mascot: A('mascot_hearts'), bubble: 'Tích điểm đổi quà thôi!' },
  huongdan: { title: 'Hướng dẫn', tagline: 'Mọi quy trình trong tầm tay BK! ♡', mascot: A('mascot_read'), bubble: 'Học hiểu hơn, làm tốt hơn!' },
}
// 6 card — ẢNH/GRADIENT GIỐNG HỆT bộ TA (chỉ đổi chữ sub cho đúng ngữ cảnh vận hành theo ca, không phải "theo lớp")
const CARDS: { key: Box; title: string; sub: string; tagline: string; image: string; gradient: [string, string]; accent: string; badge?: string }[] = [
  { key: 'xephang', title: 'Xếp hạng', sub: 'Xem thứ hạng vận hành', tagline: 'Higher Together!', image: A('ranking_trophy'), gradient: ['#FFF7D8', '#FFF0B9'], accent: '#F8B83E' },
  { key: 'gay', title: 'Gậy', sub: 'Lỗi bị nhắc & lý do', tagline: 'Học từ sai lầm để tốt hơn! ♡', image: A('stick_gavel_warning'), gradient: ['#FFE9F1', '#FFD8E7'], accent: '#F06292' },
  { key: 'maymai', title: 'May mắn', sub: '1 lượt quay mỗi ngày', tagline: 'Chút may mắn mỗi ngày! ♡', image: A('lucky_wheel_gift'), gradient: ['#EEE5FF', '#E5D6FF'], accent: '#8B6BEF' },
  { key: 'tientrinh', title: 'Tiến trình', sub: 'Theo dõi theo ca trực', tagline: 'Tiến bộ mỗi ngày cùng BK!', image: A('progress_chart'), gradient: ['#DDF5FF', '#D2EEFF'], accent: '#56B6F2' },
  { key: 'shop', title: 'Shopping', sub: 'Đổi quà bằng điểm', tagline: 'Làm nhiều · Nhận quà xịn! ♡', image: A('shopping_bag_gift'), gradient: ['#DFF8E9', '#CFF4DF'], accent: '#4DC47A' },
  { key: 'huongdan', title: 'Hướng dẫn', sub: 'Quy trình & tài liệu BK', tagline: 'Hiểu rõ hơn · Làm tốt hơn! ♡', image: A('guide_book_bulb'), gradient: ['#FFEAD9', '#FFDDBF'], accent: '#FF914D' },
]
const TAB_TEN: Record<string, string> = { ops_report: 'Report trước buổi', ops_diemdanh: 'Điểm danh', ops_tan: 'Báo tan', ops_prep: 'Chuẩn bị phòng', ops_test: 'Coi test đầu vào' }
const SLOGAN: [string, string] = ['Cùng nhau vận hành', 'Trơn tru mỗi ngày ♡']

export default function DashOps({ profile }: { profile?: MyProfile }) {
  const ym = homNayVN().slice(0, 7)   // luôn tháng hiện tại (không có chọn tháng — theo chốt CEO ở app TA)
  const [box, setBox] = useState<Box | null>(null)
  const [data, setData] = useState<OpsDash | null>(null)
  const [chung, setChung] = useState<XepHangChung | null>(null)
  const [tl, setTl] = useState<TichLuy | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const reload = () => {
    setErr(null)
    Promise.all([opsDashboard(ym), xepHangChung(ym), tichLuy(ym)])
      .then(([d, c, t]) => { setData(d); setChung(c); setTl(t) })
      .catch((e) => setErr(e?.message ?? String(e)))
  }
  useEffect(() => { setData(null); setChung(null); setTl(null); reload() }, []) // eslint-disable-line

  const me = data?.me ?? {}
  const pct = me.pct ?? null
  const ten = (profile?.nhanSu.ho_ten ?? '').trim() || 'Bạn'
  const anhUrl = profile?.nhanSu.anh_url
  const h = box ? TIEU_DE[box] : null
  const goc = box === null

  const ts = goc ? bkTranhStyle(OPS_TRANH_CUATOI) : null

  return (
    // Khung ≤480px như TA. Màn gốc dùng TRANH (spacer giữ chỗ phần cảnh, nút back không cần vì đây là
    // gốc — không có onBack). Sub-screen (chưa có tranh riêng) dùng fallback BKPageHeader nền trời gradient.
    <div className="flex h-full flex-col" style={{ background: ts?.nen.background ?? '#CFE7FE' }}>
      <div className="relative mx-auto h-full w-full max-w-[480px] overflow-hidden" style={{ containerType: 'size', ...(ts ? ts.nen : { background: 'linear-gradient(180deg, #CFE7FE 0%, #E3EEFC 40%, #EEF3FC 100%)' }) }}>
      {goc && <BKTranhNen t={OPS_TRANH_CUATOI} />}
      <div className="relative flex h-full w-full flex-col overflow-y-auto">
        {ts
          ? <div className="relative shrink-0" style={{ height: ts.spacerH }} />
          : <BKPageHeader title={h!.title} tagline={h!.tagline} mascot={h!.mascot} bubble={h!.bubble} onBack={() => setBox(null)} slogan={SLOGAN} logo={['BK', 'Vận hành']} />}
        {box !== 'maymai' && box !== 'shop' && (
          <BKProfileSummary ten={ten} anhUrl={anhUrl} tags={['OPS', 'BK Vận hành', '🌱 Luôn cố gắng']}
            diem={tl ? tl.xai_duoc + tl.diem_thang : null} streak={tl?.chuoi} pct={pct} onPct={() => setBox('tientrinh')} />
        )}

        {/* QUY TẮC KHOẢNG CÁCH (CEO 07/09, áp mọi màn khu Của tôi): mọi khe = 4px đều nhau */}
        <div className="flex min-h-0 flex-1 flex-col px-1 pb-1">
          {err && <p className="mt-2 rounded-2xl bg-[#FFE3EA] px-3 py-2 text-[12.5px] text-[#C0355A]">⚠ {err}</p>}

          {goc && (
            <>
              <div className="mt-1 grid min-h-[320px] flex-1 grid-cols-2 grid-rows-3 gap-1">
                {CARDS.map((c) => <BKMenuCard key={c.key} image={c.image} title={c.title} sub={c.sub} tagline={c.tagline} gradient={c.gradient} accent={c.accent} badge={c.badge} onClick={() => setBox(c.key)} />)}
              </div>
              <BKMascotBanner text="Bạn đang làm rất tốt!" sub="Cùng nhau lan toả những giá trị tích cực nhé! 💙" corner={['Small steps', 'Big impact ♡']} />
            </>
          )}
          <div className={goc ? 'hidden' : 'mt-1 flex min-h-0 flex-1 flex-col'}>
            {box === 'xephang' && (data ? (
              <XepHangScreen tenRieng="vận hành" ten={ten} anhUrl={anhUrl}
                rieng={{ rank: data.rank, tongXepHang: data.tongXepHang, top: data.top, nguongRankFinal: data.nguongRankFinal, nguongRankTop: data.nguongRankTop, me: data.me }}
                chung={chung ? { rank: chung.rank, tongXepHang: chung.tongXepHang, top: chung.top, nguongRankFinal: chung.nguongRankFinal, nguongRankTop: chung.nguongRankTop, me: chung.me } : null} />
            ) : <p className="text-center text-[13px] text-[#63709A]">Đang tính…</p>)}
            {box === 'gay' && <GayCuaToiScreen ym={ym} donGia={GAY_DON_GIA} />}
            {box === 'maymai' && <MayManScreen />}
            {box === 'shop' && <ShopScreen xaiDuoc={tl?.xai_duoc ?? 0} diemThang={tl?.diem_thang ?? 0} chuoi={tl?.chuoi ?? 0} diemMoiNgay={tl?.diem_moi_ngay ?? 100} onChanged={reload} hoTro="bạn" />}
            {box === 'huongdan' && <HuongDanScreen vaiTro="ops" />}
            {box === 'tientrinh' && (data
              ? <DatChuanScreen me={me} items={data.items} tabTen={TAB_TEN} lyDoTen={{}}
                  chuThich="Việc = Report + Điểm danh + Báo tan + Chuẩn bị phòng + Coi test đầu vào, mỗi loại gộp theo CA bạn trực thành 1 việc (đạt khi ≥90% mục trong ca đó đạt). Trễ/thiếu tính theo GẬY đã chốt. Việc trước 01/09/2026 luôn tính đạt."
                />
              : <p className="text-center text-[13px] text-[#63709A]">Đang tính…</p>)}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
