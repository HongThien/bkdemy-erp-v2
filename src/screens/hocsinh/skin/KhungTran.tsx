// THẺ CÂU HỎI TRONG MÀN ĐẤU ("bảng phép") — Thùy 02/10: thẻ câu hỏi trong trận đang là thẻ app thường + font văn phòng, "không mang vibe game".
// Tham chiếu: khung hội thoại/thẻ kỹ năng Genshin · Star Rail (viền kép + góc hoa văn, nền đặc) và nút trả lời của Prodigy (phiến to, bấm lún).
// Mọi màu/font đọc biến của style (`Skin.tran` → --sk-tran-*), không gõ màu ở đây ngoài màu NGỮ NGHĨA đúng/sai của MAU.
// Dùng: LamBai khi nhúng trong trận (HocSinhApp) + trận xem thử (phieuluu/XemDau).
import type { CSSProperties, ReactNode } from 'react'
import { MAU } from './KhungHS'

export type TtTran = 'dung' | 'sai' | 'chon' | 'thuong'

export const FONT_TRAN = 'var(--sk-tran-font)'

/** Khung thẻ: nền đặc + viền kép + 4 góc hoa văn của style (nếu style có). */
export function TheTran({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ background: 'var(--sk-tran-nen)', boxShadow: 'var(--sk-tran-vien)', borderRadius: 'calc(var(--sk-radius) + 4px)', color: MAU.ink, fontFamily: FONT_TRAN }}>
      {(['left-1 top-1', 'right-1 top-1 rotate-90', 'bottom-1 right-1 rotate-180', 'bottom-1 left-1 -rotate-90'] as const).map((c) => (
        <span key={c} aria-hidden className={`pointer-events-none absolute h-7 w-7 bg-contain bg-no-repeat opacity-80 ${c}`} style={{ backgroundImage: 'var(--sk-goc)' }} />
      ))}
      {children}
      <CssTran />
    </div>
  )
}

/** Dải tên trên đầu thẻ ("Câu 3/8 · …"), chữ tiêu đề của style. */
export function DaiTran({ trai, phai }: { trai: ReactNode; phai?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-[16.5px] font-bold" style={{ fontFamily: 'var(--sk-font-head)', color: MAU.acc, letterSpacing: '0.02em' }}>
        <span aria-hidden className="inline-block h-2.5 w-2.5 rotate-45" style={{ background: MAU.acc }} />{trai}
      </span>
      {phai}
    </div>
  )
}

const VIEN: Record<TtTran, string> = { dung: MAU.dung, sai: MAU.sai, chon: MAU.acc, thuong: 'var(--sk-line)' }

/** Phiến đáp án: nền phiến + gờ dưới (bấm thì lún). Đúng: viền xanh + sáng; sai: viền đỏ + rung; đang chọn: viền vàng phát sáng. */
export const PHIEN = (t: TtTran): CSSProperties => ({
  background: 'var(--sk-tran-phien)', color: MAU.ink, fontFamily: FONT_TRAN, fontWeight: 600,
  borderRadius: 'calc(var(--sk-radius) + 2px)', border: `2px solid ${VIEN[t]}`,
  boxShadow: `0 4px 0 var(--sk-tran-phien-day)${t === 'chon' ? `, 0 0 14px ${MAU.acc}` : t === 'dung' ? `, 0 0 16px ${MAU.dung}` : ''}`,
})
export const CLS_PHIEN = (t: TtTran) => `tran-phien${t === 'sai' ? ' tran-rung' : ''}${t === 'dung' ? ' tran-sang' : ''}`

/** Viên ngọc hình thoi chứa chữ A/B/C/D. */
export function NgocChu({ t, chu }: { t: TtTran; chu: string }) {
  const nen = t === 'dung' ? MAU.dung : t === 'sai' ? MAU.sai : t === 'chon' ? MAU.acc : 'var(--sk-bg)'
  const chuMau = t === 'thuong' ? MAU.acc : t === 'chon' ? MAU.accInk : MAU.bg
  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
      <span aria-hidden className="absolute inset-1 rotate-45 rounded-[4px]" style={{ background: nen, border: `1.5px solid ${t === 'thuong' ? MAU.acc : nen}` }} />
      <span className="relative text-[17.5px] font-extrabold" style={{ color: chuMau, fontFamily: 'var(--sk-font-head)' }}>{chu}</span>
    </span>
  )
}

/** Nút chính trong trận ("Tung phép", "Đòn kế tiếp"): khối màu nhấn có gờ dưới, chữ đậm. */
export const NUT_TRAN: CSSProperties = {
  background: MAU.acc, color: MAU.accInk, fontFamily: FONT_TRAN, fontWeight: 800, letterSpacing: '0.02em',
  borderRadius: 'calc(var(--sk-radius) + 2px)', boxShadow: '0 4px 0 var(--sk-tran-phien-day)',
}

/** Hộp kết quả + lời giải ("cuộn bí kíp"). */
export const HOP_LOI_GIAI = (dung: boolean | null): CSSProperties => ({
  background: 'var(--sk-tran-phien)', borderRadius: 'calc(var(--sk-radius) + 2px)',
  border: `2px solid ${dung == null ? MAU.canhBao : dung ? MAU.dung : MAU.sai}`, fontFamily: FONT_TRAN,
})

function CssTran() {
  return <style>{`
.tran-phien{transition:transform .08s ease, box-shadow .08s ease, filter .15s ease}
.tran-phien:not(:disabled):hover{filter:brightness(1.12)}
.tran-phien:not(:disabled):active{transform:translateY(3px);box-shadow:0 1px 0 var(--sk-tran-phien-day)!important}
@media (prefers-reduced-motion: no-preference){
.tran-rung{animation:tran-rung .38s ease-in-out}
.tran-sang{animation:tran-sang 1.2s ease-out}
}
@keyframes tran-rung{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(2px)}}
@keyframes tran-sang{0%{filter:brightness(1.6)}100%{filter:brightness(1)}}
`}</style>
}
