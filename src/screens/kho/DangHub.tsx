import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  listCauByDang, updateCau, deleteCau,
  buildClonePrompt, parseCloneJson, saveCloneBatch,
  buildBatchPrompt, parseBatchJson, parseStructuredText, saveCauBatch, callGeminiJson,
  LOAI_CAU, type CauHoi, type MapRow,
} from '../../lib/kho/api'

const SAMPLE_TEXT = `Câu 1.
Đề bài: Tìm số tự nhiên nhỏ nhất chia hết cho cả 3 và 5.
Đáp án: 15
Lời giải chi tiết: BCNN(3, 5) = 15.

Câu 2.
Đề bài: Tính $\\frac{2}{3} + \\frac{1}{6}$.
Đáp án: $\\frac{5}{6}$
Lời giải chi tiết: Quy đồng: $\\frac{4}{6} + \\frac{1}{6} = \\frac{5}{6}$.`
import type { BranchConfig } from './branches'
import { BacChip, Code, inp, Shell, Field, Seg, Actions, mucDoTone, MathText } from './ui'

const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
const ta = `${inp} min-h-[72px] resize-y leading-relaxed`
const sel = 'h-[34px] rounded-md border border-slate-300 bg-white px-2 text-[13px] outline-none focus:border-indigo-500'

export default function DangHub({ d, config, chuan, onClose, onEditDang, onDeleteDang, onChanged }: {
  d: MapRow; config: BranchConfig; chuan?: number
  onClose: () => void; onEditDang: () => void; onDeleteDang: () => void; onChanged: () => void
}) {
  const isDai = config.key === 'dai'
  const [caus, setCaus] = useState<CauHoi[]>([])
  const [loading, setLoading] = useState(isDai)
  const [err, setErr] = useState<string | null>(null)
  const [cauModal, setCauModal] = useState<null | { editing: CauHoi }>(null)
  const [importMode, setImportMode] = useState<'clone' | 'batch' | null>(null)
  const tone = mucDoTone(d.mucDo)

  async function reload() {
    if (!isDai) return
    setLoading(true); setErr(null)
    try { setCaus(await listCauByDang(d.leafMa)) }
    catch (e: any) { setErr(e.message ?? String(e)) }
    finally { setLoading(false) }
    onChanged()
  }
  useEffect(() => { reload() }, [d.leafMa]) // eslint-disable-line

  async function onDelCau(c: CauHoi) {
    if (!confirm('Xoá câu này?')) return
    try { await deleteCau(c.ma_cau); await reload() } catch (e: any) { alert(e.message ?? e) }
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-4 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#fafafb] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 border-b border-slate-200 bg-white px-6 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-xl font-semibold text-slate-900">{d.leafTen}</h2>
              <Code>{d.leafMa}</Code>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
              {config.hasMucDo && d.mucDo != null && (
                <span className={`rounded-md px-2 py-0.5 text-[12px] font-semibold ring-1 ring-inset ${tone.chip}`}>Mức độ {d.mucDo}</span>
              )}
              <BacChip bac={d.bac} size="sm" />
              <span className="text-slate-400">{d.t1Ten} › {d.t2Ten}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button onClick={onEditDang} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">Sửa dạng</button>
            <button onClick={onDeleteDang} className="rounded-md border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:border-rose-300 hover:text-rose-600">Xoá</button>
            <button onClick={onClose} className="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {!isDai ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">Bài/Ý của nhánh Hình — dựng sau.</div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[15px] font-semibold uppercase tracking-wider text-slate-600">Kho câu hỏi</h3>
                  <span className={`text-sm font-semibold ${chuan && caus.length >= chuan ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {caus.length}{chuan ? `/${chuan}` : ''} câu{chuan && caus.length >= chuan ? ' ✓' : ''}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setImportMode('clone')} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">✨ Clone biến thể</button>
                  <button onClick={() => setImportMode('batch')} className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[13px] font-medium text-indigo-700 hover:bg-indigo-100">📥 Nhập chuỗi câu</button>
                </div>
              </div>

              {chuan && (
                <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${caus.length >= chuan ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, Math.round((caus.length / chuan) * 100))}%` }} />
                </div>
              )}

              {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
                : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
                : caus.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
                    Chưa có câu nào. <b>Clone biến thể</b> (sinh từ 1 bài mẫu) hoặc <b>Nhập chuỗi câu</b> (cả file câu có sẵn).
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                    {caus.map((c, i) => (
                      <li key={c.ma_cau} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-slate-400">#{i + 1}</span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[12px] font-medium text-slate-600">{loaiLabel(c.loai_cau)}</span>
                            <span className={`rounded px-2 py-0.5 text-[12px] font-medium ${c.nguon === 'clone' ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'}`}>{c.nguon === 'clone' ? 'clone' : 'gốc'}</span>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => setCauModal({ editing: c })} className="text-[13px] font-medium text-slate-500 hover:text-indigo-600">Sửa</button>
                            <button onClick={() => onDelCau(c)} className="text-[13px] font-medium text-slate-500 hover:text-rose-600">Xoá</button>
                          </div>
                        </div>
                        <div className="text-[16px] leading-loose text-slate-800"><MathText>{c.noi_dung}</MathText></div>
                        {c.lua_chon && c.lua_chon.length ? (
                          <div className="mt-1.5 space-y-0.5 text-[14px]">
                            {c.lua_chon.map((o, oi) => {
                              const letter = String.fromCharCode(65 + oi)
                              const correct = (c.dap_an ?? '').trim().toUpperCase() === letter
                              return <div key={oi} className={correct ? 'font-medium text-emerald-700' : 'text-slate-600'}><b>{letter}.</b> <MathText>{o}</MathText>{correct ? ' ✓' : ''}</div>
                            })}
                          </div>
                        ) : c.dap_an ? <div className="mt-1.5 text-[13px] text-slate-500">Đáp án: <span className="font-medium text-slate-700"><MathText>{c.dap_an}</MathText></span></div> : null}
                      </li>
                    ))}
                  </ul>
                )}
            </>
          )}
        </div>
      </div>

      {cauModal && (
        <CauModal editing={cauModal.editing} onClose={() => setCauModal(null)} onSaved={async () => { setCauModal(null); await reload() }} />
      )}
      {importMode && (
        <AiImportModal mode={importMode} dangChinh={d.leafMa} tenDang={d.leafTen}
          onClose={() => setImportMode(null)} onSaved={async () => { setImportMode(null); await reload() }} />
      )}
    </div>
  )
}

