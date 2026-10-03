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

  // CHIÊU RIÊNG của boss có hoạt ảnh (vd Minh Quân: tia laser · tên lửa đơn · mưa tên lửa): phát clip, tới đúng khung "phóng" thì tia chạm / tên lửa bay (ảnh FX riêng) và nhân vật bị đánh.
  const dienBoss = async (ch: ChieuBoss): Promise<void> => {
    const goc = chuyenRef.current
    if (!goc || !heroRef.current || !bossRef.current) return
    const tong = ch.clip.ms.reduce((a, b) => a + b, 0)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setClipBoss(ch.clip); await new Promise((r) => setTimeout(r, 600)); return }
    setClipBoss(ch.clip)
    const h = hop(heroRef.current), bb = hop(bossRef.current), k = (keCao * 1.25) / 768
    const tam = { x: h.x + h.w / 2, y: h.y + h.h * 0.5 }
    const dat: number[] = []
    const hen = (ms: number, f: () => void) => { dat.push(window.setTimeout(f, ms)) }
    const trung = () => { setHero('bi_danh'); rung(9, 380) }
    const no = (x: number, y: number) => {
      const e = document.createElement('div')
      Object.assign(e.style, { position: 'absolute', left: '0', top: '0', width: '96px', height: '96px', borderRadius: '50%', zIndex: '26', pointerEvents: 'none', background: infoBoss?.fx?.no ?? 'transparent' })
      goc.appendChild(e)
      const a = e.animate([{ transform: `translate(${x - 48}px, ${y - 48}px) scale(.3)`, opacity: 1 }, { transform: `translate(${x - 48}px, ${y - 48}px) scale(1.5)`, opacity: 0 }], { duration: 380, easing: 'ease-out', fill: 'forwards' })
      a.onfinish = () => e.remove()
      window.setTimeout(() => e.remove(), 1200) // tab nền không chạy hoạt ảnh ⇒ onfinish không bắn: dọn cưỡng bức
    }
    const bay = (sx: number, sy: number, tx: number, ty: number, ms: number, vong: boolean) => {
      const anh = infoBoss?.anhTenLua; if (!anh) return
      const w = keCao * 0.4, hh = (w * 223) / 536
      const im = new Image(); im.src = anh
      Object.assign(im.style, { position: 'absolute', left: '0', top: '0', width: `${w}px`, maxWidth: 'none', zIndex: '25', pointerEvents: 'none', filter: `drop-shadow(0 0 8px ${infoBoss?.fx?.vet ?? 'transparent'})` })
      goc.appendChild(im)
      const cx = (sx + tx) / 2, cy = Math.min(sy, ty) - (vong ? sanCao * 0.5 : 0)
      const pt = (p: number) => ({ x: (1 - p) ** 2 * sx + 2 * (1 - p) * p * cx + p * p * tx, y: (1 - p) ** 2 * sy + 2 * (1 - p) * p * cy + p * p * ty })
      const kf = Array.from({ length: 17 }, (_, i) => { const p = i / 16, a = pt(p), b = pt(Math.min(1, p + 0.02)); return { transform: `translate(${a.x - w / 2}px, ${a.y - hh / 2}px) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI}deg)`, offset: p } })
      im.animate(kf, { duration: ms, easing: 'linear', fill: 'forwards' }).onfinish = () => im.remove()
      window.setTimeout(() => im.remove(), ms + 800)
    }
    let het = tong
    if (ch.kieu === 'tia') hen(ch.phongMs, () => { setHero('bi_danh'); rung(12, 1000) })
    else if (ch.qua) {
      const q = ch.qua
      for (let i = 0; i < q.n; i++) {
        const [nx, ny] = q.nong[i % q.nong.length]
        const sx = bb.x + keCao / 2 + (nx - 384) * k, sy = bb.y + keCao * 0.98 + (ny - 580) * k
        const d = q.n === 1 ? tam : { x: h.x + h.w * (0.2 + 0.6 * ((i * 0.37) % 1)), y: h.y + h.h * (0.4 + 0.5 * ((i * 0.61) % 1)) }
        hen(ch.phongMs + i * q.cach, () => { bay(sx, sy, d.x, d.y, q.bay, q.n > 1); hen(q.bay, () => { no(d.x, d.y); trung() }) })
      }
      het = Math.max(tong, ch.phongMs + (q.n - 1) * q.cach + q.bay + 400)
    }
    await new Promise((r) => setTimeout(r, het + 200))
    dat.forEach((t) => window.clearTimeout(t))
    setClipBoss(null)
  }

  useImperativeHandle(ref, () => ({
    phat: async (d) => {
      const rieng = d === 'boss_ma_thuat' ? infoBoss?.chieuRieng : undefined
      if (rieng?.length) {
        try { await dienBoss(rieng[luotChieu.current++ % rieng.length]) } finally { setClipBoss(null); setHero('nghi') }
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
              <div ref={loc} style={{ transition: 'filter .08s' }} className="h-full w-full">
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
