// Tab "Điền ô AI" (spec-dien-o.md §0b, D2) — duyệt form ĐIỀN Ô cho chứng minh hình: lời giải với 1–4 ô trống, mỗi ô 4 phương án.
// Thẻ: đề + hình + các bước (ô tô cam) + phương án (xanh = đúng; sai kèm nhãn lỗi E0x + vì sao sai — HS không thấy).
// Hành động D2: Duyệt · Từ chối (lý do bắt buộc → kho rác, sinh lại). Sửa tại chỗ chưa có (D3): ô chọn sai thì từ chối + ghi rõ.
import { useEffect, useRef, useState } from 'react'
import { listFormDienChoDuyet, duyetFormDien, tuChoiFormDien, listHinhLyDo, type FormDienChoDuyet, type HinhLyDo } from '../../lib/kho/api'
import { MathText } from '../kho/ui'
import { myNhanSuId } from '../../lib/giaoviec'

const CHU = ['A', 'B', 'C', 'D']
// Cắt key khỏi bước để hiện ô: key trong $…$ → \boxed{?} (KaTeX vẽ ô), key chữ thường → ⟦ ? ⟧
function buocCoO(text: string, key: string): string {
  const i = text.indexOf(key); if (i < 0) return text
  const trongMath = (text.slice(0, i).match(/\$/g) || []).length % 2 === 1
  return text.slice(0, i) + (trongMath ? '\\boxed{\\;?\\;}' : '⟦ ? ⟧') + text.slice(i + key.length)
}

export default function DienOAiTab({ khoi }: { mon: string; khoi: string }) {
  const [rows, setRows] = useState<FormDienChoDuyet[]>([])
  const [lyDo, setLyDo] = useState<Map<string, HinhLyDo>>(new Map())
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [tuChoi, setTuChoi] = useState<Record<string, string>>({})
  const [thongBao, setThongBao] = useState<string | null>(null)
  const reqId = useRef(0)

  async function reload() {
    const my = ++reqId.current
    setLoading(true); setErr(null); setRows([])
    try {
      const [r, ld] = await Promise.all([listFormDienChoDuyet(khoi), listHinhLyDo()])
      if (my !== reqId.current) return
      setRows(r); setLyDo(new Map(ld.map((x) => [x.ma, x])))
    } catch (e: any) { if (my === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (my === reqId.current) setLoading(false) }
  }
  useEffect(() => { reload() }, [khoi]) // eslint-disable-line
  function bao(m: string) { setThongBao(m); setTimeout(() => setThongBao(null), 2000) }
  async function onDuyet(r: FormDienChoDuyet) {
    setBusy(r.id)
    try { await duyetFormDien(r.id, await myNhanSuId()); setRows((a) => a.filter((x) => x.id !== r.id)); bao(`✓ Đã duyệt ${r.ma}`) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(null) }
  }
  async function onTuChoi(r: FormDienChoDuyet) {
    const ly = (tuChoi[r.id] ?? '').trim(); if (!ly) return
    setBusy(r.id)
    try { await tuChoiFormDien(r.id, await myNhanSuId(), ly); setRows((a) => a.filter((x) => x.id !== r.id)); bao(`✕ Đã từ chối ${r.ma}`) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(null) }
  }

  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      {thongBao && <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{thongBao}</div>}
      {err && <p className="mb-3 text-sm text-rose-600">Lỗi: {err}</p>}
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
        : rows.length === 0 ? <p className="text-sm text-slate-400">Không có bài điền ô nào chờ duyệt ở khối {khoi}.</p>
        : (
          <ul className="space-y-3">
            {rows.map((r) => {
              const oByBuoc = new Map(r.o.map((o) => [o.buoc, o]))
              const mo = r.id in tuChoi
              return (
                <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-400">
                    <span className="rounded bg-violet-50 px-2 py-0.5 font-medium text-violet-700">Hình · {r.loai === 'cach' ? 'cách giải' : 'biến thể'}</span>
                    <span className="font-mono text-slate-500">{r.ma}</span>
                    <span>· khối {r.khoi} · {r.o.length} ô</span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <button onClick={() => setTuChoi((t) => (mo ? (({ [r.id]: _, ...rest }) => rest)(t) : { ...t, [r.id]: '' }))} disabled={busy === r.id}
                        className="rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50">✕ Từ chối</button>
                      <button onClick={() => onDuyet(r)} disabled={busy === r.id}
                        className="rounded-md bg-emerald-600 px-3 py-1 text-[12px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">{busy === r.id ? '⏳…' : '✓ Duyệt'}</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5">
                    <div>
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Đề bài</div>
                      <MathText>{r.de}</MathText>
                      {r.gia_thiet && <div className="mt-1 text-[13px] text-slate-500"><MathText>{r.gia_thiet}</MathText></div>}
                      {r.anh && <img src={r.anh} alt="" className="mt-2 max-h-56 rounded border border-slate-200 bg-white" />}
                    </div>
                    <div className="space-y-1">
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Lời giải có ô trống</div>
                      {r.buoc.map((b) => {
                        const o = oByBuoc.get(b.k)
                        return (
                          <div key={b.k} className={`rounded-md px-2 py-1 text-[14px] ${o ? 'bg-orange-50 ring-1 ring-orange-200' : ''}`}>
                            <MathText>{o ? buocCoO(b.text, o.key) : b.text}</MathText>
                            {o && (
                              <div className="mt-1 grid grid-cols-[22px_1fr] gap-x-2 gap-y-0.5 pl-1 text-[13px]">
                                {o.phuong_an.map((p, i) => (
                                  <div key={i} className="contents">
                                    <span className="font-semibold text-slate-500">{CHU[i]}.</span>
                                    <span className={p.dung ? 'rounded bg-emerald-50 px-1 text-emerald-800' : ''}>
                                      {o.kieu === 'ly_do' ? (lyDo.get(p.ma ?? '')?.ten ?? p.ma) : <MathText>{p.text ?? ''}</MathText>}
                                      {p.dung ? ' ✓' : <span className="ml-1.5 text-[12px] text-rose-600">{p.loi} · {p.vi_sao_sai}</span>}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {mo && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2">
                      <input autoFocus value={tuChoi[r.id]} onChange={(e) => setTuChoi((t) => ({ ...t, [r.id]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') onTuChoi(r) }}
                        placeholder="Lý do từ chối (bắt buộc) — vd: ô 2 chọn sai bước / phương án B cũng đúng…" className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-[13px]" />
                      <button onClick={() => onTuChoi(r)} disabled={!(tuChoi[r.id] ?? '').trim() || busy === r.id} className="shrink-0 rounded-md bg-rose-600 px-3 py-1.5 text-[12px] font-medium text-white disabled:opacity-40">Xác nhận từ chối</button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
    </div>
  )
}
