// BK ĐẤU TỪ — game đấu từ vựng tiếng Anh (demo, Thùy 02/10). Bố cục học theo Bufopia; hình theo skin RPG + nhân vật KayKit.
import { useEffect, useMemo, useState } from 'react'
import type { CapDo } from './data/kho'
import { tenChuDe } from './data/kho'
import { useHoSo, tuYeu, tuDenHan } from './lib/hoSo'
import { taiHoSo, bangXepHang, type DongBxh } from './lib/api'
import { khoCaiDat, useCaiDat, phat } from './lib/amThanh'
import { vaoSanh, capNhatToiSanh, guiLoiMoi, type LoiMoi, type ThanhVienSanh } from './lib/mang'
import { phienBot, phienDoi, type PhienDau } from './lib/phien'
import type { NguoiTran } from './lib/trongTai'
import { maSo } from './lib/tienich'
import { Avatar, Toast, toast } from './ui/Chung'
import { ChonCheDo, ChonChuDe, type LuaChonCheDo } from './man/ChonTran'
import { ManDau } from './man/ManDau'
import { HopLoiMoi, ModalOnline, PhongThachDau, TimTran, useSanh } from './man/Online'
import { ManGiai } from './man/Giai'
import { ManNoiTu } from './man/NoiTu'
import { GocLuyen } from './man/GocLuyen'
import { ManLeoThap } from './man/LeoThap'
import { BxhModal, CaiDatModal, HoSoModal, TaoNhanVat } from './man/HopThoai'
import './dautu.css'

type Man =
  | { ten: 'home' }
  | { ten: 'chu_de' }
  | { ten: 'che_do'; chuDe: string }
  | { ten: 'tran'; phien: PhienDau; nhan: string }
  | { ten: 'tim'; chuDe: string; soCau: number }
  | { ten: 'phong'; chuDe: string; capDo: CapDo; soCau: number; vao?: { phong: string; laChu: boolean; moiAi?: string } }
  | { ten: 'giai'; chuDe: string; capDo: CapDo; soCau: number; vao?: { code: string; laChu: boolean } }
  | { ten: 'noi_tu'; phong?: string }
  | { ten: 'goc' }
  | { ten: 'thap' }
type HopThoai = null | 'ho_so' | 'bxh' | 'cai_dat' | 'online'

function docLinkMoi(): Man | null {
  const q = new URLSearchParams(location.search)
  const cd = q.get('cd') ?? 'auto'
  const cap = (q.get('cap') ?? 'tat_ca') as CapDo
  if (q.get('phong')) return { ten: 'phong', chuDe: cd, capDo: cap, soCau: 15, vao: { phong: q.get('phong')!, laChu: false } }
  if (q.get('giai')) return { ten: 'giai', chuDe: cd, capDo: cap, soCau: 10, vao: { code: q.get('giai')!, laChu: false } }
  if (q.get('noitu')) return { ten: 'noi_tu', phong: q.get('noitu')! }
  return null
}

