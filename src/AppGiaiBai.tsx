// AppGiaiBai — shell RIÊNG cho TOOL GIẢI BÀI kho chung (giaibai.bkacademy.edu.vn, Thùy chốt 06/09).
// Cùng khuôn AppChi: bundle riêng (vite.config.giaibai.ts), KHÔNG import NhanSuHome/screens kho; login = tài khoản
// nhân sự ERP. Ai là nhân sự có môn (nhan_su_mon) đều nhận giải được — Thùy: lọc người bằng "ai được biết tên miền",
// tiền tính ngoài hệ. Scope môn = cùng luật useMonScope (admin + team liên-môn thấy tất; còn lại theo nhan_su_mon).
// Duyệt = ghế học thuật đúng môn (profile.hocThuatMons) hoặc admin — DB kiểm lại trong fn_giaibai_duyet.
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Login from './auth/Login'
import { getMyHocSinhId } from './lib/testonline'
import { getMyProfile, type MyProfile } from './lib/nhansu'
import { myQuyen } from './lib/quyen'
import { CROSS_MON_TEAMS } from './lib/mon'
import { GIAIBAI_MON } from './lib/giaibai'
import { useStore } from './store/useStore'
import GiaiBaiHome from './screens/giaibai/GiaiBaiHome'

function ManThongBao({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
      <p className="max-w-md text-sm text-slate-500">{text}</p>
      <button onClick={() => supabase.auth.signOut()} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100">Đăng xuất</button>
    </div>
  )
}
const DangTai = () => <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Đang tải…</div>

export type GiaiBaiScope = { profile: MyProfile; mons: string[]; monDuyet: string[] }

export default function AppGiaiBai() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [gate, setGate] = useState<GiaiBaiScope | 'hs' | 'khong_link' | undefined>(undefined)

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
      // MathTextarea đọc phím tắt công thức cá nhân từ store.me — nạp để phím tắt của người soạn chạy y như ERP.
      useStore.setState({ me: profile })
      const laAdmin = await myQuyen().then((q) => q.laAdmin).catch(() => false)
      const crossMon = profile.teams.some((t) => CROSS_MON_TEAMS.includes(t.ma))
      const tatCa = GIAIBAI_MON.map((m) => m.mon)
      const mons = laAdmin || crossMon ? tatCa : tatCa.filter((m) => profile.mons.includes(m))
      const monDuyet = laAdmin ? tatCa : tatCa.filter((m) => profile.hocThuatMons.includes(m))
      setGate({ profile, mons, monDuyet })
    })()
  }, [session?.user?.id]) // eslint-disable-line

  if (session === undefined) return <DangTai />
  if (!session) return <Login staffOnly title="BK Giải bài" subtitle="Đăng nhập nhân sự — nhận và soạn lời giải cho kho bài chung" />
  if (gate === undefined) return <DangTai />
  if (gate === 'hs') return <ManThongBao text="Tài khoản này là học sinh — tool này chỉ dành cho nhân sự." />
  if (gate === 'khong_link') return <ManThongBao text="Tài khoản chưa gắn với hồ sơ nhân sự nào — liên hệ quản trị." />
  if (!gate.mons.length) return <ManThongBao text="Tài khoản chưa được phân môn (Toán/KHTN) nên chưa thấy kho bài — nhờ quản trị gán môn ở ERP › Nhân sự." />
  return <GiaiBaiHome scope={gate} />
}
