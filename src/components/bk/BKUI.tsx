// BỘ PRIMITIVE "BK" cho khu Của tôi app mobile (CEO duyệt design 07/09 — handoff BK_TA_Claude_UI):
// tông pastel xanh-tím, tiêu đề bong bóng, thẻ pastel bo lớn, minh hoạ = emoji/vector (KHÔNG nhúng
// ảnh raster làm nền). Token: primary #2F73F6 · text #16224D · secondary #63709A · success #31C875
// · warning #FFB33D · danger #FF5D78. Dùng chung mọi app (TA trước, GV/OPS lắp sau).
import { useEffect, type ReactNode } from 'react'

export const BK = {
  primary: '#2F73F6', primaryDark: '#174DAF', text: '#16224D', sub: '#63709A',
  success: '#31C875', warning: '#FFB33D', danger: '#FF5D78',
} as const

// ── HERO: bầu trời + tiêu đề bong bóng + tagline + mascot ──────────────────
export function BKPageHeader({ title, tagline, onBack, mascot = '/bk-ui/mascot_wave.png', bubble }: {
  title: string; tagline?: string; onBack?: () => void; mascot?: string; bubble?: string   // mascot = URL PNG trong kit
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#CFE9FF] via-[#DDF4FF] to-[#EEF3FF]" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
      {/* mây + hoa trang trí (vector thuần) */}
      <span className="pointer-events-none absolute -left-6 top-10 h-16 w-28 rounded-full bg-white/70 blur-[1px]" />
      <span className="pointer-events-none absolute left-16 top-4 h-10 w-20 rounded-full bg-white/60" />
      <span className="pointer-events-none absolute right-8 top-12 h-14 w-24 rounded-full bg-white/60" />
      <span className="pointer-events-none absolute right-2 top-2 text-[16px] text-[#FFD84D]">✦</span>
      <span className="pointer-events-none absolute left-1/4 bottom-6 text-[12px] text-[#FFD84D]">✦</span>
      <span className="pointer-events-none absolute left-3 bottom-3 text-[22px]">🌸</span>
      <span className="pointer-events-none absolute right-24 bottom-2 text-[20px]">🌳</span>
      <div className="relative mx-auto flex max-w-[1000px] items-start px-4 pb-5">
        {onBack ? (
          <button onClick={onBack} aria-label="Quay lại"
            className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[22px] font-bold text-[#2F73F6] shadow-md active:scale-95">‹</button>
        ) : <span className="mt-1 text-[12px] font-extrabold text-[#2F73F6]">BK<br /><span className="text-[9px]">Academy</span></span>}
        <div className="min-w-0 flex-1 px-2 pt-1 text-center">
          <span className="text-[16px] text-[#FFD84D]">👑</span>
          <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-[#2F73F6]"
            style={{ textShadow: '0 3px 0 #fff, 0 6px 14px rgba(47,115,246,.25)' }}>{title}</h1>
          {tagline && <p className="mt-1 text-[12.5px] italic font-medium text-[#63709A]">{tagline}</p>}
        </div>
        <div className="relative mt-1 shrink-0">
          {bubble && <span className="absolute -left-6 -top-7 whitespace-nowrap rounded-2xl bg-white px-2.5 py-1 text-[10.5px] font-semibold text-[#2F73F6] shadow-sm">{bubble}</span>}
          <img src={mascot} alt="" className="h-[72px] w-[72px] object-contain drop-shadow" draggable={false} />
        </div>
      </div>
    </div>
  )
}

// ── THẺ HỒ SƠ: avatar · tên · tags · xu điểm · vòng % ─────────────────────
export function BKProfileSummary({ ten, anhUrl, tags, diem, pct, onPct, streak }: {
  ten: string; anhUrl?: string | null; tags: string[]; diem: number | null; pct: number | null | undefined; onPct?: () => void; streak?: number | null
}) {
  const tenGoi = ten.trim().split(/\s+/).pop() || 'bạn'
  return (
    <div className="mx-auto -mt-4 max-w-[1000px] px-4">
      <div className="rounded-3xl bg-white p-3.5 shadow-[0_4px_14px_rgba(22,34,77,.10)]">
        <div className="flex items-center gap-3">
          {anhUrl
            ? <img src={anhUrl} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover ring-4 ring-[#DDF4FF]" />
            : <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#DDF4FF] text-[24px] font-extrabold text-[#2F73F6] ring-4 ring-[#EEF3FF]">{tenGoi.charAt(0).toUpperCase()}</span>}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-extrabold text-[#16224D]">{ten}</p>
            <p className="truncate text-[11.5px] text-[#63709A]">Cùng nhau tạo nên giá trị tốt đẹp hơn! 💙</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {tags.map((t) => <span key={t} className="rounded-full bg-[#EEF3FF] px-2 py-0.5 text-[10.5px] font-semibold text-[#2F73F6]">{t}</span>)}
            </div>
          </div>
        </div>
        {/* 2 ô số xếp hàng riêng bên dưới — màn 375px không đủ chỗ đứng cạnh tên */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-2xl bg-[#EEF3FF] px-3 py-2">
            <img src="/bk-ui/coin_star.png" alt="" className="h-9 w-9 object-contain" draggable={false} />
            <div className="min-w-0 leading-tight">
              <p className="text-[10px] font-semibold text-[#63709A]">Điểm tích lũy</p>
              <p className="text-[20px] font-extrabold text-[#16224D]">{diem == null ? '—' : diem.toLocaleString('vi-VN')}</p>
              {streak != null && streak > 0 && <p className="text-[10px] font-semibold text-[#FF8A3D]">🔥 chuỗi {streak} ngày</p>}
            </div>
          </div>
          <button onClick={onPct} className="flex items-center gap-2 rounded-2xl bg-[#E8F9EF] px-3 py-2 text-left active:bg-[#d6f2e2]">
            <BKProgressRing pct={pct ?? 0} size={34} stroke={5} color={BK.success} />
            <div className="min-w-0 leading-tight">
              <p className="text-[10px] font-semibold text-[#63709A]">Hoàn thành nhiệm vụ</p>
              <p className="text-[20px] font-extrabold text-[#16224D]">{pct == null ? '—' : `${pct}%`}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── VÒNG % (SVG) ─────────────────────────────────────────────────────────────
export function BKProgressRing({ pct, size = 44, stroke = 6, color = BK.success, track = '#E9EEF8', children }: {
  pct: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode
}) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, p = Math.max(0, Math.min(100, pct))
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${(c * p) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      {children && <span className="absolute inset-0 flex items-center justify-center">{children}</span>}
    </span>
  )
}

// ── MENU CARD (lưới 2 cột) — illustration PNG bên trái ~45%, chữ bên phải, caption + nút mũi tên
// (UI kit IMPLEMENTATION_SPEC: dùng đúng PNG đã tách nền, KHÔNG emoji; gradient + accent theo card).
export type BKTone = 'yellow' | 'pink' | 'purple' | 'blue' | 'mint' | 'peach'
const TONE: Record<BKTone, { bg: string; border: string; chev: string; tag: string }> = {
  yellow: { bg: 'bg-[#FFF6D6]', border: 'border-[#FFE59A]', chev: 'bg-[#FFE59A] text-[#A66A00]', tag: 'text-[#C58A00]' },
  pink:   { bg: 'bg-[#FFE3EA]', border: 'border-[#FFC3D2]', chev: 'bg-[#FFC3D2] text-[#C0355A]', tag: 'text-[#E05A7C]' },
  purple: { bg: 'bg-[#EAE2FF]', border: 'border-[#D6C8FF]', chev: 'bg-[#D6C8FF] text-[#6A4BD6]', tag: 'text-[#8A6BF0]' },
  blue:   { bg: 'bg-[#DDF4FF]', border: 'border-[#BFE3FF]', chev: 'bg-[#BFE3FF] text-[#174DAF]', tag: 'text-[#2F73F6]' },
  mint:   { bg: 'bg-[#DDF7E8]', border: 'border-[#BDF0D6]', chev: 'bg-[#BDF0D6] text-[#1E8A52]', tag: 'text-[#2FA86A]' },
  peach:  { bg: 'bg-[#FFE7D6]', border: 'border-[#FFD3B1]', chev: 'bg-[#FFD3B1] text-[#B85A12]', tag: 'text-[#E07A2E]' },
}
export const BK_ASSET = (name: string) => `/bk-ui/${name}.png`
export function BKMenuCard({ image, title, sub, tagline, gradient, accent, onClick, disabled, badge }: {
  image: string; title: string; sub: string; tagline?: string
  gradient: [string, string]; accent: string; onClick?: () => void; disabled?: boolean; badge?: string
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="relative flex min-h-[124px] items-stretch overflow-hidden rounded-[22px] p-2.5 text-left shadow-[0_4px_14px_rgba(22,34,77,.10)] transition duration-100 active:scale-[.98] disabled:opacity-60"
      style={{ background: `linear-gradient(160deg, ${gradient[0]}, ${gradient[1]})`, boxShadow: '0 4px 14px rgba(22,34,77,.10), inset 0 1px 0 rgba(255,255,255,.7)' }}>
      <span className="pointer-events-none absolute left-2 top-1.5 text-[11px] text-[#FFD84D]">✦</span>
      <img src={image} alt="" className="w-[38%] shrink-0 self-center object-contain drop-shadow-sm" draggable={false} />
      <div className="flex min-w-0 flex-1 flex-col pl-1.5 pt-1">
        <p className="text-[15px] font-extrabold leading-tight text-[#16224D]">{title}</p>
        <p className="mt-0.5 text-[10.5px] leading-snug text-[#63709A]">{sub}</p>
        <div className="mt-auto flex items-end justify-between gap-1 pt-1.5">
          <span className="min-w-0 text-[9.5px] italic font-semibold leading-tight" style={{ color: accent }}>{tagline}</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white shadow-sm" style={{ background: accent }}>›</span>
        </div>
      </div>
      {/* badge đặt góc dưới-trái (trên vùng ảnh) để không đè tiêu đề ở màn 375px */}
      {badge && <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[9.5px] font-bold text-[#63709A] shadow-sm">{badge}</span>}
    </button>
  )
}

// ── Thẻ section / tile số / pill trạng thái / segmented ─────────────────────
export function BKSectionCard({ children, tone, className = '' }: { children: ReactNode; tone?: BKTone; className?: string }) {
  const bg = tone ? `${TONE[tone].bg} border ${TONE[tone].border}` : 'bg-white'
  return <div className={`rounded-3xl p-4 shadow-[0_4px_14px_rgba(22,34,77,.08)] ${bg} ${className}`}>{children}</div>
}
export function BKSectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return <div className="mb-2 flex items-center justify-between px-1"><p className="text-[17px] font-extrabold text-[#16224D]">{children}</p>{right}</div>
}
export type BKStatus = 'dat' | 'thieu' | 'thua' | 'cho' | 'nguy'
const PILL: Record<BKStatus, string> = {
  dat: 'bg-[#E8F9EF] text-[#1E8A52]', thua: 'bg-[#E8F9EF] text-[#1E8A52]',
  thieu: 'bg-[#FFF3D6] text-[#B87800]', nguy: 'bg-[#FFE3EA] text-[#C0355A]', cho: 'bg-[#EEF3FF] text-[#63709A]',
}
export function BKStatusPill({ status, children }: { status: BKStatus; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold ${PILL[status]}`}>{children}</span>
}
export function BKMetricTile({ icon, label, thuc, chuan, unit }: { icon: string; label: string; thuc: number; chuan: number; unit?: string }) {
  const lech = thuc - chuan
  const pct = chuan > 0 ? Math.round((100 * Math.min(thuc, chuan)) / chuan) : 100
  const color = lech >= 0 ? BK.success : lech >= -1 ? BK.warning : BK.danger
  return (
    <div className="rounded-2xl bg-white p-2.5 text-center shadow-[0_2px_8px_rgba(22,34,77,.06)]">
      <p className="text-[11px] font-semibold text-[#63709A]">{icon} {label}</p>
      <div className="mt-1.5 flex items-center justify-center gap-2">
        <BKProgressRing pct={pct} size={38} stroke={5} color={color} />
        <span className="text-[15px] font-extrabold text-[#16224D]">{thuc}<span className="text-[11px] font-semibold text-[#63709A]">/{chuan}{unit ?? ''}</span></span>
      </div>
      <div className="mt-1.5">
        {lech >= 0 ? <BKStatusPill status="dat">⭐ {lech === 0 ? 'Đủ chuẩn' : `Thừa ${fmt(lech)}`}</BKStatusPill>
          : <BKStatusPill status={lech >= -1 ? 'thieu' : 'nguy'}>❗ Thiếu {fmt(-lech)}</BKStatusPill>}
      </div>
    </div>
  )
}
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

export function BKSegmented<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { key: T; label: string; sub?: string; icon?: string }[] }) {
  return (
    <div className="flex gap-1 rounded-full bg-white p-1 shadow-[0_2px_8px_rgba(22,34,77,.06)]">
      {items.map((it) => (
        <button key={it.key} onClick={() => onChange(it.key)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 transition ${value === it.key ? 'bg-[#2F73F6] text-white shadow' : 'text-[#63709A]'}`}>
          {it.icon && <span className="text-[15px]">{it.icon}</span>}
          <span className="leading-tight">
            <span className="block text-[12.5px] font-bold">{it.label}</span>
            {it.sub && <span className={`block text-[9.5px] ${value === it.key ? 'text-white/80' : 'text-[#9AA5C4]'}`}>{it.sub}</span>}
          </span>
        </button>
      ))}
    </div>
  )
}

export function BKEmptyState({ icon = '🌱', children }: { icon?: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#BFE3FF] bg-white/70 px-4 py-6 text-center">
      <p className="text-[34px]">{icon}</p>
      <p className="mt-1 text-[12.5px] text-[#63709A]">{children}</p>
    </div>
  )
}

// Banner mascot động viên (cuối màn) — câu chữ đổi theo ngữ cảnh
export function BKMascotBanner({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="relative mt-3 flex items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-r from-[#DDF4FF] to-[#EEF3FF] p-3.5">
      <img src="/bk-ui/mascot_cheer.png" alt="" className="h-16 w-16 shrink-0 object-contain" draggable={false} />
      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-2xl bg-[#EAE2FF] px-3 py-1 text-[13px] font-bold text-[#6A4BD6]">{text}</span>
        {sub && <p className="mt-1 text-[11.5px] text-[#63709A]">{sub}</p>}
      </div>
      <span className="pointer-events-none absolute right-3 top-2 -rotate-6 text-[10px] italic font-semibold text-[#2F73F6]">Small TAs<br />Big Impact ♡</span>
    </div>
  )
}

// Bottom sheet nhẹ (không lib) — đóng khi bấm nền / Escape
export function BKBottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[#16224D]/40 p-2" onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-3xl rounded-b-2xl bg-white p-5 shadow-2xl" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))', maxHeight: '85vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <span className="mx-auto mb-3 block h-1.5 w-12 rounded-full bg-[#DDE4F3]" />
        {children}
      </div>
    </div>
  )
}
