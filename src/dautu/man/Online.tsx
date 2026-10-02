// Tìm trận · Phòng thách đấu · Danh sách online · Lời mời.
import { useEffect, useRef, useState } from 'react'
import type { CapDo } from '../data/kho'
import { tenChuDe } from '../data/kho'
import { guiLoiMoi, huyTim, khoSanh, moPhong, timTran, traLoiMoi, datTrangThai, type GhepTran, type LoiMoi, type PhienMang, type ThanhVienSanh } from '../lib/mang'
import type { NguoiTran } from '../lib/trongTai'
import { maSo } from '../lib/tienich'
import { coMang } from '../lib/sb'
import { Avatar, DauMan, Modal, Nut, chepVao, toast } from '../ui/Chung'
import { ManDau } from './ManDau'

export function useSanh() {
  const [s, setS] = useState(khoSanh.lay())
  useEffect(() => khoSanh.nghe(setS), [])
  return s
}

const TEN_TT = { ranh: 'Rảnh', tim: 'Đang tìm trận', dau: 'Đang đấu' }

export function TimTran({ chuDe, capDo, onGhep, onBot, onLui }: { chuDe: string; capDo: CapDo; onGhep: (g: GhepTran) => void; onBot: () => void; onLui: () => void }) {
  const sanh = useSanh()
  const [giay, setGiay] = useState(0)
  useEffect(() => {
    timTran(chuDe, capDo, onGhep)
    const h = setInterval(() => setGiay((g) => g + 1), 1000)
    return () => { clearInterval(h); huyTim() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const dangTim = sanh.online.filter((x) => x.tt === 'tim').length
  return (
    <div className="man man-giua">
      <div className="tim-tran giay">
        <div className="radar"><span /><span /><span /><div className="radar-icon">⚔️</div></div>
        <h2>ĐANG TÌM ĐỐI THỦ…</h2>
        <p>Chủ đề: <b>{tenChuDe(chuDe)}</b> · {giay}s</p>
        <p className="mo">{sanh.ketNoi ? <>🟢 {sanh.online.length} người online · {dangTim} người đang tìm trận</> : coMang ? 'Đang kết nối máy chủ…' : 'Không có mạng — chỉ chơi được với bot'}</p>
        {giay >= 12 && <p className="goi-y">Vắng người quá? Em có thể <b>luyện với bot</b> hoặc <b>thách đấu bạn</b> bằng mã phòng.</p>}
        <div className="hang-nut">
          <Nut mau="xam" onClick={onLui}>Huỷ tìm</Nut>
          {giay >= 12 && <Nut mau="xanh" onClick={onBot}>Đấu bot trong lúc chờ</Nut>}
        </div>
      </div>
    </div>
  )
}

export function PhongThachDau({ toi, chuDe, capDo, soCau, vaoSan, onLui }: {
  toi: NguoiTran; chuDe: string; capDo: CapDo; soCau: number; vaoSan?: { phong: string; laChu: boolean; moiAi?: string }; onLui: () => void
}) {
  const [phien, setPhien] = useState<PhienMang | null>(null)
  const [pha, setPha] = useState<'ket_noi' | 'cho' | 'dau' | 'loi'>('ket_noi')
  const [ma, setMa] = useState('')
  const [loi, setLoi] = useState('')
  const [daDau, setDaDau] = useState(false)
  const sanh = useSanh()
  const ref = useRef<PhienMang | null>(null)

  const mo = (phong: string, laChu: boolean) => {
    ref.current?.roi()
    const p = moPhong({ phong, laChu, toi, chuDe, capDo, soCau })
    ref.current = p
    setPhien(p)
    datTrangThai('dau')
    p.ttPhong.nghe((t) => { setPha(t.pha); setLoi(t.loi); if (t.pha === 'dau') setDaDau(true) })
    return p
  }
  useEffect(() => {
    if (vaoSan) {
      mo(vaoSan.phong, vaoSan.laChu)
      if (vaoSan.moiAi) guiLoiMoi(vaoSan.moiAi, { phong: vaoSan.phong, chuDe, capDo, loai: 'tran' })
    }
    return () => { ref.current?.roi(); datTrangThai('ranh') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phien && (pha === 'dau' || daDau)) return <ManDau phien={phien} nhanCheDo="Đấu online" onThoat={onLui} />

  if (phien) {
    const link = `${location.origin}${location.pathname}?phong=${phien.phong}&cd=${chuDe}&cap=${capDo}`
    return (
      <div className="man man-giua">
        <div className="tim-tran giay">
          <h2>{phien.laChu ? 'PHÒNG ĐẤU CỦA EM' : 'ĐANG VÀO PHÒNG…'}</h2>
          {phien.laChu && <div className="ma-phong" onClick={() => chepVao(phien.phong)}>{phien.phong.split('').map((c, i) => <span key={i}>{c}</span>)}</div>}
          <p>Chủ đề: <b>{tenChuDe(chuDe)}</b></p>
          {pha === 'loi' ? <p className="loi">{loi}</p> : <p className="mo"><span className="cham-nhay" /> {phien.laChu ? 'Chờ đối thủ vào phòng…' : 'Đang kết nối chủ phòng…'}</p>}
          {phien.laChu && (
            <div className="hang-nut">
              <Nut mau="lam" onClick={() => chepVao(phien.phong)}>Sao chép mã</Nut>
              <Nut mau="lam" onClick={() => chepVao(link)}>Sao chép link</Nut>
            </div>
          )}
          {phien.laChu && <DanhSachOnline sanh={sanh.online} toi={toi.ma} nhan="Mời" onChon={(x) => { guiLoiMoi(x.ma, { phong: phien.phong, chuDe, capDo, loai: 'tran' }); toast(`Đã mời ${x.ten}`, 'ok') }} />}
          <Nut mau="xam" onClick={onLui}>Rời phòng</Nut>
        </div>
      </div>
    )
  }

  return (
    <div className="man">
      <DauMan tieuDe="Phòng đấu online" phu={<>Chủ đề: <b>{tenChuDe(chuDe)}</b></>} onLui={onLui} />
      <div className="luoi-2">
        <div className="giay o-phong">
          <h3>Tạo phòng mới</h3>
          <p>Em làm chủ phòng, nhận mã 6 số để gửi bạn.</p>
          <Nut mau="xanh" to onClick={() => mo(maSo(6), true)}>Tạo phòng ngay</Nut>
        </div>
        <div className="giay o-phong">
          <h3>Nhập mã phòng</h3>
          <input className="o-nhap ma" inputMode="numeric" maxLength={64} placeholder="Nhập 6 số hoặc dán link…" value={ma}
            onChange={(e) => setMa(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') vaoMa() }} />
          <Nut mau="lam" to onClick={vaoMa} disabled={!/\d{6}/.test(ma)}>Vào phòng</Nut>
        </div>
      </div>
      <div className="giay o-phong">
        <h3>Bạn đang online</h3>
        <DanhSachOnline sanh={sanh.online} toi={toi.ma} nhan="Thách đấu" onChon={(x) => {
          const phong = maSo(6)
          mo(phong, true)
          guiLoiMoi(x.ma, { phong, chuDe, capDo, loai: 'tran' })
          toast(`Đã gửi lời thách đấu tới ${x.ten}`, 'ok')
        }} />
      </div>
    </div>
  )

  function vaoMa() {
    const m = ma.match(/(\d{6})/)
    if (m) mo(m[1], false)
  }
}

export function DanhSachOnline({ sanh, toi, nhan, onChon }: { sanh: ThanhVienSanh[]; toi: string; nhan: string; onChon: (x: ThanhVienSanh) => void }) {
  const ds = sanh.filter((x) => x.ma !== toi)
  if (!ds.length) return <p className="mo">Chưa có ai khác online. Gửi mã phòng cho bạn nhé!</p>
  return (
    <div className="ds-online">
      {ds.map((x) => (
        <div key={x.ma} className="dong-online">
          <Avatar nv={x.nv} co={40} />
          <div className="dong-online-chu"><b>{x.ten}</b><small>Lv.{x.cap} · <span className={'tt-' + x.tt}>{TEN_TT[x.tt]}</span></small></div>
          <Nut mau="tim" disabled={x.tt === 'dau'} onClick={() => onChon(x)}>{nhan}</Nut>
        </div>
      ))}
    </div>
  )
}

export function ModalOnline({ toi, onThachDau, onDong }: { toi: string; onThachDau: (x: ThanhVienSanh) => void; onDong: () => void }) {
  const sanh = useSanh()
  return (
    <Modal tieuDe={<>🟢 Đang online ({sanh.online.length})</>} onDong={onDong}>
      {!sanh.ketNoi && <p className="mo">{coMang ? 'Đang kết nối…' : 'Không có mạng'}</p>}
      <DanhSachOnline sanh={sanh.online} toi={toi} nhan="Thách đấu" onChon={onThachDau} />
    </Modal>
  )
}

export function HopLoiMoi({ onNhan }: { onNhan: (m: LoiMoi) => void }) {
  const sanh = useSanh()
  const [bay, setBay] = useState(Date.now())
  useEffect(() => { const h = setInterval(() => setBay(Date.now()), 500); return () => clearInterval(h) }, [])
  useEffect(() => {
    if (sanh.tuChoi) { toast(sanh.tuChoi, 'loi'); khoSanh.dat((k) => ({ ...k, tuChoi: null })) }
  }, [sanh.tuChoi])
  const con = sanh.loiMoi.filter((m) => m.han > bay)
  if (!con.length) return null
  return (
    <div className="hop-moi">
      {con.map((m) => (
        <div key={m.tu.ma + m.phong} className="loi-moi giay">
          <Avatar nv={m.tu.nv} co={48} />
          <div className="loi-moi-chu">
            <b>{m.loai === 'giai' ? 'MỜI VÀO GIẢI ĐẤU!' : 'LỜI MỜI THÁCH ĐẤU!'}</b>
            <span><b>{m.tu.ten}</b> {m.loai === 'giai' ? 'mời em vào giải 8 người' : 'mời em đấu từ vựng'} · {tenChuDe(m.chuDe)}</span>
            <small>Hết hạn sau {Math.ceil((m.han - bay) / 1000)} giây</small>
          </div>
          <div className="loi-moi-nut">
            <Nut mau="xanh" onClick={() => { traLoiMoi(m, true); onNhan(m) }}>Chấp nhận</Nut>
            <Nut mau="xam" onClick={() => traLoiMoi(m, false)}>Từ chối</Nut>
          </div>
        </div>
      ))}
    </div>
  )
}
