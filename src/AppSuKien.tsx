// AppSuKien — shell RIÊNG cho app SỰ KIỆN (spec-su-kien.md; Thùy 26/09 "tách khỏi ERP cho đỡ lẫn"). Khuôn y hệt
// AppKhaoSat: đăng nhập nhân sự, cùng Supabase, KHÔNG kéo NhanSuHome/useStore → bundle nhẹ, người trực không thấy
// menu ERP. Quyền thật nằm ở DB: mọi fn_sk_* kiểm la_thanh_vien() — nhân sự nào đăng nhập cũng dùng được.
// Hash:  #sk-tv=quay|hang&sk=<id>  → màn TV toàn màn hình
//        #man=checkin|dangky|quay|quantro|caidat → mở thẳng tab đó (link riêng cho từng vị trí trực)
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import SuKienScreen, { type TabSuKien } from './screens/sukien/SuKienScreen'
import TvSuKien, { parseTvHash } from './screens/sukien/TvSuKien'
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

const TABS: TabSuKien[] = ['checkin', 'dangky', 'quay', 'quantro', 'caidat']
const tabTuHash = (): TabSuKien | undefined => {
  const m = new URLSearchParams(location.hash.replace(/^#/, '')).get('man')
  return TABS.includes(m as TabSuKien) ? (m as TabSuKien) : undefined
}

export default function AppSuKien() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [gate, setGate] = useState<MyProfile | 'hs' | 'khong_link' | undefined>(undefined)
  const [tv] = useState(parseTvHash)
  const [tabDau] = useState(tabTuHash)

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
  if (!session) return <Login staffOnly title="🏮 BK Sự kiện" subtitle="Đăng nhập tài khoản nhân sự BK" />
  if (gate === undefined) return <DangTai />
  if (gate === 'hs') return <ManThongBao text="Tài khoản này là học sinh — app này dành cho nhân sự trực sự kiện." />
  if (gate === 'khong_link') return <ManThongBao text="Tài khoản chưa gắn với hồ sơ nhân sự nào — liên hệ quản trị." />
  if (tv) return <TvSuKien man={tv.man} skId={tv.sk} />
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#f5f5f7] text-slate-800">
      <div className="flex shrink-0 items-center gap-2 px-3 py-1.5 text-white" style={{ background: '#3b1d6e' }}>
        <span className="font-black">🏮 BK Sự kiện</span>
        <span className="ml-auto truncate text-xs text-white/70">{gate.nhanSu.ho_ten}</span>
        <button onClick={() => supabase.auth.signOut()} className="rounded-md px-2 py-1 text-xs text-white/80 hover:bg-white/10">Đăng xuất</button>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)]">
        <SuKienScreen tabDau={tabDau} appRieng />
      </div>
    </div>
  )
}
