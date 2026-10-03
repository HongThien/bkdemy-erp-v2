// Trang soi Hướng dẫn chơi (hs.html?xem=huong_dan) — không đăng nhập. &gd=<skin> gắn style để soi giọng (formal ↔ game); &muc=<id chủ đề> mở thẳng chủ đề.
// Nút "Xem hướng dẫn tương tác" mở tutorial đúng chương (cùng cách HocSinhApp làm).
import { useEffect, useState } from 'react'
import { GD_MAC_DINH, useApSkinGoc } from '../skin/KhungHS'
import type { GiaoDien, SkinId } from '../skin/kieu'
import TutorialHS from '../tutorial/TutorialHS'
import HuongDanHS from './HuongDanHS'

export default function XemHuongDan() {
  const q = new URLSearchParams(location.search)
  const gd: GiaoDien = { ...GD_MAC_DINH, skin: (q.get('gd') as SkinId | null) ?? GD_MAC_DINH.skin, hinh_nen: '' }
  useApSkinGoc(gd)
  const [tut, setTut] = useState<string | null | undefined>(q.get('tut') === null ? undefined : q.get('tut') || null)
  useEffect(() => { document.title = 'Hướng dẫn chơi' }, [])
  return tut !== undefined
    ? <TutorialHS chuong={tut} onXong={() => setTut(undefined)} />
    : <HuongDanHS onBack={() => history.back()} moSan={q.get('muc') ?? undefined} onTutorial={setTut} />
}
