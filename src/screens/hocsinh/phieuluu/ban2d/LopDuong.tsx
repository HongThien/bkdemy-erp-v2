// Bọc React cho CON ĐƯỜNG three.js (duongThree.ts): nạp động lúc cần; đang tải / máy không có WebGL ⇒ hiện `children` (đường SVG cũ) thay thế.
// Mức đồ hoạ Thấp / giảm chuyển động ⇒ đường đứng yên (vẽ 1 lần, không luồng sáng chạy).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import type { Duong } from './duongThree'
import { useChuyenDong } from './San2D'

export function DuongThree({ b, diem, toi, w, h, nuaRong, nghieng, xaGan, children }: {
  b: BangMau3D
  /** điểm qua các mốc, chuẩn hoá 0–1 theo khung đang vẽ */
  diem: { x: number; y: number }[]
  /** chỉ số mốc em đang tới (đoạn trước đó = đã đi) */
  toi: number
  w: number; h: number
  /** nửa bề rộng mặt đường (px) */
  nuaRong: number
  /** độ dẹt mặt đất theo góc nhìn chéo của tranh nền (xem duongThree.DuongVao) */
  nghieng?: number
  xaGan?: number
  children?: ReactNode
}) {
  const host = useRef<HTMLDivElement>(null)
  const [duong, setDuong] = useState<Duong | null>(null)
  const [loi, setLoi] = useState(false)
  const dong = useChuyenDong() && !(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    let huy = false, d: Duong | null = null
    setLoi(false)
    import('./duongThree').then((m) => {
      if (huy || !host.current) return
      try { d = m.taoDuong(host.current, b); setDuong(d) } catch (e) { console.error('[phieuluu] không vẽ được đường three.js', e); setLoi(true) }
    }).catch(() => setLoi(true))
    return () => { huy = true; d?.phaHuy(); setDuong(null) }
  }, [b])
  const khoa = diem.map((p) => `${p.x.toFixed(4)},${p.y.toFixed(4)}`).join(';')
  useEffect(() => { if (duong && w > 0) duong.capNhat({ diem, toi, w, h, nuaRong, nghieng, xaGan }) }, [duong, khoa, toi, w, h, nuaRong, nghieng, xaGan]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { duong?.datDong(dong) }, [duong, dong])
  return (
    <>
      <div ref={host} className="pointer-events-none absolute inset-0" aria-hidden />
      {(!duong || loi) && children}
    </>
  )
}
