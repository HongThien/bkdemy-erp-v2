// Tab KHO BÀI — pool bài chưa có lời giải của MÔN đang chọn, chưa ai (kể cả Claude) giữ. Bấm "Nhận giải" → bài rời
// pool, về "Bài của tôi". DB chặn: >3 bài đang giữ · bài vừa bị người khác nhận · bị từ chối 3 lần bài đó.
import { useEffect, useRef, useState } from 'react'
import { KHOI_OPTIONS } from '../../lib/kho/api'
import { listPool, demPool, nhanBai, nhanhCuaMon, NHANH_LABEL, type BaiChuaGiai, type DemPool, type GiaiBaiNhanh } from '../../lib/giaibai'
import { BaiBody, BaiHead, NhomHead } from './BaiCard'

const readKhoi = () => { const k = localStorage.getItem('giaibai.khoi'); return k && (KHOI_OPTIONS as readonly string[]).includes(k) ? k : '8' }

export default function KhoBai({ mon, me, dangGiu, onChanged }: { mon: string; me: string; dangGiu: number; onChanged: () => void }) {
  const NHANH = nhanhCuaMon(mon)
  const [khoi, setKhoi] = useState(readKhoi)
  const [nhanh, setNhanh] = useState<GiaiBaiNhanh | 'all'>('all')
  const [all, setAll] = useState<BaiChuaGiai[]>([])
  const [dem, setDem] = useState<DemPool[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const reqId = useRef(0)
  useEffect(() => { localStorage.setItem('giaibai.khoi', khoi) }, [khoi])

  async function reload() {
    const my = ++reqId.current
    setLoading(true); setErr(null)
    try {
      const [rows, d] = await Promise.all([listPool(NHANH, khoi), demPool(NHANH)])
      if (my !== reqId.current) return
      setAll(rows); setDem(d)
    } catch (e: any) { if (my === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (my === reqId.current) setLoading(false) }
  }
  useEffect(() => { setAll([]); setNhanh('all'); reload() }, [mon, khoi]) // eslint-disable-line

  const rows = nhanh === 'all' ? all : all.filter((r) => r.nhanh === nhanh)
  const demNhanh = (n: GiaiBaiNhanh) => all.filter((r) => r.nhanh === n).length
  const soKhoi = (k: string) => dem.find((d) => d.khoi === k)?.so_bai ?? 0

  async function onNhan(r: BaiChuaGiai) {
    setBusyKey(r.key)
    try { await nhanBai(r.nhanh, r.key, me); setAll((a) => a.filter((x) => x.key !== r.key || x.nhanh !== r.nhanh)); onChanged() }
    catch (e: any) { alert(e.message ?? String(e)); await reload() }
    finally { setBusyKey(null) }
  }

  const groups: { key: string; head: BaiChuaGiai; items: BaiChuaGiai[] }[] = []
  for (const r of rows) {
    const g = groups[groups.length - 1]
    const gk = `${r.nhanh}:${r.nhom_ma}`
    if (g && g.key === gk) g.items.push(r); else groups.push({ key: gk, head: r, items: [r] })
  }
  const chip = (n: GiaiBaiNhanh | 'all', label: string, count: number) => (
    <button key={n} onClick={() => setNhanh(n)}
      className={`rounded-full px-3 py-0.5 text-[12px] font-medium transition ${nhanh === n ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'} ${count === 0 && n !== 'all' ? 'opacity-50' : ''}`}>
      {label} <span className={nhanh === n ? 'text-indigo-200' : 'text-slate-400'}>{count}</span>
    </button>
  )
  const daDu = dangGiu >= 3

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <div className="flex items-center gap-1">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Khối</span>
          {KHOI_OPTIONS.map((k) => {
            const n = soKhoi(k), active = khoi === k
            return (
              <button key={k} onClick={() => setKhoi(k)} title={`Khối ${k} · ${n} bài chưa có lời giải`}
                className={`relative h-7 min-w-7 rounded-md px-1.5 text-xs font-semibold transition ${active ? 'bg-indigo-600 text-white shadow-sm' : n ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-100'}`}>
                {k}{n > 0 && !active && <span className="absolute -right-1 -top-1 rounded-full bg-amber-400 px-1 text-[9px] font-bold leading-3 text-white">{n > 99 ? '99+' : n}</span>}
              </button>
            )
          })}
        </div>
        {NHANH.length > 1 && (
          <div className="flex items-center gap-1.5">
            {chip('all', 'Tất cả', all.length)}
            {NHANH.map((n) => chip(n, NHANH_LABEL[n], demNhanh(n)))}
          </div>
        )}
        <span className="ml-auto text-[12px] text-slate-500">
          <b className="text-slate-800">{rows.length}</b> bài đang chờ người giải · bạn đang giữ <b className={daDu ? 'text-rose-600' : 'text-indigo-700'}>{dangGiu}/3</b>
        </span>
      </div>
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : rows.length === 0 ? <p className="text-sm text-slate-400">Khối {khoi}{nhanh !== 'all' ? ` · ${NHANH_LABEL[nhanh]}` : ''}: không còn bài nào chờ người giải. 🎉</p>
          : groups.map((g) => (
            <section key={g.key} className="mb-6">
              <NhomHead b={g.head} soBai={g.items.length} />
              <ul className="space-y-3">
                {g.items.map((r) => (
                  <li key={`${r.nhanh}:${r.key}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <BaiHead b={r} right={
                      <button onClick={() => onNhan(r)} disabled={busyKey === r.key || daDu}
                        title={daDu ? 'Đang giữ đủ 3 bài — nộp hoặc trả bớt rồi nhận thêm' : 'Nhận bài này về danh sách của bạn (hạn 48h)'}
                        className="rounded-md bg-indigo-600 px-3 py-1 text-[12px] font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">
                        {busyKey === r.key ? '⏳…' : '✋ Nhận giải'}
                      </button>
                    } />
                    <BaiBody b={r} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  )
}
