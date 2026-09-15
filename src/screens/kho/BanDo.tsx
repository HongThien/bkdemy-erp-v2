import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  listLopBac, groupMap, suggestT1Ma, suggestT2Ma, suggestLeafMa, uploadKhoFile, uploadKhoImage,
  KHO_TIEN_TO, soThuTuCua,
  callGeminiJson, buildLyThuyetPrompt, parseLyThuyetJson, LYTHUYET_SCHEMA,
  callGeminiRich, buildTheoryIngestPrompt, parseTheoryIngest, THEORY_SCHEMA,
  type MapRow, type Tier1Node, type Tier2Node, type LopBac, type LyThuyet,
} from '../../lib/kho/api'
import { fileToCanvases, canvasToJpegBase64, cropCanvasBox } from '../../lib/pdfRender'
import type { BranchConfig, LyThuyetApi } from './branches'
import { BacChip, Code, inp, Shell, Field, Row, Seg, Ghost, Actions, mucDoTone, MathText, readClipboardImageFile } from './ui'
import DangHub from './DangHub'
import DungSaiPanel from './DungSaiBank'
import ChoDuyetPanel from './ChoDuyetPanel'
import PdfCropper from '../../components/PdfCropper'

const MUC_DO = [1, 2, 3, 4, 5]

