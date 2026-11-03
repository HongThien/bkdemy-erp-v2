// Trang soi Trò chơi (hs.html?xem=tro_choi) — không đăng nhập. &gd=<skin> đổi style · &vao=nong_trai mở thẳng game · &bao_tri=1 bấm Nông trại ra hộp bảo trì.
import { useState } from 'react'
import { GD_MAC_DINH, useApSkinGoc } from '../skin/KhungHS'
import type { GiaoDien, SkinId } from '../skin/kieu'
import TroChoiHS, { BaoTriNongTraiHS, GameNongTraiHS } from './TroChoiHS'

export default function XemTroChoi() {
  const q = new URLSearchParams(location.search)
  useApSkinGoc({ ...GD_MAC_DINH, skin: (q.get('gd') as SkinId | null) ?? GD_MAC_DINH.skin, hinh_nen: '' } as GiaoDien)
  const [vao, setVao] = useState<string | null>(q.get('vao'))
  const baoTri = q.has('bao_tri')
  if (vao === 'nong_trai' && !baoTri) return <GameNongTraiHS onBack={() => setVao(null)} />
  return <><TroChoiHS onBack={() => history.back()} onChoi={setVao} />{baoTri && vao === 'nong_trai' && <BaoTriNongTraiHS onDong={() => setVao(null)} />}</>
}
