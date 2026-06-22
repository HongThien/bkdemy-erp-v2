// Màn "Báo lỗi" (auto-report Pha 1) — Thùy DUYỆT cổng 2: report nào cho AI fix / từ chối / để tự làm.
// Queue + lọc trạng thái + xem context/ảnh + đổi trạng thái. (Bước 3-4 sẽ nối luồng fix sau.)
import { useEffect, useMemo, useState } from 'react'
import { listBaoLoi, setTrangThaiBaoLoi, deleteBaoLoi, type BaoLoi, type TrangThaiBaoLoi } from '../../lib/baoloi'

const TT: Record<TrangThaiBaoLoi, { l: string; cls: string }> = {
  moi: { l: 'Mới', cls: 'bg-amber-100 text-amber-700' },
  cho_fix: { l: 'Cho fix', cls: 'bg-indigo-100 text-indigo-700' },
  tu_choi: { l: 'Từ chối', cls: 'bg-slate-100 text-slate-500' },
  tu_lam: { l: 'Để tự làm', cls: 'bg-slate-100 text-slate-600' },
  da_fix: { l: 'Đã fix · chờ apply', cls: 'bg-violet-100 text-violet-700' },
  xong: { l: 'Xong', cls: 'bg-emerald-100 text-emerald-700' },
  tra_lai: { l: 'Trả lại', cls: 'bg-rose-100 text-rose-700' },
}
const fmt = (iso: string) => new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
const FILTERS: { v: 'all' | TrangThaiBaoLoi; l: string }[] = [
  { v: 'all', l: 'Tất cả' }, { v: 'moi', l: 'Mới' }, { v: 'cho_fix', l: 'Cho fix' },
  { v: 'da_fix', l: 'Đã fix' }, { v: 'xong', l: 'Xong' },
]

