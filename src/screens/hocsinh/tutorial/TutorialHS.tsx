// ============================================================================
// TUTORIAL "Hành trình tân thủ" app HS — kiểu hướng dẫn trong game (Thùy 30/09): bản đồ các chặng mở khoá dần →
// mỗi chặng: người dẫn đường (nhân vật của style) nói trong hộp thoại chữ chạy, màn mô phỏng phía trên sáng đúng phần đang nói →
// hết chặng hiện "Mở khoá kỹ năng" → xong hết chặng là "Hoàn thành".
// `chuong` (id chặng) = chế độ MỘT CHẶNG: mở thẳng chặng đó (từ nút "Xem hướng dẫn tương tác" trong Hướng dẫn chơi), xong chặng gọi onXong (về lại Hướng dẫn chơi), không qua bản đồ.
// Nội dung (lời thoại, số liệu) ở noiDungTutorial.ts · màn mô phỏng ở MoPhongTutorial.tsx. Màu/hình CHỈ từ skin (design/STYLE-HS.md).
// BẢN DEMO: tiến độ chỉ giữ trong bộ nhớ, chưa lưu DB; xem ở hs.html?xem=tutorial (&chang=N để vào thẳng chặng N).
// ============================================================================
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { MAU, THE, HEAD, NutHS, useMedia } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { GOC } from '../gami/hinh'
import MoPhongTutorial from './MoPhongTutorial'
import { CHUONG, MO_DAU, KET_THUC, NGUOI_DAN, type ChuongTutorial } from './noiDungTutorial'

type Pha = 'mo_dau' | 'ban_do' | 'chuong' | 'mo_khoa' | 'ket_thuc'

const CSS = `
@keyframes tut-nhip { 0%,100% { transform: scale(1.03) } 50% { transform: scale(1.055) } }
@keyframes tut-nhay { 0%,100% { opacity: 1; transform: translateY(0) } 50% { opacity: .35; transform: translateY(3px) } }
@keyframes tut-noi { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes tut-bung { 0% { opacity: 0; transform: scale(.4) } 60% { opacity: 1; transform: scale(1.12) } 100% { transform: scale(1) } }
@keyframes tut-xoay { to { transform: rotate(360deg) } }
@media (prefers-reduced-motion: reduce) { [data-tut] * { animation: none !important; transition: none !important } }
`

function anhChuong(c: ChuongTutorial): string | undefined {
  if (c.icon.gami) return `${GOC}/${c.icon.gami}`
  return c.icon.o ? laySkin(null).anhO?.[c.icon.o] : undefined
}

function IconChuong({ c, className }: { c: ChuongTutorial; className: string }) {
  const a = anhChuong(c)
  return a ? <img src={a} alt="" className={`${className} object-contain`} /> : <span className="text-[28px]" style={{ color: MAU.acc }}>✦</span>
}

// ── Hộp thoại chữ chạy (chạm: đang chạy ⇒ hiện hết câu; đã hết ⇒ sang câu sau) ──
function useChuChay(loi: string) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setN(loi.length); return }
    const t = setInterval(() => setN((x) => (x >= loi.length ? (clearInterval(t), x) : x + 1)), 24)
    return () => clearInterval(t)
  }, [loi])
  return { hien: loi.slice(0, n), xong: n >= loi.length, hetLuon: () => setN(loi.length) }
}

function NhanVat({ ngang }: { ngang: boolean }) {
  const nv = laySkin(null).nhanVat?.nam
  if (!nv) return null
  return (
    <img src={nv} alt="" className="pointer-events-none fixed bottom-0 left-0 z-10 select-none object-contain object-bottom"
      style={ngang ? { height: '78vh', maxWidth: '34vw', left: '2vw' } : { height: '190px', left: '-8px', bottom: '118px' }} />
  )
}