// ── Sửa 1 câu ──────────────────────────────────────────────────────
function CauModal({ editing, onClose, onSaved }: { editing: CauHoi; onClose: () => void; onSaved: () => void }) {
  const [loai, setLoai] = useState(editing.loai_cau)
  const [noiDung, setNoiDung] = useState(editing.noi_dung)
  const [dapAn, setDapAn] = useState(editing.dap_an ?? '')
  const [loiGiai, setLoiGiai] = useState(editing.loi_giai ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function save() {
    if (!noiDung.trim()) return
    setSaving(true); setError(null)
    try {
      await updateCau(editing.ma_cau, { loai_cau: loai, noi_dung: noiDung.trim(), dap_an: dapAn.trim() || null, loi_giai: loiGiai.trim() || null })
      onSaved()
    } catch (e: any) { setError(e.message ?? String(e)); setSaving(false) }
  }
  return (
    <Shell title={`Sửa câu · ${editing.ma_cau}`} onClose={onClose}>
      <Field label="Loại câu"><Seg options={LOAI_CAU.map((x) => x.value)} value={loai} onChange={setLoai} render={(v) => loaiLabel(v)} /></Field>
      <Field label="Nội dung (đề)"><textarea value={noiDung} onChange={(e) => setNoiDung(e.target.value)} className={ta} autoFocus /></Field>
      <Field label="Đáp án"><input value={dapAn} onChange={(e) => setDapAn(e.target.value)} className={inp} /></Field>
      <Field label="Lời giải"><textarea value={loiGiai} onChange={(e) => setLoiGiai(e.target.value)} className={ta} /></Field>
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
      <Actions onClose={onClose} onSave={save} disabled={!noiDung.trim() || saving} saving={saving} label="Lưu" />
    </Shell>
  )
}

// ── NHẬP KHO (AI) — 1 màn: nhập (manual JSON / auto ảnh) → preview gốc trái → Clone → biến thể phải ──
type ReviewItem = { noi_dung: string; dap_an: string; loi_giai: string; luaChon: string[] | null; anhDe: string | null; anhDapAn: string | null; approved: boolean; isGoc: boolean }
type UpFile = { name: string; mimeType: string; dataBase64: string; isImage: boolean }
const toCND = (r: ReviewItem) => ({ noi_dung: r.noi_dung.trim(), dap_an: r.dap_an.trim() || null, loi_giai: r.loi_giai.trim() || null, lua_chon: r.luaChon && r.luaChon.length ? r.luaChon : null, anh_de: r.anhDe, anh_dap_an: r.anhDapAn })
const toRI = (c: { noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon?: string[] | null; anh_de?: string | null; anh_dap_an?: string | null }, isGoc = false): ReviewItem =>
  ({ noi_dung: c.noi_dung, dap_an: c.dap_an ?? '', loi_giai: c.loi_giai ?? '', luaChon: c.lua_chon ?? null, anhDe: c.anh_de ?? null, anhDapAn: c.anh_dap_an ?? null, approved: true, isGoc })
const MODELS = [
  { value: 'gemini-2.5-flash-lite', label: 'Flash-Lite', sub: 'nhanh nhất' },
  { value: 'gemini-2.5-flash', label: 'Flash', sub: 'cân bằng (đề xuất)' },
  { value: 'gemini-2.5-pro', label: 'Pro', sub: 'chất lượng cao' },
]
function fileToBase64(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => { const s = String(r.result); res(s.slice(s.indexOf(',') + 1)) }
    r.onerror = rej
    r.readAsDataURL(f)
  })
}

