// DashTa — "📈 Của tôi": dashboard công việc TA theo THÁNG (CEO chốt 30/08 đêm).
// Bar = việc ĐẠT CHUẨN / việc đã đến hạn (chậm = không đạt · chất lượng <80 = không đạt).
// 100% + ≥10 việc = mốc THƯỞNG TIỀN (hiện rõ trên bar). Xếp hạng: thấy MÌNH + TOP 3
// (ngưỡng ≥10 việc — chốt ③). Mọi số tính ở fn_ta_dashboard (§2.0).
import { useEffect, useState } from 'react'
import { taDashboard, type TaDash } from '../../lib/tadash'
import { homNayVN, ddmmVN } from '../../lib/tuan'

const TAB_TEN: Record<string, string> = { ingame: 'Bài trên lớp', et: 'Chấm ET', btvn: 'Chấm BTVN' }
const LY_DO_TEN: Record<string, string> = { tre: 'đóng muộn', no_qua_han: 'đang nợ quá hạn', chat_luong: 'chất lượng chưa đạt' }

function ymCong(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export default function DashTa() {
  const ymNay = homNayVN().slice(0, 7)
  const [ym, setYm] = useState(ymNay)
  const [data, setData] = useState<TaDash | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { (async () => {
    setLoading(true); setErr(null)
    try { setData(await taDashboard(ym)) } catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoading(false) }
  })() }, [ym])

  const me = data?.me ?? {}
  const pct = me.pct ?? null
  const datMoc = !!me.dat_moc_thuong
  const [thang, nam] = [ym.slice(5, 7), ym.slice(0, 4)]

  return (
    <div>
      <div className="bg-teal-600 px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
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
          : !data || !me.tong ? <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">Tháng này chưa có việc chấm nào được giao.</p>
          : (
          <div className="flex flex-col gap-3">
            {/* BAR ĐẠT CHUẨN + MỐC THƯỞNG */}
            <div className={`rounded-2xl border p-4 shadow-sm ${datMoc ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50' : 'border-slate-200/70 bg-white'}`}>
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-slate-800">{pct == null ? '—' : `${pct}%`}</span>
                <span className="text-[13px] font-semibold text-slate-500">đạt chuẩn · {me.dat ?? 0}/{me.den_han ?? 0} việc đến hạn</span>
              </div>
              <div className="relative h-4 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : (pct ?? 0) >= 80 ? 'bg-teal-500' : (pct ?? 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${pct ?? 0}%` }} />
                {/* vạch mốc thưởng 100% */}
                <span className="absolute right-0 top-0 h-full w-[3px] bg-amber-400" />
              </div>
              <p className={`mt-2 text-[12.5px] font-semibold ${datMoc ? 'text-amber-700' : 'text-slate-500'}`}>
                {datMoc
                  ? '🎁 ĐẠT MỐC 100% — tháng này có THƯỞNG THÊM! Giữ vững tới hết tháng nhé.'
                  : pct === 100
                    ? `🎯 Đang 100% — đủ ${data.nguongXepHang} việc đến hạn là chạm mốc thưởng (hiện ${me.den_han}/${data.nguongXepHang}).`
                    : `🎁 Mốc thưởng thêm = 100% đạt chuẩn (≥${data.nguongXepHang} việc). ${me.khong_dat ? `Tháng này đã lỡ ${me.khong_dat} việc.` : ''}`}
              </p>
            </div>

            {/* 4 SỐ */}
            <div className="grid grid-cols-4 gap-2">
              <StatBox n={me.tong ?? 0} label="Được giao" cls="text-slate-700" />
              <StatBox n={me.dat ?? 0} label="Đạt chuẩn" cls="text-emerald-600" />
              <StatBox n={me.khong_dat ?? 0} label="Không đạt" cls="text-rose-600" />
              <StatBox n={me.cho ?? 0} label="Đang chờ" cls="text-slate-400" />
            </div>

            {/* XẾP HẠNG: mình + top 3 */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
              <p className="mb-2 text-[14px] font-bold text-slate-800">🏆 Xếp hạng trợ giảng tháng {thang}
                {data.rank ? <span className="ml-2 rounded-full bg-teal-600 px-2.5 py-0.5 text-[13px] font-bold text-white">Bạn: #{data.rank}/{data.tongTaXepHang}</span>
                  : <span className="ml-2 text-[11.5px] font-medium text-slate-400">(cần ≥{data.nguongXepHang} việc đến hạn để vào bảng — bạn đang {me.den_han ?? 0})</span>}
              </p>
              {data.top.length === 0 ? <p className="text-[12.5px] text-slate-400">Chưa ai đủ {data.nguongXepHang} việc trong tháng.</p>
                : data.top.map((t, i) => (
                  <div key={t.ho_ten} className="flex items-center gap-2 border-t border-slate-100 py-1.5 first:border-0">
                    <span className="text-[16px]">{['🥇', '🥈', '🥉'][i]}</span>
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-slate-700">{t.ho_ten}</span>
                    <span className="text-[13px] font-bold text-slate-800">{t.pct ?? '—'}%</span>
                    <span className="text-[11.5px] text-slate-400">({t.dat}/{t.den_han})</span>
                  </div>
                ))}
            </div>

            {/* VIỆC KHÔNG ĐẠT — biết mất điểm ở đâu */}
            {data.khongDat.length > 0 && (
              <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                <p className="mb-1.5 text-[14px] font-bold text-slate-800">Việc chưa đạt chuẩn ({data.khongDat.length})</p>
                {data.khongDat.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 border-t border-slate-100 py-1.5 first:border-0 text-[12.5px]">
                    <span className="font-semibold text-slate-700">{v.ten_lop}</span>
                    <span className="text-slate-400">{ddmmVN(v.ngay)} · {TAB_TEN[v.tab] ?? v.tab}</span>
                    <span className={`ml-auto rounded px-1.5 py-0.5 font-semibold ${v.ly_do === 'chat_luong' ? 'bg-violet-50 text-violet-700' : 'bg-rose-50 text-rose-600'}`}>{LY_DO_TEN[v.ly_do ?? ''] ?? v.ly_do}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="px-1 text-[11px] text-slate-400">Đạt chuẩn = đóng đúng hạn + chất lượng duyệt ≥{data.nguongChatLuong}. Đóng → mở lại sửa → đóng lại: tính theo LẦN ĐÓNG CUỐI.</p>
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
