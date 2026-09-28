// ============================================================================
// BaiTapGiaoHS — Màn "Bài tập được giao" (Thùy 11/09). Placeholder "đang phát triển".
// Thùy 29/09: mọi màn theo STYLE (skin) em đang chọn — khung/màu lấy từ skin/KhungHS, bỏ nền mây + chồng sách +
// khẩu hiệu viết tay + màu theo giới tính (`gioiTinh` còn trong chữ ký cho người gọi, không đổi màu nữa).
// Card trung tâm hiển thị thông báo "sắp ra mắt" + biểu tượng công trình.
// ============================================================================
import { ManHS, DauTrangHS, MAU, THE, HEAD } from './skin/KhungHS'

export default function BaiTapGiaoHS({ onXong }: { gioiTinh: 'nam' | 'nu' | null; onXong: () => void }) {
  return (
    <ManHS>
      <DauTrangHS tieuDe="Bài tập được giao" phu="Tính năng đang phát triển" onBack={onXong} />

      <div className="mt-2 p-8 text-center" style={THE}>
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-[24px]" style={{ background: MAU.surface2 }}>
          <span className="text-[42px]">🚧</span>
        </div>
        <p className="text-[17px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>Sắp ra mắt</p>
        <p className="mx-auto mt-2 max-w-[300px] text-[13px] leading-relaxed" style={{ color: MAU.muted }}>
          Thầy cô sẽ giao thêm bài tập riêng cho em ở đây khi cần bổ trợ điểm yếu.
          Hiện tại em cứ chăm chỉ <b style={{ color: MAU.acc }}>Tự luyện</b> để nâng cao mastery nhé!
        </p>
      </div>
    </ManHS>
  )
}
