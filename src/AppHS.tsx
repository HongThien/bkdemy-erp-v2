// AppHS — shell RIÊNG cho bundle hs.bkacademy.edu.vn (Thùy 21/08: "tách thành 1 subpage của BK
// như PH, làm nó thành webapp như phapp"). Y HỆT nhánh HS của App.tsx (session/hsId/must_change_
// password) nhưng KHÔNG import bất cứ gì thuộc màn staff (NhanSuHome/TopBar/useStore/phanquyen…)
// — mục tiêu: bundle build riêng (vite.config.hs.ts) không kéo theo code nội bộ, khỏi lộ ra domain
// công khai + nhẹ hơn nhiều so với app đầy đủ. KHÔNG có nhánh `hsId === null` (staff) — build này
// chỉ phục vụ HS, nhân sự vẫn dùng domain ERP nội bộ như cũ.
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import HocSinhApp from './screens/hocsinh/HocSinhApp'
import DoiMatKhau from './screens/hocsinh/DoiMatKhau'
import { getMyHocSinhId } from './lib/testonline'

export default function AppHS() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [hsId, setHsId] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setHsId(undefined); return }
    setHsId(undefined)
    getMyHocSinhId().then((id) => setHsId(id)).catch(() => setHsId(null))
  }, [session?.user?.id]) // eslint-disable-line

  if (session === undefined) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>
  if (!session) return <Login hsOnly />
  if (hsId === undefined) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>
  if (!hsId) {
    // Đăng nhập bằng tài khoản KHÔNG phải HS (vd staff gõ nhầm domain này) — không có màn nào cho
    // họ ở đây, chỉ có thể đăng xuất. Domain hs.* CHỈ dành cho HS.
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-sm text-slate-500">Tài khoản này không phải học sinh — trang này chỉ dành cho học sinh.</p>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">Đăng xuất</button>
      </div>
    )
  }

  // Cổng đổi mật khẩu: PIN provision = chính mã HS ⇒ đoán được ⇒ bài làm không quy được về đúng
  // 1 người. Chặn TRƯỚC khi vào app khi mật khẩu còn mặc định (cờ do script hs_buoc_doi_mk.mjs gắn).
  const phaiDoiMK = session.user.user_metadata?.must_change_password === true
  const maHS = (session.user.email ?? '').split('@')[0]
  return phaiDoiMK
    ? <DoiMatKhau maHS={maHS} batBuoc onXong={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />
    : <HocSinhApp hocSinhId={hsId} hoTen={(session.user.user_metadata?.ho_ten as string) || 'bạn'} maHS={maHS} />
}
