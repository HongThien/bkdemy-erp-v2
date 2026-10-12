// ============================================================================
// MÀN CHÍNH "SỐNG" — 2 mảnh cho style khai `Skin.homeSong` (hợp đồng HomeSong ở skin/kieu.ts; style đầu tiên: Lo-fi chill 12/10,
// design/DON-HANG-STYLE-LOFI.md mục 6). Style không khai ⇒ Home tĩnh như cũ, 2 mảnh này không được vẽ.
//  • NenSong     — tranh nền có MÂY TRÔI sau cửa sổ: lớp phòng (đã khoét trời) đặt trên dải trời lặp ngang, trôi rất chậm.
//  • NhanVatHome — nhân vật Home: có mảnh hoạt họa thì vẽ lên canvas và GHÉP VÙNG (tay viết · ngẩng đầu / gật gù · mèo vẫy đuôi · mèo ngáp), không thì <img> thường.
// Nguyên tắc: chuyển động chậm, biên độ nhỏ · máy bật "giảm chuyển động" ⇒ đứng yên · tab ẩn ⇒ dừng đồng hồ · tính bằng hẹn giờ theo thời gian thật, không đếm khung.
// Hình + số đo do scripts/lofi-hinh.mjs sinh (skin/styles/lofiSong.ts) — công thức mờ mép / ánh đèn ở đây phải KHỚP script đó.
// ============================================================================
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { LopNenSong, ManhSong, NvSong } from './kieu'

const GIAM_DONG = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// ── NỀN: mây trôi sau cửa sổ ─────────────────────────────────────────────────────────────────────────────────────
/** Đặt TRÊN nền trang (cùng cách đặt "center top / cover" như tranh tĩnh của style ⇒ trùng khít), DƯỚI nội dung. `phu` = lớp phủ cho chữ dễ đọc. */
export function NenSong({ lop, phu }: { lop: LopNenSong; phu?: string }) {
  const h = lop.hopTroi
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <style>{'@keyframes sk-troi-troi { from { transform: translateX(0) } to { transform: translateX(-50%) } } @media (prefers-reduced-motion: reduce) { .sk-troi-troi { animation: none !important } }'}</style>
      {/* khung = đúng hình phòng sau khi "cover" khung nhìn, neo giữa-trên */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: `max(100vw, calc(100dvh * ${lop.tl}))`, aspectRatio: String(lop.tl) }}>
        <div className="absolute overflow-hidden" style={{ left: `${h.x0 * 100}%`, top: `${h.y0 * 100}%`, width: `${(h.x1 - h.x0) * 100}%`, height: `${(h.y1 - h.y0) * 100}%` }}>
          {/* 2 dải trời nối đuôi, trượt đúng 1 dải rồi lặp ⇒ không thấy chỗ nối */}
          <div className="sk-troi-troi absolute left-0 top-0 h-full" style={{ aspectRatio: String(lop.tlTroi * 2), background: `url(${lop.troi}) left top / 50% 100% repeat-x`, animation: 'sk-troi-troi 240s linear infinite' }} />
        </div>
        <img src={lop.phong} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} />
      </div>
      {phu && <div className="absolute inset-0" style={{ background: phu }} />}
    </div>
  )
}

