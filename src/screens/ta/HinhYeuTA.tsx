// HÌNH YẾU THEO MÔ HÌNH — phía TRỢ GIẢNG (Thùy 14/10, bước 1). Chỉ học sinh thuộc lớp mình được phân công.
// Bổ trợ yếu theo dạng không thấy Hình mô hình ⇒ danh sách này để TA biết em nào yếu mô hình nào; dạy trên giấy rồi bấm "Đã dạy".
// KHÔNG import màn ERP desktop (luật app TA). Số + trạng thái ở DB (fn_hinh_yeu_theo_mo_hinh). Class màu literal (Tailwind JIT).
import { useEffect, useMemo, useState } from 'react'
import { hinhYeuTheoMoHinh, danhDauDaDay, duaVaoCase, TIN_TEN, type HinhYeuRow } from '../../lib/botro_hinh_yeu'
import { ddmmVN } from '../../lib/tuan'

const SO_HS_DAU = 6 // gọn: hiện 6 em đầu, còn lại bấm xem hết

export default function HinhYeuTA() {
  const [rows, setRows] = useState<HinhYeuRow[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMo] = useState(false) // hộp đóng mặc định — không chiếm màn ca
  const [het, setHet] = useState(false)
  const [chuaDay, setChuaDay] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => { hinhYeuTheoMoHinh(true).then(setRows).catch((e) => setLoi(e?.message ?? String(e))) }, [])

  const loc = useMemo(() => (rows ?? []).filter((r) => !chuaDay || !r.da_day || r.yeu_sau_day), [rows, chuaDay])
  const theoHs = useMemo(() => {
    const m = new Map<string, HinhYeuRow[]>()
    for (const r of loc) (m.get(r.hoc_sinh_id) ?? m.set(r.hoc_sinh_id, []).get(r.hoc_sinh_id)!).push(r)
    return [...m.values()]
  }, [loc])
  const soChua = (rows ?? []).filter((r) => !r.da_day || r.yeu_sau_day).length
  const hienThi = het ? theoHs : theoHs.slice(0, SO_HS_DAU)

  async function duaCase(r: HinhYeuRow) {
    const key = r.hoc_sinh_id + r.hinh_baitoan_id
    setBusy(key); setLoi(null)
    try {
      const kq = await duaVaoCase(r.hoc_sinh_id, r.hinh_baitoan_id)
      if (!kq.ok) { setLoi(`${r.ho_ten} chưa có case bổ trợ yếu đang mở — nhờ OPS duyệt em ở Duyệt bổ trợ.`); return }
      setRows((prev) => (prev ?? []).map((x) => x.hoc_sinh_id === r.hoc_sinh_id && x.hinh_baitoan_id === r.hinh_baitoan_id ? { ...x, trong_case: true } : x))
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  async function danhDau(r: HinhYeuRow, daDay: boolean) {
    const key = r.hoc_sinh_id + r.hinh_baitoan_id
    setBusy(key); setLoi(null)
    try {
      const kq = await danhDauDaDay(r.hoc_sinh_id, r.hinh_baitoan_id, daDay)
      setRows((prev) => (prev ?? []).map((x) => x.hoc_sinh_id === r.hoc_sinh_id && x.hinh_baitoan_id === r.hinh_baitoan_id
        ? { ...x, da_day: kq.da_day, da_day_at: kq.da_day ? kq.da_day_at : null, da_day_boi: kq.da_day ? kq.da_day_boi : null, yeu_sau_day: false } : x))
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  if (rows !== null && rows.length === 0 && !loi) return null // lớp mình không có em nào yếu Hình mô hình ⇒ không hiện hộp
  return (
    <div className="mx-auto mt-2 max-w-[1000px] px-2 pb-6">
      <button onClick={() => setMo((v) => !v)} className="flex w-full items-center gap-2 rounded-[20px] bg-white/90 px-3 py-2.5 text-left active:scale-[.99]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E6DDFF] text-[20px]">📐</span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[14px] font-extrabold text-[#16224D]">Hình yếu theo mô hình</span>
          <span className="block text-[11px] text-[#63709A]">{rows === null ? 'Đang tải…' : `${soChua} bài chưa dạy · ${new Set((rows ?? []).map((r) => r.hoc_sinh_id)).size} em · lớp của tôi`}</span>
        </span>
        <span className="text-[16px] font-bold text-[#8B6BEF]">{mo ? '▾' : '›'}</span>
      </button>

      {mo && (
        <div className="mt-1.5 flex flex-col gap-1.5">
          <p className="px-1 text-[11.5px] leading-snug text-[#63709A]">Em còn yếu các bài Hình này (bổ trợ yếu theo dạng chưa thấy). Dạy trên giấy rồi bấm <b>Đã dạy</b>; đo lại mà vẫn yếu sẽ có cờ đỏ.</p>
          <label className="flex items-center gap-1.5 px-1 text-[12px] text-[#63709A]"><input type="checkbox" checked={chuaDay} onChange={(e) => setChuaDay(e.target.checked)} />Ẩn bài đã dạy</label>
          {loi && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 ring-1 ring-rose-200">{loi}</p>}
          {theoHs.length === 0 && rows !== null && <p className="rounded-[18px] bg-white/80 px-3 py-3 text-[12.5px] text-[#63709A]">Hết bài chưa dạy. 🎉</p>}
          {hienThi.map((ds) => {
            const h = ds[0]
            return (
              <div key={h.hoc_sinh_id} className="rounded-[18px] bg-[#E6DDFF] p-2.5">
                <p className="text-[13.5px] font-extrabold text-[#16224D]">{h.ho_ten} <span className="font-normal text-[#63709A]">· {h.lop ?? `K${h.khoi ?? '?'}`}</span></p>
                <div className="mt-1.5 flex flex-col gap-1">
                  {ds.map((r) => {
                    const key = r.hoc_sinh_id + r.hinh_baitoan_id
                    return (
                      <div key={key} className="rounded-xl bg-white/85 px-2.5 py-2">
                        <p className="text-[12.5px] font-bold text-[#16224D]">{r.mo_hinh}{r.bai_ma && <span className="ml-1.5 text-[10.5px] font-normal text-[#63709A]">{r.bai_ma}</span>}</p>
                        <p className="mt-0.5 text-[11.5px] leading-snug text-[#63709A]">{r.phat_bieu.length > 120 ? r.phat_bieu.slice(0, 120) + '…' : r.phat_bieu}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-[#FFE3EA] px-2 py-0.5 text-[10.5px] font-bold text-[#C0355A]">{Math.round(r.score * 100)}%</span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] text-[#63709A] ring-1 ring-[#DCE6FF]">{r.n} lần · {TIN_TEN[r.tin]}{r.cuoi_do ? ` · ${ddmmVN(r.cuoi_do)}` : ''}</span>
                          {r.trong_case
                            ? <span className="rounded-full bg-[#EEF3FF] px-2 py-0.5 text-[10.5px] font-bold text-[#2F73F6]">trong case bổ trợ</span>
                            : r.co_case_yeu && <button disabled={busy === key} onClick={() => duaCase(r)} className="rounded-full bg-[#8B6BEF] px-2.5 py-1 text-[11px] font-bold text-white disabled:opacity-50">{busy === key ? '…' : '+ Đưa vào case'}</button>}
                          {r.yeu_sau_day && <span className="rounded-full bg-[#FFE3EA] px-2 py-0.5 text-[10.5px] font-bold text-[#C0355A]">dạy rồi vẫn yếu</span>}
                          {r.da_day ? (
                            <button disabled={busy === key} onClick={() => danhDau(r, false)} className="ml-auto rounded-full bg-[#E4F8EC] px-2.5 py-1 text-[11px] font-bold text-[#1E8A52] disabled:opacity-50" title="Bấm để bỏ đánh dấu">
                              ✓ Đã dạy{r.da_day_at ? ` ${ddmmVN(r.da_day_at.slice(0, 10))}` : ''}
                            </button>
                          ) : (
                            <button disabled={busy === key} onClick={() => danhDau(r, true)} className="ml-auto rounded-full bg-[#2F73F6] px-3 py-1 text-[11.5px] font-bold text-white disabled:opacity-50">{busy === key ? '…' : 'Đã dạy'}</button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          {!het && theoHs.length > SO_HS_DAU && (
            <button onClick={() => setHet(true)} className="rounded-[18px] bg-white/90 px-3 py-2.5 text-[12.5px] font-bold text-[#2F73F6]">+ {theoHs.length - SO_HS_DAU} em nữa — bấm xem hết</button>
          )}
        </div>
      )}
    </div>
  )
}
