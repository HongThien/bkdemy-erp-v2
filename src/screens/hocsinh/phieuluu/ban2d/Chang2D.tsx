// TẦNG 3 — CHẶNG ĐƯỜNG (các DẠNG của 1 chuyên đề) — Thùy 03/10 chốt "Hướng 1": 1 con đường GẦN THẲNG ngang giữa màn, nền THỜI TIẾT của vùng,
// mỗi dạng = 1 trạm (bệ đá + quái) trên đường, KÉO NGANG như thanh tiến trình (không gom hết vào 1 màn), dạng cuối có CỜ ĐÍCH đơn giản.
// Cảnh vẽ bằng three.js (canhChangThree.ts — nhiều lớp trượt khác tốc độ + hạt thời tiết); máy không có WebGL ⇒ nền ảnh chặng cũ / dải màu.
// Trạm, nhãn, cờ, sương, mũi tên = DOM trên dải cuộn (bấm được, đọc được). Phải: chi tiết chặng + nút vào màn đấu. Cùng props với ChangView.
// ⭐ NỀN TRANH (Thùy 03/10, kit hs-hoc-va-choi-luc-dia-bang-v2): biome có nen_dang_<biome>.jpg ⇒ nền nhìn ngang có ĐƯỜNG lát đá vẽ sẵn (≈74% chiều cao),
//   lặp ngang nối GƯƠNG (ảnh lẻ lật ngang ⇒ mép khớp) theo bề dài dải cuộn; mỗi dạng = 1 CÔNG TRÌNH của chính lục địa đó (kit lục địa, 8 loại to dần —
//   dạng i lấy công trình rải đều 1→8) đứng trên đường; biome chưa có kit công trình ⇒ bệ đá + quái. Không có nền tranh ⇒ cảnh three.js như trước.
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as PE } from 'react'
import { DauTrangHS, HEAD, NhanHS, NutHS, THE, THE_TRON, useMedia } from '../../skin/KhungHS'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import type { ChangV, LucDiaV, VungV } from '../kieu'
import type { BoCucChang, CanhChang } from './canhChangThree'
import { Fragment } from 'react'
import { anhNenChang, anhNenDang, anhVat } from './hinh2d'
import { KIT_LUC_DIA } from './kitLucDia'
import { ANH_KIT } from './kitLucDia.anh'
import { CHU_VIEN, Co, CssBan2D, MuiTen, Sao5, Suong, tenQuai2D, useChuyenDong } from './San2D'
import { BeDaTam, QuaiTam } from './HinhTam'

const RONG_MAC_DINH = [10, 10, 11, 12, 13, 16, 18, 20] // bề rộng công trình (% khung 1672) khi lục địa chưa có KIT_LUC_DIA — theo DESIGN.md kit băng
const sao = (n: number) => '★'.repeat(Math.min(5, n)) + '☆'.repeat(Math.max(0, 5 - n))
const moTa = (c: ChangV) => (c.trang_thai === 'dat' ? 'đã hạ' : c.trang_thai === 'yeu' ? (c.hp != null ? `còn ${c.hp} đòn` : 'còn quái') : 'chưa gặp')
/** y của đường tại x — PHẢI cùng công thức `yDuong()` trong shader canhChangThree.ts. */
const yTai = (v: Pick<BoCucChang, 'yDuong' | 'bienDo' | 'tanSo'>, x: number) => v.yDuong + v.bienDo * Math.sin(x * v.tanSo) + v.bienDo * 0.35 * Math.sin(x * v.tanSo * 2.7 + 1.3)

