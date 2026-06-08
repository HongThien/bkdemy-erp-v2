import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw })
    if (error) { setErr(error.message); setBusy(false) }
    // thành công → onAuthStateChange ở App tự cập nhật
  }

  const inp = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-[380px] rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">BKdemy ERP</h1>
        <p className="mb-6 text-sm text-slate-400">Đăng nhập để tiếp tục</p>
        <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inp} mb-3.5`} autoFocus autoComplete="username" />
        <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Mật khẩu</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={`${inp} mb-4`} autoComplete="current-password" />
        {err && <p className="mb-3 text-xs text-rose-600">{err}</p>}
        <button type="submit" disabled={busy || !email.trim() || !pw}
          className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-40">
          {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
        <p className="mt-4 text-center text-[11px] text-slate-400">Tài khoản do quản trị cấp (Supabase Dashboard).</p>
      </form>
    </div>
  )
}
