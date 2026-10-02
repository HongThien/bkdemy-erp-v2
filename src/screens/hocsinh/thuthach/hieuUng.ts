// ============================================================================
// HIỆU ỨNG ĐÒN 2D (canvas, không thư viện) cho Đấu trường — Thùy 02/10: "đòn tung ra theo % đúng, hiệu ứng đẹp, CHỈ phát sau khi xong trận".
//   100% (5/5): SÉT ĐÁNH (điện giật, nhìn thấy xương) hoặc THIÊN THẠCH rơi (nổ)      — chọn ngẫu nhiên 1
//    80% (4/5): CẦU LỬA khổng lồ (cháy) hoặc CẦU BĂNG khổng lồ (đóng băng)           — chọn ngẫu nhiên 1
//    60% (3/5): cầu lửa / cầu băng / tia điện NHỎ                                       — chọn ngẫu nhiên 1
//   Thua trận: boss tung ma thuật vào chibi.
// Cách làm: 1 canvas phủ sân; bộ hạt (blob phát sáng cộng màu, mảnh băng, mảnh đá, vòng sóng) + "diễn viên" (đạn, tia sét, lớp băng) chạy theo đồng hồ riêng;
// hiệu ứng lên nhân vật/boss (tư thế, bộ lọc ảnh, rung màn) đi qua `Hook` để lớp React chỉ việc áp class/style — không re-render theo khung hình.
// Ảnh đạn/lớp băng = bộ FX Thùy vẽ (skin/heroDau.ts · fx_*.webp, nạp trước bằng `napFx`); chưa nạp xong thì vẽ quầng sáng như cũ. Sét: bóng đen + xương trắng hoạt hình lấy alpha ảnh boss
// (port từ design/bk-ui-src/AppHS/Animation/chien_dau/hieu_ung_va_cham.js).
// Màu hiệu ứng là màu NGỮ NGHĨA của đòn (lửa/băng/điện/ma thuật), cố định mọi style; chỉ có chỗ này gõ màu (file .ts, ngoài script check-style-hs).
// ============================================================================

import { anhFx, type FxDau } from '../skin/heroDau'

export type Don = 'set' | 'thien_thach' | 'cau_lua_lon' | 'cau_bang_lon' | 'cau_lua_nho' | 'cau_bang_nho' | 'dien_nho' | 'boss_ma_thuat'
/** Trạng thái boss do hiệu ứng điều khiển (lớp React áp bộ lọc ảnh theo `LOC_BOSS`). */
export type TtBoss = 'dung' | 'trung' | 'xray' | 'chay' | 'bang'
/** Trạng thái nhân vật chính — lớp React đổi ra chuỗi ảnh tư thế (heroDau.ts) theo đòn đang diễn. */
export type TtHero = 'nghi' | 'tich_nang' | 'tung_don' | 'bi_danh' | 'thang' | 'guc'

export const TEN_DON: Record<Don, string> = {
  set: 'Sét đánh', thien_thach: 'Thiên thạch', cau_lua_lon: 'Cầu lửa khổng lồ', cau_bang_lon: 'Cầu băng khổng lồ',
  cau_lua_nho: 'Cầu lửa nhỏ', cau_bang_nho: 'Cầu băng nhỏ', dien_nho: 'Tia điện nhỏ', boss_ma_thuat: 'Ma thuật của boss',
}
/** Quầng sáng quanh nhân vật lúc tích năng / tung đòn. */
export const AURA: Record<Don, string> = {
  set: 'rgba(170,200,255,.95)', thien_thach: 'rgba(255,140,60,.95)', cau_lua_lon: 'rgba(255,150,50,.95)', cau_bang_lon: 'rgba(140,215,255,.95)',
  cau_lua_nho: 'rgba(255,150,50,.8)', cau_bang_nho: 'rgba(140,215,255,.8)', dien_nho: 'rgba(190,210,255,.85)', boss_ma_thuat: 'rgba(190,90,255,.9)',
}
export const LOC_BOSS: Record<TtBoss, string> = {
  dung: 'none',
  trung: 'brightness(1.9)',
  xray: 'brightness(0)', // bị điện giật: thân thành bóng đen (sét lớn vẽ thêm bộ xương trắng đè lên — xem `xuong`)
  chay: 'sepia(.75) saturate(2.8) hue-rotate(-20deg) brightness(1.18)',
  bang: 'grayscale(.45) saturate(.9) hue-rotate(165deg) brightness(1.28) contrast(1.05)',
}

/** Chọn đòn theo % đúng của trận (60/80/100) — ngẫu nhiên trong nhóm. */
export function chonDon(muc: number): Don {
  const nhom: Don[] = muc >= 100 ? ['set', 'thien_thach'] : muc >= 80 ? ['cau_lua_lon', 'cau_bang_lon'] : ['cau_lua_nho', 'cau_bang_nho', 'dien_nho']
  return nhom[Math.floor(Math.random() * nhom.length)]
}

export interface Hop { x: number; y: number; w: number; h: number }
/** Toạ độ (px, gốc = góc trên-trái canvas) của các mốc trong sân. */
type Diem = { x: number; y: number }
/** tay = tâm cầu lúc tích năng · phong = tay lúc tung đòn (đạn phát từ đây) · bossAnh = ảnh boss đang hiện (lấy bóng cho hiệu ứng điện giật). */
export interface Neo { W: number; H: number; tay: Diem; phong?: Diem; hero: Hop; boss: Hop; bossAnh?: HTMLImageElement | null }

