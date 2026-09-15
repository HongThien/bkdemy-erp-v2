// Màn TIẾN TRÌNH app TA (ảnh gốc anhgoc_tientrinh + backdrop_tientrinh + kit PROGRESS_SCREEN_SVG_ASSETS, CEO
// 07/09): thẻ "Tổng tiến trình tháng" (vương miện · vòng % · pill lời nhắn · biểu đồ · mascot ghi chú · dòng ℹ),
// tiêu đề "Chi tiết theo lớp" + nhãn tháng, rồi MỖI LỚP 1 card pastel (icon sách · Lớp X · buổi/tuần · pill
// trạng thái · chevron) chứa 3 tile KPI trắng (Trợ giảng buổi · Chấm BTVN · Chấm ET: vòng % + thực/chuẩn + pill
// Đạt chuẩn/Thiếu N lần/Cần bổ sung). Bổ trợ là card riêng theo TA (dữ liệu bổ trợ không gắn lớp — CEO 07/09).
// Danh sách lớp CUỘN NỘI BỘ → cả màn không cuộn. Chuẩn = hợp đồng cố định (ta_dinh_muc); số tính ở
// fn_ta_tien_trinh. KHÔNG dùng tính lương (CEO: "để theo dõi, không phải tính lương") — không chép câu "tính hỗ
// trợ TA hàng tháng" trong ảnh design.
import { useEffect, useState, type ReactNode } from 'react'
import { taTienTrinh, type TaTienTrinh, type TienTrinhLop } from '../../lib/tatientrinh'
import { BKProgressRing, BKEmptyState, BK } from '../../components/bk/BKUI'

// Icon = bộ CEO up 07/09 (tientrinh1–10.png, 9.png — nền trong, 1254px) tách thành pr_*.png; không còn icon cắt tay/SVG.
const P = (n: string) => `/bk-ui/pr_${n}.png`
const Ico = ({ n, cls = 'h-3.5 w-3.5' }: { n: string; cls?: string }) => <img src={P(n)} alt="" className={`${cls} object-contain`} draggable={false} />
type Key = 'buoi' | 'btvn' | 'et'
const CHI_SO: { key: Key; label: string; icon: ReactNode }[] = [
  { key: 'buoi', label: 'Trợ giảng buổi', icon: <Ico n="nguoi" /> },
  { key: 'btvn', label: 'Chấm BTVN', icon: <Ico n="btvn" /> },
  { key: 'et', label: 'Chấm ET', icon: <Ico n="et" /> },
]
const thuc = (l: TienTrinhLop, k: Key) => l[`${k}_thuc`]
const chuan = (l: TienTrinhLop, k: Key) => l[`${k}_chuan`]
// màu card lớp xoay vòng theo design (xanh · vàng · hồng) + icon sách tương ứng
const LOP_TONE = [
  { bg: '#C9E6FE', icon: P('lop_a') }, { bg: '#FDEFD2', icon: P('lop_b') }, { bg: '#FCDDEF', icon: P('lop_c') },
]

type St = 'dat' | 'thieu' | 'nguy'
function trangThai(thieu: number): { st: St; text: string; sub: string } {
  if (thieu === 0) return { st: 'dat', text: 'Đủ chuẩn', sub: 'Tuyệt vời! Tiếp tục phát huy nhé!' }
  if (thieu <= 1) return { st: 'thieu', text: 'Thiếu 1 lần', sub: 'Cố lên! Bạn sắp đạt chuẩn rồi!' }
  return { st: 'nguy', text: 'Cần bổ sung', sub: `Còn thiếu ${thieu} — vài tiêu chí chưa đạt` }
}
const ST_CLS: Record<St, { pill: string; text: string; icon: (cls?: string) => ReactNode; chevron: string; ring: string }> = {
  dat: { pill: 'bg-[#E4F8EC]', text: 'text-[#1E8A52]', icon: (cls) => <Ico n="star" cls={cls} />, chevron: 'chevron', ring: BK.success },
  thieu: { pill: 'bg-[#FFF1D6]', text: 'text-[#C27A00]', icon: (cls) => <Ico n="warn_cam" cls={cls} />, chevron: 'chevron_cam', ring: BK.warning },
  nguy: { pill: 'bg-[#FFE3EA]', text: 'text-[#C0355A]', icon: (cls) => <Ico n="warn_do" cls={cls} />, chevron: 'chevron_hong', ring: BK.danger },
}

