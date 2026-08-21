import { Fragment, useEffect, useMemo, useState } from 'react'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import {
  listLop, listNhanSu, listPhanCongAll, setPhanCongSlot,
  listPhanCongKhoi, addTruongKhoi, removeTruongKhoi,
  type Lop, type NhanSu, type PhanCongLop, type PhanCongKhoi,
} from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'

// Ma trận PHÂN CÔNG: hàng = lớp, cột = SLOT việc. Gán theo vai (TG ôm toàn bộ chấm; GV chính/phụ làm đánh giá+nội dung).
// Ghi vào phan_cong_lop (cùng seam màn Lớp — 1 sự thật, 2 cửa). Điểm danh = OPS toàn hệ (không gán per-lớp).
const MON_ORDER = ['Toán', 'Văn', 'Anh', 'KHTN']
const BAC_ORDER: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 }
const BAC_TONE: Record<string, string> = { S: 'bg-violet-100 text-violet-700', A: 'bg-blue-100 text-blue-700', B: 'bg-teal-100 text-teal-700', C: 'bg-amber-100 text-amber-700' }

export default function PhanCongScreen() {
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [lops, setLops] = useState<Lop[]>([])
  const [pc, setPc] = useState<PhanCongLop[]>([])
  const [ds, setDs] = useState<NhanSu[]>([])
  const [tk, setTk] = useState<PhanCongKhoi[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [l, p, n, t] = await Promise.all([listLop(khoi), listPhanCongAll(), listNhanSu(), listPhanCongKhoi()])
      setLops(l); setPc(p); setDs(n.filter((x) => x.trang_thai === 'dang_lam')); setTk(t)
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [khoi]) // eslint-disable-line

  // Trưởng khối — rà soát dữ liệu CẢ khối (không phải phân công theo lớp), Thùy chốt 21/08.
  const tkOfKhoi = tk.filter((r) => r.khoi === khoi)
  async function themTruongKhoi(nhanSuId: string) {
    try { await addTruongKhoi(nhanSuId, khoi); reload() } catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function boTruongKhoi(id: string) {
    try { await removeTruongKhoi(id); reload() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  // tải mỗi người = số lớp đang gánh (mọi vai) — hiện trong dropdown để soát quá tải
  const tai = useMemo(() => {
    const m: Record<string, number> = {}
    for (const r of pc) m[r.nhan_su_id] = (m[r.nhan_su_id] ?? 0) + 1
    return m
  }, [pc])

  const lopGroups = useMemo(() => {
    const mons = [...new Set([...MON_ORDER, ...lops.map((l) => l.mon)])].filter((m) => lops.some((l) => l.mon === m))
    return mons.map((mon) => ({
      mon,
      lops: lops.filter((l) => l.mon === mon).sort((a, b) => (BAC_ORDER[a.bac ?? ''] ?? 9) - (BAC_ORDER[b.bac ?? ''] ?? 9) || a.ten_lop.localeCompare(b.ten_lop, 'vi', { numeric: true })),
    }))
  }, [lops])

  function slotOf(lopId: string, slot: 'gv_chinh' | 'gv_phu' | 'tg'): string | null {
    const rows = pc.filter((r) => r.lop_id === lopId)
    if (slot === 'tg') return rows.find((r) => r.vai_tro === 'tg')?.nhan_su_id ?? null
    return rows.find((r) => r.vai_tro === 'gv' && r.la_chinh === (slot === 'gv_chinh'))?.nhan_su_id ?? null
  }
  async function setSlot(lopId: string, slot: 'gv_chinh' | 'gv_phu' | 'tg', nhanSuId: string | null) {
    try { await setPhanCongSlot(lopId, slot, nhanSuId); reload() }
    catch (e: any) { alert(e.message ?? String(e)) }
  }

  // ô chọn người — search, loại trừ người đã giữ slot GV còn lại (tránh trùng vai gv); thiếu → đỏ
  function Picker({ lopId, slot, exclude }: { lopId: string; slot: 'gv_chinh' | 'gv_phu' | 'tg'; exclude?: (string | null)[] }) {
    const cur = slotOf(lopId, slot)
    const ex = new Set((exclude ?? []).filter(Boolean) as string[])
    return (
      <SearchSelect value={cur} onChange={(id) => setSlot(lopId, slot, id)} invalid={slot !== 'gv_phu'}
        placeholder={slot === 'gv_phu' ? '— (không) —' : '⚠ chưa có'}
        options={ds.filter((n) => n.id === cur || !ex.has(n.id)).map((n) => ({ id: n.id, label: n.ho_ten, sub: `${tai[n.id] ?? 0} lớp` }))} />
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Phân công</span>
        <span className="text-[12px] text-slate-400">TG ôm toàn bộ chấm · GV chính = người chịu trách nhiệm · số trong ( ) = tải (số lớp)</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Khối</span>
          {KHOI_OPTIONS.map((k) => (
            <button key={k} onClick={() => setKhoi(k)} className={`h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${khoi === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{k}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-600">Trưởng khối {khoi}</span>
        <span className="text-[11px] text-slate-400">rà soát dữ liệu (điểm danh + ET/MT/BTVN) toàn khối · được sửa ET/MT/BTVN mọi lớp trong khối</span>
        <div className="ml-2 flex flex-wrap items-center gap-1">
          {tkOfKhoi.map((r) => {
            const ns = ds.find((n) => n.id === r.nhan_su_id)
            return (
              <span key={r.id} className="flex items-center gap-1 rounded-full bg-indigo-50 py-0.5 pl-2.5 pr-1 text-[12px] font-medium text-indigo-700">
                {ns?.ho_ten ?? '?'}
                <button onClick={() => boTruongKhoi(r.id)} className="rounded-full px-1 text-indigo-400 hover:bg-indigo-100 hover:text-rose-600" title="Gỡ">×</button>
              </span>
            )
          })}
          {tkOfKhoi.length === 0 && <span className="text-[12px] text-slate-300">chưa gán</span>}
        </div>
        <div className="w-56">
          <SearchSelect value={null} onChange={(id) => id && themTruongKhoi(id)} placeholder="+ thêm trưởng khối…"
            options={ds.filter((n) => !tkOfKhoi.some((r) => r.nhan_su_id === n.id)).map((n) => ({ id: n.id, label: n.ho_ten }))} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : lops.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có lớp khối {khoi}.</div>
          : (
            <table className="w-full border-separate border-spacing-y-1 text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="sticky top-0 z-10 bg-[#fafafb] px-2 py-1">Lớp</th>
                  <th className="sticky top-0 z-10 bg-[#fafafb] px-2">GV chính <span className="font-normal normal-case text-slate-300">· đánh giá + nội dung</span></th>
                  <th className="sticky top-0 z-10 bg-[#fafafb] px-2">GV phụ</th>
                  <th className="sticky top-0 z-10 bg-[#fafafb] px-2">Trợ giảng <span className="font-normal normal-case text-slate-300">· chấm ET + BTVN</span></th>
                  <th className="sticky top-0 z-10 bg-[#fafafb] px-2">Điểm danh</th>
                </tr>
              </thead>
              <tbody>
                {lopGroups.map((g) => (
                  <Fragment key={g.mon}>
                    <tr><td colSpan={5} className="px-2 pb-0.5 pt-2 text-[12px] font-semibold text-slate-600">{g.mon} <span className="font-normal text-slate-400">· {g.lops.length} lớp</span></td></tr>
                    {g.lops.map((l) => {
                      const gvChinh = slotOf(l.id, 'gv_chinh'), gvPhu = slotOf(l.id, 'gv_phu')
                      return (
                        <tr key={l.id} className="bg-white shadow-sm">
                          <td className="rounded-l-lg px-2 py-1.5 font-semibold text-slate-800">
                            <span className="inline-flex items-center gap-1.5">{l.ten_lop}{l.bac && <span className={`rounded px-1 text-[10px] font-bold ${BAC_TONE[l.bac] ?? 'bg-slate-100 text-slate-500'}`}>{l.bac}</span>}</span>
                          </td>
                          <td className="px-2"><Picker lopId={l.id} slot="gv_chinh" exclude={[gvPhu]} /></td>
                          <td className="px-2"><Picker lopId={l.id} slot="gv_phu" exclude={[gvChinh]} /></td>
                          <td className="px-2"><Picker lopId={l.id} slot="tg" /></td>
                          <td className="rounded-r-lg px-2 text-[12px] text-slate-400">OPS (toàn hệ)</td>
                        </tr>
                      )
                    })}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  )
}
