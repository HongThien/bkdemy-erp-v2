// NHÚNG TRONG APP HS (khu Học tập — spec-che-do-game.md §7, Thùy 03/10): app HS mở dautu.html?nhung=1&vao=chu_de|thap&mon=<môn>&khoi=<khối của em> trong khung.
//  · mở thẳng màn được gọi; "lùi" ở màn đó ⇒ báo app HS đóng khung (postMessage) thay vì về Home của game
//  · Đấu trường KHÔNG có "Giải đấu 8 người" (đã thành Giải Vô địch BK riêng) và "2 người 1 máy" (hoãn) — Thùy 03/10
//  · khối = khối của em, KHÔNG cho chọn khối khác ở Leo tháp (em khối nào leo tháp khối đó) — Thùy 03/10
const Q = new URLSearchParams(typeof location !== 'undefined' ? location.search : '')
export const NHUNG = Q.get('nhung') === '1'
export const VAO_NHUNG: 'chu_de' | 'thap' | null = NHUNG ? (Q.get('vao') === 'thap' ? 'thap' : 'chu_de') : null
export const MON_NHUNG = NHUNG ? Q.get('mon') : null
export const KHOI_NHUNG = NHUNG ? Q.get('khoi') : null
export const baoThoat = () => window.parent?.postMessage({ dtv: 'thoat' }, location.origin)
