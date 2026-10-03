// ============================================================================
// HinhGami — các HÌNH gamification dùng chung: huy hiệu · biểu tượng bậc · sao bậc · khung avatar theo bậc · hào quang thần.
// Có PNG trong kit (gami/hinh.ts KIT bật) ⇒ vẽ <img>. Chưa có ⇒ HÌNH TẠM vẽ bằng code: huy hiệu = huy chương TRÒN màu men,
// rank = KHIÊN màu chương (đúng luật tách hình của DON-HANG-GAMI-HS.md: huy hiệu tròn, rank khiên/mũ/vương miện).
// Màn chỉ gọi component ở đây — đổi vỏ không phải sửa màn.
// ============================================================================
import { useId, type ReactNode } from 'react'
import { anhHuyHieu, anhBac, anhRankChung, anhNV, ICON_NV, mauHH, bacInfo, chuongCua, laThan, VANG, MAU_GAMI, type KieuHuyHieu } from './hinh'

// Keyframes dùng chung (xoay hào quang, bùng lớp phủ) — nhúng 1 lần mỗi chỗ dùng, trình duyệt gộp trùng.
export const KEYFRAMES = `
@keyframes gamiXoay{to{transform:rotate(360deg)}}
@keyframes gamiBung{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}
@keyframes gamiMo{from{opacity:0}to{opacity:1}}
@keyframes gamiNay{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`

// ── Huy hiệu ─────────────────────────────────────────────────────────────────
// sao = 0 ⇒ hình KHOÁ (bóng xám). Vẽ ≤ 64px (hoặc kieu 'nho') ⇒ PNG bản nhỏ 128px — đúng số sao đang có, không phải luôn ★1.
export function HinhHuyHieu({ hhKey, sao, size = 64, kieu = 'sao', title }: { hhKey: string; sao: number; size?: number; kieu?: KieuHuyHieu; title?: string }) {
  const src = anhHuyHieu(hhKey, sao, kieu === 'khoa' ? 'khoa' : kieu === 'nho' || size <= 64 ? 'nho' : 'sao')
  if (src) return <img src={src} alt={title ?? ''} width={size} height={size} className="block shrink-0 object-contain" style={{ width: size, height: size }} />
  const m = mauHH(hhKey)
  const khoa = sao <= 0
  const vien = khoa ? 2 : sao >= 5 ? 4 : sao >= 3 ? 3 : 2
  return (
    <span title={title} className="relative inline-flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size, height: size,
        background: khoa ? MAU_GAMI.khoa : m.mau,
        boxShadow: khoa ? 'inset 0 0 0 2px rgba(200,210,230,.35)'
          : `inset 0 0 0 ${vien}px ${sao >= 4 ? MAU_GAMI.vanhSang : MAU_GAMI.vanh}, 0 ${size * 0.05}px ${size * 0.14}px rgba(0,0,0,.25)`,
        opacity: khoa ? 0.85 : 1,
      }}>
      {sao >= 5 && <span aria-hidden className="absolute inset-[-8%] rounded-full" style={{ background: `conic-gradient(from 0deg, transparent, ${VANG}55, transparent 30%, ${VANG}55, transparent 60%, ${VANG}55, transparent 90%)`, zIndex: -1 }} />}
      <span aria-hidden style={{ fontSize: size * 0.46, filter: khoa ? 'grayscale(1) brightness(.9)' : 'none', lineHeight: 1 }}>{khoa ? '🔒' : m.emoji}</span>
      {!khoa && kieu !== 'nho' && size >= 44 && (
        <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-1.5 font-extrabold leading-none"
          style={{ color: MAU_GAMI.chu, bottom: -size * 0.06, fontSize: Math.max(9, size * 0.14), padding: `${size * 0.03}px ${size * 0.07}px`, background: sao >= 4 ? VANG : m.dam, boxShadow: '0 1px 3px rgba(0,0,0,.3)' }}>
          {'★'.repeat(sao)}
        </span>
      )}
    </span>
  )
}

// ── Rank ─────────────────────────────────────────────────────────────────────
// Hào quang thần (bậc 9–10): đặt SAU biểu tượng/khung, xoay chậm.
export function HaoQuang({ size }: { size: number }) {
  const src = anhRankChung('hao_quang_than')
  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2" style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, animation: 'gamiXoay 16s linear infinite' }}>
      <style>{KEYFRAMES}</style>
      {src
        ? <img src={src} alt="" className="h-full w-full object-contain" />
        : <span className="block h-full w-full rounded-full" style={{ background: MAU_GAMI.haoQuang, filter: 'blur(6px)' }} />}
    </span>
  )
}

