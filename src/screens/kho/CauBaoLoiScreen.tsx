// Màn "Câu bị báo sai" (Thùy 10/10 → mở rộng 21/11): học sinh báo lúc luyện (⚑ Báo lỗi) + NHÂN SỰ báo ở mọi nơi thấy câu trong kho (🚩).
// Gom theo CÂU, trong phạm vi môn × khối của người xem (trưởng khối chỉ thấy khối mình). Báo của nhân sự đã được nối sang luồng
// "Claude sửa theo nhận xét" (docs/quy-trinh-sua-theo-nhan-xet.md) — Claude nhặt, sửa, ghi; báo cáo tự đóng khi Claude xử xong.
// Trưởng khối đúng khối: Đã sửa / Xoá câu / Không phải lỗi — LUÔN kèm một dòng ghi đã làm gì (để AI ghi vào Phần D spec-giai-bai).
// Sau xử lý chỉ vá đúng dòng đó tại chỗ (CLAUDE §2) — không tải lại cả danh sách.
import { useCallback, useEffect, useState } from 'react'
import { dsBaoSaiKho, xuLyBaoSaiCau, TEN_LY_DO_BAO_CAU, type CauBaoSai, type HanhDongBaoSai } from '../../lib/baoloi_cau'

type Tab = 'moi' | 'da_xu_ly' | 'khong_loi'
const TAB: { id: Tab; ten: string }[] = [{ id: 'moi', ten: 'Mới' }, { id: 'da_xu_ly', ten: 'Đã xử lý' }, { id: 'khong_loi', ten: 'Không phải lỗi' }]
const TEN_HANH_DONG: Record<string, string> = { sua: 'Đã sửa', xoa: 'Đã xoá câu', khong_loi: 'Không phải lỗi' }
const ngayGio = (iso: string) => new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })

export default function CauBaoLoiScreen() {
  const [tab, setTab] = useState<Tab>('moi')
  const [ds, setDs] = useState<CauBaoSai[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [ban, setBan] = useState<string | null>(null)
  const [ghi, setGhi] = useState<Record<string, string>>({})   // "đã làm gì" theo câu

  const nap = useCallback(async (t: Tab) => {
    setDs(null); setLoi(null)
    try { setDs(await dsBaoSaiKho(t)) } catch (e) { setLoi((e as Error).message); setDs([]) }
  }, [])
  useEffect(() => { void nap(tab) }, [tab, nap])

  async function xuLy(c: CauBaoSai, hd: HanhDongBaoSai) {
    const ket = (ghi[c.ma_cau] ?? '').trim()
    if (ket.length < 5) { setLoi(`Câu ${c.ma_cau}: ghi rõ đã làm gì / vì sao (ít nhất vài chữ) ở ô bên dưới trước.`); return }
    if (hd === 'xoa' && !confirm(`Đưa câu ${c.ma_cau} vào kho rác? (mã không cấp lại; tài liệu đang dùng câu vẫn in được)`)) return
    setBan(c.ma_cau); setLoi(null)
    try {
      await xuLyBaoSaiCau(c.ma_cau, hd, ket)
      setDs((cu) => (cu ?? []).filter((x) => x.ma_cau !== c.ma_cau))   // vá tại chỗ
    } catch (e) { setLoi((e as Error).message) } finally { setBan(null) }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      <div>
        <h1 className="text-[20px] font-bold text-slate-800">Câu bị báo sai</h1>
        <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-slate-500">
          Học sinh bấm <b>⚑ Báo lỗi</b> khi luyện; nhân sự bấm <b>🚩</b> cạnh mã câu ở kho, builder, tìm câu, phiên Claude. Loại lỗi: trình bày · tính sai · sai đề · sai dạng.
          Báo của nhân sự đã chuyển cho Claude sửa theo nhận xét; trưởng khối cũng có thể tự <b>sửa</b> hoặc <b>xoá</b> — nhớ ghi một dòng đã làm gì để lỗi được rút thành luật.
        </p>
      </div>
      <div className="flex gap-2">
        {TAB.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${tab === t.id ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>{t.ten}</button>
        ))}
      </div>
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {ds === null && <p className="text-[13px] text-slate-400">Đang tải…</p>}
      {ds !== null && ds.length === 0 && !loi && <p className="text-[13px] text-slate-400">Không có câu nào.</p>}
      <div className="flex flex-col gap-3">
        {(ds ?? []).map((c) => (
          <div key={c.ma_cau} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[13px] font-bold text-slate-700">{c.ma_cau}</span>
              <span className="text-[12.5px] text-slate-500">{c.mon}{c.khoi ? ` · khối ${c.khoi}` : ''}</span>
              <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-[12.5px] font-bold text-amber-800">
                {[c.so_hs > 0 ? `${c.so_hs} học sinh` : '', c.so_ns > 0 ? `${c.so_ns} nhân sự` : ''].filter(Boolean).join(' + ')} báo · {c.so_bao} lượt
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Object.entries(c.ly_do ?? {}).map(([l, n]) => (
                <span key={l} className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-rose-700 ring-1 ring-rose-200">{TEN_LY_DO_BAO_CAU[l] ?? l} ×{n}</span>
              ))}
            </div>
            {c.noi_dung && <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-600">{c.noi_dung}</p>}
            {c.ghi_chu.length > 0 && <ul className="mt-2 list-disc pl-5 text-[13px] text-slate-700">{c.ghi_chu.map((g, i) => <li key={i}>{g}</li>)}</ul>}
            {tab !== 'moi' && c.hanh_dong && (
              <p className="mt-2 rounded-md bg-emerald-50 px-2.5 py-1.5 text-[12.5px] text-emerald-800"><b>{TEN_HANH_DONG[c.hanh_dong]}</b>{c.ket_qua ? ` — ${c.ket_qua}` : ''}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[12px] text-slate-400">Mới nhất {ngayGio(c.moi_nhat)}</span>
              {tab === 'moi' && (c.xu_ly_duoc ? (
                <>
                  <input value={ghi[c.ma_cau] ?? ''} onChange={(e) => setGhi((g) => ({ ...g, [c.ma_cau]: e.target.value }))} maxLength={500}
                    placeholder="Đã làm gì / vì sao? (bắt buộc)" className="min-w-[220px] flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-indigo-400" />
                  <button disabled={ban === c.ma_cau} onClick={() => xuLy(c, 'khong_loi')} className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-semibold text-slate-600 disabled:opacity-50">Không phải lỗi</button>
                  <button disabled={ban === c.ma_cau} onClick={() => xuLy(c, 'xoa')} className="rounded-md border border-rose-300 px-3 py-1.5 text-[13px] font-semibold text-rose-700 disabled:opacity-50">Xoá câu</button>
                  <button disabled={ban === c.ma_cau} onClick={() => xuLy(c, 'sua')} className="rounded-md bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white disabled:opacity-50">Đã sửa</button>
                </>
              ) : <span className="ml-auto text-[12px] text-slate-400">Chờ Claude / trưởng khối đúng khối xử lý</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
