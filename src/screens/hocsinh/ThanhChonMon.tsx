// ============================================================================
// ThanhChonMon — thanh chọn MÔN ở màn chính app HS (28/09, vụ Gia Khiêm: em học Toán + KHTN + Anh mà
// app chỉ chạy theo KHTN). Chỉ hiện khi em đang học ≥2 môn — em 1 môn không thấy gì, app y như cũ.
// Component chỉ VẼ: danh sách môn do DB trả (hs_lop_mon_cua_toi), màu do màn cha đưa qua `nut` để hợp
// từng bản Home (v4 pastel · 9–12 theo skin · cấp 1 desktop) — không `if` theo bản Home ở đây.
// ============================================================================
import type { CSSProperties } from 'react'
import type { LopMonHS } from '../../lib/tuluyen'

export default function ThanhChonMon({ mons, mon, onChon, nut, className }: {
  mons: LopMonHS[]; mon: string | null; onChon: (mon: string) => void
  nut: (chon: boolean) => CSSProperties; className?: string
}) {
  if (mons.length < 2) return null
  return (
    <div role="tablist" aria-label="Chọn môn học" className={`flex shrink-0 gap-1.5 overflow-x-auto ${className ?? ''}`}>
      {mons.map((m) => (
        <button key={m.mon} role="tab" aria-selected={m.mon === mon} onClick={() => onChon(m.mon)}
          className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-bold transition active:scale-95"
          style={nut(m.mon === mon)}>
          {m.mon}
        </button>
      ))}
    </div>
  )
}
