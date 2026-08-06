// M6 — Dạng bài (2 tầng: loại câu hỏi › cách xử lý) · M7 — Bổ đề (danh mục PHẲNG).
// Cả hai gắn ở CÁCH GIẢI của bài toán nhỏ, KHÔNG gắn ở ý. Toàn nhánh Hình, dùng chung mọi họ.
//
// Tra ngược = giá trị chính của hai màn này: chọn 1 dạng/bổ đề → thấy các bài toán nhỏ
// dùng nó, kèm tag mô hình → một dạng trải nhiều họ.
import { useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Luoi } from '../../../lib/kho/hinh'
import { MathText, Shell, Field, Actions, inp } from '../ui'
import { Btn, Cap, Empty, Ma, Panel, Sol, Tag, inpCls } from './hinhUi'
import { LyThuyetModal } from '../BanDo'

// Lý thuyết đã có hay chưa → chấm tròn nhỏ trước tên dạng (như % ở Đại, nhưng gọn).
type LtMap = Record<string, { noi_dung: string; file_url: string | null }>
const coLt = (m: LtMap, id: string) => !!(m[id]?.noi_dung?.trim() || m[id]?.file_url)

export default function Catalog({ L, khoi, loai, reload }: { L: Luoi; khoi: string; loai: 'dang' | 'bode'; reload: () => Promise<void> }) {
  return loai === 'dang' ? <MDang L={L} khoi={khoi} reload={reload} /> : <MBoDe L={L} khoi={khoi} reload={reload} />
}