/** Bố cục dải cuộn: trạm cách đều, cờ đích sau trạm cuối; ít trạm (vừa 1 màn) thì canh giữa phần màn còn trống. */
function boCuc(w: number, h: number, n: number, phai: number, duoi: number) {
  const gap = Math.min(330, Math.max(190, w * 0.2)), dau = Math.max(150, w * 0.15), sauCo = Math.max(phai + 110, w * 0.18)
  let xs = Array.from({ length: n }, (_, i) => dau + i * gap)
  let xCo = (xs[n - 1] ?? dau) + gap * 0.85
  let tong = xCo + sauCo
  if (tong <= w) { const lech = (w - phai - (xCo - xs[0])) / 2 - xs[0]; xs = xs.map((x) => x + lech); xCo += lech; tong = w }
  const yDuong = (h - duoi) * 0.7, coBe = Math.min(120, Math.max(60, Math.min(gap * 0.42, h * 0.15)))
  return { xs, xCo, tong, gap, yDuong, bienDo: h * 0.018, tanSo: (Math.PI * 2) / (gap * 2.6), nua: coBe * 0.3, coBe }
}

export function Chang2D({ luc, vung, b, onVe, onVao }: { luc: LucDiaV; vung: VungV; b: BangMau3D; onVe: () => void; onVao: (c: ChangV) => void; gioi?: 'nam' | 'nu' }) {
  const dai = useMedia('(min-width:1024px)')
  const dong = useChuyenDong() && !(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const goc = useRef<HTMLDivElement>(null), cuonRef = useRef<HTMLDivElement>(null), hostRef = useRef<HTMLDivElement>(null)
  const [kt, setKt] = useState({ w: 0, h: 0 })
  const [canh, setCanh] = useState<CanhChang | null>(null)
  const [loi, setLoi] = useState(false)
  const [mep, setMep] = useState({ trai: false, phai: false })
  const [sel, setSel] = useState<string>(() => (vung.chang.find((c) => c.trang_thai === 'yeu') ?? vung.chang.find((c) => c.trang_thai !== 'dat') ?? vung.chang[0]).ma)
  const [hov, setHov] = useState<string | null>(null)
  const keo = useRef<{ x: number; sl: number; di: boolean } | null>(null)

  useLayoutEffect(() => {
    const el = goc.current; if (!el) return
    const f = () => setKt({ w: el.clientWidth, h: el.clientHeight }); f()
    const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect()
  }, [])

  const n = vung.chang.length
  const toi = vung.chang.findIndex((c) => c.trang_thai !== 'dat')
  const xong = toi < 0
  const phai = dai ? 330 : 0, duoi = dai ? 0 : Math.min(260, kt.h * 0.42)
  const bc = boCuc(kt.w || 1, kt.h || 1, n, phai, duoi)
  const xDaDi = xong ? bc.xCo + bc.nua * 3 : toi > 0 ? bc.xs[toi] : -1

  // nạp cảnh three.js (động) theo biome
  const nenDang = anhNenDang(luc.biome)
  useEffect(() => {
    let huy = false, c: CanhChang | null = null
    setLoi(false)
    if (nenDang) return // có nền tranh ⇒ không cần cảnh three.js
    import('./canhChangThree').then((m) => {
      if (huy || !hostRef.current) return
      try { c = m.taoCanhChang(hostRef.current, b, luc.biome); setCanh(c) } catch (e) { console.error('[phieuluu] không dựng được cảnh chặng', e); setLoi(true) }
    }).catch(() => setLoi(true))
    return () => { huy = true; c?.phaHuy(); setCanh(null) }
  }, [b, luc.biome, nenDang])
  useEffect(() => {
    if (canh && kt.w) canh.capNhat({ w: kt.w, h: kt.h, yDuong: bc.yDuong, bienDo: bc.bienDo, tanSo: bc.tanSo, nua: bc.nua, xDau: 0, xCuoi: bc.xCo, xDaDi, xong })
  }, [canh, kt.w, kt.h, bc.yDuong, bc.bienDo, bc.tanSo, bc.nua, bc.xCo, xDaDi, xong])
  useEffect(() => { canh?.datDong(dong) }, [canh, dong])

  // ── chế độ NỀN TRANH: sân cao Hs (trên tấm chi tiết ở màn hẹp), ô tranh rộng tW, chân công trình trên mép đường ≈72,8% Hs
  const Hs = Math.max(1, kt.h - duoi), tW = Hs * (1672 / 941), ySan = Hs * 0.728
  const kitCt = KIT_LUC_DIA[luc.biome], anhCt = ANH_KIT[luc.biome]
  const ct = vung.chang.map((_, i) => {
    if (!anhCt?.moc?.length) return null
    const idx = n <= 1 ? 0 : Math.min(7, Math.round((i * 7) / (n - 1))) // rải đều 8 loại công trình ⇒ dạng sau "to" hơn dạng trước
    const so = anhCt.moc.length, j = Math.min(so - 1, Math.round((idx * (so - 1)) / 7)) // kit 6 công trình (sa mạc) ⇒ co về 6
    const rong = kitCt?.moc[j]?.w ?? RONG_MAC_DINH[idx] // bề rộng % khung: theo kit lục địa; lục địa chưa có bố cục bản đồ (băng) ⇒ bảng mặc định to dần
    // cỡ như ảnh mẫu kit: rộng theo % khung, nhưng CAO không quá 13% → 24% sân (công trình đầu thấp, công trình cuối cao nhất)
    const a = anhCt.moc[j], tran = Hs * (0.13 + (0.11 * idx) / 7)
    let w = tW * (rong / 100) * 0.85, h = (w * a.h) / a.w
    if (h > tran) { w *= tran / h; h = tran }
    return { src: `/bk-ui/hs/skin/rpg/lucdia/${luc.biome}/moc_${j + 1}.webp`, w, h, ax: a.ax, ay: a.ay }
  })
  const rongCt = (i: number) => ct[i]?.w ?? bc.coBe * 1.2
  const kc = Math.max(90, kt.w * 0.075)
  const xsT: number[] = []
  vung.chang.forEach((_, i) => xsT.push(i === 0 ? Math.max(130, kt.w * 0.12) + rongCt(0) / 2 : xsT[i - 1] + (rongCt(i - 1) + rongCt(i)) / 2 + kc))
  let xCoT = (xsT[n - 1] ?? 150) + rongCt(n - 1) / 2 + kc + 40, tongT = xCoT + Math.max(phai + 110, kt.w * 0.18)
  if (tongT <= kt.w) { const lech = (kt.w - phai - (xCoT - xsT[0])) / 2 - xsT[0]; for (let i = 0; i < n; i++) xsT[i] += lech; xCoT += lech; tongT = kt.w }
  const soO = Math.ceil(tongT / tW) + 1

  const capMep = () => { const el = cuonRef.current; if (el) setMep({ trai: el.scrollLeft > 4, phai: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 }) }
  const onCuon = () => { const el = cuonRef.current; if (!el) return; canh?.cuon(el.scrollLeft); capMep() }
  useEffect(() => { onCuon() }, [canh]) // eslint-disable-line react-hooks/exhaustive-deps
  // mở màn: cuộn tới trạm em đang học (hoặc cờ đích nếu xong hết)
  const daCuon = useRef(false)
  useLayoutEffect(() => {
    const el = cuonRef.current; if (!el || !kt.w || daCuon.current) return
    daCuon.current = true
    el.scrollLeft = Math.max(0, (nenDang ? (xong ? xCoT : xsT[Math.max(0, toi)]) : (xong ? bc.xCo : bc.xs[Math.max(0, toi)])) - (kt.w - phai) * 0.4)
    onCuon()
  }, [kt.w]) // eslint-disable-line react-hooks/exhaustive-deps

  // con lăn dọc ⇒ cuộn ngang · kéo chuột để cuộn (cảm ứng đã có sẵn)
  const onWheel = (e: React.WheelEvent) => { const el = cuonRef.current; if (el && Math.abs(e.deltaY) > Math.abs(e.deltaX)) el.scrollLeft += e.deltaY }
  const onDown = (e: PE) => { if (e.pointerType === 'mouse' && cuonRef.current) keo.current = { x: e.clientX, sl: cuonRef.current.scrollLeft, di: false } }
  const onMove = (e: PE) => { const k = keo.current, el = cuonRef.current; if (!k || !el) return; const dx = e.clientX - k.x; if (Math.abs(dx) > 5) k.di = true; if (k.di) el.scrollLeft = k.sl - dx }
  const onUp = () => { setTimeout(() => { keo.current = null }, 0) }
  const truot = (huong: 1 | -1) => cuonRef.current?.scrollBy({ left: huong * bc.gap * 2, behavior: 'smooth' })

  const c = vung.chang.find((x) => x.ma === sel) ?? vung.chang[0]
  const m = b.biome[luc.biome] ?? Object.values(b.biome)[0]
  const coBe = bc.coBe
  const anhNen = anhNenChang(luc.biome)

  return (
    <div ref={goc} className="absolute inset-0 overflow-hidden" style={{ background: 'var(--sk-bg)' }}>
      <CssBan2D />
      {/* nền: cảnh three.js; chưa tải / không WebGL ⇒ ảnh nền chặng cũ */}
      {!nenDang && (!canh || loi) && anhNen && <img src={anhNen} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />}
      <div ref={hostRef} className="pointer-events-none absolute inset-0" aria-hidden />
      <div ref={cuonRef} onScroll={onCuon} onWheel={onWheel} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        className="ban2d absolute inset-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-dong={dong ? '1' : '0'}
        style={{ cursor: keo.current?.di ? 'grabbing' : 'grab', touchAction: 'pan-x' }}>
        <div className="relative h-full" style={{ width: nenDang ? tongT : bc.tong }}>
          {nenDang && kt.w > 0 && (
            <>
              <style>{'.dang-ct{transition:transform .2s ease,filter .2s ease;transform-origin:50% 100%}.dang-ct:hover,.dang-ct[aria-pressed=true]{transform:scale(1.05);filter:brightness(1.08) drop-shadow(0 0 14px rgba(255,216,106,.6))}'}</style>
              {Array.from({ length: soO }, (_, k) => (
                <img key={'o' + k} src={nenDang} alt="" aria-hidden draggable={false} className="pointer-events-none absolute top-0 select-none"
                  style={{ left: k * tW, width: tW + 1, height: Hs, transform: k % 2 ? 'scaleX(-1)' : undefined }} />
              ))}
              {vung.chang.map((x, i) => {
                const px = xsT[i], g = ct[i], chon = sel === x.ma, w = g?.w ?? bc.coBe * 1.2, h = g?.h ?? bc.coBe * 1.2
                const left = px - (g?.ax ?? 0.5) * w, top = ySan - (g?.ay ?? 0.92) * h, cuoi = x.quai[x.quai.length - 1]
                return (
                  <Fragment key={x.ma}>
                    {chon && <span className="ban2d-sang pointer-events-none absolute rounded-full" style={{ left: px - w * 0.7, top: ySan - h * 0.12, width: w * 1.4, height: h * 0.3, background: `radial-gradient(closest-side, ${b.vang}cc, transparent)` }} />}
                    <button onClick={() => { if (!keo.current?.di) setSel(x.ma) }} onPointerEnter={() => setHov(x.ma)} onPointerLeave={() => setHov(null)} aria-pressed={chon}
                      aria-label={`Dạng ${i + 1}: ${x.ten}: ${moTa(x)}`} className="dang-ct absolute" style={{ left, top, width: w, height: h }}>
                      {g ? <img src={g.src} alt="" draggable={false} className="h-full w-full select-none" style={{ filter: x.trang_thai === 'chua_do' ? 'saturate(.55) brightness(.82)' : 'drop-shadow(0 6px 6px rgba(0,0,0,.25))' }} />
                        : <>
                          <span className="absolute bottom-0 left-0 block w-full" style={{ height: h * 0.5 }}>{anhVat('be_da') ? <img src={anhVat('be_da')!} alt="" className="h-full w-full object-contain" draggable={false} /> : <BeDaTam b={b} />}</span>
                          {x.trang_thai !== 'dat' && cuoi && <span className="absolute left-1/2 -translate-x-1/2" style={{ bottom: h * 0.3, width: h * 0.62, height: h * 0.62 }}><QuaiTam b={b} loai={cuoi.loai} boss={cuoi.boss && x.quai.length > 1} bong={x.trang_thai === 'chua_do'} co={h * 0.6} /></span>}
                        </>}
                    </button>
                    {x.trang_thai === 'chua_do' && <Suong mau={b.bot} anh={anhVat('may_suong')} style={{ left: left - w * 0.1, top: top + h * 0.25, width: w * 1.2, height: h * 0.7 }} />}
                    {x.trang_thai === 'dat' && <span className="pointer-events-none absolute" style={{ left: px + w * 0.18, top: top - h * 0.05 }}><Co mau={m.diem} anh={anhVat('co_chinh_phuc')} cao={Math.max(36, h * 0.38)} /></span>}
                    {x.quai.length > 1 && x.trang_thai !== 'dat' && <span className="pointer-events-none absolute rounded-full px-1.5 text-[11px] font-extrabold" style={{ ...HEAD, left: left + w - 18, top: top + h * 0.1, background: 'var(--sk-surface)', color: 'var(--sk-ink)', border: 'var(--sk-card-border)' }}>×{x.quai.length}</span>}
                    {i === toi && <span className="pointer-events-none absolute -translate-x-1/2" style={{ left: px, top: top - Math.max(30, h * 0.3) - 6 }}><MuiTen co={Math.max(30, Math.min(52, h * 0.3))} /></span>}
                    <span className="pointer-events-none absolute flex -translate-x-1/2 flex-col items-center text-center"
                      style={{ ...CHU_VIEN, left: px, top: Hs * 0.775, width: 'max-content', maxWidth: Math.max(110, Math.min(240, Math.min(i > 0 ? px - xsT[i - 1] : 1e9, i < n - 1 ? xsT[i + 1] - px : 1e9) - 16)), transform: chon || hov === x.ma ? 'scale(1.06)' : undefined /* đã có -translate-x-1/2 (thuộc tính translate) — không lặp translateX */ }}>
                      <span className="block max-w-full text-[14px] font-bold leading-[1.15]" style={{ ...HEAD, color: 'var(--sk-ink)' }}><span style={{ color: 'var(--sk-acc)' }}>{i + 1}.</span> {x.ten}</span>
                      <Sao5 ti={x.trang_thai === 'dat' ? 1 : x.mastery ?? 0} co={18} />
                    </span>
                  </Fragment>
                )
              })}
              <div className="pointer-events-none absolute flex flex-col items-center" style={{ left: xCoT, top: ySan, transform: 'translate(-50%,-100%)' }}>
                {xong && <span className="ban2d-sang absolute left-1/2 rounded-full" style={{ bottom: -bc.coBe * 0.2, width: bc.coBe * 2, height: bc.coBe * 0.8, transform: 'translateX(-50%)', background: `radial-gradient(closest-side, ${b.vang}cc, transparent)` }} />}
                <span className="relative" style={{ filter: xong ? undefined : 'saturate(.55) brightness(.85)' }}><Co mau={m.diem} anh={anhVat('co_chinh_phuc')} cao={Math.max(60, Hs * 0.17)} /></span>
              </div>
              <span className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-[14px] font-extrabold" style={{ ...CHU_VIEN, ...HEAD, left: xCoT, top: Hs * 0.775, color: xong ? 'var(--sk-acc)' : 'var(--sk-ink)' }}>{xong ? 'Đã chinh phục!' : 'Đích'}</span>
            </>
          )}
          {!nenDang && kt.w > 0 && vung.chang.map((x, i) => {
            const px = bc.xs[i], py = yTai(bc, px), cuoi = x.quai[x.quai.length - 1], chon = sel === x.ma
            return (
              <div key={x.ma} className="absolute" style={{ left: px, top: py, width: coBe, height: coBe, transform: 'translate(-50%,-80%)' }}>
                <button onClick={() => { if (!keo.current?.di) setSel(x.ma) }} onPointerEnter={() => setHov(x.ma)} onPointerLeave={() => setHov(null)} aria-pressed={chon}
                  aria-label={`Dạng ${i + 1}: ${x.ten}: ${moTa(x)}`} className="ban2d-o absolute left-1/2 top-1/2 h-full w-full" style={{ transform: 'translate(-50%,-50%)' }}>
                  {chon && <span className="ban2d-sang pointer-events-none absolute left-1/2 rounded-full" style={{ top: '88%', width: coBe * 1.35, height: coBe * 0.5, transform: 'translate(-50%,-50%)', background: `radial-gradient(closest-side, ${b.vang}cc, transparent)` }} />}
                  <span className="absolute left-0 block w-full" style={{ height: coBe * 0.55, bottom: -coBe * 0.08 }}>
                    {anhVat('be_da') ? <img src={anhVat('be_da')!} alt="" className="h-full w-full object-contain" draggable={false} /> : <BeDaTam b={b} />}
                  </span>
                  {x.trang_thai !== 'dat' && cuoi && (
                    <span className="absolute left-1/2 -translate-x-1/2" style={{ bottom: coBe * 0.22, width: coBe * (cuoi.boss ? 0.78 : 0.64), height: coBe * (cuoi.boss ? 0.78 : 0.64) }}>
                      <QuaiTam b={b} loai={cuoi.loai} boss={cuoi.boss && x.quai.length > 1} bong={x.trang_thai === 'chua_do'} co={coBe * 0.7} />
                    </span>
                  )}
                </button>
                {x.trang_thai === 'dat' && <span className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ bottom: coBe * 0.22 }}><Co mau={m.diem} anh={anhVat('co_chinh_phuc')} cao={coBe * 0.6} /></span>}
                {x.trang_thai === 'chua_do' && <Suong mau={b.bot} anh={anhVat('may_suong')} style={{ left: '-15%', top: '10%', width: '130%', height: '70%' }} />}
                {x.quai.length > 1 && x.trang_thai !== 'dat' && <span className="pointer-events-none absolute right-0 top-0 rounded-full px-1.5 text-[11px] font-extrabold" style={{ ...HEAD, background: 'var(--sk-surface)', color: 'var(--sk-ink)', border: 'var(--sk-card-border)' }}>×{x.quai.length}</span>}
                {i === toi && <span className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ bottom: '100%', marginBottom: 2 }}><MuiTen co={Math.max(28, coBe * 0.4)} /></span>}
                <span className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-center"
                  style={{ ...CHU_VIEN, top: '100%', marginTop: 4, width: 'max-content', maxWidth: Math.max(140, bc.gap * 0.84), transform: chon || hov === x.ma ? 'scale(1.06)' : undefined }}>
                  <span className="block max-w-full text-[14px] font-bold leading-[1.15]" style={{ ...HEAD, color: 'var(--sk-ink)' }}><span style={{ color: 'var(--sk-acc)' }}>{i + 1}.</span> {x.ten}</span>
                  <Sao5 ti={x.trang_thai === 'dat' ? 1 : x.mastery ?? 0} co={18} />
                </span>
              </div>
            )
          })}
          {/* CỜ ĐÍCH — cuối chặng (đơn giản theo Thùy): cột cờ trên quảng trường; xong hết thì sáng vàng */}
          {!nenDang && kt.w > 0 && (
            <div className="pointer-events-none absolute flex flex-col items-center" style={{ left: bc.xCo, top: yTai(bc, bc.xCo), transform: 'translate(-50%,-100%)' }}>
              {xong && <span className="ban2d-sang absolute left-1/2 rounded-full" style={{ bottom: -coBe * 0.2, width: coBe * 2, height: coBe * 0.8, transform: 'translateX(-50%)', background: `radial-gradient(closest-side, ${b.vang}cc, transparent)` }} />}
              <span className="relative" style={{ marginBottom: -coBe * 0.04, filter: xong ? undefined : 'saturate(.55) brightness(.85)' }}><Co mau={m.diem} anh={anhVat('co_chinh_phuc')} cao={coBe * 1.25} /></span>
              <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[14px] font-extrabold" style={{ ...CHU_VIEN, ...HEAD, color: xong ? 'var(--sk-acc)' : 'var(--sk-ink)' }}>
                {xong ? 'Đã chinh phục!' : 'Đích'}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* nút trượt 2 bên khi còn trạm ngoài màn */}
      {mep.trai && <NutTruot ben="trai" onClick={() => truot(-1)} />}
      {mep.phai && <NutTruot ben="phai" onClick={() => truot(1)} style={{ right: phai + 12 }} />}
      <div className="pointer-events-none absolute left-0 right-0 top-0 p-3"><div className="pointer-events-auto"><DauTrangHS tieuDe={vung.ten} phu={`${luc.ten} · ${n} dạng`} onBack={onVe} /></div></div>
      <aside className={`absolute flex flex-col gap-2.5 p-4 ${dai ? 'bottom-4 right-4 top-[72px] w-[300px]' : 'bottom-3 left-3 right-3 overflow-y-auto'}`} style={dai ? THE : { ...THE, maxHeight: duoi }}>
        <div className="flex flex-wrap gap-1.5">
          <NhanHS mau={c.trang_thai === 'dat' ? 'var(--sk-acc)' : 'var(--sk-muted)'}>{c.trang_thai === 'dat' ? 'Đã chinh phục' : c.trang_thai === 'yeu' ? 'Quái còn máu' : 'Phủ sương · vào được'}</NhanHS>
          <NhanHS>{c.quai.length} quái</NhanHS>
        </div>
        <h3 className="text-[18px] font-bold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{c.ten}</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[12.5px]">
          <dt style={{ color: 'var(--sk-muted)' }}>Mức độ</dt><dd className="text-right">{sao(c.muc_do)}</dd>
          <dt style={{ color: 'var(--sk-muted)' }}>Độ nắm dạng</dt><dd className="text-right">{c.mastery == null ? 'chưa đo' : `${Math.round(c.mastery * 100)}%`}</dd>
          <dt style={{ color: 'var(--sk-muted)' }}>Một lượt</dt><dd className="text-right">{c.so_cau_luot != null ? `${c.so_cau_luot} câu` : '5–10 câu'}</dd>
        </dl>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <p className="mb-1 text-[11.5px]" style={{ color: 'var(--sk-muted)' }}>Đội hình · đánh lần lượt, hạ hết cả đội</p>
          <div className="flex flex-col gap-1">
            {c.quai.map((q, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-1 text-[12.5px]" style={{ ...THE_TRON, borderRadius: 8, opacity: c.trang_thai === 'chua_do' ? 0.65 : 1 }}>
                <span className="inline-block h-6 w-6 flex-none"><QuaiTam b={b} loai={q.loai} bong={c.trang_thai === 'chua_do'} co={24} /></span>
                <span><b style={{ ...HEAD, color: 'var(--sk-ink)' }}>{tenQuai2D(q.loai)}</b> <span style={{ color: 'var(--sk-muted)' }}>· {q.boss ? 'Boss cuối' : `Elite ${i + 1}`}</span></span>
              </div>
            ))}
          </div>
        </div>
        <NutHS onClick={() => onVao(c)}>{c.trang_thai === 'dat' ? 'Ôn lại chặng' : 'Vào màn đấu'}</NutHS>
      </aside>
    </div>
  )
}

function NutTruot({ ben, onClick, style }: { ben: 'trai' | 'phai'; onClick: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} aria-label={ben === 'trai' ? 'Xem các dạng trước' : 'Xem các dạng sau'}
      className="absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[22px] font-extrabold"
      style={{ ...THE_TRON, [ben === 'trai' ? 'left' : 'right']: 12, color: 'var(--sk-ink)', ...style }}>
      {ben === 'trai' ? '‹' : '›'}
    </button>
  )
}
