// CHỐT XU THÁNG (CEO-only, leaf founderOnly) — Thùy chốt 08-29: mỗi tháng chốt 1 lần, quy EXP→xu
// TỪNG MÔN theo bảng mốc luong_bac (chỉnh ngay tại đây, không hardcode), cộng vào VÍ XU chung của HS.
// Đóng băng sau chốt; data trễ/sửa điểm làm lệch → nút chốt hiện "điều chỉnh ±" (dòng chot_lai, kiểu học phí).
import { useEffect, useMemo, useState } from 'react'
import { addBacXu, updateBacXu, deleteBacXu, previewChotXu, chotXu, listViXu, type BacXu, type ChotRow } from '../../lib/xu'

// Các tháng của mùa từ tháng ĐẦU CHỐT (Thùy: tháng 8/2026) đến tháng VN hiện tại.
const THANG_DAU = '2026-08'
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

// So khớp tên không dấu (gõ "lam anh" vẫn ra "Lâm Anh")
const khongDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()

export default function ChotXuScreen() {
  const thangs = useMemo(listThang, [])
  const [ym, setYm] = useState(thangs[0])
  const [rows, setRows] = useState<ChotRow[] | null>(null)
  const [bacs, setBacs] = useState<BacXu[]>([])
  const [vi, setVi] = useState<Map<string, number>>(new Map())
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [khoiF, setKhoiF] = useState('')   // filter khối ('' = tất cả)
  const [lopF, setLopF] = useState('')     // filter lớp
  const [search, setSearch] = useState('') // tìm tên/mã HS

  const load = () => {
    setRows(null); setMsg(null)
    Promise.all([previewChotXu(ym), listViXu()])
      .then(([p, v]) => { setRows(p.rows); setBacs(p.bacs); setVi(v) })
      .catch((e) => { setRows([]); setMsg('Lỗi tải: ' + (e?.message ?? e)) })
  }
  useEffect(load, [ym])

  // NÚT CHỐT tính trên TOÀN BỘ tháng (không theo filter — filter chỉ để xem); bảng hiển thị thì lọc.
  const chuaChot = (rows ?? []).filter((r) => !r.daChot && r.xu > 0)
  const lech = (rows ?? []).filter((r) => r.daChot && r.lech !== 0)
  const khois = useMemo(() => [...new Set((rows ?? []).map((r) => r.khoi).filter(Boolean))].sort() as string[], [rows])
  const lops = useMemo(() => [...new Set((rows ?? []).filter((r) => !khoiF || r.khoi === khoiF).map((r) => r.tenLop).filter(Boolean))].sort() as string[], [rows, khoiF])
  const hienThi = useMemo(() => (rows ?? []).filter((r) =>
    (!khoiF || r.khoi === khoiF) && (!lopF || r.tenLop === lopF) &&
    (!search.trim() || khongDau(r.ho_ten).includes(khongDau(search.trim())) || (r.ma_hs ?? '').toLowerCase().includes(search.trim().toLowerCase()))
  ), [rows, khoiF, lopF, search])
  const onChot = async () => {
    if (busy) return
    setBusy(true); setMsg(null)
    try {
      const kq = await chotXu(ym)
      setMsg(`Đã chốt: ${kq.moi} dòng mới · ${kq.dieuChinh} điều chỉnh · ${kq.tongXu >= 0 ? '+' : ''}${kq.tongXu} xu vào ví.`)
      load()
    } catch (e: any) { setMsg('Lỗi chốt: ' + (e?.message ?? e)) } finally { setBusy(false) }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold text-slate-900">Chốt xu tháng</h1>
        <select value={ym} onChange={(e) => setYm(e.target.value)} className="h-9 rounded-lg border border-slate-300 px-2 text-sm">
          {thangs.map((t) => <option key={t} value={t}>Tháng {Number(t.slice(5))}/{t.slice(0, 4)}</option>)}
        </select>
        <button onClick={onChot} disabled={busy || !rows || (chuaChot.length === 0 && lech.length === 0)}
          className="h-9 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          {busy ? 'Đang chốt…' : chuaChot.length > 0 ? `Chốt tháng ${Number(ym.slice(5))} (${chuaChot.length} dòng)` : lech.length > 0 ? `Chốt lại — ghi ${lech.length} điều chỉnh ±`
            // Phân biệt 2 lý do nút tắt: mốc chưa ra xu (việc của CEO: chỉnh mốc) ≠ đã chốt thật sự.
            : (rows ?? []).some((r) => r.exp > 0 && !r.daChot) ? 'Mốc hiện tại ra 0 xu — chỉnh mốc bên phải' : 'Đã chốt đủ'}
        </button>
        {msg && <span className={`text-[13px] font-medium ${msg.startsWith('Lỗi') ? 'text-rose-600' : 'text-emerald-700'}`}>{msg}</span>}
      </div>
      <p className="text-[12px] text-slate-400">
        Quy đổi TỪNG MÔN theo bảng mốc bên phải (giữa 2 mốc lấy mốc dưới) rồi cộng ví chung. Chốt xong là đóng băng —
        nếu EXP tháng đã chốt thay đổi (nhập trễ/sửa điểm), bảng hiện cột lệch và nút chuyển thành "Chốt lại" ghi dòng điều chỉnh ±.
        "Phát sinh" = xu thưởng/phạt TAY trong tháng (luồng riêng, không dính chốt EXP). Nút chốt luôn chốt CẢ THÁNG — filter chỉ để xem.
      </p>
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
        {(khoiF || lopF || search) && (
          <button onClick={() => { setKhoiF(''); setLopF(''); setSearch('') }} className="text-[12px] text-slate-400 hover:text-slate-600">✕ bỏ lọc</button>
        )}
        <span className="ml-auto text-[12px] text-slate-400">{hienThi.length}/{rows?.length ?? 0} dòng</span>
      </div>
      <div className="flex min-h-0 flex-1 gap-5">
        <div className="min-w-0 flex-1 overflow-auto rounded-xl border border-slate-200">
          {!rows ? <div className="p-6 text-sm text-slate-400">Đang tải…</div> : rows.length === 0 ? <div className="p-6 text-sm text-slate-400">Không có EXP tháng này.</div>
          : hienThi.length === 0 ? <div className="p-6 text-sm text-slate-400">Không dòng nào khớp bộ lọc.</div> : (
            <table className="w-full border-collapse text-[13px]">
              <thead className="sticky top-0 bg-slate-50 text-left text-[12px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Học sinh</th><th className="px-3 py-2">Lớp</th><th className="px-3 py-2">Môn</th>
                  <th className="px-3 py-2 text-right">EXP tháng</th><th className="px-3 py-2 text-right">Xu theo thang</th>
                  <th className="px-3 py-2 text-right">Đã phát</th><th className="px-3 py-2 text-right">Lệch</th>
                  <th className="px-3 py-2 text-right">Phát sinh</th><th className="px-3 py-2 text-right">Ví hiện tại</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Phát sinh/Ví là số PER HS (không per môn) — chỉ in ở dòng ĐẦU của mỗi HS để khỏi trùng khi cộng mắt.
                  const seen = new Set<string>()
                  return hienThi.map((r, i) => {
                    const first = !seen.has(r.hoc_sinh_id); if (first) seen.add(r.hoc_sinh_id)
                    return (
                      <tr key={i} className={`border-t border-slate-100 ${r.daChot && r.lech !== 0 ? 'bg-amber-50/60' : ''}`}>
                        <td className="px-3 py-1.5">{r.ho_ten}<span className="ml-1 text-[11px] text-slate-400">{r.ma_hs ?? ''}</span></td>
                        <td className="px-3 py-1.5 text-[12px] text-slate-500">{r.tenLop ?? '—'}</td>
                        <td className="px-3 py-1.5"><span className="rounded bg-slate-100 px-1.5 text-[11px] text-slate-600">{r.mon || '—'}</span></td>
                        <td className="px-3 py-1.5 text-right tabular-nums">{r.exp.toLocaleString('vi-VN')}</td>
                        <td className="px-3 py-1.5 text-right font-semibold tabular-nums text-indigo-700">{r.xu}</td>
                        <td className="px-3 py-1.5 text-right tabular-nums text-slate-500">{r.daChot ? r.xuDaPhat : '—'}</td>
                        <td className={`px-3 py-1.5 text-right font-semibold tabular-nums ${!r.daChot ? 'text-slate-300' : r.lech === 0 ? 'text-slate-300' : r.lech > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {!r.daChot || r.lech === 0 ? '—' : (r.lech > 0 ? '+' : '') + r.lech}</td>
                        <td className={`px-3 py-1.5 text-right tabular-nums ${!first || r.phatSinh === 0 ? 'text-slate-300' : r.phatSinh > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {first && r.phatSinh !== 0 ? (r.phatSinh > 0 ? '+' : '') + r.phatSinh : '—'}</td>
                        <td className={`px-3 py-1.5 text-right tabular-nums text-amber-700 ${first ? '' : 'opacity-30'}`}>{(vi.get(r.hoc_sinh_id) ?? 0).toLocaleString('vi-VN')}</td>
                      </tr>
                    )
                  })
                })()}
              </tbody>
              <tfoot className="border-t border-slate-200 bg-slate-50 font-semibold">
                <tr>
                  <td className="px-3 py-2" colSpan={3}>Tổng lọc ({hienThi.length} dòng · {new Set(hienThi.map((r) => r.hoc_sinh_id)).size} HS)</td>
                  <td className="px-3 py-2 text-right tabular-nums">{hienThi.reduce((s, r) => s + r.exp, 0).toLocaleString('vi-VN')}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-indigo-700">{hienThi.reduce((s, r) => s + r.xu, 0).toLocaleString('vi-VN')}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-500">{hienThi.reduce((s, r) => s + r.xuDaPhat, 0).toLocaleString('vi-VN')}</td>
                  <td className="px-3 py-2" />
                  {/* Phát sinh cộng PER HS (Set) — cộng theo dòng sẽ đếm trùng HS học 2 môn */}
                  <td className="px-3 py-2 text-right tabular-nums">{(() => { const s = new Set<string>(); let t = 0; for (const r of hienThi) if (!s.has(r.hoc_sinh_id)) { s.add(r.hoc_sinh_id); t += r.phatSinh } return (t > 0 ? '+' : '') + t.toLocaleString('vi-VN') })()}</td>
                  <td className="px-3 py-2" />
                </tr>
              </tfoot>
            </table>
          )}
        </div>
        <BangMoc bacs={bacs} onChanged={load} />
      </div>
    </section>
  )
}

