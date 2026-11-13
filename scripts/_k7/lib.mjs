// Helper soạn form MCQ lớp 5 (tay + máy) — chỉ sinh JSON kq cho `mcq-sinh.mjs --verify/--ghi`.
export const S = 'C:/Users/Admin/AppData/Local/Temp/claude/f905597530a85c45/51e171c7-f497-4a83-9c66-5c227b8c3c0f/scratchpad'
import { readFileSync, writeFileSync } from 'node:fs'
export const pool = () => JSON.parse(readFileSync(`${S}/pool_k7.json`, 'utf8')).cau
export const grp = (f) => (c) => c.ma_dang_bai === f
export const nhom3 = (s) => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
export const soTrang = (s) => String(s).replace(/[^\d]/g, '')
// Ghép form: dung = chuỗi đúng; ds = [{text, rule, duong_sai}] ≥3 khác nhau; vị trí đúng xoay theo chỉ số để cân A–D
let rot = 0
export function form(ma_cau, dung, ds, viTri) {
  const uniq = []; const seen = new Set([dung])
  for (const d of ds) { if (!d || seen.has(d.text)) continue; if (uniq.some((u) => u.rule === d.rule)) continue; seen.add(d.text); uniq.push(d) }
  if (uniq.length < 3) return { ma_cau, bo: `không đủ 3 nhiễu khác nhau (${uniq.length})` }
  const ch = uniq.slice(0, 3).map((d) => ({ text: d.text, dung: false, rule: d.rule, duong_sai: d.duong_sai }))
  const k = viTri ?? rot++ % 4
  ch.splice(k, 0, { text: dung, dung: true })
  return { ma_cau, dap_an: 'ABCD'[k], lua_chon: ch }
}
export const luu = (ten, arr) => { writeFileSync(`${S}/${ten}.json`, JSON.stringify(arr)); console.log(ten, arr.length, 'bỏ', arr.filter((x) => x.bo).length) }
