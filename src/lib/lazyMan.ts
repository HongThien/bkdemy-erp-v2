// Tải màn KHI MỞ (Thùy 12/11: "bấm đến đâu gọi đến đấy" — áp cho cả mã app, không chỉ dữ liệu).
// Trước: ERP 1 file JS 8,6 MB (gzip 2,3 MB) gồm ~90 màn + cả app học sinh ⇒ mở ERP là tải hết.
// Giờ mỗi màn là 1 file riêng, chỉ tải khi người dùng bấm vào màn đó.
//
// Sau mỗi lần deploy, tên file màn đổi (hash) ⇒ tab đang mở từ bản cũ bấm sang màn mới sẽ 404.
// Gặp lỗi tải file màn ⇒ tự tải lại trang 1 lần (cờ trong sessionStorage chống vòng lặp).
import { lazy, type ComponentType } from 'react'

const CO = 'bk_lazy_tai_lai'

export function lazyMan<T extends ComponentType<any>>(nap: () => Promise<{ default: T }>) {
  return lazy(() =>
    nap().then(
      (m) => { try { sessionStorage.removeItem(CO) } catch { /* bỏ qua */ } return m },
      (loi) => {
        let daThu = false
        try { daThu = sessionStorage.getItem(CO) === '1'; if (!daThu) sessionStorage.setItem(CO, '1') } catch { /* bỏ qua */ }
        if (!daThu) { location.reload(); return new Promise<{ default: T }>(() => {}) }
        throw loi
      },
    ),
  )
}
