// ============================================================================
// ThanhChonMon — thanh chọn MÔN của app HS. 28/09 (vụ Gia Khiêm: em học Toán + KHTN + Anh mà app chỉ chạy theo KHTN) làm
// bản đầu: dải nút nhỏ, chỉ hiện khi ≥2 môn. 01/10 (Thùy: "phải có chức năng chọn môn Toán, KHTN, Tiếng Anh; chuyển môn là
// chuyển các tính năng học tập") ⇒ môn là TRỤC NGOÀI CÙNG của góc học tập: Home vẽ bản `to` (các nút chia đều bề ngang,
// luôn hiện kể cả em 1 môn — nhãn của khối học tập bên dưới), kèm số việc đang chờ của TỪNG môn để em đứng ở môn này vẫn
// thấy môn kia có bài.
// Component chỉ VẼ: danh sách môn do DB trả (hs_mon_hoc_cua_toi), số việc do màn cha đếm, màu do màn cha đưa qua `nut`
// để hợp từng bản Home (9–12 theo skin · cấp 1 desktop) — không `if` theo bản Home ở đây. Thứ tự nút = `MON_APP_HS`.
// ============================================================================
import type { CSSProperties } from 'react'
import type { LopMonHS } from '../../lib/tuluyen'
import { MON_APP_HS } from '../../lib/mon'

const thuTu = (m: string) => { const i = (MON_APP_HS as readonly string[]).indexOf(m); return i < 0 ? 99 : i }

export default function ThanhChonMon({ mons, mon, onChon, nut, khung, dem, to, luonHien, className }: {
  mons: LopMonHS[]; mon: string | null; onChon: (mon: string) => void
  nut: (chon: boolean) => CSSProperties
  khung?: CSSProperties          // nền của cả thanh (bản `to`)
  dem?: Record<string, number>   // số việc đang chờ theo môn ⇒ chấm số trên nút môn KHÁC môn đang chọn
  to?: boolean                   // bản lớn chia đều bề ngang (Home) — mặc định dải nút nhỏ (Hồ sơ…)
  luonHien?: boolean             // hiện cả khi em chỉ học 1 môn
  className?: string
}) {
  if (mons.length === 0 || (mons.length < 2 && !luonHien)) return null
  const ds = [...mons].sort((a, b) => thuTu(a.mon) - thuTu(b.mon))
  return (
    <div role="tablist" aria-label="Chọn môn học"
      className={`${to ? 'grid gap-1 p-1' : 'flex gap-1.5 overflow-x-auto'} shrink-0 ${className ?? ''}`}
      style={to ? { gridTemplateColumns: `repeat(${ds.length}, minmax(0, 1fr))`, ...khung } : khung}>
      {ds.map((m) => {
        const chon = m.mon === mon
        const n = chon ? 0 : dem?.[m.mon] ?? 0
        return (
          <button key={m.mon} role="tab" aria-selected={chon} onClick={() => onChon(m.mon)}
            className={`relative shrink-0 whitespace-nowrap rounded-full font-bold transition active:scale-95 ${to ? 'flex min-w-0 flex-col items-center justify-center px-2 py-2 leading-tight' : 'px-3.5 py-1.5 text-[14.5px]'}`}
            style={nut(chon)}>
            <span className={to ? 'max-w-full truncate text-[16.5px] md:text-[18.5px]' : undefined}>{m.mon}</span>
            {to && m.ten_lop && <span className="max-w-full truncate text-[12px] font-semibold opacity-75 md:text-[13px]">{m.ten_lop}</span>}
            {n > 0 && (
              <span className="absolute -right-0.5 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[12px] font-extrabold"
                style={{ background: 'var(--sk-badge)', color: 'var(--sk-badge-ink)' }} aria-label={`${n} việc đang chờ`}>{n}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