// ── NHÂN VẬT: ghép vùng trên canvas ──────────────────────────────────────────────────────────────────────────────
type Hop = { x: number; y: number; w: number; h: number }
const kep = (v: number) => Math.min(1, Math.max(0, v))
/** hộp mảnh theo điểm ảnh — làm tròn y như scripts/lofi-hinh.mjs */
const hopPx = (m: ManhSong, W: number, H: number): Hop => ({ x: Math.round(m.hop[0] * W), y: Math.round(m.hop[1] * H), w: Math.round((m.hop[2] - m.hop[0]) * W), h: Math.round((m.hop[3] - m.hop[1]) * H) })
/** Mặt nạ độ mờ mép của 1 mảnh: mờ dần 12% cạnh ngắn; cạnh nằm sát mép khung thì giữ đặc (KHỚP script). */
function matNa(b: Hop, W: number, H: number): HTMLCanvasElement {
  const c = document.createElement('canvas'); c.width = b.w; c.height = b.h
  const x = c.getContext('2d')!, id = x.createImageData(b.w, b.h), m = Math.max(6, Math.round(Math.min(b.w, b.h) * 0.12))
  for (let j = 0; j < b.h; j++) for (let i = 0; i < b.w; i++) {
    const f = (b.x > 2 ? kep(i / m) : 1) * (b.x + b.w < W - 2 ? kep((b.w - 1 - i) / m) : 1) * (b.y > 2 ? kep(j / m) : 1) * (b.y + b.h < H - 2 ? kep((b.h - 1 - j) / m) : 1)
    id.data[(j * b.w + i) * 4 + 3] = Math.round(f * 255)
  }
  x.putImageData(id, 0, 0); return c
}
/** Bản đồ ánh sáng ĐÊM (nhân màu): tối chàm ở xa, ấm dần về phía đèn bàn — cùng công thức banDem của script (bản tĩnh nv_*_dem.webp). */
function anhDen(W: number, H: number, [cx, cy]: [number, number]): HTMLCanvasElement {
  const w = Math.round(W / 4), h = Math.round(H / 4), c = document.createElement('canvas'); c.width = w; c.height = h
  const x = c.getContext('2d')!, id = x.createImageData(w, h)
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = (j * w + i) * 4, t = Math.pow(kep(1 - Math.hypot((i / w - cx) / 0.95, (j / h - cy) / 0.8)), 1.6)
    id.data[k] = Math.min(255, Math.round(255 * (0.46 + 0.56 * t))); id.data[k + 1] = Math.round(255 * (0.44 + 0.5 * t)); id.data[k + 2] = Math.round(255 * (0.7 + 0.1 * t)); id.data[k + 3] = 255
  }
  x.putImageData(id, 0, 0); return c
}
const napAnh = (src: string) => new Promise<HTMLImageElement>((ok, loi) => { const im = new Image(); im.onload = () => ok(im); im.onerror = loi; im.src = src })
const ngau = (a: number, b: number) => a + Math.random() * (b - a)

