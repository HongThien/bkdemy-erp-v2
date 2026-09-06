// BỘ PRIMITIVE "OPS" — redesign app Vận hành 07/09 (CEO gửi handoff ops1-6.png + kit SVG "BK_TA_7_SCREEN"
// — tên gói lấy nhầm từ khuôn TA nhưng NỘI DUNG là 7 màn OPS thật: Hôm nay/Điểm danh/Report & Báo tan/
// Chuẩn bị phòng/Test đầu vào/Quà/Của tôi). Khác phong cách "tranh vẽ BK Academy" của khu Của tôi app TA:
// ở đây là card phẳng + gradient màu theo màn + nhân vật chibi SVG + bong bóng lời, không có backdrop tranh.
// Icon nav/module tự vẽ (đảm bảo cùng nét, recolor bằng currentColor) — mascot header dùng SVG thật của kit
// (public/ops-ui/**) cho đúng linh hồn thiết kế.
import type { ReactNode } from 'react'

// Token màu theo màn (đo từ ops1-6.png + 04_prep/07_my trong kit) — gradient đứng, tối dần xuống dưới.
export const OPS = {
  green: { grad: 'linear-gradient(180deg, #3FD07A 0%, #17A957 55%, #0E8A46 100%)', solid: '#16A34A', chip: '#E0FBE9', text: '#0E6B37' },
  blue: { grad: 'linear-gradient(180deg, #6DA8FF 0%, #3B82F6 55%, #2158D0 100%)', solid: '#3B82F6', chip: '#E1EBFF', text: '#1E44A8' },
  amber: { grad: 'linear-gradient(180deg, #FFDD8A 0%, #FBBF24 55%, #F2960B 100%)', solid: '#F59E0B', chip: '#FFF3D6', text: '#93600A' },
  purple: { grad: 'linear-gradient(180deg, #C6B4FF 0%, #9B7CF7 55%, #7C4DEB 100%)', solid: '#8B5CF6', chip: '#EEE6FF', text: '#5B32C9' },
  orange: { grad: 'linear-gradient(180deg, #FFC978 0%, #FB923C 55%, #EA6A0E 100%)', solid: '#F97316', chip: '#FFE9D2', text: '#9A3E10' },
  pink: { grad: 'linear-gradient(180deg, #FF9BB0 0%, #FB7185 55%, #E23A57 100%)', solid: '#FB7185', chip: '#FFE1E7', text: '#9F2244' },
  indigo: { grad: 'linear-gradient(180deg, #A9B6FF 0%, #6C7CF7 55%, #4C56D9 100%)', solid: '#6366F1', chip: '#E7E9FF', text: '#38399B' },
} as const
export type OpsTone = keyof typeof OPS
export const OA = (n: string) => `/ops-ui/${n}` // asset SVG từ kit handoff (public/ops-ui/**)

// ── icon nav/module tự vẽ, nét đều — recolor qua `color` (currentColor) ──────────────────────────
export function IcoHome({ cls = 'h-6 w-6' }: { cls?: string }) {
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" /></svg>
}
export function IcoCheck({ cls = 'h-6 w-6' }: { cls?: string }) {
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><path d="M8 12.5l2.6 2.6L16.5 9" /></svg>
}
export function IcoMail({ cls = 'h-6 w-6' }: { cls?: string }) {
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" /></svg>
}
export function IcoBroom({ cls = 'h-6 w-6' }: { cls?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3l6 6-6.5 6.5" />
      <path d="M12.5 8.5L5 16c-1.2 1.2-1.2 2.4-1.5 4.5 2.1-.3 3.3-.3 4.5-1.5l7.5-7.5" />
      <path d="M4 20.5l2-2" />
    </svg>
  )
}
export function IcoPencil({ cls = 'h-6 w-6' }: { cls?: string }) {
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l1-4.2L15.5 5.3a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19 4 20z" /><path d="M13.5 6.8l3.7 3.7" /></svg>
}
export function IcoGift({ cls = 'h-6 w-6' }: { cls?: string }) {
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="9" width="17" height="11" rx="1.5" /><path d="M3.5 9h17M12 9v11" /><path d="M12 9c-1.5-4-6-5-6-2 0 1.5 2 2 6 2zM12 9c1.5-4 6-5 6-2 0 1.5-2 2-6 2z" /></svg>
}
export function IcoChart({ cls = 'h-6 w-6' }: { cls?: string }) {
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M4 20h16" /></svg>
}
export function IcoChevronLeft({ cls = 'h-5 w-5' }: { cls?: string }) {
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
}
export function IcoCalendar({ cls = 'h-5 w-5' }: { cls?: string }) {
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
}
export function IcoPower({ cls = 'h-5 w-5' }: { cls?: string }) {
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v7" /><path d="M7 6.5a7 7 0 1 0 10 0" /></svg>
}

