// Tổng quan phòng — cột to = 1 ngày, MỖI PHÒNG LÀ 1 CỘT NHỎ bên trong cột ngày đó (Thùy chốt: theo dõi
// 1 phòng dọc xuống theo khung giờ dễ hơn soi từng ô nhỏ trong lưới 3×3). Trục dọc = KHUNG 30 PHÚT đều
// suốt ngày (1 giờ = khúc to gộp 2 khúc nhỏ 30p — viền đậm hơn ở đầu mỗi giờ để phân nhóm); ca dài hơn
// 1 khung tô kín MỌI khung nó chồng lấn (overlap thật theo giờ_bắt_đầu/giờ_kết_thúc, không chỉ xét giờ
// bắt đầu). Trống = không màu. Sáng/Chiều/Tối chỉ là filter gộp khung để ẩn/hiện, không phải trục dữ liệu.
// Chỉ hiện 1 SỐ NGÀY vừa màn hình (mặc định 4) thay vì cả tuần — cuộn ngang 42 cột (7 ngày × 6 phòng)
// quá rối; ‹ › chuyển từng cụm ngày.
import { useEffect, useMemo, useState } from 'react'
import { listPhong, lichPhongNgay, type Phong, type KhoiBanPhong } from '../../lib/phong'
import { CA_TRUC_DEF, CA_TRUC_LIST, type CaTruc } from '../../lib/opsvanhanh'

const SO_NGAY_HIEN = 4

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const toMin = (t: string): number => { const [h, m] = t.slice(0, 5).split(':').map(Number); return h * 60 + m }
const fmtHM = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`

type KhungGio = { ten: string; lo: number; hi: number; an?: boolean; dauGio?: boolean }
// Khung 30 phút ĐỀU suốt ngày, 7:00→21:30 (khung đầu bắt TỪ 0, khung cuối bắt TỚI hết ngày — hứng ca
// lệch sớm/muộn hơn dự kiến, cùng kiểu "catch-all 2 đầu" TKBScreen đang dùng). `dauGio` = khung ":00"
// (đầu giờ chẵn) để vẽ viền đậm phân nhóm "1 giờ = 2 khung 30p". `an` = khung nằm TRỌN trong giờ trưa
// 12h–14h → tự ẩn khi rỗng.
function buildBands(): KhungGio[] {
  const BD = 420, KT = 1290 // 7:00 → 21:30
  const out: KhungGio[] = []
  for (let m = BD; m < KT; m += 30) {
    const lo = m === BD ? 0 : m
    const hi = m + 30 >= KT ? 1440 : m + 30
    out.push({ ten: `${fmtHM(m)}–${fmtHM(m + 30)}`, lo, hi, an: m >= 720 && m + 30 <= 840, dauGio: m % 60 === 0 })
  }
  return out
}
const OVERVIEW_BANDS = buildBands()
// Buổi của 1 khung suy theo mốc CA_TRUC_DEF (sang kết thúc 12:00, chiều kết thúc 18:00) — khung nằm
// trong giờ trưa (12h–14h) xếp tạm vào Chiều để có chỗ bật/tắt, thực tế gần như luôn ẩn (an:true).
function buoiOfBand(b: KhungGio): CaTruc {
  if (b.lo < toMin(CA_TRUC_DEF.sang.to)) return 'sang'
  if (b.lo < toMin(CA_TRUC_DEF.chieu.to)) return 'chieu'
  return 'toi'
}

function addDays(ngay: string, n: number): string {
  const d = new Date(ngay + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
}
const ddmm = (ngay: string) => { const d = new Date(ngay + 'T00:00:00'); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}` }
const THU_LABEL = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
const thuLabelOf = (ngay: string) => THU_LABEL[new Date(ngay + 'T00:00:00').getDay()]

// 1 màu RIÊNG/phòng, xoay vòng nếu danh mục vượt bảng màu — chip ĐẶC (không pill mềm) vì đây là
// heatmap nhận diện nhanh theo màu, khác card trạng thái thường của hệ Apple-clean.
const PALETTE = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6', '#14b8a6', '#ea580c', '#ec4899']

