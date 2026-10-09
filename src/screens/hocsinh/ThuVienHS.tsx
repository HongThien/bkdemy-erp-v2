// ============================================================================
// ThuVienHS — "Thư viện BK" (Thùy 03/10): ô ở khối Giải trí màn chính, "Nơi tìm hiểu mọi thông tin trên app".
// Chứa các THẺ CON; thẻ đầu tiên = Rank (trước là 1 ô riêng ở màn chính). Thêm mục mới = thêm 1 phần tử `the` ở HocSinhApp.
// Component chỉ VẼ: số liệu từng thẻ (bậc, hạng…) do màn cha lấy từ RPC sẵn có. Khung/màu theo skin (KhungHS).
// Thẻ = kiểu 1 (CLAUDE §6): có dòng mô tả + dòng trạng thái ⇒ đầu thẻ (icon + tên) rồi phần nội dung.
// ============================================================================
import { ManHS, DauTrangHS, TheHS, MAU, HEAD } from './skin/KhungHS'

export type TheThuVien = {
  id: string; ten: string; moTa: string
  trangThai?: string | null // dòng trạng thái của em (vd bậc Rank). undefined = đang tải
  anh?: string | null; icon: string
  onClick: () => void
}

export default function ThuVienHS({ the, onBack }: { the: TheThuVien[]; onBack: () => void }) {
  return (
    <ManHS>
      <DauTrangHS tieuDe="Thư viện BK" phu="Nơi tìm hiểu mọi thông tin trên app" onBack={onBack} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {the.map((t) => (
          <TheHS key={t.id} onClick={t.onClick} className="flex min-h-[150px] flex-col gap-2 p-4">
            <span className="flex items-center gap-3">
              {t.anh
                ? <img src={t.anh} alt="" className="h-14 w-14 shrink-0 object-contain" />
                : <span className="flex h-14 w-14 shrink-0 items-center justify-center text-[33px]" aria-hidden>{t.icon}</span>}
              <span className="min-w-0 flex-1 text-[20px] font-bold leading-tight" style={HEAD}>{t.ten}</span>
              <span className="shrink-0 text-[24px] leading-none" style={{ color: MAU.muted }} aria-hidden>›</span>
            </span>
            <span className="text-[14.5px] leading-snug" style={{ color: MAU.muted }}>{t.moTa}</span>
            {t.trangThai !== null && (
              <span className="mt-auto text-[15px] font-bold" style={{ color: MAU.ink }}>{t.trangThai === undefined ? '…' : t.trangThai}</span>
            )}
          </TheHS>
        ))}
      </div>
    </ManHS>
  )
}
