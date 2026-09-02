// AppChi — shell RIÊNG cho bundle app BK CHI (PLAN-thu-chi.md, Thùy chốt 02/09). Y HỆT vai trò AppOps:
// KHÔNG import gì thuộc NhanSuHome/useStore/kho — bundle build riêng (vite.config.chi.ts).
// Ai là nhân sự `dang_lam` đều vào được (mọi nhân sự đều tạo khoản chi — không cần leaf).
// Phần xử lý của kế toán (duyệt/ghi sổ/chốt kỳ) nằm trên ERP (leaf `thuchi`), không ở app này.
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import ChiHome from './screens/chi/ChiHome'
import { getMyHocSinhId } from './lib/testonline'
import { getMyProfile, type MyProfile } from './lib/nhansu'

function ManThongBao({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
      <p className="text-sm text-slate-500">{text}</p>
      <button onClick={() => supabase.auth.signOut()} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 active:bg-slate-100">Đăng xuất</button>
    </div>
  )
}
const DangTai = () => <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>

export default function AppChi() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [gate, setGate] = useState<{ profile: MyProfile } | 'hs' | 'khong_link' | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setGate(undefined); return }
    setGate(undefined)
    ;(async () => {
      const hsId = await getMyHocSinhId().catch(() => null)
      if (hsId) { setGate('hs'); return }
      const profile = await getMyProfile().catch(() => null)
      if (!profile) { setGate('khong_link'); return }
      setGate({ profile })
    })()
  }, [session?.user?.id]) // eslint-disable-line

  if (session === undefined) return <DangTai />
  if (!session) return <Login staffOnly title="BK Chi" subtitle="Đăng nhập nhân sự — tạo khoản chi, theo dõi hoàn ứng" />
  if (gate === undefined) return <DangTai />
  if (gate === 'hs') return <ManThongBao text="Tài khoản này là học sinh — app này chỉ dành cho nhân sự." />
  if (gate === 'khong_link') return <ManThongBao text="Tài khoản chưa gắn với hồ sơ nhân sự nào — liên hệ quản trị." />
  return <ChiHome profile={gate.profile} />
}
