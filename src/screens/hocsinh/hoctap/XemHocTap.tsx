// TRANG XEM THỬ khu HỌC TẬP (hs.html?xem=hoc_tap · &mon=Toán|KHTN|Tiếng Anh · &khoi=7 · &skin=khoi): 5 ô + Đấu trường / Chinh phục (game nhúng) + Giải Vô địch — không cần đăng nhập.
// Học theo chủ đề ⇒ mở trang xem thử bản đồ; Luyện dạng yếu / Đấu với máy cần tài khoản thật ⇒ ở đây chỉ báo.
import { useState } from 'react'
import { DauTrangHS, ManHS, TrongHS, ganSkinXemThu, useApSkinGoc } from '../skin/KhungHS'
import { GameNhungHS, GiaiVoDichHS, HocTapHS } from './HocTapHS'
import { ChinhPhucHS } from './ChinhPhucHS'
import { ChonNhanVatHS } from './ChonNhanVatHS'
import { laNvChon, type NvId } from '../skin/nhanVat'

type Man = 'hub' | 'dau_truong' | 'chinh_phuc' | 'giai' | 'can_tk' | 'nhan_vat'

export default function XemHocTap() {
  const [gd] = useState(ganSkinXemThu); useApSkinGoc(gd) // &skin=<id>: soi bằng style khác
  const q = new URLSearchParams(location.search), mon = q.get('mon') ?? 'Toán', khoi = q.get('khoi') ?? '7' // &khoi=: khối của em (giả)
  // nhân vật: trang xem thử nhớ trong máy (localStorage) — app thật lưu DB. &nv=0 xoá để xem lại màn chọn lần đầu.
  const [nv, setNv] = useState<NvId | null>(() => { try { if (q.get('nv') === '0') localStorage.removeItem('xem_nv'); const v = localStorage.getItem('xem_nv'); return laNvChon(v) ? v : null } catch { return null } })
  const [man, setMan] = useState<Man>(nv ? 'hub' : 'nhan_vat')
  const ve = () => setMan('hub')
  if (man === 'nhan_vat') return <ChonNhanVatHS dangCo={nv} luu={async (id) => { try { localStorage.setItem('xem_nv', id) } catch { /* bỏ qua */ } }} onXong={(id) => { setNv(id); setMan('hub') }} onBack={ve} />
  if (man === 'dau_truong') return <GameNhungHS vao="chu_de" tieuDe="Đấu trường BK" mon={mon} khoi={khoi} onBack={ve} />
  if (man === 'chinh_phuc') return <ChinhPhucHS mon={mon} khoi={khoi} onBack={ve} />
  if (man === 'giai') return <GiaiVoDichHS onBack={ve} onDauMay={() => setMan('can_tk')} />
  if (man === 'can_tk') return <ManHS><DauTrangHS tieuDe="Cần đăng nhập" onBack={ve} /><TrongHS>Màn này dùng dữ liệu học thật của em — mở trong app đã đăng nhập (trang xem thử không có tài khoản).</TrongHS></ManHS>
  return <HocTapHS nhanVat={nv} onDoiNhanVat={() => setMan('nhan_vat')} onBack={() => history.back()} onChuDe={() => { location.search = `?xem=phieu_luu&skin=${gd.skin}` }} onYeu={() => setMan('can_tk')}
    onDauTruong={() => setMan('dau_truong')} onChinhPhuc={() => setMan('chinh_phuc')} onGiai={() => setMan('giai')} />
}
