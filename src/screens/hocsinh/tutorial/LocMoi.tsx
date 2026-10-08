// LocMoi — Lộc đứng góc màn chính báo "có phần mới" (Thùy 07/10: app mở dần từng tính năng ⇒ tính năng vừa mở được Lộc kể ĐÚNG phần đó, không dẫn lại từ đầu).
// Chỉ hiện khi có chặng tutorial của tính năng ĐANG MỞ mà em chưa xem/bỏ qua. Bấm ⇒ mở tutorial với đúng các chặng mới. ✕ ẩn tới lần mở app sau.
// Style không có người dẫn hoạt hình (Skin.nguoiDan) ⇒ chỉ còn nhãn chữ. Chỉ VẼ — danh sách chặng mới do HocSinhApp tính.
import { useState } from 'react'
import { MAU, THE, useSkinHT } from '../skin/KhungHS'
import { LocHS } from './LocHS'

export function LocMoi({ n, ten, onMo }: { n: number; ten: string; onMo: () => void }) {
  const [an, setAn] = useState(false)
  const nd = useSkinHT().nguoiDan
  if (an || n <= 0) return null
  return (
    <div className="fixed bottom-[calc(10px+env(safe-area-inset-bottom))] left-2 z-40 flex items-end gap-1" role="region" aria-label="Lộc có điều mới">
      {nd && <button onClick={onMo} className="pointer-events-auto shrink-0 active:scale-95" aria-label="Nghe Lộc kể"><LocHS nguoi={nd} dong="greeting" cao={104} /></button>}
      <div className="relative mb-3 max-w-[200px] px-3 py-2 text-left" style={{ ...THE, clipPath: 'none', border: `1.5px solid ${MAU.acc}`, boxShadow: '0 0 14px var(--sk-acc)', borderRadius: 16 }}>
        <button onClick={() => setAn(true)} aria-label="Ẩn" className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[12px]" style={{ background: MAU.surface2, color: MAU.muted, border: `1px solid ${MAU.line}` }}>✕</button>
        <button onClick={onMo} className="block text-left">
          <span className="block text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: MAU.acc }}>{ten}</span>
          <span className="block text-[13px] font-semibold leading-snug" style={{ color: MAU.ink }}>{n === 1 ? 'Có 1 phần mới' : `Có ${n} phần mới`}, nghe mình kể nhé?</span>
        </button>
      </div>
    </div>
  )
}
