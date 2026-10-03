// TẦNG 1 — THẾ GIỚI bản 2D. Cùng props với TheGioiView (3D) để PhieuLuuHS đổi qua lại được. 2 cách vẽ:
// · GHÉP THEO TRANH (mặc định — Thùy 02/10): nền biển V2 + 10 lục địa rời V2 đặt đúng vị trí ảnh toàn cảnh (hinh2d.VI_TRI_LUC_DIA_V2) ⇒ thành đại lục
//   liền như ảnh gốc; khối ít chủ đề chỉ đặt N mảnh đầu. Rê chuột: mảnh nhích lên + viền sáng. Code phủ nhãn, sao, mũi tên, cờ, quái nhỏ.
// · GHÉP MẢNH (khối > 10 chủ đề): nền biển + lục địa rời theo bố cục chung (boCuc.ts).
// Hiệu ứng chung: mây trôi, sao lấp lánh, bấm lục địa ⇒ phóng vào rồi mới chuyển tầng.
import { useMemo, useState, type ReactNode } from 'react'
import { HEAD, useMedia } from '../../skin/KhungHS'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import { thongKe, type BanDoV, type LucDiaV } from '../kieu'
import { boCucTheGioi, heSoCo } from './boCuc'
import { TI_LE_LUC_DIA_V2, VI_TRI_LUC_DIA_V2, anhLucDiaV2, anhNenTheGioi, anhVat } from './hinh2d'
import { CHU_VIEN, Co, CssBan2D, MuiTen, NenBien, Sao5, Suong, useKhung2D, viTri } from './San2D'
import { LucDiaTam, QuaiTam } from './HinhTam'

type Props = { banDo: BanDoV; b: BangMau3D; onChon: (ma: string) => void; hienTai?: string | null; thanh?: ReactNode; gioi?: 'nam' | 'nu' }

export function TheGioi2D(p: Props) {
  // ≤ 10 chủ đề (mọi khối đo 01/10): ghép theo tranh; nhiều hơn ⇒ ghép mảnh theo bố cục chung
  return p.banDo.luc_dia.length <= VI_TRI_LUC_DIA_V2.length ? <GhepTheoTranh {...p} /> : <GhepManh {...p} />
}

