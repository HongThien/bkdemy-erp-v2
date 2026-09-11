// ============================================================================
// HomeHS — MÀN CHÍNH app HS cấp 2/3 (điện thoại dọc), dựng theo KIT `design/handoff/hs-home-v4`
// (CEO thiết kế trên ChatGPT, 08/09/2026). Đo bố cục từ reference/home_reference_male_v4.png
// (canvas 941×1672 → màn 430px = ×0.457). Quy tắc kit (design/CHATGPT-UI-KIT.md §3):
//   TEXT/SHAPE = code (Baloo 2 cho UI, Itim cho chữ viết tay) · GLYPH = SVG inline · ILLUST/CHAR/DECOR =
//   PNG cutout ở public/bk-ui/hs/ · BACKDROP = ảnh nền thuần không chữ.
// 2 biến thể nam/nữ = CÙNG component, chỉ đổi THEME (nền, nhân vật, màu chủ đạo, câu động viên).
// Component này CHỈ vẽ — mọi số đếm/trạng thái ô do HocSinhApp tính và truyền vào `cards`.
// ============================================================================
import type { ReactNode } from 'react'
import AvatarHS from './AvatarHS'
import { LOAI_BO_TRO_TEN, type LichBoTro } from '../../lib/botro_yeu_ca'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'

// Dòng tóm tắt ca bổ trợ GẦN NHẤT cho box "Bổ trợ" (Thùy 09-09: 2 box màn chính — Bổ trợ · Bài tập được giao).
export function tomTatLich(lich: LichBoTro[]): { sub: string; co: boolean } {
  const c = lich[0]
  if (!c) return { sub: 'Chưa có lịch', co: false }
  const gio = c.gio_bat_dau ? ` · ${String(c.gio_bat_dau).slice(0, 5)}` : ''
  const ngay = c.hom_nay ? 'Hôm nay' : `${thuCuaNgay(c.ngay)} ${ddmmVN(c.ngay)}`
  return { sub: `${LOAI_BO_TRO_TEN[c.loai]} · ${ngay}${gio}${c.phong ? ` · ${c.phong}` : ''}`, co: true }
}

const A = '/bk-ui/hs' // thư mục asset đã tối ưu (xuất từ kit bằng scripts PowerShell — file gốc ở design/handoff)

export type HomeTone = 'pink' | 'purple' | 'orange' | 'green' | 'blue' | 'gray'
export type HomeCard = {
  id: string
  ten: string
  /** dòng trạng thái dưới tiêu đề + màu: 'ton' = màu chủ đạo của ô (có việc) · 'do' = quá hạn · 'xam' · 'xanh' = xong hết */
  sub: string
  subMau: 'ton' | 'do' | 'xam' | 'xanh'
  badge?: number
  doodle: string
  ill: string // tên file trong public/bk-ui/hs (không đuôi)
  tone: HomeTone
  disabled?: boolean
  onClick?: () => void
}

// Bảng màu 6 ô — lấy từ DESIGN.md kit (mũi tên) + nền pastel đo từ reference.
const TONE: Record<HomeTone, { bg: string; c: string; ill: string }> = {
  pink:   { bg: 'linear-gradient(135deg,#ffffff 0%,#fff0f4 100%)', c: '#FF6B8E', ill: '#ffe4ec' },
  purple: { bg: 'linear-gradient(135deg,#ffffff 0%,#f5f1ff 100%)', c: '#7B61E8', ill: '#ece6ff' },
  orange: { bg: 'linear-gradient(135deg,#ffffff 0%,#fff8e9 100%)', c: '#F3A43B', ill: '#fff0d2' },
  green:  { bg: 'linear-gradient(135deg,#ffffff 0%,#effdf4 100%)', c: '#20A886', ill: '#dff8ea' },
  blue:   { bg: 'linear-gradient(135deg,#ffffff 0%,#eef8ff 100%)', c: '#2C78D8', ill: '#e0efff' },
  gray:   { bg: 'linear-gradient(135deg,#f9fbff 0%,#eef0f4 100%)', c: '#8792B5', ill: '#e8ebf2' },
}

