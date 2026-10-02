// Khối giao diện dùng chung của game Đấu Từ.
import { useEffect, useState, type ReactNode } from 'react'
import { taoKho } from '../lib/tienich'
import { phat } from '../lib/amThanh'

// ── Nhân vật & ảnh đại diện: tranh ChatGPT có sẵn của app HS (KHÔNG dùng KayKit — Thùy 03/10 "xấu") ──
// Ảnh đại diện = khung tròn cắt quanh mặt (background-size/position tính theo tâm mặt trong ảnh gốc).
// Nhân vật chiến đấu = bộ 15 tư thế Đấu trường (nam/nữ, heroDau.ts); bot = Boss Thùy (6 tư thế).
const R = '/bk-ui/hs/skin/rpg'
export interface NhanVat { ten: string; anh: string; co: string; vt: string; mau: string; gioi: 'nam' | 'nu'; boss?: boolean }
export const NHAN_VAT: Record<string, NhanVat> = {
  tham_hiem_nam: { ten: 'Nhà thám hiểm', anh: R + '/dau_truong/nam/dung_1.webp', co: '200%', vt: '56% 8%', mau: '#7fb069', gioi: 'nam' },
  tham_hiem_nu: { ten: 'Nữ thám hiểm', anh: R + '/dau_truong/nu/dung_1.webp', co: '200%', vt: '50% 12%', mau: '#e8a87c', gioi: 'nu' },
  hiep_si_dem: { ten: 'Hiệp sĩ bóng đêm', anh: R + '/nv_nam_chibi.png', co: '230%', vt: '59% 20%', mau: '#7c6cf0', gioi: 'nam' },
  phap_su: { ten: 'Pháp sư sao', anh: R + '/nv_nu_chibi.png', co: '240%', vt: '40% 20%', mau: '#b48cff', gioi: 'nu' },
  boss_thuy: { ten: 'Boss Thùy', anh: R + '/boss_thuy_chandung.png', co: '160%', vt: '50% 10%', mau: '#ffc23d', gioi: 'nam', boss: true },
}
export const DS_NV = ['tham_hiem_nam', 'tham_hiem_nu', 'hiep_si_dem', 'phap_su'] as const
/** Hồ sơ cũ (bản 3D) còn id KayKit ⇒ quy về nhân vật mới. */
export const nvChuan = (nv: string) => (NHAN_VAT[nv] ? nv : /mage|druid/.test(nv) ? 'phap_su' : nv.startsWith('Skeleton') ? 'boss_thuy' : 'tham_hiem_nam')
export const TEN_NV: Record<string, string> = Object.fromEntries(Object.entries(NHAN_VAT).map(([k, v]) => [k, v.ten]))

export function Avatar({ nv, co = 48, vien = true, className = '' }: { nv: string; co?: number; vien?: boolean; className?: string }) {
  const n = NHAN_VAT[nvChuan(nv)]
  return (
    <div className={'avatar ' + className} title={n.ten}
      style={{ width: co, height: co, borderColor: vien ? n.mau : 'transparent', backgroundColor: n.mau + '44', backgroundImage: `url(${n.anh})`, backgroundSize: n.co, backgroundPosition: n.vt, backgroundRepeat: 'no-repeat' }} />
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
