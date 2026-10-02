// TẦNG 1 — THẾ GIỚI bản 2D. Cùng props với TheGioiView (3D) để PhieuLuuHS đổi qua lại được. 2 cách vẽ:
// · TOÀN CẢNH (mặc định khi có tranh — Thùy 02/10): 1 bức tranh liền vẽ sẵn mọi lục địa (hinh2d.TOAN_CANH_THE_GIOI); chủ đề thứ i ⇒ lục địa thứ i
//   trong tranh. Code chỉ phủ lớp giao diện: nhãn tên + tiến độ, cờ, quầng sáng + nhân vật chỗ em đang học, quái nhỏ chỗ đang đánh,
//   tối + nhạt màu chỗ chưa đo, phủ tối hẳn lục địa thừa ("chưa khai phá"). Không xoay khi màn dọc (tranh vẽ ngang).
// · GHÉP MẢNH (khi khối nhiều chủ đề hơn số lục địa trong tranh, hoặc chưa có tranh): nền biển + lục địa rời theo bố cục làm sẵn (boCuc.ts).
// Hiệu ứng chung: mây trôi, sao lấp lánh, bấm lục địa ⇒ phóng vào rồi mới chuyển tầng.
import { useMemo, useState, type ReactNode } from 'react'
import { HEAD, useMedia } from '../../skin/KhungHS'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import { thongKe, type BanDoV, type LucDiaV } from '../kieu'
import { boCucTheGioi, heSoCo } from './boCuc'
import { TOAN_CANH_THE_GIOI, anhLucDia, anhManhVung, anhNenTheGioi, anhVat } from './hinh2d'
import { CHU_VIEN, Co, CssBan2D, MuiTen, NenBien, Sao5, Suong, useKhung2D, viTri } from './San2D'
import { LucDiaTam, QuaiTam } from './HinhTam'

type Props = { banDo: BanDoV; b: BangMau3D; onChon: (ma: string) => void; hienTai?: string | null; thanh?: ReactNode; gioi?: 'nam' | 'nu' }

export function TheGioi2D(p: Props) {
  const tc = TOAN_CANH_THE_GIOI
  return tc && p.banDo.luc_dia.length <= tc.o.length ? <ToanCanh {...p} /> : <GhepManh {...p} />
}

// phóng vào lục địa vừa bấm rồi mới chuyển tầng
function usePhong(onChon: (ma: string) => void) {
  const [zoom, setZoom] = useState<{ ma: string; x: number; y: number } | null>(null)
  const chon = (ma: string, x: number, y: number) => { if (zoom) return; setZoom({ ma, x, y }); window.setTimeout(() => onChon(ma), 430) }
  const style = { transformOrigin: zoom ? `${zoom.x}px ${zoom.y}px` : undefined, transform: zoom ? 'scale(2.4)' : undefined, opacity: zoom ? 0 : 1 }
  return { chon, style }
}

function NhanLuc({ l, t, dai }: { l: LucDiaV; t: ReturnType<typeof thongKe>; dangO: boolean; dai: boolean }) {
  return (
    <>
      <span className="block max-w-full font-bold leading-[1.15]" style={{ ...HEAD, color: 'var(--sk-ink)', fontSize: dai ? 18 : 13 }}>{l.ten}</span>
      <Sao5 ti={t.tong ? t.dat / t.tong : 0} co={dai ? 24 : 16} />
    </>
  )
}

