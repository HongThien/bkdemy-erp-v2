// Panel ĐÚNG/SAI — CON của 1 CHUYÊN ĐỀ (mở từ header chuyên đề trong BanDo, cạnh "Lý thuyết chung").
// Câu = 1 đề chung + 4 mệnh đề, MỖI mệnh đề 1 dạng riêng (chọn dạng bất kỳ trong khối). Lưu ở dai_cau_hoi (menh_de jsonb).
import { useEffect, useMemo, useRef, useState } from 'react'
import { listDungSaiByDang, createCauDungSai, updateCau, deleteCau, uploadKhoImage, callGeminiJson, buildDungSaiIngestPrompt, parseDungSaiJson, DUNGSAI_SCHEMA, type CauHoi, type MenhDe, type MapRow } from '../../lib/kho/api'
import { inp, MathText } from './ui'
import SearchSelect from '../../components/SearchSelect'
import { ImgInsertBar, insertImageAtCursor } from '../../components/ImgInsertBar'

const ABCD = ['a', 'b', 'c', 'd']
const blankMD = (): MenhDe => ({ noi_dung: '', dap_an: 'D', ma_dang: '', loi_giai: '' })
const fileToBase64 = (f: File): Promise<string> => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] ?? ''); r.onerror = rej; r.readAsDataURL(f) })

