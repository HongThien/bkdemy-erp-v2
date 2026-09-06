// DashOps — "Của tôi" app OPS. REDESIGN 07/09 (CEO gửi handoff 07_my.png): khác khuôn GRID của app TA —
// đây là LIST: hero hồng + thẻ hồ sơ (avatar · tên · vai trò · vòng % đạt chuẩn) rồi 6 dòng menu (icon
// vuông màu sẵn trong kit SVG public/ops-ui/my/*.svg) + Cài đặt + Đăng xuất. Bấm dòng → màn con, HEADER
// riêng theo tông màu của dòng đó (đơn sắc, không tranh — đúng phong cách phẳng của bộ 7 màn OPS).
// Dữ liệu: opsDashboard (đạt chuẩn — dùng lại tên "Tiến trình" cho hợp ngữ cảnh vận hành theo ca) ·
// xepHangChung · tichLuy — mọi số ở Postgres (§2.0). Sub-screen TÁI DÙNG NGUYÊN từ khu Của tôi app TA
// (components/bk/*) — generic theo props, không đụng code TA khi OPS dùng lại.
import { useEffect, useState } from 'react'
import { opsDashboard, type OpsDash } from '../../lib/opsdash'
import { xepHangChung, type XepHangChung } from '../../lib/xephang'
import { tichLuy, type TichLuy } from '../../lib/tichluy'
import { GAY_DON_GIA } from '../../lib/gay'
import { homNayVN } from '../../lib/tuan'
import { supabase } from '../../lib/supabase'
import type { MyProfile } from '../../lib/nhansu'
import { OA, type OpsTone, OpsHero, OpsRow } from '../../components/ops/OpsUI'
import { BKProgressRing, BK } from '../../components/bk/BKUI'
import { XepHangScreen } from '../../components/bk/XepHangScreen'
import { GayCuaToiScreen } from '../../components/bk/GayCuaToiScreen'
import { MayManScreen } from '../../components/bk/MayManScreen'
import { ShopScreen } from '../../components/bk/ShopScreen'
import { HuongDanScreen } from '../../components/bk/HuongDanScreen'
import { DatChuanScreen } from '../../components/bk/DatChuanScreen'
import GopY from './GopY'

