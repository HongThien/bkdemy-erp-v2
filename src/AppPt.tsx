// AppPt — shell RIÊNG cho bundle app PHÁT TRIỂN (CEO chốt 05/09: khu "Giao việc phát triển"
// tách thành app riêng, logic y hệt app TA/OPS). Không import gì thuộc NhanSuHome/useStore/
// screens kho — bundle nhẹ. Quyền = CÙNG nguồn với ERP (my_quyen + getMyScope.laQuanLy),
// không đẻ khái niệm quyền mới. Data-layer = src/lib/giaoviec.ts dùng chung với ERP.
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import PtHome from './screens/pt/PtHome'
import { getMyHocSinhId } from './lib/testonline'
import { getMyProfile, getMyScope, type MyProfile } from './lib/nhansu'
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

export type PtGate = { profile: MyProfile; quyen: MyQuyen; laQuanLy: boolean }

export default function AppPt() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [gate, setGate] = useState<PtGate | 'hs' | 'khong_link' | undefined>(undefined)

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
      const [quyen, scope] = await Promise.all([
        myQuyen().catch((): MyQuyen => ({ laAdmin: false, chucNang: [], chiXem: [] })),
        getMyScope().catch(() => null),   // laQuanLy = có ghế Trưởng/Phó trong cây vị trí (cùng luật IdeaTab ERP)
      ])
      setGate({ profile, quyen, laQuanLy: !!scope?.laQuanLy })
    })()
  }, [session?.user?.id]) // eslint-disable-line

  if (session === undefined) return <DangTai />
  if (!session) return <Login staffOnly title="BK Phát triển" subtitle="Đăng nhập nhân sự" />
  if (gate === undefined) return <DangTai />
  if (gate === 'hs') return <ManThongBao text="Tài khoản này là học sinh — app này chỉ dành cho nhân sự." />
  if (gate === 'khong_link') return <ManThongBao text="Tài khoản chưa gắn với hồ sơ nhân sự nào — liên hệ quản trị." />
  return <PtHome gate={gate} />
}
