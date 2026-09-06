// Màn HƯỚNG DẪN (ảnh gốc anhgoc_huongdan + backdrop_huongdan + kit GUIDANCE_SCREEN_SVG_ASSET_KIT, CEO 07/09):
// ô "Tìm quy trình..." + mầm cây "Tìm nhanh hơn nè! ♡", lưới 2×3 card pastel (icon kit · tiêu đề 2 dòng · mô tả ·
// câu chữ tay · mũi tên), bấm → bottom sheet: icon · tiêu đề · mô tả · nút "Xem chi tiết →" · "Tóm tắt các bước"
// 4 bước đánh số · mascot "Quy trình rõ ràng, làm dễ hơn! ♡". Nội dung = bảng quy_trinh (markdown, CEO đưa dần);
// bảng trống → 6 card gợi ý đúng design, đánh dấu "sắp có nội dung", không giả vờ có tài liệu.
// Bước = các dòng "1." "2."… (hoặc "- ") đầu tiên trong noi_dung; không có thì không vẽ dải bước.
import { useEffect, useMemo, useState } from 'react'
import { listQuyTrinh, type QuyTrinh } from '../../lib/quytrinh'
import { ddmmVN } from '../../lib/tuan'
import { BKBottomSheet } from './BKUI'

const H = (n: string) => `/bk-ui/hd_${n}.png`
// 6 chủ đề chuẩn theo design: khớp tiêu đề quy trình trong DB bằng regex → icon + màu; không khớp → mặc định
const CHU_DE: { re: RegExp; icon: string; bg: string; accent: string; tagline: string; nhan?: string }[] = [
  { re: /\bET\b/i, icon: H('et'), bg: '#CFE5FF', accent: '#2F73F6', tagline: 'Tài liệu mới nhất', nhan: '📖' },
  { re: /BTVN/i, icon: H('btvn'), bg: '#FFE3EC', accent: '#F06292', tagline: 'Học hiệu quả hơn! ♡' },
  { re: /bổ trợ/i, icon: H('botro'), bg: '#FFF1C9', accent: '#F8B83E', tagline: 'Cùng học – Cùng tiến bộ! ♡' },
  { re: /điểm danh/i, icon: H('diemdanh'), bg: '#DDF6E4', accent: '#4DC47A', tagline: 'Kỷ luật tạo nên chất lượng! ♡' },
  { re: /phụ huynh|báo cáo/i, icon: H('baocao'), bg: '#E6DDFF', accent: '#8B6BEF', tagline: 'Kết nối gia đình – Đồng hành cùng con! ♡' },
  { re: /thư viện|tài liệu/i, icon: H('thuvien'), bg: '#D6ECFF', accent: '#56B6F2', tagline: 'Nhiều tài liệu hữu ích! ♡' },
]
const MAC_DINH = { icon: H('thuvien'), bg: '#E4ECFB', accent: '#2F73F6', tagline: 'Hiểu rõ hơn · Làm tốt hơn! ♡' }
const chuDe = (s: string) => CHU_DE.find((c) => c.re.test(s)) ?? MAC_DINH

const GOI_Y: { tieu_de: string; tom_tat: string }[] = [
  { tieu_de: 'Quy trình chấm ET', tom_tat: 'Hướng dẫn chi tiết các bước chấm ET' },
  { tieu_de: 'Quy trình chấm BTVN', tom_tat: 'Quy trình chấm & phản hồi BTVN' },
  { tieu_de: 'Quy trình bổ trợ', tom_tat: 'Quy trình hỗ trợ HS yếu và nâng cao' },
  { tieu_de: 'Quy trình điểm danh', tom_tat: 'Hướng dẫn điểm danh và xử lý vắng mặt' },
  { tieu_de: 'Quy trình báo cáo phụ huynh', tom_tat: 'Các bước tổng hợp và gửi báo cáo' },
  { tieu_de: 'Thư viện tài liệu', tom_tat: 'Biểu mẫu, mẫu tin nhắn, tài liệu tham khảo' },
]

type Card = { id: string; tieu_de: string; tom_tat: string | null; noi_dung: string | null; updated_at: string | null }
// tách tối đa 4 bước từ markdown: dòng bắt đầu "1." / "1)" / "- " / "• "
function tachBuoc(md: string | null): string[] {
  if (!md) return []
  return md.split('\n').map((l) => l.trim()).filter((l) => /^(\d+[.)]|[-•*])\s+/.test(l)).map((l) => l.replace(/^(\d+[.)]|[-•*])\s+/, '')).slice(0, 4)
}

