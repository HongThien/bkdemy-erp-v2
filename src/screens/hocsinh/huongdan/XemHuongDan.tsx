// Trang soi Hướng dẫn chơi (hs.html?xem=huong_dan) — không đăng nhập. &gd=<skin> gắn style để soi giọng (formal ↔ game).
import { useEffect } from 'react'
import { GD_MAC_DINH, useApSkinGoc } from '../skin/KhungHS'
import type { GiaoDien, SkinId } from '../skin/kieu'
import HuongDanHS from './HuongDanHS'

export default function XemHuongDan() {
  const q = new URLSearchParams(location.search)
  const gd: GiaoDien = { ...GD_MAC_DINH, skin: (q.get('gd') as SkinId | null) ?? GD_MAC_DINH.skin, hinh_nen: '' }
  useApSkinGoc(gd)
  useEffect(() => { document.title = 'Hướng dẫn chơi' }, [])
  return <HuongDanHS onBack={() => history.back()} moSan={q.get('muc') ?? undefined} onTutorial={(c) => alert(`Tutorial chương: ${c}`)} />
}
