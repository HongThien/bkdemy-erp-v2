// ============================================================================
// TUTORIAL "Hành trình tân thủ" app HS — kiểu hướng dẫn trong game (Thùy 30/09): bản đồ các chặng mở khoá dần →
// mỗi chặng: người dẫn đường nói trong hộp thoại chữ chạy, màn mô phỏng phía trên sáng đúng phần đang nói →
// hết chặng hiện "Mở khoá kỹ năng" (+ nút "Thử ngay" dẫn vào tính năng THẬT: học bằng làm) → xong hết chặng là "Hoàn thành".
// NGƯỜI DẪN (07/10): style có Skin.nguoiDan (RPG = Lộc, hoạt hình khung) ⇒ Lộc dẫn: động tác đổi theo câu (chào · chỉ tay · giải thích · cổ vũ · tạm biệt),
//   nói ⇒ talking, nói xong ⇒ đứng idle. Style không có ⇒ nhân vật tĩnh của style như cũ.
// CHẶNG THEO CÔNG TẮC TÍNH NĂNG (07/10): prop `mo(ma)` = tính năng đang MỞ cho em (fn_hs_tinh_nang_mo) ⇒ chỉ dẫn qua tính năng đang có (chuongMo). Không truyền ⇒ bản mặc định.
// `chuong` (id chặng) = chế độ MỘT CHẶNG (từ nút "Xem hướng dẫn tương tác" trong Hướng dẫn chơi). `danhSach` = chỉ các chặng này (chế độ "có phần mới": chặng em chưa xem).
// Tiến độ: `onXongChuong(id)` gọi khi em xem hết chặng (app ghi DB theo tài khoản). `onThu(dich)` = nút "Thử ngay". Demo: hs.html?xem=tutorial (&chang=N · &dot=1 giả lập đợt 1).
// Nội dung ở noiDungTutorial.ts · màn mô phỏng ở MoPhongTutorial.tsx. Màu/hình CHỈ từ skin (design/STYLE-HS.md).
// ============================================================================
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { MAU, THE, HEAD, NutHS, useMedia } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import { GOC } from '../gami/hinh'
import MoPhongTutorial from './MoPhongTutorial'
import { LocHS } from './LocHS'
import { CHUONG, MO_DAU, MO_DAU_LOC, KET_THUC, KET_THUC_LOC, NGUOI_DAN, NGUOI_DAN_LOC, THU_NGAY, chuongMo, type ChuongTutorial, type DichThu } from './noiDungTutorial'

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
  if (a) return <img src={a} alt="" className={`${className} object-contain`} />
  return <span className="flex items-center justify-center text-[28px] leading-none" style={{ color: MAU.acc }} aria-hidden>{c.icon.emoji ?? '✦'}</span>
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

/** Người dẫn: Lộc hoạt hình nếu style có (Skin.nguoiDan), không thì nhân vật tĩnh của style. `dong` = động tác Lộc. */
function NguoiDan({ ngang, dong, nho }: { ngang: boolean; dong: string; nho?: boolean }) {
  const sk = laySkin(null)
  if (sk.nguoiDan) {
    const cao = nho ? 120 : ngang ? 440 : 180
    return (
      <div className="pointer-events-none fixed z-10" style={ngang ? { bottom: nho ? 8 : 0, left: nho ? 'auto' : '3vw', right: nho ? 16 : 'auto' } : { bottom: nho ? 8 : 118, left: nho ? 'auto' : -6, right: nho ? 8 : 'auto' }}>
        <LocHS nguoi={sk.nguoiDan} dong={dong} cao={cao} veIdle={!dong.startsWith('point')} />
      </div>
    )
  }
  const nv = sk.nhanVat?.nam
  if (!nv) return null
  return (
    <img src={nv} alt="" className="pointer-events-none fixed bottom-0 left-0 z-10 select-none object-contain object-bottom"
      style={ngang ? { height: '78vh', maxWidth: '34vw', left: '2vw' } : { height: '190px', left: '-8px', bottom: '118px' }} />
  )
}