// 2 theme — chỉ khác 6 giá trị này (DESIGN.md kit §6 + reference nữ).
const THEME = {
  nam: { bg: `${A}/bg_home_male.jpg`, char: `${A}/char_male.png`, decor: `${A}/decor_books.png`, primary: '#2F79F6', hero: 'linear-gradient(135deg,#3C85FF,#5868F7)', avatar: '#1a63d8', greet: '#1c2a6b', quote: 'Một phiên bản tốt hơn\ncủa chính mình ♡' },
  nu:  { bg: `${A}/bg_home_female.jpg`, char: `${A}/char_female.png`, decor: `${A}/decor_books_female.png`, primary: '#E96AA8', hero: 'linear-gradient(135deg,#FF8EB8,#F46BA9)', avatar: '#d83f86', greet: '#c93f82', quote: 'Mỗi ngày cố gắng\nlà một ngày tiến bộ ♡' },
}

const NAVY = '#111C55'
const SEC = '#7582AA'
const SHADOW = '0 8px 24px rgba(67,92,160,.10)'

// ── GLYPH (SVG inline, currentColor để đổi theo theme) — path lấy từ kit assets/svg ─────────────
function Bell({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path d="M32 12c-8.3 0-15 6.7-15 15v8c0 2.7-1.1 5.2-3 7.1L11 45h42l-3-2.9c-1.9-1.9-3-4.4-3-7.1v-8c0-8.3-6.7-15-15-15z" fill="currentColor" />
      <path d="M26 50a6 6 0 0012 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
function Chevron({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="h-[15px] w-[15px]" fill="none" aria-hidden>
      <path d="M18 12l12 12-12 12" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NutTron({ onClick, title, children }: { onClick: () => void; title: string; children: ReactNode }) {
  return (
    <button onClick={onClick} title={title} className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white active:scale-95" style={{ boxShadow: SHADOW }}>
      {children}
    </button>
  )
}

export default function HomeHS({ hoTen, maHS, lopMon, gioiTinh, anhUrl, onAnhChanged, chuaDoc, lich, soRetest, cards, onHopThu, onDoiMK, onThoat, onLich, onRetest }: {
  hoTen: string; maHS: string; lopMon: string | null; gioiTinh: 'nam' | 'nu' | null
  anhUrl: string | null; onAnhChanged: (url: string) => void
  chuaDoc: number; lich: LichBoTro[]; soRetest: number; cards: HomeCard[]
  onHopThu: () => void; onDoiMK: () => void; onThoat: () => void; onLich: () => void; onRetest: () => void
}) {
  const tt = tomTatLich(lich)
  const vaoCa = lich.some((c) => c.vao_ca)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  const tu = hoTen.trim().split(/\s+/)
  const initials = tu.slice(-2).map((w) => w[0]).join('').toUpperCase()
  const tenNgan = tu.slice(-2).join(' ') // Thùy 08/09: hero chỉ hiện 2 từ cuối ("Đức Huy"), không hiện đầy đủ

  return (
    // Chữ viết tay app HS = Pacifico (Thùy chốt 08/09 sau khi so Itim/Sriracha/Mali/Dancing Script/Pacifico trên màn
    // thật). Ghi đè biến @theme --font-hand CHỈ trong cây này — app TA vẫn Itim (index.css dùng chung, không đụng).
    // LUẬT (Thùy 08/09): màn Home KHÔNG cuộn (h-100dvh + overflow-hidden), NHƯNG KHÔNG kéo giãn phần tử cho đầy
    // màn — "tỉ lệ phải như gốc mới đẹp, scale sai tỉ lệ xấu". Mọi khối lấy TỈ LỆ KHUNG từ reference (hero 870:280,
    // ô 417:280) nên cao theo BỀ NGANG như mockup; màn cao thì để trống dưới cùng, chấp nhận.
    <div className="font-bubble relative mx-auto h-[100dvh] max-w-[430px] overflow-hidden" style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      {/* BACKDROP — trời mây thuần (kit), mọi thứ khác đè lên bằng code */}
      <img src={t.bg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />

      <div className="relative flex h-full flex-col px-4 pb-[calc(8px+env(safe-area-inset-bottom))] pt-[calc(10px+env(safe-area-inset-top))]">
        {/* TOP — chào (Itim) trái · chuông / khoá / Thoát phải */}
        <div className="flex items-start justify-between gap-2">
          <div className="font-hand min-w-0 pt-1 leading-[1.05]" style={{ color: t.greet }}>
            <div className="text-[17px]">Chào bạn,</div>
            <div className="relative inline-block whitespace-nowrap text-[18px] font-bold">
              Cùng cố gắng hôm nay nhé!
              <span className="absolute -bottom-1 left-[38%] h-[3px] w-[30%] rounded-full opacity-70" style={{ background: t.primary }} />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
            <NutTron onClick={onHopThu} title="Hòm thư">
              <span style={{ color: t.primary }}><Bell className="h-[22px] w-[22px]" /></span>
              {chuaDoc > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-extrabold text-white" style={{ background: '#FF315E', boxShadow: '0 4px 10px rgba(255,49,94,.35)' }}>{chuaDoc}</span>
              )}
            </NutTron>
            <NutTron onClick={onDoiMK} title="Đổi mật khẩu"><img src={`${A}/key.svg`} alt="" className="h-[22px] w-[22px]" /></NutTron>
            <button onClick={onThoat} className="flex h-10 items-center justify-center rounded-[13px] bg-white px-3 text-[14px] font-bold active:scale-95" style={{ boxShadow: SHADOW, color: NAVY }}>Thoát</button>
          </div>
        </div>

        {/* HERO — thẻ gradient (SHAPE) + avatar + tên/mã/lớp (TEXT động) + nhân vật (CHAR) + doodle (TEXT Itim) */}
        <div className="relative mt-3 shrink-0" style={{ aspectRatio: '870 / 280' }}>
          <div className="absolute inset-0 overflow-hidden rounded-[24px]" style={{ background: t.hero, boxShadow: SHADOW }}>
            <span className="absolute -bottom-6 -left-4 h-20 w-32 rounded-full bg-white/15 blur-md" />
            <span className="absolute -top-6 right-24 h-16 w-28 rounded-full bg-white/10 blur-md" />
          </div>
          <div className="absolute left-4 top-[calc(50%-6px)] -translate-y-1/2">
            {/* Avatar bấm-để-đổi (ốp từ app TA, CEO 08/09) — vòng trắng + vương miện vẽ ngoài, AvatarHS lo hình + upload */}
            <div className="relative rounded-full border-[4px] border-white">
              <AvatarHS anhUrl={anhUrl} initials={initials} size={60} fill={t.avatar} badge={t.primary} onChanged={onAnhChanged} />
              <img src={`${A}/crown.svg`} alt="" className="pointer-events-none absolute -left-2 -top-4 h-6 w-7 -rotate-[18deg]" />
            </div>
          </div>
          {/* Cỡ chữ theo bề ngang (clamp vw) để màn 390 vẫn giữ tỉ lệ như mockup 430, không cắt tên */}
          <div className="absolute left-[23.5%] right-[33%] top-1/2 -translate-y-1/2 text-white">
            <p className="truncate font-extrabold leading-tight" style={{ fontSize: 'clamp(16px, 4.4vw, 19px)' }}>{tenNgan}</p>
            <p className="mt-0.5 truncate opacity-90" style={{ fontSize: 'clamp(11px, 2.9vw, 12.5px)' }}>{maHS.toUpperCase()}{lopMon ? ` - ${lopMon}` : ''}</p>
            <span className="mt-2 inline-block whitespace-nowrap rounded-full bg-white/20 px-2.5 py-1" style={{ fontSize: 'clamp(9.5px, 2.6vw, 11px)' }}>Học tốt hơn mỗi ngày! 🚀</span>
          </div>
          <img src={t.char} alt="" className="pointer-events-none absolute -top-2 right-[8.5%] h-[calc(100%+8px)] w-auto object-contain object-bottom drop-shadow-[0_6px_12px_rgba(20,40,120,.25)]" />
          <div className="font-hand pointer-events-none absolute right-2 top-2.5 rotate-[8deg] text-right text-[10.5px] leading-[1.05] text-white/90">Dream<br />Learn<br />Grow<br />Repeat</div>
          <div className="font-hand pointer-events-none absolute bottom-1.5 left-2.5 -rotate-[8deg] text-[9px] leading-[1.05] text-white/80">Better Student<br />Brighter You!</div>
        </div>

        {/* 2 BOX (Thùy 09-09): "Bổ trợ" (lịch 3 loại yếu/bù/đuổi — trigger cái nào hiện cái đó) · "Bài tập được giao"
            (bàn sau — placeholder). LUÔN hiện 2 box, kể cả chưa có lịch, để em biết chỗ xem. */}
        <div className="mt-2.5 grid shrink-0 grid-cols-2 gap-2.5">
          <BoxNho onClick={onLich} title="Bổ trợ" sub={vaoCa ? 'Vào ca ngay →' : tt.sub} mau={tt.co ? '#d8921c' : SEC} nen={tt.co ? 'linear-gradient(135deg,#fffbe6,#fff3c4)' : '#ffffff'} vien={tt.co ? '#ffe28a' : '#e6ebf5'} icon="🧑‍🏫" badge={lich.length || undefined} />
          <BoxNho title="Bài tập được giao" sub="Sắp có" mau={SEC} nen="linear-gradient(135deg,#f9fbff,#eef0f4)" vien="#e6ebf5" icon="📚" disabled />
        </div>
        {soRetest > 0 && (
          <div className="mt-2.5 flex shrink-0 flex-col gap-2">
            <Banner onClick={onRetest} title="Bài kiểm tra lại" sub={`${soRetest} bài chờ làm sau ET · nộp 1 lần`} doodle="Làm được mà! ♡" badge={soRetest} />
          </div>
        )}

        {/* LƯỚI 6 Ô */}
        <div className="mt-2.5 grid shrink-0 grid-cols-2 gap-2.5">
          {cards.map((c) => {
            const tone = TONE[c.tone]
            const subColor = c.subMau === 'ton' ? tone.c : c.subMau === 'do' ? '#e64040' : c.subMau === 'xanh' ? '#20A886' : SEC
            return (
              <button key={c.id} disabled={c.disabled} onClick={c.onClick}
                className={`relative flex flex-col justify-between overflow-hidden rounded-[22px] p-3 text-left transition ${c.disabled ? 'opacity-75 saturate-50' : 'active:scale-[0.98]'}`}
                style={{ background: tone.bg, boxShadow: c.disabled ? 'none' : SHADOW, aspectRatio: '417 / 280' }}>
                <span className="flex w-[31%] shrink-0 items-center justify-center rounded-[15px]" style={{ background: tone.ill, aspectRatio: '1 / 1' }}>
                  <img src={`${A}/ill_${c.ill}.png`} alt="" className="h-[76%] w-[76%] object-contain" />
                </span>
                <span className={`font-hand pointer-events-none absolute right-3.5 max-w-[84px] rotate-[-7deg] text-right text-[10.5px] leading-[1.1] ${c.badge ? 'top-9' : 'top-3.5'}`} style={{ color: tone.c, opacity: 0.9 }}>{c.doodle}</span>
                <span className="pr-8">
                  <span className="block font-extrabold leading-tight" style={{ color: c.disabled ? '#59698f' : NAVY, fontSize: 'clamp(13px, 3.5vw, 15px)' }}>{c.ten}</span>
                  <span className="mt-0.5 block leading-snug" style={{ color: subColor, fontWeight: c.subMau === 'ton' || c.subMau === 'do' ? 700 : 500, fontSize: 'clamp(10px, 2.7vw, 11.5px)' }}>{c.sub}</span>
                </span>
                <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full" style={{ background: `${tone.c}29` }}><Chevron color={tone.c} /></span>
                {!!c.badge && c.badge > 0 && (
                  <span className="absolute right-2.5 top-2.5 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-extrabold text-white" style={{ background: '#FF315E', boxShadow: '0 6px 14px rgba(255,49,94,.3)' }}>{c.badge}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* FOOTER — quote (TEXT Itim) + decor sách/cốc (DECOR) */}
        <div className="mt-2.5 flex shrink-0 items-end justify-between gap-2">
          <div className="pl-1">
            <div className="font-hand relative -rotate-[3deg] whitespace-pre-line pb-2.5 text-[18px] leading-[1.2]" style={{ color: t.greet }}>
              {t.quote}
              <span className="absolute bottom-0 left-8 h-[3px] w-24 rounded-full opacity-60" style={{ background: t.primary }} />
            </div>
            {/* Thùy 08/09: "BK ACADEMY" trên đầu chật → đưa xuống chân trang */}
            <div className="mt-2 text-[9.5px] font-semibold tracking-[0.22em]" style={{ color: SEC }}>— BK ACADEMY</div>
          </div>
          <img src={t.decor} alt="" className="pointer-events-none -mr-2 -mb-1 w-[32%] shrink-0" />
        </div>
      </div>
    </div>
  )
}

// Box nhỏ 2 cột giữa hero và lưới (Thùy 09-09) — icon + tiêu đề + dòng trạng thái + badge số ca.
function BoxNho({ onClick, title, sub, mau, nen, vien, icon, badge, disabled }: { onClick?: () => void; title: string; sub: string; mau: string; nen: string; vien: string; icon: string; badge?: number; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`relative flex items-center gap-2 rounded-[18px] py-2 pl-2.5 pr-2 text-left ${disabled ? 'opacity-75 saturate-50' : 'active:scale-[0.98]'}`}
      style={{ background: nen, border: `1.5px solid ${vien}`, boxShadow: disabled ? 'none' : SHADOW }}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-white text-[18px]" style={{ boxShadow: '0 2px 6px rgba(67,92,160,.08)' }}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-extrabold leading-tight" style={{ color: NAVY }}>{title}</span>
        <span className="mt-0.5 block truncate text-[10.5px] font-semibold leading-snug" style={{ color: mau }}>{sub}</span>
      </span>
      {!!badge && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-extrabold text-white" style={{ background: '#FF315E' }}>{badge}</span>}
    </button>
  )
}

// Dải vàng giữa hero và lưới (reference_support_banner_v4): mascot (ILLUST) + tiêu đề/mô tả (TEXT) + mũi tên.
function Banner({ onClick, title, sub, doodle, badge }: { onClick: () => void; title: string; sub: string; doodle: string; badge?: number }) {
  return (
    <button onClick={onClick} className="relative flex items-center gap-2.5 rounded-[20px] py-2 pl-2.5 pr-3 text-left active:scale-[0.99]"
      style={{ background: 'linear-gradient(135deg,#fffbe6,#fff3c4)', border: '1.5px solid #ffe28a', boxShadow: SHADOW }}>
      <img src={`${A}/ill_mascot_botro.png`} alt="" className="h-[56px] w-[56px] shrink-0 object-contain" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-extrabold leading-tight" style={{ color: NAVY }}>{title}</span>
        <span className="mt-0.5 block text-[11.5px] leading-snug" style={{ color: SEC }}>{sub}</span>
      </span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: '#ffe28a' }}><Chevron color="#d8921c" /></span>
      <span className="font-hand pointer-events-none absolute right-11 top-1 rotate-[6deg] text-[9px] leading-none" style={{ color: '#d8921c' }}>{doodle}</span>
      {!!badge && <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-extrabold text-white" style={{ background: '#FF315E' }}>{badge}</span>}
    </button>
  )
}
