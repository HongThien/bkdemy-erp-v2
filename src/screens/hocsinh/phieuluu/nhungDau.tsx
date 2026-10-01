// Hợp đồng NHÚNG của LamBai vào khung đấu 3D (DauView): LamBai vẫn là nơi hiện câu hỏi + chấm (mọi loại câu, lý thuyết gợi ý, báo sai…),
// khung đấu chỉ nhận kết quả từng câu để chạy hoạt ảnh. KHÔNG đổi cách chấm/ghi điểm.
import { useEffect } from 'react'

export type NhungDau = {
  /** bài đã tải: tổng số câu + số câu đã làm từ trước (mở lại lượt dở) */
  onTai?: (tong: number, daLam: number) => void
  /** vừa chấm xong 1 câu */
  onCau: (e: { verdict: 'correct' | 'partial' | 'wrong'; idx: number; tong: number }) => void
  /** làm hết câu (thay cho màn "N / M đúng" cũ) */
  onHet: (e: { dung: number; tong: number; baiLamId: string | null }) => void
  /** đang chạy hoạt ảnh — chưa cho sang câu kế */
  ban?: boolean
}

/** Gọi onHet đúng 1 lần khi hiện (LamBai không được gọi hook sau return sớm, nên tách thành component con). */
export function NhungHet({ dung, tong, baiLamId, cb }: { dung: number; tong: number; baiLamId: string | null; cb: NhungDau['onHet'] }) {
  useEffect(() => { cb({ dung, tong, baiLamId }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
