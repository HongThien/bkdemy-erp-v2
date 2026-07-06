import { useEffect, useState } from 'react'
import {
  getMyOpsTasks, dongOpsTask, buildReportMessage, TAN_MESSAGE, uploadOpsAnh,
  listOpsChoDuyet, duyetOpsHangLoat, deXuatTienDoOps, hieuSuatOpsOf, OPS_TASK_LABEL,
  type OpsTask, type OpsChoDuyet,
} from '../../lib/opsvanhanh'
import { readClipboardImageFile } from '../kho/ui'
import { tuanCuaNgay, khoangTuan, homNayVN, nhanTuan, mucDeadline, thuCuaNgay, ddmmVN } from '../../lib/tuan'
import { useIsMobile } from '../../hooks/useIsMobile'

const hhmm = (t: string) => t.slice(0, 5)
const DEADLINE_TONE: Record<string, string> = { qua_han: 'text-rose-600', sat: 'text-orange-600', gan: 'text-amber-600', con_nhieu: 'text-slate-400' }

export default function OpsReportScreen() {
  const [tab, setTab] = useState<'viec' | 'duyet'>('viec')
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#fafafb]">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-6">
        <span className="mr-3 py-2.5 text-sm font-semibold text-slate-900">Report &amp; Báo tan</span>
        {([['viec', 'Việc của tôi'], ['duyet', 'Leader duyệt']] as const).map(([k, lbl]) => (
          <button key={k} onClick={() => setTab(k)} className={`-mb-px border-b-2 px-3 py-2 text-[13px] font-medium ${tab === k ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{lbl}</button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{tab === 'viec' ? <ViecTab /> : <DuyetTab />}</div>
    </div>
  )
}

function ViecTab() {
  const [tuan, setTuan] = useState(tuanCuaNgay(homNayVN()))
  const [tasks, setTasks] = useState<OpsTask[]>([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => Date.now())
  const [openKey, setOpenKey] = useState<string | null>(null)
  // Ngày TƯƠNG LAI người dùng chủ động bấm mở xem trước — hôm nay + ngày đã qua (còn nợ) LUÔN mở sẵn.
  const [xemThem, setXemThem] = useState<Set<string>>(new Set())

  async function reload() {
    setLoading(true)
    try { const { tu, den } = khoangTuan(tuan); setTasks(await getMyOpsTasks(tu, den)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [tuan]) // eslint-disable-line
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id) }, [])

  const active = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)
  const dayMap = new Map<string, OpsTask[]>()
  for (const t of active) { const a = dayMap.get(t.ngay) ?? []; a.push(t); dayMap.set(t.ngay, a) }
  const dayGroups = [...dayMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const homNay = homNayVN()
  const toggleXem = (ngay: string) => setXemThem((s) => { const n = new Set(s); n.has(ngay) ? n.delete(ngay) : n.add(ngay); return n })

  const isMobile = useIsMobile()
  return (
    <div className={isMobile ? 'mx-auto max-w-[1100px] p-3' : 'mx-auto max-w-[1100px] p-6'}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="text-[20px] font-semibold text-slate-800">Việc report/báo tan của tôi</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setTuan((t) => t - 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">‹</button>
          <span className="min-w-[210px] text-center text-[15px] font-semibold text-slate-700">{nhanTuan(tuan)}</span>
          <button onClick={() => setTuan((t) => t + 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">›</button>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <>
          {active.length === 0 ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[13px] font-medium text-emerald-700">✓ Không còn việc report/báo tan cần làm tuần này.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {dayGroups.map(([ngay, list]) => {
                // Chỉ hôm nay + ngày ĐÃ QUA (còn nợ) mở sẵn — ngày tương lai gấp lại, bấm mới xem (đỡ rối mắt).
                const isFuture = ngay > homNay
                const expanded = !isFuture || xemThem.has(ngay)
                return (
                  <div key={ngay} className="rounded-2xl bg-white p-3 shadow-sm">
                    <button onClick={() => isFuture && toggleXem(ngay)} className={`mb-2 flex w-full items-center gap-2 border-l-4 border-indigo-400 pl-2 text-left text-[13px] font-semibold text-slate-600 ${isFuture ? 'cursor-pointer' : ''}`}>
                      <span>{thuCuaNgay(ngay)} · {ddmmVN(ngay)}</span>
                      <span className="font-normal text-slate-400">· {list.length} việc</span>
                      {isFuture && <span className="ml-auto text-[11px] font-normal text-indigo-500">{expanded ? '▾ Ẩn bớt' : '▸ Xem'}</span>}
                    </button>
                    {expanded && (
                      <div className="flex flex-col gap-2">
                        {list.map((t) => (
                          <TaskRow key={t.tkbId + t.tab} t={t} now={now} open={openKey === t.tkbId + t.tab} onToggle={() => setOpenKey((k) => (k === t.tkbId + t.tab ? null : t.tkbId + t.tab))} onDone={reload} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          <details className="mt-4">
            <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã xong tuần này ({done.length})</summary>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {done.map((t) => (
                <div key={t.tkbId + t.tab} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-[12px] text-slate-500 shadow-sm">
                  <span className="font-semibold text-slate-700">{OPS_TASK_LABEL[t.tab]}</span> · {t.lopTen} · {thuCuaNgay(t.ngay)} {ddmmVN(t.ngay)}
                </div>
              ))}
            </div>
          </details>
        </>
      )}
    </div>
  )
}

function TaskRow({ t, now, open, onToggle, onDone }: { t: OpsTask; now: number; open: boolean; onToggle: () => void; onDone: () => void }) {
  const [anhUrl, setAnhUrl] = useState<string | null>(t.anhUrl)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const muc = mucDeadline(t.deadline, now)
  const msg = t.tab === 'report' ? buildReportMessage(t.lopTen, t.thu, t.ngay, t.gioBatDau, t.gioKetThuc) : TAN_MESSAGE

  async function dan() {
    setErr(null)
    try { const f = await readClipboardImageFile(); if (!f) { setErr('Clipboard không có ảnh.'); return }; setBusy(true); setAnhUrl(await uploadOpsAnh(f)) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function chonFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setBusy(true); setErr(null)
    try { setAnhUrl(await uploadOpsAnh(f)) } catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  async function dong() {
    if (!anhUrl) { setErr('Cần ảnh evidence trước.'); return }
    setBusy(true); setErr(null)
    try { await dongOpsTask(t.tkbId, t.ngay, t.tab, anhUrl); onDone() }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60">
      <button onClick={onToggle} className="flex w-full items-center gap-2 px-3 py-3 text-left">
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">{OPS_TASK_LABEL[t.tab]}</span>
        <span className="text-[13px] font-medium text-slate-800">{t.lopTen}</span>
        <span className="text-[12px] text-slate-400">{hhmm(t.gioBatDau)}–{hhmm(t.gioKetThuc)} · {t.phong ?? '—'}</span>
        <span className={`ml-auto text-[12px] font-medium ${muc ? DEADLINE_TONE[muc] : ''}`}>{muc === 'qua_han' ? '⚠ Quá hạn' : muc === 'sat' ? 'Sát hạn' : ''}</span>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-3 py-2.5">
          <div className="mb-2 flex items-start gap-2 rounded-md bg-white p-2 text-[13px] text-slate-700">
            <span className="flex-1">{msg}</span>
            <button onClick={() => navigator.clipboard.writeText(msg)} className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-indigo-300">📋 Copy</button>
          </div>
          <div className={isMobile ? 'flex flex-col gap-2' : 'flex items-center gap-2'}>
            <div className={isMobile ? 'flex items-center gap-2' : 'contents'}>
              {/* Dán clipboard chỉ đáng tin trên desktop — mobile browser đọc clipboard ảnh không ổn định, ẩn bớt cho gọn. */}
              {!isMobile && <button onClick={dan} disabled={busy} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-50">📋 Dán ảnh</button>}
              {/* capture="environment" → mobile mở thẳng camera sau thay vì trình chọn file chung. */}
              <label className={isMobile ? 'flex-1 cursor-pointer rounded-lg border border-slate-300 px-3 py-3 text-center text-[14px] font-medium text-slate-700 active:bg-slate-100' : 'cursor-pointer rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300'}>
                {isMobile ? '📸 Chụp ảnh' : '📎 Chọn ảnh'}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={chonFile} />
              </label>
              {anhUrl && <img src={anhUrl} className={isMobile ? 'h-12 w-12 shrink-0 rounded object-cover ring-1 ring-slate-200' : 'h-9 w-9 rounded object-cover ring-1 ring-slate-200'} />}
            </div>
            <button onClick={dong} disabled={busy || !anhUrl} className={isMobile ? 'rounded-lg bg-indigo-600 px-3 py-3 text-[14px] font-semibold text-white disabled:opacity-40' : 'ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40'}>Đóng task</button>
          </div>
          {err && <p className="mt-1.5 text-[12px] text-rose-600">{err}</p>}
        </div>
      )}
    </div>
  )
}

function DuyetTab() {
  const [tuan, setTuan] = useState(tuanCuaNgay(homNayVN()))
  const [rows, setRows] = useState<OpsChoDuyet[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  async function reload() {
    setLoading(true)
    try { const { tu, den } = khoangTuan(tuan); setRows(await listOpsChoDuyet(tu, den)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [tuan]) // eslint-disable-line

  async function duyetTatCa() {
    setBusy(true)
    try { await duyetOpsHangLoat(rows, 100); await reload() } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="mx-auto max-w-[900px] p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="text-[20px] font-semibold text-slate-800">Leader duyệt</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setTuan((t) => t - 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">‹</button>
          <span className="min-w-[210px] text-center text-[15px] font-semibold text-slate-700">{nhanTuan(tuan)}</span>
          <button onClick={() => setTuan((t) => t + 1)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-[16px] leading-none text-slate-600 hover:border-indigo-300">›</button>
        </div>
      </div>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : rows.length === 0 ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[13px] font-medium text-emerald-700">✓ Không còn gì chờ duyệt tuần này.</div>
      ) : (
        <>
          <button onClick={duyetTatCa} disabled={busy} className="mb-3 rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">✓ Duyệt tất cả theo đề xuất (auto-pass 100%)</button>
          <div className="flex flex-col gap-1.5">
            {rows.map((r) => {
              const tienDo = deXuatTienDoOps(r.doneAt, r.deadline)
              return (
                <div key={r.tkbId + r.ngay + r.tab} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[13px] shadow-sm">
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">{OPS_TASK_LABEL[r.tab]}</span>
                  <span className="font-medium text-slate-800">{r.lopTen}</span>
                  <span className="text-slate-400">{thuCuaNgay(r.ngay)} {ddmmVN(r.ngay)}</span>
                  <span className="text-slate-500">{r.nhanSuTen}</span>
                  <span className="ml-auto text-[12px] font-medium text-slate-600">{tienDo.label} · Hiệu suất dự kiến {hieuSuatOpsOf(r, 100)}%</span>
                  {r.anhUrl && <img src={r.anhUrl} className="h-7 w-7 rounded object-cover ring-1 ring-slate-200" />}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
