// Dòng báo "lượt này chưa được tính" ở màn kết quả làm bài THƯỜNG (Tự luyện / Thử thách / Học từ đầu) — trước đây chỉ khung đấu của Học theo chủ đề mới báo (V4, 06/10).
// Nguồn: fn_luot_hoc_that_ket_qua (Postgres quyết). Lượt được tính hoặc không phải lượt luyện (ET/BTVN) ⇒ không hiện gì. Nhẹ nhàng, không phạt.
import { useEffect, useState } from 'react'
import { ketQuaLuotHocThat, loiLuotKhongTinh } from '../../../lib/chuoi'
import { MAU } from '../skin/KhungHS'

export default function ThongBaoLuot({ baiLamId }: { baiLamId: string }) {
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    let bo = false
    setLoi(null)
    ketQuaLuotHocThat(baiLamId).then((k) => { if (!bo) setLoi(loiLuotKhongTinh(k)) }).catch(() => undefined)
    return () => { bo = true }
  }, [baiLamId])
  if (!loi) return null
  return <p className="mt-3 max-w-sm px-4 text-center text-[15px] leading-snug" style={{ color: MAU.canhBao }}>{loi}</p>
}
