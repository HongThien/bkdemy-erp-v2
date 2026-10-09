// CHINH PHỤC BK (spec-che-do-game.md §7 — leo tháp): THÁP TỔNG của khối ở giữa + N THÁP CHỦ ĐỀ (N = số chủ đề kho có câu của khối em, tối đa 8 mẫu tháp),
// mỗi tháp 1 bảng xếp hạng riêng. Bố cục theo kit hs-chinh-phuc-bk-v4 DESIGN.md (Đơn 14 Kit A): sân 16:9, tháp tổng chân (50%,64%) cao 54%;
// tháp chủ đề theo preset N (cung trái x 12–36% · cung phải x 64–88%, xa y≈59–64 nhỏ hơn, gần y≈73–78); đế đảo neo tâm mặt đá vào chân tháp;
// cầu ánh sáng kéo từ mép đế phụ tới mép đế tổng. Lớp vẽ: nền → cầu → đế → tháp (theo y) → halo → nhãn → điều khiển.
// Chọn tháp ⇒ halo vàng; Sinh tồn / Vô tận (Normal) ⇒ phóng vào tháp rồi mở ván leo của game (dautu.html?nhung=1&vao=thap&cd=&che=), lùi ⇒ về màn này.
// CHƯA LÀM (spec §7): Vô tận Hard (câu mức 4–5, 3 lượt/ngày) — nút hiện "sắp mở"; khoá tháp chủ đề theo tiến độ học (mở khi đã học đủ dạng) — hiện mở hết.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { DauTrangHS, HEAD, THE_TRON, useManDoc, useMonHS } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { supabase } from '../../../lib/supabase'
import { khoiCuaHS } from '../../../lib/tuluyen'
import { CHU_NOI, GameNhungHS, useSan } from './HocTapHS'

type ChuDe = { ma: string; ten: string; so_cau: number }
type CheDo = 'song_con' | 'vo_tan'

// Preset chân tháp chủ đề theo N (DESIGN.md mục 5) — gán chủ đề theo thứ tự, không gắn cứng chủ đề vào toạ độ.
const PRESET: [number, number][][] = [
  [],
  [[25, 73]],
  [[24, 73], [76, 73]],
  [[18, 74], [31, 59], [80, 74]],
  [[14, 76], [28, 60], [72, 60], [86, 76]],
  // đế tổng chiếm x≈35–65% ⇒ tháp GẦN phía trong đặt ≤30% / ≥70% (đế phụ không đè mặt đá tổng); tháp XA (y≈60) mới được sát vào trong
  [[9, 76], [20, 60], [30, 77], [72, 61], [86, 76]],
  [[9, 76], [20, 60], [30, 77], [70, 77], [80, 60], [91, 76]],
  [[8, 77], [17, 62], [28, 77], [34, 59], [67, 60], [76, 76], [91, 77]],
  [[9, 77], [18, 68], [26, 61], [34, 66], [65, 68], [73, 60], [82, 71], [94, 78]],
]
const MS_PHONG = 480
const TONG = '__tong'

