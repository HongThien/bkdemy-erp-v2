// HÌNH YẾU THEO MÔ HÌNH — tab trong nhóm "Yếu" của hub Bổ trợ (Thùy 14/10, bước 1).
// Vì sao có màn này: bổ trợ yếu đọc số đo theo mã dạng nên KHÔNG thấy Hình mô hình (350 ô yếu / 141 HS đo 14/10).
// Chưa luyện trên app: trợ giảng dạy trên giấy rồi bấm "đã dạy"; đo lại sau đó mà vẫn yếu thì hiện cờ.
// Số + trạng thái tính ở DB (fn_hinh_yeu_theo_mo_hinh); màn chỉ nhóm theo học sinh và lọc theo lựa chọn đang mở.
import { useEffect, useMemo, useState } from 'react'
import { hinhYeuTheoMoHinh, danhDauDaDay, duaVaoCase, TIN_TEN, type HinhYeuRow } from '../../lib/botro_hinh_yeu'
import { ddmmVN } from '../../lib/tuan'

// Rời màn rồi quay lại = đúng chỗ cũ (CLAUDE.md §2): nhớ bộ lọc + danh sách đã vá.
const NHO: { rows: HinhYeuRow[] | null; khoi: string; q: string; chuaDay: boolean; tinCao: boolean } = { rows: null, khoi: '', q: '', chuaDay: false, tinCao: false }

