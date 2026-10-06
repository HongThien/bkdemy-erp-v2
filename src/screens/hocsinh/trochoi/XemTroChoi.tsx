// Trang soi Trò chơi (hs.html?xem=tro_choi) — không đăng nhập. &gd=<skin> đổi style · &vao=nong_trai mở thẳng game.
import { useState } from 'react'
import { GD_MAC_DINH, useApSkinGoc } from '../skin/KhungHS'
import type { GiaoDien, SkinId } from '../skin/kieu'
import TroChoiHS, { GameNongTraiHS } from './TroChoiHS'

export default function XemTroChoi() {
  const q = new URLSearchParams(location.search)
  useApSkinGoc({ ...GD_MAC_DINH, skin: (q.get('gd') as SkinId | null) ?? GD_MAC_DINH.skin, hinh_nen: '' } as GiaoDien)
  const [vao, setVao] = useState<string | null>(q.get('vao'))
  return vao === 'nong_trai' ? <GameNongTraiHS onBack={() => setVao(null)} /> : <TroChoiHS onBack={() => history.back()} onChoi={setVao} />
}
