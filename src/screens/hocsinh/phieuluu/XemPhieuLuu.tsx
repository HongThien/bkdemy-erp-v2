// TRANG XEM THỬ bản đồ phiêu lưu (hs.html?xem=phieu_luu): dữ liệu giả cùng hình dạng hợp đồng, không gọi DB, không cần đăng nhập.
// Dùng để soi cảnh 3D ở 1180×820 / 1440×900 / 390×844 trước khi nối dữ liệu thật (spec-v1-app-hs.md §13.3 việc 1).
// Mở thẳng một tầng: &tang=luc_dia&luc=C · &tang=chang&luc=C&vung=C1 (+ &nd=N số dạng, &biome=… vùng) · mặc định bản 2D; &ban=3d để so với bản 3D cũ · &gioi=nu
import { useState } from 'react'
import { laySkin } from '../skin/registry'
import { GD_MAC_DINH, DauTrangHS } from '../skin/KhungHS'
import { MAU_BAN_DO as MAU, banDoNhieu } from './mau'
import { tuBanDoPL, type BanDoV } from './kieu'
import { TheGioiView } from './TheGioiView'
import { LucDiaView } from './LucDiaView'
import { ChangView } from './ChangView'
import { TheGioi2D } from './ban2d/TheGioi2D'
import { ganBiomeTheoTranh } from './ban2d/hinh2d'
import { LucDia2D } from './ban2d/LucDia2D'
import { Chang2D } from './ban2d/Chang2D'
import { XemDau } from './XemDau'
import { ChanDoan } from './ChanDoan'
import { BaoDoHoa, NutDoHoa } from './DoHoa'
import type { ChangV, LucDiaV } from './kieu'
import type { NvId } from '../skin/nhanVat'

// Chỉ khi chạy dev: dán JSON thật của fn_ban_do_phieu_luu vào localStorage 'ban_do_pl' để soi dữ liệu thật qua bộ đổi tuBanDoPL.
// &so=N: chỉ lấy N chủ đề đầu (thử bản đồ toàn cảnh với khối ít chủ đề)
function layBanDo(): BanDoV {
  const q = new URLSearchParams(location.search), bd = layBanDoGoc(), so = Number(q.get('so'))
  const kq = ganBiomeTheoTranh(so > 0 ? { ...bd, luc_dia: bd.luc_dia.slice(0, so) } : bd), ep = q.get('biome') // &biome=rung|thanh_co|anh_dao…: ép mọi lục địa theo 1 biome (soi kit)
  const nv = Number(q.get('nv')) // &nv=N: mỗi lục địa có đúng N chuyên đề (nhân bản) — soi kit với 6/8 mốc
  const nhan = (l: LucDiaV) => (nv > 0 ? { ...l, vung: Array.from({ length: nv }, (_, i) => ({ ...l.vung[i % l.vung.length], ma: `${l.vung[i % l.vung.length].ma}_${i}`, ten: i < l.vung.length ? l.vung[i].ten : `${l.vung[i % l.vung.length].ten} (${i + 1})` })) } : l)
  const nd = Number(q.get('nd')) // &nd=N: mỗi chuyên đề có đúng N dạng (nhân bản, trạng thái xoay vòng) — soi tầng dạng cuộn ngang
  const nhanDang = (l: LucDiaV): LucDiaV => (nd > 0 ? { ...l, vung: l.vung.map((v) => ({ ...v, chang: Array.from({ length: nd }, (_, i) => ({ ...v.chang[i % v.chang.length], ma: `${v.chang[i % v.chang.length].ma}_${i}`, trang_thai: i < nd * 0.4 ? 'dat' as const : i < nd * 0.5 ? 'yeu' as const : 'chua_do' as const })) })) } : l)
  return { ...kq, luc_dia: kq.luc_dia.map((l) => nhanDang(nhan(ep ? { ...l, biome: ep } : l))) }
}
function layBanDoGoc(): BanDoV {
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
  const ba = q.get('ban') === '3d', gioi = q.get('gioi') === 'nu' ? 'nu' : 'nam'
  const TG = ba ? TheGioiView : TheGioi2D, LD = ba ? LucDiaView : LucDia2D, CH = ba ? ChangView : Chang2D
  const luc = tang.t !== 'the_gioi' ? MAU_BAN_DO.luc_dia.find((l) => l.ma === tang.luc) : undefined
  const vung = tang.t === 'chang' || tang.t === 'dau' ? luc?.vung.find((v) => v.ma === tang.vung) : undefined
  const chang: ChangV | undefined = tang.t === 'dau' ? (vung?.chang.find((c) => c.ma === tang.chang) ?? vung?.chang.find((c) => c.trang_thai === 'yeu') ?? vung?.chang[0]) : undefined
  return (
    <div className="fixed inset-0" style={{ background: 'var(--sk-page)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      {tang.t === 'the_gioi' && (
        <>
          <TG banDo={MAU_BAN_DO} b={b} gioi={gioi} hienTai="C" onChon={(ma) => setTang({ t: 'luc_dia', luc: ma })} />
          <div className="pointer-events-none absolute left-0 right-0 top-0 p-3"><div className="pointer-events-auto"><DauTrangHS tieuDe="Thế giới Toán" phu="Bấm một lục địa để đi vào" onBack={() => history.back()} /></div></div>
        </>
      )}
      {tang.t === 'luc_dia' && luc && <LD luc={luc} b={b} gioi={gioi} onChon={(v) => setTang({ t: 'chang', luc: luc.ma, vung: v })} onVe={() => setTang({ t: 'the_gioi' })} />}
      {tang.t === 'chang' && luc && vung && <CH luc={luc} vung={vung} b={b} gioi={gioi} onVe={() => setTang({ t: 'luc_dia', luc: luc.ma })} onVao={(c) => setTang({ t: 'dau', luc: luc.ma, vung: vung.ma, chang: c.ma })} />}
      <ChanDoan />
      {tang.t !== 'dau' && <div className="pointer-events-none absolute bottom-3 right-3 z-20"><NutDoHoa /></div>}
      <BaoDoHoa />
      {tang.t === 'dau' && luc && vung && chang && <XemDau luc={luc} chang={chang} b={b} nv={(q.get('nvc') as NvId | null) ?? gioi} onRut={() => setTang({ t: 'chang', luc: luc.ma, vung: vung.ma })} />}
    </div>
  )
}