export function ChinhPhucHS({ onBack, mon: monEp, khoi: khoiEp }: { onBack: () => void; mon?: string; khoi?: string }) {
  const cp = laySkin(null).chinhPhuc
  const monHS = useMonHS(), mon = monEp ?? monHS ?? 'Toán'
  const [khoi, setKhoi] = useState<string | null | undefined>(khoiEp ?? undefined)
  useEffect(() => { if (khoiEp === undefined) khoiCuaHS().then(setKhoi).catch(() => setKhoi(null)) }, [khoiEp])
  const [ds, setDs] = useState<ChuDe[] | null>(null)
  useEffect(() => {
    if (!khoi) return
    setDs(null)
    supabase.rpc('fn_dtv_kho_chu_de', { p_mon: mon, p_khoi: khoi })
      .then(({ data, error }) => setDs(error ? [] : ((data as ChuDe[] | null) ?? []).slice(0, 8)))
  }, [mon, khoi])
  const [sel, setSel] = useState(TONG)
  const [phong, setPhong] = useState<{ x: number; y: number } | null>(null)
  const [choi, setChoi] = useState<Record<string, string> | null>(null)
  const { ref, san } = useSan(false)
  // Điện thoại DỌC: sân 16:9 cao ≈62% màn, rộng hơn màn ⇒ vuốt ngang để xem hết các tháp (mở ra ở giữa = tháp tổng). Ngang/iPad: sân vừa màn.
  const doc = useManDoc()
  const [cao, setCao] = useState(() => window.innerHeight)
  useEffect(() => { const f = () => setCao(window.innerHeight); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f) }, [])
  const cuon = useRef<HTMLDivElement>(null)
  useEffect(() => { const c = cuon.current; if (c && doc && ds && !choi) c.scrollLeft = (c.scrollWidth - c.clientWidth) / 2 }, [doc, ds, choi, san.w])

  if (!cp) return <GameNhungHS vao="thap" tieuDe="Chinh phục BK" mon={monEp} khoi={khoiEp} onBack={onBack} /> // style không có màn tháp ⇒ menu leo tháp của game
  if (choi) return <GameNhungHS vao="thap" tieuDe="Chinh phục BK" mon={monEp} khoi={khoiEp} them={choi} onBack={() => { setChoi(null); setPhong(null) }} />

  const tenKhoi = khoi ? `Lớp ${khoi.replace(/T$/, '')}` : ''
  // ── bố cục (px trong sân) ──
  const px = (x: number, y: number) => ({ x: san.x + (x / 100) * san.w, y: san.y + (y / 100) * san.h })
  const thap = (key: string, src: string, x: number, y: number, caoTl: number) => {
    const hp = cp.hop[key], f = px(x, y), hv = san.h * caoTl, h = hv / (hp.y1 - hp.y0), w = (h * 512) / 768
    return { src, f, w, h, left: f.x - ((hp.x0 + hp.x1) / 2) * w, top: f.y - hp.y1 * h, vw: (hp.x1 - hp.x0) * w, vTop: f.y - hv }
  }
  const tong = thap('thap_tong', cp.thapTong, 50, 64, 0.54)
  const wDeTong = san.w * 0.29
  const deTong = { width: wDeTong, height: wDeTong / cp.deTong.tl, left: tong.f.x - cp.deTong.mat[0] * wDeTong, top: tong.f.y - cp.deTong.mat[1] * (wDeTong / cp.deTong.tl) }
  const cds = (ds ?? []).map((c, i) => {
    const [x, y] = PRESET[(ds ?? []).length][i]
    const t = thap(`thap_cd_${i + 1}`, cp.thapCd[i], x, y, 0.24 + ((y - 59) / 19) * 0.1) // xa (y nhỏ) thấp hơn gần ~12–15%
    const wDe = t.vw * 1.6, hDe = wDe / cp.deCd.tl
    const de = { width: wDe, height: hDe, left: t.f.x - cp.deCd.mat[0] * wDe, top: t.f.y - cp.deCd.mat[1] * hDe }
    // cầu: mép mặt đá phụ (phía tháp tổng) → mép mặt đá tổng (phía tháp phụ)
    const trai = x < 50
    const a = { x: de.left + (trai ? 0.88 : 0.12) * wDe, y: de.top + 0.42 * hDe }
    const b = { x: deTong.left + (trai ? 0.1 : 0.9) * deTong.width, y: deTong.top + 0.36 * deTong.height }
    const [p1, p2] = trai ? [a, b] : [b, a]
    return { c, t, de, p1, p2, guong: !trai }
  })
  const dsVe = [{ key: TONG, ten: `Tháp tổng${tenKhoi ? ' · ' + tenKhoi : ''}`, phu: 'Mọi chủ đề', t: tong, lon: true },
    ...cds.map((d) => ({ key: d.c.ma, ten: d.c.ten, phu: `${d.c.so_cau} câu`, t: d.t, lon: false }))].sort((p, q) => p.t.f.y - q.t.f.y)
  const chon = dsVe.find((d) => d.key === sel) ?? dsVe.find((d) => d.key === TONG)!

  const vao = (che: CheDo | null) => {
    if (phong) return
    const p: Record<string, string> = {}
    if (che) p.che = che
    if (chon.key !== TONG) { p.cd = chon.key; p.tcd = chon.ten }
    if (!che || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setChoi(p); return }
    setPhong({ x: chon.t.f.x, y: chon.t.f.y - san.h * 0.15 }); window.setTimeout(() => setChoi(p), MS_PHONG)
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: 'var(--sk-bg)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      <style>{`
@keyframes cp-hien { from { opacity: 0; transform: scale(1.05) } to { opacity: 1; transform: none } }
@keyframes cp-halo { 0%,100% { opacity: .75 } 50% { opacity: 1 } }
@keyframes cp-chay { to { background-position: -200% 0 } }
.cp-thap { transition: transform .2s ease, filter .2s ease; transform-origin: 50% 100% }
.cp-thap:hover { filter: brightness(1.1) }
.cp-thap[aria-pressed=true] { transform: scale(.98); filter: brightness(1.12) drop-shadow(0 0 18px rgba(255,216,106,.85)) }
.cp-halo { animation: cp-halo 1.8s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) { .cp-halo { animation: none } }`}</style>
      <img src={cp.nen} alt="" aria-hidden draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover" />
      <div ref={cuon} className={`absolute inset-0 ${doc ? 'overflow-x-auto overflow-y-hidden' : 'overflow-hidden'}`}>
      <div ref={ref} className="relative h-full" style={{ width: doc ? Math.round(cao * 0.62 * 16 / 9) : '100%', ...(phong ? { transformOrigin: `${phong.x}px ${phong.y}px`, transform: 'scale(2.4)', opacity: 0, transition: `transform ${MS_PHONG}ms cubic-bezier(.55,0,.85,.35), opacity ${MS_PHONG}ms ease-in` } : { animation: 'cp-hien .45s ease-out both' }) }}>
        {san.w > 0 && ds && (
          <>
            {/* cầu ánh sáng (sau đế, sau tháp) — kéo dãn từ đầu A tới đầu B, xoay theo hướng A→B, giữ độ dày */}
            {cds.map((d) => {
              const L = Math.hypot(d.p2.x - d.p1.x, d.p2.y - d.p1.y), goc = Math.atan2(d.p2.y - d.p1.y, d.p2.x - d.p1.x)
              const W = L / (cp.cau.b[0] - cp.cau.a[0]), H = san.h * 0.1
              return <img key={'c' + d.c.ma} src={cp.cau.src} alt="" aria-hidden draggable={false} className="pointer-events-none absolute max-w-none select-none"
                style={{ left: d.p1.x - cp.cau.a[0] * W, top: d.p1.y - cp.cau.a[1] * H, width: W, height: H, transformOrigin: `${cp.cau.a[0] * 100}% ${cp.cau.a[1] * 100}%`, transform: `rotate(${goc}rad)` }} />
            })}
            {/* đế đảo */}
            <img src={cp.deTong.src} alt="" aria-hidden draggable={false} className="pointer-events-none absolute max-w-none select-none" style={deTong} />
            {cds.map((d) => <img key={'d' + d.c.ma} src={cp.deCd.src} alt="" aria-hidden draggable={false} className="pointer-events-none absolute max-w-none select-none"
              style={{ ...d.de, transform: d.guong ? 'scaleX(-1)' : undefined }} />)}
            {/* tháp — xa vẽ trước, gần vẽ sau */}
            {dsVe.map((d) => {
              const dang = sel === d.key
              return (
                <button key={d.key} onClick={() => setSel(d.key)} aria-pressed={dang} aria-label={`${d.ten}: ${d.phu}`} className="cp-thap absolute outline-none"
                  style={{ left: d.t.left, top: d.t.top, width: d.t.w, height: d.t.h }}>
                  {dang && <span className="cp-halo pointer-events-none absolute rounded-full" style={{ left: '10%', right: '10%', bottom: '-4%', height: '16%', background: 'radial-gradient(closest-side, rgba(255,216,106,.85), transparent)' }} />}
                  <img src={d.t.src} alt="" draggable={false} className="relative block h-full w-full select-none" />
                </button>
              )
            })}
            {/* nhãn — lớp riêng trên mọi tháp (không bị tháp khác che), ngay dưới chân */}
            {dsVe.map((d) => (
              <button key={'n' + d.key} tabIndex={-1} onClick={() => setSel(d.key)} className="absolute flex -translate-x-1/2 flex-col items-center rounded-2xl px-2.5 py-0.5"
                style={{ background: 'color-mix(in srgb, var(--sk-bg) 72%, transparent)', backdropFilter: 'blur(2px)', left: d.t.f.x, top: d.t.f.y + san.h * 0.01, maxWidth: d.lon ? san.w * 0.2 : Math.max(100, san.w * 0.11) }}>
                <span className={`line-clamp-2 text-center font-bold leading-tight ${d.lon ? 'text-[17.5px] md:text-[23px]' : 'text-[13px] md:text-[16.5px]'}`}
                  style={{ ...HEAD, ...CHU_NOI, color: sel === d.key ? 'var(--sk-acc)' : 'var(--sk-ink)' }}>{d.ten}</span>
                <span className="block text-center text-[11.5px] leading-snug md:text-[14px]" style={{ ...CHU_NOI, color: 'var(--sk-muted)' }}>{d.phu}</span>
              </button>
            ))}
          </>
        )}
      </div>
      </div>

      {/* đầu trang + BXH (góc phải) */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 px-4 pt-[calc(12px+env(safe-area-inset-top))]">
        <div className="pointer-events-auto">
          <DauTrangHS tieuDe="Chinh phục BK" phu="Nơi một huyền thoại sinh ra" onBack={onBack} theoMon
            phai={<button onClick={() => vao(null)} className="px-4 py-2 text-[14.5px] font-bold" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius-pill)' }}>🏆 Bảng xếp hạng</button>} />
        </div>
      </div>
      {khoi === null && <p className="absolute left-0 right-0 top-1/2 text-center text-[15.5px] font-bold" style={CHU_NOI}>Chưa xác định được khối của em.</p>}

      {/* chế độ: Sinh tồn / Vô tận (Normal | Hard) — áp cho tháp đang chọn */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-1.5 px-3 pb-[calc(10px+env(safe-area-inset-bottom))]">
        <span className="rounded-full px-3 py-0.5 text-[14px] font-bold md:text-[15.5px]" style={{ ...HEAD, ...CHU_NOI, background: 'color-mix(in srgb, var(--sk-bg) 72%, transparent)' }}>Đang chọn: <span style={{ color: 'var(--sk-acc)' }}>{chon?.ten ?? '…'}</span></span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <NutCheDo onClick={() => vao('song_con')} chinh>⏱️ Sinh tồn 5 phút</NutCheDo>
          <NutCheDo onClick={() => vao('vo_tan')} chinh>♾️ Vô tận · Normal</NutCheDo>
          <NutCheDo tat>🔥 Hard · sắp mở</NutCheDo>
        </div>
      </div>
    </div>
  )
}

function NutCheDo({ children, onClick, chinh, tat }: { children: ReactNode; onClick?: () => void; chinh?: boolean; tat?: boolean }) {
  return (
    <button onClick={onClick} disabled={tat} className="h-11 px-4 text-[15.5px] font-bold transition active:scale-[0.98] disabled:opacity-55 md:h-12 md:px-6 md:text-[17.5px]"
      style={chinh ? { background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)', borderRadius: 'var(--sk-radius-pill)', fontFamily: 'var(--sk-font-head)', boxShadow: '0 0 0 2px var(--sk-surface), 0 6px 18px rgba(0,0,0,.35)' }
        : { ...THE_TRON, borderRadius: 'var(--sk-radius-pill)', fontFamily: 'var(--sk-font-head)' }}>
      {children}
    </button>
  )
}