function HopThoai({ loi, soThu, tong, onTiep }: { loi: string; soThu?: string; tong?: string; onTiep: () => void }) {
  const { hien, xong, hetLuon } = useChuChay(loi)
  return (
    <button type="button" onClick={() => (xong ? onTiep() : hetLuon())}
      className="fixed inset-x-0 bottom-0 z-20 mx-auto block w-full max-w-[760px] px-3 pb-[calc(12px+env(safe-area-inset-bottom))] text-left"
      aria-label="Chạm để nghe tiếp">
      <div className="relative min-h-[112px] px-4 pb-4 pt-6 md:px-6"
        style={{ ...THE, clipPath: 'none', border: `1.5px solid ${MAU.acc}`, boxShadow: `0 -6px 30px ${MAU.bg}`, animation: 'tut-noi .25s ease-out' }}>
        <span className="absolute -top-3.5 left-4 rounded-full px-3 py-1 text-[13px] font-bold" style={{ ...HEAD, background: MAU.acc, color: MAU.accInk }}>{NGUOI_DAN}</span>
        {tong && <span className="absolute -top-3 right-4 rounded-full px-2.5 py-0.5 text-[11.5px] font-bold" style={{ background: MAU.surface2, color: MAU.muted, border: `1px solid ${MAU.line}` }}>{soThu}/{tong}</span>}
        <p className="text-[16px] leading-relaxed md:text-[17px]" style={{ color: MAU.ink }}>{hien}<span className="opacity-0">{loi.slice(hien.length)}</span></p>
        {xong && <span className="absolute bottom-2 right-4 text-[14px]" style={{ color: MAU.acc, animation: 'tut-nhay 1s ease-in-out infinite' }}>▼</span>}
      </div>
    </button>
  )
}