export default function BanDo({ config, khoi }: { config: BranchConfig; khoi: string }) {
  const L1 = config.labels.t1, L2 = config.labels.t2, Leaf = config.labels.leaf
  const leafLow = Leaf.toLowerCase(), t2Low = L2.toLowerCase()

  const [rows, setRows] = useState<MapRow[]>([])
  const [lopBac, setLopBac] = useState<LopBac[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [lyThuyet, setLyThuyet] = useState<Record<string, LyThuyet>>({})
  const [lyThuyetT2, setLyThuyetT2] = useState<Record<string, LyThuyet>>({})
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [selT1, setSelT1] = useState<string | null>(null)
  const [selT2, setSelT2] = useState<string | null>(null)
  const [modal, setModal] = useState<null | { editing: MapRow | null; prefill?: Partial<MapRow> }>(null)
  const [ltModal, setLtModal] = useState<null | { d: MapRow }>(null)
  const [ltT2Modal, setLtT2Modal] = useState<null | { ma: string; ten: string }>(null)
  const [hub, setHub] = useState<MapRow | null>(null)
  const [dungSaiT2, setDungSaiT2] = useState<null | { t2Ma: string; t2Ten: string }>(null)
  const [fMuc, setFMuc] = useState<Set<number>>(new Set())
  const [fBac, setFBac] = useState<Set<string>>(new Set())
  const [choDuyet, setChoDuyet] = useState(false) // Câu chờ duyệt (26/08) — chỉ Đại, xem ChoDuyetPanel

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [r, c, lt, lt2] = await Promise.all([
        config.list(khoi), config.count(),
        config.lyThuyet ? config.lyThuyet.list() : Promise.resolve({} as Record<string, LyThuyet>),
        config.lyThuyetT2 ? config.lyThuyetT2.list() : Promise.resolve({} as Record<string, LyThuyet>),
      ])
      setRows(r); setCounts(c); setLyThuyet(lt); setLyThuyetT2(lt2)
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
  // Điểm hoàn thành 1 dạng (0..1): câu (cap ở chuẩn) 70% + lý thuyết 30%. Nhánh không có lý thuyết → chỉ câu.
  const scoreOfDang = (leafMa: string) => {
    const cauPart = config.chuan ? Math.min(cauOf(leafMa) / config.chuan, 1) : cauOf(leafMa) > 0 ? 1 : 0
    return config.lyThuyet ? 0.7 * cauPart + 0.3 * (lyThuyet[leafMa] ? 1 : 0) : cauPart
  }
  // Trục lý thuyết CHUYÊN ĐỀ: CÓ → 1 · CHƯA → 0 · "không cần" hoặc nhánh-không-có-LT → null (LOẠI khỏi % cho khỏi sai).
  const ltAxis = (t2Ma: string): number | null => {
    if (!config.lyThuyetT2) return null
    const lt = lyThuyetT2[t2Ma]
    if (lt?.khong_can) return null
    return lt ? 1 : 0
  }
  const pctMean = (items: number[]): number | null =>
    items.length ? Math.round((items.reduce((s, x) => s + x, 0) / items.length) * 100) : null
  const pctChuyenDe = (t2n: Tier2Node): number | null => {
    const items = t2n.leaves.map((l) => scoreOfDang(l.leafMa))
    const lt = ltAxis(t2n.t2Ma); if (lt != null) items.push(lt) // lý thuyết chung tính như 1 mục
    return pctMean(items)
  }
  const pctChuDe = (t1n: Tier1Node): number | null => {
    const items: number[] = []
    for (const t2n of t1n.tier2s) { for (const l of t2n.leaves) items.push(scoreOfDang(l.leafMa)); const lt = ltAxis(t2n.t2Ma); if (lt != null) items.push(lt) }
    return pctMean(items)
  }

  async function onDelete(d: MapRow) {
    if (!confirm(`Xoá ${leafLow} "${d.leafTen}" (${d.leafMa})?`)) return
    try { await config.deleteLeaf(d.leafMa); await reload() }
    catch (e: any) { alert(`Không xoá được: ${e.message ?? e}\n(Có thể còn ${config.countLabel} treo vào ${leafLow}.)`) }
  }
  const soCauCum = (lvs: { leafMa: string }[]) => lvs.reduce((s, l) => s + cauOf(l.leafMa), 0)
  const delCum = config.deleteCum ?? config.deleteLeaves // ưu tiên xoá KÈM câu (cascade); nhánh chưa có thì dùng bản thường
  async function onDeleteT2(node: Tier2Node) {
    const sc = soCauCum(node.leaves)
    if (!confirm(`Xoá ${t2Low} "${node.t2Ten}" + ${node.leaves.length} ${leafLow}${sc ? ` + ${sc} ${config.countLabel}` : ''}?\nKhông hoàn tác.`)) return
    try {
      await delCum(node.leaves.map((l) => l.leafMa))
      if (selT2 === node.t2Ma) setSelT2(null)
      await reload()
    } catch (e: any) { alert(`Không xoá được: ${e.message ?? e}`) }
  }
  async function onDeleteT1(node: Tier1Node) {
    const all = node.tier2s.flatMap((x) => x.leaves)
    const sc = soCauCum(all)
    if (!confirm(`Xoá ${L1.toLowerCase()} "${node.t1Ten}" + ${all.length} ${leafLow}${sc ? ` + ${sc} ${config.countLabel}` : ''}?\nKhông hoàn tác.`)) return
    try {
      await delCum(all.map((l) => l.leafMa))
      if (selT1 === node.t1Ma) { setSelT1(null); setSelT2(null) }
      await reload()
    } catch (e: any) { alert(`Không xoá được: ${e.message ?? e}`) }
  }
  async function onRenameT1(node: Tier1Node) {
    if (!config.renameT1) return
    const ten = prompt(`Đổi tên ${L1.toLowerCase()}:`, node.t1Ten)?.trim()
    if (!ten || ten === node.t1Ten) return
    try { await config.renameT1(khoi, node.t1Ma, ten); await reload() } catch (e: any) { alert(`Không sửa được: ${e.message ?? e}`) }
  }
  async function onRenameT2(node: Tier2Node) {
    if (!config.renameT2) return
    const ten = prompt(`Đổi tên ${t2Low}:`, node.t2Ten)?.trim()
    if (!ten || ten === node.t2Ten) return
    try { await config.renameT2(node.t2Ma, ten); await reload() } catch (e: any) { alert(`Không sửa được: ${e.message ?? e}`) }
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
          <span className="flex items-center gap-1.5">
            {config.key === 'dai' && (
              <button onClick={() => setChoDuyet(true)} title="Câu clone từ hàng đợi Claude Code, chưa vào kho"
                className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 hover:bg-violet-100">Chờ duyệt</button>
            )}
            <span className="rounded-full bg-slate-100 px-1.5 text-[11px] text-slate-500">{tree.length}</span>
          </span>
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
                    className={`flex w-full items-start gap-2.5 rounded-md py-2 pl-2.5 pr-14 text-left transition ${
                      active ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50'
                    }`}>
                    <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-slate-400'}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium leading-snug text-slate-800">{node.t1Ten}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="truncate">{node.t1Ma} · {node.tier2s.length} {t2Low} · {node.soLeaf} {leafLow}</span>
                        {config.chuan && <PctBadge pct={pctChuDe(node)} size="sm" />}
                      </span>
                    </span>
                  </button>
                  {config.renameT1 && <button onClick={() => onRenameT1(node)} title={`Sửa tên ${L1.toLowerCase()}`}
                    className="absolute right-8 top-1.5 flex h-6 w-6 items-center justify-center rounded-md text-[12px] text-slate-300 opacity-0 transition hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100">✎</button>}
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
              {config.chuan && <PctBadge pct={pctChuDe(t1)} />}
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-5">
              {t1.tier2s.map((node) => {
                const du = node.leaves.filter((l) => isDu(l.leafMa)).length
                return (
                  <div key={node.t2Ma} role="button" onClick={() => setSelT2(node.t2Ma)}
                    className="group relative flex min-h-[210px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-[0_14px_36px_-10px_rgba(79,70,229,0.28)]">
                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 transition group-hover:opacity-100" />
                    {config.chuan && <PctRing pct={pctChuyenDe(node)} className="absolute right-3 top-3" />}
                    {config.renameT2 && <button onClick={(e) => { e.stopPropagation(); onRenameT2(node) }} title={`Sửa tên ${t2Low}`}
                      className="absolute right-[100px] top-[14px] z-10 flex h-7 w-7 items-center justify-center rounded-md text-slate-300 opacity-0 transition hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100">✎</button>}
                    <button onClick={(e) => { e.stopPropagation(); onDeleteT2(node) }} title={`Xoá ${t2Low}`}
                      className="absolute right-[68px] top-[14px] z-10 flex h-7 w-7 items-center justify-center rounded-md text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100">✕</button>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-sm shadow-indigo-500/30">
                        {soThuTuCua(node.t2Ma, 4)}
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="text-[17px] font-semibold leading-snug text-slate-800 pr-12">{node.t2Ten}</div>
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
                        {config.lyThuyetT2 && (() => {
                          const lt = lyThuyetT2[node.t2Ma]
                          const cls = 'rounded-full px-2 py-1 text-[12px] font-medium'
                          if (lt?.khong_can) return <span className={`${cls} bg-slate-100 text-slate-400`} title="Không cần lý thuyết chung">📖 không cần</span>
                          if (lt) return <span className={`${cls} bg-violet-50 text-violet-600`} title="Có lý thuyết chung">📖 LT ✓</span>
                          return <span className={`${cls} bg-amber-50 text-amber-700`} title="Chưa có lý thuyết chung — bổ sung hoặc đánh dấu không cần">📖 chưa LT</span>
                        })()}
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
                {config.chuan && <PctBadge pct={pctChuyenDe(t2)} />}
                <span className="text-xs text-slate-400">· {leaves.length} {leafLow}</span>
              </div>
              <div className="flex items-center gap-2">
                {config.lyThuyetT2 && (() => {
                  const lt = lyThuyetT2[t2.t2Ma]
                  const label = lt?.khong_can ? '📖 LT: không cần' : lt ? '📖 Lý thuyết chung ✓' : '📖 Lý thuyết chung'
                  const tone = lt?.khong_can ? 'border-slate-200 text-slate-500 hover:border-slate-300' : lt ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  return (
                    <button onClick={() => setLtT2Modal({ ma: t2.t2Ma, ten: t2.t2Ten })} title="Lý thuyết chung của cả chuyên đề (tuỳ chọn)"
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${tone}`}>{label}</button>
                  )
                })()}
                {config.cauTbl && (
                  <button onClick={() => setDungSaiT2({ t2Ma: t2.t2Ma, t2Ten: t2.t2Ten })} title="Kho câu Đúng/Sai (mỗi mệnh đề 1 dạng riêng) của chuyên đề"
                    className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100">📋 Đúng/Sai</button>
                )}
                <button
                  onClick={() => setModal({ editing: null, prefill: { t1Ma: t1.t1Ma, t1Ten: t1.t1Ten, t2Ma: t2.t2Ma, t2Ten: t2.t2Ten } })}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-500">
                  + Thêm {leafLow}
                </button>
              </div>
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
        <LyThuyetModal ma={ltModal.d.leafMa} ten={ltModal.d.leafTen} current={lyThuyet[ltModal.d.leafMa]} api={config.lyThuyet}
          onClose={() => setLtModal(null)}
          onSaved={async () => { setLtModal(null); await reload() }} />
      )}
      {ltT2Modal && config.lyThuyetT2 && (
        <LyThuyetModal ma={ltT2Modal.ma} ten={ltT2Modal.ten} current={lyThuyetT2[ltT2Modal.ma]} api={config.lyThuyetT2} allowKhongCan
          onClose={() => setLtT2Modal(null)}
          onSaved={async () => { setLtT2Modal(null); await reload() }} />
      )}
      {hub && (
        <DangHub d={hub} config={config} chuan={config.chuan} allDang={rows}
          onClose={() => setHub(null)}
          onEditDang={() => { const h = hub; setHub(null); setModal({ editing: h }) }}
          onDeleteDang={() => { const h = hub; setHub(null); onDelete(h) }}
          onChanged={reload} />
      )}
      {dungSaiT2 && config.cauTbl && (
        <DungSaiPanel t2Ma={dungSaiT2.t2Ma} t2Ten={dungSaiT2.t2Ten} tbl={config.cauTbl} allDang={rows}
          onClose={() => setDungSaiT2(null)} />
      )}
      {choDuyet && <ChoDuyetPanel onClose={() => setChoDuyet(false)} />}
    </div>
  )
}

function toggle<T>(set: Set<T>, v: T): Set<T> {
  const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); return n
}

// 5 thang màu % : <20 đỏ · 20 cam · 40 nõn chuối · 60 xanh · 80 xanh đậm.
function pctColor(pct: number | null): string {
  if (pct == null) return '#94a3b8'
  if (pct < 20) return '#f43f5e'   // rose-500 — đỏ
  if (pct < 40) return '#f97316'   // orange-500 — cam
  if (pct < 60) return '#84cc16'   // lime-500 — xanh nõn chuối
  if (pct < 80) return '#22c55e'   // green-500 — xanh
  return '#059669'                 // emerald-600 — xanh đậm
}
function pctTone(pct: number | null): string {
  if (pct == null) return 'bg-slate-100 text-slate-400'
  if (pct < 20) return 'bg-rose-100 text-rose-700'
  if (pct < 40) return 'bg-orange-100 text-orange-700'
  if (pct < 60) return 'bg-lime-100 text-lime-700'
  if (pct < 80) return 'bg-green-100 text-green-700'
  return 'bg-emerald-100 text-emerald-700'
}
// Pill % (chủ đề / header)
function PctBadge({ pct, size = 'md' }: { pct: number | null; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[13px]'
  return <span className={`rounded-full font-bold ${pctTone(pct)} ${dim}`} title="% hoàn thành (câu + lý thuyết)">{pct == null ? '—' : `${pct}%`}</span>
}
// Vòng tròn tiến độ % (góc card chuyên đề)
function PctRing({ pct, className }: { pct: number | null; className?: string }) {
  const size = 50, stroke = 7, r = (size - stroke) / 2, c = 2 * Math.PI * r // viền dày
  const p = pct == null ? 0 : Math.max(0, Math.min(100, pct))
  const col = pctColor(pct)
  // className đã có 'absolute …' → tự là containing block cho text; không hardcode 'relative' (sẽ đè vị trí).
  return (
    <div className={className ?? 'relative'} style={{ width: size, height: size }} title="% hoàn thành (câu + lý thuyết)">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        {pct != null && <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(p / 100) * c} ${c}`} />}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color: col }}>{pct == null ? '—' : `${pct}%`}</span>
    </div>
  )
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
            <button onClick={(e) => { e.stopPropagation(); onLyThuyet() }} className="font-semibold text-emerald-600 hover:underline">✓ Có · xem/sửa</button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onLyThuyet() }} className="font-semibold text-rose-500 hover:underline">✗ Chưa · Gắn</button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Modal lý thuyết — popup TO: trái code LaTeX (sửa), phải preview; upload ảnh/PDF → AI bóc LaTeX ──
const LT_MODELS = [
  { value: 'gemini-2.5-flash-lite', label: 'Flash-Lite' },
  { value: 'gemini-2.5-flash', label: 'Flash' },
  { value: 'gemini-2.5-pro', label: 'Pro ⚠ đắt 4×' },
]
type LtFile = { name: string; mimeType: string; dataBase64: string; isImage: boolean }
function ltToBase64(f: File): Promise<string> {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => { const s = String(r.result); res(s.slice(s.indexOf(',') + 1)) }; r.onerror = rej; r.readAsDataURL(f) })
}
export function LyThuyetModal({ ma, ten, current, api, allowKhongCan, onClose, onSaved }: {
  ma: string; ten: string; current?: LyThuyet; allowKhongCan?: boolean
  api: LyThuyetApi; onClose: () => void; onSaved: () => void
}) {
  const [khongCan, setKhongCan] = useState(!!current?.khong_can)
  const [noiDung, setNoiDung] = useState(current?.noi_dung ?? '')
  const [url, setUrl] = useState(current?.file_url ?? '')
  const [tenFile, setTenFile] = useState(current?.ten_file ?? '')
  const [files, setFiles] = useState<LtFile[]>([])
  const [model, setModel] = useState('gemini-2.5-flash')
  const [ghiChu, setGhiChu] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showFile, setShowFile] = useState(!!current?.file_url)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [crop, setCrop] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const insertFileRef = useRef<HTMLInputElement>(null) // upload ảnh CHÈN THẲNG vào lý thuyết (khác fileRef = nguồn cho AI)
  const attachRef = useRef<HTMLInputElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const hasContent = !!noiDung.trim() || !!url.trim()

  // Cắt hình từ PDF/ảnh → upload → chèn markdown ![](url) vào vị trí con trỏ trong code lý thuyết.
  async function insertImg(file: File) {
    setUploading(true); setError(null)
    try {
      const u = await uploadKhoImage(file)
      const md = `\n![](${u})\n`
      const ta = taRef.current
      const a = ta?.selectionStart ?? noiDung.length, b = ta?.selectionEnd ?? noiDung.length
      setNoiDung((s) => s.slice(0, a) + md + s.slice(b))
      setCrop(false)
    } catch (e: any) { setError('Upload ảnh lỗi: ' + (e?.message ?? e)) } finally { setUploading(false) }
  }

  async function addFiles(list: FileList | File[]) {
    const arr = Array.from(list).filter((f) => f.type.startsWith('image/') || f.type === 'application/pdf')
    const loaded = await Promise.all(arr.map(async (f) => ({ name: f.name, mimeType: f.type, dataBase64: await ltToBase64(f), isImage: f.type.startsWith('image/') })))
    setFiles((p) => [...p, ...loaded])
  }
  async function pasteClip() {
    try { const f = await readClipboardImageFile(); if (f) addFiles([f]); else setError('Clipboard không có ảnh — copy ảnh trước rồi bấm Dán.') }
    catch (e: any) { setError(e?.message ?? String(e)) }
  }
  async function runAuto() {
    setError(null); setBusy(true)
    try {
      const raw = await callGeminiJson(buildLyThuyetPrompt({ tenDang: ten, ghiChu }), { model, schema: LYTHUYET_SCHEMA, files: files.map((f) => ({ mimeType: f.mimeType, dataBase64: f.dataBase64 })) })
      setNoiDung(parseLyThuyetJson(raw))
    } catch (e: any) { setError(e.message ?? String(e)) } finally { setBusy(false) }
  }
  // KB4: bóc lý thuyết KÈM HÌNH — AI trả text + marker [[Hn]] đúng vị trí → tự cắt hình DPI cao → chèn ![](url).
  // Xử lý TỪNG file/trang (bbox không lẫn): mỗi canvas 1 call; marker [[Hn]] map vào hinh[n-1] của canvas đó.
  async function runAutoHinh() {
    if (!files.length) { setError('Chọn ảnh/PDF lý thuyết trước.'); return }
    setError(null); setBusy(true)
    try {
      const parts: string[] = []
      for (const f of files) {
        for (const c of await fileToCanvases(f.mimeType, f.dataBase64)) {
          const { text } = await callGeminiRich(buildTheoryIngestPrompt(), { model, schema: THEORY_SCHEMA, files: [{ mimeType: 'image/jpeg', dataBase64: canvasToJpegBase64(c) }] })
          const { noiDung, hinh } = parseTheoryIngest(text)
          let nd = noiDung
          for (let i = 0; i < hinh.length; i++) {
            const b = hinh[i].box; if (!b) continue
            const blob = await (await fetch(cropCanvasBox(c, b))).blob()
            const url = await uploadKhoImage(new File([blob], 'fig.png', { type: 'image/png' }))
            nd = nd.replace(`[[H${i + 1}]]`, `\n![](${url})\n`)
          }
          parts.push(nd.replace(/\[\[H\d+\]\]/g, '').trim()) // bỏ marker thừa (AI đặt mà thiếu box)
        }
      }
      setNoiDung(parts.join('\n\n'))
    } catch (e: any) { setError(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function onAttach(f: File | null | undefined) {
    if (!f) return; setUploading(true); setError(null)
    try { const r = await uploadKhoFile(f); setUrl(r.url); setTenFile(r.name) }
    catch (e: any) { setError('Upload lỗi: ' + (e?.message ?? e)) } finally { setUploading(false) }
  }
  async function save() {
    if (!khongCan && !hasContent) return
    setSaving(true); setError(null)
    try {
      if (khongCan) await api.upsert(ma, '', null, null, true)
      else await api.upsert(ma, noiDung.trim(), url.trim() || null, tenFile.trim() || null, false)
      onSaved()
    } catch (e: any) { setError(e.message ?? String(e)); setSaving(false) }
  }
  async function remove() {
    if (!confirm('Gỡ lý thuyết khỏi dạng này?')) return
    setSaving(true); setError(null)
    try { await api.remove(ma); onSaved() }
    catch (e: any) { setError(e.message ?? String(e)); setSaving(false) }
  }
  const sel = 'h-[34px] rounded-md border border-slate-300 bg-white px-2 text-[13px] outline-none focus:border-indigo-500'

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
      <div className="absolute inset-4 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header: hàng tiêu đề + hàng công cụ AI (tách 2 hàng cho khỏi chen) */}
        <div className="border-b border-slate-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-slate-900">Lý thuyết · {ten}</h3>
            <span className="hidden text-[12px] text-slate-400 lg:inline">soạn tay, hoặc upload ảnh/PDF → AI bóc LaTeX</span>
            {allowKhongCan && (
              <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-slate-300">
                <input type="checkbox" checked={khongCan} onChange={(e) => setKhongCan(e.target.checked)} /> Chuyên đề này không cần lý thuyết
              </label>
            )}
            <button onClick={onClose} className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
          </div>
          {!khongCan && (
            <>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <button onClick={() => fileRef.current?.click()} className="h-[34px] shrink-0 whitespace-nowrap rounded-md border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-600 hover:border-indigo-400">📎 Chọn ảnh/PDF</button>
                <button onClick={pasteClip} className="h-[34px] shrink-0 whitespace-nowrap rounded-md border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-600 hover:border-indigo-400">📋 Dán clipboard</button>
                <button onClick={() => insertFileRef.current?.click()} disabled={uploading} title="Upload ảnh từ máy → chèn ![](url) vào lý thuyết tại vị trí con trỏ" className="h-[34px] shrink-0 whitespace-nowrap rounded-md border border-violet-300 bg-white px-3 text-[13px] font-medium text-violet-700 hover:bg-violet-50 disabled:opacity-50">{uploading ? '⏳ Đang chèn…' : '🖼 Chèn ảnh'}</button>
                <button onClick={() => setCrop(true)} disabled={uploading} title="Cắt hình từ PDF/ảnh (DPI cao) → chèn vào lý thuyết tại vị trí con trỏ" className="h-[34px] shrink-0 whitespace-nowrap rounded-md border border-violet-300 bg-white px-3 text-[13px] font-medium text-violet-700 hover:bg-violet-50 disabled:opacity-50">{uploading ? '⏳ Đang chèn…' : '✂️ Cắt hình chèn'}</button>
                <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
                <input ref={insertFileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void insertImg(f); e.target.value = '' }} />
                <select value={model} onChange={(e) => setModel(e.target.value)} className={`${sel} shrink-0`}>{LT_MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select>
                <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="ghi chú AI (tuỳ)" className={`${inp} h-[34px] min-w-[120px] flex-1 text-[13px]`} />
                <button onClick={runAuto} disabled={!files.length || busy} className="h-[34px] shrink-0 whitespace-nowrap rounded-md bg-indigo-600 px-4 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40" title="Bóc chữ + công thức (KHÔNG kèm hình)">{busy ? '⏳ Đang bóc…' : '🪄 Bóc chữ'}</button>
                <button onClick={runAutoHinh} disabled={!files.length || busy} className="h-[34px] shrink-0 whitespace-nowrap rounded-md bg-violet-600 px-4 text-[13px] font-medium text-white shadow-sm hover:bg-violet-500 disabled:opacity-40" title="Bóc chữ + tự CẮT & CHÈN HÌNH đúng vị trí (DPI cao)">{busy ? '⏳ Đang bóc…' : '🖼 Bóc + hình'}</button>
              </div>
              {files.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {files.map((f, i) => (
                    <div key={i} className="relative h-10 w-12 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-50">
                      {f.isImage ? <img src={`data:${f.mimeType};base64,${f.dataBase64}`} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[9px] font-medium text-slate-500">PDF</div>}
                      <button onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded bg-white/90 text-[10px] text-rose-600">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Split: trái code LaTeX · phải preview — hoặc note khi "không cần" */}
        {khongCan ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
            <span className="text-4xl">📭</span>
            <p className="max-w-md text-sm text-slate-500">Đã đánh dấu <b className="text-slate-700">"không cần lý thuyết chung"</b> cho chuyên đề này → tính là <b className="text-emerald-600">hoàn thành</b> (không trừ % tiến độ). Bỏ tick ở trên để soạn lý thuyết.</p>
          </div>
        ) : (
        <div className="grid min-h-0 flex-1 grid-cols-2">
          <div className="flex min-h-0 flex-col border-r border-slate-200">
            <div className="border-b border-slate-100 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-500">Code (LaTeX) — sửa tự do</div>
            <textarea ref={taRef} value={noiDung} onChange={(e) => setNoiDung(e.target.value)}
              onPaste={(e) => { const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith('image/')); if (f) { e.preventDefault(); void insertImg(f) } }}
              placeholder={'Lý thuyết · phương pháp · ví dụ…\nCông thức $\\dfrac{-b}{2a}$, $x \\neq 0$\nChèn hình: ![](url) — nút 🖼 Chèn ảnh / ✂️ Cắt hình chèn, hoặc dán ảnh (Ctrl+V) thẳng vào đây'}
              className="min-h-0 flex-1 resize-none p-4 font-mono text-[13px] leading-relaxed outline-none" />
          </div>
          <div className="flex min-h-0 flex-col">
            <div className="border-b border-slate-100 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-500">Xem trước</div>
            <div className="min-h-0 flex-1 overflow-auto p-4 text-[16px] leading-loose text-slate-800">
              {noiDung.trim() ? <MathText>{noiDung}</MathText> : <span className="text-slate-400">— preview hiện ở đây</span>}
            </div>
          </div>
        </div>
        )}

        {/* Footer: đính kèm + lưu */}
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 px-6 py-3">
          {!khongCan && <button onClick={() => setShowFile((s) => !s)} className="text-[12px] font-medium text-slate-400 hover:text-indigo-600">{showFile ? '− Ẩn đính kèm' : '+ Đính kèm file / link (tuỳ chọn)'}</button>}
          {!khongCan && showFile && (
            <div className="flex items-center gap-2">
              <button onClick={() => attachRef.current?.click()} disabled={uploading} className="rounded-md border border-slate-300 px-2.5 py-1 text-[12px] text-slate-600 hover:border-indigo-400 disabled:opacity-60">{uploading ? '⏳ Đang tải…' : '📄 Tải file'}</button>
              <input ref={attachRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,image/*" hidden onChange={(e) => { onAttach(e.target.files?.[0]); e.target.value = '' }} />
              {url && <a href={url} target="_blank" rel="noreferrer" className="max-w-[200px] truncate text-[12px] font-medium text-indigo-600 hover:underline">{tenFile || 'file'} ↗</a>}
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="link ngoài…" className={`${inp} h-[30px] w-44 text-[12px]`} />
            </div>
          )}
          {error && <span className="max-w-[40%] truncate text-xs text-rose-600" title={error}>⚠ {error}</span>}
          {current && <button onClick={remove} className="text-[13px] font-medium text-rose-500 hover:underline">Gỡ</button>}
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
            <button onClick={save} disabled={(!khongCan && !hasContent) || saving || uploading} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{saving ? 'Đang lưu…' : 'Lưu'}</button>
          </div>
        </div>
      </div>
      {crop && <PdfCropper title="Cắt hình chèn vào lý thuyết" onClose={() => setCrop(false)} onCrop={insertImg} />}
    </div>
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
  const t1Code = t1Mode === 'pick' ? t1Ma : suggestT1Ma(khoi, tree, KHO_TIEN_TO[config.key])
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
