// Cầu nối sang Cổng Phụ huynh (project bkdemy-ph) — bộ đo đăng nhập PH + reset mật khẩu.
// Xác thực bằng JWT staff ERP (ph-app verify qua Supabase ERP). ERP chỉ đọc, không giữ secret.
import { supabase } from './supabase'

const PH_BASE = (import.meta.env.VITE_PH_ADMIN_URL as string | undefined) || 'https://ph.bkacademy.edu.vn'

// Màn hình trong app PH (khoá route `s` của PhApp.tsx bên bkdemy-ph-app).
export type PhManHinh =
  | 'home' | 'lessons' | 'lesson' | 'dapan' | 'results' | 'mastery' | 'et' | 'homework'
  | 'monthly' | 'notices' | 'journey' | 'tuition' | 'materials'
export const PH_MAN_HINH: Record<PhManHinh, string> = {
  home: 'Trang chủ', lessons: 'DS buổi học', lesson: 'Buổi học', dapan: 'Đáp án', results: 'Kết quả học tập',
  mastery: 'Thành thạo', et: 'Test cuối giờ', homework: 'BTVN', monthly: 'Test tháng', notices: 'Việc cần làm',
  journey: 'Hồ sơ học tập', tuition: 'Học phí', materials: 'Tài liệu',
}
export const PH_TAB: Record<string, string> = { personal: 'Cá nhân', class: 'Cả lớp', current: 'Hiện tại', awards: 'Danh hiệu', history: 'Lịch sử' }

export type PhTrangThai = 'chua' | 'chua_doi' | 'dang_dung' | 'lau'
export type PhCon = { id: string; ho_ten: string; lop: string }
// 1 dòng = 1 PH có SĐT + ≥1 con đang học. Mọi tổng hợp tính ở Postgres bkdemy-ph (admin_parent_usage, mig 0028).
export type PhLoginRow = {
  phu_huynh_id: string
  ho_ten: string
  so_dien_thoai: string
  has_account: boolean
  last_sign_in_at: string | null
  created_at: string | null
  must_change_password: boolean
  hoat_dong_cuoi: string | null // max(đăng nhập, phiên làm mới, màn hình cuối)
  so_lan_xem_30n: number
  man_hinh_cuoi: string | null
  tab_cuoi: string | null
  man_hinh_cuoi_at: string | null
  xem_theo_man: Record<string, number> // 30 ngày: {home: 12, lesson: 5…}
  con: PhCon[]
  trang_thai: PhTrangThai // chua · chua_doi · dang_dung (≤14 ngày) · lau (>14 ngày)
}
export type PhLoginSummary = {
  total: number; hasAccount: number; loggedIn: number; changedPw: number
  dangDung: number; lau: number; chuaDoi: number; chua: number; hoatDong7n: number
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Danh sách PH đủ điều kiện (có SĐT) + trạng thái đăng nhập Cổng PH.
export async function fetchPhLogins(): Promise<{ summary: PhLoginSummary; parents: PhLoginRow[] }> {
  const res = await fetch(`${PH_BASE}/api/admin/parent-logins`, { headers: await authHeaders() })
  if (res.status === 401) throw new Error('Không có quyền truy cập bộ đo (chưa cấu hình xác thực ERP↔Cổng PH).')
  if (!res.ok) throw new Error(`Lỗi tải dữ liệu (${res.status}).`)
  return res.json()
}

// Reset mật khẩu 1 PH về 123456 (bắt đổi lần sau). reset=false nếu PH chưa có tài khoản.
export async function resetPhPassword(phu_huynh_id: string): Promise<{ ok: boolean; reset: boolean; reason?: string }> {
  const res = await fetch(`${PH_BASE}/api/admin/reset-password`, {
    method: 'POST',
    headers: { ...(await authHeaders()), 'content-type': 'application/json' },
    body: JSON.stringify({ phu_huynh_id }),
  })
  const j = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(j.error || `Lỗi (${res.status}).`)
  return j
}

// "Xem app như phụ huynh": xin token có hạn (chỉ staff) → URL app PH read-only (nhúng iframe / mở tab).
export async function getPreviewUrl(phu_huynh_id: string): Promise<string> {
  const res = await fetch(`${PH_BASE}/api/admin/preview-token`, {
    method: 'POST',
    headers: { ...(await authHeaders()), 'content-type': 'application/json' },
    body: JSON.stringify({ phu_huynh_id }),
  })
  const j = await res.json().catch(() => ({}))
  if (!res.ok || !j.path) throw new Error(j.error || `Lỗi (${res.status}).`)
  return `${PH_BASE}${j.path}`
}

// Mở app PH ở tab mới (shortcut).
export async function openPreviewApp(phu_huynh_id: string): Promise<void> {
  window.open(await getPreviewUrl(phu_huynh_id), '_blank', 'noopener')
}

// Upload ảnh báo cáo tháng (snapshot lúc chốt) → trả URL public để lưu vào bao_cao_ph.
export async function uploadReportImage(key: string, dataUrl: string): Promise<string> {
  const res = await fetch(`${PH_BASE}/api/admin/report-image`, {
    method: 'POST',
    headers: { ...(await authHeaders()), 'content-type': 'application/json' },
    body: JSON.stringify({ key, dataUrl }),
  })
  const j = await res.json().catch(() => ({}))
  if (!res.ok || !j.url) throw new Error(j.error || `Lỗi (${res.status}).`)
  return j.url
}
