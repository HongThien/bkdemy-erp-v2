// SÀN ĐẤU 2D — dùng lại bộ chiến đấu của Đấu trường (Thùy 03/10: "không dùng 3D, lấy kiểu đánh nhau của đấu trường"):
//  · nhân vật = 15 tư thế nam/nữ (screens/hocsinh/skin/heroDau.ts), bot = Boss Thùy (6 tư thế ảnh);
//  · đòn = engine canvas screens/hocsinh/thuthach/hieuUng.ts (cầu lửa/băng, tia điện, sét, thiên thạch, ma thuật boss).
// Engine vốn vẽ "nhân vật trái → boss phải". Người bên PHẢI tung đòn ⇒ lật gương cả canvas và đổi toạ độ sang hệ lật.
// Mỗi từ ăn được = 1 đòn NHỎ (~1s, vừa nhịp 1,9s giữa 2 từ); cuối trận người thắng tung đòn KẾT LIỄU (sét / thiên thạch), người thua gục.
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { anhDau, hopDau, HERO_DAU, TU_THE_DAU, type TuTheDau } from '../../screens/hocsinh/skin/heroDau'
import { AURA, LOC_BOSS, napFx, phatDon, type Don, type Hop, type TtBoss, type TtHero } from '../../screens/hocsinh/thuthach/hieuUng'
import { NHAN_VAT, nvChuan } from './Chung'

export interface SuKienSan { seq: number; loai: 'danh' | 'ket'; ben: -1 | 0 | 1 }

const R = '/bk-ui/hs/skin/rpg'
const NEN = R + '/dau_truong/nen_san_dau.jpg'
type TtBossAnh = 'dung' | 'trung' | 'chieu' | 'gian' | 'ha' | 'noi'
const anhBoss = (p: TtBossAnh) => `${R}/boss_thuy_${p}.png`

// ── chuỗi tư thế (theo bảng "Chuỗi động tác" DESIGN.md bộ chiến đấu — cùng luật DauTruongHS) ──
type Buoc = { p: TuTheDau; ms?: number }
function chuoi(tt: TtHero, don: Don | null): { b: Buoc[]; lap?: boolean } {
  switch (tt) {
    case 'nghi': return { b: [{ p: 'dung_1', ms: 900 }, { p: 'dung_2', ms: 900 }], lap: true }
    case 'tich_nang': return { b: [{ p: 'tich_nang_1', ms: 325 }, { p: 'tich_nang_2', ms: 325 }], lap: true }
    case 'tung_don': return don === 'set' || don === 'thien_thach' ? { b: [{ p: 'niem_troi_1', ms: 120 }, { p: 'niem_troi_2' }] }
      : don === 'cau_lua_lon' || don === 'cau_bang_lon' ? { b: [{ p: 'nem_truoc_1', ms: 150 }, { p: 'nem_truoc_2' }] } : { b: [{ p: 'phat_nho' }] }
    case 'bi_danh': return { b: [{ p: 'bi_danh_1', ms: 250 }, { p: 'bi_danh_2' }] }
    case 'guc': return { b: [{ p: 'guc' }] }
    case 'thang': return { b: [{ p: 'thang_1', ms: 550 }, { p: 'thang_2', ms: 550 }], lap: true }
  }
}
function useTuThe(tt: TtHero, don: Don | null): TuTheDau {
  const { b, lap } = chuoi(tt, don)
  const [i, setI] = useState(0)
  useEffect(() => {
    setI(0)
    let k = 0, h = 0
    const buoc = () => { const ms = b[k].ms; if (ms === undefined) return; h = window.setTimeout(() => { k = k + 1 < b.length ? k + 1 : lap ? 0 : k; setI(k); buoc() }, ms) }
    buoc()
    return () => clearTimeout(h)
  }, [`${tt}|${don}`]) // eslint-disable-line react-hooks/exhaustive-deps
  return b[Math.min(i, b.length - 1)].p
}

const DON_NHO: Don[] = ['cau_lua_nho', 'cau_bang_nho', 'dien_nho']
const DON_LON: Don[] = ['set', 'thien_thach']
const ngauNhien = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]

/** Chiều cao sân theo khung nhìn. */
function useCaoSan() {
  const tinh = () => Math.round(Math.max(170, Math.min(380, window.innerHeight * 0.36, window.innerWidth * 0.55)))
  const [c, setC] = useState(tinh)
  useEffect(() => { const f = () => setC(tinh()); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f) }, [])
  return c
}

interface Ben { tt: TtHero; don: Don | null; loc: string; boss: TtBossAnh }
const BEN_DAU: Ben = { tt: 'nghi', don: null, loc: 'none', boss: 'dung' }

