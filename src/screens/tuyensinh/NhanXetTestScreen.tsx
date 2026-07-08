// Nhận xét test đầu vào (Story 3) — pool team học thuật. Biểu đồ chuyên đề CHỈ để trông xịn (tham
// chiếu, không phải điểm). Nhận xét nhập tay + chọn lớp đề xuất (REUSE ung_vien.lop_du_kien_id).
import { useEffect, useState } from 'react'
import {
  listCanNhanXet, getBieuDoChuyenDe, setNhanXet, dongNhanXet, timNhanXetMau, luuNhanXetMau,
  type CaTestChoNhanXet, type BieuDoChuyenDe, type NhanXet,
} from '../../lib/detest'
import { listLop } from '../../lib/nhansu'
import SearchSelect from '../../components/SearchSelect'

const isPdf = (url: string) => /\.pdf(\?|$)/i.test(url)
const KY_NANG_OPTS: { v: 'tot' | 'on' | 'kem'; lbl: string; cls: string }[] = [
  { v: 'tot', lbl: 'Tốt', cls: 'bg-emerald-600 text-white' }, { v: 'on', lbl: 'Ổn', cls: 'bg-amber-500 text-white' }, { v: 'kem', lbl: 'Kém', cls: 'bg-rose-600 text-white' },
]

