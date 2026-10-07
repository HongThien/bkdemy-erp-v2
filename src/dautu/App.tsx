// BK ĐẤU TỪ — khung game học 6 chế độ cho MỌI MÔN (demo, Thùy 02–03/10): Anh (từ vựng) · Toán · KHTN (kho MCQ thật). Bố cục học theo
// Bufopia; hình theo skin RPG + bộ chiến đấu 2D Đấu trường. Content cắm qua nguon/ (registry môn).
import { useEffect, useMemo, useState } from 'react'
import { DS_MON, NGUON, khoCap, khoMon, nguonCua, useCap, useMon } from './nguon'
import { KHOI_NHUNG, MON_NHUNG, VAO_NHUNG, baoThoat } from './lib/nhung'
import { useHoSo, tuYeu, tuDenHan } from './lib/hoSo'
import { taiHoSo, bangXepHang, type DongBxh } from './lib/api'
import { khoCaiDat, useCaiDat, phat } from './lib/amThanh'
import { vaoSanh, capNhatToiSanh, guiLoiMoi, type LoiMoi, type ThongTinTran, type ThanhVienSanh } from './lib/mang'
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
import { HINH_GAME } from './hinhGame'

type Man =
  | { ten: 'home' }
  | { ten: 'chu_de' }
  | { ten: 'che_do'; chuDe: string; tenChuDe: string }
  | { ten: 'tran'; phien: PhienDau; nhan: string }
  | { ten: 'tim'; tran: ThongTinTran }
  | { ten: 'phong'; tran: ThongTinTran; vao?: { phong: string; laChu: boolean; moiAi?: string } }
  | { ten: 'giai'; tran: ThongTinTran; vao?: { code: string; laChu: boolean } }
  | { ten: 'noi_tu'; phong?: string }
  | { ten: 'goc' }
  | { ten: 'thap' }
type HopThoai = null | 'ho_so' | 'bxh' | 'cai_dat' | 'online'

// Nhúng trong app HS: lib/nhung.ts. Đặt môn + khối của em ngay khi nạp.
{ const m = MON_NHUNG, k = KHOI_NHUNG; if (m && NGUON[m]) { khoMon.dat(m); if (k && !NGUON[m].coNhoTu) khoCap.dat((x) => ({ ...x, [m]: k })) /* môn theo KHỐI (kho DB); Anh lọc theo cấp độ từ, không theo lớp */ } }

function docLinkMoi(): Man | null {
  const q = new URLSearchParams(location.search)
  const ng = nguonCua(q.get('mon'))
  const tran = (soCau: number): ThongTinTran => ({ mon: ng.mon, cap: q.get('cap') ?? ng.capMacDinh, chuDe: q.get('cd') ?? 'tron', tenChuDe: q.get('tcd') ?? 'Trộn tất cả', soCau })
  if (q.get('phong')) return { ten: 'phong', tran: tran(15), vao: { phong: q.get('phong')!, laChu: false } }
  if (q.get('giai')) return { ten: 'giai', tran: tran(10), vao: { code: q.get('giai')!, laChu: false } }
  if (q.get('noitu')) return { ten: 'noi_tu', phong: q.get('noitu')! }
  return null
}