export function SanDau2D({ trai, phai, suKien, nhanTrai, nhanPhai }: { trai: string; phai: string; suKien: SuKienSan | null; nhanTrai?: string; nhanPhai?: string }) {
  const cao = useCaoSan()
  const sanRef = useRef<HTMLDivElement>(null)
  const chuyenRef = useRef<HTMLDivElement>(null)
  const cvRef = useRef<HTMLCanvasElement>(null)
  const hopRef = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]
  const anhRef = [useRef<HTMLImageElement>(null), useRef<HTMLImageElement>(null)]
  const [ben, setBen] = useState<[Ben, Ben]>([BEN_DAU, BEN_DAU])
  const [lat, setLat] = useState(false)
  const dangDien = useRef<Promise<void>>(Promise.resolve())
  const nv = [NHAN_VAT[nvChuan(trai)], NHAN_VAT[nvChuan(phai)]]

  // nạp trước tư thế + FX
  useEffect(() => {
    for (const n of nv) {
      if (n.boss) for (const p of ['dung', 'trung', 'chieu', 'gian', 'ha'] as TtBossAnh[]) { const im = new Image(); im.src = anhBoss(p) }
      else for (const p of TU_THE_DAU) { const im = new Image(); im.src = anhDau(n.gioi, p) }
    }
    void napFx()
  }, [trai, phai]) // eslint-disable-line react-hooks/exhaustive-deps

  const dat = (g: 0 | 1, p: Partial<Ben>) => setBen((b) => { const m = [...b] as [Ben, Ben]; m[g] = { ...m[g], ...p }; return m })

  const rung = (bien: number, ms: number) => {
    const el = chuyenRef.current; if (!el) return
    const t0 = performance.now()
    const f = (now: number) => {
      const k = (now - t0) / ms
      if (k >= 1) { el.style.transform = ''; return }
      const a = bien * (1 - k)
      el.style.transform = `translate(${(Math.random() - 0.5) * 2 * a}px, ${(Math.random() - 0.5) * 2 * a}px)`
      requestAnimationFrame(f)
    }
    requestAnimationFrame(f)
  }

  /** Bên g tung đòn d vào bên kia. Trả về khi xong. */
  const tungDon = (g: 0 | 1, d: Don): Promise<void> => {
    const san = sanRef.current, cv = cvRef.current, hA = hopRef[g].current, hB = hopRef[1 - g].current
    if (!san || !cv || !hA || !hB) return Promise.resolve()
    const s = san.getBoundingClientRect()
    const hop = (el: HTMLElement): Hop => { const r = el.getBoundingClientRect(); return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height } }
    const W = s.width, H = s.height
    const guong = (h: Hop): Hop => ({ ...h, x: W - h.x - h.w })
    const nA = nv[g], laBossDanh = !!nA.boss
    const dich = (1 - g) as 0 | 1
    if (laBossDanh) {
      // boss (luôn bên phải) dùng đòn ma thuật có sẵn: n.boss = boss, n.hero = người bị đánh
      setLat(false)
      return phatDon(cv, 'boss_ma_thuat', { W, H, hero: hop(hB), boss: hop(hA), tay: { x: 0, y: 0 } }, {
        rung,
        hero: (t) => dat(dich, { tt: t === 'bi_danh' ? 'bi_danh' : 'nghi' }),
        boss: (t) => dat(g, { boss: t === 'dung' ? 'dung' : 'chieu' }),
      }).then(() => { dat(g, { boss: 'dung' }); dat(dich, { tt: 'nghi' }) })
    }
    // người (nhân vật 15 tư thế) đánh: bên phải ⇒ lật gương
    const lap = g === 1
    setLat(lap)
    const hAt = lap ? guong(hop(hA)) : hop(hA)
    const hDt = lap ? guong(hop(hB)) : hop(hB)
    const tayCua = (p: TuTheDau) => {
      const v = hopDau(nA.gioi, p, hAt.h, hAt.w / 2, hAt.h), [tx, ty] = HERO_DAU[nA.gioi][p].tay[0]
      return { x: hAt.x + v.left + tx * v.width, y: hAt.y + v.top + ty * v.height }
    }
    const pPhong: TuTheDau = d === 'cau_lua_lon' || d === 'cau_bang_lon' ? 'nem_truoc_2' : d === 'set' || d === 'thien_thach' ? 'niem_troi_2' : 'phat_nho'
    dat(g, { don: d })
    return phatDon(cv, d, { W, H, hero: hAt, boss: hDt, tay: tayCua('tich_nang_2'), phong: tayCua(pPhong), bossAnh: anhRef[dich].current }, {
      rung,
      hero: (t) => dat(g, { tt: t }),
      boss: (t: TtBoss) => {
        if (nv[dich].boss) dat(dich, { loc: LOC_BOSS[t], boss: t === 'dung' ? 'dung' : 'trung' })
        else dat(dich, { loc: LOC_BOSS[t], tt: t === 'dung' ? 'nghi' : 'bi_danh' })
      },
    }).then(() => { dat(g, { tt: 'nghi', don: null }); dat(dich, { loc: 'none' }) })
  }

  useEffect(() => {
    if (!suKien) return
    const { loai, ben: b } = suKien
    // xếp hàng: đòn sau chờ đòn trước diễn xong
    dangDien.current = dangDien.current.then(async () => {
      if (loai === 'danh' && b !== -1) {
        await tungDon(b, ngauNhien(DON_NHO))
      } else if (loai === 'ket') {
        if (b === -1) { setBen([BEN_DAU, BEN_DAU]); return }
        const l = (1 - b) as 0 | 1
        await tungDon(b, nv[b].boss ? 'boss_ma_thuat' : ngauNhien(DON_LON))
        if (nv[l].boss) dat(l, { boss: 'ha', loc: 'none' }); else dat(l, { tt: 'guc', loc: 'none' })
        if (nv[b].boss) dat(b, { boss: 'noi' }); else dat(b, { tt: 'thang' })
      }
    })
  }, [suKien?.seq]) // eslint-disable-line react-hooks/exhaustive-deps

  const day = Math.round(cao * 0.1)
  const caoNv = Math.round(cao * 0.56)
  return (
    <div ref={sanRef} className="san2d-dau" style={{ height: cao }}>
      <div ref={chuyenRef} className="san2d-chuyen">
        <img src={NEN} alt="" draggable={false} className="san2d-nen" />
        {([0, 1] as const).map((g) => (
          <NhanVatSan key={g} g={g} n={nv[g]} ben={ben[g]} caoNv={caoNv} day={day} hopRef={hopRef[g]} anhRef={anhRef[g]} nhan={g === 0 ? nhanTrai : nhanPhai} />
        ))}
      </div>
      <canvas ref={cvRef} className="san2d-cv" style={{ transform: lat ? 'scaleX(-1)' : undefined }} />
    </div>
  )
}

