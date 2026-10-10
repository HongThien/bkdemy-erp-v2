// Màn app HS đang mở — để nút Góp ý nổi (ở MỌI màn) gắn đúng "em đang ở đâu" vào báo lỗi. HocSinhApp ghi, nút nổi đọc.
// Chỉ là ngữ cảnh hiển thị/đính kèm (không phải dữ liệu nghiệp vụ). Module-level + sự kiện window: nút nổi nằm NGOÀI cây HocSinhApp.
let man = 'man_chinh'
export const EVT_MAN = 'bk-hs-man'
export const EVT_MO_GOP_Y = 'bk-hs-mo-gopy'   // nút nổi → HocSinhApp: mở màn Góp ý đầy đủ (xem lời trả lời)
export const layMan = () => man
export function datMan(m: string) {
  if (m === man) return
  man = m
  try { window.dispatchEvent(new CustomEvent(EVT_MAN, { detail: m })) } catch { /* môi trường không có window */ }
}
