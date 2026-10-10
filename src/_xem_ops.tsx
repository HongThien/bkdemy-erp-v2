// XEM THỬ app OPS không cần đăng nhập — soi BỐ CỤC (điện thoại / máy tính). Hồ sơ giả, quyền admin;
// chưa đăng nhập nên mọi truy vấn trả rỗng ⇒ các màn hiện trạng thái trống. Chỉ chạy ở dev: /xem-thu-ops.html
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OpsHome from './screens/ops/OpsHome'
import './index.css'

document.documentElement.style.setProperty('--app-z', '1')
const profile = { nhanSu: { id: '00000000-0000-0000-0000-000000000000', ho_ten: 'Nguyễn Xem Thử', anh_url: null } } as any
createRoot(document.getElementById('root')!).render(
  <StrictMode><OpsHome profile={profile} quyen={{ laAdmin: true, chucNang: [], chiXem: [] }} /></StrictMode>,
)
