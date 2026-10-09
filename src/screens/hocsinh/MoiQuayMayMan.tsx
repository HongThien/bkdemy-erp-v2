// ============================================================================
// MoiQuayMayMan — lời mời quay TỰ HIỆN trên màn chính khi em vừa có lượt quay (Thùy 06/10: "ô May mắn ẩn đi — vòng quay tự động hiện").
// Chỉ là lớp phủ nhắc; điều kiện có lượt do server quyết (fn_may_man_hs_du_dieu_kien). "Để sau" nhớ trong ngày (sessionStorage, chỉ tiện ích hiển thị).
// ============================================================================
import { useState } from 'react'
import { HEAD, MAU, NutHS, THE_TRON } from './skin/KhungHS'

const homNay = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const KHOA = () => `bk_moi_quay_${homNay()}`
const daHoan = () => { try { return sessionStorage.getItem(KHOA()) === '1' } catch { return false } }

export default function MoiQuayMayMan({ coLuot, onQuay }: { coLuot: boolean; onQuay: () => void }) {
  const [hoan, setHoan] = useState(daHoan)
  if (!coLuot || hoan) return null
  const deSau = () => { try { sessionStorage.setItem(KHOA(), '1') } catch { /* không có sessionStorage: chỉ đóng lần này */ } setHoan(true) }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6 sm:items-center" onClick={deSau}>
      <div className="w-full max-w-[400px] p-6 text-center" onClick={(e) => e.stopPropagation()} style={{ ...THE_TRON, background: MAU.bg }}>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-[46px]" style={{ background: MAU.surface2 }} aria-hidden>🎰</div>
        <p className="mt-3 text-[24px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>Em có 1 lượt quay may mắn!</p>
        <p className="mt-1 text-[14.5px]" style={{ color: MAU.muted }}>Vừa xong một lượt Luyện dạng yếu đạt — quay ngay để nhận thêm EXP.</p>
        <div className="mt-4 flex flex-col gap-2">
          <NutHS onClick={() => { deSau(); onQuay() }} className="w-full">Quay ngay ▶</NutHS>
          <NutHS phu onClick={deSau} className="w-full">Để sau</NutHS>
        </div>
      </div>
    </div>
  )
}
