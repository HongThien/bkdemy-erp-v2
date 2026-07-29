// REPORT PHỤ HUYNH (tháng) — 1 leaf riêng. Chọn HS + môn + tháng.
//   Khu 1: số liệu HS — bảng theo buổi (ET/BTVN/thái độ) + tổng quan mastery (tái dùng getTongQuanHS).
//   Khu 2: nhận xét GV — 3 ô (Thái độ · Kiến thức & Kĩ năng · Kết luận), tự lưu.
import { useEffect, useState } from 'react'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { listHSDangHoc } from '../../lib/tuyensinh'
import { getTongQuanHS, type TongQuanHS } from '../../lib/mastery'
import { getReportBuoiHS, getBaoCaoPH, upsertBaoCaoPH, type ReportBuoiRow, type BaoCaoPH } from '../../lib/report'

const MON_CO_KHO = ['Toán', 'KHTN']
const curYM = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
const shiftYM = (ym: string, delta: number) => { const [y, m] = ym.split('-').map(Number); const i = y * 12 + (m - 1) + delta; return `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}` }
const NOP_LABEL: Record<string, string> = { nop_dung_han: 'Đúng hạn', nop_muon: 'Nộp muộn', xin_phep: 'Xin phép', khong_lam: 'Không làm' }
const TD_LABEL: Record<string, string> = { nghiem_tuc: 'Nghiêm túc', chua_het_suc: 'Chưa hết sức', chua_nghiem_tuc: 'Chưa nghiêm túc', chong_doi: 'Chống đối' }
const TD_CLS: Record<string, string> = { nghiem_tuc: 'text-emerald-700', chua_het_suc: 'text-amber-700', chua_nghiem_tuc: 'text-rose-700', chong_doi: 'text-rose-800 font-bold' }
const pctCls = (p: number | null) => p == null ? 'text-slate-300' : p >= 80 ? 'text-emerald-700' : p >= 50 ? 'text-amber-700' : 'text-rose-700'
const fmtNgay = (iso: string) => { const d = new Date(iso + 'T00:00:00'); return isNaN(+d) ? iso : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) }

export default function ReportPHScreen() {
  const [mon, setMon] = useState('Toán')
  const [hsId, setHsId] = useState<string | null>(null)
  const [hsOpts, setHsOpts] = useState<Opt[]>([])
  const [ym, setYm] = useState(curYM())

  useEffect(() => {
    setHsId(null)
    listHSDangHoc(mon, 3650).then((hs) => setHsOpts(hs.map((h) => ({ id: h.id, label: h.ho_ten, sub: [h.ma_hs, h.khoi ? `K${h.khoi}` : null].filter(Boolean).join(' · ') || undefined })))).catch(() => setHsOpts([]))
  }, [mon])

  const monBtn = (on: boolean) => `h-7 rounded-md px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`
  const [yy, mm] = ym.split('-')
  return (
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Report phụ huynh</span>
        {MON_CO_KHO.map((m) => <button key={m} onClick={() => setMon(m)} className={monBtn(mon === m)}>{m}</button>)}
        <div className="ml-2 w-72"><SearchSelect value={hsId} onChange={setHsId} options={hsOpts} placeholder="Tìm học sinh…" avatars /></div>
        <div className="ml-2 flex items-center gap-0.5 rounded-md ring-1 ring-slate-200">
          <button onClick={() => setYm(shiftYM(ym, -1))} className="h-7 rounded-l-md px-2 text-slate-500 hover:bg-slate-100" title="Tháng trước">‹</button>
          <span className="min-w-[92px] text-center text-[13px] font-semibold tabular-nums text-slate-700">Tháng {Number(mm)}/{yy}</span>
          <button onClick={() => setYm(shiftYM(ym, +1))} className="h-7 rounded-r-md px-2 text-slate-500 hover:bg-slate-100" title="Tháng sau">›</button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {!hsId ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Chọn một học sinh để xem report.</div>
        ) : <ReportBody key={hsId + mon + ym} hsId={hsId} mon={mon} ym={ym} />}
      </div>
    </div>
  )
}

