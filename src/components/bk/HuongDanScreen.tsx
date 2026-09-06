// Màn HƯỚNG DẪN (design 06): ô tìm, lưới 2 cột card pastel, bấm → bottom sheet (tóm tắt + xem chi
// tiết). Nội dung từ bảng quy_trinh (markdown, CEO đưa dần); bảng trống → hiện 5 card gợi ý theo
// handoff (đánh dấu "chưa có nội dung"), không giả vờ có tài liệu.
import { useEffect, useMemo, useState } from 'react'
import { listQuyTrinh, type QuyTrinh } from '../../lib/quytrinh'
import { ddmmVN } from '../../lib/tuan'
import { BKBottomSheet, type BKTone } from './BKUI'

const GOI_Y: { tieu_de: string; tom_tat: string }[] = [
  { tieu_de: 'Quy trình chấm ET', tom_tat: 'Hướng dẫn chi tiết các bước chấm ET' },
  { tieu_de: 'Quy trình chấm BTVN', tom_tat: 'Quy trình chấm & phản hồi BTVN' },
  { tieu_de: 'Quy trình bổ trợ', tom_tat: 'Quy trình hỗ trợ HS yếu và nâng cao' },
  { tieu_de: 'Quy trình điểm danh', tom_tat: 'Hướng dẫn điểm danh và xử lý vắng mặt' },
  { tieu_de: 'Quy trình báo cáo phụ huynh', tom_tat: 'Các bước tổng hợp và gửi báo cáo' },
]
const TONES: BKTone[] = ['blue', 'pink', 'yellow', 'mint', 'purple', 'peach']
const TONE_CLS: Record<BKTone, string> = {
  blue: 'bg-[#DDF4FF] border-[#BFE3FF]', pink: 'bg-[#FFE3EA] border-[#FFC3D2]', yellow: 'bg-[#FFF6D6] border-[#FFE59A]',
  mint: 'bg-[#DDF7E8] border-[#BDF0D6]', purple: 'bg-[#EAE2FF] border-[#D6C8FF]', peach: 'bg-[#FFE7D6] border-[#FFD3B1]',
}
const ICON: [RegExp, string][] = [[/ET/, '📝'], [/BTVN/i, '📒'], [/bổ trợ/i, '💡'], [/điểm danh/i, '📋'], [/phụ huynh|báo cáo/i, '📊'], [/thư viện|tài liệu/i, '📁']]
const iconCho = (s: string) => ICON.find(([re]) => re.test(s))?.[1] ?? '📖'

type Card = { id: string; tieu_de: string; tom_tat: string | null; noi_dung: string | null; updated_at: string | null }

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

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#9AA5C4]">🔍</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm quy trình..."
          className="w-full rounded-full bg-white py-3 pl-12 pr-4 text-[14px] text-[#16224D] shadow-[0_4px_14px_rgba(22,34,77,.08)] outline-none placeholder:text-[#9AA5C4] focus:ring-2 focus:ring-[#2F73F6]/30" />
      </div>
      {ds === null ? <p className="text-center text-[13px] text-[#63709A]">Đang tải…</p> : (
        <div className="grid grid-cols-2 gap-1">
          {cards.map((c, i) => {
            const tone = TONES[i % TONES.length]
            const chuaCo = !c.noi_dung
            return (
              <button key={c.id} onClick={() => { setMo(c); setChiTiet(false) }}
                className={`relative min-h-[150px] rounded-3xl border p-3.5 text-left shadow-[0_4px_14px_rgba(22,34,77,.06)] active:scale-[.98] ${TONE_CLS[tone]}`}>
                <span className="pointer-events-none absolute right-3 top-2 text-[12px] text-[#FFD84D]">✦</span>
                <span className="text-[40px] leading-none">{iconCho(c.tieu_de)}</span>
                <p className="mt-1.5 text-[15px] font-extrabold leading-tight text-[#16224D]">{c.tieu_de}</p>
                {c.tom_tat && <p className="mt-0.5 text-[11.5px] leading-snug text-[#63709A]">{c.tom_tat}</p>}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10.5px] italic font-semibold text-[#2F73F6]">{chuaCo ? '📄 sắp có nội dung' : c.updated_at ? `📘 cập nhật ${ddmmVN(c.updated_at.slice(0, 10))}` : ''}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[14px] font-bold text-[#2F73F6]">›</span>
                </div>
              </button>
            )
          })}
          {!cards.length && <p className="col-span-2 text-center text-[12.5px] text-[#63709A]">Không có quy trình khớp "{q}".</p>}
        </div>
      )}

      <BKBottomSheet open={!!mo} onClose={() => setMo(null)}>
        {mo && (
          <div>
            <div className="flex items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DDF4FF] text-[30px]">{iconCho(mo.tieu_de)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[18px] font-extrabold text-[#16224D]">{mo.tieu_de}</p>
                {mo.tom_tat && <p className="text-[12.5px] text-[#63709A]">{mo.tom_tat}</p>}
              </div>
              {mo.noi_dung && !chiTiet && <button onClick={() => setChiTiet(true)} className="shrink-0 rounded-full bg-[#2F73F6] px-3.5 py-2 text-[12.5px] font-bold text-white">Xem chi tiết →</button>}
            </div>
            <div className="mt-4">
              {!mo.noi_dung ? <p className="rounded-2xl bg-[#FFF6D6] px-3 py-2 text-[12.5px] text-[#B87800]">Quy trình này chưa có nội dung — BK sẽ bổ sung dần.</p>
                : chiTiet ? <div className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-[#16224D]">{mo.noi_dung}</div>
                : <p className="line-clamp-4 whitespace-pre-wrap text-[13px] text-[#63709A]">{mo.noi_dung}</p>}
            </div>
          </div>
        )}
      </BKBottomSheet>
    </div>
  )
}
