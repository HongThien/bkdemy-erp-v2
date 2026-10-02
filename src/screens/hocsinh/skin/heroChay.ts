// SINH TỰ ĐỘNG bởi scripts/anime-chay-2d.mjs — đừng sửa tay. Bộ CHẠY 2D nhân vật chính (6 khung × 100ms, delta thời gian) + khung đứng yên; ảnh ở public/bk-ui/hs/skin/rpg/chay/<giới>/.
// ax = trục thân (tỉ lệ ngang canvas) · ay[i] = neo ĐẤT khung i+1 · ayDung = neo khung đứng · top = đỉnh tóc (tỉ lệ dọc) ⇒ cao thân = (ay − top) × cao canvas.
export interface HeroChay { w: number; h: number; ax: number; ay: number[]; ayDung: number; top: number }
export const HERO_CHAY: Record<'nam' | 'nu', HeroChay> = {
  "nam": {
    "w": 360,
    "h": 540,
    "ax": 0.55,
    "ay": [
      0.948,
      0.922,
      0.948,
      0.957,
      0.948,
      0.95
    ],
    "ayDung": 0.989,
    "top": 0.009
  },
  "nu": {
    "w": 360,
    "h": 540,
    "ax": 0.55,
    "ay": [
      0.978,
      0.967,
      0.97,
      0.98,
      0.972,
      0.967
    ],
    "ayDung": 0.985,
    "top": 0.007
  }
}
export const CHU_KY_MS = 600 // 6 khung × 100ms
export const anhChay = (g: 'nam' | 'nu', i: number | 'dung') => `/bk-ui/hs/skin/rpg/chay/${g}/${i === 'dung' ? 'dung' : 'f' + (i + 1)}.webp`
/** Khung đang hiện theo thời gian trôi (ms) — dùng DELTA thời gian, không đếm rAF. */
export const khungTheoMs = (ms: number) => Math.floor(ms / (CHU_KY_MS / 6)) % 6
/** Kích thước + vị trí vẽ để THÂN (đỉnh tóc → đất) cao đúng `cao` px, đế chân ở (x, y). `i` = khung (0–5) hoặc 'dung'. */
export function hopVe(g: 'nam' | 'nu', i: number | 'dung', cao: number, x: number, y: number) {
  // CÙNG một tỉ lệ cho mọi khung (theo neo trung bình của 6 khung chạy) — neo riêng từng khung chỉ dùng để đặt chân, không đổi cỡ ⇒ không giật cỡ giữa các khung
  const m = HERO_CHAY[g], ay = i === 'dung' ? m.ayDung : m.ay[i], ref = m.ay.reduce((s, v) => s + v, 0) / m.ay.length, H = cao / (ref - m.top), Wd = H * (m.w / m.h)
  return { left: x - m.ax * Wd, top: y - ay * H, width: Wd, height: H }
}
