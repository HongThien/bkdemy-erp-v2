// Nút ⇄ đổi MÔI TRƯỜNG LÀM VIỆC: Sảnh (Trang chính ERP) ↔ Phòng làm việc trưởng khối (Thùy 03/11).
// Cùng vai trò, khác địa điểm — đặt ở cả 2 nơi, nhìn giống nhau. Sang phòng chỉ hiện khi menu có quyền 'phong_tk'.
import { useDieuHuong } from '../../lib/useDieuHuong'

export default function NutDoiMoiTruong({ den }: { den: 'phong' | 'sanh' }) {
  const dh = useDieuHuong()
  if (den === 'phong' && !dh.mucs.some((m) => m.id === 'phong_tk')) return null
  return (
    <button onClick={() => dh.di(den === 'phong' ? 'phong_tk' : 'home')}
      title={den === 'phong' ? 'Sang phòng làm việc riêng của trưởng khối' : 'Về Sảnh chung của ERP'}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-bold text-[var(--sk-ink)] shadow-sm transition hover:-translate-y-0.5 hover:brightness-110"
      style={{ background: 'var(--sk-surface)', borderRadius: 'var(--sk-radius-pill)', backdropFilter: 'var(--sk-blur)', border: 'var(--sk-card-border)' }}>
      ⇄ {den === 'phong' ? '🚪 Phòng làm việc' : '🏛 Về Sảnh'}
    </button>
  )
}
