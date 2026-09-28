// ============================================================================
// KhungHS — BỘ KHUNG DÙNG CHUNG cho MỌI màn app HS (luật đầy đủ: design/STYLE-HS.md · kiểm: npm run check:style-hs). Thùy 29/09: "không chỉ đổi Home mà phải đổi toàn bộ các màn
// bên trong thành 1 style thống nhất"). Trước đó mỗi màn tự chép 1 bảng THEME kiểu Home v4 (nền mây pastel, chồng
// sách, khẩu hiệu viết tay, hồng/xanh theo giới tính) ⇒ Home đổi skin mà vào trong vẫn giao diện cũ.
//
// CÁCH HOẠT ĐỘNG: HocSinhApp gọi `useApSkinGoc(gd)` 1 lần ⇒ biến `--sk-*` của skin em đang dùng nằm trên <html>.
// Mọi màn chỉ việc dùng các mảnh ở đây (hoặc đọc `var(--sk-*)` qua hằng MAU/THE/HEAD). KHÔNG truyền skin qua prop,
// KHÔNG `if (skin === …)`, KHÔNG gõ mã màu cố định cho nền/chữ/viền (trừ màu NGỮ NGHĨA đúng/sai/cảnh báo trong MAU).
// Thùy 29/09: chỉ Anime RPG dùng thật (4 skin kia là thử) ⇒ mặc định RPG cho mọi em, kể cả cấp 1 (các màn bên trong).
// ============================================================================
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { laySkin, cheDoThat, bienCss, type GiaoDien } from './registry'

export const GD_MAC_DINH: GiaoDien = { skin: 'rpg', che_do: 'toi', hinh_nen: 'mac_dinh' } // Thùy 29/09: chỉ RPG dùng thật
export const GD_CAP1: GiaoDien = GD_MAC_DINH

export function useMedia(q: string): boolean {
  const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null
  const [khop, setKhop] = useState(!!mq?.matches)
  useEffect(() => {
    if (!mq) return
    const f = (e: MediaQueryListEvent) => setKhop(e.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [mq])
  return khop
}
export const useHeThongToi = () => useMedia('(prefers-color-scheme: dark)')
export const useManDoc = () => useMedia('(orientation: portrait)')

function ganBien(gd: GiaoDien, heThongToi: boolean, manDoc: boolean) {
  const skin = laySkin(gd.skin)
  const v = bienCss(skin, cheDoThat(skin, gd.che_do, heThongToi), gd.hinh_nen, manDoc)
  const el = document.documentElement
  for (const [k, val] of Object.entries(v)) {
    if (k.startsWith('--')) el.style.setProperty(k, val)
    else if (k === 'colorScheme') el.style.colorScheme = val
  }
}

// Gọi 1 lần lúc app HS khởi động (main-hs.tsx): màn hiện TRƯỚC HocSinhApp (đổi mật khẩu bắt buộc, đang tải…) cũng có biến skin.
export function ganSkinMacDinh() {
  const mm = (q: string) => typeof window !== 'undefined' && !!window.matchMedia?.(q).matches
  ganBien(GD_MAC_DINH, mm('(prefers-color-scheme: dark)'), mm('(orientation: portrait)'))
}

// Gắn biến skin lên <html> — mọi màn (kể cả màn con render ở nhánh khác) đọc được. Đổi skin/chế độ/xoay máy ⇒ gắn lại.
export function useApSkinGoc(gd: GiaoDien) {
  const heThongToi = useHeThongToi()
  const manDoc = useManDoc()
  useEffect(() => { ganBien(gd, heThongToi, manDoc) }, [gd.skin, gd.che_do, gd.hinh_nen, heThongToi, manDoc])
}

// ── Hằng style (1 nguồn — HomeHS912 cũng dùng) ────────────────────────────────
export const MAU = {
  ink: 'var(--sk-ink)', muted: 'var(--sk-muted)', line: 'var(--sk-line)',
  acc: 'var(--sk-acc)', accInk: 'var(--sk-acc-ink)', surface: 'var(--sk-surface)', surface2: 'var(--sk-surface2)',
  badge: 'var(--sk-badge)', badgeInk: 'var(--sk-badge-ink)', bg: 'var(--sk-bg)',
  // Màu NGỮ NGHĨA (đúng/sai/cảnh báo) — cố định mọi skin, đủ tương phản trên nền sáng lẫn tối.
  dung: '#22a06b', sai: '#e5484d', canhBao: '#e0901e',
}
export const THE: CSSProperties = {
  background: 'var(--sk-surface)', border: 'var(--sk-card-border)', borderLeft: 'var(--sk-card-left)',
  borderRadius: 'var(--sk-radius)', boxShadow: 'var(--sk-card-shadow)', clipPath: 'var(--sk-card-clip)',
  backdropFilter: 'var(--sk-blur)', WebkitBackdropFilter: 'var(--sk-blur)', color: 'var(--sk-ink)',
}
// Thẻ không cắt góc / không viền nhấn trái — cho nút tròn, ô nhỏ, input.
export const THE_TRON: CSSProperties = { ...THE, clipPath: 'none', borderLeft: 'var(--sk-card-border)' }
export const HEAD: CSSProperties = {
  fontFamily: 'var(--sk-font-head)', textTransform: 'var(--sk-head-case)' as CSSProperties['textTransform'], letterSpacing: 'var(--sk-head-track)',
}

// ── Khung trang ─────────────────────────────────────────────────────────────
// Thay mọi `Khung`/THEME.bg + decor + quote cũ. rong: 'thuong' (điện thoại 430 · iPad 820 · PC 1180) | 'hep' (màn đọc/làm bài 720).
export function ManHS({ children, rong = 'thuong', className = '' }: { children: ReactNode; rong?: 'thuong' | 'hep'; className?: string }) {
  const w = rong === 'hep' ? 'max-w-[720px]' : 'max-w-[430px] md:max-w-[820px] lg:max-w-[1180px]'
  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--sk-page)', backgroundAttachment: 'fixed', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)', textShadow: 'var(--sk-chu-bong)' }}>
      <div className={`relative mx-auto flex ${w} flex-col gap-3 px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))] ${className}`}>
        {children}
      </div>
    </div>
  )
}