// ───────────────────────── ảnh FX ─────────────────────────
const fxKho = new Map<FxDau, HTMLImageElement>()
/** Nạp trước 5 ảnh FX (gọi lúc vào Đấu trường) — lỗi thì bỏ qua, hiệu ứng tự lùi về quầng sáng. */
export function napFx(): Promise<void> {
  const ds: FxDau[] = ['fx_cau_lua', 'fx_cau_bang', 'fx_dan_ma', 'fx_thien_thach', 'fx_bang_boc']
  return Promise.all(ds.map((f) => {
    if (fxKho.has(f)) return Promise.resolve()
    const im = new Image(); im.src = anhFx(f); fxKho.set(f, im)
    return im.decode().catch(() => undefined)
  })).then(() => undefined)
}
const fx = (f: FxDau) => { const im = fxKho.get(f); return im && im.complete && im.naturalWidth ? im : null }
/** Đầu đạn trong ảnh (tỉ lệ) — DESIGN.md: cầu/đạn ma (82%,50%) hướng phải · thiên thạch (78%,78%) hướng dưới-phải. */
const DAU: Record<FxDau, [number, number]> = { fx_cau_lua: [0.82, 0.5], fx_cau_bang: [0.82, 0.5], fx_dan_ma: [0.82, 0.5], fx_thien_thach: [0.78, 0.78], fx_bang_boc: [0.5, 0.5] }
/** Vẽ ảnh đạn: đầu đạn đặt tại (x,y), xoay theo hướng bay (vx,vy); bay sang trái thì lật ngang (đuôi luôn phía sau). */
function veDan(g: CanvasRenderingContext2D, f: FxDau, x: number, y: number, vx: number, vy: number, w: number, a = 1) {
  const im = fx(f); if (!im) return false
  const h = w * im.naturalHeight / im.naturalWidth, [hx, hy] = DAU[f], goc0 = Math.atan2((hy - 0.5) * h, (hx - 0.5) * w)
  g.save(); g.globalAlpha = a; g.translate(x, y)
  if (vx < 0) { g.scale(-1, 1); vx = -vx }
  g.rotate(Math.atan2(vy, vx) - goc0); g.drawImage(im, -hx * w, -hy * h, w, h); g.restore()
  return true
}
export interface Hook {
  rung: (bien: number, ms: number) => void
  boss: (t: TtBoss) => void
  hero: (t: TtHero) => void
}