// ══════════════════ M6 — DẠNG BÀI ══════════════════
function MDang({ L, khoi, reload }: { L: Luoi; khoi: string; reload: () => Promise<void> }) {
  const [chon, setChon] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [form, setForm] = useState<{ id?: string; cap: 'loai_ch' | 'dang'; cha?: string | null } | null>(null)
  const [ltMap, setLtMap] = useState<LtMap>({})
  const [ltModal, setLtModal] = useState<{ id: string; ten: string } | null>(null)

  const napLt = () => api.hinhDangLyThuyet.list().then((m) => setLtMap(m as LtMap)).catch(() => { /* */ })
  useEffect(() => { napLt() }, [])

  const theo = useMemo(() => api.baiToanTheoDang(L), [L])
  const rollup = useMemo(() => api.demTheoDangRollup(L), [L])
  const loaiCh = L.dang.filter((d) => d.cap === 'loai_ch')
  const laMatch = (ten: string) => !q.trim() || ten.toLowerCase().includes(q.toLowerCase())
  const d = chon ? L.dang.find((x) => x.id === chon) : null
  // Terminal dạng = lá: cách xử lý, hoặc loại câu hỏi CHƯA tách con (chính nó là dạng). Lý thuyết gắn ở đây.
  const laTerminal = (id: string) => !L.dang.some((x) => x.cha_id === id)

  const RowDang = ({ id, ten, ton }: { id: string; ten: string; ton: 'dg' | 'loai' }) => (
    <button onClick={() => setChon(id)}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${chon === id ? 'bg-violet-50' : 'hover:bg-slate-50'}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${coLt(ltMap, id) ? 'bg-emerald-500' : 'bg-slate-200'}`} title={coLt(ltMap, id) ? 'đã có lý thuyết' : 'chưa có lý thuyết'} />
      {ton === 'dg' ? <Tag ton="dg">… {ten}</Tag> : <span className="text-[12.5px] font-medium text-slate-700">{ten}</span>}
      <span className="flex-1" />
      <Ma>{theo.get(id)?.length ?? 0} bài toán</Ma>
    </button>
  )

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Danh sách dạng bài</h1>
        <Btn kind="pri" onClick={() => setForm({ cap: 'loai_ch' })}>＋ Loại câu hỏi</Btn>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] text-slate-500">
        Hai tầng: <b>loại câu hỏi › cách xử lý</b>. Gắn ở <b>cách giải</b> của bài toán nhỏ. Mỗi dạng gắn được <b>lý thuyết/phương pháp</b> (chấm <span className="text-emerald-600">●</span> = đã có).
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_380px]">
        <Panel>
          <input className={`${inpCls} mb-3`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm dạng…" />
          {!loaiCh.length && <Empty icon="⌥">Chưa có loại câu hỏi nào. Vd: <i>Chứng minh tứ giác nội tiếp</i> › <i>hai đỉnh cùng nhìn một cạnh</i>.</Empty>}
          {loaiCh.map((lc) => {
            const con = L.dang.filter((x) => x.cha_id === lc.id)
            if (q.trim() && !laMatch(lc.ten) && !con.some((c) => laMatch(c.ten))) return null
            const terminal = con.length === 0   // loại chưa tách con → chính nó là dạng chọn được
            return (
              <div key={lc.id} className="mb-1 border-t border-slate-100 pt-2 first:border-0 first:pt-0">
                {terminal ? (
                  <div className="group flex items-center gap-1">
                    <div className="flex-1"><RowDang id={lc.id} ten={lc.ten} ton="loai" /></div>
                    <span className="hidden gap-1 group-hover:flex">
                      <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ cap: 'dang', cha: lc.id })}>＋ tách</Btn>
                    </span>
                  </div>
                ) : (
                  <div className="group flex items-center gap-2 px-2 py-1 text-[12px] font-semibold text-slate-700">
                    <span className="flex-1">{lc.ten} <span className="font-normal text-slate-400">· {rollup.get(lc.id) ?? 0}</span></span>
                    <span className="hidden gap-1 group-hover:flex">
                      <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ id: lc.id, cap: 'loai_ch' })}>✎</Btn>
                      <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ cap: 'dang', cha: lc.id })}>＋ dạng</Btn>
                    </span>
                  </div>
                )}
                {con.filter((c) => laMatch(c.ten) || laMatch(lc.ten)).map((c) => (
                  <RowDang key={c.id} id={c.id} ten={c.ten} ton="dg" />
                ))}
              </div>
            )
          })}
        </Panel>

        <Panel label="Tra ngược — dạng đang chọn">
          {!d ? <div className="py-6 text-center text-[12.5px] text-slate-400">Chọn một dạng ở cột trái.</div> : (
            <>
              <div className="mb-1 flex items-start justify-between gap-2">
                <div className="text-[13.5px] font-semibold text-slate-900">{api.tenDangDayDu(L, d.id)}</div>
                <div className="flex shrink-0 gap-1">
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ id: d.id, cap: d.cap, cha: d.cha_id })}>✎</Btn>
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={async () => {
                    if (!confirm(`Xoá dạng "${d.ten}"?`)) return
                    try { await api.deleteDang(d.id); setChon(null); await reload() } catch (e: any) { alert(e.message) }
                  }}>🗑</Btn>
                </div>
              </div>

              {/* Lý thuyết / phương pháp của dạng (chỉ ở TERMINAL dạng) — tái dùng editor của Đại */}
              {laTerminal(d.id) && (
                <div className="mb-3 rounded-lg border border-violet-200 bg-violet-50/50 px-2.5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">Lý thuyết / phương pháp</span>
                    <Btn className="ml-auto h-6 px-2 text-[11px]" onClick={() => setLtModal({ id: d.id, ten: api.tenDangDayDu(L, d.id) })}>
                      {coLt(ltMap, d.id) ? '✎ Sửa' : '＋ Soạn'}
                    </Btn>
                  </div>
                  {coLt(ltMap, d.id)
                    ? <div className="mt-1.5 max-h-40 overflow-y-auto text-[12px] leading-relaxed text-slate-700"><MathText>{ltMap[d.id]?.noi_dung ?? ''}</MathText></div>
                    : <div className="mt-1 text-[11.5px] text-slate-400">Chưa có — bấm Soạn (gõ tay hoặc dán ảnh/PDF → AI bóc LaTeX).</div>}
                </div>
              )}

              <DsBaiToan L={L} ds={theo.get(d.id) ?? []} />
              {d.cha_id && (
                <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-600">
                  <b className="text-blue-700">Rollup:</b> đọc ở tầng trên (<i>{L.dang.find((x) => x.id === d.cha_id)?.ten}</i>, {rollup.get(d.cha_id ?? '') ?? 0} bài toán)
                  = mẫu lớn, tín hiệu chắc. Đọc ở lá này = mẫu nhỏ, chẩn đoán, <b>dè dặt</b>.
                </div>
              )}
            </>
          )}
        </Panel>
      </div>

      {form && <FormDang L={L} khoi={khoi} init={form} onClose={() => setForm(null)} onDone={reload} />}
      {ltModal && (
        <LyThuyetModal ma={ltModal.id} ten={ltModal.ten} current={ltMap[ltModal.id] as any} api={api.hinhDangLyThuyet as any}
          onClose={() => setLtModal(null)} onSaved={() => { setLtModal(null); napLt() }} />
      )}
    </>
  )
}

// ══════════════════ M7 — BỔ ĐỀ ══════════════════
function MBoDe({ L, khoi, reload }: { L: Luoi; khoi: string; reload: () => Promise<void> }) {
  const [chon, setChon] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [form, setForm] = useState<{ id?: string } | null>(null)
  const theo = useMemo(() => api.baiToanTheoBoDe(L), [L])
  const b = chon ? L.boDe.find((x) => x.id === chon) : null

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Danh sách bổ đề</h1>
        <Btn kind="pri" onClick={() => setForm({})}>＋ Bổ đề</Btn>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] text-slate-500">
        Danh mục <b>phẳng</b>. Bổ đề = <b>mối nối</b> bắc cầu giữa nửa-xuôi (giả thiết) và nửa-ngược (câu hỏi) —
        nhãn chẩn đoán, <b>không phải trục đo ngang hàng</b> với mô hình và dạng. Có bổ đề ⇒ độ khó +1 bậc.
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_380px]">
        <Panel>
          <input className={`${inpCls} mb-3`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm bổ đề…" />
          {!L.boDe.length && <Empty icon="◦">Chưa có bổ đề nào. Vd: <i>Hệ thức lượng trong tam giác vuông</i>, <i>Phương tích</i>.</Empty>}
          {L.boDe.filter((x) => !q.trim() || x.ten.toLowerCase().includes(q.toLowerCase())).map((x) => (
            <button key={x.id} onClick={() => setChon(x.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${chon === x.id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
              <Tag ton="bd">◦ {x.ten}</Tag>
              <span className="flex-1" />
              <Ma>{theo.get(x.id)?.length ?? 0} bài toán</Ma>
            </button>
          ))}
        </Panel>

        <Panel label="Tra ngược — bổ đề đang chọn">
          {!b ? <div className="py-6 text-center text-[12.5px] text-slate-400">Chọn một bổ đề ở cột trái.</div> : (
            <>
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div className="text-[13.5px] font-semibold text-slate-900">◦ {b.ten}</div>
                <div className="flex shrink-0 gap-1">
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ id: b.id })}>✎</Btn>
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={async () => {
                    if (!confirm(`Xoá bổ đề "${b.ten}"?`)) return
                    try { await api.deleteBoDe(b.id); setChon(null); await reload() } catch (e: any) { alert(e.message) }
                  }}>🗑</Btn>
                </div>
              </div>
              <Sol className="mb-3">{b.phat_bieu}</Sol>
              <DsBaiToan L={L} ds={theo.get(b.id) ?? []} />
              <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-2 text-[11.5px] leading-relaxed text-amber-800">
                <b>Cổng đọc theo bậc:</b> mô hình đọc được luôn → dạng đọc khi mô hình đã sạch →
                <b> bổ đề đọc khi cả hai đã sạch</b>. Trước đó, sai một bài có bổ đề chưa kết luận gì về bổ đề.
              </div>
            </>
          )}
        </Panel>
      </div>

      {form && <FormBoDe L={L} khoi={khoi} id={form.id} onClose={() => setForm(null)} onDone={reload} />}
    </>
  )
}

function DsBaiToan({ L, ds }: { L: Luoi; ds: typeof L.baiToan }) {
  if (!ds.length) return <div className="text-[12px] text-slate-400">— chưa bài toán nhỏ nào dùng cái này —</div>
  const hos = new Set(ds.map((b) => api.gocHoCua(L, b.mo_hinh_id)))
  return (
    <>
      <div className="mb-2 text-[12px] text-slate-400">{ds.length} bài toán nhỏ · trải {hos.size} họ mô hình</div>
      {ds.slice(0, 12).sort((a, b) => a.cap - b.cap).map((b) => {
        const mh = L.moHinh.find((m) => m.id === b.mo_hinh_id)
        return (
          <div key={b.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-[12.5px] hover:bg-slate-50">
            <Cap cap={b.cap} />
            <span className="min-w-0 flex-1 truncate"><MathText>{b.phat_bieu}</MathText></span>
            {mh && <Tag ton="mh">{mh.ma}</Tag>}
          </div>
        )
      })}
      {ds.length > 12 && <div className="px-1.5 py-1 text-[11.5px] text-slate-400">… và {ds.length - 12} bài toán khác</div>}
    </>
  )
}

function FormDang({ L, khoi, init, onClose, onDone }: {
  L: Luoi; khoi: string; init: { id?: string; cap: 'loai_ch' | 'dang'; cha?: string | null }; onClose: () => void; onDone: () => Promise<void>
}) {
  const cu = init.id ? L.dang.find((d) => d.id === init.id) : undefined
  const [ten, setTen] = useState(cu?.ten ?? '')
  const [cha, setCha] = useState(cu?.cha_id ?? init.cha ?? '')
  const [saving, setSaving] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  return (
    <Shell title={cu ? 'Sửa' : init.cap === 'loai_ch' ? 'Loại câu hỏi mới' : 'Cách xử lý mới'} onClose={onClose}>
      <Field label={init.cap === 'loai_ch' ? 'Tên loại câu hỏi' : 'Tên cách xử lý'}>
        <input className={inp} value={ten} onChange={(e) => setTen(e.target.value)} autoFocus
          placeholder={init.cap === 'loai_ch' ? 'Chứng minh tứ giác nội tiếp' : 'hai đỉnh cùng nhìn một cạnh'} />
      </Field>
      {init.cap === 'dang' && (
        <Field label="Thuộc loại câu hỏi">
          <select className={inp} value={cha} onChange={(e) => setCha(e.target.value)}>
            {L.dang.filter((d) => d.cap === 'loai_ch').map((d) => <option key={d.id} value={d.id}>{d.ten}</option>)}
          </select>
        </Field>
      )}
      {loi && <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
      <Actions onClose={onClose} disabled={!ten.trim() || saving} saving={saving} label={cu ? 'Lưu' : 'Tạo'}
        onSave={async () => {
          setSaving(true); setLoi(null)
          try {
            if (cu) await api.updateDang(cu.id, { ten, cha_id: init.cap === 'dang' ? cha : null })
            else await api.createDang({ ten, cap: init.cap, cha_id: init.cap === 'dang' ? cha : null, khoi })
            await onDone(); onClose()
          } catch (e: any) { setLoi(e.message ?? String(e)); setSaving(false) }
        }} />
    </Shell>
  )
}

function FormBoDe({ L, khoi, id, onClose, onDone }: { L: Luoi; khoi: string; id?: string; onClose: () => void; onDone: () => Promise<void> }) {
  const cu = id ? L.boDe.find((b) => b.id === id) : undefined
  const [ten, setTen] = useState(cu?.ten ?? '')
  const [pb, setPb] = useState(cu?.phat_bieu ?? '')
  const [saving, setSaving] = useState(false)
  return (
    <Shell title={cu ? `Sửa bổ đề ${cu.ma}` : 'Bổ đề mới'} onClose={onClose}>
      <Field label="Tên"><input className={inp} value={ten} onChange={(e) => setTen(e.target.value)} autoFocus placeholder="Hệ thức lượng trong tam giác vuông" /></Field>
      <Field label="Phát biểu (text + LaTeX $…$)">
        <textarea className={`${inp} h-24`} value={pb} onChange={(e) => setPb(e.target.value)}
          placeholder="$\\triangle ABC$ vuông tại $A$, đường cao $AH$: $AB^2 = BH \\cdot BC$" />
      </Field>
      <Actions onClose={onClose} disabled={!ten.trim() || saving} saving={saving} label={cu ? 'Lưu' : 'Tạo'}
        onSave={async () => {
          setSaving(true)
          if (cu) await api.updateBoDe(cu.id, { ten, phat_bieu: pb || null })
          else await api.createBoDe({ ten, phat_bieu: pb || null, khoi })
          await onDone(); onClose()
        }} />
    </Shell>
  )
}
