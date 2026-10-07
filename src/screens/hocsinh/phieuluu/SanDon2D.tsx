// SÂN ĐẤU 2D dùng cho MÀN ĐẤU của "Học theo chủ đề" (Thùy 03/10: "làm chỗ combat ở dạng bài thành dạng 2D"): thay cảnh 3D của DauView bằng cùng bộ đồ hoạ 2D của Đấu trường —
// nhân vật chính em chọn (15 tư thế chiến đấu, skin/heroDau.ts) bên TRÁI, quái/boss bên PHẢI, nền sân (Skin.sanDau), đòn bằng canvas (thuthach/hieuUng.ts).
// Cha chỉ gọi `phat(don)` / `thang()` / `guc()` qua ref; quái đang đấu truyền bằng props (`ke`), `ha` = quái đang ngã.
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from 'react'
import { laySkin } from '../skin/registry'
import { anhDauNv, hopDauNv, tayDauNv, type NvId } from '../skin/nhanVat'
import type { TuTheDau } from '../skin/heroDau'
import type { ChieuBoss, ClipBoss } from '../skin/kieu'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import { BossAnhHS } from '../boss/BossSan'
import type { TuTheBoss } from '../boss/noiDungBoss'
import { AURA, LOC_BOSS, phatDon, type Don, type Hop, type TtBoss, type TtHero } from '../thuthach/hieuUng'
import { CSS_SAN_DAU, DAT_SAN_DAU, useNapTruoc, useTuThe } from '../thuthach/DauTruongHS'
import { QuaiTam } from './ban2d/HinhTam'

export interface SanApi {
  /** tung 1 đòn (trả về khi xong, nhân vật/quái về tư thế đứng) */
  phat: (d: Don) => Promise<void>
  /** nhảy mừng (hạ hết đội hình) */
  thang: () => void
}
export interface Ke { loai: string; boss: boolean }

const CSS_QUAI = `
@keyframes sd-vao { from { opacity: 0; transform: translateX(46px) scale(.92) } to { opacity: 1; transform: none } }
@keyframes sd-ha { 0% { transform: none; filter: none } 25% { filter: brightness(2) } 100% { opacity: 0; transform: translateY(14%) rotate(8deg) scale(.9); filter: grayscale(1) } }
.sd-vao { animation: sd-vao .5s ease-out both }
.sd-ha { animation: sd-ha .8s ease-in forwards }
@media (prefers-reduced-motion: reduce) { .sd-vao, .sd-ha { animation: none !important } .sd-ha { opacity: 0 } }
`

