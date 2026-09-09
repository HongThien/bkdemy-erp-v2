// ============================================================================
// push.ts — Web Push (VAPID) DÙNG CHUNG cho các app nhắc việc hàng ngày. Mỗi thiết bị đăng ký
// gắn với 1 APP cụ thể ('pt' | 'ta', mig 202609061913 — push_dang_ky.app): app Phát triển
// (pt, 10:30) và app Trợ giảng (ta, 23:30 — CEO 06/09 "TA cũng cần push để không miss việc,
// giống pt"). Web Push subscribe theo TỪNG ORIGIN + CẶP KHOÁ VAPID riêng của app đó —
// KHÔNG dùng chéo được, nên mỗi bundle build với `VITE_PUSH_VAPID_PUBLIC` CỦA RIÊNG NÓ
// (khai trên đúng Vercel project) dù tên biến env giống nhau.
// ----------------------------------------------------------------------------
// Chân lý = bảng `push_dang_ky`: 1 dòng = 1 thiết bị THẬT đang đăng ký, CỦA 1 APP.
// Tắt = XOÁ dòng của mình + unsubscribe ở trình duyệt (không cờ bật/tắt — §1.5).
// Khoá công khai VAPID nhúng bundle là ĐÚNG — nó công khai theo thiết kế; khoá riêng CHỈ ở
// Vercel env (PUSH_VAPID_PRIVATE), gửi bởi api/pt-nhac-viec.mjs hoặc api/ta-nhac-viec.mjs.
// ============================================================================
import { supabase } from './supabase'
import { myNhanSuId } from './giaoviec'

export type PushApp = 'pt' | 'ta'

export const VAPID_PUBLIC = (import.meta.env.VITE_PUSH_VAPID_PUBLIC as string | undefined)?.trim() || undefined

export type PushHoTro = 'ok' | 'dev' | 'thieu_cau_hinh' | 'ios_can_cai' | 'khong_ho_tro'
// Kiểm tra môi trường TRƯỚC khi hiện nút — mỗi ca một câu chỉ dẫn khác nhau, đừng gộp thành "không hỗ trợ".
export function kiemTraHoTro(): PushHoTro {
  if (import.meta.env.DEV) return 'dev'               // vite dev không sinh service worker → chỉ test trên bản build/preview
  if (!VAPID_PUBLIC) return 'thieu_cau_hinh'
  const coApi = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  if (coApi) return 'ok'
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true
  return ios && !standalone ? 'ios_can_cai' : 'khong_ho_tro'
}

export type TrangThaiNhac = 'bat' | 'tat' | 'chan'
export async function trangThaiNhacViec(app: PushApp): Promise<TrangThaiNhac> {
  if (Notification.permission === 'denied') return 'chan'
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  if (!sub) return 'tat'
  await luuDangKy(sub, app).catch(() => {})   // đồng bộ lại DB (idempotent) — endpoint có thể đổi sau khi SW cập nhật
  return 'bat'
}

export async function batNhacViec(app: PushApp): Promise<void> {
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') throw new Error(perm === 'denied'
    ? 'Bạn đã chặn thông báo cho trang này — mở cài đặt trình duyệt/điện thoại để cho phép lại.'
    : 'Chưa cho phép thông báo.')
  const reg = await navigator.serviceWorker.ready
  const sub = (await reg.pushManager.getSubscription())
    ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC!) }))
  await luuDangKy(sub, app)
}

export async function tatNhacViec(): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  if (!sub) return
  const { error } = await supabase.from('push_dang_ky').delete().eq('endpoint', sub.endpoint)
  if (error) throw error
  await sub.unsubscribe()
}

export type PushDangKy = { id: string; thiet_bi: string | null; created_at: string; gui_ok_at: string | null; loi_at: string | null; loi_ma: number | null }
// Thiết bị của TÔI, CỦA ĐÚNG APP NÀY (RLS lọc theo tai_khoan → nhan_su + filter app) — hiện ở
// Cài đặt để người dùng biết máy nào đang nhận. Không lọc app thì màn pt sẽ liệt kê nhầm cả
// máy chỉ bật ở app ta (và ngược lại) — gây tưởng nhầm "máy này đang nhận" khi thực ra không.
export async function listThietBiCuaToi(app: PushApp): Promise<PushDangKy[]> {
  const { data, error } = await supabase.from('push_dang_ky')
    .select('id, thiet_bi, created_at, gui_ok_at, loi_at, loi_ma').eq('app', app).order('created_at', { ascending: false }).limit(50)
  if (error) throw error
  return (data ?? []) as PushDangKy[]
}

async function luuDangKy(sub: PushSubscription, app: PushApp): Promise<void> {
  const j = sub.toJSON()
  if (!j.keys?.p256dh || !j.keys?.auth) throw new Error('Trình duyệt không cấp khoá push — thử lại.')
  const me = await myNhanSuId()
  const { error } = await supabase.from('push_dang_ky').upsert({
    nhan_su_id: me, endpoint: sub.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, app,
    thiet_bi: tenThietBi(navigator.userAgent),
  }, { onConflict: 'endpoint' })
  if (error) throw error
}

// Nhãn máy ngắn gọn cho người dùng (không lưu nguyên user-agent dài).
function tenThietBi(ua: string): string {
  const os = /iPhone/i.test(ua) ? 'iPhone' : /iPad/i.test(ua) ? 'iPad' : /Android/i.test(ua) ? 'Android' : /Windows/i.test(ua) ? 'Windows' : /Mac/i.test(ua) ? 'Mac' : 'Máy khác'
  const br = /Edg\//i.test(ua) ? 'Edge' : /Chrome\//i.test(ua) ? 'Chrome' : /Safari\//i.test(ua) ? 'Safari' : /Firefox\//i.test(ua) ? 'Firefox' : ''
  return [os, br].filter(Boolean).join(' · ')
}

function urlBase64ToUint8Array(b64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (b64.length % 4)) % 4)
  const base64 = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}
