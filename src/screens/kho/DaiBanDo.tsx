import { useEffect, useMemo, useState } from 'react'
import {
  listDaiDang, listLopBac, countCauByDang, groupDai,
  createDaiDang, updateDaiDang, deleteDaiDang,
  suggestChuDeMa, suggestChuyenDeMa, suggestDangMa,
  type DaiDang, type LopBac, type ChuDeNode,
} from '../../lib/kho/api'

const MUC_DO = [1, 2, 3, 4, 5]

function BacChip({ bac }: { bac: string }) {
  const tone: Record<string, string> = {
    S: 'bg-violet-50 text-violet-700 ring-violet-200',
    A: 'bg-sky-50 text-sky-700 ring-sky-200',
    B: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    C: 'bg-slate-50 text-slate-600 ring-slate-200',
  }
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${tone[bac] ?? tone.C}`} title={`Từ lớp ${bac} trở lên học`}>
      ≥{bac}
    </span>
  )
}
const Code = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">{children}</span>
)

export default function DaiBanDo({ khoi }: { khoi: string }) {
  const [rows, setRows] = useState<DaiDang[]>([])
  const [lopBac, setLopBac] = useState<LopBac[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [selChuDe, setSelChuDe] = useState<string | null>(null)
  const [selChuyenDe, setSelChuyenDe] = useState<string | null>(null)
  const [modal, setModal] = useState<null | { editing: DaiDang | null; prefill?: Partial<DaiDang> }>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [r, c] = await Promise.all([listDaiDang(khoi), countCauByDang()])
      setRows(r); setCounts(c)
    } catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { listLopBac().then(setLopBac).catch((e) => setErr(e.message)) }, [])
  useEffect(() => { setSelChuDe(null); setSelChuyenDe(null); reload() }, [khoi])

  const tree = useMemo(() => groupDai(rows), [rows])
  const chuDe = tree.find((c) => c.ma_chu_de === selChuDe) ?? null
  const chuyenDe = chuDe?.chuyenDes.find((x) => x.ma_chuyen_de === selChuyenDe) ?? null

  async function onDelete(d: DaiDang) {
    if (!confirm(`Xoá dạng "${d.ten_dang}" (${d.ma_dang})?`)) return
    try { await deleteDaiDang(d.ma_dang); await reload() }
    catch (e: any) { alert('Không xoá được: ' + (e.message ?? e) + '\n(Có thể còn câu hỏi treo vào dạng.)') }
  }

  if (loading && !rows.length) return <div className="p-8 text-sm text-slate-400">Đang tải bản đồ khối {khoi}…</div>
  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>

  return (
    <div className="grid h-full grid-cols-[268px_1fr] bg-[#fafafb]">
      {/* CỘT TRÁI — Chủ đề */}
      <aside className="flex flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Chủ đề · K{khoi}</span>
          <span className="rounded-full bg-slate-100 px-1.5 text-[11px] text-slate-500">{tree.length}</span>
        </div>
        <div className="flex-1 overflow-auto px-2">
          {tree.length === 0 && <p className="px-2 py-6 text-center text-xs text-slate-400">Chưa có chủ đề.</p>}
          <ul className="space-y-0.5">
            {tree.map((c) => {
              const active = selChuDe === c.ma_chu_de
              return (
                <li key={c.ma_chu_de}>
                  <button
                    onClick={() => { setSelChuDe(c.ma_chu_de); setSelChuyenDe(null) }}
                    className={`group flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition ${
                      active ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50'
                    }`}>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-slate-400'}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800">{c.ten_chu_de}</span>
                      <span className="block text-[11px] text-slate-400">{c.ma_chu_de} · {c.chuyenDes.length} chuyên đề · {c.soDang} dạng</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="border-t border-slate-200 p-2">
          <button onClick={() => setModal({ editing: null })}
            className="w-full rounded-md border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">
            + Thêm dạng
          </button>
        </div>
      </aside>

      {/* KHU PHẢI */}
      <section className="overflow-auto p-7">
        {!chuDe && (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            {tree.length ? 'Chọn một chủ đề bên trái.' : 'Bản đồ khối này còn trống — bấm “Thêm dạng” để bắt đầu.'}
          </div>
        )}

        {/* Chọn chủ đề → danh sách chuyên đề (card) */}
        {chuDe && !chuyenDe && (
          <>
            <div className="mb-5 flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">{chuDe.ten_chu_de}</h2>
              <Code>{chuDe.ma_chu_de}</Code>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
              {chuDe.chuyenDes.map((cde) => (
                <button key={cde.ma_chuyen_de} onClick={() => setSelChuyenDe(cde.ma_chuyen_de)}
                  className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-[0_2px_12px_rgba(79,70,229,0.08)]">
                  <div className="text-sm font-medium text-slate-800">{cde.ten_chuyen_de}</div>
                  <div className="mt-1.5"><Code>{cde.ma_chuyen_de}</Code></div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{cde.dangs.length} dạng</span>
                    <span className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500">→</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Zoom 1 chuyên đề → danh sách Dạng */}
        {chuDe && chuyenDe && (
          <>
            <button onClick={() => setSelChuyenDe(null)} className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-600">
              ← {chuDe.ten_chu_de}
            </button>
            <div className="mb-5 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">{chuyenDe.ten_chuyen_de}</h2>
                <Code>{chuyenDe.ma_chuyen_de}</Code>
                <span className="text-xs text-slate-400">· {chuyenDe.dangs.length} dạng</span>
              </div>
              <button
                onClick={() => setModal({ editing: null, prefill: {
                  ma_chu_de: chuDe.ma_chu_de, ten_chu_de: chuDe.ten_chu_de,
                  ma_chuyen_de: chuyenDe.ma_chuyen_de, ten_chuyen_de: chuyenDe.ten_chuyen_de,
                } })}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-500">
                + Thêm dạng
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-left text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-2.5 font-semibold">Mã</th>
                    <th className="px-4 py-2.5 font-semibold">Tên dạng</th>
                    <th className="px-4 py-2.5 font-semibold">Độ khó</th>
                    <th className="px-4 py-2.5 font-semibold">Bậc lớp</th>
                    <th className="px-4 py-2.5 font-semibold">#câu</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {chuyenDe.dangs.map((d) => (
                    <tr key={d.ma_dang} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                      <td className="px-4 py-2.5"><Code>{d.ma_dang}</Code></td>
                      <td className="px-4 py-2.5 text-slate-800">{d.ten_dang}</td>
                      <td className="px-4 py-2.5"><span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">độ {d.muc_do}</span></td>
                      <td className="px-4 py-2.5"><BacChip bac={d.bac_toi_thieu} /></td>
                      <td className="px-4 py-2.5 text-slate-500">{counts[d.ma_dang] ?? 0}</td>
                      <td className="px-4 py-2.5 text-right whitespace-nowrap">
                        <button onClick={() => setModal({ editing: d })} className="mr-3 text-xs font-medium text-slate-400 hover:text-indigo-600">Sửa</button>
                        <button onClick={() => onDelete(d)} className="text-xs font-medium text-slate-400 hover:text-rose-600">Xoá</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {modal && (
        <ThemSuaDang
          khoi={khoi} tree={tree} lopBac={lopBac}
          editing={modal.editing} prefill={modal.prefill}
          onClose={() => setModal(null)}
          onSaved={async () => { setModal(null); await reload() }}
        />
      )}
    </div>
  )
}

// ── Modal thêm/sửa Dạng ────────────────────────────────────────────
function ThemSuaDang({
  khoi, tree, lopBac, editing, prefill, onClose, onSaved,
}: {
  khoi: string; tree: ChuDeNode[]; lopBac: LopBac[]
  editing: DaiDang | null; prefill?: Partial<DaiDang>
  onClose: () => void; onSaved: () => void
}) {
  if (editing) return <SuaDang editing={editing} lopBac={lopBac} onClose={onClose} onSaved={onSaved} />
  return <ThemDang khoi={khoi} tree={tree} lopBac={lopBac} prefill={prefill} onClose={onClose} onSaved={onSaved} />
}

function ThemDang({
  khoi, tree, lopBac, prefill, onClose, onSaved,
}: {
  khoi: string; tree: ChuDeNode[]; lopBac: LopBac[]
  prefill?: Partial<DaiDang>; onClose: () => void; onSaved: () => void
}) {
  const hasTree = tree.length > 0
  const [cdMode, setCdMode] = useState<'pick' | 'new'>(prefill?.ma_chu_de ? 'pick' : hasTree ? 'pick' : 'new')
  const [maChuDe, setMaChuDe] = useState(prefill?.ma_chu_de ?? '')
  const [tenChuDeNew, setTenChuDeNew] = useState('')
  const [cdeMode, setCdeMode] = useState<'pick' | 'new'>(prefill?.ma_chuyen_de ? 'pick' : 'new')
  const [maChuyenDe, setMaChuyenDe] = useState(prefill?.ma_chuyen_de ?? '')
  const [tenChuyenDeNew, setTenChuyenDeNew] = useState('')
  const [tenDang, setTenDang] = useState('')
  const [mucDo, setMucDo] = useState(3)
  const [bac, setBac] = useState('C')
  const [maDang, setMaDang] = useState('')
  const [maTouched, setMaTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickedChuDe = cdMode === 'pick' ? tree.find((c) => c.ma_chu_de === maChuDe) ?? null : null
  const cdCode = cdMode === 'pick' ? maChuDe : suggestChuDeMa(khoi, tree)
  const tenChuDe = cdMode === 'pick' ? pickedChuDe?.ten_chu_de ?? '' : tenChuDeNew
  const pickedChuyenDe = cdeMode === 'pick' ? pickedChuDe?.chuyenDes.find((x) => x.ma_chuyen_de === maChuyenDe) ?? null : null
  const cdeCode = cdeMode === 'pick' ? maChuyenDe : suggestChuyenDeMa(cdCode, pickedChuDe)
  const tenChuyenDe = cdeMode === 'pick' ? pickedChuyenDe?.ten_chuyen_de ?? '' : tenChuyenDeNew
  const suggestedMa = suggestDangMa(cdeCode, pickedChuyenDe)

  // Cập nhật gợi ý mã khi đổi cha (trừ khi người dùng đã sửa tay)
  useEffect(() => { if (!maTouched) setMaDang(suggestedMa) }, [suggestedMa, maTouched])
  // Nếu chọn chủ đề mới → chuyên đề buộc mới
  useEffect(() => { if (cdMode === 'new' && cdeMode === 'pick') setCdeMode('new') }, [cdMode]) // eslint-disable-line

  const valid = tenChuDe.trim() && tenChuyenDe.trim() && tenDang.trim() && maDang.trim() && bac

  async function save() {
    if (!valid) return
    setSaving(true); setError(null)
    try {
      await createDaiDang({
        ma_dang: maDang.trim(), khoi,
        ma_chu_de: cdCode, ten_chu_de: tenChuDe.trim(),
        ma_chuyen_de: cdeCode, ten_chuyen_de: tenChuyenDe.trim(),
        ten_dang: tenDang.trim(), muc_do: mucDo, bac_toi_thieu: bac,
      })
      onSaved()
    } catch (e: any) {
      const msg = String(e.message ?? e)
      setError(/duplicate|unique/i.test(msg) ? `Mã "${maDang}" đã tồn tại — sửa lại mã.` : msg)
      setSaving(false)
    }
  }

  return (
    <Shell title={`Thêm dạng · Khối ${khoi}`} onClose={onClose}>
      <Field label="Chủ đề">
        {cdMode === 'pick' && hasTree ? (
          <Row>
            <select value={maChuDe} onChange={(e) => { setMaChuDe(e.target.value); setMaChuyenDe(''); setCdeMode('new') }} className={inp}>
              <option value="">— chọn —</option>
              {tree.map((c) => <option key={c.ma_chu_de} value={c.ma_chu_de}>{c.ma_chu_de} · {c.ten_chu_de}</option>)}
            </select>
            <Ghost onClick={() => { setCdMode('new'); setMaChuDe('') }}>+ mới</Ghost>
          </Row>
        ) : (
          <Row>
            <input value={tenChuDeNew} onChange={(e) => setTenChuDeNew(e.target.value)} placeholder="Tên chủ đề mới" className={inp} autoFocus />
            <span className="shrink-0 rounded bg-slate-100 px-2 py-1.5 font-mono text-[11px] text-slate-400">{cdCode}</span>
            {hasTree && <Ghost onClick={() => setCdMode('pick')}>có sẵn</Ghost>}
          </Row>
        )}
      </Field>

      <Field label="Chuyên đề">
        {cdeMode === 'pick' && pickedChuDe?.chuyenDes.length ? (
          <Row>
            <select value={maChuyenDe} onChange={(e) => setMaChuyenDe(e.target.value)} className={inp}>
              <option value="">— chọn —</option>
              {pickedChuDe.chuyenDes.map((x) => <option key={x.ma_chuyen_de} value={x.ma_chuyen_de}>{x.ma_chuyen_de} · {x.ten_chuyen_de}</option>)}
            </select>
            <Ghost onClick={() => { setCdeMode('new'); setMaChuyenDe('') }}>+ mới</Ghost>
          </Row>
        ) : (
          <Row>
            <input value={tenChuyenDeNew} onChange={(e) => setTenChuyenDeNew(e.target.value)} placeholder="Tên chuyên đề mới" className={inp} disabled={!tenChuDe.trim()} />
            <span className="shrink-0 rounded bg-slate-100 px-2 py-1.5 font-mono text-[11px] text-slate-400">{cdeCode}</span>
            {pickedChuDe?.chuyenDes.length ? <Ghost onClick={() => setCdeMode('pick')}>có sẵn</Ghost> : null}
          </Row>
        )}
      </Field>

      <Field label="Tên dạng">
        <input value={tenDang} onChange={(e) => setTenDang(e.target.value)} placeholder="vd Tìm UCLN bằng phân tích thừa số" className={inp} />
      </Field>

      <Field label="Mã dạng (gợi ý — sửa được)">
        <input value={maDang} onChange={(e) => { setMaDang(e.target.value); setMaTouched(true) }} className={`${inp} font-mono`} />
      </Field>
      <div className="grid grid-cols-2 gap-5">
        <Field label="Độ khó">
          <Seg options={MUC_DO} value={mucDo} onChange={setMucDo} />
        </Field>
        <Field label="Bậc lớp (≥)">
          <Seg options={lopBac.map((b) => b.ma)} value={bac} onChange={setBac} render={(o) => `≥${o}`} />
        </Field>
      </div>
      <p className="mt-1 text-[11px] text-slate-400">Mã gợi ý theo vị trí (khối·chủ đề·chuyên đề·dạng), sửa tay được. Bậc lớp = lớp thấp nhất còn học (S&gt;A&gt;B&gt;C), độc lập độ khó.</p>

      {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={save} disabled={!valid || saving} saving={saving} label="Thêm" />
    </Shell>
  )
}

function SuaDang({ editing, lopBac, onClose, onSaved }: { editing: DaiDang; lopBac: LopBac[]; onClose: () => void; onSaved: () => void }) {
  const [tenDang, setTenDang] = useState(editing.ten_dang)
  const [mucDo, setMucDo] = useState(editing.muc_do)
  const [bac, setBac] = useState(editing.bac_toi_thieu)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    if (!tenDang.trim()) return
    setSaving(true); setError(null)
    try { await updateDaiDang(editing.ma_dang, { ten_dang: tenDang.trim(), muc_do: mucDo, bac_toi_thieu: bac }); onSaved() }
    catch (e: any) { setError(e.message ?? String(e)); setSaving(false) }
  }

  return (
    <Shell title={`Sửa dạng · ${editing.ma_dang}`} onClose={onClose}>
      <div className="mb-3 rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
        {editing.ma_chu_de} · {editing.ten_chu_de} › {editing.ma_chuyen_de} · {editing.ten_chuyen_de}
        <span className="mt-0.5 block text-slate-400">Mã & vị trí khoá khi sửa (đổi mã = gãy câu hỏi đang trỏ vào).</span>
      </div>
      <Field label="Tên dạng">
        <input value={tenDang} onChange={(e) => setTenDang(e.target.value)} className={inp} autoFocus />
      </Field>
      <div className="grid grid-cols-2 gap-5">
        <Field label="Độ khó">
          <Seg options={MUC_DO} value={mucDo} onChange={setMucDo} />
        </Field>
        <Field label="Bậc lớp (≥)">
          <Seg options={lopBac.map((b) => b.ma)} value={bac} onChange={setBac} render={(o) => `≥${o}`} />
        </Field>
      </div>
      {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={save} disabled={!tenDang.trim() || saving} saving={saving} label="Lưu" />
    </Shell>
  )
}

// ── UI primitives (gu SaaS) ────────────────────────────────────────
const inp = 'w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

function Shell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[680px] max-w-[94vw] rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-5 text-base font-semibold text-slate-900">{title}</h3>
        {children}
      </div>
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</span>
      {children}
    </label>
  )
}
const Row = ({ children }: { children: React.ReactNode }) => <div className="flex items-center gap-2">{children}</div>
function Seg<T extends string | number>({ options, value, onChange, render }: {
  options: T[]; value: T; onChange: (v: T) => void; render?: (o: T) => React.ReactNode
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((o) => (
        <button key={String(o)} type="button" onClick={() => onChange(o)}
          className={`h-10 flex-1 rounded-lg border text-sm font-semibold transition ${
            value === o
              ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
              : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/40'
          }`}>{render ? render(o) : o}</button>
      ))}
    </div>
  )
}
function Ghost({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className="shrink-0 rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-500 hover:border-indigo-300 hover:text-indigo-700">{children}</button>
}
function Actions({ onClose, onSave, disabled, saving, label }: { onClose: () => void; onSave: () => void; disabled: boolean; saving: boolean; label: string }) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
      <button onClick={onSave} disabled={disabled} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-40">
        {saving ? 'Đang lưu…' : label}
      </button>
    </div>
  )
}
