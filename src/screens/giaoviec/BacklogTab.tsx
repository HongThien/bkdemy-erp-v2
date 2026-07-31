// TAB BACKLOG (story §3). Sort gia_tri/co + trần WIP. CEO tick chọn các item tuần này
// làm → bấm "Xác nhận" → mỗi item đẻ 1 TASK MẸ ở Weekly Planning (y_tuong→da_trien_khai).
import { useEffect, useState } from 'react'
import { getBacklog, xacNhanTuan, type YTuongFull } from '../../lib/giaoviec'
import { GV, kyTuanHienTai, nhanKyTuan } from '../../lib/giaoviec-config'
import { CX_BTN, Section, Empty, ErrBar, fmtNgay } from './ui'

export default function BacklogTab({ laAdmin }: { laAdmin: boolean }) {
  const [items, setItems] = useState<YTuongFull[]>([])
  const [quaTran, setQuaTran] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [chon, setChon] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const ky = kyTuanHienTai()

  async function reload() {
    setLoading(true); setErr(null)
    try { const b = await getBacklog(); setItems(b.items); setQuaTran(b.quaTran); setChon(new Set()) }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  function toggle(id: string) {
    setChon((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  async function xacNhan() {
    if (!chon.size) return
    setSaving(true); setErr(null)
    try { await xacNhanTuan([...chon], ky); await reload() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <ErrBar msg={err} />
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <Section title={`Backlog — ${items.length} item (sort theo giá trị/cỡ)`} highlight={quaTran}
          right={<span className={`text-[11px] ${quaTran ? 'font-semibold text-amber-600' : 'text-slate-400'}`}>Trần WIP {GV.TRAN_WIP_BACKLOG}</span>}>
          {quaTran && <div className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-700">⚠ Backlog vượt trần {GV.TRAN_WIP_BACKLOG} item — nên chốt bớt hoặc để ngủ đông.</div>}
          {!items.length ? <Empty>Backlog rỗng. Duyệt ý tưởng ở tab Idea list, hoặc CEO tạo thẳng.</Empty> : (
            <>
              {items.map((r, i) => (
                <label key={r.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ${chon.has(r.id) ? 'ring-2 ring-indigo-400' : ''}`}>
                  {laAdmin && <input type="checkbox" checked={chon.has(r.id)} onChange={() => toggle(r.id)} className="h-4 w-4 accent-indigo-600" />}
                  <span className="w-5 text-center text-[12px] font-semibold text-slate-300">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800">{r.tieu_de}</div>
                    <div className="text-[12px] text-slate-500">Giá trị {r.gia_tri ?? '—'} · Cỡ {r.co ?? '—'} · {r.tac_gia_ten} · vào backlog {fmtNgay(r.ngay_vao_backlog)}</div>
                    {r.mo_ta && <div className="mt-0.5 text-[12px] text-slate-400">{r.mo_ta}</div>}
                  </div>
                </label>
              ))}
              {laAdmin && (
                <div className="sticky bottom-0 mt-3 flex items-center justify-between rounded-2xl border border-indigo-200 bg-white/95 p-3 shadow-sm backdrop-blur">
                  <span className="text-[13px] text-slate-600">Đã chọn <b>{chon.size}</b> việc cho {nhanKyTuan(ky)}</span>
                  <button disabled={!chon.size || saving} onClick={xacNhan} className={CX_BTN}>{saving ? 'Đang tạo…' : `✓ Xác nhận → Weekly Planning`}</button>
                </div>
              )}
            </>
          )}
        </Section>
      )}
    </div>
  )
}
