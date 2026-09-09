// AppKhaoSat — shell RIÊNG cho PWA "Bạn của con ở BK" trên iPad trung tâm (spec-khao-sat-hs.md; CEO 08/09: "trỏ riêng
// ra thành 1 PWA cho iPad"). Khuôn y hệt AppTa: đăng nhập nhân sự (TA cầm máy), cùng Supabase, KHÔNG kéo NhanSuHome/
// useStore/screens kho → bundle nhẹ. Không có auth riêng cho HS: iPad đã đăng nhập TA, HS chỉ bấm tên mình.
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import KhaoSatLuoi from './screens/khaosat/KhaoSatLuoi'
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

export default function AppKhaoSat() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [gate, setGate] = useState<MyProfile | 'hs' | 'khong_link' | undefined>(undefined)

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
      setGate(profile ?? 'khong_link')
    })()
  }, [session?.user?.id]) // eslint-disable-line

  if (session === undefined) return <DangTai />
  if (!session) return <Login staffOnly title="Bạn của con ở BK" subtitle="Đăng nhập tài khoản trợ giảng / nhân sự" />
  if (gate === undefined) return <DangTai />
  if (gate === 'hs') return <ManThongBao text="Tài khoản này là học sinh — app này dành cho trợ giảng cầm máy." />
  if (gate === 'khong_link') return <ManThongBao text="Tài khoản chưa gắn với hồ sơ nhân sự nào — liên hệ quản trị." />
  return <KhaoSatLuoi taTen={gate.nhanSu.ho_ten} onLogout={() => supabase.auth.signOut()} />
}
