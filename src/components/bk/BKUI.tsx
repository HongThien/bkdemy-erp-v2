// BỘ PRIMITIVE "BK" cho khu Của tôi app mobile (CEO duyệt design 07/09 — handoff BK_TA_Claude_UI):
// tông pastel xanh, tiêu đề bong bóng (Baloo 2), chữ tay nghiêng (Itim), thẻ pastel bo lớn, minh hoạ =
// PNG từ UI kit (KHÔNG emoji). Màn gốc dùng THẲNG tranh nền CEO vẽ (public/bk-ui/bg_cua_toi.jpg — đã
// có sẵn logo, tiêu đề CỦA TÔI, tagline, mascot); màn con dùng BKPageHeader = bầu trời gradient + tiêu
// đề HTML. Token: primary #2F73F6 · text #16224D · secondary #63709A · success #31C875 · warning
// #FFB33D · danger #FF5D78. Dùng chung mọi app (TA trước, GV/OPS lắp sau).
import { useEffect, type ReactNode } from 'react'

export const BK = {
  primary: '#2F73F6', primaryDark: '#174DAF', text: '#16224D', sub: '#63709A',
  success: '#31C875', warning: '#FFB33D', danger: '#FF5D78',
} as const

// ── TRANH NỀN CEO vẽ (public/bk-ui/*.jpg) — mỗi màn 1 tranh, có sẵn logo · tiêu đề · tagline · mascot.
// Vẽ theo BỀ NGANG (100% auto: thấy trọn tranh, không cắt bảng gỗ/bong bóng ở 2 mép), DÍNH ĐỈNH. `canh` =
// chiều cao (px ảnh) phần cảnh trên cùng → spacer giữ chỗ, nội dung đặt dưới. Tranh 9:16 luôn "rộng" hơn
// cột điện thoại (375×755) nên không lấp hết chiều cao: phần thừa nối `mauTroi`; tranh nào đáy là cỏ hoa
// (Xếp hạng) thì cắt thêm mảnh `day` dính ĐÁY cột, khoảng giữa là trời — không mảnh nào bị cắt/kéo.
// Đã thử: V4 phủ cover → thẻ hồ sơ che mặt mascot; neo đáy → thừa cục trời trên đỉnh (CEO chê cả hai).
// Đơn vị cqw → khung bọc cột phải có container-type:size (DashTa).
// `troi` = [màu trời ngay dưới mảnh trên, màu trời ngay trên mảnh đáy] → gradient nối giữa. Mép mảnh làm
// mờ dần bằng mask nên mây bị cắt ngang không lộ đường ghép. Đường cắt chọn ở hàng pixel đồng màu nhất
// (đo stddev từng hàng): Xếp hạng cắt y=560 (dưới bụi cây) và y=830 (trước khi tán cây bắt đầu ~870).
// `phu` = lớp phủ xanh mờ từ thẻ hồ sơ trở xuống (CEO 07/09: nội dung phải nổi trên nền như màn Của tôi —
// mảnh công viên phía dưới quá rực) — màu trời Của tôi pha trong suốt.
// `chanDay` = số px ảnh (của mảnh `day`) ở ĐÁY đã vẽ sẵn banner mascot ("Bạn đang làm rất tốt!") → nội dung
// chừa chỗ đúng bấy nhiêu (paddingBottom) và lớp phủ dừng trên banner; danh sách dài thì CUỘN NỘI BỘ ở giữa.
// `hoSo: false` = màn không có thẻ hồ sơ (May mắn). `nutVe` = vị trí nút ‹ tính từ đỉnh tranh (cqw), mặc định 17.5.
export type BKTranh = { url: string; rong: number; canh: number; troi: [string, string]; day?: string; phu?: string; chanDay?: number; hoSo?: boolean; nutVe?: number }
export const BK_TRANH = {
  cuatoi: { url: '/bk-ui/bg_cua_toi.jpg', rong: 941, canh: 440, troi: ['#CCE7FE', '#CCE7FE'] },                                  // headerv3 cắt status bar giả 78px
  xephang: { url: '/bk-ui/bg_xephang.jpg', rong: 941, canh: 520, troi: ['#93D0FA', '#A5D9FC'], day: '/bk-ui/bg_xephang_day.jpg', phu: 'rgba(178,215,253,.93)' },   // CEO: "xanh đậm tí, che backdrop cho đỡ rối" // backdrop_xephang.png: mảnh trên y0–560 · mảnh đáy y830–1672
  gay: { url: '/bk-ui/bg_gay.jpg', rong: 863, canh: 560, troi: ['#B5E3FD', '#BFE4F5'], day: '/bk-ui/bg_gay_day.jpg', phu: 'rgba(178,215,253,.93)', chanDay: 262 },   // backdrop_gay.png 863×1822: mảnh trên y0–600 · mảnh đáy y683–1822 (banner vẽ sẵn ở 262px cuối)
  // May mắn: tranh kín màn, KHÔNG thẻ hồ sơ; mảnh trên y0–1040 (title · banner · mascot · công viên · quà) dính đỉnh,
  // mảnh đáy y1385–1672 (chỉ mây) dính đáy; bảng "Cơ hội trúng thưởng" (y1048–1385) là mảnh RIÊNG do MayManScreen
  // đặt trong luồng ngay dưới nút Quay. canh=0: MayManScreen tự xếp theo cqw (vòng quay đè lên công viên).
  mayman: { url: '/bk-ui/bg_mayman.jpg', rong: 941, canh: 0, troi: ['#DDEFFC', '#DDEFFC'], day: '/bk-ui/bg_mayman_day.jpg', hoSo: false, nutVe: 11 },
  // Shopping: cảnh trên y0–520 (title Shopping · túi quà · mascot · bảng gỗ), trời phẳng phía dưới; mảnh trên y0–1040
  // dính đỉnh, mây đáy y1300–1672 dính đáy. Không thẻ hồ sơ — ShopScreen tự vẽ hàng "Điểm tích lũy · Chuỗi · Cố lên".
  shop: { url: '/bk-ui/bg_shop.jpg', rong: 941, canh: 530, troi: ['#A6DCFD', '#9AD8FD'], day: '/bk-ui/bg_shop_day.jpg', hoSo: false, nutVe: 12 },
  // Hướng dẫn: cảnh trên y0–510 (logo · sách bóng đèn · HƯỚNG DẪN · mascot đọc sách) dính đỉnh, mây y1300–1672 dính đáy; có thẻ hồ sơ.
  huongdan: { url: '/bk-ui/bg_huongdan.jpg', rong: 941, canh: 520, troi: ['#C2E2FD', '#CDE7FD'], day: '/bk-ui/bg_huongdan_day.jpg', nutVe: 19 },
} as const satisfies Record<string, BKTranh>
export function bkTranhStyle(t: BKTranh) {
  const pct = (px: number) => `${((px / t.rong) * 100).toFixed(2)}cqw`
  const dinh = 'env(safe-area-inset-top, 0px)'
  return {
    offsetY: dinh,
    spacerH: `calc(${dinh} + ${pct(t.canh)})`,
    dayH: t.chanDay ? pct(t.chanDay) : '0px',
    nen: { background: `linear-gradient(180deg, ${t.troi[0]} 0%, ${t.troi[1]} 100%)` } as const,
  }
}
// Lớp tranh đặt TRONG khung (position:relative, overflow:hidden) ĐẰNG SAU cột cuộn → tranh đứng yên khi
// nội dung cuộn. Mảnh trên dính đỉnh (mép dưới mờ dần), mảnh đáy dính đáy (mép trên mờ dần).
export function BKTranhNen({ t }: { t: BKTranh }) {
  const fadeDuoi = { WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 28px), transparent)', maskImage: 'linear-gradient(to bottom, #000 calc(100% - 28px), transparent)' }
  const fadeTren = { WebkitMaskImage: 'linear-gradient(to top, #000 calc(100% - 60px), transparent)', maskImage: 'linear-gradient(to top, #000 calc(100% - 60px), transparent)' }
  const { spacerH, dayH } = bkTranhStyle(t)
  return (
    <>
      <img src={t.url} alt="" draggable={false} className="pointer-events-none absolute left-0 w-full select-none" style={{ top: 'env(safe-area-inset-top, 0px)', ...fadeDuoi }} />
      {t.day && <img src={t.day} alt="" draggable={false} className="pointer-events-none absolute bottom-0 left-0 w-full select-none" style={fadeTren} />}
      {/* lớp phủ từ mép trên thẻ hồ sơ (spacer − 12px) tới trên banner vẽ sẵn (chanDay); 2 mép mờ dần để không thành đường kẻ */}
      {t.phu && <div className="pointer-events-none absolute inset-x-0"
        style={{ top: `calc(${spacerH} - 12px)`, bottom: dayH, background: t.phu, WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 24px, #000 calc(100% - 20px), transparent)', maskImage: 'linear-gradient(to bottom, transparent, #000 24px, #000 calc(100% - 20px), transparent)' }} />}
    </>
  )
}

// ── HEADER màn con: bầu trời gradient + tia sáng + tiêu đề bong bóng trắng viền xanh + tagline chữ
// tay + mascot PNG góc dưới-phải với bong bóng lời. (Tranh nền có chữ CỦA TÔI cố định nên màn con
// không dùng lại được — CEO có thể gửi bản tranh KHÔNG chữ để lắp cho màn con.)
export function BKPageHeader({ title, tagline, onBack, mascot = '/bk-ui/mascot_wave.png', bubble, hero }: {
  title: string; tagline?: string; onBack?: () => void; mascot?: string; bubble?: string; hero?: boolean   // hero = màn gốc (tiêu đề IN HOA, to hơn)
}) {
  return (
    <div className="relative overflow-hidden" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))', minHeight: hero ? 236 : 196, background: 'linear-gradient(180deg, #9ED0F8 0%, #BFE0FD 55%, #CFE7FE 100%)' }}>
      <span className="pointer-events-none absolute left-5 top-16 text-[14px] text-[#FFE27A]">✦</span>
      <span className="pointer-events-none absolute right-6 top-24 text-[10px] text-[#FFE27A]">✦</span>
      <span className="pointer-events-none absolute left-1/4 bottom-6 text-[11px] text-white/80">✦</span>
      <div className="relative mx-auto max-w-[1000px] px-4">
        <div className="flex items-start justify-between">
          {onBack ? (
            <button onClick={onBack} aria-label="Quay lại"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[22px] font-bold text-[#2F73F6] shadow-md active:scale-95">‹</button>
          ) : (
            <span className="font-bubble leading-none">
              <span className="text-[19px] font-extrabold text-[#2F73F6]">BK<span className="text-[#FFD84D]">✦</span></span>
              <span className="block -mt-1 text-[11px] font-bold text-[#2F73F6]">Academy</span>
            </span>
          )}
          {/* Góc phải: màn con đặt BONG BÓNG LỜI của mascot ở đây (design 01_xep_hang) — không đè tagline giữa;
              màn gốc (hero) giữ câu "Better TAs · Brighter Students" */}
          {bubble && !hero
            ? <span className="font-hand relative max-w-[128px] rounded-2xl rounded-bl-sm bg-white px-2.5 py-1.5 text-center text-[12px] italic leading-tight text-[#2F73F6] shadow-sm">{bubble}</span>
            : <span className="font-hand max-w-[120px] -rotate-6 text-right text-[13px] italic leading-tight text-[#2F73F6]">Better TAs<br />Brighter Students ♡</span>}
        </div>
        <div className="-mt-4 text-center">
          <span className="text-[18px] text-[#FFD84D]">👑</span>
          <h1 className="font-bubble leading-none"
            style={{
              fontWeight: 800, fontSize: hero ? 46 : 38, letterSpacing: hero ? 1 : 0,
              color: '#fff', WebkitTextStroke: '2px #2F73F6', paintOrder: 'stroke fill',
              textShadow: '0 4px 0 rgba(23,77,175,.35), 0 8px 16px rgba(47,115,246,.25)',
            }}>{hero ? title.toUpperCase() : title}</h1>
          {tagline && <p className="font-hand mx-auto mt-1 max-w-[240px] text-[14px] italic leading-snug text-[#3B62C4]">{tagline}</p>}
        </div>
      </div>
      {/* mascot góc dưới-phải, đè nhẹ lên thẻ hồ sơ như thiết kế */}
      <div className="absolute bottom-0 right-3 z-10">
        {/* bong bóng lời đặt ngang đầu mascot, bên trái — không đè lên tagline ở giữa */}
        {bubble && hero && <span className="font-hand absolute top-2 right-[92px] whitespace-nowrap rounded-2xl rounded-br-sm bg-white px-2.5 py-1 text-[12.5px] italic text-[#2F73F6] shadow-sm">{bubble}</span>}
        <img src={mascot} alt="" className="h-[92px] w-[92px] object-contain drop-shadow-md" draggable={false} />
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
    <div className="relative z-20 mx-auto -mt-3 w-full max-w-[1000px] px-1">
      {/* 1 HÀNG như thiết kế: avatar · tên/tags · 2 ô số. Màn hẹp (<430px) 2 ô xếp dọc; rộng hơn đứng cạnh nhau.
          Gọn theo chiều cao (cả màn gốc phải nằm trong 1 màn iPhone, không cuộn) */}
      <div className="flex items-center gap-2.5 rounded-[22px] bg-white/95 px-3 py-2.5 shadow-[0_4px_14px_rgba(22,34,77,.10)]">
        {/* avatar khung tròn viền pastel dày + tim nhỏ như thiết kế; ảnh không vuông vẫn tròn nhờ object-cover */}
        <span className="relative shrink-0">
          {anhUrl
            ? <img src={anhUrl} alt="" className="block h-[60px] w-[60px] rounded-full object-cover ring-[4px] ring-[#DCE6FF]" />
            : <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#DDF4FF] font-bubble text-[26px] font-extrabold text-[#2F73F6] ring-[4px] ring-[#DCE6FF]">{tenGoi.charAt(0).toUpperCase()}</span>}
          <span className="absolute -left-1 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[10px] shadow-sm">💗</span>
        </span>
        <div className="min-w-0 flex-1">
          {/* tên KHÔNG cắt (tên Việt dài) — cho xuống 2 dòng; câu phụ chỉ hiện khi màn ≥430px */}
          <p className="font-bubble text-[15.5px] font-extrabold leading-tight text-[#16224D]">{ten}</p>
          <p className="hidden truncate text-[11px] text-[#63709A] min-[430px]:block">Cùng nhau tạo nên giá trị tốt đẹp hơn! 💙</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.map((t) => <span key={t} className="rounded-full bg-[#EEF3FF] px-1.5 py-0.5 text-[9px] font-semibold text-[#2F73F6]">{t}</span>)}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1 min-[430px]:flex-row">
          <div className="flex w-[110px] items-center gap-1.5 rounded-xl bg-[#EEF3FF] px-2 py-1 min-[430px]:w-auto min-[430px]:px-2.5">
            <img src="/bk-ui/coin_star.png" alt="" className="h-6 w-6 object-contain" draggable={false} />
            <div className="leading-tight">
              <p className="whitespace-nowrap text-[8.5px] font-semibold text-[#63709A]">Điểm tích lũy</p>
              <p className="text-[15px] font-extrabold leading-none text-[#16224D]">{diem == null ? '—' : diem.toLocaleString('vi-VN')}{streak != null && streak > 0 && <span className="ml-1 text-[8.5px] font-semibold text-[#FF8A3D]">🔥{streak}</span>}</p>
            </div>
          </div>
          <button onClick={onPct} className="flex w-[110px] items-center gap-1.5 rounded-xl bg-[#E8F9EF] px-2 py-1 text-left active:bg-[#d6f2e2] min-[430px]:w-auto min-[430px]:px-2.5">
            <BKProgressRing pct={pct ?? 0} size={24} stroke={4} color={BK.success} />
            <div className="leading-tight">
              <p className="whitespace-nowrap text-[8.5px] font-semibold leading-[1.1] text-[#63709A]">Hoàn thành<br />nhiệm vụ</p>
              <p className="text-[15px] font-extrabold leading-none text-[#16224D]">{pct == null ? '—' : `${pct}%`}</p>
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
      className="relative flex h-full min-h-[100px] items-stretch overflow-hidden rounded-[20px] p-2 text-left transition duration-100 active:scale-[.98] disabled:opacity-60"
      // KHÔNG bóng đổ / viền mờ — CEO 07/09: "lớp xanh xanh mờ mờ ở khe giữa các box" chính là shadow lan ra nền trời
      style={{ background: `linear-gradient(160deg, ${gradient[0]}, ${gradient[1]})` }}>
      {/* badge "sắp mở" thế chỗ ngôi sao góc trên-trái (trên vùng ảnh) — góc phải là tiêu đề, đè lên là mất chữ */}
      {badge
        ? <span className="absolute left-2 top-1.5 z-10 rounded-full bg-white/90 px-1.5 py-px text-[9px] font-bold text-[#63709A] shadow-sm">{badge}</span>
        : <span className="pointer-events-none absolute left-2 top-1 text-[12px] text-[#FFD84D]">✦</span>}
      {/* Đúng design: icon TO bên trái (~46%), chữ NHỎ bên phải; câu chữ tay nghiêng góc dưới cột chữ, nút mũi tên góc dưới-phải */}
      <img src={image} alt="" className="w-[46%] shrink-0 self-center object-contain drop-shadow-sm" draggable={false} />
      <div className="flex min-w-0 flex-1 flex-col pl-1 pt-0.5">
        <p className="font-bubble text-[14px] font-extrabold leading-tight tracking-tight text-[#16224D]">{title}</p>
        <p className="mt-px text-[9px] leading-snug text-[#63709A]">{sub}</p>
        <p className="font-hand mt-auto -rotate-3 pb-1 pr-7 text-[10.5px] italic leading-[1.1]" style={{ color: accent }}>{tagline}</p>
      </div>
      <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-[15px] font-bold text-white shadow-sm" style={{ background: accent }}>›</span>
    </button>
  )
}

// ── Thẻ section / tile số / pill trạng thái / segmented ─────────────────────
export function BKSectionCard({ children, tone, className = '' }: { children: ReactNode; tone?: BKTone; className?: string }) {
  const bg = tone ? `${TONE[tone].bg} border ${TONE[tone].border}` : 'bg-white'
  return <div className={`rounded-3xl p-4 shadow-[0_4px_14px_rgba(22,34,77,.08)] ${bg} ${className}`}>{children}</div>
}
export function BKSectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return <div className="mb-2 flex items-center justify-between px-1"><p className="font-bubble text-[18px] font-extrabold text-[#16224D]">{children}</p>{right}</div>
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
    <div className="relative mt-1 flex items-center gap-2.5 overflow-hidden rounded-[20px] bg-white/70 px-3 py-2">
      <img src="/bk-ui/mascot_cheer.png" alt="" className="h-12 w-12 shrink-0 object-contain" draggable={false} />
      <div className="min-w-0 flex-1">
        <span className="font-bubble inline-block rounded-xl bg-[#EAE2FF] px-2.5 py-0.5 text-[12.5px] font-bold text-[#6A4BD6]">{text}</span>
        {sub && <p className="mt-0.5 truncate text-[10.5px] text-[#63709A]">{sub}</p>}
      </div>
      <span className="font-hand pointer-events-none absolute right-3 top-1.5 -rotate-6 text-[11px] italic leading-tight text-[#2F73F6]">Small TAs<br />Big Impact ♡</span>
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
