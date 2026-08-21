// Cầu nối sang Cổng Phụ huynh (project bkdemy-ph) — bộ đo đăng nhập PH + reset mật khẩu.
// Xác thực bằng JWT staff ERP (ph-app verify qua Supabase ERP). ERP chỉ đọc, không giữ secret.
import { supabase } from './supabase'

const PH_BASE = (import.meta.env.VITE_PH_ADMIN_URL as string | undefined) || 'https://ph.bkacademy.edu.vn'

export type PhLoginRow = {
  phu_huynh_id: string
  ho_ten: string
  so_dien_thoai: string
  has_account: boolean
  last_sign_in_at: string | null
  created_at: string | null
  must_change_password: boolean
}
export type PhLoginSummary = { total: number; hasAccount: number; loggedIn: number; changedPw: number }

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

// "Xem app như phụ huynh": xin token có hạn (chỉ staff) → mở link app PH ở tab mới (read-only).
export async function openPreviewApp(phu_huynh_id: string): Promise<void> {
  const res = await fetch(`${PH_BASE}/api/admin/preview-token`, {
    method: 'POST',
    headers: { ...(await authHeaders()), 'content-type': 'application/json' },
    body: JSON.stringify({ phu_huynh_id }),
  })
  const j = await res.json().catch(() => ({}))
  if (!res.ok || !j.path) throw new Error(j.error || `Lỗi (${res.status}).`)
  window.open(`${PH_BASE}${j.path}`, '_blank', 'noopener')
}
