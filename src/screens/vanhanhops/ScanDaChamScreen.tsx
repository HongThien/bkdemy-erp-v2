// Scan bài đã chấm (Ops) — TASK MỚI (BKDEMY_TESTDAUVAO_SPEC_ADDENDUM.md §1 Task 3). Người chấm khoanh
// Đ/C/S trên GIẤY xong → đưa Ops → Ops scan/chụp → upload. ĐỘC LẬP với Chấm (không ép thứ tự) — người
// chấm có thể đưa scan trước/nhập liệu sau hoặc ngược lại, cùng đổ vào Trả bài (đủ cả 2 mới đóng được).
import { useState, useEffect } from 'react'
import { listCanScanDaCham, listDaScanDaCham, dongScanDaCham, type CaTestChoScanDaCham } from '../../lib/detest'
import { uploadCaTestBai } from '../../lib/tuyensinh'

export default function ScanDaChamScreen() {
  const [queue, setQueue] = useState<CaTestChoScanDaCham[]>([])
  const [done, setDone] = useState<CaTestChoScanDaCham[]>([])
  const [loading, setLoading] = useState(true)

  async function reload() {
    setLoading(true)
    try { const [a, b] = await Promise.all([listCanScanDaCham(), listDaScanDaCham()]); setQueue(a); setDone(b) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-[900px] p-6">
        <h2 className="mb-1 text-[20px] font-semibold text-slate-800">Scan bài đã chấm</h2>
        <p className="mb-4 text-[12px] text-slate-400">Người chấm khoanh Đ/C/S trên giấy xong, đưa Ops scan/chụp → upload. Độc lập với Chấm — không cần chờ nhau, cùng đổ vào Trả bài.</p>

        {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : queue.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không còn bài nào cần scan.</div>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {queue.map((c) => <ScanCard key={c.id} c={c} onChanged={reload} />)}
          </div>
        )}

        {done.length > 0 && (
          <details className="mt-5">
            <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã scan ({done.length})</summary>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {done.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-[12px] text-slate-500 shadow-sm">
                  <span className="font-semibold text-slate-700">{c.hoTenHs}</span> · {c.mon}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

function ScanCard({ c, onChanged }: { c: CaTestChoScanDaCham; onChanged: () => void }) {
  const [url, setUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function chonFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setBusy(true); setErr(null)
    try { setUrl(await uploadCaTestBai(f)) } catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  async function dong() {
    if (!url) return
    setBusy(true); setErr(null)
    try { await dongScanDaCham(c.id, url); onChanged() } catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
      <div className="text-[14px] font-semibold text-slate-800">{c.hoTenHs}</div>
      <div className="mb-2 text-[12px] text-slate-400">{c.mon}{c.khoi ? ` · Lớp ${c.khoi}` : ''} · {new Date(c.ngay + 'T00:00:00').toLocaleDateString('vi-VN')}</div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">
          {url ? '📄 Đổi ảnh' : '📎 Chọn ảnh/scan'}
          <input type="file" accept="application/pdf,image/*" className="hidden" onChange={chonFile} disabled={busy} />
        </label>
        {url && <a href={url} target="_blank" rel="noreferrer" className="text-[12px] text-indigo-500 hover:underline">Xem file</a>}
        <button onClick={dong} disabled={busy || !url} className="ml-auto rounded-md bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">✓ Xác nhận</button>
      </div>
      {err && <p className="mt-1.5 text-[12px] text-rose-600">{err}</p>}
    </div>
  )
}
