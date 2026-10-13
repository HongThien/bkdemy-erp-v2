// ============================================================================
// MÀN CHÍNH "SỐNG" — 2 mảnh cho style khai `Skin.homeSong` (hợp đồng HomeSong ở skin/kieu.ts; style đầu tiên: Lo-fi chill 12/10,
// design/DON-HANG-STYLE-LOFI.md mục 6). Style không khai ⇒ Home tĩnh như cũ, 2 mảnh này không được vẽ.
//  • NenSong     — tranh nền có MÂY TRÔI sau cửa sổ: lớp phòng (đã khoét trời) đặt trên dải trời lặp ngang, trôi rất chậm.
//  • NhanVatHome — nhân vật Home: có mảnh hoạt họa thì vẽ lên canvas và GHÉP VÙNG (tay viết · ngẩng đầu / gật gù · mèo vẫy đuôi · mèo ngáp), không thì <img> thường.
//  • LinhVatHome — linh vật ĐỔI CẢ TƯ THẾ (Đáng yêu 13/10): vẫy lúc mở màn · chớp mắt · ăn vặt · ngủ gật khi để yên · chạm vào thì mừng; viền "sôi" + nhún dẹt–giãn bằng code.
// Nguyên tắc: chuyển động chậm, biên độ nhỏ · máy bật "giảm chuyển động" ⇒ đứng yên · tab ẩn ⇒ dừng đồng hồ · tính bằng hẹn giờ theo thời gian thật, không đếm khung.
// Hình + số đo do scripts/lofi-hinh.mjs sinh (skin/styles/lofiSong.ts) — công thức mờ mép / ánh đèn ở đây phải KHỚP script đó.
// ============================================================================
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { LinhVatSong, LopNenSong, ManhSong, NvSong } from './kieu'

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
export function NhanVatHome({ src, srcSang, song, linhVat, toi, className, style }: { src: string; srcSang?: string; song?: NvSong; linhVat?: LinhVatSong; toi: boolean; className?: string; style?: CSSProperties }) {
  if (linhVat && !GIAM_DONG()) return <LinhVatHome lv={linhVat} className={className} style={style} />
  return <NhanVatGhep src={src} srcSang={srcSang} song={song} toi={toi} className={className} style={style} />
}

function NhanVatGhep({ src, srcSang, song, toi, className, style }: { src: string; srcSang?: string; song?: NvSong; toi: boolean; className?: string; style?: CSSProperties }) {
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

// ── LINH VẬT: đổi cả tư thế ──────────────────────────────────────────────────────────────────────────────────────
/** Mọi tư thế xếp chồng cùng khung (nạp sẵn, chỉ hiện 1) ⇒ đổi hình không nháy. Đổi tư thế kèm 1 nhịp DẸT–GIÃN (squash & stretch) nên không cần khung trung gian;
 *  đường viền "sôi" = bộ lọc SVG xê dịch nhẹ, đổi hạt 3 lần / 0,5 giây (line boil của hoạt hình vẽ tay). Chớp mắt thì KHÔNG nhún. */
function LinhVatHome({ lv, className, style }: { lv: LinhVatSong; className?: string; style?: CSSProperties }) {
  const [hinh, setHinh] = useState(lv.dung)
  const than = useRef<HTMLDivElement>(null)
  const cham = useRef<() => void>(() => {})
  const moi = [...new Set([lv.dung, lv.chopMat, ...lv.vay, lv.vui, lv.lo, lv.ngu, ...lv.an])]

  useEffect(() => {
    let song_ = true, ban = false, ngu = false, luc = performance.now()
    const hen = new Set<number>()
    const cho = (ms: number) => new Promise<void>((ok) => { const t = window.setTimeout(() => { hen.delete(t); ok() }, ms); hen.add(t) })
    const doi = (src: string) => {
      if (!song_) return
      setHinh(src)
      than.current?.animate?.([{ transform: 'scale(1.07, 0.92)' }, { transform: 'scale(0.96, 1.05)', offset: 0.55 }, { transform: 'scale(1, 1)' }], { duration: 240, easing: 'ease-out' })
    }
    /** diễn 1 chuỗi tư thế rồi về đứng; đang diễn thì bỏ qua yêu cầu mới (không chen ngang) */
    const dien = async (buoc: [string, number][]) => {
      if (ban || !song_) return
      ban = true
      for (const [src, ms] of buoc) { if (!song_) break; doi(src); await cho(ms) }
      if (song_) doi(lv.dung)
      ban = false
    }
    const thuc = () => { luc = performance.now(); if (ngu) { ngu = false; void dien([[lv.lo, 900]]) } }   // có động tĩnh trên trang ⇒ tỉnh dậy (giật mình)
    cham.current = () => { if (ngu) thuc(); else { luc = performance.now(); void dien([[lv.vui, 1000]]) } }
    window.addEventListener('pointerdown', thuc, { passive: true }); window.addEventListener('scroll', thuc, { passive: true })
    void (async () => {
      const [v1, v2 = v1] = lv.vay
      await cho(500)
      if (v1) await dien([[v1, 270], [v2, 270], [v1, 270], [v2, 270], [v1, 270]])                    // vẫy chào lúc mở màn
      let anSau = performance.now() + ngau(20000, 40000)
      while (song_) {
        await cho(ngau(3000, 6000))
        if (!song_) break
        if (document.hidden || ban || ngu) continue
        if (performance.now() - luc > 60000) { ngu = true; doi(lv.ngu); continue }                     // để yên 1 phút ⇒ ngủ gật
        if (lv.an.length && performance.now() > anSau) { const [a1, a2 = a1] = lv.an; await dien([[a1, 800], [a2, 1100], [a1, 600]]); anSau = performance.now() + ngau(20000, 40000); continue }
        setHinh(lv.chopMat); await cho(130)                                                           // chớp mắt
        if (song_ && !ban && !ngu) setHinh(lv.dung)
      }
    })()
    return () => { song_ = false; hen.forEach((t) => clearTimeout(t)); window.removeEventListener('pointerdown', thuc); window.removeEventListener('scroll', thuc) }
  }, [lv])

  return (
    <div className={className} onClick={() => cham.current()} aria-hidden style={{ ...style, aspectRatio: `${lv.rong} / ${lv.cao}`, pointerEvents: 'auto', cursor: 'pointer' }}>
      <style>{'@keyframes sk-lv-tho { from { transform: scale(1, 1) } to { transform: scale(1.012, 0.982) } }'}</style>
      {lv.soi && (
        <svg width="0" height="0" className="absolute" aria-hidden>
          <filter id="sk-lv-soi" x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1" seed="2" result="nhieu">
              <animate attributeName="seed" values="2;9;17" dur="0.5s" calcMode="discrete" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="nhieu" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      {lv.co && <img src={lv.co} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} />}
      {/* gốc biến đổi = chỗ đặt chân (89% chiều cao khung) ⇒ nhún / thở không làm chân trượt khỏi cỏ */}
      <div ref={than} className="absolute inset-0" style={{ transformOrigin: '50% 89%', animation: 'sk-lv-tho 1.7s ease-in-out infinite alternate', filter: lv.soi ? 'url(#sk-lv-soi)' : undefined }}>
        {moi.map((src) => <img key={src} src={src} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} style={{ opacity: src === hinh ? 1 : 0 }} />)}
      </div>
    </div>
  )
}
