// ============================================================================
// ThanhTuuHS — Màn "Thành tựu" cho HS cấp 2 (Thùy 11/09).
// Nội dung: giải thưởng cuối tháng đã CÔNG BỐ (fn_hs_thanh_tuu_cua_toi) + placeholder Huy hiệu.
// Layout dựng theo KIT `design/handoff/hs-*-v1` để KHỚP theme HomeHS: BACKDROP mây (bg_home_*.jpg)
// cố định · decor + quote handwritten cố định đáy · header squircle + tiêu đề extrabold theo giới
// tính · card gradient trắng + shadow theo theme. Chữ viết tay = Pacifico, UI = Baloo.
// ============================================================================
import { useEffect, useState } from 'react'
import { thanhTuuCuaToi, LOAI_GIAI_TEN, THANH_TUU_ICON, THANH_TUU_MAU, type ThanhTuuHS as TT } from '../../lib/thanhtuu_hs'

const A = '/bk-ui/hs'
const NAVY = '#0F1745'
const THEME = {
  nam: { bg: `${A}/bg_home_male.jpg`, decor: `${A}/decor_books.png`, primary: '#1673D8', sec: '#6E7EAA',
    cardTint: 'linear-gradient(160deg,#ffffff,#f6f9ff)', shadow: '0 8px 24px rgba(76,108,170,.10)',
    quote: 'Nỗ lực hôm nay\ngặt hái ngày mai!', quoteColor: '#4A5BC4', plane: true, underline: false },
  nu:  { bg: `${A}/bg_home_female.jpg`, decor: `${A}/decor_books_female.png`, primary: '#F23886', sec: '#756F9F',
    cardTint: 'linear-gradient(160deg,#ffffff,#fff5fb)', shadow: '0 8px 24px rgba(182,96,145,.10)',
    quote: 'Mỗi giải\nlà một dấu ấn ♡', quoteColor: '#E84A8F', plane: false, underline: true },
}

function labelThang(ym: string): string { const [y, m] = ym.split('-'); return `Tháng ${parseInt(m, 10)}/${y}` }

