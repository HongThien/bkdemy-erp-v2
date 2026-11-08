// Ghi kết quả máy chấm (Claude Code) lên ERP dạng GỢI Ý — bảng nháp btvn_ai_*, CHƯA vào gami_grades.
// Đọc mọi thư mục trong cham_btvn_ai/ có ket_qua.json mà chưa có da_ghi.json.
// ket_qua.json: { thu_tu_anh: [id ảnh theo thứ tự trang], nhan_xet_chung: "…",
//                 cau: [{ problem_id, result: correct|partial|wrong, chac: bool, loai_loi: "", nhan_xet: "" }],
//                 xoay_anh: { "<id ảnh>": 0|90|180|270 } }   ← tuỳ chọn: góc (chiều kim đồng hồ) để ẢNH GỐC đứng đúng chiều
// Câu không có trên ảnh: KHÔNG đưa vào cau (thiếu = không dòng).
//   danh_dau: { "<id ảnh>": [dấu…] }  ← tuỳ chọn: dấu đỏ để vẽ BẢN CHẤM (định dạng ở ve.py); y trong từng câu = kết quả từng ý
// Sau khi ghi: điểm bài = fn_btvn_ai_diem (DB) ⇒ ve.py vẽ bản chấm đỏ + điểm ⇒ tải lên cham/ai-… ⇒ fn_btvn_ai_dat_anh_cham.
// Chạy: node scripts/btvn-ai/ghi.mjs [--env <file .env>] [--out <thư mục>] [--chi <chuỗi>] [--lai] [--thu]
//   --thu = chạy thử: ghi trong transaction rồi ROLLBACK, vẫn vẽ bản chấm ra máy để xem, không tải lên
//   --lai = ghi lại cả bài đã có da_ghi.json (lần chấm mới đè lần cũ trên app)
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { execFileSync } from 'child_process'
import { docEnv, ketNoi, voiNguoi, RULE_VERSION, MODEL } from './chung.mjs'

const env = docEnv()
const iOut = process.argv.indexOf('--out')
const OUT = iOut >= 0 ? process.argv[iOut + 1] : 'cham_btvn_ai'
const THU = process.argv.includes('--thu')
const iChi = process.argv.indexOf('--chi')
const CHI = iChi >= 0 ? process.argv[iChi + 1] : null // vd --chi _9A1_ : chỉ ghi bài có tên thư mục chứa chuỗi này
const LAI = process.argv.includes('--lai')
const KQ = new Set(['correct', 'partial', 'wrong'])

const c = await ketNoi(env)
let n = 0
for (const ten of readdirSync(OUT)) {
  if (CHI && !ten.includes(CHI)) continue
  const dir = join(OUT, ten)
  if (!existsSync(join(dir, 'de.json')) || !existsSync(join(dir, 'ket_qua.json')) || (!LAI && existsSync(join(dir, 'da_ghi.json')))) continue
  const de = JSON.parse(readFileSync(join(dir, 'de.json'), 'utf8'))
  const kq = JSON.parse(readFileSync(join(dir, 'ket_qua.json'), 'utf8'))
  const okPid = new Set(de.cau.map((x) => x.problem_id))
  const okAnh = new Set(de.anh.map((x) => x.id))
  const cau = (kq.cau ?? []).filter((x) => okPid.has(x.problem_id) && KQ.has(x.result))
  const bo = (kq.cau ?? []).length - cau.length
  const thuTu = (kq.thu_tu_anh ?? []).filter((id) => okAnh.has(id))
  const ghiLan = () => c.query(
    `select fn_btvn_ai_ghi($1,$2,$3,$4,$5,$6,$7::jsonb,null,null) id`,
    [de.buoi_hoc_id, de.hoc_sinh_id, MODEL, RULE_VERSION, kq.nhan_xet_chung ?? '',
     thuTu.length === de.anh.length ? thuTu : null, JSON.stringify(cau)]).then((r) => r.rows[0].id)
  const layDiem = async (lan) => (await c.query(`select fn_btvn_ai_diem($1) d`, [lan])).rows[0].d
  const ve = (diem) => JSON.parse(execFileSync('python', ['-X', 'utf8', join(import.meta.dirname, 've.py'), dir, String(diem)], { encoding: 'utf8' }))
  if (THU) {
    // ghi thử trong transaction rồi rollback — chỉ để lấy điểm DB tính, vẽ bản chấm xem trước
    await c.query('begin')
    let d
    try {
      await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: de.yeu_cau_boi, role: 'authenticated' })])
      d = await layDiem(await ghiLan())
    } finally { await c.query('rollback') }
    const ban = ve(d.diem)
    console.log(`  (thử) ${ten}: ${cau.length}/${de.cau.length} câu · ${d.so_y} ý · điểm ${d.diem} (thô ${d.tong_tho}) · vẽ ${Object.keys(ban).length} trang${bo ? `, bỏ ${bo} dòng sai định dạng` : ''}`)
    continue
  }
  const { lan, d } = await voiNguoi(c, de.yeu_cau_boi, async () => { const lan = await ghiLan(); return { lan, d: await layDiem(lan) } })
  // Góc xoay hiển thị (mig 202611081137) — chỉ đặt cho ảnh của bài này, góc hợp lệ
  const xoay = Object.entries(kq.xoay_anh ?? {}).filter(([id, g]) => okAnh.has(id) && [0, 90, 180, 270].includes(g))
  if (xoay.length) await voiNguoi(c, de.yeu_cau_boi, async () => { for (const [id, g] of xoay) await c.query(`select fn_btvn_anh_xoay($1, $2)`, [id, g]) })
  // Bản chấm đỏ + điểm (mig 202611081545) — không đè bản TA vẽ tay
  let soBan = 0
  if (env.url && env.service) {
    const ban = ve(d.diem)
    for (const [id, file] of Object.entries(ban)) {
      if (!okAnh.has(id)) continue
      const path = `cham/ai-${id}-${Date.now()}.jpg`
      const r = await fetch(`${env.url}/storage/v1/object/btvn-nop/${path}`, {
        method: 'POST', body: readFileSync(join(dir, file)),
        headers: { apikey: env.service, Authorization: `Bearer ${env.service}`, 'Content-Type': 'image/jpeg', 'x-upsert': 'false' } })
      if (!r.ok) throw new Error(`Tải bản chấm ${file} lỗi ${r.status}: ${await r.text()}`)
      if (await voiNguoi(c, de.yeu_cau_boi, async () => (await c.query(`select fn_btvn_ai_dat_anh_cham($1, $2) ok`, [id, path])).rows[0].ok)) soBan++
    }
  }
  writeFileSync(join(dir, 'da_ghi.json'), JSON.stringify({ lan_id: lan, luc: new Date().toISOString(), so_cau: cau.length, diem: d.diem, so_ban_cham: soBan }, null, 1))
  console.log(`  ✓ ${ten}: ${cau.length}/${de.cau.length} câu · điểm ${d.diem} · ${soBan} trang chấm đỏ → lần ${lan.slice(0, 8)}${bo ? ` (bỏ ${bo} dòng sai định dạng)` : ''}`)
  n++
}
console.log(THU ? 'Chạy thử xong, không ghi gì.' : `Đã ghi ${n} bài (chờ TA xác nhận trên app).`)
await c.end()
