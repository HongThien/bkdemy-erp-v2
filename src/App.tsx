import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { useStore, getUser, canAdmin } from './store/useStore'
import TopBar from './components/TopBar'
import NhanSuHome from './screens/NhanSuHome'
import AdminScreen from './screens/AdminScreen'
import Login from './auth/Login'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined) // undefined = đang tải
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const { currentUserId, screen } = useStore()
  const user = getUser(currentUserId)
  const showAdmin = screen === 'admin' && canAdmin(user)

  if (session === undefined) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>
  if (!session) return <Login />

  return (
    // Chiều cao khung = đúng viewport. #root có zoom:1.15 (index.css) nên chia 1.15 để không tràn.
    // Chặn 1 lần ở đây; mọi tầng dưới dùng h-full + cuộn nội bộ → không còn body-scroll thừa.
    <div className="flex h-[calc(100vh/1.15)] flex-col overflow-hidden bg-slate-50 text-slate-800">
      <TopBar email={session.user.email ?? ''} />
      <div className={`min-h-0 flex-1 ${showAdmin ? 'overflow-hidden' : 'overflow-auto'}`}>
        {showAdmin ? <AdminScreen user={user} /> : <NhanSuHome user={user} />}
      </div>
    </div>
  )
}