export default function App() {
  const h = useHoSo()
  const [man, setMan] = useState<Man>({ ten: 'home' })
  const [hop, setHop] = useState<HopThoai>(null)
  const [capDo, setCapDo] = useState<CapDo>('tat_ca')
  const [linkCho, setLinkCho] = useState<Man | null>(() => docLinkMoi())
  const db = h.db

  useEffect(() => { void taiHoSo() }, [])
  useEffect(() => {
    if (!db) return
    vaoSanh({ ma: db.ma, ten: db.ten, nv: db.nv, cap: db.cap })
    capNhatToiSanh({ ten: db.ten, nv: db.nv, cap: db.cap })
  }, [db?.ma, db?.ten, db?.nv, db?.cap])
  // link mời (?phong= / ?giai= / ?noitu=) mở sau khi đã có nhân vật
  useEffect(() => {
    if (db && linkCho) { setMan(linkCho); setLinkCho(null); history.replaceState(null, '', location.pathname) }
  }, [db, linkCho])

  const toi: NguoiTran | null = db ? { ma: db.ma, ten: db.ten, nv: db.nv, cap: db.cap } : null
  const veNha = () => setMan({ ten: 'home' })

  const chonCheDo = (chuDe: string, c: LuaChonCheDo) => {
    if (!toi) return
    const uuTien = [...tuYeu(h.nho), ...tuDenHan(h.nho)]
    if (c.loai === 'bot') setMan({ ten: 'tran', nhan: 'Luyện với bot', phien: phienBot({ toi, chuDe, capDo, soCau: c.soCau, muc: c.muc, uuTien }) })
    else if (c.loai === 'doi') setMan({ ten: 'tran', nhan: '2 người 1 máy', phien: phienDoi({ toi, ban: { ma: 'p2', ten: 'Người chơi 2', nv: db?.nv === 'tham_hiem_nu' ? 'tham_hiem_nam' : 'tham_hiem_nu' }, chuDe, capDo, soCau: c.soCau }) })
    else if (c.loai === 'tim') setMan({ ten: 'tim', chuDe, soCau: c.soCau })
    else if (c.loai === 'phong') setMan({ ten: 'phong', chuDe, capDo, soCau: c.soCau })
    else setMan({ ten: 'giai', chuDe, capDo, soCau: c.soCau })
  }

  const nhanLoiMoi = (m: LoiMoi) => {
    if (m.loai === 'giai') setMan({ ten: 'giai', chuDe: m.chuDe, capDo: m.capDo, soCau: 10, vao: { code: m.phong, laChu: false } })
    else setMan({ ten: 'phong', chuDe: m.chuDe, capDo: m.capDo, soCau: 15, vao: { phong: m.phong, laChu: false } })
  }
  const thachDau = (x: ThanhVienSanh) => {
    setHop(null)
    const phong = maSo(6)
    setMan({ ten: 'phong', chuDe: 'auto', capDo, soCau: 15, vao: { phong, laChu: true, moiAi: x.ma } })
    toast(`Đã gửi lời thách đấu tới ${x.ten}`, 'ok')
    void guiLoiMoi
  }

  let noiDung: React.ReactNode
  if (!toi) noiDung = <Home onDi={() => {}} />
  else switch (man.ten) {
    case 'home': noiDung = <Home onDi={(d) => setMan(d === 'dau' ? { ten: 'chu_de' } : d === 'giai' ? { ten: 'giai', chuDe: 'tron', capDo, soCau: 10 } : d === 'noi_tu' ? { ten: 'noi_tu' } : d === 'thap' ? { ten: 'thap' } : { ten: 'goc' })} />; break
    case 'chu_de': noiDung = <ChonChuDe capDo={capDo} setCapDo={setCapDo} onChon={(chuDe) => setMan({ ten: 'che_do', chuDe })} onLui={veNha} />; break
    case 'che_do': noiDung = <ChonCheDo tenChuDe={tenChuDe(man.chuDe)} onChon={(c) => chonCheDo(man.chuDe, c)} onLui={() => setMan({ ten: 'chu_de' })} />; break
    case 'tran': noiDung = <ManDau key={man.phien.chuDe + man.nhan} phien={man.phien} nhanCheDo={man.nhan} onThoat={() => { man.phien.roi(); veNha() }} />; break
    case 'tim': noiDung = <TimTran chuDe={man.chuDe} capDo={capDo} onLui={veNha}
      onGhep={(g) => setMan({ ten: 'phong', chuDe: g.chuDe, capDo: g.capDo, soCau: man.soCau, vao: { phong: g.phong, laChu: g.laChu } })}
      onBot={() => toi && setMan({ ten: 'tran', nhan: 'Luyện với bot', phien: phienBot({ toi, chuDe: man.chuDe, capDo, soCau: man.soCau, muc: 'vua' }) })} />; break
    case 'phong': noiDung = <PhongThachDau key={man.vao?.phong ?? 'moi'} toi={toi} chuDe={man.chuDe} capDo={man.capDo} soCau={man.soCau} vaoSan={man.vao} onLui={veNha} />; break
    case 'giai': noiDung = <ManGiai key={man.vao?.code ?? 'moi'} toi={toi} chuDe={man.chuDe} capDo={man.capDo} soCau={man.soCau} vaoSan={man.vao} onLui={veNha} />; break
    case 'noi_tu': noiDung = <ManNoiTu toi={toi} vaoPhong={man.phong} onLui={veNha} />; break
    case 'goc': noiDung = <GocLuyen onLui={veNha} />; break
    case 'thap': noiDung = <ManLeoThap toi={toi} onLui={veNha} />; break
  }
  const trongTran = man.ten === 'tran' || man.ten === 'phong' || man.ten === 'giai'

  return (
    <div className="app-dautu" style={{ backgroundImage: 'url(/bk-ui/hs/skin/rpg/bg_lau_dai_chibi_ngang.jpg)' }}>
      <div className="app-mo" />
      {!(trongTran && man.ten === 'tran') && <ThanhTren onHop={setHop} laNha={man.ten === 'home'} />}
      <main className="app-than">{noiDung}</main>
      {!toi && <TaoNhanVat />}
      {toi && hop === 'ho_so' && <HoSoModal onDong={() => setHop(null)} />}
      {hop === 'bxh' && <BxhModal onDong={() => setHop(null)} />}
      {hop === 'cai_dat' && <CaiDatModal onDong={() => setHop(null)} />}
      {toi && hop === 'online' && <ModalOnline toi={toi.ma} onDong={() => setHop(null)} onThachDau={thachDau} />}
      {toi && <HopLoiMoi onNhan={nhanLoiMoi} />}
      <Toast />
    </div>
  )
}

