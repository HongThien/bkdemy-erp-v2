// ============================================================================
// LocHS — NGƯỜI DẪN TRUYỆN hoạt hình (Lộc, 07/10): phát chuỗi khung của 1 động tác (Skin.nguoiDan, sinh bởi scripts/anime-loc.mjs).
// · Động tác lặp (idle/talking/reading/explaining): phát mãi · động tác 1 lần: phát tới khung `giu` rồi GIỮ (khung cuối nhiều động tác không còn đúng động tác).
// · `veIdle`: phát xong 1 lần + giữ ~1,6s thì tự về idle (đứng yên không đơ).
// · Khung nạp trước khi đổi động tác ⇒ không chớp trắng. Giảm chuyển động ⇒ chỉ 1 khung tĩnh.
// Component chỉ VẼ; chọn động tác do màn gọi.
// ============================================================================
import { useEffect, useState } from 'react'
import type { NguoiDanAnh } from '../skin/anhGiaoDien'

const DA_NAP = new Set<string>()
function napTruoc(src: string[]) { for (const s of src) if (!DA_NAP.has(s)) { DA_NAP.add(s); const i = new Image(); i.src = s } }
const giamCD = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function LocHS({ nguoi, dong, veIdle = true, cao, className = '', style }: { nguoi: NguoiDanAnh; dong: string; veIdle?: boolean; cao: number; className?: string; style?: React.CSSProperties }) {
  const [hien, setHien] = useState(dong)          // động tác đang phát (có thể tự về idle)
  const [i, setI] = useState(0)
  useEffect(() => { napTruoc((nguoi.anim.idle?.src ?? [])); napTruoc((nguoi.anim[dong] ?? nguoi.anim.idle)?.src ?? []) }, [nguoi, dong])
  useEffect(() => { setHien(nguoi.anim[dong] ? dong : 'idle'); setI(0) }, [dong, nguoi])

  const a = nguoi.anim[hien] ?? nguoi.anim.idle
  useEffect(() => {
    if (!a) return
    const giu = Math.min(a.giu ?? a.src.length, a.src.length) - 1
    if (giamCD()) { setI(a.lap ? 0 : giu); return }
    let tre: number | undefined
    const t = window.setInterval(() => setI((x) => {
      if (a.lap) return (x + 1) % a.src.length
      if (x >= giu) {
        window.clearInterval(t)
        if (veIdle && hien !== 'idle') tre = window.setTimeout(() => setHien('idle'), 1600)
        return giu
      }
      return x + 1
    }), 1000 / nguoi.fps)
    return () => { window.clearInterval(t); if (tre) window.clearTimeout(tre) }
  }, [a, hien, nguoi.fps, veIdle])

  if (!a) return null
  const w = (cao * nguoi.rong) / nguoi.cao
  return <img src={a.src[Math.min(i, a.src.length - 1)]} alt="" draggable={false} className={`pointer-events-none select-none ${className}`} style={{ width: w, height: cao, ...style }} />
}