export default function ThanhTuuHS({ gioiTinh, onXong }: { gioiTinh: 'nam' | 'nu' | null; onXong: () => void }) {
  const [items, setItems] = useState<TT[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    thanhTuuCuaToi().then(setItems).catch((e) => { setErr(e?.message ?? String(e)); setItems([]) })
  }, [])
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']

  const byThang = new Map<string, TT[]>()
  for (const it of items ?? []) { const arr = byThang.get(it.thang) ?? []; arr.push(it); byThang.set(it.thang, arr) }
  const thangs = [...byThang.keys()]
  const coData = items && items.length > 0

  return (
    <div className="font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] overflow-hidden" style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      {/* BACKDROP — cố định, không cuộn */}
      <img src={t.bg} alt="" className="pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover" />
      {/* DECOR + QUOTE cố định đáy */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col items-end">
        <div className="font-hand mb-1 mr-[14%] -rotate-[6deg] whitespace-pre-line text-right text-[20px] leading-[1.15]" style={{ color: t.quoteColor }}>{t.quote}</div>
        <img src={t.decor} alt="" className="block w-[46%]" style={{ marginRight: '-2%', marginBottom: '-2%' }} />
      </div>

      <div className="relative px-4 pb-[46vh] pt-[calc(10px+env(safe-area-inset-top))]">
        {/* Header — squircle back + tiêu đề extrabold */}
        <div className="relative flex items-start gap-3">
          <button onClick={onXong} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white active:scale-95" style={{ boxShadow: t.shadow }}>
            <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none" aria-hidden><path d="M29 10L15 24l14 14" stroke="#5B69A8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="min-w-0 pt-0.5">
            <h1 className="relative inline-block text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>
              Thành tựu của em
              {t.underline && <span className="absolute -bottom-1 left-[35%] h-[3px] w-[55%] rounded-full" style={{ background: t.primary, opacity: .8 }} />}
            </h1>
            {!t.underline && <p className="mt-1 text-[9.5px] font-semibold tracking-[0.22em]" style={{ color: t.sec }}>— BK ACADEMY —</p>}
            <p className="mt-1.5 text-[12.5px]" style={{ color: t.sec }}>Giải thưởng cuối tháng · huy hiệu sắp có</p>
          </div>
          <img src={`${A}/sparkle.svg`} alt="" className="pointer-events-none absolute right-2 top-0 h-4 w-4" />
          {t.plane
            ? <img src={`${A}/paper_plane.svg`} alt="" className="pointer-events-none absolute right-14 top-10 h-10 w-10" />
            : <span className="pointer-events-none absolute right-14 top-2 text-[18px]" style={{ color: t.primary }}>♡</span>}
        </div>

        {items === null && <p className="py-10 text-center text-sm" style={{ color: t.sec }}>Đang tải…</p>}
        {err && <p className="mt-4 rounded-2xl bg-[#FFE3EA] px-3 py-2 text-center text-[12px] font-semibold" style={{ color: '#C0355A' }}>⚠ {err}</p>}

        {items && !coData && (
          <div className="mt-6 rounded-[26px] p-8 text-center" style={{ background: t.cardTint, boxShadow: t.shadow }}>
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-[20px]" style={{ background: t.underline ? '#F3E4F6' : '#E8ECFF' }}>
              <span className="text-[36px]">🏅</span>
            </div>
            <p className="text-[16px] font-extrabold" style={{ color: NAVY }}>Chưa có thành tựu nào</p>
            <p className="mx-auto mt-1.5 max-w-[280px] text-[12.5px] leading-relaxed" style={{ color: t.sec }}>
              Cố lên nhé! Cuối tháng thầy cô sẽ trao giải cho các bạn <b style={{ color: t.primary }}>xuất sắc / tiến bộ / chăm chỉ</b>.
            </p>
            <p className="font-hand mt-3 -rotate-[3deg] text-[16px]" style={{ color: t.quoteColor }}>Đầy tự hào ♡</p>
          </div>
        )}

        {coData && (
          <div className="mt-4 flex flex-col gap-4">
            {thangs.map((ym) => (
              <section key={ym}>
                <p className="mb-2 ml-1 text-[10.5px] font-extrabold uppercase tracking-[0.2em]" style={{ color: t.sec }}>{labelThang(ym)}</p>
                <div className="flex flex-col gap-3">
                  {byThang.get(ym)!.map((it) => {
                    const mau = THANH_TUU_MAU[it.loai_giai]
                    return (
                      <div key={it.id} className="relative flex items-center gap-3 rounded-[26px] p-4" style={{ background: t.cardTint, boxShadow: t.shadow }}>
                        <span className="relative flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[18px]" style={{ background: mau.nen, border: `1.5px solid ${mau.vien}` }}>
                          <span className="text-[32px]">{THANH_TUU_ICON[it.loai_giai]}</span>
                          <svg viewBox="0 0 20 20" className="absolute -right-2 -top-1.5 h-4 w-4" fill="none" aria-hidden>
                            <path d="M4 12l3-6M10 9l3-6" stroke={t.primary} strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
                          </svg>
                        </span>
                        <div className="min-w-0 flex-1 pr-1">
                          <p className="text-[16.5px] font-extrabold leading-tight" style={{ color: mau.chu }}>Giải {LOAI_GIAI_TEN[it.loai_giai]}</p>
                          <p className="mt-1 text-[12.5px] font-semibold" style={{ color: NAVY, opacity: .8 }}>{it.mon}{it.ten_lop ? ` · ${it.ten_lop}` : ''}</p>
                          <p className="mt-0.5 text-[11px]" style={{ color: t.sec }}>Công bố {new Date(it.cong_bo_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}

            {/* Placeholder Huy hiệu */}
            <section>
              <p className="mb-2 ml-1 text-[10.5px] font-extrabold uppercase tracking-[0.2em]" style={{ color: t.sec }}>Huy hiệu</p>
              <div className="rounded-[26px] p-6 text-center" style={{ background: t.cardTint, boxShadow: t.shadow, border: `1.5px dashed ${t.underline ? '#F3E4F6' : '#DDE8F7'}` }}>
                <p className="text-3xl">🎖️</p>
                <p className="mt-1.5 text-[14px] font-extrabold" style={{ color: NAVY }}>Sắp ra mắt</p>
                <p className="mt-0.5 text-[11.5px]" style={{ color: t.sec }}>Huy hiệu + mốc học tập sẽ hiện ở đây.</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
