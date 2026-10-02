// TẦNG 2 — LỤC ĐỊA bản KIT (Đơn 12): nền vẽ sẵn đường + 8 công trình rời (mỗi công trình = 1 chuyên đề) + chibi chạy theo đường tới công trình em bấm.
// Dữ liệu kit: kitLucDia.ts / kitLucDia.anh.ts. Cờ · sương · mũi tên · quái dùng bộ có sẵn của app (San2D / HinhTam). Chuyên đề < 8: công trình thừa vẫn đứng đó, không bấm được, không nhãn.
// >8 chuyên đề hoặc biome chưa có kit ⇒ LucDia2D dùng bản vẽ chung cũ. Chỉ HÌNH HỌC + hiển thị: số sao/trạng thái lấy từ thongKeVung (DB tính).
import { useEffect, useMemo, useRef, useState } from 'react'
import { DauTrangHS, HEAD } from '../../skin/KhungHS'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import { thongKeVung, type LucDiaV } from '../kieu'
import { KIT_LUC_DIA } from './kitLucDia'
import { ANH_KIT } from './kitLucDia.anh'
import { HERO_CHAY, anhChay, hopVe, khungTheoMs } from '../../skin/heroChay'
import { anhVat } from './hinh2d'
import { Co, CssBan2D, MuiTen, Sao5, Suong, useKhung2D } from './San2D'
import { QuaiTam } from './HinhTam'

const G = '/bk-ui/hs/skin/rpg/lucdia'
const TL = 941 / 1672 // cao / rộng của khung
const HE_SO_NV = 2.2 // kit ghi cỡ chibi 4,5–9% chiều cao khung (chỉ ~35px trên iPad, khó thấy) ⇒ phóng 2,2 lần cho dễ thấy; đổi 1 chỗ này
const DUNG_CACH = 0.014 // đứng cách cửa công trình một đoạn đường (đơn vị = chiều rộng khung) để không đè lên nhãn
/** HẠ DỊU nền (Thùy 02/10: "quá chói và nhiều chi tiết, khó nhìn"): giảm bão hoà + sáng + tương phản, làm mờ nhẹ chi tiết cây/đá, phủ thêm màu nền style — CHỈ nền; công trình, chữ, nhân vật giữ nguyên rực để nổi lên. Chỉnh 1 chỗ này. */
const NEN_DIU = { loc: 'saturate(.66) brightness(.88) contrast(.9) blur(1.2px)', phu: 0.2 }
const NHO_VI_TRI: Record<string, number> = {} // "rời màn rồi quay lại = đúng chỗ cũ" — sống tới F5

