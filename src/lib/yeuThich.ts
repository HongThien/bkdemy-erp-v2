// YÊU THÍCH theo TAB (Thùy 29/10): mỗi người tự dựng một "cây riêng" — nhiều tab tự đặt tên, mỗi tab tối đa
// YEU_THICH_TOI_DA mục. Ghim một mục thì chọn luôn tab hiển thị (một mục được nằm ở nhiều tab).
// Lưu ở nhan_su.menu_yeu_thich (jsonb, CÙNG cột cũ) dạng { tabs: [{ id, ten, muc: [leafId…] }] }.
// Bản cũ là MẢNG phẳng ["buoihoc", …] ⇒ đọc thành 1 tab "Yêu thích" — không cần chuyển dữ liệu, lần ghi kế tiếp lưu khuôn mới.
// Mã tab (`id`) cấp 1 lần lúc tạo, không đổi khi đổi tên / đổi thứ tự (mã gốc bất biến — CLAUDE.md §2).
// File này chỉ có hàm THUẦN (đọc / biến đổi cây); ghi DB ở store (useStore: luuCayYT).
import { YEU_THICH_TOI_DA } from './menu'

export type TabYT = { id: string; ten: string; muc: string[] }
export type CayYT = { tabs: TabYT[] }
export const TAB_YT_TOI_DA = 8
export const TEN_TAB_MAC_DINH = 'Yêu thích'

export const taoIdTab = () => `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** Đọc giá trị DB (mảng cũ / object mới / rỗng) thành cây hợp lệ: luôn ≥ 1 tab, mỗi tab ≤ 12 mục không trùng. */
export function docCayYT(raw: unknown): CayYT {
  const sach = (ds: unknown): string[] => [...new Set((Array.isArray(ds) ? ds : []).filter((x): x is string => typeof x === 'string' && x.length > 0))].slice(0, YEU_THICH_TOI_DA)
  if (Array.isArray(raw)) return { tabs: [{ id: 'chinh', ten: TEN_TAB_MAC_DINH, muc: sach(raw) }] }
  const tabs = (raw && typeof raw === 'object' && Array.isArray((raw as CayYT).tabs) ? (raw as CayYT).tabs : [])
    .filter((t) => t && typeof t.id === 'string' && t.id)
    .slice(0, TAB_YT_TOI_DA)
    .map((t) => ({ id: t.id, ten: (typeof t.ten === 'string' && t.ten.trim()) || TEN_TAB_MAC_DINH, muc: sach(t.muc) }))
  return tabs.length ? { tabs } : { tabs: [{ id: 'chinh', ten: TEN_TAB_MAC_DINH, muc: [] }] }
}

/** Mọi mục đã ghim ở bất kỳ tab nào (không trùng, theo thứ tự tab rồi thứ tự trong tab). */
export const phangYT = (c: CayYT): string[] => [...new Set(c.tabs.flatMap((t) => t.muc))]

/** Đặt mục `id` nằm ĐÚNG ở các tab `tabIds` (thêm vào tab mới chọn, rút khỏi tab bỏ chọn). Tab đầy thì bỏ qua tab đó. */
export function datTabCuaMuc(c: CayYT, id: string, tabIds: string[]): { cay: CayYT; tabDay: string[] } {
  const tabDay: string[] = []
  const tabs = c.tabs.map((t) => {
    const co = t.muc.includes(id), muon = tabIds.includes(t.id)
    if (co && !muon) return { ...t, muc: t.muc.filter((x) => x !== id) }
    if (!co && muon) {
      if (t.muc.length >= YEU_THICH_TOI_DA) { tabDay.push(t.ten); return t }
      return { ...t, muc: [...t.muc, id] }
    }
    return t
  })
  return { cay: { tabs }, tabDay }
}

/** Tab của người dùng đang mở trên máy này (sở thích hiển thị, không phải dữ liệu) — id không còn ⇒ tab đầu. */
const KHOA_TAB_MO = 'erp.ytTab'
export function docTabMo(c: CayYT): string {
  let v: string | null = null
  try { v = localStorage.getItem(KHOA_TAB_MO) } catch { /* bỏ qua */ }
  return c.tabs.some((t) => t.id === v) ? v! : c.tabs[0].id
}
export function ghiTabMo(id: string) { try { localStorage.setItem(KHOA_TAB_MO, id) } catch { /* bỏ qua */ } }
