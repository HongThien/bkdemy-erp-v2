// Màn "Câu bị báo lỗi" (Thùy 10/10): học sinh báo lỗi TỪNG CÂU lúc luyện (nút ⚑ Báo lỗi trong màn làm bài) → gom theo CÂU, nhiều em báo cùng câu thì lên đầu.
// Xử lý theo CÂU: "Đã sửa" hoặc "Không phải lỗi" ⇒ mọi báo cáo đang mở của câu đó cùng đóng. Đọc: chức năng 'bdkt'; xử lý cần quyền ghi 'bdkt' (DB kiểm).
// Sau xử lý chỉ vá đúng dòng đó tại chỗ (CLAUDE §2) — không tải lại cả danh sách.
import { useCallback, useEffect, useState } from 'react'
import { dsBaoLoiCau, xuLyBaoLoiCau, TEN_LY_DO_BAO_CAU, type CauBaoLoi } from '../../lib/baoloi_cau'

type Tab = 'moi' | 'da_xu_ly' | 'khong_loi'
const TAB: { id: Tab; ten: string }[] = [{ id: 'moi', ten: 'Mới' }, { id: 'da_xu_ly', ten: 'Đã sửa' }, { id: 'khong_loi', ten: 'Không phải lỗi' }]
const ngayGio = (iso: string) => new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })

export default function CauBaoLoiScreen() {
  const [tab, setTab] = useState<Tab>('moi')
  const [ds, setDs] = useState<CauBaoLoi[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [ban, setBan] = useState<string | null>(null)

  const nap = useCallback(async (t: Tab) => {
    setDs(null); setLoi(null)
    try { setDs(await dsBaoLoiCau(t)) } catch (e) { setLoi((e as Error).message); setDs([]) }
  }, [])
  useEffect(() => { void nap(tab) }, [tab, nap])

  async function xuLy(c: CauBaoLoi, kq: 'da_xu_ly' | 'khong_loi') {
    const k = `${c.mon}|${c.ma_cau}`
    setBan(k); setLoi(null)
    try {
      await xuLyBaoLoiCau(c.mon, c.ma_cau, kq)
      setDs((cu) => (cu ?? []).filter((x) => !(x.mon === c.mon && x.ma_cau === c.ma_cau)))   // vá tại chỗ
    } catch (e) { setLoi((e as Error).message) } finally { setBan(null) }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      <div>
        <h1 className="text-[20px] font-bold text-slate-800">Câu bị báo lỗi</h1>
        <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-slate-500">
          Học sinh bấm <b>⚑ Báo lỗi</b> ở từng câu khi luyện. Câu nhiều em báo đứng đầu. Mở câu trong kho theo mã để sửa, rồi bấm <b>Đã sửa</b>; nếu câu không có lỗi thì bấm <b>Không phải lỗi</b>.
        </p>
      </div>
      <div className="flex gap-2">
        {TAB.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${tab === t.id ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-600'}`}>{t.ten}</button>
        ))}
      </div>
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {ds === null && <p className="text-[13px] text-slate-400">Đang tải…</p>}
      {ds !== null && ds.length === 0 && !loi && <p className="text-[13px] text-slate-400">Không có câu nào.</p>}
      <div className="flex flex-col gap-3">
        {(ds ?? []).map((c) => {
          const k = `${c.mon}|${c.ma_cau}`
          return (
            <div key={k} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[13px] font-bold text-slate-700">{c.ma_cau}</span>
                <span className="text-[12.5px] text-slate-500">{c.mon}{c.loai_cau ? ` · ${c.loai_cau}` : ''}</span>
                <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-[12.5px] font-bold text-amber-800">{c.so_hs} học sinh báo · {c.so_bao} lượt</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(c.ly_do ?? {}).map(([l, n]) => (
                  <span key={l} className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-rose-700 ring-1 ring-rose-200">{TEN_LY_DO_BAO_CAU[l] ?? l} ×{n}</span>
                ))}
              </div>
              {c.noi_dung && <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-600">{c.noi_dung}</p>}
              {c.ghi_chu.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-[13px] text-slate-700">{c.ghi_chu.map((g, i) => <li key={i}>{g}</li>)}</ul>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[12px] text-slate-400">Mới nhất {ngayGio(c.moi_nhat)}</span>
                {tab === 'moi' && (
                  <span className="ml-auto flex gap-2">
                    <button disabled={ban === k} onClick={() => xuLy(c, 'khong_loi')} className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-semibold text-slate-600 disabled:opacity-50">Không phải lỗi</button>
                    <button disabled={ban === k} onClick={() => xuLy(c, 'da_xu_ly')} className="rounded-md bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white disabled:opacity-50">Đã sửa</button>
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
