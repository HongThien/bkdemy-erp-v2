import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  listLopBac, groupMap, suggestT1Ma, suggestT2Ma, suggestLeafMa,
  type MapRow, type Tier1Node, type Tier2Node, type LopBac, type LyThuyet,
} from '../../lib/kho/api'
import type { BranchConfig } from './branches'
import { BacChip, Code, inp, Shell, Field, Row, Seg, Ghost, Actions, mucDoTone } from './ui'
import DangHub from './DangHub'

const MUC_DO = [1, 2, 3, 4, 5]

export default function BanDo({ config, khoi }: { config: BranchConfig; khoi: string }) {
  const L1 = config.labels.t1, L2 = config.labels.t2, Leaf = config.labels.leaf
  const leafLow = Leaf.toLowerCase(), t2Low = L2.toLowerCase()

  const [rows, setRows] = useState<MapRow[]>([])
  const [lopBac, setLopBac] = useState<LopBac[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [lyThuyet, setLyThuyet] = useState<Record<string, LyThuyet>>({})
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [selT1, setSelT1] = useState<string | null>(null)
  const [selT2, setSelT2] = useState<string | null>(null)
  const [modal, setModal] = useState<null | { editing: MapRow | null; prefill?: Partial<MapRow> }>(null)
  const [ltModal, setLtModal] = useState<null | { d: MapRow }>(null)
  const [hub, setHub] = useState<MapRow | null>(null)
  const [fMuc, setFMuc] = useState<Set<number>>(new Set())
  const [fBac, setFBac] = useState<Set<string>>(new Set())

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [r, c, lt] = await Promise.all([
        config.list(khoi), config.count(),
        config.lyThuyet ? config.lyThuyet.list() : Promise.resolve({} as Record<string, LyThuyet>),
      ])
      setRows(r); setCounts(c); setLyThuyet(lt)
    } catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { listLopBac().then(setLopBac).catch((e) => setErr(e.message)) }, [])
  useEffect(() => { setSelT1(null); setSelT2(null); reload() }, [khoi, config.key]) // eslint-disable-line

  const tree = useMemo(() => groupMap(rows), [rows])
  const t1 = tree.find((x) => x.t1Ma === selT1) ?? null
  const t2 = t1?.tier2s.find((x) => x.t2Ma === selT2) ?? null

  const cauOf = (leafMa: string) => counts[leafMa] ?? 0
  const isDu = (leafMa: string) =>
    (!config.chuan || cauOf(leafMa) >= config.chuan) && (!config.lyThuyet || !!lyThuyet[leafMa])

  async function onDelete(d: MapRow) {
    if (!confirm(`Xoá ${leafLow} "${d.leafTen}" (${d.leafMa})?`)) return
    try { await config.deleteLeaf(d.leafMa); await reload() }
    catch (e: any) { alert(`Không xoá được: ${e.message ?? e}\n(Có thể còn ${config.countLabel} treo vào ${leafLow}.)`) }
  }
  async function onDeleteT2(node: Tier2Node) {
    if (!confirm(`Xoá ${t2Low} "${node.t2Ten}" và TOÀN BỘ ${node.leaves.length} ${leafLow} bên trong?`)) return
    try {
      await config.deleteLeaves(node.leaves.map((l) => l.leafMa))
      if (selT2 === node.t2Ma) setSelT2(null)
      await reload()
    } catch (e: any) { alert(`Không xoá được: ${e.message ?? e}\n(Có thể còn ${config.countLabel} treo vào dạng bên trong.)`) }
  }
  async function onDeleteT1(node: Tier1Node) {
    const all = node.tier2s.flatMap((x) => x.leaves)
    if (!confirm(`Xoá ${L1.toLowerCase()} "${node.t1Ten}" và TOÀN BỘ ${all.length} ${leafLow}?`)) return
    try {
      await config.deleteLeaves(all.map((l) => l.leafMa))
      if (selT1 === node.t1Ma) { setSelT1(null); setSelT2(null) }
      await reload()
    } catch (e: any) { alert(`Không xoá được: ${e.message ?? e}\n(Có thể còn ${config.countLabel} treo vào dạng bên trong.)`) }
  }

  if (loading && !rows.length) return <div className="p-8 text-sm text-slate-400">Đang tải bản đồ khối {khoi}…</div>
  if (err) return <div className="p-8 text-sm text-rose-600">Lỗi: {err}</div>

  const leaves = t2?.leaves ?? []
  const filtered = leaves.filter((d) =>
    (fMuc.size === 0 || (d.mucDo != null && fMuc.has(d.mucDo))) &&
    (fBac.size === 0 || fBac.has(d.bac)))
  const anyFilter = fMuc.size > 0 || fBac.size > 0

  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)] grid-cols-[320px_1fr] overflow-hidden bg-[#fafafb]">
      {/* CỘT TRÁI — tầng 1 */}
      <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-slate-600">{L1} · K{khoi}</span>
          <span className="rounded-full bg-slate-100 px-1.5 text-[11px] text-slate-500">{tree.length}</span>
        </div>
        <div className="flex-1 overflow-auto px-2">
          {tree.length === 0 && <p className="px-2 py-6 text-center text-xs text-slate-400">Chưa có {L1.toLowerCase()}.</p>}
          <ul className="space-y-0.5">
            {tree.map((node) => {
              const active = selT1 === node.t1Ma
              return (
                <li key={node.t1Ma} className="group relative">
                  <button
                    onClick={() => { setSelT1(node.t1Ma); setSelT2(null) }}
                    className={`flex w-full items-start gap-2.5 rounded-md py-2 pl-2.5 pr-8 text-left transition ${
                      active ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50'
                    }`}>
                    <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-slate-400'}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium leading-snug text-slate-800">{node.t1Ten}</span>
                      <span className="block text-xs text-slate-400">{node.t1Ma} · {node.tier2s.length} {t2Low} · {node.soLeaf} {leafLow}</span>
                    </span>
                  </button>
                  <button onClick={() => onDeleteT1(node)} title={`Xoá ${L1.toLowerCase()}`}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md text-[12px] text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100">✕</button>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="border-t border-slate-200 p-2">
          <button onClick={() => setModal({ editing: null })}
            className="w-full rounded-md border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">
            + Thêm {leafLow}
          </button>
        </div>
      </aside>

      {/* KHU PHẢI */}
      <section className="min-h-0 overflow-auto p-7">
        {!t1 && (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            {tree.length ? `Chọn một ${L1.toLowerCase()} bên trái.` : `Bản đồ khối này còn trống — bấm “Thêm ${leafLow}” để bắt đầu.`}
          </div>
        )}

        {/* Chọn tầng 1 → card tầng 2 */}
        {t1 && !t2 && (
          <>
            <div className="mb-5 flex items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{t1.t1Ten}</h2>
              <Code>{t1.t1Ma}</Code>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-5">
              {t1.tier2s.map((node) => {
                const du = node.leaves.filter((l) => isDu(l.leafMa)).length
                return (
                  <div key={node.t2Ma} role="button" onClick={() => setSelT2(node.t2Ma)}
                    className="group relative flex min-h-[210px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-[0_14px_36px_-10px_rgba(79,70,229,0.28)]">
                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 transition group-hover:opacity-100" />
                    <button onClick={(e) => { e.stopPropagation(); onDeleteT2(node) }} title="Xoá chuyên đề"
                      className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-md text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100">✕</button>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-sm shadow-indigo-500/30">
                        {node.t2Ma.slice(4)}
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="text-[17px] font-semibold leading-snug text-slate-800">{node.t2Ten}</div>
                        <div className="mt-1.5"><Code>{node.t2Ma}</Code></div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3.5">
                      {node.leaves.length === 0 && <div className="text-[13px] italic text-slate-300">Chưa có {leafLow} nào</div>}
                      {node.leaves.slice(0, 4).map((d) => (
                        <div key={d.leafMa} className="flex items-center gap-2.5">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
                          <span className="min-w-0 flex-1 truncate text-[14px] text-slate-600">{d.leafTen}</span>
                          <BacChip bac={d.bac} size="sm" />
                        </div>
                      ))}
                      {node.leaves.length > 4 && (
                        <div className="pl-4 text-[13px] text-slate-400">+{node.leaves.length - 4} {leafLow} nữa…</div>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[13px] font-medium text-indigo-600">{node.leaves.length} {leafLow}</span>
                        {config.chuan && node.leaves.length > 0 && (
                          <span className={`rounded-full px-2.5 py-1 text-[13px] font-medium ${du === node.leaves.length ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{du} đủ chuẩn</span>
                        )}
                      </span>
                      <span className="text-[15px] font-medium text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">Mở →</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Zoom tầng 2 → CARD lá + filter */}
        {t1 && t2 && (
          <>
            <button onClick={() => setSelT2(null)} className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-600">
              ← {t1.t1Ten}
            </button>
            <div className="mb-4 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{t2.t2Ten}</h2>
                <Code>{t2.t2Ma}</Code>
                <span className="text-xs text-slate-400">· {leaves.length} {leafLow}</span>
              </div>
              <button
                onClick={() => setModal({ editing: null, prefill: { t1Ma: t1.t1Ma, t1Ten: t1.t1Ten, t2Ma: t2.t2Ma, t2Ten: t2.t2Ten } })}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-500">
                + Thêm {leafLow}
              </button>
            </div>

            {/* Filter toggle (không dropdown) */}
            <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
              {config.hasMucDo && (
                <ToggleGroup label="Mức độ" options={MUC_DO} sel={fMuc}
                  onToggle={(m) => setFMuc((p) => toggle(p, m))} />
              )}
              <ToggleGroup label="Bậc lớp" options={lopBac.map((b) => b.ma)} sel={fBac}
                onToggle={(b) => setFBac((p) => toggle(p, b))} />
              {anyFilter && (
                <button onClick={() => { setFMuc(new Set()); setFBac(new Set()) }}
                  className="ml-auto text-[13px] font-medium text-slate-400 hover:text-rose-600">Xoá lọc</button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
                {leaves.length === 0 ? `Chưa có ${leafLow} nào.` : 'Không có dạng khớp bộ lọc.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                {filtered.map((d) => (
                  <LeafCard key={d.leafMa} d={d} config={config} cau={cauOf(d.leafMa)} lt={lyThuyet[d.leafMa]}
                    onOpen={() => setHub(d)} onDelete={() => onDelete(d)}
                    onLyThuyet={() => setLtModal({ d })} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {modal && (
        <NodeModal
          config={config} khoi={khoi} tree={tree} lopBac={lopBac}
          editing={modal.editing} prefill={modal.prefill}
          onClose={() => setModal(null)}
          onSaved={async () => { setModal(null); await reload() }}
        />
      )}
      {ltModal && config.lyThuyet && (
        <LyThuyetModal d={ltModal.d} current={lyThuyet[ltModal.d.leafMa]} api={config.lyThuyet} leafLow={leafLow}
          onClose={() => setLtModal(null)}
          onSaved={async () => { setLtModal(null); await reload() }} />
      )}
      {hub && (
        <DangHub d={hub} config={config} chuan={config.chuan}
          onClose={() => setHub(null)}
          onEditDang={() => { const h = hub; setHub(null); setModal({ editing: h }) }}
          onDeleteDang={() => { const h = hub; setHub(null); onDelete(h) }}
          onChanged={reload} />
      )}
    </div>
  )
}

function toggle<T>(set: Set<T>, v: T): Set<T> {
  const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); return n
}

// ── Filter toggle group ────────────────────────────────────────────
function ToggleGroup<T extends string | number>({ label, options, sel, onToggle, render }: {
  label: string; options: T[]; sel: Set<T>; onToggle: (v: T) => void; render?: (o: T) => ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      {options.map((o) => {
        const on = sel.has(o)
        return (
          <button key={String(o)} onClick={() => onToggle(o)}
            className={`h-7 min-w-7 rounded-md px-2 text-[13px] font-semibold transition ${
              on ? 'bg-indigo-600 text-white shadow-sm' : 'border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-700'
            }`}>{render ? render(o) : o}</button>
        )
      })}
    </div>
  )
}

// ── Card 1 lá (dạng) ───────────────────────────────────────────────
function LeafCard({ d, config, cau, lt, onOpen, onDelete, onLyThuyet }: {
  d: MapRow; config: BranchConfig; cau: number; lt?: LyThuyet
  onOpen: () => void; onDelete: () => void; onLyThuyet: () => void
}) {
  const chuan = config.chuan
  const pct = chuan ? Math.min(100, Math.round((cau / chuan) * 100)) : 0
  const duCau = !chuan || cau >= chuan
  const tone = mucDoTone(d.mucDo)
  return (
    <div onClick={onOpen} title="Bấm để mở kho câu hỏi"
      className={`group relative flex cursor-pointer flex-col rounded-xl border-2 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md ${config.hasMucDo ? tone.border : 'border-slate-200'}`}>
      <button onClick={(e) => { e.stopPropagation(); onDelete() }} title="Xoá"
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-md text-[13px] text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100">✕</button>

      <div className="pr-7 text-[17px] font-semibold leading-snug text-slate-900">{d.leafTen}</div>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {config.hasMucDo && d.mucDo != null && (
          <span className={`rounded-md px-2.5 py-1 text-[14px] font-semibold ring-1 ring-inset ${tone.chip}`}>Mức độ {d.mucDo}</span>
        )}
        <BacChip bac={d.bac} />
        <Code>{d.leafMa}</Code>
      </div>

      {chuan != null && (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-[13px]">
            <span className="font-medium text-slate-500">Số {config.countLabel}</span>
            <span className={duCau ? 'font-bold text-emerald-600' : 'font-semibold text-slate-600'}>{cau}/{chuan}{duCau ? ' ✓' : ''}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${duCau ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {config.lyThuyet && (
        <div className="mt-3 flex items-center justify-between text-[14px]">
          <span className="font-medium text-slate-500">Lý thuyết</span>
          {lt ? (
            <span className="flex items-center gap-2">
              <a href={lt.file_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="font-semibold text-emerald-600 hover:underline">✓ Có</a>
              <button onClick={(e) => { e.stopPropagation(); onLyThuyet() }} className="text-[13px] text-slate-400 hover:text-indigo-600">sửa</button>
            </span>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onLyThuyet() }} className="font-semibold text-rose-500 hover:underline">✗ Chưa · Gắn</button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Modal lý thuyết (tạm: link file; upload Storage làm sau) ────────
function LyThuyetModal({ d, current, api, leafLow, onClose, onSaved }: {
  d: MapRow; current?: LyThuyet; leafLow: string
  api: NonNullable<BranchConfig['lyThuyet']>; onClose: () => void; onSaved: () => void
}) {
  const [url, setUrl] = useState(current?.file_url ?? '')
  const [ten, setTen] = useState(current?.ten_file ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    if (!url.trim()) return
    setSaving(true); setError(null)
    try { await api.upsert(d.leafMa, url.trim(), ten.trim() || null); onSaved() }
    catch (e: any) { setError(e.message ?? String(e)); setSaving(false) }
  }
  async function remove() {
    if (!confirm('Gỡ lý thuyết khỏi dạng này?')) return
    setSaving(true); setError(null)
    try { await api.remove(d.leafMa); onSaved() }
    catch (e: any) { setError(e.message ?? String(e)); setSaving(false) }
  }

  return (
    <Shell title={`Lý thuyết · ${d.leafTen}`} onClose={onClose}>
      <div className="mb-3 text-[11px] text-slate-400">1 file/{leafLow} (lý thuyết + phương pháp + bài mẫu). Tạm lưu LINK; upload trực tiếp (Supabase Storage) làm sau.</div>
      <Field label="Link file (PDF / Doc / Drive…)">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={inp} autoFocus />
      </Field>
      <Field label="Tên file (tuỳ chọn)">
        <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder="vd Lý thuyết UCLN.pdf" className={inp} />
      </Field>
      {current && <button onClick={remove} className="text-[13px] font-medium text-rose-500 hover:underline">Gỡ lý thuyết</button>}
      {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={save} disabled={!url.trim() || saving} saving={saving} label="Lưu" />
    </Shell>
  )
}

// ── Modal thêm/sửa lá ──────────────────────────────────────────────
function NodeModal(props: {
  config: BranchConfig; khoi: string; tree: Tier1Node[]; lopBac: LopBac[]
  editing: MapRow | null; prefill?: Partial<MapRow>; onClose: () => void; onSaved: () => void
}) {
  return props.editing ? <SuaNode {...props} editing={props.editing} /> : <ThemNode {...props} />
}

function ThemNode({ config, khoi, tree, lopBac, prefill, onClose, onSaved }: {
  config: BranchConfig; khoi: string; tree: Tier1Node[]; lopBac: LopBac[]
  prefill?: Partial<MapRow>; onClose: () => void; onSaved: () => void
}) {
  const L1 = config.labels.t1, L2 = config.labels.t2, leafLow = config.labels.leaf.toLowerCase()
  const hasTree = tree.length > 0
  const [t1Mode, setT1Mode] = useState<'pick' | 'new'>(prefill?.t1Ma ? 'pick' : hasTree ? 'pick' : 'new')
  const [t1Ma, setT1Ma] = useState(prefill?.t1Ma ?? '')
  const [t1TenNew, setT1TenNew] = useState('')
  const [t2Mode, setT2Mode] = useState<'pick' | 'new'>(prefill?.t2Ma ? 'pick' : 'new')
  const [t2Ma, setT2Ma] = useState(prefill?.t2Ma ?? '')
  const [t2TenNew, setT2TenNew] = useState('')
  const [leafTen, setLeafTen] = useState('')
  const [mucDo, setMucDo] = useState(3)
  const [bac, setBac] = useState('C')
  const [leafMa, setLeafMa] = useState('')
  const [maTouched, setMaTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickedT1 = t1Mode === 'pick' ? tree.find((c) => c.t1Ma === t1Ma) ?? null : null
  const t1Code = t1Mode === 'pick' ? t1Ma : suggestT1Ma(khoi, tree)
  const t1Ten = t1Mode === 'pick' ? pickedT1?.t1Ten ?? '' : t1TenNew
  const pickedT2 = t2Mode === 'pick' ? pickedT1?.tier2s.find((x) => x.t2Ma === t2Ma) ?? null : null
  const t2Code = t2Mode === 'pick' ? t2Ma : suggestT2Ma(t1Code, pickedT1)
  const t2Ten = t2Mode === 'pick' ? pickedT2?.t2Ten ?? '' : t2TenNew
  const suggestedMa = suggestLeafMa(t2Code, pickedT2)

  useEffect(() => { if (!maTouched) setLeafMa(suggestedMa) }, [suggestedMa, maTouched])
  useEffect(() => { if (t1Mode === 'new' && t2Mode === 'pick') setT2Mode('new') }, [t1Mode]) // eslint-disable-line

  const valid = t1Ten.trim() && t2Ten.trim() && leafTen.trim() && leafMa.trim() && bac

  async function save() {
    if (!valid) return
    setSaving(true); setError(null)
    try {
      await config.create({
        leafMa: leafMa.trim(), khoi,
        t1Ma: t1Code, t1Ten: t1Ten.trim(), t2Ma: t2Code, t2Ten: t2Ten.trim(),
        leafTen: leafTen.trim(), bac, mucDo: config.hasMucDo ? mucDo : null,
      })
      onSaved()
    } catch (e: any) {
      const msg = String(e.message ?? e)
      setError(/duplicate|unique/i.test(msg) ? `Mã "${leafMa}" đã tồn tại — sửa lại mã.` : msg)
      setSaving(false)
    }
  }

  return (
    <Shell title={`Thêm ${leafLow} · Khối ${khoi}`} onClose={onClose}>
      <Field label={L1}>
        {t1Mode === 'pick' && hasTree ? (
          <Row>
            <select value={t1Ma} onChange={(e) => { setT1Ma(e.target.value); setT2Ma(''); setT2Mode('new') }} className={inp}>
              <option value="">— chọn —</option>
              {tree.map((c) => <option key={c.t1Ma} value={c.t1Ma}>{c.t1Ma} · {c.t1Ten}</option>)}
            </select>
            <Ghost onClick={() => { setT1Mode('new'); setT1Ma('') }}>+ mới</Ghost>
          </Row>
        ) : (
          <Row>
            <input value={t1TenNew} onChange={(e) => setT1TenNew(e.target.value)} placeholder={`Tên ${L1.toLowerCase()} mới`} className={inp} autoFocus />
            <span className="shrink-0 rounded bg-slate-100 px-2 py-1.5 font-mono text-[11px] text-slate-400">{t1Code}</span>
            {hasTree && <Ghost onClick={() => setT1Mode('pick')}>có sẵn</Ghost>}
          </Row>
        )}
      </Field>

      <Field label={L2}>
        {t2Mode === 'pick' && pickedT1?.tier2s.length ? (
          <Row>
            <select value={t2Ma} onChange={(e) => setT2Ma(e.target.value)} className={inp}>
              <option value="">— chọn —</option>
              {pickedT1.tier2s.map((x) => <option key={x.t2Ma} value={x.t2Ma}>{x.t2Ma} · {x.t2Ten}</option>)}
            </select>
            <Ghost onClick={() => { setT2Mode('new'); setT2Ma('') }}>+ mới</Ghost>
          </Row>
        ) : (
          <Row>
            <input value={t2TenNew} onChange={(e) => setT2TenNew(e.target.value)} placeholder={`Tên ${L2.toLowerCase()} mới`} className={inp} disabled={!t1Ten.trim()} />
            <span className="shrink-0 rounded bg-slate-100 px-2 py-1.5 font-mono text-[11px] text-slate-400">{t2Code}</span>
            {pickedT1?.tier2s.length ? <Ghost onClick={() => setT2Mode('pick')}>có sẵn</Ghost> : null}
          </Row>
        )}
      </Field>

      <Field label={`Tên ${leafLow}`}>
        <input value={leafTen} onChange={(e) => setLeafTen(e.target.value)} placeholder={`Tên ${leafLow}`} className={inp} />
      </Field>

      <Field label={`Mã ${leafLow} (gợi ý — sửa được)`}>
        <input value={leafMa} onChange={(e) => { setLeafMa(e.target.value); setMaTouched(true) }} className={`${inp} font-mono`} />
      </Field>
      {config.hasMucDo ? (
        <div className="grid grid-cols-2 gap-5">
          <Field label="Mức độ"><Seg options={MUC_DO} value={mucDo} onChange={setMucDo} /></Field>
          <Field label="Bậc lớp (≥)"><Seg options={lopBac.map((b) => b.ma)} value={bac} onChange={setBac} render={(o) => `≥${o}`} /></Field>
        </div>
      ) : (
        <Field label="Bậc lớp (≥)"><Seg options={lopBac.map((b) => b.ma)} value={bac} onChange={setBac} render={(o) => `≥${o}`} /></Field>
      )}
      <p className="mt-1 text-[11px] text-slate-400">Mã gợi ý theo vị trí, sửa tay được. Bậc lớp = lớp thấp nhất còn học (S&gt;A&gt;B&gt;C){config.hasMucDo ? ', độc lập độ khó' : ''}.</p>

      {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={save} disabled={!valid || saving} saving={saving} label="Thêm" />
    </Shell>
  )
}

function SuaNode({ config, editing, lopBac, onClose, onSaved }: {
  config: BranchConfig; editing: MapRow; lopBac: LopBac[]; onClose: () => void; onSaved: () => void
}) {
  const leafLow = config.labels.leaf.toLowerCase()
  const [leafTen, setLeafTen] = useState(editing.leafTen)
  const [mucDo, setMucDo] = useState(editing.mucDo ?? 3)
  const [bac, setBac] = useState(editing.bac)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    if (!leafTen.trim()) return
    setSaving(true); setError(null)
    try {
      await config.updateLeaf(editing.leafMa, { leafTen: leafTen.trim(), bac, mucDo: config.hasMucDo ? mucDo : null })
      onSaved()
    } catch (e: any) { setError(e.message ?? String(e)); setSaving(false) }
  }

  return (
    <Shell title={`Sửa ${leafLow} · ${editing.leafMa}`} onClose={onClose}>
      <div className="mb-3 rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
        {editing.t1Ma} · {editing.t1Ten} › {editing.t2Ma} · {editing.t2Ten}
        <span className="mt-0.5 block text-slate-400">Mã &amp; vị trí khoá khi sửa (đổi mã = gãy {config.countLabel} đang trỏ vào).</span>
      </div>
      <Field label={`Tên ${leafLow}`}>
        <input value={leafTen} onChange={(e) => setLeafTen(e.target.value)} className={inp} autoFocus />
      </Field>
      {config.hasMucDo ? (
        <div className="grid grid-cols-2 gap-5">
          <Field label="Mức độ"><Seg options={MUC_DO} value={mucDo} onChange={setMucDo} /></Field>
          <Field label="Bậc lớp (≥)"><Seg options={lopBac.map((b) => b.ma)} value={bac} onChange={setBac} render={(o) => `≥${o}`} /></Field>
        </div>
      ) : (
        <Field label="Bậc lớp (≥)"><Seg options={lopBac.map((b) => b.ma)} value={bac} onChange={setBac} render={(o) => `≥${o}`} /></Field>
      )}
      {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={save} disabled={!leafTen.trim() || saving} saving={saving} label="Lưu" />
    </Shell>
  )
}
