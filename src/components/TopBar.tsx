import { useStore, getUser, canAdmin, vaisOf } from '../store/useStore'
import { users } from '../mock/fixtures'

const tab = (active: boolean) =>
  `rounded px-3 py-1 ${active ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`

export default function TopBar() {
  const { currentUserId, setCurrentUser, screen, setScreen } = useStore()
  const user = getUser(currentUserId)
  const admin = canAdmin(user)

  return (
    <header className="flex items-center gap-4 border-b bg-white px-6 py-2.5">
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
      </div>
    </header>
  )
}
