// ⭐ 08-08 "chuyển nhà": entry TOP-LEVEL cho Giáo trình Hình — ngang hàng "Giáo trình" (Đại) trong hub Làm
// tài liệu, KHÔNG còn chôn trong rail Kho (KhoHinhScreen). Chỉ là VỎ (khối + tải Luoi) bọc quanh
// GiaoTrinhScreen thật (kho/hinh/) — 2 giáo trình vẫn tách biệt bảng, chỉ chỗ VÀO giờ đối xứng với Đại.
import { useEffect, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { loadLuoi, type Luoi } from '../../lib/kho/hinh'
import { useMonScope } from '../../lib/mon'
import GiaoTrinhScreen from '../kho/hinh/GiaoTrinhScreen'

export default function GiaoTrinhHinhEntry() {
  const [khoi, setKhoi] = useState<string>(DEFAULT_KHOI)
  const [L, setL] = useState<Luoi | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  // Hình chỉ thuộc Toán (không có nhánh Hình ở KHTN) — scope④: admin/Ops/Media/Marketing qua hết, còn lại
  // cần được phân môn Toán.
  const { allowedMons, isAll } = useMonScope()
  const coQuyen = isAll || allowedMons.includes('Toán')

  useEffect(() => {
    if (!coQuyen) return
    let alive = true
    setL(null); setLoi(null)
    loadLuoi(khoi).then((d) => { if (alive) setL(d) }).catch((e) => { if (alive) setLoi(e.message ?? String(e)) })
    return () => { alive = false }
  }, [khoi, coQuyen])

  if (!coQuyen) return (
    <div className="flex h-full items-center justify-center p-8 text-center">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-2 text-3xl">📚</div>
        <div className="text-[15px] font-semibold text-slate-800">Bạn chưa được phân môn Toán</div>
        <p className="mt-1.5 text-[13px] text-slate-500">Giáo trình Hình thuộc môn Toán. Liên hệ quản trị để được phân môn (màn Nhân sự → sửa → Môn phụ trách).</p>
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-1 border-b border-slate-200 pb-3">
        <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Khối</span>
        {KHOI_OPTIONS.map((k) => (
          <button key={k} onClick={() => setKhoi(k)}
            className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${khoi === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{k}</button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {loi ? <div className="p-8 text-sm text-rose-600">Lỗi tải kho Hình: {loi}</div>
          : !L ? <div className="flex h-full items-center justify-center text-sm text-slate-400">Đang tải lưới…</div>
          : <GiaoTrinhScreen L={L} khoi={khoi} />}
      </div>
    </div>
  )
}
