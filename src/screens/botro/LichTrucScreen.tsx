// Bổ trợ › Lịch trực (Thùy 24/09, spec-xep-bo-tro-chung.md §2): lịch trực TA = NGUỒN LỰC CHUNG của 3 loại bổ trợ (Đuổi · Bù · Yếu),
// tính bằng đơn vị (30' × 1 TA). Trước 24/09 tab này nằm trong màn Xếp bổ trợ yếu; nội dung tab giữ nguyên (LichTrucTab), chỉ đổi chỗ.
import { LichTrucTab } from '../danhgia/XepLichBoTroYeuScreen'

export default function LichTrucScreen() {
  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-6">
          <h1 className="text-[22px] font-bold text-slate-800">Lịch trực bổ trợ</h1>
          <p className="mt-1 text-[13px] text-slate-500">Ca trực cố định hằng tuần của trợ giảng — dùng chung cho Đuổi · Bù · Yếu. 1 đơn vị = 30' × 1 TA; ca 60' = 6 đơn vị, 2 TA = 12.</p>
        </header>
        <LichTrucTab />
      </div>
    </section>
  )
}
