// Màn ĐẠT CHUẨN (bấm ô % ở thẻ hồ sơ): bar + 4 số + danh sách việc tháng (accordion) — nội dung
// màn "Của tôi" cũ, khoác áo BK.
import { ddmmVN } from '../../lib/tuan'
import { ViecThangAccordion, type ViecItem } from '../CuaToiWidgets'
import { BKSectionCard, BKProgressRing, BKEmptyState, BK } from './BKUI'

export function DatChuanScreen({ me, items, tabTen, lyDoTen, chuThich }: {
  me: { tong?: number; cho?: number; den_han?: number; dat?: number; khong_dat?: number; pct?: number | null }
  items: ViecItem[]; tabTen: Record<string, string>; lyDoTen: Record<string, string>; chuThich: string
}) {
  const pct = me.pct ?? null
  if (!me.tong) return <BKEmptyState icon="☕">Tháng này chưa có việc nào được giao.</BKEmptyState>
  const color = (pct ?? 0) >= 80 ? BK.success : (pct ?? 0) >= 50 ? BK.warning : BK.danger
  return (
    <div className="flex flex-col gap-1">
      <BKSectionCard tone="mint" className="flex items-center gap-4">
        <BKProgressRing pct={pct ?? 0} size={84} stroke={10} color={color}><span className="text-[20px] font-extrabold text-[#16224D]">{pct == null ? '—' : `${pct}%`}</span></BKProgressRing>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold text-[#16224D]">Hoàn thành nhiệm vụ</p>
          <p className="text-[12.5px] text-[#63709A]">{me.dat ?? 0}/{me.den_han ?? 0} việc đến hạn đạt chuẩn</p>
          <p className="mt-1 text-[11px] text-[#63709A]">{chuThich}</p>
        </div>
      </BKSectionCard>
      <div className="grid grid-cols-4 gap-2">
        {([[me.tong ?? 0, 'Được giao', 'text-[#16224D]'], [me.dat ?? 0, 'Đạt chuẩn', 'text-[#1E8A52]'], [me.khong_dat ?? 0, 'Không đạt', 'text-[#C0355A]'], [me.cho ?? 0, 'Đang chờ', 'text-[#63709A]']] as const).map(([n, l, c]) => (
          <div key={l} className="rounded-2xl bg-white p-2.5 text-center shadow-[0_2px_8px_rgba(22,34,77,.06)]">
            <p className={`text-[20px] font-extrabold ${c}`}>{n}</p>
            <p className="text-[10.5px] font-semibold text-[#63709A]">{l}</p>
          </div>
        ))}
      </div>
      <ViecThangAccordion items={items} tenViecLabel="Việc" tabTen={tabTen} lyDoTen={lyDoTen} fmtNgay={ddmmVN} />
    </div>
  )
}
