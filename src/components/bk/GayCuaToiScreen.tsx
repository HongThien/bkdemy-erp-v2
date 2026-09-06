// Màn GẬY (design 02): thẻ hồng "Tháng này: N gậy", segmented Tháng này / Tất cả, mỗi lỗi 1 card:
// loại lỗi · ngày · ngữ cảnh · pill "N gậy" · "Vì sao bị đánh:". Đề xuất đang chờ duyệt hiện riêng
// (màu vàng) để TA giải trình sớm. Dữ liệu: gaycuatoi.ts (dòng thô của chính mình).
import { useEffect, useState } from 'react'
import { gayCuaToi, type GayCuaToi, type GayCuaToiEntry } from '../../lib/gaycuatoi'
import { ddmmVN } from '../../lib/tuan'
import { BKSectionCard, BKSegmented, BKEmptyState, BKStatusPill, BKSectionTitle } from './BKUI'

const ICON_LOI: [RegExp, string][] = [[/et/i, '🧪'], [/btvn/i, '📚'], [/deadline|muộn|trễ/i, '⏰'], [/báo cáo|report/i, '📋'], [/quy trình/i, '📐']]
const iconCho = (s: string | undefined) => ICON_LOI.find(([re]) => re.test(s ?? ''))?.[1] ?? '🔨'
const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`

function PenaltyCard({ e }: { e: GayCuaToiEntry }) {
  const go = e.so_gay < 0
  return (
    <div className={`flex gap-3 rounded-3xl border p-3.5 shadow-[0_4px_14px_rgba(22,34,77,.06)] ${e.thu_hoi_at ? 'border-[#E4E8F2] bg-white opacity-60' : go ? 'border-[#BDF0D6] bg-[#EDFBF3]' : 'border-[#FFC3D2] bg-[#FFF0F4]'}`}>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[30px] shadow-sm">{go ? '🌿' : iconCho(e.loi_ten)}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className={`min-w-0 flex-1 text-[15px] font-extrabold text-[#16224D] ${e.thu_hoi_at ? 'line-through' : ''}`}>{go ? e.hoat_dong_ten ?? 'Gỡ gậy' : e.loi_ten ?? 'Gậy'}</p>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-extrabold ${go ? 'bg-white text-[#1E8A52]' : 'bg-white text-[#C0355A]'}`}>🔨 {go ? `−${-e.so_gay}` : e.so_gay} gậy</span>
        </div>
        <p className="mt-0.5 text-[11.5px] text-[#63709A]">📅 {ddmmVN(e.created_at.slice(0, 10))} · {e.loai === 'tu_dong' ? 'Hệ thống đề xuất, leader chốt' : e.loai === 'go' ? 'Hoạt động gỡ' : 'Leader đánh'}</p>
        <div className="mt-2 rounded-2xl bg-white/80 px-3 py-2 text-[12px] text-[#16224D]">
          <span className="font-bold text-[#C0355A]">Vì sao bị đánh: </span>{e.ly_do || '(chưa ghi lý do)'}
        </div>
        {e.thu_hoi_at && <p className="mt-1 text-[11px] font-semibold text-[#B87800]">↩ Đã thu hồi: {e.thu_hoi_ly_do}</p>}
      </div>
    </div>
  )
}

export function GayCuaToiScreen({ ym, donGia }: { ym: string; donGia: number }) {
  const [pham, setPham] = useState<'thang' | 'tatca'>('thang')
  const [data, setData] = useState<GayCuaToi | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { setData(null); setErr(null); gayCuaToi(pham === 'thang' ? `${ym}-01` : null).then(setData).catch((e) => setErr(e?.message ?? String(e))) }, [ym, pham])

  const hieuLuc = data?.ledger.filter((e) => !e.thu_hoi_at) ?? []
  const soGay = hieuLuc.reduce((s, e) => s + e.so_gay, 0)   // đếm items đang render — không phải công thức nghiệp vụ
  return (
    <div className="flex flex-col gap-1">
      <BKSectionCard tone="pink" className="relative overflow-hidden">
        <span className="pointer-events-none absolute right-3 top-2 text-[14px] text-[#FFD84D]">✦</span>
        <div className="flex items-center gap-3">
          <span className="text-[46px] leading-none">🔨</span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold text-[#16224D]">{pham === 'thang' ? 'Tháng này' : 'Tất cả'}: <span className="text-[24px] text-[#FF5D78]">{data ? soGay : '…'}</span> gậy</p>
            <p className="text-[12px] text-[#63709A]">{soGay > 0 ? `≈ ${vnd(soGay * donGia)} · Mỗi lỗi là một bài học giúp bạn làm tốt hơn! ♡` : 'Sạch bóng — giữ vững nha! ♡'}</p>
          </div>
          <span className="hidden rounded-2xl bg-white/80 px-2.5 py-1.5 text-[10.5px] font-semibold text-[#63709A] sm:block">💡 Học từ lỗi cũ<br />để tiến bộ hơn</span>
        </div>
      </BKSectionCard>

      <BKSegmented value={pham} onChange={setPham} items={[{ key: 'thang', label: 'Tháng này' }, { key: 'tatca', label: 'Tất cả' }]} />

      {err && <p className="rounded-2xl bg-[#FFE3EA] px-3 py-2 text-[12.5px] text-[#C0355A]">⚠ {err}</p>}
      {!data && !err && <p className="text-center text-[13px] text-[#63709A]">Đang tải…</p>}

      {data && data.deXuatCho.length > 0 && (
        <div>
          <BKSectionTitle right={<BKStatusPill status="thieu">chờ leader duyệt</BKStatusPill>}>Đang đề xuất ({data.deXuatCho.length})</BKSectionTitle>
          <div className="flex flex-col gap-1">
            {data.deXuatCho.map((d) => (
              <div key={d.id} className="flex gap-3 rounded-3xl border border-[#FFE59A] bg-[#FFF6D6] p-3.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[24px]">⏳</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold text-[#16224D]">{d.mo_ta}</p>
                  <p className="mt-0.5 text-[11.5px] text-[#B87800]">Chưa chốt — đang tạm tính đạt. Thấy sai thì báo leader bỏ qua kèm lý do.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data && (
        <div>
          <BKSectionTitle>Đã chốt ({data.ledger.length})</BKSectionTitle>
          {!data.ledger.length ? <BKEmptyState icon="🎉">Chưa có gậy nào được chốt{pham === 'thang' ? ' tháng này' : ''}.</BKEmptyState>
            : <div className="flex flex-col gap-1">{data.ledger.map((e) => <PenaltyCard key={e.id} e={e} />)}</div>}
        </div>
      )}
    </div>
  )
}
