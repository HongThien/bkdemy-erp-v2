// ============================================================================
// BaiTapGiaoHS — Màn "Bài tập được giao" (Thùy 11/09). Placeholder "đang phát triển".
// Layout dựng theo KIT `design/handoff/hs-*-v1` để KHỚP theme HomeHS: BACKDROP mây + decor + quote
// handwritten + header squircle đúng theme nam/nữ. Card trung tâm hiển thị thông báo "sắp ra mắt"
// + biểu tượng công trình + doodle chữ viết tay động viên.
// ============================================================================
const A = '/bk-ui/hs'
const NAVY = '#0F1745'
const THEME = {
  nam: { bg: `${A}/bg_home_male.jpg`, decor: `${A}/decor_books.png`, primary: '#1673D8', sec: '#6E7EAA',
    cardTint: 'linear-gradient(160deg,#ffffff,#f6f9ff)', shadow: '0 8px 24px rgba(76,108,170,.10)',
    quote: 'Sẽ có thêm\nnhiều điều mới!', quoteColor: '#4A5BC4', plane: true, underline: false, iconTint: '#E8ECFF' },
  nu:  { bg: `${A}/bg_home_female.jpg`, decor: `${A}/decor_books_female.png`, primary: '#F23886', sec: '#756F9F',
    cardTint: 'linear-gradient(160deg,#ffffff,#fff5fb)', shadow: '0 8px 24px rgba(182,96,145,.10)',
    quote: 'Đợi mình xíu\nnhé bạn ơi ♡', quoteColor: '#E84A8F', plane: false, underline: true, iconTint: '#F3E4F6' },
}

export default function BaiTapGiaoHS({ gioiTinh, onXong }: { gioiTinh: 'nam' | 'nu' | null; onXong: () => void }) {
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']
  return (
    <div className="font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] overflow-hidden" style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      <img src={t.bg} alt="" className="pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col items-end">
        <div className="font-hand mb-1 mr-[14%] -rotate-[6deg] whitespace-pre-line text-right text-[20px] leading-[1.15]" style={{ color: t.quoteColor }}>{t.quote}</div>
        <img src={t.decor} alt="" className="block w-[46%]" style={{ marginRight: '-2%', marginBottom: '-2%' }} />
      </div>

      <div className="relative px-4 pb-[46vh] pt-[calc(10px+env(safe-area-inset-top))]">
        <div className="relative flex items-start gap-3">
          <button onClick={onXong} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white active:scale-95" style={{ boxShadow: t.shadow }}>
            <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none" aria-hidden><path d="M29 10L15 24l14 14" stroke="#5B69A8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="min-w-0 pt-0.5">
            <h1 className="relative inline-block text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>
              Bài tập được giao
              {t.underline && <span className="absolute -bottom-1 left-[35%] h-[3px] w-[55%] rounded-full" style={{ background: t.primary, opacity: .8 }} />}
            </h1>
            {!t.underline && <p className="mt-1 text-[9.5px] font-semibold tracking-[0.22em]" style={{ color: t.sec }}>— BK ACADEMY —</p>}
            <p className="mt-1.5 text-[12.5px]" style={{ color: t.sec }}>Tính năng đang phát triển</p>
          </div>
          <img src={`${A}/sparkle.svg`} alt="" className="pointer-events-none absolute right-2 top-0 h-4 w-4" />
          {t.plane
            ? <img src={`${A}/paper_plane.svg`} alt="" className="pointer-events-none absolute right-14 top-10 h-10 w-10" />
            : <span className="pointer-events-none absolute right-14 top-2 text-[18px]" style={{ color: t.primary }}>♡</span>}
        </div>

        <div className="mt-6 rounded-[26px] p-8 text-center" style={{ background: t.cardTint, boxShadow: t.shadow }}>
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-[24px]" style={{ background: t.iconTint }}>
            <span className="text-[42px]">🚧</span>
          </div>
          <p className="text-[17px] font-extrabold" style={{ color: NAVY }}>Sắp ra mắt</p>
          <p className="mx-auto mt-2 max-w-[300px] text-[13px] leading-relaxed" style={{ color: t.sec }}>
            Thầy cô sẽ giao thêm bài tập riêng cho em ở đây khi cần bổ trợ điểm yếu.
            Hiện tại em cứ chăm chỉ <b style={{ color: t.primary }}>Tự luyện</b> để nâng cao mastery nhé!
          </p>
          <p className="font-hand mt-4 -rotate-[3deg] text-[16px]" style={{ color: t.quoteColor }}>Cứ luyện chăm là giỏi ♡</p>
        </div>
      </div>
    </div>
  )
}
