// DashTa — "CỦA TÔI" app TA theo design CEO duyệt 07/09 (handoff BK_TA_Claude_UI, anchor 00_cua_toi):
// hero bầu trời + thẻ hồ sơ (avatar · tên · 🪙 điểm tích lũy · vòng % hoàn thành) + lưới 6 card
// pastel (Xếp hạng · Gậy · May mắn · Tiến trình · Shopping · Hướng dẫn) + banner mascot. Bấm card →
// màn con cùng hero (có nút ‹) và cùng thẻ hồ sơ. Lead (laQuanLy) có thêm card Chấm công TA.
// Dữ liệu: taDashboard (đạt chuẩn) · xepHangChung · tichLuy (điểm/chuỗi) — mọi số ở Postgres (§2.0).
// Tháng đang xem đổi bằng ‹ › ở thanh nhỏ dưới thẻ hồ sơ; áp cho mọi màn con theo tháng.
import { useEffect, useState } from 'react'
import type { MyProfile } from '../../lib/nhansu'
import { getMyScope, type MyScope } from '../../lib/nhansu'
import { taDashboard, type TaDash } from '../../lib/tadash'
import { xepHangChung, type XepHangChung } from '../../lib/xephang'
import { tichLuy, type TichLuy } from '../../lib/tichluy'
import { GAY_DON_GIA } from '../../lib/gay'
import { homNayVN } from '../../lib/tuan'
import { BKPageHeader, BKProfileSummary, BKMenuCard, BKMascotBanner } from '../../components/bk/BKUI'
import { XepHangScreen } from '../../components/bk/XepHangScreen'
import { GayCuaToiScreen } from '../../components/bk/GayCuaToiScreen'
import { MayManScreen } from '../../components/bk/MayManScreen'
import { ShopScreen } from '../../components/bk/ShopScreen'
import { HuongDanScreen } from '../../components/bk/HuongDanScreen'
import { DatChuanScreen } from '../../components/bk/DatChuanScreen'
import TienTrinhTa from './TienTrinhTa'
import ChamCongTa from './ChamCongTa'

