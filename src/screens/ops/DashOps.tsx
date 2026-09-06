// DashOps — "📈 Của tôi" app OPS. Việc = Report + Điểm danh + Báo tan + Prep phòng + Coi
// test đầu vào, GỘP THEO CA (CEO 07/09: "mỗi loại việc trong ca tính 1 task" — 1 nhóm =
// report/điểm danh/báo tan cả ca, hoặc 7 phòng prep 1 ca). Nhóm đạt khi ≥90% mục trong
// nhóm đạt (ngưỡng tạm, hạ chuẩn để tập huấn — sẽ siết dần), sở hữu theo NGƯỜI TRỰC CA
// (phan_cong_ca), fn_ops_dashboard/fn_ops_viec_nhom_thang §2.0. Bar đạt chuẩn + 4 số +
// xếp hạng RIÊNG (OPS) và CHUNG (toàn BK) + danh sách việc cả tháng (đạt lẫn không đạt,
// ẩn chi tiết — bấm mới xoè). "Không đạt" tự cập nhật theo GẬY đã chốt & còn hiệu lực —
// bỏ qua/thu hồi gậy thì tự lật lại đạt (áp đồng loạt cho nhóm, không tách trễ/chất lượng
// như TA/GV — 1 nhóm có thể vừa có mục trễ vừa có mục chất lượng kém).
import { useEffect, useState } from 'react'
import { opsDashboard, type OpsDash } from '../../lib/opsdash'
import { xepHangChung, type XepHangChung } from '../../lib/xephang'
import { homNayVN, ddmmVN } from '../../lib/tuan'
import { XepHangBlock, ViecThangAccordion } from '../../components/CuaToiWidgets'

const TAB_TEN: Record<string, string> = {
  ops_report: 'Report trước buổi', ops_diemdanh: 'Điểm danh', ops_tan: 'Báo tan', ops_prep: 'Chuẩn bị phòng', ops_test: 'Coi test đầu vào',
}
const LY_DO_TEN: Record<string, string> = {}

function ymCong(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export default function DashOps() {
  const ymNay = homNayVN().slice(0, 7)
  const [ym, setYm] = useState(ymNay)
  const [data, setData] = useState<OpsDash | null>(null)
  const [chung, setChung] = useState<XepHangChung | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { (async () => {
    setLoading(true); setErr(null)
    try {
      const [d, c] = await Promise.all([opsDashboard(ym), xepHangChung(ym)])
      setData(d); setChung(c)
    } catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoading(false) }
  })() }, [ym])

  const me = data?.me ?? {}
  const pct = me.pct ?? null
  const [thang, nam] = [ym.slice(5, 7), ym.slice(0, 4)]

  return (
    <div>
      <div className="bg-indigo-600 px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto flex max-w-[760px] items-center gap-2">
          <p className="text-[15px] font-bold text-white">📈 Công việc của tôi</p>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setYm(ymCong(ym, -1))} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-white/80 active:bg-white/10">‹</button>
            <span className="text-[13px] font-semibold text-white">Tháng {thang}/{nam}</span>
            <button onClick={() => setYm(ymCong(ym, 1))} disabled={ym >= ymNay} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-white/80 active:bg-white/10 disabled:opacity-30">›</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-3 pb-24 pt-3">
        {loading ? <p className="text-[13px] text-slate-400">Đang tính…</p>
          : err ? <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>
          : !data ? <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">Không tải được dữ liệu.</p>
          : (
          <div className="flex flex-col gap-3">
            {!me.tong ? (
              <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">Tháng này chưa có việc trực ca nào của bạn.</p>
            ) : (
              <>
                {/* BAR ĐẠT CHUẨN */}
                <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                  <div className="mb-1.5 flex items-baseline gap-2">
                    <span className="text-[28px] font-extrabold text-slate-800">{pct == null ? '—' : `${pct}%`}</span>
                    <span className="text-[13px] font-semibold text-slate-500">đạt chuẩn · {me.dat ?? 0}/{me.den_han ?? 0} việc đến hạn</span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full transition-all ${(pct ?? 0) >= 80 ? 'bg-indigo-500' : (pct ?? 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${pct ?? 0}%` }} />
                  </div>
                  <p className="mt-2 text-[12.5px] text-slate-500">Việc = Report + Điểm danh + Báo tan + Chuẩn bị phòng + Coi test đầu vào, mỗi loại gộp theo CA bạn trực thành 1 việc (đạt khi ≥90% mục trong ca đó đạt). Trễ/thiếu: tính theo GẬY đã chốt.</p>
                </div>

                {/* 4 SỐ */}
                <div className="grid grid-cols-4 gap-2">
                  <StatBox n={me.tong ?? 0} label="Được giao" cls="text-slate-700" />
                  <StatBox n={me.dat ?? 0} label="Đạt chuẩn" cls="text-emerald-600" />
                  <StatBox n={me.khong_dat ?? 0} label="Không đạt" cls="text-rose-600" />
                  <StatBox n={me.cho ?? 0} label="Đang chờ" cls="text-slate-400" />
                </div>
              </>
            )}

            {/* XẾP HẠNG: RIÊNG (OPS) + CHUNG (toàn BK) — luôn hiện, kể cả tháng này chưa có việc */}
            <XepHangBlock title={`Xếp hạng OPS tháng ${thang}`} icon="🏆" rank={data.rank} tongXepHang={data.tongXepHang}
              top={data.top} nguongFinal={data.nguongRankFinal} nguongTop={data.nguongRankTop}
              accentBg="bg-indigo-600" accentText="text-indigo-700" />
            {chung && (
              <XepHangBlock title={`Xếp hạng CHUNG toàn BK tháng ${thang}`} icon="🌐" rank={chung.rank} tongXepHang={chung.tongXepHang}
                top={chung.top} nguongFinal={chung.nguongRankFinal} nguongTop={chung.nguongRankTop}
                accentBg="bg-violet-600" accentText="text-violet-700" />
            )}

            {/* DANH SÁCH VIỆC CẢ THÁNG — accordion, ẩn chi tiết mặc định */}
            {!!me.tong && <ViecThangAccordion items={data.items} tenViecLabel="Việc" tabTen={TAB_TEN} lyDoTen={LY_DO_TEN} fmtNgay={ddmmVN} />}
          </div>
        )}
      </div>
    </div>
  )
}

function StatBox({ n, label, cls }: { n: number; label: string; cls: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-2.5 text-center shadow-sm">
      <p className={`text-[20px] font-extrabold ${cls}`}>{n}</p>
      <p className="text-[10.5px] font-semibold text-slate-400">{label}</p>
    </div>
  )
}