export default function NhanXetTestScreen() {
  const [queue, setQueue] = useState<CaTestChoNhanXet[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)

  async function reload() { setLoading(true); try { setQueue(await listCanNhanXet()) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [])

  if (openId) {
    const item = queue.find((c) => c.id === openId)
    if (item) return <NhanXetCard item={item} onClose={() => setOpenId(null)} onDone={async () => { setOpenId(null); await reload() }} />
  }

  return (
    <div className="h-full overflow-auto">
    <div className="mx-auto max-w-[900px] p-6">
      <h2 className="mb-1 text-[20px] font-semibold text-slate-800">Nhận xét test đầu vào</h2>
      <p className="mb-4 text-[12px] text-slate-400">Hàng đợi chung của team học thuật — ai mở thì làm.</p>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : queue.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không còn bài nào cần nhận xét.</div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {queue.map((c) => (
            <button key={c.id} onClick={() => setOpenId(c.id)} className="rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm hover:shadow-md">
              <div className="text-[14px] font-semibold text-slate-800">{c.hoTenHs}</div>
              <div className="mt-0.5 text-[12px] text-slate-400">{c.mon}{c.khoi ? ` · Lớp ${c.khoi}` : ''} · {new Date(c.ngay + 'T00:00:00').toLocaleDateString('vi-VN')}</div>
            </button>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}

// Ô nhận xét gõ-để-tìm mẫu (thư viện chung, per môn+nhóm) — mirror V1 sat_hach_nhan_xet_templates.
function MauInput({ mon, nhom, value, onChange, placeholder }: { mon: string; nhom: 'ky_nang' | 'kien_thuc' | 'khac'; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [goiY, setGoiY] = useState<{ id: string; noiDung: string }[]>([])
  const [showGoiY, setShowGoiY] = useState(false)
  useEffect(() => {
    if (!showGoiY) return
    const t = setTimeout(() => { timNhanXetMau(mon, nhom, value).then((r) => setGoiY(r.map((x) => ({ id: x.id, noiDung: x.noiDung })))).catch(() => setGoiY([])) }, 200)
    return () => clearTimeout(t)
  }, [value, showGoiY, mon, nhom])
  return (
    <div className="relative">
      <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setShowGoiY(true)} onBlur={() => setTimeout(() => setShowGoiY(false), 150)}
        placeholder={placeholder} className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-indigo-400" />
      {showGoiY && goiY.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {goiY.map((g) => (
            <button key={g.id} onMouseDown={() => { onChange(g.noiDung); setShowGoiY(false) }} className="block w-full truncate px-2.5 py-1.5 text-left text-[12px] text-slate-600 hover:bg-indigo-50">{g.noiDung}</button>
          ))}
        </div>
      )}
      {value.trim() && <button onMouseDown={(e) => { e.preventDefault(); luuNhanXetMau(mon, nhom, value) }} className="absolute right-1.5 top-1.5 text-[11px] text-slate-300 hover:text-indigo-500" title="Lưu làm mẫu">💾</button>}
    </div>
  )
}

function NhanXetCard({ item, onClose, onDone }: { item: CaTestChoNhanXet; onClose: () => void; onDone: () => void }) {
  const [bieuDo, setBieuDo] = useState<BieuDoChuyenDe[]>([])
  const [nx, setNx] = useState<NhanXet>({})
  const [lopOpts, setLopOpts] = useState<{ id: string; label: string; sub?: string }[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    getBieuDoChuyenDe(item.id, item.mon).then(setBieuDo).catch(() => setBieuDo([]))
    listLop(item.khoi ?? undefined).then((l) => setLopOpts(l.filter((x) => x.mon === item.mon).map((x) => ({ id: x.id, label: x.ten_lop, sub: x.mon }))))
  }, [item.id]) // eslint-disable-line

  async function luu() { await setNhanXet(item.id, nx) }
  async function ketThuc() {
    setBusy(true); setErr(null)
    try { await setNhanXet(item.id, nx); await dongNhanXet(item.id, item.ungVienId, lopId); onDone() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-indigo-600 hover:underline">← Quay lại</button>
        <span className="text-[14px] font-semibold text-slate-800">{item.hoTenHs}</span>
        <span className="text-[12px] text-slate-400">{item.mon}{item.khoi ? ` · Lớp ${item.khoi}` : ''}</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_420px] gap-0 overflow-hidden">
        <div className="min-h-0 overflow-auto border-r border-slate-200 bg-slate-50 p-2">
          {item.baiUrl ? (
            isPdf(item.baiUrl) ? <iframe src={item.baiUrl} title="scan" className="h-[1400px] w-full rounded border border-slate-200 bg-white" />
              : <img src={item.baiUrl} alt="scan" className="w-full rounded border border-slate-200" />
          ) : <p className="p-4 text-sm text-slate-400">Chưa có bài scan.</p>}
        </div>
        <div className="min-h-0 overflow-auto p-4">
          {bieuDo.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Tổng hợp theo chuyên đề</div>
              {bieuDo.map((b) => (
                <div key={b.chuyenDe} className="mb-1.5">
                  <div className="flex justify-between text-[12px] text-slate-500"><span>{b.chuyenDe}</span><span className="font-semibold">{b.pct}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${b.pct >= 70 ? 'bg-emerald-500' : b.pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${b.pct}%` }} /></div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Kỹ năng</div>
          {(['trinhBay', 'tinhToan'] as const).map((k) => (
            <div key={k} className="mb-2 flex items-center gap-2">
              <span className="w-24 text-[13px] text-slate-600">{k === 'trinhBay' ? 'Trình bày' : 'Tính toán'}</span>
              {KY_NANG_OPTS.map((o) => (
                <button key={o.v} onClick={() => setNx((s) => ({ ...s, [k]: s[k] === o.v ? undefined : o.v }))}
                  className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${nx[k] === o.v ? o.cls : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{o.lbl}</button>
              ))}
            </div>
          ))}

          <div className="mb-1.5 mt-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Kiến thức</div>
          {([['hinhCoBan', 'Hình cơ bản'], ['daiCoBan', 'Đại cơ bản'], ['hinhNangCao', 'Hình nâng cao'], ['daiNangCao', 'Đại nâng cao']] as const).map(([k, lbl]) => (
            <div key={k} className="mb-1.5">
              <div className="mb-0.5 text-[12px] text-slate-500">{lbl}</div>
              <MauInput mon={item.mon} nhom="kien_thuc" value={nx.kienThuc?.[k] ?? ''} onChange={(v) => setNx((s) => ({ ...s, kienThuc: { ...s.kienThuc, [k]: v } }))} placeholder={`Nhận xét ${lbl.toLowerCase()}…`} />
            </div>
          ))}

          <div className="mb-1 mt-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Nhận xét khác</div>
          <MauInput mon={item.mon} nhom="khac" value={nx.khac ?? ''} onChange={(v) => setNx((s) => ({ ...s, khac: v }))} placeholder="Tuỳ chọn…" />

          <div className="mb-1 mt-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Lớp đề xuất</div>
          <SearchSelect value={lopId} onChange={setLopId} options={lopOpts} placeholder="🔎 Chọn lớp đề xuất…" />

          {err && <p className="mt-2 text-[12px] text-rose-600">{err}</p>}
          <div className="mt-4 flex gap-2">
            <button onClick={luu} className="flex-1 rounded-lg border border-slate-200 py-2 text-[13px] font-medium text-slate-600 hover:border-indigo-300">Lưu nháp</button>
            <button onClick={ketThuc} disabled={busy} className="flex-1 rounded-lg bg-emerald-600 py-2 text-[13px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">{busy ? 'Đang xử lý…' : '✓ Kết thúc nhận xét'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
