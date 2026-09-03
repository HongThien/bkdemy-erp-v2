// AppOps — shell RIÊNG cho bundle app OPS (PLAN-app-ops.md, Thùy chốt 29/08). Y HỆT vai trò AppHS
// với bundle HS: KHÔNG import gì thuộc NhanSuHome/useStore/kho — bundle build riêng (vite.config.ops.ts)
// nhẹ + không mang code nội bộ lên thiết bị dùng ngoài phòng học. Quyền = CÙNG 1 nguồn với ERP
// (my_quyen + getMyScope) — app và ERP là 2 đầu nhập của cùng 1 DB, không đẻ khái niệm quyền mới.
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import OpsHome from './screens/ops/OpsHome'
import { getMyHocSinhId } from './lib/testonline'
import { getMyProfile, type MyProfile } from './lib/nhansu'
import { myQuyen, type MyQuyen } from './lib/quyen'

function ManThongBao({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
      <p className="text-sm text-slate-500">{text}</p>
      <button onClick={() => supabase.auth.signOut()} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 active:bg-slate-100">Đăng xuất</button>
    </div>
  )
}
const DangTai = () => <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>

export default function AppOps() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  // gate = kết quả resolve tài khoản: HS (chặn) / staff chưa link nhan_su (chặn) / ok (vào app)
  const [gate, setGate] = useState<{ profile: MyProfile; quyen: MyQuyen } | 'hs' | 'khong_link' | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setGate(undefined); return }
    setGate(undefined)
    ;(async () => {
      // Tài khoản HS lạc vào domain ops → chặn (đối xứng AppHS chặn staff).
      const hsId = await getMyHocSinhId().catch(() => null)
      if (hsId) { setGate('hs'); return }
      const profile = await getMyProfile().catch(() => null)
      if (!profile) { setGate('khong_link'); return }
      const quyen = await myQuyen().catch((): MyQuyen => ({ laAdmin: false, chucNang: [], chiXem: [] }))
      setGate({ profile, quyen })
    })()
  }, [session?.user?.id]) // eslint-disable-line

  if (session === undefined) return <DangTai />
  if (!session) return <Login staffOnly title="BK Vận hành" subtitle="Đăng nhập nhân sự vận hành" />
  if (gate === undefined) return <DangTai />
  if (gate === 'hs') return <ManThongBao text="Tài khoản này là học sinh — app này chỉ dành cho nhân sự vận hành." />
  if (gate === 'khong_link') return <ManThongBao text="Tài khoản chưa gắn với hồ sơ nhân sự nào — liên hệ quản trị." />
  return <OpsHome profile={gate.profile} quyen={gate.quyen} />
}
