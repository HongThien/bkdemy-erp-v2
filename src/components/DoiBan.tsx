// HAI BẠN ĐI LẠI GẶP NHAU trên mép card "Chào …" (trang trí riêng theo mã nhân sự — cấu hình ở `DOI_BAN` trong lib/erpSkin.ts).
// Vòng 30 giây, thuần CSS: A đi từ TRÁI sang phải, B đi từ PHẢI sang trái → gặp nhau giữa card, dừng, quay vào nhau VẪY TAY CHÀO ≈3s
//   → đi tiếp về hai đầu (đi ngang qua nhau) → nghỉ, quay đầu → gặp nhau lần nữa, chào → đi về chỗ cũ → lặp.
// BẤM vào một trong hai bạn ⇒ cả hai đứng sững, đổi sang dáng GIẬN (lắc nhanh + 💢) ≈2,6s, bạn bị bấm hiện bong bóng lời nhắn "Aishhhhh", rồi đi tiếp đúng chỗ đang đi.
// Mọi dáng nền trong suốt vẽ QUAY PHẢI (code tự lật). Gắn vào phần tử `position: relative` (card). Không bắt chuột trừ 2 bạn.
// Máy bật "giảm chuyển động" ⇒ hai bạn đứng yên ở 2 đầu, bấm không có hiệu ứng.
import { useEffect, useRef, useState } from 'react'
import type { DoiBanCfg, DoiBanNv } from '../lib/erpSkin'

// Mốc thời gian (% của 30s): 0–16,67 đi gặp · –26,67 chào · –43,33 đi tiếp · –46,67 nghỉ/quay đầu · –63,33 đi gặp · –73,33 chào · –90 đi về · –100 nghỉ
const CSS = `
@keyframes dbA { 0% { left: 6px } 16.67%,26.67% { left: calc(50% - var(--wa) - 2px) } 43.33%,46.67% { left: calc(100% - var(--wa) - 6px) } 63.33%,73.33% { left: calc(50% + 2px) } 90%,100% { left: 6px } }
@keyframes dbB { 0% { left: calc(100% - var(--wb) - 6px) } 16.67%,26.67% { left: calc(50% + 2px) } 43.33%,46.67% { left: 6px } 63.33%,73.33% { left: calc(50% - var(--wb) - 2px) } 90%,100% { left: calc(100% - var(--wb) - 6px) } }
@keyframes dbFlipA { 0%,46.66% { transform: scaleX(1) } 46.67%,93.32% { transform: scaleX(-1) } 93.33%,100% { transform: scaleX(1) } }
@keyframes dbFlipB { 0%,46.66% { transform: scaleX(-1) } 46.67%,93.32% { transform: scaleX(1) } 93.33%,100% { transform: scaleX(-1) } }
@keyframes dbDi { 0%,16.66% { opacity: 1 } 16.67%,26.66% { opacity: 0 } 26.67%,43.32% { opacity: 1 } 43.33%,46.66% { opacity: 0 } 46.67%,63.32% { opacity: 1 } 63.33%,73.32% { opacity: 0 } 73.33%,89.99% { opacity: 1 } 90%,100% { opacity: 0 } }
@keyframes dbChao { 0%,16.66% { opacity: 0 } 16.67%,26.66% { opacity: 1 } 26.67%,63.32% { opacity: 0 } 63.33%,73.32% { opacity: 1 } 73.33%,100% { opacity: 0 } }
@keyframes dbNghi { 0%,43.32% { opacity: 0 } 43.33%,46.66% { opacity: 1 } 46.67%,89.99% { opacity: 0 } 90%,100% { opacity: 1 } }
@keyframes dbHai1 { 0%,49.99% { opacity: 1 } 50%,100% { opacity: 0 } }
@keyframes dbHai2 { 0%,49.99% { opacity: 0 } 50%,100% { opacity: 1 } }
@keyframes dbNhun { 0%,100% { transform: translateY(0) rotate(-3deg) } 50% { transform: translateY(-3px) rotate(3deg) } }
@keyframes dbBong { 0% { transform: translateX(-50%) scale(.5); opacity: 0 } 55% { transform: translateX(-50%) scale(1.12); opacity: 1 } 100% { transform: translateX(-50%) scale(1); opacity: 1 } }
@keyframes dbRung { 0%,100% { transform: translateX(0) rotate(-5deg) } 50% { transform: translateX(2px) rotate(5deg) } }
.db-a { animation: dbA 30s linear infinite }
.db-b { animation: dbB 30s linear infinite }
.db-fa { transform-origin: 50% 100%; animation: dbFlipA 30s steps(1, end) infinite }
.db-fb { transform-origin: 50% 100%; animation: dbFlipB 30s steps(1, end) infinite }
.db-di { animation: dbDi 30s steps(1, end) infinite }
.db-chao { animation: dbChao 30s steps(1, end) infinite; opacity: 0 }
.db-nghi { animation: dbNghi 30s steps(1, end) infinite; opacity: 0 }
.db-h1 { animation: dbHai1 .5s steps(1, end) infinite }
.db-h2 { animation: dbHai2 .5s steps(1, end) infinite; opacity: 0 }
.db-c1 { animation: dbHai1 .6s steps(1, end) infinite }
.db-c2 { animation: dbHai2 .6s steps(1, end) infinite; opacity: 0 }
.db-nhun { transform-origin: 50% 100%; animation: dbNhun .5s ease-in-out infinite }
.db-gianl { opacity: 0; transform-origin: 50% 100% }
.db-root.db-gian .db-a, .db-root.db-gian .db-b, .db-root.db-gian .db-fa, .db-root.db-gian .db-fb,
.db-root.db-gian .db-di, .db-root.db-gian .db-chao, .db-root.db-gian .db-nghi { animation-play-state: paused }
.db-root.db-gian .db-di, .db-root.db-gian .db-chao, .db-root.db-gian .db-nghi { visibility: hidden }
.db-root.db-gian .db-gianl { opacity: 1; animation: dbRung .16s ease-in-out infinite }
.db-bong { position: absolute; left: 50%; bottom: calc(100% + 6px); transform: translateX(-50%); white-space: nowrap; padding: 3px 11px 4px; border: 2px solid #4a342a; border-radius: 14px; background: #fffdf8; color: #4a342a; font: 800 13px/1.2 system-ui, sans-serif; letter-spacing: .2px; box-shadow: 0 2px 0 rgba(74,52,42,.3); animation: dbBong .28s ease-out both; pointer-events: none }
.db-bong::after { content: ''; position: absolute; left: 50%; bottom: -7px; width: 9px; height: 9px; margin-left: -5px; background: #fffdf8; border-right: 2px solid #4a342a; border-bottom: 2px solid #4a342a; transform: rotate(45deg) }
.db-gianl i { position: absolute; top: -6px; right: -4px; font-style: normal; font-size: 16px; line-height: 1 }
@media (prefers-reduced-motion: reduce) {
  .db-a, .db-b, .db-fa, .db-fb, .db-di, .db-chao, .db-nghi, .db-h1, .db-h2, .db-c1, .db-c2, .db-nhun { animation: none }
  .db-a { left: 6px } .db-b { left: calc(100% - var(--wb) - 6px) } .db-fb { transform: scaleX(-1) }
  .db-di, .db-chao { opacity: 0 } .db-nghi { opacity: 1 }
}
`

