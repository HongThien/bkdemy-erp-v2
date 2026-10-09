// CỜ BẬT tính năng game HS — từ 09/10 (đợt 1) MẶC ĐỊNH BẬT trên bản THẬT; trước đó tắt, chỉ bản Preview thấy.
// · Bản đồ phiêu lưu (`?phieuluu=1|0`) · Khu HỌC TẬP 5 đảo (`?hoctap=1|0`, spec-che-do-game.md §7).
// Thử trên 1 máy: mở app HS với đuôi `?phieuluu=1` / `?hoctap=1` một lần (máy nhớ), tắt lại bằng `=0`.
// BẢN THỬ NGHIỆM (Thùy 03/10: "thử nghiệm trước rồi mới release, trên cả điện thoại và iPad"): bản build Preview của Vercel
// (+ mọi domain khác hs.bkacademy.edu.vn khi không phải build Production) ⇒ mặc định BẬT, mở là thấy — bản Production / domain thật KHÔNG bị ảnh hưởng.
// Khi duyệt xong và muốn bật cho mọi học sinh: đổi MAC_DINH của cờ đó thành true (1 dòng) rồi deploy.
// ĐỢT 1 (Thùy 09/10: "vào main tao có thấy mấy cái bản đồ adventure đâu"): BẬT cho mọi học sinh — đợt 1 mở khu Học tập (5 đảo) + bản đồ phiêu lưu của "Học theo chủ đề".
// Tắt lại bằng cách đổi về false (hoặc thử riêng 1 máy bằng ?phieuluu=0 / ?hoctap=0).
const MAC_DINH = { phieuluu: true, hoctap: true }

// Môi trường build Vercel (vite.config.hs.ts define): 'production' | 'preview' | 'development' | '' (build ngoài Vercel / bundle khác không define).
const VERCEL_ENV = typeof __VERCEL_ENV__ !== 'undefined' ? __VERCEL_ENV__ : ''

/** Đang chạy ở bản THỬ NGHIỆM, không phải bản thật của học sinh:
 *  · bản build Preview của Vercel (chắc chắn nhất — không phụ thuộc domain Preview là gì);
 *  · hoặc không phải bản Production và không phải domain thật hs.bkacademy.edu.vn (máy dev, LAN, *.vercel.app…).
 *  Bản Production (VERCEL_ENV = 'production') hoặc domain thật ⇒ LUÔN tắt. */
export function banThuNghiem(): boolean {
  if (VERCEL_ENV === 'preview') return true
  if (VERCEL_ENV === 'production') return false
  try { return location.hostname !== 'hs.bkacademy.edu.vn' } catch { return false }
}

function co(ten: keyof typeof MAC_DINH): boolean {
  const khoa = ten === 'phieuluu' ? 'hs_phieu_luu' : 'hs_hoc_tap'
  const goc = MAC_DINH[ten] || banThuNghiem()
  try {
    const q = new URLSearchParams(location.search).get(ten)
    if (q === '1') localStorage.setItem(khoa, '1')
    else if (q === '0') localStorage.setItem(khoa, '0')
    const v = localStorage.getItem(khoa)
    return v === '1' ? true : v === '0' ? false : goc
  } catch { return goc }
}

export const phieuLuuBat = () => co('phieuluu')
export const hocTapBat = () => co('hoctap')

/** RANK (cấp bậc + Điểm Rank + Bảng đua tháng): TẠM KHOÁ (Thùy 06/10 — "khá khó hiểu và khá xa, ẩn đi"). Ẩn ở MỌI bản (kể cả thử nghiệm); DB vẫn tính ngầm.
 *  Bật lại trên 1 máy để soi: `?rank=1` (máy nhớ), tắt `?rank=0`. Muốn bật cho mọi học sinh sau này: đổi hàm thành `return true`. */
export function rankBat(): boolean {
  try {
    const q = new URLSearchParams(location.search).get('rank')
    if (q === '1') localStorage.setItem('hs_rank', '1')
    else if (q === '0') localStorage.setItem('hs_rank', '0')
    return localStorage.getItem('hs_rank') === '1'
  } catch { return false }
}
