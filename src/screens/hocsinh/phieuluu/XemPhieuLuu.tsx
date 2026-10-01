// TRANG XEM THỬ bản đồ phiêu lưu (hs.html?xem=phieu_luu): dữ liệu giả cùng hình dạng hợp đồng, không gọi DB, không cần đăng nhập.
// Dùng để soi cảnh 3D ở 1180×820 / 1440×900 / 390×844 trước khi nối dữ liệu thật (spec-v1-app-hs.md §13.3 việc 1).
// Mở thẳng một tầng: &tang=luc_dia&luc=C · &tang=chang&luc=C&vung=C1
import { useState } from 'react'
import { laySkin } from '../skin/registry'
import { GD_MAC_DINH, DauTrangHS } from '../skin/KhungHS'
import { MAU_BAN_DO as MAU, banDoNhieu } from './mau'
import { tuBanDoPL, type BanDoV } from './kieu'
import { TheGioiView } from './TheGioiView'
import { LucDiaView } from './LucDiaView'
import { ChangView } from './ChangView'
import { XemDau } from './XemDau'
import { ChanDoan } from './ChanDoan'
import type { ChangV } from './kieu'

// Chỉ khi chạy dev: dán JSON thật của fn_ban_do_phieu_luu vào localStorage 'ban_do_pl' để soi dữ liệu thật qua bộ đổi tuBanDoPL.
function layBanDo(): BanDoV {
  if (new URLSearchParams(location.search).get('thu') === 'nhieu') return banDoNhieu()
  try { const j = import.meta.env.DEV ? localStorage.getItem('ban_do_pl') : null; if (j) return tuBanDoPL(JSON.parse(j)) } catch { /* dùng mẫu */ }
  return MAU
}

type Tang = { t: 'the_gioi' } | { t: 'luc_dia'; luc: string } | { t: 'chang'; luc: string; vung: string } | { t: 'dau'; luc: string; vung: string; chang: string }

export default function XemPhieuLuu() {
  const [MAU_BAN_DO] = useState(layBanDo)
  const b = laySkin(GD_MAC_DINH.skin).the3d!
  const q = new URLSearchParams(location.search)
  const [tang, setTang] = useState<Tang>(() => {
    const t = q.get('tang'), luc = q.get('luc') ?? 'C'
    if (t === 'luc_dia') return { t, luc }
    if (t === 'chang') return { t, luc, vung: q.get('vung') ?? `${luc}1` }
    if (t === 'dau') return { t, luc, vung: q.get('vung') ?? `${luc}1`, chang: q.get('chang') ?? '' }
    return { t: 'the_gioi' }
  })
  const luc = tang.t !== 'the_gioi' ? MAU_BAN_DO.luc_dia.find((l) => l.ma === tang.luc) : undefined
  const vung = tang.t === 'chang' || tang.t === 'dau' ? luc?.vung.find((v) => v.ma === tang.vung) : undefined
  const chang: ChangV | undefined = tang.t === 'dau' ? (vung?.chang.find((c) => c.ma === tang.chang) ?? vung?.chang.find((c) => c.trang_thai === 'yeu') ?? vung?.chang[0]) : undefined
  return (
    <div className="fixed inset-0" style={{ background: 'var(--sk-page)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      {tang.t === 'the_gioi' && (
        <>
          <TheGioiView banDo={MAU_BAN_DO} b={b} hienTai="C" onChon={(ma) => setTang({ t: 'luc_dia', luc: ma })} />
          <div className="pointer-events-none absolute left-0 right-0 top-0 p-3"><div className="pointer-events-auto"><DauTrangHS tieuDe="Thế giới Toán" phu="Bấm một lục địa để đi vào" /></div></div>
        </>
      )}
      {tang.t === 'luc_dia' && luc && <LucDiaView luc={luc} b={b} onChon={(v) => setTang({ t: 'chang', luc: luc.ma, vung: v })} onVe={() => setTang({ t: 'the_gioi' })} />}
      {tang.t === 'chang' && luc && vung && <ChangView luc={luc} vung={vung} b={b} onVe={() => setTang({ t: 'luc_dia', luc: luc.ma })} onVao={(c) => setTang({ t: 'dau', luc: luc.ma, vung: vung.ma, chang: c.ma })} />}
      <ChanDoan />
      {tang.t === 'dau' && luc && vung && chang && <XemDau luc={luc} chang={chang} b={b} onRut={() => setTang({ t: 'chang', luc: luc.ma, vung: vung.ma })} />}
    </div>
  )
}
