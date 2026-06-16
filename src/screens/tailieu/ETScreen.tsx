// Màn "Tạo ET" — chức năng con của Làm tài liệu. ET = bộ N câu (mặc định 5), mỗi câu 1 hàng:
// chọn DẠNG → hệ gợi ý 1 câu (ít-dùng-nhất, không trùng trong đề) → đổi được → "+ thêm câu".
// Gắn buổi qua (lớp+ngày); tab Chấm ET (buổi học) load sau qua getETByBuoi.
import { useEffect, useState } from 'react'
import {
  listET, createET, deleteTaiLieu, getTaiLieuFull, updateTaiLieu, setETCaus, suggestCauForDang,
  duplicateTaiLieu, maET, ET_FORMS, etFormOf, type ETDoc, type CauHinh, type ETForm,
} from '../../lib/tailieu'
import { listLop, type Lop } from '../../lib/nhansu'
import { listDaiDang, listCauByDang, listDaiMap, groupMap, LOAI_CAU, type CauHoi, type Tier1Node } from '../../lib/kho/api'
import { MathText, inp, Shell, Field } from '../kho/ui'
import { KhoPicker } from './TaiLieuBuilder'
import ETPrintView from './ETPrintView'
import SearchSelect from '../../components/SearchSelect'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const fmtNgay = (iso?: string | null) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—')
const DEFAULT_ROWS = 5
type ETView = ETDoc & { ten_lop: string }
type Row = { maDang: string | null; maCau: string | null }

