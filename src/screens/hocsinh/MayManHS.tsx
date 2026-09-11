// ============================================================================
// MayManHS — Vòng quay may mắn cho HS cấp 2 (Thùy 11/09).
// Layout dựng theo KIT `design/handoff/hs-*-v1` KHỚP HomeHS/DanhSachHS: BACKDROP mây + decor +
// quote handwritten + header squircle đúng theme nam/nữ. Vòng quay đặt trong CARD trắng để nổi
// bật trên nền mây (không thả thẳng vào nền, sẽ chìm mất pattern).
// Server quyết giải (fn_may_man_hs_quay) — client CHỈ chạy animation tới ô server trả về.
// Điều kiện: batch 10 câu tự luyện hôm nay đúng ≥70%. Tối đa 1 lượt/ngày.
// Phần thưởng: 50 EXP (40%) · 100 EXP (40%) · 150 EXP (15%) · 200 EXP (5%).
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import { mayManHSCuaToi, mayManHSQuay, type MayManHSCuaToi, type MayManHSKetQua } from '../../lib/maymai_hs'

const A = '/bk-ui/hs'
const NAVY = '#0F1745'
const THEME = {
  nam: { bg: `${A}/bg_home_male.jpg`, decor: `${A}/decor_books.png`, primary: '#1673D8', sec: '#6E7EAA',
    cardTint: 'linear-gradient(160deg,#ffffff,#f6f9ff)', shadow: '0 8px 24px rgba(76,108,170,.10)',
    quote: 'Luyện chăm\ngặp may nhé!', quoteColor: '#4A5BC4', plane: true, underline: false, iconTint: '#E8ECFF' },
  nu:  { bg: `${A}/bg_home_female.jpg`, decor: `${A}/decor_books_female.png`, primary: '#F23886', sec: '#756F9F',
    cardTint: 'linear-gradient(160deg,#ffffff,#fff5fb)', shadow: '0 8px 24px rgba(182,96,145,.10)',
    quote: 'Chút may mắn\ncho bạn ♡', quoteColor: '#E84A8F', plane: false, underline: true, iconTint: '#F3E4F6' },
}

// 4 ô theo chiều kim đồng hồ, ô đầu ở đỉnh dưới mũi kim. 2 giải hiếm (200/150) đối diện 2 giải
// phổ biến (50/100) để bánh xe cân đối; server chỉ trả `exp`, client tìm index tương ứng.
type O = { exp: number; mau: string; icon: string; nhan: string }
const O_LIST: O[] = [
  { exp: 100, mau: '#BFE0FF', icon: '🎁', nhan: '100 EXP' },
  { exp: 200, mau: '#FFD1E1', icon: '💎', nhan: '200 EXP' },
  { exp: 50,  mau: '#FFEAA5', icon: '⭐', nhan: '50 EXP'  },
  { exp: 150, mau: '#D6C8FF', icon: '🎉', nhan: '150 EXP' },
]
const oCua = (exp: number) => O_LIST.findIndex((o) => o.exp === exp)

