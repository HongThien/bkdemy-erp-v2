// HÌNH THEO STYLE của game (07/10): app HS nhúng game kèm `?skin=<id>` (hoctap/HocTapHS.tsx → GameNhungHS) ⇒ nền · icon menu · sân đấu · 2 linh vật
// lấy từ style em đang dùng (`Skin.game` · `Skin.sanDau` · `Skin.nhanVat`). Mở game riêng (dautu.html không có `skin`) ⇒ style mặc định của app.
// Nhân vật chiến đấu + boss của game (ui/Chung.tsx, ui/SanDau2D.tsx) vẫn là bộ dùng chung — chưa có bản theo style.
import { laySkin } from '../screens/hocsinh/skin/registry'

const s = laySkin(new URLSearchParams(location.search).get('skin')), mac = laySkin(null)
const game = s.game ?? mac.game!

export const HINH_GAME = {
  nenMenu: game.nenMenu,
  nenDau: game.nenDau,
  icon: game.icon,
  sanDau: s.sanDau ?? mac.sanDau!,
  linhVat: s.nhanVat ?? mac.nhanVat!,
}