function NhanVatSan({ g, n, ben, caoNv, day, hopRef, anhRef, nhan }: {
  g: 0 | 1; n: (typeof NHAN_VAT)[string]; ben: Ben; caoNv: number; day: number
  hopRef: RefObject<HTMLDivElement>; anhRef: RefObject<HTMLImageElement>; nhan?: string
}) {
  const pose = useTuThe(ben.tt, ben.don)
  const phai = g === 1
  if (n.boss) {
    const c = Math.round(caoNv * 1.45)
    return (
      <div ref={hopRef} className="nv-san" style={{ bottom: day * 0.6, [phai ? 'right' : 'left']: '6%', width: c, height: c }}>
        <img ref={anhRef} src={anhBoss(ben.boss)} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: ben.loc, transform: phai ? undefined : 'scaleX(-1)', transition: 'filter .08s' }} />
        {nhan && <span className="nhan-san">{nhan}</span>}
      </div>
    )
  }
  const w = Math.round(caoNv * 0.62)
  const hv = hopDau(n.gioi, pose, caoNv, w / 2, caoNv)
  return (
    <div ref={hopRef} className="nv-san" style={{ bottom: day, [phai ? 'right' : 'left']: '12%', width: w, height: caoNv, ['--dt-aura' as string]: ben.don ? AURA[ben.don] : 'transparent' } as CSSProperties}>
      <span className="bong-chan" style={{ width: caoNv * 0.5, height: caoNv * 0.08, bottom: -caoNv * 0.03 }} />
      {/* lớp ngoài lật gương, lớp trong chạy hoạt ảnh (transform của hoạt ảnh không đè mất phần lật) */}
      <div style={{ position: 'relative', width: '100%', height: '100%', transform: phai ? 'scaleX(-1)' : undefined }}>
        <div className="dt-hero" data-h={ben.tt} key={ben.tt} style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img ref={anhRef} src={anhDau(n.gioi, pose)} alt="" draggable={false}
            style={{ position: 'absolute', maxWidth: 'none', left: hv.left, top: hv.top, width: hv.width, height: hv.height, filter: ben.loc, transition: 'filter .08s' }} />
        </div>
      </div>
      {nhan && <span className="nhan-san">{nhan}</span>}
    </div>
  )
}