export const SanDon2D = forwardRef<SanApi, { nv: NvId; sanCao: number; ke: Ke; keId: number; ha: boolean; b: BangMau3D }>(function SanDon2D({ nv, sanCao, ke, keId, ha, b }, ref) {
  const [hero, setHero] = useState<TtHero>('nghi')
  const [boss, setBoss] = useState<TuTheBoss>('dung')
  const [don, setDon] = useState<Don | null>(null)
  const pose = useTuThe(hero, don)
  useNapTruoc(nv)
  const cao = Math.round(sanCao * 0.5)
  const skin = laySkin(null)
  const anhBossImg = useRef<HTMLImageElement | null>(null)
  const infoBoss = skin.boss?.[ke.loai]
  const coAnhBoss = !!infoBoss
  const [clipBoss, setClipBoss] = useState<ClipBoss | null>(null) // chiêu riêng của boss có hoạt ảnh (Skin.boss[..].chieuRieng) đang phát
  const luotChieu = useRef(0)
  const [lao, setLao] = useState(0) // boss LAO sang trái bấy nhiêu px (chiêu tia: tia trong ảnh có chiều dài cố định, boss phải áp sát thì mới chạm nhân vật)
  useEffect(() => { const src = skin.boss?.[ke.loai]?.trung; if (src) { const im = new Image(); im.src = src; anhBossImg.current = im } else anhBossImg.current = null }, [skin, ke.loai])
  const sanRef = useRef<HTMLDivElement>(null)
  const chuyenRef = useRef<HTMLDivElement>(null)
  const cvRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const bossRef = useRef<HTMLDivElement>(null)
  const loc = useRef<HTMLDivElement>(null)
  const poseBoss = useRef<'dung' | 'trung'>('dung')
  const rungRaf = useRef(0)
  useEffect(() => () => cancelAnimationFrame(rungRaf.current), [])

  const rung = useCallback((bien: number, ms: number) => {
    const el = chuyenRef.current; if (!el) return
    cancelAnimationFrame(rungRaf.current)
    const t0 = performance.now()
    const f = (now: number) => {
      const k = (now - t0) / ms
      if (k >= 1) { el.style.transform = ''; return }
      const a = bien * (1 - k)
      el.style.transform = `translate(${(Math.random() - 0.5) * 2 * a}px, ${(Math.random() - 0.5) * 2 * a}px)`
      rungRaf.current = requestAnimationFrame(f)
    }
    rungRaf.current = requestAnimationFrame(f)
  }, [])

  const hop = (el: HTMLElement | null): Hop => {
    const s = sanRef.current!.getBoundingClientRect(), r = el!.getBoundingClientRect()
    return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height }
  }

  const dien = (d: Don): Promise<void> => {
    if (!sanRef.current || !cvRef.current || !heroRef.current || !bossRef.current) return Promise.resolve()
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return new Promise((r) => setTimeout(r, 500))
    const s = sanRef.current.getBoundingClientRect()
    const h = hop(heroRef.current), bb = hop(bossRef.current)
    const tayCua = (p: TuTheDau) => { const v = hopDauNv(nv, p, cao, h.w / 2, h.h), [tx, ty] = tayDauNv(nv, p); return { x: h.x + v.left + tx * v.width, y: h.y + v.top + ty * v.height } }
    const pPhong: TuTheDau = d === 'cau_lua_lon' || d === 'cau_bang_lon' ? 'nem_truoc_2' : 'phat_nho'
    return phatDon(cvRef.current, d, { W: s.width, H: s.height, hero: h, boss: bb, tay: tayCua('tich_nang_2'), phong: tayCua(pPhong), bossAnh: anhBossImg.current }, {
      rung,
      hero: setHero,
      boss: (tt: TtBoss) => {
        if (loc.current) loc.current.style.filter = LOC_BOSS[tt]
        const muon = tt === 'dung' ? 'dung' : 'trung'
        if (poseBoss.current !== muon) { poseBoss.current = muon; setBoss(muon) }
      },
    })
  }

  // CHIÊU RIÊNG của boss có hoạt ảnh (Skin.boss[..].chieuRieng): phát clip, tới đúng khung "phóng" thì tia chạm / vật bay (ảnh FX riêng) và nhân vật bị đánh.
  //   Minh Quân: tia laser · tên lửa đơn · mưa tên lửa. Trang/Cường (07/10): ném BTVN · mưa BTVN · đập thước (song) · sách hoá cầu lửa · vung kiếm phóng gà — thêm
  //   `thoai` (bong bóng), `ban` (bàn gỗ), `sac` (lửa nạp ở sách), `chem` (hồ quang kiếm); ảnh bay riêng từng chiêu qua `qua.anh`.
  const dienBoss = async (ch: ChieuBoss): Promise<void> => {
    const goc = chuyenRef.current
    if (!goc || !heroRef.current || !bossRef.current) return
    const tong = ch.clip.ms.reduce((a, b) => a + b, 0)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setClipBoss(ch.clip); await new Promise((r) => setTimeout(r, 600)); return }
    setClipBoss(ch.clip)
    const h = hop(heroRef.current), bb = hop(bossRef.current), k = (keCao * 1.25) / 768
    const tam = { x: h.x + h.w / 2, y: h.y + h.h * 0.5 }
    const dat: number[] = []
    const rac: Element[] = [] // phần tử dựng thêm vào sân — dọn hết khi chiêu xong
    const hen = (ms: number, f: () => void) => { dat.push(window.setTimeout(f, ms)) }
    const them = <T extends Element>(e: T, ms = 0): T => { goc.appendChild(e); rac.push(e); if (ms) window.setTimeout(() => e.remove(), ms); return e }
    const trung = () => { setHero('bi_danh'); rung(9, 380) }
    const no = (x: number, y: number, co = 96) => {
      const e = document.createElement('div')
      Object.assign(e.style, { position: 'absolute', left: '0', top: '0', width: `${co}px`, height: `${co}px`, borderRadius: '50%', zIndex: '26', pointerEvents: 'none', background: infoBoss?.fx?.no ?? 'transparent' })
      goc.appendChild(e)
      const a = e.animate([{ transform: `translate(${x - co / 2}px, ${y - co / 2}px) scale(.3)`, opacity: 1 }, { transform: `translate(${x - co / 2}px, ${y - co / 2}px) scale(1.5)`, opacity: 0 }], { duration: 380, easing: 'ease-out', fill: 'forwards' })
      a.onfinish = () => e.remove()
      window.setTimeout(() => e.remove(), 1200) // tab nền không chạy hoạt ảnh ⇒ onfinish không bắn: dọn cưỡng bức
    }
    // đường bay cong (Bézier bậc 2) của 1 vật có ảnh. `anh` riêng của chiêu (Trang/Cường) vẽ mũi hướng PHẢI mà boss bay sang TRÁI ⇒ lật ngang thay vì xoay ngược đầu; chữ (xoay=false) giữ thẳng.
    const bay = (sx: number, sy: number, tx: number, ty: number, ms: number, vong: number, q: NonNullable<ChieuBoss['qua']>) => {
      const anh = q.anh ?? infoBoss?.anhTenLua; if (!anh) return
      const w = keCao * (q.rong ?? 0.4), hh = w * (q.ty ?? 223 / 536), rieng = !!q.anh
      const im = new Image(); im.src = anh
      Object.assign(im.style, { position: 'absolute', left: '0', top: '0', width: `${w}px`, maxWidth: 'none', zIndex: '25', pointerEvents: 'none', filter: `drop-shadow(0 0 8px ${q.quang ?? infoBoss?.fx?.vet ?? 'transparent'})` })
      goc.appendChild(im)
      const cx = (sx + tx) / 2, cy = Math.min(sy, ty) - vong * sanCao
      const pt = (p: number) => ({ x: (1 - p) ** 2 * sx + 2 * (1 - p) * p * cx + p * p * tx, y: (1 - p) ** 2 * sy + 2 * (1 - p) * p * cy + p * p * ty })
      const kf = Array.from({ length: 17 }, (_, i) => {
        const p = i / 16, a = pt(p), b = pt(Math.min(1, p + 0.02)), dx = b.x - a.x, dy = b.y - a.y, lat = rieng && dx < 0 && q.xoay !== false
        const g = q.xoay === false ? 0 : lat ? (Math.atan2(dy, -dx) * 180) / Math.PI : (Math.atan2(dy, dx) * 180) / Math.PI
        return { transform: `translate(${a.x - w / 2}px, ${a.y - hh / 2}px) rotate(${g}deg)${lat ? ' scaleX(-1)' : ''}`, offset: p }
      })
      im.animate(kf, { duration: ms, easing: 'linear', fill: 'forwards' }).onfinish = () => im.remove()
      window.setTimeout(() => im.remove(), ms + 800)
    }
    const ax = bb.x + keCao / 2, ay = bb.y + keCao * 0.98 // neo chân boss trên sân
    // bong bóng thoại trên đầu boss
    if (ch.thoai) {
      const b = document.createElement('div'); b.textContent = ch.thoai
      const rong = sanRef.current?.clientWidth ?? 600, bx = Math.min(Math.max(ax, 90), rong - 90)
      Object.assign(b.style, { position: 'absolute', left: `${bx}px`, top: `${Math.max(6, bb.y + keCao * 0.12 - 44)}px`, transform: 'translateX(-50%)', zIndex: '27', pointerEvents: 'none', whiteSpace: 'nowrap', font: '700 15px system-ui', color: infoBoss?.fx?.thoai?.chu ?? 'inherit', background: infoBoss?.fx?.thoai?.nen ?? 'transparent', border: `2px solid ${infoBoss?.fx?.thoai?.vien ?? 'transparent'}`, borderRadius: '12px', padding: '6px 14px' })
      them(b, 1900); b.animate([{ opacity: 0 }, { opacity: 1, offset: 0.08 }, { opacity: 1, offset: 0.88 }, { opacity: 0 }], { duration: 1900, fill: 'forwards' })
    }
    // bàn gỗ (đập thước): đứng yên suốt chiêu, mép trên bàn = điểm thước chạm
    if (ch.ban) {
      const im = new Image(); im.src = ch.ban.anh
      const w = ch.ban.rong * k
      Object.assign(im.style, { position: 'absolute', left: `${ax + ch.ban.x * k - w / 2}px`, top: `${ay + ch.ban.y * k}px`, width: `${w}px`, maxWidth: 'none', zIndex: '11', pointerEvents: 'none' })
      them(im)
    }
    // lửa nạp ở sách (sách hoá cầu lửa): lớn dần từ tuMs tới lúc phóng
    if (ch.sac) {
      const sc = ch.sac, cxx = ax + sc.vi[0] * k, cyy = ay + sc.vi[1] * k, w0 = sc.rong * k, dur = Math.max(200, ch.phongMs - sc.tuMs)
      hen(sc.tuMs, () => {
        const cont = document.createElement('div')
        Object.assign(cont.style, { position: 'absolute', left: `${cxx}px`, top: `${cyy}px`, width: '0', height: '0', zIndex: '26', pointerEvents: 'none' })
        const lq = document.createElement('div')
        Object.assign(lq.style, { position: 'absolute', left: `${-w0 * 0.55}px`, top: `${-w0 * 0.55}px`, width: `${w0 * 1.1}px`, height: `${w0 * 1.1}px`, borderRadius: '50%', background: sc.nen })
        cont.appendChild(lq)
        for (let i = 0; i < 3; i++) {
          const f = document.createElement('img'); f.src = sc.anh
          Object.assign(f.style, { position: 'absolute', left: `${(i - 1) * w0 * 0.25 - w0 / 2}px`, top: `${-w0 * 0.25 + 4}px`, width: `${w0}px`, maxWidth: 'none', opacity: '0.8', transformOrigin: '50% 50%', transform: `rotate(${-90 + (i - 1) * 9}deg)` })
          cont.appendChild(f)
        }
        them(cont)
        cont.animate([{ transform: 'scale(.45)', opacity: 0.4 }, { transform: 'scale(1)', opacity: 1 }], { duration: dur, easing: 'ease-in', fill: 'forwards' })
        window.setTimeout(() => cont.remove(), dur + 40)
      })
    }
    // hồ quang kiếm ở tay boss
    if (ch.chem && ch.qua) {
      const [hx, hy] = ch.qua.nong[0], neo = ch.qua.neo ?? [384, 580], r = 126 * k, c0x = ax + (hx - neo[0] + 34) * k, c0y = ay + (hy - neo[1]) * k
      const a0 = Math.PI + 1.4, a1 = Math.PI - 1.25, P = (a: number) => `${r + r * Math.cos(a)} ${r + r * Math.sin(a)}`
      hen(ch.phongMs, () => {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        s.setAttribute('width', String(2 * r)); s.setAttribute('height', String(2 * r)); s.setAttribute('viewBox', `0 0 ${2 * r} ${2 * r}`)
        Object.assign(s.style, { position: 'absolute', left: `${c0x - r}px`, top: `${c0y - r}px`, zIndex: '26', pointerEvents: 'none', overflow: 'visible', filter: `drop-shadow(0 0 10px ${ch.chem?.bong})` })
        s.innerHTML = `<path d="M ${P(a0)} A ${r} ${r} 0 0 0 ${P(a1)}" fill="none" stroke="${ch.chem?.net}" stroke-width="${Math.max(5, 28 * k)}" stroke-linecap="round"/>`
        them(s, 600)
        s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: 'ease-out', fill: 'forwards' })
      })
    }
    let het = tong
    if (ch.kieu === 'tia') {
      // tia dài `daiTia` px gốc (×k trên màn) tính từ neo chân (= tâm ô boss). Cách nhân vật > tia ⇒ lao tới sao cho đầu tia tới ngực nhân vật (chừa tối thiểu 170px thân boss).
      const cach = bb.x + keCao / 2 - tam.x, can = cach - (ch.daiTia ?? 0) * k * 0.92
      if (can > 0) { const dx = Math.min(can, Math.max(0, cach - 170)); hen(0, () => setLao(dx)) }
      hen(ch.phongMs + 80, () => { setHero('bi_danh'); rung(12, 1000) })
    }
    else if (ch.qua) {
      const q = ch.qua, neo = q.neo ?? [384, 580]
      const diem = (i: number) => { const [nx, ny] = q.nong[i % q.nong.length]; return { x: ax + (nx - neo[0]) * k, y: ay + (ny - neo[1]) * k } }
      if (ch.kieu === 'song') {
        // đập thước: nổ ngay chỗ thước + sóng xung kích (elip tím) lan tới ngực nhân vật rồi nổ tại chỗ nhân vật
        const g0 = diem(0), d = { x: h.x + h.w / 2, y: h.y + h.h * 0.55 }, ew = 127 * k, eh = 446 * k
        hen(ch.phongMs, () => {
          no(g0.x, g0.y, 150); no(g0.x, g0.y, 100)
          const e = document.createElement('div')
          Object.assign(e.style, { position: 'absolute', left: '0', top: '0', width: `${ew}px`, height: `${eh}px`, borderRadius: '50%', border: `${Math.max(4, 16 * k)}px solid ${infoBoss?.fx?.song?.vien ?? 'transparent'}`, boxShadow: `0 0 18px ${infoBoss?.fx?.song?.bong ?? 'transparent'}`, zIndex: '25', pointerEvents: 'none', boxSizing: 'border-box' })
          them(e, q.bay + 900)
          e.animate([{ transform: `translate(${g0.x - ew / 2}px, ${g0.y - eh * 0.45}px)`, opacity: 1 }, { transform: `translate(${d.x - ew / 2}px, ${d.y - eh / 2}px)`, opacity: 0.45 }], { duration: q.bay, easing: 'linear', fill: 'forwards' }).onfinish = () => e.remove()
          hen(q.bay, () => { no(d.x, d.y, 150); trung() })
        })
        het = Math.max(tong, ch.phongMs + q.bay + 500)
      } else {
        const vong = q.vong ?? (q.n > 1 ? 0.5 : 0)
        for (let i = 0; i < q.n; i++) {
          const { x: sx, y: sy } = diem(i)
          const d = q.n === 1 ? tam : { x: h.x + h.w * (0.2 + 0.6 * ((i * 0.37) % 1)), y: h.y + h.h * (0.4 + 0.5 * ((i * 0.61) % 1)) }
          hen(ch.phongMs + i * q.cach, () => { if (i === 0 && ch.sac) no(sx, sy, 120); bay(sx, sy, d.x, d.y, q.bay, vong, q); hen(q.bay, () => { no(d.x, d.y, q.n > 8 ? 70 : 96); trung() }) })
        }
        het = Math.max(tong, ch.phongMs + (q.n - 1) * q.cach + q.bay + 400)
      }
    }
    await new Promise((r) => setTimeout(r, het + 200))
    dat.forEach((t) => window.clearTimeout(t))
    rac.forEach((e) => e.remove())
    setClipBoss(null); setLao(0)
  }

  useImperativeHandle(ref, () => ({
    phat: async (d) => {
      const rieng = d === 'boss_ma_thuat' ? infoBoss?.chieuRieng : undefined
      if (rieng?.length) {
        try { await dienBoss(rieng[luotChieu.current++ % rieng.length]) } finally { setClipBoss(null); setLao(0); setHero('nghi') }
        return
      }
      setDon(d)
      if (d === 'boss_ma_thuat') setBoss('chieu')
      await new Promise((r) => setTimeout(r, 60)) // chờ DOM cập nhật tư thế
      try { await dien(d) } finally {
        if (loc.current) loc.current.style.filter = ''
        poseBoss.current = 'dung'; setBoss('dung')
        setHero('nghi'); setDon(null)
      }
    },
    thang: () => setHero('thang'),
  }))

  const heroW = Math.round(cao * 0.62)
  const hv = hopDauNv(nv, pose, cao, heroW / 2, cao)
  const keCao = Math.round(cao * (ke.boss ? 1.2 : 1))
  const day = Math.round(sanCao * (1 - DAT_SAN_DAU))

  return (
    <div ref={sanRef} className="absolute inset-0 overflow-hidden">
      <style>{CSS_SAN_DAU}{CSS_QUAI}</style>
      <div ref={chuyenRef} className="absolute inset-0">
        {skin.sanDau
          ? <img src={skin.sanDau} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" style={{ objectPosition: '50% 72%' }} />
          : <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 90% at 70% 100%, var(--sk-surface2) 0%, var(--sk-bg) 70%)' }} />}
        <div ref={heroRef} className="absolute z-10" style={{ bottom: day, height: cao, width: heroW, left: '9%', ['--dt-aura' as string]: don ? AURA[don] : 'transparent' } as CSSProperties}>
          <span className="pointer-events-none absolute left-1/2 rounded-[50%]" style={{ bottom: -cao * 0.03, width: cao * 0.5, height: cao * 0.08, transform: 'translateX(-50%)', background: 'radial-gradient(closest-side, rgba(0,0,0,.45), transparent)' }} />
          <div className="dt-hero relative h-full w-full" data-h={hero} key={`h-${hero}`}>
            <img src={anhDauNv(nv, pose)} alt="" draggable={false} className="absolute max-w-none select-none" style={{ left: hv.left, top: hv.top, width: hv.width, height: hv.height }} />
          </div>
        </div>
        <div className="absolute right-[7%] z-10 flex flex-col items-center" style={{ bottom: day, width: keCao + 8 }}>
          <div key={keId} className={ha && !infoBoss?.khung ? 'sd-ha' : 'sd-vao'}>
            <div ref={bossRef} style={{ width: keCao, height: keCao }}>
              <div ref={loc} style={{ transition: 'filter .08s, transform .3s cubic-bezier(.2,.8,.3,1)', transform: lao ? `translateX(${-lao}px)` : undefined }} className="h-full w-full">
                {coAnhBoss ? <BossAnhHS ma={ke.loai} tt={ha && infoBoss?.khung ? 'ha' : boss} cao={keCao} clip={clipBoss} /> : <QuaiTam b={b} loai={ke.loai} boss={ke.boss} co={keCao} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={cvRef} className="pointer-events-none absolute inset-0 z-30 h-full w-full" />
    </div>
  )
})
