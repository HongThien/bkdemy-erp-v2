// Entry RIÊNG cho bundle hs.bkacademy.edu.vn — KHÔNG import ./App (kéo theo toàn bộ màn staff),
// KHÔNG có nhánh in-PDF (#pvjob, chỉ worker server dùng), KHÔNG chạy fitZoom (mật độ desktop staff).
import { batPoll } from './lib/poll'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import AppHS from './AppHS'
import './index.css'
import { ganSkinMacDinh } from './screens/hocsinh/skin/KhungHS'
import 'katex/dist/katex.min.css'
import { supabase } from './lib/supabase'
import { EVT_MAN, layMan } from './screens/hocsinh/gopy/manHienTai'
import { initErrorBuffer } from './lib/errorBuffer'

initErrorBuffer()

// ⚠ Đăng ký SW phải qua virtual module NÀY, không dựa vào registerSW.js plugin tự inject: script
// inject chỉ register suông — SW mới activate xong nhưng trang đang mở vẫn chạy JS CŨ, HS "vào lại
// app" (PWA còn trong RAM, không re-navigate) thì kẹt bản cũ vô hạn (dính thật 29/08: deploy bỏ trần
// tự luyện xong HS vẫn thấy UI 30 câu). Virtual module lắng nghe 'activated' (isUpdate) → tự
// window.location.reload() — mở app là vài giây sau tự nhảy sang bản mới.
// Trình duyệt chỉ tự hỏi "có bản mới không" khi TẢI TRANG. App để chạy nền trên điện thoại / tab mở suốt trên máy tính
// thì không bao giờ tải lại ⇒ kẹt bản cũ nhiều ngày (dính thật 29/09: bundle 28/09 gọi tranh nền đã đổi tên ⇒ 404, mất nền).
// ⇒ Tự hỏi mỗi 30 phút + mỗi lần em quay lại app. Có bản mới thì autoUpdate cài xong tự reload như trên.
const KIEM_BAN_MOI_MS = 30 * 60 * 1000
let swReg: ServiceWorkerRegistration | undefined
registerSW({
  immediate: true,
  onRegisteredSW(_url, reg) {
    if (!reg) return
    swReg = reg
    const kiem = () => { if (navigator.onLine && reg.installing == null) reg.update().catch(() => {}) }
    batPoll(kiem, KIEM_BAN_MOI_MS, { khiHien: false })   // lúc quay lại app: listener ngay dưới lo
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') kiem() })
  },
})

// ⚠ BUG THẬT gây "trang chủ cuộn dọc" dù đã khoá h-screen (Thùy 21/08, verify trên production):
// `index.css` có `:root { --app-z: 1.15 }` (mặc định — comment gốc ghi rõ "Fallback nếu JS chưa
// chạy") + `#root { zoom: var(--app-z) }` ÁP DỤNG VÔ ĐIỀU KIỆN cho MỌI bundle import file này. App
// staff (`main.tsx`) chạy `fitZoom()` ghi đè `--app-z` theo bề rộng màn NGAY khi load — bundle này
// (`main-hs.tsx`) không chạy fitZoom nên "fallback" 1.15 tồn tại VĨNH VIỄN → `#root` zoom 115% suốt
// — đo thật: 720px viewport × 1.15 = 828px, khớp CHÍNH XÁC độ tràn đã đo trên production. Test cục
// bộ trước đó "pass" là vì lỡ tay chạy qua `index.html`/`main.tsx` (app staff, có fitZoom + có dòng
// `style={{zoom:'var(--app-unz)'}}` undo riêng cho nhánh HS trong `App.tsx`) — KHÔNG PHẢI qua đúng
// `hs.html`/`main-hs.tsx` deploy thật. Ghi đè thẳng `--app-z=1` ở ĐÂY (ưu tiên hơn `:root` nhờ inline
// style) — bundle HS không cần "mật độ desktop" của staff, luôn net 1.0.
document.documentElement.style.setProperty('--app-z', '1')
// Chữ mặc định +10% (Thùy 09/10: "chữ to ra 10% ở toàn bộ giao diện"): chữ KHÔNG đặt cỡ riêng (nội dung bài, công thức…) kế thừa từ body; các cỡ đặt riêng đã tăng 10% ở từng màn.
document.body.style.fontSize = '17.6px'

// Skin mặc định (Anime RPG) gắn trước khi vẽ — HocSinhApp gắn lại theo lựa chọn của em (spec-giao-dien-hs.md).
ganSkinMacDinh()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppHS />
  </StrictMode>,
)

// BẮT BUỘC CẬP NHẬT NGAY (Thùy 03/11, mig 202611032025): Thùy bấm ở Admin → "Mở tính năng app HS" ⇒ server ghi mốc. Máy mở app từ
// TRƯỚC mốc (hỏi mỗi 5 phút + lúc quay lại tab khi màn đang hiện, có đăng nhập) sẽ kiểm bản mới rồi tải lại — CHỈ khi em đang ở MÀN CHÍNH (không làm
// mất bài đang làm); đang ở màn khác thì đợi em về màn chính. Mốc đã xử lý nhớ trong máy ⇒ đồng hồ máy lệch cũng không tải lại lặp.
const NAP_LUC = Date.now()
const KHOA_EP = 'hs_ep_cap_nhat_da'
let mocEp: string | null = null
const daXuLy = (m: string) => { try { return localStorage.getItem(KHOA_EP) === m } catch { return false } }
async function taiLaiNeuDuoc() {
  if (!mocEp || layMan() !== 'man_chinh') return
  const m = mocEp; mocEp = null
  try { localStorage.setItem(KHOA_EP, m) } catch { /* máy chặn lưu: vẫn tải lại 1 lần */ }
  try { await swReg?.update() } catch { /* mạng lỗi: vẫn tải lại */ }
  // có bản mới đang cài ⇒ autoUpdate cài xong tự tải lại; chờ tối đa 8 giây rồi tải lại thẳng (đã là bản mới nhất / không có SW)
  window.setTimeout(() => window.location.reload(), swReg?.installing || swReg?.waiting ? 8000 : 300)
}
async function hoiEp() {
  if (document.visibilityState !== 'visible' || !navigator.onLine || mocEp) return
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  const { data, error } = await supabase.rpc('fn_hs_ep_cap_nhat')
  if (error || !data) return
  const m = String(data)
  if (new Date(m).getTime() > NAP_LUC && !daXuLy(m)) { mocEp = m; void taiLaiNeuDuoc() }
}
// Nhịp 5 phút (spec-kien-truc §6: số không realtime ≥ 5 phút) + hỏi ngay khi em quay lại tab — thay cho 30 s (10.000 HS × 2 lượt/phút = 333 lượt/giây vô ích).
batPoll(() => hoiEp(), 5 * 60_000, { khiHien: false })   // lỗi ⇒ tự lùi dần; lúc quay lại tab: listener ngay dưới lo
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void hoiEp().catch(() => {}) })
window.addEventListener(EVT_MAN, () => { void taiLaiNeuDuoc() })
