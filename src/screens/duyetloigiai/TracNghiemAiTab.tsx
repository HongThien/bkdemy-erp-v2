// Tab "Trắc nghiệm AI" (spec-mcq-form.md §6, M2) — duyệt PHIÊN BẢN TRẮC NGHIỆM (distractor theo lỗi) AI sinh cho câu
// tính toán. Mỗi thẻ: đề · 4 phương án (xanh = đúng) · mỗi phương án sai kèm rule + đường sai (chỉ staff thấy — CEO 08/09:
// HS không thấy đường sai, HS đọc lời giải). Hành động: Duyệt · Sửa rồi duyệt (sửa text/rule/đường sai của phương án
// SAI — DB tự so bản cũ để ghi sua_truoc_duyet cho metric precision) · Từ chối (lý do bắt buộc → kho rác, câu quay lại
// pool sinh lại). KHÔNG có "duyệt tất cả": CEO chốt duyệt 100% pool 1 để đo precision.
// Metric strip đọc fn_mcq_metric (tính ở DB §2.0) — client chỉ hiển thị.
import { useEffect, useRef, useState } from 'react'
import { nhanhCuaMon, NHANH_LABEL, listFormTnChoDuyet, duyetFormTn, tuChoiFormTn, listMcqRule, mcqMetric, type FormTnChoDuyet, type LuaChonTn, type KhoMon, type McqRule, type McqMetric } from '../../lib/kho/api'
import { MathText, inp } from '../kho/ui'
import { myNhanSuId } from '../../lib/giaoviec'

const CHU = ['A', 'B', 'C', 'D']
type Row = FormTnChoDuyet & { mon: KhoMon }

