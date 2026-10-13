// XEM THỬ vỏ ERP (Trang chính · thanh điều hướng · cây trái · Yêu thích) không cần đăng nhập — soi BỐ CỤC
// và đường đi giữa các màn. Hồ sơ giả, quyền admin (thấy đủ 6 nhóm); chưa đăng nhập nên mọi truy vấn trả
// rỗng ⇒ màn con hiện trạng thái trống, ☆ ghim chỉ sống trong RAM (DB không nhận). Chỉ chạy ở dev: /xem-thu-erp.html
// Thêm ?it=1 để xem vai CHỈ có "Việc của tôi" (không có Trang chính).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TopBar from './components/TopBar'
import NhanSuHome from './screens/NhanSuHome'
import { useStore, getUser } from './store/useStore'
import { useIsMobile } from './hooks/useIsMobile'
import './index.css'

const it = new URLSearchParams(location.search).has('it')
const z = Math.max(1, Math.min(1.15, document.documentElement.clientWidth / 1150))
document.documentElement.style.setProperty('--app-z', z.toFixed(4))
document.documentElement.style.setProperty('--app-unz', (1 / z).toFixed(4))
useStore.setState({
  quyen: { laAdmin: !it, chucNang: [], chiXem: [] },
  me: { nhanSu: { id: '00000000-0000-0000-0000-000000000000', ho_ten: 'Nguyễn Xem Thử', anh_url: null, menu_yeu_thich: ['buoihoc', 'lamtailieu:et'] }, teams: [], viTris: [], phanCong: [], mons: [], hocThuatMons: [] } as any,
})

// Cho trang xem thử gọi thẳng store từ console (thử cấp phụ, lùi/tiến) — chỉ có ở trang dev này.
;(window as any).__store = useStore

function Vo() {
  const isMobile = useIsMobile()
  const user = getUser(useStore((s) => s.currentUserId))
  const shell = (
    <div className={isMobile ? 'flex h-dvh flex-col overflow-hidden bg-slate-50 text-slate-800' : 'flex h-[calc(100vh/var(--app-z))] flex-col overflow-hidden bg-slate-50 text-slate-800'}>
      <TopBar email="xem-thu@bkdemy" />
      <div className="min-h-0 flex-1 overflow-hidden"><NhanSuHome user={user} /></div>
    </div>
  )
  return isMobile ? <div style={{ zoom: 'var(--app-unz)' }}>{shell}</div> : shell
}
createRoot(document.getElementById('root')!).render(<StrictMode><Vo /></StrictMode>)
