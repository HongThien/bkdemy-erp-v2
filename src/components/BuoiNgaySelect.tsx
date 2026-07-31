// Thay <input type="date"> tự do bằng dropdown chỉ chứa ngày CÓ trong TKB của lớp — chặn gán tài liệu sai ngày.
import { useEffect, useState } from 'react'
import { ngayBuoiHopLeCuaLop } from '../lib/gami'
import { homNayVN, congNgay, ddmmVN } from '../lib/tuan'

const THU_LABEL: Record<number, string> = { 2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6', 7: 'T7', 8: 'CN' }

export default function BuoiNgaySelect({ lopId, value, onChange, className, defaultToday }: {
  lopId: string | null; value: string; onChange: (ngay: string) => void; className?: string
  // defaultToday: tự chọn HÔM NAY khi chưa có ngày (ET/MT/nhân bản…). Giáo trình có logic mặc định riêng
  // (buổi gần nhất chưa gán, xem TaiLieuBuilder) nên KHÔNG bật cờ này để tránh đè.
  defaultToday?: boolean
}) {
  const [opts, setOpts] = useState<{ ngay: string; thu: number }[]>([])
  const [loading, setLoading] = useState(false)
  const today = homNayVN()

  useEffect(() => {
    if (!lopId) { setOpts([]); return }
    setLoading(true)
    ngayBuoiHopLeCuaLop(lopId, congNgay(today, -60), congNgay(today, 90))
      .then(setOpts).catch(() => setOpts([])).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lopId])

  // Mặc định = HÔM NAY khi CHƯA chọn ngày và hôm nay là buổi hợp lệ của lớp. Chỉ set khi value rỗng nên
  // không đè lựa chọn tay / ngày cũ đang sửa; set today (non-null) → effect tự dừng, không lặp.
  useEffect(() => {
    if (!defaultToday || value) return
    if (opts.some((o) => o.ngay === today)) onChange(today)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts, value, defaultToday])

  // Ngày đang chọn (vd đang sửa 1 gán cũ) mà TKB đổi khiến nó không còn hợp lệ → vẫn hiện, đánh dấu ngoài lịch.
  const ngoaiLich = value && !opts.some((o) => o.ngay === value)
  const list = ngoaiLich ? [{ ngay: value, thu: NaN }, ...opts] : opts

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={!lopId || loading}
      className={className ?? 'h-8 rounded-md border border-slate-300 px-2 text-[13px] disabled:bg-slate-50 disabled:text-slate-300'}>
      <option value="">{!lopId ? 'chọn lớp trước' : loading ? 'đang tải…' : list.length ? '— chọn buổi —' : 'lớp chưa có TKB'}</option>
      {list.map((o) => (
        // Highlight buổi HÔM NAY (⭐ + chữ "Hôm nay") để không bấm nhầm sang ngày khác.
        <option key={o.ngay} value={o.ngay}>
          {Number.isNaN(o.thu)
            ? `⚠ ${ddmmVN(o.ngay)} (ngoài TKB)`
            : `${o.ngay === today ? '⭐ Hôm nay · ' : ''}${THU_LABEL[o.thu]} · ${ddmmVN(o.ngay)}`}
        </option>
      ))}
    </select>
  )
}
