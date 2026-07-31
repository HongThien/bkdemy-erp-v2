// TAB Ý TƯỞNG + TRIAGE (§2). Mọi người đề xuất; trưởng nhánh refinement (gia_tri/co);
// CEO duyệt vào backlog / từ chối kèm lý do (hiện cho tác giả). Idea quá 1 chu kỳ → đỏ.
import { useEffect, useState } from 'react'
import {
  listYTuong, createYTuong, refineYTuong, duyetYTuongVaoBacklog, holdingYTuong, tuChoiYTuong, taoBacklogTopDown,
  ideaQuaHanTriage, type YTuongFull,
} from '../../lib/giaoviec'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Badge, IDEA_TT, Section, Empty, ErrBar, Modal, Field, Chon13 } from './ui'

export default function IdeaTab({ laAdmin, laQuanLy }: { laAdmin: boolean; laQuanLy: boolean }) {
  const [rows, setRows] = useState<YTuongFull[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [showDeXuat, setShowDeXuat] = useState(false)
  const [showTopDown, setShowTopDown] = useState(false)
  const [tuChoiId, setTuChoiId] = useState<string | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { setRows(await listYTuong()) } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  async function act(fn: () => Promise<void>) {
    try { await fn(); await reload() } catch (e: any) { setErr(e?.message ?? String(e)) }
  }

  const moi = rows.filter((r) => r.trang_thai === 'moi')
  const backlog = rows.filter((r) => r.trang_thai === 'backlog')
  const holding = rows.filter((r) => r.trang_thai === 'holding')
  const daTK = rows.filter((r) => r.trang_thai === 'da_trien_khai')
  const tuChoi = rows.filter((r) => r.trang_thai === 'tu_choi')
  const nguDong = rows.filter((r) => r.trang_thai === 'ngu_dong')

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <ErrBar msg={err} />
      <div className="flex gap-2">
        <button onClick={() => setShowDeXuat(true)} className={CX_BTN}>+ Đề xuất ý tưởng</button>
        {laAdmin && <button onClick={() => setShowTopDown(true)} className={CX_BTN_GHOST}>+ Tạo thẳng backlog (chiến lược)</button>}
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <>
          <Section title={`Chờ duyệt (${moi.length})`} highlight={moi.some((r) => ideaQuaHanTriage(r.created_at))}>
            {!moi.length ? <Empty>Không có ý tưởng nào chờ duyệt.</Empty> : moi.map((r) => (
              <IdeaCard key={r.id} r={r} canRefine={laAdmin || laQuanLy}
                onRefine={(patch) => act(() => refineYTuong(r.id, patch))}
                actions={laAdmin && (
                  <div className="flex gap-1.5">
                    <button onClick={() => act(() => duyetYTuongVaoBacklog(r.id))} className={CX_BTN}>→ Backlog</button>
                    <button onClick={() => act(() => holdingYTuong(r.id))} className="rounded-lg border border-amber-300 px-3 py-2 text-[12px] font-medium text-amber-700 hover:bg-amber-50">Holding</button>
                    <button onClick={() => setTuChoiId(r.id)} className="rounded-lg border border-rose-300 px-3 py-2 text-[12px] font-medium text-rose-600 hover:bg-rose-50">Huỷ</button>
                  </div>
                )} />
            ))}
          </Section>

          {!!holding.length && (
            <Section title={`Holding — tạm hoãn (${holding.length})`} highlight>
              {holding.map((r) => (
                <IdeaCard key={r.id} r={r}
                  actions={laAdmin && (
                    <div className="flex gap-1.5">
                      <button onClick={() => act(() => duyetYTuongVaoBacklog(r.id))} className={CX_BTN}>→ Backlog</button>
                      <button onClick={() => setTuChoiId(r.id)} className="rounded-lg border border-rose-300 px-3 py-2 text-[12px] font-medium text-rose-600 hover:bg-rose-50">Huỷ</button>
                    </div>
                  )} />
              ))}
            </Section>
          )}

          <Section title={`Trong backlog (${backlog.length})`}>
            {!backlog.length ? <Empty>Chưa có ý tưởng nào vào backlog.</Empty> : backlog.map((r) => <IdeaCard key={r.id} r={r} />)}
          </Section>

          {!!daTK.length && <Section title={`Đã triển khai (${daTK.length})`}>{daTK.map((r) => <IdeaCard key={r.id} r={r} />)}</Section>}
          {!!tuChoi.length && <Section title={`Đã huỷ (${tuChoi.length})`}>{tuChoi.map((r) => <IdeaCard key={r.id} r={r} />)}</Section>}
          {!!nguDong.length && <Section title={`Ngủ đông (${nguDong.length})`}>{nguDong.map((r) => <IdeaCard key={r.id} r={r} />)}</Section>}
        </>
      )}

      {showDeXuat && <DeXuatModal onClose={() => setShowDeXuat(false)} onDone={() => { setShowDeXuat(false); reload() }} />}
      {showTopDown && <TopDownModal onClose={() => setShowTopDown(false)} onDone={() => { setShowTopDown(false); reload() }} />}
      {tuChoiId && <TuChoiModal onClose={() => setTuChoiId(null)} onDone={(ly) => act(() => tuChoiYTuong(tuChoiId, ly)).then(() => setTuChoiId(null))} />}
    </div>
  )
}

