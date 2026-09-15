// Tab QUẢN TRỊ — chỉ ghế học thuật của môn (hoặc admin), DB kiểm lại (fn_giaibai_dashboard). Khác "Thống kê"
// (chỉ bài ĐÃ DUYỆT theo tháng): đây là ảnh chụp SỐNG — mỗi người trong môn đang giữ/quá hạn/chờ duyệt bao
// nhiêu câu ngay lúc này (kể cả người chưa nhận câu nào), cộng luỹ kế đã duyệt/từ chối 3 lần/đã trả.
// Kèm 2 kho đang chờ người: "Giải" (thiếu cả 2) · "Hoàn thiện" (Claude đã giải, chưa ai nhận) — Thùy 06/09.
import { useEffect, useState } from 'react'
import { dashboard, demPool, nhanhCuaMon, type DashboardHang, type DemPool } from '../../lib/giaibai'

export default function Dashboard({ mon, me, refreshKey }: { mon: string; me: string; refreshKey: number }) {
  const [rows, setRows] = useState<DashboardHang[]>([])
  const [choGiai, setChoGiai] = useState<DemPool[]>([])
  const [choHoanThien, setChoHoanThien] = useState<DemPool[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    const nhanh = nhanhCuaMon(mon)
    try {
      const [d, g, h] = await Promise.all([dashboard(nhanh, me), demPool(nhanh, 'giai'), demPool(nhanh, 'hoan_thien')])
      setRows(d); setChoGiai(g); setChoHoanThien(h)
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [mon, refreshKey]) // eslint-disable-line

  const tong = (l: DemPool[]) => l.reduce((s, r) => s + r.so_bai, 0)
  const theoKhoi = (l: DemPool[]) => l.filter((r) => r.so_bai > 0).sort((a, b) => a.khoi.localeCompare(b.khoi, 'vi', { numeric: true })).map((r) => `K${r.khoi} ${r.so_bai}`).join(' · ')
  const tongDangGiu = rows.reduce((s, r) => s + r.dang_giu, 0)
  const tongChoDuyet = rows.reduce((s, r) => s + r.cho_duyet, 0)
  const tongQuaHan = rows.reduce((s, r) => s + r.qua_han, 0)
  const dangLam = rows.filter((r) => r.dang_giu > 0 || r.cho_duyet > 0)

  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-[14px] font-semibold text-slate-800">Quản trị · môn {mon}</h2>
        <span className="text-[12px] text-slate-400">ảnh chụp lúc này — làm mới khi có thay đổi (nhận/nộp/duyệt) hoặc bấm nút</span>
        <button onClick={reload} disabled={loading} className="ml-auto rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">⟳ Làm mới</button>
      </div>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p> : (
        <>
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">✍️ Kho Giải — chờ người giải từ đầu</div>
              <div className="mt-0.5 text-2xl font-bold text-slate-900">{tong(choGiai)}</div>
              <div className="text-[11px] text-slate-400">{theoKhoi(choGiai) || 'không còn câu nào'} · câu thiếu cả đáp án lẫn lời giải chi tiết</div>
            </div>
            <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50/40 p-4 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-fuchsia-700">🤖 Kho Hoàn thiện — Claude đã giải, chờ người sửa</div>
              <div className="mt-0.5 text-2xl font-bold text-fuchsia-800">{tong(choHoanThien)}</div>
              <div className="text-[11px] text-slate-400">{theoKhoi(choHoanThien) || 'không còn câu nào'} · thêm bài bằng cách để Claude Code giải (scripts/hangdoi-giai.mjs)</div>
            </div>
          </div>
          <div className="mb-5 grid grid-cols-4 gap-3">
            <Kpi label="Người đang giải" value={dangLam.length} sub={`/ ${rows.length} người có môn ${mon}`} />
            <Kpi label="Đang giữ" value={tongDangGiu} sub="bài, tính cả toàn team" />
            <Kpi label="Chờ duyệt" value={tongChoDuyet} sub="cần học thuật xử lý" tone={tongChoDuyet > 0 ? 'amber' : undefined} />
            <Kpi label="Quá hạn" value={tongQuaHan} sub="đang giữ nhưng hết 48h" tone={tongQuaHan > 0 ? 'rose' : undefined} />
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-[13px]">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Người</th>
                  <th className="px-3 py-2 text-right" title="dang_giai + can_sua, chưa quá hạn">Đang giữ</th>
                  <th className="px-3 py-2 text-right" title="đang giữ nhưng đã hết hạn 48h">Quá hạn</th>
                  <th className="px-3 py-2 text-right">Chờ duyệt</th>
                  <th className="px-3 py-2 text-right" title="luỹ kế mọi thời gian">Đã duyệt</th>
                  <th className="px-3 py-2 text-right" title="bị từ chối đủ 3 lần, đã về kho chung">Từ chối 3 lần</th>
                  <th className="px-3 py-2 text-right">Đã trả</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.nhan_su_id} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-800">{r.ho_ten}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${r.dang_giu > 0 ? 'text-indigo-700' : 'text-slate-300'}`}>{r.dang_giu || ''}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${r.qua_han > 0 ? 'text-rose-600' : 'text-slate-300'}`}>{r.qua_han || ''}</td>
                    <td className={`px-3 py-2 text-right ${r.cho_duyet > 0 ? 'font-semibold text-amber-600' : 'text-slate-300'}`}>{r.cho_duyet || ''}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{r.da_duyet || ''}</td>
                    <td className={`px-3 py-2 text-right ${r.tu_choi_3 > 0 ? 'text-rose-500' : 'text-slate-300'}`}>{r.tu_choi_3 || ''}</td>
                    <td className="px-3 py-2 text-right text-slate-400">{r.da_tra || ''}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={7} className="px-3 py-6 text-center text-slate-400">Chưa có ai được gán môn {mon}.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Số liệu bài đã duyệt theo THÁNG (để tính thưởng/top 3) xem tab Thống kê.</p>
        </>
      )}
    </div>
  )
}

function Kpi({ label, value, sub, tone }: { label: string; value: number; sub: string; tone?: 'amber' | 'rose' }) {
  const toneCls = tone === 'amber' ? 'text-amber-600' : tone === 'rose' ? 'text-rose-600' : 'text-slate-900'
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-0.5 text-2xl font-bold ${toneCls}`}>{value}</div>
      <div className="text-[11px] text-slate-400">{sub}</div>
    </div>
  )
}
