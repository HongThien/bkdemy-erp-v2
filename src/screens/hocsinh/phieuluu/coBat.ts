// CỜ BẬT tính năng game HS — MẶC ĐỊNH TẮT trên bản THẬT. Code đã nằm trong bản deploy nhưng học sinh không thấy cho tới khi Thùy chủ động bật cho tất cả.
// · Bản đồ phiêu lưu (`?phieuluu=1|0`) · Khu HỌC TẬP 5 đảo (`?hoctap=1|0`, spec-che-do-game.md §7).
// Thử trên 1 máy: mở app HS với đuôi `?phieuluu=1` / `?hoctap=1` một lần (máy nhớ), tắt lại bằng `=0`.
// BẢN THỬ NGHIỆM (Thùy 03/10: "thử nghiệm trước rồi mới release, trên cả điện thoại và iPad"): link Preview của Vercel (*.vercel.app)
// + máy dev (localhost / mạng LAN) ⇒ mặc định BẬT, mở là thấy — domain thật hs.bkacademy.edu.vn KHÔNG bị ảnh hưởng.
// Khi duyệt xong và muốn bật cho mọi học sinh: đổi MAC_DINH của cờ đó thành true (1 dòng) rồi deploy.
const MAC_DINH = { phieuluu: false, hoctap: false }

/** Đang chạy ở bản thử nghiệm (Preview Vercel / máy dev / LAN), không phải domain thật của học sinh. */
export function banThuNghiem(): boolean {
  try {
    const h = location.hostname
    return h.endsWith('.vercel.app') || h === 'localhost' || h === '127.0.0.1' || /^192\.168\./.test(h) || /^10\./.test(h)
  } catch { return false }
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
