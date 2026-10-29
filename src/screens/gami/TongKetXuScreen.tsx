// TỔNG KẾT XU (Thùy 28/10 — thay màn "Chốt xu tháng", đã huỷ vì xu tự đổi realtime từ 06/10).
// Dashboard xu của TOÀN BỘ HS: mỗi HS 1 dòng, cột = các nguồn tạo ra xu + tổng + đã tiêu + số dư.
// Mọi con số từ DB (fn_xu_tong_ket / fn_xu_tong_ket_tong — mig 202610281926); client chỉ lọc/sắp xếp/hiển thị (§2.0).
//   · Cột từ EXP (ET … Thành tựu) = xu ĐÃ VÀO SỔ chia theo tỉ lệ từng nguồn (làm tròn phần dư lớn nhất) ⇒ cộng đúng = Tổng.
//   · Nông trại · Giải thưởng · Thầy cô ± · Đổi quà đọc thẳng sổ xu.  · Tổng − Đã tiêu = Số dư (khi xem "Toàn bộ").
// Cộng/trừ xu TAY (trước nằm ở màn Chốt xu) giữ ở đây: nút ± từng dòng → ghi sổ → vá đúng dòng đó + tải nền dòng tổng.
import { useEffect, useMemo, useState } from 'react'
import { listTongKetXu, getTongKetXuHS, getTongKetXuTong, themPhatSinh, type XuTongKet, type XuTongKetTong } from '../../lib/xu'

const THANG_DAU = '2026-08' // tháng đầu đổi xu
function listThang(): string[] {
  const v = new Date(Date.now() + 7 * 3600 * 1000)
  const now = `${v.getUTCFullYear()}-${String(v.getUTCMonth() + 1).padStart(2, '0')}`
  const out: string[] = []
  let [y, m] = THANG_DAU.split('-').map(Number)
  while (true) {
    const ym = `${y}-${String(m).padStart(2, '0')}`
    if (ym > now) break
    out.push(ym); m++; if (m > 12) { m = 1; y++ }
  }
  return out.reverse()
}
const khongDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
const so = (n: number) => n.toLocaleString('vi-VN')

type CotKey = 'et' | 'btvn' | 'tren_lop' | 'tham_du' | 'nhiem_vu' | 'vong_quay' | 'thanh_tuu' | 'nong_trai'
  | 'giai_thuong' | 'thay_co_cong' | 'thay_co_tru' | 'khac' | 'tong' | 'da_tieu' | 'so_du'
type Cot = { key: CotKey; ten: string; goi?: string }
const NHOM: { ten: string; mau: string; cot: Cot[] }[] = [
  { ten: 'Học trên lớp', mau: 'bg-sky-50 text-sky-700', cot: [
    { key: 'et', ten: 'ET' }, { key: 'btvn', ten: 'BTVN', goi: 'BTVN từng buổi + thưởng/phạt BTVN tháng' },
    { key: 'tren_lop', ten: 'Hoạt động lớp', goi: 'Game trong buổi học' }, { key: 'tham_du', ten: 'Tham dự', goi: 'Điểm tham dự buổi bù / bổ trợ' },
  ] },
  { ten: 'Trên app', mau: 'bg-violet-50 text-violet-700', cot: [
    { key: 'nhiem_vu', ten: 'Nhiệm vụ' }, { key: 'vong_quay', ten: 'Vòng quay' },
    { key: 'thanh_tuu', ten: 'Thành tựu', goi: 'Thành tựu + huy hiệu' }, { key: 'nong_trai', ten: 'Nông trại' },
  ] },
  { ten: 'Khác', mau: 'bg-amber-50 text-amber-700', cot: [
    { key: 'giai_thuong', ten: 'Giải thưởng', goi: 'Giải tháng (khối 3–7)' },
    { key: 'thay_co_cong', ten: 'Thầy cô +' }, { key: 'thay_co_tru', ten: 'Thầy cô −' },
    { key: 'khac', ten: 'Khác', goi: 'EXP gộp cũ (trước khi tách ET/BTVN) · cặp HS×môn vừa có EXP, chưa tới lượt chia giờ kế · em nghỉ học: ví đưa về 0 (số âm)' },
  ] },
]
const COT_CUOI: Cot[] = [
  { key: 'tong', ten: 'Tổng xu', goi: 'Tổng xu vào ví trong kỳ (mọi nguồn, đã trừ thầy cô trừ)' },
  { key: 'da_tieu', ten: 'Đã tiêu', goi: 'Đổi quà (đã trừ phần hoàn)' },
  { key: 'so_du', ten: 'Số dư', goi: 'Số dư HIỆN TẠI của ví (không theo kỳ)' },
]

