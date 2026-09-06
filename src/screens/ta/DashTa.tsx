// DashTa — "CỦA TÔI" app TA theo design CEO duyệt 07/09 (handoff BK_TA_Claude_UI, anchor 00_cua_toi):
// NGUYÊN TẮC CEO 07/09: (1) dùng THẲNG tranh nền CEO vẽ (bg_cua_toi.jpg — logo, tiêu đề, tagline,
// mascot đã nằm trong tranh), các ô chức năng đặt LÊN tranh; (2) mọi thứ nằm gọn 1 màn iPhone, không
// cuộn (icon to, chữ nhỏ, lưới 6 ô co giãn theo chiều cao còn lại); (3) chữ tay nghiêng như design.
// Bố cục: spacer cảnh (aspect 941/440) → thẻ hồ sơ (avatar · tên · 🪙 điểm tích lũy · vòng %) → thanh
// tháng → lưới 2×3 (Xếp hạng · Gậy · May mắn · Tiến trình · Shopping · Hướng dẫn) → banner mascot.
// Bấm card → màn con: header HTML (nút ‹, tiêu đề bong bóng) trên nền trời gradient + cùng thẻ hồ sơ.
// Chấm công TA (lead) KHÔNG ở app này — CEO 07/09 "Trang là ở màn khác".
// Dữ liệu: taDashboard (đạt chuẩn) · xepHangChung · tichLuy (điểm/chuỗi) — mọi số ở Postgres (§2.0).
import { useEffect, useState } from 'react'
import type { MyProfile } from '../../lib/nhansu'
import { taDashboard, type TaDash } from '../../lib/tadash'
import { xepHangChung, type XepHangChung } from '../../lib/xephang'
import { tichLuy, type TichLuy } from '../../lib/tichluy'
import { GAY_DON_GIA } from '../../lib/gay'
import { homNayVN } from '../../lib/tuan'
import { BKPageHeader, BKProfileSummary, BKMenuCard, BKMascotBanner, BK_TRANH, BKTranhNen, bkTranhStyle } from '../../components/bk/BKUI'
import { XepHangScreen } from '../../components/bk/XepHangScreen'
import { GayCuaToiScreen } from '../../components/bk/GayCuaToiScreen'
import { MayManScreen } from '../../components/bk/MayManScreen'
import { ShopScreen } from '../../components/bk/ShopScreen'
import { HuongDanScreen } from '../../components/bk/HuongDanScreen'
import { DatChuanScreen } from '../../components/bk/DatChuanScreen'
import TienTrinhTa from './TienTrinhTa'

