// Thay <input type="date"> tự do bằng dropdown chỉ chứa ngày CÓ trong TKB của lớp — chặn gán tài liệu sai ngày.
import { useEffect, useState } from 'react'
import { ngayBuoiHopLeCuaLop } from '../lib/gami'
import { homNayVN, congNgay, ddmmVN } from '../lib/tuan'

const THU_LABEL: Record<number, string> = { 2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6', 7: 'T7', 8: 'CN' }

export default function BuoiNgaySelect({ lopId, value, onChange, className }: {
  lopId: string | null; value: string; onChange: (ngay: string) => void; className?: string
}) {
  const [opts, setOpts] = useState<{ ngay: string; thu: number }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!lopId) { setOpts([]); return }
    setLoading(true)
    const today = homNayVN()
    ngayBuoiHopLeCuaLop(lopId, congNgay(today, -60), congNgay(today, 90))
      .then(setOpts).catch(() => setOpts([])).finally(() => setLoading(false))
  }, [lopId])

  // Ngày đang chọn (vd đang sửa 1 gán cũ) mà TKB đổi khiến nó không còn hợp lệ → vẫn hiện, đánh dấu ngoài lịch.
  const ngoaiLich = value && !opts.some((o) => o.ngay === value)
  const list = ngoaiLich ? [{ ngay: value, thu: NaN }, ...opts] : opts

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={!lopId || loading}
      className={className ?? 'h-8 rounded-md border border-slate-300 px-2 text-[13px] disabled:bg-slate-50 disabled:text-slate-300'}>
      <option value="">{!lopId ? 'chọn lớp trước' : loading ? 'đang tải…' : list.length ? '— chọn buổi —' : 'lớp chưa có TKB'}</option>
      {list.map((o) => (
        <option key={o.ngay} value={o.ngay}>
          {Number.isNaN(o.thu) ? `⚠ ${ddmmVN(o.ngay)} (ngoài TKB)` : `${THU_LABEL[o.thu]} · ${ddmmVN(o.ngay)}`}
        </option>
      ))}
    </select>
  )
}