export default function BaoLoiScreen() {
  const [rows, setRows] = useState<BaoLoi[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | TrangThaiBaoLoi>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  async function reload() { setLoading(true); setErr(null); try { setRows(await listBaoLoi()) } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [])

  const shown = useMemo(() => rows.filter((r) => filter === 'all' || r.trang_thai === filter), [rows, filter])
  const dem = (v: TrangThaiBaoLoi) => rows.filter((r) => r.trang_thai === v).length

  async function doiTT(id: string, tt: TrangThaiBaoLoi, ghiChu?: string) {
    await setTrangThaiBaoLoi(id, tt, ghiChu !== undefined ? { ghi_chu_duyet: ghiChu } : undefined)
    reload()
  }
  const tab = (on: boolean) => `h-7 rounded-md px-2.5 text-xs font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Quản lý báo lỗi</span>
        {FILTERS.map((f) => <button key={f.v} onClick={() => setFilter(f.v)} className={tab(filter === f.v)}>{f.l}{f.v !== 'all' && dem(f.v as TrangThaiBaoLoi) ? ` (${dem(f.v as TrangThaiBaoLoi)})` : ''}</button>)}
        <button onClick={reload} className="rounded-md border border-slate-300 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">↻ Tải lại</button>
        <span className="ml-auto text-[12px] text-slate-400">Tổng {rows.length} · Cổng 2: duyệt report nào cho AI fix tự động.</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-6">
        {err && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi tải danh sách: {err}</div>}
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có báo lỗi nào.</div>
          : (
            <div className="mx-auto max-w-[760px] space-y-2">
              {shown.map((r) => {
                const expand = openId === r.id
                const ctx = (r.context ?? {}) as Record<string, any>
                return (
                  <div key={r.id} className="rounded-xl border border-slate-200 bg-white">
                    <button onClick={() => setOpenId(expand ? null : r.id)} className="flex w-full items-start gap-3 px-4 py-3 text-left">
                      <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TT[r.trang_thai].cls}`}>{TT[r.trang_thai].l}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-medium text-slate-800">{r.mo_ta}</div>
                        <div className="mt-0.5 text-[11px] text-slate-400">{ctx.nguoi ?? ctx.email ?? '?'} · màn <b className="font-mono text-slate-500">{r.route ?? '—'}</b> · {fmt(r.created_at)}</div>
                      </div>
                      <span className="shrink-0 text-slate-300">{expand ? '▲' : '▼'}</span>
                    </button>

                    {expand && (
                      <div className="border-t border-slate-100 px-4 py-3">
                        <div className="whitespace-pre-wrap text-[13px] text-slate-700">{r.mo_ta}</div>
                        {r.anh_url && <a href={r.anh_url} target="_blank" rel="noreferrer"><img src={r.anh_url} alt="" className="mt-2 max-h-72 rounded-lg border border-slate-200" /></a>}

                        <details className="mt-2 text-[12px] text-slate-500">
                          <summary className="cursor-pointer select-none">Thông tin kỹ thuật đính kèm</summary>
                          <div className="mt-1 space-y-0.5">
                            <div>URL: <span className="break-all font-mono text-slate-400">{ctx.url ?? '—'}</span></div>
                            <div>Viewport: {ctx.viewport ?? '—'} · admin: {String(ctx.la_admin ?? '—')}</div>
                            <div>UA: <span className="break-all text-slate-400">{ctx.user_agent ?? '—'}</span></div>
                            {Array.isArray(ctx.loi_gan_day) && ctx.loi_gan_day.length > 0 && (
                              <div>Lỗi console gần đây:<ul className="ml-3 list-disc font-mono text-[11px] text-rose-500">{ctx.loi_gan_day.map((m: string, i: number) => <li key={i} className="break-all">{m}</li>)}</ul></div>
                            )}
                          </div>
                        </details>
                        {r.ghi_chu_duyet && <div className="mt-2 text-[12px] text-slate-500">Ghi chú duyệt: <i>{r.ghi_chu_duyet}</i></div>}
                        {r.fix_note && <div className="mt-1 text-[12px] text-violet-600">Fix: {r.fix_note}</div>}
                        {r.pr_url && <a href={r.pr_url} target="_blank" rel="noreferrer" className="mt-1 block text-[12px] text-indigo-600 underline">Xem PR</a>}

                        {/* CỔNG 2 + các bước sau */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {r.trang_thai === 'moi' && <>
                            <button onClick={() => doiTT(r.id, 'cho_fix')} className="rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-indigo-500">✓ Cho AI fix</button>
                            <button onClick={() => doiTT(r.id, 'tu_lam')} className="rounded-md border border-slate-300 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-400">Để tự làm</button>
                            <button onClick={() => { const g = prompt('Lý do từ chối (tuỳ):') ?? ''; doiTT(r.id, 'tu_choi', g) }} className="rounded-md border border-slate-300 px-3 py-1.5 text-[12px] font-medium text-slate-500 hover:border-rose-300 hover:text-rose-600">Từ chối</button>
                          </>}
                          {r.trang_thai === 'cho_fix' && <button onClick={() => doiTT(r.id, 'moi')} className="rounded-md border border-amber-300 px-3 py-1.5 text-[12px] font-medium text-amber-700 hover:bg-amber-50">↩ Bỏ duyệt (về Mới)</button>}
                          {r.trang_thai === 'da_fix' && <>
                            <button onClick={() => doiTT(r.id, 'xong')} className="rounded-md bg-emerald-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-emerald-500">✓ Đã apply (xong)</button>
                            <button onClick={() => { const g = prompt('Trả lại để sửa tiếp — ghi chú:') ?? ''; doiTT(r.id, 'tra_lai', g) }} className="rounded-md border border-rose-300 px-3 py-1.5 text-[12px] font-medium text-rose-600 hover:bg-rose-50">↩ Trả lại</button>
                          </>}
                          <button onClick={async () => { if (confirm('Xoá báo lỗi này?')) { await deleteBaoLoi(r.id); reload() } }} className="ml-auto rounded-md border border-slate-200 px-3 py-1.5 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">Xoá</button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
      </div>
    </div>
  )
}
