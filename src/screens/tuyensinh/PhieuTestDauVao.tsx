// Phiếu KẾT QUẢ KIỂM TRA ĐẦU VÀO gửi PH — BẢN IN THUẦN (read-only), layout theo kit
// `BK_KET_QUA_KIEM_TRA_DAU_VAO_UI_KIT_v1` (CEO 12/09): navy #102B55 + gold #D9A441, bóng bẩy; header/footer
// navy có dải gold + sparkle; 5 khối: chuyên đề · cơ bản/nâng cao (donut navy/gold) · kỹ năng THANG 5 ·
// nhận xét (hộp xanh nhạt + ngoặc kép) · đề xuất lớp (badge navy trung tính, KHÔNG nguyệt quế); footer
// địa chỉ + hotline + chữ tay "Học thật · Tiến bộ thật". KHÔNG hiện GV lớp, lịch học, Đại/Hình.
// ⭐ CEO 12/09 lần 2: "Trả bài là cái phiếu; màn đánh giá của GV chỉ GẦN GIỐNG thế; phiếu chụp gửi PH phải
// rất đẹp" ⇒ file này CHỈ có bản in (không edit mode). Form nhập của GV ở TraBaiTestScreen (DanhGiaGvModal).
//
// Kit v2 chỉ có ảnh reference + DESIGN.md (assets/svg ghi trong DESIGN nhưng không có trong zip) ⇒ icon,
// dải gold, sparkle, watermark dựng bằng SVG inline + CSS. Avatar = glyph chung (không có cartoon). Logo
// colorful `logobk.png` (CEO gửi) chữ xám — trên navy không đọc được ⇒ đặt trong ô trắng bo góc.
// Toàn bộ style INLINE hex (Tailwind v4 oklch bể ở html2canvas). SVG inline id RIÊNG (trùng id = sai màu).
// Xuất ảnh: outerHTML → popup html2canvas (pattern V1 EtAnhGuiPH), logo fetch → data URL.
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { coNhom, mucKyNang, paragraphNhanXet, type PhieuKetQua } from '../../lib/detest'

// ═══ TOKENS (kit v2 §2) ═══════════════════════════════════════════════════════════════════════════
export const NAVY = '#102B55'
export const NAVY_DAM = '#0B1F45'
export const GOLD = '#D9A441'
export const GOLD_SANG = '#F3C96B'
export const NEN = '#EEF3FA'
const CARD = '#FFFFFF'
export const CHU = '#1E2B44'
export const CHU_PHU = '#6B7A99'
const TRACK = '#E4EAF3'
const BONG = '0 6px 18px rgba(16,43,85,0.10)'
export const FONT = '"Baloo 2", "Segoe UI", system-ui, -apple-system, sans-serif'
const FONT_TAY = 'Pacifico, "Baloo 2", cursive'
const THANH_GRAD = `linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 45%, ${GOLD} 85%, ${GOLD_SANG} 100%)`
const DIA_CHI = 'Số 17 lô A10, KĐT Geleximco'
const HOTLINE = '0963.209.309'
const LOGO_URL = '/bk-ui/logobk.png'
export const PHIEU_W = 720

// Google Fonts cho bản xem trong ERP (popup xuất ảnh tự nạp riêng). Nạp 1 lần/trang.
const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Pacifico&display=swap'
export function ensureFonts() {
  if (typeof document === 'undefined' || document.getElementById('bk-phieu-fonts')) return
  const l = document.createElement('link'); l.id = 'bk-phieu-fonts'; l.rel = 'stylesheet'; l.href = FONTS_HREF
  document.head.appendChild(l)
}