function HopThoai({ ten, loi, soThu, tong, onTiep, onNoi }: { ten: string; loi: string; soThu?: string; tong?: string; onTiep: () => void; onNoi?: (dangNoi: boolean) => void }) {
  const { hien, xong, hetLuon } = useChuChay(loi)
  useEffect(() => { onNoi?.(!xong) }, [xong]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <button type="button" onClick={() => (xong ? onTiep() : hetLuon())}
      className="fixed inset-x-0 bottom-0 z-20 mx-auto block w-full max-w-[760px] px-3 pb-[calc(12px+env(safe-area-inset-bottom))] text-left"
      aria-label="Chạm để nghe tiếp">
      <div className="relative min-h-[112px] px-4 pb-4 pt-6 md:px-6"
        style={{ ...THE, clipPath: 'none', border: `1.5px solid ${MAU.acc}`, boxShadow: `0 -6px 30px ${MAU.bg}`, animation: 'tut-noi .25s ease-out' }}>
        <span className="absolute -top-3.5 left-4 rounded-full px-3 py-1 text-[13px] font-bold" style={{ ...HEAD, background: MAU.acc, color: MAU.accInk }}>{ten}</span>
        {tong && <span className="absolute -top-3 right-4 rounded-full px-2.5 py-0.5 text-[11.5px] font-bold" style={{ background: MAU.surface2, color: MAU.muted, border: `1px solid ${MAU.line}` }}>{soThu}/{tong}</span>}
        <p className="text-[16px] leading-relaxed md:text-[17px]" style={{ color: MAU.ink }}>{hien}<span className="opacity-0">{loi.slice(hien.length)}</span></p>
        {xong && <span className="absolute bottom-2 right-4 text-[14px]" style={{ color: MAU.acc, animation: 'tut-nhay 1s ease-in-out infinite' }}>▼</span>}
      </div>
    </button>
  )
}