// ── Back button tròn (icon chevron trắng trên nền mờ) — dùng trên mọi hero màu ──────────────────
export function OpsBack({ onClick, dark }: { onClick: () => void; dark?: boolean }) {
  return (
    <button onClick={onClick} aria-label="Quay lại"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:scale-95 ${dark ? 'bg-black/10 text-[#16224D]' : 'bg-white/25 text-white'}`}>
      <IcoChevronLeft />
    </button>
  )
}

// ── HERO gradient dùng chung: back(tuỳ) · title(tuỳ — bỏ trống khi nội dung bên dưới đã có tiêu đề
//    riêng, ví dụ 3 màn tái dùng ERP, tránh lặp chữ) · nhân vật + bong bóng lời(tuỳ) · slot dưới ──────
export function OpsHero({ tone, title, onBack, character, characterSize = 92, bubble, right, children }: {
  tone: OpsTone; title?: string; onBack?: () => void; character?: string; characterSize?: number; bubble?: string; right?: ReactNode; children?: ReactNode
}) {
  const c = OPS[tone]
  return (
    <div className="relative overflow-hidden px-3 pb-3" style={{ paddingTop: 'max(0.6rem, env(safe-area-inset-top))', background: c.grad }}>
      <span className="pointer-events-none absolute right-9 top-3 text-[13px] text-white/50">✦</span>
      <span className="pointer-events-none absolute right-24 top-10 text-[10px] text-white/40">✦</span>
      {(title || onBack || right) && (
        <div className="relative mx-auto flex max-w-[760px] items-center gap-2">
          {onBack && <OpsBack onClick={onBack} />}
          {title && <p className="min-w-0 flex-1 truncate text-[19px] font-extrabold text-white">{title}</p>}
          {!title && <div className="min-w-0 flex-1" />}
          {right}
        </div>
      )}
      {(character || bubble) && (
        <div className="relative mx-auto mt-1 flex max-w-[760px] items-end justify-end gap-2 pr-1">
          {bubble && <span className="mb-2 max-w-[150px] rounded-2xl rounded-br-sm bg-white px-3 py-1.5 text-center text-[12px] font-bold leading-snug shadow-sm" style={{ color: c.text }}>{bubble}</span>}
          {character && <img src={character} alt="" style={{ height: characterSize, width: characterSize }} className="shrink-0 object-contain drop-shadow" draggable={false} />}
        </div>
      )}
      {children}
    </div>
  )
}

// ── Empty state: illustration + tiêu đề + phụ (card trắng bo lớn) ────────────────────────────────
export function OpsEmptyState({ icon, title, sub }: { icon: ReactNode; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-8 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center">{icon}</div>
      <p className="mt-2 text-[15px] font-extrabold text-[#16224D]">{title}</p>
      {sub && <p className="mt-1 text-[12.5px] leading-snug text-[#6B7AAE]">{sub}</p>}
    </div>
  )
}

// ── Segmented pill tabs (Chưa mở/Đã mở…) dùng chung các màn danh sách ────────────────────────────
export function OpsSegmented<T extends string>({ value, onChange, items, tone }: { value: T; onChange: (v: T) => void; items: { key: T; label: string }[]; tone: OpsTone }) {
  const c = OPS[tone]
  return (
    <div className="flex gap-1 rounded-2xl bg-white p-1 shadow-sm">
      {items.map((it) => (
        <button key={it.key} onClick={() => onChange(it.key)}
          className="flex-1 rounded-xl py-2 text-[12.5px] font-bold transition"
          style={value === it.key ? { background: c.chip, color: c.text } : { color: '#9AA5C4' }}>{it.label}</button>
      ))}
    </div>
  )
}

// ── Card dòng việc phẳng: icon vuông màu · tiêu đề · phụ · phải ──────────────────────────────────
export function OpsRow({ icon, tone, title, sub, right, onClick }: { icon: ReactNode; tone: OpsTone; title: ReactNode; sub?: ReactNode; right?: ReactNode; onClick?: () => void }) {
  const c = OPS[tone]
  const Tag: any = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className={`flex min-h-[64px] w-full items-center gap-3 rounded-2xl bg-white px-3.5 py-3 text-left shadow-sm ${onClick ? 'active:bg-[#F7F9FF]' : ''}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: c.chip, color: c.solid }}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-bold text-[#16224D]">{title}</p>
        {sub && <p className="text-[12px] text-[#6B7AAE]">{sub}</p>}
      </div>
      {right}
      {onClick && <span className="text-[#C7D0E8]">›</span>}
    </Tag>
  )
}
