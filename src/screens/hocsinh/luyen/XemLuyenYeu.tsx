// Trang soi màn GIỚI THIỆU Luyện dạng yếu (hs.html?xem=luyen_yeu · &gd=toi_gian|khoi|rpg · &nv=ninja|elf|…): không đăng nhập; danh sách dạng yếu không tải được ⇒ ẩn khối (đúng hành vi thật khi lỗi).
import { GD_MAC_DINH, useApSkinGoc } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import type { GiaoDien, SkinId } from '../skin/kieu'
import type { NvId } from '../skin/nhanVat'
import GioiThieuYeu from './GioiThieuYeu'

export default function XemLuyenYeu() {
  const q = new URLSearchParams(location.search)
  const skin = (q.get('gd') as SkinId | null) ?? GD_MAC_DINH.skin
  useApSkinGoc({ ...GD_MAC_DINH, skin, hinh_nen: '' } as GiaoDien)
  return <GioiThieuYeu mon="Toán" nv={(q.get('nv') as NvId | null) ?? 'ninja'} khungGame={!!laySkin(skin).the3d} onBatDau={() => alert('Bắt đầu')} onBack={() => history.back()} />
}
