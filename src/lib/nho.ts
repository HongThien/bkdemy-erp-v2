// NHỚ MÀN QUA F5 / LẦN MỞ SAU (Thùy 17/11: "mỗi lần vào các màn như mục tiêu tuần thì lưu lại màn cũ lúc t thoát" · "trên từng máy").
//
// Khuôn cũ của ERP: mỗi màn có `const NHO = {...}` ở mức module — rời màn quay lại đúng chỗ, nhưng chỉ sống tới F5 (CLAUDE §2 React).
// `nhoBen(ten, macDinh, { luu, trongNgay })` trả về CHÍNH object NHO đó (dùng y như cũ: `NHO.mo = x`), thêm phần:
//   · các khoá trong `luu` được ghi vào localStorage của MÁY NÀY, tách theo TÀI KHOẢN, đọc lại ở lần mở sau;
//   · các khoá trong `trongNgay` cũng ghi nhưng chỉ đọc lại nếu cùng NGÀY (giờ VN) — dùng cho tuần / ngày đang xem,
//     để sáng hôm sau mở ra là tuần hiện tại chứ không kẹt tuần cũ.
// CHỈ lưu LỰA CHỌN (tab, ô, lớp, em, khối đang mở, vị trí cuộn, bản nháp chữ) — KHÔNG lưu dữ liệu nghiệp vụ: số vẫn đọc từ DB.
// Lưu ở trình duyệt là đúng luật: tuỳ chọn riêng của một người trên một máy (CLAUDE §2: chỉ dữ liệu nhiều người dùng mới bắt buộc ở DB).
// Ghi: ngay khi gán khoá cấp 1 (`NHO.mo = …`) + lúc rời trang / ẩn tab (bắt cả thay đổi lồng như `NHO.chuDe[khoi] = …`).

type Kho = { luu: string[]; trongNgay: string[]; ten: string; goc: Record<string, unknown>; macDinh: Record<string, unknown>; uid: string | null }
const CAC_KHO: Kho[] = []

// id tài khoản đang đăng nhập — đọc đồng bộ từ phiên supabase-js lưu trong localStorage (sb-<ref>-auth-token)
function uidHienTai(): string {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k || !k.startsWith('sb-') || !k.endsWith('-auth-token')) continue
      const v = JSON.parse(localStorage.getItem(k) || 'null')
      const id = v?.user?.id ?? v?.currentSession?.user?.id
      if (id) return String(id)
    }
  } catch { /* bỏ qua */ }
  return ''
}
// ngày theo giờ VN, không qua toISOString (CLAUDE §2 timezone)
function ngayVN(): string {
  const d = new Date(Date.now() + 7 * 3600 * 1000)
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}
const khoaLuu = (uid: string, ten: string) => `nho:${uid || '_'}:${ten}`

function nap(k: Kho) {
  const uid = uidHienTai()
  if (k.uid === uid) return
  k.uid = uid
  for (const f of [...k.luu, ...k.trongNgay]) k.goc[f] = k.macDinh[f]   // đổi tài khoản ⇒ không mang lựa chọn của người trước
  try {
    const raw = localStorage.getItem(khoaLuu(uid, k.ten))
    if (!raw) return
    const v = JSON.parse(raw) as { ngay?: string; luu?: Record<string, unknown>; trongNgay?: Record<string, unknown> }
    for (const f of k.luu) if (v.luu && f in v.luu) k.goc[f] = v.luu[f]
    if (v.ngay === ngayVN()) for (const f of k.trongNgay) if (v.trongNgay && f in v.trongNgay) k.goc[f] = v.trongNgay[f]
  } catch { /* hỏng thì dùng mặc định */ }
}
function ghi(k: Kho) {
  if (k.uid == null) return
  try {
    const luu: Record<string, unknown> = {}, trongNgay: Record<string, unknown> = {}
    for (const f of k.luu) luu[f] = k.goc[f]
    for (const f of k.trongNgay) trongNgay[f] = k.goc[f]
    localStorage.setItem(khoaLuu(k.uid, k.ten), JSON.stringify({ ngay: ngayVN(), luu, trongNgay }))
  } catch { /* đầy / bị chặn ⇒ chỉ còn nhớ tới F5 như cũ */ }
}

let daGanNghe = false
function ganNghe() {
  if (daGanNghe || typeof window === 'undefined') return
  daGanNghe = true
  const ghiHet = () => { for (const k of CAC_KHO) ghi(k) }
  window.addEventListener('pagehide', ghiHet)
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') ghiHet() })
}

export function nhoBen<T extends object>(ten: string, macDinh: T, opt: { luu?: (keyof T & string)[]; trongNgay?: (keyof T & string)[] }): T {
  const k: Kho = { ten, luu: opt.luu ?? [], trongNgay: opt.trongNgay ?? [], goc: { ...(macDinh as Record<string, unknown>) }, macDinh: { ...(macDinh as Record<string, unknown>) }, uid: null }
  CAC_KHO.push(k)
  ganNghe()
  const coLuu = (p: string | symbol) => typeof p === 'string' && (k.luu.includes(p) || k.trongNgay.includes(p))
  return new Proxy(k.goc, {
    get(t, p) { if (coLuu(p)) nap(k); return t[p as string] },
    set(t, p, v) {
      if (coLuu(p)) nap(k)
      t[p as string] = v
      if (coLuu(p)) ghi(k)
      return true
    },
  }) as T
}