const TAB_TEN: Record<string, string> = {
  ops_report: 'Report trước buổi', ops_diemdanh: 'Điểm danh', ops_tan: 'Báo tan', ops_prep: 'Chuẩn bị phòng', ops_test: 'Coi test đầu vào',
}
type Box = 'xephang' | 'gay' | 'maymai' | 'tientrinh' | 'shop' | 'huongdan' | 'caidat'
const MENU: { key: Box; tone: OpsTone; icon: string; title: string; sub: string }[] = [
  { key: 'xephang', tone: 'amber', icon: OA('my/icon_rank.svg'), title: 'Xếp hạng', sub: 'Xem thứ hạng của bạn' },
  { key: 'gay', tone: 'pink', icon: OA('my/icon_gavel.svg'), title: 'Gậy', sub: 'Danh sách lỗi bị nhắc' },
  { key: 'maymai', tone: 'green', icon: OA('my/icon_lucky.svg'), title: 'May mắn', sub: 'Quay vòng quay mỗi ngày' },
  { key: 'tientrinh', tone: 'blue', icon: OA('my/icon_progress.svg'), title: 'Tiến trình', sub: 'Theo dõi đạt chuẩn hàng tháng' },
  { key: 'shop', tone: 'pink', icon: OA('my/icon_shopping.svg'), title: 'Shopping', sub: 'Đổi điểm tích lũy lấy quà' },
  { key: 'huongdan', tone: 'blue', icon: OA('my/icon_guide.svg'), title: 'Hướng dẫn', sub: 'Tài liệu quy trình BK' },
]
const TIEU_DE: Record<Box, string> = { xephang: 'Xếp hạng', gay: 'Gậy', maymai: 'May mắn', tientrinh: 'Tiến trình', shop: 'Shopping', huongdan: 'Hướng dẫn', caidat: 'Cài đặt' }

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
  const tone: OpsTone = box ? MENU.find((m) => m.key === box)?.tone ?? 'pink' : 'pink'

  return (
    <div className="min-h-full bg-[#F5F8FF] pb-6">
      <OpsHero tone={box ? tone : 'pink'} title={box ? TIEU_DE[box] : 'Của tôi'} onBack={box ? () => setBox(null) : undefined} />

      <div className="mx-auto max-w-[760px] px-3 pt-3">
        {err && <p className="mb-3 rounded-2xl bg-[#FFE1E7] px-3 py-2 text-[13px] text-[#9F2244]">⚠ {err}</p>}

        {box === null && (
          <>
            {/* thẻ hồ sơ nổi trên hero — avatar · tên · vai trò · vòng % đạt chuẩn (bấm → Tiến trình) */}
            <div className="-mt-8 mb-3 flex items-center gap-3 rounded-3xl bg-white p-4 shadow-md">
              {anhUrl
                ? <img src={anhUrl} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover ring-[3px] ring-[#FFE1E7]" />
                : <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FFE1E7] text-[20px] font-extrabold text-[#9F2244] ring-[3px] ring-[#FFE1E7]">{ten.trim().split(/\s+/).pop()?.charAt(0).toUpperCase()}</span>}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-extrabold text-[#16224D]">{ten}</p>
                <p className="text-[11.5px] font-semibold text-[#6B7AAE]">BK Vận hành</p>
                <p className="mt-0.5 text-[11px] font-semibold text-[#0E6B37]">Làm tốt hơn mỗi ngày! 💪</p>
              </div>
              <button onClick={() => setBox('tientrinh')} className="shrink-0 active:scale-95">
                <BKProgressRing pct={pct ?? 0} size={54} stroke={7} color={(pct ?? 0) >= 80 ? BK.success : (pct ?? 0) >= 50 ? BK.warning : BK.danger}>
                  <span className="text-[13px] font-extrabold text-[#16224D]">{pct == null ? '—' : `${pct}%`}</span>
                </BKProgressRing>
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              {MENU.map((m, i) => (
                <div key={m.key} className={i > 0 ? 'border-t border-[#F1F3FA]' : ''}>
                  <OpsRow icon={<img src={m.icon} alt="" className="h-6 w-6" draggable={false} />} tone={m.tone} title={m.title} sub={m.sub} onClick={() => setBox(m.key)} />
                </div>
              ))}
            </div>

            <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-sm">
              <button onClick={() => setBox('caidat')} className="flex w-full items-center gap-3 px-3.5 py-3.5 text-left active:bg-[#F7F9FF]">
                <span className="text-[18px]">⚙️</span><span className="flex-1 text-[14.5px] font-bold text-[#16224D]">Cài đặt</span><span className="text-[#C7D0E8]">›</span>
              </button>
              <button onClick={() => supabase.auth.signOut()} className="flex w-full items-center gap-3 border-t border-[#F1F3FA] px-3.5 py-3.5 text-left active:bg-[#FFE1E7]/40">
                <span className="text-[18px]">🚪</span><span className="flex-1 text-[14.5px] font-bold text-[#E11D48]">Đăng xuất</span><span className="text-[#C7D0E8]">›</span>
              </button>
            </div>
          </>
        )}

        {box === 'xephang' && (data ? (
          <XepHangScreen tenRieng="vận hành" ten={ten} anhUrl={anhUrl}
            rieng={{ rank: data.rank, tongXepHang: data.tongXepHang, top: data.top, nguongRankFinal: data.nguongRankFinal, nguongRankTop: data.nguongRankTop, me: data.me }}
            chung={chung ? { rank: chung.rank, tongXepHang: chung.tongXepHang, top: chung.top, nguongRankFinal: chung.nguongRankFinal, nguongRankTop: chung.nguongRankTop, me: chung.me } : null} />
        ) : <p className="text-center text-[13px] text-[#6B7AAE]">Đang tính…</p>)}
        {box === 'gay' && <GayCuaToiScreen ym={ym} donGia={GAY_DON_GIA} />}
        {box === 'maymai' && <MayManScreen />}
        {box === 'shop' && <ShopScreen xaiDuoc={tl?.xai_duoc ?? 0} diemThang={tl?.diem_thang ?? 0} chuoi={tl?.chuoi ?? 0} diemMoiNgay={tl?.diem_moi_ngay ?? 100} onChanged={reload} hoTro="bạn" />}
        {box === 'huongdan' && <HuongDanScreen vaiTro="ops" />}
        {box === 'tientrinh' && (data
          ? <DatChuanScreen me={me} items={data.items} tabTen={TAB_TEN} lyDoTen={{}}
              chuThich="Việc = Report + Điểm danh + Báo tan + Chuẩn bị phòng + Coi test đầu vào, mỗi loại gộp theo CA bạn trực thành 1 việc (đạt khi ≥90% mục trong ca đó đạt). Trễ/thiếu tính theo GẬY đã chốt. Việc trước 01/09/2026 luôn tính đạt."
            />
          : <p className="text-center text-[13px] text-[#6B7AAE]">Đang tính…</p>)}
        {box === 'caidat' && <CaiDatBox ten={ten} anhUrl={anhUrl} />}
      </div>
    </div>
  )
}

// Cài đặt — tối giản: thông tin tài khoản + góp ý/báo lỗi (chưa có màn cấu hình riêng cho OPS).
// GopY tự có nút+modal riêng (icon 🐞) — đặt trực tiếp làm control bên phải dòng, không lồng sheet
// khác (BKBottomSheet z-90 sẽ đè lên modal z-50 của GopY nếu lồng nhau).
function CaiDatBox({ ten, anhUrl }: { ten: string; anhUrl?: string | null }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
        {anhUrl ? <img src={anhUrl} alt="" className="h-12 w-12 rounded-full object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E1EBFF] text-[16px] font-extrabold text-[#1E44A8]">{ten.charAt(0)}</span>}
        <div className="min-w-0 flex-1"><p className="truncate text-[14.5px] font-extrabold text-[#16224D]">{ten}</p><p className="text-[11.5px] text-[#6B7AAE]">BK Vận hành</p></div>
      </div>
      <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
        <span className="flex-1 text-[14px] font-bold text-[#16224D]">Góp ý / Báo lỗi</span>
        <GopY route="cai_dat" />
      </div>
      <p className="px-2 text-center text-[11px] text-[#9AA5C4]">BK Academy — Vận hành · phiên bản nội bộ</p>
    </div>
  )
}
