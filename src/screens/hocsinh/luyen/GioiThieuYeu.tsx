// ============================================================================
// MÀN GIỚI THIỆU trước "Luyện dạng yếu" (Thùy 06/10: "bấm vào mà vào câu hỏi ngay thì hơi bất ngờ — cần 1 UI giới thiệu rồi mới đến đoạn luyện").
// CHỈ Luyện dạng yếu có màn này (các chế độ khác đã có dẫn dắt riêng). Nội dung: tên chế độ · câu hỏi sẵn sàng chưa · luật 1 dòng · vài dạng em đang yếu nhất ·
// nút Bắt đầu / Quay lại. Chữ gốc FORMAL; style game đổi giọng qua skin/loi.ts (`yeu`). Màn TRONG ⇒ nền đơn sắc (ManHS mặc định).
// Dạng yếu lấy từ RPC sẵn có (tu_luyen_chu_de_ds_dang — đã xếp yếu nhất lên đầu); lỗi/không có dữ liệu ⇒ bỏ khối này, vẫn bắt đầu được.
// ============================================================================
import { useEffect, useState } from 'react'
import { DauTrangHS, HEAD, MAU, ManHS, NutHS, TheHS, useLoi } from '../skin/KhungHS'
import { anhDauNv, type NvId } from '../skin/nhanVat'
import { layDangChuDe, TU_LUYEN_SO_CAU_MOI_LUOT, type DangChuDe } from '../../../lib/tuluyen'

export default function GioiThieuYeu({ mon, nv, khungGame, onBatDau, onBack }: {
  mon: string | null; nv?: NvId | null
  /** true ⇒ đang ở chế độ có hiệu ứng game: hiện nhân vật chính bên cạnh lời hỏi */
  khungGame: boolean
  onBatDau: () => void; onBack: () => void
}) {
  const loi = useLoi()
  const [dang, setDang] = useState<DangChuDe[] | null>(null)
  useEffect(() => {
    let bo = false
    if (!mon) return
    layDangChuDe(mon).then((d) => { if (!bo) setDang(d) }).catch(() => { if (!bo) setDang([]) })
    return () => { bo = true }
  }, [mon])
  // 3 dạng em yếu nhất: có số đo thật (pct ≠ null) và mức yếu/cần luyện; chưa đo ⇒ không liệt kê (chưa-đo ≠ yếu)
  const yeuNhat = (dang ?? []).filter((d) => d.pct != null && (d.muc === 'yeu' || d.muc === 'can_luyen')).slice(0, 3)
  const y = loi.yeu

  return (
    <ManHS rong="hep">
      <DauTrangHS tieuDe={y.tieuDe} phu={mon ?? undefined} onBack={onBack} theoMon />
      <TheHS className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-4">
          {khungGame && nv && (
            <span className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-full" style={{ background: 'var(--sk-surface2)', border: '2px solid var(--sk-acc)' }}>
              <img src={anhDauNv(nv, 'dung_1')} alt="" draggable={false} className="absolute left-1/2 top-0 w-[150%] max-w-none -translate-x-1/2" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-extrabold leading-tight" style={HEAD}>{y.hoi}</p>
            <p className="mt-1.5 text-[14px] leading-snug" style={{ color: MAU.muted }}>{y.dongLuat(TU_LUYEN_SO_CAU_MOI_LUOT)}</p>
          </div>
        </div>

        {yeuNhat.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: MAU.muted }}>{y.dangYeu}</p>
            {yeuNhat.map((d) => (
              <div key={d.ma_dang} className="flex items-center gap-3 px-3 py-2" style={{ background: 'var(--sk-surface2)', borderRadius: 'var(--sk-radius)' }}>
                <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{d.ten_dang}</span>
                <b className="text-[14px]" style={{ color: d.muc === 'yeu' ? MAU.sai : MAU.canhBao }}>{Math.round(d.pct ?? 0)}%</b>
              </div>
            ))}
          </div>
        )}

        <p className="text-[13px] leading-snug" style={{ color: MAU.muted }}>{y.dongDau}</p>

        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <NutHS onClick={onBatDau} className="w-full px-6 py-3.5 text-[16px] font-bold sm:flex-1">{y.nut}</NutHS>
          <NutHS phu onClick={onBack} className="w-full px-6 py-3.5 text-[15px] sm:w-auto">Quay lại</NutHS>
        </div>
      </TheHS>
    </ManHS>
  )
}