// ═══ ICON SVG INLINE ═════════════════════════════════════════════════════════════════════════════
export const I = {
  book: (c = NAVY, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v16H5.5A2.5 2.5 0 0 0 3 21V5.5z" fill="${c}"/><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H13v16h5.5A2.5 2.5 0 0 1 21 21V5.5z" fill="${c}" opacity=".8"/></svg>`,
  bars: (c = NAVY) => `<svg width="22" height="22" viewBox="0 0 24 24"><rect x="3" y="12" width="4.5" height="9" rx="1.2" fill="${c}"/><rect x="9.75" y="7" width="4.5" height="14" rx="1.2" fill="${c}"/><rect x="16.5" y="3" width="4.5" height="18" rx="1.2" fill="${c}"/></svg>`,
  gear: (c = NAVY) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="${c}"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.6 4.9l1.9-1.4-1.9-3.3-2.2.9a7.6 7.6 0 0 0-2-1.2L16 6h-3.8l-.4 2.4c-.7.3-1.4.7-2 1.2l-2.2-.9-1.9 3.3 1.9 1.4a7.7 7.7 0 0 0 0 2.4l-1.9 1.4 1.9 3.3 2.2-.9c.6.5 1.3.9 2 1.2L12.2 22H16l.4-2.4c.7-.3 1.4-.7 2-1.2l2.2.9 1.9-3.3-1.9-1.4c.1-.8.1-1.6 0-2.4z"/></svg>`,
  comment: (c = NAVY) => `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="${c}"/><path d="M7 8.5h10M7 12h7" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  cap: (c = NAVY) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="${c}"><path d="M12 3 1 8l11 5 9-4.1V15h2V8L12 3z"/><path d="M5 11.6V16c0 1.7 3.1 3 7 3s7-1.3 7-3v-4.4l-7 3.2-7-3.2z"/></svg>`,
  trophy: () => `<svg width="56" height="56" viewBox="0 0 64 64"><defs><linearGradient id="phTrophy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE39A"/><stop offset=".5" stop-color="#E9B94A"/><stop offset="1" stop-color="#B8801A"/></linearGradient></defs><path d="M18 8h28v14a14 14 0 0 1-28 0V8z" fill="url(#phTrophy)"/><path d="M18 12h-6a2 2 0 0 0-2 2c0 6 4 10 9 11M46 12h6a2 2 0 0 1 2 2c0 6-4 10-9 11" stroke="url(#phTrophy)" stroke-width="3.5" fill="none" stroke-linecap="round"/><rect x="29" y="35" width="6" height="9" fill="#C9962C"/><rect x="20" y="44" width="24" height="5" rx="1.5" fill="url(#phTrophy)"/><rect x="16" y="49" width="32" height="6" rx="2" fill="#B8801A"/><circle cx="26" cy="17" r="3" fill="#FFF3C4" opacity=".8"/></svg>`,
  pencilDoc: () => `<svg width="44" height="44" viewBox="0 0 48 48"><rect x="9" y="5" width="26" height="36" rx="4" fill="#F4F7FB" stroke="#C7D2E3" stroke-width="2"/><path d="M15 15h14M15 21h11M15 27h8" stroke="#8FA1BF" stroke-width="2.5" stroke-linecap="round"/><path d="M27 36l11-11 4 4-11 11-5 1 1-5z" fill="${GOLD}"/><path d="M36 27l4 4" stroke="#B8801A" stroke-width="2"/></svg>`,
  calc: () => `<svg width="44" height="44" viewBox="0 0 48 48"><rect x="10" y="5" width="28" height="38" rx="5" fill="${NAVY}"/><rect x="15" y="10" width="18" height="8" rx="2" fill="#DCE6F5"/><g fill="${GOLD_SANG}"><rect x="15" y="23" width="5" height="5" rx="1.2"/><rect x="21.5" y="23" width="5" height="5" rx="1.2"/><rect x="28" y="23" width="5" height="5" rx="1.2"/><rect x="15" y="31" width="5" height="5" rx="1.2"/><rect x="21.5" y="31" width="5" height="5" rx="1.2"/><rect x="28" y="31" width="5" height="5" rx="1.2"/></g></svg>`,
  avatar: () => `<svg width="64" height="64" viewBox="0 0 48 48"><circle cx="24" cy="17" r="9" fill="${NAVY}"/><path d="M8 42c1-10 7-15 16-15s15 5 16 15H8z" fill="${NAVY}"/></svg>`,
  pin: () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="${GOLD_SANG}"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`,
  phone: () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="${GOLD_SANG}"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8z"/></svg>`,
}
// Nền navy + dải gold nhiều lớp + sparkle (kit: "background navy gold", "bóng bẩy"). preserveAspectRatio none.
function svgNenNavyGold(w: number, h: number, id: string, chieu: 'dau' | 'cuoi'): string {
  const grad = `<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B07A18"/><stop offset=".3" stop-color="#F0C462"/><stop offset=".55" stop-color="#FFF1BF"/><stop offset=".8" stop-color="#E5B24A"/><stop offset="1" stop-color="#A66E12"/></linearGradient>
  <radialGradient id="${id}r" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3B63A8" stop-opacity=".55"/><stop offset="1" stop-color="#3B63A8" stop-opacity="0"/></radialGradient>
  <radialGradient id="${id}s"><stop offset="0" stop-color="#FFF7DD"/><stop offset=".5" stop-color="#F3C96B" stop-opacity=".9"/><stop offset="1" stop-color="#F3C96B" stop-opacity="0"/></radialGradient>`
  const star = (x: number, y: number, r: number, o = 0.9) => `<path d="M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z" fill="#FFF1BF" opacity="${o}"/><circle cx="${x}" cy="${y}" r="${r * 1.8}" fill="url(#${id}s)" opacity=".35"/>`
  const bands = chieu === 'dau'
    ? `<path d="M0 0 L 300 0 C 210 30, 120 80, 60 ${h} L 0 ${h} Z" fill="url(#${id}g)" opacity=".92"/>
       <path d="M0 0 L 230 0 C 150 30, 80 75, 30 ${h} L 0 ${h} Z" fill="#0F2A55" opacity=".55"/>
       <path d="M0 0 L 165 0 C 100 30, 45 70, 10 ${h} L 0 ${h} Z" fill="url(#${id}g)" opacity=".8"/>
       <path d="M720 0 L 720 ${h * 0.95} C 640 ${h * 0.55}, 560 ${h * 0.3}, 420 0 Z" fill="url(#${id}g)" opacity=".9"/>
       <path d="M720 0 L 720 ${h * 0.7} C 660 ${h * 0.42}, 600 ${h * 0.22}, 490 0 Z" fill="#0F2A55" opacity=".55"/>
       <path d="M720 0 L 720 ${h * 0.45} C 680 ${h * 0.28}, 640 ${h * 0.14}, 560 0 Z" fill="url(#${id}g)" opacity=".85"/>
       <ellipse cx="360" cy="${h * 0.55}" rx="260" ry="${h * 0.6}" fill="url(#${id}r)"/>
       ${star(662, 26, 7)}${star(690, 62, 4, 0.7)}${star(628, 12, 3.5, 0.7)}${star(58, 18, 5, 0.75)}${star(24, 60, 3.5, 0.6)}${star(700, 118, 3, 0.55)}`
    : `<path d="M0 ${h} L 0 ${h * 0.35} C 120 ${h * 0.55}, 300 ${h * 0.9}, 720 ${h * 0.25} L 720 ${h} Z" fill="url(#${id}g)" opacity=".92"/>
       <path d="M0 ${h} L 0 ${h * 0.6} C 130 ${h * 0.75}, 320 ${h * 1.02}, 720 ${h * 0.5} L 720 ${h} Z" fill="#0F2A55" opacity=".5"/>
       <path d="M0 ${h} L 0 ${h * 0.78} C 140 ${h * 0.9}, 340 ${h * 1.08}, 720 ${h * 0.68} L 720 ${h} Z" fill="url(#${id}g)" opacity=".8"/>
       ${star(40, h * 0.3, 5, 0.75)}${star(690, h * 0.18, 4.5, 0.7)}${star(660, h * 0.5, 3, 0.55)}`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 720 ${h}" preserveAspectRatio="none" style="display:block"><defs>${grad}</defs>${bands}</svg>`
}

export function Icon({ svg }: { svg: string }) { return <span style={{ display: 'inline-flex', lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: svg }} /> }
function TieuDe({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <Icon svg={icon} />
      <div style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>{text}</div>
    </div>
  )
}
const cardStyle = (extra?: React.CSSProperties): React.CSSProperties => ({ background: CARD, borderRadius: 16, padding: '14px 18px', boxShadow: BONG, ...extra })

// ═══ KHỐI 1 — CHUYÊN ĐỀ ═══════════════════════════════════════════════════════════════════════════
function KhoiChuyenDe({ items }: { items: PhieuKetQua['theoChuyenDe'] }) {
  return (
    <div style={cardStyle({ height: '100%' })}>
      <TieuDe icon={I.book()} text="1. Tỉ lệ % đúng theo chuyên đề" />
      {items.length === 0 && <div style={{ fontSize: 12, color: CHU_PHU, fontStyle: 'italic' }}>Chưa có câu nào được chấm.</div>}
      {items.map((b) => (
        <div key={b.chuyenDe} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 46px', alignItems: 'center', gap: 10, marginBottom: 9 }}>
          <div style={{ fontSize: 12.5, color: CHU, fontWeight: 500, lineHeight: 1.25 }}>{b.chuyenDe}</div>
          <div style={{ height: 11, borderRadius: 6, background: TRACK, overflow: 'hidden' }}>
            <div style={{ width: `${b.pct}%`, height: '100%', background: THANH_GRAD, borderRadius: 6 }} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: NAVY, textAlign: 'right' }}>{b.pct}%</div>
        </div>
      ))}
    </div>
  )
}

