// DashTa — "📈 Của tôi" app TA, ĐẠI CẤU TRÚC 07/09 (CEO): header tháng + chip Điểm tích lũy + ô %
// đạt chuẩn thu nhỏ, dưới là 6 BOX: Xếp hạng · Gậy · May mắn · Tiến trình · Shopping · Hướng dẫn.
// Bấm box → màn con. Đợt 1: Xếp hạng (2 bảng cũ) · Gậy · Tiến trình · Hướng dẫn · Đạt chuẩn (nội
// dung màn cũ dời vào ô %). May mắn + Shopping/tích lũy = Đợt 2 (hiện "sắp mở", không bịa số).
// Khung + Gậy + Hướng dẫn + Đạt chuẩn dùng chung (components/CuaToiBoxes) — GV/OPS lắp sau.
import { useEffect, useState } from 'react'
import { taDashboard, type TaDash } from '../../lib/tadash'
import { xepHangChung, type XepHangChung } from '../../lib/xephang'
import { GAY_DON_GIA } from '../../lib/gay'
import { homNayVN } from '../../lib/tuan'
import { XepHangBlock } from '../../components/CuaToiWidgets'
import { CuaToiHeader, CuaToiGrid, GayBox, HuongDanBox, DatChuanBox, BoxTitle, type BoxKey } from '../../components/CuaToiBoxes'
import TienTrinhTa from './TienTrinhTa'

const TAB_TEN: Record<string, string> = { ingame: 'Bài trên lớp', et: 'Chấm ET', btvn: 'Chấm BTVN' }
const LY_DO_TEN: Record<string, string> = { tre: 'đóng muộn', no_qua_han: 'đang nợ quá hạn', chat_luong: 'chất lượng chưa đạt' }

export default function DashTa() {
  const ymNay = homNayVN().slice(0, 7)
  const [ym, setYm] = useState(ymNay)
  const [box, setBox] = useState<BoxKey | null>(null)
  const [data, setData] = useState<TaDash | null>(null)
  const [chung, setChung] = useState<XepHangChung | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { (async () => {
    setErr(null)
    try {
      const [d, c] = await Promise.all([taDashboard(ym), xepHangChung(ym)])
      setData(d); setChung(c)
    } catch (e: any) { setErr(e.message ?? String(e)) }
  })() }, [ym])

  const me = data?.me ?? {}
  const thang = ym.slice(5, 7)

  return (
    <div>
      <CuaToiHeader ym={ym} ymNay={ymNay} onYm={(v) => { setYm(v) }} mau="bg-teal-600"
        pct={me.pct} diemTichLuy={null} onPct={() => setBox('datchuan')} onBack={box ? () => setBox(null) : null} />

      <div className="mx-auto max-w-[1000px] px-3 pb-24 pt-3">
        {err && <p className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>}

        {box === null && (
          <CuaToiGrid onOpen={setBox} boxes={[
            { key: 'xephang', icon: '🏆', label: 'Xếp hạng', sub: 'TA · toàn BK', bg: 'bg-amber-50' },
            { key: 'gay', icon: '🥢', label: 'Gậy', sub: 'Đã chốt · đang đề xuất', bg: 'bg-rose-50' },
            { key: 'maymai', icon: '🎡', label: 'May mắn', sub: 'Vòng quay mỗi ngày', bg: 'bg-fuchsia-50', sapMo: true },
            { key: 'tientrinh', icon: '📊', label: 'Tiến trình', sub: 'Thừa / thiếu định mức', bg: 'bg-teal-50' },
            { key: 'shop', icon: '🧋', label: 'Shopping', sub: 'Đổi điểm tích lũy', bg: 'bg-violet-50', sapMo: true },
            { key: 'huongdan', icon: '📖', label: 'Hướng dẫn', sub: 'Quy trình BK', bg: 'bg-sky-50' },
          ]} />
        )}

        {box === 'xephang' && (data ? (
          <div className="flex flex-col gap-3">
            <XepHangBlock title={`Xếp hạng trợ giảng tháng ${thang}`} icon="🏆" rank={data.rank} tongXepHang={data.tongXepHang}
              top={data.top} nguongFinal={data.nguongRankFinal} nguongTop={data.nguongRankTop} accentBg="bg-teal-600" accentText="text-teal-700" />
            {chung && <XepHangBlock title={`Xếp hạng CHUNG toàn BK tháng ${thang}`} icon="🌐" rank={chung.rank} tongXepHang={chung.tongXepHang}
              top={chung.top} nguongFinal={chung.nguongRankFinal} nguongTop={chung.nguongRankTop} accentBg="bg-indigo-600" accentText="text-indigo-700" />}
          </div>
        ) : <p className="text-[13px] text-slate-400">Đang tính…</p>)}

        {box === 'gay' && <><BoxTitle>Gậy tháng {thang}</BoxTitle><GayBox ym={ym} donGia={GAY_DON_GIA} /></>}
        {box === 'tientrinh' && <><BoxTitle>Tiến trình tháng {thang}</BoxTitle><TienTrinhTa ym={ym} /></>}
        {box === 'huongdan' && <><BoxTitle>Quy trình BK</BoxTitle><HuongDanBox vaiTro="ta" /></>}
        {box === 'datchuan' && (data ? (
          <><BoxTitle>Đạt chuẩn tháng {thang}</BoxTitle>
            <DatChuanBox me={me} items={data.items} tabTen={TAB_TEN} lyDoTen={LY_DO_TEN} mauBar="bg-teal-500"
              chuThich={`Đạt chuẩn = đóng đúng hạn + chất lượng duyệt ≥${data.nguongChatLuong}. Trễ hạn tính theo GẬY đã chốt (bỏ qua/thu hồi → tự lật lại đạt). Việc trước 01/09/2026 luôn tính đạt.`} /></>
        ) : <p className="text-[13px] text-slate-400">Đang tính…</p>)}
      </div>
    </div>
  )
}
