// Ghi kết quả máy chấm (Claude Code) lên ERP dạng GỢI Ý — bảng nháp btvn_ai_*, CHƯA vào gami_grades.
// Đọc mọi thư mục trong cham_btvn_ai/ có ket_qua.json mà chưa có da_ghi.json.
// ket_qua.json: { thu_tu_anh: [id ảnh theo thứ tự trang], nhan_xet_chung: "…",
//                 cau: [{ problem_id, result: correct|partial|wrong, chac: bool, loai_loi: "", nhan_xet: "" }],
//                 xoay_anh: { "<id ảnh>": 0|90|180|270 } }   ← tuỳ chọn: góc (chiều kim đồng hồ) để ẢNH GỐC đứng đúng chiều
// Câu không có trên ảnh: KHÔNG đưa vào cau (thiếu = không dòng).
// Chạy: node scripts/btvn-ai/ghi.mjs [--env <file .env>] [--out <thư mục>] [--thu]   (--thu = chạy thử, rollback)
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { docEnv, ketNoi, voiNguoi, RULE_VERSION, MODEL } from './chung.mjs'

const env = docEnv()
const iOut = process.argv.indexOf('--out')
const OUT = iOut >= 0 ? process.argv[iOut + 1] : 'cham_btvn_ai'
const THU = process.argv.includes('--thu')
const KQ = new Set(['correct', 'partial', 'wrong'])

const c = await ketNoi(env)
let n = 0
for (const ten of readdirSync(OUT)) {
  const dir = join(OUT, ten)
  if (!existsSync(join(dir, 'de.json')) || !existsSync(join(dir, 'ket_qua.json')) || existsSync(join(dir, 'da_ghi.json'))) continue
  const de = JSON.parse(readFileSync(join(dir, 'de.json'), 'utf8'))
  const kq = JSON.parse(readFileSync(join(dir, 'ket_qua.json'), 'utf8'))
  const okPid = new Set(de.cau.map((x) => x.problem_id))
  const okAnh = new Set(de.anh.map((x) => x.id))
  const cau = (kq.cau ?? []).filter((x) => okPid.has(x.problem_id) && KQ.has(x.result))
  const bo = (kq.cau ?? []).length - cau.length
  const thuTu = (kq.thu_tu_anh ?? []).filter((id) => okAnh.has(id))
  if (THU) {
    console.log(`  (thử) ${ten}: ${cau.length}/${de.cau.length} câu${bo ? `, bỏ ${bo} dòng sai định dạng` : ''}`)
    continue
  }
  const lan = await voiNguoi(c, de.yeu_cau_boi, async () => (await c.query(
    `select fn_btvn_ai_ghi($1,$2,$3,$4,$5,$6,$7::jsonb,null,null) id`,
    [de.buoi_hoc_id, de.hoc_sinh_id, MODEL, RULE_VERSION, kq.nhan_xet_chung ?? '',
     thuTu.length === de.anh.length ? thuTu : null, JSON.stringify(cau)])).rows[0].id)
  // Góc xoay hiển thị (mig 202611081137) — chỉ đặt cho ảnh của bài này, góc hợp lệ
  const xoay = Object.entries(kq.xoay_anh ?? {}).filter(([id, g]) => okAnh.has(id) && [0, 90, 180, 270].includes(g))
  if (xoay.length) await voiNguoi(c, de.yeu_cau_boi, async () => { for (const [id, g] of xoay) await c.query(`select fn_btvn_anh_xoay($1, $2)`, [id, g]) })
  writeFileSync(join(dir, 'da_ghi.json'), JSON.stringify({ lan_id: lan, luc: new Date().toISOString(), so_cau: cau.length }, null, 1))
  console.log(`  ✓ ${ten}: ${cau.length}/${de.cau.length} câu → lần ${lan.slice(0, 8)}${bo ? ` (bỏ ${bo} dòng sai định dạng)` : ''}`)
  n++
}
console.log(THU ? 'Chạy thử xong, không ghi gì.' : `Đã ghi ${n} bài (chờ TA xác nhận trên app).`)
await c.end()