// ── BẢNG MỐC QUY ĐỔI (luong_bac) — CEO thêm/sửa/xoá; preview tự tính lại theo mốc mới ──
function BangMoc({ bacs, onChanged }: { bacs: BacXu[]; onChanged: () => void }) {
  const [minExp, setMinExp] = useState(''); const [xu, setXu] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const wrap = async (fn: () => Promise<void>) => { setErr(null); try { await fn(); onChanged() } catch (e: any) { setErr(e?.message ?? String(e)) } }
  return (
    <div className="w-72 shrink-0 self-start rounded-xl border border-slate-200 p-4">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-600">Mốc quy đổi (EXP → xu)</div>
      <div className="space-y-1">
        {bacs.length === 0 && <p className="text-[12px] text-slate-400">Chưa có mốc — thêm bên dưới (VD 1000 → 10).</p>}
        {bacs.map((b) => (
          <div key={b.min_exp} className="flex items-center gap-2 rounded-md border border-slate-100 px-2 py-1 text-[13px]">
            <span className="tabular-nums text-slate-600">≥ {b.min_exp.toLocaleString('vi-VN')} EXP</span>
            <span className="text-slate-300">→</span>
            <input type="number" defaultValue={b.xu} onBlur={(e) => { const v = Number(e.target.value); if (v !== b.xu) wrap(() => updateBacXu(b.min_exp, v)) }}
              className="w-16 rounded border border-slate-200 px-1 text-right tabular-nums" />
            <span className="text-[11px] text-slate-400">xu</span>
            <button onClick={() => wrap(() => deleteBacXu(b.min_exp))} className="ml-auto text-slate-300 hover:text-rose-500">✕</button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input value={minExp} onChange={(e) => setMinExp(e.target.value)} placeholder="EXP" type="number" className="w-20 rounded border border-slate-300 px-1.5 py-1 text-right text-[13px]" />
        <span className="text-slate-300">→</span>
        <input value={xu} onChange={(e) => setXu(e.target.value)} placeholder="xu" type="number" className="w-16 rounded border border-slate-300 px-1.5 py-1 text-right text-[13px]" />
        <button onClick={() => { if (minExp !== '' && xu !== '') wrap(async () => { await addBacXu(Number(minExp), Number(xu)); setMinExp(''); setXu('') }) }}
          className="rounded-md bg-slate-800 px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-slate-700">Thêm</button>
      </div>
      {err && <p className="mt-2 text-[12px] text-rose-600">{err}</p>}
      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        Giữa 2 mốc lấy mốc dưới; dưới mốc thấp nhất = 0 xu; trên mốc cao nhất = mốc cao nhất.
        Màn Thành tích (xu ước tính tháng) dùng CHUNG bảng này.
      </p>
    </div>
  )
}