function ReportBody({ hsId, mon, ym }: { hsId: string; mon: string; ym: string }) {
  const [rows, setRows] = useState<ReportBuoiRow[] | null>(null)
  const [tq, setTq] = useState<TongQuanHS | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    Promise.all([getReportBuoiHS(hsId, mon, ym), getTongQuanHS(hsId, mon)])
      .then(([r, t]) => { setRows(r); setTq(t) }).catch(() => { setRows([]); setTq(null) }).finally(() => setLoading(false))
  }, [hsId, mon, ym])
  if (loading) return <p className="text-sm text-slate-500">Đang tải…</p>
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* ── KHU 1: SỐ LIỆU ── */}
      {tq && <TongQuanCards tq={tq} />}
      <div>
        <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Chi tiết theo buổi · tháng {Number(ym.split('-')[1])}</h3>
        {!rows || rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">Không có buổi nào trong tháng này.</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-[13px]">
              <thead><tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="px-4 py-2 text-left font-semibold">Buổi</th>
                <th className="px-3 py-2 text-center font-semibold">ET</th>
                <th className="px-3 py-2 text-center font-semibold">BTVN</th>
                <th className="px-4 py-2 text-left font-semibold">Thái độ BTVN</th>
              </tr></thead>
              <tbody>
                {rows.map((r) => <BuoiRow key={r.buoiId} r={r} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* ── KHU 2: NHẬN XÉT GV ── */}
      <NhanXet hsId={hsId} mon={mon} ym={ym} />
    </div>
  )
}

function BuoiRow({ r }: { r: ReportBuoiRow }) {
  const btvnCell = r.btvnTrangThai === 'khong_lam' || r.btvnTrangThai === 'xin_phep'
    ? <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[12px] font-semibold text-rose-700">{NOP_LABEL[r.btvnTrangThai] ?? 'Không làm'}</span>
    : r.btvnPct != null ? <span className={`font-bold tabular-nums ${pctCls(r.btvnPct)}`}>{r.btvnPct}%</span>
    : r.btvnTrangThai ? <span className="text-[12px] text-slate-500">{NOP_LABEL[r.btvnTrangThai] ?? r.btvnTrangThai}</span>
    : <span className="text-slate-300">—</span>
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-1.5 font-medium text-slate-700">{fmtNgay(r.ngay)}{r.maBuoi ? <span className="ml-1.5 font-mono text-[10px] text-slate-400">{r.maBuoi}</span> : null}</td>
      <td className="px-3 py-1.5 text-center">{r.vang ? <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[12px] font-semibold text-rose-700">Vắng</span> : r.etPct != null ? <span className={`font-bold tabular-nums ${pctCls(r.etPct)}`}>{r.etPct}%</span> : <span className="text-slate-300">—</span>}</td>
      <td className="px-3 py-1.5 text-center">{btvnCell}</td>
      <td className="px-4 py-1.5">{r.btvnThaiDo ? <span className={`text-[12px] ${TD_CLS[r.btvnThaiDo] ?? 'text-slate-600'}`}>{TD_LABEL[r.btvnThaiDo] ?? r.btvnThaiDo}</span> : <span className="text-slate-300">—</span>}</td>
    </tr>
  )
}

