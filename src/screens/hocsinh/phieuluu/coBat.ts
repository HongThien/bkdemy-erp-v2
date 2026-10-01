// CỜ BẬT BẢN ĐỒ PHIÊU LƯU — MẶC ĐỊNH TẮT. Code đã nằm trong bản deploy nhưng học sinh không thấy cho tới khi Thùy chủ động bật cho tất cả.
// Muốn thử trên 1 máy (vd iPad) mà không đổi gì cho học sinh khác: mở app HS với đuôi `?phieuluu=1` một lần (máy nhớ), tắt lại bằng `?phieuluu=0`.
// Khi duyệt xong và muốn bật cho mọi học sinh: đổi MAC_DINH thành true (1 dòng) rồi deploy.
const KHOA = 'hs_phieu_luu'
const MAC_DINH = false

export function phieuLuuBat(): boolean {
  try {
    const q = new URLSearchParams(location.search).get('phieuluu')
    if (q === '1') localStorage.setItem(KHOA, '1')
    else if (q === '0') localStorage.setItem(KHOA, '0')
    const v = localStorage.getItem(KHOA)
    return v === '1' ? true : v === '0' ? false : MAC_DINH
  } catch { return MAC_DINH }
}