export default function TracNghiemAiTab({ mon, khoi }: { mon: string; khoi: string }) {
  const kho = nhanhCuaMon(mon).filter((n): n is KhoMon => n !== 'hinh')
  const [rows, setRows] = useState<Row[]>([])
  const [rules, setRules] = useState<McqRule[]>([])
  const [metric, setMetric] = useState<McqMetric | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [edit, setEdit] = useState<Record<string, LuaChonTn[]>>({})      // id → bản đang sửa
  const [tuChoi, setTuChoi] = useState<Record<string, string>>({})      // id → lý do đang gõ (mở ô từ chối)
  const [thongBao, setThongBao] = useState<string | null>(null)
  const reqId = useRef(0)

  async function reload() {
    const my = ++reqId.current
    setLoading(true); setErr(null); setRows([])
    try {
      const [lists, rl, mt] = await Promise.all([
        Promise.all(kho.map((k) => listFormTnChoDuyet(k, khoi))),
        kho.length ? listMcqRule(kho[0]) : Promise.resolve([] as McqRule[]),
        kho.length ? mcqMetric(kho[0]) : Promise.resolve(null),
      ])
      if (my !== reqId.current) return
      setRows(kho.flatMap((k, i) => lists[i].map((r) => ({ ...r, mon: k }))))
      setRules(rl); setMetric(mt)
    } catch (e: any) { if (my === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (my === reqId.current) setLoading(false) }
  }
  useEffect(() => { reload() }, [mon, khoi]) // eslint-disable-line

  function bao(msg: string) { setThongBao(msg); setTimeout(() => setThongBao(null), 2000) }
  async function onDuyet(r: Row) {
    setBusy(r.id)
    try {
      const nguoi = await myNhanSuId()
      await duyetFormTn(r.mon, r.id, nguoi, edit[r.id])
      setRows((a) => a.filter((x) => x.id !== r.id))
      setEdit((e) => { const { [r.id]: _, ...rest } = e; return rest })
      bao(`✓ Đã duyệt ${r.ma_cau}${edit[r.id] ? ' (có sửa)' : ''}`)
      mcqMetric(r.mon).then(setMetric).catch(() => {})
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(null) }
  }
  async function onTuChoi(r: Row) {
    const lyDo = (tuChoi[r.id] ?? '').trim()
    if (!lyDo) return
    setBusy(r.id)
    try {
      const nguoi = await myNhanSuId()
      await tuChoiFormTn(r.mon, r.id, nguoi, lyDo)
      setRows((a) => a.filter((x) => x.id !== r.id))
      bao(`✕ Đã từ chối ${r.ma_cau} — câu quay lại pool để sinh lại`)
      mcqMetric(r.mon).then(setMetric).catch(() => {})
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(null) }
  }
  function suaPa(id: string, goc: LuaChonTn[], i: number, patch: Partial<LuaChonTn>) {
    setEdit((e) => { const cur = e[id] ?? goc.map((x) => ({ ...x })); const next = cur.map((x, j) => (j === i ? { ...x, ...patch } : x)); return { ...e, [id]: next } })
  }

  const pct = (x: number | null) => (x == null ? '—' : `${Math.round(x * 100)}%`)
  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      {/* Metric strip — số tính ở DB (fn_mcq_metric) */}
      {metric && (
        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] text-slate-500">
          <span>Đã sinh <b className="text-slate-800">{metric.tong}</b></span>
          <span>Chờ duyệt <b className="text-slate-800">{metric.cho_duyet}</b></span>
          <span>Duyệt <b className="text-emerald-700">{metric.duyet}</b> (sửa trước duyệt {metric.sua})</span>
          <span>Từ chối <b className="text-rose-700">{metric.tu_choi}</b></span>
          <span title="duyệt không sửa / (duyệt + từ chối)">Precision AI <b className="text-slate-800">{pct(metric.precision)}</b></span>
          <span>Vị trí đúng {CHU.map((c) => `${c}${metric.phan_bo?.[c] ?? 0}`).join(' · ')}</span>
          {metric.do_lua?.length > 0 && <span>Đã có {metric.do_lua.length} câu ≥30 lượt làm</span>}
        </div>
      )}
      {thongBao && <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{thongBao}</div>}
      {err && <p className="mb-3 text-sm text-rose-600">Lỗi: {err}</p>}
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
        : rows.length === 0 ? <p className="text-sm text-slate-400">Không có phiên bản trắc nghiệm nào chờ duyệt ở {mon} khối {khoi}.</p>
        : (
          <ul className="space-y-3">
            {rows.map((r) => {
              const lc = edit[r.id] ?? r.lua_chon
              const dangSua = !!edit[r.id]
              const moTuChoi = r.id in tuChoi
              return (
                <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-400">
                    <span className="rounded bg-violet-50 px-2 py-0.5 font-medium text-violet-700">{NHANH_LABEL[r.mon]}</span>
                    <span className="font-mono text-slate-500">{r.ma_cau}</span>
                    <span>{r.ten_dang}</span>
                    <span>· đáp số kho <code className="rounded bg-slate-100 px-1">{r.dap_an_kho}</code> → <b>{r.key_gia_tri}</b></span>
                    <span>· đúng <b className="text-emerald-700">{r.dap_an}</b></span>
                    <div className="ml-auto flex items-center gap-1.5">
                      {!dangSua && (
                        <button onClick={() => setEdit((e) => ({ ...e, [r.id]: r.lua_chon.map((x) => ({ ...x })) }))} disabled={busy === r.id}
                          className="rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-slate-600 ring-1 ring-slate-200 hover:text-slate-900">✎ Sửa</button>
                      )}
                      {dangSua && (
                        <button onClick={() => setEdit((e) => { const { [r.id]: _, ...rest } = e; return rest })}
                          className="rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-slate-500 ring-1 ring-slate-200">Huỷ sửa</button>
                      )}
                      <button onClick={() => setTuChoi((t) => (moTuChoi ? (({ [r.id]: _, ...rest }) => rest)(t) : { ...t, [r.id]: '' }))} disabled={busy === r.id}
                        className="rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50">✕ Từ chối</button>
                      <button onClick={() => onDuyet(r)} disabled={busy === r.id}
                        className="rounded-md bg-emerald-600 px-3 py-1 text-[12px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
                        {busy === r.id ? '⏳…' : dangSua ? '✓ Lưu & duyệt' : '✓ Duyệt'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-5">
                    <div>
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Đề bài</div>
                      <MathText>{r.noi_dung}</MathText>
                      {r.anh_de && <img src={r.anh_de} alt="" className="mt-2 max-h-48 rounded border border-slate-200" />}
                      {r.loi_giai && (
                        <details className="mt-2 text-[13px] text-slate-600">
                          <summary className="cursor-pointer text-slate-400">Lời giải trong kho</summary>
                          <MathText>{r.loi_giai}</MathText>
                        </details>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {lc.map((o, i) => (
                        <div key={i} className={`rounded-lg px-2.5 py-1.5 ${o.dung ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-slate-50'}`}>
                          <div className="flex items-start gap-2">
                            <span className={`mt-0.5 w-5 shrink-0 text-[13px] font-bold ${o.dung ? 'text-emerald-700' : 'text-slate-500'}`}>{CHU[i]}.</span>
                            {dangSua && !o.dung
                              ? <input value={o.text} onChange={(e) => suaPa(r.id, r.lua_chon, i, { text: e.target.value })} className={`${inp} font-mono text-[13px]`} />
                              : <MathText className="text-[15px]">{o.text}</MathText>}
                          </div>
                          {!o.dung && (
                            dangSua ? (
                              <div className="mt-1.5 grid grid-cols-1 gap-1.5 pl-7">
                                <select value={o.rule ?? ''} onChange={(e) => suaPa(r.id, r.lua_chon, i, { rule: e.target.value })} className={`${inp} text-[12px]`}>
                                  <option value="">— rule —</option>
                                  {rules.map((x) => <option key={x.ma} value={x.ma}>{x.ma} · {x.ten}{x.du_phong ? ' (dự phòng)' : ''}</option>)}
                                </select>
                                <input value={o.duong_sai ?? ''} onChange={(e) => suaPa(r.id, r.lua_chon, i, { duong_sai: e.target.value })} placeholder="Đường sai (TA đọc hiểu trong 3 giây)" className={`${inp} text-[12px]`} />
                              </div>
                            ) : (
                              <div className="mt-0.5 pl-7 text-[12px] text-slate-500">
                                <span className="mr-1.5 rounded bg-white px-1.5 py-px font-mono text-[11px] text-slate-500 ring-1 ring-slate-200" title={rules.find((x) => x.ma === o.rule)?.ten}>{o.rule}</span>
                                {o.duong_sai}
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {moTuChoi && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2">
                      <input autoFocus value={tuChoi[r.id]} onChange={(e) => setTuChoi((t) => ({ ...t, [r.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') onTuChoi(r) }}
                        placeholder="Lý do từ chối (bắt buộc) — vd: phương án B trùng giá trị đáp án / đường sai không phải lỗi HS thật…" className={`${inp} text-[13px]`} />
                      <button onClick={() => onTuChoi(r)} disabled={!(tuChoi[r.id] ?? '').trim() || busy === r.id}
                        className="shrink-0 rounded-md bg-rose-600 px-3 py-1.5 text-[12px] font-medium text-white disabled:opacity-40">Xác nhận từ chối</button>
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
