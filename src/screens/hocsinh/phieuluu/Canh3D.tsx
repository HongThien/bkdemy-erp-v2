// Hook gắn 1 cảnh three.js vào 1 ô <div>. Cảnh nạp BẰNG import động (three ~600KB không vào bundle chính của app HS) và bị huỷ gọn khi rời màn.
// Cảnh lỗi (thiết bị không có WebGL) ⇒ `loi = true`, màn hiện danh sách thường thay vì cảnh 3D.
import { useEffect, useRef, useState, type RefObject } from 'react'

export type CanhHuy = { phaHuy: () => void }

export function useCanh<T extends CanhHuy>(dung: (host: HTMLElement) => Promise<T>, deps: unknown[]): { host: RefObject<HTMLDivElement>; canh: T | null; loi: boolean } {
  const host = useRef<HTMLDivElement>(null)
  const [canh, setCanh] = useState<T | null>(null)
  const [loi, setLoi] = useState(false)
  useEffect(() => {
    let huy = false, c: T | null = null
    setLoi(false)
    dung(host.current!).then((x) => { if (huy) { x.phaHuy(); return } c = x; setCanh(x) }).catch((e) => { console.error('[phieuluu] không dựng được cảnh 3D', e); if (!huy) setLoi(true) })
    return () => { huy = true; c?.phaHuy(); setCanh(null) }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return { host, canh, loi }
}

/** Mô-đun cảnh dựng 1 lần cho mỗi màn: import động để tách chunk. */
export const nap3D = {
  theGioi: () => import('../skin/the3d/canhTheGioi'),
  lucDia: () => import('../skin/the3d/canhLucDia'),
  chang: () => import('../skin/the3d/canhChang'),
  dau: () => import('../skin/the3d/canhDau'),
}
