// Màn quản trị "Mở tính năng app HS" (Thùy 07/10): mở dần từng phần để học sinh không bị ngợp.
// Mỗi tính năng: ngày mở chung (trống = đóng) + ngoại lệ theo lớp (mở thử 1 lớp trước / đóng riêng 1 lớp).
// Mọi quyết định "em nào thấy gì" do Postgres tính (fn_hs_tinh_nang_mo); màn này chỉ ghi công tắc. Ghi cần quyền lá 'tinh_nang' (DB kiểm).
import { useCallback, useEffect, useState } from 'react'
import { tinhNangDs, tinhNangDat, tinhNangLopDat, type TinhNangAdmin, type TinhNangDs } from '../../lib/tinhnang'

const fmt = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}`

function Dong({ t, ds, homNay, onXong, onLoi }: { t: TinhNangAdmin; ds: TinhNangDs; homNay: string; onXong: () => Promise<void>; onLoi: (m: string) => void }) {
  const [ngay, setNgay] = useState(t.mo_tu && t.mo_tu > homNay ? t.mo_tu : homNay)
  const [lop, setLop] = useState('')
  const [cheDo, setCheDo] = useState<'mo' | 'dong'>('mo')
  const [ban, setBan] = useState(false)
  const chay = async (f: () => Promise<void>) => { setBan(true); try { await f(); await onXong() } catch (e) { onLoi((e as Error).message) } finally { setBan(false) } }

  const dang = t.mo_tu === null ? 'dong' : t.mo_tu <= homNay ? 'mo' : 'hen'
  const chip = dang === 'mo'
    ? <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700">Đang mở cho mọi lớp</span>
    : dang === 'hen'
      ? <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[12px] font-semibold text-amber-700">Hẹn mở {fmt(t.mo_tu!)}</span>
      : <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[12px] font-semibold text-slate-600">Đóng</span>
  const daCo = new Set(t.ngoai_le.map((n) => n.lop_id))
  const lopChon = ds.lop.filter((l) => !daCo.has(l.id))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-[14.5px] font-bold text-slate-800">{t.ten}</div>
          {t.mo_ta && <div className="text-[12px] text-slate-500">{t.mo_ta}</div>}
        </div>
        {chip}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
        {dang !== 'mo' && <button disabled={ban} onClick={() => chay(() => tinhNangDat(t.ma, homNay))} className="rounded-md bg-emerald-600 px-3 py-1.5 font-semibold text-white disabled:opacity-50">Mở cho mọi lớp hôm nay</button>}
        {dang !== 'dong' && <button disabled={ban} onClick={() => confirm(`Đóng "${t.ten}" với mọi lớp (trừ lớp có ngoại lệ mở)? Học sinh sẽ không thấy ô này nữa.`) && chay(() => tinhNangDat(t.ma, null))} className="rounded-md border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 disabled:opacity-50">Đóng</button>}
        <span className="ml-1 text-slate-400">·</span>
        <label className="flex items-center gap-1.5 text-slate-600">Mở từ ngày
          <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <button disabled={ban || !ngay} onClick={() => chay(() => tinhNangDat(t.ma, ngay))} className="rounded-md border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 disabled:opacity-50">Hẹn ngày</button>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Ngoại lệ theo lớp</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {t.ngoai_le.length === 0 && <span className="text-[12.5px] text-slate-400">Chưa có — mọi lớp theo ngày chung ở trên.</span>}
          {t.ngoai_le.map((n) => (
            <span key={n.lop_id} className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[12.5px] font-semibold ${n.mo ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'}`}>
              {n.mo ? 'Mở thử' : 'Đóng'} · {n.ten_lop}
              <button disabled={ban} onClick={() => chay(() => tinhNangLopDat(t.ma, n.lop_id, null))} className="ml-0.5 text-[14px] leading-none opacity-60 hover:opacity-100" aria-label="Bỏ ngoại lệ">×</button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
          <select value={cheDo} onChange={(e) => setCheDo(e.target.value as 'mo' | 'dong')} className="rounded-md border border-slate-300 px-2 py-1">
            <option value="mo">Mở thử cho lớp</option>
            <option value="dong">Đóng riêng lớp</option>
          </select>
          <select value={lop} onChange={(e) => setLop(e.target.value)} className="min-w-[180px] rounded-md border border-slate-300 px-2 py-1">
            <option value="">— chọn lớp —</option>
            {lopChon.map((l) => <option key={l.id} value={l.id}>{l.ten_lop} · {l.mon}</option>)}
          </select>
          <button disabled={ban || !lop} onClick={() => chay(async () => { await tinhNangLopDat(t.ma, lop, cheDo === 'mo'); setLop('') })} className="rounded-md border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 disabled:opacity-50">Thêm</button>
        </div>
      </div>
    </div>
  )
}

export default function TinhNangScreen() {
  const [ds, setDs] = useState<TinhNangDs | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  // Nạp lại NỀN sau mỗi lần ghi: giữ danh sách cũ trên màn tới khi có bản mới (không nhấp nháy).
  const nap = useCallback(async () => { try { setDs(await tinhNangDs()); setLoi(null) } catch (e) { setLoi((e as Error).message) } }, [])
  useEffect(() => { void nap() }, [nap])

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      <div>
        <h1 className="text-[20px] font-bold text-slate-800">Mở tính năng app học sinh</h1>
        <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-slate-500">
          Mở từng phần cho học sinh đỡ ngợp. Ô bị đóng sẽ <b>ẩn hẳn</b> khỏi màn chính (không hiện ô khoá). Học sinh học nhiều lớp thì thấy tính năng nếu <b>một lớp nào</b> của em được mở.
          Bài trên lớp · ET · BTVN · ca bổ trợ là việc thầy cô giao nên không nằm ở đây. Đổi xong có hiệu lực khi học sinh về lại màn chính.
        </p>
      </div>
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {!ds && !loi && <div className="text-[13px] text-slate-400">Đang tải…</div>}
      {ds && (['hoc', 'choi'] as const).map((nhom) => (
        <div key={nhom} className="flex flex-col gap-3">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-slate-400">{nhom === 'hoc' ? 'Học tập' : 'Giải trí & động lực'}</h2>
          {ds.tinh_nang.filter((t) => t.nhom === nhom).map((t) => <Dong key={t.ma} t={t} ds={ds} homNay={ds.hom_nay} onXong={nap} onLoi={setLoi} />)}
        </div>
      ))}
    </section>
  )
}
