// DashOps — "📈 Của tôi" app OPS, ĐẠI CẤU TRÚC 07/09 (CEO): cùng khuôn TA — header tháng + chip Điểm
// tích lũy + ô % đạt chuẩn, dưới là 6 BOX: Xếp hạng · Gậy · May mắn · Tiến trình · Shopping · Hướng dẫn.
// Bấm box → màn con. OPS mở: Xếp hạng (OPS + chung) · Gậy · Shopping · Hướng dẫn (nhãn 'ops') · Đạt
// chuẩn. May mắn = sắp mở (như TA). Tiến trình = sắp mở — OPS không có định mức theo lớp như TA,
// CEO 07/09 "tạm bỏ lại". File này = DỮ LIỆU + ĐIỀU HƯỚNG (giữ nguyên khi đổi hình); render ở
// OpsBoxes.tsx (style cũ, sẽ thay bằng components/bk khi bên TA chốt design).
// Việc OPS = Report + Điểm danh + Báo tan + Prep phòng + Coi test đầu vào, gộp theo CA trực (1 loại
// việc/ca = 1 task, đạt khi ≥90% mục), sở hữu theo phan_cong_ca — fn_ops_dashboard (§2.0). Điểm tích
// lũy = fn_tich_luy (dùng chung mọi vai trò, tính từ 09/2026). Mọi số ở Postgres.
import { useEffect, useState } from 'react'
import { opsDashboard, type OpsDash } from '../../lib/opsdash'
import { xepHangChung, type XepHangChung } from '../../lib/xephang'
import { tichLuy, type TichLuy } from '../../lib/tichluy'
import { GAY_DON_GIA } from '../../lib/gay'
import { homNayVN } from '../../lib/tuan'
import { XepHangBlock } from '../../components/CuaToiWidgets'
import { CuaToiHeader, CuaToiGrid, GayBox, HuongDanBox, DatChuanBox, ShopBox, BoxTitle, type BoxKey } from './OpsBoxes'

const TAB_TEN: Record<string, string> = {
  ops_report: 'Report trước buổi', ops_diemdanh: 'Điểm danh', ops_tan: 'Báo tan', ops_prep: 'Chuẩn bị phòng', ops_test: 'Coi test đầu vào',
}
const LY_DO_TEN: Record<string, string> = {}

export default function DashOps() {
  const ymNay = homNayVN().slice(0, 7)
  const [ym, setYm] = useState(ymNay)
  const [box, setBox] = useState<BoxKey | null>(null)
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
  useEffect(() => { setData(null); setChung(null); setTl(null); reload() }, [ym]) // eslint-disable-line

  const me = data?.me ?? {}
  const thang = ym.slice(5, 7)

  return (
    <div>
      <CuaToiHeader ym={ym} ymNay={ymNay} onYm={setYm} mau="bg-indigo-600"
        pct={me.pct} diemTichLuy={tl ? tl.xai_duoc + tl.diem_thang : null} chuoi={tl?.chuoi}
        onPct={() => setBox('datchuan')} onBack={box ? () => setBox(null) : null} />

      <div className="mx-auto max-w-[1000px] px-3 pb-24 pt-3">
        {err && <p className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>}

        {box === null && (
          <CuaToiGrid onOpen={setBox} boxes={[
            { key: 'xephang', icon: '🏆', label: 'Xếp hạng', sub: 'OPS · toàn BK', bg: 'bg-amber-50' },
            { key: 'gay', icon: '🥢', label: 'Gậy', sub: 'Đã chốt · đang đề xuất', bg: 'bg-rose-50' },
            { key: 'maymai', icon: '🎡', label: 'May mắn', sub: 'Vòng quay mỗi ngày', bg: 'bg-fuchsia-50', sapMo: true },
            { key: 'tientrinh', icon: '📊', label: 'Tiến trình', sub: 'Ca trực trong tháng', bg: 'bg-indigo-50', sapMo: true },
            { key: 'shop', icon: '🧋', label: 'Shopping', sub: 'Đổi điểm tích lũy', bg: 'bg-violet-50' },
            { key: 'huongdan', icon: '📖', label: 'Hướng dẫn', sub: 'Quy trình BK', bg: 'bg-sky-50' },
          ]} />
        )}

        {box === 'xephang' && (data ? (
          <div className="flex flex-col gap-3">
            <XepHangBlock title={`Xếp hạng OPS tháng ${thang}`} icon="🏆" rank={data.rank} tongXepHang={data.tongXepHang}
              top={data.top} nguongFinal={data.nguongRankFinal} nguongTop={data.nguongRankTop} accentBg="bg-indigo-600" accentText="text-indigo-700" />
            {chung && <XepHangBlock title={`Xếp hạng CHUNG toàn BK tháng ${thang}`} icon="🌐" rank={chung.rank} tongXepHang={chung.tongXepHang}
              top={chung.top} nguongFinal={chung.nguongRankFinal} nguongTop={chung.nguongRankTop} accentBg="bg-violet-600" accentText="text-violet-700" />}
          </div>
        ) : <p className="text-[13px] text-slate-400">Đang tính…</p>)}

        {box === 'gay' && <><BoxTitle>Gậy tháng {thang}</BoxTitle><GayBox ym={ym} donGia={GAY_DON_GIA} /></>}
        {box === 'shop' && <><BoxTitle>Shopping</BoxTitle><ShopBox xaiDuoc={tl?.xai_duoc ?? 0} diemThang={tl?.diem_thang ?? 0} onChanged={reload} /></>}
        {box === 'huongdan' && <><BoxTitle>Quy trình BK</BoxTitle><HuongDanBox vaiTro="ops" /></>}
        {box === 'datchuan' && (data ? (
          <><BoxTitle>Đạt chuẩn tháng {thang}</BoxTitle>
            <DatChuanBox me={me} items={data.items} tabTen={TAB_TEN} lyDoTen={LY_DO_TEN} mauBar="bg-indigo-500"
              chuThich="Việc = Report + Điểm danh + Báo tan + Chuẩn bị phòng + Coi test đầu vào, mỗi loại gộp theo CA bạn trực thành 1 việc (đạt khi ≥90% mục trong ca đó đạt). Trễ/thiếu: tính theo GẬY đã chốt — bỏ qua/thu hồi gậy thì tự lật lại đạt. Việc trước 01/09/2026 luôn tính đạt." /></>
        ) : <p className="text-[13px] text-slate-400">Đang tính…</p>)}
      </div>
    </div>
  )
}