function Wheel({ goc, size }: { goc: number; size: number }) {
  const n = O_LIST.length, g = 360 / n
  const bg = `conic-gradient(from ${-g / 2}deg, ${O_LIST.map((o, i) => `${o.mau} ${i * g}deg ${(i + 1) * g}deg`).join(', ')})`
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* Kim (SVG) chỉ xuống đỉnh bánh xe */}
      <svg viewBox="0 0 48 64" className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 drop-shadow-md" style={{ top: -size * 0.06, width: size * 0.16 }} aria-hidden>
        <path d="M24 62C24 62 4 38 4 22a20 20 0 0 1 40 0c0 16-20 40-20 40z" fill="#FF5D8A" stroke="#C4325E" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 60C24 60 8 38 8 22a16 16 0 0 1 32 0c0 16-16 38-16 38z" fill="#FF7FA8" />
        <circle cx="24" cy="22" r="9" fill="#fff" stroke="#C4325E" strokeWidth="2" />
        <circle cx="21" cy="19" r="2.5" fill="#FFD6E4" />
      </svg>
      {/* Đĩa quay — viền vàng + 4 ô conic + tâm cỏ 4 lá */}
      <div className="h-full w-full rounded-full p-[6px] shadow-[0_8px_24px_rgba(22,34,77,.18)]"
        style={{ background: 'radial-gradient(circle at 50% 30%, #FFE59A, #F5B63A 70%, #D9962A)', transform: `rotate(${goc}deg)`, transition: 'transform 4.2s cubic-bezier(.17,.67,.12,1)' }}>
        <div className="relative h-full w-full rounded-full ring-[3px] ring-white/70" style={{ background: bg }}>
          {O_LIST.map((o, i) => {
            const a = i * g
            const r = size * 0.30
            return (
              <div key={i} className="absolute left-1/2 top-1/2 flex flex-col items-center text-center"
                style={{ width: size * 0.3, transform: `translate(-50%,-50%) rotate(${a}deg) translateY(-${r}px) rotate(${-a}deg)` }}>
                <span className="mb-0.5 text-[26px] leading-none">{o.icon}</span>
                <span className="whitespace-nowrap font-extrabold leading-none text-[#16224D]" style={{ fontSize: size * 0.045 }}>{o.nhan}</span>
              </div>
            )
          })}
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-[3px] ring-[#FFE59A]" style={{ width: size * 0.22, height: size * 0.22 }}>
            <span className="text-[28px]">🍀</span>
          </span>
        </div>
      </div>
    </div>
  )
}

const luc = (iso: string) => {
  const ph = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  return ph < 1 ? 'vừa xong' : ph < 60 ? `${ph} phút trước` : ph < 1440 ? `${Math.floor(ph / 60)} giờ trước` : `${Math.floor(ph / 1440)} ngày trước`
}

