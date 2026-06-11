import { useState } from 'react'
import { useStore, getUser, canAdmin, vaisOf } from '../store/useStore'
import { users } from '../mock/fixtures'
import { supabase } from '../lib/supabase'
import HoSoModal from '../screens/nhansu/HoSoModal'

const tab = (active: boolean) =>
  `rounded px-3 py-1 ${active ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`

export default function TopBar({ email }: { email: string }) {
  const { currentUserId, setCurrentUser, screen, setScreen } = useStore()
  const user = getUser(currentUserId)
  const admin = canAdmin(user)
  const [hoSo, setHoSo] = useState(false)

  return (
    <header className="flex shrink-0 items-center gap-4 border-b bg-white px-6 py-2.5">
      <h1 className="text-sm font-semibold">BKdemy ERP v2</h1>

      <nav className="flex gap-1 text-sm">
        <button onClick={() => setScreen('nhansu')} className={tab(screen === 'nhansu')}>
          Nhân sự
        </button>
        {admin && (
          <button onClick={() => setScreen('admin')} className={tab(screen === 'admin')}>
            Admin
          </button>
        )}
      </nav>

      <div className="ml-auto flex items-center gap-2 text-xs">
        <span className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-700">DEV</span>
        <span className="text-slate-400">xem với vai trò:</span>
        <select
          value={currentUserId}
          onChange={(e) => setCurrentUser(e.target.value)}
          className="rounded border px-2 py-1"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.ten} — {vaisOf(u).join('/')}
            </option>
          ))}
        </select>
        <button onClick={() => setHoSo(true)} title="Hồ sơ của tôi" className="ml-2 border-l pl-3 text-slate-500 hover:text-indigo-600">👤 {email}</button>
        <button onClick={() => supabase.auth.signOut()} className="rounded border px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-rose-600">Đăng xuất</button>
      </div>
      {hoSo && <HoSoModal onClose={() => setHoSo(false)} />}
    </header>
  )
}
