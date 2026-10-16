// MÈO NGỦ trên mép card "Chào …" (trang trí riêng theo mã nhân sự — cấu hình ở `MEO_NGU` trong lib/erpSkin.ts).
// 2 hình nền trong suốt: THÂN (không đuôi) + ĐUÔI (gốc ở mép trên ảnh) — đuôi nằm SAU thân, gốc đuôi bị thân che,
// phần còn lại buông xuống mặt card; thỉnh thoảng đuôi vẫy (xoay quanh gốc), thân phập phồng rất nhẹ như đang thở.
// Gắn vào 1 phần tử `position: relative` (card). Không bắt chuột. Máy bật "giảm chuyển động" ⇒ đứng yên.
import type { MeoNguCfg } from '../lib/erpSkin'

const CSS = `
@keyframes meoDuoi { 0%,60%,100% { transform: rotate(0deg) } 64% { transform: rotate(15deg) } 70% { transform: rotate(-11deg) } 76% { transform: rotate(8deg) } 82% { transform: rotate(-5deg) } 88% { transform: rotate(2deg) } }
@keyframes meoTho { 0%,100% { transform: scaleY(1) } 50% { transform: scaleY(1.025) } }
.meo-duoi { transform-origin: 50% 0; animation: meoDuoi 9s ease-in-out infinite }
.meo-than { transform-origin: 50% 100%; animation: meoTho 4.6s ease-in-out infinite }
@media (prefers-reduced-motion: reduce) { .meo-duoi, .meo-than { animation: none } }
`

export const meoCao = (c: MeoNguCfg) => c.rong / c.tiLeThan

export default function MeoNgu({ cfg }: { cfg: MeoNguCfg }) {
  const cao = meoCao(cfg)
  const rongDuoi = cfg.duoiCao * cfg.tiLeDuoi
  return (
    <>
      <style>{CSS}</style>
      <div aria-hidden style={{ position: 'absolute', right: cfg.phai, top: 0, width: cfg.rong, height: cao, transform: `translateY(calc(-100% + ${cfg.chim}px))`, pointerEvents: 'none', zIndex: 3 }}>
        <img src={cfg.duoi} alt="" draggable={false} className="meo-duoi"
          style={{ position: 'absolute', left: cfg.rong * cfg.duoiX - rongDuoi / 2, top: cao * cfg.duoiY, width: rongDuoi, height: cfg.duoiCao }} />
        <img src={cfg.than} alt="" draggable={false} className="meo-than" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
    </>
  )
}
