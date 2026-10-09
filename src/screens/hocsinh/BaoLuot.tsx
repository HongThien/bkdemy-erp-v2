// BÁO "LƯỢT CÓ ĐƯỢC TÍNH KHÔNG" ở màn kết quả của MỌI lượt luyện thêm (backlog V4, spec-v1-app-hs §2): Tự luyện thường · theo chủ đề · Thử thách · khung đấu.
// Luật + ngưỡng ở DB (fn_luot_hoc_that_ket_qua) — màn chỉ đọc và vẽ. Bài KHÔNG phải lượt luyện (BTVN, giáo trình…) ⇒ không hiện gì.
// Màn kết quả hiện ngay lúc câu cuối chấm xong, bài có thể chưa nộp xong ⇒ DB còn trả "không phải lượt luyện": hỏi lại vài lần rồi mới coi là đúng thế.
import { useEffect, useState } from 'react'
import { ketQuaLuotHocThat, loiLuotKhongTinh, type KetQuaLuot } from '../../lib/chuoi'
import { MAU, TheHS, useLoi } from './skin/KhungHS'

const HOI_LAI_MS = [0, 1200, 3000]

export function BaoLuotHS({ baiLamId, className = '' }: { baiLamId: string | null; className?: string }) {
  const loi = useLoi()
  const [r, setR] = useState<KetQuaLuot | null | undefined>(undefined)
  useEffect(() => {
    setR(undefined)
    if (!baiLamId) { setR(null); return }
    let huy = false, lan = 0, hen: number | undefined
    const hoi = () => {
      ketQuaLuotHocThat(baiLamId).then((k) => {
        if (huy) return
        if (k.ly_do === 'khong_phai_luot_luyen' && ++lan < HOI_LAI_MS.length) { hen = window.setTimeout(hoi, HOI_LAI_MS[lan]); return }
        setR(k)
      }).catch(() => { if (!huy) setR(null) })
    }
    hoi()
    return () => { huy = true; window.clearTimeout(hen) }
  }, [baiLamId])
  if (r === null || r?.ly_do === 'khong_phai_luot_luyen') return null
  const khong = r ? loiLuotKhongTinh(r) : null
  return (
    <TheHS className={`w-full px-4 py-3 text-center text-[15.5px] ${className}`}>
      {r === undefined ? <span style={{ color: MAU.muted }}>Đang kiểm tra lượt…</span>
        : r.tinh ? <span style={{ color: MAU.dung, fontWeight: 600 }}>{loi.ketQua.duocTinh}</span>
        : <span style={{ color: MAU.canhBao }}>{khong ?? 'Lượt này chưa được tính.'}</span>}
    </TheHS>
  )
}
