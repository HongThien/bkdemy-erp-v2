// ============================================================================
// cau-hinh.mjs — cấu hình THEO MÁY của dây chuyền kho (spec-luong-kho.md §5.2, V3-5).
//
// Gốc folder nguồn KHÔNG viết cứng trong script: máy công ty là `E:\BK ACADEMY`,
// máy khác là ổ Drive streaming `G:\Other computers\My Computer\BK ACADEMY`.
// Thứ tự lấy: biến môi trường → .env.local → .env → dò các vị trí đã biết.
//
//   KHO_NGUON_GOC   gốc folder tài liệu (chỉ ĐỌC)
//   KHO_LAM_VIEC    thư mục làm việc trên đĩa LOCAL (bộ đệm, dựng lại được từ file gốc)
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { homedir } from 'node:os'

export const GOC_REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

const VI_TRI_DA_BIET = [
  'E:/BK ACADEMY',
  'G:/Other computers/My Computer/BK ACADEMY',
]

// Tách theo dòng + indexOf('=') — KHÔNG dùng regex có `\s`: heredoc Git Bash trên máy này
// nuốt dấu gạch chéo ngược, `\s` thành `s` và chuỗi kết nối bị cắt đuôi (DEVLOG 28/09).
export function docEnv(tep) {
  const kq = {}
  let txt
  try { txt = readFileSync(tep, 'utf8') } catch { return kq }
  for (const dong of txt.split(/\r?\n/)) {
    const d = dong.trim()
    if (!d || d.startsWith('#')) continue
    const i = d.indexOf('=')
    if (i <= 0) continue
    kq[d.slice(0, i).trim()] = d.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  }
  return kq
}

export function bien(ten, goc = GOC_REPO) {
  if (process.env[ten]) return { gia_tri: process.env[ten], nguon: 'biến môi trường' }
  for (const tep of ['.env.local', '.env']) {
    const v = docEnv(join(goc, tep))[ten]
    if (v) return { gia_tri: v, nguon: tep }
  }
  return null
}

export function gocNguon() {
  const b = bien('KHO_NGUON_GOC')
  if (b) {
    if (!existsSync(b.gia_tri)) throw new Error(`KHO_NGUON_GOC (${b.nguon}) trỏ tới "${b.gia_tri}" nhưng thư mục không tồn tại.`)
    return { duong_dan: b.gia_tri, nguon: b.nguon }
  }
  for (const p of VI_TRI_DA_BIET) if (existsSync(p)) return { duong_dan: p, nguon: 'dò vị trí đã biết' }
  throw new Error(`Không tìm thấy folder nguồn. Đặt KHO_NGUON_GOC trong .env.local. Đã dò: ${VI_TRI_DA_BIET.join(' · ')}`)
}

export function thuMucLamViec() {
  const b = bien('KHO_LAM_VIEC')
  return b ? { duong_dan: b.gia_tri, nguon: b.nguon } : { duong_dan: join(homedir(), 'bk-kho-lam-viec'), nguon: 'mặc định' }
}

// Dò dữ liệu: ưu tiên role chỉ-đọc. Rơi về role ghi thì BÁO RÕ để người chạy biết rào đang là lời hứa.
export function chuoiKetNoiDoc() {
  const ro = bien('DATABASE_URL_RO')
  if (ro) return { url: ro.gia_tri, chi_doc: true, nguon: ro.nguon }
  const rw = bien('DATABASE_URL')
  if (rw) return { url: rw.gia_tri, chi_doc: false, nguon: rw.nguon }
  throw new Error('Không có DATABASE_URL_RO / DATABASE_URL.')
}
