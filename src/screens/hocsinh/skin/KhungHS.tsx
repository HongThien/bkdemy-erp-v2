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
import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { laySkin, cheDoThat, bienCss, type GiaoDien } from './registry'
import type { NenManId, Skin } from './kieu'
import { datSkinDangAp, layLoi, useSkinDangAp, type LoiHS } from './loi'
import { layMonHienTai, ngheMonHienTai } from '../../../lib/tuluyen'

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
/** Lời chữ của style đang áp — formal gốc + phần style game ghi đè (skin/loi.ts). Màn KHÔNG so sánh id style, chỉ đọc lời. */
export function useLoi(): LoiHS { const id = useSkinDangAp(); return useMemo(() => layLoi(laySkin(id).loi), [id]) }

function ganBien(gd: GiaoDien, heThongToi: boolean, manDoc: boolean) {
  const skin = laySkin(gd.skin)
  datSkinDangAp(skin.id)
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

/** TRANG XEM THỬ (?xem=…, không đăng nhập): `&skin=<id>[&nen=<id>]` ⇒ gắn style đó NGAY (trước lần vẽ đầu — màn đọc `laySkin(null)` lúc khởi tạo
 *  thấy đúng style) rồi trả GiaoDien để trang gọi tiếp `useApSkinGoc` (xoay máy vẫn gắn lại). Không có `skin` ⇒ style mặc định. */
export function ganSkinXemThu(): GiaoDien {
  const q = new URLSearchParams(location.search)
  const gd: GiaoDien = { ...GD_MAC_DINH, skin: laySkin(q.get('skin') ?? GD_MAC_DINH.skin).id, hinh_nen: q.get('nen') ?? GD_MAC_DINH.hinh_nen }
  const mm = (m: string) => !!window.matchMedia?.(m).matches
  ganBien(gd, mm('(prefers-color-scheme: dark)'), mm('(orientation: portrait)'))
  return gd
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
// nen (Thùy 06/10): 'trong' = màn BÊN TRONG — nền ĐƠN SẮC/tối riêng của style (--sk-nen-trong), không tranh, cho đỡ rối (MẶC ĐỊNH) ·
// 'tranh' = màn BÊN NGOÀI — tranh nền của style (Home, khu Học tập). Chỉ màn ngoài mới xin 'tranh'.
/** Style ĐANG ÁP (đổi style ⇒ vẽ lại). Màn chỉ đọc thuộc tính khai trong Skin (anhBxh, nenMan…) — KHÔNG so sánh id style. */
export const useSkinHT = (): Skin => laySkin(useSkinDangAp())

// nenAnh (Đơn 16, 07/10): màn TRONG có ảnh nền trời đêm riêng nếu style khai nenMan[nenAnh]; không khai ⇒ giữ nền đơn sắc. Ngang/dọc theo hướng màn.
function NenAnh({ id }: { id: NenManId }) {
  const a = useSkinHT().nenMan?.[id]
  if (!a) return null
  return (
    <picture aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <source media="(orientation: portrait)" srcSet={a.doc} />
      <img src={a.ngang} alt="" className="h-full w-full object-cover" draggable={false} />
    </picture>
  )
}

export function ManHS({ children, rong = 'thuong', className = '', nen = 'trong', nenAnh }: { children: ReactNode; rong?: 'thuong' | 'hep'; className?: string; nen?: 'trong' | 'tranh'; nenAnh?: NenManId }) {
  const w = rong === 'hep' ? 'max-w-[720px]' : 'max-w-[430px] md:max-w-[820px] lg:max-w-[1180px]'
  return (
    <div className="min-h-[100dvh]" style={nen === 'tranh'
      ? { background: 'var(--sk-page)', backgroundAttachment: 'fixed', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)', textShadow: 'var(--sk-chu-bong)' }
      : { background: 'var(--sk-nen-trong)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      {nen !== 'tranh' && nenAnh && <NenAnh id={nenAnh} />}
      <div className={`relative mx-auto flex ${w} flex-col gap-3 px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))] ${className}`}>
        {children}
      </div>
    </div>
  )
}

// Đầu trang: nút quay lại tròn + tiêu đề (font đầu của skin) + dòng phụ + chỗ phải (nút/nhãn).
// Môn đang chọn ở màn chính (Thùy 01/10: môn là trục ngoài cùng của app HS) — đọc từ 1 nguồn trong lib/tuluyen.
export const useMonHS = () => useSyncExternalStore(ngheMonHienTai, layMonHienTai)

// theoMon: màn thuộc GÓC HỌC TẬP của 1 môn ⇒ hiện nhãn môn đang chọn ở góc phải đầu trang (em biết đang ở môn nào).
// Màn chung (ví xu, may mắn, thế giới…) không bật.
export function DauTrangHS({ tieuDe, phu, onBack, phai, theoMon }: { tieuDe: ReactNode; phu?: ReactNode; onBack?: () => void; phai?: ReactNode; theoMon?: boolean }) {
  const mon = useMonHS()
  return (
    <div className="flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} aria-label="Quay lại" className="flex h-10 w-10 shrink-0 items-center justify-center text-[20px] active:scale-95" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius-pill)' }}>‹</button>
      )}
      <div className="min-w-0 flex-1 leading-tight">
        <h1 className="truncate text-[21px] font-bold" style={{ ...HEAD, color: 'var(--sk-ink)', textShadow: '0 1px 8px var(--sk-bg)' }}>{tieuDe}</h1>
        {phu && <p className="mt-0.5 truncate text-[12.5px]" style={{ color: 'var(--sk-muted)', textShadow: '0 1px 8px var(--sk-bg)' }}>{phu}</p>}
      </div>
      {theoMon && mon && <NhanHS dac>{mon}</NhanHS>}
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
    <span className="inline-flex items-center gap-1 whitespace-nowrap px-2 py-0.5 text-[11.5px] font-bold"
      style={{ borderRadius: 'var(--sk-radius-pill)', ...(dac ? { background: mau, color: 'var(--sk-acc-ink)' } : { border: `1px solid ${mau}`, color: mau }) }}>{children}</span>
  )
}

export function BadgeHS({ n }: { n: number }) {
  return <span className="flex h-5 min-w-5 items-center justify-center px-1.5 text-[11px] font-extrabold" style={{ borderRadius: 'var(--sk-radius-pill)', background: 'var(--sk-badge)', color: 'var(--sk-badge-ink)' }}>{n}</span>
}

// Tiêu đề nhóm trong trang (chữ hoa nhỏ, màu mờ).
export function NhomHS({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--sk-muted)', textShadow: '0 1px 8px var(--sk-bg)' }}>{children}</p>
}

// Trạng thái rỗng / đang tải / lỗi — 1 kiểu cho mọi màn.
export function TrongHS({ children }: { children: ReactNode }) {
  return <TheHS className="px-4 py-6 text-center text-[14px]"><span style={{ color: 'var(--sk-muted)' }}>{children}</span></TheHS>
}

// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════
// MÀN ĐỌC — tầng CUỐI của luồng tra cứu (Thùy 03/10): menu/danh sách vẫn nằm trên tranh nền (ManHS), nhưng bấm vào
// 1 KIẾN THỨC (mục sổ tay, lý thuyết 1 dạng…) ⇒ sang màn riêng nền SÁNG trơn, thẻ trắng, chữ tối — mẫu file gốc KHTN Pocket.
// (Song song: bấm vào 1 CÂU HỎI ⇒ màn làm bài riêng `LamBai`.) Màu lấy từ biến `--sk-doc-*` (registry: DOC_MAC_DINH / Skin.doc);
// màu nhấn theo môn/phân môn truyền vào `mau` (registry `mauDocMon`) — component không tự chọn màu theo môn.
// Luật dùng: design/STYLE-HS.md §"Menu vs màn riêng".
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════
export type MauNhanDoc = { acc: string; nhat: string }

export function ManDocHS({ onBack, duong, mau, children }: { onBack: () => void; duong?: ReactNode; mau: MauNhanDoc; children: ReactNode }) {
  const bien = { '--doc-acc': mau.acc, '--doc-nhat': mau.nhat } as CSSProperties
  return (
    <div className="min-h-[100dvh]" style={{ ...bien, background: 'var(--sk-doc-nen)', color: 'var(--sk-doc-ink)', fontFamily: 'var(--sk-doc-font)', textShadow: 'none' }}>
      <div className="sticky top-0 z-10" style={{ background: 'var(--sk-doc-nen)', boxShadow: '0 1px 0 var(--sk-doc-line)' }}>
        <div className="mx-auto flex max-w-[760px] items-center gap-3 px-4 pb-2.5 pt-[calc(10px+env(safe-area-inset-top))]">
          <button onClick={onBack} aria-label="Quay lại"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[22px] leading-none active:scale-95"
            style={{ background: 'var(--sk-doc-giay)', color: 'var(--sk-doc-ink)', boxShadow: '0 0 0 1px var(--sk-doc-line)' }}>‹</button>
          {duong && <p className="min-w-0 flex-1 truncate text-[12.5px] font-semibold" style={{ color: 'var(--sk-doc-muted)' }}>{duong}</p>}
        </div>
      </div>
      <div className="mx-auto flex max-w-[760px] flex-col gap-3 px-4 pb-[calc(28px+env(safe-area-inset-bottom))] pt-3">{children}</div>
    </div>
  )
}

// Thẻ chính của 1 kiến thức: chip (loại · lớp · chủ đề) → tiêu đề → tóm tắt → các khối. Viền trên = màu nhấn của môn.
export function TheDocHS({ chip, tieuDe, tomTat, children }: { chip?: ReactNode; tieuDe: ReactNode; tomTat?: ReactNode; children?: ReactNode }) {
  return (
    <article className="flex flex-col gap-3.5 rounded-[18px] px-5 pb-5 pt-4"
      style={{ background: 'var(--sk-doc-giay)', boxShadow: 'var(--sk-doc-bong)', borderTop: '4px solid var(--doc-acc)' }}>
      {chip && <div className="flex flex-wrap items-center gap-1.5">{chip}</div>}
      <h1 className="text-[22px] font-extrabold leading-tight" style={{ color: 'var(--sk-doc-ink)' }}>{tieuDe}</h1>
      {tomTat && <div className="-mt-1 text-[15px] leading-[1.7]" style={{ color: 'var(--sk-doc-ink)' }}>{tomTat}</div>}
      {children}
    </article>
  )
}

// Chip trong màn đọc: dac = tô màu nhấn (loại kiến thức), thường = nền nhạt (lớp, chủ đề).
export function ChipDocHS({ children, dac }: { children: ReactNode; dac?: boolean }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-bold"
      style={dac ? { background: 'var(--doc-acc)', color: 'var(--sk-doc-giay)' } : { background: 'var(--doc-nhat)', color: 'var(--doc-acc)' }}>{children}</span>
  )
}

// Khối nội dung trong thẻ. kieu: cong_thuc (nền nhạt + vạch nhấn trái) · vi_du (nền xám nhạt) · nham (viền đứt đỏ nhạt) ·
// luu_y (nền vàng nhạt) · hinh (khung nhạt, căn giữa) · thuong (chỉ nhãn + nội dung).
export type KieuKhoiDoc = 'cong_thuc' | 'vi_du' | 'nham' | 'luu_y' | 'hinh' | 'thuong'
export function KhoiDocHS({ nhan, kieu = 'thuong', children }: { nhan?: ReactNode; kieu?: KieuKhoiDoc; children: ReactNode }) {
  const nen: Record<KieuKhoiDoc, CSSProperties> = {
    cong_thuc: { background: 'var(--doc-nhat)', borderLeft: '4px solid var(--doc-acc)', borderRadius: '14px' },
    vi_du: { background: 'var(--sk-doc-vd)', borderRadius: '14px' },
    nham: { background: 'var(--sk-doc-nham-nen)', border: '1.5px dashed var(--sk-doc-nham-vien)', borderRadius: '14px' },
    luu_y: { background: 'var(--sk-doc-luuy-nen)', borderRadius: '14px' },
    hinh: { background: 'var(--sk-doc-vd)', borderRadius: '14px' },
    thuong: {},
  }
  const mauNhan = kieu === 'nham' ? 'var(--sk-doc-nham-chu)' : kieu === 'luu_y' ? 'var(--sk-doc-luuy-chu)' : kieu === 'thuong' ? 'var(--sk-doc-muted)' : 'var(--doc-acc)'
  return (
    <section className={kieu === 'thuong' ? '' : kieu === 'hinh' ? 'flex justify-center p-3' : 'px-4 py-3'} style={nen[kieu]}>
      {nhan && <p className="mb-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.08em]" style={{ color: mauNhan }}>{nhan}</p>}
      <div className="text-[14.5px] leading-[1.75]" style={{ color: 'var(--sk-doc-ink)' }}>{children}</div>
    </section>
  )
}

// Trạng thái đang tải / rỗng / lỗi trong màn đọc.
export function TrongDocHS({ icon, tieuDe, moTa }: { icon: string; tieuDe: string; moTa?: string }) {
  return (
    <div className="rounded-[18px] px-5 py-8 text-center" style={{ background: 'var(--sk-doc-giay)', boxShadow: 'var(--sk-doc-bong)' }}>
      <div className="text-[34px]">{icon}</div>
      <p className="mt-2 text-[16px] font-extrabold" style={{ color: 'var(--sk-doc-ink)' }}>{tieuDe}</p>
      {moTa && <p className="mt-1 text-[13.5px] leading-snug" style={{ color: 'var(--sk-doc-muted)' }}>{moTa}</p>}
    </div>
  )
}
