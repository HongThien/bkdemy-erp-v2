import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { useStore, getUser } from './store/useStore'
import TopBar from './components/TopBar'
import NhanSuHome from './screens/NhanSuHome'
import Login from './auth/Login'
import GeminiMeterBadge from './components/GeminiMeterBadge'
import HocSinhApp from './screens/hocsinh/HocSinhApp'
import DoiMatKhau from './screens/hocsinh/DoiMatKhau'
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
  // App HS = trải nghiệm ĐIỆN THOẠI riêng → huỷ zoom #root (mật độ desktop staff) về net 1.0.
  if (hsId) {
    // Cổng đổi mật khẩu: PIN provision = chính mã HS ⇒ đoán được ⇒ bài làm không quy được
    // về đúng một người. Chặn TRƯỚC khi vào app, không cho làm bài khi mật khẩu còn mặc định.
    // Cờ do script `hs_buoc_doi_mk.mjs` gắn (hiện chỉ cấp 3 — nơi bài online là phép đo chính).
    const phaiDoiMK = session.user.user_metadata?.must_change_password === true
    const maHS = (session.user.email ?? '').split('@')[0]
    return (
      <div style={{ zoom: 'var(--app-unz)' }}>
        {phaiDoiMK
          ? <DoiMatKhau maHS={maHS} batBuoc onXong={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />
          : <HocSinhApp hocSinhId={hsId} hoTen={(session.user.user_metadata?.ho_ten as string) || 'bạn'} maHS={maHS} />}
      </div>
    )
  }
  if (quyen === null) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải quyền…</div>

  const shell = (
    // ⭐ Fix 07-19 (Thùy: "phải freeze header, kéo xuống mới back lại được") — mobile Safari tính 100vh
    // (h-screen) theo viewport LỚN NHẤT có thể (như khi thanh địa chỉ đã thu gọn), CAO HƠN vùng thật đang
    // hiện. Khung ngoài overflow-hidden vì vậy CAO HƠN màn hình thật → chính TRANG (không phải khung con
    // overflow-auto bên trong) bị cuộn, kéo luôn header/nút back ra khỏi màn hình theo. 100dvh (h-dvh) đo
    // ĐÚNG viewport đang hiện (dynamic viewport height) → khung ngoài khớp màn hình thật, hết cuộn trang,
    // header/back luôn đứng yên như thiết kế ban đầu (chỉ nội dung bên trong tự cuộn).
    <div className={isMobile ? 'flex h-dvh flex-col overflow-hidden bg-slate-50 text-slate-800' : 'flex h-[calc(100vh/var(--app-z))] flex-col overflow-hidden bg-slate-50 text-slate-800'}>
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
  // Mobile: huỷ zoom #root (mật độ desktop) về net 1.0 — CÙNG trick với HocSinhApp ở trên (bọc
  // var(--app-unz)=1/--app-z để h-screen bên trong tính lại đúng 100vh THẬT, tránh chữ/nút quá to).
  // Desktop: giữ NGUYÊN — Chiều cao khung = đúng viewport, #root zoom var(--app-z) nên chia lại để không tràn.
  return isMobile ? <div style={{ zoom: 'var(--app-unz)' }}>{shell}</div> : shell
}