export function HuongDanScreen({ vaiTro }: { vaiTro: string }) {
  const [ds, setDs] = useState<QuyTrinh[] | null>(null)
  const [q, setQ] = useState('')
  const [mo, setMo] = useState<Card | null>(null)
  const [chiTiet, setChiTiet] = useState(false)
  useEffect(() => { listQuyTrinh(vaiTro).then(setDs).catch(() => setDs([])) }, [vaiTro])

  const cards: Card[] = useMemo(() => {
    const src: Card[] = ds && ds.length
      ? ds.map((x) => ({ id: x.id, tieu_de: x.tieu_de, tom_tat: x.tom_tat, noi_dung: x.noi_dung, updated_at: x.updated_at }))
      : GOI_Y.map((g, i) => ({ id: `goi-y-${i}`, tieu_de: g.tieu_de, tom_tat: g.tom_tat, noi_dung: null, updated_at: null }))
    const kw = q.trim().toLowerCase()
    return kw ? src.filter((c) => c.tieu_de.toLowerCase().includes(kw) || (c.tom_tat ?? '').toLowerCase().includes(kw)) : src
  }, [ds, q])
  const cdMo = mo ? chuDe(mo.tieu_de) : null
  const buoc = tachBuoc(mo?.noi_dung ?? null)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      {/* ô tìm + mầm cây "Tìm nhanh hơn nè!" (design) */}
      <div className="flex items-center gap-1">
        <div className="relative min-w-0 flex-1">
          <img src={H('kinh_lup')} alt="" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 object-contain" draggable={false} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm quy trình..."
            className="w-full rounded-full bg-white py-2.5 pl-10 pr-8 text-[13px] text-[#16224D] outline-none placeholder:text-[#9AA5C4] focus:ring-2 focus:ring-[#2F73F6]/30" />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#FFD84D]">✦</span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 pr-1">
          <img src={H('mascot_tim')} alt="" className="h-10 w-10 object-contain" draggable={false} />
          <span className="font-hand -rotate-6 text-[10px] italic leading-tight text-[#2F73F6]">Tìm nhanh<br />hơn nè! ♡</span>
        </div>
      </div>

      {ds === null ? <p className="text-center text-[13px] text-[#63709A]">Đang tải…</p> : (
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-1 overflow-y-auto">
          {cards.map((c) => {
            const cd = chuDe(c.tieu_de)
            const chuaCo = !c.noi_dung
            return (
              <button key={c.id} onClick={() => { setMo(c); setChiTiet(false) }}
                className="relative flex min-h-[112px] items-stretch gap-1 rounded-[18px] p-2 text-left active:scale-[.98]" style={{ background: cd.bg }}>
                <span className="pointer-events-none absolute left-2 top-1 text-[11px] text-[#FFD84D]">✦</span>
                <img src={cd.icon} alt="" className="w-[40%] shrink-0 self-center object-contain drop-shadow-sm" draggable={false} />
                <div className="flex min-w-0 flex-1 flex-col pt-1">
                  <p className="font-bubble whitespace-pre-line text-[13px] font-extrabold leading-[1.1] text-[#16224D]">{c.tieu_de.replace(/^Quy trình /, 'Quy trình\n')}</p>
                  {c.tom_tat && <p className="mt-0.5 line-clamp-2 text-[9px] leading-snug text-[#63709A]">{c.tom_tat}</p>}
                  <div className="mt-auto flex items-end justify-between gap-1 pt-1">
                    <span className="font-hand min-w-0 text-[9px] italic leading-tight" style={{ color: cd.accent }}>
                      {chuaCo ? 'sắp có nội dung' : c.updated_at ? `📘 cập nhật ${ddmmVN(c.updated_at.slice(0, 10))}` : cd.tagline}
                    </span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white" style={{ background: cd.accent }}>›</span>
                  </div>
                </div>
              </button>
            )
          })}
          {!cards.length && <p className="col-span-2 text-center text-[12.5px] text-[#63709A]">Không có quy trình khớp "{q}".</p>}
        </div>
      )}

      <BKBottomSheet open={!!mo} onClose={() => setMo(null)}>
        {mo && cdMo && (
          <div>
            <div className="flex items-start gap-2.5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" style={{ background: cdMo.bg }}>
                <img src={cdMo.icon} alt="" className="h-14 w-14 object-contain" draggable={false} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bubble text-[18px] font-extrabold leading-tight text-[#16224D]">{mo.tieu_de}</p>
                {mo.tom_tat && <p className="mt-0.5 text-[12px] text-[#63709A]">{mo.tom_tat}</p>}
              </div>
              {mo.noi_dung && !chiTiet && <button onClick={() => setChiTiet(true)} className="shrink-0 rounded-full bg-[#2F73F6] px-3.5 py-2 text-[12.5px] font-bold text-white shadow">Xem chi tiết →</button>}
            </div>
            {!mo.noi_dung ? (
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#FFF6D6] px-3 py-2">
                <img src={H('mascot_popup')} alt="" className="h-12 w-12 object-contain" draggable={false} />
                <p className="text-[12.5px] text-[#B87800]">Quy trình này chưa có nội dung — BK sẽ bổ sung dần.</p>
              </div>
            ) : chiTiet ? (
              <div className="mt-3 max-h-[55vh] overflow-y-auto whitespace-pre-wrap text-[13.5px] leading-relaxed text-[#16224D]">{mo.noi_dung}</div>
            ) : (
              <>
                {buoc.length > 0 && (
                  <>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#16224D]"><img src={H('bullets')} alt="" className="h-4 w-4" draggable={false} />Tóm tắt các bước</p>
                      <span className="font-hand flex items-center gap-1 -rotate-3 text-[10px] italic leading-tight text-[#2F73F6]">Quy trình rõ ràng<br />Làm dễ hơn! ♡<img src={H('mascot_popup')} alt="" className="h-9 w-9 object-contain" draggable={false} /></span>
                    </div>
                    <div className="mt-2 flex items-stretch gap-1">
                      {buoc.map((b, i) => (
                        <div key={i} className="flex flex-1 items-center gap-1">
                          <div className="flex min-w-0 flex-1 flex-col items-center rounded-2xl bg-[#EEF3FF] px-1.5 py-2 text-center">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F73F6] text-[10px] font-extrabold text-white">{i + 1}</span>
                            <p className="mt-1 line-clamp-3 text-[9.5px] font-semibold leading-tight text-[#16224D]">{b}</p>
                          </div>
                          {i < buoc.length - 1 && <span className="text-[12px] text-[#9AA5C4]">›</span>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {!buoc.length && <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-[13px] text-[#63709A]">{mo.noi_dung}</p>}
              </>
            )}
          </div>
        )}
      </BKBottomSheet>
    </div>
  )
}