export default function ETScreen() {
  const [list, setList] = useState<ETDoc[]>([])
  const [lops, setLops] = useState<Lop[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState<{ templateId?: string } | null>(null)
  const [openEt, setOpenEt] = useState<ETView | null>(null)
  const lopTen = (id: string | null) => lops.find((l) => l.id === id)?.ten_lop ?? '?'

  async function reload() {
    setLoading(true)
    try { const [e, l] = await Promise.all([listET(), listLop()]); setList(e); setLops(l) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line

  if (openEt) return <ETBuilder et={openEt} onClose={() => { setOpenEt(null); reload() }} />

  const mau = list.filter((t) => !t.lop_id)          // MẪU trong kho (không gắn buổi) — tái sử dụng
  const buoiList = list.filter((t) => t.lop_id)       // ET đã gắn buổi
  const open = (t: ETDoc) => setOpenEt({ ...t, ten_lop: lopTen(t.lop_id) })
  const xoa = async (t: ETDoc) => { if (confirm('Xoá ET này?')) { await deleteTaiLieu(t.id); reload() } }

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[12px] font-medium text-violet-600">ET · gắn buổi (lớp + ngày)</span>
        <button onClick={() => setCreating({})} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo ET</button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : list.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có ET nào. Bấm <b className="text-slate-600">+ Tạo ET</b> — chọn lớp + ngày của buổi cần ra đề.</div>
          : (
            <>
              {mau.length > 0 && (
                <section className="mb-6">
                  <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-400">📦 Kho mẫu (tái sử dụng)</div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                    {mau.map((t) => (
                      <div key={t.id} className="flex flex-col rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                        <div className="text-[15px] font-semibold text-slate-900">{t.ten}</div>
                        <div className="mt-0.5 text-[12px] text-slate-400">Mẫu · khối {t.khoi}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => setCreating({ templateId: t.id })} className="rounded-md bg-violet-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-violet-500">Dùng cho buổi</button>
                          <button onClick={() => open(t)} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600 hover:border-indigo-300">Sửa mẫu</button>
                          <button onClick={() => xoa(t)} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section>
                {mau.length > 0 && <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-400">ET theo buổi</div>}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                  {buoiList.map((t) => (
                    <div key={t.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
                      <div className="text-[15px] font-semibold text-slate-900">{t.ten}</div>
                      <div className="mt-1 font-mono text-[11px] text-violet-500">{t.lop_id && t.ngay ? maET(lopTen(t.lop_id), t.ngay) : '(chưa gắn buổi)'}</div>
                      <div className="mt-0.5 text-[12px] text-slate-400">Lớp {lopTen(t.lop_id)} · buổi {fmtNgay(t.ngay)} · khối {t.khoi}</div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => open(t)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500">Mở / Soạn</button>
                        <button onClick={() => xoa(t)} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
      </div>
      {creating && <CreateETModal lops={lops} templateId={creating.templateId} onClose={() => setCreating(null)} onCreated={(v) => { setCreating(null); reload(); setOpenEt(v) }} />}
    </div>
  )
}

function CreateETModal({ lops, templateId, onClose, onCreated }: { lops: Lop[]; templateId?: string; onClose: () => void; onCreated: (v: ETView) => void }) {
  const [lopId, setLopId] = useState<string | null>(null)
  const [ngay, setNgay] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const lop = lops.find((l) => l.id === lopId)

  async function create() {
    if (!lop || !ngay) return
    setBusy(true); setErr(null)
    try {
      const ten = `ET ${lop.ten_lop} · ${ngay.split('-').reverse().join('/')}`
      // từ MẪU → nhân bản (giữ câu/form); không thì tạo rỗng.
      const et = templateId
        ? await duplicateTaiLieu(templateId, { ten, lop_id: lop.id, ngay })
        : await createET({ lopId: lop.id, ngay, ten, khoi: lop.khoi ?? '' })
      onCreated({ ...(et as ETDoc), ten_lop: lop.ten_lop })
    } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <Shell title={templateId ? 'Dùng mẫu cho 1 buổi' : 'Tạo ET cho 1 buổi'} onClose={onClose}>
      <Field label="Lớp">
        <SearchSelect value={lopId} onChange={setLopId} placeholder="chọn lớp…"
          options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} />
      </Field>
      <Field label="Ngày buổi học"><input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className={inp} /></Field>
      {lop && ngay && <div className="mb-2 font-mono text-[12px] text-violet-600">Mã: {maET(lop.ten_lop, ngay)}</div>}
      <div className="mb-3 text-[11px] text-slate-400">ET nối buổi qua <b>lớp + ngày</b>. Khi OPS mở buổi đúng lớp+ngày → tab Chấm ET tự load câu.</div>
      {err && <p className="mb-2 text-xs text-rose-600">{err}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={create} disabled={!lop || !ngay || busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
      </div>
    </Shell>
  )
}

// ── ETBuilder câu-centric: N hàng (default 5), mỗi hàng chọn dạng → gợi ý 1 câu ít-dùng → đổi được ──
function ETBuilder({ et, onClose }: { et: ETView; onClose: () => void }) {
  const [rows, setRows] = useState<Row[]>([])
  const [cau, setCau] = useState<Record<string, CauHoi>>({}) // cache để preview
  const [dangOpts, setDangOpts] = useState<{ ma_dang: string; ten_dang: string; ten_chuyen_de: string }[]>([])
  const [picker, setPicker] = useState<{ idx: number; maDang: string } | null>(null)
  const [dangModal, setDangModal] = useState<number | null>(null) // hàng đang chọn dạng (popup to)
  const [ch, setCh] = useState<CauHinh>({})
  const [printing, setPrinting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const tenDang = (md: string | null) => dangOpts.find((d) => d.ma_dang === md)?.ten_dang ?? md ?? ''

  async function load() {
    setLoading(true)
    try {
      const [ds, full] = await Promise.all([listDaiDang(et.khoi ?? ''), getTaiLieuFull(et.id)])
      const caus = full.phans.find((p) => p.loai_phan === 'custom')?.caus ?? []
      setDangOpts(ds.map((d) => ({ ma_dang: d.ma_dang, ten_dang: d.ten_dang, ten_chuyen_de: d.ten_chuyen_de })))
      setCau(Object.fromEntries(caus.map((c) => [c.ma_cau, c])))
      setCh(full.taiLieu.cau_hinh ?? {})
      const r: Row[] = caus.map((c) => ({ maDang: c.dang_chinh, maCau: c.ma_cau }))
      while (r.length < DEFAULT_ROWS) r.push({ maDang: null, maCau: null })
      setRows(r)
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  async function setLines(maCau: string, n: number) {
    const next = { ...ch, btvnLinesByCau: { ...(ch.btvnLinesByCau ?? {}), [maCau]: n } }
    setCh(next); await updateTaiLieu(et.id, { cau_hinh: next })
  }
  async function setForm(maCau: string, f: ETForm) {
    const next = { ...ch, etFormByCau: { ...(ch.etFormByCau ?? {}), [maCau]: f } }
    setCh(next); await updateTaiLieu(et.id, { cau_hinh: next })
  }
  useEffect(() => { load() }, [et.id]) // eslint-disable-line

  const usedExcept = (idx: number) => new Set(rows.filter((_, i) => i !== idx).map((r) => r.maCau).filter(Boolean) as string[])
  async function ensureCache(maDang: string) {
    if (Object.values(cau).some((c) => c.dang_chinh === maDang)) return
    const list = await listCauByDang(maDang)
    setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) }))
  }
  function persist(next: Row[]) { setRows(next); setETCaus(et.id, next.map((r) => r.maCau).filter(Boolean) as string[]).catch((e) => alert(e.message ?? String(e))) }

  async function pickDang(idx: number, maDang: string) {
    await ensureCache(maDang)
    const sug = await suggestCauForDang(maDang, usedExcept(idx))
    if (sug && !cau[sug]) { const list = await listCauByDang(maDang); setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) })) }
    persist(rows.map((r, i) => (i === idx ? { maDang, maCau: sug } : r)))
  }
  async function doiCau(idx: number) {
    const r = rows[idx]; if (!r.maDang) return
    const sug = await suggestCauForDang(r.maDang, new Set([...usedExcept(idx), r.maCau].filter(Boolean) as string[]))
    if (!sug) { alert('Hết câu khác cho dạng này (đã dùng hết trong đề).'); return }
    persist(rows.map((x, i) => (i === idx ? { ...x, maCau: sug } : x)))
  }
  const themCau = () => setRows([...rows, { maDang: null, maCau: null }])
  const xoaRow = (idx: number) => persist(rows.filter((_, i) => i !== idx))
  async function luuMau() {
    const ten = prompt('Tên mẫu lưu vào kho:', `Mẫu: ${et.ten}`)?.trim()
    if (!ten) return
    try { await duplicateTaiLieu(et.id, { ten, lop_id: null, ngay: null }); alert('Đã lưu vào KHO MẪU. Vào danh sách ET → mục “Kho mẫu” → “Dùng cho buổi” để tái sử dụng.') }
    catch (e: any) { alert(e.message ?? String(e)) }
  }

  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>
  if (loading) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = rows.filter((r) => r.maCau).length

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        <button onClick={onClose} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Danh sách ET</button>
        <span className="text-sm font-semibold text-slate-900">{et.ten}</span>
        <span className="font-mono text-[11px] text-violet-500">{et.lop_id && et.ngay ? maET(et.ten_lop, et.ngay) : ''}</span>
        <span className="ml-auto text-[12px] text-slate-400">{soCau} câu</span>
        <button onClick={luuMau} disabled={!soCau} className="rounded-md border border-violet-300 px-3 py-1.5 text-[13px] font-medium text-violet-700 hover:bg-violet-50 disabled:opacity-40" title="Lưu thành mẫu trong kho để tái sử dụng">💾 Lưu vào kho</button>
        <button onClick={() => setPrinting(true)} disabled={!soCau} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 Xem / In</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[820px]">
          <p className="mb-3 text-[12px] text-slate-400">Mỗi câu chọn 1 dạng → hệ gợi ý câu <b>ít dùng nhất</b> (đổi được). Câu không trùng nhau trong đề.</p>
          <div className="space-y-2">
            {rows.map((r, i) => {
              const c = r.maCau ? cau[r.maCau] : null
              const form = c ? etFormOf(c, ch) : null
              const formOpts = ET_FORMS.filter((f) => f.v !== 'trac_nghiem' || !!(c?.lua_chon && c.lua_chon.length))
              return (
                <div key={i} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-2.5">
                  <span className="mt-1.5 w-6 shrink-0 text-center text-[13px] font-bold text-violet-600">{i + 1}</span>
                  <button onClick={() => setDangModal(i)} className="w-56 shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-left text-[13px] hover:border-indigo-400">
                    {r.maDang ? <span className="text-slate-700">{tenDang(r.maDang)}</span> : <span className="text-indigo-500">+ chọn dạng…</span>}
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

      {printing && <ETPrintView id={et.id} onClose={() => setPrinting(false)} />}
      {dangModal !== null && <DangPickerOne khoi={et.khoi ?? ''} onClose={() => setDangModal(null)}
        onPick={(ma) => { const i = dangModal; setDangModal(null); pickDang(i, ma) }} />}
      {picker && <KhoPicker maDangs={[picker.maDang]} selected={rows[picker.idx].maCau ? [rows[picker.idx].maCau!] : []} onClose={() => setPicker(null)}
        onConfirm={async (m) => {
          const used = usedExcept(picker.idx)
          const pick = m.find((x) => !used.has(x)) ?? m[0] ?? null
          if (pick) await ensureCache(picker.maDang)
          persist(rows.map((x, i) => (i === picker.idx ? { ...x, maCau: pick } : x)))
          setPicker(null)
        }} />}
    </div>
  )
}

// Popup TO chọn 1 dạng (browse chuyên đề → dạng, click 1 phát chọn + đóng). Tận dụng cả màn.
function DangPickerOne({ khoi, onClose, onPick }: { khoi: string; onClose: () => void; onPick: (maDang: string) => void }) {
  const [tree, setTree] = useState<Tier1Node[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  useEffect(() => { listDaiMap(khoi).then((r) => { setTree(groupMap(r)); setLoading(false) }).catch(() => setLoading(false)) }, [khoi])
  const kw = q.trim().toLowerCase()
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn dạng · Khối {khoi}</h3>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm dạng / chuyên đề…" className="ml-2 h-8 w-64 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" autoFocus />
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
            : tree.length === 0 ? <p className="text-sm text-slate-400">Khối này chưa có dạng.</p>
            : tree.map((t1) => (
              <div key={t1.t1Ma} className="mb-4">
                <div className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-500">{t1.t1Ten}</div>
                {t1.tier2s.map((t2) => {
                  const leaves = t2.leaves.filter((l) => !kw || l.leafTen.toLowerCase().includes(kw) || t2.t2Ten.toLowerCase().includes(kw))
                  if (!leaves.length) return null
                  return (
                    <div key={t2.t2Ma} className="mb-3 rounded-lg border border-slate-100 p-2.5">
                      <div className="mb-1.5 text-[13px] font-semibold text-sky-700">{t2.t2Ten}</div>
                      <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-3">
                        {leaves.map((l) => (
                          <button key={l.leafMa} onClick={() => onPick(l.leafMa)}
                            className="rounded-md border border-slate-200 px-3 py-2 text-left text-[13px] text-slate-700 transition hover:border-violet-400 hover:bg-violet-50">{l.leafTen}</button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