function IdeaCard({ r, canRefine, onRefine, actions }: {
  r: YTuongFull; canRefine?: boolean; onRefine?: (patch: { gia_tri?: number; co?: number }) => void; actions?: React.ReactNode
}) {
  const late = r.trang_thai === 'moi' && ideaQuaHanTriage(r.created_at)
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm ${late ? 'ring-1 ring-amber-300' : ''}`}>
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{r.tieu_de}</span>
            <Badge map={IDEA_TT} k={r.trang_thai} />
            {late && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Quá hạn triage</span>}
          </div>
          <div className="mt-0.5 text-[12px] text-slate-500">Tác giả: {r.tac_gia_ten}
            {(r.gia_tri || r.co) && <> · Giá trị {r.gia_tri ?? '—'} · Cỡ {r.co ?? '—'}</>}
          </div>
          {r.mo_ta && <div className="mt-1 text-[12px] text-slate-400">{r.mo_ta}</div>}
          {r.trang_thai === 'tu_choi' && r.ly_do_tu_choi && (
            <div className="mt-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[12px] text-rose-600">Lý do từ chối: {r.ly_do_tu_choi}</div>
          )}
          {canRefine && onRefine && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-slate-500">
              <span>Giá trị:</span><Chon13 value={r.gia_tri} onChange={(v) => onRefine({ gia_tri: v })} />
              <span>Cỡ:</span><Chon13 value={r.co} onChange={(v) => onRefine({ co: v })} />
            </div>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  )
}

function DeXuatModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [tieuDe, setTieuDe] = useState(''); const [moTa, setMoTa] = useState('')
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)
  async function submit() {
    if (!tieuDe.trim()) { setErr('Cần tiêu đề.'); return }
    setSaving(true); setErr(null)
    try { await createYTuong({ tieu_de: tieuDe.trim(), mo_ta: moTa.trim() || undefined }); onDone() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }
  return (
    <Modal title="Đề xuất ý tưởng" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Tiêu đề"><input value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} className={CX_INPUT} placeholder="VD: Làm bộ đề khối 9" /></Field>
        <Field label="Mô tả"><textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} className={CX_INPUT} rows={3} /></Field>
        <p className="text-[11px] text-slate-400">Ai cũng đề xuất được. Bị từ chối sẽ có lý do rõ ràng; không bị xoá.</p>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button><button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? '…' : 'Gửi'}</button></div>
      </div>
    </Modal>
  )
}

function TopDownModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [tieuDe, setTieuDe] = useState(''); const [moTa, setMoTa] = useState('')
  const [giaTri, setGiaTri] = useState<number | null>(null); const [co, setCo] = useState<number | null>(null)
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)
  async function submit() {
    if (!tieuDe.trim()) { setErr('Cần tiêu đề.'); return }
    setSaving(true); setErr(null)
    try { await taoBacklogTopDown({ tieu_de: tieuDe.trim(), mo_ta: moTa.trim() || undefined, gia_tri: giaTri, co }); onDone() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }
  return (
    <Modal title="Tạo thẳng backlog (việc chiến lược)" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Tiêu đề"><input value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} className={CX_INPUT} /></Field>
        <Field label="Mô tả"><textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} className={CX_INPUT} rows={2} /></Field>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-600">
          <span>Giá trị:</span><Chon13 value={giaTri} onChange={setGiaTri} /><span>Cỡ:</span><Chon13 value={co} onChange={setCo} />
        </div>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button><button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? '…' : 'Tạo vào backlog'}</button></div>
      </div>
    </Modal>
  )
}

function TuChoiModal({ onClose, onDone }: { onClose: () => void; onDone: (lyDo: string) => void }) {
  const [ly, setLy] = useState(''); const [err, setErr] = useState<string | null>(null)
  return (
    <Modal title="Từ chối ý tưởng" onClose={onClose}>
      <div className="space-y-3">
        <p className="text-[12px] text-slate-500">Lý do sẽ HIỆN cho tác giả — đây là điểm sống còn của hòm góp ý.</p>
        <Field label="Lý do từ chối (bắt buộc)"><textarea value={ly} onChange={(e) => setLy(e.target.value)} className={CX_INPUT} rows={3} /></Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button>
          <button onClick={() => { if (!ly.trim()) { setErr('Phải ghi lý do.'); return } onDone(ly.trim()) }} className="rounded-lg bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700">Từ chối</button></div>
      </div>
    </Modal>
  )
}
