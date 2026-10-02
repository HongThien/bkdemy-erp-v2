// Chọn chủ đề → chọn chế độ (bot · 2 người 1 máy · tìm trận online · thách đấu · giải 8 người).
import { useState } from 'react'
import { CAP_DO, CHU_DE, TU_THEO_CD, type CapDo } from '../data/kho'
import { DauMan, Nut } from '../ui/Chung'
import { BOT } from '../lib/bot'
import type { MucBot } from '../lib/trongTai'

export function ChonChuDe({ capDo, setCapDo, onChon, onLui }: { capDo: CapDo; setCapDo: (c: CapDo) => void; onChon: (cd: string) => void; onLui: () => void }) {
  return (
    <div className="man">
      <DauMan tieuDe="Chọn nội dung" phu="Chọn một chủ đề hoặc để hệ thống trộn ngẫu nhiên" onLui={onLui} />
      <div className="chip-hang">
        {CAP_DO.map((c) => (
          <button key={c.id} className={'chip' + (capDo === c.id ? ' bat' : '')} onClick={() => setCapDo(c.id)}>
            <b>{c.ten}</b><small>{c.mo}</small>
          </button>
        ))}
      </div>
      <div className="luoi-chu-de">
        <button className="o-chu-de dac-biet" onClick={() => onChon('auto')}>
          <span className="o-icon">✨</span><b>Đấu ngẫu nhiên</b><small>Hệ thống tự chọn chủ đề</small>
        </button>
        <button className="o-chu-de dac-biet" onClick={() => onChon('tron')}>
          <span className="o-icon">🎲</span><b>Trộn tất cả</b><small>Mọi chủ đề</small>
        </button>
        {CHU_DE.map((c) => (
          <button key={c.id} className="o-chu-de" style={{ ['--mau' as string]: c.mau }} onClick={() => onChon(c.id)}>
            <span className="o-icon">{c.icon}</span><b>{c.ten}</b><small>{c.tenEn} · {TU_THEO_CD[c.id]?.length ?? 0} từ</small>
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

export function ChonCheDo({ tenChuDe, onChon, onLui }: { tenChuDe: string; onChon: (c: LuaChonCheDo) => void; onLui: () => void }) {
  const [soCau, setSoCau] = useState(15)
  const [muc, setMuc] = useState<MucBot>('vua')
  return (
    <div className="man">
      <DauMan tieuDe="Chọn chế độ chơi" phu={<>Chủ đề: <b>{tenChuDe}</b></>} onLui={onLui}
        phai={<div className="chip-hang nho">{[10, 15, 20].map((n) => <button key={n} className={'chip' + (soCau === n ? ' bat' : '')} onClick={() => setSoCau(n)}><b>{n} từ</b></button>)}</div>} />
      <div className="luoi-che-do">
        <div className="the-che-do giay">
          <div className="cd-icon">🤖</div>
          <h3>Luyện với Bot</h3>
          <p>Đấu với đội Xương — chọn độ khó, tạm dừng được.</p>
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
      </div>
    </div>
  )
}

export function capDoTen(c: CapDo) { return CAP_DO.find((x) => x.id === c)?.ten ?? '' }