export default function MayManHS({ gioiTinh, onXong }: { gioiTinh: 'nam' | 'nu' | null; onXong: () => void }) {
  const [d, setD] = useState<MayManHSCuaToi | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [goc, setGoc] = useState(0)
  const [dangQuay, setDangQuay] = useState(false)
  const [kq, setKq] = useState<MayManHSKetQua | null>(null)
  const vong = useRef(0)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']

  const load = () => mayManHSCuaToi().then(setD).catch((e) => setErr(e?.message ?? String(e)))
  useEffect(() => { load() }, [])

  async function quay() {
    if (dangQuay || !d || d.hom_nay || !d.du_dieu_kien.du || !d.active) return
    setDangQuay(true); setErr(null)
    try {
      const r = await mayManHSQuay()
      const idx = Math.max(0, oCua(r.exp))
      vong.current += 5
      setGoc(vong.current * 360 - idx * 90)  // ô i ở góc i*90° → xoay -i*90 để kim trỏ vào ô i
      setTimeout(() => { setKq(r); setDangQuay(false); load() }, 4400)
    } catch (e: any) { setErr(e?.message ?? String(e)); setDangQuay(false) }
  }

  const daQuay = !!d?.hom_nay
  const du = !!d?.du_dieu_kien.du
  const conLuot = d ? !daQuay && du && d.active : false

  return (
    <div className="font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] overflow-hidden" style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      {/* BACKDROP + decor + quote — cùng pattern kit */}
      <img src={t.bg} alt="" className="pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col items-end">
        <div className="font-hand mb-1 mr-[14%] -rotate-[6deg] whitespace-pre-line text-right text-[20px] leading-[1.15]" style={{ color: t.quoteColor }}>{t.quote}</div>
        <img src={t.decor} alt="" className="block w-[46%]" style={{ marginRight: '-2%', marginBottom: '-2%' }} />
      </div>

      <div className="relative px-4 pb-[46vh] pt-[calc(10px+env(safe-area-inset-top))]">
        {/* Header đồng bộ Danh sách/Thành tựu */}
        <div className="relative flex items-start gap-3">
          <button onClick={onXong} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white active:scale-95" style={{ boxShadow: t.shadow }}>
            <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none" aria-hidden><path d="M29 10L15 24l14 14" stroke="#5B69A8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="min-w-0 pt-0.5">
            <h1 className="relative inline-block text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>
              May mắn hôm nay
              {t.underline && <span className="absolute -bottom-1 left-[35%] h-[3px] w-[55%] rounded-full" style={{ background: t.primary, opacity: .8 }} />}
            </h1>
            {!t.underline && <p className="mt-1 text-[9.5px] font-semibold tracking-[0.22em]" style={{ color: t.sec }}>— BK ACADEMY —</p>}
            <p className="mt-1.5 text-[12.5px]" style={{ color: t.sec }}>Mỗi ngày 1 lượt — luyện chăm để mở khoá</p>
          </div>
          <img src={`${A}/sparkle.svg`} alt="" className="pointer-events-none absolute right-2 top-0 h-4 w-4" />
          {t.plane
            ? <img src={`${A}/paper_plane.svg`} alt="" className="pointer-events-none absolute right-14 top-10 h-10 w-10" />
            : <span className="pointer-events-none absolute right-14 top-2 text-[18px]" style={{ color: t.primary }}>♡</span>}
        </div>

        {/* Trạng thái điều kiện — pill mềm */}
        <div className="mt-4 rounded-[18px] px-3.5 py-2.5" style={{ background: du ? '#e7f9ee' : '#fff1e0', border: `1.5px solid ${du ? '#a4e3b6' : '#ffd18a'}` }}>
          {!d ? <p className="text-[12px] font-semibold" style={{ color: t.sec }}>Đang tải…</p>
            : du ? (
              <p className="text-[12.5px] font-extrabold" style={{ color: '#1a7c3a' }}>
                ✓ Đủ điều kiện — {d.du_dieu_kien.so_dung}/{d.du_dieu_kien.so_cau} câu đúng ({d.du_dieu_kien.mon})
                {daQuay ? ' · đã quay hôm nay' : ' · quay ngay!'}
              </p>
            ) : (
              <p className="text-[12.5px] font-extrabold" style={{ color: '#b4691a' }}>
                🎯 Chưa đủ — làm 1 lượt tự luyện 10 câu đúng ≥{d.du_dieu_kien.nguong_pct ?? 70}% để mở khoá quay.
              </p>
            )}
        </div>

        {/* CARD trung tâm chứa vòng quay + nút — nổi lên trên nền mây */}
        <div className="mt-4 rounded-[26px] p-5" style={{ background: t.cardTint, boxShadow: t.shadow }}>
          <div className="relative flex items-center justify-center pt-2">
            <Wheel goc={goc} size={280} />
          </div>
          <button disabled={!conLuot || dangQuay} onClick={quay}
            className="relative mt-4 block w-full rounded-full border-[3px] border-white/80 py-3 text-[16px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,93,120,.4)] transition active:scale-95 disabled:opacity-60"
            style={{ background: 'linear-gradient(180deg, #FF9EBB 0%, #FF5D8A 60%, #F04A7A 100%)' }}>
            {dangQuay ? 'Đang quay…' : daQuay ? 'Mai quay tiếp ♡' : conLuot ? 'Quay ngay ▶' : du ? 'Vòng quay tạm đóng' : 'Chưa đủ điều kiện'}
          </button>
          {err && <p className="mt-2 rounded-2xl bg-[#FFE3EA] px-3 py-1.5 text-center text-[11.5px] font-semibold" style={{ color: '#C0355A' }}>⚠ {err}</p>}
        </div>

        {/* Bảng tỉ lệ — 4 pill nhỏ theo màu ô vòng quay */}
        {d && (
          <div className="mt-3 rounded-[22px] p-3" style={{ background: t.cardTint, boxShadow: t.shadow }}>
            <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em]" style={{ color: t.sec }}>Cơ hội trúng thưởng</p>
            <div className="grid grid-cols-4 gap-2">
              {O_LIST.slice().sort((a, b) => a.exp - b.exp).map((o) => {
                const pct = (d.ti_le as any)[`ti_le_${o.exp}`] ?? 0
                return (
                  <div key={o.exp} className="rounded-[14px] p-2 text-center" style={{ background: o.mau }}>
                    <span className="text-[20px]">{o.icon}</span>
                    <p className="mt-0.5 text-[11.5px] font-extrabold leading-none" style={{ color: NAVY }}>{o.exp} EXP</p>
                    <p className="mt-1 text-[10.5px] font-bold leading-none" style={{ color: NAVY, opacity: .7 }}>{pct}%</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tổng tháng — dải gradient hero cùng theme HomeHS */}
        {d && (
          <div className="mt-3 flex items-center justify-between rounded-[22px] px-4 py-3" style={{ background: t.underline ? 'linear-gradient(135deg,#FF8EB8,#F46BA9)' : 'linear-gradient(135deg,#3C85FF,#5868F7)', boxShadow: t.shadow }}>
            <div>
              <p className="text-[11.5px] font-bold text-white/85">Tháng này em đã trúng</p>
              <p className="font-hand mt-0.5 text-[13px] leading-none text-white/85">Cố lên nào!</p>
            </div>
            <p className="text-[24px] font-black text-white">{d.exp_thang} EXP</p>
          </div>
        )}

        {/* Lịch sử quay gần đây */}
        {d && (
          <div className="mt-3 rounded-[22px] p-3" style={{ background: t.cardTint, boxShadow: t.shadow }}>
            <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em]" style={{ color: t.sec }}>Lịch sử quay gần đây</p>
            {!d.lich_su.length ? (
              <p className="py-2 text-center text-[11.5px] font-semibold" style={{ color: t.sec }}>🍀 Chưa có lượt quay nào — mở hàng nhé!</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {d.lich_su.map((l) => (
                  <div key={l.created_at} className="flex items-center justify-between gap-2 rounded-[12px] bg-white/85 px-2.5 py-1.5">
                    <span className="text-[11.5px] font-extrabold" style={{ color: NAVY }}>{l.ngay}</span>
                    <span className="text-[11px] font-medium" style={{ color: t.sec }}>{luc(l.created_at)}</span>
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: '#FFF6D6', color: '#B87800' }}>+{l.exp} EXP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sheet kết quả — bottom sheet trên nền tối */}
      {kq && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6" onClick={() => setKq(null)}>
          <div className="w-full max-w-[430px] rounded-[26px] bg-white p-6 text-center" onClick={(e) => e.stopPropagation()} style={{ boxShadow: t.shadow }}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-[42px]" style={{ background: t.iconTint }}>
              {kq.exp >= 200 ? '💎' : kq.exp >= 150 ? '🎉' : kq.exp >= 100 ? '🎁' : '⭐'}
            </div>
            <p className="mt-3 text-[22px] font-extrabold" style={{ color: NAVY }}>Chúc mừng!</p>
            <p className="text-[18px] font-black" style={{ color: t.primary }}>+{kq.exp} EXP May Mắn</p>
            <p className="font-hand mt-2 -rotate-[3deg] text-[16px]" style={{ color: t.quoteColor }}>Tuyệt vời ♡</p>
            <p className="mt-2 text-[12.5px]" style={{ color: t.sec }}>Mai luyện tiếp để có thêm 1 lượt quay nhé!</p>
            <button onClick={() => setKq(null)} className="mt-4 w-full rounded-full py-3 text-[14px] font-extrabold text-white" style={{ background: t.underline ? 'linear-gradient(135deg,#FF8EB8,#F46BA9)' : 'linear-gradient(135deg,#3C85FF,#5868F7)' }}>Tuyệt! ♡</button>
          </div>
        </div>
      )}
    </div>
  )
}
