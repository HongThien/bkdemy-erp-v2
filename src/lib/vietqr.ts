// VietQR (NAPAS EMVCo) — sinh chuỗi QR chuyển khoản NGAY TẠI CLIENT, KHÔNG gọi API ngoài
// (riêng tư + không phụ thuộc mạng). Chuỗi mã hoá TLV theo chuẩn VietQR: field 38 = NAPAS
// (GUID A000000727 + BIN ngân hàng + số TK + service QRIBFTTA), 54 = số tiền, 62.08 = nội dung.
// PH quẹt bằng app bank → tự điền đúng TK + số tiền + nội dung → khỏi gõ, đối soát sau dễ.

// Tài khoản NHẬN học phí — config 1 CHỖ (in công khai trên phiếu, không phải secret).
// Đổi ngân hàng/TK sau = sửa đây + deploy. (Nếu cần đổi qua UI thì mới thêm bảng config + màn.)
export const BANK_THU_HOC_PHI = {
  bin: '970432', // VPBank — mã BIN NAPAS (KHÁC số TK; tra bảng BIN nếu đổi ngân hàng)
  soTaiKhoan: '38496433',
  tenChuTk: 'DUONG HUU QUANG',
  tenNganHang: 'VPBank',
}

function tlv(tag: string, value: string): string {
  return tag + value.length.toString().padStart(2, '0') + value
}

// CRC16/CCITT-FALSE (poly 0x1021, init 0xFFFF) — chuẩn checksum của VietQR, tính trên cả "6304".
function crc16(str: string): string {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

// Nội dung chuyển khoản: "HP <mã PH> T<MMYYYY>" — bỏ dấu (bank hay cắt/từ chối dấu), khoá đối soát.
export function noiDungCK(maPh: string, ky: string): string {
  const s = `HP ${maPh} T${ky.slice(5, 7)}${ky.slice(0, 4)}`
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
}

// Chuỗi payload VietQR. amount>0 → mã ĐỘNG (POI 12) kèm field 54; không → mã tĩnh (POI 11).
export function buildVietQR({ bin, soTaiKhoan, amount, addInfo }: { bin: string; soTaiKhoan: string; amount?: number; addInfo?: string }): string {
  const napas = tlv('00', 'A000000727') + tlv('01', tlv('00', bin) + tlv('01', soTaiKhoan)) + tlv('02', 'QRIBFTTA')
  const hasAmount = !!amount && amount > 0
  let s = ''
  s += tlv('00', '01') // Payload Format Indicator
  s += tlv('01', hasAmount ? '12' : '11') // Point of Initiation Method (động/tĩnh)
  s += tlv('38', napas) // Merchant Account Information — NAPAS
  s += tlv('53', '704') // Currency = VND
  if (hasAmount) s += tlv('54', String(Math.round(amount!))) // Transaction Amount
  s += tlv('58', 'VN') // Country
  if (addInfo) s += tlv('62', tlv('08', addInfo)) // Additional Data — nội dung CK
  s += '6304' // CRC (tag 63 + len 04), checksum nối ngay sau
  return s + crc16(s)
}

// Render QR ra data-URL PNG (dùng được cho <img> → serialize outerHTML + html2canvas ok).
// width 480 + errorCorrection 'M': in ra ảnh QR TO, nét → Zalo/app bank đọc chắc từ ảnh gửi qua chat.
export async function vietQRDataUrl(opts: { bin: string; soTaiKhoan: string; amount?: number; addInfo?: string }): Promise<string> {
  const QRCode = (await import('qrcode')).default
  return QRCode.toDataURL(buildVietQR(opts), { margin: 1, width: 480, errorCorrectionLevel: 'M' })
}
