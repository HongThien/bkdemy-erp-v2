// TẦNG 2 — LỤC ĐỊA bản KIT (Đơn 12): nền vẽ sẵn đường + 8 công trình rời (mỗi công trình = 1 chuyên đề) + chibi chạy theo đường tới công trình em bấm.
// Dữ liệu kit: kitLucDia.ts / kitLucDia.anh.ts. Cờ · sương · mũi tên · quái dùng bộ có sẵn của app (San2D / HinhTam). Chuyên đề < 8: công trình thừa vẫn đứng đó, không bấm được, không nhãn.
// >8 chuyên đề hoặc biome chưa có kit ⇒ LucDia2D dùng bản vẽ chung cũ. Chỉ HÌNH HỌC + hiển thị: số sao/trạng thái lấy từ thongKeVung (DB tính).
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { DauTrangHS, HEAD } from '../../skin/KhungHS'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import { thongKeVung, type LucDiaV } from '../kieu'
import { KIT_LUC_DIA, SAO_KIT } from './kitLucDia'
import { ANH_KIT } from './kitLucDia.anh'
import { HERO_CHAY, anhChay, hopVe, khungTheoMs } from '../../skin/heroChay'
import { anhVat } from './hinh2d'
import { Co, CssBan2D, MuiTen, Sao5, Suong, useChuyenDong, useKhung2D } from './San2D'
import { QuaiTam } from './HinhTam'

const G = '/bk-ui/hs/skin/rpg/lucdia'
const TL = 941 / 1672 // cao / rộng của khung
const HE_SO_NV = 2.2 // kit ghi cỡ chibi 4,5–9% chiều cao khung (chỉ ~35px trên iPad, khó thấy) ⇒ phóng 2,2 lần cho dễ thấy; đổi 1 chỗ này
const DUNG_CACH = 0.014 // đứng cách cửa công trình một đoạn đường (đơn vị = chiều rộng khung) để không đè lên nhãn
// Nền giữ NGUYÊN BẢN, không lọc màu/làm mờ (đã thử hạ dịu 2 lần — nhà trông giả; Thùy 02/10 chọn để y như ảnh gốc, chỉ thêm ánh sáng cạnh công trình).
const CSS_SANG = `
@keyframes kit-tho{0%,100%{opacity:.28;transform:scale(.96)}50%{opacity:.62;transform:scale(1.04)}}
@keyframes kit-bay{0%{opacity:0;transform:translate(0,6px) scale(.5)}25%{opacity:1}100%{opacity:0;transform:translate(var(--kx,0px),-26px) scale(1)}}
.kit-quang{animation:kit-tho 3.6s ease-in-out infinite}.kit-dom{animation:kit-bay 3.2s ease-out infinite}
@media (prefers-reduced-motion:reduce){.kit-quang,.kit-dom{animation:none!important}.kit-dom{display:none}}`
const RIA_SANG = 'drop-shadow(0 0 3px color-mix(in srgb, var(--sk-acc) 60%, transparent)) drop-shadow(0 0 9px color-mix(in srgb, var(--sk-acc) 28%, transparent))' // viền sáng mảnh ôm theo hình công trình
const TOC_DO_NV = 2.2 // chiều cao người / giây
const NHO_VI_TRI: Record<string, number> = {} // "rời màn rồi quay lại = đúng chỗ cũ" — sống tới F5

const HERO_AX = HERO_CHAY.nam.ax
type Hop = { x: number; y: number; w: number; h: number }
const chong = (a: Hop, b: Hop, le = 0) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) - le) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) - le)
/** LUẬT HIỂN THỊ (Thùy 02/10): các thứ hiển thị KHÔNG ĐƯỢC ĐÈ LÊN NHAU — nhãn (tên + 5 sao) không đè công trình nào (kể cả công trình khác), không đè nhãn khác, không ra khỏi khung / vùng thanh trên.
 *  Quét lưới quanh chân, chọn chỗ đè ít nhất + gần chỗ lý tưởng nhất. `nhan[i]` = kích thước thật đã đo. */