// ── Bản đồ hành trình ──────────────────────────────────────────────────────
function BanDo({ xong, onChon, onBoQua }: { xong: number; onChon: (i: number) => void; onBoQua: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-3 px-4 pb-10 pt-[calc(16px+env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h1 className="text-[24px] font-bold" style={{ ...HEAD, color: MAU.ink, textShadow: `0 1px 10px ${MAU.bg}` }}>Hành trình tân thủ</h1>
          <p className="text-[13px]" style={{ color: MAU.muted, textShadow: `0 1px 8px ${MAU.bg}` }}>Đã qua {xong}/{CHUONG.length} chặng</p>
        </div>
        <button onClick={onBoQua} className="rounded-full px-3 py-1.5 text-[13px] font-bold" style={{ ...THE, clipPath: 'none', color: MAU.muted, borderRadius: '999px' }}>Bỏ qua ›</button>
      </div>
      <div className="h-2 overflow-hidden rounded-full" style={{ background: MAU.surface2 }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(xong / CHUONG.length) * 100}%`, background: MAU.acc }} />
      </div>
      <div className="relative mt-2 flex flex-col gap-3">
        <span className="absolute bottom-6 left-[37px] top-6 w-0.5" style={{ background: MAU.line }} />
        {CHUONG.map((c, i) => {
          const daXong = i < xong, dangMo = i === xong, khoa = i > xong
          return (
            <button key={c.id} type="button" disabled={khoa} onClick={() => onChon(i)}
              className={`relative flex items-center gap-3 p-3 text-left transition ${khoa ? '' : 'active:scale-[0.99]'}`}
              style={{ ...THE, opacity: khoa ? 0.5 : 1, border: dangMo ? `1.5px solid ${MAU.acc}` : THE.border,
                boxShadow: dangMo ? `0 0 22px ${MAU.acc}` : THE.boxShadow, animation: dangMo ? 'tut-noi .4s ease-out' : undefined }}>
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: MAU.surface2, border: `1px solid ${MAU.line}` }}>
                {khoa ? <span className="text-[20px]">🔒</span> : <IconChuong c={c} className="h-10 w-10" />}
                {daXong && <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: MAU.dung, color: MAU.accInk }}>✓</span>}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-[11.5px] font-bold uppercase tracking-[0.08em]" style={{ color: dangMo ? MAU.acc : MAU.muted }}>Chặng {i + 1}</span>
                <span className="block text-[16px] font-bold" style={{ ...HEAD, color: MAU.ink }}>{c.ten}</span>
                <span className="block text-[12.5px]" style={{ color: MAU.muted }}>{c.phu}</span>
              </span>
              {dangMo && <span className="rounded-lg px-3 py-2 text-[13px] font-bold" style={{ background: MAU.acc, color: MAU.accInk }}>Bắt đầu</span>}
              {daXong && <span className="text-[12px]" style={{ color: MAU.muted }}>Xem lại</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Màn mở khoá kỹ năng / kết thúc ─────────────────────────────────────────
function ManMung({ tren, icon, tieuDe, dong, nut, onNut }: { tren: string; icon: ReactNode; tieuDe: string; dong: string; nut: string; onNut: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center px-5" style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div className="flex w-full max-w-[400px] flex-col items-center gap-3 px-5 pb-6 pt-8 text-center" style={{ ...THE, border: `1.5px solid ${MAU.acc}`, animation: 'tut-bung .45s ease-out' }}>
        <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: MAU.acc }}>{tren}</p>
        <div className="relative flex h-32 w-32 items-center justify-center">
          <img src={`${GOC}/fx/sao_moi_sang.png`} alt="" className="absolute inset-0 h-full w-full object-contain opacity-90" style={{ animation: 'tut-xoay 12s linear infinite' }} />
          <div className="relative" style={{ animation: 'tut-bung .6s ease-out' }}>{icon}</div>
        </div>
        <h2 className="text-[22px] font-bold leading-tight" style={{ ...HEAD, color: MAU.ink }}>{tieuDe}</h2>
        <p className="text-[14.5px] leading-snug" style={{ color: MAU.muted }}>{dong}</p>
        <NutHS onClick={onNut} className="mt-2 w-full">{nut}</NutHS>
      </div>
    </div>
  )
}

// ── VỎ ─────────────────────────────────────────────────────────────────────
export default function TutorialHS({ onXong, chuong }: { onXong?: () => void; chuong?: string | null }) {
  const q = useMemo(() => new URLSearchParams(location.search), [])
  const motChang = chuong ? CHUONG.findIndex((x) => x.id === chuong) : -1 // ≥ 0 ⇒ chế độ một chặng
  const don = motChang >= 0
  const vaoChang = don ? motChang + 1 : Math.min(Math.max(Number(q.get('chang')) || 0, 0), CHUONG.length)
  const [pha, setPha] = useState<Pha>(vaoChang ? 'chuong' : 'mo_dau')
  const [xong, setXong] = useState(don ? CHUONG.length : vaoChang ? vaoChang - 1 : 0) // số chặng đã qua (mở khoá tuần tự)
  const [ci, setCi] = useState(vaoChang ? vaoChang - 1 : 0)     // chặng đang xem
  const [bi, setBi] = useState(0)                               // câu thoại đang nói
  const ngang = useMedia('(min-width: 1024px) and (orientation: landscape)')
  const c = CHUONG[ci]
  const soi = pha === 'chuong' ? c.buoc[bi]?.soi : undefined

  // Phần đang soi luôn nằm giữa màn (chặng dài thì hộp thoại + nhân vật che nửa dưới).
  useEffect(() => {
    if (!soi) return
    const t = setTimeout(() => document.querySelector(`[data-soi="${soi}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
    return () => clearTimeout(t)
  }, [soi, ci])

  const vaoChuong = (i: number) => { setCi(i); setBi(0); setPha('chuong') }
  const tiepCau = () => {
    if (bi + 1 < c.buoc.length) setBi(bi + 1)
    else { setXong((x) => Math.max(x, ci + 1)); setPha('mo_khoa') }
  }
  const sauMoKhoa = () => (don ? onXong?.() : ci + 1 >= CHUONG.length ? setPha('ket_thuc') : setPha('ban_do'))

  return (
    <div data-tut className="relative min-h-[100dvh]" style={{ color: MAU.ink, fontFamily: 'var(--sk-font)' }}>
      <style>{CSS}</style>
      {/* Tranh nền = lớp cố định riêng (background-attachment: fixed hở dải đen khi cuộn trên điện thoại) */}
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: 'var(--sk-nen-trong)' }} />

      {(pha === 'ban_do' || pha === 'mo_dau') && <BanDo xong={xong} onChon={vaoChuong} onBoQua={() => setPha('ket_thuc')} />}

      {pha === 'mo_dau' && <>
        <div className="fixed inset-0 z-[5]" style={{ background: 'rgba(0,0,0,0.45)' }} />
        <NhanVat ngang={ngang} />
        <HopThoai loi={MO_DAU[bi].replace('{n}', String(CHUONG.length))} onTiep={() => (bi + 1 < MO_DAU.length ? setBi(bi + 1) : (setBi(0), setPha('ban_do')))} />
      </>}

      {(pha === 'chuong' || pha === 'mo_khoa') && (
        <div className={`mx-auto flex w-full flex-col gap-3 px-4 pt-[calc(14px+env(safe-area-inset-top))] ${ngang ? 'max-w-[520px] pb-56' : 'max-w-[460px] pb-[330px]'}`}
          style={ngang ? { marginLeft: 'max(36vw, calc(50% - 260px))' } : undefined}>
          <div className="flex items-center gap-3">
            <IconChuong c={c} className="h-11 w-11" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.08em]" style={{ color: MAU.acc, textShadow: `0 1px 8px ${MAU.bg}` }}>{don ? 'Hướng dẫn tương tác' : `Chặng ${ci + 1}/${CHUONG.length}`}</p>
              <h1 className="truncate text-[20px] font-bold" style={{ ...HEAD, color: MAU.ink, textShadow: `0 1px 10px ${MAU.bg}` }}>{c.ten}</h1>
            </div>
            <button onClick={() => (don ? onXong?.() : setPha('ban_do'))} className="rounded-full px-3 py-1.5 text-[13px] font-bold" style={{ ...THE, clipPath: 'none', color: MAU.muted, borderRadius: '999px' }}>{don ? 'Đóng' : 'Bản đồ'}</button>
          </div>
          <div key={c.id} style={{ animation: 'tut-noi .35s ease-out' }}>
            <MoPhongTutorial chuong={c.id} soi={soi} />
          </div>
        </div>
      )}

      {pha === 'chuong' && <>
        <NhanVat ngang={ngang} />
        <HopThoai key={`${c.id}-${bi}`} loi={c.buoc[bi].noi} soThu={String(bi + 1)} tong={String(c.buoc.length)} onTiep={tiepCau} />
      </>}

      {pha === 'mo_khoa' && (
        <ManMung tren={don ? 'Đã xem xong' : `Hoàn thành chặng ${ci + 1}`} icon={<IconChuong c={c} className="h-20 w-20" />} tieuDe="Mở khoá kỹ năng!" dong={c.kyNang}
          nut={don ? 'Xong' : ci + 1 >= CHUONG.length ? 'Xem kết quả' : 'Tiếp hành trình'} onNut={sauMoKhoa} />
      )}

      {pha === 'ket_thuc' && <>
        <BanDo xong={xong} onChon={vaoChuong} onBoQua={() => {}} />
        <ManMung tren={`${xong}/${CHUONG.length} chặng`} tieuDe={KET_THUC.tieuDe} dong={KET_THUC.noi} nut={KET_THUC.nut}
          icon={<div className="grid grid-cols-3 gap-1">{CHUONG.map((x) => <IconChuong key={x.id} c={x} className="h-9 w-9" />)}</div>}
          onNut={() => (onXong ? onXong() : (setXong(0), setCi(0), setBi(0), setPha('mo_dau')))} />
      </>}
    </div>
  )
}