export default function App() {
  const h = useHoSo()
  const [man, setMan] = useState<Man>(VAO_NHUNG ? { ten: VAO_NHUNG } : { ten: 'home' })
  const [hop, setHop] = useState<HopThoai>(null)
  const nguon = useMon()
  const [cap, setCap] = useCap(nguon)
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
  const veNha = () => (VAO_NHUNG ? (man.ten === VAO_NHUNG ? baoThoat() : setMan({ ten: VAO_NHUNG })) : setMan({ ten: 'home' }))

  const chonCheDo = (chuDe: string, tenChuDe: string, c: LuaChonCheDo) => {
    if (!toi) return
    const uuTien = nguon.coNhoTu ? [...tuYeu(h.nho), ...tuDenHan(h.nho)] : undefined
    const cauHinh = { cap, chuDe, soCau: c.soCau, uuTien }
    const tran: ThongTinTran = { mon: nguon.mon, cap, chuDe, tenChuDe, soCau: c.soCau }
    if (c.loai === 'bot') setMan({ ten: 'tran', nhan: 'Luyện với bot', phien: phienBot({ toi, nguon, cauHinh, tenChuDe, muc: c.muc }) })
    else if (c.loai === 'doi') setMan({ ten: 'tran', nhan: '2 người 1 máy', phien: phienDoi({ toi, ban: { ma: 'p2', ten: 'Người chơi 2', nv: db?.nv === 'tham_hiem_nu' ? 'tham_hiem_nam' : 'tham_hiem_nu' }, nguon, cauHinh, tenChuDe }) })
    else if (c.loai === 'tim') setMan({ ten: 'tim', tran })
    else if (c.loai === 'phong') setMan({ ten: 'phong', tran })
    else setMan({ ten: 'giai', tran: { ...tran, soCau: Math.min(c.soCau, 10) } })
  }

  const layTran = (m: ThongTinTran): ThongTinTran => ({ mon: m.mon, cap: m.cap, chuDe: m.chuDe, tenChuDe: m.tenChuDe, soCau: m.soCau })
  const nhanLoiMoi = (m: LoiMoi) => {
    if (m.loai === 'giai') setMan({ ten: 'giai', tran: layTran(m), vao: { code: m.phong, laChu: false } })
    else setMan({ ten: 'phong', tran: layTran(m), vao: { phong: m.phong, laChu: false } })
  }
  const thachDau = (x: ThanhVienSanh) => {
    setHop(null)
    const phong = maSo(6)
    setMan({ ten: 'phong', tran: { mon: nguon.mon, cap, chuDe: 'tron', tenChuDe: 'Trộn tất cả', soCau: 15 }, vao: { phong, laChu: true, moiAi: x.ma } })
    toast(`Đã gửi lời thách đấu tới ${x.ten}`, 'ok')
    void guiLoiMoi
  }

  let noiDung: React.ReactNode
  if (!toi) noiDung = <Home onDi={() => {}} />
  else switch (man.ten) {
    case 'home': noiDung = <Home onDi={(d) => setMan(d === 'dau' ? { ten: 'chu_de' } : d === 'giai' ? { ten: 'giai', tran: { mon: nguon.mon, cap, chuDe: 'tron', tenChuDe: 'Trộn tất cả', soCau: 10 } } : d === 'noi_tu' ? { ten: 'noi_tu' } : d === 'thap' ? { ten: 'thap' } : { ten: 'goc' })} />; break
    case 'chu_de': noiDung = <ChonChuDe nguon={nguon} cap={cap} setCap={setCap} onChon={(chuDe, tenChuDe) => setMan({ ten: 'che_do', chuDe, tenChuDe })} onLui={veNha} />; break
    case 'che_do': noiDung = <ChonCheDo nguon={nguon} tenChuDe={man.tenChuDe} onChon={(c) => chonCheDo(man.chuDe, man.tenChuDe, c)} onLui={() => setMan({ ten: 'chu_de' })} />; break
    case 'tran': noiDung = <ManDau key={man.phien.chuDe + man.nhan} phien={man.phien} nhanCheDo={man.nhan} onThoat={() => { man.phien.roi(); veNha() }} />; break
    case 'tim': { const tr = man.tran; noiDung = <TimTran tran={tr} onLui={veNha}
      onGhep={(g) => setMan({ ten: 'phong', tran: layTran(g), vao: { phong: g.phong, laChu: g.laChu } })}
      onBot={() => toi && setMan({ ten: 'tran', nhan: 'Luyện với bot', phien: phienBot({ toi, nguon: nguonCua(tr.mon), cauHinh: { cap: tr.cap, chuDe: tr.chuDe, soCau: tr.soCau }, tenChuDe: tr.tenChuDe, muc: 'vua' }) })} />; break }
    case 'phong': noiDung = <PhongThachDau key={man.vao?.phong ?? 'moi'} toi={toi} tran={man.tran} vaoSan={man.vao} onLui={veNha} />; break
    case 'giai': noiDung = <ManGiai key={man.vao?.code ?? 'moi'} toi={toi} tran={man.tran} vaoSan={man.vao} onLui={veNha} />; break
    case 'noi_tu': noiDung = <ManNoiTu toi={toi} vaoPhong={man.phong} onLui={veNha} />; break
    case 'goc': noiDung = <GocLuyen onLui={veNha} />; break
    case 'thap': noiDung = <ManLeoThap toi={toi} nguon={nguon} cap={cap} setCap={setCap} onLui={veNha} />; break
  }
  const trongTran = man.ten === 'tran' || man.ten === 'phong' || man.ten === 'giai'

  return (
    <div className="app-dautu" style={{ backgroundImage: `url(${HINH_GAME.nenMenu})` }}>
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
  const nguon = useMon()
  const canOn = useMemo(() => tuYeu(h.nho).length + tuDenHan(h.nho).length, [h.nho])
  const tatCa = [
    { id: 'dau' as const, icon: HINH_GAME.icon.dau, tieu: nguon.coNhoTu ? 'Đấu từ vựng' : `Đấu ${nguon.ten}`, mo: nguon.coNhoTu ? 'Chọn chủ đề, đấu bot hoặc đấu online — ai đúng trước ăn từ!' : 'Chọn khối và chủ đề, đấu bot hoặc đấu online — ai đúng trước ăn điểm!', nut: 'Chọn chủ đề', mau: 'xanh' },
    { id: 'giai' as const, icon: HINH_GAME.icon.giai, tieu: 'Giải đấu 8 người', mo: 'Tứ kết → Bán kết → Chung kết, đấu trực tiếp chọn nhà vô địch.', nut: 'Vào giải', mau: 'vang' },
    { id: 'thap' as const, icon: HINH_GAME.icon.thap, tieu: 'Leo tháp', mo: 'Tháp hôm nay: Sinh tồn 5 phút hoặc Vô tận — cả trường đua bảng xếp hạng!', nut: 'Leo tháp', mau: 'do' },
    { id: 'noi_tu' as const, icon: HINH_GAME.icon.noi_tu, tieu: 'Nối từ', mo: 'Nối từ tự do, nghe phát âm và học cách dùng từ trong ngữ cảnh!', nut: 'Chơi nối từ', mau: 'tim' },
    { id: 'goc' as const, icon: HINH_GAME.icon.goc, tieu: 'Góc luyện tập', mo: 'Ôn từ yếu, thẻ ghi nhớ, tiến độ học tập và góp từ mới.', nut: canOn ? `Ôn ${canOn} từ` : 'Vào luyện tập', mau: 'lam' },
  ]
  // Nối từ + Góc luyện tập là phần riêng của môn Anh (sổ nhớ từ) — không thuộc khung 6 chế độ
  const the = tatCa.filter((t) => nguon.coNhoTu || (t.id !== 'noi_tu' && t.id !== 'goc'))
  return (
    <div className="home">
      <div className="bang-ten">
        <div className="bang-ten-chu">BK ĐẤU TỪ</div>
        <div className="bang-ten-phu">⚔️ VOCABULARY BATTLE ⚔️</div>
      </div>
      <div className="chon-mon">
        {DS_MON.map((m) => (
          <button key={m} className={'chip mon' + (nguon.mon === m ? ' bat' : '')} onClick={() => { phat('click'); khoMon.dat(m) }}>
            <b>{NGUON[m].icon} {NGUON[m].ten}</b>
          </button>
        ))}
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
      <img src={HINH_GAME.linhVat.nu} alt="" className="linh-vat trai" />
      <img src={HINH_GAME.linhVat.nam} alt="" className="linh-vat phai" />
    </div>
  )
}