// ───────────────────────── nền tảng hạt ─────────────────────────
type RGB = [number, number, number]
const TAU = Math.PI * 2
const rnd = (a = 0, b = 1) => a + Math.random() * (b - a)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const mix = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`

const LUA = { loi: [255, 244, 190] as RGB, giua: [255, 176, 60] as RGB, ngoai: [235, 70, 20] as RGB, khoi: [60, 50, 50] as RGB }
const BANG = { loi: [238, 252, 255] as RGB, giua: [140, 212, 255] as RGB, ngoai: [60, 130, 230] as RGB }
const DIEN = { loi: [255, 255, 255] as RGB, giua: [190, 220, 255] as RGB, ngoai: [110, 130, 255] as RGB }
const MA = { loi: [255, 225, 255] as RGB, giua: [190, 90, 255] as RGB, ngoai: [80, 30, 150] as RGB }

const kho = new Map<string, HTMLCanvasElement>()
/** Quầng tròn mềm (gradient xuyên tâm) — vẽ hàng trăm hạt bằng drawImage thay vì tạo gradient mỗi hạt. */
function quang(c: RGB): HTMLCanvasElement {
  const k = `${Math.round(c[0] / 20)},${Math.round(c[1] / 20)},${Math.round(c[2] / 20)}`
  let s = kho.get(k)
  if (!s) {
    s = document.createElement('canvas'); s.width = s.height = 64
    const g = s.getContext('2d')!, gr = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    gr.addColorStop(0, rgba(c, 1)); gr.addColorStop(0.35, rgba(c, 0.6)); gr.addColorStop(1, rgba(c, 0))
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64)
    kho.set(k, s)
  }
  return s
}

interface P {
  kind: 'blob' | 'manh' | 'vong' | 'da'
  x: number; y: number; vx: number; vy: number; g: number; drag: number
  life: number; max: number; r0: number; r1: number; c0: RGB; c1: RGB; a: number; add: boolean
  rot: number; vr: number
}
interface Act { update: (dt: number) => void; draw: (g: CanvasRenderingContext2D) => void; xong?: boolean }

class Man {
  ps: P[] = []; acts: Act[] = []; timers: { t: number; fn: () => void }[] = []
  t = 0; last = 0; raf = 0; flash = 0; dim = 0; dimDich = 0; chay = false; ketThuc: (() => void) | null = null
  g: CanvasRenderingContext2D
  constructor(public cv: HTMLCanvasElement, public W: number, public H: number) {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
    this.g = cv.getContext('2d')!; this.g.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  sau(ms: number, fn: () => void) { this.timers.push({ t: this.t + ms, fn }) }
  act(a: Act) { this.acts.push(a); return a }
  hat(p: Partial<P> & { kind?: P['kind'] }) {
    this.ps.push({ kind: 'blob', x: 0, y: 0, vx: 0, vy: 0, g: 0, drag: 0, life: 0, max: 0.6, r0: 6, r1: 0, c0: LUA.giua, c1: LUA.ngoai, a: 1, add: true, rot: 0, vr: 0, ...p })
  }
  chop(a = 0.8) { this.flash = Math.max(this.flash, a) }
  toi(v: number) { this.dimDich = v }
  chayDi(xong: () => void) {
    this.ketThuc = xong; this.chay = true; this.last = performance.now()
    const f = (now: number) => {
      if (!this.chay) return
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now
      this.step(dt); this.ve()
      // CHỈ khi dev: window.__dtDung = <ms thời gian hiệu ứng> ⇒ đóng băng đúng khung đó (soi từng hiệu ứng). window.__dtTiep() chạy tiếp.
      const w = import.meta.env.DEV ? (window as unknown as { __dtDung?: number; __dtTiep?: () => void }) : null
      if (w && w.__dtDung !== undefined && this.t >= w.__dtDung) { w.__dtDung = undefined; w.__dtTiep = () => { this.last = performance.now(); this.raf = requestAnimationFrame(f) }; return }
      if (!this.timers.length && !this.ps.length && !this.acts.some((a) => !a.xong) && this.flash < 0.01 && this.dim < 0.01 && this.dimDich === 0) { this.dung(); return }
      this.raf = requestAnimationFrame(f)
    }
    this.raf = requestAnimationFrame(f)
  }
  dung() { if (!this.chay) return; this.chay = false; cancelAnimationFrame(this.raf); this.g.clearRect(0, 0, this.W, this.H); const k = this.ketThuc; this.ketThuc = null; k?.() }
  step(dt: number) {
    this.t += dt * 1000
    for (let i = this.timers.length - 1; i >= 0; i--) if (this.timers[i].t <= this.t) { const f = this.timers[i].fn; this.timers.splice(i, 1); f() }
    for (const a of this.acts) if (!a.xong) a.update(dt)
    this.acts = this.acts.filter((a) => !a.xong)
    for (const p of this.ps) {
      p.life += dt; p.vy += p.g * dt; const d = Math.max(0, 1 - p.drag * dt); p.vx *= d; p.vy *= d
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt
    }
    this.ps = this.ps.filter((p) => p.life < p.max)
    this.flash *= Math.pow(0.0025, dt) // tắt nhanh ~0,3s
    this.dim += (this.dimDich - this.dim) * Math.min(1, dt * 7)
    if (this.dimDich === 0 && this.dim < 0.01) this.dim = 0
  }
  ve() {
    const g = this.g; g.clearRect(0, 0, this.W, this.H)
    if (this.dim > 0.005) { g.fillStyle = `rgba(8,6,28,${this.dim})`; g.fillRect(0, 0, this.W, this.H) }
    for (const a of this.acts) a.draw(g)
    for (const p of this.ps) {
      const k = p.life / p.max, a = p.a * (1 - k) * (p.kind === 'vong' ? 0.9 : 1), r = lerp(p.r0, p.r1, k), c = mix(p.c0, p.c1, k)
      g.globalCompositeOperation = p.add ? 'lighter' : 'source-over'
      if (p.kind === 'blob') { g.globalAlpha = Math.max(0, a); const s = Math.max(0.5, r * 2); g.drawImage(quang(c), p.x - s / 2, p.y - s / 2, s, s) }
      else if (p.kind === 'vong') { g.globalAlpha = Math.max(0, a); g.strokeStyle = rgba(c, 1); g.lineWidth = Math.max(1, 10 * (1 - k)); g.beginPath(); g.arc(p.x, p.y, r, 0, TAU); g.stroke() }
      else if (p.kind === 'manh') {
        g.globalAlpha = Math.max(0, a); g.save(); g.translate(p.x, p.y); g.rotate(p.rot)
        g.beginPath(); g.moveTo(0, -r); g.lineTo(r * 0.38, r * 0.5); g.lineTo(-r * 0.38, r * 0.5); g.closePath()
        g.fillStyle = rgba(c, 0.85); g.fill(); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1; g.stroke(); g.restore()
      } else { g.globalAlpha = Math.max(0, a); g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = rgba(c, 1); g.fillRect(-r / 2, -r / 2, r, r * 0.7); g.restore() }
    }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'
    if (this.flash > 0.01) { g.fillStyle = `rgba(255,255,255,${Math.min(1, this.flash)})`; g.fillRect(0, 0, this.W, this.H) }
  }
}

// ───────────────────────── hiệu ứng thành phần ─────────────────────────
type Mau = { loi: RGB; giua: RGB; ngoai: RGB }

function bung(S: Man, x: number, y: number, n: number, m: Mau, luc: number, p?: { g?: number; add?: boolean; song?: number; to?: number }) {
  for (let i = 0; i < n; i++) {
    const a = rnd(0, TAU), v = rnd(0.2, 1) * luc
    S.hat({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - luc * 0.15, g: p?.g ?? 0, drag: 2.2, max: rnd(0.35, 0.9) * (p?.song ?? 1), r0: rnd(8, 22) * (luc / 300) * (p?.to ?? 1), r1: 2, c0: i % 3 ? m.giua : m.loi, c1: m.ngoai })
  }
}
function vongSong(S: Man, x: number, y: number, rMax: number, c: RGB, n = 2) {
  for (let i = 0; i < n; i++) S.hat({ kind: 'vong', x, y, max: 0.55 + i * 0.12, r0: 6, r1: rMax * (1 - i * 0.22), c0: c, c1: c })
}
function khoiBui(S: Man, x: number, y: number, n: number, luc: number) {
  for (let i = 0; i < n; i++) S.hat({ x: x + rnd(-30, 30), y: y + rnd(-10, 20), vx: rnd(-1, 1) * luc * 0.5, vy: -rnd(0.3, 1) * luc * 0.6, drag: 1.2, max: rnd(0.9, 1.7), r0: rnd(14, 30), r1: rnd(40, 70), c0: [110, 90, 80], c1: [40, 35, 50], a: 0.5, add: false })
}
function manhDa(S: Man, x: number, y: number, n: number, luc: number) {
  for (let i = 0; i < n; i++) { const a = rnd(-Math.PI, 0), v = rnd(0.3, 1) * luc; S.hat({ kind: 'da', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 900, max: rnd(0.7, 1.3), r0: rnd(5, 13), r1: rnd(4, 9), c0: [70, 55, 55], c1: [30, 25, 30], a: 1, add: false, rot: rnd(0, TAU), vr: rnd(-9, 9) }) }
}
function manhBang(S: Man, x: number, y: number, n: number, luc: number, h?: Hop) {
  for (let i = 0; i < n; i++) {
    const px = h ? rnd(h.x, h.x + h.w) : x, py = h ? rnd(h.y, h.y + h.h) : y
    const a = rnd(0, TAU), v = rnd(0.3, 1) * luc
    S.hat({ kind: 'manh', x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v - luc * 0.2, g: 700, max: rnd(0.7, 1.3), r0: rnd(10, 26), r1: rnd(8, 18), c0: BANG.giua, c1: BANG.ngoai, a: 1, add: false, rot: rnd(0, TAU), vr: rnd(-10, 10) })
  }
}

/** Đường sét gấp khúc (dịch trung điểm đệ quy) + nhánh. */
function duongSet(x1: number, y1: number, x2: number, y2: number, lech: number, nhanh = 0.35, out: number[][][] = []): number[][][] {
  const chinh: number[][] = [[x1, y1], [x2, y2]]
  for (let lv = 0; lv < 6; lv++) {
    const moi: number[][] = []
    for (let i = 0; i < chinh.length - 1; i++) {
      const [a, b] = [chinh[i], chinh[i + 1]]
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1
      const o = rnd(-1, 1) * lech * (len / Math.hypot(x2 - x1, y2 - y1)) * 0.9
      moi.push(a, [mx + (-dy / len) * o, my + (dx / len) * o])
    }
    moi.push(chinh[chinh.length - 1]); chinh.splice(0, chinh.length, ...moi)
  }
  out.push(chinh)
  if (nhanh > 0) for (let i = 4; i < chinh.length - 4; i += 5) if (Math.random() < nhanh) {
    const [bx, by] = chinh[i], a = Math.atan2(y2 - y1, x2 - x1) + rnd(-0.9, 0.9), L = Math.hypot(x2 - x1, y2 - y1) * rnd(0.12, 0.28)
    duongSet(bx, by, bx + Math.cos(a) * L, by + Math.sin(a) * L, lech * 0.35, 0, out)
  }
  return out
}
function veSet(g: CanvasRenderingContext2D, ds: number[][][], dam: number, a: number, c = DIEN) {
  g.globalCompositeOperation = 'lighter'; g.lineJoin = 'round'; g.lineCap = 'round'
  const pass: [number, RGB, number][] = [[dam * 7, c.ngoai, 0.18 * a], [dam * 3, c.giua, 0.55 * a], [dam, c.loi, a]]
  for (const [w, col, al] of pass) {
    g.lineWidth = w; g.strokeStyle = rgba(col, al)
    for (const d of ds) { g.beginPath(); d.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke() }
  }
  g.globalCompositeOperation = 'source-over'
}

/** Đạn bay: phát sáng + đuôi hạt; tới nơi gọi `toi`. `r` có thể thay đổi theo thời gian (charge). */
function dan(S: Man, p: { x0: number; y0: number; x1: number; y1: number; ms: number; r: number; m: Mau; khoi?: boolean; cong?: number; toi: () => void; vet?: number; anh?: FxDau; rong?: number }) {
  let t = 0, px = p.x0, py = p.y0, vx = p.x1 - p.x0, vy = p.y1 - p.y0
  S.act({
    update(dt) {
      t += dt * 1000
      const k = Math.min(1, t / p.ms), e = k * k // tăng tốc
      const x = lerp(p.x0, p.x1, e), y = lerp(p.y0, p.y1, e) - Math.sin(k * Math.PI) * (p.cong ?? 0)
      ;(this as unknown as { x: number; y: number }).x = x; (this as unknown as { x: number; y: number }).y = y
      if (Math.hypot(x - px, y - py) > 0.5) { vx = x - px; vy = y - py } px = x; py = y
      const coAnh = !!(p.anh && p.rong), n = coAnh ? 2 : Math.ceil(p.r / 7) + 1 // có ảnh đạn (đã vẽ sẵn đuôi lửa) ⇒ chỉ rắc ít tàn lửa, không đè mất nét vẽ
      for (let i = 0; i < n; i++) S.hat({ x: x + rnd(-p.r, p.r) * 0.4, y: y + rnd(-p.r, p.r) * 0.4, vx: -(p.x1 - p.x0) * 0.05 + rnd(-30, 30), vy: rnd(-30, 30) - 20, max: rnd(0.25, 0.6) * (p.vet ?? 1) * (coAnh ? 0.6 : 1), r0: rnd(0.5, 1) * p.r * (coAnh ? 0.35 : 0.9), r1: 1, c0: p.m.giua, c1: p.m.ngoai, a: 0.9 })
      if (p.khoi && !coAnh) S.hat({ x, y, vx: rnd(-20, 20), vy: -rnd(10, 50), max: 0.8, r0: p.r * 0.7, r1: p.r * 1.6, c0: LUA.khoi, c1: LUA.khoi, a: 0.35, add: false })
      if (k >= 1) { this.xong = true; p.toi() }
    },
    draw(g) {
      const o = this as unknown as { x?: number; y?: number }
      if (o.x === undefined || o.y === undefined) return
      g.globalCompositeOperation = 'lighter'
      const q = p.anh && p.rong ? 0.6 : 1; g.drawImage(quang(p.m.giua), o.x - p.r * 2.4 * q, o.y - p.r * 2.4 * q, p.r * 4.8 * q, p.r * 4.8 * q)
      g.drawImage(quang(p.m.loi), o.x - p.r * 1.2, o.y - p.r * 1.2, p.r * 2.4, p.r * 2.4)
      g.globalCompositeOperation = 'source-over'
      if (p.anh && p.rong) veDan(g, p.anh, o.x, o.y, vx, vy, p.rong)
    },
  } as Act)
}

/** Quả cầu tích năng ở tay: lớn dần + hạt hút vào tâm. */
function tichNang(S: Man, x: number, y: number, ms: number, rMax: number, m: Mau) {
  let t = 0
  S.act({
    update(dt) {
      t += dt * 1000
      const k = Math.min(1, t / ms), r = rMax * (0.15 + 0.85 * k)
      ;(this as unknown as { r: number }).r = r
      for (let i = 0; i < 2 + (k > 0.5 ? 1 : 0); i++) {
        const a = rnd(0, TAU), d = rnd(1.6, 3.4) * rMax
        S.hat({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: -Math.cos(a) * d * 3.2, vy: -Math.sin(a) * d * 3.2, max: 0.3, r0: rnd(3, 8), r1: 1, c0: m.loi, c1: m.giua, a: 0.9 })
      }
      if (t >= ms) this.xong = true
    },
    draw(g) {
      const r = (this as unknown as { r?: number }).r ?? 1
      g.globalCompositeOperation = 'lighter'
      g.drawImage(quang(m.giua), x - r * 2.2, y - r * 2.2, r * 4.4, r * 4.4); g.drawImage(quang(m.loi), x - r, y - r, r * 2, r * 2)
      g.globalCompositeOperation = 'source-over'
    },
  } as Act)
}

/** Lớp băng bọc boss: mảnh tinh thể + viền trắng, hiện dần. */
function lopBang(S: Man, h: Hop, ms: number) {
  const mang = Array.from({ length: 16 }, () => {
    const cx = h.x + rnd(0.05, 0.95) * h.w, cy = h.y + rnd(0.05, 0.98) * h.h, r = rnd(0.12, 0.26) * h.w, a = rnd(0, TAU)
    return { cx, cy, r, a, k: rnd(0.55, 1) }
  })
  let t = 0
  S.act({
    update(dt) { t += dt * 1000; if (t >= ms) this.xong = true },
    draw(g) {
      const al = Math.min(1, t / 250)
      for (const m of mang) {
        g.save(); g.translate(m.cx, m.cy); g.rotate(m.a)
        g.beginPath(); g.moveTo(0, -m.r); g.lineTo(m.r * 0.45 * m.k, 0); g.lineTo(0, m.r * 0.8); g.lineTo(-m.r * 0.4, 0); g.closePath()
        g.fillStyle = rgba(BANG.giua, 0.26 * al); g.fill(); g.strokeStyle = `rgba(235,252,255,${0.85 * al})`; g.lineWidth = 1.4; g.stroke()
        g.beginPath(); g.moveTo(0, -m.r); g.lineTo(0, m.r * 0.8); g.strokeStyle = `rgba(255,255,255,${0.35 * al})`; g.stroke(); g.restore()
      }
      g.globalCompositeOperation = 'lighter'
      g.drawImage(quang(BANG.giua), h.x - h.w * 0.15, h.y, h.w * 1.3, h.h); g.globalCompositeOperation = 'source-over'
      const im = fx('fx_bang_boc')
      if (im) { const w = h.w * 0.95, hh = w * im.naturalHeight / im.naturalWidth; g.globalAlpha = 0.92 * al; g.drawImage(im, h.x + (h.w - w) / 2, h.y + h.h - hh, w, hh); g.globalAlpha = 1 }
    },
  } as Act)
}

/** Điện giật kiểu hoạt hình: bóng ĐEN của chính boss (alpha ảnh) + bộ xương trắng phát sáng (sọ chibi, sống, sườn, chậu, tay chân) trong hộp boss.
 *  Không có ảnh boss ⇒ bóng người chibi giữ chỗ. Bộ xương là mô hình người chung — boss giải phẫu lạ thì cần rig riêng. */
const mask = typeof document !== 'undefined' ? document.createElement('canvas') : null
function xuong(g: CanvasRenderingContext2D, b: Hop, anh: HTMLImageElement | null | undefined, age: number) {
  const h = b.h * 0.92, w = h * 0.55, x = b.x + b.w / 2 + Math.sin(age * 0.09) * 6, day = b.y + b.h
  const net = (pts: number[][], lw: number, c: string) => { g.strokeStyle = c; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.stroke() }
  g.save()
  if (anh && anh.naturalWidth && mask) {
    mask.width = Math.ceil(b.w); mask.height = Math.ceil(b.h)
    const m = mask.getContext('2d')!; m.clearRect(0, 0, b.w, b.h); m.drawImage(anh, 0, 0, b.w, b.h)
    m.globalCompositeOperation = 'source-in'; m.fillStyle = 'rgb(7,5,18)'; m.fillRect(0, 0, b.w, b.h); m.globalCompositeOperation = 'source-over'
    g.drawImage(mask, b.x + Math.sin(age * 0.09) * 6, b.y)
  } else {
    const c = 'rgb(8,6,21)'; g.fillStyle = c; g.beginPath(); g.ellipse(x, day - h * 0.79, w * 0.31, h * 0.2, 0, 0, TAU); g.fill()
    net([[x, day - h * 0.58], [x, day - h * 0.31]], w * 0.5, c)
    for (const s of [-1, 1]) { net([[x + s * w * 0.16, day - h * 0.53], [x + s * w * 0.37, day - h * 0.38], [x + s * w * 0.45, day - h * 0.56]], w * 0.18, c); net([[x + s * w * 0.12, day - h * 0.29], [x + s * w * 0.19, day - h * 0.15], [x + s * w * 0.23, day - 5]], w * 0.22, c) }
  }
  const tr = 'rgb(255,255,255)', u = h / 360
  g.shadowColor = 'rgb(189,237,255)'; g.shadowBlur = 9
  g.fillStyle = tr; g.beginPath(); g.ellipse(x, day - h * 0.79, w * 0.22, h * 0.145, 0, 0, TAU); g.fill()
  g.fillStyle = 'rgb(8,6,21)'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(x + s * w * 0.085, day - h * 0.8, w * 0.055, h * 0.04, 0, 0, TAU); g.fill() }
  g.beginPath(); g.moveTo(x, day - h * 0.755); g.lineTo(x - w * 0.03, day - h * 0.72); g.lineTo(x + w * 0.03, day - h * 0.72); g.fill()
  net([[x - w * 0.12, day - h * 0.68], [x + w * 0.12, day - h * 0.68]], 7 * u, tr)
  net([[x, day - h * 0.62], [x, day - h * 0.31]], 9 * u, tr)
  for (let i = 0; i < 4; i++) { g.strokeStyle = tr; g.lineWidth = 5 * u; g.beginPath(); g.ellipse(x, day - h * (0.57 - i * 0.052), w * (0.18 - i * 0.012), h * 0.037, 0, 0, Math.PI); g.stroke() }
  net([[x - w * 0.14, day - h * 0.32], [x, day - h * 0.28], [x + w * 0.14, day - h * 0.32]], 9 * u, tr)
  for (const s of [-1, 1]) {
    net([[x + s * w * 0.06, day - h * 0.58], [x + s * w * 0.2, day - h * 0.55], [x + s * w * 0.34, day - h * 0.4], [x + s * w * 0.42, day - h * 0.55]], 8 * u, tr)
    net([[x + s * w * 0.1, day - h * 0.3], [x + s * w * 0.18, day - h * 0.16], [x + s * w * 0.23, day - h * 0.025]], 9 * u, tr)
  }
  g.restore()
}

// ───────────────────────── từng đòn ─────────────────────────
export function phatDon(cv: HTMLCanvasElement, don: Don, n: Neo, hook: Hook): Promise<void> {
  return new Promise((xong) => {
    const S = new Man(cv, n.W, n.H)
    const bx = n.boss.x + n.boss.w / 2, by = n.boss.y + n.boss.h * 0.52
    const T = n.tay, P = n.phong ?? n.tay
    const heroTrung = { x: n.hero.x + n.hero.w * 0.5, y: n.hero.y + n.hero.h * 0.5 }
    const bossTay = { x: n.boss.x + n.boss.w * 0.25, y: n.boss.y + n.boss.h * 0.42 }
    const ketThucSom = () => { hook.boss('dung'); hook.hero('nghi') }
    S.chayDi(() => { ketThucSom(); xong() })

    switch (don) {
      case 'set': {
        hook.hero('tich_nang')
        tichNang(S, T.x, T.y, 650, 20, DIEN)
        S.sau(450, () => S.toi(0.55))
        S.sau(700, () => hook.hero('tung_don'))
        // 5 nhát sét liên tiếp từ trời xuống đầu boss, mỗi nhát vẽ lại đường mới ⇒ chớp giật
        for (let i = 0; i < 5; i++) {
          S.sau(780 + i * 210, () => {
            const x0 = bx + rnd(-60, 60), cx = bx + rnd(-n.boss.w * 0.2, n.boss.w * 0.2)
            let ds = duongSet(x0, -20, cx, n.boss.y + n.boss.h * 0.35, 90)
            let dem = 0
            S.act({
              update(dt) { dem += dt * 1000; if (dem > 70 && dem < 75) ds = duongSet(x0, -20, cx, n.boss.y + n.boss.h * 0.35, 90); if (dem > 200) this.xong = true },
              draw(g) { veSet(g, ds, 4.6, Math.max(0, 1 - dem / 260)) },
            } as Act)
            S.chop(0.5); hook.rung(9, 200); hook.boss('xray')
            for (let k = 0; k < 14; k++) S.hat({ x: cx, y: n.boss.y + n.boss.h * 0.35, vx: rnd(-1, 1) * 260, vy: rnd(-1, 0.3) * 260, g: 500, drag: 1.5, max: rnd(0.25, 0.6), r0: rnd(4, 9), r1: 1, c0: DIEN.loi, c1: DIEN.ngoai })
          })
        }
        // boss bị giật ~1,3 giây: nhịp 145ms luân phiên BÓNG ĐEN + XƯƠNG TRẮNG (vẽ đè hộp boss) ↔ boss sáng chói; tia điện bò khắp người
        S.sau(780, () => {
          let a = 0, dem = 0
          S.act({
            update(dt) {
              a += dt * 1000; if (a > 1300) { this.xong = true; return }
              hook.boss(Math.floor(a / 145) % 2 === 0 ? 'xray' : 'trung')
              ;(this as unknown as { a: number }).a = a
              dem += dt * 1000
              if (dem > 45) {
                dem = 0
                const rx = () => rnd(n.boss.x, n.boss.x + n.boss.w), ry = () => rnd(n.boss.y, n.boss.y + n.boss.h)
                const ds = duongSet(rx(), ry(), rx(), ry(), 26, 0); let t = 0
                S.act({ update(d2) { t += d2 * 1000; if (t > 60) this.xong = true }, draw(g) { veSet(g, ds, 1.6, 0.9) } } as Act)
              }
            },
            draw(g) { const a = (this as unknown as { a?: number }).a ?? 0; if (Math.floor(a / 145) % 2 === 0) xuong(g, n.boss, n.bossAnh, a) },
          } as Act)
        })
        S.sau(2100, () => { hook.boss('trung'); S.toi(0) })
        S.sau(2300, () => hook.boss('dung'))
        break
      }
      case 'thien_thach': {
        hook.hero('tich_nang')
        tichNang(S, T.x, T.y, 500, 16, LUA)
        S.sau(300, () => S.toi(0.45))
        S.sau(520, () => hook.hero('tung_don'))
        const x0 = bx - n.W * 0.55, y0 = -90
        S.sau(520, () => {
          let t = 0, rot = 0
          S.act({
            update(dt) {
              t += dt * 1000; rot += dt * 5
              const k = Math.min(1, t / 760), e = k * k * (3 - 2 * k) * 0.35 + k * k * 0.65
              const x = lerp(x0, bx, e), y = lerp(y0, by, e)
              ;(this as unknown as { x: number; y: number }).x = x; (this as unknown as { y: number }).y = y
              const anh = !!fx('fx_thien_thach') // ảnh đã có đuôi lửa ⇒ chỉ rắc ít tàn
              for (let i = 0; i < (anh ? 2 : 6); i++) S.hat({ x: x + rnd(-14, 14), y: y + rnd(-14, 14), vx: -(bx - x0) * 0.1 + rnd(-40, 40), vy: -(by - y0) * 0.1 + rnd(-40, 40), max: rnd(0.3, 0.8) * (anh ? 0.6 : 1), r0: rnd(12, 28) * (anh ? 0.5 : 1), r1: 2, c0: i % 2 ? LUA.giua : LUA.loi, c1: LUA.ngoai })
              if (!anh) S.hat({ x, y, vx: rnd(-30, 30), vy: -rnd(0, 50), max: 1, r0: 24, r1: 58, c0: LUA.khoi, c1: LUA.khoi, a: 0.3, add: false })
              if (k >= 1) {
                this.xong = true
                S.chop(1); hook.rung(20, 800); hook.boss('trung'); S.toi(0.25)
                bung(S, bx, by, 110, LUA, 620, { song: 1.6 }); bung(S, bx, by, 45, LUA, 200, { song: 2.4, to: 2.4 }); vongSong(S, bx, by, 240, LUA.giua, 3); vongSong(S, bx, by, 160, LUA.loi, 1)
                S.sau(80, () => { hook.boss('chay'); let tc = 0; S.act({ update(dt) { tc += dt * 1000; if (tc > 1100) { this.xong = true; return } for (let i = 0; i < 3; i++) S.hat({ x: rnd(n.boss.x + n.boss.w * 0.1, n.boss.x + n.boss.w * 0.9), y: rnd(n.boss.y + n.boss.h * 0.35, n.boss.y + n.boss.h), vx: rnd(-25, 25), vy: -rnd(60, 140), max: rnd(0.4, 0.9), r0: rnd(10, 22), r1: 2, c0: LUA.giua, c1: LUA.ngoai }) }, draw() { /* hạt tự vẽ */ } } as Act) })
                khoiBui(S, bx, by + n.boss.h * 0.25, 26, 260); manhDa(S, bx, by, 26, 520)
                S.sau(900, () => S.toi(0))
              }
              ;(this as unknown as { rot: number }).rot = rot
            },
            draw(g) {
              const o = this as unknown as { x?: number; y?: number; rot?: number }
              if (o.x === undefined || o.y === undefined) return
              g.globalCompositeOperation = 'lighter'
              g.drawImage(quang(LUA.giua), o.x - 90, o.y - 90, 180, 180); g.drawImage(quang(LUA.loi), o.x - 44, o.y - 44, 88, 88)
              g.globalCompositeOperation = 'source-over'
              if (veDan(g, 'fx_thien_thach', o.x, o.y, bx - x0, by - y0, n.W * 0.2)) return
              g.save(); g.translate(o.x, o.y); g.rotate(o.rot ?? 0)
              g.beginPath(); for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU, r = 30 + ((i * 7) % 5) * 3; g.lineTo(Math.cos(a) * r, Math.sin(a) * r) } g.closePath()
              g.fillStyle = 'rgb(58,40,40)'; g.fill(); g.strokeStyle = rgba(LUA.giua, 0.9); g.lineWidth = 2.5; g.stroke(); g.restore()
            },
          } as Act)
        })
        S.sau(2600, () => hook.boss('dung'))
        break
      }
      case 'cau_lua_lon':
      case 'cau_bang_lon': {
        const lua = don === 'cau_lua_lon', m: Mau = lua ? LUA : BANG
        hook.hero('tich_nang'); tichNang(S, T.x, T.y, 700, 44, m)
        S.sau(700, () => {
          hook.hero('tung_don')
          dan(S, { x0: P.x, y0: P.y, x1: bx, y1: by, ms: 520, r: 44, m, khoi: lua, cong: 30, vet: 1.2, anh: lua ? 'fx_cau_lua' : 'fx_cau_bang', rong: n.W * 0.24, toi: () => {
            S.chop(lua ? 0.85 : 0.9); hook.rung(12, 520); hook.boss('trung')
            if (lua) {
              bung(S, bx, by, 80, LUA, 520); vongSong(S, bx, by, 170, LUA.giua, 2)
              S.sau(250, () => {
                hook.boss('chay'); let t = 0
                S.act({ // cháy: lửa bốc lên khắp người boss ~1,6 giây
                  update(dt) { t += dt * 1000; if (t > 1600) { this.xong = true; return }
                    for (let i = 0; i < 4; i++) S.hat({ x: rnd(n.boss.x + n.boss.w * 0.15, n.boss.x + n.boss.w * 0.85), y: rnd(n.boss.y + n.boss.h * 0.25, n.boss.y + n.boss.h * 0.95), vx: rnd(-25, 25), vy: -rnd(60, 150), max: rnd(0.4, 0.9), r0: rnd(10, 24), r1: 2, c0: i % 2 ? LUA.giua : LUA.loi, c1: LUA.ngoai })
                    if (Math.random() < 0.5) S.hat({ x: rnd(n.boss.x, n.boss.x + n.boss.w), y: n.boss.y + n.boss.h * 0.3, vx: rnd(-20, 20), vy: -rnd(40, 90), max: 1.2, r0: 14, r1: 40, c0: LUA.khoi, c1: LUA.khoi, a: 0.3, add: false }) },
                  draw() { /* hạt tự vẽ */ },
                } as Act)
              })
              S.sau(1900, () => hook.boss('trung'))
            } else {
              manhBang(S, bx, by, 34, 420); vongSong(S, bx, by, 170, BANG.giua, 2)
              S.sau(220, () => { hook.boss('bang'); lopBang(S, n.boss, 1500) })
              S.sau(1650, () => { manhBang(S, bx, by, 46, 520, n.boss); S.chop(0.5); hook.rung(7, 300); hook.boss('trung') })
            }
          } })
        })
        S.sau(lua ? 2700 : 2500, () => hook.boss('dung'))
        break
      }
      case 'cau_lua_nho':
      case 'cau_bang_nho': {
        const lua = don === 'cau_lua_nho', m: Mau = lua ? LUA : BANG
        hook.hero('tich_nang'); tichNang(S, T.x, T.y, 330, 15, m)
        S.sau(330, () => {
          hook.hero('tung_don')
          dan(S, { x0: P.x, y0: P.y, x1: bx, y1: by, ms: 380, r: 15, m, cong: 14, vet: 0.8, anh: lua ? 'fx_cau_lua' : 'fx_cau_bang', rong: n.W * 0.11, toi: () => {
            S.chop(0.3); hook.rung(4, 220); hook.boss('trung')
            if (lua) { bung(S, bx, by, 26, LUA, 300); vongSong(S, bx, by, 80, LUA.giua, 1) } else { manhBang(S, bx, by, 14, 260); vongSong(S, bx, by, 80, BANG.giua, 1) }
            S.sau(150, () => hook.boss(lua ? 'chay' : 'bang')); S.sau(650, () => hook.boss('dung'))
          } })
        })
        break
      }
      case 'dien_nho': {
        hook.hero('tich_nang'); tichNang(S, T.x, T.y, 300, 13, DIEN)
        S.sau(300, () => hook.hero('tung_don'))
        for (let i = 0; i < 3; i++) S.sau(330 + i * 110, () => {
          let ds = duongSet(P.x, P.y, bx, by, 38), t = 0
          S.act({ update(dt) { t += dt * 1000; if (t > 90) this.xong = true }, draw(g) { veSet(g, ds, 2.4, 1 - t / 130) } } as Act)
          S.chop(0.3); hook.rung(3, 120); hook.boss(i % 2 ? 'trung' : 'xray')
          for (let k = 0; k < 8; k++) S.hat({ x: bx, y: by, vx: rnd(-1, 1) * 180, vy: rnd(-1, 0.4) * 180, g: 400, drag: 1.5, max: rnd(0.2, 0.45), r0: rnd(3, 6), r1: 1, c0: DIEN.loi, c1: DIEN.ngoai })
          ds = []
        })
        S.sau(800, () => hook.boss('dung'))
        break
      }
      case 'boss_ma_thuat': {
        hook.boss('trung') // gồng chiêu (tư thế gồng do lớp React đặt)
        S.sau(0, () => S.toi(0.35))
        tichNang(S, bossTay.x, bossTay.y, 650, 34, MA)
        S.sau(650, () => dan(S, {
          x0: bossTay.x, y0: bossTay.y, x1: heroTrung.x, y1: heroTrung.y, ms: 480, r: 34, m: MA, cong: 22, vet: 1.1, anh: 'fx_dan_ma', rong: n.W * 0.16, toi: () => {
            S.chop(0.6); hook.rung(14, 600); hook.hero('bi_danh')
            bung(S, heroTrung.x, heroTrung.y, 70, MA, 480); vongSong(S, heroTrung.x, heroTrung.y, 150, MA.giua, 2)
            for (let i = 0; i < 24; i++) S.hat({ x: heroTrung.x, y: heroTrung.y, vx: rnd(-1, 1) * 300, vy: rnd(-1, 0.2) * 300, g: 300, drag: 1.4, max: rnd(0.5, 1.1), r0: rnd(6, 16), r1: 1, c0: MA.giua, c1: MA.ngoai })
            S.sau(900, () => S.toi(0))
          },
        }))
        break
      }
    }
  })
}
