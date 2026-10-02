// TẦNG 2 — LỤC ĐỊA bản 2D: nền vùng đất cận cảnh (ảnh nen_vung_<biome> hoặc hình tạm), các VÙNG (chuyên đề) là mốc đặt theo bố cục
// đường rắn làm sẵn cho 1–10+ mốc (boCuc.ts), nối bằng đường mòn: đoạn đã đi sáng vàng, đoạn chưa đi đứt nét chạy. Phải: danh sách vùng
// (chạm mốc nhỏ trên màn không dễ). Cùng props với LucDiaView (3D).
import { useMemo, useState } from 'react'
import { DauTrangHS, HEAD, THE, THE_TRON, useMedia } from '../../skin/KhungHS'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import { thongKeVung, type LucDiaV } from '../kieu'
import { boCucDuong, duongCong } from './boCuc'
import { CHO_MOC_VUNG, EMOJI_MOC, anhMoc, anhNenVung, anhVat } from './hinh2d'
import { Co, CssBan2D, Hero, NenBien, Sao5, Suong, useKhung2D, viTri, xoay } from './San2D'
import { QuaiTam, VungDatTam } from './HinhTam'

export function LucDia2D({ luc, b, onChon, onVe, gioi = 'nam' }: { luc: LucDiaV; b: BangMau3D; onChon: (ma: string) => void; onVe: () => void; gioi?: 'nam' | 'nu' }) {
  const anhNen = anhNenVung(luc.biome)
  // có tranh nền ⇒ khung luôn 16:9 đúng tỉ lệ tranh (không xoay) để toạ độ chỗ đặt mốc trùng tranh
  const { ref, khung } = useKhung2D(false, !!anhNen)
  const lon = useMedia('(min-width:1024px)')
  const [hov, setHov] = useState<string | null>(null)
  const vungs = useMemo(() => luc.vung.map((v) => ({ v, t: thongKeVung(v) })), [luc])
  // mốc đặt đúng các khoảng đất trống vẽ trong tranh (CHO_MOC_VUNG); nhiều chuyên đề hơn số chỗ / chưa có tranh ⇒ bố cục chung
  const diem = useMemo(() => {
    const cho = anhNen ? CHO_MOC_VUNG[luc.biome] : undefined
    if (cho && luc.vung.length <= cho.length) return cho.slice(0, luc.vung.length).map((c) => ({ x: c.x / 100, y: c.y / 100 }))
    return boCucDuong(luc.vung.map((v) => v.ma), { x0: 0.13, x1: 0.87, y0: 0.27, y1: 0.76 })
  }, [luc, anhNen])
  const toi = Math.max(0, vungs.findIndex((x) => x.t.trangThai !== 'dat')) // mốc em đang tới (đầu tiên chưa chinh phục hết)
  const canh = khung.doc ? khung.h : khung.w, coMoc = Math.max(52, canh * 0.1)
  const trang = (x: (typeof vungs)[number]) => (x.t.trangThai === 'fog' ? 'Chưa đo' : `${x.t.dat}/${x.t.tong} chặng đạt`)
  const m = b.biome[luc.biome] ?? Object.values(b.biome)[0]
  const dd = xoay(diem, khung)

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'var(--sk-bg)' }}>
      <CssBan2D />
      <div className="px-4 pt-3"><DauTrangHS tieuDe={luc.ten} phu={`${luc.vung.length} vùng · đi theo đường mòn, bấm một vùng để vào`} onBack={onVe} /></div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 pt-2 2xl:grid-cols-[1fr_300px]">
        <div className="relative min-h-[300px] overflow-hidden rounded-xl" style={{ border: 'var(--sk-card-border)' }}>
          <NenBien b={b} sao={false}>
            {anhNen && <img src={anhNen} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover" style={{ filter: 'blur(14px) brightness(.6)' }} draggable={false} />}
            <div ref={ref} className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: khung.w, height: khung.h }}>
                {anhNen ? <img src={anhNen} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} /> : <VungDatTam b={b} biome={luc.biome} khoa={luc.ma} />}
                {khung.w > 0 && (
                  <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${khung.w} ${khung.h}`} aria-hidden>
                    <path d={duongCong(dd, khung.w, khung.h)} fill="none" stroke={b.duongVien} strokeWidth={Math.max(12, khung.w * 0.012)} strokeLinecap="round" opacity={0.85} />
                    <path className="ban2d-duong-toi" d={duongCong(dd, khung.w, khung.h)} fill="none" stroke={b.duong} strokeWidth={Math.max(6, khung.w * 0.006)} strokeLinecap="round" strokeDasharray="12 12" />
                    {toi > 0 && <path d={duongCong(dd.slice(0, toi + 1), khung.w, khung.h)} fill="none" stroke={b.vang} strokeWidth={Math.max(7, khung.w * 0.007)} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${b.vang})` }} />}
                  </svg>
                )}
                {khung.w > 0 && vungs.map(({ v, t }, i) => {
                  const p = viTri(diem[i], khung), anh = anhMoc(i), dangO = i === toi && t.trangThai !== 'dat'
                  return (
                    <div key={v.ma} className="absolute" style={{ left: p.x, top: p.y, width: coMoc, height: coMoc, transform: 'translate(-50%,-62%)' }}>
                      {dangO && <span className="ban2d-sang pointer-events-none absolute left-1/2 top-1/2 rounded-full" style={{ width: coMoc * 1.7, height: coMoc * 1.4, transform: 'translate(-50%,-50%)', background: `radial-gradient(closest-side, ${b.vang}aa, transparent)` }} />}
                      <button onClick={() => onChon(v.ma)} onPointerEnter={() => setHov(v.ma)} onPointerLeave={() => setHov(null)} aria-label={`${v.ten}: ${trang({ v, t })}`}
                        className="ban2d-o absolute left-1/2 top-1/2 flex h-full w-full items-center justify-center rounded-full"
                        style={{ transform: `translate(-50%,-50%)${hov === v.ma ? ' scale(1.05)' : ''}`, filter: t.trangThai === 'fog' ? 'saturate(.5) brightness(.8)' : undefined, background: anh ? undefined : `radial-gradient(circle at 50% 70%, ${m.dat2}, ${b.da} 70%)`, boxShadow: anh ? undefined : `0 4px 0 ${b.duongVien}` }}>
                        {anh ? <img src={anh} alt="" className="h-full w-full object-contain" draggable={false} /> : <span style={{ fontSize: coMoc * 0.52, lineHeight: 1 }}>{EMOJI_MOC[i % EMOJI_MOC.length]}</span>}
                      </button>
                      <span className="pointer-events-none absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-extrabold" style={{ ...HEAD, background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)' }}>{i + 1}</span>
                      {t.trangThai === 'fog' && <Suong mau={b.bot} anh={anhVat('may_suong')} style={{ left: '-10%', top: '5%', width: '120%', height: '80%' }} />}
                      {t.trangThai === 'dat' && <span className="pointer-events-none absolute" style={{ right: -coMoc * 0.12, top: -coMoc * 0.3 }}><Co mau={m.diem} anh={anhVat('co_chinh_phuc')} cao={coMoc * 0.55} /></span>}
                      {t.trangThai === 'yeu' && t.loai && <span className="pointer-events-none absolute" style={{ right: -coMoc * 0.2, bottom: coMoc * 0.05, width: coMoc * 0.42, height: coMoc * 0.42 }}><QuaiTam b={b} loai={t.loai} co={coMoc * 0.42} /></span>}
                      {dangO && <span className="pointer-events-none absolute" style={{ left: -coMoc * 0.55, bottom: 0 }}><Hero gioi={gioi} cao={coMoc * 0.8} mau={b.troi} /></span>}
                      <span className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center px-2 py-0.5 text-center"
                        style={{ ...THE_TRON, top: '100%', marginTop: 4, borderRadius: 10, width: 'max-content', maxWidth: lon ? 220 : 150, borderColor: hov === v.ma ? 'var(--sk-acc)' : undefined }}>
                        <span className="block max-w-full truncate whitespace-nowrap text-[11.5px] font-bold leading-tight" title={v.ten} style={{ ...HEAD, color: 'var(--sk-ink)' }}>{v.ten}</span>
                        <Sao5 ti={t.tong ? t.dat / t.tong : 0} co={lon ? 12 : 10} />
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </NenBien>
        </div>
        <aside className="hidden min-h-0 flex-col gap-2 overflow-y-auto p-3 2xl:flex" style={THE}>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--sk-muted)' }}>Các vùng</p>
          {vungs.map((x, i) => (
            <button key={x.v.ma} onClick={() => onChon(x.v.ma)} onPointerEnter={() => setHov(x.v.ma)} onPointerLeave={() => setHov(null)}
              className="flex items-center justify-between gap-2 px-3 py-2 text-left" style={{ ...THE_TRON, background: hov === x.v.ma ? 'var(--sk-surface2)' : 'var(--sk-surface)' }}>
              <span className="min-w-0 text-[13.5px] font-semibold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)' }}>{i + 1}. {x.v.ten}</span>
              <Sao5 ti={x.t.tong ? x.t.dat / x.t.tong : 0} />
            </button>
          ))}
        </aside>
      </div>
    </div>
  )
}
