// Tab "Trạng thái ca bổ trợ" (PLAN-botro-yeu.md bước 5/10) — theo dõi tiến độ TỪNG case đang mở,
// không phân biệt ai đang xử lý. Thanh 4 bước: Xếp lịch → Bổ trợ → Đánh giá & test sau buổi →
// Retest. Giai đoạn PURE-DERIVE từ dữ liệu con (buổi + dạng day_at/dong_at), không lưu cột riêng.
import { useEffect, useState } from 'react'
import { layTienDoCa, type TienDoCase } from '../../lib/botro_yeu'

const STEPS = ['Xếp lịch', 'Bổ trợ', 'Đánh giá & test', 'Retest'] as const

// Bước hoàn thành tới đâu (0-4) suy từ TienDoCase — dùng chung 1 hàm để card + về sau tái dùng được.
function buocXong(c: TienDoCase): number {
  if (!c.buoiGanNhat) return 0
  if (c.soDaDay < c.soDang) return 1
  if (!c.buoiGanNhat.danh_gia_xong_at) return 2
  if (c.soDaDong < c.soDang) return 3
  return 4
}

export default function TrangThaiCaBoTroScreen() {
  const [items, setItems] = useState<TienDoCase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { layTienDoCa().then(setItems).finally(() => setLoading(false)) }, [])

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-6">
          <h1 className="text-[22px] font-bold text-slate-800">Trạng thái ca bổ trợ</h1>
          <p className="mt-1 text-[13px] text-slate-500">Tiến độ từng case đang mở — không phân biệt ai đang xử lý.</p>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Chưa có case nào đang mở.</div>
        ) : (
          <div className="space-y-3">
            {items.map((c) => {
              const xong = buocXong(c)
              const ket = xong === 4
              return (
                <div key={c.id} className={`rounded-2xl bg-white p-4 ring-1 ${ket ? 'ring-emerald-200' : 'ring-slate-200'}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-semibold text-slate-800">{c.ho_ten} <span className="font-normal text-slate-400">· {c.mon}</span></div>
                      <div className="mt-0.5 text-[11px] text-slate-400">{c.soDang} dạng · đã dạy {c.soDaDay} · đã đóng {c.soDaDong}</div>
                    </div>
                    {ket && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">Hoàn thành</span>}
                  </div>
                  <div className="flex items-center">
                    {STEPS.map((label, i) => {
                      const done = i < xong
                      const current = i === xong
                      return (
                        <div key={label} className="flex flex-1 flex-col items-center">
                          <div className="flex w-full items-center">
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                              done ? 'bg-emerald-500 text-white' : current ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-slate-100 text-slate-400'
                            }`}>{done ? '✓' : i + 1}</div>
                            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                          </div>
                          <div className={`mt-1.5 text-center text-[11px] ${current ? 'font-semibold text-indigo-700' : done ? 'text-slate-500' : 'text-slate-400'}`}>{label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