function xepNhan(moc: Hop[], chan: { x: number; y: number }[], nhan: ({ w: number; h: number } | null)[], W: number, H: number): ({ x: number; y: number } | null)[] {
  const dat: Hop[] = [], kq: ({ x: number; y: number } | null)[] = []
  const nha = moc.map((m) => ({ x: m.x + m.w * 0.04, y: m.y + m.h * 0.04, w: m.w * 0.92, h: m.h * 0.94 })) // hộp công trình co nhẹ (bỏ lề alpha)
  // nhãn đặt trước = công trình ở GẦN (y lớn) vì nhãn của chúng dễ bị kẹt hơn; kết quả vẫn theo chỉ số
  const thuTu = nhan.map((_, i) => i).sort((a, b) => chan[b].y - chan[a].y)
  for (const i of thuTu) {
    const n = nhan[i]; if (!n) { kq[i] = null; continue }
    const m = moc[i], c = chan[i]
    // Quét lưới vị trí quanh chân công trình; chi phí = diện tích đè (rất nặng) + khoảng cách tới chỗ lý tưởng (ngay dưới chân) ⇒ nhãn ở sát công trình của nó nhất có thể mà không đè gì.
    const mx = c.x - n.w / 2, my = c.y + H * 0.004
    let tot: { x: number; y: number } | null = null, ittNhat = Infinity
    for (let dy = -H * 0.3; dy <= H * 0.24; dy += H * 0.015) for (let dx = -n.w * 1.8; dx <= n.w * 1.8; dx += n.w * 0.12) {
      const r: Hop = { x: Math.max(2, Math.min(W - n.w - 2, mx + dx)), y: my + dy, w: n.w, h: n.h }
      let phat = Math.hypot(r.x - mx, r.y - my) * 0.5
      if (r.y < H * 0.1 || r.y + r.h > H * 0.95) phat += 1e7 // ra khỏi vùng an toàn (thanh trên / đáy)
      if (chong(r, { x: m.x + m.w * 0.04, y: m.y + m.h * 0.04, w: m.w * 0.92, h: m.h * 0.94 }) > 0) phat += 4000 // đè chính công trình của nó
      moc.forEach((_, j) => { if (j !== i) phat += chong(r, nha[j]) * 20 })
      dat.forEach((d) => { phat += chong(r, d, 2) * 40 })
      if (phat < ittNhat) { ittNhat = phat; tot = { x: r.x, y: r.y } }
    }
    kq[i] = tot; if (tot) dat.push({ x: tot.x, y: tot.y, w: n.w, h: n.h })
  }
  return kq
}

export const coKit = (biome: string, soVung: number) => !!KIT_LUC_DIA[biome] && soVung > 0 && soVung <= KIT_LUC_DIA[biome].moc.length

/** Đường tâm → dãy điểm dày (Catmull-Rom) + độ dài tích luỹ. Toạ độ chuẩn hoá theo CHIỀU RỘNG (x∈0–1, y∈0–0,563) để cự ly đúng. */
function dungDuong(duong: [number, number][]) {
  const P = duong.map(([x, y]) => ({ x: x / 100, y: (y / 100) * TL }))
  const pts: { x: number; y: number }[] = [], idx: number[] = [] // idx[i] = chỉ số điểm dày ứng với điểm gốc i
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[i - 1] ?? P[i], b = P[i], c = P[i + 1], d = P[i + 2] ?? c
    idx.push(pts.length)
    for (let k = 0; k < 8; k++) {
      const t = k / 8, t2 = t * t, t3 = t2 * t
      const f = (p0: number, p1: number, p2: number, p3: number) => 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
      pts.push({ x: f(a.x, b.x, c.x, d.x), y: f(a.y, b.y, c.y, d.y) })
    }
  }
  idx.push(pts.length); pts.push({ ...P[P.length - 1] })
  const len: number[] = [0]
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
  return { pts, idx, len, tong: len[len.length - 1] }
}
type Duong = ReturnType<typeof dungDuong>
function diemTai(d: Duong, s: number) {
  const t = Math.max(0, Math.min(d.tong, s))
  let i = 1; while (i < d.len.length - 1 && d.len[i] < t) i++
  const k = (t - d.len[i - 1]) / Math.max(1e-9, d.len[i] - d.len[i - 1]), a = d.pts[i - 1], b = d.pts[i]
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }
}

