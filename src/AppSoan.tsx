// AppSoan — bundle RIÊNG của tool soạn thảo (soan.html / vite.config.soan.ts). Toàn bộ màn nằm ở soan/SoanWorkspace
// (dùng chung với SoanModal nhúng trong ERP). Lưu = lưu nháp máy này (chuỗi kho ra console cho CTO đối chiếu).
// 08/09: bộ cụm là BỘ CHUNG của trung tâm ở DB (cumDb.ts) → cần ĐĂNG NHẬP nhân sự (cùng khuôn AppGiaiBai) và nạp
// store.me để cumDb ghi tao_boi/sua_boi + phím tắt công thức cá nhân chạy. Không đăng nhập được thì SoanWorkspace tự
// rơi về bộ trên máy — nhưng ở đây gate luôn bắt đăng nhập, để ai cũng làm việc trên cùng 1 bộ.
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import { getMyProfile } from './lib/nhansu'
import { useStore } from './store/useStore'
import { SoanWorkspace } from './soan/SoanWorkspace'
import { loadDraft, saveDraft } from './soan/cum'

const DangTai = () => <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>

export default function AppSoan() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [san, setSan] = useState(false)   // đã nạp xong profile (có hay không) → mới dựng workspace, để cumDb có me
  const [draft] = useState(() => loadDraft())

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!session) { setSan(false); return }
    setSan(false)
    getMyProfile().then((p) => { if (p) useStore.setState({ me: p }) }).catch(() => null).finally(() => setSan(true))
  }, [session?.user?.id]) // eslint-disable-line

  if (session === undefined) return <DangTai />
  if (!session) return <Login staffOnly title="BK Soạn thảo" subtitle="Đăng nhập nhân sự — bộ cụm & gõ tắt dùng chung của trung tâm" />
  if (!san) return <DangTai />
  return (
    <div className="h-screen">
      <SoanWorkspace initial={draft} onSave={(raw) => {
        saveDraft(raw)
        console.log('[soan] chuỗi kho:', raw)
      }} />
    </div>
  )
}