function ThanhTren({ onHop, laNha }: { onHop: (h: HopThoai) => void; laNha: boolean }) {
  const h = useHoSo()
  const cd = useCaiDat()
  const sanh = useSanh()
  const [top, setTop] = useState<DongBxh[]>([])
  useEffect(() => {
    if (!laNha) return
    const tai = () => bangXepHang('xp').then((r) => setTop(r?.top.slice(0, 3) ?? [])).catch(() => {})
    tai()
    const t = setInterval(tai, 60000)
    return () => clearInterval(t)
  }, [laNha])
  const db = h.db
  const pct = db?.can_cho_cap_sau ? (db.xp_trong_cap / db.can_cho_cap_sau) * 100 : 0
  return (
    <>
      {laNha && (
        <div className="bang-chay">
          <div className="bang-chay-trong">
            <span className="nhan-top">👑 TOP 3 VINH DANH</span>
            {top.length ? top.map((d, i) => <span key={d.ma}>#{i + 1} <b>{d.ten}</b> {d.gt} XP</span>) : <span>Ngôi đầu đang chờ người chinh phục!</span>}
            <span>Cùng học, cùng đấu, chinh phục ngôi đầu! 🏆</span>
          </div>
        </div>
      )}
      <header className="thanh-tren">
        <button className="the-toi" onClick={() => db && onHop('ho_so')}>
          <Avatar nv={db?.nv ?? 'knight'} co={46} />
          <div className="the-toi-chu">
            <div><b>{db?.ten ?? 'Chiến binh'}</b> <span className="cap">⭐ Lv.{db?.cap ?? 1}</span> <span className={'lua' + (db?.hoc_hom_nay ? ' sang' : '')}>🔥 {db?.chuoi_ngay ?? 0} ngày</span></div>
            <div className="thanh-xp"><div style={{ width: pct + '%' }} /></div>
            <small>{db?.xp_trong_cap ?? 0} / {db?.can_cho_cap_sau ?? 100} XP</small>
          </div>
        </button>
        <div className="nut-phai">
          <button className="nut-tron online" onClick={() => onHop('online')} title="Bạn đang online"><span className={'cham ' + (sanh.ketNoi ? 'xanh' : 'xam')} />{sanh.online.length}</button>
          <button className="nut-tron" onClick={() => onHop('bxh')} title="Bảng xếp hạng">🏆</button>
          <button className="nut-tron" onClick={() => { khoCaiDat.dat({ ...cd, amThanh: !cd.amThanh }); phat('click') }} title="Âm thanh">{cd.amThanh ? '🔊' : '🔇'}</button>
          <button className="nut-tron" onClick={() => onHop('cai_dat')} title="Cài đặt">⚙️</button>
        </div>
      </header>
    </>
  )
}

function Home({ onDi }: { onDi: (d: 'dau' | 'noi_tu' | 'goc' | 'giai' | 'thap') => void }) {
  const h = useHoSo()
  const canOn = useMemo(() => tuYeu(h.nho).length + tuDenHan(h.nho).length, [h.nho])
  const the = [
    { id: 'dau' as const, icon: '/bk-ui/hs/skin/rpg/o_tu_luyen.png', tieu: 'Đấu từ vựng', mo: 'Chọn chủ đề, đấu bot hoặc đấu online — ai đúng trước ăn từ!', nut: 'Chọn chủ đề', mau: 'xanh' },
    { id: 'giai' as const, icon: '/bk-ui/hs/skin/rpg/o_cup.png', tieu: 'Giải đấu 8 người', mo: 'Tứ kết → Bán kết → Chung kết, đấu trực tiếp chọn nhà vô địch.', nut: 'Vào giải', mau: 'vang' },
    { id: 'thap' as const, icon: '/bk-ui/hs/skin/rpg/o_rank.png', tieu: 'Leo tháp', mo: 'Tháp hôm nay: Sinh tồn 5 phút hoặc Vô tận — cả trường đua bảng xếp hạng!', nut: 'Leo tháp', mau: 'do' },
    { id: 'noi_tu' as const, icon: '/bk-ui/hs/skin/rpg/o_so_tay.png', tieu: 'Nối từ', mo: 'Nối từ tự do, nghe phát âm và học cách dùng từ trong ngữ cảnh!', nut: 'Chơi nối từ', mau: 'tim' },
    { id: 'goc' as const, icon: '/bk-ui/hs/skin/rpg/o_nhiem_vu.png', tieu: 'Góc luyện tập', mo: 'Ôn từ yếu, thẻ ghi nhớ, tiến độ học tập và góp từ mới.', nut: canOn ? `Ôn ${canOn} từ` : 'Vào luyện tập', mau: 'lam' },
  ]
  return (
    <div className="home">
      <div className="bang-ten">
        <div className="bang-ten-chu">BK ĐẤU TỪ</div>
        <div className="bang-ten-phu">⚔️ VOCABULARY BATTLE ⚔️</div>
      </div>
      <div className="luoi-home">
        {the.map((t) => (
          <button key={t.id} className={'the-home giay vien-' + t.mau} onClick={() => { phat('click'); onDi(t.id) }}>
            <div className="ghim" />
            <img src={t.icon} alt="" className="the-home-anh" />
            <h3>{t.tieu}</h3>
            <p>{t.mo}</p>
            <span className={'nut3d nut-' + t.mau}>{t.nut} ›</span>
          </button>
        ))}
      </div>
      <img src="/bk-ui/hs/skin/rpg/nv_nu_chibi.png" alt="" className="linh-vat trai" />
      <img src="/bk-ui/hs/skin/rpg/nv_nam_chibi.png" alt="" className="linh-vat phai" />
    </div>
  )
}