export function LucDiaKit({ luc, b, gioi = 'nam', onChon, onVe }: { luc: LucDiaV; b: BangMau3D; gioi?: 'nam' | 'nu'; onChon: (ma: string) => void; onVe: () => void }) {
  const kit = KIT_LUC_DIA[luc.biome], anh = ANH_KIT[luc.biome]
  const { ref, khung } = useKhung2D(false, true)
  const vungs = useMemo(() => luc.vung.map((v) => ({ v, t: thongKeVung(v) })), [luc])
  const duong = useMemo(() => dungDuong(kit.duong), [kit])
  const toi = Math.max(0, vungs.findIndex((x) => x.t.trangThai !== 'dat'))
  const toanDat = vungs.length > 0 && vungs.every((x) => x.t.trangThai === 'dat')
  // vị trí (đơn vị dài trên đường) cửa từng công trình = mốc − đoạn đứng cách
  const sCua = useMemo(() => kit.diemMoc.map((m) => Math.max(0, duong.len[duong.idx[m]] - DUNG_CACH)), [kit, duong])
  const [s, setS] = useState(() => NHO_VI_TRI[luc.ma] ?? sCua[Math.min(toi, sCua.length - 1)])
  const [chay, setChay] = useState<{ huongPhai: boolean } | null>(null)
  const [khungChay, setKhungChay] = useState(0)
  const dong = useChuyenDong() // mức đồ hoạ Thấp ⇒ tắt đốm sáng bay
  const [hov, setHov] = useState<number | null>(null) // công trình đang trỏ vào ⇒ nổi lên
  const nhanRef = useRef<(HTMLSpanElement | null)[]>([])
  const [vtNhan, setVtNhan] = useState<({ x: number; y: number; pad: number } | null)[]>([]) // x,y = góc trái-trên của phần NHÌN THẤY (chữ + sao); pad = lề trống giữa hộp nhãn và phần nhìn thấy
  const raf = useRef(0)
  const sRef = useRef(s)
  const caoRef = useRef(0) // cao thân nhân vật hiện tại (px) — tốc độ chạy tính theo cỡ người, không theo bề ngang màn
  sRef.current = s
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  useEffect(() => { for (const i of [0, 1, 2, 3, 4, 5, 'dung'] as const) new Image().src = anhChay(gioi, i) }, [gioi]) // nạp sẵn đủ khung chạy ⇒ không nháy lúc đổi khung
  useEffect(() => { NHO_VI_TRI[luc.ma] = s }, [s, luc.ma])

  /** Chạy theo đường tới cửa công trình i rồi mở màn chặng. Tốc độ co theo quãng, tối đa ~2,4 giây. */
  const dien = (i: number, ma: string) => {
    if (chay) return
    const dich = sCua[i], s0 = sRef.current, qd = Math.abs(dich - s0)
    if (qd < 0.004) { onChon(ma); return }
    // TỐC ĐỘ theo cỡ người (Thùy 02/10: "chạy quá nhanh như gió"): ≈ TOC_DO_NV chiều-cao-người mỗi giây (trước đó ~490px/s ≈ 6 người/s); đường dài thì tối đa 4,5 giây
    const ms = Math.min(4500, Math.max(600, (qd * khung.w) / (TOC_DO_NV * (caoRef.current || 80)) * 1000)), t0 = performance.now()
    const f = (now: number) => {
      const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      setS(s0 + (dich - s0) * e); setChay({ huongPhai: dich >= s0 }); setKhungChay(khungTheoMs(now - t0))
      if (k < 1) raf.current = requestAnimationFrame(f)
      else { setChay(null); setKhungChay(0); onChon(ma) }
    }
    raf.current = requestAnimationFrame(f)
  }

  const W = khung.w, H = khung.h
  const nvP = diemTai(duong, s)
  const nvPx = { x: nvP.x * W, y: (nvP.y / TL) * H }
  const yPhanTram = (nvP.y / TL) * 100
  const cao = (() => { const [a, c, d] = kit.nv; const t = yPhanTram; const v = t <= 55 ? a + (c - a) * ((t - 30) / 25) : c + (d - c) * ((t - 55) / 25); return Math.max(4, Math.min(10, v)) / 100 * H * HE_SO_NV })()
  caoRef.current = cao
  // Bộ CHẠY 2D nhân vật chính (6 khung × 100ms theo thời gian, không đếm rAF) + khung đứng yên — skin/heroChay.ts, dùng chung MỌI kit
  const hv = hopVe(gioi, chay ? khungChay : 'dung', cao, nvPx.x, nvPx.y)
  const huongPhai = chay ? chay.huongPhai : true
  const sapXep = [...kit.moc.map((m, i) => ({ k: `m${i}`, y: m.y })), { k: 'nv', y: yPhanTram + 3.5 }].sort((a, c) => a.y - c.y)
  const z = (k: string) => (sapXep.findIndex((x) => x.k === k) + 1) * 10 // ×10: chừa số lẻ cho sương (ngay trên công trình của nó, dưới nhân vật cùng/ngoài hàng)
  const pts = (ds: [number, number][]) => ds.map(([x, y]) => `${(x / 100 * W).toFixed(1)},${(y / 100 * H).toFixed(1)}`).join(' ')
  const daDi = pts(kit.duong.slice(0, (toanDat ? kit.duong.length - 1 : kit.diemMoc[Math.min(toi, kit.diemMoc.length - 1)]) + 1))
  const hStr = Math.max(11, H * 0.03)
  // đo nhãn thật rồi xếp lại cho KHÔNG đè (chạy mỗi khi đổi khung / dữ liệu; chỉ set state khi vị trí đổi)
  useLayoutEffect(() => {
    if (!W || !H) return
    const moc: Hop[] = kit.moc.map((m, i) => { const a = anh.moc[i], w = m.w / 100 * W, h = w * a.h / a.w; return { x: m.x / 100 * W - a.ax * w, y: m.y / 100 * H - a.ay * h, w, h } })
    const chan = kit.moc.map((m) => ({ x: m.x / 100 * W, y: m.y / 100 * H }))
    const pads: number[] = []
    const nhan = kit.moc.map((_, i) => {
      const el = nhanRef.current[i]; if (!el) return null
      // hộp nhãn rộng tới maxWidth dù chữ ngắn ⇒ đo phần NHÌN THẤY: dòng chữ dài nhất + huy hiệu số, hay hàng sao nếu rộng hơn
      const ten = el.querySelector('[data-ten]') as HTMLElement | null, so = el.querySelector('[data-so]') as HTMLElement | null
      let w = el.offsetWidth
      if (ten) { const r = document.createRange(); r.selectNodeContents(ten); const lw = Math.max(0, ...[...r.getClientRects()].map((q) => q.width)); w = Math.min(w, Math.max(lw + (so ? so.offsetWidth + 4 : 0), (el.lastElementChild as HTMLElement | null)?.offsetWidth ?? 0)) }
      pads[i] = (el.offsetWidth - w) / 2
      return { w, h: el.offsetHeight }
    })
    const kq = xepNhan(moc, chan, nhan, W, H).map((v, i) => (v ? { ...v, pad: pads[i] ?? 0 } : null))
    setVtNhan((cu) => (cu.length === kq.length && cu.every((v, i) => (!v && !kq[i]) || (v && kq[i] && Math.abs(v.x - kq[i]!.x) < 0.5 && Math.abs(v.y - kq[i]!.y) < 0.5 && Math.abs(v.pad - kq[i]!.pad) < 0.5)) ? cu : kq))
  }, [W, H, kit, anh, vungs, hStr])
  const veDuong = import.meta.env.DEV && new URLSearchParams(location.search).has('duong')

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'var(--sk-bg)' }}>
      <CssBan2D /><style>{CSS_SANG}</style>
      <div className="px-4 pt-3"><DauTrangHS tieuDe={luc.ten} phu={`${luc.vung.length} chuyên đề · bấm một công trình để vào`} onBack={onVe} /></div>
      <div className="min-h-0 flex-1 p-3 pt-2">
        <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl" style={{ border: 'var(--sk-card-border)', background: 'var(--sk-bg)' }}>
          <img src={`${G}/${luc.biome}/nen.jpg`} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover" style={{ filter: 'blur(14px) brightness(.55)' }} draggable={false} />
          <div ref={ref} className="absolute inset-0 flex items-center justify-center">
            <div className="relative select-none" style={{ width: W, height: H }}>
              <img src={`${G}/${luc.biome}/nen.jpg`} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
              {W > 0 && (
                <>
                  {/* ánh sáng đoạn đường đã đi — dưới công trình/nhân vật, không che kiến trúc */}
                  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} aria-hidden>
                    {(toi > 0 || toanDat) && <polyline points={daDi} fill="none" stroke={b.vang} strokeOpacity={0.35} strokeWidth={W * 0.022} strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'blur(3px)' }} />}
                    {veDuong && <polyline points={pts(kit.duong)} fill="none" stroke="magenta" strokeWidth={2} />}
                  </svg>

                  {kit.moc.map((m, i) => {
                    const a = anh.moc[i], co = vungs[i]
                    const w = m.w / 100 * W, h = w * a.h / a.w
                    const tt = co?.t.trangThai
                    const px = m.x / 100 * W, py = m.y / 100 * H, dinh = py - h * a.ay
                    return (
                      <div key={i}>
                        {co && tt !== 'fog' && <span className="kit-quang pointer-events-none absolute rounded-[50%]" style={{ left: px - w * 0.6, top: py - h * 0.62, width: w * 1.2, height: h * 0.75, zIndex: z(`m${i}`) - 1, background: 'radial-gradient(closest-side, color-mix(in srgb, var(--sk-acc) 55%, transparent), transparent)', filter: 'blur(8px)', animationDelay: `${(i % 4) * 0.7}s` }} />}
                        {co && tt !== 'fog' && dong && [0, 1, 2].map((k) => <span key={k} className="kit-dom pointer-events-none absolute rounded-full" style={{ left: px + (k - 1) * w * 0.34 - 2, top: dinh + h * (0.18 + k * 0.1), width: 4, height: 4, zIndex: z(`m${i}`) + 2, background: 'var(--sk-acc)', boxShadow: '0 0 6px 1px var(--sk-acc)', animationDelay: `${k * 1.05 + (i % 3) * 0.4}s`, ['--kx' as string]: `${(k - 1) * 8}px` } as React.CSSProperties} />)}
                        {co && hov === i && !chay && <span className="pointer-events-none absolute rounded-[50%]" style={{ left: px - w * 0.55, top: py - h * 0.12, width: w * 1.1, height: h * 0.24, zIndex: z(`m${i}`), background: 'radial-gradient(closest-side, var(--sk-acc), transparent)', opacity: 0.55, filter: 'blur(6px)' }} />}
                        <button type="button" disabled={!co || !!chay} onClick={() => co && dien(i, co.v.ma)} onPointerEnter={() => co && setHov(i)} onPointerLeave={() => setHov((h0) => (h0 === i ? null : h0))} onFocus={() => co && setHov(i)} onBlur={() => setHov((h0) => (h0 === i ? null : h0))}
                          aria-label={co ? `${co.v.ten}: ${co.t.dat}/${co.t.tong} chặng đạt` : `Công trình ${i + 1}`}
                          className="absolute block" style={{ left: px - a.ax * w, top: dinh, width: w, height: h, zIndex: hov === i ? 300 : z(`m${i}`), cursor: co ? 'pointer' : 'default', transformOrigin: `${a.ax * 100}% ${a.ay * 100}%`, transform: hov === i && !chay ? 'scale(1.08) translateY(-1.5%)' : undefined, transition: 'transform .16s ease-out' }}>
                          <img src={`${G}/${luc.biome}/moc_${i + 1}.webp`} alt="" className="h-full w-full" draggable={false} style={{ transition: 'filter .16s', filter: hov === i && !chay ? 'brightness(1.12) saturate(1.1) drop-shadow(0 0 6px var(--sk-acc)) drop-shadow(0 0 16px var(--sk-acc))' : !co ? 'saturate(.85) brightness(.92)' : tt === 'fog' ? 'saturate(.55) brightness(.85)' : RIA_SANG }} />
                        </button>
                        {co && tt === 'fog' && <span className="pointer-events-none absolute" style={{ left: px - w * 0.6, top: dinh + h * 0.05, width: w * 1.2, height: h * 0.9, zIndex: z(`m${i}`) + 1 }}><Suong mau={b.bot} anh={anhVat('may_suong')} style={{ left: 0, top: 0, width: '100%', height: '100%' }} /></span>}
                        {co && tt === 'dat' && <span className="pointer-events-none absolute" style={{ left: px + w * 0.12, top: dinh - H * 0.02, zIndex: 210 }}><Co mau={b.vang} anh={anhVat('co_chinh_phuc')} cao={H * 0.05} /></span>}
                        {co && i === toi && tt !== 'dat' && <span className="pointer-events-none absolute flex justify-center" style={{ left: px - w / 2, width: w, top: dinh - H * 0.05, zIndex: 210 }}><MuiTen co={Math.max(26, H * 0.045)} /></span>}
                        {co && i === toi && tt === 'yeu' && co.t.loai && <span className="pointer-events-none absolute" style={{ left: px + w * 0.35, top: py - H * 0.06, width: H * 0.06, height: H * 0.06, zIndex: 160 }}><QuaiTam b={b} loai={co.t.loai} co={H * 0.06} /></span>}
                        {co && (
                          <span ref={(el) => { nhanRef.current[i] = el }} className="pointer-events-none absolute flex flex-col items-center text-center" style={{ left: vtNhan[i] ? vtNhan[i]!.x - vtNhan[i]!.pad : px - W * 0.085, top: vtNhan[i]?.y ?? py + H * 0.008, width: 'max-content', maxWidth: W * 0.17, zIndex: 220, visibility: vtNhan[i] ? 'visible' : 'hidden' }}>
                            <span className="inline-flex items-start gap-1">
                              <span data-so className="flex shrink-0 items-center justify-center rounded-full font-extrabold" style={{ ...HEAD, width: hStr * 0.95, height: hStr * 0.95, fontSize: hStr * 0.62, background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)', border: `1.5px solid ${kit.chu.vien}` }}>{i + 1}</span>
                              <span data-ten className="font-bold leading-[1.1]" style={{ fontFamily: "'Baloo 2', 'Be Vietnam Pro', sans-serif", fontSize: hStr, color: kit.chu.mau, WebkitTextStroke: `${Math.max(2.5, hStr * 0.22)}px ${kit.chu.vien}`, paintOrder: 'stroke fill', textShadow: `0 1px 4px ${kit.chu.vien}` }}>{co.v.ten}</span>
                            </span>
                            <Sao5 kieu={SAO_KIT} ti={co.t.tong ? co.t.dat / co.t.tong : 0} co={Math.max(19, H * 0.046)} />
                          </span>
                        )}
                      </div>
                    )
                  })}

                  {/* nhân vật: chibi đứng / chạy 2 khung xen kẽ 120ms, lật ngang khi chạy về trái, đế chân neo vào tâm đường */}
                  <img src={anhChay(gioi, chay ? khungChay : 'dung')} alt="" draggable={false} className="pointer-events-none absolute"
                    style={{ left: hv.left, top: hv.top, width: hv.width, height: hv.height, zIndex: z('nv'), transform: huongPhai ? undefined : 'scaleX(-1)', transformOrigin: `${HERO_AX * 100}% 100%`, filter: 'drop-shadow(0 3px 3px rgba(0,0,0,.35))' }} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
