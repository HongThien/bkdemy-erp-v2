// Nén ảnh ĐỀ trước khi gửi cho Claude trong phiên (spec-quan-ly-chat-luong §6.5): cạnh dài ≤ 2000 px (đủ đọc số mũ nhỏ),
// JPEG, tổng ≲ 1,1 MB base64 mỗi ảnh (DB chặn 1,5 triệu ký tự). Chỉ xử lý phía máy — không gửi đi đâu ngoài RPC fn_phien_gui.
import type { AnhGui } from './phien'

export const TOI_DA_ANH = 5
const CANH_DAI = 2000, CANH_THU = 240, NGUONG_KY_TU = 1_100_000

function vePhong(bm: ImageBitmap, canhDai: number, chatLuong: number): string {
  const k = Math.min(1, canhDai / Math.max(bm.width, bm.height))
  const w = Math.max(1, Math.round(bm.width * k)), h = Math.max(1, Math.round(bm.height * k))
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h
  const g = cv.getContext('2d'); if (!g) throw new Error('Trình duyệt không xử lý được ảnh.')
  g.fillStyle = '#fff'; g.fillRect(0, 0, w, h)   // PNG trong suốt → nền trắng (đề chụp màn hình)
  g.drawImage(bm, 0, 0, w, h)
  return cv.toDataURL('image/jpeg', chatLuong).split(',')[1] ?? ''
}

export async function nenAnh(f: File): Promise<AnhGui> {
  if (!/^image\/(jpeg|png|webp)$/.test(f.type)) throw new Error(`"${f.name || 'ảnh'}": chỉ nhận ảnh JPG / PNG / WEBP.`)
  if (f.size > 25_000_000) throw new Error(`"${f.name || 'ảnh'}" quá lớn (>25 MB).`)
  const bm = await createImageBitmap(f)
  try {
    let du = '', canh = CANH_DAI, q = 0.85
    for (let i = 0; i < 6; i++) {
      du = vePhong(bm, canh, q)
      if (du.length <= NGUONG_KY_TU) break
      q = Math.max(0.55, q - 0.1); canh = Math.round(canh * 0.85)
    }
    if (du.length > NGUONG_KY_TU) throw new Error('Ảnh quá phức tạp để nén gọn — chụp nhỏ lại hoặc cắt bớt.')
    return { mime: 'image/jpeg', du_lieu: du, thu: vePhong(bm, CANH_THU, 0.7) }
  } finally { bm.close() }
}

export const urlAnh = (mime: string, b64: string) => `data:${mime};base64,${b64}`

// ── TỆP gửi kèm (Thùy 23/11): PDF + tệp chữ. Không nén, chỉ đọc thành base64; kiểu tệp suy từ ĐUÔI tên (trình duyệt hay để trống type của .md / .tex). ──
export const TOI_DA_TEP = 3
const TEP_TOI_DA_BYTE = 3_000_000
const KIEU_TEP: Record<string, string> = { pdf: 'application/pdf', txt: 'text/plain', md: 'text/markdown', csv: 'text/csv', json: 'application/json', tex: 'text/x-tex' }
export const DUOI_TEP = Object.keys(KIEU_TEP).map((d) => '.' + d).join(',')
export const laAnh = (f: File) => /^image\/(jpeg|png|webp)$/.test(f.type)
export async function docTep(f: File): Promise<{ ten: string; mime: string; du_lieu: string }> {
  const duoi = (f.name.split('.').pop() ?? '').toLowerCase()
  const mime = KIEU_TEP[duoi]
  if (!mime) throw new Error(/^(docx?|xlsx?|pptx?)$/.test(duoi)
    ? `"${f.name}": chưa nhận tệp Word / Excel / PowerPoint — lưu thành PDF rồi gửi.`
    : `"${f.name}": chỉ nhận PDF và tệp chữ (${DUOI_TEP.replace(/,/g, ' ')}).`)
  if (f.size > TEP_TOI_DA_BYTE) throw new Error(`"${f.name}" nặng ${(f.size / 1e6).toFixed(1)} MB — tối đa 3 MB mỗi tệp (tách nhỏ, hoặc chụp ảnh trang cần hỏi).`)
  if (f.size === 0) throw new Error(`"${f.name}" rỗng.`)
  const b = new Uint8Array(await f.arrayBuffer())
  let nhi = ''
  for (let i = 0; i < b.length; i += 0x8000) nhi += String.fromCharCode(...b.subarray(i, i + 0x8000))
  return { ten: f.name, mime, du_lieu: btoa(nhi) }
}
export const coTep = (kb: number) => kb >= 1e6 ? `${(kb / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(kb / 1e3))} KB`