// ═══ KHỐI 2 — CƠ BẢN / NÂNG CAO (donut navy + gold) ═══════════════════════════════════════════════
function KhoiMucDo({ tong, theoMucDo }: { tong: PhieuKetQua['tong']; theoMucDo: PhieuKetQua['theoMucDo'] }) {
  const coBan = coNhom(theoMucDo.coBan) ? theoMucDo.coBan : null
  const nangCao = coNhom(theoMucDo.nangCao) ? theoMucDo.nangCao : null
  // ⭐ CEO 12/09 ("48% mà lại full thanh"): vòng TÔ ĐÚNG % ĐÚNG tổng (tong.pct), KHÔNG tô theo tỉ lệ số câu
  // như mockup. Phần tô chia navy (cơ bản) / gold (nâng cao) theo điểm đúng mỗi nhóm; phần còn lại = xám.
  const dCB = coBan?.diem ?? 0, dNC = nangCao?.diem ?? 0, dTong = dCB + dNC
  const R = 56, C = 2 * Math.PI * R
  const cungTo = (tong.pct / 100) * C
  const cungCB = dTong ? (dCB / dTong) * cungTo : cungTo
  return (
    <div style={cardStyle({ height: '100%' })}>
      <TieuDe icon={I.bars()} text="2. Tỉ lệ % đúng theo mức độ khó" />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0 12px' }}>
        <div style={{ position: 'relative', width: 150, height: 150 }}>
          <svg width="150" height="150" viewBox="0 0 150 150" style={{ display: 'block' }}>
            <circle cx="75" cy="75" r={R} stroke={TRACK} strokeWidth="19" fill="none" />
            {cungTo > 0 && (
              <>
                {cungCB > 0 && <circle cx="75" cy="75" r={R} stroke={NAVY} strokeWidth="19" fill="none" strokeDasharray={`${cungCB} ${C}`} transform="rotate(-90 75 75)" />}
                {cungTo - cungCB > 0 && <circle cx="75" cy="75" r={R} stroke={GOLD} strokeWidth="19" fill="none" strokeDasharray={`${cungTo - cungCB} ${C}`} strokeDashoffset={-cungCB} transform="rotate(-90 75 75)" />}
              </>
            )}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: NAVY, lineHeight: 1 }}>{tong.pct}%</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginTop: 2 }}>Đúng</div>
          </div>
        </div>
      </div>
      {[{ n: coBan, mau: NAVY, lbl: 'Cơ bản (độ khó ≤ 3)' }, { n: nangCao, mau: GOLD, lbl: 'Nâng cao (độ khó ≥ 4)' }].map(({ n, mau, lbl }) => (
        <div key={lbl} style={{ display: 'grid', gridTemplateColumns: '12px 1fr auto', alignItems: 'center', gap: 8, marginBottom: 5, fontSize: 12.5, color: CHU, opacity: n ? 1 : 0.45 }}>
          <span style={{ width: 11, height: 11, borderRadius: 6, background: mau }} />
          <span>{lbl}</span>
          <span><b style={{ color: NAVY }}>{n ? `${n.pct}%` : '—'}</b>{n && <span style={{ color: CHU_PHU }}> ({n.diem ?? 0}/{n.toiDa ?? 0})</span>}</span>
        </div>
      ))}
    </div>
  )
}

