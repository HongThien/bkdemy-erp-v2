// Màn GẬY (ảnh gốc anhgoc_gay + backdrop_gay, CEO 07/09): thẻ hồng "Tháng này: N gậy" (icon búa+cảnh
// báo, pill bóng đèn), segmented Tuần này / Tháng này / Tất cả, mỗi gậy 1 card hồng: icon theo loại lỗi ·
// tên · 📅 ngày · 🎓 ngữ cảnh · pill "N gậy" · ô "Vì sao bị đánh:". Đề xuất chờ duyệt hiện riêng (vàng).
// Cả màn KHÔNG cuộn: danh sách cuộn NỘI BỘ ở giữa (banner mascot đã vẽ sẵn trong tranh nền, DashTa chừa).
// Icon = PNG CEO gửi (Gay1–10 → public/bk-ui/gay_*.png 256px). Dữ liệu: gaycuatoi.ts (dòng thô của mình).
import { useEffect, useState } from 'react'
import { gayCuaToi, type GayCuaToi, type GayCuaToiEntry } from '../../lib/gaycuatoi'
import { ddmmVN, homNayVN, tuanCuaNgay, khoangTuan } from '../../lib/tuan'
import { BKSegmented, BKEmptyState } from './BKUI'

const G = (n: string) => `/bk-ui/gay_${n}.png`
// icon theo loại lỗi (gay_loi.ten) + ngữ cảnh trong lý do: ET muộn → tờ ET; chậm hạn/đi muộn → đồng hồ;
// không đạt chuẩn / sai quy trình / báo cáo → bảng cảnh báo; còn lại búa; gỡ gậy → vòng xanh.
function iconCho(e: GayCuaToiEntry): string {
  if (e.so_gay < 0) return G('target')
  const s = `${e.loi_ten ?? ''} ${e.ly_do ?? ''}`
  if (/\bET\b/i.test(s)) return G('et_late')
  if (/deadline|muộn|trễ|chậm|quên/i.test(s)) return G('alarm')
  if (/chuẩn|quy trình|báo cáo|report/i.test(s)) return G('report_warn')
  return G('gavel')
}
const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`

function PenaltyCard({ e }: { e: GayCuaToiEntry }) {
  const go = e.so_gay < 0
  const nguCanh = e.loai === 'tu_dong' ? 'Hệ thống đề xuất, leader chốt' : e.loai === 'go' ? 'Hoạt động gỡ' : 'Leader đánh'
  return (
    <div className={`flex gap-2 rounded-[20px] p-2 ${e.thu_hoi_at ? 'bg-white/90 opacity-60' : go ? 'bg-[#E4F8EC]' : 'bg-[#FFE4EC]'}`}>
      <span className="flex h-[68px] w-[68px] shrink-0 items-center justify-center self-center rounded-2xl bg-white/70">
        <img src={iconCho(e)} alt="" className="h-14 w-14 object-contain" draggable={false} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1.5">
          <p className={`min-w-0 flex-1 text-[13.5px] font-extrabold leading-tight text-[#16224D] ${e.thu_hoi_at ? 'line-through' : ''}`}>{go ? e.hoat_dong_ten ?? 'Gỡ gậy' : e.loi_ten ?? 'Gậy'}</p>
          <span className={`flex shrink-0 items-center gap-0.5 rounded-full bg-white px-2 py-0.5 text-[11px] font-extrabold ${go ? 'text-[#1E8A52]' : 'text-[#C0355A]'}`}>
            <img src={G('gavel_small')} alt="" className="h-3.5 w-3.5" draggable={false} />{go ? `−${-e.so_gay}` : e.so_gay} gậy
          </span>
        </div>
        <p className="mt-0.5 truncate text-[10.5px] text-[#63709A]">📅 {ddmmVN(e.created_at.slice(0, 10))} · 🎓 {nguCanh}</p>
        <div className="mt-1 rounded-xl bg-white/80 px-2 py-1 text-[11px] leading-snug text-[#16224D]">
          <span className="font-bold text-[#C0355A]">Vì sao bị đánh: </span>{e.ly_do || '(chưa ghi lý do)'}
        </div>
        {e.thu_hoi_at && <p className="mt-0.5 text-[10.5px] font-semibold text-[#B87800]">↩ Đã thu hồi: {e.thu_hoi_ly_do}</p>}
      </div>
    </div>
  )
}