function AiImportModal({ mode, dangChinh, tenDang, onClose, onSaved }: {
  mode: 'clone' | 'batch'; dangChinh: string; tenDang: string; onClose: () => void; onSaved: () => void
}) {
  const isClone = mode === 'clone'
  const [method, setMethod] = useState<'manual' | 'auto' | 'text'>(mode === 'clone' ? 'auto' : 'text')
  const [textInput, setTextInput] = useState('')
  const [loai, setLoai] = useState('tra_loi_ngan')
  const [ghiChu, setGhiChu] = useState('')
  const [soBienThe, setSoBienThe] = useState(5)
  const [model, setModel] = useState('gemini-2.5-flash')
  const [json, setJson] = useState('')
  const [files, setFiles] = useState<UpFile[]>([])
  const [goc, setGoc] = useState<ReviewItem | null>(null)
  const [items, setItems] = useState<ReviewItem[]>([])
  const [showVariants, setShowVariants] = useState(false)
  const [vi, setVi] = useState(0)  // biến thể đang xem
  const [parseErr, setParseErr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptDraft, setPromptDraft] = useState('')
  const [promptTouched, setPromptTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const buildPrompt = () => isClone
    ? buildClonePrompt({ soBienThe, ghiChu: ghiChu.trim(), tenDang, loaiCau: loai })
    : buildBatchPrompt({ ghiChu: ghiChu.trim(), tenDang, loaiCau: loai })
  const effPrompt = () => (promptTouched ? promptDraft : buildPrompt())

  function applyJson(text: string) {
    setJson(text)
    if (!text.trim()) { setGoc(null); setItems([]); setParseErr(null); setShowVariants(false); return }
    try {
      if (isClone) {
        const { goc, variants } = parseCloneJson(text)
        setGoc(toRI(goc, true)); setItems(variants.map((v) => toRI(v))); setShowVariants(false); setVi(0)
      } else {
        setGoc(null); setItems(parseBatchJson(text).map((v) => toRI(v))); setVi(0)
      }
      setParseErr(null)
    } catch (e: any) { setGoc(null); setItems([]); setParseErr(e.message ?? String(e)) }
  }

  async function addFiles(list: FileList | File[]) {
    const arr = Array.from(list).filter((f) => f.type.startsWith('image/') || f.type === 'application/pdf')
    const loaded = await Promise.all(arr.map(async (f) => ({ name: f.name, mimeType: f.type, dataBase64: await fileToBase64(f), isImage: f.type.startsWith('image/') })))
    setFiles((p) => [...p, ...loaded])
  }
  useEffect(() => {
    if (method !== 'auto') return
    const onPaste = (e: ClipboardEvent) => {
      const fs = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/') || f.type === 'application/pdf')
      if (fs.length) addFiles(fs)
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [method]) // eslint-disable-line

  async function copyPrompt() { try { await navigator.clipboard.writeText(effPrompt()); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* */ } }
  async function runAuto() {
    setError(null); setBusy(true)
    try { applyJson(await callGeminiJson(effPrompt(), { model, files: files.map((f) => ({ mimeType: f.mimeType, dataBase64: f.dataBase64 })) })) }
    catch (e: any) { setError(e.message ?? String(e)) } finally { setBusy(false) }
  }
  function parseText() {
    setParseErr(null)
    try {
      const cnds = parseStructuredText(textInput)
      if (!cnds.length) throw new Error('Không tách được câu — cần có "Câu N." và nhãn Đề bài/Đáp án/Lời giải chi tiết.')
      setGoc(null); setItems(cnds.map((c) => toRI(c))); setVi(0)
    } catch (e: any) { setParseErr(e.message ?? String(e)) }
  }
  async function save() {
    setSaving(true); setError(null)
    try {
      if (isClone) {
        if (!goc) throw new Error('Chưa có bài gốc.')
        const variants = items.filter((v) => v.approved && v.noi_dung.trim())
        const res = await saveCloneBatch({ dangChinh, loaiCau: loai, goc: toCND(goc), variants: variants.map(toCND) })
        alert(`Đã lưu: 1 gốc + ${res.soClone} biến thể.`)
      } else {
        const n = await saveCauBatch({ dangChinh, loaiCau: loai, items: items.filter((v) => v.approved && v.noi_dung.trim()).map(toCND) })
        alert(`Đã lưu ${n} câu.`)
      }
      onSaved()
    } catch (e: any) { setError(e.message ?? String(e)); setSaving(false) }
  }

  // Người tự chốt ranh giới câu (sửa khi AI tách lệch)
  const blank = (): ReviewItem => ({ noi_dung: '', dap_an: '', loi_giai: '', luaChon: null, anhDe: null, anhDapAn: null, approved: true, isGoc: false })
  const patchItem = (i: number, p: Partial<ReviewItem>) => setItems((a) => a.map((x, idx) => (idx === i ? { ...x, ...p } : x)))
  const removeItem = (i: number) => setItems((a) => a.filter((_, idx) => idx !== i))
  const insertAfter = (i: number) => setItems((a) => [...a.slice(0, i + 1), blank(), ...a.slice(i + 1)])
  const mergeUp = (i: number) => setItems((a) => {
    if (i <= 0) return a
    const p = a[i - 1], c = a[i]
    const join = (x: string, y: string, sep: string) => [x, y].filter((s) => s.trim()).join(sep)
    const merged: ReviewItem = { ...p, noi_dung: join(p.noi_dung, c.noi_dung, '\n'), dap_an: join(p.dap_an, c.dap_an, '; '), loi_giai: join(p.loi_giai, c.loi_giai, '\n') }
    return [...a.slice(0, i - 1), merged, ...a.slice(i + 1)]
  })

  const parsed = isClone ? !!goc : items.length > 0
  const nApproved = (isClone && goc ? 1 : 0) + items.filter((i) => i.approved).length
  const canSave = isClone ? !!goc : items.some((i) => i.approved)
  const bIdx = items.length ? Math.min(vi, items.length - 1) : 0 // câu đang xem (batch), clamp khi xoá/gộp

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-4 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-3.5">
          <h3 className="text-base font-semibold text-slate-900">{isClone ? '✨ Clone biến thể' : '📥 Nhập chuỗi câu'} · {tenDang}</h3>
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {!isClone && <MethodBtn active={method === 'text'} onClick={() => setMethod('text')}>Văn bản (cấu trúc)</MethodBtn>}
            <MethodBtn active={method === 'auto'} onClick={() => setMethod('auto')}>Tự động (ảnh → API)</MethodBtn>
            <MethodBtn active={method === 'manual'} onClick={() => setMethod('manual')}>Thủ công (dán JSON)</MethodBtn>
          </div>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-6">
          <div className="shrink-0">
          {/* ── Input strip — 1 hàng ngang ── */}
          <div className="flex flex-wrap items-end gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
            <Cell label="Loại câu">
              <select value={loai} onChange={(e) => setLoai(e.target.value)} className={sel}>
                {LOAI_CAU.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
              </select>
            </Cell>
            {isClone && (
              <Cell label="Số biến thể">
                <select value={soBienThe} onChange={(e) => setSoBienThe(Number(e.target.value))} className={sel}>
                  {[3, 5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </Cell>
            )}
            {method === 'auto' && (
              <Cell label="Model">
                <select value={model} onChange={(e) => setModel(e.target.value)} className={sel}>
                  {MODELS.map((m) => <option key={m.value} value={m.value}>{m.label} · {m.sub}</option>)}
                </select>
              </Cell>
            )}
            {method !== 'text' && (
              <Cell label="Ghi chú cho AI" className="min-w-[150px] flex-1">
                <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder={isClone ? 'vd: số chia hết cho 5' : 'vd: giữ thứ tự'} className={`${inp} text-[13px]`} />
              </Cell>
            )}
            {method === 'text' && <div className="flex-1" />}

            {method === 'manual' ? (
              <>
                <button onClick={copyPrompt} className="h-[34px] rounded-md bg-slate-800 px-3 text-[13px] font-medium text-white hover:bg-slate-700">📋 {copied ? 'Đã copy' : 'Copy prompt'}</button>
                <button onClick={() => { if (!showPrompt && !promptTouched) setPromptDraft(buildPrompt()); setShowPrompt((s) => !s) }} title="Sửa prompt" className="h-[34px] rounded-md border border-slate-200 bg-white px-2.5 text-[13px] font-medium text-slate-500 hover:text-indigo-700">✎</button>
                <Cell label="JSON từ Gemini" className="min-w-[200px] flex-1">
                  <input value={json} onChange={(e) => applyJson(e.target.value)} className={`${inp} font-mono text-[12px]`} placeholder='Dán JSON…' />
                </Cell>
              </>
            ) : method === 'auto' ? (
              <>
                <Cell label="Ảnh/PDF">
                  <button onClick={() => fileRef.current?.click()} title="Click chọn, hoặc Ctrl+V dán ảnh" className="h-[34px] rounded-md border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-600 hover:border-indigo-400">📎 Chọn / dán</button>
                  <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
                </Cell>
                {files.length > 0 && (
                  <div className="flex items-end gap-1.5 pb-0.5">
                    {files.map((f, i) => (
                      <div key={i} className="relative h-10 w-12 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-50">
                        {f.isImage ? <img src={`data:${f.mimeType};base64,${f.dataBase64}`} alt="" className="h-full w-full object-cover" />
                          : <div className="flex h-full items-center justify-center text-[9px] font-medium text-slate-500">PDF</div>}
                        <button onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded bg-white/90 text-[10px] text-rose-600">✕</button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={runAuto} disabled={!files.length || busy} className="h-[34px] rounded-md bg-indigo-600 px-4 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? '⏳ Đang gọi…' : '🪄 Tạo bảng AI'}</button>
              </>
            ) : null}
          </div>
          {method === 'text' && (
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[12px] text-slate-400">Dán văn bản theo mẫu (Câu N. · Đề bài: · Đáp án: · Lời giải chi tiết:) — tách bằng code, không cần AI.</span>
                <button onClick={() => setTextInput(SAMPLE_TEXT)} className="text-[12px] font-medium text-indigo-600 hover:underline">Chèn mẫu</button>
              </div>
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} className={`${inp} h-32 font-mono text-[12px] leading-relaxed`} placeholder={'Câu 1.\nĐề bài: …\nĐáp án: …\nLời giải chi tiết: …'} />
              <button onClick={parseText} disabled={!textInput.trim()} className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">✂ Tách câu →</button>
            </div>
          )}
          {method === 'manual' && showPrompt && (
            <textarea value={promptDraft} onChange={(e) => { setPromptDraft(e.target.value); setPromptTouched(true) }} className={`${inp} mt-2 h-40 font-mono text-[12px] leading-relaxed`} />
          )}
          {parseErr && <p className="mt-1 text-[12px] text-amber-600">⚠ {parseErr}</p>}
          </div>

          {/* ── Preview / duyệt — chiếm hết chiều cao còn lại ── */}
          <div className="mt-1 flex min-h-0 flex-1 flex-col">
          {!parsed ? (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
              {method === 'text' ? 'Dán văn bản có cấu trúc rồi bấm “Tách câu”.' : method === 'manual' ? 'Dán JSON ở trên để xem trước.' : 'Chọn ảnh/PDF rồi “Tạo bảng AI”.'}
            </div>
          ) : isClone ? (
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-6">
              <div className="flex min-h-0 flex-col">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-semibold text-indigo-700" title="Dạng">📁 {tenDang}</span>
                  <span className="text-[13px] font-bold uppercase tracking-wide text-slate-700">Bài gốc</span>
                </div>
                <div className="min-h-0 flex-1">{goc && <CauEditor item={goc} fill onChange={(p) => setGoc((g) => g ? { ...g, ...p } : g)} />}</div>
              </div>
              <div className="flex min-h-0 flex-col">
                {showVariants ? (
                  <>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-bold uppercase tracking-wide text-slate-700">Biến thể {vi + 1}/{items.length}</span>
                        <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                          <input type="checkbox" checked={items[vi]?.approved ?? false} onChange={(e) => setItems((a) => a.map((x, idx) => idx === vi ? { ...x, approved: e.target.checked } : x))} />lấy câu này
                        </label>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setVi((v) => Math.max(0, v - 1))} disabled={vi === 0} className="rounded-md border border-slate-200 px-2.5 py-1 text-[13px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-30">← Trước</button>
                        <button onClick={() => setVi((v) => Math.min(items.length - 1, v + 1))} disabled={vi >= items.length - 1} className="rounded-md border border-slate-200 px-2.5 py-1 text-[13px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-30">Sau →</button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1">
                      {items[vi] && <CauEditor item={items[vi]} fill onChange={(p) => setItems((a) => a.map((x, idx) => idx === vi ? { ...x, ...p } : x))} />}
                    </div>
                  </>
                ) : (
                  <button onClick={() => setShowVariants(true)} className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 text-indigo-700 transition hover:bg-indigo-50">
                    <span className="text-3xl">✨</span>
                    <span className="mt-2 text-sm font-semibold">Clone — bày {items.length} biến thể</span>
                    <span className="text-[12px] text-indigo-400">bấm để duyệt & sửa từng câu →</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Pager 1-câu: chỉ hiện câu đang xem + Trước/Sau */}
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-semibold text-indigo-700" title="Dạng">📁 {tenDang}</span>
                  <span className="text-[13px] font-bold uppercase tracking-wide text-slate-700">Câu {bIdx + 1}/{items.length}</span>
                  <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                    <input type="checkbox" checked={items[bIdx]?.approved ?? false} onChange={(e) => patchItem(bIdx, { approved: e.target.checked })} /> lấy câu này
                  </label>
                  <span className="text-[12px] text-slate-400">· <b className="text-slate-600">{nApproved}</b> sẽ lưu</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setVi(bIdx - 1)} disabled={bIdx === 0} className="rounded-md border border-slate-200 px-2.5 py-1 text-[13px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-30">← Trước</button>
                  <button onClick={() => setVi(bIdx + 1)} disabled={bIdx >= items.length - 1} className="rounded-md border border-slate-200 px-2.5 py-1 text-[13px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-30">Sau →</button>
                </div>
              </div>
              <div className="min-h-0 flex-1">
                {items[bIdx] && <CauEditor item={items[bIdx]} fill onChange={(p) => patchItem(bIdx, p)} />}
              </div>
              {/* Sửa ranh giới câu khi AI tách lệch */}
              <div className="mt-2 flex shrink-0 flex-wrap items-center gap-3 px-1 text-[12px] font-medium text-slate-400">
                {bIdx > 0 && <button onClick={() => { mergeUp(bIdx); setVi(bIdx - 1) }} title="Nhập câu này vào câu trên" className="hover:text-indigo-600">⬆ Gộp vào câu trên</button>}
                <button onClick={() => { insertAfter(bIdx); setVi(bIdx + 1) }} title="Chèn 1 câu trống ngay dưới (tách tay)" className="hover:text-indigo-600">+ Tách câu dưới</button>
                <button onClick={() => { setItems((a) => [...a, blank()]); setVi(items.length) }} className="hover:text-indigo-600">+ Thêm câu cuối</button>
                <button onClick={() => removeItem(bIdx)} className="ml-auto hover:text-rose-600">Xoá câu này</button>
              </div>
            </div>
          )}
          {error && <p className="mt-2 shrink-0 text-xs text-rose-600">{error}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
          {parsed && <span className="mr-auto text-[13px] text-slate-500"><b>{nApproved}</b> câu sẽ lưu</span>}
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button onClick={save} disabled={!canSave || saving} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{saving ? 'Đang lưu…' : `Lưu ${nApproved} câu`}</button>
        </div>
      </div>
    </div>
  )
}

// Card preview + sửa trực tiếp 1 câu (đề · đáp án · đáp án chi tiết)
function CauEditor({ item, label, onChange, onToggle, fill }: {
  item: ReviewItem; label?: string; onChange: (p: Partial<ReviewItem>) => void; onToggle?: (v: boolean) => void; fill?: boolean
}) {
  const [edit, setEdit] = useState(false)
  const dim = onToggle && !item.approved
  const cls = `rounded-xl border p-4 ${item.isGoc ? 'border-emerald-200 bg-emerald-50/40' : dim ? 'border-slate-200 bg-slate-50 opacity-60' : 'border-slate-200 bg-white'}`
  const lbl = 'mb-1 block text-[13px] font-bold uppercase tracking-wide text-slate-700'
  const hasOpts = !!(item.luaChon && item.luaChon.length)
  const letterOf = (i: number) => String.fromCharCode(65 + i)
  const isCorrect = (i: number) => item.dap_an.trim().toUpperCase() === letterOf(i)
  const setOpt = (i: number, v: string) => { const arr = [...(item.luaChon ?? [])]; arr[i] = v; onChange({ luaChon: arr }) }
  const optsEdit = (
    <div>
      <label className={lbl}>Phương án (bấm chữ cái = đáp án đúng)</label>
      <div className="grid grid-cols-2 gap-2">
        {(item.luaChon ?? []).map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button onClick={() => onChange({ dap_an: letterOf(i) })} className={`h-8 w-8 shrink-0 rounded-md text-[13px] font-bold ${isCorrect(i) ? 'bg-emerald-500 text-white' : 'border border-slate-300 text-slate-500 hover:border-emerald-400'}`}>{letterOf(i)}</button>
            <input value={opt} onChange={(e) => setOpt(i, e.target.value)} className={inp} />
          </div>
        ))}
      </div>
    </div>
  )

  const header = (
    <div className="mb-1 flex items-center justify-between gap-2">
      {onToggle
        ? <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600"><input type="checkbox" checked={item.approved} onChange={(e) => onToggle(e.target.checked)} />{label}</label>
        : <span className="text-[13px] font-bold uppercase tracking-wide text-slate-700">{label ?? ''}</span>}
      <button onClick={() => setEdit((v) => !v)} className="rounded-md px-2 py-0.5 text-[12px] font-medium text-slate-400 hover:bg-slate-100 hover:text-indigo-600">{edit ? '✓ Xong' : '✎ Sửa'}</button>
    </div>
  )

  if (!edit) {
    const box = 'rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-[16px] leading-loose'
    const ilbl = 'mr-2 text-[11px] font-bold uppercase tracking-wide text-slate-400'
    const deBox = (
      <div className="flex items-start gap-2">
        <div className={`${box} min-w-0 flex-1 text-slate-800`}><span className={ilbl}>Đề</span><MathText>{item.noi_dung}</MathText></div>
        <ImageSlot url={item.anhDe} label="Ảnh đề" onChange={(v) => onChange({ anhDe: v })} />
      </div>
    )
    const dapAn = hasOpts ? (
      <div>
        <div className="mb-1 text-[12px] font-bold uppercase tracking-wide text-slate-600">Phương án — đúng: <span className="text-emerald-700">{item.dap_an || '?'}</span></div>
        <div className="grid grid-cols-2 gap-2">
          {item.luaChon!.map((opt, i) => (
            <div key={i} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-[16px] leading-relaxed ${isCorrect(i) ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50/50'}`}>
              <span className={`font-bold ${isCorrect(i) ? 'text-emerald-700' : 'text-slate-500'}`}>{letterOf(i)}.</span>
              <span className="min-w-0 flex-1 text-slate-800"><MathText>{opt}</MathText></span>
              {isCorrect(i) && <span className="text-emerald-600">✓</span>}
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className={`${box} text-slate-800`}><span className={ilbl}>Đáp án</span><MathText>{item.dap_an || '—'}</MathText></div>
    )
    const lgImg = <ImageSlot url={item.anhDapAn} label="Ảnh đáp án" onChange={(v) => onChange({ anhDapAn: v })} />
    // FILL: trái = đề + đáp án · phải = lời giải chi tiết (tận dụng bề ngang)
    if (fill) return (
      <div className={`flex h-full flex-col ${cls}`}>
        {header}
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
          <div className="flex min-h-0 flex-col gap-2 overflow-auto pr-1">{deBox}{dapAn}</div>
          <div className="flex min-h-0 flex-1 items-start gap-2">
            <div className={`${box} h-full min-w-0 flex-1 overflow-auto text-slate-700`}><span className={ilbl}>Lời giải</span><MathText>{item.loi_giai || '—'}</MathText></div>
            {lgImg}
          </div>
        </div>
      </div>
    )
    return (
      <div className={cls}>
        {header}{deBox}
        <div className="mt-2">{dapAn}</div>
        <div className="mt-2 flex items-start gap-2">
          <div className={`${box} min-w-0 flex-1 text-slate-700`}><span className={ilbl}>Lời giải</span><MathText>{item.loi_giai || '—'}</MathText></div>
          {lgImg}
        </div>
      </div>
    )
  }

  // EDIT mode
  if (fill) {
    return (
      <div className={`flex h-full flex-col ${cls}`}>
        {header}
        <div className="flex min-h-0 flex-1 flex-col gap-2.5">
          <div className="shrink-0">
            <label className={lbl}>Đề</label>
            <div className="flex items-start gap-3">
              <AutoTextarea value={item.noi_dung} onChange={(v) => onChange({ noi_dung: v })} maxPx={200} className={`${inp} flex-1 resize-none leading-relaxed`} />
              <ImageSlot url={item.anhDe} label="Ảnh đề" onChange={(v) => onChange({ anhDe: v })} />
            </div>
          </div>
          <div className="shrink-0">
            {hasOpts ? optsEdit : (<><label className={lbl}>Đáp án</label><input value={item.dap_an} onChange={(e) => onChange({ dap_an: e.target.value })} className={inp} /></>)}
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <label className={lbl}>Đáp án chi tiết</label>
            <div className="flex min-h-0 flex-1 gap-3">
              <textarea value={item.loi_giai} onChange={(e) => onChange({ loi_giai: e.target.value })} className={`${inp} min-h-0 flex-1 resize-none leading-relaxed`} />
              <ImageSlot url={item.anhDapAn} label="Ảnh đáp án" onChange={(v) => onChange({ anhDapAn: v })} />
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={cls}>
      {header}
      <label className={lbl}>Đề</label>
      <textarea value={item.noi_dung} onChange={(e) => onChange({ noi_dung: e.target.value })} className={`${ta} min-h-[80px]`} />
      {hasOpts ? (
        <>
          <div className="mt-2">{optsEdit}</div>
          <div className="mt-2"><label className={lbl}>Đáp án chi tiết</label><textarea value={item.loi_giai} onChange={(e) => onChange({ loi_giai: e.target.value })} className={`${ta} min-h-[44px]`} /></div>
        </>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div><label className={lbl}>Đáp án</label><input value={item.dap_an} onChange={(e) => onChange({ dap_an: e.target.value })} className={inp} /></div>
          <div><label className={lbl}>Đáp án chi tiết</label><textarea value={item.loi_giai} onChange={(e) => onChange({ loi_giai: e.target.value })} className={`${ta} min-h-[44px]`} /></div>
        </div>
      )}
    </div>
  )
}

function Cell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <span className="mb-1 text-[12px] font-bold uppercase tracking-wide text-slate-700">{label}</span>
      {children}
    </div>
  )
}

function MethodBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{children}</button>
  )
}

// Textarea tự co cao theo nội dung (đề ngắn → thấp), tối đa maxPx rồi cuộn.
function AutoTextarea({ value, onChange, className, maxPx }: { value: string; onChange: (v: string) => void; className?: string; maxPx?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, maxPx ?? 100000)}px`
  }, [value, maxPx])
  return <textarea ref={ref} rows={1} value={value} onChange={(e) => onChange(e.target.value)} className={className} />
}

// Ảnh đề/đáp án: click chọn file HOẶC bấm vào ô rồi Ctrl+V dán ảnh clipboard. Lưu data-URL base64.
function ImageSlot({ url, label, onChange }: { url: string | null; label: string; onChange: (v: string | null) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const load = (f: File | null | undefined) => {
    if (!f || !f.type.startsWith('image/')) return
    const r = new FileReader()
    r.onload = () => onChange(String(r.result)) // data:image/...;base64,...
    r.readAsDataURL(f)
  }
  const onPaste = (e: React.ClipboardEvent) => {
    const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith('image/'))
    if (f) { e.preventDefault(); load(f) }
  }
  if (url) return (
    <div className="group/img relative shrink-0 self-start">
      <img src={url} alt={label} className="h-28 w-36 rounded-lg border border-slate-200 bg-slate-50 object-contain" />
      <button onClick={() => onChange(null)} title="Gỡ ảnh" className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[12px] text-rose-500 shadow hover:bg-rose-50">✕</button>
    </div>
  )
  return (
    <button type="button" onClick={() => ref.current?.click()} onPaste={onPaste}
      title={`${label} — click chọn ảnh, hoặc bấm vào đây rồi Ctrl+V dán ảnh`}
      className="flex h-16 w-20 shrink-0 flex-col items-center justify-center self-start rounded-lg border border-dashed border-slate-300 text-slate-400 transition hover:border-indigo-400 hover:text-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
      <span className="text-lg leading-none">🖼</span>
      <span className="mt-0.5 text-[9px] font-medium">dán / chọn</span>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => { load(e.target.files?.[0]); e.target.value = '' }} />
    </button>
  )
}