const HERO_AX = HERO_CHAY.nam.ax
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
  const raf = useRef(0)
  const sRef = useRef(s)
  sRef.current = s
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  useEffect(() => { for (const i of [0, 1, 2, 3, 4, 5, 'dung'] as const) new Image().src = anhChay(gioi, i) }, [gioi]) // nạp sẵn đủ khung chạy ⇒ không nháy lúc đổi khung
  useEffect(() => { NHO_VI_TRI[luc.ma] = s }, [s, luc.ma])

  /** Chạy theo đường tới cửa công trình i rồi mở màn chặng. Tốc độ co theo quãng, tối đa ~2,4 giây. */
  const dien = (i: number, ma: string) => {
    if (chay) return
    const dich = sCua[i], s0 = sRef.current, qd = Math.abs(dich - s0)
    if (qd < 0.004) { onChon(ma); return }
    const ms = Math.min(2400, Math.max(500, qd * 2600)), t0 = performance.now()
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
  // Bộ CHẠY 2D nhân vật chính (6 khung × 100ms theo thời gian, không đếm rAF) + khung đứng yên — skin/heroChay.ts, dùng chung MỌI kit
  const hv = hopVe(gioi, chay ? khungChay : 'dung', cao, nvPx.x, nvPx.y)
  const huongPhai = chay ? chay.huongPhai : true
  const sapXep = [...kit.moc.map((m, i) => ({ k: `m${i}`, y: m.y })), { k: 'nv', y: yPhanTram + 3.5 }].sort((a, c) => a.y - c.y)
  const z = (k: string) => (sapXep.findIndex((x) => x.k === k) + 1) * 10 // ×10: chừa số lẻ cho sương (ngay trên công trình của nó, dưới nhân vật cùng/ngoài hàng)
  const pts = (ds: [number, number][]) => ds.map(([x, y]) => `${(x / 100 * W).toFixed(1)},${(y / 100 * H).toFixed(1)}`).join(' ')
  const daDi = pts(kit.duong.slice(0, (toanDat ? kit.duong.length - 1 : kit.diemMoc[Math.min(toi, kit.diemMoc.length - 1)]) + 1))
  const hStr = Math.max(11, H * 0.03)
  const veDuong = import.meta.env.DEV && new URLSearchParams(location.search).has('duong')

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'var(--sk-bg)' }}>
      <CssBan2D />
      <div className="px-4 pt-3"><DauTrangHS tieuDe={luc.ten} phu={`${luc.vung.length} chuyên đề · bấm một công trình để vào`} onBack={onVe} /></div>
      <div className="min-h-0 flex-1 p-3 pt-2">
        <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl" style={{ border: 'var(--sk-card-border)', background: 'var(--sk-bg)' }}>
          <img src={`${G}/${luc.biome}/nen.jpg`} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover" style={{ filter: 'blur(14px) brightness(.55)' }} draggable={false} />
          <div ref={ref} className="absolute inset-0 flex items-center justify-center">
            <div className="relative select-none" style={{ width: W, height: H }}>
              <img src={`${G}/${luc.biome}/nen.jpg`} alt="" className="absolute inset-0 h-full w-full" draggable={false} style={{ filter: NEN_DIU.loc }} />
              <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(120% 100% at 50% 45%, transparent 35%, color-mix(in srgb, var(--sk-bg) ${Math.round(NEN_DIU.phu * 160)}%, transparent) 100%), color-mix(in srgb, var(--sk-bg) ${Math.round(NEN_DIU.phu * 100)}%, transparent)` }} />
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
                        <button type="button" disabled={!co || !!chay} onClick={() => co && dien(i, co.v.ma)} aria-label={co ? `${co.v.ten}: ${co.t.dat}/${co.t.tong} chặng đạt` : `Công trình ${i + 1}`}
                          className="absolute block active:scale-[0.98]" style={{ left: px - a.ax * w, top: dinh, width: w, height: h, zIndex: z(`m${i}`), cursor: co ? 'pointer' : 'default', transition: 'transform .12s' }}>
                          <img src={`${G}/${luc.biome}/moc_${i + 1}.webp`} alt="" className="h-full w-full" draggable={false} style={{ filter: !co ? 'saturate(.85) brightness(.92)' : tt === 'fog' ? 'saturate(.55) brightness(.85)' : undefined }} />
                        </button>
                        {co && tt === 'fog' && <span className="pointer-events-none absolute" style={{ left: px - w * 0.6, top: dinh + h * 0.05, width: w * 1.2, height: h * 0.9, zIndex: z(`m${i}`) + 1 }}><Suong mau={b.bot} anh={anhVat('may_suong')} style={{ left: 0, top: 0, width: '100%', height: '100%' }} /></span>}
                        {co && tt === 'dat' && <span className="pointer-events-none absolute" style={{ left: px + w * 0.12, top: dinh - H * 0.02, zIndex: 210 }}><Co mau={b.vang} anh={anhVat('co_chinh_phuc')} cao={H * 0.05} /></span>}
                        {co && i === toi && tt !== 'dat' && <span className="pointer-events-none absolute flex justify-center" style={{ left: px - w / 2, width: w, top: dinh - H * 0.05, zIndex: 210 }}><MuiTen co={Math.max(26, H * 0.045)} /></span>}
                        {co && i === toi && tt === 'yeu' && co.t.loai && <span className="pointer-events-none absolute" style={{ left: px + w * 0.35, top: py - H * 0.06, width: H * 0.06, height: H * 0.06, zIndex: 160 }}><QuaiTam b={b} loai={co.t.loai} co={H * 0.06} /></span>}
                        {co && (
                          <span className="pointer-events-none absolute flex flex-col items-center text-center" style={{ left: px - W * 0.085, top: py + H * 0.008, width: W * 0.17, zIndex: 220 }}>
                            <span className="inline-flex items-start gap-1">
                              <span className="flex shrink-0 items-center justify-center rounded-full font-extrabold" style={{ ...HEAD, width: hStr * 0.95, height: hStr * 0.95, fontSize: hStr * 0.62, background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)', border: `1.5px solid ${kit.chu.vien}` }}>{i + 1}</span>
                              <span className="font-bold leading-[1.1]" style={{ fontFamily: "'Baloo 2', 'Be Vietnam Pro', sans-serif", fontSize: hStr, color: kit.chu.mau, WebkitTextStroke: `${Math.max(2.5, hStr * 0.22)}px ${kit.chu.vien}`, paintOrder: 'stroke fill', textShadow: `0 1px 4px ${kit.chu.vien}` }}>{co.v.ten}</span>
                            </span>
                            <Sao5 ti={co.t.tong ? co.t.dat / co.t.tong : 0} co={Math.max(12, H * 0.027)} />
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
