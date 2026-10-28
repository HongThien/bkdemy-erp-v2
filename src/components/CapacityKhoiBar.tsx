// Dải "Capacity theo khối" của bổ trợ yếu (Thùy 27/10): Capacity = 40% × tổng đơn vị trong lịch bổ trợ (lịch trực) của khối.
// Chỉ hiển thị, không chặn. Dùng ở Duyệt bổ trợ + Xếp bổ trợ. `nap` đổi giá trị ⇒ nạp lại (sau khi duyệt / xếp).
import { useEffect, useState } from 'react'
import { layCapacityKhoi, type CapacityKhoi } from '../lib/botro_yeu'

export default function CapacityKhoiBar({ mon, khoi, onChon, nap }: { mon?: string; khoi: string; onChon: (k: string) => void; nap?: number }) {
  const [ds, setDs] = useState<CapacityKhoi[] | null>(null)
  useEffect(() => { layCapacityKhoi(mon || undefined).then(setDs).catch(() => {}) }, [mon, nap])
  if (!ds || ds.length === 0) return null
  return (
    <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px]"
      title="Capacity khối = 40% × tổng đơn vị bổ trợ trong lịch bổ trợ (lịch trực hiệu lực) của khối. Đã dùng = đơn vị các case đang bổ trợ (L1 = 1, L2/L3 = 4). Chỉ để xem — không chặn duyệt / xếp.">
      <span className="font-semibold text-slate-500">Capacity theo khối (đơn vị):</span>
      {ds.map((k) => {
        const vuot = k.dung > k.capacity
        return (
          <button key={k.khoi} onClick={() => onChon(khoi === k.khoi ? '' : k.khoi)}
            className={`rounded-full px-2.5 py-0.5 font-bold ${vuot ? 'bg-rose-600 text-white' : k.dung >= k.capacity * 0.8 ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300' : 'border border-slate-300 bg-white text-slate-700'} ${khoi === k.khoi ? 'outline outline-2 outline-indigo-500' : ''}`}>
            K{k.khoi} {k.dung}/{k.capacity}
          </button>)
      })}
    </div>
  )
}
