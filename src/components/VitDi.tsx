// THÚ CƯNG ĐI LẠI trên mép card "Chào …" (vịt NS008, corgi NS002… — trang trí riêng theo mã nhân sự; cấu hình ở `VIT_DI` trong lib/erpSkin.ts).
// Các dáng nền trong suốt (cắt chung 1 khung): ĐỨNG · BƯỚC 1 · BƯỚC 2 (+ tuỳ chọn LẮC 1 · LẮC 2 cho lúc nghỉ). Vòng 24 giây, thuần CSS:
//   đi sang PHẢI (≈10s, 2 dáng bước đổi nhau + nhún) → nghỉ (đứng, hoặc lắc mông nếu có 2 dáng LẮC) → LẬT ngang quay đầu → đi sang TRÁI → nghỉ → lật lại.
// Chỉ có 1 lớp ngoài chạy `left` theo % bề ngang card (không cần đo bằng JS). Gắn vào phần tử `position: relative` (card).
// Không bắt chuột. Máy bật "giảm chuyển động" ⇒ thú đứng yên ở đầu trái.
import type { VitDiCfg } from '../lib/erpSkin'

const CSS = `
@keyframes vitDi { 0% { left: 6px } 40%,48% { left: calc(100% - var(--vit-w) - 6px) } 88%,100% { left: 6px } }
@keyframes vitLat { 0%,47.99% { transform: scaleX(1) } 48%,95.99% { transform: scaleX(-1) } 96%,100% { transform: scaleX(1) } }
@keyframes vitDiBo { 0%,40% { opacity: 1 } 40.01%,48% { opacity: 0 } 48.01%,88% { opacity: 1 } 88.01%,100% { opacity: 0 } }
@keyframes vitDungBo { 0%,40% { opacity: 0 } 40.01%,48% { opacity: 1 } 48.01%,88% { opacity: 0 } 88.01%,100% { opacity: 1 } }
@keyframes vitB1 { 0%,49.99% { opacity: 1 } 50%,100% { opacity: 0 } }
@keyframes vitB2 { 0%,49.99% { opacity: 0 } 50%,100% { opacity: 1 } }
@keyframes vitNhun { 0%,100% { transform: translateY(0) rotate(calc(var(--vit-goc) * -1deg)) } 50% { transform: translateY(var(--vit-nay)) rotate(calc(var(--vit-goc) * 1deg)) } }
.vit-di { animation: vitDi 24s linear infinite }
.vit-lat { transform-origin: 50% 100%; animation: vitLat 24s steps(1, end) infinite }
.vit-bo { animation: vitDiBo 24s steps(1, end) infinite }
.vit-dung { animation: vitDungBo 24s steps(1, end) infinite; opacity: 1 }
.vit-b1 { animation: vitB1 .5s steps(1, end) infinite }
.vit-b2 { animation: vitB2 .5s steps(1, end) infinite }
.vit-l1 { animation: vitB1 .3s steps(1, end) infinite }
.vit-l2 { animation: vitB2 .3s steps(1, end) infinite; opacity: 0 }
.vit-nhun { transform-origin: 50% 100%; animation: vitNhun .5s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) { .vit-di, .vit-lat, .vit-bo, .vit-dung, .vit-b1, .vit-b2, .vit-l1, .vit-l2, .vit-nhun { animation: none } .vit-bo { opacity: 0 } .vit-dung { opacity: 1 } .vit-l2 { opacity: 0 } .vit-di { left: 6px } }
`

export const vitRong = (c: VitDiCfg) => c.cao * c.tiLe

export default function VitDi({ cfg }: { cfg: VitDiCfg }) {
  const w = vitRong(cfg)
  const img = (src: string, cls: string) => <img src={src} alt="" draggable={false} className={cls} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
  return (
    <>
      <style>{CSS}</style>
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 0, zIndex: 3, pointerEvents: 'none', ['--vit-w' as any]: `${w}px`, ['--vit-goc' as any]: cfg.goc ?? 3, ['--vit-nay' as any]: `-${cfg.nay ?? 4}px` }}>
        <div className="vit-di" style={{ position: 'absolute', top: 0, width: w, height: cfg.cao, transform: `translateY(calc(-100% + ${cfg.chim}px))` }}>
          <div className="vit-lat" style={{ position: 'absolute', inset: 0 }}>
            {/* LÚC NGHỈ: có 2 dáng LẮC thì đổi nhau nhanh (lắc mông tại chỗ), không thì đứng yên */}
            <div className="vit-dung" style={{ position: 'absolute', inset: 0 }}>
              {cfg.lac1 && cfg.lac2 ? <>{img(cfg.lac1, 'vit-l1')}{img(cfg.lac2, 'vit-l2')}</> : img(cfg.dung, '')}
            </div>
            {/* LÚC ĐI: 2 dáng bước đổi nhau + nhún / nghiêng */}
            <div className="vit-bo" style={{ position: 'absolute', inset: 0 }}>
              <div className="vit-nhun" style={{ position: 'absolute', inset: 0 }}>
                {img(cfg.buoc1, 'vit-b1')}
                {img(cfg.buoc2, 'vit-b2')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
