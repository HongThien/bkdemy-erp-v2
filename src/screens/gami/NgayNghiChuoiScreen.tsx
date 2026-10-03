// Màn quản trị "Ngày nghỉ của chuỗi" (spec-v1-app-hs.md §3): ngày trung tâm nghỉ (lễ/Tết = mọi khối) hoặc tuần thi của 1 số khối.
// Ngày trong khoảng này KHÔNG làm đứt chuỗi làm bài của học sinh và không cộng thêm ngày. Ghi/gỡ cần quyền ghi lá 'chuoi_nghi' (DB kiểm).
import { useCallback, useEffect, useState } from 'react'
import { dsNgayNghiChuoi, themNgayNghiChuoi, goNgayNghiChuoi, type NgayNghiChuoi } from '../../lib/chuoi'
import { KHOI_OPTIONS } from '../../lib/kho/api'

// Ngày YYYY-MM-DD theo giờ VN (CLAUDE §2 cấm toISOString/new Date('YYYY-MM-DD') cho ngày local).
function homNayVN(): string {
  const vn = new Date(Date.now() + 7 * 3600000)
  return `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, '0')}-${String(vn.getUTCDate()).padStart(2, '0')}`
}
const fmt = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}`
const soNgay = (tu: string, den: string) => Math.round((Date.UTC(+den.slice(0, 4), +den.slice(5, 7) - 1, +den.slice(8, 10)) - Date.UTC(+tu.slice(0, 4), +tu.slice(5, 7) - 1, +tu.slice(8, 10))) / 86400000) + 1

export default function NgayNghiChuoiScreen() {
  const [ds, setDs] = useState<NgayNghiChuoi[]>([])
  const [loi, setLoi] = useState<string | null>(null)
  const [tai, setTai] = useState(true)
  const [tu, setTu] = useState(homNayVN())
  const [den, setDen] = useState(homNayVN())
  const [moiKhoi, setMoiKhoi] = useState(true)
  const [khoi, setKhoi] = useState<string[]>([])
  const [lyDo, setLyDo] = useState('')
  const [dangLuu, setDangLuu] = useState(false)

  const nap = useCallback(async () => {
    try { setDs(await dsNgayNghiChuoi()); setLoi(null) } catch (e) { setLoi((e as Error).message) } finally { setTai(false) }
  }, [])
  useEffect(() => { void nap() }, [nap])

  const hopLe = den >= tu && lyDo.trim().length > 0 && (moiKhoi || khoi.length > 0)
  async function luu() {
    setDangLuu(true); setLoi(null)
    try {
      await themNgayNghiChuoi(tu, den, moiKhoi ? [] : khoi, lyDo.trim())
      setLyDo('')
      await nap()
    } catch (e) { setLoi((e as Error).message) } finally { setDangLuu(false) }
  }
  async function go(n: NgayNghiChuoi) {
    if (!confirm(`Gỡ ngày nghỉ "${n.ly_do}" (${fmt(n.tu)} → ${fmt(n.den)})? Chuỗi của học sinh sẽ tính lại như chưa có kỳ nghỉ này.`)) return
    try { await goNgayNghiChuoi(n.id); await nap() } catch (e) { setLoi((e as Error).message) }
  }
  const dang = ds.filter((n) => n.den >= homNayVN())
  const qua = ds.filter((n) => n.den < homNayVN())

  const dong = (n: NgayNghiChuoi) => (
    <div key={n.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold text-slate-800">{n.ly_do}</div>
        <div className="text-[12px] text-slate-500">
          {fmt(n.tu)}{n.tu !== n.den ? ` → ${fmt(n.den)}` : ''} · {soNgay(n.tu, n.den)} ngày · {n.khoi.length === 0 ? 'mọi khối' : `khối ${n.khoi.join(', ')}`}
        </div>
      </div>
      <button onClick={() => go(n)} className="rounded-md border border-slate-200 px-2.5 py-1 text-[12px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Gỡ</button>
    </div>
  )

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Ngày nghỉ của chuỗi</h1>
        <p className="mt-1 max-w-[680px] text-[13px] text-slate-500">
          Ngày trong khoảng nghỉ <b>không làm đứt chuỗi làm bài</b> của học sinh và không cộng thêm ngày. Dùng cho lễ, Tết (mọi khối) hoặc tuần thi ở trường (chọn khối).
          Nhập TRƯỚC kỳ nghỉ; nhập muộn trong 30 ngày vẫn kịp sửa lại chuỗi (hệ tự tính lại).
        </p>
      </div>

      <div className="max-w-[680px] rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-[12px] font-semibold text-slate-600">Từ ngày
            <input type="date" value={tu} onChange={(e) => { setTu(e.target.value); if (den < e.target.value) setDen(e.target.value) }}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[14px] font-normal text-slate-900" />
          </label>
          <label className="text-[12px] font-semibold text-slate-600">Đến ngày
            <input type="date" value={den} min={tu} onChange={(e) => setDen(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[14px] font-normal text-slate-900" />
          </label>
        </div>
        <label className="mt-3 block text-[12px] font-semibold text-slate-600">Lý do
          <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="vd Tết Nguyên đán · Tuần thi giữa kỳ 1"
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[14px] font-normal text-slate-900" />
        </label>
        <div className="mt-3 text-[12px] font-semibold text-slate-600">Áp dụng cho</div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <button onClick={() => setMoiKhoi(true)} className={`h-8 rounded-md px-3 text-[13px] font-medium ${moiKhoi ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-600'}`}>Mọi khối</button>
          <button onClick={() => setMoiKhoi(false)} className={`h-8 rounded-md px-3 text-[13px] font-medium ${!moiKhoi ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-600'}`}>Chọn khối</button>
          {!moiKhoi && KHOI_OPTIONS.map((k) => (
            <button key={k} onClick={() => setKhoi((v) => (v.includes(k) ? v.filter((x) => x !== k) : [...v, k]))}
              className={`h-8 min-w-9 rounded-md px-2 text-[13px] font-medium ${khoi.includes(k) ? 'bg-sky-600 text-white' : 'border border-slate-300 text-slate-600'}`}>{k}</button>
          ))}
        </div>
        {loi && <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">{loi}</div>}
        <button onClick={luu} disabled={!hopLe || dangLuu} className="mt-4 h-10 rounded-lg bg-indigo-600 px-5 text-[14px] font-semibold text-white disabled:opacity-40">
          {dangLuu ? 'Đang lưu…' : `Lưu ${hopLe ? soNgay(tu, den) : ''} ngày nghỉ`.replace('  ', ' ')}
        </button>
      </div>

      <div className="max-w-[680px] space-y-2">
        <div className="text-[12px] font-bold uppercase tracking-wide text-slate-500">Đang và sắp tới ({dang.length})</div>
        {tai ? <div className="text-[13px] text-slate-400">Đang tải…</div> : dang.length ? dang.map(dong) : <div className="text-[13px] text-slate-400">Chưa có ngày nghỉ nào.</div>}
        {qua.length > 0 && <>
          <div className="pt-3 text-[12px] font-bold uppercase tracking-wide text-slate-500">Đã qua ({qua.length})</div>
          {qua.slice(0, 20).map(dong)}
        </>}
      </div>
    </section>
  )
}
