// me4-kiem.mjs — BỘ KIỂM ĐÁP SỐ cho sách "250 bài toán chọn lọc lớp 4 (ME)". Gộp các tệp me4-kiem-cdNN.mjs (mỗi chuyên đề một tệp,
// mỗi tệp export `KIEM_CDNN = { '<ma_nguon>': () => [giá trị đáp số máy TỰ TÍNH TỪ ĐỀ, …] }`). Cùng giao diện k4T-kiem.mjs: ghi-lo gọi kiemDapSo(maNguon, dapAn).
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chuanDapAn } from '../k4T-kiem.mjs'
const dir = dirname(fileURLToPath(import.meta.url))
export const KIEM = {}
for (const f of readdirSync(dir).filter((x) => /^me4-kiem-cd\d+\.mjs$/.test(x)).sort()) {
  const m = await import(pathToFileURL(join(dir, f)).href)
  for (const k of Object.keys(m)) if (k.startsWith('KIEM_')) Object.assign(KIEM, m[k])
}
export { chuanDapAn }
export function kiemDapSo(maNguon, dapAn) {
  const f = KIEM[maNguon]
  if (!f) return { ket_qua: 'khong_kiem_duoc', ghi_chu: 'chưa có hàm kiểm cho câu này' }
  let can
  try { can = f() } catch (e) { return { ket_qua: 'khong_dat', ghi_chu: `hàm kiểm lỗi: ${e.message}` } }
  const da = chuanDapAn(dapAn)
  const thieu = can.filter((v) => !da.includes(chuanDapAn(v)))
  return thieu.length
    ? { ket_qua: 'khong_dat', ghi_chu: `máy tính ra ${can.join(' ; ')} — đáp án thiếu/khác: ${thieu.join(' ; ')}` }
    : { ket_qua: 'dat', ghi_chu: `máy tự tính lại từ đề: ${can.join(' ; ')}` }
}
