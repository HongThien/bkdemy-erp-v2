// Chọn chủ đề → chọn chế độ (bot · 2 người 1 máy · tìm trận online · thách đấu · giải 8 người).
import { useEffect, useState } from 'react'
import type { CapNguon, ChuDeNguon, NguonCau } from '../nguon'
import { DauMan, Nut } from '../ui/Chung'
import { BOT } from '../lib/bot'
import { KHOI_NHUNG, NHUNG } from '../lib/nhung'
import { HUONG_DO, khoHuong, useHuong } from '../lib/boDe'
import type { MucBot } from '../lib/trongTai'

export function ChonChuDe({ nguon, cap, setCap, onChon, onLui }: { nguon: NguonCau; cap: string; setCap: (c: string) => void; onChon: (cd: string, ten: string) => void; onLui: () => void }) {
  const [dsCap, setDsCap] = useState<CapNguon[] | null>(null)
  const [dsCd, setDsCd] = useState<ChuDeNguon[] | null>(null)
  const [loi, setLoi] = useState('')
  useEffect(() => { setLoi(''); nguon.dsCap().then(setDsCap).catch((e) => setLoi((e as Error).message)) }, [nguon])
  useEffect(() => { setDsCd(null); nguon.dsChuDe(cap).then(setDsCd).catch((e) => setLoi((e as Error).message)) }, [nguon, cap])
  return (
    <div className="man">
      <DauMan tieuDe={<>{nguon.icon} {nguon.ten} — chọn nội dung</>} phu={nguon.coNhoTu ? 'Chọn một chủ đề hoặc để hệ thống trộn ngẫu nhiên' : 'Câu trắc nghiệm lấy từ kho câu đạt chuẩn của BK'} onLui={onLui} />
      {loi && <p className="loi bang-tin">{loi}</p>}
      {!(KHOI_NHUNG && !nguon.coNhoTu) && /* trong app HS: chỉ khối em đang học (Thùy 03/10) */ <div className="chip-hang cuon">
        <span className="nhan-hang">{nguon.tenCap}:</span>
        {(dsCap ?? []).map((c) => (
          <button key={c.id} className={'chip' + (cap === c.id ? ' bat' : '')} onClick={() => setCap(c.id)}>
            <b>{c.ten}</b>{c.mo && <small>{c.mo}</small>}
          </button>
        ))}
        {!dsCap && !loi && <span className="mo">Đang tải…</span>}
      </div>}
      <div className="luoi-chu-de">
        {!dsCd && !loi && <p className="mo">Đang tải chủ đề…</p>}
        {(dsCd ?? []).map((c) => (
          <button key={c.id} className={'o-chu-de' + (c.id === 'auto' || c.id === 'tron' ? ' dac-biet' : '')} style={{ ['--mau' as string]: c.mau ?? '#9b8cf0' }} onClick={() => onChon(c.id, c.ten)}>
            <span className="o-icon">{c.icon}</span><b>{c.ten}</b>{c.phu && <small>{c.phu}</small>}
          </button>
        ))}
      </div>
    </div>
  )
}

export type LuaChonCheDo =
  | { loai: 'bot'; muc: MucBot; soCau: number }
  | { loai: 'doi'; soCau: number }
  | { loai: 'tim'; soCau: number }
  | { loai: 'phong'; soCau: number }
  | { loai: 'giai'; soCau: number }

export function ChonCheDo({ nguon, tenChuDe, onChon, onLui }: { nguon: NguonCau; tenChuDe: string; onChon: (c: LuaChonCheDo) => void; onLui: () => void }) {
  const [soCau, setSoCau] = useState(15)
  const [muc, setMuc] = useState<MucBot>('vua')
  const huong = useHuong()
  return (
    <div className="man">
      <DauMan tieuDe="Chọn chế độ chơi" phu={<>{nguon.icon} {nguon.ten} · <b>{tenChuDe}</b> · {nguon.giayMoiCau} giây/câu</>} onLui={onLui}
        phai={<div className="chip-hang nho">{[10, 15, 20].map((n) => <button key={n} className={'chip' + (soCau === n ? ' bat' : '')} onClick={() => setSoCau(n)}><b>{n} {nguon.coNhoTu ? 'từ' : 'câu'}</b></button>)}</div>} />
      {nguon.coDaoChieu && <div className="kieu-do giay">
        <b>Kiểu đố:</b>
        <div className="chip-hang nho">
          {HUONG_DO.map((h) => <button key={h.id} className={'chip' + (huong === h.id ? ' bat' : '')} onClick={() => khoHuong.dat(h.id)}><b>{h.ten}</b><small>{h.mo}</small></button>)}
        </div>
      </div>}
      <div className="luoi-che-do">
        <div className="the-che-do giay">
          <div className="cd-icon">🤖</div>
          <h3>Luyện với Bot</h3>
          <p>Đấu với Boss Thùy — chọn độ khó, tạm dừng được.</p>
          <div className="chip-hang nho">
            {(Object.keys(BOT) as MucBot[]).map((m) => (
              <button key={m} className={'chip' + (muc === m ? ' bat' : '')} style={{ ['--mau' as string]: BOT[m].mau }} onClick={() => setMuc(m)}><b>{BOT[m].nhan}</b></button>
            ))}
          </div>
          <Nut mau="xanh" to onClick={() => onChon({ loai: 'bot', muc, soCau })}>Chơi ngay</Nut>
        </div>
        <div className="the-che-do giay noi-bat">
          <div className="cd-icon">⚔️</div>
          <h3>Đấu online</h3>
          <p>Ghép ngẫu nhiên 1 đấu 1 với người đang online.</p>
          <Nut mau="tim" to onClick={() => onChon({ loai: 'tim', soCau })}>Tìm trận</Nut>
        </div>
        <div className="the-che-do giay">
          <div className="cd-icon">🤝</div>
          <h3>Thách đấu bạn</h3>
          <p>Tạo phòng có mã 6 số, gửi bạn hoặc mời bạn đang online.</p>
          <Nut mau="lam" to onClick={() => onChon({ loai: 'phong', soCau })}>Tạo / vào phòng</Nut>
        </div>
        {!NHUNG && <>
        <div className="the-che-do giay noi-bat-vang">
          <div className="cd-icon">🏆</div>
          <h3>Giải đấu 8 người</h3>
          <p>Loại trực tiếp: Tứ kết → Bán kết → Chung kết. Thiếu người thì thêm bot.</p>
          <Nut mau="vang" to onClick={() => onChon({ loai: 'giai', soCau: Math.min(soCau, 10) })}>Tạo / vào giải</Nut>
        </div>
        <div className="the-che-do giay">
          <div className="cd-icon">👥</div>
          <h3>2 người 1 máy</h3>
          <p>Hai bạn ngồi đối diện chung một iPad/máy tính.</p>
          <Nut mau="do" to onClick={() => onChon({ loai: 'doi', soCau })}>Đấu tay đôi</Nut>
        </div>
        </>}
      </div>
    </div>
  )
}

