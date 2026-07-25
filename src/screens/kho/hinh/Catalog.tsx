// M6 — Dạng bài (2 tầng: loại câu hỏi › cách xử lý) · M7 — Bổ đề (danh mục PHẲNG).
// Cả hai gắn ở CÁCH GIẢI của bài toán nhỏ, KHÔNG gắn ở ý. Toàn nhánh Hình, dùng chung mọi họ.
//
// Tra ngược = giá trị chính của hai màn này: chọn 1 dạng/bổ đề → thấy các bài toán nhỏ
// dùng nó, kèm tag mô hình → một dạng trải nhiều họ.
import { useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Luoi } from '../../../lib/kho/hinh'
import { MathText, Shell, Field, Actions, inp } from '../ui'
import { Btn, Cap, Empty, Ma, Panel, Sol, Tag, inpCls } from './hinhUi'

export default function Catalog({ L, loai, reload }: { L: Luoi; loai: 'dang' | 'bode'; reload: () => Promise<void> }) {
  return loai === 'dang' ? <MDang L={L} reload={reload} /> : <MBoDe L={L} reload={reload} />
}

// ══════════════════ M6 — DẠNG BÀI ══════════════════
function MDang({ L, reload }: { L: Luoi; reload: () => Promise<void> }) {
  const [chon, setChon] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [form, setForm] = useState<{ id?: string; cap: 'loai_ch' | 'dang'; cha?: string | null } | null>(null)

  const theo = useMemo(() => api.baiToanTheoDang(L), [L])
  const rollup = useMemo(() => api.demTheoDangRollup(L), [L])
  const loaiCh = L.dang.filter((d) => d.cap === 'loai_ch')
  const laMatch = (ten: string) => !q.trim() || ten.toLowerCase().includes(q.toLowerCase())
  const d = chon ? L.dang.find((x) => x.id === chon) : null

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Danh sách dạng bài</h1>
        <Btn kind="pri" onClick={() => setForm({ cap: 'loai_ch' })}>＋ Loại câu hỏi</Btn>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] text-slate-500">
        Hai tầng: <b>loại câu hỏi › cách xử lý</b>. Gắn ở <b>cách giải</b> của bài toán nhỏ, không gắn ở ý.
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_380px]">
        <Panel>
          <input className={`${inpCls} mb-3`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm dạng…" />
          {!loaiCh.length && <Empty icon="⌥">Chưa có loại câu hỏi nào. Vd: <i>Chứng minh tứ giác nội tiếp</i> › <i>hai đỉnh cùng nhìn một cạnh</i>.</Empty>}
          {loaiCh.map((lc) => {
            const con = L.dang.filter((x) => x.cha_id === lc.id)
            if (q.trim() && !laMatch(lc.ten) && !con.some((c) => laMatch(c.ten))) return null
            return (
              <div key={lc.id} className="mb-1 border-t border-slate-100 pt-2 first:border-0 first:pt-0">
                <div className="group flex items-center gap-2 px-2 py-1 text-[12px] font-semibold text-slate-700">
                  <span className="flex-1">{lc.ten} <span className="font-normal text-slate-400">· {rollup.get(lc.id) ?? 0}</span></span>
                  <span className="hidden gap-1 group-hover:flex">
                    <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ id: lc.id, cap: 'loai_ch' })}>✎</Btn>
                    <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ cap: 'dang', cha: lc.id })}>＋ dạng</Btn>
                  </span>
                </div>
                {con.filter((c) => laMatch(c.ten) || laMatch(lc.ten)).map((c) => (
                  <button key={c.id} onClick={() => setChon(c.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${chon === c.id ? 'bg-violet-50' : 'hover:bg-slate-50'}`}>
                    <Tag ton="dg">… {c.ten}</Tag>
                    <span className="flex-1" />
                    <Ma>{theo.get(c.id)?.length ?? 0} bài toán</Ma>
                  </button>
                ))}
                {!con.length && <div className="px-2 py-1 text-[11.5px] text-slate-400">— chưa có cách xử lý nào —</div>}
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
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setForm({ id: d.id, cap: 'dang', cha: d.cha_id })}>✎</Btn>
                  <Btn className="h-6 px-1.5 text-[11px]" onClick={async () => {
                    if (!confirm(`Xoá dạng "${d.ten}"?`)) return
                    try { await api.deleteDang(d.id); setChon(null); await reload() } catch (e: any) { alert(e.message) }
                  }}>🗑</Btn>
                </div>
              </div>
              <DsBaiToan L={L} ds={theo.get(d.id) ?? []} />
              <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-600">
                <b className="text-blue-700">Rollup:</b> đọc ở tầng trên (<i>{L.dang.find((x) => x.id === d.cha_id)?.ten}</i>, {rollup.get(d.cha_id ?? '') ?? 0} bài toán)
                = mẫu lớn, tín hiệu chắc. Đọc ở lá này = mẫu nhỏ, chẩn đoán, <b>dè dặt</b>.
              </div>
            </>
          )}
        </Panel>
      </div>

      {form && <FormDang L={L} init={form} onClose={() => setForm(null)} onDone={reload} />}
    </>
  )
}

// ══════════════════ M7 — BỔ ĐỀ ══════════════════
function MBoDe({ L, reload }: { L: Luoi; reload: () => Promise<void> }) {
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

      {form && <FormBoDe L={L} id={form.id} onClose={() => setForm(null)} onDone={reload} />}
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

function FormDang({ L, init, onClose, onDone }: {
  L: Luoi; init: { id?: string; cap: 'loai_ch' | 'dang'; cha?: string | null }; onClose: () => void; onDone: () => Promise<void>
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
            else await api.createDang({ ten, cap: init.cap, cha_id: init.cap === 'dang' ? cha : null })
            await onDone(); onClose()
          } catch (e: any) { setLoi(e.message ?? String(e)); setSaving(false) }
        }} />
    </Shell>
  )
}

function FormBoDe({ L, id, onClose, onDone }: { L: Luoi; id?: string; onClose: () => void; onDone: () => Promise<void> }) {
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
          else await api.createBoDe({ ten, phat_bieu: pb || null })
          await onDone(); onClose()
        }} />
    </Shell>
  )
}
