// TRANG XEM THỬ khu HỌC TẬP (hs.html?xem=hoc_tap · &mon=Toán|KHTN|Tiếng Anh): 5 ô + Đấu trường / Chinh phục (game nhúng) + Giải Vô địch — không cần đăng nhập.
// Học theo chủ đề ⇒ mở trang xem thử bản đồ; Luyện dạng yếu / Đấu với máy cần tài khoản thật ⇒ ở đây chỉ báo.
import { useState } from 'react'
import { DauTrangHS, ManHS, TrongHS } from '../skin/KhungHS'
import { GameNhungHS, GiaiVoDichHS, HocTapHS } from './HocTapHS'

type Man = 'hub' | 'dau_truong' | 'chinh_phuc' | 'giai' | 'can_tk'

export default function XemHocTap() {
  const mon = new URLSearchParams(location.search).get('mon') ?? 'Toán'
  const [man, setMan] = useState<Man>('hub')
  const ve = () => setMan('hub')
  if (man === 'dau_truong') return <GameNhungHS vao="chu_de" tieuDe="Đấu trường BK" mon={mon} onBack={ve} />
  if (man === 'chinh_phuc') return <GameNhungHS vao="thap" tieuDe="Chinh phục BK" mon={mon} onBack={ve} />
  if (man === 'giai') return <GiaiVoDichHS onBack={ve} onDauMay={() => setMan('can_tk')} />
  if (man === 'can_tk') return <ManHS><DauTrangHS tieuDe="Cần đăng nhập" onBack={ve} /><TrongHS>Màn này dùng dữ liệu học thật của em — mở trong app đã đăng nhập (trang xem thử không có tài khoản).</TrongHS></ManHS>
  return <HocTapHS onBack={() => history.back()} onChuDe={() => { location.search = '?xem=phieu_luu' }} onYeu={() => setMan('can_tk')}
    onDauTruong={() => setMan('dau_truong')} onChinhPhuc={() => setMan('chinh_phuc')} onGiai={() => setMan('giai')} />
}
