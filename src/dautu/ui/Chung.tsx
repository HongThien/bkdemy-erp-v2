// Khối giao diện dùng chung của game Đấu Từ.
import { useEffect, useState, type ReactNode } from 'react'
import { docLS, ghiLS, taoKho } from '../lib/tienich'
import { phat } from '../lib/amThanh'

export const TEN_NV: Record<string, string> = {
  knight: 'Hiệp sĩ', mage: 'Pháp sư', ranger: 'Cung thủ', rogue: 'Sát thủ', barbarian: 'Chiến binh', druid: 'Tiên rừng',
  Skeleton_Warrior: 'Kỵ sĩ Xương', Skeleton_Rogue: 'Xương Lém Lỉnh', Skeleton_Minion: 'Lính Xương', Skeleton_Mage: 'Pháp sư Xương',
}
const EMOJI_NV: Record<string, string> = {
  knight: '🛡️', mage: '🔮', ranger: '🏹', rogue: '🗡️', barbarian: '🪓', druid: '🌿',
  Skeleton_Warrior: '💀', Skeleton_Rogue: '💀', Skeleton_Minion: '💀', Skeleton_Mage: '💀',
}
const MAU_NV: Record<string, string> = {
  knight: '#f5c451', mage: '#b48cff', ranger: '#f2c56b', rogue: '#9ccc65', barbarian: '#ff8a50', druid: '#66e3a5',
  Skeleton_Warrior: '#ff6b6b', Skeleton_Rogue: '#64b5f6', Skeleton_Minion: '#81c784', Skeleton_Mage: '#8fe8ff',
}
export const DS_NV = ['knight', 'mage', 'ranger', 'rogue', 'barbarian', 'druid'] as const

// ── Chân dung 3D: chụp 1 lần bằng three.js, lưu ở máy ──
const PB = 'dtv_cd_v2_'
const khoAnh = taoKho<Record<string, string>>({})
const dangChup = new Set<string>()
function yeuCauAnh(nv: string) {
  if (khoAnh.lay()[nv] || dangChup.has(nv)) return
  const luu = docLS<string>(PB + nv, '')
  if (luu) { khoAnh.dat((k) => ({ ...k, [nv]: luu })); return }
  dangChup.add(nv)
  // chụp tuần tự để không mở nhiều WebGL context cùng lúc
  hangChup = hangChup.then(async () => {
    try {
      const { chupChanDung } = await import('../lib/the3d')
      const url = await chupChanDung(nv)
      ghiLS(PB + nv, url)
      khoAnh.dat((k) => ({ ...k, [nv]: url }))
    } catch { /* không WebGL ⇒ dùng emoji */ }
  })
}
let hangChup: Promise<void> = Promise.resolve()

export function Avatar({ nv, co = 48, vien = true, className = '' }: { nv: string; co?: number; vien?: boolean; className?: string }) {
  const [anh, setAnh] = useState(khoAnh.lay()[nv])
  useEffect(() => {
    yeuCauAnh(nv)
    setAnh(khoAnh.lay()[nv])
    return khoAnh.nghe((k) => setAnh(k[nv]))
  }, [nv])
  return (
    <div className={'avatar ' + className} style={{ width: co, height: co, borderColor: vien ? MAU_NV[nv] ?? '#ffd36e' : 'transparent', background: `radial-gradient(circle at 50% 35%, ${MAU_NV[nv] ?? '#ffd36e'}55, #2a2156)` }}>
      {anh ? <img src={anh} alt={TEN_NV[nv] ?? nv} draggable={false} /> : <span style={{ fontSize: co * 0.5 }}>{EMOJI_NV[nv] ?? '🙂'}</span>}
    </div>
  )
}

export function Nut({ mau = 'xanh', children, onClick, disabled, to, className = '', title }: {
  mau?: 'xanh' | 'tim' | 'vang' | 'do' | 'lam' | 'xam' | 'trang'; children: ReactNode; onClick?: () => void; disabled?: boolean; to?: boolean; className?: string; title?: string
}) {
  return (
    <button type="button" title={title} className={`nut3d nut-${mau} ${to ? 'nut-to' : ''} ${className}`} disabled={disabled}
      onClick={() => { phat('click'); onClick?.() }}>
      {children}
    </button>
  )
}

export function Modal({ tieuDe, onDong, children, rong = 560, chan }: { tieuDe: ReactNode; onDong?: () => void; children: ReactNode; rong?: number; chan?: ReactNode }) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong?.() }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [onDong])
  return (
    <div className="modal-nen" onMouseDown={(e) => { if (e.target === e.currentTarget) onDong?.() }}>
      <div className="modal giay" style={{ maxWidth: rong }}>
        <div className="modal-dau">
          <h3>{tieuDe}</h3>
          {onDong && <button className="nut-dong" onClick={onDong} aria-label="Đóng">✕</button>}
        </div>
        <div className="modal-than">{children}</div>
        {chan && <div className="modal-chan">{chan}</div>}
      </div>
    </div>
  )
}

export function DauMan({ tieuDe, phu, onLui, phai }: { tieuDe: ReactNode; phu?: ReactNode; onLui?: () => void; phai?: ReactNode }) {
  return (
    <div className="dau-man">
      {onLui && <button className="nut-lui" onClick={() => { phat('click'); onLui() }} aria-label="Quay lại">‹</button>}
      <div className="dau-man-chu">
        <h2>{tieuDe}</h2>
        {phu && <p>{phu}</p>}
      </div>
      <div className="dau-man-phai">{phai}</div>
    </div>
  )
}

// ── Thông báo nhỏ (tự tắt ~2,5s, không alert) ──
export const khoToast = taoKho<{ id: number; chu: string; loai: 'ok' | 'loi' | 'tin' } | null>(null)
export function toast(chu: string, loai: 'ok' | 'loi' | 'tin' = 'tin') { khoToast.dat({ id: Date.now(), chu, loai }) }
export function Toast() {
  const [t, setT] = useState(khoToast.lay())
  useEffect(() => khoToast.nghe(setT), [])
  useEffect(() => {
    if (!t) return
    const h = setTimeout(() => khoToast.dat(null), 2600)
    return () => clearTimeout(h)
  }, [t])
  if (!t) return null
  return <div key={t.id} className={'toast toast-' + t.loai}>{t.chu}</div>
}

export async function chepVao(chu: string) {
  try { await navigator.clipboard.writeText(chu); toast('Đã sao chép', 'ok') } catch { toast('Không sao chép được — giữ lâu để chép tay', 'loi') }
}
