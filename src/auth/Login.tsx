import { useState } from 'react'
import { supabase } from '../lib/supabase'

// Tài khoản test đăng-nhập-nhanh (CHỈ hiện khi chạy dev): khai trong .env.local (gitignored):
// VITE_DEV_ACCOUNTS=Tên A|emailA@x.com|matkhauA, Tên B|emailB@x.com|matkhauB
const DEV_ACCOUNTS: { ten: string; email: string; pw: string }[] = import.meta.env.DEV
  ? ((import.meta.env.VITE_DEV_ACCOUNTS as string | undefined) ?? '')
      .split(',').map((s) => s.trim()).filter(Boolean)
      .map((s) => { const [ten, email, pw] = s.split('|').map((x) => x.trim()); return { ten, email, pw } })
      .filter((a) => a.email && a.pw)
  : []

// HS đăng nhập bằng mã HS + PIN → email tổng hợp <ma_hs>@hs.bkdemy.local (mig 0063).
const HS_DOMAIN = 'hs.bkdemy.local'

export default function Login() {
  const [mode, setMode] = useState<'staff' | 'hs'>('staff')
  const [email, setEmail] = useState('')
  const [maHS, setMaHS] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null)
    const em = mode === 'hs' ? `${maHS.trim().toLowerCase()}@${HS_DOMAIN}` : email.trim()
    const { error } = await supabase.auth.signInWithPassword({ email: em, password: pw })
    if (error) { setErr(mode === 'hs' ? 'Sai mã học sinh hoặc mã PIN.' : error.message); setBusy(false) }
    // thành công → onAuthStateChange ở App tự cập nhật
  }

  async function quick(a: { email: string; pw: string }) {
    setBusy(true); setErr(null)
    const { error } = await supabase.auth.signInWithPassword({ email: a.email, password: a.pw })
    if (error) { setErr(`${a.email}: ${error.message}`); setBusy(false) }
  }

  const inp = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-[380px] rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">BKdemy ERP</h1>
        <p className="mb-4 text-sm text-slate-400">Đăng nhập để tiếp tục</p>

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
          {(['staff', 'hs'] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setErr(null) }}
              className={`rounded-md py-1.5 text-[13px] font-medium transition ${mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {m === 'staff' ? 'Nhân sự' : 'Học sinh'}
            </button>
          ))}
        </div>

        {mode === 'staff' ? (
          <>
            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inp} mb-3.5`} autoFocus autoComplete="username" />
          </>
        ) : (
          <>
            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Mã học sinh</label>
            <input value={maHS} onChange={(e) => setMaHS(e.target.value)} placeholder="HS0001" className={`${inp} mb-3.5 uppercase`} autoFocus autoComplete="username" />
          </>
        )}
        <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">{mode === 'hs' ? 'Mã PIN' : 'Mật khẩu'}</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={`${inp} mb-4`} autoComplete="current-password" />
        {err && <p className="mb-3 text-xs text-rose-600">{err}</p>}
        <button type="submit" disabled={busy || (mode === 'staff' ? !email.trim() : !maHS.trim()) || !pw}
          className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-40">
          {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
        <p className="mt-4 text-center text-[11px] text-slate-400">{mode === 'hs' ? 'Mã học sinh + PIN do trung tâm cấp.' : 'Tài khoản do quản trị cấp (Supabase Dashboard).'}</p>

        {DEV_ACCOUNTS.length > 0 && (
          <div className="mt-5 border-t border-dashed border-slate-200 pt-4">
            <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-amber-500">⚡ Dev — đăng nhập nhanh</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {DEV_ACCOUNTS.map((a) => (
                <button key={a.email} type="button" onClick={() => quick(a)} disabled={busy} title={a.email}
                  className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[12px] font-medium text-amber-700 transition hover:border-amber-400 hover:bg-amber-100 disabled:opacity-40">
                  {a.ten || a.email}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