// ── Bản đồ hành trình ──────────────────────────────────────────────────────
function BanDo({ ds, xong, onChon, onBoQua }: { ds: ChuongTutorial[]; xong: number; onChon: (i: number) => void; onBoQua: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-3 px-4 pb-10 pt-[calc(16px+env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h1 className="text-[24px] font-bold" style={{ ...HEAD, color: MAU.ink, textShadow: `0 1px 10px ${MAU.bg}` }}>Hành trình tân thủ</h1>
          <p className="text-[13px]" style={{ color: MAU.muted, textShadow: `0 1px 8px ${MAU.bg}` }}>Đã qua {xong}/{ds.length} chặng</p>
        </div>
        <button onClick={onBoQua} className="rounded-full px-3 py-1.5 text-[13px] font-bold" style={{ ...THE, clipPath: 'none', color: MAU.muted, borderRadius: '999px' }}>Bỏ qua ›</button>
      </div>
      <div className="h-2 overflow-hidden rounded-full" style={{ background: MAU.surface2 }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(xong / Math.max(1, ds.length)) * 100}%`, background: MAU.acc }} />
      </div>
      <div className="relative mt-2 flex flex-col gap-3">
        <span className="absolute bottom-6 left-[37px] top-6 w-0.5" style={{ background: MAU.line }} />
        {ds.map((c, i) => {
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
function ManMung({ tren, icon, lo, tieuDe, dong, nut, onNut, thu, onThu }: { tren: string; icon: ReactNode; lo?: ReactNode; tieuDe: string; dong: string; nut: string; onNut: () => void; thu?: string; onThu?: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center px-5" style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div className="flex w-full max-w-[400px] flex-col items-center gap-3 px-5 pb-6 pt-8 text-center" style={{ ...THE, border: `1.5px solid ${MAU.acc}`, animation: 'tut-bung .45s ease-out' }}>
        <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: MAU.acc }}>{tren}</p>
        {lo ?? (
          <div className="relative flex h-32 w-32 items-center justify-center">
            <img src={`${GOC}/fx/sao_moi_sang.png`} alt="" className="absolute inset-0 h-full w-full object-contain opacity-90" style={{ animation: 'tut-xoay 12s linear infinite' }} />
            <div className="relative" style={{ animation: 'tut-bung .6s ease-out' }}>{icon}</div>
          </div>
        )}
        <h2 className="text-[22px] font-bold leading-tight" style={{ ...HEAD, color: MAU.ink }}>{tieuDe}</h2>
        <p className="text-[14.5px] leading-snug" style={{ color: MAU.muted }}>{dong}</p>
        {thu && onThu && <NutHS onClick={onThu} className="mt-2 w-full">{thu}</NutHS>}
        <button onClick={onNut} className={thu ? 'text-[14px] font-bold' : 'mt-2 w-full rounded-lg px-4 py-3 text-[15px] font-bold'}
          style={thu ? { color: MAU.muted } : { background: MAU.acc, color: MAU.accInk }}>{nut}</button>
      </div>
    </div>
  )
}

// ── VỎ ─────────────────────────────────────────────────────────────────────
export default function TutorialHS({ onXong, chuong, mo, danhSach, onXongChuong, onBoQua, onThu }: {
  onXong?: () => void; chuong?: string | null
  mo?: (ma: string) => boolean
  danhSach?: ChuongTutorial[]
  onXongChuong?: (id: string) => void
  /** bấm Bỏ qua ở bản đồ: các chặng CHƯA xem được báo về để app ghi "bỏ qua" (không nhắc lại) */
  onBoQua?: (ids: string[]) => void
  onThu?: (dich: DichThu) => void
}) {
  const q = useMemo(() => new URLSearchParams(location.search), [])
  const dot1 = !!q.get('dot')
  const ds = useMemo(
    () => danhSach ?? (mo ? chuongMo(mo) : dot1 ? chuongMo((ma) => ['hoc_tap', 'nhiem_vu', 'chuoi', 'thanh_tuu', 'vi_xu', 'xep_hang', 'tro_choi'].includes(ma)) : CHUONG),
    [danhSach, mo, dot1])
  const sk = laySkin(null)
  const loc = !!sk.nguoiDan
  const ten = loc ? NGUOI_DAN_LOC : NGUOI_DAN
  const modau = loc ? MO_DAU_LOC : MO_DAU.map((noi) => ({ noi, loc: undefined as string | undefined }))
  const ketthuc = loc ? KET_THUC_LOC : KET_THUC

  const motChang = chuong ? ds.findIndex((x) => x.id === chuong) : -1 // ≥ 0 ⇒ chế độ một chặng
  const don = motChang >= 0
  const vaoChang = don ? motChang + 1 : Math.min(Math.max(Number(q.get('chang')) || 0, 0), ds.length)
  const [pha, setPha] = useState<Pha>(vaoChang ? 'chuong' : 'mo_dau')
  const [xong, setXong] = useState(don ? ds.length : vaoChang ? vaoChang - 1 : 0) // số chặng đã qua (mở khoá tuần tự)
  const [ci, setCi] = useState(vaoChang ? vaoChang - 1 : 0)     // chặng đang xem
  const [bi, setBi] = useState(0)                               // câu thoại đang nói
  const [dangNoi, setDangNoi] = useState(false)
  const ngang = useMedia('(min-width: 1024px) and (orientation: landscape)')
  const c = ds[ci]
  const soi = pha === 'chuong' ? c?.buoc[bi]?.soi : undefined

  // Phần đang soi luôn nằm giữa màn (chặng dài thì hộp thoại + nhân vật che nửa dưới).
  useEffect(() => {
    if (!soi) return
    const t = setTimeout(() => document.querySelector(`[data-soi="${soi}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
    return () => clearTimeout(t)
  }, [soi, ci])

  if (!c) return null // không có chặng nào cho em (mọi tính năng còn đóng)

  const vaoChuong = (i: number) => { setCi(i); setBi(0); setPha('chuong') }
  const tiepCau = () => {
    if (bi + 1 < c.buoc.length) setBi(bi + 1)
    else { setXong((x) => Math.max(x, ci + 1)); onXongChuong?.(c.id); setPha('mo_khoa') }
  }
  const sauMoKhoa = () => (don ? onXong?.() : ci + 1 >= ds.length ? setPha('ket_thuc') : setPha('ban_do'))

  // ĐỘNG TÁC LỘC: chào ở mở đầu · chỉ tay ở câu đầu chặng (ngang: chỉ sang phải, dọc: chỉ lên) · giải thích/nói xen kẽ · cổ vũ khi mở khoá · tạm biệt khi kết thúc
  const cu = pha === 'mo_dau' ? modau[bi]?.loc : pha === 'chuong' ? (c.buoc[bi].loc ?? (bi === 0 ? (ngang ? 'point_right' : 'point_up') : bi % 2 ? 'explaining' : 'talking')) : undefined
  const dongLoc = pha === 'mo_khoa' ? 'cheering' : pha === 'ket_thuc' ? 'goodbye' : pha === 'ban_do' ? 'idle'
    : !cu ? 'idle' : dangNoi ? cu : (cu === 'talking' || cu === 'explaining' || cu === 'reading') ? 'idle' : cu
  const thuNgay = THU_NGAY[c.id]

  return (
    <div data-tut className="relative min-h-[100dvh]" style={{ color: MAU.ink, fontFamily: 'var(--sk-font)' }}>
      <style>{CSS}</style>
      {/* Tranh nền = lớp cố định riêng (background-attachment: fixed hở dải đen khi cuộn trên điện thoại) */}
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: 'var(--sk-nen-trong)' }} />

      {(pha === 'ban_do' || pha === 'mo_dau') && <BanDo ds={ds} xong={xong} onChon={vaoChuong} onBoQua={() => { onBoQua?.(ds.slice(xong).map((x) => x.id)); setPha('ket_thuc') }} />}

      {pha === 'mo_dau' && <>
        <div className="fixed inset-0 z-[5]" style={{ background: 'rgba(0,0,0,0.45)' }} />
        <NguoiDan ngang={ngang} dong={dongLoc} />
        <HopThoai key={`md-${bi}`} ten={ten} loi={modau[bi].noi.replace('{n}', String(ds.length))} onNoi={setDangNoi}
          onTiep={() => (bi + 1 < modau.length ? setBi(bi + 1) : (setBi(0), setPha('ban_do')))} />
      </>}

      {pha === 'ban_do' && loc && <NguoiDan ngang={ngang} dong="idle" nho />}

      {(pha === 'chuong' || pha === 'mo_khoa') && (
        <div className={`mx-auto flex w-full flex-col gap-3 px-4 pt-[calc(14px+env(safe-area-inset-top))] ${ngang ? 'max-w-[520px] pb-56' : 'max-w-[460px] pb-[330px]'}`}
          style={ngang ? { marginLeft: 'max(36vw, calc(50% - 260px))' } : undefined}>
          <div className="flex items-center gap-3">
            <IconChuong c={c} className="h-11 w-11" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.08em]" style={{ color: MAU.acc, textShadow: `0 1px 8px ${MAU.bg}` }}>{don ? 'Hướng dẫn tương tác' : `Chặng ${ci + 1}/${ds.length}`}</p>
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
        <NguoiDan ngang={ngang} dong={dongLoc} />
        <HopThoai key={`${c.id}-${bi}`} ten={ten} loi={c.buoc[bi].noi} soThu={String(bi + 1)} tong={String(c.buoc.length)} onTiep={tiepCau} onNoi={setDangNoi} />
      </>}

      {pha === 'mo_khoa' && (
        <ManMung tren={don ? 'Đã xem xong' : `Hoàn thành chặng ${ci + 1}`} icon={<IconChuong c={c} className="h-20 w-20" />} tieuDe="Mở khoá kỹ năng!" dong={c.kyNang}
          lo={sk.nguoiDan ? <LocHS nguoi={sk.nguoiDan} dong="cheering" cao={150} veIdle={false} /> : undefined}
          thu={thuNgay && onThu ? thuNgay.nut : undefined} onThu={thuNgay && onThu ? () => onThu(thuNgay.dich) : undefined}
          nut={thuNgay && onThu ? (don ? 'Để sau' : ci + 1 >= ds.length ? 'Để sau, xem kết quả' : 'Để sau, tiếp hành trình') : don ? 'Xong' : ci + 1 >= ds.length ? 'Xem kết quả' : 'Tiếp hành trình'} onNut={sauMoKhoa} />
      )}

      {pha === 'ket_thuc' && <>
        <BanDo ds={ds} xong={xong} onChon={vaoChuong} onBoQua={() => {}} />
        <ManMung tren={`${xong}/${ds.length} chặng`} tieuDe={ketthuc.tieuDe} dong={ketthuc.noi} nut={ketthuc.nut}
          icon={<div className="grid grid-cols-3 gap-1">{ds.map((x) => <IconChuong key={x.id} c={x} className="h-9 w-9" />)}</div>}
          lo={sk.nguoiDan ? <LocHS nguoi={sk.nguoiDan} dong="goodbye" cao={160} veIdle={false} /> : undefined}
          onNut={() => (onXong ? onXong() : (setXong(0), setCi(0), setBi(0), setPha('mo_dau')))} />
      </>}
    </div>
  )
}
