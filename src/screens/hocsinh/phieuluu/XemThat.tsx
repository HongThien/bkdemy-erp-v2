// TRANG SOI CHUYỂN CẢNH của PhieuLuuHS THẬT (hs.html?xem=phieu_luu&that=1) — không cần đăng nhập: nhồi dữ liệu giả vào bộ nhớ nạp trước (chuyenCanh.datBanDoNap)
// rồi mở đúng PhieuLuuHS (lớp chồng, ManCho, nạp ảnh trước) thay vì bản xem rời của XemPhieuLuu. Chỉ dùng khi dev/soi — không đụng DB.
import { useState } from 'react'
import type { BanDoPL, LucDiaPL } from '../../../lib/phieuluu'
import PhieuLuuHS from './PhieuLuuHS'
import { datBanDoNap } from './chuyenCanh'
import { GD_MAC_DINH } from '../skin/KhungHS'

const BIOME = ['rung', 'bang', 'nui_lua', 'bien_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao', 'anh_dao', 'dong_gio']
const TT = ['yeu', 'chua_do', 'dat'] as const
function gia(): BanDoPL {
  const luc_dia: LucDiaPL[] = BIOME.map((biome, i) => ({
    ma: 'L' + i, ten: `Chủ đề ${i + 1}`, thu_tu: i, biome,
    khu_vuc: Array.from({ length: 4 }, (_, v) => ({
      ma: `L${i}V${v}`, ten: `Chuyên đề ${v + 1}`, thu_tu: v,
      man: Array.from({ length: 3 }, (_, m) => ({
        ma_dang: `D${i}_${v}_${m}`, ten: `Dạng ${m + 1}`, thu_tu: m, muc_do: 3, nhanh: null, so_cau: 10, trang_thai: TT[(i + v + m) % 3],
        muc: null, mastery: null, da_day: true, la_man_boss: false,
        quai: [{ ma: `Q${i}${v}${m}a`, ten: 'Cụm a', loai_quai: 'slime_la', la_boss: false }, { ma: `Q${i}${v}${m}b`, ten: 'Cụm b', loai_quai: 'be_nham', la_boss: m === 2 }],
      })),
    })),
  }))
  return { mon: 'Toán', khoi: '9', luc_dia }
}

export default function XemThat() {
  const [mon] = useState(() => { const d = gia(); datBanDoNap(d.mon, d); return d.mon })
  return <PhieuLuuHS hocSinhId="xem" mon={mon} gioiTinh="nam" nhanVat={null} skin={GD_MAC_DINH.skin} onVe={() => history.back()} LamBai={() => <div className="p-6">Màn làm bài (giả)</div>} />
}