// tile KPI trắng như design: icon + nhãn · vòng % + thực/chuẩn · pill trạng thái
function Tile({ icon, label, th, ch, unit }: { icon: ReactNode; label: string; th: number; ch: number; unit?: string }) {
  const lech = th - ch
  const st: St = lech >= 0 ? 'dat' : lech >= -1 ? 'thieu' : 'nguy'
  const pct = ch > 0 ? Math.round((100 * Math.min(th, ch)) / ch) : 100
  const c = ST_CLS[st]
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/95 px-1 py-1.5 text-center">
      <p className="flex items-center gap-1 text-[9.5px] font-bold leading-tight text-[#16224D]">{icon}{label}</p>
      <div className="mt-1 flex items-center justify-center gap-1">
        <BKProgressRing pct={pct} size={30} stroke={4.5} color={c.ring} />
        <span className="text-[13px] font-extrabold text-[#16224D]">{fmt(th)}/{fmt(ch)}{unit ?? ''}</span>
      </div>
      <span className={`mt-1 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${c.pill} ${c.text}`}>
        {c.icon()}{st === 'dat' ? 'Đạt chuẩn' : unit ? `Thiếu ${fmt(-lech)}${unit}` : st === 'thieu' ? 'Thiếu 1 lần' : `Thiếu ${-lech} lần`}
      </span>
    </div>
  )
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
  const [nam, thang] = ym.split('-')

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      {/* thẻ tổng — đúng ảnh gốc: vương miện + tiêu đề, vòng %, pill lời nhắn + text, biểu đồ, mascot ghi chú, dòng ℹ */}
      <div className="relative overflow-hidden rounded-[20px] px-2.5 py-2" style={{ background: '#D6EDFC' }}>
        <span className="pointer-events-none absolute left-2 top-[46px] text-[12px] text-[#FFD84D]">✦</span>
        <div className="flex items-center gap-1.5">
          <img src={P('crown')} alt="" className="h-6 w-7 object-contain" draggable={false} />
          <div className="min-w-0 leading-tight">
            <p className="font-bubble text-[15px] font-extrabold text-[#16224D]">Tổng tiến trình tháng</p>
            <p className="text-[10px] text-[#63709A]">Dựa trên {d.lop.length} lớp bạn phụ trách + bổ trợ</p>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <BKProgressRing pct={pct ?? 0} size={66} stroke={8} color={color}><span className="text-[15px] font-extrabold text-[#16224D]">{pct == null ? '—' : `${pct}%`}</span></BKProgressRing>
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-xl bg-[#EAE2FF] px-2.5 py-0.5 text-[11.5px] font-bold text-[#6A4BD6]">{loi}</span>
            {/* CEO 07/09: KHÔNG ghi "chuẩn hợp đồng"/lương ở đây — chỉ câu động viên như design */}
            <p className="font-hand mt-1 text-[10.5px] italic leading-snug text-[#63709A]">Tiếp tục duy trì để đạt đầy đủ chuẩn nhé! ♡</p>
          </div>
          <img src={P('chart')} alt="" className="h-12 w-11 shrink-0 object-contain" draggable={false} />
          <img src={P('mascot_note')} alt="" className="h-[68px] w-[54px] shrink-0 object-contain" draggable={false} />
        </div>
        <p className="mt-1 flex items-center gap-1 rounded-xl bg-white/70 px-2 py-1 text-[9.5px] text-[#63709A]"><img src={P('info')} alt="" className="h-3.5 w-3.5" draggable={false} />Tiến trình dùng để đánh giá KPI hàng tháng.</p>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="font-bubble text-[15px] font-extrabold text-[#16224D]">Chi tiết theo lớp</p>
        <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#2F73F6]"><img src={P('calendar')} alt="" className="h-3.5 w-3.5" draggable={false} />Tháng này ({thang}/{nam})</span>
      </div>

      {/* danh sách lớp + bổ trợ — cuộn nội bộ */}
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {!d.lop.length ? <BKEmptyState icon="📚">Bạn chưa được phân công trợ giảng chính lớp nào đang học.</BKEmptyState>
          : d.lop.map((l, i) => {
            const thieu = CHI_SO.reduce((s, c) => s + Math.max(0, chuan(l, c.key) - thuc(l, c.key)), 0)
            const tt = trangThai(thieu)
            const sc = ST_CLS[tt.st]
            const tone = LOP_TONE[i % LOP_TONE.length]
            return (
              <div key={l.lop_id} className="rounded-[20px] p-2" style={{ background: tone.bg }}>
                <div className="mb-1.5 flex items-center gap-2">
                  <img src={tone.icon} alt="" className="h-11 w-12 shrink-0 object-contain" draggable={false} />
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="font-bubble text-[15px] font-extrabold text-[#16224D]">Lớp {l.ten_lop}</p>
                    <p className="text-[10px] text-[#63709A]">{l.buoi_tuan} buổi/tuần{l.buoi_vang ? ` · vắng ${l.buoi_vang} (đã xin phép)` : ''}{l.khong_ro_chinh ? ' · ⚠ chưa rõ TA chính' : ''}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 rounded-full px-2 py-1 ${sc.pill}`}>
                    {sc.icon('h-5 w-5')}
                    <div className="leading-tight">
                      <p className={`text-[11px] font-extrabold ${sc.text}`}>{tt.text}</p>
                      <p className="text-[7.5px] text-[#63709A]">{tt.sub}</p>
                    </div>
                    <Ico n={sc.chevron} cls="h-3.5 w-3" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {CHI_SO.map((c) => <Tile key={c.key} icon={c.icon} label={c.label} th={thuc(l, c.key)} ch={chuan(l, c.key)} />)}
                </div>
              </div>
            )
          })}
        <div className="rounded-[20px] p-2" style={{ background: '#E6DDFF' }}>
          <div className="mb-1.5 flex items-center gap-2">
            <Ico n="tai_nghe" cls="h-10 w-11 shrink-0" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="font-bubble text-[15px] font-extrabold text-[#16224D]">Bổ trợ</p>
              <p className="text-[10px] text-[#63709A]">Theo bạn (không theo lớp) · {d.botro.so_ca} ca đã đứng · ca không ghi giờ tính 1h</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1"><Tile icon={<Ico n="tai_nghe" />} label="Giờ bổ trợ" th={d.botro.thuc_gio} ch={d.botro.chuan_gio} unit="h" /></div>
        </div>
      </div>
    </div>
  )
}
