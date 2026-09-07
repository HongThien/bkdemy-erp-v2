// ============================================================================
// DanhSachHS — màn DANH SÁCH BÀI của 1 khu (Bài tập trên lớp / ET / BTVN — cùng 1 component, chỉ khác
// tiêu đề + minh hoạ + dữ liệu; CEO 08/09: "chuẩn đấy"). Dựng theo KIT `design/handoff/hs-bai-tap-tren-lop-v1`
// (reference_male/female, canvas 941 → 430 = ×0.457). Quy tắc kit: TEXT/SHAPE = code · GLYPH = SVG inline ·
// ILLUST/DECOR/BACKDROP = PNG dùng CHUNG với kit Home (md5 trùng) ở public/bk-ui/hs.
// Kit chỉ vẽ 1 trạng thái ("Chưa làm", 1 bài mới) — các pill đang làm / quá hạn / hoàn thành + dòng hạn nộp
// do mình suy theo bảng màu kit (CEO 08/09: "ok không khác nhiều, quan trọng nhất là nhân vật, backdrop, icon").
// Decor + quote CỐ ĐỊNH ở đáy làm nền, danh sách cuộn đè lên (CEO: "màn này không nhiều đâu, decor thoải mái").
// Chữ viết tay = Pacifico (CEO chốt cho app HS; DESIGN.md kit ghi Itim vì sinh từ md bản cũ).
// ============================================================================
import type { ReactNode } from 'react'

const A = '/bk-ui/hs'
const NAVY = '#0F1745'

export type DsTrangThai = 'moi' | 'dang_lam' | 'qua_han' | 'xong'
export type DsRow = {
  id: string
  ten: string           // "Bài tập Toán · 11A1"
  sub: string           // "Buổi 19/08/2026 · 87 câu"
  laThi?: boolean       // badge THI (ET / đề thi / retest — nộp 1 lần)
  trangThai: DsTrangThai
  han?: { text: string; muc: 'qua_han' | 'sat' | 'gan' | 'con_nhieu' } | null // dòng "⏳ Hạn … · còn 2 ngày"
  khoa: boolean         // quá hạn chưa nộp → không mở được
  onClick: () => void
}

// 2 theme theo kit §2 (male/female). Chỉ khác màu + backdrop + decor + quote; bố cục y hệt.
const THEME = {
  nam: {
    bg: `${A}/bg_home_male.jpg`, decor: `${A}/decor_books.png`, primary: '#1673D8', sec: '#6E7EAA',
    tabBg: '#DDE8F7', iconTint: '#E8ECFF', cardTint: 'linear-gradient(160deg,#ffffff,#f6f9ff)', shadow: '0 8px 24px rgba(76,108,170,.10)',
    quote: 'Cố gắng hôm nay\nđể tốt hơn ngày mai!', quoteColor: '#4A5BC4', plane: true, underline: false,
  },
  nu: {
    bg: `${A}/bg_home_female.jpg`, decor: `${A}/decor_books_female.png`, primary: '#F23886', sec: '#756F9F',
    tabBg: '#F2DDEC', iconTint: '#F3E4F6', cardTint: 'linear-gradient(160deg,#ffffff,#fff5fb)', shadow: '0 8px 24px rgba(182,96,145,.10)',
    quote: 'Cố lên\nbạn nhé!', quoteColor: '#E84A8F', plane: false, underline: true,
  },
}

// Màu pill trạng thái — suy từ palette kit (mới = primary nhạt như mockup; còn lại theo ngữ nghĩa app cũ)
const PILL: Record<DsTrangThai, { bg: string; c: string; nhan: string }> = {
  moi:      { bg: '#E3EEFF', c: '#1673D8', nhan: 'mới' },
  dang_lam: { bg: '#FFF0D6', c: '#E08A1E', nhan: 'đang làm' },
  qua_han:  { bg: '#FFE3E6', c: '#E0405A', nhan: 'quá hạn' },
  xong:     { bg: '#DDF7EA', c: '#1E9E6A', nhan: '✓ hoàn thành' },
}
const HAN_MAU = { qua_han: '#E0405A', sat: '#E08A1E', gan: '#E08A1E', con_nhieu: '#6E7EAA' }

