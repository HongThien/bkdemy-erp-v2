// MỘT nút quay về cho cả ERP = ← / ↑ của thanh địa chỉ Explorer (Thùy 14/10: "bỏ nút quay về cũ, dùng nút mới").
// Nhiều màn con còn tự vẽ nút "← Buổi học", "← Bản đồ kiến thức", "← Kho tài liệu"… ở đầu màn. Hook này:
//   1. dò nút quay về ở ĐẦU màn (chữ bắt đầu bằng ← hoặc ‹, không phải phân trang "‹ 3/10 ›", không ở popup / bản in);
//   2. ẨN nó (thuộc tính `data-nut-ve`, CSS ở index.css — không xoá node ⇒ React không lệch);
//   3. đăng ký vào store `capPhuEl` để ← và ↑ trên thanh địa chỉ BẤM THAY nó (chính nút gốc được .click(),
//      nên mọi việc nó làm — dọn state, enqueueLinkGen, onClose… — vẫn chạy y như cũ).
// Màn không có nút quay về ⇒ `capPhuEl = null` ⇒ ← ↑ chạy theo lịch sử / cây menu như thường.
import { useEffect, type RefObject } from 'react'
import { useStore } from '../store/useStore'

const MAU_NUT_VE = /^[←‹«]\s*\S/
const LA_PHAN_TRANG = /[›»→]\s*$/   // "‹ Bài 3/10 ›" · "← Trước · Sau →" … không phải quay về
// "← Trước", "‹ Câu trước"… là duyệt từng mục, không phải quay về cấp trên.
const LA_TRUOC_SAU = /^[←‹«]\s*(trước|sau|bài trước|câu trước|tháng trước|tuần trước|ngày trước|cũ hơn|mới hơn)/i
const DONG_BIEN = 240                 // chỉ nút nằm trong 240px đầu màn

export function useNutQuayVe(ref: RefObject<HTMLElement | null>, khoaLamMoi: unknown) {
  useEffect(() => {
    const root = ref.current
    const set = useStore.getState().setCapPhuEl
    if (!root) { set(null); return }
    let truoc: string | null | undefined
    // `dong` tra lại nút ĐANG có trong DOM lúc bấm (không giữ node cũ — màn có thể đã vẽ lại).
    const dong = () => root.querySelector<HTMLElement>('[data-nut-ve]')?.click()
    const quet = () => {
      root.querySelectorAll<HTMLElement>('[data-nut-ve]').forEach((n) => n.removeAttribute('data-nut-ve'))
      const goc = root.getBoundingClientRect().top
      const khop: HTMLElement[] = []
      for (const b of Array.from(root.querySelectorAll<HTMLElement>('button'))) {
        const t = (b.textContent ?? '').replace(/\s+/g, ' ').trim()
        if (t.length < 3 || t.length > 70 || !MAU_NUT_VE.test(t) || LA_PHAN_TRANG.test(t) || LA_TRUOC_SAU.test(t)) continue
        if ((b as HTMLButtonElement).disabled) continue
        if (b.closest('[role="dialog"], .fixed, [class*="pv-"], [class*="print"], .no-nut-ve')) continue
        if (b.getBoundingClientRect().top - goc > DONG_BIEN) continue
        khop.push(b)
      }
      khop.forEach((b) => b.setAttribute('data-nut-ve', '1'))
      const dau = khop[0]
      const ten = dau ? (dau.textContent ?? '').replace(/^[←‹«]\s*/, '').replace(/\s+/g, ' ').trim() : null
      if (ten === truoc) return   // không đổi ⇒ không đụng store (tránh vẽ lại thừa)
      truoc = ten
      set(ten === null ? null : { ten, dong })
    }
    quet()
    let timer = 0
    const mo = new MutationObserver(() => { window.clearTimeout(timer); timer = window.setTimeout(quet, 60) })
    mo.observe(root, { childList: true, subtree: true })
    return () => { mo.disconnect(); window.clearTimeout(timer); set(null) }
  }, [ref, khoaLamMoi])
}