type Box = 'xephang' | 'gay' | 'maymai' | 'tientrinh' | 'shop' | 'huongdan' | 'datchuan' | 'chamcong'
const A = (n: string) => `/bk-ui/${n}.png`   // asset PNG từ UI kit (public/bk-ui)
const TIEU_DE: Record<Box, { title: string; tagline: string; mascot: string; bubble: string }> = {
  xephang: { title: 'Xếp hạng', tagline: 'Cùng nhau toả sáng, làm nên một BK tuyệt hơn! ♡', mascot: A('mascot_cheer'), bubble: 'Nỗ lực hôm nay, toả sáng ngày mai!' },
  gay: { title: 'Gậy', tagline: 'Lỗi bị nhắc & lý do ♡', mascot: A('mascot_hearts'), bubble: 'Cố lên bạn ơi!' },
  maymai: { title: 'May mắn', tagline: 'Quay nhỏ mỗi ngày, thêm niềm vui lớn! ♡', mascot: A('mascot_cheer'), bubble: 'Vận may cùng BK!' },
  tientrinh: { title: 'Tiến trình', tagline: 'Nỗ lực hôm nay, tạo giá trị ngày mai! 💙', mascot: A('mascot_wave'), bubble: 'Cùng cố gắng nha!' },
  shop: { title: 'Shopping', tagline: 'Đổi quà bằng điểm. Làm nhiều, nhận quà xịn! ♡', mascot: A('mascot_hearts'), bubble: 'Tích điểm đổi quà thôi!' },
  huongdan: { title: 'Hướng dẫn', tagline: 'Mọi quy trình trong tầm tay TA! ♡', mascot: A('mascot_read'), bubble: 'Học hiểu hơn, làm tốt hơn!' },
  datchuan: { title: 'Nhiệm vụ', tagline: 'Đóng đúng hạn, chất lượng tốt — đạt chuẩn! ♡', mascot: A('mascot_wave'), bubble: 'Giữ nhịp nha!' },
  chamcong: { title: 'Chấm công', tagline: 'Mặc định có mặt — chỉ ghi khi TA vắng có phép', mascot: A('mascot_read'), bubble: 'Lead ghi nhé!' },
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

function ymCong(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export default function DashTa({ profile }: { profile: MyProfile }) {
  const ymNay = homNayVN().slice(0, 7)
  const [ym, setYm] = useState(ymNay)
  const [box, setBox] = useState<Box | null>(null)
  const [data, setData] = useState<TaDash | null>(null)
  const [chung, setChung] = useState<XepHangChung | null>(null)
  const [tl, setTl] = useState<TichLuy | null>(null)
  const [scope, setScope] = useState<MyScope | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const reload = () => {
    setErr(null)
    Promise.all([taDashboard(ym), xepHangChung(ym), tichLuy(ym)])
      .then(([d, c, t]) => { setData(d); setChung(c); setTl(t) })
      .catch((e) => setErr(e?.message ?? String(e)))
  }
  useEffect(reload, [ym]) // eslint-disable-line
  useEffect(() => { getMyScope().then(setScope).catch(() => setScope(null)) }, [])

  const me = data?.me ?? {}
  const ten = (profile.nhanSu.ho_ten ?? '').trim()
  const [thang, nam] = [ym.slice(5, 7), ym.slice(0, 4)]
  const h = box ? TIEU_DE[box] : { title: 'Của tôi', tagline: 'Mỗi nỗ lực hôm nay là một BK tốt hơn ♡', mascot: A('mascot_wave'), bubble: 'Cố lên TA ơi!' }
  const laLead = !!scope?.laQuanLy

  return (
    <div className="min-h-full bg-gradient-to-b from-[#EEF3FF] to-[#F5F5F7] pb-6">
      <BKPageHeader title={h.title} tagline={h.tagline} mascot={h.mascot} bubble={h.bubble} onBack={box ? () => setBox(null) : undefined} />
      <BKProfileSummary ten={ten} anhUrl={profile.nhanSu.anh_url} tags={['TA', 'BK Academy', '🌱 Luôn cố gắng']}
        diem={tl ? tl.xai_duoc + tl.diem_thang : null} streak={tl?.chuoi} pct={me.pct} onPct={() => setBox('datchuan')} />

      <div className="mx-auto max-w-[1000px] px-4">
        {/* thanh tháng — áp cho mọi màn con theo tháng */}
        <div className="mt-3 flex items-center justify-center gap-1">
          <button onClick={() => setYm(ymCong(ym, -1))} className="h-9 w-9 rounded-full bg-white text-[16px] font-bold text-[#2F73F6] shadow-sm active:scale-95">‹</button>
          <span className="rounded-full bg-white px-4 py-1.5 text-[13px] font-extrabold text-[#16224D] shadow-sm">📅 Tháng {thang}/{nam}</span>
          <button onClick={() => setYm(ymCong(ym, 1))} disabled={ym >= ymNay} className="h-9 w-9 rounded-full bg-white text-[16px] font-bold text-[#2F73F6] shadow-sm active:scale-95 disabled:opacity-30">›</button>
        </div>
        {err && <p className="mt-3 rounded-2xl bg-[#FFE3EA] px-3 py-2 text-[12.5px] text-[#C0355A]">⚠ {err}</p>}

        <div className="mt-3">
          {box === null && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {CARDS.map((c) => <BKMenuCard key={c.key} image={c.image} title={c.title} sub={c.sub} tagline={c.tagline} gradient={c.gradient} accent={c.accent} badge={c.badge} onClick={() => setBox(c.key)} />)}
                {laLead && <BKMenuCard image={A('mascot_read')} title="Chấm công TA" sub="Ghi TA vắng có phép" tagline="Dành cho lead" gradient={['#EEF3FF', '#DDE4F3']} accent="#2F73F6" onClick={() => setBox('chamcong')} />}
              </div>
              <BKMascotBanner text="Bạn đang làm rất tốt!" sub="Cùng nhau lan toả những giá trị tích cực nhé! 💙" />
            </>
          )}
          {box === 'xephang' && <XepHangScreen tenRieng="trợ giảng" ten={ten}
            rieng={data ? { rank: data.rank, tongXepHang: data.tongXepHang, top: data.top, nguongRankFinal: data.nguongRankFinal, nguongRankTop: data.nguongRankTop, me: data.me } : null}
            chung={chung ? { rank: chung.rank, tongXepHang: chung.tongXepHang, top: chung.top, nguongRankFinal: chung.nguongRankFinal, nguongRankTop: chung.nguongRankTop, me: chung.me } : null} />}
          {box === 'gay' && <GayCuaToiScreen ym={ym} donGia={GAY_DON_GIA} />}
          {box === 'maymai' && <MayManScreen />}
          {box === 'tientrinh' && <TienTrinhTa ym={ym} />}
          {box === 'shop' && <ShopScreen xaiDuoc={tl?.xai_duoc ?? 0} diemThang={tl?.diem_thang ?? 0} chuoi={tl?.chuoi ?? 0} diemMoiNgay={tl?.diem_moi_ngay ?? 100} onChanged={reload} />}
          {box === 'huongdan' && <HuongDanScreen vaiTro="ta" />}
          {box === 'chamcong' && scope && <ChamCongTa ym={ym} scope={scope} />}
          {box === 'datchuan' && (data
            ? <DatChuanScreen me={me} items={data.items} tabTen={TAB_TEN} lyDoTen={LY_DO_TEN}
                chuThich={`Đạt chuẩn = đóng đúng hạn + chất lượng duyệt ≥${data.nguongChatLuong}. Trễ hạn tính theo GẬY đã chốt. Việc trước 01/09/2026 luôn tính đạt.`} />
            : <p className="text-center text-[13px] text-[#63709A]">Đang tính…</p>)}
        </div>
      </div>
    </div>
  )
}
