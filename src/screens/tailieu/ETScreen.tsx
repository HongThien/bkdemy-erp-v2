// Màn "ET" = CHÍNH LÀ form tạo ET (không list, không popup gate). Vào là thấy luôn:
//   - gán LỚP + NGÀY (buổi) ở đầu · cấu trúc câu (mặc định 5 hàng) ở dưới.
//   - mỗi hàng: chọn DẠNG → hệ gợi ý câu ít-dùng-nhất (đổi được) → câu không trùng trong đề.
// Bấm "Lưu ET" → lưu vào KHO TÀI LIỆU → form reset về tạo ET mới. Sửa ET cũ = từ Kho tài liệu (mở ETEditor edit).
// ET nối buổi qua (lớp+ngày); tab Chấm ET (buổi học) tự load câu qua getETByBuoi.
import { useEffect, useState } from 'react'
import {
  createET, updateET, getTaiLieuFull, setETCaus, suggestCauForDang,
  maET, ET_FORMS, etFormOf, type ETDoc, type CauHinh, type ETForm as ETFormKind,
} from '../../lib/tailieu'
import { listLop, type Lop } from '../../lib/nhansu'
import { listDaiDang, listCauByDang, LOAI_CAU, type CauHoi } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import { KhoPicker } from './TaiLieuBuilder'
import ETPrintView from './ETPrintView'
import SearchSelect from '../../components/SearchSelect'
import DangPickerOne from '../../components/DangPickerOne'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const DEFAULT_ROWS = 5
export type ETView = ETDoc & { ten_lop: string }
type Row = { maDang: string | null; maCau: string | null }
const blankRows = () => Array.from({ length: DEFAULT_ROWS }, () => ({ maDang: null, maCau: null } as Row))

// Leaf "ET" = form tạo mới (reset sau khi lưu).
export default function ETScreen() {
  return <ETEditor />
}

