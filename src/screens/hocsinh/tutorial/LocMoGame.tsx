// ============================================================================
// LocMoGame — Lộc BẬT LÊN báo "Nông trại BK đã mở" (Thùy 23/10: "vào game, Lộc xuất hiện và thông báo game đã mở để học sinh biết mà chơi").
// Hiện ở màn chính khi: tính năng `nong_trai` ĐANG MỞ cho em và em CHƯA có dòng hs_tutorial 'nong_trai' (xem/bỏ qua). Ghi dòng đó ⇒ không hiện lại.
// 3 đường: [Vào Nông trại ngay] · [Nghe Lộc kể cách chơi] (mở chặng tutorial 'nong_trai') · [Để sau] (chỉ ẩn trong phiên này, lần mở app sau hiện lại).
// Chỉ VẼ: màu/khung theo skin (KhungHS); Style không có Lộc hoạt hình ⇒ biểu tượng 🌾. Danh sách điều kiện + ghi DB do HocSinhApp làm.
// ============================================================================
import { useState } from 'react'
import { HEAD, MAU, NutHS, THE_TRON, useSkinHT } from '../skin/KhungHS'
import { LocHS } from './LocHS'

const KHOA = 'bk_loc_mo_nong_trai_de_sau'   // sessionStorage: em bấm "Để sau" trong phiên này
const docDeSau = (): boolean => { try { return sessionStorage.getItem(KHOA) === '1' } catch { return false } }

export function LocMoGame({ hien, onVao, onNghe }: { hien: boolean; onVao: () => void; onNghe: () => void }) {
  const [deSau, setDeSau] = useState(docDeSau)
  const nd = useSkinHT().nguoiDan
  if (!hien || deSau) return null
  const an = () => { try { sessionStorage.setItem(KHOA, '1') } catch { /* không có sessionStorage: chỉ ẩn lần này */ } setDeSau(true) }
  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center bg-black/50 px-4 pb-6 sm:items-center" onClick={an} role="dialog" aria-modal="true" aria-label="Lộc báo tin: Nông trại BK đã mở">
      <div className="flex max-h-[88dvh] w-full max-w-[440px] flex-col items-center gap-3 overflow-y-auto p-5" onClick={(e) => e.stopPropagation()} style={{ ...THE_TRON, background: MAU.bg }}>
        <div className="flex items-end justify-center gap-2">
          {nd ? <LocHS nguoi={nd} dong="greeting" cao={150} /> : <span className="text-[72px] leading-none" aria-hidden>🌾</span>}
        </div>
        <p className="text-center text-[24px] font-extrabold leading-tight" style={{ ...HEAD, color: MAU.acc }}>Nông trại BK đã mở!</p>
        <p className="text-center text-[16px] leading-snug" style={{ color: MAU.ink }}>
          {nd ? 'Lộc báo tin vui nè! ' : ''}Em có một khu vườn riêng đang chờ: gieo hạt, tưới nước, thu hoạch, nuôi thú cưng và sang thăm vườn bạn cùng lớp. Chơi đều mỗi ngày còn nhận được xu thật nữa đó.
        </p>
        <NutHS onClick={onVao} className="w-full">Vào Nông trại ngay</NutHS>
        <NutHS phu onClick={onNghe} className="w-full">Nghe Lộc kể cách chơi</NutHS>
        <button onClick={an} className="text-[14px] font-semibold underline-offset-2 hover:underline" style={{ color: MAU.muted }}>Để sau</button>
      </div>
    </div>
  )
}
