// Dashboard "Xem app phụ huynh" (leaf `db_xemapp`) — chọn HS ở danh sách trái → nhúng thẳng
// app Cổng Phụ huynh của em đó (chế độ xem admin, token có hạn) ở khung điện thoại bên phải.
// Nhớ HS xem gần nhất (localStorage) → vào là hiện luôn.
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getPreviewUrl } from '../../lib/ph-login'
import { tenHienThiDs } from '../../lib/hoten'

type HS = { id: string; ho_ten: string; ma_hs: string | null; phId: string; phName: string }
const LAST_KEY = 'xemapp_last_hs'

export default function XemAppScreen() {
  const [list, setList] = useState<HS[]>([])
  const [q, setQ] = useState('')
  const [selId, setSelId] = useState<string | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [loadingSrc, setLoadingSrc] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [loadingList, setLoadingList] = useState(true)

  // Nạp danh sách HS (có phụ huynh) từ DB ERP.
  useEffect(() => {
    void (async () => {
      setLoadingList(true)
      try {
        const { data, error } = await supabase.from('hoc_sinh')
          .select('id, ho_ten, ma_hs, phu_huynh_id, phu_huynh:phu_huynh_id(ho_ten)')
          .not('phu_huynh_id', 'is', null)
          .order('ho_ten')
          .limit(10000)
        if (error) throw error
        const rows: HS[] = ((data ?? []) as any[])
          .filter((r) => r.phu_huynh_id)
          .map((r) => ({ id: r.id, ho_ten: r.ho_ten, ma_hs: r.ma_hs ?? null, phId: r.phu_huynh_id, phName: r.phu_huynh?.ho_ten ?? '' }))
        setList(rows)
        // HS xem gần nhất — vào là hiện luôn.
        const last = localStorage.getItem(LAST_KEY)
        const found = last ? rows.find((r) => r.id === last) : null
        if (found) void openHS(found)
      } catch (e) {
        setErr((e as Error).message ?? String(e))
      } finally {
        setLoadingList(false)
      }
    })()
  }, []) // eslint-disable-line

  async function openHS(hs: HS) {
    setSelId(hs.id); setErr(null); setLoadingSrc(true); setSrc(null)
    localStorage.setItem(LAST_KEY, hs.id)
    try {
      setSrc(await getPreviewUrl(hs.phId))
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setLoadingSrc(false)
    }
  }

  const shown = useMemo(() => {
    const kw = q.trim().toLowerCase()
    if (!kw) return list
    return list.filter((r) => r.ho_ten.toLowerCase().includes(kw) || r.phName.toLowerCase().includes(kw) || (r.ma_hs ?? '').toLowerCase().includes(kw))
  }, [list, q])

  const sel = list.find((r) => r.id === selId) ?? null
  const tenHT = useMemo(() => tenHienThiDs(shown.map((r) => r.ho_ten)), [shown])

  return (
    <div className="flex h-full min-w-0 bg-[#f5f5f7]">
      {/* CỘT TRÁI: danh sách HS */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-3">
          <div className="mb-2 text-sm font-bold text-slate-800">Xem app phụ huynh</div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên HS / phụ huynh / mã…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-indigo-400" />
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {loadingList ? <p className="p-3 text-[13px] text-slate-400">Đang tải…</p>
            : shown.length === 0 ? <p className="p-3 text-[13px] text-slate-400">Không có học sinh phù hợp.</p>
            : shown.map((r, i) => (
              <button key={r.id} onClick={() => void openHS(r)} title={`${r.ho_ten} · PH ${r.phName}`}
                className={`flex w-full flex-col items-start px-3 py-2 text-left ${r.id === selId ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                <span className="text-[13px] font-semibold">{tenHT[i]}</span>
                <span className="text-[11px] text-slate-400">{r.phName ? `PH: ${r.phName}` : '—'}{r.ma_hs ? ` · ${r.ma_hs}` : ''}</span>
              </button>
            ))}
        </div>
        <div className="border-t border-slate-200 px-3 py-2 text-[11px] text-slate-400">{shown.length} học sinh</div>
      </aside>

      {/* CỘT PHẢI: khung điện thoại nhúng app */}
      <div className="flex min-w-0 flex-1 flex-col items-center overflow-auto p-6">
        {!sel ? (
          <div className="m-auto max-w-sm text-center text-sm text-slate-400">
            <div className="mb-2 text-4xl">📱</div>
            Chọn một học sinh ở danh sách bên trái để xem đúng những gì phụ huynh của em đó nhìn thấy trong app.
          </div>
        ) : (
          <>
            <div className="mb-3 flex w-full max-w-[420px] items-center gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-800">{sel.ho_ten}</div>
                <div className="truncate text-[12px] text-slate-500">PH: {sel.phName || '—'}</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <button onClick={() => void openHS(sel)} title="Tải lại" className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-400">↻</button>
                {src && <a href={src} target="_blank" rel="noopener" className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-400">Mở tab ↗</a>}
              </div>
            </div>
            {err && <div className="mb-3 w-full max-w-[420px] rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700 ring-1 ring-rose-200">{err}</div>}
            {/* Khung điện thoại */}
            <div className="relative overflow-hidden rounded-[34px] border-[10px] border-slate-800 bg-black shadow-2xl" style={{ width: 400, height: 'min(820px, calc(100vh - 150px))' }}>
              {loadingSrc && <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50 text-sm text-slate-400">Đang mở app…</div>}
              {src && <iframe key={src} src={src} title="App phụ huynh" className="h-full w-full border-0 bg-white" />}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">Chế độ xem (admin) · read-only · học phí xem ở app thật.</p>
          </>
        )}
      </div>
    </div>
  )
}
