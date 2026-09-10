// Dashboard "Đăng nhập Phụ huynh" (leaf `db_phdangnhap`) — bộ đo PH DÙNG app Cổng Phụ huynh:
// ai chưa vào / ai đang dùng / ai lâu không vào · lần đăng nhập + hoạt động gần nhất · màn hình đã xem.
// Nhân sự dùng để follow từng PH. + reset mật khẩu về 123456 khi PH quên, + xem app như PH.
// Dữ liệu ở project bkdemy-ph (auth.users + ph_xem + FDW erp_live) → endpoint ph-app, hàm Postgres
// admin_parent_usage tính sẵn mọi thứ (trạng thái, hoạt động cuối, đếm theo màn). ERP chỉ hiển thị.
import { useEffect, useMemo, useState } from 'react'
import {
  fetchPhLogins, resetPhPassword, openPreviewApp, PH_MAN_HINH, PH_TAB,
  type PhLoginRow as Row, type PhLoginSummary as Summary, type PhTrangThai,
} from '../../lib/ph-login'

const TT_UI: Record<PhTrangThai, { ten: string; cls: string; dot: string }> = {
  chua: { ten: 'Chưa vào', cls: 'bg-rose-50 text-rose-700 ring-rose-200', dot: 'bg-rose-500' },
  chua_doi: { ten: 'Đã vào · chưa đổi MK', cls: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
  dang_dung: { ten: 'Đang dùng', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  lau: { ten: 'Lâu không vào', cls: 'bg-slate-100 text-slate-600 ring-slate-300', dot: 'bg-slate-400' },
}
type Filter = 'all' | PhTrangThai
const FILTERS: [Filter, string][] = [['all', 'Tất cả'], ['chua', 'Chưa vào'], ['lau', 'Lâu không vào'], ['chua_doi', 'Chưa đổi MK'], ['dang_dung', 'Đang dùng']]

function fmtNgay(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}
// "3 ngày trước" — chỉ để đọc nhanh, tooltip có ngày giờ đủ.
function fmtCach(iso: string | null): string {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.floor(ms / 60000)
  if (m < 1) return 'vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} ngày trước`
  return `${Math.floor(d / 30)} tháng trước`
}
function tenManHinh(k: string | null, tab?: string | null): string {
  if (!k) return ''
  const ten = PH_MAN_HINH[k as keyof typeof PH_MAN_HINH] ?? k
  return tab && PH_TAB[tab] ? `${ten} · ${PH_TAB[tab]}` : ten
}
// Top màn hình trong 30 ngày (sort thuần theo số đã tính sẵn ở DB — chỉ để hiển thị).
function topMan(x: Record<string, number>, n = 3): [string, number][] {
  return Object.entries(x ?? {}).sort((a, b) => b[1] - a[1]).slice(0, n)
}

// Vòng tròn tỉ lệ (SVG).
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

function StatTile({ n, label, tone, active, onClick }: { n: number; label: string; tone: string; active?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-2xl bg-white px-5 py-4 text-left ring-1 transition ${active ? 'ring-2 ring-indigo-500' : 'ring-slate-200 hover:ring-indigo-300'}`}>
      <div className={`text-2xl font-bold ${tone}`}>{n}</div>
      <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
    </button>
  )
}

export default function PhDangNhapScreen() {
  const [rows, setRows] = useState<Row[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [resetting, setResetting] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  async function load() {
    setLoading(true); setErr(null)
    try {
      const j = await fetchPhLogins()
      setRows(j.parents ?? [])
      setSummary(j.summary)
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
      // Vá tại chỗ: reset ⇒ PH sẽ phải đổi MK ở lần vào tới. Không quét lại cả danh sách.
      if (j.reset) setRows((prev) => prev.map((x) => (x.phu_huynh_id === r.phu_huynh_id ? { ...x, must_change_password: true, trang_thai: x.trang_thai === 'chua' ? 'chua' : 'chua_doi' } : x)))
    } catch (e) {
      setToast('⚠️ ' + (e as Error).message)
    } finally {
      setResetting(null)
      setTimeout(() => setToast(null), 4000)
    }
  }

  async function openPreview(r: Row) {
    try {
      await openPreviewApp(r.phu_huynh_id)
    } catch (e) {
      setToast('⚠️ ' + (e as Error).message)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const shown = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return rows.filter((r) => {
      if (filter !== 'all' && r.trang_thai !== filter) return false
      if (!kw) return true
      const con = (r.con ?? []).map((c) => `${c.ho_ten} ${c.lop}`).join(' ').toLowerCase()
      return (r.ho_ten || '').toLowerCase().includes(kw) || (r.so_dien_thoai || '').includes(kw) || con.includes(kw)
    })
  }, [rows, q, filter])

  const pct = summary && summary.total ? Math.round((summary.loggedIn / summary.total) * 100) : 0
  const toggle = (f: Filter) => setFilter((cur) => (cur === f ? 'all' : f))

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Đăng nhập Phụ huynh</h1>
          <button onClick={() => void load()} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-indigo-400">↻ Tải lại</button>
        </div>
        <p className="mb-5 text-sm text-slate-500">
          Ai đang dùng / chưa dùng Cổng Phụ huynh để nhân sự follow. <b>Đang dùng</b> = có hoạt động trong 14 ngày;
          <b> Lâu không vào</b> = quá 14 ngày. Hoạt động = đăng nhập, mở app (phiên làm mới) hoặc mở màn hình.
        </p>

        {err && <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{err}</div>}

        {summary && (
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200">
              <Donut pct={pct} label="đã vào app" />
              <div className="text-sm text-slate-500">
                <div><b className="text-slate-800">{summary.loggedIn}</b>/{summary.total} phụ huynh đã vào app</div>
                <div className="mt-1"><b className="text-slate-800">{summary.hoatDong7n}</b> có hoạt động 7 ngày qua</div>
                <div className="mt-1 text-xs">Đủ điều kiện = có SĐT và có con đang học.</div>
              </div>
            </div>
            <StatTile n={summary.dangDung} label="Đang dùng (14 ngày)" tone="text-emerald-600" active={filter === 'dang_dung'} onClick={() => toggle('dang_dung')} />
            <StatTile n={summary.lau} label="Lâu không vào" tone="text-slate-600" active={filter === 'lau'} onClick={() => toggle('lau')} />
            <StatTile n={summary.chuaDoi} label="Chưa đổi mật khẩu" tone="text-amber-600" active={filter === 'chua_doi'} onClick={() => toggle('chua_doi')} />
            <StatTile n={summary.chua} label="Chưa vào bao giờ" tone="text-rose-600" active={filter === 'chua'} onClick={() => toggle('chua')} />
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên con / lớp / phụ huynh / SĐT…"
            className="w-72 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          <div className="flex overflow-hidden rounded-lg ring-1 ring-slate-200">
            {FILTERS.map(([k, t]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-3 py-2 text-sm font-medium transition ${filter === k ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>{t}</button>
            ))}
          </div>
          <span className="ml-auto text-sm text-slate-400">{shown.length} phụ huynh</span>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-semibold">Phụ huynh</th>
                <th className="px-4 py-3 font-semibold">Học sinh</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Đăng nhập gần nhất</th>
                <th className="px-4 py-3 font-semibold">Hoạt động gần nhất</th>
                <th className="px-4 py-3 font-semibold">Màn hình theo dõi</th>
                <th className="px-4 py-3 text-right font-semibold">Hỗ trợ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Đang tải…</td></tr>
              ) : shown.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Không có phụ huynh phù hợp.</td></tr>
              ) : shown.map((r) => {
                const tt = TT_UI[r.trang_thai] ?? TT_UI.chua
                const top = topMan(r.xem_theo_man)
                return (
                  <tr key={r.phu_huynh_id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{r.ho_ten || '—'}</div>
                      <div className="mt-0.5 text-xs text-slate-400">{r.so_dien_thoai}</div>
                    </td>
                    <td className="px-4 py-3">
                      {(r.con ?? []).map((c) => (
                        <div key={c.id} className="text-slate-700">
                          {c.ho_ten}
                          {c.lop ? <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">{c.lop}</span>
                            : <span className="ml-1.5 text-[11px] text-rose-400">chưa xếp lớp</span>}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3"><span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tt.cls}`}>{tt.ten}</span></td>
                    <td className="px-4 py-3 text-slate-500" title={fmtNgay(r.last_sign_in_at)}>
                      <div>{fmtCach(r.last_sign_in_at)}</div>
                      <div className="text-[11px] text-slate-400">{fmtNgay(r.last_sign_in_at)}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500" title={fmtNgay(r.hoat_dong_cuoi)}>
                      <div className={r.trang_thai === 'dang_dung' ? 'font-medium text-emerald-700' : ''}>{fmtCach(r.hoat_dong_cuoi)}</div>
                      <div className="text-[11px] text-slate-400">{fmtNgay(r.hoat_dong_cuoi)}</div>
                    </td>
                    <td className="px-4 py-3">
                      {r.man_hinh_cuoi ? (
                        <>
                          <div className="text-slate-700">
                            {tenManHinh(r.man_hinh_cuoi, r.tab_cuoi)}
                            <span className="ml-1.5 text-[11px] text-slate-400">{fmtCach(r.man_hinh_cuoi_at)}</span>
                          </div>
                          {top.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {top.map(([k, n]) => (
                                <span key={k} className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] text-indigo-700">{tenManHinh(k)} <b>{n}</b></span>
                              ))}
                              <span className="py-0.5 text-[11px] text-slate-400">· {r.so_lan_xem_30n} lượt/30 ngày</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-300">{r.hoat_dong_cuoi ? 'chưa có dữ liệu màn hình' : '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => void openPreview(r)}
                          className="whitespace-nowrap rounded-lg border border-indigo-300 px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
                          👁 Xem app
                        </button>
                        {r.has_account ? (
                          <button disabled={resetting === r.phu_huynh_id} onClick={() => void doReset(r)}
                            className="whitespace-nowrap rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-rose-400 hover:text-rose-600 disabled:opacity-40">
                            {resetting === r.phu_huynh_id ? 'Đang reset…' : 'Reset về 123456'}
                          </button>
                        ) : <span className="whitespace-nowrap text-xs text-slate-300">chưa có tài khoản</span>}
                      </div>
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
