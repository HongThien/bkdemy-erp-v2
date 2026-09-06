// Widget DÙNG CHUNG cho màn "Của tôi" 3 app TA/GV/OPS (CEO chốt 06/09 tối):
// · XepHangBlock — top 3 + hạng của tôi (dùng 2 lần/màn: RIÊNG cùng vai trò + CHUNG toàn BK).
// · ViecThangAccordion — danh sách việc trong tháng, ĐẠT lẫn KHÔNG ĐẠT đều liệt kê nhưng
//   ẨN chi tiết mặc định, bấm dòng mới xoè (CEO: "bình thường ẩn — click vào mới hiện chi tiết").
// Mọi số (pct/rank/top) đã tính sẵn ở Postgres — 2 component này chỉ hiển thị.
import { useState } from 'react'
import type { ViecItem, XepHangTop } from '../lib/xephang'
export type { ViecItem, XepHangTop }

export function XepHangBlock({ title, icon, rank, tongXepHang, top, nguongFinal, nguongTop, accentBg, accentText }: {
  title: string; icon: string
  rank: number | null; tongXepHang: number; top: XepHangTop[]
  nguongFinal: number; nguongTop: number
  accentBg: string; accentText: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
      <p className="mb-2 flex flex-wrap items-center gap-2 text-[14px] font-bold text-slate-800">
        <span>{icon} {title}</span>
        {rank
          ? <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-bold text-white ${accentBg}`}>Bạn: #{rank}/{tongXepHang}</span>
          : <span className="text-[11.5px] font-medium text-slate-400">(cần ≥{nguongFinal} việc/tháng, hoặc đang lọt top {nguongTop} khối lượng, mới vào bảng)</span>}
      </p>
      {!top.length ? <p className="text-[12.5px] text-slate-400">Chưa ai đủ điều kiện tháng này.</p>
        : top.map((t, i) => (
          <div key={t.ho_ten} className="flex items-center gap-2 border-t border-slate-100 py-1.5 first:border-0">
            <span className="text-[16px]">{['🥇', '🥈', '🥉'][i]}</span>
            <span className={`min-w-0 flex-1 truncate text-[13.5px] font-semibold ${accentText}`}>{t.ho_ten}</span>
            <span className="text-[13px] font-bold text-slate-800">{t.pct ?? '—'}%</span>
            <span className="text-[11.5px] text-slate-400">({t.dat}/{t.den_han})</span>
          </div>
        ))}
    </div>
  )
}

export function ViecThangAccordion({ items, tenViecLabel, tabTen, lyDoTen, fmtNgay }: {
  items: ViecItem[]; tenViecLabel: string
  tabTen: Record<string, string>; lyDoTen: Record<string, string>; fmtNgay: (s: string) => string
}) {
  const [open, setOpen] = useState<number | null>(null)
  if (!items.length) return null
  const soDat = items.filter((v) => v.kq === 'dat').length
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
      <p className="mb-1.5 text-[14px] font-bold text-slate-800">{tenViecLabel} trong tháng ({items.length}) · <span className="text-emerald-600">{soDat} đạt</span>{items.length - soDat > 0 && <> · <span className="text-rose-600">{items.length - soDat} không đạt</span></>}</p>
      <div className="divide-y divide-slate-100">
        {items.map((v, i) => (
          <div key={i}>
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-2 py-2 text-left">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${v.kq === 'dat' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-slate-700">{v.ten_lop}</span>
              <span className="text-[11px] text-slate-400">{fmtNgay(v.ngay)}</span>
              <span className="text-slate-300">{open === i ? '▲' : '▾'}</span>
            </button>
            {open === i && (
              <div className="mb-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[12px] text-slate-600">
                <p>{tabTen[v.tab] ?? v.tab} · {v.kq === 'dat'
                  ? <span className="font-semibold text-emerald-600">Đạt chuẩn</span>
                  : <span className="font-semibold text-rose-600">{lyDoTen[v.ly_do ?? ''] ?? v.ly_do ?? 'Không đạt'}</span>}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
