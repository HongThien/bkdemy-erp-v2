// ============================================================================
// HuongDanThiThuHS — hướng dẫn làm bài THI THỬ (Ôn thi giữa kì I). Hiện tự động LẦN ĐẦU em bấm Thi thử, xem lại bằng nút
// "Xem hướng dẫn". Thùy SỬA CHỮ Ở ĐÂY (mảng BUOC), không cần đụng màn khác.
// ============================================================================
import { useState } from 'react'
import { TheHS, NutHS, MAU, HEAD } from './skin/KhungHS'

const BUOC: { icon: string; tieuDe: string; noi: string }[] = [
  { icon: '⏱️', tieuDe: 'Đồng hồ chạy ngay', noi: 'Em bấm vào là đồng hồ bắt đầu đếm ngược. Hết giờ bài tự nộp, nên em phân bổ thời gian cho hợp lý nhé.' },
  { icon: '🔢', tieuDe: 'Câu trắc nghiệm và trả lời ngắn', noi: 'Câu trắc nghiệm: chọn đáp án đúng. Câu trả lời ngắn: điền số vào các ô trống (mỗi ô một chữ số, dấu phẩy hoặc dấu trừ).' },
  { icon: '📷', tieuDe: 'Câu tự luận: chụp ảnh nộp', noi: 'Em làm câu tự luận ra giấy, rồi bấm “Chụp / chọn ảnh bài làm” ngay tại câu đó để nộp ảnh. Chụp đủ sáng, rõ chữ, đủ các trang; nộp được nhiều ảnh cho một câu.' },
  { icon: '📨', tieuDe: 'Nộp bài và nhận điểm', noi: 'Nộp xong không sửa được nữa. Phần trắc nghiệm có điểm ngay; phần tự luận chờ thầy cô chấm. Có đủ điểm thì điểm thi mới vào xếp hạng.' },
]

export default function HuongDanThiThuHS({ onXong, nutCuoi = 'Đã hiểu' }: { onXong: () => void; nutCuoi?: string }) {
  const [i, setI] = useState(0)
  const b = BUOC[i], cuoi = i === BUOC.length - 1
  return (
    <TheHS className="flex w-full max-w-md flex-col gap-3 p-5">
      <span className="flex items-center gap-3">
        <span className="text-[40px] leading-none" aria-hidden>{b.icon}</span>
        <span className="text-[19px] font-bold leading-snug" style={HEAD}>{b.tieuDe}</span>
      </span>
      <span className="text-[16px] leading-relaxed" style={{ color: MAU.ink }}>{b.noi}</span>
      <span className="flex justify-center gap-1.5" aria-hidden>
        {BUOC.map((_, k) => <span key={k} className="h-2 w-2 rounded-full" style={{ background: k === i ? MAU.acc : MAU.line }} />)}
      </span>
      <span className="flex gap-2">
        {i > 0 ? <NutHS phu onClick={() => setI(i - 1)} className="flex-1">‹ Trước</NutHS> : <NutHS phu onClick={onXong} className="flex-1">Bỏ qua</NutHS>}
        <NutHS onClick={() => (cuoi ? onXong() : setI(i + 1))} className="flex-1">{cuoi ? nutCuoi : 'Tiếp ›'}</NutHS>
      </span>
    </TheHS>
  )
}