type Box = 'xephang' | 'gay' | 'maymai' | 'tientrinh' | 'shop' | 'huongdan' | 'datchuan'
const A = (n: string) => `/bk-ui/${n}.png`   // asset PNG từ UI kit (public/bk-ui)
const TIEU_DE: Record<Box, { title: string; tagline: string; mascot: string; bubble: string }> = {
  xephang: { title: 'Xếp hạng', tagline: 'Cùng nhau toả sáng, làm nên một BK tuyệt hơn! ♡', mascot: A('mascot_cheer'), bubble: 'Nỗ lực hôm nay, toả sáng ngày mai!' },
  gay: { title: 'Gậy', tagline: 'Lỗi bị nhắc & lý do ♡', mascot: A('mascot_hearts'), bubble: 'Cố lên bạn ơi!' },
  maymai: { title: 'May mắn', tagline: 'Quay nhỏ mỗi ngày, thêm niềm vui lớn! ♡', mascot: A('mascot_cheer'), bubble: 'Vận may cùng BK!' },
  tientrinh: { title: 'Tiến trình', tagline: 'Nỗ lực hôm nay, tạo giá trị ngày mai! 💙', mascot: A('mascot_wave'), bubble: 'Cùng cố gắng nha!' },
  shop: { title: 'Shopping', tagline: 'Đổi quà bằng điểm. Làm nhiều, nhận quà xịn! ♡', mascot: A('mascot_hearts'), bubble: 'Tích điểm đổi quà thôi!' },
  huongdan: { title: 'Hướng dẫn', tagline: 'Mọi quy trình trong tầm tay TA! ♡', mascot: A('mascot_read'), bubble: 'Học hiểu hơn, làm tốt hơn!' },
  datchuan: { title: 'Nhiệm vụ', tagline: 'Đóng đúng hạn, chất lượng tốt — đạt chuẩn! ♡', mascot: A('mascot_wave'), bubble: 'Giữ nhịp nha!' },
}
// 6 card theo spec/layout_cua_toi.json (gradient + accent + asset đúng từng card)
const CARDS: { key: Box; title: string; sub: string; tagline: string; image: string; gradient: [string, string]; accent: string; badge?: string }[] = [
  { key: 'xephang', title: 'Xếp hạng', sub: 'Xem thứ hạng cá nhân', tagline: 'Higher Together!', image: A('ranking_trophy'), gradient: ['#FFF7D8', '#FFF0B9'], accent: '#F8B83E' },
  { key: 'gay', title: 'Gậy', sub: 'Lỗi bị nhắc & lý do', tagline: 'Học từ sai lầm để tốt hơn! ♡', image: A('stick_gavel_warning'), gradient: ['#FFE9F1', '#FFD8E7'], accent: '#F06292' },
  { key: 'maymai', title: 'May mắn', sub: '1 lượt quay mỗi ngày', tagline: 'Chút may mắn mỗi ngày! ♡', image: A('lucky_wheel_gift'), gradient: ['#EEE5FF', '#E5D6FF'], accent: '#8B6BEF', badge: 'sắp mở' },
  { key: 'tientrinh', title: 'Tiến trình', sub: 'Theo dõi KPI theo lớp', tagline: 'Tiến bộ mỗi ngày cùng BK!', image: A('progress_chart'), gradient: ['#DDF5FF', '#D2EEFF'], accent: '#56B6F2' },
  { key: 'shop', title: 'Shopping', sub: 'Đổi quà bằng điểm', tagline: 'Làm nhiều · Nhận quà xịn! ♡', image: A('shopping_bag_gift'), gradient: ['#DFF8E9', '#CFF4DF'], accent: '#4DC47A' },
  { key: 'huongdan', title: 'Hướng dẫn', sub: 'Quy trình & tài liệu BK', tagline: 'Hiểu rõ hơn · Làm tốt hơn! ♡', image: A('guide_book_bulb'), gradient: ['#FFEAD9', '#FFDDBF'], accent: '#FF914D' },
]
const TAB_TEN: Record<string, string> = { ingame: 'Bài trên lớp', et: 'Chấm ET', btvn: 'Chấm BTVN' }
const LY_DO_TEN: Record<string, string> = { tre: 'đóng muộn', no_qua_han: 'đang nợ quá hạn', chat_luong: 'chất lượng chưa đạt' }