export default function HinhYeuScreen() {
  const [rows, setRows] = useState<HinhYeuRow[] | null>(NHO.rows)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const [khoi, setKhoiS] = useState(NHO.khoi)
  const [q, setQS] = useState(NHO.q)
  const [chuaDay, setChuaDayS] = useState(NHO.chuaDay)
  const [tinCao, setTinCaoS] = useState(NHO.tinCao)
  const [busy, setBusy] = useState<string | null>(null)
  const [moRong, setMoRong] = useState<Set<string>>(new Set())
  const setKhoi = (v: string) => { NHO.khoi = v; setKhoiS(v) }
  const setQ = (v: string) => { NHO.q = v; setQS(v) }
  const setChuaDay = (v: boolean) => { NHO.chuaDay = v; setChuaDayS(v) }
  const setTinCao = (v: boolean) => { NHO.tinCao = v; setTinCaoS(v) }

  async function tai() {
    setDangTai(true); setLoi(null)
    try { const r = await hinhYeuTheoMoHinh(false); NHO.rows = r; setRows(r) } // giữ danh sách cũ tới khi có mới — không trắng màn
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDangTai(false) }
  }
  useEffect(() => { if (NHO.rows === null) tai() }, [])

  const khoiCo = useMemo(() => [...new Set((rows ?? []).map((r) => r.khoi).filter((k): k is string => !!k))].sort((a, b) => Number(a) - Number(b)), [rows])
  const loc = useMemo(() => {
    const k = q.trim().toLowerCase()
    return (rows ?? []).filter((r) => (!khoi || r.khoi === khoi) && (!chuaDay || !r.da_day) && (!tinCao || r.tin === 'cao')
      && (!k || r.ho_ten.toLowerCase().includes(k) || (r.ma_hs ?? '').toLowerCase().includes(k) || r.mo_hinh.toLowerCase().includes(k) || (r.lop ?? '').toLowerCase().includes(k)))
  }, [rows, khoi, q, chuaDay, tinCao])
  const theoHs = useMemo(() => {
    const m = new Map<string, HinhYeuRow[]>()
    for (const r of loc) (m.get(r.hoc_sinh_id) ?? m.set(r.hoc_sinh_id, []).get(r.hoc_sinh_id)!).push(r)
    return [...m.values()]
  }, [loc])
  const soChuaDay = loc.filter((r) => !r.da_day).length
  const soSauDay = (rows ?? []).filter((r) => r.yeu_sau_day).length

  // Bước 2: đưa bài vào case bổ trợ yếu đang mở của em (dạng học/chấm trên giấy). Vá đúng dòng đó tại chỗ.
  async function duaCase(r: HinhYeuRow) {
    const key = r.hoc_sinh_id + r.hinh_baitoan_id
    setBusy(key); setLoi(null)
    try {
      const kq = await duaVaoCase(r.hoc_sinh_id, r.hinh_baitoan_id)
      if (!kq.ok) { setLoi(`${r.ho_ten} chưa có case bổ trợ yếu đang mở — duyệt em ở "Duyệt bổ trợ" trước (trần 70 em / 20 Cao).`); return }
      setRows((prev) => { const n = (prev ?? []).map((x) => x.hoc_sinh_id === r.hoc_sinh_id && x.hinh_baitoan_id === r.hinh_baitoan_id ? { ...x, trong_case: true } : x); NHO.rows = n; return n })
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  async function danhDau(r: HinhYeuRow, daDay: boolean) {
    const key = r.hoc_sinh_id + r.hinh_baitoan_id
    setBusy(key); setLoi(null)
    try {
      const kq = await danhDauDaDay(r.hoc_sinh_id, r.hinh_baitoan_id, daDay)
      // vá ĐÚNG dòng đó tại chỗ (không tải lại cả danh sách)
      setRows((prev) => { const n = (prev ?? []).map((x) => x.hoc_sinh_id === r.hoc_sinh_id && x.hinh_baitoan_id === r.hinh_baitoan_id
        ? { ...x, da_day: kq.da_day, da_day_at: kq.da_day ? kq.da_day_at : null, da_day_boi: kq.da_day ? kq.da_day_boi : null, yeu_sau_day: false } : x); NHO.rows = n; return n })
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-[#f5f5f7] px-8 py-5">
      <div className="mb-3 flex flex-wrap items-end gap-3">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Hình yếu theo mô hình</h2>
          <p className="max-w-[760px] text-[12.5px] text-slate-500">Học sinh đang yếu ở các bài Hình theo mô hình — phần này bổ trợ yếu theo dạng chưa thấy. Chưa luyện trên app: trợ giảng dạy trên giấy rồi bấm <b>Đã dạy</b>; đo lại sau đó mà vẫn yếu sẽ hiện cờ.</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm học sinh · lớp · mô hình"
            className="w-[230px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-indigo-300" />
          <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[13px]">
            <option value="">Mọi khối</option>{khoiCo.map((k) => <option key={k} value={k}>Khối {k}</option>)}
          </select>
          <label className="flex items-center gap-1.5 text-[13px] text-slate-600"><input type="checkbox" checked={chuaDay} onChange={(e) => setChuaDay(e.target.checked)} />Chỉ chưa dạy</label>
          <label className="flex items-center gap-1.5 text-[13px] text-slate-600" title="Đã đo từ 3 lần trở lên"><input type="checkbox" checked={tinCao} onChange={(e) => setTinCao(e.target.checked)} />Chỉ đo nhiều</label>
          <button onClick={tai} disabled={dangTai} title="Tải lại"
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40">{dangTai ? '…' : '↻'}</button>
        </div>
      </div>

      {loi && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] text-rose-700">{loi}</p>}
      {rows === null && !loi && <p className="py-16 text-center text-[13.5px] text-slate-400">Đang tải…</p>}
      {rows && (
        <div className="mb-3 flex flex-wrap gap-2 text-[13px]">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700"><b>{theoHs.length}</b> học sinh · <b>{loc.length}</b> bài yếu</span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800"><b>{soChuaDay}</b> chưa dạy</span>
          {soSauDay > 0 && <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700"><b>{soSauDay}</b> dạy rồi mà đo lại vẫn yếu</span>}
        </div>
      )}
      {rows && theoHs.length === 0 && <p className="rounded-2xl bg-white px-5 py-10 text-center text-[13.5px] text-slate-400 shadow-sm">Không có học sinh nào khớp bộ lọc.</p>}

      <div className="flex flex-col gap-3">
        {theoHs.map((ds) => {
          const h = ds[0]
          return (
            <div key={h.hoc_sinh_id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-[15px] font-semibold text-slate-800">{h.ho_ten}</span>
                <span className="text-[12.5px] text-slate-500">{h.lop ?? `Khối ${h.khoi ?? '?'}`}{h.ma_hs ? ` · ${h.ma_hs}` : ''}</span>
                {h.co_case_yeu && <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11.5px] font-semibold text-indigo-700" title="Em này đang có case bổ trợ yếu (theo dạng) — phần Hình này là phần thêm">đang có case yếu</span>}
                <span className="ml-auto text-[12.5px] text-slate-400">{ds.length} bài</span>
              </div>
              <div className="flex flex-col divide-y divide-slate-100">
                {ds.map((r) => {
                  const key = r.hoc_sinh_id + r.hinh_baitoan_id
                  const mo = moRong.has(key)
                  return (
                    <div key={key} className="flex flex-wrap items-start gap-x-3 gap-y-1 py-2">
                      <div className="min-w-[240px] flex-1">
                        <p className="text-[13.5px] font-medium text-slate-800">{r.mo_hinh}{r.bai_ma && <span className="ml-2 text-[11.5px] font-normal text-slate-400">{r.bai_ma}</span>}</p>
                        <button onClick={() => setMoRong((s) => { const n = new Set(s); mo ? n.delete(key) : n.add(key); return n })}
                          className="mt-0.5 block text-left text-[12.5px] leading-snug text-slate-500 hover:text-slate-700">
                          {mo ? r.phat_bieu : r.phat_bieu.length > 90 ? r.phat_bieu.slice(0, 90) + '… ▾' : r.phat_bieu}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-rose-700" title="Điểm trung bình các lần đo gần nhất (0–100%)">{Math.round(r.score * 100)}%</span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[12.5px] text-slate-600" title="Số lần đo · độ tin">{r.n} lần · {TIN_TEN[r.tin]}</span>
                        {r.cuoi_do && <span className="text-[12px] text-slate-400">đo {ddmmVN(r.cuoi_do)}</span>}
                        {r.trong_case
                          ? <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-indigo-700" title="Đang là một dạng của case bổ trợ yếu — in phiếu và chấm ở ca">trong case bổ trợ</span>
                          : r.co_case_yeu && (
                            <button disabled={busy === key} onClick={() => duaCase(r)} title="Thêm bài này vào case bổ trợ yếu đang mở của em — dạy và chấm trên giấy ở ca"
                              className="rounded-full border border-indigo-200 bg-indigo-600 px-3 py-0.5 text-[12.5px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{busy === key ? '…' : '+ Đưa vào case'}</button>
                          )}
                        {r.yeu_sau_day && <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[12px] font-semibold text-rose-700" title="Đã dạy rồi, đo lại sau đó vẫn yếu">dạy rồi vẫn yếu</span>}
                        {r.da_day ? (
                          <button disabled={busy === key} onClick={() => danhDau(r, false)} title="Bấm để bỏ đánh dấu"
                            className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">
                            ✓ Đã dạy{r.da_day_at ? ` ${ddmmVN(r.da_day_at.slice(0, 10))}` : ''}{r.da_day_boi ? ` · ${r.da_day_boi}` : ''}
                          </button>
                        ) : (
                          <button disabled={busy === key} onClick={() => danhDau(r, true)}
                            className="rounded-full border border-indigo-200 bg-white px-3 py-0.5 text-[12.5px] font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">{busy === key ? '…' : 'Đã dạy'}</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
