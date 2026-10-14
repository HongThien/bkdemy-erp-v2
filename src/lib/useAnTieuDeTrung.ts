// Thanh địa chỉ kiểu Explorer (TopBar) ĐÃ là "tiêu đề" của mọi màn: 🏠 Trang chính › Nhóm › <tên màn>.
// Nhiều màn cũ còn tự vẽ thêm một tiêu đề (h1/h2) nhắc lại đúng tên màn đó ⇒ trùng lặp, hai chỗ cùng nói một điều.
// Hook này dò CÁC TIÊU ĐỀ ĐẦU MÀN và ẩn đúng cái nào chỉ nhắc lại tên màn đang mở trên thanh địa chỉ.
//   • Chỉ ẩn khi MỌI từ của tiêu đề (đã chuẩn hoá: bỏ dấu, bỏ ký tự phụ, viết tắt thống nhất) đều có trong tên màn.
//   • Tiêu đề có thêm thông tin riêng ("Giáo trình · Khối 8", "Sơ đồ họ …") GIỮ NGUYÊN — nó không trùng.
//   • Chỉ xét h1/h2 nằm ở ĐẦU màn (cao < 140px so với đáy thanh địa chỉ), không đụng popup / bản in.
// Ẩn bằng thuộc tính `data-trung-thanh-dia-chi` (CSS ở index.css), không xoá node ⇒ React không bị lệch.
import { useEffect, type RefObject } from 'react'

// Chuẩn hoá: bỏ dấu · bỏ ký tự phụ · viết tắt thống nhất ("học sinh"→hs, "giáo viên"→gv, "phụ huynh"→ph, "trợ giảng"→ta).
const chuan = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  .replace(/hoc sinh/g, 'hs').replace(/giao vien/g, 'gv').replace(/phu huynh/g, 'ph').replace(/tro giang/g, 'ta')
const TU = (s: string) => new Set(s.split(' ').filter(Boolean))
const BO_ICON = (s: string) => s.replace(/[\p{Extended_Pictographic}️‍]/gu, '')

export function useAnTieuDeTrung(ref: RefObject<HTMLElement | null>, tenMan: string | null | undefined, khoaLamMoi: unknown) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const ten = chuan(BO_ICON(tenMan ?? ''))
    const quet = () => {
      root.querySelectorAll<HTMLElement>('[data-trung-thanh-dia-chi]').forEach((n) => n.removeAttribute('data-trung-thanh-dia-chi'))
      if (!ten) return
      const goc = root.getBoundingClientRect().top
      for (const h of Array.from(root.querySelectorAll<HTMLElement>('h1, h2'))) {
        if (h.closest('[role="dialog"], .fixed, [class*="pv-"], [class*="print"], [class*="hpmh"], [class*="gtbk"]')) continue
        if (h.getBoundingClientRect().top - goc > 140) break   // quá sâu trong màn: không phải tiêu đề màn
        const t = chuan(BO_ICON(h.textContent ?? ''))
        if (!t) continue
        // Trùng = MỌI từ của tiêu đề đều đã có trong tên màn (tiêu đề không mang thêm thông tin nào).
        const tuT = TU(t), tuMan = TU(ten)
        if (tuT.size > 0 && [...tuT].every((w) => tuMan.has(w))) h.setAttribute('data-trung-thanh-dia-chi', '1')
        break   // chỉ xét tiêu đề ĐẦU TIÊN
      }
    }
    quet()
    // Màn tải dữ liệu rồi mới vẽ tiêu đề ⇒ quét lại khi DOM đổi (có chặn tần suất).
    let timer = 0
    const mo = new MutationObserver(() => { window.clearTimeout(timer); timer = window.setTimeout(quet, 60) })
    mo.observe(root, { childList: true, subtree: true })
    return () => { mo.disconnect(); window.clearTimeout(timer) }
  }, [ref, tenMan, khoaLamMoi])
}