function Chevron({ color, className }: { color: string; className?: string }) {
  return <svg viewBox="0 0 48 48" className={className ?? 'h-5 w-5'} fill="none" aria-hidden><path d="M19 10l14 14-14 14" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function DanhSachHS({ tieuDe, ill, gioiTinh, tab, nChua, nXong, rows, dangTai, onBack, onTab, empty }: {
  tieuDe: string; ill: string; gioiTinh: 'nam' | 'nu' | null
  tab: 'chua' | 'xong'; nChua: number; nXong: number; rows: DsRow[]; dangTai: boolean
  onBack: () => void; onTab: (t: 'chua' | 'xong') => void; empty: ReactNode
}) {
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  return (
    <div className="font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] overflow-hidden" style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      {/* BACKDROP (chung kit Home) — cố định, không cuộn theo nội dung */}
      <img src={t.bg} alt="" className="pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover" />
      {/* DECOR + QUOTE cố định ở đáy làm nền — danh sách cuộn đè lên */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col items-end">
        {/* quote nằm TRÊN decor, lệch trái một chút như reference (không đè lên sách) */}
        <div className="font-hand mb-1 mr-[14%] -rotate-[6deg] whitespace-pre-line text-right text-[20px] leading-[1.15]" style={{ color: t.quoteColor }}>{t.quote}</div>
        <img src={t.decor} alt="" className="block w-[46%]" style={{ marginRight: '-2%', marginBottom: '-2%' }} />
      </div>

      <div className="relative px-4 pb-[46vh] pt-[calc(10px+env(safe-area-inset-top))]">
        {/* TOP — nút back squircle + tiêu đề rất to; nam có "— BK ACADEMY —" + máy bay giấy, nữ có gạch hồng + tim */}
        <div className="relative flex items-start gap-3">
          <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white active:scale-95" style={{ boxShadow: t.shadow }}>
            <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none" aria-hidden><path d="M29 10L15 24l14 14" stroke="#5B69A8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="min-w-0 pt-0.5">
            <h1 className="relative inline-block text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>
              {tieuDe}
              {t.underline && <span className="absolute -bottom-1 left-[35%] h-[3px] w-[55%] rounded-full" style={{ background: t.primary, opacity: .8 }} />}
            </h1>
            {!t.underline && <p className="mt-1 text-[9.5px] font-semibold tracking-[0.22em]" style={{ color: t.sec }}>— BK ACADEMY —</p>}
          </div>
          {/* GLYPH trang trí (kit svg: sparkle, paper_plane) — tiết chế */}
          <img src={`${A}/sparkle.svg`} alt="" className="pointer-events-none absolute right-2 top-0 h-4 w-4" />
          {t.plane
            ? <img src={`${A}/paper_plane.svg`} alt="" className="pointer-events-none absolute right-14 top-10 h-10 w-10" />
            : <span className="pointer-events-none absolute right-24 top-0 text-[14px]" style={{ color: t.primary }}>♡</span>}
        </div>

        {/* TABS — pill dài pastel, tab active trắng chữ primary */}
        <div className="mt-6 grid grid-cols-2 rounded-full p-1" style={{ background: t.tabBg }}>
          {([['chua', 'Chưa làm', nChua], ['xong', 'Hoàn thành', nXong]] as const).map(([k, label, n]) => (
            <button key={k} onClick={() => onTab(k)}
              className="rounded-full py-2.5 text-[14px] font-bold transition"
              style={tab === k ? { background: '#fff', color: t.primary, boxShadow: t.shadow } : { color: t.sec }}>
              {label} {n > 0 && <span className="font-medium" style={{ color: tab === k ? t.primary : t.sec, opacity: .85 }}>({n})</span>}
            </button>
          ))}
        </div>

        {dangTai && <p className="py-10 text-center text-sm" style={{ color: t.sec }}>Đang tải…</p>}
        {!dangTai && rows.length === 0 && <div className="mt-4">{empty}</div>}

        {/* CARD bài — icon box tint + tên/buổi + pill trạng thái + chevron + CTA */}
        <div className="mt-4 flex flex-col gap-3">
          {rows.map((r) => {
            const pill = PILL[r.trangThai]
            const cta = r.khoa ? 'Đã đóng — không nộp được nữa' : r.trangThai === 'xong' ? 'Xem lại' : r.trangThai === 'dang_lam' ? 'Tiếp tục' : 'Bắt đầu'
            return (
              <button key={r.id} disabled={r.khoa} onClick={r.onClick}
                className={`relative rounded-[26px] p-4 text-left transition ${r.khoa ? 'opacity-70 saturate-50' : 'active:scale-[0.98]'}`}
                style={{ background: t.cardTint, boxShadow: r.khoa ? 'none' : t.shadow }}>
                <div className="flex items-start gap-3">
                  <span className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[20px]" style={{ background: t.iconTint }}>
                    <img src={`${A}/ill_${ill}.png`} alt="" className="h-[52px] w-[52px] object-contain" />
                    {/* 2 vạch "toả sáng" cạnh icon như reference — SHAPE nhỏ, không asset */}
                    <svg viewBox="0 0 20 20" className="absolute -right-2.5 -top-1.5 h-5 w-5" fill="none" aria-hidden>
                      <path d="M4 12l3-6M10 9l3-6" stroke={t.primary} strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1 pr-12 pt-1">
                    <span className="block truncate text-[17px] font-extrabold leading-tight" style={{ color: NAVY }}>
                      {r.laThi && <span className="mr-1.5 rounded-md px-1.5 py-0.5 align-middle text-[10.5px] font-bold" style={{ background: '#EEE6FF', color: '#7B61E8' }}>THI</span>}
                      {r.ten}
                    </span>
                    <span className="mt-1 block text-[13px]" style={{ color: t.sec }}>{r.sub}</span>
                    {r.han && r.trangThai !== 'xong' && (
                      <span className="mt-1 block text-[12.5px] font-semibold" style={{ color: HAN_MAU[r.han.muc] }}>⏳ {r.han.text}</span>
                    )}
                  </span>
                </div>
                <span className="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={{ background: pill.bg, color: pill.c }}>{pill.nhan}</span>
                <span className="absolute right-4 top-[52px]"><Chevron color={t.sec} /></span>
                <span className="mt-3 block text-[17px] font-extrabold" style={{ color: r.khoa ? t.sec : t.primary }}>{cta}{!r.khoa && ' →'}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
