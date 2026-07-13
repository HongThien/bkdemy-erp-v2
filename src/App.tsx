import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { useStore, getUser } from './store/useStore'
import TopBar from './components/TopBar'
import NhanSuHome from './screens/NhanSuHome'
import Login from './auth/Login'
import GeminiMeterBadge from './components/GeminiMeterBadge'
import HocSinhApp from './screens/hocsinh/HocSinhApp'
import { getMyHocSinhId } from './lib/testonline'
import { useIsMobile } from './hooks/useIsMobile'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined) // undefined = đang tải
  const [hsId, setHsId] = useState<string | null | undefined>(undefined) // undefined = chưa biết · null = KHÔNG phải HS (staff)
  const isMobile = useIsMobile()
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const { currentUserId, quyen, loadQuyen, loadMe, clearQuyen } = useStore()
  const user = getUser(currentUserId)

  // Người đăng nhập là HỌC SINH hay NHÂN SỰ? Resolve trước, quyết cả cây render.
  useEffect(() => {
    if (!session) { setHsId(undefined); return }
    setHsId(undefined)
    getMyHocSinhId().then((id) => setHsId(id)).catch(() => setHsId(null))
  }, [session?.user?.id]) // eslint-disable-line

  // Danh tính + quyền STAFF — chỉ khi KHÔNG phải HS. Reset khi đăng xuất.
  useEffect(() => {
    if (session && hsId === null) { loadQuyen(); loadMe() }
    else if (!session) clearQuyen()
  }, [session?.user?.id, hsId]) // eslint-disable-line

  if (session === undefined) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>
  if (!session) return <Login />
  if (hsId === undefined) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>
  // App HS = trải nghiệm ĐIỆN THOẠI riêng → huỷ zoom 1.15 của #root (mật độ desktop staff) về net 1.0.
  if (hsId) return (
    <div style={{ zoom: 1 / 1.15 }}>
      <HocSinhApp hocSinhId={hsId} hoTen={(session.user.user_metadata?.ho_ten as string) || 'bạn'} />
    </div>
  )
  if (quyen === null) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải quyền…</div>

  const shell = (
    <div className={isMobile ? 'flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-800' : 'flex h-[calc(100vh/1.15)] flex-col overflow-hidden bg-slate-50 text-slate-800'}>
      <TopBar email={session.user.email ?? ''} />
      <div className="min-h-0 flex-1 overflow-hidden">
        <NhanSuHome user={user} />
      </div>
      <GeminiMeterBadge />
      {/* LinkGenWorker (đời 1 — render link-PDF trên máy người dùng) ĐÃ NGỪNG MOUNT (07-12): nó chiếm
          màn hình bằng overlay "⏳ Đang lấy link…" tới 2 phút giữa lúc đang làm việc (Thùy: "t ko muốn
          phải chờ bất kì chỗ nào"). Đời 2: enqueueLinkGen chỉ ghi dòng vào bảng `linkgen_jobs`, worker
          SERVER (worker/index.mjs) tự gen PDF chữ thật — máy người dùng không render gì nữa. */}
    </div>
  )
  // Mobile: huỷ zoom:1.15 (#root, mật độ desktop) về net 1.0 — CÙNG trick với HocSinhApp ở trên (bọc
  // 1/1.15 để h-screen bên trong tính lại đúng 100vh THẬT, tránh chữ/nút quá to trên màn hình nhỏ).
  // Desktop: giữ NGUYÊN — Chiều cao khung = đúng viewport, #root zoom:1.15 nên chia 1.15 để không tràn.
  return isMobile ? <div style={{ zoom: 1 / 1.15 }}>{shell}</div> : shell
}
