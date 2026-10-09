// ============================================================================
// BOSS RIÊNG trên màn 2D (cutscene mở/kết, khung hội thoại, trang xem thử): hình từ `Skin.boss` của style đang dùng, hoạt ảnh bằng CSS
// (transform + opacity — design/FLOW-NPC-BOSS-CUOI.md §6). Trong cảnh trận 3D boss dựng bằng skin/the3d/quaiAnh.ts — cùng 6 tư thế, cùng nhịp.
// ============================================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import { MAU, HEAD, THE } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import type { ClipBoss } from '../skin/kieu'
import { BOSS, cauCua, type Cau, type TinhHuong, type TuTheBoss } from './noiDungBoss'

const TU_THE: TuTheBoss[] = ['dung', 'noi', 'chieu', 'trung', 'gian', 'ha']
export const NHAN_TU_THE: Record<TuTheBoss, string> = { dung: 'Đứng', noi: 'Nói', chieu: 'Gồng chiêu', trung: 'Trúng đòn', gian: 'Nghiêm túc', ha: 'Bị hạ' }

// Mỗi tư thế 1 nhịp riêng. `prefers-reduced-motion`: tắt chuyển động, vẫn đổi tư thế.
const CSS = `
@keyframes bs-tho { 0%,100% { transform: translateY(0) scale(1,1) } 50% { transform: translateY(-1.2%) scale(.992,1.018) } }
@keyframes bs-noi { 0%,100% { transform: translateY(0) rotate(0) } 25% { transform: translateY(-1.6%) rotate(-.6deg) } 75% { transform: translateY(-.6%) rotate(.6deg) } }
@keyframes bs-bao { 0% { transform: translateX(0) scale(1) } 100% { transform: translateX(3%) scale(1.05) } }
@keyframes bs-trung { 0% { filter: brightness(2.2) } 15% { transform: translateX(-3%) } 30% { transform: translateX(3%) } 45% { transform: translateX(-2%) } 60% { transform: translateX(1.5%) } 100% { filter: none; transform: none } }
@keyframes bs-gian { 0%,100% { transform: scale(1) } 50% { transform: scale(1.025) } }
@keyframes bs-ha { 0% { opacity: 1; transform: translateY(0) scale(1) } 100% { opacity: 0; transform: translateY(-6%) scale(.97,.94); filter: brightness(1.6) blur(1px) } }
@keyframes bs-hien { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
@keyframes bs-nhay { 0%,100% { opacity: 1; transform: translateY(0) } 50% { opacity: .35; transform: translateY(3px) } }
[data-bs="dung"] { animation: bs-tho 3.2s ease-in-out infinite }
[data-bs="noi"] { animation: bs-noi 1.1s ease-in-out infinite }
[data-bs="chieu"] { animation: bs-bao .7s ease-out forwards }
[data-bs="trung"] { animation: bs-trung .42s ease-out 1 }
[data-bs="gian"] { animation: bs-gian 1.6s ease-in-out infinite }
[data-bs="ha"] { animation: bs-ha 1.6s ease-in forwards }
@media (prefers-reduced-motion: reduce) { [data-bs], [data-bs] * { animation: none !important } [data-bs="ha"] { opacity: .35 } }
`

// Khung PNG của boss có hoạt ảnh theo khung: mặc định 768×640, neo chân (384,580) (Minh Quân); khung khác khai ở ClipBoss.rong/cao/px/py (Trang, Cường). Phóng sao cho phần thân (~520px cao) gần đầy ô vuông `cao`, chân đặt ở 98% chiều cao ô.
const KHUNG_W = 768, KHUNG_H = 640, NEO_Y = 580
const nho = new Set<string>()
/** Nạp + giải mã trước mọi khung (1 lần/ảnh) để đổi clip không chớp. */
function napKhung(a: { khung?: Record<string, ClipBoss | undefined>; chieuRieng?: { clip: ClipBoss }[]; anhTenLua?: string }) {
  const ds = [...Object.values(a.khung ?? {}).flatMap((c) => c?.src ?? []), ...(a.chieuRieng ?? []).flatMap((c) => c.clip.src), ...(a.anhTenLua ? [a.anhTenLua] : [])]
  for (const u of ds) if (!nho.has(u)) { nho.add(u); const im = new Image(); im.src = u; im.decode?.().catch(() => undefined) }
}

/** Phát 1 clip theo khung: mọi khung của clip nằm sẵn trong DOM, chỉ đổi opacity. lap ⇒ lặp; không ⇒ giữ khung cuối. Giảm chuyển động ⇒ 1 khung tĩnh (cuối với clip 1 lần). */
function ClipHinh({ clip, cao, bong }: { clip: ClipBoss; cao: number; bong: boolean }) {
  const giam = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [i, setI] = useState(giam && !clip.lap ? clip.src.length - 1 : 0)
  useEffect(() => {
    if (giam) return
    setI(0)
    let k = 0, id = 0
    const buoc = () => { id = window.setTimeout(() => { if (k + 1 < clip.src.length) { k++; setI(k); buoc() } else if (clip.lap) { k = 0; setI(0); buoc() } }, clip.ms[k]) }
    if (clip.src.length > 1) buoc()
    return () => window.clearTimeout(id)
  }, [clip, giam])
  const s = (cao * 1.25) / KHUNG_W, rong = clip.rong ?? KHUNG_W, px = clip.px ?? KHUNG_W / 2, caoKhung = clip.cao ?? KHUNG_H, neoY = clip.py ?? NEO_Y
  return (
    <>
      {clip.src.map((u, k) => (
        <img key={`${k}-${u}`} src={u} alt="" draggable={false} className="absolute max-w-none select-none"
          style={{
            width: rong * s, height: caoKhung * s, left: cao / 2 - px * s, top: cao * 0.98 - neoY * s, opacity: k === i ? 1 : 0,
            transform: clip.lat ? 'scaleX(-1)' : undefined, transformOrigin: clip.lat ? `${px * s}px 50%` : undefined,
            filter: bong ? 'brightness(0) opacity(.85)' : undefined,
          }} />
      ))}
    </>
  )
}

