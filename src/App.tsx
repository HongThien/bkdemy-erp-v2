import { useStore, getUser, canAdmin } from './store/useStore'
import TopBar from './components/TopBar'
import NhanSuHome from './screens/NhanSuHome'
import AdminScreen from './screens/AdminScreen'

export default function App() {
  const { currentUserId, screen } = useStore()
  const user = getUser(currentUserId)
  const showAdmin = screen === 'admin' && canAdmin(user)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <TopBar />
      {showAdmin ? <AdminScreen user={user} /> : <NhanSuHome user={user} />}
    </div>
  )
}