// Đầu trang: nút quay lại tròn + tiêu đề (font đầu của skin) + dòng phụ + chỗ phải (nút/nhãn).
export function DauTrangHS({ tieuDe, phu, onBack, phai }: { tieuDe: ReactNode; phu?: ReactNode; onBack?: () => void; phai?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} aria-label="Quay lại" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[20px] active:scale-95" style={{ ...THE_TRON, borderRadius: '999px' }}>‹</button>
      )}
      <div className="min-w-0 flex-1 leading-tight">
        <h1 className="truncate text-[21px] font-bold" style={{ ...HEAD, color: 'var(--sk-ink)', textShadow: '0 1px 8px var(--sk-bg)' }}>{tieuDe}</h1>
        {phu && <p className="mt-0.5 truncate text-[12.5px]" style={{ color: 'var(--sk-muted)', textShadow: '0 1px 8px var(--sk-bg)' }}>{phu}</p>}
      </div>
      {phai}
    </div>
  )
}

// Thẻ: div thường, hoặc nút khi có onClick. tat = disabled (mờ, không bấm).
export function TheHS({ children, onClick, tat, className = '', style }: { children: ReactNode; onClick?: () => void; tat?: boolean; className?: string; style?: CSSProperties }) {
  const s: CSSProperties = { ...THE, ...style, ...(tat ? { opacity: 0.5 } : {}) }
  return onClick
    ? <button onClick={onClick} disabled={tat} className={`text-left transition active:scale-[0.99] ${className}`} style={s}>{children}</button>
    : <div className={className} style={s}>{children}</div>
}

// Nút chính (màu nhấn) / phụ (viền). Chỉ disable khi THIẾU DATA (CLAUDE §6), không vì state UI.
export function NutHS({ children, onClick, tat, phu, className = '', type = 'button' }: { children: ReactNode; onClick?: () => void; tat?: boolean; phu?: boolean; className?: string; type?: 'button' | 'submit' }) {
  const s: CSSProperties = phu
    ? { border: '1.5px solid var(--sk-line)', color: 'var(--sk-ink)', background: 'var(--sk-surface)', borderRadius: 'var(--sk-radius)', fontFamily: 'var(--sk-font-head)' }
    : { background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)', borderRadius: 'var(--sk-radius)', clipPath: 'var(--sk-card-clip)', fontFamily: 'var(--sk-font-head)' }
  return <button type={type} onClick={onClick} disabled={tat} className={`h-11 px-4 text-[15px] font-bold transition active:scale-[0.99] disabled:opacity-50 ${className}`} style={s}>{children}</button>
}

// Nhãn nhỏ (pill). mau: màu chữ/viền (mặc định màu nhấn); dac = tô đặc.
export function NhanHS({ children, mau = 'var(--sk-acc)', dac }: { children: ReactNode; mau?: string; dac?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-bold"
      style={dac ? { background: mau, color: 'var(--sk-acc-ink)' } : { border: `1px solid ${mau}`, color: mau }}>{children}</span>
  )
}

export function BadgeHS({ n }: { n: number }) {
  return <span className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold" style={{ background: 'var(--sk-badge)', color: 'var(--sk-badge-ink)' }}>{n}</span>
}

// Tiêu đề nhóm trong trang (chữ hoa nhỏ, màu mờ).
export function NhomHS({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--sk-muted)', textShadow: '0 1px 8px var(--sk-bg)' }}>{children}</p>
}

// Trạng thái rỗng / đang tải / lỗi — 1 kiểu cho mọi màn.
export function TrongHS({ children }: { children: ReactNode }) {
  return <TheHS className="px-4 py-6 text-center text-[14px]"><span style={{ color: 'var(--sk-muted)' }}>{children}</span></TheHS>
}