type Pham = 'tuan' | 'thang' | 'tatca'
export function GayCuaToiScreen({ ym, donGia }: { ym: string; donGia: number }) {
  const [pham, setPham] = useState<Pham>('thang')
  const [data, setData] = useState<GayCuaToi | null>(null)
  const [err, setErr] = useState<string | null>(null)
  // Tuần này = lọc trong dữ liệu tháng theo ngày (UI filter thuần — không phải công thức nghiệp vụ)
  useEffect(() => { setData(null); setErr(null); gayCuaToi(pham === 'tatca' ? null : `${ym}-01`).then(setData).catch((e) => setErr(e?.message ?? String(e))) }, [ym, pham])
  const tuDauTuan = khoangTuan(tuanCuaNgay(homNayVN())).tu
  const ledger = (data?.ledger ?? []).filter((e) => pham !== 'tuan' || e.created_at.slice(0, 10) >= tuDauTuan)
  const soGay = ledger.filter((e) => !e.thu_hoi_at).reduce((s, e) => s + e.so_gay, 0)   // đếm items đang render
  const nhan = pham === 'tuan' ? 'Tuần này' : pham === 'thang' ? 'Tháng này' : 'Tất cả'

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      {/* thẻ tổng hồng — đúng ảnh gốc: búa+cảnh báo trái · "Tháng này: N gậy" · pill bóng đèn phải */}
      <div className="relative flex items-center gap-2 overflow-hidden rounded-[20px] bg-[#FFE4EC] px-2.5 py-2">
        <span className="pointer-events-none absolute left-2 top-1 text-[12px] text-[#FFD84D]">✦</span>
        <img src={G('gavel_warn')} alt="" className="h-16 w-16 shrink-0 object-contain drop-shadow-sm" draggable={false} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-extrabold leading-tight text-[#16224D]">{nhan}: <span className="font-bubble text-[24px] text-[#FF5D78]">{data ? soGay : '…'}</span> gậy</p>
          <p className="font-hand mt-0.5 text-[11px] italic leading-tight text-[#63709A]">{soGay > 0 ? `≈ ${vnd(soGay * donGia)} · Mỗi lỗi là một bài học giúp bạn làm tốt hơn! ♡` : 'Sạch bóng — giữ vững nha! ♡'}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-2xl bg-white/80 px-2 py-1.5 text-[10px] font-semibold leading-tight text-[#63709A]">
          <img src={G('bulb')} alt="" className="h-7 w-7" draggable={false} /><span>Học từ lỗi cũ<br />để tiến bộ hơn</span>
        </span>
      </div>

      <BKSegmented value={pham} onChange={setPham} items={[{ key: 'tuan', label: 'Tuần này' }, { key: 'thang', label: 'Tháng này' }, { key: 'tatca', label: 'Tất cả' }]} />

      {err && <p className="rounded-2xl bg-[#FFE3EA] px-3 py-2 text-[12.5px] text-[#C0355A]">⚠ {err}</p>}
      {!data && !err && <p className="text-center text-[13px] text-[#63709A]">Đang tải…</p>}

      {/* vùng cuộn nội bộ: đề xuất chờ (vàng) rồi gậy đã chốt */}
      {data && (
        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {data.deXuatCho.map((d) => (
            <div key={d.id} className="flex gap-2 rounded-[20px] bg-[#FFF3D6] p-2">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[22px]">⏳</span>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold leading-tight text-[#16224D]">{d.mo_ta}</p>
                <p className="mt-0.5 text-[10.5px] text-[#B87800]">Chờ leader duyệt — đang tạm tính đạt. Thấy sai thì báo leader bỏ qua kèm lý do.</p>
              </div>
            </div>
          ))}
          {!ledger.length
            ? <BKEmptyState icon="🎉">Chưa có gậy nào được chốt{pham === 'tuan' ? ' tuần này' : pham === 'thang' ? ' tháng này' : ''}.</BKEmptyState>
            : ledger.map((e) => <PenaltyCard key={e.id} e={e} />)}
        </div>
      )}
    </div>
  )
}
