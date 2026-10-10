// ============================================================================
// NutBaoLoiCau — "⚑ Báo lỗi" TỪNG CÂU HỎI trong màn làm bài (Thùy 10/10). Bấm ở BẤT KỲ lúc nào (cả trước khi trả lời), mọi chế độ luyện.
// Khác nút Góp ý nổi (không biết câu nào) và "🚩 Em nghĩ mình đúng" (chỉ sau khi bị chấm sai, không có lý do): ở đây gắn ĐÚNG câu + chọn LÝ DO.
// Server suy mã câu/môn từ bai_test_cau.id (HS không tự khai). Hạn mức 10/ngày ở DB. Màu/khung CHỈ từ skin.
// ============================================================================
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { HEAD, MAU, NutHS, THE_TRON } from '../skin/KhungHS'
import { LY_DO_BAO_CAU, baoLoiCau, type LyDoBaoCau } from '../../../lib/baoloi_cau'

export function NutBaoLoiCau({ baiTestCauId }: { baiTestCauId: string }) {
  const [mo, setMo] = useState(false)
  const [lyDo, setLyDo] = useState<LyDoBaoCau | null>(null)
  const [ghi, setGhi] = useState('')
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [xong, setXong] = useState(false)
  const dong = () => { setMo(false); setLyDo(null); setGhi(''); setLoi(null); setXong(false) }
  const canGhi = lyDo === 'khac'
  const gui = async () => {
    if (!lyDo || dang || (canGhi && ghi.trim().length < 5)) return
    setDang(true); setLoi(null)
    try { await baoLoiCau(baiTestCauId, lyDo, ghi); setXong(true) }
    catch (e) { setLoi((e as Error).message || 'Chưa gửi được, em thử lại nhé.') }
    finally { setDang(false) }
  }
  return (
    <>
      <button onClick={() => setMo(true)} aria-label="Báo lỗi câu hỏi này" title="Báo lỗi câu hỏi này"
        className="rounded-full px-3 py-1 text-[16.5px] font-medium transition active:scale-95" style={{ ...THE_TRON, borderRadius: 'var(--sk-radius-pill)', color: MAU.muted }}>
        ⚑ Báo lỗi
      </button>
      {mo && createPortal(
        <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Báo lỗi câu hỏi">
          <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--sk-bg) 70%, transparent)' }} onClick={dong} />
          <div className="relative flex max-h-[92dvh] w-full max-w-[520px] flex-col gap-3 overflow-y-auto p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
            style={{ ...THE_TRON, background: MAU.bg, color: MAU.ink, fontFamily: 'var(--sk-font)', borderRadius: 'var(--sk-radius)' }}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[20px] font-bold" style={HEAD}>Báo lỗi câu hỏi này</p>
              <button onClick={dong} aria-label="Đóng" className="flex h-10 w-10 items-center justify-center rounded-full text-[18px]" style={{ background: MAU.surface2, color: MAU.muted }}>✕</button>
            </div>
            {xong ? (
              <>
                <p className="text-[16px] font-bold leading-snug" style={{ color: MAU.dung }}>Đã gửi cho thầy cô. Cảm ơn em đã giúp BK sửa đề!</p>
                <NutHS onClick={dong}>Xong</NutHS>
              </>
            ) : (
              <>
                <p className="text-[15.5px]" style={{ color: MAU.muted }}>Câu này bị làm sao?</p>
                <div className="flex flex-col gap-2" role="radiogroup">
                  {LY_DO_BAO_CAU.map((l) => (
                    <button key={l.id} role="radio" aria-checked={lyDo === l.id} onClick={() => setLyDo(l.id)}
                      className="flex items-center gap-3 px-3 py-2.5 text-left text-[16.5px] font-semibold"
                      style={lyDo === l.id ? { background: MAU.acc, color: MAU.accInk, borderRadius: 'var(--sk-radius)' } : { ...THE_TRON, borderRadius: 'var(--sk-radius)' }}>
                      <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px]" style={{ border: `2px solid ${lyDo === l.id ? MAU.accInk : MAU.line}` }}>{lyDo === l.id ? '●' : ''}</span>
                      {l.ten}
                    </button>
                  ))}
                </div>
                {lyDo && (
                  <textarea value={ghi} onChange={(e) => setGhi(e.target.value.slice(0, 500))} rows={3}
                    placeholder={canGhi ? 'Em viết rõ lỗi gì nhé (bắt buộc)' : 'Em muốn nói thêm gì không? (không bắt buộc)'}
                    className="w-full resize-y p-3 text-[16px] leading-relaxed outline-none"
                    style={{ background: MAU.surface2, color: MAU.ink, border: `1px solid ${MAU.line}`, borderRadius: 'var(--sk-radius)' }} />
                )}
                {loi && <p className="text-[14.5px]" style={{ color: MAU.sai }}>{loi}</p>}
                <NutHS onClick={gui} tat={!lyDo || dang || (canGhi && ghi.trim().length < 5)}>{dang ? 'Đang gửi…' : 'Gửi báo lỗi'}</NutHS>
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
