// DashGv — "📈 Của tôi" app GV. CEO chốt 31/08: TẦNG A trước (đạt-chuẩn/đến-hạn 2 khâu
// đánh giá + chấm bài trên lớp — fn_gv_dashboard, §2.0). CÓ mốc thưởng về sau nhưng CHƯA làm
// ("chưa đủ logic"); xếp hạng + chỉ số chất lượng (tầng B/C — calibration đánh giá↔ET, precision
// chuông, value-added) còn phải nghĩ — nói thẳng trên màn thay vì để GV đoán.
import { useEffect, useState } from 'react'
import { gvDashboard, type GvDash } from '../../lib/gvdash'
import { homNayVN, ddmmVN } from '../../lib/tuan'

const TAB_TEN: Record<string, string> = { ingame: 'Bài trên lớp', danhgia: 'Đánh giá sau buổi' }
const LY_DO_TEN: Record<string, string> = { tre: 'đóng muộn', no_qua_han: 'đang nợ quá hạn' }

function ymCong(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export default function DashGv() {
  const ymNay = homNayVN().slice(0, 7)
  const [ym, setYm] = useState(ymNay)
  const [data, setData] = useState<GvDash | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { (async () => {
    setLoading(true); setErr(null)
    try { setData(await gvDashboard(ym)) } catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoading(false) }
  })() }, [ym])

  const me = data?.me ?? {}
  const pct = me.pct ?? null
  const [thang, nam] = [ym.slice(5, 7), ym.slice(0, 4)]

  return (
    <div>
      <div className="bg-green-600 px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto flex max-w-[1000px] items-center gap-2">
          <p className="text-[15px] font-bold text-white">📈 Công việc của tôi</p>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setYm(ymCong(ym, -1))} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-white/80 active:bg-white/10">‹</button>
            <span className="text-[13px] font-semibold text-white">Tháng {thang}/{nam}</span>
            <button onClick={() => setYm(ymCong(ym, 1))} disabled={ym >= ymNay} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-white/80 active:bg-white/10 disabled:opacity-30">›</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
        {loading ? <p className="text-[13px] text-slate-400">Đang tính…</p>
          : err ? <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>
          : !data || !me.tong ? <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">Tháng này chưa có buổi nào của lớp bạn phụ trách.</p>
          : (
          <div className="flex flex-col gap-3">
            {/* BAR ĐẠT CHUẨN (tầng A) */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-slate-800">{pct == null ? '—' : `${pct}%`}</span>
                <span className="text-[13px] font-semibold text-slate-500">đạt chuẩn · {me.dat ?? 0}/{me.den_han ?? 0} việc đến hạn</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full transition-all ${(pct ?? 0) >= 80 ? 'bg-green-500' : (pct ?? 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${pct ?? 0}%` }} />
              </div>
              <p className="mt-2 text-[12.5px] text-slate-500">Việc = <b>Đánh giá sau buổi</b> + <b>Chấm bài trên lớp</b> mỗi buổi thường, hạn hết ngày buổi. Đóng → mở lại sửa → đóng lại: tính LẦN ĐÓNG CUỐI.</p>
            </div>

            {/* 4 SỐ */}
            <div className="grid grid-cols-4 gap-2">
              <StatBox n={me.tong ?? 0} label="Được giao" cls="text-slate-700" />
              <StatBox n={me.dat ?? 0} label="Đạt chuẩn" cls="text-emerald-600" />
              <StatBox n={me.khong_dat ?? 0} label="Không đạt" cls="text-rose-600" />
              <StatBox n={me.cho ?? 0} label="Đang chờ" cls="text-slate-400" />
            </div>

            {/* VIỆC KHÔNG ĐẠT */}
            {data.khongDat.length > 0 && (
              <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                <p className="mb-1.5 text-[14px] font-bold text-slate-800">Việc chưa đạt chuẩn ({data.khongDat.length})</p>
                {data.khongDat.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 border-t border-slate-100 py-1.5 first:border-0 text-[12.5px]">
                    <span className="font-semibold text-slate-700">{v.ten_lop}</span>
                    <span className="text-slate-400">{ddmmVN(v.ngay)} · {TAB_TEN[v.tab] ?? v.tab}</span>
                    <span className="ml-auto rounded bg-rose-50 px-1.5 py-0.5 font-semibold text-rose-600">{LY_DO_TEN[v.ly_do ?? ''] ?? v.ly_do}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tầng B/C + mốc thưởng — nói thẳng là ĐANG PHÁT TRIỂN (chốt ③/④ 31/08) */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3.5">
              <p className="text-[13px] font-bold text-slate-600">🔜 Sắp có</p>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                Mốc <b>thưởng tháng</b> + xếp hạng + bộ chỉ số <b>chất lượng đánh giá</b> (độ khớp đánh giá của bạn với kết quả ET/MT sau đó,
                chất lượng báo động bổ trợ…) đang được thống nhất — sẽ bật ở đây khi chốt xong.</p>
            </div>
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
