// Sàn đấu: 3D (KayKit) khi máy đủ khoẻ, 2D (chân dung + hiệu ứng CSS) khi bật "Đồ hoạ nhẹ" hoặc không có WebGL.
import { useEffect, useRef, useState } from 'react'
import { useCaiDat } from '../lib/amThanh'
import type { SanDau } from '../lib/the3d'
import { Avatar } from './Chung'

export interface SuKienSan { seq: number; loai: 'danh' | 'ket'; ben: -1 | 0 | 1 }

export function San3D({ trai, phai, suKien }: { trai: string; phai: string; suKien: SuKienSan | null }) {
  const cd = useCaiDat()
  return cd.doHoa === '3d' ? <San3DThat trai={trai} phai={phai} suKien={suKien} /> : <San2D trai={trai} phai={phai} suKien={suKien} />
}

function San3DThat({ trai, phai, suKien }: { trai: string; phai: string; suKien: SuKienSan | null }) {
  const mount = useRef<HTMLDivElement>(null)
  const san = useRef<SanDau | null>(null)
  const [loi, setLoi] = useState(false)
  useEffect(() => {
    let huy = false
    import('../lib/the3d').then(({ taoSan }) => {
      if (huy || !mount.current) return
      try { san.current = taoSan(mount.current, trai, phai) } catch { setLoi(true) }
    }).catch(() => setLoi(true))
    return () => { huy = true; san.current?.huy(); san.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { san.current?.datNhanVat(trai, phai) }, [trai, phai])
  useEffect(() => {
    if (!suKien || !san.current) return
    if (suKien.loai === 'danh' && suKien.ben !== -1) san.current.danh(suKien.ben)
    if (suKien.loai === 'ket') san.current.ketThuc(suKien.ben)
  }, [suKien?.seq])
  if (loi) return <San2D trai={trai} phai={phai} suKien={suKien} />
  return <div ref={mount} className="san3d" />
}

function San2D({ trai, phai, suKien }: { trai: string; phai: string; suKien: SuKienSan | null }) {
  const [hieu, setHieu] = useState<{ ben: number; loai: string; seq: number } | null>(null)
  useEffect(() => {
    if (!suKien) return
    setHieu({ ben: suKien.ben, loai: suKien.loai, seq: suKien.seq })
    if (suKien.loai === 'danh') { const h = setTimeout(() => setHieu(null), 700); return () => clearTimeout(h) }
  }, [suKien?.seq])
  const lop = (b: 0 | 1) => {
    if (!hieu) return ''
    if (hieu.loai === 'danh') return hieu.ben === b ? 'lao-toi' : 'rung'
    if (hieu.loai === 'ket' && hieu.ben !== -1) return hieu.ben === b ? 'thang-nhay' : 'nga-xuong'
    return ''
  }
  return (
    <div className="san2d">
      <div key={'a' + (hieu?.seq ?? 0)} className={'nv2d trai ' + lop(0)}><Avatar nv={trai} co={150} /></div>
      <div className="tia2d">⚔️</div>
      <div key={'b' + (hieu?.seq ?? 0)} className={'nv2d phai ' + lop(1)}><Avatar nv={phai} co={150} /></div>
    </div>
  )
}