const GIAN_MS = 2600
const LOI_GIAN = 'Aishhhhh'   // lời nhắn hiện trên đầu bạn bị bấm

export const doiBanRong = (n: DoiBanNv, cao: number) => n.tiLe * cao

function Ban({ nv, cao, chim, pos, flip, tren, onBam, loi }: { nv: DoiBanNv; cao: number; chim: number; pos: string; flip: string; tren: number; onBam: () => void; loi?: string }) {
  const w = doiBanRong(nv, cao)
  const img = (src: string, cls: string) => <img src={src} alt="" draggable={false} className={cls} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
  return (
    <div className={pos} onClick={onBam} style={{ position: 'absolute', top: 0, width: w, height: cao, transform: `translateY(calc(-100% + ${chim}px))`, zIndex: tren, pointerEvents: 'auto', cursor: 'pointer' }}>
      <div className={flip} style={{ position: 'absolute', inset: 0 }}>
        <div className="db-nghi" style={{ position: 'absolute', inset: 0 }}>{img(nv.dung, '')}</div>
        <div className="db-di" style={{ position: 'absolute', inset: 0 }}>
          <div className="db-nhun" style={{ position: 'absolute', inset: 0 }}>{img(nv.buoc1, 'db-h1')}{img(nv.buoc2, 'db-h2')}</div>
        </div>
        <div className="db-chao" style={{ position: 'absolute', inset: 0 }}>{img(nv.chao1, 'db-c1')}{img(nv.chao2, 'db-c2')}</div>
        <div className="db-gianl" style={{ position: 'absolute', inset: 0 }}>{img(nv.gian, '')}<i>💢</i></div>
      </div>
      {loi && <span className="db-bong">{loi}</span>}
    </div>
  )
}

export default function DoiBan({ cfg }: { cfg: DoiBanCfg }) {
  const [gian, setGian] = useState<'a' | 'b' | null>(null)   // bạn nào vừa bị bấm (lời nhắn hiện trên đầu bạn đó)
  const hen = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(hen.current), [])
  const bam = (ai: 'a' | 'b') => () => {
    try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return } catch { /* bỏ qua */ }
    setGian(ai)
    window.clearTimeout(hen.current)
    hen.current = window.setTimeout(() => setGian(null), GIAN_MS)
  }
  return (
    <>
      <style>{CSS}</style>
      <div aria-hidden className={`db-root${gian ? ' db-gian' : ''}`}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 0, zIndex: 3, pointerEvents: 'none', ['--wa' as any]: `${doiBanRong(cfg.a, cfg.cao)}px`, ['--wb' as any]: `${doiBanRong(cfg.b, cfg.cao)}px` }}>
        <Ban nv={cfg.b} cao={cfg.cao} chim={cfg.chim} pos="db-b" flip="db-fb" tren={1} onBam={bam('b')} loi={gian === 'b' ? LOI_GIAN : undefined} />
        <Ban nv={cfg.a} cao={cfg.cao} chim={cfg.chim} pos="db-a" flip="db-fa" tren={2} onBam={bam('a')} loi={gian === 'a' ? LOI_GIAN : undefined} />
      </div>
    </>
  )
}