// et === undefined → tạo mới (lưu xong reset form). et !== undefined → sửa (lưu xong gọi onClose).
export function ETEditor({ et, onClose }: { et?: ETView; onClose?: () => void }) {
  const editing = !!et
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(et?.lop_id ?? null)
  const [ngay, setNgay] = useState<string>(et?.ngay ?? '')
  const [rows, setRows] = useState<Row[]>(blankRows())
  const [cau, setCau] = useState<Record<string, CauHoi>>({}) // cache để preview
  const [dangOpts, setDangOpts] = useState<{ ma_dang: string; ten_dang: string; ten_chuyen_de: string }[]>([])
  const [ch, setCh] = useState<CauHinh>({})
  const [picker, setPicker] = useState<{ idx: number; maDang: string } | null>(null)
  const [dangModal, setDangModal] = useState<number | null>(null)
  const [printing, setPrinting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const lop = lops.find((l) => l.id === lopId)
  const khoi = lop?.khoi ?? et?.khoi ?? ''
  const tenDang = (md: string | null) => dangOpts.find((d) => d.ma_dang === md)?.ten_dang ?? md ?? ''

  async function loadBase() {
    setLoading(true)
    try {
      setLops(await listLop())
      if (et) {
        const full = await getTaiLieuFull(et.id)
        const caus = full.phans.find((p) => p.loai_phan === 'custom')?.caus ?? []
        setCau(Object.fromEntries(caus.map((c) => [c.ma_cau, c])))
        setCh(full.taiLieu.cau_hinh ?? {})
        const r: Row[] = caus.map((c) => ({ maDang: c.dang_chinh, maCau: c.ma_cau }))
        while (r.length < DEFAULT_ROWS) r.push({ maDang: null, maCau: null })
        setRows(r)
      }
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { loadBase() }, []) // eslint-disable-line
  // dạng theo khối (đổi khi chọn lớp khác khối)
  useEffect(() => {
    if (!khoi) { setDangOpts([]); return }
    listDaiDang(khoi).then((ds) => setDangOpts(ds.map((d) => ({ ma_dang: d.ma_dang, ten_dang: d.ten_dang, ten_chuyen_de: d.ten_chuyen_de })))).catch(() => { /* */ })
  }, [khoi])
  useEffect(() => { if (!flash) return; const t = setTimeout(() => setFlash(null), 2500); return () => clearTimeout(t) }, [flash])

  const usedExcept = (idx: number) => new Set(rows.filter((_, i) => i !== idx).map((r) => r.maCau).filter(Boolean) as string[])
  async function ensureCache(maDang: string) {
    if (Object.values(cau).some((c) => c.dang_chinh === maDang)) return
    const list = await listCauByDang(maDang)
    setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) }))
  }
  async function pickDang(idx: number, maDang: string) {
    await ensureCache(maDang)
    const sug = await suggestCauForDang(maDang, usedExcept(idx))
    if (sug && !cau[sug]) { const list = await listCauByDang(maDang); setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) })) }
    setRows((rs) => rs.map((r, i) => (i === idx ? { maDang, maCau: sug } : r)))
  }
  async function doiCau(idx: number) {
    const r = rows[idx]; if (!r.maDang) return
    const sug = await suggestCauForDang(r.maDang, new Set([...usedExcept(idx), r.maCau].filter(Boolean) as string[]))
    if (!sug) { alert('Hết câu khác cho dạng này (đã dùng hết trong đề).'); return }
    setRows((rs) => rs.map((x, i) => (i === idx ? { ...x, maCau: sug } : x)))
  }
  const themCau = () => setRows((rs) => [...rs, { maDang: null, maCau: null }])
  const xoaRow = (idx: number) => setRows((rs) => rs.filter((_, i) => i !== idx))
  const setLines = (maCau: string, n: number) => setCh((c) => ({ ...c, btvnLinesByCau: { ...(c.btvnLinesByCau ?? {}), [maCau]: n } }))
  const setForm = (maCau: string, f: ETFormKind) => setCh((c) => ({ ...c, etFormByCau: { ...(c.etFormByCau ?? {}), [maCau]: f } }))

  function resetForm() { setLopId(null); setNgay(''); setRows(blankRows()); setCau({}); setCh({}) }
  async function luu() {
    if (!lop) { setErr('Chọn lớp.'); return }
    if (!ngay) { setErr('Chọn ngày buổi học.'); return }
    const maCaus = rows.map((r) => r.maCau).filter(Boolean) as string[]
    if (!maCaus.length) { setErr('ET cần ít nhất 1 câu.'); return }
    setBusy(true); setErr(null)
    try {
      const ten = `ET ${lop.ten_lop} · ${ngay.split('-').reverse().join('/')}`
      if (editing) {
        await updateET(et!.id, { ten, lop_id: lop.id, ngay, cau_hinh: ch })
        await setETCaus(et!.id, maCaus)
        onClose?.()
        return
      }
      const created = await createET({ lopId: lop.id, ngay, ten, khoi: lop.khoi ?? '' })
      await setETCaus(created.id, maCaus)
      if (Object.keys(ch).length) await updateET(created.id, { cau_hinh: ch })
      resetForm()
      setFlash('Đã lưu ET vào Kho tài liệu. Form đã reset để tạo ET mới.')
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = rows.filter((r) => r.maCau).length

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        {onClose && <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Kho tài liệu</button>}
        <span className="text-sm font-semibold text-slate-900">{editing ? 'Sửa ET' : 'Tạo ET'}</span>
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">gắn buổi (lớp + ngày)</span>
        <div className="ml-2 flex items-center gap-1.5 text-[12px] text-slate-500">Lớp
          <div className="w-44"><SearchSelect value={lopId} onChange={setLopId} placeholder="chọn lớp…"
            options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500">Ngày
          <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className="h-8 rounded-md border border-slate-300 px-2 text-[13px]" />
        </div>
        {lop && ngay && <span className="font-mono text-[11px] text-violet-500">{maET(lop.ten_lop, ngay)}</span>}
        <span className="ml-auto text-[12px] text-slate-400">{soCau} câu</span>
        {editing && <button onClick={() => setPrinting(true)} disabled={!soCau} className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400 disabled:opacity-40">🖨 Xem / In</button>}
        <button onClick={luu} disabled={busy || !lop || !ngay || !soCau} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : '💾 Lưu ET'}</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[820px]">
          {flash && <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700">✓ {flash}</div>}
          {err && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">{err}</div>}
          <p className="mb-3 text-[12px] text-slate-400">Mỗi câu chọn 1 dạng → hệ gợi ý câu <b>ít dùng nhất</b> (đổi được). Câu không trùng nhau trong đề.{!khoi && <span className="text-amber-600"> Chọn <b>lớp</b> trước để chọn dạng.</span>}</p>
          <div className="space-y-2">
            {rows.map((r, i) => {
              const c = r.maCau ? cau[r.maCau] : null
              const form = c ? etFormOf(c, ch) : null
              const formOpts = ET_FORMS.filter((f) => f.v !== 'trac_nghiem' || !!(c?.lua_chon && c.lua_chon.length))
              return (
                <div key={i} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-2.5">
                  <span className="mt-1.5 w-6 shrink-0 text-center text-[13px] font-bold text-violet-600">{i + 1}</span>
                  <button onClick={() => khoi && setDangModal(i)} disabled={!khoi} className="w-56 shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-left text-[13px] hover:border-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300">
                    {r.maDang ? <span className="text-slate-700">{tenDang(r.maDang)}</span> : <span className={khoi ? 'text-indigo-500' : ''}>{khoi ? '+ chọn dạng…' : 'chọn lớp trước'}</span>}
                  </button>
                  <div className="min-w-0 flex-1 pt-1">
                    {c ? <div className="truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></div>
                      : r.maDang ? <span className="text-[12px] italic text-slate-400">chưa có câu</span>
                      : <span className="text-[12px] italic text-slate-300">chọn dạng để hệ gợi ý câu</span>}
                    {c && (
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-300">kho: {loaiLabel(c.loai_cau)} · in dạng:</span>
                        <div className="flex gap-0.5">
                          {formOpts.map((f) => (
                            <button key={f.v} onClick={() => setForm(c.ma_cau, f.v)} title="Form hiển thị trong đề (khác loại kho)"
                              className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${form === f.v ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{f.lbl}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {c && form === 'tu_luan' && (
                    <label className="flex shrink-0 items-center gap-1 pt-1.5 text-[11px] text-slate-400" title="Số dòng kẻ cho HS viết (bản in)">dòng
                      <input type="number" min={0} max={30} value={ch.btvnLinesByCau?.[c.ma_cau] ?? 4} onChange={(e) => setLines(c.ma_cau, Math.max(0, Math.min(30, +e.target.value || 0)))} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
                    </label>
                  )}
                  {r.maDang && (
                    <div className="flex shrink-0 gap-1 pt-0.5">
                      <button onClick={() => doiCau(i)} title="Đổi câu khác (ít dùng kế tiếp)" className="rounded-md bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100">↻ Đổi</button>
                      <button onClick={() => setPicker({ idx: i, maDang: r.maDang! })} className="rounded-md border border-slate-300 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">✎ Chọn</button>
                    </div>
                  )}
                  <button onClick={() => xoaRow(i)} title="Xoá hàng" className="shrink-0 px-1 pt-1 text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                </div>
              )
            })}
          </div>
          <button onClick={themCau} className="mt-3 w-full rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 py-2.5 text-[14px] font-medium text-violet-700 transition hover:bg-violet-50">+ Thêm câu</button>
        </div>
      </div>

      {printing && et && <ETPrintView id={et.id} onClose={() => setPrinting(false)} />}
      {dangModal !== null && <DangPickerOne khoi={khoi} onClose={() => setDangModal(null)}
        onPick={(ma) => { const i = dangModal; setDangModal(null); pickDang(i, ma) }} />}
      {picker && <KhoPicker maDangs={[picker.maDang]} selected={rows[picker.idx].maCau ? [rows[picker.idx].maCau!] : []} onClose={() => setPicker(null)}
        onConfirm={async (m) => {
          const used = usedExcept(picker.idx)
          const pick = m.find((x) => !used.has(x)) ?? m[0] ?? null
          if (pick) await ensureCache(picker.maDang)
          setRows((rs) => rs.map((x, i) => (i === picker.idx ? { ...x, maCau: pick } : x)))
          setPicker(null)
        }} />}
    </div>
  )
}