export default function TongQuanTuanScreen() {
  const [rangeStart, setRangeStart] = useState(today())
  const [phongs, setPhongs] = useState<Phong[]>([])
  const [byDay, setByDay] = useState<Record<string, KhoiBanPhong[]>>({})
  const [loading, setLoading] = useState(true)
  const [buoiOn, setBuoiOn] = useState<Record<CaTruc, boolean>>({ sang: true, chieu: true, toi: true })

  const days = useMemo(() => Array.from({ length: SO_NGAY_HIEN }, (_, i) => addDays(rangeStart, i)), [rangeStart])
  const mauCuaPhong = useMemo(() => new Map(phongs.map((p, i) => [p.ma_phong, PALETTE[i % PALETTE.length]])), [phongs])

  async function load() {
    setLoading(true)
    try {
      const [ps, ...ks] = await Promise.all([listPhong(), ...days.map((d) => lichPhongNgay(d))])
      setPhongs(ps)
      setByDay(Object.fromEntries(days.map((d, i) => [d, ks[i]])))
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [rangeStart]) // eslint-disable-line

  // Ca thuộc khung nếu KHOẢNG THỜI GIAN chồng lấn khung (overlap thật) — ca dài hơn 1 khung 30p tô kín
  // hết các khung nó lấn qua, không chỉ khung nó bắt đầu.
  const trongKhung = (k: KhoiBanPhong, b: KhungGio) => {
    const bd = toMin(k.gio_bat_dau), kt = toMin(k.gio_ket_thuc)
    return kt > b.lo && bd < b.hi
  }

  // Khung "an" (giờ trưa) chỉ hiện khi CÓ dữ liệu ở BẤT KỲ ngày nào đang xem — ẩn mặc định để đỡ chiếm
  // chỗ (hàng phải ẩn/hiện ĐỒNG BỘ cả cụm ngày, không thể ẩn riêng từng ô).
  const bandsHienThi = OVERVIEW_BANDS.filter((b) => buoiOn[buoiOfBand(b)] && (!b.an || days.some((d) => (byDay[d] ?? []).some((k) => trongKhung(k, b)))))

  // Gộp các khung LIÊN TIẾP cùng (ngày × phòng) có CÙNG tập hoạt động (so ref_id) thành 1 ô rowSpan —
  // 1 ca 90p (3 khung 30p) phải hiện thành 1 khối liền, không phải 3 ô vuông xếp chồng. Chỉ gộp khi
  // Ô CÓ DÙNG (trống thì giữ từng khung 1 ô như cũ, khỏi mất cảm giác lưới). "isStart" đánh dấu ô nào
  // thật sự render <td rowSpan> — các hàng bị nó phủ (covered) KHÔNG render <td> nào (đúng luật bảng
  // HTML: hàng sau bỏ hẳn ô ở vị trí đã bị rowSpan từ hàng trước choán).
  type OCell = { isStart: boolean; span: number; used: boolean; hoatDong: KhoiBanPhong[] }
  const grid = useMemo(() => {
    const map = new Map<string, OCell>()
    for (const d of days) {
      const khoi = byDay[d] ?? []
      for (const p of phongs) {
        const cuaTaiBand = (idx: number) => khoi.filter((k) => k.phong_ma === p.ma_phong && trongKhung(k, bandsHienThi[idx]))
        let i = 0
        while (i < bandsHienThi.length) {
          const cua0 = cuaTaiBand(i)
          const sig0 = cua0.map((k) => k.ref_id).sort().join(',')
          let j = i + 1
          if (sig0) { // chỉ gộp khung CÓ hoạt động, cùng đúng tập hoạt động (ca đổi/kết thúc → tách ô)
            while (j < bandsHienThi.length) {
              const sigJ = cuaTaiBand(j).map((k) => k.ref_id).sort().join(',')
              if (sigJ !== sig0) break
              j++
            }
          }
          const span = j - i
          for (let r = i; r < j; r++) map.set(`${d}|${p.id}|${r}`, { isStart: r === i, span, used: !!sig0, hoatDong: cua0 })
          i = j
        }
      }
    }
    return map
  }, [days, phongs, byDay, bandsHienThi]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f5f7]">
      <div className="shrink-0 p-6 pb-4">
        <div className="mx-auto max-w-[1600px]">
          <p className="mb-4 text-[13px] text-slate-500">Tổng quan trạng thái phòng — mỗi phòng 1 cột riêng trong từng ngày, theo khung 30 phút suốt ngày. Màu = phòng có ca chồng khung đó, trống = không màu. Sáng/Chiều/Tối chỉ là bộ lọc gộp khung để thu gọn. Xem chi tiết/thêm hoạt động ở tab "Lịch phòng".</p>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setRangeStart((r) => addDays(r, -SO_NGAY_HIEN))} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] text-slate-600 hover:bg-slate-50">‹</button>
            <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700">{ddmm(days[0])} – {ddmm(days[days.length - 1])}</span>
            <button onClick={() => setRangeStart((r) => addDays(r, SO_NGAY_HIEN))} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] text-slate-600 hover:bg-slate-50">›</button>
            <button onClick={() => setRangeStart(today())} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-50">Hôm nay</button>

            <div className="ml-2 flex gap-1 rounded-lg bg-slate-100 p-1">
              {CA_TRUC_LIST.map((c) => (
                <button key={c} onClick={() => setBuoiOn((s) => ({ ...s, [c]: !s[c] }))}
                  className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${buoiOn[c] ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  {CA_TRUC_DEF[c].label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1">
              {phongs.map((p) => (
                <span key={p.id} className="flex items-center gap-1.5 text-[12px] text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: mauCuaPhong.get(p.ma_phong) }} />
                  {p.ten_phong}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-6 pb-6">
        {loading ? <p className="text-[13px] text-slate-400">Đang tải…</p> : (
          <table className="mx-auto border-separate border-spacing-x-0.5 border-spacing-y-0">
            <thead>
              <tr>
                <th rowSpan={2} className="w-14"></th>
                {days.map((d) => (
                  <th key={d} colSpan={phongs.length}
                    className={`rounded-t-md py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${d === today() ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                    {thuLabelOf(d)} · {ddmm(d)}
                  </th>
                ))}
              </tr>
              <tr>
                {days.map((d) => phongs.map((p, pi) => (
                  <th key={`${d}-${p.id}`}
                    className={`bg-slate-100 pb-1 pt-0.5 text-center text-[9px] font-medium text-slate-500 ${pi === 0 ? 'rounded-l-sm' : ''} ${pi === phongs.length - 1 ? 'rounded-r-sm' : ''}`}
                    title={p.ten_phong}>
                    {p.ma_phong.replace(/^P/, '')}
                  </th>
                )))}
              </tr>
            </thead>
            <tbody>
              {bandsHienThi.length === 0 && (
                <tr><td colSpan={1 + days.length * phongs.length} className="py-8 text-center text-[12px] text-slate-300">— ẩn hết buổi —</td></tr>
              )}
              {bandsHienThi.map((b, ri) => (
                <tr key={b.ten}>
                  <td className={`px-1 text-center align-middle text-[10px] font-medium leading-tight text-slate-400 ${b.dauGio ? 'border-t-2 border-t-slate-300 pt-1.5 font-semibold text-slate-600' : ''}`}>
                    {b.dauGio ? b.ten.split('–')[0] : ''}
                  </td>
                  {days.map((d) => phongs.map((p) => {
                    const cell = grid.get(`${d}|${p.id}|${ri}`)
                    if (!cell || !cell.isStart) return null // hàng bị rowSpan từ trên phủ — KHÔNG render ô
                    const mau = mauCuaPhong.get(p.ma_phong)
                    // Tô màu THẲNG lên <td> (không qua div con) — div con dùng h-full/percentage-height
                    // KHÔNG ăn đúng chiều cao thật của ô rowSpan nhiều hàng (Thùy bắt lỗi bằng ảnh chụp:
                    // màu chỉ hiện viên nhỏ nổi ở đầu ô thay vì kéo dài hết khối). <td> tự nhiên đã có
                    // đúng chiều cao rowSpan sau layout, không cần tính lại.
                    // Ranh giới ngày dựa vào header colSpan (2 tầng ở trên) + border-spacing-x giữa các
                    // cột là đủ tách cụm — không thêm border-l riêng ở đây để tránh đụng độ với border
                    // dashed của ô trống (cùng thuộc tính border, Tailwind không đảm bảo thứ tự cascade
                    // giữa 2 utility áp lên các cạnh trùng nhau).
                    return (
                      <td key={`${d}-${p.id}`} rowSpan={cell.span}
                        title={cell.used ? `${p.ten_phong} — ${cell.hoatDong.map((k) => `${k.tieu_de} (${k.gio_bat_dau.slice(0, 5)}–${k.gio_ket_thuc.slice(0, 5)})`).join(', ')}` : `${p.ten_phong}: trống`}
                        className={`h-4 w-6 rounded-sm ${b.dauGio ? 'border-t-2 border-t-slate-300' : ''} ${cell.used ? '' : 'border border-dashed border-slate-200'}`}
                        style={cell.used ? { background: mau } : undefined}
                      />
                    )
                  }))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