export default function TongKetXuScreen() {
  const thangs = useMemo(listThang, [])
  const [ky, setKy] = useState<string | null>(null) // null = toàn bộ
  const [rows, setRows] = useState<XuTongKet[] | null>(null)
  const [tong, setTong] = useState<XuTongKetTong | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [khoiF, setKhoiF] = useState('')
  const [lopF, setLopF] = useState('')
  const [search, setSearch] = useState('')
  const [chiDangHoc, setChiDangHoc] = useState(true)
  const [sapXep, setSapXep] = useState<{ key: CotKey | 'ho_ten'; giam: boolean }>({ key: 'tong', giam: true })
  const [moPS, setMoPS] = useState<string | null>(null) // HS đang mở ô cộng/trừ tay

  // Đổi kỳ = đổi ngữ cảnh ⇒ xoá + tải lại. Nút ↻ ⇒ tải NỀN, giữ bảng cũ tới khi có bảng mới.
  const nap = (nen: boolean) => {
    if (!nen) { setRows(null); setTong(null) }
    setErr(null)
    Promise.all([listTongKetXu(ky), getTongKetXuTong(ky)])
      .then(([r, t]) => { setRows(r); setTong(t) })
      .catch((e) => { if (!nen) setRows([]); setErr(e?.message ?? String(e)) })
  }
  useEffect(() => nap(false), [ky]) // eslint-disable-line

  const khois = useMemo(() => [...new Set((rows ?? []).map((r) => r.khoi).filter(Boolean))]
    .sort((a, b) => (parseInt(a!) - parseInt(b!)) || a!.localeCompare(b!)) as string[], [rows])
  const lops = useMemo(() => [...new Set((rows ?? []).filter((r) => !khoiF || r.khoi === khoiF)
    .flatMap((r) => (r.lop ?? '').split(', ').filter(Boolean)))].sort() as string[], [rows, khoiF])
  const hienThi = useMemo(() => {
    const t = khongDau(search.trim())
    const loc = (rows ?? []).filter((r) =>
      (!chiDangHoc || r.trang_thai === 'dang_hoc') && (!khoiF || r.khoi === khoiF) &&
      (!lopF || (r.lop ?? '').split(', ').includes(lopF)) &&
      (!t || khongDau(r.ho_ten).includes(t) || (r.ma_hs ?? '').toLowerCase().includes(t)))
    const { key, giam } = sapXep
    return [...loc].sort((a, b) => {
      const d = key === 'ho_ten' ? a.ho_ten.localeCompare(b.ho_ten, 'vi') : (a[key] as number) - (b[key] as number)
      return giam ? -d : d
    })
  }, [rows, chiDangHoc, khoiF, lopF, search, sapXep])

  const boSapXep = (key: CotKey | 'ho_ten') => setSapXep((s) => ({ key, giam: s.key === key ? !s.giam : key !== 'ho_ten' }))
  const mui = (key: CotKey | 'ho_ten') => (sapXep.key === key ? (sapXep.giam ? ' ↓' : ' ↑') : '')

  // Sau cộng/trừ tay: vá ĐÚNG dòng HS đó (DB tính lại dòng) + tải nền dòng tổng.
  const vaDong = async (hocSinhId: string) => {
    const [moi, t] = await Promise.all([getTongKetXuHS(ky, hocSinhId), getTongKetXuTong(ky)])
    if (moi) setRows((prev) => (prev ?? []).map((r) => (r.hoc_sinh_id === hocSinhId ? moi : r)))
    setTong(t)
  }

  const tatCaCot = [...NHOM.flatMap((n) => n.cot), ...COT_CUOI]

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold text-slate-900">Tổng kết xu</h1>
        <select value={ky ?? ''} onChange={(e) => setKy(e.target.value || null)} className="h-9 rounded-lg border border-slate-300 px-2 text-sm">
          <option value="">Toàn bộ (từ tháng 8/2026)</option>
          {thangs.map((t) => <option key={t} value={t}>Tháng {Number(t.slice(5))}/{t.slice(0, 4)}</option>)}
        </select>
        <button onClick={() => nap(true)} className="h-9 rounded-lg border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50" title="Tải lại">↻</button>
        {err && <span className="text-[13px] font-medium text-rose-600">Lỗi: {err}</span>}
      </div>
      <p className="text-[12px] leading-relaxed text-slate-400">
        Xu tự đổi từ EXP theo thời gian thực (100 EXP = 1 xu, tính theo từng môn từng tháng) — không còn chốt tháng.
        Các cột từ EXP là số xu đã vào ví, chia theo tỉ lệ EXP của từng nguồn nên cộng lại đúng bằng Tổng xu.
        Số dư luôn là số dư hiện tại của ví, không theo kỳ đang chọn.
      </p>

      {/* Ô số toàn trung tâm — từ fn_xu_tong_ket_tong */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
          ['Học sinh', tong ? so(tong.so_hs) : '…'],
          [ky ? `Xu vào ví tháng ${Number(ky.slice(5))}` : 'Xu vào ví (toàn bộ)', tong ? so(tong.tong) : '…'],
          [ky ? `Đã tiêu tháng ${Number(ky.slice(5))}` : 'Đã tiêu (toàn bộ)', tong ? so(tong.da_tieu) : '…'],
          ['Số dư hiện tại (cả trung tâm)', tong ? so(tong.so_du) : '…'],
        ] as const).map(([ten, gt]) => (
          <div key={ten} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="text-[11.5px] font-medium uppercase tracking-wide text-slate-400">{ten}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{gt}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select value={khoiF} onChange={(e) => { setKhoiF(e.target.value); setLopF('') }} className="h-8 rounded-lg border border-slate-300 px-2 text-[13px]">
          <option value="">Mọi khối</option>
          {khois.map((k) => <option key={k} value={k}>Khối {k}</option>)}
        </select>
        <select value={lopF} onChange={(e) => setLopF(e.target.value)} className="h-8 rounded-lg border border-slate-300 px-2 text-[13px]">
          <option value="">Mọi lớp</option>
          {lops.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm tên / mã HS…"
          className="h-8 w-56 rounded-lg border border-slate-300 px-2.5 text-[13px]" />
        <label className="flex items-center gap-1.5 text-[13px] text-slate-600">
          <input type="checkbox" checked={chiDangHoc} onChange={(e) => setChiDangHoc(e.target.checked)} /> Chỉ HS đang học
        </label>
        {(khoiF || lopF || search) && (
          <button onClick={() => { setKhoiF(''); setLopF(''); setSearch('') }} className="text-[12px] text-slate-400 hover:text-slate-600">✕ bỏ lọc</button>
        )}
        <span className="ml-auto text-[12px] text-slate-400">{hienThi.length}/{rows?.length ?? 0} học sinh</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200">
        {!rows ? <div className="p-6 text-sm text-slate-400">Đang tải…</div>
        : hienThi.length === 0 ? <div className="p-6 text-sm text-slate-400">Không học sinh nào khớp bộ lọc.</div> : (
          <table className="w-full border-collapse whitespace-nowrap text-[12.5px]">
            <thead className="sticky top-0 z-10 bg-slate-50 text-[11.5px] text-slate-500">
              <tr>
                <th rowSpan={2} className="sticky left-0 z-20 bg-slate-50 px-3 py-1.5 text-left">
                  <button onClick={() => boSapXep('ho_ten')} className="font-semibold uppercase tracking-wide">Học sinh{mui('ho_ten')}</button>
                </th>
                <th rowSpan={2} className="px-2 py-1.5 text-left font-semibold uppercase tracking-wide">Lớp</th>
                {NHOM.map((n) => <th key={n.ten} colSpan={n.cot.length} className={`border-l border-white px-2 py-1 text-center font-semibold ${n.mau}`}>{n.ten}</th>)}
                <th colSpan={COT_CUOI.length} className="border-l border-white bg-slate-100 px-2 py-1 text-center font-semibold text-slate-600">Ví</th>
                <th rowSpan={2} className="px-2 py-1.5" />
              </tr>
              <tr>
                {tatCaCot.map((c) => (
                  <th key={c.key} title={c.goi} className="px-2 py-1 text-right font-medium">
                    <button onClick={() => boSapXep(c.key)} className={`${c.goi ? 'underline decoration-dotted underline-offset-2' : ''} hover:text-slate-800`}>{c.ten}{mui(c.key)}</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hienThi.map((r) => (
                <DongHS key={r.hoc_sinh_id} r={r} tatCaCot={tatCaCot} moPS={moPS === r.hoc_sinh_id}
                  onMoPS={() => setMoPS((v) => (v === r.hoc_sinh_id ? null : r.hoc_sinh_id))}
                  onDaGhi={() => vaDong(r.hoc_sinh_id)} />
              ))}
            </tbody>
            {tong && (
              <tfoot className="sticky bottom-0 border-t border-slate-200 bg-slate-50 font-semibold">
                <tr>
                  <td className="sticky left-0 bg-slate-50 px-3 py-2" colSpan={2}>Toàn trung tâm ({so(tong.so_hs)} HS)</td>
                  {tatCaCot.map((c) => <td key={c.key} className="px-2 py-2 text-right tabular-nums">{so(tong[c.key])}</td>)}
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </section>
  )
}

function DongHS({ r, tatCaCot, moPS, onMoPS, onDaGhi }: {
  r: XuTongKet; tatCaCot: Cot[]; moPS: boolean; onMoPS: () => void; onDaGhi: () => Promise<void>
}) {
  return (
    <>
      <tr className="border-t border-slate-100 hover:bg-slate-50/70">
        <td className="sticky left-0 bg-white px-3 py-1.5">
          <span className="font-medium text-slate-800">{r.ho_ten}</span>
          <span className="ml-1 text-[11px] text-slate-400">{r.ma_hs ?? ''}</span>
          {r.trang_thai !== 'dang_hoc' && <span className="ml-1 rounded bg-slate-100 px-1 text-[10px] text-slate-500">{r.trang_thai === 'nghi' ? 'nghỉ' : r.trang_thai === 'bao_luu' ? 'bảo lưu' : r.trang_thai}</span>}
        </td>
        <td className="px-2 py-1.5 text-[12px] text-slate-500">{r.lop ?? (r.khoi ? `Khối ${r.khoi}` : '—')}</td>
        {tatCaCot.map((c) => {
          const v = r[c.key]
          const dam = c.key === 'tong' || c.key === 'so_du'
          return (
            <td key={c.key} className={`px-2 py-1.5 text-right tabular-nums ${v === 0 ? 'text-slate-300' : v < 0 ? 'text-rose-600' : dam ? 'font-semibold text-slate-900' : 'text-slate-700'} ${c.key === 'tong' ? 'border-l border-slate-100' : ''}`}>
              {v === 0 ? '·' : so(v)}
            </td>
          )
        })}
        <td className="px-2 py-1.5 text-center">
          <button onClick={onMoPS} title="Cộng / trừ xu tay" className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${moPS ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}>±</button>
        </td>
      </tr>
      {moPS && <PhatSinhDong hocSinhId={r.hoc_sinh_id} ten={r.ho_ten} colSpan={tatCaCot.length + 3} onDaGhi={onDaGhi} />}
    </>
  )
}

// Cộng/trừ xu TAY — ghi thẳng sổ chung (cong_tay ≥0 / tru_tay <0, append-only), giống màn Chốt xu cũ.
function PhatSinhDong({ hocSinhId, ten, colSpan, onDaGhi }: { hocSinhId: string; ten: string; colSpan: number; onDaGhi: () => Promise<void> }) {
  const [v, setV] = useState(''); const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState<string | null>(null)
  const ghi = async () => {
    const n = Number(v)
    if (!v.trim() || Number.isNaN(n) || n === 0 || !Number.isInteger(n)) { setMsg('Nhập số xu nguyên, khác 0 (âm = trừ).'); return }
    setBusy(true); setMsg(null)
    try { await themPhatSinh(hocSinhId, n, lyDo.trim()); await onDaGhi(); setV(''); setLyDo(''); setMsg(`Đã ${n > 0 ? 'cộng' : 'trừ'} ${Math.abs(n)} xu.`) }
    catch (e: any) { setMsg('Lỗi: ' + (e?.message ?? String(e))) } finally { setBusy(false) }
  }
  return (
    <tr className="bg-slate-50">
      <td colSpan={colSpan} className="px-3 py-2">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
          <span className="text-slate-500">Cộng / trừ xu tay cho <b className="text-slate-700">{ten}</b>:</span>
          <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ghi()} type="number" placeholder="±xu"
            className="h-7 w-20 rounded border border-slate-300 px-1.5 text-right" />
          <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ghi()} placeholder="Lý do"
            className="h-7 w-64 rounded border border-slate-300 px-1.5" />
          <button onClick={ghi} disabled={busy || !v.trim()} className="h-7 rounded bg-slate-800 px-3 text-[12px] font-semibold text-white hover:bg-slate-700 disabled:opacity-40">{busy ? '…' : 'Ghi'}</button>
          {msg && <span className={msg.startsWith('Lỗi') || msg.startsWith('Nhập') ? 'text-rose-600' : 'text-emerald-700'}>{msg}</span>}
        </div>
      </td>
    </tr>
  )
}
