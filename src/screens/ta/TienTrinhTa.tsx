// Màn TIẾN TRÌNH app TA (design 04): thẻ tổng có vòng % + lời nhắn, rồi MỖI LỚP 1 card to (tên lớp ·
// buổi/tuần · pill trạng thái) chứa 3 tile KPI (Trợ giảng buổi · Chấm BTVN · Chấm ET); Bổ trợ là card
// riêng theo TA (dữ liệu bổ trợ không gắn lớp — CEO 07/09). Chuẩn = hợp đồng cố định (ta_dinh_muc),
// "so với hợp đồng" chứ không đổ lỗi. Số tính ở fn_ta_tien_trinh. KHÔNG dùng tính lương.
import { useEffect, useState } from 'react'
import { taTienTrinh, type TaTienTrinh, type TienTrinhLop } from '../../lib/tatientrinh'
import { BKSectionCard, BKMetricTile, BKProgressRing, BKStatusPill, BKEmptyState, BK } from '../../components/bk/BKUI'

type Key = 'buoi' | 'btvn' | 'et'
const CHI_SO: { key: Key; label: string; icon: string }[] = [
  { key: 'buoi', label: 'Trợ giảng buổi', icon: '👥' }, { key: 'btvn', label: 'Chấm BTVN', icon: '📒' }, { key: 'et', label: 'Chấm ET', icon: '📝' },
]
const thuc = (l: TienTrinhLop, k: Key) => l[`${k}_thuc`]
const chuan = (l: TienTrinhLop, k: Key) => l[`${k}_chuan`]

function trangThaiLop(l: TienTrinhLop): { st: 'dat' | 'thieu' | 'nguy'; text: string } {
  const thieu = CHI_SO.reduce((s, c) => s + Math.max(0, chuan(l, c.key) - thuc(l, c.key)), 0)
  if (thieu === 0) return { st: 'dat', text: 'Đủ chuẩn' }
  if (thieu <= 1) return { st: 'thieu', text: 'Thiếu 1 lần' }
  return { st: 'nguy', text: `Còn thiếu ${thieu}` }
}

export default function TienTrinhTa({ ym }: { ym: string }) {
  const [d, setD] = useState<TaTienTrinh | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { setD(null); setErr(null); taTienTrinh(ym).then(setD).catch((e) => setErr(e?.message ?? String(e))) }, [ym])
  if (err) return <p className="rounded-2xl bg-[#FFE3EA] px-3 py-2 text-[12.5px] text-[#C0355A]">⚠ {err}</p>
  if (!d) return <p className="text-center text-[13px] text-[#63709A]">Đang tính…</p>

  // Tổng trên cùng = tổng/tỉ lệ của các số ĐÃ tính sẵn đang render — không phải công thức nghiệp vụ mới.
  let tThuc = 0, tChuan = 0
  for (const l of d.lop) for (const c of CHI_SO) { tThuc += Math.min(thuc(l, c.key), chuan(l, c.key)); tChuan += chuan(l, c.key) }
  tThuc += Math.min(d.botro.thuc_gio, d.botro.chuan_gio); tChuan += d.botro.chuan_gio
  const pct = tChuan > 0 ? Math.round((100 * tThuc) / tChuan) : null
  const color = (pct ?? 0) >= 90 ? BK.success : (pct ?? 0) >= 60 ? BK.warning : BK.danger
  const loi = pct == null ? 'Chưa có dữ liệu tháng này.' : pct >= 90 ? 'Bạn đang làm rất tốt!' : pct >= 60 ? 'Sắp đủ chuẩn rồi, cố lên!' : 'Cần bổ sung thêm nhé!'

  return (
    <div className="flex flex-col gap-1">
      <BKSectionCard tone="blue" className="relative overflow-hidden">
        <span className="pointer-events-none absolute right-2 top-2 text-[34px]">🌱</span>
        <p className="text-[16px] font-extrabold text-[#16224D]">👑 Tổng tiến trình tháng</p>
        <p className="text-[11.5px] text-[#63709A]">Dựa trên {d.lop.length} lớp bạn phụ trách + bổ trợ</p>
        <div className="mt-3 flex items-center gap-4">
          <BKProgressRing pct={pct ?? 0} size={92} stroke={11} color={color}><span className="text-[22px] font-extrabold text-[#16224D]">{pct == null ? '—' : `${pct}%`}</span></BKProgressRing>
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-2xl bg-[#EAE2FF] px-3 py-1 text-[13px] font-bold text-[#6A4BD6]">{loi}</span>
            <p className="mt-1.5 text-[11.5px] leading-snug text-[#63709A]">Chuẩn tháng cố định theo hợp đồng: {d.dinh_muc.buoi_x_tuan}×buổi/tuần · BTVN {d.dinh_muc.btvn} · ET {d.dinh_muc.et} · bổ trợ {d.dinh_muc.botro_gio}h. "Thực" đếm tới hôm nay.</p>
          </div>
        </div>
        <p className="mt-2 rounded-2xl bg-white/70 px-3 py-1.5 text-[10.5px] text-[#63709A]">ℹ️ Bảng này để bạn theo dõi thừa/thiếu so với hợp đồng — không tính lương tại đây.</p>
      </BKSectionCard>

      <p className="px-1 text-[16px] font-extrabold text-[#16224D]">Chi tiết theo lớp</p>
      {!d.lop.length ? <BKEmptyState icon="📚">Bạn chưa được phân công trợ giảng chính lớp nào đang học.</BKEmptyState>
        : d.lop.map((l, i) => {
          const tt = trangThaiLop(l)
          const tone = (['blue', 'yellow', 'pink', 'mint', 'purple', 'peach'] as const)[i % 6]
          return (
            <BKSectionCard key={l.lop_id} tone={tone}>
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="text-[36px] leading-none">📚</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-extrabold text-[#16224D]">Lớp {l.ten_lop}</p>
                  <p className="text-[11.5px] text-[#63709A]">{l.buoi_tuan} buổi/tuần{l.buoi_vang ? ` · vắng ${l.buoi_vang} buổi (đã xin phép)` : ''}{l.khong_ro_chinh ? ' · ⚠ chưa rõ TA chính' : ''}</p>
                </div>
                <BKStatusPill status={tt.st}>{tt.st === 'dat' ? '⭐' : '❗'} {tt.text}</BKStatusPill>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {CHI_SO.map((c) => <BKMetricTile key={c.key} icon={c.icon} label={c.label} thuc={thuc(l, c.key)} chuan={chuan(l, c.key)} />)}
              </div>
            </BKSectionCard>
          )
        })}

      <BKSectionCard tone="purple">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span className="text-[36px] leading-none">🎧</span>
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-extrabold text-[#16224D]">Bổ trợ</p>
            <p className="text-[11.5px] text-[#63709A]">Theo bạn (không theo lớp) · {d.botro.so_ca} ca đã đứng · ca không ghi giờ tính 1h</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1"><BKMetricTile icon="⏱" label="Giờ bổ trợ" thuc={d.botro.thuc_gio} chuan={d.botro.chuan_gio} unit="h" /></div>
      </BKSectionCard>
    </div>
  )
}