// ── TOÀN CẢNH: 1 bức tranh liền ───────────────────────────────────────────────
function ToanCanh({ banDo, b, onChon, hienTai, thanh }: Props) {
  const tc = TOAN_CANH_THE_GIOI!
  const { ref, khung } = useKhung2D(false, true)
  const dai = useMedia('(min-width:768px)')
  const { chon, style } = usePhong(onChon)
  const ds = useMemo(() => banDo.luc_dia.map((l) => ({ l, t: thongKe(l) })), [banDo])
  const W = khung.w, H = khung.h
  // rê chuột vào vùng ⇒ MẢNH VÙNG (cắt đúng pixel từ lớp đất) nhích lên + sáng viền (Thùy 02/10 "bản trước có làm rồi").
  // Mảnh chỉ nạp khi chuột vào bản đồ lần đầu — iPad cảm ứng không có rê chuột, không phải tải thêm.
  const [hov, setHov] = useState<number | null>(null)
  const [napManh, setNapManh] = useState(false)

  return (
    <div className="ban2d absolute inset-0 overflow-hidden" data-dong="1" style={{ background: b.troi }}>
      <CssBan2D />
      {/* phần thừa ngoài khung 16:9: chính bức tranh phóng to + mờ + tối ⇒ không có viền đen */}
      <img src={tc.nen} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover" style={{ filter: 'blur(18px) brightness(.55)' }} draggable={false} />
      <div ref={ref} className="absolute inset-0 flex items-center justify-center">
        <div className="ban2d-zoom relative overflow-hidden" style={{ width: W, height: H, ...style }} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setNapManh(true) }}>
          {W > 0 && <><img src={tc.nen} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} /><img src={tc.dat} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} /></>}
          {W > 0 && napManh && tc.o.map((o, i) => o.hop && ds[i] && (
            <img key={`manh${i}`} src={anhManhVung(o.biome)} alt="" aria-hidden draggable={false} className="pointer-events-none absolute z-[5] select-none"
              style={{ left: `${o.hop.x}%`, top: `${o.hop.y}%`, width: `${o.hop.w}%`, height: `${o.hop.h}%`, opacity: hov === i ? 1 : 0,
                transform: hov === i ? `translateY(${-H * 0.014}px)` : 'none', transition: 'opacity .18s ease, transform .22s ease',
                filter: `drop-shadow(0 0 3px ${b.vang}) drop-shadow(0 0 10px ${b.vang}) drop-shadow(0 ${H * 0.018}px 8px ${b.troi}) brightness(1.08)` }} />
          ))}
          {W > 0 && tc.o.map((o, i) => {
            const x = (o.x / 100) * W, y = (o.y / 100) * H, d = (o.r / 100) * W * 2
            const vong = { left: x, top: y, width: d, height: d * 0.82, transform: 'translate(-50%,-50%)' } as const
            const m = ds[i]
            // lục địa thừa (khối ít chủ đề): tối hẳn + mây, không bấm được
            if (!m) return (
              <span key={`thua${i}`} aria-hidden className="pointer-events-none absolute rounded-[50%]" style={{ ...vong, background: `radial-gradient(closest-side, ${b.troi}9e, ${b.troi}66 70%, transparent)`, backdropFilter: 'saturate(.2)', WebkitBackdropFilter: 'saturate(.2)' }}>
                <Suong mau={b.bot} anh={anhVat('may_suong')} style={{ left: '0%', top: '10%', width: '100%', height: '80%', opacity: 0.85 }} />
              </span>
            )
            const { l, t } = m, dangO = hienTai === l.ma
            return (
              <div key={l.ma} className="absolute z-[6]" style={vong}>
                {t.trangThai === 'fog' && <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[50%] transition-opacity" style={{ opacity: hov === i ? 0 : 1, background: `radial-gradient(closest-side, ${b.troi}73, ${b.troi}40 70%, transparent)`, backdropFilter: 'saturate(.35)', WebkitBackdropFilter: 'saturate(.35)' }} />}
                {dangO && <span className="ban2d-sang pointer-events-none absolute left-1/2 top-1/2 rounded-[50%]" style={{ width: '110%', height: '110%', transform: 'translate(-50%,-50%)', background: `radial-gradient(closest-side, transparent 55%, ${b.vang}66 80%, transparent)` }} />}
                <button onClick={() => chon(l.ma, x, y)} aria-label={`${l.ten}: ${t.trangThai === 'fog' ? 'chưa đo' : `${t.dat}/${t.tong} chặng đạt`}`}
                  onPointerEnter={() => setHov(i)} onPointerLeave={() => setHov((h) => (h === i ? null : h))} onFocus={() => setHov(i)} onBlur={() => setHov(null)}
                  className="absolute inset-0 rounded-[50%] outline-none focus-visible:shadow-[0_0_0_3px_var(--sk-acc)]" />
                {t.trangThai === 'dat' && <span className="pointer-events-none absolute" style={{ left: '58%', top: '8%' }}><Co mau={b.biome[l.biome]?.diem ?? b.vang} anh={anhVat('co_chinh_phuc')} cao={d * 0.22} /></span>}
                {t.trangThai === 'yeu' && t.loai && !dangO && <span className="pointer-events-none absolute" style={{ left: '62%', top: '12%', width: d * 0.16, height: d * 0.16 }}><QuaiTam b={b} loai={t.loai} co={d * 0.16} /></span>}
                {dangO && <span className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top: '4%' }}><MuiTen co={Math.max(30, d * 0.16)} /></span>}
                <span className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 px-2 py-1 text-center"
                  style={{ ...CHU_VIEN, top: '62%', maxWidth: dai ? 290 : 160, width: 'max-content', transform: hov === i ? `translateY(${-H * 0.014}px) scale(1.06)` : undefined, transition: 'transform .22s ease' }}>
                  <NhanLuc l={l} t={t} dangO={dangO} dai={dai} />
                </span>
              </div>
            )
          })}
        </div>
      </div>
      {thanh && <div className="absolute bottom-3 left-20 right-20 z-10 flex flex-wrap justify-center gap-2">{thanh}</div>}
    </div>
  )
}

