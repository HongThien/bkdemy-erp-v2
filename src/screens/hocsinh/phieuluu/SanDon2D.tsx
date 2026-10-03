// SÂN ĐẤU 2D dùng cho MÀN ĐẤU của "Học theo chủ đề" (Thùy 03/10: "làm chỗ combat ở dạng bài thành dạng 2D"): thay cảnh 3D của DauView bằng cùng bộ đồ hoạ 2D của Đấu trường —
// nhân vật chính em chọn (15 tư thế chiến đấu, skin/heroDau.ts) bên TRÁI, quái/boss bên PHẢI, nền sân (Skin.sanDau), đòn bằng canvas (thuthach/hieuUng.ts).
// Cha chỉ gọi `phat(don)` / `thang()` / `guc()` qua ref; quái đang đấu truyền bằng props (`ke`), `ha` = quái đang ngã.
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from 'react'
import { laySkin } from '../skin/registry'
import { anhDauNv, hopDauNv, tayDauNv, type NvId } from '../skin/nhanVat'
import type { TuTheDau } from '../skin/heroDau'
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
  const coAnhBoss = !!skin.boss?.[ke.loai]
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

  useImperativeHandle(ref, () => ({
    phat: async (d) => {
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
          <div key={keId} className={ha ? 'sd-ha' : 'sd-vao'}>
            <div ref={bossRef} style={{ width: keCao, height: keCao }}>
              <div ref={loc} style={{ transition: 'filter .08s' }} className="h-full w-full">
                {coAnhBoss ? <BossAnhHS ma={ke.loai} tt={boss} cao={keCao} /> : <QuaiTam b={b} loai={ke.loai} boss={ke.boss} co={keCao} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={cvRef} className="pointer-events-none absolute inset-0 z-30 h-full w-full" />
    </div>
  )
})