function Tile({ label, pct, sub }: { label: string; pct: number | null; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
      <div className={`text-[20px] font-bold tabular-nums ${pctCls(pct)}`}>{pct == null ? '—' : pct + '%'}</div>
      {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
    </div>
  )
}
function TongQuanCards({ tq }: { tq: TongQuanHS }) {
  const h = tq.hoanThanh, a = tq.hoatDong
  return (
    <div className="space-y-3">
      <div>
        <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Hoàn thành kiến thức (cả quá trình)</h3>
        <div className="grid grid-cols-3 gap-2.5">
          <Tile label="Toàn bộ" pct={h.toanBo.etMt.pct} sub={`${h.toanBo.etMt.dat}/${h.toanBo.etMt.total} dạng đạt`} />
          <Tile label="Cơ bản" pct={h.daiCoBan.etMt.pct} sub={`${h.daiCoBan.etMt.dat}/${h.daiCoBan.etMt.total} dạng`} />
          <Tile label="Nâng cao" pct={h.daiNangCao.etMt.pct} sub={`${h.daiNangCao.etMt.dat}/${h.daiNangCao.etMt.total} dạng`} />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Hoạt động (độ đúng)</h3>
        <div className="grid grid-cols-3 gap-2.5 md:grid-cols-6">
          <Tile label="ET cơ bản" pct={a.etCoBan.pct} />
          <Tile label="ET nâng cao" pct={a.etNangCao.pct} />
          <Tile label="BTVN cơ bản" pct={a.btvnCoBan.pct} />
          <Tile label="BTVN nâng cao" pct={a.btvnNangCao.pct} />
          <Tile label="MT cơ bản" pct={a.mtCoBan.pct} />
          <Tile label="MT nâng cao" pct={a.mtNangCao.pct} />
        </div>
      </div>
      <div className="flex gap-3 text-[13px]">
        <span className="rounded-lg bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">Điểm MT TB: <b className="tabular-nums">{tq.diem.mt.tb ?? '—'}</b> <span className="text-slate-400">({tq.diem.mt.n})</span></span>
        <span className="rounded-lg bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">Điểm trường TB: <b className="tabular-nums">{tq.diem.truong.tb ?? '—'}</b> <span className="text-slate-400">({tq.diem.truong.n})</span></span>
      </div>
    </div>
  )
}

const NX_FIELDS: { key: keyof BaoCaoPH; label: string; ph: string }[] = [
  { key: 'thai_do', label: 'Thái độ học tập', ph: 'Nhận xét thái độ, tính chuyên cần, tinh thần học tập trong tháng…' },
  { key: 'kien_thuc_ky_nang', label: 'Kiến thức & Kĩ năng', ph: 'Mức nắm kiến thức, kĩ năng làm bài, điểm mạnh/yếu…' },
  { key: 'ket_luan', label: 'Kết luận', ph: 'Kết luận chung + định hướng tháng tới…' },
]
function NhanXet({ hsId, mon, ym }: { hsId: string; mon: string; ym: string }) {
  const [val, setVal] = useState<BaoCaoPH>({ thai_do: null, kien_thuc_ky_nang: null, ket_luan: null })
  const [saved, setSaved] = useState<string | null>(null)
  useEffect(() => { getBaoCaoPH(hsId, mon, ym).then(setVal).catch(() => {}) }, [hsId, mon, ym])
  const save = async (key: keyof BaoCaoPH, v: string) => {
    const patch = { [key]: v.trim() || null }
    setVal((p) => ({ ...p, ...patch }))
    try { await upsertBaoCaoPH(hsId, mon, ym, patch); setSaved(key); setTimeout(() => setSaved((s) => (s === key ? null : s)), 1500) } catch { /* ignore */ }
  }
  return (
    <div>
      <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-500">Nhận xét của giáo viên</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {NX_FIELDS.map((f) => (
          <div key={f.key} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-700">{f.label}</span>
              {saved === f.key && <span className="text-[11px] text-emerald-600">✓ đã lưu</span>}
            </div>
            <textarea defaultValue={val[f.key] ?? ''} onBlur={(e) => save(f.key, e.target.value)} placeholder={f.ph} rows={5}
              className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-2 text-[13px] leading-relaxed focus:border-indigo-300 focus:bg-white focus:outline-none" />
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">Nhận xét tự lưu khi rời ô. Áp cho {mon} · tháng {Number(ym.split('-')[1])}/{ym.split('-')[0]}.</p>
    </div>
  )
}