// ── GHÉP MẢNH: nền biển + lục địa rời ─────────────────────────────────────────
function GhepManh({ banDo, b, onChon, hienTai, thanh }: Props) {
  const { ref, khung } = useKhung2D()
  const dai = useMedia('(min-width:768px)')
  const { chon, style } = usePhong(onChon)
  const ds = useMemo(() => {
    const tk = banDo.luc_dia.map((l) => thongKe(l))
    const bc = boCucTheGioi(banDo.luc_dia.map((l) => l.ma)), tongDs = tk.map((t) => t.tong)
    return banDo.luc_dia.map((l, i) => ({ l, t: tk[i], diem: bc[i].diem, co: bc[i].coToiDa * heSoCo(tk[i].tong, tongDs), thuTu: i }))
  }, [banDo])
  const canh = khung.doc ? khung.h : khung.w

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: b.troi }}>
      <CssBan2D />
      <NenBien b={b} anh={anhNenTheGioi()}>
        <div ref={ref} className="absolute inset-0 flex items-center justify-center">
          <div className="ban2d-zoom relative" style={{ width: khung.w, height: khung.h, ...style }}>
            {khung.w > 0 && ds.map(({ l, t, diem, co, thuTu }) => {
              const p = viTri(diem, khung), size = co * canh, anh = anhLucDia(l.biome, thuTu), dangO = hienTai === l.ma
              return (
                <div key={l.ma} className="absolute" style={{ left: p.x, top: p.y, width: size, height: size, transform: 'translate(-50%,-50%)' }}>
                  {dangO && <span className="ban2d-sang pointer-events-none absolute left-1/2 top-1/2 rounded-full" style={{ width: size * 1.25, height: size * 1.05, transform: 'translate(-50%,-50%)', background: `radial-gradient(closest-side, ${b.vang}aa, ${b.vang}33 60%, transparent)` }} />}
                  <button onClick={() => chon(l.ma, p.x, p.y)} aria-label={`${l.ten}: ${t.trangThai === 'fog' ? 'chưa đo' : `${t.dat}/${t.tong} chặng đạt`}`}
                    className="ban2d-o ban2d-dao absolute left-1/2 top-1/2 h-full w-full" style={{ transform: 'translate(-50%,-50%)', filter: t.trangThai === 'fog' ? (anh ? 'saturate(.3) brightness(.6)' : 'saturate(.55) brightness(.85)') : undefined, animationDelay: `${-thuTu * 0.9}s` }}>
                    {anh ? <img src={anh} alt="" className="h-full w-full object-contain" draggable={false} /> : <LucDiaTam b={b} biome={l.biome} khoa={l.ma} />}
                  </button>
                  {t.trangThai === 'fog' && <Suong mau={b.bot} anh={anhVat('may_suong')} style={{ left: '8%', top: '12%', width: '84%', height: '70%', opacity: anh ? 0.32 : 1 }} />}
                  {t.trangThai === 'dat' && <span className="pointer-events-none absolute" style={{ right: '14%', top: '4%' }}><Co mau={b.biome[l.biome]?.diem ?? b.vang} anh={anhVat('co_chinh_phuc')} cao={size * 0.26} /></span>}
                  {t.trangThai === 'yeu' && t.loai && !dangO && <span className="pointer-events-none absolute" style={{ right: '10%', top: '10%', width: size * 0.2, height: size * 0.2 }}><QuaiTam b={b} loai={t.loai} co={size * 0.2} /></span>}
                  {dangO && <span className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top: -size * 0.1 }}><MuiTen co={Math.max(30, size * 0.2)} /></span>}
                  <span className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 px-2 py-1 text-center"
                    style={{ ...CHU_VIEN, top: '74%', maxWidth: dai ? 290 : 160, width: 'max-content' }}>
                    <NhanLuc l={l} t={t} dangO={dangO} dai={dai} />
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-3 select-none" aria-hidden style={{ width: 56, height: 56 }}>
          {anhVat('la_ban') ? <img src={anhVat('la_ban')!} alt="" className="h-full w-full object-contain" /> : <span className="text-[40px] leading-none opacity-80">🧭</span>}
        </span>
      </NenBien>
      {thanh && <div className="absolute bottom-3 left-20 right-20 z-10 flex flex-wrap justify-center gap-2">{thanh}</div>}
    </div>
  )
}