export function BieuTuongBac({ bac, size = 64, nho, haoQuang = true }: { bac: number; size?: number; nho?: boolean; haoQuang?: boolean }) {
  const id = useId().replace(/:/g, '')
  const b = bacInfo(bac), c = chuongCua(bac)
  const src = anhBac(bac, nho || size <= 64 ? 'bieu_tuong_64' : 'bieu_tuong')
  const than = laThan(bac) && haoQuang && !nho
  const hinh = src
    ? <img src={src} alt={b.ten} className="relative block h-full w-full object-contain" />
    : (
      <svg viewBox="0 0 100 100" className="relative block h-full w-full" role="img" aria-label={b.ten}>
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
            {c.mau.match(/#[0-9A-Fa-f]{6}/g)!.map((h, i, a) => <stop key={i} offset={`${(i / (a.length - 1)) * 100}%`} stopColor={h} />)}
          </linearGradient>
        </defs>
        <path d="M50 3 L91 15 V47 C91 72 73 88 50 97 C27 88 9 72 9 47 V15 Z" fill={`url(#g${id})`} stroke="rgba(255,255,255,.85)" strokeWidth={bac >= 5 ? 4 : 3} />
        {bac >= 3 && <path d="M50 12 L82 21 V47 C82 67 68 80 50 87 C32 80 18 67 18 47 V21 Z" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2" />}
        <text x="50" y="58" textAnchor="middle" dominantBaseline="middle" fontSize="40">{b.emoji}</text>
      </svg>
    )
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      {than && <HaoQuang size={size * 1.5} />}
      {hinh}
    </span>
  )
}

// 1–3 sao dưới biểu tượng bậc (bậc thần không có sao).
export function SaoBac({ n, size = 18 }: { n: number; size?: number }) {
  const src = anhRankChung('sao')
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${n} sao`}>
      {[1, 2, 3].map((i) => src
        ? <img key={i} src={src} alt="" style={{ width: size, height: size, opacity: i <= n ? 1 : 0.25, filter: i <= n ? 'none' : 'grayscale(1)' }} />
        : <span key={i} style={{ fontSize: size, lineHeight: 1, color: i <= n ? MAU_GAMI.sao : 'rgba(150,150,150,.45)' }}>★</span>)}
    </span>
  )
}

// Avatar trong KHUNG của bậc rank. Lỗ giữa = 62% khung (đúng đơn design) — avatar thật (ảnh / chữ viết tắt / nút đổi ảnh)
// truyền vào qua `avatar` hoặc để component tự vẽ từ anhUrl/initials.
export function AvatarKhung({ bac, size = 96, anhUrl, initials, avatar }: { bac: number; size?: number; anhUrl?: string | null; initials?: string; avatar?: ReactNode }) {
  const c = chuongCua(bac)
  const lo = Math.round(size * 0.62)
  const src = anhBac(bac, size <= 96 ? 'khung_avatar_96' : 'khung_avatar')
  const ben = avatar ?? (
    <span className="flex items-center justify-center overflow-hidden rounded-full font-extrabold" style={{ color: MAU_GAMI.chu, width: lo, height: lo, background: c.dam, fontSize: lo * 0.38 }}>
      {anhUrl ? <img src={anhUrl} alt="" className="h-full w-full object-cover" /> : initials}
    </span>
  )
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      {laThan(bac) && <HaoQuang size={size * 1.35} />}
      {src
        ? <img src={src} alt="" className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-contain" />
        : (
          <>
            <span aria-hidden className="absolute rounded-full" style={{ inset: size * 0.11, background: c.mau, boxShadow: '0 3px 10px rgba(0,0,0,.3), inset 0 0 0 2px rgba(255,255,255,.6)' }} />
            <span aria-hidden className="absolute left-1/2 z-[2] -translate-x-1/2 leading-none" style={{ top: -size * 0.02, fontSize: size * 0.22 }}>{bacInfo(bac).emoji}</span>
          </>
        )}
      <span className="relative flex items-center justify-center rounded-full" style={{ width: lo, height: lo }}>{ben}</span>
    </span>
  )
}

// ── Icon nhiệm vụ (emoji tạm ⇒ PNG khi KIT.nhiem_vu bật) ─────────────────────
export function IconNV({ ma, size = 18 }: { ma: string; size?: number }) {
  const src = anhNV(ma)
  return src
    ? <img src={src} alt="" className="inline-block shrink-0 object-contain" style={{ width: size * 1.3, height: size * 1.3 }} />
    : <span aria-hidden style={{ fontSize: size, lineHeight: 1 }}>{ICON_NV[ma] ?? '•'}</span>
}
