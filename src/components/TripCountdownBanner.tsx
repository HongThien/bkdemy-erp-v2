// TripCountdownBanner — banner đếm ngược ngày đi chơi, dùng NGUYÊN ảnh nền (không sửa nội dung ảnh —
// CEO 07/09: ảnh gốc đã để sẵn ô trắng trống trong hình lịch, component chỉ vẽ ĐÈ số lên đúng ô đó).
// Vị trí ô đo theo % (left/top/width/height của khung ảnh gốc) nên luôn đúng bất kể ảnh hiển thị rộng
// bao nhiêu; dùng containerType để cqw luôn khớp với chính khung ảnh (không lệch theo viewport — lỗi đã
// dính ở "Của tôi" trước đó, xem BKUI.tsx). Số tính theo giờ VN, chỉ đổi 1 lần/ngày lúc 00:00 (soNgayGiua/
// homNayVN — KHÔNG new Date('YYYY-MM-DD')/toISOString() cho ngày local, luật chung của dự án).
import { homNayVN, soNgayGiua } from '../lib/tuan'

export type CountdownRect = { left: number; top: number; width: number; height: number } // fraction 0..1 của khung ảnh

export default function TripCountdownBanner({ bgImage, targetDate, aspect, rect, color = '#165B45', className = '' }: {
  bgImage: string
  targetDate: string        // 'YYYY-MM-DD', giờ VN
  aspect: number            // rộng/cao ảnh gốc, vd 1672/941
  rect: CountdownRect
  color?: string
  className?: string
}) {
  const conLai = Math.max(0, soNgayGiua(homNayVN(), targetDate))
  const chu = String(conLai).length
  // Cỡ chữ tự co theo số chữ số (1/2/3) để luôn vừa ô — 1 chữ số to gần hết ô, 3 chữ số thu lại tránh tràn.
  const coChu = chu <= 1 ? 8.7 : chu === 2 ? 7 : 5
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${aspect}`, containerType: 'inline-size' }}>
      <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div className="pointer-events-none absolute flex items-center justify-center"
        style={{ left: `${rect.left * 100}%`, top: `${rect.top * 100}%`, width: `${rect.width * 100}%`, height: `${rect.height * 100}%` }}>
        <span className="font-bubble font-black leading-none" style={{ fontSize: `${coChu}cqw`, color }}>{conLai}</span>
      </div>
    </div>
  )
}
