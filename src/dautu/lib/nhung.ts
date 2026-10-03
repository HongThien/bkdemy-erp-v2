// NHÚNG TRONG APP HS (khu Học tập — spec-che-do-game.md §7, Thùy 03/10): app HS mở dautu.html?nhung=1&vao=chu_de|thap&mon=<môn>&khoi=<khối của em> trong khung.
//  · mở thẳng màn được gọi; "lùi" ở màn đó ⇒ báo app HS đóng khung (postMessage) thay vì về Home của game
//  · Đấu trường KHÔNG có "Giải đấu 8 người" (đã thành Giải Vô địch BK riêng) và "2 người 1 máy" (hoãn) — Thùy 03/10
//  · khối = khối của em, KHÔNG cho chọn khối khác — ở Leo tháp VÀ màn chọn chủ đề Đấu trường (Thùy 03/10: "chỉ hiện lớp nó đang học").
//    Chỉ môn theo khối (kho DB); Tiếng Anh lọc theo cấp độ từ, không phải lớp ⇒ giữ nguyên.
const Q = new URLSearchParams(typeof location !== 'undefined' ? location.search : '')
export const NHUNG = Q.get('nhung') === '1'
export const VAO_NHUNG: 'chu_de' | 'thap' | null = NHUNG ? (Q.get('vao') === 'thap' ? 'thap' : 'chu_de') : null
export const MON_NHUNG = NHUNG ? Q.get('mon') : null
export const KHOI_NHUNG = NHUNG ? Q.get('khoi') : null
// CHINH PHỤC BK (màn tháp của app HS): bấm 1 tháp ⇒ mở thẳng ván leo. cd = mã chủ đề (tháp chủ đề; vắng = tháp tổng của khối) · tcd = tên tháp · che = song_con|vo_tan.
//  Lùi từ ván leo ⇒ đóng khung về màn tháp của app HS (không qua menu chế độ của game).
export const CD_NHUNG = NHUNG ? Q.get('cd') : null
export const TCD_NHUNG = NHUNG ? Q.get('tcd') : null
export const CHE_NHUNG: 'song_con' | 'vo_tan' | null = NHUNG ? (Q.get('che') === 'vo_tan' ? 'vo_tan' : Q.get('che') === 'song_con' ? 'song_con' : null) : null
export const baoThoat = () => window.parent?.postMessage({ dtv: 'thoat' }, location.origin)
