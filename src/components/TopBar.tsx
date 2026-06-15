import { useState } from 'react'
import { supabase } from '../lib/supabase'
import HoSoModal from '../screens/nhansu/HoSoModal'

// 1 màn duy nhất (spec) → TopBar không còn tab Nhân sự/Admin. Chỉ tên app + hồ sơ + đăng xuất.
export default function TopBar({ email }: { email: string }) {
  const [hoSo, setHoSo] = useState(false)
  return (
    <header className="flex shrink-0 items-center gap-4 border-b bg-white px-6 py-2.5">
      <h1 className="text-sm font-semibold">BKdemy ERP v2</h1>
      <div className="ml-auto flex items-center gap-2 text-xs">
        <button onClick={() => setHoSo(true)} title="Hồ sơ của tôi" className="text-slate-500 hover:text-indigo-600">👤 {email}</button>
        <button onClick={() => supabase.auth.signOut()} className="rounded border px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-rose-600">Đăng xuất</button>
      </div>
      {hoSo && <HoSoModal onClose={() => setHoSo(false)} />}
    </header>
  )
}
