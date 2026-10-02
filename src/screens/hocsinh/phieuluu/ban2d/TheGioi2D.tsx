// TẦNG 1 — THẾ GIỚI bản 2D (Thùy 01/10 khuya): 1 nền biển + lục địa rời đặt theo bố cục làm sẵn (boCuc.ts), to nhỏ theo số dạng.
// Hiệu ứng code: mây trôi, sao lấp lánh, ánh nước, sương phủ lục địa chưa đo, cờ ở lục địa đã chinh phục, quầng sáng + nhân vật ở lục địa
// em đang học, bấm lục địa ⇒ phóng vào rồi mới chuyển tầng. Cùng props với TheGioiView (3D) để PhieuLuuHS đổi qua lại được.
import { useMemo, useState, type ReactNode } from 'react'
import { HEAD, NhanHS, THE_TRON, useMedia } from '../../skin/KhungHS'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import { thongKe, type BanDoV } from '../kieu'
import { boCucTheGioi, heSoCo } from './boCuc'
import { anhLucDia, anhNenTheGioi, anhVat } from './hinh2d'
import { Co, CssBan2D, Hero, NenBien, Suong, useKhung2D, viTri } from './San2D'
import { LucDiaTam, QuaiTam } from './HinhTam'

export function TheGioi2D({ banDo, b, onChon, hienTai, thanh, gioi = 'nam' }: {
  banDo: BanDoV; b: BangMau3D; onChon: (ma: string) => void; hienTai?: string | null; thanh?: ReactNode; gioi?: 'nam' | 'nu'
}) {
  const { ref, khung } = useKhung2D()
  const dai = useMedia('(min-width:768px)')
  const [zoom, setZoom] = useState<{ ma: string; x: number; y: number } | null>(null)
  const ds = useMemo(() => {
    const tk = banDo.luc_dia.map((l) => thongKe(l))
    const bc = boCucTheGioi(banDo.luc_dia.map((l) => l.ma)), tongDs = tk.map((t) => t.tong)
    return banDo.luc_dia.map((l, i) => ({ l, t: tk[i], diem: bc[i].diem, co: bc[i].coToiDa * heSoCo(tk[i].tong, tongDs), thuTu: i }))
  }, [banDo])
  const canh = khung.doc ? khung.h : khung.w

  const chon = (ma: string, x: number, y: number) => {
    if (zoom) return
    setZoom({ ma, x, y })
    window.setTimeout(() => onChon(ma), 430)
  }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: b.troi }}>
      <CssBan2D />
      <NenBien b={b} anh={anhNenTheGioi()}>
        <div ref={ref} className="absolute inset-0 flex items-center justify-center">
          <div className="ban2d-zoom relative" style={{
            width: khung.w, height: khung.h,
            transformOrigin: zoom ? `${zoom.x}px ${zoom.y}px` : undefined, transform: zoom ? 'scale(2.4)' : undefined, opacity: zoom ? 0 : 1,
          }}>
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
                  {dangO && <span className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top: -size * 0.14 }}><Hero gioi={gioi} cao={size * 0.36} mau={b.troi} /></span>}
                  <span className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 px-2 py-1 text-center"
                    style={{ ...THE_TRON, top: '74%', borderRadius: 12, maxWidth: dai ? 170 : 110, width: 'max-content' }}>
                    {dangO && <span className="rounded-full px-2 text-[10.5px] font-bold" style={{ background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)' }}>Em đang ở đây</span>}
                    <span className="line-clamp-2 font-bold leading-tight" style={{ ...HEAD, color: 'var(--sk-ink)', fontSize: dai ? 12 : 10 }}>{l.ten}</span>
                    {dai && (t.trangThai === 'fog'
                      ? <NhanHS mau="var(--sk-muted)">Chưa đo</NhanHS>
                      : <NhanHS mau={t.trangThai === 'dat' ? 'var(--sk-acc)' : 'var(--sk-muted)'}>{t.dat}/{t.tong} chặng đạt</NhanHS>)}
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