// ═══ KHỐI 3 — KỸ NĂNG THANG 5 ═════════════════════════════════════════════════════════════════════
function OKyNang({ icon, ten, muc }: { icon: string; ten: string; muc: number | null }) {
  return (
    <div style={{ background: CARD, borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center', border: `1px solid ${TRACK}` }}>
      <Icon svg={icon} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{ten}</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{muc ?? '—'} <span style={{ fontWeight: 600, color: CHU_PHU }}>/ 5</span></span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: TRACK, overflow: 'hidden' }}>
          <div style={{ width: `${((muc ?? 0) / 5) * 100}%`, height: '100%', background: THANH_GRAD, borderRadius: 5 }} />
        </div>
      </div>
    </div>
  )
}
function KhoiKyNang({ tb, tt }: { tb: number | null; tt: number | null }) {
  if (tb == null && tt == null) return null
  return (
    <div style={cardStyle()}>
      <TieuDe icon={I.gear()} text="3. Đánh giá kĩ năng" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <OKyNang icon={I.pencilDoc()} ten="Trình bày" muc={tb} />
        <OKyNang icon={I.calc()} ten="Tính toán" muc={tt} />
      </div>
    </div>
  )
}

// ═══ KHỐI 4 — NHẬN XÉT (hộp xanh nhạt + ngoặc kép; minHeight 3 dòng) ══════════════════════════════
function KhoiNhanXet({ para }: { para: string }) {
  return (
    <div style={cardStyle()}>
      <TieuDe icon={I.comment()} text="4. Nhận xét của giáo viên" />
      <div style={{ position: 'relative', background: '#E8EEF8', borderRadius: 14, padding: '14px 56px 14px 18px', minHeight: 92 }}>
        {para
          ? <div style={{ fontSize: 14, color: CHU, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{para}</div>
          : <div style={{ fontSize: 13, color: CHU_PHU, fontStyle: 'italic' }}>Nhận xét đang được cập nhật.</div>}
        <div style={{ position: 'absolute', right: 16, bottom: 0, fontSize: 68, lineHeight: 1, fontWeight: 800, color: '#C5D1E4', fontFamily: 'Georgia, serif', pointerEvents: 'none' }}>”</div>
      </div>
    </div>
  )
}

// ═══ KHỐI 5 — ĐỀ XUẤT LỚP (badge navy trung tính + watermark sách) ════════════════════════════════
function KhoiLopDeXuat({ tenLop }: { tenLop: string | null }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #FFF8EA 0%, #FDF1D6 100%)', borderRadius: 16, padding: '14px 18px', boxShadow: BONG, border: '1px solid #F1DFB5' }}>
      <div style={{ position: 'absolute', right: 18, bottom: -6, opacity: 0.16, lineHeight: 0, pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: I.book(GOLD, 96) }} />
      <TieuDe icon={I.cap()} text="5. Đề xuất lớp phù hợp" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
        <div style={{ width: 118, height: 112, borderRadius: 16, background: `linear-gradient(160deg, #1C3C74 0%, ${NAVY} 60%, ${NAVY_DAM} 100%)`, border: `3px solid ${GOLD}`, boxShadow: '0 8px 18px rgba(16,43,85,0.28)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: GOLD_SANG, letterSpacing: '2px' }}>LỚP</div>
          <div style={{ fontSize: tenLop && tenLop.length > 4 ? 26 : 34, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{tenLop ?? '—'}</div>
          <Icon svg={I.book(GOLD_SANG, 20)} />
        </div>
        {tenLop
          ? <div style={{ fontSize: 13.5, color: CHU, lineHeight: 1.6 }}>Phù hợp với năng lực hiện tại của con,<br />giúp con phát huy điểm mạnh và tiếp tục tiến bộ.</div>
          : <div style={{ fontSize: 13, color: CHU_PHU, fontStyle: 'italic' }}>Đang được trung tâm rà soát.</div>}
      </div>
    </div>
  )
}

// ═══ CARD PHIẾU (bản in) ══════════════════════════════════════════════════════════════════════════
export function PhieuCard({ p, logoSrc = LOGO_URL }: { p: PhieuKetQua; logoSrc?: string }) {
  useEffect(() => { ensureFonts() }, [])
  const ngayVN = new Date(p.ngay + 'T00:00:00').toLocaleDateString('vi-VN')
  const para = paragraphNhanXet(p.nhanXet)
  const NAVY_BG = `linear-gradient(135deg, ${NAVY_DAM} 0%, #163A72 50%, ${NAVY_DAM} 100%)`
  return (
    <div style={{ width: PHIEU_W, background: NEN, borderRadius: 22, overflow: 'hidden', fontFamily: FONT, color: CHU, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', position: 'relative' }}>
      {/* ─── HEADER navy + dải gold + sparkle ─── */}
      <div style={{ position: 'relative', background: NAVY_BG, padding: '22px 26px 24px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: svgNenNavyGold(PHIEU_W, 190, 'phHead', 'dau') }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '6px 12px', lineHeight: 0, boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
            <img src={logoSrc} alt="BK Academy" style={{ height: 34, width: 'auto', display: 'block' }} />
          </div>
          <div style={{ width: 1, height: 40, background: GOLD, opacity: 0.9 }} />
          <div style={{ fontSize: 11.5, fontWeight: 600, color: '#fff', letterSpacing: '2.5px', lineHeight: 1.55 }}>KIẾN THỨC VỮNG VÀNG<br />TƯƠNG LAI RỘNG MỞ</div>
        </div>
        <div style={{ position: 'relative', textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 31, fontWeight: 800, letterSpacing: '0.5px', lineHeight: 1.1, textShadow: '0 3px 10px rgba(0,0,0,0.35)' }}>
            <span style={{ color: GOLD_SANG }}>KẾT QUẢ</span> <span style={{ color: '#fff' }}>KIỂM TRA ĐẦU VÀO</span>
          </div>
          <div style={{ marginTop: 9, fontSize: 11, fontWeight: 600, color: '#E7ECF5', letterSpacing: '2px' }}>ĐÁNH GIÁ NĂNG LỰC &nbsp;•&nbsp; ĐỊNH HƯỚNG PHÙ HỢP &nbsp;•&nbsp; ĐỒNG HÀNH DÀI LÂU</div>
        </div>
      </div>

      <div style={{ padding: '16px 22px 8px', display: 'grid', gap: 12 }}>
        {/* ─── PROFILE + ĐIỂM ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: 12 }}>
          <div style={cardStyle({ display: 'flex', alignItems: 'center', gap: 16 })}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(160deg, #E9F0FA, #D5E1F3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 0, boxShadow: 'inset 0 0 0 3px #fff, 0 2px 8px rgba(16,43,85,0.15)' }} dangerouslySetInnerHTML={{ __html: I.avatar() }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: NAVY, lineHeight: 1.15, marginBottom: 4 }}>{p.hoTenHs}</div>
              <div style={{ fontSize: 13, color: CHU, lineHeight: 1.6 }}>
                Ngày kiểm tra: <b>{ngayVN}</b><br />
                Số câu: <b>{p.tong.soCau}</b><span style={{ color: CHU_PHU }}> &nbsp;·&nbsp; {p.mon}{p.khoi ? ` · Khối ${p.khoi}` : ''}</span>
              </div>
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #FFF7E4 0%, #F8E7BF 100%)', borderRadius: 16, padding: '14px 16px', boxShadow: BONG, border: '1px solid #EDD9A6', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon svg={I.trophy()} />
            <div>
              <div style={{ fontSize: 13, color: CHU, fontWeight: 600 }}>Điểm test</div>
              <div style={{ lineHeight: 1 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: NAVY }}>{p.diemNhap ?? '—'}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: NAVY, opacity: 0.7 }}>/10</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 12 }}>
          <KhoiChuyenDe items={p.theoChuyenDe} />
          <KhoiMucDo tong={p.tong} theoMucDo={p.theoMucDo} />
        </div>
        <KhoiKyNang tb={mucKyNang(p.nhanXet?.trinhBay)} tt={mucKyNang(p.nhanXet?.tinhToan)} />
        <KhoiNhanXet para={para} />
        <KhoiLopDeXuat tenLop={p.lopDeXuat?.tenLop ?? null} />
      </div>

      {/* ─── FOOTER navy + dải gold ─── */}
      <div style={{ position: 'relative', marginTop: 10, background: NAVY_BG, padding: '24px 26px 20px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: svgNenNavyGold(PHIEU_W, 96, 'phFoot', 'cuoi') }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#fff' }}><Icon svg={I.pin()} />{DIA_CHI}</div>
          <div style={{ width: 1, height: 18, background: GOLD, opacity: 0.8 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#fff' }}><Icon svg={I.phone()} />Hotline: <b>{HOTLINE}</b></div>
          <div style={{ marginLeft: 'auto', fontFamily: FONT_TAY, color: GOLD_SANG, fontSize: 17, lineHeight: 1.25, textAlign: 'right', textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Học thật<br />Tiến bộ thật</div>
        </div>
      </div>
    </div>
  )
}

// ═══ XUẤT ẢNH — popup html2canvas (about:blank không resolve URL tương đối ⇒ logo fetch → data URL) ═══
async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(blob) })
}
export async function moPopupXuatAnh(el: HTMLElement, p: PhieuKetQua): Promise<void> {
  let cardHTML = el.outerHTML
  try {
    const b = await (await fetch(LOGO_URL)).blob()
    cardHTML = cardHTML.split(LOGO_URL).join(await blobToDataUrl(b))
  } catch (e: any) { alert('Không tải được logo: ' + (e?.message ?? String(e))); return }
  const safe = (s: string) => (s || 'phieu').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120)
  const fname = `TestDauVao_${safe(p.hoTenHs)}_${safe(p.mon)}.png`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kết quả kiểm tra đầu vào — ${p.hoTenHs}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS_HREF}" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"><\/script>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:${FONT};background:#dfe5ee;padding:12px;display:flex;flex-direction:column;align-items:center;min-height:100vh}
  .btn-row{display:flex;gap:8px;margin-bottom:12px;width:100%;max-width:${PHIEU_W}px}
  .btn{flex:1;padding:10px 12px;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
  .btn-copy{background:#16a34a;color:#fff}.btn-print{background:${NAVY};color:#fff}.btn:hover{opacity:.88}
  #msg{font-size:12px;color:#16a34a;margin-top:6px;min-height:18px;text-align:center;width:100%}
  @media print{.btn-row,#msg{display:none!important}}
  #report-content{background:transparent}
</style></head><body>
<div class="btn-row"><button class="btn btn-copy" onclick="copyImg()">📋 Copy ảnh (paste vào Zalo)</button><button class="btn btn-print" onclick="window.print()">🖨️ In / Lưu PDF</button></div>
<div id="report-content">${cardHTML}</div>
<p id="msg"></p>
<script>
async function copyImg(){
  var msg=document.getElementById('msg');msg.textContent='⏳ Đang xử lý...';
  try{
    if(document.fonts&&document.fonts.ready){await document.fonts.ready}
    await Promise.all([...document.images].map(function(img){return img.complete?Promise.resolve():new Promise(function(r){img.onload=r;img.onerror=r})}));
    var node=document.getElementById('report-content');
    var canvas=await html2canvas(node,{scale:2,backgroundColor:null,useCORS:true,logging:false,scrollX:0,scrollY:0,windowWidth:node.scrollWidth,windowHeight:node.scrollHeight,width:node.scrollWidth,height:node.scrollHeight});
    canvas.toBlob(async function(blob){
      try{ await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]); msg.textContent='✅ Đã copy! Paste (Ctrl+V) vào Zalo.'; }
      catch(e){ var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=${JSON.stringify(fname)};a.click();URL.revokeObjectURL(url); msg.textContent='✅ Đã tải file ảnh!'; }
    },'image/png');
  }catch(e){ msg.textContent='Lỗi: '+e.message; }
}
<\/script></body></html>`
  const popup = window.open('', '_blank', `width=${PHIEU_W + 60},height=900,scrollbars=yes`)
  if (!popup) { alert('Trình duyệt chặn popup. Bật "Allow pop-ups" cho site này.'); return }
  popup.document.write(html); popup.document.close()
}

// Modal xem/copy bản in — dùng khi xem lại phiếu của ca đã trả.
export function PhieuTestModal({ p, onClose }: { p: PhieuKetQua; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col bg-slate-900/70" onClick={onClose}>
      <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2.5 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-semibold">Phiếu kết quả — {p.hoTenHs}</span>
        {p.baiDaChamUrl && <a href={p.baiDaChamUrl} target="_blank" rel="noreferrer" className="ml-auto rounded-md border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700">📄 Bài đã chấm</a>}
        <button onClick={() => cardRef.current && moPopupXuatAnh(cardRef.current, p)} className={p.baiDaChamUrl ? 'rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium hover:bg-indigo-500' : 'ml-auto rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium hover:bg-indigo-500'}>📋 Copy ảnh</button>
        <button onClick={onClose} className="rounded-md border border-slate-500 px-3 py-1 text-sm hover:bg-slate-700">Đóng</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
        <div ref={cardRef} style={{ margin: '0 auto', width: PHIEU_W }}><PhieuCard p={p} /></div>
      </div>
    </div>,
    document.body,
  )
}
