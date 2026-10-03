// ============================================================================
// HinhBangMa — vẽ 1 HÌNH BẰNG MÃ `[kiểu:tham số]` (bộ vẽ chép từ KHTN Pocket: ./hinhVe.js). Dùng ở màn đọc sổ tay (app HS) và ERP Sổ tay.
// Bộ vẽ 142 KB ⇒ tải CHẬM (lần đầu có hình mới nạp), không nặng bundle chính. Mã lạ ⇒ bộ vẽ trả lại chính mã (người soạn thấy để sửa).
// HTML do bộ vẽ sinh: chữ trong mã đều qua esc() của Pocket; mã chỉ nhân sự sửa trên ERP (RLS co_quyen_ghi('sotay')).
// ============================================================================
import { useEffect, useState } from 'react'

let goi: Promise<typeof import('./veHinhLazy')> | null = null

export default function HinhBangMa({ ma, className = '' }: { ma: string; className?: string }) {
  const [html, setHtml] = useState<string | null>(null)
  const [loi, setLoi] = useState(false)
  useEffect(() => {
    let huy = false
    setLoi(false)
    ;(goi ??= import('./veHinhLazy'))
      .then((m) => { if (!huy) setHtml(String(m.veHinh(ma))) })
      .catch((e) => { console.error('[HinhBangMa] không tải được bộ vẽ:', e); if (!huy) setLoi(true) })
    return () => { huy = true }
  }, [ma])
  if (loi) return <div className={`so-tay-hinh wk-fig ${className}`}>Không tải được hình.</div>
  if (html === null) return <div className={`so-tay-hinh wk-fig ${className}`} style={{ minHeight: 120 }} aria-busy />
  return <div className={`so-tay-hinh wk-fig ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