// phóng vào lục địa vừa bấm rồi mới chuyển tầng
function usePhong(onChon: (ma: string) => void) {
  const [zoom, setZoom] = useState<{ ma: string; x: number; y: number } | null>(null)
  const chon = (ma: string, x: number, y: number) => { if (zoom) return; setZoom({ ma, x, y }); window.setTimeout(() => onChon(ma), 260) /* gọi màn kế khi cú phóng còn ~40%: màn cũ (PhieuLuuHS giữ lớp) phóng nốt, màn mới hiện dần bên dưới */ }
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

// ── GHÉP THEO TRANH: nền biển + 10 lục địa rời đặt ĐÚNG vị trí ảnh toàn cảnh (thành đại lục liền) ─────────────
function GhepTheoTranh({ banDo, b, onChon, hienTai, thanh }: Props) {
  const { ref, khung } = useKhung2D(false, true)
  const dai = useMedia('(min-width:768px)')
  const { chon, style } = usePhong(onChon)
  const [hov, setHov] = useState<string | null>(null)
  const W = khung.w, H = khung.h
  // chủ đề thứ i ⇒ mảnh i; khối ít chủ đề ⇒ chỉ đặt N mảnh đầu (biển vẫn liền)
  const ds = useMemo(() => banDo.luc_dia.map((l, i) => ({ l, t: thongKe(l), v: VI_TRI_LUC_DIA_V2[i] })), [banDo])
  const veTruoc = [...ds].sort((p, q) => p.v.y - q.v.y) // mảnh xa (y nhỏ) vẽ trước, mảnh gần đè lên

  return (
    <div className="ban2d absolute inset-0 overflow-hidden" data-dong="1" style={{ background: b.troi }}>
      <CssBan2D />
      <img src={anhNenTheGioi()!} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover" style={{ filter: 'blur(18px) brightness(.55)' }} draggable={false} />
      <div ref={ref} className="absolute inset-0 flex items-center justify-center">
        <div className="ban2d-zoom relative overflow-hidden" style={{ width: W, height: H, ...style }}>
          {W > 0 && <img src={anhNenTheGioi()!} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} />}
          {W > 0 && veTruoc.map(({ l, t, v }) => {
            const w = (v.w / 100) * W, h = w / TI_LE_LUC_DIA_V2, len = hov === l.ma
            return (
              <button key={l.ma} onClick={() => chon(l.ma, (v.x / 100) * W, (v.y / 100) * H)} aria-label={`${l.ten}: ${t.dat}/${t.tong} dạng đạt`}
                onPointerEnter={() => setHov(l.ma)} onPointerLeave={() => setHov((x) => (x === l.ma ? null : x))} onFocus={() => setHov(l.ma)} onBlur={() => setHov(null)}
                className="absolute outline-none"
                style={{ left: (v.x / 100) * W - w / 2, top: (v.y / 100) * H - h / 2, width: w, height: h, zIndex: len ? 4 : 1,
                  // chỉ phần đất (ảnh nền trong suốt) bắt chuột — góc trống của hộp không cướp chuột của mảnh bên cạnh
                  WebkitMaskImage: `url(${anhLucDiaV2(v.biome)})`, maskImage: `url(${anhLucDiaV2(v.biome)})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
                  transform: len ? `translateY(${-H * 0.012}px)` : 'none', transition: 'transform .22s ease, filter .22s ease',
                  filter: t.trangThai === 'fog' && !len ? 'saturate(.45) brightness(.74)' : len ? 'brightness(1.1)' : undefined }}>
                <img src={anhLucDiaV2(v.biome)!} alt="" className="h-full w-full select-none" draggable={false} />
              </button>
            )
          })}
          {/* viền sáng của mảnh đang rê chuột (lớp riêng vì mảnh dùng mask — drop-shadow bị mask cắt) */}
          {W > 0 && ds.map(({ l, v }) => hov === l.ma && (
            <img key={`vien${l.ma}`} src={anhLucDiaV2(v.biome)!} alt="" aria-hidden className="pointer-events-none absolute select-none"
              style={{ left: (v.x / 100) * W - (v.w / 100) * W / 2, top: (v.y / 100) * H - (v.w / 100) * W / TI_LE_LUC_DIA_V2 / 2 - H * 0.012, width: (v.w / 100) * W, height: (v.w / 100) * W / TI_LE_LUC_DIA_V2, zIndex: 5,
                filter: `brightness(1.1) drop-shadow(0 0 3px ${b.vang}) drop-shadow(0 0 10px ${b.vang}) drop-shadow(0 ${H * 0.016}px 8px ${b.troi})` }} draggable={false} />
          ))}
          {/* lớp giao diện trên cùng: mũi tên, cờ, quái, nhãn */}
          {W > 0 && ds.map(({ l, t, v }) => {
            const x = (v.x / 100) * W, y = (v.y / 100) * H, w = (v.w / 100) * W, len = hov === l.ma ? -H * 0.012 : 0, dangO = hienTai === l.ma
            return (
              <div key={`ui${l.ma}`} className="pointer-events-none absolute z-[6]" style={{ left: x, top: y + len, transition: 'top .22s ease' }}>
                {dangO && <span className="absolute -translate-x-1/2" style={{ left: 0, top: -w * 0.27 }}><MuiTen co={Math.max(30, w * 0.13)} /></span>}
                {t.trangThai === 'dat' && <span className="absolute" style={{ left: w * 0.14, top: -w * 0.22 }}><Co mau={b.biome[l.biome]?.diem ?? b.vang} anh={anhVat('co_chinh_phuc')} cao={w * 0.14} /></span>}
                {t.trangThai === 'yeu' && t.loai && !dangO && <span className="absolute" style={{ left: w * 0.16, top: -w * 0.18, width: w * 0.1, height: w * 0.1 }}><QuaiTam b={b} loai={t.loai} co={w * 0.1} /></span>}
                <span className="absolute flex -translate-x-1/2 flex-col items-center gap-0.5 text-center"
                  style={{ ...CHU_VIEN, left: 0, top: w * 0.04, maxWidth: dai ? 290 : 160, width: 'max-content', transform: hov === l.ma ? 'scale(1.06)' : undefined, transition: 'transform .22s ease' }}>
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
              const v2 = anhLucDiaV2(l.biome), p = viTri(diem, khung), size = co * canh * (v2 ? 1.18 : 1), anh = v2, dangO = hienTai === l.ma, cao = v2 ? size / TI_LE_LUC_DIA_V2 : size
              return (
                <div key={l.ma} className="absolute" style={{ left: p.x, top: p.y, width: size, height: cao, transform: 'translate(-50%,-50%)' }}>
                  {dangO && <span className="ban2d-sang pointer-events-none absolute left-1/2 top-1/2 rounded-full" style={{ width: size * 1.25, height: size * 1.05, transform: 'translate(-50%,-50%)', background: `radial-gradient(closest-side, ${b.vang}aa, ${b.vang}33 60%, transparent)` }} />}
                  <button onClick={() => chon(l.ma, p.x, p.y)} aria-label={`${l.ten}: ${t.trangThai === 'fog' ? 'chưa đo' : `${t.dat}/${t.tong} chặng đạt`}`}
                    className="ban2d-o ban2d-dao absolute left-1/2 top-1/2 h-full w-full" style={{ transform: 'translate(-50%,-50%)', filter: t.trangThai === 'fog' ? (anh ? 'saturate(.45) brightness(.74)' : 'saturate(.55) brightness(.85)') : undefined, animationDelay: `${-thuTu * 0.9}s` }}>
                    {anh ? <img src={anh} alt="" className="h-full w-full object-contain" draggable={false} /> : <LucDiaTam b={b} biome={l.biome} khoa={l.ma} />}
                  </button>
                  {t.trangThai === 'fog' && <Suong mau={b.bot} anh={anhVat('may_suong')} style={{ left: '8%', top: '12%', width: '84%', height: '70%', opacity: anh ? 0.2 : 1 }} />}
                  {t.trangThai === 'dat' && <span className="pointer-events-none absolute" style={{ right: '14%', top: '4%' }}><Co mau={b.biome[l.biome]?.diem ?? b.vang} anh={anhVat('co_chinh_phuc')} cao={size * 0.26} /></span>}
                  {t.trangThai === 'yeu' && t.loai && !dangO && <span className="pointer-events-none absolute" style={{ right: '10%', top: '10%', width: size * 0.2, height: size * 0.2 }}><QuaiTam b={b} loai={t.loai} co={size * 0.2} /></span>}
                  {dangO && <span className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top: -cao * 0.28 }}><MuiTen co={Math.max(30, size * 0.16)} /></span>}
                  <span className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 px-2 py-1 text-center"
                    style={{ ...CHU_VIEN, top: v2 ? '80%' : '74%', maxWidth: dai ? 290 : 160, width: 'max-content' }}>
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