/** Dáng boss đứng trên màn 2D. Boss thường: cả 6 ảnh nằm sẵn trong DOM (chỉ đổi opacity) ⇒ đổi tư thế không chớp. Boss có HOẠT ẢNH (Skin.boss[ma].khung): tư thế nào có clip thì phát clip;
 *  `clip` = ép phát 1 clip cụ thể (chiêu riêng của boss) thay cho tư thế. */
export function BossAnhHS({ ma, tt, cao = 340, bong = false, clip }: { ma: string; tt: TuTheBoss; cao?: number; bong?: boolean; clip?: ClipBoss | null }) {
  const a = laySkin(null).boss?.[ma]
  useEffect(() => { if (a?.khung) napKhung(a) }, [a])
  if (!a) return null
  const c = clip ?? a.khung?.[tt]
  if (c) {
    return (
      <div className="relative mx-auto" style={{ height: cao, width: cao, maxWidth: '100%', overflow: 'visible' }}>
        <style>{CSS}</style>
        <div data-bs={tt === 'dung' && !clip ? 'dung' : undefined} className="absolute inset-0" style={{ overflow: 'visible' }}>
          <ClipHinh key={clip ? clip.src[0] : tt} clip={c} cao={cao} bong={bong} />
        </div>
      </div>
    )
  }
  return (
    <div className="relative mx-auto" style={{ height: cao, width: cao, maxWidth: '100%' }}>
      <style>{CSS}</style>
      <div data-bs={tt} key={tt} className="absolute inset-0">
        {TU_THE.map((k) => (
          <img key={k} src={a[k]} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none object-contain"
            style={{ opacity: k === tt ? 1 : 0, filter: bong ? 'brightness(0) opacity(.85)' : undefined }} />
        ))}
      </div>
    </div>
  )
}

function useChuChay(c: string) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const t = setInterval(() => setN((x) => { if (x >= c.length) { clearInterval(t); return x } return x + 1 }), 28)
    return () => clearInterval(t)
  }, [c])
  return { hien: c.slice(0, n), xong: n >= c.length, het: () => setN(c.length) }
}

/** Khung hội thoại boss: chân dung + chữ chạy. Chạm: đang chạy ⇒ hiện hết câu; đã hết ⇒ câu kế; câu cuối ⇒ onXong.
 *  `onTuThe` báo tư thế của câu đang nói để cha đổi dáng boss. `so` = số liệu thật từ DB cho các câu có `{khoá}` (cha nên giữ object ổn định, vd hằng/useMemo — đổi mỗi lần render thì câu bị dựng lại). */
export function HoiThoaiBoss({ ma, tinhHuong, so, onTuThe, onXong }: {
  ma: string; tinhHuong: TinhHuong; so?: Record<string, number | string>; onTuThe?: (t: TuTheBoss) => void; onXong?: () => void
}) {
  const nd = BOSS[ma]
  const a = laySkin(null).boss?.[ma]
  const cau: Cau[] = useMemo(() => (nd ? cauCua(nd, tinhHuong, so) : []), [nd, tinhHuong, so])
  const [i, setI] = useState(0)
  const cbTuThe = useRef(onTuThe); cbTuThe.current = onTuThe
  useEffect(() => { setI(0) }, [tinhHuong])
  const c = cau[i]
  const chay = useChuChay(c?.noi ?? '')
  const noiC = c?.noi, matC = c?.mat
  useEffect(() => { if (noiC !== undefined) cbTuThe.current?.(chay.xong && matC === 'noi' ? 'dung' : (matC ?? 'noi')) }, [noiC, matC, chay.xong])
  if (!nd || !a || !c) return null
  const tiep = () => { if (!chay.xong) chay.het(); else if (i + 1 < cau.length) setI(i + 1); else onXong?.() }
  return (
    <button onClick={tiep} className="flex w-full items-start gap-3 p-3 text-left active:scale-[0.995]" style={{ ...THE, animation: 'bs-hien .25s ease-out' }}>
      <img src={a.chandung} alt="" className="h-[72px] w-[72px] shrink-0 rounded-full object-cover" style={{ border: '2px solid var(--sk-acc)', background: 'var(--sk-surface2)' }} />
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-bold" style={{ ...HEAD, color: MAU.acc }}>{nd.ten} <span className="font-normal" style={{ color: MAU.muted }}>· {nd.vai}</span></p>
        <p className="mt-1 min-h-[44px] text-[16.5px] leading-snug" style={{ color: MAU.ink }}>{chay.hien}</p>
        <p className="mt-1 text-right text-[13px]" style={{ color: MAU.muted, animation: chay.xong ? 'bs-nhay 1.2s ease-in-out infinite' : undefined }}>
          {chay.xong ? (i + 1 < cau.length ? 'Chạm để nghe tiếp ▾' : 'Chạm để tiếp tục ▾') : ''}
        </p>
      </div>
    </button>
  )
}