export default function DashTa({ profile }: { profile: MyProfile }) {
  const ym = homNayVN().slice(0, 7)   // luôn tháng hiện tại (không có chọn tháng ở màn này)
  const [box, setBox] = useState<Box | null>(null)
  const [data, setData] = useState<TaDash | null>(null)
  const [chung, setChung] = useState<XepHangChung | null>(null)
  const [tl, setTl] = useState<TichLuy | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const reload = () => {
    setErr(null)
    Promise.all([taDashboard(ym), xepHangChung(ym), tichLuy(ym)])
      .then(([d, c, t]) => { setData(d); setChung(c); setTl(t) })
      .catch((e) => setErr(e?.message ?? String(e)))
  }
  useEffect(reload, [ym]) // eslint-disable-line

  const me = data?.me ?? {}
  const ten = (profile.nhanSu.ho_ten ?? '').trim()
  const h = box ? TIEU_DE[box] : null
  const goc = box === null
  // Màn có TRANH CEO vẽ sẵn (Của tôi · Xếp hạng): spacer giữ chỗ phần cảnh + nút ‹ đặt lên tranh. Màn khác:
  // header HTML trên nền trời gradient (chờ CEO vẽ thêm tranh).
  const tranh = goc ? BK_TRANH.cuatoi : box === 'xephang' ? BK_TRANH.xephang : null
  const ts = tranh ? bkTranhStyle(tranh) : null

  return (
    // Ngoài: kín màn, màu trời để 2 mép desktop không lộ nền xám. Khung ≤480px (khổ điện thoại) cao ĐÚNG
    // bằng màn = container-type:size để cột con đo tranh/spacer theo cqw/cqh (đơn vị cq chỉ tra TỔ TIÊN —
    // đặt container lên chính cột thì background của cột rơi về viewport, đã dính). Cột TỰ CUỘN nội bộ
    // (màn thấp như iPhone SE) → tranh nền đứng yên, nội dung trượt lên trên tranh (CEO 07/09).
    <div className="flex h-full flex-col" style={{ background: tranh?.troi[1] ?? '#CFE7FE' }}>
      <div className="relative mx-auto h-full w-full max-w-[480px] overflow-hidden" style={{ containerType: 'size', ...(ts ? ts.nen : { background: 'linear-gradient(180deg, #CFE7FE 0%, #E3EEFC 40%, #EEF3FC 100%)' }) }}>
      {tranh && <BKTranhNen t={tranh} />}
      <div className="relative flex h-full w-full flex-col overflow-y-auto">
        {ts
          ? <div className="relative shrink-0" style={{ height: ts.spacerH }}>
              {/* nút ‹ đặt DƯỚI logo trong tranh (logo cao ~15cqw), trên bảng gỗ (~32cqw) */}
              {!goc && <button onClick={() => setBox(null)} aria-label="Quay lại"
                className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[22px] font-bold text-[#2F73F6] shadow-md active:scale-95"
                style={{ top: `calc(${ts.offsetY} + 17.5cqw)` }}>‹</button>}
            </div>
          : <BKPageHeader title={h!.title} tagline={h!.tagline} mascot={h!.mascot} bubble={h!.bubble} onBack={() => setBox(null)} />}
        <BKProfileSummary ten={ten} anhUrl={profile.nhanSu.anh_url} tags={['TA', 'BK Academy', '🌱 Luôn cố gắng']}
          diem={tl ? tl.xai_duoc + tl.diem_thang : null} streak={tl?.chuoi} pct={me.pct} onPct={() => setBox('datchuan')} />

        {/* QUY TẮC KHOẢNG CÁCH (CEO 07/09, áp mọi màn khu Của tôi): mọi khe = 4px đều nhau — card↔card,
            card↔mép màn, hồ sơ↔lưới↔banner — để không lộ nền sau; màn con dùng gap-1 tương ứng */}
        <div className="flex flex-1 flex-col px-1 pb-1">
          {/* KHÔNG có thanh chọn tháng — CEO 07/09: "màn Của tôi không cần thời gian", đặt giữa 2 card làm bố cục rời
              rạc; mọi số là THÁNG HIỆN TẠI. Xem tháng cũ → màn Hôm nay. */}
          {err && <p className="mt-2 rounded-2xl bg-[#FFE3EA] px-3 py-2 text-[12.5px] text-[#C0355A]">⚠ {err}</p>}

          {goc && (
            <>
              {/* lưới 2×3 co giãn lấp hết chiều cao còn lại → luôn vừa 1 màn (≥ ~700px cao); màn thấp hơn mới cuộn */}
              <div className="mt-1 grid min-h-[320px] flex-1 grid-cols-2 grid-rows-3 gap-1">
                {CARDS.map((c) => <BKMenuCard key={c.key} image={c.image} title={c.title} sub={c.sub} tagline={c.tagline} gradient={c.gradient} accent={c.accent} badge={c.badge} onClick={() => setBox(c.key)} />)}
              </div>
              <BKMascotBanner text="Bạn đang làm rất tốt!" sub="Cùng nhau lan toả những giá trị tích cực nhé! 💙" />
            </>
          )}
          <div className={goc ? 'hidden' : 'mt-1'}>
          {box === 'xephang' && <XepHangScreen tenRieng="trợ giảng" ten={ten}
            rieng={data ? { rank: data.rank, tongXepHang: data.tongXepHang, top: data.top, nguongRankFinal: data.nguongRankFinal, nguongRankTop: data.nguongRankTop, me: data.me } : null}
            chung={chung ? { rank: chung.rank, tongXepHang: chung.tongXepHang, top: chung.top, nguongRankFinal: chung.nguongRankFinal, nguongRankTop: chung.nguongRankTop, me: chung.me } : null} />}
          {box === 'gay' && <GayCuaToiScreen ym={ym} donGia={GAY_DON_GIA} />}
          {box === 'maymai' && <MayManScreen />}
          {box === 'tientrinh' && <TienTrinhTa ym={ym} />}
          {box === 'shop' && <ShopScreen xaiDuoc={tl?.xai_duoc ?? 0} diemThang={tl?.diem_thang ?? 0} chuoi={tl?.chuoi ?? 0} diemMoiNgay={tl?.diem_moi_ngay ?? 100} onChanged={reload} />}
          {box === 'huongdan' && <HuongDanScreen vaiTro="ta" />}
          {box === 'datchuan' && (data
            ? <DatChuanScreen me={me} items={data.items} tabTen={TAB_TEN} lyDoTen={LY_DO_TEN}
                chuThich={`Đạt chuẩn = đóng đúng hạn + chất lượng duyệt ≥${data.nguongChatLuong}. Trễ hạn tính theo GẬY đã chốt. Việc trước 01/09/2026 luôn tính đạt.`} />
            : <p className="text-center text-[13px] text-[#63709A]">Đang tính…</p>)}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
