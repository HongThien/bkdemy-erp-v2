// Dashboard "Đăng nhập Phụ huynh" (leaf `db_phdangnhap`) — bộ đo ai đã/chưa đăng nhập
// Cổng Phụ huynh, + reset mật khẩu về 123456 khi PH quên.
// Dữ liệu login nằm ở project bkdemy-ph (auth.users) → gọi endpoint ph-app, xác thực bằng
// chính JWT staff ERP (ph-app verify qua Supabase ERP). ERP chỉ đọc, không giữ secret.
import { useEffect, useMemo, useState } from 'react'
import { fetchPhLogins, resetPhPassword, type PhLoginRow as Row, type PhLoginSummary as Summary } from '../../lib/ph-login'

type TrangThai = 'chua' | 'chua_doi' | 'da_dung'
function trangThaiOf(r: Row): TrangThai {
  if (!r.has_account || !r.last_sign_in_at) return 'chua'
  if (r.must_change_password) return 'chua_doi'
  return 'da_dung'
}
const TT_UI: Record<TrangThai, { ten: string; cls: string }> = {
  chua: { ten: 'Chưa đăng nhập', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
  chua_doi: { ten: 'Đã vào · chưa đổi MK', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  da_dung: { ten: 'Đang dùng', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
}

function fmtNgay(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// Vòng tròn tỉ lệ đăng nhập (SVG).
function Donut({ pct, label }: { pct: number; label: string }) {
  const R = 34, C = 2 * Math.PI * R
  const on = (Math.min(100, Math.max(0, pct)) / 100) * C
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle cx="40" cy="40" r={R} fill="none" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${on} ${C - on}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-indigo-700">{pct}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      </div>
    </div>
  )
}

function StatTile({ n, label, tone }: { n: number; label: string; tone: string }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200">
      <div className={`text-2xl font-bold ${tone}`}>{n}</div>
      <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
    </div>
  )
}

export default function PhDangNhapScreen() {
  const [rows, setRows] = useState<Row[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'chua' | 'da'>('all')
  const [resetting, setResetting] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  async function load() {
    setLoading(true); setErr(null)
    try {
      const j = await fetchPhLogins()
      setRows(j.parents ?? [])
      setSummary(j.summary ?? null)
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { void load() }, [])

  async function doReset(r: Row) {
    if (!window.confirm(`Reset mật khẩu của "${r.ho_ten}" (${r.so_dien_thoai}) về 123456?\nPhụ huynh sẽ được yêu cầu đổi mật khẩu ở lần đăng nhập kế tiếp.`)) return
    setResetting(r.phu_huynh_id)
    try {
      const j = await resetPhPassword(r.phu_huynh_id)
      setToast(j.reset ? `✓ Đã reset ${r.ho_ten} về 123456` : `${r.ho_ten} chưa có tài khoản — sẽ tự dùng 123456 khi đăng nhập lần đầu.`)
      void load()
    } catch (e) {
      setToast('⚠️ ' + (e as Error).message)
    } finally {
      setResetting(null)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const shown = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return rows.filter((r) => {
      const tt = trangThaiOf(r)
      if (filter === 'chua' && tt !== 'chua') return false
      if (filter === 'da' && tt === 'chua') return false
      if (!kw) return true
      return (r.ho_ten || '').toLowerCase().includes(kw) || (r.so_dien_thoai || '').includes(kw)
    })
  }, [rows, q, filter])

  const pct = summary && summary.total ? Math.round((summary.loggedIn / summary.total) * 100) : 0
  const chuaCount = summary ? summary.total - summary.loggedIn : 0

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Đăng nhập Phụ huynh</h1>
          <button onClick={() => void load()} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-indigo-400">↻ Tải lại</button>
        </div>
        <p className="mb-5 text-sm text-slate-500">Theo dõi phụ huynh đã / chưa đăng nhập Cổng Phụ huynh và reset mật khẩu khi cần.</p>

        {err && <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{err}</div>}

        {summary && (
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200">
              <Donut pct={pct} label="đã đăng nhập" />
              <div className="text-sm text-slate-500">
                <div><b className="text-slate-800">{summary.loggedIn}</b>/{summary.total} phụ huynh đã đăng nhập</div>
                <div className="mt-1 text-xs">Đủ điều kiện = có số điện thoại trong hệ thống.</div>
              </div>
            </div>
            <StatTile n={chuaCount} label="Chưa đăng nhập" tone="text-rose-600" />
            <StatTile n={summary.loggedIn} label="Đã đăng nhập" tone="text-emerald-600" />
            <StatTile n={summary.loggedIn - summary.changedPw} label="Chưa đổi mật khẩu" tone="text-amber-600" />
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên hoặc SĐT…"
            className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          <div className="flex overflow-hidden rounded-lg ring-1 ring-slate-200">
            {([['all', 'Tất cả'], ['chua', 'Chưa đăng nhập'], ['da', 'Đã đăng nhập']] as const).map(([k, t]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-3 py-2 text-sm font-medium transition ${filter === k ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>{t}</button>
            ))}
          </div>
          <span className="ml-auto text-sm text-slate-400">{shown.length} phụ huynh</span>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-semibold">Phụ huynh</th>
                <th className="px-4 py-3 font-semibold">Số điện thoại</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Đăng nhập gần nhất</th>
                <th className="px-4 py-3 text-right font-semibold">Hỗ trợ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">Đang tải…</td></tr>
              ) : shown.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">Không có phụ huynh phù hợp.</td></tr>
              ) : shown.map((r) => {
                const tt = trangThaiOf(r)
                return (
                  <tr key={r.phu_huynh_id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-800">{r.ho_ten || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{r.so_dien_thoai}</td>
                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${TT_UI[tt].cls}`}>{TT_UI[tt].ten}</span></td>
                    <td className="px-4 py-3 text-slate-500">{fmtNgay(r.last_sign_in_at)}</td>
                    <td className="px-4 py-3 text-right">
                      {r.has_account ? (
                        <button disabled={resetting === r.phu_huynh_id} onClick={() => void doReset(r)}
                          className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-rose-400 hover:text-rose-600 disabled:opacity-40">
                          {resetting === r.phu_huynh_id ? 'Đang reset…' : 'Reset về 123456'}
                        </button>
                      ) : <span className="text-xs text-slate-300">chưa có tài khoản</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium text-white shadow-lg">{toast}</div>
      )}
    </section>
  )
}
