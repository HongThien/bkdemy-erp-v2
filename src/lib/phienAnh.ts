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
