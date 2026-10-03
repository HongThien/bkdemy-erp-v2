// QUÁI TẠM (Thùy 03/10: "research kiếm tạm 1 đống … dùng tạm 5–7 con thôi, sau này t design boss riêng") — 7 con từ gói CC0 của SethByrd (OpenGameArt),
// nguồn + giấy phép: design/bk-ui-src/AppHS/quai-cc0-sethbyrd/README.md. Thay HOÀN TOÀN hình SVG tạm cũ (QuaiTam). Boss riêng do Thùy thiết kế
// cắm qua Skin.boss (nguonQuai.ts) vẫn được ưu tiên — registry này chỉ là lớp nền khi chưa có boss riêng.
// Mã quái (`loai`, ~30 mã trong skin/the3d/loai.ts) → 1 trong 7 hình theo băm tất định ⇒ cùng mã luôn cùng hình, ở mọi màn (bản đồ · HUD · sân đấu).
import { bam } from './boCuc'

const A = '/bk-ui/hs/quai2d'
export const QUAI_CC0: readonly { id: string; ten: string; anh: string }[] = [
  { id: 'clob', ten: 'Cua càng vàng', anh: `${A}/clob.webp` },
  { id: 'eggy', ten: 'Trứng cánh quạt', anh: `${A}/eggy.webp` },
  { id: 'popper', ten: 'Gai tròn', anh: `${A}/popper.webp` },
  { id: 'puffer', ten: 'Cá nóc', anh: `${A}/puffer.webp` },
  { id: 'kettle', ten: 'Ấm xanh', anh: `${A}/kettle.webp` },
  { id: 'gobi', ten: 'Nấm tím', anh: `${A}/gobi.webp` },
  { id: 'king_gobi', ten: 'Vua nấm tím', anh: `${A}/king_gobi.webp` },
]

export const quaiCc0 = (loai: string) => QUAI_CC0[Math.floor(bam('quai-cc0:' + loai) * QUAI_CC0.length) % QUAI_CC0.length]