/** Nhân vật Home. `src` = hình tĩnh của chế độ đang vẽ · `srcSang` = hình gốc (ban ngày) để ghép mảnh · `song` có ⇒ có hoạt họa. */
export function NhanVatHome({ src, srcSang, song, toi, className, style }: { src: string; srcSang?: string; song?: NvSong; toi: boolean; className?: string; style?: CSSProperties }) {
  const cv = useRef<HTMLCanvasElement>(null)
  const [san, setSan] = useState(false)
  const dong = !!song && !!srcSang && !GIAM_DONG()

  useEffect(() => {
    if (!dong || !song || !srcSang) return
    let song_ = true
    const hen = new Set<number>()
    const W = song.rong, H = song.cao
    const moiManh = [...song.viet, ...song.nghi, ...song.duoi, ...(song.ngap ? [song.ngap] : [])]
    setSan(false)
    Promise.all([napAnh(srcSang), ...moiManh.map((m) => napAnh(m.src))]).then(([goc, ...anh]) => {
      if (!song_) return
      const hinh = new Map(moiManh.map((m, i) => [m, { anh: anh[i], hop: hopPx(m, W, H), na: matNa(hopPx(m, W, H), W, H) }]))
      const ghep = document.createElement('canvas'); ghep.width = W; ghep.height = H
      const g = ghep.getContext('2d')!
      const den = toi ? anhDen(W, H, song.den) : null
      // trạng thái đang hiện: mảnh của NGƯỜI (tay hoặc đầu) + mảnh của THÚ CƯNG (đuôi hoặc đầu) — độc lập nhau
      let nguoi: ManhSong | null = null, thu: ManhSong | null = null
      const ve = () => {
        const c = cv.current; if (!c) return
        g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H); g.drawImage(goc, 0, 0, W, H)
        for (const m of [nguoi, thu]) {
          if (!m) continue
          const h = hinh.get(m)!
          // THAY vùng (không đè): xoá hình gốc theo độ mờ mép rồi CỘNG mảnh (mảnh đã mang sẵn độ mờ đó) ⇒ gốc × (1 − f) + khung × f
          g.globalCompositeOperation = 'destination-out'; g.drawImage(h.na, h.hop.x, h.hop.y)
          g.globalCompositeOperation = 'lighter'; g.drawImage(h.anh, h.hop.x, h.hop.y, h.hop.w, h.hop.h)
        }
        const x = c.getContext('2d')!
        x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H); x.drawImage(ghep, 0, 0)
        if (den) { x.globalCompositeOperation = 'multiply'; x.drawImage(den, 0, 0, W, H); x.globalCompositeOperation = 'destination-in'; x.drawImage(ghep, 0, 0); x.globalCompositeOperation = 'source-over' }
      }
      // hẹn giờ chỉ chạy khi tab đang hiện (tab ẩn: trình duyệt tự bóp hẹn giờ; quay lại thì kịch bản đi tiếp từ bước đang dở)
      const cho = (ms: number) => new Promise<void>((ok) => { const t = window.setTimeout(() => { hen.delete(t); ok() }, ms); hen.add(t) })
      const choHien = async () => { while (song_ && document.hidden) await cho(1000) }
      // NGƯỜI: viết (tay đưa qua lại trên dòng) 6–12 lượt → nhấc bút → nghỉ (ngẩng nhìn cửa sổ / gật gù theo nhạc) → viết tiếp
      const kichBanNguoi = async () => {
        const [v2, v3, v4] = song.viet
        while (song_) {
          await choHien()
          for (let l = Math.round(ngau(6, 12)); l > 0 && song_; l--) for (const m of [null, v2 ?? null, v3 ?? v2 ?? null, v2 ?? null]) { nguoi = m; ve(); await cho(210) }
          if (!song_) break
          if (v4) { nguoi = v4; ve(); await cho(700) }
          const nghi = song.nghi.length && Math.random() < 0.75 ? song.nghi[Math.floor(Math.random() * song.nghi.length)] : null
          if (nghi) { nguoi = nghi; ve(); await cho(ngau(2600, 5200)) }
          nguoi = null; ve(); await cho(ngau(500, 1100))
        }
      }
      // THÚ CƯNG: thỉnh thoảng vẫy đuôi 1 nhịp; lâu lâu ngáp
      const kichBanThu = async () => {
        let ngapSau = performance.now() + ngau(25000, 50000)
        const [d2, d3] = song.duoi
        while (song_) {
          await cho(ngau(2200, 6000)); await choHien(); if (!song_) break
          if (song.ngap && performance.now() > ngapSau) { thu = song.ngap; ve(); await cho(1500); ngapSau = performance.now() + ngau(25000, 50000) }
          else for (const m of [d2 ?? null, d3 ?? d2 ?? null, d2 ?? null]) { if (!m) continue; thu = m; ve(); await cho(420) }
          thu = null; ve()
        }
      }
      setSan(true)
      void cho(0).then(() => { if (!song_) return; ve(); void kichBanNguoi(); void kichBanThu() }) // sau khi canvas đã vào trang
    }).catch(() => { /* thiếu hình ⇒ giữ ảnh tĩnh */ })
    return () => { song_ = false; hen.forEach((t) => clearTimeout(t)) }
  }, [dong, song, srcSang, toi])

  // canvas chỉ hiện khi đã nạp đủ hình — trước đó (và khi không có hoạt họa) là ảnh tĩnh cùng chỗ, cùng cỡ
  return (
    <>
      {!(dong && san) && <img src={src} alt="" className={className} style={style} draggable={false} />}
      {dong && song && <canvas ref={cv} width={song.rong} height={song.cao} aria-hidden className={className} style={{ ...style, display: san ? undefined : 'none' }} />}
    </>
  )
}