// Panel scoped 1 chuyên đề. allDang = MapRow[] toàn KHỐI (cho picker dạng tự do). dangThisT2 = dạng của chuyên đề này.
export default function DungSaiPanel({ t2Ma, t2Ten, tbl, allDang, onClose }: {
  t2Ma: string; t2Ten: string; tbl: string; allDang: MapRow[]; onClose: () => void
}) {
  const [caus, setCaus] = useState<CauHoi[]>([])
  const [editing, setEditing] = useState<CauHoi | 'new' | null>(null)
  const [importing, setImporting] = useState(false)
  const [loading, setLoading] = useState(true)

  const dangInfo = useMemo(() => new Map(allDang.map((m) => [m.leafMa, m])), [allDang])
  const tenDang = (ma: string) => dangInfo.get(ma)?.leafTen ?? ma
  const dangThisT2 = useMemo(() => allDang.filter((m) => m.t2Ma === t2Ma).map((m) => m.leafMa), [allDang, t2Ma])
  const dangOpts = useMemo(() => allDang.map((m) => ({ id: m.leafMa, label: m.leafTen, sub: `${m.t1Ten} · ${m.t2Ten}` })), [allDang])

  async function reload() {
    setLoading(true)
    try { setCaus(await listDungSaiByDang(dangThisT2, tbl)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [t2Ma]) // eslint-disable-line

  async function onDelete(c: CauHoi) {
    if (!confirm('Xoá câu đúng/sai này?')) return
    try { await deleteCau(c.ma_cau, tbl); await reload() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <button onClick={onClose} className="text-[14px] text-slate-500 hover:text-indigo-600">← Chuyên đề</button>
        <span className="text-[15px] font-semibold text-slate-800">Đúng/Sai · {t2Ten}</span>
        <span className="text-[12px] text-slate-400">{caus.length} câu</span>
        <button onClick={() => setImporting(true)} className="ml-auto rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-[13px] font-medium text-indigo-700 hover:bg-indigo-100" title="Đưa PDF/ảnh → AI tự bóc đề + 4 mệnh đề + đáp án; bạn chỉ sửa đáp án + gán dạng">📥 Nhập từ PDF/ảnh (AI)</button>
        <button onClick={() => setEditing('new')} className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Thêm thủ công</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[1000px]">
          {loading ? <div className="text-[14px] text-slate-400">Đang tải…</div>
            : caus.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center text-[13px] text-slate-400">Chưa có câu Đúng/Sai nào trong chuyên đề này. Bấm "+ Thêm".</div>
            : (
              <div className="space-y-3">
                {caus.map((c) => {
                  const chuaCauTruc = !c.menh_de || c.menh_de.length === 0
                  return (
                    <div key={c.ma_cau} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-2 flex items-start gap-2">
                        <div className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-800"><MathText>{c.noi_dung}</MathText></div>
                        <div className="flex shrink-0 gap-1.5">
                          <button onClick={() => setEditing(c)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] text-slate-500 hover:border-indigo-300 hover:text-indigo-700">Sửa</button>
                          <button onClick={() => onDelete(c)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                        </div>
                      </div>
                      {c.anh_de && <img src={c.anh_de} alt="" className="mb-2 max-h-48 rounded-lg border border-slate-100" />}
                      {chuaCauTruc ? <div className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-700">⚠ Câu cũ chưa cấu trúc 4 mệnh đề — bấm Sửa để tách mệnh đề + gán dạng.</div> : (
                        <div className="space-y-1.5">
                          {c.menh_de!.map((md, i) => (
                            <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
                              <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[12px] font-bold text-white ${md.dap_an === 'D' ? 'bg-emerald-500' : 'bg-rose-500'}`}>{md.dap_an}</span>
                              <span className="shrink-0 text-[13px] font-semibold text-slate-500">{ABCD[i]})</span>
                              <span className="min-w-0 flex-1 text-[13px] text-slate-700"><MathText>{md.noi_dung}</MathText></span>
                              <span className="shrink-0 rounded bg-violet-100 px-1.5 py-0.5 text-[11px] font-medium text-violet-600" title={md.ma_dang}>{tenDang(md.ma_dang)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
        </div>
      </div>

      {editing && (
        <DungSaiModal cau={editing === 'new' ? null : editing} dangChinhMoi={dangThisT2[0] ?? null} tbl={tbl} dangOpts={dangOpts}
          onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await reload() }} />
      )}
      {importing && (
        <DungSaiImportModal dangChinh={dangThisT2[0] ?? null} tbl={tbl} dangOpts={dangOpts}
          onClose={() => setImporting(false)} onSaved={async () => { setImporting(false); await reload() }} />
      )}
    </div>
  )
}

// ── NHẬP AI: PDF/ảnh → Gemini bóc đề + 4 mệnh đề + Đ/S + lời giải → người sửa đáp án + gán DẠNG → lưu loạt ──
type RevMD = { noi_dung: string; dap_an: 'D' | 'S'; loi_giai: string | null; ma_dang: string }
type RevCau = { de_chung: string; loi_giai: string | null; menh_de: RevMD[] }

function DungSaiImportModal({ dangChinh, tbl, dangOpts, onClose, onSaved }: {
  dangChinh: string | null; tbl: string; dangOpts: { id: string; label: string; sub: string }[]; onClose: () => void; onSaved: () => void
}) {
  const [files, setFiles] = useState<{ name: string; mimeType: string; dataBase64: string }[]>([])
  const [items, setItems] = useState<RevCau[]>([])
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function addFiles(list: FileList | null) {
    if (!list) return
    const arr = Array.from(list).filter((f) => f.type.startsWith('image/') || f.type === 'application/pdf')
    const loaded = await Promise.all(arr.map(async (f) => ({ name: f.name, mimeType: f.type, dataBase64: await fileToBase64(f) })))
    setFiles((p) => [...p, ...loaded])
  }
  async function run() {
    if (!files.length) { alert('Chọn PDF/ảnh trước'); return }
    setErr(null); setBusy(true)
    try {
      const text = await callGeminiJson(buildDungSaiIngestPrompt(), { schema: DUNGSAI_SCHEMA, think: 0, files: files.map((f) => ({ mimeType: f.mimeType, dataBase64: f.dataBase64 })) })
      const parsed = parseDungSaiJson(text)
      const rev: RevCau[] = parsed.map((c) => {
        const md = c.menh_de.map((m) => ({ ...m, ma_dang: '' }))
        while (md.length < 4) md.push({ noi_dung: '', dap_an: 'D', loi_giai: null, ma_dang: '' })
        return { de_chung: c.de_chung, loi_giai: c.loi_giai, menh_de: md.slice(0, 4) }
      })
      setItems(rev)
      if (!rev.length) setErr('AI không tách được câu nào — thử file nét hơn.')
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  const setCau = (ci: number, p: Partial<RevCau>) => setItems((s) => s.map((c, i) => (i === ci ? { ...c, ...p } : c)))
  const setMd = (ci: number, mi: number, p: Partial<RevMD>) => setItems((s) => s.map((c, i) => (i === ci ? { ...c, menh_de: c.menh_de.map((m, j) => (j === mi ? { ...m, ...p } : m)) } : c)))
  const removeCau = (ci: number) => setItems((s) => s.filter((_, i) => i !== ci))
  const cauOk = (c: RevCau) => c.de_chung.trim() && c.menh_de.every((m) => m.noi_dung.trim() && m.ma_dang)
  const okCount = items.filter(cauOk).length

  async function saveAll() {
    if (!dangChinh) { alert('Chuyên đề này chưa có dạng nào — tạo dạng trước.'); return }
    const ready = items.filter(cauOk)
    if (!ready.length) { alert('Chưa câu nào đủ điều kiện (mỗi mệnh đề cần gán dạng).'); return }
    setSaving(true)
    try {
      for (const c of ready) {
        await createCauDungSai({ dang_chinh: dangChinh, noi_dung: c.de_chung.trim(), loi_giai: c.loi_giai?.trim() || null,
          menh_de: c.menh_de.map((m) => ({ noi_dung: m.noi_dung.trim(), dap_an: m.dap_an, ma_dang: m.ma_dang, loi_giai: m.loi_giai?.trim() || null })) }, tbl)
      }
      onSaved()
    } catch (e: any) { alert(e.message ?? String(e)); setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex max-h-[94vh] w-full max-w-[960px] flex-col rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
          <span className="text-[16px] font-semibold text-slate-800">Nhập câu Đúng/Sai từ PDF/ảnh (AI)</span>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {items.length === 0 ? (
            <div className="space-y-3">
              <p className="text-[13px] text-slate-500">Chọn PDF/ảnh chứa câu đúng/sai (kèm đáp án + lời giải nếu có). AI sẽ tự bóc đề + 4 mệnh đề + Đ/S; bạn chỉ <b>sửa đáp án nếu sai</b> và <b>gán dạng cho mỗi mệnh đề</b>.</p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-600 hover:border-indigo-400">📎 Chọn PDF/ảnh<input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} /></label>
              {files.length > 0 && <div className="flex flex-wrap gap-2">{files.map((f, i) => <span key={i} className="rounded bg-slate-100 px-2 py-1 text-[12px] text-slate-600">{f.mimeType === 'application/pdf' ? '📄' : '🖼'} {f.name}<button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="ml-1.5 text-slate-400 hover:text-rose-600">✕</button></span>)}</div>}
              {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{err}</div>}
              <button onClick={run} disabled={busy || !files.length} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'AI đang bóc…' : '⚡ Tạo bảng AI'}</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[13px] text-slate-500"><b className="text-slate-700">{items.length}</b> câu · <b className="text-emerald-600">{okCount}</b> đủ điều kiện (đã gán dạng). <button onClick={() => { setItems([]); setErr(null) }} className="ml-auto text-[12px] text-indigo-600 hover:underline">↺ Nhập file khác</button></div>
              {items.map((c, ci) => (
                <div key={ci} className={`rounded-2xl border p-4 ${cauOk(c) ? 'border-emerald-200' : 'border-slate-200'} bg-white shadow-sm`}>
                  <div className="mb-2 flex items-start gap-2">
                    <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-[12px] font-bold text-slate-600">Câu {ci + 1}</span>
                    <textarea value={c.de_chung} onChange={(e) => setCau(ci, { de_chung: e.target.value })} className={`${inp} min-h-0 h-16 flex-1 leading-relaxed`} placeholder="Đề chung" />
                    <button onClick={() => removeCau(ci)} className="shrink-0 text-[12px] text-slate-400 hover:text-rose-600">Bỏ</button>
                  </div>
                  {c.de_chung.trim() && <div className="mb-2 rounded bg-slate-50 px-2.5 py-1.5 text-[13px] text-slate-700"><MathText>{c.de_chung}</MathText></div>}
                  <div className="space-y-2">
                    {c.menh_de.map((m, mi) => (
                      <div key={mi} className="rounded-xl border border-slate-200 p-2.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[12px] font-bold text-slate-600">{ABCD[mi]})</span>
                          <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 text-[12px]">
                            <button onClick={() => setMd(ci, mi, { dap_an: 'D' })} className={`px-2.5 py-1 font-medium ${m.dap_an === 'D' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>Đúng</button>
                            <button onClick={() => setMd(ci, mi, { dap_an: 'S' })} className={`px-2.5 py-1 font-medium ${m.dap_an === 'S' ? 'bg-rose-500 text-white' : 'text-slate-500'}`}>Sai</button>
                          </div>
                          <div className="min-w-[200px] flex-1">
                            <SearchSelect value={m.ma_dang || null} onChange={(v) => setMd(ci, mi, { ma_dang: v ?? '' })} options={dangOpts} placeholder="⚠ Gán dạng cho mệnh đề…" />
                          </div>
                        </div>
                        <textarea value={m.noi_dung} onChange={(e) => setMd(ci, mi, { noi_dung: e.target.value })} className={`${inp} mt-2 min-h-0 h-12 leading-relaxed`} placeholder={`Mệnh đề ${ABCD[mi]}`} />
                        {m.noi_dung.trim() && <div className="mt-1 rounded bg-slate-50 px-2 py-1 text-[12px] text-slate-600"><MathText>{m.noi_dung}</MathText></div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2 border-t border-slate-200 px-5 py-3">
            <span className="text-[12px] text-slate-400">Chỉ lưu câu đã gán đủ dạng 4 mệnh đề.</span>
            <button onClick={onClose} className="ml-auto rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
            <button onClick={saveAll} disabled={saving || okCount === 0} className="rounded-lg bg-emerald-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-emerald-500 disabled:opacity-50">{saving ? 'Đang lưu…' : `Lưu ${okCount} câu`}</button>
          </div>
        )}
      </div>
    </div>
  )
}

export function DungSaiModal({ cau, dangChinhMoi, tbl, dangOpts, onClose, onSaved }: {
  cau: CauHoi | null; dangChinhMoi: string | null; tbl: string
  dangOpts: { id: string; label: string; sub: string }[]; onClose: () => void; onSaved: () => void
}) {
  const edit = !!cau
  const [noiDung, setNoiDung] = useState(cau?.noi_dung ?? '')
  const [loiGiai, setLoiGiai] = useState(cau?.loi_giai ?? '')
  const [anhDe, setAnhDe] = useState<string | null>(cau?.anh_de ?? null)
  const [md, setMd] = useState<MenhDe[]>(() => {
    const base: MenhDe[] = cau?.menh_de?.length ? cau.menh_de.map((x) => ({ ...x, loi_giai: x.loi_giai ?? '' })) : []
    while (base.length < 4) base.push(blankMD())
    return base.slice(0, 4)
  })
  const [busy, setBusy] = useState(false)
  const lgRef = useRef<HTMLTextAreaElement>(null)
  const setMdi = (i: number, p: Partial<MenhDe>) => setMd((s) => s.map((x, j) => (j === i ? { ...x, ...p } : x)))

  async function uploadAnh(file: File) { try { setAnhDe(await uploadKhoImage(file)) } catch (e: any) { alert(e.message ?? String(e)) } }
  async function save() {
    if (!noiDung.trim()) { alert('Nhập đề chung'); return }
    if (md.some((x) => !x.noi_dung.trim() || !x.ma_dang)) { alert('Mỗi mệnh đề cần nội dung + chọn dạng'); return }
    setBusy(true)
    const menh_de = md.map((x) => ({ noi_dung: x.noi_dung.trim(), dap_an: x.dap_an, ma_dang: x.ma_dang, loi_giai: x.loi_giai?.trim() || null }))
    try {
      if (edit) await updateCau(cau!.ma_cau, { noi_dung: noiDung.trim(), loi_giai: loiGiai.trim() || null, menh_de, anh_de: anhDe }, tbl)
      else {
        if (!dangChinhMoi) { alert('Chuyên đề này chưa có dạng nào — tạo dạng trước rồi mới thêm câu Đúng/Sai.'); setBusy(false); return }
        await createCauDungSai({ dang_chinh: dangChinhMoi, noi_dung: noiDung.trim(), loi_giai: loiGiai.trim() || null, menh_de, anh_de: anhDe }, tbl)
      }
      onSaved()
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex max-h-[92vh] w-full max-w-[860px] flex-col rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
          <span className="text-[16px] font-semibold text-slate-800">{edit ? 'Sửa câu Đúng/Sai' : 'Thêm câu Đúng/Sai'}</span>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-auto p-5">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-600">Đề chung *</label>
            <textarea value={noiDung} onChange={(e) => setNoiDung(e.target.value)} className={`${inp} h-24 leading-relaxed`} placeholder="Đề chung của câu (LaTeX trong $…$)" />
            {noiDung.trim() && <div className="mt-1.5 rounded-lg bg-slate-50 px-3 py-2 text-[14px] text-slate-700"><MathText>{noiDung}</MathText></div>}
            <div className="mt-1.5 flex items-center gap-2">
              <label className="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1 text-[12px] text-slate-500 hover:border-indigo-300">📎 Ảnh đề<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadAnh(e.target.files[0])} /></label>
              {anhDe && <><img src={anhDe} alt="" className="h-10 rounded border border-slate-200" /><button onClick={() => setAnhDe(null)} className="text-[12px] text-rose-500 hover:underline">bỏ ảnh</button></>}
            </div>
          </div>

          <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">4 mệnh đề — mỗi mệnh đề 1 dạng riêng</div>
          {md.map((m, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-[13px] font-bold text-slate-600">{ABCD[i]})</span>
                <div className="ml-auto inline-flex overflow-hidden rounded-lg border border-slate-200 text-[12px]">
                  <button onClick={() => setMdi(i, { dap_an: 'D' })} className={`px-3 py-1 font-medium ${m.dap_an === 'D' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>Đúng</button>
                  <button onClick={() => setMdi(i, { dap_an: 'S' })} className={`px-3 py-1 font-medium ${m.dap_an === 'S' ? 'bg-rose-500 text-white' : 'text-slate-500'}`}>Sai</button>
                </div>
              </div>
              <textarea value={m.noi_dung} onChange={(e) => setMdi(i, { noi_dung: e.target.value })} className={`${inp} h-16 leading-relaxed`} placeholder={`Mệnh đề ${ABCD[i]}`} />
              {m.noi_dung.trim() && <div className="mt-1 rounded bg-slate-50 px-2.5 py-1.5 text-[13px] text-slate-700"><MathText>{m.noi_dung}</MathText></div>}
              <div className="mt-2">
                <label className="mb-1 block text-[12px] font-medium text-slate-500">Dạng của mệnh đề này *</label>
                <SearchSelect value={m.ma_dang || null} onChange={(v) => setMdi(i, { ma_dang: v ?? '' })} options={dangOpts} placeholder="Chọn dạng (bất kỳ chuyên đề)…" />
              </div>
            </div>
          ))}

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[13px] font-medium text-slate-600">Lời giải chung (tuỳ)</label>
              <ImgInsertBar taRef={lgRef} value={loiGiai} onChange={setLoiGiai} />
            </div>
            <textarea ref={lgRef} value={loiGiai} onChange={(e) => setLoiGiai(e.target.value)}
              onPaste={(e) => { const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith('image/')); if (f) { e.preventDefault(); void insertImageAtCursor(f, lgRef, loiGiai, setLoiGiai).catch((err: any) => alert('Upload ảnh lỗi: ' + (err?.message ?? err))) } }}
              className={`${inp} h-20 leading-relaxed`} />
            {loiGiai.trim() && <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-[14px] text-slate-700"><MathText>{loiGiai}</MathText></div>}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={save} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang lưu…' : edit ? 'Lưu' : 'Tạo câu'}</button>
        </div>
      </div>
    </div>
  )
}
